import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type CostBasis = 'per_person' | 'total';

const TOOLTIP_TEXT =
  'Estimated cost includes flights from your region + mid-range accommodation. Actual prices may vary.';

export function EstimatedCost({
  amountINR,
  costBasis,
  numTravellers,
  className,
  textClassName,
}: {
  amountINR: number;
  costBasis: CostBasis;
  numTravellers: number;
  className?: string;
  textClassName?: string;
}) {
  const amount = `₹${amountINR.toLocaleString()}`;

  const qualifier =
    costBasis === 'per_person'
      ? `${amount} est. per person`
      : `${amount} est. total (${numTravellers} travellers)`;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={textClassName}>{qualifier}</span>
      <span className="group relative inline-flex">
        <Info
          className="w-3.5 h-3.5 text-zinc-300/80 hover:text-zinc-200 transition-colors"
          aria-label="Estimated cost info"
        />
        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[260px] -translate-x-1/2 rounded-xl border border-white/10 bg-black/90 px-3 py-2 text-[10px] font-medium leading-relaxed text-zinc-200 opacity-0 shadow-2xl backdrop-blur-sm transition-opacity group-hover:opacity-100">
          {TOOLTIP_TEXT}
        </span>
      </span>
    </span>
  );
}

