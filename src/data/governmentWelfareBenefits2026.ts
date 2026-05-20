export type SourceLabel = "공식" | "확인 필요" | "추정" | "참고";
export type WelfareGroup = "basic" | "low-income" | "family" | "youth" | "disability" | "senior" | "voucher" | "region";
export type Priority = "최우선" | "높음" | "상황별" | "계절성" | "확인";

export interface MedianIncomeRow {
  householdSize: number;
  median2025: number;
  median2026: number;
  increaseRate: number;
  livelihood: number;
  medical: number;
  housing: number;
  education: number;
}

export interface WelfareBenefitItem {
  id: string;
  group: WelfareGroup;
  name: string;
  target: string;
  incomeCriteria: string;
  supportType: string;
  supportSummary: string;
  applicationChannel: string;
  priority: Priority;
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  notes: string[];
}

export interface AudienceRecommendation {
  id: string;
  audience: string;
  firstCheck: string[];
  reason: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ApplicationChecklist {
  id: string;
  label: string;
  description: string;
  requiredFor: string[];
}

export const GWB_META = {
  slug: "2026-government-welfare-benefits",
  title: "2026 정부 복지지원금 완전 정복",
  seoTitle: "2026 정부 지원금 종류 총정리 - 생계·주거·청년·한부모·장애인 복지 혜택",
  seoDescription:
    "2026년 기준 중위소득과 정부 복지지원금 20개를 한 번에 비교합니다. 생계·의료·주거·교육급여, 차상위, 한부모, 청년월세, 에너지바우처 신청 기준과 서류를 확인하세요.",
  description:
    "2026년 기준 중위소득과 정부 복지지원금 20개를 생계·주거·청년·가족·장애인·바우처별로 비교합니다.",
  updatedAt: "2026-05-19",
  dataNote:
    "기준 중위소득과 기초생활보장 급여별 선정기준은 2026년 기준값을 사용했습니다. 청년·바우처·지자체 지원은 공고 시점과 예산에 따라 달라질 수 있어 확인 필요로 표시했습니다.",
};

export const GWB_MEDIAN_INCOME_ROWS: MedianIncomeRow[] = [
  { householdSize: 1, median2025: 2392013, median2026: 2564238, increaseRate: 0.072, livelihood: 820556, medical: 1025695, housing: 1230834, education: 1282119 },
  { householdSize: 2, median2025: 3932658, median2026: 4199292, increaseRate: 0.0677, livelihood: 1343773, medical: 1679717, housing: 2015660, education: 2099646 },
  { householdSize: 3, median2025: 5025353, median2026: 5359036, increaseRate: 0.0663, livelihood: 1714892, medical: 2143614, housing: 2572337, education: 2679518 },
  { householdSize: 4, median2025: 6097773, median2026: 6494738, increaseRate: 0.0651, livelihood: 2078316, medical: 2597895, housing: 3117474, education: 3247369 },
  { householdSize: 5, median2025: 7108192, median2026: 7556719, increaseRate: 0.0631, livelihood: 2418150, medical: 3022688, housing: 3627225, education: 3778360 },
  { householdSize: 6, median2025: 8064805, median2026: 8555952, increaseRate: 0.0609, livelihood: 2737905, medical: 3422381, housing: 4106857, education: 4277976 },
];

export const GWB_BENEFIT_ITEMS: WelfareBenefitItem[] = [
  {
    id: "livelihood-benefit",
    group: "basic",
    name: "생계급여",
    target: "소득인정액이 기준 중위소득 32% 이하인 가구",
    incomeCriteria: "중위 32% 이하",
    supportType: "현금",
    supportSummary: "최저생활 보장을 위해 선정기준에서 소득인정액을 뺀 금액을 중심으로 지원합니다.",
    applicationChannel: "복지로 또는 주소지 읍면동 주민센터",
    priority: "최우선",
    sourceLabel: "공식",
    sourceUrl: "https://mw.go.kr/menu.es?mid=a10708010300",
    updatedAt: "2026년 기준",
    notes: ["실제 지급액은 소득·재산 조사와 가구 특성에 따라 달라질 수 있습니다."],
  },
  {
    id: "medical-benefit",
    group: "basic",
    name: "의료급여",
    target: "소득인정액이 기준 중위소득 40% 이하인 가구",
    incomeCriteria: "중위 40% 이하",
    supportType: "서비스",
    supportSummary: "의료비 본인부담을 낮춰주는 기초생활보장 급여입니다.",
    applicationChannel: "복지로 또는 주소지 읍면동 주민센터",
    priority: "최우선",
    sourceLabel: "공식",
    sourceUrl: "https://mw.go.kr/menu.es?mid=a10708010300",
    updatedAt: "2026년 기준",
    notes: ["부양의무자 기준 등 별도 확인이 필요할 수 있습니다."],
  },
  {
    id: "housing-benefit",
    group: "basic",
    name: "주거급여",
    target: "소득인정액이 기준 중위소득 48% 이하인 임차·자가 가구",
    incomeCriteria: "중위 48% 이하",
    supportType: "현금·수선",
    supportSummary: "임차료 또는 자가 수선유지비를 지원합니다.",
    applicationChannel: "복지로 또는 주소지 읍면동 주민센터",
    priority: "최우선",
    sourceLabel: "공식",
    sourceUrl: "https://mw.go.kr/menu.es?mid=a10708010300",
    updatedAt: "2026년 기준",
    notes: ["지역과 가구원 수별 기준임대료는 별도 확인이 필요합니다."],
  },
  {
    id: "education-benefit",
    group: "basic",
    name: "교육급여",
    target: "소득인정액이 기준 중위소득 50% 이하인 학생 가구",
    incomeCriteria: "중위 50% 이하",
    supportType: "바우처",
    supportSummary: "학생 교육활동지원비 등 교육비 부담을 줄여주는 급여입니다.",
    applicationChannel: "복지로 또는 교육청 안내",
    priority: "높음",
    sourceLabel: "공식",
    sourceUrl: "https://mw.go.kr/menu.es?mid=a10708010300",
    updatedAt: "2026년 기준",
    notes: ["학생 자녀가 있는 가구는 교육비 지원과 함께 확인하세요."],
  },
  {
    id: "near-poor",
    group: "low-income",
    name: "차상위계층 혜택",
    target: "수급자는 아니지만 소득이 낮은 가구",
    incomeCriteria: "대체로 중위 50% 안팎",
    supportType: "감면·바우처",
    supportSummary: "의료비 경감, 통신비·전기요금 감면, 문화·에너지 바우처 등으로 이어질 수 있습니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["혜택 항목마다 세부 기준이 달라 개별 확인이 필요합니다."],
  },
  {
    id: "emergency-welfare",
    group: "low-income",
    name: "긴급복지지원",
    target: "실직, 질병, 폐업, 화재 등 갑작스러운 위기 가구",
    incomeCriteria: "위기 사유와 소득·재산 기준 동시 확인",
    supportType: "현금·서비스",
    supportSummary: "생계, 의료, 주거 등 긴급한 생활 안정을 지원합니다.",
    applicationChannel: "주민센터 또는 보건복지상담센터",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["위기 사유 증빙이 중요합니다."],
  },
  {
    id: "single-parent",
    group: "family",
    name: "한부모가족 지원",
    target: "아동을 양육하는 한부모·조손가족",
    incomeCriteria: "한부모가족 별도 소득 기준",
    supportType: "현금·감면",
    supportSummary: "아동양육비, 학용품비, 생활보조 성격의 지원을 확인할 수 있습니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["자녀 연령과 가구 소득 기준을 함께 확인하세요."],
  },
  {
    id: "multi-child",
    group: "family",
    name: "다자녀 지원",
    target: "자녀 2~3명 이상 가구",
    incomeCriteria: "지자체·사업별 상이",
    supportType: "감면·서비스",
    supportSummary: "공공요금, 교육, 주거, 교통 분야에서 추가 혜택을 확인할 수 있습니다.",
    applicationChannel: "정부24, 지자체, 주민센터",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "지역별 공고 확인 필요",
    notes: ["다자녀 기준은 지역마다 다를 수 있습니다."],
  },
  {
    id: "child-allowance",
    group: "family",
    name: "아동수당",
    target: "아동 양육 가구",
    incomeCriteria: "보편 지원 성격",
    supportType: "현금",
    supportSummary: "아동 양육에 필요한 현금성 지원입니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "높음",
    sourceLabel: "공식",
    updatedAt: "2026년 기준",
    notes: ["연령 기준과 지급 대상은 신청 시점 기준으로 확인하세요."],
  },
  {
    id: "parent-benefit",
    group: "family",
    name: "부모급여",
    target: "영아를 양육하는 가구",
    incomeCriteria: "보편 지원 성격",
    supportType: "현금",
    supportSummary: "영아기 양육비 부담을 줄이기 위한 대표 지원입니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "높음",
    sourceLabel: "공식",
    updatedAt: "2026년 기준",
    notes: ["보육서비스 이용 여부에 따라 실제 수령 구조가 달라질 수 있습니다."],
  },
  {
    id: "youth-savings",
    group: "youth",
    name: "청년도약계좌",
    target: "자산 형성을 원하는 청년",
    incomeCriteria: "개인·가구 소득 기준 확인",
    supportType: "금융",
    supportSummary: "저축액에 정부기여금과 비과세 혜택을 결합한 청년 자산형성 상품입니다.",
    applicationChannel: "취급 금융기관",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["개편 여부와 납입 조건은 매년 공고를 확인하세요."],
  },
  {
    id: "youth-rent",
    group: "youth",
    name: "청년월세지원",
    target: "무주택 청년",
    incomeCriteria: "청년 본인·원가구 소득 기준 확인",
    supportType: "현금",
    supportSummary: "월세 부담이 큰 청년에게 일정 기간 월세 일부를 지원합니다.",
    applicationChannel: "복지로 또는 지자체",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["보증금, 월세, 연령, 거주 요건을 함께 확인하세요."],
  },
  {
    id: "youth-tomorrow",
    group: "youth",
    name: "청년내일저축계좌",
    target: "근로 중인 저소득 청년",
    incomeCriteria: "근로소득과 가구 소득 기준",
    supportType: "금융",
    supportSummary: "본인 저축에 정부 매칭 지원을 더해 목돈 형성을 돕습니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["근로 유지와 교육 이수 등 유지 조건이 있을 수 있습니다."],
  },
  {
    id: "job-support",
    group: "youth",
    name: "국민취업지원제도",
    target: "구직자와 저소득층",
    incomeCriteria: "유형별 소득·재산 기준",
    supportType: "현금·서비스",
    supportSummary: "구직촉진수당과 취업지원서비스를 함께 확인할 수 있습니다.",
    applicationChannel: "고용센터 또는 국민취업지원제도 누리집",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["취업 상태와 구직활동 계획이 중요합니다."],
  },
  {
    id: "disability-pension",
    group: "disability",
    name: "장애인연금",
    target: "중증장애인",
    incomeCriteria: "소득·재산 기준 확인",
    supportType: "현금",
    supportSummary: "소득 보전과 추가 비용 부담 완화를 위한 현금성 지원입니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["장애 정도와 소득인정액 기준을 함께 확인하세요."],
  },
  {
    id: "disability-allowance",
    group: "disability",
    name: "장애수당",
    target: "등록장애인",
    incomeCriteria: "기초·차상위 등 별도 기준",
    supportType: "현금",
    supportSummary: "장애로 인한 생활비 부담을 일부 보조합니다.",
    applicationChannel: "복지로 또는 주민센터",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["장애인연금과 중복 가능 여부를 확인하세요."],
  },
  {
    id: "basic-pension",
    group: "senior",
    name: "기초연금",
    target: "만 65세 이상 어르신",
    incomeCriteria: "소득인정액 선정기준 확인",
    supportType: "현금",
    supportSummary: "노후 소득 보전을 위한 대표 지원입니다.",
    applicationChannel: "복지로, 국민연금공단, 주민센터",
    priority: "높음",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["국민연금 수급액과 부부 가구 여부에 따라 감액될 수 있습니다."],
  },
  {
    id: "energy-voucher",
    group: "voucher",
    name: "에너지바우처",
    target: "취약계층 중 냉난방비 부담이 큰 가구",
    incomeCriteria: "수급자격과 세대원 특성 확인",
    supportType: "바우처",
    supportSummary: "전기, 가스, 지역난방 등 에너지 비용 부담을 줄입니다.",
    applicationChannel: "주민센터 또는 에너지바우처 공식 안내",
    priority: "계절성",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.energyv.or.kr",
    updatedAt: "시즌별 공고 확인 필요",
    notes: ["신청 기간과 사용 기간을 놓치지 않는 것이 중요합니다."],
  },
  {
    id: "culture-card",
    group: "voucher",
    name: "문화누리카드",
    target: "기초생활수급자·차상위계층 등",
    incomeCriteria: "수급·차상위 여부 확인",
    supportType: "바우처",
    supportSummary: "문화, 여행, 체육 활동에 사용할 수 있는 카드형 지원입니다.",
    applicationChannel: "문화누리카드 누리집 또는 주민센터",
    priority: "상황별",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.mnuri.kr",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["연간 지원금과 자동재충전 여부를 확인하세요."],
  },
  {
    id: "food-support",
    group: "voucher",
    name: "식품바우처·푸드뱅크",
    target: "취약계층",
    incomeCriteria: "지역·사업별 기준 확인",
    supportType: "바우처·현물",
    supportSummary: "식료품 구매 또는 기부식품 지원으로 생활비를 낮출 수 있습니다.",
    applicationChannel: "주민센터, 지자체, 푸드뱅크",
    priority: "상황별",
    sourceLabel: "확인 필요",
    updatedAt: "지역별 공고 확인 필요",
    notes: ["전국 공통 사업과 지역 시범사업을 분리해 확인하세요."],
  },
  {
    id: "local-support",
    group: "region",
    name: "지자체 추가 지원금",
    target: "거주 지역별 취약계층·청년·가족",
    incomeCriteria: "지자체 조례와 공고 기준",
    supportType: "혼합",
    supportSummary: "서울, 경기 등 지역별로 긴급지원, 청년수당, 교통비, 돌봄 지원이 추가될 수 있습니다.",
    applicationChannel: "지자체 누리집 또는 주민센터",
    priority: "확인",
    sourceLabel: "확인 필요",
    updatedAt: "지역별 공고 확인 필요",
    notes: ["예산 소진과 공고 기간에 따라 신청 가능 여부가 빠르게 달라집니다."],
  },
];

export const GWB_AUDIENCE_RECOMMENDATIONS: AudienceRecommendation[] = [
  {
    id: "low-income-single",
    audience: "소득이 낮은 1인 가구",
    firstCheck: ["생계급여", "주거급여", "긴급복지지원"],
    reason: "소득인정액이 낮다면 생계·주거급여를 먼저 확인하고, 최근 위기 사유가 있으면 긴급복지도 함께 확인하세요.",
    ctaLabel: "수급자격 계산하기",
    ctaHref: "/tools/welfare-benefit-eligibility/",
  },
  {
    id: "young-renter",
    audience: "월세 사는 청년",
    firstCheck: ["청년월세지원", "주거급여", "청년도약계좌"],
    reason: "주거비 부담이 큰 청년은 월세 지원과 자산형성 상품의 소득 기준을 나누어 비교하는 것이 좋습니다.",
    ctaLabel: "청년 지원 비교",
    ctaHref: "#youth-benefits",
  },
  {
    id: "single-parent-family",
    audience: "자녀 있는 한부모",
    firstCheck: ["한부모가족 지원", "교육급여", "문화누리카드"],
    reason: "한부모가족 지원은 기초생활보장과 별도 기준으로 확인할 수 있어 자녀 연령과 소득 기준을 함께 보세요.",
    ctaLabel: "가족 지원 확인",
    ctaHref: "#family-benefits",
  },
  {
    id: "disabled-household",
    audience: "중증장애인 가구",
    firstCheck: ["장애인연금", "의료급여", "에너지바우처"],
    reason: "장애인연금과 의료·에너지 지원은 생활비 부담을 직접 줄이는 핵심 제도입니다.",
    ctaLabel: "장애 지원 확인",
    ctaHref: "#family-benefits",
  },
  {
    id: "senior-alone",
    audience: "노인 단독 가구",
    firstCheck: ["기초연금", "생계급여", "의료급여"],
    reason: "기초연금 수급 여부와 별개로 소득인정액에 따라 생계·의료급여도 확인할 수 있습니다.",
    ctaLabel: "노후 지원 확인",
    ctaHref: "#family-benefits",
  },
];

export const GWB_APPLICATION_CHECKLIST: ApplicationChecklist[] = [
  { id: "id-card", label: "신분증", description: "주민등록증, 운전면허증 등 본인 확인 서류", requiredFor: ["공통"] },
  { id: "bankbook", label: "통장 사본", description: "급여·지원금 지급 계좌 확인용", requiredFor: ["현금성 급여", "일부 바우처"] },
  { id: "lease", label: "임대차계약서", description: "주거급여, 청년월세지원 등 주거비 지원 신청 시 필요", requiredFor: ["주거급여", "청년월세지원"] },
  { id: "family", label: "가족관계증명서", description: "가구원, 한부모, 다자녀, 조손 관계 확인", requiredFor: ["한부모", "가족 지원", "교육급여"] },
  { id: "income-asset", label: "소득·재산 확인 자료", description: "근로소득, 사업소득, 금융재산, 부채 확인", requiredFor: ["기초생활보장", "차상위", "청년 자산형성"] },
  { id: "crisis", label: "위기 사유 증빙", description: "실직, 질병, 폐업, 화재 등 긴급복지 신청 사유", requiredFor: ["긴급복지"] },
];

export const GWB_CHANGE_ITEMS = [
  { id: "median-income", title: "기준 중위소득 인상", desc: "2026년 4인 가구 기준 중위소득은 6,494,738원으로 2025년 대비 6.51% 올랐습니다.", label: "공식", impact: "high" },
  { id: "livelihood-line", title: "생계급여 선정기준 상승", desc: "4인 가구 생계급여 기준은 월 2,078,316원입니다. 소득인정액 기준으로 경계에 있던 가구는 다시 확인할 필요가 있습니다.", label: "공식", impact: "high" },
  { id: "youth-policy", title: "청년 자산형성 공고 확인", desc: "청년도약계좌와 청년내일저축계좌는 연도별 운영 조건이 바뀔 수 있어 신청 전 공고 확인이 필요합니다.", label: "확인 필요", impact: "medium" },
  { id: "vouchers", title: "바우처 금액·기간 확인", desc: "에너지·문화·식품 바우처는 예산, 신청 기간, 사용 기간이 제도별로 다릅니다.", label: "확인 필요", impact: "medium" },
];

export const GWB_SOURCE_LINKS = [
  {
    source: "보건복지부",
    title: "2026년 기준 중위소득 보도자료",
    href: "https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1487098&mid=a10503000000",
    desc: "2026년 기준 중위소득과 기초생활보장 급여별 선정기준",
  },
  {
    source: "보건복지부",
    title: "수급자 선정기준 안내",
    href: "https://mw.go.kr/menu.es?mid=a10708010300",
    desc: "생계·의료·주거·교육급여 선정기준",
  },
  {
    source: "복지로",
    title: "복지서비스 통합 조회",
    href: "https://www.bokjiro.go.kr",
    desc: "복지급여 신청, 서비스 안내, 모의계산",
  },
  {
    source: "문화누리카드",
    title: "문화누리카드 공식 안내",
    href: "https://www.mnuri.kr",
    desc: "문화·여행·체육 바우처 신청과 사용처 안내",
  },
  {
    source: "에너지바우처",
    title: "에너지바우처 공식 안내",
    href: "https://www.energyv.or.kr",
    desc: "전기·가스·난방비 바우처 신청 기준",
  },
];

export const GWB_FAQ = [
  {
    question: "2026년 4인 가구 기준 중위소득은 얼마인가요?",
    answer: "2026년 4인 가구 기준 중위소득은 월 6,494,738원입니다. 2025년 6,097,773원에서 6.51% 인상되었습니다.",
  },
  {
    question: "생계급여와 주거급여를 동시에 받을 수 있나요?",
    answer: "가능할 수 있습니다. 다만 각 급여의 선정기준과 조사 항목이 다르며 실제 수급 여부는 소득인정액과 가구 상황을 기준으로 결정됩니다.",
  },
  {
    question: "기초생활수급자가 아니어도 받을 수 있는 지원금이 있나요?",
    answer: "네. 차상위계층 혜택, 한부모가족 지원, 청년월세지원, 에너지바우처, 문화누리카드, 지자체 긴급지원 등 별도 기준으로 확인할 수 있는 제도가 있습니다.",
  },
  {
    question: "청년 지원금은 부모 소득도 보나요?",
    answer: "제도마다 다릅니다. 청년도약계좌, 청년월세지원, 청년내일저축계좌는 개인 소득과 가구 소득 기준이 각각 다르게 적용될 수 있어 신청 전 공식 공고를 확인해야 합니다.",
  },
  {
    question: "차상위계층과 기초생활수급자는 무엇이 다른가요?",
    answer: "기초생활수급자는 생계·의료·주거·교육급여 대상이 되는 저소득 가구이고, 차상위계층은 수급자 기준은 넘지만 소득이 낮아 감면·바우처·의료비 경감 등 일부 지원을 받을 수 있는 계층입니다.",
  },
  {
    question: "정부지원금은 어디에서 신청하나요?",
    answer: "대부분 복지로, 정부24, 주소지 읍면동 주민센터에서 확인할 수 있습니다. 청년 자산형성 상품처럼 금융기관이나 전담 기관을 통해 신청하는 제도도 있습니다.",
  },
  {
    question: "지역별 추가 지원금은 어떻게 확인하나요?",
    answer: "거주 지자체 누리집, 복지로 지역서비스, 주민센터 상담으로 확인하는 것이 가장 정확합니다. 지역 지원은 예산 소진이나 공고 기간에 따라 빠르게 달라질 수 있습니다.",
  },
  {
    question: "수급 기준을 조금 넘으면 아무 지원도 못 받나요?",
    answer: "아닙니다. 기준을 조금 넘는 경우에도 차상위, 긴급복지, 지자체 지원, 청년·가족·장애 특화 지원을 확인해볼 수 있습니다.",
  },
];

export const GWB_RELATED_LINKS = [
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기", desc: "가구원 수, 소득, 재산을 입력해 급여별 가능성을 간이 확인" },
  { href: "/tools/daycare-vs-kindergarten-cost/", label: "어린이집 vs 유치원 비용 계산기", desc: "자녀 양육비와 교육급여 맥락 연결" },
  { href: "/reports/daycare-kindergarten-cost-2026/", label: "2026 어린이집·유치원 비용 리포트", desc: "육아 가구 생활비 부담 분석" },
  { href: "/reports/newlywed-cost-2026/", label: "2026 신혼부부 생활비 리포트", desc: "가구 생활비와 주거비 맥락" },
  { href: "/tools/newlywed-rent-vs-buy/", label: "신혼부부 전월세 vs 매매 계산기", desc: "주거비 부담과 주거급여 맥락" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급금 계산기", desc: "소득·세금·지원금 흐름 연결" },
];

export const GWB_SEO_CONTENT = {
  introTitle: "2026 정부 복지지원금 완전 정복은 기준 중위소득부터 신청 서류까지 한 번에 정리한 가이드입니다",
  intro: [
    "정부 복지지원금은 제도마다 소득기준, 신청처, 지원 방식이 다릅니다. 생계급여처럼 현금으로 지급되는 제도도 있고, 문화누리카드나 에너지바우처처럼 사용처가 정해진 바우처도 있습니다. 이 리포트는 2026년에 먼저 확인해야 할 핵심 복지제도 20개를 한 화면에서 비교하도록 정리했습니다.",
    "2026년 4인 가구 기준 중위소득은 월 6,494,738원입니다. 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다. 같은 가구라도 생계급여는 어렵지만 주거급여나 교육급여는 확인할 수 있는 경우가 있습니다.",
    "기초생활수급자가 아니어도 확인할 수 있는 지원은 많습니다. 차상위계층 혜택, 한부모가족 지원, 청년월세지원, 청년도약계좌, 국민취업지원제도, 에너지바우처, 문화누리카드, 지자체 긴급지원처럼 별도 기준으로 신청 가능한 제도가 있습니다.",
    "지원금 신청에서 중요한 것은 신청처와 서류입니다. 대부분의 복지급여는 복지로 또는 주민센터에서 확인할 수 있지만 청년 자산형성 상품은 금융기관, 취업지원 제도는 고용센터를 통해 신청하는 경우가 있습니다. 임대차계약서, 통장 사본, 가족관계증명서, 소득·재산 확인 자료를 미리 준비하면 상담이 빨라집니다.",
    "이 리포트는 2026년 기준값과 제도별 공고를 바탕으로 작성한 참고 자료입니다. 실제 수급 여부와 지원금액은 소득·재산 조사, 가구 특성, 지자체 예산, 신청 시점에 따라 달라질 수 있습니다. 본인 가구 기준으로 먼저 확인하려면 복지급여 수급 자격 계산기를 함께 사용하세요.",
  ],
  inputPoints: [
    "2026년 기준 중위소득과 생계·의료·주거·교육급여 선정기준을 확인할 수 있습니다.",
    "청년·한부모·장애인·노인·바우처 지원을 한 페이지에서 비교할 수 있습니다.",
    "신청 전 준비해야 할 공통 서류와 수급 탈락 시 대체 지원을 확인할 수 있습니다.",
  ],
  criteria: [
    "기준 중위소득과 기초생활보장 선정기준은 2026년 기준값을 사용합니다.",
    "청년·바우처·지역 지원은 제도별 공식 공고 확인이 필요합니다.",
    "예상 혜택과 우선순위는 이해를 돕기 위한 참고 정보입니다.",
    "실제 신청과 최종 판정은 복지로, 정부24, 주민센터, 전담기관에서 확인해야 합니다.",
  ],
};
