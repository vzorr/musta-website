import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'small' | 'medium' | 'large' | 'custom';
}

export default function Logo({ 
  className, 
  width, 
  height, 
  variant = 'medium' 
}: LogoProps) {
  // Define sizes based on variant
  const sizeConfig = {
    small: { w: 32, h: 32, class: 'w-8 h-8' },
    medium: { w: 48, h: 48, class: 'w-12 h-12' },
    large: { w: 64, h: 64, class: 'w-16 h-16' },
    custom: { w: 118, h: 40, class: 'w-[118px] h-[40px]' }
  };

  const config = sizeConfig[variant];
  const finalWidth = width || config.w;
  const finalHeight = height || config.h;
  const finalClassName = className || config.class;

  return (
    <div className={`${finalClassName} relative flex-shrink-0`}>
      <Image 
        src="/assets/myusta_logo.svg" 
        alt="myUsta Logo" 
        width={finalWidth}
        height={finalHeight}
        className="w-full h-full object-contain"
        priority={variant === 'medium' || variant === 'large'}
        sizes={`${finalWidth}px`}
      />
    </div>
  );
}