'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../auth.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logos/stockflow-logo.png" alt="StockFlow" width={100} height={32} priority />
        </Link>
        <h1 className={styles.title}>مرحبا بعودتك</h1>
        <p className={styles.subtitle}>
         ليس لديك حساب؟{' '}
          <Link href="/register" className={styles.link}>سجّل الآن</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

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
          <label htmlFor="password" className={styles.label}>كلمة المرور</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <button type="submit" className={styles.btn} disabled={pending}>
          {pending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      <p className={styles.footer}>
        بالمتابعة، أنت توافق على{' '}
        <Link href="/privacy" className={styles.link}>سياسة الخصوصية</Link>
      </p>
    </div>
  )
}
