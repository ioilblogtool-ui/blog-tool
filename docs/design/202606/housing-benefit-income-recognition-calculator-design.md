# 주거급여 계산기 2026 설계 문서

> 작성일: 2026-06-19
> 구현 대상: `/tools/housing-benefit-income-recognition/`
> 콘텐츠 유형: 계산기형 도구
> 선행 기획: `docs/plan/202606/housing-benefit-income-recognition-calculator.md`
> 기존 모페이지: `/tools/welfare-benefit-eligibility/`, 형제 페이지: `/tools/livelihood-benefit-income-recognition/`

---

## 1. 설계 요약

이 페이지는 생계급여 계산기(`/tools/livelihood-benefit-income-recognition/`)와 같은 패턴을 따르는 검색 의도 전용 랜딩이다. 다만 생계급여 계산기와 다른 지점이 하나 있다 — **소득인정액 통과 여부만으로 끝나지 않는다.**

사용자가 기대하는 첫 답은 다음 두 단계다.

1. 내 소득인정액이 주거급여 선정기준(중위소득 48%)보다 낮은가
2. 통과한다면 — 임차가구는 "월세를 얼마까지 보전받는가", 자가가구는 "수선비 지원을 얼마 받는가"

따라서 이 계산기는 **소득인정액 계산(1단계, 생계급여 계산기와 로직 공유) → 거주 형태 분기 계산(2단계, 신규)** 구조를 가진다. 결과 화면도 거주 형태에 따라 다른 카드 세트를 렌더링해야 한다.

모든 계산 결과에는 `자가 점검용 추정`, `공식 고시값 단순화`, `확인 필요` 배지를 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    housingBenefitIncomeRecognition.ts
      - 페이지 메타
      - 프리셋
      - FAQ
      - SEO 본문
      - 관련 링크
      - 기준임대료 테이블(급지 × 가구원수)
      - 수선비용 테이블(경/중/대보수)
      - 기존 WBE 소득인정액 유틸 재사용(import)

  pages/
    tools/
      housing-benefit-income-recognition.astro
      - SimpleToolShell 기반 페이지
      - 입력 폼(거주 형태 분기 포함)
      - 결과 패널(거주 형태별 분기 섹션)
      - 기준표/해설/FAQ

public/
  scripts/
    housing-benefit-income-recognition.js
      - 입력 상태 관리
      - 1단계: 소득인정액 계산 (생계급여 계산기와 동일 로직)
      - 2단계: 거주 형태별 분기 계산
      - URL state
      - DOM 렌더링(분기 섹션 show/hide)

src/styles/scss/pages/
  _housing-benefit-income-recognition.scss
      - prefix: hbirc-

등록 파일:
  src/data/tools.ts
  src/styles/app.scss
  public/sitemap.xml
  src/pages/tools/index.astro (topicBySlug: "복지·지원금")
```

소득인정액 계산 로직은 `src/data/welfareBenefitEligibility.ts`에서 가져온다. 가능하면 `src/data/livelihoodBenefitIncomeRecognition.ts`에 이미 분리된 함수가 있다면 그쪽을 우선 재사용하고, 없다면 `welfareBenefitEligibility.ts`에서 직접 가져온다. **소득인정액 계산식을 이 파일에서 새로 작성하지 않는다** — 두 계산기 간 기준값 불일치를 막기 위함이다.

---

## 3. 라우팅 및 메타

### URL

```text
/tools/housing-benefit-income-recognition/
```

### tools.ts 등록안

```ts
{
  slug: "housing-benefit-income-recognition",
  title: "주거급여 계산기 2026",
  description: "가구원 수, 월소득, 재산, 거주 형태를 입력하면 주거급여 선정기준 통과 여부와 예상 기준임대료·수선비용을 바로 계산합니다.",
  order: 4.72,
  eyebrow: "주거급여 계산",
  category: "support",
  iframeReady: true,
  badges: ["신규", "주거급여", "기준임대료", "2026"],
  previewStats: [
    { label: "4인 주거급여 기준", value: "311.7만 원" },
    { label: "결과", value: "기준임대료·수선비" }
  ],
}
```

order는 생계급여 계산기(4.71) 바로 다음으로 배치해 같은 클러스터로 인접 정렬한다.

### BaseLayout 메타

```ts
title: "주거급여 계산기 2026 | 기준임대료 바로 계산"
description: "가구원 수, 월소득, 재산, 거주 형태를 입력하면 주거급여 선정기준 통과 여부와 예상 기준임대료·수선비용을 바로 계산합니다."
```

타이틀 25자, CLAUDE.md 메타 공식(`{대상} 계산기 {연도} | {핵심 결과} 바로 계산`) 충족.

### JSON-LD

- `WebApplication` (`applicationCategory: "UtilityApplication"`)
- `FAQPage`
- `BreadcrumbList`

---

## 4. 데이터 설계

### 기존 데이터 재사용

```ts
import {
  WBE_2026_THRESHOLDS,
  WBE_ASSET_DEDUCTION_BY_REGION,
  WBE_MONTHLY_CONVERSION_RATE,
  WBE_WORK_INCOME_DEDUCTION,
  WBE_HOUSING_LABELS,
} from "./welfareBenefitEligibility";
```

소득인정액 계산 함수(소득평가액, 재산의 소득환산액, 소득인정액)는 생계급여 계산기 파일에 이미 분리되어 있다면 함수를 직접 import해서 재호출한다. 분리되어 있지 않다면 이번 구현에서 `welfareBenefitEligibility.ts` 쪽에 공용 유틸로 끌어올리는 작업을 함께 한다(생계급여 계산기 파일도 같은 유틸을 가리키도록 리팩터링).

### 신규 타입

```ts
export type HbircZone = "zone1" | "zone2" | "zone3" | "zone4"; // 1~4급지
export type HbircHousingType = "rent" | "jeonse" | "own" | "free";
export type HbircRepairGrade = "minor" | "medium" | "major"; // 경/중/대보수
export type HbircRiskLevel = "likely" | "borderline" | "over" | "needs-check";

export interface HbircInput {
  householdSize: number;
  region: "metro" | "city" | "rural"; // 기본재산액 공제용 (WBE 재사용)
  zone: HbircZone; // 기준임대료 산정용 급지
  housingType: HbircHousingType;
  earnedIncome: number;
  publicTransferIncome: number;
  privateTransferIncome: number;
  propertyIncome: number;
  housingAsset: number;
  generalAsset: number;
  financialAsset: number;
  debt: number;
  hasCar: boolean;
  carValue: number;
  applyWorkDeduction: boolean;
  // 임차가구 전용
  monthlyRent: number;
  jeonseDeposit: number;
  // 자가가구 전용
  houseAge: number;
  repairGrade: HbircRepairGrade;
}

export interface HbircIncomeResult {
  householdSize: number;
  medianIncome: number;
  housingThreshold: number;
  livelihoodThreshold: number; // 자기부담분 계산에 필요 (생계급여 기준 재사용)
  incomeAfterDeduction: number;
  assetMonthlyIncome: number;
  incomeRecognized: number;
  ratioToHousingThreshold: number;
  judgement: HbircRiskLevel;
}

export interface HbircRentResult {
  zone: HbircZone;
  standardRent: number; // 기준임대료
  effectiveRent: number; // min(실제월세, 기준임대료)
  selfBurden: number; // 자기부담분
  estimatedBenefit: number; // 예상 주거급여 지급액(임차)
}

export interface HbircRepairResult {
  grade: HbircRepairGrade;
  baseAmount: number; // 기준 지원금액
  supportRatio: number; // 소득구간별 차등 비율
  estimatedAmount: number; // 예상 지원금액(자가)
}

export interface HbircResult {
  input: HbircInput;
  income: HbircIncomeResult;
  rent: HbircRentResult | null; // housingType이 rent/jeonse일 때만
  repair: HbircRepairResult | null; // housingType이 own일 때만
  warningFlags: HbircWarningFlag[];
  nextActions: HbircNextAction[];
}

export interface HbircWarningFlag {
  id: "car" | "asset" | "debt" | "rent-over-standard" | "estimate" | "no-burden-removed";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
}

export interface HbircNextAction {
  id: "apply" | "livelihood" | "welfare-hub" | "compare-welfare" | "report";
  label: string;
  href: string;
  reason: string;
  priority: "high" | "medium" | "low";
}
```

### 상수 — 페이지 메타

```ts
export const HBIRC_META = {
  slug: "housing-benefit-income-recognition",
  title: "주거급여 계산기 2026",
  seoTitle: "주거급여 계산기 2026 | 기준임대료 바로 계산",
  seoDescription: "가구원 수, 월소득, 재산, 거주 형태를 입력하면 주거급여 선정기준 통과 여부와 예상 기준임대료·수선비용을 바로 계산합니다.",
  updatedAt: "2026-06-19",
  dataNote: "2026년 기준 중위소득, 주거급여 선정기준, 기준임대료 고시값을 단순화한 자가 점검용 추정입니다. 실제 수급 여부와 지급액은 주민센터 조사와 국토교통부 고시로 결정됩니다.",
};
```

### 상수 — 기준임대료 테이블 (급지 × 가구원 수)

```ts
export const HBIRC_ZONE_LABELS: Record<HbircZone, string> = {
  zone1: "1급지 (서울)",
  zone2: "2급지 (경기·인천)",
  zone3: "3급지 (광역시·세종·수도권 외 시)",
  zone4: "4급지 (그 외 지역)",
};

export const HBIRC_STANDARD_RENT: Record<HbircZone, Record<number, number>> = {
  zone1: { 1: 352000, 2: 395000, 3: 470000, 4: 545000, 5: 564000, 6: 666000 },
  zone2: { 1: 273000, 2: 304000, 3: 365000, 4: 422000, 5: 437000, 6: 516000 },
  zone3: { 1: 217000, 2: 240000, 3: 287000, 4: 333000, 5: 344000, 6: 406000 },
  zone4: { 1: 188000, 2: 208000, 3: 250000, 4: 289000, 5: 298000, 6: 353000 },
};
```

> 데이터 출처 주석: "2026년 국토교통부 주거급여 기준임대료 고시 단순화. 실제 신청 전 LH 주거급여 콜센터(1600-0777) 또는 복지로 최신 고시값 확인 필요." 구현 단계에서 최신 고시 발표 시 이 테이블을 갱신한다.

가구원 수 7인 이상은 6인 테이블값을 그대로 사용하고 UI에 "7인 이상은 6인 기준으로 간이 계산" 안내를 노출한다.

### 상수 — 자기부담비율

```ts
export const HBIRC_SELF_BURDEN_RATE = 0.3; // 소득인정액이 생계급여 기준 초과 시 적용하는 간이 비율
```

### 상수 — 수선비용 테이블

```ts
export const HBIRC_REPAIR_TABLE: Record<HbircRepairGrade, { label: string; cycleYears: number; baseAmount: number; description: string }> = {
  minor: { label: "경보수", cycleYears: 3, baseAmount: 5930000, description: "도배, 장판 등 마감재 개선" },
  medium: { label: "중보수", cycleYears: 5, baseAmount: 9790000, description: "창문, 단열, 보일러 등 기능 개선" },
  major: { label: "대보수", cycleYears: 7, baseAmount: 13910000, description: "지붕, 욕실, 주방 등 구조 개선" },
};

export const HBIRC_REPAIR_SUPPORT_RATIO = {
  livelihoodRecipient: 1.0, // 생계급여 수급자 추정 시
  housingOnly: 0.9, // 주거급여만 통과 시
};
```

주택 사용연수 → 권장 보수 등급 매핑(UI 기본값 추정용, 직접 선택으로 덮어쓰기 가능):

```ts
export function suggestRepairGrade(houseAge: number): HbircRepairGrade {
  if (houseAge < 15) return "minor";
  if (houseAge < 20) return "medium";
  return "major";
}
```

### 프리셋

```ts
export const HBIRC_PRESETS = [
  {
    id: "single-rent-zone2",
    label: "1인 임차(경기·인천)",
    summary: "월소득 80만 원, 월세 35만 원",
    input: { householdSize: 1, housingType: "rent", zone: "zone2", earnedIncome: 800000, monthlyRent: 350000 },
  },
  {
    id: "family-four-rent-zone1",
    label: "4인 임차(서울)",
    summary: "월소득 250만 원, 월세 55만 원",
    input: { householdSize: 4, housingType: "rent", zone: "zone1", earnedIncome: 2500000, monthlyRent: 550000 },
  },
  {
    id: "elderly-own-rural",
    label: "노인 자가(농어촌)",
    summary: "공적이전 70만 원, 주택 22년차",
    input: { householdSize: 1, housingType: "own", region: "rural", publicTransferIncome: 700000, houseAge: 22, repairGrade: "major" },
  },
  {
    id: "jeonse-two",
    label: "2인 전세",
    summary: "전세보증금 1.2억, 월소득 150만 원",
    input: { householdSize: 2, housingType: "jeonse", zone: "zone2", earnedIncome: 1500000, jeonseDeposit: 120000000 },
  },
];
```

### 데이터 배지 매핑

```ts
export const HBIRC_DATA_BADGES = {
  threshold: "공식",
  standardRent: "공식 고시값 단순화",
  incomeRecognized: "추정",
  estimatedBenefit: "추정",
  repairAmount: "추정",
  carAndAsset: "확인 필요",
};
```

---

## 5. 계산 로직 설계

### 함수 분리

```js
// 1단계: 소득인정액 (생계급여 계산기와 공유 또는 동일 포팅)
function getHousingThreshold(householdSize) {}
function getLivelihoodThreshold(householdSize) {}
function calculateIncomeRecognized(input) {} // WBE 공용 유틸 재사용

// 2단계: 거주 형태 분기
function getStandardRent(zone, householdSize) {}
function calculateJeonseAsMonthlyRent(jeonseDeposit) {} // 전세 → 월세 환산(전월세 전환율)
function calculateRentBenefit(income, input) {}
function calculateRepairBenefit(income, input) {}

// 판정/경고/다음 행동
function judgeHousing(income) {}
function buildWarningFlags(input, income, rentOrRepair) {}
function buildNextActions(input, income) {}

function calculate(input) {} // 전체 오케스트레이션
```

### 계산 순서

```text
1. 가구원 수로 기준 중위소득 / 주거급여 선정기준(48%) / 생계급여 선정기준(32%) 조회
2. 소득평가액, 재산의 소득환산액 계산 (생계급여 계산기와 동일 로직)
3. 소득인정액 계산
4. 주거급여 기준 대비 판정 (likely/borderline/over)
5. 거주 형태 분기:
   a. rent  → 기준임대료 조회 → 자기부담분 계산 → 예상 지급액
   b. jeonse → 보증금을 월세로 환산 후 a와 동일 처리
   c. own   → 수선 등급 결정(직접 선택 우선, 없으면 주택연수로 추정) → 지원 비율 결정 → 예상 지원금액
   d. free  → 분기 계산 생략, 안내 문구만 노출
6. 경고 플래그 / 다음 행동 생성
```

### 핵심 공식 — 1단계(소득인정액, 생계급여 계산기와 동일)

```text
월소득합계 = 근로·사업소득 + 공적 이전소득 + 사적 이전소득 + 재산소득
근로소득공제 = min(근로·사업소득 × 30%, 600,000원)
소득평가액 = max(월소득합계 - 근로소득공제, 0)

순재산 = max(주거재산 + 일반재산 + 금융재산 - 부채 - 지역별 기본재산액, 0)
재산의 소득환산액 = 주거·일반재산 환산액 + 금융재산 환산액

소득인정액 = 소득평가액 + 재산의 소득환산액
주거급여 기준 대비 비율 = 소득인정액 / 주거급여 선정기준(중위소득 48%)
```

### 핵심 공식 — 2단계(임차가구)

```text
기준임대료 = HBIRC_STANDARD_RENT[zone][min(householdSize, 6)]

전세인 경우:
  환산 월세 = jeonseDeposit × 전월세전환율(연 5.5% 가정) / 12
  실제월세로 사용

실제월세반영액 = min(실제월세 또는 환산월세, 기준임대료)

if 소득인정액 <= 생계급여 선정기준:
  자기부담분 = 0
else:
  자기부담분 = (소득인정액 - 생계급여 선정기준) × HBIRC_SELF_BURDEN_RATE

예상 지급액 = max(실제월세반영액 - 자기부담분, 0)
```

실제 월세가 기준임대료를 초과하면 `rent-over-standard` 경고 플래그를 추가하고, "초과분은 본인 부담입니다" 문구를 결과에 노출한다.

### 핵심 공식 — 2단계(자가가구)

```text
보수등급 = repairGrade가 직접 선택되어 있으면 그 값, 아니면 suggestRepairGrade(houseAge)
기준지원금액 = HBIRC_REPAIR_TABLE[보수등급].baseAmount

지원비율 = 소득인정액 <= 생계급여 선정기준
  ? HBIRC_REPAIR_SUPPORT_RATIO.livelihoodRecipient (100%)
  : HBIRC_REPAIR_SUPPORT_RATIO.housingOnly (90%)

예상지원금액 = 기준지원금액 × 지원비율
```

### 판정 기준

```js
if (incomeRecognized <= housingThreshold * 0.95) judgement = "likely";
else if (incomeRecognized <= housingThreshold * 1.05) judgement = "borderline";
else judgement = "over";

if (hasCar || carValue > 0) addWarning("car");
if (housingType === "rent" && monthlyRent > standardRent) addWarning("rent-over-standard");
if (debt > 0) addWarning("debt");
```

판정 문구(생계급여 계산기와 동일 어조 유지):

| 상태 | 표시 문구 |
|---|---|
| `likely` | 주거급여 신청 가능성이 있는 구간입니다 |
| `borderline` | 기준선 근처라 실제 조사에서 달라질 수 있습니다 |
| `over` | 입력값 기준으로는 주거급여 기준을 초과한 것으로 보입니다 |
| `needs-check` | 자동차·재산·임대차 확인이 필요한 항목이 있습니다 |

---

## 6. UI 구조

### 전체 레이아웃

`SimpleToolShell` 기반, 생계급여 계산기와 동일한 골격을 사용한다.

```astro
<SimpleToolShell
  calculatorId="housing-benefit-income-recognition"
  pageClass="hbirc-page"
  resultFirst={false}
>
```

### 섹션 순서

1. Hero
2. InfoNotice
3. 빠른 기준표 (주거급여 선정기준 + 급지 안내)
4. 입력 폼 (거주 형태 선택 → 분기 입력 노출)
5. 결과 KPI (공통: 소득인정액/선정기준/판정)
6. 주거급여 기준선 게이지
7. 거주 형태별 분기 결과 (임차: 기준임대료 막대 / 자가: 수선등급 카드)
8. 경고 플래그
9. 다음 확인 CTA
10. 2026 주거급여 선정기준표 + 기준임대료 전체표
11. 자가가구 수선비용 안내
12. FAQ
13. 관련 링크(생계급여 계산기, 통합 계산기)
14. SEO 본문

---

## 7. 입력 UI 상세

### 빠른 프리셋

```html
<div class="hbirc-preset-grid">
  <button type="button" data-hbirc-preset="single-rent-zone2">1인 임차</button>
  <button type="button" data-hbirc-preset="family-four-rent-zone1">4인 임차(서울)</button>
  <button type="button" data-hbirc-preset="elderly-own-rural">노인 자가</button>
  <button type="button" data-hbirc-preset="jeonse-two">2인 전세</button>
</div>
```

### 거주 형태 선택 (분기 트리거)

```html
<div class="hbirc-segment" role="group" aria-label="거주 형태">
  <button type="button" data-hbirc-housing="rent" aria-pressed="true">월세</button>
  <button type="button" data-hbirc-housing="jeonse" aria-pressed="false">전세</button>
  <button type="button" data-hbirc-housing="own" aria-pressed="false">자가</button>
  <button type="button" data-hbirc-housing="free" aria-pressed="false">무상거주</button>
</div>
```

선택값에 따라 `data-hbirc-branch="rent"`, `="jeonse"`, `="own"`, `="free"` 패널을 토글한다. `free`는 입력 없이 안내 문구만 노출.

### 기본 입력 필드

| DOM id/name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `householdSize` | 가구원 수 | select | `4` |
| `zone` | 거주 지역(급지) | select | `zone2` |
| `region` | 기본재산액 지역(대도시/중소도시/농어촌) | select | `metro` |
| `earnedIncome` | 월 근로·사업소득 | number | `1500000` |
| `publicTransferIncome` | 공적 이전소득 | number | `0` |
| `housingAsset` | 주거재산 | number | `50000000` |
| `financialAsset` | 금융재산 | number | `5000000` |
| `debt` | 인정 가능 부채 | number | `0` |
| `hasCar` | 자동차 있음 | checkbox | `false` |

### 분기 입력 — 월세

| DOM id/name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `monthlyRent` | 실제 월 임차료 | number | `450000` |

### 분기 입력 — 전세

| DOM id/name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `jeonseDeposit` | 전세보증금 | number | `150000000` |

### 분기 입력 — 자가

| DOM id/name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `houseAge` | 주택 사용연수 | number | `15` |
| `repairGrade` | 보수 등급(직접 선택, 선택 안 하면 연수로 추정) | select(자동/경보수/중보수/대보수) | `자동` |

### 상세 입력 접기

```html
<details class="hbirc-advanced">
  <summary>상세 입력 열기</summary>
  ...
</details>
```

일반재산, 사적 이전소득, 재산소득, 자동차가액을 둔다. 주거급여는 부양의무자 기준이 폐지되었으므로 해당 입력은 제공하지 않고 FAQ로만 설명한다.

### 입력 UX 규칙

- 금액 입력은 원 단위, placeholder는 숫자만 (`예: 450000`)
- 표시값은 `45만 원`처럼 포맷
- 빈 값/음수는 0 처리
- 가구원 수 7인 이상은 "현재 간이 계산은 6인 기준으로 계산" 안내
- 거주 형태 전환 시 이전 분기 입력값은 메모리에 유지(재전환 시 복원), 계산에는 현재 분기만 사용

---

## 8. 결과 UI 상세

### KPI 카드 (공통)

```html
<section class="hbirc-result-kpis">
  <article class="hbirc-kpi hbirc-kpi--main">
    <span>소득인정액 추정</span>
    <strong data-hbirc-result="incomeRecognized">185만 원</strong>
    <small>자가 점검용 추정</small>
  </article>
  <article class="hbirc-kpi">
    <span>주거급여 선정기준</span>
    <strong data-hbirc-result="housingThreshold">311만 7,474원</strong>
  </article>
  <article class="hbirc-kpi">
    <span>판정</span>
    <strong data-hbirc-result="judgement">신청 가능성 있음</strong>
  </article>
</section>
```

### KPI 카드 (임차 분기, `data-hbirc-branch-result="rent"`)

```html
<section class="hbirc-result-kpis hbirc-result-kpis--rent" data-hbirc-branch-result="rent">
  <article class="hbirc-kpi">
    <span>기준임대료</span>
    <strong data-hbirc-result="standardRent">42만 2,000원</strong>
  </article>
  <article class="hbirc-kpi">
    <span>실제 임차료 반영액</span>
    <strong data-hbirc-result="effectiveRent">42만 2,000원</strong>
  </article>
  <article class="hbirc-kpi hbirc-kpi--main">
    <span>예상 주거급여</span>
    <strong data-hbirc-result="estimatedRentBenefit">42만 2,000원</strong>
  </article>
</section>
```

### KPI 카드 (자가 분기, `data-hbirc-branch-result="own"`)

```html
<section class="hbirc-result-kpis hbirc-result-kpis--own" data-hbirc-branch-result="own">
  <article class="hbirc-kpi">
    <span>수선 등급</span>
    <strong data-hbirc-result="repairGrade">중보수</strong>
  </article>
  <article class="hbirc-kpi">
    <span>기준 지원금액</span>
    <strong data-hbirc-result="repairBaseAmount">979만 원</strong>
  </article>
  <article class="hbirc-kpi hbirc-kpi--main">
    <span>예상 지원금액</span>
    <strong data-hbirc-result="estimatedRepairAmount">881만 1,000원</strong>
  </article>
</section>
```

JS에서는 `housingType`에 따라 `[data-hbirc-branch-result]` 요소 중 해당하는 것만 `display: ""`, 나머지는 `display: "none"` 처리한다. `free`는 둘 다 숨기고 안내 카드만 노출.

### 결과 요약 문장

```html
<p data-hbirc-summary aria-live="polite">
  입력값 기준 소득인정액은 월 약 185만 원으로 추정됩니다...
</p>
```

문장 생성 규칙(거주 형태별 2번째 문장 분기):

| judgement | 거주 형태 | 요약 문장 패턴 |
|---|---|---|
| likely/borderline | rent/jeonse | `...{zone} 기준임대료(월 {x}원) 안에서 실제 임차료가 {전액/일부} 반영될 수 있습니다.` |
| likely/borderline | own | `...자가 {보수등급} 기준 약 {지원금액}의 수선비 지원을 받을 수 있습니다.` |
| over | (공통) | `입력값 기준으로는 주거급여 기준을 초과한 것으로 보입니다.` |

### 기준선 게이지

생계급여 계산기의 `.lbirc-gauge` 컴포넌트 구조를 그대로 가져와 `.hbirc-gauge`로 prefix만 교체한다. fill 비율은 `ratioToHousingThreshold * 100` (최대 140 클램프).

### 경고 플래그

```html
<div class="hbirc-warning-list" data-hbirc-warnings></div>
```

`rent-over-standard` 플래그는 다른 항목과 달리 amber가 아닌 info 톤으로 — "위험"이 아니라 "참고" 성격이기 때문.

---

## 9. URL 상태 설계

### 지원 파라미터

| 파라미터 | 의미 | 예 |
|---|---|---|
| `hh` | 가구원 수 | `4` |
| `zn` | 급지 | `zone1` |
| `rg` | 기본재산액 지역 | `metro` |
| `ht` | 거주 형태 | `rent` |
| `inc` | 근로·사업소득 | `1500000` |
| `pub` | 공적 이전소득 | `0` |
| `ha` | 주거재산 | `50000000` |
| `fa` | 금융재산 | `5000000` |
| `debt` | 부채 | `0` |
| `car` | 자동차 여부 | `no` |
| `rent` | 월 임차료(rent일 때) | `450000` |
| `jeonse` | 전세보증금(jeonse일 때) | `150000000` |
| `age` | 주택연수(own일 때) | `15` |
| `grade` | 수선등급(own일 때) | `medium` |

### 예시 URL

```text
/tools/housing-benefit-income-recognition/?hh=4&zn=zone1&ht=rent&inc=2500000&rent=550000
```

URL 업데이트는 debounce 250ms. 공유 URL 복사 버튼 제공(생계급여 계산기와 동일 컴포넌트 `ToolActionBar` 재사용).

---

## 10. 접근성

- 결과 요약 영역 `aria-live="polite"`
- 거주 형태 분기 버튼은 `aria-pressed`로 현재 선택 상태 노출
- 분기 입력 패널 전환 시 `aria-hidden`을 함께 토글(스크린리더가 숨겨진 입력을 읽지 않도록)
- 게이지는 `aria-hidden="true"`, 실제 판정은 텍스트로 별도 제공
- 입력 오류는 필드 아래 텍스트로 표시
- 모든 버튼/입력은 모바일 44px 이상 높이

---

## 11. SCSS 설계

### prefix

```scss
.hbirc-page { ... }
```

### 주요 클래스

```scss
.hbirc-preset-grid
.hbirc-segment            // 거주 형태 선택
.hbirc-branch-panel       // 분기 입력 패널 (rent/jeonse/own/free)
.hbirc-input-grid
.hbirc-money-field
.hbirc-result-kpis
.hbirc-result-kpis--rent
.hbirc-result-kpis--own
.hbirc-kpi
.hbirc-kpi--main
.hbirc-gauge
.hbirc-rent-bar            // 실제월세 vs 기준임대료 비교 막대
.hbirc-repair-grade-cards  // 경/중/대보수 비교 카드
.hbirc-warning-list
.hbirc-next-actions
.hbirc-threshold-table
.hbirc-rent-table          // 급지×가구원수 기준임대료 전체표
.hbirc-explain-grid
```

생계급여 계산기 SCSS(`_livelihood-benefit-income-recognition.scss`)의 토큰·톤을 그대로 상속해 두 페이지가 한 클러스터처럼 보이게 한다(같은 blue/green 조합, 같은 radius, 같은 경고 색상 규칙).

### 톤

- 공공/복지 성격: 과한 마케팅 느낌 금지
- 메인 색: 생계급여 계산기와 동일한 blue/green 조합
- 위험 플래그: red보다는 amber 중심, 실제 위험만 red, `rent-over-standard`는 info(파란 계열)
- 카드 radius 8px 이하
- 표는 모바일 가로 스크롤 허용 (기준임대료 4급지 표는 가로 길이가 길어 특히 중요)

---

## 12. 내부 링크 및 CTA

### 상단 CTA

```text
생계급여 소득인정액 계산기 보기 → /tools/livelihood-benefit-income-recognition/?from=housing
4대 급여 전체 가능성 보기 → /tools/welfare-benefit-eligibility/?from=housing
복지지원금 비교표 보기 → /compare/welfare/
```

### 결과 CTA 조건

| 조건 | CTA |
|---|---|
| likely | `주민센터 상담 전 준비서류 확인` |
| borderline | `복지급여 전체 가능성 다시 계산` |
| over | `생계급여 소득인정액 계산기로 다시 확인` |
| housingType === "own" | `수선비용 신청 절차 안내 보기(주민센터)` |
| rent-over-standard 경고 | `기준임대료 내 다른 지역 시세 비교 참고` |

### 형제 페이지 상호 링크 (필수)

- `/tools/livelihood-benefit-income-recognition/` 결과 화면 하단 관련 링크에 본 페이지 추가
- `/tools/welfare-benefit-eligibility/` 관련 링크에 본 페이지 추가
- 본 페이지 관련 링크에 위 두 페이지 모두 추가 (3개 페이지가 서로 순환 연결되는 구조)

---

## 13. QA 체크리스트

### 계산 QA

- [ ] 4인 가구 주거급여 선정기준이 3,117,474원으로 표시된다.
- [ ] 소득인정액이 생계급여 기준(32%) 이하면 자기부담분이 0원이다.
- [ ] 소득인정액이 생계급여 기준 초과 ~ 주거급여 기준 이하면 자기부담분이 양수로 계산되고 지급액에서 차감된다.
- [ ] 실제 월세가 기준임대료를 초과하면 `rent-over-standard` 경고가 표시되고 초과분은 지급액에 반영되지 않는다.
- [ ] 전세 입력 시 보증금이 월세로 환산되어 동일 로직으로 처리된다.
- [ ] 자가가구는 주택연수 기준으로 보수등급이 자동 추정되고, 직접 선택 시 그 값이 우선한다.
- [ ] 자가가구 지원비율은 생계급여 기준 통과 시 100%, 주거급여만 통과 시 90%로 분기된다.
- [ ] 거주 형태를 rent → own → rent로 전환해도 각 분기 입력값이 유지된다.
- [ ] 가구원 수 7인 이상은 6인 테이블 값으로 계산되고 안내 문구가 노출된다.
- [ ] 빈 값/음수 입력은 0으로 처리된다.
- [ ] URL 파라미터로 거주 형태와 입력값이 복원된다.

### 콘텐츠 QA

- [ ] 결과에 "확정", "수급 가능"처럼 단정 표현이 없다.
- [ ] `자가 점검용 추정`, `공식 고시값 단순화` 배지가 첫 화면과 결과 화면에 보인다.
- [ ] 주거급여 선정기준표와 계산 결과가 같은 기준값을 사용한다.
- [ ] 기준임대료 표에 "실제 신청 전 최신 고시값 확인 필요" 안내가 있다.
- [ ] 생계급여 계산기, 통합 복지 계산기와 제목·H1이 중복되지 않는다.
- [ ] 부양의무자 기준 폐지 안내가 FAQ에 정확히 반영되어 있다.

### 배포 QA

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import
- [ ] `public/sitemap.xml` 등록
- [ ] `src/pages/tools/index.astro` topicBySlug 등록("복지·지원금")
- [ ] 생계급여 계산기·통합 계산기 페이지에 본 페이지로 가는 상호 링크 추가
- [ ] `npm run build` 성공 (사이트 전체, 무관한 페이지 회귀 없는지 `git status`로 변경 파일 범위 확인)
- [ ] 모바일 360px에서 입력/결과 카드, 기준임대료 표 가로 스크롤 정상

---

## 14. 구현 우선순위

1. 데이터 파일 생성 (기존 WBE 유틸 재사용 확인 → 필요 시 공용 유틸 추출)
2. 계산 함수 JS 구현 — 1단계(소득인정액) 먼저, 2단계(거주 형태 분기) 나중
3. Astro 페이지 생성 — 입력 폼 분기 구조부터
4. 결과 KPI/게이지/분기 결과 렌더링
5. URL state/프리셋/공유 링크
6. SEO 본문/FAQ/관련 링크 + 형제 페이지 상호 링크 추가
7. 등록 파일 업데이트 (tools.ts, app.scss, sitemap.xml, tools/index.astro)
8. 빌드 및 모바일 확인, 거주 형태 4종 전체 시나리오 수동 QA

---

## 15. 최종 설계 판단

생계급여 계산기가 증명한 "통합 계산기와 경쟁하지 않는 정확매칭 입구" 전략을 그대로 따르되, 주거급여는 소득인정액 판정 이후 **거주 형태별 2차 계산**이 실질적인 부가가치다. 사용자가 이 페이지에서 끝까지 보고 싶어 하는 답은 "내가 받을 수 있는가"가 아니라 "얼마를 받을 수 있는가"이므로, 결과 화면 설계의 무게중심은 기준임대료/수선비 카드에 둬야 한다.

성공 조건은 사용자가 거주 형태를 선택한 직후 10초 안에 "기준임대료 또는 수선비 지원액이 얼마인지"를 이해하는 것이다.
