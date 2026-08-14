'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import type { Product, PaginatedResponse } from '@/lib/types'
import styles from './products.module.css'

export default function ProductsPage() {
  const { companyId } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
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

    apiClient<PaginatedResponse<Product>>(`/products?${params}`)
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.data ?? [])
          setPagination(res.data.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [companyId, page, search])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>المنتجات</h1>
        <button className={styles.addBtn}>+ منتج جديد</button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="بحث عن منتج..."
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

      {!loading && !error && products.length === 0 && (
        <div className={styles.empty}>لا توجد منتجات بعد</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>SKU</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحد الأدنى</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={p.stock <= p.min_stock ? styles.lowStock : ''}>
                  <td className={styles.nameCell}>{p.name}</td>
                  <td className={styles.skuCell}>{p.sku}</td>
                  <td>{p.price.toLocaleString('ar-EG')} ج.م</td>
                  <td>
                    <span className={p.stock <= p.min_stock ? styles.stockBadge : ''}>
                      {p.stock}
                    </span>
                  </td>
                  <td>{p.min_stock}</td>
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
