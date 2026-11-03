import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MarketDataProvider } from "@/hooks/useBinanceLive";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strata Vault // Sovereign Asset Terminal",
  description:
    "Swiss Private Wealth & Sovereign Reserve Architecture. Live crypto market terminal built with Next.js, TypeScript and Binance WebSocket streams.",
  openGraph: {
    title: "Strata Vault // Sovereign Asset Terminal",
    description:
      "Live crypto market terminal: Binance WebSocket prices, candlestick charts and a Level-2 order book.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cormorant.variable} ${geistMono.variable} antialiased bg-[#08090C] text-vault-silver`}
      >
        <MarketDataProvider>{children}</MarketDataProvider>
      </body>
    </html>
  );
}
