import React, { useState, useEffect } from 'react';
import { Compass, User, RefreshCcw, ArrowLeft, ChevronDown, ChevronUp, Calendar, Fingerprint, Activity, DraftingCompass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { intentGraph, IntentState } from '../../lib/intentGraph';
import { formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PathfinderHeaderProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onReset?: () => void;
  showReset?: boolean;
  showBack?: boolean;
  isRoot?: boolean;
}

export const PathfinderHeader: React.FC<PathfinderHeaderProps> = ({ 
  user, 
  profile, 
  onShowProfile, 
  onReset, 
  showReset = false,
  showBack = true,
  isRoot = false 
}) => {
  const navigate = useNavigate();
  const [intentState, setIntentState] = useState<IntentState>(intentGraph.getState());
  const [isEditingTravelers, setIsEditingTravelers] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    return intentGraph.subscribe((newState) => {
      setIntentState(newState);
      setIsRefining(!!newState.refining);
    });
  }, []);

  const travellers = intentState.hard.num_travellers || 2;
  const budget = intentState.hard.budget_ceiling;
  const travelMonth = intentState.soft.travel_month;

  const handleMonthSelect = (month: string | null) => {
    intentGraph.updateSoftPreference('travel_month', month);
    setIsEditingMonth(false);
  };

  const getSuggestedBudget = () => {
    const vector = (intentState.soft as any).intent_vector;
    if (!vector || !vector.dimensions) return 300000; // Default fallback

    const { dimensions } = vector;
    // luxury_vs_rugged: -1 (luxury) to 1 (rugged)
    if (dimensions.luxury_vs_rugged < -0.3) return 600000; // Premium
    if (dimensions.luxury_vs_rugged > 0.3) return 150000; // Value/Rugged
    return 300000; // Balanced
  };

  const suggestedBudget = getSuggestedBudget();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <header className={cn(
      "w-full flex justify-between items-center transition-all duration-500 relative z-[110]",
      isRoot ? "mb-0" : "mb-12"
    )}>
      <div className="flex items-center gap-6">
        {showBack && !isRoot && (
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Compass className="text-black w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">PATHFINDER</h1>
        </Link>
      </div>

      {/* Center Status Bar (Wider & Intelligence-Driven) */}
      {!isRoot && (
        <div className="hidden lg:flex items-center gap-1 p-1.5 bg-zinc-900/40 hover:bg-zinc-900/60 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl transition-all duration-700 hover:border-white/20 flex-1 max-w-6xl justify-between relative">
          {/* Voyage Intuition Section */}
          <div className="relative group/traveller">
            <button 
              onClick={() => {
                setIsEditingTravelers(!isEditingTravelers);
                setIsEditingBudget(false);
                setIsEditingMonth(false);
              }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 rounded-full transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover/traveller:bg-emerald-500/5 transition-colors" />
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/traveller:scale-105 transition-transform">
                <Fingerprint className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div className="flex flex-col items-start leading-tight relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover/traveller:text-zinc-400 transition-colors">Voyagers</span>
                <span className="text-[15px] font-bold text-white tracking-tight">{travellers} {travellers === 1 ? 'Solo' : 'Soul-Seekers'}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-zinc-600 group-hover/traveller:text-white transition-all ml-1", isEditingTravelers && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isEditingTravelers && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsEditingTravelers(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 z-50 bg-zinc-950/98 backdrop-blur-3xl border border-white/15 rounded-[3rem] p-8 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.9)] min-w-[280px]"
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1">The Traveling Party</div>
                        <div className="text-zinc-500 text-xs text-center font-medium">How many people are sharing this rhythm?</div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-8 py-4 border-y border-white/5">
                        <button 
                          onClick={() => intentGraph.setHardConstraint('num_travellers', Math.max(1, travellers - 1))}
                          className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all active:scale-90 group/btn"
                        >
                          <ChevronDown className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                        </button>
                        <div className="flex flex-col items-center min-w-[60px]">
                          <motion.span 
                            key={travellers}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-6xl font-display font-bold text-white leading-none"
                          >
                            {travellers}
                          </motion.span>
                        </div>
                        <button 
                          onClick={() => intentGraph.setHardConstraint('num_travellers', travellers + 1)}
                          className="w-16 h-16 rounded-[2rem] bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all active:scale-90 group/btn"
                        >
                          <ChevronUp className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                        </button>
                      </div>

                      <button 
                        onClick={() => setIsEditingTravelers(false)}
                        className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-xl"
                      >
                        Set Your Party
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-10 bg-white/10" />

          {/* Voyage Rhythm Section */}
          <div className="relative group/budget flex-1 min-w-[200px]">
            <button 
              onClick={() => {
                setIsEditingBudget(!isEditingBudget);
                setIsEditingTravelers(false);
                setIsEditingMonth(false);
              }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 rounded-full transition-all w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-rose-500/0 group-hover/budget:bg-rose-500/5 transition-colors" />
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover/budget:scale-105 transition-transform">
                <Activity className="w-4.5 h-4.5 text-rose-400 group-hover/budget:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover/budget:text-zinc-400 transition-colors">Rhythm</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white tracking-tight">{budget ? formatCurrency(budget) : 'Unset'}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 group-hover/budget:text-white transition-all", isEditingBudget && "rotate-180")} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isEditingBudget && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsEditingBudget(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 z-50 bg-zinc-950/98 backdrop-blur-3xl border border-white/15 rounded-[3rem] p-8 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.9)] min-w-[320px]"
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] mb-1">Threshold of Possibility</div>
                        <div className="text-zinc-500 text-xs font-medium">Adjust your maximum total spend for the group.</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-3xl font-display font-bold text-white">{formatCurrency(budget || 0)}</span>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Limit</span>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="1000000"
                          step="10000"
                          value={budget || 300000}
                          onChange={e => intentGraph.setHardConstraint('budget_ceiling', Number(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-rose-400 transition-all"
                        />
                        <div className="flex justify-between text-[9px] text-zinc-600 font-black uppercase tracking-tighter">
                          <span>₹10k</span>
                          {!budget && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-rose-400/80 animate-pulse"
                            >
                              Suggested: {formatCurrency(suggestedBudget)}
                            </motion.span>
                          )}
                          <span>₹10L</span>
                        </div>
                      </div>

                      {!budget && (
                        <button 
                          onClick={() => intentGraph.setHardConstraint('budget_ceiling', suggestedBudget)}
                          className="w-full py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500/20 transition-all"
                        >
                          Adopt Recommended Flow
                        </button>
                      )}

                      <button 
                        onClick={() => setIsEditingBudget(false)}
                        className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-xl"
                      >
                        Set Threshold
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-10 bg-white/10" />

          {/* Timeline Section */}
          <div className="relative group/month flex-1 min-w-[200px]">
            <button 
              onClick={() => {
                setIsEditingMonth(!isEditingMonth);
                setIsEditingTravelers(false);
                setIsEditingBudget(false);
              }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 rounded-full transition-all w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/0 group-hover/month:bg-blue-500/5 transition-colors" />
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/month:scale-105 transition-transform">
                <Calendar className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover/month:text-zinc-400 transition-colors">Voyage</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white tracking-tight">{travelMonth || 'Flexible'}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 group-hover/month:text-white transition-all", isEditingMonth && "rotate-180")} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isEditingMonth && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsEditingMonth(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 z-50 bg-zinc-950/98 backdrop-blur-3xl border border-white/15 rounded-[3rem] p-6 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.9)] min-w-[340px]"
                  >
                    <div className="space-y-5">
                      <div className="flex flex-col items-center gap-1 text-center mb-2">
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Seasonal Alignment</div>
                        <div className="text-zinc-500 text-xs font-medium">When are you looking to depart?</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {months.map(m => (
                          <button
                            key={m}
                            onClick={() => handleMonthSelect(m)}
                            className={cn(
                              "py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                              travelMonth === m 
                                ? "bg-white text-black border-white shadow-lg scale-105"
                                : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10 hover:border-white/20 hover:text-white"
                            )}
                          >
                            {m.substring(0, 3)}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => intentGraph.updateSoftPreference('travel_month', null)}
                        className="w-full py-3 bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all hover:bg-white/10 hover:text-white"
                      >
                        I'm Flexible
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Reset Action (Prominent) */}
          {intentState.soft.rejectedIds.length > 0 && (
            <div className="flex items-center pr-1.5 ml-2">
              <button 
                onClick={() => {
                  intentState.soft.rejectedIds.forEach(id => intentGraph.undoRejection(id));
                }}
                className="flex items-center gap-3 px-6 py-3.5 bg-emerald-500 text-black rounded-full transition-all hover:bg-emerald-400 active:scale-95 group shadow-lg shadow-emerald-500/20"
                title="Restore all hidden destinations"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-1000" />
                <div className="flex flex-col items-start leading-tight text-left">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em]">Insight</span>
                  <span className="text-[11px] font-black">{intentState.soft.rejectedIds.length} Restored</span>
                </div>
              </button>
            </div>
          )}
          {/* Insight refining indicator */}
          <AnimatePresence>
            {isRefining && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none"
              >
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-emerald-400 rounded-full" />
                </div>
                <span className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.2em]">Aligning</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {!isRoot && (
          <button 
            onClick={onShowProfile}
            className="flex items-center gap-3 text-zinc-300 hover:text-white transition-all text-sm font-medium bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 group shadow-xl"
          >
            {user ? (
              <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full border-2 border-white/10 group-hover:border-emerald-400/50 transition-all shadow-lg" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-400/30 transition-all">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <span className="truncate max-w-[120px] font-bold tracking-tight">
              {user ? user.displayName : (profile?.profession || "Set Profile")}
            </span>
          </button>
        )}
        
        {showReset && onReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group"
          >
            <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
            Reset
          </button>
        )}
      </div>
    </header>
  );
};
