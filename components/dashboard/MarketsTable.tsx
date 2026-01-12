'use client'

import { useState, useEffect } from 'react'
import { Market } from '@/types'
import { formatCurrency, formatDate, formatChange } from '@/lib/utils/format'
import { calculateCountdown, formatCountdown } from '@/lib/utils/countdown'
import CategoryTag from './CategoryTag'
import StatusBadge from './StatusBadge'
import ProbabilityBar from './ProbabilityBar'
import QuestionText from './QuestionText'

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
        <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-[#1e293b] shadow-md dark:shadow-none transition-colors duration-300">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            <thead className="bg-slate-200 dark:bg-[#334155] transition-colors duration-300">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-4 lg:px-4 lg:w-[30%] transition-colors duration-300"
                >
                  Market Question
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-2 lg:px-2 transition-colors duration-300"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  Probability
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-right text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  24h Change
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-right text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  Liquidity
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-right text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  Volume (24h)
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-right text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  Volume (Total)
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 sm:px-3 lg:px-3 transition-colors duration-300"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-slate-100 dark:bg-[#1e293b] transition-colors duration-300">
              {markets.map((market) => (
                <tr
                  key={market.id}
                  className="transition-colors hover:bg-slate-200 dark:hover:bg-[#334155] duration-300 cursor-pointer"
                >
                  <td className="px-3 py-4 text-base font-semibold text-gray-900 dark:text-white sm:px-4 lg:px-4 transition-colors duration-300">
                    <div className="break-words">
                      <QuestionText 
                        question={market.question} 
                        className="text-gray-900 dark:text-white font-semibold transition-colors duration-300"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-base sm:px-2 lg:px-2">
                    <CategoryTag category={market.category} />
                  </td>
                  <td className="px-2 py-4 text-base sm:px-3 lg:px-3">
                    <ProbabilityBar
                      yes={market.probabilityYes}
                      no={market.probabilityNo}
                    />
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-right text-base font-semibold text-gray-700 dark:text-gray-300 sm:px-3 lg:px-3 transition-colors duration-300">
                    {formatChange(market.change24h)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-right text-base font-semibold text-gray-700 dark:text-gray-300 sm:px-3 lg:px-3 transition-colors duration-300">
                    {formatCurrency(market.liquidity)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-right text-base font-semibold text-gray-900 dark:text-white sm:px-3 lg:px-3 transition-colors duration-300">
                    {formatCurrency(market.volume24h)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-right text-base font-semibold text-gray-700 dark:text-gray-300 sm:px-3 lg:px-3 transition-colors duration-300">
                    {formatCurrency(market.volumeTotal)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 sm:px-3 lg:px-3 transition-colors duration-300">
                    <div className="flex flex-col">
                      <span>{formatDate(market.endDate)}</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {countdowns[market.id] || formatCountdown(calculateCountdown(market.endDate))}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-center text-sm sm:px-3 lg:px-3">
                    <StatusBadge status={market.status} />
                  </td>
                </tr>
              ))}
              {/* More markets row */}
              <tr className="transition-colors hover:bg-slate-200 dark:hover:bg-[#334155] duration-300">
                <td
                  colSpan={10}
                  className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
                  style={{
                    padding: '20px',
                  }}
                >
                  More markets at Kalshi.com
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
