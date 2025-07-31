// src/app/page.tsx - FIXED: Remove duplicate LanguageProvider
'use client';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
import RegistrationForm from '../components/RegistrationForm';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <WhyJoinSection />
        <HowItWorksSection />
        <RegistrationForm />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}