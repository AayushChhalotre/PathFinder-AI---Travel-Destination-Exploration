import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Lock, 
  MapPin, 
  Clock, 
  IndianRupee,
  Navigation,
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Info,
  X,
  Plane,
  Hotel,
  Leaf,
  TrendingDown,
  Eye,
  Thermometer,
  CheckCircle2,
  Trophy,
  Gem,
  Wallet,
  Calendar,
  Globe
} from 'lucide-react';
import { Destination, UserProfile, HardConstraints, Month, Vibe } from '../types';
import { DESTINATIONS, VIBE_COLORS } from '../constants';
import { cn } from '../lib/utils';
import { SafeImage } from '../components/ui/ImageAssets';
import { intentGraph, IntentState } from '../lib/intentGraph';
import { generateDestinationRationaleSentence } from '../lib/gemini';
import { PathfinderHeader } from '../components/layout/PathfinderHeader';
import flightTimes from '../data/flight_times.json';
import { SEASONALITY_DATA } from '../data/seasonality_data';
import { TRAVEL_ADVISORIES } from '../data/travel_advisories';
import { PRICE_SIGNALS, findBestValueDestination } from '../data/price_signals';

interface VibeCandidatesProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onExplore: (dest: Destination) => void;
}

interface ScoredCandidate extends Destination {
  score: number;
  rationaleText?: string;
  weather?: any;
  seasonScore: number;
  safetyLevel: 'safe' | 'caution' | 'avoid';
  selectionTags: string[];
  rankLabel: string;
  isWeakerMatch: boolean;
}

const WEATHER_ICONS: Record<string, any> = {
  sunny: Sun,
  cloudy: CloudSun,
  rainy: CloudRain,
  windy: Wind,
  default: CloudSun
};

// Pick travel month from state or derive from dates
function getTravelMonth(state: IntentState): string | null {
  if (state.soft.travel_month) return state.soft.travel_month;
  if (state.hard.date_start) {
    const d = new Date(state.hard.date_start);
    return d.toLocaleString('en-US', { month: 'long' });
  }
  return null;
}

// Get a seasonality badge config based on monthly score
function getSeasonBadge(score: number): { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode } {
  if (score >= 0.7) return {
    label: 'Ideal Season',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
    icon: <Sun className="w-3 h-3 text-emerald-400" />
  };
  if (score >= 0.4) return {
    label: 'Shoulder Season',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
    icon: <CloudSun className="w-3 h-3 text-amber-400" />
  };
  return {
    label: 'Off-Season Risk',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/30',
    icon: <AlertTriangle className="w-3 h-3 text-red-400" />
  };
}

export const VibeCandidates: React.FC<VibeCandidatesProps> = ({ 
  user,
  profile,
  onShowProfile,
  onExplore 
}) => {
  const [state, setState] = useState<IntentState>(intentGraph.getState());
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [browseCandidates, setBrowseCandidates] = useState<ScoredCandidate[]>([]);
  const [showBrowseMore, setShowBrowseMore] = useState(false);
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});

  useEffect(() => {
    return intentGraph.subscribe(setState);
  }, []);

  // ============================================================
  // COMPOSITE SCORING ENGINE
  // Weights: Vibe 35% | Season 25% | Budget 20% | Travel 10% | Safety 10%
  // ============================================================
  useEffect(() => {
    const computeCandidates = async () => {
      setLoading(true);
      
      const { soft, hard } = state;
      const userMoods = soft.mood_tags;
      const userOccasions = soft.occasion_tags;
      const travelMonth = getTravelMonth(state);
      const isNicheRequested = userOccasions.some(o => o.toLowerCase().includes('niche') || o.toLowerCase().includes('offbeat'));

      // ── Step 1: Hard Filter ──
      // Remove destinations that are: over budget, or have 'avoid' advisory
      let filtered = DESTINATIONS.filter(dest => {
        const travellers = hard.num_travellers || 1;
        if (hard.budget_ceiling && (dest.priceINR * travellers) > hard.budget_ceiling) return false;
        
        // Filter out 'avoid' advisory destinations
        const advisory = TRAVEL_ADVISORIES[dest.id];
        if (advisory?.level === 'avoid') return false;
        
        return true;
      });

      // ── Step 2: Composite Score ──
      const scored = filtered.map(dest => {
        const selectionTags: string[] = [];

        // --- Vibe Match (35%) ---
        const matchingVibes = dest.vibes.filter(v => userMoods.includes(v)).length;
        const totalUserVibes = userMoods.length || 1;
        let vibeScore = matchingVibes / totalUserVibes;
        
        if (isNicheRequested && (dest.popularity_index || 0) > 0.6) {
          vibeScore *= 0.6;
        }

        // --- Seasonality Score (25%) ---
        let seasonScore = 0.5; // default neutral
        if (travelMonth) {
          const seasonData = SEASONALITY_DATA[dest.id];
          if (seasonData?.monthlyScore[travelMonth] !== undefined) {
            seasonScore = seasonData.monthlyScore[travelMonth];
          }
          if (seasonScore >= 0.8) selectionTags.push(`✅ Perfect weather in ${travelMonth}`);
          else if (seasonScore < 0.3 && seasonData?.weatherRisk[travelMonth]) {
            selectionTags.push(`⚠️ ${seasonData.weatherRisk[travelMonth].split('.')[0]}`);
          }
        }

        // --- Budget Score (20%) ---
        let budgetScore = 0.5;
        if (hard.budget_ceiling) {
          const travellers = hard.num_travellers || 1;
          const totalCost = dest.priceINR * travellers;
          const ratio = totalCost / hard.budget_ceiling;
          budgetScore = ratio <= 0.5 ? 1.0 : ratio <= 0.8 ? 0.7 : ratio <= 1.0 ? 0.4 : 0.1;
          if (ratio <= 0.5) selectionTags.push('💰 Well within budget');
        }

        // --- Travel Time Score (10%) ---
        const fTime = (flightTimes as any)[dest.id]?.hours || dest.travelHours || 10;
        let travelScore = fTime <= 3 ? 1.0 : fTime <= 6 ? 0.8 : fTime <= 12 ? 0.5 : fTime <= 18 ? 0.3 : 0.1;
        if (fTime <= 4) selectionTags.push(`🛫 ${fTime}h direct flight`);

        // --- Safety Score (10%) ---
        const advisory = TRAVEL_ADVISORIES[dest.id];
        let safetyScore = 1.0;
        const safetyLevel = advisory?.level || 'safe';
        if (safetyLevel === 'caution') {
          safetyScore = 0.6;
        }

        // --- Hidden Gem Bonus ---
        if ((dest.popularity_index || 0) < 0.3) {
          selectionTags.push('🌿 Off the beaten path');
        }

        // ── Composite Score ──
        const compositeScore = 
          vibeScore * 0.35 +
          seasonScore * 0.25 +
          budgetScore * 0.20 +
          travelScore * 0.10 +
          safetyScore * 0.10;

        return {
          ...dest,
          score: compositeScore,
          seasonScore,
          safetyLevel: safetyLevel as 'safe' | 'caution' | 'avoid',
          selectionTags,
          rankLabel: '', // assigned later
          isWeakerMatch: false // assigned later
        } as ScoredCandidate;
      });

      // ── Step 3: Sort & Select Top 3-5 ──
      const sorted = scored.sort((a, b) => b.score - a.score);
      
      // Determine how many strong matches (score >= 0.4)
      const strongMatches = sorted.filter(d => d.score >= 0.4);
      const weakerMatches = sorted.filter(d => d.score < 0.4 && d.score > 0.15);
      
      let finalList: ScoredCandidate[];
      
      if (strongMatches.length >= 5) {
        finalList = strongMatches.slice(0, 5);
      } else if (strongMatches.length >= 3) {
        finalList = strongMatches.slice(0, Math.min(5, strongMatches.length));
      } else {
        // Pad to 3 with weaker matches
        finalList = [
          ...strongMatches,
          ...weakerMatches.slice(0, 3 - strongMatches.length).map(d => ({ ...d, isWeakerMatch: true }))
        ];
      }

      // Find best value destination
      const bestValueId = findBestValueDestination(finalList.map(d => d.id));

      // Assign rank labels
      finalList = finalList.map((dest, idx) => {
        let rankLabel = '';
        if (idx === 0) rankLabel = 'Best Match';
        else if (dest.id === bestValueId) rankLabel = 'Best Value';
        else if ((dest.popularity_index || 0) < 0.3) rankLabel = 'Hidden Gem';
        else if (dest.seasonScore >= 0.85) rankLabel = 'Peak Season';
        else if (dest.isWeakerMatch) rankLabel = 'Stretch Pick';
        else rankLabel = `#${idx + 1} Match`;
        
        return { ...dest, rankLabel };
      });

      // ── Step 4: Gemini Rationales ──
      const finalistsWithRationale = await Promise.all(finalList.map(async (dest) => {
        const seasonContext = travelMonth 
          ? `Traveling in ${travelMonth}. Season suitability: ${dest.seasonScore >= 0.7 ? 'ideal' : dest.seasonScore >= 0.4 ? 'okay' : 'risky'}.`
          : '';
        const safetyContext = dest.safetyLevel === 'caution' 
          ? `Note: ${TRAVEL_ADVISORIES[dest.id]?.summary || 'exercise caution'}.`
          : '';
        
        const prompt = `Why does ${dest.name} (vibes: ${dest.vibes.join(', ')}) match a user seeking ${userMoods.join(', ')}? ${seasonContext} ${safetyContext} Explain in ONE short, compelling sentence starting with "Because you...". Be specific to this destination.`;
        
        try {
          const rationaleText = await generateDestinationRationaleSentence(prompt);
          return { ...dest, rationaleText };
        } catch (e) {
          return { ...dest, rationaleText: dest.rationale || `Perfectly matches your ${userMoods[0]} mood.` };
        }
      }));

      setCandidates(finalistsWithRationale);

      // ── Step 4b: Browse-More candidates ──
      const browseList = sorted
        .filter(d => !finalList.includes(d) && d.score > 0.05)
        .slice(0, 10)
        .map((d, idx) => ({
          ...d,
          rankLabel: '',
          isWeakerMatch: true,
          rationaleText: d.rationale || ''
        }));
      setBrowseCandidates(browseList);

      setLoading(false);

      // ── Step 5: Background Weather Fetch ──
      finalistsWithRationale.forEach(async (dest) => {
        if (dest.lat && dest.lng) {
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lng}&current_weather=true`);
            const data = await res.json();
            setWeatherData(prev => ({ ...prev, [dest.id]: data.current_weather }));
          } catch (e) {
            console.error('Weather fetch failed for', dest.name);
          }
        }
      });
    };

    if (state.soft.mood_tags.length > 0) {
      computeCandidates();
    }
  }, [
    state.soft.mood_tags, 
    state.soft.occasion_tags, 
    state.soft.travel_month,
    state.hard.budget_ceiling, 
    state.hard.origin, 
    state.hard.date_start, 
    state.hard.date_end, 
    state.hard.num_travellers
  ]);

  const travelMonth = getTravelMonth(state);

  const getWeatherDisplay = (destId: string) => {
    const w = weatherData[destId];
    if (!w) return { icon: <CloudSun className="w-4 h-4 text-zinc-400" />, label: 'Loading...' };
    
    const code = w.weathercode;
    const temp = Math.round(w.temperature);
    
    if (code <= 3) return { icon: <Sun className="w-4 h-4 text-amber-400" />, label: `${temp}°C Sunny` };
    if (code <= 48) return { icon: <CloudSun className="w-4 h-4 text-zinc-400" />, label: `${temp}°C Cloudy` };
    return { icon: <CloudRain className="w-4 h-4 text-blue-400" />, label: `${temp}°C Rainy` };
  };

  // ============================================================
  // RANK BADGE ICON
  // ============================================================
  const getRankIcon = (label: string) => {
    switch (label) {
      case 'Best Match': return <Trophy className="w-3.5 h-3.5" />;
      case 'Best Value': return <Wallet className="w-3.5 h-3.5" />;
      case 'Hidden Gem': return <Gem className="w-3.5 h-3.5" />;
      case 'Peak Season': return <Sun className="w-3.5 h-3.5" />;
      case 'Stretch Pick': return <Eye className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getRankColors = (label: string) => {
    switch (label) {
      case 'Best Match': return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300';
      case 'Best Value': return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300';
      case 'Hidden Gem': return 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/40 text-purple-300';
      case 'Peak Season': return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300';
      case 'Stretch Pick': return 'bg-gradient-to-r from-zinc-500/20 to-zinc-600/20 border-zinc-500/40 text-zinc-400';
      default: return 'bg-white/5 border-white/10 text-zinc-300';
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-t-2 border-emerald-500 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-display font-medium text-white italic">Analyzing destinations...</h2>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Scoring vibes • weather • safety • budget</p>
        </div>
      </div>
    );
  }

  const heroDest = candidates[0];
  const otherDests = candidates.slice(1);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-black/40 backdrop-blur-xl no-scrollbar pb-32 relative z-10">
      <div className="w-full px-6 lg:px-12 xl:px-20 pt-12 space-y-12">
        <PathfinderHeader 
          user={user}
          profile={profile}
          onShowProfile={onShowProfile}
        />

        {/* ── Header Section ── */}
        <div className="space-y-6 pt-12 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
              AI-Curated Selection • {candidates.length} Destinations
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[0.95]">
            Handpicked for your <br />
            <span className="text-white/40 italic font-sans font-normal">current state of mind.</span>
          </h1>

          {travelMonth && (
            <p className="text-zinc-400 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              Optimized for <span className="text-white font-semibold">{travelMonth}</span> travel
              {state.hard.budget_ceiling && (
                <> • Budget: <span className="text-white font-semibold">₹{state.hard.budget_ceiling.toLocaleString('en-IN')}</span></>
              )}
            </p>
          )}
        </div>

        {/* ── Hero Card (Top Pick) ── */}
        {heroDest && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950"
            style={{ minHeight: '480px' }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <SafeImage 
                src={heroDest.image} 
                alt={heroDest.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-50" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row h-full p-8 md:p-12 gap-8">
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-between min-h-[380px]">
                {/* Top Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md", getRankColors(heroDest.rankLabel))}>
                    {getRankIcon(heroDest.rankLabel)}
                    <span className="text-[10px] font-black uppercase tracking-wider">{heroDest.rankLabel}</span>
                  </div>
                  
                  {travelMonth && (
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md",
                      getSeasonBadge(heroDest.seasonScore).bgColor,
                      getSeasonBadge(heroDest.seasonScore).borderColor,
                    )}>
                      {getSeasonBadge(heroDest.seasonScore).icon}
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", getSeasonBadge(heroDest.seasonScore).color)}>
                        {getSeasonBadge(heroDest.seasonScore).label}
                      </span>
                    </div>
                  )}

                  {heroDest.safetyLevel === 'caution' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/30 backdrop-blur-md">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Caution</span>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="space-y-4 mt-auto">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                      <MapPin className="w-3 h-3" />
                      <span>{heroDest.location}</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                      {heroDest.name}
                    </h3>
                  </div>

                  <p className="text-zinc-300 text-base leading-relaxed font-medium max-w-xl">
                    {heroDest.rationaleText || heroDest.rationale}
                  </p>

                  {/* Selection Tags */}
                  {heroDest.selectionTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {heroDest.selectionTags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Season Advisory Warning (if off-season) */}
                  {travelMonth && heroDest.seasonScore < 0.4 && SEASONALITY_DATA[heroDest.id]?.weatherRisk[travelMonth] && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20 max-w-xl">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-red-300 leading-relaxed">
                        {SEASONALITY_DATA[heroDest.id].weatherRisk[travelMonth]}
                      </p>
                    </div>
                  )}

                  {/* Safety Advisory */}
                  {heroDest.safetyLevel === 'caution' && TRAVEL_ADVISORIES[heroDest.id] && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 max-w-xl">
                      <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-amber-300 leading-relaxed">
                        {TRAVEL_ADVISORIES[heroDest.id].details || TRAVEL_ADVISORIES[heroDest.id].summary}
                      </p>
                    </div>
                  )}

                  {/* Bottom Row: Budget + Price Signals + CTA */}
                  <div className="flex flex-wrap items-end gap-6 pt-2">
                    {/* Budget */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Est. Budget</span>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-display font-bold text-white">₹{heroDest.priceINR.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">/ person</span>
                      </div>
                    </div>

                    {/* Price Signals */}
                    {PRICE_SIGNALS[heroDest.id] && (
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                            <Plane className="w-3 h-3" /> Flight
                          </span>
                          <span className="text-sm font-bold text-white">
                            ₹{PRICE_SIGNALS[heroDest.id].cheapestFlight.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-zinc-500">{PRICE_SIGNALS[heroDest.id].cheapestFlight.source}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                            <Hotel className="w-3 h-3" /> Hotel
                          </span>
                          <span className="text-sm font-bold text-white">
                            ₹{PRICE_SIGNALS[heroDest.id].bestValueHotel.pricePerNight.toLocaleString('en-IN')}<span className="text-zinc-500 font-normal">/night</span>
                          </span>
                          <span className="text-[9px] text-zinc-500">{PRICE_SIGNALS[heroDest.id].bestValueHotel.source}</span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => onExplore(heroDest)}
                      className="ml-auto group/btn flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Explore Itinerary
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Current Weather */}
              <div className="hidden lg:flex flex-col items-end gap-3 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-md">
                  {getWeatherDisplay(heroDest.id).icon}
                  <span className="text-xs font-bold text-zinc-300">{getWeatherDisplay(heroDest.id).label}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-300">
                    {(flightTimes as any)[heroDest.id]?.hours || heroDest.travelHours || '~'}h travel
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Other Candidates Grid ── */}
        {otherDests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {otherDests.map((dest, idx) => {
                const weather = getWeatherDisplay(dest.id);
                const fTime = (flightTimes as any)[dest.id]?.hours || dest.travelHours || 4;
                const seasonBadge = travelMonth ? getSeasonBadge(dest.seasonScore) : null;
                const priceSignal = PRICE_SIGNALS[dest.id];

                return (
                  <motion.div
                    layout
                    key={dest.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: (idx + 1) * 0.1 }}
                    className={cn(
                      "group relative rounded-[2rem] overflow-hidden border bg-zinc-950 flex flex-col",
                      dest.isWeakerMatch 
                        ? "border-zinc-700/50 opacity-80" 
                        : "border-white/10"
                    )}
                    style={{ minHeight: '420px' }}
                  >
                    {/* Hero Image */}
                    <div className="absolute inset-0 z-0">
                      <SafeImage 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-8">
                      {/* Top Badges */}
                      <div className="flex flex-wrap gap-2 mb-auto">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md", getRankColors(dest.rankLabel))}>
                          {getRankIcon(dest.rankLabel)}
                          <span className="text-[9px] font-black uppercase tracking-wider">{dest.rankLabel}</span>
                        </div>

                        {seasonBadge && (
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md", seasonBadge.bgColor, seasonBadge.borderColor)}>
                            {seasonBadge.icon}
                            <span className={cn("text-[9px] font-bold uppercase tracking-wider", seasonBadge.color)}>{seasonBadge.label}</span>
                          </div>
                        )}

                        {dest.safetyLevel === 'caution' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/30 backdrop-blur-md">
                            <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                            <span className="text-[9px] font-bold text-amber-400 uppercase">Caution</span>
                          </div>
                        )}

                        {dest.isWeakerMatch && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-500/10 rounded-full border border-zinc-500/30 backdrop-blur-md">
                            <Eye className="w-2.5 h-2.5 text-zinc-400" />
                            <span className="text-[9px] font-bold text-zinc-400 uppercase">Weaker Match</span>
                          </div>
                        )}
                      </div>

                      {/* Top-right: Weather + Travel */}
                      <div className="absolute top-8 right-8 flex flex-col gap-2 items-end">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-full border border-white/10 backdrop-blur-md">
                          {weather.icon}
                          <span className="text-[10px] font-bold text-zinc-300">{weather.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-full border border-white/10 backdrop-blur-md">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span className="text-[10px] font-bold text-zinc-300">{fTime}h travel</span>
                        </div>
                      </div>

                      {/* Bottom Content */}
                      <div className="space-y-3 mt-auto">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                            <MapPin className="w-3 h-3" />
                            <span>{dest.location}</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                            {dest.name}
                          </h3>
                        </div>

                        <p className="text-zinc-400 text-sm leading-relaxed font-medium line-clamp-2">
                          {dest.rationaleText || dest.rationale}
                        </p>

                        {/* Selection Tags */}
                        {dest.selectionTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {dest.selectionTags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 rounded-lg border border-white/10 text-zinc-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Season Advisory Warning */}
                        {travelMonth && dest.seasonScore < 0.4 && SEASONALITY_DATA[dest.id]?.weatherRisk[travelMonth] && (
                          <div className="flex items-start gap-2 p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-red-300 leading-relaxed line-clamp-2">
                              {SEASONALITY_DATA[dest.id].weatherRisk[travelMonth]}
                            </p>
                          </div>
                        )}

                        {/* Price Signals + CTA */}
                        <div className="flex items-end gap-4 pt-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Est. Budget</span>
                            <span className="text-lg font-display font-bold text-white">₹{dest.priceINR.toLocaleString('en-IN')}<span className="text-zinc-500 text-xs font-normal"> /person</span></span>
                          </div>

                          {priceSignal && (
                            <div className="flex gap-3">
                              <div className="flex flex-col gap-0">
                                <span className="text-[9px] font-bold uppercase text-zinc-500 flex items-center gap-1">
                                  <Plane className="w-2.5 h-2.5" /> Flight
                                </span>
                                <span className="text-xs font-bold text-white">₹{priceSignal.cheapestFlight.price.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex flex-col gap-0">
                                <span className="text-[9px] font-bold uppercase text-zinc-500 flex items-center gap-1">
                                  <Hotel className="w-2.5 h-2.5" /> Hotel
                                </span>
                                <span className="text-xs font-bold text-white">₹{priceSignal.bestValueHotel.pricePerNight.toLocaleString('en-IN')}<span className="text-zinc-500 font-normal">/n</span></span>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={() => onExplore(dest)}
                            className="ml-auto group/btn flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] text-sm"
                          >
                            Explore
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ── Data Attribution ── */}
        <div className="flex items-center justify-center gap-4 py-6 text-zinc-600 text-[10px] uppercase tracking-widest">
          <span>Prices powered by</span>
          <span className="text-zinc-400 font-bold">Skyscanner</span>
          <span>•</span>
          <span className="text-zinc-400 font-bold">MakeMyTrip</span>
          <span>•</span>
          <span className="text-zinc-400 font-bold">Booking.com</span>
        </div>

        {/* ── Browse More Section ── */}
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
              <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", showBrowseMore && "rotate-90")} />
            </button>

            <AnimatePresence>
              {showBrowseMore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-hidden"
                >
                  {browseCandidates.map((dest, idx) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group cursor-pointer"
                      onClick={() => onExplore(dest)}
                    >
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 transition-all hover:border-white/20 opacity-60 hover:opacity-100">
                        <SafeImage src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
                          <div className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">{dest.location}</div>
                          <h4 className="text-base font-bold text-white">{dest.name}</h4>
                          <div className="text-sm font-mono text-zinc-300">₹{dest.priceINR.toLocaleString('en-IN')}<span className="text-zinc-500 text-[9px] font-normal"> /person</span></div>
                          {dest.vibes.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {dest.vibes.slice(0, 2).map(v => (
                                <span key={v} className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-zinc-400 uppercase font-bold">{v}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {candidates.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Navigation className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">The vibe is too specific</h3>
              <p className="text-zinc-400">We couldn't find destinations matching this exact mood. <br /> Try loosening your constraints or vibes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
