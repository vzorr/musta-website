// src/components/RegistrationForm.tsx - ✅ UPDATED with Button Component
'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import styles from '../styles/registeration.module.css';
import containerStyles from '../styles/SectionContainer.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
}

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  gdprAccepted: boolean;
  timestamp: string;
}

interface RegistrationFormProps {
  gdprConsents: ConsentState;
}

export default function RegistrationForm({ gdprConsents }: RegistrationFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    category: '',
    location: ''
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.category || !formData.location) {
      setMessage(t('registration.validation.required'));
      setMessageType('error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage(t('registration.validation.email'));
      setMessageType('error');
      return false;
    }

    // Privacy policy acceptance
    if (!privacyAccepted) {
      setMessage(language === 'sq' 
        ? 'Ju duhet të pranoni Politikën e Privatësisë për të vazhduar.'
        : 'You must accept the Privacy Policy to continue.');
      setMessageType('error');
      return false;
    }

    // GDPR consent check (global consent)
    if (!gdprConsents.gdprAccepted) {
      setMessage(language === 'sq'
        ? 'Ju duhet të jepni pëlqimin për mbrojtjen e të dhënave në fund të faqes.'
        : 'You must provide data protection consent at the bottom of the page.');
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
      // Get user's IP and User Agent
      const userAgent = navigator.userAgent;
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language,
          userAgent,
          gdprConsent: gdprConsents.gdprAccepted,
          marketingConsent: marketingOptIn,
          consentDetails: gdprConsents
        }),
      });

      if (response.ok) {
        setMessage(t('registration.success'));
        setMessageType('success');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: '',
          location: ''
        });
        setPrivacyAccepted(false);
        setMarketingOptIn(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || t('registration.error'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    { value: 'tiler', label: t('registration.categories.tiler') },
    { value: 'mason', label: t('registration.categories.mason') },
    { value: 'other', label: t('registration.categories.other') },
  ];

  const locations = [
    { value: 'tirana', label: t('registration.locations.tirana') },
    { value: 'durres', label: t('registration.locations.durres') },
    { value: 'vlore', label: t('registration.locations.vlore') },
    { value: 'shkoder', label: t('registration.locations.shkoder') },
    { value: 'elbasan', label: t('registration.locations.elbasan') },
    { value: 'korce', label: t('registration.locations.korce') },
    { value: 'fier', label: t('registration.locations.fier') },
    { value: 'berat', label: t('registration.locations.berat') },
    { value: 'other', label: t('registration.locations.other') },
  ];

  const fullTitle = t('whyJoin.title');
  const lastWord = fullTitle?.trim().split(/\s+/).slice(-1)[0] || "";
  const words = fullTitle?.trim().split(/\s+/) || [];
  const remainingTitle = words.slice(0, -1).join(" ");

  return (
    <>
      <section id="registration" className="py-12 sm:py-20 bg-myusta-gray relative z-10">
        <div className={containerStyles.sectionContainer}>
          <div className="text-center">
            <div className={`flex flex-row justify-center gap-2 ${styles.registeration}`}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-myusta-navy mb-12 sm:mb-16">
                {remainingTitle}
              </h2>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy`}>{lastWord}</h1>
            </div>
            
            <div className={containerStyles.formContainer}>
              <div className="neumorphic-card p-6 sm:p-8 rounded-2xl bg-myusta-gray relative z-20">
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

                {/* GDPR Status Indicator */}
                {!gdprConsents.gdprAccepted && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {language === 'sq' 
                        ? 'Ju duhet të jepni pëlqimin për cookies në fund të faqes.'
                        : 'You need to accept cookies at the bottom of the page.'
                      }
                    </p>
                  </div>
                )}
                
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('registration.fields.name')} 
                    className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray" 
                    required 
                    maxLength={100}
                  />
                  
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('registration.fields.email')} 
                    className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray" 
                    required 
                    maxLength={150}
                  />
                  
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('registration.fields.phone')} 
                    className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy focus:outline-none bg-myusta-gray" 
                    required 
                    maxLength={20}
                  />
                  
                  <div className="neumorphic-input rounded-lg relative bg-myusta-gray">
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <option value="">{t('registration.locations.placeholder')}</option>
                      {locations.map(location => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Privacy Policy Agreement */}
                  <div className="text-left" style={{ marginTop: '32px' }}>
                    <label className="flex items-start space-x-3 text-sm">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-myusta-yellow border-gray-300 rounded focus:ring-0 flex-shrink-0"
                        required
                      />
                      <span className="text-myusta-text-gray">
                        {language === 'sq' ? (
                          <>
                            Unë pranoj{' '}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyModal(true)}
                              className="text-myusta-blue underline hover:text-myusta-navy"
                            >
                              Politikën e Privatësisë
                            </button>
                            {' '}dhe{' '}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyModal(true)}
                              className="text-myusta-blue underline hover:text-myusta-navy"
                            >
                              Kushtet e Shërbimit
                            </button>
                            .*
                          </>
                        ) : (
                          <>
                            I accept the{' '}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyModal(true)}
                              className="text-myusta-blue underline hover:text-myusta-navy"
                            >
                              Privacy Policy
                            </button>
                            {' '}and{' '}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyModal(true)}
                              className="text-myusta-blue underline hover:text-myusta-navy"
                            >
                              Terms of Service
                            </button>
                            .*
                          </>
                        )}
                      </span>
                    </label>
                  </div>

                  {/* Marketing Consent */}
                  <div className="text-left">
                    <label className="flex items-start space-x-3 text-sm">
                      <input
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        className="mt-1 w-4 h-4 text-myusta-yellow border-gray-300 rounded focus:ring-0 flex-shrink-0"
                      />
                      <span className="text-myusta-text-gray">
                        {language === 'sq' 
                          ? 'Dëshiroj të marr email-e me përditësime dhe ofertat e myUsta (opsionale).'
                          : 'I would like to receive emails with myUsta updates and offers (optional).'
                        }
                      </span>
                    </label>
                  </div>
                  
                  {/* ✅ UPDATED: Using Button Component */}
                  <div className="mt-16">
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      fullWidth
                      loading={isSubmitting}
                      disabled={!privacyAccepted || !gdprConsents.gdprAccepted}
                      className={`text-myusta-navy font-semibold text-lg ${styles.formbtn}`}
                    >
                    {isSubmitting ? (
                      language === 'sq' ? 'Po regjistrohet...' : 'Registering...'
                    ) : (
                      t('registration.cta')
                    )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Modal - keeping existing modal code unchanged */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-myusta-navy">
                  {language === 'sq' ? 'Politika e Privatësisë & Kushtet e Shërbimit' : 'Privacy Policy & Terms of Service'}
                </h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Rest of modal content unchanged */}
          </div>
        </div>
      )}
    </>
  );
}

