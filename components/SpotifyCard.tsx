import ActivityHeading from "@/components/ActivityHeading";
import PresenceCard from "@/components/PresenceCard";

type Theme = "light" | "dark";

export default function SpotifyCard({
  theme = "light",
}: {
  theme?: Theme;
}) {
  return (
    <div className="w-[260px]">
      <ActivityHeading theme={theme} />
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
        theme={theme}
      />
    </div>
  );
}
