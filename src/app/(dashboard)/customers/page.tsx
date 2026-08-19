'use client'

import { useEffect, useState, type FormEvent } from 'react'
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
}

const emptyForm: CustomerForm = { name: '', phone: '', email: '' }

export default function CustomersPage() {
  const { companyId } = useAuth()
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

  useEffect(() => {
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

  const openNew = () => {
    setForm(emptyForm)
    setModalTitle('عميل جديد')
    setModalOpen(true)
  }

  const openEdit = (c: Customer) => {
    setForm({ name: c.name, phone: c.phone ?? '', email: c.email ?? '' })
    setModalTitle('تعديل العميل')
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
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    toast('تم الحذف', 'success')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>العملاء</h1>
          <p>تتبع ديون عملائك وفواتيرهم في مكان واحد</p>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
          <Icon name="plus" size={18} />
          عميل جديد
        </button>
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
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const hasDebt = c.total_debt > 0
                    return (
                      <tr key={c.id} className={hasDebt ? styles.rowAlert : ''}>
                        <td className={styles.nameCell}>{c.name}</td>
                        <td className={`${styles.mono}`} dir="ltr">{c.phone || '-'}</td>
                        <td className={styles.muted} dir="ltr">{c.email || '-'}</td>
                        <td>
                          {hasDebt ? (
                            <span className={`${styles.chip} ${styles.chipRed}`}>
                              {c.total_debt.toLocaleString('ar-EG')} ج.م
                            </span>
                          ) : (
                            <span className={styles.numCell}>٠</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.cellActions}>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                              onClick={() => openEdit(c)}
                            >
                              تعديل
                            </button>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                              onClick={() => handleDelete(c.id)}
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
                    placeholder="اسم العميل"
                    required
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>الهاتف <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="٠١٢٣٤٥٦٧٨٩٠"
                    dir="ltr"
                    required
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>البريد</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    dir="ltr"
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
