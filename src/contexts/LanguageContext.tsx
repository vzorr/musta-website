// src/contexts/LanguageContext.tsx - IMPROVED: Better error handling and hydration
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import sqTranslations from '../locales/sq.json';
import enTranslations from '../locales/en.json';

type Language = 'sq' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  sq: sqTranslations,
  en: enTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('sq');
  const [isLoading, setIsLoading] = useState(false);

  // if any issues with hydration, use this instead of the one below useEffect
  // const [language, setLanguage] = useState<Language>(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedLanguage = localStorage.getItem('myusta-language') as Language;
  //     if (savedLanguage && (savedLanguage === 'sq' || savedLanguage === 'en')) {
  //       return savedLanguage;
  //     }
  //   }
  //   return 'sq'; // default
  // });

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedLanguage = localStorage.getItem('myusta-language') as Language;
  //     if (savedLanguage && (savedLanguage === 'sq' || savedLanguage === 'en')) {
  //       setLanguage(savedLanguage);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('myusta-language') as Language;
      if (savedLanguage === 'sq' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      } else {
        setLanguage('sq');
        localStorage.setItem('myusta-language', 'sq');
      }
    }
  }, []);


  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('myusta-language', lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to key if translation not found
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      isLoading
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // More descriptive error message
    throw new Error(
      'useLanguage must be used within a LanguageProvider. ' +
      'Make sure to wrap your app with <LanguageProvider> in your root layout.'
    );
  }
  return context;
}