import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('mf_access_token')?.value
  const companyId = request.cookies.get('mf_company_id')?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify-email')
  const isSelectCompany = pathname.startsWith('/select-company')

  if (!accessToken) {
    if (isAuthPage) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (accessToken && !companyId && !isSelectCompany) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (accessToken && companyId && isSelectCompany) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/select-company', '/login', '/register', '/verify-email'],
}