# 국내 증권사 수수료·혜택 비교 2026 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/stock-brokerage-fee-comparison-2026.md`  
> 작성일: 2026-04-27  
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 `/reports/` 페이지 구현에 착수할 수 있는 수준  
> 참고 리포트/도구: `etf-vs-direct-stock-10year-2026`, `stock-breakeven-calculator`, `domestic-stock-capital-gains-tax`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `국내 증권사 수수료·혜택 비교 2026`
- 콘텐츠 유형: 비교 리포트 (`/reports/`)
- 슬러그: `stock-brokerage-fee-comparison-2026`
- URL: `/reports/stock-brokerage-fee-comparison-2026/`
- 카테고리: `주식·코인`
- 핵심 검색 의도: `증권사 수수료 비교 2026`, `키움증권 수수료`, `토스증권 수수료`, `미국주식 환전 수수료`

### 1-2. 페이지 정의

> 국내 주요 증권사의 국내주식 수수료, 미국주식 수수료, 환전 우대, 신용공여 이자율,
> ISA 연계, 자동투자/소수점 투자, 신규 계좌 이벤트를 투자자 유형별로 비교하는 기준일 스냅샷 리포트

### 1-3. 핵심 메시지

`국내주식 수수료만 보면 안 됩니다. 실제 투자 비용은 매매수수료, 유관기관 제비용, 환전 비용, 신용이자, 이벤트 조건까지 함께 봐야 합니다.`

### 1-4. 구현 원칙

- 수수료와 이벤트는 변동성이 크므로 `기준일`, `출처`, `확인 필요` 상태를 데이터에 포함한다.
- 특정 증권사를 절대 추천하지 않는다. 투자 스타일별 `후보`와 `확인 기준`을 제시한다.
- 이벤트 수수료와 기본 수수료를 분리한다.
- `무료`, `평생`, `0원` 문구는 반드시 유관기관 제비용, 세금, 이벤트 종료 조건을 함께 설명한다.
- 신용거래, 주식담보대출은 고위험 비용 항목으로 다루며 투자 권유처럼 보이지 않게 쓴다.
- 사용자 facing 텍스트는 한국어만 사용한다.

---

## 2. 권장 파일 구조

```text
src/
  data/
    stockBrokerageFeeComparison2026.ts
  pages/
    reports/
      stock-brokerage-fee-comparison-2026.astro

public/
  scripts/
    stock-brokerage-fee-comparison-2026.js
  og/
    reports/
      stock-brokerage-fee-comparison-2026.png

src/styles/scss/pages/
  _stock-brokerage-fee-comparison-2026.scss
```

### 2-1. 추가 반영 파일

- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/pages/index.astro` 홈 노출 대상이면 확인
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 페이지 구조

### 3-1. 리포트 공통 흐름

1. `BaseLayout`
2. `SiteHeader`
3. `CalculatorHero`
4. `InfoNotice`
5. 핵심 결론 KPI
6. 투자자 유형별 빠른 추천 보드
7. 국내주식 수수료 비교표
8. 미국주식·ETF 수수료/환전 비교표
9. 무료 이벤트 조건 해설
10. 신용공여이자율/담보대출 비교
11. ISA·자동투자·소수점 투자 기능 비교
12. 수수료 절약 시뮬레이션
13. 관련 계산기 CTA
14. FAQ
15. `SeoContent`

### 3-2. Hero

- eyebrow: `증권사 수수료 비교`
- title: `국내 증권사 수수료·혜택 비교 2026`
- description: `키움·토스·삼성·미래에셋·한국투자·NH·KB증권의 국내주식 수수료, 미국주식 수수료, 환전 우대, 신용공여 이자율, ISA 연계, 신규 계좌 혜택을 투자자 유형별로 비교합니다.`
- badges:
  - `국내주식`
  - `미국주식`
  - `환전 우대`
  - `신용이자`
  - `2026`

### 3-3. InfoNotice

필수 안내:

- 수수료와 이벤트는 기준일 이후 변경될 수 있으며 실제 계좌 개설 전 공식 페이지 확인이 필요하다.
- `수수료 무료`라도 유관기관 제비용, 세금, 환전 스프레드는 별도로 발생할 수 있다.
- 신용거래와 담보대출은 이자비용과 반대매매 위험이 있으므로 단순 수수료 비교와 별도로 봐야 한다.

---

## 4. 데이터 설계 (`src/data/stockBrokerageFeeComparison2026.ts`)

### 4-1. 타입 정의

```ts
export type BrokerId =
  | "kiwoom"
  | "toss"
  | "samsung"
  | "mirae"
  | "korea-investment"
  | "nh"
  | "kb"
  | "shinhan"
  | "hana"
  | "daishin";

export type FeeValueStatus = "confirmed" | "needsUpdate" | "eventOnly" | "notSupported" | "unknown";
export type InvestorType = "domestic-trader" | "mobile-beginner" | "us-long-term" | "etf-long-term" | "margin-user" | "dividend-investor" | "auto-investor";

export interface FeeValue {
  value: number | null;
  unit: "%" | "bp" | "krw" | "text";
  label: string;
  status: FeeValueStatus;
  note?: string;
  sourceUrl?: string;
  checkedAt?: string;
}

export interface BrokerageFeeRow {
  brokerId: BrokerId;
  brokerName: string;
  domesticBaseFee: FeeValue;
  domesticEventFee: FeeValue;
  includesAgencyFee: "yes" | "no" | "unknown";
  lifetimeBenefit: "yes" | "conditional" | "no" | "unknown";
  domesticRecommendation: string;
  domesticCaution: string;
}

export interface OverseasFeeRow {
  brokerId: BrokerId;
  brokerName: string;
  usStockFee: FeeValue;
  usEtfSameFee: "yes" | "no" | "unknown";
  fxDiscountRate: FeeValue;
  preAfterMarket: "yes" | "limited" | "no" | "unknown";
  fractionalTrading: "yes" | "limited" | "no" | "unknown";
  recommendationScore: 1 | 2 | 3 | 4 | 5;
  caution: string;
}

export interface CreditInterestRow {
  brokerId: BrokerId;
  brokerName: string;
  day1to7: FeeValue;
  day8to15: FeeValue;
  day16to30: FeeValue;
  day31to60: FeeValue;
  day90Plus: FeeValue;
  sourceNote: string;
}

export interface BrokerFeatureRow {
  brokerId: BrokerId;
  brokerName: string;
  htsStrength: string;
  mtsStrength: string;
  isaSupport: "yes" | "limited" | "no" | "unknown";
  domesticFractional: "yes" | "limited" | "no" | "unknown";
  overseasFractional: "yes" | "limited" | "no" | "unknown";
  autoInvestment: "yes" | "limited" | "no" | "unknown";
  bestFor: InvestorType[];
  caution: string;
}

export interface BrokerRecommendation {
  investorType: InvestorType;
  label: string;
  keyCriteria: string;
  brokerCandidates: BrokerId[];
  reason: string;
  caution: string;
}

export interface FeeSimulationRow {
  id: string;
  label: string;
  annualTradeCount: number;
  tradeAmount: number;
  lowFeeRate: number;
  highFeeRate: number;
}

export interface BrokerageFaqItem {
  q: string;
  a: string;
}
```

### 4-2. 메타/출처

```ts
export const SBF_META = {
  slug: "stock-brokerage-fee-comparison-2026",
  title: "국내 증권사 수수료·혜택 비교 2026",
  description:
    "국내주식·미국주식 수수료, 환전 우대, 신용공여이자율, 주식담보대출, ISA 연계, 신규 계좌 혜택까지 2026년 기준으로 비교합니다.",
  updatedAt: "2026년 4월",
  baseLabel: "2026년 4월 기준 공개 수수료·이벤트·공시 확인용 스냅샷",
  caution:
    "수수료, 환전 우대, 이벤트 조건은 수시로 바뀔 수 있습니다. 실제 계좌 개설과 거래 전에는 각 증권사 공식 안내와 금융투자협회 공시를 확인해야 합니다.",
} as const;

export const SBF_SOURCE_LINKS = [
  { label: "금융투자협회 전자공시", href: "https://freesis.kofia.or.kr/", type: "official" },
  { label: "금융투자협회 신용공여 이자율 비교공시", href: "https://www.kofia.or.kr/", type: "official" },
];
```

### 4-3. 수수료 값 표현 규칙

확정 숫자가 없거나 수집 전인 값은 `null`과 `needsUpdate`로 둔다. 화면에는 `공식 확인 필요`로 표시한다.

```ts
const needsUpdate = (label = "공식 확인 필요", note?: string): FeeValue => ({
  value: null,
  unit: "text",
  label,
  status: "needsUpdate",
  note,
});

const percentFee = (value: number, label: string, sourceUrl?: string): FeeValue => ({
  value,
  unit: "%",
  label,
  status: "confirmed",
  sourceUrl,
  checkedAt: "2026-04",
});
```

### 4-4. 국내주식 수수료 데이터

```ts
export const DOMESTIC_FEE_ROWS: BrokerageFeeRow[] = [
  {
    brokerId: "toss",
    brokerName: "토스증권",
    domesticBaseFee: needsUpdate("공식 수수료표 확인 필요"),
    domesticEventFee: needsUpdate("이벤트 수수료 확인 필요"),
    includesAgencyFee: "unknown",
    lifetimeBenefit: "conditional",
    domesticRecommendation: "모바일 간편 투자자",
    domesticCaution: "이벤트 수수료 적용 기간과 유관기관 제비용 포함 여부 확인 필요",
  },
  {
    brokerId: "kiwoom",
    brokerName: "키움증권",
    domesticBaseFee: needsUpdate("공식 수수료표 확인 필요"),
    domesticEventFee: needsUpdate("이벤트 수수료 확인 필요"),
    includesAgencyFee: "unknown",
    lifetimeBenefit: "conditional",
    domesticRecommendation: "단타·HTS 투자자",
    domesticCaution: "HTS/MTS 채널별 수수료와 이벤트 조건 확인 필요",
  },
  {
    brokerId: "samsung",
    brokerName: "삼성증권",
    domesticBaseFee: needsUpdate("공식 수수료표 확인 필요"),
    domesticEventFee: needsUpdate("이벤트 수수료 확인 필요"),
    includesAgencyFee: "unknown",
    lifetimeBenefit: "conditional",
    domesticRecommendation: "자산관리형 장기 투자자",
    domesticCaution: "우대 수수료 종료 후 일반 수수료 확인 필요",
  },
  {
    brokerId: "mirae",
    brokerName: "미래에셋증권",
    domesticBaseFee: needsUpdate("공식 수수료표 확인 필요"),
    domesticEventFee: needsUpdate("이벤트 수수료 확인 필요"),
    includesAgencyFee: "unknown",
    lifetimeBenefit: "conditional",
    domesticRecommendation: "해외주식·연금 병행 투자자",
    domesticCaution: "국내/해외/연금 계좌별 수수료 조건 분리 확인 필요",
  },
];
```

실제 구현 시 최소 10개 증권사를 포함한다.

- 키움증권
- 토스증권
- 삼성증권
- 미래에셋증권
- 한국투자증권
- NH투자증권
- KB증권
- 신한투자증권
- 하나증권
- 대신증권

### 4-5. 미국주식·환전 데이터

```ts
export const OVERSEAS_FEE_ROWS: OverseasFeeRow[] = [
  {
    brokerId: "toss",
    brokerName: "토스증권",
    usStockFee: needsUpdate("미국주식 수수료 확인 필요"),
    usEtfSameFee: "unknown",
    fxDiscountRate: needsUpdate("환전 우대 조건 확인 필요"),
    preAfterMarket: "unknown",
    fractionalTrading: "yes",
    recommendationScore: 4,
    caution: "매매수수료와 환전 우대 적용 시간, 통화, 이벤트 기간을 함께 확인해야 합니다.",
  },
  {
    brokerId: "kiwoom",
    brokerName: "키움증권",
    usStockFee: needsUpdate("미국주식 수수료 확인 필요"),
    usEtfSameFee: "unknown",
    fxDiscountRate: needsUpdate("환전 우대 조건 확인 필요"),
    preAfterMarket: "yes",
    fractionalTrading: "unknown",
    recommendationScore: 4,
    caution: "해외주식 거래 채널과 이벤트 적용 여부를 구분해 확인해야 합니다.",
  },
];
```

### 4-6. 투자자 유형 추천

```ts
export const BROKER_RECOMMENDATIONS: BrokerRecommendation[] = [
  {
    investorType: "domestic-trader",
    label: "국내주식 단타형",
    keyCriteria: "국내 수수료, HTS 안정성, 조건검색, 주문 속도",
    brokerCandidates: ["kiwoom", "daishin"],
    reason: "거래 횟수가 많을수록 수수료와 HTS 기능 차이가 누적됩니다.",
    caution: "최저 수수료만 보지 말고 주문 안정성과 이벤트 종료 후 수수료를 확인하세요.",
  },
  {
    investorType: "mobile-beginner",
    label: "모바일 입문자",
    keyCriteria: "앱 사용성, 간편 매수, 소수점 투자",
    brokerCandidates: ["toss"],
    reason: "처음 시작하는 투자자는 복잡한 HTS보다 MTS 사용성이 중요할 수 있습니다.",
    caution: "고급 차트, 조건검색, 주문 기능이 필요한 단계에서는 한계가 있을 수 있습니다.",
  },
  {
    investorType: "us-long-term",
    label: "미국주식 장기투자자",
    keyCriteria: "미국주식 수수료, 환전 우대, 프리마켓, 배당 입금 편의성",
    brokerCandidates: ["samsung", "mirae", "kiwoom"],
    reason: "미국주식은 매매수수료보다 환전 우대와 해외주식 기능이 더 중요할 수 있습니다.",
    caution: "환전 우대율이 높아도 적용 시간과 이벤트 기간을 반드시 확인하세요.",
  },
  {
    investorType: "margin-user",
    label: "신용거래 투자자",
    keyCriteria: "신용공여 이자율, 반대매매 기준, 담보유지비율",
    brokerCandidates: [],
    reason: "신용거래는 수수료보다 이자비용이 더 큰 비용이 될 수 있습니다.",
    caution: "금융투자협회 공시와 증권사 신용거래 설명서를 기준으로 별도 확인해야 합니다.",
  },
];
```

### 4-7. 수수료 절약 시뮬레이션 데이터

```ts
export const FEE_SIMULATION_ROWS: FeeSimulationRow[] = [
  { id: "long-term", label: "장기투자형", annualTradeCount: 2, tradeAmount: 10000000, lowFeeRate: 0.00015, highFeeRate: 0.0005 },
  { id: "monthly", label: "월 1회 매수", annualTradeCount: 12, tradeAmount: 10000000, lowFeeRate: 0.00015, highFeeRate: 0.0005 },
  { id: "swing", label: "월 4회 매매", annualTradeCount: 48, tradeAmount: 10000000, lowFeeRate: 0.00015, highFeeRate: 0.0005 },
  { id: "daytrade", label: "단타형", annualTradeCount: 200, tradeAmount: 10000000, lowFeeRate: 0.00015, highFeeRate: 0.0005 },
];
```

### 4-8. FAQ / 관련 링크

```ts
export const SBF_FAQ: BrokerageFaqItem[] = [
  {
    q: "국내주식 수수료가 0원이면 정말 공짜인가요?",
    a: "아닙니다. 증권사 수수료가 무료여도 유관기관 제비용이나 세금은 별도로 발생할 수 있습니다. 이벤트 문구에서 무료 범위와 제외 항목을 확인해야 합니다.",
  },
  {
    q: "미국주식은 수수료 낮은 증권사가 무조건 유리한가요?",
    a: "아닙니다. 미국주식은 환전 우대율, 환율 스프레드, 프리마켓 지원 여부, 배당금 입금 편의성까지 함께 봐야 합니다.",
  },
  {
    q: "단타 투자자는 어떤 증권사가 좋나요?",
    a: "단타 투자자는 수수료뿐 아니라 HTS 안정성, 조건검색, 차트 기능, 주문 속도까지 중요합니다.",
  },
  {
    q: "장기투자자는 수수료를 덜 봐도 되나요?",
    a: "거래 횟수가 적다면 수수료보다 ISA, 연금계좌, ETF 라인업, 자산관리 리포트 기능이 더 중요할 수 있습니다.",
  },
  {
    q: "신용거래를 쓰면 어떤 항목을 봐야 하나요?",
    a: "신용거래 투자자는 매매수수료보다 신용공여 이자율과 반대매매 기준을 우선 확인해야 합니다.",
  },
  {
    q: "증권사 이벤트는 어디서 확인해야 하나요?",
    a: "각 증권사 공식 이벤트 페이지와 금융투자협회 전자공시를 함께 확인하는 것이 좋습니다.",
  },
];

export const SBF_RELATED_LINKS = [
  { label: "주식 손익분기점 계산기", href: "/tools/stock-breakeven-calculator/" },
  { label: "국내주식 양도소득세 계산기", href: "/tools/domestic-stock-capital-gains-tax/" },
  { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
  { label: "ETF vs 직접투자 10년 비교", href: "/reports/etf-vs-direct-stock-10year-2026/" },
  { label: "퇴직연금 DC·DB·IRP 비교 2026", href: "/reports/retirement-pension-dc-db-irp-2026/" },
];
```

---

## 5. Astro 페이지 설계

### 5-1. 데이터 전달

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SBF_META,
  DOMESTIC_FEE_ROWS,
  OVERSEAS_FEE_ROWS,
  BROKER_RECOMMENDATIONS,
  FEE_SIMULATION_ROWS,
  SBF_FAQ,
  SBF_RELATED_LINKS,
} from "../../data/stockBrokerageFeeComparison2026";
---
```

### 5-2. 핵심 KPI

KPI는 숫자 확정이 아니라 비교 기준을 요약하는 형태로 둔다.

```astro
<section class="content-section sbf-brief-section">
  <div class="sbf-brief-grid">
    <article>
      <p>국내주식 투자자</p>
      <strong>수수료 + 유관기관 제비용</strong>
      <span>무료 이벤트도 제외 비용 확인 필요</span>
    </article>
    <article>
      <p>미국주식 투자자</p>
      <strong>환전 우대가 핵심</strong>
      <span>매매수수료보다 환율 스프레드가 클 수 있음</span>
    </article>
    <article>
      <p>신용거래 투자자</p>
      <strong>이자율 우선 비교</strong>
      <span>수수료보다 신용공여 이자가 더 큰 비용 가능</span>
    </article>
  </div>
</section>
```

### 5-3. 투자자 유형 탭

```html
<div class="sbf-type-tabs" role="tablist" aria-label="투자자 유형 선택">
  <button type="button" data-sbf-investor-type="domestic-trader">국내 단타형</button>
  <button type="button" data-sbf-investor-type="mobile-beginner">모바일 입문자</button>
  <button type="button" data-sbf-investor-type="us-long-term">미국주식 장기투자자</button>
  <button type="button" data-sbf-investor-type="etf-long-term">ETF 장기투자자</button>
  <button type="button" data-sbf-investor-type="margin-user">신용거래 투자자</button>
</div>
<div id="sbfRecommendationPanel"></div>
```

### 5-4. 국내주식 수수료표

컬럼:

| 증권사 | 기본 수수료 | 이벤트 수수료 | 유관기관 제비용 | 평생 우대 | 추천 대상 | 주의 |
| --- | ---: | ---: | --- | --- | --- | --- |

표 하단 고정 안내:

```text
표의 수수료는 기준일 스냅샷입니다. 실제 거래 전에는 증권사 공식 수수료 안내와 이벤트 적용 조건을 확인하세요.
```

### 5-5. 미국주식·ETF 수수료표

컬럼:

| 증권사 | 미국주식 수수료 | ETF 동일 적용 | 환전 우대 | 프리/애프터마켓 | 소수점 투자 | 추천도 |
| --- | ---: | --- | ---: | --- | --- | --- |

### 5-6. 무료 이벤트 함정 섹션

카드 6개:

- `평생 무료`: 유관기관 제비용 포함 여부
- `수수료 0원`: 이벤트 종료 후 수수료
- `해외주식 0원`: 매수/매도 적용 범위
- `환전 우대 95%`: 스프레드 기준과 적용 시간
- `신규 고객 한정`: 과거 계좌 이력
- `비대면 계좌 한정`: 은행 연계 계좌 제외 여부

### 5-7. 신용공여이자율 비교

고위험 안내를 먼저 보여준다.

```astro
<InfoNotice
  title="신용거래 주의"
  lines={[
    "신용거래는 주가 하락 시 손실과 이자비용이 동시에 커질 수 있습니다.",
    "신용공여 이자율은 기간별·고객등급별로 달라질 수 있습니다.",
    "반대매매 기준과 담보유지비율은 각 증권사 공식 설명서를 확인해야 합니다.",
  ]}
/>
```

### 5-8. 수수료 절약 시뮬레이션

정적 데이터 기반 표와 선택형 계산 보드를 함께 둔다.

입력:

- 투자금
- 연간 거래 횟수
- 낮은 수수료율
- 높은 수수료율

출력:

- 낮은 수수료 연간 비용
- 높은 수수료 연간 비용
- 연간 차이

공식:

```text
연간 수수료 = 거래금액 × 수수료율 × 거래 횟수
연간 차이 = 높은 수수료 연간 비용 - 낮은 수수료 연간 비용
```

### 5-9. CTA

결과형 CTA:

- `주식 손익분기점 계산기`: 수수료·거래세 포함 본전가 계산
- `국내주식 양도소득세 계산기`: 과세 대상 확인
- `적립식 투자 계산기`: 장기 투자 비용 비교

---

## 6. JavaScript 설계 (`public/scripts/stock-brokerage-fee-comparison-2026.js`)

### 6-1. 로드 규칙

```astro
<script
  id="stockBrokerageFeeComparison2026Data"
  type="application/json"
  set:html={JSON.stringify(seed)}
/>
<script type="module" src={withBase("/scripts/stock-brokerage-fee-comparison-2026.js")}></script>
```

Chart.js는 필수가 아니다. MVP는 탭/필터/시뮬레이션 중심으로 구현한다.

### 6-2. 상태 객체

```js
const state = {
  investorType: "domestic-trader",
  simulationTradeAmount: 10000000,
  simulationTradeCount: 12,
  lowFeeRate: 0.00015,
  highFeeRate: 0.0005,
};
```

### 6-3. 함수 목록

| 함수 | 역할 |
| --- | --- |
| `loadSeed()` | JSON seed 파싱 |
| `bindInvestorTabs()` | 투자자 유형 탭 이벤트 |
| `renderRecommendation()` | 유형별 추천 후보/기준/주의 표시 |
| `bindSimulationInputs()` | 수수료 절약 시뮬레이션 입력 이벤트 |
| `calculateFeeSimulation()` | 연간 비용 차이 계산 |
| `renderFeeSimulation()` | 시뮬레이션 결과 업데이트 |
| `formatFeeValue()` | 수수료 값/확인 필요 상태 표시 |
| `syncUrl()` | 투자자 유형 query 반영 |
| `restoreFromUrl()` | 투자자 유형 복원 |

### 6-4. 시뮬레이션 계산

```js
function calculateFeeSimulation() {
  const lowFee = state.simulationTradeAmount * state.lowFeeRate * state.simulationTradeCount;
  const highFee = state.simulationTradeAmount * state.highFeeRate * state.simulationTradeCount;

  return {
    lowFee: Math.round(lowFee),
    highFee: Math.round(highFee),
    difference: Math.round(highFee - lowFee),
  };
}
```

### 6-5. 수수료 값 표시

```js
function formatFeeValue(fee) {
  if (!fee || fee.status === "needsUpdate" || fee.value === null) {
    return fee?.label || "공식 확인 필요";
  }
  if (fee.unit === "%") return `${fee.value}%`;
  if (fee.unit === "krw") return `${Number(fee.value).toLocaleString("ko-KR")}원`;
  return fee.label;
}
```

---

## 7. SCSS 설계 (`_stock-brokerage-fee-comparison-2026.scss`)

### 7-1. 범위

- 페이지 루트: `.sbf-report-page`
- 내부 prefix: `sbf-`
- 전역 table/button 스타일 오염 금지

### 7-2. 주요 블록

```scss
.sbf-report-page {
  display: grid;
  gap: 26px;

  .sbf-brief-grid { ... }
  .sbf-type-tabs { ... }
  .sbf-recommend-panel { ... }
  .sbf-table-wrap { ... }
  .sbf-fee-table { ... }
  .sbf-event-trap-grid { ... }
  .sbf-simulation-panel { ... }
  .sbf-cta-card { ... }
}
```

### 7-3. 디자인 방향

- 금융 리포트이므로 장식보다 표 가독성을 우선한다.
- `공식 확인 필요`, `조건부`, `주의` 상태는 배지로 명확히 표시한다.
- 표는 긴 컬럼이 많으므로 모바일에서 가로 스크롤을 허용한다.
- 상단 추천 보드는 카드 3~4개까지만 노출해 과밀하지 않게 한다.

### 7-4. 반응형

- `960px` 이하: 브리프 카드 3열 → 1열 또는 2열
- `760px` 이하: 투자자 유형 탭 가로 스크롤
- `640px` 이하: 시뮬레이션 입력 2열 → 1열
- 표 최소 너비 `860px` 이상, wrapper `overflow-x: auto`

---

## 8. SEO/콘텐츠 구성

### 8-1. SEO 섹션 제목

1. 2026년 증권사 수수료 경쟁, 왜 다시 중요해졌나?
2. 국내주식 수수료 비교에서 봐야 할 항목
3. 미국주식 투자자는 환전 우대를 함께 봐야 하는 이유
4. 수수료 무료 이벤트에서 확인해야 할 조건
5. HTS와 MTS 기능 차이
6. 신용거래 투자자가 봐야 할 신용공여 이자율
7. ISA 계좌와 ETF 장기투자 연결성
8. 투자자 유형별 증권사 선택 기준
9. 수수료 차이가 연간 비용에 미치는 영향
10. 증권사 선택 전 체크리스트

### 8-2. SeoContent 예시

```astro
<SeoContent
  introTitle="국내 증권사 수수료·혜택 비교를 읽는 방법"
  intro={[
    "주식 계좌를 만들 때 수수료 무료, 평생 우대, 해외주식 0원 같은 문구만 보고 선택하면 실제 비용을 놓칠 수 있습니다.",
    "국내주식은 매매수수료와 유관기관 제비용을 함께 봐야 하고, 미국주식은 환전 우대율과 환율 스프레드를 함께 봐야 합니다.",
    "신용거래나 주식담보대출을 이용한다면 매매수수료보다 신용공여 이자율 차이가 더 큰 비용이 될 수 있습니다.",
  ]}
  criteria={[
    "수수료와 이벤트는 2026년 4월 기준 공개 자료 확인용 스냅샷",
    "이벤트 수수료와 기본 수수료를 분리해 비교",
    "신용공여 이자율은 금융투자협회 공시와 증권사 안내 기준으로 재확인 필요",
  ]}
  faq={faq}
  related={SBF_RELATED_LINKS}
/>
```

### 8-3. 체크리스트 섹션

```text
증권사 선택 전 체크리스트

□ 국내주식 수수료율을 확인했는가?
□ 유관기관 제비용 포함 여부를 확인했는가?
□ 미국주식 수수료와 환전 우대율을 함께 확인했는가?
□ 이벤트 기간 종료 후 수수료율을 확인했는가?
□ 신규 고객 조건에 해당하는지 확인했는가?
□ 신용거래를 쓴다면 신용공여 이자율을 비교했는가?
□ 주식담보대출 이용 가능 종목과 반대매매 기준을 확인했는가?
□ ISA 계좌 연계 여부를 확인했는가?
□ HTS/MTS 사용성이 내 투자 스타일에 맞는가?
□ 단기 혜택보다 장기 사용 비용을 계산했는가?
```

### 8-4. 표현 주의

금지:

- `가장 좋은 증권사는 OO입니다`
- `무료라서 비용이 없습니다`
- `이 증권사가 무조건 유리합니다`
- `신용거래를 추천합니다`

권장:

- `투자 스타일에 따라 후보가 달라집니다`
- `공식 확인 필요`
- `이벤트 조건 확인 필요`
- `유관기관 제비용은 별도일 수 있습니다`
- `신용거래는 이자비용과 반대매매 위험을 함께 확인해야 합니다`

---

## 9. 등록 체크리스트

- [ ] `src/data/stockBrokerageFeeComparison2026.ts` 작성
- [ ] `src/pages/reports/stock-brokerage-fee-comparison-2026.astro` 작성
- [ ] `public/scripts/stock-brokerage-fee-comparison-2026.js` 작성
- [ ] `src/styles/scss/pages/_stock-brokerage-fee-comparison-2026.scss` 작성
- [ ] `src/data/reports.ts`에 `stock-brokerage-fee-comparison-2026` 등록
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/stock-brokerage-fee-comparison-2026';` 추가
- [ ] `public/sitemap.xml`에 `/reports/stock-brokerage-fee-comparison-2026/` 추가
- [ ] OG 이미지 `public/og/reports/stock-brokerage-fee-comparison-2026.png` 생성
- [ ] `npm run build` 성공 확인

---

## 10. QA 체크리스트

### 10-1. 데이터 QA

- [ ] 수수료율과 이벤트 조건에 기준일/출처가 있음
- [ ] 업데이트 전 숫자는 `업데이트 필요`로 표시되고 확정값처럼 보이지 않음
- [ ] 기본 수수료와 이벤트 수수료가 분리되어 있음
- [ ] 유관기관 제비용 포함 여부가 별도 컬럼으로 표시됨
- [ ] 신용공여 이자율은 공식 공시 재확인 문구가 있음
- [ ] 이벤트 조건의 신규/휴면/비대면 제한이 주의 문구에 반영됨

### 10-2. 인터랙션 QA

- [ ] 투자자 유형 탭 클릭 시 추천 기준과 후보가 바뀜
- [ ] 수수료 절약 시뮬레이션 입력 변경 시 결과가 즉시 갱신됨
- [ ] URL query로 투자자 유형이 복원됨
- [ ] 모바일에서 탭과 표가 가로 스크롤로 읽힘

### 10-3. 콘텐츠 QA

- [ ] 특정 증권사를 단정 추천하지 않음
- [ ] `무료`, `0원`, `평생` 표현 옆에 조건 확인 안내가 있음
- [ ] 신용거래를 투자 권유처럼 표현하지 않음
- [ ] 사용자 facing 영어 문장 없음
- [ ] FAQ 6개 이상 노출
- [ ] 관련 링크가 실제 존재하는 페이지 위주로 연결됨

### 10-4. 반응형 QA

- [ ] 320px에서 KPI 카드 텍스트가 넘치지 않음
- [ ] 표는 모바일에서 가로 스크롤로 모든 컬럼 확인 가능
- [ ] 긴 증권사명과 주의 문구가 금액 컬럼을 가리지 않음
- [ ] CTA 카드가 모바일에서 1열로 정렬됨

---

## 11. 구현 순서

1. `src/data/stockBrokerageFeeComparison2026.ts`에 타입, 데이터, FAQ, 관련 링크 작성
2. `src/pages/reports/stock-brokerage-fee-comparison-2026.astro`에서 리포트 골격 작성
3. 국내/미국/신용/기능 비교표 정적 마크업 완성
4. `public/scripts/stock-brokerage-fee-comparison-2026.js`에서 투자자 유형 탭과 수수료 시뮬레이션 구현
5. `_stock-brokerage-fee-comparison-2026.scss` 작성 후 `app.scss`에 import
6. `reports.ts`, `sitemap.xml`, 홈/목록 노출 여부 확인
7. `npm run build`

---

## 12. 최종 요약

| 항목 | 설계 방향 |
| --- | --- |
| 핵심 목적 | 증권사 선택 비용을 국내주식·미국주식·환전·신용이자까지 함께 비교 |
| 콘텐츠 유형 | 기준일 스냅샷형 비교 리포트 |
| 핵심 차별화 | 이벤트 조건, 유관기관 제비용, 환전 우대, 신용공여 이자율 분리 |
| 데이터 원칙 | 확정값/업데이트 필요/이벤트 전용 상태를 분리 |
| UX 방향 | 투자자 유형별 추천 보드 + 상세 비교표 + 수수료 절약 시뮬레이션 |
| 안전장치 | 공식 확인 필요, 투자권유 아님, 신용거래 위험 안내 |
