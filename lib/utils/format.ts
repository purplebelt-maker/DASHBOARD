// Utility functions for formatting data

export function formatCurrency(amount: number): string {
  // Show exact numbers for accuracy (important for bidding apps)
  // For smaller amounts, show exact numbers with commas
  if (amount >= 1000000) {
    // For millions, show with 1 decimal for precision
    const millions = amount / 1000000
    return `$${millions.toFixed(1)}M`
  }
  if (amount >= 10000) {
    // For 10K+, show with 1 decimal (e.g., 12345 = $12.3K)
    const thousands = amount / 1000
    return `$${thousands.toFixed(1)}K`
  }
  // For amounts under 10K, show exact number with commas (e.g., 1666 = $1,666)
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatChange(value: number | null): string {
  if (value === null) return 'N/A'
  // Format like Polymarket: -0.002 (absolute change, not percentage)
  // If value is already a percentage (like 2.5%), show as percentage
  // If value is small (< 1), show as absolute change like Polymarket
  if (Math.abs(value) < 1) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(3)}`
  }
  // Otherwise show as percentage
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

