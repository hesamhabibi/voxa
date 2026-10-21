import type { Metadata } from "next"

import { ComingSoon } from "@/components/common/coming-soon"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = { title: "واژه‌ها" }

export default function DictionaryPage() {
  return (
    <>
      <PageHeader title="واژه‌های من" description="همهٔ لغاتی که از روز اول اضافه کرده‌ای." />
      <ComingSoon title="لیست واژه‌ها">
        بعد از ساخت لایهٔ ذخیره‌سازی، لغات با وضعیت (جدید، در حال یادگیری، بلدم) اینجا نمایش داده می‌شوند.
      </ComingSoon>
    </>
  )
}
