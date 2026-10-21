import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { MembershipRole, MembershipUser } from "@/types/membership"

const avatarTones = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
]

function toneFor(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return avatarTones[Math.abs(hash) % avatarTones.length]
}

export function UserAvatar({ name, seed, className }: { name: string; seed: string; className?: string }) {
  const initial = name.trim().slice(0, 1) || "ک"
  return <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold", toneFor(seed), className)}>{initial}</span>
}

export function UserIdentity({ user, compact = false }: { user: MembershipUser; compact?: boolean }) {
  return <div className="flex min-w-0 items-center gap-2.5">
    <UserAvatar name={user.fullName} seed={user.id} className={compact ? "size-7" : undefined} />
    <div className="min-w-0">
      <p className="truncate text-[13px] font-medium leading-5">{user.fullName || "بدون نام"}</p>
      <p dir="ltr" className="truncate text-end text-[11px] leading-4 text-muted-foreground tabular-nums">{formatPhone(user.phone)}</p>
    </div>
  </div>
}

export function StatusBadge({ status }: { status: MembershipUser["status"] }) {
  const active = status === "active"
  return <span className={cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-[11px] font-medium", active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
    <span className={cn("size-1.5 rounded-full", active ? "bg-success" : "bg-muted-foreground/60")} />{active ? "فعال" : "غیرفعال"}
  </span>
}

export function RoleBadge({ role }: { role: MembershipRole }) {
  const tone = role.key === "admin" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
  return <span className={cn("inline-flex h-5 items-center rounded-md px-1.5 text-[11px] font-medium", tone)}>{role.name}</span>
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
}

export function Panel({ title, description, action, className, children }: { title?: string; description?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return <section className={cn("overflow-hidden rounded-xl border bg-card", className)}>
    {title && <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div className="min-w-0"><h2 className="text-sm font-semibold">{title}</h2>{description && <p className="text-xs text-muted-foreground">{description}</p>}</div>
      {action}
    </header>}
    {children}
  </section>
}

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: { icon: LucideIcon; label: string; value: number; hint?: string; tone?: "primary" | "success" | "warning" | "muted" }) {
  const tones = { primary: "bg-accent text-accent-foreground", success: "bg-success/10 text-success", warning: "bg-warning/15 text-warning", muted: "bg-muted text-muted-foreground" }
  return <div className="rounded-xl border bg-card p-4">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <span className={cn("grid size-7 place-items-center rounded-md", tones[tone])}><Icon className="size-3.5" /></span>
    </div>
    <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value.toLocaleString("fa-IR")}</p>
    {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
  </div>
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex flex-col items-center px-6 py-12 text-center">
    <span className="grid size-10 place-items-center rounded-lg border bg-muted/50 text-muted-foreground"><Icon className="size-4.5" /></span>
    <p className="mt-3 text-sm font-medium">{title}</p>
    {description && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

const dateFormatter = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "short", day: "numeric" })
const relativeFormatter = new Intl.RelativeTimeFormat("fa", { numeric: "auto" })

export function formatDate(value?: string) {
  return value ? dateFormatter.format(new Date(value)) : "—"
}

// Time-relative helpers run per user only, so the empty prerender never reads the clock.
export function isWithin(value: string, ms: number) {
  return Date.now() - new Date(value).getTime() <= ms
}

export function formatPhone(value: string) {
  const local = value.replace(/^\+98/, "0")
  return /^09\d{9}$/.test(local) ? `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}` : value
}

export function formatRelative(value?: string) {
  if (!value) return "هرگز"
  const seconds = (new Date(value).getTime() - Date.now()) / 1000
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]]
  for (const [unit, size] of units) if (Math.abs(seconds) >= size) return relativeFormatter.format(Math.round(seconds / size), unit)
  return "همین الان"
}
