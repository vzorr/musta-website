'use client';

import { useLanguage } from '../contexts/LanguageContext';
import FAQItem from './FAQItem';
import Title from './Title';

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
    <section className="bg-myusta-gray">
      <div>
        <div className="max-w-[1000px] mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <Title
              firstText={t('faq.title')}
              as="h2"
              centered={true}
              className='section-title'
            />
          </div>

          <div className="space-y-4" style={{ marginBottom: '48px' }}>
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}