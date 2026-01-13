import { Market } from '@/types'
import { PolymarketMarket } from '@/lib/api/polymarket'

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

const sportsKeywordsSet = new Set([
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
])

export function isSportsMarket(market: Market | null | undefined): boolean {
  if (!market) {
    return false
  }
  
  try {
    const question = (market.question || '').toLowerCase()
    const category = (market.category || '').toLowerCase()
    
    if (category.includes('sports') || category.includes('sport')) {
      return true
    }
    
    for (const keyword of sportsKeywordsSet) {
      if (question.includes(keyword)) {
        return true
      }
    }
    
    return false
  } catch (error) {
    // If there's any error checking, don't filter it out
    console.error('Error in isSportsMarket:', error, market)
    return false
  }
}

export function filterSportsMarkets(markets: Market[]): Market[] {
  if (!Array.isArray(markets)) {
    return []
  }
  
  return markets.filter(market => {
    try {
      return !isSportsMarket(market)
    } catch (error) {
      // If there's an error, include the market
      console.error('Error filtering sports market:', error, market)
      return true
    }
  })
}

function calculateProbability(market: PolymarketMarket): {
  probabilityYes: number
  probabilityNo: number
} {
  let yesPrice = 0
  
  if (market.outcomePrices) {
    try {
      const prices = JSON.parse(market.outcomePrices)
      if (Array.isArray(prices) && prices.length > 0) {
        yesPrice = parseFloat(prices[0])
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  if (yesPrice === 0 && market.lastTradePrice !== undefined && market.lastTradePrice !== null) {
    yesPrice = market.lastTradePrice
  }
  
  if (yesPrice === 0 && market.bestAsk !== undefined && market.bestBid !== undefined) {
    if (market.bestAsk > 0 || market.bestBid > 0) {
      yesPrice = market.bestAsk > 0 && market.bestBid > 0
        ? (market.bestAsk + market.bestBid) / 2
        : (market.bestBid > 0 ? market.bestBid : market.bestAsk)
    }
  }
  
  const probabilityYes = Math.round(yesPrice * 100)
  const probabilityNo = Math.max(0, Math.min(100, 100 - probabilityYes))
  
  return {
    probabilityYes: Math.max(0, Math.min(100, probabilityYes)),
    probabilityNo,
  }
}

function parseNumeric(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export function transformPolymarketMarket(polymarketMarket: PolymarketMarket): Market {
  const { probabilityYes, probabilityNo } = calculateProbability(polymarketMarket)
  
  const liquidity = parseNumeric(
    polymarketMarket.liquidityNum ||
    polymarketMarket.liquidity ||
    0
  )
  
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
  
  const endDate = polymarketMarket.endDate ||
    polymarketMarket.endDateIso ||
    polymarketMarket.startDate ||
    polymarketMarket.startDateIso ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  
  const status = mapStatus(polymarketMarket)
  
  const question = polymarketMarket.question ||
    polymarketMarket.title ||
    polymarketMarket.description ||
    'Market'

  const category = deriveCategoryFromQuestion(question)
  
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

export function transformPolymarketMarkets(polymarketMarkets: PolymarketMarket[]): Market[] {
  return polymarketMarkets
    .filter(market => {
      // Only filter out markets with no question at all
      // Don't filter by question format (Will/Does/Do) - show all question types
      const question = market.question || market.title || market.description || ''
      return question.trim().length > 0
    })
    .map(transformPolymarketMarket)
}

const categoryKeywords: Record<string, Set<string>> = {
  Politics: new Set(['election', 'president', 'senate', 'house', 'congress', 'governor', 'trump', 'biden', 'vote', 'primary', 'parliament', 'referendum', 'policy']),
  Economics: new Set(['inflation', 'gdp', 'interest rate', 'fed', 'unemployment', 'revenue', 'tax', 'tariff', 'jobs report', 'cpi', 'economy', 'debt', 'deficit', 'treasury']),
  Crypto: new Set(['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'token', 'defi', 'stablecoin', 'solana']),
  Climate: new Set(['temperature', 'climate', 'carbon', 'co2', 'emissions', 'hottest', 'warming', 'rainfall', 'snow', 'hurricane', 'heat', 'weather']),
  Technology: new Set(['ai', 'artificial intelligence', 'llm', 'model', 'openai', 'google', 'microsoft', 'chip', 'nvidia', 'semiconductor', 'space', 'satellite', 'rocket']),
  Entertainment: new Set(['movie', 'film', 'box office', 'oscar', 'music', 'album', 'concert', 'game release', 'gta', 'entertainment', 'streaming']),
  Legal: new Set(['lawsuit', 'court', 'supreme court', 'legal', 'trial', 'verdict']),
  Health: new Set(['covid', 'vaccine', 'virus', 'health', 'hospital', 'medical', 'disease']),
  Science: new Set(['nasa', 'space', 'astronaut', 'launch', 'mission', 'planet', 'mars']),
  Business: new Set(['company', 'stock', 'revenue', 'earnings', 'ipo', 'merger', 'acquisition']),
  Sports: new Set(['football', 'nba', 'nfl', 'mlb', 'nhl', 'soccer', 'tennis', 'golf', 'fifa', 'super bowl', 'world cup', 'playoff', 'touchdown', 'goal', 'basketball', 'baseball', 'hockey']),
}

function deriveCategoryFromQuestion(question: string): string {
  const q = (question || '').toLowerCase()
  
  const matchesAny = (keywords: Set<string>) => {
    for (const keyword of keywords) {
      if (q.includes(keyword)) return true
    }
    return false
  }
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (matchesAny(keywords)) {
      return category
    }
  }
  
  return 'General'
}

