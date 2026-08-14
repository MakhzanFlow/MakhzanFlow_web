'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { MonthlyReport, LowStockProduct, Activity, PaginatedResponse } from '@/lib/types'
import styles from './reports.module.css'

type Tab = 'monthly' | 'low-stock' | 'activity'

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
    setLoading(true)
    setError('')

    if (tab === 'monthly') {
      apiClient<MonthlyReport[]>('/dashboard/monthly-report')
        .then((res) => {
          if (res.success && res.data) setMonthlyData(res.data)
        })
        .catch(() => setError('Failed to load monthly report'))
        .finally(() => setLoading(false))
    } else if (tab === 'low-stock') {
      apiClient<PaginatedResponse<LowStockProduct>>('/dashboard/low-stock')
        .then((res) => {
          if (res.success && res.data) setLowStock(res.data.data ?? [])
        })
        .catch(() => setError('Failed to load low stock products'))
        .finally(() => setLoading(false))
    } else {
      apiClient<PaginatedResponse<Activity>>('/dashboard/activity')
        .then((res) => {
          if (res.success && res.data) setActivities(res.data.data ?? [])
        })
        .catch(() => setError('Failed to load activity log'))
        .finally(() => setLoading(false))
    }
  }, [companyId, tab])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>التقارير</h1>
      </div>

      <div className={styles.tabs}>
        {([
          { key: 'monthly', label: 'التقرير الشهري' },
          { key: 'low-stock', label: 'المنتجات المنخفضة' },
          { key: 'activity', label: 'سجل النشاطات' },
        ] as const).map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && tab === 'monthly' && (
        <div className={styles.tableWrap}>
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
                  <td>{m.totalInvoices}</td>
                  <td>{m.totalRevenue.toLocaleString('ar-EG')} ج.م</td>
                  <td>{m.totalPayments.toLocaleString('ar-EG')} ج.م</td>
                </tr>
              ))}
              {monthlyData.length === 0 && (
                <tr><td colSpan={4} className={styles.emptyRow}>لا توجد بيانات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && tab === 'low-stock' && (
        <div className={styles.tableWrap}>
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
                <tr key={p.id} className={styles.lowStockRow}>
                  <td className={styles.nameCell}>{p.name}</td>
                  <td className={styles.skuCell}>{p.sku}</td>
                  <td className={styles.stockCell}>{p.stock}</td>
                  <td>{p.min_stock}</td>
                </tr>
              ))}
              {lowStock.length === 0 && (
                <tr><td colSpan={4} className={styles.emptyRow}>جميع المنتجات متوفرة</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && tab === 'activity' && (
        <div className={styles.tableWrap}>
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
                  <td>
                    {a.action === 'create' ? 'إضافة' :
                     a.action === 'update' ? 'تعديل' :
                     a.action === 'delete' ? 'حذف' : a.action}
                  </td>
                  <td className={styles.entityCell}>{a.entity}</td>
                  <td className={styles.dateCell}>
                    {new Date(a.created_at).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr><td colSpan={4} className={styles.emptyRow}>لا توجد نشاطات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
