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
import { useState, useCallback } from 'react';

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

  return (
    <LanguageProvider>
      {/* Root container to prevent horizontal overflow */}
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        
        <Header />
        
        <main className="w-full relative">    
          <div className="w-full relative">
            <HeroSection />
          </div>

          <div className="w-full">
                <WhyJoinSection />
                <HowItWorksSection />

            <VideoSection />

            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <WaitlistForm />
              </div>
            </div>

            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <FAQSection />
              </div>
            </div>
          </div>
        </main>
    
        <Footer />

        <GDPRConsent onConsentChange={handleGdprConsentChange} />
      </div>
    </LanguageProvider>
  );
}