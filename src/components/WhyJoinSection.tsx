'use client';

import { useLanguage } from '../contexts/LanguageContext';
import FeatureCard from './FeatureCard';

export default function WhyJoinSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 bg-myusta-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy mb-8 sm:mb-12">
            {t('whyJoin.title')}
          </h2>
          <div 
            className="text-base sm:text-lg text-myusta-navy max-w-4xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t('whyJoin.description') }}
          />
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            imageSrc="/assets/image_container.svg"
            imageAlt="Direct Opportunities"
            iconSrc="/assets/vector.svg"
            iconAlt="User Icon"
            title={t('whyJoin.benefits.directOpportunities.title')}
            description={t('whyJoin.benefits.directOpportunities.description')}
          />
          
          <FeatureCard
            imageSrc="/assets/image_container.svg"
            imageAlt="Save Time"
            iconSrc="/assets/vector.svg"
            iconAlt="Clock Icon"
            title={t('whyJoin.benefits.saveTime.title')}
            description={t('whyJoin.benefits.saveTime.description')}
          />
          
          <FeatureCard
            imageSrc="/assets/image_container.svg"
            imageAlt="Build Reputation"
            iconSrc="/assets/vector.svg"
            iconAlt="Star Icon"
            title={t('whyJoin.benefits.buildReputation.title')}
            description={t('whyJoin.benefits.buildReputation.description')}
          />
        </div>
      </div>
    </section>
  );
}