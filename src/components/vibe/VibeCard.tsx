import React, { useRef, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Check, MapPin, Star, TrendingUp, BadgePercent, Leaf, ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { VibeImage, Vibe } from '../../types';

interface VibeCardProps {
  key?: React.Key;
  image: VibeImage;
  isSelected: boolean;
  index: number;
  onToggle: (id: string, vibes: Vibe[]) => void;
}

/**
 * Individual vibe postcard with:
 * - Magnetic parallax tilt on hover
 * - Pulse ring on selection
 * - Staggered entrance animation
 * - Broken image fallback
 */
export function VibeCard({ image, isSelected, index, onToggle }: VibeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  const statusConfig: Record<string, { icon: typeof Star; color: string }> = {
    popular: { icon: Star, color: 'bg-amber-500/80 text-white' },
    trending: { icon: TrendingUp, color: 'bg-rose-500/80 text-white' },
    niche: { icon: BadgePercent, color: 'bg-indigo-500/80 text-white' },
    new: { icon: Leaf, color: 'bg-emerald-500/80 text-white' },
    budget: { icon: Star, color: 'bg-zinc-300/80 text-black/80' },
  };

  const StatusIcon = image.status ? statusConfig[image.status]?.icon : null;
  const isLarge = index % 7 === 0;

  // Don't render cards with broken images
  if (imgError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.03, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
      ref={cardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer group will-change-transform',
        isLarge ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
      )}
      style={{ transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onToggle(image.id, image.vibes)}
    >
      {/* Image with error fallback */}
      <img
        src={image.url}
        alt={image.locationTag || `Vibe ${image.id}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-700',
          'group-hover:scale-110',
          isSelected ? 'brightness-[0.45] saturate-50' : 'brightness-[0.85] group-hover:brightness-100'
        )}
      />

      {/* Status badge */}
      {image.status && StatusIcon && (
        <div
          className={cn(
            'absolute top-2.5 left-2.5 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md z-20',
            statusConfig[image.status]?.color
          )}
        >
          <StatusIcon className="w-2.5 h-2.5" />
          {image.status}
        </div>
      )}

      {/* Location tag */}
      {image.locationTag && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <p className="text-[10px] text-white/90 font-medium truncate flex items-center gap-1.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {image.locationTag}
          </p>
        </div>
      )}

      {/* Selection ring */}
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-2xl transition-all duration-300 z-20',
          isSelected ? 'border-white shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' : 'border-transparent'
        )}
      />

      {/* Selection sparkle + pulse */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl"
          >
            <Check className="text-black w-5 h-5" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-10 h-10 border-2 border-white rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}
