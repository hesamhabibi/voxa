import { NextResponse } from "next/server"
import { requireAdmin } from "@/server/auth/guard"
import { membershipStore } from "@/server/membership/store"
export async function GET() {
  try { await requireAdmin(); return NextResponse.json({ users: membershipStore.listUsers(), roles: membershipStore.listRoles() }) }
  catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
}
