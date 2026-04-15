import { Destination, Month, Occasion } from '../types';

export interface BudgetBreakdown {
  total: number;
  stay: number;
  food: number;
  transport: number;
  activities: number;
  buffer: number;
  multiplier: number;
}

export function calculateBudgetSummary(
  destination: Destination,
  numTravellers: number,
  travelMonth: Month,
  occasion?: Occasion
): BudgetBreakdown {
  const basePrice = (destination.priceINR || 0) * numTravellers;
  
  // 1. Seasonality Multiplier
  let seasonalityMultiplier = 1.0;
  const peakMonths: Month[] = ['December', 'January', 'May', 'June'];
  const offPeakMonths: Month[] = ['July', 'August', 'September'];
  
  if (peakMonths.includes(travelMonth)) {
    seasonalityMultiplier = 1.25; // 25% surge
  } else if (offPeakMonths.includes(travelMonth)) {
    seasonalityMultiplier = 0.85; // 15% discount
  }

  // 2. Occasion Multiplier (already in Occasion type)
  const occasionMultiplier = occasion?.budgetMultiplier || 1.0;
  
  const finalTotal = Math.round(basePrice * seasonalityMultiplier * occasionMultiplier);

  // 3. Breakdown percentages
  return {
    total: finalTotal,
    stay: Math.round(finalTotal * 0.40),
    food: Math.round(finalTotal * 0.25),
    transport: Math.round(finalTotal * 0.15),
    activities: Math.round(finalTotal * 0.15),
    buffer: Math.round(finalTotal * 0.05),
    multiplier: Number((seasonalityMultiplier * occasionMultiplier).toFixed(2))
  };
}
