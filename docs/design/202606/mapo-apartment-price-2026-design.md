# 마포 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 마포는 강남권 대체지가 아니라 `도심 접근성`, `여의도·광화문·용산 이동`, `공덕·아현 재개발축`, `한강변·상암 업무지구 접근성`으로 읽어야 하는 서울 핵심 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `마포 대장 아파트 Top10 2026`
- 추천 slug: `mapo-apartment-price-2026`
- URL: `/reports/mapo-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `마포 아파트 실거래가`, `마포 대장 아파트`, `마포래미안푸르지오 실거래가`, `공덕 아파트 시세`
- 2차 검색 의도: `공덕자이 실거래가`, `마포프레스티지자이 실거래가`, `신촌그랑자이 실거래가`, `마포더클래시 실거래가`, `상암 월드컵파크 아파트 시세`
- 핵심 출력: 마포구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 아현·공덕·대흥·상암·합정 생활권 해석, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “강남이 아닌데 왜 비싼가?”를 도심 접근성과 업무지구 접근성으로 풀고, 신축·준신축·한강변·재개발축을 생활권별로 비교한다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `dongtan-apartment-price-2026` | 경기 남부 신축 대단지·GTX-A 축 | 수도권 신축 가격 변화 비교 |
| `bundang-apartment-price-2026` | 분당 구축·재건축 기대·상급지 수요 | 서울 외 핵심 주거지 비교 |
| `gwanggyo-apartment-price-2026` | 광교 생활권·호수공원·신분당선 | 경기도 고가 주거지 비교 |
| `suji-apartment-price-2026` | 수지 신분당선·실거주 수요 | 서울 접근성형 주거지 비교 |
| `suwon-yeongtong-apartment-price-2026` | 영통·망포·광교 인접 생활권 | 경기 남부 업무지구형 수요 비교 |
| `mapo-apartment-price-2026` | 마포구 단지별 실거래가·도심 접근성 프리미엄 | 이번 구현 대상 |
| `seoul-flagship-apartment-top10-2026` | 서울 주요 구별 대표 단지 허브 | 마포·성동·송파 등 2~3개 이상 발행 후 구현 |

이번 리포트는 서울 지역 시리즈의 첫 타자로 적합하다. 마포는 강남·송파보다 경쟁이 다소 낮으면서도 검색 수요가 있고, 도심 접근성이라는 설명 축이 뚜렷하다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.mapap-page
    CalculatorHero
      - Hero: "마포 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 서울특별시 마포구 행정구역 기준
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.mapap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 아현·공덕권 단지 수
      - 한강변 또는 도심 접근성 키워드

    section.mapap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.mapap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.mapap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.mapap-area-map
      - 아현·공덕권
      - 대흥·염리권
      - 합정·상수권
      - 상암·디지털미디어시티권
      - 용강·도화·한강변권

    section.mapap-chart
      - 현재 기준가 vs 5년 최저가 막대 비교
      - 평가차익순 / 상승률순 / 최근가순 정렬

    section.mapap-context
      - 마포 가격을 읽는 핵심 변수
      - 광화문·여의도·용산 접근성
      - 공덕 환승축
      - 아현뉴타운·염리 재개발축
      - 한강변·상암 업무지구 수요

    section.mapap-data-method
      - 단지 선정 기준
      - 실거래가 기준
      - 84㎡ 우선 원칙
      - 유사 면적 사용 시 표시 규칙

    section.mapap-risk
      - 거래 건수 부족
      - 동·층·향·면적 차이
      - 신축과 구축 직접 비교 주의
      - 금리·대출 규제
      - 개발호재 과장 금지

    section.mapap-related
      - 성동·송파·용산·강남 예정 리포트 및 주택 구매력 계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/mapoApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type MapoAreaGroup =
  | "아현·공덕권"
  | "대흥·염리권"
  | "합정·상수권"
  | "상암·DMC권"
  | "용강·도화권"
  | "한강변권";

export interface MapoApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface MapoApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: MapoAreaGroup;
  legalDongLabel:
    | "아현동"
    | "공덕동"
    | "염리동"
    | "대흥동"
    | "신공덕동"
    | "합정동"
    | "상수동"
    | "상암동"
    | "용강동"
    | "도화동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  commuteNote?: string;
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

export interface MapoAreaCard {
  areaGroup: MapoAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface MapoContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface MapoFaqItem {
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
| 1 | 마포래미안푸르지오 | 아현·공덕권 | 마포 대표 대단지, 검색 수요와 거래 데이터가 풍부한 핵심 후보 |
| 2 | 공덕자이 | 아현·공덕권 | 공덕역 접근성과 브랜드 선호를 함께 보는 후보 |
| 3 | 마포프레스티지자이 | 대흥·염리권 | 염리·대흥 재개발축 신축 선호 대표 후보 |
| 4 | 신촌그랑자이 | 대흥·염리권 | 신촌·대흥 생활권과 신축 브랜드 수요 비교 후보 |
| 5 | 마포더클래시 | 아현·공덕권 | 아현뉴타운 신축축 비교 후보, 거래 데이터 확인 필요 |
| 6 | 공덕SK리더스뷰 | 아현·공덕권 | 공덕 고가·역세권 후보, 면적별 거래 확인 필요 |
| 7 | 마포자이 | 대흥·염리권 | 마포 기존 브랜드 단지 비교 후보 |
| 8 | 래미안공덕 계열 | 아현·공덕권 | 공덕권 준신축·기존 대단지 비교 후보 |
| 9 | 상암 월드컵파크 계열 | 상암·DMC권 | DMC 업무지구·상암 생활권 비교 후보 |
| 10 | 한강변 용강·도화권 대표 단지 | 용강·도화권 | 한강 접근성과 여의도·용산 접근성 비교 보완 후보 |

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
  - 역·업무지구 접근 메모
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `mapo-raemian-prugio` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `마포는 안전하다` 표현 금지
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
| 법정동 | 아현동 / 공덕동 / 염리동 / 대흥동 / 상암동 등 |
| 생활권 | 아현·공덕권 / 대흥·염리권 / 상암·DMC권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 신축/구축 비교 주의 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

마포는 같은 구 안에서도 가격 논리가 뚜렷하게 갈린다. 생활권 카드는 표 옆 또는 아래에 배치한다.

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 아현·공덕권 | 공덕 환승축, 광화문·여의도 접근성, 대단지 선호 | 역 접근성·동 위치에 따라 체감이 다름 |
| 대흥·염리권 | 신촌·공덕 사이 재개발축, 신축 브랜드 선호 | 신축 프리미엄과 생활권 선호를 분리해서 해석 |
| 합정·상수권 | 홍대·합정 상권, 한강 접근성, 희소성 | 단지 수와 84㎡ 거래 건수가 부족할 수 있음 |
| 상암·DMC권 | DMC 업무지구, 상암 생활권, 대단지 구조 | 도심 접근성과 가격 축이 공덕권과 다름 |
| 용강·도화권 | 한강 접근성, 여의도·용산 이동, 마포역 접근 | 한강 조망 여부를 가격 보장처럼 표현 금지 |

고정 주의 문구:

```text
마포구는 아현·공덕, 대흥·염리, 상암·DMC, 합정·상수, 용강·도화 생활권의 가격 논리가 다릅니다. 같은 마포구 안에서도 역 접근성, 입주연식, 단지 규모, 한강 접근성에 따라 가격 차이가 크게 나타날 수 있습니다.
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
- 신축·준신축·구축 비교 시 입주연식 표시
- 한강변 또는 역세권 설명은 단정 대신 접근성 메모로 표현
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
마포 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
마포 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
마포래미안푸르지오, 공덕자이, 마포프레스티지자이, 신촌그랑자이 등 마포구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 아현·공덕·대흥·상암 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 마포 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 아현·공덕·대흥·상암 생활권 가격 차이
- 마포 아파트가 비싼 이유
- 마포 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const MAPAP_FAQ: MapoFaqItem[] = [
  {
    question: "마포 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "마포 아파트는 왜 비싼가요?",
    answer:
      "광화문, 여의도, 용산 접근성이 좋고 공덕 환승축, 아현·염리 재개발축, 한강 접근성, 상암 업무지구 수요가 함께 작용합니다. 다만 단지별 입주연식과 역 접근성에 따라 가격 차이가 큽니다.",
  },
  {
    question: "마포래미안푸르지오가 마포에서 가장 비싼 아파트인가요?",
    answer:
      "특정 단지가 항상 가장 비싸다고 단정할 수 없습니다. 거래 시점, 면적, 동·층·향, 실거래 건수에 따라 순위가 바뀔 수 있으므로 최신 실거래가 기준으로 다시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "공덕권과 상암권은 같이 비교해도 되나요?",
    answer:
      "둘 다 마포구에 속하지만 가격 논리는 다릅니다. 공덕권은 도심·여의도 환승 접근성이 강하고, 상암권은 DMC 업무지구와 대단지 생활권 성격이 강하므로 생활권을 나눠 봐야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 마포 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const MAPAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·왕십리·옥수·금호 생활권 주요 단지의 가격 변화를 비교합니다.",
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
src/data/mapoApartmentPrice2026.ts
src/pages/reports/mapo-apartment-price-2026.astro
public/scripts/mapo-apartment-price-2026.js
src/styles/scss/pages/_mapo-apartment-price-2026.scss
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
  MAPAP_META,
  MAPAP_APARTMENTS,
  MAPAP_AREA_CARDS,
  MAPAP_CONTEXT,
  MAPAP_FAQ,
  MAPAP_RELATED_LINKS,
  MAPAP_SEO_INTRO,
  MAPAP_SEO_CRITERIA,
} from "../../data/mapoApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: MAPAP_META.title,
    description: MAPAP_META.description,
    dateModified: MAPAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MAPAP_FAQ.map((item) => ({
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

<BaseLayout title={MAPAP_META.seoTitle} description={MAPAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page mapap-page" data-report="mapo-apartment-price-2026">
    <CalculatorHero
      eyebrow="마포 실거래가 리포트"
      title="마포 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={MAPAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        MAPAP_META.notice,
        "이 리포트는 서울특별시 마포구 행정구역을 기준으로 하며, 생활권은 아현·공덕·대흥·상암 등으로 나눠 표시합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="마포 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={MAPAP_SEO_INTRO}
      criteria={MAPAP_SEO_CRITERIA}
      faq={MAPAP_FAQ}
      related={MAPAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/mapo-apartment-price-2026.js`

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
<script type="application/json" id="mapap-data">
  {JSON.stringify(MAPAP_APARTMENTS)}
</script>
<script type="application/json" id="mapap-area-data">
  {JSON.stringify(MAPAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/mapo-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `MAPAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_mapo-apartment-price-2026.scss`

prefix: `mapap-`

```scss
.mapap-page {
  --mapap-ink: #172033;
  --mapap-muted: #667085;
  --mapap-line: #d8e0ea;
  --mapap-soft: #f6f8fb;
  --mapap-blue: #2563eb;
  --mapap-green: #138a5b;
  --mapap-teal: #0f766e;
  --mapap-amber: #b7791f;
  --mapap-red: #c2410c;
}
```

주요 클래스:

```text
mapap-summary-grid
mapap-summary-card
mapap-tabs
mapap-tab
mapap-profit-card
mapap-profit-card__main
mapap-profit-card__meta
mapap-area-badge
mapap-area-grid
mapap-area-card
mapap-table-wrap
mapap-table
mapap-sort-controls
mapap-bar-list
mapap-bar-row
mapap-context-grid
mapap-context-card
mapap-risk-list
mapap-related-grid
mapap-related-card
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
- 도심 접근성, 한강 접근성, 재개발축은 장점으로 설명하되 가격 보장처럼 표현하지 않는다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `마포는 안전하다`
- `강남보다 낫다`
- `한강변이면 무조건 프리미엄`
- `공덕역이면 가격이 보장된다`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `서울특별시 마포구 기준`
- `생활권별 가격 논리가 다름`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 마포구 기준과 생활권 분류 기준이 노출되는가?
- [ ] 공덕역·한강변·재개발축을 가격 보장처럼 표현하지 않는가?
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
3. `src/data/mapoApartmentPrice2026.ts` 생성
4. 리포트 Astro 페이지 생성
5. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
6. SCSS 작성
7. `reports.ts`, `app.scss`, `sitemap.xml` 등록
8. `npm run build`
9. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 성동 대장 아파트 Top10 설계 문서로 서울 시리즈 2번째 축 구성
- 송파·용산·강남은 마포·성동 이후 고경쟁 키워드로 확장
- 서울 지역 리포트 2~3개 이상 발행 후 `seoul-flagship-apartment-top10-2026` 허브 구현
- 허브에서는 구별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
