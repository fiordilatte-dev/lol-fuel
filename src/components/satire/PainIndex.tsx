"use client";

import { PAIN_COMPARISONS } from "@/content/comparisons";

interface PainIndexProps {
  priceCents: number;
}

export function PainIndex({ priceCents }: PainIndexProps) {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2 text-center">
        The Pain Index&trade;
      </h2>
      <p className="text-[#888888] text-center mb-8">
        How much this is really costing you
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAIN_COMPARISONS.map((comparison) => (
          <div
            key={comparison.label}
            className="rounded-xl border border-[#333333] bg-[#1A1A1A] p-6"
          >
            <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-1">
              {comparison.label}
            </h3>
            <p className="text-2xl font-mono font-bold text-[#FF6B00] mb-2">
              {comparison.calculate(priceCents)}
            </p>
            <p className="text-xs text-[#888888]">{comparison.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
