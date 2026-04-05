import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Calendar, Save, Share2, MapPin, Plane, Clock, Sparkles, Building, Moon, Send, Crown, Camera, Palmtree, Waves, Mountain, Tent, Zap, BrainCircuit, History, Cpu, Palette, Film, Landmark, Coffee, User, Users, Users as UsersIcon, Heart, Briefcase, IndianRupee, RefreshCcw, ArrowRight, Lightbulb, Info, CheckCircle2, AlertTriangle, X, Plus, Trash2, StickyNote, Edit2, Instagram, Youtube, Pin, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { calculateDistance, estimateTravelTime, formatTravelTime } from '../../lib/geoUtils';
import type { Destination, ItineraryActivity, UserProfile, Trip, TripMember, Occasion, Month } from '../../types';
import { SafeImage } from '../ui/ImageAssets';
import { OCCASIONS, TRANSPORT_OPTIONS } from '../../constants';
import { WeatherDisplay } from './WeatherDisplay';
import { ICON_MAP } from '../../lib/icons';

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
  user,
  onSaveTrip
}: { 
  destination: Destination, 
  onClose: () => void,
  occasion?: Occasion,
  transportId?: string | null,
  subOption?: string | null,
  travelMonth: Month,
  tripDays: number,
  profile: UserProfile,
  user: any,
  onSaveTrip: (tripData: any) => Promise<any>
}) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ItineraryActivity>>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [insightIndex, setInsightIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showMemberInput, setShowMemberInput] = useState(false);
  
  const totalDays = tripDays;
  const distance = profile.lat && profile.lng && destination.lat && destination.lng 
    ? calculateDistance(profile.lat, profile.lng, destination.lat, destination.lng)
    : null;
  
  const estimatedHours = distance 
    ? estimateTravelTime(distance, (transportId as any) || 'flight')
    : destination.travelHours;

  const travelTimeFormatted = formatTravelTime(estimatedHours);

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

  const addMember = () => {
    if (!newMemberEmail) return;
    const isWhatsApp = /^\+?[0-9\s-]+$/.test(newMemberEmail);
    const newMember: TripMember = {
      uid: Math.random().toString(36).substr(2, 9),
      email: isWhatsApp ? `${newMemberEmail}@whatsapp` : newMemberEmail,
      displayName: isWhatsApp ? `WA: ${newMemberEmail}` : newMemberEmail.split('@')[0],
    };
    setMembers(prev => [...prev, newMember]);
    setNewMemberEmail('');
    setShowMemberInput(false);
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black z-[100] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{destination.name} Itinerary</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1">
                {profile.travelGoal && (
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                    Personalized for {profile.travelGoal}
                  </p>
                )}
                <p className="text-zinc-500 text-xs md:text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {totalDays} Days • {occasion?.label || 'Custom Trip'} • {travelMonth}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-grow md:flex-grow-0 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Budget Estimate</p>
              <p className="text-lg font-display font-bold">₹{destination.priceINR.toLocaleString()}</p>
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

        {/* Travel Time Bar Visualization */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-2">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Trip Timeline Visualization</h2>
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
          <div className="flex justify-between mt-3 text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
            <span>Day 0 (Start)</span>
            <span>Day {totalDays} (End)</span>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Left Column: Transport & Itinerary Visualization */}
            <div className="space-y-4">
              {transportId && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-md">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TransportIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Transport Strategy</h4>
                    <p className="text-xs font-display font-bold truncate">{transportLabel} • {subOption || 'Standard'}</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Experience Match</span>
                  <span className="text-xs font-bold text-emerald-400">98%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
                <p className="text-[9px] text-zinc-500 leading-tight">Optimized for your travel goal and selected vibes.</p>
              </div>

              {destination.bestDuration && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-md">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Recommended Stay</h4>
                    <p className="text-xs font-display font-bold text-white truncate">{destination.bestDuration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contextual Insights (Prioritized) */}
            <div className="space-y-4">
              {/* Priority 1: Weather & Tips */}
              <div className="grid grid-cols-1 gap-4">
                <WeatherDisplay lat={destination.lat} lng={destination.lng} />
                
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 shadow-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h4 className="font-display font-bold text-[10px] text-white uppercase tracking-widest">Traveler Tips</h4>
                  </div>

                  <div className="relative h-[120px] w-full">
                    <AnimatePresence mode="wait">
                      {(!destination.travelerInsights || destination.travelerInsights.length === 0) ? (
                        <motion.div
                          key="empty-tips"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2"
                        >
                          <Info className="w-6 h-6 text-zinc-600" />
                          <p className="text-[10px] text-zinc-500 font-medium">No specific tips available yet.</p>
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
                              <div className="flex items-center gap-1.5">
                                {insight.type === 'do' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                {insight.type === 'dont' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                                {insight.type === 'tip' && <Lightbulb className="w-3 h-3 text-blue-400" />}
                                <span className={cn(
                                  "text-[8px] uppercase font-bold tracking-widest",
                                  insight.type === 'do' ? "text-emerald-400" :
                                  insight.type === 'dont' ? "text-rose-400" :
                                  "text-blue-400"
                                )}>
                                  {insight.type === 'do' ? "Do" : insight.type === 'dont' ? "Avoid" : "Tip"}
                                </span>
                              </div>
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
              </div>

              {/* Priority 2: Trip Members */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <UsersIcon className="w-3 h-3" />
                    Trip Members
                  </h4>
                  <button 
                    onClick={() => setShowMemberInput(!showMemberInput)}
                    className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest hover:text-emerald-300 transition-colors"
                  >
                    {showMemberInput ? "Cancel" : "Add"}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/10">
                    <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Me'}`} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                    <span className="text-[8px] font-bold text-white">You</span>
                  </div>
                  {members.map((member, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5 group">
                      <span className="text-[8px] font-bold text-zinc-400">{member.displayName}</span>
                      <button 
                        onClick={() => setMembers(prev => prev.filter((_, idx) => idx !== i))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5 text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>

                {showMemberInput && (
                  <div className="flex gap-1.5 animate-in slide-in-from-top-1 duration-300">
                    <input 
                      type="text"
                      placeholder="Email or WhatsApp No."
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="flex-grow bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-white/30"
                    />
                    <button 
                      onClick={addMember}
                      className="px-3 py-1.5 bg-white text-black rounded-lg text-[8px] font-bold uppercase tracking-widest"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-12">
            {/* Day Selection Bricks */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {Array.from({ length: totalDays }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i + 1)}
                  className={cn(
                    "flex-1 min-w-[80px] py-4 rounded-xl border transition-all duration-300",
                    selectedDay === i + 1 
                      ? "bg-white text-black border-white shadow-lg" 
                      : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                  )}
                >
                  <p className="text-[10px] uppercase font-bold tracking-widest mb-1">Day</p>
                  <p className="text-xl font-display font-bold">{i + 1}</p>
                </button>
              ))}
            </div>

            {/* Itinerary Content */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold">Day {selectedDay} Activities</h3>
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
                  <div className="col-span-full p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
                    <Map className="w-12 h-12 mb-4 opacity-20" />
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

                    return (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "group relative p-5 rounded-3xl border transition-all duration-300 flex flex-col h-full",
                          isEditing ? "bg-white/10 border-white/30 ring-1 ring-white/20" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isEditing ? "bg-white text-black" : "bg-white/10 text-zinc-400 group-hover:bg-white group-hover:text-black"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            {act.time}
                          </span>
                        </div>
                        
                        <div className="flex-grow">
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Time</label>
                                  <input 
                                    type="text"
                                    value={editForm.time}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Title</label>
                                  <input 
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Description</label>
                                  <textarea 
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 h-20 resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Personal Notes</label>
                                  <textarea 
                                    value={editForm.notes || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Add your plans, booking details, or reminders..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 h-20 resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Reference Images (URLs)</label>
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
                                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
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
                              <h4 className="font-display font-bold text-base mb-2 group-hover:text-amber-400 transition-colors">{act.title}</h4>
                              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{act.description}</p>
                              
                              {act.notes && (
                                <div className="mt-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex gap-2">
                                  <StickyNote className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-zinc-400 italic leading-relaxed">{act.notes}</p>
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
                                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button 
                                      onClick={() => startEditing(act)}
                                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => removeActivity(selectedDay, act.id)}
                                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                                    <Info className="w-3 h-3" />
                                    Fixed
                                  </div>
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
                      <p className="text-[10px] text-zinc-500 leading-tight">{sug.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media Inspiration Section - Moved to Bottom */}
              <div className="pt-12 border-t border-white/10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">Social Media Inspiration</h4>
                </div>

                {(!destination.socialMediaPosts || destination.socialMediaPosts.length === 0) ? (
                  <div className="p-12 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-zinc-700" />
                    </div>
                    <div className="max-w-xs">
                      <p className="text-sm font-bold text-white mb-1">No posts found yet</p>
                      <p className="text-xs text-zinc-500">We're still curating the best social media moments for {destination.name}. Check back soon!</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destination.socialMediaPosts.map((post) => (
                      <div 
                        key={post.id}
                        onClick={() => {
                          if (post.url && post.url !== '#') {
                            window.open(post.url, '_blank');
                          }
                        }}
                        className={cn(
                          "group relative flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all",
                          post.url && post.url !== '#' ? "cursor-pointer" : "cursor-default"
                        )}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <SafeImage 
                            src={post.thumbnail} 
                            alt={post.caption} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1.5 border border-white/10">
                            {post.platform === 'instagram' && <Instagram className="w-3 h-3 text-pink-400" />}
                            {post.platform === 'youtube' && <Youtube className="w-3 h-3 text-rose-500" />}
                            {post.platform === 'pinterest' && <Pin className="w-3 h-3 text-rose-600" />}
                            <span className="text-[10px] font-bold text-white/90">{post.author}</span>
                          </div>
                          
                          {post.url && post.url !== '#' ? (
                            <div className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-bold text-zinc-400 uppercase tracking-widest border border-white/5">
                              Preview Only
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex flex-col flex-grow">
                          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-medium mb-3">
                            {post.caption}
                          </p>
                          
                          {(!post.url || post.url === '#') && (
                            <p className="mt-auto text-[10px] text-zinc-500 italic">
                              Link coming soon...
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
}

