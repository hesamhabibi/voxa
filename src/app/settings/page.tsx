import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { ThemePicker } from "@/features/settings/theme-picker"
import { REVIEW, SELF_TALK } from "@/lib/config"
import { toPersianDigits } from "@/lib/format"

export const metadata: Metadata = { title: "تنظیمات" }

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="تنظیمات" />

      <Card>
        <CardHeader>
          <CardTitle>ظاهر</CardTitle>
          <CardDescription>تم روشن، تیره یا مطابق دستگاه</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePicker />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تمرین</CardTitle>
          <CardDescription>قابل تنظیم در نسخه‌های بعد (برای هر زبان‌آموز جدا)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>زمان Self-talk</span>
            <span className="text-muted-foreground">{toPersianDigits(SELF_TALK.defaultMinutes)} دقیقه</span>
          </div>
          <div className="flex justify-between">
            <span>تعداد لغت مرور شبانه</span>
            <span className="text-muted-foreground">{toPersianDigits(REVIEW.defaultWordsPerNight)} لغت</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
