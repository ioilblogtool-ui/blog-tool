export type LtciGrade = "1" | "2" | "3" | "4" | "5" | "인지지원";

export type LtciBurdenType = "일반" | "감경40" | "감경60" | "기초";

export type LtciGradeRow = {
  grade: LtciGrade;
  label: string;
  homeCareLimit: number;
  facilityRate: number;
  eligible: boolean;
  desc: string;
};

export type LtciBurdenRow = {
  type: LtciBurdenType;
  label: string;
  homeCareRatio: number;
  facilityRatio: number;
};

export type LtciServiceItem = {
  name: string;
  desc: string;
  unit: string;
  ratePerUnit: number;
  badge: "재가" | "시설";
};

export type LtciFaqItem = {
  q: string;
  a: string;
};

export const LTCI_GRADES: LtciGradeRow[] = [
  {
    grade: "1",
    label: "1등급",
    homeCareLimit: 2306040,
    facilityRate: 93010,
    eligible: true,
    desc: "심신 기능 저하로 일상생활 전적 타인 도움 필요 (장기요양인정점수 95점 이상)",
  },
  {
    grade: "2",
    label: "2등급",
    homeCareLimit: 2073120,
    facilityRate: 86360,
    eligible: true,
    desc: "일상생활 대부분 타인 도움 필요 (75점 이상~95점 미만)",
  },
  {
    grade: "3",
    label: "3등급",
    homeCareLimit: 1586880,
    facilityRate: 79650,
    eligible: true,
    desc: "일상생활 일정 부분 타인 도움 필요 (60점 이상~75점 미만)",
  },
  {
    grade: "4",
    label: "4등급",
    homeCareLimit: 1510200,
    facilityRate: 79650,
    eligible: true,
    desc: "일상생활 일부 타인 도움 필요 (51점 이상~60점 미만)",
  },
  {
    grade: "5",
    label: "5등급",
    homeCareLimit: 1303500,
    facilityRate: 0,
    eligible: false,
    desc: "치매 환자 (45점 이상~51점 미만, 치매 진단 필수) — 시설급여 이용 불가",
  },
  {
    grade: "인지지원",
    label: "인지지원등급",
    homeCareLimit: 660700,
    facilityRate: 0,
    eligible: false,
    desc: "경증 치매 (45점 미만, 치매 진단 필수) — 주야간보호·치매전문교육 한정",
  },
];

export const LTCI_BURDEN_TYPES: LtciBurdenRow[] = [
  { type: "일반",   label: "일반",                    homeCareRatio: 0.15, facilityRatio: 0.20 },
  { type: "감경40", label: "감경 40% (의료급여 1종 등)", homeCareRatio: 0.09, facilityRatio: 0.12 },
  { type: "감경60", label: "감경 60% (차상위)",          homeCareRatio: 0.06, facilityRatio: 0.08 },
  { type: "기초",   label: "기초생활수급자",              homeCareRatio: 0,    facilityRatio: 0    },
];

export const LTCI_SERVICES: LtciServiceItem[] = [
  { name: "방문요양",     desc: "요양보호사가 가정 방문, 신체·가사 지원",           unit: "시간", ratePerUnit: 18470, badge: "재가" },
  { name: "방문목욕",     desc: "목욕 차량 또는 가정 방문 목욕 지원",               unit: "회",   ratePerUnit: 89640, badge: "재가" },
  { name: "방문간호",     desc: "간호사·물리치료사 등이 방문, 의료·재활 지원",       unit: "회",   ratePerUnit: 70540, badge: "재가" },
  { name: "주야간보호",   desc: "낮/밤 동안 시설에서 케어 후 귀가",                 unit: "일",   ratePerUnit: 64830, badge: "재가" },
  { name: "단기보호",     desc: "일시적 시설 입소 (최대 연 9회, 1회 9일)",           unit: "일",   ratePerUnit: 79650, badge: "재가" },
  { name: "노인요양시설", desc: "24시간 시설 입소 케어 (요양원)",                   unit: "일",   ratePerUnit: 93010, badge: "시설" },
  { name: "공동생활가정", desc: "소규모 가정형 시설 (5~9인)",                       unit: "일",   ratePerUnit: 79650, badge: "시설" },
];

export const LTCI_FAQ: LtciFaqItem[] = [
  {
    q: "장기요양등급은 어떻게 신청하나요?",
    a: "국민건강보험공단 지사 방문, 전화(1577-1000), 또는 온라인(노인장기요양보험 홈페이지)으로 신청할 수 있습니다. 신청 후 공단 직원이 가정을 방문해 심신 기능 상태를 조사합니다.",
  },
  {
    q: "등급 판정까지 얼마나 걸리나요?",
    a: "신청일로부터 30일 이내에 결과가 통보됩니다. 의사 소견서 제출이 필요하며, 소견서 발급에 시간이 걸리면 다소 늦어질 수 있습니다.",
  },
  {
    q: "3등급과 4등급의 혜택 차이는 얼마나 되나요?",
    a: "재가급여 한도가 3등급은 월 약 158만원, 4등급은 약 151만원으로 약 7만원 차이가 납니다. 두 등급 모두 시설급여(요양원)를 이용할 수 있습니다.",
  },
  {
    q: "기초생활수급자는 본인부담이 전혀 없나요?",
    a: "재가급여와 시설급여 모두 본인부담금이 면제됩니다. 단, 시설 입소 시 식비·간식비 등 비급여 항목은 별도로 부담할 수 있습니다.",
  },
  {
    q: "재가급여와 시설급여를 동시에 받을 수 있나요?",
    a: "원칙적으로 동시 이용이 불가합니다. 시설급여를 이용하면 재가급여는 중지됩니다. 단, 단기보호는 예외적으로 병행 가능한 경우가 있습니다.",
  },
  {
    q: "가족이 직접 요양보호사가 되어 급여를 받을 수 있나요?",
    a: "가족요양보호사 제도를 통해 가능합니다. 요양보호사 자격증을 취득한 배우자 또는 직계혈족이 직접 돌보면 하루 60분 기준으로 급여를 받을 수 있습니다.",
  },
  {
    q: "인지지원등급은 어떤 경우에 받나요?",
    a: "장기요양인정점수 45점 미만이지만 치매 진단을 받은 경우입니다. 요양원 입소는 불가하고, 주야간보호와 치매 특화 서비스만 이용할 수 있습니다.",
  },
  {
    q: "장기요양 등급과 장애등급은 별개인가요?",
    a: "완전히 별개의 제도입니다. 장기요양등급은 국민건강보험공단이 고령·노인성 질환자를 대상으로 판정하며, 장애등급은 보건복지부가 장애인을 대상으로 합니다. 두 제도의 혜택을 동시에 받을 수 있습니다.",
  },
];

export type LtciBurdenDetailRow = {
  type: LtciBurdenType;
  label: string;
  target: string;
  incomeStandard: string;
  homeCareRatio: number;
  facilityRatio: number;
  reduction: string;
};

export type LtciTip = {
  icon: string;
  title: string;
  body: string;
};

export type LtciRenewalRow = {
  situation: string;
  period: string;
  note: string;
};

export const LTCI_BURDEN_DETAIL: LtciBurdenDetailRow[] = [
  {
    type: "일반",
    label: "일반",
    target: "건강보험 가입자",
    incomeStandard: "기준 없음",
    homeCareRatio: 0.15,
    facilityRatio: 0.20,
    reduction: "—",
  },
  {
    type: "감경40",
    label: "감경 40%",
    target: "의료급여 1종·2종 수급자, 건강보험료 하위 25% 이하",
    incomeStandard: "건강보험료 기준 하위 25%",
    homeCareRatio: 0.09,
    facilityRatio: 0.12,
    reduction: "재가 9% / 시설 12%",
  },
  {
    type: "감경60",
    label: "감경 60%",
    target: "차상위계층 (기준 중위소득 50% 이하)",
    incomeStandard: "기준 중위소득 50% 이하",
    homeCareRatio: 0.06,
    facilityRatio: 0.08,
    reduction: "재가 6% / 시설 8%",
  },
  {
    type: "기초",
    label: "면제",
    target: "기초생활수급자 (생계·의료급여 수급)",
    incomeStandard: "기준 중위소득 30~40% 이하",
    homeCareRatio: 0,
    facilityRatio: 0,
    reduction: "본인부담 전액 면제",
  },
];

export const LTCI_TIPS: LtciTip[] = [
  {
    icon: "📋",
    title: "의사 소견서는 미리 준비",
    body: "장기요양 신청 시 의사 소견서가 필요합니다. 소견서는 가정의학과·신경과·정신건강의학과 등에서 발급받을 수 있으며, 발급까지 며칠 걸릴 수 있으니 신청 전에 미리 챙기세요.",
  },
  {
    icon: "🔄",
    title: "등급 재심사는 언제든 신청 가능",
    body: "등급 판정 결과에 이의가 있거나 상태가 악화된 경우 90일 이내 이의신청 또는 새로운 변경신청이 가능합니다. 주치의 소견서와 함께 상태 변화를 입증하는 자료를 준비하세요.",
  },
  {
    icon: "💰",
    title: "감경 대상인지 먼저 확인",
    body: "건강보험료 납부 기준 하위 25% 이하면 본인부담 감경 40% 혜택을 받을 수 있습니다. 공단 상담(1577-1000)으로 내 소득 수준 해당 여부를 먼저 확인하세요. 감경만 받아도 월 수십만원이 절감됩니다.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "요양보호사 자격증 취득을 고려",
    body: "가족 중 한 명이 요양보호사 자격증(교육 약 240시간)을 취득하면 가족요양보호사로 등록해 직접 돌보며 급여를 받을 수 있습니다. 월 본인부담이 크게 줄어드는 현실적인 방법입니다.",
  },
];

export const LTCI_RENEWAL: LtciRenewalRow[] = [
  { situation: "최초 판정", period: "1~2년 (등급에 따라 상이)", note: "판정 통보서에 유효기간 명시" },
  { situation: "갱신 신청", period: "유효기간 만료 90일 전부터 가능", note: "기간 내 신청 안 하면 급여 중단" },
  { situation: "상태 악화로 등급 변경 신청", period: "언제든 가능", note: "변경신청 후 재조사·재판정 진행" },
  { situation: "이의신청", period: "결과 통보 후 90일 이내", note: "이의신청심사위원회 심의" },
];

export const LTCI_SEO_INTRO = [
  "장기요양보험은 65세 이상 노인 또는 65세 미만이라도 치매·뇌혈관질환 등 노인성 질병으로 6개월 이상 일상생활이 어려운 경우 국가가 케어 비용을 지원하는 제도입니다. 2008년 시행 이후 2026년 현재 수급자 수는 100만 명을 넘어섰습니다.",
  "등급은 1~5등급과 인지지원등급으로 구분되며, 등급이 낮을수록 더 많은 급여 한도와 서비스를 이용할 수 있습니다. 본인부담금은 재가급여 15%, 시설급여 20%가 기본이며, 소득 수준에 따라 감경 혜택을 받을 수 있습니다.",
];

export const LTCI_SEO_CRITERIA = [
  "2026년 장기요양 재가급여 월 한도: 1등급 230만원 / 2등급 207만원 / 3등급 158만원 / 4등급 151만원 / 5등급 130만원",
  "본인부담률: 재가급여 일반 15%, 시설급여 일반 20% (기초수급자 면제)",
  "시설급여(요양원)는 1~4등급만 이용 가능, 5등급·인지지원등급은 재가급여만 이용",
  "가족요양보호사 자격 취득 시 가족이 직접 돌보며 급여 수령 가능",
  "모든 수가·한도는 건강보험공단 고시 기준이며 매년 개정될 수 있습니다",
];
