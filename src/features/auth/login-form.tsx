"use client"

import { Icon } from "@iconify/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notify } from "@/components/feedback/notify"

type Step = "phone" | "code"
export function LoginForm() {
  const [step, setStep] = useState<Step>("phone"), [phone, setPhone] = useState(""), [code, setCode] = useState(""), [busy, setBusy] = useState(false)
  const router = useRouter()
  async function requestCode() {
    setBusy(true)
    const response = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })
    const data = await response.json()
    setBusy(false)
    if (!response.ok) return notify.error(data.message)
    if (data.debugCode) console.info("[VOXA TEST OTP]", data.debugCode)
    setStep("code"); notify.success("کد ورود در کنسول ثبت شد.")
  }
  async function verifyCode() {
    setBusy(true)
    const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }) })
    const data = await response.json()
    setBusy(false)
    if (!response.ok) return notify.error(data.message)
    router.replace(data.user.roles.includes("admin") ? "/admin/users" : "/")
    router.refresh()
  }
  return <div className="w-full max-w-sm space-y-7 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
    <div className="space-y-3 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Icon icon="solar:lock-keyhole-bold" className="size-6" /></span><div><h1 className="text-2xl font-bold">ورود به Voxa</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">برای ادامه، شمارهٔ موبایلت را وارد کن.</p></div></div>
    {step === "phone" ? <div className="space-y-3"><Input inputMode="tel" dir="ltr" placeholder="0912 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} /><Button className="w-full" size="lg" disabled={busy || !phone.trim()} onClick={requestCode}>{busy ? "در حال ارسال…" : "دریافت کد ورود"}<Icon icon="solar:arrow-left-linear" /></Button></div> : <div className="space-y-3"><div className="flex items-center justify-between"><label htmlFor="otp" className="text-sm font-medium">کد شش‌رقمی</label><button className="text-xs text-muted-foreground underline" onClick={() => setStep("phone")}>تغییر شماره</button></div><Input id="otp" inputMode="numeric" dir="ltr" maxLength={6} placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} /><Button className="w-full" size="lg" disabled={busy || code.length !== 6} onClick={verifyCode}>{busy ? "در حال بررسی…" : "ورود امن"}<Icon icon="solar:shield-check-linear" /></Button><p className="text-center text-xs text-muted-foreground">در حالت آزمایشی، کد در Console مرورگر و ترمینال توسعه ثبت می‌شود.</p></div>}
  </div>
}
