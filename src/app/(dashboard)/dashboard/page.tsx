'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { parseApiResponse } from '@/lib/api-client'
import { SalesChart, type SalesPoint } from './sales-chart'
import styles from './dashboard.module.css'

interface Stats {
  productsCount: number
  customersCount: number
  totalDebt: number
  todaySales: number
  monthlyPayments: number
  weeklySales: SalesPoint[]
  recentActivities: {
    id: string
    user_name: string
    entity: string
    action: string
    created_at: string
  }[]
}

export default function DashboardPage() {
  const { companyId } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!companyId) return

    let cancelled = false

    fetch('/api/dashboard/stats', {
      headers: { 'x-company-id': companyId },
    })
      .then((res) => parseApiResponse<Stats>(res))
      .then((data) => {
        if (cancelled) return
        if (data.success && data.data) setStats(data.data)
        else setError(data.message || 'Failed to load stats')
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [companyId])

  const isLoading = companyId && loading

  if (isLoading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (!companyId) {
    return (
      <div className={styles.emptyState}>
        <h2>مرحباً بك في StockFlow</h2>
        <p>اختر شركة للبدء أو أنشئ شركة جديدة</p>
      </div>
    )
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>لوحة التحكم</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>المنتجات</span>
          <span className={styles.statValue}>{stats?.productsCount ?? 0}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>العملاء</span>
          <span className={styles.statValue}>{stats?.customersCount ?? 0}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>مبيعات اليوم</span>
          <span className={styles.statValue}>{(stats?.todaySales ?? 0).toLocaleString('ar-EG')} ج.م</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>إجمالي الديون</span>
          <span className={styles.statValue}>{(stats?.totalDebt ?? 0).toLocaleString('ar-EG')} ج.م</span>
        </div>
      </div>

      {stats?.weeklySales && stats.weeklySales.length > 0 && (
        <SalesChart data={stats.weeklySales} />
      )}

      {stats?.recentActivities && stats.recentActivities.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>آخر النشاطات</h2>
          <div className={styles.activityList}>
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <span className={styles.activityUser}>{activity.user_name}</span>
                  <span className={styles.activityAction}>
                    {activity.action === 'create' ? 'أضاف' :
                     activity.action === 'update' ? 'تعديل' :
                     activity.action === 'delete' ? 'حذف' : activity.action}
                  </span>
                  <span className={styles.activityEntity}>{activity.entity}</span>
                </div>
                <span className={styles.activityTime}>
                  {new Date(activity.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
