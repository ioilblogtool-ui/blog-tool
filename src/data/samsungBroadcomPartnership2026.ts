export type SbpSummaryCard = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type SbpScopeRow = {
  area: string;
  content: string;
};

export type SbpInterpretationRow = {
  interpretation: string;
  possible: "O" | "X" | "확인 불가";
  note: string;
};

export type SbpBonusStageRow = {
  stage: string;
  impact: string;
};

export type SbpChecklistRow = {
  item: string;
  source: string;
  meaning: string;
};

export type SbpComparisonRow = {
  category: string;
  samsung: string;
  skhynix: string;
};

export type SbpRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type SbpFaqItem = {
  q: string;
  a: string;
};

export const SBP_META = {
  announceDate: "2026년 7월 24일 현지시간(한국시간 25일)",
  eventName: "샌프란시스코 AI 서밋",
  dealSize: "2,000억달러 이상 (예상 협력 규모)",
  dealPeriod: "2030년까지 향후 5년",
  dealType: "전략적 업무협약(MOU)",
  notice: "이 페이지는 삼성전자 공식 발표와 보도를 기반으로 한 분석이며 투자 권유가 아닙니다. 2,000억달러는 삼성전자 공식 발표상 예상 협력 규모이며, 확정 발주액·보장 매출액·영업이익을 의미하지 않습니다. 연도별 발주액과 제품별 물량·공급단가는 공개되지 않았습니다.",
  sources: [
    { label: "삼성전자 공식 발표(국문)", org: "Samsung Newsroom Korea" },
    { label: "삼성전자 공식 발표(영문)", org: "Samsung Global Newsroom" },
    { label: "로이터 보도", org: "Reuters" },
  ],
};

export const SBP_SUMMARY_CARDS: SbpSummaryCard[] = [
  { label: "협약 형태", value: "전략적 업무협약(MOU)", badge: "공식" },
  { label: "예상 협력 규모", value: "2,000억달러 이상 (2030년까지 5년간)", badge: "공식" },
  { label: "협력 범위", value: "메모리(HBM)·파운드리(2나노 이하)·첨단 패키징(2.3D·2.5D)", badge: "공식" },
];

export const SBP_DEAL_SCOPE: SbpScopeRow[] = [
  { area: "메모리", content: "HBM 등 차세대 메모리 솔루션 공급" },
  { area: "파운드리", content: "2나노 이하 첨단공정으로 AI 가속기·고속 데이터 통신용 반도체 생산" },
  { area: "첨단 패키징", content: "2나노 공정 기반 2.3D·2.5D 통합 패키징 협력" },
  { area: "미공개 정보", content: "연도별 발주액·제품별 물량·공급단가·마진은 공개되지 않음" },
];

export const SBP_INTERPRETATION: SbpInterpretationRow[] = [
  { interpretation: "삼성전자 확정 수주액", possible: "X", note: "MOU 단계이며 확정 발주액은 공개되지 않음" },
  { interpretation: "삼성전자 매출 2,000억달러", possible: "X", note: "협력 규모와 회계상 매출 인식 기준은 다름" },
  { interpretation: "메모리만의 공급액", possible: "X", note: "메모리와 파운드리 분야를 합산한 규모" },
  { interpretation: "5년간 협력 예상치", possible: "O", note: "공식 발표의 정확한 표현" },
  { interpretation: "첨단 패키징 포함 여부", possible: "O", note: "기술 협력 범위에 포함됨" },
  { interpretation: "전 물량의 삼성 독점 공급", possible: "확인 불가", note: "독점 공급 여부는 공개되지 않음" },
];

export const SBP_AVERAGE_NOTE = "단순 환산 참고: 5년간 2,000억달러는 연평균 약 400억달러에 해당합니다. 다만 이는 수학적 단순 환산일 뿐이며, 연도별 집행 규모가 균등하지 않을 수 있고, 메모리·파운드리 범위가 함께 포함돼 있으며, 최종 발주액이 예상치와 달라질 수 있어 삼성전자의 연간 확정 매출 전망치로 볼 수 없습니다.";

export const SBP_WHY_IMPORTANT: string[] = [
  "삼성전자만 가능한 통합 공급 구조 — 메모리·파운드리·첨단 패키징을 한 회사 안에서 연결하는 종합반도체(IDM) 역량을 활용한 계약입니다.",
  "브로드컴은 단순 팹리스가 아님 — 빅테크 고객이 자체 AI 반도체를 개발할 수 있도록 설계·연결 기술을 제공하는 대표적인 커스텀 반도체 기업으로, 복수의 AI·네트워킹 제품군에 참여할 가능성을 의미합니다. 다만 구글 등 특정 최종 고객의 물량을 삼성이 직접 수주했다고 단정할 근거는 아직 없습니다.",
  "파운드리 가동률 개선 가능성 — 브로드컴의 차세대 통신·네트워킹 반도체에 2나노 이하 공정이 실제 적용되면 가동률과 고객 포트폴리오 개선에 도움이 될 수 있으나, 설계 완료·테이프아웃·시험생산·양산 발주가 순차적으로 이어져야 확정됩니다.",
  "HBM 단독 경쟁에서 통합 솔루션 경쟁으로 확장 — HBM 개별 공급을 넘어 로직 생산과 패키징까지 묶어 제안할 수 있어, SK하이닉스와의 HBM 경쟁뿐 아니라 TSMC의 파운드리·패키징 생태계와도 경쟁하는 구조입니다.",
];

export const SBP_POSITIVE_FACTORS: string[] = [
  "HBM 고객 다변화 (엔비디아 외 브로드컴 확보)",
  "파운드리 2나노 가동률 개선 가능성",
  "첨단 패키징 매출 확대",
  "파운드리 누적 적자 축소 가능성",
];

export const SBP_VERIFICATION_CHECKLIST: string[] = [
  "브로드컴용 HBM 인증 완료 여부",
  "2나노 실제 양산 수율",
  "고객별 웨이퍼 투입량",
  "패키징 물량 확정 여부",
  "계약 금액의 확정 발주 전환 시점",
];

export const SBP_BONUS_STAGES: SbpBonusStageRow[] = [
  { stage: "MOU 체결", impact: "제한적" },
  { stage: "구체적 제품·물량 확정", impact: "소폭 긍정" },
  { stage: "양산 및 매출 반영", impact: "긍정" },
  { stage: "파운드리 적자 축소", impact: "긍정 확대" },
  { stage: "목표이익 초과 달성", impact: "OPI에 직접 영향 가능" },
];

export const SBP_INVESTOR_CHECKLIST: SbpChecklistRow[] = [
  { item: "확정 발주 전환", source: "삼성전자 공시·실적발표", meaning: "MOU의 실적 가시화" },
  { item: "브로드컴용 HBM 공급", source: "삼성·브로드컴 공식발표", meaning: "HBM 고객 다변화" },
  { item: "2나노 제품 양산", source: "삼성 파운드리 발표", meaning: "선단공정 경쟁력" },
  { item: "웨이퍼 투입 증가", source: "파운드리 매출·가동률 추정", meaning: "실제 물량 증가" },
  { item: "파운드리 적자 폭", source: "삼성전자 분기 실적", meaning: "수익성 개선 여부" },
  { item: "패키징 매출", source: "DS부문 설명·산업자료", meaning: "턴키 효과 확인" },
  { item: "고객사 확대", source: "신규 ASIC·네트워킹 고객 발표", meaning: "브로드컴 외 확장성" },
  { item: "자본지출 변화", source: "삼성전자 CAPEX 공시", meaning: "공급 대응 투자" },
  { item: "수율 안정화", source: "공식 발언·신뢰도 높은 보도", meaning: "마진 개선 가능성" },
];

export const SBP_RISKS: SbpRiskRow[] = [
  { risk: "확정 발주 전환 불확실성", content: "제품별 물량·단가·일정이 공개되지 않아 MOU가 실제 발주로 이어질지 불확실", severity: "높음" },
  { risk: "2나노 수율 및 원가", content: "매출보다 수익성에 직접 영향을 주는 변수이며 수율 안정화 여부가 관건", severity: "높음" },
  { risk: "HBM 경쟁", content: "고객 인증·성능·공급능력을 둘러싼 경쟁이 지속됨", severity: "높음" },
  { risk: "계약 규모 해석 오류", content: "예상 협력 규모를 확정 매출로 오해할 경우 기대와 실제 실적 간 괴리 발생 가능", severity: "높음" },
  { risk: "TSMC와의 경쟁", content: "파운드리·첨단 패키징 생태계 전반에서 TSMC와의 수주 경쟁이 계속됨", severity: "높음" },
  { risk: "실적 반영 시차", content: "설계 완료부터 양산까지 여러 단계를 거쳐야 하며 시점을 일괄 단정하기 어려움", severity: "중간" },
  { risk: "고객 집중도", content: "브로드컴 프로젝트에 대한 의존도가 얼마나 되는지는 아직 확인되지 않음", severity: "중간" },
];

export const SBP_COMPARISON: SbpComparisonRow[] = [
  { category: "HBM", samsung: "공급 가능", skhynix: "핵심 경쟁 분야" },
  { category: "파운드리", samsung: "보유", skhynix: "미보유" },
  { category: "로직 공정", samsung: "2나노 이하 제공", skhynix: "직접 생산하지 않음" },
  { category: "첨단 패키징", samsung: "자체 솔루션 제공", skhynix: "메모리 중심" },
  { category: "핵심 전략", samsung: "통합 턴키 솔루션", skhynix: "HBM 기술·공급 우위" },
];

export const SBP_FAQ: SbpFaqItem[] = [
  { q: "2,000억달러는 확정 계약금액인가요?", a: "아닙니다. 삼성전자 공식 발표 기준 2030년까지 5년간 예상되는 협력 규모이며, MOU(업무협약) 단계 수치입니다. 확정 발주액이나 보장 매출액이 아닙니다." },
  { q: "2,000억달러가 삼성전자 매출로 모두 잡히나요?", a: "아닙니다. 협력 규모와 회계상 매출 인식 기준은 다릅니다. 연도별 집행 규모, 실제 발주 물량, 공급단가에 따라 삼성전자가 인식하는 매출은 달라집니다." },
  { q: "브로드컴은 어떤 회사인가요?", a: "구글 등 빅테크 고객이 자체 AI 반도체(ASIC)를 개발할 수 있도록 설계와 연결 기술을 제공하는 대표적인 커스텀 반도체 기업입니다." },
  { q: "삼성전자 파운드리 적자가 이걸로 바로 해소되나요?", a: "아닙니다. HBM 인증, 2나노 수율, 실제 발주 전환이 순차적으로 확인돼야 하며, 이번 협력은 단기 실적 개선 재료보다 중장기 선행지표로 보는 것이 적절합니다." },
  { q: "HBM 계약과 무슨 관계인가요?", a: "브로드컴의 차세대 AI 가속기 등에 들어갈 HBM을 삼성전자가 공급하는 내용이 포함돼 있어 HBM 고객 다변화 사례로 볼 수 있습니다." },
  { q: "SK하이닉스와는 어떻게 다른가요?", a: "SK하이닉스는 HBM 공급 경쟁력이 핵심인 반면, 삼성전자는 HBM뿐 아니라 파운드리와 첨단 패키징까지 함께 제공할 수 있다는 차이가 있습니다. 다만 HBM 실제 공급량과 고객 인증, 파운드리 양산 물량은 별도로 확인해야 합니다." },
  { q: "브로드컴의 구글 TPU도 삼성이 생산하나요?", a: "현재 공개된 공식자료만으로는 특정 최종 고객의 제품을 삼성전자가 생산한다고 확정할 수 없습니다. 브로드컴이 여러 빅테크의 커스텀 반도체 설계에 참여하고 있지만, 이번 MOU의 고객별 제품과 물량은 공개되지 않았습니다." },
  { q: "이번 MOU가 삼성전자 OPI에 반영되나요?", a: "MOU 체결 자체가 곧바로 OPI에 반영되지는 않습니다. 구체적 제품·물량 확정, 양산과 매출 반영, 파운드리 적자 축소 등 단계를 거쳐야 목표이익 달성 여부에 영향을 줄 수 있습니다." },
  { q: "MOU와 본계약의 차이는 무엇인가요?", a: "MOU는 구속력이 강하지 않은 협력 방향 합의이며, 본계약(공급계약)에서 물량·단가·기간·책임 소재가 확정됩니다. 이번 발표는 MOU 단계입니다." },
  { q: "실제 양산 여부는 무엇으로 확인할 수 있나요?", a: "삼성전자 공시·분기 실적발표에서 파운드리 가동률, 첨단 패키징 매출, 파운드리 적자 폭 변화를 통해 간접적으로 확인할 수 있습니다." },
];

export const SBP_SEO_INTRO = `삼성전자는 2026년 7월 24일 현지시간 미국 샌프란시스코에서 열린 AI 서밋에서 브로드컴과 차세대 AI 인프라 구축을 위한 전략적 업무협약(MOU)을 체결했습니다. 양사는 2030년까지 향후 5년간 메모리와 파운드리 분야에서 2,000억달러 이상 규모의 협력을 추진할 예정이며, 협력 범위에는 HBM 등 첨단 메모리, 2나노 이하 파운드리 공정, 2나노 기반 2.3D·2.5D 첨단 패키징이 포함됩니다. 다만 2,000억달러는 확정된 단일 수주금액이나 삼성전자의 보장 매출액이 아니라 공식 발표상 예상 협력 규모이며, 연도별 발주액·제품별 물량·공급단가·수익성은 공개되지 않았습니다.`;

export const SBP_SEO_CRITERIA = [
  "2,000억달러는 확정 계약금액이 아니라 2030년까지 5년간 예상되는 협력 규모(삼성전자 공식 발표 기준)",
  "협력 범위는 메모리(HBM)·파운드리(2나노 이하)·첨단 패키징(2.3D·2.5D) 3개 영역",
  "브로드컴은 구글 등 빅테크 커스텀 AI 가속기(ASIC) 설계 생태계의 핵심 기업이나, 최종 고객별 물량 배정은 공개되지 않음",
  "실질적 주가·성과급 재평가를 위해서는 확정 발주 전환, HBM 인증, 2나노 수율 안정화가 확인돼야 함",
  "이 리포트는 삼성전자 공식 발표와 보도를 기반으로 하며 투자 권유가 아닙니다",
];
