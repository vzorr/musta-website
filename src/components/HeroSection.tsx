// src/components/HeroSection.tsx - Full Width Hero with Three Images
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
      console.error('Hero background failed to load');
    };
    img.src = '/assets/hero-bg.svg';
  }, []);

  const scrollToRecommend = () => {
    const element = document.getElementById('recommend');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.heroWrapper}>
      <section className={styles.hero}>
        {/* Background Images */}
        <div className={styles.backgroundContainer}>
          {/* Desktop Background */}
          <div className={styles.desktopBackground}>
            <Image
              src="/assets/hero-bg.svg"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Mobile Background */}
          <div className={styles.mobileBackground}>
            <Image
              src="/assets/hero-mobile-bg.svg"
              alt="Mobile Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Container */}
        <div className={styles.heroContent}>
          <div className={styles.heroLayout}>
            
            {/* Left: Phone Mockup */}
            <div className={styles.phoneSection}>
              <div className={styles.phoneContainer}>
                <Image
                  src="/assets/hero-phone.svg"
                  alt="myUsta App Mockup"
                  width={400}
                  height={500}
                  className={styles.phoneImage}
                  priority
                />
              </div>
            </div>

            {/* Center: Text Content */}
            <div className={styles.textSection}>
              <div className={styles.heroTextContainer}>
                <h1 className={styles.heroTitle}>
                  {t('hero.title')}
                </h1>
                
                <p className={styles.heroSubtitle}>
                  {t('hero.subtitle')}
                </p>
                
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

            {/* Right: Tradesperson */}
            <div className={styles.tradespersonSection}>
              <div className={styles.tradespersonContainer}>
                {/* Desktop Image */}
                <Image
                  src="/assets/usta-hero.svg"
                  alt="Tradesperson working"
                  width={400}
                  height={500}
                  className={`${styles.tradespersonImage} ${styles.desktopTradesperson}`}
                  priority
                />
                {/* Mobile Image */}
                <Image
                  src="/assets/usta-hero-mobile.svg"
                  alt="Tradesperson working"
                  width={550}
                  height={358}
                  className={`${styles.tradespersonImage} ${styles.mobileTradesperson}`}
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}