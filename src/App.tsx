/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ChevronRight, 
  IndianRupee, 
  RefreshCcw,
  ArrowRight,
  Mountain,
  Tent,
  Zap,
  Landmark,
  Building,
  Wind,
  Moon,
  Crown,
  Coffee,
  User,
  Briefcase,
  Map as MapIcon,
  Heart,
  Users,
  Plane,
  Camera,
  Palmtree,
  Waves,
  BrainCircuit,
  History,
  Cpu,
  Palette,
  Film,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Sun,
  Laptop,
  Gift,
  TrendingUp,
  Star,
  Zap as ZapIcon,
  BadgePercent,
  Sparkles as SparklesIcon,
  GlassWater,
  Sunrise,
  Utensils,
  Camera as CameraIcon,
  TrainFront,
  Car,
  Rocket,
  Calendar,
  Map,
  Plus,
  Info,
  ChevronLeft,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  Clock,
  Sparkles,
  Music,
  ShoppingBag,
  Flame,
  Instagram,
  Youtube,
  Pin,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Navigation,
  StickyNote,
  Image,
  Share2,
  Save,
  Users as UsersIcon,
} from 'lucide-react';
import { cn } from './lib/utils';
import { VIBE_IMAGES, SCENARIOS, DESTINATIONS, VIBE_COLORS, OCCASIONS, TRANSPORT_OPTIONS } from './constants';
import { Destination, Vibe, UserProfile, Occasion, TransportOption, Month, ItineraryActivity, Trip, TripMember } from './types';
import { calculateDistance, estimateTravelTime, formatTravelTime } from './lib/geoUtils';
import { GoogleGenAI } from "@google/genai";
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const ICON_MAP: Record<string, any> = {
  Mountain,
  Tent,
  Zap,
  Landmark,
  Building,
  Wind,
  Moon,
  Crown,
  Coffee,
  History,
  Cpu,
  Palette,
  Film,
  Cloud,
  Heart,
  User,
  Users,
  Laptop,
  Gift,
  GlassWater,
  Sunrise,
  Utensils,
  Camera: CameraIcon,
  Plane,
  TrainFront,
  Car,
  Rocket,
  Calendar,
  Map,
  Plus,
  Info,
  ChevronLeft,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  Clock,
  Sparkles,
  Instagram,
  Youtube,
  Pin,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink
};

function SafeImage({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = React.useState(false);
  const fallback = `https://picsum.photos/seed/${alt}/800/600`;

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}

function ImageCarousel({ images, alt }: { images: string[], alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <SafeImage src={images[index]} alt={`${alt} ${index}`} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-1 h-1 rounded-full transition-all duration-300",
              i === index ? "bg-white w-3" : "bg-white/30"
            )} 
          />
        ))}
      </div>
    </div>
  );
}

function WeatherDisplay({ lat, lng }: { lat?: number; lng?: number }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (!lat || !lng) return null;
  if (loading) return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="w-8 h-8 bg-white/5 rounded-lg" />
      <div className="h-4 w-20 bg-white/5 rounded" />
    </div>
  );
  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-400" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-zinc-400" />;
    if (code <= 48) return <Wind className="w-5 h-5 text-zinc-500" />;
    if (code <= 65 || (code >= 80 && code <= 82)) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (code <= 77) return <CloudSnow className="w-5 h-5 text-indigo-300" />;
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Cloud className="w-5 h-5 text-zinc-400" />;
  };

  const current = weather.current_weather;
  const daily = weather.daily;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            {getWeatherIcon(current.weathercode)}
          </div>
          <div>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Current Weather</p>
            <p className="text-lg font-display font-bold leading-none">{Math.round(current.temperature)}°C</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Wind</p>
          <p className="text-xs font-medium">{current.windspeed} km/h</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-white/5">
        {daily.time.slice(1, 4).map((date: string, i: number) => (
          <div key={date} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[7px] font-bold text-zinc-500 uppercase">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <div className="scale-75">
              {getWeatherIcon(daily.weathercode[i + 1])}
            </div>
            <p className="text-[9px] font-bold">
              {Math.round(daily.temperature_2m_max[i + 1])}°/{Math.round(daily.temperature_2m_min[i + 1])}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItineraryPlanner({ 
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
    const newMember: TripMember = {
      uid: Math.random().toString(36).substr(2, 9),
      email: newMemberEmail,
      displayName: newMemberEmail.split('@')[0],
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
                {profile.profession && (
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                    Personalized for {profile.profession}
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
                <p className="text-[9px] text-zinc-500 leading-tight">Optimized for your {profile.profession} profile and selected vibes.</p>
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
                      type="email"
                      placeholder="Email or ID"
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
                                        <Image className="w-3 h-3 text-white" />
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

export default function App() {
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(300000);
  const [maxHours, setMaxHours] = useState<number>(24);
  const [tripDays, setTripDays] = useState<number>(4);
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month>('April');
  const [selectedDestinationForItinerary, setSelectedDestinationForItinerary] = useState<Destination | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile>({
    workType: 'desk',
    travelStyle: 'solo',
    interests: []
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);

  // Auth State Listener
  useEffect(() => {
    // Test Firestore connection
    const testConnection = async () => {
      try {
        const { getDocFromServer } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Firestore is offline. Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load profile from Firestore
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({
              ...prev,
              profession: data.profession || prev.profession,
              location: data.location || prev.location,
              lat: data.lat || prev.lat,
              lng: data.lng || prev.lng,
              workType: data.workType || prev.workType,
              travelStyle: data.travelStyle || prev.travelStyle,
              interests: data.interests || prev.interests
            }));
          }

          // Load saved trips
          const tripsQuery = query(collection(db, 'trips'), where('ownerUid', '==', currentUser.uid));
          const tripsSnap = await getDocs(tripsQuery);
          const tripsData = tripsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
          setSavedTrips(tripsData);
        } catch (error) {
          console.error("Error loading profile or trips:", error);
        }
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      setUser(loggedInUser);
      
      // Check if profile exists, if not create it
      const docRef = doc(db, 'users', loggedInUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          displayName: loggedInUser.displayName,
          photoURL: loggedInUser.photoURL,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      // Optional: reset profile or keep it local
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const saveProfileToFirestore = async (updatedProfile: UserProfile) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...updatedProfile,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving profile to Firestore:", error);
    }
  };

  const handlePlanItinerary = (dest: Destination) => {
    // If profile is missing location or profession, show modal first
    if (!profile.location || !profile.profession) {
      setPendingDestination(dest);
      setShowProfileModal(true);
    } else {
      setSelectedDestinationForItinerary(dest);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      saveProfileToFirestore(profile);
    }
    
    if (pendingDestination) {
      // If we were in the middle of planning, proceed now
      if (!profile.location || !profile.profession) {
        // You could add a toast or error message here if you want to be strict
        return;
      }
      setSelectedDestinationForItinerary(pendingDestination);
      setPendingDestination(null);
    }
    setShowProfileModal(false);
  };

  const handleSaveTrip = async (tripData: Omit<Trip, 'id' | 'ownerUid' | 'createdAt'>) => {
    if (!user) {
      handleGoogleLogin();
      return;
    }

    try {
      const newTrip = {
        ...tripData,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        members: tripData.members || [{ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }]
      };
      
      const docRef = await addDoc(collection(db, 'trips'), newTrip);
      const savedTrip = { ...newTrip, id: docRef.id } as Trip;
      setSavedTrips(prev => [savedTrip, ...prev]);
      return savedTrip;
    } catch (error) {
      console.error("Error saving trip:", error);
      throw error;
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state || "Current Location";
          setProfile(prev => ({ ...prev, location: city, lat: latitude, lng: longitude }));
        } catch (error) {
          console.error("Error geocoding:", error);
          setProfile(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, lat: latitude, lng: longitude }));
        }
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }
  };

  const SELECTION_LIMIT = 5;

  // Dynamic Visual Anchors logic
  const filteredImages = useMemo(() => {
    if (selectedVibes.length === 0) {
      // Show all images initially to fill the larger grid
      return VIBE_IMAGES;
    }
    // Filter images that match ANY of the selected vibes
    return VIBE_IMAGES.filter(img => 
      img.vibes.some(v => selectedVibes.includes(v))
    );
  }, [selectedVibes]);

  // Background gradient logic
  const activeVibe = selectedVibes[selectedVibes.length - 1] || 'default';
  const gradientClass = VIBE_COLORS[activeVibe] || VIBE_COLORS.default;

  const toggleImage = (id: string, vibes: Vibe[]) => {
    if (selectedImageIds.includes(id)) {
      setSelectedImageIds(prev => prev.filter(i => i !== id));
      // Remove all vibes associated with this image from the selection
      setSelectedVibes(prev => prev.filter(v => !vibes.includes(v)));
    } else {
      if (selectedImageIds.length < SELECTION_LIMIT) {
        setSelectedImageIds(prev => [...prev, id]);
        // Add unique vibes from this image
        setSelectedVibes(prev => {
          const newVibes = vibes.filter(v => !prev.includes(v));
          return [...prev, ...newVibes];
        });
      }
    }
  };

  const selectScenario = (id: string, vibe: Vibe) => {
    setSelectedScenarioId(id);
    if (!selectedVibes.includes(vibe)) {
      setSelectedVibes(prev => [...prev, vibe]);
    }
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasionIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const resetAll = () => {
    setSelectedVibes([]);
    setSelectedImageIds([]);
    setSelectedScenarioId(null);
    setSelectedOccasionIds([]);
    setShowResults(false);
  };

  // Ranking logic
  const filteredDestinations = useMemo(() => {
    // Calculate effective constraints based on occasions
    let effectiveBudget = budget;
    let effectiveMaxHours = maxHours;
    
    if (selectedOccasionIds.length > 0) {
      const selectedOccasions = OCCASIONS.filter(o => selectedOccasionIds.includes(o.id));
      // Average out the multipliers for a combined vibe
      const avgMultiplier = selectedOccasions.reduce((acc, o) => acc + o.budgetMultiplier, 0) / selectedOccasions.length;
      effectiveBudget = budget * avgMultiplier;
      
      // If any occasion is long-duration, boost max hours
      const maxDays = Math.max(...selectedOccasions.map(o => o.durationDays));
      if (maxDays > 10) effectiveMaxHours = Math.max(maxHours, 18);
    }

    return DESTINATIONS.filter(dest => {
      const withinBudget = dest.priceINR <= effectiveBudget;
      const withinTime = dest.travelHours <= effectiveMaxHours;
      return withinBudget && withinTime;
    }).sort((a, b) => {
      let aScore = a.vibes.filter(v => selectedVibes.includes(v)).length;
      let bScore = b.vibes.filter(v => selectedVibes.includes(v)).length;

      // Personalized boosting based on profile
      if (profile.workType === 'desk') {
        if (a.vibes.some(v => ['rugged', 'unplugged', 'serene'].includes(v))) aScore += 0.5;
        if (b.vibes.some(v => ['rugged', 'unplugged', 'serene'].includes(v))) bScore += 0.5;
      } else if (profile.workType === 'active') {
        if (a.vibes.some(v => ['luxurious', 'serene', 'minimalist'].includes(v))) aScore += 0.5;
        if (b.vibes.some(v => ['luxurious', 'serene', 'minimalist'].includes(v))) bScore += 0.5;
      }

      // Travel Style boosting
      if (profile.travelStyle === 'solo') {
        if (a.vibes.includes('unplugged')) aScore += 0.3;
        if (b.vibes.includes('unplugged')) bScore += 0.3;
      } else if (profile.travelStyle === 'family') {
        if (a.vibes.includes('cultural')) aScore += 0.3;
        if (b.vibes.includes('cultural')) bScore += 0.3;
      }

      // Interests boosting
      profile.interests?.forEach(interest => {
        if (a.vibes.includes(interest as Vibe)) aScore += 0.2;
        if (b.vibes.includes(interest as Vibe)) bScore += 0.2;
      });

      // Transport Preference boosting
      if (selectedTransportId === 'space') {
        if (a.vibes.some(v => ['futuristic', 'ethereal', 'mysterious'].includes(v))) aScore += 1.0;
        if (b.vibes.some(v => ['futuristic', 'ethereal', 'mysterious'].includes(v))) bScore += 1.0;
      } else if (selectedTransportId === 'train') {
        if (a.vibes.some(v => ['serene', 'cultural', 'nostalgic'].includes(v))) aScore += 0.4;
        if (b.vibes.some(v => ['serene', 'cultural', 'nostalgic'].includes(v))) bScore += 0.4;
      } else if (selectedTransportId === 'road') {
        if (a.vibes.some(v => ['rugged', 'unplugged', 'bohemian'].includes(v))) aScore += 0.4;
        if (b.vibes.some(v => ['rugged', 'unplugged', 'bohemian'].includes(v))) bScore += 0.4;
      }

      // Sub-option luxury boosting
      const luxurySubOptions = ['Business', 'First Class', '1st AC', 'Luxury Rental', 'Orbital', 'Lunar'];
      if (selectedSubOption && luxurySubOptions.includes(selectedSubOption)) {
        if (a.vibes.includes('luxurious')) aScore += 0.6;
        if (b.vibes.includes('luxurious')) bScore += 0.6;
      }

      return bScore - aScore;
    });
  }, [selectedVibes, budget, maxHours, profile, selectedOccasionIds, selectedTransportId, selectedSubOption]);

  // Debounce effect for results
  useEffect(() => {
    if (selectedImageIds.length >= 1 || selectedScenarioId) {
      setIsDebouncing(true);
      const timer = setTimeout(() => setIsDebouncing(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedImageIds, selectedScenarioId]);

  const generateAiInsight = async () => {
    if (filteredDestinations.length === 0) return;
    
    setIsGeneratingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const topDestinations = filteredDestinations.slice(0, 3).map(d => d.name).join(", ");
      const occasionLabels = OCCASIONS.filter(o => selectedOccasionIds.includes(o.id)).map(o => o.label).join(", ");
      
      const transportLabel = TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label || 'General Travel';
      const transportSub = selectedSubOption ? ` (${selectedSubOption})` : '';
      
      const prompt = `You are the Pathfinder AI Travel Strategist. 
      The user is a ${profile.profession || 'traveler'} with a ${profile.workType} work nature. 
      They are traveling as a ${profile.travelStyle} and are interested in ${profile.interests?.join(", ") || 'general exploration'}.
      They selected vibes like: ${selectedVibes.join(", ")}.
      The occasion for this trip is: ${occasionLabels || 'General Leisure'}.
      They prefer traveling via: ${transportLabel}${transportSub}.
      Based on this, I've suggested: ${topDestinations}.
      
      Provide a concise (2-3 sentences), cinematic, and hyper-personalized insight into why these specific choices were made for them. 
      Focus on the psychological "why" (e.g., "Because your desk-bound routine craves the stark silence of the Himalayas").
      Keep it punchy and evocative.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiInsight(response.text || null);
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsight("Your unique pattern suggests a deep need for these specific landscapes.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  useEffect(() => {
    if (showResults && !aiInsight && !isGeneratingInsight) {
      generateAiInsight();
    }
  }, [showResults]);

  // Reset insight when selection changes
  useEffect(() => {
    setAiInsight(null);
  }, [selectedVibes, profile]);

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Dynamic Background */}
      <div className={cn(
        "fixed inset-0 transition-all duration-1000 ease-in-out bg-gradient-to-br -z-10",
        gradientClass
      )} />
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[100px] -z-10" />

      {/* Main Canvas */}
      <main className={cn(
        "flex-1 h-screen overflow-y-auto no-scrollbar p-4 md:p-12 transition-all duration-700 ease-in-out",
        showResults ? "md:mr-0" : "md:mr-[100px]"
      )}>
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Compass className="text-black w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">PATHFINDER</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 overflow-hidden"
            >
              {user ? (
                <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full border border-white/20" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="truncate max-w-[100px]">
                {user ? user.displayName : (profile.profession || "Set Profile")}
              </span>
            </button>
            {(selectedImageIds.length > 0 || selectedScenarioId) && (
              <button 
                onClick={resetAll}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto space-y-16 pb-32 px-4">
          {/* Scenarios Carousel */}
          <section>
            <h2 className="font-display text-lg text-zinc-400 mb-6 uppercase tracking-widest font-medium">Choose a vibe</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 pb-8">
              {SCENARIOS.map((scenario) => {
                const Icon = ICON_MAP[scenario.iconName] || Sparkles;
                return (
                  <motion.button
                    key={scenario.id}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectScenario(scenario.id, scenario.vibe)}
                    className={cn(
                      "flex-shrink-0 relative group px-3 py-3 md:px-4 md:py-4 rounded-2xl border transition-all duration-500 text-left min-w-[120px] md:min-w-[140px] overflow-hidden",
                      selectedScenarioId === scenario.id 
                        ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]" 
                        : "bg-white/5 text-white border-white/10 hover:border-white/30 hover:bg-white/[0.08]"
                    )}
                  >
                    {selectedScenarioId !== scenario.id && (
                      <div className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rotate-45 translate-x-[-50%] group-hover:translate-x-[50%]" />
                    )}
                    
                    <div className="relative z-10 space-y-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors duration-300",
                        selectedScenarioId === scenario.id ? "bg-black/10" : "bg-white/10 group-hover:bg-white/20"
                      )}>
                        <Icon className={cn(
                          "w-4 h-4",
                          selectedScenarioId === scenario.id ? "text-black" : "text-zinc-400 group-hover:text-white"
                        )} />
                      </div>
                      
                      <p className="text-sm font-display font-semibold leading-tight tracking-tight">
                        "{scenario.label}"
                      </p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <span className={cn(
                          "text-[8px] uppercase tracking-[0.2em] font-bold px-1.5 py-0.5 rounded-md",
                          selectedScenarioId === scenario.id ? "bg-black/5 text-black/60" : "bg-white/5 text-zinc-500"
                        )}>
                          {scenario.vibe}
                        </span>
                      </div>
                    </div>

                    {selectedScenarioId === scenario.id && (
                      <motion.div 
                        layoutId="selection-glow"
                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Occasions Selection */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-lg text-zinc-400 uppercase tracking-widest font-medium">What's the occasion?</h2>
              <p className="text-xs text-zinc-500">Select up to 3</p>
            </div>
            <div className="flex flex-wrap gap-3 pb-4">
              {OCCASIONS.map((occ) => {
                const Icon = ICON_MAP[occ.iconName] || MapIcon;
                const isSelected = selectedOccasionIds.includes(occ.id);
                return (
                  <motion.button
                    key={occ.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleOccasion(occ.id)}
                    className={cn(
                      "flex-shrink-0 px-5 py-3 rounded-xl border transition-all duration-300 flex items-center gap-3",
                      isSelected 
                        ? "bg-white text-black border-white shadow-lg" 
                        : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-black" : "text-zinc-500")} />
                    <span className="text-sm font-medium whitespace-nowrap">{occ.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Time of Year Selection */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-lg text-zinc-400 uppercase tracking-widest font-medium">Time of Year</h2>
              <p className="text-xs text-zinc-500">Seasonality & Climate</p>
            </div>
            <div className="flex flex-wrap gap-3 pb-4">
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => {
                const isSelected = selectedMonth === month;
                return (
                  <motion.button
                    key={month}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMonth(month as Month)}
                    className={cn(
                      "flex-shrink-0 px-5 py-3 rounded-xl border transition-all duration-300 flex items-center gap-3",
                      isSelected 
                        ? "bg-white text-black border-white shadow-lg" 
                        : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20"
                    )}
                  >
                    <Calendar className={cn("w-4 h-4", isSelected ? "text-black" : "text-zinc-500")} />
                    <span className="text-sm font-medium whitespace-nowrap">{month}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Transport Preference */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div className="space-y-1">
                <h2 className="font-display text-lg text-zinc-400 uppercase tracking-widest font-medium">Mode of Transport</h2>
                {selectedTransportId && (
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    Selected: {TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label} 
                    {selectedSubOption && ` • ${selectedSubOption}`}
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-500">How do you prefer to travel?</p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 pb-2">
                {TRANSPORT_OPTIONS.map((opt) => {
                  const Icon = ICON_MAP[opt.iconName] || Plane;
                  const isSelected = selectedTransportId === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedTransportId(opt.id);
                        setSelectedSubOption(null);
                      }}
                      className={cn(
                        "flex-shrink-0 px-6 py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 min-w-[100px]",
                        isSelected 
                          ? "bg-white text-black border-white shadow-lg" 
                          : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", isSelected ? "text-black" : "text-zinc-500")} />
                      <span className="text-xs font-bold uppercase tracking-tighter">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {selectedTransportId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {TRANSPORT_OPTIONS.find(o => o.id === selectedTransportId)?.subOptions?.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubOption(sub)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                        selectedSubOption === sub
                          ? "bg-white/20 text-white border-white/40"
                          : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          {/* Photo Grid */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-lg text-zinc-400 uppercase tracking-widest font-medium">Visual Anchors</h2>
              <p className={cn(
                "text-xs transition-colors duration-300",
                selectedImageIds.length === SELECTION_LIMIT ? "text-amber-400 font-bold" : "text-zinc-500"
              )}>
                {selectedImageIds.length}/{SELECTION_LIMIT} Selected
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 auto-rows-fr">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => {
                  const isLarge = img.status === 'popular' || img.status === 'trending';
                  return (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={cn(
                        "relative rounded-xl overflow-hidden cursor-pointer group shadow-lg",
                        isLarge ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                      )}
                      onClick={() => toggleImage(img.id, img.vibes)}
                    >
                      <SafeImage 
                        src={img.url} 
                        alt={`Vibe ${img.id}`} 
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                          selectedImageIds.includes(img.id) ? "brightness-50" : "brightness-90"
                        )}
                      />
                      
                      {/* Status Badge */}
                      {img.status && (
                        <div className={cn(
                          "absolute top-2 left-2 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md z-20",
                          img.status === 'popular' ? "bg-amber-500/80 text-white" :
                          img.status === 'trending' ? "bg-rose-500/80 text-white" :
                          img.status === 'niche' ? "bg-indigo-500/80 text-white" :
                          img.status === 'new' ? "bg-emerald-500/80 text-white" :
                          "bg-zinc-500/80 text-white"
                        )}>
                          {img.status === 'popular' && <Star className="w-2 h-2" />}
                          {img.status === 'trending' && <TrendingUp className="w-2 h-2" />}
                          {img.status === 'niche' && <BadgePercent className="w-2 h-2" />}
                          {img.status === 'new' && <SparklesIcon className="w-2 h-2" />}
                          {img.status}
                        </div>
                      )}

                      {/* Location Tag */}
                      {img.locationTag && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <p className="text-[10px] text-white/90 font-medium truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {img.locationTag}
                          </p>
                        </div>
                      )}
                      
                      {/* Selection Indicator */}
                      <div className={cn(
                        "absolute inset-0 border-2 transition-all duration-300 rounded-xl z-20",
                        selectedImageIds.includes(img.id) ? "border-white" : "border-transparent"
                      )} />
                      {selectedImageIds.includes(img.id) && (
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <Sparkles className="text-black w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Constraints Scaffolding */}
          <AnimatePresence>
            {(selectedImageIds.length >= 1 || selectedScenarioId || selectedVibes.length >= 1 || selectedOccasionIds.length >= 1) && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-12 pt-8 border-t border-white/10"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                  {/* Budget Slider */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-emerald-400" />
                        Budget Cap (INR)
                      </label>
                      <span className="text-white font-display font-medium">₹{budget.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5000" 
                      max="500000" 
                      step="5000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Travel Time Slider */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-4 h-4 text-rose-400" />
                          Max Travel Time
                          <Info className="w-3 h-3 text-zinc-600" />
                        </label>
                        <p className="text-[10px] text-zinc-500 font-medium leading-tight">Total one-way duration including layovers</p>
                      </div>
                      <span className="text-white font-display font-medium">{maxHours} Hours</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="48" 
                      step="1"
                      value={maxHours}
                      onChange={(e) => setMaxHours(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Trip Duration Slider */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        Trip Duration
                      </label>
                      <span className="text-white font-display font-medium">{tripDays} Days</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      step="1"
                      value={tripDays}
                      onChange={(e) => setTripDays(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowResults(true)}
                    className="bg-white text-black px-10 py-4 rounded-full font-display font-bold flex items-center gap-3 shadow-xl shadow-white/10"
                  >
                    Discover Destinations
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Results Panel */}
      <AnimatePresence>
        {showResults && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed md:relative top-0 right-0 w-full md:w-[400px] bg-black/40 backdrop-blur-3xl border-l border-white/10 h-screen flex flex-col z-50"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold">Candidates</h2>
                {profile.profession && (
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                    Personalized for {profile.profession}
                  </p>
                )}
                {selectedTransportId && (
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label} 
                    {selectedSubOption && ` • ${selectedSubOption}`}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {/* AI Insight Section */}
              <AnimatePresence mode="wait">
                {(aiInsight || isGeneratingInsight) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/10 border border-white/20 rounded-3xl p-6 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                      <BrainCircuit className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Pathfinder Insight
                    </h3>
                    {isGeneratingInsight ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-white/10 rounded-full w-full animate-pulse" />
                        <div className="h-3 bg-white/10 rounded-full w-4/5 animate-pulse" />
                        <div className="h-3 bg-white/10 rounded-full w-3/4 animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                        {aiInsight}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {isDebouncing ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                  <RefreshCcw className="w-8 h-8 animate-spin" />
                  <p className="text-sm font-medium uppercase tracking-widest">Recalculating Intent...</p>
                </div>
              ) : filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest, idx) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      {dest.images && dest.images.length > 0 ? (
                        <ImageCarousel images={dest.images} alt={dest.name} />
                      ) : (
                        <SafeImage 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{dest.name}</h3>
                        <div className="flex items-center gap-1 text-zinc-400 text-sm">
                          <MapPin className="w-3 h-3" />
                          {dest.location}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <IndianRupee className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Budget Cap</span>
                            <Info className="w-2.5 h-2.5 opacity-50" />
                          </div>
                          <p className="text-sm font-display font-medium">₹{dest.priceINR.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <Navigation className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Distance</span>
                            <Info className="w-2.5 h-2.5 opacity-50" />
                          </div>
                          <p className="text-sm font-display font-medium">
                            {profile.lat && profile.lng && dest.lat && dest.lng 
                              ? `${Math.round(calculateDistance(profile.lat, profile.lng, dest.lat, dest.lng))} km`
                              : 'Location not set'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                          <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
                          {dest.rationale}
                        </p>
                      </div>

                      <button 
                        onClick={() => handlePlanItinerary(dest)}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Plan Itinerary
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <Compass className="w-12 h-12" />
                  <p className="text-sm font-medium">No destinations match your current constraints.</p>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden",
                user ? "max-w-4xl" : "max-w-md"
              )}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl font-bold">
                    {user ? "Account Settings" : "Traveler Profile"}
                  </h3>
                  {user && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                      Cloud Sync Active
                    </span>
                  )}
                </div>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!user ? (
                <div className="space-y-6">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center space-y-6">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-white">Unlock Personalized Travel</p>
                      <p className="text-sm text-zinc-500 max-w-[280px] mx-auto">Sign in with Google to sync your profile, save itineraries, and get hyper-personalized AI insights.</p>
                    </div>
                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-white/5"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                      Continue with Google
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Account Info */}
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                      <div className="flex items-center gap-4">
                        <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-full border-2 border-white/20" />
                        <div>
                          <p className="text-lg font-bold text-white">{user.displayName}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/5">
                        <button 
                          onClick={handleLogout}
                          className="w-full py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCcw className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Profession</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder="e.g. Software Engineer"
                          value={profile.profession || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-white/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Location</label>
                        <button 
                          onClick={handleGetLocation}
                          className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1 hover:text-amber-300 transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          GPS
                        </button>
                      </div>
                      <div className="relative">
                        <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder="Where are you based?"
                          value={profile.location || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className={cn(
                            "w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all text-sm",
                            pendingDestination && !profile.location ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-white/30"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preferences */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Work Nature</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setProfile(prev => ({ ...prev, workType: 'desk' }))}
                          className={cn(
                            "py-3 rounded-xl border transition-all text-xs font-bold",
                            profile.workType === 'desk' ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                          )}
                        >
                          Desk-based
                        </button>
                        <button 
                          onClick={() => setProfile(prev => ({ ...prev, workType: 'active' }))}
                          className={cn(
                            "py-3 rounded-xl border transition-all text-xs font-bold",
                            profile.workType === 'active' ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                          )}
                        >
                          On-field
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Travel Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'solo', label: 'Solo', icon: User },
                          { id: 'couple', label: 'Couple', icon: Heart },
                          { id: 'family', label: 'Family', icon: Users }
                        ].map(style => (
                          <button 
                            key={style.id}
                            onClick={() => setProfile(prev => ({ ...prev, travelStyle: style.id as any }))}
                            className={cn(
                              "flex flex-col items-center gap-1 py-2 rounded-xl border transition-all",
                              profile.travelStyle === style.id ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                            )}
                          >
                            <style.icon className="w-3 h-3" />
                            <span className="text-[8px] font-bold uppercase">{style.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Interests</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'serene', label: 'Nature', icon: Palmtree },
                          { id: 'cultural', label: 'History', icon: Landmark },
                          { id: 'vibrant', label: 'Nightlife', icon: Moon },
                          { id: 'rugged', label: 'Adventure', icon: Mountain },
                          { id: 'minimalist', label: 'Arch', icon: Building },
                          { id: 'unplugged', label: 'Peace', icon: Wind }
                        ].map(interest => (
                          <button 
                            key={interest.id}
                            onClick={() => {
                              const current = profile.interests || [];
                              const next = current.includes(interest.id) 
                                ? current.filter(i => i !== interest.id)
                                : [...current, interest.id];
                              setProfile(prev => ({ ...prev, interests: next }));
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[9px] font-bold uppercase",
                              profile.interests?.includes(interest.id) ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                            )}
                          >
                            <interest.icon className="w-2.5 h-2.5" />
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={pendingDestination && (!profile.location || !profile.profession)}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold mt-2 transition-all shadow-lg",
                        pendingDestination && (!profile.location || !profile.profession) 
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                          : "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-white/5"
                      )}
                    >
                      {pendingDestination ? "Continue to Itinerary" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {user && savedTrips.length > 0 && (
                <div className="mt-12 pt-12 border-t border-white/10">
                  <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-indigo-400" />
                    Saved Itineraries
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedTrips.map(trip => (
                      <div 
                        key={trip.id}
                        onClick={() => {
                          setSelectedDestinationForItinerary(trip.destination);
                          setShowProfileModal(false);
                        }}
                        className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img src={trip.destination.image} alt={trip.destination.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <p className="text-sm font-bold text-white">{trip.destination.name}</p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{trip.tripDays} Days • {trip.travelMonth}</p>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {trip.members.map((member, i) => (
                              <img 
                                key={i} 
                                src={member.photoURL || `https://ui-avatars.com/api/?name=${member.displayName}`} 
                                alt={member.displayName}
                                className="w-6 h-6 rounded-full border border-zinc-900"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Results Trigger */}
      {!showResults && (selectedImageIds.length > 0 || selectedScenarioId) && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 md:hidden z-50"
        >
          <button
            onClick={() => setShowResults(true)}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2"
          >
            View {filteredDestinations.length} Matches
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Detailed Itinerary View */}
      <AnimatePresence>
        {selectedDestinationForItinerary && (
          <ItineraryPlanner 
            destination={selectedDestinationForItinerary}
            onClose={() => setSelectedDestinationForItinerary(null)}
            occasion={OCCASIONS.find(o => selectedOccasionIds.includes(o.id))}
            transportId={selectedTransportId}
            subOption={selectedSubOption}
            travelMonth={selectedMonth}
            tripDays={tripDays}
            profile={profile}
            user={user}
            onSaveTrip={handleSaveTrip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
