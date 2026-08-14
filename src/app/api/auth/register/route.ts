import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = await apiServer('auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Registration failed' },
      { status: err.status || 500 }
    )
  }
}
