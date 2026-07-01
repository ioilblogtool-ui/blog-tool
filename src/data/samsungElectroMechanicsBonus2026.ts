export type SembScenarioRow = {
  operatingProfitLabel: string;
  operatingProfitHundredMillion: number;
  perPersonAt10pct: number;
  perPersonAt12pct: number;
};

export type SembCompetitor = {
  company: string;
  method: string;
  rateLabel: string;
  badge: "공식" | "보도 기반" | "추정";
  note: string;
  isSelf?: boolean;
};

export type SembGradeMultiplier = {
  grade: string;
  key: string;
  multiplier: number;
};

export type SembFaqItem = {
  q: string;
  a: string;
};

export const SEMB_META = {
  seoTitle: "삼성전기 성과급 계산기 2026 | 영업이익 10% 적용 시 1인당 얼마",
  seoDescription: "영업이익 규모와 재원 비율을 입력하면 삼성전기 성과급 1인당 예상 수령액을 바로 계산합니다. 직급별 배수 시뮬레이션, 세후 실수령액, SK하이닉스·삼성전자 DS 비교 포함.",
  updatedAt: "2026-07-01",
  notice: "삼성전기 성과급 방식 전환은 현재 임직원 투표·의견수렴 단계입니다. 이 페이지의 모든 수치는 보도·추정 기반이며 최종 지급액과 다를 수 있습니다.",
  defaultOperatingProfit: 15000,
  defaultRate: 10,
  defaultHeadcount: 12000,
  defaultSalary: 6000,
  effectiveTaxRate: 0.33,
};

export const SEMB_GRADE_MULTIPLIERS: SembGradeMultiplier[] = [
  { grade: "사원 (CL1)", key: "cl1", multiplier: 0.85 },
  { grade: "대리 (CL2)", key: "cl2", multiplier: 1.00 },
  { grade: "과장 (CL3)", key: "cl3", multiplier: 1.20 },
  { grade: "차장 (CL4)", key: "cl4", multiplier: 1.45 },
  { grade: "부장 (CL4+)", key: "cl4p", multiplier: 1.70 },
];

export const SEMB_SCENARIOS: SembScenarioRow[] = [
  { operatingProfitLabel: "1.0조", operatingProfitHundredMillion: 10000, perPersonAt10pct: 833, perPersonAt12pct: 1000 },
  { operatingProfitLabel: "1.2조", operatingProfitHundredMillion: 12000, perPersonAt10pct: 1000, perPersonAt12pct: 1200 },
  { operatingProfitLabel: "1.5조", operatingProfitHundredMillion: 15000, perPersonAt10pct: 1250, perPersonAt12pct: 1500 },
  { operatingProfitLabel: "1.8조", operatingProfitHundredMillion: 18000, perPersonAt10pct: 1500, perPersonAt12pct: 1800 },
  { operatingProfitLabel: "2.0조", operatingProfitHundredMillion: 20000, perPersonAt10pct: 1667, perPersonAt12pct: 2000 },
];

export const SEMB_COMPETITORS: SembCompetitor[] = [
  { company: "SK하이닉스", method: "PS — 영업이익 N%", rateLabel: "10%", badge: "공식", note: "연 2회 지급, 영업이익 10% 재원" },
  { company: "삼성전자 DS", method: "특별경영성과급 N%", rateLabel: "10.5%", badge: "보도 기반", note: "2026년 보도 기준 추정" },
  { company: "삼성전기", method: "영업이익 N% 전환 투표 중", rateLabel: "10% 안 / 노조 12% 요구", badge: "추정", note: "2027년 1월 지급분부터 적용 전망", isSelf: true },
  { company: "LG이노텍", method: "사업부 실적 연동", rateLabel: "비공개", badge: "추정", note: "공식 비공개" },
];

export const SEMB_FAQ: SembFaqItem[] = [
  { q: "삼성전기 성과급은 언제 지급되나요?", a: "기존 OPI는 연 2회(1월, 7월) 지급이었습니다. 새 방식으로 전환 시 지급 일정이 변경될 수 있으며, 현재 투표 단계에서는 2027년 1월 지급분부터 적용될 전망입니다." },
  { q: "영업이익 10%와 12%는 무슨 차이인가요?", a: "10%는 회사(노사협의회) 제안안이고, 12%는 노동조합 요구안입니다. 최종 합의에 따라 달라집니다. 삼성전자 DS는 10.5%로 보도된 바 있습니다." },
  { q: "OPI와 PS는 어떻게 다른가요?", a: "OPI(Opportunity Profit Index)는 경제적 부가가치(EVA) 기반으로 산정하는 삼성 계열사 고유 방식입니다. PS(Profit Sharing)는 영업이익의 N%를 직접 성과급 재원으로 배분하는 방식으로 산식이 더 직관적입니다." },
  { q: "세율 33%는 어디서 나온 건가요?", a: "성과급 합산 과세 구간에서 소득세 25%, 지방소득세 2.5%, 4대보험 기여금 근사치를 합산한 실효세율 추정치입니다. 실제 세율은 연간 소득 합계에 따라 달라집니다." },
  { q: "직급 배수는 공식 수치인가요?", a: "아닙니다. 업계 관행 및 제보 기반 추정치입니다. 실제 지급 배수는 사업부·평가등급·회사 정책에 따라 달라집니다." },
  { q: "임직원 1.2만 명 기준은 어디서 왔나요?", a: "삼성전기 공시 자료 기준 국내 임직원 수 추정치입니다. 사업부별 분리 계산 시 실제 수령액과 차이가 있을 수 있습니다." },
];

export const SEMB_SEO_INTRO = `삼성전기는 2026년 기존 EVA 기반 OPI(Opportunity Profit Index) 방식에서 영업이익의 N%를 성과급 재원으로 직접 활용하는 방식으로 전환을 논의 중입니다. 노사협의회가 제안한 영업이익 10% 안과 노동조합의 12% 요구안이 맞서는 가운데, 가결 시 2027년 1월 지급분부터 새 방식이 적용될 전망입니다.`;

export const SEMB_SEO_CRITERIA = [
  "영업이익 1.5조 기준, 재원 비율 10% 적용 시 총 재원 약 1,500억원",
  "임직원 약 1.2만 명 기준 1인당 평균 세전 약 1,250만원 추정",
  "세후 실수령액은 실효세율 33% 적용 시 약 838만원",
  "직급 배수 적용 시 차장급(CL4) 기준 약 1,215만원 세후 추정",
  "SK하이닉스(10%), 삼성전자 DS(10.5%) 대비 동일·유사 재원 비율 수준",
  "모든 수치는 보도·추정 기반이며 최종 지급액과 다를 수 있음",
];
