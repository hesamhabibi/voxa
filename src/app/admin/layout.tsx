import { AdminShell } from "@/features/membership/admin-shell"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
