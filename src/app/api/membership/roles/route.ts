import { NextResponse } from "next/server"
import { requireAdmin } from "@/server/auth/guard"
import { membershipStore } from "@/server/membership/store"
export const runtime = "nodejs"
export async function GET() { try { await requireAdmin(); return NextResponse.json({ roles: membershipStore.listRoles() }) } catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) } }
export async function POST(request: Request) {
  try {
    await requireAdmin(); const body = (await request.json()) as { name?: unknown; description?: unknown }
    if (typeof body.name !== "string" || body.name.trim().length < 2 || typeof body.description !== "string") return NextResponse.json({ message: "نام و توضیح نقش را وارد کنید." }, { status: 400 })
    return NextResponse.json({ role: membershipStore.createRole({ name: body.name, description: body.description }) }, { status: 201 })
  } catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
}
