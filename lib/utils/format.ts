export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return `$${millions.toFixed(1)}M`
  }
  if (amount >= 10000) {
    const thousands = amount / 1000
    return `$${thousands.toFixed(1)}K`
  }
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
  if (Math.abs(value) < 1) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(3)}`
  }
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

