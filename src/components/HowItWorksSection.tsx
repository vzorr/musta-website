'use client';

import { useLanguage } from '../contexts/LanguageContext';
import StepCard from './StepCard';

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 bg-myusta-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy text-center mb-12 sm:mb-16">
          {t('howItWorks.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StepCard
            stepNumber={t('howItWorks.steps.step1.title')}
            iconSrc="/assets/vector.svg"
            iconAlt="Profile Icon"
            description={t('howItWorks.steps.step1.description')}
          />
          
          <StepCard
            stepNumber={t('howItWorks.steps.step2.title')}
            iconSrc="/assets/subtract.svg"
            iconAlt="Skills Icon"
            description={t('howItWorks.steps.step2.description')}
          />
          
          <StepCard
            stepNumber={t('howItWorks.steps.step3.title')}
            iconSrc="/assets/vector.svg"
            iconAlt="Work Icon"
            description={t('howItWorks.steps.step3.description')}
          />
        </div>
      </div>
    </section>
  );
}