import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken, getRefreshToken, setAuthCookies, getUserCookie } from '@/lib/cookies'

export async function GET() {
  try {
    const token = await getAccessToken()
    const refreshToken = await getRefreshToken()

    // 1) Try current access token first
    if (token) {
      try {
        const data = await apiServer('auth/me', { token })
        return NextResponse.json(data)
      } catch (error: unknown) {
        const status = (error as { status?: number }).status
        // Only swallow 401 when we have a refresh token to try — otherwise it's a real auth failure.
        // Transient errors (502 timeout / 5xx) must bubble so the client shows retry, not /login.
        if (status !== 401 || !refreshToken) throw error
      }
    }

    // 2) Access missing or expired — try to rotate via refresh token (single place for refresh)
    if (refreshToken) {
      try {
        const refreshed = await apiServer<{ success: boolean; data: { accessToken: string; refreshToken: string } }>('auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        })
        if (refreshed.success && refreshed.data) {
          await setAuthCookies(refreshed.data.accessToken, refreshed.data.refreshToken)
          const data = await apiServer('auth/me', { token: refreshed.data.accessToken })
          return NextResponse.json(data)
        }
        // Backend returned success:false without throwing (should not happen) — treat as auth failure
        return NextResponse.json({ success: false, message: (refreshed as any).message || 'Not authenticated' }, { status: 401 })
      } catch (refreshError: unknown) {
        const status = (refreshError as { status?: number }).status
        // Transient backend failure — DO NOT clear cookies, let client show retry UI.
        // Only 401 means refresh token invalid/expired → genuine logout.
        throw refreshError
      }
    }

    // 3) No tokens at all — fallback to cached user cookie (e.g. after hard refresh before migration)
    if (!token && !refreshToken) {
      const user = await getUserCookie()
      if (user) return NextResponse.json({ success: true, data: user })
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to get user' },
      { status: err.status || 500 }
    )
  }
}
