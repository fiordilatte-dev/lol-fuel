interface NSWFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

async function getAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string | null> {
  try {
    const res = await fetch(
      "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
      }
    );

    if (!res.ok) {
      console.error(`NSW OAuth returned ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.access_token ?? null;
  } catch (error) {
    console.error("Failed to get NSW access token:", error);
    return null;
  }
}

export async function fetchNSWPrices(): Promise<NSWFuelPrice[]> {
  const clientId = process.env.NSW_FUEL_API_KEY;
  const clientSecret = process.env.NSW_FUEL_API_SECRET;

  if (!clientId || !clientSecret) {
    console.warn(
      "NSW_FUEL_API_KEY or NSW_FUEL_API_SECRET not set, skipping NSW data source"
    );
    return [];
  }

  try {
    // Step 1: Get OAuth access token
    const accessToken = await getAccessToken(clientId, clientSecret);
    if (!accessToken) {
      console.error("Could not obtain NSW access token");
      return [];
    }

    // Step 2: Fetch all fuel prices
    const res = await fetch(
      "https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          apikey: clientId,
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
      PDL: "diesel",
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
