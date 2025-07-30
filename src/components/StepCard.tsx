import Image from 'next/image';

interface StepCardProps {
  stepNumber: string;
  iconSrc: string;
  iconAlt: string;
  description: string;
}

export default function StepCard({ stepNumber, iconSrc, iconAlt, description }: StepCardProps) {
  return (
    <div className="neumorphic-card p-6 sm:p-8 text-center rounded-2xl transition-transform hover:transform hover:-translate-y-1">
      <p className="text-myusta-navy mb-4 font-medium">{stepNumber}</p>
      <div className="icon-container w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6">
        <Image 
          src={iconSrc} 
          alt={iconAlt} 
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </div>
      <h3 className="text-myusta-text-gray leading-relaxed">{description}</h3>
    </div>
  );
}