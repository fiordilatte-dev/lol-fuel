import { NextRequest, NextResponse } from "next/server";
import { fetchNSWPrices } from "@/lib/data/fetchers/nsw";
import { fetchWAPrices } from "@/lib/data/fetchers/wa";
import { fetchQLDPrices } from "@/lib/data/fetchers/qld";
import { fetchFallbackPrices } from "@/lib/data/fetchers/fallback";
import { normaliseMany } from "@/lib/data/normaliser";
import {
  aggregateByState,
  calculateNationalAverage,
} from "@/lib/data/aggregator";
import { setCurrentPrices } from "@/lib/kv";
import { FuelPriceData, StateCode } from "@/types";

// Mock data for states we can't fetch live data for
const MOCK_STATE_PRICES: Partial<Record<StateCode, Record<string, number>>> = {
  VIC: { unleaded91: 248.1, diesel: 261.5, premium95: 268.3, premium98: 285.1, e10: 240.2 },
  SA: { unleaded91: 244.6, diesel: 259.3, premium95: 264.8, premium98: 281.5, e10: 237.9 },
  TAS: { unleaded91: 256.2, diesel: 272.1, premium95: 276.4, premium98: 293.7, e10: 249.1 },
  NT: { unleaded91: 261.8, diesel: 278.4, premium95: 282.1, premium98: 299.5, e10: 254.3 },
  ACT: { unleaded91: 249.9, diesel: 265.2, premium95: 269.7, premium98: 286.9, e10: 242.8 },
};

export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(
      "Cron job: fetch-prices triggered at",
      new Date().toISOString()
    );

    // Fetch from all available data sources concurrently
    // WA and QLD require no API keys — they always run
    // NSW and Fallback only run if API keys are configured
    const coveredStates = new Set<StateCode>();
    const sources: string[] = [];

    const [nswPrices, waPrices, qldPrices] = await Promise.all([
      fetchNSWPrices().catch((e) => {
        console.error("NSW fetch failed:", e);
        return [];
      }),
      fetchWAPrices().catch((e) => {
        console.error("WA fetch failed:", e);
        return [];
      }),
      fetchQLDPrices().catch((e) => {
        console.error("QLD fetch failed:", e);
        return [];
      }),
    ]);

    if (nswPrices.length > 0) {
      sources.push("NSW FuelCheck");
      coveredStates.add("NSW");
    }
    if (waPrices.length > 0) {
      sources.push("WA FuelWatch");
      coveredStates.add("WA");
    }
    if (qldPrices.length > 0) {
      sources.push("QLD Open Data");
      coveredStates.add("QLD");
    }

    // Determine which states still need data and try the fallback API
    const allStates: StateCode[] = [
      "NSW",
      "VIC",
      "QLD",
      "WA",
      "SA",
      "TAS",
      "NT",
      "ACT",
    ];
    const missingStates = allStates.filter((s) => !coveredStates.has(s));

    let fallbackPrices: Awaited<ReturnType<typeof fetchFallbackPrices>> = [];
    if (missingStates.length > 0) {
      fallbackPrices = await fetchFallbackPrices(missingStates).catch((e) => {
        console.error("Fallback fetch failed:", e);
        return [];
      });
      if (fallbackPrices.length > 0) {
        sources.push("FuelPrice.io");
        for (const p of fallbackPrices) {
          coveredStates.add(p.state as StateCode);
        }
      }
    }

    // Combine all live raw prices
    const allRawPrices = [
      ...nswPrices,
      ...waPrices,
      ...qldPrices,
      ...fallbackPrices,
    ];

    // Normalise all prices to cents per litre
    const normalised = normaliseMany(allRawPrices);

    // Add mock data for any states we still couldn't fetch
    const stillMissing = allStates.filter((s) => !coveredStates.has(s));
    for (const state of stillMissing) {
      const mockPrices = MOCK_STATE_PRICES[state];
      if (mockPrices) {
        for (const [fuelType, price] of Object.entries(mockPrices)) {
          normalised.push({ state, fuelType, priceCents: price });
        }
        sources.push(`mock:${state}`);
      }
    }

    // Aggregate by state and calculate national averages
    const stateData = aggregateByState(normalised);
    const national = calculateNationalAverage(stateData);

    // Build the final data payload
    const data: FuelPriceData = {
      lastUpdated: new Date().toISOString(),
      national,
      states: stateData,
      milestones: {
        daysAbove200: calculateDaysAbove(national.unleaded91, 200),
        daysAbove250: calculateDaysAbove(national.unleaded91, 250),
        allTimeHigh: Math.max(
          national.unleaded91,
          national.diesel,
          national.premium95,
          national.premium98,
          national.e10
        ),
        allTimeHighDate: new Date().toISOString().split("T")[0],
      },
    };

    // Store in KV if available, otherwise just return the data
    try {
      await setCurrentPrices(data);
      console.log("Prices cached to KV");
    } catch (kvError) {
      console.warn(
        "KV not available, prices returned but not cached:",
        kvError
      );
    }

    return NextResponse.json({
      success: true,
      message: "Prices updated",
      sources,
      liveStates: [...coveredStates],
      mockStates: stillMissing,
      timestamp: data.lastUpdated,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}

function calculateDaysAbove(currentPrice: number, threshold: number): number {
  // Simple estimate — in production this would query historical data
  if (currentPrice <= threshold) return 0;
  // Rough estimate based on how far above the threshold
  return Math.min(Math.floor((currentPrice - threshold) / 2) + 1, 365);
}
