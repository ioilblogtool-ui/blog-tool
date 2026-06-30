# 용산 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 용산은 `한남 초고가 주거축`, `이촌 한강변축`, `용산역·국제업무지구 기대감`, `도심·강남·여의도 접근성`이 함께 작동하는 서울 최상위 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `용산 대장 아파트 Top10 2026`
- 추천 slug: `yongsan-apartment-price-2026`
- URL: `/reports/yongsan-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `용산 아파트 실거래가`, `용산 대장 아파트`, `한남동 아파트 시세`, `이촌동 아파트 실거래가`
- 2차 검색 의도: `한남더힐 실거래가`, `나인원한남 실거래가`, `래미안첼리투스 실거래가`, `용산센트럴파크 해링턴스퀘어 실거래가`, `한가람아파트 실거래가`
- 핵심 출력: 용산구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 한남·이촌·용산역·서빙고·원효로 생활권 해석, 개발 기대감 주의, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: 용산은 고가 단지·대형 면적·개발 기대감이 섞여 있어 일반적인 84㎡ 비교가 어려울 수 있다. “초고가 거래”와 “실거주형 아파트 비교”를 분리해서 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `mapo-apartment-price-2026` | 도심 접근성·공덕 환승축·아현 재개발축 | 도심 접근성형 주거지 비교 |
| `seongdong-apartment-price-2026` | 서울숲·옥수·금호·왕십리 생활권 | 한강변·초고가축 비교 |
| `songpa-apartment-price-2026` | 잠실·방이·가락·문정 대단지축 | 서울 고가 주거지 비교 |
| `gangnam-apartment-price-2026` | 서울 최상위 가격 기준 | 시리즈가 쌓인 뒤 대표 콘텐츠로 확장 |
| `yongsan-apartment-price-2026` | 한남·이촌·용산역 생활권 실거래가 | 이번 구현 대상 |
| `seoul-flagship-apartment-top10-2026` | 서울 주요 구별 대표 단지 허브 | 서울 지역 리포트 2~3개 이상 발행 후 구현 |

용산 리포트는 서울 시리즈 중 고단가·고관심 콘텐츠다. 다만 개발 기대감과 초고가 단지 면적 차이가 크므로, 다른 지역보다 데이터 주의 문구와 금지 표현을 더 강하게 둔다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.ysap-page
    CalculatorHero
      - Hero: "용산 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 서울특별시 용산구 행정구역 기준
      - 초고가·대형 면적 단지는 84㎡ 직접 비교가 어려울 수 있음
      - 개발 기대감과 현재 실거래가는 분리해서 해석
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.ysap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 한남권 단지 수
      - 이촌·한강변권 단지 수

    section.ysap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.ysap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.ysap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.ysap-area-map
      - 한남·보광권
      - 이촌·서빙고권
      - 용산역·한강로권
      - 원효로·도원권
      - 후암·청파권

    section.ysap-chart
      - 현재 기준가 vs 5년 최저가 막대 비교
      - 평가차익순 / 상승률순 / 최근가순 정렬

    section.ysap-context
      - 용산 가격을 읽는 핵심 변수
      - 한남 초고가 주거축
      - 이촌 한강변 실거주 수요
      - 용산역·국제업무지구 기대감
      - 도심·강남·여의도 접근성
      - 대형 면적 거래와 일반 면적 비교 주의

    section.ysap-data-method
      - 단지 선정 기준
      - 실거래가 기준
      - 84㎡ 우선 원칙
      - 초고가·대형 면적 단지 별도 표기

    section.ysap-risk
      - 거래 건수 부족
      - 면적·동·층·향 차이
      - 개발 기대감 과장 금지
      - 초고가 거래와 일반 아파트 직접 비교 주의
      - 금리·대출 규제

    section.ysap-related
      - 마포·성동·송파·강남 예정 리포트 및 주택 구매력 계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/yongsanApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type YongsanAreaGroup =
  | "한남·보광권"
  | "이촌·서빙고권"
  | "용산역·한강로권"
  | "원효로·도원권"
  | "후암·청파권"
  | "초고가 대형면적권";

export interface YongsanApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface YongsanApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: YongsanAreaGroup;
  legalDongLabel:
    | "한남동"
    | "이촌동"
    | "서빙고동"
    | "한강로동"
    | "원효로"
    | "도원동"
    | "후암동"
    | "청파동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  riverNote?: string;
  developmentNote?: string;
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

export interface YongsanAreaCard {
  areaGroup: YongsanAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface YongsanContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface YongsanFaqItem {
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
| 1 | 한남더힐 | 한남·보광권 | 용산 초고가 주거축 대표 후보, 대형 면적 거래 주의 |
| 2 | 나인원한남 | 한남·보광권 | 한남동 고가 주거 대표 후보, 거래 면적과 세대 타입 확인 필요 |
| 3 | 한남더힐 인접 고가 단지 후보 | 초고가 대형면적권 | 구현 직전 공식 단지명·거래 데이터 재확인 |
| 4 | 래미안첼리투스 | 이촌·서빙고권 | 이촌 한강변 대표 후보, 한강 조망·면적 차이 주의 |
| 5 | 한가람아파트 | 이촌·서빙고권 | 이촌 실거주·재건축 기대를 함께 보는 후보 |
| 6 | 이촌코오롱 또는 이촌동 주요 단지 | 이촌·서빙고권 | 이촌 생활권 보완 후보, 실거래가 기준 재확인 |
| 7 | 용산센트럴파크 해링턴스퀘어 | 용산역·한강로권 | 용산역·국제업무지구 기대감 관련 후보 |
| 8 | 용산파크타워 | 용산역·한강로권 | 용산역·한강로 생활권 대표 후보 |
| 9 | 도원삼성래미안 | 원효로·도원권 | 용산 내 실거주형 대단지 비교 후보 |
| 10 | 후암·청파권 대표 단지 | 후암·청파권 | 도심 접근성 보완 후보, 거래 데이터 재확인 필요 |

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
  - 한강변·용산역·개발 기대감 메모
  - 대형 면적 여부
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `hannam-the-hill` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `용산은 안전하다` 표현 금지
- 개발 기대감은 `가격에 반영될 수 있음` 수준으로만 표현하고 사업 일정·수혜 금액 확정 표현 금지
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
| 법정동 | 한남동 / 이촌동 / 서빙고동 / 한강로동 등 |
| 생활권 | 한남·보광권 / 이촌·서빙고권 / 용산역·한강로권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 개발 기대감, 대형 면적 여부 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

용산은 초고가 단지와 실거주형 단지를 같은 기준으로 섞으면 오해가 커진다. 생활권 카드는 표 옆 또는 아래에 배치한다.

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 한남·보광권 | 초고가 주거지, 대형 면적, 한강·남산 접근성, 희소성 | 84㎡ 거래가 적거나 직접 비교가 어려울 수 있음 |
| 이촌·서빙고권 | 한강변 실거주 수요, 전통 선호지, 재건축 기대 | 구축·재건축 기대감과 현재 실거래가 분리 |
| 용산역·한강로권 | 용산역, 업무지구 기대감, 교통 접근성 | 개발 일정·수혜 금액 확정 표현 금지 |
| 원효로·도원권 | 용산 내 상대적 실거주 접근성, 도심·여의도 이동 | 한남 초고가 단지와 직접 비교 주의 |
| 후암·청파권 | 서울역·도심 접근성, 구도심 주거지 | 단지 규모와 거래 건수 확인 필요 |

고정 주의 문구:

```text
용산구는 한남 초고가 주거축과 이촌 한강변 실거주축, 용산역·한강로 개발 기대축의 가격 논리가 다릅니다. 같은 용산구 안에서도 면적대, 단지 유형, 거래 건수, 개발 기대감에 따라 가격 차이가 크게 나타날 수 있습니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 그래프 또는 단순 카드형 그래프로 충분하다. 서울 지역 리포트가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

차트 항목:

- 현재 기준가
- 최근 5년 최저가
- 평가차익(추정)
- 생활권
- 대형 면적 여부

모바일에서는 막대 차트 대신 단지별 미니 카드 리스트로 전환한다.

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 최근 3개월 매매 실거래가
- 84㎡ 거래가 있으면 84㎡ 우선, 없으면 유사 면적 또는 대표 면적을 별도 표기
- 동일 단지 기준 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 법정동과 공식 단지명
- 초고가·대형 면적 단지는 일반 84㎡ 아파트와 직접 비교하지 않도록 주의
- 용산국제업무지구 등 개발 기대감은 현재 실거래가와 분리
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
용산 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
용산 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
한남더힐, 나인원한남, 래미안첼리투스, 용산센트럴파크 해링턴스퀘어 등 용산구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 한남·이촌·용산역 생활권 차이와 개발 기대감 주의 기준을 함께 확인하세요.
```

### H2 후보

- 용산 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 한남·이촌·용산역 생활권 가격 차이
- 용산 아파트가 비싼 이유
- 개발 기대감은 실거래가와 어떻게 분리해서 봐야 할까?
- 용산 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const YSAP_FAQ: YongsanFaqItem[] = [
  {
    question: "용산 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "용산 아파트는 왜 비싼가요?",
    answer:
      "한남 초고가 주거지의 희소성, 이촌 한강변 실거주 수요, 용산역과 도심·강남·여의도 접근성, 국제업무지구 기대감이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "한남더힐과 일반 아파트를 같이 비교해도 되나요?",
    answer:
      "직접 비교에는 주의가 필요합니다. 한남더힐, 나인원한남 같은 단지는 대형 면적과 초고가 거래가 많을 수 있어 84㎡ 일반 아파트와 같은 기준으로 단순 비교하면 오해가 생길 수 있습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적 또는 대표 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "용산 개발 기대감은 가격에 얼마나 반영되나요?",
    answer:
      "개발 기대감은 일부 가격에 반영될 수 있지만 사업 일정, 인허가, 금리, 규제, 시장 상황에 따라 달라집니다. 이 리포트에서는 현재 실거래가와 미래 기대감을 분리해서 설명합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 용산 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const YSAP_RELATED_LINKS: RelatedLink[] = [
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
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
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
src/data/yongsanApartmentPrice2026.ts
src/pages/reports/yongsan-apartment-price-2026.astro
public/scripts/yongsan-apartment-price-2026.js
src/styles/scss/pages/_yongsan-apartment-price-2026.scss
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
  YSAP_META,
  YSAP_APARTMENTS,
  YSAP_AREA_CARDS,
  YSAP_CONTEXT,
  YSAP_FAQ,
  YSAP_RELATED_LINKS,
  YSAP_SEO_INTRO,
  YSAP_SEO_CRITERIA,
} from "../../data/yongsanApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: YSAP_META.title,
    description: YSAP_META.description,
    dateModified: YSAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: YSAP_FAQ.map((item) => ({
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

<BaseLayout title={YSAP_META.seoTitle} description={YSAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page ysap-page" data-report="yongsan-apartment-price-2026">
    <CalculatorHero
      eyebrow="용산 실거래가 리포트"
      title="용산 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={YSAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        YSAP_META.notice,
        "이 리포트는 서울특별시 용산구 행정구역을 기준으로 하며, 생활권은 한남·이촌·용산역·원효로 등으로 나눠 표시합니다.",
        "초고가·대형 면적 단지는 84㎡ 일반 아파트와 직접 비교가 어려울 수 있어 면적을 별도 표시합니다.",
        "개발 기대감은 현재 실거래가와 분리해서 해석해야 하며, 사업 일정·수혜 금액은 확정값처럼 표시하지 않습니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="용산 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={YSAP_SEO_INTRO}
      criteria={YSAP_SEO_CRITERIA}
      faq={YSAP_FAQ}
      related={YSAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/yongsan-apartment-price-2026.js`

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
<script type="application/json" id="ysap-data">
  {JSON.stringify(YSAP_APARTMENTS)}
</script>
<script type="application/json" id="ysap-area-data">
  {JSON.stringify(YSAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/yongsan-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `YSAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_yongsan-apartment-price-2026.scss`

prefix: `ysap-`

```scss
.ysap-page {
  --ysap-ink: #172033;
  --ysap-muted: #667085;
  --ysap-line: #d8e0ea;
  --ysap-soft: #f6f8fb;
  --ysap-blue: #2563eb;
  --ysap-green: #138a5b;
  --ysap-teal: #0f766e;
  --ysap-amber: #b7791f;
  --ysap-red: #c2410c;
}
```

주요 클래스:

```text
ysap-summary-grid
ysap-summary-card
ysap-tabs
ysap-tab
ysap-profit-card
ysap-profit-card__main
ysap-profit-card__meta
ysap-area-badge
ysap-area-grid
ysap-area-card
ysap-table-wrap
ysap-table
ysap-sort-controls
ysap-bar-list
ysap-bar-row
ysap-context-grid
ysap-context-card
ysap-risk-list
ysap-related-grid
ysap-related-card
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
- 한남 초고가·한강변·국제업무지구 기대감은 장점으로 설명하되 가격 보장처럼 표현하지 않는다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `용산은 안전하다`
- `강남보다 낫다`
- `국제업무지구 때문에 무조건 오른다`
- `한강변이면 가격이 보장된다`
- `한남동이면 무조건 프리미엄`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `서울특별시 용산구 기준`
- `생활권별 가격 논리가 다름`
- `개발 기대감과 현재 실거래가 분리`
- `초고가·대형 면적 단지 직접 비교 주의`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 용산구 기준과 생활권 분류 기준이 노출되는가?
- [ ] 초고가·대형 면적 거래를 일반 84㎡ 아파트처럼 단순 비교하지 않는가?
- [ ] 개발 기대감, 사업 일정, 수혜 금액을 확정 표현하지 않는가?
- [ ] 단지 탭 클릭 시 카드·표 강조·생활권 상태·URL 파라미터가 함께 갱신되는가?
- [ ] 정렬 옵션이 모바일에서도 깨지지 않는가?
- [ ] 375px 모바일에서 가로 overflow만 발생하고 레이아웃 전체가 무너지지 않는가?
- [ ] FAQ 6개 이상, SeoContent 5문단 이상 포함되었는가?
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료되었는가?
- [ ] `npm run build`가 성공하는가?

---

## 17. 구현 순서

1. 구현 직전 실거래가 리서치로 Top10 단지와 기준가 확정
2. 단지별 법정동·공식 단지명·생활권 분류·역 접근성 재검증
3. 초고가·대형 면적 단지의 비교 가능 면적과 대표 면적 확인
4. 개발 기대감 관련 문구를 현재 실거래가와 분리
5. `src/data/yongsanApartmentPrice2026.ts` 생성
6. 리포트 Astro 페이지 생성
7. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
8. SCSS 작성
9. `reports.ts`, `app.scss`, `sitemap.xml` 등록
10. `npm run build`
11. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 마포·성동·송파·용산 리포트 발행 후 서울 허브 구현 우선순위 상승
- 강남 대장 아파트 Top10은 서울 시리즈 대표 콘텐츠로 별도 설계
- 한남·이촌·성수·반포를 묶은 한강변 초고가 아파트 비교 리포트 별도 기획 가능
- 허브에서는 구별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
