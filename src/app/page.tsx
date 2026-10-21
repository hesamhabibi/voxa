import Link from "next/link"
import { BookOpenTextIcon, ChevronLeftIcon, HeadphonesIcon, MicIcon, NotebookPenIcon, PenLineIcon, RotateCcwIcon, SpellCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SELF_TALK } from "@/lib/config"
import { toPersianDigits } from "@/lib/format"

const todaySteps = [
  { href: "/speaking/self-talk", title: "Self-talk", text: `${toPersianDigits(SELF_TALK.defaultMinutes)} دقیقه حرف زدن`, icon: MicIcon },
  { href: "/speaking/self-dictionary", title: "Self-dictionary", text: "جمله‌سازی با لغات امروز", icon: NotebookPenIcon },
  { href: "/speaking/review", title: "Review", text: "مرور شبانهٔ لغات", icon: RotateCcwIcon },
]

const upcomingModules = [
  { title: "گرامر", icon: SpellCheckIcon },
  { title: "ریدینگ", icon: BookOpenTextIcon },
  { title: "لیسنینگ", icon: HeadphonesIcon },
  { title: "رایتینگ", icon: PenLineIcon },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold">سلام 👋</h1>
        <p className="text-sm text-muted-foreground">برنامهٔ امروزت آماده است.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">برنامهٔ امروز</h2>
        {todaySteps.map(({ href, title, text, icon: Icon }, i) => (
          <Link key={href} href={href} className="block">
            <Card size="sm" className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">مرحلهٔ {toPersianDigits(i + 1)}</p>
                  <p dir="ltr" className="text-end font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
                <ChevronLeftIcon className="size-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">بخش‌های دیگر</h2>
        <div className="grid grid-cols-2 gap-3">
          {upcomingModules.map(({ title, icon: Icon }) => (
            <Card key={title} size="sm" className="opacity-60">
              <CardContent className="flex flex-col items-start gap-2">
                <Icon className="size-5" />
                <span className="font-medium">{title}</span>
                <Badge variant="secondary">به‌زودی</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
