import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, LayoutGrid, Compass, Lock, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { CommunityGallery } from '../components/common/CommunityGallery';

export const SplitEntryScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col overflow-hidden">
      {/* Centered Logo + Tagline */}
      <header className="pt-10 pb-6 px-6 md:px-12 z-20 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl shadow-white/10">
          <Compass className="text-black w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
            PATHFINDER
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            From feeling to destination, in minutes.
          </p>
        </div>
      </header>

      {/* Split Entry Content */}
      <div className="flex-1 flex flex-col p-4 md:p-8 gap-4 md:gap-8 max-w-7xl mx-auto w-full pb-8">
        
        {/* Primary Paths */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1">
          {/* Card A: Vibe-First */}
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/discover/vibe')}
            className={cn(
              "group relative flex-1 bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden",
              "flex flex-col items-center justify-center p-8 md:p-12 transition-colors text-center",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
              "min-h-[40vh] md:min-h-0"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {/* Subtle hover indicator: gentle wave/pulse */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl"
              initial={{ opacity: 0.25, scale: 0.95 }}
              whileHover={{ opacity: 0.55, scale: 1.05 }}
              whileTap={{ opacity: 0.6, scale: 1.02 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
            
            <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:border-indigo-400/30 transition-colors duration-500">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-indigo-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">
                  I have a feeling,<br />not a destination
                </h2>
                <p className="text-zinc-400 text-sm md:text-lg max-w-sm mx-auto font-medium">
                  Show me places that match my mood
                </p>
              </div>
              
              <div className="pt-4 flex justify-center">
                <div className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  Explore by Vibe
                </div>
              </div>
            </div>
          </motion.button>

          {/* Card B: Constraint-First */}
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/discover/constraints')}
            className={cn(
              "group relative flex-1 bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden",
              "flex flex-col items-center justify-center p-8 md:p-12 transition-colors text-center",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
              "min-h-[40vh] md:min-h-0"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <motion.div
                className="absolute top-6 right-6 w-9 h-9 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center"
                initial={{ scale: 0.96, opacity: 0.7 }}
                whileHover={{ scale: 1.02, opacity: 1 }}
                whileTap={{ scale: 0.99, opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Lock className="w-4 h-4 text-emerald-300" />
              </motion.div>
            </motion.div>
            
            <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:border-emerald-400/30 transition-colors duration-500">
                <LayoutGrid className="w-10 h-10 md:w-12 md:h-12 text-emerald-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                  I know my budget<br />and dates
                </h2>
                <p className="text-zinc-400 text-xs md:text-base max-w-sm mx-auto font-medium">
                  Show me only what fits my reality
                </p>
              </div>
              
              <div className="pt-4 flex justify-center">
                <div className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  Explore by Limits
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Secondary Path / Card C: Destination-First */}
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/discover/destination')}
          className={cn(
            "group relative w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden",
            "flex flex-col md:flex-row items-center justify-between p-6 md:p-8 transition-colors text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 relative z-10 w-full text-center md:text-left">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-amber-400/30 transition-colors duration-500 shrink-0">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-amber-300 group-hover:text-amber-400 transition-colors" />
            </div>
            
            <div className="space-y-1 md:space-y-2 pt-2">
              <h2 className="text-xl md:text-3xl font-display font-bold text-white">
                I have a place in mind
              </h2>
              <p className="text-zinc-400 text-sm md:text-base font-medium">
                Analyze my dream destination's fit based on budget and vibe
              </p>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-0 w-full md:w-auto flex justify-center md:justify-end shrink-0">
            <div className="px-6 py-3 rounded-full bg-white/10 text-white font-bold text-sm uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all duration-300 whitespace-nowrap">
              Analyze Place
            </div>
          </div>
        </motion.button>
      </div>

      {/* Community Discovery Section */}
      <div className="z-10">
        <CommunityGallery />
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};
