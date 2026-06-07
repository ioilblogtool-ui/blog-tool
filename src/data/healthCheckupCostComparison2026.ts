export const HEALTH_CHECKUP_COST_COMPARISON_SLUG = "health-checkup-cost-comparison-2026";

export type CostBasis = "official" | "estimate" | "private";

export interface CheckupSummaryCard {
  label: string;
  value: string;
  desc: string;
  basis: CostBasis;
}

export interface CheckupComparisonRow {
  type: string;
  target: string;
  outOfPocket: string;
  included: string;
  strength: string;
  limit: string;
  recommendation: string;
  basis: CostBasis;
}

export interface AddonExamRow {
  exam: string;
  why: string;
  nationalRoute: string;
  privateRange: string;
  checkBeforeBooking: string;
}

export interface ScenarioRow {
  persona: string;
  recommendedRoute: string;
  expectedCost: string;
  reason: string;
  avoid: string;
}

export interface PregnancyCheckupRow {
  period: string;
  coreExams: string;
  checkupDecision: string;
  costMemo: string;
}

export interface SourceRow {
  label: string;
  organization: string;
  href: string;
  note: string;
}

export const healthCheckupSummaryCards: CheckupSummaryCard[] = [
  {
    label: "국가 일반건강검진",
    value: "0원",
    desc: "대상자라면 기본 검사항목 비용은 국민건강보험공단이 부담합니다.",
    basis: "official",
  },
  {
    label: "국가암검진",
    value: "0원 또는 10%",
    desc: "암종과 소득 기준에 따라 무료 또는 검진비의 일부 본인부담이 발생합니다.",
    basis: "official",
  },
  {
    label: "사설 기본 종합검진",
    value: "30만~60만 원",
    desc: "위내시경, 복부초음파, 종양표지자 등 국가검진보다 넓은 패키지입니다.",
    basis: "estimate",
  },
  {
    label: "사설 정밀·프리미엄",
    value: "80만~250만 원+",
    desc: "CT, MRI/MRA, 심장·뇌혈관, PET-CT 선택 여부에 따라 비용이 크게 뛰어납니다.",
    basis: "estimate",
  },
];

export const healthCheckupComparisonRows: CheckupComparisonRow[] = [
  {
    type: "국가 일반건강검진",
    target: "지역가입자 세대주, 직장가입자, 20세 이상 세대원·피부양자 등 공단 대상자",
    outOfPocket: "기본 검진 0원",
    included: "문진, 신체계측, 혈압, 시력·청력, 흉부 X-ray, 혈액·소변검사, 구강검진, 성·연령별 검사",
    strength: "가성비가 압도적이고 고혈압·당뇨·이상지질혈증 같은 만성질환 선별에 강합니다.",
    limit: "초음파, CT, MRI, 수면내시경, 종양표지자 같은 항목은 기본적으로 포함되지 않습니다.",
    recommendation: "20~30대 무증상 직장인은 국가검진을 먼저 받고 가족력·증상에 따라 항목을 더하는 방식이 효율적입니다.",
    basis: "official",
  },
  {
    type: "국가암검진",
    target: "암종별 연령·주기 대상자. 위암·대장암·간암·유방암·자궁경부암·폐암 대상이 다릅니다.",
    outOfPocket: "무료 또는 10% 부담",
    included: "위내시경/위장조영, 분변잠혈검사, 유방촬영, 자궁경부세포검사 등 암종별 지정 항목",
    strength: "연령대별 사망률이 높은 암을 최소 비용으로 정기 선별할 수 있습니다.",
    limit: "대장내시경은 1차 분변잠혈 양성 등 조건에 따라 연결되며, 수면·용종제거·조직검사 비용은 별도일 수 있습니다.",
    recommendation: "40대 이후에는 사설 검진보다 국가암검진 누락 여부를 먼저 확인하는 편이 좋습니다.",
    basis: "official",
  },
  {
    type: "직장인 특수건강진단",
    target: "소음, 분진, 유기용제, 야간작업 등 유해인자 노출 근로자",
    outOfPocket: "일반적으로 사업주 부담",
    included: "유해인자별 문진, 혈액·소변검사, 청력, 폐기능, 흉부촬영 등",
    strength: "업무상 질병 위험을 법정 기준에 맞춰 확인합니다.",
    limit: "개인 종합검진 목적이 아니라 직업성 질환 선별 목적입니다.",
    recommendation: "야간근무·현장직은 회사 특수검진과 개인 종합검진 항목이 겹치지 않게 예약해야 합니다.",
    basis: "official",
  },
  {
    type: "보건소·지자체 검사",
    target: "임신부, 예비부부, 감염병 검사 대상, 지역 지원사업 대상자",
    outOfPocket: "무료~수만 원",
    included: "산전 기본검사, 풍진·B형간염, 결핵, 성매개감염, 일부 암표지자 등 지역별 상이",
    strength: "임신 초기 혈액검사나 감염병 검사를 낮은 비용으로 대체할 수 있습니다.",
    limit: "지역·시기별 예산, 거주 요건, 예약 가능 여부가 크게 다릅니다.",
    recommendation: "임신 확인 직후 보건소 가능 항목을 먼저 확인하면 산부인과 비급여 지출을 줄일 수 있습니다.",
    basis: "estimate",
  },
  {
    type: "사설 기본 종합검진",
    target: "국가검진 외에 복부초음파·위내시경·종양표지자 등을 한 번에 받고 싶은 사람",
    outOfPocket: "대략 30만~60만 원",
    included: "기본 혈액검사, 위내시경, 복부초음파, 갑상선·전립선·부인과 검사, 종양표지자 등",
    strength: "반나절 안에 여러 검사를 묶어 받을 수 있고 결과 상담이 체계적입니다.",
    limit: "패키지에 포함된 검사가 내 위험요인과 맞지 않으면 과잉검사가 될 수 있습니다.",
    recommendation: "회사 복지포인트나 단체 제휴가 있으면 기본형부터 비교하는 것이 현실적입니다.",
    basis: "private",
  },
  {
    type: "사설 정밀·프리미엄 검진",
    target: "50대 이상, 가족력, 흡연력, 심혈관 위험, 암 치료 가족력 등 위험요인이 있는 사람",
    outOfPocket: "대략 80만~250만 원 이상",
    included: "CT, MRI/MRA, 심장초음파, 경동맥초음파, 대장내시경, 수면내시경, PET-CT 등 선택",
    strength: "국가검진의 빈칸인 영상검사와 정밀 내시경을 넓게 보완합니다.",
    limit: "비급여 비중이 높고, 우연히 발견된 소견 때문에 추가 검사비가 발생할 수 있습니다.",
    recommendation: "정밀검진은 비용보다 가족력·증상·이전 결과를 기준으로 필요한 장기부터 좁혀 선택해야 합니다.",
    basis: "estimate",
  },
];

export const addonExamRows: AddonExamRow[] = [
  {
    exam: "위내시경·수면내시경",
    why: "위암, 위염, 위궤양, 헬리코박터 감염 확인",
    nationalRoute: "40세 이상 위암검진 대상이면 국가암검진으로 접근 가능",
    privateRange: "수면 비용 포함 시 5만~20만 원 추가 가능",
    checkBeforeBooking: "수면관리료, 조직검사, 헬리코박터 검사 비용이 패키지에 포함되는지 확인",
  },
  {
    exam: "대장내시경",
    why: "대장암, 용종, 염증성 장질환 확인",
    nationalRoute: "50세 이상 분변잠혈검사 양성 시 후속 검사로 연결",
    privateRange: "15만~40만 원, 용종 제거 시 별도 비용 가능",
    checkBeforeBooking: "장정결제, 수면료, 용종 제거, 조직검사 비용 분리 여부 확인",
  },
  {
    exam: "복부초음파",
    why: "간, 담낭, 췌장, 신장, 비장 이상 확인",
    nationalRoute: "일반 국가검진 기본 항목에는 보통 포함되지 않음",
    privateRange: "8만~18만 원 또는 기본 종합검진 포함",
    checkBeforeBooking: "상복부만 보는지, 하복부·골반까지 포함하는지 확인",
  },
  {
    exam: "갑상선초음파",
    why: "갑상선 결절, 낭종, 추적 관찰",
    nationalRoute: "무증상 선별 목적은 국가검진 기본 항목 아님",
    privateRange: "5만~12만 원",
    checkBeforeBooking: "결절 발견 시 세침검사 비용과 필요 기준 확인",
  },
  {
    exam: "심장·경동맥초음파",
    why: "판막질환, 심장기능, 동맥경화 위험 평가",
    nationalRoute: "증상·질환 의심 진료와 검진 목적은 비용 구조가 다름",
    privateRange: "각 10만~30만 원",
    checkBeforeBooking: "고혈압·당뇨·흡연·가족력이 없다면 우선순위를 낮춰도 되는지 상담",
  },
  {
    exam: "CT·MRI/MRA",
    why: "폐, 뇌혈관, 복부 장기, 척추 등 정밀 영상 확인",
    nationalRoute: "검진 목적 비급여가 많고 진료 목적 급여와 구분 필요",
    privateRange: "CT 10만~35만 원, MRI/MRA 35만~100만 원+",
    checkBeforeBooking: "조영제, 판독료, 촬영 부위 수, 재검 비용 포함 여부 확인",
  },
];

export const scenarioRows: ScenarioRow[] = [
  {
    persona: "20~30대 무증상 직장인",
    recommendedRoute: "국가 일반검진 + 필요한 항목만 추가",
    expectedCost: "0원~30만 원",
    reason: "대사질환·혈압·간수치·빈혈 같은 기본 위험을 국가검진으로 충분히 확인할 수 있습니다.",
    avoid: "증상·가족력 없이 CT·MRI가 많은 프리미엄 패키지를 먼저 고르는 것",
  },
  {
    persona: "40대, 위암·대장암 가족력 있음",
    recommendedRoute: "국가암검진 + 내시경 중심 사설 보완",
    expectedCost: "10만~80만 원",
    reason: "위내시경, 대장내시경, 복부초음파처럼 가족력과 직접 연결되는 항목이 우선입니다.",
    avoid: "종양표지자 수치만 믿고 내시경을 미루는 것",
  },
  {
    persona: "50대 이상 부모님 검진",
    recommendedRoute: "국가암검진 누락 확인 + 정밀검진 선택",
    expectedCost: "50만~180만 원",
    reason: "암검진 주기, 고혈압·당뇨 추적, 심혈관 위험을 함께 봐야 실제 위험을 줄일 수 있습니다.",
    avoid: "PET-CT나 MRI를 많이 넣은 패키지를 설명 없이 결제하는 것",
  },
  {
    persona: "임신 준비·임신 초기",
    recommendedRoute: "보건소 산전검사 + 산부인과 필수 검사",
    expectedCost: "무료~수십만 원",
    reason: "풍진, B형간염, 빈혈, 혈액형 등 일부 검사는 보건소와 산부인과 항목이 겹칠 수 있습니다.",
    avoid: "임신 가능성이 있는데 흉부 X-ray, CT, 진정 내시경을 상담 없이 예약하는 것",
  },
  {
    persona: "회사 복지포인트가 있는 직장인",
    recommendedRoute: "공단검진 병행 사설 기본형",
    expectedCost: "실부담 0원~50만 원",
    reason: "회사 제휴 검진은 단가가 낮고 공단검진 항목을 병행하면 시간과 비용을 줄일 수 있습니다.",
    avoid: "복지포인트 소진 목적만으로 불필요한 고가 선택검사를 추가하는 것",
  },
];

export const pregnancyCheckupRows: PregnancyCheckupRow[] = [
  {
    period: "임신 준비~초기",
    coreExams: "풍진, B형간염, 매독, HIV, 빈혈, 혈액형, 소변검사, 갑상선 기능 등",
    checkupDecision: "일반 종합검진보다 보건소 산전검사와 산부인과 첫 진료를 우선 확인",
    costMemo: "지역 보건소 지원 항목을 먼저 확인하면 중복 혈액검사를 줄일 수 있습니다.",
  },
  {
    period: "임신 11~13주",
    coreExams: "1차 기형아검사, NT 초음파, 필요 시 NIPT 상담",
    checkupDecision: "수면내시경, CT, 일부 약물 사용 검사는 의료진과 일정 조정",
    costMemo: "NIPT는 선택검사라 병원별 비용 차이가 큽니다.",
  },
  {
    period: "임신 20~24주",
    coreExams: "정밀초음파, 태아 장기 구조 확인",
    checkupDecision: "건강검진 패키지보다 산전 정밀초음파가 우선",
    costMemo: "입체초음파, 추가 정밀초음파는 비급여 여부를 확인해야 합니다.",
  },
  {
    period: "임신 24~28주",
    coreExams: "임신성 당뇨검사, 빈혈 추적, 혈압·소변 확인",
    checkupDecision: "검진센터 예약보다 산부인과 추적검사 일정에 맞춤",
    costMemo: "검사 이상 시 재검과 진료비가 추가될 수 있습니다.",
  },
];

export const bookingChecklist = [
  "국가검진 대상 여부와 올해 받을 수 있는 암검진 항목을 먼저 확인합니다.",
  "사설 검진은 패키지명보다 포함 항목, 수면료, 조직검사, 용종제거 비용을 봅니다.",
  "가족력은 장기별로 적습니다. 위암 가족력이 있으면 위내시경, 대장암 가족력이 있으면 대장내시경 우선입니다.",
  "임신 가능성이 있으면 예약 전에 반드시 알립니다. X-ray, CT, 진정제 사용 검사 일정이 달라질 수 있습니다.",
  "검진 후 이상 소견이 나오면 추가 검사비가 발생합니다. 패키지 가격만 보고 총비용을 판단하지 않습니다.",
];

export const healthCheckupSources: SourceRow[] = [
  {
    label: "건강검진 실시기준",
    organization: "국가법령정보센터",
    href: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000272270&chrClsCd=010201",
    note: "2026년 건강검진 검사항목, 대상자, 검진비용 산정의 법령 기준입니다.",
  },
  {
    label: "2025년 건강검진 안내",
    organization: "국민건강보험공단",
    href: "https://www.nhis.or.kr/static/html/wbma/c/wbhaca04500_2025_1.pdf",
    note: "일반건강검진 공단 부담, 국가암검진 본인부담 구조를 확인하는 공식 안내 자료입니다.",
  },
  {
    label: "암검진 비용 지원",
    organization: "찾기쉬운 생활법령정보",
    href: "https://easylaw.go.kr/CSP/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=97&onhunqnaSeq=4034",
    note: "암검진 비용의 공단·국가·지자체 부담과 본인부담 구조를 설명합니다.",
  },
  {
    label: "비급여 이해하기",
    organization: "국민건강보험공단 비급여 정보 포털",
    href: "https://www.nhis.or.kr/nbinfo/htmc_under.do",
    note: "사설 검진의 CT, MRI, 초음파, 수면료처럼 비급여가 되는 항목을 이해하는 기준입니다.",
  },
  {
    label: "기본 종합검진",
    organization: "하나로의료재단",
    href: "https://www.hanaromf.com/program/prog01/prog01_01.jsp",
    note: "민간 검진센터 기본 종합검진 가격과 포함 항목을 확인한 대표 사례입니다.",
  },
  {
    label: "종합건강검진 안내",
    organization: "한국건강관리협회",
    href: "https://www.kahp.or.kr/ho/hlthChk/cprsvchk/cprsvchkIntro.do",
    note: "지부별 프로그램과 비용 차이가 있음을 확인할 수 있는 종합검진 안내입니다.",
  },
];

export const healthCheckupFaq = [
  {
    question: "국가건강검진만 받아도 충분한가요?",
    answer:
      "20~30대 무증상이고 가족력이 뚜렷하지 않다면 국가 일반건강검진만으로도 혈압, 혈당, 간수치, 신장기능, 빈혈, 흉부 X-ray 같은 기본 위험을 확인할 수 있습니다. 다만 위암·대장암 가족력, 흡연력, 복통·혈변·체중감소 같은 증상이 있으면 사설 검진보다 진료 상담을 먼저 받는 편이 안전합니다.",
  },
  {
    question: "사설 종합검진은 언제 돈값을 하나요?",
    answer:
      "국가검진에서 빠지는 초음파, 내시경, 심장·뇌혈관 영상검사를 본인의 위험요인에 맞게 고를 때 돈값을 합니다. 반대로 증상과 가족력 없이 CT, MRI, PET-CT가 많이 들어간 패키지를 고르면 비용 대비 효율이 낮아질 수 있습니다.",
  },
  {
    question: "검진센터 가격표와 실제 결제액이 다른 이유는 무엇인가요?",
    answer:
      "수면내시경 관리료, 조직검사, 헬리코박터 검사, 용종 제거, 조영제, 추가 판독료가 별도인 경우가 많기 때문입니다. 예약 전 포함·불포함 항목을 문자나 견적서로 받아두면 예상 밖 비용을 줄일 수 있습니다.",
  },
  {
    question: "임신 중에도 종합건강검진을 받아도 되나요?",
    answer:
      "임신 중에는 일반 종합검진보다 산부인과 산전검사 일정이 우선입니다. 흉부 X-ray, CT, 진정 내시경, 일부 약물 사용 검사는 의료진 판단이 필요하므로 임신 가능성 또는 임신 사실을 반드시 먼저 알려야 합니다.",
  },
  {
    question: "건강검진 비용은 실손보험 청구가 되나요?",
    answer:
      "단순 예방 목적 검진은 실손보험 보장 대상이 아닌 경우가 많습니다. 다만 검진 중 질병 의심 소견으로 추가 진료나 치료가 이뤄진 경우는 약관과 진료 목적에 따라 달라질 수 있어 보험사 확인이 필요합니다.",
  },
];

export const relatedLinks = [
  { href: "/reports/pregnancy-checkup-cost-2026/", label: "임신 주수별 검사 비용 리포트" },
  { href: "/tools/pregnancy-checkup-cost/", label: "임신 주수별 검사비 계산기" },
  { href: "/tools/health-insurance-premium-calculator/", label: "건강보험료 계산기" },
  { href: "/reports/silson-insurance-generation-comparison-2026/", label: "실손보험 세대별 비교" },
  { href: "/reports/employee-tax-insurance-rates-2026/", label: "직장인 세금·4대보험 요율표" },
];

export const healthCheckupCostComparison2026 = {
  meta: {
    slug: HEALTH_CHECKUP_COST_COMPARISON_SLUG,
    title: "건강검진 비용 비교 2026 | 국가검진 vs 사설 종합검진",
    description:
      "국가건강검진, 국가암검진, 보건소 산전검사, 사설 기본·정밀 종합검진 비용을 비교하고 연령대·가족력·임신 시기별 선택 기준을 정리합니다.",
    h1: "건강검진 비용 비교 2026: 국가검진 vs 사설 종합검진",
    eyebrow: "건강검진 비용 리포트",
    updatedAt: "2026.06.07",
  },
  summaryCards: healthCheckupSummaryCards,
  comparisonRows: healthCheckupComparisonRows,
  addonExamRows,
  scenarioRows,
  pregnancyCheckupRows,
  bookingChecklist,
  sources: healthCheckupSources,
  faq: healthCheckupFaq,
  relatedLinks,
};
