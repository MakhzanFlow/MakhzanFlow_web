'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useId } from 'react'
import styles from './page.module.css'

const deletionNotes = [
  'نراجع الطلب خلال 48 ساعة',
  'نرسل تأكيد الحذف على بريدك',
  'نحذف بيانات الشركات والفواتير والمخزون',
]

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const emailId = useId()
  const reasonId = useId()
  const detailsId = useId()
  const confirmId = useId()

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  const canSubmit = isEmailValid(email) && confirmed && !loading

  function handleEmailChange(v: string) {
    setEmail(v)
    if (emailError && isEmailValid(v)) setEmailError(false)
  }

  function handleEmailBlur() {
    if (email.trim() && !isEmailValid(email)) setEmailError(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      if (!isEmailValid(email)) setEmailError(true)
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('email', email.trim())
    formData.append('reason', reason)
    formData.append('details', details)
    formData.append('confirm', 'confirmed')
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')

    try {
      const res = await fetch('https://formsubmit.co/haazemsaidd@gmail.com', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Network error')
      setSuccess(true)
    } catch {
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى أو إرسال بريد إلكتروني مباشر إلى haazemsaidd@gmail.com')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageWrap}>
      {/* Header */}
      <header className={styles.siteHeader}>
        <Link href="/" className={styles.logo}>
          <Image src="/logos/stockflow-logo.png" alt="StockFlow" width={110} height={36} priority />
        </Link>
        <Link href="/" className={styles.backLink}>← العودة إلى الرئيسية</Link>
      </header>

      {/* Main */}
      <main className={styles.deletePage}>
        <section className={styles.heroPanel} aria-labelledby="delete-title">
          <span className={styles.kicker}>إدارة الحساب</span>
          <h1 id="delete-title">طلب حذف حساب StockFlow</h1>
          <p>نعامل حذف الحساب كإجراء حساس، لذلك نحتاج بريدك وتأكيدك الصريح قبل بدء المعالجة. الهدف هنا واضح: حماية بياناتك، وليس تعقيد الطريق عليك.</p>
          <div className={styles.noteStack}>
            {deletionNotes.map((note) => (
              <div key={note} className={styles.noteItem}>
                <span aria-hidden="true" />
                {note}
              </div>
            ))}
          </div>
          <div className={styles.contactStrip}>
            <span>تحتاج مساعدة؟</span>
            <a href="mailto:haazemsaidd@gmail.com">haazemsaidd@gmail.com</a>
          </div>
        </section>

        <section className={styles.deleteCard} aria-label="نموذج حذف الحساب">
          <div className={styles.deleteCardInner}>

          {/* Warning banner */}
          <div className={styles.warningBanner} role="alert">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <h2>هذا الإجراء نهائي ولا يمكن التراجع عنه</h2>
              <p>عند حذف حسابك، سيتم حذف جميع بياناتك بشكل دائم بما في ذلك: بيانات الشركة، المنتجات، العملاء، الفواتير، التقارير، وصلاحيات الفريق. لا يمكن استرجاع أي من هذه البيانات بعد الحذف.</p>
            </div>
          </div>

          {/* Form or success */}
          {!success ? (
            <div className={`${styles.formWrap}${success ? ` ${styles.hidden}` : ''}`} id="formWrap">
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor={emailId}>
                    البريد الإلكتروني <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id={emailId}
                    name="email"
                    className={`${styles.formInput}${emailError ? ` ${styles.error}` : ''}`}
                    placeholder="example@domain.com"
                    required
                    autoComplete="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={handleEmailBlur}
                    onFocus={() => setEmailError(false)}
                  />
                  <div className={`${styles.formErrorMsg}${emailError ? ` ${styles.visible}` : ''}`} role="alert">
                    يرجى إدخال بريد إلكتروني صالح
                  </div>
                </div>

                {/* Reason */}
                <div className={styles.formGroup}>
                  <label htmlFor={reasonId}>
                    سبب الحذف <span className={styles.optionalLabel}>(اختياري)</span>
                  </label>
                  <select
                    id={reasonId}
                    name="reason"
                    className={styles.formSelect}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">— اختر سبباً —</option>
                    <option value="no-longer-need">لم أعد أحتاج التطبيق</option>
                    <option value="too-expensive">الأسعار مرتفعة</option>
                    <option value="missing-features">ينقصني ميزات مهمة</option>
                    <option value="switching">انتقلت إلى تطبيق آخر</option>
                    <option value="privacy">مخاوف تتعلق بالخصوصية</option>
                    <option value="other">سبب آخر</option>
                  </select>
                </div>

                {/* Details */}
                <div className={styles.formGroup}>
                  <label htmlFor={detailsId}>
                    تفاصيل إضافية <span className={styles.optionalLabel}>(اختياري)</span>
                  </label>
                  <textarea
                    id={detailsId}
                    name="details"
                    className={styles.formTextarea}
                    placeholder="أخبرنا بالمزيد لنحسن تجربتك…"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                {/* Confirm checkbox */}
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id={confirmId}
                    name="confirm"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <label htmlFor={confirmId}>
                    أؤكد أنني أفهم أن <span className={styles.highlight}>هذا الإجراء نهائي ولا يمكن التراجع عنه</span>، وأن جميع بياناتي وحساباتي المرتبطة سيتم حذفها بشكل دائم.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`${styles.btnSubmit}${loading ? ` ${styles.loading}` : ''}`}
                  disabled={!canSubmit}
                  aria-busy={loading}
                >
                  <span className={styles.btnText}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-3px' }}>
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    إرسال طلب الحذف
                  </span>
                  <div className={styles.spinner} aria-hidden="true" />
                </button>
              </form>
            </div>
          ) : (
            /* Success state */
            <div className={`${styles.successState} ${styles.visible}`} role="status">
              <div className={styles.iconWrap}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>تم استلام طلبك</h2>
              <p>سنقوم بمعالجة طلب حذف الحساب وإعلامك عبر البريد الإلكتروني خلال 48 ساعة. إذا كان لديك أي استفسار، يمكنك التواصل معنا على</p>
              <span className={styles.emailRef}>haazemsaidd@gmail.com</span>
              <br />
              <Link href="/" className={styles.btnDone}>العودة إلى الرئيسية</Link>
            </div>
          )}

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.siteFooter}>
        <p>StockFlow © 2026 · <a href="mailto:haazemsaidd@gmail.com">haazemsaidd@gmail.com</a> · 01224661310</p>
      </footer>
    </div>
  )
}
