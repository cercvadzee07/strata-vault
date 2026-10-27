"use client";

import React, { useState, useEffect } from "react";

interface OrderLevel {
  price: number;
  amount: number;
  total: number;
}

export default function OrderBook({ symbol = "btcusdt" }: { symbol?: string }) {
  const [bids, setBids] = useState<OrderLevel[]>([]);
  const [asks, setAsks] = useState<OrderLevel[]>([]);
  const [spread, setSpread] = useState<number>(0);

  useEffect(() => {
    const cleanSymbol = symbol.toLowerCase().trim();
    const ws = new WebSocket(
      `wss://stream.binance.com/ws/${cleanSymbol}@depth10@1000ms`,
    );

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.bids && data.asks) {
          let bidTotal = 0;
          const parsedBids: OrderLevel[] = data.bids
            .slice(0, 6)
            .map((item: string[]) => {
              const price = parseFloat(item[0]);
              const amount = parseFloat(item[1]);
              bidTotal += amount;
              return { price, amount, total: bidTotal };
            });

          let askTotal = 0;
          const parsedAsks: OrderLevel[] = data.asks
            .slice(0, 6)
            .map((item: string[]) => {
              const price = parseFloat(item[0]);
              const amount = parseFloat(item[1]);
              askTotal += amount;
              return { price, amount, total: askTotal };
            });

          setBids(parsedBids);
          setAsks(parsedAsks);

          if (parsedBids.length > 0 && parsedAsks.length > 0) {
            setSpread(parsedAsks[0].price - parsedBids[0].price);
          }
        }
      } catch (err) {
        console.error("OrderBook WS parse error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const maxTotal = Math.max(
    bids.length > 0 ? bids[bids.length - 1].total : 1,
    asks.length > 0 ? asks[asks.length - 1].total : 1,
  );

  return (
    <div className="vault-card p-6 h-[460px] flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-serif text-lg text-white font-medium uppercase tracking-wider">
              Level-2 Order Flow
            </h3>
            <p className="text-[10px] text-vault-silver/60 uppercase tracking-widest mt-0.5">
              Live Depth & Institutional Book
            </p>
          </div>
          <span className="text-[10px] text-vault-gold border border-vault-border px-2 py-0.5 bg-vault-surface rounded-md">
            REALTIME L2
          </span>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-3 text-[10px] text-vault-silver/50 uppercase tracking-widest pb-2 border-b border-vault-border">
          <span>Price (USD)</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sells) */}
        <div className="flex flex-col-reverse gap-1 my-2">
          {asks.map((ask, idx) => {
            const depthPct = Math.min(100, (ask.total / maxTotal) * 100);
            return (
              <div
                key={idx}
                className="relative grid grid-cols-3 text-[11px] py-0.5 tabular-nums"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-vault-rose/15 pointer-events-none rounded-sm transition-all duration-300"
                  style={{ width: `${depthPct}%` }}
                />
                <span className="text-vault-rose font-medium z-10">
                  $
                  {ask.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-right text-white/80 z-10">
                  {ask.amount.toFixed(4)}
                </span>
                <span className="text-right text-vault-silver/60 z-10">
                  {ask.total.toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Spread Banner */}
        <div className="py-2 my-2 border-y border-vault-border/60 bg-vault-surface/40 flex justify-between items-center px-3 text-[11px] rounded">
          <span className="text-vault-silver/60 uppercase text-[10px] tracking-wider">
            Spread
          </span>
          <span className="text-vault-gold font-medium tabular-nums">
            ${spread > 0 ? spread.toFixed(2) : "0.00"}
          </span>
          <span className="text-vault-silver/60 text-[10px]">T+0 MATCH</span>
        </div>

        {/* Bids (Buys) */}
        <div className="flex flex-col gap-1 my-2">
          {bids.map((bid, idx) => {
            const depthPct = Math.min(100, (bid.total / maxTotal) * 100);
            return (
              <div
                key={idx}
                className="relative grid grid-cols-3 text-[11px] py-0.5 tabular-nums"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-vault-emerald/15 pointer-events-none rounded-sm transition-all duration-300"
                  style={{ width: `${depthPct}%` }}
                />
                <span className="text-vault-emerald font-medium z-10">
                  $
                  {bid.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-right text-white/80 z-10">
                  {bid.amount.toFixed(4)}
                </span>
                <span className="text-right text-vault-silver/60 z-10">
                  {bid.total.toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
