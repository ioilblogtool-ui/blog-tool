export type AdiOverviewRow = {
  category: string;
  content: string;
};

export type AdiProjectRow = {
  project: string;
  entity: string;
  scale: string;
  stage: string;
  timeline: string;
};

export type AdiPowerRow = {
  utilization: string;
  annual: string;
};

export type AdiPueRow = {
  itLoad: string;
  pue: string;
  total: string;
};

export type AdiChainStageRow = {
  stage: string;
  timing: string;
  indicator: string;
};

export type AdiSectorRow = {
  sector: string;
  path: string;
  visibility: string;
  condition: string;
  risk: string;
};

export type AdiRiskRow = {
  risk: string;
  importance: "매우 높음" | "높음" | "중상" | "중간";
  content: string;
};

export type AdiFaqItem = {
  q: string;
  a: string;
};

export const ADI_META = {
  keyTrend: "AI 경쟁이 모델 경쟁에서 전력·데이터센터·냉각·통신 인프라 확보 경쟁으로 확장",
  notice: "이 페이지는 업종·산업 구조를 설명하는 정보성 콘텐츠이며, 특정 종목 매수를 권유하지 않습니다. 프로젝트 규모와 일정은 발표·보도 기준이며 실제 착공·완공·투자금액은 변경될 수 있습니다. 수혜 강도는 추정이며 투자 판단은 본인 책임입니다.",
};

export const ADI_CONCLUSION = "AI 데이터센터 투자가 확대될수록 GPU와 HBM뿐 아니라 변압기·배전설비·냉각시스템·건설·광통신망의 중요성이 커집니다. 다만 프로젝트 발표 규모와 실제 착공·수주·매출 사이에는 상당한 차이가 발생할 수 있으므로, 개별 기업을 평가할 때는 발표 금액보다 확정 수주·착공 여부·수주잔고·현금흐름을 확인해야 합니다.";

export const ADI_OVERVIEW: AdiOverviewRow[] = [
  { category: "산업 변화", content: "AI 모델 경쟁에서 연산·전력·냉각·통신 인프라 경쟁으로 확장" },
  { category: "핵심 병목", content: "전력 계통 연결, 변압기 납기, 냉각, 부지와 인허가" },
  { category: "국내 사례", content: "SK그룹·SK텔레콤의 GW급 AI 팩토리 구축 구상 (발표·보도 기준)" },
  { category: "해외 사례", content: "미국 Stargate 및 오하이오 10GW급 데이터센터 개발 구상" },
  { category: "직접 수혜 영역", content: "전력기기, 배전, 냉각, 데이터센터 건설, 광통신" },
  { category: "주요 리스크", content: "인허가 지연, 전력 부족, 금융조달, 과잉투자, 고객 신용" },
  { category: "투자 판단 기준", content: "발표 금액보다 확정 수주·착공·수주잔고·현금흐름 확인" },
];

export const ADI_PROJECTS: AdiProjectRow[] = [
  { project: "국내 AI 팩토리", entity: "SK그룹·SK텔레콤·엔비디아", scale: "보도상 2GW급", stage: "협력·개발 구상", timeline: "2027년 초기 운영 후 단계적 확대" },
  { project: "국내 장기 AI 인프라", entity: "SK텔레콤", scale: "총 15GW 구축 구상", stage: "장기 로드맵", timeline: "세부 일정 미공개" },
  { project: "미국 Stargate", entity: "OpenAI·Oracle·SoftBank", scale: "미국 전체 10GW·5,000억달러", stage: "복수 사이트 개발", timeline: "사이트별 상이" },
  { project: "오하이오 프로젝트", entity: "SB Energy·OpenAI 등", scale: "보도상 10GW급", stage: "개발·금융보증 협의", timeline: "1단계 800MW, 2028년 목표 보도" },
  { project: "미시간 Stargate", entity: "OpenAI·Oracle·Related Digital", scale: "1GW 이상", stage: "공식 발표·개발", timeline: "2026년 초 착공 계획" },
];

export const ADI_PROJECT_NOTE = "발표 규모는 최종 완공된 데이터센터 용량이 아닙니다. 전력 확보, 부지 개발, 금융조달, 착공, 서버 설치가 각각 다른 단계에 있으며 프로젝트가 축소·연기될 수 있습니다. 특히 오하이오 프로젝트는 확정 금융계약이 아니라 엔비디아가 오픈AI의 데이터센터 장기 임차·자금조달을 지원하기 위해 약 2,500억달러 규모 금융보증을 검토 중이라는 보도 단계입니다.";

export const ADI_POWER_BASE = "2GW × 24시간 × 365일 = 연간 17.52TWh (최대 정격전력 기준 단순 환산)";

export const ADI_POWER_TABLE: AdiPowerRow[] = [
  { utilization: "50%", annual: "약 8.76TWh" },
  { utilization: "70%", annual: "약 12.26TWh" },
  { utilization: "80%", annual: "약 14.02TWh" },
  { utilization: "90%", annual: "약 15.77TWh" },
  { utilization: "100%", annual: "약 17.52TWh" },
];

export const ADI_POWER_CAVEAT = "위 계산은 2GW를 시설 전체 전력 한도로 보고 단순 환산한 수치입니다. 데이터센터 발표에서는 IT Load(GPU·서버가 직접 사용하는 전력), Facility Load(냉각·UPS·조명 등을 포함한 전체 전력), Power secured(전력회사 등으로부터 확보하려는 최대 공급용량)가 혼용되므로, 발표된 GW가 어떤 기준인지 확인이 필요합니다.";

export const ADI_PUE_EXAMPLES: AdiPueRow[] = [
  { itLoad: "1GW", pue: "1.10", total: "1.10GW" },
  { itLoad: "1GW", pue: "1.20", total: "1.20GW" },
  { itLoad: "1GW", pue: "1.30", total: "1.30GW" },
  { itLoad: "2GW", pue: "1.20", total: "2.40GW" },
];

export const ADI_PUE_NOTE = "PUE(전력사용효율) = 데이터센터 전체 전력 ÷ IT 장비 전력. PUE가 낮을수록 냉각·배전 등 비IT 설비의 전력 낭비가 적다는 의미입니다. AI 서버는 높은 발열 때문에 일반 데이터센터보다 냉각 설계가 중요하며, 전력 확보 규모만큼 냉각 효율도 운영비와 수익성을 좌우합니다. IEA에 따르면 냉각은 효율적인 하이퍼스케일 데이터센터에서는 전체 전력의 약 7%, 효율이 낮은 데이터센터에서는 30% 이상을 차지할 수 있습니다.";

export const ADI_CHAIN_DIAGRAM = `전력 생산
원전·가스·재생에너지·ESS
  ↓
송전망·변전소
초고압 케이블·변압기·개폐기
  ↓
데이터센터 배전
UPS·PDU·비상발전기
  ↓
AI 서버
GPU·CPU·HBM·스토리지
  ↓
냉각
액체냉각·CDU·칠러·항온항습
  ↓
네트워크
스위치·광모듈·광케이블·인터커넥트
  ↓
운영
클라우드·보안·관제·전력 최적화`;

export const ADI_CHAIN_STAGES: AdiChainStageRow[] = [
  { stage: "전력망·변전", timing: "프로젝트 초기", indicator: "전력 인입 계약·변압기 발주" },
  { stage: "설계·엔지니어링", timing: "인허가 전후", indicator: "설계 계약·EPC 선정" },
  { stage: "건설", timing: "착공 이후", indicator: "공사 수주·진행률" },
  { stage: "냉각·배전", timing: "건물 공사 중후반", indicator: "장비 공급계약" },
  { stage: "서버·GPU", timing: "준공 전후", indicator: "GPU 공급·서버 설치" },
  { stage: "통신망", timing: "가동 직전", indicator: "광케이블·스위치 구축" },
  { stage: "운영·클라우드", timing: "가동 이후", indicator: "이용률·임대매출·전력비" },
];

export const ADI_SECTORS: AdiSectorRow[] = [
  { sector: "변압기·전력기기", path: "전력 인입·배전설비 발주", visibility: "높음", condition: "착공 및 계통연계 확정", risk: "전력망 지연" },
  { sector: "초고압 케이블", path: "송전·변전 연결", visibility: "높음", condition: "대규모 전력 확보", risk: "원자재·공기 지연" },
  { sector: "UPS·배전반", path: "무중단 전원 공급", visibility: "높음", condition: "데이터센터 건설 진행", risk: "경쟁·단가 하락" },
  { sector: "액체냉각·CDU", path: "고밀도 GPU 열관리", visibility: "높음", condition: "랙당 전력밀도 상승", risk: "기술표준 변화" },
  { sector: "칠러·항온항습", path: "시설 냉각", visibility: "중상", condition: "설비 발주", risk: "에너지효율 경쟁" },
  { sector: "건설·EPC", path: "데이터센터 시공", visibility: "중상", condition: "인허가·금융조달 완료", risk: "원가 상승" },
  { sector: "광통신·네트워크", path: "GPU 간·센터 간 연결", visibility: "중상", condition: "클러스터 규모 증가", risk: "제품 교체주기" },
  { sector: "발전·ESS", path: "신규 전원 확보", visibility: "중장기", condition: "전력구매계약 체결", risk: "규제·자본 부담" },
];

export const ADI_SECTOR_NOTE = "같은 전력기기 업체라도 실제 데이터센터 수주 비중, 해외 생산능력, 수주잔고, 영업이익률에 따라 실적 영향은 크게 달라집니다. 'AI 데이터센터 관련주'라는 이유만으로 동일한 수혜를 받는 것은 아닙니다.";

export const ADI_FINANCING_DIAGRAM = `엔비디아의 투자·보증
  ↓
고객사의 데이터센터 건설
  ↓
엔비디아 GPU·네트워크 구매
  ↓
엔비디아 매출 증가`;

export const ADI_FINANCING_CAUTIONS: string[] = [
  "고객사의 자체 현금흐름보다 외부 금융지원 의존도가 높아질 수 있음",
  "GPU 공급사의 보증이 다시 GPU 구매로 연결될 수 있음",
  "최종 AI 서비스 매출보다 인프라 투자가 앞서갈 수 있음",
  "고객사의 신용위험이 공급사나 금융기관으로 이전될 수 있음",
  "장기 계약 해지나 수요 둔화 시 손실이 확대될 수 있음",
];

export const ADI_PROJECT_CHECKLIST: string[] = [
  "전력 공급계약 또는 계통연계 승인 여부",
  "부지 확보와 환경·건축 인허가",
  "프로젝트 파이낸싱 약정",
  "EPC 업체 선정",
  "실제 착공 여부",
  "단계별 전력 공급 개시 시점",
  "GPU·냉각·변압기 발주 여부",
];

export const ADI_FINANCIAL_CHECKLIST: string[] = [
  "수주잔고 증가 — 미래 매출 가능성",
  "신규 수주액 — 프로젝트 유입 정도",
  "매출 전환율 — 수주가 실제 매출로 전환되는 속도",
  "영업이익률 — 원가 상승을 흡수하는 능력",
  "영업현금흐름 — 회계상 이익의 질",
  "고객 집중도 — 특정 프로젝트 취소 위험",
];

export const ADI_RISKS: AdiRiskRow[] = [
  { risk: "전력 확보 실패", importance: "매우 높음", content: "계통연계·발전원·전력구매계약(PPA) 확보 여부 확인 필요" },
  { risk: "금융조달 실패", importance: "높음", content: "금리·보증·임차계약 조건에 따라 프로젝트 지연·축소 가능" },
  { risk: "AI 수요 둔화", importance: "높음", content: "GPU 이용률·클라우드 매출 둔화 시 투자 회수 지연" },
  { risk: "고객 신용위험", importance: "높음", content: "장기 계약자의 재무상태에 따라 프로젝트 실행 여부 변동" },
  { risk: "전력가격 상승", importance: "높음", content: "운영비 부담 증가로 수익성 저하 가능" },
  { risk: "인허가 지연", importance: "높음", content: "환경·건축·지역사회 승인 절차로 착공이 지연될 수 있음" },
  { risk: "공사비 상승", importance: "높음", content: "원자재·인건비·EPC 원가 상승 리스크" },
  { risk: "공급과잉", importance: "중상", content: "데이터센터 공실·이용률 저하 가능성" },
];

export const ADI_CHECKLIST: string[] = [
  "국내 2GW급 프로젝트의 실제 착공·인허가 진행 상황",
  "전력기기·냉각 업종의 수주 잔고 공시 여부",
  "엔비디아의 데이터센터 금융 지원 규모·조건 확정 여부",
  "AI 데이터센터 투자가 과열 국면인지 여부 (밸류에이션 점검)",
  "개별 종목 접근보다 업종 ETF·분산 투자 검토",
];

export const ADI_FAQ: AdiFaqItem[] = [
  { q: "AI 데이터센터가 왜 전력·냉각 문제로 이어지나요?", a: "GPU 서버는 연산 밀도가 높아 많은 전력을 소비하고 큰 열을 발생시킵니다. 서버 전력뿐 아니라 냉각·UPS·배전설비에도 추가 전력이 필요합니다. IEA에 따르면 냉각은 효율적인 하이퍼스케일 데이터센터에서는 전체 전력의 약 7%, 효율이 낮은 데이터센터에서는 30% 이상을 차지할 수 있습니다." },
  { q: "2GW는 어느 정도 규모인가요?", a: "2GW는 2,000MW입니다. 최대 출력으로 1년간 계속 사용한다고 단순 계산하면 약 17.52TWh입니다. 다만 발표상의 2GW가 IT 장비 전력인지 시설 전체 전력인지, 최종 전력 확보 목표인지 확인해야 합니다." },
  { q: "전력기기 기업은 모두 직접 수혜를 받나요?", a: "아닙니다. 데이터센터용 초고압 변압기·배전반·UPS 납품 경험, 실제 수주잔고, 생산능력, 고객사와 수익성을 확인해야 합니다. 단순히 전력기기 업종에 속한다는 것만으로 실적 수혜가 확정되지는 않습니다." },
  { q: "액체냉각이 왜 중요해지나요?", a: "AI GPU의 소비전력과 랙당 발열이 증가하면서 기존 공랭만으로 효율적인 냉각이 어려워지고 있기 때문입니다. 직접수냉, 냉각수 분배장치인 CDU, 칠러와 열교환기 수요가 함께 증가할 수 있습니다." },
  { q: "엔비디아의 금융보증은 확정됐나요?", a: "아닙니다. 약 2,500억달러 규모의 금융보증을 검토 중이라는 보도가 나온 단계입니다. 보증 규모·수수료·책임 범위와 최종 계약 여부는 확인되지 않았습니다." },
  { q: "오하이오 데이터센터는 OpenAI가 직접 짓나요?", a: "보도상 SB Energy가 개발을 담당하고 오픈AI가 주요 임차 또는 이용 주체로 참여하는 방안이 논의되고 있습니다. 개발사, 자금조달 주체, 임차인, GPU 공급사를 구분해서 봐야 합니다." },
  { q: "이 리포트에 나온 업종은 매수 추천인가요?", a: "아닙니다. 산업 구조와 수혜 가능성을 설명하는 정보성 콘텐츠이며 개별 종목 매수를 권유하지 않습니다." },
  { q: "데이터센터 발표가 기업 매출로 반영되기까지 얼마나 걸리나요?", a: "전력기기·설계는 착공 전부터 발주될 수 있지만, 건설·냉각·서버·통신장비는 공정 단계에 따라 순차적으로 반영됩니다. 프로젝트가 발표됐다고 모든 관련 기업의 매출이 즉시 증가하는 것은 아닙니다." },
];

export const ADI_SEO_INTRO = `AI 인프라 경쟁의 중심이 GPU 확보에서 전력·냉각·데이터센터 부지·통신망 확보로 확대되고 있습니다. AI 가속기를 충분히 구매하더라도 대규모 전력망, 변압기, 냉각설비, 네트워크와 인허가가 준비되지 않으면 실제 데이터센터를 가동할 수 없기 때문입니다. 국제에너지기구(IEA)는 전 세계 데이터센터 전력 소비가 2024년 약 415TWh에서 2030년 약 945TWh로 두 배 이상 증가할 것으로 전망했으며, AI 최적화 데이터센터가 증가세를 주도할 것으로 예상했습니다. 이 리포트는 그동안 반도체 칩 중심으로만 다뤄지던 밸류체인에서, 전력·냉각·건설·통신이라는 별도 밸류체인과 국내외 프로젝트 현황을 정리합니다.`;

export const ADI_SEO_CRITERIA = [
  "AI 경쟁이 모델에서 전력·데이터센터·냉각·통신 인프라 확보 경쟁으로 확장되고 있습니다",
  "국내 2GW급 AI 팩토리는 발표·보도 기준 구상이며, 2027년은 초기 운영 목표로 이후 단계적으로 확대됩니다",
  "오하이오 10GW·2,500억달러 금융보증은 확정 계약이 아니라 개발·협의 단계입니다",
  "전력기기·냉각·건설·통신 업종은 수주 단계·조건에 따라 실제 수혜 여부가 달라집니다",
  "이 리포트는 업종 이해를 돕는 정보성 콘텐츠이며 개별 종목 매수를 권유하지 않습니다",
];
