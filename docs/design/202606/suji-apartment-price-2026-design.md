# 수지 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 원칙: 수지는 `신분당선 + 학군 + 판교·강남 접근성`으로 검색되는 실거주형 상급 주거지다. “분당 대체지”라는 표현은 사용할 수 있지만, 분당과의 우열을 단정하지 않는다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `수지 대장 아파트 Top10 2026`
- 추천 slug: `suji-apartment-price-2026`
- URL: `/reports/suji-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `수지 아파트 실거래가`, `수지 대장 아파트`, `성복역 아파트 시세`, `수지 아파트 상승률`
- 2차 검색 의도: `수지 신분당선 아파트`, `성복역롯데캐슬골드타운 실거래가`, `e편한세상수지 실거래가`, `상현역 아파트`, `동천동 아파트 시세`
- 핵심 출력: 수지구 Top10 단지 비교표, 단지 탭, 최근 5년 최저가 대비 평가차익 카드, 성복·상현·동천 생활권 해석, 신분당선 접근성, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “분당보다 가격 부담을 낮추면서 신분당선·학군·판교 접근성을 가져갈 수 있는가”를 단지별 실거래가와 저점 대비 변화로 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `gwanggyo-apartment-price-2026` | 광교 생활권 단지별 시세·저점 대비 변화 | 상현역·광교 인접 단지 경계 설명 필요 |
| `bundang-apartment-price-2026` | 분당 단지별 Top10 시세·재건축 기대 | 수지의 분당 대체지 검색 의도 연결 |
| `dongtan-apartment-price-2026` | 동탄 단지별 Top10 시세·GTX-A 후킹 | 경기 남부 시리즈 상호 링크 |
| `gyeonggi-south-leader-apartment-comparison-2026` | 동탄·분당·수지·영통 권역 비교 | 지역 간 비교 니즈 대응 |
| `suji-apartment-price-2026` | 수지구 단지별 실거래가·저점 대비 변화 | 이번 구현 대상 |

이번 리포트는 “수지구 안에서 어떤 단지가 가격 상단을 형성하고, 2021~2026 저점 대비 얼마나 변했는가”에 집중한다. 분당·광교·동탄과의 권역 비교는 관련 콘텐츠로 연결한다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.sjap-page
    CalculatorHero
      - Hero: "수지 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 용인시 수지구 기준, 광교 생활권과 겹치는 단지는 별도 고지
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 최저가 대비 금액은 평가차익(추정)

    section.sjap-summary
      - 기준일, 대표 단지 수, 최고 기준가, 최대 평가차익, 신분당선권 단지 수 KPI

    section.sjap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.sjap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가, 최저가 거래 시점, 현재 기준가, 평가차익, 상승률

    section.sjap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 상승률, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.sjap-line-map
      - 성복역권·상현역권·동천역권·풍덕천권 생활권 카드

    section.sjap-chart
      - 단지별 현재가 vs 5년 최저가 막대 비교
      - 상승률 순, 평가차익 순 정렬 옵션

    section.sjap-context
      - 신분당선, 학군, 판교·강남 접근성, 광교 인접성 등 사실 기반 설명

    section.sjap-data-method
      - 선정 기준, 가격 산식, 데이터 한계

    section.sjap-risk
      - 교통 체감 편차, 도로 정체, 거래 건수 부족, 층·향·동 차이, 금리·대출 규제 리스크

    section.sjap-related
      - 관련 리포트·계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/sujiApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";
export type SujiAreaGroup =
  | "성복역권"
  | "상현역권"
  | "동천역권"
  | "수지구청역권"
  | "풍덕천권"
  | "광교 인접";

export interface SujiApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SujiApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SujiAreaGroup;
  legalDongLabel: "성복동" | "상현동" | "동천동" | "풍덕천동" | "죽전동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  schoolNote?: string;
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

export interface SujiLifestyleCard {
  areaGroup: SujiAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SujiContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SujiFaqItem {
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
| 1 | 성복역 롯데캐슬 골드타운 | 성복역권 | 신분당선 성복역 상징성, 수지 대표 신축·준신축 고가 단지 |
| 2 | e편한세상 수지 | 수지구청역권 | 수지 대장급 인지도, 실거주 선호도·단지명 검색 수요 |
| 3 | 래미안 수지 이스트파크 | 풍덕천권 | 브랜드·준신축성, 수지 중심 생활권 비교축 |
| 4 | 동천자이 | 동천역권 | 판교·강남 접근 수요, 동천동 대표축 |
| 5 | 동천 래미안 이스트팰리스 | 동천역권 | 동천동 고가 단지 비교축, 대단지·브랜드 인지도 |
| 6 | 성복역 KCC스위첸 | 성복역권 | 성복역권 가격대 보조 후보 |
| 7 | 수지 성복 힐스테이트 | 성복역권 | 성복동 브랜드 단지 후보, 데이터 확인 필요 |
| 8 | 광교상현 솔하임 또는 상현역 인접 단지 | 상현역권 | 광교·수지 경계 검색 대응, 공식 단지명 확인 필요 |
| 9 | 만현마을 계열 단지 | 상현역권 | 상현동 실거주 수요와 가격 접근성 비교 후보 |
| 10 | 풍덕천 현대·삼성 계열 대표 단지 | 풍덕천권 | 구축 수지 중심 생활권 비교 후보 |

후보 단지명은 실제 실거래가 시스템 표기와 다를 수 있다. 구현 시 `complexNameOfficial`로 국토교통부 표기명을 별도 저장하고, 화면에는 사용자 검색에 익숙한 이름을 사용한다.

---

## 6. 핵심 기능 설계

### 6-1. 단지 탭

- 데스크톱: 상단 가로 탭 10개
- 모바일: 가로 스크롤 segmented control 또는 `select`
- 탭 클릭 시 아래 요소가 함께 갱신된다.
  - 대표 단지명
  - 법정동
  - 생활권 배지
  - 신분당선 접근 메모
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `seongbok-lotte-castle-goldtown` |
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
- `투자 수익`, `수익 확정`, `몇 억 벌었다`, `분당 대체 확정` 표현 금지
- 제목·카드 후킹 문장에는 “얼마를 벌었을까?”를 쓸 수 있지만, 수치 라벨은 `평가차익(추정)`으로 고정

주의 문구:

```text
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 신분당선 접근성, 학군, 층, 향, 동, 거래 시점에 따라 실제 가격은 크게 달라질 수 있습니다.
```

### 6-3. Top10 비교표

컬럼:

| 컬럼 | 설명 |
|---|---|
| 순위 | 최근 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 법정동 | 성복동 / 상현동 / 동천동 / 풍덕천동 등 |
| 생활권 | 성복역권 / 상현역권 / 동천역권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래일 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 평균 또는 대표 거래 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 역 접근성, 층·향 차이 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 큰 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

수지는 같은 수지구 안에서도 성복·상현·동천의 교통 체감과 가격대가 다르다. 비교표 옆이나 아래에 생활권 해석 카드를 둔다.

카드 구성:

| 필드 | 설명 |
|---|---|
| 생활권 | 성복역권 / 상현역권 / 동천역권 / 수지구청역권 |
| 핵심 선호 요인 | 신분당선, 학군, 판교·강남 접근, 생활 인프라 |
| 가격 해석 | 어떤 프리미엄이 가격에 반영될 수 있는지 |
| 주의 | 역 접근성·도로 정체·광교 경계·단지 연식 차이 |

고정 주의 문구:

```text
수지는 신분당선 접근성이 핵심이지만, 성복·상현·동천·풍덕천은 실제 이동 동선과 도로 체감이 다릅니다. 같은 수지구라도 역 접근성과 생활권을 나눠 봐야 합니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 또는 단순 카드형 그래프로 충분하다. 동탄·분당·광교·수지 시리즈가 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

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
- 각 단지의 법정동, 공식 단지명, 역 접근성 확인
- 광교 생활권과 겹치는 상현역권 단지는 수지 행정구역 기준임을 표기
- 거래 건수가 1~2건뿐이면 평균값처럼 보이지 않게 `대표 거래`로 표기

데이터 배지:

| 배지 | 사용 조건 |
|---|---|
| 공식 | 국토교통부 실거래가 공개시스템에서 직접 확인한 값 |
| 보도 기반 | 기사·공개 보도에서 인용했으나 원문 재확인이 필요한 값 |
| 추정 | 산식으로 계산한 평가차익·상승률 |
| 확인 필요 | 구현 전 임시 후보 또는 단지명·면적·역 접근성 확인 전 값 |

---

## 8. SEO 설계

### title

```text
수지 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나
```

### H1

```text
수지 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
성복역 롯데캐슬 골드타운, e편한세상 수지 등 수지 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 신분당선·학군·판교 접근성과 데이터 기준도 함께 확인하세요.
```

### H2 후보

- 수지 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 성복역권·상현역권·동천역권 가격 차이
- 수지가 분당 대체지로 거론되는 이유
- 수지 실거래가를 볼 때 반드시 확인할 점
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const SJAP_FAQ: SujiFaqItem[] = [
  {
    question: "수지 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 신분당선 접근성, 성복·상현·동천 생활권 대표성, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "수지는 분당 대체지가 될 수 있나요?",
    answer:
      "수지는 신분당선, 학군, 판교·강남 접근성을 갖춘 지역이라 분당보다 가격 부담을 낮추고 싶은 실거주자에게 대체지로 검토됩니다. 다만 분당과 입지·학군·가격 레벨이 같다는 뜻은 아니며, 성복·상현·동천별 체감이 다릅니다.",
  },
  {
    question: "성복역 롯데캐슬 골드타운이 수지에서 가장 비싼 아파트인가요?",
    answer:
      "성복역 롯데캐슬 골드타운은 수지 대표 대장 단지로 자주 언급되지만, 거래 시점·면적·층·향·동에 따라 e편한세상 수지, 동천동 주요 단지 등 다른 단지가 더 높은 거래를 기록할 수 있습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "수지 아파트는 왜 비싼가요?",
    answer:
      "신분당선, 학군, 판교·강남 접근성, 성복·상현·동천의 주거 선호, 광교 생활권 인접성이 함께 가격을 지지합니다. 다만 단지별 역 접근성과 도로 체감에 따라 가격 차이가 큽니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 신분당선 접근성이 강한 단지는 전세가율이 낮아도 매매가가 높을 수 있고, 전세가율이 높아도 향후 매매가를 보장하지 않습니다.",
  },
  {
    question: "지금 수지 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 출퇴근 동선, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const SJAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/",
    label: "동탄·분당·수지·영통 대장 아파트 비교",
    description: "경기 남부 주요 주거지의 84㎡ 가격대와 교통·학군·리스크를 비교합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 대표 단지의 실거래가와 재건축 기대, 최저가 대비 평가차익을 확인합니다.",
  },
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "광교 생활권 대표 단지의 실거래가와 최저가 대비 평가차익을 확인합니다.",
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
src/data/sujiApartmentPrice2026.ts
src/pages/reports/suji-apartment-price-2026.astro
public/scripts/suji-apartment-price-2026.js
src/styles/scss/pages/_suji-apartment-price-2026.scss
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
  SJAP_META,
  SJAP_APARTMENTS,
  SJAP_LIFESTYLE_CARDS,
  SJAP_CONTEXT,
  SJAP_FAQ,
  SJAP_RELATED_LINKS,
  SJAP_SEO_INTRO,
  SJAP_SEO_CRITERIA,
} from "../../data/sujiApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SJAP_META.title,
    description: SJAP_META.description,
    dateModified: SJAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SJAP_FAQ.map((item) => ({
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

<BaseLayout title={SJAP_META.seoTitle} description={SJAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sjap-page" data-report="suji-apartment-price-2026">
    <CalculatorHero
      eyebrow="수지 실거래가 리포트"
      title="수지 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={SJAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        SJAP_META.notice,
        "이 리포트는 용인시 수지구 기준이며, 광교 생활권과 겹치는 상현역권 단지는 별도로 표시합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / lifestyle cards / chart / context / risk / related -->

    <SeoContent
      introTitle="수지 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={SJAP_SEO_INTRO}
      criteria={SJAP_SEO_CRITERIA}
      faq={SJAP_FAQ}
      related={SJAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/suji-apartment-price-2026.js`

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
<script type="application/json" id="sjap-data">
  {JSON.stringify(SJAP_APARTMENTS)}
</script>
<script type="application/json" id="sjap-lifestyle-data">
  {JSON.stringify(SJAP_LIFESTYLE_CARDS)}
</script>
<script src={withBase("/scripts/suji-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `SJAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_suji-apartment-price-2026.scss`

prefix: `sjap-`

```scss
.sjap-page {
  --sjap-ink: #172033;
  --sjap-muted: #667085;
  --sjap-line: #d8e0ea;
  --sjap-soft: #f6f8fb;
  --sjap-blue: #2563eb;
  --sjap-green: #138a5b;
  --sjap-teal: #0f766e;
  --sjap-amber: #b7791f;
  --sjap-red: #c2410c;
}
```

주요 클래스:

```text
sjap-summary-grid
sjap-summary-card
sjap-tabs
sjap-tab
sjap-profit-card
sjap-profit-card__main
sjap-profit-card__meta
sjap-area-badge
sjap-lifestyle-grid
sjap-lifestyle-card
sjap-table-wrap
sjap-table
sjap-sort-controls
sjap-bar-list
sjap-bar-row
sjap-context-grid
sjap-context-card
sjap-risk-list
sjap-related-grid
sjap-related-card
```

반응형:

- 920px 이하: KPI·맥락·생활권 카드 2열
- 640px 이하: 카드 1열, 탭 가로 스크롤
- 표는 `overflow-x: auto` 허용, 최소 너비 860px
- 생활권 배지는 모바일에서 줄바꿈 허용
- 최저가 대비 카드의 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 수지 리포트는 신분당선·학군·생활권 정보를 읽는 페이지이므로 표와 카드의 가독성 우선
- 파랑·초록·청록을 섞되 한 색상 계열만 과도하게 쓰지 않는다.
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
- `수지는 안전하다`
- `수지가 분당보다 낫다`
- `분당 대체 확정`
- `신분당선이면 무조건 오른다`
- `전세가율이 높으니 좋은 단지`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `수지구 기준`
- `광교 생활권과 겹치는 단지는 별도 확인 필요`
- `역 접근성·층·향·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] 단지 Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증됐는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 최저가 대비 금액이 모두 `평가차익(추정)`으로 표시되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고지되는가?
- [ ] 수지구 기준과 광교 생활권 중첩 주의 문구가 표시되는가?
- [ ] 신분당선·학군·분당 대체지 표현이 단정으로 흐르지 않는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·생활권 상태·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 표가 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체를 밀지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함했는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료됐는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준값 확정
2. 단지별 법정동·공식 단지명·생활권 분류·역 접근성 재검증
3. `src/data/sujiApartmentPrice2026.ts` 생성
4. 리포트 Astro 페이지 생성
5. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
6. SCSS 작성
7. `reports.ts`, `app.scss`, `sitemap.xml` 등록
8. `npm run build`
9. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 광교·분당 리포트와 상호 링크 연결
- 수원·영통 리포트로 같은 데이터 구조 재사용
- 광교와 수지를 별도 리포트로 유지하되, 상현역권 단지가 겹치면 `광교 생활권 기준`과 `수지구 행정구역 기준`을 문서별로 분리
- 지역 리포트가 2~3개 이상 쌓인 뒤 허브 페이지 `seoul-gyeonggi-flagship-apartment-top10-2026` 구현
- 허브에서는 지역별 대표 단지 1개와 평가차익 상위 카드만 요약하고, 상세 수치는 지역 리포트로 연결
