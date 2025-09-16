// src/app/terms/page.tsx - Terms & Conditions page
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';
import styles from '../../styles/TermsPage.module.css';

export default function TermsPage() {
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
              <div className={styles.termsContainer}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                  <a href="/" className={`${styles.breadcrumbItem} ${styles.breadcrumbLink}`}>Home</a>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={`${styles.breadcrumbItem} ${styles.breadcrumbCurrent}`}>Terms & Conditions</span>
                </nav>

                {/* Main Title */}
                <h1 className={styles.mainTitle}>Terms & Conditions</h1>

                {/* Introduction */}
                <div className={styles.introSection}>
                  <p className={styles.introText}>
                    Welcome to myUsta! We're building a platform to connect skilled professionals with those who need their services. 
                    By joining our waitlist, you're helping us create something meaningful.
                  </p>
                </div>

                {/* Divider */}
                <div className={styles.divider}></div>

                {/* Terms Content */}
                <div className={styles.termsContent}>
                  {/* Section 1 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>1. Joining the Waitlist</h2>
                    <ul className={styles.termsList}>
                      <li>By joining our waitlist, you're expressing interest in our upcoming platform.</li>
                      <li>We'll use your email to notify you about our progress and launch.</li>
                      <li>You can unsubscribe from our emails at any time.</li>
                      <li>We may occasionally ask for feedback to improve our service.</li>
                    </ul>
                  </div>

                  {/* Section 2 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>2. Intellectual Property</h2>
                    <ul className={styles.termsList}>
                      <li>All content on this website, including text, graphics, logos, and software, is our property.</li>
                      <li>You may not reproduce, distribute, or create derivative works without permission.</li>
                      <li>myUsta and our logo are trademarks of our company.</li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>3. No Warranties (Yet!)</h2>
                    <ul className={styles.termsList}>
                      <li>This website and our upcoming platform are provided "as is" without warranties.</li>
                      <li>We're still building, so things might change or be delayed.</li>
                      <li>We'll do our best to keep you informed about any changes.</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
                    <ul className={styles.termsList}>
                      <li>We're not liable for any damages arising from your use of this website.</li>
                      <li>This includes direct, indirect, incidental, or consequential damages.</li>
                      <li>Our total liability is limited to the amount you've paid us (which is currently $0).</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>5. Changes to Terms</h2>
                    <ul className={styles.termsList}>
                      <li>We may update these terms before our full platform launch.</li>
                      <li>We'll notify you of any significant changes via email.</li>
                      <li>Continued use of our services constitutes acceptance of new terms.</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>6. Contact Us</h2>
                    <p className={styles.contactText}>
                      Questions about these terms? Reach out to us at{' '}
                      <a href="mailto:legal@myusta.com" className={styles.contactLink}>
                        legal@myusta.com
                      </a>
                    </p>
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
