# 광교 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 원칙: 광교는 행정구역보다 생활권 기준으로 읽는 사용자가 많다. 수원 영통구 광교와 용인 수지구 상현·광교 인접 단지를 섞을 때는 반드시 기준을 고지한다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `광교 대장 아파트 Top10 2026`
- 추천 slug: `gwanggyo-apartment-price-2026`
- URL: `/reports/gwanggyo-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `광교 아파트 실거래가`, `광교 대장 아파트`, `광교중흥S클래스 실거래가`, `광교 아파트 상승률`
- 2차 검색 의도: `광교 호수공원 아파트`, `광교 84 실거래가`, `광교 자연앤힐스테이트`, `광교 아파트 최저가`, `광교 영통 수지 비교`
- 핵심 출력: 광교 생활권 Top10 단지 비교표, 단지 탭, 최근 5년 최저가 대비 평가차익 카드, 호수공원·신분당선·업무지구 프리미엄 설명, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “광교 호수공원·신분당선·수원 고소득 수요가 가격에 얼마나 반영됐는가”를 단지별 실거래가와 저점 대비 변화로 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `dongtan-apartment-price-2026` | 동탄 단지별 Top10 시세·저점 대비 평가차익 | 경기 남부 시리즈 상호 링크 |
| `bundang-apartment-price-2026` | 분당 단지별 Top10 시세·재건축 기대 | 상급지·구축·재건축 비교 니즈 연결 |
| `gyeonggi-south-leader-apartment-comparison-2026` | 동탄·분당·수지·영통 권역 비교 | 광교를 경기 남부 비교 문맥으로 연결 |
| `dongtan-20-billion-apartment-affordability-2026` | 고가 단지 감당 가능성 검증 | 광교 고가 단지 선택 후 자금 계산 CTA |
| `gwanggyo-apartment-price-2026` | 광교 생활권 단지별 실거래가·저점 대비 변화 | 이번 구현 대상 |

이번 리포트는 “광교 안에서 어떤 단지가 가격 상단을 형성하고, 2021~2026 저점 대비 얼마나 변했는가”에 집중한다. 동탄·분당·수지와의 지역 간 비교는 관련 콘텐츠로 넘긴다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.gdap-page
    CalculatorHero
      - Hero: "광교 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 광교 생활권 기준이며 행정구역상 수원·용인이 섞일 수 있음
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 최저가 대비 금액은 평가차익(추정)

    section.gdap-summary
      - 기준일, 대표 단지 수, 최고 기준가, 최대 평가차익, 호수공원권 단지 수 KPI

    section.gdap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.gdap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가, 최저가 거래 시점, 현재 기준가, 평가차익, 상승률

    section.gdap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 상승률, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.gdap-lifestyle-map
      - 호수공원권·신분당선권·상현역권·업무지구권 생활권 카드

    section.gdap-chart
      - 단지별 현재가 vs 5년 최저가 막대 비교
      - 상승률 순, 평가차익 순 정렬 옵션

    section.gdap-context
      - 광교호수공원, 신분당선, 법조타운·업무지구, 수원·용인 고소득 수요 등 사실 기반 설명

    section.gdap-data-method
      - 선정 기준, 가격 산식, 데이터 한계

    section.gdap-risk
      - 거래 건수 부족, 생활권 기준 혼동, 층·향·동 차이, 금리·대출 규제, 신축 프리미엄 둔화 리스크

    section.gdap-related
      - 관련 리포트·계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/gwanggyoApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";
export type GwanggyoAreaGroup =
  | "호수공원권"
  | "광교중앙역권"
  | "상현역권"
  | "신대역권"
  | "업무지구권"
  | "광교 인접";

export interface GwanggyoApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface GwanggyoApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  cityLabel: "수원시 영통구" | "용인시 수지구" | "확인 필요";
  areaGroup: GwanggyoAreaGroup;
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  parkLabel?: string;
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

export interface GwanggyoLifestyleCard {
  areaGroup: GwanggyoAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GwanggyoContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GwanggyoFaqItem {
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

Top10은 구현 직전 국토교통부 실거래가 공개시스템에서 다시 검증한다. 아래 목록은 확정 순위가 아니라 리서치 우선순위다.

| 우선순위 | 후보 단지 | 생활권 | 선정 이유 |
|---:|---|---|---|
| 1 | 광교중흥S클래스 | 호수공원권 | 광교 대장 상징성, 호수공원 조망·상업지 접근성, 단지명 검색 수요 강함 |
| 2 | 광교자연앤힐스테이트 | 광교중앙역권 | 광교 대표 선호 단지, 신분당선·업무지구 접근성 |
| 3 | 광교호수공원 아이파크 | 호수공원권 | 호수공원권 고가 단지 비교축 |
| 4 | 광교더샵 | 광교중앙역권 | 광교중앙역·업무지구 접근성 후보 |
| 5 | 광교센트럴뷰 | 광교중앙역권 | 역세권·생활 인프라 비교축 |
| 6 | 래미안광교 | 광교 인접 | 광교 생활권 내 브랜드 선호 후보, 행정구역 확인 필요 |
| 7 | 광교상록자이 | 광교 인접 | 광교 인접 구축·준신축 비교 후보 |
| 8 | e편한세상 광교 | 상현역권 | 상현역·수지 접점, 행정구역 주의 필요 |
| 9 | 광교힐스테이트 | 신대역권 | 신대역·호수공원 접근성 후보 |
| 10 | 광교푸르지오 월드마크 | 업무지구권 | 업무지구·상권 접근성 후보, 면적 혼재 주의 |

후보 단지명은 실제 실거래가 시스템 표기와 다를 수 있다. 구현 시 `complexNameOfficial`로 국토교통부 표기명을 별도 저장하고, 화면에는 사용자 검색에 익숙한 이름을 사용한다.

---

## 6. 핵심 기능 설계

### 6-1. 단지 탭

- 데스크톱: 상단 가로 탭 10개
- 모바일: 가로 스크롤 segmented control 또는 `select`
- 탭 클릭 시 아래 요소가 함께 갱신된다.
  - 대표 단지명
  - 행정구역
  - 생활권 배지
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `jungheung-s-class` |
| `sort` | `rank` / `gain` / `gainRate` / `latestPrice` / `area` | `rank` |

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
- `투자 수익`, `수익 확정`, `몇 억 벌었다`, `안전한 투자` 표현 금지
- 제목·카드 후킹 문장에는 “얼마를 벌었을까?”를 쓸 수 있지만, 수치 라벨은 `평가차익(추정)`으로 고정

주의 문구:

```text
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 호수공원 조망, 층, 향, 동, 거래 시점에 따라 실제 가격은 크게 달라질 수 있습니다.
```

### 6-3. Top10 비교표

컬럼:

| 컬럼 | 설명 |
|---|---|
| 순위 | 최근 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 행정구역 | 수원시 영통구 / 용인시 수지구 |
| 생활권 | 호수공원권 / 광교중앙역권 / 상현역권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래일 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 평균 또는 대표 거래 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 층·향·조망 차이 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 큰 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

광교는 행정구역보다 생활권으로 검색·비교되는 경우가 많다. 단지 탭 아래 또는 비교표 옆에 생활권 해석 카드를 둔다.

카드 구성:

| 필드 | 설명 |
|---|---|
| 생활권 | 호수공원권 / 광교중앙역권 / 상현역권 / 업무지구권 |
| 핵심 선호 요인 | 조망, 신분당선, 업무지구, 학군, 상권 |
| 가격 해석 | 어떤 프리미엄이 가격에 반영될 수 있는지 |
| 주의 | 행정구역·역 접근성·조망·층향 차이 |

고정 주의 문구:

```text
광교 생활권은 수원시 영통구와 용인시 수지구 일부가 함께 검색되는 경우가 있습니다. 이 리포트는 행정구역 순위가 아니라 광교 생활권 대표 단지 비교입니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 또는 단순 카드형 그래프로 충분하다. 동탄·분당·광교 시리즈가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익
- 생활권 배지

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 행정구역과 공식 단지명 확인
- 호수공원권 단지는 조망 여부에 따라 가격 차이가 커질 수 있음을 표기
- 거래 건수가 1~2건뿐이면 평균값처럼 보이지 않게 `대표 거래`로 표기

데이터 배지:

| 배지 | 사용 조건 |
|---|---|
| 공식 | 국토교통부 실거래가 공개시스템에서 직접 확인한 값 |
| 보도 기반 | 기사·공개 보도에서 인용했으나 원문 재확인이 필요한 값 |
| 추정 | 산식으로 계산한 평가차익·상승률 |
| 확인 필요 | 구현 전 임시 후보 또는 단지명·면적·행정구역 확인 전 값 |

---

## 8. SEO 설계

### title

```text
광교 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나
```

### H1

```text
광교 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
광교중흥S클래스와 광교자연앤힐스테이트 등 광교 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 호수공원·신분당선·업무지구 프리미엄과 데이터 기준도 함께 확인하세요.
```

### H2 후보

- 광교 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 호수공원권·광교중앙역권·상현역권 가격 차이
- 광교 아파트가 비싼 이유
- 광교 실거래가를 볼 때 반드시 확인할 점
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const GDAP_FAQ: GwanggyoFaqItem[] = [
  {
    question: "광교 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 호수공원·신분당선·업무지구 접근성, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "광교 생활권은 수원인가요, 용인인가요?",
    answer:
      "둘 다 섞여 검색되는 경우가 많습니다. 광교신도시는 수원시 영통구와 용인시 수지구 일부가 함께 생활권을 형성하므로, 이 리포트는 행정구역 순위가 아니라 광교 생활권 대표 단지 비교로 봐야 합니다.",
  },
  {
    question: "광교중흥S클래스가 광교에서 가장 비싼 아파트인가요?",
    answer:
      "광교중흥S클래스는 광교 대표 대장 단지로 자주 언급되지만, 거래 시점·면적·층·향·호수 조망 여부에 따라 다른 단지가 더 높은 거래를 기록할 수 있습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "광교 아파트는 왜 비싼가요?",
    answer:
      "호수공원, 신분당선, 법조타운·업무지구, 수원·용인 고소득 실거주 수요, 신도시 인프라가 함께 가격을 지지합니다. 다만 단지별 조망과 역 접근성에 따라 가격 차이가 큽니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 호수공원 조망이나 희소성이 큰 단지는 전세가율이 낮아도 매매가가 높을 수 있습니다.",
  },
  {
    question: "지금 광교 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const GDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/",
    label: "동탄·분당·수지·영통 대장 아파트 비교",
    description: "경기 남부 주요 주거지의 84㎡ 가격대와 교통·학군·리스크를 비교합니다.",
  },
  {
    href: "/reports/dongtan-apartment-price-2026/",
    label: "동탄 대장 아파트 Top10",
    description: "GTX-A 이후 동탄 대표 단지의 실거래가와 최저가 대비 평가차익을 확인합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 대표 단지의 실거래가와 재건축 기대, 최저가 대비 평가차익을 확인합니다.",
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
src/data/gwanggyoApartmentPrice2026.ts
src/pages/reports/gwanggyo-apartment-price-2026.astro
public/scripts/gwanggyo-apartment-price-2026.js
src/styles/scss/pages/_gwanggyo-apartment-price-2026.scss
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
  GDAP_META,
  GDAP_APARTMENTS,
  GDAP_LIFESTYLE_CARDS,
  GDAP_CONTEXT,
  GDAP_FAQ,
  GDAP_RELATED_LINKS,
  GDAP_SEO_INTRO,
  GDAP_SEO_CRITERIA,
} from "../../data/gwanggyoApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: GDAP_META.title,
    description: GDAP_META.description,
    dateModified: GDAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GDAP_FAQ.map((item) => ({
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

<BaseLayout title={GDAP_META.seoTitle} description={GDAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page gdap-page" data-report="gwanggyo-apartment-price-2026">
    <CalculatorHero
      eyebrow="광교 실거래가 리포트"
      title="광교 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={GDAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        GDAP_META.notice,
        "광교 생활권은 수원시 영통구와 용인시 수지구 일부가 함께 검색되는 경우가 있어, 단지별 행정구역을 따로 표시합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / lifestyle cards / chart / context / risk / related -->

    <SeoContent
      introTitle="광교 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={GDAP_SEO_INTRO}
      criteria={GDAP_SEO_CRITERIA}
      faq={GDAP_FAQ}
      related={GDAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/gwanggyo-apartment-price-2026.js`

주요 함수:

```js
function formatEok(manwon) {}
function formatPercent(value) {}
function getApartmentById(id) {}
function setActiveApartment(id) {}
function renderProfitCard(apartment) {}
function renderLifestyleStatus(apartment) {}
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
<script type="application/json" id="gdap-data">
  {JSON.stringify(GDAP_APARTMENTS)}
</script>
<script type="application/json" id="gdap-lifestyle-data">
  {JSON.stringify(GDAP_LIFESTYLE_CARDS)}
</script>
<script src={withBase("/scripts/gwanggyo-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `GDAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_gwanggyo-apartment-price-2026.scss`

prefix: `gdap-`

```scss
.gdap-page {
  --gdap-ink: #172033;
  --gdap-muted: #667085;
  --gdap-line: #d8e0ea;
  --gdap-soft: #f6f8fb;
  --gdap-blue: #2563eb;
  --gdap-green: #138a5b;
  --gdap-cyan: #0e7490;
  --gdap-amber: #b7791f;
  --gdap-red: #c2410c;
}
```

주요 클래스:

```text
gdap-summary-grid
gdap-summary-card
gdap-tabs
gdap-tab
gdap-profit-card
gdap-profit-card__main
gdap-profit-card__meta
gdap-area-badge
gdap-lifestyle-grid
gdap-lifestyle-card
gdap-table-wrap
gdap-table
gdap-sort-controls
gdap-bar-list
gdap-bar-row
gdap-context-grid
gdap-context-card
gdap-risk-list
gdap-related-grid
gdap-related-card
```

반응형:

- 920px 이하: KPI·맥락·생활권 카드 2열
- 640px 이하: 카드 1열, 탭 가로 스크롤
- 표는 `overflow-x: auto` 허용, 최소 너비 860px
- 생활권 배지는 모바일에서 줄바꿈 허용
- 최저가 대비 카드의 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 광교 리포트는 호수공원·역세권·업무지구 정보를 읽는 페이지이므로 표와 카드의 가독성 우선
- 파랑·녹색·청록을 섞되 한 색상 계열만 과도하게 쓰지 않는다.
- 상승률 색상은 강조하되 `추정` 배지를 반드시 붙인다.
- 색상만으로 생활권이나 위험도를 구분하지 않고 텍스트 라벨을 병행한다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `광교는 안전하다`
- `광교가 동탄보다 낫다`
- `호수공원 조망이면 무조건 프리미엄`
- `전세가율이 높으니 좋은 단지`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `광교 생활권 기준`
- `행정구역은 단지별로 확인 필요`
- `조망·층·향·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] 단지 Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증됐는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 최저가 대비 금액이 모두 `평가차익(추정)`으로 표시되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고지되는가?
- [ ] 광교 생활권 기준과 행정구역 혼재 주의 문구가 표시되는가?
- [ ] 호수공원 조망·층·향 차이를 확정 프리미엄처럼 말하지 않는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·생활권 상태·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 표가 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체를 밀지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함했는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준값 확정
2. 단지별 행정구역·공식 단지명·생활권 분류 재검증
3. `src/data/gwanggyoApartmentPrice2026.ts` 생성
4. 리포트 Astro 페이지 생성
5. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
6. SCSS 작성
7. `reports.ts`, `app.scss`, `sitemap.xml` 등록
8. `npm run build`
9. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 동탄·분당 리포트와 상호 링크 연결
- 수지·수원 리포트로 같은 데이터 구조 재사용
- 광교와 수지를 별도 리포트로 나누되, 상현역권 단지가 겹치면 “광교 생활권 기준”과 “수지 행정구역 기준”을 문서별로 분리
- 지역 리포트가 2~3개 이상 쌓인 뒤 허브 페이지 `seoul-gyeonggi-flagship-apartment-top10-2026` 구현
- 허브에서는 지역별 대표 단지 1개와 평가차익 상위 카드만 요약하고, 상세 수치는 지역 리포트로 연결
