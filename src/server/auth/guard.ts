import "server-only"
import { cookies } from "next/headers"
import { readSession, sessionCookie, type SessionPayload } from "@/server/auth/session"
import { membershipRepository } from "@/server/membership/repository"

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await readSession((await cookies()).get(sessionCookie.name)?.value)
  if (!session) throw new Error("UNAUTHORIZED")
  const roles = await membershipRepository.getRoleKeysForUser(session.userId)
  if (!roles.includes("admin")) throw new Error("UNAUTHORIZED")
  return { ...session, roles }
}
