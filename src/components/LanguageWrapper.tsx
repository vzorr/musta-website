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
      <div className="min-h-screen bg-myusta-gray flex flex-col items-center justify-center">
       
        {/* <div className="w-12 h-12 border-4 border-myusta-navy border-t-myusta-yellow rounded-full animate-spin"></div>

     
        <div className="mt-4 text-myusta-navy text-lg font-medium tracking-wide">
          Loading...
        </div> */}
        <img src="/assets/LoadingDots.gif" alt="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}
