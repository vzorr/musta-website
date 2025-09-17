// src/components/Footer.tsx - Updated with max-width constraint
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';
import Image from 'next/image';
import styles from '../styles/footer.module.css';


export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-myusta-navy text-white py-12 sm:py-16">
      {/* UPDATED: Added max-width container */}
      <div className="w-full max-w-[1000px] mx-auto global-main-page">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between ilg:tems-start items-center mb-8 sm:mb-12 gap-8">
          {/* Left Side - Logo and Social */}
          <div className="space-y-6 sm:space-y-8">
            {/* Logo - Same as header */}
            <div className="flex items-center">
              <Logo variant="custom" width={118} height={40} className="w-[118px] h-[40px]" />
            </div>
            
            {/* Social Icons */}
            <div className={`flex space-x-6 ${styles.social_icon}`}>
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125 rounded group"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-facebook-square.svg" 
                  alt="Facebook" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125 rounded group"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-linkedin.svg" 
                  alt="LinkedIn" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125 rounded group"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-instagram-alt.svg" 
                  alt="Instagram" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0"
                />
              </a>
            </div>
          </div>

          {/* Right Side - Footer Links */}
          <div className="text-center sm:text-right space-y-3">
            <a 
              href="/legal" 
              className="block text-white hover:text-myusta-yellow transition-colors"
            >
              {t('footer.links.termsAndConditions')}
            </a>
            <a 
              href="/contact" 
              className="block text-white hover:text-myusta-yellow transition-colors"
            >
              {t('footer.links.contact')}
            </a>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/20 mb-6 sm:mb-8"></div>

        {/* Footer Bottom - Two Column Layout like Figma */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm sm:text-base">
          <p className={`text-white text-center sm:text-left ${styles.copy_para}`}>{t('footer.tagline')}</p>
          {/* Social Icons for mobile view */}
            <div className={`flex space-x-6 justify-start ${styles.social_icon_mobile}`}>
              <a 
                href="#" 
                className="w-6 h-6 transition-all duration-200 group rounded"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-facebook-square.svg" 
                  alt="Facebook" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0 group-hover:drop-shadow-[0_0_6px_#FFC800]"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 transition-all duration-200 group rounded"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-linkedin.svg" 
                  alt="LinkedIn" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0 group-hover:drop-shadow-[0_0_6px_#FFC800]"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 transition-all duration-200 group rounded"
                style={{ 
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC800'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-instagram-alt.svg" 
                  alt="Instagram" 
                  width={24}
                  height={24}
                  className="w-full h-full transition-all duration-200 group-hover:brightness-0 group-hover:drop-shadow-[0_0_6px_#FFC800]"
                />
              </a>
            </div>
          <p className={`text-white text-center sm:text-right ${styles.copyrighttext}`}>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>

  );
}