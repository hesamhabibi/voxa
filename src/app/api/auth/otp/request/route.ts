import { NextResponse } from "next/server"
import { normalizeIranianMobile } from "@/lib/phone"
import { issueTestOtp } from "@/server/auth/otp"
import { apiError } from "@/server/http/api-error"
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { phone?: unknown } | null
    const phone = typeof body?.phone === "string" ? normalizeIranianMobile(body.phone) : null
    if (!phone) return NextResponse.json({ message: "شمارهٔ موبایل معتبر نیست." }, { status: 400 })
    const otp = await issueTestOtp(phone)
    // Temporary test delivery: remove debugCode when an SMS provider is connected.
    return NextResponse.json({ expiresIn: otp.expiresIn, debugCode: otp.code })
  } catch (error) { return apiError("otp-request", error) }
}
