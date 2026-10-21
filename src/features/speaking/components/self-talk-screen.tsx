"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, PlayIcon, SkipForwardIcon, TimerIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { questions } from "@/data/questions"
import { SELF_TALK } from "@/lib/config"
import { formatTimer, toPersianDigits } from "@/lib/format"

// Skeleton: real countdown, random question picking, no-repeat rules and
// auto-redirect to Self-dictionary are TODO (see docs/VOXA_CONTEXT.md).
export function SelfTalkScreen() {
  const [started, setStarted] = useState(false)
  const [revealed, setRevealed] = useState<string[]>([])
  const question = questions[0]

  const toggle = (id: string) =>
    setRevealed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  if (!started) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <TimerIcon className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="font-semibold">تمرین امروز: {toPersianDigits(SELF_TALK.defaultMinutes)} دقیقه</p>
            <p className="text-sm text-muted-foreground">سؤال‌ها تصادفی می‌آیند. شفاهی جواب بده.</p>
          </div>
          <Button size="lg" className="w-full" onClick={() => setStarted(true)}>
            <PlayIcon />
            شروع
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">سؤال {toPersianDigits(1)}</Badge>
        <Badge variant="outline" dir="ltr" className="gap-1 font-mono text-sm tabular-nums">
          <TimerIcon className="size-3.5" />
          {formatTimer(SELF_TALK.defaultMinutes * 60)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle dir="ltr" className="text-start text-lg">
            {question.text}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">ایده نداری؟ یکی از نمونه‌ها را باز کن.</p>
        {question.samples.map((sample, i) => {
          const open = revealed.includes(sample.id)
          return (
            <Card key={sample.id} size="sm">
              <CardContent className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggle(sample.id)}
                  className="flex w-full items-center justify-between text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>نمونهٔ {toPersianDigits(i + 1)}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {toPersianDigits(sample.sentences.length)} جمله
                    </span>
                  </span>
                  {open ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
                {open && (
                  // TODO: tap a word → meaning + "add to dictionary".
                  <p dir="ltr" className="text-start leading-7">
                    {sample.sentences.join(" ")}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button variant="outline" className="w-full" disabled>
        <SkipForwardIcon />
        سؤال بعدی
      </Button>
    </div>
  )
}
