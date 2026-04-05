import React from 'react';
import { motion } from 'motion/react';
import { VIBE_COLORS } from '../../constants';
import type { Vibe } from '../../types';

interface AmbientBackgroundProps {
  activeVibe: Vibe | 'default';
}

/**
 * Full-screen ambient gradient that morphs based on the user's active vibe.
 * Uses GPU-accelerated transitions for silky 60fps performance.
 * Layered with a subtle noise texture for depth (cinematic noir feel).
 */
export function AmbientBackground({ activeVibe }: AmbientBackgroundProps) {
  const gradientClass = VIBE_COLORS[activeVibe] || VIBE_COLORS.default;

  // Generate a stable set of random particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 1.5,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <>
      {/* Primary gradient layer */}
      <motion.div
        key={activeVibe}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className={`fixed inset-0 bg-gradient-to-br ${gradientClass} pointer-events-none z-0`}
      />

      {/* Floating Particles for premium depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/10 blur-xl"
            style={{
              width: `${p.scale * 150}px`,
              height: `${p.scale * 150}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              y: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Subtle grain overlay for cinematic texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Radial vignette for depth focus */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </>
  );
}
