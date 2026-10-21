"use client"

import { useState } from "react"
import { CheckIcon, RefreshCwIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { mockWord } from "@/data/mock"
import { SELF_DICTIONARY } from "@/lib/config"
import { toPersianDigits } from "@/lib/format"

// Skeleton: AI example refresh, persistence of drafts and grammar hints are TODO.
export function SelfDictionaryScreen() {
  const word = mockWord
  const total = 30
  const current = 1
  const [sentences, setSentences] = useState<string[]>(
    Array(SELF_DICTIONARY.requiredSentencesPerWord).fill("")
  )
  const complete = sentences.every((s) => s.trim().length > 0)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            لغت {toPersianDigits(current)} از {toPersianDigits(total)}
          </span>
        </div>
        <Progress value={(current / total) * 100} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle dir="ltr" className="text-start text-2xl">
            {word.english}
          </CardTitle>
          <p className="text-muted-foreground">{word.persian}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">مثال‌های هوش مصنوعی</Badge>
            <Button variant="ghost" size="sm" disabled>
              <RefreshCwIcon />
              {toPersianDigits(SELF_DICTIONARY.aiExamplesPerBatch)} مثال جدید
            </Button>
          </div>
          <ul dir="ltr" className="list-disc space-y-1 ps-5 text-start text-sm leading-6">
            {word.aiExamples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          با این لغت {toPersianDigits(SELF_DICTIONARY.requiredSentencesPerWord)} جمله بساز
        </p>
        {sentences.map((value, i) => (
          <Textarea
            key={i}
            dir="ltr"
            rows={2}
            placeholder={`Sentence ${i + 1}`}
            value={value}
            onChange={(e) => setSentences((prev) => prev.map((s, j) => (j === i ? e.target.value : s)))}
          />
        ))}
      </div>

      <Button size="lg" className="w-full" disabled={!complete}>
        <CheckIcon />
        تأیید و لغت بعدی
      </Button>
    </div>
  )
}
