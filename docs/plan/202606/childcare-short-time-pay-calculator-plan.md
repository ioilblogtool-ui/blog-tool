# 육아기 근로시간 단축 급여 계산기 기획서

> 작성일: 2026-06-20  
> 문서 유형: `/tools/` 신규 계산기 상세 기획  
> 권장 slug: `childcare-short-time-pay-calculator`  
> 권장 URL: `/tools/childcare-short-time-pay-calculator/`

---

## 1. 문서 개요

### 1-1. 문서명

**육아기 근로시간 단축 급여 계산기 웹기획서 v1**

### 1-2. 한 줄 정의

월 통상임금과 주 근로시간을 입력하면, 육아기 근로시간 단축 시 회사 지급 임금, 고용보험 단축 급여, 예상 월 수령액, 기존 월급 대비 감소액을 계산하는 정책형 급여 계산기.

### 1-3. 기획 배경

육아기 근로시간 단축 제도는 실제 사용 전 사용자가 가장 먼저 궁금해하는 지점이 명확하다.

- 주 40시간에서 30시간으로 줄이면 월급이 얼마나 줄어드는가
- 회사에서 줄어든 월급 외에 고용보험에서 얼마를 보전받는가
- 단축 후 총 월수령액이 기존 통상임금 대비 어느 정도인지
- 최초 10시간 단축분과 그 외 단축분의 계산 방식이 어떻게 다른지
- 육아휴직과 비교했을 때 현금흐름이 더 나은지

기존 `parental-leave-short-work-calculator`가 육아휴직 기간, 단축근무 가능 기간, 18개월 여부, 전략 비교까지 포함하는 상위 허브라면, 이번 계산기는 **단축근무 월급과 급여액만 빠르게 계산하는 경량 특화 도구**로 분리한다.

### 1-4. 기대효과

- 검색 의도가 강한 정책형 계산기 확보
- 육아휴직 급여 계산기군과 내부 링크 강화
- 사용자 체류시간 증가
- 애드센스 관점에서 실사용 가치가 높은 독립 도구 추가
- 기존 육아 정책 허브 페이지의 깊이 보강

---

## 2. 서비스 포지셔닝

### 2-1. 페이지 역할

이 페이지는 `내가 단축근무하면 월 수령액이 얼마인가`에만 집중한다.

사용자에게 보여줘야 하는 핵심 답은 다음 4개다.

1. 단축 후 회사 지급 예상 임금
2. 고용보험 육아기 근로시간 단축 급여 예상액
3. 회사 임금 + 고용보험 급여 합산 월수령 예상액
4. 기존 월 통상임금 대비 감소액 또는 보전율

### 2-2. 기존 페이지와의 역할 분리

| 페이지 | 역할 | 이번 페이지와의 관계 |
|---|---|---|
| `parental-leave-pay` | 육아휴직 급여 월별 계산 | 휴직 선택 시 비교 링크 |
| `parental-leave-short-work-calculator` | 육아휴직 + 단축근무 기간·전략 허브 | 상위 허브, 이번 페이지로 급여 계산 연결 |
| `single-parental-leave-total` | 한 명만 육아휴직할 때 총수령액 | 가구 현금흐름 비교 링크 |
| `six-plus-six` | 6+6 육아휴직 급여 계산 | 부부 동시/순차 사용 비교 링크 |
| 신규 `childcare-short-time-pay-calculator` | 단축근무 급여 정밀 계산 | 단축근무 급여 계산에 특화 |

### 2-3. 권장 페이지 유형

- `/tools/` 계산기
- 정책형 급여 계산기
- `SimpleToolShell` 또는 커스텀 `BaseLayout` 직접 구성
- 실시간 계산형 UX

---

## 3. 타겟 사용자

### 3-1. 주요 사용자

- 육아기 근로시간 단축 사용을 검토하는 직장인
- 자녀가 있고 전일제 근무를 줄여야 하는 맞벌이 부모
- 육아휴직 대신 단축근무를 고민하는 부모
- 인사팀에 신청 전 예상 월급을 계산해보고 싶은 사용자
- 통상임금, 단축시간, 고용보험 급여 구조를 이해하고 싶은 사용자

### 3-2. 사용자 니즈

- 내가 받을 월급이 실제로 얼마나 줄어드는지 알고 싶다
- 정부 지원금이 얼마인지 알고 싶다
- 주 40시간에서 35시간, 30시간, 25시간, 20시간으로 줄일 때 차이를 보고 싶다
- 단축근무와 육아휴직 중 어느 쪽이 현금흐름에 유리한지 대략 비교하고 싶다
- 신청 전에 회사와 이야기할 기준 금액을 알고 싶다

### 3-3. 검색 의도

주요 검색어:

- 육아기 근로시간 단축 급여 계산기
- 육아기 단축근무 급여 계산
- 육아기 근로시간 단축 월급
- 육아기 근로시간 단축 고용보험 급여
- 육아기 단축근무 주 30시간 월급
- 육아기 근로시간 단축 통상임금
- 육아기 근로시간 단축 10시간

---

## 4. 정책 계산 전제

### 4-1. 기준 정책

기본 계산 기준은 2026년 기준으로 둔다.

- 육아기 근로시간 단축 급여는 통상임금을 기준으로 계산한다.
- 단축한 주 근로시간 중 최초 10시간 단축분과 나머지 단축분을 분리해 계산한다.
- 최초 10시간 단축분은 상한 250만원 기준을 적용한다.
- 나머지 단축분은 상한 160만원 기준을 적용한다.
- 하한액은 월 50만원 기준을 정책 상수로 둔다.
- 실제 지급액은 고용보험 심사, 통상임금 산정, 사업장 임금 지급 방식에 따라 달라질 수 있다.

### 4-2. 공식 출처

문서와 화면 하단 안내에 다음 공식 출처를 연결한다.

- 고용24: `https://www.work24.go.kr/`
- 고용보험/고용24 육아기 근로시간 단축 급여 신청 안내
- 고용노동부 모성보호 제도 안내

구현 시에는 화면에 `공식 기준 확인일: 2026-06-20` 형태로 표시한다.

### 4-3. 결과 표현 원칙

계산 결과는 확정 지급액이 아니라 `세전 모의계산`으로 표현한다.

반드시 포함할 배지:

- `세전 추정`
- `통상임금 기준`
- `고용보험 심사 전`

금지 표현:

- `반드시 지급됩니다`
- `확정 급여액`
- `실수령액 확정`
- `신청하면 받을 수 있는 금액`

권장 표현:

- `예상 급여`
- `모의계산`
- `고용보험 지급 심사 결과와 다를 수 있습니다`
- `회사 임금 산정 방식에 따라 실제 월급과 차이가 날 수 있습니다`

---

## 5. 핵심 기능 정의

### 5-1. 빠른 급여 계산

사용자가 최소 3개 값만 입력해도 계산이 돌아가야 한다.

필수 입력:

- 월 통상임금
- 단축 전 주 근로시간
- 단축 후 주 근로시간

즉시 출력:

- 단축 주 근로시간
- 단축 비율
- 회사 지급 예상 임금
- 고용보험 단축 급여 예상액
- 총 월수령 예상액
- 기존 월 통상임금 대비 감소액

### 5-2. 최초 10시간 / 추가 단축분 분해

사용자는 제도 구조를 잘 모른다. 따라서 결과를 한 덩어리로 보여주면 신뢰도가 낮다.

결과 영역에서 다음을 분해해 보여준다.

- 최초 10시간 단축분
- 추가 단축시간
- 최초 10시간 급여 계산액
- 추가 단축시간 급여 계산액
- 상한 적용 여부
- 하한 적용 여부

### 5-3. 시나리오 비교

단축 후 시간을 직접 입력하는 방식 외에, 버튼으로 대표 시나리오를 빠르게 선택하게 한다.

추천 프리셋:

- 주 40 → 35시간
- 주 40 → 30시간
- 주 40 → 25시간
- 주 40 → 20시간
- 주 40 → 15시간

프리셋 선택 시 입력값이 자동 변경되고 결과가 갱신된다.

### 5-4. 회사 지급 임금 직접 입력

회사 임금 지급 방식이 실제로 다를 수 있으므로 선택 입력을 둔다.

옵션:

- 자동 계산: `월 통상임금 × 단축 후 시간 / 단축 전 시간`
- 직접 입력: 회사가 안내한 단축 후 월급 입력

직접 입력 시:

- 정부 지원금 계산은 통상임금 기준으로 유지
- 총 월수령 예상액은 직접 입력한 회사 지급액 + 정부 지원금
- 화면에 `회사 지급액 직접 입력 적용` 배지 표시

### 5-5. 월 단위 총액 계산

단축 사용 예정 기간을 입력하면 총액을 계산한다.

입력:

- 사용 예정 개월 수

출력:

- 기간 중 회사 지급 예상 총액
- 기간 중 고용보험 급여 예상 총액
- 기간 중 합산 수령 예상액
- 기존 통상임금 유지 대비 총 감소액

---

## 6. 입력값 정의

### 6-1. 기본 입력

| 필드 | 타입 | 기본값 | 설명 |
|---|---:|---:|---|
| `monthlyOrdinaryWage` | number | 3000000 | 월 통상임금 |
| `weeklyHoursBefore` | number | 40 | 단축 전 주 근로시간 |
| `weeklyHoursAfter` | number | 30 | 단축 후 주 근로시간 |
| `plannedMonths` | number | 12 | 사용 예정 개월 수 |
| `companyPayMode` | string | `AUTO` | 회사 지급액 산정 방식 |
| `manualCompanyPay` | number | null | 직접 입력 회사 지급액 |

### 6-2. 고급 입력

| 필드 | 타입 | 기본값 | 설명 |
|---|---:|---:|---|
| `includeMinimumSupport` | boolean | true | 하한액 적용 |
| `policyYear` | number | 2026 | 정책 기준 연도 |
| `roundingMode` | string | `WON` | 원 단위 반올림 |
| `taxNoteMode` | string | `PRE_TAX` | 세전 안내 |

### 6-3. 입력 제한

- 월 통상임금: 50만원 ~ 1,500만원
- 단축 전 주 근로시간: 15 ~ 52시간
- 단축 후 주 근로시간: 15 ~ 35시간
- 단축 후 주 근로시간은 단축 전보다 작아야 함
- 단축 주 근로시간은 1시간 이상이어야 함
- 사용 예정 개월 수: 1 ~ 36개월

정책상 실제 단축 후 근로시간은 주 15시간 이상 35시간 이하 범위를 안내한다. 입력값이 이 범위를 벗어나면 계산을 막기보다 경고 카드와 함께 정책 범위 밖이라고 표시한다.

---

## 7. 출력값 정의

### 7-1. 핵심 결과

| 출력값 | 설명 |
|---|---|
| `reducedWeeklyHours` | 줄어든 주 근로시간 |
| `reductionRate` | 근로시간 감소율 |
| `companyPay` | 회사 지급 예상 임금 |
| `governmentSupport` | 고용보험 단축 급여 예상액 |
| `estimatedMonthlyTotal` | 월 합산 수령 예상액 |
| `monthlyDelta` | 기존 통상임금 대비 월 감소액 |
| `replacementRate` | 기존 통상임금 대비 보전율 |

### 7-2. 급여 분해 결과

| 출력값 | 설명 |
|---|---|
| `firstTenHours` | 최초 10시간 구간에 들어가는 단축시간 |
| `extraHours` | 최초 10시간을 초과하는 단축시간 |
| `firstTenSupport` | 최초 10시간 구간 급여 |
| `extraSupport` | 추가 단축시간 구간 급여 |
| `supportBeforeMinimum` | 하한 적용 전 지원금 |
| `minimumApplied` | 하한 적용 여부 |
| `capAppliedLabels[]` | 상한 적용 여부 안내 |

### 7-3. 기간 총액 결과

| 출력값 | 설명 |
|---|---|
| `totalCompanyPay` | 사용 기간 중 회사 지급 예상 총액 |
| `totalGovernmentSupport` | 사용 기간 중 고용보험 급여 예상 총액 |
| `totalReceived` | 사용 기간 중 합산 수령 예상액 |
| `totalDelta` | 기존 통상임금 유지 대비 총 차이 |

---

## 8. 계산 로직

### 8-1. 정책 상수

```ts
export const CHILDCARE_SHORT_TIME_POLICY = {
  year: 2026,
  firstTenHoursCapWage: 2_500_000,
  extraHoursCapWage: 1_600_000,
  minimumMonthlySupport: 500_000,
  minWeeklyHoursAfter: 15,
  maxWeeklyHoursAfter: 35,
  defaultWeeklyHoursBefore: 40,
  defaultWeeklyHoursAfter: 30,
};
```

### 8-2. 단축시간 계산

```ts
const reducedWeeklyHours = Math.max(weeklyHoursBefore - weeklyHoursAfter, 0);
const firstTenHours = Math.min(reducedWeeklyHours, 10);
const extraHours = Math.max(reducedWeeklyHours - 10, 0);
const reductionRate = reducedWeeklyHours / weeklyHoursBefore;
```

### 8-3. 회사 지급 임금

자동 계산:

```ts
const autoCompanyPay = monthlyOrdinaryWage * (weeklyHoursAfter / weeklyHoursBefore);
const companyPay = companyPayMode === "MANUAL"
  ? manualCompanyPay
  : autoCompanyPay;
```

주의:

- 회사 지급 임금은 단순 비례 계산이다.
- 실제 임금은 기본급, 수당, 취업규칙, 단체협약, 통상임금 범위에 따라 달라질 수 있다.
- 직접 입력 모드를 제공해 현실 금액을 반영할 수 있게 한다.

### 8-4. 고용보험 단축 급여

기본 계산 구조:

```ts
const firstTenRaw =
  monthlyOrdinaryWage * (firstTenHours / weeklyHoursBefore);

const firstTenCap =
  CHILDCARE_SHORT_TIME_POLICY.firstTenHoursCapWage
  * (firstTenHours / weeklyHoursBefore);

const firstTenSupport = Math.min(firstTenRaw, firstTenCap);

const extraRaw =
  monthlyOrdinaryWage * 0.8 * (extraHours / weeklyHoursBefore);

const extraCap =
  CHILDCARE_SHORT_TIME_POLICY.extraHoursCapWage
  * (extraHours / weeklyHoursBefore);

const extraSupport = Math.min(extraRaw, extraCap);

const supportBeforeMinimum = firstTenSupport + extraSupport;

const governmentSupport =
  reducedWeeklyHours > 0
    ? Math.max(
        supportBeforeMinimum,
        CHILDCARE_SHORT_TIME_POLICY.minimumMonthlySupport
      )
    : 0;
```

### 8-5. 총 월수령액

```ts
const estimatedMonthlyTotal = companyPay + governmentSupport;
const monthlyDelta = estimatedMonthlyTotal - monthlyOrdinaryWage;
const replacementRate = estimatedMonthlyTotal / monthlyOrdinaryWage;
```

### 8-6. 기간 총액

```ts
const totalCompanyPay = companyPay * plannedMonths;
const totalGovernmentSupport = governmentSupport * plannedMonths;
const totalReceived = estimatedMonthlyTotal * plannedMonths;
const totalOriginal = monthlyOrdinaryWage * plannedMonths;
const totalDelta = totalReceived - totalOriginal;
```

### 8-7. 예시 검증 케이스

#### 케이스 A: 통상임금 300만원, 주 40 → 30시간

- 단축시간: 10시간
- 회사 지급 예상: 225만원
- 최초 10시간 급여: 62.5만원 기준 계산
- 추가 단축분: 없음
- 월 합산 예상: 약 287.5만원
- 기존 대비: 약 -12.5만원

#### 케이스 B: 통상임금 300만원, 주 40 → 20시간

- 단축시간: 20시간
- 회사 지급 예상: 150만원
- 최초 10시간 급여: 62.5만원 기준 계산
- 추가 10시간 급여: 60만원 기준 계산
- 월 합산 예상: 약 272.5만원
- 기존 대비: 약 -27.5만원

#### 케이스 C: 통상임금 500만원, 주 40 → 30시간

- 단축시간: 10시간
- 회사 지급 예상: 375만원
- 최초 10시간 급여는 상한 기준 영향을 받음
- 월 합산 예상은 상한 적용 후 계산
- 화면에서 `상한 적용` 배지 표시

---

## 9. 화면 구성

### 9-1. 히어로

컴포넌트:

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`

문구:

- eyebrow: `육아 정책 계산`
- title: `육아기 근로시간 단축 급여 계산기`
- description: `월 통상임금과 단축 전후 주 근로시간을 입력하면 회사 지급 임금, 고용보험 급여, 예상 월수령액을 계산합니다.`

태그:

- `2026 기준`
- `세전 모의계산`
- `통상임금 기준`

### 9-2. 입력 패널

섹션 제목:

- `단축 전후 근로시간과 통상임금을 입력하세요`

입력 구성:

- 월 통상임금
- 단축 전 주 근로시간
- 단축 후 주 근로시간
- 사용 예정 개월 수
- 회사 지급액 직접 입력 토글
- 회사 지급액 직접 입력 필드

프리셋 버튼:

- `40→35`
- `40→30`
- `40→25`
- `40→20`
- `40→15`

### 9-3. 상단 결과 카드

카드 4개:

1. `예상 월수령액`
2. `고용보험 급여`
3. `회사 지급 예상`
4. `기존 대비 차이`

각 카드에는 작은 근거 문구를 넣는다.

예:

- `회사 지급액 + 고용보험 급여`
- `최초 10시간 / 추가 단축분 분리 계산`
- `단순 시간 비례 계산`
- `기존 월 통상임금 대비`

### 9-4. 단축시간 분해 섹션

목적:

- 사용자가 왜 이 금액이 나왔는지 이해하게 한다.

구성:

- 가로 진행 바
- `근무 유지 시간`
- `최초 10시간 단축`
- `추가 단축시간`

예:

```text
주 40시간 기준
[근무 30시간] [최초 10시간 단축] [추가 0시간]
```

### 9-5. 급여 산식 카드

카드 3개:

- 최초 10시간 단축분
- 추가 단축시간
- 하한/상한 적용

각 카드에는 다음 정보를 보여준다.

- 적용 시간
- 계산 전 금액
- 상한 적용 후 금액
- 최종 반영 금액

### 9-6. 기간 총액 섹션

사용 예정 개월 수 기준 총액을 보여준다.

표:

| 구분 | 월 금액 | 사용 개월 | 합계 |
|---|---:|---:|---:|
| 회사 지급 예상 | 000원 | 12개월 | 000원 |
| 고용보험 급여 예상 | 000원 | 12개월 | 000원 |
| 합산 수령 예상 | 000원 | 12개월 | 000원 |
| 기존 통상임금 기준 | 000원 | 12개월 | 000원 |

### 9-7. 시나리오 비교 섹션

같은 월 통상임금으로 단축 후 시간을 바꿨을 때 결과를 비교한다.

열:

- 단축 후 주 근로시간
- 회사 지급 예상
- 고용보험 급여
- 월수령 예상
- 기존 대비 차이
- 보전율

행:

- 주 35시간
- 주 30시간
- 주 25시간
- 주 20시간
- 주 15시간

### 9-8. 정책 안내 섹션

`InfoNotice` 사용.

안내 문구:

- 이 계산기는 세전 모의계산입니다.
- 실제 지급액은 고용보험 심사 및 통상임금 산정 기준에 따라 달라질 수 있습니다.
- 회사 지급 임금은 사업장 임금 규정에 따라 차이가 날 수 있습니다.
- 단축 후 근로시간은 일반적으로 주 15시간 이상 35시간 이하 범위를 확인해야 합니다.

### 9-9. 관련 계산기

관련 링크:

- `/tools/parental-leave-pay/` — 육아휴직 급여 계산기
- `/tools/parental-leave-short-work-calculator/` — 육아휴직 + 단축근무 기간 계산기
- `/tools/single-parental-leave-total/` — 한 명만 육아휴직 총수령액 계산기
- `/tools/six-plus-six/` — 6+6 육아휴직 급여 계산기
- `/tools/birth-support-total/` — 출산~육아 지원금 총액 계산기

### 9-10. SEO 콘텐츠

`SeoContent` 구성.

intro 4문단:

1. 육아기 근로시간 단축 급여가 필요한 상황
2. 회사 월급과 고용보험 급여가 나뉘는 구조
3. 최초 10시간과 추가 단축시간 계산 방식 차이
4. 실제 신청 전 확인해야 할 통상임금/회사 규정/고용보험 심사

criteria:

- `2026년 육아기 근로시간 단축 급여 기준을 반영한 세전 모의계산`
- `월 통상임금과 주 근로시간을 기준으로 계산`
- `회사 지급 임금은 단순 시간 비례 계산 또는 직접 입력값 사용`
- `실제 지급액은 고용보험 심사와 회사 임금 산정 방식에 따라 달라질 수 있음`

FAQ 7개 이상:

- 육아기 근로시간 단축 급여는 누가 받을 수 있나요?
- 단축 후 회사 월급은 어떻게 계산되나요?
- 최초 10시간 단축분은 왜 따로 계산하나요?
- 주 40시간에서 30시간으로 줄이면 얼마나 받나요?
- 주 15시간까지 줄일 수 있나요?
- 육아휴직 급여와 동시에 받을 수 있나요?
- 실제 지급액이 계산기와 다를 수 있나요?
- 통상임금과 세전 월급은 같은가요?

---

## 10. 데이터 파일 구조

### 10-1. 권장 파일

- `src/data/childcareShortTimePay.ts`

### 10-2. 포함 데이터

```ts
export type CompanyPayMode = "AUTO" | "MANUAL";

export interface ChildcareShortTimePayPolicy {
  year: number;
  sourceCheckedAt: string;
  firstTenHoursCapWage: number;
  extraHoursCapWage: number;
  minimumMonthlySupport: number;
  minWeeklyHoursAfter: number;
  maxWeeklyHoursAfter: number;
}

export interface ChildcareShortTimePreset {
  label: string;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  description: string;
}

export interface ChildcareShortTimeFaq {
  question: string;
  answer: string;
}

export interface ChildcareShortTimeRelatedLink {
  href: string;
  label: string;
  description: string;
}
```

### 10-3. 메타 데이터

```ts
export const childcareShortTimePayMeta = {
  slug: "childcare-short-time-pay-calculator",
  title: "육아기 근로시간 단축 급여 계산기",
  description:
    "월 통상임금과 단축 전후 주 근로시간을 입력해 회사 지급 임금, 고용보험 육아기 근로시간 단축 급여, 예상 월수령액을 계산합니다.",
  updatedAt: "2026-06-20",
};
```

---

## 11. 구현 파일 구조

필수 파일:

- `src/data/childcareShortTimePay.ts`
- `src/pages/tools/childcare-short-time-pay-calculator.astro`
- `public/scripts/childcare-short-time-pay-calculator.js`
- `src/styles/scss/pages/_childcare-short-time-pay-calculator.scss`

등록 파일:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

OG 이미지:

- `public/og/tools/childcare-short-time-pay-calculator.png`

---

## 12. UX 상세

### 12-1. 입력 UX

월 통상임금은 큰 숫자 입력이므로 다음 보조 버튼을 제공한다.

- `250만원`
- `300만원`
- `400만원`
- `500만원`

주 근로시간은 stepper 또는 segmented control을 사용한다.

- 단축 전: 기본 40시간
- 단축 후: 35 / 30 / 25 / 20 / 15시간 빠른 선택

### 12-2. 결과 UX

첫 화면에서 결과 4개가 바로 보여야 한다.

모바일 순서:

1. 입력
2. 예상 월수령액
3. 회사 지급 / 고용보험 급여 분리 카드
4. 기존 대비 차이
5. 계산 근거
6. 시나리오 비교
7. FAQ

### 12-3. 경고 UX

입력이 정책 범위를 벗어나면 계산 결과를 숨기지 말고, 경고를 결과 위에 표시한다.

예:

- `단축 후 주 근로시간이 35시간을 초과했습니다. 육아기 근로시간 단축 제도 범위를 다시 확인하세요.`
- `단축 후 주 근로시간이 15시간 미만입니다. 실제 신청 가능 여부를 회사와 고용센터에 확인해야 합니다.`
- `단축 전보다 단축 후 근로시간이 길거나 같습니다. 단축 전후 시간을 다시 입력하세요.`

### 12-4. 공유 UX

`ToolActionBar`에 공유 링크 복사 기능을 둔다.

URL 파라미터:

- `wage`
- `before`
- `after`
- `months`
- `mode`
- `companyPay`

예:

`/tools/childcare-short-time-pay-calculator/?wage=3000000&before=40&after=30&months=12`

---

## 13. SEO 전략

### 13-1. Title

`육아기 근로시간 단축 급여 계산기｜단축근무 월급·고용보험 급여 예상`

### 13-2. Description

`월 통상임금과 단축 전후 주 근로시간을 입력하면 육아기 근로시간 단축 시 회사 지급 임금, 고용보험 급여, 예상 월수령액과 기존 대비 감소액을 계산합니다.`

### 13-3. H1

`육아기 근로시간 단축 급여 계산기`

### 13-4. 주요 H2

- `단축근무 월급과 고용보험 급여를 계산하세요`
- `최초 10시간 단축분과 추가 단축분 계산 방식`
- `단축 후 주 근로시간별 월수령액 비교`
- `육아기 근로시간 단축 급여 신청 전 확인할 점`
- `자주 묻는 질문`

### 13-5. 내부 링크 앵커

- `육아휴직 급여 계산기`
- `육아휴직 18개월 계산기`
- `6+6 육아휴직 급여 계산기`
- `출산 육아 지원금 총액 계산기`

---

## 14. 애드센스 품질 체크

### 14-1. 저가치 콘텐츠 방지 요소

- 계산기가 첫 화면에서 실제로 작동해야 한다.
- `준비 중`, `업데이트 예정`, `확인 중`, `TODO` 같은 문구를 사용하지 않는다.
- 정책 수치가 불확실한 경우 `공개 기준`, `세전 모의계산`, `심사 결과와 다를 수 있음`으로 표현한다.
- FAQ는 일반 설명이 아니라 계산기 입력/결과와 직접 연결되는 질문으로 구성한다.
- 공식 출처 링크를 하단에 제공한다.

### 14-2. 독창성 강화

공식 제도 설명만 반복하지 않는다.

이 페이지의 고유 가치는 다음이다.

- 월 통상임금과 근로시간만으로 빠르게 계산
- 최초 10시간 / 추가 단축분을 시각적으로 분리
- 회사 지급액 직접 입력 지원
- 단축 후 근로시간별 시나리오 비교
- 기간 총액과 기존 대비 감소액 제공

---

## 15. QA 체크리스트

### 15-1. 계산 QA

- 주 40→30시간에서 단축시간이 10시간으로 계산되는지
- 주 40→20시간에서 최초 10시간과 추가 10시간이 분리되는지
- 단축 후 시간이 단축 전보다 크거나 같으면 경고가 뜨는지
- 월 통상임금이 높을 때 상한 적용 배지가 뜨는지
- 지원금 하한 적용 여부가 과대 계산을 만들지 않는지
- 회사 지급액 직접 입력 시 총 월수령액이 직접 입력값 기준으로 바뀌는지
- 사용 개월 수 변경 시 기간 총액이 갱신되는지

### 15-2. UX QA

- 모바일 320px에서 입력 필드와 카드가 겹치지 않는지
- 프리셋 버튼 클릭 시 값이 즉시 반영되는지
- 숫자 입력 쉼표 표시가 자연스러운지
- 결과 카드의 원/만원 표기가 일관적인지
- 경고 문구가 결과를 가리지 않는지
- 공유 링크 복사 후 새로고침해도 값이 복원되는지

### 15-3. 콘텐츠 QA

- 화면에 영어 사용자 문구가 없는지
- `확정 지급액`처럼 오해되는 표현이 없는지
- 정책 기준일과 공식 출처가 표시되는지
- FAQ가 7개 이상인지
- 관련 계산기 내부 링크가 모두 실제 URL인지

### 15-4. 배포 QA

- `src/data/tools.ts` 등록
- `src/styles/app.scss` `@use` 추가
- `public/sitemap.xml` URL 추가
- `npm run build` 성공
- OG 이미지 존재 확인

---

## 16. 구현 우선순위

### 16-1. MVP

1. 월 통상임금 / 단축 전후 주 근로시간 입력
2. 회사 지급 임금 자동 계산
3. 고용보험 급여 예상액 계산
4. 예상 월수령액 / 기존 대비 차이 카드
5. 최초 10시간 / 추가 단축분 분해 카드
6. FAQ / SeoContent / 관련 링크
7. tools 등록, sitemap 등록, build 통과

### 16-2. 2차 개선

1. 회사 지급액 직접 입력 모드
2. 주 근로시간별 시나리오 비교표
3. 사용 개월 수 기준 기간 총액
4. 공유 URL 파라미터
5. 차트 또는 근로시간 분해 바

### 16-3. 3차 개선

1. 육아휴직 급여와 현금흐름 비교
2. 부부 사용 전략 연결
3. 월별 타임라인
4. 신청 체크리스트
5. 고용센터 문의 전 확인 항목

---

## 17. 최종 방향 정리

이 계산기는 기존 육아 정책 허브와 경쟁하는 페이지가 아니라, 사용자가 가장 자주 묻는 `단축근무하면 이번 달 월급이 얼마인가`를 빠르게 풀어주는 실전형 계산기로 만든다.

핵심은 세 가지다.

1. 첫 화면에서 바로 계산된다.
2. 회사 월급과 고용보험 급여가 분리되어 보인다.
3. 정책 기준과 모의계산 한계가 명확하다.

구현 시에는 너무 큰 정책 허브로 확장하지 말고, 급여 계산 정확도와 설명력에 집중한다. 기간, 18개월, 사용 전략은 기존 `parental-leave-short-work-calculator`로 연결하는 것이 전체 사이트 구조상 가장 좋다.
