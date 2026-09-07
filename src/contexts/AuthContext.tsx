'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { apiClient, parseApiResponse } from '@/lib/api-client'
import type { User } from '@/lib/types'

const COMPANY_COOKIE = 'mf_company_id'
const ROLE_KEY = 'mf_role'
const PERMS_KEY = 'mf_permissions'

function getCompanyCookie(): string | null {
  if (typeof window === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COMPANY_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCompanyCookie(id: string) {
  if (typeof window === 'undefined') return
  document.cookie = `${COMPANY_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
}

function clearCompanyCookie() {
  if (typeof window === 'undefined') return
  document.cookie = `${COMPANY_COOKIE}=; path=/; max-age=0`
}

function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ROLE_KEY)
}

function getStoredPermissions(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PERMS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function storeRole(role: string | null) {
  if (typeof window === 'undefined') return
  if (role) localStorage.setItem(ROLE_KEY, role)
  else localStorage.removeItem(ROLE_KEY)
}

function storePermissions(perms: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PERMS_KEY, JSON.stringify(perms))
}

function clearStoredCompany() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(PERMS_KEY)
}

interface AuthContextType {
  user: User | null
  loading: boolean
  authError: string | null
  retrySession: () => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<{ message?: string }>
  verifyEmail: (email: string, token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  logout: () => Promise<void>
  companyId: string | null
  selectCompany: (id: string, role?: string, permissions?: string[]) => void
  clearCompany: () => void
  role: string | null
  permissions: string[]
  hasPermission: (key: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(() => getCompanyCookie())
  const [role, setRole] = useState<string | null>(() => getStoredRole())
  const [permissions, setPermissions] = useState<string[]>(() => getStoredPermissions())
  const router = useRouter()
  const pathname = usePathname()
  // Session is verified once per provider mount — never re-fetched on plain
  // navigation (that was spamming GET /api/auth/me on every page change).
  const sessionCheckedRef = useRef(false)

  const hasPermission = useCallback((key: string) => {
    if (role === 'owner' || role === 'admin') return true
    return permissions.includes(key)
  }, [role, permissions])

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    // Single session check: /api/auth/me reads the httpOnly cookie server-side.
    // apiClient also attaches any localStorage token, so one call covers both.
    try {
      const data = await apiClient<User>('/auth/me')
      if (data.success && data.data) {
        setUser(data.data)
        setAuthError(null)
        // /auth/me returns a profile WITHOUT company scope - only adopt
        // company_id when the backend explicitly sends it, otherwise keep the
        // company picked via selectCompany (wiping it bounces owners back to
        // /select-company on every navigation).
        if (data.data.company_id !== undefined) {
          setCompanyId(data.data.company_id ?? null)
          if (data.data.company_id) setCompanyCookie(data.data.company_id)
        }
        return data.data
      }
      // apiClient returns { success: false } (no throw) when the session is
      // genuinely expired (401 + refresh failed) — safe to sign out locally.
      setUser(null)
      setAuthError(null)
      return null
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 401) {
        // Genuinely signed out — no valid session.
        setUser(null)
        setAuthError(null)
        return null
      }
      // Transient failure (backend timeout / 5xx / network blip): NEVER hit
      // /api/auth/logout here — that deletes valid httpOnly cookies and turns
      // one failed request (e.g. refresh right after a cold start) into a
      // permanent bounce back to /login. Keep cookies, surface the error so
      // the UI can offer a retry instead of redirecting.
      setAuthError(err instanceof Error ? err.message : 'Failed to load session')
      return null
    }
  }, [])

  const isPublicPath = (path: string | null) =>
    path === '/' ||
    path === '/login' ||
    path === '/register' ||
    path === '/privacy' ||
    path?.startsWith('/verify-email') ||
    path?.startsWith('/delete-account')

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // Public pages never need a session check — skip to avoid useless
    // /api/auth/me calls (and the apiClient 401 → /login reload loop).
    // NOTE: never null the user here — a logged-in visitor on `/` keeps
    // their session when navigating back into the app.
    if (isPublicPath(pathname)) {
      setLoading(false)
      return
    }

    // Session already known (login/register/verify set it, or a previous
    // check resolved) — navigating between pages must not re-hit /auth/me.
    if (user) {
      setLoading(false)
      return
    }
    if (sessionCheckedRef.current) {
      setLoading(false)
      return
    }
    sessionCheckedRef.current = true
    /* eslint-enable react-hooks/set-state-in-effect */

    fetchCurrentUser().finally(() => setLoading(false))
  }, [pathname, fetchCurrentUser, user])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await parseApiResponse<{ accessToken: string; refreshToken: string; user: User }>(res)
    if (!data.success) throw new Error(data.message || 'Login failed')
    if (data.data) {
      setUser(data.data.user)
      const cid = data.data.user.company_id ?? null
      setCompanyId(cid)
      if (cid) setCompanyCookie(cid)
      setAuthError(null)
    }
    router.push(data.data?.user?.company_id ? '/dashboard' : '/select-company')
  }, [router])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await parseApiResponse<{ accessToken?: string; refreshToken?: string; user?: User }>(res)
    if (!data.success) throw new Error(data.message || 'Registration failed')
    // If backend auto-verifies and returns tokens, skip verify-email page
    if (data.data?.accessToken && data.data?.user) {
      setUser(data.data.user)
      const cid = data.data.user.company_id ?? null
      setCompanyId(cid)
      if (cid) setCompanyCookie(cid)
      setAuthError(null)
      router.push(data.data.user.company_id ? '/dashboard' : '/select-company')
      return { message: data.message }
    }
    return { message: data.message }
  }, [router])

  const verifyEmail = useCallback(async (email: string, token: string) => {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
    })
    const data = await parseApiResponse<{ accessToken: string; refreshToken: string; user: User }>(res)
    if (!data.success) throw new Error(data.message || 'Verification failed')
    if (data.data) {
      setUser(data.data.user)
      const cid = data.data.user.company_id ?? null
      setCompanyId(cid)
      if (cid) setCompanyCookie(cid)
      setAuthError(null)
    }
    router.push(data.data?.user?.company_id ? '/dashboard' : '/select-company')
  }, [router])

  const resendVerification = useCallback(async (email: string) => {
    const res = await fetch('/api/auth/verify-email/resend', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await parseApiResponse(res)
    if (!data.success) throw new Error(data.message || 'Failed to resend')
  }, [])

  const retrySession = useCallback(() => {
    sessionCheckedRef.current = false
    setAuthError(null)
    setLoading(true)
    fetchCurrentUser().finally(() => setLoading(false))
  }, [fetchCurrentUser])

  const selectCompany = useCallback((id: string, companyRole?: string, companyPermissions?: string[]) => {
    setCompanyId(id)
    setRole(companyRole ?? null)
    setPermissions(companyPermissions ?? [])
    setCompanyCookie(id)
    storeRole(companyRole ?? null)
    storePermissions(companyPermissions ?? [])
    setAuthError(null)
    try { localStorage.removeItem('mf_pending_join') } catch {}
    router.push('/dashboard')
  }, [router])

  const clearCompany = useCallback(() => {
    setCompanyId(null)
    setRole(null)
    setPermissions([])
    clearCompanyCookie()
    clearStoredCompany()
    router.push('/select-company')
  }, [router])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
    setUser(null)
    setCompanyId(null)
    setRole(null)
    setPermissions([])
    setAuthError(null)
    clearCompanyCookie()
    clearStoredCompany()
    try { localStorage.removeItem('mf_pending_join') } catch {}
    router.push('/login')
  }, [router])

  const contextValue = { user, loading, authError, retrySession, login, register, verifyEmail, resendVerification, logout, companyId, selectCompany, clearCompany, role, permissions, hasPermission }

  return (
    <AuthContext.Provider value={contextValue}>
      {loading && !isPublicPath(pathname) ? null : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
