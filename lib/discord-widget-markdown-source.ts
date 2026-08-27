const DEFAULT_BASE_URL = "https://discord-widget-app.vercel.app";

export function generateDiscordWidgetMarkdownCode(
  discordUserId: string,
  theme: "light" | "dark",
  baseUrl?: string,
) {
  const origin = (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  const badgeUrl = `${origin}/api/badge/${discordUserId}?theme=${theme}`;

  return (
    "<!-- Discord Widget — powered by Lanyard (https://github.com/Phineas/lanyard) -->\n" +
    "<!-- Join https://discord.gg/lanyard with your Discord account so it starts caching your presence. -->\n" +
    `![Discord Presence](${badgeUrl})\n`
  );
}
