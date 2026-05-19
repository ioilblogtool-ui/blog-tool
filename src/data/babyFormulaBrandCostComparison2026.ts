export type FormulaOrigin = "domestic" | "imported";
export type FormulaGrade = "standard" | "organic" | "premium";

export interface FormulaBrand {
  id: string;
  name: string;
  nameEn: string;
  manufacturer: string;
  origin: FormulaOrigin;
  grade: FormulaGrade;
  stages: FormulaStage[];
  pros: string[];
  cons: string[];
  bestFor: string;
  note: string;
}

export interface FormulaStage {
  stage: number;
  ageRange: string;
  weightG: number;
  listPrice: number;
  coupangPrice: number;
  martPrice: number;
  directImportPrice: number | null;
  pricePerHundredG: number;
  coupaUrl: string;
}

export interface PurchaseChannel {
  channel: string;
  pros: string;
  cons: string;
  discountNote: string;
  affiliateUrl: string;
}

export interface SubscriptionBenefit {
  brand: string;
  channel: string;
  discountRate: string;
  condition: string;
  monthlySaving: number;
  affiliateUrl: string;
}

export interface BfcFaq {
  question: string;
  answer: string;
}

export interface BfcLink {
  href: string;
  label: string;
}

export interface CumulativeCostRow {
  brand: string;
  pricePerHundredG: number;
  totalCost: number;
  isLowest?: boolean;
}

// ── META ────────────────────────────────────────────────
export const BFC_META = {
  slug: "baby-formula-brand-cost-comparison-2026",
  title: "2026 분유 브랜드별 실비용 완전 비교",
  seoTitle:
    "2026 분유 브랜드별 실비용 완전 비교 — 아이엠마더·앱솔루트·압타밀·시밀락 12개월 총비용",
  description:
    "국내외 분유 브랜드 9개를 1단~4단 실구매가 기준으로 비교했습니다. 월령별 월 비용 환산, 12개월 누적 비용, 쿠팡·마트·직구 최저가, 정기배송 할인까지 한 페이지에서 확인하세요.",
  updatedAt: "2026-05",
  dataNote:
    "이 리포트의 모든 가격 정보는 2026년 5월 기준 추정값입니다. 실제 가격은 판매처·시기·할인 조건에 따라 달라질 수 있으므로 구매 전 반드시 해당 판매처에서 최신 가격을 확인하세요.",
};

// ── 브랜드 데이터 ────────────────────────────────────────
export const BRANDS: FormulaBrand[] = [
  {
    id: "aimother",
    name: "남양 아이엠마더",
    nameEn: "Namyang I'm Mother",
    manufacturer: "남양유업",
    origin: "domestic",
    grade: "standard",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 32000, coupangPrice: 26000, martPrice: 29000,
        directImportPrice: null, pricePerHundredG: 3250, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 32000, coupangPrice: 26500, martPrice: 29500,
        directImportPrice: null, pricePerHundredG: 3313, coupaUrl: "",
      },
    ],
    pros: ["전국 오프라인 유통망 최강", "가격 안정성", "단계 구성 명확"],
    cons: ["프리미엄 라인과 가격 격차 큼", "해외 직구 수요 낮음"],
    bestFor: "처음 분유를 선택하는 초보 부모, 가격 대비 안정성을 중시하는 경우",
    note: "국내 점유율 1위권, 슈퍼골드·임페리얼 등 프리미엄 라인도 운영",
  },
  {
    id: "huddies",
    name: "일동후디스",
    nameEn: "Ildong Huddies",
    manufacturer: "일동후디스",
    origin: "domestic",
    grade: "standard",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 33000, coupangPrice: 27500, martPrice: 30000,
        directImportPrice: null, pricePerHundredG: 3438, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 33000, coupangPrice: 28000, martPrice: 30500,
        directImportPrice: null, pricePerHundredG: 3500, coupaUrl: "",
      },
    ],
    pros: ["HMO 성분 차별화", "산양분유 라인 추가 선택지", "소화 민감 아기 후기 긍정적"],
    cons: ["가격이 아이엠마더보다 소폭 높음", "오프라인 수급 일부 지역 불편"],
    bestFor: "소화 민감 아기, HMO 성분을 중시하는 부모",
    note: "HMO(모유올리고당) 함유 마케팅, 소화 민감 라인(산양분유 포함)",
  },
  {
    id: "absolute",
    name: "매일 앱솔루트 명작",
    nameEn: "Maeil Absolute Myeongjak",
    manufacturer: "매일유업",
    origin: "domestic",
    grade: "standard",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 34000, coupangPrice: 28000, martPrice: 31000,
        directImportPrice: null, pricePerHundredG: 3500, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 34000, coupangPrice: 28500, martPrice: 31500,
        directImportPrice: null, pricePerHundredG: 3563, coupaUrl: "",
      },
    ],
    pros: ["유산균 차별화", "구수한 맛 선호 아기 후기 많음", "정기배송 할인 적극적"],
    cons: ["향미 호불호 있음", "일부 아기 변 색상 변화 후기"],
    bestFor: "변비·소화 민감 아기, 유산균 성분을 중시하는 부모",
    note: "유산균(BL 균주) 특화, 변비·소화 민감 아기 타깃 마케팅",
  },
  {
    id: "imperial",
    name: "남양 임페리얼드림 XO",
    nameEn: "Namyang Imperial Dream XO",
    manufacturer: "남양유업",
    origin: "domestic",
    grade: "premium",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 58000, coupangPrice: 50000, martPrice: 54000,
        directImportPrice: null, pricePerHundredG: 6250, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 58000, coupangPrice: 50500, martPrice: 54500,
        directImportPrice: null, pricePerHundredG: 6313, coupaUrl: "",
      },
    ],
    pros: ["프리미엄 성분 구성", "국내 프리미엄 1위 브랜드 신뢰", "DHA·ARA·HMO 고함량"],
    cons: ["가격이 일반 분유 대비 2배 이상", "성분 차이 대비 효과 논란"],
    bestFor: "분유 비용을 크게 고려하지 않는 부모, 프리미엄 성분을 우선하는 경우",
    note: "국내 분유 최고가 라인, DHA·ARA·HMO 고함량 마케팅",
  },
  {
    id: "bebecook",
    name: "베베쿡 유기농",
    nameEn: "Bebecook Organic",
    manufacturer: "베베쿡",
    origin: "domestic",
    grade: "organic",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 42000, coupangPrice: 36000, martPrice: 39000,
        directImportPrice: null, pricePerHundredG: 4500, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 42000, coupangPrice: 36500, martPrice: 39500,
        directImportPrice: null, pricePerHundredG: 4563, coupaUrl: "",
      },
    ],
    pros: ["국내 유기농 인증", "비교적 저렴한 유기농 라인", "친환경 선호층 타깃"],
    cons: ["브랜드 인지도 낮음", "유통망 제한적"],
    bestFor: "유기농 원료를 원하지만 수입 브랜드보다 저렴한 선택지를 찾는 경우",
    note: "유기농 인증 원료, 소규모 국내 브랜드",
  },
  {
    id: "aptamil",
    name: "압타밀",
    nameEn: "Aptamil",
    manufacturer: "Danone",
    origin: "imported",
    grade: "premium",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 55000, coupangPrice: 45000, martPrice: 55000,
        directImportPrice: 48000, pricePerHundredG: 5625, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 55000, coupangPrice: 45500, martPrice: 55000,
        directImportPrice: 48000, pricePerHundredG: 5688, coupaUrl: "",
      },
    ],
    pros: ["유럽 내 임상 데이터", "소화 민감 전용 라인(HA) 있음", "Danone 계열 신뢰도"],
    cons: ["직구 시 배송·통관 리스크", "국내 CS 어려움", "단계 구분이 국내와 다름"],
    bestFor: "해외 브랜드 선호, 유럽 기준 프리미엄 성분을 중시하는 부모",
    note: "Danone 계열 유럽 프리미엄 브랜드, LCP(장쇄불포화지방산) 마케팅. 직구 기준 배송·관세 포함 추정가.",
  },
  {
    id: "hipp",
    name: "히프",
    nameEn: "HiPP",
    manufacturer: "HiPP GmbH",
    origin: "imported",
    grade: "organic",
    stages: [
      {
        stage: 1, ageRange: "0~6개월", weightG: 800,
        listPrice: 62000, coupangPrice: 55000, martPrice: 62000,
        directImportPrice: 55000, pricePerHundredG: 6875, coupaUrl: "",
      },
      {
        stage: 2, ageRange: "6~12개월", weightG: 800,
        listPrice: 62000, coupangPrice: 55000, martPrice: 62000,
        directImportPrice: 55000, pricePerHundredG: 6875, coupaUrl: "",
      },
    ],
    pros: ["유럽 최고 수준 유기농 인증", "히스타민 저감 성분 일부 포함", "독일 유기농 인증(EU)"],
    cons: ["직구가 사실상 유일한 입수 경로", "비용이 높음", "국내 위조품 주의"],
    bestFor: "유기농 인증을 최우선으로 두는 부모, 직구에 익숙한 경우",
    note: "독일 유기농 인증(EU 유기농), 직구 기준 배송·관세 포함 추정가.",
  },
  {
    id: "similac",
    name: "시밀락",
    nameEn: "Similac",
    manufacturer: "Abbott",
    origin: "imported",
    grade: "standard",
    stages: [
      {
        stage: 1, ageRange: "0~12개월 (라인별 상이)", weightG: 825,
        listPrice: 52000, coupangPrice: 48000, martPrice: 52000,
        directImportPrice: 47000, pricePerHundredG: 5818, coupaUrl: "",
      },
    ],
    pros: ["미국 소아과 처방 레퍼런스 많음", "다양한 기능별 라인", "면역·뇌 발달 마케팅"],
    cons: ["국내 단계 기준과 다름", "아이허브 품절 잦음", "oz 단위 표기 혼동"],
    bestFor: "미국 기준 분유를 원하거나 해외 육아 정보를 참고하는 부모",
    note: "Abbott 제조, Pro-Advance/Pro-Sensitive 등 기능별 라인. 아이허브 직구 기준 추정가.",
  },
  {
    id: "enfamil",
    name: "엔파밀",
    nameEn: "Enfamil",
    manufacturer: "Mead Johnson",
    origin: "imported",
    grade: "standard",
    stages: [
      {
        stage: 1, ageRange: "0~12개월 (라인별 상이)", weightG: 879,
        listPrice: 58000, coupangPrice: 54000, martPrice: 58000,
        directImportPrice: 52000, pricePerHundredG: 6144, coupaUrl: "",
      },
    ],
    pros: ["MFGM 성분 임상 데이터", "미국 베스트셀러", "DHA 함량 강조"],
    cons: ["국내 단계 구분 없음", "가격이 아이허브 기준으로도 높음"],
    bestFor: "MFGM·DHA 성분을 중시하는 부모, 미국 처방 기반을 선호하는 경우",
    note: "Mead Johnson 제조, NeuroPro/Gentlease 등 기능별 라인. 아이허브 직구 기준 추정가.",
  },
];

// ── 월령별 소비량 ────────────────────────────────────────
// 대한소아과학회 권고 참고, 추정값
export const MONTHLY_CONSUMPTION: { age: number; dailyGrams: number; monthlyGrams: number }[] = [
  { age: 0,  dailyGrams: 48, monthlyGrams: 1440 },
  { age: 1,  dailyGrams: 48, monthlyGrams: 1440 },
  { age: 2,  dailyGrams: 60, monthlyGrams: 1800 },
  { age: 3,  dailyGrams: 60, monthlyGrams: 1800 },
  { age: 4,  dailyGrams: 72, monthlyGrams: 2160 },
  { age: 5,  dailyGrams: 72, monthlyGrams: 2160 },
  { age: 6,  dailyGrams: 60, monthlyGrams: 1800 },
  { age: 7,  dailyGrams: 60, monthlyGrams: 1800 },
  { age: 8,  dailyGrams: 48, monthlyGrams: 1440 },
  { age: 9,  dailyGrams: 48, monthlyGrams: 1440 },
  { age: 10, dailyGrams: 36, monthlyGrams: 1080 },
  { age: 11, dailyGrams: 36, monthlyGrams: 1080 },
];
// 12개월 총 소비량: 20,160g → 800g 기준 약 26캔

// ── 12개월 누적 비용 ─────────────────────────────────────
// 월령별 소비량 × 100g당 단가 × 12개월, 추정값
export const CUMULATIVE_COST_ROWS: CumulativeCostRow[] = [
  { brand: "남양 아이엠마더",    pricePerHundredG: 3250, totalCost: 655200, isLowest: true },
  { brand: "일동후디스",         pricePerHundredG: 3438, totalCost: 693100 },
  { brand: "매일 앱솔루트",      pricePerHundredG: 3500, totalCost: 705600 },
  { brand: "베베쿡 유기농",      pricePerHundredG: 4500, totalCost: 907200 },
  { brand: "시밀락 (직구)",      pricePerHundredG: 5700, totalCost: 1148520 },
  { brand: "압타밀 (직구)",      pricePerHundredG: 5625, totalCost: 1134000 },
  { brand: "엔파밀 (직구)",      pricePerHundredG: 5870, totalCost: 1183300 },
  { brand: "히프 (직구)",        pricePerHundredG: 6250, totalCost: 1260000 },
  { brand: "남양 임페리얼드림",  pricePerHundredG: 6250, totalCost: 1260000 },
];

// ── 구매처 비교 ──────────────────────────────────────────
export const PURCHASE_CHANNELS: PurchaseChannel[] = [
  {
    channel: "쿠팡 로켓배송",
    pros: "빠른 배송, 정기배송 할인, 반품 편리",
    cons: "최저가 아닌 경우 있음, 할인 변동 잦음",
    discountNote: "정기배송 5~10% 추가 할인",
    affiliateUrl: "",
  },
  {
    channel: "이마트몰·롯데마트몰",
    pros: "신선도 신뢰, 오프라인 픽업 가능",
    cons: "쿠팡보다 가격 높은 경우 많음",
    discountNote: "멤버십 카드 할인, 주말 특가 간헐적",
    affiliateUrl: "",
  },
  {
    channel: "브랜드 공식몰",
    pros: "정품 보장, 멤버십 포인트, 구독 할인",
    cons: "배송 느린 경우 있음, 할인폭 제한적",
    discountNote: "첫 구매 할인 쿠폰, 정기배송 5~8%",
    affiliateUrl: "",
  },
  {
    channel: "아이허브 (해외직구)",
    pros: "시밀락·엔파밀 등 미국 브랜드 최저가",
    cons: "배송 7~14일, 관세 별도, 반품 어려움",
    discountNote: "첫 구매 5% 할인 코드, 정기배송 5%",
    affiliateUrl: "",
  },
  {
    channel: "독일·영국 아마존",
    pros: "압타밀·히프 등 유럽 브랜드 최저가",
    cons: "배송 2~3주, 통관 지연 위험, 위조품 주의",
    discountNote: "프라임 할인 적용 시 일부 추가 할인",
    affiliateUrl: "",
  },
];

// ── 구독 혜택 ────────────────────────────────────────────
export const SUBSCRIPTION_BENEFITS: SubscriptionBenefit[] = [
  {
    brand: "전 브랜드",
    channel: "쿠팡 정기배송",
    discountRate: "최대 10%",
    condition: "정기배송 설정 시 자동 적용, 언제든 해지 가능",
    monthlySaving: 2800,
    affiliateUrl: "",
  },
  {
    brand: "매일 앱솔루트",
    channel: "매일유업 공식몰",
    discountRate: "최대 8%",
    condition: "정기배송 + 회원 등급 조건",
    monthlySaving: 2240,
    affiliateUrl: "",
  },
  {
    brand: "일동후디스",
    channel: "후디스몰",
    discountRate: "최대 5%",
    condition: "정기배송 신청 후 3개월 유지 시",
    monthlySaving: 1375,
    affiliateUrl: "",
  },
  {
    brand: "시밀락·엔파밀",
    channel: "아이허브 정기배송",
    discountRate: "5%",
    condition: "아이허브 Subscribe & Save 설정",
    monthlySaving: 2300,
    affiliateUrl: "",
  },
];

// ── FAQ ──────────────────────────────────────────────────
export const BFC_FAQ: BfcFaq[] = [
  {
    question: "국산 분유와 해외 직구 분유 중 어느 쪽이 더 좋은가요?",
    answer:
      "영양 기준만 놓고 보면, 국내 식약처 기준을 충족한 분유와 해외 기준을 충족한 분유 모두 안전합니다. 해외 브랜드의 프리미엄 마케팅(LCP, MFGM 등)이 실질적인 영양 차이로 이어지는지는 과학적으로 논란이 있습니다. 직구 분유는 배송비·관세를 포함한 실비용이 예상보다 높고, 유통기한·보관 상태 확인이 어렵다는 단점이 있습니다.",
  },
  {
    question: "유기농 분유는 일반 분유보다 얼마나 비싸나요?",
    answer:
      "국내 유기농 분유(베베쿡 기준)는 일반 분유보다 1.3~1.5배, 유럽 유기농 직구(히프 기준)는 1.8~2배 이상 비쌉니다. 12개월 기준으로 유기농 분유를 선택하면 일반 분유 대비 25~60만 원 추가 지출이 예상됩니다. (추정) 유기농 분유의 장점은 원료 생산 과정의 농약·항생제 기준이 엄격하다는 것이며, 완성된 분유의 영양 성분 차이는 크지 않다는 견해도 있습니다.",
  },
  {
    question: "쿠팡 정기배송 할인이 실제로 가장 저렴한가요?",
    answer:
      "대부분의 경우 쿠팡 정기배송(최대 10% 할인)이 마트·공홈보다 저렴합니다. 다만 정기배송 수량이 실제 소비량과 맞지 않으면 남거나 부족해지는 문제가 생길 수 있습니다. 초기에는 낱개 구매로 소비량을 파악한 뒤 정기배송으로 전환하는 것을 권장합니다.",
  },
  {
    question: "분유 단계(1단·2단·3단·4단)는 언제 바꿔야 하나요?",
    answer:
      "브랜드마다 단계 기준이 다르지만, 일반적으로 1단은 0~6개월, 2단은 6~12개월, 3단은 12~24개월, 4단은 24개월 이상을 기준으로 합니다. 단계 전환 시 3~5일간 기존 분유와 새 분유를 혼합해 아기 소화 반응을 확인하며 전환하는 것이 좋습니다. 소아과 의사와 상담 후 결정하는 것을 권장합니다.",
  },
  {
    question: "분유 브랜드를 중간에 바꿔도 되나요?",
    answer:
      "가능합니다. 단, 갑작스러운 교체는 아기 소화 시스템에 부담을 줄 수 있으므로 3~5일 이상 기존 분유와 새 분유를 혼합해 단계적으로 전환하는 것이 좋습니다. 교체 후 변 상태 변화, 구토, 발진 등 알레르기 반응이 나타나면 즉시 기존 분유로 돌아가고 소아과 상담을 받으세요.",
  },
  {
    question: "압타밀·히프 직구 시 통관 문제가 있을 수 있나요?",
    answer:
      "유아용 조제분유는 식품이기 때문에 통관 시 식품 검역 절차를 거칩니다. 소량(개인 사용 목적)은 대부분 통관이 가능하지만, 대량 구매 시 통관 지연이나 반송 사례가 있습니다. 또한 위조품·유통기한 확인이 어려운 점도 주의해야 합니다. 공식 수입 제품을 구매하는 것이 가장 안전합니다.",
  },
  {
    question: "12개월 분유 총비용을 가장 효과적으로 줄이는 방법은 무엇인가요?",
    answer:
      "① 쿠팡 정기배송 최대 10% 할인 적용 ② 대용량(900g 이상) 구매로 100g당 단가 절감 ③ 모유수유 병행(혼합 수유)으로 분유 소비량 50% 감소 ④ 이유식을 6개월부터 적극적으로 진행해 분유 의존도 낮추기. 이 중 혼합 수유 전환이 가장 큰 절감 효과를 가져올 수 있습니다.",
  },
  {
    question: "분유 구매 시 유통기한은 얼마나 남은 것을 사야 하나요?",
    answer:
      "개봉 후에는 제조사 권고에 따라 1개월 이내 사용하는 것이 일반적입니다. 구매 시에는 최소 6개월 이상 유통기한이 남은 제품을 선택하는 것이 좋습니다. 직구 분유는 배송 기간(2~4주)이 길기 때문에 도착 후 유통기한이 충분히 남았는지 반드시 확인하세요.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────
export const BFC_RELATED_LINKS: BfcLink[] = [
  { href: "/tools/formula-cost/", label: "월령별 분유 비용 계산기" },
  { href: "/tools/diaper-cost/", label: "기저귀 비용 계산기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아부터 돌까지 육아비용 총정리" },
  { href: "/reports/baby-cost-2016-vs-2026/", label: "아이 키우는 비용 2016 vs 2026" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직·단축근무 급여 계산기" },
];
