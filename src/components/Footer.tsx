'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';
import Image from 'next/image';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-myusta-navy text-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-12 gap-8">
          {/* Left Side - Logo and Social */}
          <div className="space-y-6 sm:space-y-8">
            {/* Logo - Same as header */}
            <div className="flex items-center">
              <Logo variant="custom" width={118} height={40} className="w-[118px] h-[40px]" />
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-facebook-square.svg" 
                  alt="Facebook" 
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-linkedin.svg" 
                  alt="LinkedIn" 
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <a 
                href="#" 
                className="w-6 h-6 hover:scale-110 transition-all duration-200 hover:brightness-125"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/assets/icons___bxl-instagram-alt.svg" 
                  alt="Instagram" 
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </a>
            </div>
          </div>

          {/* Right Side - Footer Links */}
          <div className="text-left sm:text-right space-y-3">
            <a 
              href="#" 
              className="block text-white hover:text-myusta-yellow transition-colors"
            >
              {t('footer.links.privacy')}
            </a>
            <a 
              href="#" 
              className="block text-white hover:text-myusta-yellow transition-colors"
            >
              {t('footer.links.terms')}
            </a>
            <a 
              href="#" 
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
          <p className="text-white text-center sm:text-left">{t('footer.tagline')}</p>
          <p className="text-white text-center sm:text-right">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}