// src/components/WhyJoinSection.tsx - Updated to use new container
'use client';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import styles from '../styles/WhyJoinSection.module.css';

export default function WhyJoinSection() {
  const { t } = useLanguage();
  const fullTitle = t('whyJoin.title');
  const firstWord = fullTitle?.trim().split(/\s+/)[0] || "";

  // Split the title into words
  const words = fullTitle?.trim().split(/\s+/) || [];

  // Extract first word and remaining part
  const remainingTitle = words.slice(1).join(" ");
  
  // Feature cards data
  const features = [
    {
      imageSrc: "/assets/image_container.svg",
      imageAlt: "Direct Opportunities",
      iconSrc: "/assets/vector.svg",
      iconAlt: "User Icon",
      titleKey: "whyJoin.benefits.directOpportunities.title",
      descriptionKey: "whyJoin.benefits.directOpportunities.description"
    },
    {
      imageSrc: "/assets/image_container.svg",
      imageAlt: "Save Time",
      iconSrc: "/assets/vector.svg",
      iconAlt: "Clock Icon",
      titleKey: "whyJoin.benefits.saveTime.title",
      descriptionKey: "whyJoin.benefits.saveTime.description"
    },
    {
      imageSrc: "/assets/image_container.svg",
      imageAlt: "Build Reputation",
      iconSrc: "/assets/vector.svg",
      iconAlt: "Star Icon",
      titleKey: "whyJoin.benefits.buildReputation.title",
      descriptionKey: "whyJoin.benefits.buildReputation.description"
    }
  ];

  return (
    <section className={styles.whyJoinSection}>
      {/* Updated: Using new container with specified width and layout */}
      <div className={styles.whyJoinContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className='flex flex-row justify-center gap-2 text-center'>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy`}>{firstWord}</h1>
            <h2 className={`${styles.title} text-2xl sm:text-4xl lg:text-5xl text-myusta-navy`}>
              {remainingTitle}
            </h2>
          </div>
          <div 
            className={`${styles.description} text-base sm:text-lg text-myusta-navy leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: t('whyJoin.description') }}
          />
        </div>

        {/* Benefits Cards */}
        <div className={styles.benefitsGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.imageContainer}>
                <Image 
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <Image 
                      src={feature.iconSrc}
                      alt={feature.iconAlt}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <h3 className={styles.cardTitle}>
                    {t(feature.titleKey)}
                  </h3>
                </div>
                <p className={styles.cardDescription}>
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}