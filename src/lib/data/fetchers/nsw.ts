interface NSWFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

export async function fetchNSWPrices(): Promise<NSWFuelPrice[]> {
  const apiKey = process.env.NSW_FUEL_API_KEY;
  if (!apiKey) {
    console.warn("NSW_FUEL_API_KEY not set, skipping NSW data source");
    return [];
  }

  try {
    const res = await fetch(
      "https://api.nsw.gov.au/v1/fuel/prices/currentprices",
      {
        headers: {
          apikey: apiKey,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.error(`NSW API returned ${res.status}`);
      return [];
    }

    const data = await res.json();

    const fuelTypeMap: Record<string, string> = {
      E10: "e10",
      U91: "unleaded91",
      P95: "premium95",
      P98: "premium98",
      DL: "diesel",
    };

    const pricesByFuelType: Record<string, number[]> = {};

    for (const station of data.prices ?? []) {
      const fuelType = fuelTypeMap[station.fueltype];
      if (!fuelType) continue;
      if (!pricesByFuelType[fuelType]) pricesByFuelType[fuelType] = [];
      pricesByFuelType[fuelType].push(station.price);
    }

    return Object.entries(pricesByFuelType).map(([fuelType, prices]) => ({
      state: "NSW",
      fuelType,
      price:
        Math.round(
          (prices.reduce((a, b) => a + b, 0) / prices.length) * 10
        ) / 10,
      unit: "cents_per_litre" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch NSW prices:", error);
    return [];
  }
}
