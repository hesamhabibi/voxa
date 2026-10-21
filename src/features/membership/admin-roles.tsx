"use client"

import { Plus, ShieldCheck, Users } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { EmptyState, PageHeader, Skeleton } from "./admin-ui"
import { useMembership } from "./membership-context"
import { AddRoleDialog } from "./user-dialogs"

const systemRoles = new Set(["admin", "teacher", "learner"])

export function AdminRoles() {
  const { users, roles, loading } = useMembership()
  const [adding, setAdding] = useState(false)
  const counts = useMemo(() => new Map(roles.map((role) => [role.id, users.filter((user) => user.roleIds.includes(role.id)).length])), [roles, users])

  return <div className="space-y-4">
    <PageHeader title="نقش‌ها و دسترسی" description="سطوح دسترسی را تعریف و به کاربران اختصاص بده" actions={<Button size="sm" onClick={() => setAdding(true)}><Plus />نقش جدید</Button>} />
    {loading ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)}</div>
      : roles.length === 0 ? <div className="rounded-xl border bg-card"><EmptyState icon={ShieldCheck} title="نقشی تعریف نشده" /></div>
      : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => <article key={role.id} className="flex flex-col rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><ShieldCheck className="size-4" /></span>
            {systemRoles.has(role.key) && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">سیستمی</span>}
          </div>
          <h3 className="mt-3 text-sm font-semibold">{role.name}</h3>
          <p className="mt-0.5 line-clamp-2 flex-1 text-xs leading-5 text-muted-foreground">{role.description || "بدون توضیح"}</p>
          <p className="mt-3 flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground"><Users className="size-3.5" />{(counts.get(role.id) ?? 0).toLocaleString("fa-IR")} کاربر</p>
        </article>)}
      </div>}
    <AddRoleDialog open={adding} onOpenChange={setAdding} />
  </div>
}
