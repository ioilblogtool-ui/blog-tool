# 동탄 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 원칙: 지역·단지 우열을 단정하지 않는다. 모든 가격·상승률·평가차익은 국토교통부 실거래가 공개시스템 기준으로 재검증하고, 세금·중개보수·대출이자·보유비용을 제외한 단순 시세 변화는 반드시 `평가차익(추정)`으로 표기한다.

---

## 1. 문서 개요

- 구현 대상: `동탄 대장 아파트 Top10 2026`
- 추천 slug: `dongtan-apartment-price-2026`
- URL: `/reports/dongtan-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `동탄 아파트 실거래가`, `동탄 대장 아파트`, `동탄역 롯데캐슬 실거래가`, `동탄 아파트 상승률`
- 2차 검색 의도: `동탄 최저가`, `동탄 아파트 84 실거래가`, `동탄 GTX 아파트`, `동탄 시범단지 아파트`
- 핵심 출력: Top10 단지 비교표, 단지 탭, 최근 5년 최저가 대비 현재 평가차익 카드, 전세가율·월세 참고 지표, 데이터 기준 안내, FAQ
- 차별화 포인트: 단순 “최근 얼마”가 아니라 “최저가일 때 샀다면 지금 얼마를 벌었을까?”를 단지별 카드로 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `dongtan-hot-apartment-ranking-2026` | 최근 신고가·고가 거래 추적 | 단기 과열·신고가 뉴스성 내부 링크 |
| `dongtan-20-billion-apartment-affordability-2026` | 20억 가격대 감당 가능성 검증 | 고가 단지 선택 후 자금 계산 CTA |
| `bundang-redevelopment-vs-dongtan-newbuild-2026` | 분당 재건축 vs 동탄 신축 비교 | 지역 선택 고민 사용자 내부 이동 |
| `gyeonggi-south-leader-apartment-comparison-2026` | 경기 남부 권역 비교 | 동탄 외 수지·영통·광교 비교 니즈 대응 |
| `dongtan-apartment-price-2026` | 동탄 단지별 Top10 실거래가·최저가 대비 평가차익 | 이번 구현 대상 |

이번 리포트는 “동탄 안에서 어떤 단지가 얼마이고, 과거 저점 대비 얼마나 변했는가”에 집중한다. 매수 가능성, 지역 간 비교, 신고가 추적은 관련 콘텐츠로 넘긴다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.dtap-page
    CalculatorHero
      - Hero: "동탄 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 최저가 대비 금액은 평가차익(추정)

    section.dtap-summary
      - 기준일, 대표 단지 수, 평균 상승률, 최대 평가차익 KPI

    section.dtap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.dtap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가, 최저가 거래 시점, 현재 기준가, 평가차익, 상승률

    section.dtap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 상승률, 최저가 대비 평가차익, 전세가율

    section.dtap-chart
      - 단지별 현재가 vs 5년 최저가 막대 비교
      - 상승률 순 정렬 옵션

    section.dtap-context
      - GTX-A, 동탄역 생활권, 시범단지, 삼성·반도체 배후 수요 등 사실 기반 설명

    section.dtap-data-method
      - 선정 기준, 가격 산식, 데이터 한계

    section.dtap-risk
      - 단기 급등, 거래 건수 부족, 층·향·동 차이, 금리·대출 규제 리스크

    section.dtap-related
      - 관련 리포트·계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/dongtanApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export interface DongtanApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface DongtanApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  areaGroup: "동탄역권" | "시범단지" | "호수공원권" | "동탄2 기타" | "동탄1";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  latestTradePriceManwon: number;
  latestTradeDate: string;
  latestTradeArea: string;
  previousYearPriceManwon?: number;
  previousYearPeriod?: string;
  fiveYearLowPriceManwon: number;
  fiveYearLowDate: string;
  fiveYearLowArea: string;
  estimatedGainManwon: number;
  estimatedGainRate: number;
  jeonsePriceManwon?: number;
  jeonseRatio?: number;
  tradeCountNote: string;
  badge: DataBadge;
  note: string;
}

export interface DongtanContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface DongtanFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}
```

---

## 5. 후보 단지 선정 기준

Top10은 구현 직전 국토교통부 실거래가 공개시스템에서 다시 검증한다. 설계 단계 후보는 확정 순위가 아니라 리서치 우선순위다.

| 우선순위 | 후보 단지 | 권역 | 선정 이유 |
|---:|---|---|---|
| 1 | 동탄역 롯데캐슬 | 동탄역권 | 동탄역 초역세권 대표 단지, 단지명 검색 수요 강함 |
| 2 | 동탄역 시범우남퍼스트빌 | 시범단지 | 시범단지 대표축, 기존 동탄 고가 거래 문서와 연결 가능 |
| 3 | 동탄역 시범한화꿈에그린프레스티지 | 시범단지 | 시범단지 내 상단 가격 비교에 적합 |
| 4 | 동탄역 시범더샵센트럴시티 | 시범단지 | 동탄역 접근성과 시범단지 인지도 |
| 5 | 동탄 린스트라우스 더레이크 | 호수공원권 | 호수공원 생활권 대표 고가 단지 |
| 6 | 동탄 더레이크 자이더테라스 | 호수공원권 | 호수공원권 비교축 |
| 7 | 동탄역 반도유보라 아이비파크 | 동탄역권 | 동탄역권 중상위권 비교 단지 |
| 8 | 동탄역 센트럴상록 | 동탄역권 | 실거래가 확인 시 보조 후보 |
| 9 | 동탄2 금강펜테리움 센트럴파크 | 동탄2 기타 | 신축·입주 물량 설명용 후보 |
| 10 | 메타폴리스 | 동탄1 | 분양가 대비 장기 상승 설명용 후보, 단 면적·연식 차이 주의 |

단지명이 실제 거래 시스템 표기와 다를 수 있으므로 구현 시 `complexNameOfficial` 필드를 별도로 두고, 화면에는 검색 친화적 표기를 사용한다.

---

## 6. 핵심 기능 설계

### 6-1. 단지 탭

- 데스크톱: 상단 가로 탭 10개
- 모바일: `select` 또는 가로 스크롤 segmented control
- 탭 클릭 시 아래 요소가 함께 갱신된다.
  - 대표 단지명
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `lotte-castle` |
| `sort` | `rank` / `gain` / `gainRate` / `latestPrice` | `rank` |

### 6-2. 최저가 대비 평가차익 카드

카드 문구:

```text
최저가일 때 샀다면?
2022년 00월 00억원에 거래된 뒤, 현재 기준가는 00억원입니다.
단순 시세 차이는 약 00억원, 상승률은 00%로 추정됩니다.
```

계산식:

```text
평가차익(추정) = 현재 기준가 - 최근 5년 최저 실거래가
상승률(추정) = 평가차익 ÷ 최근 5년 최저 실거래가 × 100
```

표현 고정:

- `평가차익(추정)` 사용
- `투자 수익`, `수익 확정`, `벌었다`, `무조건 오른다` 표현 금지
- 제목·카드에서는 후킹을 위해 “얼마를 벌었을까?”를 쓸 수 있지만, 수치 라벨은 `평가차익(추정)`으로 고정

주의 문구:

```text
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 실제 투자 성과나 매수 추천으로 해석하면 안 됩니다.
```

### 6-3. Top10 비교표

컬럼:

| 컬럼 | 설명 |
|---|---|
| 순위 | 최근 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 권역 | 동탄역권 / 시범단지 / 호수공원권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래일 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 평균 또는 대표 거래 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 층·향 차이 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 큰 순
- 최근 실거래가 높은 순

### 6-4. 차트

1차 구현은 Chart.js 없이 CSS 막대 또는 단순 카드형 그래프로 충분하다. 추후 허브와 공유할 가능성이 있으면 Chart.js를 도입한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 단지별 면적이 84㎡와 다를 경우 면적을 화면에 명확히 표기
- 거래 건수가 1~2건뿐이면 평균값처럼 보이지 않게 `대표 거래`로 표기

데이터 배지:

| 배지 | 사용 조건 |
|---|---|
| 공식 | 국토교통부 실거래가 공개시스템에서 직접 확인한 값 |
| 보도 기반 | 기사·공개 보도에서 인용했으나 원문 재확인이 필요한 값 |
| 추정 | 산식으로 계산한 평가차익·상승률 |
| 확인 필요 | 구현 전 임시 후보 또는 단지명·면적 확인 전 값 |

---

## 8. SEO 설계

### title

```text
동탄 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나
```

### H1

```text
동탄 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
동탄역 롯데캐슬 등 동탄 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. GTX-A 이후 가격 변화와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 동탄 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 동탄역권·시범단지·호수공원권 가격 차이
- 동탄 아파트가 주목받는 이유
- 실거래가를 볼 때 반드시 확인할 점
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const DTAP_FAQ: DongtanFaqItem[] = [
  {
    question: "동탄 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 동탄역 접근성, 최근 실거래가 수준, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 지역 우열이나 매수 추천이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 59㎡ 또는 98㎡ 등 다른 면적을 별도 표기합니다. 면적이 다르면 같은 순위표 안에서도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "동탄역 롯데캐슬이 동탄에서 가장 비싼 아파트인가요?",
    answer:
      "동탄역 초역세권 대표 단지로 상단 가격을 형성하는 경우가 많지만, 거래 시점·면적·층·향에 따라 다른 단지가 더 높은 거래를 기록할 수 있습니다.",
  },
  {
    question: "동탄 아파트는 GTX-A 때문에 오른 건가요?",
    answer:
      "GTX-A는 중요한 요인 중 하나입니다. 다만 삼성·반도체 배후 수요, 신도시 생활 인프라, 매물 감소, 단지별 상품성도 함께 작용하므로 하나의 이유로 단정하면 안 됩니다.",
  },
  {
    question: "지금 동탄 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 거래 현장 확인을 함께 고려해야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요를 보는 참고 지표일 뿐입니다. 전세가율이 높아도 향후 입주 물량, 금리, 수리 상태, 학군·교통 선호에 따라 매매가는 다르게 움직일 수 있습니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const DTAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/dongtan-20-billion-apartment-affordability-2026/",
    label: "동탄 20억 아파트, 진짜 감당 가능한가",
    description: "고가 단지 매수를 고민할 때 필요한 현금·대출·월 상환액을 확인합니다.",
  },
  {
    href: "/reports/dongtan-hot-apartment-ranking-2026/",
    label: "동탄 신고가 아파트 추적 리포트",
    description: "최근 고가 거래와 단기 과열 신호를 별도로 추적합니다.",
  },
  {
    href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/",
    label: "분당 재건축 vs 동탄 신축 비교",
    description: "15억 예산 기준 두 지역의 실거주·투자·교통·학군 포인트를 비교합니다.",
  },
  {
    href: "/tools/income-home-affordability/",
    label: "소득 대비 집값 부담 계산기",
    description: "내 소득과 대출 조건으로 감당 가능한 집값을 계산합니다.",
  },
  {
    href: "/tools/real-estate-acquisition-tax/",
    label: "부동산 취득세 계산기",
    description: "매수가에 따른 취득세 부담을 함께 확인합니다.",
  },
];
```

---

## 11. 구현 파일 구조

```text
src/data/dongtanApartmentPrice2026.ts
src/pages/reports/dongtan-apartment-price-2026.astro
public/scripts/dongtan-apartment-price-2026.js
src/styles/scss/pages/_dongtan-apartment-price-2026.scss
```

등록 파일:

```text
src/data/reports.ts
src/styles/app.scss
public/sitemap.xml
```

선택 등록:

```text
src/pages/index.astro
src/pages/reports/index.astro
```

---

## 12. Astro 설계

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  DTAP_META,
  DTAP_APARTMENTS,
  DTAP_CONTEXT,
  DTAP_FAQ,
  DTAP_RELATED_LINKS,
  DTAP_SEO_INTRO,
  DTAP_SEO_CRITERIA,
} from "../../data/dongtanApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: DTAP_META.title,
    description: DTAP_META.description,
    dateModified: DTAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DTAP_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];
---

<BaseLayout title={DTAP_META.seoTitle} description={DTAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page dtap-page" data-report="dongtan-apartment-price-2026">
    <CalculatorHero
      eyebrow="동탄 실거래가 리포트"
      title="동탄 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={DTAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        DTAP_META.notice,
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / chart / context / risk / related -->

    <SeoContent
      introTitle="동탄 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={DTAP_SEO_INTRO}
      criteria={DTAP_SEO_CRITERIA}
      faq={DTAP_FAQ}
      related={DTAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/dongtan-apartment-price-2026.js`

주요 함수:

```js
function formatEok(manwon) {}
function formatPercent(value) {}
function getApartmentById(id) {}
function setActiveApartment(id) {}
function renderProfitCard(apartment) {}
function renderTable(sortKey) {}
function renderBars(sortKey) {}
function readStateFromUrl() {}
function writeStateToUrl(state) {}
function initTabs() {}
function initSortControls() {}
function init() {}
```

DOM 데이터 전달:

```astro
<script type="application/json" id="dtap-data">
  {JSON.stringify(DTAP_APARTMENTS)}
</script>
<script src={withBase("/scripts/dongtan-apartment-price-2026.js")} defer></script>
```

보안:

- 사용자 입력은 없지만 URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `DTAP_APARTMENTS`의 id에 존재할 때만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_dongtan-apartment-price-2026.scss`

prefix: `dtap-`

```scss
.dtap-page {
  --dtap-ink: #172033;
  --dtap-muted: #667085;
  --dtap-line: #d8e0ea;
  --dtap-soft: #f6f8fb;
  --dtap-blue: #2563eb;
  --dtap-green: #138a5b;
  --dtap-amber: #b7791f;
  --dtap-red: #c2410c;
}
```

주요 클래스:

```text
dtap-summary-grid
dtap-summary-card
dtap-tabs
dtap-tab
dtap-profit-card
dtap-profit-card__main
dtap-profit-card__meta
dtap-table-wrap
dtap-table
dtap-sort-controls
dtap-bar-list
dtap-bar-row
dtap-context-grid
dtap-context-card
dtap-risk-list
dtap-related-grid
dtap-related-card
```

반응형:

- 920px 이하: KPI·맥락 카드 2열
- 640px 이하: 카드 1열, 탭 가로 스크롤
- 표는 `overflow-x: auto` 허용, 최소 너비 780px
- 최저가 대비 카드의 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 부동산 리포트이므로 과한 그라데이션·장식 배경 지양
- 상승률 색상은 강조하되 “투자 성과 확정”처럼 보이지 않게 배지에 `추정` 표시
- 색상만으로 상승/주의를 구분하지 않고 텍스트 라벨 병행

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `동탄이 분당보다 낫다`
- `대장 단지는 안전하다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `단지·층·향·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] 단지 Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증됐는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 최저가 대비 금액이 모두 `평가차익(추정)`으로 표시되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고지되는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 표가 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체를 밀지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함했는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준값 확정
2. `src/data/dongtanApartmentPrice2026.ts` 생성
3. 리포트 Astro 페이지 생성
4. 단지 탭·정렬 스크립트 생성
5. SCSS 작성
6. `reports.ts`, `app.scss`, `sitemap.xml` 등록
7. `npm run build`
8. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 분당 대장 아파트 Top10 설계 문서: `bundang-apartment-price-2026-design.md`
- 광교·수지·수원 리포트로 같은 데이터 구조 재사용
- 지역 리포트가 2~3개 이상 쌓인 뒤 허브 페이지 `seoul-gyeonggi-flagship-apartment-top10-2026` 구현
- 허브에서는 지역별 대표 단지 1개와 평가차익 상위 카드만 요약하고, 상세 수치는 지역 리포트로 연결
