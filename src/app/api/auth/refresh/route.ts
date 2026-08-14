import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getRefreshToken, setAuthCookies } from '@/lib/cookies'

export async function POST() {
  try {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token' },
        { status: 401 }
      )
    }

    const data = await apiServer<{ success: boolean; data: { accessToken: string; refreshToken: string } }>('auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })

    if (data.success && data.data) {
      await setAuthCookies(data.data.accessToken, data.data.refreshToken)
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Refresh failed' },
      { status: err.status || 500 }
    )
  }
}
