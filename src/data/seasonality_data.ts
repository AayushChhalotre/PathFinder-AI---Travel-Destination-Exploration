/**
 * Seasonality Intelligence — Monthly suitability scores per destination.
 * Scores are 0.0 (avoid) to 1.0 (ideal) based on:
 *   - Climate & weather patterns
 *   - Crowd levels & peak pricing
 *   - Accessibility (road closures, monsoon, etc.)
 *   - Unique seasonal experiences (cherry blossoms, northern lights, etc.)
 */

export interface SeasonalityProfile {
  bestMonths: string[];
  avoidMonths: string[];
  monthlyScore: Record<string, number>;
  weatherRisk: Record<string, string>;
  seasonalHighlight?: Record<string, string>; // e.g., "Cherry blossoms in bloom"
}

export const SEASONALITY_DATA: Record<string, SeasonalityProfile> = {
  // d1 — Spiti Valley, Himachal Pradesh
  d1: {
    bestMonths: ['June', 'July', 'August', 'September'],
    avoidMonths: ['November', 'December', 'January', 'February', 'March'],
    monthlyScore: {
      January: 0.05, February: 0.05, March: 0.15, April: 0.35,
      May: 0.65, June: 0.9, July: 0.85, August: 0.8,
      September: 0.9, October: 0.6, November: 0.1, December: 0.05
    },
    weatherRisk: {
      November: 'Heavy snowfall; roads closed via Rohtang. Only air access via Shimla.',
      December: 'Sub-zero temps (-20°C). Roads blocked. Extreme cold.',
      January: 'Severe winter. All access routes closed. Not recommended.',
      February: 'Roads still blocked. Avalanche risk on Rohtang.',
      March: 'Roads gradually opening but unreliable. Landslide risk.'
    },
    seasonalHighlight: {
      June: 'Roads fully open. Clear skies. Wildflowers blooming.',
      September: 'Crystal-clear skies. Best photography conditions.',
      October: 'Post-monsoon clarity. Fewer tourists.'
    }
  },

  // d2 — Kyoto, Japan
  d2: {
    bestMonths: ['March', 'April', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.5, February: 0.55, March: 0.85, April: 0.95,
      May: 0.75, June: 0.5, July: 0.3, August: 0.3,
      September: 0.6, October: 0.9, November: 0.95, December: 0.6
    },
    weatherRisk: {
      July: 'Peak rainy season (tsuyu). High humidity, heavy downpours.',
      August: 'Extreme heat (35°C+) and humidity. Typhoon season begins.'
    },
    seasonalHighlight: {
      March: 'Cherry blossom season begins late March.',
      April: 'Peak cherry blossoms (sakura). Iconic.',
      November: 'Stunning autumn foliage at temples.'
    }
  },

  // d3 — Reykjavik, Iceland
  d3: {
    bestMonths: ['June', 'July', 'August'],
    avoidMonths: ['December', 'January'],
    monthlyScore: {
      January: 0.3, February: 0.35, March: 0.45, April: 0.55,
      May: 0.7, June: 0.95, July: 0.95, August: 0.9,
      September: 0.7, October: 0.5, November: 0.4, December: 0.3
    },
    weatherRisk: {
      December: 'Only 4h daylight. Harsh storms. Roads dangerous.',
      January: 'Shortest days. Extreme winds. Limited accessibility.'
    },
    seasonalHighlight: {
      June: 'Midnight sun. 24h daylight. Puffin nesting season.',
      September: 'Northern Lights begin. Autumn colors.',
      February: 'Prime Northern Lights viewing.'
    }
  },

  // d4 — Varanasi, India
  d4: {
    bestMonths: ['October', 'November', 'February', 'March'],
    avoidMonths: ['June', 'July', 'August'],
    monthlyScore: {
      January: 0.7, February: 0.85, March: 0.8, April: 0.55,
      May: 0.3, June: 0.2, July: 0.15, August: 0.2,
      September: 0.5, October: 0.9, November: 0.95, December: 0.75
    },
    weatherRisk: {
      June: 'Pre-monsoon heat (45°C+). Extremely uncomfortable.',
      July: 'Peak monsoon. Ganges flooding. Ghat access restricted.',
      August: 'Continued monsoon. Humidity and waterlogging.'
    },
    seasonalHighlight: {
      November: 'Dev Deepawali festival. Ghats lit with thousands of oil lamps.',
      October: 'Post-monsoon. Pleasant weather. Festive season (Dussehra/Diwali).'
    }
  },

  // d5 — Aman-i-Khas, Ranthambore
  d5: {
    bestMonths: ['October', 'November', 'February', 'March', 'April'],
    avoidMonths: ['July', 'August', 'September'],
    monthlyScore: {
      January: 0.7, February: 0.85, March: 0.9, April: 0.85,
      May: 0.6, June: 0.3, July: 0.1, August: 0.1,
      September: 0.15, October: 0.8, November: 0.85, December: 0.75
    },
    weatherRisk: {
      July: 'National park closed for monsoon. Resort may be shut.',
      August: 'Park closed. Heavy rains flood terrain.',
      September: 'Park closed until October 1st.'
    },
    seasonalHighlight: {
      April: 'Best tiger sighting odds — animals come to water sources.',
      March: 'Dry forest. Excellent wildlife visibility.'
    }
  },

  // d6 — Berlin, Germany
  d6: {
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    avoidMonths: ['January', 'February'],
    monthlyScore: {
      January: 0.3, February: 0.3, March: 0.45, April: 0.6,
      May: 0.85, June: 0.95, July: 0.9, August: 0.9,
      September: 0.85, October: 0.65, November: 0.4, December: 0.45
    },
    weatherRisk: {
      January: 'Cold (avg -1°C). Short days (7h daylight). Grey skies.',
      February: 'Still cold and dark. Not ideal for outdoor exploration.'
    },
    seasonalHighlight: {
      June: 'Fête de la Musique. Long summer days (17h daylight).',
      December: 'Christmas markets. Festive atmosphere despite cold.'
    }
  },

  // d7 — Hampi, Karnataka
  d7: {
    bestMonths: ['November', 'December', 'January', 'February'],
    avoidMonths: ['May', 'June', 'July'],
    monthlyScore: {
      January: 0.9, February: 0.85, March: 0.7, April: 0.5,
      May: 0.2, June: 0.15, July: 0.15, August: 0.3,
      September: 0.5, October: 0.7, November: 0.9, December: 0.95
    },
    weatherRisk: {
      May: 'Extreme heat (40°C+). Ruins exploration very uncomfortable.',
      June: 'Monsoon onset. Heavy rains. Tungabhadra river floods.',
      July: 'Peak monsoon. Some areas inaccessible.'
    },
    seasonalHighlight: {
      January: 'Hampi Utsav — annual arts and cultural festival.',
      November: 'Cool, dry weather. Perfect for cycling through ruins.'
    }
  },

  // d8 — Naoshima, Japan
  d8: {
    bestMonths: ['April', 'May', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.45, February: 0.5, March: 0.7, April: 0.9,
      May: 0.9, June: 0.5, July: 0.3, August: 0.35,
      September: 0.6, October: 0.9, November: 0.85, December: 0.5
    },
    weatherRisk: {
      July: 'Rainy season. High humidity. Ferry disruptions possible.',
      August: 'Extreme heat. Typhoon risk. Outdoor art less enjoyable.'
    },
    seasonalHighlight: {
      April: 'Setouchi Triennale art festival (if active year).',
      October: 'Mild weather. Autumn light for art photography.'
    }
  },

  // d9 — Chefchaouen, Morocco
  d9: {
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.5, February: 0.55, March: 0.85, April: 0.9,
      May: 0.85, June: 0.6, July: 0.35, August: 0.3,
      September: 0.8, October: 0.9, November: 0.7, December: 0.55
    },
    weatherRisk: {
      July: 'Extreme heat (38°C+). Narrow Medina streets become stifling.',
      August: 'Hottest month. Very uncomfortable for walking.'
    },
    seasonalHighlight: {
      April: 'Spring blooms. Mild weather. Rif Mountains lush and green.'
    }
  },

  // d10 — Zermatt, Switzerland
  d10: {
    bestMonths: ['June', 'July', 'August', 'September', 'December', 'January', 'February'],
    avoidMonths: ['April', 'May', 'November'],
    monthlyScore: {
      January: 0.85, February: 0.85, March: 0.7, April: 0.3,
      May: 0.35, June: 0.9, July: 0.95, August: 0.9,
      September: 0.85, October: 0.65, November: 0.3, December: 0.85
    },
    weatherRisk: {
      April: 'Shoulder season. Many lifts closed. Slush conditions.',
      May: 'Transition month. Snow melting. Limited hiking/skiing.',
      November: 'Off-season. Most facilities closed.'
    },
    seasonalHighlight: {
      July: 'Peak hiking. Meadow wildflowers. Clear Matterhorn views.',
      January: 'Prime ski season. Powder conditions.'
    }
  },

  // d11 — Santorini, Greece
  d11: {
    bestMonths: ['May', 'June', 'September', 'October'],
    avoidMonths: ['December', 'January', 'February'],
    monthlyScore: {
      January: 0.2, February: 0.2, March: 0.4, April: 0.7,
      May: 0.9, June: 0.95, July: 0.75, August: 0.7,
      September: 0.95, October: 0.85, November: 0.45, December: 0.2
    },
    weatherRisk: {
      December: 'Many hotels/restaurants closed. Ferry cancellations.',
      January: 'Off-season. Very limited services. Cold winds.',
      February: 'Still off-season. Not the iconic Santorini experience.'
    },
    seasonalHighlight: {
      May: 'Warm but not crowded. Wildflowers on caldera.',
      September: 'Warm sea. Fewer tourists. Perfect sunsets.'
    }
  },

  // d12 — Petra, Jordan
  d12: {
    bestMonths: ['March', 'April', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.5, February: 0.6, March: 0.9, April: 0.9,
      May: 0.7, June: 0.4, July: 0.2, August: 0.2,
      September: 0.6, October: 0.9, November: 0.85, December: 0.55
    },
    weatherRisk: {
      July: 'Extreme desert heat (40°C+). Walking the Siq dangerous.',
      August: 'Peak heat. Risk of heatstroke. Flash flood risk.'
    },
    seasonalHighlight: {
      March: 'Wildflowers in Wadi Rum. Mild hiking temps.',
      October: 'Perfect weather for the Monastery climb.'
    }
  },

  // d13 — Tulum, Mexico
  d13: {
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    avoidMonths: ['September', 'October'],
    monthlyScore: {
      January: 0.9, February: 0.9, March: 0.85, April: 0.8,
      May: 0.6, June: 0.5, July: 0.55, August: 0.45,
      September: 0.25, October: 0.3, November: 0.85, December: 0.9
    },
    weatherRisk: {
      September: 'Peak hurricane season. Possible evacuation.',
      October: 'Hurricane risk persists. Heavy rains. Sargassum seaweed.'
    },
    seasonalHighlight: {
      December: 'Dry season starts. Perfect beach weather.',
      February: 'Whale shark season nearby. Quiet before spring break.'
    }
  },

  // d14 — Lofoten Islands, Norway
  d14: {
    bestMonths: ['June', 'July', 'August'],
    avoidMonths: ['November', 'December', 'January'],
    monthlyScore: {
      January: 0.3, February: 0.4, March: 0.5, April: 0.6,
      May: 0.75, June: 0.95, July: 0.95, August: 0.9,
      September: 0.7, October: 0.45, November: 0.3, December: 0.25
    },
    weatherRisk: {
      November: 'Polar night begins. Very short daylight. Storms.',
      December: 'Only 1h of twilight. Extreme winds. Limited access.',
      January: 'Polar night. Northern Lights but harsh conditions.'
    },
    seasonalHighlight: {
      June: 'Midnight sun. 24h hiking. Puffin colonies.',
      January: 'Northern Lights visible but extreme cold.'
    }
  },

  // d15 — Udaipur, Rajasthan
  d15: {
    bestMonths: ['October', 'November', 'December', 'February', 'March'],
    avoidMonths: ['May', 'June'],
    monthlyScore: {
      January: 0.75, February: 0.85, March: 0.8, April: 0.5,
      May: 0.2, June: 0.25, July: 0.4, August: 0.45,
      September: 0.65, October: 0.9, November: 0.95, December: 0.85
    },
    weatherRisk: {
      May: 'Extreme heat (45°C). Lake levels low. Very uncomfortable.',
      June: 'Pre-monsoon heat and dust storms.'
    },
    seasonalHighlight: {
      October: 'Post-monsoon. Lakes full. Lush green hills.',
      November: 'Mewar Festival season. Perfect boat ride weather.'
    }
  },

  // d16 — Sapa, Vietnam
  d16: {
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.4, February: 0.45, March: 0.8, April: 0.85,
      May: 0.8, June: 0.5, July: 0.3, August: 0.3,
      September: 0.85, October: 0.9, November: 0.6, December: 0.4
    },
    weatherRisk: {
      July: 'Peak monsoon. Landslides on mountain roads.',
      August: 'Continued heavy rain. Trekking trails slippery and dangerous.'
    },
    seasonalHighlight: {
      September: 'Golden rice terraces before harvest. Iconic photographs.',
      March: 'Spring blooms. Clear mountain views.'
    }
  },

  // d17 — Meteora, Greece
  d17: {
    bestMonths: ['April', 'May', 'September', 'October'],
    avoidMonths: ['January', 'February'],
    monthlyScore: {
      January: 0.3, February: 0.35, March: 0.6, April: 0.9,
      May: 0.9, June: 0.7, July: 0.55, August: 0.5,
      September: 0.9, October: 0.85, November: 0.5, December: 0.35
    },
    weatherRisk: {
      January: 'Cold and rainy. Some monasteries have reduced hours.',
      February: 'Fog can obscure views for days.'
    },
    seasonalHighlight: {
      April: 'Spring wildflowers. Moderate visitors. Great light.',
      September: 'Warm but not hot. Autumn colors starting.'
    }
  },

  // d18 — Gokarna, Karnataka
  d18: {
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    avoidMonths: ['June', 'July', 'August'],
    monthlyScore: {
      January: 0.9, February: 0.9, March: 0.8, April: 0.6,
      May: 0.35, June: 0.15, July: 0.1, August: 0.1,
      September: 0.35, October: 0.75, November: 0.9, December: 0.95
    },
    weatherRisk: {
      June: 'Southwest monsoon. Heavy rains. Beach shacks closed.',
      July: 'Peak monsoon. Dangerous sea conditions. No swimming.',
      August: 'Continued monsoon. Limited accommodation available.'
    },
    seasonalHighlight: {
      December: 'Perfect weather. Beach shacks open. Backpacker season.',
      January: 'Dry, warm weather. Ideal for beach treks.'
    }
  },

  // d19 — Seoul, South Korea
  d19: {
    bestMonths: ['April', 'May', 'September', 'October'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.35, February: 0.4, March: 0.6, April: 0.9,
      May: 0.85, June: 0.6, July: 0.3, August: 0.3,
      September: 0.85, October: 0.95, November: 0.6, December: 0.4
    },
    weatherRisk: {
      July: 'Monsoon season (jangma). Heavy, persistent rain.',
      August: 'Peak humidity and rain. Typhoon risk.'
    },
    seasonalHighlight: {
      April: 'Cherry blossom season along Yeouido.',
      October: 'Stunning autumn foliage at palaces.'
    }
  },

  // d20 — Atacama Desert, Chile
  d20: {
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    avoidMonths: [],
    monthlyScore: {
      January: 0.6, February: 0.6, March: 0.85, April: 0.9,
      May: 0.85, June: 0.7, July: 0.75, August: 0.8,
      September: 0.9, October: 0.9, November: 0.8, December: 0.65
    },
    weatherRisk: {
      January: 'Altiplanic winter — brief but intense afternoon thunderstorms.',
      February: 'Lingering Bolivian winter rains in highlands.'
    },
    seasonalHighlight: {
      April: 'Clear skies. Perfect stargazing conditions all month.',
      September: 'Atacama Desert in bloom (rare but spectacular).'
    }
  },

  // d21 — Munnar, Kerala
  d21: {
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March'],
    avoidMonths: ['June', 'July'],
    monthlyScore: {
      January: 0.85, February: 0.85, March: 0.8, April: 0.6,
      May: 0.45, June: 0.2, July: 0.15, August: 0.3,
      September: 0.75, October: 0.85, November: 0.9, December: 0.9
    },
    weatherRisk: {
      June: 'Southwest monsoon. Very heavy rain. Landslide risk on mountain roads.',
      July: 'Peak monsoon. Roads can be blocked. Tea garden tours limited.'
    },
    seasonalHighlight: {
      September: 'Neelakurinji bloom (once every 12 years — next 2030).',
      December: 'Cool, misty mornings. Perfect for tea garden walks.'
    }
  },

  // d22 — Tbilisi, Georgia
  d22: {
    bestMonths: ['May', 'June', 'September', 'October'],
    avoidMonths: ['January', 'February'],
    monthlyScore: {
      January: 0.3, February: 0.35, March: 0.5, April: 0.7,
      May: 0.9, June: 0.85, July: 0.65, August: 0.6,
      September: 0.9, October: 0.85, November: 0.55, December: 0.4
    },
    weatherRisk: {
      January: 'Cold (avg 0°C). Shorter days. Some mountain roads closed.',
      February: 'Still cold. Heavy snowfall in surrounding regions.'
    },
    seasonalHighlight: {
      May: 'Vine season opening. Tbilisoba preparations.',
      September: 'Wine harvest season (Rtveli). Festive atmosphere.'
    }
  },

  // d23 — Ladakh, J&K
  d23: {
    bestMonths: ['June', 'July', 'August', 'September'],
    avoidMonths: ['November', 'December', 'January', 'February', 'March'],
    monthlyScore: {
      January: 0.05, February: 0.05, March: 0.1, April: 0.3,
      May: 0.6, June: 0.9, July: 0.85, August: 0.8,
      September: 0.85, October: 0.55, November: 0.1, December: 0.05
    },
    weatherRisk: {
      November: 'Mountain passes closing. Sub-zero temperatures.',
      December: 'All roads closed. Only air access. -25°C possible.',
      January: 'Extreme winter. Chadar Trek only for experts.',
      February: 'Roads blocked. Avalanche risk.',
      March: 'Roads gradually opening but unreliable.'
    },
    seasonalHighlight: {
      June: 'All passes open. Clear skies. Pangong Lake at its bluest.',
      July: 'Hemis Festival at the monastery. Cultural peak.',
      September: 'Post-monsoon clarity. Fewer tourists.'
    }
  },

  // d24 — Singapore
  d24: {
    bestMonths: ['February', 'March', 'April', 'May', 'June', 'July'],
    avoidMonths: [],
    monthlyScore: {
      January: 0.6, February: 0.8, March: 0.85, April: 0.85,
      May: 0.8, June: 0.85, July: 0.85, August: 0.75,
      September: 0.65, October: 0.6, November: 0.55, December: 0.55
    },
    weatherRisk: {
      November: 'Northeast monsoon begins. Afternoon thunderstorms.',
      December: 'Peak rain month. Short but intense daily downpours.'
    },
    seasonalHighlight: {
      February: 'Chinese New Year celebrations. Night markets.',
      June: 'Great Singapore Sale. Comfortable weather.'
    }
  },

  // d25 — Siwa Oasis, Egypt
  d25: {
    bestMonths: ['October', 'November', 'March', 'April'],
    avoidMonths: ['June', 'July', 'August'],
    monthlyScore: {
      January: 0.65, February: 0.7, March: 0.85, April: 0.85,
      May: 0.6, June: 0.2, July: 0.15, August: 0.15,
      September: 0.5, October: 0.9, November: 0.9, December: 0.7
    },
    weatherRisk: {
      June: 'Extreme desert heat (45°C+). Sand storms possible.',
      July: 'Peak heat. Dangerous for outdoor exploration.',
      August: 'Still scorching. Very few tourists for reason.'
    },
    seasonalHighlight: {
      October: 'Siwa Festival (Siyaha). Cultural celebrations.',
      March: 'Perfect desert temperatures. Date harvest.'
    }
  },

  // d26 — Alleppey, Kerala
  d26: {
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March'],
    avoidMonths: ['June', 'July', 'August'],
    monthlyScore: {
      January: 0.85, February: 0.85, March: 0.75, April: 0.55,
      May: 0.4, June: 0.15, July: 0.1, August: 0.15,
      September: 0.65, October: 0.8, November: 0.9, December: 0.9
    },
    weatherRisk: {
      June: 'Southwest monsoon. Backwater navigation limited.',
      July: 'Peak monsoon. Houseboat services may be suspended.',
      August: 'Continued monsoon. Flooding in low-lying areas.'
    },
    seasonalHighlight: {
      August: 'Nehru Trophy Boat Race (if you can brave the rain).',
      November: 'Post-monsoon. Water levels ideal. Lush green backwaters.'
    }
  },

  // d27 — Jaisalmer, Rajasthan
  d27: {
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    avoidMonths: ['May', 'June', 'July'],
    monthlyScore: {
      January: 0.85, February: 0.85, March: 0.75, April: 0.5,
      May: 0.15, June: 0.1, July: 0.2, August: 0.35,
      September: 0.5, October: 0.85, November: 0.9, December: 0.9
    },
    weatherRisk: {
      May: 'Extreme desert heat (48°C). Sand storms.',
      June: 'Scorching heat continues. Pre-monsoon dust storms.',
      July: 'Brief monsoon rains but extreme heat persists.'
    },
    seasonalHighlight: {
      February: 'Desert Festival. Camel races. Folk performances.',
      December: 'Cool desert nights. Perfect for dune camping.'
    }
  },

  // d28 — Rishikesh, Uttarakhand
  d28: {
    bestMonths: ['September', 'October', 'November', 'February', 'March', 'April'],
    avoidMonths: ['July', 'August'],
    monthlyScore: {
      January: 0.6, February: 0.75, March: 0.85, April: 0.8,
      May: 0.55, June: 0.35, July: 0.15, August: 0.15,
      September: 0.8, October: 0.9, November: 0.85, December: 0.65
    },
    weatherRisk: {
      July: 'Monsoon. River swollen. Rafting suspended. Landslide risk.',
      August: 'Peak monsoon. Kanwar Yatra crowds. Dangerous conditions.'
    },
    seasonalHighlight: {
      March: 'International Yoga Festival. River levels ideal for rafting.',
      October: 'Post-monsoon. Clear Himalayan views. Rapids at best.'
    }
  },
  // d57 — Paris
  d57: {
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    avoidMonths: ['January', 'February', 'November'],
    monthlyScore: {
      January: 0.4, February: 0.45, March: 0.65, April: 0.9,
      May: 0.95, June: 0.9, July: 0.75, August: 0.75,
      September: 0.95, October: 0.85, November: 0.5, December: 0.6
    },
    weatherRisk: {
      January: 'Cold and damp. Short days.',
      November: 'Gray skies and frequent rain.',
      July: 'Possible heatwaves in the city.'
    },
    seasonalHighlight: {
      May: 'Outdoor cafes in full swing. Beautiful spring weather.',
      December: 'Holiday lights and Christmas markets.',
      September: 'Fashion Week atmosphere. Pleasant weather.'
    }
  },
  // d58 — London
  d58: {
    bestMonths: ['May', 'June', 'July', 'August', 'September'],
    avoidMonths: ['January', 'February'],
    monthlyScore: {
      January: 0.35, February: 0.4, March: 0.55, April: 0.75,
      May: 0.9, June: 0.95, July: 0.95, August: 0.9,
      September: 0.85, October: 0.7, November: 0.45, December: 0.55
    },
    weatherRisk: {
      January: 'Shortest days. Often cold and rainy.',
      December: 'Frequent rain but festive atmosphere.',
      July: 'Peak tourist season. Crowded attractions.'
    },
    seasonalHighlight: {
      June: 'Summer in the city. Parks are vibrant.',
      December: 'Winter Wonderland in Hyde Park.',
      May: 'Chelsea Flower Show. Spring blooms.'
    }
  },
};
