import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Music, 
  Zap, 
  Sliders, 
  Lock 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Zero Ads or Intrusive Popups',
      desc: 'No malware, no spam redirects, and no deceptive "play" buttons. Clean, lightning fast, and privacy-first.'
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: 'Rigorous SSRF Security Guard',
      desc: 'Rejects local/internal IP spaces (127.0.0.1, 10.x, 192.168.x, 169.254.x cloud metadata) and non-http schemes.'
    },
    {
      icon: <Music className="w-5 h-5 text-purple-400" />,
      title: 'Direct MP3 Audio Extraction',
      desc: 'Extract and transcode background audio into high-fidelity 320kbps MP3 tracks via our integrated FFmpeg pipeline.'
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      title: 'Ephemeral Streaming Pipeline',
      desc: 'Media streams directly from the source to your browser. No user media is permanently retained on our servers.'
    },
    {
      icon: <Sliders className="w-5 h-5 text-pink-400" />,
      title: 'Full Format & Resolution Pick',
      desc: 'Choose between 1080p 60fps Full HD, 720p HD, 480p mobile, or lightweight data-saver formats.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
      title: 'DDoS & Rate Limit Protection',
      desc: 'Built-in sliding-window rate limiter (10 requests/min per IP) paired with Cloudflare Turnstile token validation.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineered for Speed, Cleanliness, and Safety
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Why millions prefer modern stream architectures over ad-bloated converters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 transition duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700/60">
              {item.icon}
            </div>
            <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
