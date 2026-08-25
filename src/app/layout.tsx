import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, Instrument_Sans, IBM_Plex_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import AudioPlayer from "@/components/ui/AudioPlayer";

const fontDisplay = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
});

const fontUi = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Roboto — used for feed card headings and body text only
const fontCard = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-card",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tidbit · Calibrated Reader",
  description: "Train cognitive bandwidth with calibrated, distraction-free reading tracks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontDisplay.variable} ${fontBody.variable} ${fontUi.variable} ${fontMono.variable} ${fontCard.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-stock text-ink font-body antialiased min-h-screen" suppressHydrationWarning>
        <Providers>
          {children}
          {/* Global sticky audio player — one instance, persists across all routes */}
          <AudioPlayer />
        </Providers>
      </body>
    </html>
  );
}
