'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { Payment, PaginatedResponse } from '@/lib/types'
import styles from './payments.module.css'

export default function PaymentsPage() {
  const { companyId } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'received' | 'made'>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  useEffect(() => {
    if (!companyId) return
    setLoading(true)

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (typeFilter !== 'all') params.set('type', typeFilter)

    apiClient<PaginatedResponse<Payment>>(`/payments?${params}`)
      .then((res) => {
        if (res.success && res.data) {
          setPayments(res.data.data ?? [])
          setPagination(res.data.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => setError('Failed to load payments'))
      .finally(() => setLoading(false))
  }, [companyId, page, typeFilter])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>المدفوعات</h1>
        <button className={styles.addBtn}>+ دفعة جديدة</button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {(['all', 'received', 'made'] as const).map((t) => (
            <button
              key={t}
              className={`${styles.filterTab} ${typeFilter === t ? styles.filterTabActive : ''}`}
              onClick={() => { setTypeFilter(t); setPage(1) }}
            >
              {t === 'all' ? 'الكل' : t === 'received' ? 'مستلمة' : 'مدفوعة'}
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

      {!loading && !error && payments.length === 0 && (
        <div className={styles.empty}>لا توجد مدفوعات بعد</div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المبلغ</th>
                <th>النوع</th>
                <th>العميل</th>
                <th>الفاتورة</th>
                <th>ملاحظات</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className={styles.amountCell}>{p.amount.toLocaleString('ar-EG')} ج.م</td>
                  <td>
                    <span className={p.type === 'received' ? styles.receivedBadge : styles.madeBadge}>
                      {p.type === 'received' ? 'مستلمة' : 'مدفوعة'}
                    </span>
                  </td>
                  <td>{p.customer_name || '-'}</td>
                  <td className={styles.invoiceCell}>{p.invoice_id ? p.invoice_id.slice(0, 8) : '-'}</td>
                  <td className={styles.notesCell}>{p.notes || '-'}</td>
                  <td className={styles.dateCell}>
                    {new Date(p.created_at).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
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
