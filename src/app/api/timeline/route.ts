import { NextResponse } from "next/server";
import { getTimelineEvents, setTimelineEvents } from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";
import { TimelineEvent } from "@/types";

// Public endpoint — no auth required
// Returns timeline events from Redis, falling back to static data
// Auto-seeds Redis on first request if empty
export async function GET() {
  let events: TimelineEvent[] | null = null;
  let source = "unknown";

  try {
    events = await getTimelineEvents();
    source = events ? `redis(${events.length})` : "redis-empty";
  } catch (err) {
    source = `redis-error: ${err instanceof Error ? err.message : String(err)}`;
  }

  // Auto-seed or fallback
  if (!events || events.length === 0) {
    try {
      await setTimelineEvents(TIMELINE_EVENTS);
      events = TIMELINE_EVENTS;
      source += " -> seeded-static";
    } catch {
      events = TIMELINE_EVENTS;
      source += " -> fallback-static";
    }
  }

  console.log(`[timeline] source=${source}, count=${events.length}`);

  return NextResponse.json(
    { events },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Timeline-Source": source,
      },
    }
  );
}
