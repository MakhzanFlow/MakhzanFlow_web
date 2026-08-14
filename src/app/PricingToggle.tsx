'use client'

import { useState } from 'react'
import styles from './PricingToggle.module.css'

type BillingPeriod = 'monthly' | 'annual'

type PricingPlan = {
  name: string
  monthly: number
  annual: number
  description: string
  groups: {
    label: string
    features: string[]
  }[]
  cta: string
  popular?: boolean
  annualSave?: string
}

const plans: PricingPlan[] = [
  {
    name: 'المبتدئ',
    monthly: 0,
    annual: 0,
    description: 'مثالي للتجار الجدد والمخازن الصغيرة',
    groups: [
      {
        label: 'المخزون والمبيعات',
        features: ['منتجات وفئات غير محدودة', 'فواتير بيع وشراء مع خصومات', 'باركود و QR Scanner'],
      },
      {
        label: 'العملاء والتقارير',
        features: ['إدارة العملاء والديون', 'تقارير مبيعات + تصدير Excel'],
      },
    ],
    cta: 'ابدأ مجاناً',
  },
  {
    name: 'الأعمال',
    monthly: 599,
    annual: 5750,
    description: 'للمحلات النامية والفرق الصغيرة',
    groups: [
      {
        label: 'المخزون والمبيعات',
        features: ['كل ما في المجاني + تعديلات متقدمة', 'فواتير متكررة ومجدولة', 'نقاط بيع (POS) متقدمة'],
      },
      {
        label: 'العملاء والفريق',
        features: ['تذكيرات ديون آلية + تقارير أرصدة', 'صلاحيات فريق مرنة (JSON)', 'شركات متعددة + API وصول'],
      },
    ],
    cta: 'جرب 14 يوم مجاناً',
    popular: true,
    annualSave: 'وفر 1,198 ج.م سنوياً',
  },
  {
    name: 'المؤسسات',
    monthly: 1499,
    annual: 14390,
    description: 'للموزعين والسلاسل الكبيرة',
    groups: [
      {
        label: 'كل ميزات الأعمال',
        features: ['شركات غير محدودة + API كامل', 'مدير حساب شخصي + دعم مخصص', 'SLA مضمون + تدريب فريق'],
      },
    ],
    cta: 'تواصل مع المبيعات',
    annualSave: 'وفر 2,998 ج.م سنوياً',
  },
]

const trustBadges = [
  {
    label: 'لا بطاقة ائتمان',
    icon: (
      <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="5" y1="15" x2="9" y2="15"/></svg>
    ),
  },
  {
    label: 'إلغاء في أي وقت',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
    ),
  },
  {
    label: 'تجربة مجانية 14 يوم',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    ),
  },
  {
    label: 'ضمان 30 يوم',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    ),
  },
]

function formatAmount(amount: number) {
  return amount.toLocaleString('en-US')
}

export default function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const isAnnual = billingPeriod === 'annual'
  const periodText = isAnnual ? '/ سنة (تُفوتر سنوياً)' : '/ شهر'

  return (
    <>
      <div className={styles.pricingToggle} role="group" aria-label="اختر دورة الفوترة">
        <button
          type="button"
          className={`${styles.pricingToggleLabel} ${!isAnnual ? styles.active : ''}`}
          onClick={() => setBillingPeriod('monthly')}
        >
          شهرياً
        </button>
        <button
          type="button"
          className={`${styles.pricingToggleSwitch} ${isAnnual ? styles.active : ''}`}
          aria-pressed={isAnnual}
          aria-label="تبديل بين الشهري والسنوي"
          onClick={() => setBillingPeriod(isAnnual ? 'monthly' : 'annual')}
        >
          {isAnnual ? <span className={styles.pricingToggleSave}>وفر 20%</span> : null}
        </button>
        <button
          type="button"
          className={`${styles.pricingToggleLabel} ${isAnnual ? styles.active : ''}`}
          onClick={() => setBillingPeriod('annual')}
        >
          سنوياً
        </button>
      </div>

      <div className={`${styles.pricingGrid} reveal-group`}>
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''} reveal-child`}
            style={{ animationDelay: `${0.05 + index * 0.08}s` }}
          >
            {plan.popular ? <div className={styles.pricingCardBadge}>الأكثر شيوعاً</div> : null}
            <div className={styles.pricingCardPlan}>
              <span className={styles.pricingCardName}>{plan.name}</span>
            </div>
            <div className={styles.pricingCardPrice}>
              <span className={styles.pricingCardAmount}>
                <span className={styles.pricingCurrency}>ج.م</span>
                <span className={styles.pricingAmount}>{formatAmount(isAnnual ? plan.annual : plan.monthly)}</span>
              </span>
              <span className={styles.pricingPeriod}>{periodText}</span>
              {isAnnual && plan.annualSave ? <span className={styles.pricingCardAnnualSave}>{plan.annualSave}</span> : null}
            </div>
            <p className={styles.pricingDesc}>{plan.description}</p>
            <div className={styles.pricingCardFeatures}>
              {plan.groups.map((group) => (
                <div key={group.label} className={styles.pricingCardFeatureGroup}>
                  <span className={styles.pricingCardFeatureGroupLabel}>{group.label}</span>
                  <ul className={styles.pricingCardFeatureList}>
                    {group.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} type="button">
              {plan.cta}
            </button>
          </article>
        ))}
      </div>

      <div className={styles.pricingTrust}>
        {trustBadges.map((badge) => (
          <span key={badge.label} className={styles.pricingTrustItem}>
            {badge.icon}
            {badge.label}
          </span>
        ))}
      </div>
    </>
  )
}
