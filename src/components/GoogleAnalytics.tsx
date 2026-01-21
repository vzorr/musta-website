'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  // Don't render anything if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Helper function to track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common events for MyUSTA Landing Page
export const analyticsEvents = {
  // Waitlist events
  waitlistFormStart: () => trackEvent('form_start', 'waitlist', 'waitlist_form'),
  waitlistFormSubmit: () => trackEvent('form_submit', 'waitlist', 'waitlist_form'),
  waitlistFormError: (error: string) => trackEvent('form_error', 'waitlist', error),

  // Recommend USTA events
  recommendFormStart: () => trackEvent('form_start', 'recommend', 'recommend_usta_form'),
  recommendFormSubmit: () => trackEvent('form_submit', 'recommend', 'recommend_usta_form'),

  // Navigation events
  navClick: (section: string) => trackEvent('click', 'navigation', section),
  ctaClick: (ctaName: string) => trackEvent('click', 'cta', ctaName),

  // App download events
  appStoreClick: () => trackEvent('click', 'app_download', 'app_store'),
  playStoreClick: () => trackEvent('click', 'app_download', 'play_store'),

  // Language change
  languageChange: (language: string) => trackEvent('language_change', 'settings', language),
};
