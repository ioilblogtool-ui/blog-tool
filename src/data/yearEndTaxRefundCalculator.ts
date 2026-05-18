export interface YetcPreset {
  id: string;
  label: string;
  summary: string;
  grossSalary: number;
  withheldTax: number;
  dependents: number;
  elderlyDependents: number;
  disabledDependents: number;
  children: number;
  creditCardAmount: number;
  debitCashAmount: number;
  housingSubscription: number;
  mortgageRepayment: number;
  medicalExpense: number;
  educationExpense: number;
  pensionSaving: number;
  irpAmount: number;
  insurance: number;
  donation: number;
  monthlyRent: number;
  isRenter: boolean;
}

export interface YetcFaq {
  question: string;
  answer: string;
}

export interface YetcLink {
  href: string;
  label: string;
}

export const YETC_META = {
  title: "연말정산 환급액 계산기",
  seoTitle: "연말정산 환급액 계산기 — 내 공제 항목 입력하고 예상 환급액 즉시 확인",
  seoDescription:
    "총급여·부양가족·신용카드·의료비·연금저축 등 공제 항목을 입력하면 연말정산 예상 환급액을 자동 계산합니다. 공제 한도 미달 시 추가 납입 효과도 함께 확인하세요.",
  dataNote:
    "이 계산기는 2026년 소득세법 기준 주요 공제 항목만 반영한 참고용 추정값입니다. 실제 환급액은 개인 상황에 따라 다를 수 있으므로 국세청 홈택스에서 최종 확인하세요.",
};

export const YETC_PRESETS: YetcPreset[] = [
  {
    id: "single-basic",
    label: "미혼 직장인",
    summary: "연봉 4천 · 미혼 · 신용카드만",
    grossSalary: 40000000, withheldTax: 0,
    dependents: 1, elderlyDependents: 0, disabledDependents: 0, children: 0,
    creditCardAmount: 12000000, debitCashAmount: 0,
    housingSubscription: 0, mortgageRepayment: 0,
    medicalExpense: 0, educationExpense: 0,
    pensionSaving: 0, irpAmount: 0,
    insurance: 1200000, donation: 0,
    monthlyRent: 0, isRenter: false,
  },
  {
    id: "married-child",
    label: "기혼 자녀 1명",
    summary: "연봉 5천 · 배우자+자녀 · 연금저축",
    grossSalary: 50000000, withheldTax: 0,
    dependents: 3, elderlyDependents: 0, disabledDependents: 0, children: 1,
    creditCardAmount: 15000000, debitCashAmount: 5000000,
    housingSubscription: 2400000, mortgageRepayment: 0,
    medicalExpense: 800000, educationExpense: 3000000,
    pensionSaving: 3000000, irpAmount: 0,
    insurance: 1200000, donation: 0,
    monthlyRent: 0, isRenter: false,
  },
  {
    id: "high-income",
    label: "고소득 IRP 최대",
    summary: "연봉 8천 · IRP 한도 채움",
    grossSalary: 80000000, withheldTax: 0,
    dependents: 4, elderlyDependents: 1, disabledDependents: 0, children: 2,
    creditCardAmount: 20000000, debitCashAmount: 8000000,
    housingSubscription: 0, mortgageRepayment: 0,
    medicalExpense: 1500000, educationExpense: 9000000,
    pensionSaving: 6000000, irpAmount: 3000000,
    insurance: 1200000, donation: 500000,
    monthlyRent: 0, isRenter: false,
  },
  {
    id: "renter",
    label: "월세 + 연금저축",
    summary: "연봉 4.5천 · 월세 · 연금저축",
    grossSalary: 45000000, withheldTax: 0,
    dependents: 1, elderlyDependents: 0, disabledDependents: 0, children: 0,
    creditCardAmount: 8000000, debitCashAmount: 3000000,
    housingSubscription: 0, mortgageRepayment: 0,
    medicalExpense: 0, educationExpense: 0,
    pensionSaving: 3000000, irpAmount: 0,
    insurance: 1200000, donation: 0,
    monthlyRent: 9600000, isRenter: true,
  },
];

export const YETC_FAQ: YetcFaq[] = [
  {
    question: "기납부세액을 모르면 어떻게 하나요?",
    answer:
      "기납부세액 칸을 비워두면 총급여 기준으로 자동 추정합니다. 정확한 기납부세액은 매년 1월 발급되는 근로소득 원천징수영수증 또는 국세청 홈택스에서 확인할 수 있습니다. 자동 추정값은 실제와 차이가 있을 수 있으므로 참고용으로만 활용하세요.",
  },
  {
    question: "연금저축과 IRP 중 어느 쪽을 먼저 채워야 하나요?",
    answer:
      "일반적으로 연금저축을 600만 원 먼저 채운 뒤 IRP로 나머지 300만 원을 채우는 것이 권장됩니다. 연금저축은 중도 해지 시 페널티가 상대적으로 낮고 운용 상품이 다양합니다. IRP는 퇴직소득·이직 시 수령과 연계해 추가로 활용할 수 있습니다.",
  },
  {
    question: "신용카드 공제와 체크카드 공제를 합산해서 받을 수 있나요?",
    answer:
      "네. 신용카드, 체크카드, 현금영수증 사용액을 합산해 총급여의 25%를 초과한 금액부터 공제받습니다. 초과분 중 신용카드는 15%, 체크카드·현금영수증은 30%로 공제율이 다릅니다. 최적 전략은 총급여 25%까지는 신용카드, 초과분은 체크카드나 현금영수증으로 결제하는 것입니다.",
  },
  {
    question: "월세 세액공제는 어떤 조건을 충족해야 하나요?",
    answer:
      "총급여 7,000만 원 이하, 무주택 세대주(세대원), 임차 주택이 국민주택규모(85㎡) 이하인 경우 공제받을 수 있습니다. 임대차계약서, 월세 납입 증빙(계좌이체 내역 등)을 보관해야 하며, 확정일자 또는 전입신고가 되어있어야 합니다.",
  },
  {
    question: "부양가족으로 등록할 수 있는 요건은 무엇인가요?",
    answer:
      "연간 소득금액 100만 원 이하(근로소득만 있으면 총급여 500만 원 이하)이고 생계를 함께 하는 가족이어야 합니다. 따로 사는 부모님도 실질적으로 부양하고 있다면 등록 가능합니다. 배우자의 부모(장인·장모)도 요건 충족 시 등록할 수 있습니다.",
  },
  {
    question: "5년 전 연말정산에서 놓친 공제도 돌려받을 수 있나요?",
    answer:
      "네. 경정청구를 통해 5년 이내 신고 오류·누락 공제를 소급 신청할 수 있습니다. 홈택스(hometax.go.kr)에서 경정청구 메뉴로 직접 신청하거나 세무사를 통해 대행할 수 있습니다. 5년이 지나면 시효가 만료되므로 서두르는 것이 좋습니다.",
  },
  {
    question: "연말정산 환급액이 이 계산기와 다른 이유는 무엇인가요?",
    answer:
      "이 계산기는 주요 공제 항목만 반영하며, 실제 연말정산에는 근로소득세액공제, 자녀세액공제 세부 조건, 종합소득세 합산 여부 등 추가 항목이 적용됩니다. 또한 기납부세액을 직접 입력하지 않은 경우 자동 추정값을 사용하므로 차이가 발생할 수 있습니다.",
  },
  {
    question: "맞벌이 부부는 공제를 어떻게 나눠야 유리한가요?",
    answer:
      "자녀 교육비·의료비는 실제 지출한 사람이 공제받아야 합니다. 부양가족(자녀 등)은 소득이 높은 쪽(한계세율이 높은 쪽)에 몰아주면 소득공제 절세 효과가 더 큽니다. 단, 부양가족 중복 공제는 가산세가 발생하므로 한 명만 신청해야 합니다.",
  },
];

export const YETC_RELATED_LINKS: YetcLink[] = [
  { href: "/reports/2026-year-end-tax-saving-guide/", label: "2026 연말정산 절세 전략 완전 정복" },
  { href: "/tools/irp-pension-calculator/",           label: "IRP·연금저축 세액공제 계산기" },
  { href: "/tools/salary/",                           label: "연봉 실수령 계산기" },
  { href: "/tools/retirement/",                       label: "퇴직금 계산기" },
  { href: "/tools/overtime-pay-calculator/",           label: "야근수당 계산기" },
];
