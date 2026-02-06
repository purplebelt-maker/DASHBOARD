// components/landing/FAQSection.tsx
"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How fast are the email alerts?",
      answer:
        "You'll receive email notifications within 15 minutes of a new market opening on Polymarket. This gives you a significant head start compared to manually browsing the platform.",
    },
    {
      question: "Can I filter which alerts I receive?",
      answer:
        "Yes! You can customize your alerts by category (Politics, Crypto, Tech, Finance, etc.), minimum volume thresholds, and more. Only get notified about markets that match your strategy.",
    },
    {
      question: "Do you really filter out all sports markets?",
      answer:
        "Absolutely. Our dashboard is built specifically for traders focused on Politics, Crypto, Tech, Finance, Economy, and Geopolitics. Zero sports clutter, guaranteed.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free plan includes basic email alerts, access to 3 categories, sorting by volume, and hourly market updates. It's perfect for casual traders who want to test the platform.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your Pro subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "How is this different from using Polymarket directly?",
      answer:
        "We provide a focused, noise-free interface with instant alerts, advanced filtering, and sorting options that Polymarket doesn't offer. Think of us as your trading assistant that saves you hours of browsing.",
    },
    {
      question: "Do I need a Polymarket account?",
      answer:
        "Yes, you'll still need a Polymarket account to actually trade. We provide the intelligence layer - showing you opportunities before others find them - but trades happen on Polymarket.",
    },
  ];

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">FAQ</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Questions?
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              We&apos;ve Got Answers
            </span>
          </h2>

          <p className="text-xl text-gray-400">
            Everything you need to know about our platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
