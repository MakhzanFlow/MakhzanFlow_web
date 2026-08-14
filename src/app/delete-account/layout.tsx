import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'طلب حذف الحساب',
  description: 'اطلب حذف حسابك في StockFlow وجميع بياناتك بشكل دائم.',
}

export default function DeleteAccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
