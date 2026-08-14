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
    const months = searchParams.get('months')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const query = new URLSearchParams()
    if (months) query.set('months', months)
    if (from) query.set('from', from)
    if (to) query.set('to', to)

    const data = await apiServer(`dashboard/monthly-report?${query}`, { token, companyId })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to load monthly report' },
      { status: err.status || 500 }
    )
  }
}
