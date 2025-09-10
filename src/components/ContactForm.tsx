// src/components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import styles from '../styles/ContactForm.module.css';

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
    <div className={styles.contactFormContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {language === 'sq' ? 'Na Kontaktoni' : 'Contact Us'}
          </h2>
          <p className={styles.formSubtitle}>
            {language === 'sq' 
              ? 'Jemi këtu për ju. Lidhuni me ekipin tonë në çdo kohë.' 
              : 'We\'re here for you. Get in touch with our team anytime.'}
          </p>
        </div>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={language === 'sq' ? 'Emri' : 'Name'}
              className={styles.input}
              required
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={language === 'sq' ? 'Numri i Telefonit' : 'Phone Number'}
              className={styles.input}
              required
              maxLength={20}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={language === 'sq' ? 'E-Mail' : 'E-Mail'}
              className={styles.input}
              required
              maxLength={150}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={language === 'sq' ? 'Subjekti' : 'Subject'}
              className={styles.input}
              required
              maxLength={200}
            />
          </div>

          <div className={styles.formGroup}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={language === 'sq' ? 'Mesazhi Juaj' : 'Your Message'}
              className={`${styles.input} ${styles.textarea}`}
              rows={5}
              required
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            className={styles.submitButton}
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