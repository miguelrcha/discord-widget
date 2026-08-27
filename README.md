<div align="center">

<a href="https://discord-widget.vercel.app/"><img src="imgs/banner.png" alt="Discord Widget" width="100%"></a>

[![GitHub Stars](https://img.shields.io/github/stars/miguelrcha/discord-widget.svg?style=flat&logo=github)](https://github.com/miguelrcha/discord-widget/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdiscord-widget.vercel.app&style=flat&logo=vercel&label=website)](https://discord-widget-app.vercel.app/)

</div>

# Discord Widget

Show who's online on your Discord server, live, anywhere you can paste a line of code.

Built with Next.js 14 (App Router), React 18 and TypeScript, styled with Tailwind CSS.

## About

Hi, I'm **Miguel Rocha**, a software engineer who built this project out of a feature from my own portfolio, made with **OpenPortfolios by @MatheusAudibert**.

The project uses Discord activity status through the **Lanyard library/API**. The site walks you through a step-by-step generator that gives you a ready-to-paste component with your own Discord user ID and theme already configured, so you can drop it straight into your own projects.

## Endpoints

#### `GET /api/badge/:discordUserId`

Renders a live SVG badge of a Discord user's presence (Spotify / "Playing" activity). Since GitHub strips `<script>` tags from profile READMEs, this is what powers the **Markdown** option in the generator — paste the returned image URL straight into your `README.md`.

```md
![Discord Presence](https://discord-widget-app.vercel.app/api/badge/YOUR_DISCORD_USER_ID?theme=light)
```

| Query param | Values           | Default   | Description                     |
| ----------- | ---------------- | --------- | -------------------------------- |
| `theme`     | `light` \| `dark` | `light`  | Visual theme of the badge        |
| `title`     | `string`          | `Activity` | Heading shown above the card(s) |

The badge falls back to a "No activity right now" message when there's nothing to show. Note that GitHub caches external README images, so updates may take a few minutes to show up.

#### Support
If you're using this repo, feel free to show support and give this repo a ⭐ star! It means a lot, thank you :)
