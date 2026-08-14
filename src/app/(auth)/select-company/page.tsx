'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { parseApiResponse } from '@/lib/api-client'
import type { Company } from '@/lib/types'
import authStyles from '../auth.module.css'
import styles from './page.module.css'

type Mode = 'pick' | 'create' | 'join'

export default function SelectCompanyPage() {
  const { user, loading, selectCompany, logout } = useAuth()
  const router = useRouter()

  const [companies, setCompanies] = useState<Company[] | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [mode, setMode] = useState<Mode>('pick')

  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinLookup, setJoinLookup] = useState<string | null>(null)
  const [joinPending, setJoinPending] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (!user || companies !== null) return

    let cancelled = false
    fetch('/api/companies')
      .then((res) => parseApiResponse<Company[]>(res))
      .then((data) => {
        if (cancelled) return
        if (data.success && Array.isArray(data.data)) {
          setCompanies(data.data.filter((c) => c.id))
          setFetchError('')
        } else {
          setFetchError(data.message || 'Failed to load companies')
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError('Failed to load companies')
      })

    return () => { cancelled = true }
  }, [loading, user, router, companies])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!createName.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName.trim() }),
      })
      const data = await parseApiResponse<Company>(res)
      if (!data.success) throw new Error(data.message || 'Failed to create company')
      if (!data.data?.id) throw new Error('Missing company id')
      selectCompany(data.data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company')
      setSubmitting(false)
    }
  }

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault()
    const code = joinCode.trim()
    if (!code) return
    setSubmitting(true)
    setError('')
    setJoinLookup(null)
    try {
      const res = await fetch(`/api/companies/lookup?code=${encodeURIComponent(code)}`)
      const data = await parseApiResponse<Company>(res)
      if (!data.success) throw new Error(data.message || 'Company not found')
      setJoinLookup(data.data?.name ?? code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Company not found')
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoin = async () => {
    const code = joinCode.trim()
    if (!code) return
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/companies/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_code: code }),
      })
      const data = await parseApiResponse<{ status?: string; company_id?: string }>(res)
      if (!data.success) {
        if (data.data?.company_id) {
          selectCompany(data.data.company_id)
          return
        }
        throw new Error(data.message || 'Failed to join company')
      }
      if (data.data?.company_id) {
        selectCompany(data.data.company_id)
        return
      }
      setJoinPending(true)
      setSuccess('تم إرسال طلب الانضمام، سيتم تفعيل حسابك بعد موافقة صاحب الشركة.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join company')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || (user && companies === null && !fetchError)) {
    return (
      <div className={styles.wrapper}>
        <div className={authStyles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const hasCompanies = companies !== null && companies.length > 0

  return (
    <div className={styles.wrapper}>
      <div className={`${authStyles.card} ${styles.card}`}>
        <header className={authStyles.header}>
          <Link href="/" className={authStyles.logoLink}>
            <span className={styles.logoMark}>م</span>
          </Link>
          <h1 className={authStyles.title}>مرحباً، {user.name}</h1>
          <p className={authStyles.subtitle}>اختر شركة للمتابعة، أو أنشئ شركة جديدة</p>
        </header>

        {fetchError && (
          <div className={authStyles.error}>
            {fetchError}
            <button
              type="button"
              className={styles.retryLink}
              onClick={() => { setFetchError(''); setCompanies(null) }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {hasCompanies && mode === 'pick' && (
          <div className={styles.companyList}>
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                className={styles.companyItem}
                onClick={() => selectCompany(company.id)}
              >
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    width={40}
                    height={40}
                    className={styles.logo}
                    unoptimized
                  />
                ) : (
                  <span className={styles.companyAvatar}>{company.name.charAt(0)}</span>
                )}
                <span className={styles.companyName}>{company.name}</span>
                <span className={styles.companyArrow}>←</span>
              </button>
            ))}
          </div>
        )}

        {!hasCompanies && mode === 'pick' && (
          <p className={styles.noCompanies}>لا تملك أي شركة بعد — أنشئ شركتك الأولى أو انضم برمز دعوة.</p>
        )}

        {mode === 'pick' && (
          <div className={styles.actions}>
            <button type="button" className={authStyles.btn} onClick={() => setMode('create')}>
              إنشاء شركة جديدة
            </button>
            <button
              type="button"
              className={authStyles.btnSecondary}
              onClick={() => setMode('join')}
            >
              الانضمام برمز دعوة
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form className={authStyles.form} onSubmit={handleCreate}>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="company-name">اسم الشركة</label>
              <input
                id="company-name"
                className={authStyles.input}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="مثال: متجر النور"
                required
              />
            </div>
            {error && <div className={authStyles.error}>{error}</div>}
            <button type="submit" className={authStyles.btn} disabled={submitting}>
              {submitting ? 'جاري الإنشاء…' : 'إنشاء والمتابعة'}
            </button>
            <button type="button" className={authStyles.btnSecondary} onClick={() => { setMode('pick'); setError('') }} disabled={submitting}>
              رجوع
            </button>
          </form>
        )}

        {mode === 'join' && !joinPending && (
          <form className={authStyles.form} onSubmit={handleLookup}>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="invite-code">رمز الدعوة</label>
              <input
                id="invite-code"
                className={authStyles.input}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="أدخل رمز الدعوة"
                required
                dir="ltr"
              />
            </div>
            {joinLookup && <div className={authStyles.success}>تم العثور على الشركة: {joinLookup}</div>}
            {error && <div className={authStyles.error}>{error}</div>}
            <button
              type="button"
              className={authStyles.btn}
              disabled={submitting || !joinCode.trim()}
              onClick={handleJoin}
            >
              {submitting ? 'جاري الإرسال…' : joinLookup ? 'تأكيد الانضمام' : 'إرسال طلب الانضمام'}
            </button>
            <button type="button" className={authStyles.btnSecondary} onClick={() => { setMode('pick'); setError(''); setJoinLookup(null) }} disabled={submitting}>
              رجوع
            </button>
          </form>
        )}

        {joinPending && (
          <div className={authStyles.success}>{success}</div>
        )}

        <footer className={authStyles.footer}>
          <button type="button" className={styles.logout} onClick={logout}>
            تسجيل الخروج
          </button>
        </footer>
      </div>
    </div>
  )
}