# 대학생 등록금·생활비 콘텐츠 클러스터 2026 — 설계 문서 (3차: 2페이지, 최종)

> 기획 원본: [`docs/plan/202607/university-student-content-cluster-2026-plan.md`](../../plan/202607/university-student-content-cluster-2026-plan.md)
> 1차: [`university-student-content-cluster-2026-design.md`](./university-student-content-cluster-2026-design.md) (배포됨)
> 2차: [`university-student-content-cluster-2026-design-phase2.md`](./university-student-content-cluster-2026-design-phase2.md) (배포됨)
> 작성일: 2026-07-15
> 범위: 3차(마지막) 2개 — `student-loan-repayment-calculator-2026`(`/tools/`), `university-student-welfare-benefits-2026`(`/reports/`)

이 문서를 끝으로 7페이지 클러스터(1차 2개 + 2차 3개 + 3차 2개) 기획·설계가 완료된다.

---

## 0. 공통 설계 원칙

### 0-1. 착수 전 필수 웹검색 확인 완료 (2026-07-15)

기획 문서 3차 항목에 "착수 전 웹검색 재확인 필요"로 남겨뒀던 두 가지를 이번 설계 단계에서 확인했다.

**학자금대출(ICL) 2026 조건 — 국가법령정보센터·언론 교차 확인**

| 항목 | 확인값 |
|---|---|
| 2026년 학자금대출 금리 | 연 1.7% (6년 연속 동결, 변동금리로 매 학기 교육부 발표) |
| 거치기간 + 상환기간 합계 | 최장 20년 (거치 최대 10년 + 상환 최대 10년, 학점은행제는 거치 최대 8년) |
| 2026년 상환기준소득 | 연 3,037만 원 |
| 의무상환율 | 학부 20%, 대학원 25% (초과분 기준) |
| 2026년 제도 변화 | 취업 후 상환 등록금대출의 소득요건 제한 폐지 → 모든 대학생·대학원생 대상 확대 |

출처: [토스뱅크 - 2026 학자금대출 총정리](https://www.tossbank.com/articles/student-loan), [학자금 상환기준소득 3,037만원](https://scholar-debtfree.xyz/guide/threshold-income), [국가법령정보센터 - 2026학년도 1학기 취업 후 상환 학자금대출 자격요건 고시](https://www.law.go.kr/LSW/admRulLsInfoP.do?paras=1&docType=JO&languageType=KO&admRulNm=2026%ED%95%99%EB%85%84%EB%8F%84+1%ED%95%99%EA%B8%B0+%EC%B7%A8%EC%97%85+%ED%9B%84+%EC%83%81%ED%99%98+%ED%95%99%EC%9E%90%EA%B8%88%EB%8C%80%EC%B6%9C%EC%9D%98+%EC%9E%90%EA%B2%A9+%EC%9A%94%EA%B1%B4+%EB%93%B1%EC%97%90+%EA%B4%80%ED%95%9C+%EA%B3%A0%EC%8B%9C&joNo=000200000)

**대학생 지원제도(주거·취업준비) 2026 조건**

| 제도 | 확인값 |
|---|---|
| 청년월세지원 | 무주택 청년(만 19~34세) 월 최대 20만 원, 최대 24개월. 2026년부터 상시 신청제로 전환 |
| 행복주택 | 대학생·청년·신혼부부 대상. 소득기준 3인가구 기준중위소득 100%(약 816만 원) 이하, 1인가구 +20%p·2인가구 +10%p 가산 |
| 청년전세임대(LH) | 대학생·취업준비생(19~39세) 대상. 월평균소득 100% 이하 + 자산기준(2025년 기준 총자산 2억 5,400만 원·자동차 4,563만 원 이하 — ⚠️ 2026년 갱신치 미확인, 페이지에는 "매년 갱신" 명시) |
| 국민취업지원제도 I유형 | 구직촉진수당 월 60만 원(2026년 인상, 종전 50만 원)×최대 6개월(총 360만 원), 부양가족 1인당 월 10만 원 추가(최대 월 40만 원). 기준중위소득 120% 이하·재산 5억 원 이하 |
| 국민취업지원제도 II유형 | 취업활동비용 기본 15만 원 + 프로그램별 3~10만 원 추가(최대 25만 원) |
| 취업성공수당(공통) | 최대 150만 원 (6개월 근속 50만 원 + 12개월 근속 100만 원) |

출처: [토스뱅크 - 2026 청년월세지원](https://www.tossbank.com/articles/youth-monthly-rent), [LH청약플러스 - 행복주택 입주자격](https://apply.lh.or.kr/lhapply/cm/cntnts/cntntsView.do?cntntsId=1201391&mi=1201663), [한국토지주택공사 - 청년 전세임대주택](https://www.lh.or.kr/menu.es?mid=a10401020400), [2026 국민취업지원제도 총정리](https://www.welfarehello.com/community/policyInfo/2026%EB%85%84-%EA%B5%AD%EB%AF%BC%EC%B7%A8%EC%97%85%EC%A7%80%EC%9B%90%EC%A0%9C%EB%8F%84-1%EC%9C%A0%ED%98%952%EC%9C%A0%ED%98%95-%EC%A7%80%EC%9B%90%EA%B8%88%EC%95%A1-%EC%8B%A0%EC%B2%AD%EB%B0%A9%EB%B2%95-%EC%B4%9D%EC%A0%95%EB%A6%AC--8924e9ab-21fd-4ef2-80e1-d08bd29a7951)

### 0-2. 페이지 유형 및 재사용

- `student-loan-repayment-calculator-2026`은 계산기(`/tools/`, `SimpleToolShell`) — 1차 `university-cost-calculator-2026`, `national-scholarship-calculator-2026`와 동일한 파일 구조·컴포넌트 패턴을 그대로 따른다.
- `university-student-welfare-benefits-2026`은 리포트(`/reports/`) — 2차 `university-tuition-ranking-2026`과 동일하게 `senior-job-comparison-2026.astro` 패턴(`op-page`/`op-section`, 정적 렌더)을 따른다.
- 두 페이지 모두 신규 데이터라 1차·2차처럼 재사용할 기존 데이터 파일은 없다. 다만 `student-loan-repayment-calculator-2026`의 계산 결과(연 의무상환액)는 향후 `university-cost-calculator-2026`의 "졸업 후 예상 학자금대출" 확장에 재사용할 수 있도록 순수 함수로 분리해둔다.

---

## 1. 페이지 6 — `student-loan-repayment-calculator-2026` (3차, `/tools/`)

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/studentLoanRepaymentCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/student-loan-repayment-calculator-2026.astro` |
| 스크립트 | `public/scripts/student-loan-repayment-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_student-loan-repayment-calculator-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /tools/student-loan-repayment-calculator-2026/
타이틀: 학자금대출 계산기 2026 | 졸업 후 월 상환액 바로 계산
디스크립션: 대출 원금·거치기간·졸업 후 예상 연봉을 입력하면 취업 후 상환 학자금대출의 소득연계 의무상환액과 균등분할 참고액을 함께 계산합니다.
```

### 1-3. 계산 모델 설계 (핵심 — 실제 제도와 참고 비교치를 분리)

취업 후 상환 학자금대출(ICL)은 일반 대출과 달리 **소득이 상환기준소득을 넘을 때만, 초과분의 일정 비율을 원천공제**하는 방식이다. 이 계산기는 이 실제 제도 방식과 "만약 매달 똑같이 갚는다면"이라는 균등분할 참고치를 **분리해서 나란히 제시**한다 — 하나로 뭉뚱그리면 실제 제도를 오해하게 만들 수 있기 때문이다.

```ts
export type CourseType = "UNDERGRAD" | "GRAD";

// 2026년 확정값 — 0-1 표 참고
export const LOAN_INTEREST_RATE_2026 = 1.7; // 연 %
export const REPAYMENT_THRESHOLD_INCOME_2026 = 30_370_000; // 연 상환기준소득
export const REPAYMENT_RATE: Record<CourseType, number> = { UNDERGRAD: 0.2, GRAD: 0.25 };
export const MAX_GRACE_PLUS_REPAY_YEARS = 20;

export interface LoanInput {
  principal: number; // 등록금대출+생활비대출 합산
  interestRate: number; // 기본 1.7, 수정 가능
  graceYears: number; // 거치기간(0~10)
  repayYears: number; // 상환기간(1~10) — 균등분할 참고치 계산에만 사용
  expectedAnnualIncome: number; // 졸업 후 예상 연소득
  courseType: CourseType;
}

export interface LoanResult {
  graceInterest: number;
  balanceAfterGrace: number;
  annualMandatoryRepay: number; // 소득연계 의무상환액(연)
  monthlyMandatoryRepay: number;
  mandatoryPayoffYears: number | null; // 단순 잔액÷연 의무상환액 (참고용 근사치)
  monthlyEqualPayment: number; // 균등분할 참고치(월)
  totalEqualPaid: number;
  totalEqualInterest: number;
}

// public/scripts/student-loan-repayment-calculator-2026.js와 1:1 대응
export function calcLoanRepayment(input: LoanInput): LoanResult {
  const graceInterest = input.principal * (input.interestRate / 100) * input.graceYears;
  const balanceAfterGrace = input.principal + graceInterest;

  const rate = REPAYMENT_RATE[input.courseType];
  const annualMandatoryRepay = Math.max((input.expectedAnnualIncome - REPAYMENT_THRESHOLD_INCOME_2026) * rate, 0);
  const monthlyMandatoryRepay = annualMandatoryRepay / 12;
  const mandatoryPayoffYears = annualMandatoryRepay > 0 ? balanceAfterGrace / annualMandatoryRepay : null;

  const monthlyRate = input.interestRate / 100 / 12;
  const n = input.repayYears * 12;
  const monthlyEqualPayment =
    monthlyRate > 0
      ? (balanceAfterGrace * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : balanceAfterGrace / n;
  const totalEqualPaid = monthlyEqualPayment * n;
  const totalEqualInterest = totalEqualPaid - balanceAfterGrace;

  return {
    graceInterest,
    balanceAfterGrace,
    annualMandatoryRepay,
    monthlyMandatoryRepay,
    mandatoryPayoffYears,
    monthlyEqualPayment,
    totalEqualPaid,
    totalEqualInterest,
  };
}
```

**필수 InfoNotice 문구**: "실제 취업 후 상환 학자금대출은 연소득이 상환기준소득(2026년 3,037만 원)을 초과할 때만 초과분의 20%(대학원 25%)를 원천공제하는 소득연계 방식입니다. '균등분할 상환 참고치'는 일반 대출처럼 매달 동일 금액을 갚는다고 가정한 비교값이며 실제 제도 방식이 아닙니다. 거치기간 중 이자 처리 방식은 정책에 따라 달라질 수 있어 이 계산은 단순화된 모델입니다."

### 1-4. 입력값

| 입력 | 설명 |
|---|---|
| 대출 원금 | 등록금대출+생활비대출 합산, 자유 입력(슬라이더) |
| 대출 금리 | 기본 1.7%(2026 확정), 수정 가능 |
| 거치기간 | 0~10년 (mode-chip 프리셋 0/2/4/6년 + 자유 입력) |
| 상환기간 | 1~10년 (균등분할 참고치 계산용) |
| 졸업 후 예상 연소득 | 자유 입력(슬라이더) |
| 과정 | 학부(20%)/대학원(25%) mode-chip |

### 1-5. 페이지 IA

```
Hero + InfoNotice (1-3의 필수 문구)
ToolActionBar

[aside] 입력 폼 (1-4)

[본문] 결과 섹션 1 — 소득연계 의무상환액(실제 제도)
  KPI: 거치기간 이자 / 거치 후 대출잔액 / 연 의무상환액 / 월 의무상환액
  단순 근사 완제 예상 기간(연 의무상환액 기준, "참고" 라벨)
[본문] 결과 섹션 2 — 균등분할 상환 참고치(일반 대출처럼 가정)
  KPI: 월 상환액 / 총 상환액 / 총 이자
  "이건 실제 제도가 아니라 비교용 참고치입니다" 캡션 강조
[본문] 관련 CTA → 대학 등록금 계산기, 국가장학금 계산기, 대학생 지원금 총정리

SeoContent (intro 4단락/faq 8개/related 3개)
```

### 1-6. FAQ (8개)

1. 2026년 학자금대출 금리는 얼마인가요? → 연 1.7%로 6년 연속 동결됐습니다. 변동금리라 매 학기 교육부 발표에 따라 달라질 수 있습니다.
2. 상환기준소득이 뭔가요? → 2026년 기준 연 3,037만 원입니다. 연소득이 이 금액을 넘으면 초과분의 20%(대학원 25%)를 원천공제합니다.
3. 거치기간과 상환기간은 최대 몇 년인가요? → 합쳐서 최장 20년(거치 최대 10년+상환 최대 10년)이며, 학점은행제 학습자는 거치기간이 최대 8년입니다.
4. 2026년부터 달라진 점이 있나요? → 취업 후 상환 등록금대출의 소득요건 제한이 폐지돼 모든 대학생·대학원생이 대상이 됐습니다.
5. 소득이 상환기준소득보다 낮으면 안 갚아도 되나요? → 네, 초과분이 없으면 의무상환액은 0원이며 소득이 생길 때까지 상환이 유예됩니다.
6. 균등분할 상환과 실제 제도가 다른가요? → 네, 실제 제도는 소득연계 방식이고 균등분할은 비교를 위한 참고치입니다.
7. 조기(자발적) 상환하면 유리한가요? → 자발적 상환이 가능하며 원금을 미리 줄이면 총 이자 부담이 줄어듭니다.
8. 대학원생은 상환율이 다른가요? → 네, 대학원은 25%, 학부는 20%가 적용됩니다.

---

## 2. 페이지 7 — `university-student-welfare-benefits-2026` (3차, `/reports/`, 클러스터 최종 페이지)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/universityStudentWelfareBenefits2026.ts` |
| 리포트 등록 | `src/data/reports.ts`, `reports/index.astro`의 `reportMetaBySlug` |
| 페이지 | `src/pages/reports/university-student-welfare-benefits-2026.astro` |
| 스타일 | `src/styles/scss/pages/_university-student-welfare-benefits-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /reports/university-student-welfare-benefits-2026/
타이틀: 대학생 지원금 총정리 2026 | 등록금·주거·취업 뭐 받을 수 있나
디스크립션: 등록금·주거·취업준비 카테고리별로 대학생이 받을 수 있는 2026년 지원제도를 대상·지원금액·신청 조건까지 한 번에 정리합니다.
```

### 2-3. 데이터 파일 설계

```ts
export type BenefitCategory = "TUITION" | "HOUSING" | "JOB_PREP";

export interface WelfareBenefit {
  category: BenefitCategory;
  name: string;
  target: string;
  amount: string;
  note: string;
  relatedHref?: string; // 클러스터 내 계산기로 연결 가능하면
}

export const WSB_BENEFITS: WelfareBenefit[] = [
  {
    category: "TUITION", name: "국가장학금 I유형",
    target: "학자금 지원 1~9구간, 성적 기준 충족자",
    amount: "연 100만~600만원(구간별), 다자녀·기초수급자 등록금 전액까지",
    note: "이 클러스터의 국가장학금 계산기에서 예상 구간·금액을 바로 계산할 수 있습니다.",
    relatedHref: "/tools/national-scholarship-calculator-2026/",
  },
  {
    category: "TUITION", name: "취업 후 상환 학자금대출(ICL)",
    target: "2026년부터 소득요건 제한 폐지, 전체 대학생·대학원생",
    amount: "금리 연 1.7%, 상환기준소득(3,037만원) 초과분의 20%(대학원 25%) 원천공제",
    note: "이 클러스터의 학자금대출 계산기에서 예상 월 상환액을 계산할 수 있습니다.",
    relatedHref: "/tools/student-loan-repayment-calculator-2026/",
  },
  {
    category: "HOUSING", name: "청년월세지원",
    target: "무주택 청년 만 19~34세, 소득·재산 기준 충족",
    amount: "월 최대 20만원 × 최대 24개월",
    note: "2026년부터 상시 신청제로 전환 — 연중 아무 때나 신청 가능",
  },
  {
    category: "HOUSING", name: "행복주택",
    target: "대학생·청년·신혼부부",
    amount: "소득기준 3인가구 기준중위소득 100%(약 816만원) 이하 — 1인가구 +20%p·2인가구 +10%p 가산",
    note: "학교·직장 인접 또는 대중교통 편리한 위치에 공급",
  },
  {
    category: "HOUSING", name: "청년전세임대(LH)",
    target: "대학생·취업준비생(19~39세)",
    amount: "월평균소득 100% 이하 + 자산기준(2025년 기준 총자산 2억5,400만원·자동차 4,563만원 이하)",
    note: "자산기준은 매년 갱신되므로 신청 시점에 LH청약플러스에서 최신 기준 확인 필요",
  },
  {
    category: "JOB_PREP", name: "국민취업지원제도 I유형",
    target: "기준중위소득 120% 이하, 재산 5억원 이하",
    amount: "구직촉진수당 월 60만원(2026년 인상) × 최대 6개월(총 360만원), 부양가족 1인당 월 10만원 추가(최대 월 40만원)",
    note: "취업 경험이 없어도 신청 가능",
  },
  {
    category: "JOB_PREP", name: "국민취업지원제도 II유형",
    target: "I유형 미해당자 등",
    amount: "취업활동비용 기본 15만원 + 프로그램별 3~10만원 추가(최대 25만원)",
    note: "",
  },
  {
    category: "JOB_PREP", name: "취업성공수당",
    target: "국민취업지원제도 참여 후 취업 성공자",
    amount: "최대 150만원(6개월 근속 50만원 + 12개월 근속 100만원)",
    note: "국민취업지원제도 I·II유형 공통",
  },
];

export const WSB_CATEGORY_LABELS: Record<BenefitCategory, string> = {
  TUITION: "등록금",
  HOUSING: "주거",
  JOB_PREP: "취업준비",
};

export const WSB_META = {
  slug: "university-student-welfare-benefits-2026",
  title: "대학생 지원금 총정리 2026",
  seoTitle: "대학생 지원금 총정리 2026 | 등록금·주거·취업 뭐 받을 수 있나",
  seoDescription:
    "등록금·주거·취업준비 카테고리별로 대학생이 받을 수 있는 2026년 지원제도를 대상·지원금액·신청 조건까지 한 번에 정리합니다.",
  description: "등록금·주거·취업준비 카테고리별 2026년 대학생 지원제도를 정리하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "지원금액·소득기준은 2026년 확인 시점 기준이며 제도 특성상 매년 갱신됩니다. 정확한 최신 조건과 신청 방법은 각 제도의 공식 사이트(한국장학재단, LH청약플러스, 고용24 등)에서 확인해야 합니다.",
};

export interface FaqItem { question: string; answer: string; }

export const WSB_FAQ: FaqItem[] = [
  { question: "대학생이 등록금 외에 받을 수 있는 지원은 뭐가 있나요?", answer: "등록금 지원(국가장학금, 학자금대출)뿐 아니라 주거 지원(청년월세지원, 행복주택, 청년전세임대), 취업준비 지원(국민취업지원제도)까지 카테고리별로 받을 수 있는 제도가 다양합니다." },
  { question: "청년월세지원과 행복주택 중 뭐가 더 빠른가요?", answer: "청년월세지원은 2026년부터 상시 신청제라 신청 즉시 심사가 진행되지만, 행복주택은 공급 물량과 경쟁률에 따라 입주까지 시간이 걸릴 수 있습니다." },
  { question: "국민취업지원제도는 재학생도 신청할 수 있나요?", answer: "국민취업지원제도는 원칙적으로 구직자를 대상으로 하므로 졸업(예정)자나 졸업유예 상태에서 신청하는 경우가 많습니다. 정확한 대상 요건은 고용24에서 확인해야 합니다." },
  { question: "여러 제도를 동시에 받을 수 있나요?", answer: "등록금(국가장학금)과 주거 지원(청년월세지원 등), 취업준비 지원(국민취업지원제도)은 목적이 달라 동시에 받는 경우가 많습니다. 다만 중복 지원이 제한되는 조합도 있어 각 제도 공고를 확인해야 합니다." },
  { question: "청년전세임대 자산기준은 왜 2025년 기준으로 나오나요?", answer: "2026년 갱신치가 이 리포트 작성 시점에 확인되지 않아 최신 확인된 2025년 기준을 표기했습니다. 신청 전 LH청약플러스에서 최신 기준을 반드시 확인하세요." },
  { question: "학자금대출과 국가장학금을 같이 받을 수 있나요?", answer: "네, 국가장학금으로 등록금 일부를 지원받고 나머지를 학자금대출로 충당하는 방식이 일반적입니다." },
];

export const WSB_RELATED_LINKS = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
  { href: "/tools/student-loan-repayment-calculator-2026/", label: "학자금대출 계산기 2026", description: "졸업 후 예상 월 상환액을 계산합니다." },
];
```

### 2-4. 페이지 IA (`senior-job-comparison-2026.astro` / `university-tuition-ranking-2026.astro` 패턴)

```
Hero + InfoNotice (dataNote — 매년 갱신 안내)
섹션 1 — 카테고리별 필터 탭(등록금/주거/취업준비/전체, 순수 CSS 또는 없이 카테고리 헤딩으로 구분해도 무방 — 정적 페이지 원칙상 클라이언트 필터는 생략하고 3개 섹션으로 순서대로 나열)
섹션 2 — 등록금 지원 카드 2개(WSB_BENEFITS category TUITION) — relatedHref 있으면 카드 자체가 계산기로 연결되는 CTA 겸함
섹션 3 — 주거 지원 카드 3개(HOUSING)
섹션 4 — 취업준비 지원 카드 3개(JOB_PREP)
섹션 5 — 관련 CTA 그리드 (WSB_RELATED_LINKS)
SeoContent (intro 4단락/faq 6개/related 3개)
```

### 2-5. SeoContent intro 초안 (4단락)

1. **맥락**: 대학생이 받을 수 있는 지원제도는 등록금·주거·취업준비로 나뉘어 있지만 각각 다른 기관(한국장학재단, LH, 고용노동부)이 운영해 한눈에 파악하기 어렵습니다. 이 리포트는 2026년 기준 대표 제도 8가지를 카테고리별로 정리해 "나는 뭘 받을 수 있는지" 빠르게 확인할 수 있게 합니다.
2. **메커니즘**: 등록금은 국가장학금(소득분위별 최대 연 600만 원)과 학자금대출(2026년 금리 1.7%, 소득요건 제한 폐지)로 나뉘고, 주거는 청년월세지원(월 최대 20만 원, 2026년 상시 신청제)·행복주택·청년전세임대로, 취업준비는 국민취업지원제도(구직촉진수당 월 60만 원 등)로 구성됩니다.
3. **해석 가이드**: 여러 제도를 동시에 받는 경우가 많지만 목적과 신청 시점이 다르므로, 등록금은 학기 시작 전, 주거는 입주 계획 시점, 취업준비는 졸업 전후로 각각 신청 타이밍을 따로 챙겨야 합니다.
4. **한계**: 이 리포트의 지원금액·소득기준은 2026년 확인 시점 기준이며 매년 갱신됩니다. 정확한 최신 조건과 신청 방법은 반드시 각 제도의 공식 사이트에서 확인해야 합니다.

---

## 3. 클러스터 내부 링크 맵 (전체 7페이지 완성)

```
university-cost-calculator-2026 (허브, 1차)
 ├─→ national-scholarship-calculator-2026 (1차)
 ├─→ dorm-vs-commute-cost-comparison-2026 (2차)
 ├─→ university-tuition-ranking-2026 (2차)
 └─→ (3차 배포 후 추가) student-loan-repayment-calculator-2026, university-student-welfare-benefits-2026

student-loan-repayment-calculator-2026 (3차)
 ├─→ university-cost-calculator-2026
 ├─→ national-scholarship-calculator-2026
 └─→ university-student-welfare-benefits-2026

university-student-welfare-benefits-2026 (3차, 카테고리 카드가 각 계산기로 직접 연결)
 ├─→ national-scholarship-calculator-2026 (등록금 카드)
 ├─→ student-loan-repayment-calculator-2026 (등록금 카드)
 └─→ university-cost-calculator-2026 (하단 CTA)
```

**3차 배포 후 반드시 처리**: `university-cost-calculator-2026`의 `UCC_RELATED_LINKS`와 `national-scholarship-calculator-2026`의 `NS_RELATED_LINKS`에 `student-loan-repayment-calculator-2026`, `university-student-welfare-benefits-2026` 링크를 추가한다.

---

## 4. 등록 체크리스트

### 4-1. `tools.ts` (1건 추가)

```ts
{
  slug: "student-loan-repayment-calculator-2026",
  title: "학자금대출 계산기 2026",
  description: "대출 원금·거치기간·졸업 후 예상 연봉 입력하면 학자금대출 의무상환액 바로 계산.",
  order: 72.3,
  eyebrow: "학자금대출",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "2026 대출금리", value: "연 1.7%" },
    { label: "상환기준소득", value: "3,037만원" },
  ],
},
```

### 4-2. `reports.ts` + `reportMetaBySlug` (1건 추가)

```ts
// reports.ts
{
  slug: "university-student-welfare-benefits-2026",
  title: "대학생 지원금 총정리 2026 | 등록금·주거·취업 뭐 받을 수 있나",
  description: "등록금·주거·취업준비 카테고리별로 대학생이 받을 수 있는 2026년 지원제도를 한 번에 정리합니다.",
  order: 76.2,
  badges: ["신규", "대학생 지원금", "2026"],
},
```

```ts
// reports/index.astro reportMetaBySlug
"university-student-welfare-benefits-2026": { eyebrow: "대학생 지원금 총정리", category: "support", isNew: true },
```

### 4-3. `app.scss` (2건 import)

```scss
@use 'scss/pages/student-loan-repayment-calculator-2026';
@use 'scss/pages/university-student-welfare-benefits-2026';
```

### 4-4. `sitemap.xml` (2건 추가)

```xml
<url><loc>https://bigyocalc.com/tools/student-loan-repayment-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/reports/university-student-welfare-benefits-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

---

## 5. 개발 순서 및 QA 체크리스트

### 5-1. 개발 순서

1. `student-loan-repayment-calculator-2026` — 소득연계 의무상환액과 균등분할 참고치를 명확히 분리해 구현
2. `university-student-welfare-benefits-2026` — 8개 제도 카드, 등록금 카테고리 카드는 계산기로 직접 연결
3. **클러스터 전체 마무리**: `university-cost-calculator-2026`·`national-scholarship-calculator-2026`의 related 링크에 3차 페이지 추가 (3장 내부 링크 맵 반영)

### 5-2. 공통 QA

- [ ] 2페이지 전부 `SeoContent` intro 4단락·800자 이상, FAQ 6개 이상, related 3개 이상
- [ ] `student-loan-repayment-calculator-2026`에서 "소득연계 의무상환액"과 "균등분할 참고치"가 시각적으로 명확히 분리돼 실제 제도로 오인되지 않는지
- [ ] 연소득이 상환기준소득(3,037만원) 이하일 때 의무상환액이 정확히 0으로 표시되는지
- [ ] `university-student-welfare-benefits-2026`의 청년전세임대 카드에 "2025년 기준, 매년 갱신" 안내가 있는지
- [ ] 등록금 카테고리 카드(국가장학금·학자금대출)가 각각 실제 계산기로 정상 연결되는지
- [ ] 클러스터 7페이지 전체 상호 링크가 끊김 없이 연결되는지 (1차↔2차↔3차)
- [ ] `npm run build` 통과, 2개 라우트 전부 존재 확인

배포 전 `DEPLOY_CHECKLIST.md` 기준 최종 점검. 이 문서 완료로 대학생 등록금·생활비 콘텐츠 클러스터(총 7페이지) 기획·설계가 모두 끝난다.
