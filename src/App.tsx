import React, { useState } from 'react';
import { Header } from './components/Header';
import { DownloaderHero } from './components/DownloaderHero';
import { MediaResultCard } from './components/MediaResultCard';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { PlatformLandingPage } from './components/PlatformLandingPage';
import { LegalPages } from './components/LegalPages';
import { Footer } from './components/Footer';
import { PlatformId, MediaInfo } from './types';
import { PLATFORMS } from './constants/platforms';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'platform' | 'faq' | 'terms' | 'privacy' | 'dmca'>('home');
  const [activePlatformId, setActivePlatformId] = useState<PlatformId>('all');
  
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(true);

  const handleNavigate = (view: string, platformId?: PlatformId) => {
    setError(null);
    if (view === 'platform' && platformId && PLATFORMS[platformId]) {
      setActivePlatformId(platformId);
      setCurrentView('platform');
    } else {
      if (platformId) setActivePlatformId(platformId);
      setCurrentView(view as any);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFetchInfo = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) {
      setError('Please paste a video link into the box above.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMediaInfo(null);

    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: targetUrl,
          turnstile_token: captchaVerified ? 'mock-verified-token' : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Rate limit exceeded: You have reached the maximum 10 requests/min. Please wait a minute before requesting again.');
        }
        throw new Error(data.error || data.detail || 'Could not fetch video information. Please check the URL.');
      }

      setMediaInfo(data);
      // If we are currently on a legal or FAQ page, return to home view to show results
      if (currentView !== 'home' && currentView !== 'platform') {
        setCurrentView('home');
      }

      // Smooth scroll down to media preview
      setTimeout(() => {
        const el = document.getElementById('media-preview-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while analyzing the media.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePlatformSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleFetchInfo(sampleUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        activePlatformId={activePlatformId}
      />

      <main className="flex-1">
        {/* If on a legal / policy view */}
        {currentView === 'terms' || currentView === 'privacy' || currentView === 'dmca' ? (
          <LegalPages
            view={currentView}
            onBack={() => handleNavigate('home', 'all')}
          />
        ) : currentView === 'faq' ? (
          <div className="py-6">
            <FAQSection />
          </div>
        ) : currentView === 'platform' && PLATFORMS[activePlatformId] ? (
          <div>
            {/* Downloader Input Bar at top */}
            <DownloaderHero
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
              onFetchInfo={handleFetchInfo}
              error={error}
              activePlatformId={activePlatformId}
              onSelectPlatform={(id) => handleNavigate('platform', id)}
              captchaVerified={captchaVerified}
              setCaptchaVerified={setCaptchaVerified}
            />

            <div id="media-preview-anchor">
              {mediaInfo && (
                <MediaResultCard
                  media={mediaInfo}
                  onClear={() => {
                    setMediaInfo(null);
                    setUrl('');
                  }}
                />
              )}
            </div>

            <PlatformLandingPage
              platform={PLATFORMS[activePlatformId]}
              onBack={() => handleNavigate('home', 'all')}
              onUseSample={handleUsePlatformSample}
            />
          </div>
        ) : (
          /* Default HOME view */
          <div>
            <DownloaderHero
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
              onFetchInfo={handleFetchInfo}
              error={error}
              activePlatformId={activePlatformId}
              onSelectPlatform={(id) => handleNavigate('platform', id)}
              captchaVerified={captchaVerified}
              setCaptchaVerified={setCaptchaVerified}
            />

            <div id="media-preview-anchor">
              {mediaInfo && (
                <MediaResultCard
                  media={mediaInfo}
                  onClear={() => {
                    setMediaInfo(null);
                    setUrl('');
                  }}
                />
              )}
            </div>

            <FeaturesSection />
            <FAQSection />
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
