// ── 타입 ──────────────────────────────────────────

export type SchoolRegion = "jeju" | "seoul_songdo";

export type TuitionTier = {
  tierKey: string;
  tierLabel: string;
  krwPortion: number;
  usdPortion: number;
  isEstimatedSplit?: boolean;
  boardingSurchargeKrw?: number;
  boardingSurchargeUsd?: number;
  suggestedYears: number;
};

export type InternationalSchoolProfile = {
  id: string;
  name: string;
  nameKo: string;
  country: "KR";
  region: SchoolRegion;
  regionLabel: string;
  boardingAvailable: boolean;
  boardingNote?: string;
  tuitionTiers: TuitionTier[];
  applicationFeeKrw: number;
  firstYearExtraKrw: number;
  firstYearExtraNote: string;
  multiChildNote: string;
  sourceUrl: string;
  asOfDate: string;
  dataNote?: string;
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

// ── 메타 ──────────────────────────────────────────

export const IST_META = {
  slug: "international-school-tuition-calculator-2026",
  title: "국제학교 학비 계산기",
  seoTitle: "국제학교 학비 계산기 2026 | 연간 비용 바로 계산",
  seoDescription:
    "지역·학교·학년·자녀 수 입력하면 국제학교 연간 학비와 월 부담액, 재학 기간 총비용까지 바로 계산. 제주·서울·송도 7개교 데이터 포함.",
  description: "지역과 학교, 학년, 자녀 수를 입력하면 국제학교 연간 학비와 월 부담액, 소득 대비 비율까지 바로 계산합니다.",
  updatedAt: "2026-07-08",
  defaultExchangeRate: 1380,
  dataNote:
    "학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준이며, 학교마다 학비를 매년 개정합니다. 실제 납부 금액은 각 학교 입학처에서 반드시 재확인하세요. 이 계산 결과는 입학 가능 여부와 무관한 재정 계획 참고용입니다.",
};

// ── 학교 데이터 ────────────────────────────────────

export const IST_SCHOOLS: InternationalSchoolProfile[] = [
  {
    id: "nlcs-jeju",
    name: "NLCS Jeju",
    nameKo: "엔엘씨에스 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    tuitionTiers: [
      {
        tierKey: "elementary",
        tierLabel: "초등",
        krwPortion: 0,
        usdPortion: 25500,
        isEstimatedSplit: true,
        boardingSurchargeUsd: 9000,
        suggestedYears: 6,
      },
      {
        tierKey: "secondary",
        tierLabel: "중·고등",
        krwPortion: 0,
        usdPortion: 35500,
        isEstimatedSplit: true,
        boardingSurchargeUsd: 9000,
        suggestedYears: 6,
      },
    ],
    applicationFeeKrw: 780_000,
    firstYearExtraKrw: 2_600_000,
    firstYearExtraNote: "지원비·입학비 각 $300, 예치금 $2,000 (전액 달러 표시, 원화 환산은 계산기 환율 입력값 적용)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.nlcsjeju.co.kr/admissions/fees/",
    asOfDate: "2026-07-08",
    dataNote: "KRW/USD 정확한 분담 비율은 학교 Fee Policy PDF 확인 필요 — 이 데이터는 달러 환산 총액 기준 근사치입니다.",
  },
  {
    id: "branksome-hall-asia",
    name: "Branksome Hall Asia",
    nameKo: "브랭섬홀 아시아",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    tuitionTiers: [
      {
        tierKey: "all_grades",
        tierLabel: "전 학년 (통학 기준, 학년별 상이)",
        krwPortion: 41_547_200,
        usdPortion: 0,
        boardingSurchargeUsd: 17000,
        suggestedYears: 12,
      },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 3_000_000,
    firstYearExtraNote: "신규 입학 예치금 3,000,000원 (첫 학비에서 차감)",
    multiChildNote: "3번째 자녀 학비 15% 할인, 4번째 이후 자녀 30% 할인 (학교 공식 정책)",
    sourceUrl: "https://www.branksome.asia/admissions/tuition-fees",
    asOfDate: "2026-07-08",
    dataNote: "학년별 학비는 KRW 41,547,200~50,823,200 범위입니다 — 이 데이터는 하한값을 대표값으로 사용해 상급 학년은 실제보다 낮게 나올 수 있습니다.",
  },
  {
    id: "kis-jeju",
    name: "KIS Jeju",
    nameKo: "한국국제학교 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: true,
    boardingNote: "기숙사비는 학기별 별도 청구 — 정확한 금액 확인 필요",
    tuitionTiers: [
      {
        tierKey: "high",
        tierLabel: "고등 (참고 대표값 — 초·중등은 이보다 낮을 수 있음)",
        krwPortion: 40_000_000,
        usdPortion: 0,
        suggestedYears: 12,
      },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 8_500_000,
    firstYearExtraNote: "예치금 3,000,000원 + 자본비·등록비·교복·버스비 등 첫해 추가 5,000,000~12,000,000원 (범위, 중간값 적용)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://kis.ac/tuition-and-fees/",
    asOfDate: "2026-07-08",
    dataNote: "초·중등 학비 미확인 — 고등 학비를 대표값으로 사용하므로 저학년 자녀는 실제보다 높게 계산될 수 있습니다.",
  },
  {
    id: "sja-jeju",
    name: "SJA Jeju",
    nameKo: "세인트존스베리아카데미 제주",
    country: "KR",
    region: "jeju",
    regionLabel: "제주",
    boardingAvailable: false,
    boardingNote: "기숙사 운영 여부 확인 필요",
    tuitionTiers: [
      {
        tierKey: "early_elementary",
        tierLabel: "유치~초등",
        krwPortion: 24_130_000,
        usdPortion: 8990,
        suggestedYears: 8,
      },
      {
        tierKey: "middle",
        tierLabel: "중등",
        krwPortion: 25_470_000,
        usdPortion: 9490,
        suggestedYears: 3,
      },
    ],
    applicationFeeKrw: 400_000,
    firstYearExtraKrw: 400_000,
    firstYearExtraNote: "지원비 400,000원 (환불 불가) — 예치금·입학금은 별도 확인 필요",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.sjajeju.kr/admissions/tuition-fees",
    asOfDate: "2026-07-08",
    dataNote: "고등학교 학비 미확인 — 중등 학비로 대체 계산 시 실제보다 낮게 나올 수 있습니다.",
  },
  {
    id: "chadwick-songdo",
    name: "Chadwick International",
    nameKo: "채드윅 송도",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "village", tierLabel: "Village School (유치~초등)", krwPortion: 27_360_000, usdPortion: 15530, suggestedYears: 8 },
      { tierKey: "middle", tierLabel: "Middle School (중등)", krwPortion: 29_440_000, usdPortion: 16670, suggestedYears: 3 },
      { tierKey: "upper", tierLabel: "Upper School (고등)", krwPortion: 32_220_000, usdPortion: 18270, suggestedYears: 4 },
    ],
    applicationFeeKrw: 0,
    firstYearExtraKrw: 3_000_000,
    firstYearExtraNote: "입학·재등록 예치금 3,000,000원",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.chadwickinternational.org/admission/tuition-and-fees",
    asOfDate: "2026-07-08",
    dataNote: "2026/27학년도 확정 요율은 2026년 1월 공개 예정 — 최신 수치 재확인을 권장합니다.",
  },
  {
    id: "sfs-seoul",
    name: "Seoul Foreign School",
    nameKo: "서울외국인학교",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "elementary", tierLabel: "초등 (참고 대표값)", krwPortion: 17_500_000, usdPortion: 7000, suggestedYears: 6 },
      { tierKey: "high", tierLabel: "고등", krwPortion: 26_160_000, usdPortion: 13090, suggestedYears: 3 },
    ],
    applicationFeeKrw: 1_000_000,
    firstYearExtraKrw: 5_500_000,
    firstYearExtraNote: "지원비 400,000원 + 등록비 600,000원 + 신입생 입학금 5,500,000원 (재학생 재등록 예치금은 6,500,000원으로 별도)",
    multiChildNote: "다자녀 할인 정책 공식 확인 필요",
    sourceUrl: "https://www.seoulforeign.org/admissions/tuition-and-fees",
    asOfDate: "2026-07-08",
    dataNote: "중등 학비 미확인 — 초등 대표값 사용 시 중등 자녀는 실제와 다를 수 있습니다.",
  },
  {
    id: "dulwich-seoul",
    name: "Dulwich College Seoul",
    nameKo: "덜위치 칼리지 서울",
    country: "KR",
    region: "seoul_songdo",
    regionLabel: "서울·경기·송도",
    boardingAvailable: false,
    tuitionTiers: [
      { tierKey: "nursery_reception", tierLabel: "Nursery~Reception (유치)", krwPortion: 40_700_000, usdPortion: 0, suggestedYears: 2 },
      { tierKey: "y1_6", tierLabel: "Year 1-6 (초등)", krwPortion: 41_000_000, usdPortion: 0, suggestedYears: 6 },
      { tierKey: "y7_9", tierLabel: "Year 7-9 (중등)", krwPortion: 42_400_000, usdPortion: 0, suggestedYears: 3 },
      { tierKey: "y10_11", tierLabel: "Year 10-11 (고등 전반)", krwPortion: 43_600_000, usdPortion: 0, suggestedYears: 2 },
      { tierKey: "y12_13", tierLabel: "Year 12-13 (고등 후반)", krwPortion: 44_800_000, usdPortion: 0, suggestedYears: 2 },
    ],
    applicationFeeKrw: 400_000,
    firstYearExtraKrw: 7_000_000,
    firstYearExtraNote: "지원비 400,000원 + 자본비 4,000,000원(신규) + 배치 예치금 3,000,000원. 버스비는 별도(왕복 4,720,000원/편도 3,780,000원)",
    multiChildNote: "연납 시 5% 할인, 3자녀 이상 전일제 재학 시 1인당 5% 할인 (학교 공식 정책)",
    sourceUrl: "https://seoul.dulwich.org/admissions/apply/fees",
    asOfDate: "2026-07-08",
    dataNote: "전액 원화 표시 — 이 7개교 중 유일하게 달러 분담분이 없는 학교입니다.",
  },
];

export const IST_FAQ: FaqItem[] = [
  {
    question: "국제학교 학비는 원화로만 내나요, 달러로도 내야 하나요?",
    answer:
      "학교마다 다릅니다. Dulwich College Seoul은 전액 원화로 청구하지만, NLCS Jeju·Chadwick·SJA Jeju 등 대부분의 학교는 학비를 원화 부분과 달러 부분으로 나눠 청구합니다. 이 계산기는 학교별 원화·달러 분담 비율을 반영해 환율 입력값으로 원화 총액을 계산합니다.",
  },
  {
    question: "제주 국제학교와 서울 국제학교 중 어디가 더 저렴한가요?",
    answer:
      "학년과 기숙 여부에 따라 달라집니다. 통학 기준으로는 서울권 학교가 제주 일부 학교보다 낮은 경우가 있지만, 제주는 기숙 비용이 추가되면 총비용이 서울권보다 높아지는 경우가 많습니다. 학교와 학년을 선택해 직접 비교하는 것이 정확합니다.",
  },
  {
    question: "자녀를 2명 이상 보내면 학비 할인을 받을 수 있나요?",
    answer:
      "일부 학교는 다자녀 할인 정책이 있습니다. Branksome Hall Asia는 3번째 자녀 15%, 4번째 이후 자녀 30% 할인을 제공하고, Dulwich College Seoul은 3자녀 이상 전일제 재학 시 1인당 5% 할인을 제공합니다. 이 계산기는 할인 미적용 기준 금액을 계산하며, 실제 할인은 학교 공식 안내를 확인해야 합니다.",
  },
  {
    question: "이 계산 결과로 국제학교 입학이 가능한지 알 수 있나요?",
    answer:
      "아니요. 이 계산기는 학비를 감당할 수 있는지에 대한 재정 참고용 계산이며, 실제 입학 자격(외국인학교의 경우 내국인은 해외 체류 3년 이상 등 별도 요건)과는 무관합니다. 입학 자격은 별도 리포트에서 확인하세요.",
  },
  {
    question: "환율이 바뀌면 학비도 달라지나요?",
    answer:
      "네. 학비의 달러 분담분은 실제 납부 시점의 환율로 청구되므로, 환율이 오르면 원화 환산 학비도 올라갑니다. 이 계산기의 환율은 편집 가능한 예시 기본값이며, 실제 납부액은 학교가 고지하는 청구 시점 환율을 따릅니다.",
  },
  {
    question: "이 계산기에 나오지 않는 학교도 있나요?",
    answer:
      "네. 우선 검색 수요가 높은 제주·서울·송도권 7개교만 우선 반영했습니다. Dwight School Seoul, YISS, KIS Pangyo 등은 추후 추가할 예정입니다.",
  },
];

export const IST_SEO_INTRO: string[] = [
  "국제학교 학비는 유치원부터 고등학교까지 매년 수천만 원이 들어가는 대표적인 고정 교육비 지출입니다. 자녀 입학을 고민하는 학부모라면 학비뿐 아니라 입학금·예치금 같은 첫해 추가비용, 기숙 여부에 따른 차이까지 미리 계산해봐야 실제 가계 계획을 세울 수 있습니다.",
  "이 계산기는 학교별로 다른 원화·달러 혼합 납부 구조를 반영합니다. 대부분의 국제학교는 학비를 원화 부분과 달러 부분으로 나눠 청구하기 때문에, 환율이 오르면 원화 환산 학비도 함께 오릅니다. 환율 입력값을 조정하면서 환율 변동이 실제 부담에 미치는 영향을 확인할 수 있습니다.",
  "결과값 중 소득 대비 비율은 가구 연소득 대비 학비 부담이 어느 정도인지 가늠하는 참고 지표입니다. 비율이 높다고 해서 입학이 불가능한 것은 아니며, 반대로 낮다고 해서 입학 자격이 생기는 것도 아닙니다 — 재정 여력과 입학 자격은 서로 다른 기준입니다.",
  "학비 데이터 중 일부(초·중등 학비, 기숙사 정확한 금액 등)는 학교가 공식적으로 세분화해 공개하지 않아 대표값으로 근사 계산됩니다. 이런 항목은 결과 화면에 경고 배지로 표시되니, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
];

export const IST_SEO_CRITERIA: string[] = [
  `학비는 각 학교 공식 홈페이지 ${IST_META.updatedAt} 확인 기준입니다.`,
  "학교마다 원화·달러 분담 비율이 다르며, 환율은 사용자가 직접 입력한 예시값을 사용합니다.",
  "다자녀 할인은 학교별 정책이 상이해 계산에 반영하지 않고 텍스트로 안내합니다.",
  "이 계산 결과는 재정 계획 참고용이며 입학 자격 판단과는 무관합니다.",
];

export const IST_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리", description: "지역별 대표 학교와 입학조건을 한 페이지에서 비교합니다." },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교", description: "NLCS·BHA·SJA·KIS 학비와 입학조건을 비교합니다." },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교", description: "SFS·Dulwich·채드윅 등 학비를 비교합니다." },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이", description: "입학자격과 학비 차이를 정리합니다." },
];
