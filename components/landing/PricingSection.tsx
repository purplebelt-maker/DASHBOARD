// components/landing/PricingSection.tsx
"use client";

import { Check, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic email alerts",
        "Filter by 3 categories",
        "Sort by volume",
        "Market updates every hour",
        "Community support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious traders",
      features: [
        "Instant email alerts (15min)",
        "All 6+ categories",
        "Advanced sorting & filters",
        "Real-time market updates",
        "Priority support",
        "Custom alert preferences",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              Pricing
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Free,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Upgrade When Ready
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/20"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">/ {plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted
                        ? "bg-blue-500/20 border border-blue-500/30"
                        : "bg-green-500/20 border border-green-500/30"
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.highlighted ? "text-blue-400" : "text-green-400"
                      }`} />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => router.push("/auth")}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            All plans include 14-day free trial • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}