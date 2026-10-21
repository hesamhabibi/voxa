import { ConstructionIcon } from "lucide-react"

export function ComingSoon({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center">
      <ConstructionIcon className="size-6 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {children && <div className="text-sm leading-7 text-muted-foreground">{children}</div>}
    </div>
  )
}
