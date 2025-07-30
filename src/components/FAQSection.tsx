'use client';

import { useLanguage } from '../contexts/LanguageContext';
import FAQItem from './FAQItem';

export default function FAQSection() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t('faq.items.cost.question'),
      answer: t('faq.items.cost.answer')
    },
    {
      question: t('faq.items.howItHelps.question'),
      answer: t('faq.items.howItHelps.answer')
    },
    {
      question: t('faq.items.whoCanJoin.question'),
      answer: t('faq.items.whoCanJoin.answer')
    },
    {
      question: t('faq.items.launch.question'),
      answer: t('faq.items.launch.answer')
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-myusta-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy text-center mb-12 sm:mb-16 italic">
          {t('faq.title')}
        </h2>
        
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}