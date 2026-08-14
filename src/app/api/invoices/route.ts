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
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''

    const query = new URLSearchParams({ page, limit })
    if (type) query.set('type', type)
    if (status) query.set('status', status)
    if (from) query.set('from', from)
    if (to) query.set('to', to)

    const data = await apiServer(`invoices?${query}`, { token, companyId })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to load invoices' },
      { status: err.status || 500 }
    )
  }
}
