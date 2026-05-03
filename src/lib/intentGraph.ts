import { HardConstraints } from '../types';

export interface Interaction {
  type: string;
  value: string;
  timestamp: number;
}

export interface SoftPreferences {
  mood_tags: string[];
  occasion_tags: string[];
  travel_month: string | null;
  interaction_history: Interaction[];
  consecutive_direction_count: number;
  last_direction_signal: string | null;
  rejectedIds: string[];
}

export interface IntentState {
  hard: HardConstraints;
  soft: SoftPreferences;
}

type Listener = (state: IntentState) => void;

class IntentGraph {
  private state: IntentState = {
    hard: {
      budget_ceiling: null,
      estimate_cost: null,
      date_start: null,
      date_end: null,
      origin: null,
      num_travellers: null,
      trip_duration: null
    },
    soft: {
      mood_tags: [],
      occasion_tags: [],
      travel_month: null,
      interaction_history: [],
      consecutive_direction_count: 0,
      last_direction_signal: null,
      rejectedIds: []
    }
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    // Initialize from session storage if available
    const saved = sessionStorage.getItem('pathfinder_intent_graph');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = this.sanitizeState(parsed);
      } catch (e) {
        console.error('Failed to parse saved intent graph', e);
        // Reset to defaults on corrupt data
        sessionStorage.removeItem('pathfinder_intent_graph');
      }
    }
  }

  /**
   * Strips any legacy or unrecognized fields from a loaded state object
   * to prevent crashes from stale sessionStorage data (e.g., old intent_vector).
   */
  private sanitizeState(raw: any): IntentState {
    const defaults = this.state;
    return {
      hard: {
        budget_ceiling: raw?.hard?.budget_ceiling ?? defaults.hard.budget_ceiling,
        estimate_cost: raw?.hard?.estimate_cost ?? defaults.hard.estimate_cost,
        date_start: raw?.hard?.date_start ?? defaults.hard.date_start,
        date_end: raw?.hard?.date_end ?? defaults.hard.date_end,
        origin: raw?.hard?.origin ?? defaults.hard.origin,
        num_travellers: raw?.hard?.num_travellers ?? defaults.hard.num_travellers,
        trip_duration: raw?.hard?.trip_duration ?? defaults.hard.trip_duration,
      },
      soft: {
        mood_tags: Array.isArray(raw?.soft?.mood_tags) ? raw.soft.mood_tags : [],
        occasion_tags: Array.isArray(raw?.soft?.occasion_tags) ? raw.soft.occasion_tags : [],
        travel_month: raw?.soft?.travel_month ?? null,
        interaction_history: Array.isArray(raw?.soft?.interaction_history) ? raw.soft.interaction_history : [],
        consecutive_direction_count: raw?.soft?.consecutive_direction_count ?? 0,
        last_direction_signal: raw?.soft?.last_direction_signal ?? null,
        rejectedIds: Array.isArray(raw?.soft?.rejectedIds) ? raw.soft.rejectedIds : [],
      },
    };
  }

  private notify() {
    sessionStorage.setItem('pathfinder_intent_graph', JSON.stringify(this.state));
    const stateCopy = JSON.parse(JSON.stringify(this.state));
    this.listeners.forEach(l => l(stateCopy));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.state;
  }

  setHardConstraint<K extends keyof HardConstraints>(key: K, value: HardConstraints[K]) {
    this.state.hard[key] = value;
    
    // Auto-derive travel_month if date_start is set
    if (key === 'date_start' && value) {
      const date = new Date(value as string);
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      this.state.soft.travel_month = monthName;
    }

    this.notify();
  }

  setHardConstraints(updates: Partial<HardConstraints>) {
    this.state.hard = {
      ...this.state.hard,
      ...updates
    };

    // Auto-derive travel_month if date_start is among updates
    if (updates.date_start) {
      const date = new Date(updates.date_start);
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      this.state.soft.travel_month = monthName;
    }

    this.notify();
  }

  clearHardConstraints() {
    this.state.hard = {
      budget_ceiling: null,
      estimate_cost: null,
      date_start: null,
      date_end: null,
      origin: null,
      num_travellers: null,
      trip_duration: null
    };
    this.notify();
  }

  reset() {
    this.state = {
      hard: {
        budget_ceiling: null,
        estimate_cost: null,
        date_start: null,
        date_end: null,
        origin: null,
        num_travellers: null,
        trip_duration: null
      },
      soft: {
        mood_tags: [],
        occasion_tags: [],
        travel_month: null,
        interaction_history: [],
        consecutive_direction_count: 0,
        last_direction_signal: null,
        rejectedIds: []
      }
    };
    this.notify();
  }

  updateSoftPreference<K extends keyof SoftPreferences>(key: K, value: SoftPreferences[K]) {
    // 1. Validation Gate: If we had destination-level cost profiles here, 
    // we would check if this soft preference violates the budget_ceiling.
    // For now, we perform the structural update and check for hard constraint existence.
    
    const prevValue = this.state.soft[key];
    this.state.soft[key] = value;

    // Direction Tracking for Rerank Trigger
    if (key === 'mood_tags' || key === 'occasion_tags') {
      const currentSignal = JSON.stringify(value);
      if (this.state.soft.last_direction_signal === currentSignal) {
        // No change in direction
      } else {
        this.state.soft.consecutive_direction_count += 1;
        this.state.soft.last_direction_signal = currentSignal;
      }
    }

    // Add to history
    this.state.soft.interaction_history.push({
      type: key,
      value: JSON.stringify(value),
      timestamp: Date.now()
    });

    this.notify();
    return true; // Success
  }

  getSignificantInteractionCount() {
    return this.state.soft.consecutive_direction_count;
  }

  shouldTriggerRerank() {
    return this.state.soft.consecutive_direction_count >= 3;
  }

  resetDirectionCount() {
    this.state.soft.consecutive_direction_count = 0;
    this.notify();
  }

  rejectDestination(id: string) {
    if (!this.state.soft.rejectedIds.includes(id)) {
      this.state.soft.rejectedIds.push(id);
      this.notify();
    }
  }

  undoRejection(id: string) {
    this.state.soft.rejectedIds = this.state.soft.rejectedIds.filter(rid => rid !== id);
    this.notify();
  }

  serializeForAPI() {
    const { mood_tags, occasion_tags, travel_month } = this.state.soft;
    const { origin } = this.state.hard;
    return {
      mood_tags,
      occasion_tags,
      travel_month,
      origin
    };
  }
}

export const intentGraph = new IntentGraph();
