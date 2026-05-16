# 여행 환전 손익 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/travel-exchange-calculator.md`
> 작성일: 2026-05-11
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 여행 국가·통화·환전 방법별 실수령 외화 및 수수료 비교, 방법별 절약 금액 계산

---

## 1. 문서 개요

- 구현 대상: `여행 환전 손익 계산기`
- slug: `travel-exchange-calculator`
- URL: `/tools/travel-exchange-calculator/`
- 카테고리: 여행/항공/숙박비
- 핵심 검색 의도: "여행 환전 계산기", "일본 엔화 환전 실수령액", "트래블카드 vs 은행 환전 비교"
- 핵심 출력: 방법별 실수령 외화, 총 수수료, 추천 환전 방법, 절약 가능 금액

---

## 2. 구현 파일 구조

```text
src/
  data/
    travelExchangeCalculator.ts     ← 통화 목록, 방법별 기본 수수료, 국가 프리셋, FAQ, 관련 링크
  pages/
    tools/
      travel-exchange-calculator.astro

public/
  scripts/
    travel-exchange-calculator.js

src/styles/scss/pages/
  _travel-exchange-calculator.scss
```

추가 등록:
- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. `resultFirst={true}` — 결과 먼저 표시.
- SCSS prefix: `tec-`

```astro
<SimpleToolShell
  calculatorId="travel-exchange-calculator"
  pageClass="op-page tec-page"
  resultFirst={true}
>
```

---

## 4. 데이터 모델 (기획 원문 기반)

```ts
export type CurrencyCode = "USD" | "JPY" | "EUR" | "THB" | "VND" | "TWD" | "SGD" | "PHP";

export type ExchangeMethod =
  | "TRAVEL_CARD"    // 트래블카드
  | "BANK_APP"       // 은행 앱 환전
  | "BANK_BRANCH"    // 은행 창구 환전
  | "AIRPORT"        // 공항 환전
  | "LOCAL_ATM";     // 현지 ATM 인출

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;         // "일본 엔화 (JPY)"
  unit: 1 | 100;         // JPY는 100엔 단위, 나머지는 1
  defaultRate: number;   // 기준 환율 (원화/단위)
  countries: string[];   // 사용 국가
}

export interface ExchangeMethodConfig {
  method: ExchangeMethod;
  label: string;
  spreadRate: number;         // 기본 스프레드율 (%)
  preferentialRate: number;   // 기본 우대율 (%)
  fixedFee: number;           // 고정 수수료 (원)
  cardFeeRate: number;        // 카드 해외 이용 수수료 (%)
  description: string;        // 방법 설명
}

export interface TravelExchangeInput {
  country: string;
  currency: CurrencyCode;
  krwAmount: number;          // 환전 원화 금액
  baseRate: number;           // 기준 환율 (직접 입력)
  unit: 1 | 100;
  travelers: number;          // 여행 인원
  travelDays: number;         // 여행 기간 (일)
  methodConfigs: Partial<Record<ExchangeMethod, {
    spreadRate?: number;
    preferentialRate?: number;
    fixedFee?: number;
    cardFeeRate?: number;
  }>>;                        // 사용자가 수정한 방법별 수수료
}

export interface ExchangeResult {
  method: ExchangeMethod;
  label: string;
  effectiveSpreadRate: number;    // 실효 스프레드율
  appliedRate: number;            // 적용 환율
  foreignAmount: number;          // 실수령 외화
  totalFeeKrw: number;            // 총 수수료 (원화 환산)
  savingVsWorst: number;          // 가장 비싼 방법 대비 절약액
  savingVsBankBranch: number;     // 은행 창구 대비 절약액
  rank: number;                   // 수수료 낮은 순 순위
}
```

---

## 5. 통화 및 방법별 기본값

### 통화 목록

```ts
export const CURRENCIES: CurrencyInfo[] = [
  { code: "JPY", label: "일본 엔화 (JPY)", unit: 100, defaultRate: 900, countries: ["일본"] },
  { code: "USD", label: "미국 달러 (USD)", unit: 1, defaultRate: 1380, countries: ["미국", "동남아"] },
  { code: "EUR", label: "유로 (EUR)", unit: 1, defaultRate: 1500, countries: ["유럽"] },
  { code: "THB", label: "태국 바트 (THB)", unit: 1, defaultRate: 38, countries: ["태국"] },
  { code: "VND", label: "베트남 동 (VND)", unit: 100, defaultRate: 5.5, countries: ["베트남"] },
  { code: "SGD", label: "싱가포르 달러 (SGD)", unit: 1, defaultRate: 1030, countries: ["싱가포르"] },
  { code: "TWD", label: "대만 달러 (TWD)", unit: 1, defaultRate: 43, countries: ["대만"] },
  { code: "PHP", label: "필리핀 페소 (PHP)", unit: 1, defaultRate: 24, countries: ["필리핀"] },
];
```

### 방법별 기본 수수료 설정

```ts
export const METHOD_CONFIGS: ExchangeMethodConfig[] = [
  {
    method: "TRAVEL_CARD",
    label: "트래블카드",
    spreadRate: 1.75,
    preferentialRate: 100,   // 수수료 면제
    fixedFee: 0,
    cardFeeRate: 0,
    description: "수수료 0% 환전, 해외 카드 결제 수수료 없음 (상품별 조건 확인)",
  },
  {
    method: "BANK_APP",
    label: "은행 앱 환전",
    spreadRate: 1.75,
    preferentialRate: 90,    // 90% 우대 → 실효 0.175%
    fixedFee: 0,
    cardFeeRate: 0,
    description: "은행 앱 환전 우대 90% 적용 (실효 스프레드 0.175%)",
  },
  {
    method: "BANK_BRANCH",
    label: "은행 창구 환전",
    spreadRate: 1.75,
    preferentialRate: 50,    // 50% 우대 → 실효 0.875%
    fixedFee: 0,
    cardFeeRate: 0,
    description: "은행 창구 우대 50% 수준 (일반적 기준)",
  },
  {
    method: "AIRPORT",
    label: "공항 환전",
    spreadRate: 1.75,
    preferentialRate: 0,     // 우대 없음 → 실효 1.75%
    fixedFee: 0,
    cardFeeRate: 0,
    description: "우대율 없음 (공항 환전소 일반 조건)",
  },
  {
    method: "LOCAL_ATM",
    label: "현지 ATM 인출",
    spreadRate: 1.75,
    preferentialRate: 90,
    fixedFee: 3000,          // 현지 ATM 사업자 수수료 추정
    cardFeeRate: 0,
    description: "트래블카드 수수료 + 현지 ATM 사업자 수수료(약 3,000원) 추정",
  },
];
```

---

## 6. 계산 로직 (기획 원문 함수 기반)

```ts
function calculateExchangeResult(input: TravelExchangeInput, config: ExchangeMethodConfig): ExchangeResult {
  const unit = input.unit;

  // 실효 스프레드율 = 기본 스프레드 × (1 - 우대율/100)
  const effectiveSpreadRate = config.spreadRate * (1 - config.preferentialRate / 100);

  // 적용 환율 = 기준 환율 × (1 + 실효 스프레드율/100)
  const appliedRate = input.baseRate * (1 + effectiveSpreadRate / 100);

  // 카드 수수료 = 환전금액 × 카드 수수료율
  const cardFee = input.krwAmount * (config.cardFeeRate / 100);

  // 가용 원화 = 환전금액 - 고정수수료 - 카드수수료
  const availableKrw = input.krwAmount - config.fixedFee - cardFee;

  // 실수령 외화 = 가용원화 / 적용환율 × 단위
  const foreignAmount = (availableKrw / appliedRate) * unit;

  // 총 수수료 (원화 환산) = 환전금액 - 실수령외화/단위 × 기준환율
  const totalFeeKrw = input.krwAmount - (foreignAmount / unit) * input.baseRate;

  return {
    method: config.method,
    label: config.label,
    effectiveSpreadRate,
    appliedRate,
    foreignAmount,
    totalFeeKrw,
    savingVsWorst: 0,       // 전체 계산 후 채움
    savingVsBankBranch: 0,  // 전체 계산 후 채움
    rank: 0,                // 전체 정렬 후 채움
  };
}

function sortAndRankResults(results: ExchangeResult[]): ExchangeResult[] {
  const sorted = [...results].sort((a, b) => b.foreignAmount - a.foreignAmount);
  const worstForeignAmount = Math.min(...results.map(r => r.foreignAmount));
  const bankBranchAmount = results.find(r => r.method === "BANK_BRANCH")?.foreignAmount ?? 0;

  return sorted.map((r, i) => ({
    ...r,
    rank: i + 1,
    savingVsWorst: (r.foreignAmount - worstForeignAmount) / input.unit * input.baseRate, // 원화 환산
    savingVsBankBranch: (r.foreignAmount - bankBranchAmount) / input.unit * input.baseRate,
  }));
}
```

---

## 7. 국가 프리셋

```ts
export const COUNTRY_PRESETS = [
  { country: "일본", currency: "JPY" as CurrencyCode, unit: 100, defaultRate: 900, flag: "🇯🇵" },
  { country: "미국", currency: "USD" as CurrencyCode, unit: 1, defaultRate: 1380, flag: "🇺🇸" },
  { country: "유럽", currency: "EUR" as CurrencyCode, unit: 1, defaultRate: 1500, flag: "🇪🇺" },
  { country: "태국", currency: "THB" as CurrencyCode, unit: 1, defaultRate: 38, flag: "🇹🇭" },
  { country: "베트남", currency: "VND" as CurrencyCode, unit: 100, defaultRate: 5.5, flag: "🇻🇳" },
  { country: "싱가포르", currency: "SGD" as CurrencyCode, unit: 1, defaultRate: 1030, flag: "🇸🇬" },
];
```

---

## 8. 페이지 IA

1. **Hero** — H1: "여행 환전 손익 계산기", 부제: "어디서 환전하는 게 제일 이득인지 계산합니다"
2. **InfoNotice** — "환율·수수료는 변동되므로 실제 환전 전 최신 조건 확인 필요"
3. **DesignTrustPanel**
4. **국가 프리셋 선택 칩 (6개)**
5. **입력 패널** — 국가, 통화, 환전 금액, 기준 환율, 여행 인원, 여행 기간
6. **결과 추천 카드 (주요 KPI)**
7. **방법별 비교 표** — 5개 방법 × 실수령 외화·수수료·절약액
8. **환율 민감도 표** — 환율 ±5%, ±10% 시 실수령 외화 변화
9. **국가별 환전 팁 카드** — 선택 국가에 맞는 안내
10. **CTA** — 트래블카드 비교 리포트 / 여행 적금 계산기
11. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 9. 입력 UI 상세

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| 여행 국가 | chip/select | 일본 | 통화 자동 선택 |
| 통화 | select | JPY | 8개 통화 선택 |
| 환전 원화 금액 | number (쉼표) | 1,000,000 | min 10,000 |
| 기준 환율 | number | 900 (JPY 100엔) | 직접 입력, 단위 표시 |
| 여행 인원 | number | 1 | 1인당 금액 계산용 |
| 여행 기간 (일) | number | 4 | 하루 예산 계산용 |

고급 설정 (접기):
- 각 방법별 우대율 직접 입력 (은행 앱 우대율, 공항 우대율 등)
- 고정 수수료 (ATM 수수료 직접 입력)

보조 문구:
- 기준 환율: "오늘 기준 환율을 직접 입력하세요. 네이버 검색 '엔화 환율'에서 '현찰 살 때' 기준 매매기준율 참고"
- 여행 기간: "기간 입력 시 하루 사용 가능 외화를 계산해 드립니다"

---

## 10. 결과 UI 상세

KPI 카드 (4개):

| 카드 | 레이블 | 내용 |
|------|--------|------|
| 주요 (Main) | 추천 환전 방법 | 수수료 가장 낮은 방법 |
| 일반 | 예상 실수령 외화 | 추천 방법 기준 |
| Accent | 공항 환전 대비 절약 | 추천 방법 vs 공항 환전 차이 |
| 일반 | 하루 사용 가능 외화 | 인원·기간 나눈 값 |

방법별 비교 표:

| 방법 | 적용 환율 | 실수령 외화 | 총 수수료 | 절약액 | 순위 |
|------|---------|---------|---------|------|------|
| 트래블카드 | 900원 | 111,111엔 | 0원 | 기준 | 1위 |
| 은행 앱 환전 | 901.6원 | 110,913엔 | 1,754원 | -1,754원 | 2위 |
| 은행 창구 | 907.9원 | 110,144엔 | 8,720원 | -8,720원 | 3위 |
| 현지 ATM | 901.6원+3,000 | 110,778엔 | 3,013원 | -3,013원 | 4위 |
| 공항 환전 | 915.8원 | 109,194엔 | 17,221원 | -17,221원 | 5위 |

추천 방법 표시: 1순위 방법에 "추천" 배지 + 초록 하이라이트.

자연어 메시지:
```
일본 여행 1,000,000원 환전 시, 트래블카드로 환전하면
실수령 111,111엔으로 가장 유리합니다.
공항 환전 대비 약 17,221원(1,917엔)을 절약할 수 있습니다.
2인 여행 기준 약 34,000원, 4박 5일 하루 예산은 약 22,222엔입니다.
```

환율 민감도 표:

| 기준 환율 | 트래블카드 실수령 | 은행 앱 실수령 | 차이 |
|---------|------------|------------|------|
| 880원 (-20) | 113,636엔 | 113,432엔 | 204엔 |
| 890원 (-10) | 112,360엔 | 112,163엔 | 197엔 |
| **900원 (현재)** | **111,111엔** | **110,916엔** | **195엔** |
| 910원 (+10) | 109,890엔 | 109,698엔 | 192엔 |
| 920원 (+20) | 108,696엔 | 108,508엔 | 188엔 |

---

## 11. JavaScript 설계

```js
(() => {
  const PRESETS = JSON.parse(document.getElementById("tec-presets").textContent);
  const METHOD_DEFAULTS = JSON.parse(document.getElementById("tec-methods").textContent);

  let state = {
    country: "일본",
    currency: "JPY",
    unit: 100,
    krwAmount: 1000000,
    baseRate: 900,
    travelers: 1,
    travelDays: 4,
    methodOverrides: {},
  };

  function sanitize(val, fallback = 0, min = 0) {
    const n = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(n) || n < min ? fallback : n;
  }

  function calcResult(krwAmount, baseRate, unit, config) {
    const spread = config.spreadRate * (1 - config.preferentialRate / 100);
    const applied = baseRate * (1 + spread / 100);
    const cardFee = krwAmount * (config.cardFeeRate / 100);
    const available = krwAmount - config.fixedFee - cardFee;
    const foreign = (available / applied) * unit;
    const feeKrw = krwAmount - (foreign / unit) * baseRate;
    return { method: config.method, label: config.label, applied, foreign, feeKrw };
  }

  function calculateAll(s) {
    const results = METHOD_DEFAULTS.map(cfg => {
      const override = s.methodOverrides[cfg.method] || {};
      return calcResult(s.krwAmount, s.baseRate, s.unit, { ...cfg, ...override });
    });
    const max = Math.max(...results.map(r => r.foreign));
    const min = Math.min(...results.map(r => r.foreign));
    const bankBranch = results.find(r => r.method === "BANK_BRANCH");
    return results
      .sort((a, b) => b.foreign - a.foreign)
      .map((r, i) => ({
        ...r,
        rank: i + 1,
        savingVsWorst: ((r.foreign - min) / s.unit) * s.baseRate,
        savingVsBankBranch: bankBranch ? ((r.foreign - bankBranch.foreign) / s.unit) * s.baseRate : 0,
      }));
  }

  function calcSensitivity(s, results) {
    const offsets = [-20, -10, 0, 10, 20];
    return offsets.map(offset => {
      const rate = s.baseRate + offset;
      return { rate, results: METHOD_DEFAULTS.map(cfg => calcResult(s.krwAmount, rate, s.unit, cfg)) };
    });
  }

  function renderResults(results, s) { /* KPI 카드, 비교 표, 메시지 갱신 */ }
  function renderSensitivityTable(sensitivity) {}
  function applyPreset(country) { /* 국가별 기본값 적용 */ }
  function readInputs() {}
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {}

  restoreFromUrl();
  bindEvents();
  const results = calculateAll(state);
  renderResults(results, state);
  renderSensitivityTable(calcSensitivity(state, results));
})();
```

URL 파라미터: `country` / `currency` / `amount` / `rate` / `travelers` / `days`

---

## 12. SCSS 설계

```scss
.tec-page {
  .tec-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .tec-preset-chip {
      border: 1px solid #dce6e2;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      cursor: pointer;
      background: #fff;
      &.is-active { background: #1a56db; color: #fff; border-color: #1a56db; }
    }
  }

  .tec-result-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .tec-comparison-table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 10px 12px; border-bottom: 1px solid #e8ede9; text-align: right; font-size: 0.88rem; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-best { background: #f0faf6; }
    tr.is-best td.tec-method { font-weight: 700; color: #0f6e56; }
    tr.is-worst td.tec-fee { color: #b91c1c; }
    .tec-rank-badge {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #dce6e2;
      text-align: center;
      line-height: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-right: 6px;
      &--1 { background: #0f6e56; color: #fff; }
    }
  }

  .tec-sensitivity-table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 8px 12px; border-bottom: 1px solid #e8ede9; text-align: right; font-size: 0.82rem; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-current { background: #f0f7ff; font-weight: 700; }
  }

  .tec-country-tip {
    background: #f8fcfa;
    border: 1px solid #dce6e2;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.88rem;
    margin-top: 12px;
  }
}
```

---

## 13. SEO 설계

```text
title: 여행 환전 손익 계산기 — 은행·공항·트래블카드·ATM 환전 수수료 비교
description: 여행 환전 계산기로 은행 창구, 공항 환전, 트래블카드, 현지 ATM 인출 방식별 실수령 외화와 수수료를 비교합니다. 일본 엔화, 미국 달러, 유로, 동남아 통화 환전 손익을 계산할 수 있습니다.
H1: 여행 환전 손익 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 여행 환전 계산기, 일본 여행 환전, 엔화 환전 수수료, 트래블카드 환전 이득, 공항 환전 수수료

---

## 14. SeoContent 초안

### introTitle
`여행 환전 손익 계산기 — 어디서 환전하면 가장 이득인지 계산합니다`

### intro (5문단)

1. 같은 100만 원을 환전해도 어디서 환전하느냐에 따라 실제 받는 외화가 달라집니다. 트래블카드(수수료 0%), 은행 앱 환전(우대 90%), 은행 창구 환전(우대 50%), 공항 환전(우대 없음), 현지 ATM 인출을 같은 조건으로 비교하면 실수령 외화 차이가 발생합니다. 이 계산기는 5가지 환전 방법의 실수령 외화와 수수료를 한 번에 비교해 어떤 방법이 가장 유리한지 알려줍니다.

2. 환전 수수료는 '환율 스프레드'와 '우대율'로 결정됩니다. 은행이 붙이는 기본 스프레드는 약 1.75%이며, 우대율 90%를 적용하면 실효 수수료는 0.175%로 줄어듭니다. 트래블카드처럼 스프레드가 0%에 가까운 경우 수수료 없이 기준 환율에 가까운 금액을 받을 수 있습니다. '환율 우대 90%'는 환율이 90% 싸진다는 뜻이 아니라, 스프레드의 90%를 깎아준다는 의미입니다.

3. 현지 ATM 인출은 카드사 수수료가 면제되어도 현지 ATM 운영사가 별도 수수료를 부과할 수 있습니다. 태국은 약 220밧(약 8,360원), 일본 우체국 ATM은 110엔 수준의 수수료가 붙을 수 있습니다. 이 계산기의 현지 ATM 항목에는 약 3,000원의 ATM 사업자 수수료가 기본 포함되어 있으며, 실제 여행 국가의 ATM 수수료에 맞게 조정할 수 있습니다.

4. 여행 인원과 기간을 입력하면 하루 예산과 1인당 환전 금액을 자동으로 계산합니다. 2인 여행에서 방법 차이로 절약하는 금액은 2배가 되고, 환전 금액이 클수록 수수료 차이가 커집니다. 300만 원을 환전한다면 트래블카드와 공항 환전의 차이는 약 5만 원 이상이 될 수 있습니다.

5. 이 계산기는 기준 환율을 직접 입력하는 방식입니다. 네이버 검색에서 '엔화 환율'을 검색하면 나오는 '현찰 살 때' 환율 기준의 매매기준율을 입력하면 됩니다. 실시간 환율이 반영되지 않으므로, 실제 환전 당일 환율을 입력해 계산하는 것이 가장 정확합니다. 모든 수수료는 추정값이며 실제 환전 전 해당 기관 최신 조건을 확인하세요.

### FAQ (8개)

```ts
export const TEC_FAQ = [
  {
    question: "환전 방법별 수수료를 직접 수정할 수 있나요?",
    answer: "네. 계산기 하단 '상세 설정'에서 각 방법별 우대율과 고정 수수료를 직접 입력할 수 있습니다. 본인이 거래하는 은행의 실제 우대율이나 특정 트래블카드의 조건을 입력하면 더 정확한 비교가 가능합니다.",
  },
  {
    question: "기준 환율은 어떻게 확인하나요?",
    answer: "네이버에서 '엔화 환율'처럼 통화명을 검색하면 현재 환율이 나옵니다. 매매기준율(중간 환율)을 입력하면 됩니다. '현찰 살 때 환율'은 이미 스프레드가 반영된 환율이므로, 가능하면 매매기준율을 입력하고 수수료 설정으로 스프레드를 조정하는 것이 더 정확합니다.",
  },
  {
    question: "일본 엔화는 왜 100엔 단위로 계산하나요?",
    answer: "일본 엔화(JPY)는 국내 은행에서 100엔 단위로 고시하는 것이 관행입니다. 예를 들어 '100엔=900원'으로 표시되므로, 이 계산기도 JPY를 100엔 단위로 처리합니다. 계산기에 '900'을 입력하면 100엔=900원을 의미합니다.",
  },
  {
    question: "베트남 동(VND)은 어떻게 입력하나요?",
    answer: "VND는 단위가 매우 커서(100동=약 0.0055원) 국내 환전이 어렵습니다. 이 계산기에서 VND를 선택하면 100동 단위로 계산합니다. 베트남 여행에서는 USD를 국내에서 환전한 뒤 현지에서 VND로 바꾸는 방식이 일반적입니다.",
  },
  {
    question: "공항 환전은 항상 손해인가요?",
    answer: "소액 긴급 환전 외에는 불리한 경우가 많습니다. 다만 일부 공항 환전소에서 이벤트성 우대율을 제공하거나, 카드사 계열 환전소에서 제휴 우대가 있을 수 있습니다. 출국 전에 미리 환전하는 것이 더 유리하지만, 급하게 필요한 소액은 공항 환전도 선택지입니다.",
  },
  {
    question: "ATM 인출 시 '수수료 없음'을 선택하면 정말 0원인가요?",
    answer: "카드사·은행의 해외 이용 수수료가 면제된다는 의미이며, 현지 ATM 운영사가 부과하는 수수료는 별도로 발생할 수 있습니다. ATM 화면에서 수수료 안내가 나오면 확인 후 결정하세요. 이 계산기의 '현지 ATM' 항목에는 약 3,000원의 ATM 사업자 수수료가 기본 포함되어 있습니다.",
  },
  {
    question: "트래블카드와 신용카드를 함께 쓰는 게 좋은가요?",
    answer: "네. 트래블카드를 주 결제 수단으로 사용하고, 신용카드를 백업으로 준비하는 것이 안전합니다. 트래블카드 앱 장애, 충전 한도 초과, 분실 등 예상치 못한 상황에 대비할 수 있습니다. 또한 신용카드는 해외 결제 시 이중 청구 분쟁 대응이나 렌터카·호텔 보증금에 더 유리할 수 있습니다.",
  },
  {
    question: "여행 후 남은 외화는 어떻게 하나요?",
    answer: "트래블카드 외화 잔액은 원화로 재환전하거나 다음 여행에 사용할 수 있습니다. 재환전 시 '현찰 팔 때 환율'이 적용되어 수수료가 발생할 수 있습니다. 현금으로 남은 외화는 은행 창구에서 재환전하거나 다음 여행을 위해 보관하는 것이 일반적입니다. 소액이라면 재환전 수수료가 금액보다 클 수 있으니 판단이 필요합니다.",
  },
];
```

---

## 15. 관련 링크

- `/reports/travel-card-vs-exchange-2026/` — 트래블카드 vs 환전 비교 리포트
- `/tools/travel-savings-goal-calculator/` — 여행 적금 목표 계산기
- `/tools/travel-expense-split/` — 여행 경비 분담 계산기
- `/tools/flight-cheapest-timing-calculator/` — 항공권 최저가 시기 계산기
- `/reports/travel-peak-offpeak-cost-comparison-2026/` — 성수기 vs 비수기 여행비 비교

---

## 16. QA 체크리스트

- [ ] JPY 100엔 단위 계산 처리 (baseRate=900 → 100엔=900원)
- [ ] VND 100동 단위 처리 (소수점 수수료 계산 정확)
- [ ] 우대율 0~100% 범위 검증
- [ ] 고정 수수료가 환전금액보다 크면 음수 방어 처리
- [ ] 결과 순위 1위에 "추천" 배지 표시
- [ ] 비교 표 절약액 계산 정확 (트래블카드 기준 or 가장 비싼 방법 기준)
- [ ] 환율 민감도 표 ±20원 범위 5행 정상 계산
- [ ] 국가 프리셋 선택 시 통화·기준환율 자동 변경
- [ ] URL 파라미터 복원 정상 동작
- [ ] "투자·환전 권유 아님" 면책 문구 표시
- [ ] 모바일 360px 비교 표 가로 스크롤 정상
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
