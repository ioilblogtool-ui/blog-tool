// AI 투자 둔화와 한국 반도체·코스피 영향 리포트 데이터.
// 수출 금액은 모두 "억 달러" 단위, 빅테크 설비투자는 "십억 달러(UsdBn)" 단위로 저장한다.
// confirmed=false 지표는 1차 원문을 아직 확인하지 못한 값으로, 화면에서 "공식" 배지로 보이지 않게 유틸이 강등한다.

export type AcsBadge = "공식" | "참고" | "시뮬레이션" | "추정";

export type AcsSource = {
  id: string;
  org: string;
  title: string;
  url: string;
  publishedAt: string;
  period: string;
  isPrimary: boolean;
};

export type AcsMetric = {
  id: string;
  label: string;
  value: number | null;
  unit: "억 달러" | "%" | "%p";
  period: string;
  badge: AcsBadge;
  confirmed: boolean;
  sourceIds: string[];
  note?: string;
};

export type AcsScenario = {
  id: "base" | "slow" | "bear";
  label: string;
  definition: string;
  exportDeltaUsd100m: number;
  gdpDeltaPp: number | null;
  gdpConfirmed: boolean;
  assumptions: string[];
  badge: AcsBadge;
  sourceIds: string[];
};

export type AcsCapexRow = {
  company: string;
  fiscalBasis: string;
  guidanceLowUsdBn: number | null;
  guidanceHighUsdBn: number | null;
  announcedAt: string;
  badge: AcsBadge;
  sourceId: string;
  note?: string;
};

export type AcsExposure = {
  company: "삼성전자" | "SK하이닉스";
  facts: { text: string; badge: AcsBadge; sourceIds: string[] }[];
};

export const ACS_META = {
  slug: "ai-capex-slowdown-korea-semiconductor-2026",
  title: "AI 투자가 줄면 한국 반도체와 코스피는 얼마나 흔들릴까",
  seoTitle: "AI 투자 둔화 2026 | 한국 반도체·코스피 얼마나 타격받나",
  seoDescription:
    "미국 빅테크가 AI 데이터센터 투자를 줄이면 한국 반도체 수출과 성장률은 얼마나 줄까요? 한국은행 시나리오와 공식 수출 통계로 삼성전자·SK하이닉스 영향 경로를 정리했습니다.",
  description:
    "한국 수출의 절반이 반도체인 상황에서 미국 빅테크의 AI 투자가 둔화되면 수출·성장률·코스피에 어떤 경로로 영향이 오는지 한국은행 시나리오와 공식 통계로 정리했습니다.",
  updatedAt: "2026-10-28",
};

export const ACS_SOURCES: AcsSource[] = [
  { id: "motir-2026-09", org: "산업통상부", title: "2026년 9월 수출입 동향", url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/172254/view", publishedAt: "2026-10-01", period: "2026년 9월", isPrimary: true },
  { id: "herald-1027", org: "헤럴드경제", title: "\"반도체, 전체 성장기여율 절반\" AI 꺾이면 수출 우려감 확산", url: "https://biz.heraldcorp.com/article/10916121", publishedAt: "2026-10-27", period: "한국은행 3분기 GDP 속보·국정감사 서면답변 보도", isPrimary: false },
  { id: "herald-1027b", org: "헤럴드경제", title: "반도체 급격한 쏠림이 최대 변수…AI 꺾이면 수출 직격탄 우려감 확산", url: "https://biz.heraldcorp.com/article/10915938", publishedAt: "2026-10-27", period: "2026년 3분기 GDP 속보 보도", isPrimary: false },
  { id: "indexbox-reuters", org: "IndexBox(로이터 보도 인용)", title: "한국은행 \"미국 AI 설비투자 둔화 시 한국 반도체 수출 500억~1,000억 달러 감소 가능\"", url: "https://www.indexbox.io/ko/blog/south-korea-semiconductor-exports-could-fall-50-100-billion-if-us-ai-spending-slows-bok-says/", publishedAt: "2026-10-27", period: "2027년 시나리오", isPrimary: false },
  { id: "edaily-bok", org: "이데일리", title: "한은 \"반도체 아직 괜찮지만..AI 투자 축소·中 추격 대비해야\"", url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01420246645612920", publishedAt: "2026-10-23", period: "한국은행 국정감사 답변", isPrimary: false },
  { id: "sedaily-bok", org: "서울경제", title: "한은 \"5대 빅테크 회사채 305조 발행… 韓 경제 취약성 가장 커\"", url: "https://m.sedaily.com/article/20106824", publishedAt: "2026-10-27", period: "한국은행 「AI 산업 자금 조달의 주요 특징과 리스크 평가」 보도", isPrimary: false },
  { id: "fntimes-1022", org: "한국금융신문", title: "10월 한은 금통위, 기준금리 연 3% 동결 '숨 고르기'", url: "https://www.fntimes.com/html/view.php?ud=202610221201381124179ad43907_18", publishedAt: "2026-10-22", period: "10/22 금융통화위원회", isPrimary: false },
  { id: "capex-tracker", org: "datacentres.com", title: "Hyperscaler CapEx Trends: 2026 Guidance Passes $700 Billion", url: "https://www.datacentres.com/guides/hyperscaler-capex-trends", publishedAt: "2026-10-27", period: "각사 2026년 설비투자 가이던스 집계", isPrimary: false },
  { id: "newspim-1020", org: "뉴스핌", title: "[아! 코스피] ⑧ 외국인이 결정한 코스피 하락세…개인·기관 매수도 못 막았다", url: "https://www.newspim.com/news/view/20261020000948", publishedAt: "2026-10-20", period: "10/1~10/19 투자자별 순매수", isPrimary: false },
];

export const ACS_METRICS: AcsMetric[] = [
  { id: "exp-total-sep", label: "9월 총수출", value: 1209.4, unit: "억 달러", period: "2026년 9월", badge: "공식", confirmed: true, sourceIds: ["motir-2026-09"], note: "전년 동월 대비 +83.5%" },
  { id: "exp-semi-sep", label: "9월 반도체 수출", value: 603.0, unit: "억 달러", period: "2026년 9월", badge: "공식", confirmed: true, sourceIds: ["motir-2026-09"], note: "전년 동월 대비 +263%, 단일 품목 첫 600억 달러" },
  { id: "exp-total-ytd", label: "1~9월 누적 수출", value: 8145, unit: "억 달러", period: "2026년 1~9월", badge: "공식", confirmed: true, sourceIds: ["motir-2026-09"], note: "전년 동기 대비 +56.8%" },
  { id: "gdp-q3", label: "3분기 실질 GDP 성장률(전기 대비)", value: 1.0, unit: "%", period: "2026년 3분기 속보", badge: "공식", confirmed: false, sourceIds: ["herald-1027b"], note: "한국은행 8월 전망 0.3%의 세 배 이상. 한국은행 보도자료 원문 확인 전" },
  { id: "base-rate", label: "기준금리", value: 3.0, unit: "%", period: "2026-10-22", badge: "공식", confirmed: true, sourceIds: ["fntimes-1022"] },
];

export const ACS_SCENARIOS: AcsScenario[] = [
  {
    id: "base",
    label: "기준",
    definition: "한국은행 기본 전망이 유지되는 경우입니다. 빅테크가 현재 계획대로 AI 설비투자를 이어가는 상황을 뜻합니다.",
    exportDeltaUsd100m: 0,
    gdpDeltaPp: 0,
    gdpConfirmed: true,
    assumptions: ["빅테크 설비투자가 현재 가이던스대로 집행", "기본 전망 수치는 한국은행 11월 경제전망에서 갱신"],
    badge: "참고",
    sourceIds: ["herald-1027"],
  },
  {
    id: "slow",
    label: "둔화",
    definition: "한국은행이 제시한 비관 범위의 하단(수출 −500억 달러)입니다. 성장률 영향은 한국은행이 따로 밝히지 않아, 원문 확인 전에는 표시하지 않습니다.",
    exportDeltaUsd100m: -500,
    gdpDeltaPp: -0.2,
    gdpConfirmed: false,
    assumptions: ["AI 투자 둔화로 반도체 수출 물량 증가세 둔화", "성장률 −0.2%p는 비관 상단(−0.4%p)을 선형으로 나눈 우리 계산"],
    badge: "시뮬레이션",
    sourceIds: ["herald-1027", "indexbox-reuters"],
  },
  {
    id: "bear",
    label: "비관",
    definition: "한국은행이 국정감사 서면답변에서 제시한 비관 시나리오의 상단입니다. 미국 빅테크의 AI 설비투자가 2027년에 둔화한다고 가정했습니다.",
    exportDeltaUsd100m: -1000,
    gdpDeltaPp: -0.4,
    gdpConfirmed: false,
    assumptions: ["미국 빅테크 AI 설비투자 2027년 둔화", "한국산 반도체 단가 10% 하락", "물량 증가세 둔화", "경상수지가 2027년 전망(4,300억 달러)을 크게 밑돎"],
    badge: "공식",
    sourceIds: ["herald-1027", "indexbox-reuters"],
  },
];

export const ACS_CAPEX: AcsCapexRow[] = [
  { company: "아마존", fiscalBasis: "2026년(달력 기준)", guidanceLowUsdBn: 220, guidanceHighUsdBn: 220, announcedAt: "2026-07", badge: "참고", sourceId: "capex-tracker", note: "2분기 실적 발표에서 2,000억 → 약 2,200억 달러로 상향" },
  { company: "알파벳", fiscalBasis: "2026년(달력 기준)", guidanceLowUsdBn: 195, guidanceHighUsdBn: 205, announcedAt: "2026-07", badge: "참고", sourceId: "capex-tracker", note: "2027년 설비투자도 크게 늘어날 것이라고 언급" },
  { company: "마이크로소프트", fiscalBasis: "2026년(달력 기준 환산, 금융리스 포함)", guidanceLowUsdBn: 175, guidanceHighUsdBn: 175, announcedAt: "2026-07", badge: "참고", sourceId: "capex-tracker", note: "회계연도(6월 결산) 기준과 금융리스 포함 여부에 따라 집계가 다름" },
  { company: "메타", fiscalBasis: "2026년(달력 기준)", guidanceLowUsdBn: 130, guidanceHighUsdBn: 145, announcedAt: "2026-07", badge: "참고", sourceId: "capex-tracker", note: "10월 3분기 실적에서 1,350억~1,450억 달러로 상향했다는 보도가 있으나 확인 중" },
];

export const ACS_CAPEX_NOTE =
  "알파벳·마이크로소프트·아마존은 10월 말 3분기 실적 발표에서 가이던스를 다시 내놓을 예정입니다. 회사마다 회계연도와 금융리스 포함 여부가 달라 단순 합계는 참고용입니다.";

export const ACS_EXPOSURE: AcsExposure[] = [
  {
    company: "삼성전자",
    facts: [
      { text: "2026년 3분기 잠정 매출 195조 원, 영업이익 107.4조 원(전년 동기 대비 +782.5%)을 발표했습니다.", badge: "공식", sourceIds: ["samsung-kr"] },
      { text: "메모리 외에 파운드리, 스마트폰·가전(MX·DX) 사업을 함께 갖고 있어 매출 구성이 상대적으로 다양합니다. 사업부별 이익은 확정실적에서 공개됩니다.", badge: "참고", sourceIds: ["samsung-kr"] },
      { text: "HBM4 양산 출하와 HBM4E 샘플 출하(2026-05-29)를 발표했습니다. 제품별 매출·이익 기여는 공개되지 않았습니다.", badge: "공식", sourceIds: ["samsung-hbm4", "samsung-hbm4e"] },
    ],
  },
  {
    company: "SK하이닉스",
    facts: [
      { text: "매출 대부분이 D램·낸드 등 메모리에서 나와, 메모리 가격과 HBM 수요 변화에 더 직접적으로 노출됩니다.", badge: "참고", sourceIds: [] },
      { text: "2026년 3분기 실적은 10월 28일 오전 발표 예정입니다. 발표 전 증권가 예상치는 이 페이지에 싣지 않습니다.", badge: "참고", sourceIds: [] },
      { text: "10월 1~19일 외국인은 삼성전자와 SK하이닉스를 합쳐 약 14조 원 순매도했습니다(한국거래소 집계 인용 보도).", badge: "참고", sourceIds: ["newspim-1020"] },
    ],
  },
];

export const ACS_COUNTER_EVIDENCE = [
  { title: "빅테크 투자는 아직 늘고 있습니다", detail: "아마존·알파벳·마이크로소프트·메타의 2026년 설비투자 가이던스는 모두 전년보다 크게 늘었고, 상반기 실적 발표 때도 하향보다 상향이 많았습니다.", badge: "참고" as AcsBadge },
  { title: "한국은행도 2027년 물량 증가를 예상합니다", detail: "한국은행은 HBM 생산 확대로 2027년 반도체 물량 증가세가 2026년보다 커질 것으로 보면서, 가격 상승 폭은 둔화될 것으로 봤습니다.", badge: "참고" as AcsBadge },
  { title: "금융위기가 임박했다는 뜻은 아닙니다", detail: "한국은행은 AI 산업 자금 조달 보고서에서 빅테크의 재무구조가 탄탄하고 투자가 실수요에 기반해 있어 AI발 금융위기가 임박하지는 않았다고 평가했습니다. 다만 장기금리 상승기에 취약성이 쌓이고 있다고 경고했습니다.", badge: "참고" as AcsBadge },
];

export const ACS_CHECKLIST = [
  { title: "빅테크 설비투자 가이던스", detail: "분기 실적 발표 때 다음 해 설비투자 계획이 늘었는지, 줄었는지 확인합니다." },
  { title: "D램·낸드 고정거래가격", detail: "메모리 가격 상승률이 둔화되는지, 하락으로 돌아서는지 봅니다." },
  { title: "월간 반도체 수출", detail: "매월 1일 산업통상부 수출입 동향에서 반도체 수출 증가율과 물량·단가를 확인합니다." },
  { title: "빅테크 회사채와 순환 거래", detail: "AI 기업의 회사채 발행 규모와 스프레드, 서로 투자하고 구매하는 순환 거래 비중을 봅니다." },
  { title: "외국인 반도체 수급", detail: "외국인이 삼성전자·SK하이닉스를 다시 사기 시작하는지 1~2주 단위로 확인합니다." },
];

export const ACS_SEO_INTRO = [
  "2026년 10월 코스피가 반도체 대형주를 중심으로 크게 흔들리면서 'AI 투자가 줄면 한국은 어떻게 되나'라는 질문이 커졌습니다. 마침 한국은행은 국회 국정감사 서면답변에서 미국 빅테크의 AI 설비투자가 둔화하는 비관 시나리오를 처음으로 제시했고, 이 경우 2027년 한국의 반도체 수출이 기본 전망보다 500억~1,000억 달러 줄어들 수 있다고 추정했습니다. 이 페이지는 그 시나리오와 공식 통계를 바탕으로 영향 경로를 정리합니다.",
  "한국 경제가 반도체에 얼마나 기대고 있는지는 숫자로 바로 보입니다. 2026년 9월 반도체 수출은 603.0억 달러로 전체 수출 1,209.4억 달러의 약 49.9%를 차지했고, 1년 전보다 263% 늘었습니다. 한국은행은 3분기 실질 GDP가 전기 대비 1.0% 성장했으며 그 성장의 절반 정도를 반도체가 이끈 것으로 추정했습니다. 코스피에서도 삼성전자와 SK하이닉스의 비중이 커서 반도체 업황이 지수 전체를 좌우합니다.",
  "AI 투자가 둔화되면 영향은 빅테크 설비투자 → GPU·AI 가속기 주문 → HBM·D램 수요와 가격 → 삼성전자·SK하이닉스 실적 → 수출·성장률·코스피·성과급 순으로 전달됩니다. 한국은행의 비관 시나리오는 한국산 반도체 단가가 10% 떨어지고 물량 증가세가 둔화되는 상황을 가정했으며, 로이터는 이 경우 내년 성장률이 약 0.4%포인트 낮아진다고 전했습니다. 비관 범위 상단인 1,000억 달러는 2026년 9월 한 달 반도체 수출의 약 1.66개월분에 해당합니다.",
  "다만 이는 '둔화가 일어난다면'을 가정한 시나리오이지 예측이 아닙니다. 빅테크의 2026년 설비투자 계획은 여전히 늘고 있고, 한국은행도 AI발 금융위기가 임박하지는 않았다고 평가했습니다. 이 페이지에서 한국은행이 제시한 수치는 원문 확인 여부에 따라 공식 또는 참고로, 우리가 추가로 계산한 값(둔화 시나리오 성장률, 월 수출 환산)은 시뮬레이션으로 구분해 표시했습니다. 특정 종목의 매수나 매도를 권유하지 않습니다.",
];

export const ACS_CRITERIA = [
  "수출 통계는 산업통상부 「2026년 9월 수출입 동향」(2026-10-01) 원자료를 사용했습니다.",
  "한국은행 비관 시나리오는 국정감사 서면답변을 인용한 보도 기준이며, 원문 확인 전까지 성장률 영향은 '참고'로 표시합니다.",
  "반도체 수출 비중과 월 수출 환산은 같은 달 공식 수치로 직접 계산한 시뮬레이션 값입니다.",
  "빅테크 설비투자는 각사 가이던스를 집계한 자료(참고)이며, 회계연도와 금융리스 포함 여부가 회사마다 다릅니다.",
];

export const ACS_FAQ = [
  { question: "AI 투자가 줄면 한국 반도체 수출은 얼마나 줄어드나요?", answer: "한국은행은 국정감사 서면답변에서 미국 빅테크의 AI 투자가 둔화하는 비관 시나리오의 경우 2027년 반도체 수출이 기본 전망보다 500억~1,000억 달러 줄어들 수 있다고 추정했습니다. 1,000억 달러는 2026년 9월 한 달 반도체 수출(603억 달러)의 약 1.7배입니다. 이는 가정에 따른 시나리오이며 예측치가 아닙니다." },
  { question: "한국은행이 말한 비관 시나리오는 어떤 가정인가요?", answer: "미국 빅테크의 AI 관련 설비투자가 2027년에 둔화하고, 그 결과 한국산 반도체 단가가 10% 하락하며 물량 증가세도 둔화되는 상황을 가정했습니다. 보도에 따르면 이 경우 2027년 성장률이 약 0.4%포인트 낮아지고 경상수지도 전망을 크게 밑돌 수 있습니다. 서면답변 원문은 아직 공개 자료로 확인하지 못했습니다." },
  { question: "한국 수출에서 반도체 비중은 얼마나 되나요?", answer: "2026년 9월 기준 반도체 수출은 603.0억 달러로 총수출 1,209.4억 달러의 약 49.9%였습니다. 수출의 절반 가까이가 한 품목에서 나오는 셈입니다. 정보통신기술(ICT) 수출 대비 비중은 80%를 넘는데, 분모가 다르므로 총수출 기준과 혼동하지 않아야 합니다." },
  { question: "빅테크는 AI 투자를 실제로 줄이고 있나요?", answer: "아직은 아닙니다. 아마존, 알파벳, 마이크로소프트, 메타의 2026년 설비투자 가이던스는 모두 전년보다 크게 늘었고, 상반기 실적 발표에서는 상향 조정이 많았습니다. 다만 시장은 투자 대비 수익과 자금 조달 부담을 의심하기 시작했고, 10월 말 3분기 실적 발표에서 나올 다음 해 계획이 중요한 확인 지점입니다." },
  { question: "삼성전자와 SK하이닉스 중 어디가 더 영향을 받나요?", answer: "한쪽이 더 크게 타격받는다고 단정하기는 어렵습니다. SK하이닉스는 매출 대부분이 메모리에서 나와 HBM·D램 가격 변화에 더 직접 노출되고, 삼성전자는 파운드리와 스마트폰·가전 사업이 함께 있어 매출 구성이 더 다양합니다. 실제 영향은 각사의 HBM 공급 계약, 가격 협상, 원가 구조에 따라 달라집니다." },
  { question: "반도체 실적이 꺾이면 성과급도 줄어드나요?", answer: "두 회사 모두 성과급이 연간 영업이익이나 사업부 실적과 연동되는 구조라, 실적이 줄면 성과급 재원도 줄어들 가능성이 큽니다. 다만 산정 방식과 노사 협의에 따라 실제 지급액은 달라집니다. 실적 시나리오별 성과급 차이는 반도체 성과급 비교 계산기에서 확인할 수 있습니다." },
];

export const ACS_RELATED = [
  { href: "/reports/samsung-micron-earnings-2026/", label: "삼성전자 vs 마이크론 최신 실적 비교" },
  { href: "/reports/hbm4-vs-hbm5-beneficiary-comparison/", label: "HBM4·HBM4E 차이 총정리" },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 4사 2026~2028 실적 전망" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교 계산기" },
];
