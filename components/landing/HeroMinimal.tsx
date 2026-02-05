// components/landing/HeroMinimal.tsx
"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroMinimal() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-300">
            Your Competitive Edge in Prediction Markets
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
          Trade Polymarket
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Before Everyone Else
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Get instant email alerts on new markets. Filter out the noise.
          <br className="hidden md:block" />
          Focus on Politics, Crypto, Tech, and Finance.
        </p>

        {/* Single CTA */}
        <button
          onClick={() => router.push("/auth")}
          className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-3"
        >
          Start Getting Alerts
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>

        {/* Trust signal */}
        <p className="mt-8 text-sm text-gray-400">
          No credit card required • Free forever • Cancel anytime
        </p>
      </div>
    </section>
  );
}
