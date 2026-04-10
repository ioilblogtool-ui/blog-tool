# 육아휴직 + 육아기 단축근무 계산기 설계 문서

> 기획 원문: `docs/plan/202604/육아휴직 + 육아기 단축근무 계산기.md`
> 작성일: 2026-04-05
> 구현 기준: 현재 비교계산소 `/tools/` 정책형 계산기 구조를 기준으로 Codex/Claude가 바로 구현 가능한 수준으로 정리

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/육아휴직 + 육아기 단축근무 계산기.md`
- 구현 대상: `육아휴직 + 육아기 단축근무 계산기`
- 권장 slug: `parental-leave-short-work-calculator`
- URL: `/tools/parental-leave-short-work-calculator/`

### 1-2. 참고 계산기
- `parental-leave-pay`
  - 육아휴직 급여 월별 구간 계산, 타임라인 표, 상한 구조 설명 패턴 참고
- `single-parental-leave-total`
  - 복수 소득원 합산, 월별 타임라인, 잔여기간/총액 요약 카드 구성 참고
- `six-plus-six`
  - 자격 판정 문구, 시나리오 비교, 결론 중심 해석 카드 패턴 참고
- `birth-support-total`
  - 정책형 FAQ, 안내 문구, 내부 링크 흐름 참고

### 1-3. 페이지 역할
이 페이지는 단순 급여 계산기가 아니라 아래 3개를 한 번에 해결하는 허브형 정책 계산기다.
- 육아휴직 최대 사용 가능 기간 판정
- 육아기 근로시간 단축 총 가능 기간과 잔여기간 계산
- 육아휴직 / 단축근무 / 혼합 사용 시 월 수령액 비교

즉, 기존 `육아휴직 급여 계산기`가 “휴직 급여 계산”, `한 명만 육아휴직 총수령액 계산기`가 “가구 총수령액 계산”이라면, 이번 페이지는 **기간 + 급여 + 전략 비교**를 담당하는 상위 허브 도구로 본다.

### 1-4. 구현 전제
- 2026년 정책 기준으로 계산한다.
- 육아휴직 연장 조건은 다음 중 하나 충족 시 18개월로 계산한다.
  - 부모가 같은 자녀에 대해 각각 3개월 이상 육아휴직 사용
  - 한부모 가정
  - 중증 장애아동 부모
- 육아기 근로시간 단축은 기본 12개월 + 미사용 육아휴직 기간의 2배를 가산하고 최대 36개월로 캡을 둔다.
- 단축근무 급여는 2026년 상한을 반영한다.
  - 최초 10시간 단축분: 월 상한 250만원
  - 나머지 단축분: 월 상한 160만원
  - 하한: 월 50만원
- 회사 지급 방식, 통상임금 산정 기준, 사업장 실무 차이로 실제 수령액과 차이가 날 수 있으므로 결과는 항상 `모의계산`으로 안내한다.

### 1-5. 권장 파일 구조
- `src/data/parentalLeaveShortWork.ts`
- `src/pages/tools/parental-leave-short-work-calculator.astro`
- `public/scripts/parental-leave-short-work-calculator.js`
- `src/styles/scss/pages/_parental-leave-short-work-calculator.scss`
- `public/og/tools/parental-leave-short-work-calculator.png`

---

## 2. 페이지 목적
- 사용자가 현재 상황 기준으로 육아휴직이 12개월인지 18개월인지 빠르게 판정하게 한다.
- 이미 사용한 육아휴직/단축근무 이력을 바탕으로 남은 사용 가능 기간을 계산하게 한다.
- 육아휴직과 단축근무 중 어떤 방식이 현금흐름 방어에 더 유리한지 시나리오별로 비교하게 한다.
- 기존 육아휴직/출산 계산기들로 자연스럽게 이어지는 육아 정책 허브 역할을 수행한다.

---

## 3. 핵심 사용자 시나리오

### 3-1. 18개월 가능 여부 먼저 확인하는 사용자
- 사용자는 자녀 생년월일, 가구 유형, 배우자 사용 여부만 입력한다.
- 계산기는 육아휴직 최대 가능 기간을 `12개월` 또는 `18개월`로 즉시 보여준다.
- 왜 그렇게 판정됐는지 한 줄 설명을 함께 보여준다.

### 3-2. 이미 사용한 이력을 반영해 남은 기간이 궁금한 사용자
- 사용자는 육아휴직과 단축근무 사용 이력을 회차별로 입력한다.
- 계산기는 총 사용 개월 수와 남은 개월 수를 각각 보여준다.
- 자녀 기준 사용 가능 종료일도 함께 보여준다.

### 3-3. 단축근무 시 월급이 궁금한 사용자
- 사용자는 월 통상임금, 현재 주 근로시간, 단축 후 주 근로시간을 입력한다.
- 계산기는 회사 지급분, 정부 지원금, 예상 월 수령액을 분리해 보여준다.
- 기존 월급 대비 증감도 카드로 보여준다.

### 3-4. 휴직과 단축근무 중 무엇이 더 나은지 비교하는 사용자
- 사용자는 휴직 우선 / 단축 우선 / 혼합 사용 시나리오를 확인한다.
- 계산기는 총 사용 가능 기간과 예상 월 수령액, 현금흐름 특징을 비교한다.
- 가장 유리한 전략을 결론 카드로 요약한다.

---

## 4. 입력값 / 출력값 정의

### 4-1. 입력값

#### 기본 정책 입력
- `childBirthDate: string`
- `baseDate: string`
- `monthlyOrdinaryWage: number`
- `weeklyHoursBefore: number`
- `householdType: 'GENERAL' | 'SINGLE_PARENT' | 'DISABLED_CHILD'`
- `spouseUsedThreeMonths: boolean`

#### 육아휴직 사용 이력
- `leaveHistory: Array<{ startDate: string; endDate: string; type: 'GENERAL' | 'SIX_PLUS_SIX' | 'UNKNOWN' }>`
- 회차별 개월 수는 입력받지 않고 날짜로부터 계산하는 것을 기본으로 한다.
- 필요 시 모바일 입력 단순화를 위해 `개월 수 직접 입력` 모드 보조 옵션 허용

#### 단축근무 사용 이력
- `shortWorkHistory: Array<{ startDate: string; endDate: string; reducedWeeklyHours: number }>`
- 회차별 개월 수는 날짜 차이로 계산

#### 비교 시나리오 입력
- `plannedLeaveMonths: number`
- `plannedShortWorkHours: number`
- `scenarioMode: 'LEAVE_FIRST' | 'SHORT_FIRST' | 'MIXED' | 'AUTO'`

### 4-2. 출력값

#### 자격 / 기간 출력
- `parentalLeaveMaxMonths`
- `parentalLeaveUsedMonths`
- `parentalLeaveRemainingMonths`
- `shortWorkMaxMonths`
- `shortWorkUsedMonths`
- `shortWorkRemainingMonths`
- `leaveEligibleReason`
- `leaveExpiryDate`
- `shortWorkExpiryDate`

#### 급여 출력
- `parentalLeaveMonthlySummary`
- `shortWorkCompanyPay`
- `shortWorkGovernmentSupport`
- `shortWorkEstimatedMonthlyTotal`
- `monthlyDeltaVsOriginal`

#### 비교 출력
- `bestStrategy`
- `scenarioRows[]`
- `timelineRows[]`
- `policyWarnings[]`

---

## 5. 섹션 구조

### 5-1. 히어로
- 컴포넌트: `CalculatorHero`
- 카피 방향:
  - eyebrow: `육아 정책 계산`
  - title: `육아휴직 + 육아기 단축근무 계산기`
  - description: `이미 사용한 육아휴직과 단축근무를 반영해 남은 기간, 18개월 여부, 2026 기준 예상 월급을 한 번에 계산합니다.`
- 보조 태그 3개 권장
  - `18개월 자격 자동 판정`
  - `남은 단축근무 기간 계산`
  - `2026 급여 상한 반영`

### 5-2. 액션 바
- 컴포넌트: `ToolActionBar`
- 버튼
  - 초기화
  - 공유 링크 복사

### 5-3. 입력 패널
기본 구조는 `single-parental-leave-total`과 비슷하게 `빠른 입력 + 세부 조건 더 보기` 구조를 권장한다.

#### 빠른 입력
- 자녀 생년월일
- 기준일
- 월 통상임금
- 현재 주 근로시간
- 단축 후 주 근로시간
- 배우자도 같은 자녀로 3개월 이상 사용 여부
- 가구 유형

#### 세부 조건 더 보기
- 육아휴직 사용 이력 반복 입력
- 단축근무 사용 이력 반복 입력
- 계획 중인 사용 개월 수 / 시나리오 선택

### 5-4. 상단 요약 카드
`SummaryCards` 6~7칸 구성 권장
- 육아휴직 총 가능 기간
- 이미 사용한 육아휴직
- 남은 육아휴직
- 단축근무 총 가능 기간
- 이미 사용한 단축근무
- 남은 단축근무
- 사용 가능 종료일

### 5-5. 자격 판정 / 결론 카드
`six-plus-six`의 결론 카드 패턴을 차용한다.
- 현재 입력 기준 최대 육아휴직 한도
- 연장 조건 충족 이유 또는 미충족 이유
- 단축근무 총 가능 기간 계산 근거
- 추천 전략 한 줄

### 5-6. 급여 계산 섹션
`parental-leave-pay`의 급여 구조 시각화 패턴을 일부 재사용한다.
- 육아휴직 급여 요약 카드
  - 1~3개월
  - 4~6개월
  - 7개월 이후
- 단축근무 급여 분해 카드
  - 회사 급여
  - 정부 지원금
  - 예상 월 수령액
  - 기존 대비 차이
- 단축시간 구조 바
  - 최초 10시간 단축분
  - 추가 단축분

### 5-7. 시나리오 비교표
전용 비교 테이블 섹션
- 행
  - 휴직 우선
  - 단축 우선
  - 혼합 사용
  - 자동 추천
- 열
  - 설명
  - 예상 월 수령액
  - 남는 기간 구조
  - 현금흐름 특징
  - 추천도

### 5-8. 월별 타임라인
`TimelineToolShell` 패턴을 차용하는 것이 가장 적합하다.
- 월별 구분
  - 육아휴직 구간
  - 단축근무 구간
  - 복직 구간
- 막대 차트 또는 혼합 bar chart
- 표
  - 월차
  - 상태
  - 회사 지급액
  - 지원금
  - 총 수령액

### 5-9. 안내 / 정책 포인트
`InfoNotice` 사용
- 18개월 연장 조건 설명
- 단축근무 최대 36개월 캡 설명
- 단축근무 급여 상한 250/160 설명
- 모의계산 결과라는 주의 문구

### 5-10. SEO / FAQ / 관련 링크
`SeoContent` 구성 고정
- 계산 기준 설명
- 제도 해설
- FAQ
- 관련 계산기 링크
  - `/tools/parental-leave-pay/`
  - `/tools/single-parental-leave-total/`
  - `/tools/six-plus-six/`
  - `/tools/birth-support-total/`

---

## 6. 컴포넌트 구조
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`
- 권장 쉘: `TimelineToolShell`
  - 이유: 입력 패널, 상단 KPI, 월별 타임라인, 표를 자연스럽게 수용 가능

### 6-1. 페이지 전용 블록
- `plsw-eligibility-card`
- `plsw-balance-grid`
- `plsw-pay-breakdown-grid`
- `plsw-scenario-table`
- `plsw-timeline-chart`
- `plsw-history-editor`
- `plsw-policy-chip-list`

### 6-2. 모바일 우선 구조
- 모바일에서는 `빠른 입력 -> 요약 카드 -> 결론 카드 -> 급여 카드 -> 시나리오 비교 -> 타임라인 -> FAQ` 순서
- 회차별 이력 입력은 아코디언 또는 details 구조 권장

---

## 7. 상태 관리 포인트
- 기존 계산기 패턴대로 바닐라 JS + DOM 직접 갱신 구조 사용
- URL query param 복원 지원
  - `birth`
  - `base`
  - `wage`
  - `wh`
  - `rwh`
  - `type`
  - `spouse3`
  - `leaveUsed`
  - `shortUsed`
  - `scenario`
- 회차별 이력은 JSON 압축형 query param보다는 1차 MVP에서 URL 공유 제외 가능
- 1차에서는 반복 이력을 내부 상태로 관리하고, URL에는 합산 개월 수 중심으로만 반영하는 타협안 허용
- 입력 변경 시 아래가 동시에 갱신되어야 한다.
  - 상단 요약 카드
  - 자격 판정 카드
  - 급여 카드
  - 시나리오 비교표
  - 월별 타임라인
- 잘못된 입력 방어
  - 자녀 나이 기준 초과 시 계산 불가 안내
  - 단축 후 주 근로시간이 15 미만 또는 35 초과면 경고
  - 종료일보다 시작일이 늦은 이력 방어
  - 음수 금액 방어

---

## 8. 계산 로직

### 8-1. 육아휴직 최대 기간 판정
```ts
if (householdType === 'SINGLE_PARENT' || householdType === 'DISABLED_CHILD') {
  parentalLeaveMaxMonths = 18;
} else if (spouseUsedThreeMonths) {
  parentalLeaveMaxMonths = 18;
} else {
  parentalLeaveMaxMonths = 12;
}
```

### 8-2. 육아휴직 사용 개월 수 합산
- 회차별 `startDate`, `endDate` 차이를 월 단위로 환산
- 부분 월 처리 방식
  - MVP에서는 `일수/30.4375` 기준 소수 1자리 또는 반올림 개월 수 사용
- `usedLeaveMonths = sum(historyMonths)`
- `remainingLeaveMonths = max(parentalLeaveMaxMonths - usedLeaveMonths, 0)`

### 8-3. 단축근무 총 가능 기간
```ts
const baseShortMonths = 12;
const unusedLeaveMonths = Math.max(parentalLeaveMaxMonths - usedLeaveMonths, 0);
const convertedShortMonths = unusedLeaveMonths * 2;
const shortWorkMaxMonths = Math.min(36, baseShortMonths + convertedShortMonths);
```

### 8-4. 단축근무 사용 개월 수 합산
- 회차별 시작일/종료일로 개월 수 계산
- `remainingShortWorkMonths = max(shortWorkMaxMonths - usedShortMonths, 0)`

### 8-5. 자녀 나이 기준 종료일 계산
- 육아휴직 종료 기준: `8세 되는 날`과 `초2 종료 시점` 중 정책 설명에 맞춘 단순 날짜 안내
- 단축근무 종료 기준: `12세 되는 날` 기준 단순 계산
- 1차 MVP에서는 학년 계산보다 `만 나이 기준 안내 + 주의 문구`로 단순화 가능
- 화면 문구 예시
  - `육아휴직은 자녀 기준으로 2032-03-14 전후까지 사용 검토 가능`
  - `단축근무는 자녀 기준으로 2036-03-14 전후까지 검토 가능`

### 8-6. 단축근무 급여 계산
```ts
const reducedHours = Math.max(weeklyHoursBefore - weeklyHoursAfter, 0);
const firstTenHours = Math.min(reducedHours, 10);
const extraHours = Math.max(reducedHours - 10, 0);

const companyPay = monthlyOrdinaryWage * (weeklyHoursAfter / weeklyHoursBefore);

const supportFirstTenRaw = monthlyOrdinaryWage * (firstTenHours / weeklyHoursBefore);
const supportFirstTenCap = 2500000 * (firstTenHours / 10);
const supportFirstTen = Math.min(supportFirstTenRaw, supportFirstTenCap);

const supportExtraRaw = monthlyOrdinaryWage * 0.8 * (extraHours / weeklyHoursBefore);
const supportExtraCap = extraHours > 0 ? 1600000 : 0;
const supportExtra = Math.min(supportExtraRaw, supportExtraCap);

const governmentSupport = Math.max(supportFirstTen + supportExtra, 500000);
const estimatedMonthlyTotal = companyPay + governmentSupport;
const deltaVsOriginal = estimatedMonthlyTotal - monthlyOrdinaryWage;
```

### 8-7. 육아휴직 급여 요약
- 이 페이지에서는 `육아휴직 급여 계산기` 수준의 월별 전개를 완전히 복제하지 않는다.
- 요약용 값만 계산한다.
  - 1~3개월: 100%, 상한 250만
  - 4~6개월: 100%, 상한 200만
  - 7개월 이후: 80%, 상한 160만
- 정밀 계산이 필요하면 관련 계산기로 연결

### 8-8. 추천 전략 판정
간단한 룰 기반으로 시작
- `estimatedShortWorkTotal`이 휴직 월급보다 충분히 높고 남은 단축근무 기간이 길면 `단축 우선`
- 남은 육아휴직 기간이 길고 현금흐름보다 돌봄 시간이 중요하면 `휴직 우선`
- 둘 다 중간 수준이면 `혼합`
- 자격 조건상 18개월이 열리면 `부부 전략형` 보조 문구 추가

---

## 9. 데이터 파일 구조

### 9-1. `src/data/parentalLeaveShortWork.ts`
포함 항목
- 페이지 메타
- 기본 입력값
- 정책 상수
  - 육아휴직 상한 개월 수
  - 단축근무 상한 개월 수
  - 단축근무 급여 상한/하한
- 자격 판정 문구 맵
- 시나리오 설명 데이터
- FAQ
- 외부 참고 링크
- 관련 계산기 링크

예시 타입
```ts
export type HouseholdType = 'GENERAL' | 'SINGLE_PARENT' | 'DISABLED_CHILD';
export type ScenarioMode = 'LEAVE_FIRST' | 'SHORT_FIRST' | 'MIXED' | 'AUTO';

export interface LeaveHistoryItem {
  startDate: string;
  endDate: string;
  type: 'GENERAL' | 'SIX_PLUS_SIX' | 'UNKNOWN';
}

export interface ShortWorkHistoryItem {
  startDate: string;
  endDate: string;
  reducedWeeklyHours: number;
}
```

### 9-2. 외부 참고 링크 권장
- 고용노동부 육아휴직/육아기 근로시간 단축 안내
- Work24 모의계산 또는 제도 안내
- 관련 공식 FAQ

---

## 10. 구현 순서
1. `parental-leave-pay`, `single-parental-leave-total`, `six-plus-six` 마크업/스크립트/스타일 구조 재확인
2. `src/data/parentalLeaveShortWork.ts` 작성
3. 기본 입력 + 빠른 계산용 합산 상태부터 구현
4. 자격 판정 / 남은 기간 카드 구현
5. 단축근무 급여 계산 카드 구현
6. 육아휴직 급여 요약 카드 구현
7. 시나리오 비교표 구현
8. 월별 타임라인 차트 및 표 구현
9. FAQ / 관련 링크 / 정책 안내 연결
10. query param 및 공유 링크 반영
11. 모바일 밀도 / 회차 입력 UX / 에지케이스 점검

---

## 11. QA 체크포인트

### 11-1. 정책 계산
- 배우자 사용 여부 없으면 기본 12개월로 계산되는지
- 한부모 / 중증 장애아동 부모는 배우자 조건 없이 18개월로 계산되는지
- 미사용 육아휴직 2배 가산 후 단축근무가 36개월을 넘지 않는지
- 단축근무 급여 상한이 250만원 / 160만원으로 나뉘어 적용되는지
- 하한 50만원 적용 로직이 비정상적으로 과대 계산되지 않는지

### 11-2. 날짜 / 기간 계산
- 시작일과 종료일 역전 입력 방어되는지
- 자녀 나이 기준 초과 시 계산 차단 또는 경고되는지
- 회차별 이력 합산 시 중복 구간이 있으면 경고되는지
- 개월 수 환산 기준이 카드 / 표 / 차트에서 일관적인지

### 11-3. UX
- 빠른 입력만으로도 상단 카드가 바로 갱신되는지
- 모바일에서 회차별 이력 입력이 과하게 복잡하지 않은지
- `왜 12개월인지 / 왜 18개월인지` 설명이 즉시 보이는지
- 단축근무 급여가 `회사 급여 + 정부 지원금` 구조로 직관적으로 보이는지
- 관련 계산기 링크가 정책 흐름상 자연스럽게 이어지는지

### 11-4. 콘텐츠 / SEO
- 타이틀, 메타 디스크립션, H1이 `육아휴직 단축근무 계산기`, `육아기 근로시간 단축 계산기`, `육아휴직 18개월 계산기` 키워드를 충분히 포함하는지
- FAQ가 실제 검색 질문과 맞는지
- 안내 문구가 제도 설명과 모의계산 한계를 동시에 담고 있는지

---

## 12. 최종 구현 방향 정리
이 페이지는 기존 비교계산소 육아 정책 계산기군의 상위 허브 역할로 구현한다.

핵심 방향은 다음과 같다.
- `parental-leave-pay`의 급여 구조 설명력
- `single-parental-leave-total`의 합산/타임라인 구조
- `six-plus-six`의 자격 판정과 전략 비교 UX

즉, 사용자에게는 아래 흐름이 자연스럽게 느껴져야 한다.
- 먼저 12개월인지 18개월인지 판정
- 이미 쓴 기간을 빼고 남은 휴직/단축근무 계산
- 단축근무 시 월 수령액 확인
- 내 상황에서 휴직 우선 / 단축 우선 / 혼합 사용 중 어떤 전략이 유리한지 비교
- 필요하면 기존 육아휴직 급여 계산기, 6+6 계산기, 출산~2세 지원금 계산기로 이동
