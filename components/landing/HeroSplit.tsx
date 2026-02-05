// components/landing/HeroSplit.tsx
"use client";

import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSplit() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Never Miss a
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Profitable Market
              </span>
              <br />
              Again
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Instant alerts. Smart filters. Zero noise. Everything you need to
              stay ahead on Polymarket.
            </p>

            {/* Feature list */}
            <div className="space-y-3 mb-8">
              {[
                "Email alerts for new markets (15 min head start)",
                "Filter by Politics, Crypto, Tech, Finance, Economy",
                "Sort by volume, liquidity, ending date",
                "Zero sports betting clutter",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/auth")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            {/* You can replace this with an actual screenshot or video */}
            <div className="relative aspect-[4/3] backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Placeholder - replace with your dashboard screenshot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-gray-400">Dashboard Preview</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/20 rounded-xl p-6 shadow-2xl">
              <p className="text-sm text-gray-300 mb-1">Active Alerts</p>
              <p className="text-3xl font-bold text-white">247</p>
              <p className="text-sm text-green-400">↑ This week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
