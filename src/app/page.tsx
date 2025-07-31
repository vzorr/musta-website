// src/app/page.tsx - FIXED: Hero section layout to prevent clipping
'use client';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
import RegistrationForm from '../components/RegistrationForm';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import GDPRConsent from '../components/GDPRConsent';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useState } from 'react';

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

  const handleGdprConsentChange = (consents: ConsentState) => {
    setGdprConsents(consents);
  };

  return (
    <LanguageProvider>
      {/* FIXED: Root container to prevent horizontal overflow */}
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative">
        {/* Header - Full width */}
        <Header />
        
        {/* FIXED: Main content with proper overflow handling */}
        <main className="w-full relative">
          {/* FIXED: Hero Section - Ensure it can break out of container constraints */}
          <div className="w-full relative">
            <HeroSection />
          </div>

          {/* Other sections with centered content */}
          <div className="w-full">
            {/* Why Join Section */}
            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <WhyJoinSection />
              </div>
            </div>

            {/* How It Works Section */}
            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <HowItWorksSection />
              </div>
            </div>

            {/* Registration Form */}
            <div className="w-full bg-myusta-gray">
              <RegistrationForm gdprConsents={gdprConsents} />
            </div>

            {/* FAQ Section */}
            <div className="w-full bg-myusta-gray">
              <div className="w-full max-w-[1440px] mx-auto">
                <FAQSection />
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Full width */}
        <Footer />

        {/* GDPR Consent Banner */}
        <GDPRConsent onConsentChange={handleGdprConsentChange} />
      </div>
    </LanguageProvider>
  );
}