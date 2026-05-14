import { GoogleGenAI } from '@google/genai';
import { DestinationAnalysis, AlternativeDestination } from '../types';
import { checkRateLimit, incrementRateLimit, RateLimitError } from './rateLimiter';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AnalysisParams {
  destinationName: string;
  budget: number;
  numTravellers: number;
  travelMonth: string;
  vibes: string[];
  occasions: string[];
}

// ---------------------------------------------------------------------------
// Fallback used when the API is unavailable or parsing fails
// ---------------------------------------------------------------------------
function buildFallback(params: AnalysisParams): DestinationAnalysis {
  const { destinationName, budget, vibes } = params;
  return {
    destinationName,
    feasibilityScore: 70,
    weatherOutlook: {
      summary: 'Typical seasonal weather expected.',
      tempRange: '18°C – 32°C',
      season: 'varies by month',
    },
    travelAdvisory: {
      level: 'safe',
      details: 'No major advisories at this time. Always check your government\'s official travel advice before departure.',
    },
    estimatedCost: {
      flightINR: Math.round(budget * 0.4),
      stayPerNightINR: Math.round(budget * 0.06),
      totalEstimateINR: Math.round(budget * 0.9),
    },
    budgetAlignment: 'within',
    vibeMatch: vibes.slice(0, 2),
    rationale: `${destinationName} is a popular destination that can align well with your selected vibes and travel style.`,
    alternatives: [],
  };
}

// ---------------------------------------------------------------------------
// Parse a raw Gemini JSON response string safely
// ---------------------------------------------------------------------------
function parseAnalysis(raw: string, params: AnalysisParams): DestinationAnalysis {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  // Extract the first JSON object (greedy between outer braces)
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in response');
  const parsed = JSON.parse(match[0]);

  // Validate required fields; fill defaults for missing ones
  const analysis: DestinationAnalysis = {
    destinationName: parsed.destinationName ?? params.destinationName,
    feasibilityScore: typeof parsed.feasibilityScore === 'number'
      ? Math.min(100, Math.max(0, parsed.feasibilityScore))
      : 70,
    weatherOutlook: {
      summary: parsed.weatherOutlook?.summary ?? 'Weather data unavailable.',
      tempRange: parsed.weatherOutlook?.tempRange ?? 'N/A',
      season: parsed.weatherOutlook?.season ?? 'N/A',
    },
    travelAdvisory: {
      level: (['safe', 'caution', 'warning', 'avoid'].includes(parsed.travelAdvisory?.level))
        ? parsed.travelAdvisory.level
        : 'safe',
      details: parsed.travelAdvisory?.details ?? 'Check your government\'s official travel advice.',
    },
    estimatedCost: {
      flightINR: typeof parsed.estimatedCost?.flightINR === 'number' ? parsed.estimatedCost.flightINR : 0,
      stayPerNightINR: typeof parsed.estimatedCost?.stayPerNightINR === 'number' ? parsed.estimatedCost.stayPerNightINR : 0,
      totalEstimateINR: typeof parsed.estimatedCost?.totalEstimateINR === 'number' ? parsed.estimatedCost.totalEstimateINR : 0,
    },
    budgetAlignment: (['within', 'stretch', 'over'].includes(parsed.budgetAlignment))
      ? parsed.budgetAlignment
      : 'within',
    vibeMatch: Array.isArray(parsed.vibeMatch) ? parsed.vibeMatch : [],
    rationale: parsed.rationale ?? '',
    alternatives: Array.isArray(parsed.alternatives)
      ? (parsed.alternatives as any[]).map((alt): AlternativeDestination => ({
          name: alt.name ?? 'Unknown',
          location: alt.location ?? '',
          whyBetter: alt.whyBetter ?? '',
          estimatedCostINR: typeof alt.estimatedCostINR === 'number' ? alt.estimatedCostINR : 0,
          vibeMatch: Array.isArray(alt.vibeMatch) ? alt.vibeMatch : [],
          imageUrl: alt.imageUrl ?? '',
        }))
      : [],
  };

  return analysis;
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------
export async function analyzeDestination(params: AnalysisParams): Promise<DestinationAnalysis> {
  if (!genAI) {
    console.warn('[destinationAnalyzer] Gemini API key missing — returning fallback.');
    return buildFallback(params);
  }

  try {
    // Check rate limit
    const status = await checkRateLimit();
    if (!status.allowed) {
      throw new RateLimitError(status);
    }

    const { destinationName, budget, numTravellers, travelMonth, vibes, occasions } = params;

    const prompt = `You are PathFinder AI, a highly sophisticated travel intelligence engine. 
A user is inquiring about a specific destination: "${destinationName}".

Context:
- Travel month: ${travelMonth || 'flexible'}
- Travelers: ${numTravellers}
- Total budget: ₹${budget.toLocaleString('en-IN')}
- Preferred Vibes: ${vibes.join(', ') || 'general leisure'}

Objective:
Provide a grounded, expert-level feasibility analysis. You MUST consider:
1. Current Status: Ground your answer in recent knowledge about this location (weather patterns, major events, or active conflicts/safety warnings).
2. Cost Realism: Calculate round-trip flights from major Indian hubs (BOM/DEL/BLR) and mid-range stay costs for 2024-2025.
3. Vibe Enhancement: Does this place actually deliver the "${vibes.join(', ')}" vibes? If not, be honest.

Return ONLY a JSON object (no markdown, no prose) matching this schema:
{
  "destinationName": "${destinationName}",
  "feasibilityScore": <0-100 score: budget(40%), safety(25%), vibe(20%), season(15%)>,
  "weatherOutlook": {
    "summary": "<specific weather for ${travelMonth}>",
    "tempRange": "<e.g. 20°C - 28°C>",
    "season": "<peak/shoulder/off-peak>"
  },
  "travelAdvisory": {
    "level": "safe | caution | warning | avoid",
    "details": "<current safety status, active conflicts, or health advisories>"
  },
  "estimatedCost": {
    "flightINR": <est flight per person>,
    "stayPerNightINR": <est hotel per night>,
    "totalEstimateINR": <total for ${numTravellers} people for 1 week>
  },
  "budgetAlignment": "within | stretch | over",
  "vibeMatch": [<vibes this place delivers>],
  "rationale": "<empathetic, expert analysis of why this fits or doesn't fit>",
  "alternatives": [
    {
      "name": "<alt name>",
      "location": "<alt location>",
      "whyBetter": "<specific reason why this is a smarter choice than ${destinationName} for this budget/vibe>",
      "estimatedCostINR": <total cost>,
      "vibeMatch": [<vibes>],
      "imageUrl": "<unsplash url>"
    }
  ]
}

Important: Provide exactly 3 diverse alternatives that solve the 'budget' or 'vibe' gap if one exists.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');

    // Increment on successful hit
    await incrementRateLimit();

    return parseAnalysis(text, params);
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    console.error('[destinationAnalyzer] Analysis error:', error);
    return buildFallback(params);
  }
}
