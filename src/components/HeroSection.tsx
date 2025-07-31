'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export default function HeroSection() {
  const { t } = useLanguage();

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-bg py-12 sm:py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        {/* Left side - Phone mockup */}
        <div className="w-full lg:w-1/3 order-2 lg:order-1">
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 mx-auto">
            {/* Phone mockup with transparent background */}
            <Image 
              src="/assets/change-this.png" 
              alt="myUsta App Mockup" 
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 256px, 320px"
              onError={(e) => {
                console.error('Image failed to load:', e);
                // Fallback: try different path
                e.currentTarget.src = '/change-this.png';
              }}
            />
          </div>
        </div>

        {/* Right side - Hero content */}
        <div className="w-full lg:w-2/3 order-1 lg:order-2 text-center lg:text-left">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-myusta-navy mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-myusta-blue mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <button 
              onClick={scrollToRegistration}
              className="neumorphic-btn px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-myusta-navy font-semibold text-base sm:text-lg hover:scale-105 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-myusta-yellow focus:ring-offset-2"
            >
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}