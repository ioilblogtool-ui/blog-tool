export const OS_META = {
  slug: 'overseas-stock-capital-gains-tax-calculator',
  title: '해외주식 양도소득세 계산기 2026',
  seoTitle: '해외주식 양도소득세 계산기 2026 | 손익통산·매도 시나리오 비교 - 비교계산소',
  description: '해외주식의 원화 기준 실현이익과 손실을 계좌별로 합산해 예상 양도소득세를 계산하세요. 추가 이익·손실 실현 시 세금 차이와 기본공제 적용 결과를 비교합니다.',
  checkedAt: '2026-11-10',
};

// 일반 세율·다른 조정 없는 2026 귀속 사례만 사용. 세액공제/기납부액은 대상 판정에서 제외.
// 국세와 지방세는 같은 과세표준에 각각 계산하고, 각 납부세액의 10원 미만을 버린다.
export const OS_RULE = {
  id: 'overseas-stock-general-2026-v1', status: 'cross_checked', taxYear: 2026,
  deductionWon: '2500000', nationalRate: { num: '20', den: '100' },
  localRate: { num: '2', den: '100' }, localTaxBasis: 'taxable_income',
  nationalRounding: { kind: 'floor', unitWon: '10' }, localRounding: { kind: 'floor', unitWon: '10' },
  sourceIds: ['nts-calculation', 'local-rate', 'national-rounding', 'local-rounding'],
};
export const OS_CONFIG = { rule: OS_RULE, maxAmountWon: '1000000000000', maxRows: 20 };
export const OS_ELIGIBILITY = [
  { name: 'asset', label: '계산할 상품', options: [ ['overseas_listed_stock_or_etf','해외 상장 주식·ETF'], ['domestic_listed_etf','국내 상장 ETF'], ['other','그 밖의 상품'] ] },
  { name: 'residency', label: '국외주식 과세대상 거주 요건', options: [ ['eligible','공식 안내를 확인했고 해당합니다'], ['ineligible','해당하지 않습니다'], ['unknown','확인하지 못했습니다'] ] },
  { name: 'standardRate', label: '일반 국세 세율 20% 적용 대상', options: [ ['yes','일반 20% 대상임을 확인했습니다'], ['no','다른 세율 대상입니다'], ['unknown','확인하지 못했습니다'] ] },
  { name: 'mixedDomesticTaxableStock', label: '같은 해 국내 과세대상 주식 양도손익', options: [ ['no','없습니다'], ['yes','있습니다'], ['unknown','확인하지 못했습니다'] ] },
  { name: 'specialTaxAdjustment', label: '특례·외국납부세액공제·기납부세액 등 별도 조정', options: [ ['no','없습니다'], ['yes','있습니다'], ['unknown','확인하지 못했습니다'] ] },
] as const;

export const OS_EXAMPLES = [
  { label: '공제 이하', gain: 2000000, loss: 0, base: 0, national: 0, local: 0, total: 0 },
  { label: '공제와 같음', gain: 2500000, loss: 0, base: 0, national: 0, local: 0, total: 0 },
  { label: '이익 1천만원', gain: 10000000, loss: 0, base: 7500000, national: 1500000, local: 150000, total: 1650000 },
  { label: '손실 통산', gain: 10000000, loss: 3000000, base: 4500000, national: 900000, local: 90000, total: 990000 },
  { label: '순손실', gain: 2000000, loss: 4000000, base: 0, national: 0, local: 0, total: 0 },
];
export const OS_INTRO = [
  '해외주식 세금은 현재 계좌의 평가수익률보다 같은 해에 실제로 확정한 원화 손익을 먼저 확인해야 합니다. 이 계산기는 일반 세율이 적용되는 해외 상장 주식과 ETF의 실현이익·실현손실을 합산하고, 기본공제를 적용한 뒤 국세와 지방소득세를 나눠 보여줍니다. 증권사의 양도소득 계산 자료를 준비해 입력하세요. 달러 평가손익에 현재 환율만 곱하면 취득·양도 시점의 원화 손익과 달라질 수 있습니다.',
  '여러 증권사를 이용해도 기본공제를 계좌마다 반복해서 적용하지 않습니다. 합계 입력으로 올해 전체 손익을 한 번에 넣거나 계좌별 입력으로 각 자료를 나눠 넣을 수 있습니다. 계좌별 입력은 최대 20행을 지원하며 회사명이나 계좌번호는 받지 않습니다. 전부 비어 있는 행은 제외하고, 명시한 0원은 실제 입력으로 처리합니다. 손실은 양수로 넣으면 계산 과정에서 차감하며 이미 반영한 수수료는 다시 차감하지 않아야 합니다.',
  '추가 매도 시나리오는 기준 손익에 앞으로 실현한다고 가정한 이익·손실과 미반영 적격 비용을 더한 뒤 같은 규칙으로 다시 계산합니다. 전후 세액의 차이는 세금 변화일 뿐 매매로 얻는 순이익이 아닙니다. 손실을 실현해 세금이 줄더라도 그 손실 전체가 보전되지는 않으며 가격 변동과 거래 비용도 따로 검토해야 합니다. 기준 입력을 수정하면 기존 결과를 숨기고 다시 계산한 조건으로만 시나리오를 비교합니다.',
  '이 페이지는 2026 귀속 일반 사례의 예상 세액 비교를 위한 도구입니다. 국내 상장 해외 ETF, 배당·파생상품, 국내 과세대상 주식 혼합, 별도 세율·특례·외국납부세액공제·기납부세액은 지원하지 않습니다. 국외주식 과세대상 거주 요건을 먼저 확인하고 불명확하면 일반 계산을 진행하지 마세요. 연말 거래의 귀속연도는 결제일과 증권사 공지를 확인해야 하며 세금이 0이라는 결과만으로 신고 의무가 없다고 판단해서는 안 됩니다.',
];
export const OS_FAQ = [
  { question: '미국주식만 계산할 수 있나요?', answer: '미국에 한정하지 않지만 일반 국세 20%가 적용되는 해외 상장 주식·ETF만 지원합니다. 중소기업 주식 등 다른 세율이나 특정주식 등 다른 과세체계는 지원하지 않습니다.' },
  { question: '증권사마다 250만원씩 공제하나요?', answer: '아닙니다. 이 계산기는 같은 사람의 같은 해 지원 대상 손익을 합산하고 기본공제 250만원을 한 번 적용합니다. 국내 과세대상 주식까지 있다면 공제 공유와 손익통산을 별도로 검토해야 하므로 일반 모드에서 제외합니다.' },
  { question: '평가손실도 손익통산에 넣나요?', answer: '아직 매도하지 않은 평가손익은 올해 실현손익에 넣지 않습니다. 추가 실현 시나리오에 넣는 경우에도 매도가 실제 완료된 것으로 간주하거나 권유하지 않습니다.' },
  { question: '배당금이나 국내 상장 해외 ETF도 넣나요?', answer: '배당금·이자와 국내 상장 ETF는 이 계산기의 일반 해외주식 양도소득 계산 대상이 아닙니다. 상품별 과세체계와 계좌 특례를 별도로 확인하세요.' },
  { question: '작년 손실을 올해 손실에 더해도 되나요?', answer: '이 도구에는 전년도 손실 이월 기능이 없습니다. 같은 2026 귀속의 지원 대상 실현손익만 넣으세요. 순손실이어도 음수 세금이나 자동 환급액을 만들지 않습니다.' },
  { question: '수수료는 어디에 입력하나요?', answer: '기본값은 입력 손익에 비용이 이미 반영된 상태입니다. 아직 반영하지 않은 세법상 적격 필요경비만 별도 비용으로 선택해 넣으세요. 이미 차감한 수수료와 취득가액을 다시 넣지 마세요.' },
  { question: '12월 31일에 팔면 올해 귀속인가요?', answer: '매도 주문일만으로 확정하지 않습니다. 거래 시장의 결제일·휴장일·한국 시간 차이와 증권사 연말 공지에서 해당 연도 귀속 여부를 확인하세요. 이 계산기는 시장별 매도 마감일을 계산하지 않습니다.' },
  { question: '세금이 0원이면 신고하지 않아도 되나요?', answer: '계산 결과만으로 신고 의무를 판단하지 않습니다. 국외주식은 예정신고와 구분되는 확정신고 체계를 확인해야 합니다. 국세청 최신 안내와 본인 거래·신고 내역을 확인하세요.' },
  { question: '환율은 무엇을 입력하나요?', answer: '원화로 확인한 실현 양도손익만 입력하므로 환율 입력란은 없습니다. 증권사 양도소득 계산 자료를 확인하세요. 현재 환율로 과거 손익을 자동 재구성하지 않습니다.' },
  { question: '세금이 줄어드는 금액이 투자 이익인가요?', answer: '아닙니다. 세액 감소는 손실을 보전하는 투자수익이 아닙니다. 시나리오는 세금 변화만 비교하며 매매손실·수수료·가격 변동과는 별개입니다.' },
  { question: '공제 잔여액이 손실만큼 커지나요?', answer: '일반 모드 공제 잔여액은 최대 250만원입니다. 순손실을 상쇄할 추가 이익 범위와 남은 기본공제는 서로 다른 개념이며 이 도구는 둘을 합쳐 표시하지 않습니다.' },
  { question: '입력값을 저장하거나 공유하나요?', answer: '입력값과 결과는 브라우저 메모리에서만 처리합니다. 저장소나 공유 주소에 포함하지 않으며 주소 복사는 입력 없는 페이지 주소만 제공합니다. 새로고침하면 입력이 초기화됩니다.' },
];
export const OS_RELATED = [
  { href: '/tools/us-stock-exchange-profit-calculator/', label: '미국주식 환율에 따른 손익 비교 · 세금 계산과 별개' },
  { href: '/tools/domestic-stock-capital-gains-tax/', label: '국내주식 양도소득세 · 별도 적용대상 확인' },
  { href: '/reports/2026-year-end-tax-saving-guide/', label: '급여 연말정산 체크리스트 · 해외주식 양도세 신고와 별도 절차' },
];
export const OS_SOURCES = [
  { id: 'nts-calculation', label: '국세청 주식 세액계산요령', href: 'https://webtv.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=8800&mi=12274', scope: '국외주식 과세대상 거주 요건, 손익통산, 기본공제·일반 세율' },
  { id: 'local-rate', label: '지방세법 제103조의3', href: 'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=03&joNo=0103&lsiSeq=282559&urlMode=lsScJoRltInfoR', scope: '일반 국외주식 과세표준 기준 지방소득세 2% · 다른 세율 제외' },
  { id: 'national-rounding', label: '국고금 관리법 제47조', href: 'https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1031453583', scope: '국세 과세표준 원 미만, 납부세액 10원 미만 끝수 처리' },
  { id: 'local-rounding', label: '지방세기본법 제59조', href: 'https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011177', scope: '지방자치단체 징수금 끝수 계산에 국고금 관리법 준용' },
  { id: 'filing', label: '국세청 주식 양도소득세 신고 안내', href: 'https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?nttSn=1353905', scope: '국외주식은 예정신고 제외, 확정신고 안내 확인' },
];
