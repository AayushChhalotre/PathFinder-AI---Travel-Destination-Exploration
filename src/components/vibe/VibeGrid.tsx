import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BrainCircuit, ChevronDown } from 'lucide-react';
import { VibeCard } from './VibeCard';
import { VIBE_IMAGES } from '../../constants';
import type { Vibe, VibeImage } from '../../types';
import type { VibeIntentResult } from '../../lib/gemini';

const INITIAL_VISIBLE = 12;
const LOAD_MORE_INCREMENT = 12;

interface VibeGridProps {
  key?: React.Key;
  selectedVibes: Vibe[];
  selectedImageIds: string[];
  onToggle: (id: string, vibes: Vibe[]) => void;
  aiIntent: VibeIntentResult | null;
  isParsingIntent: boolean;
}

/**
 * Masonry-style grid of vibe postcards.
 * Shows INITIAL_VISIBLE images by default with a "Show more" button.
 * Filters images based on selected vibes (shows all when none selected).
 */
export function VibeGrid({
  selectedVibes,
  selectedImageIds,
  onToggle,
  aiIntent,
  isParsingIntent,
}: VibeGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filteredImages = useMemo(() => {
    if (selectedVibes.length === 0) return VIBE_IMAGES;
    return VIBE_IMAGES.filter(img => img.vibes.some(v => selectedVibes.includes(v)));
  }, [selectedVibes]);

  // Reset visible count when filters change
  const displayedImages = filteredImages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredImages.length;

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
        <div className="space-y-1">
          <h2 className="font-display text-lg text-zinc-400 uppercase tracking-widest font-medium">
            Visual Anchors
          </h2>
          <p className="text-xs text-zinc-600 max-w-md">
            Tap the images that speak to you. We'll decode your travel vibe.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Selection counter */}
          {selectedImageIds.length > 0 && (
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {selectedImageIds.length}/5 selected
            </span>
          )}

          {/* AI Intent Badge */}
          <AnimatePresence mode="wait">
            {isParsingIntent && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  Reading your vibe…
                </span>
              </motion.div>
            )}

            {aiIntent && !isParsingIntent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                  {aiIntent.suggestedVibe}
                </span>
                <span className="text-[9px] text-zinc-500">
                  • {aiIntent.emotionalTone}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid — limited to visibleCount */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2">
        <AnimatePresence mode="popLayout">
          {displayedImages.map((img, i) => (
            <VibeCard
              key={img.id}
              image={img}
              isSelected={selectedImageIds.includes(img.id)}
              index={i}
              onToggle={onToggle}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Show More / Show Less */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ChevronDown className="w-4 h-4" />
            Show more ({filteredImages.length - visibleCount} remaining)
          </motion.button>
        </div>
      )}
    </section>
  );
}
