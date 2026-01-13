/**
 * Transform Polymarket API data to our Market interface
 */
import { Market } from '@/types'
import { PolymarketMarket } from '@/lib/api/polymarket'

/**
 * Map Polymarket market status to our status format
 * Status should be based on API fields, not endDate
 */
function mapStatus(polymarketMarket: PolymarketMarket): Market['status'] {
  // If marked resolved, treat as resolved
  if (polymarketMarket.resolved === true) return 'resolved'

  // Only mark as closed if explicitly closed flag is true
  // Don't check endDate - markets can be active even with past endDate
  if (polymarketMarket.closed === true) return 'closed'

  // If active and accepting orders, treat as active
  if (polymarketMarket.active === true && polymarketMarket.acceptingOrders === true) {
    return 'active'
  }

  // Default to active if just active (even without acceptingOrders)
  if (polymarketMarket.active === true) return 'active'

  // Otherwise, treat as active (matches previous dashboard behavior)
  return 'active'
}

/**
 * Check if a market is a sports market based on question text keywords
 */
export function isSportsMarket(market: Market): boolean {
  const question = (market.question || '').toLowerCase()
  const category = (market.category || '').toLowerCase()
  
  // Check category first
  if (category.includes('sports') || category.includes('sport')) {
    return true
  }
  
  // Sports keywords
  const sportsKeywords = [
    'game',
    'match',
    'team',
    'player',
    'super bowl',
    'world cup',
    'championship',
    'playoff',
    'quarterback',
    'touchdown',
    'field goal',
    'points scored',
    'yards',
    'nfl',
    'nba',
    'mlb',
    'nhl',
    'soccer',
    'football',
    'basketball',
    'baseball',
    'hockey',
    'athlete',
    'coach',
    'stadium',
    'halftime',
    'overtime',
    'mvp',
    'all-star',
    'draft',
    'trade',
    'roster',
    'injury',
    'season',
    'playoffs',
    'finals',
    'semifinals',
    'quarterfinals',
  ]
  
  // Check if question contains any sports keyword
  for (const keyword of sportsKeywords) {
    if (question.includes(keyword)) {
      return true
    }
  }
  
  return false
}

/**
 * Filter out sports markets from an array of markets
 */
export function filterSportsMarkets(markets: Market[]): Market[] {
  return markets.filter(market => !isSportsMarket(market))
}

/**
 * Calculate probability from Polymarket price data
 * Polymarket prices are in decimal format (0-1), where 1 = 100%
 */
function calculateProbability(market: PolymarketMarket): {
  probabilityYes: number
  probabilityNo: number
} {
  // Polymarket provides outcomePrices as JSON string array
  // Usually [yesPrice, noPrice] where prices are 0-1 decimals
  let yesPrice = 0
  
  // Try to parse outcomePrices
  if (market.outcomePrices) {
    try {
      const prices = JSON.parse(market.outcomePrices)
      if (Array.isArray(prices) && prices.length > 0) {
        // First price is usually YES
        yesPrice = parseFloat(prices[0])
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  // Fallback to lastTradePrice if available
  if (yesPrice === 0 && market.lastTradePrice !== undefined && market.lastTradePrice !== null) {
    yesPrice = market.lastTradePrice
  }
  
  // Fallback to bestAsk/bestBid midpoint
  if (yesPrice === 0 && market.bestAsk !== undefined && market.bestBid !== undefined) {
    if (market.bestAsk > 0 || market.bestBid > 0) {
      yesPrice = market.bestAsk > 0 && market.bestBid > 0
        ? (market.bestAsk + market.bestBid) / 2
        : (market.bestBid > 0 ? market.bestBid : market.bestAsk)
    }
  }
  
  // Convert from decimal (0-1) to percentage (0-100)
  const probabilityYes = Math.round(yesPrice * 100)
  const probabilityNo = Math.max(0, Math.min(100, 100 - probabilityYes))
  
  return {
    probabilityYes: Math.max(0, Math.min(100, probabilityYes)),
    probabilityNo,
  }
}

/**
 * Parse numeric value from string or number
 */
function parseNumeric(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * Transform Polymarket market to our Market interface
 */
export function transformPolymarketMarket(polymarketMarket: PolymarketMarket): Market {
  const { probabilityYes, probabilityNo } = calculateProbability(polymarketMarket)
  
  // Liquidity - can be string or number
  const liquidity = parseNumeric(
    polymarketMarket.liquidityNum ||
    polymarketMarket.liquidity ||
    0
  )
  
  // Volume data
  const volume24h = parseNumeric(
    polymarketMarket.volume24hrNum ||
    polymarketMarket.volume24hrClob ||
    polymarketMarket.volume24hr ||
    0
  )
  
  const volumeTotal = parseNumeric(
    polymarketMarket.volumeNum ||
    polymarketMarket.volume ||
    0
  )
  
  // End date - use endDate or endDateIso
  const endDate = polymarketMarket.endDate ||
    polymarketMarket.endDateIso ||
    polymarketMarket.startDate ||
    polymarketMarket.startDateIso ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  
  // Status
  const status = mapStatus(polymarketMarket)
  
  // Question - use question field (most reliable)
  const question = polymarketMarket.question ||
    polymarketMarket.title ||
    polymarketMarket.description ||
    'Market'

  // Derive category from question text (keywords)
  const category = deriveCategoryFromQuestion(question)
  
  // 24h change - use oneDayPriceChange if available
  const change24h = polymarketMarket.oneDayPriceChange !== undefined
    ? polymarketMarket.oneDayPriceChange
    : null
  
  return {
    id: polymarketMarket.id || '',
    question: question.trim(),
    category: category.trim(),
    probabilityYes,
    probabilityNo,
    change24h,
    liquidity,
    volume24h,
    volumeTotal,
    endDate,
    status,
  }
}

/**
 * Filter markets based on quality criteria (matching previous dashboard behavior)
 * Markets must meet minimum thresholds for volume24hr and liquidity
 */
export function filterQualityMarkets(rawMarkets: PolymarketMarket[]): PolymarketMarket[] {
  return rawMarkets.filter(market => {
    // Only keep markets that are active and not closed
    if (!market.active || market.closed) {
      return false
    }

    // No volume/liquidity thresholds per user request
    return true
  })
}

/**
 * Transform array of Polymarket markets
 */
export function transformPolymarketMarkets(polymarketMarkets: PolymarketMarket[]): Market[] {
  return polymarketMarkets
    .filter(market => {
      // Filter out markets without proper questions
      const question = market.question || market.title || ''
      return question.trim().length > 10
    })
    .map(transformPolymarketMarket)
}

/**
 * Derive category from question text using keyword matching
 */
function deriveCategoryFromQuestion(question: string): string {
  const q = (question || '').toLowerCase()
  
  const matchesAny = (keywords: string[]) => keywords.some(k => q.includes(k))
  
  if (matchesAny(['election', 'president', 'senate', 'house', 'congress', 'governor', 'trump', 'biden', 'vote', 'primary', 'parliament', 'referendum', 'policy'])) {
    return 'Politics'
  }
  
  if (matchesAny(['inflation', 'gdp', 'interest rate', 'fed', 'unemployment', 'revenue', 'tax', 'tariff', 'jobs report', 'cpi', 'economy', 'debt', 'deficit', 'treasury'])) {
    return 'Economics'
  }
  
  if (matchesAny(['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'token', 'defi', 'stablecoin', 'solana'])) {
    return 'Crypto'
  }
  
  if (matchesAny(['temperature', 'climate', 'carbon', 'co2', 'emissions', 'hottest', 'warming', 'rainfall', 'snow', 'hurricane', 'heat', 'weather'])) {
    return 'Climate'
  }
  
  if (matchesAny(['ai', 'artificial intelligence', 'llm', 'model', 'openai', 'google', 'microsoft', 'chip', 'nvidia', 'semiconductor', 'space', 'satellite', 'rocket'])) {
    return 'Technology'
  }
  
  if (matchesAny(['movie', 'film', 'box office', 'oscar', 'music', 'album', 'concert', 'game release', 'gta', 'entertainment', 'streaming'])) {
    return 'Entertainment'
  }
  
  if (matchesAny(['lawsuit', 'court', 'supreme court', 'legal', 'trial', 'verdict'])) {
    return 'Legal'
  }
  
  if (matchesAny(['covid', 'vaccine', 'virus', 'health', 'hospital', 'medical', 'disease'])) {
    return 'Health'
  }
  
  if (matchesAny(['nasa', 'space', 'astronaut', 'launch', 'mission', 'planet', 'mars'])) {
    return 'Science'
  }
  
  if (matchesAny(['company', 'stock', 'revenue', 'earnings', 'ipo', 'merger', 'acquisition'])) {
    return 'Business'
  }
  
  if (matchesAny(['football', 'nba', 'nfl', 'mlb', 'nhl', 'soccer', 'tennis', 'golf', 'fifa', 'super bowl', 'world cup', 'playoff', 'touchdown', 'goal', 'basketball', 'baseball', 'hockey'])) {
    return 'Sports'
  }
  
  return 'General'
}

