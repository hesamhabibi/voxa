import { SpeakingTabs } from "@/features/speaking/components/speaking-tabs"

export default function SpeakingLayout({ children }: LayoutProps<"/speaking">) {
  return (
    <div>
      <SpeakingTabs />
      {children}
    </div>
  )
}
