import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "STRATA // Sovereign Asset & Wealth Terminal",
  description:
    "Institutional-Grade Multi-Asset Intelligence & Sovereign Wealth Terminal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={`${cormorant.variable} ${geistMono.variable}`}>
      <body className="bg-vault-base text-vault-silver antialiased selection:bg-vault-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
