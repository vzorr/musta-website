// src/components/HeroSection.tsx - FIXED: Proper width constraints
'use client';


import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/HeroSection.module.css';

export default function HeroSection() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Check if image exists and can be loaded
    const img = new window.Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Hero banner failed to load from /assets/herobanner.png');
    };
    img.src = '/assets/herobanner.png';
  }, []);

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.heroWrapper}>
      <section 
        className={`${styles.hero} ${imageLoaded ? styles.heroLoaded : styles.heroLoading}`}
      >
        {/* Background overlay */}
        <div className={styles.heroOverlay} />

        {/* Content container - FIXED: Properly constrained */}
        <div className={styles.heroContent}>
          {/* FIXED: Flex layout that respects max-width */}
          <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full mx-auto">
            
            
            {/* Left: Phone mockup */}
            <div className="flex-shrink-0 order-2 lg:order-1">
              <div className={styles.phoneContainer}>
                <img 
                  src="/assets/change-this.png" 
                  alt="myUsta App Mockup" 
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                  onError={(e) => {
                    console.error('Phone mockup image failed to load from /assets/change-this.png');
                  }}
                  onLoad={() => {
                    console.log('Phone mockup loaded successfully from /assets/change-this.png');
                  }}
                />
              </div>
            </div>

            {/* Right: Text content */}
            <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
              <div className={styles.heroTextContainer}>
                <h1 className={`font-bold  mb-4 lg:mb-6 leading-tight text-4xl lg:text-4xl xl:text-6xl ${styles.heroText} ${styles.herobgtext}`} id='dataheader'>
                  {t('hero.title')}
                </h1>
                
                <p className={`text-myuesta-blue mb-6 lg:mb-8 leading-relaxed text-lg lg:text-xl ${styles.heroText} ${styles.heroSubtitle}`}
                   style={{ color: '#335372' }}>
                  {t('hero.subtitle')}
                </p>
                <button 
                  onClick={scrollToRegistration}
                  className={`${styles.ctaButton} px-6 sm:px-8 py-3 sm:py-4 text-myusta-navy font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-myusta-yellow focus:ring-offset-2`}
                >
                  {t('hero.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}