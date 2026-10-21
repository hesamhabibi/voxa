"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/admin", label: "نمای کلی", icon: "solar:widget-5-linear" },
  { href: "/admin/users", label: "کاربران و دسترسی", icon: "solar:users-group-rounded-linear" },
] as const

function Brand() {
  return <Link href="/admin" className="flex items-center gap-3" aria-label="صفحهٔ اصلی مدیریت Voxa">
    <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25"><Icon icon="solar:chat-round-dots-bold" className="size-5" /></span>
    <span><span dir="ltr" className="block text-lg font-black tracking-tight text-slate-900">Voxa</span><span className="block text-[10px] font-semibold text-slate-400">مدیریت یادگیری</span></span>
  </Link>
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return <nav className="space-y-1" aria-label="منوی مدیریت">
    <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-400">فضای کار</p>
    {navigation.map((item) => {
      const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
      return <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all", active ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}>
        <Icon icon={item.icon} className={cn("size-5", active ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600")} />
        <span>{item.label}</span>
      </Link>
    })}
  </nav>
}

function AccountPanel() {
  return <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
    <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">م</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-slate-800">مدیر Voxa</span><span className="block truncate text-[10px] text-slate-400">دسترسی مدیر سیستم</span></span><Icon icon="solar:verified-check-bold" className="size-4 text-emerald-500" /></div>
  </div>
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="fixed inset-0 flex max-h-[100dvh] overflow-hidden bg-[#f7f9fc] text-slate-900">
    <aside className="hidden w-72 shrink-0 flex-col border-l border-slate-200/80 bg-white lg:flex">
      <div className="px-6 pb-5 pt-7"><Brand /></div>
      <div className="flex-1 overflow-y-auto px-4 py-3"><Navigation /></div>
      <div className="p-4"><AccountPanel /></div>
    </aside>

    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="safe-top flex min-h-16 shrink-0 items-center justify-between border-b border-slate-200/75 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden" aria-label="باز کردن منو"><Icon icon="solar:hamburger-menu-linear" className="size-5" /></SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,86vw)] gap-0 p-0" showCloseButton={false}>
              <SheetHeader className="border-b border-slate-100 px-5 py-6"><SheetTitle><Brand /></SheetTitle></SheetHeader>
              <div className="flex flex-1 flex-col px-4 py-5"><Navigation onNavigate={() => setOpen(false)} /><div className="mt-auto pt-6"><AccountPanel /></div></div>
            </SheetContent>
          </Sheet>
          <div className="lg:hidden"><Brand /></div>
          <div className="hidden sm:block"><p className="text-xs font-medium text-slate-400">پنل مدیریت</p><p className="text-sm font-bold text-slate-800">مدیریت اعضا و دسترسی‌ها</p></div>
        </div>
        <div className="flex items-center gap-2"><button type="button" className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label="اعلان‌ها"><Icon icon="solar:bell-linear" className="size-5" /></button><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex"><span className="me-1.5 size-1.5 rounded-full bg-emerald-500" />سامانه فعال است</span></div>
      </header>
      <main className="app-scrollbar flex-1 overflow-y-auto overscroll-contain"><div className="mx-auto w-full max-w-7xl p-4 pb-8 sm:p-6 lg:p-8">{children}</div></main>
    </div>
  </div>
}
