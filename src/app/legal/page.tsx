// src/app/legal/page.tsx - Combined Terms & Conditions and Privacy Policy page
'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Title from '../../components/Title';
import { LanguageProvider } from '../../contexts/LanguageContext';
import styles from '../../styles/LegalPage.module.css';

export default function LegalPage() {
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
              <div className={styles.legalContainer}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                  <a href="/" className={`${styles.breadcrumbItem} ${styles.breadcrumbLink}`}>Home</a>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={`${styles.breadcrumbItem} ${styles.breadcrumbCurrent}`}>Terms & Conditions</span>
                </nav>

                {/* Main Title */}
                <Title 
                  firstText="Terms"
                  secondText="& Conditions"
                  as="h1"
                  centered={true}
                  className={styles.mainTitle}
                />

                {/* Terms & Conditions Section */}
                <div className={styles.legalSection}>
                  <h2 className={styles.sectionTitle}>Welcome to myUsta!</h2>
                  <p className={styles.sectionText}>
                    myUsta is a platform in development that will help customers connect with skilled tradespeople ("Ustas") for home improvement and service jobs. This landing page allows you to join our waitlist and be among the first to try it.
                  </p>
                  
                  {/* Divider after Welcome section */}
                  <div className={styles.welcomeDivider}></div>

                  <h3 className={styles.subsectionTitle}>1. Joining the Waitlist</h3>
                  <p className={styles.sectionText}>
                    By submitting your information, you agree:
                  </p>
                  <ul className={styles.legalList}>
                    <li>You are at least 18 years old.</li>
                    <li>The information you provide (like name and email) is accurate.</li>
                    <li>You're okay with us contacting you about myUsta updates and launch info.</li>
                  </ul>
                  <p className={styles.sectionText}>
                    You are not committing to use the service, and we are not committing to accept every waitlist signup into the full platform.
                  </p>

                  <h3 className={styles.subsectionTitle}>2. Intellectual Property</h3>
                  <p className={styles.sectionText}>
                    All content on this site—including text, logos, designs, and visuals—is owned by or licensed to myUsta. Don't use, reproduce, or modify anything without our written permission.
                  </p>

                  <h3 className={styles.subsectionTitle}>3. No Warranties (Yet!)</h3>
                  <p className={styles.sectionText}>
                    Since this is an early access preview, the waitlist page is provided "as is." We can't guarantee availability, accuracy, or performance. We're still building!
                  </p>

                  <h3 className={styles.subsectionTitle}>4. Limitation of Liability</h3>
                  <p className={styles.sectionText}>
                    We're not liable for:
                  </p>
                  <ul className={styles.legalList}>
                    <li>Any errors or bugs on the waitlist site,</li>
                    <li>Losses resulting from relying on preliminary info about our platform,</li>
                    <li>Issues related to third-party tools or services.</li>
                  </ul>
                </div>

              

                {/* Privacy Policy Section */}
                <div className={styles.legalSection}>
                  <h2 className={styles.sectionTitle}>🔐 Privacy Policy</h2>
                  <p className={styles.sectionText}>
                    We respect your privacy. This section explains how we collect, use, and protect your information.
                  </p>

                  <div className={styles.divider}></div>
                  
                  <h3 className={styles.subsectionTitle}>1. What We Collect</h3>
                  <p className={styles.sectionText}>
                    When you join the waitlist, we may collect:
                  </p>
                  <ul className={styles.legalList}>
                    <li>Your name</li>
                    <li>Your email</li>
                    <li>(Optional) Your location or service interest, if you provide it</li>
                  </ul>
                  <p className={styles.sectionText}>
                    We do not collect payment details or sensitive personal data at this stage.
                  </p>

                  <h3 className={styles.subsectionTitle}>2. How We Use Your Info</h3>
                  <p className={styles.sectionText}>
                    We use your info to:
                  </p>
                  <ul className={styles.legalList}>
                    <li>Notify you about myUsta's progress, updates, and launch,</li>
                    <li>Understand general user interest by region or profession,</li>
                    <li>Occasionally request feedback or offer early access.</li>
                  </ul>
                  <p className={styles.sectionText}>
                    We will never sell your data or share it with third parties for marketing.
                  </p>

                  <h3 className={styles.subsectionTitle}>3. Data Storage</h3>
                  <p className={styles.sectionText}>
                    Your data is stored securely using trusted third-party services (such as email management or analytics providers). We take reasonable steps to protect your data from unauthorized access.
                  </p>

                  <h3 className={styles.subsectionTitle}>4. Your Rights</h3>
                  <p className={styles.sectionText}>
                    You may:
                  </p>
                  <ul className={styles.legalList}>
                    <li>Request a copy of your data,</li>
                    <li>Ask us to delete your data at any time,</li>
                    <li>Opt out of emails by clicking "unsubscribe" in any message or contacting us directly.</li>
                  </ul>

                  <h3 className={styles.subsectionTitle}>5. Cookies & Analytics</h3>
                  <p className={styles.sectionText}>
                    We may use limited cookies or basic analytics (like Google Analytics) to see how users interact with the landing page. You can disable cookies in your browser settings.
                  </p>

                  <h3 className={styles.subsectionTitle}>6. Future Changes</h3>
                  <p className={styles.sectionText}>
                    We may update this Privacy Policy before launching the full platform. Check back occasionally for changes.
                  </p>
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
