"use client";

import Image from "next/image";
import { SATIRICAL_HEADLINES } from "@/content/headlines";

const STICKERS = [
  {
    src: "/stickers/prime-minister.jpg",
    alt: "Anthony Albanese",
    label: "THE PM",
    quote: '"IT\'S A FAIR GO!"',
    rotate: "-rotate-6",
    translate: "translate-y-1",
  },
  {
    src: "/stickers/rba-governor.jpg",
    alt: "Michele Bullock",
    label: "RBA GOV",
    quote: '"RATE HIKE!"',
    rotate: "rotate-3",
    translate: "translate-y-0",
  },
  {
    src: "/stickers/coles-ceo.png",
    alt: "Leah Weckert",
    label: "COLES CEO",
    quote: '"DOWN DOWN!"',
    rotate: "-rotate-4",
    translate: "translate-y-2",
  },
  {
    src: "/stickers/woolies-ceo.png",
    alt: "Amanda Bardwell",
    label: "WOOLIES CEO",
    quote: '"FRESH PRICES!"',
    rotate: "rotate-5",
    translate: "translate-y-1",
  },
];

export function HeadlineTicker() {
  const doubled = [...SATIRICAL_HEADLINES, ...SATIRICAL_HEADLINES];

  return (
    <div>
      {/* Stickers row — visible on md+ screens */}
      <div className="hidden md:flex justify-center gap-6 lg:gap-12 xl:gap-20 -mb-2 relative z-10">
        {STICKERS.map((sticker) => (
          <div
            key={sticker.src}
            className={`${sticker.rotate} ${sticker.translate} hover:scale-110 hover:!-translate-y-1 hover:!rotate-0 transition-all duration-200 cursor-pointer group`}
          >
            {/* Sticker container — die-cut style */}
            <div className="relative bg-white rounded-xl p-1 pb-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              {/* Photo */}
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden relative">
                <Image
                  src={sticker.src}
                  alt={sticker.alt}
                  fill
                  className="object-cover object-top select-none"
                  draggable={false}
                  sizes="96px"
                />
              </div>

              {/* Speech bubble — appears on hover */}
              <div className="absolute -top-8 -right-4 bg-[#FF6B00] text-white text-[10px] font-bold font-mono px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg pointer-events-none">
                {sticker.quote}
                <div className="absolute bottom-0 left-4 translate-y-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#FF6B00]" />
              </div>

              {/* Label */}
              <div className="bg-white text-center py-0.5 rounded-b-lg">
                <span className="text-[8px] lg:text-[10px] font-black tracking-wider text-[#1a1a1a] uppercase">
                  {sticker.label}
                </span>
              </div>
            </div>
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
