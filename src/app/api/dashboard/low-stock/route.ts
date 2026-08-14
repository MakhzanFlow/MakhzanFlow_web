import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken } from '@/lib/cookies'

export async function GET(request: Request) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const companyId = request.headers.get('x-company-id')
    if (!companyId) {
      return NextResponse.json({ success: false, message: 'Company ID required' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    const query = new URLSearchParams({ page, limit, sort, order })
    if (search) query.set('search', search)

    const data = await apiServer(`dashboard/low-stock?${query}`, { token, companyId })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to load low stock products' },
      { status: err.status || 500 }
    )
  }
}
