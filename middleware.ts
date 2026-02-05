// middleware.ts (root level, same as app/ folder)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This runs on the SERVER before any page loads
  // Check if token exists in cookies
  const token = request.cookies.get('token')?.value // or 'authToken', whatever you named it
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isProtectedRoute = !isAuthPage // everything except /auth is protected

  // No token + trying to access protected page → redirect to /auth
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Has token + trying to access /auth → redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next() // Allow the request to continue
}

// Tell middleware which routes to run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}