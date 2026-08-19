import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('mf_access_token')?.value
  const companyId = request.cookies.get('mf_company_id')?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify-email')

  const isSelectCompany = pathname.startsWith('/select-company')

  const isPublicPage =
    pathname === '/' ||
    pathname === '/privacy' ||
    pathname.startsWith('/delete-account')

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (token && !companyId && !isSelectCompany && !isPublicPage) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  if (token && companyId && isSelectCompany) {
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
    '/login',
    '/register',
    '/verify-email',
  ],
}
