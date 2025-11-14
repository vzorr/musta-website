'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { ReactNode } from 'react';

interface LanguageWrapperProps {
  children: ReactNode;
}

export default function LanguageWrapper({ children }: LanguageWrapperProps) {
  const { isHydrated } = useLanguage();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-myusta-gray flex flex-col items-center justify-center space-y-4">
      {/* Outer ring spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-myusta-navy/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-myusta-navy border-t-transparent animate-spin"></div>
      </div>
    </div>
    
    );
  }

  return <>{children}</>;
}
