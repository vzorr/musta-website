// src/app/page.tsx - Updated with GDPR banner
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
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative">
        {/* Header - Full width */}
        <Header />
        
        {/* Main content with responsive container */}
        <main className="w-full">
          {/* Hero Section - Full width background with centered content */}
          <div className="w-full">
            <div className="w-full max-w-[1440px] mx-auto">
              <HeroSection />
            </div>
          </div>

          {/* Why Join Section - Full width background with centered content */}
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1440px] mx-auto">
              <WhyJoinSection />
            </div>
          </div>

          {/* How It Works Section - Full width background with centered content */}
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1440px] mx-auto">
              <HowItWorksSection />
            </div>
          </div>

          {/* Registration Form - Full width background with centered form */}
          <div className="w-full bg-myusta-gray">
            <RegistrationForm gdprConsents={gdprConsents} />
          </div>

          {/* FAQ Section - Full width background with centered content */}
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1440px] mx-auto">
              <FAQSection />
            </div>
          </div>
        </main>

        {/* Footer - Full width */}
        <Footer />

        {/* GDPR Consent Banner - Shows on page load */}
        <GDPRConsent onConsentChange={handleGdprConsentChange} />
      </div>
    </LanguageProvider>
  );
}