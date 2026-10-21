"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { speakingTabs } from "@/lib/navigation"

export function SpeakingTabs() {
  const pathname = usePathname()

  return (
    <nav className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
      {speakingTabs.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            dir="ltr"
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-2 py-2 text-center text-xs font-medium text-muted-foreground transition-colors",
              active && "bg-background text-foreground shadow-sm"
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
