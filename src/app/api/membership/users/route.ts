import { NextResponse } from "next/server"
import { normalizeIranianMobile } from "@/lib/phone"
import { requireAdmin } from "@/server/auth/guard"
import { membershipRepository } from "@/server/membership/repository"
export async function GET() {
  try { await requireAdmin(); return NextResponse.json({ users: await membershipRepository.listUsers(), roles: await membershipRepository.listRoles() }) }
  catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
}
export async function POST(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
  const body = (await request.json().catch(() => null)) as { fullName?: unknown; phone?: unknown; roleIds?: unknown } | null
  const phone = typeof body?.phone === "string" ? normalizeIranianMobile(body.phone) : null
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : ""
  const roleIds = Array.isArray(body?.roleIds) ? body.roleIds.filter((id): id is string => typeof id === "string") : []
  if (!phone || fullName.length < 2) return NextResponse.json({ message: "نام و شمارهٔ موبایل معتبر وارد کنید." }, { status: 400 })
  const user = await membershipRepository.createUser({ fullName, phone, roleIds })
  return user ? NextResponse.json({ user }, { status: 201 }) : NextResponse.json({ message: "کاربری با این شماره وجود دارد." }, { status: 409 })
}
