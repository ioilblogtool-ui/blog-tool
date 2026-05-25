# IT 플랫폼 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/it-platform-bonus-comparison.md`
> 작성일: 2026-05-25
> 구현 대상: `/tools/it-platform-bonus-comparison/`
> 구현 기준: 카카오·네이버·쿠팡·크래프톤·라인플러스·토스의 성과급 구조(현금 PI + RSU + 스톡옵션)를 사용자 입력 연봉 기준으로 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `IT 플랫폼 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `it-platform-bonus-comparison`
- URL: `/tools/it-platform-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- 카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스 6개사 성과급 구조를 같은 화면에서 비교한다.
- 사용자가 연봉을 입력하면 회사별 **예상 현금 PI** 를 즉시 비교한다. RSU·스톡옵션은 구조 해설로 제공한다.
- 반도체·자동차와 다른 IT 플랫폼 보상 구조(현금 PI + 주식 보상 혼합)를 독자가 이해하도록 돕는다.
- 모든 계산 결과에 `시뮬레이션`, `추정` 배지를 반복 노출한다.
- 반도체 성과급 비교 계산기 및 대기업 시뮬레이터와 내부 링크로 연결한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    itPlatformBonus2026.ts
  pages/
    tools/
      it-platform-bonus-comparison.astro

public/
  scripts/
    it-platform-bonus-comparison.js

src/styles/scss/pages/
  _it-platform-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/it-platform-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/bonus-simulator.astro` 하단 내부 링크
- `src/pages/tools/semiconductor-bonus-comparison.astro` 하단 내부 링크
- `public/og/tools/it-platform-bonus-comparison.png`

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "IT 플랫폼 성과급 비교 2026｜카카오·네이버·쿠팡·크래프톤·라인·토스 총보상"
description: "2026년 카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스 성과급 구조와 RSU·스톡옵션 포함 총보상을 비교합니다. 내 연봉 기준 예상 현금 성과급을 즉시 계산해보세요."
canonical: "/tools/it-platform-bonus-comparison/"
ogImage: "/og/tools/it-platform-bonus-comparison.png"
```

### 3-2. 페이지 텍스트

H1:

```text
IT 플랫폼 성과급 비교 2026: 카카오·네이버·쿠팡·크래프톤·라인·토스
```

Hero sub:

```text
현금 성과급만 보면 반쪽입니다. RSU·스톡옵션을 합쳐야 IT 플랫폼의 실제 총보상이 보입니다. 내 연봉 기준 회사별 예상 현금 성과급을 비교하고, 주식 보상 구조와 리스크도 함께 확인해보세요.
```

주요 배지:

- `시뮬레이션`
- `추정`
- `사용자 입력 기준`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| IT 기업 성과급 비교 | H1, hero, title, FAQ |
| 카카오 성과급 | 카카오 섹션 H2, FAQ, description |
| 네이버 성과급 | 네이버 섹션 H2, FAQ |
| 쿠팡 RSU | 쿠팡 섹션, RSU 해설 |
| 크래프톤 성과급 | 크래프톤 섹션, FAQ |
| 토스 스톡옵션 | 토스 섹션, 스톡옵션 해설, FAQ |
| IT 플랫폼 총보상 | 총보상 비교 섹션, OG description |

### 3-4. tools.ts 등록

```ts
{
  slug: "it-platform-bonus-comparison",
  title: "IT 플랫폼 성과급 비교",
  description: "카카오·네이버·쿠팡·크래프톤·라인·토스 성과급 구조와 총보상을 비교합니다.",
  category: "성과급 비교",
  order: 순서,
  badges: ["성과급", "IT", "총보상", "RSU"],
  previewStats: [
    { label: "비교 대상", value: "6개사" },
    { label: "보상 유형", value: "현금·RSU·스옵" },
  ],
}
```

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `itpbc-`
- pageClass: `itpbc-page`
- 계산기 입력(연봉 슬라이더) → 결과(6개사 현금 PI 바 차트 + 카드) 순서로 배치한다.
- 아래에 각사 총보상 구조 해설, RSU·스톡옵션 세금 안내, FAQ 순으로 이어진다.
- 모바일에서 바 차트는 세로 막대 또는 수평 바로 전환한다. 6개사 카드는 단열로 스택한다.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="it-platform-bonus-comparison"
  pageClass="itpbc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero + 핵심 메시지
2. 추정·시뮬레이션 안내 박스
3. 연봉 입력 슬라이더 + 결과 바 차트 (6개사 현금 PI)
4. 결과 카드 (6개사 요약)
5. 6개사 총보상 구조 비교표 (현금 PI / RSU / 스톡옵션 / 상장 여부)
6. 회사별 해설 카드 (6개, 아코디언 또는 섹션)
7. RSU vs 스톡옵션 vs 현금 — 세금·리스크 비교
8. 이직자 체크리스트
9. 관련 계산기 CTA
10. FAQ
11. SeoContent (intro 4단락 + FAQ)

---

## 5. 데이터 모델

파일: `src/data/itPlatformBonus2026.ts`

```ts
export type ITPlatformCompanyId =
  | "naver"
  | "kakao"
  | "coupang"
  | "krafton"
  | "linePlus"
  | "toss";

export type ListingType = "kospi" | "nyse" | "unlisted";

export type CompensationType = "cash_pi" | "rsu" | "stock_option" | "esop" | "signing_bonus";

export type EvidenceBadge = "확정" | "참고" | "추정" | "시뮬레이션";

export interface ITPlatformCompanyConfig {
  id: ITPlatformCompanyId;
  name: string;
  shortName: string;
  listing: ListingType;
  compensationTypes: CompensationType[];

  // 현금 PI 시뮬레이션용 기본값 (연봉 대비 %)
  defaultCashPiPercent: number;    // 기본 표시 예시값 (공식 지급률 아님)
  cashPiPercentRange: { min: number; max: number }; // 알려진 범위 (추정)
  cashPiBadge: EvidenceBadge;

  // 주식 보상 요약
  rsuNote: string;
  stockOptionNote: string;
  equityBadge: EvidenceBadge;

  // 특수 리스크
  keyRisks: string[];
  specialNote: string;  // 상장 형태, 계열사 차이 등

  // 해설 카드 본문 (간략)
  structureSummary: string;
  caution: string;

  // 상세 계산기 링크 (있는 경우)
  detailHref?: string;
  detailCtaLabel?: string;
}

export interface ITPlatformCompensationTypeInfo {
  type: CompensationType;
  label: string;
  taxNote: string;
  riskNote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedCalculator {
  href: string;
  label: string;
  description: string;
}
```

---

## 6. 기준 데이터

파일: `src/data/itPlatformBonus2026.ts`

### 6-1. 회사 데이터

```ts
export const IT_PLATFORM_COMPANIES: ITPlatformCompanyConfig[] = [
  {
    id: "naver",
    name: "네이버",
    shortName: "NAVER",
    listing: "kospi",
    compensationTypes: ["cash_pi", "rsu"],
    defaultCashPiPercent: 15,
    cashPiPercentRange: { min: 5, max: 30 },
    cashPiBadge: "추정",
    rsuNote: "RSU 부여 대상·수량은 직급·평가에 따라 다르며 3~4년 베스팅 구조",
    stockOptionNote: "스톡옵션 부여는 선택적. RSU 중심으로 전환된 구조",
    equityBadge: "참고",
    keyRisks: ["AI 투자 비용 증가에 따른 실적 변동", "주가 연동 RSU 리스크"],
    specialNote: "네이버파이낸셜·웹툰·라인웍스 등 계열사별 보상 구조가 다름. 본사 기준으로 표기",
    structureSummary: "연봉 대비 PI + RSU 병행 구조. 실적 기반 PI는 연 1회 지급이 일반적",
    caution: "계열사·직군·연도·평가 등급에 따라 실제 지급액이 달라질 수 있습니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
  {
    id: "kakao",
    name: "카카오",
    shortName: "카카오",
    listing: "kospi",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 10,
    cashPiPercentRange: { min: 0, max: 25 },
    cashPiBadge: "추정",
    rsuNote: "계열사(카카오뱅크·카카오페이·카카오게임즈 등)에 따라 RSU 부여 여부와 수량이 크게 다름",
    stockOptionNote: "본사 및 일부 계열사에서 스톡옵션 부여 사례 있음",
    equityBadge: "참고",
    keyRisks: ["계열사별 실적 편차 큼", "2022~2023 실적 부진 후 성과급 감소 이력", "카카오페이·카카오뱅크 별도 상장으로 보상 구조 분리"],
    specialNote: "카카오 본사와 카카오뱅크·카카오페이·카카오게임즈 등 계열사 간 보상이 완전히 다름. 이 도구는 카카오 본사 기준",
    structureSummary: "PI 중심 현금 보상 + 계열사별 RSU/스톡옵션 혼합. 실적 부진 시 PI 지급 규모 크게 변동",
    caution: "카카오 계열사에 재직 중인 경우 본사 기준값과 실제 지급액이 크게 다를 수 있습니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
  {
    id: "coupang",
    name: "쿠팡",
    shortName: "쿠팡",
    listing: "nyse",
    compensationTypes: ["cash_pi", "rsu", "signing_bonus"],
    defaultCashPiPercent: 8,
    cashPiPercentRange: { min: 0, max: 15 },
    cashPiBadge: "추정",
    rsuNote: "RSU가 총보상의 핵심. 입사 시 부여 + 매년 추가 부여. NYSE 주가 연동으로 원화 가치 변동",
    stockOptionNote: "스톡옵션 방식보다 RSU 방식 채택",
    equityBadge: "추정",
    keyRisks: ["NYSE 상장으로 주가·환율 이중 리스크", "RSU 베스팅 전 이직 시 미수령", "한국 세법상 RSU 과세 시점 복잡"],
    specialNote: "미국 NYSE 상장사(CPNG). SEC Form 20-F 공시 기반. 쿠팡이츠·쿠팡플레이 등 사업부별 차이 가능",
    structureSummary: "현금 연봉 + RSU 중심 총보상 설계. RSU 가치는 주가와 환율에 따라 크게 달라짐",
    caution: "RSU는 주가 연동으로 실제 수령 시점 가치가 부여 시점과 다를 수 있습니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
  {
    id: "krafton",
    name: "크래프톤",
    shortName: "크래프톤",
    listing: "kospi",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 20,
    cashPiPercentRange: { min: 5, max: 50 },
    cashPiBadge: "추정",
    rsuNote: "RSU 부여 사례 있음. 직급·평가 연동",
    stockOptionNote: "개발 핵심 인재 중심 스톡옵션 부여 사례",
    equityBadge: "추정",
    keyRisks: ["배틀그라운드 IP 집중 리스크", "게임 글로벌 매출 변동성 큼", "신작 성공 여부에 따른 성과급 변동"],
    specialNote: "게임 실적 연동 PI 구조. 배틀그라운드 글로벌 매출이 호조일 때 높은 성과급 지급 이력",
    structureSummary: "게임 IP 실적 연동 PI + RSU/스톡옵션. 호황기와 불황기 성과급 편차가 상대적으로 큼",
    caution: "게임 실적·신작 성과에 따라 지급액이 연도별로 크게 다를 수 있습니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
  {
    id: "linePlus",
    name: "라인플러스",
    shortName: "라인플러스",
    listing: "unlisted",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 12,
    cashPiPercentRange: { min: 5, max: 20 },
    cashPiBadge: "추정",
    rsuNote: "일본 LY Corp(구 라인야후) 주식 연동 RSU. 엔/원 환율 영향",
    stockOptionNote: "LY Corp 스톡옵션 부여 사례",
    equityBadge: "추정",
    keyRisks: ["일본 LY Corp 실적·정책 변화에 따른 보상 구조 변동", "엔/원 환율 리스크", "한국·일본 교차 인사 정책 불확실성"],
    specialNote: "LY Corp(구 라인야후) 100% 자회사. 비상장이나 모회사 주식 기반 보상. 재직자 후기 기반 추정값",
    structureSummary: "일본 본사 정책 연동 PI + LY Corp 주식 보상. 글로벌 조직이므로 한국 법인 기준 적용 범위 확인 필요",
    caution: "일본 본사 정책 변화, 조직 개편, 환율에 따라 실제 보상이 달라질 수 있습니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
  {
    id: "toss",
    name: "토스(비바리퍼블리카)",
    shortName: "토스",
    listing: "unlisted",
    compensationTypes: ["cash_pi", "esop"],
    defaultCashPiPercent: 8,
    cashPiPercentRange: { min: 0, max: 15 },
    cashPiBadge: "추정",
    rsuNote: "RSU 방식 미채택. ESOP(스톡옵션) 중심 보상",
    stockOptionNote: "ESOP이 총보상의 핵심. 비상장 상태에서 행사 창구 제한적",
    equityBadge: "추정",
    keyRisks: ["비상장 스톡옵션은 IPO·M&A 전까지 유동화 불가", "행사 시 과세 방식 복잡", "상장 일정 불확실"],
    specialNote: "비상장사. 현금 성과급보다 ESOP이 핵심 보상. 상장 시 스톡옵션 가치 실현 가능하나 시점 불확실",
    structureSummary: "현금 보너스(소규모) + ESOP(스톡옵션) 중심 설계. 상장 기대감이 보상 전략과 연결",
    caution: "스톡옵션은 IPO 또는 M&A 전까지 현금화가 어려우며 행사 조건·세금이 복잡합니다.",
    detailHref: undefined,
    detailCtaLabel: undefined,
  },
];
```

### 6-2. 보상 유형별 세금·리스크 정보

```ts
export const COMPENSATION_TYPE_INFO: ITPlatformCompensationTypeInfo[] = [
  {
    type: "cash_pi",
    label: "현금 성과급 (PI)",
    taxNote: "지급 시점에 근로소득으로 과세. 연봉과 합산되어 과세표준 상승 가능",
    riskNote: "즉시 수령 가능. 실적 부진 시 지급 규모 감소",
  },
  {
    type: "rsu",
    label: "RSU (양도제한조건부주식)",
    taxNote: "베스팅 시점 시가 기준 근로소득 과세. 이후 매도 시 양도소득세 별도",
    riskNote: "주가 하락 시 베스팅 시점 가치 감소. 베스팅 전 이직 시 미수령",
  },
  {
    type: "stock_option",
    label: "스톡옵션",
    taxNote: "행사 시 (시가 - 행사가) 차액에 근로소득 또는 기타소득 과세 (비상장 여부 따라 다름)",
    riskNote: "행사가 > 시가 시 행사 의미 없음. 비상장사는 유동화 창구 제한",
  },
  {
    type: "esop",
    label: "ESOP (스톡옵션, 비상장)",
    taxNote: "행사 시점 (공정가치 - 행사가) 차액이 근로소득으로 과세. 비상장 공정가치 산정 방식 별도",
    riskNote: "IPO·M&A 전 현금화 불가. 상장 여부·시점 불확실",
  },
  {
    type: "signing_bonus",
    label: "사이닝 보너스",
    taxNote: "지급 시 근로소득 과세. 중도 퇴사 시 반환 조건이 있는 경우 있음",
    riskNote: "반환 조건 계약 반드시 확인 필요",
  },
];
```

### 6-3. 세후 추정 구간

```ts
export const ITPBC_TAX_RATE_BRACKETS = [
  { minAnnualSalary: 0,           maxAnnualSalary: 50_000_000,  estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001,  maxAnnualSalary: 80_000_000,  estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001,  maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null,         estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

### 6-4. FAQ 데이터

```ts
export const ITPBC_FAQS: FaqItem[] = [
  {
    question: "IT 플랫폼 성과급은 반도체보다 적은가요?",
    answer: "현금 PI만 보면 반도체 대기업 대비 적을 수 있지만, RSU·스톡옵션을 포함한 총보상(Total Compensation)은 회사, 직군, 직급, 경력에 따라 크게 달라집니다. 단순 현금 비교만으로는 판단하기 어렵습니다.",
  },
  {
    question: "카카오와 네이버 중 성과급이 더 많은 곳은 어디인가요?",
    answer: "카카오는 계열사(카카오뱅크·카카오페이 등)에 따라 편차가 크고, 네이버는 본사 기준 RSU 비중이 높습니다. 연도별 실적 차이도 크므로 단순 비교보다 직군·계열사·RSU 포함 여부를 함께 봐야 합니다.",
  },
  {
    question: "쿠팡 RSU는 믿을 수 있는 보상인가요?",
    answer: "NYSE에 상장된 주식 기반이므로 주가와 원/달러 환율에 따라 베스팅 시점 가치가 달라집니다. 또한 베스팅 기간(보통 4년) 전 이직하면 미수령분은 포기하게 됩니다.",
  },
  {
    question: "토스 스톡옵션은 실제로 수령할 수 있나요?",
    answer: "토스(비바리퍼블리카)는 비상장사로, 스톡옵션은 IPO 또는 M&A 등 유동성 창구가 열릴 때 행사 가능합니다. 상장 전에는 현금화가 어렵고, 행사 시 세금 구조도 복잡합니다.",
  },
  {
    question: "RSU를 받으면 세금은 어떻게 내나요?",
    answer: "RSU는 베스팅(권리 확정) 시점에 시가 기준으로 근로소득세가 부과됩니다. 이후 주식을 매도할 때는 추가로 양도소득세가 발생할 수 있습니다. 베스팅 시점 주가가 높을수록 세금 부담도 커집니다.",
  },
  {
    question: "이직할 때 RSU를 포기하면 얼마나 손해인가요?",
    answer: "미베스팅 RSU의 잔여 가치(잔여 수량 × 현재 주가)를 이직 패키지와 비교해야 합니다. 특히 클리프(최초 베스팅 시점, 보통 1년) 직전 이직은 전체를 포기하는 것이므로 타이밍에 주의가 필요합니다.",
  },
  {
    question: "크래프톤 성과급은 게임 성적에 따라 달라지나요?",
    answer: "배틀그라운드 등 주요 IP의 글로벌 매출 실적이 PI에 반영되는 구조로 알려져 있습니다. 신작 성과나 글로벌 운영 실적에 따라 연도별 지급 규모가 달라질 수 있습니다.",
  },
  {
    question: "이 계산기 결과를 실제 연봉 협상에 써도 되나요?",
    answer: "이 계산기의 결과는 추정·시뮬레이션 기준이며 공식 지급 데이터가 아닙니다. 실제 협상에는 회사별 공식 채용 안내, 재직자 커뮤니티 후기, 최근 공시 등을 함께 참고하시길 권장합니다.",
  },
];
```

### 6-5. 관련 계산기

```ts
export const ITPBC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/bonus-simulator/",
    label: "대기업 성과급 시뮬레이터",
    description: "삼성전자·SK하이닉스·현대차와 함께 비교",
  },
  {
    href: "/tools/semiconductor-bonus-comparison/",
    label: "반도체 성과급 비교",
    description: "삼성전자·SK하이닉스·DB하이텍 비교",
  },
  {
    href: "/tools/samsung-bonus/",
    label: "삼성전자 성과급 계산기",
    description: "DS·DX 사업부별 OPI·TAI 계산",
  },
  {
    href: "/tools/sk-hynix-bonus/",
    label: "SK하이닉스 성과급 계산기",
    description: "PS·PI 세전·세후 계산",
  },
];
```

### 6-6. SeoContent 텍스트

```ts
export const ITPBC_SEO_INTRO = [
  "IT 플랫폼 기업의 성과급은 반도체·자동차 대기업과 구조가 다르다. 카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스는 현금 성과급(PI) 외에 RSU(양도제한조건부주식)·스톡옵션·ESOP을 혼합해 총보상(Total Compensation)을 설계한다. 단순히 현금 성과급 숫자만 비교하면 회사 간 실제 보상 차이를 파악하기 어렵다.",
  "현금 PI는 지급 시점에 바로 수령하지만, RSU는 베스팅 일정에 따라 수년에 걸쳐 확정된다. 스톡옵션은 행사 시점의 주가가 행사가를 초과해야 가치가 생긴다. 또한 쿠팡은 NYSE 상장사라 주가·환율 이중 리스크가 있고, 토스는 비상장이라 ESOP을 IPO 전까지 현금화할 수 없다. 상장 여부가 보상 설계의 핵심 변수 중 하나다.",
  "이 도구는 사용자가 입력한 연봉을 기준으로 6개사 예상 현금 PI를 비교하는 시뮬레이션을 제공한다. 카카오(계열사 편차), 라인플러스(일본 본사 연동) 등 특수 변수도 해설로 안내한다. 결과는 재직자 커뮤니티·채용공고·공시 기반 추정값이며 회사·직군·연도에 따라 실제 지급액이 달라질 수 있다.",
  "IT 플랫폼 성과급을 판단할 때는 현금 PI 규모만이 아니라 RSU 베스팅 조건, 스톡옵션 행사 가능 시점, 이직 시 포기 비용을 함께 고려해야 한다. 이 도구의 계산 결과는 참고용 시뮬레이션이며 공식 지급 데이터가 아니다. 실제 연봉 협상 시에는 채용 담당자에게 패키지 구성을 직접 확인하길 권장한다.",
];

export const ITPBC_INPUT_POINTS = [
  "현재 연봉을 입력하면 6개사 예상 현금 PI를 즉시 비교합니다",
  "RSU·스톡옵션 구조는 회사별 해설 카드에서 확인할 수 있습니다",
  "보상 유형별(현금·RSU·스옵) 세금과 리스크를 함께 안내합니다",
];

export const ITPBC_CRITERIA = [
  "현금 PI 추정값: 재직자 커뮤니티·채용공고·공시 기반 추정 (시뮬레이션)",
  "RSU·스톡옵션 구조: 사업보고서·SEC Filing·언론 보도 기반 (참고)",
  "세후 추정: 간편 구간 공제율 적용 (개인별 실제 세금과 다를 수 있음)",
];
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/it-platform-bonus-comparison.js`

### 7-1. DOM 계약

루트:

```html
<section data-itpbc-calculator>
```

입력:

```html
<input type="range" data-itpbc-salary-slider />
<input type="number" data-itpbc-salary-input />
```

출력 (KPI):

```html
<output data-itpbc-best-company></output>
<output data-itpbc-best-cash-pi></output>
<output data-itpbc-cash-pi-range></output>
```

출력 (바 차트):

```html
<div data-itpbc-bar-chart></div>
```

출력 (카드):

```html
<div data-itpbc-result-cards></div>
```

### 7-2. 상태

```js
const state = {
  annualSalary: 80_000_000,  // 기본: 8천만 원
};
```

### 7-3. 계산 함수

```js
function getEstimatedTaxRate(annualSalary) {
  // ITPBC_TAX_RATE_BRACKETS 기준
  const bracket = BRACKETS.find(
    (b) => annualSalary >= b.minAnnualSalary && (b.maxAnnualSalary === null || annualSalary <= b.maxAnnualSalary)
  );
  return bracket ? bracket.estimatedDeductionRate : 0.24;
}

function calculateCompanyResult(company, annualSalary) {
  const taxRate = getEstimatedTaxRate(annualSalary);
  const grossCashPi = annualSalary * (company.defaultCashPiPercent / 100);
  const netCashPi = grossCashPi * (1 - taxRate);
  return {
    companyId: company.id,
    name: company.name,
    grossCashPi,
    netCashPi,
    piPercent: company.defaultCashPiPercent,
    piRange: company.cashPiPercentRange,
    badge: company.cashPiBadge,
  };
}

function renderBarChart(results) {
  // results를 grossCashPi 내림차순으로 정렬
  // 각 회사를 가로 바로 렌더링
  // 최고값 회사에 itpbc-bar--best 클래스 부여
}

function renderResultCards(results) {
  // 회사별 카드: 회사명, 예상 현금 PI (세전/세후), 주식 보상 요약, 배지
}

function update() {
  const results = IT_PLATFORM_COMPANIES.map((c) => calculateCompanyResult(c, state.annualSalary));
  renderBarChart(results);
  renderResultCards(results);
  updateKpi(results);
}
```

### 7-4. 슬라이더 연동

```js
// 슬라이더 범위: 3,000만 ~ 3억 (step: 100만)
// 슬라이더 변경 시 number input도 연동
// number input 직접 수정 시 슬라이더도 연동
// 연봉 포맷: toLocaleString('ko-KR') + "원"

salarySlider.addEventListener('input', () => {
  state.annualSalary = Number(salarySlider.value);
  salaryInput.value = formatKRW(state.annualSalary);
  update();
});

salaryInput.addEventListener('change', () => {
  const val = parseKRW(salaryInput.value);
  state.annualSalary = clamp(val, 30_000_000, 300_000_000);
  salarySlider.value = state.annualSalary;
  update();
});
```

### 7-5. URL 파라미터 동기화

```js
// 초기 로드: ?salary=80000000 파라미터로 슬라이더 초기화
// 슬라이더 변경 시 URL 파라미터 업데이트 (replaceState)
```

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/it-platform-bonus-comparison.astro`

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import SeoContent from '../../components/SeoContent.astro';
import {
  IT_PLATFORM_COMPANIES,
  COMPENSATION_TYPE_INFO,
  ITPBC_FAQS,
  ITPBC_RELATED_CALCULATORS,
  ITPBC_SEO_INTRO,
  ITPBC_INPUT_POINTS,
  ITPBC_CRITERIA,
} from '../../data/itPlatformBonus2026';
---

<SimpleToolShell
  calculatorId="it-platform-bonus-comparison"
  pageClass="itpbc-page"
  title="IT 플랫폼 성과급 비교 2026: 카카오·네이버·쿠팡·크래프톤·라인·토스"
  description="..."
  canonical="/tools/it-platform-bonus-comparison/"
>

  <!-- 1. 추정·시뮬레이션 안내 -->
  <div class="itpbc-notice">
    이 계산기의 결과는 재직자 커뮤니티·공시·채용공고 기반 추정값입니다.
    실제 지급액은 회사, 계열사, 직군, 직급, 평가 등에 따라 달라질 수 있습니다.
  </div>

  <!-- 2. 연봉 입력 -->
  <section class="itpbc-input-section" data-itpbc-calculator>
    <div class="itpbc-salary-input">
      <label>현재 연봉</label>
      <input type="range" data-itpbc-salary-slider min="30000000" max="300000000" step="1000000" value="80000000" />
      <input type="number" data-itpbc-salary-input value="80000000" />
    </div>

    <!-- 3. 바 차트 결과 -->
    <div class="itpbc-bar-chart" data-itpbc-bar-chart></div>

    <!-- 4. KPI 카드 -->
    <div class="itpbc-kpi-grid">
      <div class="itpbc-kpi">
        <span>현금 PI 최고</span>
        <output data-itpbc-best-company></output>
      </div>
      <div class="itpbc-kpi">
        <span>예상 세전 PI</span>
        <output data-itpbc-best-cash-pi></output>
      </div>
    </div>

    <!-- 5. 결과 카드 (6개사) -->
    <div class="itpbc-result-cards" data-itpbc-result-cards></div>
  </section>

  <!-- 6. 6개사 총보상 구조 비교표 -->
  <section class="itpbc-structure-table">
    <h2>6개사 총보상 구조 비교</h2>
    <table>
      <thead>
        <tr>
          <th>회사</th>
          <th>상장</th>
          <th>현금 PI</th>
          <th>RSU</th>
          <th>스톡옵션</th>
          <th>특이사항</th>
        </tr>
      </thead>
      <tbody>
        {IT_PLATFORM_COMPANIES.map((c) => (
          <tr>
            <td>{c.name}</td>
            <td>{c.listing}</td>
            <td>✓</td>
            <td>{c.compensationTypes.includes('rsu') ? '✓' : '-'}</td>
            <td>{(c.compensationTypes.includes('stock_option') || c.compensationTypes.includes('esop')) ? '✓' : '-'}</td>
            <td class="itpbc-special">{c.specialNote}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p class="itpbc-badge-note">※ 모든 항목 추정·참고 기준. 실제 부여 여부는 회사·직급·연도에 따라 다름</p>
  </section>

  <!-- 7. 회사별 해설 카드 -->
  <section class="itpbc-company-cards">
    <h2>회사별 보상 구조 해설</h2>
    {IT_PLATFORM_COMPANIES.map((c) => (
      <div class="itpbc-company-card">
        <h3>{c.name}</h3>
        <p>{c.structureSummary}</p>
        <ul>
          {c.keyRisks.map((r) => <li>{r}</li>)}
        </ul>
        <p class="itpbc-caution">{c.caution}</p>
      </div>
    ))}
  </section>

  <!-- 8. RSU·스톡옵션·현금 세금 비교 -->
  <section class="itpbc-tax-guide">
    <h2>보상 유형별 세금과 리스크</h2>
    {COMPENSATION_TYPE_INFO.map((info) => (
      <div class="itpbc-tax-row">
        <strong>{info.label}</strong>
        <p>세금: {info.taxNote}</p>
        <p>리스크: {info.riskNote}</p>
      </div>
    ))}
  </section>

  <!-- 9. 이직자 체크리스트 -->
  <section class="itpbc-checklist">
    <h2>IT 플랫폼 이직 시 보상 체크리스트</h2>
    <ul>
      <li>현금 연봉(Base)과 총보상(TC)을 구분해 확인했는가?</li>
      <li>RSU 클리프(최초 베스팅 시점)와 베스팅 일정을 확인했는가?</li>
      <li>현재 회사의 미베스팅 RSU 포기 금액을 계산했는가?</li>
      <li>스톡옵션이 비상장 기반이라면 유동화 창구를 확인했는가?</li>
      <li>쿠팡 RSU는 주가·환율 리스크를 인지했는가?</li>
      <li>카카오 계열사인지 본사인지 구분해 보상 조건을 확인했는가?</li>
    </ul>
  </section>

  <!-- 10. 관련 계산기 CTA -->
  <section class="itpbc-related">
    <h2>관련 계산기</h2>
    {ITPBC_RELATED_CALCULATORS.map((r) => (
      <a href={r.href} class="itpbc-related-card">
        <strong>{r.label}</strong>
        <span>{r.description}</span>
      </a>
    ))}
  </section>

  <!-- 11. SeoContent -->
  <SeoContent
    introTitle="IT 플랫폼 성과급, 현금만 보면 안 되는 이유"
    intro={ITPBC_SEO_INTRO}
    inputPoints={ITPBC_INPUT_POINTS}
    criteria={ITPBC_CRITERIA}
    faq={ITPBC_FAQS}
    related={ITPBC_RELATED_CALCULATORS}
  />

</SimpleToolShell>

<script src="/scripts/it-platform-bonus-comparison.js" defer></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_it-platform-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `itpbc-` prefix를 사용한다.

```text
itpbc-page
itpbc-notice
itpbc-input-section
itpbc-salary-input
itpbc-bar-chart
itpbc-bar
itpbc-bar--best
itpbc-kpi-grid
itpbc-kpi
itpbc-result-cards
itpbc-result-card
itpbc-result-card--best
itpbc-structure-table
itpbc-company-cards
itpbc-company-card
itpbc-tax-guide
itpbc-tax-row
itpbc-checklist
itpbc-related
itpbc-related-card
itpbc-badge-note
itpbc-caution
itpbc-special
```

### 9-2. 바 차트 스타일 방향

```scss
.itpbc-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.itpbc-bar-row {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: center;
  gap: 8px;
}

.itpbc-bar-track {
  background: var(--color-surface-2);
  border-radius: 4px;
  height: 24px;
  overflow: hidden;
}

.itpbc-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.itpbc-bar-row--best .itpbc-bar-fill {
  background: var(--color-accent);
}
```

### 9-3. 반응형 기준

- Desktop: 입력 패널과 바 차트를 나란히 (1fr + 2fr) 또는 세로 배치 선택
- Tablet: 단열 배치, 바 차트 full-width
- Mobile: 바 차트 수평 바 유지, 회사 카드 단열 스택

```scss
.itpbc-structure-table {
  overflow-x: auto;   // 모바일에서 가로 스크롤
  -webkit-overflow-scrolling: touch;
}
```

### 9-4. 색상 방향

- 기본 토큰 사용 (`--color-primary`, `--color-surface-2`)
- 회사 색상을 강하게 쓰지 않는다 (특정 회사 편애 인상 방지)
- `추정`·`시뮬레이션` 배지: `--color-warning` 계열 차분한 색
- `참고` 배지: `--color-info` 계열
- 최고 결과 하이라이트: `--color-accent` 계열

---

## 10. 접근성·사용성 기준

- 슬라이더는 `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` 포함
- 숫자 input은 `type="number"` + `inputmode="numeric"` (모바일 숫자 키패드)
- 바 차트는 CSS 기반으로 JS 없이도 기본 레이아웃이 유지됨
- 결과 카드에 `role="region"` + `aria-label` 부여
- 배지는 색상만이 아닌 텍스트로 의미 전달
- 모바일에서 회사 카드 터치 영역 최소 44px 확보

---

## 11. 안전 문구

상단 안내 박스:

```text
이 계산기는 재직자 커뮤니티·공시·채용공고 기반의 추정값을 사용한 비교용 시뮬레이션입니다.
실제 성과급은 회사, 계열사, 직군, 직급, 연도, 개인 평가에 따라 크게 달라질 수 있습니다.
```

결과 카드 하단:

```text
예상 세후 금액은 간편 구간 공제율을 적용한 추정값입니다. 실제 통장 입금액은 지급 시점 연봉, 부양가족, 비과세 항목, 연말정산 결과에 따라 달라집니다.
```

RSU·스톡옵션 섹션:

```text
RSU와 스톡옵션의 실제 가치는 주가, 환율, 베스팅 완료 시점, 이직 여부, 세금 처리 방식에 따라 달라집니다. 이 페이지에서 제공하는 수치는 참고용 안내이며 투자 또는 재무 조언이 아닙니다.
```

---

## 12. 내부 링크 설계

### 12-1. 페이지 내부 CTA

| 위치 | CTA 문구 | 이동 경로 |
| --- | --- | --- |
| 결과 하단 | 대기업 성과급 전체 비교 | `/tools/bonus-simulator/` |
| 결과 하단 | 반도체 성과급 비교 | `/tools/semiconductor-bonus-comparison/` |
| 삼성전자 언급 시 | 삼성전자 성과급 상세 계산 | `/tools/samsung-bonus/` |
| SK하이닉스 언급 시 | SK하이닉스 성과급 상세 계산 | `/tools/sk-hynix-bonus/` |
| 리포트 링크 | IT vs 반도체 성과급 비교 리포트 | `/reports/corporate-bonus-comparison-2026/` |

### 12-2. 역링크 추가 대상 (기존 페이지)

`/tools/bonus-simulator/` 하단:

```text
IT 플랫폼(카카오·네이버·쿠팡 등) 성과급도 비교해보세요.
```

`/tools/semiconductor-bonus-comparison/` 하단:

```text
IT 플랫폼 성과급(RSU·스톡옵션 포함)을 반도체와 비교해보세요.
```

---

## 13. QA 체크리스트

- [ ] 연봉 슬라이더 변경 시 바 차트와 카드가 즉시 갱신된다
- [ ] 모든 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다
- [ ] 6개사 바 차트가 모바일에서 겹치지 않는다
- [ ] 회사 구조 비교표가 모바일에서 가로 스크롤로 확인 가능하다
- [ ] RSU·스톡옵션 섹션에 리스크 안내 문구가 포함되어 있다
- [ ] 쿠팡 카드에 "NYSE 상장, 주가·환율 이중 리스크" 안내가 있다
- [ ] 토스 카드에 "비상장, IPO 전 유동화 불가" 안내가 있다
- [ ] 카카오 카드에 "계열사별 편차 큼" 안내가 있다
- [ ] 관련 계산기 4개 링크가 모두 정상 이동한다
- [ ] FAQ 8개가 모두 표시된다
- [ ] URL 파라미터(`?salary=80000000`)로 슬라이더 초기값이 복원된다
- [ ] `npm run build`가 성공한다
- [ ] SeoContent intro 4단락 각 150자 이상 충족한다

---

## 14. 구현 순서

1. `src/data/itPlatformBonus2026.ts` — 타입, 회사 데이터, FAQ, 관련 링크, SEO 텍스트 생성
2. `src/pages/tools/it-platform-bonus-comparison.astro` — 정적 구조 구현 (바 차트 초기 상태, 비교표, 해설 카드)
3. `public/scripts/it-platform-bonus-comparison.js` — 슬라이더 연동, 바 차트 렌더링, URL 파라미터 동기화
4. `src/styles/scss/pages/_it-platform-bonus-comparison.scss` — 바 차트, 카드, 비교표 스타일
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` URL 추가
8. `/tools/bonus-simulator/`, `/tools/semiconductor-bonus-comparison/` 역링크 추가
9. 모바일 UI 확인 (바 차트 가로 스크롤, 카드 스택)
10. `npm run build` 확인
