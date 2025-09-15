// src/components/Title.tsx - Reusable Title Component
'use client';

import React from 'react';
import styles from '../styles/Title.module.css';

export interface TitleProps {
  /** First part of the title (bold) */
  firstText: string;
  /** Second part of the title (light) */
  secondText?: string;
  /** Custom className for additional styling */
  className?: string;
  /** HTML element to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  /** Whether to center the title */
  centered?: boolean;
}

const Title: React.FC<TitleProps> = ({
  firstText,
  secondText,
  className = '',
  as: Component = 'h1',
  centered = false,
}) => {
  const titleClasses = [
    styles.title,
    centered && styles.centered,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={titleClasses}>
      <span className={styles.firstText}>{firstText}</span>
      {secondText && <span className={styles.secondText}>{secondText}</span>}
    </Component>
  );
};

export default Title;
