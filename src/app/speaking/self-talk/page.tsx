import type { Metadata } from "next"

import { SelfTalkScreen } from "@/features/speaking/components/self-talk-screen"

export const metadata: Metadata = { title: "Self-talk" }

export default function SelfTalkPage() {
  return <SelfTalkScreen />
}
