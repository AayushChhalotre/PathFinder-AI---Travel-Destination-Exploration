/**
 * Travel Advisory & Safety Intelligence
 * 
 * Levels:
 *   - 'safe'    → No significant advisories
 *   - 'caution' → Some risks; travellers should exercise caution
 *   - 'avoid'   → Active danger; not recommended
 * 
 * In production, this would be fed by:
 *   - MEA (India) Travel Advisories
 *   - FCDO (UK) / State Dept (US) feeds
 *   - Real-time news aggregation
 */

export interface TravelAdvisory {
  level: 'safe' | 'caution' | 'avoid';
  summary: string;
  details?: string;
  lastUpdated: string;
  source: string;
}

export const TRAVEL_ADVISORIES: Record<string, TravelAdvisory> = {
  // d1 — Spiti Valley
  d1: {
    level: 'safe',
    summary: 'Generally safe for tourists.',
    details: 'Inner Line Permit required for some areas near the Chinese border. Carry altitude sickness medication.',
    lastUpdated: '2026-03-15',
    source: 'MEA Advisory'
  },

  // d2 — Kyoto
  d2: {
    level: 'safe',
    summary: 'Very safe. Low crime. Excellent infrastructure.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d3 — Reykjavik
  d3: {
    level: 'safe',
    summary: 'One of the safest countries globally.',
    details: 'Be cautious of sudden weather changes and volcanic activity advisories.',
    lastUpdated: '2026-03-18',
    source: 'FCDO Advisory'
  },

  // d4 — Varanasi
  d4: {
    level: 'safe',
    summary: 'Safe with normal precautions.',
    details: 'Beware of touts and scams near the ghats. Keep valuables secure in crowds.',
    lastUpdated: '2026-03-25',
    source: 'MEA Advisory'
  },

  // d5 — Aman-i-Khas, Ranthambore
  d5: {
    level: 'safe',
    summary: 'Safe resort area within national park.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d6 — Berlin
  d6: {
    level: 'safe',
    summary: 'Safe with standard urban precautions.',
    details: 'Watch for pickpockets on public transport and at tourist sites.',
    lastUpdated: '2026-03-22',
    source: 'FCDO Advisory'
  },

  // d7 — Hampi
  d7: {
    level: 'safe',
    summary: 'Safe. Quiet rural heritage site.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d8 — Naoshima
  d8: {
    level: 'safe',
    summary: 'Very safe island community.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d9 — Chefchaouen
  d9: {
    level: 'caution',
    summary: 'Exercise normal caution in the Rif Mountains region.',
    details: 'Cannabis trade in surrounding Rif area. Avoid venturing off main tourist paths alone at night. Generally safe in the medina.',
    lastUpdated: '2026-03-10',
    source: 'FCDO Advisory'
  },

  // d10 — Zermatt
  d10: {
    level: 'safe',
    summary: 'Very safe mountain resort.',
    lastUpdated: '2026-03-20',
    source: 'FDFA Advisory'
  },

  // d11 — Santorini
  d11: {
    level: 'safe',
    summary: 'Safe. Well-developed tourist infrastructure.',
    lastUpdated: '2026-03-22',
    source: 'FCDO Advisory'
  },

  // d12 — Petra, Jordan
  d12: {
    level: 'caution',
    summary: 'Exercise heightened caution near border areas.',
    details: 'Petra itself is safe and well-guarded. Avoid areas near the Syrian and Iraqi borders. Flash flood risk in the Siq during rains.',
    lastUpdated: '2026-03-05',
    source: 'US State Dept.'
  },

  // d13 — Tulum, Mexico
  d13: {
    level: 'caution',
    summary: 'Exercise increased caution in Quintana Roo state.',
    details: 'Tourist zone is generally safe but cartel-related violence can occur in surrounding areas. Use licensed taxis. Avoid isolated areas at night.',
    lastUpdated: '2026-02-28',
    source: 'US State Dept.'
  },

  // d14 — Lofoten, Norway
  d14: {
    level: 'safe',
    summary: 'Very safe. Remote but well-serviced.',
    lastUpdated: '2026-03-20',
    source: 'FCDO Advisory'
  },

  // d15 — Udaipur
  d15: {
    level: 'safe',
    summary: 'Safe. Major tourist destination with good infrastructure.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d16 — Sapa, Vietnam
  d16: {
    level: 'safe',
    summary: 'Safe with normal precautions.',
    details: 'Use reputable trek operators. Avoid trekking alone in remote areas. Road conditions can be poor.',
    lastUpdated: '2026-03-15',
    source: 'MEA Advisory'
  },

  // d17 — Meteora
  d17: {
    level: 'safe',
    summary: 'Safe religious and heritage site.',
    lastUpdated: '2026-03-20',
    source: 'FCDO Advisory'
  },

  // d18 — Gokarna
  d18: {
    level: 'safe',
    summary: 'Safe beach destination.',
    details: 'Exercise caution when swimming — strong currents at some beaches. No lifeguards on remote beaches.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d19 — Seoul
  d19: {
    level: 'safe',
    summary: 'Very safe metropolitan city.',
    details: 'Be aware of periodic tensions with North Korea, though these rarely affect tourists.',
    lastUpdated: '2026-03-22',
    source: 'US State Dept.'
  },

  // d20 — Atacama, Chile
  d20: {
    level: 'safe',
    summary: 'Safe. Well-organized tourism infrastructure.',
    details: 'Carry altitude medication for high-altitude sites (El Tatio at 4,300m). Stay hydrated.',
    lastUpdated: '2026-03-18',
    source: 'FCDO Advisory'
  },

  // d21 — Munnar
  d21: {
    level: 'safe',
    summary: 'Safe hill station with good infrastructure.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d22 — Tbilisi
  d22: {
    level: 'caution',
    summary: 'Exercise caution near occupied territories.',
    details: 'Tbilisi city is safe. Avoid South Ossetia and Abkhazia border regions. Political protests can occur in the capital.',
    lastUpdated: '2026-03-10',
    source: 'FCDO Advisory'
  },

  // d23 — Ladakh
  d23: {
    level: 'caution',
    summary: 'Exercise caution near border areas.',
    details: 'Tourist areas (Leh, Pangong, Nubra) are safe. Inner Line Permits required for certain areas. Military presence near LoC and LAC borders.',
    lastUpdated: '2026-03-15',
    source: 'MEA Advisory'
  },

  // d24 — Singapore
  d24: {
    level: 'safe',
    summary: 'One of the safest cities globally.',
    details: 'Strict laws — chewing gum, littering, and jaywalking can result in fines.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d25 — Siwa Oasis, Egypt
  d25: {
    level: 'caution',
    summary: 'Exercise caution in western desert regions.',
    details: 'Siwa is generally safe for tourists but the western desert near the Libyan border has security concerns. Travel in organized groups recommended.',
    lastUpdated: '2026-02-20',
    source: 'FCDO Advisory'
  },

  // d26 — Alleppey
  d26: {
    level: 'safe',
    summary: 'Safe. Well-developed tourism in Kerala.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d27 — Jaisalmer
  d27: {
    level: 'safe',
    summary: 'Safe. Major Rajasthan tourist destination.',
    details: 'Avoid venturing into the desert without a guide. Border areas with Pakistan are restricted.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },

  // d28 — Rishikesh
  d28: {
    level: 'safe',
    summary: 'Safe spiritual and adventure destination.',
    details: 'Use certified operators for rafting and bungee jumping. River currents can be strong.',
    lastUpdated: '2026-03-20',
    source: 'MEA Advisory'
  },
};
