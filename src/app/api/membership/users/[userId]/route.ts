import { NextResponse } from "next/server"
import { requireAdmin } from "@/server/auth/guard"
import { membershipRepository } from "@/server/membership/repository"
import type { MembershipUser } from "@/types/membership"
export async function PATCH(request: Request, context: RouteContext<"/api/membership/users/[userId]">) {
  try {
    await requireAdmin(); const { userId } = await context.params
    const body = (await request.json()) as Partial<Pick<MembershipUser, "fullName" | "status" | "roleIds">>
    if (!body.fullName?.trim() || !Array.isArray(body.roleIds) || (body.status !== "active" && body.status !== "suspended")) return NextResponse.json({ message: "اطلاعات کاربر کامل نیست." }, { status: 400 })
    const user = await membershipRepository.updateUser(userId, { fullName: body.fullName, status: body.status, roleIds: body.roleIds })
    return user ? NextResponse.json({ user }) : NextResponse.json({ message: "کاربر پیدا نشد." }, { status: 404 })
  } catch { return NextResponse.json({ message: "اجازهٔ دسترسی ندارید." }, { status: 401 }) }
}
