import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Discord Widget",
  description:
    "Turn your Discord server presence into a live widget that updates itself every day.",
  metadataBase: new URL("https://discord-widget.vercel.app"),
  openGraph: {
    title: "Discord Widget",
    description:
      "Turn your Discord server presence into a live widget that updates itself every day.",
    siteName: "discordwidget.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "discordwidget.com - Discord Portfolio Card",
    description:
      "Turn your Discord server presence into a live widget that updates itself every day.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-black antialiased">
        {children}
      </body>
    </html>
  );
}
