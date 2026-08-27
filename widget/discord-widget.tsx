"use client";

import { useEffect, useState } from "react";

/**
 * Lanyard (https://github.com/Phineas/lanyard) is a public, free service
 * that mirrors a Discord user's live presence (status, Spotify, "Playing"
 * activities like games or the VS Code Discord Rich Presence extension).
 *
 * Real-time updates only start once the Discord account has shared a server
 * with the Lanyard bot at least once — join https://discord.gg/lanyard and
 * it will begin caching your presence.
 */
const WS_URL = "wss://api.lanyard.rest/socket";
const REST_BASE = "https://api.lanyard.rest/v1/users";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const IDLE_CLOSE_MS = 5000;

const DISCORD_ID_PATTERN = /^\d{17,20}$/;

function isValidDiscordId(userId: string | undefined): userId is string {
  return typeof userId === "string" && DISCORD_ID_PATTERN.test(userId.trim());
}

type LanyardActivity = {
  id: string;
  name: string;
  type: number; // Discord activity type: 0 = Playing (games, VS Code, etc.)
  state?: string;
  details?: string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
  };
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

type Listener = (data: LanyardData | null) => void;

type Connection = {
  socket: WebSocket | null;
  heartbeatTimer: ReturnType<typeof setInterval> | null;
  listeners: Set<Listener>;
  data: LanyardData | null;
  attempts: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  idleTimer: ReturnType<typeof setTimeout> | null;
  seeded: boolean;
  version: number;
};

// One socket per Discord user id, shared by every DiscordWidget instance on
// the page (e.g. a card in the header and one in the footer).
const connections = new Map<string, Connection>();

// The socket only pushes a snapshot on its first message, which can take a
// moment. The REST endpoint answers immediately, so it seeds the first
// render while the socket takes over for live updates.
function seed(userId: string, conn: Connection) {
  conn.seeded = true;
  const version = conn.version;
  fetch(`${REST_BASE}/${encodeURIComponent(userId)}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((payload) => {
      const data: LanyardData | undefined = payload?.data;
      if (!data || conn.version !== version) return;
      conn.data = data;
      conn.listeners.forEach((listener) => listener(conn.data));
    })
    .catch(() => {
      // Activity is a nice-to-have, fail silently.
    });
}

function connect(userId: string, conn: Connection) {
  const socket = new WebSocket(WS_URL);
  conn.socket = socket;

  socket.onopen = () => {
    conn.attempts = 0;
    socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      // op 1 (Hello) carries the heartbeat interval; Lanyard drops the
      // connection if it doesn't receive one back on schedule.
      if (message.op === 1) {
        const interval = message.d?.heartbeat_interval;
        if (conn.heartbeatTimer) clearInterval(conn.heartbeatTimer);
        if (typeof interval === "number") {
          conn.heartbeatTimer = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN)
              socket.send(JSON.stringify({ op: 3 }));
          }, interval);
        }
        return;
      }

      if (
        message.op !== 0 ||
        (message.t !== "INIT_STATE" && message.t !== "PRESENCE_UPDATE")
      )
        return;
      conn.data = message.d;
      conn.version += 1;
      conn.listeners.forEach((listener) => listener(conn.data));
    } catch {
      // Activity is a nice-to-have, fail silently.
    }
  };

  socket.onclose = () => {
    conn.socket = null;
    if (conn.heartbeatTimer) {
      clearInterval(conn.heartbeatTimer);
      conn.heartbeatTimer = null;
    }
    if (conn.listeners.size === 0) return;
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** conn.attempts,
      RECONNECT_MAX_MS,
    );
    conn.attempts += 1;
    conn.reconnectTimer = setTimeout(() => {
      // A dropped socket may have missed updates, so the reconnect refreshes
      // the snapshot too.
      seed(userId, conn);
      connect(userId, conn);
    }, delay);
  };

  socket.onerror = () => socket.close();
}

function subscribe(userId: string, listener: Listener) {
  let conn = connections.get(userId);
  if (!conn) {
    conn = {
      socket: null,
      heartbeatTimer: null,
      listeners: new Set(),
      data: null,
      attempts: 0,
      reconnectTimer: null,
      idleTimer: null,
      seeded: false,
      version: 0,
    };
    connections.set(userId, conn);
  }

  if (!conn.seeded) seed(userId, conn);

  if (conn.idleTimer) {
    clearTimeout(conn.idleTimer);
    conn.idleTimer = null;
  }

  conn.listeners.add(listener);
  if (conn.data) listener(conn.data);
  if (!conn.socket && !conn.reconnectTimer) connect(userId, conn);

  return () => {
    const current = connections.get(userId);
    if (!current) return;
    current.listeners.delete(listener);
    if (current.listeners.size > 0) return;
    // Grace period so remounts (and React strict mode) do not churn the socket.
    current.idleTimer = setTimeout(() => {
      if (current.listeners.size > 0) return;
      if (current.reconnectTimer) clearTimeout(current.reconnectTimer);
      if (current.heartbeatTimer) clearInterval(current.heartbeatTimer);
      current.socket?.close();
      connections.delete(userId);
    }, IDLE_CLOSE_MS);
  };
}

function useLanyard(userId: string | undefined) {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (!isValidDiscordId(userId)) {
      setData(null);
      return;
    }
    return subscribe(userId.trim(), setData);
  }, [userId]);

  return data;
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
  // Most games don't send a rich-presence asset, only an application id.
  // dcdn.dstn.to mirrors Discord's (otherwise unauthenticated-API-only) app
  // icons, so this still gets a picture for a plain "Playing X" activity.
  if (activity.application_id)
    return `https://dcdn.dstn.to/app-icons/${activity.application_id}.png`;
  return undefined;
}

type DiscordWidgetProps = {
  /** Your Discord user ID (17-20 digits). Enable Developer Mode in Discord
   * settings, then right-click your profile and "Copy User ID". */
  discordUserId?: string;
  /** Visual theme of the widget. Defaults to "light". */
  theme?: "light" | "dark";
  /** Heading shown above the cards. Defaults to "Activity". */
  title?: string;
};

export function DiscordWidget({
  discordUserId = "YOUR_DISCORD_USER_ID",
  theme = "light",
  title = "Activity",
}: DiscordWidgetProps) {
  const data = useLanyard(discordUserId);
  const isDark = theme === "dark";

  if (!data) return null;

  const playingActivities = (data.activities ?? []).filter((a) => a.type === 0);
  if (!data.spotify && playingActivities.length === 0) return null;

  const cardClass = `flex items-center gap-3 rounded-2xl border p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.3)] transition-colors ${
    isDark ? "border-white/10 bg-[#2b2d31]" : "border-black/10 bg-white"
  }`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}
        >
          {title}
        </span>
        {data.discord_status !== "offline" && (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#23a55a]" />
        )}
      </div>

      {data.spotify && (
        <a
          href={`https://open.spotify.com/track/${data.spotify.track_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClass}
        >
          {data.spotify.album_art_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.spotify.album_art_url}
              alt={data.spotify.song}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <span
              className={`truncate text-xs font-medium ${isDark ? "text-white/40" : "text-black/40"}`}
            >
              Listening to Spotify
            </span>
            <span
              className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {data.spotify.song}
            </span>
            <span
              className={`truncate font-mono text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
            >
              {data.spotify.artist}
            </span>
          </div>
        </a>
      )}

      {playingActivities.map((activity) => {
        const image = resolveActivityImage(activity);
        const detailLine =
          [activity.details, activity.state].filter(Boolean).join(" · ") ||
          "In game session";
        return (
          <div key={activity.id} className={cardClass}>
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={activity.assets?.large_text ?? activity.name}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
              <span
                className={`truncate text-xs font-medium ${isDark ? "text-white/40" : "text-black/40"}`}
              >
                Playing
              </span>
              <span
                className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}
              >
                {activity.name}
              </span>
              <span
                className={`truncate font-mono text-xs ${isDark ? "text-white/50" : "text-black/50"}`}
              >
                {detailLine}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
