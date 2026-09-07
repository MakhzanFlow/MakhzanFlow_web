'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import NoPermission, { InlineNoPermission } from '@/components/NoPermission'
import type { Product } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

interface ProductForm {
  name: string
  sku: string
  barcode: string
  price: string
  stock: string
  minStock: string
}

const emptyForm: ProductForm = { name: '', sku: '', barcode: '', price: '', stock: '', minStock: '' }

export default function ProductsPage() {
  const { companyId, hasPermission } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('منتج جديد')
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const canCreate = hasPermission('products.create')
  const canUpdate = hasPermission('products.update')
  const canDelete = hasPermission('products.delete')

  const fetchProducts = useCallback(() => {
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
          setForbidden(false)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const e = err as { status?: number; isForbidden?: boolean; message?: string }
        if (e.status === 403 || e.isForbidden) setForbidden(true)
        else setError(e.message || 'Failed to load products')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyId, page, search])

  useEffect(() => {
    const cleanup = fetchProducts()
    return () => { cleanup?.() }
  }, [fetchProducts])

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setImageFile(null)
    setModalTitle('منتج جديد')
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      sku: p.sku ?? '',
      barcode: p.barcode ?? '',
      price: String(p.price),
      stock: String(p.stock),
      minStock: String(p.min_stock),
    })
    setEditingId(p.id)
    setImageFile(null)
    setModalTitle('تعديل المنتج')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    setImageFile(null)
    setError('')
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim() || null,
      barcode: form.barcode.trim() || null,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock, 10) || 0,
      min_stock: parseInt(form.minStock, 10) || 0,
    }

    try {
      if (editingId) {
        const data = await apiClient<Product>(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!data.success) throw new Error(data.message || 'Failed to update product')
        if (data.data) {
          setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...data.data } : p)))
        }
        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile)
          const image = await apiClient<{ image_url: string | null }>(`/products/${editingId}`, {
            method: 'POST',
            body: formData,
          })
          if (image.data?.image_url) {
            setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, image_url: image.data!.image_url } : p)))
          }
        }
        toast('تم تحديث المنتج بنجاح', 'success')
      } else {
        const data = await apiClient<Product>('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!data.success) throw new Error(data.message || 'Failed to create product')
        if (data.data) {
          setProducts((prev) => [data.data!, ...prev])
        }
        if (imageFile && data.data?.id) {
          const formData = new FormData()
          formData.append('image', imageFile)
          const image = await apiClient<{ image_url: string | null }>(`/products/${data.data.id}`, {
            method: 'POST',
            body: formData,
          })
          if (image.data?.image_url) {
            setProducts((prev) => prev.map((p) => (p.id === data.data!.id ? { ...p, image_url: image.data!.image_url } : p)))
          }
        }
        toast('تم إنشاء المنتج بنجاح', 'success')
      }
      closeModal()
    } catch (err: unknown) {
      const e = err as { status?: number; isForbidden?: boolean; message?: string }
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      const isForbidden = e.status === 403 || e.isForbidden || msg.includes('صلاحية') || msg.includes('permission') || msg.includes('Forbidden')
      if (msg.includes('already exists') || msg.includes('مكرر') || msg.includes('duplicate') || msg.includes('Duplicate')) {
        setError('المنتج موجود مسبقاً (SKU أو الباركود مكرر)')
      } else if (isForbidden) {
        setError('لا تملك صلاحية للقيام بهذا الإجراء')
        toast('ليس لديك صلاحية للقيام بهذا الإجراء', 'error')
      } else {
        setError(msg)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const data = await apiClient(`/products/${deleteId}`, {
        method: 'DELETE',
      })
      if (!data.success) throw new Error(data.message || 'Failed to delete product')
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      toast('تم حذف المنتج بنجاح', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('invoice') || msg.includes('referenced')) {
        toast('لا يمكن حذف المنتج لأنه مرتبط بفواتير', 'error')
      } else if (msg.includes('permission') || msg.includes('Forbidden') || msg.includes('403')) {
        toast('لا تملك صلاحية لحذف هذا المنتج', 'error')
      } else {
        toast(msg, 'error')
      }
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>المنتجات</h1>
          <p>إدارة مخزونك وأسعار منتجاتك</p>
        </div>
        {canCreate && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
            <Icon name="plus" size={18} />
            منتج جديد
          </button>
        )}
      </header>

      <div className={styles.screenBody}>
        {forbidden ? (
          <NoPermission
            requiredPermission="products.read"
            title="ليس لديك صلاحية لعرض المنتجات"
            description="تحتاج إلى صلاحية عرض المنتجات. تواصل مع مسؤول الشركة للحصول على الوصول."
          />
        ) : (
          <>
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
              {!canCreate && (
                <span style={{ fontSize: 12, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="lock" size={14} /> ليس لديك صلاحية الإنشاء
                </span>
              )}
            </div>

            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner} />
              </div>
            )}

            {!loading && error && (
              <div>
                <div className={styles.errorBox}>{error}</div>
                {(error.includes('صلاحية') || error.includes('permission')) && (
                  <div style={{ marginTop: 12 }}>
                    <InlineNoPermission message={error} />
                  </div>
                )}
              </div>
            )}

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
                    {(canUpdate || canDelete) && <th>إجراءات</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const low = p.stock <= p.min_stock
                    return (
                      <tr key={p.id} className={low ? styles.rowAlert : ''}>
                        <td className={styles.nameCell}>{p.name}</td>
                        <td className={styles.skuCell}>{p.sku ?? '—'}</td>
                        <td className={styles.numCell}>{p.price.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>
                          {low && <span className={styles.badgeMin}>منخفض</span>}{' '}
                          <span className={styles.stockCell}>{p.stock}</span>
                        </td>
                        <td className={styles.numCell}>{p.min_stock}</td>
                        {(canUpdate || canDelete) && (
                          <td>
                            <div className={styles.cellActions}>
                              {canUpdate && (
                                <button
                                  type="button"
                                  className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                                  onClick={() => openEdit(p)}
                                >
                                  تعديل
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                                  onClick={() => handleDelete(p.id)}
                                >
                                  حذف
                                </button>
                              )}
                            </div>
                          </td>
                        )}
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
          </>
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
              {error && (
                <div className={styles.errorBox}>
                  {error}
                </div>
              )}
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
                  <label>SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="اتركه فارغاً للتوليد التلقائي"
                    dir="ltr"
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>الباركود</label>
                  <input
                    type="text"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    placeholder="اختياري"
                    dir="ltr"
                  />
                </div>
                <div className={styles.field}>
                  <label>السعر (ج.م) <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                <div className={styles.field}>
                  <label>الحد الأدنى</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                    placeholder="٠"
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>صورة المنتج</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={closeModal} disabled={saving}>
                إلغاء
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${saving ? styles.isPending : ''}`} disabled={saving}>
                <span className={styles.spinner} />
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {deleteId && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHead}>
              <h2>تأكيد الحذف</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setDeleteId(null)} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <p>هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setDeleteId(null)}>
                إلغاء
              </button>
              <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={confirmDelete}>
                حذف
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
