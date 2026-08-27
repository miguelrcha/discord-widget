"use client";

import { useEffect, useState } from "react";

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="#61dafb"
      strokeWidth="1"
    >
      <circle cx="12" cy="12" r="2.2" fill="#61dafb" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  );
}

const slides = [
  {
    kicker: "Playing",
    title: "Visual Studio Code",
    subtitle: "Editing layout.tsx · Wo…",
    iconBg: "bg-[#1e2124]",
    icon: <CodeIcon />,
  },
  {
    kicker: "Listening to Spotify",
    title: "GRWM",
    subtitle: "Mc Iguinho Ct; Dj A…",
    image: "/spotify-grwm.png",
  },
  {
    kicker: "Playing",
    title: "Valorant",
    subtitle: "Competitive · 24:10 el…",
    image: "/valorant-logo.png",
  },
];

type Theme = "light" | "dark";

export default function TemplatePreviewCarousel({
  theme = "light",
}: {
  theme?: Theme;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];
  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-[113px] w-full flex-col justify-center gap-2.5 rounded-lg px-3 transition-colors ${
        isDark ? "bg-[#1e1f22]" : "bg-[#f4f4f5]"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`text-xs font-bold ${isDark ? "text-white" : "text-black"}`}
        >
          Activity
        </span>
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[#23a55a]" />
      </div>

      <div
        key={index}
        className={`flex animate-rise items-center gap-2 rounded-lg border p-2 shadow-sm transition-colors ${
          isDark
            ? "border-white/10 bg-[#2b2d31]"
            : "border-black/10 bg-white"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md ${
            slide.iconBg ?? ""
          }`}
        >
          {slide.icon ?? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span
            className={`truncate text-[10px] font-medium ${
              isDark ? "text-white/40" : "text-black/40"
            }`}
          >
            {slide.kicker}
          </span>
          <span
            className={`truncate text-xs font-semibold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {slide.title}
          </span>
          <span
            className={`truncate font-mono text-[9px] ${
              isDark ? "text-white/50" : "text-black/50"
            }`}
          >
            {slide.subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full transition-colors ${
              i === index
                ? isDark
                  ? "bg-white"
                  : "bg-black"
                : isDark
                  ? "bg-white/15"
                  : "bg-black/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
