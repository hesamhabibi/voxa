import "server-only"

import { createHash, randomInt, timingSafeEqual } from "node:crypto"
import { prisma } from "@/server/db/client"

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const secret = () => process.env.OTP_HASH_SECRET ?? "voxa-temporary-test-otp-secret"
const hash = (phone: string, code: string) => createHash("sha256").update(`${secret()}:${phone}:${code}`).digest("hex")

export async function issueTestOtp(phone: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  const now = new Date()
  await prisma.$transaction([
    prisma.otpChallenge.updateMany({ where: { phone, consumedAt: null }, data: { consumedAt: now } }),
    prisma.otpChallenge.create({ data: { phone, codeHash: hash(phone, code), expiresAt: new Date(now.getTime() + OTP_TTL_MS) } }),
  ])
  console.info(`[VOXA TEST OTP] ${phone}: ${code}`)
  return { code, expiresIn: OTP_TTL_MS / 1000 }
}

export async function consumeOtp(phone: string, code: string) {
  const challenge = await prisma.otpChallenge.findFirst({ where: { phone, consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: MAX_ATTEMPTS } }, orderBy: { createdAt: "desc" } })
  if (!challenge) return false
  const expected = Buffer.from(challenge.codeHash, "hex"), actual = Buffer.from(hash(phone, code), "hex")
  const valid = expected.length === actual.length && timingSafeEqual(expected, actual)
  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 }, consumedAt: valid || challenge.attempts + 1 >= MAX_ATTEMPTS ? new Date() : undefined } })
  return valid
}
