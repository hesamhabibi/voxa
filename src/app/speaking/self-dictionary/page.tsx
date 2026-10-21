import type { Metadata } from "next"

import { SelfDictionaryScreen } from "@/features/speaking/components/self-dictionary-screen"

export const metadata: Metadata = { title: "Self-dictionary" }

export default function SelfDictionaryPage() {
  return <SelfDictionaryScreen />
}
