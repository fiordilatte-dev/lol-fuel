import { sql } from "@vercel/postgres";

export { sql };

export async function recordPrice(
  state: string,
  fuelType: string,
  priceCents: number
) {
  await sql`
    INSERT INTO fuel_prices (state, fuel_type, price_cents)
    VALUES (${state}, ${fuelType}, ${priceCents})
  `;
}

export async function getHistoricalPrices(
  state: string,
  fuelType: string,
  days: number = 30
) {
  const result = await sql`
    SELECT price_cents, recorded_at
    FROM fuel_prices
    WHERE state = ${state}
      AND fuel_type = ${fuelType}
      AND recorded_at >= NOW() - INTERVAL '1 day' * ${days}
    ORDER BY recorded_at ASC
  `;
  return result.rows;
}
