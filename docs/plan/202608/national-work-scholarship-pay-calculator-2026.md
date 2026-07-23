# 비교계산소 웹 콘텐츠 기획서
## 국가근로장학금 월수령액 계산기 2026

> 상태: 기획 초안  
> 작성일: 2026-07-23  
> 콘텐츠 유형: `/tools/` 정책형 수입 계산기  
> 핵심 주의: 국가근로장학금은 신청한다고 모두 선발되는 제도가 아니다. 계산 결과는 `선발 후 실제 근로시간을 채웠을 때의 예상 장학금`으로 표시해야 한다.

---

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| 콘텐츠명 | 국가근로장학금 월수령액 계산기 2026 |
| 추천 slug | `national-work-scholarship-pay-calculator-2026` |
| 추천 URL | `/tools/national-work-scholarship-pay-calculator-2026/` |
| 콘텐츠 유형 | 대학생 근로장학금 월수령액 계산기 |
| 카테고리 | 교육·대학 / 복지·지원금 |
| 1차 키워드 | 국가근로장학금 월급, 국가근로장학금 시급, 국가근로장학금 월수령액 계산기 |
| 2차 키워드 | 국가근로장학금 2학기, 국가근로 교내 교외 시급, 국가근로장학금 근로시간, 국가근로장학금 방학, 국가근로장학금 신청기간 |
| 검색 수요 판단 | 8월 2학기 2차 신청, 9월 근로 시작, 방학 집중근로 시즌마다 반복 수요 |
| 핵심 메시지 | "시급보다 중요한 것은 실제 배정 시간이다. 교내·교외 시급과 주당 근로시간을 넣으면 월수령액과 학기 총액이 보인다." |
| 주요 대상 | 2학기 국가근로 신청 예정 대학생, 선발 결과 대기자, 교내/교외 근로지 비교자, 생활비 예산을 짜는 대학생 |
| 내부 연결 | 국가장학금 계산기, 학자금대출 계산기, 대학 등록금 계산기, 기숙사 vs 자취 vs 통학 비교 |
| 구현 우선순위 | 높음 |

---

## 2. 기획 의도

국가근로장학금은 8월 중순부터 9월 초까지 2학기 2차 신청 검색이 붙고, 9월 개강 이후에는 `국가근로 월급`, `국가근로 시급`, `국가근로 몇 시간` 같은 실수령형 키워드로 이어진다. 기존 사이트에는 국가장학금·학자금대출·대학 등록금 계산기가 있으므로, 이 계산기는 대학생 2학기 예산 클러스터를 완성하는 역할을 한다.

사용자가 실제로 궁금한 것은 "내가 받을 수 있나"보다 "선발되면 한 달에 얼마가 들어오나"에 가깝다. 따라서 MVP는 자격 판정기가 아니라 **근로 유형, 시급, 주당 시간, 근로 개월 수를 입력해 월수령액·학기 총액·생활비 충당률을 보여주는 계산기**로 만든다.

단, 국가근로는 대학별 선발 기준, 배정 예산, 희망근로지 신청, 학자금 지원구간 산정 여부가 모두 영향을 준다. 페이지 전반에 `선발 보장 아님`, `대학별 공지 확인`, `출근부 승인 기준`을 반복 안내해야 한다.

---

## 3. 공식 기준 요약

| 항목 | 2026년 2학기 기준 |
|---|---|
| 사업기간 | 2026. 9. 1. ~ 2027. 2. 28. |
| 1차 신청 | 2026. 5. 22. 9시 ~ 2026. 6. 22. 18시 |
| 1차 서류제출·가구원 동의 | 2026. 5. 22. 9시 ~ 2026. 6. 29. 18시 |
| 2차 신청 | 2026. 8. 12. 9시 ~ 2026. 9. 9. 18시 |
| 2차 서류제출·가구원 동의 | 2026. 8. 12. 9시 ~ 2026. 9. 16. 18시 |
| 신청 운영 주의 | 2차 학생 신청 운영 여부는 대학마다 다를 수 있음 |
| 선발 방식 | 기본요건 충족자 중 대학 자체 선발기준과 배정예산 범위에서 선발 |
| 우선순위 | 1순위 4구간 이하, 2순위 5~6구간, 3순위 7~9구간 |
| 중복참여 | 국가근로장학금·대학생 청소년교육지원·다문화탈북학생 멘토링 등 대학생 근로장학사업 중복참여 제한 |

> 구현 전 한국장학재단 국가근로장학금 페이지와 2026년 2학기 공지에서 위 일정을 재확인한다.

---

## 4. 계산기 범위

### 4-1. MVP 계산 목적

| 계산 항목 | 설명 |
|---|---|
| 월 예상 장학금 | 시급 × 주당 근로시간 × 월 환산 주수 |
| 학기 예상 장학금 | 월 예상 장학금 × 근로 개월 수 |
| 방학 포함 총액 | 학기 근로 + 방학 집중근로를 별도 개월 수로 더함 |
| 생활비 충당률 | 월 예상 장학금 ÷ 월 생활비 예산 |
| 교내 vs 교외 차이 | 시급 차이와 배정 시간 차이에 따른 총액 비교 |

### 4-2. MVP에서 하지 않을 것

- 학자금 지원구간을 자동 판정하지 않는다.
- 국가근로 선발 가능성을 확정 점수로 계산하지 않는다.
- 대학별 월 최대 근로시간을 공식값처럼 고정하지 않는다.
- 실제 지급일이나 출근부 승인 여부를 예측하지 않는다.

---

## 5. 입력값 설계

| 입력값 | 기본값 | 설명 |
|---|---:|---|
| 근로 유형 | 교내 | 교내 / 교외 / 직접입력 |
| 시급 | 확인 필요 | 구현 전 2026년 공식 단가 재확인. 사용자가 직접 수정 가능해야 함 |
| 주당 근로시간 | 10시간 | 실제 시간표와 근로지 배정 시간을 반영 |
| 월 환산 주수 | 4.345주 | 월 평균 계산용. 간단 모드는 4주 선택 가능 |
| 근로 개월 수 | 4개월 | 9~12월 학기 중 근로 기본 예시 |
| 방학 근로 개월 수 | 0개월 | 겨울방학 집중근로 포함 여부 |
| 방학 주당 근로시간 | 20시간 | 방학 집중근로 선택 시 사용 |
| 월 생활비 예산 | 600,000원 | 식비·교통·통신·교재 등 비교용 |
| 세금/공제 | 0원 | 장학금 성격이므로 기본 0, 단 학교별 지급 방식 안내 |

### 빠른 프리셋

| 프리셋 | 입력 조합 |
|---|---|
| 교내 주 8시간 | 교내, 주 8시간, 4개월 |
| 교내 주 12시간 | 교내, 주 12시간, 4개월 |
| 교외 주 10시간 | 교외, 주 10시간, 4개월 |
| 방학 집중근로형 | 교외, 학기 주 10시간 + 방학 주 20시간, 6개월 |
| 직접 입력 | 시급과 시간을 모두 직접 수정 |

---

## 6. 계산 로직

```ts
monthlyPay = hourlyWage * weeklyHours * monthlyWeeks;
semesterPay = monthlyPay * semesterMonths;

vacationMonthlyPay = hourlyWage * vacationWeeklyHours * monthlyWeeks;
vacationPay = vacationMonthlyPay * vacationMonths;

totalPay = semesterPay + vacationPay;
livingCoverageRate = monthlyLivingCost > 0 ? monthlyPay / monthlyLivingCost * 100 : 0;

campusTypeGap = offCampusHourlyWage - onCampusHourlyWage;
```

### 결과 카드

| 카드 | 표시값 |
|---|---|
| 월 예상 수령액 | 1개월 기준 근로장학금 |
| 학기 예상 총액 | 학기 중 근로 개월 수 기준 총액 |
| 방학 포함 총액 | 방학 집중근로 입력 시 합산 |
| 생활비 충당률 | 월 생활비 중 몇 %를 국가근로로 충당하는지 |

### 해석 문구 예시

```text
주 10시간 근로 기준 월 예상 장학금은 약 45만 원입니다.
월 생활비 예산 60만 원의 75%를 충당할 수 있지만, 실제 근로시간은 대학 선발과 근로지 배정에 따라 달라집니다.
```

---

## 7. 화면 구성

1. H1 / 핵심 설명
2. 2026년 2학기 신청 일정 안내
3. 빠른 프리셋
4. 계산기 입력
5. 월수령액 결과
6. 학기·방학 포함 총액
7. 교내 vs 교외 비교표
8. 신청 전 확인 체크리스트
9. FAQ
10. 공식 출처
11. 관련 계산기

### 결과 영역 디자인 방향

- 메인 카드는 `월 예상 수령액` 하나를 크게 보여준다.
- 보조 카드는 `학기 총액`, `방학 포함`, `생활비 충당률` 3개로 제한한다.
- 신청 일정은 결과 카드 안에 넣지 말고 상단 안내 박스로 분리한다.
- `선발 보장 아님` 경고는 붉은 경고가 아니라 중립적인 안내 배지로 처리한다.

---

## 8. SEO 전략

### 권장 SEO 타이틀

```text
국가근로장학금 월수령액 계산기 2026 | 교내·교외 시급과 근로시간 계산
```

### 메타 디스크립션

```text
2026년 국가근로장학금 교내·교외 시급과 주당 근로시간을 입력해 월 예상 수령액, 학기 총액, 방학 집중근로 포함 금액, 생활비 충당률을 계산합니다.
```

### H1

```text
국가근로장학금 월수령액 계산기 2026
```

### H2 구조

1. 국가근로장학금은 시급보다 배정 시간이 중요합니다
2. 2026년 2학기 신청 일정
3. 교내·교외 근로 월수령액 계산
4. 학기 중 근로와 방학 집중근로 총액 비교
5. 생활비 예산에서 얼마나 도움이 될까
6. 신청 전 확인해야 할 것
7. 자주 묻는 질문
8. 공식 기준과 주의사항

### 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 국가근로장학금 월급 | title, H1, 결과 카드 |
| 국가근로장학금 시급 | title, 입력 라벨, FAQ |
| 국가근로장학금 2학기 | 일정 안내, FAQ |
| 국가근로 교내 교외 | 프리셋, 비교표 |
| 국가근로장학금 근로시간 | 입력, 체크리스트 |
| 국가근로장학금 방학 | 방학 집중근로 섹션 |

---

## 9. FAQ 초안

### 국가근로장학금은 신청하면 바로 받을 수 있나요?

아닙니다. 신청 후 학자금 지원구간, 성적, 대학 자체 선발기준, 배정 예산, 근로지 수요에 따라 선발됩니다. 계산기는 선발 후 실제 근로시간을 채웠을 때의 예상 금액을 보여주는 도구입니다.

### 교내와 교외는 무엇이 다른가요?

일반적으로 교내는 학교 안 부서나 시설에서 근로하고, 교외는 외부 기관에서 근로합니다. 시급과 배정 시간, 업무 성격이 다를 수 있으므로 소속 대학 공지를 확인해야 합니다.

### 근로시간은 마음대로 정할 수 있나요?

아닙니다. 실제 근로시간은 시간표, 근로지 배정, 대학 운영 기준, 예산에 따라 정해집니다. 계산기에는 본인이 예상하는 주당 시간을 입력합니다.

### 방학 집중근로도 계산할 수 있나요?

가능합니다. 방학 근로 개월 수와 주당 근로시간을 별도 입력하면 학기 중 근로와 합산해 총액을 보여줍니다.

### 세금이 빠지나요?

국가근로장학금은 근로장학금 성격으로 지급되지만, 실제 지급 방식과 회계 처리는 학교 안내를 확인해야 합니다. MVP에서는 세금·공제 기본값을 0원으로 두고 직접 입력 옵션을 제공합니다.

---

## 10. 신청 전 체크리스트

- 한국장학재단 국가근로장학금 신청 완료 여부
- 서류제출 및 가구원 동의 완료 여부
- 소속 대학의 2차 신청 운영 여부
- 학자금 지원구간 산정 완료 여부
- 대학별 희망근로지 신청 기간
- 직전학기 성적 기준 충족 여부
- 시간표와 실제 근로 가능 시간
- 교내·교외 시급과 월 최대 근로시간
- 출근부 입력·승인 방식
- 중도 포기·부정근로 제한 사항

---

## 11. 관련 콘텐츠 연결

| 콘텐츠 | 연결 이유 |
|---|---|
| `/tools/national-scholarship-calculator-2026/` | 국가장학금과 국가근로를 함께 신청하는 검색 흐름 |
| `/tools/student-loan-repayment-calculator-2026/` | 부족한 등록금·생활비를 대출과 비교 |
| `/tools/university-cost-calculator-2026/` | 등록금·생활비 전체 예산 |
| `/tools/dorm-vs-commute-cost-comparison-2026/` | 거주 방식별 생활비 예산 |
| `/reports/2026-government-welfare-benefits/` | 복지·지원금 허브 연결 |

---

## 12. 구현 체크리스트

- [ ] `src/data/nationalWorkScholarshipPayCalculator2026.ts` 생성
- [ ] `/tools/national-work-scholarship-pay-calculator-2026/` 페이지 생성
- [ ] 클라이언트 스크립트 생성
- [ ] 교내/교외/직접입력 시급 프리셋
- [ ] 학기 중·방학 근로 분리 계산
- [ ] 생활비 충당률 결과 카드
- [ ] 신청 일정 안내 박스
- [ ] FAQ 및 SeoContent 구성
- [ ] `src/data/tools.ts` 등록
- [ ] 홈/도구 인덱스 topic mapping 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공 확인

---

## 13. 상세 설계

### 13-1. 사용자 문제 정의

| 사용자 상황 | 실제 질문 | 계산기가 해결해야 할 것 |
|---|---|---|
| 2학기 국가근로 신청 전 | "선발되면 한 달에 얼마나 받을까?" | 교내·교외 시급과 예상 근로시간으로 월수령액 산출 |
| 시간표를 짜는 중 | "주 몇 시간까지 하면 생활비가 될까?" | 주당 시간 변화에 따른 월수령액과 생활비 충당률 표시 |
| 교내·교외 근로지 고민 | "교외가 더 힘들어도 금액 차이가 클까?" | 동일 시간 기준 교내·교외 차액 비교 |
| 방학 집중근로 고민 | "방학까지 하면 총액이 얼마나 늘까?" | 학기 중 근로와 방학 근로를 분리 합산 |
| 부모님·본인 생활비 예산 조정 | "아르바이트 대신 국가근로로 충분할까?" | 월 생활비 예산 대비 부족액 또는 여유액 표시 |

핵심 설계 원칙은 `자격 판정`이 아니라 `선발 후 수령액 추정`이다. 사용자가 선발 가능성을 오해하지 않도록 페이지 첫 화면, 결과 영역, FAQ에 같은 메시지를 반복하되 과도한 경고색은 피한다.

### 13-2. 핵심 UX 흐름

1. 사용자는 상단에서 `교내`, `교외`, `직접입력` 중 하나를 고른다.
2. 시급은 프리셋으로 자동 채워지지만 직접 수정할 수 있다.
3. 학기 중 주당 근로시간과 근로 개월 수를 입력한다.
4. 방학 집중근로를 포함할지 선택한다.
5. 월 생활비 예산을 입력하면 충당률이 함께 나온다.
6. 결과는 `월 예상 수령액`을 가장 크게 보여주고, 학기 총액·방학 포함 총액·생활비 충당률을 보조 카드로 보여준다.
7. 결과 아래에서 `같은 시간 기준 교내/교외 차이`와 `근로시간별 표`를 제공한다.
8. 사용자는 URL 쿼리 파라미터로 입력값을 공유할 수 있다.

### 13-3. URL 파라미터 설계

| 파라미터 | 타입 | 예시 | 설명 |
|---|---|---:|---|
| `type` | string | `campus` | `campus`, `offcampus`, `custom` |
| `wage` | number | `10320` | 직접 입력 또는 프리셋 시급 |
| `weekly` | number | `10` | 학기 중 주당 근로시간 |
| `months` | number | `4` | 학기 중 근로 개월 수 |
| `mw` | number | `4.345` | 월 환산 주수 |
| `vac` | boolean | `1` | 방학 집중근로 포함 여부 |
| `vweekly` | number | `20` | 방학 주당 근로시간 |
| `vmonths` | number | `2` | 방학 근로 개월 수 |
| `living` | number | `600000` | 월 생활비 예산 |
| `deduct` | number | `0` | 세금·공제 등 직접 차감액 |

공유 URL은 사용자의 입력을 보존하되, 공식 시급이 바뀌었을 때 과거 URL이 잘못된 공식값처럼 보이지 않도록 결과 영역에 `입력 시급 기준` 문구를 표시한다.

### 13-4. 데이터 모델

```ts
type WorkScholarshipWorkType = 'campus' | 'offcampus' | 'custom';

interface WorkScholarshipPreset {
  id: string;
  label: string;
  description: string;
  workType: WorkScholarshipWorkType;
  weeklyHours: number;
  semesterMonths: number;
  includeVacation: boolean;
  vacationWeeklyHours: number;
  vacationMonths: number;
}

interface WorkScholarshipInput {
  workType: WorkScholarshipWorkType;
  hourlyWage: number;
  weeklyHours: number;
  monthlyWeeks: number;
  semesterMonths: number;
  includeVacation: boolean;
  vacationWeeklyHours: number;
  vacationMonths: number;
  monthlyLivingCost: number;
  deductionAmount: number;
}

interface WorkScholarshipResult {
  monthlyGrossPay: number;
  monthlyNetPay: number;
  semesterGrossPay: number;
  semesterNetPay: number;
  vacationGrossPay: number;
  vacationNetPay: number;
  totalGrossPay: number;
  totalNetPay: number;
  livingCoverageRate: number;
  monthlyShortageOrSurplus: number;
  campusMonthlyPay: number;
  offCampusMonthlyPay: number;
  typeGapMonthly: number;
  typeGapSemester: number;
  insight: string;
}
```

### 13-5. 상수 설계

| 상수 | 값 | 비고 |
|---|---:|---|
| `MONTHLY_WEEKS_AVERAGE` | `4.345` | 365일 ÷ 12개월 ÷ 7일 |
| `MONTHLY_WEEKS_SIMPLE` | `4` | 간편 계산 옵션 |
| `DEFAULT_WEEKLY_HOURS` | `10` | 학기 중 예시 |
| `DEFAULT_SEMESTER_MONTHS` | `4` | 9~12월 |
| `DEFAULT_VACATION_MONTHS` | `0` | 기본은 미포함 |
| `MIN_HOURLY_WAGE` | `0` | 입력 검증 |
| `MAX_HOURLY_WAGE` | `50000` | 오입력 방지 |
| `MAX_WEEKLY_HOURS` | `40` | 계산기 표시 상한. 대학별 실제 기준은 별도 확인 |
| `MAX_MONTHS` | `6` | 2학기 사업기간 기준 UX 상한 |

시급 상수는 구현 전 공식 공지를 재확인해 별도 객체로 관리한다.

```ts
const WORK_SCHOLARSHIP_WAGES_2026 = {
  campus: {
    label: '교내',
    hourlyWage: 0,
    needsOfficialConfirm: true,
  },
  offcampus: {
    label: '교외',
    hourlyWage: 0,
    needsOfficialConfirm: true,
  },
};
```

공식 시급이 최종 확인되기 전에는 `0` 또는 `직접입력 필요` 상태로 두고, 구현 시점에 공식 출처를 확인해 채운다.

### 13-6. 계산 함수 상세

```ts
function calcMonthlyPay(hourlyWage: number, weeklyHours: number, monthlyWeeks: number) {
  return hourlyWage * weeklyHours * monthlyWeeks;
}

function calcNetPay(grossPay: number, deductionAmount: number) {
  return Math.max(0, grossPay - deductionAmount);
}

function calcCoverage(monthlyNetPay: number, monthlyLivingCost: number) {
  if (monthlyLivingCost <= 0) return 0;
  return monthlyNetPay / monthlyLivingCost * 100;
}

function buildResult(input: WorkScholarshipInput): WorkScholarshipResult {
  const monthlyGrossPay = calcMonthlyPay(input.hourlyWage, input.weeklyHours, input.monthlyWeeks);
  const monthlyNetPay = calcNetPay(monthlyGrossPay, input.deductionAmount);
  const semesterGrossPay = monthlyGrossPay * input.semesterMonths;
  const semesterNetPay = monthlyNetPay * input.semesterMonths;

  const vacationGrossPay = input.includeVacation
    ? calcMonthlyPay(input.hourlyWage, input.vacationWeeklyHours, input.monthlyWeeks) * input.vacationMonths
    : 0;
  const vacationNetPay = input.includeVacation
    ? calcNetPay(vacationGrossPay, input.deductionAmount * input.vacationMonths)
    : 0;

  const totalGrossPay = semesterGrossPay + vacationGrossPay;
  const totalNetPay = semesterNetPay + vacationNetPay;
  const livingCoverageRate = calcCoverage(monthlyNetPay, input.monthlyLivingCost);
  const monthlyShortageOrSurplus = monthlyNetPay - input.monthlyLivingCost;

  return {
    monthlyGrossPay,
    monthlyNetPay,
    semesterGrossPay,
    semesterNetPay,
    vacationGrossPay,
    vacationNetPay,
    totalGrossPay,
    totalNetPay,
    livingCoverageRate,
    monthlyShortageOrSurplus,
    campusMonthlyPay: 0,
    offCampusMonthlyPay: 0,
    typeGapMonthly: 0,
    typeGapSemester: 0,
    insight: '',
  };
}
```

### 13-7. 입력 검증 규칙

| 입력값 | 허용 범위 | 오류 처리 |
|---|---:|---|
| 시급 | 0~50,000원 | 0이면 결과 대신 `시급을 입력해 주세요` 표시 |
| 주당 근로시간 | 0~40시간 | 40시간 초과 입력 시 40으로 보정하지 말고 경고 표시 |
| 근로 개월 수 | 0~6개월 | 0이면 월수령액만 표시하고 학기 총액은 0원 |
| 방학 주당 근로시간 | 0~40시간 | 방학 포함 토글이 꺼져 있으면 계산 제외 |
| 방학 근로 개월 수 | 0~3개월 | 2학기 사업기간 안에서 보수적으로 제한 |
| 월 생활비 예산 | 0~5,000,000원 | 0이면 충당률 대신 `생활비 예산 미입력` 표시 |
| 공제액 | 0~월 예상액 | 월 예상액보다 크면 순수령액 0원 처리 |

검증 메시지는 입력 필드 바로 아래에 짧게 표시한다. 결과 영역에는 `입력값을 확인해 주세요` 정도만 노출한다.

### 13-8. 상태별 화면

| 상태 | 조건 | 화면 |
|---|---|---|
| 기본 상태 | 최초 진입 | 교내 또는 공식 확인 전 직접입력 모드, 주 10시간, 4개월 |
| 공식 시급 미확정 | 시급 상수가 0 | 시급 입력 강조, 공식 확인 필요 안내 |
| 계산 가능 | 시급 > 0, 주당 시간 > 0 | 결과 카드 활성화 |
| 생활비 미입력 | 생활비 0 | 충당률 카드 비활성 설명 |
| 방학 미포함 | 방학 토글 꺼짐 | 방학 총액 카드에 `미포함` 표시 |
| 과도 입력 | 주 40시간 초과 등 | 입력 오류 메시지와 결과 업데이트 중단 |

### 13-9. 결과 인사이트 규칙

| 조건 | 문구 방향 |
|---|---|
| 충당률 100% 이상 | 국가근로 예상액만으로 월 생활비 예산을 대부분 충당할 수 있다는 표현 |
| 충당률 70~99% | 식비·교통비 등 주요 생활비 상당 부분을 메울 수 있다는 표현 |
| 충당률 40~69% | 생활비 일부 보전, 추가 예산 필요 표현 |
| 충당률 40% 미만 | 등록금·주거비까지 포함하기에는 부족할 수 있다는 표현 |
| 월 순수령액 0원 | 시급과 근로시간 입력 필요 |
| 방학 총액이 학기 총액보다 큼 | 방학 시간 입력이 큰 편이므로 실제 배정 가능 여부 확인 안내 |

### 13-10. 접근성 설계

- 금액 결과는 `aria-live="polite"` 영역에 배치한다.
- 프리셋 버튼은 실제 버튼 요소를 사용하고 선택 상태는 `aria-pressed`로 표시한다.
- 슬라이더를 사용하더라도 숫자 입력창을 반드시 함께 제공한다.
- 단위는 placeholder가 아니라 라벨 또는 보조 텍스트로 제공한다.
- 색상만으로 교내·교외를 구분하지 않고 텍스트 라벨을 함께 표시한다.
- 결과 카드의 큰 숫자는 모바일에서 줄바꿈이 가능하도록 `overflow-wrap`을 허용한다.

### 13-11. 컴포넌트 구조 제안

| 영역 | 컴포넌트/마크업 역할 |
|---|---|
| Hero | H1, 요약 문장, 공식 일정 배지 |
| Notice | 선발 보장 아님, 대학별 운영 확인 안내 |
| PresetBar | 교내 주 8시간, 교외 주 10시간, 방학형 등 빠른 선택 |
| CalculatorForm | 입력 폼 전체 |
| WorkTypeSelector | 교내·교외·직접입력 선택 |
| SemesterInputs | 시급, 주당 시간, 개월 수 |
| VacationInputs | 방학 포함 토글과 방학 시간 |
| BudgetInputs | 월 생활비, 공제액 |
| ResultSummary | 월 예상 수령액 메인 카드 |
| ResultBreakdown | 학기·방학·총액 상세 |
| ComparisonTable | 교내·교외 비교 |
| ScenarioTable | 주 5/10/15/20시간 빠른 표 |
| Checklist | 신청 전 체크리스트 |
| FAQ | 자주 묻는 질문 |
| Sources | 공식 출처 |

### 13-12. 파일 구조 제안

```text
src/data/nationalWorkScholarshipPayCalculator2026.ts
src/pages/tools/national-work-scholarship-pay-calculator-2026.astro
public/scripts/national-work-scholarship-pay-calculator-2026.js
src/styles/scss/pages/_national-work-scholarship-pay-calculator-2026.scss
```

기존 8월 계산기 공통 스타일을 재사용할 수 있으면 `_august-2026-calculators.scss`에 통합한다. 다만 국가근로 전용 표와 일정 배지가 많아지면 전용 SCSS 파일을 분리하는 편이 유지보수에 낫다.

### 13-13. 데이터 파일 내보내기 항목

```ts
export const NATIONAL_WORK_SCHOLARSHIP_META = {};
export const NATIONAL_WORK_SCHOLARSHIP_SCHEDULE = [];
export const NATIONAL_WORK_SCHOLARSHIP_WAGES = {};
export const NATIONAL_WORK_SCHOLARSHIP_PRESETS = [];
export const NATIONAL_WORK_SCHOLARSHIP_FAQ = [];
export const NATIONAL_WORK_SCHOLARSHIP_CHECKLIST = [];
export const NATIONAL_WORK_SCHOLARSHIP_RELATED_TOOLS = [];
export function calculateNationalWorkScholarship(input) {}
```

서버 렌더링 시 기본 결과를 계산해 초기 HTML에 넣고, 클라이언트 스크립트가 같은 계산 로직을 재현한다. 중복 로직이 부담되면 데이터 파일의 순수 계산식을 JS로 복제하되 테스트 케이스를 문서 기준으로 맞춘다.

### 13-14. 예시 시나리오

| 시나리오 | 입력 | 기대 결과 방향 |
|---|---|---|
| 교내 기본형 | 교내, 주 10시간, 4개월, 생활비 60만 원 | 월수령액과 생활비 충당률 표시 |
| 교외 비교형 | 교외, 주 10시간, 4개월 | 교내 동일 시간 대비 차액 강조 |
| 방학 집중형 | 학기 주 10시간, 방학 주 20시간, 방학 2개월 | 방학 포함 총액이 크게 증가 |
| 생활비 부족형 | 월 생활비 100만 원 | 부족액 표시 |
| 시급 미입력 | 직접입력, 시급 0 | 결과 대신 시급 입력 안내 |

### 13-15. QA 체크리스트

- [ ] 시급 0원일 때 계산 결과가 오해되지 않는다.
- [ ] 주당 시간 0시간일 때 월수령액 0원과 입력 안내가 함께 보인다.
- [ ] 방학 토글을 껐을 때 방학 입력값이 결과에 반영되지 않는다.
- [ ] 월 생활비가 0원일 때 충당률이 NaN 또는 Infinity로 나오지 않는다.
- [ ] 숫자 입력에 쉼표가 있어도 정상 파싱된다.
- [ ] URL 파라미터 입력 후 새로고침해도 같은 결과가 나온다.
- [ ] 모바일 360px 폭에서 결과 금액이 카드 밖으로 넘치지 않는다.
- [ ] `npm run build`가 통과한다.
- [ ] 공식 시급·일정 출처가 페이지 하단에 표시된다.
- [ ] `선발 보장 아님` 문구가 첫 화면과 결과 하단에 모두 있다.

### 13-16. 출시 전 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| 2026년 시급 단가 오기재 | 금액 계산 신뢰도 하락 | 구현 직전 공식 재확인, 출처와 확인일 표기 |
| 대학별 근로시간 상한 차이 | 사용자가 실제보다 크게 예상 | `대학별 기준 확인` 안내와 직접 입력 방식 |
| 선발 가능성 오해 | 정책형 콘텐츠 신뢰도 하락 | 자격 판정기가 아님을 반복 안내 |
| 지급일·출근부 승인 관련 문의 | 계산기 범위 초과 | FAQ에서 학교별 확인으로 안내 |
| 방학 집중근로 운영 차이 | 총액 과대 예상 | 방학 결과에 `선발·배정 시` 문구 표시 |

### 13-17. 출시 후 개선 아이디어

- 학교별 공지 링크를 사용자가 직접 저장하는 메모 필드
- 교내·교외·방학 근로를 나란히 비교하는 3열 시나리오 비교
- 국가장학금·생활비대출·국가근로를 합산한 `2학기 생활비 커버율` 계산
- 방학 집중근로만 별도 계산하는 짧은 랜딩 섹션
- 신청기간 D-day 자동 표시

---

## 14. 공식 확인 출처

- 한국장학재단 국가근로장학금: https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_04_01&ttab1=1

구현 전 추가 확인:

- 2026년 국가근로장학금 시급 단가 공식 공지
- 소속 대학별 월 최대 근로시간과 희망근로지 신청 일정
- 국가근로장학금 2026년 2학기 2차 신청 운영 대학 목록
