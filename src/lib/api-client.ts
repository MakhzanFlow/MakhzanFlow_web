import type { ApiResponse } from './types'

export interface ApiResult<T> extends ApiResponse<T> {
  pagination?: { page: number; limit: number; total: number; pages: number }
}

export function getCompanyId(): string | null {
  if (typeof window === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )mf_company_id=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function parseApiResponse<T = unknown>(res: Response): Promise<ApiResult<T>> {
  const text = await res.text()
  let data: ApiResult<T>
  try {
    data = JSON.parse(text)
  } catch {
    return {
      success: false,
      message: `Unexpected server response (${res.status}).`,
    }
  }
  return data
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await parseApiResponse<{ accessToken: string; refreshToken: string }>(res)

      if (data.success && data.data) {
        return true
      }

      return false
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResult<T>> {
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const companyId = getCompanyId()
  if (companyId) {
    headers.set('X-Company-Id', companyId)
  }

  const res = await fetch(`/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...options,
    credentials: 'same-origin',
    headers,
  })

  if (res.status === 401 && retryCount === 0) {
    // /auth/me already handles refresh server-side — retrying here would consume the
    // rotated refresh token twice (A->B in /api/auth/me, then B->C here) and race to 401.
    const isAuthMe = endpoint === '/auth/me' || endpoint === 'auth/me'
    if (isAuthMe) {
      const data = await parseApiResponse<T>(res)
      // Let AuthContext decide: 401 genuine vs 502 transient (throw for transient)
      if (res.status === 401) {
        return { success: false, message: (data as any).message || 'Session expired. Please login again.' } as ApiResult<T>
      }
      const error = new Error(data.message || `Request failed with status ${res.status}`)
      ;(error as Error & { status?: number; data?: unknown }).status = res.status
      ;(error as Error & { status?: number; data?: unknown }).data = data
      throw error
    }
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiClient<T>(endpoint, options, 1)
    }
    return { success: false, message: 'Session expired. Please login again.' }
  }

  const data = await parseApiResponse<T>(res)

  if (res.status === 403) {
    const msg =
      data.message && !data.message.includes('403') ? data.message : 'ليس لديك صلاحية للقيام بهذا الإجراء'
    const error = new Error(msg) as Error & { status?: number; data?: unknown; isForbidden?: boolean }
    error.status = 403
    error.data = data
    error.isForbidden = true
    throw error
  }

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`)
    ;(error as Error & { status?: number; data?: unknown }).status = res.status
    ;(error as Error & { status?: number; data?: unknown }).data = data
    throw error
  }

  return data
}
