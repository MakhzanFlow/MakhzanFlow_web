'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import styles from './Nav.module.css'

const navLinks = [
  { label: 'المميزات', href: '#features' },
  { label: 'الصلاحيات', href: '#permissions' },
  { label: 'الأسعار', href: '#pricing' },
  { label: 'الأسئلة', href: '#faq' },
  { label: 'طريقة العمل', href: '#how' },
]

export default function Nav() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.navInner} container`}>
        <a className={styles.brand} href="#top">
          <span className={styles.brandMark}>
            <svg><use href="#i-box" /></svg>
          </span>
          <span>StockFlow</span>
        </a>
        <nav className={styles.navLinks} aria-label="التنقل الرئيسي">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <div className={styles.navActions}>
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-primary btn-sm">لوحة التحكم</Link>
              <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">تسجيل الدخول</Link>
              <Link href="/register" className="btn btn-primary btn-sm">ابدأ مجاناً</Link>
            </>
          )}
          <button
            type="button"
            className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
            aria-label="القائمة"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`${styles.mMenu} ${menuOpen ? styles.open : ''}`} id="mobileMenu">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
        {user ? (
          <>
            <Link href="/dashboard" className="btn btn-primary" onClick={() => setMenuOpen(false)}>لوحة التحكم</Link>
            <button type="button" className="btn btn-secondary" onClick={() => { setMenuOpen(false); logout() }}>خروج</button>
          </>
        ) : (
          <Link href="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>ابدأ مجاناً</Link>
        )}
      </div>
    </header>
  )
}
