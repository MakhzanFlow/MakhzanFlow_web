'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../auth.module.css'

export default function VerifyEmailPage() {
  const { verifyEmail, resendVerification } = useAuth()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)
  const [resendPending, setResendPending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      await verifyEmail(email, token)
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
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logos/stockflow-logo.png" alt="StockFlow" width={100} height={32} priority />
        </Link>
        <h1 className={styles.title}>تحقق من بريدك</h1>
        <p className={styles.subtitle}>
          أدخل رمز التكون المكون من 6 أرقام المرسل إلى بريدك الإلكتروني
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>البريد الإلكتروني</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="token" className={styles.label}>رمز التحقق</label>
          <input
            id="token"
            type="text"
            className={styles.input}
            placeholder="482901"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            maxLength={6}
            dir="ltr"
            style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '20px' }}
          />
        </div>

        <button type="submit" className={styles.btn} disabled={pending}>
          {pending ? 'جاري التحقق...' : 'تحقق'}
        </button>

        <button type="button" className={styles.btnSecondary} onClick={handleResend} disabled={resendPending}>
          {resendPending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
        </button>
      </form>

      <p className={styles.footer}>
        <Link href="/login" className={styles.link}>العودة لتسجيل الدخول</Link>
      </p>
    </div>
  )
}
