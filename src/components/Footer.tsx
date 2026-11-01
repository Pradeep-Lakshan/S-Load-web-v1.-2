import React from 'react';
import { DownloadCloud, Shield, Heart } from 'lucide-react';
import { PLATFORMS } from '../constants/platforms';
import { PlatformId } from '../types';

interface FooterProps {
  onNavigate: (view: string, platformId?: PlatformId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#070b14] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b101d] rounded-[6px] flex items-center justify-center">
                  <DownloadCloud className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white">
                Vortex<span className="text-cyan-400">Fetch</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-fast, clean media streamer supporting YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, and Vimeo without advertisements or intrusive popups.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>SSRF Hardened &bull; Ephemeral Pipeline</span>
            </div>
          </div>

          {/* Platform Landing Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Supported Platforms</h4>
            <ul className="space-y-2 text-xs">
              {Object.values(PLATFORMS).slice(0, 4).map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => onNavigate('platform', p.id)}
                    className="hover:text-cyan-400 transition cursor-pointer text-left"
                  >
                    {p.name} Video Downloader
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">More Networks</h4>
            <ul className="space-y-2 text-xs">
              {Object.values(PLATFORMS).slice(4).map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => onNavigate('platform', p.id)}
                    className="hover:text-cyan-400 transition cursor-pointer text-left"
                  >
                    {p.name} Video Downloader
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('home', 'all')}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Audio MP3 Extractor
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Legal & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Privacy & Zero-Retention
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dmca')}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  DMCA / Copyright Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <p>
            <strong>Disclaimer:</strong> VortexFetch is an independent technical parsing and streaming tool. We do not host, store, or republish any videos or audio files on our servers. All media remains the intellectual property of their respective creators and platform rights holders. VortexFetch is not affiliated with, endorsed, or sponsored by YouTube, Google, TikTok, ByteDance, Instagram, Meta Platforms, X Corp, Reddit, or Vimeo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-slate-400 text-xs">
            <span>&copy; {new Date().getFullYear()} VortexFetch. All rights reserved.</span>
            <span className="font-mono text-[11px] text-slate-400">FastAPI &bull; yt-dlp &bull; FFmpeg &bull; Docker</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
