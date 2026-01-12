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
 * Kalshi provides previous_price and last_price in cents
 */
function calculate24hChange(market: any): number | null {
  // Try to get current price (last_price or bid/ask midpoint)
  let currentPrice = market.last_price || market.lastPrice
  
  // If no last_price, use bid/ask midpoint
  if (!currentPrice || currentPrice === 0) {
    if (market.yes_bid !== undefined && market.yes_ask !== undefined) {
      const bid = market.yes_bid
      const ask = market.yes_ask
      if (bid > 0 || ask > 0) {
        currentPrice = bid > 0 && ask > 0 ? (bid + ask) / 2 : (bid > 0 ? bid : ask)
      }
    }
  }
  
  // Try to get previous price
  let previousPrice = market.previous_price || market.previousPrice
  
  // If no previous_price, try previous bid/ask
  if (!previousPrice || previousPrice === 0) {
    if (market.previous_yes_bid !== undefined && market.previous_yes_ask !== undefined) {
      const prevBid = market.previous_yes_bid
      const prevAsk = market.previous_yes_ask
      if (prevBid > 0 || prevAsk > 0) {
        previousPrice = prevBid > 0 && prevAsk > 0 ? (prevBid + prevAsk) / 2 : (prevBid > 0 ? prevBid : prevAsk)
      }
    }
  }
  
  // Need both prices to calculate change
  if (!currentPrice || !previousPrice || previousPrice === 0 || currentPrice === 0) {
    return null
  }
  
  // Prices are in cents (0-10000), convert to percentage (0-100) if needed
  let current = currentPrice > 100 ? currentPrice / 100 : currentPrice
  let previous = previousPrice > 100 ? previousPrice / 100 : previousPrice
  
  // Calculate percentage change (like Polymarket: oneDayPriceChange)
  const change = current - previous
  
  // Round to 3 decimal places (Polymarket shows -0.002)
  return Math.round(change * 1000) / 1000
}

/**
 * Calculate probability from Kalshi price data
 */
function calculateProbability(market: any): {
  probabilityYes: number
  probabilityNo: number
} {
  // Kalshi API returns prices in cents (0-10000 range)
  // response_price_units: "usd_cent" means prices are in cents
  // We need to convert from cents to percentage (divide by 100)
  
  let yesPrice = 0
  
  // Check last_price first (most reliable)
  if (market.last_price !== undefined && market.last_price !== null && market.last_price > 0) {
    yesPrice = market.last_price
  } 
  // Check bid/ask midpoint for YES side
  else if (market.yes_bid !== undefined && market.yes_ask !== undefined) {
    const bid = market.yes_bid
    const ask = market.yes_ask
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
  // Check individual YES bid or ask
  else if (market.yes_bid !== undefined && market.yes_bid > 0) {
    yesPrice = market.yes_bid
  } else if (market.yes_ask !== undefined && market.yes_ask > 0) {
    yesPrice = market.yes_ask
  }
  // If YES side has no price, calculate from NO side
  // If no_bid = 100 and no_ask = 100, then yesPrice should be 0
  else if (market.no_bid !== undefined && market.no_ask !== undefined) {
    const noBid = market.no_bid
    const noAsk = market.no_ask
    // If NO side is at 100, YES is at 0
    if (noBid === 100 && noAsk === 100) {
      yesPrice = 0
    } else if (noBid > 0 || noAsk > 0) {
      // Calculate YES from NO: if NO midpoint is X, YES is 100 - X
      const noMidpoint = noBid > 0 && noAsk > 0 
        ? (noBid + noAsk) / 2
        : (noBid > 0 ? noBid : noAsk)
      yesPrice = 100 - noMidpoint
    }
  }
  
  // Kalshi prices are in cents (0-10000), convert to percentage (0-100)
  // If price is > 100, it's in cents, divide by 100
  if (yesPrice > 100) {
    yesPrice = yesPrice / 100
  }
  
  // Ensure yesPrice is between 0 and 100
  yesPrice = Math.max(0, Math.min(100, yesPrice))
  
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
  
  // End date - Use close_time first (when market closes), then expiration_time (when it expires)
  // close_time is when trading stops, expiration_time is when it resolves
  const endDate = kalshiMarket.close_time || 
    kalshiMarket.closeTime ||
    kalshiMarket.expiration_time || 
    kalshiMarket.expirationTime || 
    kalshiMarket.latest_expiration_time ||
    kalshiMarket.latestExpirationTime ||
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

