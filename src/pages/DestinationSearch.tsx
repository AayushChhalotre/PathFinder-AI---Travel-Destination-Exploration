import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, Loader2, ArrowRight, Shield, CloudSun,
  IndianRupee, Sparkles, AlertTriangle, CheckCircle2, XCircle,
  Users, Calendar, ChevronRight, Compass
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { PathfinderHeader } from '../components/layout/PathfinderHeader';
import { intentGraph } from '../lib/intentGraph';
import { analyzeDestination } from '../lib/destinationAnalyzer';
import { getRateLimitStatus, RateLimitStatus } from '../lib/rateLimiter';
import { logDestinationInquiry } from '../lib/userDestinations';
import { DESTINATIONS } from '../constants';
import { DestinationAnalysis, Destination } from '../types';

interface DestinationSearchProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onExplore: (dest: Destination) => void;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const VIBES = ['serene','vibrant','mysterious','rugged','minimalist','luxurious','unplugged','cultural','nocturnal','cinematic'];

const advisoryConfig = {
  safe:    { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, label: 'Safe to Travel' },
  caution: { color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: AlertTriangle, label: 'Exercise Caution' },
  warning: { color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle, label: 'High Advisory' },
  avoid:   { color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',     icon: XCircle,      label: 'Avoid Travel' },
};

export const DestinationSearch: React.FC<DestinationSearchProps> = ({
  user, profile, onShowProfile, onExplore
}) => {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.prefill || '');
  const [budget, setBudget] = useState(300000);
  const [numTravellers, setNumTravellers] = useState(2);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<DestinationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [rateLimit, setRateLimit] = useState<RateLimitStatus | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  // Initial rate limit check and countdown timer
  React.useEffect(() => {
    getRateLimitStatus().then(setRateLimit);

    const timer = setInterval(() => {
      if (rateLimit && rateLimit.remaining === 0) {
        const diff = rateLimit.resetAt.getTime() - Date.now();
        if (diff > 0) {
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setCountdown(`${h}h ${m}m ${s}s`);
        } else {
          setCountdown('');
          getRateLimitStatus().then(setRateLimit);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user, rateLimit]);

  // Autocomplete suggestions from existing DESTINATIONS
  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    return DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  const toggleVibe = (v: string) => {
    setSelectedVibes(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 4 ? [...prev, v] : prev
    );
  };

  const handleAnalyze = async () => {
    if (!query.trim()) { setError('Please enter a destination name.'); return; }
    setError('');
    setIsAnalyzing(true);
    intentGraph.setTargetDestination(query.trim());
    try {
      const result = await analyzeDestination({
        destinationName: query.trim(),
        budget,
        numTravellers,
        travelMonth: selectedMonth || 'flexible',
        vibes: selectedVibes,
        occasions: [],
      });
      setAnalysis(result);
      setStep('result');
      
      // Log to community database (fire and forget)
      logDestinationInquiry(query.trim(), result.weatherOutlook.summary, result.vibeMatch);

      // Refresh rate limit after hit
      const newStatus = await getRateLimitStatus();
      setRateLimit(newStatus);
    } catch (e: any) {
      if (e.name === 'RateLimitError') {
        setError(e.message);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompareAnother = () => {
    setQuery('');
    setAnalysis(null);
    setStep('input');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handlePlanDestination = (name: string, location: string) => {
    // Find in DB or construct a minimal Destination shell
    const found = DESTINATIONS.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (found) { onExplore(found); return; }
    const shell: Destination = {
      id: `user-${Date.now()}`,
      name, location,
      image: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80`,
      images: [],
      vibes: selectedVibes as any[],
      priceBand: budget > 150000 ? 'luxury' : budget > 60000 ? 'moderate' : 'budget',
      priceINR: analysis?.estimatedCost.totalEstimateINR ?? budget,
      travelHours: 10,
      description: `AI-suggested destination based on your preferences.`,
      rationale: analysis?.rationale ?? '',
      bestDuration: '5-7 Days',
    };
    onExplore(shell);
  };

  const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';
    const r = 36; const circ = 2 * Math.PI * r;
    return (
      <svg width="96" height="96" className="rotate-[-90deg]">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="48" y="53" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold"
          style={{ transform: 'rotate(90deg)', transformOrigin: '48px 48px' }}>
          {score}
        </text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col overflow-x-hidden">
      <motion.main
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 relative z-10"
      >
        <PathfinderHeader user={user} profile={profile} onShowProfile={onShowProfile} />

        <div className="mt-10 space-y-12 pb-24">
          {/* Hero */}
          <section className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Destination Intelligence</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none">
              Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Dream</span>
            </h2>
            <p className="text-zinc-400 text-lg font-medium">
              Enter your destination and we'll ground it in weather, advisories, cost reality — and surface smarter alternatives.
            </p>
          </section>

          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-8">

                {/* Destination Input */}
                <div className="relative max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                      placeholder="e.g. Santorini, Bali, New Zealand…"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.04] border border-white/10 rounded-[2rem] text-white text-lg placeholder:text-zinc-600 outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                  {/* Autocomplete */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden z-20">
                        {suggestions.map(s => (
                          <button key={s.id} onClick={() => { setQuery(s.name); }}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left">
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <p className="text-white text-sm font-bold">{s.name}</p>
                              <p className="text-zinc-500 text-xs">{s.location}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Constraints grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {/* Budget */}
                  <div className="p-6 bg-zinc-900/50 border border-white/[0.08] rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Budget Ceiling</span>
                      </div>
                      <span className="text-white font-bold">{formatCurrency(budget)}</span>
                    </div>
                    <input type="range" min="10000" max="1000000" step="10000" value={budget}
                      onChange={e => setBudget(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400" />
                    <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase">
                      <span>₹10K</span><span>₹10L</span>
                    </div>
                  </div>

                  {/* Travellers + Month */}
                  <div className="p-6 bg-zinc-900/50 border border-white/[0.08] rounded-[2rem] space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Travellers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setNumTravellers(Math.max(1, numTravellers - 1))}
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">−</button>
                        <span className="text-white font-bold w-4 text-center">{numTravellers}</span>
                        <button onClick={() => setNumTravellers(Math.min(20, numTravellers + 1))}
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10">+</button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Travel Month</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {MONTHS.map(m => (
                          <button key={m} onClick={() => setSelectedMonth(prev => prev === m ? '' : m)}
                            className={cn('py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all',
                              selectedMonth === m
                                ? 'bg-amber-400 text-black border-amber-400'
                                : 'bg-white/[0.03] border-white/[0.07] text-zinc-500 hover:text-white hover:border-white/20')}>
                            {m.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vibe pills */}
                <div className="max-w-3xl mx-auto space-y-3">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500 text-center">
                    Vibe (Optional — helps find better alternatives)
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {VIBES.map(v => (
                      <button key={v} onClick={() => toggleVibe(v)}
                        className={cn('px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all',
                          selectedVibes.includes(v)
                            ? 'bg-amber-400 text-black border-amber-400'
                            : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white')}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-rose-400 text-sm text-center">{error}</p>}

                {/* CTA */}
                <div className="flex flex-col items-center gap-4">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze} disabled={isAnalyzing || !query.trim() || (rateLimit?.allowed === false)}
                    className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-[2rem] font-display font-bold text-lg shadow-[0_20px_50px_rgba(245,158,11,0.25)] hover:shadow-[0_20px_60px_rgba(245,158,11,0.35)] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analysing…</> : <><Sparkles className="w-5 h-5" /> Analyse Destination</>}
                  </motion.button>

                  {/* Quota Indicator */}
                  {rateLimit && (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 bg-white/5 border rounded-full transition-colors",
                        rateLimit.remaining > 0 ? 'border-white/10' : 'border-rose-500/30 bg-rose-500/5'
                      )}>
                        <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', rateLimit.remaining > 0 ? 'bg-emerald-500' : 'bg-rose-500')} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          {rateLimit.remaining === 0 ? (
                            <span className="text-rose-400">Quota Refreshes in {countdown}</span>
                          ) : (
                            <>{rateLimit.remaining} / {user ? '10' : '3'} daily queries remaining</>
                          )}
                        </span>
                      </div>
                      {!user && rateLimit.remaining === 0 && (
                        <button onClick={onShowProfile} className="text-[10px] text-amber-400 font-bold hover:underline">
                          Sign in to unlock 10 daily queries
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'result' && analysis && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8">

                {/* Back */}
                <button onClick={() => setStep('input')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                  ← Back
                </button>

                {/* Feasibility Hero Card */}
                <div className="p-8 bg-zinc-900/60 border border-white/[0.08] rounded-[2.5rem] backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <ScoreRing score={analysis.feasibilityScore} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fit Score</p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-3xl font-display font-bold text-white">{analysis.destinationName}</h3>
                        <span className={cn('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                          analysis.budgetAlignment === 'within' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : analysis.budgetAlignment === 'stretch' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400')}>
                          {analysis.budgetAlignment === 'within' ? 'Within Budget' : analysis.budgetAlignment === 'stretch' ? 'Budget Stretch' : 'Over Budget'}
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{analysis.rationale}</p>
                      {analysis.vibeMatch.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {analysis.vibeMatch.map(v => (
                            <span key={v} className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-wider">{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info cards grid */}
                <div className="grid md:grid-cols-3 gap-5">
                  {/* Weather */}
                  <div className="p-6 bg-zinc-900/50 border border-white/[0.08] rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-2">
                      <CloudSun className="w-5 h-5 text-sky-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-sky-400">Weather</span>
                    </div>
                    <p className="text-white font-bold">{analysis.weatherOutlook.tempRange}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">{analysis.weatherOutlook.summary}</p>
                    <span className="inline-block px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-[9px] font-black uppercase tracking-wider">{analysis.weatherOutlook.season}</span>
                  </div>

                  {/* Advisory */}
                  {(() => {
                    const cfg = advisoryConfig[analysis.travelAdvisory.level];
                    const Icon = cfg.icon;
                    return (
                      <div className={cn('p-6 border rounded-[2rem] space-y-3', cfg.bg)}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn('w-5 h-5', cfg.color)} />
                          <span className={cn('text-xs font-black uppercase tracking-widest', cfg.color)}>Advisory</span>
                        </div>
                        <p className={cn('font-bold', cfg.color)}>{cfg.label}</p>
                        <p className="text-zinc-400 text-xs leading-relaxed">{analysis.travelAdvisory.details}</p>
                      </div>
                    );
                  })()}

                  {/* Cost */}
                  <div className="p-6 bg-zinc-900/50 border border-white/[0.08] rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Est. Cost</span>
                    </div>
                    <p className="text-white font-bold text-lg">{formatCurrency(analysis.estimatedCost.totalEstimateINR)}</p>
                    <div className="space-y-1 text-xs text-zinc-500">
                      <div className="flex justify-between"><span>Round-trip flight</span><span className="text-zinc-300">{formatCurrency(analysis.estimatedCost.flightINR)}</span></div>
                      <div className="flex justify-between"><span>Stay / night</span><span className="text-zinc-300">{formatCurrency(analysis.estimatedCost.stayPerNightINR)}</span></div>
                    </div>
                  </div>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanDestination(analysis.destinationName, '')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-[2rem] font-display font-bold text-base shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all group">
                    Plan {analysis.destinationName}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleCompareAnother}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[2rem] font-display font-bold text-base hover:bg-white/10 transition-all">
                    <Compass className="w-5 h-5 text-amber-400" />
                    Compare Another
                  </motion.button>
                </div>

                {/* Alternatives */}
                {analysis.alternatives.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h4 className="text-xl font-display font-bold text-white">Smarter Alternatives</h4>
                      <span className="text-zinc-600 text-sm">— same vibe, better fit</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                      {analysis.alternatives.map((alt, i) => (
                        <motion.div key={i} whileHover={{ y: -4 }}
                          className="group bg-zinc-900/50 border border-white/[0.08] rounded-[2rem] overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all"
                          onClick={() => handlePlanDestination(alt.name, alt.location)}>
                          <div className="aspect-video overflow-hidden relative">
                            <img src={alt.imageUrl || `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`}
                              alt={alt.name}
                              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'; }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          </div>
                          <div className="p-5 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-bold">{alt.name}</p>
                                <p className="text-zinc-500 text-xs">{alt.location}</p>
                              </div>
                              <span className="text-emerald-400 font-bold text-sm shrink-0">{formatCurrency(alt.estimatedCostINR)}</span>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">{alt.whyBetter}</p>
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold pt-1">
                              <span>Plan this</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Background glows */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-amber-500/[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-orange-500/[0.04] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};
