'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { parseApiResponse } from '@/lib/api-client'
import { getPendingJoin, setPendingJoin, clearPendingJoin } from '@/lib/pending'
import Icon from '@/components/Icon'
import PendingApprovalCard from '@/components/PendingApprovalCard'
import type { Company, JoinRequest } from '@/lib/types'
import styles from '../auth.module.css'

type Mode = 'pick' | 'create' | 'join'

export default function SelectCompanyPage() {
  const { user, loading, authError, retrySession, selectCompany, logout } = useAuth()
  const router = useRouter()

  const [companies, setCompanies] = useState<Company[] | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [mode, setMode] = useState<Mode>('pick')

  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinLookup, setJoinLookup] = useState<string | null>(null)
  const [joinPending, setJoinPending] = useState(false)
  const [pendingName, setPendingName] = useState<string | null>(null)
  const [pendingCode, setPendingCode] = useState<string | null>(null)
  const [pendingAt, setPendingAt] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [polling, setPolling] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Transient session-load failure keeps cookies — show retry UI, not /login.
    if (authError) return
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
  }, [loading, user, router, companies, authError])

  // Restore pending join from localStorage on mount + hydrate from server pending list
  useEffect(() => {
    if (loading || !user) return
    const local = getPendingJoin()
    if (local) {
      setJoinPending(true)
      setPendingName(local.companyName)
      setPendingCode(local.inviteCode)
      setPendingAt(local.createdAt)
      setMode('join')
    }
    // Also fetch server pending requests to keep truth in sync
    fetch('/api/companies/requests')
      .then((r) => parseApiResponse<JoinRequest[]>(r))
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const pending = d.data.find((r) => r.status === 'pending') ?? d.data[0]
          if (pending?.status === 'pending') {
            const name = pending.companies?.name ?? local?.companyName ?? null
            setJoinPending(true)
            setPendingName(name)
            setPendingCode(local?.inviteCode ?? null)
            setPendingAt(pending.created_at ?? local?.createdAt ?? new Date().toISOString())
            if (!local) {
              setPendingJoin({
                companyName: name ?? pending.companies?.name ?? 'الشركة',
                inviteCode: '',
                createdAt: pending.created_at,
                companyId: pending.company_id,
                requestId: pending.id,
              })
            }
          } else if (pending?.status === 'rejected') {
            setError('تم رفض طلب الانضمام السابق — يمكنك المحاولة برمز جديد.')
          } else if (pending?.status === 'approved') {
            // approved but not yet in companies list — refresh companies
            setCompanies(null)
          }
        } else if (local && d.success && d.data && d.data.length === 0) {
          // Server has no pending but local says pending — keep local until we confirm via companies poll
        }
      })
      .catch(() => {})
  }, [loading, user])

  // Polling: every 15s check if company now appears (approved) or request rejected
  useEffect(() => {
    if (!joinPending || !user) return
    let stopped = false
    const tick = async () => {
      try {
        const [companiesRes, reqRes] = await Promise.all([
          fetch('/api/companies').then((r) => parseApiResponse<Company[]>(r)),
          fetch('/api/companies/requests').then((r) => parseApiResponse<JoinRequest[]>(r)),
        ])
        if (stopped) return
        // If server says rejected
        if (reqRes.success && Array.isArray(reqRes.data)) {
          const pending = reqRes.data.find((r) => r.status === 'pending')
          const rejected = reqRes.data.find((r) => r.status === 'rejected')
          const approved = reqRes.data.find((r) => r.status === 'approved')
          if (!pending && rejected && !approved) {
            setError('تم رفض طلب الانضمام — تواصل مع مسؤول الشركة أو جرب رمزاً آخر.')
            setJoinPending(false)
            clearPendingJoin()
            return
          }
          if (approved && companiesRes.success && Array.isArray(companiesRes.data)) {
            const match = companiesRes.data.find((c) => c.id === approved.company_id)
            if (match) {
              const member = match.company_members?.[0]
              const memberRole = member?.role
              const memberPerms = member?.permissions
                ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([group, actions]) =>
                    typeof actions === 'object' && actions !== null
                      ? Object.entries(actions as Record<string, boolean>).filter(([, v]) => v === true).map(([action]) => `${group}.${action}`)
                      : []
                  )
                : []
              clearPendingJoin()
              selectCompany(match.id, memberRole, memberPerms)
              return
            }
          }
        }
        // Server knows no requests at all but we think we're pending locally
        // (stale mf_pending_join flag) — clear it and stop polling instead of
        // hitting the API every 15s forever.
        if (reqRes.success && Array.isArray(reqRes.data) && reqRes.data.length === 0) {
          clearPendingJoin()
          setJoinPending(false)
          setPendingName(null)
          setPendingCode(null)
          setPendingAt(null)
          return
        }
        // Fallback: if pending locally but companies list now has something new
        if (companiesRes.success && Array.isArray(companiesRes.data) && companiesRes.data.length > 0) {
          const local = getPendingJoin()
          if (local?.companyId) {
            const match = companiesRes.data.find((c) => c.id === local.companyId)
            if (match) {
              const member = match.company_members?.[0]
              const memberRole = member?.role
              const memberPerms = member?.permissions
                ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([group, actions]) =>
                    typeof actions === 'object' && actions !== null
                      ? Object.entries(actions as Record<string, boolean>).filter(([, v]) => v === true).map(([action]) => `${group}.${action}`)
                      : []
                  )
                : []
              clearPendingJoin()
              selectCompany(match.id, memberRole, memberPerms)
              return
            }
          }
          // If any companies appear and we were pending with no prior companies, treat first as approval
          if (companies !== null && companies.length === 0 && companiesRes.data.length > 0) {
            const first = companiesRes.data[0]
            const member = first.company_members?.[0]
            const memberRole = member?.role
            const memberPerms = member?.permissions
              ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([group, actions]) =>
                  typeof actions === 'object' && actions !== null
                    ? Object.entries(actions as Record<string, boolean>).filter(([, v]) => v === true).map(([action]) => `${group}.${action}`)
                    : []
                )
              : []
            clearPendingJoin()
            selectCompany(first.id, memberRole, memberPerms)
          }
        }
      } catch {}
    }
    const id = setInterval(tick, 15000)
    return () => {
      stopped = true
      clearInterval(id)
    }
  }, [joinPending, user, companies, selectCompany])

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
      selectCompany(data.data.id, 'owner', [])
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

  const refreshCompanies = async () => {
    setPolling(true)
    try {
      const res = await fetch('/api/companies')
      const data = await parseApiResponse<Company[]>(res)
      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data.filter((c) => c.id)
        setCompanies(filtered)
        // If any company now present, consider approved (backend may have upgraded pending)
        if (filtered.length > 0) {
          const local = getPendingJoin()
          const target = local?.companyId ? filtered.find((c) => c.id === local.companyId) ?? filtered[0] : filtered[0]
          const member = target.company_members?.[0]
          const memberRole = member?.role
          const memberPerms = member?.permissions
            ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([group, actions]) =>
                typeof actions === 'object' && actions !== null
                  ? Object.entries(actions as Record<string, boolean>).filter(([, v]) => v === true).map(([action]) => `${group}.${action}`)
                  : []
              )
            : []
          // Only auto-enter if we have a pending and a matching company
          if (joinPending && target) {
            clearPendingJoin()
            selectCompany(target.id, memberRole, memberPerms)
            return
          }
        }
      }
      const reqRes = await fetch('/api/companies/requests').then((r) => parseApiResponse<JoinRequest[]>(r))
      if (reqRes.success && Array.isArray(reqRes.data)) {
        const hasPending = reqRes.data.some((r) => r.status === 'pending')
        const rejected = reqRes.data.find((r) => r.status === 'rejected')
        const approved = reqRes.data.find((r) => r.status === 'approved')
        if (!hasPending && rejected && !approved) {
          setError('تم رفض طلب الانضمام — تواصل مع مسؤول الشركة.')
          setJoinPending(false)
          clearPendingJoin()
          return
        }
        if (!hasPending && reqRes.data.length === 0) {
          // no pending on server, maybe already approved and companies fetched above handles
        }
      }
      setFetchError('')
    } catch {
      setError('تعذر تحديث الحالة، حاول مرة أخرى.')
    } finally {
      setPolling(false)
    }
  }

  const handleCancelPending = async () => {
    const local = getPendingJoin()
    setCancelling(true)
    setError('')
    try {
      if (local?.requestId) {
        await fetch(`/api/companies/requests/${encodeURIComponent(local.requestId)}`, { method: 'DELETE' })
      } else {
        // fallback: best-effort clear local
        await fetch('/api/companies/requests', { method: 'GET' })
      }
    } catch {}
    finally {
      clearPendingJoin()
      setJoinPending(false)
      setPendingName(null)
      setPendingCode(null)
      setPendingAt(null)
      setCancelling(false)
      setSuccess('')
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
      const data = await parseApiResponse<{ status?: string; company_id?: string; id?: string; company?: { id: string; name: string } }>(res)
      if (!data.success) {
        const msg = data.message || ''
        // If backend says already pending / awaiting approval, treat as pending instead of error
        if (/pending|await|مراجعة|موافقة/i.test(msg) || data.data?.status === 'pending') {
          const name = joinLookup ?? code
          setPendingJoin({ companyName: name, inviteCode: code, createdAt: new Date().toISOString(), companyId: data.data?.company_id ?? null, requestId: data.data?.id ?? null })
          setPendingName(name)
          setPendingCode(code)
          setPendingAt(new Date().toISOString())
          setJoinPending(true)
          setSuccess('تم إرسال طلب الانضمام، سيتم تفعيل حسابك بعد موافقة صاحب الشركة.')
          router.push('/pending')
          return
        }
        throw new Error(data.message || 'Failed to join company')
      }
      // SUCCESS: regardless of company_id, DO NOT auto-enter dashboard.
      // Requirement: awaiting admin approval — never go direct to dashboard on join.
      // Treat every successful join as pending until server lists the company as member.
      const companyName = joinLookup ?? data.data?.company?.name ?? code
      const companyId = data.data?.company_id ?? data.data?.company?.id ?? null
      const requestId = data.data?.id ?? null
      const apiStatus = (data.data?.status ?? '').toLowerCase()
      // If backend explicitly says active/approved and we already have company membership, still force pending UX
      // to guarantee approval gate. Only owner creation flows use selectCompany.
      setPendingJoin({ companyName, inviteCode: code, createdAt: new Date().toISOString(), companyId, requestId })
      setPendingName(companyName)
      setPendingCode(code)
      setPendingAt(new Date().toISOString())
      setJoinPending(true)
      setSuccess('تم إرسال طلب الانضمام، سيتم تفعيل حسابك بعد موافقة صاحب الشركة.')
      // If backend returned 201 with immediate membership (legacy auto-approve), we still wait; polling will pick it up.
      if (apiStatus === 'approved' || apiStatus === 'active') {
        // try immediate refresh; if company now listed, polling will transition
        fetch('/api/companies').then(async (r) => {
          const d = await parseApiResponse<Company[]>(r)
          if (d.success && Array.isArray(d.data) && d.data.some((c) => c.id === companyId)) {
            // keep pending — user sees pending page until they click refresh/interval picks up
          }
        })
      }
      router.push('/pending')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join company')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || (user && companies === null && !fetchError)) {
    return (
      <div className={`${styles.screenInner} ${styles.screenWide}`}>
        <div className={`${styles.card} ${styles.loadingCard}`}>
          <div className={styles.screenSpinner} />
        </div>
      </div>
    )
  }

  if (!user) {
    if (authError) {
      return (
        <div className={`${styles.screenInner} ${styles.screenWide}`}>
          <div className={styles.card}>
            <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
              <Icon name="alert" />
              تعذر تحميل الجلسة بسبب مشكلة مؤقتة — جلستك ما زالت محفوظة.
            </div>
            <div className={styles.actions}>
              <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={retrySession}>
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const hasCompanies = companies !== null && companies.length > 0

  return (
    <div className={`${styles.screenInner} ${styles.screenWide}`}>
      <div className={styles.card}>
        <header className={styles.companyGreet}>
          <Link href="/" className={styles.companyLogo}>م</Link>
          <div>
            <h1>مرحباً، {user.name}</h1>
            <p className={styles.sub}>اختر شركة للمتابعة، أو أنشئ شركة جديدة</p>
          </div>
        </header>

        {fetchError && (
          <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
            <Icon name="alert" />
            <span>
              {fetchError}
              <button
                type="button"
                className={styles.textBtn}
                onClick={() => { setFetchError(''); setCompanies(null) }}
              >
                إعادة المحاولة
              </button>
            </span>
          </div>
        )}

        {hasCompanies && mode === 'pick' && (
          <div className={styles.companyList}>
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                className={styles.companyRow}
                onClick={() => {
                  const member = company.company_members?.[0]
                  const memberRole = member?.role
                  const memberPerms = member?.permissions
                    ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([group, actions]) =>
                        typeof actions === 'object' && actions !== null
                          ? Object.entries(actions as Record<string, boolean>).filter(([, v]) => v === true).map(([action]) => `${group}.${action}`)
                          : []
                      )
                    : []
                  selectCompany(company.id, memberRole, memberPerms)
                }}
              >
                {company.logo_url ? (
                  <span className={styles.companyAvatar}>
                    <Image
                      src={company.logo_url}
                      alt={company.name}
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </span>
                ) : (
                  <span
                    className={styles.companyAvatar}
                    style={{ backgroundColor: `hsl(${(company.name.charCodeAt(0) * 137) % 360} 32% 32%)` }}
                  >
                    {company.name.charAt(0)}
                  </span>
                )}
                <span className={styles.companyName}>{company.name}</span>
                <Icon name="chevLeft" />
              </button>
            ))}
          </div>
        )}

        {!hasCompanies && mode === 'pick' && (
          <p className={styles.emptyCompanies}>
            لا تملك أي شركة بعد — أنشئ شركتك الأولى أو انضم برمز دعوة.
          </p>
        )}

        {mode === 'pick' && (
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setMode('create')}
            >
              إنشاء شركة جديدة
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setMode('join')}
            >
              الانضمام برمز دعوة
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form className={`${styles.form} ${styles.formMarginTop}`} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label htmlFor="company-name">اسم الشركة</label>
              <input
                id="company-name"
                type="text"
                className={styles.input}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="مثال: متجر النور"
                required
              />
            </div>
            {error && (
              <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
                <Icon name="alert" />
                {error}
              </div>
            )}
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${submitting ? styles.isPending : ''}`} disabled={submitting}>
              <span className={styles.spinner} />
              {submitting ? 'جاري الإنشاء...' : 'إنشاء والمتابعة'}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => { setMode('pick'); setError('') }}
              disabled={submitting}
            >
              رجوع
            </button>
          </form>
        )}

        {mode === 'join' && !joinPending && (
          <form className={`${styles.form} ${styles.formMarginTop}`} onSubmit={handleLookup}>
            <div className={styles.field}>
              <label htmlFor="invite-code">رمز الدعوة</label>
              <input
                id="invite-code"
                type="text"
                className={`${styles.input} ${styles.inputMono}`}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="أدخل رمز الدعوة"
                required
                dir="ltr"
              />
            </div>
            {joinLookup && (
              <div className={`${styles.banner} ${styles.bannerSuccess} ${styles.bannerShow}`}>
                <Icon name="check" />
                تم العثور على الشركة: {joinLookup}
              </div>
            )}
            {error && (
              <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
                <Icon name="alert" />
                {error}
              </div>
            )}
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary} ${submitting ? styles.isPending : ''}`}
              disabled={submitting || !joinCode.trim()}
              onClick={handleJoin}
            >
              <span className={styles.spinner} />
              {submitting ? 'جاري الإرسال...' : joinLookup ? 'تأكيد الانضمام' : 'إرسال طلب الانضمام'}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => { setMode('pick'); setError(''); setJoinLookup(null) }}
              disabled={submitting}
            >
              رجوع
            </button>
          </form>
        )}

        {joinPending && (
          <div className={styles.formMarginTop}>
            <PendingApprovalCard
              companyName={pendingName ?? joinLookup ?? success}
              inviteCode={pendingCode ?? joinCode}
              createdAt={pendingAt}
              onRefresh={refreshCompanies}
              onCancel={handleCancelPending}
              onBack={() => {
                clearPendingJoin()
                setJoinPending(false)
                setPendingName(null)
                setPendingCode(null)
                setPendingAt(null)
                setMode('pick')
                setError('')
              }}
              refreshing={polling}
              cancelling={cancelling}
            />
            <div className={`${styles.banner} ${styles.bannerSuccess} ${styles.bannerShow}`} style={{ marginTop: 16 }}>
              <Icon name="check" />
              {success || 'تم إرسال طلب الانضمام، سيتم تفعيل حسابك بعد موافقة صاحب الشركة.'}
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Link href="/pending" className={styles.textBtn} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                فتح صفحة حالة الطلب الكاملة →
              </Link>
            </div>
          </div>
        )}

        {error && joinPending && (
          <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow} ${styles.formMarginTop}`}>
            <Icon name="alert" />
            {error}
          </div>
        )}

        <footer className={styles.foot}>
          <button type="button" className={styles.textBtn} onClick={logout}>
            تسجيل الخروج
          </button>
        </footer>
      </div>
    </div>
  )
}