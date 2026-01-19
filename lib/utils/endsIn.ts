export function formatEndsIn(date: string) {
  const now = new Date()
  const end = new Date(date)

  let diff = end.getTime() - now.getTime()
  if (diff <= 0) return "Ended"

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  if (months > 0) {
    const remainingDays = days % 30
    return `Ends in ${months} month${months > 1 ? "s" : ""}${
      remainingDays ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""
    }`
  }

  if (days > 0) {
    const remainingHours = hours % 24
    return `Ends in ${days} day${days > 1 ? "s" : ""}${
      remainingHours ? ` ${remainingHours} hour${remainingHours > 1 ? "s" : ""}` : ""
    }`
  }

  if (hours > 0) {
    return `Ends in ${hours} hour${hours > 1 ? "s" : ""}`
  }

  return `Ends in ${minutes} minute${minutes > 1 ? "s" : ""}`
}
