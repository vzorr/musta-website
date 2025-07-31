'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      {/* UK Flag */}
      <button
        onClick={() => setLanguage('en')}
        className={`w-8 h-6 relative rounded-sm transition-all duration-200 border border-gray-300 overflow-hidden ${
          language === 'en' 
            ? 'opacity-100 ring-2 ring-myusta-yellow ring-offset-1' 
            : 'opacity-70 hover:opacity-90'
        }`}
        title="English"
      >
        {/* UK Flag using CSS */}
        <div className="w-full h-full relative bg-blue-800">
          {/* White cross */}
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-red-600"></div>
          {/* Diagonal lines */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-transparent to-blue-800"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-600 transform -translate-y-0.5"></div>
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-red-600 transform -translate-x-0.5"></div>
        </div>
        <span className="sr-only">Switch to English</span>
      </button>
      
      {/* Albania Flag */}
      <button
        onClick={() => setLanguage('sq')}
        className={`w-8 h-6 relative rounded-sm transition-all duration-200 border border-gray-300 overflow-hidden ${
          language === 'sq' 
            ? 'opacity-100 ring-2 ring-myusta-yellow ring-offset-1' 
            : 'opacity-70 hover:opacity-90'
        }`}
        title="Shqip"
      >
        {/* Albania Flag using CSS */}
        <div className="w-full h-full bg-red-600 flex items-center justify-center">
          {/* Albanian Eagle approximation */}
          <div className="w-4 h-3 text-black">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L8 6V8L6 10V12L8 14V16L12 20L16 16V14L18 12V10L16 8V6L12 2Z"/>
            </svg>
          </div>
        </div>
        <span className="sr-only">Kalo në Shqip</span>
      </button>

      {/* Alternative: Using actual flag images if you have them */}
      {/* Uncomment this section if you add actual flag images to your assets */}
      {/*
      <button
        onClick={() => setLanguage('en')}
        className={`w-8 h-6 relative rounded-sm transition-all duration-200 border border-gray-300 overflow-hidden ${
          language === 'en' 
            ? 'opacity-100 ring-2 ring-myusta-yellow ring-offset-1' 
            : 'opacity-70 hover:opacity-90'
        }`}
        title="English"
      >
        <Image 
          src="/assets/uk-flag.svg" 
          alt="UK Flag" 
          fill
          className="object-cover rounded-sm"
          sizes="32px"
        />
        <span className="sr-only">Switch to English</span>
      </button>
      
      <button
        onClick={() => setLanguage('sq')}
        className={`w-8 h-6 relative rounded-sm transition-all duration-200 border border-gray-300 overflow-hidden ${
          language === 'sq' 
            ? 'opacity-100 ring-2 ring-myusta-yellow ring-offset-1' 
            : 'opacity-70 hover:opacity-90'
        }`}
        title="Shqip"
      >
        <Image 
          src="/assets/albania-flag.svg" 
          alt="Albania Flag" 
          fill
          className="object-cover rounded-sm"
          sizes="32px"
        />
        <span className="sr-only">Kalo në Shqip</span>
      </button>
      */}
    </div>
  );
}