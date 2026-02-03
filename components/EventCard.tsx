// components/events/EventCard.tsx
"use client";

import { memo, useMemo } from "react";
import { IEvent } from "@/types/events/state";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { calculateCountdown, formatCountdown } from "@/lib/utils/countdown";
import { getOutcomeProbabilities } from "@/lib/utils/probability";
import { EventCategory, EventCategorySlug } from "@/types/events/filters";

// Enhanced badge colors with better contrast and modern gradient options
export const EVENT_CATEGORY_BADGES: Record<
  EventCategory,
  {
    bg: string;
    text: string;
    gradient: string;
    shadow: string;
    border: string;
    icon?: string;
  }
> = {
  [EventCategory.Politics]: {
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    text: "text-white",
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
    border: "border-purple-400/30",
    icon: "🏛️",
  },

  [EventCategory.Geopolitics]: {
    bg: "bg-gradient-to-r from-indigo-500 to-blue-500",
    text: "text-white",
    gradient: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20",
    border: "border-indigo-400/30",
    icon: "🌍",
  },

  [EventCategory.Crypto]: {
    bg: "bg-gradient-to-r from-orange-500 to-amber-500",
    text: "text-white",
    gradient: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/20",
    border: "border-orange-400/30",
    icon: "₿",
  },

  [EventCategory.Tech]: {
    bg: "bg-gradient-to-r from-sky-500 to-cyan-400",
    text: "text-white",
    gradient: "from-sky-500 to-cyan-400",
    shadow: "shadow-sky-500/20",
    border: "border-sky-400/30",
    icon: "💻",
  },

  [EventCategory.World]: {
    bg: "bg-gradient-to-r from-emerald-500 to-green-400",
    text: "text-white",
    gradient: "from-emerald-500 to-green-400",
    shadow: "shadow-emerald-500/20",
    border: "border-emerald-400/30",
    icon: "🌎",
  },

  [EventCategory.Economy]: {
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    text: "text-gray-900",
    gradient: "from-yellow-500 to-yellow-400",
    shadow: "shadow-yellow-500/20",
    border: "border-yellow-400/30",
    icon: "📈",
  },

  [EventCategory.Finance]: {
    bg: "bg-gradient-to-r from-teal-500 to-emerald-400",
    text: "text-white",
    gradient: "from-teal-500 to-emerald-400",
    shadow: "shadow-teal-500/20",
    border: "border-teal-400/30",
    icon: "💰",
  },
};

const KNOWN_CATEGORY_IDS = new Set<number>(
  Object.values(EventCategory).filter((v) => typeof v === "number") as number[],
);

function getEventCategories(tagIds: number[]): EventCategory[] {
  return tagIds.filter((id) => KNOWN_CATEGORY_IDS.has(id)) as EventCategory[];
}

interface EventCardProps {
  event: IEvent;
}

function EventCard({ event }: EventCardProps) {
  const countdown = useMemo(
    () => calculateCountdown(event.endDate),
    [event.endDate],
  );

  const countdownText = useMemo(() => formatCountdown(countdown), [countdown]);

  const outcomes = useMemo(
    () => getOutcomeProbabilities(event.markets),
    [event.markets],
  );

  const outcome1Pct = Math.round((outcomes?.outcome1.probability ?? 0) * 100);
  const outcome2Pct = 100 - outcome1Pct;

  const categories = getEventCategories(event.tagIds);

  return (
    <div
      className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2236]
      shadow-sm hover:shadow-xl dark:shadow-gray-900/20 p-5 transition-all duration-300 hover:-translate-y-1
      hover:border-blue-300 dark:hover:border-blue-500/50
      hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 cursor-pointer
      before:absolute before:inset-0 before:rounded-xl before:border before:border-transparent before:transition-all
      before:duration-300 hover:before:border-blue-200/50 dark:hover:before:border-blue-500/20"
      onClick={() =>
        window.open(`https://polymarket.com/event/${event.slug}`, "_blank")
      }
    >
      {/* Title */}
      <h3
        className="text-gray-900 dark:text-white font-semibold pr-8"
        style={{ fontSize: "17px", marginBottom: "14px", lineHeight: 1.4 }}
      >
        {event.title}
      </h3>

      {/* Enhanced Categories */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat, i) => {
          const colors = EVENT_CATEGORY_BADGES[cat];

          return (
            <span
              key={i}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                text-xs font-semibold transition-all duration-200
                ${colors.bg} ${colors.text}
                border ${colors.border}
                shadow-sm ${colors.shadow}
                hover:scale-105 hover:shadow-md
                group-hover:brightness-110
                backdrop-blur-sm backdrop-saturate-150
              `}
            >
              {colors.icon && (
                <span className="text-xs opacity-90">{colors.icon}</span>
              )}
              {EventCategorySlug[cat]}
            </span>
          );
        })}
      </div>

      {/* Date */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-sm">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(event.endDate)}
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-medium text-xs mt-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {countdownText}
          </div>
        </div>
      </div>

      {/* Probability */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1a2236] rounded-xl p-4 mb-5 border border-gray-200 dark:border-gray-700">
        <div className="mb-3 flex justify-between items-center">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
            {outcomes?.outcome1.name || "Yes"} {outcome1Pct}%
          </span>
          <span className="text-gray-600 dark:text-gray-400 font-semibold">
            {outcomes?.outcome2.name || "No"} {outcome2Pct}%
          </span>
        </div>

        <div className="relative h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `${outcome1Pct}%` }}
          />
          <div className="absolute inset-0 rounded-full border border-gray-300/50 dark:border-gray-700/50 pointer-events-none" />
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Metric
          label="Liquidity"
          value={formatCurrency(event.liquidity)}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <Metric
          label="24H Volume"
          value={formatCurrency(event.volume24hr)}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
        <Metric
          label="Total Volume"
          value={formatCurrency(event.volumeTotal)}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Resolves via Polymarket API</span>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 uppercase text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

export default memo(EventCard);
