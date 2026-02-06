// components/landing/EmailAlertsSection.tsx
"use client";

import { Bell, Zap, Clock, TrendingUp, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailAlertsSection() {
  const router = useRouter();

  const benefits = [
    "Get notified about new markets daily",
    "Filter alerts by your preferred categories",
    "Never miss high-volume opportunities",
    "Customize alert frequency and preferences",
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">
                Your Competitive Edge
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Be The First
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                To Every Market
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-400 mb-8">
              {`Get daily email notifications when new prediction markets open. 
              While others are still browsing, you're already analyzing and positioning.`}
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-white mb-1">Daily</div>
                <div className="text-sm text-gray-400">Email Alerts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Coverage</div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/auth")}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all inline-flex items-center gap-2"
            >
              Enable Alerts Now
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main alert card */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Market Alerts</div>
                    <div className="text-xs text-gray-400">Real-time notifications</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              {/* Alert items */}
              <div className="space-y-3">
                {/* Alert 1 - New */}
                <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 animate-slide-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">New Market</span>
                        <span className="px-2 py-0.5 bg-blue-500/20 rounded-full text-xs text-blue-300">Politics</span>
                        <span className="text-xs text-gray-400 ml-auto">2m ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        2024 Election: Will Trump win Pennsylvania?
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Volume: $0</span>
                        <span>Liquidity: $50K</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">High Volume</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-300">Crypto</span>
                        <span className="text-xs text-gray-400 ml-auto">15m ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Bitcoin above $100K by March?
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Volume: $2.4M</span>
                        <span className="text-green-400">↑ 234%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">Ending Soon</span>
                        <span className="px-2 py-0.5 bg-orange-500/20 rounded-full text-xs text-orange-300">Tech</span>
                        <span className="text-xs text-gray-400 ml-auto">1h ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Apple Vision Pro sales hit 1M units?
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Ends in 6 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-6 -right-6 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 shadow-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">247</div>
                <div className="text-xs text-gray-300">Alerts sent</div>
                <div className="text-xs text-green-400">This week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}