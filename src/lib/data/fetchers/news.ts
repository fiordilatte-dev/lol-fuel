/**
 * Fetches Australian fuel crisis news from Google News RSS.
 * No API key needed — just RSS parsing.
 */

export interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

const SEARCH_QUERIES = [
  "Australia fuel price crisis",
  "Australia petrol price",
  "Australia diesel price",
  "Strait of Hormuz fuel Australia",
  "ACCC fuel investigation Australia",
  "fuel shortage Australia",
];

function extractFromCDATA(text: string): string {
  // Google News wraps content in CDATA: <![CDATA[...]]>
  const match = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : text;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function parseGoogleNewsRSS(xml: string): RawNewsItem[] {
  const items: RawNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);

    if (titleMatch && linkMatch) {
      const rawTitle = extractFromCDATA(titleMatch[1]);
      // Google News titles often end with " - Source Name"
      const cleanTitle = stripHtml(rawTitle);

      items.push({
        title: cleanTitle,
        link: extractFromCDATA(linkMatch[1]).trim(),
        pubDate: pubDateMatch
          ? extractFromCDATA(pubDateMatch[1]).trim()
          : new Date().toISOString(),
        source: sourceMatch
          ? stripHtml(extractFromCDATA(sourceMatch[1]))
          : "",
      });
    }
  }

  return items;
}

export async function fetchFuelNews(): Promise<RawNewsItem[]> {
  const allItems: RawNewsItem[] = [];
  const seenTitles = new Set<string>();

  // Fetch from multiple queries for broader coverage
  for (const query of SEARCH_QUERIES) {
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://news.google.com/rss/search?q=${encoded}+when:7d&hl=en-AU&gl=AU&ceid=AU:en`;
      const res = await fetch(url, {
        headers: { "User-Agent": "FuelWatch-AU/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseGoogleNewsRSS(xml);

      for (const item of items) {
        // Deduplicate by normalised title
        const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!seenTitles.has(normTitle)) {
          seenTitles.add(normTitle);
          allItems.push(item);
        }
      }
    } catch {
      // Individual query failure is fine, keep going
    }
  }

  return allItems;
}

/**
 * Filters news items to only fuel-related content.
 * Google News sometimes returns tangentially related results.
 */
export function filterFuelRelevant(items: RawNewsItem[]): RawNewsItem[] {
  const FUEL_KEYWORDS = [
    "fuel",
    "petrol",
    "diesel",
    "unleaded",
    "bowser",
    "servo",
    "oil price",
    "oil shock",
    "hormuz",
    "opec",
    "refinery",
    "accc",
    "fuel excise",
    "fuel tax",
    "fuel subsid",
    "litre",
    "gallon",
    "pump price",
    "price goug",
    "fuel crisis",
    "fuel shortage",
    "fuel supply",
    "petroleum",
    "gasoline",
    "jerry can",
    "panic buy",
  ];

  return items.filter((item) => {
    const text = `${item.title} ${item.source}`.toLowerCase();
    return FUEL_KEYWORDS.some((kw) => text.includes(kw));
  });
}
