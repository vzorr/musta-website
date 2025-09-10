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

export default function RecommendUstaForm() {
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
  const [showRecommendAnother, setShowRecommendAnother] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      setMessage(language === 'sq' 
        ? 'Ju lutemi plotësoni të gjitha fushat e detyrueshme' 
        : 'Please fill in all required fields');
      setMessageType('error');
      return false;
    }

    // If recommending another usta, validate those fields
    if (showRecommendAnother) {
      if (!formData.ustaName?.trim() || !formData.ustaPhone?.trim()) {
        setMessage(language === 'sq' 
          ? 'Ju lutemi jepni të dhënat e usta-së që rekomandoni' 
          : 'Please provide the usta\'s information you are recommending');
        setMessageType('error');
        return false;
      }
    }

    // Email validation if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage(language === 'sq' ? 'Email-i nuk është i vlefshëm' : 'Invalid email address');
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
          isRecommendation: showRecommendAnother
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'sq' 
          ? showRecommendAnother 
            ? 'Rekomandimi u dërgua me sukses! Faleminderit që na ndihmoni të rritemi.' 
            : 'Të dhënat tuaja u regjistruan me sukses! Do t\'ju njoftojmë së shpejti.'
          : showRecommendAnother
            ? 'Recommendation sent successfully! Thank you for helping us grow.'
            : 'Your information was registered successfully! We will notify you soon.');
        setMessageType('success');
        
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
        setMessage(data.message || (language === 'sq' ? 'Ndodhi një gabim' : 'An error occurred'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Recommend form error:', error);
      setMessage(language === 'sq' ? 'Ndodhi një gabim' : 'An error occurred');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecommendAnother = () => {
    setShowRecommendAnother(true);
    setMessage('');
  };

  return (
    <div className={styles.recommendContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {language === 'sq' 
              ? 'Plotësoni informacionet e mëposhtme.' 
              : 'Fill out the following information below.'}
          </h2>
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

          <div className={styles.categoryList}>
            {categories.slice(0, 5).map(cat => (
              <div
                key={cat.value}
                className={`${styles.categoryItem} ${formData.category === cat.value ? styles.selected : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
              >
                {cat.label}
              </div>
            ))}
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

          {showRecommendAnother && (
            <>
              <div className={styles.sectionDivider}>
                <h3>{language === 'sq' ? 'Të dhënat e Usta-së që rekomandoni' : 'Usta Information You\'re Recommending'}</h3>
              </div>
              
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="ustaName"
                  value={formData.ustaName}
                  onChange={handleInputChange}
                  placeholder={language === 'sq' ? 'Emri i Usta-së' : 'Usta Name'}
                  className={styles.input}
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="tel"
                  name="ustaPhone"
                  value={formData.ustaPhone}
                  onChange={handleInputChange}
                  placeholder={language === 'sq' ? 'Numri i Usta-së' : 'Usta Phone Number'}
                  className={styles.input}
                  maxLength={20}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="ustaEmail"
                  value={formData.ustaEmail}
                  onChange={handleInputChange}
                  placeholder={`${language === 'sq' ? 'Email i Usta-së' : 'Usta Email'} (${language === 'sq' ? 'Opsionale' : 'Optional'})`}
                  className={styles.input}
                  maxLength={150}
                />
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            {!showRecommendAnother ? (
              <>
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
                    ? (language === 'sq' ? 'Po regjistrohet...' : 'Registering...') 
                    : (language === 'sq' ? 'Usta Rekomanduar' : 'Usta Recommended')}
                </Button>

                <button
                  type="button"
                  onClick={handleRecommendAnother}
                  className={styles.recommendAnotherButton}
                >
                  <span className={styles.plusIcon}>+</span>
                  {language === 'sq' ? 'Rekomando një Usta tjetër' : 'Recommend Another Usta'}
                </button>
              </>
            ) : (
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
                  : (language === 'sq' ? 'Dërgo Rekomandimin' : 'Send Recommendation')}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}