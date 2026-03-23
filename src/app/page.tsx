"use client";

import { useState } from "react";
import { FuelType, FUEL_TYPE_LABELS } from "@/types";
import { useFuelPrices } from "@/hooks/useFuelPrices";
import { PriceTicker } from "@/components/hero/PriceTicker";
import { FuelTypeToggle } from "@/components/hero/FuelTypeToggle";
import { PriceChangeIndicator } from "@/components/hero/PriceChangeIndicator";
import { StateGrid } from "@/components/states/StateGrid";
import { HeadlineTicker } from "@/components/satire/HeadlineTicker";
import { PainIndex } from "@/components/satire/PainIndex";
import { BlameOMeter } from "@/components/satire/BlameOMeter";
import { Timeline } from "@/components/timeline/Timeline";
import { Container } from "@/components/ui/Container";
import { Stickers } from "@/components/satire/Stickers";

export default function Home() {
  const { prices, isLoading } = useFuelPrices();
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("unleaded91");

  if (isLoading || !prices) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-[#FF6B00] animate-pulse">
            $-.--
          </div>
          <p className="text-[#888888] mt-4">Loading prices...</p>
        </div>
      </div>
    );
  }

  const nationalPrice =
    prices.national[selectedFuel as keyof typeof prices.national];

  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center py-16 px-4 relative">
        <div className="flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold text-[#FF6B00] mb-8 tracking-tight">
            FuelWatch Australia
          </h1>
          <PriceTicker
            priceCents={nationalPrice}
            lastUpdated={prices.lastUpdated}
            fuelTypeLabel={FUEL_TYPE_LABELS[selectedFuel]}
          />
          <div className="mt-4">
            <PriceChangeIndicator
              change={
                Object.values(prices.states).reduce(
                  (sum, s) => sum + s.change24h,
                  0
                ) / Object.values(prices.states).length
              }
            />
          </div>
          <div className="mt-8">
            <FuelTypeToggle selected={selectedFuel} onSelect={setSelectedFuel} />
          </div>
        </div>

        {/* Stickers — right corner */}
        <div className="absolute right-4 lg:right-8 xl:right-16 top-1/2 -translate-y-1/2">
          <Stickers />
        </div>
      </section>

      {/* Headline Ticker */}
      <HeadlineTicker />

      {/* State Grid */}
      <Container className="py-12">
        <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6 text-center">
          State & Territory Prices
        </h2>
        <StateGrid states={prices.states} />
      </Container>

      {/* Pain Index */}
      <Container>
        <PainIndex priceCents={nationalPrice} />
      </Container>

      {/* Blame-O-Meter */}
      <Container>
        <BlameOMeter />
      </Container>

      {/* Timeline */}
      <Container>
        <Timeline />
      </Container>

      {/* Footer */}
      <footer className="border-t border-[#333333] mt-16 py-8">
        <Container>
          <div className="text-center text-sm text-[#888888] space-y-2">
            <p>
              Data sourced from NSW FuelCheck API, WA FuelWatch, QLD Open Data,
              and FuelPrice.io
            </p>
            <p className="text-xs max-w-2xl mx-auto">
              This site is satirical commentary. Fuel prices are sourced from
              government APIs and may have a delay of up to 15 minutes. We are
              not financial advisors. We cannot make fuel cheaper. Sorry.
            </p>
            <p className="text-xs text-[#FF6B00]">
              Made with tears and unleaded
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
