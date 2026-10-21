"use client"

import { ThemeProvider } from "next-themes"

import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DirectionProvider direction="rtl">
        {children}
        <Toaster position="top-center" />
      </DirectionProvider>
    </ThemeProvider>
  )
}
