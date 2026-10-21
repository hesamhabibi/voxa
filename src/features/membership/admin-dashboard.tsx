"use client"

import { Icon } from "@iconify/react"
import { useEffect, useMemo, useState } from "react"

import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { notify } from "@/components/feedback/notify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { readApiResponse } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { MembershipRole, MembershipUser } from "@/types/membership"

type View = "overview" | "users"

function RolePill({ role }: { role: MembershipRole }) {
  return <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{role.name}</span>
}

function StatusBadge({ status }: { status: MembershipUser["status"] }) {
  const active = status === "active"
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}><span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-rose-500")} />{active ? "فعال" : "غیرفعال"}</span>
}

function UserIdentity({ user }: { user: MembershipUser }) {
  const initial = user.fullName.trim().slice(0, 1) || "ک"
  return <div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sm font-black text-sky-700">{initial}</span><span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-800">{user.fullName || "بدون نام"}</span><span dir="ltr" className="mt-0.5 block truncate text-xs text-slate-400">{user.phone}</span></span></div>
}

function MetricCard({ icon, label, value, note, tone = "sky" }: { icon: string; label: string; value: number; note: string; tone?: "sky" | "violet" | "emerald" }) {
  const styles = { sky: "bg-sky-50 text-sky-600", violet: "bg-violet-50 text-violet-600", emerald: "bg-emerald-50 text-emerald-600" }
  return <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30"><div className="flex items-start justify-between"><span className={cn("grid size-11 place-items-center rounded-2xl", styles[tone])}><Icon icon={icon} className="size-5" /></span><Icon icon="solar:graph-up-linear" className="size-5 text-slate-300" /></div><div className="mt-5"><p className="text-2xl font-black tracking-tight text-slate-900">{value.toLocaleString("fa-IR")}</p><p className="mt-1 text-sm font-bold text-slate-700">{label}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div></article>
}

export function AdminDashboard({ view }: { view: View }) {
  const [users, setUsers] = useState<MembershipUser[]>([])
  const [roles, setRoles] = useState<MembershipRole[]>([])
  const [editing, setEditing] = useState<MembershipUser | null>(null)
  const [roleDialog, setRoleDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

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

  const activeUsers = useMemo(() => users.filter((user) => user.status === "active"), [users])
  const filteredUsers = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("fa-IR")
    return term ? users.filter((user) => `${user.fullName} ${user.phone}`.toLocaleLowerCase("fa-IR").includes(term)) : users
  }, [query, users])

  async function saveUser() {
    if (!editing) return
    try {
      const response = await fetch(`/api/membership/users/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: editing.fullName, status: editing.status, roleIds: editing.roleIds }) })
      const data = await readApiResponse<{ user: MembershipUser }>(response)
      if (!response.ok) return notify.error(data.message ?? "ذخیرهٔ تغییرات ممکن نشد.")
      setUsers((current) => current.map((item) => item.id === data.user.id ? data.user : item)); setEditing(null); notify.success("تغییرات کاربر ذخیره شد.")
    } catch { notify.error("ارتباط با سرور برقرار نشد.") }
  }

  const title = view === "overview" ? "نمای کلی" : "کاربران و دسترسی‌ها"
  const description = view === "overview" ? "یک نگاه سریع به وضعیت اعضا و نقش‌های فضای یادگیری." : "پروفایل، نقش و وضعیت دسترسی هر عضو را از یک‌جا مدیریت کن."

  return <div className="space-y-6 lg:space-y-8">
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-900/10 sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute -end-20 -top-24 size-72 rounded-full bg-sky-400/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-28 start-1/4 size-72 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky-200"><span className="size-1.5 rounded-full bg-emerald-400" />مدیریت عضویت</span><h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{description}</p></div><Button onClick={() => setRoleDialog(true)} className="h-11 rounded-xl bg-white px-4 text-slate-900 hover:bg-sky-50"><Icon icon="solar:add-circle-linear" className="size-5" />ساخت نقش جدید</Button></div>
    </section>

    {loading ? <DashboardSkeleton /> : <><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><MetricCard icon="solar:users-group-rounded-linear" label="همهٔ کاربران" value={users.length} note="عضوهای ثبت‌شده در سیستم" /><MetricCard icon="solar:shield-keyhole-linear" label="نقش‌های فعال" value={roles.length} note="سطوح دسترسی تعریف‌شده" tone="violet" /><MetricCard icon="solar:check-circle-linear" label="کاربران فعال" value={activeUsers.length} note="امکان ورود به سامانه دارند" tone="emerald" /></section>{view === "overview" ? <Overview users={users} roles={roles} onEdit={setEditing} onCreateRole={() => setRoleDialog(true)} /> : <UsersPanel users={filteredUsers} roles={roles} query={query} onQuery={setQuery} onEdit={setEditing} />}</>}
    <UserDialog user={editing} roles={roles} onOpenChange={(open) => !open && setEditing(null)} onChange={setEditing} onSave={saveUser} />
    <RoleDialog open={roleDialog} onOpenChange={setRoleDialog} onCreated={(role) => { setRoles((current) => [...current, role]); setRoleDialog(false); notify.success("نقش جدید ساخته شد.") }} />
  </div>
}

function Overview({ users, roles, onEdit, onCreateRole }: { users: MembershipUser[]; roles: MembershipRole[]; onEdit: (user: MembershipUser) => void; onCreateRole: () => void }) {
  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)]"><section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">کاربران تازه</h2><p className="mt-1 text-xs text-slate-400">آخرین اعضای ثبت‌شده و وضعیت دسترسی آن‌ها</p></div><span className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-500"><Icon icon="solar:clock-circle-linear" className="size-5" /></span></div><div className="divide-y divide-slate-100">{users.slice(0, 5).map((user) => <UserRow key={user.id} user={user} roles={roles} onClick={() => onEdit({ ...user, roleIds: [...user.roleIds] })} />)}{users.length === 0 && <EmptyUsers />}</div></section><RolesPanel roles={roles} onCreateRole={onCreateRole} /></div>
}

function UsersPanel({ users, roles, query, onQuery, onEdit }: { users: MembershipUser[]; roles: MembershipRole[]; query: string; onQuery: (value: string) => void; onEdit: (user: MembershipUser) => void }) {
  return <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30"><div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">فهرست کاربران</h2><p className="mt-1 text-xs text-slate-400">برای مشاهده و ویرایش، هر کاربر را انتخاب کن.</p></div><label className="relative block sm:w-72"><span className="sr-only">جستجوی کاربر</span><Icon icon="solar:magnifer-linear" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="جستجو با نام یا شماره…" className="h-10 rounded-xl border-slate-200 bg-slate-50 ps-10 text-sm shadow-none focus-visible:bg-white" /></label></div><div className="hidden min-w-[42rem] lg:block"><div className="grid grid-cols-[minmax(15rem,1.4fr)_minmax(9rem,0.8fr)_minmax(12rem,1fr)_5rem] gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] font-bold text-slate-400"><span>کاربر</span><span>وضعیت</span><span>نقش‌ها</span><span className="text-end">عملیات</span></div><div className="divide-y divide-slate-100">{users.map((user) => <UserTableRow key={user.id} user={user} roles={roles} onClick={() => onEdit({ ...user, roleIds: [...user.roleIds] })} />)}{users.length === 0 && <EmptyUsers />}</div></div><div className="divide-y divide-slate-100 lg:hidden">{users.map((user) => <UserRow key={user.id} user={user} roles={roles} onClick={() => onEdit({ ...user, roleIds: [...user.roleIds] })} />)}{users.length === 0 && <EmptyUsers />}</div></section>
}

function UserRow({ user, roles, onClick }: { user: MembershipUser; roles: MembershipRole[]; onClick: () => void }) { return <button type="button" onClick={onClick} className="flex min-h-[78px] w-full items-center gap-3 px-5 py-3 text-start transition hover:bg-sky-50/45"><UserIdentity user={user} /><span className="ms-auto hidden flex-wrap justify-end gap-1 sm:flex">{user.roleIds.map((id) => { const role = roles.find((item) => item.id === id); return role ? <RolePill key={id} role={role} /> : null })}</span><StatusBadge status={user.status} /><Icon icon="solar:alt-arrow-left-linear" className="size-5 shrink-0 text-slate-300" /></button> }
function UserTableRow({ user, roles, onClick }: { user: MembershipUser; roles: MembershipRole[]; onClick: () => void }) { return <button type="button" onClick={onClick} className="grid w-full grid-cols-[minmax(15rem,1.4fr)_minmax(9rem,0.8fr)_minmax(12rem,1fr)_5rem] items-center gap-4 px-5 py-3.5 text-start transition hover:bg-sky-50/45"><UserIdentity user={user} /><span><StatusBadge status={user.status} /></span><span className="flex flex-wrap gap-1">{user.roleIds.map((id) => { const role = roles.find((item) => item.id === id); return role ? <RolePill key={id} role={role} /> : null })}</span><span className="justify-self-end text-xs font-bold text-sky-600">ویرایش</span></button> }
function EmptyUsers() { return <div className="px-5 py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-400"><Icon icon="solar:users-group-rounded-linear" className="size-6" /></span><p className="mt-3 text-sm font-bold text-slate-700">کاربری یافت نشد</p><p className="mt-1 text-xs text-slate-400">نتیجهٔ دیگری را جستجو کن یا با شمارهٔ موبایل وارد شو.</p></div> }
function RolesPanel({ roles, onCreateRole }: { roles: MembershipRole[]; onCreateRole: () => void }) { return <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30"><div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-900">نقش‌ها</h2><p className="mt-1 text-xs leading-5 text-slate-400">دسترسی‌ها را یک‌بار تعریف و به اعضا تخصیص بده.</p></div><button type="button" onClick={onCreateRole} className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600 transition hover:bg-sky-100" aria-label="ساخت نقش"><Icon icon="solar:add-circle-linear" className="size-5" /></button></div><div className="mt-5 space-y-2">{roles.slice(0, 5).map((role) => <div key={role.id} className="rounded-2xl border border-slate-100 p-3"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-violet-50 text-violet-600"><Icon icon="solar:shield-check-linear" className="size-4" /></span><span className="text-sm font-bold text-slate-700">{role.name}</span></div>{role.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{role.description}</p>}</div>)}{roles.length === 0 && <p className="py-8 text-center text-xs text-slate-400">هنوز نقشی ساخته نشده است.</p>}</div></section> }
function DashboardSkeleton() { return <div className="space-y-6 animate-pulse"><div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 rounded-3xl bg-slate-200/70" />)}</div><div className="h-80 rounded-3xl bg-slate-200/70" /></div> }

function UserDialog({ user, roles, onOpenChange, onChange, onSave }: { user: MembershipUser | null; roles: MembershipRole[]; onOpenChange: (open: boolean) => void; onChange: (user: MembershipUser) => void; onSave: () => void }) {
  const [confirmStatus, setConfirmStatus] = useState(false)
  const active = user?.status === "active"
  return <><Dialog open={Boolean(user)} onOpenChange={onOpenChange}><DialogContent className="max-h-[min(42rem,calc(100dvh-2rem))] gap-5 overflow-y-auto rounded-3xl p-5 sm:max-w-lg"><DialogHeader><DialogTitle className="text-lg font-black">ویرایش کاربر</DialogTitle><DialogDescription>اطلاعات، نقش‌ها و امکان ورود این عضو را مدیریت کن.</DialogDescription></DialogHeader>{user && <div className="space-y-5"><div className="rounded-2xl bg-slate-50 p-3"><UserIdentity user={user} /></div><div className="space-y-2"><label htmlFor="full-name" className="text-sm font-bold text-slate-700">نام کامل</label><Input id="full-name" value={user.fullName} onChange={(event) => onChange({ ...user, fullName: event.target.value })} className="h-11 rounded-xl" /></div><fieldset className="space-y-2"><legend className="text-sm font-bold text-slate-700">نقش‌ها</legend><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => { const selected = user.roleIds.includes(role.id); return <button type="button" key={role.id} role="checkbox" aria-checked={selected} onClick={() => onChange({ ...user, roleIds: selected ? user.roleIds.filter((id) => id !== role.id) : [...user.roleIds, role.id] })} className={cn("flex min-h-12 items-center justify-between rounded-xl border px-3 text-start text-sm font-semibold transition", selected ? "border-sky-300 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}><span className="truncate">{role.name}</span><span className={cn("grid size-5 place-items-center rounded-md border", selected ? "border-sky-500 bg-sky-500 text-white" : "border-slate-300")}>{selected && <Icon icon="solar:check-read-linear" className="size-4" />}</span></button> })}</div></fieldset><div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5"><span><span className="block text-sm font-bold text-slate-700">وضعیت حساب</span><span className="mt-1 block text-xs text-slate-400">کاربر غیرفعال وارد سامانه نمی‌شود.</span></span><button type="button" className={cn("rounded-xl px-3 py-2 text-xs font-bold", active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")} onClick={() => setConfirmStatus(true)}>{active ? "فعال" : "غیرفعال"}</button></div></div>}<DialogFooter className="-mx-5 -mb-5 rounded-b-3xl"><Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button><Button onClick={onSave} className="bg-sky-600 hover:bg-sky-700">ذخیرهٔ تغییرات</Button></DialogFooter></DialogContent></Dialog><ConfirmDialog open={confirmStatus} onOpenChange={setConfirmStatus} title={`تغییر وضعیت به ${active ? "غیرفعال" : "فعال"}`} description="این تغییر پس از ذخیرهٔ نهایی اعمال می‌شود." confirmLabel="تغییر وضعیت" onConfirm={() => { if (user) onChange({ ...user, status: active ? "suspended" : "active" }); setConfirmStatus(false) }} /></>
}

function RoleDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated: (role: MembershipRole) => void }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [saving, setSaving] = useState(false)
  async function create() { setSaving(true); try { const response = await fetch("/api/membership/roles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) }); const data = await readApiResponse<{ role: MembershipRole }>(response); if (!response.ok) return notify.error(data.message ?? "ساخت نقش ممکن نشد."); setName(""); setDescription(""); onCreated(data.role) } catch { notify.error("ارتباط با سرور برقرار نشد.") } finally { setSaving(false) } }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="rounded-3xl sm:max-w-md"><DialogHeader><DialogTitle className="text-lg font-black">ساخت نقش جدید</DialogTitle><DialogDescription>این نقش را بعداً می‌توانی به هر تعداد کاربر اختصاص بدهی.</DialogDescription></DialogHeader><div className="space-y-4"><div className="space-y-2"><label htmlFor="role-name" className="text-sm font-bold text-slate-700">نام نقش</label><Input id="role-name" placeholder="مثلاً پشتیبان آموزشی" value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl" /></div><div className="space-y-2"><label htmlFor="role-description" className="text-sm font-bold text-slate-700">توضیح کوتاه</label><Textarea id="role-description" placeholder="این نقش چه دسترسی‌هایی دارد؟" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 rounded-xl" /></div></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button><Button disabled={saving || name.trim().length < 2} onClick={create} className="bg-sky-600 hover:bg-sky-700">{saving ? "در حال ساخت…" : "ساخت نقش"}</Button></DialogFooter></DialogContent></Dialog>
}
