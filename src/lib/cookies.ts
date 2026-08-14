import { cookies } from 'next/headers'

const ACCESS_TOKEN_KEY = 'mf_access_token'
const REFRESH_TOKEN_KEY = 'mf_refresh_token'
const USER_KEY = 'mf_user'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function setAuthCookies(accessToken: string, refreshToken: string, user?: { id: string; name: string; email: string }) {
  const cookieStore = await cookies()

  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 15, // 15 minutes
  })

  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  if (user) {
    cookieStore.set(USER_KEY, JSON.stringify(user), {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value
}

export async function getUserCookie(): Promise<{ id: string; name: string; email: string } | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(USER_KEY)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_KEY)
  cookieStore.delete(REFRESH_TOKEN_KEY)
  cookieStore.delete(USER_KEY)
}
