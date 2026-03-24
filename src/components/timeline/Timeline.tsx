"use client";

import useSWR from "swr";
import { TIMELINE_EVENTS } from "@/content/timeline";
import { TimelineEvent } from "@/types";

const TYPE_COLORS = {
  milestone: "border-[#FF6B00]",
  policy: "border-blue-500",
  quote: "border-yellow-500",
  event: "border-red-500",
};

const TYPE_LABELS = {
  milestone: "Milestone",
  policy: "Policy",
  quote: "Quote",
  event: "Event",
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

export function Timeline() {
  const { data } = useSWR<{ events: TimelineEvent[] }>(
    "/api/timeline",
    fetcher,
    {
      fallbackData: { events: TIMELINE_EVENTS },
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const events = data?.events ?? TIMELINE_EVENTS;

  // Sort most recent first
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2 text-center">
        How Did We Get Here?
      </h2>
      <p className="text-[#888888] text-center mb-8">
        A timeline of Australia&apos;s fuel crisis
      </p>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[#333333]" />
        <div className="space-y-8">
          {sorted.map((event, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#FF6B00]" />
              <div
                className={`border-l-2 ${TYPE_COLORS[event.type]} pl-4 pb-2`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <time className="text-xs font-mono text-[#888888]">
                    {new Date(event.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#888888] border border-[#333333]">
                    {TYPE_LABELS[event.type]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#FAFAFA]">
                  {event.title}
                </h3>
                <p className="text-sm text-[#888888] mt-1">
                  {event.description}
                </p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#FF6B00] hover:text-[#ff8c3a] mt-2 transition-colors"
                  >
                    Read article
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
