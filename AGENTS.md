# AGENTS.md

## Project overview
- Brand: 비교계산소
- Domain: https://www.bigyocalc.com
- Stack: Astro static site
- Deployment: Cloudflare Pages + custom domain
- Goal: build SEO-friendly, mobile-first calculator landing pages in Korean

## Working style
- Keep implementation simple and shippable
- Prefer reusable Astro components
- Generate all user-facing copy in Korean
- Keep implementation planning and technical reasoning in English when explicitly requested
- Keep forms short by default
- Collapse advanced assumptions/settings
- Prioritize mobile usability and result visibility
- Preserve existing site tone and lightweight layout
- Prefer practical static-page patterns over heavy client frameworks

## Page patterns
- Most calculator pages follow: Astro page + data config TS file + page script in `public/scripts` + page-scoped SCSS
- Reuse existing shared layout/components before creating new abstractions
- Put calculator UI near the top of the page
- Show key KPI results before long explanatory content
- Keep explanatory sections SEO-friendly but concise
- Separate fact-based values, editable assumptions, and scenario-based values clearly in UI

## Content rules
- Do not present editable rank salary examples as official company data
- Future-year estimates must be labeled as scenarios, not forecasts
- Keep helper text short and practical
- FAQ must be visible on the page if FAQ structured content is used
- Comparison/reference content should stay secondary to the main calculator flow

## Mobile and UX rules
- Labels should appear above inputs
- Use large touch-friendly controls
- Avoid overly dense tables on mobile
- Convert dense comparison tables into cards, stacked rows, or mobile-safe matrix layouts
- Keep advanced sections in accordion/details blocks when possible
- Make result cards and summary values readable without excessive scrolling

## SEO and metadata
- Each landing page should have a strong H1, concise intro, FAQ, related links, and methodology/assumption section
- Add or update title, description, canonical, and OG metadata for new landing pages
- Add new public calculator pages to the static sitemap in `public/sitemap.xml`
- Keep pages useful for both direct search-entry users and returning users

## Project-specific notes
- Tool metadata lives in `src/data/tools.ts`
- Tool library page lives in `src/pages/tools/index.astro`
- Home page lives in `src/pages/index.astro`
- Global style entry is `src/styles/app.scss`
- Shared calculator shell/components already exist; reuse them where possible

## Quality checks
- Run the relevant build and checks after edits
- Review mobile layout carefully
- Avoid overly dense tables on mobile
- Confirm new routes build successfully
- When adding a new calculator page, verify tool listing, style import, and sitemap entry together
