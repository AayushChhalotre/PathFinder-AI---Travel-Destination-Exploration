import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Users,
  IndianRupee,
  Sun,
  CloudSun,
  CloudRain,
  ShieldCheck,
  ShieldAlert,
  Trophy,
  Gem,
  Eye,
  ChevronDown,
  Plane,
  Hotel,
  Globe,
  Loader2,
  Signal
} from 'lucide-react';
import { Destination, HardConstraints } from '../types';
import { formatTravelTime } from '../lib/geoUtils';
import { cn } from '../lib/utils';
import { PathfinderHeader } from '../components/layout/PathfinderHeader';
import { SEASONALITY_DATA } from '../data/seasonality_data';
import { TRAVEL_ADVISORIES } from '../data/travel_advisories';
import { PRICE_SIGNALS } from '../data/price_signals';
import { intentGraph } from '../lib/intentGraph';

interface CandidateResultsProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  destinations: Destination[];
  hardConstraints: HardConstraints | null;
  numTravellers: number;
  origin: string | null;
  onPlanItinerary: (dest: Destination) => void;
  rationaleCache?: Record<string, string>;
}

interface ScoredConstraintCandidate extends Destination {
  score: number;
  totalCost: number;
  budgetFit: number; // 0 to 1
  seasonScore: number;
  safetyLevel: 'safe' | 'caution' | 'avoid';
  rankLabel: string;
  isWeakerMatch: boolean;
  selectionTags: string[];
}

function getSeasonBadge(score: number) {
  if (score >= 0.7) return { label: 'Ideal Season', color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30', icon: <Sun className="w-3 h-3 text-emerald-400" /> };
  if (score >= 0.4) return { label: 'Shoulder Season', color: 'text-amber-400', bgColor: 'bg-amber-500/15', borderColor: 'border-amber-500/30', icon: <CloudSun className="w-3 h-3 text-amber-400" /> };
  return { label: 'Off-Season', color: 'text-red-400', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30', icon: <CloudRain className="w-3 h-3 text-red-400" /> };
}

export const CandidateResults: React.FC<CandidateResultsProps> = ({
  user,
  profile,
  onShowProfile,
  destinations,
  hardConstraints,
  numTravellers,
  origin,
  onPlanItinerary,
  rationaleCache = {}
}) => {
  const [showBrowseMore, setShowBrowseMore] = useState(false);

  // Get travel month from intent state
  const travelMonth = useMemo(() => {
    const state = intentGraph.getState();
    if (state.soft.travel_month) return state.soft.travel_month;
    if (state.hard.date_start) {
      const d = new Date(state.hard.date_start);
      return d.toLocaleString('en-US', { month: 'long' });
    }
    return 'January';
  }, []);

  // Composite scoring + tier assignment
  const { topCandidates, browseCandidates, showingAlternatives } = useMemo(() => {
    const budgetCeiling = hardConstraints?.budget_ceiling || 500000;

    const scored: ScoredConstraintCandidate[] = destinations.map(d => {
      const cost = (d.priceINR || 0) * numTravellers;
      // Calculate budget fit: 1.0 = perfect/zero, 0.0 = exactly ceiling, negative = over budget
      const budgetGap = cost - budgetCeiling;
      const budgetFit = cost <= budgetCeiling 
        ? Math.max(0, 1 - (cost / budgetCeiling)) 
        : - (budgetGap / budgetCeiling);

      // Seasonality
      const seasonData = SEASONALITY_DATA[d.id];
      const seasonScore = seasonData?.monthlyScore?.[travelMonth] ?? 0.5;

      // Safety
      const advisory = TRAVEL_ADVISORIES[d.id];
      const safetyLevel = advisory?.level || 'safe';
      const safetyScore = safetyLevel === 'safe' ? 1 : safetyLevel === 'caution' ? 0.5 : 0;

      // Composite: Budget (40%), Season (30%), Safety (20%), Popularity (10%)
      const popularity = Math.min(1, (d.popularActivities?.length || 0) / 5);
      const composite = (Math.max(0, budgetFit) * 0.4) + (seasonScore * 0.3) + (safetyScore * 0.2) + (popularity * 0.1);

      // Selection tags
      const tags: string[] = [];
      if (budgetFit > 0.5) tags.push('Budget-Friendly');
      if (seasonScore >= 0.7) tags.push('Peak Season');
      if (safetyLevel === 'safe') tags.push('Safe');
      if (d.familyFriendly) tags.push('Family Ready');

      return {
        ...d,
        totalCost: cost,
        budgetFit,
        seasonScore,
        safetyLevel: safetyLevel as 'safe' | 'caution' | 'avoid',
        rankLabel: '',
        isWeakerMatch: false,
        selectionTags: tags,
        score: composite
      } as ScoredConstraintCandidate;
    });

    // Primary matches (within budget)
    const matching = scored.filter(d => d.budgetFit >= 0).sort((a, b) => b.score - a.score);
    
    // Tier assignment
    const top: ScoredConstraintCandidate[] = [];
    const browse: ScoredConstraintCandidate[] = [];

    if (matching.length > 0) {
      matching.forEach((d, idx) => {
        if (idx === 0) {
          d.rankLabel = '🏆 Best Match';
          d.isWeakerMatch = false;
          top.push(d);
        } else if (idx <= 2) {
          d.rankLabel = '💎 Strong Pick';
          d.isWeakerMatch = false;
          top.push(d);
        } else if (idx <= 4) {
          d.rankLabel = '👁 Stretch Pick';
          d.isWeakerMatch = true;
          top.push(d);
        } else {
          d.rankLabel = '';
          browse.push(d);
        }
      });
    }

    // Fallback logic: if no direct matches, find 3 best alternatives (closest to budget)
    const showingAlternatives = matching.length === 0;
    const finalTop = matching.length > 0 
      ? top 
      : scored
          .sort((a, b) => b.budgetFit - a.budgetFit) // Higher (least negative) fits first
          .slice(0, 3)
          .map(d => ({ ...d, rankLabel: '✨ Best Alternative', isWeakerMatch: true }));

    return { 
      topCandidates: finalTop, 
      browseCandidates: browse,
      showingAlternatives
    };
  }, [destinations, hardConstraints, numTravellers, travelMonth]);

  const heroCandidate = topCandidates[0];
  const supportingCandidates = topCandidates.slice(1, 3);
  const stretchCandidates = topCandidates.slice(3);

  return (
    <motion.main 
      className="min-h-screen bg-transparent w-full pb-24 relative z-10"
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 pt-12 space-y-12">
        <PathfinderHeader 
          user={user}
          profile={profile}
          onShowProfile={onShowProfile}
        />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="space-y-4">
            {showingAlternatives && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25"
              >
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Broadened Sync Active</span>
                <span className="px-2 py-0.5 bg-amber-500/20 rounded-full text-[9px] text-amber-300 font-bold">±15% tolerance</span>
              </motion.div>
            )}
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none">
              {showingAlternatives ? (
                <>
                  <span className="text-amber-400">Best</span>{' '}Alternatives Found
                </>
              ) : 'Your Escapes are Ready'}
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              {showingAlternatives 
                ? "No exact budget match — we've surfaced the closest high-quality escapes, ranked by overall score."
                : `Curated for ${numTravellers} traveller${numTravellers > 1 ? 's' : ''} ${hardConstraints?.budget_ceiling ? ` within ₹${hardConstraints.budget_ceiling.toLocaleString('en-IN')} total budget` : ''}${origin ? `, departing from ${origin}` : ''}.`
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-4 shrink-0">
            {/* Sync Status Card */}
            <div className={cn(
              "rounded-2xl p-5 w-full sm:w-auto border transition-all duration-500",
              showingAlternatives
                ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.05)]"
                : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {showingAlternatives ? (
                  <>
                    <div className="relative">
                      <Signal className="w-3.5 h-3.5 text-amber-400" />
                      <div className="absolute inset-0 animate-ping opacity-50">
                        <Signal className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest">Broadened Sync</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Live Data Sync</span>
                  </>
                )}
              </div>
              <div className="text-2xl font-mono text-white">₹{hardConstraints?.budget_ceiling?.toLocaleString('en-IN') || '---'}</div>
              <div className="text-[9px] text-zinc-500 mt-1 font-medium">
                {showingAlternatives ? 'Budget cap + 15% tolerance applied' : 'Budget cap matched exactly'}
              </div>
            </div>

            {/* Match Count */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full sm:w-auto text-center">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                {showingAlternatives ? 'Best Alternatives' : 'Top Matches'}
              </div>
              <div className={cn("text-3xl font-mono font-bold", showingAlternatives ? "text-amber-400" : "text-emerald-400")}>
                {topCandidates.length}
              </div>
              <div className="text-[9px] text-zinc-600 mt-1">
                {browseCandidates.length > 0 ? `+${browseCandidates.length} to browse` : 'curated picks'}
              </div>
            </div>
          </div>
        </div>

        {topCandidates.length === 0 && (
          <div className="py-24 text-center space-y-4 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No matches within budget</h3>
            <p className="text-zinc-400">Try adjusting your budget cap to see more destinations.</p>
          </div>
        )}

        {/* Hero Card */}
        {heroCandidate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
            onClick={() => onPlanItinerary(heroCandidate)}
          >
            <div className={cn(
              "relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-zinc-900 border transition-all duration-700",
              heroCandidate.isWeakerMatch
                ? "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_80px_rgba(245,158,11,0.1)]"
                : "border-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_80px_rgba(16,185,129,0.1)]"
            )}>
              <img
                src={heroCandidate.image || heroCandidate.images?.[0]}
                alt={heroCandidate.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      heroCandidate.isWeakerMatch
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                        : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    )}>
                      {heroCandidate.rankLabel}
                    </span>
                    {heroCandidate.selectionTags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-zinc-300 text-[9px] font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  <div>
                    <div className="text-[#7f7ff5] text-[10px] font-bold uppercase tracking-widest mb-1">{heroCandidate.region}</div>
                    <h2 className={cn(
                      "text-3xl md:text-5xl font-bold text-white tracking-tight transition-colors",
                      heroCandidate.isWeakerMatch ? "group-hover:text-amber-300" : "group-hover:text-emerald-300"
                    )}>{heroCandidate.name}</h2>
                  </div>
                  <p className="text-zinc-300 text-sm max-w-lg leading-relaxed">{heroCandidate.tagline}</p>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-emerald-400" />
                      <span className="text-lg font-bold text-white">₹{heroCandidate.totalCost.toLocaleString('en-IN')}</span>
                      <span className="text-zinc-500 text-xs">total</span>
                    </div>
                    {(() => {
                      const badge = getSeasonBadge(heroCandidate.seasonScore);
                      return (
                        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border", badge.bgColor, badge.borderColor)}>
                          {badge.icon}
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", badge.color)}>{badge.label}</span>
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{formatTravelTime(heroCandidate.flight_duration_hours || 4)}</span>
                    </div>
                  </div>
                </div>

                <button className="absolute right-8 md:right-12 bottom-8 md:bottom-12 px-6 py-3 bg-white text-black rounded-2xl font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105">
                  Plan Itinerary
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supporting Picks */}
        {supportingCandidates.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <Gem className="w-3.5 h-3.5 text-blue-400" />
              Strong Alternatives
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {supportingCandidates.map((dest, idx) => {
                const badge = getSeasonBadge(dest.seasonScore);
                const priceSignal = PRICE_SIGNALS[dest.id];
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => onPlanItinerary(dest)}
                  >
                    <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-[#7f7ff5]/40 hover:shadow-[0_0_40px_rgba(127,127,245,0.1)]">
                      <img
                        src={dest.image || dest.images?.[0]}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-bold uppercase tracking-widest">{dest.rankLabel}</span>
                        <span className={cn("px-2 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider", badge.bgColor, badge.borderColor, badge.color)}>{badge.label}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                        <div>
                          <div className="text-[#7f7ff5] text-[9px] font-bold uppercase tracking-widest mb-0.5">{dest.region}</div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#7f7ff5] transition-colors">{dest.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-white">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-sm font-bold">₹{dest.totalCost.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-medium">{formatTravelTime(dest.flight_duration_hours || 4)}</span>
                          </div>
                          {priceSignal && (
                            <div className="flex items-center gap-1.5 text-zinc-400 transition-colors group-hover:text-amber-400/80">
                              <Plane className="w-3 h-3" />
                              <span className="text-[10px] font-medium">Synced: ₹{priceSignal.cheapestFlight.price.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                        {dest.selectionTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {dest.selectionTags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-zinc-300 text-[8px] font-bold uppercase tracking-wider">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stretch Picks */}
        {stretchCandidates.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Stretch Picks — Weaker Match
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stretchCandidates.map((dest, idx) => {
                const badge = getSeasonBadge(dest.seasonScore);
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => onPlanItinerary(dest)}
                  >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-400 hover:border-amber-500/30 opacity-80 hover:opacity-100">
                      <img src={dest.image || dest.images?.[0]} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[8px] font-bold uppercase tracking-widest">{dest.rankLabel}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                        <div className="text-[#7f7ff5] text-[8px] font-bold uppercase tracking-widest">{dest.region}</div>
                        <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                        <div className="flex items-center gap-3 text-zinc-300">
                          <span className="text-sm font-bold">₹{dest.totalCost.toLocaleString('en-IN')}</span>
                          <span className={cn("text-[9px] font-bold", badge.color)}>{badge.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse More */}
        {browseCandidates.length > 0 && (
          <div className="space-y-6">
            <button
              onClick={() => setShowBrowseMore(!showBrowseMore)}
              className="w-full py-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-center justify-center gap-3 group"
            >
              <Globe className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                {showBrowseMore ? 'Hide' : `Browse ${browseCandidates.length} More Destinations`}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", showBrowseMore && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showBrowseMore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden"
                >
                  {browseCandidates.map((dest, idx) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group cursor-pointer"
                      onClick={() => onPlanItinerary(dest)}
                    >
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 transition-all hover:border-white/20 opacity-60 hover:opacity-100">
                        <img src={dest.image || dest.images?.[0]} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
                          <div className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">{dest.region}</div>
                          <h4 className="text-base font-bold text-white">{dest.name}</h4>
                          <div className="text-sm font-mono text-zinc-300">₹{dest.totalCost.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.main>
  );
};
