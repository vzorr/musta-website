'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/language.module.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.langContainer}>
      {/* UK Flag */}
      <Image 
        src="/assets/uk-flag.svg" 
        alt="UK Flag" 
        width={27}
        height={20}
        className={`${styles.flagImage} ${
          language === 'en' 
            ? styles.active
            : styles.inactive
        }`}
        onClick={() => setLanguage('en')}
        title="Switch to English"
      />
      
      {/* Albania Flag */}
      <Image 
        src="/assets/albania-flag.svg" 
        alt="Albania Flag" 
        width={27}
        height={20}
        className={`${styles.flagImage} ${
          language === 'sq' 
            ? styles.active
            : styles.inactive
        }`}
        onClick={() => setLanguage('sq')}
        title="Kalo në Shqip"
      />
    </div>
  );
}