"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Lock,
  Shield,
  X,
} from "lucide-react";
import { useBinanceLive } from "@/hooks/useBinanceLive";
import { formatUsd } from "@/lib/assets";

interface ExecutionPadProps {
  isOpen: boolean;
  onClose: () => void;
  symbol?: string;
}

export default function ExecutionPad({
  isOpen,
  onClose,
  symbol = "BTCUSDT",
}: ExecutionPadProps) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [amount, setAmount] = useState<string>("0.50");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // ფასი ყოველთვის არჩეული აქტივის ლაივ ნაკადიდან მოდის
  const live = useBinanceLive(symbol);

  // ESC ღილაკით დახურვა
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseTicker = symbol.replace("USDT", "");
  const parsedAmount = parseFloat(amount) || 0;
  const parsedLimit = parseFloat(limitPrice) || 0;
  const effectivePrice = orderType === "LIMIT" ? parsedLimit : live.price;
  const totalValue = parsedAmount * effectivePrice;
  const feeEstimate = totalValue * 0.0004;
  const canExecute = parsedAmount > 0 && effectivePrice > 0 && !isExecuting;

  const selectOrderType = (type: "MARKET" | "LIMIT") => {
    setOrderType(type);
    // Limit-ზე გადასვლისას ველი მიმდინარე ფასით ივსება
    if (type === "LIMIT" && !limitPrice && live.price) {
      setLimitPrice(live.price.toFixed(2));
    }
  };

  const handleExecute = () => {
    if (!canExecute) return;
    setIsExecuting(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsExecuting(false);
      setSuccessMessage(
        orderType === "LIMIT"
          ? `LIMIT ${side} ${parsedAmount} ${baseTicker} @ $${formatUsd(parsedLimit)} // QUEUED`
          : `${side === "BUY" ? "ALLOCATED" : "DIVESTED"} ${parsedAmount} ${baseTicker} @ $${formatUsd(effectivePrice)} // T+0 SETTLED`,
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop (დაბურული ფონი) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#0E1015]/95 border-l border-vault-gold/20 p-6 md:p-8 overflow-y-auto flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 font-mono animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-vault-gold border border-vault-gold/30 px-2 py-0.5 bg-vault-surface rounded-md flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-vault-gold" />
                  ENCLAVE DESK
                </span>
                <span className="text-[10px] text-vault-silver/50 tracking-widest uppercase">
                  SWISS PRIVATE WEALTH
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white font-medium uppercase tracking-wider">
                OTC Allocation
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close OTC panel"
              className="p-1.5 rounded-lg border border-vault-border/80 text-vault-silver/60 hover:text-white hover:border-vault-gold/50 bg-vault-surface/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Asset Indicator */}
          <div className="p-3.5 bg-vault-surface/40 border border-vault-border/60 rounded-xl flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest block">
                Selected Target
              </span>
              <span className="text-white font-semibold text-sm tracking-wide">
                {symbol}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest block">
                Mark Telemetry
              </span>
              <span className="text-vault-gold font-medium tabular-nums">
                {live.price ? `$${formatUsd(live.price)}` : "SYNCING..."}
              </span>
            </div>
          </div>

          {/* Buy / Sell Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-vault-surface/50 border border-vault-border rounded-xl mb-5">
            <button
              onClick={() => setSide("BUY")}
              className={`py-2 text-[11px] tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                side === "BUY"
                  ? "bg-vault-emerald/15 text-vault-emerald border border-vault-emerald/40 font-semibold shadow-sm"
                  : "text-vault-silver/60 hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Allocate (Buy)
            </button>
            <button
              onClick={() => setSide("SELL")}
              className={`py-2 text-[11px] tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                side === "SELL"
                  ? "bg-vault-rose/15 text-vault-rose border border-vault-rose/40 font-semibold shadow-sm"
                  : "text-vault-silver/60 hover:text-white"
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              Divest (Sell)
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="flex justify-between items-center text-[10px] uppercase text-vault-silver/60 mb-3 px-1">
            <span>Routing Route</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectOrderType("MARKET")}
                className={`cursor-pointer ${orderType === "MARKET" ? "text-vault-gold font-bold underline underline-offset-4" : "hover:text-white"}`}
              >
                Instant Fill
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => selectOrderType("LIMIT")}
                className={`cursor-pointer ${orderType === "LIMIT" ? "text-vault-gold font-bold underline underline-offset-4" : "hover:text-white"}`}
              >
                Limit Block
              </button>
            </div>
          </div>

          {/* Limit Price Input (მხოლოდ Limit ორდერისთვის) */}
          {orderType === "LIMIT" && (
            <div className="mb-4">
              <label
                htmlFor="otc-limit-price"
                className="text-[10px] uppercase tracking-widest text-vault-silver/60 block mb-1.5"
              >
                Limit Price (USDT)
              </label>
              <div className="relative">
                <input
                  id="otc-limit-price"
                  type="number"
                  step="any"
                  min="0"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-vault-surface/60 border border-vault-border focus:border-vault-gold/60 rounded-xl px-4 py-3 text-sm text-white outline-none tabular-nums transition-colors"
                  placeholder="0.00"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-vault-silver/50 tracking-wider">
                  USDT
                </span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-5">
            <label
              htmlFor="otc-amount"
              className="text-[10px] uppercase tracking-widest text-vault-silver/60 block mb-1.5"
            >
              Volume ({baseTicker})
            </label>
            <div className="relative">
              <input
                id="otc-amount"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-vault-surface/60 border border-vault-border focus:border-vault-gold/60 rounded-xl px-4 py-3 text-sm text-white outline-none tabular-nums transition-colors"
                placeholder="0.00"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-vault-silver/50 tracking-wider">
                {baseTicker}
              </span>
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="p-4 bg-vault-surface/30 border border-vault-border/60 rounded-xl space-y-2.5 text-[11px] tabular-nums mb-5">
            <div className="flex justify-between text-vault-silver/60">
              <span>Settlement Venue</span>
              <span className="text-white">Zurich Enclave // Primary</span>
            </div>
            <div className="flex justify-between text-vault-silver/60">
              <span>Custody Routing Fee (4 bps)</span>
              <span className="text-white">${formatUsd(feeEstimate)}</span>
            </div>
            <div className="border-t border-vault-border/50 pt-2.5 flex justify-between font-medium">
              <span className="text-vault-gold uppercase text-[10px] tracking-widest">
                Gross Sovereign Value
              </span>
              <span className="text-white text-xs">
                ${formatUsd(totalValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div>
          {successMessage && (
            <div className="mb-3 px-3.5 py-2.5 bg-vault-emerald/10 border border-vault-emerald/30 rounded-xl text-vault-emerald text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="tracking-wide">{successMessage}</span>
            </div>
          )}

          <button
            onClick={handleExecute}
            type="button"
            disabled={!canExecute}
            className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              side === "BUY"
                ? "bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-vault-emerald/20"
                : "bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white shadow-vault-rose/20"
            } ${canExecute ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isExecuting
              ? "CRYPTOGRAPHIC SIGNING..."
              : `${side === "BUY" ? "Authorize Capital Allocation" : "Authorize Sovereign Divestment"}`}
          </button>

          <div className="mt-3 flex items-center justify-between text-[10px] text-vault-silver/40">
            <span>SLA: INSTANT FINALITY</span>
            <span>ESC TO DISMISS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
