import React from 'react';
import { PRICE_SIGNALS, PriceSignal } from '../data/price_signals';
import { intentGraph } from '../lib/intentGraph';

export const usePriceEngine = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshComplete, setRefreshComplete] = React.useState(false);

  const refreshLivePrices = async (destinationId: string) => {
    setIsRefreshing(true);
    setRefreshComplete(false);

    // Simulate market data harmonization
    await new Promise(resolve => setTimeout(resolve, 2500));

    const existingSignal = PRICE_SIGNALS[destinationId];
    if (existingSignal) {
      // Simulate a slight price fluctuation for realism
      const fluctuation = 1 + (Math.random() * 0.04 - 0.02); // +/- 2%
      
      const updatedSignal: PriceSignal = {
        ...existingSignal,
        isLive: true,
        lastUpdated: 'Just now',
        confidence: 0.92 + (Math.random() * 0.06),
        cheapestFlight: {
          ...existingSignal.cheapestFlight,
          price: Math.round(existingSignal.cheapestFlight.price * fluctuation)
        },
        bestValueHotel: {
          ...existingSignal.bestValueHotel,
          pricePerNight: Math.round(existingSignal.bestValueHotel.pricePerNight * fluctuation)
        }
      };

      // In a real app, this would update a global store or context
      // For this prototype, we'll just return it or update a local cache
      PRICE_SIGNALS[destinationId] = updatedSignal;
    }

    setIsRefreshing(false);
    setRefreshComplete(true);
    
    // Reset complete status after a few seconds
    setTimeout(() => setRefreshComplete(false), 3000);
    
    return PRICE_SIGNALS[destinationId];
  };

  return {
    isRefreshing,
    refreshComplete,
    refreshLivePrices
  };
};
