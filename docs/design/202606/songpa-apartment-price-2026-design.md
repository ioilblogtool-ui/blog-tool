# 송파 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 송파는 `잠실 초고가 대단지`, `올림픽공원·방이 생활권`, `가락·문정 신축 대단지`, `재건축 기대 단지`가 함께 검색되는 서울 핵심 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `송파 대장 아파트 Top10 2026`
- 추천 slug: `songpa-apartment-price-2026`
- URL: `/reports/songpa-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `송파 아파트 실거래가`, `송파 대장 아파트`, `잠실 아파트 시세`, `헬리오시티 실거래가`
- 2차 검색 의도: `잠실엘스 실거래가`, `리센츠 실거래가`, `잠실 트리지움 실거래가`, `파크리오 실거래가`, `올림픽선수촌 아파트 실거래가`
- 핵심 출력: 송파구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 잠실·신천·방이·가락·문정 생활권 해석, 재건축 기대감 주의, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “송파=잠실”로 단순화하지 않고, 잠실 대단지·올림픽공원권·헬리오시티·문정 업무지구 인접 단지를 생활권별로 분해한다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `mapo-apartment-price-2026` | 도심 접근성·공덕 환승축·아현 재개발축 | 서울 비강남권 대표 주거지 비교 |
| `seongdong-apartment-price-2026` | 서울숲·옥수·금호·왕십리 생활권 | 한강변·초고가축 비교 |
| `yongsan-apartment-price-2026` | 한강변·국제업무지구 기대감 | 고가·개발 기대감 표현 기준 공유 |
| `gangnam-apartment-price-2026` | 서울 최상위 가격 기준 | 시리즈가 쌓인 뒤 대표 콘텐츠로 확장 |
| `songpa-apartment-price-2026` | 잠실·방이·가락·문정 단지별 실거래가 | 이번 구현 대상 |
| `seoul-flagship-apartment-top10-2026` | 서울 주요 구별 대표 단지 허브 | 마포·성동·송파 등 2~3개 이상 발행 후 구현 |

송파 리포트는 서울 시리즈에서 검색량이 강한 축이다. 경쟁 키워드가 강하므로 “잠실 대장 아파트”만 노리기보다 `송파 아파트 실거래가`, `헬리오시티`, `올림픽선수촌`, `잠실엘스` 등 롱테일을 함께 가져간다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.spap-page
    CalculatorHero
      - Hero: "송파 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 서울특별시 송파구 행정구역 기준
      - 재건축 기대감과 현재 실거래가는 분리해서 해석
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.spap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 잠실권 단지 수
      - 가락·문정권 단지 수

    section.spap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.spap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.spap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.spap-area-map
      - 잠실·신천권
      - 올림픽공원·방이권
      - 가락·헬리오시티권
      - 문정·장지권
      - 재건축 기대권

    section.spap-chart
      - 현재 기준가 vs 5년 최저가 막대 비교
      - 평가차익순 / 상승률순 / 최근가순 정렬

    section.spap-context
      - 송파 가격을 읽는 핵심 변수
      - 잠실 대단지·학군·상권
      - 올림픽공원·한강 접근성
      - 헬리오시티 대단지 구조
      - 문정 업무지구·위례·동남권 접근성
      - 재건축 기대감과 현재 가격 분리

    section.spap-data-method
      - 단지 선정 기준
      - 실거래가 기준
      - 84㎡ 우선 원칙
      - 재건축 단지 면적·거래 특성 표시

    section.spap-risk
      - 거래 건수 부족
      - 면적·동·층·향 차이
      - 재건축 기대감 과장 금지
      - 잠실권과 가락·문정권 직접 비교 주의
      - 금리·대출 규제

    section.spap-related
      - 마포·성동·용산·강남 예정 리포트 및 주택 구매력 계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/songpaApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type SongpaAreaGroup =
  | "잠실·신천권"
  | "올림픽공원·방이권"
  | "가락·헬리오시티권"
  | "문정·장지권"
  | "재건축 기대권";

export interface SongpaApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SongpaApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SongpaAreaGroup;
  legalDongLabel:
    | "잠실동"
    | "신천동"
    | "방이동"
    | "가락동"
    | "문정동"
    | "장지동"
    | "오금동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  parkNote?: string;
  redevelopmentNote?: string;
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

export interface SongpaAreaCard {
  areaGroup: SongpaAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SongpaContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SongpaFaqItem {
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
| 1 | 잠실엘스 | 잠실·신천권 | 잠실 대표 대단지, 검색 수요와 거래 데이터가 강한 핵심 후보 |
| 2 | 리센츠 | 잠실·신천권 | 잠실 대단지 비교에서 빠지기 어려운 대표 후보 |
| 3 | 잠실 트리지움 | 잠실·신천권 | 잠실역·학군·상권 접근성을 함께 보는 후보 |
| 4 | 파크리오 | 올림픽공원·방이권 | 올림픽공원·한강 접근성, 대단지 실거주 수요 후보 |
| 5 | 헬리오시티 | 가락·헬리오시티권 | 전국급 대단지, 송파 롱테일 검색 수요 강함 |
| 6 | 올림픽선수기자촌 | 올림픽공원·방이권 | 재건축 기대감과 대지지분 이슈가 있는 대표 후보 |
| 7 | 잠실주공5단지 | 재건축 기대권 | 재건축 기대감 대표 후보, 현재 실거래와 기대감 분리 필수 |
| 8 | 아시아선수촌 | 잠실·신천권 | 잠실 고가 구축·재건축 기대 후보, 거래 면적 주의 |
| 9 | 잠실 레이크팰리스 | 잠실·신천권 | 잠실권 대단지 보완 후보 |
| 10 | 문정 래미안 또는 문정·장지권 대표 단지 | 문정·장지권 | 문정 업무지구·동남권 생활권 보완 후보, 실거래가 기준 재확인 필요 |

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
  - 잠실·올림픽공원·문정 접근 메모
  - 재건축 기대 여부
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `jamsil-els` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `송파는 안전하다` 표현 금지
- 재건축 단지는 `재건축 기대감 반영 가능성` 정도로만 표현하고 분담금·입주시점·사업성 확정 표현 금지
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
| 법정동 | 잠실동 / 신천동 / 방이동 / 가락동 / 문정동 등 |
| 생활권 | 잠실·신천권 / 올림픽공원·방이권 / 가락·헬리오시티권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 재건축 기대감 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

송파는 잠실권과 가락·문정권의 가격 논리가 다르다. 생활권 카드는 표 옆 또는 아래에 배치한다.

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 잠실·신천권 | 잠실 대단지, 학군·상권·교통·한강 접근성 | 잠실권 가격을 송파 전체 평균처럼 해석 금지 |
| 올림픽공원·방이권 | 올림픽공원, 한강·잠실 접근성, 구축 재건축 기대 | 재건축 기대감과 현재 실거래가를 분리 |
| 가락·헬리오시티권 | 대단지 규모, 가락시장·수서·강남 접근성, 실거주 수요 | 세대 수가 많아 거래가 다양하게 분포 |
| 문정·장지권 | 문정 업무지구, 위례·동남권 접근성 | 잠실 대장 단지와 직접 비교 주의 |
| 재건축 기대권 | 대지지분·사업성 기대가 가격에 반영될 수 있음 | 분담금·사업 속도·입주시점 확정 표현 금지 |

고정 주의 문구:

```text
송파구는 잠실 대단지와 헬리오시티, 올림픽공원권 구축, 문정 업무지구 인접 단지의 가격 논리가 다릅니다. 같은 송파구 안에서도 생활권, 입주연식, 재건축 기대감, 면적, 거래 시점에 따라 가격 차이가 크게 나타날 수 있습니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 그래프 또는 단순 카드형 그래프로 충분하다. 서울 지역 리포트가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익(추정)
- 생활권
- 재건축 기대 여부

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 법정동과 공식 단지명
- 재건축 단지의 경우 현재 사업 단계, 거래 면적, 대지지분 표현 주의
- 잠실권 고가 단지를 송파 전체 대표값처럼 보이게 하지 않도록 생활권 표시
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
송파 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
송파 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
잠실엘스, 리센츠, 트리지움, 파크리오, 헬리오시티 등 송파구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 잠실·올림픽공원·가락·문정 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 송파 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 잠실·올림픽공원·가락·문정 생활권 가격 차이
- 송파 아파트가 비싼 이유
- 재건축 기대 단지는 어떻게 봐야 할까?
- 송파 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const SPAP_FAQ: SongpaFaqItem[] = [
  {
    question: "송파 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "송파 아파트는 왜 비싼가요?",
    answer:
      "잠실 대단지와 학군·상권·교통, 올림픽공원과 한강 접근성, 헬리오시티 같은 대단지 실거주 수요, 일부 재건축 기대감이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "잠실엘스와 헬리오시티를 같이 비교해도 되나요?",
    answer:
      "같은 송파구에 있지만 가격 논리가 다릅니다. 잠실엘스는 잠실권 입지와 학군·상권 수요가 강하고, 헬리오시티는 대단지 규모와 가락·수서·강남 접근성을 함께 봐야 합니다.",
  },
  {
    question: "재건축 기대 단지는 가격을 어떻게 봐야 하나요?",
    answer:
      "재건축 기대감은 가격에 반영될 수 있지만 사업 속도, 분담금, 규제, 금리, 조합 상황에 따라 달라집니다. 현재 실거래가와 미래 기대감을 분리해서 봐야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 송파 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const SPAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·옥수·금호·왕십리 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포 대장 아파트 Top10",
    description: "공덕·아현·대흥·상암 생활권 주요 단지의 가격 변화를 비교합니다.",
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
src/data/songpaApartmentPrice2026.ts
src/pages/reports/songpa-apartment-price-2026.astro
public/scripts/songpa-apartment-price-2026.js
src/styles/scss/pages/_songpa-apartment-price-2026.scss
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
  SPAP_META,
  SPAP_APARTMENTS,
  SPAP_AREA_CARDS,
  SPAP_CONTEXT,
  SPAP_FAQ,
  SPAP_RELATED_LINKS,
  SPAP_SEO_INTRO,
  SPAP_SEO_CRITERIA,
} from "../../data/songpaApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SPAP_META.title,
    description: SPAP_META.description,
    dateModified: SPAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SPAP_FAQ.map((item) => ({
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

<BaseLayout title={SPAP_META.seoTitle} description={SPAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page spap-page" data-report="songpa-apartment-price-2026">
    <CalculatorHero
      eyebrow="송파 실거래가 리포트"
      title="송파 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={SPAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        SPAP_META.notice,
        "이 리포트는 서울특별시 송파구 행정구역을 기준으로 하며, 생활권은 잠실·올림픽공원·가락·문정 등으로 나눠 표시합니다.",
        "재건축 기대감은 현재 실거래가와 분리해서 해석해야 하며, 사업 속도·분담금·입주시점은 확정값처럼 표시하지 않습니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="송파 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={SPAP_SEO_INTRO}
      criteria={SPAP_SEO_CRITERIA}
      faq={SPAP_FAQ}
      related={SPAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/songpa-apartment-price-2026.js`

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
<script type="application/json" id="spap-data">
  {JSON.stringify(SPAP_APARTMENTS)}
</script>
<script type="application/json" id="spap-area-data">
  {JSON.stringify(SPAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/songpa-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `SPAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_songpa-apartment-price-2026.scss`

prefix: `spap-`

```scss
.spap-page {
  --spap-ink: #172033;
  --spap-muted: #667085;
  --spap-line: #d8e0ea;
  --spap-soft: #f6f8fb;
  --spap-blue: #2563eb;
  --spap-green: #138a5b;
  --spap-teal: #0f766e;
  --spap-amber: #b7791f;
  --spap-red: #c2410c;
}
```

주요 클래스:

```text
spap-summary-grid
spap-summary-card
spap-tabs
spap-tab
spap-profit-card
spap-profit-card__main
spap-profit-card__meta
spap-area-badge
spap-area-grid
spap-area-card
spap-table-wrap
spap-table
spap-sort-controls
spap-bar-list
spap-bar-row
spap-context-grid
spap-context-card
spap-risk-list
spap-related-grid
spap-related-card
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
- 잠실·올림픽공원·재건축 기대감은 장점으로 설명하되 가격 보장처럼 표현하지 않는다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `송파는 안전하다`
- `강남보다 낫다`
- `잠실이면 무조건 프리미엄`
- `재건축되면 무조건 오른다`
- `헬리오시티는 안전자산`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `서울특별시 송파구 기준`
- `생활권별 가격 논리가 다름`
- `재건축 기대감과 현재 실거래가 분리`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 송파구 기준과 생활권 분류 기준이 노출되는가?
- [ ] 잠실권 가격을 송파 전체 평균처럼 표현하지 않는가?
- [ ] 재건축 기대감, 분담금, 입주시점을 확정 표현하지 않는가?
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
3. 재건축 단지의 사업 단계와 현재 실거래가 표현 분리
4. `src/data/songpaApartmentPrice2026.ts` 생성
5. 리포트 Astro 페이지 생성
6. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
7. SCSS 작성
8. `reports.ts`, `app.scss`, `sitemap.xml` 등록
9. `npm run build`
10. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 마포·성동·송파 리포트 발행 후 서울 허브 구현 조건 충족
- 용산 대장 아파트 Top10 설계로 한강변·개발 기대감 축 확장
- 강남 대장 아파트 Top10은 시리즈가 충분히 쌓인 뒤 대표 콘텐츠로 구현
- 허브에서는 구별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
