// ── 초등입학 전 체크리스트·비용 총정리 2026 데이터 ──────────────────────────

// ── 공통 타입 ────────────────────────────────────────────────────
export type PriceTier = 'frugal' | 'average' | 'premium';

// ── 준비물 체크리스트 ─────────────────────────────────────────────
export type ChecklistCategory = 'required' | 'school_specific' | 'optional';

export type ChecklistItem = {
  id: string;
  name: string;
  category: ChecklistCategory;
  note?: string;
};

// ── 품목별 비용 ───────────────────────────────────────────────────
export type ItemCostRow = {
  item: string;
  frugal: string;
  average: string;
  premium: string;
  note: string;
};

// ── 첫 달 총비용 시나리오 ────────────────────────────────────────
export type FirstMonthScenario = {
  tier: PriceTier;
  label: string;
  oneTime: string;
  monthly: string;
  total: string;
};

// ── 방과후·돌봄·학원 비교 ────────────────────────────────────────
export type AfterSchoolCompareRow = {
  type: string;
  costLevel: string;
  pros: string;
  cons: string;
  recommended: string;
};

// ── 입학 전 학습 준비 비용 ────────────────────────────────────────
export type PreLearningRow = {
  method: string;
  monthlyCost: string;
  feature: string;
  recommended: '높음' | '중간' | '선택';
};

// ── 돌봄 신청 플로우 ───────────────────────────────────────────────
export type CareFlowStep = {
  step: number;
  title: string;
  desc: string;
};

// ── 국가 지원금 ───────────────────────────────────────────────────
export type SupportRow = {
  name: string;
  target: string;
  content: string;
  channel: string;
  badge: '공식' | '참고';
};

// ── 후회한 준비물 TOP5 ────────────────────────────────────────────
export type RegretItem = {
  rank: number;
  item: string;
  reason: string;
  tip: string;
};

// ── 형제자매 절감 팁 ──────────────────────────────────────────────
export type SiblingTipRow = {
  item: string;
  reusability: '높음' | '중간' | '낮음~중간';
  tip: string;
};

// ── 2016 vs 2026 비교 ─────────────────────────────────────────────
export type YearCompareRow = {
  category: string;
  year2016: string;
  year2026: string;
  changeNote: string;
};

// ── FAQ ───────────────────────────────────────────────────────────
export type FaqItem = {
  q: string;
  a: string;
};

// ═══════════════════════════════════════════════════════════════════
// 실제 데이터
// ═══════════════════════════════════════════════════════════════════

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 필수 준비물
  { id: 'backpack', name: '책가방', category: 'required', note: '브랜드보다 무게·수납 구조 확인, 1~2kg 미만 권장' },
  { id: 'indoor-shoes', name: '실내화 / 실내화 가방', category: 'required', note: '학교별 허용 색상·디자인 확인 필수' },
  { id: 'pencil-case', name: '필통 · 연필 · 지우개', category: 'required', note: 'HB 연필 10자루 이상, 사각 지우개 권장' },
  { id: 'colored-pencils', name: '색연필 · 사인펜', category: 'required', note: '12~24색 기본 세트, 수성사인펜 추가 권장' },
  { id: 'notebook', name: '공책 (줄공책·받아쓰기)', category: 'required', note: '국어 노트 형식, 여분 2~3권 구비' },
  { id: 'water-bottle', name: '물통', category: 'required', note: '300~400ml 보온·보냉 가능 제품 권장' },
  { id: 'name-sticker', name: '이름스티커 (이름표)', category: 'required', note: '가방·신발·필통 등 전 소지품에 부착' },

  // 학교별 확인 필요
  { id: 'pe-uniform', name: '체육복', category: 'school_specific', note: '학교 지정 여부 확인 후 구매' },
  { id: 'art-supplies', name: '미술 준비물', category: 'school_specific', note: '입학 후 안내문 확인, 사전 구매 주의' },
  { id: 'notice-file', name: '알림장 / 파일', category: 'school_specific', note: '클리어파일 3~4개, 알림장 학교 지정 여부 확인' },
  { id: 'hygiene', name: '개인 위생용품', category: 'school_specific', note: '손수건·휴지·마스크 등 학교별 규정 상이' },
  { id: 'sub-bag', name: '보조가방 (에코백류)', category: 'school_specific', note: '체육복·준비물 별도 담기용, 학교별 필요 여부 확인' },

  // 있으면 편한 선택 항목
  { id: 'waterproof-label', name: '방수 네임라벨', category: 'optional', note: '물통·도시락·신발 등에 붙이면 분실 예방' },
  { id: 'pencil-sharpener', name: '연필깎이', category: 'optional', note: '가정용 전동 or 수동, 교실용은 학교 비치 여부 확인' },
  { id: 'desk-organizer', name: '책상 정리용품', category: 'optional', note: '집 학습 공간 정리용, 문구 트레이 등' },
  { id: 'umbrella', name: '우산 · 우비', category: 'optional', note: '등하교 대비, 여분 우산 학교 보관 가능한 미니 우산 추천' },
];

export const ITEM_COST_ROWS: ItemCostRow[] = [
  { item: '책가방 세트', frugal: '5만~8만 원', average: '9만~15만 원', premium: '16만 원+', note: '브랜드 차이 큼' },
  { item: '실내화 / 실내화 가방', frugal: '2만~3만 원', average: '3만~5만 원', premium: '5만 원+', note: '학교 기준 확인' },
  { item: '필통 · 필기구 세트', frugal: '1만~2만 원', average: '2만~4만 원', premium: '4만 원+', note: '캐릭터 여부 영향' },
  { item: '공책 · 파일 · 라벨', frugal: '1만~2만 원', average: '2만~3만 원', premium: '3만 원+', note: '소모품 재구매 가능' },
  { item: '물통 · 보조용품', frugal: '1만~2만 원', average: '2만~4만 원', premium: '4만 원+', note: '선택 품목 포함' },
  { item: '체육복 (학교 지정)', frugal: '2만~4만 원', average: '4만~6만 원', premium: '6만 원+', note: '학교별 상이' },
  { item: '이름스티커 / 네임라벨', frugal: '5천~1만 원', average: '1만~2만 원', premium: '2만 원+', note: '방수·인쇄 방식 차이' },
];

export const FIRST_MONTH_SCENARIOS: FirstMonthScenario[] = [
  {
    tier: 'frugal',
    label: '절약형',
    oneTime: '12만~20만 원',
    monthly: '5만~15만 원',
    total: '17만~35만 원',
  },
  {
    tier: 'average',
    label: '평균형',
    oneTime: '20만~35만 원',
    monthly: '10만~30만 원',
    total: '30만~65만 원',
  },
  {
    tier: 'premium',
    label: '확장형',
    oneTime: '35만~60만 원',
    monthly: '20만~60만 원',
    total: '55만~120만 원',
  },
];

export const AFTER_SCHOOL_COMPARE: AfterSchoolCompareRow[] = [
  {
    type: '학교 방과후',
    costLevel: '낮음~중간',
    pros: '이동 부담 적음, 학교 내 안전',
    cons: '선택 폭 제한 가능, 정원 경쟁',
    recommended: '기본 보완형',
  },
  {
    type: '돌봄 + 방과후',
    costLevel: '낮음~중간',
    pros: '보호 공백 완화, 비용 부담 낮음',
    cons: '지역·학교별 운영 차이 큼',
    recommended: '맞벌이·저학년',
  },
  {
    type: '민간 학원',
    costLevel: '중간~높음',
    pros: '과목 선택 다양, 전문 강사',
    cons: '월 고정비 큼, 이동 부담',
    recommended: '특정 과목 집중',
  },
  {
    type: '학습지 · 방문형',
    costLevel: '중간',
    pros: '집에서 가능, 관리 편함',
    cons: '누적 비용 증가, 자기주도 어려움',
    recommended: '보조형',
  },
];

export const PRE_LEARNING_ROWS: PreLearningRow[] = [
  { method: '가정학습 (부모 직접)', monthlyCost: '0~3만 원', feature: '비용 낮음, 부모 시간 필요', recommended: '높음' },
  { method: '문제집 · 워크북', monthlyCost: '2만~6만 원', feature: '가장 무난, 아이 속도 조절 가능', recommended: '높음' },
  { method: '방문학습지', monthlyCost: '4만~12만 원', feature: '관리 편함, 담당 선생님 배정', recommended: '중간' },
  { method: '학원 (국어·수학)', monthlyCost: '10만 원+', feature: '비용 높음, 선행 부담 가능', recommended: '선택' },
];

export const CARE_FLOW_STEPS: CareFlowStep[] = [
  { step: 1, title: '학교 입학 안내 확인', desc: '취학통지서, 예비소집 날짜, 학교별 안내문을 꼼꼼히 읽습니다.' },
  { step: 2, title: '돌봄 필요 여부 결정', desc: '맞벌이·한부모 가정 여부, 하교 후 보호 공백 시간을 파악합니다.' },
  { step: 3, title: '학교·교육청 신청 일정 확인', desc: '초등 돌봄 신청 기간은 학교마다 다르므로 공지 즉시 신청합니다.' },
  { step: 4, title: '지역 연계 프로그램 확인', desc: '늘봄학교, 지역아동센터, 시설 연계 등 추가 옵션을 파악합니다.' },
  { step: 5, title: '대기 or 추가 접수 여부 확인', desc: '정원 초과 시 대기 명단 등록, 민간 대안 병행 여부를 결정합니다.' },
];

export const SUPPORT_ROWS: SupportRow[] = [
  {
    name: '아동수당',
    target: '연령 기준 충족 아동',
    content: '월 정액 지원 (지급 연령 확대 중)',
    channel: '복지로 / 지자체',
    badge: '공식',
  },
  {
    name: '교육급여',
    target: '소득 기준 충족 가구',
    content: '교육활동지원비 (부교재비 포함)',
    channel: '복지로 / 행정복지센터',
    badge: '공식',
  },
  {
    name: '교육비 지원',
    target: '소득·가구 기준 충족 학생',
    content: '방과후 자유수강권, 학교급식비 등',
    channel: '학교 / 교육청',
    badge: '공식',
  },
  {
    name: '늘봄학교',
    target: '희망 초등학생',
    content: '방과 후 돌봄·프로그램 지원 (지역 연계 확대)',
    channel: '학교 신청',
    badge: '참고',
  },
];

export const REGRET_ITEMS: RegretItem[] = [
  {
    rank: 1,
    item: '너무 비싼 책가방',
    reason: '1학년은 체형이 빠르게 변해 금방 작아지고, 고장·분실 위험도 있습니다.',
    tip: '중저가(5만~10만 원대) 브랜드에서 기능 중심으로 선택하세요.',
  },
  {
    rank: 2,
    item: '캐릭터 위주 학용품 과다 구매',
    reason: '학교 내 분실·교체가 잦아 실용적이지 않으며 집중력을 흐릴 수 있습니다.',
    tip: '기본 문구류를 먼저 준비하고, 캐릭터 제품은 최소화하세요.',
  },
  {
    rank: 3,
    item: '학교 규격 확인 전 실내화 구매',
    reason: '학교별로 허용 색상·디자인이 다르며, 입학 전에 미리 사면 반려될 수 있습니다.',
    tip: '예비소집 후 안내문 확인 후 구매하세요.',
  },
  {
    rank: 4,
    item: '필요 이상의 선행학습 등록',
    reason: '1학년 적응 시기에 과도한 학원 스케줄은 스트레스 원인이 됩니다.',
    tip: '처음 한 학기는 학교 적응을 우선시하고, 이후 필요에 따라 추가하세요.',
  },
  {
    rank: 5,
    item: '이름표·라벨링 늦게 준비',
    reason: '입학 초기 분실 사고가 많아, 소지품 전체에 미리 붙이지 않으면 회수가 어렵습니다.',
    tip: '방수 네임라벨을 입학 전에 준비해 모든 소지품에 부착하세요.',
  },
];

export const SIBLING_TIP_ROWS: SiblingTipRow[] = [
  { item: '필기구 · 파일', reusability: '높음', tip: '남은 재고 활용, 파일류는 깨끗하면 재사용 가능' },
  { item: '실내화 가방', reusability: '높음', tip: '상태 좋으면 세탁 후 재사용 가능' },
  { item: '라벨 · 이름표 스티커', reusability: '중간', tip: '이름 다르면 새로 구매, 방수 라벨 부분 재사용 가능' },
  { item: '정리용품 (트레이 등)', reusability: '높음', tip: '집에 있는 물건 활용, 신규 구매 불필요' },
  { item: '책가방', reusability: '낮음~중간', tip: '체형·취향 고려, 파손 없으면 재사용 검토' },
  { item: '체육복', reusability: '낮음~중간', tip: '학교 지정 디자인 동일하면 재사용 가능, 사이즈 주의' },
];

export const YEAR_COMPARE_ROWS: YearCompareRow[] = [
  {
    category: '책가방 평균',
    year2016: '5만~8만 원',
    year2026: '9만~15만 원',
    changeNote: '브랜드·캐릭터 제품 증가로 상승',
  },
  {
    category: '문구류 · 준비물 합계',
    year2016: '5만~10만 원',
    year2026: '12만~25만 원',
    changeNote: '소비 다양화, 원자재·물가 상승',
  },
  {
    category: '초등 사교육 구조',
    year2016: '학원 중심',
    year2026: '방과후 + 학원 혼합',
    changeNote: '늘봄·방과후 제도 변화',
  },
  {
    category: '아동수당 지급',
    year2016: '없음',
    year2026: '월 정액 지급',
    changeNote: '지급 연령 확대 (2026)',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: '2026년 초등학교 입학 대상은 어떻게 확인하나요?',
    a: '만 6세가 되는 해의 3월 1일 기준으로 초등학교에 입학합니다. 2020년 1월 1일~12월 31일 출생 아동이 2026년 3월 입학 대상입니다. 정확한 입학 대상·일정은 정부24(gov.kr) 또는 주소지 관할 교육청에서 확인하세요.',
  },
  {
    q: '취학통지서는 어디서 받나요?',
    a: '취학통지서는 매년 12월 주소지 관할 읍·면·동 주민센터에서 우편 또는 정부24 온라인으로 발급됩니다. 정부24(gov.kr)에서 전자문서로 발급받을 수 있으며, 분실 시 주민센터에서 재발급 신청이 가능합니다.',
  },
  {
    q: '준비물은 학교마다 다른가요?',
    a: '네, 학교별로 요구 준비물, 체육복 디자인, 실내화 색상 등이 다릅니다. 예비소집 때 또는 입학 초기 안내문을 통해 학교가 공지하므로, 안내문 확인 전 대량 구매는 피하는 것이 좋습니다.',
  },
  {
    q: '책가방은 언제 사는 게 좋나요?',
    a: '1월~2월이 선택 폭이 가장 넓고, 세일 시즌과 겹치는 경우도 있습니다. 다만 너무 비싼 제품보다는 무게 가볍고 수납 구조가 실용적인 중저가 제품을 권장합니다. 체형 변화가 빠른 1학년 특성상 고가 제품은 부담이 될 수 있습니다.',
  },
  {
    q: '돌봄은 언제 신청해야 하나요?',
    a: '초등 돌봄(방과후 돌봄교실)은 학교별로 신청 시기가 다르지만, 통상 입학 전 1~2월에 신청을 받습니다. 정원이 한정되어 경쟁이 있으므로, 학교 공지를 즉시 확인하고 우선 신청하는 것이 중요합니다.',
  },
  {
    q: '방과후와 학원은 어떻게 다른가요?',
    a: '학교 방과후 프로그램은 학교 내에서 운영되어 이동 부담이 없고 비용이 비교적 낮습니다. 민간 학원은 과목 선택이 다양하지만 월 고정비가 높고 이동이 필요합니다. 1학년은 학교 적응을 우선하고, 방과후를 먼저 활용한 뒤 필요에 따라 학원을 추가하는 순서를 권장합니다.',
  },
  {
    q: '아동수당과 교육급여를 같이 받을 수 있나요?',
    a: '아동수당은 연령 기준을 충족하면 소득과 관계없이 받을 수 있고, 교육급여는 소득 기준을 충족하는 가구가 받을 수 있어 두 가지를 동시에 수급하는 것이 가능합니다. 정확한 수급 기준과 신청 방법은 복지로(bokjiro.go.kr)에서 확인하세요.',
  },
  {
    q: '형제자매가 있으면 어떤 준비물을 재사용할 수 있나요?',
    a: '파일, 클리어파일, 정리용품, 실내화 가방 등 상태가 좋은 물건은 세탁·청소 후 재사용이 가능합니다. 책가방은 체형·취향 차이가 있어 신중히 결정하고, 체육복은 학교 지정 디자인이 동일하면 재사용 검토가 가능합니다. 이름표·라벨은 이름이 다르므로 새로 구매하는 것이 원칙입니다.',
  },
];
