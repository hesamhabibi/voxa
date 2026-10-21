"use client"

import { ArrowLeft, ArrowRight, Loader2, LogIn, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { notify } from "@/components/feedback/notify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OtpInput } from "@/components/ui/otp-input"
import { readApiResponse } from "@/lib/api-client"
import { toPersianDigits } from "@/lib/format"

type Step = "phone" | "code"
const RESEND_SECONDS = 60

export function LoginForm() {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function requestCode() {
    if (!phone.trim() || busy) return
    setBusy(true)
    try {
      const response = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })
      const data = await readApiResponse<{ debugCode?: string }>(response)
      if (!response.ok) return notify.error(data.message ?? "دریافت کد ورود ممکن نشد.")
      // The test-only OTP must remain visible in the browser console until an SMS provider is connected.
      console.info("%c VOXA TEST OTP ", "background:#0f172a;color:#e0f2fe;padding:5px 10px;border-radius:999px;font-weight:700", data.debugCode)
      setCode(""); setStep("code"); setCooldown(RESEND_SECONDS); notify.success("کد ورود ارسال شد.")
    } catch { notify.error("ارتباط با سرویس ورود برقرار نشد.") }
    finally { setBusy(false) }
  }

  async function verifyCode(enteredCode = code) {
    if (busy || enteredCode.length !== 6) return
    setBusy(true)
    try {
      const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code: enteredCode }) })
      const data = await readApiResponse<{ user?: { roles: string[] } }>(response)
      if (!response.ok) { setCode(""); return notify.error(data.message ?? "ورود ممکن نشد.") }
      router.replace(data.user?.roles.includes("admin") ? "/admin" : "/")
      router.refresh()
    } catch { notify.error("ارتباط با سرویس ورود برقرار نشد.") }
    finally { setBusy(false) }
  }

  if (step === "phone") return <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void requestCode() }}>
    <header className="space-y-1.5">
      <h1 className="text-xl font-bold tracking-tight">ورود به حساب</h1>
      <p className="text-sm text-muted-foreground">شمارهٔ موبایلت را وارد کن تا کد ورود برایت ارسال شود.</p>
    </header>
    <div className="space-y-1.5">
      <label htmlFor="phone" className="text-xs font-medium">شمارهٔ موبایل</label>
      <div className="relative">
        <Smartphone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id="phone" inputMode="tel" autoComplete="tel" autoFocus dir="ltr" className="h-10 pl-9 text-left tracking-wide" placeholder="0912 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </div>
    </div>
    <Button type="submit" className="h-10 w-full" disabled={busy || !phone.trim()}>
      {busy ? <><Loader2 className="animate-spin" />در حال ارسال…</> : <>دریافت کد ورود<ArrowLeft /></>}
    </Button>
  </form>

  return <div className="space-y-6">
    <button type="button" onClick={() => { setCode(""); setStep("phone") }} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"><ArrowRight className="size-3.5" />تغییر شماره</button>
    <header className="space-y-1.5">
      <h1 className="text-xl font-bold tracking-tight">کد تأیید</h1>
      <p className="text-sm text-muted-foreground">کد ۶ رقمی ارسال‌شده به <span dir="ltr" className="font-medium text-foreground">{phone}</span> را وارد کن.</p>
    </header>
    <OtpInput value={code} onChange={setCode} onComplete={verifyCode} disabled={busy} />
    <Button className="h-10 w-full" disabled={busy || code.length !== 6} onClick={() => void verifyCode()}>
      {busy ? <><Loader2 className="animate-spin" />در حال بررسی…</> : <><LogIn />ورود</>}
    </Button>
    <p className="text-center text-xs text-muted-foreground">
      {cooldown > 0 ? <>ارسال دوباره تا {toPersianDigits(cooldown)} ثانیهٔ دیگر</> : <>کد را دریافت نکردی؟ <button type="button" disabled={busy} onClick={() => void requestCode()} className="font-medium text-primary hover:underline">ارسال دوباره</button></>}
    </p>
  </div>
}
