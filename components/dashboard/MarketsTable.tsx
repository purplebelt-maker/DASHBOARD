'use client'

import { useState, useEffect } from 'react'
import { Market } from '@/types'
import { formatCurrency, formatDate, formatChange } from '@/lib/utils/format'
import { calculateCountdown, formatCountdown } from '@/lib/utils/countdown'
import CategoryTag from './CategoryTag'
import StatusBadge from './StatusBadge'
import ProbabilityBar from './ProbabilityBar'

interface MarketsTableProps {
  markets: Market[]
}

export default function MarketsTable({ markets }: MarketsTableProps) {
  const [countdowns, setCountdowns] = useState<Record<string, string>>({})

  useEffect(() => {
    // Update countdowns every minute
    const updateCountdowns = () => {
      const newCountdowns: Record<string, string> = {}
      markets.forEach((market) => {
        const countdown = calculateCountdown(market.endDate)
        newCountdowns[market.id] = formatCountdown(countdown)
      })
      setCountdowns(newCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [markets])

  return (
    <div className="w-full overflow-x-auto lg:overflow-x-visible">
      <div className="inline-block min-w-full align-middle lg:min-w-0 lg:w-full">
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#1e293b]">
          <table className="w-full divide-y divide-gray-700">
            <thead className="bg-[#334155]">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Market Question
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-3 lg:px-4"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Probability
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  24h Change
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Liquidity
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Volume (24h)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Volume (Total)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-4 lg:px-6"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-[#1e293b]">
              {markets.map((market) => (
                <tr
                  key={market.id}
                  className="transition-colors hover:bg-[#334155]"
                >
                  <td className="px-3 py-4 text-sm font-medium text-white sm:px-4 lg:px-6">
                    <div className="break-words">
                      {market.question}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-sm sm:px-3 lg:px-4">
                    <CategoryTag category={market.category} />
                  </td>
                  <td className="px-3 py-4 text-sm sm:px-4 lg:px-6">
                    <ProbabilityBar
                      yes={market.probabilityYes}
                      no={market.probabilityNo}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-300 sm:px-4 lg:px-6">
                    {formatChange(market.change24h)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-300 sm:px-4 lg:px-6">
                    {formatCurrency(market.liquidity)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-white sm:px-4 lg:px-6">
                    {formatCurrency(market.volume24h)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-300 sm:px-4 lg:px-6">
                    {formatCurrency(market.volumeTotal)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 sm:px-4 lg:px-6">
                    <div className="flex flex-col">
                      <span>{formatDate(market.endDate)}</span>
                      <span className="text-xs text-gray-400">
                        {countdowns[market.id] || formatCountdown(calculateCountdown(market.endDate))}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm sm:px-4 lg:px-6">
                    <StatusBadge status={market.status} />
                  </td>
                </tr>
              ))}
              {/* More markets row */}
              <tr className="transition-colors hover:bg-[#334155]">
                <td
                  colSpan={10}
                  style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    padding: '20px',
                  }}
                >
                  More markets at Polymarket.com
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
