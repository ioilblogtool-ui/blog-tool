# 부부간 주식 증여세 계산기 — 설계 문서

> 기획 원본: `docs/plan/202606/spouse-stock-gift-tax-calculator.md`
> 작성일: 2026-06-28
> 구현 기준: 배우자 6억 원 증여재산공제 + 해외주식 양도세 비교 + 2025년 이후 증여분 1년 이내 매도 경고

---

## 1. 문서 개요

### 1-1. 대상

| 항목 | 내용 |
|---|---|
| 구현 대상 | 부부간 주식 증여세 계산기 |
| slug | `spouse-stock-gift-tax-calculator` |
| URL | `/tools/spouse-stock-gift-tax-calculator/` |
| 콘텐츠 유형 | `/tools/` 계산기 |
| 핵심 키워드 | 부부간 주식 증여세 계산기, 배우자 주식 증여 6억원, 해외주식 배우자 증여 |
| 레이아웃 | `SimpleToolShell.astro` |
| JS | `public/scripts/spouse-stock-gift-tax-calculator.js` |
| CSS prefix | `ssg-` |

### 1-2. 페이지 성격

이 계산기는 단순 증여세 계산기가 아니라 **증여세 + 해외주식 양도세 절세 효과 + 1년 이내 매도 경고**를 함께 보여주는 절세 판단 도구입니다.

사용자가 가져가야 하는 핵심은 아래 세 가지입니다.

1. 배우자에게 증여하면 10년 합산 6억 원 공제를 검토할 수 있다.
2. 수익이 큰 해외주식은 증여 후 매도 시 양도세가 달라질 수 있다.
3. 2025년 이후 증여분은 1년 이내 매도 시 증여자의 원래 취득가액을 기준으로 계산될 수 있어 바로 매도하면 절세 효과가 제한될 수 있다.

---

## 2. 파일 구조

```txt
src/data/spouseStockGiftTaxCalculator.ts
src/pages/tools/spouse-stock-gift-tax-calculator.astro
public/scripts/spouse-stock-gift-tax-calculator.js
src/styles/scss/pages/_spouse-stock-gift-tax-calculator.scss
public/og/tools/spouse-stock-gift-tax-calculator.svg
```

추가 등록:

```txt
src/data/tools.ts
src/styles/app.scss
public/sitemap.xml
```

---

## 3. 구현 범위

### 3-1. MVP 포함

* 배우자 10년 합산 6억 원 공제 계산
* 최근 10년 배우자 증여액 반영
* 증여세 과세표준 및 예상 증여세 계산
* 해외주식 직접 매도 양도세 계산
* 증여 후 배우자 매도 양도세 계산
* 증여 후 보유기간 1년 미만/1년 이상 분기
* 1년 이내 매도 경고
* 예상 절세액 표시
* 입력값 URL 파라미터 저장/복원
* FAQ, 관련 계산기, 출처/주의 문구

### 3-2. MVP 제외

* 환율 자동 반영
* 증권사 거래내역 업로드
* 복수 종목 손익통산
* 국내주식 대주주 여부 상세 계산
* 국내상장 ETF/해외상장 ETF 과세 세부 분기
* 실제 신고서 생성

### 3-3. 2차 확장

* 여러 종목 입력
* 환율·수수료·환전 스프레드 반영
* 손익통산 시뮬레이션
* 국내상장 해외 ETF / 해외상장 ETF 분리 계산
* 증여일과 매도예정일 date 입력으로 1년 경과 자동 판정

---

## 4. 데이터 파일 설계

### 4-1. 타입 정의

```ts
// src/data/spouseStockGiftTaxCalculator.ts

export type StockGiftKind = "foreign_stock" | "domestic_stock" | "etf";
export type GiftDonor = "husband" | "wife";
export type HoldingPeriod = "under_1y" | "over_1y";
export type WarningLevel = "safe" | "caution" | "danger";

export interface SpouseStockGiftMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface SpouseStockGiftDefaults {
  stockKind: StockGiftKind;
  donor: GiftDonor;
  giftValue: number;
  priorSpouseGiftAmount: number;
  donorOriginalCost: number;
  expectedSalePrice: number;
  holdingPeriod: HoldingPeriod;
  foreignStockBasicDeduction: number;
  capitalGainTaxRate: number;
  applySelfReportCredit: boolean;
}

export interface GiftTaxBracket {
  maxBase: number | null;
  rate: number;
  deduction: number;
  label: string;
}

export interface QuickAmount {
  label: string;
  value: number;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<SpouseStockGiftDefaults>;
}

export interface GuideCard {
  label: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface SourceLink {
  href: string;
  label: string;
  description: string;
}
```

### 4-2. 상수

```ts
export const SSG_SPOUSE_DEDUCTION_LIMIT = 600_000_000;
export const SSG_FOREIGN_STOCK_BASIC_DEDUCTION = 2_500_000;
export const SSG_FOREIGN_STOCK_TAX_RATE = 0.22;
export const SSG_SELF_REPORT_CREDIT_RATE = 0.03;

export const SSG_GIFT_TAX_BRACKETS: GiftTaxBracket[] = [
  { maxBase: 100_000_000, rate: 0.1, deduction: 0, label: "1억 원 이하" },
  { maxBase: 500_000_000, rate: 0.2, deduction: 10_000_000, label: "1억 초과~5억 이하" },
  { maxBase: 1_000_000_000, rate: 0.3, deduction: 60_000_000, label: "5억 초과~10억 이하" },
  { maxBase: 3_000_000_000, rate: 0.4, deduction: 160_000_000, label: "10억 초과~30억 이하" },
  { maxBase: null, rate: 0.5, deduction: 460_000_000, label: "30억 초과" },
];
```

### 4-3. 권장 export 구조

```ts
export const SSG_META: SpouseStockGiftMeta = { ... };
export const SSG_DEFAULTS: SpouseStockGiftDefaults = { ... };
export const SSG_QUICK_AMOUNTS: QuickAmount[] = [ ... ];
export const SSG_SCENARIOS: ScenarioPreset[] = [ ... ];
export const SSG_GUIDE_CARDS: GuideCard[] = [ ... ];
export const SSG_FAQ: FaqItem[] = [ ... ];
export const SSG_RELATED_LINKS: RelatedLink[] = [ ... ];
export const SSG_SOURCE_LINKS: SourceLink[] = [ ... ];
```

### 4-4. 기본값

```ts
export const SSG_DEFAULTS = {
  stockKind: "foreign_stock",
  donor: "husband",
  giftValue: 300_000_000,
  priorSpouseGiftAmount: 0,
  donorOriginalCost: 100_000_000,
  expectedSalePrice: 320_000_000,
  holdingPeriod: "over_1y",
  foreignStockBasicDeduction: 2_500_000,
  capitalGainTaxRate: 0.22,
  applySelfReportCredit: true,
};
```

---

## 5. 계산 로직 설계

### 5-1. 입력값 정규화

클라이언트 JS는 모든 금액 입력값을 아래 방식으로 정규화합니다.

```js
function parseMoney(value, fallback = 0) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? Math.max(0, num) : fallback;
}
```

### 5-2. 배우자 증여공제

```js
function calcGiftDeduction(input) {
  const remainingBefore = Math.max(0, SPOUSE_DEDUCTION_LIMIT - input.priorSpouseGiftAmount);
  const applied = Math.min(input.giftValue, remainingBefore);
  const taxBase = Math.max(0, input.giftValue - applied);
  const remainingAfter = Math.max(0, remainingBefore - input.giftValue);

  return { remainingBefore, applied, taxBase, remainingAfter };
}
```

### 5-3. 증여세

```js
function calcGiftTax(taxBase, applySelfReportCredit) {
  const bracket = GIFT_TAX_BRACKETS.find((b) => b.maxBase === null || taxBase <= b.maxBase);
  const calculated = Math.max(0, taxBase * bracket.rate - bracket.deduction);
  const credit = applySelfReportCredit ? Math.floor(calculated * SELF_REPORT_CREDIT_RATE) : 0;
  const finalTax = Math.max(0, calculated - credit);

  return { bracket, calculated, credit, finalTax };
}
```

### 5-4. 직접 매도 양도세

```js
function calcDirectSaleTax(input) {
  const gain = Math.max(0, input.expectedSalePrice - input.donorOriginalCost);
  const taxable = Math.max(0, gain - input.foreignStockBasicDeduction);
  const tax = Math.floor(taxable * input.capitalGainTaxRate);

  return { gain, taxable, tax };
}
```

### 5-5. 증여 후 배우자 매도 양도세

```js
function calcGiftedSaleTax(input) {
  const acquisitionCost =
    input.holdingPeriod === "under_1y" ? input.donorOriginalCost : input.giftValue;
  const gain = Math.max(0, input.expectedSalePrice - acquisitionCost);
  const taxable = Math.max(0, gain - input.foreignStockBasicDeduction);
  const tax = Math.floor(taxable * input.capitalGainTaxRate);

  return { acquisitionCost, gain, taxable, tax };
}
```

### 5-6. 최종 결과

```js
function calculate(input) {
  const giftDeduction = calcGiftDeduction(input);
  const giftTax = calcGiftTax(giftDeduction.taxBase, input.applySelfReportCredit);
  const directSale = calcDirectSaleTax(input);
  const giftedSale = calcGiftedSaleTax(input);
  const isShortSale = input.holdingPeriod === "under_1y";
  const estimatedSaving = isShortSale
    ? null
    : directSale.tax - giftedSale.tax - giftTax.finalTax;

  return {
    ...giftDeduction,
    giftTax,
    directSale,
    giftedSale,
    estimatedSaving,
    warningLevel: isShortSale ? "danger" : estimatedSaving > 0 ? "safe" : "caution",
  };
}
```

### 5-7. 국내주식/ETF 처리

MVP에서는 계산 엔진을 해외주식 기준으로 두되, `stockKind`에 따라 안내 문구를 분기합니다.

| 주식 종류 | MVP 계산 | 안내 문구 |
|---|---|---|
| 해외주식 | 250만 원 공제 + 22% 계산 | 메인 계산 지원 |
| 국내주식 | 증여세는 계산, 양도세는 참고 경고 | 대주주·장외·비상장 여부 확인 필요 |
| ETF | 증여세는 계산, 양도세는 참고 경고 | 국내상장/해외상장 ETF 과세 차이 확인 필요 |

국내주식/ETF 선택 시 결과 카드의 양도세 비교에는 `해외주식 단순 모델 기준` 배지를 붙이거나, 2차 구현 전까지 양도세 비교 카드에 주의 문구를 함께 노출합니다.

---

## 6. Astro 페이지 구조

### 6-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import DesignTrustPanel from "../../components/DesignTrustPanel.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SSG_DEFAULTS,
  SSG_FAQ,
  SSG_GUIDE_CARDS,
  SSG_META,
  SSG_QUICK_AMOUNTS,
  SSG_RELATED_LINKS,
  SSG_SCENARIOS,
  SSG_SOURCE_LINKS,
} from "../../data/spouseStockGiftTaxCalculator";
---
```

### 6-2. JSON-LD

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: SSG_META.title,
      url: `${import.meta.env.SITE}/tools/${SSG_META.slug}/`,
      description: SSG_META.description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "ko-KR",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "비교계산소" },
    },
    {
      "@type": "FAQPage",
      mainEntity: SSG_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};
```

### 6-3. Shell

```astro
<BaseLayout title={SSG_META.seoTitle} description={SSG_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <SimpleToolShell calculatorId="spouse-stock-gift-tax-calculator" pageClass="op-page ssg-page" resultFirst={true}>
    ...
  </SimpleToolShell>
</BaseLayout>
```

---

## 7. 화면 구조

### 7-1. Hero

* eyebrow: `주식 증여세 계산기`
* title: `부부간 주식 증여세 계산기`
* description: `배우자 6억 원 공제와 해외주식 양도세 절세 효과를 함께 계산합니다.`
* badges: `배우자 6억 공제`, `해외주식`, `1년 보유 주의`, `추정`

### 7-2. 상단 경고

`InfoNotice`에 고정 노출합니다.

```txt
배우자에게 주식을 증여한 뒤 1년 이내에 매도하면 증여 당시 평가액이 아니라 증여자의 원래 취득가액을 기준으로 양도차익이 계산될 수 있습니다.
```

### 7-3. 입력 패널

aside 영역은 `op-panel` 하나로 시작합니다.

입력 필드:

| data key | UI | 기본값 |
|---|---|---|
| `stockKind` | select 또는 segmented | `foreign_stock` |
| `donor` | segmented | `husband` |
| `giftValue` | text input + quick buttons | 300,000,000 |
| `priorSpouseGiftAmount` | text input | 0 |
| `donorOriginalCost` | text input | 100,000,000 |
| `expectedSalePrice` | text input | 320,000,000 |
| `holdingPeriod` | segmented | `over_1y` |
| `foreignStockBasicDeduction` | advanced input | 2,500,000 |
| `capitalGainTaxRate` | advanced input | 22 |
| `applySelfReportCredit` | checkbox | checked |

권장 마크업:

```astro
<section class="op-panel" data-ssg-root>
  <div class="op-panel__head">
    <p>입력</p>
    <h2>증여·매도 조건</h2>
  </div>
  ...
</section>
```

### 7-4. 결과 KPI

결과 카드는 5개입니다.

| 출력 key | 라벨 | 설명 |
|---|---|---|
| `giftTax` | 예상 증여세 | 배우자 공제 반영 |
| `remainingDeduction` | 남은 배우자 공제 | 증여 후 잔여 한도 |
| `directSaleTax` | 직접 매도 양도세 | 증여하지 않고 매도 |
| `giftedSaleTax` | 증여 후 매도 양도세 | 배우자가 매도 |
| `estimatedSaving` | 예상 절세액 | 1년 이상 보유 시 |

1년 이내 매도일 때 `estimatedSaving`은 숫자 대신 `주의 필요`로 표시합니다.

### 7-5. 결과 경고 패널

`data-ssg-output="warningPanel"` 영역을 결과 카드 위에 둡니다.

상태:

| 상태 | 조건 | 문구 |
|---|---|---|
| safe | 1년 이상 + 절세액 양수 | 1년 이상 보유 후 매도하는 시나리오입니다 |
| caution | 1년 이상 + 절세액 0 이하 | 증여 후 매도 절세 효과가 크지 않을 수 있습니다 |
| danger | 1년 미만 | 1년 이내 매도는 취득가액 이월 이슈를 확인해야 합니다 |

### 7-6. 비교 표

```txt
직접 매도
- 매도가액
- 취득가액
- 양도차익
- 기본공제
- 과세대상
- 예상 양도세

증여 후 매도
- 매도가액
- 취득가액
- 양도차익
- 기본공제
- 과세대상
- 예상 양도세
```

### 7-7. 해설 섹션

계산기 아래에 정적 설명 섹션을 둡니다.

1. 배우자 6억 원 공제 구조
2. 1년 이내 매도 주의
3. 국내주식·해외주식·ETF별 주의점
4. 세액 0원이어도 신고를 검토하는 이유
5. 계산 예시
6. FAQ
7. 관련 계산기

---

## 8. 클라이언트 JS 설계

### 8-1. 파일

```txt
public/scripts/spouse-stock-gift-tax-calculator.js
```

### 8-2. 구조

```js
(() => {
  const root = document.querySelector("[data-ssg-root]");
  if (!root) return;

  const CONSTANTS = { ... };
  const fields = { ... };

  function readInput() {}
  function calculate(input) {}
  function render(result, input) {}
  function syncUrl(input) {}
  function restoreFromUrl() {}
  function bindEvents() {}

  restoreFromUrl();
  bindEvents();
  render(calculate(readInput()), readInput());
})();
```

### 8-3. URL 파라미터

| param | 의미 |
|---|---|
| `kind` | stockKind |
| `donor` | donor |
| `gift` | giftValue |
| `prior` | priorSpouseGiftAmount |
| `cost` | donorOriginalCost |
| `sale` | expectedSalePrice |
| `period` | holdingPeriod |
| `deduct` | foreignStockBasicDeduction |
| `rate` | capitalGainTaxRate |
| `report` | applySelfReportCredit |

### 8-4. 빠른 금액 버튼

`data-ssg-quick` 버튼은 현재 포커스된 금액 필드가 있으면 그 필드에 적용하고, 없으면 `giftValue`에 적용합니다.

MVP에서는 단순하게 빠른 금액 버튼을 `giftValue` 전용으로 처리해도 됩니다.

---

## 9. 결과 문구 분기

### 9-1. 공제 이내

```txt
이번 증여는 배우자 10년 합산 공제 한도 이내로 예상 증여세는 0원입니다. 다만 세액이 없더라도 취득가액과 자금흐름 증빙을 위해 신고를 검토할 수 있습니다.
```

### 9-2. 공제 초과

```txt
최근 10년 배우자 증여액을 반영하면 이번 증여 중 일부가 과세표준에 포함됩니다. 공제 초과분에는 증여세 누진세율이 적용됩니다.
```

### 9-3. 1년 미만 매도

```txt
주의가 필요합니다. 증여 후 1년 이내 양도하면 증여 당시 평가액을 취득가액으로 활용하는 절세 효과가 제한될 수 있습니다.
```

### 9-4. 1년 이상 매도

```txt
1년 이상 보유 후 매도하는 시나리오입니다. 증여 당시 평가액을 취득가액으로 활용하는 절세 효과를 기대할 수 있지만, 실제 세액은 신고 기준과 손익통산에 따라 달라질 수 있습니다.
```

---

## 10. 스타일 설계

### 10-1. prefix

모든 페이지 전용 클래스는 `ssg-` prefix 사용.

```scss
.ssg-page {}
.ssg-warning-panel {}
.ssg-result-grid {}
.ssg-result-card {}
.ssg-compare-table {}
.ssg-rule-grid {}
.ssg-guide-card {}
.ssg-scenario-table {}
.ssg-related-grid {}
```

### 10-2. 색상

* 기본: 기존 `op-page` 카드 스타일 재사용
* 안전/절세: 녹색 계열
* 주의: 황색/적갈색 계열
* 위험: 붉은 계열
* 해외주식/투자 맥락: 파랑 계열 보조 배지

### 10-3. 레이아웃

```scss
.ssg-result-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1024px) {
  .ssg-result-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .ssg-result-grid {
    grid-template-columns: 1fr;
  }
}
```

### 10-4. 경고 패널

```scss
.ssg-warning-panel--danger {
  border-color: #f1b8aa;
  background: #fff1ed;
}

.ssg-warning-panel--safe {
  border-color: #b8ddca;
  background: #edf7f2;
}
```

---

## 11. FAQ 설계

`SSG_FAQ`는 실제 화면과 JSON-LD에 모두 사용합니다.

필수 질문:

1. 부부간 주식 증여는 6억원까지 세금 없나요?
2. 해외주식도 배우자에게 증여할 수 있나요?
3. 배우자에게 증여받은 주식을 바로 팔아도 되나요?
4. 증여세가 0원이어도 신고해야 하나요?
5. 국내주식과 해외주식 증여 계산이 다른가요?
6. 부부간 ETF 증여도 가능한가요?
7. 배우자에게 6억원 증여 후 10년 뒤 또 가능한가요?
8. 손실 난 주식도 증여하는 게 좋나요?
9. 배당주를 배우자에게 증여하면 배당소득은 누구에게 귀속되나요?
10. 증여받은 주식의 취득가액은 얼마인가요?

---

## 12. 관련 링크

```ts
export const SSG_RELATED_LINKS = [
  {
    href: "/tools/gift-tax-calculator/",
    label: "증여세 계산기",
    description: "배우자·자녀·부모 증여세를 관계별로 계산합니다.",
  },
  {
    href: "/tools/us-stock-exchange-profit-calculator/",
    label: "해외주식 환차익 계산기",
    description: "해외주식 매수·매도 환율을 반영한 실제 손익을 계산합니다.",
  },
  {
    href: "/tools/domestic-stock-capital-gains-tax/",
    label: "국내주식 양도소득세 계산기",
    description: "대주주·장외·비상장주식 양도세를 확인합니다.",
  },
  {
    href: "/tools/isa-tax-calculator/",
    label: "ISA 절세 계산기",
    description: "일반계좌와 ISA 계좌의 세후 수익 차이를 비교합니다.",
  },
];
```

---

## 13. 출처/신뢰도 패널

`DesignTrustPanel`에 아래 notes를 전달합니다.

```txt
배우자 증여재산공제 6억 원은 상속세 및 증여세법상 증여재산공제 기준입니다.
2025년 이후 증여분의 1년 이내 양도 취득가액 이슈는 소득세법 제97조의2 확인이 필요합니다.
해외주식 양도세는 기본공제 250만 원과 22% 단순 계산으로 추정하며, 실제 신고는 손익통산과 환율 기준에 따라 달라질 수 있습니다.
```

출처 링크:

* 국가법령정보센터 상속세 및 증여세법 제53조
* 국가법령정보센터 소득세법 제97조의2
* 국세청 양도소득세 세율 안내
* 홈택스

---

## 14. 도구 등록안

`src/data/tools.ts` 예시:

```ts
{
  slug: "spouse-stock-gift-tax-calculator",
  title: "부부간 주식 증여세 계산기",
  description: "배우자 6억 원 공제와 해외주식 증여 후 매도 양도세 절세 효과를 함께 계산합니다. 1년 이내 매도 주의 경고 포함.",
  eyebrow: "증여세",
  category: "tax",
  order: 00,
  badges: [
    { label: "배우자 공제", value: "6억원" },
    { label: "해외주식", value: "양도세 비교" },
    { label: "주의", value: "1년 보유" },
  ],
}
```

실제 필드는 현재 `tools.ts` 타입 구조를 확인해 맞춥니다.

---

## 15. QA 체크리스트

### 계산 QA

* [ ] 증여가액 3억, 기존 증여 0원 → 증여세 0원
* [ ] 증여가액 7억, 기존 증여 0원 → 과세표준 1억 원
* [ ] 기존 증여 5억, 이번 증여 3억 → 잔여 공제 1억 원, 과세표준 2억 원
* [ ] 직접 매도: 매도가 3억, 취득가 1억 → 양도차익 2억 원
* [ ] 해외주식 기본공제 250만 원 반영 확인
* [ ] 22% 세율 적용 확인
* [ ] 1년 이상 보유 시 취득가액이 증여 당시 평가액으로 계산되는지 확인
* [ ] 1년 미만 보유 시 취득가액이 증여자 원래 취득가액으로 계산되는지 확인
* [ ] 1년 미만 보유 시 절세액 숫자 대신 경고가 표시되는지 확인

### UX QA

* [ ] 금액 입력에 쉼표가 있어도 계산 정상
* [ ] 빠른 금액 버튼 동작
* [ ] URL 공유 후 입력값 복원
* [ ] 모바일 320px에서 결과 카드 overflow 없음
* [ ] 국내주식/ETF 선택 시 주의 안내 노출
* [ ] 세액 0원이어도 신고 검토 문구 노출

### 배포 QA

* [ ] `src/data/tools.ts` 등록
* [ ] `src/styles/app.scss` import
* [ ] `public/sitemap.xml` URL 추가
* [ ] OG 이미지 추가
* [ ] `npm run build` 성공

---

## 16. 구현 순서

1. `src/data/spouseStockGiftTaxCalculator.ts` 작성
2. `src/pages/tools/spouse-stock-gift-tax-calculator.astro` 작성
3. `public/scripts/spouse-stock-gift-tax-calculator.js` 계산 로직 구현
4. `src/styles/scss/pages/_spouse-stock-gift-tax-calculator.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import
7. `public/sitemap.xml` 등록
8. `npm run build`

---

## 17. 최종 구현 메모

이 계산기는 숫자보다 **타이밍 경고**가 핵심입니다. 사용자가 "배우자 6억 공제니까 바로 증여 후 팔면 되겠다"로 이해하면 위험합니다.

따라서 결과 화면의 우선순위는 다음과 같습니다.

1. 1년 이내 매도 경고 여부
2. 예상 증여세
3. 직접 매도 vs 증여 후 매도 양도세 비교
4. 예상 절세액
5. 신고·증빙 안내

절세액이 크게 보이더라도 `추정`, `1년 보유`, `손익통산·환율·수수료 미반영` 문구가 항상 함께 보여야 합니다.
