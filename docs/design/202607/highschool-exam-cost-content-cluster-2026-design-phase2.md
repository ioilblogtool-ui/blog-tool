# 고3·수험생 비용 콘텐츠 클러스터 2026 — 설계 문서 (2차: 2페이지, 최종)

> 기획 원본: [`docs/plan/202607/highschool-exam-cost-content-cluster-2026-plan.md`](../../plan/202607/highschool-exam-cost-content-cluster-2026-plan.md)
> 1차: [`highschool-exam-cost-content-cluster-2026-design.md`](./highschool-exam-cost-content-cluster-2026-design.md) (배포됨)
> 작성일: 2026-07-15
> 범위: 2차(마지막) 2개 — `retake-vs-college-tuition-2026`(`/reports/`), `high-school-private-education-cost-2026`(`/reports/`)

---

## 0. 공통 설계 원칙

### 0-1. 착수 전 데이터 재확인 완료 (2026-07-15) — 학년별 사교육비

기획 문서에서 "학년별 세부 수치 추가 확인 필요"로 남겨둔 부분을 확인했다. 초1~고3 전 학년 개별 수치는 공개 자료에 세분화돼 있지 않아, **학교급(초/중/고) 단위 비교로 설계를 확정**한다.

| 항목 | 확인값 |
|---|---|
| 학교급별 월평균 사교육비(전체 학생 기준, 2025년 조사) | 초등학교 43만 3,000원 / 중학교 46만 1,000원 / 고등학교 49만 9,000원 |
| 학교급별 최고 참여율 학년 | 초3 86.5% / 중1 75% / 고1 66.3% |
| 사교육 참여 학생만(전체 초중고 평균) | 60만 4,000원 (전년 대비 +2.0%, 역대 최고) |
| 고등학교 참여 학생만(1차 조사 재확인) | 79만 3,000원 |
| 전체 학생 1인당 평균(전 학년 통합, 미참여 포함) | 45만 8,000원 (전년 대비 -3.5%) |
| 2025년 전체 사교육비 총액 | 27.5조 원 (5년 만에 감소) |

출처: [대한민국 정책브리핑 - 2025년 초중고 사교육비조사 결과](https://www.korea.kr/news/policyNewsView.do?newsId=156748552), [국가데이터처 - 초중고 사교육비조사](https://mods.go.kr/statDesc.es?act=view&mid=a10501010000&sttr_cd=S012001)

**설계 결론**: "전체 학생 평균"과 "참여 학생만 평균"을 같은 표에 섞으면 오해를 부른다(참여 학생만 평균이 항상 더 높음). 두 기준을 표에서 명확히 분리 표기하고, InfoNotice에도 "참여 여부에 따라 평균이 크게 달라진다"는 점을 명시한다.

### 0-2. 페이지 유형 및 재사용

두 페이지 모두 리포트(`/reports/`) — 대학생 클러스터의 `university-tuition-ranking-2026.astro`, `senior-job-comparison-2026.astro`와 동일하게 `SimpleToolShell` 없이 `<main class="container page-shell report-page op-page <slug>-page">` + `op-section` 정적 렌더 패턴을 따른다.

| 재사용 자산 | 사용처 |
|---|---|
| `src/data/retakeExamCostCalculator2026.ts`의 `calcRetakeCost`, `RETAKE_PRESETS` | `retake-vs-college-tuition-2026` |
| `src/data/universityTuition2026.ts`의 `TUITION_PRESETS`, `TUITION_AVERAGE_2026` | `retake-vs-college-tuition-2026` |

`high-school-private-education-cost-2026`은 이 클러스터의 기존 데이터를 재사용하지 않는 신규 통계 리포트다.

---

## 1. 페이지 3 — `retake-vs-college-tuition-2026` (2차, `/reports/`)

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/retakeVsCollegeTuition2026.ts` (`calcRetakeCost`, `RETAKE_PRESETS`, `TUITION_PRESETS` import) |
| 리포트 등록 | `src/data/reports.ts`, `reports/index.astro`의 `reportMetaBySlug` |
| 페이지 | `src/pages/reports/retake-vs-college-tuition-2026.astro` |
| 스타일 | `src/styles/scss/pages/_retake-vs-college-tuition-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /reports/retake-vs-college-tuition-2026/
타이틀: 재수 vs 대학 등록금 2026 | 1년 비용이 등록금보다 클까
디스크립션: 재수 1년 비용(통학/기숙학원)과 대학 4년 등록금을 나란히 비교합니다. 재수 선택 전 실제 비용 규모를 한눈에 확인하세요.
```

### 1-3. 데이터 파일 설계

```ts
import { calcRetakeCost, RETAKE_PRESETS, type RetakeType } from "./retakeExamCostCalculator2026";
import { TUITION_PRESETS, TUITION_AVERAGE_2026, TUITION_NATIONAL_2026, TUITION_PRIVATE_2026 } from "./universityTuition2026";

export { RETAKE_PRESETS, TUITION_PRESETS };

// 각 재수 유형의 기본값 기준 1년 총비용 (계산 예시)
export const RETAKE_CALC_EXAMPLES = RETAKE_PRESETS.map((preset) => ({
  ...preset,
  exampleCalc: calcRetakeCost({
    type: preset.type,
    monthlyTuition: preset.monthlyTuitionDefault,
    months: 10,
    extraFee: preset.extraFeeDefault,
  }),
}));

// 비교 기준: 재수 1년 vs 대학 등록금 1년/4년
export interface ComparisonRow {
  label: string;
  annualValue: number;
  fourYearValue: number;
  type: "RETAKE" | "TUITION";
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  ...RETAKE_CALC_EXAMPLES.map((r) => ({
    label: `재수 1년 — ${r.label}`,
    annualValue: r.exampleCalc.grandTotal,
    fourYearValue: r.exampleCalc.grandTotal, // 재수는 1년 개념이라 4년환산 대신 1년값 그대로 표기(표에서 열 라벨로 구분)
    type: "RETAKE" as const,
  })),
  { label: "국공립대 등록금", annualValue: TUITION_NATIONAL_2026, fourYearValue: TUITION_NATIONAL_2026 * 4, type: "TUITION" as const },
  { label: "사립대 등록금", annualValue: TUITION_PRIVATE_2026, fourYearValue: TUITION_PRIVATE_2026 * 4, type: "TUITION" as const },
  { label: "전체 평균 등록금", annualValue: TUITION_AVERAGE_2026, fourYearValue: TUITION_AVERAGE_2026 * 4, type: "TUITION" as const },
];

export interface FaqItem { question: string; answer: string; }
export interface RelatedLink { href: string; label: string; description: string; }

export const RVC_META = {
  slug: "retake-vs-college-tuition-2026",
  title: "재수 vs 대학 등록금 2026",
  seoTitle: "재수 vs 대학 등록금 2026 | 1년 비용이 등록금보다 클까",
  seoDescription:
    "재수 1년 비용(통학/기숙학원)과 대학 4년 등록금을 나란히 비교합니다. 재수 선택 전 실제 비용 규모를 한눈에 확인하세요.",
  description: "재수 1년 비용과 대학 등록금을 비교하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "재수 비용은 통학·기숙학원 유형별 참고 시세 기준 계산값이며, 등록금은 2026학년도 설립유형별 평균입니다. 두 수치 모두 실제 개인 상황에 따라 달라질 수 있는 추정치입니다.",
};

export const RVC_FAQ: FaqItem[] = [
  {
    question: "재수 1년 비용이 대학 등록금보다 정말 큰가요?",
    answer:
      "기숙학원 기준 재수 1년 비용(약 4,000만 원)은 사립대 4년 등록금(약 3,300만 원)보다도 큽니다. 통학 재종반(약 3,000만 원)도 국공립대 4년 등록금(약 1,700만 원)의 거의 2배입니다.",
  },
  {
    question: "그럼 재수는 무조건 손해인가요?",
    answer:
      "단순 비용만 보면 재수가 크지만, 목표 대학·학과에 따른 장기적 소득 차이까지 고려하면 판단이 달라질 수 있습니다. 이 리포트는 순수 비용 비교만 제공하며 진학 여부를 권고하지 않습니다.",
  },
  {
    question: "통학형과 기숙형 중 어느 쪽이 등록금과 더 비슷한가요?",
    answer:
      "통학 재종반(약 3,000만 원)이 사립대 4년 등록금(약 3,300만 원)과 비슷한 수준입니다. 기숙학원(약 4,000만 원)은 사립대 등록금보다 더 큽니다.",
  },
  {
    question: "이 비교에 생활비는 포함되나요?",
    answer:
      "재수 비용은 학원비+부대비용(기숙형은 숙식 포함) 기준이고, 대학 등록금은 순수 등록금만입니다. 대학 진학 시 주거·생활비까지 포함한 비교는 대학 등록금 계산기에서 별도로 확인해야 합니다.",
  },
  {
    question: "국가장학금을 받으면 등록금 쪽이 더 유리해지나요?",
    answer:
      "네, 국가장학금 등 지원금을 받으면 대학 진학 쪽의 실부담금이 더 낮아집니다. 국가장학금 계산기에서 예상 지원금을 확인해 비교에 반영해보세요.",
  },
];

export const RVC_SEO_INTRO = [
  "재수를 고민할 때 흔히 '등록금보다 재수학원비가 더 비싸다'는 이야기를 듣습니다. 실제로 숫자로 비교하면 이 말이 과장이 아닙니다. 기숙학원 기준 재수 1년 비용은 약 4,000만 원으로, 사립대 4년 등록금 평균(약 3,300만 원)보다도 큽니다. 이 리포트는 재수 유형별 1년 비용과 대학 설립유형별 등록금을 같은 화면에서 비교합니다.",
  "비교 기준을 명확히 하는 것이 중요합니다. 재수 비용은 '1년' 단위 지출이고 대학 등록금은 보통 '4년' 누적으로 이야기되므로, 이 리포트는 재수 1년 비용을 대학 등록금 1년치·4년치 양쪽과 나란히 놓아 어느 시점에서 비교해도 감이 잡히게 구성했습니다.",
  "통학 재종반(약 3,000만 원)은 사립대 4년 등록금과 비슷한 수준이고, 기숙학원(약 4,000만 원)은 그보다 더 큽니다. 반면 국공립대 4년 등록금(약 1,700만 원)은 재수 1년 비용의 절반에도 못 미칩니다. 이런 격차 때문에 '차라리 국공립대에 진학하는 게 낫다'는 판단도 종종 나옵니다.",
  "이 리포트는 순수 비용 비교이며 재수 여부에 대한 권고가 아닙니다. 재수 비용은 학원 유형별 참고 시세이고 등록금은 2026학년도 평균값으로, 둘 다 개인 상황(학원 선택, 진학 학교·학과)에 따라 실제 금액과 차이가 클 수 있습니다.",
];

export const RVC_SEO_CRITERIA = [
  "재수 비용은 재수 비용 계산기의 유형별 기본값(통학 재종반/기숙학원) 기준 계산값입니다.",
  "등록금은 2026학년도 설립유형별 평균(대학알리미 공시 기반)입니다.",
  "재수 비용에는 생활비가 포함되지 않은 등록금과 달리 기숙형의 경우 숙식비가 포함돼 있어 단순 항목 비교가 아닙니다.",
  "국가장학금 등 지원금은 반영하지 않은 명목 등록금 기준입니다.",
];

export const RVC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/retake-exam-cost-calculator-2026/", label: "재수 비용 계산기 2026", description: "재수 유형·기간별 1년 총비용을 직접 계산합니다." },
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
];
```

### 1-4. 페이지 IA

```
Hero + InfoNotice (dataNote — 비교 기준 설명)
섹션 1 — 한눈에 보는 비교 (KPI 카드: 통학 재종반 1년 / 기숙학원 1년 / 국공립대 4년 / 사립대 4년)
섹션 2 — 막대 비교 (COMPARISON_ROWS, 재수 항목과 등록금 항목을 색상으로 구분)
섹션 3 — 표 비교 (재수 유형 vs 등록금 유형, 1년/4년 환산 나란히)
섹션 4 — 인사이트 (통학형↔사립대 비슷한 수준, 기숙형>사립대, 국공립대<재수 1년의 절반 등)
섹션 5 — 관련 CTA
SeoContent (intro 4단락/faq 5개/related 3개)
```

---

## 2. 페이지 4 — `high-school-private-education-cost-2026` (2차)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/highSchoolPrivateEducationCost2026.ts` |
| 리포트 등록 | `src/data/reports.ts`, `reportMetaBySlug` |
| 페이지 | `src/pages/reports/high-school-private-education-cost-2026.astro` |
| 스타일 | `src/styles/scss/pages/_high-school-private-education-cost-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /reports/high-school-private-education-cost-2026/
타이틀: 고3 사교육비 2026 | 학년별 평균 한눈에 비교
디스크립션: 초·중·고 학교급별 월평균 사교육비와 참여 학생 기준 평균을 비교합니다. 우리 아이 사교육비가 평균보다 많은지 확인하세요.
```

### 2-3. 데이터 파일 설계

```ts
export interface SchoolLevelStat {
  level: "초등학교" | "중학교" | "고등학교";
  allStudentsAverage: number; // 전체 학생 기준(미참여 포함) 월평균
  peakParticipationGrade: string;
  peakParticipationRate: string;
}

// 2025년 국가데이터처 초중고 사교육비조사 결과(2026-03 발표) 기준
export const SCHOOL_LEVEL_STATS: SchoolLevelStat[] = [
  { level: "초등학교", allStudentsAverage: 433_000, peakParticipationGrade: "초3", peakParticipationRate: "86.5%" },
  { level: "중학교", allStudentsAverage: 461_000, peakParticipationGrade: "중1", peakParticipationRate: "75.0%" },
  { level: "고등학교", allStudentsAverage: 499_000, peakParticipationGrade: "고1", peakParticipationRate: "66.3%" },
];

export const OVERVIEW_STATS = {
  allStudentsOverallAverage: 458_000, // 전체 학생(전 학년 통합) 평균, 전년 대비 -3.5%
  participatingStudentsOverallAverage: 604_000, // 참여 학생만 평균, 전년 대비 +2.0%, 역대 최고
  highSchoolParticipatingAverage: 793_000, // 고등학교 참여 학생만 평균, 전년 대비 +2.6%
  totalMarketSize: "27.5조원", // 2025년 전체 사교육비 총액, 5년 만에 감소
};

export interface FaqItem { question: string; answer: string; }
export interface RelatedLink { href: string; label: string; description: string; }

export const HSPEC_META = {
  slug: "high-school-private-education-cost-2026",
  title: "고3 사교육비 2026",
  seoTitle: "고3 사교육비 2026 | 학년별 평균 한눈에 비교",
  seoDescription:
    "초·중·고 학교급별 월평균 사교육비와 참여 학생 기준 평균을 비교합니다. 우리 아이 사교육비가 평균보다 많은지 확인하세요.",
  description: "학교급별 사교육비 평균을 비교하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "이 통계는 2025년 국가데이터처(통계청) 초중고 사교육비조사(2026년 3월 발표) 결과입니다. '전체 학생 평균'은 사교육 미참여자를 포함한 값이고 '참여 학생만 평균'은 사교육을 실제로 받는 학생만의 평균이라 두 수치가 크게 다릅니다.",
};

export const HSPEC_FAQ: FaqItem[] = [
  {
    question: "고3 사교육비는 평균 얼마나 되나요?",
    answer:
      "사교육에 참여하는 고등학생만 놓고 보면 월평균 79만 3,000원입니다. 미참여 학생까지 포함한 고등학교 전체 평균은 49만 9,000원으로 훨씬 낮습니다.",
  },
  {
    question: "초·중·고 중 사교육비가 가장 많이 드는 학교급은?",
    answer: "전체 학생 기준으로는 고등학교(49만 9,000원)가 가장 높고, 중학교(46만 1,000원), 초등학교(43만 3,000원) 순입니다.",
  },
  {
    question: "왜 '전체 학생 평균'과 '참여 학생 평균'이 이렇게 다른가요?",
    answer:
      "전체 학생 평균은 사교육을 전혀 받지 않는 학생까지 포함해 계산한 값이라 낮게 나오고, 참여 학생 평균은 실제로 사교육을 받는 학생들만의 평균이라 체감에 더 가깝습니다.",
  },
  {
    question: "사교육 참여율이 가장 높은 학년은?",
    answer: "학교급별로 초3(86.5%), 중1(75.0%), 고1(66.3%)에서 참여율이 가장 높게 나타났습니다.",
  },
  {
    question: "전체 사교육비 시장 규모는 얼마나 되나요?",
    answer: "2025년 기준 전체 사교육비 총액은 27.5조 원으로, 5년 만에 감소세로 전환했습니다.",
  },
];

export const HSPEC_SEO_INTRO = [
  "자녀 사교육비를 남들과 비교해보고 싶을 때 가장 헷갈리는 부분이 '전체 평균'과 '참여 학생 평균'을 혼동하는 것입니다. 2025년 국가데이터처 조사에 따르면 사교육 미참여자까지 포함한 고등학교 전체 평균은 월 49만 9,000원이지만, 실제로 사교육을 받는 고등학생만 놓고 보면 월 79만 3,000원까지 올라갑니다. 이 리포트는 두 기준을 분리해서 학교급별로 비교합니다.",
  "학교급별로 보면 고등학교(49만 9,000원)가 중학교(46만 1,000원), 초등학교(43만 3,000원)보다 높아 학년이 올라갈수록 사교육비 부담이 커지는 경향이 뚜렷합니다. 다만 참여율은 오히려 초3(86.5%)이 고1(66.3%)보다 높게 나타나, 저학년에서는 '많이 참여하지만 상대적으로 적게 쓰고', 고학년에서는 '참여율은 낮아도 1인당 지출이 크다'는 패턴을 보입니다.",
  "결과를 볼 때는 우리 아이가 '전체 평균'과 '참여 학생 평균' 중 어느 쪽과 비교해야 하는지부터 정하는 것이 중요합니다. 이미 사교육을 받고 있다면 참여 학생 평균(60만 4,000원, 역대 최고)과 비교하는 것이 더 현실적이고, 사교육 여부 자체를 고민 중이라면 전체 평균(45만 8,000원)이 더 참고가 됩니다.",
  "이 통계는 2025년 국가데이터처(통계청) 초중고 사교육비조사(2026년 3월 발표) 결과이며, 표본조사 기반 평균값이라 지역·소득수준·과목에 따른 개인 편차는 반영하지 않습니다. 정확한 조사 방법론과 세부 데이터는 국가데이터처 공식 통계를 참고해야 합니다.",
];

export const HSPEC_SEO_CRITERIA = [
  "이 통계는 2025년 국가데이터처 초중고 사교육비조사(2026년 3월 발표) 결과입니다.",
  "'전체 학생 평균'은 사교육 미참여자를 포함하고, '참여 학생만 평균'은 참여자만의 평균입니다 — 반드시 구분해서 봐야 합니다.",
  "학년별(초1~고3 개별) 세부 수치는 이 조사에서 학교급(초/중/고) 단위로만 공개되어 있습니다.",
  "지역·소득수준·과목별 개인 편차는 이 통계에 반영되지 않습니다.",
];

export const HSPEC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/child-tutoring-cost-calculator/", label: "아이 사교육비 계산기", description: "자녀 수·학교급·과목별 사교육비를 직접 계산합니다." },
  { href: "/tools/retake-exam-cost-calculator-2026/", label: "재수 비용 계산기 2026", description: "재수 학원비·부대비용 1년 총액을 계산합니다." },
  { href: "/tools/college-application-fee-calculator-2026/", label: "대입 원서비 계산기 2026", description: "수시·정시 원서비 총액을 계산합니다." },
];
```

### 2-4. 페이지 IA

```
Hero + InfoNotice (dataNote — 전체평균 vs 참여학생평균 구분 강조)
섹션 1 — 한눈에 보는 개요 (OVERVIEW_STATS: 전체평균/참여학생평균/고등학교 참여학생평균/시장규모 KPI 4개)
섹션 2 — 학교급별 비교 (SCHOOL_LEVEL_STATS 막대 비교 — 전체 학생 평균 기준)
섹션 3 — 참여율 vs 지출액 패턴 (초3 참여율 최고 vs 고등학교 지출액 최고, 인사이트 카드)
섹션 4 — 관련 CTA
SeoContent (intro 4단락/faq 5개/related 3개)
```

---

## 3. 클러스터 내부 링크 맵 (전체 4페이지 완성)

```
retake-exam-cost-calculator-2026 (1차)
 ├─→ college-application-fee-calculator-2026 (1차)
 ├─→ university-cost-calculator-2026 (대학생 클러스터)
 └─→ (2차 배포 후 추가) retake-vs-college-tuition-2026

college-application-fee-calculator-2026 (1차)
 ├─→ retake-exam-cost-calculator-2026 (1차)
 └─→ university-cost-calculator-2026 (대학생 클러스터)

retake-vs-college-tuition-2026 (2차)
 ├─→ retake-exam-cost-calculator-2026
 ├─→ university-cost-calculator-2026
 └─→ national-scholarship-calculator-2026

high-school-private-education-cost-2026 (2차)
 ├─→ child-tutoring-cost-calculator (기존 사이트 콘텐츠)
 ├─→ retake-exam-cost-calculator-2026
 └─→ college-application-fee-calculator-2026
```

**2차 배포 후 반드시 처리**: 1차 두 계산기(`retake-exam-cost-calculator-2026`, `college-application-fee-calculator-2026`)의 related 링크에 `retake-vs-college-tuition-2026`을 추가한다.

---

## 4. 등록 체크리스트

### 4-1. `reports.ts` (2건 추가)

```ts
{
  slug: "retake-vs-college-tuition-2026",
  title: "재수 vs 대학 등록금 2026 | 1년 비용이 등록금보다 클까",
  description: "재수 1년 비용(통학/기숙학원)과 대학 4년 등록금을 나란히 비교합니다.",
  order: 76.3,
  badges: ["신규", "재수", "등록금", "2026"],
},
{
  slug: "high-school-private-education-cost-2026",
  title: "고3 사교육비 2026 | 학년별 평균 한눈에 비교",
  description: "초·중·고 학교급별 월평균 사교육비와 참여 학생 기준 평균을 비교합니다.",
  order: 76.4,
  badges: ["신규", "사교육비", "2026"],
},
```

### 4-2. `reports/index.astro`의 `reportMetaBySlug` (2건 추가)

```ts
"retake-vs-college-tuition-2026": { eyebrow: "재수 vs 등록금", category: "support", isNew: true },
"high-school-private-education-cost-2026": { eyebrow: "사교육비 비교", category: "support", isNew: true },
```

### 4-3. `src/pages/index.astro`의 리포트 `reportMetaBySlug`(★ 대학생 클러스터 때와 동일한 이름이지만 index.astro 내부의 별도 맵, 4-2와 다른 파일) 등록 필수

```ts
"retake-vs-college-tuition-2026": { category: "support", isNew: true },
"high-school-private-education-cost-2026": { category: "support", isNew: true },
```

### 4-4. `app.scss` (2건 import)

```scss
@use 'scss/pages/retake-vs-college-tuition-2026';
@use 'scss/pages/high-school-private-education-cost-2026';
```

### 4-5. `sitemap.xml` (2건 추가)

```xml
<url><loc>https://bigyocalc.com/reports/retake-vs-college-tuition-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/reports/high-school-private-education-cost-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

---

## 5. 개발 순서 및 QA 체크리스트

### 5-1. 개발 순서

1. `retake-vs-college-tuition-2026` — `retakeExamCostCalculator2026.ts`·`universityTuition2026.ts` 재사용
2. `high-school-private-education-cost-2026` — 신규 통계 데이터
3. 1차 두 계산기의 related 링크에 `retake-vs-college-tuition-2026` 추가 (3장 내부 링크 맵 반영)

### 5-2. 공통 QA

- [ ] 두 리포트 전부 `SeoContent` intro 4단락·800자 이상, FAQ 5개 이상, related 3개 이상
- [ ] **`reports.ts` + `reports/index.astro`의 `reportMetaBySlug` + `src/pages/index.astro`의 리포트 카테고리 맵 3곳 모두 등록 확인** (대학생 클러스터에서 실제 발생했던 "기타" 표시 버그 재발 방지)
- [ ] `retake-vs-college-tuition-2026`에서 재수 비용과 등록금이 "1년"·"4년" 중 어느 기준인지 표에서 명확히 구분돼 있는지
- [ ] `high-school-private-education-cost-2026`에서 "전체 학생 평균"과 "참여 학생만 평균"이 같은 카드/표에서 섞이지 않는지
- [ ] `retake-vs-college-tuition-2026`이 `TUITION_PRESETS`·`calcRetakeCost`를 하드코딩 없이 import하는지
- [ ] `npm run build` 통과, 2개 라우트 전부 존재 확인

배포 전 `DEPLOY_CHECKLIST.md` 기준 최종 점검. 이 문서 완료로 고3·수험생 클러스터(총 4페이지) 기획·설계가 모두 끝난다.
