# 수원 영통 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 수원 영통은 `광교 생활권`, `영통·망포 생활권`, `매탄·원천 업무지구 생활권`이 함께 검색되는 지역이다. 이 문서는 수원시 영통구 행정구역을 기준으로 하되, 광교 생활권과 겹치는 단지는 별도 주의 문구로 처리한다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `수원 영통 대장 아파트 Top10 2026`
- 추천 slug: `suwon-yeongtong-apartment-price-2026`
- URL: `/reports/suwon-yeongtong-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `영통 아파트 실거래가`, `수원 영통 대장 아파트`, `망포 아파트 시세`, `광교 영통 아파트`
- 2차 검색 의도: `영통 아이파크캐슬 실거래가`, `힐스테이트 영통 실거래가`, `래미안 영통 마크원 실거래가`, `매탄 위브하늘채 실거래가`, `광교 자연앤힐스테이트 실거래가`
- 핵심 출력: 영통구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 영통·망포·광교·매탄 생활권 해석, 삼성디지털시티·분당선·신분당선 접근성 메모, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: 영통은 광교·수지처럼 “신도시 프리미엄”만으로 설명하기보다, 삼성디지털시티와 망포 신축 대단지, 영통역 생활권, 광교 인접 단지가 가격에 어떻게 반영되는지 나눠 보여준다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `dongtan-apartment-price-2026` | 동탄 단지별 Top10 시세·GTX-A 프리미엄 | 경기 남부 신축축 비교 링크 |
| `bundang-apartment-price-2026` | 분당 단지별 Top10 시세·재건축 기대 | 상급지·구축·재건축 비교 링크 |
| `gwanggyo-apartment-price-2026` | 광교 생활권 단지별 시세·호수공원/신분당선 프리미엄 | 영통구 안 광교 단지와 생활권 중복 주의 |
| `suji-apartment-price-2026` | 수지구 단지별 시세·분당 대체지 수요 | 신분당선 남부 주거축 비교 링크 |
| `gyeonggi-south-leader-apartment-comparison-2026` | 동탄·분당·광교·수지·영통 권역 비교 | 지역별 리포트가 2~3개 이상 쌓인 뒤 허브로 연결 |
| `suwon-yeongtong-apartment-price-2026` | 수원 영통구 단지별 실거래가·최저가 대비 변화 | 이번 구현 대상 |

이번 리포트는 “수원에서 가장 비싼 아파트”를 단정하는 콘텐츠가 아니라, 영통구 주요 단지를 같은 기준으로 비교하는 리포트다. 광교 행정동에 속한 단지가 포함될 수 있으므로 광교 리포트와의 중복을 명확히 안내한다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.sytap-page
    CalculatorHero
      - Hero: "수원 영통 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 수원시 영통구 행정구역 기준
      - 광교 생활권 단지는 광교 리포트와 중복될 수 있음
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.sytap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 망포·광교·영통 생활권별 단지 수

    section.sytap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.sytap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.sytap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.sytap-area-map
      - 망포역권
      - 영통역권
      - 매탄·원천권
      - 광교 인접권
      - 삼성디지털시티 인접권

    section.sytap-chart
      - 현재 기준가 vs 5년 최저가 막대 비교
      - 평가차익순 / 상승률순 / 최근가순 정렬

    section.sytap-context
      - 영통 가격을 읽는 핵심 변수
      - 삼성디지털시티, 분당선, 신분당선, 망포 신축 대단지, 광교 인접성

    section.sytap-data-method
      - 단지 선정 기준
      - 실거래가 기준
      - 84㎡ 우선 원칙
      - 유사 면적 사용 시 표시 규칙

    section.sytap-risk
      - 거래 건수 부족
      - 광교·망포·영통 생활권 혼재
      - 층·향·동 차이
      - 금리·대출 규제
      - 재건축/리모델링 기대감 단정 금지

    section.sytap-related
      - 광교·수지·분당·동탄 리포트 및 주택 구매력 계산기 CTA

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/suwonYeongtongApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type YeongtongAreaGroup =
  | "망포역권"
  | "영통역권"
  | "매탄·원천권"
  | "광교 인접권"
  | "삼성디지털시티 인접권"
  | "영통구청·중심상권권";

export interface YeongtongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface YeongtongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: YeongtongAreaGroup;
  legalDongLabel:
    | "망포동"
    | "영통동"
    | "매탄동"
    | "원천동"
    | "이의동"
    | "하동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  workplaceNote?: string;
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

export interface YeongtongAreaCard {
  areaGroup: YeongtongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface YeongtongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface YeongtongFaqItem {
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
| 1 | 영통 아이파크캐슬 | 망포역권 | 망포권 대단지·신축 선호·검색 수요가 강한 대표 후보 |
| 2 | 힐스테이트 영통 | 망포역권 | 망포역 접근성과 신축 선호를 함께 보는 단지 |
| 3 | 래미안 영통 마크원 | 영통역권 | 영통 중심 생활권과 브랜드 선호를 비교하기 좋은 후보 |
| 4 | 영통 SK뷰 | 영통역권 | 영통역권 준신축·실거주 수요 비교 후보 |
| 5 | 매탄 위브하늘채 | 매탄·원천권 | 삼성디지털시티 인접 수요와 매탄권 가격을 읽는 후보 |
| 6 | 광교 자연앤힐스테이트 | 광교 인접권 | 영통구 내 광교 생활권 대표 후보, 광교 리포트와 중복 주의 |
| 7 | 광교 중흥S클래스 | 광교 인접권 | 광교 생활권 고가 단지 후보, 행정동·면적 기준 재확인 필요 |
| 8 | 광교 호수공원 아이파크 | 광교 인접권 | 호수공원 프리미엄과 영통구 기준 중복 주의 후보 |
| 9 | e편한세상 영통2차 또는 영통권 브랜드 단지 | 영통역권 | 기존 영통 주거축 보조 후보, 실거래가 기준 재확인 필요 |
| 10 | 망포역 인접 대단지 추가 후보 | 망포역권 | Top10 기준가 검증 후 누락 단지 보완용 |

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
| `complex` | 단지 id | `yeongtong-ipark-castle` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `영통은 안전하다` 표현 금지
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
| 법정동 | 망포동 / 영통동 / 매탄동 / 원천동 / 이의동 등 |
| 생활권 | 망포역권 / 영통역권 / 매탄·원천권 / 광교 인접권 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 광교 중복 여부 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

영통은 같은 구 안에서도 가격을 움직이는 축이 다르다. 생활권 카드는 단지 비교표 옆 또는 아래에 배치한다.

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 망포역권 | 신축 대단지, 분당선, 동탄·수원 접근성을 함께 보는 축 | 단지 규모와 입주연식 차이가 큼 |
| 영통역권 | 오래된 영통 중심 생활권, 학원가·상권·생활 인프라 선호 | 신축 대비 연식 차이를 가격과 분리해서 해석 |
| 매탄·원천권 | 삼성디지털시티 인접성과 업무지구 수요 | 직주근접 수요가 매매가를 보장한다는 식의 표현 금지 |
| 광교 인접권 | 광교신도시 생활권, 호수공원·신분당선 접근성 | 광교 리포트와 중복 가능, 행정구역·단지명 재확인 필요 |
| 영통구청·중심상권권 | 생활 편의성과 기존 주거 선호 | 지하철 접근성과 단지 연식 차이 병기 |

고정 주의 문구:

```text
수원 영통구는 망포·영통·매탄·원천·광교 인접 생활권의 성격이 다릅니다. 같은 영통구 안에서도 지하철 접근성, 업무지구 접근성, 입주연식, 단지 규모에 따라 가격 차이가 크게 나타날 수 있습니다.
```

### 6-5. 차트

1차 구현은 CSS 막대 그래프 또는 단순 카드형 그래프로 충분하다. 지역 리포트가 3개 이상 쌓이면 공통 Chart.js 컴포넌트 도입을 검토한다.

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
- 광교 생활권 단지가 영통구 행정구역 기준에 포함되는지 확인
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
수원 영통 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
수원 영통 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
영통 아이파크캐슬, 힐스테이트 영통, 래미안 영통 마크원 등 수원 영통구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 망포·영통·매탄·광교 인접 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 수원 영통 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 망포역권·영통역권·매탄권·광교 인접권 가격 차이
- 영통 아파트 가격을 볼 때 확인할 것
- 수원 영통 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const SYTAP_FAQ: YeongtongFaqItem[] = [
  {
    question: "수원 영통 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "영통구와 광교 생활권은 왜 겹치나요?",
    answer:
      "광교신도시 일부 단지는 수원시 영통구에 속하면서도 사용자는 광교 생활권으로 검색하는 경우가 많습니다. 그래서 이 리포트는 영통구 기준을 유지하되 광교 리포트와 중복될 수 있는 단지를 별도 표시합니다.",
  },
  {
    question: "영통 아이파크캐슬이 영통에서 가장 비싼 아파트인가요?",
    answer:
      "특정 단지가 항상 가장 비싸다고 단정할 수 없습니다. 거래 시점, 면적, 동·층·향, 실거래 건수에 따라 순위가 바뀔 수 있으므로 최신 실거래가 기준으로 다시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "영통 아파트는 왜 망포와 광교를 함께 봐야 하나요?",
    answer:
      "영통구 안에서도 망포역권 신축 대단지, 기존 영통 중심상권, 매탄·원천 업무지구, 광교 인접 단지의 수요가 다르기 때문입니다. 생활권을 나누면 가격 차이를 더 현실적으로 해석할 수 있습니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 영통 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const SYTAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "광교 생활권 주요 단지의 실거래가와 최저가 대비 평가차익을 비교합니다.",
  },
  {
    href: "/reports/suji-apartment-price-2026/",
    label: "수지 대장 아파트 Top10",
    description: "수지구 주요 단지의 신분당선·생활권 프리미엄과 가격 변화를 확인합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 주요 단지의 실거래가, 재건축 기대, 저점 대비 변화를 비교합니다.",
  },
  {
    href: "/reports/dongtan-apartment-price-2026/",
    label: "동탄 대장 아파트 Top10",
    description: "동탄 주요 단지의 GTX-A 이후 가격 흐름과 최저가 대비 변화를 확인합니다.",
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
src/data/suwonYeongtongApartmentPrice2026.ts
src/pages/reports/suwon-yeongtong-apartment-price-2026.astro
public/scripts/suwon-yeongtong-apartment-price-2026.js
src/styles/scss/pages/_suwon-yeongtong-apartment-price-2026.scss
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
  SYTAP_META,
  SYTAP_APARTMENTS,
  SYTAP_AREA_CARDS,
  SYTAP_CONTEXT,
  SYTAP_FAQ,
  SYTAP_RELATED_LINKS,
  SYTAP_SEO_INTRO,
  SYTAP_SEO_CRITERIA,
} from "../../data/suwonYeongtongApartmentPrice2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SYTAP_META.title,
    description: SYTAP_META.description,
    dateModified: SYTAP_META.updatedAt,
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SYTAP_FAQ.map((item) => ({
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

<BaseLayout title={SYTAP_META.seoTitle} description={SYTAP_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sytap-page" data-report="suwon-yeongtong-apartment-price-2026">
    <CalculatorHero
      eyebrow="수원 영통 실거래가 리포트"
      title="수원 영통 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={SYTAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        SYTAP_META.notice,
        "이 리포트는 수원시 영통구 행정구역을 기준으로 하며, 광교 생활권과 겹치는 단지는 별도 표시합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="수원 영통 아파트 실거래가를 볼 때 먼저 확인할 것"
      intro={SYTAP_SEO_INTRO}
      criteria={SYTAP_SEO_CRITERIA}
      faq={SYTAP_FAQ}
      related={SYTAP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/suwon-yeongtong-apartment-price-2026.js`

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
<script type="application/json" id="sytap-data">
  {JSON.stringify(SYTAP_APARTMENTS)}
</script>
<script type="application/json" id="sytap-area-data">
  {JSON.stringify(SYTAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/suwon-yeongtong-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `SYTAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_suwon-yeongtong-apartment-price-2026.scss`

prefix: `sytap-`

```scss
.sytap-page {
  --sytap-ink: #172033;
  --sytap-muted: #667085;
  --sytap-line: #d8e0ea;
  --sytap-soft: #f6f8fb;
  --sytap-blue: #2563eb;
  --sytap-green: #138a5b;
  --sytap-teal: #0f766e;
  --sytap-amber: #b7791f;
  --sytap-red: #c2410c;
}
```

주요 클래스:

```text
sytap-summary-grid
sytap-summary-card
sytap-tabs
sytap-tab
sytap-profit-card
sytap-profit-card__main
sytap-profit-card__meta
sytap-area-badge
sytap-area-grid
sytap-area-card
sytap-table-wrap
sytap-table
sytap-sort-controls
sytap-bar-list
sytap-bar-row
sytap-context-grid
sytap-context-card
sytap-risk-list
sytap-related-grid
sytap-related-card
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
- 광교 중복 단지는 생활권 배지와 주의 문구를 같이 표시

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `영통은 안전하다`
- `삼성 수요가 가격을 보장한다`
- `광교 옆이면 무조건 프리미엄`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `수원시 영통구 기준`
- `광교 생활권과 중복될 수 있음`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 수원시 영통구 기준과 광교 생활권 중복 주의가 노출되는가?
- [ ] 삼성디지털시티·광교 인접성·분당선 접근성을 가격 보장처럼 표현하지 않는가?
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
3. `src/data/suwonYeongtongApartmentPrice2026.ts` 생성
4. 리포트 Astro 페이지 생성
5. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
6. SCSS 작성
7. `reports.ts`, `app.scss`, `sitemap.xml` 등록
8. `npm run build`
9. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 광교 리포트와 영통 리포트의 중복 단지 처리 기준 통일
- 수지·영통·광교를 묶은 신분당선·분당선 남부 주거축 비교 콘텐츠 기획
- 동탄·분당·광교·수지·영통 지역 리포트가 쌓이면 허브 `seoul-gyeonggi-flagship-apartment-top10-2026` 구현
- 허브에서는 지역별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
