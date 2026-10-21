import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

const SESSION_COOKIE = "voxa_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export interface SessionPayload { userId: string; roles: string[]; expiresAt: number }

function secret() {
  if (process.env.AUTH_SESSION_SECRET) return process.env.AUTH_SESSION_SECRET
  if (process.env.NODE_ENV !== "production") return "voxa-development-only-change-this-secret"
  throw new Error("AUTH_SESSION_SECRET must be configured in production.")
}

function sign(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url") }

export function createSession(userId: string, roles: string[]) {
  const payload: SessionPayload = { userId, roles, expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${encoded}.${sign(encoded)}`
}

export function readSession(value?: string): SessionPayload | null {
  if (!value) return null
  const [encoded, signature] = value.split(".")
  if (!encoded || !signature) return null
  const expected = Buffer.from(sign(encoded)); const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload
    return payload.expiresAt > Math.floor(Date.now() / 1000) ? payload : null
  } catch { return null }
}

export const sessionCookie = {
  name: SESSION_COOKIE,
  options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_SECONDS },
}
