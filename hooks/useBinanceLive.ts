"use client";

import { useState, useEffect } from "react";

export interface AssetTick {
  price: number;
  prevPrice: number;
  direction: "up" | "down" | "neutral";
}

export function useBinanceLive(symbol: string = "btcusdt") {
  const [data, setData] = useState<AssetTick>({
    price: 0,
    prevPrice: 0,
    direction: "neutral",
  });

  useEffect(() => {
    const cleanSymbol = symbol.toLowerCase().trim();
    const upperSymbol = symbol.toUpperCase().trim();
    let isMounted = true;
    let ws: WebSocket | null = null;

    // 1. მომენტალური საწყისი ფასი REST API-ით (რომ Loading არ გაიჭედოს)
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${upperSymbol}`)
      .then((res) => res.json())
      .then((initialData) => {
        if (isMounted && initialData?.price) {
          const initPrice = parseFloat(initialData.price);
          setData((prev) => ({
            price: initPrice,
            prevPrice: initPrice,
            direction: "neutral",
          }));
        }
      })
      .catch((err) => console.warn("Initial REST fetch error:", err));

    // 2. ცოცხალი ნაკადი სტანდარტული 443 პორტით (VPN-ებზე და ფაირვოლებზე შეუფერხებლად მუშაობს)
    const connectWs = () => {
      try {
        ws = new WebSocket(`wss://stream.binance.com/ws/${cleanSymbol}@ticker`);

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const msg = JSON.parse(event.data);
            if (msg && msg.c) {
              const currentPrice = parseFloat(msg.c);
              setData((prev) => {
                let dir: "up" | "down" | "neutral" = "neutral";
                if (prev.price !== 0 && currentPrice !== prev.price) {
                  dir = currentPrice > prev.price ? "up" : "down";
                }
                return {
                  price: currentPrice,
                  prevPrice: prev.price || currentPrice,
                  direction: dir,
                };
              });
            }
          } catch (e) {
            console.error("WS Parse Error", e);
          }
        };

        ws.onerror = (e) => {
          console.warn("WS error, retrying...", e);
        };
      } catch (err) {
        console.error("WS connection error:", err);
      }
    };

    connectWs();

    return () => {
      isMounted = false;
      if (ws) ws.close();
    };
  }, [symbol]);

  return data;
}
