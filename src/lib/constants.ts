import { FuelType, StateCode } from "@/types";

export const STATES: { code: StateCode; name: string }[] = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "NT", name: "Northern Territory" },
  { code: "ACT", name: "Australian Capital Territory" },
];

export const FUEL_TYPES: FuelType[] = [
  "unleaded91",
  "diesel",
  "premium95",
  "premium98",
  "e10",
];

export function getPriceColor(priceCents: number): string {
  if (priceCents >= 300) return "text-red-500 animate-pulse";
  if (priceCents >= 260) return "text-red-500";
  if (priceCents >= 220) return "text-orange-500";
  if (priceCents >= 180) return "text-yellow-500";
  return "text-green-500";
}

export function getPriceBgIntensity(priceCents: number): string {
  if (priceCents >= 260) return "bg-red-500/20";
  if (priceCents >= 240) return "bg-orange-500/15";
  if (priceCents >= 220) return "bg-yellow-500/10";
  return "bg-green-500/10";
}

export const REFRESH_INTERVAL_MS = 60_000;
