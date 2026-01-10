// Utility function to calculate countdown from end date

export interface Countdown {
  days: number
  hours: number
  minutes: number
}

export function calculateCountdown(endDate: string): Countdown {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}

export function formatCountdown(countdown: Countdown): string {
  if (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0) {
    return 'Closed'
  }
  return `Closes in ${countdown.days}d ${countdown.hours}h`
}

