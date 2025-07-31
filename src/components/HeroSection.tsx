// src/components/HeroSection.tsx - Updated to use CSS modules
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/HeroSection.module.css';

// Import our height hooks
import { useHeroHeight } from '../hooks/useDynamicHeroHeight';

export default function HeroSection() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use dynamic height calculation and apply to CSS custom properties
  const { heroStyle, recalculate } = useHeroHeight({
    minHeight: 450, // Minimum height for content readability
    maxHeight: 750, // Maximum height to ensure content below is visible
    contentVisibilityRatio: 0.4, // Always show 40% of screen for content below
  });

  // Set CSS custom properties for the module CSS to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (heroStyle.height) {
        root.style.setProperty('--hero-height', heroStyle.height as string);
      }
      if (heroStyle.minHeight) {
        root.style.setProperty('--hero-min-height', heroStyle.minHeight as string);
      }
      if (heroStyle.maxHeight) {
        root.style.setProperty('--hero-max-height', heroStyle.maxHeight as string);
      }
    }
  }, [heroStyle]);

  useEffect(() => {
    // Check if image exists and can be loaded
    const img = new window.Image();
    img.onload = () => {
      setImageLoaded(true);
      console.log('Hero banner loaded successfully');
      // Recalculate height after image loads in case it affects layout
      setTimeout(recalculate, 100);
    };
    img.onerror = () => {
      setImageError(true);
      console.error('Hero banner failed to load from /assets/herobanner.png');
    };
    img.src = '/assets/herobanner.png';
  }, [recalculate]);

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

        {/* Content container */}
        <div className={styles.heroContent}>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-16 w-full h-full">
            
            {/* Left side - Phone mockup */}
            <div className="w-full lg:w-1/3 order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className={styles.phoneContainer}>
                <Image 
                  src="/assets/change-this.png" 
                  alt="myUsta App Mockup" 
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 320px"
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
                <h1 className={`text-3xl sm:text-4xl lg:text-6xl font-bold text-myusta-navy mb-4 lg:mb-6 leading-tight ${styles.heroText}`}>
                  {t('hero.title')}
                </h1>
                <p className={`text-lg sm:text-xl text-myusta-blue mb-6 lg:mb-8 leading-relaxed ${styles.heroText} ${styles.heroSubtitle}`}>
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
    </div>
  );
}

// Alternative: Surface Pro exact style on all devices
export function HeroSectionSurfaceStyle() {
  const { t } = useLanguage();

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      style={{
        width: '100vw',
        maxWidth: '1440px', // Surface Pro width
        margin: '0 auto', // Center on larger screens
        aspectRatio: '1440/960', // Exact Surface Pro dimensions
        position: 'relative',
        backgroundImage: 'url("/assets/herobanner.png")',
        backgroundSize: 'cover', // No distortion
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundColor: '#f3f3f3',
        overflow: 'visible',
        boxShadow: window.innerWidth > 1440 ? '0 0 20px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {/* Background overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(243, 243, 243, 0.1)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content container - same as main version */}
      <div 
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          padding: '3rem 1rem',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 w-full h-full">
          {/* Your existing content here */}
          <div className="w-full lg:w-1/3 order-2 lg:order-1">
            {/* Phone mockup */}
          </div>
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
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-myusta-navy font-semibold text-base sm:text-lg bg-yellow-400 hover:scale-105 transition-transform"
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