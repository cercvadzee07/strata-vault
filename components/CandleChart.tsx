"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
} from "lightweight-charts";

interface CandleChartProps {
  symbol?: string;
}

const TIMEFRAMES = [
  { label: "15M", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
];

export default function CandleChart({ symbol = "BTCUSDT" }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<string>("1h");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let isMounted = true;
    let chart: IChartApi | null = null;

    try {
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#8A94A6",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: "rgba(255, 255, 255, 0.03)" },
          horzLines: { color: "rgba(255, 255, 255, 0.03)" },
        },
        crosshair: {
          vertLine: { color: "#C5A880", width: 1, style: 2 },
          horzLine: { color: "#C5A880", width: 1, style: 2 },
        },
        rightPriceScale: {
          borderColor: "rgba(255, 255, 255, 0.07)",
        },
        timeScale: {
          borderColor: "rgba(255, 255, 255, 0.07)",
          timeVisible: true,
          secondsVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
          minBarSpacing: 3,
          rightOffset: 2,
        },
      });

      const candleSeries = (chart as any).addCandlestickSeries
        ? (chart as any).addCandlestickSeries({
            upColor: "#10B981",
            downColor: "#E11D48",
            borderUpColor: "#10B981",
            borderDownColor: "#E11D48",
            wickUpColor: "#10B981",
            wickDownColor: "#E11D48",
          })
        : chart.addSeries(CandlestickSeries, {
            upColor: "#10B981",
            downColor: "#E11D48",
            borderUpColor: "#10B981",
            borderDownColor: "#E11D48",
            wickUpColor: "#10B981",
            wickDownColor: "#E11D48",
          });

      setIsLoading(true);

      fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (!isMounted || !chart) return;
          if (Array.isArray(data)) {
            const formattedData = data.map((d: any) => ({
              time: (d[0] / 1000) as any,
              open: parseFloat(d[1]),
              high: parseFloat(d[2]),
              low: parseFloat(d[3]),
              close: parseFloat(d[4]),
            }));
            candleSeries.setData(formattedData);
            chart.timeScale().fitContent();
          }
        })
        .catch((err) => console.error("Klines fetch error:", err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        isMounted = false;
        window.removeEventListener("resize", handleResize);
        chart?.remove();
      };
    } catch (err) {
      console.error("Chart init error:", err);
    }
  }, [symbol, interval]);

  return (
    <div className="vault-card p-6 h-[460px] flex flex-col justify-between overflow-hidden relative">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-white font-medium uppercase tracking-wider">
            {symbol} // Market Telemetry
          </span>
          {isLoading && (
            <span className="text-[10px] text-vault-gold animate-pulse">
              SYNCING...
            </span>
          )}
        </div>

        {/* Timeframe Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-vault-surface/60 border border-vault-border/80 rounded-lg">
          {TIMEFRAMES.map((tf) => {
            const isActive = interval === tf.value;
            return (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all cursor-pointer ${
                  isActive
                    ? "bg-vault-gold/20 text-vault-gold border border-vault-gold/40 shadow-sm"
                    : "text-vault-silver/60 hover:text-white hover:bg-vault-surface/40"
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className="w-full flex-1 rounded-lg overflow-hidden"
      />
    </div>
  );
}
