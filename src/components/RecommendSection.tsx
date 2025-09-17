'use client';

import { useLanguage } from '../contexts/LanguageContext';
import RecommendUstaForm from './RecommendUstaForm';
import TwoLineTitle from './TwoLineTitle';
import containerStyles from '../styles/SectionContainer.module.css';

export default function RecommendSection() {
  const { t } = useLanguage();

  return (
    <section id="recommend" className="py-12 sm:py-20 bg-myusta-gray relative z-10">
      <div className={containerStyles.sectionContainer}>
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-4 sm:mb-6">
            <TwoLineTitle 
              firstLine="Join the Waitlist"
              secondLine="It's Free!"
              firstLineBold={false}
              secondLineBold={true}
              as="h2"
              centered={true}
            />
          </div>
          <p className="text-lg sm:text-xl text-myusta-text-gray max-w-3xl mx-auto">
            Be the first to know when we launch. Get early access to job opportunities.
          </p>
        </div>
        
        <div className="w-full flex justify-center">
          <RecommendUstaForm />
        </div>
      </div>
    </section>
  );
}
