export type EvidenceBadge = "공식" | "확인 필요" | "참고";
export type GovernorTerm = "이재명" | "권한대행" | "김동연" | "추미애";

export interface GfcMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
  dataSourceLabel: string;
  notice: string;
  neutralityNotice: string;
}

export const GFC_META: GfcMeta = {
  slug: "gyeonggi-fiscal-crisis-2026",
  title: "경기도 재정위기 2026 완전 정리",
  seoTitle: "경기도 재정위기 2026 완전 정리 | 41조 예산인데 왜 비상선언",
  seoDescription:
    "경기도 예산 41.7조 중 자체재원은 3.5조, 올해 감액추경만 7,700억 원입니다. 지방채·기금 현황과 이재명·김동연·추미애 시기별 채무 비교표까지 정리했습니다.",
  updatedAt: "2026-08-07",
  dataSourceLabel: "경기도뉴스포털 공식 발표(2026-08-05) 및 언론 보도",
  notice:
    "이 페이지 수치는 경기도 공식 발표와 언론 보도를 출처와 함께 정리한 참고 자료입니다. 실제 감액추경안은 경기도의회 심의·의결을 거쳐야 확정되며, 확정 결과가 나오면 업데이트가 필요합니다.",
  neutralityNotice:
    "이 리포트는 특정 정치인·정당을 지지하거나 비판하지 않습니다. 책임 소재에 대한 주장은 각 진영 발표를 출처와 함께 그대로 병기하며, 판단은 독자의 몫입니다.",
};

export interface KpiCardItem {
  label: string;
  value: string;
  note: string;
  badge: EvidenceBadge;
}

export const GFC_KPI_CARDS: KpiCardItem[] = [
  {
    label: "2026년 경기도 전체 예산",
    value: "약 41.7조 원",
    note: "2026-08-05 재정 비상 선언 발표 기준. 2025-12-26 확정 예산(40조 577억 원, 경향신문 보도)과 차이가 있어 함께 확인이 필요합니다.",
    badge: "확인 필요",
  },
  {
    label: "자체재원(재량 지출 가능분)",
    value: "약 3.5조 원",
    note: "전체 예산 중 도가 정책적으로 움직일 수 있는 재원입니다. 41.7조 전체를 마음대로 쓸 수 있는 것이 아닙니다.",
    badge: "공식",
  },
  {
    label: "올해 필요 감액추경",
    value: "약 7,700억 원",
    note: "자체재원 3.5조 대비 약 22% 규모로, 신규 사업 축소·조직 구조조정 논의의 배경입니다.",
    badge: "공식",
  },
  {
    label: "2025년 지방채 발행 한도 소진율",
    value: "99.6%",
    note: "발행 한도 9,460억 원 중 9,430억 원 발행. 경기도는 20년 만에 최고 수준이라고 밝혔습니다.",
    badge: "공식",
  },
];

export interface CauseCard {
  title: string;
  body: string;
}

export const GFC_CAUSE_CARDS: CauseCard[] = [
  {
    title: "취득세 수입이 30% 가까이 줄었다",
    body: "경기도 세입은 부동산 거래 관련 취득세 비중이 큽니다. 취득세는 2022년 약 11조 원에서 2026년 전망 약 8조 원으로 줄었습니다.",
  },
  {
    title: "3기 신도시 취득세도 기대보다 적다",
    body: "당초 약 6,500억 원을 기대했지만 공공임대 확대 등의 영향으로 현재 전망은 약 2,300억 원 수준입니다. 반면 교통망·소방 등 기반시설 지출은 계속 들어갑니다.",
  },
  {
    title: "복지·매칭사업 같은 고정비는 줄지 않는다",
    body: "노인장기요양, 급식비 지원처럼 매년 반복되는 필수사업은 세입이 줄어도 축소하기 어렵습니다. 그 결과 2026년 예산에서 일부 사업이 12개월치가 아닌 9개월치만 편성됐다는 것이 경기도의 설명입니다.",
  },
];

export interface ShortfallItem {
  label: string;
  amountEokwon: number;
  amountLabel: string;
}

export const GFC_SHORTFALL_ITEMS: ShortfallItem[] = [
  { label: "노인장기요양", amountEokwon: 1234, amountLabel: "약 1,234억 원" },
  { label: "도교육청 급식비 지원", amountEokwon: 548, amountLabel: "약 548억 원" },
  { label: "시내버스 공공관리제 운영지원", amountEokwon: 291, amountLabel: "약 291억 원" },
  { label: "경기도 산후조리비 지원", amountEokwon: 80, amountLabel: "약 80억 원" },
  { label: "친환경 우수 농축산물 학교급식 지원", amountEokwon: 34, amountLabel: "약 34억 원" },
  { label: "농작물재해보험 가입지원", amountEokwon: 29, amountLabel: "약 29억 원" },
  { label: "가족돌봄수당 지원", amountEokwon: 14, amountLabel: "약 14억 원" },
  { label: "소아응급 책임의료기관 육성", amountEokwon: 10, amountLabel: "약 10억 원" },
];

export interface PolicyMeasure {
  order: number;
  title: string;
  body: string;
}

export const GFC_POLICY_MEASURES: PolicyMeasure[] = [
  { order: 1, title: "고위공직자 비용 삭감", body: "도지사 포함 고위공직자 업무경비 등을 감액합니다." },
  { order: 2, title: "세출 구조조정", body: "일회성 행사·선심성·불요불급 사업 편성과 집행을 전면 차단합니다." },
  { order: 3, title: "조직 구조조정", body: "실·국, 참모조직, 산하 공공기관 인력을 재배치합니다." },
  { order: 4, title: "세입구조 개편", body: "지방소비세 확대, 기업유치 세수 배분 개선, 국비 매칭 부담 개선을 추진합니다." },
];

export interface DebtYearPoint {
  year: string;
  debtEokwon: number;
  governor: GovernorTerm;
  note?: string;
}

export const GFC_DEBT_TIMELINE: DebtYearPoint[] = [
  { year: "2019", debtEokwon: 21754, governor: "이재명" },
  { year: "2020", debtEokwon: 17693, governor: "이재명", note: "최저점" },
  { year: "2021", debtEokwon: 29112, governor: "이재명", note: "전년比 +64.5%" },
  { year: "2022", debtEokwon: 38362, governor: "김동연" },
  { year: "2023", debtEokwon: 45067, governor: "김동연" },
  { year: "2024", debtEokwon: 49847, governor: "김동연" },
  { year: "2025", debtEokwon: 61357, governor: "김동연" },
  { year: "2026.06", debtEokwon: 62368, governor: "추미애", note: "취임 시점" },
];

export const GFC_DEBT_CAUTION =
  "경기도 관계자는 채무 대부분이 자동차 구입 시 의무 매입하는 지역개발채권이며 '순수 채무는 없는 상태'라고 설명한 보도가 있습니다. 다만 이는 경기도 측 해석이며, 채무 총액 자체가 늘어난 사실과는 별개로 함께 읽어야 합니다. 2018년 이전 수치는 확보하지 못했습니다.";

export interface FiscalIndependenceYearPoint {
  year: string;
  rate: number;
  governor: GovernorTerm;
  badge: EvidenceBadge;
}

export const GFC_FISCAL_INDEPENDENCE: FiscalIndependenceYearPoint[] = [
  { year: "2022", rate: 55.73, governor: "김동연", badge: "확인 필요" },
  { year: "2023", rate: 51.9, governor: "김동연", badge: "확인 필요" },
  { year: "2024", rate: 45.42, governor: "김동연", badge: "확인 필요" },
  { year: "2025", rate: 45.36, governor: "김동연", badge: "확인 필요" },
];

export const GFC_FISCAL_INDEPENDENCE_CAUTION =
  "공공데이터포털에는 2024년 경기도 본청 재정자립도가 55.1%로 다른 수치도 확인됩니다. 산정 기준(본청 단독 vs 광역+통합, 당초예산 vs 결산) 차이로 추정되며, 하나의 공식 기준으로 통일하려면 행정안전부 지방재정365 원자료 재확인이 필요합니다. 2018~2021년 수치는 확보하지 못했습니다.";

export interface ResponsibilityClaim {
  side: string;
  claim: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const GFC_RESPONSIBILITY_CLAIMS: ResponsibilityClaim[] = [
  {
    side: "추미애 지사 측",
    claim:
      "김동연 도정이 2025년 지방채를 한도의 99.6%까지 발행하고, 기금에서 5,588억 원을 일반회계로 끌어 쓴 결과 '미완의 미생 예산'을 남겼다.",
    sourceLabel: "경기도 자체 발표 (경기도뉴스포털)",
    sourceUrl: "https://gnews.gg.go.kr/news/news_detail.do?number=202608051737578186C052&s_code=C400",
  },
  {
    side: "이준석 (개혁신당 대표)",
    claim:
      "채무는 이재명 지사 시절인 2020년 1조7,693억 원에서 2021년 2조9,112억 원으로 이미 64.5% 늘었다. 최근 5년 중 가장 가파른 증가였다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
  {
    side: "제기된 의혹 (사실로 단정 아님)",
    claim:
      "8월 17일 민주당 전당대회(정청래·김민석 초접전) 국면에서 나온 발표라 정청래 후보에게 유리하게 작용하려는 것 아니냐는 의혹이 친명 커뮤니티 등에서 제기됐다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
  {
    side: "추미애 지사 측 반박",
    claim: "재정 문제는 인수위 때부터 계속 공개해온 사안이며, 감액추경을 앞둔 구조조정 설명일 뿐이다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
];

export interface SourceLink {
  label: string;
  href: string;
  description: string;
}

export const GFC_SOURCES: SourceLink[] = [
  {
    label: "경기도뉴스포털",
    href: "https://gnews.gg.go.kr/news/news_detail.do?number=202608051737578186C052&s_code=C400",
    description: "추미애 지사 재정 비상 선언 공식 발표 원문",
  },
  {
    label: "주간경향",
    href: "https://weekly.khan.co.kr/article/202608061202001",
    description: "책임 공방, 이준석 반론, 전당대회 관련 배경 보도",
  },
  {
    label: "이투데이",
    href: "https://www.etoday.co.kr/news/view/2611470",
    description: "경기도 채무 12년치 도의원 공개자료 보도",
  },
  {
    label: "KPI뉴스",
    href: "https://www.kpinews.kr/newsView/1065598433939531",
    description: "경기도 최근 5년 지방채 규모 연도별 보도",
  },
  {
    label: "경향신문",
    href: "https://www.khan.co.kr/article/202512262000001",
    description: "2026년 경기도 확정 예산(40조 577억 원) 보도",
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const GFC_FAQ: FaqItem[] = [
  {
    q: "경기도 재정 비상 선언은 경기도가 부도난다는 뜻인가요?",
    a: "아닙니다. 41조 원 넘는 예산을 가진 광역자치단체이고 세입 자체가 사라진 것도 아닙니다. 문제는 총예산이 아니라 도가 정책적으로 쓸 수 있는 자체재원(약 3.5조 원) 대비 올해 줄여야 할 금액(약 7,700억 원)이 22% 수준으로 크다는 현금흐름·가용재원 문제입니다.",
  },
  {
    q: "예산이 41.7조나 되는데 왜 돈이 없다는 건가요?",
    a: "전체 예산 41.7조 원 중 상당 부분은 국비 매칭사업이나 이미 용도가 정해진 특별회계 등으로 묶여 있어, 경기도가 자율적으로 편성·조정할 수 있는 자체재원은 약 3.5조 원 수준입니다. 이 자체재원 안에서 7,700억 원을 줄여야 하는 상황입니다.",
  },
  {
    q: "감액추경은 확정된 건가요?",
    a: "2026-08-05 발표는 경기도의 재정 비상 상황 선언과 감액추경 필요성 설명이며, 실제 감액추경안은 이후 경기도의회 심의·의결 절차를 거쳐야 확정됩니다. 이 페이지는 발표 시점 수치를 기준으로 하며, 확정 결과가 나오면 업데이트가 필요합니다.",
  },
  {
    q: "이번 재정 위기는 김동연 전 지사 책임인가요?",
    a: "추미애 지사 측은 김동연 도정의 지방채 발행과 기금 사용을 문제 삼았지만, 이준석 개혁신당 대표는 이재명 지사 시절인 2020~2021년에도 채무가 64.5% 늘었다는 점을 반론 근거로 제시했습니다. 이 리포트는 결론을 내리지 않고 양측 주장을 출처와 함께 병기합니다.",
  },
  {
    q: "경기도 채무는 정말 '빚'인가요?",
    a: "경기도 관계자는 채무 대부분이 자동차 구입 시 의무 매입하는 지역개발채권이며 순수 채무는 아니라고 설명한 보도가 있습니다. 다만 채무 총액 자체가 늘어난 사실과는 별개의 해석이므로, 이 페이지는 두 설명을 함께 안내합니다.",
  },
  {
    q: "이 리포트는 어느 정치인 편을 드나요?",
    a: "어느 쪽도 지지하거나 비판하지 않습니다. 발표 수치는 출처를 명시한 사실로, 책임 공방은 각 진영 주장을 그대로 병기해 판단은 독자의 몫으로 남겨둡니다.",
  },
];

export const GFC_SEO_INTRO: string[] = [
  "2026년 8월 5일 추미애 경기도지사는 경기도 재정을 '비상 상황'으로 공식 선언했습니다. 41.7조 원 규모 예산을 가진 광역자치단체의 재정 비상 선언은 이례적이라 검색 수요가 빠르게 늘었지만, 개별 기사만 봐서는 실제로 얼마나 심각한 상황인지 종합적으로 판단하기 어렵습니다.",
  "핵심은 예산 총액이 아니라 가용재원입니다. 41.7조 원 중 경기도가 정책적으로 움직일 수 있는 자체재원은 약 3.5조 원이고, 이 중 7,700억 원을 올해 안에 줄여야 한다는 것이 이번 발표의 골자입니다. 취득세 수입이 2022년 11조 원에서 2026년 8조 원 수준으로 줄어든 반면, 복지·교통 같은 고정비 지출은 줄지 않으면서 격차가 커졌습니다.",
  "이 리포트는 발표 수치 정리에 더해 이재명·김동연·추미애 3개 임기의 채무·재정자립도 추이를 함께 비교합니다. 채무는 2020년 1조7,693억 원(최저점) 이후 2021년부터 5년 연속 늘어 2026년 6월 기준 6조2,368억 원에 이르렀습니다. 재정자립도는 2022년 55.73%에서 2025년 45.36%로 10년 만에 최저 수준을 기록했습니다.",
  "누구 책임인지는 진영에 따라 다르게 말합니다. 추미애 지사 측은 김동연 전 지사의 지방채·기금 운용을 문제 삼았고, 이준석 개혁신당 대표는 이재명 지사 시절인 2020~2021년에도 채무가 64.5% 늘었다는 점을 반론으로 제시했습니다. 이 리포트는 결론을 내리지 않고 양측 주장을 출처와 함께 병기합니다. 실제 감액추경 결과는 경기도의회 심의를 거쳐야 확정되므로, 이후 업데이트가 필요합니다.",
];

export const GFC_SEO_CRITERIA: string[] = [
  "발표 수치는 경기도뉴스포털 원문을 기준으로 합니다.",
  "채무·재정자립도는 출처를 명시하고, 출처 간 값이 다르면 통일하지 않고 병기합니다.",
  "책임 공방은 결론을 내리지 않고 각 진영 발표를 그대로 인용합니다.",
  "감액추경 확정 결과가 나오면 업데이트가 필요합니다.",
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const GFC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/gyeonggi-governor-candidate-assets-2026/", label: "경기도지사 후보 재산·부동산 비교 2026" },
  { href: "/reports/local-election-governor-2026/", label: "2026 지방선거 시도지사 당선자 공약 지도" },
  { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교 2026" },
  { href: "/reports/gyeonggi-family-care-allowance-2026/", label: "경기도 가족돌봄수당 안내" },
];
