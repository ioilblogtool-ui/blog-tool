# 어린이집 vs 가정보육(육아도우미) 비용 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202606/childcare-vs-babysitter-cost-comparison.md`
> 작성일: 2026-06-27
> 구현 기준: 비교계산소 `/tools/` 비교형 계산기 구조를 기준으로 Codex/Claude가 바로 구현 가능한 수준으로 정리

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202606/childcare-vs-babysitter-cost-comparison.md`
- 구현 대상: `어린이집 vs 가정보육(육아도우미) 비용 비교 계산기`
- 권장 slug: `daycare-vs-babysitter-cost-2026`
- URL: `/tools/daycare-vs-babysitter-cost-2026/`

### 1-2. 참고 계산기
- `childcareShortTimePay.ts` / `parental-leave-short-work-calculator`
  - 단축근무 회사지급액·고용보험 급여 계산 로직을 그대로 재사용
- `babyGovernmentSupport.ts`
  - 보육료 지원(`BGS_DAYCARE_SUBSIDY`), 가정양육수당(`BGS_HOME_CARE_ALLOWANCE`) 상수 재사용
- `breastfeeding-vs-formula-cost`
  - 2개 시나리오를 좌우 비교 카드로 구성하는 `CompareToolShell` 패턴 참고

### 1-3. 페이지 역할
어린이집(시설보육)과 가정보육(베이비시터/단축근무) 중 어느 쪽이 **가구 실질 순부담액** 기준으로 더 저렴한지 비교한다. 단순 "보육료 vs 인건비" 비교가 아니라, 정부지원금(보육료 바우처는 시설 직지급이라 체감비용 0, 가정양육수당은 현금)과 부모의 단축근무 임금손실까지 포함한 **실질 가구 현금흐름**을 보여주는 데 초점을 둔다.

### 1-4. 구현 전제
- 2026년 기준 보육료 지원·가정양육수당 금액(`babyGovernmentSupport.ts` 현재 값)을 그대로 사용한다.
- 보육료는 시설에 직접 지급되는 바우처 구조이므로, 어린이집 시나리오의 학부모 체감 비용은 **추가비용(특별활동비 등)만** 반영하고 표준 보육료는 0으로 처리한다. 이 가정을 결과 화면에 명시한다.
- 가정보육 시나리오는 3가지 중 선택:
  - 베이비시터 전일(주 35~45시간)
  - 베이비시터 반일(주 15~25시간)
  - 부모 단축근무 (`childcareShortTimePay.ts` 계산 로직 그대로 호출)
- 거주 지역은 보육료 지원·가정양육수당에는 영향이 없으므로(전국 동일), 이 계산기 1차 버전에서는 지역 입력을 받지 않는다. (지자체 출산장려금은 기획 문서에서도 비교 대상이 아니므로 제외)
- 베이비시터 시급은 직접 입력 또는 프리셋 선택(정부 아이돌봄서비스 단가 / 민간 평균 시세) 중 선택 가능하게 한다.
- 결과는 "평균값 기준 추정"이며 실제 시설·지역별 추가비용, 베이비시터 시세와 다를 수 있다는 안내 문구를 포함한다.

### 1-5. 권장 파일 구조
- `src/data/daycareVsBabysitterCost2026.ts`
- `src/pages/tools/daycare-vs-babysitter-cost-2026.astro`
- `public/scripts/daycare-vs-babysitter-cost-2026.js`
- `src/styles/scss/pages/_daycare-vs-babysitter-cost-2026.scss`
- `public/og/tools/daycare-vs-babysitter-cost-2026.png`

---

## 2. 페이지 목적
- 자녀 나이와 보육 형태만 입력하면 어린이집과 가정보육의 월 순부담액을 바로 비교하게 한다.
- 가정보육 내에서도 베이비시터 시나리오와 단축근무 시나리오의 비용 구조 차이를 보여준다.
- 정부지원금이 두 시나리오에서 어떻게 다르게 작동하는지(바우처 vs 현금) 이해하게 한다.
- 단축근무 급여 계산기, 정부지원금 계산기로 자연스럽게 이어지는 육아 비용 허브 역할을 한다.

---

## 3. 핵심 사용자 시나리오

### 3-1. 어린이집 입소를 고민 중인 부모
- 자녀 나이, 어린이집 유형(국공립/민간), 예상 추가비용만 입력한다.
- 결과 카드에서 어린이집 월 순부담액(추가비용 중심)을 바로 확인한다.

### 3-2. 베이비시터를 고려 중인 부모
- 베이비시터 이용시간(주 N시간)과 시급(프리셋 또는 직접 입력)을 입력한다.
- 가정양육수당 차감 후 월 순부담액을 확인하고 어린이집과 비교한다.

### 3-3. 단축근무로 직접 돌보는 것을 고려 중인 부모
- 통상임금, 단축 전/후 주 근로시간을 입력한다.
- `childcareShortTimePay.ts` 로직으로 계산된 임금손실액에서 가정양육수당을 차감한 순부담액을 어린이집과 비교한다.

### 3-4. 세 가지를 모두 비교하고 싶은 부모
- 가정보육 탭을 베이비시터(전일)/베이비시터(반일)/단축근무로 전환하며 동일한 어린이집 결과와 비교한다.

---

## 4. 입력값 / 출력값 정의

### 4-1. 입력값

#### 공통
- `childAge: 'age0' | 'age1' | 'age2' | 'age3to5'` (`BGS_AGE_OPTIONS` 일부 재사용, 6세 이상은 본 계산기 대상 아님)

#### 어린이집 시나리오
- `daycareType: 'PUBLIC' | 'PRIVATE'`
- `extraCostMonthly: number` (슬라이더, 0~150,000원, 기본 70,000원, PRIVATE 기본값은 별도로 더 높게 설정)

#### 가정보육 시나리오
- `homeCareMode: 'SITTER_FULL' | 'SITTER_PART' | 'SHORT_WORK'`
- 베이비시터 공통 입력
  - `sitterHourlyWage: number` (프리셋: 정부지원 단가 / 민간 평균, 직접 입력 가능)
  - `sitterWeeklyHours: number` (FULL 기본 40, PART 기본 20)
- 단축근무 입력 (`childcareShortTimePay.ts`의 `ChildcareShortTimePayInput` 재사용)
  - `monthlyOrdinaryWage: number`
  - `weeklyHoursBefore: number`
  - `weeklyHoursAfter: number`
  - `companyPayMode: 'AUTO' | 'MANUAL'`
  - `manualCompanyPay: number | null`

### 4-2. 출력값

#### 어린이집
- `daycareSubsidyMonthly` (정보 표시용, 체감 비용 0 처리 근거)
- `daycareNetCostMonthly` = `extraCostMonthly`

#### 가정보육 (선택된 모드 기준)
- `homeCareAllowanceMonthly` (`BGS_HOME_CARE_ALLOWANCE[childAge]`)
- `sitterGrossCostMonthly` (SITTER 모드)
- `shortWorkIncomeLossMonthly` (SHORT_WORK 모드, `childcareShortTimePay.ts` 계산 결과 기반)
- `homeCareNetCostMonthly`

#### 비교
- `cheaperOption: 'DAYCARE' | 'HOME_CARE'`
- `monthlyDifference`
- `annualDifference`

---

## 5. 섹션 구조

### 5-1. 히어로
- 컴포넌트: `CalculatorHero`
- 카피
  - eyebrow: `육아 비용 비교`
  - title: `어린이집 vs 가정보육 비용 비교 계산기`
  - description: `정부지원금을 반영한 어린이집 순부담액과 베이비시터·단축근무 비용을 같은 기준으로 비교합니다.`
- 보조 태그
  - `정부지원금 반영`
  - `단축근무 임금손실 포함`
  - `2026 기준`

### 5-2. 액션 바
- 컴포넌트: `ToolActionBar` (초기화, 공유 링크 복사)

### 5-3. 입력 패널
- 자녀 나이 선택 (4단계)
- 어린이집 유형 + 추가비용 슬라이더
- 가정보육 모드 탭 (베이비시터 전일 / 베이비시터 반일 / 단축근무)
  - 탭별로 해당 입력 필드만 노출
  - 베이비시터: 시급 프리셋 칩 + 직접 입력, 주당 시간 슬라이더
  - 단축근무: 통상임금, 단축 전/후 주 근로시간, 회사지급 자동/직접 토글

### 5-4. 상단 요약 카드
`SummaryCards` 4칸
- 어린이집 월 순부담액
- 가정보육 월 순부담액 (선택 모드 기준)
- 월 차액
- 연간 차액

### 5-5. 좌우 비교 카드 (핵심 섹션)
`CompareToolShell` 기본 좌우 카드 구조
- 좌: 어린이집 카드 — 보육료 지원(바우처, 체감 0) 안내 + 추가비용 항목
- 우: 가정보육 카드 — 선택 모드별 비용 구조
  - 베이비시터: 인건비 - 가정양육수당
  - 단축근무: 회사지급액 + 고용보험 단축급여(=수령액) vs 기존 월급 차이 - 가정양육수당
- 하단 결론 문구: "OO이 월 OO원 더 저렴합니다"

### 5-6. 비용 구조 막대차트
- 어린이집 vs 가정보육 막대 1쌍
- 가정보육 막대는 모드 전환 시 갱신

### 5-7. 안내 / 가정 명시
`InfoNotice`
- 보육료 바우처는 시설에 직접 지급되어 학부모 체감 비용에 포함하지 않는다는 가정 안내
- 추가비용·베이비시터 시세는 평균값 기준 추정이라는 안내
- 단축근무 실제 수령액은 회사 임금 규정에 따라 달라질 수 있다는 안내

### 5-8. SEO / FAQ / 관련 링크
`SeoContent`
- 관련 계산기 링크
  - `/tools/parental-leave-short-work-calculator/`
  - `/tools/childcare-short-time-pay-calculator/`
  - 정부지원금 계산기(슬러그 확인 후 연결)

---

## 6. 컴포넌트 구조
- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `ToolActionBar`, `SummaryCards`, `InfoNotice`, `SeoContent`
- 권장 쉘: `CompareToolShell`

### 6-1. 페이지 전용 블록
- `dvb-mode-tabs`
- `dvb-daycare-card`
- `dvb-homecare-card`
- `dvb-result-banner`
- `dvb-cost-chart`

### 6-2. 모바일 우선 구조
- `빠른 입력 -> 요약 카드 -> 좌우 비교 카드(세로 스택) -> 차트 -> 안내 -> FAQ`
- 가정보육 모드 탭은 모바일에서 가로 스크롤 칩 형태

---

## 7. 상태 관리 포인트
- 바닐라 JS + DOM 직접 갱신, URL query param 복원
  - `age`, `daycareType`, `extraCost`, `mode`, `sitterWage`, `sitterHours`, `wage`, `wh`, `rwh`, `payMode`, `manualPay`
- 입력 변경 시 동시 갱신 대상
  - 요약 카드, 좌우 비교 카드, 막대차트, 결론 문구
- 잘못된 입력 방어
  - 단축 후 주 근로시간 15시간 미만/35시간 초과 경고 (`childcareShortTimePay.ts` 정책값 재사용)
  - 음수/0 이하 시급·임금 방어
  - 베이비시터 주당 시간 0~60 범위 클램프

---

## 8. 계산 로직

### 8-1. 어린이집 월 순부담액
```ts
const daycareNetCostMonthly = extraCostMonthly;
// 표준 보육료는 BGS_DAYCARE_SUBSIDY[childAge]로 정보성 표시만 하고 순부담액에는 더하지 않음
```

### 8-2. 베이비시터 월 순부담액
```ts
const sitterGrossCostMonthly = sitterHourlyWage * sitterWeeklyHours * 4.345;
const homeCareAllowanceMonthly = BGS_HOME_CARE_ALLOWANCE[childAge] ?? 0;
const homeCareNetCostMonthly = Math.max(sitterGrossCostMonthly - homeCareAllowanceMonthly, 0);
```

### 8-3. 단축근무 월 순부담액
`childcareShortTimePay.ts`의 기존 계산 함수를 그대로 호출한다 (재구현하지 않음).
```ts
const { companyPay, governmentSupport, estimatedMonthlyTotal } =
  calculateChildcareShortTimePay({ monthlyOrdinaryWage, weeklyHoursBefore, weeklyHoursAfter, companyPayMode, manualCompanyPay });

const incomeLossMonthly = Math.max(monthlyOrdinaryWage - estimatedMonthlyTotal, 0);
const homeCareAllowanceMonthly = BGS_HOME_CARE_ALLOWANCE[childAge] ?? 0;
const homeCareNetCostMonthly = Math.max(incomeLossMonthly - homeCareAllowanceMonthly, 0);
```
> `calculateChildcareShortTimePay`가 별도 함수로 분리되어 있지 않다면, 기존 `public/scripts/childcare-short-time-pay-calculator.js`의 계산 블록을 공용 함수로 추출해 이 페이지 스크립트에서 import 또는 복제 호출한다. 로직 자체(상한 250만/160만, 하한 50만)는 변경하지 않는다.

### 8-4. 비교 결과
```ts
const monthlyDifference = homeCareNetCostMonthly - daycareNetCostMonthly;
const cheaperOption = monthlyDifference >= 0 ? 'DAYCARE' : 'HOME_CARE';
const annualDifference = Math.abs(monthlyDifference) * 12;
```

---

## 9. 데이터 파일 구조

### 9-1. `src/data/daycareVsBabysitterCost2026.ts`
포함 항목
- 페이지 메타 (slug, title, seoTitle, description)
- 기본 입력값
- 어린이집 유형별 기본 추가비용 프리셋 (국공립/민간)
- 베이비시터 시급 프리셋 (정부 아이돌봄 단가 / 민간 평균)
- FAQ
- 관련 계산기 링크

예시 타입
```ts
export type ChildAge = 'age0' | 'age1' | 'age2' | 'age3to5';
export type DaycareType = 'PUBLIC' | 'PRIVATE';
export type HomeCareMode = 'SITTER_FULL' | 'SITTER_PART' | 'SHORT_WORK';

export interface DaycareVsBabysitterInput {
  childAge: ChildAge;
  daycareType: DaycareType;
  extraCostMonthly: number;
  homeCareMode: HomeCareMode;
  sitterHourlyWage: number;
  sitterWeeklyHours: number;
  monthlyOrdinaryWage: number;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  companyPayMode: 'AUTO' | 'MANUAL';
  manualCompanyPay: number | null;
}
```

### 9-2. 재사용 import
- `BGS_HOME_CARE_ALLOWANCE`, `BGS_DAYCARE_SUBSIDY`, `BGS_AGE_OPTIONS` ← `babyGovernmentSupport.ts`
- 단축근무 계산 로직 ← `childcareShortTimePay.ts` / 해당 스크립트

---

## 10. 구현 순서
1. `childcare-short-time-pay-calculator`, `breastfeeding-vs-formula-cost` 마크업/스크립트 구조 재확인
2. `src/data/daycareVsBabysitterCost2026.ts` 작성 (기존 상수 재사용 import 포함)
3. 어린이집 입력 + 순부담액 카드 구현
4. 베이비시터 모드 입력 + 순부담액 계산 구현
5. 단축근무 모드 연결 (기존 계산 로직 재사용)
6. 좌우 비교 카드 + 결론 문구 구현
7. 막대차트 구현
8. 안내 문구 / FAQ / 관련 링크 연결
9. query param 및 공유 링크 반영
10. 모바일 탭 UX 및 에지케이스 점검

---

## 11. QA 체크포인트

### 11-1. 계산
- 어린이집 순부담액이 추가비용만 반영하고 표준 보육료는 0으로 처리되는지
- 베이비시터 월 비용이 `시급 × 주당시간 × 4.345`로 정확히 계산되는지
- 단축근무 모드에서 기존 `childcareShortTimePay.ts` 상한(250만/160만)·하한(50만) 로직이 그대로 적용되는지
- 가정양육수당이 자녀 나이별로 정확히 차감되는지 (2세 이후 0원 처리 확인)

### 11-2. UX
- 모드 탭 전환 시 입력 필드와 결과 카드가 즉시 갱신되는지
- 모바일에서 탭 칩이 가로 스크롤로 자연스럽게 동작하는지
- "보육료는 체감 비용에서 제외" 가정이 결과 화면에서 명확히 보이는지

### 11-3. 콘텐츠 / SEO
- 타이틀/디스크립션이 `어린이집 베이비시터 비용 비교`, `가정보육 정부지원금` 키워드를 포함하는지
- 보육료·베이비시터 시세가 평균값 추정이라는 고지가 있는지
- 단축근무 급여 계산기, 정부지원금 계산기로 내부 링크가 연결되는지

---

## 12. 최종 구현 방향 정리
이 페이지는 기존 `childcareShortTimePay.ts`, `babyGovernmentSupport.ts` 데이터/로직을 재사용하는 비교형 계산기로, 신규 계산 로직은 베이비시터 비용 산출과 좌우 비교 결론 도출에만 한정한다.

사용자 흐름:
- 자녀 나이와 어린이집 유형 입력 → 어린이집 순부담액 확인
- 가정보육 모드(베이비시터/단축근무) 선택 → 해당 순부담액 확인
- 두 결과를 좌우 카드와 차트로 비교 → 결론 문구로 어느 쪽이 더 저렴한지 확인
- 필요 시 단축근무 급여 계산기, 정부지원금 계산기로 이동
