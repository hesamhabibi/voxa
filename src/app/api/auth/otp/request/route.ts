import { NextResponse } from "next/server"
import { normalizeIranianMobile } from "@/lib/phone"
import { issueTestOtp } from "@/server/auth/otp"
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: unknown } | null
  const phone = typeof body?.phone === "string" ? normalizeIranianMobile(body.phone) : null
  if (!phone) return NextResponse.json({ message: "شمارهٔ موبایل معتبر نیست." }, { status: 400 })
  const otp = issueTestOtp(phone)
  // Temporary test delivery: remove debugCode when an SMS provider is connected.
  return NextResponse.json({ expiresIn: otp.expiresIn, debugCode: otp.code })
}
