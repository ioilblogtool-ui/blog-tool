export const PAGE_META = {
  title: '육아휴직 + 육아기 단축근무 계산기',
  description:
    '이미 사용한 육아휴직과 육아기 단축근무 이력을 반영해 남은 기간, 18개월 여부, 2026년 기준 단축근무 예상 월급을 계산하는 정책형 도구',
  ogImage: '/og/tools/parental-leave-short-work-calculator.png',
  seoTitle: '육아휴직 + 육아기 단축근무 계산기 | 남은 기간·18개월 여부·2026 급여 계산',
  seoDescription:
    '육아휴직 18개월 자격 판정, 남은 육아휴직 기간, 육아기 근로시간 단축 최대 기간, 2026년 상한 기준 단축근무 예상 월급을 한 번에 계산합니다.'
} as const;

export const POLICY_CONSTANTS = {
  parentalLeaveDefaultMonths: 12,
  parentalLeaveExtendedMonths: 18,
  shortWorkBaseMonths: 12,
  shortWorkMaxMonths: 36,
  shortWorkFirstTenCap: 2500000,
  shortWorkExtraCap: 1600000,
  shortWorkMinSupport: 500000,
  weeklyHoursMinAfterReduction: 15,
  weeklyHoursMaxAfterReduction: 35
} as const;

export const DEFAULT_INPUT = {
  childBirthDate: '2025-10-01',
  baseDate: '2026-04-05',
  monthlyOrdinaryWage: 3200000,
  weeklyHoursBefore: 40,
  weeklyHoursAfter: 32,
  householdType: 'GENERAL',
  spouseUsedThreeMonths: true,
  leaveUsedMonths: 3,
  shortWorkUsedMonths: 0,
  plannedLeaveMonths: 6,
  scenarioMode: 'AUTO'
} as const;

export const HOUSEHOLD_TYPE_OPTIONS = [
  { value: 'GENERAL', label: '일반 가구' },
  { value: 'SINGLE_PARENT', label: '한부모 가정' },
  { value: 'DISABLED_CHILD', label: '중증 장애아동 부모' }
] as const;

export const SCENARIO_OPTIONS = [
  { value: 'AUTO', label: '자동 추천' },
  { value: 'LEAVE_FIRST', label: '휴직 우선' },
  { value: 'SHORT_FIRST', label: '단축 우선' },
  { value: 'MIXED', label: '혼합 사용' }
] as const;

export const SCENARIO_COPY = {
  LEAVE_FIRST: {
    label: '휴직 우선',
    description: '남은 육아휴직을 먼저 쓰고 이후 단축근무를 이어가는 흐름'
  },
  SHORT_FIRST: {
    label: '단축 우선',
    description: '현금흐름 방어를 위해 단축근무부터 길게 가져가는 흐름'
  },
  MIXED: {
    label: '혼합 사용',
    description: '휴직 일부와 단축근무 일부를 섞어 유연하게 사용하는 흐름'
  },
  AUTO: {
    label: '자동 추천',
    description: '현재 입력 기준으로 가장 유리한 시나리오를 자동으로 제안'
  }
} as const;

export const PAGE_FAQ = [
  {
    question: '배우자 한 명만 3개월 쓰면 18개월이 되나요?',
    answer:
      '아닙니다. 같은 자녀에 대해 부모가 각각 3개월 이상 육아휴직을 사용해야 18개월 연장 조건으로 계산합니다. 한부모 가정이나 중증 장애아동 부모는 별도 예외입니다.'
  },
  {
    question: '육아기 근로시간 단축은 최대 몇 개월까지 가능한가요?',
    answer:
      '기본 12개월에 미사용 육아휴직 기간의 2배를 가산하고, 최대 36개월로 제한합니다. 이 계산기는 그 상한을 기준으로 남은 기간을 계산합니다.'
  },
  {
    question: '단축근무 급여 상한 250만원은 어떻게 적용되나요?',
    answer:
      '2026년 기준으로 최초 10시간 단축분은 월 상한 250만원, 그 외 추가 단축분은 월 상한 160만원 구조를 적용합니다. 회사 지급분과 합산한 예상 월 수령액을 보여줍니다.'
  },
  {
    question: '실제 회사에서 받는 금액과 같나요?',
    answer:
      '아닙니다. 통상임금 산정 방식, 회사 지급 규정, 실제 신청 승인 조건에 따라 달라질 수 있어 참고용 모의계산으로 보셔야 합니다.'
  }
] as const;

export const REFERENCE_LINKS = [
  {
    href: 'https://www.moel.go.kr',
    label: '고용노동부 육아휴직·육아기 근로시간 단축 안내',
    description: '제도 개편, 자격 조건, 신청 절차 확인용 공식 자료'
  },
  {
    href: 'https://www.work24.go.kr',
    label: 'Work24 고용보험 모의계산·제도 안내',
    description: '육아휴직과 육아기 근로시간 단축 급여 안내 원문 확인용'
  }
] as const;

export const RELATED_LINKS = [
  { href: '/tools/parental-leave-pay/', label: '육아휴직 급여 계산기' },
  { href: '/tools/single-parental-leave-total/', label: '한 명만 육아휴직 총수령액 계산기' },
  { href: '/tools/six-plus-six/', label: '6+6 부모육아휴직제 계산기' },
  { href: '/tools/birth-support-total/', label: '출산~2세 총지원금 계산기' }
] as const;
