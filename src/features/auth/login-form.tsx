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
    if (!phone.trim() || busy) return
    setBusy(true)
    try {
      const response = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })
      const data = await readApiResponse<{ debugCode?: string }>(response)
      if (!response.ok) return notify.error(data.message ?? "دریافت کد ورود ممکن نشد.")
      // The test-only OTP must remain visible in the browser console until an SMS provider is connected.
      console.info("%c VOXA TEST OTP ", "background:#0f172a;color:#e0f2fe;padding:5px 10px;border-radius:999px;font-weight:700", data.debugCode)
      setCode(""); setStep("code"); notify.success("کد ورود ارسال شد.")
    } catch { notify.error("ارتباط با سرویس ورود برقرار نشد.") }
    finally { setBusy(false) }
  }

  async function verifyCode(enteredCode = code) {
    if (busy || enteredCode.length !== 6) return
    setBusy(true)
    try {
      const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code: enteredCode }) })
      const data = await readApiResponse<{ user?: { roles: string[] } }>(response)
      if (!response.ok) return notify.error(data.message ?? "ورود ممکن نشد.")
      router.replace(data.user?.roles.includes("admin") ? "/admin" : "/")
      router.refresh()
    } catch { notify.error("ارتباط با سرویس ورود برقرار نشد.") }
    finally { setBusy(false) }
  }

  return <div className="w-full">
    {step === "phone" ? <div className="space-y-7">
      <div><span className="inline-flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><Icon icon="solar:phone-calling-rounded-bold-duotone" className="size-5" /></span><h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">ورود به Voxa</h1><p className="mt-2 text-sm leading-6 text-slate-500">شمارهٔ موبایل خودت را وارد کن؛ کد ورود برای ادامه ارسال می‌شود.</p></div>
      <div className="space-y-2.5"><label htmlFor="phone" className="text-sm font-bold text-slate-700">شمارهٔ موبایل</label><div className="relative"><Icon icon="solar:phone-linear" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input id="phone" inputMode="tel" autoComplete="tel" dir="ltr" className="h-[3.25rem] rounded-2xl border-slate-200 bg-slate-50 ps-12 text-left text-base shadow-none placeholder:text-slate-300 focus-visible:bg-white" placeholder="0912 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void requestCode() }} /></div></div>
      <Button className="h-[3.25rem] w-full rounded-2xl bg-sky-600 text-sm font-bold shadow-lg shadow-sky-600/20 hover:bg-sky-700" size="lg" disabled={busy || !phone.trim()} onClick={requestCode}>{busy ? <><Icon icon="solar:refresh-circle-linear" className="size-5 animate-spin" />در حال ارسال…</> : <><span>دریافت کد ورود</span><Icon icon="solar:arrow-left-linear" className="size-5" /></>}</Button>
    </div> : <div className="space-y-7">
      <div className="flex items-start justify-between gap-3"><div><span className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Icon icon="solar:letter-opened-bold-duotone" className="size-5" /></span><h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">کد تأیید را وارد کن</h1><p dir="ltr" className="mt-2 text-sm font-medium tracking-wide text-slate-500">{phone}</p></div><button type="button" className="mt-1 rounded-xl px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-50" onClick={() => { setCode(""); setStep("phone") }}>تغییر شماره</button></div>
      <div className="space-y-3"><p className="text-sm leading-6 text-slate-500">کد شش‌رقمی را وارد کن؛ بعد از رقم آخر، ورود به‌صورت خودکار انجام می‌شود.</p><OtpInput value={code} onChange={setCode} onComplete={verifyCode} disabled={busy} /></div>
      <Button className="h-[3.25rem] w-full rounded-2xl bg-sky-600 text-sm font-bold shadow-lg shadow-sky-600/20 hover:bg-sky-700" size="lg" disabled={busy || code.length !== 6} onClick={() => void verifyCode()}>{busy ? <><Icon icon="solar:refresh-circle-linear" className="size-5 animate-spin" />در حال بررسی…</> : <><span>ورود</span><Icon icon="solar:login-3-linear" className="size-5" /></>}</Button>
    </div>}
  </div>
}
