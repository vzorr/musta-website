// src/components/GDPRConsent.tsx
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
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(existingConsent);
      setConsents(parsed);
      onConsentChange?.(parsed);
    }
  }, [onConsentChange]);

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

  if (!showBanner && !required) {
    return null;
  }

  return (
    <>
      {/* GDPR Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-myusta-navy text-white p-4 sm:p-6 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-lg">
                  {language === 'sq' ? 'Respektimi i Privatësisë' : 'Privacy Respect'}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  {language === 'sq' 
                    ? 'Ne përdorim cookies dhe teknologji të ngjashme për të përmirësuar përvojën tuaj në faqen tonë, për analitikë dhe për marketing. Duke vazhduar të përdorni faqen tonë, ju pranoni përdorimin e cookies sipas Politikës së Privatësisë.'
                    : 'We use cookies and similar technologies to improve your experience on our site, for analytics, and for marketing. By continuing to use our site, you consent to the use of cookies in accordance with our Privacy Policy.'
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 min-w-max">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 border border-white text-white hover:bg-white hover:text-myusta-navy transition-colors rounded-lg text-sm font-medium"
                >
                  {language === 'sq' ? 'Personalizoni' : 'Customize'}
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border border-white text-white hover:bg-white hover:text-myusta-navy transition-colors rounded-lg text-sm font-medium"
                >
                  {language === 'sq' ? 'Vetëm të Nevojshme' : 'Necessary Only'}
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-myusta-yellow text-myusta-navy hover:bg-yellow-400 transition-colors rounded-lg text-sm font-bold"
                >
                  {language === 'sq' ? 'Pranoji të Gjitha' : 'Accept All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-myusta-navy">
                  {language === 'sq' ? 'Menaxhimi i Cookies' : 'Cookie Management'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Image src="/assets/vector.svg" alt="Close" width={16} height={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-myusta-text-gray">
                {language === 'sq'
                  ? 'Mund të zgjidhni llojin e cookies që dëshironi të pranoni. Këto preferencat do të ruhen dhe mund t\'i ndryshoni në çdo kohë.'
                  : 'You can choose which types of cookies you want to accept. These preferences will be saved and you can change them at any time.'
                }
              </p>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-myusta-navy mb-2">
                      {language === 'sq' ? 'Cookies të Nevojshme' : 'Necessary Cookies'}
                    </h3>
                    <p className="text-sm text-myusta-text-gray">
                      {language === 'sq'
                        ? 'Këto cookies janë të nevojshme për funksionimin bazë të faqes dhe nuk mund të çaktivizohen.'
                        : 'These cookies are necessary for the basic functionality of the site and cannot be disabled.'
                      }
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-myusta-yellow rounded-full flex items-center justify-end px-1">
                      <div className="w-5 h-5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-myusta-navy mb-2">
                      {language === 'sq' ? 'Cookies Analitike' : 'Analytics Cookies'}
                    </h3>
                    <p className="text-sm text-myusta-text-gray">
                      {language === 'sq'
                        ? 'Këto cookies na ndihmojnë të kuptojmë se si përdoruesit ndërveprojnë me faqen tonë.'
                        : 'These cookies help us understand how users interact with our site.'
                      }
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleConsentChange('analytics', !consents.analytics)}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        consents.analytics ? 'bg-myusta-yellow justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-myusta-navy mb-2">
                      {language === 'sq' ? 'Cookies të Marketingut' : 'Marketing Cookies'}
                    </h3>
                    <p className="text-sm text-myusta-text-gray">
                      {language === 'sq'
                        ? 'Këto cookies përdoren për të ju treguar reklama të personalizuara.'
                        : 'These cookies are used to show you personalized advertisements.'
                      }
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleConsentChange('marketing', !consents.marketing)}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        consents.marketing ? 'bg-myusta-yellow justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg font-medium"
                >
                  {language === 'sq' ? 'Anulo' : 'Cancel'}
                </button>
                <button
                  onClick={saveCustomConsents}
                  className="flex-1 px-4 py-2 bg-myusta-yellow text-myusta-navy hover:bg-yellow-400 transition-colors rounded-lg font-bold"
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
          <p className="text-sm text-green-800">
            ✅ {language === 'sq' ? 'Pëlqimi GDPR është dhënë' : 'GDPR consent has been given'}
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
          <p className="text-sm text-yellow-800">
            ⚠️ {language === 'sq' 
              ? 'Ju duhet të jepni pëlqimin për mbrojtjen e të dhënave përpara se të vazhdoni.'
              : 'You need to provide data protection consent before proceeding.'
            }
          </p>
        </div>
      )}
    </>
  );
}