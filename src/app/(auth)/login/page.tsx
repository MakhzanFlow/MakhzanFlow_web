'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../auth.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setPending(false)
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
          <h1>مرحباً بعودتك</h1>
          <p className={styles.sub}>
            ليس لديك حساب؟ <Link href="/register">سجّل الآن</Link>
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={`${styles.banner} ${styles.bannerError} ${styles.bannerShow}`}>
              <Icon name="alert" />
              {error}
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
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              dir="ltr"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">كلمة المرور</label>
            <div className={styles.inputWrap}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.passwordInput}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                dir="ltr"
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} />
              </button>
            </div>
          </div>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${pending ? styles.isPending : ''}`} disabled={pending}>
            <span className={styles.spinner} />
            {pending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>

      <p className={styles.foot}>
        بالمتابعة، أنت توافق على <Link href="/privacy">سياسة الخصوصية</Link>
      </p>
    </div>
  )
}
