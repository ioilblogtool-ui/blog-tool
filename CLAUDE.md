# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**비교계산소** (bigyocalc.com) — A Korean-language financial calculator platform. Users input values and get real-time comparisons. Built with Astro SSG; deploys to Cloudflare Pages on push to `main` (treat every push as production).

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build (always run before committing)
npm run preview   # preview production build locally
```

No test suite exists. Manual verification per `DEPLOY_CHECKLIST.md` is the quality gate.

## Architecture

### How a calculator page works

Each tool is composed of four files:

| File | Purpose |
|------|---------|
| `src/pages/tools/<slug>.astro` | Page template: imports layout shell + components |
| `src/data/tools.ts` | Tool registry: metadata (slug, title, description, order, badges, previewStats) |
| `public/scripts/<slug>.js` | Client-side logic: DOM manipulation, calculations, Chart.js, URL params |
| `src/styles/scss/pages/_<slug>.scss` | Page-scoped styles |

### Layout shells (choose one per page)

- `SimpleToolShell.astro` — single calculator with inputs + result cards
- `CompareToolShell.astro` — side-by-side scenario comparison
- `TimelineToolShell.astro` — timeline/progression view

### Key shared components

- `BaseLayout.astro` — wraps every page; handles `<head>`, SEO meta, OG tags, JSON-LD
- `CalculatorHero.astro` — top hero section with title/description
- `SummaryCards.astro` / `KpiCard.astro` — result display
- `ToolActionBar.astro` — reset + copy-link buttons
- `SeoContent.astro` — SEO text block + FAQ section

### Data layer (`src/data/`)

- `tools.ts` — single source of truth for all tool metadata; drives homepage listing, `/tools/` library page, and badges
- Company-specific compensation data: `samsungCompensation.ts`, `skHynixCompensation.ts`, `hyundaiCompensation.ts`, `bonusSimulator.ts`
- Report data: `reports.ts`, `usRichTop10Report.ts`, `koreaRichTop10Current.ts`

### Styling

- `src/styles/app.scss` — global entry point; imports tokens + all page partials
- `src/styles/scss/_tokens.scss` — design tokens (colors, spacing, typography)
- `src/styles/scss/layouts/` — layout shell styles
- `src/styles/scss/pages/` — page-scoped partials (named `_<slug>.scss`)
- `src/styles/scss/_sliders.scss` — shared slider component styles

## Adding a New Calculator

1. Add entry to `src/data/tools.ts`
2. Create `src/pages/tools/<slug>.astro`
3. Create `public/scripts/<slug>.js`
4. Create `src/styles/scss/pages/_<slug>.scss` and import it in `src/styles/app.scss`
5. Add route to `public/sitemap.xml`
6. Run `npm run build` and verify the route appears in `dist/`

## Key Conventions

- All user-facing copy must be in Korean
- Mobile-first layout: input → summary → detail comparison structure
- Calculator inputs use `data-` attributes; scripts query the DOM directly (vanilla JS, no framework)
- URL parameter persistence for shareable calculator state
- Chart.js for data visualization
- Estimate/scenario values must be labeled `추정`, `참고`, or equivalent — never presented as official data
- `main` branch push = live production deploy; do not push with build errors or unfinished UI

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages automatically. Cloudflare Pages also picks up the `main` branch. Follow `DEPLOY_CHECKLIST.md` before every push.
