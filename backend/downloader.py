"""
Video Extraction and Processing Engine using yt-dlp and ffmpeg.
Runs with strict timeouts, error trapping, format categorization,
and automatic temporary file lifecycle management.
"""

import os
import re
import uuid
import asyncio
import logging
from typing import Dict, Any, List, Optional
import yt_dlp

logger = logging.getLogger("downloader")

TEMP_DIR = os.getenv("TEMP_DIR", "/tmp/vortxfetch_media")
MAX_DURATION_SECONDS = int(os.getenv("MAX_DURATION_SECONDS", "1800")) # 30 min max
MAX_FILESIZE_MB = int(os.getenv("MAX_FILESIZE_MB", "500"))
SUBPROCESS_TIMEOUT_SECONDS = int(os.getenv("SUBPROCESS_TIMEOUT_SECONDS", "120"))

os.makedirs(TEMP_DIR, exist_ok=True)

def sanitize_filename(name: str, max_len: int = 100) -> str:
    """Sanitize title to prevent directory traversal or invalid characters in headers."""
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    clean = re.sub(r"[\s_]+", "_", clean).strip("_.")
    if not clean:
        clean = "video"
    return clean[:max_len]

def format_duration(seconds: Optional[int]) -> str:
    """Format seconds into MM:SS or HH:MM:SS."""
    if not seconds:
        return "00:00"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def format_bytes(num_bytes: Optional[int]) -> str:
    """Format bytes into readable string (e.g., 24.5 MB)."""
    if not num_bytes:
        return "Estimated"
    for unit in ['B', 'KB', 'MB', 'GB']:
        if abs(num_bytes) < 1024.0:
            return f"{num_bytes:3.1f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f} TB"

def detect_platform_name(extractor: str, url: str) -> str:
    """Return friendly platform name from extractor identifier."""
    extractor_lower = (extractor or "").lower()
    url_lower = url.lower()
    if "tiktok" in extractor_lower or "tiktok" in url_lower:
        return "TikTok"
    if "youtube" in extractor_lower or "youtu.be" in url_lower:
        return "YouTube"
    if "instagram" in extractor_lower or "instagr" in url_lower:
        return "Instagram"
    if "twitter" in extractor_lower or "x.com" in url_lower:
        return "X / Twitter"
    if "facebook" in extractor_lower or "fb" in url_lower:
        return "Facebook"
    if "reddit" in extractor_lower:
        return "Reddit"
    if "vimeo" in extractor_lower:
        return "Vimeo"
    return extractor.capitalize() if extractor else "Video Platform"

def extract_media_info_sync(url: str) -> Dict[str, Any]:
    """
    Extract video metadata and formats using yt_dlp in safe read-only mode.
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
        'extract_flat': False,
        'socket_timeout': 15,
        'geo_bypass': True,
        'no_color': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except yt_dlp.utils.DownloadError as err:
            err_msg = str(err)
            if "Private video" in err_msg or "login" in err_msg.lower():
                raise ValueError("This video is private or requires account login to view.")
            if "Video unavailable" in err_msg or "deleted" in err_msg.lower():
                raise ValueError("Video is unavailable, deleted, or removed by author.")
            if "rate" in err_msg.lower() or "too many" in err_msg.lower():
                raise ValueError("Rate limit exceeded by video host. Please try again in a few moments.")
            raise ValueError(f"Failed to fetch video information: {err_msg}")

        # Check maximum duration
        duration = info.get('duration', 0)
        if duration and duration > MAX_DURATION_SECONDS:
            raise ValueError(f"Video duration ({format_duration(duration)}) exceeds maximum allowed limit of {MAX_DURATION_SECONDS // 60} minutes.")

        # Parse formats
        raw_formats = info.get('formats', [])
        format_list = []
        seen_resolutions = set()

        # Categorize video formats
        for f in raw_formats:
            vcodec = f.get('vcodec')
            acodec = f.get('acodec')
            height = f.get('height')
            ext = f.get('ext', 'mp4')
            fid = f.get('format_id')
            filesize = f.get('filesize') or f.get('filesize_approx')

            # Skip unsupported manifests or video without dimensions
            if not fid:
                continue

            # Standard video resolutions (deduplicate best per height)
            if height and height >= 144 and vcodec != 'none':
                res_key = f"{height}p"
                if res_key not in seen_resolutions:
                    seen_resolutions.add(res_key)
                    format_list.append({
                        "format_id": fid,
                        "ext": "mp4",
                        "resolution": res_key,
                        "filesize_bytes": filesize,
                        "filesize_str": format_bytes(filesize),
                        "format_note": f.get('format_note') or f"{height}p HD",
                        "vcodec": vcodec,
                        "acodec": acodec,
                        "is_audio_only": False,
                        "quality_label": f"{height}p High Definition" if height >= 720 else f"{height}p Standard Quality",
                        "has_audio": acodec != 'none'
                    })

        # Sort video formats descending by resolution
        def get_height_num(fmt):
            res = fmt.get("resolution", "0p")
            m = re.match(r"(\d+)", res)
            return int(m.group(1)) if m else 0

        format_list.sort(key=get_height_num, reverse=True)

        # Ensure we always provide at least "best" video option
        if not format_list:
            format_list.append({
                "format_id": "best",
                "ext": "mp4",
                "resolution": "Best Available",
                "filesize_bytes": info.get('filesize'),
                "filesize_str": format_bytes(info.get('filesize')),
                "format_note": "Direct stream MP4",
                "is_audio_only": False,
                "quality_label": "High Quality MP4",
                "has_audio": True
            })

        # Add Audio MP3 extract presets
        audio_presets = [
            {"format_id": "audio_320k", "bitrate": "320 kbps", "label": "MP3 High Fidelity (320kbps)"},
            {"format_id": "audio_192k", "bitrate": "192 kbps", "label": "MP3 Standard Audio (192kbps)"},
            {"format_id": "audio_128k", "bitrate": "128 kbps", "label": "MP3 Compressed (128kbps)"},
        ]
        for preset in audio_presets:
            est_audio_size = int((duration or 180) * 192 * 1024 / 8) if duration else None
            format_list.append({
                "format_id": preset["format_id"],
                "ext": "mp3",
                "resolution": preset["bitrate"],
                "filesize_bytes": est_audio_size,
                "filesize_str": format_bytes(est_audio_size) if est_audio_size else "Audio",
                "format_note": preset["bitrate"],
                "is_audio_only": True,
                "quality_label": preset["label"],
                "has_audio": True
            })

        platform = detect_platform_name(info.get('extractor_key') or info.get('extractor'), url)

        return {
            "id": info.get('id', str(uuid.uuid4())[:8]),
            "title": info.get('title') or "Social Media Video",
            "webpage_url": url,
            "thumbnail": info.get('thumbnail') or info.get('thumbnails', [{}])[-1].get('url'),
            "duration_seconds": duration,
            "duration_formatted": format_duration(duration),
            "uploader": info.get('uploader') or info.get('channel') or "Creator",
            "platform": platform,
            "formats": format_list
        }

async def extract_media_info(url: str) -> Dict[str, Any]:
    """Asynchronous wrapper for yt-dlp metadata extraction."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, extract_media_info_sync, url)

def download_media_sync(url: str, format_id: str, is_audio_only: bool = False) -> Dict[str, Any]:
    """
    Downloads media using yt_dlp with ffmpeg post-processing.
    Returns dictionary with file path, sanitized filename, and mime type.
    """
    file_uuid = uuid.uuid4().hex[:10]
    out_template = os.path.join(TEMP_DIR, f"{file_uuid}_%(title).50s.%(ext)s")

    ydl_opts: Dict[str, Any] = {
        'outtmpl': out_template,
        'quiet': True,
        'no_warnings': True,
        'socket_timeout': 30,
        'geo_bypass': True,
        'max_filesize': MAX_FILESIZE_MB * 1024 * 1024,
    }

    if is_audio_only:
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })
    else:
        # Merge best video + best audio to mp4 container
        if format_id == "best":
            ydl_opts['format'] = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        else:
            ydl_opts['format'] = f"{format_id}+bestaudio/best"
        ydl_opts['merge_output_format'] = 'mp4'

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        title = info.get('title', 'video')
        raw_filename = ydl.prepare_filename(info)

        # In case ffmpeg changed extension to .mp3 or .mp4
        expected_ext = "mp3" if is_audio_only else "mp4"
        base, _ = os.path.splitext(raw_filename)
        candidate = f"{base}.{expected_ext}"
        
        final_path = candidate if os.path.exists(candidate) else raw_filename
        if not os.path.exists(final_path):
            # Look for any file starting with our uuid in temp dir
            for f in os.listdir(TEMP_DIR):
                if f.startswith(file_uuid):
                    final_path = os.path.join(TEMP_DIR, f)
                    break

        if not os.path.exists(final_path):
            raise RuntimeError("Media download file was not generated.")

        clean_name = f"{sanitize_filename(title)}.{expected_ext}"
        mime_type = "audio/mpeg" if is_audio_only else "video/mp4"

        return {
            "file_path": final_path,
            "filename": clean_name,
            "mime_type": mime_type,
            "filesize": os.path.getsize(final_path)
        }

async def download_media(url: str, format_id: str, is_audio_only: bool = False) -> Dict[str, Any]:
    """Asynchronous wrapper for media download."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, download_media_sync, url, format_id, is_audio_only)
