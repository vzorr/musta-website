import Image from 'next/image';

interface FeatureCardProps {
  imageSrc: string;
  imageAlt: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

export default function FeatureCard({ imageSrc, imageAlt, iconSrc, iconAlt, title, description }: FeatureCardProps) {
  return (
    <div className="neumorphic-card rounded-2xl overflow-hidden transition-transform hover:transform hover:-translate-y-1">
      <div className="h-48 sm:h-60 relative">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <div className="icon-container w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Image 
              src={iconSrc} 
              alt={iconAlt} 
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
          <h3 className="text-lg font-semibold text-myusta-navy">{title}</h3>
        </div>
        <p className="text-myusta-text-gray leading-relaxed">{description}</p>
      </div>
    </div>
  );
}