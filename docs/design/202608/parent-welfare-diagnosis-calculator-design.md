# 부모님 복지 통합 자동진단 — 설계 문서

> 기획 원문: `docs/plan/202608/parent-welfare-diagnosis-calculator.md`
> 작성일: 2026-07-22
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

- 구현 대상: `부모님 복지 통합 자동진단`
- slug: `parent-welfare-diagnosis-calculator`
- URL: `/tools/parent-welfare-diagnosis-calculator/`
- 카테고리: 복지/지원금
- 핵심 검색 의도: "부모님 복지 진단", "부모님 받을 수 있는 지원금", "노인 복지 자가진단"
- 핵심 출력: 6개 제도(기초연금/장기요양/노인일자리/기초생활보장/고령자 임대주택/감면)에 대한 4단계 판정 매트릭스
- 핵심 CTA: 각 제도 상세 계산기로 딥링크

이 계산기는 **신규 판정 로직을 만들지 않는다.** 아래 4개 기존 계산기의 실제 데이터 파일에서 확인한 상수·타입을 그대로 import해서 재사용한다(파일명은 2026-07 시점 코드베이스에서 확인 완료).

| 제도 | 재사용 데이터 파일 | 주요 export |
|---|---|---|
| 기초연금 | `src/data/basicPensionEligibilityCalculator.ts` | `BPEC_SELECTION_THRESHOLD`, `BPEC_MAX_BENEFIT`, `BPEC_BASIC_ASSET_DEDUCTION`, `BPEC_FINANCIAL_ASSET_DEDUCTION`, `BPEC_ASSET_CONVERSION_RATE_ANNUAL`, `BPEC_WORK_INCOME_DEDUCTION`, `BPEC_WORK_INCOME_RATE`, `BPEC_COUPLE_REDUCTION_RATE` |
| 장기요양보험 | `src/data/ltciGradeBenefit2026.ts` | `LTCI_GRADES`, `LTCI_BURDEN_TYPES`, `LTCI_SERVICES`, `LTCI_BURDEN_DETAIL` |
| 고령자 임대주택 | `src/data/seniorRentalHousingEligibility2026.ts` | `SRH_HOUSING_TYPES`, `SRH_INCOME_LEVEL_SCORE`, `SRH_HOMELESS_YEARS_SCORE`, `SRH_RESIDENCE_YEARS_SCORE`, `SRH_SUBSCRIPTION_SCORE`, `SRH_CAR_SCORE`, `SRH_JUDGMENT_BANDS` |
| 기초생활보장 | `src/data/welfareBenefitEligibility.ts` | `WBE_2026_THRESHOLDS`, `WBE_ASSET_DEDUCTION_BY_REGION`, `WBE_MONTHLY_CONVERSION_RATE`, `WBE_WORK_INCOME_DEDUCTION` |
| 노인일자리 | `src/data/seniorJobSalaryCalculator2026.ts` | (유형별 급여 상수 — 구현 착수 전 export 목록 재확인) |

> 중요: 위 파일들의 상수가 향후 개정되면 **이 계산기는 자동으로 최신값을 반영**해야 하므로, 절대 값을 복제(하드코딩)하지 않고 반드시 import해서 사용한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    parentWelfareDiagnosisCalculator.ts   ← 공통 입력 타입, 매트릭스 조합 로직, 프리셋, FAQ
                                             (개별 제도 상수는 위 4개 파일에서 import)
  pages/
    tools/
      parent-welfare-diagnosis-calculator.astro

public/
  scripts/
    parent-welfare-diagnosis-calculator.js

src/styles/scss/pages/
  _parent-welfare-diagnosis-calculator.scss
```

추가 등록: `src/data/tools.ts`(category: `support`), `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측 공통 입력(1회), 우측 매트릭스 결과.
- SCSS prefix: `pwd-`
- 결과는 **하나의 매트릭스 카드 리스트**로 통일 렌더링(제도별 개별 섹션 대신 반복 컴포넌트 1개 사용).

```astro
<SimpleToolShell calculatorId="parent-welfare-diagnosis-calculator" pageClass="pwd-page">
```

`InfoNotice` 고정 문구:

```text
이 진단은 여러 복지 제도를 한 번에 훑어보는 자가 점검용입니다.
정확한 심사는 국민연금공단·건강보험공단·주소지 주민센터에서 진행됩니다.
```

---

## 4. 데이터 모델

```ts
// src/data/parentWelfareDiagnosisCalculator.ts

export type LtciGradeInput = "none" | "1" | "2" | "3" | "4" | "5" | "인지지원";
export type PwdRegion = "metro" | "city" | "rural";
export type PwdHousingOwnership = "none" | "past" | "current";
export type JudgementLabel = "likely" | "borderline" | "needsCheck" | "unlikely";

export interface PwdInput {
  age: number;
  isCouple: boolean;              // 기초연금 단독/부부 가구 분기
  region: PwdRegion;
  ltciGrade: LtciGradeInput;      // 장기요양등급 보유 여부/등급

  earnedIncome: number;           // 근로·사업소득 월평균
  publicPension: number;          // 국민연금 등 공적연금 월평균
  otherIncome: number;            // 기타 소득 월평균

  realEstate: number;             // 부동산(자가 시가)
  financialAsset: number;         // 금융재산
  carValue: number;               // 자동차 가액
  housingOwnership: PwdHousingOwnership; // 무주택/과거주택/현재주택보유
}

export interface PwdBenefitStatus {
  id: "basicPension" | "ltci" | "seniorJob" | "livelihood" | "medical" | "housing" | "seniorRental" | "reduction";
  label: string;
  judgement: JudgementLabel;
  reasonSummary: string;          // 한 줄 근거
  detailLinkHref: string;         // 상세 계산기 딥링크
}

export interface PwdResult {
  statuses: PwdBenefitStatus[];
  likelyCount: number;
  needsCheckCount: number;
  unlikelyCount: number;
  estimatedMonthlyCashBenefit: number; // 확정 가능한 현금성 급여 합계(기초연금 등)
}

export interface PwdPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<PwdInput>;
}
```

---

## 5. 판정 로직 (기존 계산기 로직 재사용 매핑)

### 5-1. 기초연금 (`basicPensionEligibilityCalculator.ts` 재사용)

```text
householdType = isCouple ? 'couple' : 'single'
selectionThreshold = BPEC_SELECTION_THRESHOLD[householdType]
assetDeduction = BPEC_BASIC_ASSET_DEDUCTION[region]

incomeEvaluated = max(earnedIncome - BPEC_WORK_INCOME_DEDUCTION, 0) × BPEC_WORK_INCOME_RATE + otherIncome + publicPension
assetBase = max(realEstate + financialAsset - assetDeduction - BPEC_FINANCIAL_ASSET_DEDUCTION, 0)
assetMonthlyIncome = assetBase × BPEC_ASSET_CONVERSION_RATE_ANNUAL / 12
incomeRecognized = incomeEvaluated + assetMonthlyIncome

judgement:
  ratio = incomeRecognized / selectionThreshold
  ratio <= 0.95 → likely
  0.95~1.05 → borderline
  > 1.05 → unlikely

estimatedMonthlyBenefit = judgement === 'likely' ? BPEC_MAX_BENEFIT[householdType] : 0  # 간이 추정, 감액 미반영
```

reasonSummary 예: `"선정기준 대비 소득인정액 여유 있음"` / `"선정기준 초과로 어려움"`

### 5-2. 장기요양보험 (`ltciGradeBenefit2026.ts` 재사용)

```text
if ltciGrade === 'none':
  judgement = 'needsCheck'
  reasonSummary = '등급 미보유 — 장기요양등급 신청 여부 확인 필요'
else:
  judgement = 'likely'
  gradeRow = LTCI_GRADES.find(row => row.grade === ltciGrade)
  reasonSummary = `${ltciGrade}등급 — 월 급여한도 ${gradeRow.monthlyLimit} 적용`  # 실제 필드명은 LtciGradeRow 정의 재확인
```

### 5-3. 노인일자리

```text
if age >= 65:
  judgement = 'likely'
  reasonSummary = '만 65세 이상 기본 대상'
else:
  judgement = 'unlikely'
  reasonSummary = '연령 기준 미충족(만 65세 이상 대상)'
```

### 5-4. 기초생활보장(생계·의료·주거) (`welfareBenefitEligibility.ts` 재사용)

```text
householdSize = 1 (단독) 또는 2 (부부) 로 간이 매핑  # PwdInput에는 가구원수 입력이 없으므로 isCouple 기반 근사
threshold = WBE_2026_THRESHOLDS.find(t => t.householdSize === householdSize)
assetDeduction = WBE_ASSET_DEDUCTION_BY_REGION[region]

# welfare-benefit-eligibility.js와 동일한 간이 소득인정액 산식 재사용
incomeRecognized = (근로·사업소득 공제 후) + (재산 소득환산액)

각 급여(생계/의료/주거)에 대해:
  ratio = incomeRecognized / threshold[type]
  ratio <= 0.95 → likely / 0.95~1.05 → borderline / > 1.05 → unlikely
```

교육급여는 부모님 케이스에서는 관련성이 낮아 매트릭스에서 제외한다(기존 계산기에는 있으나 이 통합진단에는 미노출).

### 5-5. 고령자 임대주택 (`seniorRentalHousingEligibility2026.ts` 재사용)

```text
score =
  SRH_INCOME_LEVEL_SCORE[incomeLevelMapped]   # earnedIncome+publicPension+otherIncome 기준 구간 매핑
  + SRH_HOMELESS_YEARS_SCORE[homelessYearsMapped]  # PwdInput에 직접 필드 없으면 '확인 필요'로 강제 처리
  + SRH_CAR_SCORE[carScoreMapped]

judgement = SRH_JUDGMENT_BANDS에서 score 구간 매칭
```

> 공통 입력값(연령·소득·재산·자동차)만으로는 `거주기간`, `청약통장 가입기간` 등 세부 조건을 알 수 없으므로, 이 항목들이 필요한 경우 **judgement를 'needsCheck'로 강제**하고 reasonSummary에 "거주기간 등 추가 확인 필요"를 명시한다.

### 5-6. 감면(교통비·통신비·에너지)

```text
if basicPension.judgement === 'likely' OR livelihood.judgement === 'likely':
  judgement = 'likely'
  reasonSummary = '기초연금/기초생활수급 대상은 감면 자동 대상인 경우가 많음'
else:
  judgement = 'needsCheck'
  reasonSummary = '지자체별 조례에 따라 다름 — 별도 확인 필요'
```

---

## 6. 집계 로직

```text
likelyCount = statuses.filter(judgement === 'likely').length
needsCheckCount = statuses.filter(judgement === 'needsCheck').length
unlikelyCount = statuses.filter(judgement === 'unlikely').length

estimatedMonthlyCashBenefit =
  (basicPension.judgement === 'likely' ? basicPension.estimatedMonthlyBenefit : 0)
  + (livelihood.judgement === 'likely' ? livelihood 예상 생계급여액 : 0)
```

---

## 7. 프리셋

```ts
export const PWD_PRESETS: PwdPreset[] = [
  { id: "pension-only", label: "국민연금 단독 수급 노인", summary: "70세 · 단독 · 국민연금 40만", input: { age: 70, isCouple: false, publicPension: 400000 } },
  { id: "living-with-child", label: "자녀와 합가한 부모님", summary: "68세 · 자가 있음 · 금융재산 소액", input: { age: 68, isCouple: false, realEstate: 300000000, financialAsset: 5000000, housingOwnership: "current" } },
  { id: "ltci-grade3", label: "장기요양 3등급", summary: "75세 · 3등급 보유", input: { age: 75, isCouple: false, ltciGrade: "3" } },
  { id: "low-income-no-house", label: "저소득 무주택 노인", summary: "65세 · 무주택 · 소득 없음", input: { age: 65, isCouple: false, housingOwnership: "none" } },
  { id: "multi-house-retiree", label: "다주택 은퇴자", summary: "66세 · 다주택", input: { age: 66, isCouple: false, realEstate: 900000000, housingOwnership: "current" } },
];
```

---

## 8. 페이지 IA

1. **Hero** — "부모님 복지 통합 자동진단"
2. **InfoNotice** — 통합 자가 점검용 고지
3. **프리셋 버튼 5개**
4. **입력 패널** (Step 1 기본정보 / Step 2 소득 / Step 3 재산)
5. **핵심 요약 카드 4개**: 가능성 높음 제도 수 / 예상 월 수령액 합계 / 확인 필요 제도 수 / 어려움 제도 수
6. **제도별 매트릭스** (6~8개 카드, PC 2열/모바일 1열)
7. **자연어 결과 메시지**
8. **SeoContent(FAQ 포함)**

---

## 9. 입력 UI 상세

### Step 1 — 기본 정보

| 필드 | 타입 | 기본값 |
|---|---|---:|
| 나이 | number | 68 |
| 부부 여부 | toggle | false(단독) |
| 거주지역 | select(대도시/중소도시/농어촌) | 중소도시 |
| 장기요양등급 | select(없음/1~2/3~4/5/인지지원) | 없음 |

### Step 2 — 소득

| 필드 | 타입 | 기본값 |
|---|---|---:|
| 근로·사업소득 | number | 0 |
| 국민연금 등 공적연금 | number | 300,000 |
| 기타 소득 | number | 0 |

### Step 3 — 재산

| 필드 | 타입 | 기본값 |
|---|---|---:|
| 부동산(자가 시가) | number | 200,000,000 |
| 금융재산 | number | 10,000,000 |
| 자동차 가액 | number | 0 |
| 주택보유 여부 | select(무주택/과거보유/현재보유) | 현재보유 |

---

## 10. 결과 UI 상세

### 10-1. 핵심 요약 카드

| 카드 | 레이블 | 표시값 |
|---|---|---|
| Main | 가능성 높음 제도 수 | N개 |
| Accent | 예상 월 수령액 합계 | X만 원 |
| 일반 | 확인 필요 제도 수 | N개 |
| 일반 | 어려움 제도 수 | N개 |

### 10-2. 매트릭스 카드 (반복 컴포넌트)

```text
┌───────────────────────────────────────┐
│ [배지: 가능성 높음]  기초연금            │
│ 선정기준 대비 소득인정액 여유 있음        │
│                          [자세히 보기 →] │
└───────────────────────────────────────┘
```

배지 색상은 `welfare-benefit-eligibility` 계산기와 동일한 4색 체계(`likely`=초록, `borderline`=노랑, `needsCheck`=파랑, `unlikely`=회색)를 그대로 재사용한다.

### 10-3. 자연어 결과 메시지

```text
입력하신 조건 기준으로

✅ 기초연금 — 가능성 높음 (선정기준 대비 소득인정액 여유 있음)
✅ 노인일자리 — 신청 가능 (만 65세 이상 기본 대상)
🔍 고령자 임대주택 — 확인 필요 (거주기간 조건 추가 확인)
❌ 기초생활보장 생계급여 — 어려움 (소득인정액이 선정기준 초과)

로 진단됩니다. 장기요양등급이 없다면 등급 신청을 먼저 검토해보세요.
```

---

## 11. JavaScript 설계

```js
// public/scripts/parent-welfare-diagnosis-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('pwd-data').textContent);
  // DATA에는 astro 페이지에서 4개 기존 데이터 파일의 필요한 상수만 선별해 주입

  const state = {
    age: 68,
    isCouple: false,
    region: 'city',
    ltciGrade: 'none',
    earnedIncome: 0,
    publicPension: 300000,
    otherIncome: 0,
    realEstate: 200000000,
    financialAsset: 10000000,
    carValue: 0,
    housingOwnership: 'current',
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }

  function judgeBasicPension(s) {
    const householdType = s.isCouple ? 'couple' : 'single';
    const threshold = DATA.bpec.selectionThreshold[householdType];
    const assetDeduction = DATA.bpec.basicAssetDeduction[s.region];

    const workIncome = Math.max(s.earnedIncome - DATA.bpec.workIncomeDeduction, 0) * DATA.bpec.workIncomeRate;
    const assetBase = Math.max(s.realEstate + s.financialAsset - assetDeduction - DATA.bpec.financialAssetDeduction, 0);
    const assetMonthlyIncome = (assetBase * DATA.bpec.assetConversionRateAnnual) / 12;
    const incomeRecognized = workIncome + s.otherIncome + s.publicPension + assetMonthlyIncome;

    const ratio = incomeRecognized / threshold;
    let judgement = 'unlikely';
    if (ratio <= 0.95) judgement = 'likely';
    else if (ratio <= 1.05) judgement = 'borderline';

    const estimatedMonthlyBenefit = judgement === 'likely' ? DATA.bpec.maxBenefit[householdType] : 0;

    return {
      id: 'basicPension',
      label: '기초연금',
      judgement,
      reasonSummary: judgement === 'likely' ? '선정기준 대비 소득인정액 여유 있음' : '선정기준 초과 가능성',
      detailLinkHref: '/tools/basic-pension-eligibility-calculator/',
      estimatedMonthlyBenefit,
    };
  }

  function judgeLtci(s) {
    if (s.ltciGrade === 'none') {
      return {
        id: 'ltci', label: '장기요양보험', judgement: 'needsCheck',
        reasonSummary: '등급 미보유 — 등급 신청 여부 확인 필요',
        detailLinkHref: '/tools/ltci-grade-benefit-calculator-2026/',
      };
    }
    return {
      id: 'ltci', label: '장기요양보험', judgement: 'likely',
      reasonSummary: `${s.ltciGrade}등급 보유 — 등급별 급여한도 적용`,
      detailLinkHref: '/tools/ltci-grade-benefit-calculator-2026/',
    };
  }

  function judgeSeniorJob(s) {
    const judgement = s.age >= 65 ? 'likely' : 'unlikely';
    return {
      id: 'seniorJob', label: '노인일자리', judgement,
      reasonSummary: judgement === 'likely' ? '만 65세 이상 기본 대상' : '연령 기준 미충족',
      detailLinkHref: '/tools/senior-job-salary-calculator-2026/',
    };
  }

  function judgeLivelihoodGroup(s) {
    const householdSize = s.isCouple ? 2 : 1;
    const threshold = DATA.wbe.thresholds.find(t => t.householdSize === householdSize);
    const assetDeduction = DATA.wbe.assetDeductionByRegion[s.region];

    const incomeAfterDeduction = Math.max(s.earnedIncome - s.earnedIncome * 0.3, 0) + s.otherIncome + s.publicPension;
    const totalAsset = s.realEstate + s.financialAsset;
    const assetBase = Math.max(totalAsset - assetDeduction, 0);
    const assetMonthlyIncome = assetBase * DATA.wbe.financialAssetRate; // 간이 적용
    const incomeRecognized = incomeAfterDeduction + assetMonthlyIncome;

    return ['livelihood', 'medical', 'housing'].map(type => {
      const t = threshold[type];
      const ratio = incomeRecognized / t;
      let judgement = 'unlikely';
      if (ratio <= 0.95) judgement = 'likely';
      else if (ratio <= 1.05) judgement = 'borderline';
      return {
        id: type,
        label: { livelihood: '생계급여', medical: '의료급여', housing: '주거급여' }[type],
        judgement,
        reasonSummary: judgement === 'likely' ? '선정기준 이내' : '선정기준 초과 가능성',
        detailLinkHref: '/tools/welfare-benefit-eligibility/',
        estimatedMonthlyBenefit: type === 'livelihood' && judgement === 'likely' ? Math.max(t - incomeRecognized, 0) : 0,
      };
    });
  }

  function judgeSeniorRental(s) {
    // 공통 입력만으로는 거주기간·청약통장 가입기간을 알 수 없어 needsCheck 우선
    return {
      id: 'seniorRental', label: '고령자 임대주택', judgement: 'needsCheck',
      reasonSummary: '거주기간·청약통장 가입기간 등 추가 확인 필요',
      detailLinkHref: '/tools/senior-rental-housing-eligibility-calculator-2026/',
    };
  }

  function judgeReduction(basicPensionStatus, livelihoodStatus) {
    const eligible = basicPensionStatus.judgement === 'likely' || livelihoodStatus.judgement === 'likely';
    return {
      id: 'reduction', label: '교통비·통신비·에너지 감면', judgement: eligible ? 'likely' : 'needsCheck',
      reasonSummary: eligible ? '기초연금/기초생활수급 대상은 감면 자동 대상인 경우가 많음' : '지자체별 조례 확인 필요',
      detailLinkHref: '/reports/2026-government-welfare-benefits/',
    };
  }

  function calculate(s) {
    const basicPension = judgeBasicPension(s);
    const ltci = judgeLtci(s);
    const seniorJob = judgeSeniorJob(s);
    const livelihoodGroup = judgeLivelihoodGroup(s);
    const seniorRental = judgeSeniorRental(s);
    const livelihood = livelihoodGroup.find(x => x.id === 'livelihood');
    const reduction = judgeReduction(basicPension, livelihood);

    const statuses = [basicPension, ltci, seniorJob, ...livelihoodGroup, seniorRental, reduction];

    const likelyCount = statuses.filter(x => x.judgement === 'likely').length;
    const needsCheckCount = statuses.filter(x => x.judgement === 'needsCheck').length;
    const unlikelyCount = statuses.filter(x => x.judgement === 'unlikely').length;
    const estimatedMonthlyCashBenefit =
      (basicPension.estimatedMonthlyBenefit || 0) + (livelihood?.estimatedMonthlyBenefit || 0);

    return { statuses, likelyCount, needsCheckCount, unlikelyCount, estimatedMonthlyCashBenefit };
  }

  function renderSummary(result) {}
  function renderMatrix(result) {}
  function renderMessage(result) {}
  function syncUrl(state) {}
  function restoreFromUrl() {}
  function applyPreset(id) {}

  function readInputs() {
    state.age = num(q('[data-pwd="age"]')?.value, 68);
    state.isCouple = q('[data-pwd="isCouple"]')?.checked ?? false;
    state.region = q('[data-pwd="region"]')?.value || 'city';
    state.ltciGrade = q('[data-pwd="ltciGrade"]')?.value || 'none';
    state.earnedIncome = num(q('[data-pwd="earnedIncome"]')?.value, 0);
    state.publicPension = num(q('[data-pwd="publicPension"]')?.value, 300000);
    state.otherIncome = num(q('[data-pwd="otherIncome"]')?.value, 0);
    state.realEstate = num(q('[data-pwd="realEstate"]')?.value, 200000000);
    state.financialAsset = num(q('[data-pwd="financialAsset"]')?.value, 10000000);
    state.carValue = num(q('[data-pwd="carValue"]')?.value, 0);
    state.housingOwnership = q('[data-pwd="housingOwnership"]')?.value || 'current';
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderSummary(result);
    renderMatrix(result);
    renderMessage(result);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-pwd]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    qa('[data-pwd-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.pwdPreset));
    });
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터: `age / couple / region / ltci / earned / public / other / re / fa / car / house`

---

## 12. SCSS 설계 (핵심 발췌)

```scss
.pwd-page {
  .pwd-matrix-grid {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .pwd-matrix-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 14px 16px;
    background: #fff;
    display: grid;
    gap: 6px;
  }

  .pwd-matrix-card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pwd-matrix-card__title {
    font-weight: 800;
    font-size: 0.92rem;
    color: #111827;
  }

  .pwd-status-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 0.74rem;
    font-weight: 800;

    &--likely { background: #dcfce7; color: #166534; }
    &--borderline { background: #fef3c7; color: #92400e; }
    &--needsCheck { background: #dbeafe; color: #1e40af; }
    &--unlikely { background: #f3f4f6; color: #4b5563; }
  }

  .pwd-matrix-card__reason {
    font-size: 0.82rem;
    color: #6b7280;
  }

  .pwd-matrix-card__link {
    justify-self: end;
    font-size: 0.8rem;
    font-weight: 700;
    color: #0f6e56;
    text-decoration: none;
  }

  .pwd-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
```

---

## 13. SEO 설계

```text
title: 부모님 복지 자동진단 2026 | 기초연금·장기요양·임대주택 한 번에 확인
description: 부모님 나이·소득·재산을 입력하면 기초연금, 장기요양보험, 노인일자리, 기초생활보장, 고령자 임대주택까지 받을 수 있는 복지를 한 화면에서 자가 진단합니다.
H1: 부모님 복지 통합 자동진단
```

키워드: 부모님 복지 진단, 부모님 받을 수 있는 지원금, 노인 복지 자가진단, 기초연금 장기요양 동시, 노인 복지 총정리 2026

---

## 14. SeoContent 초안

### intro

1. 부모님이 받을 수 있는 복지는 기초연금, 장기요양보험, 노인일자리, 기초생활보장, 고령자 임대주택, 각종 감면 등 여러 갈래로 나뉘어 있어 하나씩 따로 확인하기 번거롭습니다. 이 계산기는 나이, 소득, 재산 같은 공통 정보를 한 번만 입력하면 여러 제도의 신청 가능성을 동시에 보여줍니다.

2. 각 제도의 판정은 이미 검증되어 서비스 중인 개별 계산기(기초연금, 장기요양등급, 고령자 임대주택, 기초생활보장)의 기준과 산식을 그대로 재사용합니다. 판정이 어려운 항목은 숨기지 않고 "확인 필요"로 투명하게 표시하고 상세 계산기로 연결합니다.

3. 이 진단은 여러 제도를 한 번에 훑어보는 자가 점검용이며, 실제 신청과 심사는 복지로, 국민연금공단, 건강보험공단, 주소지 주민센터를 통해 진행해야 합니다.

### criteria

- 기초연금·기초생활보장·장기요양·고령자 임대주택 판정 기준은 각 개별 계산기의 최신 데이터를 그대로 재사용합니다.
- 판정 라벨은 "가능성 높음/경계/확인 필요/어려움" 4단계로 통일합니다.
- 지자체별로 다른 항목(노인일자리 유형, 감면 폭)은 전국 공통과 지자체 확인 필요를 구분해 표시합니다.

### FAQ

```ts
export const PWD_FAQ = [
  { question: "여러 복지를 동시에 받을 수 있나요?", answer: "제도별로 다릅니다. 기초연금과 노인일자리처럼 동시에 받을 수 있는 조합이 있는 반면, 기초생활보장 생계급여처럼 다른 급여와 함께 조정되는 제도도 있습니다." },
  { question: "이 진단 결과로 바로 신청하면 되나요?", answer: "아닙니다. 이 계산기는 자가 점검용 통합 진단이며, 실제 신청은 복지로 또는 주소지 주민센터·국민연금공단에서 정식 심사를 거쳐야 합니다." },
  { question: "왜 '확인 필요'로 나오는 항목이 있나요?", answer: "거주기간, 지자체별 조례, 서류 조건처럼 공통 입력값만으로는 판단하기 어려운 조건이 있는 제도는 '확인 필요'로 표시하고 상세 계산기로 연결합니다." },
  { question: "자동차가 있으면 불리한가요?", answer: "기초연금·기초생활보장 등 일부 제도에서는 자동차 가액이 재산에 반영될 수 있습니다. 정확한 반영 방식은 각 제도 상세 계산기에서 확인하세요." },
  { question: "장기요양등급이 없으면 손해인가요?", answer: "장기요양등급이 없어도 기초연금, 노인일자리 등 다른 복지는 별도로 신청할 수 있습니다." },
];
```

---

## 15. 관련 링크

- `/tools/basic-pension-eligibility-calculator/`
- `/tools/ltci-grade-benefit-calculator-2026/`
- `/tools/senior-rental-housing-eligibility-calculator-2026/`
- `/tools/welfare-benefit-eligibility/`
- `/tools/senior-job-salary-calculator-2026/`
- `/reports/nursing-home-vs-home-care-cost-2026/`

---

## 16. QA 체크리스트

- [ ] 4개 재사용 데이터 파일의 실제 export 이름이 이 설계 문서와 정확히 일치하는지 구현 착수 전 재확인
- [ ] 장기요양등급 "없음" 선택 시 등급 관련 필드가 판정에 영향 주지 않고 즉시 "확인 필요"로 전환
- [ ] 기초연금·기초생활보장 판정이 개별 계산기와 동일 입력 시 동일한 결과를 내는지 교차 검증
- [ ] 자동차 가액 입력이 현재 MVP 판정에 직접 반영되지 않는 경우 UI에서 "참고용"임을 명시
- [ ] 매트릭스 카드 8개(기초연금/장기요양/노인일자리/생계/의료/주거/임대주택/감면)가 항상 렌더링됨
- [ ] 예상 월 수령액 합계가 기초연금+생계급여만 반영하고 이중 계산되지 않음
- [ ] 딥링크(`detailLinkHref`)가 실제 존재하는 라우트인지 확인
- [ ] URL 파라미터 복원 정상 동작
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
