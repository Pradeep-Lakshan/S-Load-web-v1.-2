import React from 'react';
import { ShieldCheck, Zap, DownloadCloud, Globe } from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORMS } from '../constants/platforms';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, platformId?: PlatformId) => void;
  activePlatformId: PlatformId;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, activePlatformId }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home', 'all')}
            className="flex items-center gap-2.5 group text-left cursor-pointer transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-[#0b101d] rounded-[10px] flex items-center justify-center">
                <DownloadCloud className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Vortex<span className="text-cyan-400">Fetch</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">Fast & Clean Media Engine</p>
            </div>
          </button>

          {/* Center Platform Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => onNavigate('home', 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentView === 'home' && activePlatformId === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              All Platforms
            </button>
            {Object.values(PLATFORMS).slice(0, 5).map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate('platform', p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  currentView === 'platform' && activePlatformId === p.id
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {p.name}
              </button>
            ))}
          </nav>

          {/* Security & Nav Links */}
          <div className="flex items-center gap-3">
            {/* SSRF & Rate limit badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-medium font-mono text-[11px]">SSRF Protected</span>
            </div>

            {/* Quick Links */}
            <button
              onClick={() => onNavigate('faq')}
              className={`text-xs font-medium transition cursor-pointer px-2.5 py-1.5 rounded-lg ${
                currentView === 'faq' ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('dmca')}
              className={`text-xs font-medium transition cursor-pointer px-2.5 py-1.5 rounded-lg ${
                currentView === 'dmca' ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DMCA
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
