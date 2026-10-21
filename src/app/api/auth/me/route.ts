import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readSession, sessionCookie } from "@/server/auth/session"
import { membershipRepository } from "@/server/membership/repository"
import { apiError } from "@/server/http/api-error"
export async function GET() {
  try {
    const session = await readSession((await cookies()).get(sessionCookie.name)?.value)
    const user = session ? await membershipRepository.findUserById(session.userId) : null
    if (!user) return NextResponse.json({ message: "وارد نشده‌اید." }, { status: 401 })
    return NextResponse.json({ user: { id: user.id, fullName: user.fullName, phone: user.phone, roles: await membershipRepository.getRoleKeysForUser(user.id) } })
  } catch (error) { return apiError("auth-me", error) }
}
