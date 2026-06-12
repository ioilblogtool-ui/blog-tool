# 모바일 UX 개선 — 설계 문서

> 기획 원문: `docs/plan/202606/mobile-ux-improvement-plan.md`
> 작성일: 2026-06-12
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 영향 파일: `src/components/SiteHeader.astro`, `src/styles/scss/_legacy.scss`, `src/data/tools.ts`, `src/data/reports.ts`
> 1차 구현 범위: 검색 + 아코디언 + 인기 계산기 Top 6 (기획 문서 0-1 항목)
> 2차/3차(광고 슬롯, 접근성)는 9장·10장에 개요만 정리, 별도 단계에서 상세화

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202606/mobile-ux-improvement-plan.md`
- 구현 대상: 전 페이지 공통 `SiteHeader.astro`의 **모바일 메뉴(`#mobile-menu`)**
- 콘텐츠 유형: 공통 컴포넌트 (계산기/리포트 페이지가 아님)
- 데스크톱 `.site-nav` 드롭다운은 **변경 없음** — 모바일(`max-width: 768px`)에서만 동작 변경

### 1-2. 핵심 변경 요약

| 영역 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 메뉴 최상단 | 없음 | 검색 input (`role="search"`) |
| 검색어 없음 | 4개 섹션 전체 펼침 (36개 링크) | "인기 계산기 Top 6" 고정 섹션 + 4개 섹션 아코디언 (계산기만 기본 펼침) |
| 검색어 있음 | 해당 없음 | 계산기/리포트 그룹별 결과(최대 6개) + "전체 결과 보기" 링크 |
| 데이터 소스 | 정적 마크업 36개 `<a>` 하드코딩 | `tools.ts`/`reports.ts`에서 빌드 시 생성한 검색용 JSON + 기존 정적 마크업(아코디언 본문)은 유지 |

### 1-3. 핵심 결정 재확인 (기획 문서 0장 기준)

- 신규 데이터 파일 생성하지 않음 — `tools.ts` + `reports.ts` 그대로 사용
- 검색은 클라이언트 사이드, `includes()` 부분 일치, 디바운스 150ms
- 검색 결과는 계산기/리포트 그룹 분리, 그룹별 최대 6개
- 인기 계산기 Top 6은 하드코딩 slug 배열(`MOBILE_POPULAR_SLUGS`)로 관리

---

## 2. 파일 구조 / 영향 범위

```
src/
  components/
    SiteHeader.astro        # 모바일 메뉴 마크업 + script 수정
  data/
    tools.ts                # MOBILE_POPULAR_SLUGS 상수 추가
  styles/scss/
    _legacy.scss            # 검색 input, 아코디언, Top6, 검색결과 스타일 추가
```

신규 파일 없음. `reports.ts`는 읽기만 하고 수정하지 않음.

---

## 3. 데이터 설계

### 3-1. `tools.ts`에 추가할 상수

```ts
// tools.ts 파일 하단, export const tools 배열 뒤에 추가
export const MOBILE_POPULAR_SLUGS: string[] = [
  "salary-tier",
  "household-income",
  "single-parental-leave-total",
  "dca-investment-calculator",
  "fire-calculator",
  "national-pension-calculator",
];
```

- 운영 중 교체는 이 배열만 수정하면 됨 (코드 로직 변경 불필요)
- slug가 `tools` 배열에 존재하지 않으면 렌더링 시 자동으로 스킵 (방어 로직, 4-3 참고)

### 3-2. 검색용 JSON 데이터 (빌드 시 생성)

`SiteHeader.astro`의 frontmatter(`---` 블록)에서 `tools.ts`/`reports.ts`를 import해 검색용 경량 배열을 만들고, `<script type="application/json" id="mobile-search-data">`로 페이지에 inline 주입한다.

```ts
// SiteHeader.astro frontmatter
import { tools, MOBILE_POPULAR_SLUGS } from "../data/tools";
import { reports } from "../data/reports";

const searchIndex = [
  ...tools.map((t) => ({
    type: "tool" as const,
    slug: t.slug,
    title: t.title,
    description: t.description,
    category: t.category ?? "",
    href: withBase(`/tools/${t.slug}/`),
  })),
  ...reports.map((r) => ({
    type: "report" as const,
    slug: r.slug,
    title: r.title,
    description: r.description,
    category: "",
    href: withBase(`/reports/${r.slug}/`),
  })),
];

const popularTools = MOBILE_POPULAR_SLUGS
  .map((slug) => tools.find((t) => t.slug === slug))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));
```

- `searchIndex`는 JSON.stringify되어 `<script type="application/json" id="mobile-search-data">{JSON.stringify(searchIndex)}</script>`로 출력
- 총 항목 수는 약 98(tools) + 109(reports) ≈ 207개, title+description+category만 포함하므로 payload는 수십 KB 수준 — 페이지마다 inline되는 비용이 있으나 BaseLayout이 모든 페이지에 SiteHeader를 포함하므로 불가피. gzip 압축으로 실제 전송량은 크지 않음 (1차에서는 허용, 추후 페이지 크면 별도 정적 JSON 분리 검토)

---

## 4. 마크업 구조 (SiteHeader.astro)

### 4-1. 모바일 메뉴 전체 구조 (변경 후)

```html
<div class="site-header__mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="site-header__mobile-inner">

    <!-- 신규: 검색 -->
    <div class="site-header__mobile-search" role="search">
      <input
        type="search"
        id="mobile-search-input"
        class="site-header__mobile-search-input"
        placeholder="계산기·리포트 검색 (예: 연봉, 보유세)"
        autocomplete="off"
      />
    </div>

    <!-- 신규: 검색 결과 영역 (기본 hidden) -->
    <div class="site-header__mobile-search-results" id="mobile-search-results" hidden>
      <div class="site-header__mobile-section" id="mobile-search-tools" hidden>
        <p class="site-header__mobile-label">계산기</p>
        <div class="site-header__mobile-links"></div>
      </div>
      <div class="site-header__mobile-section" id="mobile-search-reports" hidden>
        <p class="site-header__mobile-label">리포트</p>
        <div class="site-header__mobile-links"></div>
      </div>
      <p class="site-header__mobile-empty" id="mobile-search-empty" hidden>
        검색 결과가 없습니다.
      </p>
      <a class="site-header__mobile-cta" id="mobile-search-all" href={withBase("/tools/")}>
        전체 계산기 보기 →
      </a>
    </div>

    <!-- 기존 콘텐츠: 검색어 없을 때만 표시 -->
    <div class="site-header__mobile-default" id="mobile-menu-default">

      <!-- 신규: 인기 계산기 Top 6 -->
      <div class="site-header__mobile-section site-header__mobile-section--popular">
        <p class="site-header__mobile-label">인기 계산기</p>
        <div class="site-header__mobile-links">
          {popularTools.map((tool) => (
            <a href={withBase(`/tools/${tool.slug}/`)}>
              <span>{tool.title}</span>
              <span class="site-header__mobile-cat">{tool.category}</span>
            </a>
          ))}
        </div>
      </div>

      <!-- 기존 4개 섹션 → 아코디언으로 전환 -->
      <div class="site-header__mobile-accordion" data-default-open>
        <button class="site-header__mobile-label site-header__mobile-accordion-btn" aria-expanded="true" aria-controls="mobile-acc-tools">
          계산기 <span class="site-header__mobile-accordion-icon" aria-hidden="true">▾</span>
        </button>
        <div class="site-header__mobile-links" id="mobile-acc-tools">
          <!-- 기존 17개 <a> 그대로 유지 -->
        </div>
      </div>

      <div class="site-header__mobile-accordion">
        <button class="site-header__mobile-label site-header__mobile-accordion-btn" aria-expanded="false" aria-controls="mobile-acc-reports">
          리포트 <span class="site-header__mobile-accordion-icon" aria-hidden="true">▾</span>
        </button>
        <div class="site-header__mobile-links" id="mobile-acc-reports" hidden>
          <!-- 기존 11개 <a> 그대로 유지 -->
        </div>
      </div>

      <div class="site-header__mobile-accordion">
        <button class="site-header__mobile-label site-header__mobile-accordion-btn" aria-expanded="false" aria-controls="mobile-acc-compare">
          비교표 <span class="site-header__mobile-accordion-icon" aria-hidden="true">▾</span>
        </button>
        <div class="site-header__mobile-links" id="mobile-acc-compare" hidden>
          <!-- 기존 5개 <a> 그대로 유지 -->
        </div>
      </div>

      <div class="site-header__mobile-accordion">
        <button class="site-header__mobile-label site-header__mobile-accordion-btn" aria-expanded="false" aria-controls="mobile-acc-site">
          사이트 <span class="site-header__mobile-accordion-icon" aria-hidden="true">▾</span>
        </button>
        <div class="site-header__mobile-links" id="mobile-acc-site" hidden>
          <!-- 기존 3개 <a> 그대로 유지 -->
        </div>
      </div>

      <a class="site-header__mobile-cta" href={withBase("/tools/")}>전체 계산기 보기 →</a>
    </div>

  </div>
</div>

<script type="application/json" id="mobile-search-data" set:html={JSON.stringify(searchIndex)} />
```

> 주의: Astro에서 JSON을 안전하게 inline하려면 `set:html={JSON.stringify(searchIndex)}` 사용 (자동 escape로 인한 깨짐 방지). `JSON.stringify` 결과에 `</script>`가 포함될 수 있는 description 텍스트가 있다면 `.replace(/<\/script/gi, "<\\/script")` 처리 필요 — `tools.ts`/`reports.ts` 텍스트에 `</script>` 문자열이 없는지 확인했으므로 1차에서는 생략 가능하나, 안전을 위해 replace 처리 포함 권장.

### 4-2. 기존 4개 섹션과의 매핑

| 기존 `.site-header__mobile-section` | 변경 후 |
| --- | --- |
| `<p class="...label">계산기</p>` + `.mobile-links` (17개) | `.mobile-accordion` (button + `#mobile-acc-tools`, 기본 펼침) |
| `<p class="...label">리포트</p>` + `.mobile-links` (11개) | `.mobile-accordion` (button + `#mobile-acc-reports`, 기본 접힘) |
| `<p class="...label">비교표</p>` + `.mobile-links` (5개) | `.mobile-accordion` (button + `#mobile-acc-compare`, 기본 접힘) |
| `<p class="...label">사이트</p>` + `.mobile-links` (3개) | `.mobile-accordion` (button + `#mobile-acc-site`, 기본 접힘) |

내부 `<a>` 링크 마크업(badge, cat span 포함)은 **그대로 유지** — `<p class="...label">`만 `<button class="...accordion-btn">`으로 바꾸고 `aria-expanded`/`aria-controls`/`id` 속성만 추가.

### 4-3. `popularTools` 방어 로직

```ts
const popularTools = MOBILE_POPULAR_SLUGS
  .map((slug) => tools.find((t) => t.slug === slug))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));
```

존재하지 않는 slug는 자동으로 빠지므로, 추후 도구가 삭제/리네임되어도 빌드 에러 없이 해당 항목만 사라짐.

---

## 5. JS 로직 설계 (SiteHeader.astro `<script>`)

기존 `<script>` 블록(hamburger, overlay, scroll, dropdown)에 아래 로직을 추가한다.

### 5-1. 아코디언 토글

```js
document.querySelectorAll('.site-header__mobile-accordion-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    const panelId = btn.getAttribute('aria-controls')
    const panel = document.getElementById(panelId)
    btn.setAttribute('aria-expanded', String(!expanded))
    panel?.toggleAttribute('hidden', expanded)
  })
})
```

### 5-2. 검색 인덱스 로드

```js
const searchDataEl = document.getElementById('mobile-search-data')
const searchIndex = searchDataEl ? JSON.parse(searchDataEl.textContent || '[]') : []
```

### 5-3. 검색 입력 + 디바운스 + 렌더링

```js
const searchInput = document.getElementById('mobile-search-input')
const resultsEl = document.getElementById('mobile-search-results')
const defaultEl = document.getElementById('mobile-menu-default')
const toolsSection = document.getElementById('mobile-search-tools')
const reportsSection = document.getElementById('mobile-search-reports')
const emptyEl = document.getElementById('mobile-search-empty')
const allLink = document.getElementById('mobile-search-all')

const MAX_RESULTS = 6

function renderGroup(sectionEl, items, type) {
  const linksEl = sectionEl.querySelector('.site-header__mobile-links')
  linksEl.innerHTML = ''
  items.slice(0, MAX_RESULTS).forEach((item) => {
    const a = document.createElement('a')
    a.href = item.href
    const titleSpan = document.createElement('span')
    titleSpan.textContent = item.title
    a.appendChild(titleSpan)
    if (item.category) {
      const catSpan = document.createElement('span')
      catSpan.className = 'site-header__mobile-cat'
      catSpan.textContent = item.category
      a.appendChild(catSpan)
    }
    linksEl.appendChild(a)
  })
  sectionEl.hidden = items.length === 0
}

function runSearch(query) {
  const q = query.trim().toLowerCase()

  if (!q) {
    resultsEl.hidden = true
    defaultEl.hidden = false
    return
  }

  defaultEl.hidden = true
  resultsEl.hidden = false

  const matches = searchIndex.filter((item) =>
    item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  )
  const toolMatches = matches.filter((m) => m.type === 'tool')
  const reportMatches = matches.filter((m) => m.type === 'report')

  renderGroup(toolsSection, toolMatches, 'tool')
  renderGroup(reportsSection, reportMatches, 'report')

  emptyEl.hidden = matches.length > 0
  allLink.href = matches.length > 0
    ? `${allLink.dataset.baseHref}?q=${encodeURIComponent(query.trim())}`
    : allLink.dataset.baseHref
}

let debounceTimer
searchInput?.addEventListener('input', (e) => {
  clearTimeout(debounceTimer)
  const value = e.target.value
  debounceTimer = setTimeout(() => runSearch(value), 150)
})
```

- `allLink.dataset.baseHref`는 astro에서 `data-base-href={withBase("/tools/")}`로 미리 심어둠 (href 속성은 fallback)
- `/tools/` 페이지가 `?q=` 쿼리 파라미터를 처리하지 않더라도 1차에서는 단순 링크 이동으로 충분 (쿼리 파라미터 기반 필터링은 범위 밖, `tool-library.js`가 이미 가진 필터 input에 prefill하는 것은 2차 이후 검토)

### 5-4. 메뉴 닫힐 때 검색 상태 초기화

기존 hamburger/overlay 닫기 핸들러에 아래 한 줄씩 추가:

```js
function resetMobileSearch() {
  if (searchInput) searchInput.value = ''
  resultsEl.hidden = true
  defaultEl.hidden = false
}
```

`hamburger`와 `overlay`의 "닫기" 분기에서 `resetMobileSearch()` 호출 (메뉴를 다시 열었을 때 이전 검색 결과가 남아있지 않도록).

---

## 6. 상태 관리

순수 DOM 상태로 관리하며 별도 프레임워크/상태 라이브러리 불필요:

| 상태 | 저장 위치 | 트리거 |
| --- | --- | --- |
| 메뉴 열림/닫힘 | `.site-header__mobile-menu.is-open` (기존) | 햄버거/오버레이 클릭 |
| 아코디언 펼침/접힘 | 각 버튼 `aria-expanded` + 패널 `hidden` | 아코디언 버튼 클릭 |
| 검색어 | `#mobile-search-input.value` | input 이벤트 |
| 검색 결과 표시 여부 | `#mobile-search-results[hidden]` / `#mobile-menu-default[hidden]` | `runSearch()` |

---

## 7. 스타일 설계 (`_legacy.scss`)

기존 `.site-header__mobile-*` 규칙 근처에 추가. 디자인 토큰(`_tokens.scss`)의 색상/spacing 변수를 재사용하고 신규 색상 추가하지 않음.

```scss
.site-header__mobile-search {
  padding: 12px 0;

  &-input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 14px;
    border: 1px solid var(--border-color, #e2e5ea);
    border-radius: 8px;
    font-size: 0.95rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary, #1a56db);
    }
  }
}

.site-header__mobile-search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.site-header__mobile-empty {
  padding: 16px 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted, #8a8f98);
}

.site-header__mobile-accordion {
  border-bottom: 1px solid var(--border-color, #eef0f3);

  &-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    padding: 12px 0;
    font: inherit;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    color: inherit;

    &[aria-expanded="true"] .site-header__mobile-accordion-icon {
      transform: rotate(180deg);
    }
  }

  &-icon {
    display: inline-block;
    transition: transform 0.15s ease;
    font-size: 0.8rem;
    color: var(--text-muted, #8a8f98);
  }
}

.site-header__mobile-section--popular {
  border-bottom: 1px solid var(--border-color, #eef0f3);
  padding-bottom: 8px;
}
```

- `.site-header__mobile-links` 등 기존 클래스는 그대로 재사용 (스타일 중복 작성 불필요)
- 아코디언 패널(`[hidden]`)은 HTML `hidden` 속성으로 `display: none` 처리되므로 별도 max-height 트랜지션은 1차에서 생략 (필요 시 추후 개선)

---

## 8. 구현 순서

1. `tools.ts`에 `MOBILE_POPULAR_SLUGS` 상수 추가
2. `SiteHeader.astro` frontmatter에 `searchIndex`, `popularTools` 생성 로직 추가 + `reports.ts` import
3. 모바일 메뉴 마크업 재구성
   - 검색 input + 검색 결과 컨테이너 추가 (4-1)
   - 기존 4개 섹션을 아코디언 구조로 전환 (4-2, 내부 `<a>`는 그대로 유지)
   - 인기 계산기 Top 6 섹션 추가
   - `<script type="application/json" id="mobile-search-data">` 추가
4. `<script>` 블록에 아코디언 토글(5-1), 검색 로드/렌더링(5-2~5-3), 메뉴 닫힐 때 초기화(5-4) 추가
5. `_legacy.scss`에 7장 스타일 추가
6. `npm run build` 실행 → 전체 페이지 정상 빌드 확인
7. 모바일 뷰포트(375px 등)에서 수동 QA (9장 체크리스트)

---

## 9. 2차/3차 개요 (참고용, 별도 단계에서 상세화)

### 2차 — 광고 슬롯

- `.site-header__mobile-menu`에 `data-ad-layout="no-ad"` 속성 부여 (AdSense Auto Ads 제외 검토용 마커)
- 계산기 입력 영역 컨테이너에도 동일 속성 부여 (`SimpleToolShell`/`CompareToolShell`/`TimelineToolShell`)
- 콘텐츠 섹션 사이 명시적 `<ins class="adsbygoogle">` 슬롯은 별도 설계 문서에서 위치/크기 확정

### 3차 — 접근성

- 메뉴 열릴 때: `searchInput?.focus()`, `document.body.style.overflow = 'hidden'`
- 메뉴 닫힐 때: `document.body.style.overflow = ''`, 포커스를 `.site-header__hamburger`로 복귀
- `keydown`에서 `Escape` 시 닫기 핸들러 호출
- 포커스 트랩: 메뉴 내부 첫/마지막 focusable 요소에서 `Tab`/`Shift+Tab` 순환
- 검색 결과 영역에 `aria-live="polite"` + 결과 개수 텍스트 노드 추가

---

## 10. QA 체크리스트

- [ ] `npm run build` 성공 (218개 페이지 + 신규 inline JSON 포함 확인)
- [ ] 모바일 뷰포트에서 메뉴 오픈 시 검색 input이 최상단에 보이는가
- [ ] "연봉" 검색 시 계산기 그룹(연봉 티어 계산기 등)과 리포트 그룹(2026 신입사원 초봉 비교 등)이 각각 최대 6개까지 표시되는가
- [ ] 존재하지 않는 검색어("zzzzz") 입력 시 "검색 결과가 없습니다" + "전체 계산기 보기" 링크가 노출되는가
- [ ] 검색어를 지우면(빈 문자열) 기본 메뉴(인기 Top6 + 아코디언)로 복귀하는가
- [ ] "인기 계산기" 섹션에 `MOBILE_POPULAR_SLUGS` 6개 항목이 정상 표시되는가 (존재하지 않는 slug 넣어도 빌드 에러 없이 스킵되는지)
- [ ] "계산기" 아코디언이 기본 펼침, "리포트"/"비교표"/"사이트"는 기본 접힘 상태로 시작하는가
- [ ] 아코디언 버튼 클릭 시 `aria-expanded` 토글 + 아이콘 회전이 동작하는가
- [ ] 메뉴를 닫고 다시 열었을 때 검색 input이 비어 있고 기본 화면으로 복귀하는가
- [ ] 데스크톱(`min-width: 769px`)에서 `.site-nav` 드롭다운 동작이 기존과 동일한가 (회귀 없음)
