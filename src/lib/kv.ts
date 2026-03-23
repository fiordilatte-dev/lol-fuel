import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// ----- Fuel Prices -----

const PRICES_KEY = "fuel:current_prices";
const PRICES_TTL = 60 * 20; // 20 minutes

export async function setCurrentPrices(data: unknown) {
  const r = getRedis();
  if (!r) throw new Error("Redis not configured");
  await r.set(PRICES_KEY, JSON.stringify(data), { ex: PRICES_TTL });
}

export async function getCurrentPrices(): Promise<unknown | null> {
  const r = getRedis();
  if (!r) return null;
  const raw = await r.get<string>(PRICES_KEY);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

// ----- Timeline Events -----

import { TimelineEvent } from "@/types";

const TIMELINE_KEY = "fuel:timeline_events";

export async function getTimelineEvents(): Promise<TimelineEvent[] | null> {
  const r = getRedis();
  if (!r) return null;
  const raw = await r.get<string>(TIMELINE_KEY);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function setTimelineEvents(events: TimelineEvent[]) {
  const r = getRedis();
  if (!r) throw new Error("Redis not configured");
  await r.set(TIMELINE_KEY, JSON.stringify(events));
}

export async function addTimelineEvent(event: TimelineEvent) {
  const existing = (await getTimelineEvents()) ?? [];
  existing.push(event);
  await setTimelineEvents(existing);
  return existing;
}

export async function deleteTimelineEvent(date: string, title: string) {
  const existing = (await getTimelineEvents()) ?? [];
  const filtered = existing.filter(
    (e) => !(e.date === date && e.title === title)
  );
  await setTimelineEvents(filtered);
  return filtered;
}
