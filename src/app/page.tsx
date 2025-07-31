// src/app/page.tsx - Updated with full-width hero
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
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        {/* Header - Full width */}
        <Header />
        
        {/* Main content */}
        <main className="w-full overflow-x-hidden">
          {/* Hero Section - FULL WIDTH - No container restrictions */}
          <HeroSection />

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