import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SCENARIOS } from '../../constants';
import type { Vibe } from '../../types';

// Icon map — reuse the same pattern but localized
import {
  Mountain, Tent, Zap, Landmark, Building, Wind, Moon, Crown,
  Coffee, History, Cpu, Palette, Film, Cloud,
} from 'lucide-react';

const SCENARIO_ICONS: Record<string, any> = {
  Mountain, Tent, Zap, Landmark, Building, Wind, Moon, Crown,
  Coffee, History, Cpu, Palette, Film, Cloud,
};

interface ScenarioCarouselProps {
  selectedScenarioId: string | null;
  onSelect: (id: string, vibe: Vibe) => void;
}

/**
 * Horizontal carousel of text-based "vibe scenarios" like
 * "I need to feel small" or "Whispers of the unknown."
 * Each card has a shimmer effect on hover and a layout-animated selection glow.
 */
export function ScenarioCarousel({ selectedScenarioId, onSelect }: ScenarioCarouselProps) {
  return (
    <section>
      <h2 className="font-display text-lg text-zinc-400 mb-6 uppercase tracking-widest font-medium">
        Choose a vibe
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 pb-8">
        {SCENARIOS.map((scenario) => {
          const Icon = SCENARIO_ICONS[scenario.iconName] || Sparkles;
          const isActive = selectedScenarioId === scenario.id;

          return (
            <motion.button
              key={scenario.id}
              whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(scenario.id, scenario.vibe)}
              className={cn(
                'flex-shrink-0 relative group px-3 py-3 md:px-4 md:py-4 rounded-2xl border transition-all duration-500 text-left min-w-[120px] md:min-w-[140px] overflow-hidden',
                isActive
                  ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 text-white border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
              )}
            >
              {/* Shimmer sweep on hover */}
              {!isActive && (
                <div className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rotate-45 translate-x-[-50%] group-hover:translate-x-[50%]" />
              )}

              <div className="relative z-10 space-y-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors duration-300',
                    isActive ? 'bg-black/10' : 'bg-white/10 group-hover:bg-white/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
                    )}
                  />
                </div>

                <p className="text-sm font-display font-semibold leading-tight tracking-tight">
                  "{scenario.label}"
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={cn(
                      'text-[8px] uppercase tracking-[0.2em] font-bold px-1.5 py-0.5 rounded-md',
                      isActive ? 'bg-black/5 text-black/60' : 'bg-white/5 text-zinc-500'
                    )}
                  >
                    {scenario.vibe}
                  </span>
                </div>
              </div>

              {/* Selection glow */}
              {isActive && (
                <motion.div
                  layoutId="scenario-selection-glow"
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
