"use client"

import { useRef } from "react"
import { cn } from "cn"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  length?: number
}

/** Accessible, keyboard-friendly OTP fields that submit when the final digit lands. */
export function OtpInput({ value, onChange, onComplete, disabled = false, length = 6 }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? "")
  const commit = (next: string) => { onChange(next); if (next.length === length) onComplete?.(next) }
  const updateDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1)
    const nextDigits = [...digits]; nextDigits[index] = digit
    commit(nextDigits.join(""))
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus()
  }
  return <div dir="ltr" className="flex justify-center gap-2" aria-label="کد یک‌بارمصرف">
    {digits.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element }} value={digit} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} aria-label={`رقم ${index + 1}`} disabled={disabled} maxLength={1} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus() }} onPaste={(event) => { const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length); if (!pasted) return; event.preventDefault(); commit(pasted); inputRefs.current[Math.min(pasted.length, length - 1)]?.focus() }} className={cn("size-11 rounded-xl border bg-background text-center text-lg font-semibold tabular-nums outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 sm:size-12", digit && "border-primary/50 bg-primary/5")} />)}
  </div>
}
