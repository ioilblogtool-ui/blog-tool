export type StockRow = {
  rank: number;
  name: string;
  ticker: string;
  country: 'US' | 'KR' | 'TW' | 'JP';
  sector: '설계' | '메모리' | '파운드리' | '장비' | '패키징' | '아날로그';
  open: number;
  close: number;
  currency: 'USD' | 'KRW' | 'TWD' | 'JPY';
  ytd: number;
  note: string;
  isEstimate: boolean;
};

export const STOCKS: StockRow[] = [
  { rank: 1,  name: '샌디스크',           ticker: 'SNDK',   country: 'US', sector: '메모리',   open: 237.38,   close: 2184.75,  currency: 'USD', ytd: 820, note: '낸드 공급 타이트·AI 스토리지 수요 폭발',      isEstimate: true },
  { rank: 2,  name: '마이크론',            ticker: 'MU',     country: 'US', sector: '메모리',   open: 285.38,   close: 1133.99,  currency: 'USD', ytd: 297, note: 'HBM3E 양산·AI 메모리 수요 급증',              isEstimate: true },
  { rank: 3,  name: '마벨테크놀로지',      ticker: 'MRVL',   country: 'US', sector: '설계',     open: 84.98,    close: 310.58,   currency: 'USD', ytd: 265, note: '데이터센터 AI 커스텀칩 수혜',                  isEstimate: true },
  { rank: 4,  name: '인텔',               ticker: 'INTC',   country: 'US', sector: '설계',     open: 36.68,    close: 133.99,   currency: 'USD', ytd: 263, note: '애플 파운드리 계약·파운드리 재건 기대',         isEstimate: true },
  { rank: 5,  name: '도쿄일렉트론',        ticker: '8035',   country: 'JP', sector: '장비',     open: 19870,    close: 70860,    currency: 'JPY', ytd: 257, note: '아시아 최대 반도체 장비·AI 팹 투자 수혜',      isEstimate: true },
  { rank: 6,  name: 'SK하이닉스',          ticker: '000660', country: 'KR', sector: '메모리',   open: 650000,   close: 2009000,  currency: 'KRW', ytd: 209, note: 'HBM3E 엔비디아 독점 공급',                    isEstimate: true },
  { rank: 7,  name: 'AMD',               ticker: 'AMD',    country: 'US', sector: '설계',     open: 214.18,   close: 537.37,   currency: 'USD', ytd: 151, note: 'MI300X·EPYC 데이터센터 점유 확대',             isEstimate: true },
  { rank: 8,  name: '미디어텍',            ticker: '2454',   country: 'TW', sector: '설계',     open: 1390,     close: 4560,     currency: 'TWD', ytd: 228, note: 'AI PC·스마트폰 AP·데이터센터 칩 공급',         isEstimate: false },
  { rank: 9,  name: 'DB하이텍',            ticker: '000990', country: 'KR', sector: '파운드리', open: 65800,    close: 220500,   currency: 'KRW', ytd: 235, note: '아날로그 파운드리 회복·전기차 수요',            isEstimate: true },
  { rank: 10, name: '어플라이드머티리얼즈', ticker: 'AMAT',   country: 'US', sector: '장비',     open: 256.98,   close: 617.11,   currency: 'USD', ytd: 140, note: 'AI 팹 증설 수혜·WFE 수요 급증',               isEstimate: true },
  { rank: 11, name: '램리서치',            ticker: 'LRCX',   country: 'US', sector: '장비',     open: 171.29,   close: 389.04,   currency: 'USD', ytd: 127, note: '식각 장비 독과점·첨단 노드 수요',               isEstimate: true },
  { rank: 12, name: '한미반도체',           ticker: '042700', country: 'KR', sector: '장비',     open: 155000,   close: 309000,   currency: 'KRW', ytd: 99,  note: 'TC본더 HBM 패키징 핵심 장비',                 isEstimate: true },
  { rank: 13, name: 'KLA',               ticker: 'KLAC',   country: 'US', sector: '장비',     open: 121.17,   close: 259.56,   currency: 'USD', ytd: 114, note: '검사 장비 독과점·고급 노드 필수',               isEstimate: true },
  { rank: 14, name: '텍사스인스트루먼츠',   ticker: 'TXN',    country: 'US', sector: '아날로그', open: 173.49,   close: 322.86,   currency: 'USD', ytd: 86,  note: '전기차·산업용 아날로그 회복',                  isEstimate: true },
  { rank: 15, name: 'ASML',              ticker: 'ASML',   country: 'US', sector: '장비',     open: 1069.54,  close: 1929.68,  currency: 'USD', ytd: 80,  note: 'EUV 독점·AI 팹 투자 확대',                    isEstimate: true },
  { rank: 16, name: 'TSMC',              ticker: 'TSM',    country: 'TW', sector: '파운드리', open: 303.84,   close: 462.12,   currency: 'USD', ytd: 52,  note: 'AI칩 위탁 수요·2나노 선점',                   isEstimate: true },
  { rank: 17, name: '퀄컴',              ticker: 'QCOM',   country: 'US', sector: '설계',     open: 171.05,   close: 226.11,   currency: 'USD', ytd: 32,  note: '스마트폰 회복·AI PC 칩셋 수주',                isEstimate: true },
  { rank: 18, name: '브로드컴',           ticker: 'AVGO',   country: 'US', sector: '설계',     open: 346.08,   close: 411.35,   currency: 'USD', ytd: 19,  note: 'AI 커스텀칩(XPU)·네트워킹 강세',              isEstimate: true },
  { rank: 19, name: '삼성전자',           ticker: '005930', country: 'KR', sector: '메모리',   open: 333600,   close: 369750,   currency: 'KRW', ytd: 11,  note: 'HBM4 공급 재개·파운드리 수주 회복',            isEstimate: true },
  { rank: 20, name: '엔비디아',           ticker: 'NVDA',   country: 'US', sector: '설계',     open: 186.51,   close: 210.69,   currency: 'USD', ytd: 13,  note: 'B200 전환 기저·시총 1위는 유지',               isEstimate: true },
  { rank: 21, name: '르네사스',           ticker: '6723',   country: 'JP', sector: '설계',     open: 0,        close: 2461,     currency: 'JPY', ytd: 9,   note: '차량용 MCU·EV 수요 회복 기대',                 isEstimate: false },
];

export const SUMMARY = {
  topStock: '샌디스크 (SNDK)',
  topYtd: 820,
  sectorAvg: {
    메모리: 334,
    장비: 147,
    설계: 133,
    파운드리: 99,
    아날로그: 86,
  },
  kospiYtd: 84,
  dataDate: '2026-06-18',
};

export const SECTOR_DESC: Record<string, string> = {
  설계: 'GPU·CPU·AP 등을 설계하는 팹리스',
  메모리: 'DRAM·HBM·낸드 직접 생산',
  파운드리: '위탁 생산 전문',
  장비: '반도체 제조 장비',
  패키징: '고급 후공정·HBM 패키징',
  아날로그: '산업·전기차용 아날로그 칩',
};

export const HIGHLIGHTS = [
  {
    ticker: 'SNDK',
    name: '샌디스크',
    ytd: 820,
    country: 'US',
    body: 'WD에서 분사한 낸드 전문 기업. AI 데이터센터의 스토리지 폭발적 수요와 낸드 공급 타이트가 맞물려 연초 대비 820% 폭등. 애플의 메모리 비용 경고 이후 NAND 공급 희소성이 부각되며 9% 추가 급등.',
  },
  {
    ticker: 'MU',
    name: '마이크론',
    ytd: 297,
    country: 'US',
    body: '미국 유일 HBM 생산 기업. HBM3E 양산 성공 이후 엔비디아·AMD 공급망에 진입. 6월 24일 실적 발표를 앞두고 Stifel·Wedbush 목표주가 $1,500 제시 → 297% 상승.',
  },
  {
    ticker: '000660',
    name: 'SK하이닉스',
    ytd: 209,
    country: 'KR',
    body: 'HBM3E를 엔비디아 H100·B200에 독점 공급하는 글로벌 HBM 1위. 연초 65만원 → 6월 200만원 돌파. 코스피 시총 2위로 올라서며 코스피 상반기 랠리를 주도.',
  },
  {
    ticker: 'AMD',
    name: 'AMD',
    ytd: 151,
    country: 'US',
    body: 'MI300X GPU가 엔비디아 대항마로 부상. EPYC 서버 CPU의 데이터센터 점유율 확대. 6월 기준 $537로 연초 $214 대비 150% 상승. AI 반도체 2위 구도 굳히기.',
  },
  {
    ticker: 'TSM',
    name: 'TSMC',
    ytd: 52,
    country: 'TW',
    body: '세계 파운드리 1위. 엔비디아·애플·AMD 핵심 위탁처. AI 칩 수요 급증으로 2나노 생산 용량 완판. ADR 기준 연초 $304 → $462, 52% 상승. 6월 AI 수요 부족분 +5% 단일 급등.',
  },
];

export const FAQ_ITEMS = [
  {
    q: '샌디스크(SNDK)가 왜 1위인가요?',
    a: 'WD(웨스턴디지털)에서 2024년 분사한 낸드 플래시 전문 기업으로, 2026년 상반기 AI 데이터센터의 스토리지 수요 폭증과 낸드 공급 타이트 상황이 맞물려 연초 $237에서 $2,185까지 820% 폭등했습니다. 애플이 메모리 비용 경고를 발표한 이후 낸드 희소성이 부각되며 단기간에 9% 추가 급등하는 이벤트도 있었습니다. 메모리 업황에서 낸드가 DRAM 이후 회복 사이클에 진입한 것이 주가 폭발의 근본 원인입니다.',
  },
  {
    q: '엔비디아가 AI 대장주인데 왜 수익률이 낮나요?',
    a: '엔비디아는 2023~2025년 3년간 이미 수천 % 상승한 기저 효과로 2026년 상반기 추가 상승폭이 +13%로 제한됐습니다. 그러나 시가총액 기준으로는 약 5,100조원으로 전 세계 1위를 유지하고 있으며, H100에서 B200으로 제품 전환 주기가 이어지고 있습니다. 수익률이 낮다고 해서 투자 매력이 없는 것은 아니며, 절대적 시장 지위와 AI 인프라 내 핵심 역할은 변함이 없습니다.',
  },
  {
    q: 'HBM이란 무엇인가요?',
    a: 'HBM은 고대역폭메모리(High Bandwidth Memory)의 약자로, AI 가속기에 탑재되는 초고속 D램입니다. 일반 DDR5 대비 대역폭이 10배 이상이며, 엔비디아 H100·B200 GPU 1개당 6~8개의 HBM3E 스택이 필요합니다. SK하이닉스가 HBM3E를 엔비디아에 독점 공급하면서 2026년 주가가 +209% 급등했고, 마이크론도 HBM 시장에 진입하며 +297% 상승했습니다.',
  },
  {
    q: '반도체 ETF vs 개별 주식, 어떤 게 더 나은가요?',
    a: '2026년 상반기 기준으로 SOXX ETF의 YTD 수익률은 약 +60~80%였고, 개별 종목 SNDK·MU는 각각 +820%, +297%로 ETF를 크게 웃돌았습니다. ETF는 분산 투자로 변동성이 낮고 관리가 편리하지만, 개별 종목을 정확히 선택했을 때의 수익률 차이는 엄청납니다. 사전에 어떤 종목이 크게 오를지 예측하기 어렵기 때문에, 일반 투자자에게는 ETF + 핵심 개별 주식 소량 병행 전략이 현실적인 접근입니다.',
  },
  {
    q: '2026 하반기에도 반도체 주식이 오를 수 있나요?',
    a: 'Stifel·Wedbush 등 주요 증권사들은 AI 인프라 투자 사이클이 최소 2027년까지 이어진다고 전망하며, 마이크론 목표주가를 $1,300~$1,500으로 제시했습니다. 다만 상반기 급등에 따른 밸류에이션 부담, 미중 반도체 수출 규제 강화, 금리 변수 등 하방 리스크도 존재합니다. 하반기는 상반기 대비 변동성이 커질 가능성이 높으며, 실적 시즌(7~8월)의 가이던스가 방향성을 결정할 가장 중요한 변수입니다.',
  },
  {
    q: 'ASML은 네덜란드 회사인데 왜 포함됐나요?',
    a: 'ASML은 EUV(극자외선) 노광 장비를 전 세계에서 유일하게 생산하는 독점 기업으로, 나스닥과 암스테르담 거래소에 동시 상장되어 있습니다. 삼성전자·TSMC·인텔이 7나노 이하 첨단 반도체를 생산하려면 반드시 ASML 장비가 필요하며, 대체 공급자가 없는 구조입니다. 2026년 상반기 ASML 주가는 +80% 상승했으며, 특히 Elon Musk의 Terafab 반도체 팹 투자 계획이 알려진 이후 단기 급등세가 두드러졌습니다.',
  },
];

export const REPORT_META = {
  title: '반도체 주식 2026 상반기 수익률 | 미국·한국·대만 21종목 랭킹',
  description: '엔비디아·SK하이닉스·TSMC 등 반도체 주식 21종목의 2026년 상반기 수익률을 국가·섹터별로 비교. 어디가 제일 올랐는지 바로 확인하세요.',
  slug: 'semiconductor-stocks-h1-2026',
  updatedAt: '2026-06-18',
  caution: '본 리포트는 투자 권유가 아니며 과거 수익률이 미래를 보장하지 않습니다.',
  source: '출처: finviz.com, Yahoo Finance, alphasquare.co.kr (2026-06-18 종가 기준)',
  estimateNote: '(*) 연초가는 YTD 수익률 역산 추정치로 실제값과 ±2% 오차가 있을 수 있습니다.',
};
