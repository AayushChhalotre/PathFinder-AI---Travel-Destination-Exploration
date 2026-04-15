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
}

export const PRICE_SIGNALS: Record<string, PriceSignal> = {
  // d1 — Spiti Valley (road from Delhi, no direct flights)
  d1: {
    cheapestFlight: { price: 4500, airline: 'Volvo Bus + Local', source: 'via RedBus', isDirect: false, stops: 2 },
    bestValueHotel: { pricePerNight: 1200, name: 'The Spiti Mansion', rating: 4.2, source: 'via MakeMyTrip', category: 'budget' },
    estimatedDailyBudget: 1500
  },

  // d2 — Kyoto (flights via Delhi–Tokyo–Kyoto)
  d2: {
    cheapestFlight: { price: 32500, airline: 'ANA / Air India', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 5500, name: 'Kyoto Granbell Hotel', rating: 4.4, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 6000
  },

  // d3 — Reykjavik (Delhi–London/Amsterdam–KEF)
  d3: {
    cheapestFlight: { price: 48000, airline: 'Icelandair via London', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 9800, name: 'CenterHotel Midgardur', rating: 4.3, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 12000
  },

  // d4 — Varanasi (direct flight from Delhi)
  d4: {
    cheapestFlight: { price: 3200, airline: 'IndiGo', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 1800, name: 'BrijRama Palace', rating: 4.5, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1200
  },

  // d5 — Ranthambore (train/drive from Delhi)
  d5: {
    cheapestFlight: { price: 4200, airline: 'Shatabdi Express', source: 'via IRCTC', isDirect: true },
    bestValueHotel: { pricePerNight: 18000, name: 'Aman-i-Khas', rating: 4.9, source: 'via Direct', category: 'luxury' },
    estimatedDailyBudget: 3500
  },

  // d6 — Berlin (Delhi–Berlin direct)
  d6: {
    cheapestFlight: { price: 28500, airline: 'Air India', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 5200, name: 'Moxy Berlin Ostbahnhof', rating: 4.2, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 5000
  },

  // d7 — Hampi (flight to Hubli + drive)
  d7: {
    cheapestFlight: { price: 5800, airline: 'IndiGo via Bangalore', source: 'via MakeMyTrip', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 1500, name: 'Heritage Resort Hampi', rating: 4.1, source: 'via MakeMyTrip', category: 'budget' },
    estimatedDailyBudget: 1000
  },

  // d8 — Naoshima (Delhi–Tokyo–Naoshima ferry)
  d8: {
    cheapestFlight: { price: 35000, airline: 'ANA / JAL', source: 'via Skyscanner', isDirect: false, stops: 2 },
    bestValueHotel: { pricePerNight: 7500, name: 'Benesse House Park', rating: 4.6, source: 'via Booking.com', category: 'luxury' },
    estimatedDailyBudget: 5500
  },

  // d9 — Chefchaouen (Delhi–Casablanca–Chefchaouen)
  d9: {
    cheapestFlight: { price: 29000, airline: 'Royal Air Maroc', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 2800, name: 'Lina Ryad & Spa', rating: 4.5, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 2500
  },

  // d10 — Zermatt (Delhi–Zurich–Zermatt train)
  d10: {
    cheapestFlight: { price: 38000, airline: 'Swiss Air', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 18000, name: 'Hotel Schweizerhof', rating: 4.7, source: 'via Booking.com', category: 'luxury' },
    estimatedDailyBudget: 15000
  },

  // d11 — Santorini (Delhi–Athens–Santorini)
  d11: {
    cheapestFlight: { price: 32000, airline: 'Aegean via Athens', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 8500, name: 'Aroma Suites Fira', rating: 4.6, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 6500
  },

  // d12 — Petra (Delhi–Amman–Petra)
  d12: {
    cheapestFlight: { price: 22000, airline: 'Royal Jordanian', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 4200, name: 'Mövenpick Resort Petra', rating: 4.4, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 4000
  },

  // d13 — Tulum (Delhi–Mexico City–Cancun)
  d13: {
    cheapestFlight: { price: 52000, airline: 'Aeromexico', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 6500, name: 'Aldea Zama Apartments', rating: 4.3, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 4500
  },

  // d14 — Lofoten (Delhi–Oslo–Lofoten)
  d14: {
    cheapestFlight: { price: 42000, airline: 'Norwegian via Oslo', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 12000, name: 'Eliassen Rorbuer', rating: 4.5, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 10000
  },

  // d15 — Udaipur (direct flight from Delhi)
  d15: {
    cheapestFlight: { price: 3800, airline: 'IndiGo', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 3500, name: 'Fateh Prakash Palace', rating: 4.6, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 2000
  },

  // d16 — Sapa (Delhi–Hanoi–Sapa)
  d16: {
    cheapestFlight: { price: 18500, airline: 'VietJet Air', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 2200, name: 'Sapa Panorama Hotel', rating: 4.3, source: 'via Booking.com', category: 'budget' },
    estimatedDailyBudget: 1800
  },

  // d17 — Meteora (Delhi–Athens–Kalambaka)
  d17: {
    cheapestFlight: { price: 30000, airline: 'Air India via Athens', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 4500, name: 'Hotel Meteora', rating: 4.4, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 4000
  },

  // d18 — Gokarna (flight to Goa + drive)
  d18: {
    cheapestFlight: { price: 4800, airline: 'IndiGo via Goa', source: 'via MakeMyTrip', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 1200, name: 'SwaSwara Resort', rating: 4.3, source: 'via MakeMyTrip', category: 'budget' },
    estimatedDailyBudget: 800
  },

  // d19 — Seoul (Delhi–Seoul direct)
  d19: {
    cheapestFlight: { price: 24000, airline: 'Air India', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 4800, name: 'Lotte City Hotel Myeongdong', rating: 4.4, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 4000
  },

  // d20 — Atacama (Delhi–Santiago–Calama)
  d20: {
    cheapestFlight: { price: 65000, airline: 'LATAM via São Paulo', source: 'via Skyscanner', isDirect: false, stops: 2 },
    bestValueHotel: { pricePerNight: 8500, name: 'Hotel Altiplanico Atacama', rating: 4.5, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 8000
  },

  // d21 — Munnar (flight to Kochi + drive)
  d21: {
    cheapestFlight: { price: 5200, airline: 'IndiGo', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 2800, name: 'Windermere Estate', rating: 4.5, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1200
  },

  // d22 — Tbilisi (Delhi–Tbilisi via Dubai)
  d22: {
    cheapestFlight: { price: 18000, airline: 'FlyDubai via Dubai', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 2500, name: 'Rooms Hotel Tbilisi', rating: 4.6, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 2500
  },

  // d23 — Ladakh (Delhi–Leh direct)
  d23: {
    cheapestFlight: { price: 5500, airline: 'IndiGo / GoFirst', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 2500, name: 'The Grand Dragon', rating: 4.4, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 2000
  },

  // d24 — Singapore (Delhi–Singapore direct)
  d24: {
    cheapestFlight: { price: 14500, airline: 'IndiGo / Scoot', source: 'via Skyscanner', isDirect: true },
    bestValueHotel: { pricePerNight: 5500, name: 'YOTEL Singapore', rating: 4.3, source: 'via Booking.com', category: 'mid-range' },
    estimatedDailyBudget: 5000
  },

  // d25 — Siwa Oasis (Delhi–Cairo–Siwa bus)
  d25: {
    cheapestFlight: { price: 22000, airline: 'EgyptAir', source: 'via Skyscanner', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 2000, name: 'Siwa Shali Resort', rating: 4.2, source: 'via Booking.com', category: 'budget' },
    estimatedDailyBudget: 2000
  },

  // d26 — Alleppey (flight to Kochi + drive)
  d26: {
    cheapestFlight: { price: 5200, airline: 'IndiGo', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 6000, name: 'Premium Houseboat', rating: 4.5, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1500
  },

  // d27 — Jaisalmer (Delhi–Jaisalmer train/flight)
  d27: {
    cheapestFlight: { price: 5500, airline: 'IndiGo via Jodhpur', source: 'via MakeMyTrip', isDirect: false, stops: 1 },
    bestValueHotel: { pricePerNight: 3200, name: 'Suryagarh Jaisalmer', rating: 4.7, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1500
  },

  // d28 — Rishikesh (Delhi–Dehradun + drive)
  d28: {
    cheapestFlight: { price: 3500, airline: 'IndiGo / SpiceJet', source: 'via MakeMyTrip', isDirect: true },
    bestValueHotel: { pricePerNight: 2200, name: 'Atali Ganga Retreat', rating: 4.4, source: 'via MakeMyTrip', category: 'mid-range' },
    estimatedDailyBudget: 1200
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
