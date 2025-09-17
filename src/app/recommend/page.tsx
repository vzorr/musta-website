// src/app/recommend/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import RecommendUstaForm from '../../components/RecommendUstaForm';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';

export default function RecommendPage() {
  const searchParams = useSearchParams();
  // Get language from URL parameter (e.g., /recommend?lang=en)
  const langParam = searchParams.get('lang') as 'sq' | 'en' | null;
  const defaultLanguage = langParam || 'sq';

  return (
    <LanguageProvider>
      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        <Header />
        
        <main className="w-full relative">
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1440px] mx-auto py-12 sm:py-20 px-4 sm:px-8">
              <RecommendUstaForm defaultLanguage={defaultLanguage} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}