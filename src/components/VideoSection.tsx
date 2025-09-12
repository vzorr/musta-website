// src/components/VideoSection.tsx - Video section component
'use client';

import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/VideoSection.module.css';

export default function VideoSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.videoSection}>
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <div className={styles.videoPlaceholder}>
            <div className={styles.playButton}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={styles.playIcon}
              >
                <path 
                  d="M8 5V19L19 12L8 5Z" 
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
