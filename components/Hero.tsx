import ActivityCard from "@/components/ActivityCard";
import SpotifyCard from "@/components/SpotifyCard";
import GameCard from "@/components/GameCard";
import EmbedCodeButton from "@/components/EmbedCodeButton";
import LivePreviewButton from "@/components/LivePreviewButton";

export default function Hero() {
  return (
    <section className="container-narrow relative flex flex-col items-start pt-12 sm:pt-16 text-left">
      <div
        className="pointer-events-none absolute right-8 top-[12%] hidden lg:block xl:right-12"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="pointer-events-auto">
          <ActivityCard />
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-24 top-[48%] hidden lg:block xl:right-32"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="pointer-events-auto">
          <SpotifyCard />
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-4 top-[80%] hidden lg:block xl:right-6"
        style={{ transform: "rotate(-2deg)" }}
      >
        <div className="pointer-events-auto">
          <GameCard />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://github.com/miguelrcha.png"
          alt="Miguel Rocha"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="text-base text-black/60">
          Feito por <span className="font-medium text-black">Miguel Rocha</span>
        </span>
      </div>

      <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl lg:leading-[1.02]">
        Discord
        <br />
        Widget
      </h1>
      <p className="mt-5 max-w-lg text-balance text-lg text-black/60 sm:text-xl">
        Mostre no seu portfólio seus status diretamente do Discord,
        simultaneamente.
      </p>

      <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <EmbedCodeButton />
        <a
          href="https://github.com/miguelrcha/discord-widget"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-20 flex-1 sm:h-14 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-black px-6 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.94 3.2 9.13 7.65 10.6.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.11-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.7-1.49-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.6 10.6 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.24-5.13 5.52.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54A10.53 10.53 0 0 0 23 11.52C23 5.24 18.27.5 12 .5Z" />
          </svg>
          View on GitHub
        </a>
      </div>

      <LivePreviewButton />
    </section>
  );
}
