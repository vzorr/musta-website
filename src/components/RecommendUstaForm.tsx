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
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
          Fill out the following
          information below.
          </h2>
        </div>

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
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy placeholder-opacity-70 focus:outline-none bg-myusta-gray" 
            required 
            maxLength={100}
          />
          
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={language === 'sq' ? 'Numri i Telefonit' : 'Phone Number'} 
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy placeholder-opacity-70 focus:outline-none bg-myusta-gray" 
            required 
            maxLength={20}
          />
          
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={`${language === 'sq' ? 'E-Mail' : 'E-Mail'} (${language === 'sq' ? 'Opsionale' : 'Optional'})`} 
            className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy placeholder-opacity-70 focus:outline-none bg-myusta-gray" 
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
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#00203F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#00203F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting 
              ? 'Registering...' 
              : 'Recommend Usta'}
          </Button>
        </form>
      </div>
    </div>
  );
}