"use client";

import { useState } from "react";
import { PAIN_COMPARISONS } from "@/content/comparisons";

interface PainIndexProps {
  priceCents: number;
}

const INITIAL_COUNT = 6;

export function PainIndex({ priceCents }: PainIndexProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? PAIN_COMPARISONS : PAIN_COMPARISONS.slice(0, INITIAL_COUNT);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2 text-center">
        The Pain Index&trade;
      </h2>
      <p className="text-[#888888] text-center mb-8">
        How much this is really costing you
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((comparison) => (
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

      {!showAll && PAIN_COMPARISONS.length > INITIAL_COUNT && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2.5 rounded-full border border-[#FF6B00] text-[#FF6B00] text-sm font-semibold hover:bg-[#FF6B00] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Show me more pain ({PAIN_COMPARISONS.length - INITIAL_COUNT} more)
          </button>
        </div>
      )}
    </section>
  );
}
