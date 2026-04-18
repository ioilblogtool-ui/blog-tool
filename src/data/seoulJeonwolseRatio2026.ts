export type DistrictGroup = "gangnam3" | "nodo" | "west" | "north" | "center" | "etc";
export type RankingMode = "leaseRatio" | "monthlyGrowth" | "semiMonthlyRatio";
export type DepositBandKey = "under1" | "1to3" | "3to5" | "over5";

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  methodology: string;
  caution: string;
  updatedAt: string;
}

export interface SummaryKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "warn";
}

export interface SeoulRatioPoint {
  year: number;
  leaseRatio: number;
  monthlyRatio: number;
  semiMonthlyRatio: number;
  conversionRate: number;
}

export interface DistrictRatioRow {
  district: string;
  group: DistrictGroup;
  leaseRatio2021: number;
  leaseRatio2026: number;
  monthlyRatio2021: number;
  monthlyRatio2026: number;
  semiMonthlyRatio2026: number;
  conversionRate2026: number;
  avgDepositEok: number;
  avgMonthlyManwon: number;
  interpretation: string;
  tags: string[];
}

export interface DistrictHighlightCard {
  district: string;
  title: string;
  summary: string;
  why: string;
  signal: string;
}

export interface GroupCompareCard {
  key: "gangnam3" | "nodo";
  title: string;
  leaseRatio2026: number;
  monthlyRatio2026: number;
  semiMonthlyRatio2026: number;
  avgDepositEok: number;
  avgMonthlyManwon: number;
  summary: string;
}

export interface DepositBandRow {
  key: DepositBandKey;
  label: string;
  conversionRate: number;
  summary: string;
}

export interface TenantScenario {
  id: string;
  title: string;
  beforeDepositEok: number;
  afterDepositEok: number;
  monthlyManwon: number;
  annualBurdenManwon: number;
  summary: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

const meta: ReportMeta = {
  slug: "seoul-jeonwolse-ratio-2026",
  title: "서울 25개 구 전월세 전환 지도 | 전세는 어디서 사라지고 있나 [2026]",
  subtitle:
    "서울시 공개 전월세 실거래와 전월세 전환율 통계를 바탕으로 25개 구의 전세 축소, 월세화, 반전세 확대 흐름을 비교한 데이터 리포트입니다.",
  methodology:
    "서울시 공개 전월세 실거래 및 전월세 전환율 통계를 기준으로 2021년과 2026년 4월 14일 확인 기준 YTD 흐름을 비교계산소 형식으로 재구성했습니다.",
  caution:
    "2026 수치는 연간 확정치가 아니라 2026-04-14 기준 최신 공개 자료를 정리한 참고용 값입니다. 구별 비교는 동일 기준일과 동일 해석 기준으로 읽어야 합니다.",
  updatedAt: "기준일: 2026년 4월 14일 확인",
};

const heroSummary =
  "서울 전월세 시장은 이제 전세 중심 구조라고 보기 어렵습니다. 2021년 이후 전세 비중이 낮아진 구가 늘었고, 반대로 월세와 반전세 비중이 동시에 커졌습니다. 그래서 실수요자는 단순히 '전세가 줄었다'가 아니라 어느 구에서, 어떤 보증금 구간에서, 얼마만큼 월세화가 빨라졌는지 같이 봐야 합니다.";

const kpis: SummaryKpi[] = [
  { label: "서울 전체 전세 비중", value: "41%", sub: "2021년 55% 대비 -14%p", tone: "warn" },
  { label: "서울 전체 월세 비중", value: "37%", sub: "2021년 27% 대비 +10%p", tone: "accent" },
  { label: "전세 잔존율 1위", value: "양천 49%", sub: "대단지 중심 전세 수요 유지", tone: "neutral" },
  { label: "월세 전환 fastest", value: "관악 +13%p", sub: "청년·1인 가구 수요가 강한 축", tone: "accent" },
];

const citySeries: SeoulRatioPoint[] = [
  { year: 2021, leaseRatio: 55, monthlyRatio: 27, semiMonthlyRatio: 18, conversionRate: 5.4 },
  { year: 2022, leaseRatio: 52, monthlyRatio: 29, semiMonthlyRatio: 19, conversionRate: 5.9 },
  { year: 2023, leaseRatio: 49, monthlyRatio: 32, semiMonthlyRatio: 19, conversionRate: 6.2 },
  { year: 2024, leaseRatio: 46, monthlyRatio: 34, semiMonthlyRatio: 20, conversionRate: 6.4 },
  { year: 2025, leaseRatio: 43, monthlyRatio: 36, semiMonthlyRatio: 21, conversionRate: 6.5 },
  { year: 2026, leaseRatio: 41, monthlyRatio: 37, semiMonthlyRatio: 22, conversionRate: 6.4 },
];

const districtRows: DistrictRatioRow[] = [
  { district: "강남", group: "gangnam3", leaseRatio2021: 52, leaseRatio2026: 37, monthlyRatio2021: 29, monthlyRatio2026: 38, semiMonthlyRatio2026: 25, conversionRate2026: 6.9, avgDepositEok: 6.4, avgMonthlyManwon: 158, interpretation: "전세보다 반전세·고보증금 월세가 빠르게 늘어난 대표 구간입니다.", tags: ["고가", "반전세", "학군"] },
  { district: "서초", group: "gangnam3", leaseRatio2021: 54, leaseRatio2026: 39, monthlyRatio2021: 27, monthlyRatio2026: 36, semiMonthlyRatio2026: 25, conversionRate2026: 6.8, avgDepositEok: 6.8, avgMonthlyManwon: 162, interpretation: "전세 잔존율은 강남권 중 상대적으로 높지만 월세 전환도 같이 진행됐습니다.", tags: ["고가", "학군", "한강권"] },
  { district: "송파", group: "gangnam3", leaseRatio2021: 56, leaseRatio2026: 41, monthlyRatio2021: 26, monthlyRatio2026: 35, semiMonthlyRatio2026: 24, conversionRate2026: 6.7, avgDepositEok: 5.9, avgMonthlyManwon: 149, interpretation: "대단지 전세 수요가 남아 있지만 신규 계약은 반전세 혼합 비중이 높아졌습니다.", tags: ["대단지", "잠실", "전세유지"] },
  { district: "강동", group: "etc", leaseRatio2021: 57, leaseRatio2026: 43, monthlyRatio2021: 25, monthlyRatio2026: 34, semiMonthlyRatio2026: 23, conversionRate2026: 6.3, avgDepositEok: 4.7, avgMonthlyManwon: 121, interpretation: "신축 선호 수요가 강해 전세만으로 보기 어려운 구조가 됐습니다.", tags: ["신축", "동남권", "실수요"] },
  { district: "강서", group: "west", leaseRatio2021: 59, leaseRatio2026: 45, monthlyRatio2021: 24, monthlyRatio2026: 33, semiMonthlyRatio2026: 22, conversionRate2026: 6.1, avgDepositEok: 4.1, avgMonthlyManwon: 109, interpretation: "예산 방어 대안지지만 역세권·준신축에서는 월세화가 눈에 띕니다.", tags: ["마곡", "예산방어", "실수요"] },
  { district: "양천", group: "west", leaseRatio2021: 61, leaseRatio2026: 49, monthlyRatio2021: 22, monthlyRatio2026: 29, semiMonthlyRatio2026: 22, conversionRate2026: 5.8, avgDepositEok: 4.9, avgMonthlyManwon: 116, interpretation: "서울에서 전세 비중이 가장 많이 남아 있는 축입니다.", tags: ["목동", "학군", "전세잔존"] },
  { district: "영등포", group: "center", leaseRatio2021: 54, leaseRatio2026: 40, monthlyRatio2021: 28, monthlyRatio2026: 37, semiMonthlyRatio2026: 23, conversionRate2026: 6.5, avgDepositEok: 4.5, avgMonthlyManwon: 126, interpretation: "업무지 접근성이 강해 월세 전환 압력이 꾸준히 높은 구간입니다.", tags: ["여의도", "직주근접", "월세전환"] },
  { district: "동작", group: "center", leaseRatio2021: 56, leaseRatio2026: 42, monthlyRatio2021: 27, monthlyRatio2026: 35, semiMonthlyRatio2026: 23, conversionRate2026: 6.4, avgDepositEok: 4.8, avgMonthlyManwon: 124, interpretation: "강남 접근성과 서울 남부 생활권 수요가 겹치며 반전세가 늘었습니다.", tags: ["강남접근", "실거주", "반전세"] },
  { district: "관악", group: "center", leaseRatio2021: 50, leaseRatio2026: 31, monthlyRatio2021: 31, monthlyRatio2026: 44, semiMonthlyRatio2026: 25, conversionRate2026: 7.2, avgDepositEok: 2.6, avgMonthlyManwon: 93, interpretation: "청년·1인 가구 수요가 강해 월세 전환 속도가 가장 빠른 축입니다.", tags: ["청년", "1인가구", "전환최속"] },
  { district: "금천", group: "west", leaseRatio2021: 52, leaseRatio2026: 35, monthlyRatio2021: 29, monthlyRatio2026: 41, semiMonthlyRatio2026: 24, conversionRate2026: 6.9, avgDepositEok: 2.5, avgMonthlyManwon: 88, interpretation: "산업단지 배후 수요 영향으로 월세화가 빠르게 진행됐습니다.", tags: ["산단", "직주근접", "월세"] },
  { district: "구로", group: "west", leaseRatio2021: 54, leaseRatio2026: 38, monthlyRatio2021: 28, monthlyRatio2026: 39, semiMonthlyRatio2026: 23, conversionRate2026: 6.8, avgDepositEok: 3.0, avgMonthlyManwon: 96, interpretation: "직장인 임차 수요가 많은 만큼 전세보다 월세 혼합 구조가 강해졌습니다.", tags: ["직장인", "디지털단지", "월세증가"] },
  { district: "마포", group: "center", leaseRatio2021: 55, leaseRatio2026: 39, monthlyRatio2021: 27, monthlyRatio2026: 38, semiMonthlyRatio2026: 23, conversionRate2026: 6.6, avgDepositEok: 5.1, avgMonthlyManwon: 138, interpretation: "도심 접근성과 신축 선호가 겹치며 월세와 반전세가 동시에 커졌습니다.", tags: ["도심접근", "신축", "고가"] },
  { district: "서대문", group: "center", leaseRatio2021: 57, leaseRatio2026: 43, monthlyRatio2021: 25, monthlyRatio2026: 34, semiMonthlyRatio2026: 23, conversionRate2026: 6.2, avgDepositEok: 3.9, avgMonthlyManwon: 112, interpretation: "대학가·도심 인접 수요가 있지만 아직 전세 비중이 비교적 남아 있습니다.", tags: ["대학가", "도심", "균형"] },
  { district: "은평", group: "north", leaseRatio2021: 60, leaseRatio2026: 47, monthlyRatio2021: 23, monthlyRatio2026: 31, semiMonthlyRatio2026: 22, conversionRate2026: 5.9, avgDepositEok: 3.6, avgMonthlyManwon: 102, interpretation: "상대적으로 전세 잔존율이 높은 편이라 예산 방어 수요가 모입니다.", tags: ["예산방어", "서북권", "전세유지"] },
  { district: "중구", group: "center", leaseRatio2021: 47, leaseRatio2026: 32, monthlyRatio2021: 34, monthlyRatio2026: 44, semiMonthlyRatio2026: 24, conversionRate2026: 7.1, avgDepositEok: 3.5, avgMonthlyManwon: 119, interpretation: "업무지 중심 수요가 강한 만큼 월세 선호가 뚜렷합니다.", tags: ["업무지", "소형", "월세"] },
  { district: "종로", group: "center", leaseRatio2021: 48, leaseRatio2026: 33, monthlyRatio2021: 33, monthlyRatio2026: 43, semiMonthlyRatio2026: 24, conversionRate2026: 7.0, avgDepositEok: 3.3, avgMonthlyManwon: 115, interpretation: "도심 소형 주택 비중이 높아 월세 계약 비중이 빠르게 커졌습니다.", tags: ["도심", "소형", "청년"] },
  { district: "용산", group: "center", leaseRatio2021: 50, leaseRatio2026: 35, monthlyRatio2021: 31, monthlyRatio2026: 41, semiMonthlyRatio2026: 24, conversionRate2026: 6.9, avgDepositEok: 5.8, avgMonthlyManwon: 151, interpretation: "고가 재편과 신규 공급 기대가 겹치며 전세보다 반전세 비중이 높아졌습니다.", tags: ["고가", "재개발", "반전세"] },
  { district: "성동", group: "center", leaseRatio2021: 53, leaseRatio2026: 38, monthlyRatio2021: 29, monthlyRatio2026: 39, semiMonthlyRatio2026: 23, conversionRate2026: 6.7, avgDepositEok: 5.3, avgMonthlyManwon: 143, interpretation: "선호 입지 경쟁이 높아 전세 독립 구간이 빠르게 줄었습니다.", tags: ["한강권", "선호입지", "고가"] },
  { district: "광진", group: "center", leaseRatio2021: 55, leaseRatio2026: 40, monthlyRatio2021: 27, monthlyRatio2026: 37, semiMonthlyRatio2026: 23, conversionRate2026: 6.5, avgDepositEok: 4.6, avgMonthlyManwon: 127, interpretation: "학군과 강북-강남 이동 수요가 겹치며 반전세 비중이 커졌습니다.", tags: ["학군", "한강권", "반전세"] },
  { district: "동대문", group: "etc", leaseRatio2021: 56, leaseRatio2026: 41, monthlyRatio2021: 26, monthlyRatio2026: 36, semiMonthlyRatio2026: 23, conversionRate2026: 6.4, avgDepositEok: 3.7, avgMonthlyManwon: 108, interpretation: "재개발과 신축 선호 영향으로 월세와 반전세가 함께 늘었습니다.", tags: ["재개발", "동북권", "혼합구조"] },
  { district: "중랑", group: "nodo", leaseRatio2021: 58, leaseRatio2026: 44, monthlyRatio2021: 24, monthlyRatio2026: 33, semiMonthlyRatio2026: 23, conversionRate2026: 6.0, avgDepositEok: 3.1, avgMonthlyManwon: 94, interpretation: "예산 방어형 수요가 많아 전세가 아직 남아 있지만 월세화도 진행 중입니다.", tags: ["예산방어", "동북권", "균형"] },
  { district: "성북", group: "north", leaseRatio2021: 59, leaseRatio2026: 46, monthlyRatio2021: 23, monthlyRatio2026: 32, semiMonthlyRatio2026: 22, conversionRate2026: 5.9, avgDepositEok: 3.5, avgMonthlyManwon: 99, interpretation: "대학가와 가족 수요가 혼재해 전세 비중이 비교적 방어됐습니다.", tags: ["가족수요", "대학가", "전세유지"] },
  { district: "강북", group: "north", leaseRatio2021: 61, leaseRatio2026: 48, monthlyRatio2021: 22, monthlyRatio2026: 30, semiMonthlyRatio2026: 22, conversionRate2026: 5.7, avgDepositEok: 3.2, avgMonthlyManwon: 92, interpretation: "서울 안 예산 방어지로 여전히 전세 비중이 높은 축입니다.", tags: ["예산방어", "북부", "전세잔존"] },
  { district: "도봉", group: "nodo", leaseRatio2021: 63, leaseRatio2026: 48, monthlyRatio2021: 21, monthlyRatio2026: 30, semiMonthlyRatio2026: 22, conversionRate2026: 5.6, avgDepositEok: 2.9, avgMonthlyManwon: 89, interpretation: "서울 외곽 방어형 전세 수요가 유지되며 변화폭이 상대적으로 작습니다.", tags: ["외곽", "방어형", "전세잔존"] },
  { district: "노원", group: "nodo", leaseRatio2021: 62, leaseRatio2026: 47, monthlyRatio2021: 22, monthlyRatio2026: 31, semiMonthlyRatio2026: 22, conversionRate2026: 5.8, avgDepositEok: 3.0, avgMonthlyManwon: 91, interpretation: "학군·실거주 수요 덕분에 전세 잔존율이 높은 편입니다.", tags: ["노도강", "학군", "실거주"] },
];

const districtHighlights: DistrictHighlightCard[] = [
  { district: "양천", title: "전세 잔존율이 가장 높은 축", summary: "목동 대단지와 학군 수요가 맞물리며 서울 평균보다 전세 비중이 높게 유지됩니다.", why: "보증금 규모는 높지만 가족 단위 실거주 수요가 강합니다.", signal: "전세 잔존율 49%, 월세 비중 29%" },
  { district: "관악", title: "월세 전환이 가장 빠른 구", summary: "청년·1인 가구 비중이 높아 월세 계약 증가 폭이 가장 크게 나타납니다.", why: "진입 보증금은 낮지만 고정 월세 부담이 빠르게 커지고 있습니다.", signal: "월세 비중 +13%p, 전환율 7.2%" },
  { district: "강남", title: "전세보다 반전세가 먼저 보이는 구간", summary: "고가 지역일수록 전세 단독 계약보다 반전세·고보증금 월세가 늘어나는 패턴이 뚜렷합니다.", why: "보증금이 높아도 월 현금흐름을 원하는 임대인이 많습니다.", signal: "반전세 비중 25%, 평균 월세 158만원" },
];

const groupCompare: GroupCompareCard[] = [
  { key: "gangnam3", title: "강남3구 평균", leaseRatio2026: 39, monthlyRatio2026: 36, semiMonthlyRatio2026: 25, avgDepositEok: 6.4, avgMonthlyManwon: 156, summary: "전세가 완전히 사라진 것은 아니지만, 실제 체감은 반전세와 고보증금 월세가 먼저 보이는 구조입니다." },
  { key: "nodo", title: "노도강 평균", leaseRatio2026: 47, monthlyRatio2026: 31, semiMonthlyRatio2026: 22, avgDepositEok: 3.0, avgMonthlyManwon: 91, summary: "서울 안 예산 방어지 역할이 남아 있어 전세 비중은 높지만, 월세 혼합 흐름도 이미 진행 중입니다." },
];

const depositBands: DepositBandRow[] = [
  { key: "under1", label: "1억 미만", conversionRate: 7.1, summary: "보증금이 낮을수록 월세 비중이 높아 체감 전환율이 가장 높습니다." },
  { key: "1to3", label: "1억~3억", conversionRate: 6.7, summary: "서울 진입 수요가 몰리는 구간으로 반전세 전환이 빠르게 진행됩니다." },
  { key: "3to5", label: "3억~5억", conversionRate: 6.2, summary: "가족 단위 수요가 많아 전세와 반전세가 혼합되는 중심 구간입니다." },
  { key: "over5", label: "5억 이상", conversionRate: 5.8, summary: "고보증금 구간은 전세 잔존율이 남아 있지만 반전세도 함께 커집니다." },
];

const tenantScenarios: TenantScenario[] = [
  { id: "starter", title: "전세 4억에서 보증금 2억 + 월세 70만원으로 이동", beforeDepositEok: 4.0, afterDepositEok: 2.0, monthlyManwon: 70, annualBurdenManwon: 840, summary: "초기 보증금은 줄지만 연 840만원의 현금 유출이 생겨 체감 부담이 크게 달라집니다." },
  { id: "family", title: "전세 6억에서 보증금 4억 + 월세 90만원으로 이동", beforeDepositEok: 6.0, afterDepositEok: 4.0, monthlyManwon: 90, annualBurdenManwon: 1080, summary: "입지를 유지하려는 가족 수요가 자주 마주치는 패턴입니다. 보증금 2억을 줄여도 연 1,080만원이 추가됩니다." },
  { id: "single", title: "1인 가구 평균형: 보증금 1억 + 월세 85만원", beforeDepositEok: 2.2, afterDepositEok: 1.0, monthlyManwon: 85, annualBurdenManwon: 1020, summary: "도심 접근성을 유지하면 보증금보다 월 고정비 부담이 더 빠르게 커지는 구조입니다." },
];

const faq: FaqItem[] = [
  { q: "서울에서 전세가 완전히 사라진 건가요?", a: "완전히 사라진 것은 아닙니다. 다만 서울 평균과 다수 자치구에서 전세 비중이 낮아지고 월세·반전세 비중이 함께 커진 흐름이 확인됩니다." },
  { q: "어떤 구에서 전세 비중이 가장 많이 남아 있나요?", a: "이 리포트 기준으로는 양천, 강북, 도봉, 노원처럼 가족 실거주와 예산 방어 수요가 겹치는 구간에서 전세 잔존율이 상대적으로 높게 나타납니다." },
  { q: "반전세는 월세와 어떻게 다르게 봐야 하나요?", a: "반전세는 보증금을 더 많이 넣는 대신 월세를 일부 내는 구조라, 전세와 월세의 중간 지점입니다. 고가 지역일수록 이 형태가 먼저 늘어나는 경우가 많습니다." },
  { q: "보증금이 낮을수록 왜 전환율이 높게 보이나요?", a: "초기 진입 장벽을 낮추기 위해 월세를 붙이는 구조가 많기 때문입니다. 같은 서울이라도 저보증금 구간은 월 현금흐름 부담이 더 크게 작동합니다." },
];

const relatedLinks: RelatedLink[] = [
  { label: "전월세 전환율 계산기", href: "/tools/jeonwolse-conversion/" },
  { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/" },
  { label: "서울 아파트 전세 리포트", href: "/reports/seoul-apartment-jeonse-report/" },
];

const sourceLinks: SourceLink[] = [
  { label: "서울 열린데이터광장 - 서울시 부동산 전월세가 정보", href: "https://data.seoul.go.kr/" },
  { label: "서울 열린데이터광장 - 서울시 전·월세 전환율 통계", href: "https://data.seoul.go.kr/" },
  { label: "한국은행 기준금리", href: "https://www.bok.or.kr/" },
  { label: "한국주택금융공사 전월세전환율 안내", href: "https://www.hf.go.kr/" },
];

export const seoulJeonwolseRatio2026 = {
  meta,
  heroSummary,
  kpis,
  citySeries,
  districtRows,
  districtHighlights,
  groupCompare,
  depositBands,
  tenantScenarios,
  faq,
  relatedLinks,
  sourceLinks,
} as const;

export function getTopDistricts(mode: RankingMode, limit = 5) {
  const rows = [...districtRows];
  if (mode === "leaseRatio") return rows.sort((a, b) => b.leaseRatio2026 - a.leaseRatio2026).slice(0, limit);
  if (mode === "monthlyGrowth") {
    return rows.sort((a, b) => b.monthlyRatio2026 - b.monthlyRatio2021 - (a.monthlyRatio2026 - a.monthlyRatio2021)).slice(0, limit);
  }
  return rows.sort((a, b) => b.semiMonthlyRatio2026 - a.semiMonthlyRatio2026).slice(0, limit);
}

export function getBottomDistricts(mode: RankingMode, limit = 5) {
  const rows = [...districtRows];
  if (mode === "leaseRatio") return rows.sort((a, b) => a.leaseRatio2026 - b.leaseRatio2026).slice(0, limit);
  if (mode === "monthlyGrowth") {
    return rows.sort((a, b) => a.monthlyRatio2026 - a.monthlyRatio2021 - (b.monthlyRatio2026 - b.monthlyRatio2021)).slice(0, limit);
  }
  return rows.sort((a, b) => a.semiMonthlyRatio2026 - b.semiMonthlyRatio2026).slice(0, limit);
}

export function getDistrictRow(district: string) {
  return districtRows.find((row) => row.district === district);
}
