// src/components/Header.tsx - Header with proper width constraint
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { language } = useLanguage();

  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };


  
  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <div className="py-4 sm:py-5">
          <div className={styles.headerContent}>
            {/* Language Selector */}
              <LanguageSwitcher />
         
            {/* Logo - Centered */}
            <div className={styles.centerSection}>
              <Logo variant="custom" width={118} height={40} className="lg:w-[118px] lg:h-[40px] w-[118px] h-[36px]" />
            </div>

            {/* CTA Button */}
            <div className={styles.rightSection}>
              <button 
                onClick={scrollToRegistration}
                className={styles.ctaButton}
              >
                {language === 'sq' ? 'Regjistrohu' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}