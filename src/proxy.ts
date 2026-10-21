import { NextResponse, type NextRequest } from "next/server"

// Route handlers verify the signed session and authorization. This only keeps
// unauthenticated visitors away from the admin shell before it renders.
export function proxy(request: NextRequest) {
  if (!request.cookies.get("voxa_session")?.value) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ["/admin/:path*"] }
