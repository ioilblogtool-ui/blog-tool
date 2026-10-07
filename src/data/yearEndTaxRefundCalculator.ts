export type YetcEligibility = 'unknown' | 'yes' | 'no';
export interface YetcInput {
  grossSalary: number; withheldTax: number | null; withheldPeriod: 'annual' | 'ytd';
  dependents: number; elderlyDependents: number; disabledDependents: number; children: number; cardLimitChildren: number;
  creditCardAmount: number; debitCashAmount: number; traditionalMarketAmount: number; publicTransportAmount: number;
  cultureSportsAmount: number; cultureDebitAmount: number;
  pensionInsuranceDeduction: number; socialInsuranceDeduction: number;
  housingSubscription: number; mortgageRepayment: number; subscriptionEligible: YetcEligibility; housingEligible: YetcEligibility;
  medicalExpense: number; educationExpense: number; insurance: number; donationCreditInput: number;
  pensionSaving: number; irpAmount: number; monthlyRent: number; isRenter: boolean; rentEligible: YetcEligibility;
  additionalSpend: number; additionalPension: number; pensionTarget: 'saving' | 'irp';
}
export interface YetcPreset { id: string; label: string; summary: string; input: Partial<YetcInput> }
export interface YetcFaq { question: string; answer: string }
export interface YetcLink { href: string; label: string }
export interface YetcField {
  key: keyof YetcInput; url: string; label: string; hint: string;
  type: 'money' | 'count' | 'select' | 'checkbox'; min?: number;
  tab: 'basic' | 'spend' | 'saving' | 'scenario'; detail?: string;
  options?: Array<{ value: string; label: string }>;
}
export const YETC_META = {
  title: '연말정산 환급액 계산기 2026',
  seoTitle: '연말정산 환급액 계산기 2026 | 절세 여력 바로 계산',
  seoDescription: '총급여와 기납부 소득세, 카드 사용액, 연금저축·IRP 납입액을 입력해 2026년 예상 연말정산 결과를 확인하세요. 카드 25% 문턱과 결제수단별 추가 공제, 연금계좌 잔여한도와 추가 납입의 세금 감소를 비교합니다. 월세·자녀 등 주요 공제를 반영한 시뮬레이션입니다.',
  updatedAt: '2026-10-07',
  dataNote: '2026년 귀속 근로소득자의 주요 공제를 반영한 시뮬레이션입니다. 실제 신고 결과는 회사 원천징수 내역과 공제요건에 따라 달라질 수 있습니다.',
};
export const YETC_DEFAULTS: YetcInput = {
  grossSalary: 50_000_000, withheldTax: null, withheldPeriod: 'annual',
  dependents: 1, elderlyDependents: 0, disabledDependents: 0, children: 0, cardLimitChildren: 0,
  creditCardAmount: 0, debitCashAmount: 0, traditionalMarketAmount: 0, publicTransportAmount: 0, cultureSportsAmount: 0, cultureDebitAmount: 0,
  pensionInsuranceDeduction: 0, socialInsuranceDeduction: 0,
  housingSubscription: 0, mortgageRepayment: 0, subscriptionEligible: 'unknown', housingEligible: 'unknown',
  medicalExpense: 0, educationExpense: 0, insurance: 0, donationCreditInput: 0,
  pensionSaving: 0, irpAmount: 0, monthlyRent: 0, isRenter: false, rentEligible: 'unknown',
  additionalSpend: 1_000_000, additionalPension: 1_000_000, pensionTarget: 'irp',
};
// 2026-10-07 법문·국세청 안내 대조. 모든 공제율은 소득세 기준.
export const YETC_RULES = {
  taxYear: 2026, maxMoney: 10_000_000_000, maxPeople: 20,
  laborDeduction: [
    { max: 5_000_000, from: 0, fixed: 0, rate: 0.7 },
    { max: 15_000_000, from: 5_000_000, fixed: 3_500_000, rate: 0.4 },
    { max: 45_000_000, from: 15_000_000, fixed: 7_500_000, rate: 0.15 },
    { max: 100_000_000, from: 45_000_000, fixed: 12_000_000, rate: 0.05 },
    { max: 10_000_000_000, from: 100_000_000, fixed: 14_750_000, rate: 0.02 },
  ], laborDeductionCap: 20_000_000,
  taxBrackets: [
    { max: 14_000_000, rate: 0.06, deduction: 0 }, { max: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { max: 88_000_000, rate: 0.24, deduction: 5_760_000 }, { max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { max: 300_000_000, rate: 0.38, deduction: 19_940_000 }, { max: 500_000_000, rate: 0.4, deduction: 25_940_000 },
    { max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 }, { max: 10_000_000_000, rate: 0.45, deduction: 65_940_000 },
  ],
  personal: { basic: 1_500_000, elderly: 1_000_000, disabled: 2_000_000 },
  laborCredit: { taxBoundary: 1_300_000, lowRate: 0.55, fixed: 715_000, highRate: 0.3,
    caps: [
      { max: 33_000_000, from: 0, cap: 740_000, reduction: 0, floor: 740_000 },
      { max: 70_000_000, from: 33_000_000, cap: 740_000, reduction: 0.008, floor: 660_000 },
      { max: 120_000_000, from: 70_000_000, cap: 660_000, reduction: 0.5, floor: 500_000 },
      { max: 10_000_000_000, from: 120_000_000, cap: 500_000, reduction: 0.5, floor: 200_000 },
    ] },
  card: { salaryBoundary: 70_000_000, thresholdRate: 0.25, creditRate: 0.15, debitRate: 0.3, specialRate: 0.4,
    lowCaps: [3_000_000, 3_500_000, 4_000_000], highCaps: [2_500_000, 2_750_000, 3_000_000],
    extraLowCap: 3_000_000, extraHighCap: 2_000_000 },
  pension: { savingCap: 6_000_000, combinedCap: 9_000_000, salaryBoundary: 55_000_000, lowRate: 0.15, highRate: 0.12 },
  rent: { salaryCap: 80_000_000, cap: 10_000_000, salaryBoundary: 55_000_000, lowRate: 0.17, highRate: 0.15 },
  child: { first: 250_000, second: 300_000, subsequent: 400_000 },
  housing: { salaryCap: 70_000_000, subscriptionCap: 3_000_000, combinedCap: 4_000_000, rate: 0.4 },
  medical: { thresholdRate: 0.03, cap: 7_000_000, rate: 0.15 },
  educationRate: 0.15, insurance: { cap: 1_000_000, rate: 0.12 }, standardCredit: 130_000,
};
const eligibility = [{ value: 'unknown', label: '아직 확인하지 않았어요' }, { value: 'yes', label: '요건을 모두 충족해요' }, { value: 'no', label: '요건을 충족하지 않아요' }];
export const YETC_FIELDS: YetcField[] = [
  { key: 'grossSalary', url: 'sal', label: '올해 총급여 예상액', hint: '비과세 급여를 제외한 연간 예상액 · 원', type: 'money', min: 1, tab: 'basic' },
  { key: 'withheldTax', url: 'wt', label: '기납부 소득세', hint: '지방소득세 제외 · 모르면 비워두세요. 실제 0원은 0을 입력하세요.', type: 'money', tab: 'basic' },
  { key: 'withheldPeriod', url: 'wp', label: '기납부 소득세의 기간', hint: '누적액만 알면 연말 최종 환급과 구분해서 표시해요.', type: 'select', tab: 'basic', options: [{ value: 'annual', label: '올해 전체 예상 합계' }, { value: 'ytd', label: '현재까지 낸 누적액' }] },
  { key: 'dependents', url: 'dep', label: '기본공제 가족 수 (본인 포함)', hint: '나이·소득 요건 충족, 가족 간 중복 공제 제외', type: 'count', min: 1, tab: 'basic' },
  { key: 'children', url: 'chd', label: '자녀세액공제 대상 수', hint: '기본공제 대상 중 8세 이상 자녀·손자녀', type: 'count', tab: 'basic' },
  { key: 'cardLimitChildren', url: 'clc', label: '카드 한도 확대 대상 자녀 수', hint: '20세 이하 직계비속 등, 소득금액 100만원 이하(근로소득만 있으면 총급여 500만원 이하), 다른 사람의 기본공제 제외. 장애인은 나이 제한 없음.', type: 'count', tab: 'basic' },
  { key: 'elderlyDependents', url: 'eld', label: '경로우대 대상 수', hint: '기본공제 대상 중 70세 이상', type: 'count', tab: 'basic', detail: '가족·사회보험 상세' },
  { key: 'disabledDependents', url: 'dis', label: '장애인 추가공제 대상 수', hint: '본인 포함 기본공제 대상 · 경로우대와 중복 가능', type: 'count', tab: 'basic', detail: '가족·사회보험 상세' },
  { key: 'pensionInsuranceDeduction', url: 'pi', label: '공적연금보험료 공제대상액', hint: '국민연금 등 본인 부담액 · 급여명세서 연간 예상 합계', type: 'money', tab: 'basic', detail: '가족·사회보험 상세' },
  { key: 'socialInsuranceDeduction', url: 'si', label: '건강·고용보험료 공제대상액', hint: '장기요양 포함 본인 부담액 · 표준세액공제 선택 시 제외', type: 'money', tab: 'basic', detail: '가족·사회보험 상세' },
  { key: 'creditCardAmount', url: 'cc', label: '일반 신용카드 사용액', hint: '전통시장·대중교통·문화체육비 제외 공제대상액', type: 'money', tab: 'spend' },
  { key: 'debitCashAmount', url: 'dc', label: '일반 체크카드·현금영수증', hint: '특별 사용처 금액은 아래에 별도로 입력하세요.', type: 'money', tab: 'spend' },
  { key: 'traditionalMarketAmount', url: 'tm', label: '전통시장 사용액', hint: '공제대상 전통시장 · 결제수단 합계 · 원', type: 'money', tab: 'spend', detail: '특별 사용처' },
  { key: 'publicTransportAmount', url: 'pt', label: '대중교통 사용액', hint: '공제대상 대중교통 · 원', type: 'money', tab: 'spend', detail: '특별 사용처' },
  { key: 'cultureSportsAmount', url: 'cs', label: '문화체육비 (신용카드)', hint: '지정 사업자의 도서·공연·영화·수영장·체력단련장 이용료 등. 개인강습비 제외.', type: 'money', tab: 'spend', detail: '특별 사용처' },
  { key: 'cultureDebitAmount', url: 'cd', label: '문화체육비 (체크·현금영수증)', hint: '총급여 7천만원 초과 시 두 문화체육비 입력은 각각 일반 결제수단 공제율로 계산', type: 'money', tab: 'spend', detail: '특별 사용처' },
  { key: 'medicalExpense', url: 'med', label: '일반 부양가족 의료비', hint: '실손보험금·환급액 제외. 본인·65세 이상·6세 이하·장애인·난임 등 특례는 미반영.', type: 'money', tab: 'spend', detail: '의료·교육·보험·기부금' },
  { key: 'educationExpense', url: 'edu', label: '공제대상 교육비 합계', hint: '인별 요건·한도 반영 후 금액. 초중고 1인 300만원, 대학생 900만원, 본인 한도 없음.', type: 'money', tab: 'spend', detail: '의료·교육·보험·기부금' },
  { key: 'insurance', url: 'ins', label: '일반 보장성보험료', hint: '공제요건 충족 보험료 · 납입액 연 100만원 한도', type: 'money', tab: 'spend', detail: '의료·교육·보험·기부금' },
  { key: 'donationCreditInput', url: 'dci', label: '산정 완료 일반 기부금 세액공제액', hint: '지출액이 아닙니다. 소득세법상 특별세액공제의 일반 기부금 공제액만 입력하세요. 정치자금·고향사랑·이월 등 특례 제외.', type: 'money', tab: 'spend', detail: '의료·교육·보험·기부금' },
  { key: 'pensionSaving', url: 'pen', label: '연금저축 납입액', hint: '실제 연간 예상 납입액 · 공제대상 최대 600만원', type: 'money', tab: 'saving' },
  { key: 'irpAmount', url: 'irp', label: 'IRP·DC 본인 추가 납입액', hint: '회사 부담금·이전금 제외 · 연금저축과 합산 공제대상 900만원', type: 'money', tab: 'saving' },
  { key: 'monthlyRent', url: 'rent', label: '올해 지급 월세 합계', hint: '연간 예상 월세 · 공제대상 최대 1천만원', type: 'money', tab: 'saving' },
  { key: 'isRenter', url: 'renter', label: '무주택 세대에 해당해요', hint: '과세기간 종료일 기준', type: 'checkbox', tab: 'saving' },
  { key: 'rentEligible', url: 're', label: '월세의 나머지 공제요건', hint: '아래 확인 목록을 읽고 선택하세요. 모르면 적용을 보류합니다.', type: 'select', options: eligibility, tab: 'saving' },
  { key: 'housingSubscription', url: 'hs', label: '주택청약저축 납입액', hint: '납입액 300만원 한도 × 40% · 총급여 7천만원 이하', type: 'money', tab: 'saving', detail: '주택자금 소득공제' },
  { key: 'subscriptionEligible', url: 'se', label: '주택청약 공제요건', hint: '무주택 세대주 또는 배우자·본인 명의·무주택 확인서 등 확인', type: 'select', options: eligibility, tab: 'saving', detail: '주택자금 소득공제' },
  { key: 'mortgageRepayment', url: 'mr', label: '전세대출 원리금 상환액', hint: '공제요건 충족 상환액 × 40%, 청약과 소득공제 합산 400만원', type: 'money', tab: 'saving', detail: '주택자금 소득공제' },
  { key: 'housingEligible', url: 'he', label: '전세대출 공제요건', hint: '무주택·주택규모·차입자·차입 시기·대출기관 등 법정 요건을 확인하세요.', type: 'select', options: eligibility, tab: 'saving', detail: '주택자금 소득공제' },
  { key: 'additionalSpend', url: 'as', label: '앞으로 추가로 쓸 금액', hint: '이미 입력한 연간 예상액에 포함하지 않은 일반 소비 · 원', type: 'money', tab: 'scenario' },
  { key: 'additionalPension', url: 'ap', label: '추가 납입할 금액', hint: '이미 입력한 연간 예상 납입액에 포함하지 않은 금액 · 원', type: 'money', tab: 'scenario' },
  { key: 'pensionTarget', url: 'target', label: '추가 납입 계좌', hint: '유동성·중도인출 제한도 확인하세요.', type: 'select', tab: 'scenario', options: [{ value: 'irp', label: 'IRP·DC 본인 추가부담금' }, { value: 'saving', label: '연금저축' }] },
];
export const YETC_PRESETS: YetcPreset[] = [
  { id: 'threshold', label: '카드 문턱 전', summary: '총급여 5천 · 신용카드 1천만원', input: { creditCardAmount: 10_000_000 } },
  { id: 'pension', label: '연금 추가 납입', summary: '연금저축 400 · IRP 200만원', input: { creditCardAmount: 15_000_000, pensionSaving: 4_000_000, irpAmount: 2_000_000 } },
  { id: 'family', label: '자녀 2명', summary: '총급여 7천 · 본인과 자녀 2명', input: { grossSalary: 70_000_000, dependents: 3, children: 2, cardLimitChildren: 2, creditCardAmount: 25_000_000 } },
  { id: 'renter', label: '월세 납부', summary: '총급여 5천 · 월세 연 720만원', input: { monthlyRent: 7_200_000, isRenter: true, rentEligible: 'yes' } },
];
export const YETC_FAQ: YetcFaq[] = [
  { question: '기납부세액을 모르면 환급액을 볼 수 없나요?', answer: '비워두면 예상 결정세액만 표시합니다. 실제 0원과 미입력을 구분합니다. 급여명세서의 소득세를 확인하고 지방소득세는 제외하세요. 누적액만 입력하면 연말 최종 환급이 아닌 누적액 대비 차이를 표시합니다.' },
  { question: '총급여 5천만원이면 카드 공제는 언제 시작되나요?', answer: '공제대상 사용액 합계가 총급여의 25%인 1,250만원을 초과하면 시작됩니다. 해외 결제·공제 제외 지출은 빼고 특별 사용처를 중복 입력하지 마세요. 사용처와 결제수단을 구분해 입력해야 공제 문턱과 추가 지출 효과를 비교할 수 있습니다.' },
  { question: '체크카드를 쓰면 결제액의 30%를 환급받나요?', answer: '30%는 일반 체크카드·현금영수증의 소득공제율입니다. 환급률이 아닙니다. 문턱과 한도를 적용하며 실제 세금 감소는 전체 계산의 전후 차이로 확인합니다.' },
  { question: '자녀가 있으면 카드 공제 한도가 늘어나나요?', answer: '2026년 총급여 7천만원 이하의 기본한도는 대상 자녀 0·1·2명 이상일 때 300·350·400만원입니다. 7천만원 초과는 250·275·300만원입니다. 카드 한도 대상과 8세 이상 자녀세액공제 대상 수를 별도로 확인하세요.' },
  { question: 'IRP에 100만원을 더 넣으면 얼마를 돌려받나요?', answer: '한도 안에서 총급여 5,500만원 이하는 소득세 세액공제가 15만원, 초과는 12만원 늘어납니다. 결정세액이 충분하지 않으면 실제 세금 감소는 작거나 0일 수 있습니다. 지방소득세는 합산하지 않습니다.' },
  { question: '연금저축과 IRP는 각각 900만원까지 공제되나요?', answer: '연금저축의 공제대상은 최대 600만원, IRP 등과 합친 일반 한도는 900만원입니다. 잔여한도를 더하면 중복 계산됩니다. 실제 납입액은 유지하고 공제대상액에만 한도를 적용합니다.' },
  { question: '월세를 내면 모두 세액공제되나요?', answer: '총급여 8천만원 이하 등 소득요건과 무주택·세대주 또는 세대원 요건, 계약자·주택·주소·지급증빙을 충족해야 합니다. 요건을 확인하지 않은 입력은 적용을 보류합니다. 임대차계약서와 주민등록 주소, 월세 지급증빙을 대조한 뒤 요건 충족 여부를 선택하세요.' },
  { question: '환급액이 많으면 절세를 잘한 건가요?', answer: '환급액은 이미 낸 소득세와 결정세액의 차이입니다. 같은 세부담이라도 원천징수 금액이 많으면 환급액이 커집니다. 추가 소비·납입 효과는 결정세액 감소로 비교하세요.' },
  { question: '국세청 연말정산 미리보기와 결과가 다른 이유는 무엇인가요?', answer: '직접 입력한 주요 공제만 반영합니다. 간소화자료 연동, 다른 소득, 출산·입양, 감면, ISA 전환 추가한도와 의료비 특례 등은 미반영입니다. 신고 전 회사 원천징수 내역과 국세청 자료를 최종 확인하세요.' },
  { question: '교육비와 기부금에는 무엇을 입력하나요?', answer: '교육비는 대상자별 공제요건과 한도를 적용한 공제대상 금액 합계입니다. 기부금은 지출액이 아닌 종류·한도를 반영해 산정한 소득세 세액공제액입니다. 구버전 링크의 기부금 지출액은 공제액으로 자동 변환하지 않습니다.' },
];
export const YETC_INTRO = [
  '총급여 5천만원인 가상의 근로자는 카드 공제대상 사용액 1,250만원이 문턱입니다. 사용액이 문턱에 못 미치면 추가 소비를 해도 바로 공제가 생기지는 않으며, 문턱을 넘긴 금액에는 결제수단별 공제율과 한도가 적용됩니다. 같은 100만원의 계획된 지출이라도 현재 사용액과 공제한도에 따라 세금 감소가 달라지므로, 결과의 소득공제 증가와 실제 세금 감소를 함께 비교하세요.',
  '연말정산은 다음 해에 서류를 제출하기 전에 올해의 총급여와 지출을 점검하는 데서 시작됩니다. 10월부터 12월까지는 이미 사용한 카드 금액과 연금저축·IRP 납입액을 확인하고 남은 기간에 조정할 수 있는 부분을 살펴볼 수 있습니다. 이 계산기는 2026년 귀속 근로소득을 대상으로 예상 결정세액과 카드 공제 문턱, 연금계좌의 남은 공제대상 납입 여력을 함께 보여줍니다. 총급여에는 비과세 급여를 제외한 연간 예상액을 입력하세요.',
  '환급액은 공제금액을 모두 더해서 받는 돈이 아닙니다. 총급여에서 근로소득공제와 소득공제를 차감한 과세표준에 누진세율을 적용하고, 세액공제를 반영해 예상 결정세액을 구합니다. 이미 원천징수로 낸 소득세가 이 금액보다 많으면 환급 방향, 적으면 추가납부 방향입니다. 기납부 소득세를 모르면 예상 결정세액까지만 확인할 수 있으며 실제 0원 입력과 빈칸은 다르게 처리됩니다. 지방소득세는 소득세 결과에 합산하지 않습니다.',
  '카드 소득공제는 공제대상 사용액 합계가 총급여의 25%를 초과한 이후에 발생합니다. 결제수단별 공제율은 다르지만 문턱과 한도가 있어 결제액에 공제율을 곱한 돈을 그대로 돌려받지는 않습니다. 추가 소비 비교에서는 같은 지출을 결제수단만 달리했을 때 소득공제가 얼마나 늘고 실제 소득세가 얼마나 감소하는지 구분합니다. 불필요한 소비를 늘리기보다 원래 계획한 지출의 결제수단을 판단하는 데 활용하세요.',
  '연금저축과 IRP는 일반 세액공제 한도 안에서 추가 납입의 효과를 확인할 수 있습니다. 단독 한도와 계좌 합산 한도가 겹치므로 잔여 금액을 중복해서 더하지 않습니다. 명목 세액공제 증가가 있어도 현재 결정세액이 이미 0이라면 실제 세금 감소가 없을 수 있습니다. 모든 결과는 입력에 따른 시뮬레이션이며 실제 신고에는 공제요건과 증빙자료가 필요합니다. 연금계좌의 자금 사용 제한과 미반영 공제도 확인하고 회사 및 국세청 자료와 대조하세요.',
];
export const YETC_RELATED_LINKS: YetcLink[] = [
  { href: '/reports/2026-year-end-tax-saving-guide/', label: '2026 연말정산 공제항목별 절세 전략' },
  { href: '/reports/pension-irp-comparison-2026/', label: '연금저축과 IRP, 어디에 넣을지 비교하기' },
  { href: '/tools/irp-pension-calculator/', label: 'IRP 추가 납입 후 은퇴 연금 계산하기' },
  { href: '/tools/salary/', label: '연봉 실수령 계산기' }, { href: '/tools/retirement/', label: '퇴직금 계산기' },
  { href: '/tools/overtime-pay-calculator/', label: '야근수당 계산기' },
];
export const YETC_SOURCES = [
  { label: '카드 산식·2026 자녀별 한도: 조세특례제한법 제126조의2', href: 'https://www.law.go.kr/법령/조세특례제한법/제126조의2' },
  { label: '카드 한도 대상 자녀·체육시설 요건: 시행령 제121조의2', href: 'https://www.law.go.kr/법령/조세특례제한법시행령/제121조의2' },
  { label: '근로소득·자녀·연금계좌 세액공제: 국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=6439' },
  { label: '월세액 세액공제 요건: 국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=239025&mi=40613' },
  { label: '의료·교육·보험료 세액공제: 국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7874&mi=6594' },
  { label: '표준세액공제: 소득세법 제59조의4', href: 'https://www.law.go.kr/법령/소득세법/제59조의4' },
  { label: '주택청약저축 소득공제: 조세특례제한법 제87조', href: 'https://www.law.go.kr/법령/조세특례제한법/제87조' },
];
