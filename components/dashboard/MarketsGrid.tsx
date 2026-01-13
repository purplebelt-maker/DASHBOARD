'use client'

import { memo } from 'react'
import { Market } from '@/types'
import MarketCard from './MarketCard'

interface MarketsGridProps {
  markets: Market[]
}

function MarketsGrid({ markets }: MarketsGridProps) {
  return (
    <div className="markets-grid w-full">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  )
}

export default memo(MarketsGrid)

