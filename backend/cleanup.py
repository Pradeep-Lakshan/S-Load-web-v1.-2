"""
Temporary file cleanup job to prevent disk bloat.
Runs periodically and cleans up files older than 10 minutes.
"""

import os
import time
import logging

logger = logging.getLogger("cleanup")
TEMP_DIR = os.getenv("TEMP_DIR", "/tmp/vortxfetch_media")
MAX_FILE_AGE_SECONDS = 600  # 10 minutes

def clean_old_temp_files():
    """Scan temp directory and remove files older than threshold."""
    if not os.path.exists(TEMP_DIR):
        return

    now = time.time()
    count = 0
    for root, _, files in os.walk(TEMP_DIR):
        for f in files:
            path = os.path.join(root, f)
            try:
                stat = os.stat(path)
                if now - stat.st_mtime > MAX_FILE_AGE_SECONDS:
                    os.remove(path)
                    count += 1
            except Exception as e:
                logger.warning(f"Could not remove stale file {path}: {e}")
                
    if count > 0:
        logger.info(f"Cleaned up {count} expired temporary media files.")
