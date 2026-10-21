import "server-only"
import { randomInt } from "node:crypto"

const OTP_TTL_MS = 5 * 60 * 1000
const challenges = new Map<string, { code: string; expiresAt: number }>()

export function issueTestOtp(phone: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  challenges.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS })
  console.info(`[VOXA TEST OTP] ${phone}: ${code}`)
  return { code, expiresIn: OTP_TTL_MS / 1000 }
}

export function consumeOtp(phone: string, code: string) {
  const challenge = challenges.get(phone)
  challenges.delete(phone)
  return Boolean(challenge && challenge.expiresAt > Date.now() && challenge.code === code)
}
