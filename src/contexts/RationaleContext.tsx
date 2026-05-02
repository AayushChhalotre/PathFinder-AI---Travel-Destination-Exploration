import React, { createContext, useContext, useState, useMemo } from 'react';
import { useRationale as useRationaleHook } from '../hooks/useRationale';
import { RationaleContext as RationaleContextType } from '../services/rationaleService';

interface RationaleContextState {
  rationaleCache: Record<string, string>;
  getRationale: (
    destinationId: string,
    destinationName: string,
    context: RationaleContextType,
    fallback?: string
  ) => Promise<string>;
  prefetchRationales: (
    destinations: { id: string; name: string }[],
    context: RationaleContextType,
    limit?: number
  ) => Promise<void>;
  isGenerating: boolean;
}

const RationaleContext = createContext<RationaleContextState | undefined>(undefined);

export const RationaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rationaleCache, setRationaleCache] = useState<Record<string, string>>({});
  const { getRationale, prefetchRationales, isGenerating } = useRationaleHook(rationaleCache, setRationaleCache);

  const value = useMemo(() => ({
    rationaleCache,
    getRationale,
    prefetchRationales,
    isGenerating
  }), [rationaleCache, getRationale, prefetchRationales, isGenerating]);

  return (
    <RationaleContext.Provider value={value}>
      {children}
    </RationaleContext.Provider>
  );
};

export const useRationaleContext = () => {
  const context = useContext(RationaleContext);
  if (context === undefined) {
    throw new Error('useRationaleContext must be used within a RationaleProvider');
  }
  return context;
};
