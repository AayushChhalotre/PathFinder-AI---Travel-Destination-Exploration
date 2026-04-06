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
import { AmbientBackground, VibeGrid, ScenarioCarousel, ConstraintPanel } from './components/vibe';
import { useVibeSelection } from './hooks/useVibeSelection';
import { Destination, Vibe, UserProfile, Occasion, TransportOption, Month, ItineraryActivity, Trip, TripMember } from './types';
import { calculateDistance, estimateTravelTime, formatTravelTime } from './lib/geoUtils';
import { GoogleGenAI } from "@google/genai";
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc, getDocFromServer } from 'firebase/firestore';

import { ICON_MAP } from './lib/icons';

import { SafeImage, ImageCarousel } from './components/ui/ImageAssets';
import { WeatherDisplay } from './components/itinerary/WeatherDisplay';


const ItineraryPlanner = React.lazy(() => import('./components/itinerary/ItineraryPlanner'));
export default function App() {
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(300000);
  const [maxHours, setMaxHours] = useState<number>(24);
  const [tripDays, setTripDays] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && tripDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + tripDays - 1);
      const newEndStr = end.toISOString().split('T')[0];
      if (endDate !== newEndStr) {
        setEndDate(newEndStr);
      }
    }
  }, [startDate, tripDays]);

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(val);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTripDays(Math.max(1, diffDays));
    }
  };
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
              location: data.location || prev.location,
              lat: data.lat || prev.lat,
              lng: data.lng || prev.lng,
              travelGoal: data.travelGoal || prev.travelGoal,
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
    // Let guests proceed without interruption
    setSelectedDestinationForItinerary(dest);
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
    let currentUser = user;
    if (!currentUser) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        setUser(currentUser);
        // Check if profile exists, if not create it
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            updatedAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Login failed:", error);
        return;
      }
    }

    try {
      const newTrip = {
        ...tripData,
        ownerUid: currentUser.uid,
        createdAt: serverTimestamp(),
        members: tripData.members || [{ uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, photoURL: currentUser.photoURL }]
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
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const topDestinations = filteredDestinations.slice(0, 3).map(d => d.name).join(", ");
      const occasionLabels = OCCASIONS.filter(o => selectedOccasionIds.includes(o.id)).map(o => o.label).join(", ");
      
      const transportLabel = TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label || 'General Travel';
      const transportSub = selectedSubOption ? ` (${selectedSubOption})` : '';
      
      const prompt = `You are the Pathfinder AI Travel Strategist. 
      The user has a travel goal of: "${profile.travelGoal || 'Not specified'}". Their work nature is ${profile.workType}. 
      Their travel style is ${profile.travelStyle} and interests include ${profile.interests?.join(', ')}.
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
      {/* Dynamic Background — morphs based on active vibe */}
      <AmbientBackground activeVibe={activeVibe} />

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
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 overflow-hidden"
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
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto space-y-16 pb-32 px-4">
          {/* Scenarios Carousel */}
          <ScenarioCarousel
            selectedScenarioId={selectedScenarioId}
            onSelect={selectScenario}
          />

          {/* Occasions Selection */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-lg text-zinc-200 uppercase tracking-widest font-medium">What's the occasion?</h2>
              <p className="text-xs text-zinc-200">Select up to 3</p>
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
                        : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-black" : "text-zinc-200")} />
                    <span className="text-sm font-medium whitespace-nowrap">{occ.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Time of Year Selection */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-lg text-zinc-200 uppercase tracking-widest font-medium">Time of Year</h2>
              <p className="text-xs text-zinc-200">Seasonality & Climate</p>
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
                        : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                    )}
                  >
                    <Calendar className={cn("w-4 h-4", isSelected ? "text-black" : "text-zinc-200")} />
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
                <h2 className="font-display text-lg text-zinc-200 uppercase tracking-widest font-medium">Mode of Transport</h2>
                {selectedTransportId && (
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    Selected: {TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label} 
                    {selectedSubOption && ` • ${selectedSubOption}`}
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-200">How do you prefer to travel?</p>
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
                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", isSelected ? "text-black" : "text-zinc-200")} />
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
                          : "bg-white/5 text-zinc-200 border-white/10 hover:border-white/20"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          {/* Visual Vibe Grid — with magnetic hover & AI intent badge */}
          <VibeGrid
            selectedVibes={selectedVibes}
            selectedImageIds={selectedImageIds}
            onToggle={toggleImage}
            aiIntent={null}
            isParsingIntent={false}
          />

          {/* Constraints Scaffolding — ephemeral panel */}
          <AnimatePresence>
            {(selectedImageIds.length >= 1 || selectedScenarioId || selectedVibes.length >= 1 || selectedOccasionIds.length >= 1) && (
              <ConstraintPanel
                budget={budget}
                maxHours={maxHours}
                tripDays={tripDays}
                startDate={startDate}
                endDate={endDate}
                onBudgetChange={setBudget}
                onMaxHoursChange={setMaxHours}
                onTripDaysChange={setTripDays}
                onStartDateChange={setStartDate}
                onEndDateChange={handleEndDateChange}
                onDiscover={() => setShowResults(true)}
                profile={profile}
                onProfileChange={setProfile}
                onGetLocation={handleGetLocation}
              />
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
                        <div className="flex items-center gap-1 text-zinc-200 text-sm">
                          <MapPin className="w-3 h-3" />
                          {dest.location}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <IndianRupee className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Budget Cap</span>
                            <Info className="w-2.5 h-2.5 opacity-50" />
                          </div>
                          <p className="text-sm font-display font-medium">₹{dest.priceINR.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-300">
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
                        <p className="text-xs text-zinc-200 leading-relaxed italic">
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
                      <p className="text-sm text-zinc-300 max-w-[280px] mx-auto">Sign in with Google to sync your profile, save itineraries, and get hyper-personalized AI insights.</p>
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
                          <p className="text-xs text-zinc-300">{user.email}</p>
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
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest ml-1">Profession</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
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
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Current Location</label>
                        <button 
                          onClick={handleGetLocation}
                          className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1 hover:text-amber-300 transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          GPS
                        </button>
                      </div>
                      <div className="relative">
                        <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
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
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest ml-1">Work Nature</label>
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
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest ml-1">Travel Style</label>
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
                      <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest ml-1">Interests</label>
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
                      disabled={false}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold mt-2 transition-all shadow-lg bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-white/5"
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
                            <p className="text-[10px] text-zinc-200 uppercase tracking-widest">{trip.tripDays} Days • {trip.travelMonth}</p>
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
                              <Share2 className="w-3.5 h-3.5 text-zinc-200" />
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
          <React.Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          }>
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
          </React.Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
