// src/hooks/useImageDimensions.ts - Hook to get actual image dimensions
'use client';

import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isLoaded: boolean;
  error: boolean;
}

export function useImageDimensions(imageSrc: string): ImageDimensions {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 1.5, // Default fallback
    isLoaded: false,
    error: false
  });

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
        isLoaded: true,
        error: false
      });

      console.log('Image dimensions loaded:', {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: aspectRatio.toFixed(3)
      });
    };

    img.onerror = () => {
      setDimensions(prev => ({
        ...prev,
        error: true,
        isLoaded: false
      }));
      console.error('Failed to load image dimensions for:', imageSrc);
    };

    img.src = imageSrc;
  }, [imageSrc]);

  return dimensions;
}

// Alternative hook that calculates responsive height based on image dimensions
export function useResponsiveHeroHeight(imageSrc: string) {
  const imageDimensions = useImageDimensions(imageSrc);
  const [heroHeight, setHeroHeight] = useState('100vh');

  useEffect(() => {
    if (!imageDimensions.isLoaded) return;

    const calculateHeight = () => {
      if (typeof window === 'undefined') return;

      const { innerWidth, innerHeight } = window;
      const { width: imageWidth, height: imageHeight, aspectRatio } = imageDimensions;

      // For devices larger than image width, use image dimensions
      if (innerWidth >= imageWidth) {
        setHeroHeight(`${imageHeight}px`);
        return;
      }

      // For smaller devices, calculate proportional height
      const calculatedHeight = innerWidth / aspectRatio;
      
      // Set bounds for mobile usability
      const minHeight = Math.min(400, innerHeight * 0.5); // At least 50% of viewport or 400px
      const maxHeight = innerHeight * 0.9; // Don't take more than 90% of viewport
      
      const finalHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
      setHeroHeight(`${Math.round(finalHeight)}px`);

      if (process.env.NODE_ENV === 'development') {
        console.log('Responsive hero height calculated:', {
          screenSize: `${innerWidth}x${innerHeight}`,
          imageSize: `${imageWidth}x${imageHeight}`,
          aspectRatio: aspectRatio.toFixed(3),
          calculatedHeight: `${calculatedHeight.toFixed(0)}px`,
          finalHeight: `${Math.round(finalHeight)}px`
        });
      }
    };

    calculateHeight();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [imageDimensions]);

  return {
    heroHeight,
    imageDimensions,
    isReady: imageDimensions.isLoaded
  };
}