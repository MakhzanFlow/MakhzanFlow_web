'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import styles from './Nav.module.css'

export default function Nav() {
  const { user, logout } = useAuth()

  return (
    <nav className={styles.nav}>
      <div className="container">
        <Link href="/" className={styles.logo}>
          <Image src="/logos/stockflow-logo.png" alt="StockFlow" width={100} height={32} priority />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/#features">المميزات</Link>
          <Link href="/#how">طريقة العمل</Link>
          <Link href="/#pricing">الباقات</Link>
          <Link href="/#faq">الأسئلة</Link>
        </div>
        <div className={styles.navActions}>
          {user ? (
            <>
              <Link href="/dashboard" className="btn-outline-sm">لوحة التحكم</Link>
              <button onClick={logout} className="btn-primary-sm">خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline-sm">تسجيل الدخول</Link>
              <Link href="/register" className="btn-primary-sm">ابدأ مجاناً</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
