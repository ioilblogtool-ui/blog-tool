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

const levelValues = SCHOOL_LEVEL_STATS.map((s) => s.allStudentsAverage);
export const SCHOOL_LEVEL_MAX = Math.max(...levelValues);

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

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
