export const RTR_META = {
  slug: "real-estate-tax-reform-2026",
  title: "2026 부동산 세제개편안 확정 발표 정리",
  description:
    "정부가 2026년 8월 3일 발표한 부동산 세제개편안을 정리했습니다. 종부세 공정시장가액비율·기본공제 실거주 차등화, 장기보유특별공제 거주 중심 개편, 다주택 양도세 중과 한시 완화까지 확인하세요.",
  seoTitle: "2026 부동산 세제개편안 발표 | 종부세·장특공제 확정 내용",
  seoDescription:
    "정부가 2026년 8월 3일 발표한 부동산 세제개편안을 정리했습니다. 종부세 공정시장가액비율·기본공제 실거주 차등화, 장기보유특별공제 거주 중심 개편, 다주택 양도세 중과 한시 완화까지 확인하세요.",
  updatedAt: "2026-08-05",
  policyStatus: "GOVERNMENT_ANNOUNCED" as const,
  policyStatusLabel: "정부 세제개편안 발표",
  nextMilestone:
    "종합부동산세법·소득세법·지방세법 등 관련 세법 개정안이 국회에 제출되어 심의·의결 절차를 거칠 예정 (법안별 시행 시기 상이)",
  dataNote:
    "이 페이지는 2026년 8월 3일 정부가 발표한 세제개편안(정부안)을 바탕으로 정리한 자료입니다. 아직 국회를 통과한 확정 법률이 아니므로, 심의 과정에서 세율·공제금액·시행일이 바뀔 수 있습니다.",
};

export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};

export const RTR_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부·전문가 의견수렴", dateLabel: "2026년 7월", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_REVIEW", label: "대통령 주재 종합토론회", dateLabel: "2026년 7월 23일", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부 세제개편안 발표", dateLabel: "2026년 8월 3일", isCurrent: true, isDone: true },
  { status: "BILL_SUBMITTED", label: "관련 세법·시행령 개정안 국회 제출", dateLabel: "항목별 절차 진행 예정", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 심의 및 의결", dateLabel: "법률 개정 사항에 한함", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "2027~2029년 항목별 단계 시행 예정", isCurrent: false, isDone: false },
];

/**
 * "전문가 제언" = 토론회 참석 전문가 개인 의견, 정부 확정 방침 아님
 * "정부·국회 논의" = 대통령·정부 인사가 방향성을 언급한 사안
 * "원칙 제시" = 구체안 없이 방향(원칙)만 언급된 사안
 * "전망 단계" = 언론·업계 예측 수준, 근거가 가장 약함
 */
export type PolicySourceType = "정부 발표안" | "전문가 제언" | "정부·국회 논의" | "원칙 제시" | "전망 단계";

export type ReviewItem = {
  id: string;
  category: string;
  current: string;
  reviewDirection: string;
  sourceType: PolicySourceType;
  sourceLabel: string;
  sourceUrl: string;
};

export const RTR_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "fair-market-ratio",
    category: "종부세 공정시장가액비율",
    current: "주택분 60%",
    reviewDirection: "일반 주택 70%, 3주택 이상·일부 조정대상지역 보유자는 최대 80%로 인상 발표",
    sourceType: "정부 발표안",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "tax-base-standard",
    category: "종부세 과세 기준",
    current: "주택 수와 가액을 함께 반영",
    reviewDirection: "주택 수 기준을 사실상 폐지하고 합산 공시가격(보유가액) 중심으로 일원화",
    sourceType: "정부 발표안",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "one-house-deduction",
    category: "1세대 1주택 종부세 기본공제",
    current: "공시가격 12억 원 (실거주·비거주 동일)",
    reviewDirection: "실거주 1주택 14억 원으로 확대, 비거주(전세·공실) 1주택은 9억 원으로 축소",
    sourceType: "정부 발표안",
    sourceLabel: "이데일리 · 세제개편안 비판 보도 (2026-08-04)",
    sourceUrl: "https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=06172966645544040",
  },
  {
    id: "high-price-rate",
    category: "종부세 세율 (과세표준 6억~12억 구간)",
    current: "1.0%",
    reviewDirection: "1.3%로 인상, 고가주택 중심 누진 강화",
    sourceType: "정부 발표안",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "long-term-deduction",
    category: "1세대 1주택 장기보유특별공제",
    current: "보유기간 연 4%·최대 40% + 거주기간 연 4%·최대 40%",
    reviewDirection: "보유공제는 축소·폐지 방향, 거주공제는 연 8%·최대 80%로 확대해 거주 중심으로 재설계",
    sourceType: "정부 발표안",
    sourceLabel: "재정경제부 · 2026년 세제개편안 문답자료",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "deduction-cap",
    category: "장기보유특별공제 공제금액 한도",
    current: "한도 없음",
    reviewDirection: "2028년 최대 20억 원, 2029년 이후 최대 10억 원으로 한도 신설",
    sourceType: "정부 발표안",
    sourceLabel: "뉴시스 · 2026 세제개편안 발표 (2026-08-03)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    id: "long-residence-basic-deduction",
    category: "10년 실거주 1주택 양도소득 기본공제",
    current: "연 250만 원",
    reviewDirection: "10년 이상 실거주·양도가액 30억 이하 조건 충족 시 최대 2,500만 원으로 확대",
    sourceType: "정부 발표안",
    sourceLabel: "KDI 경제정보센터 · 2026 세제개편안",
    sourceUrl: "https://eiec.kdi.re.kr/policy/callDownload.do?dtime=20260804151021&filenum=3&num=285041",
  },
  {
    id: "multi-house-transfer-surcharge",
    category: "다주택 양도세 중과",
    current: "조정대상지역 2주택 +20%p, 3주택 이상 +30%p (2026-05-09 재시행)",
    reviewDirection: "2027년 2주택 +5%p·3주택+ +10%p, 2028년 각각 +10%p·+15%p로 2년 한시 완화 후 2029년 원상복귀",
    sourceType: "정부 발표안",
    sourceLabel: "다음(언론사 종합) · 2026 세제개편안 양도세 정리",
    sourceUrl: "https://v.daum.net/v/11aes1tW5L",
  },
  {
    id: "acquisition-transfer-tax",
    category: "취득세 중과",
    current: "주택 수·지역에 따라 적용",
    reviewDirection: "이번 8월 3일 발표에는 취득세 중과 구조 변경 내용이 포함되지 않음",
    sourceType: "전망 단계",
    sourceLabel: "관련 보도 종합 (2026-08)",
    sourceUrl: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
];

/**
 * 2026년 세제개편 검토와는 별개로 이미 시행 중인 제도.
 * 인구감소지역 세컨드홈 특례는 2025-08 확대 시행됐으므로 위 RTR_REVIEW_ITEMS(검토 중 항목)에는 포함하지 않는다.
 */
export const RTR_CURRENT_POLICY = {
  title: "이미 시행 중인 제도 — 세제개편 검토안이 아닙니다",
  body:
    "비수도권 인구감소지역(및 인구감소 관심지역) 주택의 세컨드홈 특례 가액 기준은 2025년 8월 확대 시행되어 공시가격 9억 원 이하까지 적용됩니다. 수도권 일부 대상 지역은 4억 원 이하 기준이 유지됩니다. 이는 2026년 세제개편 검토와는 별개로, 이미 시행 중인 현행 제도입니다.",
  sourceLabel: "한국경제 (2025-08-17)",
  sourceUrl: "https://www.hankyung.com/article/2025081742506",
};

export type ImpactCard = {
  id: string;
  title: string;
  direction: "영향 제한 가능" | "부담 증가 가능" | "기준에 따라 다름" | "현재 특례 확인";
  summary: string;
};

export const RTR_IMPACT_BY_TYPE: ImpactCard[] = [
  {
    id: "one-house-resident",
    title: "실거주 1주택자",
    direction: "영향 제한 가능",
    summary:
      "종부세 기본공제가 12억 원에서 14억 원으로 확대되고, 장기보유특별공제도 거주기간 중심으로 개편돼 10년 이상 실거주자는 대체로 유리합니다. 다만 공시가격이 14억 원을 넘는 초고가 1주택은 세율 인상분의 영향을 받을 수 있습니다.",
  },
  {
    id: "one-house-non-resident",
    title: "비거주 1주택자 (전세·공실)",
    direction: "부담 증가 가능",
    summary:
      "실제 거주하지 않는 1주택자는 종부세 기본공제가 오히려 9억 원으로 줄고, 장기보유특별공제도 보유기간만으로는 공제받기 어려워집니다. 전입신고와 실제 거주 여부를 증빙할 수 있는지 미리 확인해야 합니다.",
  },
  {
    id: "low-price-multi-house",
    title: "저가주택 다주택자",
    direction: "기준에 따라 다름",
    summary:
      "종부세 기준이 주택 수에서 합산 공시가격 중심으로 바뀌면서, 지방 저가주택을 여러 채 보유한 경우 현재보다 종부세 부담이 줄어들 수 있습니다. 다만 취득세·양도세는 별도 기준이 적용되므로 세목별로 나눠 확인해야 합니다.",
  },
  {
    id: "high-price-house",
    title: "고가·초고가 주택 보유자",
    direction: "부담 증가 가능",
    summary:
      "공정시장가액비율 인상(70~80%)과 6억~12억 구간 세율 인상(1.0%→1.3%)이 겹치면서, 시가 32억 원 안팎부터는 종부세 부담이 늘어날 가능성이 큽니다. 3주택 이상 또는 조정대상지역 보유자는 80% 비율이 적용되는지 확인이 필요합니다.",
  },
  {
    id: "multi-house-seller",
    title: "매도를 고려 중인 다주택자",
    direction: "기준에 따라 다름",
    summary:
      "2027~2028년 2년간 다주택 양도세 중과가 한시적으로 완화됩니다(2주택 +5%p→+10%p, 3주택+ +10%p→+15%p). 2029년부터는 원래 중과세율로 복귀할 예정이므로, 매도 시점을 이 완화 구간에 맞출지 검토할 수 있습니다.",
  },
  {
    id: "population-decline-buyer",
    title: "인구감소지역 주택 매수자",
    direction: "현재 특례 확인",
    summary:
      "세컨드홈 특례 가액 기준(공시가격 9억 원 이하, 수도권 일부 4억 원 이하)은 이미 시행 중인 제도입니다. 이번 8월 3일 세제개편안과는 별개 사안이므로, 매수 예정 지역이 특례 대상인지와 취득일 기준을 먼저 확인하세요.",
  },
];

export type ExplainerCard = {
  id: string;
  question: string;
  answer: string;
};

export const RTR_EXPLAINERS: ExplainerCard[] = [
  {
    id: "fair-market-ratio-explainer",
    question: "공정시장가액비율이란? (재산세 vs 종부세 구분)",
    answer:
      "공정시장가액비율은 공시가격에서 과세표준을 계산할 때 곱하는 비율입니다. 지방세인 재산세와 국세인 종합부동산세에 각각 별도의 공정시장가액비율이 있어 혼동하기 쉽습니다. 이번 8월 3일 발표는 종부세 공정시장가액비율을 일반 주택 70%, 3주택 이상·일부 조정대상지역 보유자는 최대 80%로 인상하는 내용입니다. 재산세 공정시장가액비율은 이번 발표의 직접적인 변경 대상이 아닙니다.",
  },
  {
    id: "tax-base-explainer",
    question: "\"주택 수\" 기준과 \"보유가액\" 기준은 뭐가 다른가?",
    answer:
      "지금까지는 보유한 주택 수가 늘어나면 종부세 부담이 커지는 구조였습니다. 이번 개편안은 주택 수 기준을 사실상 폐지하고, 전체 보유 주택의 합산 공시가격(보유가액)을 기준으로 과세하도록 일원화합니다. 그 결과 지방 저가주택을 여러 채 보유한 경우 부담이 줄고, 주택 수는 적어도 합산가액이 큰 경우는 부담이 늘 수 있습니다.",
  },
  {
    id: "long-term-deduction-explainer",
    question: "장기보유특별공제는 왜 개편되나?",
    answer:
      "지금까지는 실거주 없이 오래 보유하기만 해도 공제를 받을 수 있어, 전세를 준 장기보유 고가주택도 상당한 공제를 받는 경우가 있었습니다. 개편안은 단순 보유기간에 따른 공제를 축소·폐지하는 방향이고, 실제 거주한 기간에 대한 공제는 연 8%·최대 80%로 확대합니다. 다만 이는 소득세법 개정 사안이라 국회 심의를 거쳐야 확정됩니다.",
  },
];

export type SimulationRow = {
  baseAmount: string;
  at60: string;
  at70: string;
  at80: string;
  increaseVs60: string;
};

export const RTR_FAIR_MARKET_SIMULATION: SimulationRow[] = [
  { baseAmount: "3억 원", at60: "1.8억 원", at70: "2.1억 원", at80: "2.4억 원", increaseVs60: "+33.3%" },
  { baseAmount: "5억 원", at60: "3억 원", at70: "3.5억 원", at80: "4억 원", increaseVs60: "+33.3%" },
  { baseAmount: "10억 원", at60: "6억 원", at70: "7억 원", at80: "8억 원", increaseVs60: "+33.3%" },
  { baseAmount: "20억 원", at60: "12억 원", at70: "14억 원", at80: "16억 원", increaseVs60: "+33.3%" },
];

export const RTR_SIMULATION_NOTE =
  "위 표는 과세표준(공시가격 반영분)만 계산한 값입니다. 과세표준은 최대 33.3% 증가하지만, 최종 세액이 그대로 그만큼 오르는 것은 아닙니다. 세율 구간, 세부담 상한, 세액공제에 따라 실제 증가율은 달라집니다. 정부는 이번 발표에서 일반 주택 70%, 3주택 이상·일부 조정대상지역 보유자는 80%를 적용한다고 밝혔으며, 앞선 언론 시뮬레이션에서는 특정 고가 단독주택 사례에서 비율 60%→80% 가정 시 보유세가 약 697만 원에서 808만 원으로 약 15.9% 증가하는 것으로 분석된 바 있습니다.";

export type ProcedureRow = { item: string; procedure: string; speed: string };

export const RTR_LAW_VS_DECREE: ProcedureRow[] = [
  { item: "종부세 공정시장가액비율 인상", procedure: "시행령 개정", speed: "국회 통과 없이 정부 절차만으로 가능" },
  { item: "종부세 1주택 기본공제 실거주 차등화", procedure: "종합부동산세법 개정 필요", speed: "국회 통과 필요" },
  { item: "종부세 세율 인상 (6억~12억 구간)", procedure: "종합부동산세법 개정 필요", speed: "국회 통과 필요" },
  { item: "장기보유특별공제 거주 중심 개편", procedure: "소득세법 개정 필요", speed: "국회 통과 필요" },
  { item: "다주택 양도세 중과 한시 완화", procedure: "소득세법 개정 필요", speed: "국회 통과 필요" },
  { item: "취득세 중과 구조", procedure: "이번 발표에 포함되지 않음", speed: "해당 없음" },
];

export type LtdRow = { period: string; holdingRate: string; residenceRate: string; total: string };

export const RTR_LTD_CURRENT: LtdRow[] = [
  { period: "3년", holdingRate: "12%", residenceRate: "12%", total: "24%" },
  { period: "5년", holdingRate: "20%", residenceRate: "20%", total: "40%" },
  { period: "7년", holdingRate: "28%", residenceRate: "28%", total: "56%" },
  { period: "10년 이상", holdingRate: "40%", residenceRate: "40%", total: "최대 80%" },
];

export const RTR_CHECKLIST: string[] = [
  "내 주택이 종부세 과세 대상인지 확인",
  "2026년 공시가격 확인",
  "전체 보유주택 합산 공시가격 계산 (주택 수보다 가액 중심)",
  "1세대 1주택이면 실제 거주 여부와 전입일 확인",
  "실제 거주기간과 단순 보유기간 구분",
  "3주택 이상·조정대상지역 보유 시 공정시장가액비율 80% 적용 여부 확인",
  "양도 예정이라면 현재 장특공제율과 개편안 예정 공제율을 함께 계산",
  "다주택 매도 계획이 있다면 2027~2028년 한시 완화 구간 활용 검토",
  "국회 심의 일정과 법안별 시행일 확인",
  "국회 통과 전에는 확정 세법으로 판단하지 않기",
];

export type FaqItem = { question: string; answer: string };

export const RTR_FAQ: FaqItem[] = [
  {
    question: "2026 부동산 세제개편안은 확정된 건가요?",
    answer:
      "정부는 2026년 8월 3일 세제개편안을 발표했습니다. 다만 이는 정부 발표안일 뿐 아직 국회를 통과한 확정 법률이 아닙니다. 종합부동산세법·소득세법 등 관련 세법 개정안이 국회에 제출돼 심의·의결을 거쳐야 하며, 이 과정에서 세율·공제금액·시행일이 바뀔 수 있습니다.",
  },
  {
    question: "종부세 공정시장가액비율이 60%에서 70~80%로 오르면 세금도 그만큼 오르나요?",
    answer:
      "반드시 그렇지는 않습니다. 공정시장가액비율이 오르면 과세표준 자체는 최대 33.3% 늘어나지만, 최종 세금은 과세표준 구간, 적용 세율, 세부담 상한, 고령자·장기보유 세액공제 등에 따라 달라집니다. 애초에 종부세 과세 대상이 아닌 주택은 이 비율 인상의 직접적인 영향을 받지 않습니다.",
  },
  {
    question: "실거주 1주택자도 세금이 오르나요?",
    answer:
      "실거주 1주택자는 종부세 기본공제가 12억 원에서 14억 원으로 확대돼 대체로 유리해집니다. 다만 공시가격 14억 원을 넘는 초고가 1주택은 세율 인상(6억~12억 구간 1.0%→1.3%)의 영향을 받을 수 있습니다.",
  },
  {
    question: "전세를 주거나 비워둔 1주택자는 어떻게 되나요?",
    answer:
      "비거주 1주택자는 종부세 기본공제가 오히려 9억 원으로 축소됩니다. 실제 거주하지 않으면 장기보유특별공제도 거주기간 공제를 받기 어려워, 같은 1주택자라도 실거주 여부에 따라 세 부담이 크게 달라질 수 있습니다.",
  },
  {
    question: "다주택자는 무조건 불리해지나요?",
    answer:
      "아닙니다. 종부세는 주택 수 기준이 폐지되고 합산 공시가격 기준으로 바뀌어, 지방 저가주택을 여러 채 보유한 경우 부담이 줄어들 수 있습니다. 반대로 고가주택 여러 채 또는 한 채라도 초고가라면 부담이 늘 수 있습니다. 또한 2027~2028년에는 양도세 중과가 한시적으로 완화됩니다.",
  },
  {
    question: "다주택 양도세 중과 완화는 언제까지인가요?",
    answer:
      "2027년 조정대상지역 2주택 +5%p·3주택 이상 +10%p, 2028년 각각 +10%p·+15%p로 2년간 한시 완화되며, 2029년부터는 기존 중과세율(2주택 +20%p, 3주택 이상 +30%p)로 복귀할 예정입니다. 이는 소득세법 개정 사안이라 국회 통과가 필요합니다.",
  },
  {
    question: "장기보유특별공제는 바로 바뀌나요?",
    answer:
      "장기보유특별공제 변경은 소득세법 개정이 필요한 사안입니다. 정부안에 포함됐더라도 국회 심의와 의결을 거쳐야 하므로 발표 즉시 바뀌지 않습니다. 시행일과 기존 보유자에 대한 경과규정도 최종 개정안을 확인해야 합니다.",
  },
  {
    question: "2026년에 집을 팔 계획이면 기다리는 게 좋나요?",
    answer:
      "세제개편안만으로 매도 시점을 결정하기는 어렵습니다. 취득가액, 예상 양도가액, 실제 거주기간, 보유기간, 필요경비에 따라 현재 제도에서도 세액 차이가 크게 발생합니다. 현행 기준 양도세를 먼저 계산한 뒤, 국회 통과 이후 확정될 개편안과 경과규정을 비교하는 것이 안전합니다.",
  },
];

export type RelatedLink = { label: string; href: string; desc: string };

export const RTR_RELATED_LINKS: RelatedLink[] = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공정시장가액비율을 직접 조정해 재산세·종부세를 계산합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "장기보유특별공제를 반영한 양도세를 계산합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "매수 시 취득세를 미리 계산합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·보유세·양도세 구조를 단계별로 정리한 심층 리포트입니다.",
  },
  {
    label: "2026 재산세 납부기간 총정리",
    href: "/reports/property-tax-payment-2026/",
    desc: "재산세 납부 일정과 6월 1일 과세기준일을 확인합니다.",
  },
];

export type SourceTableRow = {
  date: string;
  source: string;
  content: string;
  nature: string;
  url: string;
};

export const RTR_SOURCE_TABLE: SourceTableRow[] = [
  {
    date: "2026-08-03",
    source: "뉴시스",
    content: "초고가·비거주 주택 종부세 인상, 2028년까지 다주택 매도 기회 부여 등 세제개편안 발표 내용",
    nature: "정부 발표 · 언론 보도",
    url: "https://www.newsis.com/view/NISX20260803_0003733454",
  },
  {
    date: "2026-08-03",
    source: "재정경제부 2026년 세제개편안 문답자료",
    content: "장기보유특별공제 거주 중심 개편, 종부세 기본공제·세율 변경 등 공식 문답자료",
    nature: "정부 공식 자료",
    url: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    date: "2026-08-04",
    source: "이데일리",
    content: "\"너무 복잡해진 세법\" 부동산 세제개편안에 대한 비판·시장 반응 보도",
    nature: "언론 보도",
    url: "https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=06172966645544040",
  },
  {
    date: "2026-08-04",
    source: "KDI 경제정보센터",
    content: "2026 세제개편안 요약 자료",
    nature: "공공기관 자료",
    url: "https://eiec.kdi.re.kr/policy/callDownload.do?dtime=20260804151021&filenum=3&num=285041",
  },
  {
    date: "2026-08-03",
    source: "다음(언론사 종합)",
    content: "양도세 혜택 '보유'에서 '거주'로, 장특공제 공제한도 신설 등 양도세 개편 정리",
    nature: "언론 보도",
    url: "https://v.daum.net/v/11aes1tW5L",
  },
  {
    date: "2026-02-12",
    source: "연합뉴스",
    content: "5월 9일부터 최고 82.5% 다주택 양도세 중과 재시행, 계약 시 4~6개월 유예 안내",
    nature: "언론 보도",
    url: "https://www.yna.co.kr/view/AKR20260212075351002",
  },
  {
    date: "2026-07-16",
    source: "재정경제부 부동산 세제 국민 의견 경청 토론회",
    content: "종부세 가액 기준 전환, 장특공제 실거주 중심 개편 관련 전문가 제언",
    nature: "공식 토론회",
    url: "https://moef.go.kr/nw/nes/nesdta.do?bbsId=MOSFBBS_000000000028&menuNo=4010100",
  },
  {
    date: "2026-07-16",
    source: "연합뉴스",
    content: "\"종부세, 주택수 아닌 가액으로…장특공제는 거주 중심\" 토론회 보도",
    nature: "언론 보도",
    url: "https://www.yna.co.kr/view/AKR20260716101651002",
  },
  {
    date: "2026-06-25",
    source: "연합뉴스",
    content: "공정시장가액비율 60%→80% 가정 시 보유세 시뮬레이션",
    nature: "언론·전문가 분석",
    url: "https://www.yna.co.kr/view/AKR20260625043700003",
  },
  {
    date: "2026-07-10",
    source: "파이낸셜뉴스 등",
    content: "7월 23일 대통령 주재 부동산 대토론회, 8월 초 세제개편안 공개 계획 보도",
    nature: "언론 보도",
    url: "https://www.fnnews.com/news/202607101151492797",
  },
  {
    date: "2026-04-24",
    source: "한겨레",
    content: "대통령 \"실거주 기간 양도세 감면 확대, 비거주는 축소\" 발언",
    nature: "정책 발언",
    url: "https://www.hani.co.kr/arti/politics/politics_general/1255808.html",
  },
  {
    date: "현행",
    source: "국가법령정보센터 (지방세법 시행령)",
    content: "재산세 공정시장가액비율 규정",
    nature: "현행 법령",
    url: "https://www.law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=120262",
  },
  {
    date: "2025-08-17",
    source: "한국경제",
    content: "인구감소지역 세컨드홈 특례 공시가격 9억 원으로 확대 시행",
    nature: "현행 제도 (시행 완료)",
    url: "https://www.hankyung.com/article/2025081742506",
  },
];
