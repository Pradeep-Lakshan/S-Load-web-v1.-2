import { PlatformConfig } from '../types';

export const PLATFORMS: Record<string, PlatformConfig> = {
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    slug: 'tiktok-downloader',
    domain: 'tiktok.com',
    accentColor: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
    sampleUrl: 'https://www.tiktok.com/@tiktok/video/7123456789012345678',
    tagline: 'Download TikTok Videos Without Watermark in HD',
    seoTitle: 'TikTok Video Downloader (No Watermark) - VortexFetch',
    seoDescription: 'Download high quality TikTok videos without watermark in MP4 and MP3 audio instantly. Clean, free, and fast.',
    steps: [
      { title: 'Copy TikTok Link', desc: 'Open TikTok, tap Share on any video, and choose "Copy Link".' },
      { title: 'Paste in VortexFetch', desc: 'Paste the link in the input box above and click Download.' },
      { title: 'Save MP4 or MP3', desc: 'Select watermark-free HD MP4 or extract crystal clear MP3 audio.' }
    ],
    features: ['Zero Watermarks', '1080p Full HD Video', 'Direct MP3 Audio Extraction', 'Lightning Fast']
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    slug: 'youtube-downloader',
    domain: 'youtube.com',
    accentColor: 'text-red-400',
    badgeBg: 'bg-red-500/10 border-red-500/20 text-red-300',
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tagline: 'Save YouTube Videos in 1080p, 720p or MP3 Audio',
    seoTitle: 'YouTube Video & MP3 Downloader - VortexFetch',
    seoDescription: 'Download YouTube videos in 1080p, 720p, 480p and high bitrate 320kbps MP3 audio with no ads or popups.',
    steps: [
      { title: 'Copy YouTube URL', desc: 'Copy the URL from your browser address bar or the YouTube app share menu.' },
      { title: 'Inspect Available Formats', desc: 'Paste the link to preview resolutions from 360p up to 1080p 60fps.' },
      { title: 'Stream & Download', desc: 'Download with one click directly to your device.' }
    ],
    features: ['1080p 60fps Support', '320kbps MP3 Conversion', 'Shorts & Regular Videos', 'No Video Duration Stutter']
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    slug: 'instagram-downloader',
    domain: 'instagram.com',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    sampleUrl: 'https://www.instagram.com/reel/C3bXyZ1o9AB/',
    tagline: 'Download Instagram Reels, Stories & Video Posts',
    seoTitle: 'Instagram Reel & Video Downloader - VortexFetch',
    seoDescription: 'Download Instagram Reels and videos in original high definition MP4 format directly to your phone or desktop.',
    steps: [
      { title: 'Copy Instagram Reel Link', desc: 'Tap the three dots on the Instagram post or reel and tap "Copy Link".' },
      { title: 'Paste into VortexFetch', desc: 'Insert the reel link into the search bar.' },
      { title: 'Download Original MP4', desc: 'Download the source MP4 file with crisp original audio.' }
    ],
    features: ['Reels & Video Posts', 'Original Audio Sync', 'Mobile-First Friendly', 'No App Install Needed']
  },
  twitter: {
    id: 'twitter',
    name: 'X / Twitter',
    slug: 'twitter-downloader',
    domain: 'x.com',
    accentColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
    sampleUrl: 'https://x.com/Twitter/status/1750000000000000000',
    tagline: 'Download High Quality Video Clips from X & Twitter',
    seoTitle: 'X / Twitter Video Downloader - VortexFetch',
    seoDescription: 'Fast, free Twitter & X video downloader. Convert tweets with video into MP4 files in seconds.',
    steps: [
      { title: 'Copy Post URL', desc: 'Click the share icon beneath any X/Twitter post and select "Copy Link".' },
      { title: 'Fetch Available Bitrates', desc: 'Paste the link to analyze available video bitrates.' },
      { title: 'Download Video', desc: 'Pick your preferred MP4 resolution and save immediately.' }
    ],
    features: ['Highest Bitrate Priority', 'GIF to MP4 Support', 'Fast Twitter Parser', 'Safe & Anonymous']
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    slug: 'facebook-downloader',
    domain: 'facebook.com',
    accentColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    sampleUrl: 'https://www.facebook.com/watch/?v=123456789012345',
    tagline: 'Download Facebook Watch & Reels in HD',
    seoTitle: 'Facebook Video Downloader - VortexFetch',
    seoDescription: 'Download public Facebook videos and reels in 1080p HD or SD format easily on iOS, Android, and PC.',
    steps: [
      { title: 'Copy Facebook Video Link', desc: 'Click Share > Copy Link on any public Facebook video or reel.' },
      { title: 'Process with VortexFetch', desc: 'Paste into the download input.' },
      { title: 'Save High Quality MP4', desc: 'Choose HD or SD quality to save to your local drive.' }
    ],
    features: ['Public Watch & Reels', '1080p HD Quality', 'Fast Streaming Delivery', 'Zero Software Installation']
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    slug: 'reddit-downloader',
    domain: 'reddit.com',
    accentColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    sampleUrl: 'https://www.reddit.com/r/videos/comments/123456/sample_video/',
    tagline: 'Download Reddit Videos with Merged Audio',
    seoTitle: 'Reddit Video Downloader with Audio - VortexFetch',
    seoDescription: 'Download v.redd.it videos with audio merged automatically into a complete, playable MP4 file.',
    steps: [
      { title: 'Copy Reddit Post', desc: 'Copy the link to any Reddit post containing a video.' },
      { title: 'Automatic Audio Merge', desc: 'Our engine pairs separate video and audio tracks via ffmpeg.' },
      { title: 'Download Full MP4', desc: 'Save the finished MP4 video file with synced stereo sound.' }
    ],
    features: ['Automatic Audio Merging', 'v.redd.it & Crossposts', 'High Definition Output', 'No Muted Videos']
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    slug: 'vimeo-downloader',
    domain: 'vimeo.com',
    accentColor: 'text-teal-400',
    badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
    sampleUrl: 'https://vimeo.com/76979871',
    tagline: 'Download Vimeo Videos in 1080p and 4K',
    seoTitle: 'Vimeo Video Downloader - VortexFetch',
    seoDescription: 'Save Vimeo presentations, portfolios, and films in high-definition MP4 quality.',
    steps: [
      { title: 'Copy Vimeo URL', desc: 'Copy the Vimeo link from your browser.' },
      { title: 'Paste in VortexFetch', desc: 'Paste into the tool to inspect bitrates.' },
      { title: 'Download Crisp Video', desc: 'Download crystal clear video with uncompressed sound.' }
    ],
    features: ['Cinematic HD Quality', 'Original Bitrates', 'High Framerate Playback', 'Clean MP4 Format']
  }
};
