// ETF 분배금 세후 계산기 데이터
// 국내 상장 ETF vs 미국 상장 ETF vs ISA 계좌 비교

export type EtfListingType = "kr-domestic" | "kr-overseas" | "us-listed";

export interface EdtcEtfType {
  id: EtfListingType;
  label: string;
  desc: string;
  taxRate: number;
  isaTaxRate: number;   // ISA 초과분 세율
  isaTaxFreeLimit: number; // ISA 비과세 한도 (일반형 기준)
  note: string;
}

export const EDTC_ETF_TYPES: EdtcEtfType[] = [
  {
    id: "kr-domestic",
    label: "국내 ETF (국내 자산)",
    desc: "KODEX 200, TIGER 코스피 등 국내 주식·채권 ETF",
    taxRate: 0.154,
    isaTaxRate: 0.099,
    isaTaxFreeLimit: 2_000_000,
    note: "국내 주식형 ETF 매매차익은 비과세. 분배금만 15.4% 과세",
  },
  {
    id: "kr-overseas",
    label: "국내 상장 해외 ETF",
    desc: "TIGER 미국배당다우존스, ACE 나스닥100 등",
    taxRate: 0.154,
    isaTaxRate: 0.099,
    isaTaxFreeLimit: 2_000_000,
    note: "분배금 15.4% 과세. 매매차익도 배당소득세 과세. ISA 계좌 편입 가능",
  },
  {
    id: "us-listed",
    label: "미국 상장 ETF",
    desc: "CONY, YMAX, SCHD, QQQ 등 미국 직접 투자",
    taxRate: 0.15,
    isaTaxRate: 0,
    isaTaxFreeLimit: 0,
    note: "미국에서 15% 원천징수. ISA 계좌 편입 불가. 연 2,000만원 초과 시 종합과세",
  },
];

export const EDTC_META = {
  title: "ETF 분배금 세후 계산기 2026 — 국내·해외·ISA 세금 비교 | 비교계산소",
  description:
    "ETF 분배금의 세후 실수령액을 계산합니다. 국내 상장 ETF(15.4%), 미국 상장 ETF(15%), ISA 계좌(비과세) 조건별로 세금 차이와 절세 효과를 한눈에 비교하세요.",
} as const;

export const EDTC_FAQS = [
  {
    question: "국내 상장 ETF와 미국 상장 ETF의 세금 차이는?",
    answer:
      "국내 상장 ETF 분배금은 국내에서 15.4%가 원천징수됩니다. 미국 상장 ETF 분배금은 미국에서 15%가 원천징수됩니다. 세율 차이(0.4%)는 작지만, 미국 ETF는 ISA 계좌 혜택을 받지 못하고 금융소득종합과세 기준 초과 시 추가 세금이 발생합니다.",
  },
  {
    question: "ISA 계좌에서 ETF 분배금을 받으면 세금이 어떻게 되나요?",
    answer:
      "ISA 계좌(일반형) 내 연간 순이익 200만원까지 비과세, 초과분은 9.9% 분리과세입니다. 일반 계좌의 15.4%와 비교하면 최대 5.5%p 절세 효과가 있습니다. 서민형은 비과세 한도 400만원으로 더 유리합니다.",
  },
  {
    question: "ETF 분배금도 금융소득종합과세에 포함되나요?",
    answer:
      "예. 국내 상장 ETF 분배금, 미국 상장 ETF 분배금, 예금 이자 등 모든 금융소득을 합산합니다. 연간 합산 금융소득이 2,000만원을 초과하면 초과분을 다른 소득과 합산해 종합소득세를 신고해야 합니다. ISA 계좌 수익은 종합과세에서 제외됩니다.",
  },
  {
    question: "CONY·YMAX 같은 YieldMax ETF는 ISA에 넣을 수 없나요?",
    answer:
      "YieldMax ETF는 미국 증시에 상장된 ETF라 국내 ISA 계좌에 직접 편입할 수 없습니다. ISA는 국내 상장 ETF만 가능합니다. 고분배 수익을 원하면서 ISA 혜택도 받으려면 TIGER +7%프리미엄처럼 국내 상장 커버드콜 ETF를 활용하는 방법이 있습니다.",
  },
  {
    question: "ETF 분배금 세후 계산 시 환율은 어떻게 반영하나요?",
    answer:
      "미국 상장 ETF는 달러로 분배금이 지급됩니다. 원화 환산 시 지급일 기준 환율이 적용되며, 환율 변동에 따라 실제 원화 수령액이 달라집니다. 이 계산기는 원화 입력 기준으로 환율 변동은 반영하지 않습니다.",
  },
];
