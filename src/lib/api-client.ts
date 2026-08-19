import type { ApiResponse } from './types'

export interface ApiResult<T> extends ApiResponse<T> {
  pagination?: { page: number; limit: number; total: number; pages: number }
}

const ACCESS_KEY = 'mf_access_token'
const REFRESH_KEY = 'mf_refresh_token'

export function setTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

export function clearTokens() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function isLoggedIn(): boolean {
  return !!getAccessToken()
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
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await parseApiResponse<{ accessToken: string; refreshToken: string }>(res)

      if (data.success && data.data) {
        setTokens(data.data.accessToken, data.data.refreshToken)
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
  headers.set('Content-Type', 'application/json')

  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const companyId = getCompanyId()
  if (companyId) {
    headers.set('X-Company-Id', companyId)
  }

  const res = await fetch(`/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers,
  })

  if (res.status === 401 && retryCount === 0) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiClient<T>(endpoint, options, 1)
    }
    clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return { success: false, message: 'Session expired. Please login again.' }
  }

  const data = await parseApiResponse<T>(res)

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}
