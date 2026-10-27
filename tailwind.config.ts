import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          base: "#08090C", // ღრმა შავი ობსიდიანი (მთავარი ფონი)
          panel: "#0F1117", // პანელის ზედაპირი
          surface: "#151821", // ბარათების/ღილაკების ფონი
          border: "rgba(255, 255, 255, 0.07)", // თხელი 1px-იანი ჩარჩო
          gold: "#C5A880", // დავარცხნილი შამპანურისფერი ოქრო
          goldMuted: "#8E7758",
          silver: "#8A94A6", // ტიტანისფერი ნაცრისფერი
          emerald: "#10B981", // მოგების რბილი ზურმუხტისფერი
          rose: "#E11D48", // კლების ბურგუნდიული წითელი
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
