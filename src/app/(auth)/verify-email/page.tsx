'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Icon from '@/components/Icon'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../auth.module.css'

export default function VerifyEmailPage() {
  const { verifyEmail, resendVerification } = useAuth()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''
  const email = initialEmail
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)
  const [resendPending, setResendPending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      await verifyEmail(email, otp)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setPending(false)
    }
  }

  async function handleResend() {
    if (!email) {
      setError('أدخل بريدك الإلكتروني أولاً')
      return
    }
    setError('')
    setSuccess('')
    setResendPending(true)
    try {
      await resendVerification(email)
      setSuccess('تم إرسال رمز التحقق مرة أخرى')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend')
    } finally {
      setResendPending(false)
    }
  }

  return (
    <div className={styles.screenInner}>
      <Link href="/" className={styles.brandRow}>
        <span className={styles.brandMark}>
          <Icon name="box" />
        </span>
        <span className={styles.brandWord}>StockFlow</span>
      </Link>

      <div className={styles.card}>
        <header className={styles.cardHead}>
          <h1>تحقق من بريدك</h1>
          <p className={styles.sub}>
            أدخل رمز التحقق المكوّن من 6 أرقام المرسل إلى بريدك الإلكتروني
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
              <Icon name="alert" />
              {error}
            </div>
          )}
          {success && (
            <div className={`${styles.banner} ${styles.bannerSuccess} ${styles.bannerShow}`}>
              <Icon name="check" />
              {success}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              value={email}
              readOnly
              autoComplete="email"
              dir="ltr"
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="token">رمز التحقق</label>
            <input
              id="token"
              type="text"
              inputMode="numeric"
              className={`${styles.input} ${styles.inputOtp}`}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              autoComplete="one-time-code"
              dir="ltr"
            />
          </div>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${pending ? styles.isPending : ''}`} disabled={pending}>
            <span className={styles.spinner} />
            {pending ? 'جاري التحقق...' : 'تحقق'}
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary} ${resendPending ? styles.isPending : ''}`}
            onClick={handleResend}
            disabled={resendPending}
          >
            <span className={styles.spinner} />
            {resendPending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        </form>

        <p className={styles.foot}>
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </div>
  )
}
