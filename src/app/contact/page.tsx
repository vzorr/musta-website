// src/app/contact/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import Link from "next/link";

export default function ContactPage() {
  // const searchParams = useSearchParams();
  // Get language from URL parameter (e.g., /contact?lang=en)
  // const langParam = searchParams.get("lang") as "sq" | "en" | null;
  // const defaultLanguage = langParam || "sq";
  const { t, } = useLanguage();
  return (

      <div className=" bg-myusta-gray text-myusta-navy min-h-screen relative overflow-x-hidden">
        <Header />

        <main className="w-full relative">
          <div className="w-full bg-myusta-gray">
            <div className="w-full max-w-[1000px] mx-auto global-main-page pt-[32px] pb-[48px] mobile:pt-[48px] mobile:pb-[48px]">
              {/* Breadcrumb */}
              <nav className="mb-[32px] xl:mb-[64px]  text-sm xl:text-base">
                <a 
                  href="/" 
                  className="text-[#868686] hover:text-myusta-yellow transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  {t("contactBreadcrumb.home")}
                </a>
                <span className="ml-2 mr-0.5 text-myusta-navy">/</span>
                <span className="text-myusta-navy font-semibold">
                  {t("contactBreadcrumb.contact")}
                </span>
              </nav>
              <ContactForm  />
            </div>
          </div>
        </main>

        <Footer />
      </div>

  );
}
