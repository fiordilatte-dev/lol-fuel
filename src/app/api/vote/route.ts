import { NextRequest, NextResponse } from "next/server";
import { BlameTarget, BlameVotes } from "@/types";

// In-memory store for development. In production, use Vercel KV.
const votes: Record<string, number> = {
  "Federal Government": 42,
  "State Governments": 28,
  "OPEC+": 67,
  "Oil Companies": 89,
  "The Strait of Hormuz": 35,
  "The Last Guy": 53,
  "Millennials (for some reason)": 21,
};

export async function GET() {
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const response: BlameVotes = {
    votes: votes as Record<BlameTarget, number>,
    totalVotes,
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const target = body.target as string;

  if (target && target in votes) {
    votes[target]++;
  }

  return NextResponse.json({ success: true });
}
