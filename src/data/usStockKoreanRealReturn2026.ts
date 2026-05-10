export type MarketIndex = "S&P500" | "Nasdaq100" | "Dow";
export type DataBadge = "참고" | "시뮬레이션" | "확인 필요";

export type AnnualReturnRow = {
  year: string;
  index: MarketIndex;
  usdReturnRate: number;
  fxReturnRate: number;
  krwReturnRate: number;
  badge: DataBadge;
};

export type SimpleCard = {
  title: string;
  body: string;
};

export type TaxExampleRow = {
  label: string;
  amount: number;
  note: string;
};

export type SourceLink = {
  label: string;
  href: string;
  description: string;
};

export const USKR_META = {
  slug: "us-stock-korean-real-return-2026",
  title: "국내 투자자 미국주식 실수익률 완전 분석 2026",
  description:
    "미국주식 수익률을 달러 기준, 원화 기준, 세후 기준으로 나눠 보고 환율·환전수수료·양도소득세·배당세 영향을 정리합니다.",
  updatedAt: "2026-05-10",
};

export const USKR_ANNUAL_RETURNS: AnnualReturnRow[] = [
  { year: "2021", index: "S&P500", usdReturnRate: 26.9, fxReturnRate: 8.2, krwReturnRate: 37.3, badge: "참고" },
  { year: "2022", index: "S&P500", usdReturnRate: -19.4, fxReturnRate: 6.8, krwReturnRate: -13.9, badge: "참고" },
  { year: "2023", index: "S&P500", usdReturnRate: 24.2, fxReturnRate: -2.6, krwReturnRate: 20.9, badge: "참고" },
  { year: "2024", index: "S&P500", usdReturnRate: 23.3, fxReturnRate: 12.4, krwReturnRate: 38.6, badge: "참고" },
  { year: "2025", index: "S&P500", usdReturnRate: 16.4, fxReturnRate: -4.0, krwReturnRate: 11.7, badge: "시뮬레이션" },
  { year: "2026 YTD", index: "S&P500", usdReturnRate: 7.6, fxReturnRate: 3.0, krwReturnRate: 10.8, badge: "시뮬레이션" },
];

export const USKR_INDEX_COMPARISON = [
  { index: "S&P500", usd10y: "확인 필요", krwView: "환율 반영 시 체감 수익 변동", volatility: "중간", note: "미국 대표 분산 지수" },
  { index: "Nasdaq100", usd10y: "확인 필요", krwView: "기술주 + 환율 변동성 동시 반영", volatility: "높음", note: "빅테크 집중" },
  { index: "Dow", usd10y: "확인 필요", krwView: "상대적으로 보수적", volatility: "중간", note: "전통 대형주 중심" },
];

export const USKR_SCENARIOS = [
  { buyRate: 1200, sellRate: 1500, stockReturn: 20, krwReturn: 50.0, note: "주가와 환율이 함께 우호적" },
  { buyRate: 1500, sellRate: 1200, stockReturn: 20, krwReturn: -4.0, note: "주가는 올라도 원화 기준 수익 축소" },
  { buyRate: 1350, sellRate: 1350, stockReturn: 20, krwReturn: 20.0, note: "환율 영향 거의 없음" },
  { buyRate: 1200, sellRate: 1500, stockReturn: 0, krwReturn: 25.0, note: "주가 횡보, 환차익 발생" },
];

export const USKR_TAKEAWAYS: SimpleCard[] = [
  {
    title: "달러 수익률은 출발점입니다",
    body: "미국 현지 주가가 오른 비율은 첫 번째 숫자일 뿐입니다. 한국 투자자에게는 매수 환율과 매도 환율을 거친 원화 환산 결과가 실제 체감 수익률입니다.",
  },
  {
    title: "고환율 매수는 기대수익을 낮춥니다",
    body: "주가가 20% 올라도 매수 환율보다 매도 환율이 크게 낮으면 원화 기준 수익률은 한 자릿수 또는 손실로 바뀔 수 있습니다.",
  },
  {
    title: "세후 계산은 매도 후에 중요해집니다",
    body: "평가이익 상태에서는 세금이 확정되지 않습니다. 실제 매도해 양도차익이 발생한 해에는 기본공제, 손익통산, 신고기한을 함께 봐야 합니다.",
  },
];

export const USKR_FORMULA_STEPS: SimpleCard[] = [
  {
    title: "1. 달러 기준 평가금액",
    body: "보유 수량 × 매도 단가로 달러 평가금액을 계산합니다. 배당 재투자 여부가 있으면 주식 수량과 원가가 달라집니다.",
  },
  {
    title: "2. 원화 환산 손익",
    body: "매수금액은 매수 당시 환율, 매도금액은 매도 당시 환율로 각각 원화 환산합니다. 단순히 평균 환율 하나로 계산하면 체감 손익이 왜곡될 수 있습니다.",
  },
  {
    title: "3. 비용 차감",
    body: "해외주식 매매수수료, SEC fee, 환전 스프레드, 송금 비용 등 실제 거래 비용을 차감합니다.",
  },
  {
    title: "4. 세후 수익",
    body: "연간 양도차익에서 기본공제와 손익통산을 반영한 뒤 세액을 계산합니다. 배당은 양도차익과 별도로 배당소득 흐름에서 봅니다.",
  },
];

export const USKR_COST_FACTORS: SimpleCard[] = [
  {
    title: "환전 스프레드",
    body: "환전 우대율이 높아도 매수·매도 양방향 스프레드가 누적됩니다. 잦은 매매일수록 주가 수익률보다 비용 체감이 커집니다.",
  },
  {
    title: "해외주식 수수료",
    body: "이벤트 수수료와 기본 수수료가 다를 수 있습니다. 장기 보유자는 낮아 보여도 매도 시점의 적용 조건을 다시 확인해야 합니다.",
  },
  {
    title: "배당 원천징수",
    body: "미국 배당은 현지 원천징수 후 입금되는 구조가 일반적입니다. 고배당 ETF는 주가 수익률과 별도로 세후 배당률을 봐야 합니다.",
  },
  {
    title: "양도소득세 신고",
    body: "국외주식 양도소득은 다음 해 5월 확정신고 대상이 될 수 있습니다. 2025년 귀속분은 2026년 6월 1일까지 신고·납부 안내가 공지됐습니다.",
  },
];

export const USKR_TAX_EXAMPLE: TaxExampleRow[] = [
  { label: "매도 원화 환산금액", amount: 18000000, note: "매도일 환율 기준 예시" },
  { label: "취득 원화 환산금액", amount: -12000000, note: "매수일 환율 기준 예시" },
  { label: "매매·환전 비용", amount: -60000, note: "증권사 조건에 따라 달라짐" },
  { label: "양도차익", amount: 5940000, note: "매도금액 - 취득금액 - 비용" },
  { label: "기본공제", amount: -2500000, note: "국외주식 기본공제 예시" },
  { label: "과세표준", amount: 3440000, note: "양도차익 - 기본공제" },
  { label: "예상 세액", amount: -756800, note: "과세표준 × 22% 시뮬레이션" },
  { label: "세후 이익", amount: 5183200, note: "양도차익 - 예상 세액" },
];

export const USKR_CHECKLIST = [
  "매수 체결일별 환율과 매도 체결일별 환율을 분리해 기록합니다.",
  "달러 배당금은 입금일 환율, 원천징수세, 국내 종합과세 가능성을 별도로 확인합니다.",
  "같은 해 해외주식 손실 종목이 있으면 손익통산 가능 여부를 먼저 검토합니다.",
  "환헤지 ETF와 환노출 ETF는 주가 방향보다 환율 방향에서 결과가 갈릴 수 있습니다.",
  "증권사 세금 자료는 편리하지만 최종 신고 책임은 납세자에게 있으므로 원자료와 대조합니다.",
];

export const USKR_FAQ = [
  {
    question: "미국주식 수익률은 왜 달러와 원화가 다른가요?",
    answer: "한국 투자자는 원화를 달러로 바꿔 매수하고 매도 후 다시 원화로 환산하므로 환율 변동이 최종 수익률에 반영됩니다.",
  },
  {
    question: "양도소득세 22%는 언제 반영하나요?",
    answer: "해외주식 연간 양도차익에서 기본공제 250만 원을 제외한 과세표준에 대해 지방세 포함 22%가 적용되는 구조로 안내됩니다. 실제 신고 전 최신 세법을 확인해야 합니다.",
  },
  {
    question: "환헤지 ETF가 항상 유리한가요?",
    answer: "아닙니다. 원달러 환율이 오르면 환노출 ETF가 유리할 수 있고, 환율 하락 구간에서는 환헤지 ETF가 유리할 수 있습니다.",
  },
  {
    question: "배당금도 원화 실수익률에 포함해야 하나요?",
    answer: "네. 달러 배당금은 원화 환산 시점의 환율과 배당세를 함께 고려해야 합니다.",
  },
];

export const USKR_SOURCE_LINKS: SourceLink[] = [
  {
    label: "국세청 양도소득세 세액계산요령",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=8800&mi=12274",
    description: "주식 등 양도소득금액, 기본공제, 손익통산 기준을 확인할 때 참고합니다.",
  },
  {
    label: "국세청 2025년 귀속 양도소득세 확정신고 안내",
    href: "https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?bbsId=1028&mi=2201&nttSn=1350890",
    description: "2025년 귀속 국외주식 양도소득 신고 대상과 신고·납부 기한 안내입니다.",
  },
  {
    label: "S&P500 연도별 수익률 참고표",
    href: "https://www.slickcharts.com/sp500/returns/details",
    description: "S&P500 가격수익률과 배당수익률을 분리해 볼 때 참고한 시장 데이터입니다.",
  },
];

export const USKR_RELATED_LINKS = [
  { href: "/tools/us-stock-exchange-profit-calculator/", label: "미국주식 환차손익 계산기" },
  { href: "/reports/stock-brokerage-fee-comparison-2026/", label: "증권사 수수료·환전 비교" },
  { href: "/tools/stock-breakeven-calculator/", label: "주식 손익분기점 계산기" },
];
