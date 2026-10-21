"use client"

import { Check, Loader2 } from "lucide-react"
import { useState } from "react"

import { notify } from "@/components/feedback/notify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { MembershipRole, MembershipUser } from "@/types/membership"
import { UserAvatar, formatDate, formatPhone, formatRelative } from "./admin-ui"
import { useMembership } from "./membership-context"

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: React.ReactNode }) {
  return <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-xs font-medium">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
}

function RolePicker({ roles, value, onChange }: { roles: MembershipRole[]; value: string[]; onChange: (value: string[]) => void }) {
  return <div className="divide-y overflow-hidden rounded-lg border">
    {roles.map((role) => {
      const selected = value.includes(role.id)
      return <button key={role.id} type="button" role="checkbox" aria-checked={selected} onClick={() => onChange(selected ? value.filter((id) => id !== role.id) : [...value, role.id])} className={cn("flex w-full items-center gap-2.5 px-3 py-2 text-start transition-colors hover:bg-muted/60", selected && "bg-accent/50")}>
        <span className={cn("grid size-4 shrink-0 place-items-center rounded border transition-colors", selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background")}>{selected && <Check className="size-3" strokeWidth={3} />}</span>
        <span className="min-w-0"><span className="block text-[13px] font-medium">{role.name}</span>{role.description && <span className="block truncate text-[11px] text-muted-foreground">{role.description}</span>}</span>
      </button>
    })}
  </div>
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 outline-none", checked ? "bg-primary" : "bg-input")}>
    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all", checked ? "start-[1.125rem]" : "start-0.5")} />
  </button>
}

export function EditUserSheet({ user, onOpenChange }: { user: MembershipUser | null; onOpenChange: (open: boolean) => void }) {
  return <Sheet open={Boolean(user)} onOpenChange={onOpenChange}>
    <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-sm">
      {user && <EditUserForm key={user.id} user={user} onDone={() => onOpenChange(false)} />}
    </SheetContent>
  </Sheet>
}

function EditUserForm({ user, onDone }: { user: MembershipUser; onDone: () => void }) {
  const { roles, updateUser } = useMembership()
  const [fullName, setFullName] = useState(user.fullName)
  const [roleIds, setRoleIds] = useState(user.roleIds)
  const [active, setActive] = useState(user.status === "active")
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const ok = await updateUser(user.id, { fullName, roleIds, status: active ? "active" : "suspended" })
    setSaving(false)
    if (ok) { notify.success("تغییرات ذخیره شد."); onDone() }
  }

  return <form className="flex h-full flex-col" onSubmit={(event) => { event.preventDefault(); void save() }}>
    <SheetHeader className="border-b p-4">
      <SheetTitle className="text-sm font-semibold">ویرایش کاربر</SheetTitle>
      <SheetDescription className="sr-only">اطلاعات، نقش‌ها و وضعیت کاربر</SheetDescription>
      <div className="mt-2 flex items-center gap-3">
        <UserAvatar name={fullName || user.fullName} seed={user.id} className="size-10 text-sm" />
        <div className="min-w-0 text-xs text-muted-foreground">
          <p dir="ltr" className="text-end font-medium text-foreground tabular-nums">{formatPhone(user.phone)}</p>
          <p>عضویت {formatDate(user.createdAt)} · ورود {formatRelative(user.lastLoginAt)}</p>
        </div>
      </div>
    </SheetHeader>

    <div className="app-scrollbar flex-1 space-y-5 overflow-y-auto p-4">
      <Field label="نام کامل" htmlFor="edit-name"><Input id="edit-name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-9" /></Field>
      <Field label="نقش‌ها"><RolePicker roles={roles} value={roleIds} onChange={setRoleIds} /></Field>
      <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
        <div><p className="text-[13px] font-medium">حساب فعال</p><p className="text-[11px] text-muted-foreground">کاربر غیرفعال نمی‌تواند وارد شود.</p></div>
        <Switch checked={active} onChange={setActive} label="وضعیت حساب" />
      </div>
    </div>

    <SheetFooter className="flex-row justify-end border-t p-3">
      <Button type="button" variant="outline" onClick={onDone}>انصراف</Button>
      <Button type="submit" disabled={saving || fullName.trim().length < 2}>{saving && <Loader2 className="animate-spin" />}ذخیره</Button>
    </SheetFooter>
  </form>
}

export function AddUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">{open && <AddUserForm onDone={() => onOpenChange(false)} />}</DialogContent>
  </Dialog>
}

function AddUserForm({ onDone }: { onDone: () => void }) {
  const { roles, createUser } = useMembership()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [roleIds, setRoleIds] = useState(() => roles.filter((role) => role.key === "learner").map((role) => role.id))
  const [saving, setSaving] = useState(false)

  async function submit() {
    setSaving(true)
    const ok = await createUser({ fullName, phone, roleIds })
    setSaving(false)
    if (ok) { notify.success("کاربر اضافه شد."); onDone() }
  }

  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void submit() }}>
    <DialogHeader><DialogTitle className="font-semibold">افزودن کاربر</DialogTitle><DialogDescription className="text-xs">کاربر با همین شماره و کد یک‌بارمصرف وارد می‌شود.</DialogDescription></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="نام کامل" htmlFor="new-name"><Input id="new-name" autoFocus value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-9" placeholder="مثلاً سارا رضایی" /></Field>
      <Field label="شمارهٔ موبایل" htmlFor="new-phone"><Input id="new-phone" dir="ltr" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-9 text-left" placeholder="0912 123 4567" /></Field>
    </div>
    <Field label="نقش‌ها"><RolePicker roles={roles} value={roleIds} onChange={setRoleIds} /></Field>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onDone}>انصراف</Button>
      <Button type="submit" disabled={saving || fullName.trim().length < 2 || !phone.trim()}>{saving && <Loader2 className="animate-spin" />}افزودن</Button>
    </DialogFooter>
  </form>
}

export function AddRoleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">{open && <AddRoleForm onDone={() => onOpenChange(false)} />}</DialogContent>
  </Dialog>
}

function AddRoleForm({ onDone }: { onDone: () => void }) {
  const { createRole } = useMembership()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  async function submit() {
    setSaving(true)
    const ok = await createRole({ name, description })
    setSaving(false)
    if (ok) { notify.success("نقش جدید ساخته شد."); onDone() }
  }

  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void submit() }}>
    <DialogHeader><DialogTitle className="font-semibold">نقش جدید</DialogTitle><DialogDescription className="text-xs">بعداً می‌توانی این نقش را به کاربران اختصاص بدهی.</DialogDescription></DialogHeader>
    <Field label="نام نقش" htmlFor="role-name"><Input id="role-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} className="h-9" placeholder="مثلاً پشتیبان آموزشی" /></Field>
    <Field label="توضیح" htmlFor="role-description"><Textarea id="role-description" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-20 text-sm" placeholder="این نقش چه کاری انجام می‌دهد؟" /></Field>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onDone}>انصراف</Button>
      <Button type="submit" disabled={saving || name.trim().length < 2}>{saving && <Loader2 className="animate-spin" />}ساخت نقش</Button>
    </DialogFooter>
  </form>
}
