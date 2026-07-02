import { GWB_MEDIAN_INCOME_ROWS, type MedianIncomeRow } from "./governmentWelfareBenefits2026";

export type SourceLabel = "공식" | "확인 필요" | "추정";
export type NptGroup =
  | "verify"
  | "medical"
  | "jobs"
  | "disability"
  | "family"
  | "discount"
  | "voucher"
  | "education"
  | "childcare";

export interface NptBenefitItem {
  id: string;
  group: NptGroup;
  name: string;
  target: string;
  incomeCriteria: string;
  supportType: "현금" | "바우처" | "감면" | "서비스";
  supportSummary: string;
  applicationChannel: string;
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  notes: string[];
}

export interface NptComparisonRow {
  label: string;
  basicLivelihood: string;
  nearPoverty: string;
}

export interface NptApplicationStep {
  id: string;
  step: number;
  title: string;
  desc: string;
}

export interface NptAudienceRecommendation {
  id: string;
  audience: string;
  firstCheck: string[];
  reason: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface NptFaq {
  question: string;
  answer: string;
}

export interface NptRelatedLink {
  href: string;
  label: string;
  desc?: string;
}

export { GWB_MEDIAN_INCOME_ROWS as NPT_MEDIAN_INCOME_ROWS };
export type { MedianIncomeRow };

export const NPT_META = {
  slug: "near-poverty-tier-benefits-2026",
  title: "2026 차상위계층 혜택 총정리",
  seoTitle: "차상위계층 혜택 2026 완전 정리 - 기초수급 탈락 후 받을 수 있는 지원",
  seoDescription:
    "기초생활수급자가 아니어도 차상위계층 확인서로 받을 수 있는 의료비 경감, 통신비·전기요금 감면, 문화누리카드, 자활사업까지 2026년 기준으로 한 번에 정리했습니다.",
  description:
    "기초생활수급자는 아니지만 소득이 낮은 가구가 확인할 수 있는 차상위계층 혜택 11종을 2026년 기준으로 비교합니다.",
  updatedAt: "2026-07-02",
  dataNote:
    "차상위계층 확인 기준(중위소득 50%)은 보건복지부 2026년 기준값을 사용했습니다. 세부 혜택별 소득기준과 금액은 사업 공고 시점에 따라 달라질 수 있어 확인 필요로 표시했습니다.",
};

export const NPT_COMPARISON_ROWS: NptComparisonRow[] = [
  { label: "소득기준", basicLivelihood: "생계 32%·의료 40%·주거 48%·교육 50%", nearPoverty: "대체로 중위 50% 이하" },
  { label: "지원 형태", basicLivelihood: "현금 급여(생계·주거·교육) + 의료급여", nearPoverty: "감면·바우처·서비스 중심" },
  { label: "대표 혜택", basicLivelihood: "생계급여, 의료급여, 주거급여, 교육급여", nearPoverty: "본인부담경감, 통신비 감면, 전기요금 할인, 문화누리카드" },
  { label: "확인 방법", basicLivelihood: "기초생활보장 수급자 선정", nearPoverty: "차상위계층 확인서 발급" },
];

export const NPT_BENEFIT_ITEMS: NptBenefitItem[] = [
  {
    id: "near-poverty-cert",
    group: "verify",
    name: "차상위계층 확인서",
    target: "중위소득 50% 이하이면서 기초생활수급자가 아닌 가구",
    incomeCriteria: "중위 50% 이하",
    supportType: "서비스",
    supportSummary: "개별 차상위 혜택 신청의 전제 조건이 되는 확인서 발급",
    applicationChannel: "복지로 또는 주소지 읍면동 주민센터",
    sourceLabel: "공식",
    sourceUrl: "https://www.bokjiro.go.kr",
    updatedAt: "2026년 기준",
    notes: ["확인서 자체만으로 혜택이 자동 적용되지 않습니다."],
  },
  {
    id: "medical-cost-reduction",
    group: "medical",
    name: "차상위 본인부담경감",
    target: "만성질환자·희귀난치성질환자 등 차상위 가구원",
    incomeCriteria: "중위 50% 이하 (질환별 세부 기준 확인 필요)",
    supportType: "감면",
    supportSummary: "병원 진료비·약제비 본인부담 비율 경감",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["질환 종류에 따라 경감 비율이 다릅니다."],
  },
  {
    id: "self-support-program",
    group: "jobs",
    name: "차상위 자활사업",
    target: "근로 가능한 차상위 가구원",
    incomeCriteria: "중위 50% 이하 + 근로 가능 판정",
    supportType: "서비스",
    supportSummary: "자활근로 참여를 통한 소득 보전과 자산형성 연계",
    applicationChannel: "지역자활센터 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["근로 능력 평가 결과에 따라 참여 유형이 달라집니다."],
  },
  {
    id: "disability-allowance",
    group: "disability",
    name: "차상위 장애수당",
    target: "차상위 등록장애인(중증 제외)",
    incomeCriteria: "중위 50% 이하",
    supportType: "현금",
    supportSummary: "장애로 인한 추가 생활비용 보전 수당",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["장애 정도·등록 여부 확인이 필요합니다."],
  },
  {
    id: "single-parent-special",
    group: "family",
    name: "한부모가족지원 차상위 특례",
    target: "한부모·조손가구",
    incomeCriteria: "중위 52% 이하 (특례 완화 기준)",
    supportType: "현금",
    supportSummary: "아동양육비 등 한부모가족 특화 지원",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["일반 차상위 기준(50%)보다 완화된 특례 기준을 적용합니다."],
  },
  {
    id: "telecom-discount",
    group: "discount",
    name: "통신요금 감면",
    target: "차상위계층 확인자",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "감면",
    supportSummary: "이동통신 기본료·통화료 정액 감면",
    applicationChannel: "통신사 대리점 또는 복지로 온라인 신청",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["통신사별 신청 절차가 다를 수 있습니다."],
  },
  {
    id: "electricity-discount",
    group: "discount",
    name: "전기요금 할인",
    target: "차상위계층 확인자",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "감면",
    supportSummary: "월 전기요금 정액 할인",
    applicationChannel: "한국전력공사 또는 복지로",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["계절별 할인 한도가 다를 수 있습니다."],
  },
  {
    id: "energy-voucher",
    group: "voucher",
    name: "에너지바우처",
    target: "차상위 중 특정 요건(노인·영유아·장애인·임산부 등) 충족 가구",
    incomeCriteria: "중위 50% 이하 + 가구원 요건",
    supportType: "바우처",
    supportSummary: "냉난방비 지원 바우처",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.energyv.or.kr",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["가구원 특성 요건 충족 여부를 함께 확인해야 합니다."],
  },
  {
    id: "culture-card",
    group: "voucher",
    name: "문화누리카드",
    target: "기초·차상위",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "바우처",
    supportSummary: "문화·여행·체육 활동비 바우처",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.mnuri.kr",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["연간 미사용 잔액은 소멸될 수 있습니다."],
  },
  {
    id: "lifelong-education-voucher",
    group: "education",
    name: "평생교육바우처",
    target: "차상위 등 저소득 성인",
    incomeCriteria: "중위 50% ~ 65% 이하 (사업 공고 기준)",
    supportType: "바우처",
    supportSummary: "평생교육 강좌 수강료 지원",
    applicationChannel: "국가평생교육진흥원",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["매년 모집 시기와 예산이 제한적입니다."],
  },
  {
    id: "priority-childcare",
    group: "childcare",
    name: "우선돌봄 차상위",
    target: "만 12세 이하 아동을 양육하는 차상위 가구",
    incomeCriteria: "중위 50% 이하",
    supportType: "현금",
    supportSummary: "아동양육비 등 돌봄 지원",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["지자체별 추가 지원 여부를 함께 확인하세요."],
  },
];

export const NPT_APPLICATION_STEPS: NptApplicationStep[] = [
  { id: "step-1", step: 1, title: "신청", desc: "주소지 읍면동 주민센터 방문 또는 복지로 온라인 신청" },
  { id: "step-2", step: 2, title: "소득·재산 조사", desc: "소득인정액 산정을 위한 소득·재산·부채 자료 제출" },
  { id: "step-3", step: 3, title: "심사", desc: "중위소득 50% 이하 여부 및 기초생활수급자 해당 여부 확인" },
  { id: "step-4", step: 4, title: "확인서 발급", desc: "차상위계층 확인서 발급, 유효기간 내 개별 사업 신청 시 활용" },
  { id: "step-5", step: 5, title: "개별 사업 신청", desc: "확인서를 근거로 통신비·전기요금·바우처 등 개별 혜택 별도 신청" },
];

export const NPT_AUDIENCE_RECOMMENDATIONS: NptAudienceRecommendation[] = [
  {
    id: "rejected-basic-livelihood",
    audience: "기초수급 탈락 통보 받은 가구",
    firstCheck: ["차상위계층 확인서 발급"],
    reason: "기초수급 탈락은 자동으로 차상위 전환되지 않으므로 별도 신청이 필요합니다.",
    ctaLabel: "수급자격 재확인",
    ctaHref: "/tools/welfare-benefit-eligibility/",
  },
  {
    id: "chronic-illness",
    audience: "만성질환자가 있는 가구",
    firstCheck: ["차상위 본인부담경감"],
    reason: "질환별 의료비 본인부담을 경감받을 수 있는지 우선 확인합니다.",
    ctaLabel: "의료비 혜택 확인",
    ctaHref: "#medical-jobs",
  },
  {
    id: "employable-member",
    audience: "근로 가능한 저소득 가구원",
    firstCheck: ["차상위 자활사업"],
    reason: "자활근로 참여로 소득 보전과 자산형성을 함께 도모할 수 있습니다.",
    ctaLabel: "자활 지원 확인",
    ctaHref: "#medical-jobs",
  },
  {
    id: "single-parent",
    audience: "한부모·조손가구",
    firstCheck: ["한부모가족지원 차상위 특례"],
    reason: "일반 차상위 기준보다 완화된 중위 52% 특례 기준이 적용됩니다.",
    ctaLabel: "가족 지원 확인",
    ctaHref: "#family-childcare",
  },
  {
    id: "high-energy-bill",
    audience: "냉난방비 부담이 큰 가구",
    firstCheck: ["에너지바우처", "전기요금 할인"],
    reason: "가구원 요건을 충족하면 바우처와 정액 할인을 함께 받을 수 있습니다.",
    ctaLabel: "바우처 신청 확인",
    ctaHref: "#discount-voucher",
  },
];

export const NPT_FAQ: NptFaq[] = [
  {
    question: "차상위계층과 기초생활수급자는 무엇이 다른가요?",
    answer:
      "기초생활수급자는 생계·의료·주거·교육급여 등 현금성 급여를 받는 저소득 가구이고, 차상위계층은 수급자 기준(중위 32~50%)은 넘지만 소득이 낮아 의료비 경감, 통신비·전기요금 감면, 바우처 등 개별 사업 혜택을 받을 수 있는 계층입니다.",
  },
  {
    question: "차상위계층 확인서만 있으면 모든 혜택을 다 받을 수 있나요?",
    answer:
      "아닙니다. 확인서는 차상위 자격을 증명하는 전제 조건일 뿐이며, 본인부담경감·자활사업·통신비 감면 등 개별 사업마다 별도 신청과 심사가 필요합니다.",
  },
  {
    question: "차상위계층 기준은 어떻게 되나요?",
    answer:
      "대체로 기준 중위소득 50% 이하이면서 기초생활수급자가 아닌 가구가 해당됩니다. 다만 한부모가족지원처럼 일부 사업은 중위 52%까지 완화된 특례 기준을 적용하므로 사업별 공고 확인이 필요합니다.",
  },
  {
    question: "기초수급 심사에서 탈락하면 차상위로 자동 전환되나요?",
    answer: "자동 전환되지 않습니다. 탈락 통보를 받은 후 주민센터나 복지로에서 차상위계층 확인을 별도로 신청해야 합니다.",
  },
  {
    question: "차상위 기준에서도 벗어나면 받을 수 있는 지원이 없나요?",
    answer:
      "긴급복지지원, 지자체 개별 지원제도 등 추가 대안이 있습니다. 소득이 기준을 조금 넘더라도 위기 사유가 있다면 긴급복지지원을 먼저 확인하는 것이 좋습니다.",
  },
];

export const NPT_RELATED_LINKS: NptRelatedLink[] = [
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    desc: "가구원 수, 소득, 재산을 입력해 수급·차상위 가능성을 간이 확인",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    desc: "생계·주거·청년·가족·장애·바우처 20개 제도 전체 비교",
  },
  {
    href: "/tools/livelihood-benefit-income-recognition/",
    label: "생계급여 소득인정액 계산기",
    desc: "생계급여와 차상위 경계선 비교",
  },
  {
    href: "/tools/housing-benefit-income-recognition/",
    label: "주거급여 소득인정액 계산기",
    desc: "주거급여 탈락 시 차상위 대안 연결",
  },
];

export const NPT_SEO_CONTENT = {
  introTitle: "2026 차상위계층 혜택 총정리는 확인 기준부터 세부 혜택 신청까지 한 번에 정리한 가이드입니다",
  intro: [
    "기초생활보장 심사에서 탈락했다고 해서 받을 수 있는 지원이 없는 것은 아닙니다. 소득이 기준 중위소득 50% 안팎으로 낮다면 차상위계층 확인서를 통해 의료비 경감, 통신비·전기요금 감면, 문화누리카드 등 다양한 혜택을 확인할 수 있습니다.",
    "차상위계층은 기초생활수급자와 다릅니다. 수급자는 생계·의료·주거·교육급여처럼 현금성 급여를 받지만, 차상위계층은 대부분 감면·바우처·서비스 형태로 지원받습니다. 2026년 4인 가구 기준 차상위계층 확인 기준은 월 3,247,369원(중위소득 50%)입니다.",
    "차상위계층 확인서는 그 자체로 혜택을 자동 지급하지 않습니다. 본인부담경감, 자활사업, 통신비 감면, 전기요금 할인, 에너지바우처, 문화누리카드 등 개별 사업마다 별도 신청과 심사가 필요하며, 사업에 따라 중위 50%가 아닌 52% 등 완화된 특례 기준이 적용되기도 합니다.",
    "이 리포트는 2026년 공식 기준 중위소득과 차상위 관련 제도별 공고를 바탕으로 작성된 참고 자료입니다. 실제 확인서 발급 여부와 개별 혜택 지급 여부는 소득·재산 조사와 사업별 심사 결과에 따라 달라질 수 있습니다. 본인 가구 기준으로 먼저 확인하려면 복지급여 수급자격 계산기를 함께 사용하세요.",
  ],
  inputPoints: [
    "2026년 차상위계층 확인 기준(중위소득 50%)을 가구원 수별로 확인할 수 있습니다.",
    "기초생활수급자와 차상위계층의 차이, 세부 혜택 11종을 한 페이지에서 비교할 수 있습니다.",
    "확인서 발급 절차와 기초수급 탈락 후 대안 경로를 확인할 수 있습니다.",
  ],
  criteria: [
    "차상위계층 확인 기준(중위 50%)은 보건복지부 2026년 기준 중위소득을 사용합니다.",
    "세부 혜택별 소득기준·금액은 사업별 공식 공고 확인이 필요합니다.",
    "실제 확인서 발급과 개별 혜택 신청은 복지로, 정부24, 주민센터에서 확인해야 합니다.",
  ],
};
