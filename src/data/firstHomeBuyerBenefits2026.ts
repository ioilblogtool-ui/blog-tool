export interface FirstHomeBenefit {
  id: string;
  title: string;
  summary: string;
  maxBenefit: string;
  conditions: string[];
  cautions: string[];
  officialUrl: string;
  relatedCalculatorUrl?: string;
}

export interface FirstHomeLoanComparison {
  name: string;
  target: string;
  housePriceLimit: string;
  incomeLimit: string;
  firstHomeLoanLimit: string;
  ltv: string;
  dti: string;
  tenure: string;
  bestFor: string;
}

export interface FirstHomeBuyerCase {
  label: string;
  housePrice: number;
  regionType: "capital" | "nonCapital" | "depopulationArea";
  householdType: "single" | "newlywed" | "dualIncome" | "newbornFamily";
  annualIncome: number;
  loanType: "didimdol" | "bogeumjari" | "newbornSpecial" | "none";
  acquisitionTaxEstimate: string;
  loanLimit: string;
  cashNeeded: string;
  tips: string[];
}

export const FHBB_META = {
  slug: "first-home-buyer-benefits-2026",
  title: "2026 생애최초 주택 구입 혜택 완전 분석",
  seoTitle: "2026 생애최초 주택 구입 혜택 완전 분석 | 취득세 감면·디딤돌·보금자리론·신생아 특례",
  description: "2026년 생애최초 주택 구입자를 위한 취득세 감면, 디딤돌대출, 보금자리론, 신생아 특례대출, 청약 특별공급 혜택을 가구 유형별로 비교합니다.",
  updatedAt: "2026-05-11",
};

export const FIRST_HOME_BENEFITS: FirstHomeBenefit[] = [
  {
    id: "acquisition-tax",
    title: "생애최초 취득세 감면",
    summary: "처음으로 주택을 구입하는 경우 취득세 감면 가능성을 검토합니다.",
    maxBenefit: "취득가액·지역·취득 시점별 상이",
    conditions: ["본인·배우자·세대원 주택 소유 이력 확인", "취득가액과 실거주 요건 확인", "관할 지자체 감면 신청 절차 확인"],
    cautions: ["감면 요건은 취득 시점의 법령·고시 기준으로 판단합니다.", "실거주 요건 위반 시 감면세액이 추징될 수 있습니다."],
    officialUrl: "https://www.mois.go.kr",
    relatedCalculatorUrl: "/tools/home-purchase-fund/",
  },
  {
    id: "didimdol",
    title: "디딤돌대출 생애최초 우대",
    summary: "무주택 실수요자 대상 정책 주택담보대출입니다.",
    maxBenefit: "생애최초 2.4억 원, 신혼·2자녀 이상 3.2억 원",
    conditions: ["부부합산 연소득 일반 6천만 원 이하", "생애최초·2자녀 7천만 원, 신혼 8,500만 원 기준 확인", "주택 평가액 5억 원 이하, 신혼·2자녀 이상 6억 원 이하"],
    cautions: ["수도권·규제지역은 생애최초 LTV 80%가 70%로 제한될 수 있습니다.", "DTI, 자산, 선순위채권에 따라 실제 한도는 줄어듭니다."],
    officialUrl: "https://nhuf.molit.go.kr",
    relatedCalculatorUrl: "/tools/home-purchase-fund/",
  },
  {
    id: "bogeumjari",
    title: "보금자리론 생애최초 우대",
    summary: "장기 고정금리 구조로 한도가 더 필요한 실수요자가 검토합니다.",
    maxBenefit: "생애최초 4.2억 원 한도",
    conditions: ["부부합산 연소득 7천만 원 이하", "6억 원 이하 공부상 주택", "신청일 현재 부부 모두 무주택, 본건 생애최초 취득"],
    cautions: ["수도권·규제지역은 LTV가 70% 이내로 제한될 수 있습니다.", "40년·50년 만기는 별도 조건을 충족해야 합니다."],
    officialUrl: "https://www.hf.go.kr",
    relatedCalculatorUrl: "/tools/home-purchase-fund/",
  },
  {
    id: "newborn-special",
    title: "신생아 특례 디딤돌대출",
    summary: "대출접수일 기준 2년 내 출산 가구가 우선 검토할 구입자금 대출입니다.",
    maxBenefit: "구입자금 최대 4억 원",
    conditions: ["대출접수일 기준 2년 내 출산 가구", "부부합산 연소득 1.3억 원 이하, 맞벌이 2억 원 이하", "2026년 기준 순자산가액 5.11억 원 이하"],
    cautions: ["디딤돌·보금자리론과 금리, 한도, 소득 기준을 함께 비교해야 합니다.", "대환 여부와 1주택 세대주 조건은 공식 안내에서 별도 확인해야 합니다."],
    officialUrl: "https://www.myhome.go.kr",
    relatedCalculatorUrl: "/tools/home-purchase-fund/",
  },
];

export const LOAN_COMPARISON: FirstHomeLoanComparison[] = [
  {
    name: "디딤돌대출",
    target: "무주택 서민·실수요자",
    housePriceLimit: "5억 원 이하, 신혼·2자녀 이상 6억 원 이하",
    incomeLimit: "일반 6천만 원, 생애최초·2자녀 7천만 원, 신혼 8,500만 원",
    firstHomeLoanLimit: "2.4억 원, 신혼·2자녀 이상 3.2억 원",
    ltv: "기본 70%, 생애최초 80% 가능. 수도권·규제지역 70%",
    dti: "60% 이내",
    tenure: "10·15·20·30년",
    bestFor: "소득 기준을 충족하고 금리 부담을 낮추고 싶은 저가 주택 실수요자",
  },
  {
    name: "보금자리론",
    target: "무주택 또는 1주택 실수요자",
    housePriceLimit: "6억 원 이하",
    incomeLimit: "부부합산 7천만 원 이하",
    firstHomeLoanLimit: "4.2억 원",
    ltv: "최대 70%, 생애최초 특성은 80% 가능. 수도권·규제지역 70%",
    dti: "60% 이내",
    tenure: "10·15·20·30·40·50년",
    bestFor: "디딤돌 한도보다 더 큰 대출이 필요하고 장기 고정금리를 원하는 실수요자",
  },
  {
    name: "신생아 특례 디딤돌",
    target: "2년 내 출산 가구",
    housePriceLimit: "공식 안내의 대상주택 기준 확인",
    incomeLimit: "부부합산 1.3억 원 이하, 맞벌이 2억 원 이하",
    firstHomeLoanLimit: "4억 원",
    ltv: "기본 70%, 생애최초 80% 가능. 수도권·규제지역 70%",
    dti: "60% 이내",
    tenure: "10·15·20·30년",
    bestFor: "출산 요건을 충족하고 소득 기준이 일반 정책대출보다 높은 가구",
  },
];

export const FIRST_HOME_CASES: FirstHomeBuyerCase[] = [
  {
    label: "3억 원 비수도권 신혼부부",
    housePrice: 300000000,
    regionType: "nonCapital",
    householdType: "newlywed",
    annualIncome: 60000000,
    loanType: "didimdol",
    acquisitionTaxEstimate: "생애최초 감면 가능성 확인 필요",
    loanLimit: "디딤돌 최대 2.4억 원 예시",
    cashNeeded: "약 6,600만 원 이상 예시",
    tips: ["소득 기준을 충족한다면 디딤돌을 먼저 검토합니다.", "취득세 감면은 세대원 과거 주택 이력과 실거주 요건을 확인해야 합니다."],
  },
  {
    label: "5억 원 비수도권 맞벌이",
    housePrice: 500000000,
    regionType: "nonCapital",
    householdType: "dualIncome",
    annualIncome: 70000000,
    loanType: "bogeumjari",
    acquisitionTaxEstimate: "취득가액·감면 요건 별도 확인",
    loanLimit: "보금자리론 최대 4.2억 원 예시",
    cashNeeded: "약 8,800만 원 이상 예시",
    tips: ["디딤돌 한도가 부족하면 보금자리론 한도를 비교합니다.", "소득과 DTI 심사에서 실제 승인 한도가 줄 수 있습니다."],
  },
  {
    label: "7억 원 수도권 출산가구",
    housePrice: 700000000,
    regionType: "capital",
    householdType: "newbornFamily",
    annualIncome: 130000000,
    loanType: "newbornSpecial",
    acquisitionTaxEstimate: "취득세 감면 여부 별도 확인",
    loanLimit: "신생아 특례 구입자금 최대 4억 원 예시",
    cashNeeded: "약 3억 원 이상 예시",
    tips: ["주택가격과 담보 평가 기준이 맞는지 먼저 확인해야 합니다.", "수도권은 생애최초 LTV 우대가 제한될 수 있어 보수적으로 계산합니다."],
  },
];

export const ELIGIBILITY_CHECKS = [
  "본인과 배우자의 과거 주택·분양권·입주권 보유 이력을 확인합니다.",
  "같은 세대에 있는 직계존비속의 주택 보유 이력도 함께 확인합니다.",
  "혼인 예정 또는 혼인 중이라면 배우자의 혼인 전 이력도 확인합니다.",
  "취득 후 실거주 요건과 전입 기한을 계약 전에 확인합니다.",
  "대출은 소득, 자산, DTI, LTV, 선순위채권을 함께 반영해 사전심사를 받습니다.",
];

export const HOUSEHOLD_COMPARISON = [
  { type: "1인 가구", tax: "생애최초 여부는 가능하지만 세대 이력 확인이 중요", loan: "만 30세 이상 미혼 단독세대주는 디딤돌 한도가 별도 제한될 수 있음", subscription: "공급 유형과 면적 제한 확인 필요" },
  { type: "신혼부부", tax: "배우자 과거 주택 이력까지 확인", loan: "디딤돌 소득·주택가격 기준이 완화되는 구간 확인", subscription: "신혼부부 특별공급과 생애최초 특별공급을 동시에 비교" },
  { type: "맞벌이", tax: "취득세 감면과 대출 소득 기준을 각각 따로 확인", loan: "소득 합산으로 일부 상품은 초과 가능, 신생아 특례는 맞벌이 기준 확인", subscription: "소득 구간별 공급 배분에서 불리해질 수 있음" },
  { type: "출산가구", tax: "생애최초와 출산가구 요건을 분리해서 확인", loan: "신생아 특례 디딤돌을 우선 비교", subscription: "신생아·다자녀·신혼 특공 공고별 조건 확인" },
];

export const CHANGE_POINTS = [
  { title: "취득세 감면 운영기준 일부 개정", body: "행정안전부 고시 기준으로 생애최초 주택 구입 취득세 감면 운영기준을 확인해야 합니다." },
  { title: "디딤돌 한도 축소 적용 구간", body: "주택도시기금 안내 기준으로 2025년 6월 28일 이후 계약분은 일반 2억 원, 생애최초 2.4억 원, 신혼·2자녀 이상 3.2억 원 한도를 확인합니다." },
  { title: "신생아 특례 맞벌이 소득 기준", body: "마이홈 공식 안내 기준으로 맞벌이 가구는 부부합산 2억 원 이하 조건을 별도로 확인합니다." },
];

export const MISTAKE_TOP5 = [
  "세대원 주택 보유 이력을 본인 이력만으로 판단하는 실수",
  "취득세 감면과 정책대출 생애최초 요건이 같다고 보는 실수",
  "LTV 한도만 보고 DTI·소득·자산 심사를 빼는 실수",
  "계약 후에야 실거주 요건과 추징 조건을 확인하는 실수",
  "청약 특별공급과 정책대출을 같은 신청 절차로 이해하는 실수",
];

export const FHBB_FAQ = [
  { question: "생애최초 주택 구입이면 무조건 취득세 감면을 받을 수 있나요?", answer: "아닙니다. 생애최초 여부만으로 자동 감면되는 것이 아니라 주택가격, 세대원 주택 보유 이력, 취득 시점, 실거주 요건 등 세부 요건을 충족해야 합니다." },
  { question: "생애최초 요건은 어떻게 판단하나요?", answer: "본인뿐만 아니라 배우자와 같은 세대 구성원의 주택, 분양권, 입주권 보유 이력을 함께 확인합니다. 혼인 전 배우자 이력이 영향을 줄 수 있어 계약 전 확인이 필요합니다." },
  { question: "디딤돌대출과 보금자리론 중 무엇이 더 유리한가요?", answer: "소득과 주택가격 기준을 충족한다면 디딤돌대출이 금리 측면에서 유리할 수 있습니다. 다만 주택가격이나 필요 한도가 디딤돌 기준을 넘으면 보금자리론을 함께 검토해야 합니다." },
  { question: "신생아 특례대출과 생애최초 혜택을 동시에 검토할 수 있나요?", answer: "가능합니다. 다만 상품별 자격과 한도가 다르므로 신생아 특례 디딤돌, 디딤돌대출, 보금자리론 중 실제 금리와 승인 한도를 비교해 선택해야 합니다." },
  { question: "생애최초 청약 특별공급의 당첨 확률은 얼마나 되나요?", answer: "당첨 확률은 단지, 지역, 공급 물량, 신청자 수, 소득 구간에 따라 달라집니다. 생애최초 특별공급은 소득 구간별 배분 구조와 추첨 물량을 공고문에서 확인해야 합니다." },
  { question: "지자체별 추가 지원금은 어떻게 확인하나요?", answer: "시·군·구청 홈페이지, 주거복지센터, 복지로, 지자체 공고문을 통해 확인합니다. 예산과 공고 시점에 따라 바뀌므로 계약 전 직접 문의하는 것이 가장 정확합니다." },
  { question: "1인 가구도 생애최초 특별공급이 가능한가요?", answer: "일부 유형에서는 가능하지만 면적 제한, 소득 기준, 공급 유형에 따라 조건이 달라질 수 있습니다. 청약홈과 개별 입주자모집공고문 확인이 필요합니다." },
  { question: "취득세 감면 후 실거주 요건을 지키지 않으면 어떻게 되나요?", answer: "실거주 요건을 위반하면 감면받은 취득세를 추징당할 수 있습니다. 취득 전 관할 지자체에서 정확한 조건과 기간을 확인해야 합니다." },
];

export const FHBB_RELATED_LINKS = [
  { href: "/tools/home-purchase-fund/", label: "내 집 마련 자금 계산기" },
  { href: "/tools/jeonse-vs-wolse-calculator/", label: "전세 vs 월세 손익 계산기" },
  { href: "/tools/apt-cheonyak-gajum-calculator/", label: "주택청약 가점 계산기" },
  { href: "/reports/seoul-apartment-price-2026/", label: "서울 구별 아파트 실거래가" },
  { href: "/reports/2026-seoul-apt-cheonyak-cutline/", label: "서울 청약 가점 커트라인" },
];

export const FHBB_SOURCE_LINKS = [
  { href: "https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000016&nttId=123270", label: "행정안전부 생애최초 취득세 감면 운영기준" },
  { href: "https://nhuf.molit.go.kr/FP/FP05/FP0503/FP05030101.jsp", label: "주택도시기금 내집마련 디딤돌대출" },
  { href: "https://www.hf.go.kr/ko/sub01/sub01_01_01.do", label: "한국주택금융공사 보금자리론" },
  { href: "https://www.hf.go.kr/ko/sub01/sub01_01_02.do", label: "한국주택금융공사 생애최초 보금자리론" },
  { href: "https://www.myhome.go.kr/hws/portal/cont/selectBabySpecialCaseStepStoneLoneView.do", label: "마이홈 신생아 특례 디딤돌대출" },
];
