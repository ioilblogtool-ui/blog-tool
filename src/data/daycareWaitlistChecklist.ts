export type AgeGroup = '0-5' | '6-11' | '12-17' | '18-23' | '24+';
export type Urgency = 'asap' | '3m' | '6m' | 'anytime';

export type WaitlistInput = {
  rank: number;
  ageGroup: AgeGroup;
  isDualIncome: boolean;
  hasSibling: boolean;
  urgency: Urgency;
};

export type CheckItem = {
  label: string;
  met: boolean;
  impact: string;
};

export type Tip = {
  title: string;
  body: string;
};

export type WaitlistResult = {
  score: number;
  level: 'high' | 'medium' | 'low' | 'very-low';
  label: string;
  icon: string;
  probability: string;
  checks: CheckItem[];
  phoneMent: string;
  tips: Tip[];
};

export const DWC_META = {
  title: '어린이집 대기순번 입소 가능성 체크리스트',
  seoTitle: '어린이집 대기순번 입소 가능성 체크리스트 2026 | 대기 1번·2번이면 들어갈 수 있을까',
  description: '대기순번·월령·맞벌이·형제 여부 입력하면 입소 가능성 바로 판정. 전화 문의 시 쓸 수 있는 멘트까지 제공.',
  slug: 'daycare-waitlist-checklist',
};

export const DWC_DEFAULTS: WaitlistInput = {
  rank: 3,
  ageGroup: '12-17',
  isDualIncome: true,
  hasSibling: false,
  urgency: '3m',
};

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '0-5':   '0~5개월 (0세반)',
  '6-11':  '6~11개월 (0세반 후반)',
  '12-17': '12~17개월 (1세반)',
  '18-23': '18~23개월 (1세반 후반)',
  '24+':   '24개월 이상 (2세반↑)',
};

export const CLASS_LABELS: Record<AgeGroup, string> = {
  '0-5':   '0세반 (정원 3명)',
  '6-11':  '0세반 후반 (정원 3명)',
  '12-17': '1세반 (정원 5명)',
  '18-23': '1세반 후반 (정원 5명)',
  '24+':   '2세반 이상 (정원 7명↑)',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  asap:    '1개월 내',
  '3m':    '3개월 내',
  '6m':    '6개월 내',
  anytime: '언제든 가능',
};

// 점수 계산 상수
const BASE_SCORE: Record<number, number> = {
  1: 70, 2: 55, 3: 40, 4: 25, 5: 25,
};

const AGE_BONUS: Record<AgeGroup, number> = {
  '0-5':   10,
  '6-11':  5,
  '12-17': 0,
  '18-23': 3,
  '24+':   8,
};

const URGENCY_BONUS: Record<Urgency, number> = {
  asap:    -10,
  '3m':    0,
  '6m':    5,
  anytime: 10,
};

export const RESULT_LEVELS = [
  { min: 80, level: 'high' as const,     label: '가능성 높음',      icon: '✅', probability: '약 65~80%' },
  { min: 50, level: 'medium' as const,   label: '가능성 중간',      icon: '⚠️', probability: '약 35~65%' },
  { min: 30, level: 'low' as const,      label: '가능성 낮음',      icon: '🔶', probability: '약 15~35%' },
  { min: 0,  level: 'very-low' as const, label: '가능성 매우 낮음', icon: '❌', probability: '약 15% 미만' },
];

export const DWC_TIPS: Tip[] = [
  {
    title: '복수 어린이집 대기 등록',
    body: '아이사랑 앱에서 최대 3곳 동시 대기 가능. 거주 구청 추천 목록 활용을 권장합니다.',
  },
  {
    title: '개원 예정 어린이집 확인',
    body: '신규 개원 어린이집은 대기 없이 바로 입소 가능한 경우가 많습니다. 구청 보육담당팀에 문의하세요.',
  },
  {
    title: '민간 어린이집 병행 검토',
    body: '국공립 대기를 유지하면서 민간 어린이집에 우선 입소하는 방법이 있습니다. 보육료 차이는 월 5~15만 원 수준입니다.',
  },
];

export const DWC_FAQS = [
  {
    question: '어린이집 대기 1번이면 무조건 입소되나요?',
    answer: '1번이어도 입소가 보장되지 않습니다. 해당 반에 자리가 생겨야 하고, 더 높은 우선순위(한부모·장애·기초수급)가 없어야 합니다. 맞벌이 여부와 형제 재원 여부에 따라 순번이 역전될 수 있습니다. 국공립 어린이집은 아이사랑 시스템 기준으로 배정되므로 실제 순위와 공시된 순번이 다를 수 있습니다.',
  },
  {
    question: '맞벌이면 어린이집 대기 우선순위가 올라가나요?',
    answer: '아이사랑 시스템에서 맞벌이 가정은 2순위 우선순위를 받습니다. 일반 3순위보다 먼저 배정되며, 부모 모두 건강보험료 납부 이력으로 취업 여부를 확인합니다. 맞벌이 확인 서류(건강보험료 납부확인서 또는 재직증명서)를 미리 준비해 두세요.',
  },
  {
    question: '어린이집 대기 취소하면 순번이 사라지나요?',
    answer: '아이사랑 앱에서 대기를 취소하면 해당 어린이집 대기 목록에서 즉시 삭제됩니다. 재신청 시 신규 대기 등록 일자 기준으로 다시 순번이 배정됩니다. 따라서 대기를 유지한 채 민간 어린이집을 이용하다가 국공립 입소 연락을 받으면 그때 결정하는 방식이 일반적입니다.',
  },
  {
    question: '어린이집 대기 중 전화는 언제 하면 좋나요?',
    answer: '매월 초(1~5일)가 가장 효과적입니다. 전달 말일 기준으로 퇴소·전원이 집계되어 당월 초에 자리가 확정됩니다. 이 시기에 전화하면 당월 입소 가능 여부를 가장 정확히 확인할 수 있습니다. 전화 시 아이 생년월일과 대기 등록일을 먼저 말씀드리면 빠르게 확인 가능합니다.',
  },
  {
    question: '0세반과 1세반 대기순번이 다른가요?',
    answer: '반마다 별도 대기 순번이 있습니다. 0세반(정원 3명)과 1세반(정원 5명)은 정원이 달라 입소 속도가 다릅니다. 아이사랑 앱에서 반별로 대기 등록하고 순번을 각각 확인하세요. 자녀 월령에 따라 배정 반이 달라지므로 복수 어린이집에 대기 시 반 배정 기준도 함께 확인하는 것이 좋습니다.',
  },
  {
    question: '어린이집 대기 중 민간 어린이집 입소하면 국공립 대기가 취소되나요?',
    answer: '민간 어린이집 입소와 국공립 대기는 별도로 유지됩니다. 국공립 입소 확정 통보를 받고 수락하지 않으면 대기 취소 처리될 수 있으니, 통보 후 즉시 의사결정이 필요합니다. 통보 후 응답 기한(보통 3~5일)을 놓치지 않도록 아이사랑 앱 알림 설정을 켜두세요.',
  },
];
