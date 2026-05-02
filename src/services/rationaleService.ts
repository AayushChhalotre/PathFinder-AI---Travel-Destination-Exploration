import { generateDestinationRationaleSentence } from '../lib/gemini';

export interface RationaleContext {
  moodTags: string[];
  occasionTags: string[];
  travelMonth: string | null;
}

/**
 * Builds a standardized prompt for generating destination rationales.
 */
export function buildRationalePrompt(destinationName: string, context: RationaleContext): string {
  const { moodTags, occasionTags, travelMonth } = context;
  const monthText = travelMonth || 'any month';
  
  return `Generate a single sentence explaining why ${destinationName} matches a traveler who selected these vibes: ${moodTags.join(', ')} and these occasions: ${occasionTags.join(', ')} in ${monthText}.
   
   The sentence must:
   - Start with 'Because you'
   - Reference at least one specific tag by name
   - Be under 20 words
   - Return only the sentence. No preamble.
   - Use warm, empathetic language.`;
}

/**
 * Generates a rationale for a single destination.
 */
export async function fetchDestinationRationale(
  destinationName: string, 
  context: RationaleContext
): Promise<string> {
  const prompt = buildRationalePrompt(destinationName, context);
  const sentence = await generateDestinationRationaleSentence(prompt);
  return sentence.trim();
}

/**
 * Generates a cache key for a destination and mood combination.
 */
export function getRationaleCacheKey(destinationId: string, moodTags: string[]): string {
  const moodKey = [...moodTags].sort().join('_');
  return `${destinationId}_${moodKey}`;
}
