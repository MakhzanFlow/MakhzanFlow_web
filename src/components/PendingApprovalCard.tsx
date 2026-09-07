'use client'

import Icon from '@/components/Icon'
import styles from './PendingApprovalCard.module.css'

interface PendingApprovalCardProps {
  companyName?: string | null
  inviteCode?: string | null
  createdAt?: string | null
  onRefresh?: () => void
  onCancel?: () => void
  onBack?: () => void
  refreshing?: boolean
  cancelling?: boolean
}

export default function PendingApprovalCard({
  companyName,
  inviteCode,
  createdAt,
  onRefresh,
  onCancel,
  onBack,
  refreshing,
  cancelling,
}: PendingApprovalCardProps) {
  return (
    <div className={styles.card} role="status" aria-live="polite">
      <div className={styles.iconWrap}>
        <span className={styles.iconPulse} aria-hidden />
        <span className={styles.iconBg}>
          <Icon name="clock" size={30} />
        </span>
      </div>

      <h2 className={styles.title}>طلبك قيد المراجعة</h2>

      <p className={styles.lead}>
        {companyName ? (
          <>
            تم إرسال طلب الانضمام إلى <b>{companyName}</b>
          </>
        ) : (
          <>تم إرسال طلب الانضمام بنجاح</>
        )}
      </p>

      <p className={styles.sub}>
        سيتم تفعيل حسابك ودخولك للوحة التحكم بعد موافقة صاحب الشركة أو المسؤول. ستتمكن من المتابعة تلقائياً
        بمجرد الموافقة.
      </p>

      {(inviteCode || createdAt) && (
        <div className={styles.meta}>
          {inviteCode && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>رمز الدعوة</span>
              <code className={styles.code} dir="ltr">
                {inviteCode}
              </code>
            </span>
          )}
          {createdAt && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>تاريخ الطلب</span>
              <span className={styles.metaValue}>
                {new Date(createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </span>
          )}
        </div>
      )}

      <div className={styles.steps} aria-label="مراحل الانضمام">
        <span className={`${styles.step} ${styles.stepDone}`}>
          <span className={styles.dot} />
          أُرسل الطلب
        </span>
        <span className={styles.stepLine} />
        <span className={`${styles.step} ${styles.stepActive}`}>
          <span className={styles.dot} />
          بانتظار الموافقة
        </span>
        <span className={styles.stepLine} />
        <span className={`${styles.step} ${styles.stepPending}`}>
          <span className={styles.dot} />
          الدخول
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary} ${refreshing ? styles.isPending : ''}`}
          onClick={onRefresh}
          disabled={refreshing}
        >
          <span className={styles.spinner} />
          {refreshing ? 'جاري التحديث...' : 'تحديث الحالة'}
        </button>
        {onCancel && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost} ${cancelling ? styles.isPending : ''}`}
            onClick={onCancel}
            disabled={cancelling}
          >
            <span className={styles.spinner} />
            {cancelling ? 'جاري الإلغاء...' : 'إلغاء الطلب'}
          </button>
        )}
      </div>

      <div className={styles.foot}>
        {onBack && (
          <button type="button" className={styles.textBtn} onClick={onBack}>
            العودة لاختيار شركة
          </button>
        )}
        <span className={styles.hint}>يتم التحقق تلقائياً كل 15 ثانية</span>
      </div>
    </div>
  )
}

export function InlinePendingBanner({ companyName }: { companyName?: string | null }) {
  return (
    <div className={styles.inlineBanner} role="status">
      <span className={styles.inlineIcon}>
        <Icon name="clock" size={18} />
      </span>
      <div>
        <b>طلبك قيد المراجعة</b>
        <span> — في انتظار موافقة مسؤول {companyName ? `شركة "${companyName}"` : 'الشركة'}. ستتمكن من الدخول تلقائياً بعد الموافقة.</span>
      </div>
    </div>
  )
}
