import { StateCode, NationalPrices, StatePrices, FuelType } from "@/types";

interface PriceEntry {
  state: string;
  fuelType: string;
  priceCents: number;
}

export function aggregateByState(
  prices: PriceEntry[]
): Record<StateCode, StatePrices> {
  const stateMap = {} as Record<StateCode, StatePrices>;

  for (const entry of prices) {
    const state = entry.state as StateCode;
    if (!stateMap[state]) {
      stateMap[state] = {
        unleaded91: 0,
        diesel: 0,
        change24h: 0,
      };
    }
    (stateMap[state] as unknown as Record<string, number>)[entry.fuelType] =
      entry.priceCents;
  }

  return stateMap;
}

export function calculateNationalAverage(
  stateData: Record<StateCode, StatePrices>
): NationalPrices {
  const fuelTypes: FuelType[] = [
    "unleaded91",
    "diesel",
    "premium95",
    "premium98",
    "e10",
  ];
  const result = {} as Record<string, number>;

  for (const fuelType of fuelTypes) {
    const values = Object.values(stateData)
      .map((s) => (s as unknown as Record<string, number>)[fuelType])
      .filter((v): v is number => typeof v === "number" && v > 0);

    result[fuelType] =
      values.length > 0
        ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
        : 0;
  }

  return result as unknown as NationalPrices;
}
