"use client";

import Image from "next/image";
import { SATIRICAL_HEADLINES } from "@/content/headlines";

const STICKERS = [
  {
    src: "/stickers/prime-minister.svg",
    alt: "PM Sticker",
    rotate: "-rotate-6",
    translate: "translate-y-4",
  },
  {
    src: "/stickers/rba-governor.svg",
    alt: "RBA Governor Sticker",
    rotate: "rotate-3",
    translate: "translate-y-2",
  },
  {
    src: "/stickers/coles-ceo.svg",
    alt: "Coles CEO Sticker",
    rotate: "-rotate-4",
    translate: "translate-y-5",
  },
  {
    src: "/stickers/woolies-ceo.svg",
    alt: "Woolworths CEO Sticker",
    rotate: "rotate-6",
    translate: "translate-y-3",
  },
];

export function HeadlineTicker() {
  const doubled = [...SATIRICAL_HEADLINES, ...SATIRICAL_HEADLINES];

  return (
    <div>
      {/* Stickers row — visible on md+ screens */}
      <div className="hidden md:flex justify-center gap-8 lg:gap-16 xl:gap-24 -mb-6 relative z-10">
        {STICKERS.map((sticker) => (
          <div
            key={sticker.src}
            className={`${sticker.rotate} ${sticker.translate} drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
          >
            <Image
              src={sticker.src}
              alt={sticker.alt}
              width={90}
              height={105}
              className="select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Ticker */}
      <div className="w-full overflow-hidden bg-[#1A1A1A] border-y border-[#333333] py-3 relative">
        <div className="flex animate-[scroll_60s_linear_infinite] whitespace-nowrap">
          {doubled.map((headline, i) => (
            <span key={i} className="mx-8 text-sm font-mono text-[#FF6B00]">
              {"\u25CF"} {headline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
