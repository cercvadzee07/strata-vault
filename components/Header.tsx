"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Activity, Plus } from "lucide-react";

interface HeaderProps {
  onOpenOTC?: () => void;
}

const NAV_LINKS = [
  { name: "Terminal", href: "/" },
  { name: "Reserves", href: "/reserves" },
  { name: "Settlement", href: "/settlement" },
  { name: "Macro", href: "/macro" },
];

export default function Header({ onOpenOTC }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-vault-border px-8 py-4 flex flex-wrap items-center justify-between gap-4 bg-vault-panel/40 backdrop-blur-md sticky top-0 z-40 font-mono text-xs">
      {/* Brand & Masthead */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex flex-col group cursor-pointer">
          <span className="font-serif text-2xl tracking-[0.2em] text-white font-semibold uppercase group-hover:text-vault-gold transition-colors">
            Strata <span className="text-vault-gold font-normal">Vault</span>
          </span>
          <span className="text-[9px] tracking-widest text-vault-silver/60 uppercase">
            Sovereign Asset & Wealth Terminal
          </span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-vault-surface/40 border border-vault-border/80 rounded-xl">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-vault-gold/20 text-vault-gold border border-vault-gold/40 shadow-sm font-semibold"
                    : "text-vault-silver/60 hover:text-white hover:bg-vault-surface/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Telemetry & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-vault-emerald pr-4 border-r border-vault-border/60">
          <span className="w-1.5 h-1.5 rounded-full bg-vault-emerald animate-pulse" />
          <span>ZURICH // PRIMARY</span>
        </div>

        {onOpenOTC && (
          <button
            onClick={onOpenOTC}
            className="px-3.5 py-1.5 border border-vault-gold/40 hover:border-vault-gold bg-vault-gold/10 hover:bg-vault-gold/20 text-vault-gold hover:text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.15)] text-[11px] tracking-wider uppercase font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Initiate OTC
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 border border-vault-border bg-vault-surface/60 rounded-lg shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-vault-gold" />
          <span className="text-[11px] text-white/90">VAULT TIER I</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-vault-border/80 bg-vault-surface/40 rounded-lg text-vault-silver/70 text-[11px]">
          <Activity className="w-3 h-3 text-vault-emerald" />
          <span className="text-white/80">LIVE</span>
        </div>
      </div>
    </header>
  );
}
