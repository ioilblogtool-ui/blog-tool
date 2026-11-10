import { YETC_RULES } from './yearEndTaxRefundCalculator.ts';

export const YETS_META = {
  slug: '2026-year-end-tax-saving-guide',
  title: '연말정산 2026 귀속: 연말 공제 체크리스트',
  seoTitle: '연말정산 2026 귀속 | 공제 체크리스트·카드 사용 전략 — 비교계산소',
  description: '2026년 귀속·2027년 정산을 준비하는 직장인을 위한 연말 공제 체크리스트입니다. 카드 사용액, 연금저축·IRP, 월세, 의료비, 부양가족, 기부금의 요건과 증빙을 점검하고, 기존 계산기에서 소득공제와 실제 소득세 감소, 예상 환급액을 구분해 확인하세요.',
  updatedAt: '2026-11-10',
  dataNote: '2026년 귀속·2027년 정산 준비용입니다. 아래 준비 상태는 공제 적격 판정이 아니며, 공제요건과 실제 지출·납입 증빙을 함께 확인해야 합니다.',
  calculatorHref: '/tools/year-end-tax-refund-calculator/',
};

// 기존 계산기와 같은 2026 일반 규칙을 참조한다. 이 리포트는 세금 엔진을 추가하지 않는다.
export const YETS_RULES = {
  cardThresholdRate: YETC_RULES.card.thresholdRate,
  pensionSavingCap: YETC_RULES.pension.savingCap,
  pensionCombinedCap: YETC_RULES.pension.combinedCap,
  pensionSalaryBoundary: YETC_RULES.pension.salaryBoundary,
  pensionLowRate: YETC_RULES.pension.lowRate,
  pensionHighRate: YETC_RULES.pension.highRate,
  rentSalaryCap: YETC_RULES.rent.salaryCap,
  rentCap: YETC_RULES.rent.cap,
};

export interface YetsChecklistItem {
  id: 'card' | 'retirement' | 'rent' | 'medical' | 'dependents' | 'donation';
  title: string;
  summary: string;
  checkNow: string;
  action: string;
  documents: string;
  caution: string;
  anchor: string;
  sourceIds: string[];
}

export const YETS_CHECKLIST: YetsChecklistItem[] = [
  { id: 'card', title: '카드·현금영수증', summary: '공제대상 사용액과 남은 예정 지출 확인',
    checkNow: '총급여 예상액과 공제대상 누적액을 확인하세요. 특별 사용처 금액이 일반 카드 사용액에 중복돼 있지 않은지 살펴보세요.',
    action: '이미 예정한 지출에 대해 신용카드와 체크카드·현금영수증을 비교하세요. 문턱과 한도를 채우려고 소비를 늘릴 필요는 없습니다.',
    documents: '카드·현금영수증 사용 내역, 누락된 공제대상 지출 자료',
    caution: '소득공제액은 환급액이 아닙니다. 특별 사용처·제외 지출·한도와 자녀 관련 요건에 따라 결과가 달라집니다.',
    anchor: 'yets-card', sourceIds: ['card'] },
  { id: 'retirement', title: '연금저축·IRP', summary: '본인 납입액과 남은 공제 여력 확인',
    checkNow: '연금저축과 IRP·DC 본인 추가부담금을 나눠 확인하세요. 회사 부담금·퇴직금 이전액은 일반 본인 납입과 구분하세요.',
    action: '연말까지 추가 납입할지 판단하기 전에 공제 여력과 생활자금, 중도인출·해지 조건을 함께 확인하세요. 금융기관별 처리 마감도 확인하세요.',
    documents: '연금계좌별 본인 납입 내역·납입증명서',
    caution: 'ISA 전환 등 특례는 일반 한도와 별도입니다. 명목 공제가 늘어도 실제 소득세 감소는 남은 세액에 따라 작아질 수 있습니다.',
    anchor: 'yets-retirement', sourceIds: ['pension'] },
  { id: 'rent', title: '월세', summary: '소득·주택·계약·주소와 지급 증빙 확인',
    checkNow: '총급여·종합소득, 무주택 세대 여부와 세대주·세대원의 적용 조건, 주택·계약·주소 요건을 확인하세요.',
    action: '계약서와 이체 내역을 모으고 주민등록 주소와 계약서 주소를 대조하세요. 간소화 자료에 없는 증빙은 회사 제출 방법을 확인하세요.',
    documents: '임대차계약서 사본, 주민등록표등본, 월세 지급 증빙',
    caution: '주택 규모 또는 기준시가 조건을 확인하세요. 같은 월세 지출에 대한 다른 공제와의 중복 여부도 확인해야 합니다.',
    anchor: 'yets-evidence', sourceIds: ['rent'] },
  { id: 'medical', title: '의료비', summary: '실제 부담액과 보험금·환급금 구분',
    checkNow: '의료비 자료에서 본인이 부담한 금액과 실손보험금 등으로 보전받은 금액을 구분하세요.',
    action: '누락 영수증을 확보하고 일반 의료비와 특례 대상 의료비를 나눠 확인하세요. 공제를 위해 불필요한 의료 지출을 만들지는 마세요.',
    documents: '의료비 영수증, 보험금·본인부담금 환급 내역 등',
    caution: '장애인 의료비의 한도 특례와 난임시술비 공제율은 다릅니다. 실제 부담액·대상·지출기간에 따른 요건을 확인하세요.',
    anchor: 'yets-evidence', sourceIds: ['medical'] },
  { id: 'dependents', title: '부양가족', summary: '항목별 가족 요건과 중복 신청 점검',
    checkNow: '가족의 소득·나이·실제 부양 관계를 항목별로 확인하세요. 기본공제와 의료비 등 각 항목의 요건이 같지는 않습니다.',
    action: '가족 간 누가 어떤 공제를 신청할지 조정하고, 같은 항목을 중복 신청하지 않도록 확인하세요.',
    documents: '가족관계·소득·부양 관련 자료 중 해당 공제에 필요한 증빙',
    caution: '맞벌이라고 소득이 높은 사람에게 항상 몰아주는 방식은 적절하지 않습니다. 실제 지출자와 항목별 요건을 확인하세요.',
    anchor: 'yets-evidence', sourceIds: ['personal'] },
  { id: 'donation', title: '기부금', summary: '적격 단체·유형·영수증 확인',
    checkNow: '기부한 단체의 공제 적격성과 기부금 유형, 영수증 발급 내역을 확인하세요.',
    action: '누락된 영수증을 요청하고 가족 기부금·이월액이 있다면 해당 유형의 요건을 별도로 확인하세요.',
    documents: '기부금영수증, 해당 시 이월 내역',
    caution: '기부금은 유형별 적용 기준이 다릅니다. 기존 계산기에는 산정 완료된 일반 기부금 소득세 공제액을 입력합니다.',
    anchor: 'yets-evidence', sourceIds: ['medical'] },
];

export const YETS_CARD_GUIDE = [
  { title: '먼저, 올해 총급여와 사용액', body: '일반적인 카드 소득공제는 공제대상 사용액이 총급여의 25%를 넘는 구간부터 살펴봅니다. 연봉과 총급여, 결제 총액과 공제대상 사용액을 구분하세요.' },
  { title: '같은 예정 지출로 비교', body: '일반 신용카드와 체크카드·현금영수증은 공제율이 다릅니다. 이미 정한 지출을 결제수단별로 비교하되 문턱 차감 순서, 특별 사용처와 한도를 함께 봐야 합니다.' },
  { title: '공제액과 줄어드는 세금 구분', body: '소득공제가 15만원 늘어도 환급이 15만원 늘어나는 것은 아닙니다. 기존 계산기는 동일한 추가 지출에 대해 소득공제 증가와 예상 소득세 감소를 나눠 보여줍니다.' },
];

export const YETS_EVIDENCE_NOTES = [
  { title: '월세는 예전 한도 대신 현재 요건 확인', body: '국세청 안내의 총급여 기준은 8천만원 이하이며 종합소득 요건도 확인해야 합니다. 일반 공제대상 월세액 한도는 연 1천만원입니다. 무주택·세대 요건, 주택 규모 또는 기준시가, 계약 명의와 주소도 함께 확인하세요.', sourceId: 'rent' },
  { title: '장애인 의료비와 난임시술비를 구분', body: '국세청 안내에서 장애인 의료비는 한도 특례가 있는 15% 대상이고, 난임시술비는 30% 대상입니다. 실손보험금이나 사후환급금으로 보전된 금액은 실제 부담 의료비와 구분해야 합니다.', sourceId: 'medical' },
  { title: '가족·기부금은 항목별 요건 확인', body: '기본공제와 특별세액공제의 가족 요건은 같지 않습니다. 실제 지출자와 중복 신청 여부를 점검하고, 기부금은 적격 단체·유형·영수증을 확인하세요. 모든 항목을 한 사람에게 모으는 일괄 전략은 피하세요.', sourceId: 'personal' },
];

export const YETS_EXAMPLES = [
  { id: 'card-example', title: '카드 문턱 확인', label: '가상 예시', value: '총급여 5천만원 → 문턱 1,250만원', explanation: '총급여에 25%를 곱한 금액입니다. 이 문턱을 넘었다고 지출 초과분 전부가 환급되지는 않으며, 한도와 사용처에 따른 실제 공제액을 따로 계산합니다.' },
  { id: 'pension-example', title: '공제 계산액과 실제 절세', label: '가상 예시 · 소득세', value: '적격 납입 100만원 × 15% = 15만원', explanation: '15% 공제율이 적용되고 납입 한도가 남은 일반 사례의 명목 소득세 공제 계산입니다. 실제 세금 감소는 남은 세액에 따라 달라지며 지방소득세 효과는 이 예시에 포함하지 않았습니다.' },
  { id: 'settlement-example', title: '환급·추가 납부의 차이', label: '가상 예시 · 소득세', value: '결정세액이 같아도 정산 결과는 다름', explanation: '결정세액이 100만원이라면 이미 낸 소득세 150만원에서는 50만원 환급, 80만원에서는 20만원 추가 납부입니다. 국세끼리 비교한 예시이며 환급 규모가 절세 효과를 뜻하지는 않습니다.' },
];

export const YETS_FAQ = [
  { question: '2026 귀속인데 왜 2027년에 정산하나요?', answer: '2026년에 발생한 근로소득을 대상으로 다음 해 회사의 연말정산 절차에서 정산하기 때문입니다. 이 페이지는 귀속연도와 정산연도를 구분해 올해 준비할 자료를 안내합니다.' },
  { question: '체크리스트의 준비 완료는 공제 가능 판정인가요?', answer: '아닙니다. 본인이 자료와 요건을 점검한 상태를 표시할 뿐입니다. 공제 적용은 해당 연도의 소득·대상·지출 요건과 증빙을 별도로 확인해야 합니다.' },
  { question: '체크 상태는 저장되거나 공유되나요?', answer: '체크 상태는 현재 페이지에서만 사용하며 주소나 브라우저 저장소에 기록하지 않습니다. 새로고침하거나 다시 방문하면 처음 상태로 돌아갑니다.' },
  { question: '체크카드를 쓰면 항상 더 많이 환급되나요?', answer: '그렇지 않습니다. 공제 문턱에 미달하거나 한도에 도달하면 추가 공제 효과가 없을 수 있습니다. 필요한 예정 지출을 기준으로 공제액과 실제 소득세 차이를 함께 비교하세요.' },
  { question: '연금저축·IRP를 더 넣으면 공제액만큼 환급되나요?', answer: '추가 납입이 공제대상인지, 남은 한도와 적용 비율이 얼마인지 먼저 확인해야 합니다. 명목 공제가 늘어도 이미 세금이 0원이거나 남은 세액이 적으면 실제 감소액은 작아질 수 있습니다. 중도인출·해지와 생활자금 조건도 함께 판단하세요.' },
  { question: '월세 공제는 무엇부터 확인하나요?', answer: '총급여·종합소득, 무주택 세대와 세대주·세대원, 주택·계약·주소 요건을 먼저 확인하세요. 그다음 계약서와 주민등록표등본, 월세 지급 증빙을 준비하고 회사 제출 방법을 확인하세요.' },
  { question: '의료비는 영수증 금액을 모두 넣으면 되나요?', answer: '실손보험금이나 사후환급금 등으로 보전받은 금액을 구분해야 합니다. 대상자·항목에 따라 공제율과 한도도 다릅니다. 기존 계산기는 의료비 특례 전체를 자동 계산하지 않으므로 지원 범위를 확인하세요.' },
  { question: '기존 계산기는 지방소득세도 계산하나요?', answer: '연결된 환급 계산기는 소득세 기준 시뮬레이션이며 지방소득세는 합산하지 않습니다. 기납부 소득세를 비워두면 환급액을 임의로 추정하지 않고 예상 결정세액을 보여줍니다.' },
  { question: '언제까지 납입하거나 서류를 제출해야 하나요?', answer: '올해 귀속에 반영되는 지출·납입의 시기와 금융기관의 실제 처리 마감을 확인하세요. 회사의 자료 제출 일정은 다음 해 정산 절차에 따라 다르므로 회사 안내를 확인해야 합니다. 모든 항목을 같은 마감으로 단정하지 마세요.' },
];

export const YETS_INTRO = [
  '연말정산을 준비하는 직장인에게 필요한 것은 공제 항목을 많이 나열한 목록보다, 자신의 지출과 납입 중 무엇을 확인해야 하는지 알려주는 순서입니다. 2026년에 발생한 근로소득을 2027년에 정산한다는 기준을 먼저 잡고 예상 총급여, 공제대상 지출, 이미 낸 소득세를 준비하세요. 이 체크리스트는 카드·연금계좌·월세·의료비·가족·기부금 중 자신에게 해당하는 항목과 증빙 준비 상태를 나눠 점검할 수 있도록 돕습니다.',
  '소득공제는 과세표준을 낮추는 방식이고 세액공제는 요건에 맞는 금액을 세금에서 차감하는 방식입니다. 카드 사용에는 최소사용금액과 한도, 연금계좌에는 적격 본인 납입액과 일반 공제 한도가 적용됩니다. 같은 금액을 더 사용하거나 납입해도 사람마다 효과가 다른 이유입니다. 기존 계산기에서는 전체 입력 조건을 반영한 소득세 시뮬레이션과 카드·연금 추가 시나리오를 확인할 수 있습니다.',
  '결과를 읽을 때는 공제대상 금액, 명목 공제액, 실제 예상 소득세 감소, 최종 환급을 각각 구분하세요. 이미 낸 소득세와 결정세액의 차이가 환급 또는 추가 납부가 되므로 환급액이 크다는 이유만으로 더 많이 절세했다고 볼 수 없습니다. 체크리스트의 준비 완료도 공제 적격 판정을 의미하지 않습니다. 가족 간 중복 신청 여부와 지출 항목별 요건, 실제 지급 증빙을 마지막으로 대조하는 과정이 필요합니다.',
  '이 페이지는 일반적인 준비 순서와 대표 사례를 제공하며 세법상 모든 특례나 개인별 최종 신고액을 계산하지 않습니다. 자료 제출 일정은 회사마다 다르고 연말 지출·납입의 처리 마감은 기관별로 다를 수 있습니다. 설명의 확인일과 국세청 공식 안내를 함께 살피세요. 연결된 계산기는 소득세만 다루며 지원하지 않는 특례가 있습니다. 기납부 소득세를 모르는 경우에는 환급을 확정하지 말고 결정세액과 준비자료부터 확인하세요.',
];

export const YETS_RELATED_LINKS = [
  { href: '/tools/year-end-tax-refund-calculator/', label: '내 조건으로 소득세·예상 환급액 계산하기' },
  { href: '/reports/pension-irp-comparison-2026/', label: '연금저축과 IRP의 차이 살펴보기' },
  { href: '/tools/irp-pension-calculator/', label: '추가 납입 후 은퇴 연금 계산하기' },
  { href: '/reports/employee-tax-insurance-rates-2026/', label: '직장인 세금·4대보험 요율표' },
];

export const YETS_SOURCES = [
  { id: 'card', label: '카드 소득공제 기준·한도', publisher: '국가법령정보센터', href: 'https://www.law.go.kr/법령/조세특례제한법/제126조의2', locator: '조세특례제한법 제126조의2 · 2026 귀속 적용 조문 확인' },
  { id: 'pension', label: '연금계좌 세액공제', publisher: '국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=6439', locator: '연금계좌 세액공제 · 일반 한도·소득별 비율·제외 납입' },
  { id: 'rent', label: '월세액 세액공제', publisher: '국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=239025&mi=40613', locator: '월세액 공제대상·주택·구비 서류 · 안내 페이지의 기준연도도 함께 확인' },
  { id: 'medical', label: '의료비·기부금 등 특별세액공제', publisher: '국세청', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7874&mi=6594', locator: '의료비 대상별 한도·공제율·제외 비용, 기부금 유형' },
  { id: 'personal', label: '기본공제의 대상·요건', publisher: '국가법령정보센터', href: 'https://www.law.go.kr/법령/소득세법/제50조', locator: '소득세법 제50조 · 실제 공제항목별 요건 별도 확인' },
  { id: 'rent-law', label: '월세액 세액공제의 법정 기준', publisher: '국가법령정보센터', href: 'https://law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031942147', locator: '2026-09-18 시행 조세특례제한법 제95조의2 · 소득 요건·연 1천만원 공제대상 월세액 한도' },
];

export const YETS_UPDATES = [
  { date: YETS_META.updatedAt, text: '기존 URL을 유지하며 2026 귀속·2027 정산 준비 체크리스트로 개편했습니다. 월세·의료비 설명을 정리하고, 근거 없는 순위·기납부세액 없는 환급 차트·미확인 개정 예고를 제거했습니다.' },
];
