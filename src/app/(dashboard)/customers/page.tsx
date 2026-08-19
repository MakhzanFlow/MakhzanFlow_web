'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import type { Customer } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

interface CustomerForm {
  name: string
  phone: string
  email: string
  address: string
  openingBalance: string
}

const emptyForm: CustomerForm = { name: '', phone: '', email: '', address: '', openingBalance: '' }

function parseAmount(value: string): number {
  const normalized = value
    .trim()
    .replace(/,/g, '')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
  const n = parseFloat(normalized)
  return Number.isFinite(n) ? n : 0
}

export default function CustomersPage() {
  const { companyId, hasPermission } = useAuth()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('عميل جديد')
  const [form, setForm] = useState<CustomerForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const canCreate = hasPermission('customers.create')
  const canUpdate = hasPermission('customers.update')
  const canDelete = hasPermission('customers.delete')

  const fetchCustomers = useCallback(() => {
    if (!companyId) return
    let cancelled = false

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)

    apiClient<Customer[]>(`/customers?${params}`)
      .then((res) => {
        if (cancelled) return
        if (res.success && res.data) {
          setCustomers(res.data ?? [])
          setPagination(res.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load customers') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyId, page, search])

  useEffect(() => {
    const cleanup = fetchCustomers()
    return () => { cleanup?.() }
  }, [fetchCustomers])

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalTitle('عميل جديد')
    setModalOpen(true)
  }

  const openEdit = (c: Customer) => {
    setForm({
      name: c.name,
      phone: c.phone ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      openingBalance: '',
    })
    setEditingId(c.id)
    setModalTitle('تعديل العميل')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    setError('')
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
    }

    if (!editingId && form.openingBalance.trim()) {
      payload.opening_balance = parseAmount(form.openingBalance)
    }

    try {
      if (editingId) {
        const data = await apiClient<Customer>(`/customers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!data.success) throw new Error(data.message || 'Failed to update customer')
        if (data.data) {
          setCustomers((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...data.data } : c)))
        }
        toast('تم تحديث العميل بنجاح', 'success')
      } else {
        const data = await apiClient<Customer>('/customers', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!data.success) throw new Error(data.message || 'Failed to create customer')
        if (data.data) {
          setCustomers((prev) => [data.data!, ...prev])
        }
        toast('تم إنشاء العميل بنجاح', 'success')
      }
      closeModal()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('already exists') || msg.includes('مكرر') || msg.includes('duplicate') || msg.includes('Duplicate')) {
        setError('العميل موجود مسبقاً')
      } else if (msg.includes('permission') || msg.includes('Forbidden') || msg.includes('403')) {
        setError('لا تملك صلاحية للقيام بهذا الإجراء')
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
    if (!deleteId || deleting) return
    setDeleting(true)
    try {
      const data = await apiClient(`/customers/${deleteId}`, {
        method: 'DELETE',
      })
      if (!data.success) throw new Error(data.message || 'Failed to delete customer')
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId))
      toast('تم حذف العميل بنجاح', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('invoice') || msg.includes('referenced')) {
        toast('لا يمكن حذف العميل لأنه مرتبط بفواتير', 'error')
      } else if (msg.includes('permission') || msg.includes('Forbidden') || msg.includes('403')) {
        toast('لا تملك صلاحية لحذف هذا العميل', 'error')
      } else {
        toast(msg, 'error')
      }
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>العملاء</h1>
          <p>تتبع ديون عملائك وفواتيرهم في مكان واحد</p>
        </div>
        {canCreate && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
            <Icon name="plus" size={18} />
            عميل جديد
          </button>
        )}
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Icon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="بحث عن عميل..."
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

        {!loading && !error && customers.length === 0 && (
          <div className={`${styles.card} ${styles.emptyState}`}>
            <span className={styles.emptyIcon}>
              <Icon name="people" size={30} />
            </span>
            <h3>لا يوجد عملاء بعد</h3>
            <p>أضف عملاءك لتتبع ديونهم وفواتيرهم</p>
          </div>
        )}

        {!loading && !error && customers.length > 0 && (
          <div className={styles.card}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الهاتف</th>
                    <th>البريد</th>
                    <th>الديون</th>
                    {(canUpdate || canDelete) && <th>إجراءات</th>}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const hasDebt = c.current_debt > 0
                    return (
                      <tr key={c.id} className={hasDebt ? styles.rowAlert : ''}>
                        <td className={styles.nameCell}>{c.name}</td>
                        <td className={styles.skuCell} dir="ltr">{c.phone || '—'}</td>
                        <td className={styles.muted} dir="ltr">{c.email || '—'}</td>
                        <td>
                          {hasDebt ? (
                            <span className={`${styles.chip} ${styles.chipRed}`}>
                              {c.current_debt.toLocaleString('ar-EG')} ج.م
                            </span>
                          ) : (
                            <span className={styles.numCell}>٠</span>
                          )}
                        </td>
                        {(canUpdate || canDelete) && (
                          <td>
                            <div className={styles.cellActions}>
                              {canUpdate && (
                                <button
                                  type="button"
                                  className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                                  onClick={() => openEdit(c)}
                                >
                                  تعديل
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                                  onClick={() => handleDelete(c.id)}
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
                    placeholder="اسم العميل"
                    required
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>الهاتف</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="٠١٢٣٤٥٦٧٨٩٠"
                    dir="ltr"
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>العنوان</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="العنوان (اختياري)"
                  />
                </div>
                {!editingId && (
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label>الرصيد الافتتاحي (ج.م)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.openingBalance}
                      onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
                      placeholder="٠"
                      dir="ltr"
                    />
                  </div>
                )}
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
              <p>هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setDeleteId(null)}>
                إلغاء
              </button>
              <button type="button" className={`${styles.btn} ${styles.btnDanger} ${deleting ? styles.isPending : ''}`} onClick={confirmDelete} disabled={deleting}>
                <span className={styles.spinner} />
                {deleting ? 'جاري الحذف...' : 'حذف'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
