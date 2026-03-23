"use client";

import useSWR from "swr";
import { BlameTarget, BlameVotes } from "@/types";
import { useCallback, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBlameVote() {
  const { data, mutate } = useSWR<BlameVotes>("/api/vote", fetcher);
  const [hasVoted, setHasVoted] = useState(false);

  const vote = useCallback(
    async (target: BlameTarget) => {
      if (hasVoted) return;

      setHasVoted(true);
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      mutate();
    },
    [hasVoted, mutate]
  );

  return {
    votes: data,
    vote,
    hasVoted,
  };
}
