'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { Company } from '@/lib/types'
import Icon from '@/components/Icon'
import styles from './dashboard/dashboard.module.css'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
  { href: '/products', label: 'المنتجات', icon: 'products' },
  { href: '/customers', label: 'العملاء', icon: 'customers' },
  { href: '/invoices', label: 'الفواتير', icon: 'invoices' },
  { href: '/payments', label: 'المدفوعات', icon: 'payments' },
  { href: '/reports', label: 'التقارير', icon: 'reports' },
] as const

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, companyId, loading, authError, retrySession, logout, clearCompany } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // A transient session-load failure (backend timeout/5xx) keeps cookies
    // intact — don't bounce to /login, show the retry UI below instead.
    if (authError) return
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (!loading && user && !companyId) {
      router.push('/select-company')
    }
  }, [user, companyId, loading, authError, router])

  useEffect(() => {
    if (!companyId || !user) return

    let cancelled = false
    apiClient<Company[]>('/companies')
      .then((response) => {
        if (!cancelled && response.success) {
          setCompany(response.data?.find((item) => item.id === companyId) ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) setCompany(null)
      })

    return () => { cancelled = true }
  }, [companyId, user])

  const companyName = company?.id === companyId ? company.name : 'MakhzanFlow'

  if (loading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  // Session check failed for a transient reason (cookies untouched) — offer a
  // retry instead of redirecting to /login and looking signed out.
  if (!user && authError) {
    return (
      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <Icon name="alert" size={30} />
            </span>
            <h3>تعذر تحميل الجلسة</h3>
            <p>حدثت مشكلة مؤقتة في الاتصال بالخادم، لكن جلستك ما زالت محفوظة.</p>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={retrySession}>
              إعادة المحاولة
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <header className={styles.mnav}>
        <span className={styles.brandMark}>
          <Icon name="box" size={20} />
        </span>
        <span className={styles.brandName}>{companyName}</span>
        <nav className={styles.mnavScroll}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="box" size={22} />
          </span>
          <span className={styles.brandName}>
            {companyName}<small>نظام إدارة المخازن</small>
          </span>
        </div>

        <nav className={styles.sideNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <button onClick={clearCompany} className={styles.companySwitch}>
            <Icon name="switch" size={20} />
            <span className={styles.switchLabel}>تبديل الشركة</span>
            <Icon name="chevDown" size={16} className={styles.chev} />
          </button>
          <div className={styles.userRow}>
            <span className={styles.avatar}>{user.name.charAt(0)}</span>
            <span className={styles.userCopy}>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </span>
            <button
              onClick={logout}
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              aria-label="خروج"
              title="خروج"
            >
              <Icon name="logout" size={19} />
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  )
}
