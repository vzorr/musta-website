'use client';

import { useState } from 'react';
import Image from 'next/image';
import Description from './Description';

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item neumorphic-card rounded-xl transition-all duration-300 ${isOpen ? 'active' : ''}`}>
      <button 
        className={`w-full text-left flex justify-between items-center transition-colors rounded-xl focus:outline-none ${
          isOpen ? '' : 'hover:bg-black/5'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-myusta-navy pr-4">{question}</span>
        <div className="icon-container w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
          <Image 
            src="/assets/vector.svg" 
            alt="Chevron" 
            width={16}
            height={16}
            className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div 
        className={`faq-content overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-48 pb-4' : 'max-h-0 pb-0'
        }`}
      >
        <div className="px-3">
          <Description centered={false}>{answer}</Description>
        </div>
      </div>
    </div>
  );
}