import { Icon } from "@iconify/react"

import { LoginForm } from "@/features/auth/login-form"

export default function LoginPage() {
  return <main className="relative min-h-[100dvh] overflow-hidden bg-[#f6f9fc] px-4 py-5 sm:p-7">
    <div className="pointer-events-none absolute -end-48 -top-52 size-[34rem] rounded-full bg-sky-200/55 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-64 -start-48 size-[34rem] rounded-full bg-indigo-100/70 blur-3xl" />
    <div className="relative mx-auto grid min-h-[calc(100dvh-2.5rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[min(44rem,calc(100dvh-3.5rem))] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -start-28 top-16 size-96 rounded-full bg-sky-400/20 blur-3xl" /><div className="pointer-events-none absolute -end-20 bottom-0 size-96 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white text-sky-600"><Icon icon="solar:chat-round-dots-bold" className="size-6" /></span><span dir="ltr" className="text-xl font-black tracking-tight">Voxa</span></div>
        <div className="relative my-auto max-w-md"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky-200"><span className="size-1.5 rounded-full bg-emerald-400" />فضای یادگیری شخصی</span><h1 className="mt-6 text-4xl font-black leading-[1.35] tracking-tight">یادگیریِ پیوسته،<br />در ریتم خودت.</h1><p className="mt-5 text-sm leading-7 text-slate-300">واژه‌ها، تمرین‌ها و مسیر رشد زبانت را در یک فضای آرام و منظم دنبال کن.</p></div>
        <div className="relative grid grid-cols-3 gap-3"><Feature icon="solar:book-bookmark-linear" label="برنامهٔ شخصی" /><Feature icon="solar:chart-square-linear" label="رشد قابل‌پیگیری" /><Feature icon="solar:shield-check-linear" label="ورود امن" /></div>
      </section>
      <section className="safe-top safe-bottom flex items-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-sm"><div className="mb-10 flex items-center justify-between lg:hidden"><span className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white"><Icon icon="solar:chat-round-dots-bold" className="size-5" /></span><span dir="ltr" className="text-lg font-black text-slate-900">Voxa</span></span><span className="text-xs font-semibold text-slate-400">فضای یادگیری</span></div><LoginForm /><p className="mt-8 text-center text-xs leading-6 text-slate-400">با ادامهٔ ورود، قوانین استفاده و حریم خصوصی Voxa را می‌پذیری.</p></div>
      </section>
    </div>
  </main>
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"><Icon icon={icon} className="size-5 text-sky-300" /><p className="mt-3 text-xs font-bold text-slate-200">{label}</p></div>
}
