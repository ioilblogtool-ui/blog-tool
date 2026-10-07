export type DataBadge = '공식' | '참고' | '시뮬레이션' | '추정';
export type PolicyStatus = 'current' | 'scheduled' | 'budgetProposal' | 'lawAmendmentRequired';
export type Evidence<T> = { value: T | null; status: 'verified' | 'recheckRequired'; sourceIds: string[]; note: string };
export type SourceRecord = {
  id: string; organization: string; title: string; url: string; publishedAt: string | null;
  checkedAt: string; verification: 'bodyRead' | 'searchExcerpt'; limitation: string | null;
};
export type PaymentAmount = {
  amountWon: number; basis: 'total' | 'monthly' | 'installment';
  birthOrder: 'first' | 'second' | 'thirdOrMore' | null;
  region: 'general' | 'preferred' | null; childcare: 'home' | 'daycare' | null;
  label: string; cashWon: Evidence<number>; voucherWon: Evidence<number>;
};
export type PolicyRecord = {
  id: string; version: string; name: string; applicableTarget: Evidence<string>;
  applicableBirthDate: Evidence<{ from: string | null; through: string | null }>;
  amounts: Evidence<PaymentAmount[]>;
  paymentCycle: Evidence<{ kind: 'once' | 'monthly' | 'quarterly'; installments: number | null }>;
  paymentPeriod: Evidence<string>; regionalPreference: Evidence<string>; childcareConditions: Evidence<string>;
  policyStatuses: PolicyStatus[];
  confirmation: { budget: 'notApplicable' | 'proposal' | 'approved' | 'unknown'; legislation: 'inForce' | 'amendmentRequired' | 'unknown'; guidance: 'published' | 'pending' | 'unknown' };
  badge: DataBadge; sourceIds: string[]; checkedAt: string; recheckItems: string[];
};

export const CBC_META = {
  slug: 'childbirth-benefits-changes-2027',
  title: '2027 부모급여·아동수당 변경 | 출산지원금 총정리',
  h1: '2027 부모급여·아동수당, 출산지원금은 어떻게 바뀌나?',
  description: '2027 부모급여·아동수당 개편안을 아이맞이지원금·아동기본수당과 비교합니다. 적용시점, 지급액, 6월·7월 출생 차이와 지역·보육 조건, 확정 전 확인사항을 정리합니다.',
  checkedAt: '2026-10-07', publishedAt: '2026-10-07' as string | null,
  modifiedAt: '2026-10-07' as string | null, status: '재확인 필요',
};
export const CBC_SOURCES: SourceRecord[] = [
  { id: 'reform', organization: '보건복지부·정책브리핑', title: '2027 핵심 청년 예산 발표 · 양육지원급여 개편', url: 'https://m.korea.kr/briefing/pressReleaseView.do?gubun=pressRelease&newsId=156775938&pageIndex=1&repCode=', publishedAt: '2026-08-28', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: '웹 본문 확인. 첨부 질의응답의 직접 열람은 재확인 필요.' },
  { id: 'welcome', organization: '보건복지부·정책브리핑', title: '2027 예산안 · 아이맞이지원금과 아동기본수당 도입', url: 'https://www.korea.kr/multi/visualNewsView.do?newsId=148971130', publishedAt: '2026-09-03', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: '대상과 기준은 정책 추진 과정에서 변경될 수 있다는 안내 포함.' },
  { id: 'qa', organization: '인구전략위원회', title: '2027년 7월 이후 양육지원 개편 Q&A', url: 'https://www.betterfuture.go.kr/home/kor/M916047858/board.do?act=detail&deleteAt=N&idx=cb00d1a0008a85e71a41b8741facbffe41f1d00969ae318082b426772d008bee&pageIndex=1&searchValue1=0', publishedAt: '2026-09-23', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: '정부 예산안 해설이며 최종 시행법령을 대체하지 않습니다.' },
  { id: 'parent', organization: '보건복지부', title: '현행 부모급여 지원 대상·금액·방식', url: 'https://www.mohw.go.kr/menu.es?mid=a10711030600', publishedAt: '2026-03-25', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: '날짜는 정책 안내 페이지의 최종수정일입니다.' },
  { id: 'child', organization: '보건복지부·정책브리핑', title: '2026 아동수당 지급연령·지역별 지원 확대', url: 'https://www.korea.kr/news/policyNewsView.do?newsId=148963373', publishedAt: '2026-04-24', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: null },
  { id: 'first', organization: '강남구', title: '2026 첫만남이용권 안내 · 전국 제도', url: 'https://www.gangnam.go.kr/board/B_000060/1071147/view.do?mid=ID03_010104/1000', publishedAt: '2026-03-09', checkedAt: CBC_META.checkedAt, verification: 'bodyRead', limitation: '지자체 자체 출산장려금과 다른 전국 제도 안내입니다.' },
];
const verified = <T>(value: T, sourceIds: string[], note = ''): Evidence<T> => ({ value, sourceIds, note, status: 'verified' });
const pending = <T>(note: string, sourceIds: string[] = []): Evidence<T> => ({ value: null, sourceIds, note, status: 'recheckRequired' });
const amount = (amountWon: number, label: string, basis: PaymentAmount['basis'], source: string, extras: Partial<PaymentAmount> = {}): PaymentAmount => ({
  amountWon, label, basis, birthOrder: null, region: null, childcare: null,
  cashWon: pending('지급수단 세부 재확인 필요'), voucherWon: pending('지급수단 세부 재확인 필요'), ...extras,
});
const currentConfirmation: PolicyRecord['confirmation'] = { budget: 'notApplicable', legislation: 'inForce', guidance: 'published' };
const proposalConfirmation: PolicyRecord['confirmation'] = { budget: 'proposal', legislation: 'amendmentRequired', guidance: 'pending' };
const proposalDates = verified({ from: '2027-07-01', through: null }, ['reform'], '정부 발표의 적용 출생일. 최종 경과규정 재확인 필요');
const regionPending = pending<string>('지방우대지수를 고려한 구분안. 지역 명단·거주기간·전입/전출 판정은 재확인 필요', ['reform']);
export const CBC_POLICIES: PolicyRecord[] = [
  {
    id: 'first-meeting', version: 'current-2026', name: '첫만남이용권', applicableTarget: verified('출생신고 후 주민등록번호를 부여받은 아동', ['first']),
    applicableBirthDate: pending('현행 대상의 상세 출생일 기준은 사업안내 확인', ['first']),
    amounts: verified([amount(2000000, '첫째', 'total', 'first', { birthOrder: 'first', cashWon: verified(0, ['first']), voucherWon: verified(2000000, ['first']) }), amount(3000000, '둘째 이상', 'total', 'first', { birthOrder: 'second', cashWon: verified(0, ['first']), voucherWon: verified(3000000, ['first']) })], ['first']),
    paymentCycle: verified({ kind: 'once', installments: 1 }, ['first']), paymentPeriod: verified('1회 바우처 지급. 사용기한은 신청 전 사업안내 확인', ['first']), regionalPreference: verified('전국 제도. 지자체 자체 장려금 별도', ['first']), childcareConditions: verified('출생 초기 지원, 가정보육·어린이집 월 수당과 구분', ['first']),
    policyStatuses: ['current'], confirmation: currentConfirmation, badge: '공식', sourceIds: ['first'], checkedAt: CBC_META.checkedAt, recheckItems: ['2027년 이전 출생아 경과규정', '바우처 사용기한·신청요건'],
  },
  {
    id: 'parent-benefit', version: 'current-2026', name: '부모급여', applicableTarget: verified('2세 미만 아동(0~23개월)', ['parent']), applicableBirthDate: pending('현행 출생일 요건은 사업안내 확인', ['parent']),
    amounts: verified([amount(1000000, '0세 가정보육', 'monthly', 'parent', { childcare: 'home', cashWon: verified(1000000, ['parent']), voucherWon: verified(0, ['parent']) }), amount(500000, '1세 가정보육', 'monthly', 'parent', { childcare: 'home', cashWon: verified(500000, ['parent']), voucherWon: verified(0, ['parent']) })], ['parent']),
    paymentCycle: verified({ kind: 'monthly', installments: null }, ['parent']), paymentPeriod: verified('0~23개월. 월령에 따라 금액 변경', ['parent']), regionalPreference: verified('전국 부모급여, 지역 자체 지원 별도', ['parent']), childcareConditions: verified('어린이집·종일제 돌봄 이용 시 바우처와 현금 차액 처리. 월 전액 현금으로 합산하지 않음', ['parent']),
    policyStatuses: ['current'], confirmation: currentConfirmation, badge: '공식', sourceIds: ['parent'], checkedAt: CBC_META.checkedAt, recheckItems: ['2027년 기존 출생아 보육료·차액 지급 기준'],
  },
  {
    id: 'child-allowance', version: 'current-2026', name: '아동수당', applicableTarget: verified('2026년 9세 미만. 이후 연도별 대상 연령 확대', ['child']), applicableBirthDate: pending('세부 연령·출생연도 특례는 현행법·사업안내 확인', ['child']),
    amounts: verified([amount(100000, '기본 지급액', 'monthly', 'child')], ['child']), paymentCycle: verified({ kind: 'monthly', installments: null }, ['child']), paymentPeriod: verified('2027년 10세 미만 → 2028년 11세 미만 → 2029년 12세 미만 → 2030년 13세 미만', ['child']),
    regionalPreference: verified('비수도권·인구감소지역 월 5천~2만원 추가. 인구감소지역 상품권 지급 시 월 1만원 추가, 지역 유형·조례 확인', ['child']), childcareConditions: verified('0~1세 부모급여와 별도. 지역별 지급수단 확인', ['child']),
    policyStatuses: ['current'], confirmation: currentConfirmation, badge: '공식', sourceIds: ['child'], checkedAt: CBC_META.checkedAt, recheckItems: ['거주지역 유형·상품권 지급 조례', '연령 특례'],
  },
  {
    id: 'welcome-grant', version: 'proposal-2027', name: '아이맞이지원금', applicableTarget: verified('적용 출생아, 출생순위·우대지역에 따른 지원안', ['welcome']), applicableBirthDate: proposalDates,
    amounts: verified((['general', 'preferred'] as const).flatMap(region => ([['first', 10000000, 15000000], ['second', 12000000, 17000000], ['thirdOrMore', 15000000, 20000000]] as const).map(([birthOrder, general, preferred]) => amount(region === 'general' ? general : preferred, `${region === 'general' ? '일반지역' : '우대지역'} ${birthOrder === 'first' ? '첫째' : birthOrder === 'second' ? '둘째' : '셋째 이상'}`, 'total', 'welcome', { birthOrder, region, cashWon: verified(region === 'general' ? general : preferred, ['qa']), voucherWon: verified(0, ['qa']) }))), ['welcome', 'qa']),
    paymentCycle: verified({ kind: 'quarterly', installments: 4 }, ['qa']), paymentPeriod: verified('출생 후 1년 동안 분기별 4회 현금 지급안. 1회 지급액은 재확인 필요', ['qa']), regionalPreference: regionPending, childcareConditions: pending('보육 형태별 세부 적용 조건은 시행안 재확인', ['reform']),
    policyStatuses: ['budgetProposal', 'lawAmendmentRequired'], confirmation: proposalConfirmation, badge: '공식', sourceIds: ['welcome', 'qa', 'reform'], checkedAt: CBC_META.checkedAt, recheckItems: ['회차별 금액·지급 시작월', '우대지역·거주 판정', '출생순위·다태아', '신청방법·경과규정'],
  },
  {
    id: 'basic-child-benefit', version: 'proposal-2027', name: '아동기본수당', applicableTarget: verified('신규 적용 출생아. 2030년까지 13세 미만으로 단계 확대하는 안내', ['qa']), applicableBirthDate: proposalDates,
    amounts: verified([amount(200000, '일반지역', 'monthly', 'reform', { region: 'general', cashWon: verified(100000, ['reform']), voucherWon: verified(100000, ['reform']) }), amount(300000, '우대지역', 'monthly', 'reform', { region: 'preferred', cashWon: verified(150000, ['reform']), voucherWon: verified(150000, ['reform']) })], ['reform']),
    paymentCycle: verified({ kind: 'monthly', installments: null }, ['reform']), paymentPeriod: verified('2030년 13세 미만까지 단계 확대 안내. 기존 출생아의 신규 전환을 의미하지 않음', ['qa']), regionalPreference: regionPending, childcareConditions: verified('0~1세 가정보육 시 월 30만원 추가안. 어린이집 이용 시 가정보육 추가 미적용', ['qa']),
    policyStatuses: ['budgetProposal', 'lawAmendmentRequired'], confirmation: proposalConfirmation, badge: '공식', sourceIds: ['reform', 'qa'], checkedAt: CBC_META.checkedAt, recheckItems: ['연령·출생 코호트 경과규정', '우대지역·주소 판정', '신청방법'],
  },
  {
    id: 'homecare-extra', version: 'proposal-2027', name: '0~1세 가정보육 추가 지원', applicableTarget: verified('어린이집을 이용하지 않고 가정보육하는 0~1세 신규 적용 아동', ['qa']), applicableBirthDate: proposalDates,
    amounts: verified([amount(300000, '가정보육 추가액', 'monthly', 'qa', { childcare: 'home' })], ['qa']), paymentCycle: verified({ kind: 'monthly', installments: null }, ['qa']), paymentPeriod: verified('0~1세 가정보육 기간', ['qa']), regionalPreference: verified('일반·우대지역 모두 월 30만원 추가안', ['qa']), childcareConditions: pending('전환월·시간제보육·종일제 아이돌봄 병행 판정 재확인', ['qa']),
    policyStatuses: ['budgetProposal', 'lawAmendmentRequired'], confirmation: proposalConfirmation, badge: '공식', sourceIds: ['qa'], checkedAt: CBC_META.checkedAt, recheckItems: ['추가액 지급수단', '보육 형태·전환월·다른 돌봄 판정'],
  },
];
export const CBC_TRANSITION = {
  previous: verified({ from: null, through: '2027-06-30' }, ['reform'], '기존 체계 유지라는 정부 발표안'),
  next: proposalDates, confirmation: proposalConfirmation,
  recheckItems: ['최종 부칙·예외·소급 기준', '신청일·실제 출생일 기준', '기존 출생아의 향후 연령 적용'],
};
export const CBC_HOME_TOTALS = verified([{ region: 'general', amountWon: 500000 }, { region: 'preferred', amountWon: 600000 }], ['qa'], '정부 Q&A의 수당 합계. 보육료·현금 입금액 합계가 아님');
export const CBC_POLICY_BY_ID = Object.fromEntries(CBC_POLICIES.map(policy => [policy.id, policy])) as Record<string, PolicyRecord>;
export const formatAmount = (value: number | null) => value === null ? '재확인 필요' : `${(value / 10000).toLocaleString('ko-KR')}만원`;
export const evidenceText = (evidence: Evidence<string>) => evidence.value ?? '재확인 필요';
export const policyAmountText = (id: string) => {
  const rows = CBC_POLICY_BY_ID[id].amounts.value;
  return rows?.map(row => `${row.label} ${row.basis === 'monthly' ? '월 ' : '총 '}${formatAmount(row.amountWon)}`).join(' / ') ?? '재확인 필요';
};
export const CBC_COMPARISON = [
  { id: 'birth', label: '출생 초기 지원', currentPolicyIds: ['first-meeting'], proposalPolicyIds: ['welcome-grant'], changeSummary: '전체 급여 체계 개편의 초기 지원. 바우처와 분기별 현금의 차이', recheckItems: ['회차별 지급액·신청요건'] },
  { id: 'infant', label: '0~1세 지원', currentPolicyIds: ['parent-benefit', 'child-allowance'], proposalPolicyIds: ['basic-child-benefit', 'homecare-extra'], changeSummary: '아이맞이지원금의 초기 총액과 월 수당을 함께 읽기', recheckItems: ['보육 형태·전환월·차액 지급'] },
  { id: 'older', label: '2세 이후 기본 수당', currentPolicyIds: ['child-allowance'], proposalPolicyIds: ['basic-child-benefit'], changeSummary: '기본 월액·지급수단 변경안. 대상 연령은 단계 확대', recheckItems: ['출생 코호트별 경과규정'] },
  { id: 'region', label: '지역 우대', currentPolicyIds: ['child-allowance'], proposalPolicyIds: ['welcome-grant', 'basic-child-benefit'], changeSummary: '아이맞이지원금 총액 +500만원·기본수당 월 +10만원의 지역 우대안', recheckItems: ['우대지역 명단·거주기간·전입/전출 판정'] },
  { id: 'age', label: '지급 대상 연령', currentPolicyIds: ['child-allowance'], proposalPolicyIds: ['basic-child-benefit'], changeSummary: '현행 연령 확대와 신규 급여 적용 출생아를 구분', recheckItems: ['최종 법령·코호트 경과규정'] },
];
const welcomeValues = CBC_POLICY_BY_ID['welcome-grant'].amounts.value;
export const CBC_SUMMARY = [
  { label: '적용 예정 출생일', value: CBC_TRANSITION.next.value?.from ? `${CBC_TRANSITION.next.value.from.replaceAll('-', '.')} 이후` : '재확인 필요', note: '정부 개편안 기준. 출산 예정일이 아닌 실제 출생일' },
  { label: '아이맞이지원금 최대액', value: `총 ${formatAmount(welcomeValues?.length ? Math.max(...welcomeValues.map(row => row.amountWon)) : null)}`, note: '셋째 이상·우대지역의 총액안. 출생 후 1년간 분기 4회' },
  { label: '아동기본수당', value: CBC_POLICY_BY_ID['basic-child-benefit'].amounts.value?.map(row => `월 ${formatAmount(row.amountWon)}`).join(' / ') ?? '재확인 필요', note: '일반 / 우대지역. 현금·지역상품권 혼합, 가정보육 추가 별도' },
  { label: '가장 큰 변경점', value: '3개 → 2개 체계', note: '기존 출생아는 기존 지원 체계를 유지하는 안' },
];
export const CBC_RECHECK = ['국회 2027 예산 확정', '아동수당법 등 관련 법 개정과 경과규정', '보건복지부 세부 시행안·보육 판정', '우대지역 명단·거주 기준', '지급 신청방법·지급일·회차별 금액'];
export const CBC_CTA = { supports2027Proposal: false, href: '/tools/birth-support-money/', label: '기존 제도 기준 출산지원금 계산하기', note: '현재 연결된 계산기는 2026 기준입니다. 2027 개편안 계산을 제공하는 도구로 해석하지 마세요.' };
export const CBC_RELATED = [
  { href: CBC_CTA.href, label: CBC_CTA.label },
  { href: '/tools/pregnancy-birth-cost/', label: '임신·출산 비용도 함께 계산하기' },
  { href: '/tools/parental-leave-short-work-calculator/', label: '육아휴직·단축근무 소득 확인하기' },
  { href: '/reports/birth-support-by-region-2026/', label: '2026 기준 지역별 출산지원금 비교' },
];
export const CBC_CRITERIA = ['현행 제도와 공식 발표된 2027 정부 개편안을 분리합니다.', '출처의 공식 여부와 지급 조건의 확정 여부는 다른 기준입니다.', '총액·월액·현금·바우처·지역상품권을 구분해 읽으세요.', '미확인 경과규정·우대지역·신청방법은 재확인 필요로 표시합니다.'];
export const CBC_CHANGELOG = [{ date: '2026-10-07', text: '공식 발표·현행 안내 대조. 신규 급여는 정부 개편안으로 표시하고 미확인 조건을 분리했습니다.' }];

export function validateReportData(policies: PolicyRecord[] = CBC_POLICIES, sources: SourceRecord[] = CBC_SOURCES): void {
  const ids = new Set<string>();
  const sourceIds = new Set(sources.map(source => source.id));
  if (sourceIds.size !== sources.length) throw new Error('공식 출처 ID 중복');
  const checkEvidence = (evidence: Evidence<unknown>) => {
    if (evidence.sourceIds.some(id => !sourceIds.has(id))) throw new Error('존재하지 않는 출처 참조');
    if (evidence.status === 'verified' && (evidence.value === null || !evidence.sourceIds.length)) throw new Error('검증된 항목의 값·출처 누락');
  };
  for (const policy of policies) {
    if (ids.has(policy.id)) throw new Error('정책 ID 중복');
    ids.add(policy.id);
    if (policy.sourceIds.some(id => !sourceIds.has(id))) throw new Error('정책 출처 참조 오류');
    for (const evidence of [policy.applicableTarget, policy.applicableBirthDate, policy.amounts, policy.paymentCycle, policy.paymentPeriod, policy.regionalPreference, policy.childcareConditions]) checkEvidence(evidence);
    const range = policy.applicableBirthDate.value;
    if (range?.from && range.through && range.from > range.through) throw new Error('출생일 범위 역전');
    for (const row of policy.amounts.value ?? []) {
      if (!Number.isSafeInteger(row.amountWon) || row.amountWon < 0) throw new Error('지원 금액 오류');
      for (const payment of [row.cashWon, row.voucherWon]) {
        checkEvidence(payment);
        if (payment.value !== null && (!Number.isSafeInteger(payment.value) || payment.value < 0)) throw new Error('지급수단 금액 오류');
      }
      if (row.cashWon.value !== null && row.voucherWon.value !== null && row.cashWon.value + row.voucherWon.value !== row.amountWon) throw new Error('지급수단 합계 불일치');
    }
    if (policy.policyStatuses.includes('budgetProposal') && policy.confirmation.budget !== 'proposal') throw new Error('예산안 상태 불일치');
    if (!['공식', '참고', '시뮬레이션', '추정'].includes(policy.badge)) throw new Error('허용하지 않은 데이터 배지');
  }
  if (policies === CBC_POLICIES) for (const row of CBC_COMPARISON) for (const id of [...row.currentPolicyIds, ...row.proposalPolicyIds]) if (!ids.has(id)) throw new Error('비교 행 정책 참조 오류');
}
validateReportData();

export const CBC_INTRO = [
  "2027년 출산을 준비한다면 출산 직후의 지원금뿐 아니라 아이가 자라는 동안 받는 수당도 함께 살펴봐야 합니다. 정부는 출생 초기에 집중되는 지원과 성장기 지원을 다시 구성하는 개편안을 발표했습니다. 이 리포트는 2027 부모급여와 아동수당이 어떻게 달라지는지 궁금한 예비 부모와 이미 아이를 양육하는 보호자를 위해, 기존 제도와 신규 제도의 연결 관계를 먼저 정리합니다. 출산지원금 총액과 월 지급액은 서로 다른 기준으로 읽어야 합니다.",
  "현재 익숙한 첫만남이용권·부모급여·아동수당은 지급 대상과 시기, 지급 방식이 서로 다릅니다. 개편안에서는 아이맞이지원금과 아동기본수당이라는 체계로 지원을 재구성할 예정입니다. 다만 부모급여가 모든 가구에서 동시에 사라지거나 기존 아동수당 수급자가 모두 같은 금액으로 바뀐다는 의미는 아닙니다. 기존 출생아와 신규 적용 출생아를 구분하고, 현금과 바우처·지역사랑상품권의 차이까지 확인해야 가계에서 실제로 사용할 수 있는 지원을 이해할 수 있습니다.",
  "정부 발표안의 중요한 기준은 2027년 7월 1일 이후 출생 여부입니다. 6월 30일까지 태어난 아이는 기존 지원 체계를 유지하고, 7월 1일 이후 태어난 아이부터 개편 제도를 적용할 예정이라고 안내했습니다. 따라서 같은 2027년생이라도 적용 제도가 다를 수 있으며, 2026년생도 신규 수당으로 자동 전환된다고 이해해서는 안 됩니다. 이 페이지에서는 출산 예정월 대신 발표안의 출생일 경계를 보여주고, 출생순위·지역·보육 형태에 따라 달라지는 항목을 나누어 설명합니다.",
  "여기에 정리한 신규 급여는 2026년 10월 7일에 확인한 정부 발표와 2027년 예산안 기준입니다. 공식기관이 발표한 수치라는 사실과 최종 시행 조건이 확정됐다는 사실은 다릅니다. 국회 예산 심의, 관련 법 개정, 보건복지부 시행안과 우대지역 기준, 신청방법이 공개되면 적용 대상과 세부 조건을 다시 확인해야 합니다. 아직 확인하지 못한 항목은 재확인 필요로 남기며 임의로 예상하지 않습니다. 실제 신청 전에는 최신 공식 공고와 거주지 담당 기관의 안내를 확인하세요."
];
export const CBC_FAQ = [
  {
    "question": "2027 부모급여는 없어지나요?",
    "answer": "모든 가구의 부모급여가 동시에 없어지는 것으로 발표된 것은 아닙니다. 발표안은 출생일에 따라 기존 지원 유지와 신규 급여 개편을 구분하므로 적용 대상과 최종 경과규정을 확인해야 합니다."
  },
  {
    "question": "2027 아동수당은 얼마인가요?",
    "answer": "기존 아동수당과 신규 아동기본수당을 나누어 확인해야 합니다. 신규 제도는 월 20만원·우대지역 30만원의 정부안이며, 기존 수급자의 금액을 일괄 20만원으로 바꿔 설명하지 않습니다."
  },
  {
    "question": "아이맞이지원금은 누가 받나요?",
    "answer": "정부안은 2027년 7월 1일 이후 출생아를 대상으로 출생순위·지역에 따라 지원하는 방향입니다. 실제 자격·신청 요건은 최종 법령과 사업안내를 확인해야 합니다."
  },
  {
    "question": "아동기본수당은 몇 살까지 받나요?",
    "answer": "정부 안내에는 2030년까지 13세 미만으로 단계 확대하는 대상 연령이 설명돼 있습니다. 2027년에 모든 연령·출생 코호트가 신규 수당을 받는다는 뜻은 아니며 기존 아동수당의 현행 연령 확대와 신규 급여 적용을 구분해야 합니다."
  },
  {
    "question": "2027년 6월생과 7월생은 뭐가 다른가요?",
    "answer": "정부안은 6월 30일까지 출생아의 기존 체계 유지와 7월 1일 이후 출생아의 신규 체계 적용을 구분합니다. 특정 가구의 총액 차이나 소급 여부는 최종 경과규정 없이 추정하지 않습니다."
  },
  {
    "question": "2026년생도 아동기본수당을 받을 수 있나요?",
    "answer": "현재 발표안에서는 이전 출생아가 기존 지원 체계를 유지하는 방향으로 안내돼 있습니다. 2026년생이 2027년에 신규 수당으로 자동 전환된다고 확정할 수 없으며, 연령에 맞는 기존 급여와 후속 경과규정을 확인해야 합니다."
  },
  {
    "question": "둘째·셋째는 얼마를 더 받나요?",
    "answer": "아이맞이지원금 발표 총액은 일반지역 첫째 1,000만원·둘째 1,200만원·셋째 이상 1,500만원입니다. 우대지역은 각각 500만원 추가하는 안이며 이는 월액이나 한 번에 지급하는 금액이 아닙니다."
  },
  {
    "question": "인구감소지역은 얼마나 더 받나요?",
    "answer": "개편안의 우대지역은 아이맞이지원금 총액 500만원과 아동기본수당 월 10만원을 추가하는 구조입니다. 기존 인구감소지역 목록과 신규 우대지역이 같다고 단정할 수 없으므로 최종 지정 기준을 확인해야 합니다."
  },
  {
    "question": "가정보육을 하면 얼마가 추가되나요?",
    "answer": "0~1세 가정보육 아동에게 월 30만원을 추가하는 안입니다. 정부 Q&A는 기본수당을 포함해 일반지역 월 50만원·우대지역 월 60만원을 안내하며, 보육 판정과 지급수단의 세부 조건은 재확인해야 합니다."
  },
  {
    "question": "언제 최종 확정되나요?",
    "answer": "정부 발표만으로 최종 지급 조건까지 확정됐다고 볼 수 없습니다. 국회 예산 확정, 법 개정과 세부 시행안 공개를 차례로 확인하고, 아직 발표되지 않은 정확한 확정일·신청 개시일은 예상하지 않습니다."
  }
];
