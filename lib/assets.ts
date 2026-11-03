export interface VaultAsset {
  pair: string; // Binance-ის წყვილი, მაგ. "BTCUSDT"
  ticker: string;
  name: string;
}

// ყველა აქტივი, რომელიც ტერმინალში ლაივ ნაკადით მოდის
export const VAULT_ASSETS: VaultAsset[] = [
  { pair: "BTCUSDT", ticker: "BTC", name: "Bitcoin Core" },
  { pair: "ETHUSDT", ticker: "ETH", name: "Ethereum Network" },
  { pair: "SOLUSDT", ticker: "SOL", name: "Solana Consensus" },
  { pair: "PAXGUSDT", ticker: "PAXG", name: "Sovereign Gold (XAU)" },
  { pair: "BNBUSDT", ticker: "BNB", name: "Binance Sovereign" },
];

export const BINANCE_REST = "https://api.binance.com/api/v3";
// სტანდარტული 443 პორტი (VPN-ებზე და ფაირვოლებზე შეუფერხებლად მუშაობს)
export const BINANCE_WS = "wss://stream.binance.com";

export function formatUsd(value: number, digits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatCompactUsd(value: number): string {
  return value.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}
