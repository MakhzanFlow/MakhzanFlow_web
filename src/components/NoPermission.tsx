'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import styles from './NoPermission.module.css'

interface NoPermissionProps {
  title?: string
  description?: string
  requiredPermission?: string
  compact?: boolean
  onRequestAccess?: () => void
  backHref?: string
  backLabel?: string
}

export default function NoPermission({
  title = 'ليس لديك صلاحية للوصول',
  description,
  requiredPermission,
  compact = false,
  onRequestAccess,
  backHref = '/dashboard',
  backLabel = 'العودة للوحة التحكم',
}: NoPermissionProps) {
  const defaultDesc = requiredPermission
    ? `تحتاج إلى صلاحية "${requiredPermission}" للقيام بهذا الإجراء. تواصل مع مسؤول الشركة لطلبها.`
    : 'ليس لديك الصلاحيات الكافية لعرض أو تنفيذ هذا الإجراء. إذا كنت تعتقد أن هذا خطأ، تواصل مع مسؤول الشركة.'

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`} role="alert" aria-live="polite">
      <div className={styles.icon}>
        <Icon name="lock" size={30} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description || defaultDesc}</p>

      {requiredPermission && (
        <span className={styles.badge}>
          <Icon name="alert" size={14} />
          {requiredPermission}
        </span>
      )}

      <div className={styles.actions}>
        <Link href={backHref} className={styles.btnPrimary}>
          {backLabel}
        </Link>
        {onRequestAccess ? (
          <button type="button" className={styles.btnGhost} onClick={onRequestAccess}>
            طلب صلاحية
          </button>
        ) : (
          <Link href="/select-company" className={styles.btnGhost}>
            تبديل الشركة
          </Link>
        )}
      </div>

      <p className={styles.hint}>
        إذا كنت انضممت للتو لشركة، قد يكون طلبك لا يزال قيد المراجعة. تحقق من صفحة <Link href="/pending">حالة الطلب</Link>.
      </p>
    </div>
  )
}

export function InlineNoPermission({ message = 'لا تملك صلاحية للقيام بهذا الإجراء' }: { message?: string }) {
  return (
    <div className={styles.inline}>
      <Icon name="lock" size={18} />
      <span>{message}</span>
    </div>
  )
}
