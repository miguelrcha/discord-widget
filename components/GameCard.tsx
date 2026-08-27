import ActivityHeading from "@/components/ActivityHeading";
import PresenceCard from "@/components/PresenceCard";

export default function GameCard() {
  return (
    <div className="w-[260px]">
      <ActivityHeading />
      <PresenceCard
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/valorant-logo.png"
            alt="Valorant"
            className="h-full w-full rounded-xl object-cover"
          />
        }
        iconBg=""
        iconSize="h-16 w-16"
        kicker="Playing"
        title="Valorant"
        subtitle="Competitive · 24:10 elapsed"
      />
    </div>
  );
}
