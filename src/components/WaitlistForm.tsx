'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import styles from '../styles/registeration.module.css';
import containerStyles from '../styles/SectionContainer.module.css';
import RecommendUstaForm from './RecommendUstaForm';

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
}

export default function WaitlistForm() {
  const { t, language } = useLanguage();
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
  const [showRecommendForm, setShowRecommendForm] = useState(false);
  const [showCommunitySection, setShowCommunitySection] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(true);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.category || !formData.location) {
      setMessage(language === 'sq' ? 'Ju lutemi plotësoni të gjitha fushat' : 'Please fill in all fields');
      setMessageType('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage(language === 'sq' ? 'Email jo i vlefshëm' : 'Invalid email address');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const userAgent = navigator.userAgent;
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language,
          userAgent,
          gdprConsent: true,
          marketingConsent: false
        }),
      });

      if (response.ok) {
        setMessage(language === 'sq' 
          ? 'U regjistruat me sukses në listën e pritjes!' 
          : 'Successfully registered in waiting list!');
        setMessageType('success');
        
        // Show recommend form after successful waitlist registration
        console.log('Setting showRecommendForm to true');
        setShowRecommendForm(true);
        setShowCommunitySection(false);
        setShowWaitlistForm(false);
        setShowRegistrationSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: '',
          location: ''
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || (language === 'sq' ? 'Gabim gjatë regjistrimit' : 'Registration error'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(language === 'sq' ? 'Gabim gjatë regjistrimit' : 'Registration error');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'plumber', label: language === 'sq' ? 'Hidraulik' : 'Plumber' },
    { value: 'electrician', label: language === 'sq' ? 'Elektricist' : 'Electrician' },
    { value: 'painter', label: language === 'sq' ? 'Bojaxhi' : 'Painter' },
    { value: 'carpenter', label: language === 'sq' ? 'Marangoz' : 'Carpenter' },
    { value: 'tiler', label: language === 'sq' ? 'Pllakështrues' : 'Tiler' },
    { value: 'mason', label: language === 'sq' ? 'Murator' : 'Mason' },
    { value: 'woodworker', label: language === 'sq' ? 'Zdrukthëtar' : 'Woodworker' },
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

  console.log('showRecommendForm state:', showRecommendForm);
  console.log('showCommunitySection state:', showCommunitySection);

  return (
    <section id="waitlist" className="py-12 sm:py-20 bg-myusta-gray relative z-10">
      <div className={containerStyles.sectionContainer}>
        {/* Register Today Section */}
        {showWaitlistForm && (
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy mb-12 sm:mb-16">
              {language === 'sq' ? 'Regjistrohu Sot. Është Falas!' : 'Register Today. It\'s Free!'}
            </h2>
          
          <div className={containerStyles.formContainer}>
            <div className="neumorphic-card p-6 sm:p-8 rounded-2xl bg-myusta-gray relative z-20">
              <div className="text-xl font-semibold text-myusta-navy mb-8 text-center">
                {language === 'sq' ? 'Plotësoni informacionin më poshtë.' : 'Fill out the following information below.'}
              </div>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {message}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleWaitlistSubmit}>
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
                  placeholder={language === 'sq' ? 'E-Mail' : 'E-Mail'} 
                  className="neumorphic-input w-full p-3 rounded-lg border-0 text-myusta-navy placeholder-myusta-navy placeholder-opacity-70 focus:outline-none bg-myusta-gray" 
                  required 
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
                    <option value="">{language === 'sq' ? 'Vendndodhja' : 'Location'}</option>
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
                
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isSubmitting}
                  className="text-myusta-navy font-semibold text-lg mt-8 rounded-lg"
                >
                  {isSubmitting ? (
                    language === 'sq' ? 'Po regjistrohet...' : 'Registering...'
                  ) : (
                    language === 'sq' ? 'Bashkohu në Listën e Pritjes!' : 'Join the Waiting List!'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        )}


        {/* Help us Grow the Community Section - Always show title and description */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-myusta-navy mb-4 sm:mb-6">
            {language === 'sq' ? 'Ndihmoni të Rritim Komunitetin!' : 'Help us Grow the Community!'}
          </h2>
          <p className="text-lg sm:text-xl text-myusta-text-gray mb-8 text-center text-[#898888]">
            {language === 'sq' 
              ? 'Njihni ndonjë Usta që do të përfitojë nga mundësitë e punës? Rekomandojeni më poshtë.'
              : 'Know a fellow Usta who would benefit from job opportunities? Recommend them below.'
            }
          </p>
          
          {/* Success essage for waitlist registration - only show after successful registration */}
          {showRegistrationSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
              {language === 'sq' 
                ? 'U regjistruat me sukses në listën e pritjes! Tani mund të rekomandoni një Usta.'
                : 'Successfully registered in waiting list! Now you can recommend an Usta.'
              }
            </div>
          )}
          
          {!showRecommendForm ? (
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <Button
                  onClick={() => {
                    console.log('Debug: Setting showRecommendForm to true');
                    setShowRecommendForm(true);
                    setShowCommunitySection(false);
                    setShowWaitlistForm(false);
                  }}
                  variant="primary"
                  size="large"
                  fullWidth
                  className="text-myusta-navy font-semibold text-lg py-4 rounded-lg"
                >
                  {language === 'sq' ? 'Rekomando Usta' : 'Recommend an Usta'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <RecommendUstaForm />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
