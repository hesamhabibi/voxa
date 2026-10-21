import { NextResponse, type NextRequest } from "next/server"
import { readSession, sessionCookie } from "@/server/auth/session"

// Route handlers verify the signed session and authorization. This only keeps
// unauthenticated visitors away from the admin shell before it renders.
export async function proxy(request: NextRequest) {
  const session = await readSession(request.cookies.get(sessionCookie.name)?.value)

  if (request.nextUrl.pathname === "/login") {
    if (session) return NextResponse.redirect(new URL(session.roles.includes("admin") ? "/admin/users" : "/", request.url))
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"],
}
