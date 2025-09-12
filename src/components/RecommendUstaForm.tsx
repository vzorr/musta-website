// src/components/RecommendUstaForm.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import Image from 'next/image';
import styles from '../styles/RecommendUsta.module.css';

interface RecommendFormData {
  name: string;
  phone: string;
  email?: string;
  category: string;
  location: string;
  ustaName?: string;
  ustaPhone?: string;
  ustaEmail?: string;
}

interface RecommendFormProps {
  defaultLanguage?: 'sq' | 'en';
}

export default function RecommendUstaForm({ defaultLanguage }: RecommendFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<RecommendFormData>({
    name: '',
    phone: '',
    email: '',
    category: '',
    location: '',
    ustaName: '',
    ustaPhone: '',
    ustaEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecommendAnother = () => {
    setIsSuccess(false);
    setMessage('');
    setMessageType('');
  };

  const categories = [
    { value: 'plumber', label: language === 'sq' ? 'Hidraulik' : 'Plumber' },
    { value: 'electrician', label: language === 'sq' ? 'Elektricist' : 'Electrician' },
    { value: 'woodworker', label: language === 'sq' ? 'Zdrukthëtar' : 'Woodworker' },
    { value: 'mason', label: language === 'sq' ? 'Murator' : 'Mason' },
    { value: 'tiler', label: language === 'sq' ? 'Pllakështrues' : 'Tiler' },
    { value: 'painter', label: language === 'sq' ? 'Bojaxhi' : 'Painter' },
    { value: 'other', label: language === 'sq' ? 'Tjetër' : 'Other' },
  ];

  const locations = [
    { value: 'tirana', label: language === 'sq' ? 'Tiranë' : 'Tirana' },
    { value: 'durres', label: language === 'sq' ? 'Durrës' : 'Durres' },
    { value: 'vlore', label: language === 'sq' ? 'Vlorë' : 'Vlore' },
    { value: 'shkoder', label: language === 'sq' ? 'Shkodër' : 'Shkoder' },
    { value: 'elbasan', label: language === 'sq' ? 'Elbasan' : 'Elbasan' },
    { value: 'korce', label: language === 'sq' ? 'Korçë' : 'Korce' },
    { value: 'fier', label: language === 'sq' ? 'Fier' : 'Fier' },
    { value: 'berat', label: language === 'sq' ? 'Berat' : 'Berat' },
    { value: 'other', label: language === 'sq' ? 'Tjetër' : 'Other' },
  ];

  const validateForm = (): boolean => {
    // Required fields for recommender
    if (!formData.name.trim() || !formData.phone.trim() || !formData.category || !formData.location) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return false;
    }

    // Email validation if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage('Invalid email address');
        setMessageType('error');
        return false;
      }
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
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language,
          isRecommendation: false
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usta Recommended');
        setMessageType('success');
        setIsSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          category: '',
          location: '',
          ustaName: '',
          ustaPhone: '',
          ustaEmail: ''
        });
      } else {
        setMessage(data.message || 'An error occurred');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Recommend form error:', error);
      setMessage('An error occurred');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.recommendContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            Join the Waitlist - It's Free!
          </h2>
        </div>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {!isSuccess ? (
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
              placeholder={`${language === 'sq' ? 'E-Mail' : 'E-Mail'} (${language === 'sq' ? 'Opsionale' : 'Optional'})`}
              className={styles.input}
              maxLength={150}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.selectWrapper}>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">{language === 'sq' ? 'Kategoria' : 'Category'}</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>
                <Image src="/assets/vector.svg" alt="arrow" width={16} height={16} />
              </div>
            </div>
          </div>


          <div className={styles.formGroup}>
            <div className={styles.selectWrapper}>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">{language === 'sq' ? 'Vendndodhja' : 'Location'}</option>
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>
                <Image src="/assets/vector.svg" alt="arrow" width={16} height={16} />
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
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
                ? 'Registering...' 
                : 'Join the Waitlist'}
            </Button>
          </div>
        </form>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Usta Recommended</h3>
              <p className={styles.successMessage}>
                Thank you for recommending! We'll reach out to them soon.
              </p>
              <Button
                onClick={handleRecommendAnother}
                variant="primary"
                size="large"
                fullWidth
                className={styles.recommendAnotherButton}
              >
                <span className={styles.plusIcon}>+</span>
                Recommend Another Usta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}