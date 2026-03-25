// salaryTierData.ts
// 2026 전 업종 영끌 연봉 티어 계산기 — 데이터

export type TierKey = 's' | 'a' | 'b' | 'c';
export type CatKey  = 'semi' | 'car' | 'it' | 'chem' | 'fin' | 'for';

export type TierCompany = {
  name: string;
  sal: number;    // 만원, 영끌 연봉 추정
  cat: CatKey;
  tier: TierKey;
  note?: string;  // 예: 'OPI 포함', '사업부별 상이'
};

export const SALARY_TIER_META = {
  title: '연봉 티어 계산기 — 내 연봉 상위 몇 %? S·A·B·C 티어 확인 [2026]',
  subtitle:
    '반도체·완성차·IT·화학·금융·외국계 70개+ 기업 영끌 연봉을 S/A/B/C 티어로 분류. 내 연봉을 입력하면 전체 상위 %와 비슷한 기업을 바로 확인합니다.',
  methodology:
    '현직자 커뮤니티·블라인드·잡플래닛 기반 추정치입니다. 공식 자료가 아닙니다.',
  caution:
    '야근·특수수당 제외, 계약연봉+현금성 성과급(OPI) 기준. 실제 연봉과 다를 수 있습니다.',
  updatedAt: '2026년 3월 기준',
};

export const TIER_META: Record<TierKey, { label: string; range: string; color: string }> = {
  s: { label: 'S티어 · 9,000만원 이상',    range: '9,000만 ~',       color: '#9FE1CB' },
  a: { label: 'A티어 · 6,000 — 9,000만원', range: '6,000 — 9,000만', color: '#C0DD97' },
  b: { label: 'B티어 · 5,000 — 6,500만원', range: '5,000 — 6,500만', color: '#D3D1C7' },
  c: { label: 'C티어 · 5,000만원 미만',     range: '— 5,000만',       color: '#FAC775' },
};

export const CAT_LABEL: Record<CatKey, string> = {
  semi: '반도체',
  car:  '완성차·조선·방산',
  it:   'IT·플랫폼',
  chem: '화학·에너지',
  fin:  '금융·유통',
  for:  '외국계',
};

export const SALARY_TIER_DATA: TierCompany[] = [
  { name: 'SK하이닉스',          sal: 15000, cat: 'semi', tier: 's', note: 'OPI 포함' },
  { name: 'ASML',                 sal: 13000, cat: 'for',  tier: 's', note: '외국계' },
  { name: '현대자동차',           sal: 9500,  cat: 'car',  tier: 's' },
  { name: '기아',                 sal: 9500,  cat: 'car',  tier: 's' },
  { name: '현대모비스',           sal: 9500,  cat: 'car',  tier: 's' },
  { name: '한화에어로(LS·PGM)',   sal: 9500,  cat: 'semi', tier: 's' },
  { name: '삼성바이오로직스',     sal: 9000,  cat: 'chem', tier: 's' },
  { name: 'HD현대일렉트릭',       sal: 9000,  cat: 'car',  tier: 's' },
  { name: 'HD한국조선해양',       sal: 9000,  cat: 'car',  tier: 's' },
  { name: '삼성전자 DX(MX)',      sal: 8500,  cat: 'semi', tier: 'a', note: '50% 기준' },
  { name: '현대글로비스',         sal: 8500,  cat: 'car',  tier: 'a' },
  { name: '현대로템',             sal: 8500,  cat: 'car',  tier: 'a' },
  { name: '한화비전',             sal: 8500,  cat: 'semi', tier: 'a' },
  { name: 'HD현대삼호',           sal: 8500,  cat: 'car',  tier: 'a' },
  { name: '삼성전자 DS',          sal: 8000,  cat: 'semi', tier: 'a', note: '47% 기준' },
  { name: 'SK텔레콤',             sal: 8000,  cat: 'it',   tier: 'a' },
  { name: '현대위아',             sal: 8000,  cat: 'car',  tier: 'a' },
  { name: '현대건설',             sal: 8000,  cat: 'car',  tier: 'a' },
  { name: '포스코인터내셔널',     sal: 8000,  cat: 'chem', tier: 'a' },
  { name: 'HD현대중공업',         sal: 8000,  cat: 'car',  tier: 'a' },
  { name: 'S-OIL',               sal: 8000,  cat: 'chem', tier: 'a' },
  { name: '셀트리온',             sal: 8000,  cat: 'chem', tier: 'a' },
  { name: '한국항공우주(KAI)',    sal: 8000,  cat: 'car',  tier: 'a' },
  { name: '삼성전자 DX(생기연)',  sal: 7500,  cat: 'semi', tier: 'a', note: '36~39%' },
  { name: '삼성물산',             sal: 7500,  cat: 'chem', tier: 'a' },
  { name: '삼성디스플레이',       sal: 7500,  cat: 'semi', tier: 'a' },
  { name: '현대트랜시스',         sal: 7500,  cat: 'car',  tier: 'a' },
  { name: '한화엔진',             sal: 7500,  cat: 'car',  tier: 'a' },
  { name: 'HD현대건설기계',       sal: 7500,  cat: 'car',  tier: 'a' },
  { name: 'LIG넥스원',            sal: 7500,  cat: 'car',  tier: 'a' },
  { name: 'KB국민은행',           sal: 7500,  cat: 'fin',  tier: 'a' },
  { name: '현대해상',             sal: 7500,  cat: 'fin',  tier: 'a' },
  { name: 'SK실트론',             sal: 7000,  cat: 'semi', tier: 'a' },
  { name: 'SK온',                 sal: 7000,  cat: 'chem', tier: 'a' },
  { name: '현대오토에버',         sal: 7000,  cat: 'it',   tier: 'a' },
  { name: '현대제철',             sal: 7000,  cat: 'chem', tier: 'a' },
  { name: 'LG전자(HS)',           sal: 7000,  cat: 'car',  tier: 'a' },
  { name: 'LG이노텍(광학)',       sal: 7000,  cat: 'semi', tier: 'a' },
  { name: 'LG유플러스',           sal: 7000,  cat: 'it',   tier: 'a' },
  { name: '포스코',               sal: 7000,  cat: 'chem', tier: 'a' },
  { name: 'GS칼텍스',             sal: 7000,  cat: 'chem', tier: 'a' },
  { name: 'GS건설',               sal: 7000,  cat: 'chem', tier: 'a' },
  { name: '두산에너빌리티',       sal: 7000,  cat: 'car',  tier: 'a' },
  { name: 'HMM',                  sal: 7000,  cat: 'chem', tier: 'a' },
  { name: '네이버',               sal: 7000,  cat: 'it',   tier: 'a' },
  { name: '넥슨',                 sal: 7000,  cat: 'it',   tier: 'a' },
  { name: 'KT',                   sal: 7000,  cat: 'it',   tier: 'a' },
  { name: 'LG전자',               sal: 6500,  cat: 'car',  tier: 'b' },
  { name: 'LG CNS',               sal: 6500,  cat: 'it',   tier: 'b' },
  { name: 'LG이노텍',             sal: 6500,  cat: 'semi', tier: 'b', note: '광학 외' },
  { name: '한화오션',             sal: 6500,  cat: 'car',  tier: 'b' },
  { name: 'LS전선',               sal: 6500,  cat: 'chem', tier: 'b' },
  { name: '두산밥캣',             sal: 6500,  cat: 'car',  tier: 'b' },
  { name: '카카오',               sal: 6500,  cat: 'it',   tier: 'b' },
  { name: '고려아연',             sal: 6500,  cat: 'chem', tier: 'b' },
  { name: 'CJ올리브영',           sal: 6500,  cat: 'fin',  tier: 'b' },
  { name: '대한항공',             sal: 6500,  cat: 'car',  tier: 'b' },
  { name: '삼성전자 DX(VD·DA)',   sal: 6000,  cat: 'semi', tier: 'b', note: '12% 기준' },
  { name: '삼성SDS',              sal: 6000,  cat: 'it',   tier: 'b' },
  { name: '삼성전기',             sal: 6000,  cat: 'semi', tier: 'b' },
  { name: '삼성중공업',           sal: 6000,  cat: 'car',  tier: 'b' },
  { name: 'LG에너지솔루션',       sal: 6000,  cat: 'chem', tier: 'b' },
  { name: 'LG화학',               sal: 6000,  cat: 'chem', tier: 'b' },
  { name: 'LG디스플레이',         sal: 6000,  cat: 'semi', tier: 'b' },
  { name: '롯데케미칼',           sal: 6000,  cat: 'chem', tier: 'b' },
  { name: 'CJ제일제당',           sal: 6000,  cat: 'chem', tier: 'b' },
  { name: '엔씨소프트',           sal: 6000,  cat: 'it',   tier: 'b' },
  { name: '현대엘리베이터',       sal: 6000,  cat: 'car',  tier: 'b' },
  { name: '삼성SDI',              sal: 5500,  cat: 'semi', tier: 'c' },
  { name: '한국타이어',           sal: 5500,  cat: 'car',  tier: 'c' },
  { name: '금호타이어',           sal: 5500,  cat: 'car',  tier: 'c' },
  { name: '효성중공업',           sal: 5500,  cat: 'chem', tier: 'c' },
  { name: '하이트진로',           sal: 5500,  cat: 'chem', tier: 'c' },
  { name: 'CJ대한통운',           sal: 5000,  cat: 'car',  tier: 'c' },
  { name: 'GS리테일',             sal: 5000,  cat: 'fin',  tier: 'c' },
  { name: '롯데칠성',             sal: 5000,  cat: 'chem', tier: 'c' },
  { name: '코오롱인더스트리',     sal: 5000,  cat: 'chem', tier: 'c' },
];

export const OVERALL_AVG = Math.round(
  SALARY_TIER_DATA.reduce((s, c) => s + c.sal, 0) / SALARY_TIER_DATA.length
);

export const SALARY_TIER_FAQ = [
  {
    q: '야근수당은 왜 포함하지 않나요?',
    a: '고정 OT·교대수당·현장수당은 회사마다 지급 방식이 달라 단순 비교가 불가능합니다. 계약연봉+현금성 성과급(OPI) 기준으로만 포함해야 같은 조건에서 비교할 수 있습니다.',
  },
  {
    q: '삼성전자가 사업부마다 다른 이유는?',
    a: 'DS(반도체)·DX(MX, VD/DA 등) 부문별로 성과급 비율이 다릅니다. DS 47%, DX MX 50%, VD·DA 12% 등 사업부 실적 연동 비율 차이로 영끌 연봉이 크게 달라집니다.',
  },
  {
    q: '상위 %는 어떻게 계산하나요?',
    a: '전체 기업 71개 중 내 연봉보다 낮은 기업 수의 비율을 계산합니다. 예를 들어 7,000만원을 입력하면 7,000만원 미만 기업 수 / 전체 기업 수 × 100 으로 계산됩니다.',
  },
  {
    q: '이 데이터를 이직 협상에 써도 되나요?',
    a: '현직자 커뮤니티 기반 추정치라 공식 자료가 아닙니다. 참고 수준으로 활용하되, 실제 협상에는 공채 공고·잡플래닛·링커리어 등 공식 채널 자료를 함께 확인하세요.',
  },
  {
    q: 'S티어 기업은 모두 들어가기 쉬운가요?',
    a: 'SK하이닉스·ASML·현대차 등 S티어는 경쟁률이 매우 높습니다. 특히 ASML은 채용 인원 자체가 적어 진입장벽이 높습니다. 연봉 외에도 성장 가능성, 워라밸, 업무 환경을 함께 고려하는 것이 중요합니다.',
  },
];

export const SALARY_TIER_AFFILIATE = {
  career: {
    title: '이직·연봉 협상 준비, 이 책들로 시작하세요',
    context: '연봉 비교 후 이직이나 협상을 준비하는 분들을 위한 현직자 추천 도서입니다.',
    products: [
      {
        title: '이직의 정석',
        desc: '현직자 30명의 이직 전략과 연봉 협상 노하우. 대기업→대기업 이직 케이스 집중 분석',
        tag: '이직 필독',
        url: 'https://link.coupang.com/a/eaeeGK',
      },
      {
        title: '나는 이렇게 연봉을 높였다',
        desc: '연봉 협상 실전 가이드. 언제, 어떻게, 얼마나 올릴 수 있는지 단계별 전략 수록',
        tag: '연봉 협상',
        url: 'https://link.coupang.com/a/eaegxa',
      },
      {
        title: '직장인 재테크 로드맵',
        desc: '월급쟁이가 자산을 만드는 현실적인 방법. 연봉 인상보다 중요한 지출·투자 구조화',
        tag: '재테크',
        url: 'https://link.coupang.com/a/eaelWd',
      },
    ],
  },
};
