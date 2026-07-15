import {
  TUITION_PRESETS,
  TUITION_AVERAGE_2026,
  TUITION_TREND_2022_2026,
  type TuitionPreset,
} from "./universityTuition2026";
import { RESIDENCE_PRESETS, type ResidenceType, type ResidencePreset } from "./universityHousingCost2026";

export type EnrollmentYears = 4 | 6;

export interface UccInput {
  annualTuition: number;
  residenceType: ResidenceType;
  monthlyHousing: number;
  monthlyLiving: number;
  monthlyCommute: number;
  annualScholarship: number;
  yearsEnrolled: EnrollmentYears;
}

export interface UccResult {
  tuitionTotal: number;
  livingTotal: number;
  aidTotal: number;
  grossTotal: number; // 등록금+주거·생활비 (장학금 반영 전)
  netBurden: number; // grossTotal - aidTotal (실부담금)
  monthlyAverage: number;
  aidCoverageRatio: number; // grossTotal 대비 aidTotal 비율(%)
}

// public/scripts/university-cost-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcUniversityCost(input: UccInput): UccResult {
  const tuitionTotal = input.annualTuition * input.yearsEnrolled;
  const monthlyTotal = input.monthlyHousing + input.monthlyLiving + input.monthlyCommute;
  const livingTotal = monthlyTotal * 12 * input.yearsEnrolled;
  const aidTotal = input.annualScholarship * input.yearsEnrolled;
  const grossTotal = tuitionTotal + livingTotal;
  const netBurden = Math.max(grossTotal - aidTotal, 0);
  const monthlyAverage = netBurden / (input.yearsEnrolled * 12);
  const aidCoverageRatio = grossTotal > 0 ? Math.min(Math.round((aidTotal / grossTotal) * 100), 100) : 0;
  return { tuitionTotal, livingTotal, aidTotal, grossTotal, netBurden, monthlyAverage, aidCoverageRatio };
}

export const UCC_DEFAULT_INPUT: UccInput = {
  annualTuition: TUITION_AVERAGE_2026,
  residenceType: "PARENTS",
  monthlyHousing: 0,
  monthlyLiving: 400_000,
  monthlyCommute: 100_000,
  annualScholarship: 0,
  yearsEnrolled: 4,
};

export const UCC_META = {
  slug: "university-cost-calculator-2026",
  title: "대학 등록금 계산기 2026",
  seoTitle: "대학 등록금 계산기 2026 | 4년 총비용 실부담금 바로 계산",
  seoDescription:
    "등록금·주거비·생활비·통학비를 입력하고 국가장학금을 빼면 대학 4년 실제 부담금과 부모 부담액을 바로 계산합니다. 학생·부모 관점 결과 제공.",
  updatedAt: "2026-07-15",
  dataNote:
    "등록금·주거비 기본값은 2026학년도 대학알리미 공시·언론 보도 기준 평균값이며, 실제 학교·학과별 금액은 이보다 높거나 낮을 수 있습니다. 이 계산 결과는 예산 계획을 위한 참고 자료입니다.",
};

export const UCC_FAQ = [
  {
    question: "대학 4년 등록금은 평균 얼마나 드나요?",
    answer:
      "2026학년도 4년제 대학 평균은 연 727만 300원으로, 4년이면 약 2,900만 원 수준입니다. 사립대(823만 1,500원)와 국공립대(425만 원)는 4년 기준 약 1,600만 원 차이가 납니다.",
  },
  {
    question: "국공립대와 사립대 등록금 차이는 얼마나 되나요?",
    answer:
      "2026학년도 기준 국공립대 평균은 425만 원, 사립대는 823만 1,500원으로 약 2배 차이입니다. 계열까지 고려하면 의학 계열 사립대는 1,000만 원을 넘는 경우도 있습니다.",
  },
  {
    question: "자취하면 생활비가 얼마나 더 드나요?",
    answer:
      "2026년 서울 대학가 원룸 평균 월세는 62만 2,000원, 관리비 8만 2,000원으로 월세만 연 840만 원 이상입니다. 월세 제외 생활비도 월 100만~130만 원 선이 현실적이라 자취 시 등록금보다 주거·생활비 부담이 더 커질 수 있습니다.",
  },
  {
    question: "기숙사에 들어가면 비용을 얼마나 아낄 수 있나요?",
    answer:
      "2인실 기준 평균 기숙사비는 월 32만 5,000원 선으로 자취 월세의 절반 수준입니다. 다만 전국 기숙사 수용률은 22.6%(수도권은 18.2%)에 불과해 신청 경쟁이 치열합니다.",
  },
  {
    question: "등록금은 매년 오르나요?",
    answer:
      "2026학년도에는 190개 대학 중 125개교(65.8%)가 등록금을 인상했고 65개교는 동결했습니다. 법정 인상 상한은 2026학년도 3.19%로 최근 5년 중 가장 낮은 수준입니다.",
  },
  {
    question: "국가장학금을 받으면 실부담금이 얼마나 줄어드나요?",
    answer:
      "소득분위 1~3구간은 연 최대 600만 원, 4~6구간은 440만 원까지 지원됩니다. 국가장학금 계산기로 예상 지원금을 먼저 확인한 뒤 이 계산기에 입력하면 실제 부담금을 정확히 볼 수 있습니다.",
  },
  {
    question: "총비용 보기와 실부담금 보기는 뭐가 다른가요?",
    answer:
      "총비용 보기는 장학금을 반영하기 전 등록금+주거·생활비 합계이고, 실부담금 보기는 여기서 장학금을 뺀 뒤 실제로 준비해야 하는 금액입니다.",
  },
  {
    question: "계열에 따라 등록금이 얼마나 차이 나나요?",
    answer:
      "2026학년도 기준 의학 계열 평균 1,032만 5,900원, 예체능 833만 8,100원, 공학 767만 7,400원, 자연과학 732만 3,300원, 인문사회 643만 3,700원으로 최대 400만 원 가까이 차이가 납니다.",
  },
];

export const UCC_SEO_CONTENT = {
  introTitle: "대학 4년 실제 비용, 등록금만으론 안 보입니다",
  intro: [
    "대학 입학을 앞둔 예비 대학생과 학부모는 등록금 고지서를 받기 전부터 4년치 총비용이 얼마나 되는지 궁금해합니다. 2026학년도 4년제 대학 평균 등록금은 연 727만 300원으로 전년보다 2.1% 올랐고, 사립대는 823만 1,500원, 국공립대는 425만 원으로 두 배 가까이 차이가 납니다. 여기에 자취·기숙사비, 생활비, 통학비까지 더하면 등록금만 볼 때보다 실제 부담은 훨씬 커집니다.",
    "이 계산기는 등록금 + 주거비 + 생활비 + 통학비를 더한 뒤 국가장학금 등 지원금을 뺀 '4년 실부담금' 방식으로 계산합니다. 2026년 서울 대학가 원룸 평균 월세는 62만 2,000원, 기숙사 수용률은 전국 평균 22.6%에 불과해 거주 형태 선택이 총비용을 좌우하는 가장 큰 변수입니다. 계열별로도 의학 계열 평균 1,032만 5,900원부터 인문사회 643만 3,700원까지 등록금 차이가 크므로, 계열을 반영해야 실제에 가까운 숫자가 나옵니다.",
    "결과에서 '등록금 총액'보다 '주거·생활비 총액'이 더 큰 경우가 많다는 점에 주목해야 합니다. 수도권 자취를 선택하면 월세만으로 연간 700만 원 이상이 추가돼, 등록금이 저렴한 국공립대에 진학해도 총비용이 사립대 자택 통학보다 커질 수 있습니다. '총비용 보기'와 '실부담금 보기' 두 관점을 함께 보면 실제로 얼마를 준비해야 하는지 더 명확히 판단할 수 있습니다.",
    "이 계산기는 2026학년도 대학알리미·언론 보도 기준 평균값을 기본값으로 제공하며, 실제 등록금은 학교·학과별로 최대 수백만 원 차이가 날 수 있습니다(2026학년도 등록금 인상 대학 125개교, 동결 65개교). 정확한 등록금은 진학 예정 학교의 대학알리미 공시 자료를 확인하시고, 이 계산 결과는 예산 계획을 위한 참고 자료로 활용하세요.",
  ],
  inputPoints: [
    "등록금 프리셋(전체 평균/국공립/사립/계열별)을 클릭하면 실제 보도된 2026학년도 수치가 바로 입력됩니다.",
    "거주 형태(부모님 집/기숙사/자취)를 바꾸면 월 주거비·생활비 기본값이 자동으로 갱신됩니다.",
    "국가장학금 계산기에서 예상 지원금을 먼저 확인한 뒤 '연간 장학금' 입력값에 넣으면 실부담금까지 이어서 계산할 수 있습니다.",
  ],
  criteria: [
    "등록금 기본값은 2026학년도 대학알리미·언론 보도 평균치이며 개별 학교 수치가 아닙니다.",
    "주거비 기본값은 2026년 1월 서울 대학가 원룸 시세·전국 기숙사비 평균 기준입니다.",
    "실부담금 = (등록금+주거·생활비+통학비) 총액 − 장학금 총액이며, 알바 등 학생 본인 소득은 포함하지 않습니다.",
    "재학 기간은 4년/6년(약학 등)만 지원하며, 휴학·재수강 등 변수는 반영하지 않습니다.",
  ],
};

export const UCC_RELATED_LINKS = [
  {
    href: "/tools/national-scholarship-calculator-2026/",
    label: "국가장학금 계산기 2026",
    description: "소득분위별 예상 국가장학금 지원금을 계산해 이 계산기의 장학금 입력값으로 연결합니다.",
  },
  {
    href: "/tools/dorm-vs-commute-cost-comparison-2026/",
    label: "기숙사 vs 자취 vs 통학 비교",
    description: "거주 형태별 주거·생활비와 통학 시간을 자세히 비교합니다.",
  },
  {
    href: "/reports/university-tuition-ranking-2026/",
    label: "대학 등록금 순위 2026",
    description: "설립유형·계열별 등록금과 상위 대학 예시를 비교합니다.",
  },
  {
    href: "/tools/student-loan-repayment-calculator-2026/",
    label: "학자금대출 계산기 2026",
    description: "졸업 후 예상 월 상환액을 계산합니다.",
  },
  {
    href: "/reports/university-student-welfare-benefits-2026/",
    label: "대학생 지원금 총정리 2026",
    description: "등록금·주거·취업준비 카테고리별 지원제도를 한 번에 확인합니다.",
  },
];

export const UCC_CONFIG = {
  tuitionPresets: TUITION_PRESETS as TuitionPreset[],
  residencePresets: RESIDENCE_PRESETS as ResidencePreset[],
  tuitionTrend: TUITION_TREND_2022_2026,
  defaultInput: UCC_DEFAULT_INPUT,
};
