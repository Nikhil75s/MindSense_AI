import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of routes that require authentication
const protectedRoutes = ["/dashboard", "/admin", "/profile"]

// List of auth-related routes (should redirect to home if already logged in)
const authRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("mindsense_auth_token")?.value

  // Check if current route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    // Redirect to signin with return url
    const url = new URL("/signin", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }



  if (isAuthRoute && token) {
    // Redirect to dashboard if already logged in and trying to access auth pages
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
