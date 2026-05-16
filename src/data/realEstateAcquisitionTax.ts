export type AcquisitionType = "buy" | "gift" | "inherit";
export type PropertyType = "housing" | "nonHousing";

export interface SimulationCase {
  label: string;
  condition: string;
  price: number;
  rateLabel: string;
  acquisitionTax: number;
  localEducationTax: number;
  ruralSpecialTax: number;
  totalTax: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const REAT_META = {
  slug: "real-estate-acquisition-tax",
  title: "부동산 취득세 계산기",
  seoTitle: "부동산 취득세 계산기 2026 - 아파트·주택 매매·증여·상속 취득세 자동 계산",
  description:
    "취득가액, 주택 수, 조정대상지역 여부, 전용면적을 입력하면 취득세율, 취득세, 지방교육세, 농어촌특별세, 총 납부세액을 자동으로 계산합니다.",
  updatedAt: "2026-05-11",
  caution:
    "이 계산기는 2026년 공개 법령 기준의 참고용 추정 도구입니다. 실제 신고 전에는 위택스, 관할 지자체 또는 세무 전문가에게 최종 확인하세요.",
} as const;

export const REAT_DEFAULTS = {
  acquisitionType: "buy" as AcquisitionType,
  propertyType: "housing" as PropertyType,
  price: 500_000_000,
  houseCountAfter: 1,
  isAdjusted: false,
  giftAppraisalPrice: 0,
  area: 84,
};

export const REAT_QUICK_PRICES = [
  { label: "3억", value: 300_000_000 },
  { label: "5억", value: 500_000_000 },
  { label: "7.5억", value: 750_000_000 },
  { label: "9억", value: 900_000_000 },
  { label: "12억", value: 1_200_000_000 },
];

export const REAT_SIMULATION_CASES: SimulationCase[] = [
  {
    label: "1주택 3억 매매",
    condition: "비조정 · 84㎡",
    price: 300_000_000,
    rateLabel: "1%",
    acquisitionTax: 3_000_000,
    localEducationTax: 300_000,
    ruralSpecialTax: 0,
    totalTax: 3_300_000,
  },
  {
    label: "1주택 5억 매매",
    condition: "비조정 · 84㎡",
    price: 500_000_000,
    rateLabel: "1%",
    acquisitionTax: 5_000_000,
    localEducationTax: 500_000,
    ruralSpecialTax: 0,
    totalTax: 5_500_000,
  },
  {
    label: "1주택 7.5억 매매",
    condition: "비조정 · 84㎡",
    price: 750_000_000,
    rateLabel: "2%",
    acquisitionTax: 15_000_000,
    localEducationTax: 1_500_000,
    ruralSpecialTax: 0,
    totalTax: 16_500_000,
  },
  {
    label: "1주택 9억 매매",
    condition: "비조정 · 84㎡",
    price: 900_000_000,
    rateLabel: "3%",
    acquisitionTax: 27_000_000,
    localEducationTax: 2_700_000,
    ruralSpecialTax: 0,
    totalTax: 29_700_000,
  },
  {
    label: "1주택 12억 매매",
    condition: "비조정 · 84㎡",
    price: 1_200_000_000,
    rateLabel: "3%",
    acquisitionTax: 36_000_000,
    localEducationTax: 3_600_000,
    ruralSpecialTax: 0,
    totalTax: 39_600_000,
  },
  {
    label: "2주택 8억 매매",
    condition: "조정대상지역 · 90㎡",
    price: 800_000_000,
    rateLabel: "8%",
    acquisitionTax: 64_000_000,
    localEducationTax: 3_200_000,
    ruralSpecialTax: 4_800_000,
    totalTax: 72_000_000,
  },
  {
    label: "3주택 6억 매매",
    condition: "중과 · 84㎡",
    price: 600_000_000,
    rateLabel: "12%",
    acquisitionTax: 72_000_000,
    localEducationTax: 2_400_000,
    ruralSpecialTax: 0,
    totalTax: 74_400_000,
  },
];

export const REAT_TIPS = [
  {
    title: "매매",
    points: [
      "취득세 신고·납부 기한은 취득일로부터 60일 이내입니다.",
      "취득가액은 실거래가 기준이며 허위 신고 시 추징 대상이 될 수 있습니다.",
      "일시적 2주택, 생애최초 감면 등 특례는 별도 요건 확인이 필요합니다.",
    ],
  },
  {
    title: "증여",
    points: [
      "증여 취득세와 증여세는 별도로 계산됩니다.",
      "조정대상지역 내 공시가격 3억 원 이상 주택 증여는 중과 가능성이 큽니다.",
      "공시가격과 시가 중 어떤 기준을 쓸지는 실제 신고 전 확인해야 합니다.",
    ],
  },
  {
    title: "상속",
    points: [
      "상속 취득세는 일반적으로 상속 개시일이 속한 달의 말일부터 6개월 이내 신고합니다.",
      "주택 상속은 기본 2.8%, 농지는 별도 세율이 적용될 수 있습니다.",
      "상속세와 취득세는 별도 세목이므로 함께 검토해야 합니다.",
    ],
  },
];

export const REAT_FAQ: FaqItem[] = [
  {
    question: "취득세는 언제 납부해야 하나요?",
    answer:
      "매매와 증여는 일반적으로 취득일 또는 등기일 기준 60일 이내에 신고·납부합니다. 상속은 상속 개시일이 속한 달의 말일부터 6개월 이내가 일반적입니다. 기한을 넘기면 가산세가 발생할 수 있습니다.",
  },
  {
    question: "6억~9억 주택은 취득세율이 2%로 고정인가요?",
    answer:
      "아닙니다. 6억 원 초과~9억 원 이하 주택은 가격에 따라 1~3% 사이에서 비례 세율이 적용됩니다. 예를 들어 7억 5천만 원은 2%, 8억 원은 약 2.33%입니다.",
  },
  {
    question: "2주택자는 무조건 8%인가요?",
    answer:
      "취득 후 2주택이라도 비조정대상지역은 일반세율이 적용될 수 있고, 조정대상지역 주택을 취득하면 8% 중과세율이 적용될 수 있습니다. 일시적 2주택 특례 등은 별도 확인이 필요합니다.",
  },
  {
    question: "농어촌특별세는 언제 붙나요?",
    answer:
      "일반 주택 유상취득에서는 전용면적 85㎡ 초과 주택에 주로 붙습니다. 중과세율이 적용되는 경우 농어촌특별세율도 달라질 수 있어 계산 결과의 노트를 함께 봐야 합니다.",
  },
  {
    question: "증여받은 주택의 취득세는 누가 내나요?",
    answer:
      "취득세는 주택을 받는 사람, 즉 수증자가 신고·납부합니다. 증여세도 별도 신고 대상이므로 증여 계획 단계에서는 취득세와 증여세를 함께 계산해야 합니다.",
  },
  {
    question: "오피스텔은 주택인가요, 비주택인가요?",
    answer:
      "오피스텔은 공부상 용도와 실제 사용 현황에 따라 판단이 달라질 수 있습니다. 주거용으로 사용되는 경우 주택 수 산정과 세율 적용에 영향을 줄 수 있으므로 관할 지자체 확인이 필요합니다.",
  },
  {
    question: "생애최초 주택 구입 감면도 반영되나요?",
    answer:
      "이 계산기는 기본 세율 계산에 집중하며 생애최초, 출산가구, 지방 미분양 등 감면 특례는 자동 반영하지 않습니다. 해당 가능성이 있으면 결과에서 별도 감면 가능성을 확인해야 합니다.",
  },
  {
    question: "계산기 결과와 실제 납부액이 다를 수 있나요?",
    answer:
      "네. 실제 세액은 취득일, 주택 수 산정, 조정대상지역 여부, 감면 요건, 지자체 해석에 따라 달라질 수 있습니다. 최종 신고 전 위택스나 관할 시·군·구청 확인이 필요합니다.",
  },
];

export const REAT_RELATED_LINKS = [
  { href: "/tools/home-purchase-fund/", label: "내 집 마련 자금 계산기" },
  { href: "/tools/jeonse-vs-wolse-calculator/", label: "전세 vs 월세 손익 계산기" },
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환율 계산기" },
  { href: "/tools/apt-cheonyak-gajum-calculator/", label: "아파트 청약 가점 계산기" },
  { href: "/reports/seoul-apartment-price-2026/", label: "서울 구별 아파트 실거래가" },
];

export const REAT_SOURCE_LINKS = [
  { href: "https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000225625", label: "국가법령정보센터 지방세법 제11조" },
  { href: "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=2&cciNo=2&cnpClsNo=4&csmSeq=666&menuType=cnpcls&popMenu=ov", label: "찾기쉬운 생활법령정보 취득세 안내" },
  { href: "https://www.wetax.go.kr/", label: "위택스" },
];
