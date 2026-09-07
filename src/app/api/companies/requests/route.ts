import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken } from '@/lib/cookies'

export async function GET() {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    // Backend exposes GET companies/my-join-requests for the current user's
    // requests (see company.routes.ts). Single call — no fallback probing.
    const data = await apiServer('companies/my-join-requests', { token })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    // If listing not supported (404), swallow as empty instead of error to keep UX smooth
    if (err.status === 404) {
      return NextResponse.json({ success: true, data: [] })
    }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to load join requests' },
      { status: err.status || 500 }
    )
  }
}
