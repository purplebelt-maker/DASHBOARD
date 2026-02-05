// components/landing/FeaturesSection.tsx
"use client";

import { Bell, Filter, Zap, TrendingUp, Mail, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Instant Email Alerts",
      description: "Get notified within minutes when new prediction markets open. Be the first to spot opportunities.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Smart Filtering",
      description: "Filter markets by ending date (7d, 14d, 30d+). Focus only on timeframes that match your strategy.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Advanced Sorting",
      description: "Sort by 24h volume, total volume, or liquidity. Find the most active markets instantly.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Category Focus",
      description: "Filter by Politics, Crypto, Tech, Finance, Economy, Geopolitics. Zero sports clutter.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Updates",
      description: "Live market data that refreshes automatically. Never miss a price movement or volume spike.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Clean Interface",
      description: "Distraction-free dashboard built for serious traders. Only the data that matters.",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">
              Features
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {`Nothing You Don't`}
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A powerful dashboard designed specifically for serious prediction market traders.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />

              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} border ${feature.borderColor} rounded-xl mb-6 text-white bg-gradient-to-br ${feature.color}`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">15min</div>
            <div className="text-sm text-gray-400">Alert Speed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">6+</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">Real-time</div>
            <div className="text-sm text-gray-400">Market Data</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">Zero</div>
            <div className="text-sm text-gray-400">Sports Noise</div>
          </div>
        </div>
      </div>
    </section>
  );
}