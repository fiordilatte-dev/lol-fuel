"use client";

import { BlameTarget } from "@/types";
import { useBlameVote } from "@/hooks/useBlameVote";

const BLAME_TARGETS: BlameTarget[] = [
  "Federal Government",
  "State Governments",
  "OPEC+",
  "Oil Companies",
  "The Strait of Hormuz",
  "The Last Guy",
  "Millennials (for some reason)",
];

export function BlameOMeter() {
  const { votes, vote, hasVoted } = useBlameVote();

  const maxVotes = votes
    ? Math.max(...Object.values(votes.votes), 1)
    : 1;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2 text-center">
        Political Blame-O-Meter&trade;
      </h2>
      <p className="text-[#888888] text-center mb-8">
        Who&apos;s fault is it? Cast your vote.
      </p>
      <div className="max-w-xl mx-auto space-y-3">
        {BLAME_TARGETS.map((target) => {
          const count = votes?.votes[target] ?? 0;
          const percentage = votes ? (count / maxVotes) * 100 : 0;

          return (
            <button
              key={target}
              onClick={() => vote(target)}
              disabled={hasVoted}
              className="w-full text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#FAFAFA]">{target}</span>
                {votes && (
                  <span className="text-xs text-[#888888] font-mono">
                    {count} votes
                  </span>
                )}
              </div>
              <div className="w-full h-6 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#333333]">
                <div
                  className="h-full bg-[#FF6B00] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
        {hasVoted && (
          <p className="text-center text-sm text-[#888888] mt-4">
            Thanks for voting! Democracy in action.
          </p>
        )}
      </div>
    </section>
  );
}
