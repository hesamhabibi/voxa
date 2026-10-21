import "server-only"

import { UserStatus } from "@/generated/prisma/enums"
import type { Prisma, Role } from "@/generated/prisma/client"
import { prisma } from "@/server/db/client"
import type { MembershipRole, MembershipUser } from "@/types/membership"

const baseRoles = [
  { key: "admin", name: "مدیر", description: "مدیریت کاربران، نقش‌ها و تنظیمات", permissions: ["*"] },
  { key: "teacher", name: "مدرس", description: "مدیریت محتوای آموزشی و زبان‌آموزان", permissions: ["content:write", "learners:read"] },
  { key: "learner", name: "زبان‌آموز", description: "استفاده از تمرین‌ها و واژه‌نامهٔ شخصی", permissions: ["practice:read", "practice:write"] },
] as const

type DatabaseRole = Role
type DatabaseUser = Prisma.UserGetPayload<{ include: { roles: { include: { role: true } } } }>

function mapRole(role: DatabaseRole): MembershipRole { return { id: role.id, key: role.key, name: role.name, description: role.description, permissions: [] } }
function mapUser(user: DatabaseUser): MembershipUser {
  return { id: user.id, fullName: user.fullName, phone: user.phone, status: user.status === UserStatus.ACTIVE ? "active" : "suspended", roleIds: user.roles.map((item) => item.roleId), createdAt: user.createdAt.toISOString(), lastLoginAt: user.lastLoginAt?.toISOString() }
}

async function ensureBaseRoles() {
  await Promise.all(baseRoles.map((role) => prisma.role.upsert({ where: { key: role.key }, update: {}, create: { key: role.key, name: role.name, description: role.description } })))
}

async function loadUserBy(where: { id?: string; phone?: string }) {
  return prisma.user.findFirst({ where, include: { roles: { include: { role: true } } } })
}

export const membershipRepository = {
  async listRoles() { await ensureBaseRoles(); return (await prisma.role.findMany({ orderBy: { createdAt: "asc" } })).map(mapRole) },
  async listUsers() { await ensureBaseRoles(); return (await prisma.user.findMany({ include: { roles: { include: { role: true } } }, orderBy: { createdAt: "asc" } })).map(mapUser) },
  async findUserById(id: string) { const user = await loadUserBy({ id }); return user ? mapUser(user) : null },
  async getRoleKeysForUser(id: string) { const user = await loadUserBy({ id }); return user?.roles.map((item) => item.role.key) ?? [] },
  async createOrGetTestUser(phone: string) {
    await ensureBaseRoles()
    const user = await prisma.user.upsert({ where: { phone }, update: { lastLoginAt: new Date() }, create: { phone, fullName: "کاربر جدید", lastLoginAt: new Date() }, include: { roles: { include: { role: true } } } })
    const testingRole = process.env.OTP_TEST_MODE !== "false" ? "admin" : "learner"
    const role = await prisma.role.findUniqueOrThrow({ where: { key: testingRole } })
    await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } })
    return mapUser((await loadUserBy({ id: user.id }))!)
  },
  async updateUser(id: string, patch: Pick<MembershipUser, "fullName" | "status" | "roleIds">) {
    const permittedRoles = await prisma.role.findMany({ where: { id: { in: patch.roleIds } }, select: { id: true } })
    const roleIds = permittedRoles.map((role) => role.id)
    const user = await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data: { fullName: patch.fullName.trim(), status: patch.status === "active" ? UserStatus.ACTIVE : UserStatus.SUSPENDED } })
      await tx.userRole.deleteMany({ where: { userId: id } })
      if (roleIds.length) await tx.userRole.createMany({ data: roleIds.map((roleId) => ({ userId: id, roleId })), skipDuplicates: true })
      return tx.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } })
    })
    return user ? mapUser(user) : null
  },
  async createRole(input: Pick<MembershipRole, "name" | "description">) {
    const key = `custom-${input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "role"}-${crypto.randomUUID().slice(0, 8)}`
    return mapRole(await prisma.role.create({ data: { key, name: input.name.trim(), description: input.description.trim() } }))
  },
}
