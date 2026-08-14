'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { Invoice, PaginatedResponse } from '@/lib/types'
import styles from './invoices.module.css'

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'var(--muted)' },
  final: { label: 'نهائية', color: 'var(--accent)' },
  paid: { label: 'مدفوعة', color: 'var(--color-success, #16a34a)' },
  partial: { label: 'جزئية', color: 'var(--color-warning, #f97316)' },
  cancelled: { label: 'ملغاة', color: 'var(--error)' },
}

export default function InvoicesPage() {
  const { companyId } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'purchase'>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  useEffect(() => {
    if (!companyId) return
    setLoading(true)

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (typeFilter !== 'all') params.set('type', typeFilter)

    apiClient<PaginatedResponse<Invoice>>(`/invoices?${params}`)
      .then((res) => {
        if (res.success && res.data) {
          setInvoices(res.data.data ?? [])
          setPagination(res.data.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => setError('Failed to load invoices'))
      .finally(() => setLoading(false))
  }, [companyId, page, typeFilter])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>الفواتير</h1>
        <button className={styles.addBtn}>+ فاتورة جديدة</button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {(['all', 'sale', 'purchase'] as const).map((t) => (
            <button
              key={t}
              className={`${styles.filterTab} ${typeFilter === t ? styles.filterTabActive : ''}`}
              onClick={() => { setTypeFilter(t); setPage(1) }}
            >
              {t === 'all' ? 'الكل' : t === 'sale' ? 'بيع' : 'شراء'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && invoices.length === 0 && (
        <div className={styles.empty}>لا توجد فواتير بعد</div>
      )}

      {!loading && !error && invoices.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>النوع</th>
                <th>العميل</th>
                <th>الإجمالي</th>
                <th>المدفوع</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const status = statusLabels[inv.status] || statusLabels.draft
                return (
                  <tr key={inv.id}>
                    <td className={styles.invoiceNumber}>{inv.invoice_number}</td>
                    <td>
                      <span className={inv.type === 'sale' ? styles.saleBadge : styles.purchaseBadge}>
                        {inv.type === 'sale' ? 'بيع' : 'شراء'}
                      </span>
                    </td>
                    <td>{inv.customer_name || '-'}</td>
                    <td>{inv.total.toLocaleString('ar-EG')} ج.م</td>
                    <td>{inv.paid_amount.toLocaleString('ar-EG')} ج.م</td>
                    <td>
                      <span className={styles.statusBadge} style={{ background: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(inv.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.viewBtn}>عرض</button>
                        <button className={styles.deleteBtn}>حذف</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>السابق</button>
          <span>{page} / {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>التالي</button>
        </div>
      )}
    </div>
  )
}
