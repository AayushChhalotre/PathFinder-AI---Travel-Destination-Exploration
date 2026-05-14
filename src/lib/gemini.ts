import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, incrementRateLimit, RateLimitError } from './rateLimiter';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is missing. Rationale/Intent generation will be disabled.");
}

const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface VibeIntentResult {
  suggestedVibe: string;
  emotionalTone: string;
  confidence: number;
}

/**
 * Decodes the user's travel vibe from selected visual anchors.
 */
export async function parseVibeIntent(
  selectedImageIds: string[], 
  imageVibes: Record<string, string[]>, 
  imageLocations: Record<string, string>
): Promise<VibeIntentResult | null> {
  if (!genAI) return null;

  try {
    // Check rate limit
    const status = await checkRateLimit();
    if (!status.allowed) {
      throw new RateLimitError(status);
    }

    const context = selectedImageIds.map(id => {
      return `Image ${id}: Vibes=[${imageVibes[id]?.join(', ')}], Location=[${imageLocations[id]}]`;
    }).join('\n');

    const prompt = `Based on these selected travel images, capture the "soul" of this trip.
    Selected images:
    ${context}

    Return exactly a JSON object: { "suggestedVibe": "vibe_name", "emotionalTone": "brief_description", "confidence": 0.0-1.0 }
    Vibe name MUST be one of: serene, vibrant, mysterious, rugged, minimalist, luxurious, unplugged, cultural, nocturnal, nostalgic, futuristic, bohemian, cinematic, ethereal.
    Emotional tone should be 2-3 words (e.g., "Reflective & Quiet", "High-Energy Urban").`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text;
    
    // Increment on successful hit
    await incrementRateLimit();

    if (text) {
      const match = text.match(/\{.*\}/);
      return match ? JSON.parse(match[0]) : null;
    }
    return null;
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    console.error("Vibe Parsing Error:", error);
    return null;
  }
}

export async function generateDestinationRationaleSentence(prompt: string): Promise<string> {
  if (!genAI) return "This destination perfectly aligns with your current travel patterns and selected vibes.";

  try {
    // Check rate limit
    const status = await checkRateLimit();
    if (!status.allowed) {
      // For background tasks like rationale, we might want to just return a default instead of throwing
      return "This destination aligns with your selected travel preferences.";
    }

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Increment on successful hit
    await incrementRateLimit();

    return response.text || "This destination perfectly aligns with your current travel patterns and selected vibes.";
  } catch (error) {
    console.error("Rationale Error:", error);
    return "This destination aligns with your selected travel preferences.";
  }
}

