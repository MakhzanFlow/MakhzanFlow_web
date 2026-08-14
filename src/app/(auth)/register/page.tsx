'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setPending(true)
    try {
      const result = await register(name, email, password)
      setSuccess(result.message || 'تم التسجيل بنجاح. تحقق من بريدك الإلكتروني.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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
        <h1 className={styles.title}>إنشاء حساب جديد</h1>
        <p className={styles.subtitle}>
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className={styles.link}>سجّل الدخول</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>الاسم</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="محمد أحمد"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            minLength={8}
            dir="ltr"
          />
        </div>

        <button type="submit" className={styles.btn} disabled={pending}>
          {pending ? 'جاري الإنشاء...' : 'إنشاء حساب'}
        </button>
      </form>

      <p className={styles.footer}>
        بالمتابعة، أنت توافق على{' '}
        <Link href="/privacy" className={styles.link}>سياسة الخصوصية</Link>
      </p>
    </div>
  )
}
