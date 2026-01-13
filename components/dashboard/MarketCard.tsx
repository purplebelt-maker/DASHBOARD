'use client'

import { Market } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { calculateCountdown, formatCountdown } from '@/lib/utils/countdown'
import CategoryTag from './CategoryTag'
import StatusBadge from './StatusBadge'

interface MarketCardProps {
  market: Market
}

export default function MarketCard({ market }: MarketCardProps) {
  const countdown = calculateCountdown(market.endDate)
  const yesPercent = Math.round(market.probabilityYes)
  const noPercent = Math.round(market.probabilityNo)
  const total = yesPercent + noPercent
  const yesWidth = total > 0 ? (yesPercent / total) * 100 : 0

  return (
    <div className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-[#1e293b] shadow-sm dark:shadow-none p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 dark:hover:border-[#60a5fa] hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10">
      {/* Question - Alone at top */}
      <h3
        className="text-gray-900 dark:text-white font-semibold transition-colors duration-300"
        style={{
          fontSize: '17px',
          marginBottom: '10px',
          lineHeight: 1.4,
        }}
      >
        {market.question}
      </h3>

      {/* Category - Reduced gap */}
      <div className="mb-3">
        <CategoryTag category={market.category} />
      </div>

      {/* Date, Countdown and Status - Together */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Resolution Date */}
          <div
            className="text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-300"
            style={{
              fontSize: '14px',
              marginBottom: '4px',
            }}
          >
            {formatDate(market.endDate)}
          </div>

          {/* Closing Time - Orange */}
          <div
            className="text-orange-500 font-medium transition-colors duration-300"
            style={{
              fontSize: '12px',
            }}
          >
            {formatCountdown(countdown)}
          </div>
        </div>
        <StatusBadge status={market.status} />
      </div>

      {/* Probability Display - Side by Side in Box */}
      <div
        className="bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300"
        style={{
          margin: '15px 0',
          padding: '12px',
          borderRadius: '8px',
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-blue-600 dark:text-blue-400 font-bold transition-colors duration-300"
            style={{
              fontSize: '22px',
            }}
          >
            Yes {yesPercent}%
          </span>
          <span
            className="text-gray-600 dark:text-gray-400 font-semibold transition-colors duration-300"
            style={{
              fontSize: '15px',
            }}
          >
            No {noPercent}%
          </span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${yesWidth}%` }}
          />
        </div>
      </div>

      {/* Financial Metrics - Grid Layout */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <div
            className="mb-1 uppercase text-gray-600 dark:text-gray-400 font-semibold transition-colors duration-300"
            style={{
              fontSize: '12px',
            }}
          >
            Liquidity
          </div>
          <div
            className="text-gray-900 dark:text-white font-semibold transition-colors duration-300"
            style={{
              fontFamily: 'monospace',
              fontSize: '15px',
            }}
          >
            {formatCurrency(market.liquidity)}
          </div>
        </div>
        <div>
          <div
            className="mb-1 uppercase text-gray-600 dark:text-gray-400 font-semibold transition-colors duration-300"
            style={{
              fontSize: '12px',
            }}
          >
            24H Volume
          </div>
          <div
            className="text-gray-900 dark:text-white font-semibold transition-colors duration-300"
            style={{
              fontFamily: 'monospace',
              fontSize: '15px',
            }}
          >
            {formatCurrency(market.volume24h)}
          </div>
        </div>
        <div>
          <div
            className="mb-1 uppercase text-gray-600 dark:text-gray-400 font-semibold transition-colors duration-300"
            style={{
              fontSize: '12px',
            }}
          >
            Total Volume
          </div>
          <div
            className="text-gray-900 dark:text-white font-semibold transition-colors duration-300"
            style={{
              fontFamily: 'monospace',
              fontSize: '15px',
            }}
          >
            {formatCurrency(market.volumeTotal)}
          </div>
        </div>
      </div>

      {/* Resolution Source - Left Aligned */}
      <div
        className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
        style={{
          marginTop: '12px',
          paddingTop: '12px',
        }}
      >
        <p
          className="text-left text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300"
          style={{
            fontSize: '13px',
            fontStyle: 'italic',
          }}
        >
          Resolves via: Polymarket API
        </p>
      </div>
    </div>
  )
}

