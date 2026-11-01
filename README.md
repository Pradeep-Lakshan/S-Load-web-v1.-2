# VortexFetch - Social Media Video & Audio Downloader

High-speed, privacy-first social media video and audio downloader with zero ads, zero malware redirects, and an ephemeral streaming pipeline.

Supported Platforms: **YouTube**, **TikTok**, **Instagram**, **X (Twitter)**, **Facebook**, **Reddit**, and **Vimeo**.

---

## 🚀 Key Features

- **Single-Click Extraction**: Paste any video link, inspect available resolutions (1080p Full HD, 720p, 480p, 360p), or extract crystal-clear 320kbps MP3 audio.
- **SSRF Hardened**: Multi-layered IP and domain security. Strictly rejects loopback (`127.0.0.1`), private RFC1918 networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and Cloud metadata addresses (`169.254.169.254`).
- **Direct Ephemeral Streaming**: Media streams directly to the client browser. No video or audio files are permanently archived on server storage. Intermediate temp files are removed immediately upon stream completion.
- **Rate Limited**: Sliding-window rate limiter (10 requests/minute per IP) prevents bot abuse.
- **Auto-Updating yt-dlp**: Automated daily cron script keeps upstream platform parsers fresh against website changes.
- **Dedicated SEO Platform Landers**: Dedicated platform sub-pages (`/tiktok-downloader`, `/youtube-downloader`, etc.) with tailored metadata and instructions.
- **Legal Compliance**: Complete Terms of Service, Privacy Policy (Zero-retention), and automated DMCA takedown intake with unique confirmation tickets.

---

## 🛠 Tech Stack

- **Frontend**: Next.js / React 19 + TypeScript + Tailwind CSS (Mobile-First, Dark Cyber-Minimalist UX)
- **Backend**: FastAPI (Python 3.11) + `yt-dlp` library + `FFmpeg` for multiplexing video/audio tracks
- **Server/Proxy**: Express & Node.js for integrated environments, Uvicorn for Python production
- **Containerization**: Docker, Multi-Stage Dockerfiles, and `docker-compose.yml`

---

## 📁 Project Structure

```text
├── backend/
│   ├── main.py              # FastAPI application & API routes
│   ├── ssrf_guard.py        # SSRF checks, DNS validation & domain allowlist
│   ├── downloader.py        # yt-dlp executor, ffmpeg transcode & sanitization
│   ├── cleanup.py           # Temporary media cleaner job
│   ├── models.py            # Pydantic schemas (InfoRequest, DownloadRequest)
│   ├── cron_yt_dlp.sh       # Daily yt-dlp updater & worker reload script
│   ├── Dockerfile           # Python 3.11-slim + FFmpeg image
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── components/
│   │   ├── Header.tsx               # Navigation & security indicators
│   │   ├── DownloaderHero.tsx       # Input bar, auto-detect & sample badges
│   │   ├── MediaResultCard.tsx      # Formats selector & streaming downloader
│   │   ├── PlatformLandingPage.tsx  # Platform-specific SEO pages
│   │   ├── FeaturesSection.tsx      # System architecture highlights
│   │   ├── FAQSection.tsx           # Knowledge base & FAQs
│   │   ├── LegalPages.tsx           # Terms, Privacy & interactive DMCA
│   │   └── Footer.tsx               # Legal links & platform directory
│   ├── constants/
│   │   └── platforms.ts     # Platform configs, SEO tags & sample URLs
│   ├── types.ts             # TypeScript definitions
│   ├── App.tsx              # Root React state & view router
│   └── main.tsx             # Entry point
├── docker-compose.yml       # Production multi-service orchestration
├── Dockerfile               # Production web frontend container
├── server.ts                # Express fullstack server with Vite middleware
├── .env.example             # Environment variable template
└── README.md                # Deployment and operations manual
```

---

## 💻 Local Development Setup

### Option 1: Full-Stack Dev (Fastest)

Run both the frontend and API simulation directly via Node:

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

### Option 2: Running with Python FastAPI Backend

To run the Python backend alongside the frontend:

```bash
# 1. Setup Python virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# 2. Install Python requirements & FFmpeg
pip install -r requirements.txt
# Ensure ffmpeg is installed: (sudo apt install ffmpeg OR brew install ffmpeg)

# 3. Launch FastAPI backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

In another terminal:

```bash
# Point frontend to Python backend
export BACKEND_URL=http://localhost:8000
npm run dev
```

---

## 🐳 Docker Compose Deployment (Recommended)

To deploy both frontend and backend services in production containers:

```bash
# 1. Clone repository
git clone https://github.com/your-username/vortxfetch.git
cd vortxfetch

# 2. Configure environment
cp .env.example .env

# 3. Build and launch containers in background
docker compose up -d --build

# 4. View logs
docker compose logs -f
```

The web service is available on port `3000` and the backend on port `8000`.

---

## 🌐 Production VPS Deployment (Ubuntu 22.04 / 24.04)

### Step 1: Install System Prerequisites

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ffmpeg nginx certbot python3-certbot-nginx docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### Step 2: Clone and Run with Docker

```bash
sudo mkdir -p /opt/vortxfetch
cd /opt/vortxfetch
git clone https://github.com/your-username/vortxfetch.git .
cp .env.example .env

# Start Docker containers
docker compose up -d --build
```

### Step 3: Configure Nginx as Reverse Proxy

Create an Nginx server block at `/etc/nginx/sites-available/downloader`:

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 500M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and obtain free Let's Encrypt SSL:

```bash
sudo ln -s /etc/nginx/sites-available/downloader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obtain SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 4: Setup Daily yt-dlp Auto-Update

Add the updater cron job to your crontab:

```bash
crontab -e
# Add the following line to update yt-dlp daily at 4:00 AM:
0 4 * * * docker exec vortxfetch-backend /app/cron_yt_dlp.sh >> /var/log/yt-dlp-update.log 2>&1
```

---

## 🔒 Security Specifications

| Mechanism | Implementation Details |
|---|---|
| **SSRF Prevention** | Disallows all private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`, `::1`). Verifies domain against an explicit allowlist and resolves DNS before processing. |
| **Rate Limiting** | 10 requests per minute per IP address. Returns `HTTP 429` with `Retry-After` header. |
| **Input Sanitization** | Filenames are stripped of path traversal characters (`..`, `/`, `\`) and non-printable bytes. |
| **Ephemeral Filesystem** | Downloads are piped directly. Any temporary fragments on disk are purged after response dispatch or by the 10-minute automated vacuum. |
| **Captcha Shield** | Optional Cloudflare Turnstile token validation to mitigate scraping bots. |

---

## ⚖️ Legal Disclaimer

VortexFetch is an open-source technical tool developed for educational, archival, and fair-use purposes. All trademarks, logos, and brand names are the property of their respective owners. VortexFetch does not host, store, or license copyrighted content.
