import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StockFlow - نظام إدارة المخازن والتوزيع',
    template: '%s | StockFlow',
  },
  description: 'نظام إدارة المخازن والتوزيع للمحلات والسوبر ماركت - فواتير، مخزون، ديون العملاء، تقارير، وتعاون الفريق. عربي أولاً، مصمم للسوق المصري.',
  metadataBase: new URL('https://stockflow.app'),
  openGraph: {
    siteName: 'StockFlow',
    locale: 'ar_EG',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
