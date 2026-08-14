import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getRefreshToken, clearAuthCookies } from '@/lib/cookies'

export async function POST() {
  try {
    const refreshToken = await getRefreshToken()

    if (refreshToken) {
      await apiServer('auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {})
    }

    await clearAuthCookies()

    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch {
    await clearAuthCookies()
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  }
}
