export type Inv800tSummaryRow = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type Inv800tCompanyRow = {
  item: string;
  samsung: string;
  hynix: string;
  samsungScore?: number;
  hynixScore?: number;
};

export type Inv800tSectorRow = {
  sector: string;
  strength: number;
  strengthLabel: string;
  reason: string;
  timing: string;
  badge: "즉시" | "단기" | "중기" | "장기";
};

export type Inv800tRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type Inv800tFaqItem = {
  q: string;
  a: string;
};

export const INV800T_META = {
  announceDate: "2026년 6월 29일",
  eventName: "대한민국 대도약 3대 메가프로젝트 국민보고회",
  totalInvestment: "800조원",
  samsungShare: "400조원",
  hynixShare: "400조원",
  location: "호남 반도체 클러스터",
  expectedCompletion: "2030년 이후 (팹 정상 가동 기준)",
  notice: "이 리포트는 공시·보도 기반 분석이며 투자 권유가 아닙니다. 모든 전망·추정 수치는 실제와 다를 수 있습니다.",
};

export const INV800T_MEGA_PROJECTS = [
  {
    icon: "🔲",
    name: "반도체 초격차",
    desc: "삼성전자·SK하이닉스 메모리 팹 4기 추가, 호남 클러스터 조성",
    point: "HBM·DRAM 생산능력 확대",
  },
  {
    icon: "🤖",
    name: "피지컬 AI",
    desc: "로봇·자율주행·제조 AI 국내 생태계 구축, 민관 공동 투자",
    point: "국내 AI 하드웨어 산업 육성",
  },
  {
    icon: "🏢",
    name: "AI 데이터센터",
    desc: "국내 AI 인프라 확충, 전력·냉각 수요 증가 대응",
    point: "전력 인프라·서버 업종 수혜",
  },
];

export const INV800T_SUMMARY: Inv800tSummaryRow[] = [
  { label: "발표 시점", value: "2026년 6월 29일", badge: "공식" },
  { label: "총 투자 규모", value: "800조원 (삼성전자·SK하이닉스 각 400조)", badge: "보도 기반" },
  { label: "투자 기간", value: "약 10년 누적 CAPEX", badge: "보도 기반" },
  { label: "위치", value: "호남 반도체 클러스터", badge: "공식" },
  { label: "주요 내용", value: "메모리 팹 4기 추가 (삼성 2기·하이닉스 2기)", badge: "보도 기반" },
  { label: "팹 1기 건설 CAPEX", value: "약 20~30조원", badge: "추정" },
  { label: "착공~정상 가동", value: "약 4~5년 소요", badge: "추정" },
  { label: "정상 가동 예상", value: "빠르면 2030년 이후", badge: "추정" },
  { label: "정부 지원", value: "인허가 패스트트랙, 세제·전력·용수 지원", badge: "공식" },
];

export const INV800T_COMPANY_COMPARE: Inv800tCompanyRow[] = [
  { item: "주력 제품", samsung: "DRAM·NAND·HBM·파운드리", hynix: "DRAM·HBM" },
  { item: "HBM 경쟁력", samsung: "회복 중 (HBM3E 인증 대기)", hynix: "업계 1위, 엔비디아 공급 중", samsungScore: 3, hynixScore: 5 },
  { item: "파운드리 변수", samsung: "있음 (적자 지속 중)", hynix: "없음", samsungScore: 2, hynixScore: 5 },
  { item: "CAPEX 부담", samsung: "매우 큼", hynix: "큼", samsungScore: 2, hynixScore: 3 },
  { item: "AI 수혜 직결도", samsung: "중상", hynix: "상", samsungScore: 4, hynixScore: 5 },
  { item: "밸류에이션", samsung: "상대적 저평가", hynix: "프리미엄", samsungScore: 4, hynixScore: 3 },
  { item: "정책 수혜", samsung: "높음", hynix: "높음", samsungScore: 5, hynixScore: 5 },
  { item: "단기 체크포인트", samsung: "HBM 경쟁력 회복, 파운드리 흑자 전환", hynix: "HBM 점유율 유지, 엔비디아 공급 지속" },
  { item: "투자 성격", samsung: "저평가 회복 기대형", hynix: "성장·모멘텀형" },
];

export const INV800T_CAPEX_IMPACT = [
  {
    phase: "단기 (1~3년)",
    key: "short",
    title: "성과급 재원 압박",
    desc: "CAPEX 급증으로 영업이익 압박 → 성과급 재원 단기 감소 가능성",
    icon: "📉",
  },
  {
    phase: "중기 (3~5년)",
    key: "mid",
    title: "수익성 개선 제한",
    desc: "신규 팹 가동 전까지 추가 매출 없음 → 수익성 개선 속도 제한",
    icon: "⏳",
  },
  {
    phase: "장기 (5년+)",
    key: "long",
    title: "성과급 상승 기대",
    desc: "팹 풀가동 시 영업이익 급증 → 성과급 재원 대폭 확대 기대",
    icon: "📈",
  },
];

export const INV800T_SECTORS: Inv800tSectorRow[] = [
  { sector: "반도체 장비", strength: 5, strengthLabel: "매우 높음", reason: "팹 증설 시 노광·식각·증착·검사 장비 발주 직결", timing: "착공 1~2년 내", badge: "단기" },
  { sector: "소재·부품", strength: 4, strengthLabel: "높음", reason: "웨이퍼·포토레지스트·특수가스 수요 증가", timing: "착공 1~3년 내", badge: "단기" },
  { sector: "전력 인프라", strength: 4, strengthLabel: "높음", reason: "팹·AI 데이터센터의 대규모 전력 수요 (변압기·전선·ESS)", timing: "즉시~3년", badge: "즉시" },
  { sector: "건설·엔지니어링", strength: 3, strengthLabel: "중상", reason: "클러스터 공장·인프라 공사 발주", timing: "즉시~2년", badge: "즉시" },
  { sector: "지역 부동산", strength: 2, strengthLabel: "중", reason: "일자리·인구 유입 기대, 실제 효과는 수년 후", timing: "3~7년 후", badge: "장기" },
];

export const INV800T_CHECKLIST = [
  "HBM 시장에서 삼성전자 점유율 회복 여부 (HBM3E·HBM4 인증 시점)",
  "SK하이닉스 엔비디아 공급 계약 지속성 (경쟁사 진입 시 점유율 변화)",
  "미·중 반도체 규제 변화 (수출 제한 강화 시 타격 규모)",
  "팹 착공 일정 구체화 시점 (발표 → 실제 착공 gap 확인)",
  "AI 데이터센터 수요 사이클 (과투자 조정 시 메모리 가격 하락 가능성)",
];

export const INV800T_RISKS: Inv800tRiskRow[] = [
  { risk: "CAPEX 과부담", content: "800조 투자 기간 동안 잉여현금흐름(FCF) 감소, 배당 여력 축소 가능", severity: "높음" },
  { risk: "반도체 수요 사이클", content: "AI 투자 과열 → 조정 시 메모리 가격 하락, 영업이익 급감 가능", severity: "높음" },
  { risk: "미·중 규제 리스크", content: "수출 제한 강화 시 중국향 매출 타격, HBM 공급망 압박", severity: "높음" },
  { risk: "정책 불확실성", content: "정권 교체·예산 삭감 시 세제·인허가 지원 축소 가능성", severity: "중간" },
  { risk: "입지 효율성", content: "호남 클러스터 물류·용수·전력 인프라 구축 지연 가능성", severity: "중간" },
];

export const INV800T_FAQ: Inv800tFaqItem[] = [
  { q: "800조는 언제 다 투입되나요?", a: "10년에 걸친 누적 CAPEX입니다. 연간 약 80조원 수준이며, 실제 집행은 팹 착공 일정에 따라 달라집니다. 단번에 집행되는 금액이 아닙니다." },
  { q: "호남에 짓는 이유가 뭔가요?", a: "부지 확보 용이성과 균형발전 정책이 결합됐습니다. 비용·물류 측면에서 수도권 대비 불리할 수 있다는 지적도 있으나, 정부의 적극적인 인프라 지원이 전제입니다." },
  { q: "단기적으로 주가에 호재인가요?", a: "단기 테마 상승은 가능하지만, 실제 매출 기여는 2030년 이후입니다. CAPEX 부담이 단기 이익을 압박할 수 있어 단기 매매보다 장기 사이클 관점이 안전합니다." },
  { q: "성과급이 늘어날까요?", a: "단기(1~3년)는 CAPEX 급증으로 영업이익 압박 → 성과급 재원이 줄 수 있습니다. 장기(5년+)는 팹 풀가동 후 실적 개선 시 성과급 상승 기대가 큽니다." },
  { q: "반도체 ETF와 개별 종목 중 어느 게 낫나요?", a: "리스크 분산 면에서 ETF가 낫습니다. 개별 종목은 HBM 경쟁력·파운드리 흑자 전환 등 모멘텀 확인 후 접근을 권장합니다." },
  { q: "삼성전자와 SK하이닉스 중 어디가 더 수혜인가요?", a: "단기 HBM 모멘텀은 SK하이닉스가 우세합니다. 장기 저평가 회복 관점에서는 삼성전자를 보는 시각도 있습니다. 투자 스타일과 목표 수익률에 따라 판단이 다릅니다. 이 리포트는 투자 권유가 아닙니다." },
];

export const INV800T_SEO_INTRO = `2026년 6월 29일, 이재명 대통령 주재 '대한민국 대도약 3대 메가프로젝트 국민보고회'에서 삼성전자와 SK하이닉스가 각각 400조원씩 총 800조원을 호남 반도체 클러스터에 투자하겠다고 발표했습니다. 반도체 초격차, 피지컬 AI, AI 데이터센터를 3대 축으로 삼은 이번 발표는 메모리 팹 4기 추가 건설을 핵심으로 합니다. 이 리포트는 투자 규모의 실제 의미, 삼성전자와 SK하이닉스의 수혜 차이, 재직자 성과급 영향, 관련 수혜 업종을 직원·투자자 관점으로 정리합니다.`;

export const INV800T_SEO_CRITERIA = [
  "총 투자 800조원 = 삼성전자 400조 + SK하이닉스 400조, 10년 누적 CAPEX",
  "신규 팹 정상 가동 빠르면 2030년 이후 (착공~가동 약 4~5년 소요)",
  "단기 성과급: CAPEX 급증으로 영업이익 압박, 재원 감소 가능성",
  "장기 성과급: 팹 풀가동 후 영업이익 급증 시 성과급 상승 기대",
  "HBM 단기 모멘텀은 SK하이닉스 우세, 장기 저평가 회복은 삼성전자 주목",
  "이 리포트는 공시·보도 기반이며 투자 권유가 아닙니다",
];
