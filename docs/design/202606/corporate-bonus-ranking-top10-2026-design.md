# 대기업 성과급 순위 TOP10 허브 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/corporate-bonus-ranking-top10-2026`
- **유형**: 리포트 페이지 (`/reports/` 계열)
- **레이아웃**: BaseLayout 직접 사용 (계산기 쉘 아님, `corporate-bonus-comparison-2026` 패턴)
- **prefix**: `cbr-`
- **기본 시뮬레이션 연봉**: 6,000만원

---

## 2. 목적

사이트 내 12개 이상 성과급 계산기/비교 페이지의 허브. 동일 연봉(6,000만원) 기준으로 각 계산기의 기본 성과급률(%)을 환산하여 순위를 시각화. "성과급 많이 주는 회사" 키워드 SEO 트래픽 허브로 활용.

---

## 3. 데이터 소스 매핑

각 기존 데이터 파일에서 대표값 직접 import. 별도 데이터 파일(`corporateBonusRankingTop10_2026.ts`)에 한 곳으로 모은다.

### 3-1. 실제 사용할 회사 목록 (노사협의 확정·공개 보도 기반, 내림차순)

> **중요**: 여기서 사용하는 `salaryPercent`는 각 계산기의 `defaultSalaryPercent`(기본값)와 **다를 수 있음**. 이 파일 전용으로 노사협의 확정·보도 기반 실제치를 별도 선언. "확정" / "추정" 라벨 구분 필수.

| 순위 | 회사명 | id | 업종 | salaryPercent | 신뢰도 | 근거 |
|---|---|---|---|---|---|---|
| 1 | SK하이닉스 | `skHynix` | semiconductor | **150%** | 확정(보도) | 2025.9 노사합의: 영업이익 10% 배분·상한선 폐지. 연봉 1억 기준 1억 4,820만원 지급 보도. 2026년 평균 6.3억 전망. 계산기 표시는 150% cap (실제 더 높음) |
| 2 | 삼성전자 MX | `samsungMX` | semiconductor | **50%** | 확정(공시) | 2025년 OPI MX(모바일) 50% 확정, 2026.1.30 지급 |
| 3 | 삼성전자 DS | `samsungDS` | semiconductor | **47%** | 확정(공시) | 2025년 OPI DS(반도체) 47% 확정. 2024년 14%에서 3배↑ (HBM 회복) |
| 4 | 크래프톤 | `krafton` | game | **35%** | 추정 | 2025년 영업이익 1조 544억(역대 최고). 배그 글로벌 호조. 역대급 실적 = 역대급 PS 이력 |
| 5 | 넥슨 | `nexon` | game | **28%** | 추정 | 2025년 영업이익 1조 1,765억(역대 최고). 마비노기모바일·메이플 흥행 |
| 6 | 한국투자증권 | `koreainv` | finance | **25%** | 추정 | 증권업 IB 실적 상위권, 업계 최고 수준 인센티브 구조 |
| 7 | 미래에셋증권 | `mirae` | finance | **22%** | 추정 | 해외투자·ETF 수익 호조, 해외법인 실적 포함 |
| 8 | 삼성증권 | `samsung_sec` | finance | **20%** | 추정 | 브로커리지·자산관리 호조, 삼성그룹 계열 안정성 |
| 9 | 두산에너빌리티 | `doosanEnerbility` | energy | **18%** | 추정 | SMR·원전 수주 증가, 체코 원전 수출 기대감 |
| 10 | SK텔레콤 | `skt` | telecom | **17%** | 추정 | AI 인프라·데이터센터 수혜, 통신3사 중 최상위 |
| 11 | KB국민은행 | `kb` | finance | **16%** | 추정 | 이자이익 개선, 리딩뱅크 그룹 실적 |
| 12 | 신한은행 | `shinhan` | finance | **15%** | 추정 | 그룹 통합 실적 안정적 |
| 13 | 네이버 | `naver` | platform | **15%** | 추정 | 커머스·클라우드 성장, 라인야후 수익 회복 |
| 14 | SK이노베이션 | `skInnovation` | oilRefinery | **15%** | 추정 | SK온 흑자 전환 기대 + 정유 마진 회복 |
| 15 | 넷마블 | `netmarble` | game | **15%** | 추정 | 2025년 상장 이래 역대 최대 매출, 흑자전환 성공. 2024년 적자와 달리 실적 반등 |
| 16 | 한화에어로스페이스 | `hanwhaAerospace` | defense | **13%** | 확정(보도) | 2025.9 노사합의: 최대 1,250만원 고정 (영업이익 달성 시 500만 + 생산목표 750만). 연봉 1억 기준 약 12~13% |
| 17 | 하나은행 | `hana` | finance | **13%** | 추정 | 은행권 평균 수준 |
| 18 | KT | `kt` | telecom | **12%** | 추정 | 구조조정 이후 안정화, 보수적 지급 기조 |
| 19 | GS칼텍스 | `gsCaltex` | oilRefinery | **12%** | 추정 | 정유 마진 등락, 연간 평균 |
| 20 | 포스코 | `posco` | steel | **10%** | 추정 | 철강 업황 부진 지속, 중국 공급과잉 |
| 21 | LG유플러스 | `lguplus` | telecom | **10%** | 추정 | 통신3사 중 점유율·실적 열위 |
| 22 | 대한항공 | `koreanair` | airline | **10%** | 추정 | 코로나 이후 회복세, 아시아나 합병 비용 부담으로 상승 제한 |
| 23 | 카카오 | `kakao` | platform | **7%** | 추정 | 2024~2025 실적 부진 + 준법경영 이슈, 구조조정 진행 |
| 24 | 아시아나항공 | `asianaair` | airline | **5%** | 추정 | 대한항공 합병 완료 후 브랜드 소멸 이슈, 경영 불안정 |
| 25 | 엔씨소프트 | `ncsoft` | game | **4%** | 추정 | 리니지 의존도 + 신작 부진, 대규모 인력 감축 진행 |

> **삼성전자 표기 방식**: MX(모바일)·DS(반도체) 부문별 OPI가 크게 다름 → 랭킹에는 DS·MX 각각 별도 항목으로 표기, "같은 회사 다른 부문"임을 명시. 또는 전사 평균 약 30%로 단일 표기 가능 (구현 시 선택).
>
> **자동차·조선 제외**: 현대차·기아·HD현대중공업은 월급 배수 방식 → % 비교 왜곡. 별도 계산기 안내.
>
> **신뢰도 범례**: "확정(공시/보도)" = 노사합의문·공시·주요 언론 복수 보도 확인 / "추정" = 실적 기반 업계 추정, 실제와 다를 수 있음. 전 항목 "참고용" 표기 필수.

### 3-2. 업종 분류

```ts
export type BonusRankingIndustry =
  | "semiconductor" | "game" | "platform" | "finance"
  | "telecom" | "oilRefinery" | "steel" | "energy"
  | "defense" | "airline" | "auto" | "shipbuilding";

export const BONUS_RANKING_INDUSTRY_LABELS: Record<BonusRankingIndustry, string> = {
  semiconductor: "반도체",
  game: "게임",
  platform: "IT 플랫폼",
  finance: "금융·증권",
  telecom: "통신",
  oilRefinery: "정유·에너지",
  steel: "철강",
  energy: "발전·중공업",
  defense: "방산",
  airline: "항공",
  auto: "자동차",
  shipbuilding: "조선",
};
```

---

## 4. 데이터 파일 구조

### `src/data/corporateBonusRankingTop10_2026.ts`

```ts
import { SEMICONDUCTOR_COMPANIES } from "./semiconductorBonusComparison";
import { GAME_COMPANIES } from "./gameIndustryBonusComparison2026";
import { TELECOM_COMPANIES } from "./telecomBonusComparison2026";
import { AIRLINE_COMPANIES } from "./airlineBonusComparison2026";
import { BIGTECH_COMPANIES } from "./itBigtechBonusComparison2026";
// financeBonusComparison2026 — defaultPercent 필드명이 다름, 직접 상수로 선언

export type BonusRankingIndustry = /* 위 목록 */;

export interface BonusRankingEntry {
  id: string;
  name: string;
  industry: BonusRankingIndustry;
  salaryPercent: number;          // 연봉 대비 성과급률 (%)
  bonusAmount: number;            // BASE_SALARY * salaryPercent / 100
  bonusAfterTax: number;          // bonusAmount * (1 - TAX_RATE)
  calculatorHref: string;
  note: string;                   // 1줄 특이사항
  sourceFile: string;             // 참조 데이터 파일명 (투명성)
}

export const BASE_SALARY_FOR_RANKING = 60_000_000;
export const SIMPLE_TAX_RATE = 0.22;

export const BONUS_RANKING_ENTRIES: BonusRankingEntry[] = [
  // import한 배열에서 대표사 항목 추출 + 직접 값 선언 혼용
  // 정렬: salaryPercent 내림차순 (JS에서 sort, 또는 미리 정렬해서 배열 선언)
];

// TOP 10만 추출하는 getter
export const TOP10_ENTRIES = BONUS_RANKING_ENTRIES
  .sort((a, b) => b.salaryPercent - a.salaryPercent)
  .slice(0, 10);

export interface FaqItem { question: string; answer: string; }
export const BONUS_RANKING_FAQ: FaqItem[] = [
  // 최소 6개
];

// 계산기 허브 카드 — 전체 계산기/비교 페이지 링크
export interface HubCard {
  href: string;
  label: string;
  description: string;
  category: string; // "단독 계산기" | "비교 계산기" | "리포트"
}
export const BONUS_HUB_CARDS: HubCard[] = [
  // 단독 계산기 6개
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기", ... },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", ... },
  { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기", ... },
  { href: "/tools/lg-bonus/", label: "LG 성과급 계산기", ... },
  { href: "/tools/posco-bonus-calculator/", label: "포스코 성과급 계산기", ... },
  { href: "/tools/hanwha-bonus-calculator/", label: "한화 성과급 계산기", ... },
  { href: "/tools/doosan-enerbility-bonus-calculator/", label: "두산에너빌리티 성과급 계산기", ... },
  // 비교 계산기 8개
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", ... },
  { href: "/tools/auto-bonus-comparison/", label: "자동차 성과급 비교", ... },
  { href: "/tools/shipbuilding-bonus-comparison/", label: "조선 성과급 비교", ... },
  { href: "/tools/finance-bonus-comparison/", label: "금융·증권 성과급 비교", ... },
  { href: "/tools/oil-refinery-bonus-comparison/", label: "정유 성과급 비교", ... },
  { href: "/tools/telecom-bonus-comparison/", label: "통신 성과급 비교", ... },
  { href: "/tools/airline-bonus-comparison/", label: "항공사 성과급 비교", ... },
  { href: "/tools/game-industry-bonus-comparison/", label: "게임업계 성과급 비교", ... },
  { href: "/tools/it-bigtech-bonus-comparison/", label: "IT 빅테크 성과급 비교", ... },
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교", ... },
];

export const CBR_META = {
  slug: "corporate-bonus-ranking-top10-2026",
  title: "2026 대기업 성과급 순위 TOP 10",
  description: "삼성전자·크래프톤·SK하이닉스 등 주요 대기업의 성과급률을 동일 연봉 기준으로 비교한 시뮬레이션 순위. 성과급 많이 주는 회사는 어디일까요?",
};
```

---

## 5. 화면 구성

### 5-1. 섹션 순서

```
[CalculatorHero]
  eyebrow: "성과급 순위 허브"
  title: "2026 대기업 성과급 순위 TOP 10"
  description: "연봉 6,000만원 기준 각 계산기 기본 성과급률(%) 시뮬레이션 순위"
  badges: ["시뮬레이션 기준", "2026", "20개사+"]

[InfoNotice — 경고 배너]
  "이 순위는 연봉 6,000만 원 기준 각 기업 계산기의 기본 성과급률(%)을 적용한 시뮬레이션입니다.
   실제 지급액·지급 여부와 무관하며, 추정치입니다."

[KPI 그리드 — 4개 카드]
  - 최고 성과급률: 크래프톤 25%
  - 평균 성과급률: N%
  - 비교 대상 기업 수: 25개사
  - 최고 추정 성과급(세전): X만원

[업종 필터 탭]
  전체 | 반도체 | 게임 | IT 플랫폼 | 금융·증권 | 통신 | 정유·에너지 | 항공 | 철강 | 방산 | 자동차 | 조선

[TOP 10 순위 가로 바 차트]
  - Chart.js 수평 바
  - x축: 성과급률(%)
  - 업종별 색상
  - 레이블: 회사명 + %값 + 6천만원 기준 세전 금액

[전체 기업 비교 테이블]
  컬럼: 순위 | 회사명 | 업종 | 성과급률(%) | 추정액(세전) | 추정액(세후) | 상세 계산기
  - 업종 필터 연동
  - 모바일: 순위·회사명·%만 표시, 나머지 접기

[계산기 허브 카드 그리드]
  - 2-col (모바일 1-col)
  - category별 그룹 헤더: "단독 계산기", "업종 비교 계산기"
  - 각 카드: label + description + 이동 링크

[관련 리포트 링크]
  - corporate-bonus-comparison-2026 (실적 기반)
  - public-enterprise-bonus-comparison-2026 (공공기관)

[SeoContent]
  - intro: 5개 이상 문단 / 800자 이상
    - 순위 기준 설명, 업종별 특징 요약, 자동차·조선 제외 이유, 시뮬레이션 한계
  - FAQ: 6개 이상
```

---

## 6. 컴포넌트 구조

```
<BaseLayout>
  <SiteHeader />
  <main class="container page-shell report-page cbr-page">
    <CalculatorHero ... />
    <InfoNotice type="warning" ... />

    <!-- KPI -->
    <section class="cbr-kpi-section">
      <div class="cbr-kpi-grid">
        <div class="cbr-kpi-card">...</div>  <!-- 4개 -->
      </div>
    </section>

    <!-- 필터 탭 + 차트 -->
    <section class="cbr-chart-section">
      <div class="cbr-filter-tabs" role="tablist">...</div>
      <div class="cbr-chart-wrap">
        <canvas id="cbrRankingChart"></canvas>
      </div>
    </section>

    <!-- 테이블 -->
    <section class="cbr-table-section">
      <div class="cbr-table-wrap">
        <table class="cbr-table">...</table>
      </div>
    </section>

    <!-- 허브 카드 그리드 -->
    <section class="cbr-hub-section">
      <h2>성과급 계산기 전체 보기</h2>
      <div class="cbr-hub-group">
        <h3>단독 계산기</h3>
        <div class="cbr-hub-grid">...</div>
      </div>
      <div class="cbr-hub-group">
        <h3>업종 비교 계산기</h3>
        <div class="cbr-hub-grid">...</div>
      </div>
    </section>

    <SeoContent introItems={...} faqItems={BONUS_RANKING_FAQ} />
    <CompareCta />
  </main>
  <SiteFooter />
</BaseLayout>
```

---

## 7. JS 로직 (`public/scripts/corporate-bonus-ranking-top10-2026.js`)

### 상태

```js
const state = {
  activeIndustry: "all",  // 필터 탭 상태
};
```

### Config 주입

```astro
<script id="cbrConfig" type="application/json" set:html={JSON.stringify({
  entries: BONUS_RANKING_ENTRIES,
  top10: TOP10_ENTRIES,
  baseSalary: 60_000_000,
  taxRate: 0.22,
})}></script>
```

### 주요 함수

```
init()
  → loadConfig()
  → renderChart(entries filtered by all)
  → renderTable(entries filtered by all)
  → bindFilterTabs()

filterByIndustry(industry)
  → state.activeIndustry = industry
  → renderChart(filtered)
  → renderTable(filtered)

renderChart(entries)
  → TOP 10 or filtered top 10
  → Chart.js 수평 바
  → 업종별 color map

renderTable(entries)
  → 전체 or 필터된 entries
  → sortBy salaryPercent desc
  → 테이블 행 DOM 교체
```

### 업종별 색상 맵

```js
const INDUSTRY_COLORS = {
  semiconductor: "#1a56db",
  game:          "#7c3aed",
  platform:      "#0891b2",
  finance:       "#059669",
  telecom:       "#d97706",
  oilRefinery:   "#dc2626",
  steel:         "#64748b",
  energy:        "#0369a1",
  defense:       "#92400e",
  airline:       "#be185d",
  auto:          "#374151",
  shipbuilding:  "#065f46",
};
```

---

## 8. SCSS (`src/styles/scss/pages/_corporate-bonus-ranking-top10-2026.scss`)

prefix: `cbr-`

```scss
.cbr-page { ... }

// KPI
.cbr-kpi-section { margin: 2rem 0; }
.cbr-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
}
.cbr-kpi-card { /* 테두리 없는 카드, 토큰 색상 */ }

// 필터 탭
.cbr-filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.cbr-filter-tab {
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  cursor: pointer;
  &.is-active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
}

// 차트
.cbr-chart-section { margin: 2rem 0; }
.cbr-chart-wrap { height: 360px; }  /* TOP 10 = 10개 바, 여유 높이 */
@media (min-width: 768px) { .cbr-chart-wrap { height: 420px; } }

// 테이블
.cbr-table-section { margin: 2.5rem 0; overflow-x: auto; }
.cbr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: left; }
  th { background: var(--color-surface); font-weight: 600; }
  tr:hover td { background: var(--color-surface); }
  .cbr-rank-badge { /* 순위 번호 원형 배지 */ }
  .cbr-industry-badge { /* 업종 태그 */ }
  .cbr-calc-link { font-size: 0.8rem; color: var(--color-primary); }
}
// 모바일: 세후/계산기 컬럼 숨김
@media (max-width: 599px) {
  .cbr-table .cbr-col-after-tax,
  .cbr-table .cbr-col-link { display: none; }
}

// 허브 카드
.cbr-hub-section { margin: 3rem 0; }
.cbr-hub-group { margin-bottom: 2rem; }
.cbr-hub-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: 560px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}
.cbr-hub-card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem 1.125rem;
  text-decoration: none;
  display: block;
  transition: border-color 0.15s;
  &:hover { border-color: var(--color-primary); }
  .cbr-hub-label { font-weight: 600; color: var(--color-text); }
  .cbr-hub-desc { font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.25rem; }
}
```

---

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | 리포트 항목 추가 (slug, title, description, badge 등) |
| `src/styles/app.scss` | `@use 'scss/pages/corporate-bonus-ranking-top10-2026';` 추가 |
| `public/sitemap.xml` | `/reports/corporate-bonus-ranking-top10-2026/` URL 추가 |
| `src/pages/index.astro` | topicBySlug에 항목 추가 (또는 reports 섹션에 카드 추가) |
| `src/pages/reports/index.astro` | 리포트 목록 업데이트 (reports.ts 자동 반영이면 생략) |

---

## 10. JSON-LD 구조

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "2026 대기업 성과급 순위 TOP 10",
      "description": "...",
      "dateModified": "2026-06-16"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* BONUS_RANKING_FAQ */]
    },
    {
      "@type": "ItemList",
      "name": "성과급 계산기 모음",
      "itemListElement": [/* BONUS_HUB_CARDS 순서대로 */]
    }
  ]
}
```

---

## 11. SEO 포인트

- `<title>`: `2026 대기업 성과급 순위 TOP 10 — 성과급 많이 주는 회사 비교 | 비교계산소`
- `<description>`: 삼성전자·크래프톤·SK하이닉스 등 25개사 성과급률 시뮬레이션 순위. 연봉 6천만원 기준 세전·세후 비교.
- 1차 키워드: `대기업 성과급 순위`, `성과급 많이 주는 회사`
- 2차 키워드: `2026 성과급 비교`, `크래프톤 성과급`, `삼성전자 성과급 순위`

---

## 12. FAQ 초안 (6개)

1. **이 순위는 실제 성과급 순위인가요?** — 아닙니다. 연봉 6,000만원 기준으로 각 계산기의 기본 성과급률(%)을 적용한 시뮬레이션 순위입니다. 실제 지급액은 해당 연도 실적, 노사 협의, 개인 평가에 따라 크게 달라집니다.
2. **자동차·조선 회사는 왜 순위에 없나요?** — 현대자동차, 기아, HD현대중공업 등은 성과급을 연봉 대비 비율(%)이 아닌 월급 배수 방식으로 지급합니다. 성과급률(%) 기준 단순 비교 시 왜곡이 발생해 별도 업종 비교 계산기로 안내드립니다.
3. **성과급률이 높은 회사가 연봉도 높은가요?** — 반드시 그렇지 않습니다. 성과급률(%)이 높아도 기본급이 낮으면 절대 금액은 적을 수 있습니다. 각 회사별 평균 연봉은 계산기 상세 페이지에서 확인하세요.
4. **게임·금융 회사가 상위권인 이유는?** — 게임 업종(크래프톤 등)은 실적 연동 성과급 구조로 호실적 시 높은 비율이 지급되는 것으로 알려져 있습니다. 금융·증권업은 수익성이 높을수록 인센티브 비중이 크게 설계되는 경향이 있습니다.
5. **세후 성과급은 어떻게 계산하나요?** — 22% 단순 세율(소득세+지방소득세 근사값)을 적용합니다. 실제 세금은 과세표준, 부양가족, 연간 총소득에 따라 달라지므로 참고용으로만 사용하세요.
6. **성과급 계산기를 직접 사용하려면?** — 각 회사별 계산기 링크를 클릭하면 나의 실제 연봉을 입력하여 개인 맞춤 추정액을 계산할 수 있습니다.

---

## 13. 구현 순서

1. `src/data/corporateBonusRankingTop10_2026.ts` — 기존 파일 import + 배열 수동 구성
2. `src/pages/reports/corporate-bonus-ranking-top10-2026.astro` — BaseLayout 사용
3. `public/scripts/corporate-bonus-ranking-top10-2026.js` — 필터 탭 + 차트 + 테이블 연동
4. `src/styles/scss/pages/_corporate-bonus-ranking-top10-2026.scss` — prefix `cbr-`
5. 등록 4곳: `reports.ts`, `app.scss`, `sitemap.xml`, `index.astro`
6. `npm run build` 검증

---

## 14. QA 포인트

- [ ] InfoNotice "시뮬레이션 기준" 문구가 히어로 바로 아래에 위치하는지
- [ ] 업종 필터 탭 클릭 시 차트 + 테이블 동시 업데이트
- [ ] 테이블 "상세 계산기" 링크가 올바른 URL로 연결되는지
- [ ] 자동차·조선 제외 이유가 본문에 명시되어 있는지
- [ ] 모바일(375px)에서 가로 스크롤 없이 테이블 표시되는지 (숨김 컬럼 처리)
- [ ] 차트 높이 360px에서 10개 바가 레이블 겹침 없이 표시되는지
- [ ] `npm run build` 빌드 에러 없음
