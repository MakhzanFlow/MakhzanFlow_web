'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './page.module.css'

// Metadata must be in a server component; we export it here for reference.
// The actual metadata export lives in a generateMetadata or layout override.

export default function PrivacyPage() {
  const headerRef = useRef<HTMLElement>(null)
  const sectionsRef = useRef<NodeListOf<Element> | null>(null)

  useEffect(() => {
    // Sticky header shadow
    const header = headerRef.current
    if (!header) return
    const onScroll = () => {
      header.classList.toggle(styles.scrolled, window.scrollY > 4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Intersection observer for reveal
    const sections = document.querySelectorAll(`.${styles.policySection}`)
    sectionsRef.current = sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.inView)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    sections.forEach((s) => observer.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className={styles.siteHeader} ref={headerRef} role="banner">
        <div className={styles.siteHeaderInner}>
          <Link href="/" className={styles.siteLogo} aria-label="StockFlow">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0f5132" />
              <path d="M8 16h16M16 8v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="4" stroke="#fff" strokeWidth="2" />
            </svg>
            StockFlow
          </Link>

          <nav className={styles.siteNav} role="navigation" aria-label="التنقل الرئيسي">
            <Link href="/">الرئيسية</Link>
            <Link href="/#features">المميزات</Link>
            <Link href="/#pricing">الباقات</Link>
            <Link href="/privacy" className={styles.active} aria-current="page">الخصوصية</Link>
            <Link href="/#cta" className={styles.navCta}>ابدأ الآن</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={`${styles.hero} ${styles.heroAnimate}`}>
        <div className={styles.heroInner}>
          <span className={styles.heroKicker}>قانوني</span>
          <h1 className={styles.heroTitle}>سياسة الخصوصية</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaItem}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              آخر تحديث: ١٠ يوليو ٢٠٢٦
            </span>
            <span className={styles.heroMetaItem}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              الإصدار ١.٠
            </span>
            <span className={styles.heroMetaItem}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              القانون المصري
            </span>
          </div>
        </div>
      </section>

      {/* ── TOC ──────────────────────────────────────────────── */}
      <div className={styles.content} style={{ paddingBottom: 0 }}>
        <div className={styles.tocWrap}>
          <h2 className={styles.tocTitle}>الانتقال السريع</h2>
          <nav className={styles.tocGrid} aria-label="Table of contents">
            {[
              ['#sec1','المقدمة'],['#sec2','البيانات'],['#sec3','الاستخدام'],
              ['#sec4','الجهات الخارجية'],['#sec5','التخزين والأمان'],['#sec6','الاحتفاظ'],
              ['#sec7','المشاركة'],['#sec8','حقوقك'],['#sec9','الأطفال'],
              ['#sec10','التغييرات'],['#sec11','القانون'],['#sec12','التواصل'],
            ].map(([href, label]) => (
              <a key={href} href={href} className={styles.tocLink}>{label}</a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className={styles.content} role="main">
        <div className={styles.contentInner}>

          {/* 1: Introduction */}
          <section className={styles.policySection} id="sec1" aria-labelledby="sec1-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec1-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">١</span>
                مقدمة
              </h2>
              <p className={styles.policySectionSubtitle}>نظرة عامة على سياسة الخصوصية ونطاق التطبيق</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>مرحباً بكم في سياسة خصوصية <strong>StockFlow</strong> («نحن»، «تطبيقنا»، «الخدمة»). توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لتطبيق إدارة المخازن والتوزيع الخاص بنا.</p>
              <p>باستخدامك للتطبيق، فإنك توافق على الممارسات الموضحة في هذه السياسة. نحن ملتزمون بحماية خصوصيتك وبياناتك وفقاً للقوانين المصرية المعمول بها، بما في ذلك قانون حماية البيانات الشخصية رقم ١٥١ لسنة ٢٠٢٠.</p>
              <p className={styles.mutedText}>تاريخ السريان: ١٠ يوليو ٢٠٢٦</p>
            </div>
          </section>

          {/* 2: Information We Collect */}
          <section className={styles.policySection} id="sec2" aria-labelledby="sec2-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec2-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٢</span>
                البيانات التي نجمعها
              </h2>
              <p className={styles.policySectionSubtitle}>معلومات الحساب، بيانات العمل، والمعلومات المجمعة تلقائياً</p>
            </div>
            <div className={styles.policySectionContent}>
              <h3>٢.١ المعلومات التي تقدمها طوعياً</h3>
              <p>عند إنشاء حساب أو استخدام ميزات التطبيق، نقوم بجمع المعلومات التالية:</p>
              <div className={styles.policyTableWrapper}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr><th>فئة البيانات</th><th>التفاصيل</th><th>الغرض</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>الحساب</strong></td><td>الاسم، البريد الإلكتروني، رقم الهاتف، كلمة المرور (مشفرة)</td><td>المصادقة، الأمان، التواصل</td></tr>
                    <tr><td><strong>ملف الشركة</strong></td><td>الاسم، العنوان، بيانات الضرائب، الشعار، العملة</td><td>إدارة ملف الأعمال، الفواتير، التقارير</td></tr>
                    <tr><td><strong>المنتجات</strong></td><td>الأسماء، الأسعار، الكميات، الصور، تواريخ الانتهاء، الباركود</td><td>إدارة المخزون، المبيعات، التنبيهات</td></tr>
                    <tr><td><strong>العملاء والموردين</strong></td><td>الأسماء، الهواتف، العناوين، الصور، السجلات المالية</td><td>إدارة العلاقات، الفواتير، تتبع الديون</td></tr>
                    <tr><td><strong>الفواتير</strong></td><td>معرف العميل، تفاصيل المنتجات، الكميات، الأسعار، الخصومات</td><td>إنشاء وإدارة الفواتير والمدفوعات</td></tr>
                    <tr><td><strong>الفريق</strong></td><td>أسماء أعضاء الفريق، الإيميلات، الصلاحيات، تواريخ الانضمام</td><td>إدارة الفريق والتعاون</td></tr>
                  </tbody>
                </table>
              </div>

              <h3>٢.٢ المعلومات المجمعة تلقائياً</h3>
              <div className={styles.policyTableWrapper}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr><th>البيانات</th><th>التفاصيل</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>أذونات الجهاز</strong></td><td>الكاميرا (بموافقتك فقط) لالتقاط صور المنتجات، العملاء، والشعارات</td></tr>
                    <tr><td><strong>بيانات الاستخدام</strong></td><td>بيانات تفاعل أساسية ضرورية لوظائف التطبيق</td></tr>
                    <tr><td><strong>التخزين المحلي</strong></td><td>معرف الشركة الأخير المحدد مخزن بأمان على جهازك للراحة</td></tr>
                  </tbody>
                </table>
              </div>

              <h3>٢.٣ المعلومات التي لا نجمعها</h3>
              <p>نحن <strong>لا</strong> نجمع:</p>
              <ul className={styles.policyList}>
                <li>بيانات GPS أو الموقع الدقيق</li>
                <li>معرّفات الجهاز (IMEI، IDFA، MAC address)</li>
                <li>جهات الاتصال أو دفتر العناوين</li>
                <li>سجلات الرسائل أو المكالمات</li>
                <li>بيانات التقويم</li>
                <li>حسابات وسائل التواصل الاجتماعي</li>
                <li>البيانات البيومترية</li>
                <li>سجل التصفح أو نشاط الويب</li>
                <li>بيانات صحية أو لياقة</li>
                <li>تسجيلات صوتية</li>
              </ul>
            </div>
          </section>

          {/* 3: How We Use */}
          <section className={styles.policySection} id="sec3" aria-labelledby="sec3-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec3-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٣</span>
                كيف نستخدم معلوماتك
              </h2>
              <p className={styles.policySectionSubtitle}>أغراض المعالجة والأساس القانوني</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>نستخدم المعلومات المجمعة فقط للأغراض التالية:</p>
              <ul className={styles.policyList}>
                <li><strong>تقديم الخدمة وصيانتها:</strong> إدارة المخزون، الفواتير، العملاء، والتقارير</li>
                <li><strong>المصادقة والأمان:</strong> حماية حسابك وبياناتك</li>
                <li><strong>تمكين التعاون:</strong> عمل الفريق ضمن شركتك مع صلاحيات محددة</li>
                <li><strong>إنشاء الفواتير والتقارير:</strong> لعملياتك التجارية</li>
                <li><strong>التواصل معك:</strong> حول حسابك، طلبات الدعم، أو التحديثات الهامة</li>
                <li><strong>تحسين الخدمة:</strong> تطوير الوظائف وتجربة المستخدم</li>
              </ul>
              <div className={styles.noticeBox} role="note">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className={styles.noticeBoxContent}>
                  <p className={styles.noticeBoxTitle}>لا نستخدم بياناتك لـ:</p>
                  <p className={styles.noticeBoxText}>الإعلان أو التسويق لأطراف ثالثة · بيع المعلومات الشخصية · تدريب نماذج الذكاء الاصطناعي · اتخاذ قرارات آلية تؤثر عليك بشكل جوهري</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4: Third-Party Services */}
          <section className={styles.policySection} id="sec4" aria-labelledby="sec4-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec4-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٤</span>
                خدمات الجهات الخارجية
              </h2>
              <p className={styles.policySectionSubtitle}>مقدمو الخدمة الذين نتعامل معهم لتشغيل التطبيق</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>نستخدم الخدمات التالية لتشغيل تطبيقنا:</p>
              <div className={styles.policyTableWrapper}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr><th>الخدمة</th><th>الغرض</th><th>البيانات المشتركة</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Supabase</strong></td><td>الخلفية الأساسية — المصادقة، قاعدة البيانات، تخزين الملفات، الدوال الخدمية</td><td>جميع بيانات الحساب، الشركات، المنتجات، العملاء، والفواتير</td></tr>
                    <tr><td><strong>image_picker</strong></td><td>الوصول للكاميرا ومعرض الصور لرفع الصور</td><td>فقط عند اختيارك صريحاً التقاط أو تحديد صورة</td></tr>
                    <tr><td><strong>flutter_secure_storage</strong></td><td>تخزين محلي آمن على جهازك</td><td>معرف الشركة الأخير المحدد (مخزن محلياً، لا يُرسل)</td></tr>
                    <tr><td><strong>cached_network_image</strong></td><td>تخزين مؤقت للصور لتحميل أسرع</td><td>صور من تخزين Supabase (مخزنة محلياً)</td></tr>
                  </tbody>
                </table>
              </div>
              <p className={styles.mutedText}>نحن <strong>لا</strong> نستخدم أي SDKs للتحليلات، خدمات تقارير الأعطال، شبكات إعلانية، أو SDKs لوسائل التواصل الاجتماعي.</p>
            </div>
          </section>

          {/* 5: Data Storage and Security */}
          <section className={styles.policySection} id="sec5" aria-labelledby="sec5-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec5-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٥</span>
                تخزين البيانات وأمانها
              </h2>
              <p className={styles.policySectionSubtitle}>التشفير، المصادقة، والحماية</p>
            </div>
            <div className={styles.policySectionContent}>
              <ul className={styles.policyList}>
                <li><strong>البيانات في السكون:</strong> جميع البيانات مخزنة بأمان على خوادم Supabase مع تشفير في حالة السكون.</li>
                <li><strong>البيانات في النقل:</strong> جميع الاتصالات بين التطبيق والخوادم مشفرة عبر HTTPS.</li>
                <li><strong>المصادقة:</strong> كلمات المرور مشفرة وتدار بأمان بواسطة Supabase Auth.</li>
                <li><strong>التخزين المحلي:</strong> البيانات الحساسة على جهازك مخزنة باستخدام flutter_secure_storage، والذي يستخدم مخزن المفاتيح الأصلي للمنصة.</li>
                <li><strong>تخزين الصور:</strong> جميع الصور المرفوعة مخزنة في Supabase Storage بمعرفات فريدة.</li>
              </ul>
            </div>
          </section>

          {/* 6: Data Retention */}
          <section className={styles.policySection} id="sec6" aria-labelledby="sec6-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec6-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٦</span>
                الاحتفاظ بالبيانات
              </h2>
              <p className={styles.policySectionSubtitle}>مدة الاحتفاظ وحذف البيانات</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>نحتفظ ببياناتك طالما كان حسابك نشطاً أو كما هو مطلوب لتقديم خدماتنا. يمكنك طلب حذف بياناتك في أي وقت (انظر القسم ٨).</p>
              <div className={styles.policyTableWrapper}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr><th>نوع البيانات</th><th>مدة الاحتفاظ</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>بيانات الحساب</td><td>حتى حذف الحساب</td></tr>
                    <tr><td>بيانات الشركة</td><td>حتى حذف الشركة أو الحساب</td></tr>
                    <tr><td>السجلات والنسخ الاحتياطية</td><td>لفترة معقولة وفقاً للوائح حماية البيانات المصرية</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 7: Data Sharing */}
          <section className={styles.policySection} id="sec7" aria-labelledby="sec7-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec7-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٧</span>
                مشاركة البيانات والإفصاح
              </h2>
              <p className={styles.policySectionSubtitle}>متى وكيف نشارك معلوماتك</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>نحن <strong>لا</strong> نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية لأطراف ثالثة.</p>
              <p>قد نفصح عن معلوماتك فقط في الحالات التالية:</p>
              <ul className={styles.policyList}>
                <li><strong>بموافقتك:</strong> عند موافقتك الصريحة على مشاركة بيانات معينة</li>
                <li><strong>الالتزام القانوني:</strong> للامتثال للالتزامات القانونية أو الطلبات من السلطات المصرية</li>
                <li><strong>حماية الحقوق:</strong> لحماية حقوقنا، خصوصيتنا، أماننا، وممتلكاتنا</li>
                <li><strong>نقل الأعمال:</strong> في سياق اندماج، استحواذ، أو بيع أصول</li>
              </ul>
            </div>
          </section>

          {/* 8: Your Rights */}
          <section className={styles.policySection} id="sec8" aria-labelledby="sec8-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec8-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٨</span>
                حقوقك واختياراتك
              </h2>
              <p className={styles.policySectionSubtitle}>حقوقك بموجب القانون المصري ولوائح حماية البيانات</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>بموجب القانون المصري ولوائح حماية البيانات المعمول بها، لديك الحقوق التالية:</p>
              <div className={styles.policyTableWrapper}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr><th>الحق</th><th>الوصف</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>الوصول</strong></td><td>طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك</td></tr>
                    <tr><td><strong>التصحيح</strong></td><td>طلب تصحيح البيانات غير الدقيقة أو غير المكتملة</td></tr>
                    <tr><td><strong>الحذف</strong></td><td>طلب حذف بياناتك الشخصية وحسابك</td></tr>
                    <tr><td><strong>التقييد</strong></td><td>طلب تقييد معالجة بياناتك</td></tr>
                    <tr><td><strong>النقل</strong></td><td>طلب نقل بياناتك إلى مزود خدمة آخر</td></tr>
                    <tr><td><strong>الاعتراض</strong></td><td>الاعتراض على معالجة بياناتك الشخصية</td></tr>
                    <tr><td><strong>سحب الموافقة</strong></td><td>سحب الموافقة في أي وقت حيث نعتمد على الموافقة في المعالجة</td></tr>
                  </tbody>
                </table>
              </div>
              <p>لممارسة أي من هذه الحقوق، يرجى التواصل معنا على <strong>haazemsaidd@gmail.com</strong>. سنرد على طلبك خلال ٣٠ يوماً كما يقتضي القانون المصري.</p>
            </div>
          </section>

          {/* 9: Children */}
          <section className={`${styles.policySection} ${styles.policySectionCompact}`} id="sec9" aria-labelledby="sec9-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec9-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">٩</span>
                خصوصية الأطفال
              </h2>
              <p className={styles.policySectionSubtitle}>حماية القُصّر</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>تطبيقنا غير مخصص للأطفال دون سن ١٣ عاماً. نحن لا نجمع عن قصد معلومات شخصية من الأطفال. إذا علمنا أن طفلاً دون ١٣ عاماً قدم لنا بيانات شخصية، سنتخذ خطوات لحذف هذه المعلومات فوراً.</p>
            </div>
          </section>

          {/* 10: Changes */}
          <section className={`${styles.policySection} ${styles.policySectionCompact}`} id="sec10" aria-labelledby="sec10-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec10-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">١٠</span>
                تغييرات على سياسة الخصوصية
              </h2>
              <p className={styles.policySectionSubtitle}>التحديثات والإشعارات</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>قد نحدّث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات عن طريق تحديث تاريخ «آخر تحديث» في أعلى هذه السياسة. في حالة التغييرات الجوهرية، قد نقدم إشعاراً إضافياً عبر التطبيق أو عبر البريد الإلكتروني.</p>
            </div>
          </section>

          {/* 11: Governing Law */}
          <section className={`${styles.policySection} ${styles.policySectionCompact}`} id="sec11" aria-labelledby="sec11-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec11-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">١١</span>
                القانون الحاكم
              </h2>
              <p className={styles.policySectionSubtitle}>الاختصاص القانوني</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>تخضع سياسة الخصوصية هذه وتفسر وفقاً لقوانين جمهورية مصر العربية، بما في ذلك قانون حماية البيانات الشخصية (القانون رقم ١٥١ لسنة ٢٠٢٠) واللوائح التنفيذية الخاصة به.</p>
            </div>
          </section>

          {/* 12: Contact */}
          <section className={`${styles.policySection} ${styles.policySectionHighlight}`} id="sec12" aria-labelledby="sec12-title">
            <div className={styles.policySectionHeader}>
              <h2 id="sec12-title" className={styles.policySectionTitle}>
                <span className={styles.sectionNum} aria-hidden="true">١٢</span>
                تواصل معنا
              </h2>
              <p className={styles.policySectionSubtitle}>للأسئلة، المخاوف، أو طلبات حقوق البيانات</p>
            </div>
            <div className={styles.policySectionContent}>
              <p>إذا كان لديك أي أسئلة أو مخاوف أو طلبات بخصوص سياسة الخصوصية هذه أو ممارساتنا في التعامل مع البيانات، يرجى التواصل معنا:</p>
              <div className={styles.contactCard}>
                <h3 className={styles.contactCardTitle}>معلومات التواصل</h3>
                <div className={styles.contactCardItem}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6L12 13L2 6" />
                  </svg>
                  <span>البريد الإلكتروني: <a href="mailto:haazemsaidd@gmail.com">haazemsaidd@gmail.com</a></span>
                </div>
                <div className={styles.contactCardItem}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>الهاتف: <a href="tel:+201224661310">01224661310</a></span>
                </div>
                <div className={styles.contactCardItem}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>الموقع: <a href="https://stockflow.app" target="_blank" rel="noopener">stockflow.app</a></span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className={styles.siteFooter} role="contentinfo">
        <div className={styles.siteFooterInner}>
          <div className={styles.siteFooterGrid}>
            <div className={styles.siteFooterBrand}>
              <h4>
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#0f5132" />
                  <path d="M8 16h16M16 8v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="16" r="4" stroke="#fff" strokeWidth="2" />
                </svg>
                StockFlow
              </h4>
              <p>نظام إدارة المخازن والتوزيع للمحلات وسلاسل السوبر ماركت - فواتير، مخزون، ديون، تقارير. عربي أولاً، مصمم للسوق المصري.</p>
            </div>
            <div className={styles.siteFooterCol}>
              <h5>المنتج</h5>
              <Link href="/#features">المميزات</Link>
              <Link href="/#pricing">الباقات</Link>
              <Link href="#">تحديثات</Link>
            </div>
            <div className={styles.siteFooterCol}>
              <h5>الشركة</h5>
              <Link href="#">عن StockFlow</Link>
              <Link href="#">المدونة</Link>
              <Link href="#">وظائف</Link>
            </div>
            <div className={styles.siteFooterCol}>
              <h5>مراجع</h5>
              <Link href="#">الدعم الفني</Link>
              <Link href="/privacy">سياسة الخصوصية</Link>
              <Link href="/delete-account">حذف الحساب</Link>
            </div>
          </div>
          <div className={styles.siteFooterBottom}>
            <p>© 2026 StockFlow · جميع الحقوق محفوظة</p>
            <div className={styles.siteFooterBottomLinks}>
              <Link href="/privacy">الخصوصية</Link>
              <Link href="/delete-account">حذف الحساب</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
