'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { Customer, PaginatedResponse } from '@/lib/types'
import styles from './customers.module.css'

export default function CustomersPage() {
  const { companyId } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  useEffect(() => {
    if (!companyId) return
    setLoading(true)

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)

    apiClient<PaginatedResponse<Customer>>(`/customers?${params}`)
      .then((res) => {
        if (res.success && res.data) {
          setCustomers(res.data.data ?? [])
          setPagination(res.data.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [companyId, page, search])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>العملاء</h1>
        <button className={styles.addBtn}>+ عميل جديد</button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="بحث عن عميل..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className={styles.searchInput}
        />
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && customers.length === 0 && (
        <div className={styles.empty}>لا يوجد عملاء بعد</div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>البريد</th>
                <th>الديون</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className={c.total_debt > 0 ? styles.hasDebt : ''}>
                  <td className={styles.nameCell}>{c.name}</td>
                  <td className={styles.ltr}>{c.phone || '-'}</td>
                  <td className={styles.ltr}>{c.email || '-'}</td>
                  <td>
                    <span className={c.total_debt > 0 ? styles.debtBadge : ''}>
                      {c.total_debt > 0 ? `${c.total_debt.toLocaleString('ar-EG')} ج.م` : '0'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn}>تعديل</button>
                      <button className={styles.deleteBtn}>حذف</button>
                    </div>
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
