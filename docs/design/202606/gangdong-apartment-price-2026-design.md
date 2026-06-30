# 강동 대장 아파트 Top10 2026 설계 문서

> 기획 원문: `docs/plan/202606/seoul-gyeonggi-flagship-apartment-top10-2026-plan.md`
> 작성일: 2026-06-29
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 핵심 위치: 강동은 `고덕·상일 신축 대단지`, `둔촌 초대형 재건축`, `명일·암사 실거주축`, `천호·강동역 상권`, `한강·올림픽공원 접근성`이 함께 작동하는 서울 동남권 핵심 주거지다. 최근 5년 최저가 대비 금액은 세금·수수료·대출이자·보유비용을 제외한 `평가차익(추정)`으로 고정 표기한다.

---

## 1. 문서 개요

- 구현 대상: `강동 대장 아파트 Top10 2026`
- 추천 slug: `gangdong-apartment-price-2026`
- URL: `/reports/gangdong-apartment-price-2026/`
- 카테고리: 부동산·내집마련
- 1차 검색 의도: `강동 아파트 실거래가`, `강동 대장 아파트`, `고덕 아파트 시세`, `둔촌주공 실거래가`
- 2차 검색 의도: `고덕그라시움 실거래가`, `고덕아르테온 실거래가`, `올림픽파크포레온 실거래가`, `고덕자이 실거래가`, `래미안솔베뉴 실거래가`
- 핵심 출력: 강동구 Top10 단지 비교표, 단지별 최근 5년 최저가 대비 평가차익 카드, 고덕·상일·둔촌·명일·암사·천호 생활권 해석, 전세가율 참고, 데이터 기준 안내, FAQ
- 차별화 포인트: “강동=고덕” 또는 “강동=둔촌주공”으로 단순화하지 않고, 고덕 신축 대단지와 둔촌 초대형 재건축 입주축, 명일·암사 실거주축을 분리해서 비교한다.

---

## 2. 기존 콘텐츠와 역할 분리

| 기존/예정 콘텐츠 | 역할 | 이번 문서와의 관계 |
|---|---|---|
| `songpa-apartment-price-2026` | 잠실·방이·가락·문정 대단지축 | 강동과 가장 가까운 비교/내부링크 축 |
| `gangnam-apartment-price-2026` | 압구정·대치·개포 최상위 주거축 | 서울 동남권 상급지 비교 |
| `seongdong-apartment-price-2026` | 서울숲·옥수·왕십리 생활권 | 한강변·동부권 비교 |
| `gangseo-magok-apartment-price-2026` | 마곡·우장산·가양 서남권 업무지구축 | 신축 대단지·직주근접 비교 |
| `gangdong-apartment-price-2026` | 고덕·둔촌·명일·암사 단지별 실거래가 | 이번 구현 대상 |
| `seoul-flagship-apartment-top10-2026` | 서울 주요 구별 대표 단지 허브 | 서울 지역 리포트가 쌓인 뒤 대표 허브로 구현 |

강동 리포트는 송파 리포트와 강하게 연결된다. 검색 수요는 고덕그라시움·고덕아르테온·올림픽파크포레온 같은 개별 단지명 중심으로 가져가고, 본문에서는 생활권 차이를 설명한다.

---

## 3. 페이지 IA

```text
[BaseLayout]
  SiteHeader
  main.report-page.gdap-page
    CalculatorHero
      - Hero: "강동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      - description: 84㎡ 기준 최근 실거래가와 최근 5년 최저 실거래가 대비 평가차익 안내

    InfoNotice
      - 국토교통부 실거래가 공개시스템 기준
      - 서울특별시 강동구 행정구역 기준
      - 둔촌 재건축·입주 물량과 현재 실거래가는 분리해서 해석
      - 세금·수수료·대출이자·보유비용 미반영
      - 투자 권유 아님
      - 금액은 평가차익(추정)

    section.gdap-summary
      - 기준일
      - Top10 중 최고 기준가
      - 최대 평가차익(추정)
      - 고덕·상일권 단지 수
      - 둔촌·성내권 단지 수

    section.gdap-tabs
      - 단지 탭 10개
      - 선택 단지에 따라 핵심 카드 갱신

    section.gdap-profit-card
      - "그때 샀다면 지금 얼마?"
      - 최근 5년 최저 실거래가
      - 최저가 거래 시점
      - 현재 기준가
      - 평가차익(추정)
      - 상승률(추정)
      - 비용 미반영 주의

    section.gdap-top10-table
      - Top10 비교표
      - 최근 실거래가, 2025 대비 변화, 5년 최저가 대비 평가차익, 생활권, 전세가율

    section.gdap-area-map
      - 고덕·상일권
      - 둔촌·성내권
      - 명일·암사권
      - 천호·강동역권
      - 한강·올림픽공원 인접권

    section.gdap-context
      - 강동 가격을 읽는 핵심 변수
      - 고덕 신축 대단지
      - 둔촌 초대형 입주 물량
      - 5호선·9호선 연장 기대와 현재 접근성 분리
      - 송파·하남·강남 접근성
      - 전세가율과 실거주 수요

    section.gdap-risk
      - 거래 건수 부족
      - 면적·동·층·향 차이
      - 대단지 내 동별 가격 편차
      - 입주 물량·전세 시장 영향
      - 교통 호재 과장 금지

    SeoContent
```

---

## 4. 데이터 모델

파일: `src/data/gangdongApartmentPrice2026.ts`

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type GangdongAreaGroup =
  | "고덕·상일권"
  | "둔촌·성내권"
  | "명일·암사권"
  | "천호·강동역권"
  | "한강·올림픽공원 인접권";

export interface GangdongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface GangdongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: GangdongAreaGroup;
  legalDongLabel:
    | "고덕동"
    | "상일동"
    | "둔촌동"
    | "성내동"
    | "명일동"
    | "암사동"
    | "천호동"
    | "강일동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  supplyNote?: string;
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

export interface GangdongAreaCard {
  areaGroup: GangdongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GangdongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GangdongFaqItem {
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
| 1 | 고덕그라시움 | 고덕·상일권 | 강동 대표 신축 대단지, 검색 수요와 거래 데이터가 강한 핵심 후보 |
| 2 | 고덕아르테온 | 고덕·상일권 | 고덕 신축 대단지 비교의 대표 후보 |
| 3 | 고덕자이 | 고덕·상일권 | 고덕 신축 브랜드 단지 보완 후보 |
| 4 | 래미안솔베뉴 | 명일·암사권 | 명일·암사 생활권 신축급 브랜드 후보 |
| 5 | 올림픽파크포레온 | 둔촌·성내권 | 둔촌주공 재건축 초대형 단지, 입주 물량·전세 영향 주의 |
| 6 | 둔촌주공 재건축 관련 후보 | 둔촌·성내권 | 공식 단지명과 거래 데이터 구현 전 재확인 |
| 7 | 고덕센트럴아이파크 | 고덕·상일권 | 고덕권 신축축 보완 후보 |
| 8 | 암사동 한강 인접 대표 단지 | 명일·암사권 | 한강 접근 생활권 보완 후보 |
| 9 | 천호·강동역 인접 대표 단지 | 천호·강동역권 | 상권·교통 접근성 보완 후보 |
| 10 | 강일·상일동 대표 단지 | 고덕·상일권 | 5호선 동부축과 하남 접근성 보완 후보 |

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
  - 5호선·9호선·송파 접근 메모
  - 입주 물량 또는 재건축 메모
  - 최신 실거래가
  - 최근 5년 최저 실거래가
  - 평가차익(추정)
  - 상승률(추정)
  - 데이터 주의 문구

URL 상태:

| 파라미터 | 값 | 기본값 |
|---|---|---|
| `complex` | 단지 id | `godeok-gracium` |
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
- `투자 수익`, `수익 확정`, `무조건 오른다`, `강동은 안전하다` 표현 금지
- 둔촌·고덕 대단지는 입주 물량과 전세 시장 영향을 함께 안내
- 교통 호재는 `기대 요인`으로만 표현하고 개통·수혜 확정처럼 쓰지 않음
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
| 법정동 | 고덕동 / 상일동 / 둔촌동 / 명일동 / 암사동 등 |
| 생활권 | 고덕·상일권 / 둔촌·성내권 / 명일·암사권 등 |
| 최근 실거래가 | 84㎡ 우선, 없으면 면적 명시 |
| 거래월 | 최신 거래 시점 |
| 2025 대비 | 전년 동기간 또는 2025년 평균 대비 |
| 5년 최저가 | 2021~2026 최저 실거래가 |
| 평가차익(추정) | 현재 기준가 - 5년 최저가 |
| 전세가율 | 전세 실거래가가 충분할 때만 표시 |
| 주의 | 거래 건수, 면적 차이, 입주 물량, 대단지 동별 편차 |

정렬:

- 기본: 순위
- 평가차익 큰 순
- 상승률 높은 순
- 최근 실거래가 높은 순
- 생활권별 묶기

### 6-4. 생활권 카드

| 생활권 | 핵심 해석 | 주의 |
|---|---|---|
| 고덕·상일권 | 신축 대단지, 5호선 동부축, 하남·강일 접근성 | 단지 규모와 동 위치에 따른 가격 편차 |
| 둔촌·성내권 | 올림픽공원·송파 접근성, 초대형 재건축 입주축 | 입주 물량·전세 시장 영향 분리 |
| 명일·암사권 | 기존 실거주 수요, 한강·암사 생활권 | 구축·신축 연식 차이 확인 |
| 천호·강동역권 | 상권·환승·도심 접근성 | 주거 쾌적성과 상권 접근성을 분리 |
| 한강·올림픽공원 인접권 | 강변·공원 접근성, 동남권 생활축 | 한강·공원 접근성을 가격 보장처럼 표현 금지 |

고정 주의 문구:

```text
강동구는 고덕·상일 신축 대단지와 둔촌 초대형 입주축, 명일·암사 실거주축, 천호·강동역 상권축의 가격 논리가 다릅니다. 같은 강동구 안에서도 입주연식, 단지 규모, 전세 시장, 역 접근성, 거래 시점에 따라 가격 차이가 크게 나타날 수 있습니다.
```

---

## 7. 데이터 리서치 요구사항

구현 직전 필수 확인:

- 국토교통부 실거래가 공개시스템 기준 각 후보 단지의 84㎡ 최근 3개월 매매 실거래가
- 동일 단지 84㎡의 2021~2026년 최저 실거래가와 거래월
- 2025년 동기간 또는 2025년 평균 실거래가
- 전세 실거래가 최근 3개월치, 거래 건수가 부족하면 `참고` 표기
- 각 단지의 법정동과 공식 단지명
- 올림픽파크포레온 등 신규·초대형 단지는 입주 시점과 실거래 데이터 충분성 확인
- 5호선·9호선 연장, 교통 호재는 현재 실거래가와 분리
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
강동 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까
```

### H1

```text
강동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?
```

### description

```text
고덕그라시움, 고덕아르테온, 올림픽파크포레온, 래미안솔베뉴 등 강동구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 고덕·상일·둔촌·명일·암사 생활권 차이와 데이터 기준을 함께 확인하세요.
```

### H2 후보

- 강동 대장 아파트 Top10 실거래가
- 최저가일 때 샀다면 지금 평가차익은?
- 고덕·상일·둔촌·명일 생활권 가격 차이
- 강동 아파트가 주목받는 이유
- 둔촌·고덕 대단지는 어떻게 봐야 할까?
- 강동 실거래가 데이터 기준
- 자주 묻는 질문

---

## 9. FAQ 설계

```ts
export const GDAP_FAQ: GangdongFaqItem[] = [
  {
    question: "강동 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "강동 아파트는 왜 주목받나요?",
    answer:
      "고덕·상일 신축 대단지, 둔촌 초대형 입주축, 송파·하남 접근성, 5호선 교통축, 실거주 수요가 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "고덕그라시움과 올림픽파크포레온을 같이 비교해도 되나요?",
    answer:
      "같은 강동구에 있지만 가격 논리가 다릅니다. 고덕그라시움은 고덕·상일 신축 대단지축이고, 올림픽파크포레온은 둔촌 초대형 재건축 입주축이므로 입주 물량과 생활권을 따로 봐야 합니다.",
  },
  {
    question: "입주 물량이 많으면 가격이 떨어지나요?",
    answer:
      "입주 물량은 전세와 매매 심리에 영향을 줄 수 있지만 가격 방향을 단정할 수 없습니다. 금리, 대출 규제, 전세 수요, 단지별 선호도, 거래 시점에 따라 달라집니다.",
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
    question: "지금 강동 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];
```

---

## 10. 관련 링크

```ts
export const GDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/gangnam-apartment-price-2026/",
    label: "강남 대장 아파트 Top10",
    description: "압구정·대치·개포 생활권의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·옥수·금호·왕십리 생활권 주요 단지의 가격 변화를 비교합니다.",
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
src/data/gangdongApartmentPrice2026.ts
src/pages/reports/gangdong-apartment-price-2026.astro
public/scripts/gangdong-apartment-price-2026.js
src/styles/scss/pages/_gangdong-apartment-price-2026.scss
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
  GDAP_AREA_CARDS,
  GDAP_CONTEXT,
  GDAP_FAQ,
  GDAP_RELATED_LINKS,
  GDAP_SEO_INTRO,
  GDAP_SEO_CRITERIA,
} from "../../data/gangdongApartmentPrice2026";

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
  <main class="container page-shell report-page gdap-page" data-report="gangdong-apartment-price-2026">
    <CalculatorHero
      eyebrow="강동 실거래가 리포트"
      title="강동 대장 아파트, 최저가일 때 샀다면 지금 얼마를 벌었을까?"
      description={GDAP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        GDAP_META.notice,
        "이 리포트는 서울특별시 강동구 행정구역을 기준으로 하며, 생활권은 고덕·상일·둔촌·명일·암사 등으로 나눠 표시합니다.",
        "둔촌 초대형 입주 물량과 교통 호재는 현재 실거래가와 분리해서 해석해야 합니다.",
        "최저가 대비 금액은 세금·중개보수·대출이자·보유비용을 반영하지 않은 평가차익(추정)입니다.",
        "이 리포트는 투자 권유가 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 기준으로 해야 합니다.",
      ]}
    />

    <!-- summary / tabs / profit card / table / area cards / chart / context / risk / related -->

    <SeoContent
      introTitle="강동 아파트 실거래가를 볼 때 먼저 확인할 것"
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

파일: `public/scripts/gangdong-apartment-price-2026.js`

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
<script type="application/json" id="gdap-data">
  {JSON.stringify(GDAP_APARTMENTS)}
</script>
<script type="application/json" id="gdap-area-data">
  {JSON.stringify(GDAP_AREA_CARDS)}
</script>
<script src={withBase("/scripts/gangdong-apartment-price-2026.js")} defer></script>
```

보안:

- URL 파라미터는 allowlist로 검증한다.
- DOM 갱신은 `textContent` 중심으로 처리한다.
- `complex` 값은 `GDAP_APARTMENTS`의 id에 존재할 때만 허용한다.
- 정렬 키는 `rank`, `gain`, `gainRate`, `latestPrice`, `area`만 허용한다.

---

## 14. SCSS 설계

파일: `src/styles/scss/pages/_gangdong-apartment-price-2026.scss`

prefix: `gdap-`

```scss
.gdap-page {
  --gdap-ink: #172033;
  --gdap-muted: #667085;
  --gdap-line: #d8e0ea;
  --gdap-soft: #f6f8fb;
  --gdap-blue: #2563eb;
  --gdap-green: #138a5b;
  --gdap-teal: #0f766e;
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
gdap-area-grid
gdap-area-card
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
- 평가차익 금액 텍스트는 모바일에서 두 줄 허용

디자인 주의:

- 카드 radius는 8px 이하
- 단지 비교 페이지이므로 장식보다 표·숫자·주의 문구 가독성 우선
- 파란색·초록색·청록색 계열만 과도하게 쓰지 않고, 경고·추정 배지는 별도 색상으로 구분
- 평가차익 수치는 강조하되 `추정` 배지를 함께 노출
- 둔촌 입주 물량·교통 호재·송파 접근성은 장점으로 설명하되 가격 보장처럼 표현하지 않는다.

---

## 15. 금지 표현

사용 금지:

- `지금 사야 한다`
- `무조건 오른다`
- `확정 수익`
- `투자 수익`
- `몇 억 벌었다`
- `강동은 안전하다`
- `고덕이면 무조건 오른다`
- `둔촌주공은 안전자산`
- `9호선 연장으로 가격이 보장된다`
- `입주 물량이 끝나면 무조건 오른다`
- `전세가율이 높으면 좋은 단지`
- `최저가에 샀으면 실제로 이만큼 남는다`

사용 권장:

- `평가차익(추정)`
- `단순 시세 차이`
- `세금·비용 미반영`
- `실거래가 기준 참고`
- `서울특별시 강동구 기준`
- `생활권별 가격 논리가 다름`
- `입주 물량과 현재 실거래가 분리`
- `교통 호재는 기대 요인`
- `동·층·향·면적·거래 시점에 따라 달라질 수 있음`
- `매수 판단은 별도 자금 계획과 현장 확인 필요`

---

## 16. QA 체크리스트

- [ ] Top10 후보가 모두 국토교통부 실거래가 공개시스템 기준으로 재검증되었는가?
- [ ] 84㎡ 기준이 아닌 단지는 면적 차이를 명확히 표기했는가?
- [ ] 모든 최저가 대비 금액이 `평가차익(추정)`으로 표기되는가?
- [ ] InfoNotice, profit card, FAQ에 투자 권유 아님 문구가 반복 고정되는가?
- [ ] 강동구 기준과 생활권 분류 기준이 노출되는가?
- [ ] 올림픽파크포레온 등 신규·초대형 단지의 실거래 데이터 충분성이 표시되는가?
- [ ] 입주 물량·교통 호재·송파 접근성을 가격 보장처럼 표현하지 않는가?
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
3. 올림픽파크포레온 등 신규·초대형 단지의 거래 데이터 충분성 확인
4. 입주 물량·전세 시장·교통 호재 문구를 현재 실거래가와 분리
5. `src/data/gangdongApartmentPrice2026.ts` 생성
6. 리포트 Astro 페이지 생성
7. 단지 탭·정렬·생활권 상태 갱신 스크립트 생성
8. SCSS 작성
9. `reports.ts`, `app.scss`, `sitemap.xml` 등록
10. `npm run build`
11. 모바일 375px, 태블릿 768px, 데스크톱 1280px에서 레이아웃 확인

---

## 18. 후속 확장

- 송파·강동을 묶은 동남권 대단지 비교 리포트 기획 가능
- 강동 발행 후 동작·목동·영등포로 서울 서남·동남권 클러스터 확장
- 서울 지역 리포트가 충분히 쌓이면 `seoul-flagship-apartment-top10-2026` 허브 구현
- 허브에서는 구별 대표 단지 1개씩만 요약하고 상세 수치는 각 지역 리포트로 연결
