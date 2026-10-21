"use client"

import { ArrowLeft, Clock, ShieldCheck, UserCheck, UserPlus, UserX, Users } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EmptyState, PageHeader, Panel, RoleBadge, Skeleton, StatCard, StatusBadge, UserIdentity, formatRelative, isWithin } from "./admin-ui"
import { useMembership } from "./membership-context"
import { AddUserDialog } from "./user-dialogs"

const WEEK = 7 * 24 * 60 * 60 * 1000

export function AdminOverview() {
  const { users, roles, roleById, loading } = useMembership()
  const [adding, setAdding] = useState(false)

  const stats = useMemo(() => {
    const active = users.filter((user) => user.status === "active").length
    return { total: users.length, active, suspended: users.length - active, recent: users.filter((user) => isWithin(user.createdAt, WEEK)).length }
  }, [users])

  const newest = useMemo(() => [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6), [users])
  const recentLogins = useMemo(() => users.filter((user) => user.lastLoginAt).sort((a, b) => b.lastLoginAt!.localeCompare(a.lastLoginAt!)).slice(0, 5), [users])
  const distribution = useMemo(() => roles.map((role) => ({ role, count: users.filter((user) => user.roleIds.includes(role.id)).length })), [roles, users])

  const viewAll = <Link href="/admin/users" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>همه<ArrowLeft /></Link>

  return <div className="space-y-5">
    <PageHeader title="داشبورد" description="نمای کلی اعضا و دسترسی‌ها" actions={<Button size="sm" onClick={() => setAdding(true)}><UserPlus />افزودن کاربر</Button>} />
    <AddUserDialog open={adding} onOpenChange={setAdding} />

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {loading ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-[92px] rounded-xl" />) : <>
        <StatCard icon={Users} label="همهٔ کاربران" value={stats.total} hint="ثبت‌شده در سامانه" />
        <StatCard icon={UserCheck} label="کاربران فعال" value={stats.active} hint="امکان ورود دارند" tone="success" />
        <StatCard icon={UserX} label="غیرفعال" value={stats.suspended} hint="دسترسی مسدود" tone="muted" />
        <StatCard icon={UserPlus} label="عضو جدید" value={stats.recent} hint="در ۷ روز گذشته" tone="warning" />
      </>}
    </div>

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Panel title="جدیدترین کاربران" action={viewAll}>
        {loading ? <ListSkeleton /> : newest.length === 0 ? <EmptyState icon={Users} title="هنوز کاربری ثبت نشده" /> : <ul className="divide-y">
          {newest.map((user) => <li key={user.id} className="flex items-center gap-3 px-4 py-2.5">
            <div className="min-w-0 flex-1"><UserIdentity user={user} /></div>
            <div className="hidden gap-1 sm:flex">{user.roleIds.map((id) => roleById.get(id)).filter(Boolean).slice(0, 2).map((role) => <RoleBadge key={role!.id} role={role!} />)}</div>
            <StatusBadge status={user.status} />
          </li>)}
        </ul>}
      </Panel>

      <div className="space-y-3">
        <Panel title="توزیع نقش‌ها" action={<Link href="/admin/roles" className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")} aria-label="مدیریت نقش‌ها"><ShieldCheck /></Link>}>
          {loading ? <ListSkeleton rows={3} /> : <ul className="space-y-3 p-4">
            {distribution.map(({ role, count }) => <li key={role.id}>
              <div className="flex items-center justify-between text-xs"><span className="font-medium">{role.name}</span><span className="text-muted-foreground tabular-nums">{count.toLocaleString("fa-IR")} نفر</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }} /></div>
            </li>)}
          </ul>}
        </Panel>

        <Panel title="آخرین ورودها">
          {loading ? <ListSkeleton rows={3} /> : recentLogins.length === 0 ? <EmptyState icon={Clock} title="ورودی ثبت نشده" /> : <ul className="divide-y">
            {recentLogins.map((user) => <li key={user.id} className="flex items-center gap-3 px-4 py-2">
              <div className="min-w-0 flex-1"><UserIdentity user={user} compact /></div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{formatRelative(user.lastLoginAt)}</span>
            </li>)}
          </ul>}
        </Panel>
      </div>
    </div>
  </div>
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return <div className="space-y-3 p-4">{Array.from({ length: rows }, (_, index) => <div key={index} className="flex items-center gap-3"><Skeleton className="size-8 rounded-full" /><div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-2.5 w-1/4" /></div></div>)}</div>
}
