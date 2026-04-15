import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, CalendarDays, IndianRupee, Users, Lock, ChevronDown, PlusCircle, X, Edit2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { intentGraph, IntentState } from '../../lib/intentGraph';
import { MONTHS } from '../../constants';

interface SessionStateBarProps {
  className?: string;
}

export const SessionStateBar: React.FC<SessionStateBarProps> = ({ className }) => {
  const [state, setState] = useState<IntentState>(intentGraph.getState());
  const [moodExpanded, setMoodExpanded] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [compactExpanded, setCompactExpanded] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    return intentGraph.subscribe(setState);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const hasData = Object.values(state.hard).some(v => v !== null) || 
                  state.soft.mood_tags.length > 0 || 
                  state.soft.occasion_tags.length > 0 || 
                  state.soft.travel_month !== null;

  if (!hasData) return null;

  const handleEdit = (key: string) => {
    setEditingKey(editingKey === key ? null : key);
  };

  const renderItem = (
    label: string,
    icon: React.ReactNode,
    isHard: boolean,
    key: string,
    options?: { onClick?: () => void; iconOnly?: boolean }
  ) => (
    <motion.button
      key={key}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleEdit(key)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap relative",
        isHard 
          ? "bg-white/10 border-white/20 shadow-lg shadow-white/5" 
          : "bg-white/5 border-white/10 hover:bg-white/10",
        editingKey === key && "ring-1 ring-emerald-500/50 bg-white/20 border-emerald-500/30"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!options?.iconOnly && (
        <span className={cn(
          "text-[10px] tracking-tight",
          isHard ? "text-white font-bold" : "text-zinc-300 font-medium"
        )}>
          {label}
        </span>
      )}
      
      {/* Interactive indicator instead of rigid Lock */}
      <div className={cn(
        "shrink-0 ml-1 transition-transform",
        editingKey === key ? "rotate-180" : "rotate-0"
      )}>
        <ChevronDown className={cn(
          "w-3 h-3",
          isHard ? "text-emerald-400" : "text-zinc-500"
        )} />
      </div>

      {/* Mini Edit Sheet */}
      <AnimatePresence>
        {editingKey === key && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[200px] bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adjust {key}</span>
                <X className="w-3 h-3 text-zinc-500 cursor-pointer hover:text-white" onClick={() => setEditingKey(null)} />
              </div>
              
              {key === 'budget' && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">₹ {(state.hard.budget_ceiling || 0).toLocaleString()}</div>
                  <input 
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={state.hard.budget_ceiling || 300000}
                    onChange={(e) => intentGraph.setHardConstraint('budget_ceiling', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-emerald-500"
                  />
                </div>
              )}

              {key === 'travellers' && (
                <div className="flex items-center gap-4 justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                  <button 
                    onClick={() => intentGraph.setHardConstraint('num_travellers', Math.max(1, (state.hard.num_travellers || 1) - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white leading-none">{state.hard.num_travellers}</span>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">People</div>
                  </div>
                  <button 
                    onClick={() => intentGraph.setHardConstraint('num_travellers', (state.hard.num_travellers || 1) + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              )}

              {key === 'month' && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adjust Month of Travel</span>
                  <X className="w-3 h-3 text-zinc-500 cursor-pointer hover:text-white" onClick={() => setEditingKey(null)} />
                </div>
              )}

              {key === 'month' && (
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        intentGraph.updateSoftPreference('travel_month', m.id);
                        setEditingKey(null);
                      }}
                      className={cn(
                        "px-2 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                        state.soft.travel_month === m.id
                          ? "bg-emerald-500 border-emerald-500 text-black"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                      )}
                    >
                      {m.label.substring(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {key === 'mood' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {state.soft.mood_tags.map(tag => (
                      <div key={tag} className="px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-[10px] text-rose-300 flex items-center gap-1.5">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-white" 
                          onClick={() => {
                            const next = state.soft.mood_tags.filter(t => t !== tag);
                            intentGraph.updateSoftPreference('mood_tags', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => window.location.href = '/discover/vibe'}
                    className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Add More Vibes
                  </button>
                </div>
              )}

              {key === 'origin' && (
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7f7ff5]" />
                    <input 
                      type="text"
                      placeholder="Enter city..."
                      value={state.hard.origin || ''}
                      onChange={(e) => intentGraph.setHardConstraint('origin', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#7f7ff5]/50 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Delhi', 'Mumbai', 'Bangalore', 'London', 'Dubai'].map(city => (
                      <button
                        key={city}
                        onClick={() => intentGraph.setHardConstraint('origin', city)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                          state.hard.origin === city
                            ? "bg-[#7f7ff5] border-[#7f7ff5] text-white"
                            : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {key === 'dates' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Start</label>
                      <input 
                        type="date"
                        value={state.hard.date_start || ''}
                        onChange={(e) => intentGraph.setHardConstraint('date_start', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-[#7f7ff5]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">End</label>
                      <input 
                        type="date"
                        value={state.hard.date_end || ''}
                        onChange={(e) => intentGraph.setHardConstraint('date_end', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-[#7f7ff5]/50"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <button 
                      onClick={() => {
                        intentGraph.setHardConstraint('date_start', null);
                        intentGraph.setHardConstraint('date_end', null);
                      }}
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      Clear Dates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  const items = useMemo(() => {
    const out: React.ReactNode[] = [];

    // Hard Constraints
    if (state.hard.origin) {
      out.push(
        renderItem(`${state.hard.origin}`, <MapPin className="w-3.5 h-3.5 text-zinc-200" />, true, 'origin', {
          iconOnly: isCompact && !compactExpanded && out.length < 3,
        })
      );
    }

    if (state.hard.budget_ceiling !== null) {
      const isEstimate = state.hard.estimate_cost !== null;
      const amount = state.hard.estimate_cost ?? state.hard.budget_ceiling;
      const label = `₹${amount.toLocaleString('en-IN')}`;
      
      out.push(
        renderItem(
          label, 
          <IndianRupee className={cn("w-3.5 h-3.5", isEstimate ? "text-emerald-400" : "text-zinc-200")} />, 
          true, 
          'budget', 
          {
            iconOnly: isCompact && !compactExpanded && out.length < 3,
          }
        )
      );
    }

    if (state.hard.date_start && state.hard.date_end) {
      const start = new Date(state.hard.date_start);
      const end = new Date(state.hard.date_end);
      const format = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      out.push(
        renderItem(
          `${format(start)} \u2013 ${format(end)}`,
          <CalendarDays className="w-3.5 h-3.5 text-zinc-200" />,
          true,
          'dates',
          { iconOnly: isCompact && !compactExpanded && out.length < 3 }
        )
      );
    } else if (state.soft.travel_month) {
      out.push(
        renderItem(
          `${state.soft.travel_month}`,
          <CalendarDays className="w-3.5 h-3.5 text-zinc-300" />,
          false,
          'month',
          { iconOnly: isCompact && !compactExpanded && out.length < 3 }
        )
      );
    }

    if (state.hard.num_travellers !== null) {
      out.push(
        renderItem(
          `${state.hard.num_travellers}`,
          <Users className="w-3.5 h-3.5 text-zinc-200" />,
          true,
          'travellers',
          { iconOnly: isCompact && !compactExpanded && out.length < 3 }
        )
      );
    }

    // Soft Preferences
    if (state.soft.mood_tags.length > 0) {
      const tags = state.soft.mood_tags;
      const visibleCount = isCompact && !compactExpanded ? 1 : 3;
      const visibleTags = tags.slice(0, visibleCount);
      const remaining = Math.max(0, tags.length - visibleCount);
      
      const label = remaining > 0 
        ? `${visibleTags.join(', ')} + ${remaining}` 
        : visibleTags.join(', ');

      out.push(
        renderItem(label, <Sparkles className="w-3.5 h-3.5 text-rose-400" />, false, 'mood', {
          iconOnly: isCompact && !compactExpanded && out.length < 3,
        })
      );
    }

    return out;
  }, [state, moodExpanded, isCompact, compactExpanded]);

  const isBudgetOnly =
    state.hard.budget_ceiling !== null &&
    !state.hard.origin &&
    !state.hard.date_start &&
    !state.hard.date_end &&
    state.soft.mood_tags.length === 0 &&
    state.soft.occasion_tags.length === 0 &&
    state.soft.travel_month === null &&
    state.hard.num_travellers === null;

  return (
    <div className={cn(
      "w-full z-40 sticky top-0 md:top-[64px] px-4",
      className
    )}>
      <div className={cn(
        "max-w-7xl mx-auto bg-zinc-950/80 backdrop-blur-3xl border border-white/[0.08] rounded-full px-6 py-2.5 flex items-center gap-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-500 hover:border-white/[0.12]",
        isBudgetOnly && "max-w-max px-8"
      )}>
        {!isBudgetOnly && (
          <div className="flex items-center gap-3 shrink-0 pr-5 border-r border-white/[0.06]">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 leading-none">Status</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Trip Intent</span>
            </div>
          </div>
        )}
      
      <div className={cn("flex-1 overflow-x-auto no-scrollbar flex items-center gap-2.5", isBudgetOnly && "justify-start")}>
        <AnimatePresence mode="popLayout">{items}</AnimatePresence>
      </div>

      {isCompact && items.length > 0 && items.length < 3 && (
        <button
          type="button"
          onClick={() => setCompactExpanded(prev => !prev)}
          className="shrink-0 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300 hover:bg-white/10 transition-colors"
        >
          </button>
      )}
      </div>
    </div>
  );
};
