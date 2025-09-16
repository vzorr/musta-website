// src/components/GDPRConsent.tsx - Improved version with auto-display
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface GDPRConsentProps {
  onConsentChange?: (consents: ConsentState) => void;
  required?: boolean;
}

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  gdprAccepted: boolean;
  timestamp: string;
}

export default function GDPRConsent({ onConsentChange, required = false }: GDPRConsentProps) {
  const { t, language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [consents, setConsents] = useState<ConsentState>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    gdprAccepted: false,
    timestamp: ''
  });

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = Cookies.get('myusta-gdpr-consent');
    if (!existingConsent) {
      // Show banner immediately on page load if no consent exists
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(existingConsent);
      setConsents(parsed);
      if (onConsentChange && parsed.gdprAccepted) {
        onConsentChange(parsed);
      }
    }
  }, []);

  const handleConsentChange = (type: keyof ConsentState, value: boolean) => {
    const newConsents = { ...consents, [type]: value };
    setConsents(newConsents);
  };

  const acceptAll = () => {
    const newConsents: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      gdprAccepted: true,
      timestamp: new Date().toISOString()
    };
    
    saveConsents(newConsents);
  };

  const acceptNecessary = () => {
    const newConsents: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      gdprAccepted: true,
      timestamp: new Date().toISOString()
    };
    
    saveConsents(newConsents);
  };

  const saveCustomConsents = () => {
    const newConsents: ConsentState = {
      ...consents,
      gdprAccepted: true,
      timestamp: new Date().toISOString()
    };
    
    saveConsents(newConsents);
    setShowModal(false);
  };

  const saveConsents = (consentData: ConsentState) => {
    // Save to cookies (expires in 1 year)
    Cookies.set('myusta-gdpr-consent', JSON.stringify(consentData), { expires: 365 });
    
    // Update state
    setConsents(consentData);
    setShowBanner(false);
    setShowModal(false);
    
    // Notify parent component
    onConsentChange?.(consentData);
  };

  const resetConsents = () => {
    Cookies.remove('myusta-gdpr-consent');
    setConsents({
      necessary: true,
      analytics: false,
      marketing: false,
      gdprAccepted: false,
      timestamp: ''
    });
    setShowBanner(true);
  };

  // Don't render anything if consent is already given and not required
  if (!showBanner && !required) {
    return null;
  }

  return (
    <>
      {/* GDPR Banner - Fixed at bottom of screen */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-myusta-navy text-white z-50 shadow-2xl border-t-4 border-myusta-yellow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-myusta-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-myusta-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-myusta-yellow">
                    {language === 'sq' ? 'Respektimi i Privatësisë' : 'Privacy Respect'}
                  </h3>
                </div>
                
                <p className="text-sm sm:text-base leading-relaxed text-gray-200 max-w-4xl">
                  {language === 'sq' 
                    ? 'Ne përdorim cookies dhe teknologji të ngjashme për të përmirësuar përvojën tuaj në faqen tonë, për analitikë dhe për marketing. Duke vazhduar të përdorni faqen tonë, ju pranoni përdorimin e cookies sipas Politikës së Privatësisë.'
                    : 'We use cookies and similar technologies to improve your experience on our site, for analytics, and for marketing. By continuing to use our site, you consent to the use of cookies in accordance with our Privacy Policy.'
                  }
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-row gap-2 sm:gap-3 min-w-max">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 border-2 border-white text-white hover:bg-white hover:text-myusta-navy transition-all duration-200 rounded-lg text-sm font-medium"
                >
                  {language === 'sq' ? 'Personalizoni' : 'Customize'}
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border-2 border-myusta-yellow text-myusta-yellow hover:bg-myusta-yellow hover:text-myusta-navy transition-all duration-200 rounded-lg text-sm font-medium"
                >
                  {language === 'sq' ? 'Vetëm të Nevojshme' : 'Necessary Only'}
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 bg-myusta-yellow text-myusta-navy hover:bg-yellow-400 transition-all duration-200 rounded-lg text-sm font-bold shadow-lg"
                >
                  {language === 'sq' ? 'Pranoji të Gjitha' : 'Accept All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Modal - Enhanced Design */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-myusta-navy to-myusta-blue text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-myusta-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-myusta-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'sq' ? 'Menaxhimi i Cookies' : 'Cookie Management'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <p className="text-myusta-text-gray text-base leading-relaxed">
                {language === 'sq'
                  ? 'Mund të zgjidhni llojin e cookies që dëshironi të pranoni. Këto preferencat do të ruhen dhe mund t\'i ndryshoni në çdo kohë.'
                  : 'You can choose which types of cookies you want to accept. These preferences will be saved and you can change them at any time.'
                }
              </p>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-6 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-myusta-navy text-lg">
                        {language === 'sq' ? 'Cookies të Nevojshme' : 'Necessary Cookies'}
                      </h3>
                    </div>
                    <p className="text-sm text-green-700 leading-relaxed">
                      {language === 'sq'
                        ? 'Këto cookies janë të nevojshme për funksionimin bazë të faqes dhe nuk mund të çaktivizohen.'
                        : 'These cookies are necessary for the basic functionality of the site and cannot be disabled.'
                      }
                    </p>
                  </div>
                  <div className="ml-6">
                    <div className="w-14 h-8 bg-green-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl hover:border-myusta-yellow transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-myusta-navy text-lg">
                        {language === 'sq' ? 'Cookies Analitike' : 'Analytics Cookies'}
                      </h3>
                    </div>
                    <p className="text-sm text-myusta-text-gray leading-relaxed">
                      {language === 'sq'
                        ? 'Këto cookies na ndihmojnë të kuptojmë se si përdoruesit ndërveprojnë me faqen tonë.'
                        : 'These cookies help us understand how users interact with our site.'
                      }
                    </p>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => handleConsentChange('analytics', !consents.analytics)}
                      className={`w-14 h-8 rounded-full flex items-center transition-all duration-300 ${
                        consents.analytics ? 'bg-myusta-yellow justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-6 h-6 bg-white rounded-full mx-1 shadow-md transition-transform"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl hover:border-myusta-yellow transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-myusta-navy text-lg">
                        {language === 'sq' ? 'Cookies të Marketingut' : 'Marketing Cookies'}
                      </h3>
                    </div>
                    <p className="text-sm text-myusta-text-gray leading-relaxed">
                      {language === 'sq'
                        ? 'Këto cookies përdoren për të ju treguar reklama të personalizuara.'
                        : 'These cookies are used to show you personalized advertisements.'
                      }
                    </p>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => handleConsentChange('marketing', !consents.marketing)}
                      className={`w-14 h-8 rounded-full flex items-center transition-all duration-300 ${
                        consents.marketing ? 'bg-myusta-yellow justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-6 h-6 bg-white rounded-full mx-1 shadow-md transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-xl font-medium"
                >
                  {language === 'sq' ? 'Anulo' : 'Cancel'}
                </button>
                <button
                  onClick={saveCustomConsents}
                  className="flex-1 px-6 py-3 bg-myusta-yellow text-myusta-navy hover:bg-yellow-400 transition-colors rounded-xl font-bold shadow-lg"
                >
                  {language === 'sq' ? 'Ruaj Preferencat' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Summary (for forms) */}
      {required && consents.gdprAccepted && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {language === 'sq' ? 'Pëlqimi GDPR është dhënë' : 'GDPR consent has been given'}
          </p>
          <button
            onClick={resetConsents}
            className="text-sm text-green-600 hover:text-green-800 underline mt-1"
          >
            {language === 'sq' ? 'Ndrysho preferencat' : 'Change preferences'}
          </button>
        </div>
      )}

      {/* Required consent notice for forms */}
      {required && !consents.gdprAccepted && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {language === 'sq' 
              ? 'Ju duhet të jepni pëlqimin për mbrojtjen e të dhënave përpara se të vazhdoni.'
              : 'You need to provide data protection consent before proceeding.'
            }
          </p>
        </div>
      )}
    </>
  );
}