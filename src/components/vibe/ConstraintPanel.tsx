import React from 'react';
import { motion } from 'motion/react';
import { IndianRupee, Clock, Calendar, ArrowRight, Info, CalendarDays, MapPin, Briefcase, Compass } from 'lucide-react';
import { EstimatedCost } from '../ui/EstimatedCost';

export interface UserProfile {
  location: string;
  lat?: number;
  lng?: number;
}

interface ConstraintPanelProps {
  budget: number;
  maxHours: number;
  tripDays: number;
  startDate: string;
  endDate: string;
  numTravellers: number;
  budgetBasis: 'per_person' | 'total';
  profile: UserProfile;
  onBudgetChange: (val: number) => void;
  onMaxHoursChange: (val: number) => void;
  onTripDaysChange: (val: number) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onProfileChange: (profile: UserProfile) => void;
  onGetLocation: () => void;
  onDiscover: () => void;
}

/**
 * Ephemeral constraint panel — materializes when user has started expressing intent.
 * Now includes travel date range picker alongside sliders.
 */
export function ConstraintPanel({
  budget,
  maxHours,
  tripDays,
  startDate,
  endDate,
  numTravellers,
  budgetBasis,
  onBudgetChange,
  onMaxHoursChange,
  onTripDaysChange,
  onStartDateChange,
  onEndDateChange,
  profile,
  onProfileChange,
  onGetLocation,
  onDiscover,
}: ConstraintPanelProps) {
  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-10 pt-8 border-t border-white/10"
    >
      {/* Guest Details (Start Point) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            Start Point (Location)
          </label>
          <div className="relative">
            <input
              type="text"
              value={profile.location}
              onChange={(e) => onProfileChange({ ...profile, location: e.target.value })}
              placeholder="e.g. Mumbai, India"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-24 py-3 text-white text-sm font-medium focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all placeholder:text-white/20"
            />
            <button
              onClick={onGetLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center min-w-[80px]"
            >
              Locate Me
            </button>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-violet-400" />
          Travel Dates
        </label>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Departure</span>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={e => onStartDateChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Return</span>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={e => onEndDateChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        {/* Budget Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              Voyage Rhythm
            </label>
            <span className="text-white font-display font-medium tabular-nums">
              <EstimatedCost amountINR={budget} costBasis={budgetBasis} numTravellers={numTravellers} textClassName="text-white" />
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={budget}
            onChange={e => onBudgetChange(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
            <span>₹5K</span>
            <span>₹5L</span>
          </div>
        </div>

        {/* Travel Time Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                Max Travel Time
                <Info className="w-3 h-3 text-zinc-300" />
              </label>
              <p className="text-[10px] text-zinc-200 font-medium leading-tight">
                One-way duration including layovers
              </p>
            </div>
            <span className="text-white font-display font-medium tabular-nums">
              {maxHours} hrs
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="48"
            step="1"
            value={maxHours}
            onChange={e => onMaxHoursChange(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
            <span>2h</span>
            <span>48h</span>
          </div>
        </div>

        {/* Trip Duration Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Trip Duration
            </label>
            <span className="text-white font-display font-medium tabular-nums">
              {tripDays} days
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={tripDays}
            onChange={e => onTripDaysChange(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
            <span>1 day</span>
            <span>30 days</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDiscover}
          className="bg-white text-black px-10 py-4 rounded-full font-display font-bold flex items-center gap-3 shadow-xl shadow-white/10 hover:shadow-white/20 transition-shadow"
        >
          Discover Destinations
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.section>
  );
}
