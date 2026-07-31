import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "GGR Music Group",
    template: "%s - GGR Music Group",
  },
  icons: {
    icon: [
      { url: "/images/logo-favicon.ico", sizes: "any" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
      { url: "/images/logo-favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logo-favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo-android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo-android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/logo-apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${instrumentSans.variable}`}>
      <body className="font-sans antialiased" style={{ backgroundColor: "oklch(0.145 0 0)" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
