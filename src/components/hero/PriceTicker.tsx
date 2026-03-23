"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getPriceColor } from "@/lib/constants";

interface PriceTickerProps {
  priceCents: number;
  lastUpdated: string;
  fuelTypeLabel: string;
}

function Digit({ value, color }: { value: string; color: string }) {
  return (
    <span className="relative inline-block w-[0.65em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={`block font-mono font-bold ${color}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function PriceTicker({
  priceCents,
  lastUpdated,
  fuelTypeLabel,
}: PriceTickerProps) {
  const priceInDollars = (priceCents / 100).toFixed(2);
  const [dollars, cents] = priceInDollars.split(".");
  const color = getPriceColor(priceCents);

  const formattedTime = new Date(lastUpdated).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-baseline">
        <span className={`text-4xl md:text-6xl font-mono ${color}`}>$</span>
        <div className="text-7xl md:text-[120px] leading-none">
          {dollars.split("").map((d, i) => (
            <Digit key={`d-${i}`} value={d} color={color} />
          ))}
          <Digit value="." color={color} />
          {cents.split("").map((c, i) => (
            <Digit key={`c-${i}`} value={c} color={color} />
          ))}
        </div>
        <span
          className={`text-2xl md:text-4xl font-mono ml-2 self-end mb-2 ${color}`}
        >
          /L
        </span>
      </div>
      <div className="text-center">
        <p className="text-[#888888] text-sm">
          National Average — {fuelTypeLabel}
        </p>
        <p className="text-[#888888] text-xs mt-1">
          Last updated: {formattedTime}
        </p>
      </div>
    </div>
  );
}
