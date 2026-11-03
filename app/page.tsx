"use client";

import React, { useState } from "react";
import { useBinanceLive } from "@/hooks/useBinanceLive";
import { formatCompactUsd, formatUsd } from "@/lib/assets";
import Header from "@/components/Header";
import CandleChart from "@/components/CandleChart";
import AssetTable from "@/components/AssetTable";
import OrderBook from "@/components/OrderBook";
import ExecutionPad from "@/components/ExecutionPad";
import { ArrowUpRight } from "lucide-react";

const FEATURED = [
  { pair: "BTCUSDT", label: "Bitcoin Core", alloc: "50.0%" },
  { pair: "ETHUSDT", label: "Ethereum", alloc: "30.0%" },
  { pair: "SOLUSDT", label: "Solana", alloc: "20.0%" },
];

function LiveAssetCard({
  pair,
  label,
  alloc,
  isSelected,
  onSelect,
}: {
  pair: string;
  label: string;
  alloc: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const live = useBinanceLive(pair);
  const isPos = live.change24h >= 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`p-6 vault-card cursor-pointer transition-all text-left ${
        isSelected
          ? "!border-vault-gold/60 shadow-[0_0_20px_rgba(197,168,128,0.15)]"
          : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase tracking-wider text-vault-silver/70">
          {label}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 bg-vault-surface border border-vault-border rounded tabular-nums ${
            isPos ? "text-vault-emerald" : "text-vault-rose"
          }`}
        >
          {live.price
            ? `${isPos ? "+" : ""}${live.change24h.toFixed(2)}%`
            : "LIVE"}
        </span>
      </div>
      <div
        className={`font-serif text-3xl md:text-4xl font-normal tabular-nums transition-colors duration-200 ${
          live.direction === "up"
            ? "text-vault-emerald"
            : live.direction === "down"
              ? "text-vault-rose"
              : "text-white"
        }`}
      >
        {live.price ? (
          `$${formatUsd(live.price)}`
        ) : (
          <span className="inline-block h-9 w-40 rounded bg-vault-surface animate-pulse align-middle" />
        )}
      </div>
      <div className="mt-3 text-[11px] text-vault-silver/60 flex items-center justify-between">
        <span>
          VOL 24H:{" "}
          {live.volume24h ? `$${formatCompactUsd(live.volume24h)}` : "--"}
        </span>
        <span className="text-white">ALLOC: {alloc}</span>
      </div>
    </button>
  );
}

export default function StrataVaultDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<string>("BTCUSDT");
  const [isExecutionOpen, setIsExecutionOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen font-mono text-xs selection:bg-vault-gold selection:text-black pb-16">
      {/* Global Navigation Header */}
      <Header onOpenOTC={() => setIsExecutionOpen(true)} />

      {/* Main Grid Content */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        {/* Top 4 Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

          {FEATURED.map((asset) => (
            <LiveAssetCard
              key={asset.pair}
              {...asset}
              isSelected={selectedAsset === asset.pair}
              onSelect={() => setSelectedAsset(asset.pair)}
            />
          ))}
        </section>

        {/* Middle Section: Chart + OrderBook */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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

        {/* Bottom Section: Asset Table */}
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
      />
    </div>
  );
}
