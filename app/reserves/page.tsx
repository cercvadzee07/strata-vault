"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import CustodyReserves from "@/components/CustodyReserves";
import ExecutionPad from "@/components/ExecutionPad";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  Database,
  KeyRound,
} from "lucide-react";

export default function ReservesPage() {
  const [isExecutionOpen, setIsExecutionOpen] = useState(false);

  return (
    <div className="min-h-screen font-mono text-xs selection:bg-vault-gold selection:text-black pb-16">
      {/* Global Navigation Header */}
      <Header onOpenOTC={() => setIsExecutionOpen(true)} />

      {/* Main Reserves Content */}
      <main className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
        {/* Top Audit KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Audited Sovereign Reserve
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              $19,340,500<span className="text-vault-gold text-xl">.00</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>104.82% COLLATERALIZED</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Deep Cold Isolation
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              94.20<span className="text-vault-gold text-xl">%</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/70 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-vault-gold" />
              <span>AIR-GAPPED HARDWARE HSM</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Multi-Sig Quorum Scheme
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              5 of 8<span className="text-vault-silver/40 text-xl"> KEYS</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-emerald text-[11px]">
              <KeyRound className="w-3.5 h-3.5" />
              <span>DISTRIBUTED GEOGRAPHICALLY</span>
            </div>
          </div>

          <div className="p-6 vault-card">
            <div className="text-[10px] uppercase tracking-wider text-vault-silver/70 mb-2">
              Compliance Standard
            </div>
            <div className="font-serif text-3xl md:text-4xl text-white font-normal tabular-nums mb-3">
              FINMA<span className="text-vault-gold text-xl"> / ISAE 3402</span>
            </div>
            <div className="flex items-center gap-1.5 text-vault-silver/60 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-vault-gold" />
              <span>T-30 CONTINUOUS AUDIT</span>
            </div>
          </div>
        </section>

        {/* Alpine Enclave Core Architecture */}
        <section>
          <CustodyReserves />
        </section>

        {/* Security & Cryptographic Topology */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vault-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-vault-gold">
                <Database className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold">
                  Zero-Knowledge Proof Verification (zk-SNARKs)
                </span>
              </div>
              <p className="text-vault-silver/70 leading-relaxed text-[11px] mt-2">
                All client balances are cryptographically hashed into an
                immutable Merkle Tree structure. Sovereign entities can verify
                their solvency independently without exposing individual wallet
                addresses, transaction volumes, or institutional counterparty
                details.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-vault-border/60 flex items-center justify-between text-[10px] text-vault-silver/60">
              <span>ALGORITHM: SHA-256 + BLAKE3</span>
              <span className="text-vault-emerald">ATTESTED STATE: VALID</span>
            </div>
          </div>

          <div className="vault-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-vault-gold">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-semibold">
                  Sovereign Enclave Access Protocol
                </span>
              </div>
              <p className="text-vault-silver/70 leading-relaxed text-[11px] mt-2">
                Withdrawals exceeding $5,000,000 require asynchronous
                dual-custody authorization with physical biometric clearance
                inside the Zurich or Gotthard bunker infrastructure. Timelock
                buffer is enforced at 24 hours (T+1).
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-vault-border/60 flex items-center justify-between text-[10px] text-vault-silver/60">
              <span>TIMELOCK: 24H DELAY (T+1)</span>
              <span className="text-vault-emerald">ESCROW PROTOCOL ACTIVE</span>
            </div>
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
