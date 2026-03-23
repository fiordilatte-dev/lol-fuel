"use client";

import { StateCode, StatePrices } from "@/types";
import { STATES } from "@/lib/constants";
import { StateCard } from "./StateCard";

interface StateGridProps {
  states: Record<StateCode, StatePrices>;
}

export function StateGrid({ states }: StateGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATES.map(({ code }) => {
        const prices = states[code];
        if (!prices) return null;
        return <StateCard key={code} stateCode={code} prices={prices} />;
      })}
    </div>
  );
}
