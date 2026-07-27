export type SnpSummaryCard = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type SnpRoleRow = {
  entity: string;
  content: string;
};

export type SnpScopeRow = {
  area: string;
  content: string;
};

export type SnpRelationRow = {
  category: string;
  before: string;
  after: string;
};

export type SnpPowerRow = {
  target: string;
  scale: string;
};

export type SnpRevenueStageRow = {
  stage: string;
  content: string;
  status: string;
};

export type SnpFactorRow = {
  factor: string;
  interpretation: string;
};

export type SnpValueChainRow = {
  category: string;
  company: string;
  linkage: string;
  confirmed: "공식 발표" | "추가 확인 필요" | "잠재적 가능성";
};

export type SnpComparisonRow = {
  company: string;
  point: string;
  investorView: string;
};

export type SnpProgressRow = {
  item: string;
  status: string;
  nextCheck: string;
};

export type SnpRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type SnpFaqItem = {
  q: string;
  a: string;
};

export const SNP_META = {
  announceDate: "2026년 7월 24일",
  dealType: "LOI (협력 구체화를 위한 의향서)",
  targetOperationYear: 2027,
  notice: "이 페이지는 NVIDIA·SK hynix 공식 발표와 보도를 기반으로 한 분석이며 투자 권유가 아닙니다. 5,000억달러는 SK그룹과 엔비디아가 추진할 AI 팩토리·GPU·메모리·클라우드 등을 포괄하는 사업 규모이며, SK하이닉스의 확정 수주액이나 단일 계약금액이 아닙니다.",
  sources: [
    { label: "NVIDIA 공식 발표", org: "NVIDIA Newsroom" },
    { label: "SK hynix 공식 발표", org: "SK hynix Newsroom" },
  ],
};

export const SNP_SUMMARY_CARDS: SnpSummaryCard[] = [
  { label: "예상 협력 규모", value: "5,000억달러 이상 (포괄적 이니셔티브)", badge: "공식" },
  { label: "협력 주체", value: "SK하이닉스(메모리)·SK텔레콤(AI 클라우드)·엔비디아", badge: "공식" },
  { label: "계약 단계·목표", value: "LOI 체결 · 첫 AI 팩토리 2027년 가동 목표", badge: "공식" },
];

export const SNP_DEAL_ROLES: SnpRoleRow[] = [
  { entity: "SK하이닉스", content: "엔비디아와 HBM을 포함한 차세대 AI 메모리 장기 공급 및 공동개발" },
  { entity: "SK텔레콤", content: "엔비디아 Vera Rubin·DSX 플랫폼 기반 최대 2GW급 AI 클라우드 구축" },
  { entity: "엔비디아", content: "GPU·네트워크·소프트웨어·AI 팩토리 아키텍처 제공" },
  { entity: "계약 단계", content: "포괄적 협력 방향을 구체화하기 위한 LOI(의향서) 체결" },
  { entity: "가동 목표", content: "첫 번째 AI 팩토리 2027년 가동 목표" },
];

export const SNP_SCOPE_CAVEAT = "5,000억달러는 SK하이닉스가 확보한 확정 수주액이 아닙니다. SK그룹과 엔비디아가 장기간 추진할 AI 데이터센터, GPU 시스템, 메모리 공급, 클라우드 서비스 등 전체 생태계를 포괄하는 사업 규모입니다. 실제 SK하이닉스 매출은 향후 체결될 메모리 공급계약의 물량, 가격, 기간에 따라 결정됩니다.";

export const SNP_INCLUDED_AREAS: SnpScopeRow[] = [
  { area: "AI 반도체", content: "엔비디아 Vera Rubin GPU·CPU·네트워크 장비" },
  { area: "AI 메모리", content: "SK하이닉스 HBM4 및 차세대 HBM" },
  { area: "데이터센터", content: "건물, 서버 랙, 냉각·전력·통신 설비" },
  { area: "AI 클라우드", content: "GPU 임대, AI 학습·추론 서비스" },
  { area: "에너지", content: "발전원 확보, 송배전망, ESS와 전력 관리" },
  { area: "소프트웨어", content: "엔비디아 AI Enterprise, CUDA, DSX 플랫폼" },
  { area: "유지·교체", content: "서버 업그레이드, 메모리 교체, 운영비용" },
];

export const SNP_RELATIONS: SnpRelationRow[] = [
  { category: "제품 협력", before: "엔비디아 플랫폼에 최적화된 HBM 개발·공급", after: "차세대 AI 인프라 로드맵과 메모리 개발 일정 동기화" },
  { category: "공급 관계", before: "제품 세대별 공급 협상", after: "장기적 공급 안정성 확보" },
  { category: "개발 단계", before: "고객 요구 기반 공동 최적화", after: "초기 설계 단계부터 메모리·시스템 공동개발 강화" },
  { category: "협력 영역", before: "GPU용 HBM 중심", after: "AI 서버·CPU·PC·로봇·팹 디지털트윈까지 확대" },
  { category: "사업 구조", before: "메모리 공급사", after: "AI 인프라 공동 설계 파트너" },
];

export const SNP_POWER_SCALE: SnpPowerRow[] = [
  { target: "중형 데이터센터", scale: "20~50MW" },
  { target: "대형 데이터센터", scale: "100MW 이상" },
  { target: "네이버 세종 AI 팩토리 확장 계획", scale: "약 200MW" },
  { target: "SK텔레콤·엔비디아 AI 클라우드 (목표 규모)", scale: "최대 2,000MW(2GW)" },
  { target: "대형 원전 2기 (설비용량 단순 비교)", scale: "약 2,000~2,800MW" },
];

export const SNP_POWER_NOTE = "2GW가 모두 동시에 가동된다고 단순 가정하면 하루 전력 사용량은 최대 48GWh, 연간으로는 약 17.5TWh입니다. 다만 공식 발표의 2GW는 최종 확장 목표 또는 최대 구축 규모에 가깝습니다. 첫 번째 AI 팩토리가 2027년에 가동되더라도 전체 2GW가 한 번에 완성된다는 의미는 아니며, 원전과의 비교는 발전소 설비용량과 데이터센터 최대 전력수요를 단순 비교한 것입니다.";

export const SNP_POWER_BOTTLENECKS: string[] = [
  "대규모 전력 공급원 확보",
  "송전망과 변전소 증설",
  "지역 주민 수용성과 인허가",
  "액체냉각 시스템 구축",
  "GPU와 HBM 공급 일정",
  "대규모 자본조달",
];

export const SNP_REVENUE_STAGES: SnpRevenueStageRow[] = [
  { stage: "1. 전략 발표", content: "포괄적 협력 방향 발표", status: "완료" },
  { stage: "2. LOI", content: "사업 범위와 협상 방향 합의", status: "완료" },
  { stage: "3. 본계약", content: "물량·가격·기간·책임 확정", status: "확인 필요" },
  { stage: "4. 생산·인도", content: "HBM 양산 후 고객 인도", status: "향후 진행" },
  { stage: "5. 매출 인식", content: "제품 검수·인도 조건에 따라 반영", status: "향후 진행" },
];

export const SNP_POSITIVE_FACTORS: SnpFactorRow[] = [
  { factor: "장기 공급 관계", interpretation: "HBM 수요 예측 가능성 상승" },
  { factor: "공동개발", interpretation: "차세대 GPU 플랫폼 진입 가능성 강화" },
  { factor: "HBM4 적용", interpretation: "고부가 제품 비중 확대 가능" },
  { factor: "적용처 확대", interpretation: "AI 서버 외 PC·로봇·물리 AI 시장 진입" },
  { factor: "생산 최적화", interpretation: "엔비디아 AI를 반도체 설계·팹 운영에 활용" },
];

export const SNP_NEGATIVE_FACTORS: SnpFactorRow[] = [
  { factor: "대규모 CAPEX", interpretation: "매출 성장 전 설비투자와 감가상각 증가 가능" },
  { factor: "공급계약 미공개", interpretation: "정확한 물량·단가·마진 추정 불가" },
  { factor: "고객 집중도", interpretation: "엔비디아 의존도가 높아질 수 있음" },
  { factor: "경쟁 심화", interpretation: "삼성전자·마이크론의 HBM 공급 확대 가능성" },
  { factor: "가격 하락", interpretation: "공급이 빠르게 늘면 HBM 가격 프리미엄 축소 가능" },
  { factor: "일정 지연", interpretation: "AI 팩토리 전력·인허가 문제 발생 가능" },
];

export const SNP_BONUS_CHECKPOINTS: string[] = [
  "HBM4 양산 및 고객 인증 일정",
  "엔비디아향 공급 물량",
  "DRAM 평균판매가격",
  "SK하이닉스 연간 영업이익",
  "CAPEX와 감가상각비",
  "노사협의 및 성과급 산정기준",
];

export const SNP_COMPARISON: SnpComparisonRow[] = [
  { company: "SK하이닉스", point: "엔비디아와 장기 공급·공동개발", investorView: "HBM 선도 지위 유지 여부" },
  { company: "삼성전자", point: "HBM·파운드리·패키징 종합 역량", investorView: "엔비디아 공급 확대와 수율" },
  { company: "마이크론", point: "미국 공급망과 HBM 점유율 확대", investorView: "생산능력 확장 속도" },
  { company: "엔비디아", point: "복수 공급사 확보 필요", investorView: "공급사별 물량 배분" },
];

export const SNP_VALUE_CHAIN: SnpValueChainRow[] = [
  { category: "메모리", company: "SK하이닉스", linkage: "HBM4·차세대 HBM 공급", confirmed: "공식 발표" },
  { category: "AI 인프라", company: "SK텔레콤", linkage: "AI 클라우드 투자·서비스", confirmed: "공식 발표" },
  { category: "플랫폼", company: "엔비디아", linkage: "Vera Rubin·DSX 공급", confirmed: "공식 발표" },
  { category: "통신망", company: "SK브로드밴드", linkage: "전용망·데이터센터 연결", confirmed: "추가 확인 필요" },
  { category: "전력", company: "SK이노베이션 계열", linkage: "전력·ESS·에너지 공급", confirmed: "잠재적 가능성" },
  { category: "건설", company: "SK에코플랜트", linkage: "데이터센터 시공·냉각", confirmed: "잠재적 가능성" },
];

export const SNP_PROGRESS: SnpProgressRow[] = [
  { item: "LOI 체결", status: "완료", nextCheck: "본계약 발표" },
  { item: "HBM 공급 기간", status: "미공개", nextCheck: "공급계약 공시" },
  { item: "공급 물량", status: "미공개", nextCheck: "실적 발표·IR" },
  { item: "AI 팩토리 위치", status: "추가 확인 필요", nextCheck: "착공 발표" },
  { item: "1단계 전력 규모", status: "미공개", nextCheck: "인허가·착공" },
  { item: "전체 2GW 완공 시기", status: "미공개", nextCheck: "단계별 투자계획" },
  { item: "첫 가동", status: "2027년 목표", nextCheck: "일정 변경 여부" },
];

export const SNP_RISKS: SnpRiskRow[] = [
  { risk: "LOI 불확실성", content: "의향서 단계로 확정 계약 조건·규모가 변경될 수 있음", severity: "중간" },
  { risk: "공급계약 미공개", content: "정확한 물량·단가·마진을 추정할 근거가 아직 없음", severity: "높음" },
  { risk: "고객 집중도", content: "엔비디아향 의존도가 높아질 경우 협상력·수익성에 영향", severity: "중간" },
  { risk: "경쟁 심화", content: "삼성전자·마이크론의 HBM 공급 확대로 가격 프리미엄 축소 가능", severity: "중간" },
  { risk: "전력·인허가", content: "2GW급 데이터센터 전력 확보·인허가 지연 리스크", severity: "중간" },
  { risk: "가동 지연", content: "2027년 목표 대비 실제 착공·완공이 지연될 가능성", severity: "중간" },
  { risk: "밸류에이션 부담", content: "HBM 지배력·엔비디아 협력 기대가 이미 주가에 선반영됐을 가능성", severity: "높음" },
];

export const SNP_FAQ: SnpFaqItem[] = [
  { q: "5,000억달러는 확정 계약금액인가요?", a: "아닙니다. SK그룹과 엔비디아가 추진할 AI 팩토리·GPU·메모리·클라우드 등 포괄적인 사업 규모입니다. 양측은 협력을 구체화하기 위한 LOI를 체결했지만, SK하이닉스의 구체적인 공급 물량과 계약금액은 공개되지 않았습니다." },
  { q: "SK하이닉스가 5,000억달러를 수주한 것인가요?", a: "아닙니다. 5,000억달러 전체는 SK하이닉스 매출이 아닙니다. SK하이닉스의 직접 사업 영역은 차세대 AI 메모리 공급과 공동개발입니다." },
  { q: "2GW는 한 개 데이터센터 규모인가요?", a: "반드시 단일 건물을 의미하지는 않습니다. 여러 지역이나 단계별로 구축되는 AI 데이터센터 캠퍼스 전체의 최대 확장 규모일 수 있습니다. 공식 발표는 첫 AI 팩토리가 2027년 가동될 예정이라고만 제시했으며, 전체 2GW 완공 시점은 별도 확인이 필요합니다." },
  { q: "기존 엔비디아 협력과 무엇이 다른가요?", a: "기존의 HBM 공급·공동 최적화 관계에서 장기 공급 안정화, 차세대 메모리 공동개발, AI 팩토리 구축까지 협력 범위가 확대됐습니다. SK하이닉스는 AI 서버 외에도 CPU, 개인용 AI PC, 로봇 플랫폼용 메모리까지 협력 영역을 넓히고 있습니다." },
  { q: "SK텔레콤은 왜 참여하나요?", a: "SK텔레콤은 GPU와 HBM을 구매하는 최종 사용자가 아니라, 이를 기반으로 AI 컴퓨팅 자원을 기업과 개발자에게 제공하는 AI 클라우드 사업자 역할을 담당합니다." },
  { q: "2027년에 2GW 전체가 가동되나요?", a: "공식 발표는 첫 AI 팩토리가 2027년에 가동될 예정이라고 표현했습니다. 2GW 전체가 2027년에 동시에 가동된다는 뜻으로 해석해서는 안 됩니다." },
  { q: "SK이노베이션·SK에코플랜트도 이번 계약에 참여하나요?", a: "공식 발표에서 확정된 역할이 아니라 전력·건설 영역에서의 잠재적 연계 가능성으로 보는 것이 정확합니다. 확정 참여 여부는 추가 확인이 필요합니다." },
  { q: "삼성전자·브로드컴 건과는 어떻게 다른가요?", a: "삼성전자 건은 브로드컴(ASIC 고객)과의 파운드리·패키징 중심 MOU이고, 이번 건은 엔비디아(GPU)와의 메모리 공동개발·AI 팩토리 구축을 포괄하는 LOI입니다." },
  { q: "이번 협력이 SK하이닉스 성과급에 바로 반영되나요?", a: "곧바로 반영되지는 않습니다. 본계약 체결, HBM 생산능력 확보, 고객 인증, 제품 인도 과정을 거쳐 실제 매출로 인식된 이후 PS·PI 등 성과급 재원에 중장기적으로 영향을 줄 수 있습니다." },
  { q: "엔비디아가 SK하이닉스에만 의존하게 되나요?", a: "아닙니다. 엔비디아 입장에서는 SK하이닉스 한 곳에만 의존하기보다 삼성전자·마이크론 등 복수의 HBM 공급사를 확보하는 것이 공급망 안정성 측면에서 유리합니다. 이번 파트너십이 SK하이닉스의 독점 공급을 의미하지는 않습니다." },
];

export const SNP_SEO_INTRO = `2026년 7월 24일 SK그룹과 엔비디아는 AI 팩토리 구축과 차세대 AI 메모리 공급·공동개발을 포괄하는 5,000억달러 이상 규모의 전략적 협력 계획을 발표했습니다. 양측은 협력 내용을 구체화하기 위한 LOI를 체결했으며, SK하이닉스는 HBM을 포함한 차세대 AI 메모리 장기 공급·공동개발을, SK텔레콤은 최대 2GW급 AI 클라우드 구축(2027년 첫 AI 팩토리 가동 목표)을 맡습니다. 5,000억달러는 SK하이닉스의 확정 수주액이 아니라 AI 데이터센터·GPU·메모리·클라우드 등을 포괄하는 사업 규모라는 점이 이 발표를 읽는 핵심 전제입니다.`;

export const SNP_SEO_CRITERIA = [
  "5,000억달러 이상은 확정 계약금액이 아니라 SK그룹·엔비디아가 추진할 포괄적 사업 규모(LOI 단계)",
  "SK하이닉스는 HBM 등 차세대 AI 메모리 공동개발, SK텔레콤은 최대 2GW급 AI 클라우드 구축 담당",
  "첫 AI 팩토리 가동 목표는 2027년이며, 2GW 전체 완공 시점은 아님",
  "SK이노베이션·SK에코플랜트 등 계열사 참여는 잠재적 가능성이며 공식 확정 사항이 아님",
  "이 리포트는 NVIDIA·SK hynix 공식 발표와 보도를 기반으로 하며 투자 권유가 아닙니다",
];
