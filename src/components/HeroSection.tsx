// src/components/HeroSection.tsx - Updated to match reference image layout
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
        style={{
          // Constrain the height to prevent excessive stretching
          height: 'min(800px, 70vh)',
          maxHeight: '800px'
        }}
      >
        {/* Background overlay */}
        <div className={styles.heroOverlay} />

        {/* Content container - FIXED: Full width within banner */}
        <div className={styles.heroContent}>
          <div className="w-full px-8 sm:px-12 h-full"> {/* Reduced padding for less margin */}
            
            {/* FIXED: Flex layout with adjusted Figma spacing */}
            <div className="flex flex-col lg:flex-row items-center justify-center h-full">
              
              {/* Left: Phone mockup with reduced left margin */}
              <div className="flex-shrink-0 order-2 lg:order-1" 
                   style={{ 
                     marginLeft: '40px',    /* Reduced from 97.13px */
                     marginRight: '30px'    /* Reduced from 52.33px */
                   }}>
                <div className="relative w-64 h-80 lg:w-80 lg:h-96">
                  <img 
                    src="/assets/change-this.png" 
                    alt="myUsta App Mockup" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={(e) => {
                      console.error('Phone mockup image failed to load from /assets/change-this.png');
                    }}
                    onLoad={() => {
                      console.log('Phone mockup loaded successfully from /assets/change-this.png');
                    }}
                  />
                </div>
              </div>

              {/* Right: Text content - positioned after phone */}
              <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
                <h1 className={`font-bold text-myusta-navy mb-4 lg:mb-6 leading-tight ${styles.heroText}`}
                    style={{
                      width: '524px',
                      fontSize: '64px',
                      fontWeight: '700',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center'
                    }}>
                  {t('hero.title')}
                </h1>
                <p className={`text-myusta-blue mb-6 lg:mb-8 leading-relaxed ${styles.heroText} ${styles.heroSubtitle}`}
                   style={{
                     width: '562px',
                     fontSize: '20px',
                     fontWeight: '500',
                     lineHeight: '140%',
                     letterSpacing: '0%',
                     textAlign: 'center',
                     color: '#335372'
                   }}>
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