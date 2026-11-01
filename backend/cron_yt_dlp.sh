#!/usr/bin/env bash
# ==============================================================================
# Daily yt-dlp Auto-Updater & Worker Restarter Script
# Ensures latest platform extraction parsers are maintained against upstream changes.
# Add to crontab:
# 0 4 * * * /opt/vortxfetch/backend/cron_yt_dlp.sh >> /var/log/yt-dlp-update.log 2>&1
# ==============================================================================

set -euo pipefail

TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
echo "[$TIMESTAMP] Starting scheduled daily yt-dlp update..."

# Check if inside virtualenv or system python
if [ -d "/venv" ]; then
    PYTHON_CMD="/venv/bin/python"
    PIP_CMD="/venv/bin/pip"
elif command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
else
    PIP_CMD="pip"
fi

echo "[$TIMESTAMP] Updating yt-dlp using $PIP_CMD..."
$PIP_CMD install --upgrade yt-dlp

NEW_VERSION=$($PIP_CMD show yt-dlp | grep Version || true)
echo "[$TIMESTAMP] yt-dlp update completed: $NEW_VERSION"

# Gracefully restart application worker / service
if command -v systemctl &> /dev/null && systemctl is-active --quiet vortxfetch-backend; then
    echo "[$TIMESTAMP] Reloading systemd service 'vortxfetch-backend'..."
    systemctl restart vortxfetch-backend
elif [ -n "${DOCKER_CONTAINER:-}" ] || [ -f "/.dockerenv" ]; then
    echo "[$TIMESTAMP] Running inside container: yt-dlp is updated in-place without restarting container."
else
    # In case uvicorn process is managed by PM2 or supervisor
    if command -v pm2 &> /dev/null; then
        pm2 reload vortxfetch-backend || true
    fi
fi

echo "[$TIMESTAMP] Update process finished successfully."
