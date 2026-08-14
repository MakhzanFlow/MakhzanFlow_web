import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken, getUserCookie } from '@/lib/cookies'

export async function GET() {
  try {
    const token = await getAccessToken()

    if (!token) {
      const user = await getUserCookie()
      if (user) {
        return NextResponse.json({ success: true, data: user })
      }
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const data = await apiServer('auth/me', {
      token,
    })

    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to get user' },
      { status: err.status || 500 }
    )
  }
}
