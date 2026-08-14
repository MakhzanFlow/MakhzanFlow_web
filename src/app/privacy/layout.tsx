import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة خصوصية StockFlow — كيف نجمع بياناتك ونستخدمها ونحميها، وحقوقك بموجب القانون المصري لحماية البيانات.',
}

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
