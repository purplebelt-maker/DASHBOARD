/**
 * API Route for fetching Polymarket markets
 * Uses public Gamma API - no authentication required
 */
import { NextRequest, NextResponse } from 'next/server'
import { fetchPolymarketMarkets } from '@/lib/api/polymarket'
import { transformPolymarketMarkets, filterSportsMarkets } from '@/lib/utils/polymarketTransform'
import { calculateCountdown } from '@/lib/utils/countdown'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor') || undefined
    const category = searchParams.get('category') || undefined
    
    const limit = 200
    const fetchLimit = 200
    
    const polymarketResponse = await fetchPolymarketMarkets({
      limit: fetchLimit,
      cursor: cursor,
      status: 'open',
      category: category,
      sort: 'volume',
      closed: false,
      include: 'condition',
    })
    
    const rawMarkets = polymarketResponse.data || polymarketResponse.markets || []
    const transformedMarkets = transformPolymarketMarkets(rawMarkets)
    
    const now = new Date()
    const activeMarkets = transformedMarkets.filter(market => {
      if (market.status === 'closed') {
        return false
      }
      
      const endDate = new Date(market.endDate)
      if (endDate <= now) {
        return false
      }
      
      const countdown = calculateCountdown(market.endDate)
      if (countdown.days === 0 && countdown.hours === 0) {
        return false
      }
      
      return true
    })

    const nonSportsMarkets = filterSportsMarkets(activeMarkets)
    
    const rawMarketsMap = new Map<string, any>()
    rawMarkets.forEach((rawMarket: any) => {
      if (rawMarket.id) {
        rawMarketsMap.set(rawMarket.id.toString(), rawMarket)
      }
    })
    
    const enrichedMarkets = nonSportsMarkets.map(market => {
      const rawMarket = rawMarketsMap.get(market.id)
      if (rawMarket) {
        return {
          ...rawMarket,
          id: market.id,
          question: market.question,
          category: market.category,
          probabilityYes: market.probabilityYes,
          probabilityNo: market.probabilityNo,
          change24h: market.change24h,
          liquidity: market.liquidity,
          volume24h: market.volume24h,
          volumeTotal: market.volumeTotal,
          endDate: market.endDate,
          status: market.status,
        }
      }
      return market
    })
    
    const sortedMarkets = enrichedMarkets.sort((a, b) => {
      const aHasPrice = a.probabilityYes > 0 && a.probabilityYes < 100
      const bHasPrice = b.probabilityYes > 0 && b.probabilityYes < 100
      
      if (aHasPrice && !bHasPrice) return -1
      if (!aHasPrice && bHasPrice) return 1
      
      if (b.volume24h !== a.volume24h) {
        return b.volume24h - a.volume24h
      }
      
      if (b.volumeTotal !== a.volumeTotal) {
        return b.volumeTotal - a.volumeTotal
      }
      
      return b.liquidity - a.liquidity
    })
    
    const limitedMarkets = sortedMarkets.slice(0, limit)
    
    return NextResponse.json({
      markets: limitedMarkets,
      cursor: polymarketResponse.cursor || polymarketResponse.nextCursor,
      total: limitedMarkets.length,
    })
  } catch (error) {
    console.error('Error fetching Polymarket markets:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch markets',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

