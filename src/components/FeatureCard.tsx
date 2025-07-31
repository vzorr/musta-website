import Image from 'next/image';
import styles from '../styles/FeatureCard.module.css';

interface FeatureCardProps {
  imageSrc: string;
  imageAlt: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

export default function FeatureCard({ 
  imageSrc, 
  imageAlt, 
  iconSrc, 
  iconAlt, 
  title, 
  description 
}: FeatureCardProps) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.imageContainer}>
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          fill
          className="object-cover"
        />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <Image 
              src={iconSrc} 
              alt={iconAlt} 
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}