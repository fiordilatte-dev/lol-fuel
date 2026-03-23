"use client";

import Image from "next/image";

const STICKERS = [
  {
    src: "/stickers/prime-minister.jpg",
    alt: "Anthony Albanese",
    label: "THE PM",
    quote: '"IT\'S A FAIR GO!"',
    rotate: "-rotate-6",
  },
  {
    src: "/stickers/rba-governor.jpg",
    alt: "Michele Bullock",
    label: "RBA GOV",
    quote: '"RATE HIKE!"',
    rotate: "rotate-3",
  },
  {
    src: "/stickers/coles-ceo.png",
    alt: "Leah Weckert",
    label: "COLES CEO",
    quote: '"DOWN DOWN!"',
    rotate: "-rotate-4",
  },
  {
    src: "/stickers/woolies-ceo.png",
    alt: "Amanda Bardwell",
    label: "WOOLIES CEO",
    quote: '"FRESH PRICES!"',
    rotate: "rotate-5",
  },
];

export function Stickers() {
  return (
    <div className="hidden md:flex flex-col gap-3 items-center">
      {STICKERS.map((sticker) => (
        <div
          key={sticker.src}
          className={`${sticker.rotate} hover:scale-110 hover:!rotate-0 transition-all duration-200 cursor-pointer group`}
        >
          <div className="relative bg-white rounded-lg p-0.5 pb-0 shadow-[0_3px_12px_rgba(0,0,0,0.4)]">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md overflow-hidden relative">
              <Image
                src={sticker.src}
                alt={sticker.alt}
                fill
                className="object-cover object-top select-none"
                draggable={false}
                sizes="48px"
              />
            </div>

            {/* Speech bubble — appears on hover */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 -translate-x-full bg-[#FF6B00] text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg pointer-events-none">
              {sticker.quote}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-[#FF6B00]" />
            </div>

            <div className="bg-white text-center py-px rounded-b-md">
              <span className="text-[6px] lg:text-[7px] font-black tracking-wider text-[#1a1a1a] uppercase leading-none">
                {sticker.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
