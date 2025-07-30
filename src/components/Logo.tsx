import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "w-10 h-10", width = 40, height = 40 }: LogoProps) {
  return (
    <div className={className}>
      <Image 
        src="/assets/myusta_logo.svg" 
        alt="myUsta Logo" 
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
}