import { NextResponse } from "next/server";
import { getTimelineEvents } from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";

// Public endpoint — no auth required
// Returns timeline events from Redis, falling back to static data
export async function GET() {
  const events = await getTimelineEvents();
  return NextResponse.json(
    { events: events ?? TIMELINE_EVENTS },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
