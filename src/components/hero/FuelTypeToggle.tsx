"use client";

import { FuelType, FUEL_TYPE_LABELS } from "@/types";
import { FUEL_TYPES } from "@/lib/constants";

interface FuelTypeToggleProps {
  selected: FuelType;
  onSelect: (type: FuelType) => void;
}

export function FuelTypeToggle({ selected, onSelect }: FuelTypeToggleProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {FUEL_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === type
              ? "bg-[#FF6B00] text-white"
              : "bg-[#1A1A1A] text-[#888888] hover:bg-[#2A2A2A] hover:text-[#FAFAFA]"
          }`}
        >
          {FUEL_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
