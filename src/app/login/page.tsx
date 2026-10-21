import { BookOpenCheck, LineChart, MessagesSquare, ShieldCheck } from "lucide-react"

import { LoginForm } from "@/features/auth/login-form"

const features = [
  { icon: BookOpenCheck, title: "برنامهٔ شخصی", text: "تمرین‌ها متناسب با سطح و هدف تو" },
  { icon: LineChart, title: "پیشرفت قابل‌اندازه‌گیری", text: "رشد مهارت‌ها را روز به روز ببین" },
  { icon: ShieldCheck, title: "ورود امن بدون رمز", text: "فقط با کد یک‌بارمصرف پیامکی" },
]

export default function LoginPage() {
  return <main className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <section className="safe-top safe-bottom flex flex-col px-5 py-6 sm:px-8">
      <Brand />
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-[22rem]"><LoginForm /></div>
      </div>
      <p className="text-center text-[11px] leading-5 text-muted-foreground">ورود به معنی پذیرش قوانین و حریم خصوصی Voxa است.</p>
    </section>

    <aside className="relative m-3 hidden overflow-hidden rounded-2xl bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -start-32 size-96 rounded-full bg-white/10 blur-3xl" />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/15"><span className="size-1.5 rounded-full bg-emerald-300" />فضای یادگیری زبان</span>
      <div className="relative max-w-md">
        <h2 className="text-3xl font-bold leading-[1.5]">انگلیسی را هر روز،<br />کمی بهتر صحبت کن.</h2>
        <p className="mt-3 text-sm leading-7 text-primary-foreground/75">واژه‌ها، تمرین‌های گفتاری و مسیر پیشرفتت، همه در یک‌جا.</p>
      </div>
      <ul className="relative grid gap-2.5">
        {features.map(({ icon: Icon, title, text }) => <li key={title} className="flex items-center gap-3 rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/10 backdrop-blur-sm">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15"><Icon className="size-4" /></span>
          <span><span className="block text-[13px] font-semibold">{title}</span><span className="block text-xs text-primary-foreground/65">{text}</span></span>
        </li>)}
      </ul>
    </aside>
  </main>
}

function Brand() {
  return <div className="flex items-center gap-2">
    <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><MessagesSquare className="size-4" /></span>
    <span dir="ltr" className="text-base font-bold tracking-tight">Voxa</span>
  </div>
}
