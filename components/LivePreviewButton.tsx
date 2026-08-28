"use client";

import { useEffect, useState } from "react";

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
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

const previewCards = [
  {
    kicker: "Playing",
    title: "Visual Studio Code",
    subtitle: "Editing layout.tsx · Workspace: discord-widget",
    iconBg: "bg-[#1e2124]",
    icon: <CodeIcon />,
  },
  {
    kicker: "Listening to Spotify",
    title: "GRWM",
    subtitle: "Mc Iguinho Ct; Dj Aladin GDB; MC GW",
    image: "/spotify-grwm.png",
  },
  {
    kicker: "Playing",
    title: "Valorant",
    subtitle: "Competitive · 24:10 elapsed",
    image: "/valorant-logo.png",
  },
];

function SunIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.508 0-8.16-3.653-8.16-8.16 0-1.062.207-2.076.573-3.017a.75.75 0 0 0-.877-1A9.66 9.66 0 1 0 21.75 13.6a.75.75 0 0 0-1.008-.556Z" />
    </svg>
  );
}

export default function LivePreviewButton() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isDark = theme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 self-start text-sm font-medium text-black/60 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
      >
        Ver preview ao vivo
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white pb-8 pt-3 text-black shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Preview do widget"
        >
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-black/15" />

          <div className="flex items-start justify-between gap-4 px-6">
            <div>
              <h2 className="text-xl font-semibold">Preview em tempo real</h2>
              <p className="mt-2 text-sm text-black/50">
                Assim ficam os cards de atividade (VS Code, Spotify e jogo) no
                seu portfólio.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 bg-black/[0.03] p-1">
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-label="Modo claro"
                aria-pressed={theme === "light"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "text-black/40 hover:text-black"
                }`}
              >
                <SunIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-label="Modo escuro"
                aria-pressed={theme === "dark"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  theme === "dark"
                    ? "bg-black text-white"
                    : "text-black/40 hover:text-black"
                }`}
              >
                <MoonIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={`mx-6 mt-6 rounded-2xl p-6 transition-colors sm:p-10 ${
              isDark ? "border border-white/10 bg-[#1e1f22]" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}
              >
                Activity
              </span>
              <span className="h-2.5 w-2.5 animate-blink rounded-full bg-[#23a55a]" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {previewCards.map((card) => (
                <div
                  key={card.title}
                  className={`flex items-center gap-3 rounded-2xl border p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.3)] transition-colors ${
                    isDark
                      ? "border-white/10 bg-[#2b2d31]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                      card.iconBg ?? ""
                    }`}
                  >
                    {card.icon ?? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className={`truncate text-xs font-medium ${isDark ? "text-white/40" : "text-black/40"}`}
                    >
                      {card.kicker}
                    </span>
                    <span
                      className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}
                    >
                      {card.title}
                    </span>
                    <span
                      className={`truncate font-mono text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
                    >
                      {card.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center px-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-sm font-semibold text-black/50 transition-colors hover:text-black"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
