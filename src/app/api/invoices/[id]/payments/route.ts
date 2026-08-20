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
    const body = await request.json()
    const data = await apiServer(`invoices/${id}/payments`, {
      token,
      companyId,
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to add payment' },
      { status: err.status || 500 }
    )
  }
}
