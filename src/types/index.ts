export type FuelType = "unleaded91" | "diesel" | "premium95" | "premium98" | "e10";

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  unleaded91: "ULP 91",
  diesel: "Diesel",
  premium95: "Premium 95",
  premium98: "Premium 98",
  e10: "E10",
};

export type StateCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export interface StatePrices {
  unleaded91: number;
  diesel: number;
  premium95?: number;
  premium98?: number;
  e10?: number;
  change24h: number;
}

export interface NationalPrices {
  unleaded91: number;
  diesel: number;
  premium95: number;
  premium98: number;
  e10: number;
}

export interface Milestones {
  daysAbove200: number;
  daysAbove250: number;
  allTimeHigh: number;
  allTimeHighDate: string;
}

export interface FuelPriceData {
  lastUpdated: string;
  national: NationalPrices;
  states: Record<StateCode, StatePrices>;
  milestones: Milestones;
}

export type BlameTarget =
  | "Federal Government"
  | "State Governments"
  | "OPEC+"
  | "Oil Companies"
  | "The Strait of Hormuz"
  | "The Last Guy"
  | "Millennials (for some reason)";

export interface BlameVotes {
  votes: Record<BlameTarget, number>;
  totalVotes: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "policy" | "quote" | "event";
}

export interface PainComparison {
  label: string;
  description: string;
  calculate: (pricePerLitre: number) => string;
}
