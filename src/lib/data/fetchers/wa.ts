interface WAFuelPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre";
}

export async function fetchWAPrices(): Promise<WAFuelPrice[]> {
  try {
    const products = [
      { id: 1, fuelType: "unleaded91" },
      { id: 2, fuelType: "premium95" },
      { id: 4, fuelType: "diesel" },
      { id: 5, fuelType: "e10" },
    ];

    const results: WAFuelPrice[] = [];

    for (const product of products) {
      const res = await fetch(
        `https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?Product=${product.id}&StateRegion=Metro`,
        { next: { revalidate: 0 } }
      );

      if (!res.ok) continue;

      const text = await res.text();
      const priceMatches = text.match(/<price>(\d+\.?\d*)<\/price>/g);
      if (!priceMatches) continue;

      const prices = priceMatches.map((m) =>
        parseFloat(m.replace(/<\/?price>/g, ""))
      );

      const avg =
        Math.round(
          (prices.reduce((a, b) => a + b, 0) / prices.length) * 10
        ) / 10;

      results.push({
        state: "WA",
        fuelType: product.fuelType,
        price: avg,
        unit: "cents_per_litre",
      });
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch WA prices:", error);
    return [];
  }
}
