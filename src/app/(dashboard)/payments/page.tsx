'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import type { Payment, InvoiceListItem } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

export default function PaymentsPage() {
  const { companyId } = useAuth()
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoiceList, setInvoiceList] = useState<InvoiceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'received' | 'made'>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const [modalOpen, setModalOpen] = useState(false)
  const [payType, setPayType] = useState<'received' | 'made'>('received')
  const [amount, setAmount] = useState('')
  const [payInvoice, setPayInvoice] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!companyId) return
    let cancelled = false

    if (typeFilter === 'made') {
      Promise.resolve().then(() => {
        if (cancelled) return
        setPayments([])
        setPagination({ total: 0, pages: 0 })
        setLoading(false)
      })
      return () => { cancelled = true }
    }

    const params = new URLSearchParams({ page: String(page), limit: '20' })

    apiClient<InvoiceListItem[]>(`/invoices?${params}`)
      .then((res) => {
        if (cancelled) return
        if (res.success && res.data) {
          setInvoiceList(res.data ?? [])
          const flat: Payment[] = []
          for (const inv of res.data ?? []) {
            for (const p of inv.payments ?? []) {
              flat.push({
                id: p.id,
                amount: Number(p.amount),
                type: 'received',
                customer_id: inv.customer_id,
                customer_name: inv.customers?.name,
                invoice_id: p.invoice_id,
                notes: p.notes,
                company_id: inv.company_id,
                created_at: p.created_at,
              })
            }
          }
          setPayments(flat)
          setPagination(res.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load payments') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyId, page, typeFilter])

  const openNew = () => {
    setPayType('received')
    setAmount('')
    setPayInvoice('')
    setNotes('')
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

  const selectedInvoice = invoiceList.find((i) => i.id === payInvoice)

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>المدفوعات</h1>
          <p>المبالغ المستلمة والمدفوعة المرتبطة بفواتيرك</p>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNew}>
          <Icon name="plus" size={18} />
          دفعة جديدة
        </button>
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.tabGroup}>
            {(['all', 'received', 'made'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tabBtn} ${typeFilter === t ? styles.tabBtnActive : ''}`}
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

        {!loading && error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && payments.length === 0 && (
          <div className={`${styles.card} ${styles.emptyState}`}>
            <span className={styles.emptyIcon}>
              <Icon name="wallet" size={30} />
            </span>
            <h3>لا توجد مدفوعات بعد</h3>
            <p>تظهر هنا المدفوعات المرتبطة بفواتيرك</p>
          </div>
        )}

        {!loading && !error && payments.length > 0 && (
          <div className={styles.card}>
            <div className={styles.tableScroll}>
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
                        <span className={`${styles.chip} ${p.type === 'received' ? styles.chipGreen : styles.chipOrange}`}>
                          {p.type === 'received' ? 'مستلمة' : 'مدفوعة'}
                        </span>
                      </td>
                      <td>{p.customer_name || '-'}</td>
                      <td className={styles.invoiceNumber}>{p.invoice_id ? p.invoice_id.slice(0, 8) : '-'}</td>
                      <td className={styles.notesCell}>{p.notes || '-'}</td>
                      <td className={styles.dateCell}>
                        {new Date(p.created_at).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
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
              <h2>دفعة جديدة</h2>
              <button type="button" className={styles.iconBtn} onClick={closeModal} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segBtn} ${payType === 'received' ? styles.segBtnActive : ''}`}
                  onClick={() => setPayType('received')}
                >
                  مستلمة
                </button>
                <button
                  type="button"
                  className={`${styles.segBtn} ${payType === 'made' ? styles.segBtnActive : ''}`}
                  onClick={() => setPayType('made')}
                >
                  مدفوعة
                </button>
              </div>

              <div className={styles.field}>
                <label>المبلغ (ج.م) <span className={styles.req}>*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="٠"
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>العميل <span className={styles.req}>*</span></label>
                  <input
                    type="text"
                    value={selectedInvoice?.customers?.name ?? ''}
                    onChange={() => {}}
                    placeholder="اسم العميل"
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label>الفاتورة</label>
                  <select value={payInvoice} onChange={(e) => setPayInvoice(e.target.value)}>
                    <option value="">اختر الفاتورة</option>
                    {invoiceList.map((inv) => (
                      <option key={inv.id} value={inv.id}>{inv.invoice_number}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>ملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: تسوية فاتورة"
                />
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
