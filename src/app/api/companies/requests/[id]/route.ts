import { NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/cookies'

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }
    const { id } = await context.params
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 })

    // Backend exposes no user-cancel endpoint (only owner approve/reject),
    // so there is nothing to proxy. Clear pending client-side; the row stays
    // until the owner approves/rejects it.
    return NextResponse.json({ success: true, message: 'Pending request cleared locally (no backend cancel endpoint)' })
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    if (err.status === 404) {
      return NextResponse.json({ success: true, message: 'Pending request cleared locally' })
    }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to cancel request' },
      { status: err.status || 500 }
    )
  }
}
