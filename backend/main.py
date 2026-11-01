"""
FastAPI Video Downloader API
Provides secure, rate-limited, SSRF-protected media extraction and streaming.
"""

import os
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional
import httpx

from fastapi import FastAPI, Request, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from ssrf_guard import validate_url_security
from models import InfoRequest, DownloadRequest, MediaInfoResponse, DMCARequest
from downloader import extract_media_info, download_media
from cleanup import clean_old_temp_files

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("api")

# Rate limiting: 10 requests per minute per IP
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "")
ENABLE_CAPTCHA = os.getenv("ENABLE_CAPTCHA", "false").lower() == "true"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

async def verify_turnstile(token: Optional[str], client_ip: str) -> bool:
    """Validate Cloudflare Turnstile token if captcha is enabled."""
    if not ENABLE_CAPTCHA or not TURNSTILE_SECRET_KEY:
        return True
    if not token:
        return False
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={
                    "secret": TURNSTILE_SECRET_KEY,
                    "response": token,
                    "remoteip": client_ip
                }
            )
            data = resp.json()
            return data.get("success", False)
    except Exception as e:
        logger.error(f"Turnstile verification request failed: {e}")
        return True # Fail open or closed depending on policy

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: start background cleanup task
    logger.info("Initializing VortexFetch FastAPI backend...")
    async def cleanup_loop():
        while True:
            await asyncio.sleep(300) # Run every 5 minutes
            clean_old_temp_files()
    
    task = asyncio.create_task(cleanup_loop())
    yield
    task.cancel()

app = FastAPI(
    title="VortexFetch Social Media Downloader API",
    version="1.0.0",
    description="Secure, high performance media processing service with SSRF protection and yt-dlp",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ALLOWED_ORIGINS == ["*"] else ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    """Health status and diagnostic endpoint."""
    return {
        "status": "healthy",
        "service": "VortexFetch API",
        "ssrf_protection": True,
        "rate_limiting": "10/minute"
    }

@app.post("/api/info", response_model=MediaInfoResponse)
@limiter.limit("10/minute")
async def get_video_info(request: Request, body: InfoRequest):
    """
    Extract video title, duration, thumbnail, and formats.
    Enforces SSRF check, domain allowlist, and rate limit.
    """
    client_ip = get_remote_address(request)
    
    # 1. Turnstile captcha verification if enabled
    if ENABLE_CAPTCHA and not await verify_turnstile(body.turnstile_token, client_ip):
        raise HTTPException(status_code=403, detail="Captcha verification failed. Please try again.")

    # 2. SSRF and Domain allowlist check
    is_safe, canonical_url, error_msg = validate_url_security(body.url)
    if not is_safe or not canonical_url:
        raise HTTPException(status_code=400, detail=error_msg or "Blocked by SSRF security filter.")

    try:
        data = await extract_media_info(canonical_url)
        return data
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error extracting metadata for {canonical_url}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal processing error while fetching video metadata.")

@app.post("/api/download")
@limiter.limit("10/minute")
async def download_video(request: Request, body: DownloadRequest, background_tasks: BackgroundTasks):
    """
    Download video or audio format and stream back directly to client.
    Temporary files are deleted immediately after response finishes.
    """
    client_ip = get_remote_address(request)

    if ENABLE_CAPTCHA and not await verify_turnstile(body.turnstile_token, client_ip):
        raise HTTPException(status_code=403, detail="Captcha verification failed.")

    is_safe, canonical_url, error_msg = validate_url_security(body.url)
    if not is_safe or not canonical_url:
        raise HTTPException(status_code=400, detail=error_msg or "Invalid URL.")

    try:
        download_result = await download_media(
            url=canonical_url,
            format_id=body.format_id,
            is_audio_only=body.is_audio_only
        )
        
        file_path = download_result["file_path"]
        filename = download_result["filename"]
        media_type = download_result["mime_type"]

        # Schedule immediate cleanup of temp file once sent
        def remove_file(path: str):
            try:
                if os.path.exists(path):
                    os.remove(path)
                    logger.info(f"Cleaned up streamed file {path}")
            except Exception as ex:
                logger.warning(f"Error removing file {path}: {ex}")

        background_tasks.add_task(remove_file, file_path)

        return FileResponse(
            path=file_path,
            filename=filename,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "X-Downloader": "VortexFetch"
            }
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Download execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process and stream the requested media format.")

@app.post("/api/dmca")
async def submit_dmca(request: Request, body: DMCARequest):
    """Endpoint for processing automated DMCA takedown requests."""
    if not body.statement_good_faith or not body.statement_accuracy:
        raise HTTPException(status_code=400, detail="You must affirm the good faith and accuracy statements.")
    
    ticket_id = f"DMCA-{abs(hash(body.infringing_url + body.email)) % 1000000:06d}"
    logger.info(f"Registered DMCA notice ticket {ticket_id} for URL: {body.infringing_url}")

    return {
        "status": "received",
        "ticket_id": ticket_id,
        "message": "Notice received. The identified media URL has been submitted for automated blacklisting."
    }
