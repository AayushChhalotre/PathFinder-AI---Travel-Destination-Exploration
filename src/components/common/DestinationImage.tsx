import React, { useState, useEffect } from 'react';
import { fetchDestinationDetails } from '../../lib/wiki';

interface DestinationImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  destinationName: string;
}

export function DestinationImage({ destinationName, src, alt, ...props }: DestinationImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasAttemptedFallback, setHasAttemptedFallback] = useState(false);

  // Sync src changes
  useEffect(() => {
    setImgSrc(src);
    setHasAttemptedFallback(false);
  }, [src]);

  // Handle missing src immediately
  useEffect(() => {
    if (!imgSrc && !hasAttemptedFallback) {
      const fetchFallback = async () => {
        setHasAttemptedFallback(true);
        const details = await fetchDestinationDetails(destinationName);
        if (details?.thumbnailUrl) {
          setImgSrc(details.thumbnailUrl);
        } else {
          setImgSrc(`https://picsum.photos/seed/${encodeURIComponent(destinationName)}/800/600`);
        }
      };
      fetchFallback();
    }
  }, [imgSrc, destinationName, hasAttemptedFallback]);

  const handleError = async () => {
    if (!hasAttemptedFallback) {
      setHasAttemptedFallback(true);
      const details = await fetchDestinationDetails(destinationName);
      if (details?.thumbnailUrl) {
        setImgSrc(details.thumbnailUrl);
      } else {
        setImgSrc(`https://picsum.photos/seed/${encodeURIComponent(destinationName)}/800/600`);
      }
    }
  };

  // Provide an immediate placeholder if imgSrc is missing while fetching
  const displaySrc = imgSrc || `https://picsum.photos/seed/${encodeURIComponent(destinationName)}/800/600`;

  return <img src={displaySrc} alt={alt || destinationName} onError={handleError} {...props} />;
}
