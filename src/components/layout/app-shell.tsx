import { AppHeader } from "@/components/layout/app-header"
import { BottomNav } from "@/components/layout/bottom-nav"

// Mobile-first frame: on desktop the app stays a centered phone-width column.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/40">
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background shadow-sm md:border-x">
        <AppHeader />
        <main className="flex-1 px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
