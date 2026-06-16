export interface GmpDefaults {
  roundingPerMonth: number;
  activeMonths: number;
  membershipPrice: number;
  holdingYears: number;
  resalePrice: number;
  annualFee: number;
  memberGreenFee: number;
  caddyFee: number;
  cartFee: number;
  weekdayGreenFee: number;
  weekendGreenFee: number;
  weekendRatio: number;
}

export const GMP_DEFAULTS: GmpDefaults = {
  roundingPerMonth: 4,
  activeMonths: 10,
  membershipPrice: 30_000_000,
  holdingYears: 5,
  resalePrice: 25_000_000,
  annualFee: 1_000_000,
  memberGreenFee: 80_000,
  caddyFee: 30_000,
  cartFee: 15_000,
  weekdayGreenFee: 150_000,
  weekendGreenFee: 200_000,
  weekendRatio: 0.4,
};

export interface FaqItem { question: string; answer: string; }

export const GMP_FAQ: FaqItem[] = [
  {
    question: "골프 회원권, 언제 사는 게 유리한가요?",
    answer: "월 라운딩 횟수가 4회 이상이고 동일 골프장 또는 계열 골프장을 자주 이용한다면 3~5년 안에 손익분기를 넘길 수 있습니다. 반면 라운딩 횟수가 적거나 다양한 골프장을 선호한다면 퍼블릭이 유리합니다.",
  },
  {
    question: "회원권 매각 시 시세 손실을 어떻게 추정하나요?",
    answer: "국내 회원권 시세는 골프장 입지·시설·회원 수에 따라 다르지만, 일반적으로 5년 보유 후 5~20% 하락하는 경우가 많습니다. 인기 골프장은 시세가 유지되거나 상승하기도 합니다. '매각가' 슬라이더로 시나리오별로 확인해보세요.",
  },
  {
    question: "회원권 관리비란 무엇인가요?",
    answer: "골프 회원권 보유 시 매년 내는 연회비 성격의 비용입니다. 골프장마다 다르며 연 50만~200만원 수준이 일반적입니다. 관리비 외에 식음·시설 이용 할인 등 부수 혜택이 포함되는 경우도 있습니다.",
  },
  {
    question: "기회비용(투자 수익률)은 왜 포함하지 않나요?",
    answer: "이 계산기는 라운딩 비용 관점의 순수 손익분기를 보여줍니다. 기회비용을 포함하면 가정(수익률)에 따라 결과가 크게 달라지므로 별도 참고 항목으로 안내합니다.",
  },
  {
    question: "법인 회원권은 이 계산기로 판단할 수 있나요?",
    answer: "이 계산기는 개인 회원권 기준입니다. 법인 회원권은 세제 처리 방식(손금 인정 여부)이 달라 세무사 상담이 필요합니다.",
  },
  {
    question: "회원권 구매 후 양도·증여는 자유롭게 할 수 있나요?",
    answer: "대부분의 회원권은 양도가 가능하지만 골프장 규정에 따라 명의변경 수수료, 대기 기간, 제한 조건이 있을 수 있습니다. 구매 전 해당 골프장 약관을 반드시 확인하세요.",
  },
];

export const GMP_META = {
  slug: "golf-membership-vs-public",
  title: "골프 회원권 vs 퍼블릭 손익 비교 2026",
  description: "회원권 매입가·관리비·회원 그린피와 퍼블릭 그린피를 비교해 손익분기점과 N년 절감액을 계산합니다.",
};
