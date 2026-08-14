import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { setAuthCookies } from '@/lib/cookies'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = await apiServer<{ success: boolean; data: { accessToken: string; refreshToken: string; user: { id: string; name: string; email: string } } }>('auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    if (data.success && data.data) {
      await setAuthCookies(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.user
      )
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Verification failed' },
      { status: err.status || 500 }
    )
  }
}
