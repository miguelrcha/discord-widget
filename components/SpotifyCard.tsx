import ActivityHeading from "@/components/ActivityHeading";
import PresenceCard from "@/components/PresenceCard";

export default function SpotifyCard() {
  return (
    <div className="w-[260px]">
      <ActivityHeading />
      <PresenceCard
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/spotify-grwm.png"
            alt="GRWM"
            className="h-full w-full rounded-xl object-cover"
          />
        }
        iconBg=""
        iconSize="h-20 w-20"
        kicker="Listening to Spotify"
        title="GRWM"
        subtitle="Mc Iguinho Ct; Dj Aladin GDB; M…"
      />
    </div>
  );
}
