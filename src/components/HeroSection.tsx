'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/HeroSection.module.css';

export default function HeroSection() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Check if image exists and can be loaded
    const img = new window.Image();
    img.onload = () => {
      setImageLoaded(true);
      console.log('Hero banner loaded successfully');
    };
    img.onerror = () => {
      setImageError(true);
      console.error('Hero banner failed to load from /assets/herobanner.png');
    };
    img.src = '/assets/herobanner.png';
  }, []);

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className={`${styles.hero} ${imageLoaded ? styles.heroLoaded : styles.heroLoading}`}
    >
      {/* Debug info - remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugInfo}>
          <div>Image Status: {imageLoaded ? '✅ Loaded' : imageError ? '❌ Failed' : '⏳ Loading'}</div>
          <div>Path: /assets/herobanner.png</div>
        </div>
      )}

      {/* Content container */}
      <div className={styles.heroContent}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 min-h-[70vh] lg:min-h-[80vh]">
          
          {/* Left side - Phone mockup */}
          <div className="w-full lg:w-1/3 order-2 lg:order-1">
            <div className={styles.phoneContainer}>
              <Image 
                src="/assets/change-this.png" 
                alt="myUsta App Mockup" 
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 320px"
                onError={(e) => {
                  console.error('Phone mockup image failed to load:', e);
                  e.currentTarget.src = '/change-this.png';
                }}
              />
            </div>
          </div>

          {/* Right side - Hero content */}
          <div className="w-full lg:w-2/3 order-1 lg:order-2 text-center lg:text-left">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <h1 className={`text-3xl sm:text-4xl lg:text-6xl font-bold text-myusta-navy mb-6 leading-tight ${styles.heroText}`}>
                {t('hero.title')}
              </h1>
              <p className={`text-lg sm:text-xl text-myusta-blue mb-8 leading-relaxed ${styles.heroText}`}>
                {t('hero.subtitle')}
              </p>
              <button 
                onClick={scrollToRegistration}
                className={`${styles.ctaButton} px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-myusta-navy font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-myusta-yellow focus:ring-offset-2`}
              >
                {t('hero.cta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}