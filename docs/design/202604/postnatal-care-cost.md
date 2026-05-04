# 산후도우미 비용 계산기 설계문서

> 기획 원본: `docs/plan-docs/202604/postnatal-care-cost.md`  
> 작성일: 2026-04-27  
> 콘텐츠 유형: 계산기(`/tools/` 계열)  
> 권장 slug: `postnatal-care-cost`  
> URL: `/tools/postnatal-care-cost/`

---

## 1. 문서 개요

### 1-1. 구현 목표

`산후도우미 비용 계산기`는 거주 지역, 출산 유형, 출산 순위, 소득 구간, 이용 기간, 이용 시간 유형, 바우처 적용 여부를 입력하면 `총 서비스 가격`, `정부지원금`, `예상 본인부담금`, `민간 추가 비용`, `최종 예상 부담금`을 계산하는 도구다.

핵심 사용자 질문은 다음과 같다.

- 산후도우미를 2주 쓰면 실제로 얼마를 내야 하나?
- 정부지원 바우처를 적용하면 본인부담금이 얼마나 줄어드나?
- 첫째아/둘째아, 단태아/쌍태아, 소득 구간에 따라 지원금이 얼마나 달라지나?
- 주간형 외 야간/입주형/주말 이용을 넣으면 총액이 얼마나 늘어나나?
- 산후조리원과 비교하면 어느 선택지가 더 현실적인가?

### 1-2. 품질 기준

- 모든 금액 데이터에 `공식`, `참고`, `추정` 배지를 붙인다.
- 2026년 공개 가격표 기반 금액과 민간 추가 비용 추정치를 명확히 분리한다.
- 결과 문구는 확정 표현을 피하고 "예상", "추정", "직접 확인 필요"를 사용한다.
- 사용자 facing 텍스트는 한국어로만 작성한다.
- 계산 로직은 순수 함수로 분리해 테스트 가능하게 만든다.

---

## 2. 권장 파일 구조

```text
src/
  data/
    postnatalCareCost.ts
    tools.ts
  pages/
    tools/
      postnatal-care-cost.astro
  styles/
    scss/
      pages/
        _postnatal-care-cost.scss
    app.scss

public/
  scripts/
    postnatal-care-cost.js
  sitemap.xml
```

### 등록 필요 항목

- `src/data/tools.ts`: `postnatal-care-cost` 계산기 등록
- `src/styles/app.scss`: `@use 'scss/pages/postnatal-care-cost';` 추가
- `public/sitemap.xml`: `/tools/postnatal-care-cost/` URL 추가
- `npm run build`: 구현 후 필수 확인

---

## 3. 데이터 설계

### 3-1. 데이터 출처

| 데이터 | 사용 방식 | 배지 | 주요 출처 |
|---|---|---|---|
| 2026년 서비스 가격/정부지원금/본인부담금 | 계산 기준표 | 공식 | 송파구 보건소, 대전 동구청, 구로구 보건소 공개표 |
| 신청 기간/바우처 유효기간 | 안내 문구 | 공식 | 창원시, 인천 동구, 논산시 등 지자체 안내 |
| 기준중위소득 150% 건강보험료 기준 | 소득 구간 안내 | 공식 | 구로구, 성북구 등 지자체 공개표 |
| 야간/입주/주말/프리미엄 추가금 | 옵션 비용 추정 | 추정 | 편집부 추정값, 사용자 직접 입력 허용 |
| 지자체 추가 지원금 | 별도 입력 또는 안내 | 참고 | 지역별 보건소/복지로 확인 필요 |

참고 URL:

- 송파구 보건소: `https://www.songpa.go.kr/ehealth/contents.do?key=4569`
- 대전 동구청: `https://www.donggu.go.kr/dg/kor/contents/13`
- 구로구 보건소: `https://www.guro.go.kr/health/contents.do?key=1329`
- 창원시: `https://www.changwon.go.kr/cwportal/13763.web`
- 인천 동구보건소: `https://www.icdonggu.go.kr/clinic/health/motherbaby_health.jsp`

### 3-2. TypeScript 데이터 파일

파일: `src/data/postnatalCareCost.ts`

```ts
export type PncRegion = "seoul" | "gyeonggi" | "incheon" | "busan" | "daegu" | "daejeon" | "gwangju" | "local";
export type PncBirthType = "single" | "twin" | "triplet_plus";
export type PncChildOrder = "first" | "second" | "third_plus";
export type PncIncomeType = "ga" | "tonghap" | "ra" | "unknown";
export type PncServicePeriod = "short" | "standard" | "extended" | "custom";
export type PncCareTimeType = "day" | "night" | "live_in" | "full_time_24h";
export type PncSourceBadge = "공식" | "참고" | "추정";

export interface PostnatalCareRate {
  year: number;
  region: PncRegion;
  birthType: PncBirthType;
  childOrder: PncChildOrder;
  incomeType: PncIncomeType;
  servicePeriod: Exclude<PncServicePeriod, "custom">;
  serviceDays: number;
  totalPrice: number;
  governmentSubsidy: number;
  userPayment: number;
  sourceBadge: PncSourceBadge;
  sourceLabel: string;
}

export interface PostnatalCareExtraCost {
  careTimeType: PncCareTimeType;
  label: string;
  extraCost: number;
  sourceBadge: PncSourceBadge;
  note: string;
}

export interface PostnatalCareFaq {
  q: string;
  a: string;
}
```

### 3-3. 초기 기준 데이터

첫 구현은 데이터 범위를 좁혀 안정적으로 시작한다.

- 지역별 가격 차이가 동일한 정부표로 안내되는 경우 `region`은 계산 결과 문구와 지자체 추가 지원 안내에만 사용한다.
- 정부지원금 표는 우선 `단태아/첫째아` 3개 소득 구간과 `단축/표준/연장`을 정확히 입력한다.
- 둘째아, 셋째아 이상, 쌍태아, 삼태아 이상은 데이터 확장 슬롯을 만들고 구현 시 공식표 확인 후 채운다.

```ts
export const POSTNATAL_CARE_RATES_2026: PostnatalCareRate[] = [
  {
    year: 2026,
    region: "seoul",
    birthType: "single",
    childOrder: "first",
    incomeType: "ga",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 1165000,
    userPayment: 299000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    region: "seoul",
    birthType: "single",
    childOrder: "first",
    incomeType: "tonghap",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 1002000,
    userPayment: 462000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    region: "seoul",
    birthType: "single",
    childOrder: "first",
    incomeType: "ra",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 764000,
    userPayment: 700000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
];
```

### 3-4. 민간 추가 비용

```ts
export const POSTNATAL_CARE_EXTRA_COSTS: PostnatalCareExtraCost[] = [
  {
    careTimeType: "day",
    label: "주간형",
    extraCost: 0,
    sourceBadge: "추정",
    note: "정부지원 표준 방문형 기준으로 별도 추가금 없음",
  },
  {
    careTimeType: "night",
    label: "야간형",
    extraCost: 150000,
    sourceBadge: "추정",
    note: "야간 돌봄 또는 연장 이용을 가정한 편집부 추정값",
  },
  {
    careTimeType: "live_in",
    label: "입주형",
    extraCost: 300000,
    sourceBadge: "추정",
    note: "입주형 또는 고강도 돌봄 옵션을 가정한 편집부 추정값",
  },
  {
    careTimeType: "full_time_24h",
    label: "24시간형",
    extraCost: 500000,
    sourceBadge: "추정",
    note: "24시간 돌봄 또는 프리미엄 옵션을 가정한 편집부 추정값",
  },
];
```

---

## 4. 계산 로직

### 4-1. 입력 모델

```ts
export interface PostnatalCareInput {
  region: PncRegion;
  birthType: PncBirthType;
  childOrder: PncChildOrder;
  incomeType: PncIncomeType;
  servicePeriod: PncServicePeriod;
  useVoucher: boolean;
  careTimeType: PncCareTimeType;
  localSubsidy: number;
  privateExtraCost: number;
}
```

### 4-2. 결과 모델

```ts
export interface PostnatalCareResult {
  totalPrice: number;
  governmentSubsidy: number;
  localSubsidy: number;
  baseUserPayment: number;
  careTimeExtraCost: number;
  privateExtraCost: number;
  finalUserPayment: number;
  subsidyRate: number;
  sourceBadge: PncSourceBadge;
  sourceLabel: string;
}
```

### 4-3. 계산 공식

```text
기본 본인부담금 = 총 서비스 가격 - 정부지원금
최종 예상 부담금 = 기본 본인부담금 - 지자체 추가 지원금 + 이용 시간 추가금 + 민간 추가 비용
```

주의:

- `useVoucher=false`이면 정부지원금을 0원으로 처리한다.
- `localSubsidy`는 사용자가 직접 입력한 금액만 반영한다.
- 최종 금액은 0원 미만으로 내려가지 않도록 `Math.max(value, 0)` 처리한다.
- 공식표에 없는 조합은 임의 계산하지 않고 "해당 조건의 공식 기준표를 확인해야 합니다" 상태를 보여준다.

```ts
export function calculatePostnatalCareCost(
  input: PostnatalCareInput,
  rates: PostnatalCareRate[],
  extraCosts: PostnatalCareExtraCost[],
): PostnatalCareResult | null {
  const rate = rates.find(
    (item) =>
      item.region === input.region &&
      item.birthType === input.birthType &&
      item.childOrder === input.childOrder &&
      item.incomeType === input.incomeType &&
      item.servicePeriod === input.servicePeriod,
  );

  if (!rate) return null;

  const extra = extraCosts.find((item) => item.careTimeType === input.careTimeType);
  const governmentSubsidy = input.useVoucher ? rate.governmentSubsidy : 0;
  const baseUserPayment = rate.totalPrice - governmentSubsidy;
  const careTimeExtraCost = extra?.extraCost ?? 0;
  const finalUserPayment = Math.max(
    baseUserPayment - input.localSubsidy + careTimeExtraCost + input.privateExtraCost,
    0,
  );

  return {
    totalPrice: rate.totalPrice,
    governmentSubsidy,
    localSubsidy: input.localSubsidy,
    baseUserPayment,
    careTimeExtraCost,
    privateExtraCost: input.privateExtraCost,
    finalUserPayment,
    subsidyRate: rate.totalPrice > 0 ? Math.round((governmentSubsidy / rate.totalPrice) * 100) : 0,
    sourceBadge: rate.sourceBadge,
    sourceLabel: rate.sourceLabel,
  };
}
```

---

## 5. 화면 설계

### 5-1. 레이아웃

`SimpleToolShell` 기반 2컬럼 계산기 구조를 사용한다.

- 좌측/상단: 입력 패널
- 우측/하단: 결과 카드, 비용 분해, 해석 문구
- 하단: 안내 본문, FAQ, 관련 콘텐츠 CTA, `SeoContent`

### 5-2. Hero

```astro
<CalculatorHero
  eyebrow="출산·산후관리"
  title="산후도우미 비용 계산기"
  description="거주 지역, 출산 유형, 소득 구간, 이용 기간을 입력하면 정부지원 바우처 적용 후 예상 본인부담금을 계산합니다."
  badges={["산후도우미", "정부지원", "바우처", "2026"]}
/>
<InfoNotice
  text="이 계산기는 2026년 산모·신생아 건강관리 지원사업 공개표와 편집부 추정값을 함께 사용합니다. 실제 지원 가능 여부와 결제 금액은 거주지 보건소, 복지로, 제공기관에서 최종 확인하세요."
/>
```

### 5-3. 입력 패널

#### 기본 정보

| 필드 | UI | 기본값 |
|---|---|---|
| 거주 지역 | select | 서울 |
| 출산 유형 | segmented button | 단태아 |
| 출산 순위 | radio | 첫째아 |
| 소득 구간 | select | 기준중위소득 150% 이하 |
| 정부지원 바우처 적용 | toggle | 적용 |

#### 이용 조건

| 필드 | UI | 기본값 |
|---|---|---|
| 이용 기간 | segmented button | 표준 |
| 이용 시간 유형 | select | 주간형 |
| 지자체 추가 지원금 | number | 0 |
| 민간 추가 비용 | number | 0 |

### 5-4. 결과 카드

4개 핵심 결과를 우선 노출한다.

| 카드 | 내용 |
|---|---|
| 총 서비스 가격 | 바우처 차감 전 서비스 가격 |
| 정부지원금 | 바우처 적용 예상 금액 |
| 기본 본인부담금 | 정부지원금 차감 후 부담금 |
| 최종 예상 부담금 | 추가 지원/추가 비용 반영 후 금액 |

보조 카드:

- 지자체 추가 지원금
- 야간/입주/주말 등 추가 비용
- 정부지원 비율

### 5-5. 비용 분해

Chart.js horizontal bar chart를 사용한다.

- 총 서비스 가격
- 정부지원금 차감
- 지자체 추가 지원금 차감
- 이용 시간 추가금
- 민간 추가 비용
- 최종 예상 부담금

차감 항목은 음수 또는 별도 색상으로 표시한다.

### 5-6. 결과 해석 문구

조건별로 1~3개 문장을 생성한다.

예시:

```text
현재 조건에서는 총 서비스 가격의 약 68%가 정부지원금으로 반영되는 구조입니다.
다만 지자체 추가 지원금, 제공기관 추가 요금, 주말·야간 이용 여부에 따라 실제 결제 금액은 달라질 수 있습니다.
```

공식표에 없는 조합:

```text
선택한 조건의 공식 기준표가 아직 데이터에 등록되지 않았습니다. 거주지 보건소 또는 복지로에서 최신 기준을 확인한 뒤 직접 입력 기능으로 계산하세요.
```

---

## 6. 페이지 섹션 구성

```text
[SiteHeader]
[CalculatorHero]
[InfoNotice]
[SimpleToolShell]
  - 입력 패널
  - 결과 카드
  - 비용 분해 차트
  - 결과 해석
[산후도우미 비용은 어떻게 정해지나]
[정부지원 바우처 적용 범위]
[소득 구간과 출산 유형별 차이]
[산후조리원과 비용 비교 CTA]
[신청 시기와 주의사항]
[FAQ]
[관련 콘텐츠 CTA]
[SeoContent]
[SiteFooter]
```

### 본문 H2 구조

- 산후도우미 비용은 어떻게 정해지나
- 정부지원 바우처를 적용하면 얼마나 줄어드나
- 단태아·쌍태아·둘째아 이상은 왜 비용 구조가 달라지나
- 산후조리원과 산후도우미 비용은 어떻게 비교해야 하나
- 산모·신생아 건강관리 지원사업 신청 시기
- 산후도우미 업체 선택 체크리스트
- 산후도우미 비용 계산기 FAQ

---

## 7. JavaScript 설계

파일: `public/scripts/postnatal-care-cost.js`

### 7-1. 함수 목록

| 함수 | 역할 |
|---|---|
| `readState()` | DOM 입력값을 state로 변환 |
| `findRate(state)` | 선택 조건에 맞는 공식 기준표 탐색 |
| `calculate(state)` | 총액/지원금/본인부담금 계산 |
| `renderResult(result)` | 결과 카드 업데이트 |
| `renderInterpretation(result)` | 해석 문구 업데이트 |
| `initBreakdownChart()` | 비용 분해 차트 초기화 |
| `updateBreakdownChart(result)` | 차트 데이터 갱신 |
| `syncUrlParams(state)` | URL 상태 저장 |
| `restoreFromUrl()` | URL 상태 복원 |
| `bindEvents()` | 입력 이벤트 바인딩 |
| `initFaq()` | FAQ accordion |

### 7-2. URL 파라미터

| 파라미터 | 의미 |
|---|---|
| `rg` | 거주 지역 |
| `bt` | 출산 유형 |
| `co` | 출산 순위 |
| `it` | 소득 구간 |
| `sp` | 이용 기간 |
| `uv` | 바우처 적용 여부 |
| `ct` | 이용 시간 유형 |
| `ls` | 지자체 추가 지원금 |
| `pe` | 민간 추가 비용 |

### 7-3. 차트 옵션

```js
{
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.parsed.x.toLocaleString("ko-KR")}원`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        callback: (value) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`,
      },
    },
  },
}
```

---

## 8. SCSS 설계

파일: `src/styles/scss/pages/_postnatal-care-cost.scss`

### 8-1. prefix

모든 페이지 전용 클래스는 `pnc-` prefix를 사용한다.

### 8-2. 주요 클래스

```scss
.pnc-page {}
.pnc-form-grid {}
.pnc-radio-group {}
.pnc-toggle {}
.pnc-result-grid {}
.pnc-result-card {}
.pnc-result-card--final {}
.pnc-badge {}
.pnc-badge--official {}
.pnc-badge--reference {}
.pnc-badge--estimate {}
.pnc-chart-wrap {}
.pnc-interpretation {}
.pnc-guide-card {}
.pnc-faq-item {}
.pnc-related-grid {}
```

### 8-3. 반응형 기준

- 375px: 입력 필드 1열, 결과 카드 2열
- 640px 이상: 결과 카드 4열
- 820px 이상: `SimpleToolShell` 기본 2컬럼 유지
- 차트 영역은 `min-height: 300px`, 모바일에서는 `min-height: 360px`

---

## 9. SEO 설계

### 9-1. Meta

```text
title: 산후도우미 비용 계산기 | 정부지원 바우처 본인부담금 계산 | 비교계산소
description: 거주 지역, 출산 유형, 소득 구간, 이용 기간을 입력하면 2026년 산모·신생아 건강관리 지원사업 기준으로 산후도우미 정부지원금과 예상 본인부담금을 계산합니다.
```

### 9-2. 주요 키워드

- 산후도우미 비용
- 산후도우미 정부지원
- 산모 신생아 건강관리 지원사업
- 산후도우미 바우처
- 산후도우미 본인부담금
- 산후도우미 2주 비용
- 쌍둥이 산후도우미 비용
- 서울 산후도우미 비용

### 9-3. FAQ 초안

```ts
export const POSTNATAL_CARE_COST_FAQ = [
  {
    q: "산후도우미 비용은 평균 얼마인가요?",
    a: "정부지원 산모·신생아 건강관리 서비스는 태아 유형, 출산 순위, 소득 구간, 이용 기간에 따라 서비스 가격과 정부지원금이 달라집니다. 예를 들어 2026년 단태아 첫째아 표준형 10일 기준 총 서비스 가격은 146만 4천원으로 공개되어 있으며, 소득 구간에 따라 본인부담금이 달라집니다.",
  },
  {
    q: "정부지원 바우처를 받으면 실제로 얼마를 내나요?",
    a: "총 서비스 가격에서 정부지원금을 뺀 금액이 기본 본인부담금입니다. 여기에 지자체 추가 지원금, 야간·입주형 추가금, 제공기관 추가 비용이 반영되면 최종 결제 금액이 달라질 수 있습니다.",
  },
  {
    q: "기준중위소득 150%를 넘으면 지원을 못 받나요?",
    a: "기본 지원은 기준중위소득 150% 이하가 중심이지만, 둘째아 이상, 다태아, 미숙아, 희귀난치성질환 산모, 장애 산모 등은 예외 지원 대상이 될 수 있습니다. 거주지 보건소 기준을 반드시 확인해야 합니다.",
  },
  {
    q: "산후도우미 신청은 언제 해야 하나요?",
    a: "지자체 안내 기준으로 보통 출산 예정일 40일 전부터 출산 후 60일 이내 신청할 수 있습니다. 미숙아 또는 선천성 이상아 입원 등 특수한 경우는 퇴원일 기준으로 별도 기한이 적용될 수 있습니다.",
  },
  {
    q: "산후조리원과 산후도우미 중 어느 쪽이 저렴한가요?",
    a: "비용만 보면 정부지원 바우처를 적용한 산후도우미가 더 낮을 가능성이 큽니다. 다만 산후조리원은 숙박, 식사, 신생아실, 산모 회복 프로그램이 포함되므로 회복 환경과 가족 지원 여부까지 함께 비교해야 합니다.",
  },
  {
    q: "야간형이나 입주형도 정부지원 기준에 포함되나요?",
    a: "정부지원 표준 서비스와 민간 추가 옵션은 구분해서 봐야 합니다. 야간형, 입주형, 주말 이용, 프리미엄 관리사 비용은 제공기관별로 달라질 수 있어 계산기에서는 추정값 또는 직접 입력값으로 처리합니다.",
  },
];
```

---

## 10. 관련 콘텐츠 CTA

| 콘텐츠 | URL | 문구 |
|---|---|---|
| 2026 산후조리원 비용 비교 | `/reports/postpartum-center-cost-2026/` | 산후조리원 2주 비용과 비교하기 |
| 임신 출산 비용 계산기 | `/tools/pregnancy-birth-cost/` | 출산 전후 총비용 계산하기 |
| 신생아 1년 육아비용 | `/reports/baby-cost-guide-first-year/` | 출산 후 1년 비용 확인하기 |
| 태아보험 가이드 | `/reports/fetal-insurance-guide-2026/` | 출산 전 보험 체크하기 |
| 육아기 단축근무 계산기 | `/tools/parental-leave-short-work-calculator/` | 육아기 소득 흐름 계산하기 |

실제 구현 전 URL 존재 여부를 확인하고, 없는 URL은 현재 사이트에 있는 대체 콘텐츠로 연결한다.

---

## 11. 등록 설계

### 11-1. `src/data/tools.ts`

```ts
{
  slug: "postnatal-care-cost",
  title: "산후도우미 비용 계산기",
  description: "거주 지역, 출산 유형, 소득 구간, 이용 기간을 입력하면 정부지원 바우처 적용 후 예상 본인부담금을 계산합니다.",
  order: 0,
  eyebrow: "출산·산후관리",
  category: "calculator",
  iframeReady: false,
  badges: ["산후도우미", "정부지원", "바우처", "2026"],
  previewStats: [
    { label: "표준형 10일", value: "146.4만원", context: "단태아 첫째아 기준" },
    { label: "지원금 예시", value: "100.2만원", context: "150% 이하 표준형 예시" },
  ],
}
```

`order`는 구현 시 기존 마지막 순번 다음 번호로 조정한다.

### 11-2. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/postnatal-care-cost/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. QA 체크리스트

### 데이터

- [ ] 공식표 기반 금액에 `공식` 배지 표시
- [ ] 민간 추가 비용에 `추정` 배지 표시
- [ ] 공식표에 없는 조합을 임의 계산하지 않음
- [ ] 신청 기간/유효기간 안내에 기준 날짜 명시
- [ ] 출처 URL 또는 출처명 표시

### 계산

- [ ] 바우처 적용 시 `총 서비스 가격 - 정부지원금 = 기본 본인부담금`
- [ ] 바우처 미적용 시 정부지원금 0원 처리
- [ ] 지자체 추가 지원금이 최종 부담금에서 차감됨
- [ ] 민간 추가 비용과 이용 시간 추가금이 최종 부담금에 더해짐
- [ ] 최종 부담금이 0원 미만으로 내려가지 않음
- [ ] URL 파라미터 복원 후 동일 결과 표시

### UI

- [ ] 모바일 375px에서 가로 스크롤 없음
- [ ] 결과 카드 금액이 줄바꿈되어도 카드 높이가 과도하게 흔들리지 않음
- [ ] 차트가 모바일/데스크톱 모두 정상 렌더링
- [ ] FAQ accordion 접근성 속성(`aria-expanded`, `hidden`) 적용
- [ ] 결과 해석 문구에 확정 표현 없음

### 등록

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공
- [ ] `dist/tools/postnatal-care-cost/index.html` 생성 확인

---

## 13. 구현 순서

1. `src/data/postnatalCareCost.ts` 생성: 타입, 기준표, FAQ, 관련 CTA 데이터 작성
2. `src/pages/tools/postnatal-care-cost.astro` 생성: Hero, 입력 폼, 결과 영역, 본문, FAQ 구성
3. `public/scripts/postnatal-care-cost.js` 생성: 계산, DOM 업데이트, 차트, URL 상태 저장
4. `src/styles/scss/pages/_postnatal-care-cost.scss` 생성: `pnc-` prefix 스타일 작성
5. `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. `npm run build` 실행
7. 모바일/데스크톱 화면 확인 후 텍스트 overflow와 차트 렌더링 점검

