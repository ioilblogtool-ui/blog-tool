// 반도체 밸류체인 리포트 데이터
// 출처: 기업 IR / 사업보고서 / CompaniesMarketCap / 운용사 팩트시트
// 기준일: 2026-04-09

export type StepId = "design" | "equip" | "foundry" | "memory" | "packaging" | "test";
export type CompanyCountry = "US" | "KR" | "TW" | "NL";

export interface StepMyth {
  claim: string;
  fact: string;
}

export interface ValueChainStep {
  id: StepId;
  num: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  fullDesc: string;
  myth: StepMyth;
  usStrength: number;
  krStrength: number;
  companyIds: string[];
}

export interface CompanyRevenue {
  value: string;
  krwApprox?: string;
  period: string;
  growth?: string;
}

export interface CompanyOperating {
  value: string;
  krwApprox?: string;
  margin?: string;
  growth?: string;
}

export interface CompanyEmployees {
  value: string;
  asOf?: string;
  growth5y?: string;
}

export interface CompanyGrowthMetric {
  label: string;
  value: string;
}

export interface ValueChainCompany {
  id: string;
  name: string;
  ticker: string;
  country: CompanyCountry;
  flag: string;
  stepId: StepId;
  marketCapDisplay: string;
  marketCapKrwDisplay: string;
  marketCapUsd: number;
  revenue?: CompanyRevenue;
  operatingIncome?: CompanyOperating;
  employees?: CompanyEmployees;
  foundedYear: number;
  ageLabel: string;
  hq: string;
  segment: string;
  scaleNote: string;
  roleDesc: string;
  whyItMatters: string;
  growth5y: CompanyGrowthMetric[];
  demandDrivers: string[];
  etfs: string[];
}

export interface VcMeta {
  updatedAt: string;
  usdKrw: number;
  dataNote: string;
  fxNote: string;
  disclaimer: string;
}

export const VC_META: VcMeta = {
  updatedAt: "2026-04-09",
  usdKrw: 1507.01,
  dataNote: "시총은 2026-04-09 기준 추산값이며, 매출·영업이익·직원 수는 최근 공시 연간 기준입니다.",
  fxNote: "원화 환산은 이해를 돕기 위한 단순 환산값입니다. 1달러=1,507원 기준으로 계산했습니다.",
  disclaimer: "이 콘텐츠는 투자 권유가 아닙니다. 실제 투자 판단은 본인 책임이며 추가 검증이 필요합니다.",
};

export const VC_STEPS: ValueChainStep[] = [
  {
    id: "design",
    num: "1단계",
    name: "설계 (팹리스)",
    nameEn: "Fabless Design",
    shortDesc: "공장 없이 칩 설계만",
    fullDesc:
      "공장 없이 칩 설계만 하는 회사들입니다. 완성된 설계도(IP)를 파운드리에 넘겨 생산을 맡기고, 브랜드·소프트웨어·생태계로 수익성을 키웁니다. AI 시대에 가치가 가장 빠르게 재평가된 구간입니다.",
    myth: {
      claim: "엔비디아는 반도체를 직접 찍어내는 제조사다",
      fact: "엔비디아는 설계 중심 회사입니다. 실제 제조는 TSMC 같은 파운드리가 맡습니다.",
    },
    usStrength: 5,
    krStrength: 0,
    companyIds: ["nvda", "qcom", "brcm", "amd"],
  },
  {
    id: "equip",
    num: "2단계",
    name: "장비·소재",
    nameEn: "Equipment & Materials",
    shortDesc: "제조 도구와 재료 공급",
    fullDesc:
      "칩을 만들기 위한 장비와 핵심 공정 재료를 공급하는 단계입니다. 노광·식각·증착·검사 장비가 없으면 파운드리도, 메모리 생산도 불가능합니다. 국가 간 기술 통제의 핵심도 이 단계입니다.",
    myth: {
      claim: "장비는 어느 나라든 금방 따라잡을 수 있다",
      fact: "EUV 노광장비는 ASML이 사실상 독점합니다. 첨단 장비는 수십 년의 기술 누적이 필요합니다.",
    },
    usStrength: 5,
    krStrength: 3,
    companyIds: ["asml", "lrcx", "klac", "amat", "wonik"],
  },
  {
    id: "foundry",
    num: "3단계",
    name: "전공정 (파운드리)",
    nameEn: "Front-End / Foundry",
    shortDesc: "설계도 → 웨이퍼 위 회로",
    fullDesc:
      "설계도를 받아 웨이퍼 위에 수백억 개의 트랜지스터를 새기는 단계입니다. 가장 자본 집약적이고, 수율 관리가 경쟁력의 핵심입니다. TSMC가 첨단 공정에서 독보적이고 삼성전자가 뒤를 쫓습니다.",
    myth: {
      claim: "파운드리는 그냥 공장이라 수익성이 낮다",
      fact: "첨단 파운드리는 가장 높은 진입장벽을 가진 인프라 사업입니다. 수율과 고객 신뢰가 해자입니다.",
    },
    usStrength: 1,
    krStrength: 4,
    companyIds: ["tsmc", "samsung"],
  },
  {
    id: "memory",
    num: "4단계",
    name: "메모리",
    nameEn: "Memory",
    shortDesc: "DRAM · NAND · HBM 생산",
    fullDesc:
      "데이터를 저장하고 고속 전달하는 칩을 만드는 단계입니다. AI 시대에는 GPU 옆에 붙는 HBM이 승부처가 됐고, 한국 기업들이 이 구간에서 강한 존재감을 보입니다.",
    myth: {
      claim: "메모리는 모두 범용이라 차별화가 어렵다",
      fact: "HBM은 적층·열관리·수율이 핵심인 고난도 제품입니다. AI 시대에 전략 자산으로 바뀌었습니다.",
    },
    usStrength: 2,
    krStrength: 5,
    companyIds: ["skhynix", "samsung", "micron"],
  },
  {
    id: "packaging",
    num: "5단계",
    name: "후공정·패키징",
    nameEn: "Back-End / Packaging",
    shortDesc: "다이싱 · 적층 · 봉지",
    fullDesc:
      "웨이퍼를 자르고 묶어 완성품으로 만드는 단계입니다. AI 칩은 단순 포장이 아니라 HBM 적층, CoWoS, 열 설계까지 포함한 고난도 패키징이 성능을 좌우합니다.",
    myth: {
      claim: "패키징은 마지막 마감이라 부가가치가 낮다",
      fact: "어드밴스드 패키징은 AI 반도체 시대의 병목입니다. 생산능력 부족이 납기 지연으로 곧바로 이어집니다.",
    },
    usStrength: 2,
    krStrength: 4,
    companyIds: ["hms", "amkor", "speta"],
  },
  {
    id: "test",
    num: "6단계",
    name: "테스트·검사",
    nameEn: "Test & Inspection",
    shortDesc: "불량 선별 · 소켓 검사",
    fullDesc:
      "완성된 칩이 제대로 동작하는지 검증하는 단계입니다. AI·HBM 시대에는 속도와 발열, 신뢰성 기준이 올라가면서 소켓·프로브핀·번인 장비의 중요성도 같이 커졌습니다.",
    myth: {
      claim: "테스트는 단순 외주 영역이라 차별화가 약하다",
      fact: "고성능 메모리와 AI 칩 테스트는 정밀도가 높아 진입장벽이 큽니다. 한국 기업들이 강합니다.",
    },
    usStrength: 1,
    krStrength: 5,
    companyIds: ["isc", "lino", "okins"],
  },
];

export const VC_COMPANIES: ValueChainCompany[] = [
  {
    id: "nvda",
    name: "NVIDIA",
    ticker: "NVDA",
    country: "US",
    flag: "🇺🇸",
    stepId: "design",
    marketCapDisplay: "$4.425T",
    marketCapKrwDisplay: "약 6,669조원",
    marketCapUsd: 4_425_000_000_000,
    revenue: { value: "215.9B USD", krwApprox: "약 325조원", period: "FY2026", growth: "+114% YoY" },
    operatingIncome: { value: "134.1B USD", krwApprox: "약 202조원", margin: "62%", growth: "5년 전 대비 급증" },
    employees: { value: "42,000+", growth5y: "+52%" },
    foundedYear: 1993,
    ageLabel: "1993년 설립 · 업력 33년",
    hq: "Santa Clara, CA",
    segment: "GPU / AI 가속기",
    scaleNote: "현재 추적 기업 중 시총 1위이며 한국 코스피 전체 시총과 비교해도 압도적인 규모입니다.",
    roleDesc: "AI GPU와 데이터센터 가속기를 설계하는 대표 팹리스입니다. 제조는 TSMC에 맡기고 CUDA와 소프트웨어 생태계로 높은 수익성을 확보했습니다.",
    whyItMatters: "AI 서버 투자 확대의 가장 직접적인 수혜 기업입니다. 반도체 산업 내 가치가 설계 단계로 얼마나 이동했는지를 보여주는 상징입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+57%" },
      { label: "영업이익 체력", value: "적자 우려 구간에서 초고마진 구조로 전환" },
      { label: "인력 증가", value: "5년간 +52%" },
    ],
    demandDrivers: ["AI 데이터센터 증설", "CUDA 락인", "차세대 Blackwell 플랫폼 확장"],
    etfs: ["SOXX", "SMH", "RISE 미국반도체NYSE"],
  },
  {
    id: "qcom",
    name: "Qualcomm",
    ticker: "QCOM",
    country: "US",
    flag: "🇺🇸",
    stepId: "design",
    marketCapDisplay: "$143B",
    marketCapKrwDisplay: "약 216조원",
    marketCapUsd: 143_240_000_000,
    revenue: { value: "38.7B USD", krwApprox: "약 58.3조원", period: "FY2024", growth: "+9% YoY" },
    operatingIncome: { value: "10.1B USD", krwApprox: "약 15.2조원", margin: "26%" },
    employees: { value: "51,000", growth5y: "+16%" },
    foundedYear: 1985,
    ageLabel: "1985년 설립 · 업력 41년",
    hq: "San Diego, CA",
    segment: "모바일 AP / 통신 칩",
    scaleNote: "스마트폰 침체 구간에도 라이선스와 프리미엄 AP 사업으로 현금창출력이 유지되는 편입니다.",
    roleDesc: "스냅드래곤 AP와 5G 모뎀 중심의 팹리스 기업입니다. 모바일 AI와 자동차용 칩으로 사업을 넓히고 있습니다.",
    whyItMatters: "스마트폰 이후 반도체 수요가 엣지 AI와 차량으로 확장될 때 대표적인 수혜 후보입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+6%" },
      { label: "사업 확장", value: "모바일 편중에서 자동차·PC로 확장" },
      { label: "인력 증가", value: "5년간 +16%" },
    ],
    demandDrivers: ["온디바이스 AI PC", "프리미엄 안드로이드", "자동차 디지털 콕핏"],
    etfs: ["SOXX", "SMH"],
  },
  {
    id: "brcm",
    name: "Broadcom",
    ticker: "AVGO",
    country: "US",
    flag: "🇺🇸",
    stepId: "design",
    marketCapDisplay: "$1.662T",
    marketCapKrwDisplay: "약 2,505조원",
    marketCapUsd: 1_662_000_000_000,
    revenue: { value: "51.6B USD", krwApprox: "약 77.8조원", period: "FY2024", growth: "+44% YoY" },
    operatingIncome: { value: "12.4B USD", krwApprox: "약 18.7조원", margin: "24%" },
    employees: { value: "40,000", growth5y: "+43%" },
    foundedYear: 1991,
    ageLabel: "1991년 설립 · 업력 35년",
    hq: "San Jose, CA",
    segment: "네트워크 / AI ASIC",
    scaleNote: "AI 주문형 칩과 소프트웨어가 같이 붙어 있어 단순 반도체 회사보다 멀티플이 높게 형성됩니다.",
    roleDesc: "네트워킹 반도체와 고객 맞춤형 AI ASIC 설계에 강한 회사입니다. VMware 인수 이후 소프트웨어 비중도 커졌습니다.",
    whyItMatters: "빅테크가 자체 AI 칩을 늘릴수록 Broadcom의 존재감이 커집니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+20%" },
      { label: "포트폴리오 변화", value: "반도체 + 인프라 소프트웨어 결합" },
      { label: "인력 증가", value: "5년간 +43%" },
    ],
    demandDrivers: ["하이퍼스케일러 ASIC 수주", "데이터센터 스위치 칩", "VMware 구독 전환"],
    etfs: ["SOXX", "SMH", "RISE 미국반도체NYSE"],
  },
  {
    id: "amd",
    name: "AMD",
    ticker: "AMD",
    country: "US",
    flag: "🇺🇸",
    stepId: "design",
    marketCapDisplay: "$378B",
    marketCapKrwDisplay: "약 570조원",
    marketCapUsd: 377_960_000_000,
    revenue: { value: "25.8B USD", krwApprox: "약 38.9조원", period: "2024", growth: "+14% YoY" },
    operatingIncome: { value: "1.7B USD", krwApprox: "약 2.6조원", margin: "7%" },
    employees: { value: "26,000", growth5y: "+95%" },
    foundedYear: 1969,
    ageLabel: "1969년 설립 · 업력 57년",
    hq: "Santa Clara, CA",
    segment: "CPU / GPU / AI 가속기",
    scaleNote: "수익성은 엔비디아보다 낮지만 서버 CPU와 AI 가속기에서 존재감이 올라오고 있습니다.",
    roleDesc: "EPYC 서버 CPU와 Instinct AI 가속기를 설계하는 팹리스입니다. Xilinx 인수 후 FPGA까지 영역을 넓혔습니다.",
    whyItMatters: "AI 인프라 투자에서 엔비디아 대체재 흐름이 생길 때 가장 먼저 거론되는 기업입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+24%" },
      { label: "사업 체질", value: "PC 중심에서 데이터센터 중심으로 이동" },
      { label: "인력 증가", value: "5년간 +95%" },
    ],
    demandDrivers: ["EPYC 서버 침투", "Instinct AI GPU", "FPGA·임베디드 확장"],
    etfs: ["SOXX", "SMH", "RISE 미국반도체NYSE"],
  },
  {
    id: "asml",
    name: "ASML",
    ticker: "ASML",
    country: "NL",
    flag: "🇳🇱",
    stepId: "equip",
    marketCapDisplay: "$558B",
    marketCapKrwDisplay: "약 841조원",
    marketCapUsd: 557_980_000_000,
    revenue: { value: "€32.7B", krwApprox: "약 52.3조원", period: "2025", growth: "+18% YoY" },
    operatingIncome: { value: "€11.3B", krwApprox: "약 18.1조원", margin: "35%" },
    employees: { value: "42,000", growth5y: "+54%" },
    foundedYear: 1984,
    ageLabel: "1984년 설립 · 업력 42년",
    hq: "Veldhoven, Netherlands",
    segment: "EUV 노광장비",
    scaleNote: "장비사이지만 시총이 한국 대표 메모리 기업과 맞먹는 수준입니다. 독점 프리미엄이 반영된 결과입니다.",
    roleDesc: "첨단 반도체 제조에 필수적인 노광장비 공급사입니다. 특히 EUV 장비는 ASML이 사실상 유일 공급자입니다.",
    whyItMatters: "3nm 이하 공정 경쟁은 결국 ASML 장비 확보 경쟁입니다. 모든 첨단 밸류체인의 시작점입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+19%" },
      { label: "수익성", value: "고객 락인 기반 고마진 유지" },
      { label: "인력 증가", value: "5년간 +54%" },
    ],
    demandDrivers: ["EUV 장비 증설", "하이-NA 신제품", "첨단 공정 투자 재개"],
    etfs: ["SMH", "SOXX", "ACE 글로벌반도체TOP4 Plus"],
  },
  {
    id: "lrcx",
    name: "Lam Research",
    ticker: "LRCX",
    country: "US",
    flag: "🇺🇸",
    stepId: "equip",
    marketCapDisplay: "$310B",
    marketCapKrwDisplay: "약 467조원",
    marketCapUsd: 309_590_000_000,
    revenue: { value: "18.4B USD", krwApprox: "약 27.7조원", period: "FY2025", growth: "+15% YoY" },
    operatingIncome: { value: "5.5B USD", krwApprox: "약 8.3조원", margin: "30%" },
    employees: { value: "18,000", growth5y: "+20%" },
    foundedYear: 1980,
    ageLabel: "1980년 설립 · 업력 46년",
    hq: "Fremont, CA",
    segment: "식각·증착 장비",
    scaleNote: "메모리 투자 사이클 영향을 크게 받지만 서비스 매출이 하방을 지지하는 구조입니다.",
    roleDesc: "식각과 증착 장비에 강한 장비사입니다. 3D NAND 적층 수가 늘수록 장비 중요도가 더 커집니다.",
    whyItMatters: "메모리와 첨단 로직 투자 회복 때 가장 빠르게 주문이 붙는 대표 장비사 중 하나입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+13%" },
      { label: "체질 변화", value: "서비스·소모품 비중 확대" },
      { label: "인력 증가", value: "5년간 +20%" },
    ],
    demandDrivers: ["3D NAND 고적층화", "HBM용 DRAM 투자", "장비 업그레이드 수요"],
    etfs: ["SOXX"],
  },
  {
    id: "klac",
    name: "KLA",
    ticker: "KLAC",
    country: "US",
    flag: "🇺🇸",
    stepId: "equip",
    marketCapDisplay: "$192B",
    marketCapKrwDisplay: "약 290조원",
    marketCapUsd: 192_480_000_000,
    revenue: { value: "10.8B USD", krwApprox: "약 16.3조원", period: "FY2024", growth: "+16% YoY" },
    operatingIncome: { value: "3.7B USD", krwApprox: "약 5.6조원", margin: "34%" },
    employees: { value: "16,000", growth5y: "+26%" },
    foundedYear: 1975,
    ageLabel: "1975년 설립 · 업력 51년",
    hq: "Milpitas, CA",
    segment: "공정 제어·검사 장비",
    scaleNote: "공정 미세화가 진행될수록 수율 관리 비용이 올라가 KLA 같은 검사 장비사의 전략 가치가 커집니다.",
    roleDesc: "공정 중 결함을 찾아내는 검사·계측 장비 1위 기업입니다. 수율 경쟁의 핵심 회사입니다.",
    whyItMatters: "첨단 공정은 만들 수 있는가보다 수율을 얼마나 빨리 안정화하느냐가 중요합니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+15%" },
      { label: "수익성", value: "검사 장비 특성상 높은 마진 유지" },
      { label: "인력 증가", value: "5년간 +26%" },
    ],
    demandDrivers: ["2nm 이하 미세공정", "HBM 수율 안정화", "공정 복잡도 증가"],
    etfs: ["SOXX", "SMH"],
  },
  {
    id: "amat",
    name: "Applied Materials",
    ticker: "AMAT",
    country: "US",
    flag: "🇺🇸",
    stepId: "equip",
    marketCapDisplay: "$306B",
    marketCapKrwDisplay: "약 462조원",
    marketCapUsd: 306_110_000_000,
    revenue: { value: "27.2B USD", krwApprox: "약 41.0조원", period: "FY2024", growth: "+2% YoY" },
    operatingIncome: { value: "7.4B USD", krwApprox: "약 11.2조원", margin: "27%" },
    employees: { value: "34,000", growth5y: "+17%" },
    foundedYear: 1967,
    ageLabel: "1967년 설립 · 업력 59년",
    hq: "Santa Clara, CA",
    segment: "CVD·PVD·CMP 장비",
    scaleNote: "전공정 전반을 커버하는 종합 장비사라 특정 공정 사이클보다 포트폴리오로 방어하는 성격이 있습니다.",
    roleDesc: "증착·식각·평탄화 등 여러 공정 장비를 공급하는 종합 장비사입니다. 반도체 장비 매출 규모로는 최상위권입니다.",
    whyItMatters: "메모리와 로직, 패키징까지 넓게 연결돼 있어 업황 체온을 읽기 좋은 회사입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+14%" },
      { label: "포트폴리오", value: "전공정 전반 + 패키징 확대" },
      { label: "인력 증가", value: "5년간 +17%" },
    ],
    demandDrivers: ["메모리 투자 재개", "첨단 로직 증설", "패키징 장비 확대"],
    etfs: ["SOXX", "RISE 미국반도체NYSE"],
  },
  {
    id: "wonik",
    name: "원익IPS",
    ticker: "240810",
    country: "KR",
    flag: "🇰🇷",
    stepId: "equip",
    marketCapDisplay: "약 $3.9B",
    marketCapKrwDisplay: "약 5.9조원",
    marketCapUsd: 3_927_000_000,
    revenue: { value: "KRW 0.8T", krwApprox: "약 0.8조원", period: "2024", growth: "+9% YoY" },
    operatingIncome: { value: "KRW 0.06T", krwApprox: "약 0.06조원", margin: "8%" },
    employees: { value: "1,800", growth5y: "+12%" },
    foundedYear: 1991,
    ageLabel: "1991년 설립 · 업력 35년",
    hq: "수원",
    segment: "국내 반도체 장비",
    scaleNote: "글로벌 장비사와 비교하면 작지만 한국 메모리 투자 사이클에 매우 민감한 실질 레버리지 기업입니다.",
    roleDesc: "삼성전자와 SK하이닉스에 증착 장비를 공급하는 국내 대표 장비사입니다.",
    whyItMatters: "국내 메모리 투자 확대가 실적에 직접 반영되는 구조입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+11%" },
      { label: "수익성", value: "장비 업황에 따라 변동성 큼" },
      { label: "인력 증가", value: "5년간 +12%" },
    ],
    demandDrivers: ["삼성·하이닉스 CapEx", "국내 장비 국산화", "HBM 증설"],
    etfs: ["RISE AI반도체TOP10"],
  },
  {
    id: "tsmc",
    name: "TSMC",
    ticker: "TSM",
    country: "TW",
    flag: "🇹🇼",
    stepId: "foundry",
    marketCapDisplay: "$1.897T",
    marketCapKrwDisplay: "약 2,860조원",
    marketCapUsd: 1_897_000_000_000,
    revenue: { value: "NT$3,809B", krwApprox: "약 164.0조원", period: "2025", growth: "+30% YoY" },
    operatingIncome: { value: "NT$1,699B", krwApprox: "약 73.1조원", margin: "45%" },
    employees: { value: "79,000", growth5y: "+42%" },
    foundedYear: 1987,
    ageLabel: "1987년 설립 · 업력 39년",
    hq: "Hsinchu, Taiwan",
    segment: "파운드리 (위탁 생산)",
    scaleNote: "추적 기업 중 설계·장비 다음으로 큰 축이며, 첨단 로직 생산에서는 사실상 글로벌 병목 인프라입니다.",
    roleDesc: "자체 칩 없이 위탁 생산만 하는 순수 파운드리입니다. NVIDIA·Apple·AMD 등 핵심 고객의 첨단 칩을 제조합니다.",
    whyItMatters: "AI 반도체 공급망의 핵심 병목입니다. 엔비디아가 잘 팔려도 결국 TSMC 생산능력이 따라줘야 합니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+22%" },
      { label: "수익성", value: "45% 안팎 영업이익률 유지" },
      { label: "인력 증가", value: "5년간 +42%" },
    ],
    demandDrivers: ["3nm·2nm 전환", "AI 가속기 생산", "애플·엔비디아 주문 증가"],
    etfs: ["SMH", "ACE 글로벌반도체TOP4 Plus"],
  },
  {
    id: "samsung",
    name: "Samsung Electronics",
    ticker: "005930",
    country: "KR",
    flag: "🇰🇷",
    stepId: "foundry",
    marketCapDisplay: "약 $909B",
    marketCapKrwDisplay: "약 1,370조원",
    marketCapUsd: 908_950_000_000,
    revenue: { value: "KRW 333.6T", krwApprox: "약 333.6조원", period: "2025", growth: "+16% YoY" },
    operatingIncome: { value: "KRW 43.6T", krwApprox: "약 43.6조원", margin: "13%", growth: "메모리 업황 반등" },
    employees: { value: "270,000", growth5y: "+9%" },
    foundedYear: 1969,
    ageLabel: "1969년 설립 · 업력 57년",
    hq: "수원 / 서울",
    segment: "메모리 · 파운드리 · 모바일",
    scaleNote: "시총보다 매출 규모가 훨씬 큰 한국 대표 제조 기업입니다. 메모리 업황에 따라 이익 변동성이 큽니다.",
    roleDesc: "메모리와 파운드리, 모바일을 동시에 운영하는 복합 반도체 기업입니다. 메모리 1위이자 파운드리 2위권입니다.",
    whyItMatters: "한국 반도체 생태계의 중심 기업으로, 메모리 사이클과 첨단 파운드리 경쟁을 동시에 보여줍니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+7%" },
      { label: "이익 흐름", value: "업황 저점 후 강한 반등 사이클" },
      { label: "인력 증가", value: "5년간 +9%" },
    ],
    demandDrivers: ["HBM 확대", "파운드리 수율 개선", "모바일·가전 현금창출력"],
    etfs: ["RISE AI반도체TOP10", "ACE AI반도체TOP3+"],
  },
  {
    id: "skhynix",
    name: "SK hynix",
    ticker: "000660",
    country: "KR",
    flag: "🇰🇷",
    stepId: "memory",
    marketCapDisplay: "약 $477B",
    marketCapKrwDisplay: "약 719조원",
    marketCapUsd: 477_330_000_000,
    revenue: { value: "KRW 97.1T", krwApprox: "약 97.1조원", period: "2025", growth: "+94% YoY" },
    operatingIncome: { value: "KRW 47.2T", krwApprox: "약 47.2조원", margin: "49%", growth: "사상 최대 수준" },
    employees: { value: "46,863", growth5y: "+11%" },
    foundedYear: 1983,
    ageLabel: "1983년 설립 · 업력 43년",
    hq: "이천",
    segment: "HBM · DRAM · NAND",
    scaleNote: "시총은 삼성보다 작지만 최근 수익성과 AI 노출도는 더 강하게 평가받는 구간입니다.",
    roleDesc: "HBM 세계 1위 기업입니다. 엔비디아 AI GPU에 들어가는 HBM3E 핵심 공급사입니다.",
    whyItMatters: "AI 메모리 시대 수혜가 가장 직접적인 한국 대표주입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+9%" },
      { label: "이익 체력", value: "적자 사이클에서 초호황 회복" },
      { label: "인력 증가", value: "5년간 +11%" },
    ],
    demandDrivers: ["HBM3E·HBM4", "AI 서버 DRAM", "고부가 메모리 믹스 개선"],
    etfs: ["RISE AI반도체TOP10", "ACE AI반도체TOP3+"],
  },
  {
    id: "micron",
    name: "Micron",
    ticker: "MU",
    country: "US",
    flag: "🇺🇸",
    stepId: "memory",
    marketCapDisplay: "$459B",
    marketCapKrwDisplay: "약 691조원",
    marketCapUsd: 458_680_000_000,
    revenue: { value: "38.8B USD", krwApprox: "약 58.5조원", period: "FY2024", growth: "+62% YoY" },
    operatingIncome: { value: "9.0B USD", krwApprox: "약 13.6조원", margin: "23%" },
    employees: { value: "48,000", growth5y: "+14%" },
    foundedYear: 1978,
    ageLabel: "1978년 설립 · 업력 48년",
    hq: "Boise, ID",
    segment: "DRAM · NAND · HBM",
    scaleNote: "미국 내 메모리 자립 전략의 핵심 축으로 정책 프리미엄이 붙는 편입니다.",
    roleDesc: "미국 유일의 대형 메모리 기업입니다. DRAM과 NAND, HBM으로 포트폴리오를 재정비하고 있습니다.",
    whyItMatters: "미국의 CHIPS Act 투자와 HBM 추격 스토리를 동시에 가진 기업입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+10%" },
      { label: "이익 흐름", value: "메모리 사이클 민감도가 높음" },
      { label: "인력 증가", value: "5년간 +14%" },
    ],
    demandDrivers: ["미국 메모리 생산 확대", "HBM 양산 추격", "정부 보조금"],
    etfs: ["SOXX", "RISE 미국반도체NYSE"],
  },
  {
    id: "hms",
    name: "한미반도체",
    ticker: "042700",
    country: "KR",
    flag: "🇰🇷",
    stepId: "packaging",
    marketCapDisplay: "약 $13.7B",
    marketCapKrwDisplay: "약 20.7조원",
    marketCapUsd: 13_736_000_000,
    revenue: { value: "KRW 0.7T", krwApprox: "약 0.7조원", period: "2024", growth: "+252% YoY" },
    operatingIncome: { value: "KRW 0.3T", krwApprox: "약 0.3조원", margin: "43%" },
    employees: { value: "900", growth5y: "+38%" },
    foundedYear: 1980,
    ageLabel: "1980년 설립 · 업력 46년",
    hq: "부천",
    segment: "HBM 본딩 장비",
    scaleNote: "매출 규모는 작지만 HBM 투자 사이클이 붙을 때 실적 탄력이 매우 큽니다.",
    roleDesc: "HBM 적층용 TC 본더 장비 공급사입니다. SK하이닉스 HBM 라인 핵심 파트너로 알려져 있습니다.",
    whyItMatters: "AI 시대 병목인 HBM 생산능력 확대와 가장 직접적으로 연결된 국내 장비 기업입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+34%" },
      { label: "영업 레버리지", value: "HBM 투자 확대 시 이익률 급상승" },
      { label: "인력 증가", value: "5년간 +38%" },
    ],
    demandDrivers: ["HBM 캐파 증설", "TC 본더 수요", "AI 메모리 패키징"],
    etfs: ["RISE AI반도체TOP10", "ACE AI반도체TOP3+"],
  },
  {
    id: "amkor",
    name: "Amkor Technology",
    ticker: "AMKR",
    country: "US",
    flag: "🇺🇸",
    stepId: "packaging",
    marketCapDisplay: "$10.9B",
    marketCapKrwDisplay: "약 16.4조원",
    marketCapUsd: 10_860_000_000,
    revenue: { value: "7.1B USD", krwApprox: "약 10.7조원", period: "2024", growth: "-5% YoY" },
    operatingIncome: { value: "0.5B USD", krwApprox: "약 0.75조원", margin: "7%" },
    employees: { value: "35,000", growth5y: "+17%" },
    foundedYear: 1968,
    ageLabel: "1968년 설립 · 업력 58년",
    hq: "Tempe, AZ",
    segment: "OSAT (외주 반도체 패키징)",
    scaleNote: "어드밴스드 패키징 기대는 크지만 전통 OSAT 사업 특성상 수익성은 상대적으로 낮습니다.",
    roleDesc: "외주 패키징·테스트(OSAT) 대표 기업입니다. 미국 내 패키징 거점 확대 전략도 병행 중입니다.",
    whyItMatters: "미국이 제조뿐 아니라 패키징까지 공급망 내재화하려는 흐름의 대표 수혜주입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+8%" },
      { label: "사업 믹스", value: "전통 OSAT에서 고부가 패키징 확장" },
      { label: "인력 증가", value: "5년간 +17%" },
    ],
    demandDrivers: ["미국 패키징 거점", "고성능 패키징", "자동차·통신 칩 물량"],
    etfs: ["XSD"],
  },
  {
    id: "speta",
    name: "이수페타시스",
    ticker: "007660",
    country: "KR",
    flag: "🇰🇷",
    stepId: "packaging",
    marketCapDisplay: "약 $6.2B",
    marketCapKrwDisplay: "약 9.3조원",
    marketCapUsd: 6_191_000_000,
    revenue: { value: "KRW 0.5T", krwApprox: "약 0.5조원", period: "2024", growth: "+23% YoY" },
    operatingIncome: { value: "KRW 0.09T", krwApprox: "약 0.09조원", margin: "18%" },
    employees: { value: "1,200", growth5y: "+15%" },
    foundedYear: 1972,
    ageLabel: "1972년 설립 · 업력 54년",
    hq: "안산",
    segment: "MLB (다층인쇄회로기판)",
    scaleNote: "칩 자체 기업은 아니지만 AI 서버 보드 공급망에서 존재감이 커지면서 반도체 인프라주로 묶입니다.",
    roleDesc: "AI 서버와 네트워크 장비용 고다층 PCB를 만드는 회사입니다. 엔비디아 서버향 공급망으로 주목받았습니다.",
    whyItMatters: "AI 투자 확대로 칩 외 주변 부품 밸류체인도 같이 커진다는 점을 보여주는 사례입니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+18%" },
      { label: "사업 포인트", value: "AI 서버향 믹스 확대" },
      { label: "인력 증가", value: "5년간 +15%" },
    ],
    demandDrivers: ["AI 서버 MLB", "고다층 네트워크 보드", "북미 고객 확대"],
    etfs: ["RISE AI반도체TOP10"],
  },
  {
    id: "isc",
    name: "ISC",
    ticker: "095340",
    country: "KR",
    flag: "🇰🇷",
    stepId: "test",
    marketCapDisplay: "약 $2.5B",
    marketCapKrwDisplay: "약 3.8조원",
    marketCapUsd: 2_548_000_000,
    revenue: { value: "KRW 0.25T", krwApprox: "약 0.25조원", period: "2024", growth: "+15% YoY" },
    operatingIncome: { value: "KRW 0.07T", krwApprox: "약 0.07조원", margin: "28%" },
    employees: { value: "400", growth5y: "+13%" },
    foundedYear: 2001,
    ageLabel: "2001년 설립 · 업력 25년",
    hq: "성남",
    segment: "테스트 소켓",
    scaleNote: "규모는 작지만 AI·HBM용 소켓 수요가 붙으면 실적 탄성이 매우 큰 틈새 강자입니다.",
    roleDesc: "반도체 테스트용 실리콘 소켓 전문 회사입니다. 고성능 메모리와 AI 칩 테스트에 들어갑니다.",
    whyItMatters: "HBM 출하가 늘수록 반복 소모품 성격의 수요가 같이 증가합니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+9%" },
      { label: "수익성", value: "소켓 믹스 개선으로 마진 방어" },
      { label: "인력 증가", value: "5년간 +13%" },
    ],
    demandDrivers: ["HBM 테스트 소켓", "AI 칩 양산", "고속 인터페이스 검사"],
    etfs: ["RISE AI반도체TOP10"],
  },
  {
    id: "lino",
    name: "리노공업",
    ticker: "058470",
    country: "KR",
    flag: "🇰🇷",
    stepId: "test",
    marketCapDisplay: "약 $5.4B",
    marketCapKrwDisplay: "약 8.1조원",
    marketCapUsd: 5_363_000_000,
    revenue: { value: "KRW 0.4T", krwApprox: "약 0.4조원", period: "2024", growth: "+12% YoY" },
    operatingIncome: { value: "KRW 0.18T", krwApprox: "약 0.18조원", margin: "45%" },
    employees: { value: "600", growth5y: "+8%" },
    foundedYear: 1978,
    ageLabel: "1978년 설립 · 업력 48년",
    hq: "대구",
    segment: "테스트 소켓 · 프로브핀",
    scaleNote: "매출은 작아도 영업이익률이 매우 높아 한국 반도체 부품주 중 질적 우량주로 자주 언급됩니다.",
    roleDesc: "반도체 테스트용 켈빈 소켓과 프로브핀에 강한 국내 대표 기업입니다.",
    whyItMatters: "AI 반도체 테스트가 고도화될수록 프리미엄 소켓 수요가 늘어납니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+12%" },
      { label: "영업이익률", value: "40%대 중반 유지" },
      { label: "인력 증가", value: "5년간 +8%" },
    ],
    demandDrivers: ["고부가 테스트 소켓", "HBM·AI칩 검사", "글로벌 고객 다변화"],
    etfs: ["RISE AI반도체TOP10"],
  },
  {
    id: "okins",
    name: "오킨스전자",
    ticker: "080580",
    country: "KR",
    flag: "🇰🇷",
    stepId: "test",
    marketCapDisplay: "약 $3.1B",
    marketCapKrwDisplay: "약 4.7조원",
    marketCapUsd: 3_095_000_000,
    revenue: { value: "KRW 0.15T", krwApprox: "약 0.15조원", period: "2024", growth: "+10% YoY" },
    operatingIncome: { value: "KRW 0.02T", krwApprox: "약 0.02조원", margin: "13%" },
    employees: { value: "300", growth5y: "+10%" },
    foundedYear: 1998,
    ageLabel: "1998년 설립 · 업력 28년",
    hq: "평택",
    segment: "번인 소켓",
    scaleNote: "소형주지만 메모리 신뢰성 테스트 수요와 연결되는 국내 밸류체인 종목입니다.",
    roleDesc: "번인 테스트용 소켓 전문 기업입니다. 메모리와 시스템 반도체의 신뢰성 검사에 들어갑니다.",
    whyItMatters: "AI와 자동차 반도체는 장시간 신뢰성 검사가 더 중요해져 테스트 부품 수요가 같이 커집니다.",
    growth5y: [
      { label: "매출 5년 CAGR", value: "+7%" },
      { label: "사업 포인트", value: "메모리·시스템 반도체 검사 노출" },
      { label: "인력 증가", value: "5년간 +10%" },
    ],
    demandDrivers: ["번인 테스트 확대", "자동차·AI 칩 신뢰성 검사", "메모리 후공정 수요"],
    etfs: [],
  },
];

export interface MythCard {
  num: string;
  claim: string;
  fact: string;
  detail: string;
}

export const MYTH_CARDS: MythCard[] = [
  {
    num: "오해 1",
    claim: "엔비디아는 반도체를 직접 생산하는 회사다",
    fact: "설계 중심 회사이고 제조는 TSMC가 맡습니다.",
    detail: "AI 반도체 가치사슬에서 설계와 제조가 완전히 분리될 수 있다는 점을 보여주는 대표 사례입니다.",
  },
  {
    num: "오해 2",
    claim: "삼성과 TSMC는 거의 같은 회사다",
    fact: "TSMC는 순수 파운드리, 삼성은 메모리·파운드리·세트를 함께 합니다.",
    detail: "그래서 삼성은 고객과 경쟁자 역할을 동시에 가지지만, TSMC는 고객과 이해충돌이 적습니다.",
  },
  {
    num: "오해 3",
    claim: "패키징과 테스트는 뒤쪽 공정이라 중요도가 낮다",
    fact: "AI 시대에는 오히려 병목이 되는 고부가 공정입니다.",
    detail: "HBM 적층과 AI 칩 테스트가 따라주지 않으면 앞단에서 좋은 칩을 만들어도 제품 출하가 막힙니다.",
  },
];

export interface StrengthInsight {
  title: string;
  body: string;
}

export const STRENGTH_INSIGHTS: StrengthInsight[] = [
  {
    title: "미국이 압도하는 영역",
    body: "설계와 핵심 장비입니다. NVIDIA, Broadcom, AMD 같은 팹리스와 Applied Materials, KLA 같은 장비사가 밸류체인 상단을 장악합니다.",
  },
  {
    title: "한국이 압도하는 영역",
    body: "HBM 중심 메모리와 테스트 소켓입니다. 삼성전자·SK하이닉스가 메모리를 이끌고 ISC·리노공업이 테스트 부품 강자로 자리잡고 있습니다.",
  },
  {
    title: "대체가 어려운 병목",
    body: "ASML의 EUV, TSMC의 첨단 파운드리, SK하이닉스의 HBM 공급력은 단기간에 대체되기 어렵습니다.",
  },
];

export interface VcFaqItem {
  q: string;
  a: string;
}

export const VC_FAQ: VcFaqItem[] = [
  {
    q: "팹리스란 무엇인가요?",
    a: "팹리스는 반도체 공장 없이 설계에 집중하는 회사입니다. 제조는 TSMC 같은 파운드리에 맡깁니다. NVIDIA, AMD, Qualcomm이 대표적입니다.",
  },
  {
    q: "왜 원화 기준 시총도 같이 보나요?",
    a: "해외 기업 숫자는 달러 단위가 너무 커서 체감이 어렵기 때문입니다. 한국 독자가 국내 시총·매출 규모와 비교하기 쉽도록 원화 환산값을 함께 넣었습니다.",
  },
  {
    q: "반도체 밸류체인에서 한국이 가장 강한 곳은 어디인가요?",
    a: "메모리와 테스트 부품입니다. 특히 HBM은 SK하이닉스가 강하고, 삼성전자도 핵심 플레이어입니다. 테스트 소켓에서는 리노공업, ISC 같은 회사가 존재감을 보입니다.",
  },
  {
    q: "AI 시대에 가장 중요한 병목은 무엇인가요?",
    a: "첨단 파운드리 생산능력, HBM 공급, 어드밴스드 패키징, 그리고 고속 테스트 역량입니다. 이 네 구간이 따라주지 않으면 AI 칩 출하가 늦어집니다.",
  },
  {
    q: "삼성전자는 왜 메모리와 파운드리에 동시에 걸쳐 있나요?",
    a: "삼성전자는 메모리 제조, 파운드리, 모바일 세트를 동시에 운영하는 복합 기업이기 때문입니다. 밸류체인 내에서 여러 역할을 수행합니다.",
  },
];


