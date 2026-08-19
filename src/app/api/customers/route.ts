import { NextResponse } from 'next/server'
import { apiServer } from '@/lib/api-server'
import { getAccessToken } from '@/lib/cookies'

export async function GET(request: Request) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const companyId = request.headers.get('x-company-id')
    if (!companyId) {
      return NextResponse.json({ success: false, message: 'Company ID required' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const order = searchParams.get('order')

    const query = new URLSearchParams()
    if (page) query.set('page', page)
    if (limit) query.set('limit', limit)
    if (search) query.set('search', search)
    if (sort) query.set('sort', sort)
    if (order) query.set('order', order)

    const data = await apiServer(`customers?${query}`, { token, companyId })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to load customers' },
      { status: err.status || 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const companyId = request.headers.get('x-company-id')
    if (!companyId) {
      return NextResponse.json({ success: false, message: 'Company ID required' }, { status: 400 })
    }

    const body = await request.json()
    const data = await apiServer('customers', {
      token,
      companyId,
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error: unknown) {
    const err = error as { status?: number; data?: unknown; message?: string }
    return NextResponse.json(
      err.data || { success: false, message: err.message || 'Failed to create customer' },
      { status: err.status || 500 }
    )
  }
}
