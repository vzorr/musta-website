// src/components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import Title from './Title';
import styles from '../styles/ContactForm.module.css';
import containerStyles from '../styles/SectionContainer.module.css';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  defaultLanguage?: 'sq' | 'en';
}

export default function ContactForm({ defaultLanguage }: ContactFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() ||
      !formData.subject.trim() || !formData.message.trim()) {
      setMessage(language === 'sq' ? 'Të gjitha fushat janë të detyrueshme' : 'All fields are required');
      setMessageType('error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage(language === 'sq' ? 'Email-i nuk është i vlefshëm' : 'Invalid email address');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'sq'
          ? 'Mesazhi juaj u dërgua me sukses! Do t\'ju kontaktojmë së shpejti.'
          : 'Your message was sent successfully! We will contact you soon.');
        setMessageType('success');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setMessage(data.message || (language === 'sq' ? 'Ndodhi një gabim' : 'An error occurred'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage(language === 'sq' ? 'Ndodhi një gabim' : 'An error occurred');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full small:min-w-[400px] max-w-[400px]" >
      <div>
        <div
          className="text-[24px] font-semibold text-center  mb-4 xl:mb-6 p-0"
          style={{
            lineHeight: '120%'
          }}
        >
          <span className='text-bold text-myusta-navy'>{language === 'sq' ? 'Na ' : 'Contact '}</span>
          <span className='text-normal text-myusta-navy'>{language === 'sq' ? 'Kontaktoni' : 'Us'}</span>

        </div>
        <div
          className="!mb-5 text-sm sm:text-base text-light-gray-text  mobile:!mb-8 text-center"
          // style={{ lineHeight: '100%' }}
          dangerouslySetInnerHTML={{
            __html: language === 'sq' ? 'Jemi këtu për ju. Kontaktoni me ekipin tonë në çdo kohë.' : `We're here for you. Get in touch <br /> with our team anytime.`
          }}
        />
      </div>

      <div className="neumorphic-card p-5 mobile:p-8  rounded-2xl bg-myusta-gray relative z-20">



        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'Emri' : 'Name'}
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
            required
            maxLength={100}
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'Numri i Telefonit' : 'Phone Number'}
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
            required
            maxLength={20}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'E-Mail' : 'E-Mail'}
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
            required
            maxLength={150}
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'Subjekti' : 'Subject'}
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray"
            required
            maxLength={200}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'Mesazhi Juaj' : 'Your Message'}
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy placeholder-opacity-70 focus:outline-none bg-myusta-gray resize-none"
            rows={5}
            required
            maxLength={1000}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            // className="text-myusta-navy font-semibold text-lg rounded-lg"
            className="!mt-5 text-myusta-navy font-semibold text-lg rounded-lg mobile:!mt-8"
          >
            {isSubmitting
              ? (language === 'sq' ? 'Po dërgohet...' : 'Sending...')
              : (language === 'sq' ? 'Dërgo Mesazhin' : 'Send Message')}
          </Button>
        </form>
      </div>
    </div>
  );
}