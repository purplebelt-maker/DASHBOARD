// components/landing/ProblemSection.tsx
"use client";

import { X, Clock, TrendingDown, Frown } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: <X className="w-8 h-8" />,
      title: "Drowning in Sports Bets",
      description: "Endless scrolling through irrelevant sports markets when you only care about politics, crypto, and finance.",
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Always Late to Markets",
      description: "By the time you discover new prediction markets, early traders have already captured the best odds.",
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Missing Profitable Opportunities",
      description: "No way to filter by volume, liquidity, or ending date means you're trading blind without key metrics.",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: <Frown className="w-8 h-8" />,
      title: "Cluttered, Overwhelming Interface",
      description: "Polymarket's native UI shows everything at once, making it impossible to focus on what matters to you.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidde">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <X className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-300">
              The Problem
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trading on Polymarket
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {`Shouldn't Be This Hard`}
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {`You're wasting hours navigating through noise when you should be making profitable trades.`}
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${problem.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />

              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${problem.bgColor} border ${problem.borderColor} rounded-xl mb-6 text-white bg-gradient-to-br ${problem.color}`}>
                  {problem.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {problem.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">
            {`Sound familiar? There's a better way. 👇`}
          </p>
        </div>
      </div>
    </section>
  );
}