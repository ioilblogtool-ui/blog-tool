# 하남·미사 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 하남·미사는 `미사강변도시 신축 대단지`, `5호선 하남선`, `한강공원·망월천 생활권`, `강동·잠실 접근성`, `위례·감일 신도시축`이 함께 작동하는 서울 동부 확장 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `하남·미사 대장 아파트 Top10 2026`
- 추천 slug: `hanam-misa-apartment-price-2026`
- URL: `/reports/hanam-misa-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `미사 아파트 실거래가`, `하남 대장 아파트`, `미사강변도시 아파트 시세`, `하남 미사 아파트`
- 2차 검색 의도: `미사강변센트럴자이 실거래가`, `미사강변푸르지오 실거래가`, `미사강변리버뷰자이 실거래가`, `미사역 아파트 실거래가`, `하남 위례 아파트 시세`
- 핵심 출력: 하남·미사 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 미사역·망월천·한강변·감일·위례 생활권 해석, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “서울보다 싸서 오른다”가 아니라, 5호선·강동 접근성·한강공원·신축 대단지·실거주 수요를 분리해서 설명한다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `gangdong-apartment-price-2026` | 고덕·상일·둔촌 동남권 대단지축 | 하남·미사와 가장 가까운 내부링크 축 |
| `songpa-apartment-price-2026` | 잠실·가락·문정 고수요 대단지 | 잠실 접근성 비교 |
| `suwon-yeongtong-apartment-price-2026` | 경기 남부 업무지구형 주거지 | 수도권 외곽 핵심 주거지 비교 |
| `gwanggyo-apartment-price-2026` | 광교 생활권·신도시 고가축 | 신도시형 고가 주거지 비교 |
| `hanam-misa-apartment-price-2026` | 미사·감일·위례·하남 원도심 단지별 실거래가 | 이번 구현 대상 |
| `seoul-gyeonggi-flagship-apartment-top10-2026` | 서울·경기 대표 단지 허브 | 지역 리포트가 충분히 쌓인 뒤 구현 |

하남·미사 리포트는 강동 리포트와 함께 동서울·동경기 클러스터를 만든다. 강동 고덕·상일과 미사강변도시는 5호선 축으로 이어지므로 내부링크 효율이 좋다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.hmap-page
    CalculatorHero
      - Hero: "하남·미사 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 경기도 하남시 행정구역 기준
      - 미사강변도시와 위례·감일은 생활권이 다르므로 분리 해석
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.hmap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 미사강변도시 단지 수
      - 감일·위례 후보 단지 수

    section.hmap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.hmap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.hmap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.hmap-area-map
      - 미사역권
      - 망월천·한강공원권
      - 감일권
      - 위례 하남권
      - 덕풍·신장 원도심권

    section.hmap-context
      - 하남·미사 가격을 읽는 핵심 변수
      - 5호선 하남선
      - 강동·잠실 접근성
      - 미사 업무·상업지구
      - 한강공원·망월천 생활권
      - 감일·위례 신도시 수요

    section.hmap-risk
      - 거래 건수 부족
      - 면적·동·층·향 차이
      - 서울 접근성 과장 금지
      - 미사와 위례·감일 직접 비교 주의
      - 금리·대출 규제

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/hanamMisaApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type HanamMisaAreaGroup =
  | "미사역권"
  | "망월천·한강공원권"
  | "감일권"
  | "위례 하남권"
  | "덕풍·신장권";

export interface HanamMisaApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface HanamMisaApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: HanamMisaAreaGroup;
  legalDongLabel:
    | "망월동"
    | "풍산동"
    | "선동"
    | "미사동"
    | "감이동"
    | "학암동"
    | "덕풍동"
    | "신장동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  riverNote?: string;
  commuteNote?: string;
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

export interface HanamMisaAreaCard {
  areaGroup: HanamMisaAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface HanamMisaContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface HanamMisaFaqItem {
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
| 1 | 미사강변센트럴자이 | 미사역권 | 미사 대표 브랜드 단지 후보, 검색 수요와 인지도 강함 |
| 2 | 미사강변푸르지오 | 망월천·한강공원권 | 미사강변도시 대표 후보, 한강·망월천 생활권 비교 |
| 3 | 미사강변리버뷰자이 | 망월천·한강공원권 | 강변 생활권·브랜드 선호 후보 |
| 4 | 미사강변더샵리버포레 | 망월천·한강공원권 | 미사 강변축 보완 후보, 공식 단지명 확인 필요 |
| 5 | 미사강변도시 주요 엠코/센트럴 계열 단지 | 미사역권 | 역 접근성·상업지구 접근성 비교 후보 |
| 6 | 하남감일스윗시티 대표 단지 | 감일권 | 송파·위례 접근성 보완 후보 |
| 7 | 감일 푸르지오 또는 감일 신축 대표 단지 | 감일권 | 감일 신도시형 수요 비교 후보 |
| 8 | 위례 하남권 대표 단지 | 위례 하남권 | 위례 생활권과 하남 행정구역 중복 주의 후보 |
| 9 | 덕풍·신장동 대표 단지 | 덕풍·신장권 | 하남 원도심 실거주 수요 보완 후보 |
| 10 | 하남검단산역·하남시청역 인접 대표 단지 | 덕풍·신장권 | 5호선 동부축 보완 후보 |

후보 단지명은 실제 실거래가 시스템 표기와 다를 수 있다. 구현 시 `complexNameOfficial`에 국토교통부 표기명을 저장하고, 화면에는 사용자가 검색하는 일반 명칭을 병기한다.

---

## 6. 핵심 기능 설계

### 6-1. 단지 탭

- 데스크톱: 상단 가로 탭 10개
- 모바일: 가로 스크롤 segmented control 또는 `select`
- 탭 클릭 시 아래 요소가 함께 갱신된다.
  - 대표 단지명
  - 법정동
  - 생활권
  - 5호선·한강공원·강동 접근 메모
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `misa-central-xi` |
| `sort` | `rank` / `gain` / `gainRate` / `latestPrice` / `area` | `rank` |

### 6-2. 최저가 대비 평가차익 카드

카드 문구:

```text
최저가일 때 샀다면?
2022년 00월 00억원에 거래됐고, 현재 기준가는 00억원입니다.
단순 시세 차이는 약 00억원, 상승률은 00%로 추정됩니다.
```

계산식:

```text
평가차익(추정) = 현재 기준가 - 최근 5년 최저 실거래가
상승률(추정) = 평가차익 / 최근 5년 최저 실거래가 * 100
```

표현 고정:

- `평가차익(추정)` 사용
- `투자 수익`, `수익 확정`, `무조건 오른다`, `미사는 안전하다` 표현 금지
- 5호선·강동 접근성은 `수요 요인으로 작용할 수 있음` 정도로만 표현
- Hero와 카드 제목에서는 “얼마를 벌었을까?”를 사용할 수 있지만, 수치 라벨은 반드시 `평가차익(추정)`으로 표기

주의 문구:

```text
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 같은 단지라도 동·층·향·면적·거래 시점에 따라 실제 가격은 크게 달라질 수 있습니다.
```

### 6-3. Top10 비교표

| 컬럼 | 설명 |
|---|---|
| 순위 | 최신 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 법정동 | 망월동 / 풍산동 / 선동 / 감이동 / 학암동 등 |
| 생활권 | 미사역권 / 망월천·한강공원권 / 감일권 / 위례 하남권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 서울 접근성 과장 주의 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 미사역권 | 5호선, 상업지구, 업무·생활 편의 접근성 | 역 접근성이 가격을 보장한다는 표현 금지 |
| 망월천·한강공원권 | 수변 생활권, 산책·공원 선호, 미사강변도시 이미지 | 조망·수변 접근성은 동·층·향에 따라 차이 큼 |
| 감일권 | 송파·위례 접근성, 신도시형 단지 | 미사와 생활권이 다르므로 직접 비교 주의 |
| 위례 하남권 | 위례 생활권과 하남 행정구역 중첩 | 위례 리포트가 생기면 중복 단지 분리 필요 |
| 덕풍·신장권 | 하남 원도심, 5호선 동부축, 상대적 가격 접근성 | 미사 신축과 입주연식·생활권 차이 표시 |

고정 주의 문구:

```text
하남시는 미사강변도시, 감일, 위례 하남권, 덕풍·신장 원도심의 가격 논리가 다릅니다. 같은 하남시 안에서도 5호선 접근성, 서울 접근성, 입주연식, 단지 규모, 수변 접근성에 따라 가격 차이가 크게 나타날 수 있습니다.
```

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 법정동과 공식 단지명
- 미사강변도시 단지명은 공식 표기와 일반 검색명을 병기
- 위례 하남권 단지는 위례 생활권 문서와 중복될 수 있음을 표시
- 거래 건수가 1~2건뿐이면 평균가처럼 보이지 않게 `대표 거래`로 표기

데이터 배지:

| 배지 | 사용 조건 |
|---|---|
| 공식 | 국토교통부 실거래가 공개시스템에서 직접 확인한 값 |
| 보도 기반 | 기사·공개 보도에서 인용했으나 원문 확인이 필요한 값 |
| 추정 | 계산식으로 산출한 평가차익·상승률 |
| 확인 필요 | 구현 전 후보 또는 단지명·면적·행정구역 확인 전 값 |

---

## 8. SEO 설계

### title

```text
하남·미사 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
하남·미사 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
미사강변센트럴자이, 미사강변푸르지오, 미사강변리버뷰자이 등 하남·미사 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 미사역·망월천·한강공원·감일·위례 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 하남·미사 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 미사역권·한강공원권·감일권 가격 차이
- 미사 아파트가 주목받는 이유
- 하남 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const HMAP_FAQ: HanamMisaFaqItem[] = [
  {
    question: "하남·미사 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "미사 아파트는 왜 주목받나요?",
    answer:
      "5호선 하남선, 강동·잠실 접근성, 미사강변도시의 신축 대단지, 한강공원과 망월천 생활권, 상업지구 접근성이 함께 작용합니다. 다만 단지별 역 접근성과 입주연식에 따라 가격 차이가 큽니다.",
  },
  {
    question: "미사와 감일, 위례를 같이 비교해도 되나요?",
    answer:
      "같은 하남시에 포함될 수 있지만 생활권이 다릅니다. 미사는 5호선·한강공원·강동 접근성이 강하고, 감일·위례는 송파·위례 생활권과 더 가깝게 해석되는 경우가 많습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "5호선 역세권이면 가격이 보장되나요?",
    answer:
      "아닙니다. 역 접근성은 가격에 영향을 줄 수 있는 요인일 뿐입니다. 금리, 대출 규제, 전세 시장, 단지 상태, 거래 시점에 따라 가격은 달라질 수 있습니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 하남·미사 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const HMAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gangdong-apartment-price-2026/",
    label: "강동 대장 아파트 Top10",
    description: "고덕·상일·둔촌 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "신도시형 고가 주거지의 실거래가와 최저가 대비 변화를 비교합니다.",
  },
  {
    href: "/reports/seoul-gyeonggi-flagship-apartment-top10-2026/",
    label: "서울·경기 대장 아파트 Top10 허브",
    description: "서울·경기 주요 지역 대표 단지를 한눈에 비교하는 허브 페이지입니다.",
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
src/data/hanamMisaApartmentPrice2026.ts
src/pages/reports/hanam-misa-apartment-price-2026.astro
public/scripts/hanam-misa-apartment-price-2026.js
src/styles/scss/pages/_hanam-misa-apartment-price-2026.scss
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
  HMAP_META,
  HMAP_APARTMENTS,
  HMAP_AREA_CARDS,
  HMAP_CONTEXT,
  HMAP_FAQ,
  HMAP_RELATED_LINKS,
  HMAP_SEO_INTRO,
  HMAP_SEO_CRITERIA,
} from "../../data/hanamMisaApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: HMAP_META.title,
    description: HMAP_META.description,
    dateModified: HMAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HMAP_FAQ.map((item) => ({
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

<BaseLayout title={HMAP_META.seoTitle} description={HMAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page hmap-page" data-report="hanam-misa-apartment-price-2026">
    <CalculatorHero
      eyebrow="하남·미사 실거래가 리포트"
      title="하남·미사 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={HMAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        HMAP_META.notice,
        "이 리포트는 경기도 하남시 행정구역을 기준으로 하며, 생활권은 미사·감일·위례 하남권·덕풍·신장 등으로 나눠 표시합니다.",
        "미사와 감일·위례는 생활권이 다를 수 있으므로 같은 하남시라도 직접 비교에 주의해야 합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="하남·미사 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={HMAP_SEO_INTRO}
      criteria={HMAP_SEO_CRITERIA}
      faq={HMAP_FAQ}
      related={HMAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/hanam-misa-apartment-price-2026.js`

주요 함수:

```js
function formatEok(manwon) {}
function formatPercent(value) {}
function getApartmentById(id) {}
function setActiveApartment(id) {}
function renderProfitCard(apartment) {}
function renderAreaStatus(apartment) {}
function renderTable(sortKey) {}
function renderBars(sortKey) {}
function readStateFromUrl() {}
function writeStateToUrl(state) {}
function initTabs() {}
function initSortControls() {}
function init() {}
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `HMAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_hanam-misa-apartment-price-2026.scss`

prefix: `hmap-`

```scss
.hmap-page {
  --hmap-ink: #172033;
  --hmap-muted: #667085;
  --hmap-line: #d8e0ea;
  --hmap-soft: #f6f8fb;
  --hmap-blue: #2563eb;
  --hmap-green: #138a5b;
  --hmap-teal: #0f766e;
  --hmap-amber: #b7791f;
  --hmap-red: #c2410c;
}
```

주요 클래스:

```text
hmap-summary-grid
hmap-summary-card
hmap-tabs
hmap-tab
hmap-profit-card
hmap-profit-card__main
hmap-profit-card__meta
hmap-area-badge
hmap-area-grid
hmap-area-card
hmap-table-wrap
hmap-table
hmap-sort-controls
hmap-bar-list
hmap-bar-row
hmap-context-grid
hmap-context-card
hmap-risk-list
hmap-related-grid
hmap-related-card
```

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `미사는 안전하다`
- `하남은 서울 편입 효과로 무조건 오른다`
- `5호선이면 가격이 보장된다`
- `한강공원 옆이면 무조건 프리미엄`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `경기도 하남시 기준`
- `생활권별 가격 논리가 다름`
- `서울 접근성과 현재 실거래가 분리`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 하남시 기준과 생활권 분류 기준이 노출되는가?
- [ ] 미사·감일·위례 하남권을 같은 생활권처럼 단정하지 않는가?
- [ ] 5호선·한강공원·서울 접근성을 가격 보장처럼 표현하지 않는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·생활권 상태·URL 파라미터가 함께 갱신되는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함되었는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료되었는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준가 확정
2. 단지별 법정동·공식 단지명·생활권 분류·역 접근성 재검증
3. 미사·감일·위례 하남권의 생활권 중복 여부 표시
4. 서울 접근성·한강공원·5호선 문구를 현재 실거래가와 분리
5. `src/data/hanamMisaApartmentPrice2026.ts` 생성
6. 리포트 Astro 페이지 생성
7. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
8. SCSS 작성
9. `reports.ts`, `app.scss`, `sitemap.xml` 등록
10. `npm run build`
11. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 강동·하남·송파를 묶은 동서울 주거축 비교 리포트 기획 가능
- 하남 발행 후 위례·남양주 다산·구리 갈매로 경기 동부 클러스터 확장
- 서울·경기 지역 리포트가 충분히 쌓이면 `seoul-gyeonggi-flagship-apartment-top10-2026` 허브 구현
- 허브에서는 지역별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
