import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { APP_NAME } from "@/lib/config"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/60">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">V</span>
        <span dir="ltr" className="text-lg tracking-tight">
          {APP_NAME}
        </span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
