// components/landing/Hero.tsx
"use client";

import { ArrowRight, Zap, Bell, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">
                Be First. Trade Smart.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Polymarket Events
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Without the Noise
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Get instant alerts on new markets. Filter by category, volume, and
              time. No sports. No clutter. Just the opportunities that matter.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">Live</span> market data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">Instant</span> email
                  alerts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">Advanced</span> filters
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.push("/auth")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  document.getElementById("dashboard-preview")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg transition-all duration-200"
              >
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">
                Trusted by traders worldwide
              </p>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                {/* Avatar stack */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    1,200+ Active Users
                  </p>
                  <p className="text-xs text-gray-400">Join the community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative lg:block hidden">
            {/* Floating cards animation */}
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 h-2 bg-white/20 rounded-full" />
                    <div className="w-16 h-2 bg-white/20 rounded-full" />
                  </div>
                </div>

                {/* Mock filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {["Politics", "Crypto", "Tech", "Finance"].map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-300 whitespace-nowrap"
                    >
                      {cat}
                    </div>
                  ))}
                </div>

                {/* Mock market cards */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-3/4 h-4 bg-white/30 rounded" />
                        <div className="w-12 h-6 bg-green-500/30 rounded-full" />
                      </div>
                      <div className="flex gap-4 mt-3">
                        <div className="w-20 h-3 bg-white/20 rounded" />
                        <div className="w-16 h-3 bg-white/20 rounded" />
                        <div className="w-24 h-3 bg-white/20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating alert card */}
              <div className="absolute -right-8 top-1/4 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white">
                    New Market Alert
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  2024 Election: New prediction market just opened
                </p>
                <div className="mt-2 flex gap-2">
                  <div className="flex-1 h-1 bg-blue-500 rounded-full" />
                  <div className="flex-1 h-1 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -left-8 bottom-1/4 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/20 rounded-xl p-4 shadow-2xl animate-float-delayed">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-white">
                    Volume 24h
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">$2.4M</p>
                <p className="text-xs text-green-400">↑ 23.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
