import { NextResponse } from "next/server"
import { requireAdmin } from "@/server/auth/guard"
import { membershipRepository } from "@/server/membership/repository"
export async function GET() {
  try { await requireAdmin(); return NextResponse.json({ users: await membershipRepository.listUsers(), roles: await membershipRepository.listRoles() }) }
  catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
}
