export interface TaxBracketRow {
  salary: string;
  marginalRate: string;
  incomeDeduction100: number;
}

export interface PensionCreditRow {
  salaryLabel: string;
  creditRate: number;
  maxCredit: number;
}

export interface SimulationCase {
  id: string;
  label: string;
  salary: number;
  desc: string;
  refund: number;
}

export interface MistakeItem {
  rank: number;
  title: string;
  desc: string;
}

export interface YetsFaq {
  question: string;
  answer: string;
}

export interface YetsLink {
  href: string;
  label: string;
}

export const YETS_META = {
  slug: "2026-year-end-tax-saving-guide",
  title: "2026 연말정산 절세 전략 완전 정복",
  seoTitle: "2026 연말정산 절세 전략 완전 정복 — 공제 항목별 환급액 시뮬레이션·체크리스트",
  description:
    "신용카드·연금저축·의료비·월세 공제까지, 직장인이 연말정산에서 최대로 환급받는 절세 전략을 총정리합니다. 연봉 구간별 시뮬레이션과 절세 실수 TOP10 체크리스트 포함.",
  updatedAt: "2026년 소득세법 기준",
  dataNote:
    "이 리포트의 모든 계산 예시는 2026년 소득세법 기준 참고용 추정값입니다. 실제 공제 조건·한도는 국세청 홈택스 연말정산 간소화 서비스에서 확인하고 신고하세요.",
};

// 소득공제 vs 세액공제 임팩트 비교 (추정)
export const TAX_BRACKET_ROWS: TaxBracketRow[] = [
  { salary: "3천만 원",  marginalRate: "15%", incomeDeduction100: 154000  },
  { salary: "5천만 원",  marginalRate: "24%", incomeDeduction100: 246000  },
  { salary: "7천만 원",  marginalRate: "35%", incomeDeduction100: 359000  },
  { salary: "1억 원",   marginalRate: "35%", incomeDeduction100: 359000  },
  { salary: "1.5억 원", marginalRate: "38%", incomeDeduction100: 390000  },
];

// 연금저축·IRP 세액공제 효과
export const PENSION_CREDIT_ROWS: PensionCreditRow[] = [
  { salaryLabel: "5,500만 원 이하", creditRate: 0.165, maxCredit: 1485000 },
  { salaryLabel: "5,500만 원 초과", creditRate: 0.132, maxCredit: 1188000 },
];

// 연봉 구간별 환급 시뮬레이션 (4케이스, 추정)
export const SIMULATION_CASES: SimulationCase[] = [
  {
    id: "single-30m",
    label: "케이스 ①",
    salary: 30000000,
    desc: "연봉 3천만 원 · 미혼 · 기본공제만",
    refund: 220000,
  },
  {
    id: "married-50m",
    label: "케이스 ②",
    salary: 50000000,
    desc: "연봉 5천만 원 · 배우자+자녀 · 카드+연금저축",
    refund: 1350000,
  },
  {
    id: "dual-70m",
    label: "케이스 ③",
    salary: 70000000,
    desc: "연봉 7천만 원 · 맞벌이 · IRP 최대 납입",
    refund: 2600000,
  },
  {
    id: "high-100m",
    label: "케이스 ④",
    salary: 100000000,
    desc: "연봉 1억 원 · 최대 공제 적용",
    refund: 3700000,
  },
];

// 절세 실수 TOP10
export const MISTAKE_LIST: MistakeItem[] = [
  { rank: 1,  title: "간소화 자료만 확인하고 추가 서류 미제출",        desc: "의료비·월세·기부금 등 간소화에 미포함된 서류는 직접 제출 필요" },
  { rank: 2,  title: "부양가족 소득 초과 상태에서 공제 신청",           desc: "연간 소득 100만 원 초과 부양가족 공제 시 가산세 발생" },
  { rank: 3,  title: "맞벌이 부양가족 중복 공제 신청",                  desc: "동일 부양가족 중복 신청 시 가산세 발생 — 반드시 한 명만 신청" },
  { rank: 4,  title: "연금저축·IRP 납입 기한(12월 31일) 놓침",         desc: "1월 이후 납입분은 다음 연도 공제 적용" },
  { rank: 5,  title: "월세 세액공제 서류 미제출",                       desc: "임대차계약서 + 월세 납입 증빙 별도 제출 필요. 간소화 자동 미반영" },
  { rank: 6,  title: "의료비 총급여 3% 기준선 미계산",                  desc: "기준 미달이면 공제 불가 — 사전 계산 후 신청 필요" },
  { rank: 7,  title: "교육비 공제 대상 착각",                           desc: "일반 학원비는 일부만 해당 — 국가 인가 교육기관 여부 확인 필수" },
  { rank: 8,  title: "신용카드 공제 한도 초과분 미확인",                 desc: "한도(최대 300만 원) 초과 사용액은 추가 공제 없음" },
  { rank: 9,  title: "기부금 영수증 미발급 상태 신청",                   desc: "공인된 기관 기부금 영수증 없으면 공제 불가" },
  { rank: 10, title: "경정청구 기회 미활용",                             desc: "5년 이내 누락 공제는 홈택스 경정청구로 소급 신청 가능" },
];

// 2026 세법 개정 예고 (확정 전 예고안)
export const AMENDMENT_ITEMS: string[] = [
  "자녀세액공제 확대 — 자녀 수 기준 및 공제 금액 조정 논의 중",
  "신용카드 공제 한도 조정 검토",
  "월세 세액공제율·대상 확대 논의",
  "근로장려금(EITC) 수급 요건 변화",
  "중소기업 취업자 세액감면 일몰 연장 여부",
];

export const YETS_FAQ: YetsFaq[] = [
  {
    question: "연말정산 환급과 추납은 어떻게 결정되나요?",
    answer:
      "1년간 원천징수로 납부한 세금(기납부세액)이 실제 결정세액보다 많으면 환급, 적으면 추납입니다. 공제 항목을 많이 챙길수록 결정세액이 낮아져 환급액이 늘어납니다. 환급액 = 기납부세액 - 결정세액입니다.",
  },
  {
    question: "소득공제와 세액공제 중 어느 쪽이 더 유리한가요?",
    answer:
      "세액공제는 소득 구간과 무관하게 동일한 금액을 돌려받습니다. 연봉 5천만 원 기준 소득공제 100만 원의 절세 효과는 약 24.6만 원이지만, 세액공제 100만 원은 그대로 100만 원을 절세합니다. 세액공제 항목(연금저축·의료비·월세 등)을 우선 한도까지 채우는 것이 일반적으로 유리합니다.",
  },
  {
    question: "연금저축과 IRP, 어느 쪽을 먼저 납입해야 하나요?",
    answer:
      "연금저축을 600만 원 먼저 채운 뒤 IRP로 나머지 300만 원을 채워 합산 900만 원 한도를 활용하는 것이 일반적으로 유리합니다. 연금저축은 중도 해지 시 페널티가 상대적으로 낮고 운용 상품이 다양합니다.",
  },
  {
    question: "신용카드와 체크카드 중 어느 걸 더 써야 공제를 많이 받나요?",
    answer:
      "총급여의 25%까지는 어떤 결제 수단을 써도 공제 대상이 아닙니다. 25% 초과분부터 공제가 시작되며, 이 초과분 중 신용카드는 15%, 체크카드·현금영수증은 30%를 공제받습니다. 총급여 25%까지는 혜택이 많은 신용카드로, 초과분은 체크카드나 현금영수증으로 결제하는 것이 유리합니다.",
  },
  {
    question: "맞벌이 부부는 공제를 어떻게 나눠야 하나요?",
    answer:
      "자녀 교육비·의료비는 실제 지출한 사람이 공제받아야 합니다. 부양가족(자녀 등)은 소득이 높은 쪽에 몰아주면 소득공제 절세 효과가 더 큽니다. 단, 동일 부양가족을 두 명이 중복 신청하면 가산세가 발생하므로 반드시 한 명만 신청해야 합니다.",
  },
  {
    question: "월세 세액공제를 받으려면 어떻게 해야 하나요?",
    answer:
      "총급여 7,000만 원 이하, 무주택 세대주(또는 세대원), 임차 주택이 85㎡ 이하인 경우 공제 가능합니다. 임대차계약서와 계좌이체 증빙(월세 납입 내역)을 연말정산 시 제출해야 합니다. 간소화 서비스에 자동 반영되지 않으므로 직접 서류를 챙겨야 합니다.",
  },
  {
    question: "과거 연도에 놓친 공제도 돌려받을 수 있나요?",
    answer:
      "경정청구를 통해 5년 이내 신고 오류·누락 공제를 소급 신청할 수 있습니다. 홈택스에서 경정청구 메뉴로 직접 신청하거나 세무사를 통해 대행할 수 있습니다. 5년이 지나면 시효가 만료되므로 서두르는 것이 좋습니다.",
  },
  {
    question: "중소기업 취업자 소득세 감면은 어떻게 받나요?",
    answer:
      "중소기업에 취업한 청년(만 34세 이하)은 취업일부터 5년간 소득세의 90%(한도 연 200만 원)를 감면받을 수 있습니다. 회사 인사팀에 중소기업 취업자 소득세 감면신청서를 제출해야 합니다. 이직 시 감면 기간이 리셋되지 않으며 누적 5년까지 적용됩니다.",
  },
];

export const YETS_RELATED_LINKS: YetsLink[] = [
  { href: "/tools/year-end-tax-refund-calculator/",       label: "연말정산 환급액 계산기" },
  { href: "/tools/irp-pension-calculator/",               label: "IRP·연금저축 세액공제 계산기" },
  { href: "/tools/salary/",                               label: "연봉 실수령 계산기" },
  { href: "/reports/retirement-pension-dc-db-irp-2026/",  label: "퇴직연금 DC·DB·IRP 비교" },
  { href: "/tools/overtime-pay-calculator/",               label: "야근수당 계산기" },
];
