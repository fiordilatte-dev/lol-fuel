import { NextRequest, NextResponse } from "next/server";

// In production, use: import { getHistoricalPrices } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const state = searchParams.get("state") ?? "NSW";
  const fuelType = searchParams.get("fuelType") ?? "unleaded91";
  const days = parseInt(searchParams.get("days") ?? "30", 10);

  // Mock historical data for development
  const mockData = Array.from({ length: days }, (_, i) => ({
    price_cents: 230 + Math.random() * 30,
    recorded_at: new Date(
      Date.now() - (days - i) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));

  void state;
  void fuelType;

  return NextResponse.json({
    state,
    fuelType,
    days,
    data: mockData,
  });
}
