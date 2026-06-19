export type AiStockRow = {
  rank: number;
  name: string;
  nameEn: string;
  ticker: string;
  group: 'software' | 'infra' | 'hardware';
  close: number;
  ytd: number;
  note: string;
};

// group: software=AI SaaS 하락군 / infra=플랫폼·클라우드 / hardware=비교 기준
export const STOCKS: AiStockRow[] = [
  // ─── AI 소프트웨어 / SaaS (하락) ───────────────────────────────
  { rank: 1,  name: '어도비',        nameEn: 'Adobe',         ticker: 'ADBE', group: 'software', close: 195.16,  ytd: -44, note: 'AI 이미지 생성 도구가 포토샵 시장 잠식' },
  { rank: 2,  name: '세일즈포스',    nameEn: 'Salesforce',    ticker: 'CRM',  group: 'software', close: 151.78,  ytd: -43, note: 'AI 에이전트의 CRM 기능 대체 우려' },
  { rank: 3,  name: '서비스나우',    nameEn: 'ServiceNow',    ticker: 'NOW',  group: 'software', close: 95.04,   ytd: -38, note: '엔터프라이즈 AI 전환 비용 급증' },
  { rank: 4,  name: '사운드하운드', nameEn: 'SoundHound',    ticker: 'SOUN', group: 'software', close: 7.12,    ytd: -29, note: '음성 AI 수익화 지연·실적 미달' },
  { rank: 5,  name: '팰런티어',     nameEn: 'Palantir',      ticker: 'PLTR', group: 'software', close: 128.47,  ytd: -28, note: 'P/E 300배 버블 해소·밸류에이션 조정' },
  { rank: 6,  name: '빅베어.ai',    nameEn: 'BigBear.ai',    ticker: 'BBAI', group: 'software', close: 3.92,    ytd: -27, note: '수익화 불투명·소형주 투자심리 위축' },
  { rank: 7,  name: 'C3.ai',        nameEn: 'C3.ai',         ticker: 'AI',   group: 'software', close: 10.30,   ytd: -24, note: 'CEO 교체·기업용 AI 성장 정체' },
  { rank: 8,  name: '마이크로소프트', nameEn: 'Microsoft',   ticker: 'MSFT', group: 'software', close: 379.40,  ytd: -22, note: 'Copilot 매출 기대 이하·capex 폭증' },
  { rank: 9,  name: '메타',          nameEn: 'Meta',          ticker: 'META', group: 'software', close: 577.22,  ytd: -13, note: 'LLaMA 투자 비용·광고 성장 둔화' },
  { rank: 10, name: '오라클',        nameEn: 'Oracle',        ticker: 'ORCL', group: 'software', close: 184.29,  ytd: -5,  note: '클라우드 전환 속도 기대 미달' },
  // ─── AI 인프라 / 플랫폼 (상승·선방) ────────────────────────────
  { rank: 11, name: '스노우플레이크', nameEn: 'Snowflake',    ticker: 'SNOW', group: 'infra',    close: 232.29,  ytd: 6,   note: 'AI 데이터 파이프라인 수요 회복' },
  { rank: 12, name: '아마존',        nameEn: 'Amazon',        ticker: 'AMZN', group: 'infra',    close: 244.39,  ytd: 6,   note: 'AWS AI 클라우드 성장·물류 회복' },
  { rank: 13, name: '알파벳(구글)', nameEn: 'Alphabet',       ticker: 'GOOGL', group: 'infra',   close: 368.03,  ytd: 18,  note: 'Gemini·AI 검색 광고 수익 직결' },
];

export const HARDWARE_REF = [
  { name: '샌디스크', ticker: 'SNDK', ytd: 820 },
  { name: '마이크론', ticker: 'MU',   ytd: 297 },
  { name: 'SK하이닉스', ticker: '000660', ytd: 209 },
  { name: '엔비디아', ticker: 'NVDA', ytd: 13 },
];

export const SUMMARY = {
  softwareAvgYtd: -25,   // 소프트웨어 10종목 평균
  infraAvgYtd: 10,       // 인프라 3종목 평균
  hardwareAvgYtd: 335,   // 반도체 대표 평균
  worstStock: '어도비 (ADBE)',
  worstYtd: -44,
  bestSoftware: '알파벳 (GOOGL)',
  bestSoftwareYtd: 18,
  dataDate: '2026-06-18',
};

export const REASONS = [
  {
    icon: '⚔️',
    title: 'AI가 SaaS를 잠식',
    body: '마이크로소프트 Copilot·구글 NotebookLM 등이 어도비·세일즈포스의 핵심 기능을 저가 대체. "AI 덕분에 성장"이 아닌 "AI에 의해 위협"받는 국면으로 전환됐습니다.',
  },
  {
    icon: '💸',
    title: '설비투자 비용 폭증',
    body: 'MS·Meta·구글의 2026년 AI 설비투자 합계 $1조 이상. 비용이 매출보다 빠르게 증가하면서 이익 감소 → 주가 하락의 악순환이 이어지고 있습니다.',
  },
  {
    icon: '📉',
    title: '밸류에이션 버블 해소',
    body: '2023~2025년 AI 기대감으로 P/E 200~300배까지 치솟았던 소프트웨어 주가의 현실화. 팰런티어는 연초 대비 –28%가 되었지만 여전히 P/E 100배 이상입니다.',
  },
  {
    icon: '🏆',
    title: '구글만 살아남은 이유',
    body: 'Gemini를 검색 광고에 직접 연동해 AI 투자가 즉시 수익으로 이어지는 구조. SaaS와 달리 "AI가 핵심 비즈니스를 강화"하는 유일한 빅테크였습니다.',
  },
];

export const HIGHLIGHTS = [
  {
    ticker: 'ADBE',
    name: '어도비',
    ytd: -44,
    group: 'software' as const,
    body: '포토샵·일러스트레이터 독점 기업이었지만, Midjourney·Stable Diffusion·Sora 등 AI 이미지·영상 생성 도구의 급부상으로 핵심 시장이 잠식됐습니다. 어도비 자체 AI(Firefly) 출시에도 불구하고 무료 대체재와의 경쟁에서 밀리며 주가는 연초 $350에서 $195로 –44% 하락했습니다.',
  },
  {
    ticker: 'CRM',
    name: '세일즈포스',
    ytd: -43,
    group: 'software' as const,
    body: 'CRM(고객관계관리) 시장 1위 기업이지만, AI 에이전트가 영업·CS 자동화 업무를 대체하면서 소프트웨어 구독 필요성 자체에 의문이 생겼습니다. Agentforce 출시로 반전을 노렸지만 도입 비용 대비 ROI 불확실성으로 기업 구매가 지연됐고, 주가는 –43% 급락했습니다.',
  },
  {
    ticker: 'PLTR',
    name: '팰런티어',
    ytd: -28,
    group: 'software' as const,
    body: '2025년 AI 열풍으로 P/E 300배까지 치솟았던 팰런티어는 2026년 밸류에이션 정상화 과정에서 –28% 하락했습니다. 방산·정부 계약 기반의 안정적 실적에도 불구하고 시장은 과도한 기대치를 소화 중입니다. 그나마 –28%로 소프트웨어 군 중에서는 선방한 편입니다.',
  },
  {
    ticker: 'MSFT',
    name: '마이크로소프트',
    ytd: -22,
    group: 'software' as const,
    body: 'Copilot을 Office 365에 탑재했지만 기업 도입률이 예상치를 하회했고, OpenAI에 대한 $130억 투자와 연간 $190억 규모의 AI 인프라 설비투자가 이익을 압박했습니다. "AI 투자의 열매를 거두려면 2027년은 되어야 한다"는 전망이 주가 –22%로 이어졌습니다.',
  },
  {
    ticker: 'GOOGL',
    name: '알파벳(구글)',
    ytd: 18,
    group: 'infra' as const,
    body: 'AI 소프트웨어 군 중 유일하게 플러스 수익률(+18%)을 기록했습니다. Gemini를 검색 광고에 직접 통합해 AI 투자가 즉시 광고 수익 증가로 이어지는 구조를 만들었기 때문입니다. AI Overview 기능 출시 이후 검색 점유율 방어에도 성공하며 빅테크 중 가장 효율적인 AI 수익화 모델을 증명했습니다.',
  },
];

export const FAQ_ITEMS = [
  {
    q: '팰런티어가 AI 대표주인데 왜 -28%나 떨어졌나요?',
    a: '팰런티어는 2024~2025년 AI 열풍으로 P/E(주가수익비율)가 300배까지 치솟았습니다. 기업 실적 자체는 나쁘지 않았지만, 지나치게 높은 밸류에이션이 현실화되는 과정에서 주가가 조정됐습니다. 방산·정부 AI 플랫폼 사업은 안정적으로 성장 중이며, 현재 P/E도 100배 이상으로 여전히 높게 평가받고 있습니다.',
  },
  {
    q: '구글(알파벳)만 AI 소프트웨어 중 살아남은 이유는 무엇인가요?',
    a: '구글은 Gemini를 검색 광고에 직접 통합해 AI 투자가 광고 수익 증가로 즉시 연결되는 구조를 만들었습니다. 반면 MS·세일즈포스 등은 AI 기능을 추가했지만 추가 매출로 이어지는 속도가 느렸습니다. "AI가 핵심 비즈니스를 강화"하느냐 vs "AI가 비용만 올리느냐"의 차이가 2026년 상반기 주가 희비를 갈랐습니다.',
  },
  {
    q: '어도비 주가는 왜 이렇게 많이 떨어졌나요?',
    a: '어도비 포토샵·일러스트레이터의 핵심 고객인 크리에이터들이 Midjourney·Stable Diffusion·Sora 등 AI 생성 도구로 이동하고 있습니다. 어도비가 자체 AI(Firefly)를 출시했지만, 무료·저가 대체재와 경쟁에서 밀리며 구독 갱신율이 하락했습니다. $20억 규모 피그마 인수 무산 후 성장 전략에 대한 신뢰도 하락이 주가 하락을 가속시켰습니다.',
  },
  {
    q: '반도체(하드웨어)는 폭등했는데 AI 소프트웨어는 왜 반대인가요?',
    a: 'AI 시대에 가장 먼저 수익을 내는 것은 인프라(GPU·메모리·장비)입니다. 기업들이 AI 서버·데이터센터를 구축하는 단계이기 때문에 하드웨어 수요가 먼저 폭발했습니다. 반면 소프트웨어는 AI 전환 비용이 늘고, 기존 제품이 AI에 위협받으면서 단기 수익성이 악화됐습니다. 인터넷 시대에도 처음엔 통신 인프라(AT&T·시스코)가 먼저 올랐고, 소프트웨어(구글·페이스북)는 뒤늦게 따라온 것과 비슷한 패턴입니다.',
  },
  {
    q: 'AI 소프트웨어 주식에 지금 투자해도 되나요?',
    a: '현재 주가 하락으로 밸류에이션 부담은 줄었지만, 수익화 시점이 불확실합니다. 세일즈포스·서비스나우는 P/E가 20~30배까지 내려와 역사적 저점 수준입니다. 다만 AI가 기존 SaaS를 대체하는 속도가 빨라질 경우 추가 하락 가능성도 있으므로, 분할 매수와 장기 보유 전략을 권장합니다. 구글(GOOGL)은 AI 수익화가 가장 명확한 종목으로 상대적으로 안전한 선택입니다.',
  },
  {
    q: '마이크로소프트 Copilot은 왜 주가를 올리지 못했나요?',
    a: 'Copilot을 Microsoft 365에 탑재했지만 기업 도입률이 예상치를 크게 하회했습니다. 월 $30 추가 비용을 내고 Copilot을 쓰는 기업이 예측보다 훨씬 적었고, OpenAI에 대한 $130억 투자와 연간 $190억 AI 인프라 설비투자가 이익을 압박했습니다. 2027년 이후 AI 투자 회수가 본격화되면 주가가 회복될 수 있다는 전망이 있지만, 현재는 비용 부담이 더 크게 반영된 상태입니다.',
  },
];

export const REPORT_META = {
  title: 'AI 주식 2026 상반기 수익률 | 소프트웨어 –44% vs 하드웨어 +820%',
  description: '팰런티어·어도비·세일즈포스 등 AI 주식 13종목의 2026년 상반기 수익률 비교. 같은 AI인데 하드웨어는 폭등, 소프트웨어는 폭락한 이유를 수치로 분석합니다.',
  slug: 'ai-stocks-h1-2026',
  updatedAt: '2026-06-18',
  source: '출처: finviz.com (2026-06-18 종가 기준)',
  caution: '본 리포트는 투자 권유가 아니며 과거 수익률이 미래를 보장하지 않습니다.',
};
