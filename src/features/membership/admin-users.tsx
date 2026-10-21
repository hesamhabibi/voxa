"use client"

import { ChevronLeft, ChevronRight, Filter, MoreHorizontal, Pencil, Search, SearchX, UserCheck, UserPlus, UserX, X } from "lucide-react"
import { useMemo, useState } from "react"

import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { notify } from "@/components/feedback/notify"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toPersianDigits } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MembershipUser } from "@/types/membership"
import { EmptyState, PageHeader, RoleBadge, Skeleton, StatusBadge, UserIdentity, formatDate, formatRelative } from "./admin-ui"
import { useMembership } from "./membership-context"
import { AddUserDialog, EditUserSheet } from "./user-dialogs"

type StatusFilter = "all" | MembershipUser["status"]
const PAGE_SIZE = 10
const statusTabs: { value: StatusFilter; label: string }[] = [{ value: "all", label: "همه" }, { value: "active", label: "فعال" }, { value: "suspended", label: "غیرفعال" }]
const normalize = (value: string) => value.toLocaleLowerCase("fa-IR").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\s+/g, "")

export function AdminUsers() {
  const { users, roles, roleById, loading, updateUser } = useMembership()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [roleId, setRoleId] = useState("all")
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<MembershipUser | null>(null)
  const [adding, setAdding] = useState(false)
  const [toggling, setToggling] = useState<MembershipUser | null>(null)

  const counts = useMemo(() => ({ all: users.length, active: users.filter((user) => user.status === "active").length, suspended: users.filter((user) => user.status === "suspended").length }), [users])

  const filtered = useMemo(() => {
    const term = normalize(query)
    return users
      .filter((user) => status === "all" || user.status === status)
      .filter((user) => roleId === "all" || user.roleIds.includes(roleId))
      .filter((user) => !term || normalize(`${user.fullName}${user.phone}${user.phone.replace("+98", "0")}`).includes(term))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [users, query, status, roleId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const hasFilters = Boolean(query) || status !== "all" || roleId !== "all"
  const resetFilters = () => { setQuery(""); setStatus("all"); setRoleId("all"); setPage(0) }

  async function toggleStatus(user: MembershipUser) {
    const next = user.status === "active" ? "suspended" : "active"
    setToggling(null)
    if (await updateUser(user.id, { fullName: user.fullName, roleIds: user.roleIds, status: next })) notify.success(next === "active" ? "حساب کاربر فعال شد." : "حساب کاربر غیرفعال شد.")
  }

  const rowActions = (user: MembershipUser) => <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`گزینه‌های ${user.fullName}`} className="text-muted-foreground" />}><MoreHorizontal /></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuItem onClick={() => setEditing(user)}><Pencil />ویرایش</DropdownMenuItem>
      <DropdownMenuSeparator />
      {user.status === "active"
        ? <DropdownMenuItem variant="destructive" onClick={() => setToggling(user)}><UserX />غیرفعال کردن</DropdownMenuItem>
        : <DropdownMenuItem onClick={() => setToggling(user)}><UserCheck />فعال کردن</DropdownMenuItem>}
    </DropdownMenuContent>
  </DropdownMenu>

  const roleBadges = (user: MembershipUser) => <div className="flex flex-wrap gap-1">
    {user.roleIds.map((id) => roleById.get(id)).filter((role) => role !== undefined).map((role) => <RoleBadge key={role.id} role={role} />)}
    {user.roleIds.length === 0 && <span className="text-[11px] text-muted-foreground">بدون نقش</span>}
  </div>

  return <div className="space-y-4">
    <PageHeader title="کاربران" description="مدیریت اعضا، نقش‌ها و وضعیت دسترسی" actions={<Button size="sm" onClick={() => setAdding(true)}><UserPlus />افزودن کاربر</Button>} />

    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center">
        <div className="flex h-8 shrink-0 rounded-lg bg-muted p-0.5" role="tablist" aria-label="فیلتر وضعیت">
          {statusTabs.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value} onClick={() => { setStatus(tab.value); setPage(0) }} className={cn("flex flex-1 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors sm:flex-none", status === tab.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {tab.label}<span className="text-[10px] text-muted-foreground tabular-nums">{toPersianDigits(counts[tab.value])}</span>
          </button>)}
        </div>
        <div className="flex flex-1 items-center gap-2 sm:justify-end">
          <div className="relative flex-1 sm:max-w-64">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0) }} placeholder="جستجوی نام یا شماره…" className="h-8 ps-8 text-[13px]" aria-label="جستجوی کاربر" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className={cn("h-8", roleId !== "all" && "border-primary/40 text-primary")} />}><Filter />{roleId === "all" ? "نقش" : roleById.get(roleId)?.name}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup><DropdownMenuLabel>فیلتر نقش</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={roleId} onValueChange={(value) => { setRoleId(value); setPage(0) }}>
                  <DropdownMenuRadioItem value="all">همهٔ نقش‌ها</DropdownMenuRadioItem>
                  {roles.map((role) => <DropdownMenuRadioItem key={role.id} value={role.id}>{role.name}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasFilters && <Button variant="ghost" size="icon-sm" onClick={resetFilters} aria-label="پاک کردن فیلترها" className="text-muted-foreground"><X /></Button>}
        </div>
      </div>

      {loading ? <div className="space-y-3 p-4">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex items-center gap-3"><Skeleton className="size-8 rounded-full" /><Skeleton className="h-3 w-40" /><Skeleton className="ms-auto h-3 w-20" /></div>)}</div>
        : filtered.length === 0 ? <EmptyState icon={SearchX} title="کاربری پیدا نشد" description={hasFilters ? "فیلترها یا عبارت جستجو را تغییر بده." : "اولین کاربر را اضافه کن."} action={hasFilters ? <Button variant="outline" size="sm" onClick={resetFilters}>پاک کردن فیلترها</Button> : <Button size="sm" onClick={() => setAdding(true)}><UserPlus />افزودن کاربر</Button>} />
        : <>
          <table className="hidden w-full text-[13px] md:table">
            <thead>
              <tr className="border-b bg-muted/40 text-start text-[11px] font-medium text-muted-foreground">
                <th className="px-4 py-2 text-start font-medium">کاربر</th>
                <th className="px-3 py-2 text-start font-medium">نقش‌ها</th>
                <th className="px-3 py-2 text-start font-medium">وضعیت</th>
                <th className="px-3 py-2 text-start font-medium">آخرین ورود</th>
                <th className="px-3 py-2 text-start font-medium">تاریخ عضویت</th>
                <th className="w-12 px-3 py-2"><span className="sr-only">عملیات</span></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((user) => <tr key={user.id} className="group transition-colors hover:bg-muted/40">
                <td className="px-4 py-2"><button type="button" onClick={() => setEditing(user)} className="block max-w-full text-start"><UserIdentity user={user} /></button></td>
                <td className="px-3 py-2">{roleBadges(user)}</td>
                <td className="px-3 py-2"><StatusBadge status={user.status} /></td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{formatRelative(user.lastLoginAt)}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{formatDate(user.createdAt)}</td>
                <td className="px-3 py-2 text-end">{rowActions(user)}</td>
              </tr>)}
            </tbody>
          </table>

          <ul className="divide-y md:hidden">
            {visible.map((user) => <li key={user.id} className="flex items-center gap-2 px-3 py-2.5">
              <button type="button" onClick={() => setEditing(user)} className="min-w-0 flex-1 text-start">
                <UserIdentity user={user} />
                <div className="mt-1.5 flex items-center gap-1.5 ps-[2.625rem]"><StatusBadge status={user.status} />{roleBadges(user)}</div>
              </button>
              {rowActions(user)}
            </li>)}
          </ul>

          <footer className="flex items-center justify-between gap-3 border-t px-4 py-2.5 text-xs text-muted-foreground">
            <span>{toPersianDigits(filtered.length)} کاربر{pageCount > 1 && <> · صفحهٔ {toPersianDigits(currentPage + 1)} از {toPersianDigits(pageCount)}</>}</span>
            {pageCount > 1 && <div className="flex gap-1">
              <Button variant="outline" size="icon-sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} aria-label="صفحهٔ قبل"><ChevronRight /></Button>
              <Button variant="outline" size="icon-sm" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)} aria-label="صفحهٔ بعد"><ChevronLeft /></Button>
            </div>}
          </footer>
        </>}
    </section>

    <EditUserSheet user={editing} onOpenChange={(open) => { if (!open) setEditing(null) }} />
    <AddUserDialog open={adding} onOpenChange={setAdding} />
    <ConfirmDialog open={Boolean(toggling)} onOpenChange={(open) => { if (!open) setToggling(null) }}
      title={toggling?.status === "active" ? "غیرفعال کردن حساب" : "فعال کردن حساب"}
      description={toggling?.status === "active" ? `${toggling.fullName} دیگر نمی‌تواند وارد Voxa شود.` : `${toggling?.fullName ?? ""} دوباره می‌تواند وارد شود.`}
      confirmLabel={toggling?.status === "active" ? "غیرفعال کن" : "فعال کن"} destructive={toggling?.status === "active"}
      onConfirm={() => { if (toggling) void toggleStatus(toggling) }} />
  </div>
}
