import { NextResponse } from "next/server"
import { normalizeIranianMobile } from "@/lib/phone"
import { consumeOtp } from "@/server/auth/otp"
import { createSession, sessionCookie } from "@/server/auth/session"
import { membershipStore } from "@/server/membership/store"
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: unknown; code?: unknown } | null
  const phone = typeof body?.phone === "string" ? normalizeIranianMobile(body.phone) : null
  const code = typeof body?.code === "string" ? body.code.replace(/\D/g, "") : ""
  if (!phone || code.length !== 6 || !consumeOtp(phone, code)) return NextResponse.json({ message: "کد واردشده درست نیست یا منقضی شده است." }, { status: 400 })
  const user = membershipStore.createOrGetTestUser(phone)
  if (user.status !== "active") return NextResponse.json({ message: "حساب کاربری غیرفعال است." }, { status: 403 })
  membershipStore.touchLogin(user.id)
  const roles = user.roleIds.map((id) => membershipStore.listRoles().find((role) => role.id === id)?.key).filter((role): role is string => Boolean(role))
  const response = NextResponse.json({ user: { id: user.id, fullName: user.fullName, roles } })
  response.cookies.set(sessionCookie.name, await createSession(user.id, roles), sessionCookie.options)
  return response
}
