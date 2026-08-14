'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import styles from './dashboard/dashboard.module.css'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: '📊' },
  { href: '/products', label: 'المنتجات', icon: '📦' },
  { href: '/customers', label: 'العملاء', icon: '👥' },
  { href: '/invoices', label: 'الفواتير', icon: '📄' },
  { href: '/payments', label: 'المدفوعات', icon: '💰' },
  { href: '/reports', label: 'التقارير', icon: '📈' },
]

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
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo}>StockFlow</Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={clearCompany} className={styles.switchCompany}>
            تبديل الشركة
          </button>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name.charAt(0)}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            خروج
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
