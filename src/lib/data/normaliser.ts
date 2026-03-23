interface RawPrice {
  state: string;
  fuelType: string;
  price: number;
  unit: "cents_per_litre" | "dollars_per_litre";
}

interface NormalisedPrice {
  state: string;
  fuelType: string;
  priceCents: number;
}

export function normalise(raw: RawPrice): NormalisedPrice {
  const priceCents =
    raw.unit === "dollars_per_litre" ? raw.price * 100 : raw.price;

  return {
    state: raw.state,
    fuelType: raw.fuelType,
    priceCents: Math.round(priceCents * 10) / 10,
  };
}

export function normaliseMany(prices: RawPrice[]): NormalisedPrice[] {
  return prices.map(normalise);
}
