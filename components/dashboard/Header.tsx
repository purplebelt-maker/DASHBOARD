"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { Info } from "lucide-react";

function Header() {
  const { theme } = useTheme();
  const logoSrc = "/updated-logo.png";
  const [showTooltip, setShowTooltip] = useState(false);

  const fullMessage =
    "Prediction Market Edge's Exclusive Dashboard – Live Polymarket Odds on Finance, Politics & Macro, (No Sports Noise) • 2-Minute Auto-Refreshing • Exclusive 'Deadline Tracker' for Events Closing in the Next Week, Day, even 24 Hours...";

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-lg bg-slate-100 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-600 shadow-md dark:shadow-none px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Section */}
          <div
            className="flex items-center justify-center relative mb-2"
            style={{ height: "64px" }}
          >
            <Image
              src={logoSrc}
              alt="Prediction Market Edge Logo"
              width={200}
              height={64}
              className="h-auto w-auto max-h-12 sm:max-h-16 object-contain"
              priority
            />
          </div>

          {/* Main Title Section */}
          <div className="text-center w-full max-w-4xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl transition-colors duration-300">
                Prediction Market Edge Dashboard
              </h1>

              {/* Info Icon with Tooltip */}
              <div className="relative">
                <button
                  className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="More information"
                >
                  <Info size={16} />
                </button>

                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 sm:w-96 z-50">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 animate-in fade-in-0 zoom-in-95">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fullMessage}
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 rotate-45" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mx-auto mb-4" />

            {/* Main Value Proposition - Clean and Elegant */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                Exclusive Live Polymarket Odds — Finance, Politics & Macro Focus
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>No Sports Noise</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>2-Minute Auto-Refresh</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Deadline Tracker</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    24h to 7 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default memo(Header);
