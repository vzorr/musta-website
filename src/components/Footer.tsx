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
          {/* Logo and Social */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center">
              <Logo className="w-10 h-10 mr-3" />
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

          {/* Footer Links */}
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

        {/* Footer Bottom */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <Image 
            src="/assets/separator.svg" 
            alt="Separator" 
            width={100}
            height={4}
            className="w-full mb-6 sm:mb-8 opacity-30"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm sm:text-base">
            <p className="text-white text-center sm:text-left">{t('footer.tagline')}</p>
            <p className="text-white text-center sm:text-right">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}