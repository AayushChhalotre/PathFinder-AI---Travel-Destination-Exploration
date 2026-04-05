import { useState, useCallback, useRef, useEffect } from 'react';
import type { Vibe, VibeImage } from '../types';
import { parseVibeIntent, type VibeIntentResult } from '../lib/gemini';
import { VIBE_IMAGES } from '../constants';

const SELECTION_LIMIT = 5;
const DEBOUNCE_MS = 1800;

export interface VibeSelectionState {
  selectedVibes: Vibe[];
  selectedImageIds: string[];
  selectedScenarioId: string | null;
  isDebouncing: boolean;
  aiIntent: VibeIntentResult | null;
  isParsingIntent: boolean;
}

export function useVibeSelection() {
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [aiIntent, setAiIntent] = useState<VibeIntentResult | null>(null);
  const [isParsingIntent, setIsParsingIntent] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build lookup maps for Gemini context
  const imageVibes: Record<string, string[]> = {};
  const imageLocations: Record<string, string> = {};
  VIBE_IMAGES.forEach(img => {
    imageVibes[img.id] = img.vibes;
    imageLocations[img.id] = img.locationTag || '';
  });

  const toggleImage = useCallback((id: string, vibes: Vibe[]) => {
    setSelectedImageIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id);
        // Remove vibes that no longer have any backing image
        setSelectedVibes(sv => {
          const remainingVibes = new Set<Vibe>();
          next.forEach(imgId => {
            const img = VIBE_IMAGES.find(v => v.id === imgId);
            img?.vibes.forEach(v => remainingVibes.add(v));
          });
          return sv.filter(v => remainingVibes.has(v));
        });
        return next;
      } else if (prev.length < SELECTION_LIMIT) {
        const next = [...prev, id];
        setSelectedVibes(sv => {
          const newVibes = vibes.filter(v => !sv.includes(v));
          return [...sv, ...newVibes];
        });
        return next;
      }
      return prev;
    });
  }, []);

  const selectScenario = useCallback((id: string, vibe: Vibe) => {
    setSelectedScenarioId(id);
    setSelectedVibes(prev => (prev.includes(vibe) ? prev : [...prev, vibe]));
  }, []);

  const resetAll = useCallback(() => {
    setSelectedVibes([]);
    setSelectedImageIds([]);
    setSelectedScenarioId(null);
    setAiIntent(null);
    setIsParsingIntent(false);
  }, []);

  // Debounced Gemini intent parsing
  useEffect(() => {
    if (selectedImageIds.length === 0) {
      setAiIntent(null);
      return;
    }

    setIsDebouncing(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsDebouncing(false);

      if (selectedImageIds.length >= 2) {
        setIsParsingIntent(true);
        try {
          const result = await parseVibeIntent(selectedImageIds, imageVibes, imageLocations);
          setAiIntent(result);
        } catch {
          // Fallback already handled inside parseVibeIntent
        } finally {
          setIsParsingIntent(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedImageIds]);

  return {
    selectedVibes,
    setSelectedVibes,
    selectedImageIds,
    selectedScenarioId,
    isDebouncing,
    aiIntent,
    isParsingIntent,
    toggleImage,
    selectScenario,
    resetAll,
  };
}
