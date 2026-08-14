const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1/'

interface ServerFetchOptions extends RequestInit {
  token?: string
  companyId?: string
}

export async function apiServer<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { token, companyId, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (companyId) {
    headers.set('X-Company-Id', companyId)
  }

  const url = `${API_BASE.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  let res: Response
  try {
    res = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    const message = err instanceof DOMException && err.name === 'TimeoutError'
      ? `MakhzanFlow API timed out after 10s (${url}). The backend is not responding.`
      : `Cannot reach MakhzanFlow API at ${url}. Is the backend running?`
    const error = new Error(message) as Error & { status: number; data: unknown }
    error.status = 502
    error.data = null
    throw error
  }

  const text = await res.text()
  let data: T
  try {
    data = JSON.parse(text)
  } catch {
    const error = new Error(
      `MakhzanFlow API returned a non-JSON response (${res.status}). Verify the backend is running and NEXT_PUBLIC_API_URL points to it (got: ${url}).`
    ) as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = text
    throw error
  }

  if (!res.ok) {
    const message = (data as { message?: string }).message || 'API request failed'
    const error = new Error(message) as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}
