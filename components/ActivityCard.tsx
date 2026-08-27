import ActivityHeading from "@/components/ActivityHeading";
import PresenceCard from "@/components/PresenceCard";

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
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

export default function ActivityCard() {
  return (
    <div className="w-[260px]">
      <ActivityHeading />
      <PresenceCard
        icon={<CodeIcon />}
        iconBg="bg-[#1e2124]"
        kicker="Playing"
        title="Visual Studio Code"
        subtitle="Editing layout.tsx · Workspace:…"
      />
    </div>
  );
}
