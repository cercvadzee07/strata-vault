"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import ExecutionPad from "@/components/ExecutionPad";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldCheck,
  Filter,
  ExternalLink,
} from "lucide-react";

interface SettlementTransaction {
  id: string;
  txHash: string;
  timestamp: string;
  type: "INFLOW" | "ALLOCATION" | "SWAP" | "ESCROW_RELEASE";
  asset: string;
  amount: string;
  valueUsd: string;
  senderRoute: string;
  receiverRoute: string;
  status: "SETTLED T+0" | "PROCESSING" | "CLEARING";
}

const TRANSACTIONS: SettlementTransaction[] = [
  {
    id: "tx-1",
    txHash: "0x7c4f...a92e",
    timestamp: "14:42:08 UTC",
    type: "ALLOCATION",
    asset: "BTC",
    amount: "140.00 BTC",
    valueUsd: "$11,256,000",
    senderRoute: "Zurich Enclave // Primary",
    receiverRoute: "Gotthard Granite Redoubt",
    status: "SETTLED T+0",
  },
  {
    id: "tx-2",
    txHash: "0x3b1d...5e81",
    timestamp: "14:18:22 UTC",
    type: "INFLOW",
    asset: "USDC",
    amount: "4,500,000 USDC",
    valueUsd: "$4,500,000",
    senderRoute: "Swiss National Clearing",
    receiverRoute: "Geneva Lake Depository",
    status: "SETTLED T+0",
  },
  {
    id: "tx-3",
    txHash: "0x9e2a...c044",
    timestamp: "13:55:10 UTC",
    type: "SWAP",
    asset: "ETH / PAXG",
    amount: "850 ETH → 1,120 PAXG",
    valueUsd: "$3,068,500",
    senderRoute: "Zurich Cold Pool",
    receiverRoute: "Physical Gold Vault #4",
    status: "SETTLED T+0",
  },
  {
    id: "tx-4",
    txHash: "0x11ab...ff32",
    timestamp: "13:12:47 UTC",
    type: "ESCROW_RELEASE",
    asset: "SOL",
    amount: "12,400 SOL",
    valueUsd: "$2,212,160",
    senderRoute: "Institutional OTC Escrow",
    receiverRoute: "Client Vault Tier-1",
    status: "SETTLED T+0",
  },
  {
    id: "tx-5",
    txHash: "0x5d80...11bc",
    timestamp: "12:40:02 UTC",
    type: "ALLOCATION",
    asset: "BTC",
    amount: "45.50 BTC",
    valueUsd: "$3,658,200",
    senderRoute: "Gotthard Redoubt",
    receiverRoute: "Liquid Reserve Buffer",
    status: "SETTLED T+0",
  },
];

export default function SettlementPage() {
  const [isExecutionOpen, setIsExecutionOpen] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const filteredTx =
    filter === "ALL"
      ? TRANSACTIONS
      : TRANSACTIONS.filter((t) => t.type === filter);

  return (
    <div className="min-h-screen font-mono text-xs selection:bg-vault-gold selection:text-black pb-16">
      {/* Global Navigation Header */}
      <Header onOpenOTC={() => setIsExecutionOpen(true)} />

      <main className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
        {/* Top Settlement Telemetry */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              24h Gross Settled Volume
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              $48,720,000<span className="text-vault-gold text-xl">.00</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% FINALITY GUARANTEE</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Average Clearing Latency
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              1.42<span className="text-vault-gold text-xl"> SEC</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/70 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-vault-gold" />
              <span>ATOMIC T+0 INTERNAL SWIFT/DLT</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Clearing Quorum Nodes
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              12 / 12<span className="text-vault-emerald text-xl"> ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ZURICH & GENEVA CONSENSUS</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Regulatory Compliance
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              T-0 AML<span className="text-vault-gold text-xl"> CLEARED</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/60 text-[11px]">
              <FileCheck className="w-3.5 h-3.5 text-vault-gold" />
              <span>TRAVEL RULE SYNCHRONIZED</span>
            </div>
          </div>
        </section>

        {/* Ledger Table Section */}
        <section className="vault-card p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-vault-border pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-vault-gold border border-vault-gold/30 px-2 py-0.5 bg-vault-surface rounded-md">
                  DLT / RTGS PROTOCOL
                </span>
                <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest">
                  Live Institutional Settlement Book
                </span>
              </div>
              <h3 className="font-serif text-xl text-white font-medium uppercase tracking-wider">
                Cryptographic Settlement Stream
              </h3>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-vault-surface/60 border border-vault-border/80 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-vault-silver/50 ml-2" />
              {["ALL", "ALLOCATION", "INFLOW", "SWAP", "ESCROW_RELEASE"].map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                      filter === f
                        ? "bg-vault-gold/20 text-vault-gold border border-vault-gold/40 shadow-sm font-semibold"
                        : "text-vault-silver/60 hover:text-white"
                    }`}
                  >
                    {f.replace("_", " ")}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-vault-border/60 text-[10px] uppercase tracking-wider text-vault-silver/50">
                  <th className="py-3 px-4">TX Hash / Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Asset & Amount</th>
                  <th className="py-3 px-4">Notional Value</th>
                  <th className="py-3 px-4">Route Architecture</th>
                  <th className="py-3 px-4 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vault-border/30">
                {filteredTx.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-vault-surface/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-white font-mono">
                        <span>{tx.txHash}</span>
                        <ExternalLink className="w-3 h-3 text-vault-silver/40 hover:text-vault-gold cursor-pointer" />
                      </div>
                      <span className="text-[10px] text-vault-silver/50">
                        {tx.timestamp}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[9px] rounded uppercase font-semibold border border-vault-border/80 bg-vault-surface/80 text-vault-gold">
                        {tx.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {tx.amount}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-sm text-vault-gold">
                      {tx.valueUsd}
                    </td>
                    <td className="py-3.5 px-4 text-vault-silver/70 text-[11px]">
                      <div className="flex items-center gap-1">
                        <span className="text-vault-silver/90">
                          {tx.senderRoute}
                        </span>
                        <span className="text-vault-silver/30">→</span>
                        <span className="text-white">{tx.receiverRoute}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-vault-emerald/10 border border-vault-emerald/30 text-vault-emerald font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Slide-Over Drawer */}
      <ExecutionPad
        isOpen={isExecutionOpen}
        onClose={() => setIsExecutionOpen(false)}
        symbol="BTCUSDT"
        currentPrice={80400}
      />
    </div>
  );
}
