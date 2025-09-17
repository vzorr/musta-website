// src/components/Description.tsx - Reusable Description Component
'use client';

import React from 'react';
import styles from '../styles/Description.module.css';

export interface DescriptionProps {
  /** The description text content */
  children?: React.ReactNode;
  /** Custom className for additional styling */
  className?: string;
  /** HTML tag to use for the description (default: p) */
  as?: 'p' | 'div' | 'span';
  /** Whether to center the description (default: true) */
  centered?: boolean;
  /** Whether to use dangerouslySetInnerHTML for HTML content */
  dangerouslySetInnerHTML?: { __html: string };
}

const Description: React.FC<DescriptionProps> = ({
  children,
  className = '',
  as: Component = 'p',
  centered = true,
  dangerouslySetInnerHTML
}) => {
  const descriptionClasses = [
    styles.description,
    centered && styles.centered,
    className
  ].filter(Boolean).join(' ');

  if (dangerouslySetInnerHTML) {
    return (
      <Component 
        className={descriptionClasses}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    );
  }

  return (
    <Component className={descriptionClasses}>
      {children}
    </Component>
  );
};

export default Description;
