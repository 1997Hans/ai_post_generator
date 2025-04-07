'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { sanitizeImageUrl } from '@/lib/types';

type FallbackImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function FallbackImage({
  src,
  alt,
  fallbackSrc = '/images/image-placeholder.png',
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`${props.className || ''} ${error ? 'opacity-80' : ''}`}
    />
  );
} 