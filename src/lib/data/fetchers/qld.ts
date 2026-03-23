interface QLDFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

// QLD Open Data resource IDs by year — update when new datasets are published
const RESOURCE_IDS: Record<number, string> = {
  2026: "f013457b-fd77-4cf0-91e7-28ef983d8c3c",
  2025: "7d7c353b-9fa9-4fd1-ba31-9b72bbe2262a",
};

export async function fetchQLDPrices(): Promise<QLDFuelPrice[]> {
  try {
    // Use the current year's resource, falling back to most recent available
    const year = new Date().getFullYear();
    const resourceId = RESOURCE_IDS[year] ?? RESOURCE_IDS[2026];

    // Fetch only recent records (last 7 days) to get current prices
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const url = new URL(
      "https://www.data.qld.gov.au/api/3/action/datastore_search"
    );
    url.searchParams.set("resource_id", resourceId);
    url.searchParams.set("limit", "5000");
    url.searchParams.set(
      "filters",
      JSON.stringify({ Site_State: "QLD" })
    );
    // Get most recent records by sorting descending
    url.searchParams.set("sort", "TransactionDateutc desc");

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });

    if (!res.ok) {
      console.error(`QLD API returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    const records = data?.result?.records ?? [];

    // QLD data uses these fuel type names
    const fuelTypeMap: Record<string, string> = {
      Unleaded: "unleaded91",
      "PULP 95/96 RON": "premium95",
      "PULP 98 RON": "premium98",
      Diesel: "diesel",
      e10: "e10",
    };

    const pricesByFuelType: Record<string, number[]> = {};

    for (const record of records) {
      const fuelType = fuelTypeMap[record.Fuel_Type];
      if (!fuelType) continue;

      // QLD prices are in tenths of a cent (e.g. 1850 = 185.0 cpl)
      const price = parseFloat(record.Price);
      if (isNaN(price)) continue;

      const priceCents = price / 10;

      // Only include recent records
      if (
        record.TransactionDateutc &&
        record.TransactionDateutc.split("T")[0] < sevenDaysAgo
      ) {
        continue;
      }

      if (!pricesByFuelType[fuelType]) pricesByFuelType[fuelType] = [];
      pricesByFuelType[fuelType].push(priceCents);
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
