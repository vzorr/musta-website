import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // FIXED: Added metadataBase to resolve the warning
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://myusta.com" />
      </head>
      <body className={`${inter.className} font-inter bg-myusta-gray text-myusta-navy min-h-screen`}>
        {children}
      </body>
    </html>
  );
}