'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import NoPermission from '@/components/NoPermission'
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

const emptySteps = [
  { num: '١', icon: 'box', tone: 'statIconGreen', title: 'أضف منتجاتك', desc: 'سجّل أصناف مخزنك والكميات والأسعار.', href: '/products', cta: 'إضافة منتج' },
  { num: '٢', icon: 'people', tone: 'statIconOrange', title: 'سجّل عملاءك', desc: 'احفظ بيانات عملائك وتابع ديونهم.', href: '/customers', cta: 'إضافة عميل' },
  { num: '٣', icon: 'invoices', tone: 'statIconRed', title: 'أنشئ أول فاتورة', desc: 'افتح فاتورة بيع وشاهد أرقامك تتحرك.', href: '/invoices', cta: 'فاتورة جديدة' },
] as const

const heroBars = [38, 62, 45, 78, 55, 90, 68]

function isEmptyStats(s: Stats): boolean {
  return (
    s.productsCount === 0 &&
    s.customersCount === 0 &&
    s.todaySales === 0 &&
    s.totalDebt === 0 &&
    s.monthlyPayments === 0 &&
    s.weeklySales.every((w) => !w.amount) &&
    s.recentActivities.length === 0
  )
}

export default function DashboardPage() {
  const { user, companyId } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  useEffect(() => {
    if (!companyId || !user) return

    let cancelled = false
    apiClient<Stats>('/dashboard/stats')
      .then((data) => {
        if (cancelled) return
        if (data.message?.includes('صلاحية') || data.message?.toLowerCase().includes('forbidden')) {
          setForbidden(true)
          return
        }
        if (data.success && data.data) setStats(data.data)
        else setError(data.message || 'Failed to load stats')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const e = err as { status?: number; isForbidden?: boolean; message?: string }
        if (e.status === 403 || e.isForbidden) setForbidden(true)
        else setError(e.message || 'Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [companyId, user])

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
        <h3>مرحباً بك في MakhzanFlow</h3>
        <p>اختر شركة للبدء أو أنشئ شركة جديدة</p>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className={styles.screen}>
        <NoPermission
          requiredPermission="reports.read"
          title="ليس لديك صلاحية لعرض لوحة التحكم"
          description="تحتاج إلى صلاحية عرض لوحة التحكم. تواصل مع مسؤول الشركة للحصول على الوصول."
        />
      </div>
    )
  }

  if (error) {
    return <div className={styles.errorBox}>{error}</div>
  }

  if (stats && isEmptyStats(stats)) {
    return (
      <div className={styles.screen}>
        <header className={styles.screenHead}>
          <div>
            <h1>لوحة التحكم</h1>
            <p>نظرة عامة على أداء مخزنك اليوم</p>
          </div>
        </header>

        <div className={styles.screenBody}>
          <section className={`${styles.card} ${styles.emptyHero}`}>
            <div className={styles.emptyHeroVisual} aria-hidden="true">
              <span className={styles.heroRing} />
              <span className={styles.heroRing2} />
              <span className={styles.heroBox}>
                <Icon name="box" size={34} />
              </span>
              <span className={`${styles.heroChip} ${styles.chipA}`}>
                <Icon name="check" size={14} />
              </span>
              <span className={`${styles.heroChip} ${styles.chipB}`}>
                <Icon name="chart" size={14} />
              </span>
            </div>
            <h2>مخزنك جاهز — يلا نبدأ الشغل</h2>
            <p>لسه مفيش بيانات هنا. ضيف منتجاتك وعملاءك وافتح أول فاتورة، وهتشوف كل أرقامك حيّة في اللوحة دي.</p>
            <div className={styles.heroBars} aria-hidden="true">
              {heroBars.map((h, i) => (
                <span
                  key={i}
                  className={styles.heroBar}
                  style={{ '--h': `${h}%`, '--bd': `${0.2 + i * 0.12}s` } as CSSProperties}
                />
              ))}
            </div>
          </section>

          <div className={styles.emptySteps}>
            {emptySteps.map((step, i) => (
              <article
                key={step.title}
                className={styles.emptyStep}
                style={{ '--sd': `${0.15 + i * 0.12}s` } as CSSProperties}
              >
                <span className={styles.stepNum}>{step.num}</span>
                <span className={`${styles.statIcon} ${styles[step.tone]}`}>
                  <Icon name={step.icon} size={24} />
                </span>
                <div className={styles.stepTxt}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <Link href={step.href} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>
                  {step.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
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
