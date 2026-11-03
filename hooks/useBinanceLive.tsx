"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BINANCE_REST, BINANCE_WS, VAULT_ASSETS } from "@/lib/assets";
import { openReconnectingSocket, SocketStatus } from "@/lib/reconnectingSocket";

export interface AssetTick {
  price: number;
  prevPrice: number;
  direction: "up" | "down" | "neutral";
  change24h: number; // %
  volume24h: number; // USDT-ში
  high24h: number;
  low24h: number;
}

interface MarketData {
  ticks: Record<string, AssetTick>;
  status: SocketStatus;
}

const EMPTY_TICK: AssetTick = {
  price: 0,
  prevPrice: 0,
  direction: "neutral",
  change24h: 0,
  volume24h: 0,
  high24h: 0,
  low24h: 0,
};

const MarketDataContext = createContext<MarketData>({
  ticks: {},
  status: "connecting",
});

interface BinanceTicker {
  s: string; // symbol
  c: string; // last price
  P: string; // 24h change %
  q: string; // 24h quote volume
  h: string; // 24h high
  l: string; // 24h low
}

interface RestTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

function nextTick(
  prev: AssetTick | undefined,
  price: number,
  rest: Omit<AssetTick, "price" | "prevPrice" | "direction">,
): AssetTick {
  const last = prev?.price ?? 0;
  return {
    ...rest,
    price,
    prevPrice: last || price,
    direction:
      last === 0 || price === last ? "neutral" : price > last ? "up" : "down",
  };
}

/**
 * ერთი საერთო WebSocket კავშირი ყველა აქტივისთვის (combined stream),
 * ავტომატური reconnect-ით. ყველა კომპონენტი მონაცემებს აქედან კითხულობს.
 */
export function MarketDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ticks, setTicks] = useState<Record<string, AssetTick>>({});
  const [status, setStatus] = useState<SocketStatus>("connecting");

  useEffect(() => {
    let isMounted = true;
    const symbols = VAULT_ASSETS.map((a) => a.pair);

    // 1. მომენტალური საწყისი მონაცემები REST-ით, რომ "Loading" არ გაიჭედოს
    fetch(
      `${BINANCE_REST}/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`,
    )
      .then((res) => res.json())
      .then((list: RestTicker[]) => {
        if (!isMounted || !Array.isArray(list)) return;
        setTicks((prev) => {
          const next = { ...prev };
          for (const t of list) {
            if (next[t.symbol]?.price) continue; // WS უკვე უფრო ახალს გვაძლევს
            next[t.symbol] = nextTick(undefined, parseFloat(t.lastPrice), {
              change24h: parseFloat(t.priceChangePercent),
              volume24h: parseFloat(t.quoteVolume),
              high24h: parseFloat(t.highPrice),
              low24h: parseFloat(t.lowPrice),
            });
          }
          return next;
        });
      })
      .catch((err) => console.warn("Initial REST fetch error:", err));

    // 2. ცოცხალი ნაკადი
    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const close = openReconnectingSocket(
      `${BINANCE_WS}/stream?streams=${streams}`,
      {
        onStatus: (s) => isMounted && setStatus(s),
        onMessage: (msg) => {
          const data = (msg as { data?: BinanceTicker }).data;
          if (!isMounted || !data?.s || !data.c) return;
          setTicks((prev) => ({
            ...prev,
            [data.s]: nextTick(prev[data.s], parseFloat(data.c), {
              change24h: parseFloat(data.P),
              volume24h: parseFloat(data.q),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
            }),
          }));
        },
      },
    );

    return () => {
      isMounted = false;
      close();
    };
  }, []);

  return (
    <MarketDataContext.Provider value={{ ticks, status }}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useBinanceLive(symbol: string = "BTCUSDT"): AssetTick {
  const { ticks } = useContext(MarketDataContext);
  return ticks[symbol.toUpperCase()] ?? EMPTY_TICK;
}

export function useStreamStatus(): SocketStatus {
  return useContext(MarketDataContext).status;
}
