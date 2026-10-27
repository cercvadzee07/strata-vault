"use client";

import React, { useState } from "react";
import { Shield, Lock, CheckCircle2, Copy, Check } from "lucide-react";

interface VaultFacility {
  id: string;
  name: string;
  code: string;
  location: string;
  securityTier: string;
  coldAllocation: number;
  status: string;
  hsmNodes: number;
}

const FACILITIES: VaultFacility[] = [
  {
    id: "f1",
    name: "Zurich Enclave Prime",
    code: "ZRH-ALPHA-01",
    location: "Zurich Canton // Subterranean",
    securityTier: "MIL-SPEC TIER-4",
    coldAllocation: 54.5,
    status: "ONLINE // ISOLATED",
    hsmNodes: 8,
  },
  {
    id: "f2",
    name: "Gotthard Granite Redoubt",
    code: "ALPS-BUNKER-09",
    location: "Swiss Alps // Deep Mountain Granite",
    securityTier: "EMP-PROOF HARDENED",
    coldAllocation: 32.0,
    status: "ONLINE // ISOLATED",
    hsmNodes: 6,
  },
  {
    id: "f3",
    name: "Geneva Lake Depository",
    code: "GVA-LIQUID-03",
    location: "Geneva // Sovereign Clearing",
    securityTier: "FINMA REGULATED",
    coldAllocation: 13.5,
    status: "SYNCHRONIZED",
    hsmNodes: 4,
  },
];

export default function CustodyReserves() {
  const [copied, setCopied] = useState(false);
  const merkleRoot =
    "0x8fa3c04d1297e59bbf930e12d458602b910ca8e7368e7f82b7b5c192f153a019";

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(merkleRoot);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="vault-card p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-vault-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-vault-gold border border-vault-gold/30 px-2 py-0.5 bg-vault-surface rounded-md flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3 text-vault-gold" />
              FINMA / ISO-27001
            </span>
            <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest font-mono">
              Sovereign Proof of Reserves (PoR)
            </span>
          </div>
          <h3 className="font-serif text-xl text-white font-medium uppercase tracking-wider">
            Alpine Enclave Custody Architecture
          </h3>
        </div>

        {/* Global Reserve Ratio Pill */}
        <div className="flex items-center gap-4 bg-vault-surface/60 border border-vault-border/80 px-4 py-2.5 rounded-xl font-mono text-xs">
          <div>
            <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest block">
              Reserve Collateral
            </span>
            <span className="text-vault-emerald font-semibold text-sm">
              104.82% // FULLY BACKED
            </span>
          </div>
          <div className="h-7 w-[1px] bg-vault-border" />
          <div>
            <span className="text-[10px] text-vault-silver/60 uppercase tracking-widest block">
              Audit Epoch
            </span>
            <span className="text-white font-medium">T-30 RECONCILED</span>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FACILITIES.map((facility) => (
          <div
            key={facility.id}
            className="p-4 rounded-xl bg-vault-surface/30 border border-vault-border/70 hover:border-vault-gold/40 transition-all flex flex-col justify-between font-mono"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-vault-gold px-1.5 py-0.5 bg-vault-gold/10 border border-vault-gold/20 rounded">
                  {facility.code}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-vault-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-emerald animate-pulse" />
                  {facility.status}
                </span>
              </div>

              <h4 className="font-serif text-base text-white tracking-wide mt-2">
                {facility.name}
              </h4>
              <p className="text-[10px] text-vault-silver/50 tracking-wider uppercase mt-1">
                {facility.location}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-vault-border/40">
              <div className="flex justify-between items-center text-[10px] text-vault-silver/70 mb-1.5">
                <span>CUSTODY SHARE</span>
                <span className="text-white font-bold">
                  {facility.coldAllocation}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-vault-surface rounded-full overflow-hidden border border-vault-border/60">
                <div
                  className="h-full bg-gradient-to-r from-vault-gold to-[#e8c89b] rounded-full"
                  style={{ width: `${facility.coldAllocation}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-vault-silver/40 tracking-widest mt-2 uppercase">
                <span>{facility.securityTier}</span>
                <span>{facility.hsmNodes} HSM NODES</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Merkle Hash */}
      <div className="p-4 rounded-xl bg-vault-surface/40 border border-vault-border/80 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-lg bg-vault-gold/10 border border-vault-gold/30 text-vault-gold flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-vault-silver/60">
              Cryptographic Merkle Root Hash
            </div>
            <div className="text-white text-[11px] font-mono break-all select-all mt-0.5">
              {merkleRoot}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-vault-border hover:border-vault-gold/40 bg-vault-surface/60 hover:bg-vault-surface text-vault-silver/70 hover:text-white transition-all text-[11px] flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-vault-emerald" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "COPIED" : "COPY HASH"}</span>
          </button>

          <span className="text-[10px] px-2.5 py-1.5 rounded-lg bg-vault-emerald/10 border border-vault-emerald/30 text-vault-emerald flex items-center gap-1.5 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ZERO-KNOWLEDGE VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
}
