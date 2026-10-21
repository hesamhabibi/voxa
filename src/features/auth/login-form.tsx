"use client"

import { Icon } from "@iconify/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { notify } from "@/components/feedback/notify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OtpInput } from "@/components/ui/otp-input"
import { readApiResponse } from "@/lib/api-client"

type Step = "phone" | "code"

export function LoginForm() {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function requestCode() {
    setBusy(true)
    const response = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })
    const data = await readApiResponse<{ debugCode?: string }>(response)
    setBusy(false)
    if (!response.ok) return notify.error(data.message ?? "دریافت کد ورود ممکن نشد.")
    // Deliberately available during the no-SMS test phase only.
    console.info("%c VOXA TEST OTP ", "background:#1f2937;color:#fff;padding:4px 8px;border-radius:4px", data.debugCode)
    setCode("")
    setStep("code")
    notify.success("کد ورود ارسال شد.")
  }

  async function verifyCode(enteredCode = code) {
    if (busy || enteredCode.length !== 6) return
    setBusy(true)
    const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code: enteredCode }) })
    const data = await readApiResponse<{ user?: { roles: string[] } }>(response)
    setBusy(false)
    if (!response.ok) return notify.error(data.message ?? "ورود ممکن نشد.")
    router.replace(data.user?.roles.includes("admin") ? "/admin/users" : "/")
    router.refresh()
  }

  return <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur dark:border-white/10">
    <div className="relative overflow-hidden bg-primary px-6 pb-14 pt-8 text-primary-foreground sm:px-8">
      <div className="absolute -end-12 -top-16 size-44 rounded-full bg-white/10" /><div className="absolute -bottom-20 start-8 size-40 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Icon icon="solar:chat-round-dots-bold" className="size-6" /></span><span dir="ltr" className="text-xl font-bold tracking-tight">Voxa</span></div>
      <div className="relative mt-10"><p className="text-sm text-primary-foreground/70">فضای شخصی یادگیری زبان</p><h1 className="mt-2 text-2xl font-bold">خوش آمدی</h1></div>
    </div>
    <div className="-mt-6 rounded-t-[2rem] bg-card px-6 pb-7 pt-7 sm:px-8">
      {step === "phone" ? <div className="space-y-6"><div><h2 className="font-semibold">شمارهٔ موبایل</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">کد ورود را برای ادامه دریافت کن.</p></div><div className="space-y-2"><label htmlFor="phone" className="text-sm font-medium">موبایل</label><div className="relative"><Icon icon="solar:phone-linear" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input id="phone" inputMode="tel" dir="ltr" className="h-12 ps-11" placeholder="0912 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} /></div></div><Button className="h-12 w-full" size="lg" disabled={busy || !phone.trim()} onClick={requestCode}>{busy ? "در حال ارسال…" : "دریافت کد ورود"}<Icon icon="solar:arrow-left-linear" /></Button></div> : <div className="space-y-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">کد ورود را وارد کن</h2><p dir="ltr" className="mt-1 text-sm text-muted-foreground">{phone}</p></div><button className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" onClick={() => setStep("phone")}>تغییر شماره</button></div><OtpInput value={code} onChange={setCode} onComplete={verifyCode} disabled={busy} /><Button className="h-12 w-full" size="lg" disabled={busy || code.length !== 6} onClick={() => verifyCode()}>{busy ? "در حال بررسی…" : "ورود"}<Icon icon="solar:login-3-linear" /></Button></div>}
    </div>
  </div>
}
