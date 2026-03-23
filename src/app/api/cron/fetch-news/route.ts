import { NextRequest, NextResponse } from "next/server";
import { fetchFuelNews, filterFuelRelevant } from "@/lib/data/fetchers/news";
import { generateNewEvents } from "@/lib/data/headline-generator";
import { getTimelineEvents, setTimelineEvents } from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify cron secret in production
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // 1. Fetch latest news from Google News RSS
    const rawNews = await fetchFuelNews();
    const relevant = filterFuelRelevant(rawNews);

    // 2. Get existing timeline events (Redis → static fallback)
    const existing = (await getTimelineEvents()) ?? TIMELINE_EVENTS;

    // 3. Generate new events, deduplicating against existing
    const newEvents = generateNewEvents(relevant, existing);

    if (newEvents.length === 0) {
      return NextResponse.json({
        message: "No new articles found",
        totalScanned: rawNews.length,
        relevant: relevant.length,
        added: 0,
      });
    }

    // 4. Merge and save
    const updated = [...existing, ...newEvents];
    await setTimelineEvents(updated);

    return NextResponse.json({
      message: `Added ${newEvents.length} new timeline events`,
      totalScanned: rawNews.length,
      relevant: relevant.length,
      added: newEvents.length,
      newEvents: newEvents.map((e) => ({ date: e.date, title: e.title })),
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
