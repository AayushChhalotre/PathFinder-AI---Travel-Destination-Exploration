import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Search, 
  X, 
  Compass, 
  Clock,
  ChevronRight,
  Locate,
  CalendarDays,
  Globe
} from 'lucide-react';
import { VIBE_IMAGES, DESTINATIONS, OCCASIONS, MONTHS } from '../constants';
import { VibeImage, Scenario, Month, Occasion, HardConstraints } from '../types';
import { cn } from '../lib/utils';
import { intentGraph } from '../lib/intentGraph';
import { PathfinderHeader } from '../components/layout/PathfinderHeader';

interface VibeDiscoveryProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onOriginSubmit: (origin: string, coords?: { lat: number; lng: number } | null) => void;
  onNavigateToCandidates: () => void;
}

export const VibeDiscovery: React.FC<VibeDiscoveryProps> = ({
  user,
  profile,
  onShowProfile,
  onOriginSubmit,
  onNavigateToCandidates
}) => {
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [locationPanelDismissed, setLocationPanelDismissed] = useState(false);
  const [originInput, setOriginInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsDetected, setGpsDetected] = useState<{city: string; lat: number; lng: number} | null>(null);

  // Track interaction count for auto-trigger
  const interactionCount = useMemo(() => {
    return selectedVibes.length + (selectedOccasion ? 1 : 0) + (selectedMonth ? 1 : 0);
  }, [selectedVibes, selectedOccasion, selectedMonth]);

  useEffect(() => {
    // Initial sync
    const current = intentGraph.getState();
    if (current.soft.travel_month) setSelectedMonth(current.soft.travel_month);
    if (current.soft.mood_tags.length > 0) setSelectedVibes(current.soft.mood_tags);
    if (current.soft.occasion_tags.length > 0) setSelectedOccasion(current.soft.occasion_tags[0]);

    // Subscribe to future updates
    return intentGraph.subscribe((state) => {
      setSelectedMonth(state.soft.travel_month);
      setSelectedVibes(state.soft.mood_tags);
      if (state.soft.occasion_tags.length > 0) {
        setSelectedOccasion(state.soft.occasion_tags[0]);
      } else {
        setSelectedOccasion(null);
      }
    });
  }, []);

  useEffect(() => {
    if (interactionCount >= 3 && !showLocationPanel && !locationPanelDismissed) {
      setShowLocationPanel(true);
    }
  }, [interactionCount, showLocationPanel, locationPanelDismissed]);

  const toggleVibe = (vibe: string) => {
    const next = selectedVibes.includes(vibe) 
      ? selectedVibes.filter(v => v !== vibe) 
      : [...selectedVibes, vibe];
    
    setSelectedVibes(next);
    intentGraph.updateSoftPreference('mood_tags', next);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (originInput.trim()) {
      onOriginSubmit(originInput);
      onNavigateToCandidates();
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || "Current Location";
          setOriginInput(city);
          setGpsDetected({ city, lat: latitude, lng: longitude });
        } catch (err) {
          setOriginInput("Current Location");
          setGpsDetected({ city: "Current Location", lat: latitude, lng: longitude });
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const confirmGpsLocation = () => {
    if (gpsDetected) {
      onOriginSubmit(originInput || gpsDetected.city, { lat: gpsDetected.lat, lng: gpsDetected.lng });
      setGpsDetected(null);
      onNavigateToCandidates();
    }
  };

  const dismissGpsLocation = () => {
    setGpsDetected(null);
    setOriginInput('');
  };

  return (
    <motion.main 
      className="min-h-screen bg-transparent text-white overflow-x-hidden w-full relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12 space-y-12">
        <PathfinderHeader 
          user={user}
          profile={profile}
          onShowProfile={onShowProfile}
        />

        {/* Discovery Hero Section */}
        <div className="space-y-8 pt-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-rose-500 font-mono text-xs uppercase tracking-[0.2em]">
               <Sparkles className="w-3 h-3" />
               <span>Step 1: Define the Mood</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-5xl font-display">
               Where is the ADVENTURE leading today?
             </h1>
             <p className="text-zinc-400 text-lg max-w-2xl">Select a few vibes to help us understand your travel DNA.</p>
          </div>

          <AnimatePresence>
            {selectedVibes.length > 0 && !showLocationPanel && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setShowLocationPanel(true)}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#7f7ff5]/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all group w-fit"
              >
                <span>Skip to Results</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Occasion Tags */}
        <div className="space-y-4">
           <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">What's the Occasion?</label>
           <div className="flex flex-wrap gap-3">
             {OCCASIONS.map(o => (
               <button
                 key={o.id}
                 onClick={() => {
                   const next = o.id === selectedOccasion ? null : o.id;
                   setSelectedOccasion(next);
                   intentGraph.updateSoftPreference('occasion_tags', next ? [next] : []);
                 }}
                 className={cn(
                   "px-8 py-4 rounded-3xl border transition-all text-sm font-bold flex items-center gap-3",
                   selectedOccasion === o.id
                    ? "bg-[#7f7ff5] border-[#7f7ff5] text-white shadow-lg shadow-[#7f7ff5]/30"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                 )}
               >
                 <span>{o.label}</span>
                 {selectedOccasion === o.id && <ArrowRight className="w-4 h-4" />}
               </button>
             ))}
           </div>
        </div>

        {/* Month Selector: Month of Travel */}
        <div className="space-y-4">
          {/* Row 1: Month pills */}
          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Month of Travel
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {MONTHS.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    const next = m.id === selectedMonth ? null : m.id;
                    setSelectedMonth(next);
                    intentGraph.updateSoftPreference('travel_month', next);
                    intentGraph.setHardConstraints({ date_start: null, date_end: null });
                  }}
                  className={cn(
                    "px-6 py-2 rounded-full border text-sm font-medium transition-all shrink-0",
                    selectedMonth === m.id && !intentGraph.getState().hard.date_start
                      ? "bg-white text-black border-white"
                      : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Specific date range — full width below months */}
          <div className="flex items-center gap-3 pt-1">
            <CalendarDays className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest shrink-0">Or specific dates:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={intentGraph.getState().hard.date_start || ''}
                onChange={(e) => {
                  intentGraph.setHardConstraint('date_start', e.target.value);
                  setSelectedMonth(null);
                  intentGraph.updateSoftPreference('travel_month', null);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#7f7ff5]/50 transition-all [color-scheme:dark] w-36"
              />
              <span className="text-zinc-600 text-sm">—</span>
              <input
                type="date"
                min={intentGraph.getState().hard.date_start || new Date().toISOString().split('T')[0]}
                value={intentGraph.getState().hard.date_end || ''}
                onChange={(e) => intentGraph.setHardConstraint('date_end', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#7f7ff5]/50 transition-all [color-scheme:dark] w-36"
              />
            </div>
          </div>
        </div>

        {/* Vibe Grid (14 Cards Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {VIBE_IMAGES.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleVibe(v.vibes[0])}
              className={cn(
                "relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-300",
                selectedVibes.includes(v.vibes[0]) 
                  ? "border-[#7f7ff5] ring-4 ring-[#7f7ff5]/20 shadow-2xl" 
                  : "border-transparent hover:border-white/20"
              )}
            >
              <img src={v.url} className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest">{v.vibes[0]}</span>
                {selectedVibes.includes(v.vibes[0]) && <Sparkles className="w-4 h-4 text-[#7f7ff5]" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky re-open pill when panel was dismissed */}
      <AnimatePresence>
        {locationPanelDismissed && !showLocationPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => {
                setLocationPanelDismissed(false);
                setShowLocationPanel(true);
              }}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900/95 backdrop-blur-xl border border-[#7f7ff5]/40 rounded-full shadow-2xl shadow-[#7f7ff5]/10 hover:border-[#7f7ff5]/70 hover:bg-zinc-800/95 transition-all group"
            >
              <MapPin className="w-4 h-4 text-[#7f7ff5]" />
              <span className="text-sm font-bold text-white">Enter your starting location</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#7f7ff5] group-hover:translate-x-0.5 transition-all" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-up Location Panel (Auto-trigger after 3 interactions) */}
      <AnimatePresence>
        {showLocationPanel && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-8 bg-[#121214] border-t border-white/10 rounded-t-[3rem] shadow-[0_-40px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="max-w-xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">One last thing...</h2>
                  <p className="text-zinc-400">Where are you travelling from?</p>
                </div>
                <button 
                  onClick={() => {
                    setShowLocationPanel(false);
                    setLocationPanelDismissed(true);
                  }} 
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/10 rounded-full transition-all border border-white/10 group bg-white/5 shadow-lg active:scale-95"
                  aria-label="Minimize location panel"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Minimize</span>
                  <X className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* GPS Confirmation Card */}
              <AnimatePresence>
                {gpsDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-6 bg-[#7f7ff5]/10 border border-[#7f7ff5]/30 rounded-[2rem] space-y-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Globe className="w-16 h-16 text-[#7f7ff5]" />
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className="w-12 h-12 bg-[#7f7ff5]/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <MapPin className="w-6 h-6 text-[#7f7ff5]" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-[#7f7ff5] uppercase tracking-widest mb-1">Detected Departure Hub</p>
                        <p className="text-2xl font-bold text-white tracking-tight">{gpsDetected.city}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-tighter">Automatic GPS Localization Active</p>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      We've identified <span className="text-white font-bold">{gpsDetected.city}</span> as your takeoff point. This helps us calculate <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 underline-offset-4">live route pricing</span> and flight durations specifically for you.
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={confirmGpsLocation}
                        className="flex-[2] py-4 bg-[#7f7ff5] hover:bg-[#6b6bf0] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#7f7ff5]/20 hover:shadow-[#7f7ff5]/40 active:scale-[0.98]"
                      >
                        <Navigation className="w-4 h-4" />
                        Confirm & Personalize
                      </button>
                      <button
                        onClick={dismissGpsLocation}
                        className="flex-1 py-4 bg-white/5 border border-white/10 text-zinc-400 rounded-2xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                      >
                        Change
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLocationSubmit} className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7f7ff5]" />
                <input
                  type="text"
                  placeholder="Street, City, or Airport"
                  autoFocus
                  value={originInput}
                  onChange={(e) => { setOriginInput(e.target.value); if (gpsDetected) setGpsDetected(null); }}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-14 pr-32 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#7f7ff5]/50 transition-all placeholder:text-zinc-600"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 px-6 bg-[#7f7ff5] hover:bg-[#6b6bf0] text-white rounded-2xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                  disabled={!originInput.trim() || isLocating}
                >
                  <Navigation className={cn("w-4 h-4", isLocating && "animate-spin")} />
                  <span>{isLocating ? "Wait..." : "Go"}</span>
                </button>
              </form>

              <div className="flex items-center justify-center gap-2">
                 <button 
                   onClick={useCurrentLocation}
                   disabled={isLocating}
                   className="flex items-center gap-2 text-[#7f7ff5] hover:text-[#a5a5ff] text-sm font-bold transition-colors py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                 >
                   <Locate className={cn("w-4 h-4", isLocating && "animate-pulse")} />
                   <span>{isLocating ? "Detecting location..." : "Enable GPS to locate your location"}</span>
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ghost Spacer for Footer */}
      <div className="h-24" />
    </motion.main>
  );
};
