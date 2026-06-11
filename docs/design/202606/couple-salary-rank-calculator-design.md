# 맞벌이 부부 가구소득 순위 계산기 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 배경: 대기업 평균 연봉(`salaryTierData.ts`) + 가구소득 비교(`householdIncome.ts`) + 1인 가구 생활비(`singleHouseholdLivingCost2026.ts`) 데이터를 조합한 신규 콘텐츠 기획
- 구현 대상: "부부가 각각 어느 대기업에 다니면 합산 가구소득이 얼마이고, 전국 상위 몇 %이며, 평균 생활비를 빼면 한 달에 얼마가 남는지"를 보여주는 재미형 비교 계산기
- 페이지 성격: `계산기형` — `SimpleToolShell` 기반, `salary-tier`/`household-income`의 결과 카드 패턴을 결합

### 1-2. 문서 역할
- 실제 구현 직전 수준까지 화면/데이터/계산식/구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 권장 slug
- `couple-salary-rank-calculator`
- URL: `/tools/couple-salary-rank-calculator/`
- 페이지 제목(가칭): `맞벌이 부부 가구소득 계산기 | 대기업 연봉으로 보는 우리집 순위 2026`

### 1-4. 권장 파일 구조
- `src/data/coupleSalaryRankCalculator.ts`
- `src/pages/tools/couple-salary-rank-calculator.astro`
- `public/scripts/couple-salary-rank-calculator.js`
- `public/scripts/income-estimate.js` (신규 공용 유틸 — 9-1 참고)
- `src/styles/scss/pages/_couple-salary-rank-calculator.scss`
- `public/og/tools/couple-salary-rank-calculator.png`

---

## 2. 구현 범위

### 2-1. MVP 범위
- `salaryTierData.ts`의 `SALARY_TIER_DATA`(70개+ 대기업)를 기업 선택 리스트로 재사용
- 본인/배우자 각각 기업 선택(또는 "외벌이"로 배우자 미선택) + 연봉 직접 수정 가능한 슬라이더
- 핵심 출력
  - 부부 합산 세전 연봉 / 월 환산
  - 부부 합산 추정 월 실수령액
  - 가구소득 전국 상위 % (가구소득 10분위 추정 테이블 기준)
  - 평균 가구소득(2024, `householdIncome.ts` 재사용) 대비 비율
  - 평균 생활비(2인 가구 기준, 신규 데이터) 차감 후 월 잉여자금
- "인기 조합 랭킹" — 미리 계산된 대표 기업 조합 12~15개를 표로 제공, 클릭 시 입력값 자동 반영
- "외벌이 vs 맞벌이" 비교 카드 — 동일 입력에서 배우자 소득을 0으로 뒀을 때와 비교
- URL 파라미터로 선택 상태 공유
- SEO: `SeoContent`(소개 2문단 이상, 기준 설명, FAQ 5개, 관련 링크 3개 이상)

### 2-2. MVP 제외 범위
- 동적 OG 이미지(결과별 공유 카드 이미지) 자동 생성 — 1차는 고정 OG 1장
- 자녀 수/교육비 변수 반영 (생활비는 2인 가구 고정 시나리오만 제공)
- 직급/연차별 연봉 progression (단순 슬라이더로 회사 평균값 보정만 허용)
- 지역별 생활비 차등 (서울/수도권/지방 등은 추후 확장)
- 회사 로고 이미지 — 1차는 텍스트 배지만 사용

---

## 3. 페이지 목적

- "내 연봉"이 아니라 "부부 조합"이라는 새로운 축으로 대기업 연봉 데이터를 재미있게 소비하게 한다.
- `salary-tier`(개인 연봉 위치), `household-income`(가구소득 위치), `single-household-living-cost-2026`(생활비) 세 콘텐츠를 하나의 시나리오로 묶어 회유 동선을 만든다.
- 결과를 "우리 부부는 전국 상위 OO%, 생활비 빼면 월 OOO만원 남음" 형태의 한 줄 요약으로 제공해 캡처/공유를 유도한다.

---

## 4. 핵심 사용자 시나리오

### 4-1. "이 회사 다니는 부부는 얼마나 벌까" 호기심형 사용자
- 인기 조합 랭킹에서 "SK텔레콤 + 현대자동차" 등을 클릭
- 합산 연봉, 가구소득 순위, 생활비 차감 후 잉여자금을 바로 확인
- 다른 조합과 비교하며 여러 번 클릭

### 4-2. 본인 상황을 입력해보는 실사용자
- 본인 회사/연봉, 배우자 회사/연봉(또는 외벌이)을 입력
- 가구소득 상위 %와 평균 대비 위치 확인
- "생활비 빼면 얼마 남는지"로 저축 여력 체감

### 4-3. 맞벌이 전환을 고민하는 사용자
- 배우자 소득 0(외벌이) ↔ 특정 회사 입력(맞벌이) 토글
- 가구소득 순위·잉여자금 변화 폭 확인 → `household-income`, `fire-calculator`로 이동

---

## 5. 입력값 / 출력값 정의

### 5-1. 입력값

#### 필수 입력
- `myCompanySlug`
  - `SALARY_TIER_DATA`의 기업 중 선택 (기본값: `SK텔레콤`)
- `mySalaryM`
  - 단위: 만원, 기본값 = 선택 기업의 `sal`
  - 슬라이더로 ±조정 가능 (연차 보정 대용)
- `spouseMode`
  - `"COMPANY"`: 배우자도 기업 선택
  - `"NONE"`: 외벌이 (배우자 소득 0)
- `spouseCompanySlug` (spouseMode === "COMPANY"일 때)
  - 기본값: `현대자동차`
- `spouseSalaryM` (spouseMode === "COMPANY"일 때)
  - 단위: 만원, 기본값 = 선택 기업의 `sal`
- `livingCostScenario`
  - `"SAVING" | "AVERAGE" | "COMFORTABLE"` — 2인 가구 생활비 시나리오, 기본값 `"AVERAGE"`

#### 선택 입력
- `selectedComboId`
  - 인기 조합 랭킹에서 선택 시 위 입력값을 일괄 세팅하는 트리거 값 (URL 동기화용)

### 5-2. 출력값

#### 메인 출력 (결과 우선 카드, `resultFirst=true`)
- 부부 합산 세전 연봉 (만원 / 억-만원 표기)
- 부부 합산 월 환산 세전 소득
- 부부 합산 추정 월 실수령액
- 가구소득 전국 상위 % (예: "상위 12%")
- 한 줄 요약 카피 (예: "이 부부는 전국 상위 12% 가구입니다")

#### 보조 출력
- 평균 가구소득(2024 연 7,427만원) 대비 비율(%)
- 기준 중위소득(2인 가구 월 419.9만원) 대비 비율(%)
- 선택한 생활비 시나리오 월 비용
- 생활비 차감 후 월 잉여자금 (= 합산 월 실수령액 − 생활비)
- 외벌이 가정 시 가구소득/순위 (맞벌이 효과 비교 카드)

#### 탐색 출력
- 인기 조합 랭킹 표 (조합명, 합산 연봉, 상위 %, 잉여자금)
- 기업별 평균 연봉 미니 배지 (선택된 두 기업의 티어/카테고리 표시)
- 관련 계산기 링크 (`household-income`, `salary-tier`, `single-household-living-cost-2026`, `fire-calculator`)

---

## 6. 섹션 구조 (IA)

### 6-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (추정치·세전/세후 기준 고지)
3. 입력 영역 — 본인/배우자 기업·연봉 선택
4. 결과 우선 카드 (`resultFirst`)
   - 핵심 요약 카드 (한 줄 카피 + 합산 연봉/실수령액/순위)
   - 비교 막대 차트 (중위소득 / 평균 가구소득 / 우리집)
5. 생활비 차감 보드
   - 생활비 시나리오 선택 탭
   - 잉여자금 카드
6. 맞벌이 vs 외벌이 비교 카드
7. 인기 조합 랭킹 보드
8. 기업 정보 보조 카드 (선택된 두 기업의 연봉/티어/카테고리)
9. `SeoContent` (소개, 기준 설명, FAQ, 관련 링크)

### 6-2. 모바일 우선 화면 순서
- Hero → InfoNotice → 입력(본인/배우자) → 핵심 요약 카드 → 비교 차트 → 생활비 차감 보드 → 맞벌이/외벌이 비교 → 인기 조합 랭킹 → 기업 보조 카드 → SEO

### 6-3. PC 레이아웃
- 입력 영역: `좌: 본인`, `우: 배우자` 2열 카드
- 결과 영역: `좌: 핵심 요약 카드`, `우: 비교 막대 차트` 2열
- 생활비 차감 보드: 시나리오 탭(상단) + 잉여자금 카드(하단 풀폭)
- 인기 조합 랭킹: 표 형태, PC에서는 6열(조합/기업A/기업B/합산연봉/상위%/잉여자금), 모바일은 카드형으로 축약

### 6-4. 섹션별 역할

#### Hero
- eyebrow: `재미로 보는 가구소득`
- H1 예시: `맞벌이 부부 가구소득 계산기 — 대기업 연봉으로 보는 우리집 순위`
- 설명: 본인·배우자 회사를 고르면 합산 연봉, 가구소득 순위, 생활비 차감 후 잉여자금을 바로 보여준다는 점 안내

#### InfoNotice
- 필수 문구
  - 기업 평균 연봉은 `salary-tier`와 동일하게 현직자 커뮤니티 기반 추정치 (공식 자료 아님)
  - 실수령액은 단순 추정 공식이며 개인 공제·비과세 항목에 따라 달라질 수 있음
  - 가구소득 상위 %는 통계청 가계금융복지조사 기반 추정 구간이며 실제 분위와 차이가 있을 수 있음
  - 생활비는 2인 가구 평균 시나리오이며 지역·자녀 유무에 따라 달라질 수 있음

#### 입력 영역
- 본인 카드: 기업 select + 연봉 슬라이더(만원) + 현재 선택 기업의 티어 배지
- 배우자 카드: "배우자 직장 선택" / "외벌이(배우자 소득 없음)" 토글 + 기업 select + 연봉 슬라이더
- 입력 변경 시 결과 영역 즉시 갱신 (디바운스 불필요, 단순 합산 계산)

#### 핵심 요약 카드
- 큰 글씨 한 줄 카피: `이 부부는 전국 상위 {pct}% 가구입니다`
- 보조 수치: 합산 연봉, 합산 월 실수령액, 평균 가구소득 대비 비율
- 카드 톤: `salary-tier`의 티어 색상 팔레트 재사용 (S/A/B/C 컬러를 상위 %에 매핑)

#### 비교 막대 차트
- `household-income.js`의 `renderPositionChart` 패턴 재사용
- 항목: 기준 중위소득(2인 가구 월) / 평균 가구소득(월 환산) / 우리집(월 세전)

#### 생활비 차감 보드
- 탭 3개: 절약형 / 평균형 / 여유형 (2인 가구 생활비 시나리오)
- 잉여자금 카드: `합산 월 실수령액 − 생활비 = 잉여자금` 산식을 그대로 노출
- 잉여자금이 음수일 경우 "적자 구간" 톤(경고 컬러) 처리

#### 맞벌이 vs 외벌이 비교 카드
- 좌: 현재 입력(맞벌이) 결과
- 우: 배우자 소득을 0으로 가정했을 때 결과
- 차이값(가구소득 증가분, 상위 % 변화)을 화살표/델타로 표시

#### 인기 조합 랭킹 보드
- 12~15개 사전 계산 조합을 합산 연봉 내림차순으로 표시
- 각 행 클릭 시 입력 영역에 해당 조합 반영 + 결과 영역으로 스크롤
- 현재 입력값과 일치하는 조합은 하이라이트

#### 기업 정보 보조 카드
- 선택된 두 기업의 평균 연봉, 카테고리(`CAT_LABEL`), 티어(`TIER_META`) 배지 표시
- "이 회사 연봉이 궁금하면" → `salary-tier` 링크

#### SeoContent
- intro 2~3문단: 기획 배경(맞벌이 가구소득 + 생활비 체감), 데이터 출처 요약
- criteria: 연봉 데이터 기준, 실수령 추정 기준, 가구소득 상위% 기준, 생활비 시나리오 기준, 예시 2개 포함
- faq: 5개 (8-안 참고)
- related: `household-income`, `salary-tier`, `single-household-living-cost-2026`, `fire-calculator`

---

## 7. 컴포넌트 구조

### 7-1. 공용 컴포넌트
- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`
- `SimpleToolShell` (`resultFirst={true}`)
- 기존 `report-row`, `comparison-card`, `position-bar-row` 스타일 (`household-income` 페이지에서 재사용)

### 7-2. 페이지 전용 블록 (prefix: `csr-`)
- `csr-input-grid` — 본인/배우자 입력 카드 2열
- `csr-summary-card` — 핵심 요약 카드 (한 줄 카피 + 수치)
- `csr-position-chart` — 비교 막대 차트 캔버스
- `csr-living-cost-board` — 생활비 시나리오 탭 + 잉여자금 카드
- `csr-dual-vs-single` — 맞벌이/외벌이 비교 카드
- `csr-combo-ranking` — 인기 조합 랭킹 표/카드
- `csr-company-info-card` — 선택 기업 보조 정보 카드

### 7-3. Astro 페이지 구성 방식
- `.astro`에서 초기 선택값(기본 조합: SK텔레콤 + 현대자동차)으로 1회 서버사이드 계산 후 초기 마크업 렌더
- `script[type="application/json"]`(`coupleSalaryRankConfig`)로 `SALARY_TIER_DATA`(필요 필드만 축약), `INCOME_PERCENTILE_TABLE`, `COUPLE_LIVING_COST_SCENARIOS`, `POPULAR_COMBOS`, `averageHouseholdIncome`, `householdSizeOptions`(2인 항목) 전달
- `public/scripts/couple-salary-rank-calculator.js`에서 입력 변경 → 계산 → 렌더 → URL 동기화
- 1차는 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작 (`it-si-sm` 패턴과 동일)

---

## 8. 상태 관리

### 8-1. 클라이언트 상태
```ts
type SpouseMode = "COMPANY" | "NONE";
type LivingCostScenario = "SAVING" | "AVERAGE" | "COMFORTABLE";

type ViewState = {
  myCompanySlug: string;
  mySalaryM: number;
  spouseMode: SpouseMode;
  spouseCompanySlug: string;
  spouseSalaryM: number;
  livingCostScenario: LivingCostScenario;
};
```

### 8-2. 초기값
- `myCompanySlug = "sk-telecom"`
- `mySalaryM = 8000` (SK텔레콤 평균)
- `spouseMode = "COMPANY"`
- `spouseCompanySlug = "hyundai-motor"`
- `spouseSalaryM = 9500` (현대자동차 평균)
- `livingCostScenario = "AVERAGE"`

### 8-3. 동작 규칙
- 기업 select 변경 시
  - 해당 기업의 `sal` 값으로 연봉 슬라이더 자동 세팅 (사용자가 슬라이더를 직접 만진 적 없을 때만)
  - 슬라이더 직접 조작 후에는 기업 변경 시에도 마지막 슬라이더 값 유지 옵션 제공 (간단히: 기업 변경 시 항상 평균값으로 리셋, 슬라이더는 보정용으로만 안내)
- `spouseMode = "NONE"` 선택 시
  - 배우자 select/슬라이더 비활성화, `spouseSalaryM = 0`으로 계산
- 생활비 탭 변경 시
  - 잉여자금 카드만 재계산 (다른 영역 영향 없음)
- 인기 조합 랭킹 행 클릭 시
  - `myCompanySlug`, `mySalaryM`, `spouseCompanySlug`, `spouseSalaryM`을 해당 조합 값으로 세팅 후 전체 재계산
- URL 파라미터 동기화
  - `me`(myCompanySlug), `ms`(mySalaryM), `sm`(spouseMode), `sp`(spouseCompanySlug), `ss`(spouseSalaryM), `lc`(livingCostScenario)

예시:
```txt
/tools/couple-salary-rank-calculator/?me=sk-telecom&ms=8000&sm=COMPANY&sp=hyundai-motor&ss=9500&lc=AVERAGE
```

---

## 9. 계산 로직

### 9-1. 실수령액 추정 (공용 유틸 분리 권장)
- `household-income.js`의 `estimateEarnedTakeHome(annualAmount)` 로직을 `public/scripts/income-estimate.js`로 추출하여 본 페이지와 `household-income.js`가 공유한다.
- 본 계산기는 비과세/부양가족 옵션을 노출하지 않으므로, 고정 프리셋(`includeNonTaxable = true`, `dependents = 0`, `deductionPreset = SIMPLE`)으로 호출한다.

```ts
// income-estimate.js (신규)
export function estimateEarnedTakeHome(annualAmount, options = {}) {
  const { includeNonTaxable = true, dependents = 0, deductionPreset = SIMPLE_PRESET } = options;
  // household-income.js와 동일한 4대보험/소득세 근사 로직
}
```

### 9-2. 합산 연봉 / 월 환산
```ts
const myAnnual = mySalaryM * 10000;
const spouseAnnual = spouseMode === "NONE" ? 0 : spouseSalaryM * 10000;
const householdGrossAnnual = myAnnual + spouseAnnual;
const householdGrossMonthly = householdGrossAnnual / 12;
```

### 9-3. 합산 실수령액
```ts
const myTakeHomeAnnual = estimateEarnedTakeHome(myAnnual);
const spouseTakeHomeAnnual = spouseMode === "NONE" ? 0 : estimateEarnedTakeHome(spouseAnnual);
const householdTakeHomeAnnual = myTakeHomeAnnual + spouseTakeHomeAnnual;
const householdTakeHomeMonthly = householdTakeHomeAnnual / 12;
```

### 9-4. 가구소득 상위 % (선형 보간)
- `INCOME_PERCENTILE_TABLE`: 가구소득(연, 만원) 구간별 누적 상위 % 추정 테이블 (10-2 참고)
- `householdGrossAnnual`(만원 단위)을 테이블의 두 인접 구간 사이에서 선형 보간

```ts
function estimateTopPercentile(annualM, table) {
  // table: [{ annualM, topPct }] — annualM 내림차순 정렬
  if (annualM >= table[0].annualM) return table[0].topPct;
  if (annualM <= table[table.length - 1].annualM) return table[table.length - 1].topPct;

  for (let i = 0; i < table.length - 1; i += 1) {
    const hi = table[i];
    const lo = table[i + 1];
    if (annualM <= hi.annualM && annualM >= lo.annualM) {
      const ratio = (annualM - lo.annualM) / (hi.annualM - lo.annualM);
      return Math.round(lo.topPct - ratio * (lo.topPct - hi.topPct));
    }
  }
  return 50;
}
```

### 9-5. 평균 가구소득 / 중위소득 대비 비율
```ts
const averageIncomeRatio = householdGrossAnnual10000 / averageHouseholdIncomeM; // averageHouseholdIncomeM = 7427(만원)
const medianIncomeRatio = householdGrossMonthly10000 / coupleHouseholdMedianMonthlyM; // 2인 가구 월 중위 419.9만원
```
- `averageHouseholdIncome`, 2인 가구 `medianMonthlyIncome`은 `householdIncome.ts`에서 그대로 import

### 9-6. 생활비 차감 / 잉여자금
```ts
const livingCost = COUPLE_LIVING_COST_SCENARIOS[livingCostScenario].monthlyTotal; // 원 단위
const monthlySurplus = householdTakeHomeMonthly - livingCost;
```
- `monthlySurplus < 0`이면 "적자 구간" UI 처리

### 9-7. 맞벌이 vs 외벌이 비교
```ts
const singleIncomeAnnual = myAnnual; // 배우자 소득 0 가정
const singlePct = estimateTopPercentile(singleIncomeAnnual / 10000, INCOME_PERCENTILE_TABLE);
const dualPct = estimateTopPercentile(householdGrossAnnual / 10000, INCOME_PERCENTILE_TABLE);
const pctImprovement = singlePct - dualPct; // 양수면 맞벌이로 순위 상승
```

### 9-8. 인기 조합 랭킹 사전 계산
- `POPULAR_COMBOS` 각 항목에 대해 9-2~9-6 계산을 빌드 타임(데이터 파일) 또는 클라이언트 첫 렌더 시 일괄 계산
- 정렬 기준: `householdGrossAnnual` 내림차순 (기본), 추후 "잉여자금순" 토글 확장 가능 (MVP는 고정 정렬)

---

## 10. 데이터 파일 구조

### 10-1. 메인 데이터 파일 구조
```ts
// src/data/coupleSalaryRankCalculator.ts
import { SALARY_TIER_DATA, OVERALL_AVG, CAT_LABEL, TIER_META, type TierCompany } from "./salaryTierData";
import { averageHouseholdIncome, householdSizeOptions } from "./householdIncome";

export type LivingCostScenarioCode = "SAVING" | "AVERAGE" | "COMFORTABLE";

export interface CoupleLivingCostScenario {
  code: LivingCostScenarioCode;
  label: string;
  monthlyTotal: number; // 원 단위
  description: string;
}

export interface IncomePercentileRow {
  topPct: number;       // 상위 %
  annualM: number;      // 가구소득 연 기준, 만원 단위
  label: string;        // 예: "상위 10%"
}

export interface PopularCombo {
  id: string;
  label: string;          // 예: "SK텔레콤 + 현대자동차"
  meSlug: string;          // SALARY_TIER_DATA name 매칭 키
  spouseSlug: string | null; // null이면 외벌이 조합
  tagline: string;         // 카드/표에 노출할 한 줄 설명
}

export const CSR_META = {
  slug: "couple-salary-rank-calculator",
  title: "맞벌이 부부 가구소득 계산기",
  subtitle: "대기업 연봉으로 보는 우리집 가구소득 순위와 생활비 차감 후 잉여자금",
  methodology: "salary-tier 기업 평균 연봉 + 통계청 가구소득 분위 추정치를 결합한 참고용 계산입니다.",
  caution: "실제 가구소득, 세금, 생활비는 개인 상황에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 6월 기준",
};

// 2인 가구 생활비 시나리오 (참고: singleHouseholdLivingCost2026의 1인 가구 시나리오를 2인 가구 비율로 환산)
export const COUPLE_LIVING_COST_SCENARIOS: CoupleLivingCostScenario[] = [
  { code: "SAVING",      label: "절약형", monthlyTotal: 2_300_000, description: "..." },
  { code: "AVERAGE",     label: "평균형", monthlyTotal: 2_950_000, description: "..." },
  { code: "COMFORTABLE", label: "여유형", monthlyTotal: 3_900_000, description: "..." },
];

// 가구소득 상위 % 추정 테이블 (통계청 가계금융복지조사 기반 참고용, 연 기준 만원)
export const INCOME_PERCENTILE_TABLE: IncomePercentileRow[] = [
  { topPct: 1,  annualM: 23000, label: "상위 1%" },
  { topPct: 5,  annualM: 15000, label: "상위 5%" },
  { topPct: 10, annualM: 12000, label: "상위 10%" },
  { topPct: 20, annualM: 9500,  label: "상위 20%" },
  { topPct: 30, annualM: 8200,  label: "상위 30%" },
  { topPct: 40, annualM: 7200,  label: "상위 40%" },
  { topPct: 50, annualM: 6300,  label: "상위 50%(중위)" },
  { topPct: 60, annualM: 5500,  label: "상위 60%" },
  { topPct: 70, annualM: 4700,  label: "상위 70%" },
  { topPct: 80, annualM: 3900,  label: "상위 80%" },
  { topPct: 90, annualM: 3000,  label: "상위 90%" },
];

export const POPULAR_COMBOS: PopularCombo[] = [
  { id: "sktelecom-hyundai",   label: "SK텔레콤 + 현대자동차",     meSlug: "SK텔레콤",     spouseSlug: "현대자동차",     tagline: "통신·완성차 대표 조합" },
  { id: "skhynix-skhynix",     label: "SK하이닉스 + SK하이닉스",   meSlug: "SK하이닉스",   spouseSlug: "SK하이닉스",     tagline: "반도체 사내 커플 S티어" },
  { id: "samsung-ds-naver",    label: "삼성전자 DS + 네이버",      meSlug: "삼성전자 DS", spouseSlug: "네이버",         tagline: "반도체 + IT 플랫폼" },
  { id: "hyundai-kb",          label: "현대자동차 + KB국민은행",   meSlug: "현대자동차",   spouseSlug: "KB국민은행",     tagline: "완성차 + 금융 안정형" },
  { id: "lg-energy-lg-chem",   label: "LG에너지솔루션 + LG화학",   meSlug: "LG에너지솔루션", spouseSlug: "LG화학",       tagline: "배터리·화학 계열사 커플" },
  { id: "kakao-naver",         label: "카카오 + 네이버",           meSlug: "카카오",       spouseSlug: "네이버",         tagline: "IT 플랫폼 맞벌이" },
  { id: "samsung-dx-single",   label: "삼성전자 DX(MX) 외벌이",    meSlug: "삼성전자 DX(MX)", spouseSlug: null,          tagline: "외벌이 비교 기준" },
  // ... 총 12~15개
];

export {
  SALARY_TIER_DATA as CSR_COMPANY_OPTIONS,
  OVERALL_AVG,
  CAT_LABEL,
  TIER_META,
};
```

### 10-2. 데이터 운영 규칙
- 기업 목록/평균 연봉은 `salaryTierData.ts`를 단일 출처로 재사용한다 (별도 복제 금지 — 갱신 포인트 일원화).
- `INCOME_PERCENTILE_TABLE`은 통계청 가계금융복지조사 최신 공개 자료를 참고한 **추정 구간**이며, `추정` 라벨과 출처 문구를 InfoNotice/SeoContent에 명시한다.
- `COUPLE_LIVING_COST_SCENARIOS`는 `single-household-living-cost-2026`의 1인 가구 시나리오 대비 약 1.5~1.6배 환산값을 기준으로 하되, 최종 수치는 콘텐츠 작성 시점에 한 번 더 검수한다.
- 만원/원 단위 혼용 주의: `salaryTierData`는 만원, `householdIncome`/생활비는 원 단위 — 계산 유틸에서 단위 변환을 명시적으로 처리한다 (`* 10000`).

### 10-3. 등록 파일
- 메인 데이터: `src/data/coupleSalaryRankCalculator.ts`
- 도구 등록: `src/data/tools.ts` (대기업 보너스/연봉·직군 카테고리)
- 사이트맵: `public/sitemap.xml`

---

## 11. 구현 순서

### 11-1. 1단계: 공용 유틸 분리
- `public/scripts/income-estimate.js` 생성 — `household-income.js`의 `estimateEarnedTakeHome` 로직 이전
- `household-income.js`에서 새 유틸 import로 교체 (회귀 확인)

### 11-2. 2단계: 데이터 파일 작성
- `src/data/coupleSalaryRankCalculator.ts` 생성
- `INCOME_PERCENTILE_TABLE`, `COUPLE_LIVING_COST_SCENARIOS`, `POPULAR_COMBOS`(12~15개), `CSR_META` 작성
- `salaryTierData`, `householdIncome`에서 필요한 값 re-export/조합

### 11-3. 3단계: 도구 페이지 생성
- `src/pages/tools/couple-salary-rank-calculator.astro`
- `SimpleToolShell resultFirst={true}` 기반
- 섹션: Hero → InfoNotice → 입력 영역 → 결과 카드(요약/차트) → 생활비 차감 보드 → 맞벌이/외벌이 비교 → 인기 조합 랭킹 → 기업 보조 카드 → SeoContent

### 11-4. 4단계: 스크립트 구현
- `public/scripts/couple-salary-rank-calculator.js`
- 담당 기능: 입력 동기화, 계산(9장 로직), 결과 렌더, 차트 렌더(Chart.js, `household-income.js` 패턴), 인기 조합 클릭 처리, URL 파라미터 동기화

### 11-5. 5단계: 스타일 작성
- `src/styles/scss/pages/_couple-salary-rank-calculator.scss`
- `src/styles/app.scss`에 import 추가
- 확인 포인트: 입력 카드 2열 → 모바일 1열, 인기 조합 랭킹 표 → 모바일 카드 전환, 적자 구간 경고 톤

### 11-6. 6단계: 등록 및 SEO 마무리
- `src/data/tools.ts`에 등록 (카테고리: 연봉·직군 또는 신규 "재미 비교" 묶음)
- `public/sitemap.xml` 추가
- `SeoContent` (intro 2~3문단, criteria, faq 5개, related 3~4개)
- OG 이미지 생성 (`npm run og:generate`)

### 11-7. 7단계: 빌드/배포 점검
- `npm run build` 통과 확인
- `DEPLOY_CHECKLIST.md` 기준 점검

---

## 12. QA 체크포인트

### 12-1. 데이터
- [ ] `salaryTierData` 기업명과 `POPULAR_COMBOS`의 `meSlug`/`spouseSlug` 매칭 확인 (오타/이름 변경 시 깨짐 방지)
- [ ] `INCOME_PERCENTILE_TABLE` 단조 감소(연소득 ↓ → 상위% ↑) 확인
- [ ] `COUPLE_LIVING_COST_SCENARIOS` 단위(원) 일관성 확인
- [ ] 만원→원 변환 누락 여부 확인 (특히 9-4, 9-6)

### 12-2. UI
- [ ] 외벌이 토글 시 배우자 입력 비활성화 및 계산 정상 반영
- [ ] 인기 조합 클릭 시 입력값 갱신 + 결과 스크롤 정상 동작
- [ ] 생활비 시나리오 탭 전환 시 잉여자금만 재계산 (다른 카드 불필요한 재렌더 없는지)
- [ ] 잉여자금 음수일 때 경고 톤 표시
- [ ] 비교 막대 차트 모바일에서 라벨 겹침 없음
- [ ] 맞벌이/외벌이 비교 카드 델타 값 부호(+/-) 정상 표시

### 12-3. SEO / 운영
- [ ] `tools.ts` 등록 및 `/tools/` 목록 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` FAQ 5개 + JSON-LD
- [ ] InfoNotice에 "추정/참고" 문구 및 출처 명시
- [ ] 관련 링크: `household-income`, `salary-tier`, `single-household-living-cost-2026`, `fire-calculator` 중 3개 이상
- [ ] `npm run build` 통과

---

## 13. 구현 메모

### 13-1. 페이지 포지션
- `salary-tier`(개인 연봉 위치)와 `household-income`(가구소득 입력형 계산)의 중간 — "기업 선택 → 자동 계산"이라는 더 가벼운 진입 방식으로 차별화한다.
- 첫 화면은 계산기보다 "결과 카드 + 인기 조합" 중심으로, 입력은 보조 동선으로 배치한다 (`resultFirst` 패턴 적극 활용).

### 13-2. 기존 페이지와의 관계
- `household-income`: 본 계산기 결과에서 "더 자세한 가구소득 계산"으로 연결되는 다음 단계 링크
- `salary-tier`: "이 회사 연봉이 궁금하면" 형태로 기업별 상세 링크 연결
- `single-household-living-cost-2026`: 생활비 시나리오의 출처/상세 설명 페이지로 연결

### 13-3. 구현 우선순위
1. `income-estimate.js` 공용 유틸 분리 (회귀 위험 가장 낮은 선행 작업)
2. 데이터 파일(`coupleSalaryRankCalculator.ts`) 작성 — 특히 `INCOME_PERCENTILE_TABLE`, `COUPLE_LIVING_COST_SCENARIOS` 수치 검수
3. 입력 + 핵심 요약 카드 + 비교 차트 (메인 흐름)
4. 생활비 차감 보드 + 맞벌이/외벌이 비교
5. 인기 조합 랭킹
6. SEO/등록/스타일 마무리

### 13-4. 확장 방향
- 지역별 생활비(서울/수도권/지방) 변형
- 자녀 수 입력에 따른 생활비·교육비 가산
- 결과 공유용 동적 OG 이미지 생성
- "인기 조합 랭킹"을 별도 리포트(`/reports/`)로 확장해 SEO 키워드 면적 추가 확보
