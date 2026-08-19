'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import type { MonthlyReport, LowStockProduct, Activity } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

type Tab = 'monthly' | 'low-stock' | 'activity'

const actionLabels: Record<string, string> = {
  create: 'إضافة',
  update: 'تعديل',
  delete: 'حذف',
}

export default function ReportsPage() {
  const { companyId } = useAuth()
  const [tab, setTab] = useState<Tab>('monthly')
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([])
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!companyId) return
    let cancelled = false

    const fail = (msg: string) => { if (!cancelled) setError(msg) }
    const done = () => { if (!cancelled) setLoading(false) }

    if (tab === 'monthly') {
      apiClient<MonthlyReport[]>('/dashboard/monthly-report')
        .then((res) => {
          if (cancelled) return
          if (res.success && res.data) setMonthlyData(res.data)
        })
        .catch(() => fail('Failed to load monthly report'))
        .finally(done)
    } else if (tab === 'low-stock') {
      apiClient<LowStockProduct[]>(`/dashboard/low-stock`)
        .then((res) => {
          if (cancelled) return
          if (res.success && res.data) setLowStock(res.data)
        })
        .catch(() => fail('Failed to load low stock products'))
        .finally(done)
    } else {
      apiClient<Activity[]>(`/dashboard/activity`)
        .then((res) => {
          if (cancelled) return
          if (res.success && res.data) setActivities(res.data)
        })
        .catch(() => fail('Failed to load activity log'))
        .finally(done)
    }

    return () => { cancelled = true }
  }, [companyId, tab])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'monthly', label: 'التقرير الشهري' },
    { key: 'low-stock', label: 'المنتجات المنخفضة' },
    { key: 'activity', label: 'سجل النشاطات' },
  ]

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>التقارير</h1>
          <p>متابعة أداء المخزن وتحديد المنتجات المنخفضة</p>
        </div>
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.tabGroup}>
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        )}

        {!loading && error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && tab === 'monthly' && (
          <div className={styles.card}>
            {monthlyData.length > 0 ? (
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>الشهر</th>
                      <th>الفواتير</th>
                      <th>الإيرادات</th>
                      <th>المدفوعات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((m) => (
                      <tr key={m.month}>
                        <td>{m.month}</td>
                        <td className={styles.numCell}>{m.totalInvoices}</td>
                        <td className={styles.numCell}>{m.totalRevenue.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>{m.totalPayments.toLocaleString('ar-EG')} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <Icon name="chart" size={30} />
                </span>
                <h3>لا توجد بيانات بعد</h3>
                <p>ستظهر هنا ملخصات أداء المخزن فور إنشاء فواتير ومدفوعات</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'low-stock' && (
          <div className={styles.card}>
            {lowStock.length > 0 ? (
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>المنتج</th>
                      <th>SKU</th>
                      <th>المخزون</th>
                      <th>الحد الأدنى</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((p) => (
                      <tr key={p.id} className={styles.rowAlert}>
                        <td className={styles.nameCell}>{p.name}</td>
                        <td className={styles.skuCell}>{p.sku}</td>
                        <td className={styles.numCell}>
                          <span className={`${styles.chip} ${styles.chipRed}`}>{p.stock}</span>
                        </td>
                        <td className={styles.numCell}>{p.min_stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <Icon name="box" size={30} />
                </span>
                <h3>جميع المنتجات متوفرة</h3>
                <p>لا توجد منتجات وصلت إلى الحد الأدنى للمخزون</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'activity' && (
          <div className={styles.card}>
            {activities.length > 0 ? (
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>المستخدم</th>
                      <th>الإجراء</th>
                      <th>الكيان</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id}>
                        <td className={styles.nameCell}>{a.user_name}</td>
                        <td>{actionLabels[a.action] ?? a.action}</td>
                        <td className={styles.muted}>{a.entity}</td>
                        <td className={styles.dateCell}>
                          {new Date(a.created_at).toLocaleDateString('ar-EG')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <Icon name="doc" size={30} />
                </span>
                <h3>لا توجد نشاطات بعد</h3>
                <p>سجل تعديلات وأحداث المخزن تظهر هنا</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
