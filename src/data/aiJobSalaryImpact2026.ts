export type ImpactTone = "positive" | "neutral" | "warning";
export type ImpactLevel = "low" | "medium" | "high" | "very-high";
export type JobTrack = "builder" | "operator" | "analyst" | "creative" | "support";

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  updatedAt: string;
  methodology: string;
  caution: string;
}

export interface HeroStat {
  label: string;
  value: string;
  sub: string;
  tone?: ImpactTone;
}

export interface IntroCard {
  title: string;
  body: string;
  stat: string;
}

export interface JobImpactRow {
  id: string;
  name: string;
  track: JobTrack;
  filterTags: string[];
  aiAdoptionLevel: ImpactLevel;
  automationRiskLevel: ImpactLevel;
  salaryUpsideLevel: ImpactLevel;
  hiringMomentumLevel: ImpactLevel;
  aiPremiumRange: string;
  salaryBand2026: string;
  summary: string;
  why: string[];
  recommendedTools: string[];
  negotiationSignals: string[];
  tags: string[];
}

export interface GapCompareRow {
  id: string;
  jobName: string;
  aiUserSalaryIndex: number;
  nonAiSalaryIndex: number;
  productivityIndex: number;
  negotiationPowerIndex: number;
  summary: string;
}

export interface RankedCard {
  id: string;
  jobName: string;
  headline: string;
  summary: string;
  reason: string;
  tone: ImpactTone;
}

export interface HiringSignalRow {
  companyType: string;
  aiAdoptionStyle: string;
  hiringChange: string;
  implication: string;
}

export interface ToolStackRow {
  jobName: string;
  coreTools: string[];
  useCases: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  weight: number;
}

export interface OutlookItem {
  year: string;
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

export const levelLabel: Record<ImpactLevel, string> = {
  low: "낮음",
  medium: "중간",
  high: "높음",
  "very-high": "매우 높음",
};

export const trackLabel: Record<JobTrack, string> = {
  builder: "빌더",
  operator: "오퍼레이션",
  analyst: "분석",
  creative: "크리에이티브",
  support: "지원",
};

export const aiJobSalaryImpact2026 = {
  meta: {
    slug: "ai-job-salary-impact-2026",
    title: "직군별 AI 도입 전후 연봉 효과 비교 2026",
    subtitle: "개발자·마케터·디자이너·PM·회계·번역 등 10개 직군 기준",
    description:
      "개발자, 마케터, 디자이너, PM, 회계, 번역 등 10개 직군 기준으로 AI 도입 이후 연봉 격차와 채용시장 변화를 2026 데이터 기준으로 비교한 인터랙티브 리포트입니다.",
    updatedAt: "업데이트: 2026년 4월 19일",
    methodology:
      "국내외 채용공고 변화, 직무 자동화 가능성, AI 활용 성과 지표를 비교계산소 내부 인덱스로 표준화했습니다.",
    caution:
      "이 페이지는 공식 연봉표가 아니라 시장 해석형 리포트입니다. 실제 연봉은 기업 규모, 경력, 포지션, 성과에 따라 달라집니다.",
  } satisfies ReportMeta,
  heroStats: [
    { label: "비교 직군", value: "10개", sub: "지식근로·지원·창작 직군", tone: "neutral" },
    { label: "AI 프리미엄 강함", value: "4개", sub: "성과 설명이 쉬운 직군", tone: "positive" },
    { label: "압박 신호", value: "3개", sub: "반복 업무 비중이 높은 직군", tone: "warning" },
    { label: "핵심 기준", value: "KPI", sub: "도구 사용보다 개선 수치", tone: "positive" },
  ] satisfies HeroStat[],
  introCards: [
    {
      title: "AI는 직업보다 업무 묶음을 먼저 바꿉니다",
      body: "직군 전체가 사라지는 방식보다 리서치, 초안 작성, 반복 검토처럼 업무 일부가 압축되는 변화가 먼저 나타납니다.",
      stat: "업무 단위 변화",
    },
    {
      title: "연봉 프리미엄은 결과 개선에 붙습니다",
      body: "AI를 쓴다는 사실보다 처리량, 오류율, 리드타임, 매출 기여를 수치로 설명할 수 있을 때 협상력이 커집니다.",
      stat: "성과 증명",
    },
    {
      title: "반복 업무 비중이 높을수록 평균 압박이 커집니다",
      body: "입력, 요약, 1차 응대처럼 표준화가 쉬운 업무는 인원 구조와 단가 협상에서 먼저 압박을 받을 수 있습니다.",
      stat: "역할 재설계",
    },
  ] satisfies IntroCard[],
  jobImpactRows: [
    {
      id: "developer",
      name: "개발자",
      track: "builder",
      filterTags: ["positive", "builder"],
      aiAdoptionLevel: "very-high",
      automationRiskLevel: "medium",
      salaryUpsideLevel: "very-high",
      hiringMomentumLevel: "high",
      aiPremiumRange: "강함: 생산성·품질 지표를 설명할 때 프리미엄 확대",
      salaryBand2026: "중상~상위 밴드",
      summary: "코드 작성 속도보다 설계, 검증, 운영 책임까지 묶어 설명하는 개발자가 유리합니다.",
      why: ["코드 초안 작성 시간이 줄어듭니다.", "테스트·리팩터링 범위가 넓어집니다.", "AI 산출물 검증 능력이 차별점입니다."],
      recommendedTools: ["GitHub Copilot", "Cursor", "ChatGPT", "Claude"],
      negotiationSignals: ["배포 리드타임 단축", "테스트 커버리지 개선", "장애 대응 문서화"],
      tags: ["수혜 가능성 높음", "검증 역량 중요", "빌더"],
    },
    {
      id: "marketer",
      name: "마케터",
      track: "creative",
      filterTags: ["positive", "creative"],
      aiAdoptionLevel: "high",
      automationRiskLevel: "medium",
      salaryUpsideLevel: "high",
      hiringMomentumLevel: "high",
      aiPremiumRange: "중상: 캠페인 실험 속도와 소재 생산성이 핵심",
      salaryBand2026: "중간~상위 밴드",
      summary: "콘텐츠 생산량보다 실험 설계와 전환 개선을 AI로 증명하는 마케터가 유리합니다.",
      why: ["광고 소재 변형을 빠르게 만들 수 있습니다.", "세그먼트별 메시지 테스트가 쉬워집니다.", "성과 리포트 자동화 여지가 큽니다."],
      recommendedTools: ["ChatGPT", "Perplexity", "Midjourney", "GA4"],
      negotiationSignals: ["소재 제작 시간 단축", "전환율 개선", "리포트 작성 자동화"],
      tags: ["성과형", "크리에이티브", "실험 속도"],
    },
    {
      id: "designer",
      name: "디자이너",
      track: "creative",
      filterTags: ["positive", "creative"],
      aiAdoptionLevel: "high",
      automationRiskLevel: "medium",
      salaryUpsideLevel: "high",
      hiringMomentumLevel: "medium",
      aiPremiumRange: "중상: 시안 탐색과 디자인 시스템 적용 능력에 프리미엄",
      salaryBand2026: "중간~상위 밴드",
      summary: "이미지 생성 자체보다 문제 정의, 사용자 흐름, 최종 품질 조율이 연봉 방어 포인트입니다.",
      why: ["무드보드와 시안 탐색 속도가 빨라집니다.", "반복 배너 제작은 자동화 압박을 받습니다.", "디자인 시스템 운영 능력이 더 중요해집니다."],
      recommendedTools: ["Figma AI", "Midjourney", "ChatGPT", "Runway"],
      negotiationSignals: ["시안 생산 리드타임", "디자인 QA 오류 감소", "컴포넌트 재사용률"],
      tags: ["크리에이티브", "품질 조율", "반복 제작 압박"],
    },
    {
      id: "pm",
      name: "PM·기획자",
      track: "operator",
      filterTags: ["positive", "operator"],
      aiAdoptionLevel: "high",
      automationRiskLevel: "low",
      salaryUpsideLevel: "high",
      hiringMomentumLevel: "high",
      aiPremiumRange: "강함: 리서치·문서·실험 운영을 함께 줄일 때 확대",
      salaryBand2026: "중상~상위 밴드",
      summary: "AI로 문서만 빠르게 쓰는 것보다 의사결정 속도와 실험 처리량을 높이는 PM이 유리합니다.",
      why: ["요구사항 정리와 회의록 구조화가 빨라집니다.", "사용자 리서치 초안과 경쟁 분석 속도가 올라갑니다.", "실험 우선순위 조정이 더 정교해집니다."],
      recommendedTools: ["ChatGPT", "Claude", "Notion AI", "Perplexity"],
      negotiationSignals: ["실험 사이클 단축", "문서 품질 표준화", "의사결정 병목 감소"],
      tags: ["오퍼레이션", "리서치", "협업"],
    },
    {
      id: "data-analyst",
      name: "데이터 분석가",
      track: "analyst",
      filterTags: ["positive", "builder", "operator"],
      aiAdoptionLevel: "very-high",
      automationRiskLevel: "medium",
      salaryUpsideLevel: "very-high",
      hiringMomentumLevel: "high",
      aiPremiumRange: "강함: 분석 자동화보다 비즈니스 해석이 핵심",
      salaryBand2026: "중상~상위 밴드",
      summary: "쿼리 작성 자동화는 기본이 되고, 의사결정으로 연결하는 해석력이 프리미엄을 만듭니다.",
      why: ["SQL·파이썬 초안 생성이 쉬워집니다.", "대시보드 설명과 인사이트 정리가 빨라집니다.", "지표 정의 오류를 잡는 능력이 중요합니다."],
      recommendedTools: ["ChatGPT", "Julius", "Python", "BI Copilot"],
      negotiationSignals: ["분석 요청 처리량", "대시보드 활용률", "의사결정 반영 건수"],
      tags: ["분석", "수혜 가능성 높음", "검증 역량"],
    },
    {
      id: "accounting",
      name: "회계·재무",
      track: "analyst",
      filterTags: ["pressure", "operator"],
      aiAdoptionLevel: "medium",
      automationRiskLevel: "high",
      salaryUpsideLevel: "medium",
      hiringMomentumLevel: "medium",
      aiPremiumRange: "중간: 반복 처리보다 검토·통제 역량에 프리미엄",
      salaryBand2026: "중간 밴드",
      summary: "입력과 대사 업무는 압박을 받고, 내부통제와 해석 중심 역할은 방어력이 생깁니다.",
      why: ["전표 분류와 반복 리포트 자동화 여지가 큽니다.", "규정 해석과 예외 처리 책임은 남습니다.", "감사 대응 문서 품질이 중요합니다."],
      recommendedTools: ["Excel Copilot", "ChatGPT", "ERP 자동화", "Power BI"],
      negotiationSignals: ["마감 기간 단축", "오류율 감소", "감사 대응 리드타임"],
      tags: ["압박 가능성 높음", "검토 역량", "재무"],
    },
    {
      id: "translator",
      name: "번역·로컬라이징",
      track: "creative",
      filterTags: ["pressure", "creative"],
      aiAdoptionLevel: "very-high",
      automationRiskLevel: "very-high",
      salaryUpsideLevel: "medium",
      hiringMomentumLevel: "low",
      aiPremiumRange: "양극화: 1차 번역은 압박, 고난도 검수는 프리미엄",
      salaryBand2026: "중하~전문 상위 밴드",
      summary: "초벌 번역 단가는 압박이 크지만, 법률·의료·게임처럼 맥락 검수가 필요한 영역은 차별화됩니다.",
      why: ["초벌 번역 품질이 빠르게 올라왔습니다.", "전문 용어와 맥락 검수는 여전히 중요합니다.", "프로젝트 관리와 QA 능력이 단가를 지킵니다."],
      recommendedTools: ["DeepL", "ChatGPT", "Phrase", "Trados"],
      negotiationSignals: ["검수 오류율", "도메인 전문성", "납기 단축"],
      tags: ["압박 가능성 높음", "전문 검수", "크리에이티브"],
    },
    {
      id: "cs",
      name: "고객상담·CS",
      track: "support",
      filterTags: ["pressure", "operator"],
      aiAdoptionLevel: "high",
      automationRiskLevel: "very-high",
      salaryUpsideLevel: "low",
      hiringMomentumLevel: "low",
      aiPremiumRange: "낮음~중간: 1차 응대는 자동화, 고난도 케이스 관리가 방어선",
      salaryBand2026: "중하~중간 밴드",
      summary: "단순 문의 응대는 압박이 크고, 품질 관리·VOC 분석·위기 대응 역할로 이동해야 합니다.",
      why: ["FAQ와 1차 응대 자동화가 빠르게 늘어납니다.", "복잡한 컴플레인 처리와 품질 관리가 남습니다.", "상담 데이터 분석 역량이 중요해집니다."],
      recommendedTools: ["Zendesk AI", "ChatGPT", "상담봇", "VOC 분석 도구"],
      negotiationSignals: ["응답 시간 단축", "재문의율 감소", "VOC 개선 제안"],
      tags: ["압박 가능성 높음", "오퍼레이션", "품질관리"],
    },
    {
      id: "hr",
      name: "HR·채용",
      track: "operator",
      filterTags: ["operator"],
      aiAdoptionLevel: "medium",
      automationRiskLevel: "medium",
      salaryUpsideLevel: "medium",
      hiringMomentumLevel: "medium",
      aiPremiumRange: "중간: 채용 운영 자동화와 조직 데이터 해석이 관건",
      salaryBand2026: "중간 밴드",
      summary: "공고 작성과 후보자 요약은 자동화되고, 조직 설계와 평가 기준 운영이 중요해집니다.",
      why: ["채용공고와 후보자 요약 시간이 줄어듭니다.", "평가 편향 관리와 개인정보 이슈가 큽니다.", "조직 데이터 기반 제안이 차별점입니다."],
      recommendedTools: ["Notion AI", "ChatGPT", "ATS AI", "People Analytics"],
      negotiationSignals: ["채용 리드타임", "면접 품질 개선", "온보딩 이탈률 감소"],
      tags: ["오퍼레이션", "채용", "중간 영향"],
    },
    {
      id: "sales",
      name: "영업·BD",
      track: "operator",
      filterTags: ["positive", "operator"],
      aiAdoptionLevel: "high",
      automationRiskLevel: "low",
      salaryUpsideLevel: "high",
      hiringMomentumLevel: "high",
      aiPremiumRange: "중상: 리드 발굴과 제안서 품질 개선이 성과급으로 연결",
      salaryBand2026: "중간~상위 밴드",
      summary: "고객 리서치와 제안서 자동화는 영업 활동량을 늘리고 성과급 협상 근거가 됩니다.",
      why: ["고객사 리서치와 메일 초안 작성이 빨라집니다.", "제안서 개인화가 쉬워집니다.", "CRM 기록 품질이 성과 관리와 연결됩니다."],
      recommendedTools: ["ChatGPT", "Perplexity", "CRM AI", "Gamma"],
      negotiationSignals: ["리드 전환율", "제안서 작성 시간", "파이프라인 증가"],
      tags: ["수혜 가능성 높음", "오퍼레이션", "성과급"],
    },
  ] satisfies JobImpactRow[],
  gapCompareRows: [
    { id: "developer", jobName: "개발자", aiUserSalaryIndex: 128, nonAiSalaryIndex: 100, productivityIndex: 142, negotiationPowerIndex: 132, summary: "AI 활용자가 설계·테스트·문서화까지 묶어 설명할 때 격차가 커집니다." },
    { id: "marketer", jobName: "마케터", aiUserSalaryIndex: 121, nonAiSalaryIndex: 100, productivityIndex: 136, negotiationPowerIndex: 124, summary: "캠페인 실험 속도와 소재 변형 능력이 성과 지표로 연결됩니다." },
    { id: "designer", jobName: "디자이너", aiUserSalaryIndex: 116, nonAiSalaryIndex: 100, productivityIndex: 130, negotiationPowerIndex: 116, summary: "반복 제작보다 문제 정의와 최종 품질 조율에서 차이가 납니다." },
    { id: "pm", jobName: "PM·기획자", aiUserSalaryIndex: 122, nonAiSalaryIndex: 100, productivityIndex: 134, negotiationPowerIndex: 128, summary: "리서치와 문서 속도를 의사결정 속도로 바꿀 때 협상력이 생깁니다." },
    { id: "data-analyst", jobName: "데이터 분석가", aiUserSalaryIndex: 126, nonAiSalaryIndex: 100, productivityIndex: 140, negotiationPowerIndex: 130, summary: "분석 자동화와 비즈니스 해석을 함께 증명할 때 프리미엄이 큽니다." },
    { id: "accounting", jobName: "회계·재무", aiUserSalaryIndex: 110, nonAiSalaryIndex: 100, productivityIndex: 122, negotiationPowerIndex: 112, summary: "마감 단축과 오류 감소를 수치로 제시해야 차이가 납니다." },
    { id: "translator", jobName: "번역·로컬라이징", aiUserSalaryIndex: 108, nonAiSalaryIndex: 100, productivityIndex: 138, negotiationPowerIndex: 106, summary: "초벌 생산성은 높아지지만 검수·도메인 전문성이 없으면 단가 방어가 어렵습니다." },
    { id: "cs", jobName: "고객상담·CS", aiUserSalaryIndex: 106, nonAiSalaryIndex: 100, productivityIndex: 126, negotiationPowerIndex: 104, summary: "1차 응대 자동화가 커질수록 품질관리와 VOC 분석 역량이 중요해집니다." },
    { id: "hr", jobName: "HR·채용", aiUserSalaryIndex: 113, nonAiSalaryIndex: 100, productivityIndex: 124, negotiationPowerIndex: 114, summary: "채용 운영 자동화를 조직 데이터 해석으로 연결해야 합니다." },
    { id: "sales", jobName: "영업·BD", aiUserSalaryIndex: 120, nonAiSalaryIndex: 100, productivityIndex: 132, negotiationPowerIndex: 126, summary: "리드 발굴, 제안서 개인화, CRM 품질이 성과급 논리로 연결됩니다." },
  ] satisfies GapCompareRow[],
  winnersTop3: [
    {
      id: "data-analyst",
      jobName: "데이터 분석가",
      headline: "분석 자동화 + 해석력이 동시에 필요한 직군",
      summary: "쿼리 작성은 빨라지고, 의사결정으로 이어지는 설명 능력은 더 비싸집니다.",
      reason: "AI가 초안과 반복 분석을 줄여도 지표 정의, 이상치 판단, 비즈니스 맥락 해석은 사람의 책임으로 남습니다.",
      tone: "positive",
    },
    {
      id: "developer",
      jobName: "개발자",
      headline: "코드 생산성보다 검증과 운영 책임이 프리미엄",
      summary: "AI 코드 생성이 보편화될수록 설계와 품질 관리가 연봉 협상 포인트가 됩니다.",
      reason: "생산 속도만 빠른 개발자보다 테스트, 리뷰, 배포 안정성까지 설명하는 개발자가 유리합니다.",
      tone: "positive",
    },
    {
      id: "pm",
      jobName: "PM·기획자",
      headline: "리서치와 문서 시간을 의사결정 속도로 바꾸는 직군",
      summary: "회의록, PRD, 경쟁 분석이 빨라지면서 실험 처리량이 핵심 지표가 됩니다.",
      reason: "AI 활용이 팀 전체의 병목 제거로 이어질 때 개인 성과로 설명하기 쉽습니다.",
      tone: "positive",
    },
  ] satisfies RankedCard[],
  pressureTop3: [
    {
      id: "cs",
      jobName: "고객상담·CS",
      headline: "1차 응대 자동화가 가장 빠르게 들어오는 영역",
      summary: "단순 문의 비중이 높은 조직일수록 인원 구조와 단가 압박이 생길 수 있습니다.",
      reason: "역할을 품질 관리, VOC 분석, 고난도 컴플레인 처리로 넓혀야 방어력이 생깁니다.",
      tone: "warning",
    },
    {
      id: "translator",
      jobName: "번역·로컬라이징",
      headline: "초벌 번역 단가 압박과 전문 검수 프리미엄이 동시에 발생",
      summary: "범용 텍스트는 압박이 크고, 산업 맥락과 법적 책임이 있는 번역은 차별화됩니다.",
      reason: "AI 초벌 결과를 검수하고 톤, 용어, 리스크를 관리하는 역량으로 이동해야 합니다.",
      tone: "warning",
    },
    {
      id: "accounting",
      jobName: "회계·재무",
      headline: "입력·대사 업무는 자동화, 통제와 해석은 강화",
      summary: "반복 리포트와 마감 작업은 압축되고 예외 처리와 내부통제 책임이 중요해집니다.",
      reason: "마감 단축, 오류 감소, 감사 대응 품질을 수치로 제시해야 연봉 방어가 쉽습니다.",
      tone: "warning",
    },
  ] satisfies RankedCard[],
  hiringSignals: [
    {
      companyType: "대기업",
      aiAdoptionStyle: "기존 인력의 생산성 도구 표준화",
      hiringChange: "신입·주니어에게도 AI 활용 경험을 묻는 문항 증가",
      implication: "도구 이름보다 보안, 검증, 협업 규칙을 지킨 사례가 중요합니다.",
    },
    {
      companyType: "스타트업",
      aiAdoptionStyle: "소수 인력으로 더 넓은 업무를 처리",
      hiringChange: "제너럴리스트와 자동화 경험자 선호",
      implication: "한 사람이 리서치, 제작, 리포팅까지 연결한 사례가 강합니다.",
    },
    {
      companyType: "BPO·상담 조직",
      aiAdoptionStyle: "상담봇과 품질관리 자동화",
      hiringChange: "단순 처리 인력보다 운영 관리자와 QA 역할 선호",
      implication: "응대량보다 품질 지표와 VOC 개선 경험을 준비해야 합니다.",
    },
    {
      companyType: "전문직 조직",
      aiAdoptionStyle: "리서치·문서 초안 보조",
      hiringChange: "검토 책임과 도메인 전문성 요구 강화",
      implication: "AI 결과를 그대로 쓰지 않고 리스크를 검토한 사례가 필요합니다.",
    },
  ] satisfies HiringSignalRow[],
  negotiationChecklist: [
    { id: "time", text: "AI 도입 후 반복 업무 시간이 몇 % 줄었는지 설명할 수 있다", weight: 2 },
    { id: "output", text: "같은 시간에 처리한 산출물 수나 실험 수가 늘어난 사례가 있다", weight: 2 },
    { id: "quality", text: "오류율, 재작업률, 누락률을 낮춘 근거가 있다", weight: 2 },
    { id: "revenue", text: "매출, 전환율, 리드, 비용 절감처럼 사업 지표와 연결했다", weight: 3 },
    { id: "governance", text: "보안, 개인정보, 검증 절차를 지키며 AI를 쓴 경험이 있다", weight: 1 },
    { id: "sharing", text: "팀원에게 프롬프트, 템플릿, 자동화 흐름을 공유했다", weight: 1 },
  ] satisfies ChecklistItem[],
  toolStacks: [
    { jobName: "개발자", coreTools: ["Cursor", "GitHub Copilot", "ChatGPT"], useCases: ["코드 초안", "테스트 케이스", "리팩터링 리뷰"] },
    { jobName: "마케터", coreTools: ["ChatGPT", "Perplexity", "GA4"], useCases: ["소재 변형", "경쟁 리서치", "성과 리포트"] },
    { jobName: "디자이너", coreTools: ["Figma AI", "Midjourney", "Runway"], useCases: ["무드보드", "시안 탐색", "배너 변형"] },
    { jobName: "PM·기획자", coreTools: ["Claude", "Notion AI", "Perplexity"], useCases: ["PRD 초안", "회의록", "경쟁 분석"] },
    { jobName: "회계·재무", coreTools: ["Excel Copilot", "Power BI", "ChatGPT"], useCases: ["마감 리포트", "대사 체크", "설명 문서"] },
    { jobName: "번역·로컬라이징", coreTools: ["DeepL", "Phrase", "ChatGPT"], useCases: ["초벌 번역", "용어 통일", "검수 체크"] },
    { jobName: "고객상담·CS", coreTools: ["Zendesk AI", "상담봇", "VOC 분석"], useCases: ["FAQ 초안", "응대 요약", "품질관리"] },
  ] satisfies ToolStackRow[],
  futureOutlook: [
    { year: "2026", title: "사용 여부 자체가 차이", body: "AI를 업무에 실제로 붙여본 사람과 아닌 사람의 산출 속도 차이가 눈에 보이기 시작합니다." },
    { year: "2027", title: "기본 역량화", body: "문서 작성, 리서치, 요약은 기본 역량이 되고 성과 지표와 연결한 사례가 중요해집니다." },
    { year: "2028", title: "관리·검증·조합 능력 격차", body: "도구를 많이 아는 것보다 정확성, 보안, 워크플로 설계 능력이 연봉 프리미엄을 가릅니다." },
  ] satisfies OutlookItem[],
  faq: [
    {
      q: "AI를 쓰면 무조건 연봉이 오르나요?",
      a: "아닙니다. AI 사용 자체보다 시간 절감, 처리량 증가, 오류 감소, 매출 기여처럼 성과로 설명할 수 있을 때 협상 근거가 됩니다.",
    },
    {
      q: "이 페이지의 연봉 인덱스는 실제 평균 연봉인가요?",
      a: "아닙니다. 공식 평균 연봉이 아니라 직군별 AI 활용 효과를 비교하기 위한 상대 인덱스입니다.",
    },
    {
      q: "압박 직군은 전망이 나쁘다는 뜻인가요?",
      a: "반복 업무 비중이 높은 역할은 압박을 받을 수 있다는 의미입니다. 품질관리, 검수, 운영 개선 역할로 이동하면 방어력이 생깁니다.",
    },
    {
      q: "연봉 협상에서는 어떤 자료를 준비해야 하나요?",
      a: "AI를 써서 줄인 시간, 늘어난 처리량, 낮춘 오류율, 팀에 공유한 자동화 템플릿처럼 수치화 가능한 근거를 준비하는 것이 좋습니다.",
    },
    {
      q: "주니어에게도 AI 활용 능력이 중요한가요?",
      a: "중요합니다. 다만 결과물을 그대로 내는 능력이 아니라 검증하고, 보안 규칙을 지키고, 질문을 구조화하는 습관이 더 중요합니다.",
    },
  ] satisfies FaqItem[],
  relatedLinks: [
    { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기", description: "AI 도입으로 줄인 시간을 시급과 ROI로 환산합니다." },
    { href: "/tools/ai-stack-cost-calculator/", label: "AI 스택 비용 계산기", description: "ChatGPT, Claude, Cursor 등 구독 조합 비용을 비교합니다." },
    { href: "/tools/salary/", label: "연봉 인상 계산기", description: "인상률별 세전·실수령 변화를 비교합니다." },
    { href: "/tools/negotiation/", label: "이직 계산기", description: "현재 연봉과 제안 연봉 차이를 체감 금액으로 확인합니다." },
  ] satisfies RelatedLink[],
  sourceLinks: [
    { label: "World Economic Forum - Future of Jobs Report", href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },
    { label: "OECD AI Policy Observatory", href: "https://oecd.ai/" },
    { label: "Microsoft Work Trend Index", href: "https://www.microsoft.com/en-us/worklab/work-trend-index" },
    { label: "McKinsey - The state of AI", href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
  ] satisfies SourceLink[],
} as const;

