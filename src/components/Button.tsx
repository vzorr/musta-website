// src/components/Button.tsx - Reusable Button Component
'use client';

import React, { forwardRef } from 'react';
import styles from '../styles/Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'myusta-green';
  /** Button size */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon button (circular) */
  iconButton?: boolean;
  /** Floating action button */
  fab?: boolean;
  /** Pulse animation */
  pulse?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      iconButton = false,
      fab = false,
      pulse = false,
      children,
      className = '',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // Build CSS classes
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      iconButton && styles.iconButton,
      fab && styles.fab,
      pulse && styles.pulse,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Handle click with loading state
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        <span style={{ opacity: loading ? 0 : 1 }}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Export additional types for convenience
export type ButtonVariant = ButtonProps['variant'];
export type ButtonSize = ButtonProps['size'];