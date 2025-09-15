'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import TwoLineTitle from './TwoLineTitle';
import Description from './Description';
import Image from 'next/image';
import styles from '../styles/registeration.module.css';
import containerStyles from '../styles/SectionContainer.module.css';
import RecommendUstaForm from './RecommendUstaForm';
import Title from './Title';

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
    <section id="waitlist" className="bg-myusta-gray relative z-10 pb-16">
      <div className="max-w-[1000px] mx-auto">
        {/* Register Today Section */}
        {showWaitlistForm && (
          <div className="text-center">
            <div className="mb-12">
              <TwoLineTitle 
                firstLine={language === 'sq' ? 'Regjistrohu Sot.' : 'Register Today.'}
                secondLine={language === 'sq' ? 'Është Falas!' : 'It\'s Free!'}
                firstLineBold={false}
                secondLineBold={true}
                as="h2"
                centered={true}
              />
            </div>
          
          <div className="mx-auto" style={{ maxWidth: '400px' }}>
            <div className="neumorphic-card p-6 sm:p-8 rounded-2xl bg-myusta-gray relative z-20">
              <div 
                className="text-xl font-semibold text-myusta-navy mb-8 text-center"
                dangerouslySetInnerHTML={{ 
                  __html: language === 'sq' ? 'Plotësoni informacionin më poshtë.' : 'Fill out the following<br />information below.' 
                }}
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
              
              <form className="space-y-4" onSubmit={handleWaitlistSubmit}>
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
                  className="text-myusta-navy font-semibold text-lg rounded-lg"
                  style={{ marginTop: '32px' }}
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

        {showRegistrationSuccess && (
          <div className=" text-center max-w-2xl mx-auto flex flex-col items-center " style={{marginTop: -100}}>
            <div style={{ height: 64 }} />
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <Image 
                src="/assets/tick.svg" 
                alt="Success" 
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <div style={{ height: 24 }} />
             <Title 
               firstText={language === 'sq' ? 'Sukses!' : 'Success!'} 
               className="mb-4"
               style={{
                 color: 'var(--Navy, #00203F)',
                 textAlign: 'center',
                 fontFamily: 'Inter',
                 fontSize: '20px',
                 fontStyle: 'normal',
                 fontWeight: '600',
                 lineHeight: '120%'
               }}
             />
            <div style={{ height: 24 }} />
            <Description className="text-base leading-[22.4px]">
              {language === 'sq' 
                ? 'Faleminderit që jeni pjesë e komunitetit tonë të listës së pritjes. Do t\'ju informojmë me përditësime, datat e nisjes dhe lajmet ekskluzive.'
                : 'Thank you for being part of our waitlist community. We\'ll keep you informed with updates, launch dates, and exclusive news.'
              }
            </Description>
          </div>
        )}

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <TwoLineTitle 
              firstLine={language === 'sq' ? 'Ndihmoni të Rritim' : 'Help us Grow'}
              secondLine={language === 'sq' ? 'Komunitetin!' : 'the Community!'}
              firstLineBold={true}
              secondLineBold={false}
              as="h2"
              centered={true}
            />
          </div>
          <div className="mb-6 text-center">
            {language === 'sq' 
              ? (
                <>
                  <Description className="mb-2">Njihni ndonjë Usta që do të përfitojë nga mundësitë e punës?</Description>
                  <Description>Rekomandojeni më poshtë.</Description>
                </>
              )
              : (
                <>
                  <Description className="mb-2">Know a fellow Usta who would benefit from job opportunities?</Description>
                  <Description>Recommend them below.</Description>
                </>
              )
            }
          </div>
          
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
