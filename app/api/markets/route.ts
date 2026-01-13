/**
 * API Route for fetching Polymarket markets
 * Uses public Gamma API - no authentication required
 */
import { NextRequest, NextResponse } from 'next/server'
import { fetchPolymarketMarkets } from '@/lib/api/polymarket'
import { transformPolymarketMarkets, filterSportsMarkets } from '@/lib/utils/polymarketTransform'

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
    
    const now = Date.now()
    const activeMarkets = transformedMarkets.filter(market => {
      if (market.status === 'closed') {
        return false
      }
      
      const endDate = new Date(market.endDate).getTime()
      if (endDate <= now) {
        return false
      }
      
      const timeRemaining = endDate - now
      const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      return daysRemaining > 0 || hoursRemaining > 0
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
      
      if (aHasPrice !== bHasPrice) {
        return aHasPrice ? -1 : 1
      }
      
      const volume24hDiff = b.volume24h - a.volume24h
      if (volume24hDiff !== 0) {
        return volume24hDiff
      }
      
      const volumeTotalDiff = b.volumeTotal - a.volumeTotal
      if (volumeTotalDiff !== 0) {
        return volumeTotalDiff
      }
      
      return b.liquidity - a.liquidity
    })
    
    const limitedMarkets = sortedMarkets.slice(0, limit)
    
    const response = NextResponse.json({
      markets: limitedMarkets,
      cursor: polymarketResponse.cursor || polymarketResponse.nextCursor,
      total: limitedMarkets.length,
      timestamp: new Date().toISOString(),
    })
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
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

