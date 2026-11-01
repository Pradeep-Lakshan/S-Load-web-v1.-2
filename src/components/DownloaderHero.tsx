import React, { useState, useEffect } from 'react';
import { 
  Clipboard, 
  ArrowRight, 
  X, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORMS } from '../constants/platforms';

interface DownloaderHeroProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onFetchInfo: (targetUrl?: string) => void;
  error: string | null;
  activePlatformId: PlatformId;
  onSelectPlatform: (id: PlatformId) => void;
  captchaVerified: boolean;
  setCaptchaVerified: (v: boolean) => void;
}

export const DownloaderHero: React.FC<DownloaderHeroProps> = ({
  url,
  setUrl,
  isLoading,
  onFetchInfo,
  error,
  activePlatformId,
  onSelectPlatform,
  captchaVerified,
  setCaptchaVerified
}) => {
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Auto-detect platform from current URL
  const detectedPlatform = React.useMemo(() => {
    if (!url) return null;
    const lower = url.toLowerCase();
    for (const p of Object.values(PLATFORMS)) {
      if (lower.includes(p.domain) || (p.id === 'youtube' && lower.includes('youtu.be')) || (p.id === 'twitter' && lower.includes('twitter.com'))) {
        return p;
      }
    }
    return null;
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2000);
      }
    } catch {
      // Fallback if clipboard API permission denied
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      onFetchInfo();
    }
  };

  const handleSampleClick = (sampleUrl: string, platId: PlatformId) => {
    setUrl(sampleUrl);
    onSelectPlatform(platId);
    onFetchInfo(sampleUrl);
  };

  return (
    <div className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 px-4">
      {/* Background Neon Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/10 via-emerald-600/10 to-blue-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Anti-Popup / Clean Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero Ads &bull; No Redirects &bull; High-Definition 1080p &bull; MP3 Audio</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Social Media Video & Audio{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Downloader
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Paste any link from YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, or Vimeo. 
          Stream pristine MP4 video or 320kbps MP3 audio with zero popups.
        </p>

        {/* URL Input Form Container */}
        <div className="relative max-w-3xl mx-auto">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/80 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Input & Paste */}
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste link here (e.g. tiktok.com, youtube.com, instagram.com)..."
                  className="w-full bg-transparent pl-4 pr-24 py-3.5 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none font-sans"
                  disabled={isLoading}
                />

                {/* Right controls inside input */}
                <div className="absolute right-2 flex items-center gap-1.5">
                  {url ? (
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{copiedSuccess ? 'Pasted!' : 'Paste'}</span>
                  </button>
                </div>
              </div>

              {/* Download / Process Button */}
              <button
                type="button"
                onClick={() => onFetchInfo()}
                disabled={isLoading || !url.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Download</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Live Platform Auto-Detection Indicator */}
            {detectedPlatform && (
              <div className="mt-2 pt-2 border-t border-slate-800/60 px-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Detected Platform:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold border ${detectedPlatform.badgeBg}`}>
                    {detectedPlatform.name}
                  </span>
                </div>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Parser Ready
                </span>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm text-left flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-300">Security or Parsing Notice</p>
                <p className="text-red-300/80 text-xs mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Quick Presets / Try Sample URLs */}
          <div className="mt-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Quick Test with Sample URLs (click to load):
              </span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400 flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={captchaVerified}
                    onChange={(e) => setCaptchaVerified(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <span>Turnstile Captcha (Passed)</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.values(PLATFORMS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSampleClick(p.sampleUrl, p.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className={`w-2 h-2 rounded-full ${p.accentColor.replace('text-', 'bg-')}`} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
