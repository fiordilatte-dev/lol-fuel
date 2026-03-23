"use client";

import { StateCode, StatePrices } from "@/types";
import { getPriceBgIntensity } from "@/lib/constants";
import { PriceChangeIndicator } from "@/components/hero/PriceChangeIndicator";
import { Sparkline } from "./Sparkline";

interface StateCardProps {
  stateCode: StateCode;
  prices: StatePrices;
  sparklineData?: number[];
}

export function StateCard({ stateCode, prices, sparklineData }: StateCardProps) {
  return (
    <div
      className={`rounded-xl border border-[#333333] p-4 transition-colors hover:border-[#FF6B00]/50 ${getPriceBgIntensity(prices.unleaded91)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-[#FAFAFA]">{stateCode}</h3>
        <PriceChangeIndicator change={prices.change24h} />
      </div>
      <div className="text-3xl font-mono font-bold text-[#FAFAFA] mb-2">
        {(prices.unleaded91 / 100).toFixed(1)}
        <span className="text-base text-[#888888] ml-1">¢/L</span>
      </div>
      {sparklineData && (
        <div className="mt-2">
          <Sparkline data={sparklineData} />
        </div>
      )}
    </div>
  );
}
