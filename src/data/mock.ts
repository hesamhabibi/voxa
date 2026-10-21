import type { DictionaryWord } from "@/types"

// UI placeholder until real storage exists.
export const mockWord: DictionaryWord = {
  id: "w-001",
  english: "neighbourhood",
  persian: "محله",
  addedAt: "2026-10-21T10:00:00.000Z",
  status: "new",
  aiExamples: [
    "I grew up in a quiet neighbourhood near the river.",
    "There are lots of cafés in my neighbourhood.",
    "The neighbourhood has changed a lot in recent years.",
  ],
  userSentences: [],
}
