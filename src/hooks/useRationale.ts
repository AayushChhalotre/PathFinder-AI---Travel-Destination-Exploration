import { useState, useCallback } from 'react';
import { 
  fetchDestinationRationale, 
  getRationaleCacheKey, 
  RationaleContext 
} from '../services/rationaleService';

/**
 * Hook to manage destination rationales.
 * 
 * Provides a way to retrieve rationales from a cache or fetch them via AI
 * if they don't exist.
 */
export function useRationale(
  cache: Record<string, string>,
  setCache: (updater: (prev: Record<string, string>) => Record<string, string>) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getRationale = useCallback(async (
    destinationId: string,
    destinationName: string,
    context: RationaleContext,
    fallback?: string
  ): Promise<string> => {
    const key = getRationaleCacheKey(destinationId, context.moodTags);
    
    // Check cache first
    if (cache[key]) {
      return cache[key];
    }

    // Generate via AI
    setIsGenerating(true);
    try {
      const rationale = await fetchDestinationRationale(destinationName, context);
      
      // Update global cache
      setCache(prev => ({ 
        ...prev, 
        [key]: rationale 
      }));
      
      return rationale;
    } catch (error) {
      console.error(`[useRationale] Failed for ${destinationName}:`, error);
      return fallback || '';
    } finally {
      setIsGenerating(false);
    }
  }, [cache, setCache]);

  /**
   * Batch fetches rationales for a list of destinations.
   * Useful for pre-caching.
   */
  const prefetchRationales = useCallback(async (
    destinations: { id: string; name: string }[],
    context: RationaleContext,
    limit: number = 24
  ) => {
    if (context.moodTags.length === 0) return;

    const toProcess = destinations.slice(0, limit);
    
    for (const dest of toProcess) {
      const key = getRationaleCacheKey(dest.id, context.moodTags);
      if (cache[key]) continue;

      try {
        const rationale = await fetchDestinationRationale(dest.name, context);
        setCache(prev => ({ ...prev, [key]: rationale }));
      } catch (e) {
        // Silent failure for prefetch
      }
    }
  }, [cache, setCache]);

  return { 
    getRationale, 
    prefetchRationales,
    isGenerating 
  };
}
