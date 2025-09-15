// src/components/HowItWorksSection.tsx - Updated to use SectionContainer module
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import Title from './Title';
import Description from './Description';
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
      {/* Updated: Using 1000px width container for consistency */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
        {/* Title with increased spacing */}
        <Title 
          firstText={firstWord}
          secondText={remainingTitle}
          as="h1"
          centered={true}
          className={styles.howItWorksTitle}
        />
        
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
            <Description className={styles.stepDescription}>
              {t('howItWorks.steps.step1.description')}
            </Description>
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
            <Description className={styles.stepDescription}>
              {t('howItWorks.steps.step2.description')}
            </Description>
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
            <Description className={styles.stepDescription}>
              {t('howItWorks.steps.step3.description')}
            </Description>
          </div>
        </div>
      </div>
    </section>
  );
}