import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Users, Sparkles, ArrowUpRight } from 'lucide-react';
import { getPopularDestinations } from '../../lib/userDestinations';
import { cn } from '../../lib/utils';

export const CommunityGallery: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getPopularDestinations(4).then(data => {
      setDestinations(data);
      setIsLoading(false);
    });
  }, []);

  const handleDestinationClick = (name: string) => {
    navigate('/discover/destination', { state: { prefill: name } });
  };

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-12 max-w-7xl mx-auto py-20">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-[4/5] bg-white/[0.03] rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Social Discovery</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Trending in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Community</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl font-medium">
            Destinations analyzed by fellow pathfinders. Real data, real vibes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleDestinationClick(dest.name)}
            className="group relative aspect-[4/5] bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden cursor-pointer"
          >
            {/* Image Overlay */}
            <img 
              src={dest.imageUrl} 
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{dest.location || 'Unknown'}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white leading-none">{dest.name}</h3>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${(i * 3) + j}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{dest.count || 1} Queries</span>
                </div>
              </div>
            </div>

            {/* Hover Vibes Overlay */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {dest.vibes?.slice(0, 2).map((v: string) => (
                <span key={v} className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[9px] font-black uppercase tracking-wider">
                  {v}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
