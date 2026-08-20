import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken } from '@/lib/cookies'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const companyId = request.headers.get('x-company-id')
    if (!companyId) {
      return NextResponse.json({ success: false, message: 'Company ID required' }, { status: 400 })
    }

    const { id } = await params
    const data = await apiServer(`invoices/${id}/cancel`, {
      token,
      companyId,
      method: 'POST',
    })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to cancel invoice' },
      { status: err.status || 500 }
    )
  }
}
