// Service durations are stored as minutes in the DB but presented in hours
// because providers think in hours, not minutes.

export function formatDuration(minutes) {
  if (minutes == null || Number.isNaN(Number(minutes))) return ''
  const total = Math.max(0, Math.round(Number(minutes)))
  const hours = Math.floor(total / 60)
  const mins = total % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function hoursToMinutes(hours) {
  const n = Number(hours)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 60)
}
