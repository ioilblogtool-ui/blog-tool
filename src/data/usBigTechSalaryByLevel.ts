export type BigTechCompanyId =
  | "nvidia"
  | "apple"
  | "amazon"
  | "microsoft"
  | "tesla"
  | "oracle";

export type CompTier = "entry" | "mid" | "senior" | "staff" | "principal";

export type EvidenceBadge = "추정" | "levels.fyi 기준" | "표본 적음";

export interface BigTechLevelEntry {
  tier: CompTier;
  levelLabel: string;
  roleExample: string;
  yearsExperience: string;
  baseUsd: number;
  stockUsd: number;
  bonusUsd: number;
  totalUsd: number;
  badge: EvidenceBadge;
}

export interface CompanyProfile {
  founded: string;
  employees: string;
  employeesAsOf: string;
  revenue: string;
  netIncome: string;
  financialsAsOf: string;
  growthNote: string;
  topPay: string;
  topPayAsOf: string;
}

export interface BigTechCompanyConfig {
  id: BigTechCompanyId;
  name: string;
  nameEn: string;
  shortName: string;
  slug: string;
  industrySummary: string;
  stockNote: string;
  levels: BigTechLevelEntry[];
  sourceNote: string;
  caution: string;
  detailHref: string;
  profile: CompanyProfile;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLinkItem {
  href: string;
  label: string;
}

// 사이트 공통 환율 가정 (usStockExchangeProfitCalculator.ts 등과 동일 기준)
export const EXCHANGE_RATE_KRW = 1400;
export const EXCHANGE_RATE_RANGE = { min: 1200, max: 1600, step: 10 };

export const COMP_TIER_ORDER: CompTier[] = ["entry", "mid", "senior", "staff", "principal"];

export const COMP_TIER_META: Record<CompTier, { label: string; shortLabel: string; yearsHint: string }> = {
  entry: { label: "엔트리 (신입~2년)", shortLabel: "엔트리", yearsHint: "0~2년" },
  mid: { label: "미드 (3~5년)", shortLabel: "미드", yearsHint: "3~5년" },
  senior: { label: "시니어 (5~8년)", shortLabel: "시니어", yearsHint: "5~8년" },
  staff: { label: "스태프 (8~12년)", shortLabel: "스태프", yearsHint: "8~12년" },
  principal: { label: "프린시플 (12년+)", shortLabel: "프린시플", yearsHint: "12년+" },
};

// 원화 환산 헬퍼 (계산기/리포트 공용)
export const usdToKrw = (usd: number, rate: number = EXCHANGE_RATE_KRW): number => Math.round(usd * rate);

// levels.fyi 2025~2026 공개 중앙값/구간 기준 추정치. 최근 확인: 2026-06.
// Base/Stock/Bonus 세부 분해가 출처에 없는 레벨은 추세를 참고해 추정 분해(badge: "추정") 처리.
export const BIGTECH_COMPANIES: BigTechCompanyConfig[] = [
  {
    id: "apple",
    name: "애플",
    nameEn: "Apple",
    shortName: "애플",
    slug: "apple-salary-by-level-2026",
    industrySummary: "ICT2~ICT6 레벨 체계이며, 레벨이 올라갈수록 RSU 비중이 급격히 커지는 구조입니다.",
    stockNote: "RSU는 4년 베스팅(연 25%)이 기본이며, 입사 시점 주가 대비 현재 주가 변동에 따라 실제 수령액이 달라질 수 있습니다.",
    sourceNote: "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준",
    caution: "ICT5 구간은 levels.fyi 표본 평균(약 47만 6천 달러)을 기준으로 Base/Stock/Bonus 비율을 ICT4~ICT6 추세에 맞춰 추정 분해했습니다.",
    detailHref: "/reports/apple-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "ICT2", roleExample: "Software Engineer", yearsExperience: "0~2년", baseUsd: 140_191, stockUsd: 24_934, bonusUsd: 6_360, totalUsd: 171_485, badge: "levels.fyi 기준" },
      { tier: "mid", levelLabel: "ICT3", roleExample: "Software Engineer II", yearsExperience: "3~5년", baseUsd: 166_944, stockUsd: 47_735, bonusUsd: 9_198, totalUsd: 223_877, badge: "levels.fyi 기준" },
      { tier: "senior", levelLabel: "ICT4", roleExample: "Senior Software Engineer", yearsExperience: "5~8년", baseUsd: 214_431, stockUsd: 103_944, bonusUsd: 16_845, totalUsd: 335_220, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "ICT5", roleExample: "Staff Software Engineer", yearsExperience: "8~12년", baseUsd: 250_000, stockUsd: 205_000, bonusUsd: 21_000, totalUsd: 476_000, badge: "추정" },
      { tier: "principal", levelLabel: "ICT6", roleExample: "Principal / Sr. Staff Engineer", yearsExperience: "12년+", baseUsd: 305_143, stockUsd: 450_714, bonusUsd: 39_857, totalUsd: 795_714, badge: "levels.fyi 기준" },
    ],
    profile: {
      founded: "1976년",
      employees: "약 16만 4천명",
      employeesAsOf: "2024년 9월 기준 (FY2024 연간보고서)",
      revenue: "약 3,910억 달러",
      netIncome: "약 937억 달러",
      financialsAsOf: "FY2024 (2023.10~2024.9) 기준",
      growthNote: "아이폰 중심 매출 성장은 둔화되고 있지만, 서비스 부문(앱스토어·구독)이 꾸준히 성장하며 전체 매출을 견인하고 있습니다.",
      topPay: "팀 쿡(CEO) 약 7,460만 달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준",
    },
  },
  {
    id: "nvidia",
    name: "엔비디아",
    nameEn: "NVIDIA",
    shortName: "엔비디아",
    slug: "nvidia-salary-by-level-2026",
    industrySummary: "IC2~IC6 레벨 체계이며, NSU(주가 연동 유닛) 비중이 매우 크고 IC3 이상은 사인온 보너스 외 정기 보너스가 거의 없습니다.",
    stockNote: "NSU는 분기별 6.25%씩(4년) 베스팅되며, 최근 주가 급등기에는 신규 등록 패키지의 NSU 평가액이 입사 시점보다 높게 잡혀 있을 수 있습니다.",
    sourceNote: "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준",
    caution: "IC2·IC3 구간은 levels.fyi 종합 중앙값($220K, 약 $291K)을 기준으로 Base/Stock/Bonus 비율을 IC4 이상 추세를 역산해 추정 분해했습니다. IC3 이상부터는 정기 보너스 비중이 매우 작습니다.",
    detailHref: "/reports/nvidia-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "IC2", roleExample: "Software Engineer", yearsExperience: "0~2년", baseUsd: 150_000, stockUsd: 60_000, bonusUsd: 10_000, totalUsd: 220_000, badge: "추정" },
      { tier: "mid", levelLabel: "IC3", roleExample: "Software Engineer", yearsExperience: "3~5년", baseUsd: 175_000, stockUsd: 110_000, bonusUsd: 6_000, totalUsd: 291_000, badge: "추정" },
      { tier: "senior", levelLabel: "IC4", roleExample: "Senior Software Engineer", yearsExperience: "5~8년", baseUsd: 205_000, stockUsd: 178_000, bonusUsd: 5_000, totalUsd: 388_000, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "IC5", roleExample: "Staff Engineer", yearsExperience: "8~12년", baseUsd: 230_000, stockUsd: 322_000, bonusUsd: 4_911, totalUsd: 556_911, badge: "levels.fyi 기준" },
      { tier: "principal", levelLabel: "IC6", roleExample: "Principal Engineer", yearsExperience: "12년+", baseUsd: 260_000, stockUsd: 376_000, bonusUsd: 3_917, totalUsd: 639_917, badge: "levels.fyi 기준" },
    ],
    profile: {
      founded: "1993년",
      employees: "약 3만 6천명",
      employeesAsOf: "2025년 1월 기준 (FY2025 연간보고서)",
      revenue: "약 1,305억 달러",
      netIncome: "약 729억 달러",
      financialsAsOf: "FY2025 (2024.1~2025.1) 기준",
      growthNote: "AI 가속기(데이터센터용 GPU) 수요 폭증으로 최근 2년간 매출과 주가가 모두 급격히 성장했으며, 6개사 중 성장률이 가장 높습니다.",
      topPay: "젠슨 황(CEO) 약 4,990만 달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준",
    },
  },
  {
    id: "amazon",
    name: "아마존",
    nameEn: "Amazon",
    shortName: "아마존",
    slug: "amazon-salary-by-level-2026",
    industrySummary: "L4~L7+ 레벨 체계이며, 입사 초기 1~2년은 사인온 보너스로 낮은 RSU를 보완하는 이른바 '클리프' 구조가 특징입니다.",
    stockNote: "RSU는 1년차 5%, 2년차 15%, 3·4년차 각 40%로 베스팅되어 입사 3년 차부터 총보상이 크게 늘어납니다. 표의 Stock 값은 4년 평균 환산입니다.",
    sourceNote: "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준",
    caution: "L7 이상(Senior Principal, L8)은 levels.fyi 표본이 적어 L7 대비 증가율을 다른 회사 staff→principal 비율에 맞춰 추정했습니다. 아마존은 L7을 staff와 principal 구간에 걸쳐 쓰는 경우가 많아 principal 행은 참고용입니다.",
    detailHref: "/reports/amazon-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "L4 (SDE I)", roleExample: "Software Development Engineer I", yearsExperience: "0~2년", baseUsd: 135_000, stockUsd: 45_000, bonusUsd: 9_000, totalUsd: 189_000, badge: "levels.fyi 기준" },
      { tier: "mid", levelLabel: "L5 (SDE II)", roleExample: "Software Development Engineer II", yearsExperience: "3~5년", baseUsd: 165_000, stockUsd: 100_000, bonusUsd: 7_000, totalUsd: 272_000, badge: "levels.fyi 기준" },
      { tier: "senior", levelLabel: "L6 (Senior SDE)", roleExample: "Senior SDE", yearsExperience: "5~8년", baseUsd: 185_000, stockUsd: 210_000, bonusUsd: 12_000, totalUsd: 407_000, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "L7 (Principal SDE)", roleExample: "Principal SDE", yearsExperience: "8~12년", baseUsd: 225_000, stockUsd: 390_000, bonusUsd: 19_000, totalUsd: 634_000, badge: "levels.fyi 기준" },
      { tier: "principal", levelLabel: "L7+ (Sr. Principal)", roleExample: "Senior Principal Engineer", yearsExperience: "12년+", baseUsd: 240_000, stockUsd: 520_000, bonusUsd: 25_000, totalUsd: 785_000, badge: "추정" },
    ],
    profile: {
      founded: "1994년",
      employees: "약 156만명",
      employeesAsOf: "2024년 12월 기준 (FY2024 연간보고서, 물류 인력 포함)",
      revenue: "약 6,380억 달러",
      netIncome: "약 592억 달러",
      financialsAsOf: "FY2024 (2024년 1~12월) 기준",
      growthNote: "이커머스 본업과 AWS 클라우드 부문이 함께 성장하고 있으며, AWS의 영업이익 비중이 점점 커지는 구조입니다.",
      topPay: "앤디 재시(CEO) 약 130만 달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준, 신규 대규모 RSU는 별도 다년 베스팅",
    },
  },
  {
    id: "microsoft",
    name: "마이크로소프트",
    nameEn: "Microsoft",
    shortName: "MS",
    slug: "microsoft-salary-by-level-2026",
    industrySummary: "59~67+ 숫자 레벨 체계이며, 59-60(SDE), 61-62(SDE II), 63-64(Senior SDE), 65-67(Principal)로 구분됩니다.",
    stockNote: "RSU는 5년 베스팅(연 20%)으로 다른 빅테크보다 분산되어 있어, 연간 환산 스톡 비중이 비교적 낮게 나타납니다.",
    sourceNote: "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준",
    caution: "마이크로소프트는 동일 레벨 내에서도 직군(코어 엔지니어링 vs 일반)별 보상 차이가 크고, 67(Partner) 이상은 별도 협상 영역이라 비교에서 제외했습니다. 6개사 중 총보상 수준이 가장 낮게 나타나는 점에 유의하세요.",
    detailHref: "/reports/microsoft-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "59", roleExample: "Software Engineer", yearsExperience: "0~2년", baseUsd: 120_000, stockUsd: 38_000, bonusUsd: 8_000, totalUsd: 166_000, badge: "levels.fyi 기준" },
      { tier: "mid", levelLabel: "61", roleExample: "Software Engineer II", yearsExperience: "3~5년", baseUsd: 135_000, stockUsd: 45_000, bonusUsd: 9_000, totalUsd: 189_000, badge: "levels.fyi 기준" },
      { tier: "senior", levelLabel: "63", roleExample: "Senior Software Engineer", yearsExperience: "5~8년", baseUsd: 155_000, stockUsd: 65_000, bonusUsd: 13_000, totalUsd: 233_000, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "64", roleExample: "Senior Software Engineer II", yearsExperience: "8~12년", baseUsd: 168_000, stockUsd: 85_000, bonusUsd: 19_000, totalUsd: 272_000, badge: "levels.fyi 기준" },
      { tier: "principal", levelLabel: "65", roleExample: "Principal Software Engineer", yearsExperience: "12년+", baseUsd: 180_000, stockUsd: 120_000, bonusUsd: 21_000, totalUsd: 321_000, badge: "levels.fyi 기준" },
    ],
    profile: {
      founded: "1975년",
      employees: "약 22만 8천명",
      employeesAsOf: "2024년 6월 기준 (FY2024 연간보고서)",
      revenue: "약 2,450억 달러",
      netIncome: "약 880억 달러",
      financialsAsOf: "FY2024 (2023.7~2024.6) 기준",
      growthNote: "Azure 클라우드와 AI(Copilot, OpenAI 파트너십) 관련 매출이 빠르게 성장하며 전체 실적을 견인하고 있습니다.",
      topPay: "사티아 나델라(CEO) 약 7,910만 달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준",
    },
  },
  {
    id: "tesla",
    name: "테슬라",
    nameEn: "Tesla",
    shortName: "테슬라",
    slug: "tesla-salary-by-level-2026",
    industrySummary: "P1~P6 레벨 체계이며, 빅테크 중 표본이 가장 적고 보상 구조가 비정형적입니다.",
    stockNote: "RSU 또는 스톡옵션(RSU 1주 = 옵션 3주) 중 선택할 수 있습니다. 표의 Stock 값은 RSU 기준 연 환산입니다.",
    sourceNote: "levels.fyi 2025년 하반기~2026년 상반기 데이터 기준",
    caution: "테슬라는 P5 이상 표본이 매우 적어(levels.fyi P6 보고치는 약 $767K로 P4 대비 급격한 점프) principal 행은 P4 대비 증가율을 다른 회사 staff→principal 평균 비율로 추정한 참고치입니다. 실제 분포는 매우 넓을 수 있습니다.",
    detailHref: "/reports/tesla-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "P1", roleExample: "Associate Software Engineer", yearsExperience: "0~2년", baseUsd: 105_000, stockUsd: 18_000, bonusUsd: 5_000, totalUsd: 128_000, badge: "levels.fyi 기준" },
      { tier: "mid", levelLabel: "P2", roleExample: "Software Engineer", yearsExperience: "3~5년", baseUsd: 125_000, stockUsd: 30_000, bonusUsd: 9_000, totalUsd: 164_000, badge: "levels.fyi 기준" },
      { tier: "senior", levelLabel: "P3", roleExample: "Senior Software Engineer", yearsExperience: "5~8년", baseUsd: 150_000, stockUsd: 45_000, bonusUsd: 12_000, totalUsd: 207_000, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "P4", roleExample: "Staff Software Engineer", yearsExperience: "8~12년", baseUsd: 190_000, stockUsd: 130_000, bonusUsd: 19_000, totalUsd: 339_000, badge: "levels.fyi 기준" },
      { tier: "principal", levelLabel: "P5/P6", roleExample: "Principal / Sr. Staff Engineer", yearsExperience: "12년+", baseUsd: 230_000, stockUsd: 240_000, bonusUsd: 30_000, totalUsd: 500_000, badge: "표본 적음" },
    ],
    profile: {
      founded: "2003년",
      employees: "약 12만 5천명",
      employeesAsOf: "2024년 12월 기준 (FY2024 연간보고서)",
      revenue: "약 977억 달러",
      netIncome: "약 71억 달러",
      financialsAsOf: "FY2024 (2024년 1~12월) 기준",
      growthNote: "전기차 인도량 성장세는 둔화되었지만, 에너지 저장(ESS)·자율주행 소프트웨어 등 신사업 비중이 점점 커지고 있습니다.",
      topPay: "일론 머스크(CEO) 보고 보상 약 0달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준, 2018년 스톡옵션 패키지는 법원 분쟁으로 별도 처리 중",
    },
  },
  {
    id: "oracle",
    name: "오라클",
    nameEn: "Oracle",
    shortName: "오라클",
    slug: "oracle-salary-by-level-2026",
    industrySummary: "IC-2~IC-5+ 레벨 체계(Member of Technical Staff)이며, 빅테크 중 Base 비중이 상대적으로 높고 Bonus는 거의 미미합니다.",
    stockNote: "RSU는 4년 베스팅이며 1년차 40%, 2년차 30%, 3년차 20%, 4년차 10%로 초반에 더 많이 베스팅되는 역가중 구조입니다.",
    sourceNote: "levels.fyi 2026년 3월 데이터 기준",
    caution: "오라클 IC-6 이상은 levels.fyi 공개 표본이 거의 없어 IC-5 대비 증가율을 다른 회사 staff→principal 평균 비율로 추정했습니다. IC-2~IC-5는 levels.fyi 2026년 3월 데이터 기준입니다.",
    detailHref: "/reports/oracle-salary-by-level-2026/",
    levels: [
      { tier: "entry", levelLabel: "IC-2", roleExample: "Member of Technical Staff", yearsExperience: "0~2년", baseUsd: 129_000, stockUsd: 47_000, bonusUsd: 600, totalUsd: 176_600, badge: "levels.fyi 기준" },
      { tier: "mid", levelLabel: "IC-3", roleExample: "Senior MTS", yearsExperience: "3~5년", baseUsd: 160_000, stockUsd: 62_400, bonusUsd: 100, totalUsd: 222_500, badge: "levels.fyi 기준" },
      { tier: "senior", levelLabel: "IC-4", roleExample: "Principal MTS", yearsExperience: "5~8년", baseUsd: 196_000, stockUsd: 91_200, bonusUsd: 1_200, totalUsd: 288_400, badge: "levels.fyi 기준" },
      { tier: "staff", levelLabel: "IC-5", roleExample: "Senior Principal MTS", yearsExperience: "8~12년", baseUsd: 230_000, stockUsd: 270_000, bonusUsd: 4_500, totalUsd: 504_500, badge: "levels.fyi 기준" },
      { tier: "principal", levelLabel: "IC-6", roleExample: "Architect / Sr. Director (참고)", yearsExperience: "12년+", baseUsd: 260_000, stockUsd: 380_000, bonusUsd: 6_000, totalUsd: 646_000, badge: "추정" },
    ],
    profile: {
      founded: "1977년",
      employees: "약 15만 9천명",
      employeesAsOf: "2024년 5월 기준 (FY2024 연간보고서)",
      revenue: "약 530억 달러",
      netIncome: "약 105억 달러",
      financialsAsOf: "FY2024 (2023.6~2024.5) 기준",
      growthNote: "전통 데이터베이스·ERP 사업은 안정적이며, OCI(오라클 클라우드) 인프라 매출이 빠르게 늘면서 AI 인프라 수주 기대감이 커지고 있습니다.",
      topPay: "사프라 캐츠(CEO) 약 1억 3,880만 달러",
      topPayAsOf: "2024년 위임장(Proxy) 기준, 대부분 스톡옵션 평가액",
    },
  },
];

export const getCompany = (id: BigTechCompanyId): BigTechCompanyConfig =>
  BIGTECH_COMPANIES.find((company) => company.id === id) as BigTechCompanyConfig;

export const getLevelEntry = (id: BigTechCompanyId, tier: CompTier): BigTechLevelEntry =>
  getCompany(id).levels.find((level) => level.tier === tier) as BigTechLevelEntry;

export const UBG_META = {
  title: "미국 빅테크 연봉 계산기 — 직급별 원화 환산 2026",
  seoTitle: "미국 빅테크 연봉 계산기 — 엔비디아·애플·아마존·MS·테슬라·오라클 직급별 연봉 원화 환산 2026",
  seoDescription:
    "엔비디아, 애플, 아마존, 마이크로소프트, 테슬라, 오라클의 직급(레벨)별 연봉을 levels.fyi 데이터 기준으로 원화로 환산해 계산합니다. 환율을 직접 조정해 총보상, 월 환산액, Base/Stock/Bonus 구성을 확인하세요.",
  description: "회사와 직급(레벨)을 선택하면 levels.fyi 기준 총보상을 원화로 환산해 보여주는 계산기입니다.",
  updatedAt: "2026-06-14",
};

export const UBG_FAQ: PageFaqItem[] = [
  {
    question: "이 계산기의 연봉 데이터는 어디서 가져온 건가요?",
    answer:
      "levels.fyi에 공개된 미국 빅테크 6개사(엔비디아, 애플, 아마존, 마이크로소프트, 테슬라, 오라클)의 직급별 총보상 중앙값/구간 데이터를 기준으로 합니다. 공식 연봉 자료가 아닌 사용자 제출 데이터 기반 추정치입니다.",
  },
  {
    question: "환율은 어떻게 적용되나요?",
    answer:
      "기본 환율은 1,400원/달러로 가정하며, 슬라이더로 1,200~1,600원 사이에서 직접 조정할 수 있습니다. 환율을 바꾸면 총보상, 월 환산액, 환율별 비교 테이블이 즉시 다시 계산됩니다.",
  },
  {
    question: "Base, Stock, Bonus는 각각 무엇을 의미하나요?",
    answer:
      "Base는 기본급, Stock은 RSU 등 주식 보상의 연 환산액, Bonus는 사인온/성과 보너스입니다. 회사마다 스톡 베스팅 방식과 비중이 크게 다르므로 같은 총보상이라도 실제 체감은 다를 수 있습니다.",
  },
  {
    question: "같은 레벨이라도 회사마다 연봉 차이가 큰 이유는 무엇인가요?",
    answer:
      "엔비디아, 아마존처럼 스톡 보상 비중이 매우 큰 회사는 주가 변동에 따라 총보상이 크게 달라지고, 마이크로소프트나 오라클처럼 Base 비중이 높은 회사는 상대적으로 변동성이 작습니다. 또한 levels.fyi 표본 수와 시점에 따라서도 차이가 발생할 수 있습니다.",
  },
  {
    question: "이 계산기 결과를 실제 오퍼 협상에 사용해도 되나요?",
    answer:
      "참고용으로만 활용하세요. 실제 오퍼는 지역, 직무, 평가, 입사 시점 주가, 협상 결과에 따라 표시된 수치와 크게 다를 수 있습니다. 회사별 상세 데이터는 각 회사 리포트 페이지에서 확인할 수 있습니다.",
  },
];

export const UBG_RELATED_LINKS: RelatedLinkItem[] = [
  { href: "/reports/us-bigtech-salary-comparison-2026/", label: "미국 빅테크 6개사 연봉 비교 리포트" },
  { href: "/reports/apple-salary-by-level-2026/", label: "애플 연봉 레벨별 정리 2026" },
  { href: "/tools/us-stock-exchange-profit-calculator/", label: "미국주식 환차익 계산기" },
];

export interface ReportMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  dataNote: string;
}

export const buildCompanyReportMeta = (company: BigTechCompanyConfig): ReportMeta => {
  const entry = company.levels[0];
  const principal = company.levels[company.levels.length - 1];
  return {
    slug: company.slug,
    title: `${company.name} 연봉 레벨별 정리 2026 — ${entry.levelLabel}~${principal.levelLabel} 총보상`,
    seoTitle: `${company.name}(${company.nameEn}) 연봉 레벨별 정리 2026 — ${entry.levelLabel}~${principal.levelLabel} Base·Stock·Bonus 원화 환산`,
    seoDescription: `${company.name} ${entry.levelLabel}부터 ${principal.levelLabel}까지 직급별 연봉을 levels.fyi 데이터 기준으로 Base, Stock, Bonus로 나눠 정리하고 원화로 환산했습니다.`,
    description: `${company.name}의 직급(레벨)별 연봉 구조를 levels.fyi 데이터를 기준으로 정리한 리포트입니다.`,
    updatedAt: "2026-06-14",
    dataNote: `${company.sourceNote}. 공식 발표 자료가 아닌 levels.fyi 사용자 제출 데이터 기반 추정치이며, 1달러 = ${EXCHANGE_RATE_KRW.toLocaleString()}원 기준으로 환산했습니다.`,
  };
};

export const UBG_TOOL_HREF = "/tools/us-bigtech-salary-by-level-calculator/";
export const UBC_HUB_HREF = "/reports/us-bigtech-salary-comparison-2026/";

export const UBC_META: ReportMeta = {
  slug: "us-bigtech-salary-comparison-2026",
  title: "미국 빅테크 6개사 연봉 비교 리포트 2026 — 엔비디아·애플·아마존·MS·테슬라·오라클",
  seoTitle: "미국 빅테크 연봉 비교 2026 — 엔비디아·애플·아마존·마이크로소프트·테슬라·오라클 레벨별 총보상",
  seoDescription: "엔비디아, 애플, 아마존, 마이크로소프트, 테슬라, 오라클의 엔트리~프린시플 레벨별 연봉을 levels.fyi 데이터 기준으로 한 화면에서 비교합니다.",
  description: "미국 빅테크 6개사의 직급별 연봉을 Base, Stock, Bonus 구성과 함께 비교한 리포트입니다.",
  updatedAt: "2026-06-14",
  dataNote: `levels.fyi 2025년 하반기~2026년 상반기 데이터를 기준으로 한 참고용 추정치이며, 1달러 = ${EXCHANGE_RATE_KRW.toLocaleString()}원 기준으로 환산했습니다.`,
};

export const UBC_FAQ: PageFaqItem[] = [
  {
    question: "미국 빅테크 6개사 중 연봉이 가장 높은 곳은 어디인가요?",
    answer: "levels.fyi 데이터 기준으로는 레벨이 올라갈수록 엔비디아와 아마존의 상위 레벨(스태프~프린시플) 총보상이 가장 높게 나타납니다. 다만 이는 스톡(주식) 비중이 큰 회사일수록 주가 변동에 따라 총보상이 크게 달라질 수 있다는 점을 함께 고려해야 합니다.",
  },
  {
    question: "왜 같은 레벨인데 회사마다 연봉이 이렇게 차이가 나나요?",
    answer: "회사마다 레벨 체계, 보상 철학(Base 중심 vs Stock 중심), levels.fyi 표본 수와 시점이 다르기 때문입니다. 마이크로소프트와 오라클은 Base 비중이 높고 상대적으로 안정적인 반면, 엔비디아와 아마존은 Stock 비중이 매우 커서 주가에 따라 총보상이 크게 달라질 수 있습니다.",
  },
  {
    question: "엔트리 레벨에서는 어떤 회사가 가장 유리한가요?",
    answer: "엔트리 레벨에서는 회사 간 총보상 차이가 상위 레벨보다 상대적으로 작습니다. 다만 애플과 엔비디아가 levels.fyi 기준으로 다소 높은 편이며, 테슬라는 상대적으로 낮게 나타납니다. 정확한 수치는 본문의 비교 표를 참고하세요.",
  },
  {
    question: "이 리포트의 원화 환산 금액은 어떤 환율을 기준으로 하나요?",
    answer: `1달러 = ${EXCHANGE_RATE_KRW.toLocaleString()}원 기준으로 환산했습니다. 다른 환율을 적용하고 싶다면 미국 빅테크 연봉 계산기에서 환율을 직접 조정해 다시 계산할 수 있습니다.`,
  },
  {
    question: "각 회사의 더 자세한 연봉 정보는 어디서 볼 수 있나요?",
    answer: "이 리포트 하단의 회사별 리포트 카드를 클릭하면 각 회사의 레벨별 Base, Stock, Bonus 상세 데이터와 보상 구조 설명을 확인할 수 있습니다.",
  },
];

export const UBC_RELATED_LINKS: RelatedLinkItem[] = [
  { href: UBG_TOOL_HREF, label: "미국 빅테크 연봉 계산기" },
  ...BIGTECH_COMPANIES.map((c) => ({ href: c.detailHref, label: `${c.name} 연봉 레벨별 정리 2026` })),
];

// 회사별 리포트 페이지 공용 FAQ 생성기
export const buildCompanyReportFaq = (company: BigTechCompanyConfig): PageFaqItem[] => {
  const entry = company.levels[0];
  const principal = company.levels[company.levels.length - 1];
  const multiple = (principal.totalUsd / entry.totalUsd).toFixed(1);

  return [
    {
      question: `${company.name} 연봉은 levels.fyi 기준으로 얼마나 정확한가요?`,
      answer: `${company.sourceNote}을 바탕으로 했으며, 공식 발표 자료가 아닌 사용자 제출 데이터 기반 추정치입니다. ${company.caution}`,
    },
    {
      question: `${company.name} ${entry.levelLabel}과 ${principal.levelLabel}의 연봉 차이는 얼마나 되나요?`,
      answer: `levels.fyi 기준 ${entry.levelLabel}(${entry.roleExample}) 총보상은 약 $${entry.totalUsd.toLocaleString()}, ${principal.levelLabel}(${principal.roleExample})은 약 $${principal.totalUsd.toLocaleString()}로 약 ${multiple}배 차이가 납니다. 레벨이 올라갈수록 주로 ${company.id === "microsoft" || company.id === "oracle" ? "Base" : "Stock"} 비중이 커지는 구조입니다.`,
    },
    {
      question: `${company.name}의 스톡(주식 보상)은 어떻게 지급되나요?`,
      answer: company.stockNote,
    },
    {
      question: "이 페이지의 원화 환산 금액은 어떤 환율을 기준으로 하나요?",
      answer: `1달러 = ${EXCHANGE_RATE_KRW.toLocaleString()}원 기준으로 환산했습니다. 다른 환율을 적용하고 싶다면 미국 빅테크 연봉 계산기에서 직접 환율을 조정해 다시 계산할 수 있습니다.`,
    },
    {
      question: `${company.name} 연봉을 다른 빅테크와 비교하고 싶다면 어디서 볼 수 있나요?`,
      answer: "미국 빅테크 6개사 연봉 비교 리포트에서 동일 직급 구간별로 엔비디아, 애플, 아마존, 마이크로소프트, 테슬라, 오라클의 연봉을 한눈에 비교할 수 있습니다.",
    },
  ];
};

// 회사별 리포트 페이지 공용 관련 링크 생성기 (다른 5개사 + 허브 + 계산기)
export const buildCompanyReportRelatedLinks = (company: BigTechCompanyConfig): RelatedLinkItem[] => {
  const otherCompanyLinks = BIGTECH_COMPANIES.filter((c) => c.id !== company.id).map((c) => ({
    href: c.detailHref,
    label: `${c.name} 연봉 레벨별 정리 2026`,
  }));

  return [
    { href: UBC_HUB_HREF, label: "미국 빅테크 6개사 연봉 비교 리포트" },
    { href: UBG_TOOL_HREF, label: "미국 빅테크 연봉 계산기" },
    ...otherCompanyLinks,
  ];
};
