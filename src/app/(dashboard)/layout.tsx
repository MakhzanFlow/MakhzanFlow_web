'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import styles from './dashboard/dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, companyId, loading, logout } = useAuth()
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
          <Link href="/dashboard" className={styles.navItemActive}>
            <span className={styles.navIcon}>📊</span>
            لوحة التحكم
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
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
