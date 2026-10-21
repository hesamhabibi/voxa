import "server-only"
import { randomUUID } from "node:crypto"
import type { MembershipRole, MembershipUser } from "@/types/membership"

const now = new Date().toISOString()
const roles: MembershipRole[] = [
  { id: "role-admin", key: "admin", name: "مدیر", description: "مدیریت کاربران، نقش‌ها و تنظیمات", permissions: ["*"] },
  { id: "role-teacher", key: "teacher", name: "مدرس", description: "مدیریت محتوای آموزشی و زبان‌آموزان", permissions: ["content:write", "learners:read"] },
  { id: "role-learner", key: "learner", name: "زبان‌آموز", description: "استفاده از تمرین‌ها و واژه‌نامهٔ شخصی", permissions: ["practice:read", "practice:write"] },
]
const users: MembershipUser[] = [
  { id: "user-demo-admin", fullName: "مدیر Voxa", phone: "+989000000000", status: "active", roleIds: ["role-admin"], createdAt: now },
  { id: "user-demo-learner", fullName: "سارا محمدی", phone: "+989121111111", status: "active", roleIds: ["role-learner"], createdAt: now },
]

export const membershipStore = {
  listRoles: () => roles,
  listUsers: () => users,
  createOrGetTestUser(phone: string) {
    const existing = users.find((user) => user.phone === phone)
    if (existing) return existing
    const user: MembershipUser = {
      id: randomUUID(), fullName: "کاربر جدید", phone, status: "active",
      roleIds: process.env.NODE_ENV !== "production" ? ["role-admin"] : ["role-learner"], createdAt: new Date().toISOString(),
    }
    users.push(user); return user
  },
  updateUser(id: string, patch: Pick<MembershipUser, "fullName" | "status" | "roleIds">) {
    const user = users.find((item) => item.id === id)
    if (!user) return null
    user.fullName = patch.fullName.trim(); user.status = patch.status
    user.roleIds = patch.roleIds.filter((roleId) => roles.some((role) => role.id === roleId))
    return user
  },
  createRole(input: Pick<MembershipRole, "name" | "description">) {
    const role: MembershipRole = { id: randomUUID(), key: `custom-${Date.now()}`, name: input.name.trim(), description: input.description.trim(), permissions: [] }
    roles.push(role); return role
  },
  touchLogin(id: string) { const user = users.find((item) => item.id === id); if (user) user.lastLoginAt = new Date().toISOString() },
}
