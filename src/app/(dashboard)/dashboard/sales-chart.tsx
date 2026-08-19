'use client'

import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import styles from './dashboard.module.css'

export interface SalesPoint {
  date: string
  label: string
  amount: number
}

type Range = '90d' | '30d' | '7d'

const RANGES: { key: Range; label: string }[] = [
  { key: '90d', label: 'آخر 3 أشهر' },
  { key: '30d', label: 'آخر 30 يوم' },
  { key: '7d', label: 'آخر 7 أيام' },
]

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}

export function SalesChart({ data }: { data: SalesPoint[] }) {
  const [range, setRange] = useState<Range>('90d')

  const filtered = useMemo(() => {
    if (data.length === 0) return []
    const reference = new Date(data[data.length - 1].date)
    const daysToSubtract = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const startDate = new Date(reference)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return data.filter((point) => new Date(point.date) >= startDate)
  }, [data, range])

  if (data.length === 0) return null

  return (
    <div className={styles.card}>
      <header className={styles.cardHead}>
        <div>
          <div className={styles.cardTitle}>مبيعات الأسبوع</div>
          <div className={styles.cardSub}>إجمالي المبيعات اليومية</div>
        </div>
        <div className={styles.rangeTabs} role="group" aria-label="اختر الفترة">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`${styles.rangeTab}${range === r.key ? ` ${styles.rangeTabActive}` : ''}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={filtered} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={36}
              tick={{ fontSize: 12, fill: 'var(--muted)' }}
              tickFormatter={formatDate}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border)' }}
              content={<ChartTooltip />}
            />
            <Area
              type="natural"
              dataKey="amount"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#salesFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label ? formatDate(label) : ''}</span>
      <span className={styles.tooltipValue}>
        {(payload[0].value ?? 0).toLocaleString('ar-EG')} ج.م
      </span>
    </div>
  )
}