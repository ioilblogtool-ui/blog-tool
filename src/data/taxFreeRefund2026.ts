// 해외 택스프리(관광객 부가세 환급) 나라별 데이터 — 리포트(P1)와 계산기(P2)가 함께 사용
// 기준일: 2026-11-10. 설계서: docs/design/202611/tax-free-refund-by-country-2026-design.md

export type TfrMinBasis = "pre-tax" | "tax-incl" | "none";
export type TfrStatus = "verified" | "check";
export type TfrCountryCode = "JP" | "FR" | "IT" | "ES" | "DE" | "GB" | "SG" | "TH" | "TW" | "AU";
export type TfrCurrency = "JPY" | "EUR" | "GBP" | "SGD" | "THB" | "TWD" | "AUD";

export interface TfrCountry {
  code: TfrCountryCode;
  name: string;
  flag: string;
  region: "asia" | "europe" | "oceania";
  currency: TfrCurrency;
  currencyLabel: string;
  available: boolean;
  vatRate: number;
  reducedRate?: number;
  minPurchase: number | null;
  minBasis: TfrMinBasis;
  minLabel: string;
  tripTotalMin?: number;
  maxOnsite?: number;
  /** 구매금액 대비 실제 환급률 구간(추정). 공개 출처를 확인하지 못한 국가는 null */
  typicalRefundRate: [number, number] | null;
  sampleAmount: number;
  refundPlace: string;
  notes: string[];
  status: TfrStatus;
  sources: { label: string; url: string }[];
  asOf: string;
}

export const TFR_AS_OF = "2026-11-10";

export const TFR_COUNTRIES: TfrCountry[] = [
  {
    code: "JP",
    name: "일본",
    flag: "🇯🇵",
    region: "asia",
    currency: "JPY",
    currencyLabel: "엔",
    available: true,
    vatRate: 0.1,
    reducedRate: 0.08,
    minPurchase: 5000,
    minBasis: "pre-tax",
    minLabel: "같은 매장 하루 5,000엔 이상 (세금 제외)",
    typicalRefundRate: null,
    sampleAmount: 33000,
    refundPlace: "출국일 공항·항만에서 체크인 전에 면세 키오스크 또는 Visit Japan Web으로 세관 확인 → 매장·환급사업자가 환급",
    notes: [
      "2026년 11월 1일 구매분부터 세금 포함 가격으로 결제하고 출국할 때 돌려받습니다.",
      "구매일로부터 90일 안에 출국하면서 세관 확인을 받아야 합니다.",
      "한 영수증의 물품은 모두 보여줘야 하며, 일부라도 없으면 그 거래 전체가 환급 대상에서 빠집니다.",
      "환급 방법(카드·현금)과 수수료는 매장마다 다르므로 구매할 때 확인하세요.",
    ],
    status: "verified",
    sources: [
      { label: "일본 관광청 환급방식 안내", url: "https://www.mlit.go.jp/kankocho/tax-free/page01%5F000001%5F00028.html" },
      { label: "일본 관광청 환급 FAQ", url: "https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00056.html" },
    ],
    asOf: "2026-11",
  },
  {
    code: "FR",
    name: "프랑스",
    flag: "🇫🇷",
    region: "europe",
    currency: "EUR",
    currencyLabel: "유로",
    available: true,
    vatRate: 0.2,
    minPurchase: 100.01,
    minBasis: "tax-incl",
    minLabel: "같은 매장 하루 100.01유로 이상 (세금 포함)",
    typicalRefundRate: null,
    sampleAmount: 240,
    refundPlace: "EU를 마지막으로 떠나는 공항에서 전자 세관 확인(PABLO 단말)",
    notes: [
      "2020년 기준금액이 175.01유로에서 100.01유로로 낮아졌습니다.",
      "EU 여러 나라를 여행하면 EU를 마지막으로 떠나는 나라에서 세관 확인을 받습니다.",
    ],
    status: "verified",
    sources: [
      { label: "프랑스 세관 자료(BVE 기준금액)", url: "https://form.douane.gouv.fr/sites/default/files/bod/src/dana/da/Transports-fiscalite%20europeenne_20-034.pdf" },
      { label: "Legifiscal: 기준금액 인하", url: "https://www.legifiscal.fr/actualites-fiscales/2559-seuil-achats-detaxe-abaisse-100.html" },
    ],
    asOf: "2026-11",
  },
  {
    code: "IT",
    name: "이탈리아",
    flag: "🇮🇹",
    region: "europe",
    currency: "EUR",
    currencyLabel: "유로",
    available: true,
    vatRate: 0.22,
    minPurchase: 70.01,
    minBasis: "tax-incl",
    minLabel: "같은 매장 70.01유로 이상 (세금 포함)",
    typicalRefundRate: null,
    sampleAmount: 122,
    refundPlace: "EU를 마지막으로 떠나는 공항에서 세관 확인",
    notes: [
      "2024년 2월부터 기준금액이 154.94유로에서 70유로로 낮아졌습니다. 매장에 따라 70.01유로로 안내합니다.",
      "2026년 7월부터 세관 확인 절차가 간소화됐다는 보도가 있습니다. 출국 전 공항 안내를 확인하세요.",
    ],
    status: "check",
    sources: [
      { label: "GGI: 이탈리아 기준금액 인하", url: "https://www.ggi.com/news/indirect-taxes/reduction-in-the-italian-threshold-for-tax-free-shopping" },
    ],
    asOf: "2026-11",
  },
  {
    code: "ES",
    name: "스페인",
    flag: "🇪🇸",
    region: "europe",
    currency: "EUR",
    currencyLabel: "유로",
    available: true,
    vatRate: 0.21,
    minPurchase: null,
    minBasis: "none",
    minLabel: "최소금액 없음 (2018년 폐지)",
    typicalRefundRate: null,
    sampleAmount: 121,
    refundPlace: "EU를 마지막으로 떠나는 공항에서 전자 확인(DIVA 단말)",
    notes: [
      "최소금액은 없지만 소액은 대행사 수수료를 빼면 실제 환급액이 거의 남지 않을 수 있습니다.",
    ],
    status: "check",
    sources: [],
    asOf: "2026-11",
  },
  {
    code: "DE",
    name: "독일",
    flag: "🇩🇪",
    region: "europe",
    currency: "EUR",
    currencyLabel: "유로",
    available: true,
    vatRate: 0.19,
    minPurchase: 50.01,
    minBasis: "tax-incl",
    minLabel: "영수증 1장당 50.01유로 이상 (세금 포함)",
    typicalRefundRate: null,
    sampleAmount: 119,
    refundPlace: "EU를 마지막으로 떠나는 공항에서 세관이 수출 확인서에 도장",
    notes: [
      "2020년 1월부터 영수증 1장당 50.01유로 이상만 환급 대상입니다.",
      "구매 후 3개월 안에 물품을 가지고 출국해야 합니다.",
    ],
    status: "verified",
    sources: [
      { label: "IHK 하노버: 여행자 수출 면세", url: "https://www.ihk.de/hannover/hauptnavigation/recht/steuerrecht/umsatzsteuer/steuerfreie-ausfuhren-im-reiseverkehr-5218162" },
    ],
    asOf: "2026-11",
  },
  {
    code: "GB",
    name: "영국",
    flag: "🇬🇧",
    region: "europe",
    currency: "GBP",
    currencyLabel: "파운드",
    available: false,
    vatRate: 0.2,
    minPurchase: null,
    minBasis: "none",
    minLabel: "관광객 환급 제도 없음",
    typicalRefundRate: null,
    sampleAmount: 100,
    refundPlace: "—",
    notes: [
      "2021년 1월부터 관광객 부가세 환급(VAT Retail Export Scheme)이 폐지됐습니다.",
      "영국에서 산 물건은 EU 공항에서도 환급받을 수 없습니다.",
    ],
    status: "verified",
    sources: [],
    asOf: "2026-11",
  },
  {
    code: "SG",
    name: "싱가포르",
    flag: "🇸🇬",
    region: "asia",
    currency: "SGD",
    currencyLabel: "싱가포르달러",
    available: true,
    vatRate: 0.09,
    minPurchase: 100,
    minBasis: "tax-incl",
    minLabel: "같은 매장 100싱가포르달러 이상 (GST 포함, 같은 날 영수증 3장까지 합산)",
    typicalRefundRate: null,
    sampleAmount: 218,
    refundPlace: "창이·셀레타 공항 eTRS 키오스크",
    notes: [
      "TRS에 참여한 매장에서만 환급됩니다.",
      "같은 매장의 같은 날 영수증은 3장까지 합쳐 100싱가포르달러를 채울 수 있습니다.",
    ],
    status: "verified",
    sources: [
      { label: "IRAS: Tourist Refund Scheme", url: "https://www.iras.gov.sg/IRASHome/GST/Consumers/Tourist-Refund-Scheme/" },
      { label: "ICA: Tourist Refund Scheme", url: "https://ica.gov.sg/enter-depart/for-visitors/tourist-refund-scheme" },
    ],
    asOf: "2026-11",
  },
  {
    code: "TH",
    name: "태국",
    flag: "🇹🇭",
    region: "asia",
    currency: "THB",
    currencyLabel: "바트",
    available: true,
    vatRate: 0.07,
    minPurchase: 2000,
    minBasis: "tax-incl",
    minLabel: "같은 매장 하루 2,000바트 이상 + 여행 합계 5,000바트 이상",
    tripTotalMin: 5000,
    typicalRefundRate: null,
    sampleAmount: 5350,
    refundPlace: "출국일 체크인 전 세관 도장 → 출국 심사 후 환급 창구",
    notes: [
      "매장별 2,000바트 조건과 별도로 여행 전체 합계가 5,000바트 이상이어야 합니다.",
      "1개 1만바트 이상 고가품은 출국 심사 후 다시 보여줘야 합니다.",
      "환급 수수료가 빠지므로 실제 환급액은 7%보다 적습니다.",
    ],
    status: "check",
    sources: [
      { label: "태국 국세청 VRT 조건", url: "https://vrtmap.rd.go.th/gps/en/Conditions.aspx" },
    ],
    asOf: "2026-11",
  },
  {
    code: "TW",
    name: "대만",
    flag: "🇹🇼",
    region: "asia",
    currency: "TWD",
    currencyLabel: "대만달러",
    available: true,
    vatRate: 0.05,
    minPurchase: 2000,
    minBasis: "tax-incl",
    minLabel: "같은 매장 하루 2,000대만달러 이상 (세금 포함)",
    maxOnsite: 48000,
    typicalRefundRate: null,
    sampleAmount: 3150,
    refundPlace: "지정 매장 즉시 환급(48,000대만달러 이하) 또는 공항 환급 창구",
    notes: [
      "매장에 '소액 즉시 환급' 표시가 있으면 48,000대만달러 이하는 매장에서 바로 받을 수 있습니다.",
      "환급 수수료가 빠지므로 실제 환급액은 5%보다 적습니다.",
    ],
    status: "check",
    sources: [
      { label: "대만 재정부 법령", url: "https://law-out.mof.gov.tw/EngLawContent.aspx?id=10367&lan=E" },
    ],
    asOf: "2026-11",
  },
  {
    code: "AU",
    name: "호주",
    flag: "🇦🇺",
    region: "oceania",
    currency: "AUD",
    currencyLabel: "호주달러",
    available: true,
    vatRate: 0.1,
    minPurchase: 300,
    minBasis: "tax-incl",
    minLabel: "같은 사업자 합계 300호주달러 이상 (GST 포함, 출국 전 60일 안 구매)",
    typicalRefundRate: null,
    sampleAmount: 440,
    refundPlace: "공항 TRS 창구에서 물품·여권·탑승권 제시 (앱으로 미리 입력 가능)",
    notes: [
      "영수증이 여러 장이어도 같은 사업자(ABN)면 합쳐서 300호주달러를 채울 수 있습니다.",
      "환급은 카드나 호주 계좌로 받으며 입금까지 최대 60일 정도 걸릴 수 있습니다.",
    ],
    status: "verified",
    sources: [
      { label: "호주 국세청(ATO): TRS", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/rules-for-specific-transactions/international-transactions/gst-free-sales-to-travellers-departing-australia/tourist-refund-scheme" },
    ],
    asOf: "2026-11",
  },
];

/** 원화 환산 환율 (1단위당 원). 2026-11-10 매매기준율. 대만달러는 달러 환율로 환산한 참고값 */
export const TFR_FX = {
  asOf: "2026-11-10",
  note: "2026년 11월 10일 매매기준율 기준. 대만달러는 참고값입니다.",
  rates: {
    JPY: 8.4625,
    EUR: 1501.61,
    GBP: 0,
    SGD: 1047.08,
    THB: 40.09,
    TWD: 43,
    AUD: 925.8,
  } as Record<TfrCurrency, number>,
};

export const TFR_COMPARE_KRW = 1_000_000;

export const TFR_DEFAULT_INPUT = {
  country: "JP" as TfrCountryCode,
  amount: 33000,
  rateType: "standard" as "standard" | "reduced",
};

export const TFR_JAPAN_CHANGE = [
  { item: "결제", before: "매장에서 소비세를 빼고 결제", after: "소비세가 포함된 가격으로 결제" },
  { item: "환급", before: "산 순간 면세", after: "출국일 세관 확인 후 매장·환급사업자가 환급" },
  { item: "기한", before: "—", after: "구매일로부터 90일 안에 출국하며 세관 확인" },
  { item: "소모품", before: "50만엔 상한, 전용 봉투 포장", after: "상한·전용 포장 폐지, 일반물품과 구분 없음" },
  { item: "적용", before: "2026년 10월 31일 구매분까지", after: "2026년 11월 1일 구매분부터" },
];

export const TFR_JAPAN_TIPS = [
  "공항 세관 확인은 체크인 전에 해야 합니다. 수하물로 부친 뒤에는 물건을 다시 꺼낼 수 없습니다.",
  "한 영수증에 있는 물건은 모두 보여줘야 환급됩니다.",
  "제도 시행 초기라 공항 키오스크 앞 대기가 길 수 있으니 평소보다 일찍 도착하세요.",
];

export const TFR_STEPS = [
  { title: "여권 보여주고 구매", body: "택스프리 표시가 있는 매장에서 여권을 보여주고 면세 서류(또는 전자 기록)를 받습니다." },
  { title: "물건은 쓰지 않고 보관", body: "출국할 때 세관이 물건을 확인할 수 있으므로 포장을 뜯거나 사용하지 않는 편이 안전합니다." },
  { title: "출국 공항에서 세관 확인", body: "체크인 전에 키오스크나 세관 창구에서 확인을 받습니다. EU는 마지막으로 떠나는 나라에서 받습니다." },
  { title: "환급 받기", body: "카드·현금·계좌 중 매장이나 환급 대행사가 안내한 방법으로 받습니다. 현금은 수수료가 더 붙을 수 있습니다." },
];

export const TFR_REFUND_METHODS = [
  {
    method: "카드 환급",
    pros: ["현금 수수료가 없거나 적은 편", "공항에서 바로 처리하고 떠날 수 있음"],
    cons: ["입금까지 몇 주 걸릴 수 있음", "환급 시점 환율이 적용됨"],
  },
  {
    method: "현금 환급",
    pros: ["그 자리에서 바로 받음"],
    cons: ["현금 수수료가 추가로 붙는 경우가 많음", "남은 외화를 다시 원화로 바꾸면 환전 손실"],
  },
];

export const TFRR_META = {
  slug: "tax-free-refund-by-country-2026",
  eyebrow: "해외여행 쇼핑",
  title: "해외 택스프리 2026 나라별 완전 정리",
  h1: "나라별 택스프리, 얼마 사면 얼마 돌려받나",
  seoTitle: "해외 택스프리 2026 완전 정리 | 나라별 최소금액·환급률",
  seoDescription:
    "일본·프랑스·이탈리아 등 10개국 택스프리 최소 구매금액과 실제 환급률을 한눈에 비교. 2026년 11월 바뀐 일본 환급 방식과 공항 절차까지 정리했습니다.",
  description:
    "일본은 2026년 11월부터 출국할 때 돌려받는 방식으로 바뀌었습니다. 10개국 최소금액·부가세율·환급 장소를 한 표로 비교합니다.",
  updatedAt: "2026-11-10",
};

export const TFR_META = {
  slug: "tax-free-refund-calculator",
  eyebrow: "여행 쇼핑 계산기",
  h1: "택스프리, 실제로 얼마 돌려받을까",
  seoTitle: "택스프리 환급액 계산기 2026 | 나라별 실제 환급액 바로 계산",
  seoDescription:
    "여행 국가와 구매금액을 입력하면 수수료를 뺀 실제 택스프리 환급액을 원화로 바로 계산합니다. 최소금액까지 얼마 더 사야 하는지도 알려드려요.",
  description: "나라와 결제 금액만 넣으면 최대 환급액과 최소금액 충족 여부를 원화로 바로 보여줍니다.",
  updatedAt: "2026-11-10",
};

export const TFR_INFO_LINES = [
  "최대 환급액은 결제 금액에 포함된 부가세입니다. 실제로는 환급 대행사 수수료가 빠져 더 적게 받습니다.",
  `환율은 ${TFR_FX.asOf} 매매기준율 기준이며 고급 설정에서 바꿀 수 있습니다.`,
  "제도는 바뀔 수 있습니다. '확인 필요' 표시 국가는 출국 전 공식 안내를 다시 확인하세요.",
];

export const TFRR_FAQ = [
  {
    question: "일본 택스프리 2026년에 뭐가 바뀌었나요?",
    answer:
      "2026년 11월 1일 구매분부터 매장에서 소비세를 빼주지 않고, 세금 포함 가격으로 결제한 뒤 출국할 때 돌려받는 방식으로 바뀌었습니다. 구매일로부터 90일 안에 출국하면서 공항이나 항만에서 세관 확인을 받으면 매장이나 환급사업자가 소비세 상당액을 돌려줍니다.",
  },
  {
    question: "일본에서 10월에 산 물건은 어떻게 되나요?",
    answer: "2026년 10월 31일까지 산 물건은 예전 방식이 적용됩니다. 매장에서 이미 면세를 받았다면 출국할 때 기존 절차대로 반출하면 됩니다.",
  },
  {
    question: "프랑스 택스리펀 최소금액은 얼마인가요?",
    answer: "같은 매장에서 하루에 세금 포함 100.01유로 이상 사면 대상입니다. 2020년에 175.01유로에서 낮아졌습니다.",
  },
  {
    question: "유럽 여러 나라를 여행하면 어디서 환급받나요?",
    answer:
      "EU를 마지막으로 떠나는 나라의 공항에서 세관 확인을 받습니다. 예를 들어 프랑스에서 사고 이탈리아를 거쳐 로마에서 귀국하면 로마 공항에서 처리합니다.",
  },
  {
    question: "영국에서도 택스리펀을 받을 수 있나요?",
    answer: "아니요. 영국은 2021년 1월부터 관광객 부가세 환급 제도를 없앴습니다. 영국에서 산 물건은 EU 공항에서도 환급받을 수 없습니다.",
  },
  {
    question: "카드 환급과 현금 환급 중 뭐가 유리한가요?",
    answer:
      "대체로 카드 환급이 유리합니다. 현금 환급은 바로 받을 수 있지만 수수료가 더 붙는 경우가 많고, 남은 외화를 원화로 다시 바꾸면 환전 손실도 생깁니다.",
  },
  {
    question: "부가세가 20%인데 왜 20%를 다 돌려주지 않나요?",
    answer:
      "결제 금액에는 부가세가 이미 들어 있어서, 부가세 20%인 나라의 최대 환급률은 결제 금액의 16.67%(20÷120)입니다. 여기서 환급 대행사 수수료가 빠지므로 실제로 받는 금액은 더 적습니다.",
  },
  {
    question: "공항에서 세관 확인을 못 받으면 어떻게 되나요?",
    answer:
      "대부분 환급받을 수 없습니다. 일본은 출국일에 세관 확인을 받아야 하고, EU는 세관 도장이나 전자 확인 없이는 환급이 진행되지 않습니다. 체크인 전에 시간을 넉넉히 두세요.",
  },
];

export const TFR_FAQ = [
  {
    question: "일본에서 33,000엔을 사면 얼마를 돌려받나요?",
    answer: "33,000엔에는 소비세 3,000엔이 들어 있어서 최대 3,000엔을 돌려받을 수 있습니다. 매장이나 환급사업자 수수료가 있으면 그만큼 줄어듭니다.",
  },
  {
    question: "일본 최소금액 5,000엔은 세금을 포함한 금액인가요?",
    answer:
      "아니요. 세금을 뺀 금액 기준입니다. 소비세 10% 물건은 5,500엔 이상, 8% 식품은 5,400엔 이상 결제해야 기준을 넘습니다.",
  },
  {
    question: "왜 부가세율보다 적게 돌려받나요?",
    answer:
      "결제 금액에 부가세가 이미 들어 있어서 최대 환급률은 '세율 ÷ (1 + 세율)'입니다. 예를 들어 10%면 9.09%, 20%면 16.67%입니다. 여기에 대행사 수수료가 빠집니다.",
  },
  {
    question: "여러 매장에서 산 금액을 합칠 수 있나요?",
    answer:
      "대부분 같은 매장, 같은 날 구매만 합칠 수 있습니다. 호주는 같은 사업자면 영수증을 합칠 수 있고, 싱가포르는 같은 매장의 같은 날 영수증 3장까지 합칠 수 있습니다.",
  },
  {
    question: "영국을 선택하면 왜 계산이 안 되나요?",
    answer: "영국은 2021년부터 관광객 부가세 환급 제도가 없어서 환급액이 0원입니다.",
  },
  {
    question: "택스프리 환급과 입국 면세한도는 같은 건가요?",
    answer:
      "다릅니다. 택스프리는 여행한 나라의 부가세를 돌려받는 제도이고, 입국 면세한도(1인 미화 800달러)는 한국에 들어올 때 관세를 면제받는 한도입니다. 택스프리를 받아도 한도를 넘으면 한국에서 세금을 내야 합니다.",
  },
];

export const TFRR_SEO_INTRO = [
  "택스프리(Tax Free) 또는 택스리펀(Tax Refund)은 외국인 관광객이 여행지에서 산 물건을 가지고 나갈 때, 가격에 들어 있던 부가세를 돌려받는 제도입니다. 물건이 실제로 그 나라 밖으로 나간다는 것을 세관이 확인해야 하므로, 대부분의 나라에서 출국 공항의 세관 확인이 가장 중요한 단계입니다. 어디서 얼마 이상 사야 하는지, 언제 어디서 돌려받는지는 나라마다 다릅니다.",
  "2026년 가장 큰 변화는 일본입니다. 2026년 11월 1일 구매분부터 매장에서 바로 소비세를 빼주던 방식이 사라지고, 세금 포함 가격으로 결제한 뒤 출국일 공항이나 항만에서 세관 확인을 받으면 돌려받는 방식으로 바뀌었습니다. 구매일로부터 90일 안에 출국해야 하고, 소모품 50만엔 상한과 전용 봉투 포장은 없어졌습니다. 시행 초기라 공항 대기가 길 수 있으니 시간을 넉넉히 잡는 것이 좋습니다.",
  "부가세율만큼 다 돌려받는다고 생각하기 쉽지만, 결제 금액에는 부가세가 이미 들어 있어 최대 환급률은 '세율 ÷ (1 + 세율)'입니다. 부가세 20%인 프랑스는 결제 금액의 16.67%, 10%인 일본은 9.09%가 최대입니다. 유럽과 동남아 대부분은 환급 대행사를 거치므로 수수료가 빠지고, 현금으로 받으면 수수료가 더 붙는 경우가 많습니다.",
  "지역마다 규칙도 다릅니다. EU 국가는 EU를 마지막으로 떠나는 나라에서 세관 확인을 받고, 영국은 2021년부터 관광객 환급 제도가 없습니다. 싱가포르는 같은 매장 영수증 3장까지, 호주는 같은 사업자 영수증을 합쳐 최소금액을 채울 수 있습니다. 태국은 매장별 2,000바트와 별도로 여행 합계 5,000바트 조건이 있습니다. 이 리포트는 2026년 11월 10일 기준이며, 출국 전 공식 안내를 다시 확인하세요.",
];

export const TFR_SEO_INTRO = [
  "택스프리 환급액 계산기는 여행 국가와 결제 금액을 넣으면 그 안에 들어 있는 부가세, 곧 돌려받을 수 있는 최대 금액을 원화로 보여줍니다. 최소 구매금액을 넘었는지도 함께 확인하고, 모자라면 얼마를 더 사야 환급 대상이 되는지 알려줍니다. 일본, 프랑스, 이탈리아, 스페인, 독일, 영국, 싱가포르, 태국, 대만, 호주 10개국을 지원합니다.",
  "계산식은 '환급액 = 결제 금액 × 세율 ÷ (1 + 세율)'입니다. 일본처럼 최소금액을 세금을 뺀 금액으로 따지는 나라는 결제 금액에서 세금을 먼저 빼서 비교하고, 부족분은 실제로 결제해야 하는 세금 포함 금액으로 안내합니다. 일본은 일반 물품 10%와 식품·무알코올 음료 8% 세율을 따로 고를 수 있습니다.",
  "실제로 받는 금액은 대행사 수수료만큼 줄어듭니다. 수수료는 매장, 대행사, 금액 구간, 환급 방식(카드·현금)에 따라 달라 이 계산기는 기본값을 넣지 않았습니다. 영수증이나 매장 안내로 수수료를 알고 있다면 고급 설정에 직접 넣어 보세요. 환율은 2026년 11월 10일 매매기준율이 기본값이며 언제든 바꿀 수 있습니다.",
];

export const TFR_INPUT_POINTS = [
  "결제 금액은 세금이 포함된 현지 통화 금액(영수증 금액)을 넣습니다.",
  "같은 매장에서 같은 날 산 금액을 합쳐서 넣으세요. 다른 매장 금액은 보통 합칠 수 없습니다.",
  "일본 식품·음료는 8% 세율을 선택하세요.",
];

export const TFR_CRITERIA = [
  "최대 환급액 = 결제 금액 × 세율 ÷ (1 + 세율)",
  "수수료 반영 환급액 = 최대 환급액 × (1 − 수수료율)",
  `원화 환산은 ${TFR_FX.asOf} 매매기준율 기준(대만달러는 참고값)`,
  "국가별 최소금액·제도는 2026년 11월 10일 기준이며 바뀔 수 있습니다.",
];

export const TFRR_CRITERIA = [
  "국가별 제도는 2026년 11월 10일 기준 각국 정부·세관 자료와 공항 안내를 기준으로 정리했습니다.",
  "'확인 필요' 국가는 공식 출처를 끝까지 확인하지 못한 항목이 있어 출국 전 재확인이 필요합니다.",
  "최대 환급률은 계산식 값이며, 실제 환급액은 대행사 수수료에 따라 더 적습니다.",
  "원화 환산은 2026년 11월 10일 매매기준율 기준 참고값입니다.",
];

export const TFR_RELATED_LINKS = [
  { href: "/reports/tax-free-refund-by-country-2026/", label: "해외 택스프리 2026 나라별 정리" },
  { href: "/reports/travel-card-vs-exchange-2026/", label: "트래블카드 vs 환전 vs ATM 비교" },
  { href: "/tools/travel-exchange-calculator/", label: "여행 환전 손익 계산기" },
  { href: "/tools/overseas-travel-cost/", label: "해외여행 경비 계산기" },
  { href: "/reports/overseas-travel-cost-compare-2026/", label: "해외여행 비용 비교 2026" },
];

export const TFRR_RELATED_LINKS = [
  { href: "/tools/tax-free-refund-calculator/", label: "택스프리 환급액 계산기" },
  { href: "/reports/travel-card-vs-exchange-2026/", label: "트래블카드 vs 환전 vs ATM 비교" },
  { href: "/tools/travel-exchange-calculator/", label: "여행 환전 손익 계산기" },
  { href: "/reports/travel-peak-offpeak-cost-comparison-2026/", label: "여행 성수기·비수기 비용 비교" },
  { href: "/tools/overseas-travel-cost/", label: "해외여행 경비 계산기" },
];

/** 순수 계산 함수 — 리포트 SSR과 계산기 SSR 초기값이 같은 식을 쓰도록 공유 */
export function tfrCalc(country: TfrCountry, amount: number, rateType: "standard" | "reduced" = "standard") {
  const r = rateType === "reduced" && country.reducedRate ? country.reducedRate : country.vatRate;
  const preTax = amount / (1 + r);
  const vat = amount - preTax;
  const basisAmount = country.minBasis === "pre-tax" ? preTax : amount;
  const meetsMin =
    country.minBasis === "none" || country.minPurchase == null || basisAmount >= country.minPurchase - 1e-6;
  const requiredInclusive =
    country.minPurchase == null ? 0 : country.minBasis === "pre-tax" ? country.minPurchase * (1 + r) : country.minPurchase;
  const shortfall = meetsMin ? 0 : requiredInclusive - amount;
  return { r, preTax, vat, maxRate: r / (1 + r), meetsMin, requiredInclusive, shortfall };
}
