import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PricingToggle from './PricingToggle'
import FaqAccordion from './FaqAccordion'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'StockFlow - نظام إدارة المخازن والتوزيع للمحلات والسوبر ماركت',
  description: 'StockFlow هو نظام إدارة مخازن وتوزيع للمحلات والسوبر ماركت - فواتير، مخزون، ديون العملاء، تقارير، وتعاون الفريق. كل ده من جوالك وبالعربي.',
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
    ),
    title: 'إدارة المخزون',
    desc: 'تتبع المنتجات والكميات في كل المخازن. أدخل صنف جديد، عدّل الكمية، واعرف المنتجات اللي خلصت قبل ما تطلب من المورد.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
    title: 'الفواتير',
    desc: 'إنشاء فواتير البيع والشراء بسرعة. اختر العميل، ضيف المنتجات، واطبع أو اتسحاب الفاتورة بصيغة Excel بضغطة واحدة.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    ),
    title: 'تتبع الديون',
    desc: 'سجل ديون العملاء والموردين. اعرف مين عليه فلوس ومين ليه فلوس عندك. ألوان واضحة: أخضر مدفوع، برتقالي part payments، أحمر متأخر.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'فريق العمل',
    desc: 'حدد صلاحيات كل فرد - مالك، مدير، موظف. كل واحد يشوف اللي يخصه ويسجل دخوله بشكل منفصل وكل التغييرات متسجلة.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v6h-6"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M12 3v4"/><path d="M12 17v4"/></svg>
    ),
    title: 'التقارير والتحليلات',
    desc: 'كشف يومي وشهري بالمبيعات والمخزون والأرباح. تقارير واضحة تساعدك تتخذ قرارات أسرع - تصدير Excel متاح لكل التقارير.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>
    ),
    title: 'عربية أولاً',
    desc: 'التطبيق بالعربي الفصحى من البداية مش ترجمة. واجهة RTL تدعم الكتابة من اليمين لليسار، أزرار، قوائم، وتنقل سهل مصمم للسوق المصري.',
  },
]

const heroStats = [
  { value: '2 د', label: 'تجهيز أول شركة' },
  { value: '24/7', label: 'شغل Offline' },
  { value: 'Excel', label: 'استيراد وتصدير' },
]

const dashboardMetrics = [
  { label: 'مبيعات اليوم', value: '18,450 ج.م', tone: 'success' },
  { label: 'ديون مستحقة', value: '6,200 ج.م', tone: 'warning' },
  { label: 'منتجات قاربت تخلص', value: '12 صنف', tone: 'danger' },
]

const insightCards = [
  { label: 'تنبيه ذكي', value: 'المخزون قل', desc: 'السكر 1 كجم وصل للحد الأدنى' },
  { label: 'آخر مزامنة', value: 'منذ 4 دقائق', desc: 'كل الفواتير محفوظة ومتزامنة' },
]

const diffCards = [
  {
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
    title: 'نظام صلاحيات مرن',
    desc: 'مش fixed roles - صلاحيات JSON. المالك يتحكم في كل حاجة، الموظف يشوف اللي يتسندوله بس.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    title: 'شركات متعددة - من حساب واحد',
    desc: 'ادير أكتر من شركة من نفس الحساب. حول بينهم بضغطة - وكل شركة بياناتها منفصلة تماماً.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: 'شغل من غير نت',
    desc: 'التطبيق شغال بدون إنترنت. كل الفواتير والمخزون متاحين - وأي تغيير يتزامن تلقائي أول ما ترجع.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v6h-6"/></svg>,
    title: 'تقارير وتصدير Excel',
    desc: 'تقارير يومية وشهرية - مبيعات، مخزون، ديون، أرباح - وتصديرها بصيغة Excel بضغطة واحدة.',
  },
]

const processSteps = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    title: 'سجل وضيف بياناتك',
    desc: 'حمل التطبيق، اعمل حساب، وضيف الشركة - اسم، عنوان، بيانات الضرائب.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
    title: 'ضيف المنتجات والعملاء',
    desc: 'ضيف أصناف المخزن والأسعار والكميات. استورد العملاء من Excel أو ضيفهم واحدا واحدا.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    title: 'ابدأ الشغل',
    desc: 'اعمل فواتير، تابع المخزون، وسجل الديون. كل حاجة شغالة معاك في الحال.',
  },
]

const testimonials = [
  {
    text: '"كنت بضيع ديون كتير قبل StockFlow. دلوقتي عارف مين دافع ومين لسه - والديون قلت ٤٠٪ في ٣ شهور."',
    name: 'أحمد السيد',
    role: 'صاحب سوبر ماركت - المنصورة',
    initial: 'أ',
    color: 'var(--accent)',
  },
  {
    text: '"نظام الصلاحيات والشركات المتعددة خلاني أدير ٣ مخازن من جوال واحد. كل مدير عنده صلاحياته وكل مخزن له تقاريره."',
    name: 'محمود عبدالله',
    role: 'موزع مواد غذائية - القاهرة',
    initial: 'م',
    color: 'var(--accent-secondary)',
  },
  {
    text: '"تقارير Excel كانت اللي خلصتني مع مراجعة نهاية السنة. ضغطة وطلعت تقرير المخزون والأرباح - بدل يومين شغل في Excel."',
    name: 'ناصر علي',
    role: 'صيدلي - الإسكندرية',
    initial: 'ن',
    color: 'var(--accent)',
  },
]

const faqItems = [
  { q: 'هل فيه نسخة مجانية؟', a: 'أيوه، في خطة Starter مجانية بالكامل — شركة واحدة، 3 موظفين، التقارير الأساسية. تقدر تبدا من غير ما تدفع حاجة.' },
  { q: 'هل StockFlow شغال من غير نت؟', a: 'أيوه، في دعم غير متصل (offline support) — تقدر تسجل فواتير وتضيف منتجات من غير اتصال بالنت، و automatic sync لما ترجع تتصل.' },
  { q: 'أقدر أدير أكتر من شركة من حساب واحد؟', a: 'أكيد. ميزة Multi-company — تقدر تنشئ شركات غير محدودة، تتنقل بينهم فوراً، وكل شركة ليها بيانات وفريق وصلاحيات مستقلة.' },
  { q: 'هل أقدر أحدد صلاحيات كل موظف؟', a: 'أيوه، نظام صلاحيات مرن — owner كل حاجة، admin يقدّر يفعّل/يعطّل صلاحيات، employee ليه بس الصلاحيات اللي تنداله. تقدر تتحكم في كل حاجة: المنتجات، الفواتير، التقارير، الدفع...' },
  { q: 'هل أقدر أستورد المنتجات من Excel؟', a: 'أيوه، تقدر تستورد المنتجات والعملاء من Excel، وتصدر التقارير إلى Excel برضه. ولو عايز دمج مع POS أو باركود Scanner، البرنامج بيدعمه.' },
  { q: 'بياناتي آمنة؟', a: 'أكيد. تشفير كامل، نسخ احتياطي تلقائي، صلاحيات الأدوار، وعزل بيانات كل شركة. ولو احتجت مساعدة، الدعم الفني موجود.' },
]

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`${styles.heroShell} container`}>
          <div className={styles.heroCopy}>
            <div className={`${styles.heroBadge} hero-badge`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3 6 7 .9-5 4.7 1.3 6.9L12 18l-6.3 3.5L7 14.6 2 9.9 9 9z"/>
              </svg>
              إدارة المخازن والتوزيع بالكامل من جوالك
            </div>
            <h1 className={`${styles.heroTitle} hero-title`}>حوّل جوالك إلى غرفة عمليات للمخزن</h1>
            <p className={`${styles.heroBody} hero-body`}>StockFlow يجمع الفواتير، المخزون، ديون العملاء، التقارير، وصلاحيات الفريق في تجربة عربية سريعة وواضحة. افتح التطبيق، شوف الصورة كاملة، واتخذ القرار قبل ما المشكلة تكبر.</p>
            <div className={`${styles.heroActions} hero-actions`}>
              <button className="btn btn-primary">ابدأ مجاناً</button>
              <button className="btn btn-secondary">شوف طريقة الشغل</button>
            </div>
            <div className={styles.heroStats}>
              {heroStats.map((stat) => (
                <div key={stat.label} className={styles.heroStat}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="لوحة متابعة StockFlow">
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardHeader}>
                <div>
                  <span className={styles.dashboardEyebrow}>لوحة اليوم</span>
                  <h2>نظرة واحدة تكفي</h2>
                </div>
                <span className={styles.livePill}>مباشر</span>
              </div>
              <div className={styles.metricStack}>
                {dashboardMetrics.map((metric) => (
                  <div key={metric.label} className={`${styles.metricCard} ${styles[metric.tone]}`}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.progressPanel}>
                <div className={styles.progressHeader}>
                  <span>تقدم التحصيل</span>
                  <strong>78%</strong>
                </div>
                <div className={styles.progressTrack}>
                  <span />
                </div>
              </div>
            </div>
            <div className={styles.floatingInsights}>
              {insightCards.map((card) => (
                <div key={card.label} className={styles.insightCard}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustLabel}>ثقة المديرين والتجار في</div>
          <div className={styles.trustGrid}>
            {['مخازن الجملة|Wholesale warehouses', 'سلاسل السوبر ماركت|Supermarket chains', 'موزعين مواد غذائية|Food distributors', 'محلات التجزئة|Retail stores'].map((item) => {
              const [ar, en] = item.split('|')
              return (
                <div key={ar} className={styles.trustItem}>
                  <span className={styles.trustAr}>{ar}</span>
                  <span className={styles.trustEn}>{en}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.featuresSection}>
        <div className="section container">
          <div className="section-head">
            <h2>كل اللي تحتاجه عشان تدير مخزنك</h2>
            <p>مخزون، فواتير، ديون، تقارير - كل حاجة في تطبيق واحد مصمم للسوق المصري.</p>
          </div>
          <div className={`${styles.featureGrid} reveal-group`}>
            {features.map((f, i) => (
              <div key={i} className={`${styles.featureCard} reveal-child`} style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup */}
      <section className={styles.mockupSection}>
        <div className="container">
          <div className={`${styles.mockupContent} reveal-group`}>
            <h2 className="reveal-child">شوف بنفسك - لوحة التحكم الرئيسية</h2>
            <p className="reveal-child">من أول ما تفتح التطبيق، كل الأرقام المهمة قدامك: مبيعات النهارده، عدد المنتجات، إجمالي الديون، وعدد العملاء. ضغطة واحدة توصل لكل حاجة.</p>
            <button className="btn reveal-child">ابدأ مجاناً</button>
          </div>
          <div className={styles.mockupPhone}>
            <div className={styles.phoneFrame}>
              <Image src="/assets/iphone-frame.svg" alt="StockFlow Dashboard on iPhone 16 Pro" fill style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Diff band */}
      <section className={styles.diffBand}>
        <div className="section container">
          <div className="section-head">
            <h2>مش مجرد تطبيق مخازن - نظام متكامل</h2>
            <p>فروق حقيقية هتحسها من أول يوم شغل</p>
          </div>
          <div className={`${styles.diffGrid} reveal-group`}>
            {diffCards.map((d, i) => (
              <div key={i} className={`${styles.diffCard} reveal-child`} style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
                <div className={styles.diffIcon}>{d.icon}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / How it works */}
      <section id="how" className={styles.howSection}>
        <div className="section container">
          <div className="section-head">
            <span className="section-kicker">طريقة العمل</span>
            <h2>جهز نفسك في ٣ خطوات</h2>
            <p>مفيش مشروع ترحيل ولا أسبوعين setup. من دقيقة لدقيقة.</p>
          </div>
          <div className={`${styles.processGrid} reveal-group`}>
            {processSteps.map((s, i) => (
              <div key={i} className={`${styles.processStep} reveal-child`} style={{ animationDelay: `${0.05 + i * 0.10}s` }}>
                <div className={styles.processIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className="section container">
          <div className="section-head">
            <span className="section-kicker">كلام الناس</span>
            <h2>اللي جربوا قالوا</h2>
          </div>
          <div className={`${styles.testimonialGrid} reveal-group`}>
            {testimonials.map((t, i) => (
              <div key={i} className={`${styles.testimonialCard} reveal-child`} style={{ animationDelay: `${0.05 + i * 0.09}s` }}>
                <div className={styles.quoteMark}>”</div>
                <div className={styles.testimonialText}>{t.text}</div>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: `color-mix(in srgb, ${t.color} 12%, transparent)`, color: t.color }}>
                    {t.initial}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricingSection}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 'var(--space-5)' }}>
            <span className="section-kicker">الأسعار والباقات</span>
            <h2>باقات تناسب كل مرحلة</h2>
            <p>ابدأ مجاناً وارتقِ مع نمو تجارتك. لا بطاقات ائتمان، لا التزامات، إلغاء في أي وقت.</p>
          </div>
          <PricingToggle />
        </div>
      </section>

      {/* CTA Band */}
      <section className={styles.ctaBand}>
        <div className="container reveal-group">
          <h2 className="reveal-child">استعد تتحكم في مخزنك من جوالك</h2>
          <p className="reveal-child">خطة مجانية، التجهيز في دقيقتين.</p>
          <button className="btn reveal-child">ابدأ مجاناً</button>
          <div className="reveal-child" style={{ marginTop: 'var(--space-5)' }}>
            <a
              href="https://play.google.com/store/apps/details?id=com.example.stockflow"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', textDecoration: 'none' }}
              aria-label="تحميل من Google Play"
            >
              <Image src="/mrgqpgfo-google-play.png" width={180} height={69} alt="Google Play" style={{ borderRadius: 10 }} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={styles.faqSection}>
        <div className="container reveal-group">
          <div className="section-label reveal-child">الأسئلة الشائعة</div>
          <h2 className="section-title reveal-child">إجابات سريعة لأسئلتك</h2>
          <p className="section-subtitle reveal-child">كل اللي محتاج تعرفه قبل ما تبدا مع StockFlow</p>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <Footer />
    </>
  )
}
