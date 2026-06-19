# 병원비 실손 청구할까 말까 계산기 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 배경: 실손보험 가입자가 병원비 발생 시 "청구하는 게 이득인지"를 즉시 판단하게 해주는 도구. 기존 `silson-insurance-refund-calculator`(얼마 받나)와 달리, **환급액 vs 무청구 할인 손실** 비교를 통해 청구 실익 판정까지 제공한다.
- 구현 대상: 진료비(급여/비급여/약제비), 가입 세대, 무청구 할인 조건을 입력하면 예상 환급액·자기부담금·청구 실익·권장 판정을 계산하는 계산기.
- 페이지 성격: `계산기형` — `SimpleToolShell` 기반, `resultFirst={true}`

### 1-2. 문서 역할
- 실제 구현 직전 수준까지 화면/데이터/계산식/구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 권장 slug
- `medical-expense-claim-worth-calculator`
- URL: `/tools/medical-expense-claim-worth-calculator/`
- 페이지 제목: `병원비 실손 청구하면 얼마 돌려받을까? 실비 청구 계산기 2026`

### 1-4. 파일 구조
```
src/data/medicalExpenseClaimCalculator.ts
src/pages/tools/medical-expense-claim-worth-calculator.astro
public/scripts/medical-expense-claim-worth-calculator.js
src/styles/scss/pages/_medical-expense-claim-worth-calculator.scss
public/og/tools/medical-expense-claim-worth-calculator.png
```

---

## 2. 구현 범위

### 2-1. MVP 범위
- 입력: 진료 유형(통원/입원), 급여 진료비, 비급여 진료비, 약제비
- 입력: 가입 세대 select → 자기부담률 자동 셋팅, 수정 가능
- 입력: 무청구 할인 실익 비교 (toggle로 펼치기) — 월 보험료, 무청구 경과 기간
- 출력: 예상 환급액, 자기부담금, 청구 실익, 권장 판정 배지
- 출력: 청구 항목 내역 카드 (급여/비급여/약제비 분리)
- 출력: 무청구 할인 손실 비교 패널 (입력 시)
- 출력: 가입 세대 정보 카드
- 청구 불가 항목 안내, 청구 절차 가이드 (접기형)
- URL 파라미터로 상태 공유
- SEO: `SeoContent`(소개 2문단, FAQ 5개, 관련 링크 3개)

### 2-2. MVP 제외 범위
- 실시간 보험사별 약관 조회
- 특정 비급여 항목(도수치료·MRI 등)별 4세대 특별약관 세분화
- 보험료 갱신 시뮬레이션 (인상률 고려)

---

## 3. 페이지 목적

- "청구하면 얼마 받나"를 넘어서 **"지금 청구하는 게 손해인지 이득인지"** 를 판정해준다.
- 무청구 할인 조건 입력 시 `청구 실익` 수치로 결론을 명확히 제시한다.
- 세대별 자기부담률 자동 셋팅으로 약관 내용을 몰라도 즉시 계산 가능.
- 청구 불가 항목 안내로 "치과는 안 된다"는 정보를 계산기 내에서 해결.

---

## 4. 화면 구성

### 4-1. aside 슬롯 (입력 패널)

**Panel 1 — 진료 정보**
```
진료 유형 [통원 ●] [입원 ○]          ← radio-tab 스타일 2버튼

급여 진료비          [ 30,000 원 ] ▲▼
비급여 진료비        [      0 원 ] ▲▼
약제비               [  5,000 원 ] ▲▼
```

**Panel 2 — 실손 상품 정보**
```
가입 세대
  [1세대(~2009)] [2세대(~2017)] [3세대(~2021)] [4세대(2021~)]
  ← 4개 radio-tab 버튼

급여 자기부담률   [ 20 %]   ← 세대 선택 시 자동, 수정 가능
비급여 자기부담률 [ 30 %]   ← 세대 선택 시 자동, 수정 가능
```

**Panel 3 — 무청구 할인 실익 비교 (선택)**
```
무청구 할인 특약 있음  [OFF] ← toggle 버튼, ON 시 아래 펼침

  월 보험료          [ 60,000 원]
  무청구 할인율      [ 10 %]
  현재 무청구 경과   [  0 개월] (0~35)
```

**하단 버튼**
```
[ 계산하기 ]  [ 초기화 ]
```

---

### 4-2. main 슬롯 (결과 패널)

**result-priority-panel**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 예상 환급액  │ 자기부담금   │ 청구 실익    │  판  정      │
│  20,000원    │  15,000원    │ +20,000원    │ 청구 권장 ✓  │
│ (세후 환급)  │ (본인 부담)  │ (할인 있을때)│              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```
- 무청구 할인 입력 없을 시: 청구 실익 카드 숨김 (3개 카드)
- 판정 카드: accent 배경, 뱃지 형태

**청구 항목 내역 섹션**
```
mecc-breakdown-card (3개)
  [급여]  환자부담 XX원 → 자부담 공제 → 환급액 XX원
  [비급여] XX원 → 자부담 공제 → 환급액 XX원
  [약제비] XX원 → 공제 → 환급액 XX원
```

**무청구 할인 손실 비교 패널** (무청구 할인 ON 시만 표시)
```
┌──────────────────────────────────────────────┐
│ 예상 환급액           +XX,000원              │
│ 무청구 할인 상실액    -XX,000원              │
│ ─────────────────────────────────────────── │
│ 순 청구 실익          ±XX,000원             │
│                                              │
│ [청구 권장] / [청구 비권장]  ← 결론 배지     │
└──────────────────────────────────────────────┘
```

**가입 세대 정보 카드**
```
mecc-generation-card (현재 선택 세대 기준)
  급여 자기부담률 / 비급여 자기부담률 / 통원 공제 / 약제비 공제 / 세대 특이사항
```

**청구 불가 항목 안내 (InfoNotice 스타일)**
```
⚠ 다음 항목은 실손보험 지급 제외입니다
  · 치과 치료 (충치·임플란트·교정)   · 미용·성형 목적 시술
  · 한방 치료 (일부 예외)             · 라식·라섹 등 시력교정
  · 예방접종·건강검진                 · 비급여 안과 (시력 목적)
```

**청구 절차 가이드** (접기형 `<details>`)
```
① 영수증·세부내역서·진단서(필요 시) 준비
② 보험사 앱 / 팩스 / 창구 청구
③ 지급 소요 기간: 평균 3~7 영업일
④ 소액(3만원 미만): 간소화 서류 가능한 경우 많음
```

**계산 기준 로직 패널** (4-card grid)
```
[급여 계산 기준]  [비급여 기준]  [약제비 기준]  [무청구 할인 기준]
```

**InfoNotice (면책)**
```
본 계산기는 참고용이며 실제 지급액은 약관·가입 조건에 따라 다를 수 있습니다.
```

**SeoContent** (seo slot)

---

## 5. 데이터 파일 (`src/data/medicalExpenseClaimCalculator.ts`)

```typescript
// ── 타입 ──────────────────────────────────────────────────────────────────────

export type VisitType = "outpatient" | "inpatient";
export type Generation = "gen1" | "gen2" | "gen3" | "gen4";

export interface GenerationConfig {
  id: Generation;
  label: string;           // "3세대 (2017~2021)"
  coveredCoPayRate: number;  // 급여 자기부담률 (0~1)
  nonCoveredCoPayRate: number; // 비급여 자기부담률 (0~1)
  outpatientDeductible: number;  // 통원 공제금액 (원)
  medicineDeductible: number;    // 약제비 공제금액 (원)
  note: string;            // 세대 특이사항 1줄
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

// ── 세대별 설정 ───────────────────────────────────────────────────────────────

export const MECC_GENERATIONS: GenerationConfig[] = [
  {
    id: "gen1",
    label: "1세대 (~2009년)",
    coveredCoPayRate: 0.1,
    nonCoveredCoPayRate: 0,     // 비급여 전액 지급
    outpatientDeductible: 5000,
    medicineDeductible: 5000,
    note: "비급여 100% 지급 (자부담 없음). 상품별로 급여 10~20% 차이 있음.",
  },
  {
    id: "gen2",
    label: "2세대 (2009~2017년)",
    coveredCoPayRate: 0.1,
    nonCoveredCoPayRate: 0.1,
    outpatientDeductible: 10000,
    medicineDeductible: 5000,
    note: "급여 10%, 비급여 10% 자기부담. 현재 가장 많이 가입된 세대.",
  },
  {
    id: "gen3",
    label: "3세대 (2017~2021년)",
    coveredCoPayRate: 0.2,
    nonCoveredCoPayRate: 0.3,
    outpatientDeductible: 10000,
    medicineDeductible: 5000,
    note: "급여 20%, 비급여 30% 자기부담. 보험료 낮지만 본인 부담 증가.",
  },
  {
    id: "gen4",
    label: "4세대 (2021년~)",
    coveredCoPayRate: 0.2,
    nonCoveredCoPayRate: 0.3,
    outpatientDeductible: 20000,
    medicineDeductible: 8000,
    note: "비급여 항목 일부 특별약관 별도 적용. 통원 공제 2만원으로 상향.",
  },
];

// ── 국민건강보험 공단부담률 ────────────────────────────────────────────────────

export const NHI_COVERED_RATE: Record<VisitType, number> = {
  outpatient: 0.7,   // 통원: 공단 70%
  inpatient: 0.8,    // 입원: 공단 80%
};

// ── 기본값 ────────────────────────────────────────────────────────────────────

export const MECC_DEFAULT = {
  visitType: "outpatient" as VisitType,
  coveredFee: 30000,
  nonCoveredFee: 0,
  medicineFee: 5000,
  generation: "gen3" as Generation,
  // 무청구 할인 (선택)
  hasNonClaimDiscount: false,
  monthlyPremium: 60000,
  nonClaimDiscountRate: 0.1,
  nonClaimMonthsElapsed: 0,
};

// ── 무청구 할인 기준 ──────────────────────────────────────────────────────────

export const NON_CLAIM_DISCOUNT_PERIOD_MONTHS = 36; // 3년

// ── 청구 불가 항목 목록 ───────────────────────────────────────────────────────

export const MECC_EXCLUDED_ITEMS: string[] = [
  "치과 치료 (충치·발치·임플란트·교정·보철)",
  "미용·성형 목적 시술 (쌍꺼풀·지방흡입 등)",
  "한방 치료 (일부 예외적 입원 제외)",
  "라식·라섹·드림렌즈 등 시력교정술",
  "예방접종·건강검진·종합검진",
  "임신·출산 관련 (제왕절개 일부 제외)",
  "보조기구 (안경·보청기·틀니 등)",
];

// ── 청구 절차 ─────────────────────────────────────────────────────────────────

export const MECC_CLAIM_STEPS: string[] = [
  "진료비 영수증 및 세부내역서 발급 (병원 원무과)",
  "진단서는 입원 또는 특정 상병 시 요구됨",
  "보험사 앱 / 팩스 / 방문 창구로 청구",
  "소액(통상 3만원 미만)은 간소화 서류로 처리 가능",
  "지급 소요 기간: 평균 3~7 영업일 이내",
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

export const MECC_FAQ: PageFaqItem[] = [
  {
    question: "소액 실손 청구하면 보험료가 오르나요?",
    answer: "갱신 시 보험료 인상은 청구 여부가 아닌 나이·손해율 등으로 결정됩니다. 다만 무청구 할인 특약이 있는 경우 청구 시 3년 할인 리셋이 발생합니다. 계산기에서 월 보험료와 무청구 경과 기간을 입력하면 실익을 비교할 수 있습니다.",
  },
  {
    question: "치과 치료비도 실손으로 청구할 수 있나요?",
    answer: "대부분의 치과 치료는 실손보험 지급 대상 외입니다. 충치·임플란트·교정·보철은 제외되며, 악관절 질환 등 구강 외과 수술 일부만 예외적으로 인정될 수 있습니다. 개별 약관을 확인하거나 보험사에 사전 문의하세요.",
  },
  {
    question: "3세대와 4세대 실손의 차이는 무엇인가요?",
    answer: "3세대는 급여 20%, 비급여 30% 자기부담이며 통원 공제 1만원, 약제비 공제 5천원입니다. 4세대는 자기부담률은 동일하나 통원 공제 2만원, 약제비 공제 8천원으로 소액 청구 시 본인 부담이 높습니다. 비급여 항목 일부는 특별약관으로 별도 관리됩니다.",
  },
  {
    question: "비급여 MRI는 실손 청구가 가능한가요?",
    answer: "1~3세대 실손 가입자는 의사 지시에 따른 비급여 MRI를 대부분 청구할 수 있습니다. 4세대는 MRI·CT 등이 비급여 특별약관으로 분리되어 있어 해당 특약 가입 여부를 먼저 확인해야 합니다.",
  },
  {
    question: "통원과 입원의 청구 방식이 다른가요?",
    answer: "네. 통원은 공단부담률 70%, 통원 공제금액(세대별 1~2만원) 공제 후 청구합니다. 입원은 공단부담률 80%, 별도 공제금 없이 입원 기간 합산 청구가 일반적입니다. 입원의 경우 환급 금액이 커서 청구 실익이 분명한 경우가 대부분입니다.",
  },
];

// ── 관련 링크 ─────────────────────────────────────────────────────────────────

export const MECC_RELATED_LINKS = [
  {
    label: "실손보험 환급액 계산기 (세대별)",
    href: "/tools/silson-insurance-refund-calculator/",
  },
  {
    label: "실손보험 세대별 비교 — 금융감독원",
    href: "https://www.fss.or.kr/",
    external: true,
  },
  {
    label: "건강보험 보장 범위 — 국민건강보험",
    href: "https://www.nhis.or.kr/",
    external: true,
  },
];

// ── 메타 ──────────────────────────────────────────────────────────────────────

export const MECC_META = {
  slug: "medical-expense-claim-worth-calculator",
  title: "병원비 실손 청구하면 얼마 돌려받을까? 실비 청구 계산기 2026",
  description:
    "진료비·비급여·약제비 입력하면 실손보험 예상 환급액과 무청구 할인 손실을 비교해 청구 실익을 바로 계산합니다. 세대별 자기부담률 자동 반영.",
  updatedAt: "2026-06-19",
  caution: "본 계산기는 참고용이며 실제 지급액은 약관·가입 조건·상품별 특약에 따라 다를 수 있습니다.",
};
```

---

## 6. 계산 로직 (`public/scripts/medical-expense-claim-worth-calculator.js`)

### 6-1. 상수

```js
const NHI_RATE = { outpatient: 0.7, inpatient: 0.8 };
// 가입 세대별 설정 — config JSON으로 전달
```

### 6-2. 급여 환급액

```js
function calcCoveredRefund(coveredFee, visitType, coPayRate, outpatientDeductible) {
  // 환자 부담 = 급여 진료비 × (1 - 공단부담률)
  const patientShare = coveredFee * (1 - NHI_RATE[visitType]);
  // 통원 공제 적용 (입원은 공제 없음)
  const afterDeductible = visitType === "outpatient"
    ? Math.max(0, patientShare - outpatientDeductible)
    : patientShare;
  // 실손 급여 환급 = afterDeductible × (1 - 자기부담률)
  return Math.max(0, afterDeductible * (1 - coPayRate));
}
```

### 6-3. 비급여 환급액

```js
function calcNonCoveredRefund(nonCoveredFee, nonCoveredCoPayRate) {
  return Math.max(0, nonCoveredFee * (1 - nonCoveredCoPayRate));
}
```

### 6-4. 약제비 환급액

```js
function calcMedicineRefund(medicineFee, medicineDeductible) {
  return Math.max(0, medicineFee - medicineDeductible);
}
```

### 6-5. 총 예상 환급액

```js
const totalRefund = coveredRefund + nonCoveredRefund + medicineRefund;
```

### 6-6. 무청구 할인 손실

```js
function calcDiscountLoss(monthlyPremium, discountRate, monthsElapsed) {
  const remaining = Math.max(0, NON_CLAIM_PERIOD - monthsElapsed);
  // 남은 무청구 기간 × 월 보험료 × 할인율 = 잃게 되는 할인 혜택 총액
  return monthlyPremium * discountRate * remaining;
}
// NON_CLAIM_PERIOD = 36
```

예외: 이미 무청구 할인을 받고 있는 경우(elapsed = 36) → 청구 시 다음 갱신 할인 손실로 처리.  
이 계산기에서는 `elapsed >= 36`이면 discountLoss = `monthlyPremium × discountRate × 12`(1년치 추정)로 단순화.

### 6-7. 청구 실익 및 판정

```js
const claimWorth = totalRefund - discountLoss;

// 판정
function getVerdict(totalRefund, claimWorth, hasDiscount) {
  if (totalRefund <= 0) return "no_refund";         // 청구 불가
  if (!hasDiscount) return "claim_recommended";      // 할인 없으면 무조건 청구 권장
  if (claimWorth > 0) return "claim_recommended";    // 실익 양수
  return "skip_recommended";                         // 실익 음수 → 참는 게 유리
}
```

### 6-8. `compute()` 반환값

```js
{
  coveredRefund,         // 급여 환급액
  nonCoveredRefund,      // 비급여 환급액
  medicineRefund,        // 약제비 환급액
  totalRefund,           // 총 예상 환급액
  selfPay,               // 총 자기부담금 (총 병원비 - 환급액)
  discountLoss,          // 무청구 할인 손실액 (할인 없으면 0)
  claimWorth,            // 청구 실익
  verdict,               // "claim_recommended" | "skip_recommended" | "no_refund"
  // 내역용
  patientShareCovered,   // 급여 환자부담 (공단 제외 후)
  afterDeductibleCovered,// 급여 통원공제 후
  coveredCoPayAmt,       // 급여 자기부담 차감액
  medicineDeductibleAmt, // 약제비 공제금액
  nonCoveredCoPayAmt,    // 비급여 자기부담 차감액
}
```

---

## 7. 컴포넌트 구조 (`src/pages/tools/medical-expense-claim-worth-calculator.astro`)

### 7-1. BaseLayout props

```ts
title: MECC_META.title
description: MECC_META.description
ogType: "website"
jsonLd: WebApplication 스키마
```

### 7-2. SimpleToolShell props

```astro
<SimpleToolShell
  pageClass="medical-expense-claim-page"
  resultFirst={true}
  toolTitle="병원비 실손 청구 계산기"
  toolDescription="진료비를 입력하면 예상 환급액과 청구 실익을 바로 계산합니다"
>
```

### 7-3. aside 슬롯 구조

```html
<!-- Panel 1: 진료 정보 -->
<div class="input-panel">
  <div class="mecc-visit-tabs">
    <button data-visit="outpatient" aria-pressed="true">통원</button>
    <button data-visit="inpatient" aria-pressed="false">입원</button>
  </div>
  <div class="form-grid">
    <!-- 급여 진료비 -->
    <div class="field">
      <label>급여 진료비</label>
      <div class="input-with-unit">
        <input type="number" id="coveredFeeInput" value="30000" min="0" step="1000">
        <span>원</span>
      </div>
    </div>
    <!-- 비급여 진료비 -->
    <div class="field">
      <label>비급여 진료비</label>
      <div class="input-with-unit">
        <input type="number" id="nonCoveredFeeInput" value="0" min="0" step="1000">
        <span>원</span>
      </div>
    </div>
    <!-- 약제비 -->
    <div class="field">
      <label>약제비</label>
      <div class="input-with-unit">
        <input type="number" id="medicineFeeInput" value="5000" min="0" step="1000">
        <span>원</span>
      </div>
    </div>
  </div>
</div>

<!-- Panel 2: 실손 상품 정보 -->
<div class="input-panel">
  <div class="mecc-gen-tabs">
    <!-- 1세대~4세대 4버튼 -->
  </div>
  <div class="form-grid">
    <div class="field">
      <label>급여 자기부담률</label>
      <div class="input-with-unit">
        <input type="number" id="coveredCoPayRateInput" value="20" min="0" max="100">
        <span>%</span>
      </div>
    </div>
    <div class="field">
      <label>비급여 자기부담률</label>
      <div class="input-with-unit">
        <input type="number" id="nonCoveredCoPayRateInput" value="30" min="0" max="100">
        <span>%</span>
      </div>
    </div>
  </div>
  <p class="mecc-gen-note" id="meccGenNote"></p>
</div>

<!-- Panel 3: 무청구 할인 (선택) -->
<div class="input-panel">
  <div class="mecc-toggle-row">
    <span class="mecc-toggle-label">무청구 할인 특약 있음</span>
    <button class="mecc-toggle" id="discountToggle" aria-pressed="false">OFF</button>
  </div>
  <div class="mecc-toggle-target" id="discountFields" hidden>
    <div class="form-grid">
      <div class="field">
        <label>현재 월 보험료</label>
        <div class="input-with-unit">
          <input type="number" id="monthlyPremiumInput" value="60000" min="0" step="1000">
          <span>원</span>
        </div>
      </div>
      <div class="field">
        <label>무청구 할인율</label>
        <div class="input-with-unit">
          <input type="number" id="discountRateInput" value="10" min="1" max="30">
          <span>%</span>
        </div>
      </div>
      <div class="field field-span-full">
        <label>현재 무청구 경과 기간</label>
        <div class="input-with-unit">
          <input type="number" id="monthsElapsedInput" value="0" min="0" max="36">
          <span>개월</span>
        </div>
        <p class="field__hint">0~35개월: 아직 할인 미달성 / 36개월: 이미 할인 중</p>
      </div>
    </div>
  </div>
</div>

<!-- 버튼 -->
<div class="action-row">
  <button class="btn-primary" id="calcMeccBtn">계산하기</button>
  <button class="btn-ghost" id="resetMeccBtn">초기화</button>
</div>
```

### 7-4. main 슬롯 구조

```html
<!-- KPI 카드 -->
<div class="result-priority-panel">
  <div class="mecc-kpi-grid" id="meccKpiGrid">
    <div class="kpi-card">
      <p>예상 환급액</p>
      <strong id="kpiRefund">-</strong>
      <span id="kpiRefundSub"></span>
    </div>
    <div class="kpi-card">
      <p>자기부담금</p>
      <strong id="kpiSelfPay">-</strong>
      <span>실제 본인 부담</span>
    </div>
    <!-- 무청구 할인 ON 시만 표시 -->
    <div class="kpi-card" id="kpiWorthCard" hidden>
      <p>청구 실익</p>
      <strong id="kpiWorth">-</strong>
      <span id="kpiWorthSub"></span>
    </div>
    <div class="kpi-card kpi-card--verdict" id="kpiVerdictCard">
      <p>판정</p>
      <strong id="kpiVerdict">-</strong>
      <span id="kpiVerdictSub"></span>
    </div>
  </div>
</div>

<!-- 청구 항목 내역 -->
<section class="mecc-section">
  <div class="mecc-section__head">
    <p class="mecc-section__eyebrow">청구 내역</p>
    <h2>항목별 환급액</h2>
  </div>
  <div class="mecc-breakdown-grid">
    <div class="mecc-breakdown-card" id="breakdownCovered">...</div>
    <div class="mecc-breakdown-card" id="breakdownNonCovered">...</div>
    <div class="mecc-breakdown-card" id="breakdownMedicine">...</div>
  </div>
</section>

<!-- 무청구 할인 손실 비교 (ON 시) -->
<section class="mecc-section" id="discountCompareSection" hidden>
  <div class="mecc-discount-compare">...</div>
</section>

<!-- 가입 세대 정보 -->
<section class="mecc-section">
  <div class="mecc-gen-info-card" id="meccGenInfoCard">...</div>
</section>

<!-- 청구 불가 항목 -->
<section class="mecc-section">
  <InfoNotice type="warning" title="다음 항목은 실손보험 지급 제외입니다" items={MECC_EXCLUDED_ITEMS} />
</section>

<!-- 청구 절차 가이드 -->
<details class="mecc-steps-details">
  <summary>실손 청구 절차 안내</summary>
  <ol class="mecc-steps">...</ol>
</details>

<!-- 계산 기준 로직 패널 -->
<section class="mecc-section">
  <div class="logic-grid">...</div>
</section>

<!-- 면책 공지 -->
<InfoNotice type="caution" text={MECC_META.caution} />
```

---

## 8. 상태 관리

### 8-1. JS 상태 변수

```js
let currentVisitType = "outpatient";  // "outpatient" | "inpatient"
let currentGeneration = "gen3";       // "gen1" ~ "gen4"
let hasDiscount = false;
```

### 8-2. URL 파라미터

| 파라미터 | 입력 필드 | 기본값 |
|---------|---------|-------|
| `vt` | visitType | `out` |
| `gen` | generation | `gen3` |
| `cf` | coveredFee | `30000` |
| `ncf` | nonCoveredFee | `0` |
| `med` | medicineFee | `5000` |
| `ccp` | coveredCoPayRate | `20` |
| `nccp` | nonCoveredCoPayRate | `30` |
| `disc` | hasDiscount | `0` |
| `prem` | monthlyPremium | `60000` |
| `dr` | discountRate | `10` |
| `mo` | monthsElapsed | `0` |

---

## 9. SCSS (`src/styles/scss/pages/_medical-expense-claim-worth-calculator.scss`)

CSS 클래스 prefix: `mecc-`

### 9-1. 주요 클래스

| 클래스 | 설명 |
|--------|------|
| `.medical-expense-claim-page` | 최상위 page scope |
| `.mecc-visit-tabs` | 통원/입원 2버튼 탭 |
| `.mecc-gen-tabs` | 1~4세대 4버튼 탭 |
| `.mecc-gen-note` | 세대 특이사항 1줄 hint |
| `.mecc-toggle-row` | 무청구 할인 토글 행 |
| `.mecc-toggle` | ON/OFF 버튼 (`.is-active` 시 teal) |
| `.mecc-toggle-target` | 펼침 대상 (hidden 속성 제어) |
| `.mecc-kpi-grid` | KPI 카드 그리드 (2col → 4col) |
| `.kpi-card--verdict` | 판정 카드 (청구 권장: teal, 비권장: amber) |
| `.mecc-breakdown-grid` | 내역 카드 3열 그리드 |
| `.mecc-breakdown-card` | 항목별 환급 내역 카드 |
| `.mecc-discount-compare` | 무청구 할인 손실 비교 패널 |
| `.mecc-gen-info-card` | 세대 정보 카드 |
| `.mecc-steps-details` | 청구 절차 접기형 |
| `.mecc-steps` | 절차 ol |
| `.mecc-diff-positive` | 실익 양수 (teal) |
| `.mecc-diff-negative` | 실익 음수 (amber) |
| `.mecc-verdict--recommend` | 청구 권장 배지 (teal) |
| `.mecc-verdict--skip` | 청구 비권장 배지 (amber) |
| `.mecc-verdict--no-refund` | 청구 불가 배지 (gray) |
| `.field__hint` | 입력 필드 하단 힌트 텍스트 |

---

## 10. config JSON 구조 (Astro → JS)

```astro
<script id="meccConfig" type="application/json" set:html={JSON.stringify({
  generations: MECC_GENERATIONS,
  nhiRate: NHI_RATE,
  nonClaimPeriod: NON_CLAIM_DISCOUNT_PERIOD_MONTHS,
  defaults: MECC_DEFAULT,
})} />
```

JS에서:
```js
const CONFIG = JSON.parse(document.getElementById("meccConfig").textContent);
```

---

## 11. tools.ts 등록 (예정)

```ts
{
  slug: "medical-expense-claim-worth-calculator",
  title: "실손 청구 실익 계산기 2026",
  description: "진료비·비급여·약제비를 입력하면 실손보험 예상 환급액, 자기부담금, 무청구 할인과의 실익을 비교해 청구 권장 여부를 알려줍니다.",
  order: 70.2,
  eyebrow: "실손 청구 실익",
  category: "생활·유틸리티",
  iframeReady: true,
  badges: ["신규"],
  previewStats: [
    { label: "3만원 병원비", value: "환급 1.5만원" },
    { label: "무청구 할인", value: "비교 판정" },
  ],
}
```

---

## 12. SeoContent props

```astro
<SeoContent
  introHtml={`<p>실손보험(실비보험)은 가입자의 70~90%가 청구 방법이나 실익을 몰라 손해를 보는 경우가 많습니다. ...</p>`}
  tableHtml={세대별 자기부담률 표}
  faqItems={MECC_FAQ.map(f => ({ question: f.question, answer: f.answer }))}
  relatedLinks={MECC_RELATED_LINKS}
/>
```

---

## 13. 구현 순서

1. `src/data/medicalExpenseClaimCalculator.ts` 작성
2. `src/pages/tools/medical-expense-claim-worth-calculator.astro` 작성
   - BaseLayout, SimpleToolShell(resultFirst), aside/main/seo 슬롯 구성
   - config JSON 주입
3. `public/scripts/medical-expense-claim-worth-calculator.js` 작성
   - 세대 탭, 방문 유형 탭, 무청구 토글 이벤트
   - `compute()` → `renderKpi()`, `renderBreakdown()`, `renderDiscount()`, `renderGenInfo()`
   - `render()` → `writeParams()` 연동
   - IIFE `applyUrlParams()`
4. `src/styles/scss/pages/_medical-expense-claim-worth-calculator.scss` 작성
5. `src/styles/app.scss`에 import 추가
6. `src/data/tools.ts` 등록
7. `public/sitemap.xml` URL 추가
8. `npm run build` 검증

---

## 14. QA 포인트

- [ ] 통원/입원 전환 시 공단부담률 및 공제금액 즉시 반영
- [ ] 세대 탭 전환 시 자기부담률 자동 갱신, 수동 수정 시 유지
- [ ] 비급여 0원 입력 시 비급여 카드 "해당 없음" 표시
- [ ] 무청구 할인 OFF 시 실익 카드 숨김, ON 시 표시
- [ ] 총 진료비 0원 입력 시 "청구 불가 (진료비 없음)" 처리
- [ ] URL 파라미터 공유 후 복원 시 모든 입력값·세대·할인 toggle 정상 복원
- [ ] 판정 배지 색상 (권장: teal / 비권장: amber / 불가: gray)
- [ ] 모바일 400px 기준 레이아웃 이상 없음
- [ ] `npm run build` 에러 없음
