import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Calendar, Save, Share2, MapPin, Map as MapIcon, Plane, Clock, Sparkles, Building, Moon, Send, Crown, Camera, Palmtree, Waves, Mountain, Tent, Zap, BrainCircuit, History, Cpu, Palette, Film, Landmark, Coffee, User, Users, Users as UsersIcon, Heart, Briefcase, IndianRupee, RefreshCcw, ArrowRight, Lightbulb, Info, CheckCircle2, AlertTriangle, X, Plus, Trash2, StickyNote, Edit2, Image as ImageIcon, ChevronUp, ChevronDown, Sun, CloudSun, ShieldCheck, ShieldAlert, Hotel, Globe, Leaf, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { calculateDistance, estimateTravelTime, formatTravelTime } from '../../lib/geoUtils';
import type { Destination, ItineraryActivity, UserProfile, TripMember, Occasion, Month, Vibe } from '../../types';
import { intentGraph } from '../../lib/intentGraph';
import { SafeImage } from '../ui/ImageAssets';
import { OCCASIONS, TRANSPORT_OPTIONS } from '../../constants';
import { WeatherDisplay } from './WeatherDisplay';
import { ICON_MAP } from '../../lib/icons';
import { EstimatedCost } from '../ui/EstimatedCost';
import { calculateBudgetSummary } from '../../lib/budgetUtils';
import { SEASONALITY_DATA } from '../../data/seasonality_data';
import { TRAVEL_ADVISORIES } from '../../data/travel_advisories';
import { PRICE_SIGNALS } from '../../data/price_signals';
const VIBE_DESCRIPTIONS: Record<string, string> = {
  'Tropical': 'Lush rainforests and crystal-clear waters meet your desire for exotic serenity.',
  'Electric': 'High-octane city energy matched with your preference for vibrant nightlife.',
  'Zen': 'Peaceful retreats and minimal aesthetics grounded in mindfulness.',
  'Colonial': 'Rich historical narratives and intricate architecture from the era of exploration.',
  'Street': 'Raw, authentic urban experiences and world-class street food scenes.',
  'Arctic': 'Breathtaking icy landscapes and once-in-a-lifetime polar exploration.',
  'Nomadic': 'Off-the-grid adventure and cross-cultural discovery in remote terrains.',
  'Neon': 'Electric futuristic cities and mind-bending digital landscapes.',
  'Alpine': 'High-altitude grandeur and crisp mountain air for peak clarity.',
  'Oceanic': 'Deep sea mystery and coastal freedom at the edge of the world.',
  'Sahara': 'Golden dunes and celestial night skies in a timeless desert landscape.',
  'Volcanic': 'Primeval earth energy and dramatic geological wonders.',
  'Gallic': 'Refined art, sophisticated dining, and the timeless charm of European tradition.',
  'Majestic': 'Grand palaces, imperial history, and the gold-standard of luxury.'
};

// Make sure to add export to function
export default function ItineraryPlanner({ 
  destination, 
  onClose,
  occasion,
  transportId,
  subOption,
  travelMonth,
  tripDays,
  profile,
  selectedVibes,
  numTravellers,
  user,
  onSaveTrip,
  startDate,
  endDate
}: { 
  destination: Destination, 
  onClose: () => void,
  occasion?: Occasion,
  transportId?: string | null,
  subOption?: string | null,
  travelMonth: Month,
  tripDays: number,
  profile: UserProfile,
  selectedVibes: Vibe[],
  numTravellers: number,
  user: any,
  onSaveTrip: (tripData: any) => Promise<any>,
  startDate?: string,
  endDate?: string
}) {
  const ITINERARY_DAY1_EXPLAINER_SEEN_KEY = 'itinerary_day1_explainer_seen_v1';
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ItineraryActivity>>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [insightIndex, setInsightIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [showDay1Explainer, setShowDay1Explainer] = useState(false);
  const [activeActionCardId, setActiveActionCardId] = useState<string | null>(null);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);
  const [activityCosts, setActivityCosts] = useState<Record<string, number>>({});
  
  const [localTripDays, setLocalTripDays] = useState(tripDays);
  const totalDays = localTripDays;
  const distance = profile.lat && profile.lng && destination.lat && destination.lng 
    ? calculateDistance(profile.lat, profile.lng, destination.lat, destination.lng)
    : null;
  
  const estimatedHours = distance 
    ? estimateTravelTime(distance, (transportId as any) || 'flight')
    : destination.travelHours;

  const travelTimeFormatted = formatTravelTime(estimatedHours);

  // Read hard constraints from shared intent graph
  const hardConstraints = intentGraph.getState().hard;

  useEffect(() => {
    intentGraph.setHardConstraint('trip_duration', localTripDays);
  }, [localTripDays]);

  // Sync from props (external changes)
  useEffect(() => {
    if (tripDays !== localTripDays) {
      setLocalTripDays(tripDays);
    }
  }, [tripDays]);

  useEffect(() => {
    if (selectedDay !== 1) {
      setShowDay1Explainer(false);
      return;
    }
    const seen = localStorage.getItem(ITINERARY_DAY1_EXPLAINER_SEEN_KEY) === '1';
    if (seen) {
      setShowDay1Explainer(false);
      return;
    }

    setShowDay1Explainer(true);
    const timer = window.setTimeout(() => {
      localStorage.setItem(ITINERARY_DAY1_EXPLAINER_SEEN_KEY, '1');
      setShowDay1Explainer(false);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [selectedDay]);

  const dismissDay1Explainer = () => {
    localStorage.setItem(ITINERARY_DAY1_EXPLAINER_SEEN_KEY, '1');
    setShowDay1Explainer(false);
  };

  // Cycle through insights every 5 seconds
  useEffect(() => {
    if (!destination.travelerInsights || destination.travelerInsights.length === 0) return;
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % destination.travelerInsights!.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [destination.travelerInsights]);

  const transportLabel = TRANSPORT_OPTIONS.find(t => t.id === transportId)?.label || 'Air Travel';
  const TransportIcon = ICON_MAP[TRANSPORT_OPTIONS.find(t => t.id === transportId)?.iconName || 'Plane'] || Plane;
  const costBasis = destination.costBasis ?? (numTravellers <= 1 ? 'per_person' : 'total');
  
  const [itinerary, setItinerary] = useState<Record<number, ItineraryActivity[]>>({
    1: [
      { id: '1', time: '09:00', title: 'Arrival & Check-in', description: 'Arrive at the destination and settle into your stay.', iconName: 'MapPin' },
      { id: '2', time: '14:00', title: 'Local Exploration', description: 'Walk around the neighborhood and find a local cafe.', iconName: 'Coffee' }
    ],
    2: [
      { id: '3', time: '10:00', title: 'Sightseeing', description: 'Visit the main landmarks and take photos.', iconName: 'Camera' }
    ]
  });

  useEffect(() => {
    const initialActivities = [...(itinerary[1] || [])];
    let added = false;

    if (transportId === 'air' && (subOption === 'Business' || subOption === 'First Class')) {
      if (!initialActivities.find(a => a.id === 't1')) {
        initialActivities.unshift({ id: 't1', time: '07:00', title: 'Lounge Access', description: 'Enjoy premium lounge amenities before your flight.', iconName: 'Coffee' });
        added = true;
      }
    } else if (transportId === 'road' && subOption === 'Self-Drive') {
      if (!initialActivities.find(a => a.id === 't2')) {
        initialActivities.unshift({ id: 't2', time: '08:30', title: 'Vehicle Pickup', description: 'Collect your rental vehicle and begin your road trip.', iconName: 'Car' });
        added = true;
      }
    } else if (transportId === 'train' && subOption === '1st AC') {
      if (!initialActivities.find(a => a.id === 't3')) {
        initialActivities.unshift({ id: 't3', time: '08:00', title: 'Station Lounge', description: 'Relax in the executive lounge before departure.', iconName: 'Coffee' });
        added = true;
      }
    }

    if (added) {
      setItinerary(prev => ({ ...prev, 1: initialActivities }));
    }
  }, [transportId, subOption]);

  const addActivity = (day: number) => {
    const newActivity: ItineraryActivity = {
      id: Math.random().toString(36).substr(2, 9),
      time: '12:00',
      title: 'New Activity',
      description: 'Click edit to customize this plan.',
      iconName: 'Plus'
    };
    setItinerary(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newActivity]
    }));
    // Automatically start editing
    startEditing(newActivity);
  };

  const removeActivity = (day: number, activityId: string) => {
    // Disable removal for Arrival & Check-in
    const activity = itinerary[day]?.find(a => a.id === activityId);
    if (activity?.title === 'Arrival & Check-in') return;

    setItinerary(prev => ({
      ...prev,
      [day]: prev[day].filter(a => a.id !== activityId)
    }));
  };

  const startEditing = (activity: ItineraryActivity) => {
    setEditingActivityId(activity.id);
    setEditForm(activity);
  };

  const saveEdit = (day: number) => {
    if (!editingActivityId) return;
    setItinerary(prev => ({
      ...prev,
      [day]: prev[day].map(a => a.id === editingActivityId ? { ...a, ...editForm } : a)
    }));
    setEditingActivityId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveTrip({
        destination,
        occasion,
        transportId,
        subOption,
        travelMonth,
        tripDays,
        itinerary,
        members
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save trip:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Trip to ${destination.name}`,
      text: `Check out my ${tripDays}-day itinerary for ${destination.name}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Co-planning coming soon: member add UI removed.

  const addDay = () => {
    setLocalTripDays(prev => {
      const next = prev + 1;
      setSelectedDay(next);
      return next;
    });
  };

  const removeDay = (dayToRemove: number) => {
    setLocalTripDays(prev => {
      if (prev <= 1) return prev;
      
      const next = prev - 1;
      
      // Shift activities
      const newItinerary: Record<number, ItineraryActivity[]> = {};
      Object.entries(itinerary).forEach(([day, activities]) => {
        const d = parseInt(day);
        if (d < dayToRemove) {
          newItinerary[d] = activities as ItineraryActivity[];
        } else if (d > dayToRemove) {
          newItinerary[d - 1] = activities as ItineraryActivity[];
        }
      });

      setItinerary(newItinerary);
      
      if (selectedDay >= dayToRemove) {
        setSelectedDay(Math.max(1, selectedDay - 1));
      }
      
      return next;
    });
  };

  const addSuggestion = (day: number, suggestion: Partial<ItineraryActivity>) => {
    const newActivity: ItineraryActivity = {
      id: Math.random().toString(36).substr(2, 9),
      time: suggestion.time || '10:00',
      title: suggestion.title || 'Suggested Activity',
      description: suggestion.description || '',
      iconName: suggestion.iconName || 'Sparkles'
    };
    setItinerary(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newActivity]
    }));
  };

  // Seasonality-aware suggestions
  const suggestions = useMemo(() => {
    const isSummer = ['May', 'June', 'July', 'August'].includes(travelMonth);
    const isWinter = ['December', 'January', 'February'].includes(travelMonth);

    let baseSuggestions = [
      { title: 'Local Market Walk', description: 'Explore the vibrant local markets and pick up souvenirs.', time: '11:00', iconName: 'ShoppingBag' },
      { title: 'Culinary Workshop', description: 'Learn to cook traditional dishes with a local chef.', time: '16:00', iconName: 'Utensils' },
      { title: 'Photography Tour', description: 'Capture the best views of the city with a guide.', time: '07:00', iconName: 'Camera' },
      { title: 'Secret Jazz Bar', description: 'Hidden gem in the old quarter with live music.', time: '21:00', iconName: 'Music' }
    ];

    // Add destination-specific popular activities if available
    if (destination.popularActivities && destination.popularActivities.length > 0) {
      baseSuggestions = [...destination.popularActivities];
    }

    // Destination-specific logic
    if (destination.vibes.includes('serene')) {
      baseSuggestions.push({ title: 'Meditation Session', description: 'Guided mindfulness in a peaceful garden.', time: '06:00', iconName: 'Sunrise' });
    }

    if (isSummer) {
      baseSuggestions.push({ title: 'Sunset Boat Ride', description: 'Cool breeze on the water as the sun goes down.', time: '18:30', iconName: 'Waves' });
    } else if (isWinter) {
      baseSuggestions.push({ title: 'Cozy Fireplace Evening', description: 'Warm drinks and storytelling by the fire.', time: '19:00', iconName: 'Flame' });
    }

    // Return 3 random suggestions
    return baseSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [selectedDay, travelMonth, destination.id, destination.popularActivities]);

  const sortedActivities = useMemo(() => {
    return [...(itinerary[selectedDay] || [])].sort((a, b) => {
      const timeA = a.time.replace(':', '').padStart(4, '0');
      const timeB = b.time.replace(':', '').padStart(4, '0');
      return timeA.localeCompare(timeB);
    });
  }, [itinerary, selectedDay]);

  const itineraryTotalCost = useMemo(() => {
    return Object.values(itinerary).flat().reduce((sum: number, act) => sum + ((act as ItineraryActivity).costINR || 0), 0);
  }, [itinerary]);

  const budgetSummary = useMemo(() => {
    const baseAdjusted = calculateBudgetSummary(destination, numTravellers, travelMonth, occasion);
    // Add the user-added itinerary costs to the breakdown
    return {
      ...baseAdjusted,
      total: baseAdjusted.total + itineraryTotalCost,
      activities: baseAdjusted.activities + itineraryTotalCost
    };
  }, [destination, numTravellers, travelMonth, occasion, itineraryTotalCost]);

  useEffect(() => {
    intentGraph.setHardConstraint('estimate_cost', budgetSummary.total);
    return () => {
      intentGraph.setHardConstraint('estimate_cost', null);
    };
  }, [budgetSummary.total]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black z-[100] overflow-y-auto"
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-20 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{destination.name} Itinerary</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1">
                <p className="text-zinc-300 text-xs md:text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {startDate && endDate ? (
                    <span>
                      {new Date(startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – {new Date(endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span>{totalDays} Days • {travelMonth}</span>
                  )}
                  <span className="text-zinc-600">•</span>
                  <span>{occasion?.label || 'Custom Trip'}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-grow md:flex-grow-0 bg-white/5 p-4 rounded-xl border border-white/10 w-full md:w-auto relative group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold mb-0.5">Budget Estimate</p>
                  <p className="text-xl font-display font-bold">
                    <EstimatedCost
                      amountINR={budgetSummary.total}
                      costBasis="total"
                      numTravellers={numTravellers}
                      textClassName="text-white"
                    />
                  </p>
                </div>
                <button 
                  onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                >
                  <IndianRupee className={cn("w-4 h-4 transition-colors", showBudgetBreakdown ? "text-emerald-400" : "text-zinc-500")} />
                </button>
              </div>

              <AnimatePresence>
                {showBudgetBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-[calc(100%+0.75rem)] right-0 w-64 bg-[#1a1a1c] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] space-y-3 backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Cost Breakdown</span>
                      <IndianRupee className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Stay & Accomodation</span>
                        <span className="text-white font-mono">₹{budgetSummary.stay.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Food & Dining</span>
                        <span className="text-white font-mono">₹{budgetSummary.food.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Local Transport</span>
                        <span className="text-white font-mono">₹{budgetSummary.transport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-400">Experiences & Tips</span>
                          {itineraryTotalCost > 0 && <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] rounded">+₹{itineraryTotalCost}</span>}
                        </div>
                        <span className="text-white font-mono">₹{budgetSummary.activities.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-white/5 font-bold">
                      <span className="text-zinc-300">Total Multiplier</span>
                      <span className="text-emerald-400 font-mono">x{budgetSummary.multiplier}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  saveSuccess ? "bg-emerald-500 text-white" : "bg-white text-black hover:scale-105"
                )}
              >
                <Save className="w-4 h-4" />
                {saveSuccess ? "Saved" : "Save"}
              </button>
              
              <div className="relative group">
                <button 
                  onClick={handleShare}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-[8px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Share it with your trip partner
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Foundations of your Trip - Elaborated Tags */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-widest">Why {destination.name}?</h2>
            <div className="h-px flex-grow bg-white/10" />
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Compass className="w-12 h-12" />
              </div>
              <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">The Rationale</h3>
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                "{destination.rationale}"
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Vibe Pillars</h3>
              <div className="space-y-4">
                {destination.vibes.slice(0, 2).map(vibe => (
                  <div key={vibe} className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded">
                      {vibe}
                    </span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed italic">
                      {VIBE_DESCRIPTIONS[vibe] || `${vibe} atmosphere throughout the region.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-12 h-12" />
              </div>
              <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Selection Basis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Fits ₹{(hardConstraints?.budget_ceiling || 0).toLocaleString()} budget limit</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Optimal {travelMonth} seasonality</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Safe for {occasion?.label || 'travelers'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Time Bar Visualization */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-2">
            <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-widest">Trip Timeline Visualization</h2>
            <div className="flex gap-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-1.5 text-rose-400">
                <div className="w-2 h-2 bg-rose-400 rounded-full" />
                Locked (Travel)
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                Available (Experience)
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <div className="relative h-12 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex min-w-[500px] md:min-w-0">
              <div 
                className="h-full bg-rose-500/20 border-r border-rose-500/30 flex flex-col items-center justify-center group relative"
                style={{ width: `${(estimatedHours / (totalDays * 24)) * 100}%` }}
              >
                <TransportIcon className="w-4 h-4 text-rose-400" />
                <span className="text-[8px] text-rose-400/60 font-bold mt-0.5">{travelTimeFormatted}</span>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {travelTimeFormatted} {transportLabel} ({subOption || 'Standard'})
                </div>
              </div>
              
              <div className="h-full flex-grow flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-emerald-500/10" />
                <Sparkles className="w-4 h-4 text-emerald-400 z-10" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round(totalDays * 24 - estimatedHours * 2)}h Exploration
                </div>
              </div>
              
              <div 
                className="h-full bg-rose-500/20 border-l border-rose-500/30 flex flex-col items-center justify-center group relative"
                style={{ width: `${(estimatedHours / (totalDays * 24)) * 100}%` }}
              >
                <TransportIcon className="w-4 h-4 text-rose-400 scale-x-[-1]" />
                <span className="text-[8px] text-rose-400/60 font-bold mt-0.5">{travelTimeFormatted}</span>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {travelTimeFormatted} {transportLabel} Return
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-zinc-300 font-bold uppercase tracking-tighter">
            <span>Day 0 (Start)</span>
            <span>Day {totalDays} (End)</span>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Left Column: Contextual Insights & Transport */}
            <div className="space-y-6">
              {/* Traveler Tips - Now on Left */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h4 className="font-display font-bold text-[10px] text-white uppercase tracking-widest">Traveler Tips</h4>
                </div>

                <div className="relative h-[100px] w-full">
                  <AnimatePresence mode="wait">
                    {(!destination.travelerInsights || destination.travelerInsights.length === 0) ? (
                      <motion.div
                        key="empty-tips"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2"
                      >
                        <Info className="w-6 h-6 text-zinc-400" />
                        <p className="text-[10px] text-zinc-300 font-medium">No specific tips available yet.</p>
                      </motion.div>
                    ) : (
                      destination.travelerInsights.map((insight, i) => (
                        i === insightIndex && (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute inset-0 flex flex-col gap-2"
                          >
                             {(() => {
                                // Dynamic Categorization for Cultural and Food tips
                                const content = insight.content.toLowerCase();
                                const isCultural = content.includes('culture') || content.includes('tradition') || content.includes('temple') || content.includes('history') || content.includes('festival') || content.includes('local');
                                const isFood = content.includes('food') || content.includes('eat') || content.includes('cuisine') || content.includes('street') || content.includes('dining') || content.includes('taste');
                                
                                let label = 'TIP';
                                let labelClass = 'text-blue-400';
                                
                                if (isCultural) {
                                  label = 'CULTURAL INSIGHT';
                                  labelClass = 'text-violet-400';
                                } else if (isFood) {
                                  label = 'CULINARY POINTER';
                                  labelClass = 'text-orange-400';
                                } else if (insight.tipType === 'alert') {
                                  label = 'ALERT';
                                  labelClass = 'text-rose-400';
                                } else if (insight.tipType === 'avoid') {
                                  label = 'AVOID';
                                  labelClass = 'text-amber-400';
                                }

                                const Icon = isCultural ? Landmark : isFood ? Coffee : insight.tipType === 'alert' ? AlertTriangle : insight.tipType === 'avoid' ? AlertTriangle : Lightbulb;

                                return (
                                  <div className="flex items-center gap-1.5">
                                    <Icon className={cn('w-3 h-3', labelClass)} />
                                    <span className={cn('text-[8px] uppercase font-bold tracking-widest', labelClass)}>
                                      {label}
                                    </span>
                                  </div>
                                );
                              })()}
                              <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-3">"{insight.content}"</p>
                              
                              <div className="mt-auto flex gap-1">
                                {destination.travelerInsights!.map((_, dotIdx) => (
                                  <div 
                                    key={dotIdx}
                                    className={cn(
                                      "h-0.5 rounded-full transition-all duration-500",
                                      dotIdx === insightIndex ? "w-3 bg-white" : "w-1 bg-white/20"
                                    )}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              {transportId && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-md">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TransportIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mb-0.5">Transport Strategy</h4>
                    <p className="text-xs font-display font-bold truncate">{transportLabel} • {subOption || 'Standard'}</p>
                  </div>
                </div>
              )}

              {destination.bestDuration && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-md">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mb-0.5">Recommended Stay</h4>
                    <p className="text-xs font-display font-bold text-white truncate">{destination.bestDuration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Data & Stats */}
            <div className="space-y-6">
              <WeatherDisplay lat={destination.lat} lng={destination.lng} travelMonth={travelMonth} />

              {/* Matched Vibes & Members */}
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                      <UsersIcon className="w-3 h-3" />
                      Trip Members
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/10">
                      <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Me'}`} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                      <span className="text-[8px] font-bold text-white">You</span>
                    </div>
                  </div>
                </div>

                {selectedVibes.length > 0 && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-wrap gap-1.5 shadow-md">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mr-1">Vibes:</span>
                    {selectedVibes.map((vibe) => (
                      <span key={vibe} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-white">
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Destination Intelligence — Elaborated Tags ── */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {/* Seasonality Deep Dive */}
            {SEASONALITY_DATA[destination.id] && (() => {
              const season = SEASONALITY_DATA[destination.id];
              const score = season.monthlyScore[travelMonth] ?? 0.5;
              const highlight = season.seasonalHighlight?.[travelMonth];
              const risk = season.weatherRisk[travelMonth];
              const isIdeal = score >= 0.7;
              const isRisky = score < 0.4;
              return (
                <div className={cn(
                  "p-5 rounded-2xl border space-y-3",
                  isIdeal ? "bg-emerald-500/5 border-emerald-500/20" : isRisky ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
                )}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isIdeal ? "bg-emerald-500/20" : isRisky ? "bg-red-500/20" : "bg-amber-500/20")}>
                      {isIdeal ? <Sun className="w-4 h-4 text-emerald-400" /> : isRisky ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <CloudSun className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Season Suitability</h4>
                      <p className={cn("text-sm font-bold", isIdeal ? "text-emerald-400" : isRisky ? "text-red-400" : "text-amber-400")}>
                        {isIdeal ? 'Ideal Season' : isRisky ? 'Off-Season Risk' : 'Shoulder Season'} — {Math.round(score * 100)}% match
                      </p>
                    </div>
                  </div>
                  {highlight && <p className="text-xs text-zinc-300 leading-relaxed bg-white/5 px-3 py-2 rounded-xl">✨ {highlight}</p>}
                  {risk && <p className="text-xs text-red-300/80 leading-relaxed bg-red-500/5 px-3 py-2 rounded-xl border border-red-500/10">⚠️ {risk}</p>}
                  <div className="pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Best months</p>
                    <div className="flex flex-wrap gap-1">
                      {season.bestMonths.map(m => (
                        <span key={m} className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", m === travelMonth ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-zinc-400")}>{m.substring(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Safety Advisory Detail */}
            {TRAVEL_ADVISORIES[destination.id] && (() => {
              const adv = TRAVEL_ADVISORIES[destination.id];
              const isSafe = adv.level === 'safe';
              const isCaution = adv.level === 'caution';
              return (
                <div className={cn(
                  "p-5 rounded-2xl border space-y-3",
                  isSafe ? "bg-white/5 border-white/10" : isCaution ? "bg-amber-500/5 border-amber-500/20" : "bg-red-500/5 border-red-500/20"
                )}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isSafe ? "bg-emerald-500/20" : "bg-amber-500/20")}>
                      {isSafe ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Travel Advisory</h4>
                      <p className={cn("text-sm font-bold", isSafe ? "text-emerald-400" : "text-amber-400")}>
                        {isSafe ? 'Safe Destination' : 'Exercise Caution'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{adv.summary}</p>
                  {adv.details && <p className="text-xs text-zinc-400 leading-relaxed bg-white/5 px-3 py-2 rounded-xl">{adv.details}</p>}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Source: {adv.source}</span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Updated: {adv.lastUpdated}</span>
                  </div>
                </div>
              );
            })()}

            {/* Price Signals Detail */}
            {PRICE_SIGNALS[destination.id] && (() => {
              const ps = PRICE_SIGNALS[destination.id];
              return (
                <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/20">
                      <IndianRupee className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price Intelligence</h4>
                      <p className="text-sm font-bold text-blue-400">Route-Specific Pricing</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-zinc-400" />
                        <div>
                          <span className="text-xs font-bold text-white">{ps.cheapestFlight.airline}</span>
                          <span className="text-[9px] text-zinc-500 ml-1.5">{ps.cheapestFlight.isDirect ? 'Direct' : `${ps.cheapestFlight.stops || 1} stop`}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">₹{ps.cheapestFlight.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Hotel className="w-3.5 h-3.5 text-zinc-400" />
                        <div>
                          <span className="text-xs font-bold text-white">{ps.bestValueHotel.name}</span>
                          <span className="text-[9px] text-zinc-500 ml-1.5">{'★'.repeat(Math.floor(ps.bestValueHotel.rating))}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">₹{ps.bestValueHotel.pricePerNight.toLocaleString('en-IN')}<span className="text-zinc-500 text-[9px] font-normal">/night</span></span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-xs font-bold text-white">Daily Budget (food + transport + activities)</span>
                      </div>
                      <span className="text-sm font-bold text-white">₹{ps.estimatedDailyBudget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-center pt-1">Prices via {ps.cheapestFlight.source} • ±15% tolerance</p>
                </div>
              );
            })()}
          </div>
        </section>

        <div className="space-y-12">
            {/* Day Selection Bricks */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayDate = startDate ? new Date(startDate) : null;
                if (dayDate) dayDate.setDate(dayDate.getDate() + i);
                const formattedDate = dayDate ? dayDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : null;

                return (
                  <div key={i} className="relative group/day flex-shrink-0">
                    <button
                      onClick={() => setSelectedDay(i + 1)}
                      className={cn(
                        "flex-1 min-w-[110px] py-4 rounded-xl border transition-all duration-300",
                        selectedDay === i + 1 
                          ? "bg-white text-black border-white shadow-lg" 
                          : "bg-white/5 text-zinc-200 border-white/10 hover:border-white/20"
                      )}
                    >
                      <p className="text-[10px] uppercase font-bold tracking-widest mb-1">
                        {formattedDate ? formattedDate.split(',')[0] : `Day ${i + 1}`}
                      </p>
                      <p className="text-xl font-display font-bold">
                        {formattedDate ? formattedDate.split(',')[1].trim() : (i + 1)}
                      </p>
                    </button>
                    
                    {totalDays > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDay(i + 1);
                        }}
                        className="absolute -top-1 -right-1 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover/day:opacity-100 transition-opacity shadow-lg hover:bg-rose-600 z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                onClick={addDay}
                className="flex-shrink-0 min-w-[80px] py-4 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/add"
              >
                <Plus className="w-6 h-6 text-zinc-500 group-hover/add:text-emerald-400 mx-auto mb-1" />
                <p className="text-[8px] uppercase font-bold tracking-widest text-zinc-500 group-hover/add:text-emerald-400">Add Day</p>
              </button>
            </div>

            <AnimatePresence>
              {selectedDay === 1 && showDay1Explainer && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-200 flex items-start justify-between gap-3"
                >
                  <p className="leading-relaxed">
                    🔒 Fixed activities are travel anchors
                    <br />
                    ✏️ Tap any other activity to edit or remove it
                  </p>
                  <button
                    onClick={dismissDay1Explainer}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Dismiss explainer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Itinerary Content */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold">Day {selectedDay} Activities</h3>
                  {startDate && (
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {(() => {
                        const d = new Date(startDate);
                        d.setDate(d.getDate() + (selectedDay - 1));
                        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      })()}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => addActivity(selectedDay)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedActivities.length === 0 ? (
                  <div className="col-span-full p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-200">
                    <MapIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">No activities planned yet.</p>
                    <button 
                      onClick={() => addActivity(selectedDay)}
                      className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                      Click to start planning
                    </button>
                  </div>
                ) : (
                  sortedActivities.map((act, idx) => {
                    const Icon = ICON_MAP[act.iconName] || MapPin;
                    const isEditing = editingActivityId === act.id;
                    const isLocked = act.title === 'Arrival & Check-in';
                    const showActions = !isLocked && activeActionCardId === act.id;

                    return (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "group relative p-5 rounded-3xl border transition-all duration-300 flex flex-col h-full",
                          isLocked
                            ? "bg-white/5 border-white/10 opacity-65"
                            : isEditing
                              ? "bg-white/10 border-white/30 ring-1 ring-white/20"
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                        )}
                        onClick={() => {
                          if (showDay1Explainer) dismissDay1Explainer();
                          if (isLocked || isEditing) return;
                          setActiveActionCardId(prev => (prev === act.id ? null : act.id));
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isLocked
                              ? "bg-white/10 text-zinc-400"
                              : isEditing
                                ? "bg-white text-black"
                                : "bg-white/10 text-zinc-300 group-hover:bg-white group-hover:text-black"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-zinc-300 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            {act.time}
                          </span>
                        </div>
                        
                        <div className="flex-grow">
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Time</label>
                                  <input 
                                    type="text"
                                    value={editForm.time}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Title</label>
                                  <input 
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Description</label>
                                  <textarea 
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 h-20 resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Activity Cost (₹)</label>
                                  <input 
                                    type="number"
                                    value={editForm.costINR || 0}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, costINR: Number(e.target.value) }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Personal Notes</label>
                                  <textarea 
                                    value={editForm.notes || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Add your plans, booking details, or reminders..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 h-20 resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-300 uppercase block mb-1">Reference Images (URLs)</label>
                                  <div className="flex gap-2 mb-2">
                                    <input 
                                      type="text"
                                      value={newImageUrl}
                                      onChange={(e) => setNewImageUrl(e.target.value)}
                                      placeholder="Paste image URL..."
                                      className="flex-grow bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        if (newImageUrl) {
                                          setEditForm(prev => ({
                                            ...prev,
                                            images: [...(prev.images || []), newImageUrl]
                                          }));
                                          setNewImageUrl('');
                                        }
                                      }}
                                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {editForm.images?.map((img, i) => (
                                      <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        <button 
                                          type="button"
                                          onClick={() => setEditForm(prev => ({
                                            ...prev,
                                            images: prev.images?.filter((_, idx) => idx !== i)
                                          }))}
                                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 className="w-3 h-3 text-rose-500" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingActivityId(null)}
                                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => saveEdit(selectedDay)}
                                  className="px-3 py-1.5 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4
                                className={cn(
                                  "font-display font-bold text-base mb-2 transition-colors",
                                  isLocked ? "text-zinc-200" : "text-white group-hover:text-emerald-300"
                                )}
                              >
                                {act.title}
                              </h4>
                              <p className="text-zinc-300 text-xs leading-relaxed line-clamp-3">{act.description}</p>
                              
                              {act.notes && (
                                <div className="mt-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex gap-2">
                                  <StickyNote className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-zinc-200 italic leading-relaxed">{act.notes}</p>
                                </div>
                              )}
                              
                              {act.images && act.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  {act.images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/5 relative group/img">
                                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <ImageIcon className="w-3 h-3 text-white" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                {!isLocked ? (
                                  <div
                                    className={cn(
                                      "flex gap-4 transition-all duration-300",
                                      showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    )}
                                  >
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (showDay1Explainer) dismissDay1Explainer();
                                        startEditing(act);
                                      }}
                                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      Edit
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (showDay1Explainer) dismissDay1Explainer();
                                        removeActivity(selectedDay, act.id);
                                      }}
                                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                                    🔒 FIXED
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              
              {/* Suggestions for the Day */}
              <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-display font-bold">
                    {destination.popularActivities && destination.popularActivities.length > 0 
                      ? `Popular in ${destination.name}` 
                      : `Suggestions for Day ${selectedDay}`}
                  </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {suggestions.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => addSuggestion(selectedDay, sug)}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left hover:border-emerald-500/50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{sug.time}</p>
                      <p className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{sug.title}</p>
                      <p className="text-[10px] text-zinc-200 leading-tight">{sug.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media Inspiration section removed from itinerary view */}
            </div>
          </div>
        </div>
    </motion.div>
  );
}

