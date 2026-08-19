'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { parseApiResponse } from '@/lib/api-client'
import Icon from '@/components/Icon'
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

const actionLabels: Record<string, string> = {
  create: 'أضاف',
  update: 'عدّل',
  delete: 'حذف',
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
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (!companyId) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>
          <Icon name="box" size={30} />
        </span>
        <h3>مرحباً بك في StockFlow</h3>
        <p>اختر شركة للبدء أو أنشئ شركة جديدة</p>
      </div>
    )
  }

  if (error) {
    return <div className={styles.errorBox}>{error}</div>
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>لوحة التحكم</h1>
          <p>نظرة عامة على أداء مخزنك اليوم</p>
        </div>
      </header>

      <div className={styles.screenBody}>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statIconGreen}`}>
              <Icon name="box" size={24} />
            </span>
            <div>
              <div className={styles.statLabel}>المنتجات</div>
              <div className={styles.statNum}>{stats?.productsCount ?? 0}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statIconGreen}`}>
              <Icon name="people" size={24} />
            </span>
            <div>
              <div className={styles.statLabel}>العملاء</div>
              <div className={styles.statNum}>{stats?.customersCount ?? 0}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statIconOrange}`}>
              <Icon name="payments" size={24} />
            </span>
            <div>
              <div className={styles.statLabel}>مبيعات اليوم</div>
              <div className={styles.statNum}>
                {(stats?.todaySales ?? 0).toLocaleString('ar-EG')} ج.م
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statIconRed}`}>
              <Icon name="wallet" size={24} />
            </span>
            <div>
              <div className={styles.statLabel}>إجمالي الديون</div>
              <div className={styles.statNum}>
                {(stats?.totalDebt ?? 0).toLocaleString('ar-EG')} ج.م
              </div>
            </div>
          </div>
        </div>

        {stats?.weeklySales && stats.weeklySales.length > 0 && (
          <SalesChart data={stats.weeklySales} />
        )}

        {stats?.recentActivities && stats.recentActivities.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.cardTitle}>آخر النشاطات</div>
            </div>
            <div className={styles.activityList}>
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <span
                    className={`${styles.dot} ${
                      activity.action === 'delete'
                        ? styles.dotRed
                        : activity.action === 'update'
                          ? styles.dotOrange
                          : ''
                    }`}
                  />
                  <div className={styles.actBody}>
                    <b>{activity.user_name}</b> {actionLabels[activity.action] ?? activity.action}{' '}
                    <span className={styles.ent}>{activity.entity}</span>
                  </div>
                  <div className={styles.actDate}>
                    {new Date(activity.created_at).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
