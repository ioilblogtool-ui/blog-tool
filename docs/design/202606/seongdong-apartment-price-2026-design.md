# 성동 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 성동은 `서울숲 초고가축`, `옥수·금호 한강변축`, `왕십리 환승 생활권`, `성수 업무·상권 확장성`이 동시에 작동하는 서울 핵심 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `성동 대장 아파트 Top10 2026`
- 추천 slug: `seongdong-apartment-price-2026`
- URL: `/reports/seongdong-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `성동 아파트 실거래가`, `성동 대장 아파트`, `서울숲 아파트 시세`, `옥수 아파트 실거래가`
- 2차 검색 의도: `트리마제 실거래가`, `아크로서울포레스트 실거래가`, `갤러리아포레 실거래가`, `래미안 옥수 리버젠 실거래가`, `e편한세상 옥수 파크힐스 실거래가`
- 핵심 출력: 성동구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 서울숲·성수·옥수·금호·왕십리 생활권 해석, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: 성동은 같은 구 안에서도 초고가 주상복합, 한강변 대단지, 왕십리 환승권, 성수 업무·상권 프리미엄이 다르게 작동한다. “성동이 왜 비싼가?”를 생활권별 가격 논리로 분해한다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `mapo-apartment-price-2026` | 도심 접근성·공덕 환승축·아현 재개발축 | 서울 비강남권 대표 주거지 비교 |
| `songpa-apartment-price-2026` | 잠실·가락·문정 대단지축 | 강남권 대체/인접 고수요 지역 비교 |
| `yongsan-apartment-price-2026` | 한강변·국제업무지구 기대감 | 한강변·초고가 수요 비교 |
| `gangnam-apartment-price-2026` | 서울 최상위 가격 기준 | 시리즈가 쌓인 뒤 대표 콘텐츠로 확장 |
| `seongdong-apartment-price-2026` | 서울숲·옥수·금호·왕십리 단지별 실거래가 | 이번 구현 대상 |
| `seoul-flagship-apartment-top10-2026` | 서울 주요 구별 대표 단지 허브 | 마포·성동·송파 등 2~3개 이상 발행 후 구현 |

성동 리포트는 마포 다음 서울 시리즈 2번째 문서로 적합하다. 서울숲 초고가 단지가 검색을 끌고, 옥수·금호·왕십리 실거주 단지가 체류시간을 만든다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.sdap-page
    CalculatorHero
      - Hero: "성동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 서울특별시 성동구 행정구역 기준
      - 초고가 주상복합과 일반 아파트 직접 비교 주의
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.sdap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 서울숲권 단지 수
      - 옥수·금호권 단지 수

    section.sdap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.sdap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.sdap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.sdap-area-map
      - 서울숲·성수권
      - 옥수·금호권
      - 왕십리·행당권
      - 응봉·마장권
      - 한강변권

    section.sdap-chart
      - 현재 기준가 vs 5년 최저가 막대 비교
      - 평가차익순 / 상승률순 / 최근가순 정렬

    section.sdap-context
      - 성동 가격을 읽는 핵심 변수
      - 서울숲·한강변 프리미엄
      - 성수 업무·상권 확장
      - 옥수·금호 실거주 수요
      - 왕십리 환승 접근성

    section.sdap-data-method
      - 단지 선정 기준
      - 실거래가 기준
      - 84㎡ 우선 원칙
      - 초고가 주상복합 면적 비교 주의

    section.sdap-risk
      - 거래 건수 부족
      - 면적·동·층·향 차이
      - 주상복합과 일반 아파트 비교 주의
      - 성수 개발 기대감 과장 금지
      - 금리·대출 규제

    section.sdap-related
      - 마포·송파·용산·강남 예정 리포트 및 주택 구매력 계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/seongdongApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type SeongdongAreaGroup =
  | "서울숲·성수권"
  | "옥수·금호권"
  | "왕십리·행당권"
  | "응봉·마장권"
  | "한강변권";

export interface SeongdongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SeongdongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SeongdongAreaGroup;
  legalDongLabel:
    | "성수동1가"
    | "성수동2가"
    | "옥수동"
    | "금호동1가"
    | "금호동2가"
    | "금호동3가"
    | "금호동4가"
    | "행당동"
    | "응봉동"
    | "마장동"
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

export interface SeongdongAreaCard {
  areaGroup: SeongdongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SeongdongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SeongdongFaqItem {
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
| 1 | 아크로서울포레스트 | 서울숲·성수권 | 서울숲 초고가축 대표 후보, 일반 84㎡ 비교 가능 여부 확인 필요 |
| 2 | 트리마제 | 서울숲·성수권 | 성동 대표 고가 주상복합, 거래 면적과 세대 타입 주의 |
| 3 | 갤러리아포레 | 서울숲·성수권 | 서울숲 고가 주거축 비교 후보, 면적대 차이 주의 |
| 4 | 서울숲리버뷰자이 | 한강변권 | 성수·한강변 생활권 대표 후보 |
| 5 | 래미안 옥수 리버젠 | 옥수·금호권 | 옥수 한강변·역세권 실거주 수요 대표 후보 |
| 6 | e편한세상 옥수 파크힐스 | 옥수·금호권 | 옥수권 준신축·브랜드 선호 비교 후보 |
| 7 | 힐스테이트 서울숲 리버 | 금호·한강변권 | 금호·응봉 인접 한강변 후보, 공식 단지명 재확인 필요 |
| 8 | 서울숲 푸르지오 | 금호·응봉권 | 성동 한강변·응봉 생활권 비교 후보 |
| 9 | 왕십리 뉴타운 텐즈힐 | 왕십리·행당권 | 왕십리 환승 생활권 대단지 후보 |
| 10 | 행당 두산위브 또는 서울숲 더샵 계열 | 왕십리·행당권 | 왕십리·행당 실거주축 보완 후보, 실거래가 기준 재확인 필요 |

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
  - 서울숲·한강변·역 접근성 메모
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `acro-seoul-forest` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `성동은 안전하다` 표현 금지
- Hero와 카드 제목에서는 “얼마를 벌었을까?”를 사용할 수 있지만, 수치 라벨은 반드시 `평가차익(추정)`으로 표기

주의 문구:

```text
이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 반영하지 않은 단순 시세 차이입니다. 같은 단지라도 동·층·향·면적·거래 시점에 따라 실제 가격은 크게 달라질 수 있습니다.
```

### 6-3. Top10 비교표

컬럼:

| 컬럼 | 설명 |
|---|---|
| 순위 | 최신 기준가 또는 기획상 대표 순위 |
| 단지명 | 검색 친화적 단지명 |
| 법정동 | 성수동 / 옥수동 / 금호동 / 행당동 등 |
| 생활권 | 서울숲·성수권 / 옥수·금호권 / 왕십리·행당권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 주상복합 비교 주의 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

성동은 단지 가격대와 생활권 성격이 강하게 갈린다. 생활권 카드는 표 옆 또는 아래에 배치한다.

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 서울숲·성수권 | 서울숲, 성수 상권, 업무·문화 프리미엄, 초고가 주거축 | 주상복합·대형 면적 거래가 많아 84㎡ 비교 주의 |
| 옥수·금호권 | 한강변, 강남·도심 접근성, 실거주 선호 | 단지별 역 접근성·경사·동 위치 차이 큼 |
| 왕십리·행당권 | 환승 교통, 뉴타운 대단지, 생활 편의성 | 서울숲권 초고가 단지와 직접 비교 주의 |
| 응봉·마장권 | 성동 내 상대적 가격 접근성, 한강·중랑천 인접성 | 거래 건수와 단지별 연식 차이 확인 필요 |
| 한강변권 | 조망·강변 접근성·희소성 | 한강 조망을 가격 보장처럼 표현 금지 |

고정 주의 문구:

```text
성동구는 서울숲 초고가축과 옥수·금호 실거주축, 왕십리 환승 생활권의 가격 논리가 다릅니다. 같은 성동구 안에서도 주상복합 여부, 면적대, 입주연식, 한강 조망, 역 접근성에 따라 가격 차이가 크게 나타날 수 있습니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 그래프 또는 단순 카드형 그래프로 충분하다. 서울 지역 리포트가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익(추정)
- 생활권

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 법정동과 공식 단지명
- 주상복합·대형 면적 단지는 84㎡ 직접 비교 가능 여부 확인
- 한강변·서울숲·성수 개발 기대감은 단정 대신 접근성·생활권 메모로 표현
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
성동 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
성동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
아크로서울포레스트, 트리마제, 갤러리아포레, 래미안 옥수 리버젠 등 성동구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 서울숲·성수·옥수·금호·왕십리 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 성동 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 서울숲·성수·옥수·금호·왕십리 생활권 가격 차이
- 성동 아파트가 비싼 이유
- 성동 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const SDAP_FAQ: SeongdongFaqItem[] = [
  {
    question: "성동 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "성동 아파트는 왜 비싼가요?",
    answer:
      "서울숲과 한강변 희소성, 성수 상권과 업무지구 확장성, 옥수·금호의 강남·도심 접근성, 왕십리 환승 교통이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "트리마제와 일반 아파트를 같이 비교해도 되나요?",
    answer:
      "직접 비교에는 주의가 필요합니다. 트리마제, 갤러리아포레, 아크로서울포레스트 같은 단지는 주상복합·대형 면적 거래가 많을 수 있어 면적과 세대 타입을 반드시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "서울숲권과 옥수·금호권은 가격을 같이 봐도 되나요?",
    answer:
      "둘 다 성동구에 속하지만 가격 논리는 다릅니다. 서울숲권은 초고가·희소성·성수 상권 수요가 강하고, 옥수·금호권은 한강변과 강남·도심 접근성, 실거주 선호가 중요합니다.",
  },
  {
    question: "한강 조망이 있으면 무조건 비싼가요?",
    answer:
      "한강 조망과 접근성은 가격에 영향을 줄 수 있지만 가격을 보장하지 않습니다. 실제 가격은 동·층·향·면적, 거래 시점, 단지 상태에 따라 달라집니다.",
  },
  {
    question: "지금 성동 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const SDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포 대장 아파트 Top10",
    description: "공덕·아현·대흥·상암 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/yongsan-apartment-price-2026/",
    label: "용산 대장 아파트 Top10",
    description: "한강변·국제업무지구 기대감과 실거래가 변화를 구분해서 봅니다.",
  },
  {
    href: "/reports/seoul-flagship-apartment-top10-2026/",
    label: "서울 대장 아파트 Top10 허브",
    description: "서울 주요 구별 대표 단지를 한눈에 비교하는 허브 페이지입니다.",
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
src/data/seongdongApartmentPrice2026.ts
src/pages/reports/seongdong-apartment-price-2026.astro
public/scripts/seongdong-apartment-price-2026.js
src/styles/scss/pages/_seongdong-apartment-price-2026.scss
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
  SDAP_META,
  SDAP_APARTMENTS,
  SDAP_AREA_CARDS,
  SDAP_CONTEXT,
  SDAP_FAQ,
  SDAP_RELATED_LINKS,
  SDAP_SEO_INTRO,
  SDAP_SEO_CRITERIA,
} from "../../data/seongdongApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SDAP_META.title,
    description: SDAP_META.description,
    dateModified: SDAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SDAP_FAQ.map((item) => ({
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

<BaseLayout title={SDAP_META.seoTitle} description={SDAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sdap-page" data-report="seongdong-apartment-price-2026">
    <CalculatorHero
      eyebrow="성동 실거래가 리포트"
      title="성동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={SDAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        SDAP_META.notice,
        "이 리포트는 서울특별시 성동구 행정구역을 기준으로 하며, 생활권은 서울숲·성수·옥수·금호·왕십리 등으로 나눠 표시합니다.",
        "초고가 주상복합과 일반 아파트는 면적·세대 타입·거래 건수 차이가 커 직접 비교에 주의해야 합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="성동 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={SDAP_SEO_INTRO}
      criteria={SDAP_SEO_CRITERIA}
      faq={SDAP_FAQ}
      related={SDAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/seongdong-apartment-price-2026.js`

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

DOM 데이터 전달:

```astro
<script type="application/json" id="sdap-data">
  {JSON.stringify(SDAP_APARTMENTS)}
</script>
<script type="application/json" id="sdap-area-data">
  {JSON.stringify(SDAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/seongdong-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `SDAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_seongdong-apartment-price-2026.scss`

prefix: `sdap-`

```scss
.sdap-page {
  --sdap-ink: #172033;
  --sdap-muted: #667085;
  --sdap-line: #d8e0ea;
  --sdap-soft: #f6f8fb;
  --sdap-blue: #2563eb;
  --sdap-green: #138a5b;
  --sdap-teal: #0f766e;
  --sdap-amber: #b7791f;
  --sdap-red: #c2410c;
}
```

주요 클래스:

```text
sdap-summary-grid
sdap-summary-card
sdap-tabs
sdap-tab
sdap-profit-card
sdap-profit-card__main
sdap-profit-card__meta
sdap-area-badge
sdap-area-grid
sdap-area-card
sdap-table-wrap
sdap-table
sdap-sort-controls
sdap-bar-list
sdap-bar-row
sdap-context-grid
sdap-context-card
sdap-risk-list
sdap-related-grid
sdap-related-card
```

반응형:

- 920px 이하: KPI·맥락·생활권 카드 2열
- 640px 이하: 카드 1열, 탭 가로 스크롤
- 표는 `overflow-x: auto` 허용, 최소 너비 860px
- 생활권 배지는 모바일에서 줄바꿈 허용
- 평가차익 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 단지 비교 페이지이므로 장식보다 표·숫자·주의 문구 가독성 우선
- 파란색·초록색·청록색 계열만 과도하게 쓰지 않고, 경고·추정 배지는 별도 색상으로 구분
- 평가차익 수치는 강조하되 `추정` 배지를 함께 노출
- 서울숲·한강변·성수 개발 기대감은 장점으로 설명하되 가격 보장처럼 표현하지 않는다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `성동은 안전하다`
- `강남보다 낫다`
- `서울숲이면 무조건 프리미엄`
- `한강 조망이면 가격이 보장된다`
- `성수 개발로 무조건 오른다`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `서울특별시 성동구 기준`
- `생활권별 가격 논리가 다름`
- `주상복합과 일반 아파트 직접 비교 주의`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 성동구 기준과 생활권 분류 기준이 노출되는가?
- [ ] 주상복합·대형 면적 거래를 일반 84㎡ 아파트처럼 단순 비교하지 않는가?
- [ ] 서울숲·한강변·성수 개발 기대감을 가격 보장처럼 표현하지 않는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·생활권 상태·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체가 무너지지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함되었는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료되었는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 84㎡ 기준가 확정
2. 단지별 법정동·공식 단지명·생활권 분류·역 접근성 재검증
3. 주상복합 단지의 면적대와 일반 아파트 비교 가능 여부 확인
4. `src/data/seongdongApartmentPrice2026.ts` 생성
5. 리포트 Astro 페이지 생성
6. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
7. SCSS 작성
8. `reports.ts`, `app.scss`, `sitemap.xml` 등록
9. `npm run build`
10. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 마포·성동 리포트 발행 후 송파 대장 아파트 Top10 설계로 확장
- 서울숲·용산·한강변 고가 단지 비교 리포트 별도 기획 가능
- 서울 지역 리포트 2~3개 이상 발행 후 `seoul-flagship-apartment-top10-2026` 허브 구현
- 허브에서는 구별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
