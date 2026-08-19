'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import styles from './PricingToggle.module.css'

type BillingPeriod = 'monthly' | 'annual'

type Plan = {
  name: string
  sub: string
  monthly?: string
  annual?: string
  fixed?: string
  periodNote?: string
  features: string[]
  cta: string
  href: string
  primary?: boolean
  badge?: string
}

const plans: Plan[] = [
  {
    name: 'Starter',
    sub: 'لمخزن واحد يبدأ شغله بذكاء',
    monthly: 'مجاني',
    annual: 'مجاني',
    periodNote: ' للأبد',
    features: [
      'منتجات وفواتير غير محدودة',
      'تتبع مخزون وتنبيهات أساسية',
      'تقارير شهرية',
      'شغل Offline',
      'دعم بالإيميل',
    ],
    cta: 'ابدأ مجاناً',
    href: '/register',
  },
  {
    name: 'Business',
    sub: 'للتوزيع والفروع والفرق الأكبر',
    monthly: '٣٥٠ ج.م',
    annual: '٣٠٠ ج.م',
    periodNote: '/شهر',
    features: [
      'كل مزايا Starter',
      'تتبع ديون متقدم',
      'صلاحيات فريق متعددة',
      'شركات متعددة',
      'تصدير Excel + تكاملات',
      'دعم أولوية',
    ],
    cta: 'ابدأ مجاناً',
    href: '/register',
    primary: true,
    badge: 'الأكثر شيوعاً',
  },
  {
    name: 'Enterprise',
    sub: 'للسلاسل والمخازن الكبيرة',
    fixed: 'حسب الحجم',
    features: [
      'كل مزايا Business',
      'صلاحيات JSON مرنة',
      'حسابات غير محدودة',
      'دعم مخصص وترحيل بيانات',
      'اتفاقية مستوى خدمة',
    ],
    cta: 'كلمنا',
    href: '#faq',
  },
]

const checkIcon = (
  <svg><use href="#i-check" /></svg>
)

export default function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const isAnnual = billingPeriod === 'annual'

  return (
    <>
      <div className={`${styles.pricingToggle} reveal`} style={{ '--d': '.1s' } as CSSProperties} role="group" aria-label="اختر دورة الفوترة">
        <button
          type="button"
          className={`${styles.tglBtn} ${!isAnnual ? styles.on : ''}`}
          aria-pressed={!isAnnual}
          onClick={() => setBillingPeriod('monthly')}
        >
          شهري
        </button>
        <button
          type="button"
          className={`${styles.tglBtn} ${isAnnual ? styles.on : ''}`}
          aria-pressed={isAnnual}
          onClick={() => setBillingPeriod('annual')}
        >
          سنوي <span className={styles.disc}>خصم ١٥٪</span>
        </button>
      </div>

      <div className={styles.plans}>
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`${styles.plan} ${plan.primary ? styles.pop : ''} reveal`}
            style={{ '--d': `${0.1 + index * 0.1}s` } as CSSProperties}
          >
            {plan.badge ? <span className={styles.planBadge}>{plan.badge}</span> : null}
            <h3>{plan.name}</h3>
            <p className={styles.sub}>{plan.sub}</p>
            <div className={styles.price}>
              <b>{plan.fixed ?? (isAnnual ? plan.annual : plan.monthly)}</b>
              <span>{plan.fixed ? '' : plan.periodNote}</span>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}><span className={styles.liIc}>{checkIcon}</span> {feature}</li>
              ))}
            </ul>
            <Link href={plan.href} className={`btn ${plan.primary ? 'btn-primary' : 'btn-secondary'}`}>
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}
