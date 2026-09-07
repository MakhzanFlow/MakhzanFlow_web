'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { parseApiResponse } from '@/lib/api-client'
import { getPendingJoin, setPendingJoin, clearPendingJoin } from '@/lib/pending'
import PendingApprovalCard from '@/components/PendingApprovalCard'
import Icon from '@/components/Icon'
import type { Company, JoinRequest } from '@/lib/types'
import styles from '../auth.module.css'

export default function PendingPage() {
  const { user, loading, authError, retrySession, selectCompany, logout } = useAuth()
  const router = useRouter()

  const [companyName, setCompanyName] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [rejected, setRejected] = useState(false)
  // Auto-poll runs only while a request is actually pending. Once the server
  // confirms there is nothing to watch, it stops instead of polling forever.
  const [autoPoll, setAutoPoll] = useState(true)

  // guard auth
  useEffect(() => {
    // Transient session-load failure keeps cookies — show retry UI, not /login.
    if (authError) return
    if (!loading && !user) router.push('/login')
  }, [loading, user, authError, router])

  // hydrate from local + server
  useEffect(() => {
    if (loading || !user) return
    const local = getPendingJoin()
    if (local) {
      setCompanyName(local.companyName)
      setInviteCode(local.inviteCode)
      setCreatedAt(local.createdAt)
      setRequestId(local.requestId ?? null)
      setCompanyId(local.companyId ?? null)
    }
    // fetch server pending to sync
    fetch('/api/companies/requests')
      .then((r) => parseApiResponse<JoinRequest[]>(r))
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const pending = d.data.find((x) => x.status === 'pending')
          const rej = d.data.find((x) => x.status === 'rejected')
          const appr = d.data.find((x) => x.status === 'approved')
          if (pending) {
            const name = pending.companies?.name ?? local?.companyName ?? null
            setCompanyName(name)
            setCreatedAt(pending.created_at ?? local?.createdAt ?? null)
            setCompanyId(pending.company_id ?? local?.companyId ?? null)
            setRequestId(pending.id ?? local?.requestId ?? null)
            setRejected(false)
            if (!local) {
              setPendingJoin({
                companyName: name ?? 'الشركة',
                inviteCode: '',
                createdAt: pending.created_at,
                companyId: pending.company_id,
                requestId: pending.id,
              })
            }
          } else if (rej && !appr) {
            setRejected(true)
            setError('تم رفض طلب الانضمام من قبل مسؤول الشركة. يمكنك المحاولة مجدداً برمز دعوة آخر أو التواصل مع المسؤول.')
          } else if (appr) {
            setInfo('تمت الموافقة على طلبك! جاري تحويلك للوحة التحكم...')
            // try to enter
            fetch('/api/companies')
              .then((r) => parseApiResponse<Company[]>(r))
              .then((cd) => {
                if (cd.success && Array.isArray(cd.data)) {
                  const match = cd.data.find((c) => c.id === appr.company_id) ?? cd.data[0]
                  if (match) {
                    const member = match.company_members?.[0]
                    const role = member?.role
                    const perms = member?.permissions
                      ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([g, a]) =>
                          typeof a === 'object' && a !== null
                            ? Object.entries(a as Record<string, boolean>).filter(([, v]) => v === true).map(([act]) => `${g}.${act}`)
                            : []
                        )
                      : []
                    clearPendingJoin()
                    selectCompany(match.id, role, perms)
                  } else {
                    clearPendingJoin()
                    router.push('/select-company')
                  }
                }
              })
          }
        } else if (!local) {
          // no pending locally nor on server -> check if user already has companies (maybe approved externally)
          fetch('/api/companies')
            .then((r) => parseApiResponse<Company[]>(r))
            .then((cd) => {
              if (cd.success && Array.isArray(cd.data) && cd.data.length > 0) {
                setInfo('لديك شركات متاحة بالفعل — يمكنك اختيار شركة للمتابعة.')
              } else {
                setInfo('لا يوجد طلب معلق حالياً. يمكنك العودة واختيار شركة أو إنشاء واحدة.')
              }
            })
        }
      })
      .catch(() => {})
  }, [loading, user, router, selectCompany])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    setError('')
    try {
      const [reqRes, compRes] = await Promise.all([
        fetch('/api/companies/requests').then((r) => parseApiResponse<JoinRequest[]>(r)),
        fetch('/api/companies').then((r) => parseApiResponse<Company[]>(r)),
      ])

      if (reqRes.success && Array.isArray(reqRes.data)) {
        const pending = reqRes.data.find((x) => x.status === 'pending')
        const rej = reqRes.data.find((x) => x.status === 'rejected')
        const appr = reqRes.data.find((x) => x.status === 'approved')
        if (pending) {
          setCompanyName(pending.companies?.name ?? companyName)
          setCreatedAt(pending.created_at)
          setCompanyId(pending.company_id)
          setRequestId(pending.id)
          setRejected(false)
          setAutoPoll(true)
          setInfo('لا يزال طلبك قيد المراجعة — يتم التحقق تلقائياً كل 15 ثانية.')
          setTimeout(() => setInfo(''), 3000)
          return
        }
        if (rej && !appr) {
          setRejected(true)
          setError('تم رفض الطلب.')
          return
        }
        if (appr) {
          if (compRes.success && Array.isArray(compRes.data)) {
            const match = compRes.data.find((c) => c.id === appr.company_id) ?? compRes.data[0]
            if (match) {
              const member = match.company_members?.[0]
              const role = member?.role
              const perms = member?.permissions
                ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([g, a]) =>
                    typeof a === 'object' && a !== null
                      ? Object.entries(a as Record<string, boolean>).filter(([, v]) => v === true).map(([act]) => `${g}.${act}`)
                      : []
                  )
                : []
              clearPendingJoin()
              selectCompany(match.id, role, perms)
              return
            }
          }
          setInfo('تمت الموافقة! جاري المزامنة...')
        }
      }

      if (compRes.success && Array.isArray(compRes.data) && compRes.data.length > 0) {
        // if we have companies but no pending, maybe approved and list updated
        const local = getPendingJoin()
        const target = local?.companyId ? compRes.data.find((c) => c.id === local.companyId) ?? compRes.data[0] : compRes.data[0]
        if (target && local) {
          const member = target.company_members?.[0]
          const role = member?.role
          const perms = member?.permissions
            ? Object.entries(member.permissions as Record<string, unknown>).flatMap(([g, a]) =>
                typeof a === 'object' && a !== null
                  ? Object.entries(a as Record<string, boolean>).filter(([, v]) => v === true).map(([act]) => `${g}.${act}`)
                  : []
              )
            : []
          clearPendingJoin()
          selectCompany(target.id, role, perms)
          return
        }
        const serverEmpty = reqRes.success && Array.isArray(reqRes.data) && reqRes.data.length === 0
        if (!local) {
          setInfo('لديك شركات متاحة — اختر شركة للمتابعة.')
          if (serverEmpty) setAutoPoll(false)
        } else if (serverEmpty) {
          // Stale local flag: server has no requests at all — clear and stop.
          clearPendingJoin()
          setCompanyName(null)
          setInviteCode(null)
          setCreatedAt(null)
          setRequestId(null)
          setCompanyId(null)
          setAutoPoll(false)
          setInfo('لا يوجد طلب معلق حالياً.')
        } else {
          setInfo('لا يزال قيد المراجعة.')
        }
      } else if (reqRes.success && Array.isArray(reqRes.data) && reqRes.data.length === 0) {
        // No companies and no requests anywhere — nothing to watch.
        if (getPendingJoin()) clearPendingJoin()
        setCompanyName(null)
        setInviteCode(null)
        setCreatedAt(null)
        setRequestId(null)
        setCompanyId(null)
        setAutoPoll(false)
        setInfo('لا يوجد طلب معلق حالياً.')
      } else {
        setInfo('لا يزال قيد المراجعة.')
      }
    } catch {
      setError('تعذر التحديث، حاول مرة أخرى.')
    } finally {
      setRefreshing(false)
    }
  }, [companyName, selectCompany])

  // auto poll every 15s — only while something is actually pending
  useEffect(() => {
    if (rejected || !autoPoll) return
    const id = setInterval(() => {
      handleRefresh()
    }, 15000)
    return () => clearInterval(id)
  }, [handleRefresh, rejected, autoPoll])

  const handleCancel = async () => {
    setCancelling(true)
    setError('')
    try {
      if (requestId) {
        await fetch(`/api/companies/requests/${encodeURIComponent(requestId)}`, { method: 'DELETE' })
      }
    } catch {}
    clearPendingJoin()
    setCancelling(false)
    router.push('/select-company')
  }

  if (loading) {
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

  // If no pending at all, show helpful empty
  const hasPending = !!(companyName || inviteCode || createdAt || companyId)

  return (
    <div className={`${styles.screenInner} ${styles.screenWide}`}>
      <div className={styles.card}>
        <header className={styles.companyGreet}>
          <Link href="/" className={styles.companyLogo}>
            م
          </Link>
          <div>
            <h1>حالة طلب الانضمام</h1>
            <p className={styles.sub}>تابع حالة طلبك حتى موافقة المسؤول</p>
          </div>
        </header>

        {rejected ? (
          <>
            <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
              <Icon name="alert" />
              {error || 'تم رفض طلب الانضمام.'}
            </div>
            <p className={styles.emptyCompanies} style={{ marginTop: 16 }}>
              تواصل مع صاحب الشركة للحصول على رمز دعوة جديد أو معلومات إضافية.
            </p>
            <div className={styles.actions}>
              <Link href="/select-company" className={`${styles.btn} ${styles.btnPrimary}`}>
                العودة لاختيار شركة
              </Link>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { clearPendingJoin(); setRejected(false); setError(''); router.push('/select-company') }}>
                إعادة المحاولة
              </button>
            </div>
          </>
        ) : hasPending ? (
          <>
            <PendingApprovalCard
              companyName={companyName}
              inviteCode={inviteCode}
              createdAt={createdAt}
              onRefresh={handleRefresh}
              onCancel={handleCancel}
              onBack={() => router.push('/select-company')}
              refreshing={refreshing}
              cancelling={cancelling}
            />
            {info && (
              <div className={`${styles.banner} ${styles.bannerSuccess} ${styles.bannerShow}`} style={{ marginTop: 16 }}>
                <Icon name="check" />
                {info}
              </div>
            )}
            {error && (
              <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`} style={{ marginTop: 12 }}>
                <Icon name="alert" />
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <p className={styles.emptyCompanies}>لا يوجد طلب معلق حالياً.</p>
            {info && (
              <div className={`${styles.banner} ${styles.bannerSuccess} ${styles.bannerShow}`} style={{ marginTop: 12 }}>
                <Icon name="check" />
                {info}
              </div>
            )}
            <div className={styles.actions}>
              <Link href="/select-company" className={`${styles.btn} ${styles.btnPrimary}`}>
                الذهاب لاختيار شركة
              </Link>
              <Link href="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`}>
                لوحة التحكم
              </Link>
            </div>
          </>
        )}

        <footer className={styles.foot} style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className={styles.textBtn} onClick={() => router.push('/select-company')}>
            اختيار شركة أخرى
          </button>
          <span style={{ color: 'var(--border)' }}>|</span>
          <button type="button" className={styles.textBtn} onClick={logout}>
            تسجيل الخروج
          </button>
        </footer>
      </div>
    </div>
  )
}
