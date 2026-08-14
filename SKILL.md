---
name: "StockFlow Design System"
description: "Arabic-first warehouse management mobile app design system with Forest Green primary, Warm Orange accent, and Cairo typography"
user-invocable: false
---

# StockFlow Design System Skill

Use this skill when designing or building interfaces for the StockFlow brand — an Arabic-first warehouse and supermarket distribution management mobile app.

## What is inside

- `DESIGN.md` — Full design specification (colors, typography, components, layout posture)
- `BRAND.md` — Concise brand guide
- `colors_and_type.css` — Reusable CSS custom properties
- `brand.json` — Machine-readable brand tokens
- `logos/` — Logo files (primary wordmark, alternates, favicons)
- `system/` — Generated design tokens, CSS variables, artifacts
- `preview/` — Focused preview cards

## Source context

Extracted from https://github.com/hazzemSaid/stockflow-app via git-clone intake. The app is a Flutter + Supabase mobile application following feature-first clean architecture with flutter_bloc, go_router, and Arabic RTL mobile UX.

## When to use this skill

- Designing any app UI for StockFlow or related warehouse/distribution products
- Building Flutter screens using the StockFlow component library
- Creating marketing materials or pitch decks for StockFlow
- Generating color-consistent mockups and prototypes

## How to use

1. Read `README.md` for package overview and `DESIGN.md` for full specification
2. Import `colors_and_type.css` for CSS custom properties
3. Reference `preview/` cards for visual examples
4. Use `logos/` for brand marks
5. Apply the 7-color role system from `brand.json`

## Design system highlights

- **Forest Green** `#0F5132` — primary action color, app bars, navigation
- **Dark Green** `#0B3A24` — secondary/primary text color in many contexts
- **Warm Orange** `#F97316` — secondary accent, partial payment status
- **Cairo** — Arabic-optimized Google Font at weights 400–700
- **Type scale**: 30px (display, 700), 24px (title-lg, 500), 18px (title-md, 500), 14px (body, 400), 12px (body-sm, 400), 11px (label, 400)
- **16px radius** for controls (corrected from 14px — measured `rControl = 16.0` in Flutter source), **24px radius** for cards, **28px radius** for dialogs
- **RTL-first** layout, 360dp minimum width, light warm gray background `#F7F8F7`
- **Status color system**: Green = paid (#0F5132 on #E8F1EC), Orange = partial (#F97316 on #FFF1E6), Red = debt (#B91C1C on #FEE2E2)
- **Components**: 56px primary CTA (16px radius), 48px compact buttons (16px radius), 5-tab bottom nav, stadium chips, input bg #FAFAFA (16px radius, 1.5px focus border)
- **Elevation**: Cards 0 2px 8px rgba(15,81,50,0.06), Dialogs 0 8px 32px rgba(0,0,0,0.12)
- **Motion**: Fast 0.1s, Mid 0.2s, Slow 0.3s with ease-in-out/ease-out curves
- **Source evidence**: Extracted via git-clone from Flutter + Supabase source code. See `context/github/hazzemSaid-stockflow-app.md`.
