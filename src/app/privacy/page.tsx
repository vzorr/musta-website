// src/app/privacy/page.tsx - Privacy Policy page
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';
import styles from '../../styles/PrivacyPage.module.css';

export default function PrivacyPage() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang') as 'sq' | 'en' | null;
  const defaultLanguage = langParam || 'en';

  return (
    <LanguageProvider>
      <div className="font-inter bg-white text-myusta-navy min-h-screen relative overflow-x-hidden">
        <Header />
        
        <main className="w-full relative">
          <div className="w-full bg-white">
            <div className="w-full max-w-[1440px] mx-auto py-12 sm:py-20 px-4 sm:px-8">
              <div className={styles.privacyContainer}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                  <span className={styles.breadcrumbItem}>Home</span>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbItem}>Privacy Policy</span>
                </nav>

                {/* Main Title with Icon */}
                <div className={styles.titleSection}>
                  <div className={styles.titleIcon}>🔒</div>
                  <h1 className={styles.mainTitle}>Privacy Policy</h1>
                </div>

                {/* Introduction */}
                <div className={styles.introSection}>
                  <p className={styles.introText}>
                    We respect your privacy. This section explains how we collect, use, and protect your information.
                  </p>
                </div>

                {/* Divider */}
                <div className={styles.divider}></div>

                {/* Privacy Content */}
                <div className={styles.privacyContent}>
                  {/* Section 1 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>1. What We Collect</h2>
                    <ul className={styles.privacyList}>
                      <li>Your name</li>
                      <li>Your email</li>
                      <li>(Optional) Your location or service interest, if you provide it</li>
                    </ul>
                    <p className={styles.privacyNote}>
                      We do not collect payment details or sensitive personal data at this stage.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>2. How We Use Your Info</h2>
                    <ul className={styles.privacyList}>
                      <li>Notify you about myUsta's progress, updates, and launch</li>
                      <li>Understand general user interest by region or profession</li>
                      <li>Occasionally request feedback or offer early access</li>
                    </ul>
                    <p className={styles.privacyNote}>
                      We will never sell your data or share it with third parties for marketing.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>3. Data Storage</h2>
                    <ul className={styles.privacyList}>
                      <li>We store your data securely using trusted third-party services (such as email management or analytics providers)</li>
                      <li>We take reasonable steps to protect your data from unauthorized access</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>4. Your Rights</h2>
                    <ul className={styles.privacyList}>
                      <li>Request a copy of your data</li>
                      <li>Ask us to delete your data at any time</li>
                      <li>Opt out of emails by clicking 'unsubscribe' in any message or contacting us directly</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>5. Cookies & Analytics</h2>
                    <ul className={styles.privacyList}>
                      <li>We use limited cookies or basic analytics (like Google Analytics) to understand how you interact with our landing page</li>
                      <li>You can disable cookies in your browser settings</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div className={styles.privacySection}>
                    <h2 className={styles.sectionTitle}>6. Future Changes</h2>
                    <ul className={styles.privacyList}>
                      <li>We may update this Privacy Policy before the full platform launch</li>
                      <li>Check back occasionally for changes</li>
                    </ul>
                  </div>
                </div>

                {/* Footer Message */}
                <div className={styles.footerMessage}>
                  <p>
                    Thanks for your interest in myUsta! We're building something meaningful—and you're part of it from the start. 🙌
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
