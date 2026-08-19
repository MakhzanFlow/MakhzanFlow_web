import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import IconSprite from '@/components/IconSprite'
import ScrollReveal from '@/components/ScrollReveal'
import PricingToggle from './PricingToggle'
import FaqAccordion from './FaqAccordion'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'StockFlow - نظام إدارة المخازن والتوزيع للمحلات والسوبر ماركت',
  description: 'StockFlow هو نظام إدارة مخازن وتوزيع للمحلات والسوبر ماركت - فواتير، مخزون، ديون العملاء، تقارير، وتعاون الفريق. كل ده من جوالك وبالعربي.',
}

const d = (value: string) => ({ '--d': value }) as CSSProperties

const icon = (id: string) => <svg><use href={`#${id}`} /></svg>

const features = [
  {
    icon: 'i-box',
    title: 'إدارة المخزون',
    desc: 'تابع منتجاتك لحظة بلحظة، حدد الحد الأدنى لكل صنف، واستلم تنبيه قبل نفاد الكمية. اعرف المنتجات القاربة تخلص قبل ما العميل يسأل.',
  },
  {
    icon: 'i-receipt',
    title: 'الفواتير',
    desc: 'فواتير بيع وشراء سريعة من جوالك، مع حساب الإجمالي والخصم تلقائياً وطباعة أو مشاركة الفاتورة مباشرة.',
  },
  {
    icon: 'i-wallet',
    title: 'تتبع الديون',
    desc: 'تابع ديون العملاء ومواعيد السداد بحالة واضحة لكل معاملة: مدفوع، جزئي، أو مستحق — عشان تبقى عارف مين محتاج متابعة.',
  },
  {
    icon: 'i-users',
    title: 'فريق العمل',
    desc: 'صلاحيات مرنة حسب الأدوار: مالك، مدير، موظف — وحدد لكل واحد اللي يشوفه ويعمله بالظبط، من غير ما يضيع منك التحكم.',
  },
  {
    icon: 'i-chart',
    title: 'التقارير والتحليلات',
    desc: 'تقارير مبيعات ومخزون وأرباح واضحة، وتصدير Excel بضغطة واحدة — عشان تاخد قراراتك من أرقام حقيقية مش حدس.',
  },
  {
    icon: 'i-globe',
    title: 'عربية أولاً',
    desc: 'تجربة عربية RTL كاملة مصممة للسوق المصري، بأزرار ونصوص واضحة سريعة التعلم — من غير مصطلحات معقدة ولا مسارات ملتوية.',
  },
]

const businessTypes = [
  { label: 'سوبر ماركت', icon: 'i-store' },
  { label: 'صيدليات', icon: 'i-pharm' },
  { label: 'مطاعم', icon: 'i-food' },
  { label: 'كافيهات', icon: 'i-coffee' },
  { label: 'إلكترونيات', icon: 'i-bolt' },
  { label: 'موضة وملابس', icon: 'i-hanger' },
  { label: 'جملة وتوزيع', icon: 'i-truck' },
  { label: 'مخازن', icon: 'i-build' },
]

const roleCards = [
  {
    icon: 'i-shield',
    color: 'owner',
    title: 'المالك',
    note: 'كل حاجة تحت سيطرتك',
    perms: [
      { label: 'إدارة الفواتير والمخزون', on: true },
      { label: 'حذف الفواتير', on: true },
      { label: 'التقارير المالية', on: true },
      { label: 'إدارة الفريق والصلاحيات', on: true },
      { label: 'الإعدادات والشركات', on: true },
    ],
    noteText: 'صلاحيات كاملة: يضيف ويعدل ويحذف كل حاجة، ويدير الأدوار ويحذف الشركة.',
  },
  {
    icon: 'i-users',
    color: 'admin',
    title: 'المدير',
    note: 'يشرف على الشغل اليومي',
    perms: [
      { label: 'إدارة الفواتير والمخزون', on: true },
      { label: 'حذف الفواتير', on: true },
      { label: 'التقارير المالية', on: true },
      { label: 'إدارة الفريق والصلاحيات', on: true },
      { label: 'الإعدادات والشركات', on: false },
    ],
    noteText: 'يحكم شغل الفريق كله، لكن تعديل الإعدادات الجذرية وحذف الشركة للمالك بس.',
  },
  {
    icon: 'i-chart',
    color: 'emp',
    title: 'الموظف',
    note: 'شغال على الأرض',
    perms: [
      { label: 'إدارة الفواتير والمخزون', on: true },
      { label: 'حذف الفواتير', on: false },
      { label: 'التقارير المالية', on: false },
      { label: 'إدارة الفريق والصلاحيات', on: false },
      { label: 'الإعدادات والشركات', on: false },
    ],
    noteText: 'يبعت ويعدل فواتير ومخزون بس، من غير أي صلاحية مالية أو إدارية. عدّل كل نقشة كما تحب.',
  },
]

const integrations = [
  { label: 'باركود سكانر', icon: 'i-bolt' },
  { label: 'طابعة فواتير', icon: 'i-receipt' },
  { label: 'QR للدفع', icon: 'i-phone' },
  { label: 'واتساب', icon: 'i-chat' },
  { label: 'إيميل', icon: 'i-mail' },
  { label: 'نسخ احتياطي سحابي', icon: 'i-cloud' },
]

const securityPoints = [
  'تشفير كامل للبيانات',
  'نسخ احتياطي تلقائي',
  'صلاحيات الأدوار',
  'عزل بيانات الشركات',
]

const diffCards = [
  {
    icon: 'i-shield',
    title: 'نظام صلاحيات مرن',
    desc: 'مش أدوار جامدة — حدد لكل موظف إمكانياته بالظبط، من شاشة بسيطة.',
  },
  {
    icon: 'i-build',
    title: 'شركات متعددة — من حساب واحد',
    desc: 'تدير أكتر من شركة أو مخزن من نفس الحساب، وبيانات كل شركة معزولة تماماً.',
  },
  {
    icon: 'i-phone',
    title: 'شغل من غير نت',
    desc: 'فواتيرك ومخزونك شغالين حتى من غير إنترنت، والمزامنة بتحصل تلقائياً.',
  },
  {
    icon: 'i-trend',
    title: 'تقارير وتصدير Excel',
    desc: 'تحليلات دقيقة، وتصدير فوري لكل تقاريرك بصيغة Excel جاهزة للشغل.',
  },
]

const processSteps = [
  { num: '١', title: 'سجل وضيف بياناتك', desc: 'أنشئ حسابك مجاناً وضيف شركتك ومخزنك الأول — من غير بطاقة ائتمان.' },
  { num: '٢', title: 'ضيف المنتجات والعملاء', desc: 'استورد منتجاتك من Excel أو ضيفها يدوياً، وسجل عملاءك بسرعة.' },
  { num: '٣', title: 'ابدأ الشغل', desc: 'افتح فواتيرك، تابع المخزون والديون، واطلع على تقاريرك من أي مكان.' },
]

const testimonials = [
  {
    text: '"كنت بضيع وقت كتير في تسجيل الفواتير بالورق. دلوقتي كل حاجة على الموبايل، والصورة قدامي في ثانية."',
    name: 'أحمد السيد',
    role: 'سوبر ماركت المنصورة',
    initial: 'أ',
    color: 'g',
  },
  {
    text: '"تتبع ديون العملاء كان أصعب حاجة عندي. مع StockFlow أعرف مين مديون ومين سدد من غير ما أسأل حد."',
    name: 'محمود عبدالله',
    role: 'موزع مواد غذائية القاهرة',
    initial: 'م',
    color: 'o',
  },
  {
    text: '"التنبيهات لما أي صنف يقل عن الحد الأدنى أنقذتني أكتر من مرة، خصوصاً في الأدوية."',
    name: 'ناصر علي',
    role: 'صيدلي الإسكندرية',
    initial: 'ن',
    color: 'd',
  },
]

const faqItems = [
  { q: 'هل محتاج إنترنت عشان أستخدم التطبيق؟', a: 'لأ. التطبيق شغال Offline بالكامل — تفتح فواتير وتتابع المخزون من غير نت، وكل حاجة بتتزامن تلقائياً أول ما الإنترنت يرجع.' },
  { q: 'أقدر أشارك الشغل مع فريق العمل؟', a: 'أيوه. تضيف موظفين ومديرين بصلاحيات مرنة — أنت اللي تحدد كل واحد يشوف إيه ويعمل إيه بالظبط، من مالك كامل الصلاحيات لموظف شغال بالفواتير فقط.' },
  { q: 'هل بياناتي ومخزوني آمنة؟', a: 'بياناتك مشفرة بالكامل، مع نسخ احتياطي تلقائي على السحابة، وعزل كامل بين الشركات — كل شركة بتشوف بياناتها بس.' },
  { q: 'أقدر أصدّر التقارير Excel؟', a: 'أيوه. تصدّر تقارير المبيعات والمخزون والديون بصيغة Excel بضغطة واحدة، وتقدر كمان تستورد منتجاتك وعملاءك من ملفات Excel جاهزة.' },
  { q: 'أقدر أجرب قبل ما أدفع؟', a: 'أكيد. فيه خطة مجانية للأبد، ولو حبيت ترقي فجرب كل مزايا الخطط المدفوعة 14 يوم مجاناً — من غير بطاقة ائتمان وإلغاء في أي وقت.' },
  { q: 'التطبيق مناسب لمخزني؟', a: 'التطبيق مصمم للسوبر ماركت والموزعين والصيدليات والمطاعم والكافيهات وغيرهم، وبيتظبط على حجم شغلك — من مخزن صغير لسلسلة فروع بشركات متعددة.' },
]

const heroStats = [
  { value: '2 د', label: 'تجهيز أول شركة' },
  { value: '24/7', label: 'شغل Offline' },
  { value: 'Excel', label: 'استيراد وتصدير' },
]

const heroTrustPoints = ['بدون بطاقة ائتمان', 'تجربة 14 يوم مجاناً', 'إلغاء في أي وقت']

const dashboardMetrics = [
  { label: 'مبيعات اليوم', value: '18,450 ج.م', tone: 'g', icon: 'i-receipt', status: 'مدفوع' },
  { label: 'ديون مستحقة', value: '6,200 ج.م', tone: 'o', icon: 'i-wallet', status: 'جزئي' },
  { label: 'منتجات قاربت تخلص', value: '12 صنف', tone: 'r', icon: 'i-box', status: 'حرج' },
]

const dashNavItems = [
  { label: 'الرئيسية', icon: 'i-grid', active: true },
  { label: 'فواتير', icon: 'i-receipt' },
  { label: 'مخزون', icon: 'i-box' },
  { label: 'تقارير', icon: 'i-chart' },
  { label: 'إعدادات', icon: 'i-gear' },
]

const phoneMockup = {
  miniStats: [
    { value: '18,450 ج.م', label: 'مبيعات اليوم', icon: 'i-receipt', tone: 'g' },
    { value: '12', label: 'فاتورة', icon: 'i-receipt', tone: 'g' },
    { value: '6,200 ج.م', label: 'ديون مستحقة', icon: 'i-wallet', tone: 'o' },
  ],
  chartBars: [
    { day: 'س', h: 42 },
    { day: 'ح', h: 60 },
    { day: 'ن', h: 48 },
    { day: 'ث', h: 72 },
    { day: 'ر', h: 55 },
    { day: 'خ', h: 84 },
    { day: 'ج', h: 64, hot: true },
  ],
  invoices: [
    { num: '#102', name: 'أحمد المصري', amt: '1,250 ج.م', status: 'مدفوع', tone: 'g' },
    { num: '#101', name: 'شركة النور', amt: '3,800 ج.م', status: 'جزئي', tone: 'o' },
    { num: '#100', name: 'محمود سعيد', amt: '980 ج.م', status: 'مستحق', tone: 'r' },
  ],
}

function PhoneMockup() {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneIn}>
        <div className={styles.island} aria-hidden="true" />
        <div className={styles.dashHead}>
          <span className={styles.dashAva}>{icon('i-box')}</span>
          <div className={styles.dashTitle}><b>لوحة اليوم</b><span>السبت 14 أغسطس</span></div>
          <span className={styles.sync}>{icon('i-sync')}</span>
        </div>
        {dashboardMetrics.map((metric) => (
          <div className={styles.metric} key={metric.label}>
            <span className={`${styles.metricIc} ${styles[metric.tone]}`}>{icon(metric.icon)}</span>
            <div className={styles.metricTxt}><small>{metric.label}</small><b>{metric.value}</b></div>
            <span className={`${styles.st} ${styles[metric.tone]}`}>{metric.status}</span>
          </div>
        ))}
        <div className={styles.progress}>
          <div className={styles.progressRow}><b>تقدم التحصيل</b><small>78%</small></div>
          <div className={styles.bar}><i /></div>
        </div>
        <div className={styles.dashNav}>
          {dashNavItems.map((item) => (
            <div key={item.label} className={item.active ? styles.active : undefined}>
              {icon(item.icon)}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PhonePreviewMockup() {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneIn}>
        <div className={styles.island} aria-hidden="true" />
        <div className={styles.dashHead}>
          <span className={styles.dashAva}>{icon('i-box')}</span>
          <div className={styles.dashTitle}><b>الرئيسية</b><span>السبت 14 أغسطس</span></div>
          <span className={styles.sync}>{icon('i-sync')}</span>
        </div>
        <div className={styles.miniStats}>
          {phoneMockup.miniStats.map((mini) => (
            <div className={styles.mini} key={mini.label}>
              <span className={`${styles.miniIc} ${styles[mini.tone]}`}>{icon(mini.icon)}</span>
              <b>{mini.value}</b>
              <small>{mini.label}</small>
            </div>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>المبيعات — آخر ٧ أيام <small>ج.م</small></div>
          <div className={styles.chart} role="img" aria-label="مخطط مبيعات آخر سبعة أيام">
            {phoneMockup.chartBars.map((bar) => (
              <div className={styles.bc} key={bar.day} style={{ height: '100%' }}>
                <div className={`${styles.fill} ${bar.hot ? styles.hot : ''}`} style={{ height: `${bar.h}%` }} />
                <span>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>أحدث الفواتير <small>عرض الكل</small></div>
          {phoneMockup.invoices.map((inv) => (
            <div className={styles.inv} key={inv.num}>
              <div className={styles.invTxt}><b>فاتورة {inv.num}</b><small>{inv.name}</small></div>
              <span className={styles.amt}>{inv.amt}</span>
              <span className={`${styles.st} ${styles[inv.tone]}`}>{inv.status}</span>
            </div>
          ))}
        </div>
        <div className={styles.dashNav}>
          {dashNavItems.map((item) => (
            <div key={item.label} className={item.active ? styles.active : undefined}>
              {icon(item.icon)}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <IconSprite />
      <Nav />
      <ScrollReveal />

      <main id="top">
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={`${styles.heroGrid} container`}>
            <div>
              <span className={`kicker ${styles.anim}`} style={d('.05s')}><span className="dot" />إدارة المخازن والتوزيع بالكامل من جوالك</span>
              <h1 className={styles.anim} style={d('.15s')}>حوّل جوالك إلى <span className={styles.hl}>غرفة عمليات</span> للمخزن</h1>
              <p className={`${styles.lead} ${styles.anim}`} style={d('.25s')}>StockFlow يجمع الفواتير، المخزون، ديون العملاء، التقارير، وصلاحيات الفريق في تجربة عربية سريعة وواضحة. افتح التطبيق، شوف الصورة كاملة، واتخذ القرار قبل ما المشكلة تكبر.</p>
              <div className={`${styles.heroCtas} ${styles.anim}`} style={d('.35s')}>
                <Link href="/register" className="btn btn-primary">ابدأ مجاناً {icon('i-arrow')}</Link>
                <a href="#how" className="btn btn-secondary">شوف طريقة الشغل</a>
              </div>
              <div className={`${styles.heroStats} ${styles.anim}`} style={d('.45s')}>
                {heroStats.map((stat) => (
                  <div className={styles.stat} key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>
                ))}
              </div>
              <div className={`${styles.heroTrust} ${styles.anim}`} style={d('.55s')}>
                {heroTrustPoints.map((point) => (
                  <span className={styles.trustI} key={point}>{icon('i-check')} {point}</span>
                ))}
              </div>
            </div>
            <div className={`${styles.heroVisual} ${styles.anim}`} style={d('.3s')}>
              <div className={`${styles.float} ${styles.f1}`}>
                <span className={`${styles.fIc} ${styles.o}`}>{icon('i-bell')}</span>
                <div><b>تنبيه ذكي</b><small>المخزون قل — السكر 1 كجم وصل للحد الأدنى</small></div>
              </div>
              <PhoneMockup />
              <div className={`${styles.float} ${styles.f2}`}>
                <span className={`${styles.fIc} ${styles.g}`}>{icon('i-sync')}</span>
                <div><b>آخر مزامنة</b><small>منذ 4 دقائق — كل الفواتير محفوظة ومتزامنة</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* Business types */}
        <section className="section">
          <div className="container">
            <div className={`${styles.stripHead} reveal`}>
              <span className="kicker"><span className="dot" />جميع أنواع التجارة</span>
              <h2>صُمم لكل أنواع التجارة</h2>
            </div>
            <div className={`${styles.chips} reveal`} style={d('.1s')}>
              {businessTypes.map((type) => (
                <span className={styles.chip} key={type.label}>{icon(type.icon)} {type.label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />المميزات</span>
              <h2>كل حاجة مخزنك محتاجها، في تطبيق واحد</h2>
              <p>أدوات مكملة لبعض بداية من الفاتورة لحد التقرير — بدون مجلدات ورق ولا ملفات Excel مبعثرة.</p>
            </div>
            <div className={styles.feats}>
              {features.map((f, i) => (
                <article className={`${styles.feat} reveal`} style={d(`${i * 0.08}s`)} key={f.title}>
                  <div className={styles.featIc}>{icon(f.icon)}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Phone preview */}
        <section id="phone-preview" className={`section ${styles.phoneSec}`}>
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />التطبيق</span>
              <h2>شوف بنفسك — لوحة التحكم الرئيسية</h2>
              <p>صفحتك الأولى بعد ما تسجل دخولك: أرقامك، رسوم المبيعات، وأحدث الفواتير كلها في شاشة واحدة.</p>
            </div>
            <div className={`${styles.preview} reveal`} style={d('.1s')}>
              <PhonePreviewMockup />
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section id="permissions" className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />الصلاحيات</span>
              <h2>مش fixed roles — حدد بالظبط كل واحد يشوف إيه</h2>
              <p>ابدأ بقالب جاهز وعدّل عليه زي ما تحب. صلاحيات مرنة حتى على مستوى الحقل، وتقدر تظبطها بالشكل اللي يناسب فريقك.</p>
            </div>
            <div className={styles.roles}>
              {roleCards.map((role, i) => (
                <article className={`${styles.role} reveal`} style={d(`${i * 0.1}s`)} key={role.title}>
                  <div className={styles.roleHead}>
                    <span className={`${styles.roleIc} ${styles[role.color]}`}>{icon(role.icon)}</span>
                    <div><h3>{role.title}</h3><small>{role.note}</small></div>
                  </div>
                  {role.perms.map((perm) => (
                    <div className={styles.perm} key={perm.label}>
                      <span>{perm.label}</span>
                      <span className={`${styles.sw} ${perm.on ? styles.on : ''}`} aria-hidden="true" />
                    </div>
                  ))}
                  <p className={styles.permNote}>{role.noteText}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations + Security */}
        <section id="integrations" className="section">
          <div className="container">
            <div className={styles.grid2}>
              <article className={`${styles.g2Card} reveal`}>
                <div className={`${styles.g2Ic} ${styles.green}`}>{icon('i-layers')}</div>
                <h3>تكاملات جاهزة</h3>
                <p>شغّل StockFlow مع أدواتك اليومية — التكاملات جاهزة من غير برمجة.</p>
                <div className={styles.miniChips}>
                  {integrations.map((item) => (
                    <span key={item.label}>{icon(item.icon)} {item.label}</span>
                  ))}
                </div>
              </article>
              <article className={`${styles.g2Card} reveal`} style={d('.1s')}>
                <div className={`${styles.g2Ic} ${styles.orange}`}>{icon('i-shield')}</div>
                <h3>الأمان والخصوصية</h3>
                <p>بياناتك هي ثروتك — بنتعامل معاها كده فعلاً.</p>
                <ul className={styles.secList}>
                  {securityPoints.map((point) => (
                    <li key={point}><span className={styles.liIc}>{icon('i-check')}</span> {point}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Diff band */}
        <section className={`section ${styles.diff}`}>
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />ليه StockFlow</span>
              <h2>مش مجرد تطبيق مخازن — نظام متكامل</h2>
            </div>
            <div className={styles.diffGrid}>
              {diffCards.map((card, i) => (
                <article className={`${styles.diffCard} reveal`} style={d(`${i * 0.08}s`)} key={card.title}>
                  <div className={styles.diffIc}>{icon(card.icon)}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />طريقة العمل</span>
              <h2>جهز نفسك في ٣ خطوات</h2>
              <p>من التسجيل لبداية الشغل في أقل من دقيقتين.</p>
            </div>
            <div className={styles.steps}>
              {processSteps.map((step, i) => (
                <article className={`${styles.step} reveal`} style={d(`${i * 0.1}s`)} key={step.title}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />آراء العملاء</span>
              <h2>بيقولوا إيه عن StockFlow</h2>
            </div>
            <div className={styles.tst}>
              {testimonials.map((t, i) => (
                <article className={`${styles.tcard} reveal`} style={d(`${i * 0.1}s`)} key={t.name}>
                  <div className={styles.tq}>{icon('i-q')}</div>
                  <p>{t.text}</p>
                  <div className={styles.tcardFoot}>
                    <span className={`${styles.avatar} ${styles[t.color]}`}>{t.initial}</span>
                    <div><b>{t.name}</b><small>{t.role}</small></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />الأسعار</span>
              <h2>خطة تناسب حجم شغلك</h2>
              <p>ابدأ مجاناً للأبد، وارتقِ كل ما شغلك يكبر.</p>
            </div>
            <PricingToggle />
          </div>
        </section>

        {/* CTA band */}
        <section className="section">
          <div className="container">
            <div className={`${styles.ctaWrap} reveal`}>
              <h2>استعد تتحكم في مخزنك من جوالك</h2>
              <p>خطة مجانية، والتجهيز في دقيقتين. من غير بطاقة ائتمان، وإلغاء في أي وقت.</p>
              <div className={styles.ctaActions}>
                <Link href="/register" className="btn btn-primary">ابدأ مجاناً</Link>
                <a
                  className="btn btn-secondary"
                  href="https://play.google.com/store/apps/details?id=com.example.stockflow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon('i-play')} حمّله من Google Play
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="container">
            <div className="sec-head reveal">
              <span className="kicker"><span className="dot" />الأسئلة الشائعة</span>
              <h2>عندك سؤال؟ غالباً الإجابة هنا</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
