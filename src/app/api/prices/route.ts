import { NextResponse } from "next/server";
import { FuelPriceData } from "@/types";

// Mock data for development — replaced by KV reads in production
const MOCK_DATA: FuelPriceData = {
  lastUpdated: new Date().toISOString(),
  national: {
    unleaded91: 247.8,
    diesel: 263.1,
    premium95: 271.4,
    premium98: 289.2,
    e10: 241.5,
  },
  states: {
    NSW: { unleaded91: 251.3, diesel: 267.8, change24h: 4.2 },
    VIC: { unleaded91: 248.1, diesel: 261.5, change24h: 3.8 },
    QLD: { unleaded91: 253.7, diesel: 270.2, change24h: 5.1 },
    WA: { unleaded91: 239.4, diesel: 255.8, change24h: 2.9 },
    SA: { unleaded91: 244.6, diesel: 259.3, change24h: 3.5 },
    TAS: { unleaded91: 256.2, diesel: 272.1, change24h: 6.0 },
    NT: { unleaded91: 261.8, diesel: 278.4, change24h: 4.7 },
    ACT: { unleaded91: 249.9, diesel: 265.2, change24h: 3.1 },
  },
  milestones: {
    daysAbove200: 47,
    daysAbove250: 12,
    allTimeHigh: 289.6,
    allTimeHighDate: "2026-03-19",
  },
};

export async function GET() {
  // In production, read from Vercel KV:
  // const data = await getCurrentPrices();
  // if (!data) return NextResponse.json({ error: "No data" }, { status: 503 });

  return NextResponse.json(MOCK_DATA, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
