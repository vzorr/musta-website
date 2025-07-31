'use client';

import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Header() {
  const { t, language } = useLanguage();

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      key: 'professional',
      sq: 'Shërbime Profesionale',
      en: 'Professional Services'
    },
    {
      key: 'trusted', 
      sq: 'Partner i Besuar',
      en: 'Trusted Partner'
    },
    {
      key: 'free',
      sq: 'Regjistrim Falas',
      en: 'Free Registration'
    }
  ];

  return (
    <header className="bg-myusta-navy text-white sticky top-0 z-50 shadow-lg">
      {/* Main Header */}
      <div className="py-4 sm:py-5">
        <div className="max-w-full mx-auto px-4 sm:px-8 flex justify-between items-center">
          {/* Language Selector */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Logo - Centered - Same as Footer */}
          <div className="flex items-center justify-center flex-1">
            <Logo variant="custom" width={118} height={40} className="w-[118px] h-[40px]" />
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <button 
              onClick={scrollToRegistration}
              className="neumorphic-btn px-3 sm:px-4 py-2 rounded-lg text-myusta-navy font-semibold text-sm sm:text-base hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-myusta-yellow focus:ring-offset-2"
            >
              {language === 'sq' ? 'Regjistrohu' : 'Register'}
            </button>
          </div>
        </div>
      </div>

    
    </header>
  );
}