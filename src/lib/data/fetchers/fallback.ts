import { StateCode } from "@/types";

interface FallbackFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

export async function fetchFallbackPrices(
  states: StateCode[]
): Promise<FallbackFuelPrice[]> {
  const apiKey = process.env.FUELPRICE_IO_API_KEY;
  if (!apiKey) {
    console.warn("FUELPRICE_IO_API_KEY not set, skipping fallback data source");
    return [];
  }

  try {
    const results: FallbackFuelPrice[] = [];

    for (const state of states) {
      const res = await fetch(
        `https://api.fuelprice.io/v1/prices?state=${state}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 0 },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      for (const entry of data.prices ?? []) {
        results.push({
          state,
          fuelType: entry.fuelType,
          price: entry.price,
          unit: "cents_per_litre",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch fallback prices:", error);
    return [];
  }
}
