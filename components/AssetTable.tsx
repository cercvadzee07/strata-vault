"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useBinanceLive } from "@/hooks/useBinanceLive";
import {
  BINANCE_REST,
  VAULT_ASSETS,
  VaultAsset,
  formatUsd,
} from "@/lib/assets";

// 7 დღე 4-საათიანი სანთლებით = 42 წერტილი
function use7dHistory(pair: string): number[] {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch(`${BINANCE_REST}/klines?symbol=${pair}&interval=4h&limit=42`)
      .then((res) => res.json())
      .then((data: unknown) => {
        if (!isMounted || !Array.isArray(data)) return;
        setPoints(data.map((k: string[]) => parseFloat(k[4])));
      })
      .catch((err) => console.warn("Sparkline fetch error:", err));
    return () => {
      isMounted = false;
    };
  }, [pair]);

  return points;
}

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

  if (points.length < 2) {
    return (
      <span className="inline-block h-[34px] w-[120px] rounded bg-vault-surface/60 animate-pulse align-middle" />
    );
  }

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
          ${formatUsd(points[hoverIndex])}
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
          {VAULT_ASSETS.map((asset, index) => (
            <AssetTableRow
              key={asset.pair}
              asset={asset}
              index={index}
              isSelected={selectedAsset.toUpperCase() === asset.pair}
              onSelect={() => onSelectAsset?.(asset.pair)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssetTableRow({
  asset,
  index,
  isSelected,
  onSelect,
}: {
  asset: VaultAsset;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const live = useBinanceLive(asset.pair);
  const history = use7dHistory(asset.pair);
  // ბოლო წერტილი ყოველთვის ლაივ ფასია
  const points =
    history.length && live.price
      ? [...history.slice(0, -1), live.price]
      : history;
  const isPos = live.change24h >= 0;

  return (
    <tr
      onClick={onSelect}
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
            isSelected ? "text-vault-gold font-bold" : "text-vault-silver/40"
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
              {`${asset.ticker} // USD`}
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
        {live.price ? (
          <span
            className={`transition-colors duration-200 ${
              live.direction === "up"
                ? "text-vault-emerald"
                : live.direction === "down"
                  ? "text-vault-rose"
                  : ""
            }`}
          >
            ${formatUsd(live.price)}
          </span>
        ) : (
          <span className="inline-block h-3 w-20 rounded bg-vault-surface animate-pulse" />
        )}
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
          {live.change24h.toFixed(2)}%
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
        <InteractiveSparkline points={points} isPositive={isPos} />
      </td>
    </tr>
  );
}
