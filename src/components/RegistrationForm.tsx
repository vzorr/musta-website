'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
}

export default function RegistrationForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    category: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(t('registration.success'));
        setMessageType('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: '',
          location: ''
        });
      } else {
        setMessage(t('registration.error'));
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t('registration.error'));
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'plumber', label: t('registration.categories.plumber') },
    { value: 'electrician', label: t('registration.categories.electrician') },
    { value: 'painter', label: t('registration.categories.painter') },
    { value: 'carpenter', label: t('registration.categories.carpenter') },
    { value: 'other', label: t('registration.categories.other') },
  ];

  const locations = [
    { value: 'tirana', label: t('registration.locations.tirana') },
    { value: 'durres', label: t('registration.locations.durres') },
    { value: 'vlore', label: t('registration.locations.vlore') },
    { value: 'shkoder', label: t('registration.locations.shkoder') },
    { value: 'elbasan', label: t('registration.locations.elbasan') },
    { value: 'korce', label: t('registration.locations.korce') },
    { value: 'other', label: t('registration.locations.other') },
  ];

  return (
    <section id="registration" className="py-12 sm:py-20 bg-myusta-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy mb-12 sm:mb-16">
          {t('registration.title')}
        </h2>
        
        <div className="neumorphic-card p-6 sm:p-8 rounded-2xl max-w-md mx-auto">
          <div 
            className="text-xl font-semibold text-myusta-navy mb-8"
            dangerouslySetInnerHTML={{ __html: t('registration.formTitle') }}
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
              placeholder={t('registration.fields.name')} 
              className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy focus:outline-none" 
              required 
            />
            
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('registration.fields.email')} 
              className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy focus:outline-none" 
              required 
            />
            
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('registration.fields.phone')} 
              className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy focus:outline-none" 
              required 
            />
            
            <div className="neumorphic-input rounded-lg relative">
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 bg-transparent border-0 text-myusta-navy appearance-none focus:outline-none" 
                required
              >
                <option value="">{t('registration.categories.placeholder')}</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Image 
                  src="/assets/vector.svg" 
                  alt="Dropdown" 
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            </div>
            
            <div className="neumorphic-input rounded-lg relative">
              <select 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 bg-transparent border-0 text-myusta-navy appearance-none focus:outline-none" 
                required
              >
                <option value="">{t('registration.locations.placeholder')}</option>
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Image 
                  src="/assets/vector.svg" 
                  alt="Dropdown" 
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="neumorphic-btn w-full py-3 rounded-lg text-myusta-navy font-semibold text-lg hover:scale-105 transition-transform mt-8 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-myusta-yellow focus:ring-offset-2"
            >
              {isSubmitting ? '...' : t('registration.cta')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}