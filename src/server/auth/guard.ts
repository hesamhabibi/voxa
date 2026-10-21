import "server-only"
import { cookies } from "next/headers"
import { readSession, sessionCookie, type SessionPayload } from "@/server/auth/session"

export async function requireAdmin(): Promise<SessionPayload> {
  const session = readSession((await cookies()).get(sessionCookie.name)?.value)
  if (!session?.roles.includes("admin")) throw new Error("UNAUTHORIZED")
  return session
}
