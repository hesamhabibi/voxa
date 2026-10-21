export type MembershipRoleKey = "admin" | "teacher" | "learner"

export interface MembershipRole {
  id: string
  key: MembershipRoleKey | string
  name: string
  description: string
  permissions: string[]
}

export interface MembershipUser {
  id: string
  fullName: string
  phone: string
  status: "active" | "suspended"
  roleIds: string[]
  createdAt: string
  lastLoginAt?: string
}
