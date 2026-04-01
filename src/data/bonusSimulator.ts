export type CompanyCode = "SAMSUNG" | "SKHYNIX" | "HYUNDAI";
export type Rank = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type Scenario = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type GrowthMode = "LOW" | "NORMAL" | "HIGH";

export interface RankOption {
  code: Rank;
  label: string;
}

export interface ScenarioOption {
  code: Scenario;
  label: string;
  description: string;
}

export interface GrowthModeOption {
  code: GrowthMode;
  label: string;
  description: string;
}

export interface BonusPreset {
  key: string;
  label: string;
  description: string;
  bonusRatio: number;
}

export interface ProjectionConfig {
  salaryGrowth: Record<GrowthMode, number>;
  bonusGrowth: Record<GrowthMode, number>;
  scenarioAdjust: Record<Scenario, number>;
}

export interface HyundaiPackageConfig {
  monthlyBaseRatio: number;
  packageRate: number;
  fixedCashBonus: number;
  giftValue: number;
  stockShares: number;
  stockReferencePrice: number;
}

export interface CompanyConfig {
  companyCode: CompanyCode;
  companyName: string;
  heroLabel: string;
  bonusModel: "SAMSUNG_TAI_OPI" | "SK_PI_PS" | "HYUNDAI_PACKAGE";
  baseSalaryByRank: Record<Rank, number>;
  defaultRank: Rank;
  defaultPresetKey: string;
  scenarioMultiplier: Record<Scenario, number>;
  presets: BonusPreset[];
  presetHeading: string;
  futureProjection: ProjectionConfig;
  notes: string[];
  payoutLabels: string[];
  hyundaiPackage?: HyundaiPackageConfig;
}

export const rankOptions: RankOption[] = [
  { code: "STAFF", label: "사원" },
  { code: "ASSISTANT_MANAGER", label: "대리" },
  { code: "MANAGER", label: "과장" },
  { code: "DEPUTY_GM", label: "차장" },
  { code: "GM", label: "부장" }
];

export const scenarioOptions: ScenarioOption[] = [
  { code: "CONSERVATIVE", label: "보수적", description: "업황 둔화와 낮은 지급률 가정" },
  { code: "BASE", label: "기준", description: "최근 공개 흐름의 평균적 가정" },
  { code: "AGGRESSIVE", label: "공격적", description: "업황 호조와 높은 지급률 가정" }
];

export const growthModeOptions: GrowthModeOption[] = [
  { code: "LOW", label: "낮음", description: "완만한 연봉 상승과 보상 증가" },
  { code: "NORMAL", label: "보통", description: "기준 시나리오에 가까운 증가" },
  { code: "HIGH", label: "높음", description: "승진 또는 업황 개선을 더 강하게 반영" }
];

export const companyConfigs: CompanyConfig[] = [
  {
    companyCode: "SAMSUNG",
    companyName: "삼성전자",
    heroLabel: "TAI + OPI",
    bonusModel: "SAMSUNG_TAI_OPI",
    baseSalaryByRank: {
      STAFF: 54000000,
      ASSISTANT_MANAGER: 70000000,
      MANAGER: 86000000,
      DEPUTY_GM: 103000000,
      GM: 124000000
    },
    defaultRank: "MANAGER",
    defaultPresetKey: "STANDARD",
    scenarioMultiplier: {
      CONSERVATIVE: 0.82,
      BASE: 1,
      AGGRESSIVE: 1.1
    },
    presets: [
      { key: "SUPPORT", label: "보수적 조직", description: "지원조직 또는 낮은 지급률 구간 느낌", bonusRatio: 0.2 },
      { key: "STANDARD", label: "평균 조직", description: "평균적 사업부 지급률 가정", bonusRatio: 0.41 },
      { key: "UPSIDE", label: "상위 조직", description: "2026년 1월 공지된 OPI 상단 구간에 가까운 상위 사업부 느낌", bonusRatio: 0.58 }
    ],
    presetHeading: "조직 프리셋",
    futureProjection: {
      salaryGrowth: { LOW: 0.025, NORMAL: 0.04, HIGH: 0.055 },
      bonusGrowth: { LOW: 0.005, NORMAL: 0.03, HIGH: 0.055 },
      scenarioAdjust: { CONSERVATIVE: -0.01, BASE: 0, AGGRESSIVE: 0.01 }
    },
    notes: [
      "삼성전자는 TAI와 OPI 구조를 단순화했습니다. 삼성 자료 기준 OPI는 연봉의 최대 50%, TAI는 월급의 최대 200% 범위입니다.",
      "연합뉴스 2026년 1월 16일 보도에서는 2025년분 OPI가 사업부별로 상단 47~50% 수준까지 공지됐습니다.",
      "이 계산기는 사업부, 개인평가, 반기 공지를 모두 단순화한 시나리오형 결과입니다."
    ],
    payoutLabels: ["TAI 추정", "OPI 추정"]
  },
  {
    companyCode: "SKHYNIX",
    companyName: "SK하이닉스",
    heroLabel: "PI + PS",
    bonusModel: "SK_PI_PS",
    baseSalaryByRank: {
      STAFF: 58000000,
      ASSISTANT_MANAGER: 76000000,
      MANAGER: 95000000,
      DEPUTY_GM: 114000000,
      GM: 135000000
    },
    defaultRank: "MANAGER",
    defaultPresetKey: "NORMAL",
    scenarioMultiplier: {
      CONSERVATIVE: 0.72,
      BASE: 1,
      AGGRESSIVE: 1.18
    },
    presets: [
      { key: "DOWN", label: "다운사이클", description: "업황 둔화와 메모리 회복 지연 가정", bonusRatio: 0.45 },
      { key: "NORMAL", label: "노멀", description: "평균 업황과 기준 지급률 가정", bonusRatio: 1.2 },
      { key: "SUPER", label: "슈퍼사이클", description: "2026년 2월 PS 2964% 사례를 일부 반영한 강한 업황 가정", bonusRatio: 2.35 }
    ],
    presetHeading: "업황 프리셋",
    futureProjection: {
      salaryGrowth: { LOW: 0.03, NORMAL: 0.05, HIGH: 0.07 },
      bonusGrowth: { LOW: -0.05, NORMAL: 0.05, HIGH: 0.13 },
      scenarioAdjust: { CONSERVATIVE: -0.02, BASE: 0, AGGRESSIVE: 0.02 }
    },
    notes: [
      "SK하이닉스는 PI와 PS를 업황 프리셋 중심으로 단순화했습니다.",
      "SK hynix Newsroom의 2026년 1월 28일 FY2025 공시에 따르면 매출 97.1467조 원, 영업이익 47.2063조 원을 기록했습니다.",
      "2026년 2월 공개된 PS 2964% 사례처럼 업황 민감도가 매우 큰 구조라 3개년 차이를 크게 보이도록 설계했습니다."
    ],
    payoutLabels: ["PI 추정", "PS 추정"]
  },
  {
    companyCode: "HYUNDAI",
    companyName: "현대자동차",
    heroLabel: "패키지 보상",
    bonusModel: "HYUNDAI_PACKAGE",
    baseSalaryByRank: {
      STAFF: 51000000,
      ASSISTANT_MANAGER: 64000000,
      MANAGER: 79000000,
      DEPUTY_GM: 94000000,
      GM: 112000000
    },
    defaultRank: "MANAGER",
    defaultPresetKey: "PACKAGE",
    scenarioMultiplier: {
      CONSERVATIVE: 0.95,
      BASE: 1,
      AGGRESSIVE: 1.06
    },
    presets: [
      { key: "PACKAGE", label: "임단협 패키지", description: "2025년 9월 잠정합의안 기준 패키지를 중심으로 반영한 가정", bonusRatio: 1 },
      { key: "STEADY", label: "안정 증가", description: "패키지는 유지하되 보수적으로 반영한 가정", bonusRatio: 0.95 },
      { key: "UPSIDE", label: "주식 포함 업사이드", description: "패키지와 주식 반영을 조금 더 강하게 잡은 가정", bonusRatio: 1.04 }
    ],
    presetHeading: "패키지 프리셋",
    futureProjection: {
      salaryGrowth: { LOW: 0.025, NORMAL: 0.037, HIGH: 0.05 },
      bonusGrowth: { LOW: 0.003, NORMAL: 0.018, HIGH: 0.03 },
      scenarioAdjust: { CONSERVATIVE: -0.003, BASE: 0, AGGRESSIVE: 0.006 }
    },
    notes: [
      "현대자동차는 임단협형 패키지 보상을 단순화해 월 기준급과 정액 보상을 합산합니다.",
      "2025년 9월 9일 보도 기준 잠정합의안에는 성과금 450% + 1,580만 원, 주식 30주, 상품권 20만 원이 포함됐습니다.",
      "주식 포함 토글은 참고용이며 실제 주가와 지급 시점에 따라 체감이 달라질 수 있습니다."
    ],
    payoutLabels: ["현금 성과급", "기타 보상"],
    hyundaiPackage: {
      monthlyBaseRatio: 0.68,
      packageRate: 4.5,
      fixedCashBonus: 15800000,
      giftValue: 200000,
      stockShares: 30,
      stockReferencePrice: 215000
    }
  }
];

// ── 다음 리포트 ───────────────────────────────────────────────────────────────
export const BS_NEXT_REPORTS = {
  main: {
    href: "/reports/new-employee-salary-2026/",
    eyebrow: "이어서 보면 좋은 리포트",
    title: "2026 신입 연봉 비교 — 70개 기업 초봉 총정리",
    desc: "반도체, 제조, IT, 금융, 공공 등 70개 기업의 신입 초봉을 비교하고 내 위치를 바로 확인하는 리포트입니다. 성과급 계산 다음 단계로 보기 좋습니다.",
    badges: ["70개 기업", "연봉", "2026"],
    cta: "70개 기업 초봉 비교 보기",
  },
  sub: [
    {
      href: "/reports/it-si-sm-salary-comparison-2026/",
      title: "IT SI·SM 대기업 평균 연봉·성과급 비교",
      desc: "삼성SDS, LG CNS, 현대오토에버, 한화시스템 ICT 등 주요 IT서비스 기업의 평균 연봉과 성과급을 비교합니다.",
      badges: ["IT서비스", "평균 연봉"],
      cta: "IT서비스 연봉·성과급 비교 보기",
    },
    {
      href: "/reports/it-salary-top10/",
      title: "IT 업계 신입 초봉 TOP 10 연봉·복지 비교",
      desc: "네이버, 카카오, SK텔레콤, 현대오토에버 등 주요 IT 기업의 초봉과 복지 포인트를 비교합니다.",
      badges: ["IT", "TOP 10"],
      cta: "IT 업계 초봉 리포트 보기",
    },
    {
      href: "/reports/insurance-salary-bonus-comparison-2026/",
      title: "국내 TOP 보험사 평균 연봉·성과급 비교",
      desc: "삼성화재, 삼성생명, 메리츠화재, 현대해상 등 주요 보험사의 평균 연봉과 총보상을 비교합니다.",
      badges: ["보험", "총보상"],
      cta: "보험사 총보상 비교 보기",
    },
    {
      href: "/reports/construction-salary-bonus-comparison-2026/",
      title: "국내 TOP 대형 건설사 평균 연봉·성과급 비교",
      desc: "현대건설, GS건설, 대우건설, 롯데건설 등 주요 대형 건설사의 총보상과 성과급 구조를 비교합니다.",
      badges: ["건설", "총보상"],
      cta: "대형 건설사 총보상 비교 보기",
    },
  ],
};

// ── 외부 참고 링크 ────────────────────────────────────────────────────────────
export const BS_EXTERNAL_REFERENCE_LINKS = [
  {
    title: "삼성전자 DART 사업보고서",
    desc: "직원 평균 급여, OPI·TAI 지급 근거, 사업부별 실적과 연간 재무 현황을 공식 수치로 확인",
    source: "금융감독원 DART",
    href: "https://dart.fss.or.kr/dsab002/main.do?autoSearch=true&textCrpNm=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90",
  },
  {
    title: "SK하이닉스 DART 사업보고서",
    desc: "직원 평균 보수, PI·PS 지급 체계, FY2025 영업이익과 보상 지급 흐름을 공시 기준으로 확인",
    source: "금융감독원 DART",
    href: "https://dart.fss.or.kr/dsab002/main.do?autoSearch=true&textCrpNm=SK%ED%95%98%EC%9D%B4%EB%8B%89%EC%8A%A4",
  },
  {
    title: "현대자동차 DART 사업보고서",
    desc: "직원 평균 보수, 임단협 패키지 내역, 연간 실적과 보상 구조를 공시 기준으로 확인",
    source: "금융감독원 DART",
    href: "https://dart.fss.or.kr/dsab002/main.do?autoSearch=true&textCrpNm=%ED%98%84%EB%8C%80%EC%9E%90%EB%8F%99%EC%B0%A8",
  },
  {
    title: "국세청 근로소득 원천징수 안내",
    desc: "성과급 과세 방식과 근로소득 세율 구조를 공식 기준으로 확인할 때 참고",
    source: "국세청",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2227&cntntsId=7708",
  },
  {
    title: "고용노동부 임금정보 시스템",
    desc: "직종·업종·규모별 평균 임금 현황을 비교하고 싶을 때 참고하는 공공 임금 통계 서비스",
    source: "고용노동부",
    href: "https://www.wage.go.kr/",
  },
];

// ── 추천 상품 (쿠팡파트너스 제휴) ────────────────────────────────────────────
export const BS_AFFILIATE_PRODUCTS = [
  {
    tag: "재테크",
    title: "세이노의 가르침",
    desc: "성과급을 자산으로 키우는 전략을 다루는 국내 대표 재테크 베스트셀러",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/efD3Lx",
  },
  {
    tag: "가계부",
    title: "자산 관리 가계부 플래너",
    desc: "성과급 수령 후 지출 계획과 자산 배분을 직접 기록하는 연간 플래너형 가계부",
    cta: "쿠팡에서 보기 →",
    href: "https://www.coupang.com/np/search?q=%EA%B0%80%EA%B3%84%EB%B6%80+%EC%9E%90%EC%82%B0%EA%B4%80%EB%A6%AC",
  },
  {
    tag: "투자 입문",
    title: "존 리의 금융문맹 탈출",
    desc: "연봉·성과급을 어떻게 운용할지 고민하는 직장인에게 추천하는 투자 기초 도서",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/efD6PQ",
  },
  {
    tag: "커리어",
    title: "직장인 커리어·연봉 협상 가이드",
    desc: "대기업 커리어 전략, 이직·연봉 협상 흐름을 정리한 직장인 실용 도서",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/efD9qx",
  },
];
