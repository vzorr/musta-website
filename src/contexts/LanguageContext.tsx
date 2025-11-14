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
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  sq: sqTranslations,
  en: enTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default language to prevent hydration mismatch
  const [language, setLanguage] = useState<Language>('sq');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and language loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = localStorage.getItem('myusta-language') as Language;
        if (savedLanguage === 'sq' || savedLanguage === 'en') {
          setLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
        } else {
          setLanguage('sq');
          localStorage.setItem('myusta-language', 'sq');
          document.documentElement.lang = 'sq';
        }
      } catch (error) {
        // Fallback if localStorage fails
        console.warn('localStorage not available, using default language');
        setLanguage('sq');
        document.documentElement.lang = 'sq';
      }
      setIsHydrated(true);
      setIsLoading(false);
    } else {
      // Server-side: ensure consistent state
      setIsHydrated(true);
      setIsLoading(false);
    }
  }, []);


  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('myusta-language', lang);
        document.documentElement.lang = lang;
      } catch (error) {
        console.warn('Failed to save language to localStorage:', error);
        // Still update the language state even if localStorage fails
        document.documentElement.lang = lang;
      }
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
      isLoading,
      isHydrated
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