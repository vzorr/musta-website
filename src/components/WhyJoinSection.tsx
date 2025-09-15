// src/components/WhyJoinSection.tsx - Updated to use new container
'use client';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import Title from './Title';
import Description from './Description';
import styles from '../styles/WhyJoinSection.module.css';

export default function WhyJoinSection() {
  const { t } = useLanguage();
  const fullTitle = t('whyJoin.title');
  
  const firstPart = "Why";
  const remainingTitle = fullTitle?.replace(/^Why\s+/, "") || "";
  
  // Feature cards data
  const features = [
    {
      imageSrc: "/assets/c1.svg",
      imageAlt: "Direct Opportunities",
      iconSrc: "/assets/wrench-icon.svg",
      iconAlt: "Wrench Icon",
      titleKey: "whyJoin.benefits.directOpportunities.title",
      descriptionKey: "whyJoin.benefits.directOpportunities.description"
    },
    {
      imageSrc: "/assets/time.svg",
      imageAlt: "Save Time",
      iconSrc: "/assets/clock-icon.svg",
      iconAlt: "Clock Icon",
      titleKey: "whyJoin.benefits.saveTime.title",
      descriptionKey: "whyJoin.benefits.saveTime.description"
    },
    {
      imageSrc: "/assets/image_container.svg",
      imageAlt: "Build Reputation",
      iconSrc: "/assets/chain-icon.svg",
      iconAlt: "Chain Link Icon",
      titleKey: "whyJoin.benefits.buildReputation.title",
      descriptionKey: "whyJoin.benefits.buildReputation.description"
    }
  ];

  return (
    <section className={styles.whyJoinSection}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
        <div className={styles.header}>
          <Title 
            firstText={firstPart}
            secondText={remainingTitle}
            as="h1"
            centered={true}
            className={styles.title}
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
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <Image 
                      src={feature.iconSrc}
                      alt={feature.iconAlt}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3 className={styles.cardTitle}>
                    {t(feature.titleKey)}
                  </h3>
                </div>
                <Description className={styles.cardDescription}>
                  {t(feature.descriptionKey)}
                </Description>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}