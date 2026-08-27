import type { ReactNode } from "react";

type PresenceCardProps = {
  icon: ReactNode;
  iconBg: string;
  iconSize?: string;
  kicker: string;
  title: string;
  subtitle: string;
};

export default function PresenceCard({
  icon,
  iconBg,
  iconSize = "h-16 w-16",
  kicker,
  title,
  subtitle,
}: PresenceCardProps) {
  return (
    <div className="flex w-[260px] items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.3)]">
      <div
        className={`flex ${iconSize} shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-xs font-medium text-black/40">
          {kicker}
        </span>
        <span className="truncate text-sm font-semibold text-black">
          {title}
        </span>
        <span className="truncate font-mono text-xs text-black/50">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
