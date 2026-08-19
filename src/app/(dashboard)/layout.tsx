'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
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
  const { user, companyId, loading, logout, clearCompany } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (!loading && user && !companyId) {
      router.push('/select-company')
    }
  }, [user, companyId, loading, router])

  if (loading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.spinner} />
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
        <span className={styles.brandName}>StockFlow</span>
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
            StockFlow<small>نظام إدارة المخازن</small>
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
