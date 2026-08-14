# Design System Source Context

This file is generated during setup and should be treated as source evidence for the design-system project. Use it before writing or revising DESIGN.md, previews, tokens, UI kit examples, or assets.

## Company / Product

Canonical design-system title: Built a warehouse and Design System

Built a warehouse and supermarket distribution management system with inventory tracking, debt management, invoice generation, analytics dashboards, and Excel export using Flutter and Supabase.

## Source Links

- https://github.com/hazzemSaid/stockflow-app

## GitHub Repositories

- https://github.com/hazzemSaid/stockflow-app

Connector status: GitHub connector is not configured; repository intake will use local git credentials or authenticated GitHub CLI when possible.

### GitHub Connector Intake Runbook

GitHub repository intake is required before drafting the design system:
1. For each linked repository, run the bounded intake command before writing design-system files. The command tries this-device access first (`git clone`, then authenticated GitHub CLI via `gh auth login --web`) and uses the Composio GitHub connector only as a connector-platform fallback.
   - `"$OD_NODE_BIN" "$OD_BIN" tools connectors github-design-context --repo 'https://github.com/hazzemSaid/stockflow-app' --output context/github/hazzemSaid-stockflow-app.md`
2. Do not call GitHub connector tree/content/raw tools directly from the agent. Large repositories can trigger `CONNECTOR_OUTPUT_TOO_LARGE`; the bounded intake command is the only allowed GitHub repository intake path for this workflow.
3. The intake command selects design-system-relevant source files plus available logos/icons/fonts and writes a reviewable evidence note plus file snapshots under `context/github/`; keep those files as the source evidence for this design-system project.
4. If you already hit `CONNECTOR_OUTPUT_TOO_LARGE` or `CONNECTOR_RATE_LIMITED` from a direct connector call, do not stop and do not retry the same direct tool. Run the bounded intake command above, then inspect the written snapshots.
5. Treat `Read method: git-clone` as the preferred this-device path. Treat `Read method: connector` as valid connector-platform fallback evidence when local git/GitHub CLI could not read the repository.
6. The command is strict: if the bounded intake command cannot write snapshot files, stop and explain the permission, GitHub CLI login, connection, rate-limit, or clone problem. Do not use ad-hoc public GitHub browsing, memory, or URL-only inference for design-system files.
7. Inspect the generated evidence note plus snapshots for README, package manifests, Tailwind/theme/token files, global CSS, font declarations, component source for buttons/forms/navigation/cards/tables, layout shells, icons/logos/assets, and representative app entry files.
8. Use that evidence to create or update `DESIGN.md`, `colors_and_type.css`, `README.md`, `SKILL.md`, `preview/`, `ui_kits/app/`, `assets/`, and `fonts/` so the Design System tab can review the output as a reusable package.

## Local Code

Linked folders readable by the local agent: none.

Copied browser-selected code snapshot files under `context/local-code/`: none.

## Design And Brand Resources

Figma files selected: none.

Decoded Figma snapshots: none.
Fonts, logos, and assets selected: none.

Uploaded brand asset files under `assets/`: none.

## AI Optimize Reconciliation (2026-07-11)

### Measurements taken (from Flutter source code)
- **Primary evidence files:** `lib/config/theme/stockflow_theme.dart`, `lib/core/constants/app_colors.dart`, `lib/core/constants/app_sizes.dart`
- **Confirmed type scale:** 30/24/18/14/12/11px (Cairo, Google Fonts)
- **Confirmed radii:** 16px controls (`rControl = 16.0`), 24px cards (`rCard = 24.0`), 28px dialogs, 8px small, 36px xlarge
- **Confirmed spacing:** 4/8/16/24/32/48px (`app_sizes.dart:7-12`)
- **Confirmed line heights:** 1.2 display, 1.3 title-lg, 1.35 title-md, 1.6 body, 1.55 body-sm, 1.4 label
- **Confirmed status colors:** Paid `#0F5132` on `#E8F1EC`, Partial `#F97316` on `#FFF1E6`, Debt `#B91C1C` on `#FEE2E2`
- **Confirmed icon strokes:** 2.5 outlined, 0.83 thin, 3.0 logo
- **Confirmed shadow:** `mainGreen.withValues(alpha: 0.06)` on cards, zero elevation on app bar
- **Confirmed button heights:** 56px primary CTA, 48px standard
- **Confirmed input focus:** 1.5px green border
- **Confirmed welcome gradient:** `#1A7A4A` → `#050F09`

### Discrepancies fixed
1. **Control radius:** antd algorithm generated 14px from seed → corrected to **16px** (source value)
2. **colorError:** antd generated `#ff4d4f` → corrected to **`#b91c1c`** (source value)
3. **colorSuccess:** antd generated `#52c41a` → corrected to **`#16a34a`** (source value)  
4. **colorWarning:** antd generated `#faad14` → corrected to **`#f97316`** (warm orange, same as accent-secondary)
5. **Missing token - secondary:** `#0b3a24` added to palette (was missing from DESIGN.md and brand.json)
6. **Missing token - inputBg:** `#fafafa` added to palette
7. **Missing token - mutedText:** `#64748b` added to palette
8. **Missing shadow spec:** Card shadow `0 2px 8px rgba(15,81,50,0.06)` documented
9. **Missing motion spec:** Duration/easing tokens documented
10. **Missing line height spec:** All line height values documented
11. **controlHeight:** Corrected from 32px → 48px, controlHeightLG from 40px → 56px

### Files updated
- `DESIGN.md` — full rewrite with source citations, corrected radii, all missing tokens
- `brand.json` — all missing colors, status colors, shadow/motion/line-height sections
- `system/seed.json` — corrected colorSuccess, colorWarning, colorError, borderRadius, controlHeight
- `system/theme.json` — corrected matching fields
- `system/variables.css` — corrected --brand-color-success/warning/error/border-radius/control-height
- `system/variables.dark.css` — corrected matching fields with dark-mode variants
- `system/tokens.default.json` — corrected colorSuccess/Warning/Error, borderRadius, controlHeight
- `system/tokens.dark.json` — corrected matching fields
- `system/tokens.compact.json` — corrected status colors
- `system/BRAND-SYSTEM.md` — added reconciliation table documenting antd vs source discrepancies
- `BRAND.md` — corrected radius, added status color table, added source citations
- `guide.md` — corrected radius, simplified
- `README.md` — corrected radius in highlights, added elevation/motion
- `SKILL.md` — corrected radius, added component details
- `colors_and_type.css` — corrected --stockflow-radius-md (14px → 16px) and --stockflow-control-radius (14px → 16px)

### Left to do (artifacts need regeneration from updated seed)
- `system/index.html` — still uses old antd-generated 14px radius
- `system/kit.html`, `system/kit.dark.html` — same
- `system/artifacts/*.html` — all 6 generated artifacts still use old values
- `preview/*.html` — preview cards use old values
These are auto-generated from the antd algorithm and cannot be patched inline — they need `od brand finalize github-4884dc --json` to regenerate.

## Notes

No additional notes provided.

## Review Contract

- `/design-systems/create` only collected setup inputs. All GitHub extraction, website/source URL review, local evidence intake, source reading, design-system construction, package audit, and artifact writes should happen inside this project workspace.
- DESIGN.md is the canonical source of truth.
- Use the canonical design-system title above for headings, README/SKILL names, preview labels, and UI-kit copy unless inspected evidence proves a more accurate product name. Never title the system from URL protocol text such as `https`.
- colors_and_type.css should hold concrete reusable tokens when the source evidence supports them; if fonts/ contains preserved font files, colors_and_type.css must bind those files with @font-face, @import, or url(...) references so typography does not fall back to substitute fonts.
- README.md and SKILL.md should make the extracted system reusable as a real Open Design design-system package.
- README.md should include a source-backed Product Overview/Product Context section, source repository or source folder references, package contents, a concrete `## Preview Manifest` listing every generated `preview/*.html` card, and reuse workflow, similar to Claude Design exports.
- SKILL.md should include YAML frontmatter with `name`, `description`, and `user-invocable`, plus Claude-style reusable skill sections: What is inside, Source context, When to use this skill, How to use, and Design system highlights. The usage guidance should point agents at README.md, DESIGN.md, colors_and_type.css, preview/, assets/, build/, fonts/, source_examples/, and ui_kits/app/.
- README.md, SKILL.md, DESIGN.md, and ui_kits/app/README.md must describe the final focused preview cards and `ui_kits/app/` paths, not old scaffold names such as `preview/typography-scale.html` or `ui_kits/generated_interface/`.
- preview/ should contain small reviewable HTML cards for typography, color themes, spacing, radius, shadows, brand assets, and component evidence.
- source_examples/ or equivalent root/nested source files should preserve selected high-signal original components when snapshots include substantial app/component source, similar to Claude Design exports that keep files like SelectModelButton.tsx or ChatNavBar/index.tsx alongside the package. These examples should contain substantive original implementation code, not tiny stubs that only share the component name.
- ui_kits/app/ should contain an applied interface example, plus substantive role-based files under `ui_kits/app/components/` when the source snapshots include representative app shells, navigation, chat/input surfaces, or reusable components. `ui_kits/app/README.md` should explain structure, component files, usage, design notes, and source basis. `ui_kits/app/index.html` must load `../../colors_and_type.css`, must load/import/compose the modular component files, and must mount/render the composed interface instead of staying as a standalone generic static mock or disconnected script list. If the entry directly loads `.jsx`/`.tsx` files, include React, ReactDOM, and Babel standalone scripts and expose each loaded component as `window.ComponentName` / `globalThis.ComponentName`, or write compiled browser-ready JavaScript instead. For chat/workspace evidence, cover app shell, sidebar/navigation, assistant/list rail, chat area, input bar/composer, and message bubble/comment roles; the app shell component must compose those roles into one product-like surface. Placeholder component shells are not sufficient.
Claude-style UI-kit entry contract:
- When `ui_kits/app/components/*.jsx` or `*.tsx` files exist, `ui_kits/app/index.html` must behave like a runnable browser entry, not a static mock.
- Use the same structure as Claude Design exports: load React, ReactDOM, and Babel standalone scripts, load `../../colors_and_type.css`, create a `#root`, load each component script from `components/`, then render the composed `App` component.
- `App.jsx` must assign `window.App = App` (or `globalThis.App = App`), and every directly loaded component file must expose the same browser global for its component name.
- Use this skeleton for direct JSX component kits, replacing the component list only when evidence supports different names:
```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<link rel="stylesheet" href="../../colors_and_type.css">
<div id="root"></div>
<script type="text/babel" src="components/Sidebar.jsx"></script>
<script type="text/babel" src="components/AssistantsList.jsx"></script>
<script type="text/babel" src="components/ChatArea.jsx"></script>
<script type="text/babel" src="components/MessageBubble.jsx"></script>
<script type="text/babel" src="components/InputBar.jsx"></script>
<script type="text/babel" src="components/App.jsx"></script>
<script type="text/babel">
const { App } = window;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
</script>
```
- Preview cards and UI-kit visuals should explicitly label or model source-backed modules from the captured evidence instead of generic placeholder modules.
- assets/, build/, fonts/, and context/ should preserve logos, app icons, tray icons, installer/runtime icons, wordmarks, font files, provenance, and source notes for future projects.
Claude-style build asset contract:
- When evidence includes `context/.../files/build/...`, create a root `build/` directory and copy representative runtime assets there with their original filenames and path intent, such as `build/icon.png`, `build/logo.png`, `build/tray_icon.png`, and `build/icon.ico`.
- Copy those runtime assets byte-for-byte from the captured `context/.../files/...` snapshots. Do not redraw, re-encode, optimize, or substitute generated placeholders for files that the evidence already captured.
- Do not satisfy build/runtime icon evidence by only renaming those files into `assets/`. `assets/` may include convenience aliases, but root `build/` must preserve the source runtime files for future agents and package consumers.
- `preview/brand-assets.html` should reference at least some real preserved files from `build/` or `assets/` with `<img>`, `<picture>`, `<object>`, or CSS `url(...)`, and README.md / SKILL.md should mention `build/` in the package manifest when it exists.
- preview/brand-assets.html should visibly reference preserved files from assets/ or build/ instead of recreating logos/icons as inline placeholder drawings.
- GitHub evidence must come from the bounded `github-design-context` command, not direct connector tree/content/raw tool calls. The command tries this-device git first, authenticated GitHub CLI second, and connector-platform fallback only when local access cannot read the repository.
- Linked local folder evidence should come from the bounded `local-design-context` command, which writes a local evidence note and snapshots under `context/local-code/` before final design-system rules are drafted.
- Before marking the design system ready, run `"$OD_NODE_BIN" "$OD_BIN" tools connectors design-system-package-audit --path . --fail-on-warnings` and fix every reported error or warning.
- Draft design systems cannot be used by other projects until published.
