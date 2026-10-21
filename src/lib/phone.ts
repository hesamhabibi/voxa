export function normalizeIranianMobile(value: string) {
  const digits = value.replace(/[^\d+]/g, "")
  if (/^09\d{9}$/.test(digits)) return `+98${digits.slice(1)}`
  if (/^989\d{9}$/.test(digits)) return `+${digits}`
  if (/^\+989\d{9}$/.test(digits)) return digits
  return null
}
