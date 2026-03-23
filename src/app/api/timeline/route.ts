import { NextResponse } from "next/server";
import { getTimelineEvents, setTimelineEvents } from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";

// Public endpoint — no auth required
// Returns timeline events from Redis, falling back to static data
// Auto-seeds Redis on first request if empty
export async function GET() {
  let events = await getTimelineEvents();

  // Auto-seed: if Redis is available but empty, populate with static events
  if (!events || events.length === 0) {
    try {
      await setTimelineEvents(TIMELINE_EVENTS);
      events = TIMELINE_EVENTS;
    } catch {
      // Redis not configured — just use static
      events = TIMELINE_EVENTS;
    }
  }

  return NextResponse.json(
    { events },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
