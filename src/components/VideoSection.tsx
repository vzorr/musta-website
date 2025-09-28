// src/components/VideoSection.tsx - Video section component
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';
import styles from '../styles/VideoSection.module.css';

export default function VideoSection() {
  const { t } = useLanguage();

  useEffect(() => {
    // Load Vimeo player script
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <section className={styles.videoSection}>
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <div 
            className={styles.vimeoContainer}
            // style={{ padding: '56.25% 0 0 0', position: 'relative' }}
          >
            <iframe
              src="https://player.vimeo.com/video/1121818474?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
              title="myUSTA"
              className={styles.vimeoIframe}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
