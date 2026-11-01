import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Mail
} from 'lucide-react';

interface LegalPagesProps {
  view: 'terms' | 'privacy' | 'dmca';
  onBack: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ view, onBack }) => {
  // DMCA Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [owner, setOwner] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [goodFaith, setGoodFaith] = useState(false);
  const [accuracy, setAccuracy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ id: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmitDMCA = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!goodFaith || !accuracy) {
      setFormError('You must check both declarations under penalty of perjury to submit a valid DMCA request.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dmca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          company_or_owner: owner,
          infringing_url: infringingUrl,
          original_work_url: originalUrl,
          statement_good_faith: goodFaith,
          statement_accuracy: accuracy
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit notice.');
      }

      setTicketResult({
        id: data.ticket_id || 'DMCA-102941',
        message: data.message || 'Notice recorded.'
      });
    } catch (err: any) {
      setFormError(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 mb-8 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Downloader</span>
      </button>

      {/* TERMS OF SERVICE */}
      {view === 'terms' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 text-slate-300 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: October 2026</p>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">1. Permitted Personal & Fair Use</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              VortexFetch is provided solely as a technical utility for downloading publicly accessible media for personal backup, offline study, research, and non-commercial fair use. Users are strictly responsible for complying with the copyright laws of their jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">2. Prohibited Activities</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              You agree not to use VortexFetch for:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
              <li>Commercial distribution, resale, or monetization of copyrighted media without written authorization.</li>
              <li>Attempting SSRF, network scanning, DDoS, or probing internal network addresses.</li>
              <li>Bypassing automated rate limits through botnets, rotating proxies, or automated scrapers.</li>
              <li>Downloading private, password-protected, or unlisted content without permission.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">3. Disclaimer of Warranties</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              VortexFetch is provided "AS IS" without warranties of any kind. We do not host, store, or index content, nor do we act as an agent or partner for third-party platforms (YouTube, TikTok, Instagram, Meta, X Corp, or Reddit).
            </p>
          </section>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {view === 'privacy' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 text-slate-300 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Privacy & Zero-Retention Policy</h1>
              <p className="text-xs text-slate-400 mt-0.5">Strict Ephemeral Pipeline Guarantee</p>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">1. Zero Media Storage</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              We never permanently store, index, or catalogue any videos, audio files, or user metadata. Data transferred through our endpoints is streamed ephemerally. Temporary intermediate files created for transcoding or stream merging are purged automatically by background cleanup jobs within minutes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">2. No Tracking Cookies or Third-Party Ad Networks</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              VortexFetch does not utilize third-party advertising trackers, cross-site profiling cookies, or tracking pixels. Client requests are identified solely by IP address for volatile in-memory sliding-window rate limiting (10 req/min), which resets every 60 seconds.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-white">3. Cloudflare Turnstile & Captcha</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              When captcha validation is enabled, requests pass an anonymized privacy-preserving Turnstile verification token to prevent bot exhaustion. No personal identifying information is transmitted.
            </p>
          </section>
        </div>
      )}

      {/* DMCA / COPYRIGHT TAKEDOWN */}
      {view === 'dmca' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 text-slate-300 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">DMCA & Copyright Inquiries</h1>
              <p className="text-xs text-slate-400 mt-0.5">Submit automated takedown or URL blacklisting requests</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            VortexFetch respects the intellectual property rights of creators and copyright owners. While VortexFetch does not host any media files, we provide rights holders with an automated mechanism to blacklist specific URLs from being processed through our system.
          </p>

          {ticketResult ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-base text-emerald-300 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Notice Successfully Cataloged</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-300/80 mb-3">{ticketResult.message}</p>
              <div className="p-3 rounded-lg bg-emerald-950/80 font-mono text-xs flex items-center justify-between">
                <span>Confirmation Ticket Reference:</span>
                <span className="font-bold text-emerald-400">{ticketResult.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setTicketResult(null)}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Submit Another Notice
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitDMCA} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Contact Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="legal@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Copyright Owner / Entity Represented</label>
                <input
                  type="text"
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. Studio Name or Self"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Infringing Social Media Video URL to Blacklist *</label>
                <input
                  type="url"
                  required
                  value={infringingUrl}
                  onChange={(e) => setInfringingUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Original Authorized Work Reference URL</label>
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://original-creator.com/portfolio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={goodFaith}
                    onChange={(e) => setGoodFaith(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                  <span>
                    I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accuracy}
                    onChange={(e) => setAccuracy(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                  <span>
                    I declare under penalty of perjury that the information in this notification is accurate and that I am authorized to act on behalf of the owner.
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Notice...' : 'Submit Takedown Notice'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
