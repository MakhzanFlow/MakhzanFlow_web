'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, parseApiResponse, setTokens, getRefreshToken, clearTokens } from '@/lib/api-client'
import type { User } from '@/lib/types'

const COMPANY_COOKIE = 'mf_company_id'

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

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<{ message?: string }>
  verifyEmail: (email: string, token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  logout: () => Promise<void>
  companyId: string | null
  selectCompany: (id: string) => void
  clearCompany: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(() => getCompanyCookie())
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('mf_access_token')
    if (!token) {
      setLoading(false)
      return
    }

    apiClient<User>('/auth/me')
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data)
        } else {
          clearTokens()
        }
      })
      .catch(() => {
        clearTokens()
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await parseApiResponse<{ accessToken: string; refreshToken: string; user: User }>(res)
    if (!data.success) throw new Error(data.message || 'Login failed')
    if (data.data) {
      setTokens(data.data.accessToken, data.data.refreshToken)
      setUser(data.data.user)
    }
    router.push('/select-company')
  }, [router])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await parseApiResponse(res)
    if (!data.success) throw new Error(data.message || 'Registration failed')
    return { message: data.message }
  }, [])

  const verifyEmail = useCallback(async (email: string, token: string) => {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
    })
    const data = await parseApiResponse<{ accessToken: string; refreshToken: string; user: User }>(res)
    if (!data.success) throw new Error(data.message || 'Verification failed')
    if (data.data) {
      setTokens(data.data.accessToken, data.data.refreshToken)
      setUser(data.data.user)
    }
    router.push('/select-company')
  }, [router])

  const resendVerification = useCallback(async (email: string) => {
    const res = await fetch('/api/auth/verify-email/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await parseApiResponse(res)
    if (!data.success) throw new Error(data.message || 'Failed to resend')
  }, [])

  const selectCompany = useCallback((id: string) => {
    setCompanyId(id)
    setCompanyCookie(id)
    router.push('/dashboard')
  }, [router])

  const clearCompany = useCallback(() => {
    setCompanyId(null)
    clearCompanyCookie()
    router.push('/select-company')
  }, [router])

  const logout = useCallback(async () => {
    const refresh = getRefreshToken()
    if (refresh) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      }).catch(() => {})
    }
    clearTokens()
    setUser(null)
    setCompanyId(null)
    clearCompanyCookie()
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, resendVerification, logout, companyId, selectCompany, clearCompany }}>
      {children}
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
