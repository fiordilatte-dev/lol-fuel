"use client";

import Image from "next/image";
import { SATIRICAL_HEADLINES } from "@/content/headlines";

const STICKERS = [
  {
    src: "/stickers/prime-minister.svg",
    alt: "PM Sticker",
    className: "left-[5%] -top-8 -rotate-6",
  },
  {
    src: "/stickers/rba-governor.svg",
    alt: "RBA Governor Sticker",
    className: "left-[30%] -top-10 rotate-3",
  },
  {
    src: "/stickers/coles-ceo.svg",
    alt: "Coles CEO Sticker",
    className: "right-[28%] -top-9 -rotate-4",
  },
  {
    src: "/stickers/woolies-ceo.svg",
    alt: "Woolworths CEO Sticker",
    className: "right-[3%] -top-7 rotate-6",
  },
];

export function HeadlineTicker() {
  const doubled = [...SATIRICAL_HEADLINES, ...SATIRICAL_HEADLINES];

  return (
    <div className="relative">
      {/* Stickers floating on top */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none hidden md:block">
        {STICKERS.map((sticker) => (
          <div
            key={sticker.src}
            className={`absolute ${sticker.className} drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform hover:scale-110`}
            style={{ pointerEvents: "auto" }}
          >
            <Image
              src={sticker.src}
              alt={sticker.alt}
              width={80}
              height={93}
              className="select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Ticker */}
      <div className="w-full overflow-hidden bg-[#1A1A1A] border-y border-[#333333] py-3">
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
