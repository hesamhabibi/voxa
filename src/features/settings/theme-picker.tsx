"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "cn"

import { themeOptions } from "@/components/theme-toggle"

export function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- theme is only known on the client
  useEffect(() => setMounted(true), [])

  return (
    <div className="grid grid-cols-3 gap-2">
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-3 text-xs transition-colors",
            mounted && theme === value && "border-primary bg-primary/5 text-primary"
          )}
        >
          <Icon className="size-5" />
          {label}
        </button>
      ))}
    </div>
  )
}
