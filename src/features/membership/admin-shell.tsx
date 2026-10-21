"use client"

import { BarChart3, BookOpen, ChevronsUpDown, ExternalLink, LayoutDashboard, LogOut, Menu, MessagesSquare, Monitor, Moon, ShieldCheck, Sun, Users, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { readApiResponse } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { UserAvatar, formatPhone } from "./admin-ui"
import { MembershipProvider } from "./membership-context"

interface NavItem { href: string; label: string; icon: LucideIcon; soon?: boolean }

const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "اصلی", items: [
    { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
    { href: "/admin/users", label: "کاربران", icon: Users },
    { href: "/admin/roles", label: "نقش‌ها و دسترسی", icon: ShieldCheck },
  ] },
  { label: "آموزش", items: [
    { href: "/admin/content", label: "محتوای آموزشی", icon: BookOpen, soon: true },
    { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3, soon: true },
  ] },
]

const allItems = navGroups.flatMap((group) => group.items)
const isActive = (href: string, pathname: string) => href === "/admin" ? pathname === href : pathname.startsWith(href)

interface CurrentUser { fullName: string; phone: string }

function Brand() {
  return <Link href="/admin" className="flex items-center gap-2" aria-label="داشبورد مدیریت Voxa">
    <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><MessagesSquare className="size-3.5" /></span>
    <span dir="ltr" className="text-[15px] font-bold tracking-tight text-foreground">Voxa</span>
    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">مدیریت</span>
  </Link>
}

function Navigation() {
  const pathname = usePathname()
  return <nav className="space-y-5" aria-label="منوی مدیریت">
    {navGroups.map((group) => <div key={group.label}>
      <p className="mb-1 px-2 text-[11px] font-medium text-muted-foreground/80">{group.label}</p>
      <ul className="space-y-0.5">
        {group.items.map(({ href, label, icon: Icon, soon }) => {
          const active = isActive(href, pathname)
          if (soon) return <li key={href}><span className="flex h-8 cursor-not-allowed items-center gap-2.5 rounded-md px-2 text-[13px] text-muted-foreground/60"><Icon className="size-4" />{label}<span className="ms-auto rounded bg-muted px-1.5 text-[10px]">به‌زودی</span></span></li>
          return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={cn("flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")}>
            <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />{label}
          </Link></li>
        })}
      </ul>
    </div>)}
  </nav>
}

function AccountMenu({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    router.replace("/login"); router.refresh()
  }
  const name = user?.fullName ?? "…"
  return <DropdownMenu>
    <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-start transition-colors hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent">
      <UserAvatar name={name} seed={user?.phone ?? "x"} className="size-7" />
      <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium leading-4">{name}</span><span dir="ltr" className="block truncate text-end text-[11px] text-muted-foreground">{user && formatPhone(user.phone)}</span></span>
      <ChevronsUpDown className="size-3.5 text-muted-foreground" />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="top" align="start" className="w-56">
      <DropdownMenuGroup><DropdownMenuLabel>پوسته</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light"><Sun />روشن</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon />تیره</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor />مطابق دستگاه</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.push("/")}><ExternalLink />رفتن به اپلیکیشن</DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onClick={() => void logout()}><LogOut />خروج از حساب</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

function SidebarBody({ user }: { user: CurrentUser | null }) {
  return <>
    <div className="flex h-14 shrink-0 items-center border-b px-4"><Brand /></div>
    <div className="app-scrollbar flex-1 overflow-y-auto p-3"><Navigation /></div>
    <div className="border-t p-2"><AccountMenu user={user} /></div>
  </>
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const pathname = usePathname()
  const current = allItems.find((item) => isActive(item.href, pathname))
  const [openedAt, setOpenedAt] = useState(pathname)
  if (openedAt !== pathname) { setOpenedAt(pathname); setOpen(false) }

  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/me").then((response) => readApiResponse<{ user?: CurrentUser }>(response)).then((data) => { if (!cancelled && data.user) setUser(data.user) }).catch(() => null)
    return () => { cancelled = true }
  }, [])

  return <div className="fixed inset-0 flex bg-background text-foreground">
    <aside className="hidden w-60 shrink-0 flex-col border-e bg-sidebar lg:flex"><SidebarBody user={user} /></aside>

    <div className="flex min-w-0 flex-1 flex-col">
      <header className="safe-top flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}><Menu /></Button>
        <nav aria-label="مسیر" className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">مدیریت</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium">{current?.label ?? "داشبورد"}</span>
        </nav>
      </header>
      <main className="app-scrollbar flex-1 overflow-y-auto overscroll-contain">
        <div className="safe-bottom mx-auto w-full max-w-6xl p-4 lg:p-6"><MembershipProvider>{children}</MembershipProvider></div>
      </main>
    </div>

    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" showCloseButton={false} className="w-64 gap-0 bg-sidebar p-0">
        <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
        <SidebarBody user={user} />
      </SheetContent>
    </Sheet>
  </div>
}
