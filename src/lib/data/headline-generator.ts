/**
 * Generates satirical/editorial timeline entries from raw news items.
 * No LLM needed — uses keyword matching and templates to add Australian
 * flavour to real headlines.
 */

import { TimelineEvent } from "@/types";
import { RawNewsItem } from "./fetchers/news";

interface HeadlineTemplate {
  match: (title: string, source: string) => boolean;
  type: TimelineEvent["type"];
  transform: (item: RawNewsItem) => { title: string; description: string };
}

const TEMPLATES: HeadlineTemplate[] = [
  {
    match: (t) => /record|all.time|highest|new high/i.test(t),
    type: "milestone",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}Another record nobody asked for. Your commute just got more expensive again.`,
    }),
  },
  {
    match: (t) => /accc|investigation|inquiry|watchdog|regulat/i.test(t),
    type: "policy",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}The adults are looking into it. Fuel companies have been asked to please explain. They will not.`,
    }),
  },
  {
    match: (t) =>
      /minister|government|albanese|chalmers|bowen|pm |prime minister|treasurer/i.test(
        t
      ),
    type: "quote",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}Another press conference, another appeal to the vibes. Meanwhile, your tank is still empty.`,
    }),
  },
  {
    match: (t) => /hormuz|iran|oil|opec|global|supply|shortage/i.test(t),
    type: "event",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}Geopolitics continues to happen, and Australia continues to have approximately two refineries.`,
    }),
  },
  {
    match: (t) => /panic|jerry can|queue|rationing|hoarding/i.test(t),
    type: "event",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}The nation collectively discovers what "just in time supply chains" means the hard way.`,
    }),
  },
  {
    match: (t) => /price|cost|expensive|cents|dollar|\$/i.test(t),
    type: "milestone",
    transform: (item) => ({
      title: item.title.replace(/ [-–—] .*$/, ""),
      description: `${item.source ? `Via ${item.source}. ` : ""}Bowser sticker shock continues. Thoughts and prayers to your wallet.`,
    }),
  },
];

// Default template for anything fuel-related that doesn't match specifics
const DEFAULT_TEMPLATE: HeadlineTemplate = {
  match: () => true,
  type: "event",
  transform: (item) => ({
    title: item.title.replace(/ [-–—] .*$/, ""),
    description: `${item.source ? `Via ${item.source}. ` : ""}The fuel situation develops further. Australians continue to stare at bowsers in quiet disbelief.`,
  }),
};

export function generateTimelineEvent(item: RawNewsItem): TimelineEvent {
  const template =
    TEMPLATES.find((t) => t.match(item.title, item.source)) ??
    DEFAULT_TEMPLATE;

  const { title, description } = template.transform(item);
  const date = new Date(item.pubDate).toISOString().split("T")[0];

  return {
    date,
    title,
    description,
    type: template.type,
    link: item.link,
  };
}

/**
 * Generate timeline events from news items, deduplicating against
 * existing events by checking for similar titles.
 */
export function generateNewEvents(
  newsItems: RawNewsItem[],
  existingEvents: TimelineEvent[]
): TimelineEvent[] {
  const existingNorm = new Set(
    existingEvents.map((e) => normaliseForComparison(e.title))
  );

  const newEvents: TimelineEvent[] = [];

  for (const item of newsItems) {
    const candidate = generateTimelineEvent(item);
    const norm = normaliseForComparison(candidate.title);

    // Skip if we already have something very similar
    if (existingNorm.has(norm)) continue;

    // Also check for partial overlap (>60% word match)
    const isDuplicate = [...existingNorm].some(
      (existing) => wordOverlap(norm, existing) > 0.6
    );
    if (isDuplicate) continue;

    existingNorm.add(norm);
    newEvents.push(candidate);
  }

  // Return max 5 newest items per run to avoid flooding
  return newEvents.slice(0, 5);
}

function normaliseForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordOverlap(a: string, b: string): number {
  const wordsA = new Set(a.split(" "));
  const wordsB = new Set(b.split(" "));
  const intersection = [...wordsA].filter((w) => wordsB.has(w));
  const smaller = Math.min(wordsA.size, wordsB.size);
  return smaller === 0 ? 0 : intersection.length / smaller;
}
