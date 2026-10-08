# 건강보험료 계산기 2027 — 설계 문서

> 기획 원문: [2027 갱신 기획서](../../plan/202610/health-insurance-premium-calculator.md)
> 작성일: 2026-10-08
> 상태: 설계 작성 완료 / 구현 미착수 / 일부 공식 기준 재확인 필요
> 대상: `/tools/health-insurance-premium-calculator/` 기존 페이지 갱신

## 1. 목표와 적용 범위

월 건강보험 관련 본인 공제액을 빠르게 보여주고, 2026→2027 기준 변화와 보수 인상으로 생기는 부담 변화를 구분한다. 기존 slug·canonical·카테고리 `연봉·이직`을 유지한다. 신규 계산기 URL이나 2027 인상 계산기를 만들지 않는다.

이번 설계는 기획서의 확정 사실과 미확인 항목을 그대로 구분한다. 2027 건강보험료율 7.19%·재산 점수당 211.5원은 기획서의 공식 출처를 사용한다. 2027 장기요양보험료율·상하한·단수처리·지역 저소득 규칙은 구현 전 재확인 대상이다. 새로운 공식 수치 조사나 확정은 이번 설계 작업에 포함하지 않는다.

| 범위 | 결정 |
|---|---|
| 직장가입자 | 월 보수/연봉, 확인된 산정 제외 급여, 근로자·회사 월/연 부담 |
| 비교 | 같은 보수의 연도별 비교 + 실제 이전/현재 보수 비교, 효과 분해 |
| 보수 외 소득 | 기존 연간 입력 유지, 별도 부과 안내. 추가보험료 자동 산출 제외 |
| 지역가입자 | 공단 산정 소득월액·재산 부과점수 입력 경로. 기존 임의 재산·자동차 산식 제거 |
| 퇴직 비교 | 같은 기준 연도에서 퇴직 전 직장 부담과 공단 확인 지역·임의계속 월 합계 비교 |
| 지역 재산 점수 자동 산출 | 소득 종류·과표·전월세·점수표 검증이 필요한 후속 범위 |
| 2026 인상 페이지 | 과거 기록 유지, 기간 안내·최신 계산기 링크만 정비 |
| 4대보험·연봉 페이지 | 이번 구현에서 로직 갱신 제외. 해당 연도·용도를 표시해 연결 |

2026-06 설계에서 임의 지역 산식·자동차 입력·직장 결과 공식 배지에 관한 내용은 이번 설계로 대체한다. 과거 설계 문서는 기록으로 보존한다.

## 2. 현재 구현과 수정 지점

| 현재 코드 | 문제 | 설계 변경 |
|---|---|---|
| `HEALTH_INSURANCE_RULES_2026.previousYear` | 2025 비교가 기본 구조에 내장 | 연도별 규칙 맵과 독립 비교 함수로 교체 |
| `getPremiumBreakdown(..., "official")` | 사용자 입력 결과에 공식 배지 | 산식 적용 결과는 시뮬레이션 |
| `parseWon` | 빈 값·음수·문자를 0 또는 변형 숫자로 처리 | 문법 검사→유한성→범위 검증, 빈 값과 0 분리 |
| `propertyBase * 0.0000015` | 공식 점수표 대신 임의 선형식 | 제거, 검증된 재산 부과점수 사용 |
| `carValue >= 40_000_000 ? 25_000 : 0` | 폐지된 자동차 부과 반영 | 입력·산식·FAQ·안내에서 제거 |
| `directPoints * pointUnitPrice` | 재산 점수만으로 전체 보험료 산출 | 소득분과 재산분 합산, 지역 경계 규칙 별도 적용 |
| `directPoints > 0` 모드 선택 | 0점이면 임의 추정으로 전환 | 입력 모드와 점수값 분리; 0점 유효 |
| 직전 월급 기반 임의계속가입액 | 실제 신청·평균 보수 기준 미반영 | 공단 확인 월 합계 입력, 자격 판정 제외 |
| URL에 일부 숫자만 저장 | 연봉 모드·체크·퇴직 일부 상태 복원 불가 | 버전 있는 명시적 허용 목록 스키마 |
| `clipboard?.writeText` 직후 성공 표시 | 복사 실패도 성공으로 표시 | Promise 성공 후 완료 안내, 실패는 재시도 안내 |
| 데스크톱 KPI 5열 | 비교 카드까지 넣으면 숫자 폭 부족 | 핵심 4카드 2열, 비교는 별도 패널 |

## 3. 파일 구조와 데이터 흐름

```text
src/data/healthInsurancePremiumCalculator.ts      연도 규칙·출처·메타·초기값·FAQ
src/pages/tools/health-insurance-premium-calculator.astro
public/scripts/health-insurance-premium-core.js    신규: DOM 없는 계산·검증·URL 함수
public/scripts/health-insurance-premium-calculator.js
src/styles/scss/pages/_health-insurance-premium-calculator.scss
scripts/check-health-insurance-premium-calculator.mjs  신규: 계산·URL 검증
public/og/tools/health-insurance-premium-calculator.png  갱신 시 생성
```

계산 코어는 브라우저 ES module이며 `public/scripts`에서 직접 import한다. Node 검증 스크립트도 같은 코어를 import한다. 서버용·브라우저용 산식을 각각 복제하지 않는다. TypeScript 데이터는 Astro가 직렬화해 `<script id="hip-data" type="application/json">`으로 전달한다. 코어에 보험료율을 하드코딩하지 않는다.

기존 `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `ToolActionBar`, `SimpleToolShell`, `SeoContent`를 재사용한다. `SimpleToolShell`의 `resultFirst={false}`와 `hip-page`를 유지하고, 이번 변경을 위해 전역 쉘이나 타 계산기를 리팩터링하지 않는다.

흐름: 공식 기준 데이터 → Astro JSON → 입력 정규화·검증 → 계산 코어 → 결과 모델 → DOM 표시. UI는 계산 결과만 읽으며 별도로 합계·보험료를 재계산하지 않는다.

## 4. 연도별 공식 기준 모델

아래 타입은 구현 계약이다. 데이터값은 공식 확인 후 채운다.

```ts
type RuleStatus = "verified" | "pending";
type RuleValue<T> = {
  value: T | null;
  status: RuleStatus;
  sourceIds: string[];
  checkedAt: string;
  effectiveFrom: string | null;
};
type HealthLimits = {
  basis: "combinedMonthlyHealth";
  lower: number;
  upper: number;
};
type RoundingPolicy = {
  healthUnitWon: number;
  careUnitWon: number;
  method: "floor";
  healthStage: "beforeSplit" | "afterSplit";
  careBase: "rawHealth" | "chargedHealth";
  careFactor: "incomeRateRatio" | "publishedHealthRatio";
};
type RegionalPolicy = {
  lowIncomeThresholdAnnual: number;
  minimumIncomePremium: number;
  totalHealthLower: number;
  totalHealthUpper: number;
  lowIncomeBasis: "assessedAnnualIncome";
};
type HipYearRules = {
  year: 2026 | 2027;
  healthRate: RuleValue<number>;
  employeeShare: RuleValue<number>;
  employerShare: RuleValue<number>;
  careIncomeRate: RuleValue<number>;
  carePublishedHealthRatio: RuleValue<number>;
  employeeLimits: RuleValue<HealthLimits>;
  rounding: RuleValue<RoundingPolicy>;
  regionalPointPrice: RuleValue<number>;
  regionalPolicy: RuleValue<RegionalPolicy>;
  otherIncomeThreshold: RuleValue<number>;
};
```

`HEALTH_INSURANCE_RULES_BY_YEAR`는 2026·2027을 독립 저장한다. 2026 기준도 기존 코드가 존재한다는 이유만으로 모두 verified로 표시하지 않는다. 출처 객체는 기관·문서명·URL·확인일·적용기간을 가지며 기획서 S1~S5를 출발점으로 사용한다.

건강 요율과 부담 비율은 서로 다른 값이다. 2027은 `healthRate=0.0719`, 근로자·회사 지분 각 `0.5`로 저장하고 본인 실효율 `0.03595`는 파생한다. 2026 장기요양은 `careIncomeRate=0.009448`, 안내용 `carePublishedHealthRatio=0.1314`를 구분한다. 2027 미확인 필드는 null/pending이고 `|| 0.1314` 같은 대체값을 금지한다.

`employeeLimits`는 근로자·회사 합산 건강보험료 기준으로 통일한다. 원문이 본인 기준 금액만 제시하면 합산으로 정규화한 과정과 원문 금액을 출처 메모에 남긴다. 임의로 상하한을 0·Infinity로 채우지 않는다.

단수처리의 단계·단위·장기요양 산정 기초는 공식 확인 결과만 허용한다. 공식 처리가 위 모델로 표현되지 않으면 모델과 검증 예제를 먼저 확장한다. 예시 타입에 맞추기 위해 원문 규칙을 바꾸지 않는다.

### 기능별 준비 상태

- 직장 건강 계산: healthRate·지분·employeeLimits·건강 단수처리 검증 필요.
- 직장 전체 계산: 위 항목 + 장기요양 요율/비율·장기요양 단수처리 필요.
- 연도 비교: 양쪽 연도에서 해당 비교 항목의 준비 조건 충족 필요.
- 지역 계산: 건강 요율·점수가격·저소득/상하한·단수처리 필요; 합계에는 장기요양도 필요.
- 보수 외 소득 경고: 검증된 임계값만 사용; 미확인 시 일반 별도 부과 안내.

정식 2027 갱신 배포는 핵심 직장 전체 계산 준비 후 진행한다. 준비 중 내부 미리보기는 누락 항목을 보여주되 확정 2027 합계로 표시하지 않는다. 지역 기능 준비가 늦으면 해당 모드에 공식 조회 안내를 제공하며 틀린 이전 산식으로 대체하지 않는다.

## 5. 입력 상태와 검증 계약

```ts
type HipState = {
  version: 2;
  mode: "employee" | "regional" | "transition";
  year: 2026 | 2027;
  employee: {
    incomeMode: "monthlyWage" | "annualSalary";
    monthlyWage: number | null;
    annualSalary: number | null;
    excludedAnnualPay: number | null;
    otherAnnualIncome: number | null;
    showEmployerShare: boolean;
  };
  comparison: {
    enabled: boolean;
    previousBasis: "same" | "custom";
    previousMonthlyWage: number | null;
    previousAnnualSalary: number | null;
    previousExcludedAnnualPay: number | null;
  };
  regional: {
    assessedMonthlyIncome: number | null;
    assessedAnnualIncomeForThreshold: number | null;
    propertyPoints: number | null;
    standardConditionsConfirmed: boolean;
  };
  transition: {
    beforeMonthlyWage: number | null;
    afterRegionalTotal: number | null;
    showContinuation: boolean;
    continuationTotal: number | null;
  };
};
```

초기값은 기존과 같은 월 300만원·연 3,600만원, 연봉 제외급여·보수 외 소득은 0원, 회사 표시 켬, 2027 선택이다. 비교는 기본 같은 보수(`same`)로 표시하고 이전 보수 별도 입력은 선택 확장한다. 지역 소득·점수·퇴직 후 공단 확인액은 null에서 시작해 실제 값 입력을 요청한다. 임의계속 표시는 기본 끔이다.

DOM 입력 원문은 별도 draft로 보존해 입력 도중 쉼표·커서 위치를 매번 바꾸지 않는다. focus 시 편집, blur 시 유효값만 한국어 금액 포맷으로 정리한다. 값 검증 실패는 field별 메시지와 `aria-invalid`로 표시한다.

| 항목 | 검증 |
|---|---|
| 원 단위 금액 | 쉼표 제거 전 숫자/정상 천단위 쉼표 문법 검사. 음수·지수표기·문자·Infinity·NaN 거부 |
| 금액 안전 범위 | 0 이상 `Number.MAX_SAFE_INTEGER` 이하 정수; 파생 곱셈 결과도 안전 범위 검증 |
| 빈 값 | null. 필수 입력이면 결과 숨김·입력 요청; 선택 제외급여·다른 소득은 별도 “없음” 기본 0 |
| 연봉 제외급여 | 연봉 이하. 직접 보수 모드에는 적용하지 않음 |
| 보수 0 | 무보수·자격 확인 상태; 고지보험료 0원으로 단정하지 않음 |
| 재산 점수 | 0 유효. 소수점 허용 자릿수는 공식 확인 후 데이터로 정함; 음수 거부 |
| 지역 조건 | 공단 산정 소득·재산점수이며 감면/조정 없는 표준조건 확인 필요 |
| 퇴직 후 합계 | 건강+장기요양을 포함한 월 합계임을 입력 설명에서 확인 |

월급/연봉 전환은 양쪽 입력을 각각 보존한다. 자동 환산으로 기존 값을 덮어쓰지 않고 현재 선택한 방식만 사용한다. 비교의 이전 보수 입력도 같은 방식을 따른다. 이전 보수와 현재 보수의 제외급여를 독립 적용한다.

지역 저소득 여부는 “공단 산정 연간 소득(저소득 판정용)”으로 판단한다. 단순히 평가 소득월액×12를 저소득 판정 원자료라고 가정하지 않는다. 공식 원문이 다른 판정 기초를 요구하면 해당 입력과 타입을 수정한 뒤 기능을 활성화한다.

## 6. 계산 코어와 결과 모델

export 함수: `validateState`, `getCapabilities`, `resolveMonthlyWage`, `calculateEmployee`, `calculateComparison`, `calculateRegional`, `calculateTransition`, `parseUrlState`, `serializeUrlState`.

모든 계산 함수는 DOM·location·전역 상태를 참조하지 않고 입력과 연도 규칙을 인자로 받는다. 출력 상태는 `ready | partial | unavailable | invalid`이며 누락 기준·필드 오류를 함께 반환한다.

```ts
type AmountResult = {
  status: "ready" | "pending" | "invalid";
  value: number | null;
  reason: string | null;
};
type PremiumBreakdown = {
  health: AmountResult;
  care: AmountResult;
  monthlyTotal: AmountResult;
  annualTotal: AmountResult;
};
type EmployeeResult = {
  status: "ready" | "partial" | "unavailable" | "invalid";
  monthlyWage: number | null;
  employee: PremiumBreakdown;
  employer: PremiumBreakdown;
  combined: PremiumBreakdown;
  burdenRatio: AmountResult;
  lowerApplied: boolean;
  upperApplied: boolean;
  missingRuleIds: string[];
  warningCodes: string[];
};
```

0원은 계산이 성립한 경우의 값이며 null과 구분한다. `formatWon(value || 0)` 패턴은 제거한다. `value=null`은 “기준 확인 후 계산” 또는 “입력 필요”로 렌더링한다. 핵심 합계가 pending이면 이전 정상 결과를 계속 표시하지 않는다.

### 직장 계산 순서

1. 활성 방식의 보수 검증. 연봉이면 `(연봉−제외급여)/12`, 중간 보수는 조기 정수화하지 않는다.
2. 검증된 요율로 합산 건강보험 이론값 산출.
3. 합산 건강보험 상하한 적용 후 공식 검증된 단계에 따라 분담·단수처리. 하한/상한 적용 여부를 결과에 기록.
4. 장기요양은 검증된 `careFactor`·`careBase`에 따라 계산·단수처리. 표시용 비율을 자동 선택하지 않는다.
5. 본인·회사 월 합계, 연 합계(월×12), 양쪽 합산, 본인 부담 비율 계산. 필요한 항목이 pending이면 의존값도 pending.
6. 보수 외 소득 경고는 기본 보수월액보험료에 합산하지 않고 별도 납부 안내로 반환.

건강보험 전체 표시값은 처리 후 본인+회사 합으로 정한다. 단수처리 전 이론값은 접힌 상세 산식에 별도 표시한다. 동일한 기준에서 전체와 본인·회사 합이 어긋나는 표를 만들지 않는다.

### 연도·보수 비교

`B0`는 이전 보수, `B1`은 현재 보수, `F(B,y)`는 검증된 해당 연도 계산 결과다.

```text
A = F(B0, 2026)
B = F(B0, 2027)
C = F(B1, 2027)
기준 변화 효과 = B - A
보수 변화 효과 = C - B
전체 변화 = C - A
```

각 건강/장기요양/월합계/연합계를 항목별 계산한다. 한 항목이 pending이면 그 항목 증감도 pending이며 건강 결과까지 숨기지는 않는다. 이미 단수처리된 결과 간 차이를 구하고 증감에 또 단수처리를 적용하지 않는다.

사용자 제목은 **“같은 보수에서 2026→2027 변화”**, **“보수 인상으로 생긴 변화”**, **“최종 부담 변화”**다. 기준 변화에는 상하한·단수처리 변경도 포함될 수 있으므로 전체 효과를 “요율 인상분”이라고 단정하지 않는다. “건강보험료율 7.19% 동결” 정보는 별도 공식 기준 카드로 제공한다. 기획서의 효과 분해 취지는 유지하되 원인 이름을 정확하게 구분한다.

기본 비교 `same`은 B0=B1로 계산하고 “같은 보수 가정”을 표시한다. `custom`에서만 보수 변화 결과를 보여준다. 2026 입력이 없는 것을 0원으로 비교하지 않는다. 명시적 연도 2026 조회 상태는 기록 계산만 보여주고 2026→2027 비교를 숨긴다.

### 지역 계산

입력값은 공단 산정 소득월액·판정용 연 소득·재산 부과점수다. 공식 지역 규칙에 따라 저소득 분기를 적용하고 소득 보험료와 재산 보험료를 합산한다. 재산 보험료 이론값은 `점수×211.5원`, 소득분 일반 구조는 `산정 소득월액×건강보험료율`이다. 지역 전체 건강 상하한·단수처리·장기요양 순서는 공식 검증 후 정책으로 구현한다.

점수 0이면 재산분 0, 소득분은 유지한다. 자동차·과표·보증금으로 임의 계산하지 않는다. 표준조건 미확인 또는 기준 누락이면 unavailable과 공단 조회 경로를 반환한다. “지역가입자 간이 추정” 대신 “공단 산정 소득·재산점수 기준 시뮬레이션”으로 범위를 표시한다.

### 퇴직 비교

퇴직 전은 선택 연도의 검증된 직장 계산을 사용한다. 퇴직 후 지역·임의계속 값은 사용자가 공단에서 확인한 건강+장기요양 월 합계를 입력한다. 월 차이=`확인한 전환 후 합계−퇴직 전 본인 합계`, 연 차이=월 차이×12다. 전환 후 금액은 항목 분리값이 없으므로 건강·장기요양을 역산하지 않는다.

전환 표는 “입력한 월 합계 / 동일 조건 12개월 환산 / 전환 전 대비” 3항목을 사용한다. 임의계속가입 신청 가능성이나 피부양자 등재 여부를 판정하지 않고 공단 확인 안내를 제공한다. 비교 모델에는 금액 확인 연도를 함께 표시하고 서로 다른 연도 금액을 무표시로 비교하지 않는다.

## 7. 화면 구성과 DOM 계약

```text
Hero: 건강보험료 계산기 2027
InfoNotice: 공식 기준·시뮬레이션·대상 범위
액션: 초기화 / 링크 복사
aside: 가입자 유형 → 연도 → 주요 입력 → 이전 보수 비교 → 빠른 입력
main: 본인 월 합계 → 건강·장기요양·연간 → 분담표
      → 연도/보수 효과 비교 → 상세 산식 → 확인 안내·출처
SeoContent: intro → FAQ → 관련 계산기
```

| 패널 | 표시 계약 |
|---|---|
| `hipTotalPremium` | 본인 월 공제 합계; 지역은 월 납부 합계, 퇴직은 전환 후 입력 합계 |
| `hipHealthPremium`, `hipCarePremium` | 항목별 본인 금액. 퇴직 확인 총액만 있을 때 숨김 |
| `hipAnnualPremium` | 동일 조건 12개월 환산이며 정산 포함 연간 고지액이 아님 |
| `hipEmployeeTable` | 근로자/회사/합산, 건강·장기요양·월합계·연합계; 회사 숨김이면 관련 행 숨김 |
| 신규 `hipYearComparison` | 동일 보수 2026·2027 항목별 결과와 차이 |
| 신규 `hipRaiseComparison` | 이전/현재 보수, 기준 변화·보수 변화·최종 차이 |
| `hipTransitionTable` | 확인한 지역·임의계속 합계 비교, 자격 판정 제외 |
| `hipWarningList` | 입력 오류와 공식 기준 누락을 구분; 이전 오류는 재계산마다 정리 |
| 신규 `hipFormulaDetails` | details 요소, 적용 보수·요율·상하한·단수처리·연간 가정 |

기존 `hipIncrease`의 2025 비교 카드는 제거하고 별도 비교 패널로 대체한다. 대표 입력은 월 300·400·500·700만원과 연봉 5,000만→5,500만원으로 갱신한다. 기존 프리랜서·퇴직 프리셋의 임의 재산 조건은 삭제한다.

핵심 4카드는 월 합계·건강·장기요양·연간 합계 순으로 표시한다. 연봉 비교의 “실수령 영향” 문구는 “건강보험 관련 공제 증가”로 한정한다. 모든 계산 결과에는 시뮬레이션, 공식 기준에만 공식 배지를 표시한다. 외부 링크는 `noopener noreferrer`, 입력 원문은 `textContent` 또는 DOM 노드로 반영한다.

상태 문구 예시: “2027 건강보험료율은 7.19%로 2026년과 같습니다.” / “장기요양보험 기준 확인 후 합계를 계산할 수 있습니다.” / “월 보수월액을 입력해 주세요.” / “회사 부담은 월급에서 공제되는 금액에 포함되지 않습니다.” 내부 함수명·출시 단계는 화면에 노출하지 않는다.

## 8. URL 상태와 기존 링크 호환

새 공유 URL은 `v=2`로 구분한다. `mode`, `year`, `im`, `wage`, `salary`, `excluded`, `other`, `employer`, `compare`, `previous`, `pwage`, `psalary`, `pexcluded`, `rmi`, `rai`, `rpoints`, `rstandard`, `twage`, `rtotal`, `continuation`, `ctotal`만 허용한다. boolean은 0/1, enum은 고정 목록, 금액은 안전 정수, 점수는 검증된 자릿수만 허용한다.

active mode 및 켜진 비교에 필요한 값만 직렬화한다. 숨긴 회사 표시·입력 방식 등 결과 재현에 영향을 주는 옵션은 반드시 저장한다. null 필드는 생략하되 선택 기본값과 구분 가능한 스키마를 사용한다. 파싱은 허용 목록 매핑만 사용하고 임의 객체 경로 문자열을 `setPath`로 적용하지 않는다.

| 구 URL 상황 | 마이그레이션 |
|---|---|
| 쿼리 없음 | 최신 2027 기본 상태 |
| v 없음 + 기존 숫자/모드 파라미터 | 기존 페이지가 2026이었으므로 year=2026으로 복원하고 “2026 기준 링크입니다” 안내 |
| 기존 wage·salary 동시 존재 | 모드 정보가 없으므로 월 보수 입력 선택. 두 값을 보존하고 방식 확인 안내 |
| 기존 `ri`, `rp`, `rent`, `points` | 과거 입력 요약은 안내용으로만 읽음. 새 공단 소득·재산점수로 자동 변환하지 않음 |
| 기존 퇴직 `tai`, `tap` 등 | 공단 확인 합계로 환산 금지, 새 필수 금액 입력 요청 |
| 구 자동차 관련 값 | 계산에 사용하지 않음, 해당 정책 폐지 안내 |
| 잘못된 mode/year/숫자 | 유효값만 복원, 무효값은 기본 또는 null과 오류 안내; 문자열 숫자 변조 금지 |

구 regional points는 점수 성격이 명확하지 않으므로 새 재산점수로 자동 승계하지 않는다. 모드가 누락된 과거 연봉 링크를 정확히 재현할 수 없는 사실을 안내하고 조용히 추정하지 않는다. 새 링크는 `parse(serialize(state))`에서 활성 입력·결과가 동일해야 한다.

실시간 유효 입력 변경 때 `history.replaceState`를 사용하며 hash는 보존한다. 무효 draft를 URL에 숫자처럼 저장하지 않는다. 복사 시 현재 입력이 유효한지 확인한 뒤 직렬화하고 `navigator.clipboard.writeText` 성공 이후에만 완료 안내를 띄운다. 실패 시 선택 가능한 링크와 수동 복사 안내를 제공한다. “공유 링크에 입력한 금액이 포함됩니다”를 액션 근처에 표시한다.

초기화는 최신 기본 상태로 돌아가며 URL도 재작성한다. 모드 전환은 각 모드 값을 메모리에서 유지하되 화면 결과는 즉시 해당 모드 결과로 바꾼다. 프리셋 선택 이후 수동 수정하면 선택 강조를 해제한다.

## 9. 반응형·접근성·스타일

`hip-` 접두사와 기존 페이지 스타일 범위를 유지한다. 기존 공통 panel·button·field를 재사용한다. 새 전용 색상은 기존 페이지의 하드코딩 방식과 `docs/ARCHITECTURE.md`·품질표 기준을 따라 기존 팔레트를 재사용한다. `_tokens.scss`에는 실제 CSS 변수가 존재하지만 문서 사이 지침이 상충하므로 이번 작업에서 전체 페이지 토큰 전환은 하지 않는다. 숫자·카드 배치를 바꾸는 데 필요한 범위만 수정한다.

모바일 기본 1열, 640px 이상 KPI 2열, 데스크톱 main 안에서도 기본 2열을 유지한다. 핵심 숫자는 28px 안팎으로 표시하고 큰 금액에는 단위 줄바꿈을 허용한다. 기존 5열 규칙은 제거한다. 각 그리드 아이템 `min-width:0`, 표 래퍼 `overflow-x:auto`, 표 최소폭 620px 유지 또는 연간 열 추가 후 조정한다. 가로 스크롤은 표 내부에서만 발생해야 한다.

가입자 선택은 라디오 그룹으로 구현해 기존 불완전한 `role=tablist` 버튼 구조를 교체한다. 월급/연봉·비교 옵션도 라디오/체크로 키보드 조작을 보장한다. 비활성 패널은 `hidden`으로 표시·포커스를 함께 차단한다. 상세 비교 선택은 `<details>`를 사용한다. 금액 오류는 label과 `aria-describedby`로 연결하며 `aria-invalid`를 갱신한다.

결과 영역 `aria-live=polite`는 짧은 요약에 적용한다. 표 전체가 입력마다 반복 낭독되지 않게 하고 포커스를 강제로 결과로 이동하지 않는다. 복사 성공·실패 메시지는 status 영역, 필수 입력 오류는 해당 필드에 표시한다. 비교 증감은 색뿐 아니라 +/−·증가/감소·변화 없음 텍스트로 구분한다.

차트는 추가하지 않는다. 두 연도 비교와 효과 분해는 카드·표로 충분하며 숫자 비교를 명확하게 제공한다.

## 10. SEO·등록·연관 페이지

Title·Description·intro·FAQ는 기획서 초안을 데이터 파일에서 관리한다. 정식 갱신 시 미확인 FAQ 답변을 확정 수치·산식으로 보완한다. intro 4단락 각 150자 이상·총 600자 이상, FAQ 최소 7개 각 2문장 이상, Description 80~120자를 검증한다.

`BaseLayout` title·description, hero H1, `WebApplication.name`, `SeoContent.introTitle`, tools 목록 이름을 함께 2027로 갱신한다. canonical은 기존 경로다. 화면에 보이는 FAQ와 JSON-LD의 답변을 동일 배열에서 생성한다. 연도 2026 공유 조회는 화면 기준일을 명확히 표시하되 정적 대표 메타는 최신 페이지 기준으로 유지한다.

전용 OG 경로 `/og/tools/health-insurance-premium-calculator.png`, 크기 1200×630, 제목 2027과 일반 직장 계산 메시지를 사용한다. 장기요양 미확인 숫자는 이미지에 넣지 않는다. `scripts/generate-og-tools.py`의 기존 등록 구조를 확인해 대상 항목만 추가/갱신한다.

기본 related 4개는 기획서대로 4대보험·salary·최저임금 2027·실업급여다. 2026 도구는 실제 기준 연도와 이름을 표시한다. 2026 인상 계산기는 “2025→2026 비교 자료” 안내와 최신 계산기 링크를 추가하되 과거 데이터·URL을 유지한다.

`src/data/tools.ts` 기존 항목 갱신, `src/pages/index.astro` topicBySlug의 연봉·이직 확인, `src/styles/app.scss` 기존 @use 유지, sitemap URL 유지·실제 콘텐츠 갱신일 lastmod 검토. `reports.ts`에 새 계산기를 등록하지 않는다. 다른 작업의 미커밋 변경이 존재하므로 구현 시 해당 파일의 대상 항목만 수정하고 기존 변경을 덮어쓰지 않는다.

## 11. 검증 설계

검증 스크립트는 브라우저 코어를 직접 실행한다. 비교·상하한·pending·구 링크 호환은 실제 사용자 결과가 달라지는 기능이므로 명시적 검증을 둔다. DOM 마크업을 그대로 반복하는 테스트는 추가하지 않는다.

### 산식·회귀 기대값

단수처리 전 일반 건강보험 값: 월 300만원 본인 107,850원·회사 107,850원·전체 215,700원, 월 400만원 143,800원·287,600원, 월 500만원 179,750원·359,500원, 월 700만원 251,650원·503,300원.

기획서의 기존 2026 10원 절사·13.14% 회귀 데이터는 전용 `legacy2026` 테스트 fixture로 분리한다. 검증되지 않은 운영 기본값으로 사용하지 않는다.

| 입력 | 본인 건강 | 본인 장기요양 | 월 합계 | 연 합계 |
|---|---:|---:|---:|---:|
| 월 300만원 | 107,850 | 14,170 | 122,020 | 1,464,240 |
| 월 400만원 | 143,800 | 18,890 | 162,690 | 1,952,280 |
| 월 500만원 | 179,750 | 23,610 | 203,360 | 2,440,320 |
| 월 700만원 | 251,650 | 33,060 | 284,710 | 3,416,520 |
| 연 5,000만원 | 149,790 | 19,680 | 169,470 | 2,033,640 |
| 연 5,500만원 | 164,770 | 21,650 | 186,420 | 2,237,040 |

연봉 5,000만→5,500만원 건강보험 단수처리 전 본인 월 차이 `14,979.166…원`, 연 차이 `179,750원`을 수학 검증한다. 운영 결과는 확정 단수처리·2027 장기요양을 적용한 독립 기대값을 추가한다. 공식 규칙 확인으로 기존 값이 바뀌면 수정 사유를 기록한다.

### 필수 자동 검증

| 분류 | 사례·기대 |
|---|---|
| 효과 분해 | 기준 변화+보수 변화=최종 변화, 항목별·본인/회사·월/연 검증 |
| 동일 기준·보수 | 차이 0, 감소 시 음수, 보수 인상 시 회사가 본인 합계에 포함되지 않음 |
| 단수처리·상하한 | 공식 값 직전/동일/직후, 합산 상한과 본인 상한 혼동 방지 |
| 입력 | 빈값·0·음수·문자 혼입·지수표기·과대 숫자·제외급여 초과 |
| null 전파 | 장기요양 null이면 care/합계/비율/해당 증감 null, 건강 검증 가능 결과는 보존 |
| 지역 | 소득분 있는 0점, 100점 재산 이론값 21,150원, 저소득 경계·조건 미확인 |
| 퇴직 | 확인 총합만 비교·역산 금지, 임의계속 꺼짐·켜짐·입력 누락 |
| 별도 소득 | 검증된 기준 19,999,999/20,000,000/20,000,001원에서 경고, 월 공제 자동 합산 없음 |
| URL | v2 왕복, annualSalary 복원, employer 꺼짐, 이전 연봉·지역 0점·퇴직 옵션 복원 |
| 구 링크 | year=2026, 모드 없는 급여 링크 안내, 임의 지역 파라미터로 새 계산 실행 금지 |

기준이 미확인인 경계 테스트는 테스트용 명시적 가상 규칙으로 로직을 검증하고 “테스트 가정”이라고 표시한다. 공식 확인 뒤 실제 숫자 fixture를 추가하며 가상 규칙을 운영 데이터로 복사하지 않는다.

수동 브라우저 검증: 320·360·640·768·1280px, 첫 진입·모드/입력방식 전환·대표값·비교 입력·초기화·링크 복사/실패·새 탭 복원·키보드 입력·null 상태·콘솔 오류·표 스크롤·FAQ·외부 링크·OG·홈/도구 목록. 입력 중 포커스와 커서가 유지되는지도 확인한다.

## 12. 구현 순서와 완료 기준

1. 기획서 S1~S5 및 최신 시행 규정으로 미확인 기준을 재검증하고 데이터 모델을 채운다. 정식 숫자 fixture와 단수처리 계약을 함께 확정한다.
2. 연도 규칙·출처·메타·초기 상태를 정리하고 계산 코어·검증 스크립트를 작성한다.
3. 직장 계산·비교·null 처리·URL v2와 구 링크 마이그레이션을 구현한다.
4. 지역 임의 산식·자동차 입력을 제거하고 검증 가능한 공단 소득/점수 경로를 적용한다. 미준비 지역 모드는 공단 조회 안내로 처리한다.
5. 퇴직 공단 확인액 비교·화면·한국어 오류·접근성·모바일 레이아웃을 적용한다.
6. SEO·2026 기록 안내·등록 파일·OG를 대상 항목에 한해 갱신한다.
7. 계산 검증, `npm run check:all`, `npm run build`, 브라우저 QA를 수행하고 결과를 기록한다.

완료 조건:

- [ ] 직장 2027 전체 계산에 필요한 공식값·상하한·단수처리 출처와 적용일 확보.
- [ ] 대표 입력·연봉 비교·경계·회귀·pending·URL 검증 통과.
- [ ] 지역 임의 재산/자동차 산식·결과 공식 배지·2025 비교 문구 제거.
- [ ] 지역 미준비 상태·퇴직 확인액 비교가 정확한 범위로 안내됨.
- [ ] 한국어 메타·FAQ·intro·OG·내부 링크·모바일·접근성 확인.
- [ ] `node scripts/check-health-insurance-premium-calculator.mjs` 통과.
- [ ] `npm run check:all` 통과 및 `npm run build` 성공.

확인 기준 문서: `AGENTS.md`, `AGENT.md`, `CONTENT_GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/CODE_SKILL.md`, `docs/UI_ARCHITECTURE.md`, `docs/QUALITY_SCORE.md`, `docs/SECURITY.md`, `DEPLOY_CHECKLIST.md`. 설치된 Astro 버전은 구조 문서의 과거 설명보다 `package.json`의 실제 의존성 `^5.5.5`를 따른다. 이번 작업은 별도 패키지 추가 없이 기존 ESM·Node 검증 패턴을 사용한다.

**현재 수행 상태 (2026-10-08):** 계산 코어·검증 스크립트·UI·연도 데이터·URL v2·SEO·전용 OG를 구현했다. 공식 세부 기준이 없는 납부액은 pending으로 남겼다. 아래 구현 기록을 참조한다.

## 13. 구현 기록과 남은 공식 기준

기존 URL을 유지하며 2027 기본 연도, 2026 기록 조회, 월 보수/연봉 입력, 회사 부담 표시, 동일 보수 비교와 연봉 인상 비교, 공단 확인 퇴직 후 합계 비교를 구현했다. 지역의 임의 재산·자동차 산식을 제거하고 공단 산정 소득·재산점수 입력으로 교체했다. URL v2는 입력 방식과 옵션을 복원하며 구 링크는 2026 기준으로 해석하고 과거 지역 입력을 자동 환산하지 않는다.

설계 확장: 건강보험료율과 분담 비율만으로 계산 가능한 **건강보험 이론값**을 별도 패널과 비교 안내에 제공한다. 상하한·단수처리·감면·정산 미반영 시뮬레이션이며 정식 납부액과 별도 모델이다. 장기요양·합계·보수 대비 부담 비율의 미확인 결과를 0원으로 대체하지 않는다. 예를 들어 월 보수 300만원의 본인 건강보험 이론값은 107,850원, 연봉 5,000만→5,500만원의 본인 건강보험 이론값 변화는 월 약 14,979원·12개월 179,750원이다.

2027 건강보험료율 7.19%와 재산점수당 211.5원 동결을 공식 발표로 확인했다. 2026 건강보험·장기요양 요율과 건강보험 상하한은 공식 자료를 저장했다. 2027 장기요양 요율·상하한, 연도별 단수처리 계약과 지역 세부 정책은 미확인으로 남긴다. 따라서 **2026도 최종 납부액은 단수처리 확인 전 제공하지 않는다.** 테스트의 기존 금액 대조는 명시적인 테스트 가정이며 운영 규칙으로 적용하지 않았다.

검증 결과:

- 계산 검증 스크립트 통과: 대표값, 연봉 제외급여, 비교 분해, 상하한 경계, null 전파, 지역 0점, 퇴직 합계, 오류 입력, URL 왕복·구 링크, 콘텐츠 기준.
- 대상 파일 범위 Astro 검사: 4개 파일, 오류 0개. 카테고리 매핑 검사 통과.
- `npm run build` 성공. 전체 `npm run check:all`은 저장소 전반의 타입 오류 397개로 실패했다. 대표 오류는 여러 기존 페이지에서 `CalculatorHero`의 지원하지 않는 `badges` 속성을 전달하는 것이다. 이번 계산기 페이지는 해당 속성을 전달하지 않는다.
- 빌드 결과 브라우저 검증 통과: 320·360·640·768·1280px 페이지 넘침 없음, 대표값·연봉 비교·입력 오류·모드 전환·초기화·링크 복원·복사 성공/실패·콘솔 오류 없음. 모바일·데스크톱 화면과 1200×630 OG 확인.
- 초기 구현 시 커밋·push·배포 미실행. 이후 리포트 배포 준비에서 공통 정적 검사 오류를 해결해 전체 검사 오류 0개를 확인했다.

## 14. 제한 기능 버전 배포 승인

2026-10-08 사용자가 2027 개편 버전의 배포를 명시적으로 요청했다. 요율 기반 이론값·연봉 변화 비교·2026 기록 조회·공유 기능을 공개하고, 미확인 공식 세부 기준에 따른 최종 납부액은 대기 상태와 안내를 유지한다. 최종 납부액 계산 완료로 소개하지 않는다. 공식 기준 확보는 후속 데이터 갱신 조건이며 제한 기능 버전의 배포를 막는 조건으로 해석하지 않는다.
