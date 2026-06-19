# 인터넷 TV 약정 해지 위약금 계산기 — 설계 문서

> 기획 원본: `docs/plan/202606/internet-tv-contract-cancellation-penalty-calculator-plan.md`  
> 작성일: 2026-06-19  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `internet-tv-cancellation-penalty`  
> prefix: `itcp-`

---

## 1. 개요

- **유형**: 계산기 + 해설형 가이드
- **URL**: `/tools/internet-tv-cancellation-penalty/`
- **핵심 검색어**:
  - `인터넷 해지 위약금`
  - `TV 약정 위약금`
  - `인터넷 약정 위약금 계산기`
  - `통신사 갈아타기`
  - `인터넷 갈아타기 사은품`
- **핵심 결과**:
  - 총 예상 위약금
  - 위약금 구성 breakdown
  - 사은품 반환 위험
  - 통신사 갈아타기 순손익
  - 손익분기 개월
- **신뢰성 원칙**:
  - 통신사 공식 청구 위약금처럼 표현하지 않는다.
  - 모든 결과 카드에 `예상`, `공식 청구액 아님`, `고객센터 확인 필요` 맥락을 붙인다.
  - 통신사별 약관 차이는 정확 산식 재현이 아니라 입력값 기반 시뮬레이션으로 처리한다.

---

## 2. 파일 구조

```text
src/data/internetTvCancellationPenalty.ts
src/pages/tools/internet-tv-cancellation-penalty.astro
public/scripts/internet-tv-cancellation-penalty.js
src/styles/scss/pages/_internet-tv-cancellation-penalty.scss
```

등록 위치:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`
- `src/pages/index.astro`
- `src/data/compareHub.ts`

---

## 3. 데이터 파일 설계 (`src/data/internetTvCancellationPenalty.ts`)

### 3.1 타입

```ts
export type InternetTvProductType = "internetOnly" | "internetTv" | "internetTvPhone";
export type GiftReturnMode = "fullBeforeThreshold" | "prorated" | "none";
export type PenaltyResultStatus = "goodToSwitch" | "checkAgain" | "likelyLoss" | "contractEnded";

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
}

export interface PenaltyInput {
  productType: InternetTvProductType;
  contractMonths: number;
  usedMonths: number;
  monthlyFee: number;
  monthlyDiscount: number;
  deviceDiscount: number;
  signupGift: number;
  giftReturnThresholdMonths: number;
  giftReturnMode: GiftReturnMode;
  installFeeReturn: number;
  deviceNonReturnFee: number;
  bundleDiscountLossMonthly: number;
  newMonthlyFee: number;
  newSignupGift: number;
  newInstallFee: number;
  forfeitedRetentionBenefit: number;
}

export interface PenaltyPreset {
  id: string;
  label: string;
  description: string;
  input: PenaltyInput;
}

export interface PenaltyBreakdown {
  returnRate: number;
  contractDiscountReturn: number;
  deviceDiscountReturn: number;
  giftReturn: number;
  installFeeReturn: number;
  deviceNonReturnFee: number;
  totalPenalty: number;
}

export interface SwitchProfitResult {
  remainingMonths: number;
  monthlySaving: number;
  remainingTermSaving: number;
  immediateNetProfit: number;
  totalSwitchProfit: number;
  breakEvenMonths: number | null;
  status: PenaltyResultStatus;
  headline: string;
  advice: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

### 3.2 메타

```ts
export const ITCP_META = {
  slug: "internet-tv-cancellation-penalty",
  title: "인터넷 TV 약정 해지 위약금 계산기",
  seoTitle: "인터넷 TV 약정 해지 위약금 계산기｜갈아타기 전에 손해인지 확인",
  description:
    "약정기간, 사용개월, 월요금, 할인액, 사은품을 입력해 인터넷·IPTV 해지 예상 위약금과 통신사 갈아타기 손익분기점을 계산합니다.",
  updatedAt: "2026-06-19",
  dataNote:
    "통신사 공식 청구 위약금이 아니라 입력값 기반 예상 계산입니다. 실제 위약금은 가입 통신사 고객센터와 약정서에서 확인해야 합니다.",
};
```

### 3.3 옵션 상수

```ts
export const ITCP_PRODUCT_OPTIONS: SelectOption<InternetTvProductType>[] = [
  { value: "internetOnly", label: "인터넷만", description: "인터넷 단독 약정" },
  { value: "internetTv", label: "인터넷+TV", description: "IPTV와 결합된 일반적인 가정 상품" },
  { value: "internetTvPhone", label: "인터넷+TV+전화", description: "전화까지 묶인 결합상품" },
];

export const ITCP_CONTRACT_MONTH_OPTIONS: SelectOption<number>[] = [
  { value: 12, label: "1년" },
  { value: 24, label: "2년" },
  { value: 36, label: "3년" },
];

export const ITCP_GIFT_RETURN_MODE_OPTIONS: SelectOption<GiftReturnMode>[] = [
  { value: "fullBeforeThreshold", label: "기준개월 전 전액 반환" },
  { value: "prorated", label: "잔여기간 비례 반환" },
  { value: "none", label: "반환 없음" },
];
```

### 3.4 기본값과 프리셋

```ts
export const ITCP_DEFAULT_INPUT: PenaltyInput = {
  productType: "internetTv",
  contractMonths: 36,
  usedMonths: 18,
  monthlyFee: 44000,
  monthlyDiscount: 13200,
  deviceDiscount: 4400,
  signupGift: 450000,
  giftReturnThresholdMonths: 12,
  giftReturnMode: "fullBeforeThreshold",
  installFeeReturn: 0,
  deviceNonReturnFee: 0,
  bundleDiscountLossMonthly: 0,
  newMonthlyFee: 39000,
  newSignupGift: 470000,
  newInstallFee: 36300,
  forfeitedRetentionBenefit: 0,
};

export const ITCP_PRESETS: PenaltyPreset[] = [
  {
    id: "middle-contract",
    label: "3년 약정 절반 사용",
    description: "약정 18개월 사용 후 갈아타기 사은품을 비교하는 기본 예시입니다.",
    input: ITCP_DEFAULT_INPUT,
  },
  {
    id: "early-cancel",
    label: "가입 6개월 이내",
    description: "사은품 반환 위험이 큰 초반 해지 예시입니다.",
    input: {
      ...ITCP_DEFAULT_INPUT,
      usedMonths: 6,
      newSignupGift: 500000,
    },
  },
  {
    id: "near-end",
    label: "약정 6개월 남음",
    description: "만료까지 기다리는 선택과 비교하기 좋은 예시입니다.",
    input: {
      ...ITCP_DEFAULT_INPUT,
      usedMonths: 30,
      signupGift: 450000,
      newSignupGift: 350000,
    },
  },
];
```

### 3.5 FAQ와 관련 링크

```ts
export const ITCP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/compare/",
    label: "비교표 전체 보기",
    description: "통신비 외에도 생활비, 세금, 구독료 계산기를 한곳에서 확인합니다.",
  },
  {
    href: "/tools/ai-subscription-cost/",
    label: "AI 구독료 비교 계산기",
    description: "월 구독료와 연간 비용을 함께 점검합니다.",
  },
  {
    href: "/reports/single-household-living-cost-2026/",
    label: "1인 가구 생활비 분석",
    description: "월 고정비와 생활비 구조를 함께 확인합니다.",
  },
];

export const ITCP_FAQ: FaqItem[] = [
  {
    question: "인터넷 해지 위약금은 이 계산기 결과와 똑같이 나오나요?",
    answer:
      "아닙니다. 이 계산기는 입력값 기반 예상 계산입니다. 실제 위약금은 통신사, 가입 시점, 약정서, 결합할인, 장비 반납 여부에 따라 달라지므로 통신사 앱이나 고객센터에서 최종 금액을 확인해야 합니다.",
  },
  {
    question: "인터넷 사은품은 언제 반환해야 하나요?",
    answer:
      "사은품 반환 조건은 가입 채널과 계약 조건에 따라 다릅니다. 이 계산기는 기본적으로 반환 기준개월 이전 해지 시 사은품 반환 위험이 있는 것으로 계산하지만, 실제 반환 여부는 가입 당시 안내받은 조건을 확인해야 합니다.",
  },
  {
    question: "약정기간이 끝났으면 위약금이 없나요?",
    answer:
      "약정 할인반환금은 보통 약정 만료 이후 부담이 크게 줄거나 없어집니다. 다만 장비 미반납비, 미납요금, 별도 프로모션 반환 조건은 남아 있을 수 있어 최종 확인이 필요합니다.",
  },
  {
    question: "통신사 갈아타기는 사은품이 크면 무조건 이득인가요?",
    answer:
      "아닙니다. 기존 위약금, 신규 설치비, 월요금 차이, 결합할인 손실, 재약정 혜택 포기액까지 함께 봐야 합니다. 이 계산기는 이 항목을 합쳐 순손익과 손익분기점을 보여줍니다.",
  },
  {
    question: "이사할 때는 해지와 이전 설치 중 무엇이 유리한가요?",
    answer:
      "이전 설치가 가능하고 위약금이 크다면 유지가 유리할 수 있습니다. 반대로 신규 통신사 사은품과 월요금 절감액이 위약금보다 크면 갈아타기를 검토할 수 있습니다.",
  },
];
```

---

## 4. 계산 함수 설계

데이터 파일에서 순수 함수로 export하고, 클라이언트 JS에도 같은 로직을 복제한다. Astro 페이지는 초기 렌더용 기본 결과를 계산하고, 클라이언트 스크립트는 입력 변경과 URL query 복원을 담당한다.

```ts
export const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

export const getReturnRate = (usedMonths: number, contractMonths: number) => {
  if (usedMonths >= contractMonths) return 0;
  if (contractMonths <= 0) return 0;

  const progress = usedMonths / contractMonths;
  if (progress < 0.25) return 1;
  if (progress < 0.5) return 0.7;
  if (progress < 0.75) return 0.45;
  return 0.2;
};

export const calculateGiftReturn = (input: PenaltyInput) => {
  if (input.giftReturnMode === "none") return 0;
  if (input.usedMonths >= input.giftReturnThresholdMonths) return 0;

  if (input.giftReturnMode === "prorated") {
    const remaining = input.giftReturnThresholdMonths - input.usedMonths;
    return Math.round(input.signupGift * (remaining / input.giftReturnThresholdMonths));
  }

  return input.signupGift;
};

export const calculatePenalty = (rawInput: PenaltyInput): PenaltyBreakdown => {
  const input = normalizePenaltyInput(rawInput);
  const returnRate = getReturnRate(input.usedMonths, input.contractMonths);
  const contractDiscountReturn = Math.round(input.monthlyDiscount * input.usedMonths * returnRate);
  const deviceDiscountReturn = Math.round(input.deviceDiscount * input.usedMonths * returnRate);
  const giftReturn = calculateGiftReturn(input);

  const totalPenalty =
    contractDiscountReturn +
    deviceDiscountReturn +
    giftReturn +
    input.installFeeReturn +
    input.deviceNonReturnFee;

  return {
    returnRate,
    contractDiscountReturn,
    deviceDiscountReturn,
    giftReturn,
    installFeeReturn: input.installFeeReturn,
    deviceNonReturnFee: input.deviceNonReturnFee,
    totalPenalty,
  };
};

export const getResultStatus = (
  totalSwitchProfit: number,
  usedMonths: number,
  contractMonths: number,
): PenaltyResultStatus => {
  if (usedMonths >= contractMonths) return "contractEnded";
  if (totalSwitchProfit > 100000) return "goodToSwitch";
  if (totalSwitchProfit < -100000) return "likelyLoss";
  return "checkAgain";
};

export const getResultHeadline = (status: PenaltyResultStatus, breakEvenMonths: number | null) => {
  if (status === "contractEnded") return "약정 만료 상태라 위약금 부담이 낮습니다";
  if (status === "goodToSwitch") return "갈아타기를 검토해볼 만합니다";
  if (status === "likelyLoss") return "지금 해지는 손해 가능성이 큽니다";
  if (breakEvenMonths === null) return "월요금 절감으로 회수하기 어렵습니다";
  return "조건을 한 번 더 확인해보세요";
};

export const calculateSwitchProfit = (
  rawInput: PenaltyInput,
  penalty: PenaltyBreakdown,
): SwitchProfitResult => {
  const input = normalizePenaltyInput(rawInput);
  const remainingMonths = Math.max(input.contractMonths - input.usedMonths, 0);
  const monthlySaving = input.monthlyFee - input.newMonthlyFee - input.bundleDiscountLossMonthly;
  const remainingTermSaving = monthlySaving * remainingMonths;
  const immediateNetProfit =
    input.newSignupGift -
    penalty.totalPenalty -
    input.newInstallFee -
    input.forfeitedRetentionBenefit;
  const totalSwitchProfit = immediateNetProfit + remainingTermSaving;
  const breakEvenBase = penalty.totalPenalty + input.newInstallFee + input.forfeitedRetentionBenefit - input.newSignupGift;
  const breakEvenMonths = monthlySaving > 0 ? Math.max(0, Math.ceil(breakEvenBase / monthlySaving)) : null;
  const status = getResultStatus(totalSwitchProfit, input.usedMonths, input.contractMonths);

  return {
    remainingMonths,
    monthlySaving,
    remainingTermSaving,
    immediateNetProfit,
    totalSwitchProfit,
    breakEvenMonths,
    status,
    headline: getResultHeadline(status, breakEvenMonths),
    advice: getResultAdvice(status, monthlySaving, penalty.giftReturn),
  };
};
```

### 4.1 입력 정규화

```ts
export const normalizePenaltyInput = (input: PenaltyInput): PenaltyInput => {
  const contractMonths = clampNumber(input.contractMonths, 1, 60);

  return {
    ...input,
    contractMonths,
    usedMonths: clampNumber(input.usedMonths, 0, contractMonths),
    monthlyFee: clampNumber(input.monthlyFee, 0, 300000),
    monthlyDiscount: clampNumber(input.monthlyDiscount, 0, 200000),
    deviceDiscount: clampNumber(input.deviceDiscount, 0, 100000),
    signupGift: clampNumber(input.signupGift, 0, 2000000),
    giftReturnThresholdMonths: clampNumber(input.giftReturnThresholdMonths, 0, 36),
    installFeeReturn: clampNumber(input.installFeeReturn, 0, 300000),
    deviceNonReturnFee: clampNumber(input.deviceNonReturnFee, 0, 1000000),
    bundleDiscountLossMonthly: clampNumber(input.bundleDiscountLossMonthly, 0, 200000),
    newMonthlyFee: clampNumber(input.newMonthlyFee, 0, 300000),
    newSignupGift: clampNumber(input.newSignupGift, 0, 2000000),
    newInstallFee: clampNumber(input.newInstallFee, 0, 300000),
    forfeitedRetentionBenefit: clampNumber(input.forfeitedRetentionBenefit, 0, 2000000),
  };
};
```

---

## 5. 페이지 구조 (`src/pages/tools/internet-tv-cancellation-penalty.astro`)

```astro
---
import SimpleToolShell from "../../layouts/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  ITCP_META,
  ITCP_DEFAULT_INPUT,
  ITCP_PRODUCT_OPTIONS,
  ITCP_CONTRACT_MONTH_OPTIONS,
  ITCP_GIFT_RETURN_MODE_OPTIONS,
  ITCP_PRESETS,
  ITCP_FAQ,
  ITCP_RELATED_LINKS,
  calculatePenalty,
  calculateSwitchProfit,
  formatKrw,
} from "../../data/internetTvCancellationPenalty";

const initialPenalty = calculatePenalty(ITCP_DEFAULT_INPUT);
const initialProfit = calculateSwitchProfit(ITCP_DEFAULT_INPUT, initialPenalty);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: ITCP_META.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: ITCP_META.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ITCP_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];
---

<SimpleToolShell
  title={ITCP_META.seoTitle}
  description={ITCP_META.description}
  jsonLd={jsonLd}
  shellClass="itcp-page"
>
  <section class="itcp-hero">
    <p>통신비 절약 계산기</p>
    <h1>{ITCP_META.title}</h1>
    <span>{ITCP_META.description}</span>
  </section>

  <InfoNotice
    title="계산 기준 안내"
    lines={[
      ITCP_META.dataNote,
      "실제 위약금은 통신사, 가입 시점, 약정서, 결합할인, 장비 반납 여부에 따라 달라질 수 있습니다.",
      "사은품 반환 조건은 가입 대리점과 판매채널마다 다를 수 있으므로 최종 해지 전 반드시 확인하세요.",
    ]}
  />

  <section class="itcp-calculator" data-itcp-root data-default-input={JSON.stringify(ITCP_DEFAULT_INPUT)}>
    <!-- 입력 aside + 결과 panel -->
  </section>

  <SeoContent
    introTitle="인터넷 TV 해지 위약금을 볼 때 확인할 기준"
    intro={ITCP_SEO_INTRO}
    criteria={ITCP_SEO_CRITERIA}
    faq={ITCP_FAQ}
    related={ITCP_RELATED_LINKS}
  />

  <script type="module" src={withBase("/scripts/internet-tv-cancellation-penalty.js")}></script>
</SimpleToolShell>
```

---

## 6. 화면 IA

### 6.1 Hero

```text
[eyebrow] 통신비 절약 계산기
[H1] 인터넷 TV 약정 해지 위약금 계산기
[description] 약정기간, 사용개월, 월요금, 할인액, 사은품을 입력해 인터넷·IPTV 해지 예상 위약금과 통신사 갈아타기 손익분기점을 계산합니다.
```

### 6.2 입력 영역

```text
aside.itcp-input-panel
  section.itcp-input-group
    h2 현재 약정 정보
    segmented: 상품 유형
    segmented: 약정기간
    range + number: 사용개월
    money input: 월 기본요금
    money input: 월 할인액

  section.itcp-input-group
    h2 반환 가능 항목
    money input: 가입 사은품
    number input: 사은품 반환 기준개월
    select: 사은품 반환 방식
    money input: 장비 임대료 할인
    money input: 기존 설치비 반환 예상
    money input: 장비 미반납 예상비

  section.itcp-input-group
    h2 갈아타기 조건
    money input: 새 통신사 월요금
    money input: 새 통신사 사은품
    money input: 신규 설치비
    money input: 결합할인 손실 월액
    money input: 재약정 혜택 포기액
```

### 6.3 결과 영역

```text
section.itcp-results
  div.itcp-result-banner
    status badge
    headline
    advice

  div.itcp-kpi-grid
    card: 예상 위약금
    card: 갈아타기 순손익
    card: 손익분기점
    card: 남은 약정기간 절감액

  div.itcp-breakdown
    항목별 위약금 구성 카드
      - 약정 할인반환금
      - 장비 할인반환금
      - 사은품 반환 예상
      - 설치비 반환
      - 장비 미반납비

  div.itcp-bar
    구성별 비율 막대

  div.itcp-scenario-guide
    상황별 조언 4개
```

### 6.4 하단 해설 섹션

```text
section.itcp-guide
  h2 위약금은 어떤 항목으로 구성될까
  table: 약정 할인반환금 / 장비 할인반환금 / 사은품 반환 / 설치비 / 장비 미반납비

section.itcp-switch-guide
  h2 갈아타기 손익분기점은 어떻게 계산할까
  example card: 위약금, 사은품, 신규 설치비, 월요금 절감액

section.itcp-case-grid
  카드: 가입 6개월 이하
  카드: 약정 절반 사용
  카드: 약정 6개월 이하 남음
  카드: 이사 예정
  카드: 품질 문제
  카드: 결합할인 중
```

---

## 7. 클라이언트 스크립트 (`public/scripts/internet-tv-cancellation-penalty.js`)

### 7.1 DOM 구조

필수 data 속성:

```html
<section data-itcp-root data-default-input="...">
  <input data-itcp-input="usedMonths">
  <input data-itcp-input="monthlyFee">
  <button data-itcp-contract="36">
  <button data-itcp-product="internetTv">
  <button data-itcp-preset="middle-contract">

  <strong data-itcp-output="totalPenalty"></strong>
  <strong data-itcp-output="totalSwitchProfit"></strong>
  <strong data-itcp-output="breakEvenMonths"></strong>
  <div data-itcp-breakdown></div>
  <div data-itcp-status></div>
</section>
```

### 7.2 상태

```js
const state = {
  productType: "internetTv",
  contractMonths: 36,
  usedMonths: 18,
  monthlyFee: 44000,
  monthlyDiscount: 13200,
  deviceDiscount: 4400,
  signupGift: 450000,
  giftReturnThresholdMonths: 12,
  giftReturnMode: "fullBeforeThreshold",
  installFeeReturn: 0,
  deviceNonReturnFee: 0,
  bundleDiscountLossMonthly: 0,
  newMonthlyFee: 39000,
  newSignupGift: 470000,
  newInstallFee: 36300,
  forfeitedRetentionBenefit: 0,
};
```

### 7.3 주요 함수

```js
const formatKrw = (value) => {
  const rounded = Math.round(Number(value) || 0);
  return `${rounded.toLocaleString()}원`;
};

const getReturnRate = (usedMonths, contractMonths) => {
  if (usedMonths >= contractMonths) return 0;
  if (contractMonths <= 0) return 0;
  const progress = usedMonths / contractMonths;
  if (progress < 0.25) return 1;
  if (progress < 0.5) return 0.7;
  if (progress < 0.75) return 0.45;
  return 0.2;
};

const calculateGiftReturn = (input) => {
  if (input.giftReturnMode === "none") return 0;
  if (input.usedMonths >= input.giftReturnThresholdMonths) return 0;
  if (input.giftReturnMode === "prorated") {
    const remaining = input.giftReturnThresholdMonths - input.usedMonths;
    return Math.round(input.signupGift * (remaining / input.giftReturnThresholdMonths));
  }
  return input.signupGift;
};

const calculateAll = (input) => {
  const returnRate = getReturnRate(input.usedMonths, input.contractMonths);
  const contractDiscountReturn = Math.round(input.monthlyDiscount * input.usedMonths * returnRate);
  const deviceDiscountReturn = Math.round(input.deviceDiscount * input.usedMonths * returnRate);
  const giftReturn = calculateGiftReturn(input);
  const totalPenalty =
    contractDiscountReturn +
    deviceDiscountReturn +
    giftReturn +
    input.installFeeReturn +
    input.deviceNonReturnFee;

  const remainingMonths = Math.max(input.contractMonths - input.usedMonths, 0);
  const monthlySaving = input.monthlyFee - input.newMonthlyFee - input.bundleDiscountLossMonthly;
  const immediateNetProfit =
    input.newSignupGift -
    totalPenalty -
    input.newInstallFee -
    input.forfeitedRetentionBenefit;
  const remainingTermSaving = monthlySaving * remainingMonths;
  const totalSwitchProfit = immediateNetProfit + remainingTermSaving;
  const breakEvenBase =
    totalPenalty + input.newInstallFee + input.forfeitedRetentionBenefit - input.newSignupGift;
  const breakEvenMonths =
    monthlySaving > 0 ? Math.max(0, Math.ceil(breakEvenBase / monthlySaving)) : null;

  return {
    returnRate,
    contractDiscountReturn,
    deviceDiscountReturn,
    giftReturn,
    installFeeReturn: input.installFeeReturn,
    deviceNonReturnFee: input.deviceNonReturnFee,
    totalPenalty,
    remainingMonths,
    monthlySaving,
    immediateNetProfit,
    remainingTermSaving,
    totalSwitchProfit,
    breakEvenMonths,
  };
};
```

### 7.4 URL query

```text
?term=36&used=18&fee=44000&discount=13200&device=4400&gift=450000&giftMonth=12&newFee=39000&newGift=470000&install=36300
```

| 파라미터 | 상태 |
|---|---|
| type | productType |
| term | contractMonths |
| used | usedMonths |
| fee | monthlyFee |
| discount | monthlyDiscount |
| device | deviceDiscount |
| gift | signupGift |
| giftMonth | giftReturnThresholdMonths |
| giftMode | giftReturnMode |
| oldInstall | installFeeReturn |
| nonReturn | deviceNonReturnFee |
| bundleLoss | bundleDiscountLossMonthly |
| newFee | newMonthlyFee |
| newGift | newSignupGift |
| install | newInstallFee |
| retention | forfeitedRetentionBenefit |

---

## 8. 주요 마크업 설계

### 8.1 프리셋 버튼

```astro
<div class="itcp-preset-grid" aria-label="빠른 예시">
  {ITCP_PRESETS.map((preset) => (
    <button
      class="itcp-preset"
      type="button"
      data-itcp-preset={preset.id}
      data-preset-input={JSON.stringify(preset.input)}
    >
      <strong>{preset.label}</strong>
      <span>{preset.description}</span>
    </button>
  ))}
</div>
```

### 8.2 입력 필드

```astro
<label class="itcp-field">
  <span>월 기본요금</span>
  <div class="itcp-money-input">
    <input type="number" inputmode="numeric" min="0" step="1000" data-itcp-input="monthlyFee" value={ITCP_DEFAULT_INPUT.monthlyFee} />
    <em>원</em>
  </div>
</label>
```

### 8.3 세그먼트 컨트롤

```astro
<div class="itcp-segment" role="group" aria-label="약정기간">
  {ITCP_CONTRACT_MONTH_OPTIONS.map((option) => (
    <button
      type="button"
      class={option.value === ITCP_DEFAULT_INPUT.contractMonths ? "is-active" : ""}
      data-itcp-contract={option.value}
    >
      {option.label}
    </button>
  ))}
</div>
```

### 8.4 결과 KPI

```astro
<div class="itcp-kpi-grid">
  <article class="itcp-kpi-card itcp-kpi-card--penalty">
    <span>총 예상 위약금</span>
    <strong data-itcp-output="totalPenalty">{formatKrw(initialPenalty.totalPenalty)}</strong>
    <small>공식 청구액 아님</small>
  </article>
  <article class="itcp-kpi-card">
    <span>갈아타기 순손익</span>
    <strong data-itcp-output="totalSwitchProfit">{formatKrw(initialProfit.totalSwitchProfit)}</strong>
    <small>남은 약정기간 절감액 포함</small>
  </article>
  <article class="itcp-kpi-card">
    <span>손익분기점</span>
    <strong data-itcp-output="breakEvenMonths">
      {initialProfit.breakEvenMonths === null ? "회수 어려움" : `${initialProfit.breakEvenMonths}개월`}
    </strong>
    <small>월요금 절감 기준</small>
  </article>
  <article class="itcp-kpi-card">
    <span>사은품 반환 위험</span>
    <strong data-itcp-output="giftReturn">{formatKrw(initialPenalty.giftReturn)}</strong>
    <small>가입 조건 확인 필요</small>
  </article>
</div>
```

---

## 9. SCSS 설계 (`src/styles/scss/pages/_internet-tv-cancellation-penalty.scss`)

```scss
.itcp-page {
  --itcp-ink: #172033;
  --itcp-muted: #667085;
  --itcp-line: #d8e0ea;
  --itcp-soft: #f5f8fb;
  --itcp-blue: #2457d6;
  --itcp-green: #0f8a5f;
  --itcp-warn: #9a5b00;
  --itcp-danger: #b42318;

  .itcp-hero {
    display: grid;
    gap: 8px;
  }

  .itcp-calculator {
    display: grid;
    grid-template-columns: minmax(280px, 380px) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  .itcp-input-panel,
  .itcp-results,
  .itcp-guide-card,
  .itcp-case-card {
    border: 1px solid var(--itcp-line);
    border-radius: 8px;
    background: #fff;
  }

  .itcp-input-panel {
    position: sticky;
    top: 14px;
    display: grid;
    gap: 16px;
    padding: 16px;
  }

  .itcp-input-group {
    display: grid;
    gap: 12px;
  }

  .itcp-field {
    display: grid;
    gap: 6px;

    span {
      color: var(--itcp-ink);
      font-size: 13px;
      font-weight: 850;
    }
  }

  .itcp-money-input {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    border: 1px solid var(--itcp-line);
    border-radius: 8px;
    background: #fff;
    overflow: hidden;

    input,
    em {
      padding: 10px 12px;
    }

    input {
      min-width: 0;
      border: 0;
      font: inherit;
      color: var(--itcp-ink);
    }

    em {
      color: var(--itcp-muted);
      font-size: 13px;
      font-style: normal;
      background: var(--itcp-soft);
    }
  }

  .itcp-segment {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
    gap: 6px;

    button {
      min-height: 40px;
      border: 1px solid var(--itcp-line);
      border-radius: 8px;
      background: #fff;
      color: var(--itcp-muted);
      font-weight: 850;
      cursor: pointer;
    }

    button.is-active {
      border-color: var(--itcp-blue);
      background: #eef4ff;
      color: var(--itcp-blue);
    }
  }

  .itcp-results {
    display: grid;
    gap: 14px;
    padding: 16px;
  }

  .itcp-result-banner,
  .itcp-kpi-card,
  .itcp-breakdown-card {
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 14px;
    border: 1px solid var(--itcp-line);
    border-radius: 8px;
    background: #fff;
  }

  .itcp-result-banner[data-status="goodToSwitch"] {
    border-color: #a9dec8;
    background: #f0fbf6;
  }

  .itcp-result-banner[data-status="likelyLoss"] {
    border-color: #ffd1ca;
    background: #fff6f4;
  }

  .itcp-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }

  .itcp-kpi-card {
    span,
    small {
      color: var(--itcp-muted);
      font-size: 12px;
      line-height: 1.45;
    }

    strong {
      color: var(--itcp-ink);
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.2;
      letter-spacing: 0;
    }
  }

  .itcp-breakdown-grid,
  .itcp-case-grid,
  .itcp-related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }

  .itcp-bar {
    display: flex;
    min-height: 14px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--itcp-soft);
  }

  .itcp-bar span {
    min-width: 2px;
  }

  @media (max-width: 840px) {
    .itcp-calculator {
      grid-template-columns: minmax(0, 1fr);
    }

    .itcp-input-panel {
      position: static;
    }
  }

  @media (max-width: 560px) {
    .itcp-kpi-grid,
    .itcp-breakdown-grid,
    .itcp-case-grid,
    .itcp-related-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
```

---

## 10. `tools.ts` 등록

추천 위치: 생활·통신비 성격이므로 `생활·유틸리티` 또는 `대출·금융`보다 `생활·유틸리티`가 적합하다.

```ts
{
  slug: "internet-tv-cancellation-penalty",
  title: "인터넷 TV 약정 해지 위약금 계산기",
  description: "약정기간, 사용개월, 월요금, 할인액, 사은품으로 예상 위약금과 통신사 갈아타기 손익분기점을 계산합니다.",
  category: "생활·유틸리티",
  order: 63.8,
  badges: ["NEW", "통신비"],
  previewStats: [
    { label: "결과", value: "위약금" },
    { label: "판정", value: "손익분기점" },
  ],
}
```

---

## 11. `compareHub.ts` 등록

현재 `CompareCategoryId`에 생활비 카테고리가 없다. 1차는 `tax`나 `investment`가 아니라 `ai`/`parenting` 등과 무관하므로 `/compare/`에는 바로 넣기보다 다음 중 하나를 선택한다.

### 옵션 A: `tax` 카테고리 하단에 임시 배치

비추천. 세금·보험료와 결이 다르다.

### 옵션 B: `realEstate` 카테고리 하단에 임시 배치

이사/주거 고정비와 연결되지만 의미가 애매하다.

### 옵션 C: 새 카테고리 `livingCost` 추가

추천. 이미 구독료, 통신비, 생활비, 전기요금, 자동차 보험료 등 생활 고정비 콘텐츠가 늘고 있으므로 장기적으로 유리하다.

```ts
export type CompareCategoryId =
  | "bonus"
  | "welfare"
  | "realEstate"
  | "investment"
  | "salary"
  | "parenting"
  | "tax"
  | "sports"
  | "ai"
  | "livingCost";
```

카테고리:

```ts
{
  id: "livingCost",
  title: "생활비·고정비 비교",
  description: "통신비, 구독료, 보험료, 전기요금처럼 매달 나가는 비용을 비교합니다.",
  criteria: ["월 비용", "위약금", "절감액", "손익분기점"],
  featuredItemIds: ["internet-tv-cancellation-penalty", "ai-subscription", "single-household-living-cost"],
}
```

아이템:

```ts
{
  id: "internet-tv-cancellation-penalty",
  title: "인터넷 TV 해지 위약금 계산기",
  description: "약정기간과 사용개월, 사은품을 입력해 해지 위약금과 통신사 갈아타기 손익분기점을 계산합니다.",
  href: "/tools/internet-tv-cancellation-penalty/",
  type: "calculator",
  categoryId: "livingCost",
  criteria: ["약정기간", "할인반환금", "사은품", "손익분기점"],
  badges: [{ label: "신규", tone: "new" }, { label: "예상", tone: "estimate" }],
  stats: [{ label: "결과", value: "위약금" }, { label: "판정", value: "갈아타기" }],
  ctaLabel: "위약금 계산",
  priority: 1,
}
```

---

## 12. SEO 콘텐츠

```ts
export const ITCP_SEO_INTRO = [
  "인터넷 해지 위약금은 약정기간, 사용개월, 약정할인, 결합할인, 장비 임대료 할인, 가입 사은품 조건에 따라 달라집니다. 그래서 단순히 남은 약정개월만 보고 판단하면 실제 청구액과 차이가 생길 수 있습니다.",
  "이 계산기는 월 할인액과 사용개월을 기준으로 할인반환금을 추정하고, 사은품 반환 위험과 장비 관련 비용을 더해 예상 위약금을 계산합니다. 통신사 공식 청구액이 아니라 고객센터 확인 전 참고용입니다.",
  "통신사 갈아타기를 고민할 때는 새 통신사의 사은품만 보면 안 됩니다. 기존 위약금, 신규 설치비, 월요금 차이, 결합할인 손실, 재약정 혜택 포기액을 함께 넣어야 실제 손익에 가까워집니다.",
  "약정이 거의 끝났다면 기다렸다가 만료 후 이동하는 편이 유리할 수 있습니다. 반대로 새 통신사 사은품과 월요금 절감액이 충분히 크다면 중도 해지도 검토할 수 있습니다.",
  "최종 해지 전에는 통신사 앱이나 고객센터에서 해지 예상금액, 장비 반납 방법, 사은품 반환 조건, 결합할인 해지 영향을 반드시 확인해야 합니다.",
];

export const ITCP_SEO_CRITERIA = [
  "인터넷 TV 위약금은 약정 할인반환금, 장비 할인반환금, 사은품 반환, 설치비, 장비 미반납비를 나눠 봅니다.",
  "갈아타기 손익은 새 통신사 사은품, 월요금 절감액, 신규 설치비, 기존 재약정 포기 혜택을 함께 계산합니다.",
  "사은품 반환 기준개월 이전 해지는 실제 위약금보다 체감 부담이 커질 수 있습니다.",
  "결합할인을 받고 있다면 휴대폰 요금 상승분까지 월요금 절감액에서 차감해야 합니다.",
  "계산 결과는 공식 청구액이 아니라 예상값이므로 최종 해지 전 고객센터 확인이 필요합니다.",
];
```

---

## 13. QA 포인트

- [ ] 사용개월이 약정기간 이상이면 반환계수와 약정 할인반환금이 0이 되는가
- [ ] 사용개월 slider max가 약정기간 변경에 맞춰 업데이트되는가
- [ ] 사은품 반환 방식 `전액/비례/없음`이 각각 다르게 계산되는가
- [ ] 월요금 절감액이 0 이하이면 손익분기점이 `월요금으로 회수 불가`로 표시되는가
- [ ] 새 통신사 사은품이 위약금보다 크면 즉시 순손익이 양수로 표시되는가
- [ ] 결합할인 손실 월액이 월요금 절감액에서 차감되는가
- [ ] 장비 미반납비가 위약금 breakdown에 별도 표시되는가
- [ ] 모든 결과 영역에 `예상`, `공식 청구액 아님` 고지가 있는가
- [ ] URL query 공유 후 새로고침해도 동일한 값이 복원되는가
- [ ] 모바일 375px에서 입력 패널, KPI, breakdown 카드가 겹치지 않는가
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 누락이 없는가
- [ ] `npm run build` 성공

---

## 14. 구현 리스크

| 리스크 | 대응 |
|---|---|
| 통신사별 실제 산식과 차이 | `예상 계산`, `공식 청구액 아님`, `고객센터 확인 필요`를 반복 표시 |
| 사은품 반환 조건의 다양성 | 반환 방식과 기준개월을 사용자가 직접 선택하게 함 |
| 결합할인 손실 누락 | 고급 입력에 결합할인 손실 월액을 포함 |
| 월요금 절감액이 음수일 때 혼란 | 손익분기점을 null 처리하고 `월요금으로 회수 불가` 표시 |
| 장비 반납 관련 비용 누락 | 장비 미반납 예상비를 위약금과 별도 항목으로 표시 |
| 모바일 입력 과밀 | 입력 그룹을 3개 섹션으로 나누고 sticky는 desktop에서만 적용 |

---

## 15. 구현 순서

1. `src/data/internetTvCancellationPenalty.ts` 작성
2. `public/scripts/internet-tv-cancellation-penalty.js` 작성
3. `src/pages/tools/internet-tv-cancellation-penalty.astro` 작성
4. `src/styles/scss/pages/_internet-tv-cancellation-penalty.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` 등록
7. `public/sitemap.xml` 등록
8. 필요 시 `src/pages/index.astro` topic/category 매핑 추가
9. 필요 시 `src/data/compareHub.ts`에 `livingCost` 카테고리 추가
10. `npm run build`

---

## 16. 개발 완료 기준

- 계산기 페이지가 `/tools/internet-tv-cancellation-penalty/`에서 렌더링된다.
- 기본값 기준으로 예상 위약금, 갈아타기 순손익, 손익분기점이 첫 화면에 표시된다.
- 사용자가 약정기간, 사용개월, 월요금, 할인액, 사은품, 신규 통신사 조건을 바꾸면 결과가 즉시 갱신된다.
- URL query로 입력값 공유가 가능하다.
- 위약금 breakdown이 항목별로 분리되어 표시된다.
- 공식 위약금이 아니라 예상값임을 충분히 고지한다.
- 빌드가 성공한다.
