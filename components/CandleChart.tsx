"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  CandlestickData,
  UTCTimestamp,
} from "lightweight-charts";
import { BINANCE_REST, BINANCE_WS } from "@/lib/assets";
import { openReconnectingSocket } from "@/lib/reconnectingSocket";

interface CandleChartProps {
  symbol?: string;
}

const TIMEFRAMES = [
  { label: "15M", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
];

// Binance kline REST მასივი: [openTime, open, high, low, close, ...]
type RestKline = [number, string, string, string, string, ...unknown[]];

// Binance kline WS შეტყობინება
interface KlineMessage {
  k?: { t: number; o: string; h: string; l: string; c: string };
}

function toCandle(
  t: number,
  o: string,
  h: string,
  l: string,
  c: string,
): CandlestickData<UTCTimestamp> {
  return {
    time: (t / 1000) as UTCTimestamp,
    open: parseFloat(o),
    high: parseFloat(h),
    low: parseFloat(l),
    close: parseFloat(c),
  };
}

export default function CandleChart({ symbol = "BTCUSDT" }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<string>("1h");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let isMounted = true;
    let closeSocket: (() => void) | null = null;

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
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

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#E11D48",
      borderUpColor: "#10B981",
      borderDownColor: "#E11D48",
      wickUpColor: "#10B981",
      wickDownColor: "#E11D48",
    });

    setIsLoading(true);
    setHasError(false);

    fetch(
      `${BINANCE_REST}/klines?symbol=${symbol}&interval=${interval}&limit=100`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: RestKline[]) => {
        if (!isMounted) return;
        candleSeries.setData(
          data.map((d) => toCandle(d[0], d[1], d[2], d[3], d[4])),
        );
        chart.timeScale().fitContent();

        // ისტორიის შემდეგ ბოლო სანთელი ლაივად ახლდება
        closeSocket = openReconnectingSocket(
          `${BINANCE_WS}/ws/${symbol.toLowerCase()}@kline_${interval}`,
          {
            onMessage: (msg) => {
              const k = (msg as KlineMessage).k;
              if (isMounted && k)
                candleSeries.update(toCandle(k.t, k.o, k.h, k.l, k.c));
            },
          },
        );
      })
      .catch((err) => {
        console.error("Klines fetch error:", err);
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      closeSocket?.();
      chart.remove();
    };
  }, [symbol, interval]);

  return (
    <div className="vault-card p-4 md:p-6 h-[380px] md:h-[460px] flex flex-col justify-between overflow-hidden relative">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-white font-medium uppercase tracking-wider">
            {`${symbol} // Market Telemetry`}
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
                type="button"
                onClick={() => setInterval(tf.value)}
                aria-pressed={isActive}
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

      <div className="relative w-full flex-1 rounded-lg overflow-hidden">
        <div ref={chartContainerRef} className="absolute inset-0" />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-vault-rose">
            MARKET DATA UNAVAILABLE // RETRY BY SWITCHING TIMEFRAME
          </div>
        )}
      </div>
    </div>
  );
}
