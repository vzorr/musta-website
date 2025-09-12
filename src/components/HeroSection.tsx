// src/components/HeroSection.tsx - ✅ FIXED CENTER ALIGNMENT
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
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

  const scrollToRecommend = () => {
    const element = document.getElementById('recommend');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.heroWrapper}>
      <section 
        className={`${styles.hero} ${imageLoaded ? styles.heroLoaded : styles.heroLoading}`}
      >
        {/* Content container */}
        <div className={styles.heroContent}>
          {/* ✅ FIXED: Simplified layout for center alignment */}
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

            {/* Center: Text content - ✅ FIXED: Always center aligned */}
            <div className="flex-1 text-center order-1 lg:order-2">
              <div className={styles.heroTextContainer}>
                <h1 className={`${styles.heroText} ${styles.herobgtext}`} id='dataheader'>
                  {t('hero.title')}
                </h1>
                
                <p className={`${styles.heroText} ${styles.heroSubtitle}`}>
                  {t('hero.subtitle')}
                </p>
                
                {/* ✅ Button with center alignment */}
                <Button 
                  variant="primary"
                  size="medium"
                  onClick={scrollToRecommend}
                  className={styles.ctaButton}
                >
                  {t('hero.cta')}
                </Button>
              </div>
            </div>

            {/* Right: Extra content */}
            <div className="hidden lg:block order-3" style={{ width: '28%', flexShrink: 0 }}>
            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

