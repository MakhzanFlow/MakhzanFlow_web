# StockFlow Brand Guide

> Arabic-first warehouse and supermarket distribution management mobile app.

Built with Flutter and Supabase. Feature-first clean architecture, flutter_bloc, go_router, Arabic RTL mobile UX, Supabase/PostgreSQL with RLS, and XLSX reporting.

Extracted from https://github.com/hazzemSaid/stockflow-app.

## Brand Identity

**Name**: StockFlow (ستوك فلو)
**Tagline**: نظام إدارة المخازن الذكي (Smart Warehouse Management System)
**Version**: 1.0.0

The brand communicates reliability and professionalism through a forest green primary color on clean white surfaces. The warm orange secondary accent provides visual hierarchy for status differentiation.

> **Notable:** This design system was reconciled against the Flutter source code on 2026-07-11. The control radius was corrected from 14px to 16px based on `rControl = 16.0` in `stockflow_theme.dart`. Status colors were corrected from antd algorithm defaults to actual source values.

## Color Roles

| Role | Hex | Usage | Source |
| --- | --- | --- | --- |
| Background | `#F7F8F7` | Light warm gray page canvas | `app_colors.dart` |
| Surface | `#FFFFFF` | Cards, panels, modals | `app_colors.dart` |
| Foreground | `#0A0A0A` | Body text and headings | `app_colors.dart` |
| Secondary | `#0B3A24` | Primary text on dark headers, secondary greens | `app_colors.dart` |
| Muted | `#737373` | Secondary text and metadata | `app_colors.dart` |
| Muted Text | `#64748B` | Hint text, placeholders | `stockflow_theme.dart` |
| Border | `#E5E5E5` | Input borders, dividers | `app_colors.dart` |
| Accent | `#0F5132` | Primary CTAs, nav, app bars | `app_colors.dart` |
| Accent-secondary | `#F97316` | Secondary accent, partial status | `app_colors.dart` |
| Input Bg | `#FAFAFA` | Text input backgrounds | `app_colors.dart` |

### Status Colors

| State | Accent Text | Background |
| --- | --- | --- |
| Paid / Positive | `#0F5132` (Forest Green) | `#E8F1EC` (Soft Green) |
| Partial | `#F97316` (Warm Orange) | `#FFF1E6` (Light Orange) |
| Debt / Error | `#B91C1C` (Deep Red) | `#FEE2E2` (Soft Red) |

## Typography

- **Display / Body**: Cairo — weights 400, 500, 600, 700
- **Code**: System monospace (SFMono, Consolas)
- **Type scale**: 30px (display), 24px (title-lg), 18px (title-md), 14px (body), 12px (body-sm), 11px (label)
- **Line heights**: 1.2 / 1.3 / 1.35 / 1.6 / 1.55 / 1.4

## Layout

- **Control radius**: 16px (buttons, inputs, form fields) — corrected from 14px
- **Card radius**: 24px, green shadow `rgba(15,81,50,0.06)`
- **Dialog radius**: 28px
- **Button heights**: 48px (standard), 56px (primary CTA)
- **Input focus border**: 1.5px green (#0F5132)

## Logo

- `logos/stockflow-logo.png` — Primary wordmark (1380KB)
- `logos/stockflow-logo-alt.png` — Wordmark with tagline (1406KB)
- `logos/stockflow-app-icon.svg` — App icon (warehouse shelves + orange arrow)
- `logos/favicon.png` — 32×32 favicon

## Design Principles

1. **Light and clean**: White cards on warm gray background, generous white space
2. **Green-first**: Forest Green (#0F5132) for all primary actions
3. **16px control radius** (corrected from 14px): Consistent rounded corner language
4. **Status clarity**: Green=paid, Orange=partial, Red=debt — with dedicated bg/txt pairs
5. **RTL-first**: Full right-to-left layout for Arabic content
6. **Mobile-optimized**: 360dp minimum, stacked cards, full-width 56px CTAs
