// src/components/RecommendUstaForm.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import Image from 'next/image';
import styles from '../styles/RecommendUsta.module.css';
import containerStyles from '../styles/SectionContainer.module.css';

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setShowSuccessMessage(false);
    
    // Reset form data
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
        setMessage(language === 'sq' ? 'Usta u rekomandua me sukses!' : 'Usta Recommended Successfully!');
        setMessageType('success');
        setShowSuccessMessage(true);
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
        
        setTimeout(() => {
          setShowSuccessMessage(false);
          setMessage('');
          setMessageType('');
        }, 3000);
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
      <div className={containerStyles.formContainer}>
        <div className="neumorphic-card p-6 sm:p-8 rounded-2xl bg-myusta-gray relative z-20">
          <div 
            className="text-xl font-semibold text-myusta-navy mb-8"
            style={{
              color: 'var(--Navy, #00203F)',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '100%'
            }}
            dangerouslySetInnerHTML={{ __html: 'Fill out the following<br />information below.' }}
          />

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
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
            placeholder={`${language === 'sq' ? 'E-Mail' : 'E-Mail'} (${language === 'sq' ? 'Opsionale' : 'Optional'})`} 
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray" 
            maxLength={150}
          />
          
          <div className="neumorphic-input rounded-lg relative bg-myusta-gray">
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border-0 text-myusta-navy appearance-none focus:outline-none" 
              required
            >
              <option value="">{language === 'sq' ? 'Kategoria' : 'Category'}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="neumorphic-input rounded-lg relative bg-myusta-gray">
            <select 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border-0 text-myusta-navy appearance-none focus:outline-none" 
              required
            >
              <option value="">{language === 'sq' ? 'Vendndodhja' : 'Location'}</option>
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>

          {!isSuccess ? (
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              className={`text-myusta-navy font-semibold text-lg ${styles.formbtn}`}
              style={{ marginTop: '32px' }}
            >
              {isSubmitting 
                ? (language === 'sq' ? 'Po regjistrohet...' : 'Registering...')
                : (language === 'sq' ? 'Rekomando Usta' : 'Recommend Usta')}
            </Button>
          ) : (
            <div className={styles.successButtons}>
              <div className={styles.ustaRecommendedCard}>
                {language === 'sq' ? 'Usta u Rekomandua' : 'Usta Recommended'}
              </div>
              <button
                type="button"
                onClick={handleRecommendAnother}
                className={styles.recommendAnotherButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.51488 4.01488C8.20138 -0.671626 15.7986 -0.671626 20.4851 4.01488C25.1716 8.70138 25.1716 16.2986 20.4851 20.9851C15.7986 25.6716 8.20138 25.6716 3.51488 20.9851C-1.17163 16.2986 -1.17163 8.70138 3.51488 4.01488ZM11.0205 7.90827V11.5205H7.40827C6.1188 11.5205 6.1188 13.4796 7.40827 13.4796H11.0205V17.0919C11.0205 18.3814 12.9796 18.3814 12.9796 17.0919V13.4796H16.5919C17.8814 13.4796 17.8814 11.5205 16.5919 11.5205H12.9796V7.90827C12.9796 6.6188 11.0205 6.6188 11.0205 7.90827ZM4.90009 5.40009C0.978895 9.32128 0.978895 15.679 4.90009 19.6002C8.82128 23.5214 15.179 23.5214 19.1002 19.6002C23.0214 15.679 23.0214 9.32128 19.1002 5.40009C15.179 1.4789 8.82128 1.4789 4.90009 5.40009Z" fill="#00203F"/>
                </svg>
                {language === 'sq' ? 'Rekomando Një Usta Tjetër' : 'Recommend Another Usta'}
              </button>
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  );
}