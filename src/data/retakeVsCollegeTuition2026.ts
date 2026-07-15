import { calcRetakeCost, RETAKE_PRESETS } from "./retakeExamCostCalculator2026";
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

export interface ComparisonRow {
  label: string;
  oneYearValue: number;
  fourYearValue: number;
  type: "RETAKE" | "TUITION";
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  ...RETAKE_CALC_EXAMPLES.map((r) => ({
    label: `재수 1년 — ${r.label}`,
    oneYearValue: r.exampleCalc.grandTotal,
    fourYearValue: r.exampleCalc.grandTotal, // 재수는 1년 단위 지출이라 4년 환산 없음(원값 그대로)
    type: "RETAKE" as const,
  })),
  { label: "국공립대 등록금", oneYearValue: TUITION_NATIONAL_2026, fourYearValue: TUITION_NATIONAL_2026 * 4, type: "TUITION" as const },
  { label: "사립대 등록금", oneYearValue: TUITION_PRIVATE_2026, fourYearValue: TUITION_PRIVATE_2026 * 4, type: "TUITION" as const },
  { label: "전체 평균 등록금", oneYearValue: TUITION_AVERAGE_2026, fourYearValue: TUITION_AVERAGE_2026 * 4, type: "TUITION" as const },
];

const allOneYearValues = COMPARISON_ROWS.map((r) => r.oneYearValue);
export const COMPARISON_MAX_ONE_YEAR = Math.max(...allOneYearValues);

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

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
      "단순 비용만 보면 재수가 크지만, 목표 대학·학과에 따른 장기적 차이까지 고려하면 판단이 달라질 수 있습니다. 이 리포트는 순수 비용 비교만 제공하며 진학 여부를 권고하지 않습니다.",
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
