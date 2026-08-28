import type { ReactNode } from "react";

type Theme = "light" | "dark";

type PresenceCardProps = {
  icon: ReactNode;
  iconBg: string;
  iconSize?: string;
  kicker: string;
  title: string;
  subtitle: string;
  theme?: Theme;
};

export default function PresenceCard({
  icon,
  iconBg,
  iconSize = "h-16 w-16",
  kicker,
  title,
  subtitle,
  theme = "light",
}: PresenceCardProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={`flex w-[260px] items-center gap-3 rounded-2xl border p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.3)] transition-colors ${
        isDark ? "border-white/10 bg-[#2b2d31]" : "border-black/10 bg-white"
      }`}
    >
      <div
        className={`flex ${iconSize} shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className={`truncate text-xs font-medium ${isDark ? "text-white/40" : "text-black/40"}`}
        >
          {kicker}
        </span>
        <span
          className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}
        >
          {title}
        </span>
        <span
          className={`truncate font-mono text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
