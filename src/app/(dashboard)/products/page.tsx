'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import type { Product } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

interface ProductForm {
  name: string
  sku: string
  price: string
  stock: string
  minStock: string
}

const emptyForm: ProductForm = { name: '', sku: '', price: '', stock: '', minStock: '' }

export default function ProductsPage() {
  const { companyId } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('منتج جديد')
  const [form, setForm] = useState<ProductForm>(emptyForm)

  useEffect(() => {
    if (!companyId) return
    let cancelled = false

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)

    apiClient<Product[]>(`/products?${params}`)
      .then((res) => {
        if (cancelled) return
        if (res.success && res.data) {
          setProducts(res.data ?? [])
          setPagination(res.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load products') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyId, page, search])

  const openNew = () => {
    setForm(emptyForm)
    setModalTitle('منتج جديد')
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      sku: p.sku,
      price: String(p.price),
      stock: String(p.stock),
      minStock: String(p.min_stock),
    })
    setModalTitle('تعديل المنتج')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    closeModal()
    toast('تم الحفظ بنجاح', 'success')
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast('تم الحذف', 'success')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>المنتجات</h1>
          <p>إدارة مخزونك وأسعار منتجاتك</p>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
          <Icon name="plus" size={18} />
          منتج جديد
        </button>
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Icon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="بحث عن منتج..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        )}

        {!loading && error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className={`${styles.card} ${styles.emptyState}`}>
            <span className={styles.emptyIcon}>
              <Icon name="box" size={30} />
            </span>
            <h3>لا توجد منتجات بعد</h3>
            <p>أضف أول منتج للمخزن وابدأ في إدارة مخزونك</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className={styles.card}>
            <div className={styles.tableScroll}>
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
                  {products.map((p) => {
                    const low = p.stock <= p.min_stock
                    return (
                      <tr key={p.id} className={low ? styles.rowAlert : ''}>
                        <td className={styles.nameCell}>{p.name}</td>
                        <td className={styles.skuCell}>{p.sku}</td>
                        <td className={styles.numCell}>{p.price.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>
                          {low && <span className={styles.badgeMin}>منخفض</span>}{' '}
                          <span className={styles.stockCell}>{p.stock}</span>
                        </td>
                        <td className={styles.numCell}>{p.min_stock}</td>
                        <td>
                          <div className={styles.cellActions}>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                              onClick={() => openEdit(p)}
                            >
                              تعديل
                            </button>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                              onClick={() => handleDelete(p.id)}
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {pagination.pages > 1 && (
              <div className={styles.pager}>
                <button
                  type="button"
                  className={styles.pg}
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <Icon name="chevRight" size={16} />
                  السابق
                </button>
                <span className={styles.count}>
                  {page.toLocaleString('ar-EG')} / {pagination.pages.toLocaleString('ar-EG')}
                </span>
                <button
                  type="button"
                  className={styles.pg}
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  التالي
                  <Icon name="chevLeft" size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={closeModal}>
          <form className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <header className={styles.modalHead}>
              <h2>{modalTitle}</h2>
              <button type="button" className={styles.iconBtn} onClick={closeModal} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>الاسم <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="اسم المنتج"
                    required
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>SKU <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="مثال: RICE-5KG"
                    dir="ltr"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>السعر (ج.م) <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="٠"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>الحد الأدنى <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                    placeholder="٠"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>المخزون</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="٠"
                  />
                </div>
              </div>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={closeModal}>
                إلغاء
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                حفظ
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  )
}
