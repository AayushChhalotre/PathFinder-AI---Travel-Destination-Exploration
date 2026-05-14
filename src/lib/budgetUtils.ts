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

export interface BudgetScenario {
  id: string;
  title: string;
  description: string;
  total: number;
  savings: number;
  adjustments: {
    month?: Month;
    occasion?: Occasion;
    duration?: number;
    accommodationTier?: 'Standard' | 'Comfort' | 'Luxury';
  };
}

export function calculateBudgetSummary(
  destination: Destination,
  numTravellers: number,
  travelMonth: Month,
  occasion?: Occasion,
  tier: 'Standard' | 'Comfort' | 'Luxury' = 'Luxury'
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

  // 3. Tier Multiplier
  let tierMultiplier = 1.0;
  if (tier === 'Standard') tierMultiplier = 0.7;
  if (tier === 'Comfort') tierMultiplier = 0.85;
  
  const combinedMultiplier = seasonalityMultiplier * occasionMultiplier * tierMultiplier;
  const finalTotal = Math.round(basePrice * combinedMultiplier);

  // 4. Breakdown percentages
  return {
    total: finalTotal,
    stay: Math.round(finalTotal * 0.40),
    food: Math.round(finalTotal * 0.25),
    transport: Math.round(finalTotal * 0.15),
    activities: Math.round(finalTotal * 0.15),
    buffer: Math.round(finalTotal * 0.05),
    multiplier: Number(combinedMultiplier.toFixed(2))
  };
}

export function generateScenarios(
  destination: Destination,
  numTravellers: number,
  currentMonth: Month,
  currentOccasion?: Occasion,
  budgetLimit: number = 0,
  currentTier: 'Standard' | 'Comfort' | 'Luxury' = 'Luxury',
  additionalCosts: number = 0
): BudgetScenario[] {
  const currentSummary = calculateBudgetSummary(destination, numTravellers, currentMonth, currentOccasion, currentTier);
  const currentTotal = currentSummary.total + additionalCosts;
  const scenarios: BudgetScenario[] = [];

  // 1. Scenario: Shift to Off-Peak
  const offPeakMonths: Month[] = ['July', 'August', 'September'];
  if (!offPeakMonths.includes(currentMonth)) {
    const offPeakMonth = offPeakMonths[0]; // Suggest the first off-peak month
    const offPeakSummary = calculateBudgetSummary(destination, numTravellers, offPeakMonth, currentOccasion, currentTier);
    const offPeakTotal = offPeakSummary.total + additionalCosts;
    
    if (offPeakTotal < currentTotal) {
      scenarios.push({
        id: 'off-peak',
        title: 'The Season Switch',
        description: `Moving your voyage to ${offPeakMonth} unlocks off-peak serenity and significant savings.`,
        total: offPeakTotal,
        savings: currentTotal - offPeakTotal,
        adjustments: { month: offPeakMonth }
      });
    }
  }

  // 2. Scenario: Moderate Refinement (Tier)
  if (currentTier !== 'Comfort' && currentTier !== 'Standard') {
    const refinedSummary = calculateBudgetSummary(destination, numTravellers, currentMonth, currentOccasion, 'Comfort');
    const refinedTotal = refinedSummary.total + additionalCosts;
    scenarios.push({
      id: 'refined',
      title: 'The Balanced Path',
      description: "Prioritizing experience over extravagance by choosing curated comfort options.",
      total: refinedTotal,
      savings: currentTotal - refinedTotal,
      adjustments: { accommodationTier: 'Comfort' }
    });
  }

  // 3. Scenario: The Essentials
  if (currentTier !== 'Standard') {
    const essentialSummary = calculateBudgetSummary(destination, numTravellers, currentMonth, currentOccasion, 'Standard');
    const essentialTotal = essentialSummary.total + additionalCosts;
    scenarios.push({
      id: 'essential',
      title: 'The Essential Magic',
      description: "Stripping back to the core wonder of the destination while respecting your map.",
      total: essentialTotal,
      savings: currentTotal - essentialTotal,
      adjustments: { accommodationTier: 'Standard' }
    });
  }

  return scenarios;
}
