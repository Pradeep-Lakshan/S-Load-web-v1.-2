"""
Pydantic schemas for request and response validation.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class InfoRequest(BaseModel):
    url: str = Field(..., description="Target social media video URL")
    turnstile_token: Optional[str] = Field(None, description="Cloudflare Turnstile captcha token")

class FormatOption(BaseModel):
    format_id: str
    ext: str
    resolution: str
    filesize_bytes: Optional[int] = None
    filesize_str: str
    format_note: Optional[str] = None
    vcodec: Optional[str] = None
    acodec: Optional[str] = None
    is_audio_only: bool = False
    quality_label: str
    has_audio: bool = True

class MediaInfoResponse(BaseModel):
    id: str
    title: str
    webpage_url: str
    thumbnail: Optional[str] = None
    duration_seconds: Optional[int] = None
    duration_formatted: str
    uploader: Optional[str] = None
    platform: str
    formats: List[FormatOption]

class DownloadRequest(BaseModel):
    url: str
    format_id: str
    is_audio_only: bool = False
    audio_format: Optional[str] = "mp3"
    turnstile_token: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: str

class DMCARequest(BaseModel):
    full_name: str
    email: str
    company_or_owner: str
    infringing_url: str
    original_work_url: str
    statement_good_faith: bool
    statement_accuracy: bool
