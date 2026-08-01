/* GG Trading Features Section
   Design: Violet primary, blue balance, green indicators
   Red used ONLY where semantically appropriate (risk/loss)
   Copy: Futures & Options on Nasdaq, S&P 500, Commodities
   Mobile: single column, responsive grid */

import { Brain, BarChart3, Zap, Users, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Brain size={26} />,
    title: "Fair Value Gap Signals",
    description:
      "We run the FVG indicator on 5-minute and 45-minute timeframes — Brandon's primary setup. When price creates a 3-candle imbalance, we flag it before the fill. These gaps are respected with remarkable consistency on NQ and ES every session.",
    panelClass: "gg-panel",
    iconColor: "text-[oklch(0.62_0.22_292)]",
    glowColor: "oklch(0.48 0.26 292 / 20%)",
  },
  {
    icon: <Zap size={26} />,
    title: "EMA Crossover Strategy",
    description:
      "Fast/slow EMA pairs give directional bias before the move. When the fast EMA crosses above, we look for longs on MNQ and MES. Simple, repeatable, and delivering a 70%+ baseline win rate on crossover setups — the foundation of every trade plan.",
    panelClass: "gg-panel-blue",
    iconColor: "text-[oklch(0.65_0.18_258)]",
    glowColor: "oklch(0.50 0.22 258 / 20%)",
  },
  {
    icon: <BarChart3 size={26} />,
    title: "6:30 AM Opening Range Breakout",
    description:
      "Brandon's highest-probability morning setup. Box the 6:30–6:45 AM candle, mark the midline, wait for breakout and retest. This single setup reports an 8–9 out of 10 success rate — and it's the first trade we look for every single session.",
    panelClass: "gg-panel-green",
    iconColor: "text-[oklch(0.68_0.19_162)]",
    glowColor: "oklch(0.68 0.19 162 / 20%)",
  },
  {
    icon: <TrendingUp size={26} />,
    title: "TradingView Chart Mastery",
    description:
      "We teach you to set up TradingView the right way — Electronic Trading Hours, hollow candles, clean canvas. The exact chart layout Brandon uses live, with every indicator configured as he runs it on MNQ and MES. Free version is all you need to start.",
    panelClass: "gg-panel",
    iconColor: "text-[oklch(0.62_0.22_292)]",
    glowColor: "oklch(0.48 0.26 292 / 20%)",
  },
  {
    icon: <Users size={26} />,
    title: "Live Streams & Bar Replay Practice",
    description:
      "Watch Brandon trade live on YouTube and Kick — every entry, stop, and target explained in real time. Use TradingView's Bar Replay mode to practice the same setups risk-free. Paper trade until your edge is proven before going live.",
    panelClass: "gg-panel-blue",
    iconColor: "text-[oklch(0.65_0.18_258)]",
    glowColor: "oklch(0.50 0.22 258 / 20%)",
  },
  {
    icon: <Shield size={26} />,
    title: "Micro Contracts & 2:1 Risk Rules",
    description:
      "Start with MNQ ($2/point) and MES instead of full-size contracts. Every trade requires a minimum 2:1 risk/reward — non-negotiable. We use the Position Tool on TradingView to visualize risk before entering. Protecting capital is rule one.",
    panelClass: "gg-panel-green",
    iconColor: "text-[oklch(0.68_0.19_162)]",
    glowColor: "oklch(0.68 0.19 162 / 20%)",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 neural-grid opacity-10" />

      <div className="container relative z-10">
        <div className="mb-10 sm:mb-16 max-w-2xl">
          <span className="text-xs font-mono tracking-widest uppercase text-[oklch(0.62_0.22_292)] mb-3 block">
            Platform Features
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Edge in
            <br />
            <span className="gradient-text-violet-green">Every Market</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            Built for traders who specialize in index futures and options; where liquidity is
            deep, patterns are reliable, and AI-driven precision pays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`${feature.panelClass} p-5 sm:p-6 group transition-all duration-300 cursor-default`}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.01)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${feature.glowColor}, 0 8px 30px oklch(0 0 0 / 30%)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div className={`${feature.iconColor} mb-3 sm:mb-4 opacity-90 group-hover:opacity-100 transition-opacity`}>
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/55 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
