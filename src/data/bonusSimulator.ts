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
