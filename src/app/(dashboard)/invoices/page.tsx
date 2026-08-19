'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import type { Invoice } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

const statusChips: Record<string, { label: string; chip: string }> = {
  draft: { label: 'مسودة', chip: styles.chipMuted },
  final: { label: 'نهائية', chip: styles.chipGreen },
  paid: { label: 'مدفوعة', chip: styles.chipGreen },
  partial: { label: 'جزئية', chip: styles.chipOrange },
  cancelled: { label: 'ملغاة', chip: styles.chipRed },
}

interface Line {
  name: string
  qty: string
  price: string
}

const emptyLine: Line = { name: '', qty: '1', price: '' }

export default function InvoicesPage() {
  const { companyId } = useAuth()
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'purchase'>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const [modalOpen, setModalOpen] = useState(false)
  const [invType, setInvType] = useState<'sale' | 'purchase'>('sale')
  const [customer, setCustomer] = useState('')
  const [lines, setLines] = useState<Line[]>([emptyLine])
  const [paid, setPaid] = useState('')
  const [status, setStatus] = useState('مسودة')

  useEffect(() => {
    if (!companyId) return
    let cancelled = false

    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (typeFilter !== 'all') params.set('type', typeFilter)

    apiClient<Invoice[]>(`/invoices?${params}`)
      .then((res) => {
        if (cancelled) return
        if (res.success && res.data) {
          setInvoices(res.data ?? [])
          setPagination(res.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load invoices') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyId, page, typeFilter])

  const openNew = () => {
    setInvType('sale')
    setCustomer('')
    setLines([emptyLine])
    setPaid('')
    setStatus('مسودة')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    closeModal()
    toast('تم الحفظ بنجاح', 'success')
  }

  const handleDelete = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    toast('تم الحذف', 'success')
  }

  const handleView = (inv: Invoice) => {
    toast(`عرض الفاتورة ${inv.invoice_number}`)
  }

  const updateLine = (index: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  const lineTotal = (l: Line): number => (Number(l.qty) || 0) * (Number(l.price) || 0)
  const grandTotal = lines.reduce((sum, l) => sum + lineTotal(l), 0)

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>الفواتير</h1>
          <p>فواتير البيع والشراء ومواقف مدفوعاتها</p>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
          <Icon name="plus" size={18} />
          فاتورة جديدة
        </button>
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.tabGroup}>
            {(['all', 'sale', 'purchase'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tabBtn} ${typeFilter === t ? styles.tabBtnActive : ''}`}
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

        {!loading && error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && invoices.length === 0 && (
          <div className={`${styles.card} ${styles.emptyState}`}>
            <span className={styles.emptyIcon}>
              <Icon name="doc" size={30} />
            </span>
            <h3>لا توجد فواتير بعد</h3>
            <p>أنشئ فاتورة بيع أو شراء جديدة لإدارة مدفوعاتك</p>
          </div>
        )}

        {!loading && !error && invoices.length > 0 && (
          <div className={styles.card}>
            <div className={styles.tableScroll}>
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
                    const status = statusChips[inv.status] || statusChips.draft
                    return (
                      <tr key={inv.id}>
                        <td className={styles.invoiceNumber}>{inv.invoice_number}</td>
                        <td>
                          <span className={`${styles.chip} ${inv.type === 'sale' ? styles.chipGreen : styles.chipOrange}`}>
                            {inv.type === 'sale' ? 'بيع' : 'شراء'}
                          </span>
                        </td>
                        <td>{inv.customer_name || '-'}</td>
                        <td className={styles.numCell}>{inv.total.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>{inv.paid_amount.toLocaleString('ar-EG')} ج.م</td>
                        <td>
                          <span className={`${styles.chip} ${status.chip}`}>{status.label}</span>
                        </td>
                        <td className={styles.dateCell}>
                          {new Date(inv.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td>
                          <div className={styles.cellActions}>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                              onClick={() => handleView(inv)}
                            >
                              عرض
                            </button>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                              onClick={() => handleDelete(inv.id)}
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
          <form className={`${styles.modal} ${styles.modalWide}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <header className={styles.modalHead}>
              <h2>فاتورة جديدة</h2>
              <button type="button" className={styles.iconBtn} onClick={closeModal} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segBtn} ${invType === 'sale' ? styles.segBtnActive : ''}`}
                  onClick={() => setInvType('sale')}
                >
                  بيع
                </button>
                <button
                  type="button"
                  className={`${styles.segBtn} ${invType === 'purchase' ? styles.segBtnActive : ''}`}
                  onClick={() => setInvType('purchase')}
                >
                  شراء
                </button>
              </div>

              <div className={styles.field}>
                <label>العميل <span className={styles.req}>*</span></label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="اسم العميل"
                  required
                />
              </div>

              <div className={styles.lines}>
                <div className={styles.lineHead}>
                  <span>اسم المنتج</span><span>الكمية</span><span>السعر</span><span>الإجمالي</span>
                </div>
                {lines.map((line, i) => (
                  <div className={styles.lineRow} key={i}>
                    <input
                      type="text"
                      placeholder="اسم المنتج"
                      value={line.name}
                      onChange={(e) => updateLine(i, { name: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.qty}
                      inputMode="numeric"
                      value={line.qty}
                      onChange={(e) => updateLine(i, { qty: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.price}
                      inputMode="numeric"
                      placeholder="٠"
                      value={line.price}
                      onChange={(e) => updateLine(i, { price: e.target.value })}
                    />
                    <span className={styles.lineTotal}>
                      {lineTotal(line).toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                onClick={() => setLines((prev) => [...prev, { ...emptyLine }])}
              >
                <Icon name="plus" size={15} />
                إضافة سطر
              </button>

              <div className={styles.invSummary}>
                <span>الإجمالي</span>
                <b>{grandTotal.toLocaleString('ar-EG')} ج.م</b>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>المدفوع (ج.م)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={paid}
                    onChange={(e) => setPaid(e.target.value)}
                    placeholder="٠"
                  />
                </div>
                <div className={styles.field}>
                  <label>الحالة</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>مسودة</option>
                    <option>نهائية</option>
                    <option>مدفوعة</option>
                    <option>جزئية</option>
                    <option>ملغاة</option>
                  </select>
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
