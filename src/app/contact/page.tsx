// src/app/contact/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import ContactForm from '../../components/ContactForm';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';

export default function ContactPage() {
  const searchParams = useSearchParams();
  // Get language from URL parameter (e.g., /contact?lang=en)
  const langParam = searchParams.get('lang') as 'sq' | 'en' | null;
  const defaultLanguage = langParam || 'sq';

  return (
    <LanguageProvider>
      <div className=" bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        <Header />

        <main className="w-full relative">
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1000px] mx-auto global-main-page py-[32px] xl:py-[48px]">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 mb-8 font-inter text-sm font-normal text-gray-500">
                <a href="/" className="text-gray-500 hover:text-myusta-yellow transition-colors">Home</a>
                <span className="text-gray-500">/</span>
                <span className="text-myusta-navy font-bold">Contact Us</span>
              </nav>

              <ContactForm defaultLanguage={defaultLanguage} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}