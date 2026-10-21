"use client"

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react"

import { notify } from "@/components/feedback/notify"
import { readApiResponse } from "@/lib/api-client"
import type { MembershipRole, MembershipUser } from "@/types/membership"

type UserPatch = Pick<MembershipUser, "fullName" | "status" | "roleIds">
type NewUser = Pick<MembershipUser, "fullName" | "phone" | "roleIds">

interface MembershipState {
  users: MembershipUser[]
  roles: MembershipRole[]
  loading: boolean
  roleById: Map<string, MembershipRole>
  updateUser: (id: string, patch: UserPatch) => Promise<boolean>
  createUser: (input: NewUser) => Promise<boolean>
  createRole: (input: Pick<MembershipRole, "name" | "description">) => Promise<boolean>
}

const MembershipContext = createContext<MembershipState | null>(null)

const jsonInit = (method: string, body: unknown): RequestInit => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<MembershipUser[]>([])
  const [roles, setRoles] = useState<MembershipRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch("/api/membership/users")
        const data = await readApiResponse<{ users: MembershipUser[]; roles: MembershipRole[] }>(response)
        if (cancelled) return
        if (!response.ok) return notify.error(data.message ?? "دریافت اطلاعات کاربران ممکن نشد.")
        setUsers(data.users); setRoles(data.roles)
      } catch { if (!cancelled) notify.error("ارتباط با پنل مدیریت برقرار نشد.") }
      finally { if (!cancelled) setLoading(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const updateUser = useCallback(async (id: string, patch: UserPatch) => {
    try {
      const response = await fetch(`/api/membership/users/${id}`, jsonInit("PATCH", patch))
      const data = await readApiResponse<{ user: MembershipUser }>(response)
      if (!response.ok) { notify.error(data.message ?? "ذخیرهٔ تغییرات ممکن نشد."); return false }
      setUsers((current) => current.map((item) => item.id === data.user.id ? data.user : item))
      return true
    } catch { notify.error("ارتباط با سرور برقرار نشد."); return false }
  }, [])

  const createUser = useCallback(async (input: NewUser) => {
    try {
      const response = await fetch("/api/membership/users", jsonInit("POST", input))
      const data = await readApiResponse<{ user: MembershipUser }>(response)
      if (!response.ok) { notify.error(data.message ?? "افزودن کاربر ممکن نشد."); return false }
      setUsers((current) => [...current, data.user])
      return true
    } catch { notify.error("ارتباط با سرور برقرار نشد."); return false }
  }, [])

  const createRole = useCallback(async (input: Pick<MembershipRole, "name" | "description">) => {
    try {
      const response = await fetch("/api/membership/roles", jsonInit("POST", input))
      const data = await readApiResponse<{ role: MembershipRole }>(response)
      if (!response.ok) { notify.error(data.message ?? "ساخت نقش ممکن نشد."); return false }
      setRoles((current) => [...current, data.role])
      return true
    } catch { notify.error("ارتباط با سرور برقرار نشد."); return false }
  }, [])

  const value = useMemo<MembershipState>(() => ({
    users, roles, loading, roleById: new Map(roles.map((role) => [role.id, role])), updateUser, createUser, createRole,
  }), [users, roles, loading, updateUser, createUser, createRole])

  return <MembershipContext value={value}>{children}</MembershipContext>
}

export function useMembership() {
  const context = use(MembershipContext)
  if (!context) throw new Error("useMembership must be used inside MembershipProvider")
  return context
}
