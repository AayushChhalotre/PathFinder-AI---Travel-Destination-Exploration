export type Vibe = 'serene' | 'vibrant' | 'mysterious' | 'rugged' | 'minimalist' | 'luxurious' | 'unplugged' | 'cultural' | 'nocturnal' | 'nostalgic' | 'futuristic' | 'bohemian' | 'cinematic' | 'ethereal';

export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'pinterest' | 'youtube' | 'tiktok';
  url: string;
  thumbnail: string;
  author: string;
  caption: string;
}

export interface TravelerInsight {
  type: 'do' | 'dont' | 'tip';
  content: string;
  tipType?: 'tip' | 'avoid' | 'alert';
}

export interface PopularActivity {
  title: string;
  description: string;
  time: string;
  iconName: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  images: string[];
  vibes: Vibe[];
  priceBand: 'budget' | 'moderate' | 'luxury';
  priceINR: number;
  costBasis?: 'per_person' | 'total';
  niche_occasions?: string[];
  popularity_index?: number;
  travelHours: number;
  description: string;
  rationale: string;
  socialMediaPosts?: SocialMediaPost[];
  travelerInsights?: TravelerInsight[];
  popularActivities?: PopularActivity[];
  bestDuration?: string;
  lat?: number;
  lng?: number;
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
  images?: string[];
  notes?: string;
  costINR?: number;
}

export interface ItineraryDay {
  day: number;
  travelTimeLockedHours: number;
  activities: ItineraryActivity[];
}

export interface TransportOption {
  id: string;
  label: string;
  iconName: string;
  subOptions?: string[];
}

export interface Scenario {
  id: string;
  label: string;
  vibe: Vibe;
  iconName: string;
}

export interface Occasion {
  id: string;
  label: string;
  durationDays: number;
  groupSize: number;
  budgetMultiplier: number;
  iconName: string;
}

export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export interface TripMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Trip {
  id: string;
  destination: Destination;
  occasion?: Occasion;
  transportId?: string | null;
  subOption?: string | null;
  travelMonth: Month;
  tripDays: number;
  itinerary: Record<number, ItineraryActivity[]>;
  members: TripMember[];
  ownerUid: string;
  createdAt: any;
}

export interface UserProfile {
  age?: number;
  location?: string;
  lat?: number;
  lng?: number;
  workType?: 'desk' | 'active' | 'hybrid';
  travelStyle?: 'solo' | 'couple' | 'family';
  interests?: string[];
  travelMonth?: Month;
  savedTrips?: string[]; // IDs of trips
}

export interface VibeImage {
  id: string;
  url: string;
  vibes: Vibe[];
  locationTag?: string;
  status?: 'popular' | 'trending' | 'niche' | 'new' | 'budget';
}
export interface HardConstraints {
  budget_ceiling: number | null;
  estimate_cost: number | null;
  date_start: string | null;
  date_end: string | null;
  origin: string | null;
  num_travellers: number | null;
  trip_duration: number | null;
}
