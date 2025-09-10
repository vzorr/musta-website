// src/app/page.tsx - Fixed to not interfere with header width
'use client';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
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
        
        {/* Header - NO WRAPPER, let it handle its own width constraint */}
        <Header />
        
        {/* Main content */}
        <main className="w-full relative">
          {/* Hero Section - Has its own max-width handling */}
          <div className="w-full relative">
            <HeroSection />
          </div>

          {/* Other sections with consistent max-width containers */}
          <div className="w-full">
            {/* Why Join Section */}
            {/* <div> */}
              {/* <div className="w-full max-w-[1440px] mx-auto"> */}
                <WhyJoinSection />
              {/* </div> */}
            {/* </div> */}

            {/* How It Works Section */}
            {/* <div> */}
              {/* <div className="w-full max-w-[1440px] mx-auto"> */}
                <HowItWorksSection />
              {/* </div> */}
            {/* </div> */}

            {/* Recommend Usta Section - Centered within max-width container */}
            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <RecommendSection />
              </div>
            </div>

            {/* FAQ Section */}
            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <FAQSection />
              </div>
            </div>
          </div>
        </main>

        {/* Footer - NO WRAPPER, let it handle its own width constraint */}
        <Footer />

        {/* GDPR Consent Banner - Full width */}
        <GDPRConsent onConsentChange={handleGdprConsentChange} />
      </div>
    </LanguageProvider>
  );
}