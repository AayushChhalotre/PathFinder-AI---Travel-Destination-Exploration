import React from 'react';
import { motion } from 'motion/react';
import { Plane, Hotel, IndianRupee, ExternalLink, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSkyscannerUrl, getBookingComUrl } from '../../lib/bookingHandoff';
import { EstimatedCost } from '../ui/EstimatedCost';

interface BookingSummaryProps {
  destination: {
    name: string;
    id: string;
  };
  totalCost: number;
  numTravellers: number;
  startDate?: string;
  endDate?: string;
  origin?: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  destination,
  totalCost,
  numTravellers,
  startDate,
  endDate,
  origin = 'DEL' // Default to Delhi for India market focus
}) => {
  const skyscannerUrl = getSkyscannerUrl(origin, destination.name, startDate || null, endDate || null);
  const bookingComUrl = getBookingComUrl(destination.name, startDate || null, endDate || null, numTravellers);

  return (
    <section className="mt-20 mb-12">
      <div className="relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 blur-3xl opacity-30" />
        
        <div className="relative bg-[#1a1a1c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left Side: Summary & Final Total */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">The Final Voyage</h2>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready for {destination.name}?
              </h3>
              
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Your itinerary is complete and your dream trip is just a few clicks away. We've synchronized your preferences with the best booking platforms.
              </p>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Estimated Investment</p>
                    <div className="text-3xl font-display font-bold text-white">
                      <EstimatedCost
                        amountINR={totalCost}
                        costBasis="total"
                        numTravellers={numTravellers}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Optimized Fare</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 italic">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span>All booking links open in new secure windows for your safety.</span>
              </div>
            </div>

            {/* Right Side: Handoff Buttons */}
            <div className="p-8 md:p-12 bg-white/[0.02] flex flex-col justify-center gap-6">
              <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Secure your spots</h4>
              
              <a 
                href={skyscannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Book Flights</p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">via Skyscanner</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              <a 
                href={bookingComUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-colors">
                    <Hotel className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Book Stay</p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">via Booking.com</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              <div className="mt-4">
                <button className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Lock In & Finalize Everything
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
