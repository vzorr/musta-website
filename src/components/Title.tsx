// src/components/Title.tsx - Reusable Title Component
'use client';

import React from 'react';
import styles from '../styles/Title.module.css';

export interface TitleProps {
  /** The main title text (will be bold) */
  firstText: string;
  /** Optional second part of title (will be lighter weight) */
  secondText?: string;
  /** Custom className for additional styling */
  className?: string;
  /** HTML tag to use for the title (default: h1) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Whether to center the title (default: true) */
  centered?: boolean;
}

const Title: React.FC<TitleProps> = ({
  firstText,
  secondText,
  className = '',
  as: Component = 'h1',
  centered = true
}) => {
  const titleClasses = [
    styles.title,
    centered && styles.centered,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={titleClasses}>
      <span className={styles.firstText}>{firstText}&nbsp;</span>
      {secondText && (
        <span className={styles.secondText}>{secondText}</span>
      )}
    </Component>
  );
};

export default Title;

