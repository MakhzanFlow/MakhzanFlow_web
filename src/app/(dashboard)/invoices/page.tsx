'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import Icon from '@/components/Icon'
import { useToast } from '@/components/Toast'
import type { Invoice, InvoiceStatus, Product, Customer } from '@/lib/types'
import styles from '../dashboard/dashboard.module.css'

const statusLabels: Record<InvoiceStatus, { label: string; chip: string }> = {
  pending: { label: 'معلقة', chip: styles.chipMuted },
  paid: { label: 'مدفوعة', chip: styles.chipGreen },
  partially_paid: { label: 'جزئية', chip: styles.chipOrange },
  canceled: { label: 'ملغاة', chip: styles.chipRed },
}

const statusTabs: ('all' | InvoiceStatus)[] = ['all', 'pending', 'paid', 'partially_paid', 'canceled']
const statusTabLabels: Record<string, string> = {
  all: 'الكل',
  pending: 'معلقة',
  paid: 'مدفوعة',
  partially_paid: 'جزئية',
  canceled: 'ملغاة',
}

const methodLabels: Record<string, string> = {
  cash: 'نقدي',
  card: 'بطاقة',
  bank_transfer: 'تحويل بنكي',
  other: 'أخرى',
}

interface LineItem {
  productId: string
  productName: string
  qty: string
  price: string
}

const emptyLine: LineItem = { productId: '', productName: '', qty: '1', price: '' }

export default function InvoicesPage() {
  const { companyId, hasPermission } = useAuth()
  const { toast } = useToast()

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customerFilterId, setCustomerFilterId] = useState('')
  const [customerFilterName, setCustomerFilterName] = useState('')
  const [customerFilterQuery, setCustomerFilterQuery] = useState('')
  const [customerFilterResults, setCustomerFilterResults] = useState<Customer[]>([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  const canCreate = hasPermission('invoices.create')
  const canUpdate = hasPermission('invoices.update')
  const canCancel = hasPermission('invoices.cancel')

  const fetchInvoices = useCallback(() => {
    if (!companyId) return
    let cancelled = false
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)
    if (customerFilterId) params.set('customer_id', customerFilterId)

    apiClient<Invoice[]>(`/invoices?${params}`)
      .then((res) => {
        if (cancelled) return
        setError('')
        if (res.success && res.data) {
          setInvoices(res.data ?? [])
          setPagination(res.pagination ?? { total: 0, pages: 0 })
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load invoices') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [companyId, page, search, statusFilter, startDate, endDate, customerFilterId])

  useEffect(() => {
    const cleanup = fetchInvoices()
    return () => { cleanup?.() }
  }, [fetchInvoices])

  useEffect(() => {
    if (!companyId || customerFilterQuery.length < 1) return
    let cancelled = false
    apiClient<Customer[]>(`/customers?limit=10&search=${encodeURIComponent(customerFilterQuery)}`)
      .then((res) => { if (!cancelled && res.success) setCustomerFilterResults(res.data ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [companyId, customerFilterQuery])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setStartDate('')
    setEndDate('')
    setCustomerFilterId('')
    setCustomerFilterName('')
    setCustomerFilterQuery('')
    setPage(1)
  }

  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({
    customerId: '', customerName: '',
    lines: [{ ...emptyLine }] as LineItem[],
    discount: '', tax: '', dueDate: '',
    paymentAmount: '', paymentMethod: 'cash', paymentRef: '', paymentNotes: '',
    saving: false, error: '',
  })

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [payTarget, setPayTarget] = useState<Invoice | null>(null)
  const [payForm, setPayForm] = useState({ amount: '', method: 'cash', ref: '', notes: '', saving: false })

  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const [customerPickerOpen, setCustomerPickerOpen] = useState(false)
  const [productPickerOpen, setProductPickerOpen] = useState(false)
  const [productPickerLine, setProductPickerLine] = useState(0)

  const openCreate = () => {
    setForm({
      customerId: '', customerName: '',
      lines: [{ ...emptyLine }],
      discount: '', tax: '', dueDate: '',
      paymentAmount: '', paymentMethod: 'cash', paymentRef: '', paymentNotes: '',
      saving: false, error: '',
    })
    setCreateOpen(true)
  }

  const closeCreate = () => setCreateOpen(false)

  const updateLine = (index: number, patch: Partial<LineItem>) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }))
  }

  const openProductPicker = (lineIndex: number) => {
    setProductPickerLine(lineIndex)
    setProductPickerOpen(true)
  }

  const selectProduct = (product: Product) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) =>
        i === productPickerLine
          ? { ...l, productId: product.id, productName: product.name, price: String(product.price) }
          : l
      ),
    }))
    setProductPickerOpen(false)
  }

  const lineTotal = (l: LineItem): number => (Number(l.qty) || 0) * (Number(l.price) || 0)
  const subtotal = form.lines.reduce((sum, l) => sum + lineTotal(l), 0)
  const discountNum = parseFloat(form.discount) || 0
  const taxNum = parseFloat(form.tax) || 0
  const grandTotal = Math.max(0, subtotal - discountNum + taxNum)

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    const validLines = form.lines.filter((l) => l.productId)
    if (validLines.length === 0) {
      setForm((prev) => ({ ...prev, error: 'أضف منتج واحد على الأقل' }))
      return
    }
    setForm((prev) => ({ ...prev, saving: true, error: '' }))
    try {
      const payload: Record<string, unknown> = {
        items: validLines.map((l) => ({
          product_id: l.productId,
          quantity: Number(l.qty) || 1,
          unit_price: Number(l.price) || 0,
        })),
      }
      if (form.customerId) payload.customer_id = form.customerId
      if (discountNum > 0) payload.discount_amount = discountNum
      if (taxNum > 0) payload.tax_amount = taxNum
      if (form.dueDate) payload.due_date = form.dueDate
      if (form.paymentAmount && Number(form.paymentAmount) > 0) {
        payload.payment = {
          amount: Number(form.paymentAmount),
          method: form.paymentMethod,
          reference_number: form.paymentRef || null,
          notes: form.paymentNotes || null,
        }
      }
      const data = await apiClient<Invoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!data.success) throw new Error(data.message || 'Failed to create invoice')
      if (data.data) setInvoices((prev) => [data.data!, ...prev])
      toast('تم إنشاء الفاتورة بنجاح', 'success')
      closeCreate()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('stock') || msg.includes('Stock')) {
        setForm((prev) => ({ ...prev, error: 'لا يوجد مخزون كافٍ لبعض المنتجات' }))
      } else if (msg.includes('permission') || msg.includes('Forbidden') || msg.includes('403')) {
        setForm((prev) => ({ ...prev, error: 'لا تملك صلاحية لإنشاء فاتورة' }))
      } else {
        setForm((prev) => ({ ...prev, error: msg }))
      }
    } finally {
      setForm((prev) => ({ ...prev, saving: false }))
    }
  }

  const openDetail = async (invoice: Invoice) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const data = await apiClient<Invoice>(`/invoices/${invoice.id}`)
      if (data.success && data.data) setDetailInvoice(data.data)
      else setDetailInvoice(invoice)
    } catch {
      setDetailInvoice(invoice)
    } finally {
      setDetailLoading(false)
    }
  }

  const openPayment = (invoice: Invoice) => {
    setPayTarget(invoice)
    const totalPaid = (invoice.payments ?? []).reduce((s, p) => s + p.amount, 0)
    const remaining = Math.max(0, invoice.total_amount - totalPaid)
    setPayForm({ amount: String(remaining), method: 'cash', ref: '', notes: '', saving: false })
    setPaymentOpen(true)
  }

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault()
    if (!payTarget) return
    setPayForm((p) => ({ ...p, saving: true }))
    try {
      const data = await apiClient<Invoice>(`/invoices/${payTarget.id}/payments`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(payForm.amount),
          method: payForm.method,
          reference_number: payForm.ref || null,
          notes: payForm.notes || null,
        }),
      })
      if (!data.success) throw new Error(data.message || 'Failed to add payment')
      if (data.data) {
        setInvoices((prev) => prev.map((inv) => inv.id === payTarget.id ? { ...inv, ...data.data! } : inv))
      }
      toast('تم إضافة الدفعة بنجاح', 'success')
      setPaymentOpen(false)
      setPayTarget(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('already paid') || msg.includes('fully paid')) {
        toast('الفاتورة مدفوعة بالكامل', 'error')
      } else if (msg.includes('exceeds') || msg.includes('remaining')) {
        toast('المبلغ يتجاوز المتبقي', 'error')
      } else if (msg.includes('canceled')) {
        toast('لا يمكن الدفع لفاتورة ملغاة', 'error')
      } else {
        toast(msg, 'error')
      }
    } finally {
      setPayForm((p) => ({ ...p, saving: false }))
    }
  }

  const handleCancel = async () => {
    if (!cancelId) return
    setCancelling(true)
    try {
      const data = await apiClient<Invoice>(`/invoices/${cancelId}/cancel`, { method: 'POST' })
      if (!data.success) throw new Error(data.message || 'Failed to cancel invoice')
      if (data.data) {
        setInvoices((prev) => prev.map((inv) => inv.id === cancelId ? { ...inv, ...data.data! } : inv))
      }
      toast('تم إلغاء الفاتورة', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ'
      if (msg.includes('already canceled')) {
        toast('الفاتورة ملغاة بالفعل', 'error')
      } else if (msg.includes('permission') || msg.includes('Forbidden') || msg.includes('403')) {
        toast('لا تملك صلاحية لإلغاء الفاتورة', 'error')
      } else {
        toast(msg, 'error')
      }
    } finally {
      setCancelling(false)
      setCancelId(null)
    }
  }

  const computedPaid = (inv: Invoice): number => (inv.payments ?? []).reduce((s, p) => s + p.amount, 0)

  return (
    <div className={styles.screen}>
      <header className={styles.screenHead}>
        <div>
          <h1>الفواتير</h1>
          <p>فواتير البيع ومدفوعاتها</p>
        </div>
        {canCreate && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openCreate}>
            <Icon name="plus" size={18} />
            فاتورة جديدة
          </button>
        )}
      </header>

      <div className={styles.screenBody}>
        <div className={styles.toolbar}>
          <div className={styles.tabGroup}>
            {statusTabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tabBtn} ${statusFilter === t ? styles.tabBtnActive : ''}`}
                onClick={() => { setStatusFilter(t); setPage(1) }}
              >
                {statusTabLabels[t]}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <Icon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="بحث برقم الفاتورة..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
            className={styles.dateInput}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
            className={styles.dateInput}
          />
          <div className={styles.search} style={{ position: 'relative', minWidth: 180 }}>
            <Icon name="people" size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="فلتر بالعميل..."
              value={customerFilterName || customerFilterQuery}
              onChange={(e) => {
                setCustomerFilterQuery(e.target.value)
                setCustomerFilterName('')
                setCustomerFilterId('')
                setPage(1)
              }}
            />
            {customerFilterQuery && !customerFilterId && customerFilterResults.length > 0 && (
              <div className={styles.selectList}>
                {customerFilterResults.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={styles.selectItem}
                    onClick={() => {
                      setCustomerFilterId(c.id)
                      setCustomerFilterName(c.name)
                      setCustomerFilterQuery('')
                      setPage(1)
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {(customerFilterId || startDate || endDate || search || statusFilter !== 'all') && (
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={resetFilters}>
              مسح الفلاتر
            </button>
          )}
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
            <p>أنشئ فاتورة بيع جديدة لإدارة مبيعاتك</p>
          </div>
        )}

        {!loading && !error && invoices.length > 0 && (
          <div className={styles.card}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>رقم الفاتورة</th>
                    <th>العميل</th>
                    <th>الإجمالي</th>
                    <th>المدفوع</th>
                    <th>المتبقي</th>
                    <th>الحالة</th>
                    <th>الاستحقاق</th>
                    <th>التاريخ</th>
                    {(canUpdate || canCancel) && <th>إجراءات</th>}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const paid = computedPaid(inv)
                    const remaining = Math.max(0, inv.total_amount - paid)
                    const status = statusLabels[inv.status] ?? statusLabels.pending
                    return (
                      <tr key={inv.id} className={inv.status === 'pending' ? styles.rowAlert : ''}>
                        <td className={styles.invoiceNumber}>{inv.invoice_number}</td>
                        <td>{inv.customers?.name ?? '—'}</td>
                        <td className={styles.numCell}>{inv.total_amount.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>{paid.toLocaleString('ar-EG')} ج.م</td>
                        <td className={styles.numCell}>{remaining.toLocaleString('ar-EG')} ج.م</td>
                        <td><span className={`${styles.chip} ${status.chip}`}>{status.label}</span></td>
                        <td className={styles.dateCell}>
                          {inv.due_date ? new Date(inv.due_date).toLocaleDateString('ar-EG') : '—'}
                        </td>
                        <td className={styles.dateCell}>
                          {inv.created_at ? new Date(inv.created_at).toLocaleDateString('ar-EG') : '—'}
                        </td>
                        {(canUpdate || canCancel) && (
                          <td>
                            <div className={styles.cellActions}>
                              <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => openDetail(inv)}>
                                عرض
                              </button>
                              {canUpdate && inv.status !== 'paid' && inv.status !== 'canceled' && (
                                <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => openPayment(inv)}>
                                  دفعة
                                </button>
                              )}
                              {canCancel && inv.status !== 'canceled' && (
                                <button type="button" className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => setCancelId(inv.id)}>
                                  إلغاء
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
                <button type="button" className={styles.pg} disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <Icon name="chevRight" size={16} /> السابق
                </button>
                <span className={styles.count}>{page.toLocaleString('ar-EG')} / {pagination.pages.toLocaleString('ar-EG')}</span>
                <button type="button" className={styles.pg} disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
                  التالي <Icon name="chevLeft" size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {createOpen && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={closeCreate}>
          <form className={`${styles.modal} ${styles.modalWide}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <header className={styles.modalHead}>
              <h2>فاتورة جديدة</h2>
              <button type="button" className={styles.iconBtn} onClick={closeCreate} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              {form.error && <div className={styles.errorBox}>{form.error}</div>}

              <div className={styles.field}>
                <label>العميل</label>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'right' }}
                  onClick={() => setCustomerPickerOpen(true)}
                >
                  <Icon name="people" size={16} />
                  {form.customerName || 'اختيار عميل (اختياري)'}
                </button>
                {form.customerId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 13 }}>
                    <span className={`${styles.chip} ${styles.chipGreen}`}>{form.customerName}</span>
                    <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setForm((prev) => ({ ...prev, customerId: '', customerName: '' }))}>
                      إزالة
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.lines}>
                <div className={styles.lineHead}>
                  <span>المنتج</span><span>الكمية</span><span>السعر</span><span>الإجمالي</span>
                </div>
                {form.lines.map((line, i) => (
                  <div className={styles.lineRow} key={i}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                      style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onClick={() => openProductPicker(i)}
                    >
                      {line.productName || 'اختر منتج'}
                    </button>
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
                onClick={() => setForm((prev) => ({ ...prev, lines: [...prev.lines, { ...emptyLine }] }))}
              >
                <Icon name="plus" size={15} /> إضافة سطر
              </button>

              <div className={styles.invSummary}>
                <span>الإجمالي</span>
                <b>{grandTotal.toLocaleString('ar-EG')} ج.م</b>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>الخصم (ج.م)</label>
                  <input type="text" inputMode="decimal" value={form.discount} onChange={(e) => setForm((prev) => ({ ...prev, discount: e.target.value }))} placeholder="٠" />
                </div>
                <div className={styles.field}>
                  <label>الضريبة (ج.م)</label>
                  <input type="text" inputMode="decimal" value={form.tax} onChange={(e) => setForm((prev) => ({ ...prev, tax: e.target.value }))} placeholder="٠" />
                </div>
                <div className={styles.field}>
                  <label>تاريخ الاستحقاق</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
                </div>
              </div>

              <div className={styles.field}>
                <label>الدفع المبدئي (اختياري)</label>
                <div className={styles.formGrid}>
                  <input type="text" inputMode="decimal" value={form.paymentAmount} onChange={(e) => setForm((prev) => ({ ...prev, paymentAmount: e.target.value }))} placeholder="المبلغ" />
                  <select value={form.paymentMethod} onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}>
                    <option value="cash">نقدي</option>
                    <option value="card">بطاقة</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={closeCreate} disabled={form.saving}>إلغاء</button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${form.saving ? styles.isPending : ''}`} disabled={form.saving}>
                <span className={styles.spinner} />
                {form.saving ? 'جاري الإنشاء...' : 'إنشاء الفاتورة'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {detailOpen && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={() => setDetailOpen(false)}>
          <div className={`${styles.modal} ${styles.modalWide}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHead}>
              <h2>تفاصيل الفاتورة</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setDetailOpen(false)} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              {detailLoading ? (
                <div className={styles.loading}><div className={styles.spinner} /></div>
              ) : detailInvoice ? (
                <>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>رقم الفاتورة</label>
                      <input type="text" value={detailInvoice.invoice_number} readOnly />
                    </div>
                    <div className={styles.field}>
                      <label>الحالة</label>
                      <input type="text" value={statusLabels[detailInvoice.status]?.label ?? detailInvoice.status} readOnly />
                    </div>
                    <div className={styles.field}>
                      <label>العميل</label>
                      <input type="text" value={detailInvoice.customers?.name ?? 'عميل عام'} readOnly />
                    </div>
                    <div className={styles.field}>
                      <label>تاريخ الإنشاء</label>
                      <input type="text" value={detailInvoice.created_at ? new Date(detailInvoice.created_at).toLocaleDateString('ar-EG') : '—'} readOnly />
                    </div>
                  </div>

                  {detailInvoice.invoice_items && detailInvoice.invoice_items.length > 0 && (
                    <>
                      <h3 style={{ margin: '8px 0', fontSize: 14, fontWeight: 700 }}>الأصناف</h3>
                      <div className={styles.tableScroll}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>المنتج</th>
                              <th>الكمية</th>
                              <th>السعر</th>
                              <th>الإجمالي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailInvoice.invoice_items.map((item) => (
                              <tr key={item.id}>
                                <td>{item.products.name}</td>
                                <td className={styles.numCell}>{item.quantity}</td>
                                <td className={styles.numCell}>{item.unit_price.toLocaleString('ar-EG')} ج.م</td>
                                <td className={styles.numCell}>{item.total_price.toLocaleString('ar-EG')} ج.م</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <div className={styles.invSummary}>
                    <span>الإجمالي</span>
                    <b>{detailInvoice.total_amount.toLocaleString('ar-EG')} ج.م</b>
                  </div>

                  {(detailInvoice.payments ?? []).length > 0 && (
                    <>
                      <h3 style={{ margin: '8px 0', fontSize: 14, fontWeight: 700 }}>المدفوعات</h3>
                      <div className={styles.tableScroll}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>المبلغ</th>
                              <th>الطريقة</th>
                              <th>المرجع</th>
                              <th>التاريخ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(detailInvoice.payments ?? []).map((p) => (
                              <tr key={p.id}>
                                <td className={styles.numCell}>{p.amount.toLocaleString('ar-EG')} ج.م</td>
                                <td>{methodLabels[p.method] ?? p.method}</td>
                                <td className={styles.muted}>{p.reference_number || '—'}</td>
                                <td className={styles.dateCell}>
                                  {p.created_at ? new Date(p.created_at).toLocaleDateString('ar-EG') : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setDetailOpen(false)}>إغلاق</button>
            </footer>
          </div>
        </div>
      )}

      {paymentOpen && payTarget && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={() => { setPaymentOpen(false); setPayTarget(null) }}>
          <form className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handlePayment}>
            <header className={styles.modalHead}>
              <h2>إضافة دفعة — {payTarget.invoice_number}</h2>
              <button type="button" className={styles.iconBtn} onClick={() => { setPaymentOpen(false); setPayTarget(null) }} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <div className={styles.invSummary}>
                <span>المتبقي</span>
                <b>{Math.max(0, payTarget.total_amount - computedPaid(payTarget)).toLocaleString('ar-EG')} ج.م</b>
              </div>
              <div className={styles.field}>
                <label>المبلغ (ج.م) <span className={styles.req}>*</span></label>
                <input type="text" inputMode="decimal" value={payForm.amount} onChange={(e) => setPayForm((p) => ({ ...p, amount: e.target.value }))} required />
              </div>
              <div className={styles.field}>
                <label>الطريقة</label>
                <select value={payForm.method} onChange={(e) => setPayForm((p) => ({ ...p, method: e.target.value }))}>
                  <option value="cash">نقدي</option>
                  <option value="card">بطاقة</option>
                  <option value="bank_transfer">تحويل بنكي</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>رقم المرجع</label>
                <input type="text" value={payForm.ref} onChange={(e) => setPayForm((p) => ({ ...p, ref: e.target.value }))} placeholder="اختياري" />
              </div>
              <div className={styles.field}>
                <label>ملاحظات</label>
                <input type="text" value={payForm.notes} onChange={(e) => setPayForm((p) => ({ ...p, notes: e.target.value }))} placeholder="اختياري" />
              </div>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => { setPaymentOpen(false); setPayTarget(null) }} disabled={payForm.saving}>إلغاء</button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${payForm.saving ? styles.isPending : ''}`} disabled={payForm.saving}>
                <span className={styles.spinner} />
                {payForm.saving ? 'جاري الحفظ...' : 'حفظ الدفعة'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {cancelId && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={() => setCancelId(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHead}>
              <h2>تأكيد إلغاء الفاتورة</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setCancelId(null)} aria-label="إغلاق">
                <Icon name="close" size={19} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <p>هل أنت متأكد من إلغاء هذه الفاتورة؟ سيتم إعادة المنتجات للمخزون.</p>
            </div>
            <footer className={styles.modalFoot}>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setCancelId(null)} disabled={cancelling}>إلغاء</button>
              <button type="button" className={`${styles.btn} ${styles.btnDanger} ${cancelling ? styles.isPending : ''}`} onClick={handleCancel} disabled={cancelling}>
                <span className={styles.spinner} />
                {cancelling ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {customerPickerOpen && (
        <CustomerPickerModal
          companyId={companyId}
          onSelect={(c) => {
            setForm((prev) => ({ ...prev, customerId: c.id, customerName: c.name }))
            setCustomerPickerOpen(false)
          }}
          onClose={() => setCustomerPickerOpen(false)}
        />
      )}

      {productPickerOpen && (
        <ProductPickerModal
          companyId={companyId}
          onSelect={selectProduct}
          onClose={() => setProductPickerOpen(false)}
        />
      )}
    </div>
  )
}

function CustomerPickerModal({ companyId, onSelect, onClose }: { companyId: string | null; onSelect: (c: Customer) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Customer[]>([])

  useEffect(() => {
    if (!companyId || query.length < 1) return
    let cancelled = false
    apiClient<Customer[]>(`/customers?limit=20&search=${encodeURIComponent(query)}`)
      .then((res) => { if (!cancelled && res.success) setResults(res.data ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [companyId, query])

  return (
    <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <h2>اختيار عميل</h2>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="إغلاق">
            <Icon name="close" size={19} />
          </button>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.search}>
            <Icon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="بحث بالاسم أو رقم الهاتف..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          {query.length >= 1 && results.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>لا توجد نتائج</p>
          )}
          {results.length > 0 && (
            <div className={styles.card} style={{ maxHeight: 400, overflow: 'auto' }}>
              {results.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  style={{ width: '100%', textAlign: 'right', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, borderBottom: '1px solid var(--border)' }}
                  onClick={() => onSelect(c)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    {c.phone && <div style={{ fontSize: 13, color: 'var(--muted)', direction: 'ltr', textAlign: 'right' }}>{c.phone}</div>}
                  </div>
                  {c.current_debt > 0 && (
                    <span className={`${styles.chip} ${styles.chipRed}`}>{c.current_debt.toLocaleString('ar-EG')} ج.م</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductPickerModal({ companyId, onSelect, onClose }: { companyId: string | null; onSelect: (p: Product) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    if (!companyId || query.length < 1) return
    let cancelled = false
    apiClient<Product[]>(`/products?limit=20&search=${encodeURIComponent(query)}`)
      .then((res) => { if (!cancelled && res.success) setResults(res.data ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [companyId, query])

  return (
    <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <h2>اختيار منتج</h2>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="إغلاق">
            <Icon name="close" size={19} />
          </button>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.search}>
            <Icon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="بحث بالاسم أو الكود..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          {query.length >= 1 && results.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>لا توجد نتائج</p>
          )}
          {results.length > 0 && (
            <div className={styles.card} style={{ maxHeight: 400, overflow: 'auto' }}>
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={!p.is_active || p.stock < 1}
                  style={{ width: '100%', textAlign: 'right', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: p.is_active && p.stock >= 1 ? 'pointer' : 'not-allowed', borderRadius: 12, opacity: p.is_active && p.stock >= 1 ? 1 : 0.5, borderBottom: '1px solid var(--border)' }}
                  onClick={() => { if (p.is_active && p.stock >= 1) onSelect(p) }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{p.price.toLocaleString('ar-EG')} ج.م</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, color: p.stock > 0 ? 'var(--accent)' : 'var(--red)' }}>مخزون: {p.stock}</div>
                    {p.sku && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.sku}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
