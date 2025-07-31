'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/HowItWorksSection.module.css';

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.howItWorksSection}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Title with Figma spacing */}
        <h2 className={`${styles.howItWorksTitle} text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy italic`}>
          {t('howItWorks.title')}
        </h2>
        
        {/* Cards Grid with proper Figma spacing */}
        <div className={styles.howItWorksGrid}>
          {/* Step 1 */}
          <div className={styles.stepCard}>
            <p className={`${styles.stepNumber} text-myusta-navy font-medium`}>
              {t('howItWorks.steps.step1.title')}
            </p>
            <div className={styles.stepIconContainer}>
              <Image 
                src="/assets/vector.svg" 
                alt="Profile Icon" 
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <p className={`${styles.stepDescription} text-myusta-text-gray leading-relaxed`}>
              {t('howItWorks.steps.step1.description')}
            </p>
          </div>
          
          {/* Step 2 */}
          <div className={styles.stepCard}>
            <p className={`${styles.stepNumber} text-myusta-navy font-medium`}>
              {t('howItWorks.steps.step2.title')}
            </p>
            <div className={styles.stepIconContainer}>
              <Image 
                src="/assets/subtract.svg" 
                alt="Skills Icon" 
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <p className={`${styles.stepDescription} text-myusta-text-gray leading-relaxed`}>
              {t('howItWorks.steps.step2.description')}
            </p>
          </div>
          
          {/* Step 3 */}
          <div className={styles.stepCard}>
            <p className={`${styles.stepNumber} text-myusta-navy font-medium`}>
              {t('howItWorks.steps.step3.title')}
            </p>
            <div className={styles.stepIconContainer}>
              <Image 
                src="/assets/vector.svg" 
                alt="Work Icon" 
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <p className={`${styles.stepDescription} text-myusta-text-gray leading-relaxed`}>
              {t('howItWorks.steps.step3.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}