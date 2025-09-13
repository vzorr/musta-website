// src/components/TwoLineTitle.tsx - Specialized Two-Line Title Component
'use client';

import React from 'react';
import styles from '../styles/TwoLineTitle.module.css';

export interface TwoLineTitleProps {
  /** The first line of text */
  firstLine: string;
  /** The second line of text */
  secondLine: string;
  /** Whether first line should be bold (default: false) */
  firstLineBold?: boolean;
  /** Whether second line should be bold (default: true) */
  secondLineBold?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** HTML tag to use for the title (default: h2) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Whether to center the title (default: true) */
  centered?: boolean;
}

const TwoLineTitle: React.FC<TwoLineTitleProps> = ({
  firstLine,
  secondLine,
  firstLineBold = false,
  secondLineBold = true,
  className = '',
  as: Component = 'h2',
  centered = true
}) => {
  const titleClasses = [
    styles.twoLineTitle,
    centered && styles.centered,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={titleClasses}>
      <div className={styles.lineContainer}>
        <span className={`${styles.line} ${firstLineBold ? styles.bold : styles.normal}`}>
          {firstLine}
        </span>
        <span className={`${styles.line} ${secondLineBold ? styles.bold : styles.normal}`}>
          {secondLine}
        </span>
      </div>
    </Component>
  );
};

export default TwoLineTitle;

