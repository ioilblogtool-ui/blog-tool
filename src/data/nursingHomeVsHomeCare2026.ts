export type NhGrade = "1" | "2" | "3" | "4" | "5";

export type NhCostRow = {
  grade: NhGrade;
  label: string;
  facilityMonthlyBase: number;
  facilityBurdenGeneral: number;
  facilityBurdenReduced: number;
  facilityExtra: number;
  facilityTotalGeneral: number;
  homeCareLimit: number;
  homeCareBurdenGeneral: number;
  homeCareBurdenReduced: number;
  diff: number;
};

export type NhExtraItem = {
  label: string;
  monthly: string;
  note: string;
};

export type NhServiceCombo = {
  name: string;
  content: string;
  monthlyEstimate: number;
  badge: string;
};

export type NhCheckItem = {
  question: string;
  facilityResult: string;
  homeResult: string;
};

export type NhTimeline = {
  step: number;
  title: string;
  desc: string;
  duration: string;
};

export type NhFaqItem = {
  q: string;
  a: string;
};

export const NH_COST_TABLE: NhCostRow[] = [
  {
    grade: "1",
    label: "1등급",
    facilityMonthlyBase: 2790300,
    facilityBurdenGeneral: 558060,
    facilityBurdenReduced: 334836,
    facilityExtra: 220000,
    facilityTotalGeneral: 778060,
    homeCareLimit: 2306040,
    homeCareBurdenGeneral: 345906,
    homeCareBurdenReduced: 207544,
    diff: 432154,
  },
  {
    grade: "2",
    label: "2등급",
    facilityMonthlyBase: 2589300,
    facilityBurdenGeneral: 517860,
    facilityBurdenReduced: 310716,
    facilityExtra: 220000,
    facilityTotalGeneral: 737860,
    homeCareLimit: 2073120,
    homeCareBurdenGeneral: 310968,
    homeCareBurdenReduced: 186581,
    diff: 426892,
  },
  {
    grade: "3",
    label: "3등급",
    facilityMonthlyBase: 2389500,
    facilityBurdenGeneral: 477900,
    facilityBurdenReduced: 286740,
    facilityExtra: 220000,
    facilityTotalGeneral: 697900,
    homeCareLimit: 1586880,
    homeCareBurdenGeneral: 238032,
    homeCareBurdenReduced: 142819,
    diff: 459868,
  },
  {
    grade: "4",
    label: "4등급",
    facilityMonthlyBase: 2389500,
    facilityBurdenGeneral: 477900,
    facilityBurdenReduced: 286740,
    facilityExtra: 220000,
    facilityTotalGeneral: 697900,
    homeCareLimit: 1510200,
    homeCareBurdenGeneral: 226530,
    homeCareBurdenReduced: 135918,
    diff: 471370,
  },
  {
    grade: "5",
    label: "5등급 (치매)",
    facilityMonthlyBase: 0,
    facilityBurdenGeneral: 0,
    facilityBurdenReduced: 0,
    facilityExtra: 0,
    facilityTotalGeneral: 0,
    homeCareLimit: 1303500,
    homeCareBurdenGeneral: 195525,
    homeCareBurdenReduced: 117315,
    diff: 0,
  },
];

export const NH_EXTRA_ITEMS: NhExtraItem[] = [
  { label: "식비", monthly: "약 180,000원", note: "1일 3식 기준, 시설마다 상이" },
  { label: "이미용·간식·행사비", monthly: "약 30,000~50,000원", note: "의무 항목 아님, 선택 가능" },
  { label: "기저귀 (해당자)", monthly: "약 50,000~80,000원", note: "실사용량에 따라 상이" },
  { label: "상급 침실 (1인실)", monthly: "+50,000~200,000원", note: "선택 사항, 2인실 기본 포함" },
];

export const NH_SERVICE_COMBOS: NhServiceCombo[] = [
  {
    name: "방문요양 집중형",
    content: "방문요양 하루 3시간 × 20일",
    monthlyEstimate: 1108200,
    badge: "재가",
  },
  {
    name: "주야간보호 중심형",
    content: "주야간보호 주 5일",
    monthlyEstimate: 1297800,
    badge: "재가",
  },
  {
    name: "혼합형",
    content: "방문요양 2시간×12일 + 주야간보호 주 3일",
    monthlyEstimate: 1530000,
    badge: "재가",
  },
  {
    name: "가족요양 중심형",
    content: "가족요양보호사 하루 60분×20일 + 방문목욕 2회",
    monthlyEstimate: 560000,
    badge: "절약형",
  },
];

export const NH_CHECKLIST: NhCheckItem[] = [
  {
    question: "24시간 상시 케어가 필요한가?",
    facilityResult: "요양원 적합",
    homeResult: "재가요양 검토 가능",
  },
  {
    question: "야간 배회·낙상 위험이 높은 치매인가?",
    facilityResult: "요양원 적합",
    homeResult: "주야간보호 + 방문요양 병행",
  },
  {
    question: "가족이 함께 돌볼 수 있는 환경인가?",
    facilityResult: "해당 없음",
    homeResult: "재가 + 가족요양 절약 가능",
  },
  {
    question: "본인이 집에서 지내기를 강하게 원하는가?",
    facilityResult: "적응 어려울 수 있음",
    homeResult: "재가요양 우선 검토",
  },
  {
    question: "비용을 최대한 절약해야 하는가?",
    facilityResult: "시설 본인부담 + 추가비용 발생",
    homeResult: "한도 내 조합 설계로 절감 가능",
  },
];

export const NH_TIMELINE: NhTimeline[] = [
  {
    step: 1,
    title: "장기요양 신청",
    desc: "국민건강보험공단 방문·전화(1577-1000)·온라인 신청. 의사 소견서 지참.",
    duration: "D-day",
  },
  {
    step: 2,
    title: "방문 조사",
    desc: "공단 직원이 가정 방문, 심신 기능 상태(52개 항목) 조사.",
    duration: "신청 후 약 2주",
  },
  {
    step: 3,
    title: "등급 판정",
    desc: "등급판정위원회 심의. 결과 우편 통보.",
    duration: "신청 후 30일 이내",
  },
  {
    step: 4,
    title: "급여 유형 선택",
    desc: "재가급여 또는 시설급여 선택. 장기요양기관 계약.",
    duration: "결과 수령 후 즉시",
  },
  {
    step: 5,
    title: "서비스 개시",
    desc: "재가: 요양보호사 매칭 후 방문 시작. 시설: 입소 대기 후 입소.",
    duration: "계약 후 1~4주",
  },
];

export const NH_FAQ: NhFaqItem[] = [
  {
    q: "요양원 입소 대기는 얼마나 걸리나요?",
    a: "인기 지역 요양원은 3개월~1년 이상 대기가 필요하기도 합니다. 여러 곳에 동시에 대기 신청을 해두는 것이 좋습니다. 대기 중에는 재가급여를 먼저 이용할 수 있습니다.",
  },
  {
    q: "요양원 비용에 식비가 포함되나요?",
    a: "시설급여(수가) 본인부담금에는 식비가 포함되지 않습니다. 식비는 별도로 월 약 18만원이 추가됩니다. 기초생활수급자는 식비도 지원받을 수 있습니다.",
  },
  {
    q: "방문요양 하루 몇 시간까지 가능한가요?",
    a: "등급에 따라 다르지만 하루 최대 4시간까지 이용 가능합니다. 월 급여 한도 내에서 시간을 자유롭게 배분할 수 있습니다.",
  },
  {
    q: "가족이 요양보호사 자격을 취득하면 급여를 받을 수 있나요?",
    a: "가능합니다. 요양보호사 자격증을 취득한 배우자 또는 직계혈족이 직접 돌보면 하루 60분 기준으로 급여를 받을 수 있습니다. 교육 시간은 약 240시간이며, 자격증 취득 후 바로 신청 가능합니다.",
  },
  {
    q: "주야간보호와 방문요양을 같이 이용할 수 있나요?",
    a: "네, 재가급여 한도 내에서 자유롭게 조합할 수 있습니다. 주야간보호 + 방문요양 혼합형이 현실적으로 가장 많이 이용되는 조합입니다.",
  },
  {
    q: "치매 환자는 요양원이 낫나요, 재가가 낫나요?",
    a: "야간 배회, 심한 인지 저하, 가족 돌봄 여력이 없는 경우 요양원이 안전합니다. 경증 치매(5등급·인지지원등급)는 주야간보호를 활용한 재가요양도 효과적입니다.",
  },
  {
    q: "기초생활수급자 부모님은 본인부담이 없나요?",
    a: "재가급여와 시설급여 모두 본인부담금이 면제됩니다. 시설 입소 시 식비는 별도 지원을 받을 수 있으며, 지방자치단체별로 추가 지원이 있는 경우도 있습니다.",
  },
  {
    q: "재가요양에서 요양원으로 전환하려면 어떻게 하나요?",
    a: "등급이 유지되고 있다면 별도 재판정 없이 급여 유형만 변경할 수 있습니다. 건강보험공단에 급여 변경 신청 후 시설과 계약을 체결하면 됩니다.",
  },
];

export type NhBurdenCompare = {
  burdenLabel: string;
  burdenType: string;
  facilityBurden: number;
  facilityTotal: number;
  homeBurden: number;
  saving: number;
};

export type NhFacilityCheck = {
  category: string;
  items: string[];
};

export type NhHomeCareAgencyTip = {
  title: string;
  body: string;
};

// 3등급 기준 감경별 월비용 비교
export const NH_BURDEN_COMPARE: NhBurdenCompare[] = [
  {
    burdenLabel: "일반",
    burdenType: "건강보험 가입자",
    facilityBurden: 477900,
    facilityTotal: 697900,
    homeBurden: 238032,
    saving: 459868,
  },
  {
    burdenLabel: "감경 40%",
    burdenType: "의료급여·건보료 하위 25%",
    facilityBurden: 286740,
    facilityTotal: 506740,
    homeBurden: 142819,
    saving: 363921,
  },
  {
    burdenLabel: "감경 60%",
    burdenType: "차상위계층",
    facilityBurden: 191160,
    facilityTotal: 411160,
    homeBurden: 95213,
    saving: 315947,
  },
  {
    burdenLabel: "기초수급자",
    burdenType: "기초생활수급자",
    facilityBurden: 0,
    facilityTotal: 220000,
    homeBurden: 0,
    saving: 220000,
  },
];

export const NH_FACILITY_CHECKLIST: NhFacilityCheck[] = [
  {
    category: "인력·서비스",
    items: [
      "요양보호사 1인당 담당 어르신 수 (법정 기준: 2.5명 이하)",
      "야간 인력 배치 여부 및 규모",
      "물리치료사·간호사 상주 여부",
      "프로그램(재활·인지활동·외부 나들이) 월 횟수",
    ],
  },
  {
    category: "시설·환경",
    items: [
      "침실 구조 (2인실 기본 포함 여부, 1인실 비용)",
      "냉난방·채광·환기 상태 직접 확인",
      "욕실·화장실 수 및 미끄럼 방지 설비",
      "화재·비상구 안전 설비 확인",
    ],
  },
  {
    category: "비용·계약",
    items: [
      "식비·이미용비·기저귀비 등 비급여 항목 목록 서면 요청",
      "계약서에 퇴소 절차와 환불 규정 명시 여부",
      "장기요양기관 평가 등급 (공단 홈페이지에서 조회 가능)",
      "입소 대기 기간 및 대기 중 연락 방법",
    ],
  },
  {
    category: "접근성·면회",
    items: [
      "가족 면회 시간 제한 여부 및 절차",
      "자택에서의 거리 (면회 용이성)",
      "긴급 연락 체계 (24시간 보호자 연락 가능 여부)",
    ],
  },
];

export const NH_HOME_CARE_TIPS: NhHomeCareAgencyTip[] = [
  {
    title: "장기요양기관 지정 여부 확인",
    body: "방문요양·주야간보호 기관은 반드시 건강보험공단에서 지정받은 곳이어야 급여가 인정됩니다. 노인장기요양보험 홈페이지(longtermcare.or.kr)에서 지역 내 인정 기관을 조회할 수 있습니다.",
  },
  {
    title: "서비스 계획서(표준장기요양이용계획서) 꼼꼼히 확인",
    body: "공단이 발급한 계획서에 명시된 한도와 서비스 종류 내에서만 급여가 지원됩니다. 기관이 한도 초과 서비스를 권유하면 초과분은 전액 본인 부담이므로 계획서 내용을 미리 숙지하세요.",
  },
  {
    title: "요양보호사 1인 고정 배치 요청",
    body: "가능하면 담당 요양보호사를 고정으로 지정해달라고 요청하세요. 어르신과의 친밀감 형성이 케어 품질에 큰 영향을 미칩니다. 잦은 교체가 있는 기관은 주의가 필요합니다.",
  },
  {
    title: "급여 제공 기록지 월별 확인",
    body: "기관은 매월 급여 제공 기록지를 보호자에게 제공해야 합니다. 실제 방문 시간과 서비스 내용이 계획서와 일치하는지 확인하고, 이상이 있으면 공단에 신고할 수 있습니다.",
  },
];

export const NH_SEO_INTRO = [
  "장기요양등급을 받은 후 가족들이 가장 먼저 부딪히는 질문은 '요양원에 모실까, 집에서 방문요양을 쓸까'입니다. 두 선택의 월비용 차이는 등급과 소득에 따라 20만~50만원 이상 벌어지며, 추가 비용까지 고려하면 차이는 더 커집니다.",
  "재가요양은 월 급여 한도 내에서 방문요양·주야간보호·방문목욕 등을 조합할 수 있어 유연성이 높고, 가족요양보호사 제도를 활용하면 비용을 대폭 줄일 수 있습니다. 요양원은 24시간 케어가 가능하지만 식비·기타 비용이 추가로 발생합니다.",
];

export const NH_SEO_CRITERIA = [
  "시설급여(요양원) 본인부담: 일반 20%, 감경 12%, 기초수급자 면제",
  "재가급여 본인부담: 일반 15%, 감경 9%, 기초수급자 면제",
  "3등급 기준 요양원 총비용(추가비용 포함): 약 70~78만원/월 vs 재가요양 약 24만원/월",
  "가족요양보호사 활용 시 재가 월비용 약 20만원대로 절감 가능",
  "모든 수가·비용은 2026년 기준 추정값이며 지역·시설에 따라 다릅니다",
];
