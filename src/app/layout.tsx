import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import LanguageWrapper from '../components/LanguageWrapper';
import GoogleAnalytics from '../components/GoogleAnalytics';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'myUsta - Platforma për Profesionistë',
  description: 'Platforma që lidh pronarët e shtëpive me profesionistë të besuar për të gjitha nevojat e mirëmbajtjes dhe riparimeve.',
  keywords: 'myUsta, profesionistë, hidraulik, elektriçist, piktor, marangoz, mirëmbajtje, riparime',
  authors: [{ name: 'myUsta' }],
  openGraph: {
    title: 'myUsta - Platforma për Profesionistë',
    description: 'Ne e sjellim punën tek ju! Bashkohuni me myUSTA dhe lidhuni me pronarët e shtëpive.',
    type: 'website',
    url: 'https://myusta.com',
    images: '/assets/myusta_logo.svg',
  },
  icons: {
    icon: '/assets/myusta_logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="google" content="notranslate" />
        <link rel="canonical" href="https://myusta.com" />
        {/* <link rel="preload" href="/assets/hero-bg.svg" as="image" type="image/svg+xml" /> */}
        <link rel="preload" href="/assets/myusta_logo.svg" as="image" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedLanguage = localStorage.getItem('myusta-language');
                  if (savedLanguage === 'sq' || savedLanguage === 'en') {
                    document.documentElement.lang = savedLanguage;
                  } else {
                    localStorage.setItem('myusta-language', 'sq');
                    document.documentElement.lang = 'sq';
                  }
                } catch (e) {
                  document.documentElement.lang = 'sq';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-inter bg-myusta-gray text-myusta-navy min-h-screen`}>
        <GoogleAnalytics />
        <LanguageProvider>
          <LanguageWrapper>
            {children}
          </LanguageWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}