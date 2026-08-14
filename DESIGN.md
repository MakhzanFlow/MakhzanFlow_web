---
name: "StockFlow"
category: Brands
surface: web
colors:
  app-background: "#f7f8f7"
  pure-white: "#ffffff"
  near-black: "#0a0a0a"
  silver-gray: "#737373"
  light-gray-border: "#e5e5e5"
  forest-green: "#0f5132"
  warm-orange: "#f97316"
---

# StockFlow

> Category: Brands

> Surface: web

*Arabic-first warehouse and supermarket distribution management mobile app*

StockFlow is a warehouse and supermarket distribution management system with inventory tracking, debt management, invoice generation, analytics dashboards, and Excel export built with Flutter and Supabase. The app follows feature-first clean architecture with flutter_bloc, go_router, Arabic RTL mobile UX, Supabase/PostgreSQL with RLS, and XLSX reporting.

## Color Palette

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| background | App Background | `#f7f8f7` | Page canvas — light warm gray scaffold background |
| surface | Pure White | `#ffffff` | Cards, panels, modals, and elevated containers |
| foreground | Near Black | `#0a0a0a` | Primary body text and headings |
| muted | Silver Gray | `#737373` | Secondary text, metadata, hints, and captions |
| border | Light Gray Border | `#e5e5e5` | Card borders, input borders, dividers, and rules |
| accent | Forest Green | `#0f5132` | Primary action buttons, active navigation, app bars, key highlights |
| accent-secondary | Warm Orange | `#f97316` | Secondary accent, partial payment status, link color, badges |

## Typography
- **Display:** Cairo — weights 400, 500, 600, 700 — fallbacks: system-ui, -apple-system, Segoe UI, Roboto, sans-serif
- **Body:** Cairo — weights 400, 500, 600 — fallbacks: system-ui, -apple-system, Segoe UI, Roboto, sans-serif
- **Mono:** ui-monospace — weights 400, 600 — fallbacks: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace

## Voice & Tone

- **Adjectives:** Professional, Reliable, Clear, Efficient, Arabic-first, Utility-focused
- **Tone:** Professional and clear Arabic-first tone for warehouse and distribution management. UI copy is concise and instructional, using Egyptian Arabic (العربية المصرية) for navigation and labels, English for technical terms and the brand name. Error messages are helpful without being apologetic. Numbers and currency are emphasized for quick scanning.

### Messaging pillars
- Simplify inventory, sales, and debt management for Arabic-speaking distributors and supermarket owners
- Turn your phone into a complete warehouse management system — invoices, payments, customer tracking, and reports
- Real-time team collaboration with role-based permissions — ownership, management, and employee access levels
- Arabic-first RTL experience designed for the Egyptian market with intuitive navigation and quick actions

### Vocabulary
- **Use:** مخزن (warehouse), فاتورة (invoice), عميل (customer), منتج (product), مخزون (inventory), دين (debt), الرئيسية (dashboard), الإعدادات (settings), تسجيل الدخول (login), ج.م (EGP — Egyptian Pound currency suffix), إجمالي (total), خصم (discount)
- **Avoid:** English-only navigation in the Arabic interface, Left-to-right layout elements that break RTL flow, Complex financial jargon without Arabic equivalents, Fake or placeholder Arabic business names in demos

## Imagery

- **Style:** Clean mobile UI screenshots on light background. Flat illustrations for empty states. Status-colored icon badges (green = paid, orange = partial, red = debt). The app uses a Material 3 design system with moderate shadows and elevated card surfaces.
- **Subjects:** Dashboard with summary cards (today's sales, product count, total debts, customer count), Product management screens with inventory tracking and stock status, Invoice creation flow with customer selection, product picker, and payment method, Customer detail screens with transaction history and debt tracking, Team management and role-based permission screens
- **Treatment:** Card radius 24px, control radius 16px (corrected from earlier 14px). Clean white surfaces with green accent touches. Flat 2D interface with Material elevation for depth. Icons use outlined Material style (stroke width 2.5).
- **Avoid:** Dark mode or black backgrounds — the app is light-themed, Aggressive gradients except for the welcome/onboarding screen, Photography or photo-realistic imagery

## Layout

- **Radius:** 16px (controls), 24px (cards), 28px (dialogs), 8px (small), 36px (extra-large)
- **Border weight:** 1px (standard), 0.83px (thin/border), 1.5px (input focus)
- **Spacing:** 4px / 8px / 16px / 24px / 32px / 48px

### Posture rules
- Min design width: 360dp — all screens must work at this minimum
- Screen padding: 16px all sides
- Card radius: 24px with white background and rgba(15,81,50,0.06) shadow
- Control radius: 16px for inputs, buttons, and form fields
- Button minimum height: 48px (standard), 56px (primary CTA)
- Dialog radius: 28px — softer and more inviting
- Bottom navigation with 5 fixed destinations, selected item in green (#0F5132)
- Status color system: green (#0F5132 on #E8F1EC) for paid, orange (#F97316 on #FFF1E6) for partial, red (#B91C1C on #FEE2E2) for debt/negative
- Input fields: white background (#FAFAFA) with 0.83px light gray (#E5E5E5) border, focused state switches to 1.5px green border
- Full-width cards with zero margin in list contexts
- Content is always RTL (right-to-left) aligned
- Chips use StadiumBorder (999px radius), transparent border, 10px horizontal padding
- Divider: 1px #E5E5E5, zero space
- Icons: outlined Material style (stroke width 2.5)
