import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface VibeIntentResult {
  suggestedVibe: string;
  searchParameters: string[];
  emotionalTone: string;
  rationale: string;
}

/**
 * Sends the user's selected image context to Gemini and returns a structured
 * intent vector. This replaces hundreds of hard-coded if/else mapping rules.
 */
export async function parseVibeIntent(
  selectedImageIds: string[],
  imageVibes: Record<string, string[]>,
  imageLocations: Record<string, string>
): Promise<VibeIntentResult> {
  const imageContext = selectedImageIds.map(id => ({
    id,
    vibes: imageVibes[id] || [],
    location: imageLocations[id] || 'Unknown',
  }));

  const prompt = `You are the Pathfinder AI Vibe Analyst. A user is exploring travel destinations by clicking on atmospheric images.

Here are the images they selected:
${JSON.stringify(imageContext, null, 2)}

Based on these selections, return a JSON object with EXACTLY these fields:
- "suggestedVibe": a 1-3 word creative vibe name (e.g. "cyberpunk nature", "coastal minimalism")
- "searchParameters": an array of 3-5 search keywords for finding matching destinations
- "emotionalTone": a single word capturing the emotional undertone (e.g. "wanderlust", "escapism", "curiosity")
- "rationale": a short 1-sentence explanation of why these images suggest this vibe

Return ONLY valid JSON, no markdown fences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    // Strip potential markdown fences
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean) as VibeIntentResult;
  } catch (error) {
    console.error('[Gemini] Failed to parse vibe intent:', error);
    return {
      suggestedVibe: 'eclectic wanderer',
      searchParameters: ['adventure', 'culture', 'nature'],
      emotionalTone: 'curiosity',
      rationale: 'Your selections suggest a diverse and open-minded traveler.',
    };
  }
}
