// src/components/HowItWorksSection.tsx - Updated to use SectionContainer module
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/HowItWorksSection.module.css';
import containerStyles from '../styles/SectionContainer.module.css';

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const fullTitle = t('howItWorks.title');
  const firstWord = fullTitle?.trim().split(/\s+/)[0] || "";

  // Split the title into words
  const words = fullTitle?.trim().split(/\s+/) || [];

  // Extract first word and remaining part
  const remainingTitle = words.slice(1).join(" ");

  return (
    <section className={styles.howItWorksSection}>
      {/* Updated: Using container module instead of global classes */}
      <div className={containerStyles.sectionContainer}>
        {/* Title with Figma spacing */}
        <div className='flex flex-row justify-center gap-2'>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy`}>{firstWord}</h1>
          <h2 className={`${styles.howItWorksTitle} text-3xl sm:text-4xl lg:text-5xl text-myusta-navy italic`}>
            {remainingTitle}
          </h2>
        </div>
        
        {/* Cards Grid with proper Figma spacing */}
        <div className={styles.howItWorksGrid}>
          {/* Step 1 */}
          <div className={styles.stepCard}>
            <p className={`${styles.stepNumber} text-myusta-navy font-medium`}>
              {t('howItWorks.steps.step1.title')}
            </p>
            <div className={styles.stepIconContainer}>
              <Image 
                src="/assets/file.svg" 
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
                src="/assets/profile.svg" 
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
                src="/assets/hand.svg" 
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