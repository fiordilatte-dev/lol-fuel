"use client";

import { SATIRICAL_HEADLINES } from "@/content/headlines";

export function HeadlineTicker() {
  const doubled = [...SATIRICAL_HEADLINES, ...SATIRICAL_HEADLINES];

  return (
    <div className="w-full overflow-hidden bg-[#1A1A1A] border-y border-[#333333] py-3">
      <div className="flex animate-[scroll_60s_linear_infinite] whitespace-nowrap">
        {doubled.map((headline, i) => (
          <span key={i} className="mx-8 text-sm font-mono text-[#FF6B00]">
            {"\u25CF"} {headline}
          </span>
        ))}
      </div>
    </div>
  );
}
