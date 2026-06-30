# 분당 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 원칙: 분당 재건축 기대감과 실거래가 변화를 설명하되, 재건축 사업성·분담금·입주 시점을 확정값처럼 말하지 않는다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `분당 대장 아파트 Top10 2026`
- 추천 slug: `bundang-apartment-price-2026`
- URL: `/reports/bundang-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `분당 아파트 실거래가`, `분당 대장 아파트`, `분당 재건축 아파트`, `분당 아파트 상승률`
- 2차 검색 의도: `파크뷰 실거래가`, `정자동 아파트 실거래가`, `분당 시범단지 재건축`, `분당 84 실거래가`, `분당 최저가`
- 핵심 출력: 분당 Top10 단지 비교표, 단지 탭, 최근 5년 최저가 대비 평가차익 카드, 재건축 기대·리스크 안내, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: 단순 시세표가 아니라 “최저가일 때 샀다면 지금 평가차익이 얼마였을까?”와 “재건축 기대가 가격에 얼마나 반영됐는지”를 함께 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `bundang-redevelopment-vs-dongtan-newbuild-2026` | 분당 재건축 vs 동탄 신축 선택 기준 | 지역 간 비교 니즈를 넘기는 내부 링크 |
| `gyeonggi-south-leader-apartment-comparison-2026` | 동탄·분당·수지·영통 권역 비교 | 경기 남부 전체 비교 니즈 대응 |
| `dongtan-apartment-price-2026` | 동탄 단지별 Top10 시세·저점 대비 평가차익 | 시리즈 형식 공유, 상호 링크 |
| `seoul-housing-affordability-map-2026` | 소득 대비 주거 부담 지도 | 분당 가격 부담 해석 CTA |
| `bundang-apartment-price-2026` | 분당 안의 단지별 가격·재건축 기대·저점 대비 변화 | 이번 구현 대상 |

이번 리포트는 “분당 안에서 어떤 단지가 가격 상단을 형성하고, 2021~2026 저점 대비 얼마나 변했는가”에 집중한다. 동탄과의 선택, 경기 남부 권역 비교, 주택 구입 가능성은 관련 콘텐츠로 연결한다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.bdap-page
    CalculatorHero
      - Hero: "분당 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 재건축 사업 단계·분담금은 확정값 아님
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 최저가 대비 금액은 평가차익(추정)

    section.bdap-summary
      - 기준일, 대표 단지 수, 최고 기준가, 최대 평가차익, 재건축 후보 단지 수 KPI

    section.bdap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.bdap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가, 최저가 거래 시점, 현재 기준가, 평가차익, 상승률

    section.bdap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 상승률, 5년 최저가 대비 평가차익, 재건축 상태, 전세가율

    section.bdap-redevelopment-map
      - 정자·수내·서현·이매·야탑 등 권역별 재건축 기대·진행 단계 카드

    section.bdap-chart
      - 단지별 현재가 vs 5년 최저가 막대 비교
      - 상승률 순, 평가차익 순 정렬 옵션

    section.bdap-context
      - 신분당선, 판교 접근성, 학군, 1기 신도시 재건축 기대 등 사실 기반 설명

    section.bdap-data-method
      - 선정 기준, 가격 산식, 데이터 한계

    section.bdap-risk
      - 재건축 분담금, 사업 지연, 거래 건수 부족, 층·향·동 차이, 금리·대출 규제 리스크

    section.bdap-related
      - 관련 리포트·계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/bundangApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";
export type RedevelopmentStatus =
  | "재건축 기대"
  | "선도지구 관련"
  | "특별정비구역 관련"
  | "일반 구축"
  | "신축·준신축"
  | "확인 필요";

export interface BundangApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface BundangApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: "정자동" | "수내동" | "서현동" | "이매동" | "야탑동" | "분당동" | "기타";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  redevelopmentStatus: RedevelopmentStatus;
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

export interface BundangRedevelopmentCard {
  areaGroup: BundangApartmentRow["areaGroup"];
  title: string;
  statusLabel: string;
  description: string;
  caution: string;
  badge: DataBadge;
}

export interface BundangContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface BundangFaqItem {
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

| 우선순위 | 후보 단지 | 권역 | 선정 이유 |
|---:|---|---|---|
| 1 | 파크뷰 | 정자동 | 분당 대장 단지 인지도, 판교·정자 생활권, 단지명 검색 수요 강함 |
| 2 | 정든마을 우성 | 정자동 | 정자역·학군·구축 대표축, 84㎡ 데이터 확보 가능성 |
| 3 | 양지마을 금호 | 수내동 | 수내동 대표 가격 상단, 기존 비교 문서에서 언급된 고가 사례 |
| 4 | 양지마을 한양 | 수내동 | 수내 생활권 비교축, 학군·역세권 수요 |
| 5 | 시범우성 | 서현동 | 분당 시범단지·재건축 기대 검색 수요 |
| 6 | 시범현대 | 서현동 | 시범단지 내 대표 구축, 재건축 기대 설명에 적합 |
| 7 | 시범한양 | 서현동 | 서현 시범단지 비교축, 1기 신도시 재건축 맥락 |
| 8 | 이매촌 청구 | 이매동 | 이매역·판교 접근성, 동별 가격 차이 설명 후보 |
| 9 | 아름마을 건영 | 이매동 | 이매·야탑 생활권 보조 후보, 84㎡ 데이터 확인 필요 |
| 10 | 목련마을 한일 | 분당동 | 특별정비구역·재건축 기대 설명 후보 |

후보 단지명은 실제 실거래가 시스템 표기와 다를 수 있다. 구현 시 `complexNameOfficial`로 국토교통부 표기명을 별도 저장하고, 화면에는 사용자 검색에 익숙한 이름을 사용한다.

---

## 6. 핵심 기능 설계

### 6-1. 단지 탭

- 데스크톱: 상단 가로 탭 10개
- 모바일: 가로 스크롤 segmented control 또는 `select`
- 탭 클릭 시 아래 요소가 함께 갱신된다.
  - 대표 단지명
  - 권역
  - 재건축 상태 배지
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `parkview` |
| `sort` | `rank` / `gain` / `gainRate` / `latestPrice` / `redevelopment` | `rank` |

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
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 재건축 분담금과 이주비도 반영하지 않았으므로 실제 투자 성과나 매수 추천으로 해석하면 안 됩니다.
```

### 6-3. Top10 비교표

컬럼:

| 컬럼 | 설명 |
|---|---|
| 순위 | 최근 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 권역 | 정자동 / 수내동 / 서현동 / 이매동 등 |
| 재건축 상태 | 선도지구 관련 / 특별정비구역 관련 / 일반 구축 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래일 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 평균 또는 대표 거래 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 층·향 차이, 재건축 변수 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 큰 순
- 최근 실거래가 높은 순
- 재건축 기대 단지 우선

### 6-4. 재건축 상태 카드

분당은 동탄과 달리 가격 해석에서 재건축 기대가 핵심 변수다. 단지 탭 아래 또는 비교표 옆에 권역별 재건축 상태 카드를 둔다.

카드 구성:

| 필드 | 설명 |
|---|---|
| 권역 | 정자동·수내동·서현동 등 |
| 진행 상태 | 선도지구 관련, 특별정비구역 관련, 확인 필요 등 |
| 가격에 미치는 해석 | 기대감이 반영될 수 있으나 단지별 차이가 큼 |
| 주의 | 분담금·사업 속도·이주 시점 미확정 |

고정 주의 문구:

```text
재건축 관련 단계는 발행 시점 기준 정리이며, 사업시행자 선정·조합 의사결정·정책 변화에 따라 달라질 수 있습니다. 분담금과 입주 시점은 확정값으로 보지 않아야 합니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 또는 단순 카드형 그래프로 충분하다. 동탄·분당·광교 등 시리즈가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익
- 재건축 기대 배지

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 선도지구·특별정비구역·사업시행자 선정 등 재건축 단계 최신 보도 확인
- 재건축 관련 단지는 분담금·입주 시점·사업 일정이 확정이 아님을 별도 표기
- 거래 건수가 1~2건뿐이면 평균값처럼 보이지 않게 `대표 거래`로 표기

데이터 배지:

| 배지 | 사용 조건 |
|---|---|
| 공식 | 국토교통부 실거래가 공개시스템에서 직접 확인한 값 |
| 보도 기반 | 기사·공개 보도에서 인용했으나 원문 재확인이 필요한 값 |
| 추정 | 산식으로 계산한 평가차익·상승률 |
| 확인 필요 | 구현 전 임시 후보 또는 단지명·면적·재건축 단계 확인 전 값 |

---

## 8. SEO 설계

### title

```text
분당 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나
```

### H1

```text
분당 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
파크뷰와 정자동·수내동·서현동 대표 단지 등 분당 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 1기 신도시 재건축 기대와 데이터 기준도 함께 확인하세요.
```

### H2 후보

- 분당 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 정자동·수내동·서현동 가격 차이
- 재건축 기대가 반영된 단지는 어디인가
- 분당 실거래가를 볼 때 반드시 확인할 점
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const BDAP_FAQ: BundangFaqItem[] = [
  {
    question: "분당 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 정자·수내·서현 등 생활권 대표성, 검색 수요, 거래 데이터 확보 가능성, 재건축 기대 여부를 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세, 재건축 분담금 등을 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "분당 재건축 단지는 지금 사면 안전한가요?",
    answer:
      "안전하다고 단정할 수 없습니다. 선도지구나 특별정비구역 관련 이슈는 가격 기대감을 만들 수 있지만, 사업 속도, 분담금, 이주 시점, 정책 변화에 따라 결과가 크게 달라질 수 있습니다.",
  },
  {
    question: "파크뷰가 분당에서 가장 비싼 아파트인가요?",
    answer:
      "파크뷰는 분당 대표 대장 단지로 자주 언급되지만, 거래 시점·면적·층·향·동에 따라 수내동이나 서현동 일부 단지가 더 높은 거래를 기록할 수 있습니다. 단일 단지를 분당 전체 가격으로 보면 안 됩니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "분당 아파트는 재건축 때문에 오른 건가요?",
    answer:
      "재건축 기대는 중요한 변수 중 하나입니다. 다만 신분당선·분당선 교통, 판교 접근성, 학군, 기존 생활 인프라, 매물 상황도 함께 작용하므로 하나의 이유로 단정하면 안 됩니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 재건축 기대가 큰 단지는 전세가율이 낮아도 매매가가 높을 수 있고, 전세가율이 높아도 사업성이나 입지 변수는 별도로 봐야 합니다.",
  },
  {
    question: "지금 분당 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 재건축 리스크, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const BDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/",
    label: "분당 재건축 vs 동탄 신축 비교",
    description: "15억 예산 기준 두 지역의 실거주·투자·교통·학군 포인트를 비교합니다.",
  },
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
src/data/bundangApartmentPrice2026.ts
src/pages/reports/bundang-apartment-price-2026.astro
public/scripts/bundang-apartment-price-2026.js
src/styles/scss/pages/_bundang-apartment-price-2026.scss
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
  BDAP_META,
  BDAP_APARTMENTS,
  BDAP_REDEVELOPMENT_CARDS,
  BDAP_CONTEXT,
  BDAP_FAQ,
  BDAP_RELATED_LINKS,
  BDAP_SEO_INTRO,
  BDAP_SEO_CRITERIA,
} from "../../data/bundangApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: BDAP_META.title,
    description: BDAP_META.description,
    dateModified: BDAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BDAP_FAQ.map((item) => ({
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

<BaseLayout title={BDAP_META.seoTitle} description={BDAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page bdap-page" data-report="bundang-apartment-price-2026">
    <CalculatorHero
      eyebrow="분당 실거래가 리포트"
      title="분당 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={BDAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        BDAP_META.notice,
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용·재건축 분담금을 반영하지 않은 평가차익(추정)입니다.",
        "재건축 단계와 분담금은 확정값이 아니며, 이 리포트는 투자 권유가 아닙니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / redevelopment cards / chart / context / risk / related -->

    <SeoContent
      introTitle="분당 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={BDAP_SEO_INTRO}
      criteria={BDAP_SEO_CRITERIA}
      faq={BDAP_FAQ}
      related={BDAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/bundang-apartment-price-2026.js`

주요 함수:

```js
function formatEok(manwon) {}
function formatPercent(value) {}
function getApartmentById(id) {}
function setActiveApartment(id) {}
function renderProfitCard(apartment) {}
function renderRedevelopmentStatus(apartment) {}
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
<script type="application/json" id="bdap-data">
  {JSON.stringify(BDAP_APARTMENTS)}
</script>
<script type="application/json" id="bdap-redevelopment-data">
  {JSON.stringify(BDAP_REDEVELOPMENT_CARDS)}
</script>
<script src={withBase("/scripts/bundang-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `BDAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `redevelopment`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_bundang-apartment-price-2026.scss`

prefix: `bdap-`

```scss
.bdap-page {
  --bdap-ink: #172033;
  --bdap-muted: #667085;
  --bdap-line: #d8e0ea;
  --bdap-soft: #f6f8fb;
  --bdap-green: #0f766e;
  --bdap-blue: #2563eb;
  --bdap-amber: #b7791f;
  --bdap-red: #c2410c;
}
```

주요 클래스:

```text
bdap-summary-grid
bdap-summary-card
bdap-tabs
bdap-tab
bdap-profit-card
bdap-profit-card__main
bdap-profit-card__meta
bdap-redevelopment-badge
bdap-redevelopment-grid
bdap-redevelopment-card
bdap-table-wrap
bdap-table
bdap-sort-controls
bdap-bar-list
bdap-bar-row
bdap-context-grid
bdap-context-card
bdap-risk-list
bdap-related-grid
bdap-related-card
```

반응형:

- 920px 이하: KPI·맥락·재건축 카드 2열
- 640px 이하: 카드 1열, 탭 가로 스크롤
- 표는 `overflow-x: auto` 허용, 최소 너비 860px
- 재건축 상태 배지는 모바일에서 줄바꿈 허용
- 최저가 대비 카드의 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 분당 리포트는 재건축·학군·교통 정보를 읽는 페이지이므로 장식보다 표·카드의 가독성 우선
- 녹색 계열만 과도하게 쓰지 않고, 배지·주의·링크에 파랑·주황·회색을 함께 사용
- 상승률 색상은 강조하되 `추정` 배지를 반드시 붙인다.
- 색상만으로 재건축 단계나 위험도를 구분하지 않고 텍스트 라벨을 병행한다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `분당은 안전하다`
- `재건축 확정`
- `입주 확정`
- `분담금은 얼마다`
- `동탄보다 분당이 낫다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용·분담금 미반영`
- `실거래가 기준 참고`
- `재건축 단계는 발행 시점 기준`
- `단지·층·향·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] 단지 Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증됐는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 최저가 대비 금액이 모두 `평가차익(추정)`으로 표시되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고지되는가?
- [ ] 재건축 관련 문구가 `확정`, `안전`, `입주 보장`처럼 보이지 않는가?
- [ ] 분담금·사업 일정은 모두 미확정 또는 확인 필요로 안내되는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·재건축 상태·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 표가 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체를 밀지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함했는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준값 확정
2. 재건축 진행 단계 최신 보도 재검증
3. `src/data/bundangApartmentPrice2026.ts` 생성
4. 리포트 Astro 페이지 생성
5. 단지 탭·정렬·재건축 상태 갱신 스크립트 생성
6. SCSS 작성
7. `reports.ts`, `app.scss`, `sitemap.xml` 등록
8. `npm run build`
9. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 동탄 리포트와 상호 링크 연결
- 광교·수지·수원 리포트로 같은 데이터 구조 재사용
- 지역 리포트가 2~3개 이상 쌓인 뒤 허브 페이지 `seoul-gyeonggi-flagship-apartment-top10-2026` 구현
- 허브에서는 지역별 대표 단지 1개와 평가차익 상위 카드만 요약하고, 상세 수치는 지역 리포트로 연결
- 분당 재건축 진행 단계는 분기별 업데이트 후보로 운영 메모에 추가
