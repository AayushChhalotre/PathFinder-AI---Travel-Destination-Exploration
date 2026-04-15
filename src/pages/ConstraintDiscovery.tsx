import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IndianRupee, CalendarDays, ArrowRight, Info, Clock, Sparkles, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { SessionStateBar } from '../components/ui/SessionStateBar';
import { PathfinderHeader } from '../components/layout/PathfinderHeader';
import { HardConstraints } from '../types';
import { intentGraph } from '../lib/intentGraph';

interface ConstraintDiscoveryProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onSaveConstraints: (constraints: any) => void;
}

export const ConstraintDiscovery: React.FC<ConstraintDiscoveryProps> = ({ 
  user, 
  profile, 
  onShowProfile,
  onSaveConstraints
}) => {
  const [budget, setBudget] = useState<number>(300000);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Sync from global state
  React.useEffect(() => {
    const current = intentGraph.getState();
    if (current.hard.budget_ceiling) setBudget(current.hard.budget_ceiling);
    if (current.hard.date_start) setStartDate(current.hard.date_start);
    if (current.hard.date_end) setEndDate(current.hard.date_end);
    if (current.soft.travel_month) setSelectedMonth(current.soft.travel_month);

    // Subscribe to future updates
    return intentGraph.subscribe((state) => {
      if (state.hard.budget_ceiling !== null) setBudget(state.hard.budget_ceiling);
      if (state.hard.date_start !== null) setStartDate(state.hard.date_start);
      if (state.hard.date_end !== null) setEndDate(state.hard.date_end);
      if (state.soft.travel_month !== null) setSelectedMonth(state.soft.travel_month);
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const handleProceed = () => {
    // Sync to Intent Graph atomically
    intentGraph.setHardConstraints({
      budget_ceiling: budget,
      date_start: startDate || null,
      date_end: endDate || null
    });

    if (selectedMonth) {
      intentGraph.updateSoftPreference('travel_month', selectedMonth);
    }
    
    onSaveConstraints({
      budget_ceiling: budget,
      date_start: startDate || null,
      date_end: endDate || null,
      origin: null,
      num_travellers: null,
      travel_month: selectedMonth
    });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col overflow-x-hidden">
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-12 relative z-10"
      >
        <PathfinderHeader 
          user={user} 
          profile={profile} 
          onShowProfile={onShowProfile} 
        />

        <div className="mt-12 space-y-16 pb-24">
          <section className="text-center space-y-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Step 2: Grounding Reality</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tighter leading-none">
              Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#7f7ff5]">Reality</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Start with your fixed constraints. We'll find everything that works within your bounds.
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Essential Cards */}
            <div className="space-y-8">
              {/* Budget Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group p-8 md:p-10 bg-zinc-900/50 border border-white/[0.08] rounded-[3rem] space-y-8 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <IndianRupee className="w-40 h-40" />
                </div>
                
                <div className="flex justify-between items-start relative">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Hard Constraint</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Maximum Budget</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold text-white">₹{budget.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total for all travelers</div>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 font-black uppercase tracking-tighter">
                    <span>₹5,000</span>
                    <span className="text-zinc-400">Optimal Range: ₹50k - ₹3L</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                  "This limit acts as a hard filter. We will never show you a destination that exceeds this ceiling for your travel duration."
                </p>
              </motion.div>

              {/* Dates Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group p-8 md:p-10 bg-zinc-900/50 border border-white/[0.08] rounded-[3rem] space-y-8 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <CalendarDays className="w-40 h-40" />
                </div>

                <div className="space-y-1 relative">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-violet-500 rounded-full" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Time Bound</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Travel Dates</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 relative">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Departure</label>
                    <input
                      type="date"
                      value={startDate}
                      min={today}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-base font-bold outline-none focus:border-violet-500/50 focus:bg-white/5 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Return</label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || today}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-base font-bold outline-none focus:border-violet-500/50 focus:bg-white/5 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-medium opacity-60">
                  Setting specific dates allows us to calculate live pricing for flights & stays with high accuracy.
                </p>
              </motion.div>
            </div>

            {/* Right Column: Month Selection & Action */}
            <div className="space-y-8 lg:sticky lg:top-32">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 md:p-10 bg-zinc-900/50 border border-white/[0.08] rounded-[3rem] space-y-10 backdrop-blur-xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-amber-500 rounded-full" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Seasonality</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Month of Travel</h3>
                  <p className="text-zinc-500 text-sm">Flexible? Select a month to see optimal seasonal matches.</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <button
                      key={month}
                      onClick={() => {
                        const next = month === selectedMonth ? null : month;
                        setSelectedMonth(next);
                        if (next) {
                           setStartDate('');
                           setEndDate('');
                        }
                      }}
                      className={cn(
                        "py-3 rounded-[1.25rem] border text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        selectedMonth === month && !startDate
                          ? "bg-white text-black border-white shadow-xl shadow-white/10 scale-[1.05]"
                          : "bg-white/[0.03] border-white/[0.07] text-zinc-500 hover:bg-white/5 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {month.substring(0, 3)}
                    </button>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/[0.06] space-y-8">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#7f7ff5]/5 border border-[#7f7ff5]/20">
                    <Info className="w-5 h-5 text-[#7f7ff5] shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Your preferences are being synced with our <span className="text-white font-bold">Intent Graph</span>. This allows us to perform high-fidelity matching across all travel parameters.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceed}
                    disabled={(!startDate || !endDate) && !selectedMonth}
                    className="w-full py-6 bg-white text-black rounded-[2rem] font-display font-bold text-xl flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    View Real-Time Matches
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>

              <div className="px-8 flex justify-center">
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                   <Lock className="w-3 h-3" />
                   Privacy Guaranteed & No Booking Required
                 </p>
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#7f7ff5]/[0.03] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

