/**
 * Seed script to backfill historical fuel price data into Postgres.
 *
 * Usage: npx tsx scripts/seed-history.ts
 *
 * Requires POSTGRES_URL environment variable.
 */

// import { sql } from "@vercel/postgres";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const FUEL_TYPES = ["unleaded91", "diesel", "premium95", "premium98", "e10"];

const BASE_PRICES: Record<string, number> = {
  unleaded91: 220,
  diesel: 235,
  premium95: 245,
  premium98: 260,
  e10: 215,
};

async function seed() {
  console.log("Seeding historical fuel price data...");

  // Create table if it doesn't exist
  // await sql`
  //   CREATE TABLE IF NOT EXISTS fuel_prices (
  //     id            SERIAL PRIMARY KEY,
  //     state         VARCHAR(3) NOT NULL,
  //     fuel_type     VARCHAR(20) NOT NULL,
  //     price_cents   DECIMAL(5,1) NOT NULL,
  //     recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  //   )
  // `;
  // await sql`CREATE INDEX IF NOT EXISTS idx_prices_state_date ON fuel_prices(state, recorded_at DESC)`;

  const DAYS = 90;
  let count = 0;

  for (const state of STATES) {
    for (const fuelType of FUEL_TYPES) {
      const basePrice = BASE_PRICES[fuelType];
      const stateOffset = (Math.random() - 0.5) * 20;

      for (let day = DAYS; day >= 0; day--) {
        const trend = ((DAYS - day) / DAYS) * 30;
        const noise = (Math.random() - 0.5) * 10;
        const price =
          Math.round((basePrice + stateOffset + trend + noise) * 10) / 10;
        const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);

        // await sql`
        //   INSERT INTO fuel_prices (state, fuel_type, price_cents, recorded_at)
        //   VALUES (${state}, ${fuelType}, ${price}, ${date.toISOString()})
        // `;
        void date;
        void price;

        count++;
      }
    }
  }

  console.log(`Seeded ${count} records.`);
  console.log(
    "NOTE: Database operations are commented out. Uncomment when POSTGRES_URL is configured."
  );
}

seed().catch(console.error);
