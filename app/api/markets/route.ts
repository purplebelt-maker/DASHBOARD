/**
 * API Route for fetching Polymarket markets
 * Uses public Gamma API - no authentication required
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { fetchPolymarketMarkets } from '@/lib/api/polymarket'
import { transformPolymarketMarkets, filterSportsMarkets } from '@/lib/utils/polymarketTransform'
import { Market } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor') || undefined
    const category = searchParams.get('category') || undefined
    
    const limit = 25
    // Fetch a large number to ensure we capture all trending markets
    // Polymarket's trending page shows markets sorted by 24hr volume, so we need to fetch many
    const fetchLimit = 5000
    
    // Use same parameters as Polymarket trending page
    // Sort by volume (24h volume), only active markets, not closed
    // Frequency: All (default), Status: Active (active=true, closed=false)
    // Note: We fetch with sort='volume' but will re-sort by 24hr volume ourselves for accuracy
    let polymarketResponse
    try {
      polymarketResponse = await fetchPolymarketMarkets({
        limit: fetchLimit,
        cursor: cursor,
        category: category,
        sort: 'volume', // API sort parameter - we'll re-sort by 24hr volume for accuracy
        closed: false, // Exclude closed markets (Status: Active)
        include: 'condition',
        active: true, // Only active markets (Status: Active)
      })
    } catch (error) {
      console.error('Error calling Polymarket API:', error)
      throw new Error(`Failed to fetch from Polymarket API: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    if (!polymarketResponse) {
      throw new Error('Polymarket API returned null or undefined response')
    }
    
    const rawMarkets = polymarketResponse.data || polymarketResponse.markets || []
    
    if (!Array.isArray(rawMarkets)) {
      throw new Error(`Invalid API response: expected array, got ${typeof rawMarkets}`)
    }
    
    if (rawMarkets.length === 0) {
      // Return empty result instead of error
      return NextResponse.json({
        markets: [],
        cursor: null,
        total: 0,
        timestamp: new Date().toISOString(),
      })
    }
    
    let transformedMarkets: Market[] = []
    try {
      transformedMarkets = transformPolymarketMarkets(rawMarkets)
    } catch (error) {
      console.error('Error transforming markets:', error)
      throw new Error(`Failed to transform markets: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    // Don't filter by status - API already filters by active=true and closed=false
    // Don't filter by endDate - Polymarket trending shows markets based on volume, not date
    // Trust the API's filtering - it already returns only active, non-closed markets
    
    // Apply sports filter as per client requirements (only filter)
    let nonSportsMarkets: Market[] = []
    try {
      nonSportsMarkets = filterSportsMarkets(transformedMarkets)
    } catch (error) {
      console.error('Error filtering sports markets:', error)
      // If sports filtering fails, use all transformed markets
      nonSportsMarkets = transformedMarkets
    }
    
    // Create map of raw markets by ID for volume/liquidity lookup
    const rawMarketsMap = new Map<string, any>()
    rawMarkets.forEach((rawMarket: any) => {
      if (rawMarket && rawMarket.id) {
        const id = String(rawMarket.id)
        rawMarketsMap.set(id, rawMarket)
      }
    })
    
    const enrichedMarkets = nonSportsMarkets.map(market => {
      if (!market || !market.id) {
        // Skip invalid markets
        return null
      }
      
      const marketId = String(market.id)
      const rawMarket = rawMarketsMap.get(marketId)
      
      if (rawMarket) {
        // Extract 24hr volume - check multiple possible field names from Polymarket API
        // Priority: volume24hrNum > volume24hrClob > volume24hr > volume24h > other variants
        let rawVolume24h = 0
        if (rawMarket.volume24hrNum !== undefined && rawMarket.volume24hrNum !== null) {
          rawVolume24h = parseFloat(String(rawMarket.volume24hrNum)) || 0
        } else if (rawMarket.volume24hrClob !== undefined && rawMarket.volume24hrClob !== null) {
          rawVolume24h = parseFloat(String(rawMarket.volume24hrClob)) || 0
        } else if (rawMarket.volume24hr !== undefined && rawMarket.volume24hr !== null) {
          rawVolume24h = parseFloat(String(rawMarket.volume24hr)) || 0
        } else if (rawMarket.volume24h !== undefined && rawMarket.volume24h !== null) {
          rawVolume24h = parseFloat(String(rawMarket.volume24h)) || 0
        } else if (rawMarket.volume_24h !== undefined && rawMarket.volume_24h !== null) {
          rawVolume24h = parseFloat(String(rawMarket.volume_24h)) || 0
        }
        
        // Ensure we have a valid number
        rawVolume24h = isNaN(rawVolume24h) ? 0 : rawVolume24h
        
        const rawVolumeTotal = parseFloat(String(
          rawMarket.volumeNum || 
          rawMarket.volumeClob || 
          rawMarket.volume || 
          rawMarket.volumeTotal || 
          0
        )) || 0
        
        const rawLiquidity = parseFloat(String(
          rawMarket.liquidityNum || 
          rawMarket.liquidityClob || 
          rawMarket.liquidity || 
          market.liquidity || 
          0
        )) || 0
        
        // Create a clean market object without spreading rawMarket to avoid serialization issues
        return {
          id: market.id,
          question: market.question,
          category: market.category,
          probabilityYes: market.probabilityYes,
          probabilityNo: market.probabilityNo,
          change24h: market.change24h,
          liquidity: rawLiquidity,
          volume24h: rawVolume24h,
          volumeTotal: rawVolumeTotal,
          endDate: market.endDate,
          status: market.status,
          slug: rawMarket.slug || market.id,
          _sortVolume24h: rawVolume24h,
          _sortVolumeTotal: rawVolumeTotal,
        }
      }
      
      // Fallback if raw market not found
      return {
        ...market,
        _sortVolume24h: market.volume24h || 0,
        _sortVolumeTotal: market.volumeTotal || 0,
      }
    }).filter((market): market is NonNullable<typeof market> => market !== null)
    
    // Filter out markets with zero 24hr volume - these aren't truly "trending"
    // Polymarket's trending page only shows markets with actual 24hr trading activity
    const marketsWithVolume = enrichedMarkets.filter(market => {
      const vol24h = market._sortVolume24h || 0
      return vol24h > 0
    })
    
    // Sort by 24hr volume (descending) to match Polymarket's trending page
    // Secondary sort by total volume, then liquidity
    const sortedMarkets = marketsWithVolume.sort((a, b) => {
      const aVol24h = a._sortVolume24h || 0
      const bVol24h = b._sortVolume24h || 0
      
      const volume24hDiff = bVol24h - aVol24h
      if (volume24hDiff !== 0) {
        return volume24hDiff
      }
      
      const aVolTotal = a._sortVolumeTotal || 0
      const bVolTotal = b._sortVolumeTotal || 0
      
      const volumeTotalDiff = bVolTotal - aVolTotal
      if (volumeTotalDiff !== 0) {
        return volumeTotalDiff
      }
      
      return (b.liquidity || 0) - (a.liquidity || 0)
    })
    
    // Return top 25 trending markets (matching Polymarket's default display)
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      {
        error: 'Failed to fetch markets',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : String(error))
          : undefined,
      },
      { status: 500 }
    )
  }
}


