import { NextRequest, NextResponse } from "next/server";

// Renders a self-contained SVG badge of a user's live Discord presence
// (Spotify / "Playing" activities), meant to be embedded as an <img> —
// e.g. in a GitHub profile README, where <script> tags get stripped.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REST_BASE = "https://api.lanyard.rest/v1/users";
const DISCORD_ID_PATTERN = /^\d{15,20}$/;
const FETCH_TIMEOUT_MS = 4000;

type LanyardActivity = {
  id: string;
  name: string;
  type: number; // 0 = Playing
  state?: string;
  details?: string;
  application_id?: string;
  assets?: { large_image?: string; large_text?: string };
};

type LanyardSpotify = {
  track_id: string;
  song: string;
  artist: string;
  album_art_url?: string;
};

type LanyardData = {
  discord_status: string;
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
};

type CardItem = {
  image: string | null;
  kicker: string;
  name: string;
  detail: string;
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function resolveActivityImage(activity: LanyardActivity): string | undefined {
  const asset = activity.assets?.large_image;
  if (asset) {
    if (asset.startsWith("mp:"))
      return `https://media.discordapp.net/${asset.slice(3)}`;
    if (asset.startsWith("spotify:"))
      return `https://i.scdn.co/image/${asset.slice(8)}`;
    if (activity.application_id)
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${asset}.png`;
  }
  if (activity.application_id)
    return `https://dcdn.dstn.to/app-icons/${activity.application_id}.png`;
  return undefined;
}

async function toDataUri(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function buildSvg(
  items: CardItem[],
  opts: { theme: "light" | "dark"; title: string; showDot: boolean; message?: string },
) {
  const isDark = opts.theme === "dark";
  const colors = isDark
    ? {
        text: "#fff",
        subtext: "rgba(255,255,255,0.4)",
        mono: "rgba(255,255,255,0.5)",
        cardBg: "#2b2d31",
        cardBorder: "rgba(255,255,255,0.1)",
      }
    : {
        text: "#000",
        subtext: "rgba(0,0,0,0.4)",
        mono: "rgba(0,0,0,0.5)",
        cardBg: "#fff",
        cardBorder: "rgba(0,0,0,0.1)",
      };

  const width = 340;
  const headingHeight = 28;
  const gap = 12;
  const cardHeight = 88;
  const cardPad = 12;
  const imageSize = 64;
  const titleText = escapeXml(truncate(opts.title, 24));
  const dotX = 16 + Math.min(180, titleText.length * 9) + 12;

  const bodyHeight =
    items.length > 0
      ? items.length * cardHeight + (items.length - 1) * gap
      : opts.message
        ? 20
        : 0;
  const height = headingHeight + (bodyHeight > 0 ? gap + bodyHeight : 0);

  const dot = opts.showDot
    ? `<circle cx="${dotX}" cy="14" r="5" fill="#23a55a"><animate attributeName="opacity" values="1;0.45;1" dur="2s" repeatCount="indefinite" /></circle>`
    : "";

  const cards = items
    .map((item, index) => {
      const cardY = headingHeight + gap + index * (cardHeight + gap);
      const clipId = `dw-clip-${index}`;
      const image = item.image
        ? `<clipPath id="${clipId}"><rect x="${cardPad}" y="${cardY + cardPad}" width="${imageSize}" height="${imageSize}" rx="12" /></clipPath>` +
          `<image href="${item.image}" x="${cardPad}" y="${cardY + cardPad}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />`
        : "";
      const textX = item.image ? cardPad + imageSize + 12 : cardPad + 12;
      const textMaxChars = item.image ? 26 : 32;
      return (
        `<g>` +
        `<rect x="0" y="${cardY}" width="${width}" height="${cardHeight}" rx="16" fill="${colors.cardBg}" stroke="${colors.cardBorder}" stroke-width="1" filter="url(#dw-shadow)" />` +
        image +
        `<text x="${textX}" y="${cardY + 30}" font-size="12" font-weight="500" fill="${colors.subtext}">${escapeXml(truncate(item.kicker, textMaxChars))}</text>` +
        `<text x="${textX}" y="${cardY + 48}" font-size="14" font-weight="700" fill="${colors.text}">${escapeXml(truncate(item.name, textMaxChars))}</text>` +
        `<text x="${textX}" y="${cardY + 66}" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="${colors.mono}">${escapeXml(truncate(item.detail, textMaxChars))}</text>` +
        `</g>`
      );
    })
    .join("");

  const emptyMessage = opts.message
    ? `<text x="16" y="${headingHeight + gap + 14}" font-size="12" fill="${colors.subtext}">${escapeXml(opts.message)}</text>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">` +
    `<defs><filter id="dw-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.15" /></filter></defs>` +
    `<text x="16" y="19" font-size="18" font-weight="700" fill="${colors.text}">${titleText}</text>` +
    dot +
    cards +
    emptyMessage +
    `</svg>`
  );
}

function svgResponse(svg: string) {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") === "dark" ? "dark" : "light";
  const title = searchParams.get("title")?.trim() || "Activity";
  const userId = params.id?.trim();

  if (!userId || !DISCORD_ID_PATTERN.test(userId)) {
    return svgResponse(
      buildSvg([], { theme, title, showDot: false, message: "Invalid Discord user ID" }),
    );
  }

  let data: LanyardData | null = null;
  try {
    const res = await fetch(`${REST_BASE}/${encodeURIComponent(userId)}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const json = res.ok ? await res.json() : null;
    if (json?.success && json?.data) data = json.data;
  } catch {
    data = null;
  }

  if (!data) {
    return svgResponse(
      buildSvg([], {
        theme,
        title,
        showDot: false,
        message: "Couldn't load Discord presence",
      }),
    );
  }

  const playing = (data.activities || []).filter((a) => a.type === 0);

  const items: CardItem[] = [];

  if (data.spotify) {
    items.push({
      image: await toDataUri(data.spotify.album_art_url),
      kicker: "Listening to Spotify",
      name: data.spotify.song,
      detail: data.spotify.artist,
    });
  }

  for (const activity of playing) {
    const detail =
      [activity.details, activity.state].filter(Boolean).join(" · ") ||
      "In game session";
    items.push({
      image: await toDataUri(resolveActivityImage(activity)),
      kicker: "Playing",
      name: activity.name,
      detail,
    });
  }

  const svg = buildSvg(items, {
    theme,
    title,
    showDot: data.discord_status !== "offline",
    message: items.length === 0 ? "No activity right now" : undefined,
  });

  return svgResponse(svg);
}
