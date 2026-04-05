const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');
const plannerCode = lines.slice(148, 1018).join('\n');
const imports = `import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Calendar, Save, Share2, MapPin, Plane, Clock, Sparkles, Building, Moon, Send, Crown, Camera, Palmtree, Waves, Mountain, Tent, Zap, BrainCircuit, History, Cpu, Palette, Film, Landmark, Coffee, User, Users, Heart, Briefcase, IndianRupee, RefreshCcw, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Destination, ItineraryActivity, UserProfile, Trip, TripMember } from '../../types';
import { OCCASIONS, TRANSPORT_OPTIONS } from '../../constants';
import { WeatherDisplay } from './WeatherDisplay';
import { ICON_MAP } from '../../constants';

// Make sure to add export to function
export ${plannerCode}
`;
fs.writeFileSync('src/components/itinerary/ItineraryPlanner.tsx', imports);
