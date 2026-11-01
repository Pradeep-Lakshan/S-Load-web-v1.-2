import React from 'react';
import { 
  ArrowLeft, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Download, 
  Play, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { PlatformConfig, PlatformId } from '../types';

interface PlatformLandingPageProps {
  platform: PlatformConfig;
  onBack: () => void;
  onUseSample: (url: string) => void;
}

export const PlatformLandingPage: React.FC<PlatformLandingPageProps> = ({
  platform,
  onBack,
  onUseSample
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Platforms</span>
      </button>

      {/* SEO Hero Header */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-slate-800 border-slate-700">
              <span className={`w-2 h-2 rounded-full ${platform.accentColor.replace('text-', 'bg-')}`} />
              <span className={platform.accentColor}>Official {platform.name} Module</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              {platform.seoTitle}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              {platform.seoDescription}
            </p>
          </div>

          <button
            onClick={() => onUseSample(platform.sampleUrl)}
            className="shrink-0 px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-cyan-400" />
            <span>Load {platform.name} Demo</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-2.5">
          {platform.features.map((feat, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-medium"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Step Instruction Guide */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>How to Download {platform.name} Videos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platform.steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm mb-3">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-white text-base mb-1.5">{step.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform FAQ */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>{platform.name} Downloader FAQ</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <h4 className="font-semibold text-slate-200">Is this {platform.name} downloader free?</h4>
            <p className="text-slate-400 mt-1">Yes, VortexFetch is 100% free with no hidden subscriptions, credit cards, or limits.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Can I convert {platform.name} videos to MP3?</h4>
            <p className="text-slate-400 mt-1">Yes, our engine extracts and converts the audio track into a standalone 320kbps or 192kbps MP3 file.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Do you support private videos or posts?</h4>
            <p className="text-slate-400 mt-1">No, out of respect for creator privacy, VortexFetch only processes publicly accessible media URLs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
