import Head from 'next/head';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import HowItWorksSection from '../components/HowItWorksSection';
import RegistrationForm from '../components/RegistrationForm';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function Home() {
  return (
    <LanguageProvider>
      <Head>
        <title>myUsta - Platforma për Profesionistë</title>
        <meta name="description" content="Platforma që lidh pronarët e shtëpive me profesionistë të besuar për të gjitha nevojat e mirëmbajtjes dhe riparimeve." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="myUsta, profesionistë, hidraulik, elektriçist, piktor, marangoz, mirëmbajtje, riparime" />
        <meta name="author" content="myUsta" />
        <meta property="og:title" content="myUsta - Platforma për Profesionistë" />
        <meta property="og:description" content="Ne e sjellim punën tek ju! Bashkohuni me myUSTA dhe lidhuni me pronarët e shtëpive." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myusta.com" />
        <meta property="og:image" content="/assets/myusta_logo.svg" />
        <link rel="icon" href="/assets/myusta_logo.svg" />
        <link rel="canonical" href="https://myusta.com" />
      </Head>

      <div className="font-inter bg-myusta-gray text-myusta-navy min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <WhyJoinSection />
          <HowItWorksSection />
          <RegistrationForm />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}