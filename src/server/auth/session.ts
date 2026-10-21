import { SignJWT, jwtVerify } from "jose"

const SESSION_COOKIE = "voxa_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export interface SessionPayload { userId: string; roles: string[]; expiresAt: number }

function secret() {
  if (process.env.AUTH_SESSION_SECRET) return process.env.AUTH_SESSION_SECRET
  if (process.env.NODE_ENV !== "production") return "voxa-development-only-change-this-secret"
  throw new Error("AUTH_SESSION_SECRET must be configured in production.")
}

function signingKey() { return new TextEncoder().encode(secret()) }

export async function createSession(userId: string, roles: string[]) {
  return new SignJWT({ roles })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(signingKey())
}

export async function readSession(value?: string): Promise<SessionPayload | null> {
  if (!value) return null
  try {
    const { payload } = await jwtVerify(value, signingKey(), { algorithms: ["HS256"] })
    if (!payload.sub || !Array.isArray(payload.roles) || typeof payload.exp !== "number") return null
    return { userId: payload.sub, roles: payload.roles.filter((role): role is string => typeof role === "string"), expiresAt: payload.exp }
  } catch { return null }
}

export const sessionCookie = {
  name: SESSION_COOKIE,
  options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_SECONDS },
}
