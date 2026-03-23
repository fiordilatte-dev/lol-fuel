interface QLDFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

export async function fetchQLDPrices(): Promise<QLDFuelPrice[]> {
  try {
    const res = await fetch(
      "https://data.qld.gov.au/api/3/action/datastore_search?resource_id=fuel-price-resource-id&limit=1000",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      console.error(`QLD API returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    const records = data?.result?.records ?? [];

    const fuelTypeMap: Record<string, string> = {
      "Unleaded 91": "unleaded91",
      "Premium 95": "premium95",
      "Premium 98": "premium98",
      Diesel: "diesel",
      E10: "e10",
    };

    const pricesByFuelType: Record<string, number[]> = {};

    for (const record of records) {
      const fuelType = fuelTypeMap[record.FuelType];
      if (!fuelType) continue;
      const price = parseFloat(record.Price);
      if (isNaN(price)) continue;
      if (!pricesByFuelType[fuelType]) pricesByFuelType[fuelType] = [];
      pricesByFuelType[fuelType].push(price);
    }

    return Object.entries(pricesByFuelType).map(([fuelType, prices]) => ({
      state: "QLD",
      fuelType,
      price:
        Math.round(
          (prices.reduce((a, b) => a + b, 0) / prices.length) * 10
        ) / 10,
      unit: "cents_per_litre" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch QLD prices:", error);
    return [];
  }
}
