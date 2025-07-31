// src/hooks/useHeroHeight.ts - Simple dynamic hero height hook
'use client';

import { useState, useEffect, useCallback } from 'react';

interface HeroHeightResult {
  heroHeight: string;
  heroStyle: React.CSSProperties;
  recalculate: () => void;
}

interface HeroConfig {
  minHeight?: number;
  maxHeight?: number;
  contentVisibilityRatio?: number;
}

export function useHeroHeight(config: HeroConfig = {}): HeroHeightResult {
  const {
    minHeight = 400,
    maxHeight = 800,
    contentVisibilityRatio = 0.35
  } = config;

  const [heroHeight, setHeroHeight] = useState<string>('60vh');
  const [heroStyle, setHeroStyle] = useState<React.CSSProperties>({});

  const calculateHeight = useCallback(() => {
    if (typeof window === 'undefined') return;

    const { innerWidth: vw, innerHeight: vh } = window;
    const aspectRatio = vw / vh;
    
    // Surface Pro 8: 1440x960 = 1.5 aspect ratio
    // HP Omen: 2560x1440 = 1.78 aspect ratio
    const surfaceProRatio = 1.5;
    const standardWideRatio = 1.78;

    let targetHeight: number;

    if (aspectRatio >= standardWideRatio) {
      // Wide screens (like HP Omen) - reduce height to show more content
      targetHeight = vh * (1 - contentVisibilityRatio);
    } else if (aspectRatio >= surfaceProRatio) {
      // Medium aspect ratios - balanced approach
      targetHeight = vh * 0.7;
    } else {
      // Square-ish screens (tablets) - use more height
      targetHeight = vh * 0.75;
    }

    // Apply constraints
    targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));
    
    // Convert to vh and create style object
    const heightInVh = Math.round((targetHeight / vh) * 100);
    const heightString = `${heightInVh}vh`;
    
    setHeroHeight(heightString);
    setHeroStyle({
      height: `${targetHeight}px`,
      minHeight: heightString,
      maxHeight: `${maxHeight}px`,
    });

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Hero Height Calculated:', {
        screenSize: `${vw}x${vh}`,
        aspectRatio: aspectRatio.toFixed(2),
        calculatedHeight: `${targetHeight}px (${heightString})`,
      });
    }
  }, [minHeight, maxHeight, contentVisibilityRatio]);

  useEffect(() => {
    calculateHeight();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeight, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [calculateHeight]);

  return {
    heroHeight,
    heroStyle,
    recalculate: calculateHeight,
  };
}

// Alternative: Lightweight version that just returns height value
export function useAdaptiveHeroHeight(): string {
  const [height, setHeight] = useState('60vh');

  useEffect(() => {
    const calculateAdaptiveHeight = () => {
      if (typeof window === 'undefined') return;

      const { innerWidth, innerHeight } = window;
      const aspectRatio = innerWidth / innerHeight;

      // Simple logic: wider screens get shorter hero sections
      if (aspectRatio > 2.0) {
        setHeight('50vh'); // Ultra-wide
      } else if (aspectRatio > 1.7) {
        setHeight('60vh'); // Standard wide (like HP Omen)
      } else if (aspectRatio > 1.4) {
        setHeight('70vh'); // Medium (like Surface Pro)
      } else {
        setHeight('75vh'); // Square/portrait
      }
    };

    calculateAdaptiveHeight();

    const handleResize = () => {
      setTimeout(calculateAdaptiveHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
}