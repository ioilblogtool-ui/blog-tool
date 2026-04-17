# ARCHITECTURE.md — 비교계산소 최상위 구조

> 코드베이스 전체 지도. 새 파일을 추가하거나 기존 구조를 수정하기 전에 확인합니다.

---

## 1. 기술 스택

| 레이어 | 기술 | 비고 |
|---|---|---|
| 프레임워크 | Astro 4.x (SSG) | `npm run build` → 정적 파일 |
| 스타일 | SCSS (sass) | `src/styles/` |
| 차트 | Chart.js 4.x | CDN 로드, 각 페이지 JS에서 초기화 |
| 클라이언트 JS | Vanilla JS (IIFE/module) | React/Vue 없음 |
| 배포 | Cloudflare Pages + GitHub Actions | `main` push → 자동 배포 |
| OG 이미지 | Python Pillow 스크립트 | `scripts/generate-og-tools.py` |

---

## 2. 디렉토리 구조 전체 지도

```
blog-tool/
├── AGENT.md                    ← 에이전트 빠른 참조 (ROOT)
├── CLAUDE.md                   ← 프로젝트 규칙 허브
├── CONTENT_GUIDE.md            ← 콘텐츠·UX·SEO 기준
├── DEPLOY_CHECKLIST.md         ← 배포 전 QA 체크리스트
│
├── src/
│   ├── components/             ← 공유 Astro 컴포넌트
│   │   ├── BaseLayout.astro    ← 모든 페이지 최상위 레이아웃
│   │   ├── CalculatorHero.astro
│   │   ├── SeoContent.astro
│   │   ├── InfoNotice.astro
│   │   ├── SimpleToolShell.astro   ← 단일 계산기 레이아웃
│   │   ├── CompareToolShell.astro  ← 비교형 계산기 레이아웃
│   │   └── TimelineToolShell.astro ← 타임라인형 계산기 레이아웃
│   │
│   ├── data/                   ← 모든 페이지의 데이터 단일 출처 (TypeScript)
│   │   ├── tools.ts            ← 계산기 메타 등록 (slug, title, order, badges)
│   │   ├── reports.ts          ← 리포트 메타 등록
│   │   └── <feature>.ts        ← 페이지별 데이터 파일
│   │
│   ├── pages/
│   │   ├── index.astro         ← 홈페이지
│   │   ├── tools/
│   │   │   ├── index.astro     ← 계산기 라이브러리
│   │   │   └── <slug>.astro    ← 계산기 페이지
│   │   └── reports/
│   │       ├── index.astro     ← 리포트 목록
│   │       └── <slug>.astro    ← 리포트 페이지
│   │
│   └── styles/
│       ├── app.scss            ← 전체 SCSS 진입점 (모든 partial import)
│       ├── scss/_tokens.scss   ← 디자인 토큰 (색상·타이포·반경)
│       ├── scss/layouts/       ← 레이아웃 쉘 스타일
│       └── scss/pages/         ← 페이지별 partial (_<slug>.scss)
│
├── public/
│   ├── scripts/                ← 클라이언트 JS (slug.js, 공통 유틸)
│   │   ├── chart-config.js     ← Chart.js 전역 설정
│   │   ├── url-state.js        ← URL 파라미터 직렬화/복원
│   │   └── <slug>.js
│   ├── og/                     ← OG 이미지 PNG
│   └── sitemap.xml
│
├── docs/
│   ├── ARCHITECTURE.md         ← 지금 이 파일
│   ├── QUALITY_SCORE.md        ← 품질 루브릭
│   ├── SECURITY.md             ← 보안 규칙
│   ├── UI_ARCHITECTURE.md      ← UI 컴포넌트·SCSS 기준
│   ├── CODE_SKILL.md           ← 구현 패턴 레퍼런스
│   ├── REPORT_CONTENT_GUIDE.md ← 리포트 전용 기준
│   ├── plan/                   ← 기획 원본 문서 (YYYYMM/slug.md)
│   ├── design/                 ← 설계 문서 (YYYYMM/slug-design.md)
│   ├── plan-docs/              ← 하네스 기획 인덱스·템플릿
│   ├── design-docs/            ← 하네스 설계 인덱스·템플릿
│   ├── references/             ← 외부 레퍼런스 링크·요약
│   └── exec-plans/             ← 실행 계획·스프린트 계획
│
└── scripts/
    ├── generate-og-tools.py    ← OG 이미지 생성 (Python Pillow)
    └── generate-og.mjs         ← OG 생성 진입점
```

---

## 3. 계산기 페이지 4-파일 패턴

계산기 1개 = 아래 4개 파일이 항상 세트로 존재합니다.

```
src/data/<feature>.ts               ← 1. 데이터 단일 출처
src/pages/tools/<slug>.astro        ← 2. 마크업 템플릿
public/scripts/<slug>.js            ← 3. 클라이언트 인터랙션
src/styles/scss/pages/_<slug>.scss  ← 4. 페이지 전용 스타일
```

추가로 `src/data/tools.ts`에 메타 등록, `public/sitemap.xml`에 URL 추가, `src/styles/app.scss`에 `@use` import가 필요합니다.

---

## 4. 레이아웃 쉘 선택 기준

| 쉘 | 사용 조건 |
|---|---|
| `SimpleToolShell` | 입력 → 결과 단방향, 단일 계산기 |
| `CompareToolShell` | 좌/우 시나리오 병렬 비교 |
| `TimelineToolShell` | 연도별·단계별 진행 시각화 |
| 커스텀 (`BaseLayout` 직접) | 다단계 입력 + 복잡 결과, 리포트 페이지 |

---

## 5. 데이터 흐름

```
src/data/<feature>.ts
    ↓ (import in .astro frontmatter)
src/pages/tools/<slug>.astro
    ↓ (data-* attributes on DOM elements)
public/scripts/<slug>.js
    ↓ (DOM manipulation + Chart.js)
브라우저 렌더링
```

서버 → 클라이언트 데이터 전달은 `<div id="ai-data" data-tools={JSON.stringify(data)}>` 패턴 또는 canvas `data-*` 속성을 사용합니다.

---

## 6. SCSS 컨벤션

- **prefix 필수**: 페이지별 클래스는 `<slug>-` prefix 사용 (예: `np-`, `ai-`, `pc-`)
- **CSS 변수 미사용**: `var(--color-*)` 대신 하드코딩 색상 사용 (토큰은 `:root`에 없음)
- **중첩 허용**: SCSS 중첩으로 컴포넌트 스코프 분리
- **반응형 기준**: 모바일 우선 (480px, 640px, 820px breakpoint)

---

## 7. 등록 체크포인트 (신규 페이지)

계산기:
- [ ] `src/data/tools.ts` — slug, title, order, badges
- [ ] `src/pages/tools/index.astro` — 필요 시 카테고리 메타
- [ ] `src/pages/index.astro` — 홈 노출 메타
- [ ] `src/styles/app.scss` — `@use` 추가
- [ ] `public/sitemap.xml` — URL 추가

리포트:
- [ ] `src/data/reports.ts` — slug, title, order
- [ ] `src/pages/reports/index.astro` — eyebrow, tags, category
- [ ] `src/pages/index.astro` — category, isNew
- [ ] `src/styles/app.scss` — `@use` 추가
- [ ] `public/sitemap.xml` — URL 추가
