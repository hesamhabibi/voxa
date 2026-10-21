"use client"

import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { notify } from "@/components/feedback/notify"
import type { MembershipRole, MembershipUser } from "@/types/membership"

function RolePill({ role }: { role: MembershipRole }) { return <span className="rounded-full bg-muted px-2 py-1 text-xs">{role.name}</span> }

export function AdminDashboard() {
  const [users, setUsers] = useState<MembershipUser[]>([]), [roles, setRoles] = useState<MembershipRole[]>([])
  const [editing, setEditing] = useState<MembershipUser | null>(null), [roleDialog, setRoleDialog] = useState(false), [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    void fetch("/api/membership/users")
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (cancelled) return
        if (!response.ok) return notify.error(data.message)
        setUsers(data.users); setRoles(data.roles); setLoading(false)
      })
    return () => { cancelled = true }
  }, [])
  async function saveUser() {
    if (!editing) return
    const response = await fetch(`/api/membership/users/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: editing.fullName, status: editing.status, roleIds: editing.roleIds }) })
    const data = await response.json(); if (!response.ok) return notify.error(data.message)
    setUsers((current) => current.map((item) => item.id === data.user.id ? data.user : item)); setEditing(null); notify.success("اطلاعات کاربر ذخیره شد.")
  }
  if (loading) return <div className="grid min-h-dvh place-items-center text-sm text-muted-foreground">در حال آماده‌سازی پنل…</div>
  return <main className="min-h-dvh bg-muted/30 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-muted-foreground">مدیریت دسترسی و اعضا</p><h1 className="text-2xl font-bold">پنل مدیریت</h1></div><Button onClick={() => setRoleDialog(true)}><Icon icon="solar:add-circle-linear" />ساخت نقش</Button></header>
    <section className="grid gap-3 sm:grid-cols-3"><Stat icon="solar:users-group-rounded-linear" label="کل کاربران" value={users.length} /><Stat icon="solar:shield-keyhole-linear" label="نقش‌های فعال" value={roles.length} /><Stat icon="solar:check-circle-linear" label="کاربران فعال" value={users.filter((user) => user.status === "active").length} /></section>
    <Card><CardContent className="p-0"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-semibold">کاربران</h2><p className="text-xs text-muted-foreground">ویرایش پروفایل، وضعیت و نقش‌ها</p></div></div><div className="divide-y">{users.map((user) => <button key={user.id} onClick={() => setEditing({ ...user, roleIds: [...user.roleIds] })} className="flex w-full items-center gap-3 px-5 py-4 text-start transition-colors hover:bg-muted/50"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon icon="solar:user-rounded-linear" className="size-5" /></span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{user.fullName}</span><span dir="ltr" className="block text-xs text-muted-foreground">{user.phone}</span></span><span className="hidden gap-1 sm:flex">{user.roleIds.map((id) => { const role = roles.find((item) => item.id === id); return role ? <RolePill key={id} role={role} /> : null })}</span><Icon icon="solar:alt-arrow-left-linear" className="size-5 text-muted-foreground" /></button>)}</div></CardContent></Card>
    <section className="space-y-3"><div><h2 className="font-semibold">نقش‌ها</h2><p className="text-sm text-muted-foreground">نقش‌ها یک‌بار تعریف می‌شوند و به اعضا تخصیص می‌گیرند.</p></div><div className="grid gap-3 md:grid-cols-3">{roles.map((role) => <Card key={role.id}><CardContent className="space-y-2 p-4"><Icon icon="solar:shield-check-linear" className="size-5 text-primary" /><h3 className="font-medium">{role.name}</h3><p className="min-h-10 text-xs leading-5 text-muted-foreground">{role.description}</p></CardContent></Card>)}</div></section>
  </div><UserDialog user={editing} roles={roles} onOpenChange={(open) => !open && setEditing(null)} onChange={setEditing} onSave={saveUser} /><RoleDialog open={roleDialog} onOpenChange={setRoleDialog} onCreated={(role) => { setRoles((current) => [...current, role]); setRoleDialog(false); notify.success("نقش جدید ساخته شد.") }} /></main>
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) { return <Card><CardContent className="flex items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon icon={icon} className="size-5" /></span><span><span className="block text-xl font-bold">{value.toLocaleString("fa-IR")}</span><span className="text-xs text-muted-foreground">{label}</span></span></CardContent></Card> }

function UserDialog({ user, roles, onOpenChange, onChange, onSave }: { user: MembershipUser | null; roles: MembershipRole[]; onOpenChange: (open: boolean) => void; onChange: (user: MembershipUser) => void; onSave: () => void }) {
  const [confirmStatus, setConfirmStatus] = useState(false)
  const nextStatus = user?.status === "active" ? "غیرفعال" : "فعال"
  return <><Dialog open={Boolean(user)} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>ویرایش کاربر</DialogTitle><DialogDescription>نقش‌ها و وضعیت دسترسی این کاربر را مدیریت کنید.</DialogDescription></DialogHeader>{user && <div className="space-y-4"><div className="space-y-2"><label className="text-sm font-medium">نام کامل</label><Input value={user.fullName} onChange={(event) => onChange({ ...user, fullName: event.target.value })} /></div><div className="space-y-2"><p className="text-sm font-medium">نقش‌ها</p><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => { const checked = user.roleIds.includes(role.id); return <label key={role.id} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" checked={checked} onChange={() => onChange({ ...user, roleIds: checked ? user.roleIds.filter((id) => id !== role.id) : [...user.roleIds, role.id] })} />{role.name}</label> })}</div></div><div className="flex items-center justify-between rounded-lg border p-3"><span><span className="block text-sm font-medium">وضعیت حساب</span><span className="text-xs text-muted-foreground">حساب غیرفعال وارد نمی‌شود.</span></span><button className={`rounded-full px-3 py-1 text-xs ${user.status === "active" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"}`} onClick={() => setConfirmStatus(true)}>{user.status === "active" ? "فعال" : "غیرفعال"}</button></div></div>}<DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button><Button onClick={onSave}>ذخیرهٔ تغییرات</Button></DialogFooter></DialogContent></Dialog><ConfirmDialog open={confirmStatus} onOpenChange={setConfirmStatus} title={`تغییر وضعیت به ${nextStatus}`} description="تغییر تا زمان ذخیرهٔ تغییرات اعمال نهایی نمی‌شود." confirmLabel="تغییر وضعیت" onConfirm={() => { if (user) onChange({ ...user, status: user.status === "active" ? "suspended" : "active" }); setConfirmStatus(false) }} /></>
}

function RoleDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated: (role: MembershipRole) => void }) {
  const [name, setName] = useState(""), [description, setDescription] = useState("")
  async function create() { const response = await fetch("/api/membership/roles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) }); const data = await response.json(); if (!response.ok) return notify.error(data.message); setName(""); setDescription(""); onCreated(data.role) }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>ساخت نقش جدید</DialogTitle><DialogDescription>نقش جدید بعد از ساخت می‌تواند به هر کاربر تخصیص داده شود.</DialogDescription></DialogHeader><div className="space-y-3"><Input placeholder="نام نقش، مثلاً پشتیبان" value={name} onChange={(event) => setName(event.target.value)} /><Textarea placeholder="توضیح کوتاه دربارهٔ دسترسی این نقش" value={description} onChange={(event) => setDescription(event.target.value)} /></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button><Button disabled={name.trim().length < 2} onClick={create}>ساخت نقش</Button></DialogFooter></DialogContent></Dialog>
}
