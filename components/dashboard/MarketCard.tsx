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
    <div className="group relative rounded-lg border border-gray-700 bg-[#1e293b] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#60a5fa] hover:shadow-lg hover:shadow-blue-500/10">
      {/* Question - Alone at top */}
      <h3
        className="text-white"
        style={{
          fontSize: '16px',
          fontWeight: 600,
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
            style={{
              color: '#e2e8f0',
              fontSize: '13px',
              marginBottom: '4px',
            }}
          >
            {formatDate(market.endDate)}
          </div>

          {/* Closing Time - Orange */}
          <div
            style={{
              color: '#f59e0b',
              fontWeight: 500,
              fontSize: '11px',
            }}
          >
            {formatCountdown(countdown)}
          </div>
        </div>
        <StatusBadge status={market.status} />
      </div>

      {/* Probability Display - Side by Side in Box */}
      <div
        style={{
          margin: '15px 0',
          padding: '12px',
          background: '#0f172a',
          borderRadius: '8px',
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#60a5fa',
            }}
          >
            Yes {yesPercent}%
          </span>
          <span
            style={{
              fontSize: '14px',
              color: '#94a3b8',
            }}
          >
            No {noPercent}%
          </span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-700">
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
            className="mb-1 uppercase"
            style={{
              color: '#94a3b8',
              fontSize: '11px',
            }}
          >
            Liquidity
          </div>
          <div
            style={{
              color: '#fff',
              fontWeight: 500,
              fontFamily: 'monospace',
            }}
          >
            {formatCurrency(market.liquidity)}
          </div>
        </div>
        <div>
          <div
            className="mb-1 uppercase"
            style={{
              color: '#94a3b8',
              fontSize: '11px',
            }}
          >
            24H Volume
          </div>
          <div
            style={{
              color: '#fff',
              fontWeight: 500,
              fontFamily: 'monospace',
            }}
          >
            {formatCurrency(market.volume24h)}
          </div>
        </div>
        <div>
          <div
            className="mb-1 uppercase"
            style={{
              color: '#94a3b8',
              fontSize: '11px',
            }}
          >
            Total Volume
          </div>
          <div
            style={{
              color: '#fff',
              fontWeight: 500,
              fontFamily: 'monospace',
            }}
          >
            {formatCurrency(market.volumeTotal)}
          </div>
        </div>
      </div>

      {/* Resolution Source - Left Aligned */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #334155',
        }}
      >
        <p
          className="text-left"
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontStyle: 'italic',
          }}
        >
          Resolves via: Polymarket API
        </p>
      </div>
    </div>
  )
}

