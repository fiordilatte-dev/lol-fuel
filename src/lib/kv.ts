import { kv } from "@vercel/kv";

export { kv };

const PRICES_KEY = "fuel:current_prices";
const PRICES_TTL = 60 * 20; // 20 minutes

export async function setCurrentPrices(data: unknown) {
  await kv.set(PRICES_KEY, JSON.stringify(data), { ex: PRICES_TTL });
}

export async function getCurrentPrices(): Promise<unknown | null> {
  const raw = await kv.get<string>(PRICES_KEY);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}
