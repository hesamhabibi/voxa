"use client"

import { useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { mockWord } from "@/data/mock"
import { REVIEW } from "@/lib/config"
import { toPersianDigits } from "@/lib/format"

// Skeleton: word selection (spaced repetition), AI judging and result lists are TODO.
export function ReviewScreen() {
  const word = mockWord
  const [flipped, setFlipped] = useState(false)
  const [meaning, setMeaning] = useState("")
  const [sentence, setSentence] = useState("")

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        مرور امشب: {toPersianDigits(1)} از {toPersianDigits(REVIEW.defaultWordsPerNight)} لغت
      </p>

      <Card>
        <CardHeader>
          <CardTitle dir="ltr" className="text-center text-2xl">
            {word.english}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!flipped ? (
            <>
              <Input placeholder="معنی فارسی" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
              <Textarea
                dir="ltr"
                rows={2}
                placeholder="Write an English sentence"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
              />
              <Button className="w-full" disabled={!meaning.trim() || !sentence.trim()} onClick={() => setFlipped(true)}>
                تأیید
              </Button>
            </>
          ) : (
            <>
              <p className="text-center text-lg font-semibold">{word.persian}</p>
              <Separator />
              <div dir="ltr" className="space-y-1 text-start text-sm leading-6">
                <p className="font-medium">AI examples</p>
                {word.aiExamples.map((ex) => (
                  <p key={ex}>• {ex}</p>
                ))}
                <p className="pt-2 font-medium">Your sentences</p>
                <p className="text-muted-foreground">—</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="border-green-600/40 text-green-700 dark:text-green-400">
                  <CheckIcon />
                  درست بود
                </Button>
                <Button variant="destructive">
                  <XIcon />
                  غلط بود
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
