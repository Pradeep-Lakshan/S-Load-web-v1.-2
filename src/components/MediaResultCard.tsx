import React, { useState } from 'react';
import { 
  Download, 
  Film, 
  Music, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  User, 
  HardDrive, 
  ShieldCheck, 
  Loader2, 
  Sparkles 
} from 'lucide-react';
import { MediaInfo, FormatOption } from '../types';

interface MediaResultCardProps {
  media: MediaInfo;
  onClear: () => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({ media, onClear }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  const videoFormats = media.formats.filter(f => !f.is_audio_only);
  const audioFormats = media.formats.filter(f => f.is_audio_only);

  const displayedFormats = activeTab === 'video' ? videoFormats : audioFormats;

  const handleStartDownload = async (format: FormatOption) => {
    if (downloadingFormatId) return;

    setDownloadingFormatId(format.format_id);
    setDownloadProgress(10);
    setStatusMessage('Negotiating stream headers...');
    setDownloadCompleted(false);

    try {
      // Simulate real-time progress while backend prepares stream
      const progressTimer = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev < 40) {
            setStatusMessage('Connecting to host stream...');
            return prev + 15;
          }
          if (prev < 80) {
            setStatusMessage(format.is_audio_only ? 'Extracting audio & encoding MP3...' : 'Merging video & audio streams with ffmpeg...');
            return prev + 12;
          }
          if (prev < 95) {
            setStatusMessage('Streaming media package...');
            return prev + 5;
          }
          return prev;
        });
      }, 300);

      // Call /api/download
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: media.webpage_url,
          format_id: format.format_id,
          is_audio_only: format.is_audio_only,
          title: media.title
        })
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download media stream.');
      }

      setDownloadProgress(100);
      setStatusMessage('Stream finalized! Saving file to disk...');

      // Convert response stream to blob and trigger browser download
      const blob = await res.blob();
      const ext = format.is_audio_only ? 'mp3' : 'mp4';
      const cleanTitle = media.title.replace(/[\\/*?:"<>|]/g, '').slice(0, 50).trim() || 'media';
      const finalFilename = `${cleanTitle}_${format.resolution.replace(/\s+/g, '_')}.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = finalFilename;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();

      setDownloadCompleted(true);
      setTimeout(() => {
        setDownloadingFormatId(null);
        setDownloadProgress(0);
      }, 3000);
    } catch (err: any) {
      alert(`Download error: ${err.message || 'Stream connection failed'}`);
      setDownloadingFormatId(null);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16 animate-in fade-in duration-300">
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Top Header Section */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row gap-6 items-start">
          
          {/* Media Thumbnail */}
          <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
            {media.thumbnail ? (
              <img 
                src={media.thumbnail} 
                alt={media.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Film className="w-8 h-8" />
              </div>
            )}
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-mono font-medium flex items-center gap-1 backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              <span>{media.duration_formatted}</span>
            </div>

            {/* Platform Tag */}
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-800/80 text-cyan-300 text-xs font-semibold backdrop-blur-sm">
              {media.platform}
            </div>
          </div>

          {/* Media Meta Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
                {media.title}
              </h2>
              <button
                onClick={onClear}
                className="text-xs text-slate-400 hover:text-slate-200 hover:underline shrink-0"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {media.uploader || 'Creator'}
              </span>
              <span>&bull;</span>
              <a 
                href={media.webpage_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* In-Progress Download Status Bar */}
            {downloadingFormatId && (
              <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-cyan-300 flex items-center gap-1.5">
                    {downloadCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    )}
                    {statusMessage}
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{downloadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Format Selection Tab Navigation */}
        <div className="px-4 sm:px-6 pt-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition cursor-pointer ${
                activeTab === 'video'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video Formats (MP4)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px] font-mono">
                {videoFormats.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition cursor-pointer ${
                activeTab === 'audio'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Audio Only (MP3)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px] font-mono">
                {audioFormats.length}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Ephemeral Stream</span>
          </div>
        </div>

        {/* Format Cards Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedFormats.map((format) => {
              const isCurrent = downloadingFormatId === format.format_id;
              return (
                <div
                  key={format.format_id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-cyan-950/30 border-cyan-500/50 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/40 hover:bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        {format.is_audio_only ? (
                          <Music className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Film className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        {format.resolution}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60 uppercase">
                        {format.ext}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                      {format.quality_label || format.format_note}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-auto">
                    <span className="text-xs font-mono text-slate-400">
                      {format.filesize_str}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartDownload(format)}
                      disabled={downloadingFormatId !== null}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 opacity-90'
                          : 'bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-transparent'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {isCurrent ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Streaming...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Get {format.ext.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Clean Stream: No video files are permanently stored on our servers. Files stream directly to your browser memory.</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
