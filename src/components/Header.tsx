// src/components/Header.tsx - ✅ UPDATED with Button Component
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import Button from './Button';
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
              <a href="/" tabIndex={0} aria-label="Go to homepage">
                <Logo variant="custom" width={118} height={40} className="lg:w-[118px] lg:h-[40px] w-[118px] h-[36px]" />
              </a>
            </div>

            {/* ✅ UPDATED: Using Button Component instead of CSS module */}
            <div className={styles.rightSection}>
              <Button
                variant="primary"
                size="small"
                onClick={scrollToRegistration}
                className={styles.ctaButton}
              >
                {language === 'sq' ? 'Regjistrohu' : 'Register'}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
