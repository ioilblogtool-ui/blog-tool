export type JobType = 'office' | 'production' | 'shift' | 'it' | 'medical' | 'other';
export type CompanySize = 'under5' | 'under30' | 'over30';

export interface OvertimePreset {
  id: string;
  label: string;
  jobType: JobType;
  basePay: number;
  scheduledHours: number;
  overtimeHours: number;
  nightHours: number;
  holidayHoursUnder8: number;
  holidayHoursOver8: number;
  companySize: CompanySize;
  isPopalImgeum: boolean;
  popalAmount: number;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  office:     '사무직',
  production: '생산직',
  shift:      '교대근무',
  it:         'IT 개발직',
  medical:    '의료·간호',
  other:      '기타',
};

export const OVERTIME_RATE: Record<CompanySize, number> = {
  under5: 0,
  under30: 0.5,
  over30: 0.5,
};

export const NET_RATE = 0.872;

export const OPC_PRESETS: OvertimePreset[] = [
  {
    id: 'preset-it',
    label: 'IT 개발직 야근',
    jobType: 'it',
    basePay: 4000000,
    scheduledHours: 209,
    overtimeHours: 20,
    nightHours: 0,
    holidayHoursUnder8: 0,
    holidayHoursOver8: 0,
    companySize: 'over30',
    isPopalImgeum: false,
    popalAmount: 0,
  },
  {
    id: 'preset-nurse',
    label: '간호사 교대',
    jobType: 'medical',
    basePay: 3400000,
    scheduledHours: 209,
    overtimeHours: 15,
    nightHours: 30,
    holidayHoursUnder8: 8,
    holidayHoursOver8: 8,
    companySize: 'over30',
    isPopalImgeum: false,
    popalAmount: 0,
  },
  {
    id: 'preset-factory',
    label: '생산직 야간교대',
    jobType: 'production',
    basePay: 2800000,
    scheduledHours: 209,
    overtimeHours: 10,
    nightHours: 40,
    holidayHoursUnder8: 8,
    holidayHoursOver8: 0,
    companySize: 'over30',
    isPopalImgeum: false,
    popalAmount: 0,
  },
  {
    id: 'preset-office',
    label: '사무직 월말 마감',
    jobType: 'office',
    basePay: 3200000,
    scheduledHours: 209,
    overtimeHours: 30,
    nightHours: 0,
    holidayHoursUnder8: 8,
    holidayHoursOver8: 0,
    companySize: 'over30',
    isPopalImgeum: false,
    popalAmount: 0,
  },
];

export const OPC_FAQ = [
  {
    question: '통상임금에 식대·교통비도 포함되나요?',
    answer: '정기적·일률적·고정적으로 지급되는 수당(고정 식대, 고정 교통비 등)은 통상임금에 포함될 수 있습니다. 실지출에 따라 지급되는 실비 변상 성격의 수당은 제외됩니다. 이 계산기는 기본급 기준으로 계산하므로, 정확한 통상임금 판단은 노무사 상담을 권장합니다.',
  },
  {
    question: '포괄임금제이면 야근수당을 추가로 받을 수 없나요?',
    answer: '아닙니다. 포괄임금이 실제 법정 수당보다 적을 경우 차액을 청구할 수 있습니다. 법원은 포괄임금 약정이 있더라도 실제 수당이 포괄임금을 초과하면 차액 지급 의무가 있다고 판결해 왔습니다. 이 계산기에서 포괄임금제 토글을 켜면 초과 여부를 즉시 확인할 수 있습니다.',
  },
  {
    question: '야간근로와 연장근로가 중복되면 어떻게 계산하나요?',
    answer: '야간근로(22:00~06:00)와 연장근로는 중복 적용이 가능합니다. 예를 들어 야간 시간대에 연장근로를 한 경우 연장 가산(+50%)과 야간 가산(+50%)이 모두 적용되어 통상임금의 2.0배를 받을 수 있습니다. 이 계산기에서는 연장과 야간을 각각 입력하면 중복 가산을 자동으로 합산합니다.',
  },
  {
    question: '5인 미만 사업장은 야근수당이 없나요?',
    answer: '5인 미만 사업장에서는 연장·휴일 가산율(+50%)이 적용되지 않아 기본 임금만 지급됩니다. 단, 야간근로 가산(+50%)은 5인 미만 사업장에도 적용됩니다. 즉, 밤 10시 이후 근무에 대해서는 야간 가산수당을 청구할 수 있습니다.',
  },
  {
    question: '주 52시간을 초과하면 어떤 처벌이 있나요?',
    answer: '근로기준법 위반으로 사업주는 2년 이하의 징역 또는 2,000만 원 이하의 벌금 처벌을 받을 수 있습니다. 다만 30인 미만 사업장은 계도 기간 등 예외가 적용될 수 있습니다. 근로자는 초과 근무를 강요받은 경우 고용노동부에 진정할 수 있습니다.',
  },
  {
    question: '수당 미지급 시 소멸시효가 있나요?',
    answer: '임금 청구권의 소멸시효는 3년입니다. 퇴직 후에도 3년 이내라면 미지급 수당을 청구할 수 있습니다. 노동부 진정은 무료로 신청할 수 있으며, 평균 처리 기간은 1~3개월 수준입니다.',
  },
  {
    question: '교대근무에서 야간 수당은 어떻게 계산하나요?',
    answer: '교대근무에서 오후 10시~오전 6시 사이에 해당하는 시간만큼 야간 가산(+50%)이 적용됩니다. 예를 들어 밤 10시~오전 6시 8시간 교대 근무라면 전체 8시간에 야간 가산이 붙습니다. 이 계산기에서 야간근로 시간 입력란에 실제 22:00~06:00 사이 근무 시간을 입력하세요.',
  },
  {
    question: '월 소정근로시간 209시간이 아닌 경우도 있나요?',
    answer: '네. 209시간은 주 40시간 기준 일반적인 경우이며, 단시간 근로자·격주 근무제 등은 소정근로시간이 다를 수 있습니다. 근로계약서에 명시된 소정근로시간을 직접 입력하면 더 정확한 통상임금을 산출할 수 있습니다.',
  },
];

export const OPC_RELATED_LINKS = [
  { href: '/reports/overtime-pay-by-job-2026/', label: '직종별 야근·수당 실태 완전 비교' },
  { href: '/tools/salary/', label: '연봉 인상 계산기' },
  { href: '/tools/retirement/', label: '퇴직금 계산기 (통상임금 연계)' },
  { href: '/tools/parental-leave/', label: '육아휴직·단축근무 급여 계산기' },
];
