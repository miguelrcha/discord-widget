# Discord Widget


Show who's online on your Discord server, live, anywhere you can paste a line of code.

Built with Next.js 14 (App Router), React 18 and TypeScript, styled with Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx      # root layout, fonts and metadata
  page.tsx        # assembles all sections
  globals.css      # global styles (white background, black text)
components/
  Header.tsx       # "Built by Miguel Rocha" pill
  Hero.tsx         # title, subtitle and CTAs
  WidgetPreview.tsx# live-looking Discord widget mockup
  About.tsx        # about the project
  Testimonial.tsx  # highlighted quote
  FAQ.tsx          # accordion FAQ section
  Footer.tsx        # clean footer with social links
```

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – lint the project

Built by **Miguel Rocha**.
