# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**비교계산소** (bigyocalc.com) — A Korean-language financial calculator platform. Users input values and get real-time comparisons. Built with Astro SSG; deploys to Cloudflare Pages on push to `main` (treat every push as production).

> **콘텐츠·UX·수익화·SEO 기준**: [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) 를 반드시 먼저 확인하세요. 새 페이지 작성 및 기존 페이지 수정 시 모두 적용됩니다.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build (always run before committing)
npm run preview      # preview production build locally
npm run og:generate  # OG 이미지 일괄 생성 (node scripts/generate-og.mjs)
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
- `SiteHeader.astro` / `SiteFooter.astro` — global nav + footer
- `CalculatorHero.astro` — top hero section with title/description
- `SummaryCards.astro` / `KpiCard.astro` — result display
- `ToolActionBar.astro` — reset + copy-link buttons
- `ToolTabs.astro` — tab navigation within a tool
- `InfoNotice.astro` — disclaimer/notice boxes
- `TrustPanel.astro` — data source trust indicators
- `SeoContent.astro` — SEO text block + FAQ section

### Data layer (`src/data/`)

- `tools.ts` — single source of truth for all tool metadata; drives homepage listing, `/tools/` library page, and badges
- `reports.ts` — report page metadata registry

**카테고리별 데이터 파일:**
| 카테고리 | 주요 파일 |
|---------|---------|
| 대기업 보너스 | `samsungCompensation.ts`, `skHynixCompensation.ts`, `hyundaiCompensation.ts`, `bonusSimulator.ts` |
| 급여·직군 | `itSalaryTop10.ts`, `salaryTierData.ts`, `policeSalary2026.ts`, `firefighterSalary2026.ts`, `nurseSalary2026.ts`, `newEmployeeSalary2026.ts`, `largeCompanySalaryGrowthByYears2026.ts` |
| 급여·직군 비교 | `itSiSmSalaryComparison2026.ts`, `insuranceSalaryBonusComparison2026.ts`, `constructionSalaryBonusComparison2026.ts`, `leeGovernmentOfficialsAssetsSalary2026.ts` |
| 부동산·주거 | `seoul84ApartmentPrices.ts`, `seoulHousing2016Vs2026.ts`, `seoulApartmentJeonseReport.ts` |
| 결혼 | `weddingBudget.ts`, `weddingCost2016Vs2026.ts`, `weddingGiftBreakEven.ts` |
| 육아·출산 | `babyGrowthPercentile.ts`, `babyCostGuideFirstYear.ts`, `babyCost2016Vs2026.ts`, `formulaCost.ts`, `diaperCost.ts`, `parentalLeaveShortWork.ts` |
| 투자·재무 | `fireCalculator.ts`, `dcaInvestment.ts`, `homePurchaseFund.ts`, `semiconductorEtf2026.ts`, `semiconductorValueChain.ts` |
| 리포트 | `usRichTop10Report.ts`, `koreaRichTop10Current.ts`, `koreanMovieBreakEvenProfit.ts`, `salaryAsset2016Vs2026.ts` |

### Utility scripts (`public/scripts/`)

도구별 `<slug>.js` 외 공통 유틸리티:
- `chart-config.js` — Chart.js 전역 설정 및 공통 옵션
- `url-state.js` — URL 파라미터 직렬화/복원 헬퍼
- `tool-library.js` — `/tools/` 라이브러리 페이지 필터링 로직

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

## 하네스 엔지니어링 문서 구조

세션 시작 시 `AGENT.md`(ROOT)를 먼저 확인합니다. 전체 문서 지도와 작업별 결정 트리가 포함되어 있습니다.

| 파일 | 역할 |
| --- | --- |
| `AGENT.md` | 에이전트 빠른 참조 · 문서 TOC · hard rules |
| `docs/ARCHITECTURE.md` | 코드 구조 전체 지도 · 파일 패턴 · 등록 체크포인트 |
| `docs/QUALITY_SCORE.md` | 배포 전 품질 루브릭 (빌드·콘텐츠·UX·SEO·코드) |
| `docs/SECURITY.md` | 보안 규칙 · API키 · XSS 방지 · 제휴링크 처리 |
| `docs/plan-docs/` | 기획 프로세스 가이드 · 인덱스 |
| `docs/design-docs/` | 설계 프로세스 가이드 · 패턴 모음 · 인덱스 |
| `docs/references/` | 외부 라이브러리·데이터 출처 레퍼런스 |
| `docs/exec-plans/` | 실행 계획 · 우선순위 · 스프린트 기록 |

## 문서 참고 우선순위

이 저장소의 작업 기준은 `CLAUDE.md`를 시작점으로 하고, 작업 유형에 따라 아래 문서를 우선 참고한다.

### 작업별 추천 참고 순서

| 작업 | 먼저 볼 문서 | 다음 참고 문서 |
| --- | --- | --- |
| 새 웹 콘텐츠/계산기 아이디어 기획 | `docs/plan/` 하위 기획 문서 | `CONTENT_GUIDE.md`, 관련 데이터 문서 |
| 기획 문서를 바탕으로 설계 정리 | `docs/plan/` 하위 기획 문서 | `docs/design/` 하위 설계 문서, `docs/UI_ARCHITECTURE.md`, `docs/CODE_SKILL.md` |
| 새 계산기 페이지 구현 | `docs/design/` 하위 설계 문서 | `CONTENT_GUIDE.md`, `docs/UI_ARCHITECTURE.md`, `docs/CODE_SKILL.md` |
| 새 리포트 페이지 작성/구현 | `docs/REPORT_CONTENT_GUIDE.md` | `CONTENT_GUIDE.md`, `docs/UI_ARCHITECTURE.md`, `docs/CODE_SKILL.md` |
| UI 컴포넌트/레이아웃 수정 | `docs/UI_ARCHITECTURE.md` | `docs/design/` 하위 설계 문서, `docs/CODE_SKILL.md` |
| 계산 로직/스크립트 구현 | `docs/CODE_SKILL.md` | `docs/design/` 하위 설계 문서 |
| SEO/애드센스 작업 | `docs/SEO_ADSENSE_ROADMAP.md` | `docs/MONTHLY_1M_GOAL.md`, `CONTENT_GUIDE.md` |
| 수익화/운영 전략 검토 | `docs/MONTHLY_1M_GOAL.md` | `docs/SEO_ADSENSE_ROADMAP.md`, `docs/plan/` 하위 기획 문서 |
| 배포 직전 점검 | `DEPLOY_CHECKLIST.md` | `docs/SITE_MANAGEMENT.md` |
| 도메인/DNS/배포 설정 변경 | `docs/SITE_MANAGEMENT.md` | `DEPLOY_CHECKLIST.md` |
| 다음 작업 우선순위 결정 | `docs/plan/` 하위 기획 문서 | `docs/MONTHLY_1M_GOAL.md`, `docs/SEO_ADSENSE_ROADMAP.md` |

---

## 각 MD 파일 역할 가이드

| 파일 | 역할 | 주로 참고하는 시점 |
| --- | --- | --- |
| `CLAUDE.md` | 프로젝트 개요, 작업 규칙, 주요 명령어, 참조 문서 허브 | Claude Code 세션 시작 시 자동 로드 |
| `CONTENT_GUIDE.md` | 콘텐츠 유형, UX, 제휴, SEO, 모바일 스펙 기준 | 새 페이지 기획/구현 시 필수 참고 |
| `DEPLOY_CHECKLIST.md` | main push 전 QA 및 배포 체크리스트 | 배포 직전 |
| `docs/SITE_MANAGEMENT.md` | 도메인, 배포, DNS, 환경변수 등 운영 정보 | 인프라/운영 설정 변경 시 |
| `docs/MONTHLY_1M_GOAL.md` | 월 수익 목표, 핵심 지표, 달성 전략 | 수익화 전략 검토 시 |
| `docs/SEO_ADSENSE_ROADMAP.md` | SEO/광고 단계별 진행 현황 및 우선순위 | SEO/광고 작업 계획 시 |
| `docs/UI_ARCHITECTURE.md` | 레이아웃 쉘, 디자인 토큰, SCSS 구조, UI 적용 기준 | UI 컴포넌트 설계/스타일 작업 시 |
| `docs/REPORT_CONTENT_GUIDE.md` | 리포트 페이지 전용 마크업, 데이터 패턴, 작성 기준 | `/reports/` 페이지 신규 작성 시 |
| `docs/CODE_SKILL.md` | Astro/JS/SCSS 구현 패턴 및 코드 레퍼런스 | 구현 중 패턴 참고 시 |
| `docs/plan/` 하위 문서 | 웹 기획 원본 문서 저장소. 페이지/계산기/리포트별 기획안을 계속 누적 관리 | 새 작업 주제 검토, 기획 확정, 우선순위 판단 시 |
| `docs/design/` 하위 문서 | 기획 문서를 바탕으로 비교계산소 기준 화면/컴포넌트/계산식/데이터 구조/구현 단계를 정리한 설계 문서 저장소 | 실제 구현 직전, Claude/Codex 개발 진행 시 |

---

## plan / design 문서 운용 원칙

### `docs/plan/`
- 웹 기획 원본 문서를 저장하는 폴더다.
- 기획 문서는 계속 추가되는 구조를 기본으로 한다.
- 예시:
  - `docs/plan/202603/ai-stack-calculator-v4-plan.md`
  - `docs/plan/202603/kbo-salary-content-plan.md`
- 각 문서는 주제별 배경, 목적, 타겟, 입력값/출력값, 섹션 구성, 데이터 요구사항, SEO 방향까지 포함하는 것을 권장한다.

### `docs/design/`
- `docs/plan/`의 기획 문서를 바탕으로 실제 구현 가능한 수준으로 풀어낸 설계 문서를 저장한다.
- 비교계산소 기준으로 아래 내용을 구조화한다.
  - 화면 구성
  - 컴포넌트 구조
  - 계산 로직
  - 상태 관리 방식
  - 데이터 파일 구조
  - 구현 순서
  - QA 포인트
- Claude/Codex는 실제 개발 시 `docs/design/` 문서를 우선 실행 기준으로 삼는다.

### 작업 흐름
1. `docs/plan/` 에 기획 문서 작성
2. 기획 문서를 기준으로 `docs/design/` 에 설계/개발 처리 단계 문서 작성
3. Claude/Codex는 `docs/design/` 문서를 보고 실제 구현 진행
4. 구현 완료 후 `DEPLOY_CHECKLIST.md` 기준으로 점검 및 배포

---

## 문서 사용 원칙

- `CLAUDE.md`는 **요약 허브**로 사용하고, 상세 기준은 각 전용 문서에서 관리한다.
- 새 작업은 항상 `docs/plan/` 문서 존재 여부부터 확인한다.
- 구현 전에는 반드시 대응되는 `docs/design/` 문서가 있는지 확인하고, 없으면 먼저 설계 문서를 정리한다.
- 리포트 페이지는 일반 계산기/콘텐츠 페이지와 기준이 다를 수 있으므로 `/reports/` 작업 시에는 `docs/REPORT_CONTENT_GUIDE.md`를 우선 기준으로 본다.
- 배포 전에는 반드시 `DEPLOY_CHECKLIST.md`를 기준으로 최종 확인한다.
- 운영/수익화/SEO 판단은 관련 문서의 현재 상태를 먼저 확인한 뒤 결정한다.

---

## 세션 시작 시 기본 확인 순서

1. `CLAUDE.md`
2. 현재 작업과 연결된 `docs/plan/` 문서
3. 필요 시 대응되는 `docs/design/` 문서
4. 구현 작업이면 `docs/UI_ARCHITECTURE.md` / `docs/CODE_SKILL.md`
5. 배포가 포함되면 마지막에 `DEPLOY_CHECKLIST.md`

---

## Source of Truth

- 콘텐츠/UX/SEO 기준: `CONTENT_GUIDE.md`
- UI 구조/스타일 기준: `docs/UI_ARCHITECTURE.md`
- 구현 패턴 기준: `docs/CODE_SKILL.md`
- 리포트 페이지 기준: `docs/REPORT_CONTENT_GUIDE.md`
- 배포 기준: `DEPLOY_CHECKLIST.md`
- 운영 인프라 기준: `docs/SITE_MANAGEMENT.md`
- 기획 원본 기준: `docs/plan/`
- 구현 설계 기준: `docs/design/`