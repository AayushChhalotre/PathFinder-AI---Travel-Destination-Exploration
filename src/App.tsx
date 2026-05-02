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
import { Destination, Vibe, UserProfile, Occasion, TransportOption, Month, ItineraryActivity, Trip, TripMember, HardConstraints } from './types';
import { calculateDistance, estimateTravelTime, formatTravelTime } from './lib/geoUtils';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc, getDocFromServer } from 'firebase/firestore';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SplitEntryScreen } from './pages/SplitEntryScreen';
import { VibeDiscovery } from './pages/VibeDiscovery';
import { ConstraintDiscovery } from './pages/ConstraintDiscovery';
import { CandidateResults } from './pages/CandidateResults.tsx';
import { VibeCandidates } from './pages/VibeCandidates';

import { ICON_MAP } from './lib/icons';
import { generateDestinationRationaleSentence } from './lib/gemini';

import { intentGraph } from './lib/intentGraph';

import { SafeImage, ImageCarousel } from './components/ui/ImageAssets';

import { WeatherDisplay } from './components/itinerary/WeatherDisplay';


const ItineraryPlanner = React.lazy(() => import('./components/itinerary/ItineraryPlanner'));
export default function App() {
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(300000);
  const [tripDays, setTripDays] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);
  const [numTravellers, setNumTravellers] = useState<number>(2);
  const [hardConstraints, setHardConstraints] = useState<HardConstraints | null>(null);
  const [significantInteractions, setSignificantInteractions] = useState<number>(0);
  const [origin, setOrigin] = useState<string | null>(null);
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [originPromptDismissed, setOriginPromptDismissed] = useState<boolean>(false);
  const [showOriginPanel, setShowOriginPanel] = useState<boolean>(false);
  const [rationaleCache, setRationaleCache] = useState<Record<string, string>>({});

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
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);

  // 1. Sync App -> Intent Graph (Outgoing)
  useEffect(() => {
    intentGraph.setHardConstraints({
      budget_ceiling: budget,
      num_travellers: numTravellers,
      origin: origin,
      date_start: startDate || null,
      date_end: endDate || null
    });
  }, [budget, numTravellers, origin, startDate, endDate]);

  useEffect(() => {
    if (selectedMonth) {
      intentGraph.updateSoftPreference('travel_month', selectedMonth);
    }
  }, [selectedMonth]);

  // 2. Sync Intent Graph -> App (Incoming)
  useEffect(() => {
    // Single subscription for all intent changes
    return intentGraph.subscribe((state) => {
      // Use functional updates to ensure we always have latest state
      // and only set state if values actually differ to avoid loops

      if (state.hard.budget_ceiling !== null) {
        setBudget(prev => state.hard.budget_ceiling !== prev ? state.hard.budget_ceiling! : prev);
      }
      if (state.hard.num_travellers !== null) {
        setNumTravellers(prev => state.hard.num_travellers !== prev ? state.hard.num_travellers! : prev);
      }
      if (state.hard.origin !== null) {
        setOrigin(prev => state.hard.origin !== prev ? state.hard.origin : prev);
      }
      if (state.soft.travel_month !== null) {
        setSelectedMonth(prev => state.soft.travel_month !== prev ? state.soft.travel_month as Month : prev);
      }

      if (state.hard.date_start !== null) {
        setStartDate(prev => {
          if (state.hard.date_start === prev) return prev;

          // Recalculate tripDays if date_end also exists
          if (state.hard.date_end) {
            const start = new Date(state.hard.date_start!);
            const end = new Date(state.hard.date_end);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTripDays(Math.max(1, diffDays));
          }
          return state.hard.date_start!;
        });
      }

      if (state.hard.date_end !== null) {
        setEndDate(prev => {
          if (state.hard.date_end === prev) return prev;

          // Recalculate tripDays if date_start also exists
          if (state.hard.date_start) {
            const start = new Date(state.hard.date_start);
            const end = new Date(state.hard.date_end!);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTripDays(Math.max(1, diffDays));
          }
          return state.hard.date_end!;
        });
      }
    });
  }, []); // Run once on mount

  // Derived Hard Constraints for components
  const activeHardConstraints = useMemo(() => ({
    budget_ceiling: budget,
    date_start: startDate,
    date_end: endDate,
    origin: origin,
    num_travellers: numTravellers
  }), [budget, startDate, endDate, origin, numTravellers]);

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


  const bumpSignificantInteractions = () => {
    setSignificantInteractions((prev) => Math.min(3, prev + 1));
  };

  const moodTagsSorted = useMemo(() => [...selectedVibes].sort(), [selectedVibes]);
  const moodTagsKey = useMemo(() => moodTagsSorted.join('_'), [moodTagsSorted]);
  const occasionTags = useMemo(
    () => OCCASIONS.filter(o => selectedOccasionIds.includes(o.id)).map(o => o.label),
    [selectedOccasionIds]
  );

  useEffect(() => {
    if (significantInteractions >= 3 && !originPromptDismissed && origin === null) {
      setShowOriginPanel(true);
    }
  }, [significantInteractions, originPromptDismissed, origin]);

  useEffect(() => {
    if (location.pathname === '/discover/vibe/candidates') {
      setShowResults(true);
    }
  }, [location.pathname]);

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

  const handleOriginDismiss = () => {
    setOrigin(null);
    setOriginCoords(null);
    setOriginPromptDismissed(true);
    setShowOriginPanel(false);
    setShowResults(true);
    navigate('/discover/vibe/candidates');
  };

  const handleOriginSubmit = (nextOrigin: string, coords?: { lat: number; lng: number } | null) => {
    setOrigin(nextOrigin);
    setOriginCoords(coords ?? null);
    setOriginPromptDismissed(true);
    setShowOriginPanel(false);
    setShowResults(true);
    navigate('/discover/vibe/candidates');
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
        bumpSignificantInteractions();
        setSelectedImageIds(prev => [...prev, id]);
        // Add unique vibes from this image
        setSelectedVibes(prev => {
          const newVibes = vibes.filter(v => !prev.includes(v));
          return [...prev, ...newVibes];
        });
      }
    }
  };

  const selectScenario = (id: string | null) => {
    if (id && id !== selectedScenarioId) {
      bumpSignificantInteractions();
      const scenario = SCENARIOS.find(s => s.id === id);
      if (scenario && !selectedVibes.includes(scenario.vibe)) {
        setSelectedVibes(prev => [...prev, scenario.vibe]);
      }
    }
    setSelectedScenarioId(id);
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasionIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      bumpSignificantInteractions();
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
    let effectiveBudget = hardConstraints?.budget_ceiling ?? budget;
    let effectiveMaxHours = 24; // Default to 24 since input was removed by Instruction 5

    if (selectedOccasionIds.length > 0) {
      const selectedOccasions = OCCASIONS.filter(o => selectedOccasionIds.includes(o.id));
      // Average out the multipliers for a combined vibe
      const avgMultiplier = selectedOccasions.reduce((acc, o) => acc + o.budgetMultiplier, 0) / selectedOccasions.length;
      effectiveBudget = budget * avgMultiplier;

      // If any occasion is long-duration, boost max hours
      const maxDays = Math.max(...selectedOccasions.map(o => o.durationDays));
      if (maxDays > 10) effectiveMaxHours = 24; // Set a high but fixed ceiling
    }

    const NICHE_OCCASION_LABELS = new Set([
      'Architecture & Design',
      'Historical Routes',
      'Cultural Immersion',
      'Literary Journey',
      'Wildlife & Ecology',
    ]);

    const nicheIntentDetected = OCCASIONS
      .filter(o => selectedOccasionIds.includes(o.id))
      .some(o => NICHE_OCCASION_LABELS.has(o.label));

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

      const aPopularity = a.popularity_index ?? 0.5;
      const bPopularity = b.popularity_index ?? 0.5;

      const aAdjusted =
        nicheIntentDetected && aPopularity > 0.6
          ? aScore * (1 - (0.4 * aPopularity))
          : aScore;
      const bAdjusted =
        nicheIntentDetected && bPopularity > 0.6
          ? bScore * (1 - (0.4 * bPopularity))
          : bScore;

      return bAdjusted - aAdjusted;
    });
  }, [selectedVibes, budget, profile, selectedOccasionIds, selectedTransportId, selectedSubOption, hardConstraints]);

  // For the rationale effect, we need the ranked list
  const filteredDestinationsByRanking = filteredDestinations;

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
      const topDestinations = filteredDestinations.slice(0, 3).map(d => d.name).join(", ");
      const occasionLabels = OCCASIONS.filter(o => selectedOccasionIds.includes(o.id)).map(o => o.label).join(", ");

      const transportLabel = TRANSPORT_OPTIONS.find(t => t.id === selectedTransportId)?.label || 'General Travel';
      const transportSub = selectedSubOption ? ` (${selectedSubOption})` : '';

      const prompt = `You are the Pathfinder AI Travel Strategist. 
      Their work nature is ${profile.workType}. 
      Their travel style is ${profile.travelStyle} and interests include ${profile.interests?.join(', ')}.
      They selected vibes like: ${selectedVibes.join(", ")}.
      The occasion for this trip is: ${occasionLabels || 'General Leisure'}.
      They prefer traveling via: ${transportLabel}${transportSub}.
      Based on this, I've suggested: ${topDestinations}.
      
      Provide a concise (2-3 sentences), cinematic, and hyper-personalized insight into why these specific choices were made for them. 
      Focus on the psychological "why" (e.g., "Because your desk-bound routine craves the stark silence of the Himalayas").
      Keep it punchy and evocative.`;

      const insight = await generateDestinationRationaleSentence(prompt);
      setAiInsight(insight);
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

  // --- INTENT GRAPH & RATIONALE SYNC ---

  useEffect(() => {
    intentGraph.updateSoftPreference('mood_tags', selectedVibes.map(v => v));
  }, [selectedVibes]);

  useEffect(() => {
    const labels = OCCASIONS
      .filter(o => selectedOccasionIds.includes(o.id))
      .map(o => o.label);
    intentGraph.updateSoftPreference('occasion_tags', labels);
  }, [selectedOccasionIds]);

  const buildRationalePrompt = (destinationName: string) => {
    const mood = moodTagsSorted;
    const occ = occasionTags;
    const travelMonth = selectedMonth || 'any month';
    return `Generate a single sentence explaining why ${destinationName} matches a traveler who selected these vibes: ${mood.join(', ')} and these occasions: ${occ.join(', ')} in ${travelMonth || 'any month'}.
   
   The sentence must:
   - Start with 'Because you'
   - Reference at least one specific tag by name
   - Be under 20 words
   - Return only the sentence. No preamble.`;
  };

  const getRationaleCacheKey = (destinationId: string) =>
    `${destinationId}_${moodTagsKey}`;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!showResults || moodTagsSorted.length === 0) return;

      const toGenerate = filteredDestinations.slice(0, 12);

      for (const dest of toGenerate) {
        const key = getRationaleCacheKey(dest.id);
        if (rationaleCache[key]) continue;

        try {
          const prompt = buildRationalePrompt(dest.name);
          const sentence = await generateDestinationRationaleSentence(prompt);
          if (cancelled) return;
          setRationaleCache(prev => ({ ...prev, [key]: sentence.trim() }));
        } catch (e) {
          // Fallback handled in component
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [showResults, filteredDestinationsByRanking, moodTagsKey, selectedMonth, occasionTags]);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Dynamic Background — morphs based on active vibe */}
      <AmbientBackground activeVibe={activeVibe} />

      {/* Persistent Session State Bar */}
      {location.pathname !== '/' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-3xl px-6">

        </div>
      )}

      <Routes>
        <Route path="/" element={<SplitEntryScreen />} />

        <Route path="/discover/vibe" element={
          <VibeDiscovery
            user={user}
            profile={profile}
            onShowProfile={() => setShowProfileModal(true)}
            onOriginSubmit={handleOriginSubmit}
            onNavigateToCandidates={() => navigate('/discover/vibe/candidates')}
          />
        } />

        <Route path="/discover/vibe/candidates" element={
          <VibeCandidates
            user={user}
            profile={profile}
            onShowProfile={() => setShowProfileModal(true)}
            onExplore={handlePlanItinerary}
          />
        } />

        <Route path="/discover/constraints" element={
          <ConstraintDiscovery
            user={user}
            profile={profile}
            onShowProfile={() => setShowProfileModal(true)}
            onSaveConstraints={(constraints) => {
              setHardConstraints(constraints);
              navigate('/discover/constraints/candidates');
            }}
          />
        } />
        <Route path="/discover/constraints/candidates" element={
          <CandidateResults
            user={user}
            profile={profile}
            onShowProfile={() => setShowProfileModal(true)}
            destinations={DESTINATIONS}
            hardConstraints={activeHardConstraints}
            numTravellers={numTravellers}
            origin={origin}
            onPlanItinerary={handlePlanItinerary}
          />
        } />
      </Routes>

      {/* Global Overlays (Profile & Itinerary) */}
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
                      <SparklesIcon className="w-8 h-8 text-amber-400" />
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
                    <MapPin className="w-5 h-5 text-indigo-400" />
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
              startDate={startDate}
              endDate={endDate}
              profile={profile}
              selectedVibes={selectedVibes}
              numTravellers={numTravellers}
              user={user}
              onSaveTrip={handleSaveTrip}
            />
          </React.Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
