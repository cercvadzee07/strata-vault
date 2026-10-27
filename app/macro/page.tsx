"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import ExecutionPad from "@/components/ExecutionPad";
import {
  Landmark,
  Scale,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Globe,
  BarChart3,
  Percent,
  CheckCircle2,
} from "lucide-react";

interface MacroRate {
  institution: string;
  code: string;
  rate: string;
  change: string;
  trend: "up" | "down" | "neutral";
  stance: string;
}

const POLICY_RATES: MacroRate[] = [
  {
    institution: "Swiss National Bank",
    code: "SNB // POLICY RATE",
    rate: "1.00%",
    change: "-25 bps",
    trend: "down",
    stance: "NEUTRAL / PRICE STABILITY",
  },
  {
    institution: "Federal Reserve",
    code: "FED // UPPER BOUND",
    rate: "4.75%",
    change: "-25 bps",
    trend: "down",
    stance: "MONETARY EASING CYCLE",
  },
  {
    institution: "European Central Bank",
    code: "ECB // DEPOSIT FACILITY",
    rate: "3.25%",
    change: "-25 bps",
    trend: "down",
    stance: "TARGET INFLATION MAINTAINED",
  },
  {
    institution: "Bank of Japan",
    code: "BOJ // SHORT-TERM",
    rate: "0.25%",
    change: "+15 bps",
    trend: "up",
    stance: "GRADUAL NORMALIZATION",
  },
];

interface SovereignPair {
  symbol: string;
  name: string;
  value: string;
  change24h: string;
  direction: "up" | "down";
  context: string;
}

const SOVEREIGN_METRICS: SovereignPair[] = [
  {
    symbol: "USD / CHF",
    name: "Swiss Franc Dominance",
    value: "0.8642",
    change24h: "-0.18%",
    direction: "down",
    context: "Safe Haven Inflow Sustained",
  },
  {
    symbol: "EUR / CHF",
    name: "Cross-Border Settlement",
    value: "0.9380",
    change24h: "-0.05%",
    direction: "down",
    context: "Euro Peg Floor Protected",
  },
  {
    symbol: "DXY INDEX",
    name: "US Dollar Index Benchmark",
    value: "103.85",
    change24h: "+0.22%",
    direction: "up",
    context: "Sovereign Bond Yield Pressure",
  },
  {
    symbol: "XAU / XAG",
    name: "Gold-to-Silver Ratio",
    value: "84.12",
    change24h: "-0.40%",
    direction: "down",
    context: "Monetary Bullion Demand Dominant",
  },
];

export default function MacroPage() {
  const [isExecutionOpen, setIsExecutionOpen] = useState(false);

  return (
    <div className="min-h-screen font-mono text-xs selection:bg-vault-gold selection:text-black pb-16">
      {/* Global Navigation Header */}
      <Header onOpenOTC={() => setIsExecutionOpen(true)} />

      <main className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
        {/* Top Sovereign Macro Barometer Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Global Liquidity Stress Index
            </div>
            <div className="font-serif text-3xl md:text-4xl text-vault-emerald font-normal tabular-nums mb-3">
              12.4<span className="text-vault-silver/40 text-xl"> / 100</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TIER-1 LOW RISK // OPTIMAL</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Swiss Sovereign Gold Buffer
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              1,040<span className="text-vault-gold text-xl"> TONNES</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/70 text-[11px]">
              <Landmark className="w-3.5 h-3.5 text-vault-gold" />
              <span>100% UNENCUMBERED PHYSICAL</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              M2 Monetary Aggregate (CHF)
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              1.12<span className="text-vault-gold text-xl">T CHF</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/60 text-[11px]">
              <Percent className="w-3.5 h-3.5 text-vault-gold" />
              <span>+1.8% YOY EXPANSION</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Sovereign Counterparty Risk
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              AAA<span className="text-vault-emerald text-xl"> // SECURE</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ZERO SOVEREIGN DEFAULT RISK</span>
            </div>
          </div>
        </section>

        {/* Central Bank Policy Matrix */}
        <section className="vault-card p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-vault-border pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-vault-gold border border-vault-gold/30 px-2 py-0.5 bg-vault-surface rounded-md">
                  CENTRAL BANK BENCHMARK
                </span>
                <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest">
                  Monetary Transmission Horizon
                </span>
              </div>
              <h3 className="font-serif text-xl text-white font-medium uppercase tracking-wider">
                Sovereign Central Bank Policy Rates
              </h3>
            </div>
            <span className="text-[10px] text-vault-silver/50 tracking-widest uppercase">
              UPDATED: LIVE POLICY REVISION CYCLE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {POLICY_RATES.map((rate) => (
              <div
                key={rate.code}
                className="p-5 rounded-xl bg-vault-surface/40 border border-vault-border/80 hover:border-vault-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-vault-gold font-mono uppercase tracking-wider block mb-1">
                    {rate.code}
                  </span>
                  <h4 className="font-serif text-base text-white">
                    {rate.institution}
                  </h4>
                </div>

                <div className="my-5">
                  <div className="font-serif text-3xl text-white font-medium tabular-nums">
                    {rate.rate}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[11px] mt-1 ${
                      rate.trend === "up"
                        ? "text-vault-rose"
                        : "text-vault-emerald"
                    }`}
                  >
                    {rate.trend === "up" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{rate.change}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-vault-border/50 text-[10px] text-vault-silver/60 tracking-wider uppercase">
                  {rate.stance}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FX Benchmarks & Reserve Ratios */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vault-card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-vault-border pb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-vault-gold" />
                <h4 className="font-serif text-lg text-white uppercase tracking-wider">
                  Sovereign FX & Currency Reserves
                </h4>
              </div>
              <span className="text-[10px] text-vault-silver/50 uppercase">
                T+0 SPOT FIXING
              </span>
            </div>

            <div className="divide-y divide-vault-border/40">
              {SOVEREIGN_METRICS.map((metric) => (
                <div
                  key={metric.symbol}
                  className="py-3.5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-white font-medium text-xs block">
                      {metric.symbol}
                    </span>
                    <span className="text-[10px] text-vault-silver/50 uppercase">
                      {metric.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-sm text-vault-gold tabular-nums block">
                      {metric.value}
                    </span>
                    <span
                      className={`text-[10px] ${
                        metric.direction === "up"
                          ? "text-vault-emerald"
                          : "text-vault-rose"
                      }`}
                    >
                      {metric.change24h}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Macro Thesis Note */}
          <div className="vault-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-vault-border pb-4 mb-4">
                <Scale className="w-4 h-4 text-vault-gold" />
                <h4 className="font-serif text-lg text-white uppercase tracking-wider">
                  Swiss Sovereign Thesis // Q4
                </h4>
              </div>
              <p className="text-vault-silver/70 leading-relaxed text-[11px] mb-4">
                Sovereign reserve allocation continues to prioritize neutral,
                non-jurisdictional reserve assets. With declining policy rates
                across the G10 economies, Strata Vault maintains hard asset
                collateralization with over 90% allocation secured within
                physical and zero-knowledge Swiss Alpine facilities.
              </p>
              <div className="p-3.5 rounded-lg bg-vault-surface/60 border border-vault-border/80">
                <div className="text-[10px] text-vault-gold uppercase tracking-wider font-semibold mb-1">
                  STRATEGIC DIRECTIVE
                </div>
                <p className="text-[11px] text-vault-silver/80">
                  Target 50% Core Bitcoin, 20% Physical Sovereign Gold (PAXG
                  backing), and 30% liquid settlement buffers across CHF and
                  Tier-1 smart contract layers.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-vault-border/60 flex items-center justify-between text-[10px] text-vault-silver/50">
              <span>SECURITY PROTOCOL: NEUTRAL STATE IMMUNITY</span>
              <span className="text-vault-emerald">
                AUDIT REGIME: FINMA VERIFIED
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Slide-Over Drawer */}
      <ExecutionPad
        isOpen={isExecutionOpen}
        onClose={() => setIsExecutionOpen(false)}
        symbol="BTCUSDT"
        currentPrice={80400}
      />
    </div>
  );
}
