/**
 * Price Signals — Mock flight & hotel data per destination.
 * 
 * Prices are realistic approximations for routes from Delhi (default origin).
 * In production, these would be fetched from:
 *   - Skyscanner Flights API (partner program)
 *   - MakeMyTrip/Booking.com affiliate APIs
 * 
 * All prices in INR (₹).
 */

export interface FlightPriceSignal {
  price: number;
  airline: string;
  source: string;
  isDirect: boolean;
  stops?: number;
}

export interface HotelPriceSignal {
  pricePerNight: number;
  name: string;
  rating: number;
  source: string;
  category: 'budget' | 'mid-range' | 'luxury';
}

export interface PriceSignal {
  cheapestFlight: FlightPriceSignal;
  bestValueHotel: HotelPriceSignal;
  estimatedDailyBudget: number; // food + local transport + activities
  isLive?: boolean;
  lastUpdated?: string;
  confidence?: number; // 0 to 1
}

export const PRICE_SIGNALS: Record<string, PriceSignal> = {
  // d1 — Spiti Valley (road from Delhi, no direct flights)
  d1: {
    cheapestFlight: { price: 4500, airline: 'Volvo Bus + Local', source: 'via RedBus', isDirect: false, stops: 2 },
    bestValueHotel: { pricePerNight: 1200, name: 'The Spiti Mansion', rating: 4.2, source: 'via MakeMyTrip', category: 'budget' },
    estimatedDailyBudget: 1500,
    isLive: false,
    lastUpdated: '2026-04-20'
  },

  // d2 — Kyoto (Delhi to Osaka/Tokyo + Shinkansen)
  d2: {
    cheapestFlight: { price: 58500, airline: 'Air India / ANA', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 5500, name: 'Kyoto Granbell Hotel', rating: 4.4, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 6000,
    isLive: true,
    lastUpdated: '2026-04-27',
    confidence: 0.95
  },

  // d3 — Reykjavik (Delhi–London/Amsterdam–KEF)
  d3: {
    cheapestFlight: { price: 55274, airline: 'Air India / Icelandair', source: 'via Air India', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 9800, name: 'CenterHotel Midgardur', rating: 4.3, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 12000,
    isLive: true,
    lastUpdated: '2026-04-27',
    confidence: 0.9
  },

  // d4 — Varanasi (direct flight from Delhi)
  d4: {
    cheapestFlight: { price: 3200, airline: 'IndiGo', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 1800, name: 'BrijRama Palace', rating: 4.5, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1200,
    isLive: true,
    lastUpdated: '2026-04-27'
  },

  // d10 — Zermatt (Delhi–Zurich–Zermatt train)
  d10: {
    cheapestFlight: { price: 38000, airline: 'Swiss Air', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 18000, name: 'Hotel Schweizerhof', rating: 4.7, source: 'via Booking.com', category: 'luxury' },
    estimatedDailyBudget: 15000,
    isLive: false,
    lastUpdated: '2026-04-20'
  },

  // d15 — Udaipur (direct flight from Delhi)
  d15: {
    cheapestFlight: { price: 5026, airline: 'Air India', source: 'via Air India', isDirect: true },
    bestValueHotel: { pricePerNight: 3500, name: 'Fateh Prakash Palace', rating: 4.6, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 2000,
    isLive: true,
    lastUpdated: '2026-04-27'
  },

  // d57 — Paris (Delhi–Paris)
  d57: {
    cheapestFlight: { price: 39935, airline: 'Air India', source: 'via Air India', isDirect: true },
    bestValueHotel: { pricePerNight: 18000, name: 'Hotel Pullman Paris Tour Eiffel', rating: 4.6, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 8000,
    isLive: true,
    lastUpdated: '2026-04-27'
  },

  // d58 — London (Delhi–London)
  d58: {
    cheapestFlight: { price: 39935, airline: 'Air India', source: 'via Air India', isDirect: true },
    bestValueHotel: { pricePerNight: 18000, name: 'The Hoxton, Holborn', rating: 4.5, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 8000,
    isLive: true,
    lastUpdated: '2026-04-27'
  },
};

/**
 * Get the cheapest destination from a list of candidate IDs.
 */
export function findBestValueDestination(destIds: string[]): string | null {
  let cheapest: string | null = null;
  let lowestTotal = Infinity;

  for (const id of destIds) {
    const signal = PRICE_SIGNALS[id];
    if (!signal) continue;
    
    const total = signal.cheapestFlight.price + signal.bestValueHotel.pricePerNight * 3 + signal.estimatedDailyBudget * 3;
    if (total < lowestTotal) {
      lowestTotal = total;
      cheapest = id;
    }
  }

  return cheapest;
}
