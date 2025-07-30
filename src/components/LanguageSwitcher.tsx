'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* UK Flag */}
      <button
        onClick={() => setLanguage('en')}
        className={`w-7 h-5 relative rounded-sm transition-opacity ${
          language === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
      >
        <Image 
          src="/assets/vector.svg" 
          alt="UK Flag" 
          fill
          className="object-cover rounded-sm"
        />
      </button>
      
      {/* Albania Flag */}
      <button
        onClick={() => setLanguage('sq')}
        className={`w-7 h-5 relative rounded-sm transition-opacity ${
          language === 'sq' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
      >
        <Image 
          src="/assets/a.svg" 
          alt="Albania Flag" 
          fill
          className="object-cover rounded-sm"
        />
      </button>
    </div>
  );
}