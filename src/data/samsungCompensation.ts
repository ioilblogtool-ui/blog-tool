export type HouseholdMode = "SINGLE" | "COUPLE";
export type RankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type DivisionCode = "DS" | "MX" | "CSS" | "DEVICE" | "SUPPORT";
export type TargetYear = "2026" | "2027" | "2028";
export type ScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type OpiMode = "ACTUAL" | "SCENARIO" | "UNION_DEMAND";

export interface RankPreset {
  code: RankCode;
  label: string;
  defaultSalary: number;
}

export interface DivisionConfig {
  code: DivisionCode;
  label: string;
  actual2026Rate: number;
  actualLabel: string;
  scenarioRates: Record<ScenarioCode, number>;
}

export interface ScenarioPreset {
  code: ScenarioCode;
  label: string;
  opiAdjustmentLabel: string;
  taiFirstHalf: number;
  taiSecondHalf: number;
}

export interface OperatingProfitScenario {
  code: string;
  label: string;
  year: TargetYear;
  operatingProfit: number;
  sourceLabel: "보도" | "추정" | "사용자";
  note: string;
}

export interface UnionDemandScenario {
  code: string;
  label: string;
  payoutRatio: number;
  stockCompensation: boolean;
  note: string;
}

export const rankPresets: RankPreset[] = [
  { code: "STAFF", label: "사원", defaultSalary: 70000000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultSalary: 90000000 },
  { code: "MANAGER", label: "과장", defaultSalary: 110000000 },
  { code: "DEPUTY_GM", label: "차장", defaultSalary: 135000000 },
  { code: "GM", label: "부장", defaultSalary: 160000000 }
];

export const yearOptions: Array<{ code: TargetYear; label: string }> = [
  { code: "2026", label: "2026" },
  { code: "2027", label: "2027" },
  { code: "2028", label: "2028" }
];

export const opiModes: Array<{ code: OpiMode; label: string; description: string }> = [
  { code: "ACTUAL", label: "기존 OPI 기준", description: "2025 실적 기준 사업부 공개 지급률을 반영합니다." },
  { code: "SCENARIO", label: "시나리오 기준", description: "2027·2028 또는 가정값 비교용 시뮬레이션입니다." },
  { code: "UNION_DEMAND", label: "잠정합의안", description: "2026년 5월 20일 잠정합의안의 영업이익 연동 구조를 1인 환산액으로 추정합니다." }
];

export const divisions: DivisionConfig[] = [
  {
    code: "DS",
    label: "DS 반도체",
    actual2026Rate: 0.47,
    actualLabel: "2026 실제 참고 47%",
    scenarioRates: { CONSERVATIVE: 0.3, BASE: 0.4, AGGRESSIVE: 0.5 }
  },
  {
    code: "MX",
    label: "MX",
    actual2026Rate: 0.5,
    actualLabel: "2026 실제 참고 50%",
    scenarioRates: { CONSERVATIVE: 0.38, BASE: 0.45, AGGRESSIVE: 0.5 }
  },
  {
    code: "CSS",
    label: "CSS",
    actual2026Rate: 0.11,
    actualLabel: "2026 실제 참고 11%",
    scenarioRates: { CONSERVATIVE: 0.08, BASE: 0.12, AGGRESSIVE: 0.18 }
  },
  {
    code: "DEVICE",
    label: "VD/DA/네트워크/의료기기",
    actual2026Rate: 0.12,
    actualLabel: "2026 실제 참고 12%",
    scenarioRates: { CONSERVATIVE: 0.1, BASE: 0.14, AGGRESSIVE: 0.18 }
  },
  {
    code: "SUPPORT",
    label: "공통/지원조직",
    actual2026Rate: 0.36,
    actualLabel: "2026 실제 참고 34~39% 구간",
    scenarioRates: { CONSERVATIVE: 0.28, BASE: 0.36, AGGRESSIVE: 0.42 }
  }
];

export const scenarioPresets: ScenarioPreset[] = [
  { code: "CONSERVATIVE", label: "보수적", opiAdjustmentLabel: "낮은 업황 가정", taiFirstHalf: 0.25, taiSecondHalf: 0.25 },
  { code: "BASE", label: "기준", opiAdjustmentLabel: "평균적 업황 가정", taiFirstHalf: 0.5, taiSecondHalf: 0.5 },
  { code: "AGGRESSIVE", label: "공격적", opiAdjustmentLabel: "강한 업황 가정", taiFirstHalf: 1, taiSecondHalf: 1 }
];

export const operatingProfitScenarios: OperatingProfitScenario[] = [
  {
    code: "FY2026_CONSENSUS",
    label: "2026 컨센서스",
    year: "2026",
    operatingProfit: 297_547_800_000_000,
    sourceLabel: "보도",
    note: "에프앤가이드 컨센서스 보도 기준, 약 297.5조 원"
  },
  {
    code: "FY2026_ROUND_300T",
    label: "2026 300조 시나리오",
    year: "2026",
    operatingProfit: 300_000_000_000_000,
    sourceLabel: "추정",
    note: "영업이익 300조 원 도달 시나리오"
  },
  {
    code: "FY2027_SUPERCYCLE",
    label: "2027 슈퍼사이클",
    year: "2027",
    operatingProfit: 317_000_000_000_000,
    sourceLabel: "추정",
    note: "AI 메모리 호황 지속을 가정한 외부 리포트 보도 범위"
  }
];

export const unionDemandScenarios: UnionDemandScenario[] = [
  {
    code: "AGREEMENT_12",
    label: "잠정합의안 총 12%",
    payoutRatio: 0.12,
    stockCompensation: true,
    note: "기존 OPI 1.5%와 DS 특별경영성과급 10.5%를 합산한 보도 기준"
  },
  {
    code: "SPECIAL_10_5",
    label: "DS 특별 10.5%",
    payoutRatio: 0.105,
    stockCompensation: true,
    note: "DS부문 특별경영성과급 재원으로 보도된 10.5% 기준"
  },
  {
    code: "UNION_INITIAL_15",
    label: "최초 요구안 15%",
    payoutRatio: 0.15,
    stockCompensation: false,
    note: "노조가 요구했던 영업이익 15% 성과급 재원 보도 기준"
  }
];

export const factAnchors = [
  { label: "합의 상태", value: "잠정합의", note: "조합원 찬반투표 전" },
  { label: "총 재원", value: "최대 12%", note: "기존 OPI 1.5% + 특별 10.5%" },
  { label: "DS 특별성과급", value: "10.5%", note: "노사 합의 사업성과 기준" },
  { label: "배분 구조", value: "40:60", note: "DS 공통 40%, 사업부 60%" },
  { label: "지급 방식", value: "자사주", note: "세후 전액, 일부 보호예수" },
  { label: "DX·CSS", value: "600만 원", note: "별도 자사주 지급안" },
  { label: "투표 일정", value: "5.22~5.27", note: "가결 시 공식 타결" }
];

export const comparisonCards = [
  { code: "SKHYNIX", label: "삼성전자 vs SK하이닉스", annualTotal: 185000000, note: "평균 보수 기사 기준 비교선" },
  { code: "HYUNDAI", label: "삼성전자 vs 현대차", annualTotal: 140000000, note: "안정형 성과급 가정" },
  { code: "DOCTOR", label: "삼성전자 차장 vs 개원의 의사", annualTotal: 300000000, note: "세전 총보상 가정" },
  { code: "COUPLE", label: "삼성전자 사내 부부 vs 외벌이 고소득 직군", annualTotal: 320000000, note: "참고용 비교선" }
];

export const averageCompensation = 158000000;
export const defaultBenefits = 10000000;

// ── 다음 계산기 열기 ──────────────────────────────────────────────────────────
export const SAMSUNG_NEXT_CALCULATOR = {
  href: "/tools/bonus-simulator/",
  title: "다음 계산기 열기",
  headline: "대기업 성과급 시뮬레이터로 이어보기",
  desc: "삼성전자 외 SK하이닉스, 현대자동차, 카카오 등 국내 주요 대기업 성과급 구조를 한 번에 비교할 수 있습니다. 사업부별 OPI 차이와 총보상 규모를 나란히 놓고 확인해보세요.",
  cta: "대기업 성과급 시뮬레이터 열기",
};

// ── 관련 계산기 링크 ──────────────────────────────────────────────────────────
export const SAMSUNG_RELATED_CALCULATORS = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", desc: "DS 반도체 양강의 성과급 구조를 비교" },
  { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기", desc: "제조 대기업 보상 체계와 나란히 비교" },
  { href: "/tools/salary/", label: "연봉 인상 계산기", desc: "인상률·실수령 변화를 빠르게 계산" },
];

// ── 외부 참고 링크 ────────────────────────────────────────────────────────────
export const SAMSUNG_EXTERNAL_REFERENCE_LINKS = [
  {
    title: "삼성전자 DART 사업보고서",
    desc: "직원 평균 급여, OPI·TAI 지급 근거, 연간 재무 현황을 공식 수치로 확인할 수 있는 금융감독원 전자공시 페이지",
    url: "https://dart.fss.or.kr/dsab002/main.do?autoSearch=true&textCrpNm=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90",
  },
  {
    title: "삼성전자 공식 IR 페이지",
    desc: "사업부별 분기 실적과 재무 데이터를 직접 확인할 수 있는 삼성전자 투자자 관계 사이트",
    url: "https://www.samsung.com/sec/ir/",
  },
  {
    title: "에프앤가이드 컨센서스",
    desc: "증권사 실적 전망 평균과 컨센서스 변화를 확인할 때 참고하는 금융정보 서비스",
    url: "https://www.fnguide.com/",
  },
  {
    title: "삼성전자 2026년 임금협상 잠정합의 일지",
    desc: "2026년 5월 20일 잠정합의안과 조합원 찬반투표 일정을 확인할 수 있는 보도",
    url: "https://www.yna.co.kr/view/AKR20260520151200003",
  },
  {
    title: "국세청 근로소득 원천징수 안내",
    desc: "성과급 과세 방식과 근로소득 세율 구조를 공식 기준으로 확인할 때 참고",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2227&cntntsId=7708",
  },
  {
    title: "고용노동부 임금정보 시스템",
    desc: "직종·업종·규모별 평균 임금 현황을 비교하고 싶을 때 참고하는 공공 임금 통계 서비스",
    url: "https://www.wage.go.kr/",
  },
];

// ── 추천 상품 (쿠팡파트너스 제휴) ────────────────────────────────────────────
export const SAMSUNG_AFFILIATE_PRODUCTS = [
  {
    tag: "재테크",
    title: "세이노의 가르침",
    desc: "성과급을 자산으로 키우는 전략을 다루는 국내 대표 재테크 베스트셀러",
    url: "https://link.coupang.com/a/efD3Lx",
  },
  {
    tag: "가계부",
    title: "자산 관리 가계부 플래너",
    desc: "성과급 수령 후 지출 계획과 자산 분배를 직접 기록하는 연간 플래너",
    url: "https://www.coupang.com/np/search?q=%EA%B0%80%EA%B3%84%EB%B6%80+%EC%9E%90%EC%82%B0%EA%B4%80%EB%A6%AC",
  },
  {
    tag: "투자 입문",
    title: "존 리의 금융문맹 탈출",
    desc: "연봉·성과급을 어떻게 운용할지 고민하는 직장인에게 추천하는 투자 입문서",
    url: "https://link.coupang.com/a/efD6PQ",
  },
  {
    tag: "커리어",
    title: "퇴사 준비생의 도쿄 / 커리어 가이드",
    desc: "대기업 커리어 전략과 이직·협상을 정리한 직장인 필독 커리어 도서",
    url: "https://link.coupang.com/a/efD7x0",
  },
];
