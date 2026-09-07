import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('mf_access_token')?.value
  const refreshToken = request.cookies.get('mf_refresh_token')?.value
  const companyId = request.cookies.get('mf_company_id')?.value
  const pathname = request.nextUrl.pathname
  const hasSession = Boolean(token || refreshToken)

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify-email')

  const isSelectCompany = pathname.startsWith('/select-company')
  const isPendingPage = pathname.startsWith('/pending')

  const isPublicPage =
    pathname === '/' ||
    pathname === '/privacy' ||
    pathname.startsWith('/delete-account')

  if (!hasSession && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (hasSession && !companyId && !isSelectCompany && !isPendingPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (hasSession && companyId && (isSelectCompany || isPendingPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/customers/:path*',
    '/invoices/:path*',
    '/payments/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/select-company',
    '/pending',
    '/login',
    '/register',
    '/verify-email',
  ],
}
