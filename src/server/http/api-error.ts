import "server-only"

import { NextResponse } from "next/server"

export function apiError(context: string, error: unknown) {
  console.error(`[${context}]`, error)
  return NextResponse.json({ message: "خطایی در اتصال به سرویس رخ داد. دوباره تلاش کن." }, { status: 500 })
}
