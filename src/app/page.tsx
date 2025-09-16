// src/app/page.tsx - Fixed to not interfere with header width
'use client';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
import VideoSection from '../components/VideoSection';
import WaitlistForm from '../components/WaitlistForm';
import RecommendSection from '../components/RecommendSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import GDPRConsent from '../components/GDPRConsent';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useState, useCallback, useEffect } from 'react';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  gdprAccepted: boolean;
  timestamp: string;
}

export default function Home() {
  const [gdprConsents, setGdprConsents] = useState<ConsentState>({
    necessary: false,
    analytics: false,
    marketing: false,
    gdprAccepted: false,
    timestamp: ''
  });

  const handleGdprConsentChange = useCallback((consents: ConsentState) => {
    setGdprConsents(consents);
  }, []);

  // Ensure page starts from top on refresh
  useEffect(() => {
    // Remove any hash from URL to prevent auto-scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Scroll to top when component mounts (with a small delay to ensure DOM is ready)
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, []);

  return (
    <LanguageProvider>
      {/* Root container to prevent horizontal overflow */}
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        
        <Header />
        
        <main className="w-full relative">    
          <div className="w-full relative">
            <HeroSection />
          </div>

          <WhyJoinSection />
          <HowItWorksSection />
          <VideoSection />

          <div id="waitlist" className="w-full bg-myusta-gray">
            <WaitlistForm />
          </div>

          <div className="w-full bg-myusta-gray">
            <FAQSection />
          </div>
        </main>
    
        <Footer />

        <GDPRConsent onConsentChange={handleGdprConsentChange} />
      </div>
    </LanguageProvider>
  );
}