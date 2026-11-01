import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is VortexFetch completely free to use?',
      a: 'Yes. VortexFetch is 100% free with no account registrations, credit cards, or hidden paywalls. You can download and convert public social media videos on any desktop or mobile device.'
    },
    {
      q: 'Do you store or log downloaded files on your servers?',
      a: 'No. VortexFetch operates on an ephemeral streaming pipeline. Media chunks stream directly from the platform to your browser. Temporary file segments used for audio transcoding or stream merging are immediately deleted via background cleanup tasks upon response completion.'
    },
    {
      q: 'Why did my URL get rejected with a security or SSRF notice?',
      a: 'To prevent Server-Side Request Forgery (SSRF) and protect cloud infrastructure, our backend validates all target URLs against strict domain allowlists and checks resolved DNS IP addresses. URLs resolving to internal loopback (127.0.0.1), private RFC1918 subnets (10.x, 192.168.x), or AWS/GCP cloud metadata addresses (169.254.169.254) are rejected immediately.'
    },
    {
      q: 'What is the rate limit and why is it enforced?',
      a: 'We enforce an automated sliding-window rate limit of 10 requests per minute per IP address. This ensures fair service availability for all users and prevents aggressive scraping bots from degrading server bandwidth.'
    },
    {
      q: 'What are the maximum duration and file size constraints?',
      a: 'To maintain fast processing times and prevent resource exhaustion, videos are limited to a maximum duration of 30 minutes and a file size cap of 500 MB.'
    },
    {
      q: 'How does Reddit video downloading work with audio?',
      a: 'Reddit typically hosts video (`v.redd.it`) and audio as separate multiplexed streams. Our backend uses FFmpeg to automatically mux the high-definition video track and stereo audio track into a single synchronized MP4 container.'
    },
    {
      q: 'Can I download private, deleted, or geo-restricted videos?',
      a: 'No. VortexFetch strictly supports publicly accessible videos. Private videos, content requiring user login, and age-restricted videos cannot and should not be accessed.'
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Everything you need to know about formats, privacy, security, and usage.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/30 transition cursor-pointer"
              >
                <span className="font-semibold text-white text-sm sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
