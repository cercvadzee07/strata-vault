"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AssetRow {
  id: string;
  name: string;
  ticker: string;
  pairSymbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

const mockAssets: AssetRow[] = [
  {
    id: "1",
    name: "Bitcoin Core",
    ticker: "BTC",
    pairSymbol: "BTCUSDT",
    price: 80240.5,
    change24h: 3.42,
    sparkline: [77000, 78200, 77900, 79100, 78800, 79900, 80240],
  },
  {
    id: "2",
    name: "Ethereum Network",
    ticker: "ETH",
    pairSymbol: "ETHUSDT",
    price: 3420.8,
    change24h: -1.15,
    sparkline: [3550, 3510, 3480, 3500, 3440, 3410, 3420],
  },
  {
    id: "3",
    name: "Solana Consensus",
    ticker: "SOL",
    pairSymbol: "SOLUSDT",
    price: 178.4,
    change24h: 5.68,
    sparkline: [162, 165, 168, 171, 169, 174, 178],
  },
  {
    id: "4",
    name: "Sovereign Gold (XAU)",
    ticker: "PAXG",
    pairSymbol: "PAXGUSDT",
    price: 2740.1,
    change24h: 0.45,
    sparkline: [2720, 2725, 2730, 2728, 2735, 2738, 2740],
  },
  {
    id: "5",
    name: "Binance Sovereign",
    ticker: "BNB",
    pairSymbol: "BNBUSDT",
    price: 592.4,
    change24h: 1.85,
    sparkline: [575, 580, 582, 579, 588, 590, 592],
  },
];

function InteractiveSparkline({
  points,
  isPositive,
}: {
  points: number[];
  isPositive: boolean;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 120;
  const height = 34;
  const min = Math.min(...points);
  const max = Math.max(...points);

  const getCoords = (idx: number) => {
    const x = (idx / (points.length - 1)) * width;
    const y =
      height - ((points[idx] - min) / (max - min || 1)) * (height - 8) - 4;
    return { x, y };
  };

  const pathD = points
    .map((_, i) => {
      const { x, y } = getCoords(i);
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  const strokeColor = isPositive ? "#10B981" : "#E11D48";
  const activeCoord = hoverIndex !== null ? getCoords(hoverIndex) : null;

  return (
    <div
      className="relative inline-block py-1 cursor-crosshair group"
      onMouseLeave={() => setHoverIndex(null)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = Math.max(0, Math.min(width, e.clientX - rect.left));
        const index = Math.round((mouseX / width) * (points.length - 1));
        setHoverIndex(index);
      }}
    >
      <svg width={width} height={height} className="overflow-visible block">
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {activeCoord && (
          <>
            <line
              x1={activeCoord.x}
              y1={0}
              x2={activeCoord.x}
              y2={height}
              stroke="#C5A880"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r="3.5"
              fill="#08090C"
              stroke="#C5A880"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {hoverIndex !== null && (
        <div
          className="absolute -top-7 pointer-events-none transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#151821] border border-vault-gold/40 text-[10px] text-white shadow-lg whitespace-nowrap z-20 tabular-nums"
          style={{ left: `${activeCoord?.x ?? 0}px` }}
        >
          ${points[hoverIndex].toLocaleString()}
        </div>
      )}
    </div>
  );
}

interface AssetTableProps {
  selectedAsset?: string;
  onSelectAsset?: (symbol: string) => void;
}

export default function AssetTable({
  selectedAsset = "BTCUSDT",
  onSelectAsset,
}: AssetTableProps) {
  return (
    <div className="vault-card p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-serif text-lg text-white font-medium uppercase tracking-wider">
            Sovereign Custody Assets
          </h3>
          <p className="text-[10px] text-vault-silver/60 uppercase tracking-widest mt-0.5">
            Real-time Liquidity & Interactive 7D Horizon
          </p>
        </div>
        <span className="text-[10px] text-vault-gold border border-vault-border px-2.5 py-1 bg-vault-surface rounded-md">
          SECURE ENCLAVE
        </span>
      </div>

      <table className="w-full text-left font-mono text-xs border-separate border-spacing-y-1.5 table-fixed">
        <thead>
          <tr className="text-vault-silver/50 text-[10px] uppercase tracking-widest">
            <th className="pb-2 pl-6 w-[70px] font-normal">#</th>
            <th className="pb-2 w-[260px] font-normal">Asset</th>
            <th className="pb-2 w-[180px] font-normal">Mark Price</th>
            <th className="pb-2 w-[150px] font-normal">24h Net</th>
            <th className="pb-2 text-right pr-6 font-normal">
              7D Horizon Curve
            </th>
          </tr>
        </thead>
        <tbody>
          {mockAssets.map((asset, index) => {
            const isPos = asset.change24h >= 0;
            const isSelected =
              selectedAsset.toUpperCase() === asset.pairSymbol.toUpperCase();

            return (
              <tr
                key={asset.id}
                onClick={() => onSelectAsset && onSelectAsset(asset.pairSymbol)}
                className="group cursor-pointer transition-all duration-200"
              >
                {/* # Col */}
                <td
                  className={`py-3.5 pl-6 relative first:rounded-l-xl border-y first:border-l transition-all duration-200 ${
                    isSelected
                      ? "bg-vault-gold/[0.07] border-vault-gold/25"
                      : "bg-vault-surface/20 border-vault-border/40 group-hover:bg-vault-surface/50 group-hover:border-vault-border/80"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-vault-gold shadow-[0_0_8px_#C5A880] animate-pulse" />
                  )}
                  <span
                    className={
                      isSelected
                        ? "text-vault-gold font-bold"
                        : "text-vault-silver/40"
                    }
                  >
                    {index + 1}
                  </span>
                </td>

                {/* Asset Col */}
                <td
                  className={`py-3.5 border-y transition-all duration-200 ${
                    isSelected
                      ? "bg-vault-gold/[0.07] border-vault-gold/25"
                      : "bg-vault-surface/20 border-vault-border/40 group-hover:bg-vault-surface/50 group-hover:border-vault-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span
                        className={`font-medium tracking-wide ${isSelected ? "text-white" : "text-white/80"}`}
                      >
                        {asset.name}
                      </span>
                      <span className="text-[10px] text-vault-silver/50">
                        {asset.ticker} // USD
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-vault-gold/15 text-vault-gold border border-vault-gold/30 tracking-wider">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </td>

                {/* Price Col */}
                <td
                  className={`py-3.5 font-normal text-white tabular-nums border-y transition-all duration-200 ${
                    isSelected
                      ? "bg-vault-gold/[0.07] border-vault-gold/25"
                      : "bg-vault-surface/20 border-vault-border/40 group-hover:bg-vault-surface/50 group-hover:border-vault-border/80"
                  }`}
                >
                  $
                  {asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* 24h Net Col */}
                <td
                  className={`py-3.5 border-y transition-all duration-200 ${
                    isSelected
                      ? "bg-vault-gold/[0.07] border-vault-gold/25"
                      : "bg-vault-surface/20 border-vault-border/40 group-hover:bg-vault-surface/50 group-hover:border-vault-border/80"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] tabular-nums ${
                      isPos ? "text-vault-emerald" : "text-vault-rose"
                    }`}
                  >
                    {isPos ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {isPos ? "+" : ""}
                    {asset.change24h.toFixed(2)}%
                  </span>
                </td>

                {/* Sparkline Col */}
                <td
                  className={`py-3.5 text-right pr-6 last:rounded-r-xl border-y last:border-r transition-all duration-200 ${
                    isSelected
                      ? "bg-vault-gold/[0.07] border-vault-gold/25"
                      : "bg-vault-surface/20 border-vault-border/40 group-hover:bg-vault-surface/50 group-hover:border-vault-border/80"
                  }`}
                >
                  <InteractiveSparkline
                    points={asset.sparkline}
                    isPositive={isPos}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
