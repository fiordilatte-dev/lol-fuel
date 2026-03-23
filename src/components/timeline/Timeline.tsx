"use client";

import { TIMELINE_EVENTS } from "@/content/timeline";

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

export function Timeline() {
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
          {TIMELINE_EVENTS.map((event, i) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
