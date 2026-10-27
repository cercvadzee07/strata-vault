"use client";

import React, { useState } from "react";
import { useBinanceLive } from "@/hooks/useBinanceLive";
import CandleChart from "@/components/CandleChart";
import AssetTable from "@/components/AssetTable";
import OrderBook from "@/components/OrderBook";
import ExecutionPad from "@/components/ExecutionPad";
import { ArrowUpRight, ShieldCheck, Activity, Plus } from "lucide-react";

export default function StrataVaultDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<string>("BTCUSDT");
  const [isExecutionOpen, setIsExecutionOpen] = useState<boolean>(false);

  const btcLive = useBinanceLive("btcusdt");
  const ethLive = useBinanceLive("ethusdt");
  const solLive = useBinanceLive("solusdt");

  const currentPrice =
    selectedAsset === "BTCUSDT"
      ? btcLive.price
      : selectedAsset === "ETHUSDT"
        ? ethLive.price
        : selectedAsset === "SOLUSDT"
          ? solLive.price
          : 80400;

  return (
    <div className="min-h-screen font-mono text-xs selection:bg-vault-gold selection:text-black pb-12">
      {/* Institutional Top Masthead */}
      <header className="border-b border-vault-border px-8 py-5 flex items-center justify-between bg-vault-panel/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.2em] text-white font-semibold uppercase">
              Strata <span className="text-vault-gold font-normal">Vault</span>
            </span>
            <span className="text-[10px] tracking-widest text-vault-silver/60 uppercase">
              Sovereign Asset & Wealth Terminal
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 pl-6 border-l border-vault-border text-[11px]">
            <span className="flex items-center gap-1.5 text-vault-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-vault-emerald animate-pulse" />
              ZURICH // PRIMARY CUSTODY
            </span>
            <span className="text-vault-silver/30">|</span>
            <span>
              LATENCY: <strong className="text-white">3.8ms</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExecutionOpen(true)}
            className="px-3.5 py-1.5 border border-vault-gold/40 hover:border-vault-gold bg-vault-gold/10 hover:bg-vault-gold/20 text-vault-gold hover:text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.15)] text-[11px] tracking-wider uppercase font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Initiate OTC
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 border border-vault-border bg-vault-surface/60 rounded-lg shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-gold" />
            <span className="text-[11px] text-white/90">VAULT TIER I</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-vault-border/80 bg-vault-surface/40 rounded-lg text-vault-silver/70 text-[11px]">
            <Activity className="w-3 h-3 text-vault-emerald" />
            <span className="text-white/80">SYNCHRONIZED</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
        {/* Top 4 Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Net Sovereign Custody
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              $18,450,200<span className="text-vault-gold text-xl">.00</span>
            </div>
            <div className="flex items-center gap-2 text-vault-emerald text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+4.12% ($728,400 T+30)</span>
            </div>
          </div>

          {/* BTC Card */}
          <div
            onClick={() => setSelectedAsset("BTCUSDT")}
            className={`p-6 vault-card cursor-pointer transition-all ${
              selectedAsset === "BTCUSDT"
                ? "!border-vault-gold/60 shadow-[0_0_20px_rgba(197,168,128,0.15)]"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider text-vault-silver/70">
                Bitcoin Core
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-vault-surface text-vault-gold border border-vault-border rounded">
                LIVE
              </span>
            </div>
            <div
              className={`font-serif text-3xl md:text-4xl font-normal tabular-nums transition-colors duration-200 ${
                btcLive.direction === "up"
                  ? "text-vault-emerald"
                  : btcLive.direction === "down"
                    ? "text-vault-rose"
                    : "text-white"
              }`}
            >
              $
              {btcLive.price
                ? btcLive.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "Loading..."}
            </div>
            <div className="mt-3 text-[11px] text-vault-silver/60 flex items-center justify-between">
              <span>VOL: $38.4B</span>
              <span className="text-white">ALLOC: 50.0%</span>
            </div>
          </div>

          {/* ETH Card */}
          <div
            onClick={() => setSelectedAsset("ETHUSDT")}
            className={`p-6 vault-card cursor-pointer transition-all ${
              selectedAsset === "ETHUSDT"
                ? "!border-vault-gold/60 shadow-[0_0_20px_rgba(197,168,128,0.15)]"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider text-vault-silver/70">
                Ethereum
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-vault-surface text-vault-gold border border-vault-border rounded">
                LIVE
              </span>
            </div>
            <div
              className={`font-serif text-3xl md:text-4xl font-normal tabular-nums transition-colors duration-200 ${
                ethLive.direction === "up"
                  ? "text-vault-emerald"
                  : ethLive.direction === "down"
                    ? "text-vault-rose"
                    : "text-white"
              }`}
            >
              $
              {ethLive.price
                ? ethLive.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "Loading..."}
            </div>
            <div className="mt-3 text-[11px] text-vault-silver/60 flex items-center justify-between">
              <span>GAS: 12 GWEI</span>
              <span className="text-white">ALLOC: 30.0%</span>
            </div>
          </div>

          {/* SOL Card */}
          <div
            onClick={() => setSelectedAsset("SOLUSDT")}
            className={`p-6 vault-card cursor-pointer transition-all ${
              selectedAsset === "SOLUSDT"
                ? "!border-vault-gold/60 shadow-[0_0_20px_rgba(197,168,128,0.15)]"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider text-vault-silver/70">
                Solana
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-vault-surface text-vault-gold border border-vault-border rounded">
                LIVE
              </span>
            </div>
            <div
              className={`font-serif text-3xl md:text-4xl font-normal tabular-nums transition-colors duration-200 ${
                solLive.direction === "up"
                  ? "text-vault-emerald"
                  : solLive.direction === "down"
                    ? "text-vault-rose"
                    : "text-white"
              }`}
            >
              $
              {solLive.price
                ? solLive.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "Loading..."}
            </div>
            <div className="mt-3 text-[11px] text-vault-silver/60 flex items-center justify-between">
              <span>TPS: 2,840</span>
              <span className="text-white">ALLOC: 20.0%</span>
            </div>
          </div>
        </section>

        {/* Middle Section: Chart + OrderBook */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CandleChart key={selectedAsset} symbol={selectedAsset} />
          </div>
          <div>
            <OrderBook
              key={selectedAsset}
              symbol={selectedAsset.toLowerCase()}
            />
          </div>
        </section>

        {/* Bottom Section: Asset Table with Interactive Selection */}
        <section>
          <AssetTable
            selectedAsset={selectedAsset}
            onSelectAsset={(pair) => setSelectedAsset(pair)}
          />
        </section>
      </main>

      {/* Slide-Over Drawer */}
      <ExecutionPad
        isOpen={isExecutionOpen}
        onClose={() => setIsExecutionOpen(false)}
        symbol={selectedAsset}
        currentPrice={currentPrice}
      />
    </div>
  );
}
