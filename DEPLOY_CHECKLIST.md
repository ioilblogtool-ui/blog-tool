# DEPLOY_CHECKLIST.md

## Purpose
- This checklist is for pre-push and pre-deploy review before changes are merged or pushed to `main`.
- In this project, pushing to `main` can reflect to the live Cloudflare Pages site, so treat `main` pushes as production-impacting.

## Release mindset
- Assume `main` push = real service update
- Check content, layout, calculator logic, and registration files together
- Prefer one extra visual pass over discovering issues on production

## 1. Git / scope check
- Run `git status`
- Confirm only intended files are included
- Check that no temporary files, screenshots, local notes, or debug changes are mixed in
- Check that unrelated pages were not accidentally changed
- If multiple calculators were touched, list the changed routes before push

## 2. Build check
- Run `npm run build`
- Confirm build finishes without errors or warnings that require follow-up
- Confirm newly added route is generated in build output
- If styles or scripts were added, confirm no missing import or broken asset path issue

## 3. Home page check
- Open `/`
- Confirm hero title and subcopy are the intended latest version
- Confirm the main CTA points to the expected destination
- Confirm the home search block renders correctly
- Confirm the count of operating calculators looks correct
- Confirm topic chips/buttons display properly
- Confirm search works with realistic keywords such as:
  - `연봉`
  - `성과급`
  - `육아휴직`
  - `가구`
- Confirm empty-state text appears properly when no result matches
- Confirm the newly added calculator appears in the home tool list
- Confirm tool badges and short descriptions feel accurate and not stale

## 4. Tool library page check
- Open `/tools/`
- Confirm new calculator is visible in the correct order
- Confirm category/topic mapping is correct
- Confirm search works by:
  - tool title
  - slug-like keyword
  - topic keyword
- Confirm filter chips narrow the list correctly
- Confirm result count updates properly
- Confirm no literal formatting artifacts such as:
  - `` `r`n ``
  - broken quotes
  - malformed text

## 5. Calculator page content check
- Open the updated calculator page(s)
- Confirm H1, intro copy, and section headings are final
- Confirm fact anchor values are correct and labeled as public reference values where needed
- Confirm user-input values are not phrased like official company/government numbers
- Confirm scenario or estimate-based values are clearly marked
- Confirm helper text is concise and not overly internal/meta
- Confirm FAQ is visible on the page
- Confirm related calculator links are relevant and working

## 6. Calculator interaction check
- Test default state with page first load
- Change major inputs and confirm results update correctly
- Check reset button
- Check copy-link button
- Check quick inputs and advanced settings
- Confirm advanced settings are collapsed by default where expected
- Confirm toggles behave correctly
- Confirm no stale values remain after changing presets
- Confirm edge cases such as:
  - zero spouse income
  - zero bonus
  - large salary input
  - toggle off estimate or optional compensation

## 7. Result quality check
- Confirm KPI cards show the most important outputs first
- Confirm annual summary values look consistent with input values
- Confirm monthly summary values match annual totals logically
- Confirm estimate labels use words like `추정`, `참고`, or equivalent when needed
- Confirm comparison cards or position sections still make sense after input changes
- Confirm no negative, `NaN`, or empty broken numbers appear unexpectedly

## 8. Layout / responsive check
- Check desktop width
- Check tablet-ish width
- Check mobile width
- Confirm no awkward label wrapping in PC two-column forms
- Confirm long labels are still readable on mobile
- Confirm cards do not overflow horizontally
- Confirm tables or matrix layouts remain readable on small screens
- Confirm sticky actions, if any, do not cover important content
- Confirm spacing between sections feels intentional and not broken by recent edits

## 9. Content polish check
- Read the page top-to-bottom once like a first-time user
- Check for duplicated sentences
- Check for internal planning text accidentally shown to users
- Check for “design explanation” style copy that should not be visible
- Check typo consistency for:
  - `세전`
  - `실수령 추정`
  - `총보상`
  - `기준 중위소득`
  - brand name `비교계산소`
- Confirm labels are consistent across similar pages

## 10. SEO / discoverability check
- Confirm `title` and `description` are updated for the final page intent
- Confirm the page is useful as a search-entry landing page without extra context
- Confirm FAQ is visible if FAQ content is included for SEO reasons
- Confirm related internal links are live
- Confirm the new route is added to `public/sitemap.xml`
- Confirm the new calculator appears in:
  - `src/data/tools.ts`
  - home page list
  - `/tools/` page list

## 11. Registration file check
- Review these files when a new calculator is added:
  - `src/data/tools.ts`
  - `src/pages/tools/index.astro`
  - `src/pages/index.astro`
  - `src/styles/app.scss`
  - `public/sitemap.xml`
- Confirm page-specific files exist and are connected:
  - `src/pages/tools/...`
  - `src/data/...`
  - `public/scripts/...`
  - `src/styles/scss/pages/...`

## 12. Production safety check
- Ask: “If this goes live immediately after push, is it acceptable?”
- Confirm no placeholder values are being presented as official facts
- Confirm experimental UI is not half-finished
- Confirm comparison/reference sections are secondary and not misleading
- Confirm new pages do not break the site-wide tone or navigation

## 13. Push decision
- If all checks pass, push to `main`
- Remember: `main` push may deploy straight to production on Cloudflare Pages
- Do not push to `main` if there is any unresolved visual or content doubt on a public-facing page

## 14. Post-deploy live check
- Open the live domain after deployment completes
- Check:
  - `/`
  - `/tools/`
  - the updated calculator page
- Confirm the latest content actually appears on the live domain
- Confirm no caching issue is hiding the update
- Re-run one real user flow on production
- If SEO-related page changed, note the final live URL for later search console or advisor submission

## Recommended command sequence
1. `git status`
2. `npm run build`
3. Visual check on home, `/tools/`, and updated pages
4. Final content and registration review
5. `git add ...`
6. `git commit -m "..."`
7. `git push origin main`
8. Live site verification

## Fast route checklist for this project
- Home page reflects latest hero/search/tool-list changes
- `/tools/` shows new tool and correct category/filter/search behavior
- Updated calculator route builds and renders
- Tool metadata is registered
- Global style import is added
- Sitemap entry is added
- Build passes
- Live site reflects the intended final copy and layout
