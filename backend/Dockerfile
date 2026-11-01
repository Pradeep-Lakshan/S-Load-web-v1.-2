# ==============================================================================
# VortexFetch FastAPI Backend Dockerfile
# Python 3.11 + FFmpeg for media parsing and audio transcoding
# ==============================================================================

FROM python:3.11-slim

# Prevent python from buffering stdout/stderr and writing pyc files
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive \
    TEMP_DIR=/tmp/vortxfetch_media \
    PORT=8000

# Install system dependencies: ffmpeg (for video/audio merge), curl, cron
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    cron \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency specifications
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Ensure temp directory exists with proper write permissions
RUN mkdir -p /tmp/vortxfetch_media && chmod -R 777 /tmp/vortxfetch_media
RUN chmod +x /app/cron_yt_dlp.sh

# Register daily yt-dlp auto-update cron job
RUN echo "0 4 * * * /app/cron_yt_dlp.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/yt-dlp-cron && \
    chmod 0644 /etc/cron.d/yt-dlp-cron && \
    crontab /etc/cron.d/yt-dlp-cron

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start cron daemon and run uvicorn server
CMD cron && uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
