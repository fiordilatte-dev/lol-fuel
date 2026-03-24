import { getTimelineEvents } from "@/lib/kv";
import { TIMELINE_EVENTS } from "@/content/timeline";
import { HomePage } from "@/components/HomePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  let events = TIMELINE_EVENTS;
  try {
    const redisEvents = await getTimelineEvents();
    if (redisEvents && redisEvents.length > 0) {
      events = redisEvents;
    }
  } catch {
    // Fall back to static events
  }

  return <HomePage timelineEvents={events} />;
}
