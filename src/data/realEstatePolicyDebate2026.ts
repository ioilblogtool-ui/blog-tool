export const REPD_META = {
  slug: "real-estate-policy-debate-2026",
  title: "7·23 부동산정책 국민 대토론회 총정리",
  description:
    "2026년 7월 23일 부동산정책 국민 대토론회에서 논의된 공급·대출·세제 방향을 실거주 1주택자, 다주택자, 갈아타기 수요별로 정리합니다.",
  seoTitle: "7·23 부동산정책 대토론회 정리 | 종부세·대출·공급 변화",
  seoDescription:
    "2026년 7월 23일 부동산정책 국민 대토론회의 공급·주택금융·부동산세제 논의를 정리했습니다. 실거주 1주택자, 다주택자, 갈아타기, 재건축 보유자별 확인 사항과 확정 발표 체크리스트를 제공합니다.",
  updatedAt: "2026-08-05",
  policyStatus: "PUBLIC_DEBATE" as const,
  policyStatusLabel: "토론회 논의 단계 (발표 완료)",
  dataNote:
    "이 리포트는 2026년 7월 23일 부동산정책 국민 대토론회와 관련 공식·언론 보도를 바탕으로 정리한 참고 자료입니다. 이 토론회에서 논의된 방향은 2026년 8월 3일 정부 세제개편안 발표로 이어졌습니다. 세율·공제금액 등 확정 내용은 '2026 부동산 세제개편안 확정 발표 정리' 리포트를 확인하세요.",
};

export type PolicyStatus =
  | "PUBLIC_DEBATE"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "EFFECTIVE";

export type SummaryCard = {
  id: string;
  title: string;
  value: string;
  description: string;
};

export type PolicyArea = {
  id: string;
  area: string;
  opinion: string;
  speaker: string;
  status: "현행" | "참석자 제안" | "정부 방향" | "원칙 논의" | "미확정";
  note: string;
};

export type FactCheckItem = {
  item: string;
  judgment: "미확정" | "정책 방향 논의" | "규제 방향 논의";
  detail: string;
};

export type AudienceImpact = {
  id: string;
  audience: string;
  impact: "직접 확인 필요" | "간접 영향 가능" | "영향 제한적 예상" | "판단 보류";
  summary: string;
  checkPoint: string;
};

export type SupplyStage = {
  stage: string;
  distance: string;
  checkPoint: string;
};

export type LoanGroup = {
  title: string;
  items: string[];
};

export type LoanType = {
  type: string;
  meaning: string;
  checkPoint: string;
};

export type LoanCase = {
  situation: string;
  rule: string;
};

export type TaxExample = {
  holdingType: string;
  currentIssue: string;
  reviewPoint: string;
};

export type TaxCategory = {
  tax: string;
  timing: string;
  checkPoint: string;
};

export type PolicyTimeline = {
  stage: string;
  action: string;
};

export type ChecklistItem = {
  label: string;
  detail: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  desc: string;
};

export type SourceLink = {
  label: string;
  url: string;
  note: string;
};

export const REPD_SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "supply",
    title: "공급",
    value: "인허가·착공·준공",
    description: "발표 물량보다 실제 착공·입주 일정과 사업 단계 확인이 중요합니다.",
  },
  {
    id: "loan",
    title: "대출",
    value: "예외 대상·적용 조건",
    description: "실수요 보완과 우회 대출 차단이 함께 논의됐지만 한도는 확정되지 않았습니다.",
  },
  {
    id: "tax",
    title: "세금",
    value: "공제·세율·거주 요건",
    description: "보유가액과 실거주 여부를 더 반영하자는 제안은 세법 개정 전까지 미확정입니다.",
  },
];

export const REPD_POLICY_AREAS: PolicyArea[] = [
  {
    id: "housing-supply",
    area: "주택공급",
    opinion: "인허가·착공·준공의 실행 속도를 높여야 한다는 의견",
    speaker: "정부·전문가",
    status: "정부 방향",
    note: "사업지별 인허가, 착공, 입주 예정일을 따로 확인해야 합니다.",
  },
  {
    id: "redevelopment",
    area: "재건축·재개발",
    opinion: "공공성·순증 효과를 검증하며 정비사업 병목을 줄이자는 의견",
    speaker: "토론 참여자·전문가",
    status: "참석자 제안",
    note: "사업별 공급 효과와 공공성에 따라 차등 접근할 가능성이 있습니다.",
  },
  {
    id: "housing-finance",
    area: "주택금융",
    opinion: "실수요 예외는 보완하고 사업자대출 등 우회 매입은 막자는 의견",
    speaker: "금융 분야 토론",
    status: "정부 방향",
    note: "LTV 숫자뿐 아니라 DSR, 소득기준, 주택가격 기준을 함께 봐야 합니다.",
  },
  {
    id: "comprehensive-real-estate-tax",
    area: "종합부동산세",
    opinion: "주택 수보다 전체 보유가액을 중시하자는 제안",
    speaker: "토론 참여자·전문가",
    status: "참석자 제안",
    note: "세법 개정안이 발표되지 않았으므로 현행 제도가 그대로 적용됩니다.",
  },
  {
    id: "capital-gains-tax",
    area: "양도소득세",
    opinion: "실거주 없는 장기보유 혜택을 조정하자는 의견",
    speaker: "전문가 제안",
    status: "참석자 제안",
    note: "장기보유특별공제 공제율과 시행일은 법 개정 여부를 확인해야 합니다.",
  },
  {
    id: "resident-one-house",
    area: "실거주 1주택",
    opinion: "실거주 1주택자의 급격한 세 부담은 피해야 한다는 의견",
    speaker: "대통령 발언·다수 참석자",
    status: "원칙 논의",
    note: "기본공제와 고령·장기보유 부담 완화 장치가 핵심 확인 대상입니다.",
  },
  {
    id: "rental-housing",
    area: "민간임대",
    opinion: "장기 민간임대 공급자와 금융체계를 육성하자는 의견",
    speaker: "토론 참여자·전문가",
    status: "참석자 제안",
    note: "단순 임대료 지원보다 장기 공급자 육성 논의와 가깝습니다.",
  },
];

export const REPD_FACT_CHECKS: FactCheckItem[] = [
  {
    item: "종부세를 가액 기준으로 전환",
    judgment: "미확정",
    detail: "토론회에서 제시된 제안이며 세법 개정안은 발표되지 않았습니다.",
  },
  {
    item: "초고가주택 기준 신설",
    judgment: "미확정",
    detail: "구체적인 가격 구간이 언급됐더라도 확정 기준은 아닙니다.",
  },
  {
    item: "실거주 1주택 보호",
    judgment: "정책 방향 논의",
    detail: "구체적인 공제액, 세율, 고령·장기보유 세액공제 유지 여부는 정해지지 않았습니다.",
  },
  {
    item: "비거주 장기보유 공제 축소",
    judgment: "미확정",
    detail: "전문가 의견 단계이며 양도소득세 법 개정 여부를 확인해야 합니다.",
  },
  {
    item: "갈아타기 대출 완화",
    judgment: "미확정",
    detail: "일시적 2주택 처분기한, LTV, DSR 예외 범위가 발표되지 않았습니다.",
  },
  {
    item: "재건축 이주비 대출 보완",
    judgment: "미확정",
    detail: "대상 지역, 한도, DSR 적용 방식이 정해지지 않았습니다.",
  },
  {
    item: "사업자대출 우회 매입 차단",
    judgment: "규제 방향 논의",
    detail: "차단 방식, 시행일, 기존 대출 처리 기준은 후속 발표에서 확인해야 합니다.",
  },
  {
    item: "공급사업 속도 개선",
    judgment: "정책 방향 논의",
    detail: "사업지별 인허가, 착공, 입주 일정이 나와야 실제 효과를 판단할 수 있습니다.",
  },
];

export const REPD_AUDIENCE_IMPACTS: AudienceImpact[] = [
  {
    id: "no-home-buyer",
    audience: "무주택 실수요자",
    impact: "직접 확인 필요",
    summary: "정책대출과 공급 보완 논의가 직접 관련됩니다.",
    checkPoint: "생애최초·청년·신혼부부 정책대출과 공공공급 세부안을 확인하세요.",
  },
  {
    id: "resident-one-house",
    audience: "일반 실거주 1주택자",
    impact: "영향 제한적 예상",
    summary: "현재 논의만 보면 직접 변화는 제한적일 수 있습니다.",
    checkPoint: "1세대 1주택 기본공제, 고령·장기보유 공제, 납부유예 유지 여부를 확인하세요.",
  },
  {
    id: "move-up-buyer",
    audience: "갈아타기 수요",
    impact: "직접 확인 필요",
    summary: "일시적 2주택·처분조건부 대출 보완 논의와 연결됩니다.",
    checkPoint: "처분기한, 대출 예외, 시행일 이전 계약의 경과규정을 확인하세요.",
  },
  {
    id: "expensive-one-house",
    audience: "초고가 1주택자",
    impact: "직접 확인 필요",
    summary: "초고가 기준과 가액 중심 과세 논의의 영향을 받을 수 있습니다.",
    checkPoint: "고가 기준, 종부세 기본공제, 고령·장기보유 세액공제 유지 여부를 확인하세요.",
  },
  {
    id: "non-resident-one-house",
    audience: "비거주 1주택자",
    impact: "직접 확인 필요",
    summary: "실거주 없는 장기보유 혜택 조정 논의와 직접 연결됩니다.",
    checkPoint: "장기보유특별공제에서 보유기간 공제가 어떻게 조정되는지 확인하세요.",
  },
  {
    id: "local-low-price-two-house",
    audience: "지방 저가 2주택자",
    impact: "판단 보류",
    summary: "저가주택 기준, 지역 기준, 합산가액 방식이 없어 영향 계산이 어렵습니다.",
    checkPoint: "지방 저가주택의 주택 수 제외 기준과 합산가액 기준을 확인하세요.",
  },
  {
    id: "capital-area-multi-house",
    audience: "수도권 다주택자",
    impact: "직접 확인 필요",
    summary: "종부세·취득세·양도세와 대출 제한을 함께 봐야 합니다.",
    checkPoint: "종부세 기준, DSR·LTV, 사업자대출 우회 차단 규정을 함께 확인하세요.",
  },
  {
    id: "redevelopment-owner",
    audience: "재건축 보유자",
    impact: "직접 확인 필요",
    summary: "사업 속도, 이주비, 추가분담금 기준에 따라 결과가 달라질 수 있습니다.",
    checkPoint: "공공분양 비율, 임대주택 확보, 사업기간 단축, 이주비 대출 한도를 확인하세요.",
  },
  {
    id: "gap-investor",
    audience: "갭투자자",
    impact: "직접 확인 필요",
    summary: "전세대출·보증·사업자대출을 활용한 우회 매수 차단 논의가 있습니다.",
    checkPoint: "보증부 전세대출, 사업자대출, 생활안정자금 대출의 사용 제한을 확인하세요.",
  },
];

export const REPD_SUPPLY_STAGES: SupplyStage[] = [
  { stage: "공급계획 발표", distance: "매우 멂", checkPoint: "지역·사업주체만 정해졌는지" },
  { stage: "후보지·택지 선정", distance: "멂", checkPoint: "토지 확보와 주민 동의" },
  { stage: "인허가 완료", distance: "중간", checkPoint: "사업계획승인·정비계획" },
  { stage: "착공", distance: "가까움", checkPoint: "공사기간·시공사·자금조달" },
  { stage: "입주자 모집", distance: "매우 가까움", checkPoint: "분양가·청약자격·입주예정일" },
  { stage: "준공", distance: "입주 가능", checkPoint: "사용승인과 실제 입주" },
];

export const REPD_LOAN_GROUPS: LoanGroup[] = [
  {
    title: "보완 논의",
    items: [
      "생애최초·청년·신혼부부 주택구입자금",
      "재건축·재개발 조합원 이주비 대출",
      "일시적 2주택·처분조건부 대출",
      "정상적인 임대주택 사업자금",
    ],
  },
  {
    title: "차단 논의",
    items: [
      "사업자대출을 통한 주택 매입",
      "법인·특수목적법인을 통한 우회 매입",
      "생활안정자금 대출의 투자 전용",
      "보증부 전세대출을 활용한 갭투자",
    ],
  },
];

export const REPD_LOAN_TYPES: LoanType[] = [
  { type: "정책대출 확대", meaning: "디딤돌·보금자리론 등", checkPoint: "소득·주택가격 기준" },
  { type: "LTV 조정", meaning: "담보가치 대비 대출 한도", checkPoint: "지역·주택 수" },
  { type: "DSR 예외", meaning: "소득 대비 원리금 규제 예외", checkPoint: "대출 종류·차주 조건" },
  { type: "한시적 예외", meaning: "이주비·갈아타기 등 특수상황", checkPoint: "처분기한·사용 목적" },
];

export const REPD_LOAN_CASES: LoanCase[] = [
  { situation: "기존 집을 팔고 새 집을 매수", rule: "기존 주택 처분기한" },
  { situation: "새 집 계약 후 기존 집 매도", rule: "일시적 2주택 인정기간" },
  { situation: "잔금일이 먼저 도래", rule: "브리지론·처분조건부 대출" },
  { situation: "분양권 입주 예정", rule: "기존 주택 수 산정" },
  { situation: "재건축 이주", rule: "이주비 대출 DSR·LTV" },
];

export const REPD_TAX_EXAMPLES: TaxExample[] = [
  {
    holdingType: "지방 저가주택 2채",
    currentIssue: "다주택자로 묶일 수 있음",
    reviewPoint: "합산가액이 낮고 지역 예외가 있으면 부담 완화 가능",
  },
  {
    holdingType: "서울 초고가주택 1채",
    currentIssue: "1주택 공제 적용 가능",
    reviewPoint: "초고가 구간이 신설되면 부담 확대 가능",
  },
  {
    holdingType: "실거주 중가 1주택",
    currentIssue: "장기보유·고령자 부담 우려",
    reviewPoint: "공제·납부유예 유지 시 영향 제한 가능",
  },
  {
    holdingType: "비거주 고가 1주택",
    currentIssue: "양도세와 종부세 혜택이 서로 다른 제도에서 적용",
    reviewPoint: "양도세 장특공제 거주 요건과 종부세 1세대 1주택 특례를 나눠 확인",
  },
];

export const REPD_TAX_CATEGORIES: TaxCategory[] = [
  { tax: "재산세", timing: "매년 보유", checkPoint: "공시가격·과세표준·세율" },
  { tax: "종합부동산세", timing: "매년 고액 보유", checkPoint: "기본공제·가액 기준·1주택 특례" },
  { tax: "취득세", timing: "주택 취득", checkPoint: "다주택 중과·일시적 2주택" },
  { tax: "양도소득세", timing: "주택 매도", checkPoint: "비과세·중과·장기보유특별공제" },
  { tax: "임대소득세", timing: "임대수익 발생", checkPoint: "등록임대·필요경비·분리과세" },
];

export const REPD_POLICY_TIMELINE: PolicyTimeline[] = [
  { stage: "국민 대토론회", action: "방향만 확인" },
  { stage: "정부 내부 검토", action: "본인 유형과 관련된 쟁점 추려두기" },
  { stage: "부동산 대책·세제개편안 발표", action: "적용 대상과 예외 조항 확인" },
  { stage: "입법예고", action: "세부 조건, 시행일, 경과규정 확인" },
  { stage: "국회 심의·의결", action: "최종 세율과 공제금액 확인" },
  { stage: "공포·시행", action: "계약일·취득일·양도일 기준으로 적용" },
];

export const REPD_CHECKLIST: ChecklistItem[] = [
  { label: "법적 지위", detail: "정부안·입법예고·국회 통과 중 어느 단계인지" },
  { label: "시행일", detail: "발표일·법 시행일·과세 기준일이 각각 언제인지" },
  { label: "적용 대상", detail: "지역·주택가액·주택 수·거주 요건" },
  { label: "종부세 공제", detail: "1세대 1주택 기본공제와 고령·장기보유 세액공제 유지 여부" },
  { label: "보유세 기준", detail: "주택 수와 합산가액을 어떤 비중으로 반영하는지" },
  { label: "장기보유특별공제", detail: "보유기간·거주기간 공제율과 적용 시점" },
  { label: "대출 규제", detail: "LTV·DSR·스트레스 DSR 적용 여부" },
  { label: "실수요 예외", detail: "갈아타기·이주비·생애최초 조건" },
  { label: "경과규정", detail: "기존 계약·대출 신청·잔금일 처리" },
  { label: "지역 예외", detail: "지방 저가주택·인구감소지역 기준" },
];

export const REPD_FAQ: FaqItem[] = [
  {
    question: "7·23 부동산정책 국민 대토론회에서 확정 대책이 발표된 건가요?",
    answer:
      "아니요. 2026년 7월 23일 토론회는 공급·대출·세제 방향을 공개적으로 논의한 자리입니다. 세율, 공제금액, 대출 한도, 시행일은 후속 정부 발표와 법령 개정에서 확인해야 합니다.",
  },
  {
    question: "종부세가 주택 수 기준에서 가액 기준으로 바로 바뀌나요?",
    answer:
      "아닙니다. 토론회에서 주택 수보다 전체 보유가액을 더 중요하게 보자는 의견이 제시됐지만, 세법 개정안이나 시행일은 확정되지 않았습니다. 현행 제도도 공시가격을 기준으로 세액을 계산하면서 주택 수와 1세대 1주택 여부에 따라 공제·세율·특례를 달리 적용합니다.",
  },
  {
    question: "초고가 1주택자는 세금이 오르나요?",
    answer:
      "구체적인 초고가 기준과 세율이 정해지지 않아 현재는 계산할 수 없습니다. 향후 가액 중심 과세가 도입되더라도 실거주 여부, 기본공제, 고령·장기보유 세액공제 유지 여부에 따라 실제 부담은 달라집니다.",
  },
  {
    question: "실거주 1주택자도 영향을 받나요?",
    answer:
      "가능성은 있지만 구체적인 영향은 확정되지 않았습니다. 실거주 1주택자를 보호한다는 방향과 초고가 주택의 부담을 조정하자는 논의가 동시에 있으므로 주택가액, 거주기간, 공제 유지 여부에 따라 결과가 달라질 수 있습니다.",
  },
  {
    question: "지방 저가 2주택자는 세금이 줄어드나요?",
    answer:
      "가액 비중이 커지면 상대적으로 유리해질 가능성은 있지만 확정된 내용은 아닙니다. 저가주택 기준, 지역 범위, 합산가액, 종부세 주택 수 제외 규정을 확인해야 합니다.",
  },
  {
    question: "비거주 1주택자는 왜 영향이 있을 수 있나요?",
    answer:
      "양도소득세 장기보유특별공제에서 실제 거주기간을 더 중요하게 반영하거나, 보유기간만으로 받는 혜택을 조정하자는 의견과 관련됩니다. 다만 구체적인 공제율과 시행일은 발표되지 않았습니다.",
  },
  {
    question: "갈아타기 대출이 완화되나요?",
    answer:
      "토론회에서 실수요성 대출을 보완할 필요성이 논의됐지만, 일시적 2주택 처분기한, LTV, DSR 예외 범위는 확정되지 않았습니다. 갈아타기 대출 전면 완화로 해석하기는 어렵습니다.",
  },
  {
    question: "재건축·재개발 규제가 풀리나요?",
    answer:
      "전면 완화보다는 공공성, 임대주택 확보, 실제 공급 순증 효과에 따라 혜택을 차등 적용하는 방향으로 볼 수 있습니다. 사업별 조건이 중요하므로 단지별로 같은 영향이 생긴다고 단정하기 어렵습니다.",
  },
  {
    question: "다주택자는 어떤 부분을 봐야 하나요?",
    answer:
      "종부세 기준이 주택 수에서 합산가액 중심으로 바뀌는지, 사업자대출·전세대출 우회 규제가 강화되는지, 양도세 장기보유특별공제가 조정되는지를 함께 확인해야 합니다.",
  },
  {
    question: "토론회 내용만 보고 매도해야 하나요?",
    answer:
      "토론회 발언만으로 매도·매수를 결정하기에는 불확실성이 큽니다. 정부 대책, 법률 개정안, 시행일, 기존 계약의 경과규정을 확인한 후 현행 세금과 개편 후 예상 세금을 비교하는 것이 안전합니다.",
  },
  {
    question: "이 토론회 이후 실제 정부 발표가 나왔나요?",
    answer:
      "네. 2026년 8월 3일 정부가 세제개편안을 공식 발표했습니다. 종부세는 주택 수 기준 대신 합산 공시가격 중심으로 바뀌고, 1주택 기본공제는 실거주 14억 원·비거주 9억 원으로 나뉘며, 장기보유특별공제는 거주기간 중심(연 8%·최대 80%)으로 개편됩니다. 다주택 양도세 중과는 2027~2028년 한시 완화됩니다. 자세한 내용은 '2026 부동산 세제개편안 확정 발표 정리' 리포트를 확인하세요.",
  },
];

export const REPD_RELATED_LINKS: RelatedLink[] = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공시가격과 공정시장가액비율을 입력해 재산세·종부세를 추정합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "보유기간과 실거주기간을 반영해 매도 전 양도세를 확인합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "갈아타기나 추가 매수 전 취득세 부담을 먼저 확인합니다.",
  },
  {
    label: "2026 부동산 세제개편안 확정 발표 정리",
    href: "/reports/real-estate-tax-reform-2026/",
    desc: "8월 3일 발표된 종부세·장기보유특별공제 개편안 확정 내용을 정리한 리포트입니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "다주택자의 취득세·보유세·양도세 구조를 함께 확인합니다.",
  },
];

export const REPD_SOURCE_LINKS: SourceLink[] = [
  {
    label: "대한민국 정책브리핑",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148968675",
    note: "2026년 7월 23일 부동산정책 국민 대토론회 대통령 발언과 행사 성격",
  },
  {
    label: "대한민국 정책브리핑",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148968138",
    note: "2026년 7월 14~16일 분야별 토론회와 7월 23일 종합 토론회 구조",
  },
  {
    label: "YTN 현장생중계",
    url: "https://www.ytn.co.kr/_ln/0301_202607231021276154",
    note: "공급·금융·세제 사전 의견수렴 결과와 현장 발언",
  },
  {
    label: "뉴시스",
    url: "https://www.newsis.com/view/NISX20260723_0003720769",
    note: "공급 속도, 민간임대, 정비사업 논의 관련 보도",
  },
  {
    label: "조선비즈",
    url: "https://biz.chosun.com/real_estate/real_estate_general/2026/07/23/THDMO5Y2TZDGBG5QTV5BZAAA2U/",
    note: "재건축·재개발의 실제 공급 효과 논의 관련 보도",
  },
  {
    label: "다음 뉴스",
    url: "https://v.daum.net/v/uLQ11KB3ST?f=p",
    note: "종부세 가액 기준, 초고가·비거주 주택 관련 토론회 발언 보도",
  },
];
