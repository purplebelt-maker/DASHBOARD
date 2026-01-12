/**
 * Transform Kalshi API data to our Market interface
 */
import { Market } from '@/types'
import { KalshiMarket } from '@/lib/api/kalshi'

/**
 * Map Kalshi market status to our status format
 */
function mapStatus(kalshiStatus?: string, marketState?: string): Market['status'] {
  const status = marketState || kalshiStatus?.toLowerCase()
  
  if (status === 'open') return 'active'
  if (status === 'settled') return 'resolved'
  if (status === 'closed' || status === 'cancelled') return 'closed'
  
  return 'active' // Default
}

/**
 * Calculate 24h change from previous_price and last_price
 */
function calculate24hChange(market: any): number | null {
  const lastPrice = market.last_price || market.lastPrice
  const previousPrice = market.previous_price || market.previousPrice
  
  if (!lastPrice || !previousPrice || previousPrice === 0) {
    return null
  }
  
  // Prices are in cents, convert to percentages first if needed
  let current = lastPrice > 100 ? lastPrice / 100 : lastPrice
  let previous = previousPrice > 100 ? previousPrice / 100 : previousPrice
  
  // Calculate percentage change
  const change = ((current - previous) / previous) * 100
  
  return Math.round(change * 10) / 10 // Round to 1 decimal place
}

/**
 * Calculate probability from Kalshi price data
 */
function calculateProbability(market: any): {
  probabilityYes: number
  probabilityNo: number
} {
  // Try different field names for price data
  let yesPrice = 0
  
  // Kalshi API returns prices in cents (0-10000 range) or as percentages (0-100)
  // Based on documentation, prices are typically in cents, so we need to divide by 100
  
  // Check last_price first (most reliable)
  if (market.last_price !== undefined && market.last_price !== null && market.last_price > 0) {
    yesPrice = market.last_price
  } else if (market.lastPrice !== undefined && market.lastPrice !== null && market.lastPrice > 0) {
    yesPrice = market.lastPrice
  } 
  // Check bid/ask midpoint (good fallback)
  else if (market.yes_bid !== undefined && market.yes_ask !== undefined) {
    const bid = market.yes_bid
    const ask = market.yes_ask
    // Use midpoint if both are valid
    if (bid > 0 || ask > 0) {
      if (bid > 0 && ask > 0) {
        yesPrice = (bid + ask) / 2
      } else if (bid > 0) {
        yesPrice = bid
      } else {
        yesPrice = ask
      }
    }
  } else if (market.yesBid !== undefined && market.yesAsk !== undefined) {
    const bid = market.yesBid
    const ask = market.yesAsk
    if (bid > 0 || ask > 0) {
      if (bid > 0 && ask > 0) {
        yesPrice = (bid + ask) / 2
      } else if (bid > 0) {
        yesPrice = bid
      } else {
        yesPrice = ask
      }
    }
  }
  // Check individual bid or ask
  else if (market.yes_bid !== undefined && market.yes_bid > 0) {
    yesPrice = market.yes_bid
  } else if (market.yesBid !== undefined && market.yesBid > 0) {
    yesPrice = market.yesBid
  } else if (market.yes_ask !== undefined && market.yes_ask > 0) {
    yesPrice = market.yes_ask
  } else if (market.yesAsk !== undefined && market.yesAsk > 0) {
    yesPrice = market.yesAsk
  }
  
  // Kalshi prices are in cents (0-10000), convert to percentage (0-100)
  // If price is > 100, it's in cents, divide by 100
  // If price is <= 100, it might already be a percentage, but typically Kalshi uses cents
  if (yesPrice > 100) {
    yesPrice = yesPrice / 100
  }
  
  // Convert to percentage (0-100)
  const probabilityYes = Math.round(yesPrice)
  const probabilityNo = Math.round(100 - yesPrice)
  
  return {
    probabilityYes: Math.max(0, Math.min(100, probabilityYes)),
    probabilityNo: Math.max(0, Math.min(100, probabilityNo)),
  }
}

/**
 * Transform Kalshi market to our Market interface
 */
export function transformKalshiMarket(kalshiMarket: any): Market {
  const { probabilityYes, probabilityNo } = calculateProbability(kalshiMarket)
  
  // Liquidity - Kalshi has a separate liquidity field
  const liquidity = kalshiMarket.liquidity || 
    kalshiMarket.open_interest || 
    kalshiMarket.openInterest || 
    0
  
  // Volume data - Kalshi uses volume_24h for 24h volume and volume for total
  const volume24h = kalshiMarket.volume_24h || 
    kalshiMarket.volume24h ||
    kalshiMarket.daily_volume ||
    kalshiMarket.dailyVolume ||
    0
  
  const volumeTotal = kalshiMarket.volume || 
    kalshiMarket.total_volume || 
    kalshiMarket.totalVolume || 
    0
  
  // End date - try different field names
  const endDate = kalshiMarket.expiration_time || 
    kalshiMarket.expirationTime || 
    kalshiMarket.expires_at || 
    kalshiMarket.expiresAt || 
    kalshiMarket.settlement_time || 
    kalshiMarket.settlementTime ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  
  // Status - try different field names
  const status = mapStatus(
    kalshiMarket.status || kalshiMarket.state,
    kalshiMarket.market_state || kalshiMarket.marketState
  )
  
  // Category - use series category or market category
  const category = kalshiMarket.category || 
    kalshiMarket.series_ticker?.split('-')[0] || 
    kalshiMarket.seriesTicker?.split('-')[0] ||
    'General'
  
  // Question/Title - Use title field as-is (client confirmed questions starting with "yes" are correct)
  const question = kalshiMarket.title || 
    kalshiMarket.subtitle || 
    kalshiMarket.yes_sub_title || 
    kalshiMarket.question || 
    'Market'
  
  return {
    id: kalshiMarket.ticker || kalshiMarket.id || kalshiMarket.market_ticker || '',
    question: question,
    category: category,
    probabilityYes,
    probabilityNo,
    change24h: calculate24hChange(kalshiMarket), // Calculate from previous_price if available
    liquidity,
    volume24h,
    volumeTotal,
    endDate,
    status,
  }
}

/**
 * Transform array of Kalshi markets
 */
export function transformKalshiMarkets(kalshiMarkets: KalshiMarket[]): Market[] {
  return kalshiMarkets.map(transformKalshiMarket)
}

/**
 * Filter out sports markets (similar to Polymarket filtering)
 */
export function filterSportsMarkets(markets: Market[]): Market[] {
  // Sports ticker prefixes to exclude (Kalshi uses specific prefixes for sports markets)
  const sportsTickerPrefixes = [
    'KXMVENFL',      // NFL markets
    'KXMVESPORTS',  // Sports markets
    'KXMVENBA',     // NBA markets
    'KXMVEMLB',     // MLB markets
    'KXMVENHL',     // NHL markets
    'KXMVESOCCER',  // Soccer markets
  ]
  
  const sportsKeywords = [
    'sport', 'nfl', 'nba', 'mlb', 'soccer', 'football', 'basketball',
    'baseball', 'hockey', 'nhl', 'game', 'match', 'team', 'player',
    'championship', 'playoff', 'super bowl', 'world cup', 'olympics',
    'herbert', 'allen', 'mccaffrey', 'barkley', 'curry', 'durant', // Common player names
    'points scored', 'yards', 'touchdown', 'field goal', 'quarterback'
  ]
  
  return markets.filter(market => {
    // Check ticker prefix first (most reliable)
    const ticker = market.id.toUpperCase()
    for (const prefix of sportsTickerPrefixes) {
      if (ticker.startsWith(prefix)) {
        return false // Exclude sports market
      }
    }
    
    const questionLower = market.question.toLowerCase()
    const categoryLower = market.category.toLowerCase()
    
    // Check if category is sports-related
    if (categoryLower.includes('sport')) {
      return false
    }
    
    // Check if question contains sports keywords
    for (const keyword of sportsKeywords) {
      if (questionLower.includes(keyword)) {
        return false
      }
    }
    
    // Check for multi-outcome sports markets (they often have player names and stats)
    // If question has many "yes X: Y+" patterns, it's likely a sports multi-outcome market
    const yesPatterns = (questionLower.match(/yes\s+[^,]+:\s*\d+\+/g) || []).length
    if (yesPatterns > 3) {
      // Likely a multi-outcome sports market, exclude it
      return false
    }
    
    return true
  })
}

