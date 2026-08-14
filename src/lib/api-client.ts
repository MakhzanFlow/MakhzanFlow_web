import type { ApiResponse } from './types'

export async function parseApiResponse<T = unknown>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text()
  let data: ApiResponse<T>
  try {
    data = JSON.parse(text)
  } catch {
    return {
      success: false,
      message: `Unexpected server response (${res.status}). If this came from /api/* our server may not be running.`,
    }
  }
  return data
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const res = await fetch(`/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers,
  })

  const data = await parseApiResponse<T>(res)

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}
