import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandLogo}>
              <Image src="/logos/stockflow-logo.png" alt="StockFlow" width={80} height={24} />
            </div>
            <p>نظام إدارة المخازن والتوزيع للمحلات وسلاسل السوبر ماركت - فواتير، مخزون، ديون، تقارير. عربي أولاً، مصمم للسوق المصري.</p>
          </div>
          <div>
            <div className={styles.footerColTitle}>المنتج</div>
            <div className={styles.footerLinks}>
              <Link href="/#features">المميزات</Link>
              <Link href="/#pricing">الباقات</Link>
              <Link href="#">تحديثات</Link>
              <Link href="#">API</Link>
            </div>
          </div>
          <div>
            <div className={styles.footerColTitle}>الشركة</div>
            <div className={styles.footerLinks}>
              <Link href="#">عن StockFlow</Link>
              <Link href="#">المدونة</Link>
              <Link href="#">وظائف</Link>
              <Link href="#">اتصل بنا</Link>
            </div>
          </div>
          <div>
            <div className={styles.footerColTitle}>مراجع</div>
            <div className={styles.footerLinks}>
              <Link href="#">التوثيق</Link>
              <Link href="#">الدعم الفني</Link>
              <Link href="/privacy">سياسة الخصوصية</Link>
              <Link href="#">الشروط</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 StockFlow · <a href="https://github.com/hazzemSaid/stockflow-app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--muted)' }}>GitHub</a></span>
          <span>مهني · موثوق · واضح</span>
        </div>
      </div>
    </footer>
  )
}
