import { NextRequest, NextResponse } from "next/server";
import {
  getTimelineEvents,
  setTimelineEvents,
  addTimelineEvent,
  deleteTimelineEvent,
} from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";
import { TimelineEvent } from "@/types";

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

// GET — return all timeline events (Redis → static fallback)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const events = await getTimelineEvents();
  return NextResponse.json({ events: events ?? TIMELINE_EVENTS });
}

// POST — add or seed timeline events
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Seed: POST { action: "seed" } — writes static events to Redis
  if (body.action === "seed") {
    await setTimelineEvents(TIMELINE_EVENTS);
    return NextResponse.json({
      message: "Seeded",
      count: TIMELINE_EVENTS.length,
    });
  }

  // Add single event: POST { event: { ... } }
  const event = body.event as TimelineEvent;
  if (
    !event ||
    !event.date ||
    !event.title ||
    !event.description ||
    !event.type
  ) {
    return NextResponse.json(
      { error: "Missing required fields: date, title, description, type" },
      { status: 400 }
    );
  }
  const updated = await addTimelineEvent(event);
  return NextResponse.json({ events: updated });
}

// DELETE — remove a timeline event by date + title
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.date || !body.title) {
    return NextResponse.json(
      { error: "Missing required fields: date, title" },
      { status: 400 }
    );
  }
  const updated = await deleteTimelineEvent(body.date, body.title);
  return NextResponse.json({ events: updated });
}
