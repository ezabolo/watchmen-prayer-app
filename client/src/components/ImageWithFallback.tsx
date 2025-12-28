import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { getImageUrl, isValidImageUrl } from '@/utils/imageUtils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  fallbackClassName = "" 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  
  // Process the image URL to ensure it works in all environments
  const imageUrl = getImageUrl(src);
  const isValidUrl = isValidImageUrl(imageUrl);
  
  // If no valid src provided or image failed to load, show fallback
  if (!isValidUrl || imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg ${fallbackClassName} ${className}`}>
        <BookOpen className="h-16 w-16 text-gray-500" />
      </div>
    );
  }

  return (
    <img 
      src={imageUrl || ''} 
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}