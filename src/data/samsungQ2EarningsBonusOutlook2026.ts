import {
  divisions as samsungDivisions,
  scenarioPresets,
  operatingProfitScenarios,
  unionDemandScenarios,
} from "./samsungCompensation";

export { samsungDivisions, scenarioPresets, operatingProfitScenarios, unionDemandScenarios };

// ── 타입 ──────────────────────────────────────────

export type EarningsCalendarStatus = "완료" | "예정" | "미정";

export type EarningsCalendarItem = {
  date: string;
  dateLabel: string;
  event: string;
  scope: string;
  status: EarningsCalendarStatus;
};

export type ProgressCard = {
  label: string;
  value: string;
  note: string;
  isPlaceholder: boolean;
};

export type SegmentRow = {
  segment: string;
  revenue: string;
  operatingProfit: string;
  note: string;
};

export type TaiRateRow = {
  unit: string;
  rate: string;
  note: string;
};

export type OpiStructureRow = {
  item: string;
  basis: string;
  capLabel: string;
  sourceNote: string;
};

export type ScenarioOutlookRow = {
  scenarioCode: "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
  scenarioLabel: string;
  assumption: string;
  dsOpiRange: string;
};

export type CheckpointItem = {
  order: number;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const SQE_META = {
  slug: "samsung-q2-earnings-bonus-outlook-2026",
  title: "삼성전자 2분기 확정실적 영업이익 89.5조 — 컨콜·TAI·하반기 성과급 전망",
  seoTitle: "삼성전자 2분기 확정실적 2026 | DS 89조·컨콜 하반기 성과급은",
  seoDescription:
    "삼성전자 2026년 2분기 확정실적(매출 171.5조·영업이익 89.5조, DS 89.2조)과 컨퍼런스콜 내용을 반영해 이미 확정된 상반기 TAI 지급률, 하반기 OPI 전망까지 정리했습니다.",
  description:
    "7월 30일 발표된 2분기 확정실적과 컨퍼런스콜 내용, 이미 확정된 상반기 TAI 지급률부터 하반기 OPI 전망까지 한눈에 정리합니다.",
  updatedAt: "2026-07-30",
  dataNote:
    "2분기 확정실적(매출 171조 5,000억원·영업이익 89조 5,000억원, DS부문 영업이익 89조 2,000억원)은 2026년 7월 30일 삼성전자 공식 발표·컨퍼런스콜 기준입니다. 상반기 TAI(목표달성장려금) 지급률도 7월 6일 공지·7월 8일 지급된 실제 확정 수치입니다. 다만 하반기 OPI(초과이익분배금)·특별성과급 전망은 여전히 컨센서스·시나리오 기준 추정이며, 연간 실적 확정과 노사 협의를 거쳐야 최종 확정됩니다. 실적 자료와 성과급 비율은 서로 다른 출처이므로 곱해서 새 숫자를 만들지 않습니다.",
};

export const SQE_EARNINGS_CALENDAR: EarningsCalendarItem[] = [
  {
    date: "2026-07-07",
    dateLabel: "2026년 7월 7일",
    event: "2분기 잠정실적 발표 (완료)",
    scope: "매출 171조원·영업이익 89.4조원 — 역대 최대 (사업부문별 실적 미공개)",
    status: "완료",
  },
  {
    date: "2026-07-30",
    dateLabel: "2026년 7월 30일",
    event: "2분기 확정실적 발표·컨퍼런스콜 (완료)",
    scope: "매출 171.5조원·영업이익 89.5조원, DS부문 영업이익 89.2조원 등 사업부문별 실적 공개",
    status: "완료",
  },
  {
    date: "2026-10-07",
    dateLabel: "2026년 10월(참고, 미확정)",
    event: "3분기 잠정실적 발표 예상",
    scope: "직전 분기 발표 간격 기준 추정 (연결 기준, 공식 확정 일정 아님)",
    status: "미정",
  },
];

// 2026-07-30 삼성전자 공식 확정실적 발표 기준
export const SQE_PROGRESS_CARDS: ProgressCard[] = [
  {
    label: "2026 연간 컨센서스 영업이익",
    value: "약 370~372조원",
    note: "5월 297.5조원(에프앤가이드)에서 상향 — 미래에셋증권 등 7월 시점 증권가 전망 종합",
    isPlaceholder: false,
  },
  {
    label: "1분기 확정실적",
    value: "매출 133.9조 · 영업이익 57.2조원",
    note: "DS부문 영업이익 53.7조원 (2026년 1분기 확정 공시 기준)",
    isPlaceholder: false,
  },
  {
    label: "2분기 확정실적",
    value: "매출 171.5조 · 영업이익 89.5조원",
    note: "DS부문 매출 127.5조·영업이익 89.2조원 — 분기 기준 역대 최대 (2026-07-30 확정)",
    isPlaceholder: false,
  },
  {
    label: "상반기 누적 진행률",
    value: "영업이익 146.7조원 (신규 컨센서스의 약 39~40%)",
    note: "1분기(57.2조)+2분기(89.5조) 확정 합산 — 상반기 만에 연간 컨센서스 4할 육박",
    isPlaceholder: false,
  },
];

export const SQE_Q2_SEGMENTS: SegmentRow[] = [
  {
    segment: "DS (반도체)",
    revenue: "127.5조원",
    operatingProfit: "89.2조원",
    note: "메모리사업부 매출 120.8조원 — D램 ASP 전분기 대비 약 58~63%·낸드 ASP 약 55~60% 상승, D램·낸드 판매량 모두 역대 최대(증권가 추정)",
  },
  {
    segment: "DX (완제품)",
    revenue: "48조원",
    operatingProfit: "-0.8조원 (영업손실)",
    note: "MX -0.7조원, VD -100억원 — 프리미엄·AI 제품 매출은 늘었으나 부품 원가 상승 영향",
  },
  {
    segment: "삼성디스플레이(SDC)",
    revenue: "7.5조원",
    operatingProfit: "0.7조원",
    note: "-",
  },
  {
    segment: "하만",
    revenue: "4.6조원",
    operatingProfit: "0.4조원",
    note: "-",
  },
];

export const SQE_Q2_HIGHLIGHTS = {
  eps: "10,849원 (전분기 대비 +52%)",
  rnd: "16조원 — 역대 최대 R&D 투자 (전분기 대비 +41%, 전년 동기 대비 +78%)",
  dsShare: "DS부문 영업이익이 전사 영업이익의 약 99.7%를 차지 (89.2조원 / 89.5조원)",
  dividend: "2분기 배당 주당 361원 — 배당기준일 6월 30일, 지급예정일 8월 20일 (2024~2026년 주주환원정책에 따른 분기 정규배당)",
};

export const SQE_MEMORY_PRICE_TREND = [
  "2분기 D램 고정거래가격(ASP)은 전분기 대비 약 58~63%, 서버용 낸드는 약 55~60% 상승한 것으로 증권가는 추정합니다. AI 데이터센터향 서버 D램·eSSD 수요 확대가 주된 배경입니다.",
  "3분기에도 범용 D램 고정거래가격이 15~20% 추가 상승할 것이라는 업계 전망이 나옵니다(공식 발표 아닌 업계 추정치).",
  "HBM은 지난 2월 6세대 HBM4를 업계 최초로 양산했고, 2분기 중 7세대 HBM4E 첫 샘플을 고객사에 공급했습니다(2026년 1분기 컨퍼런스콜 기준 발언). 올해 HBM 매출은 전년 대비 3배 이상 늘어날 것으로 전망됩니다.",
  "메모리사업은 하반기에 HBM4·HBM4E, DDR5, SOCAMM2, 기업용 eSSD 판매를 확대해 AI 인프라 수요에 대응하고 시장 주도권을 강화하겠다는 방침입니다.",
];

// 2026-07-06 공지, 2026-07-08 지급 — 이미 확정된 실제 수치 (전망 아님)
export const SQE_TAI_CONFIRMED: TaiRateRow[] = [
  { unit: "메모리사업부", rate: "100% (최대)", note: "HBM 수요 증가·범용 D램 가격 상승으로 업황 개선" },
  { unit: "시스템LSI·파운드리", rate: "75%", note: "직전 반기 대비 상향" },
  { unit: "MX(모바일)·네트워크", rate: "각 50%", note: "-" },
  { unit: "VD(영상디스플레이)", rate: "50%", note: "-" },
  { unit: "DA(생활가전)", rate: "25%", note: "-" },
];

export const SQE_H2_OUTLOOK = [
  "실적 발표 후 컨퍼런스콜에서 삼성전자는 2분기를 저점으로 하반기에 반등하는 '상저하고' 흐름을 예상한다고 밝혔습니다. 증권가는 3분기 영업이익 약 110조원, 4분기 약 120조원 수준을 추산하고 있습니다(증권가 추정치이며 공식 가이던스 아님).",
  "메모리 사업은 HBM4E·DDR5 등 고부가 제품 공급을 하반기에 더 확대할 계획이라고 설명했습니다.",
  "파운드리는 2나노 2세대 공정 양산을 개시하고, 엑시노스 2600을 통해 공정 성숙도를 높여 향후 수주 경쟁력을 확보하겠다는 방침을 제시했습니다. 브로드컴과는 2030년까지 약 300조원 규모로 2나노 위탁생산 협력을 이어가기로 했습니다. 다만 파운드리·시스템LSI 등 비메모리 사업은 2분기에도 2조원 안팎의 적자를 낸 것으로 추정됩니다(보도 기준 추정, 공식 세부 수치 미공개).",
  "DX부문은 프리미엄·폴더블 중심 판매 전략으로 원가 상승분을 방어하겠다는 입장입니다.",
];

export const SQE_OPI_STRUCTURE: OpiStructureRow[] = [
  {
    item: "OPI (초과이익분배금)",
    basis: "사업부문별 연간 영업이익이 목표를 초과할 때 기준급 대비 지급",
    capLabel: "최대 50% 한도 (DS 2026 실제 참고 47%)",
    sourceNote: "samsungCompensation.ts > divisions 재사용",
  },
  {
    item: "TAI (목표달성장려금)",
    basis: "반기별 매출·영업이익 목표 초과 달성 시 지급",
    capLabel: "최대 100% (상하반기 별도 산정)",
    sourceNote: "samsungCompensation.ts > scenarioPresets 재사용",
  },
  {
    item: "DS 특별성과급",
    basis: "2026년 5월 노사 잠정합의에 따라 DS부문 사업성과의 10.5%를 재원으로 별도 산정",
    capLabel: "DS 최소 지급조건: 2026~2028년 영업이익 200조원 이상 (2029~2035년 100조원)",
    sourceNote: "언론 보도 기준 — 상반기 DS 누적 영업이익(142.9조원)만으로 조건 충족에 근접",
  },
];

// scenarioRates.DS 값을 그대로 라벨링해서 보여준다 (새 숫자 생성 금지)
export const SQE_SCENARIO_OUTLOOK: ScenarioOutlookRow[] = [
  { scenarioCode: "CONSERVATIVE", scenarioLabel: "보수적", assumption: "반도체 업황 정체", dsOpiRange: "30% 내외" },
  { scenarioCode: "BASE", scenarioLabel: "기준", assumption: "컨센서스 수준 실적", dsOpiRange: "40~47%" },
  { scenarioCode: "AGGRESSIVE", scenarioLabel: "공격적", assumption: "HBM·파운드리 동반 개선", dsOpiRange: "50% 근접" },
];

export const SQE_CHECKPOINTS: CheckpointItem[] = [
  { order: 1, text: "(완료) 7/30 확정실적 DS부문 영업이익 89.2조원 공개 — 상반기 DS 누적 142.9조원으로 특별성과급 최소조건(200조원)에 근접" },
  { order: 2, text: "(완료) 상반기 TAI 지급률 확정 — 메모리 100%, 파운드리·시스템LSI 75%" },
  { order: 3, text: "컨콜에서 언급된 하반기 '상저하고' 반등이 3·4분기 실적으로 실제 확인되는지 여부" },
  { order: 4, text: "파운드리·시스템LSI 적자 축소 속도 (2나노 2세대 양산 성과)" },
  { order: 5, text: "노사협의체의 OPI·DS 특별성과급 최종 지급률·지급방식 협의 일정" },
];

export const SQE_PRECEDENT_NOTE =
  "2026년 5월 잠정합의안(OPI 1.5% + DS 특별경영성과급 10.5% = 최대 12%)은 2025년 실적을 기준으로 도출된 전례입니다. 하반기도 '실적 확정 → 노사 협의 → 지급률 확정' 흐름을 따를 가능성이 높으며, 상반기 DS 누적 영업이익(142.9조원)이 이미 특별성과급 최소 지급조건(200조원)에 근접해 있다는 점은 긍정적 신호로 해석됩니다. 다만 최종 지급률·지급방식은 연간 실적 확정과 노사 협의 결과에 따라 달라질 수 있습니다.";

export const SQE_FAQ: FaqItem[] = [
  { question: "2분기 확정실적은 얼마였나요?", answer: "2026년 7월 30일 발표 기준 매출 171조 5,000억원, 영업이익 89조 5,000억원입니다. DS(반도체)부문 영업이익은 89조 2,000억원으로 사실상 전사 이익 대부분을 차지했습니다." },
  { question: "DX(완제품)부문 실적은 어땠나요?", answer: "매출 48조원에 영업손실 8,000억원을 기록했습니다. MX(스마트폰)가 7,000억원, VD가 100억원 손실이었습니다. 프리미엄·AI 제품 판매는 늘었지만 부품 원가 상승이 영향을 줬습니다." },
  { question: "상반기 TAI(목표달성장려금)는 이미 확정됐나요?", answer: "네, 7월 6일 공지되고 7월 8일 지급됐습니다. 메모리사업부는 최대치인 100%, 시스템LSI·파운드리는 75%, MX·네트워크·VD는 50%, DA(생활가전)는 25%였습니다." },
  { question: "실적이 좋으면 하반기 성과급도 바로 오르나요?", answer: "TAI처럼 반기 단위로 빠르게 반영되는 항목도 있지만, OPI와 DS 특별성과급은 연간 실적이 확정된 뒤 노사 협의를 거쳐 익년 초에 확정됩니다. 상반기 실적이 좋다고 해서 최종 지급률이 자동으로 결정되는 것은 아닙니다." },
  { question: "DS 특별성과급 조건은 충족됐나요?", answer: "언론 보도 기준 DS부문 최소 지급조건은 2026~2028년 영업이익 200조원 이상입니다. 상반기 DS 누적 영업이익만 142조 9,000억원으로 이미 상당 부분 근접했지만, 최종 조건 충족 여부는 연간 실적이 나와야 확정됩니다." },
  { question: "컨퍼런스콜에서 하반기 전망은 어떻게 나왔나요?", answer: "2분기를 저점으로 하반기 반등('상저하고')을 예상한다고 밝혔고, HBM4E·DDR5 공급 확대, 파운드리 2나노 2세대 양산 개시 등을 언급했습니다. 증권가는 3분기 약 110조원, 4분기 약 120조원의 영업이익을 추산하고 있으나 이는 공식 가이던스가 아닙니다." },
  { question: "D램·낸드 가격은 얼마나 올랐나요?", answer: "증권가 추정으로 2분기 D램 ASP는 전분기 대비 약 58~63%, 서버용 낸드는 약 55~60% 상승했습니다. 3분기에도 범용 D램 가격이 15~20% 추가 상승할 것이라는 업계 전망이 나옵니다." },
  { question: "파운드리·시스템LSI 적자 규모는 얼마인가요?", answer: "삼성전자가 세부 수치를 공개하지 않아 정확한 액수는 알 수 없지만, 보도 기준으로 2분기에도 2조원 안팎의 적자를 낸 것으로 추정됩니다. 2나노 2세대 양산과 브로드컴 등 신규 수주로 적자 축소를 추진하고 있습니다." },
  { question: "2분기 배당은 얼마인가요?", answer: "주당 361원이며, 배당기준일은 6월 30일, 지급예정일은 8월 20일입니다. 2024~2026년 주주환원정책에 따른 분기 정규배당입니다." },
  { question: "하반기 확정 성과급은 언제 알 수 있나요?", answer: "통상 다음 해 1월경 공식 지급률이 공지됩니다." },
];

export const SQE_SEO_INTRO = [
  "삼성전자가 2026년 7월 30일 2분기 확정실적과 컨퍼런스콜을 진행했습니다. 매출 171조 5,000억원, 영업이익 89조 5,000억원으로 분기 기준 역대 최대를 다시 경신했고, DS(반도체)부문 영업이익이 89조 2,000억원으로 사실상 실적 전체를 견인했습니다. DX(완제품)부문은 매출 48조원에도 부품 원가 상승 영향으로 8,000억원 영업손실을 기록했습니다.",
  "성과급과 관련해 이미 확정된 숫자도 있습니다. 상반기 TAI(목표달성장려금)는 7월 6일 공지, 7월 8일 지급됐고 메모리사업부가 최대치인 100%를 받았습니다. 반면 OPI(초과이익분배금)와 DS 특별성과급은 연간 실적 확정과 노사 협의를 거쳐야 하는 항목이라, 지금 시점에서는 방향성만 가늠할 수 있습니다.",
  "2026년 삼성전자 연간 영업이익 컨센서스는 5월 297조 5,000억원에서 7월 들어 370조원 안팎으로 상향됐습니다. 상반기 누적 영업이익만 이미 146조 7,000억원으로 신규 컨센서스의 약 39~40%에 도달한 상태입니다. DS부문 상반기 누적 영업이익(142조 9,000억원)은 언론 보도 기준 특별성과급 최소 지급조건(2026~2028년 200조원)에도 근접해 있습니다.",
  "컨퍼런스콜에서 삼성전자는 2분기를 저점으로 하반기에 반등하는 '상저하고' 흐름을 예상한다고 밝혔습니다. HBM4E·DDR5 등 고부가 메모리 공급 확대, 파운드리 2나노 2세대 공정 양산 개시가 핵심 변수로 제시됐습니다. 다만 파운드리·시스템LSI는 2분기에도 적자를 이어갔습니다.",
  "가격 측면에서는 2분기 D램 ASP가 전분기 대비 약 58~63%, 서버용 낸드가 약 55~60% 상승한 것으로 증권가는 추정합니다. 3분기에도 범용 D램 가격이 15~20% 추가 상승할 것이라는 업계 전망이 나오는 등, 메모리 초호황이 하반기까지 이어질 가능성이 거론됩니다. HBM은 2월 6세대 HBM4를 세계 최초로 양산했고 2분기 중 HBM4E 첫 샘플을 고객사에 공급했는데, 올해 HBM 매출은 전년 대비 3배 이상 성장할 것으로 전망됩니다.",
  "파운드리는 2나노 2세대 공정 양산을 시작했고 브로드컴과 2030년까지 약 300조원 규모의 2나노 위탁생산 협력을 이어가기로 했습니다. 다만 파운드리·시스템LSI 등 비메모리 사업은 2분기에도 2조원 안팎의 적자를 낸 것으로 추정되는 만큼(보도 기준 추정), 실제 흑자 전환 시점은 여전히 지켜봐야 할 변수입니다.",
  "OPI는 사업부문 영업이익이 목표치를 초과할 때 기준급 대비 최대 50% 한도로 지급되고, DS 특별성과급은 2026년 5월 노사 잠정합의에 따라 사업성과의 10.5%를 재원으로 별도 산정됩니다. 두 제도 모두 사업부문 연간 실적이 확정돼야 정확한 지급률을 계산할 수 있어, 하반기 전망은 여전히 보수적·기준·공격적 세 시나리오로 나눠 방향성만 제시합니다.",
];

export const SQE_SEO_CRITERIA = [
  "2분기 확정실적(7월 30일 발표): 매출 171.5조원·영업이익 89.5조원, DS부문 영업이익 89.2조원",
  "DX(완제품)부문은 매출 48조원에 영업손실 8,000억원 (MX -7,000억원, VD -100억원)",
  "상반기 TAI 지급률(이미 확정): 메모리 100%, 파운드리·시스템LSI 75%, MX·네트워크·VD 50%, DA 25%",
  "2분기 D램 ASP 약 58~63%·낸드 ASP 약 55~60% 상승(증권가 추정), 3분기도 D램 15~20% 추가 상승 전망",
  "파운드리·시스템LSI 등 비메모리 사업은 2분기에도 2조원 안팎 적자 추정 — 2나노 2세대 양산·브로드컴 수주로 개선 추진",
  "2026년 연간 컨센서스는 297.5조원(5월)에서 370조원 안팎(7월)으로 상향 — 상반기 누적 146.7조원으로 진행률 약 39~40%",
  "OPI·DS 특별성과급 등 하반기 전망은 컨센서스·시나리오 기준 추정이며 공식 확정 발표가 아님",
];

export const SQE_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 DS 성과급 계산기", description: "내 직급·사업부 기준 예상 성과급을 바로 계산합니다." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에서 세금을 제외한 실수령액을 확인합니다." },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026", description: "2026~2028년 연간 실적·성과급 시나리오를 두 회사로 비교합니다." },
  { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성전자 DS 성과급 완전 가이드", description: "OPI·TAI 산정 구조를 처음부터 자세히 설명합니다." },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교", description: "반도체 메가 투자가 장기 실적·성과급에 미칠 영향을 다룹니다." },
];
