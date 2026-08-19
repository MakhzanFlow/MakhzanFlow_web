import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.fBrand}>
            <a className={styles.brand} href="#top">
              <span className={styles.brandMark}>
                <svg><use href="#i-box" /></svg>
              </span>
              <span>StockFlow</span>
            </a>
            <p>نظام عربي متكامل لإدارة المخازن والتوزيع: فواتير، مخزون، ديون، تقارير، وصلاحيات فريق.</p>
            <div className={styles.fSocial}>
              <a href="https://github.com/hazzemSaid" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <svg><use href="#i-gh" /></svg>
              </a>
              <a href="https://linkedin.com/in/hazem-said-775b66263" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg><use href="#i-in" /></svg>
              </a>
            </div>
          </div>
          <div className={styles.fCol}>
            <h4>روابط سريعة</h4>
            <a href="#features">المميزات</a>
            <a href="#permissions">الصلاحيات</a>
            <a href="#pricing">الأسعار</a>
            <a href="#faq">الأسئلة الشائعة</a>
            <a href="#how">طريقة العمل</a>
          </div>
          <div className={styles.fCol}>
            <h4>المنتج</h4>
            <Link href="/register">ابدأ مجاناً</Link>
            <a href="#integrations">التكاملات</a>
            <a href="#phone-preview">التطبيق</a>
            <a href="#testimonials">آراء العملاء</a>
          </div>
          <div className={styles.fCol}>
            <h4>تواصل معنا</h4>
            <ul className={styles.fContact}>
              <li>
                <svg><use href="#i-phone2" /></svg>
                <a href="tel:01224661310" dir="ltr">01224661310</a>
              </li>
              <li>
                <svg><use href="#i-mail" /></svg>
                <a href="mailto:haazemsaidd@gmail.com" dir="ltr">haazemsaidd@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          <span>© 2026 StockFlow — جميع الحقوق محفوظة</span>
          <span>
            <Link href="/privacy">سياسة الخصوصية</Link>
            <span className={styles.divider}>·</span>
            <Link href="/delete-account">حذف الحساب</Link>
            <span className={styles.divider}>·</span>
            صُنع للسوق المصري
          </span>
        </div>
      </div>
    </footer>
  )
}
