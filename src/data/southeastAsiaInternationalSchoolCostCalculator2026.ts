// ── 타입 ──────────────────────────────────────────

export type SeaCountry = "MY" | "TH" | "VN";

export type SeaCity = "kuala_lumpur" | "johor_bahru" | "bangkok" | "chiang_mai" | "ho_chi_minh" | "hanoi";

export type SchoolTier = "budget" | "mid" | "premium";

// 데이터 신뢰도를 UI에도 노출해 "확실한 정보"와 "검색 요약이라 재확인 필요한 정보"를 구분해 보여준다.
// "불일치/미확인" 등급 학교는 이 유니언에 포함하지 않고 데이터셋 자체에서 제외한다(아래 EXCLUDED 참고).
export type DataConfidence = "official_confirmed" | "search_snippet";

export type SeaCurrency = "MYR" | "THB" | "VND";

export type SeaTuitionTier = {
  tierKey: string;
  tierLabel: string;
  annualLocal: number; // 연간 학비, 현지 통화 기준
};

export type SeaSchoolProfile = {
  id: string;
  name: string;
  nameKo: string;
  country: SeaCountry;
  city: SeaCity;
  cityLabel: string;
  tier: SchoolTier;
  curriculum: string;
  currency: SeaCurrency;
  tuitionTiers: SeaTuitionTier[];
  sourceUrl: string;
  asOfDate: string;
  dataConfidence: DataConfidence;
  dataNote?: string;
  closed?: boolean;
};

export type SeaLivingCost = {
  city: SeaCity;
  cityLabel: string;
  currency: SeaCurrency;
  monthlyFamilyExclRentLocal: number | null;
  monthlyRentLocal: {
    budget: number | null;
    mid: number | null;
    premium: number | null;
  };
  sourceUrl: string | null;
  asOfDate: string | null;
  dataConfidence: DataConfidence | null;
  note?: string;
};

export type SeaFxRate = {
  currency: SeaCurrency;
  krwPerUnit: number | null;
  asOfDate: string | null;
  sourceUrl: string | null;
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

// ── 메타 ──────────────────────────────────────────

export const SAC_META = {
  slug: "southeast-asia-international-school-cost-calculator-2026",
  title: "동남아 국제학교 비용 계산기",
  seoTitle: "동남아 국제학교 비용 계산기 2026 | 학비·생활비 총비용 바로 계산",
  seoDescription:
    "국가·도시·학년·자녀 수 입력하면 동남아 국제학교 연간 학비와 가족 생활비를 합산해 바로 계산. 한국 국제학교 대비 절감액 비교 포함.",
  description: "국가와 도시, 학년, 자녀 수, 부모 동반 여부를 입력하면 국제학교 연간 학비와 가족 생활비를 합산한 총비용을 바로 계산합니다.",
  updatedAt: "2026-07-09",
  dataNote:
    "학비는 학교 공식 페이지 또는 검색 결과 기준 2026-07-09 확인이며, 국가·도시별로 데이터 확인 수준이 다릅니다. 조호바루는 생활비 데이터가 아직 없어 학비만 표시됩니다. 실제 이주 전 반드시 현지 학교·부동산 정보를 재확인하세요.",
} as const;

// ── 학교 데이터 (6개 도시: 쿠알라룸푸르·조호바루·방콕·치앙마이·호치민·하노이) ──────

export const SAC_SCHOOLS: SeaSchoolProfile[] = [
  // ===== 말레이시아 · 쿠알라룸푸르 =====
  {
    id: "gis-kl",
    name: "Garden International School",
    nameKo: "가든 인터내셔널 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Year 1", annualLocal: 81_510 },
      { tierKey: "elementary_low", tierLabel: "Year 3-4", annualLocal: 93_150 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 97_410 },
      { tierKey: "middle_low", tierLabel: "Year 7-8", annualLocal: 109_110 },
      { tierKey: "middle_high", tierLabel: "Year 9", annualLocal: 114_300 },
      { tierKey: "high_low", tierLabel: "Year 10-11", annualLocal: 116_880 },
      { tierKey: "high_high", tierLabel: "Year 12-13", annualLocal: 118_560 },
    ],
    sourceUrl: "https://www.gardenschool.edu.my/admissions/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025/26학년도 기준 검색 요약 — 2025년 7월부터 연 수업료 RM60,000 초과분에 6% 서비스세(SST)가 부과될 수 있어 세금 포함 여부 재확인 필요.",
  },
  {
    id: "mkis-kl",
    name: "Mont'Kiara International School",
    nameKo: "몬키아라 인터내셔널 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "mid",
    curriculum: "미국식",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early_prek3", tierLabel: "PreK3", annualLocal: 35_110 },
      { tierKey: "early_prek4", tierLabel: "PreK4", annualLocal: 41_690 },
      { tierKey: "early_kg", tierLabel: "Kindergarten", annualLocal: 83_290 },
      { tierKey: "elementary", tierLabel: "Grade 1-5", annualLocal: 102_120 },
      { tierKey: "middle", tierLabel: "Grade 6-8", annualLocal: 114_110 },
    ],
    sourceUrl: "https://www.mkis.edu.my/school-fees-2025---2026",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "고등학년(Grade 9-12) 학비 미확보 — 재조사 필요. Kindergarten 구간에서 학비가 크게 뛰는 것으로 보이나 원문 대조 전이라 확정할 수 없음.",
  },
  {
    id: "alice-smith-kl",
    name: "The Alice Smith School",
    nameKo: "앨리스 스미스 스쿨",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Age 3~", annualLocal: 53_730 },
      { tierKey: "middle", tierLabel: "Year 7-9", annualLocal: 108_360 },
      { tierKey: "high", tierLabel: "Year 10-13", annualLocal: 117_360 },
    ],
    sourceUrl: "https://www.alice-smith.edu.my/join/tuition-and-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "초등(Elementary) 구간 정확한 학년별 수치 미확보 — 검색 요약에는 '약 75,000+ MYR'로만 표기되어 이 데이터셋에서는 제외.",
  },
  {
    id: "nexus-kl",
    name: "Nexus International School Malaysia",
    nameKo: "넥서스 인터내셔널 스쿨 말레이시아",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "premium",
    curriculum: "IB",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early_nursery", tierLabel: "Nursery", annualLocal: 46_050 },
      { tierKey: "early_reception", tierLabel: "Reception", annualLocal: 48_960 },
      { tierKey: "elementary_low", tierLabel: "Year 1-2", annualLocal: 59_460 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 73_440 },
      { tierKey: "middle_low", tierLabel: "Year 7", annualLocal: 82_950 },
      { tierKey: "middle_high", tierLabel: "Year 8-9", annualLocal: 84_120 },
      { tierKey: "high_low", tierLabel: "Year 10-11", annualLocal: 96_420 },
      { tierKey: "high_high", tierLabel: "Year 12-13", annualLocal: 104_490 },
    ],
    sourceUrl: "https://www.nexus.edu.my/admissions/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
  },
  {
    id: "sri-kdu-kl",
    name: "Sri KDU Kota Damansara (International)",
    nameKo: "스리 KDU 코타 다만사라",
    country: "MY",
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    tier: "budget",
    curriculum: "영국식 / IB 혼합",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "elementary_low", tierLabel: "Year 1", annualLocal: 39_720 },
      { tierKey: "elementary_high", tierLabel: "Year 6", annualLocal: 56_780 },
    ],
    sourceUrl: "https://srikdu.edu.my/kota-damansara-international/fee-structure/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "유치부·중등·고등 학비 미확보. 이 5개교 중 가장 저렴한 축이라 '저가형' 등급 대표로 실었으나, 학년 커버리지가 좁아 보강 필요.",
  },

  // ===== 말레이시아 · 조호바루 (3개교 전부 공식 확인) =====
  {
    id: "marlborough-jb",
    name: "Marlborough College Malaysia",
    nameKo: "말버러 칼리지 말레이시아",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "premium",
    curriculum: "영국식 / IB",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 63_000 },
      { tierKey: "pre_prep", tierLabel: "Pre-Prep (Reception-Year 3)", annualLocal: 119_400 },
      { tierKey: "prep_low", tierLabel: "Prep (Year 4-6)", annualLocal: 125_400 },
      { tierKey: "prep_high", tierLabel: "Prep (Year 7-8)", annualLocal: 141_300 },
      { tierKey: "senior_y9", tierLabel: "Senior (Year 9)", annualLocal: 141_300 },
      { tierKey: "senior_y10_11", tierLabel: "Senior (Year 10-11)", annualLocal: 153_600 },
      { tierKey: "senior_y12_13", tierLabel: "Senior (Year 12-13, Sixth Form)", annualLocal: 166_800 },
    ],
    sourceUrl: "https://www.marlboroughcollegemalaysia.org/admissions/fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "Day(통학) 기준 2026/27학년도 공식 페이지 원문 확인, 6% 서비스세(SST) 별도. Day Boarding·Full Boarding 옵션은 이보다 높음(이 데이터셋에는 통학 기준만 반영).",
  },
  {
    id: "real-schools-jb",
    name: "R.E.A.L Schools Johor Bahru (International)",
    nameKo: "R.E.A.L 스쿨 조호바루",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "budget",
    curriculum: "Cambridge / 영국식 (국제부 트랙)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Early Years", annualLocal: 13_760 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 22_540 },
      { tierKey: "y3_6", tierLabel: "Year 3-6", annualLocal: 24_270 },
      { tierKey: "y7", tierLabel: "Year 7", annualLocal: 26_110 },
      { tierKey: "y8", tierLabel: "Year 8", annualLocal: 26_900 },
      { tierKey: "y9", tierLabel: "Year 9", annualLocal: 27_260 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 30_210 },
    ],
    sourceUrl: "https://realschools.edu.my/johor-bahru-campus/fees-structure-jb/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 페이지 원문 확인. 국제부(영국 커리큘럼) 기준만 사용(말레이시아 국가교육과정 트랙은 더 저렴하나 제외). 조호바루 3개교 중 가장 저렴.",
  },
  {
    id: "crescendo-help-jb",
    name: "Crescendo-HELP International School (CHIS)",
    nameKo: "크레센도-헬프 인터내셔널 스쿨",
    country: "MY",
    city: "johor_bahru",
    cityLabel: "조호바루",
    tier: "mid",
    curriculum: "영국식 (IPC / Cambridge)",
    currency: "MYR",
    tuitionTiers: [
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 29_700 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 42_030 },
    ],
    sourceUrl: "https://chis.edu.my/school-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2025/26학년도 공식 페이지 원문 확인. Year 1-2·Year 10-11 양끝 학년만 확보 — 중간 학년 보간 필요. 5% 장학 할인(bursary)은 미반영.",
  },

  // ===== 태국 · 방콕 =====
  {
    id: "isb-bangkok",
    name: "International School Bangkok (ISB)",
    nameKo: "인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "미국식 (AP)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Pre-K", annualLocal: 640_000 },
      { tierKey: "elementary", tierLabel: "Elementary", annualLocal: 985_000 },
      { tierKey: "middle", tierLabel: "Middle School", annualLocal: 1_104_000 },
      { tierKey: "high", tierLabel: "High School", annualLocal: 1_162_000 },
    ],
    sourceUrl: "https://www.isb.ac.th/admissions/fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025/26학년도 공식 PDF 링크는 확보했으나 원문 직접 대조는 못함 — 방콕 7개교 중 학교 간 차별화된 수치라 신뢰도는 상대적으로 높은 편.",
  },
  {
    id: "harrow-bangkok",
    name: "Harrow International School Bangkok",
    nameKo: "해로우 인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "영국식 (A-Level / IGCSE)",
    currency: "THB",
    tuitionTiers: [{ tierKey: "all_grades", tierLabel: "전 학년 범위 (학년별 세부 미확보)", annualLocal: 614_600 }],
    sourceUrl: "https://www.harrowschool.ac.th/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "학비 범위는 THB 614,600~1,037,100 — 학년별 세부 breakdown 미확보로 하한값만 대표로 기재.",
  },
  {
    id: "shrewsbury-city-bangkok",
    name: "Shrewsbury International School (City Campus)",
    nameKo: "슈루즈베리 인터내셔널 스쿨 (시티캠퍼스)",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "영국식 (A-Level)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early_nursery", tierLabel: "Nursery", annualLocal: 669_600 },
      { tierKey: "early_ey1", tierLabel: "EY1", annualLocal: 691_800 },
      { tierKey: "early_ey2", tierLabel: "EY2", annualLocal: 728_700 },
      { tierKey: "elementary_low", tierLabel: "Year 1-2", annualLocal: 818_700 },
      { tierKey: "elementary_mid", tierLabel: "Year 3-4", annualLocal: 878_100 },
      { tierKey: "elementary_high", tierLabel: "Year 5-6", annualLocal: 908_400 },
    ],
    sourceUrl: "https://www.shrewsbury.ac.th/admissions/fees/overview/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "중등·고등 학비 미확보(원문에서 Riverside 캠퍼스와 수치가 섞여 있어 City Campus 단독 수치만 확보).",
  },
  {
    id: "kis-bangkok",
    name: "KIS International School",
    nameKo: "KIS 인터내셔널 스쿨 방콕",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "IB",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "early_prep", tierLabel: "EY Prep (반일)", annualLocal: 440_100 },
      { tierKey: "early_ey1", tierLabel: "EY1", annualLocal: 596_500 },
      { tierKey: "early_ey2", tierLabel: "EY2", annualLocal: 631_600 },
      { tierKey: "elementary", tierLabel: "EY3-Grade5", annualLocal: 725_500 },
      { tierKey: "middle", tierLabel: "Grade 6-10", annualLocal: 859_700 },
      { tierKey: "high_g11", tierLabel: "Grade 11", annualLocal: 944_600 },
      { tierKey: "high_g12", tierLabel: "Grade 12", annualLocal: 882_600 },
    ],
    sourceUrl: "https://www.kis.ac.th/join/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "Grade 12 학비가 Grade 11보다 낮게 조사됨 — IB DP 2년차 특수 요금 구조일 가능성, 원문 대조 전이라 확정 못함.",
  },
  {
    id: "patana-bangkok",
    name: "Bangkok Patana School",
    nameKo: "방콕 파타나 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "premium",
    curriculum: "영국식 (IGCSE / IB)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 515_000 },
      { tierKey: "fs1", tierLabel: "FS1", annualLocal: 577_000 },
      { tierKey: "fs2", tierLabel: "FS2", annualLocal: 640_000 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 749_000 },
      { tierKey: "y3", tierLabel: "Year 3", annualLocal: 790_000 },
      { tierKey: "y4_5", tierLabel: "Year 4-5", annualLocal: 796_000 },
      { tierKey: "y6", tierLabel: "Year 6", annualLocal: 811_000 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 842_000 },
      { tierKey: "y10", tierLabel: "Year 10", annualLocal: 957_000 },
      { tierKey: "y11", tierLabel: "Year 11 (3개 학기만 과금)", annualLocal: 707_000 },
      { tierKey: "y12", tierLabel: "Year 12", annualLocal: 1_014_000 },
      { tierKey: "y13", tierLabel: "Year 13 (3개 학기만 과금)", annualLocal: 749_000 },
    ],
    sourceUrl: "https://www.patana.ac.th/wp-content/uploads/2026/04/Fee-announcement-2026-7.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 PDF 원문 확인. Year11·13이 다른 학년보다 낮은 것은 시험 학기 특수 과금 구조로, 오타가 아님.",
  },
  {
    id: "bangkok-prep",
    name: "Bangkok Preparatory International School",
    nameKo: "방콕 프렙 인터내셔널 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "mid",
    curriculum: "영국식 (EYFS → IGCSE → A-Level / BTEC)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "pre_nursery", tierLabel: "Pre-Nursery", annualLocal: 384_800 },
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 595_600 },
      { tierKey: "reception", tierLabel: "Reception", annualLocal: 629_800 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 706_400 },
      { tierKey: "y3_4", tierLabel: "Year 3-4", annualLocal: 733_100 },
      { tierKey: "y5_6", tierLabel: "Year 5-6", annualLocal: 749_500 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 790_800 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 846_500 },
      { tierKey: "y12", tierLabel: "Year 12", annualLocal: 862_200 },
      { tierKey: "y13", tierLabel: "Year 13", annualLocal: 771_200 },
    ],
    sourceUrl: "https://www.bangkokprep.ac.th/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026/27학년도 공식 페이지 원문 확인. 방콕 7개교 중 중간~저가 구간을 대표.",
  },
  {
    id: "wells-bangkok",
    name: "Wells International School",
    nameKo: "웰스 인터내셔널 스쿨",
    country: "TH",
    city: "bangkok",
    cityLabel: "방콕",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "nursery", tierLabel: "Nursery", annualLocal: 246_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 546_000 },
    ],
    sourceUrl: "https://wells.ac.th/wp-content/uploads/2025/03/Tuition%20fee%20for%20school%20Year%202025-2026.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "공식 PDF 직접 열람 실패 — 검색엔진이 인용한 학기당 금액(THB 123,000~273,000)을 2배해 연간으로 추정한 값, 재확인 필요. 캠퍼스 개발비(1회성 THB 70,000~130,000)·보증금(THB 35,000) 별도.",
  },

  // ===== 태국 · 치앙마이 =====
  {
    id: "ptis-chiangmai",
    name: "Prem Tinsulanonda International School (PTIS)",
    nameKo: "프렘 틴술라논다 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "mid",
    curriculum: "IB",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "ey1_3", tierLabel: "EY1-EY3", annualLocal: 380_000 },
      { tierKey: "g1", tierLabel: "Grade 1", annualLocal: 392_000 },
      { tierKey: "g2_3", tierLabel: "Grade 2-3", annualLocal: 444_000 },
      { tierKey: "g4_5", tierLabel: "Grade 4-5", annualLocal: 550_000 },
      { tierKey: "g6_7", tierLabel: "Grade 6-7", annualLocal: 660_000 },
      { tierKey: "g8", tierLabel: "Grade 8", annualLocal: 696_000 },
      { tierKey: "g9_12", tierLabel: "Grade 9-12", annualLocal: 736_000 },
    ],
    sourceUrl: "https://ptis.ac.th/wp-content/uploads/2024/11/Prem-Tuition-Fee-2024-2025.pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "⚠ 공식 PDF는 2024-2025학년도 기준 — 최신본 미발견. 국제학교 학비는 통상 연 5~8% 인상되므로 실제 2026-27학년도 학비는 이보다 10~15% 높을 수 있음.",
  },
  {
    id: "cmis-chiangmai",
    name: "Chiang Mai International School (CMIS)",
    nameKo: "치앙마이 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "mid",
    curriculum: "확인 필요 (미국식 추정)",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "preschool", tierLabel: "Preschool 3-4", annualLocal: 341_700 },
      { tierKey: "kg_g5", tierLabel: "KG-Grade 5", annualLocal: 426_800 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 463_400 },
      { tierKey: "g9_12", tierLabel: "Grade 9-12", annualLocal: 580_200 },
    ],
    sourceUrl: "https://cmis.ac.th/admissions/tuition_fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-2027학년도 공식 페이지 원문 확인.",
  },
  {
    id: "grace-chiangmai",
    name: "Grace International School",
    nameKo: "그레이스 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "k_g5", tierLabel: "K-Grade 5", annualLocal: 294_500 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 322_000 },
      { tierKey: "g9_11", tierLabel: "Grade 9-11", annualLocal: 348_000 },
      { tierKey: "g12", tierLabel: "Grade 12", annualLocal: 361_000 },
    ],
    sourceUrl: "https://gisthailand.org/admissions/tuition-and-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "3자 아그리게이터(doris.school) 경유 확보, 공식 사이트 원문 직접 대조는 안 됨. 치앙마이 4개교 중 가장 저렴.",
  },
  {
    id: "apis-chiangmai",
    name: "American Pacific International School",
    nameKo: "아메리칸 퍼시픽 인터내셔널 스쿨",
    country: "TH",
    city: "chiang_mai",
    cityLabel: "치앙마이",
    tier: "budget",
    curriculum: "확인 필요",
    currency: "THB",
    tuitionTiers: [
      { tierKey: "pre_nursery", tierLabel: "Pre-Nursery (Primary)", annualLocal: 114_550 },
      { tierKey: "g6", tierLabel: "Grade 6 (Primary)", annualLocal: 383_400 },
      { tierKey: "g10", tierLabel: "Grade 10 (Main Campus)", annualLocal: 394_800 },
      { tierKey: "g11", tierLabel: "Grade 11 (Main Campus)", annualLocal: 414_200 },
    ],
    sourceUrl: "https://www.international-schools-database.com/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "3자 아그리게이터 경유 확보, 공식 사이트 원문 직접 대조는 안 됨. Primary와 Main 캠퍼스 학비 체계가 분리되어 있어 학년 간 비교에 주의 필요.",
  },

  // ===== 베트남 · 호치민 =====
  {
    id: "ais-hcmc",
    name: "Australian International School Vietnam (AIS Saigon)",
    nameKo: "호주 국제학교 사이공",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "Cambridge / 영국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Kindergarten", annualLocal: 296_000_000 },
      { tierKey: "elementary", tierLabel: "Primary (초등)", annualLocal: 566_000_000 },
      { tierKey: "middle", tierLabel: "Year 7-9 (중등)", annualLocal: 711_000_000 },
      { tierKey: "high", tierLabel: "Year 10-13 (고등)", annualLocal: 861_000_000 },
    ],
    sourceUrl: "https://www.aisvietnam.com/sites/school77/files/2025-05/AIS_Fees_Schedule_2025-2026_(04.2025).pdf",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "이 클러스터 전체에서 학교 공식 Fee Schedule PDF 원문을 직접 확인한 데이터.",
  },
  {
    id: "bis-hcmc",
    name: "British International School HCMC (Nord Anglia)",
    nameKo: "브리티시 인터내셔널 스쿨 호치민",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "영국식 (IGCSE / A-Level)",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "EY1", annualLocal: 322_000_000 },
      { tierKey: "high", tierLabel: "Year 13", annualLocal: 956_000_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bis-hcmc/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "EY1과 Year13 두 지점만 확보, 중간 학년 데이터 미확보 — 보간 또는 별도 조사 필요.",
  },
  {
    id: "ishcmc",
    name: "International School Ho Chi Minh City (ISHCMC)",
    nameKo: "국제학교 호치민",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Early Explorers", annualLocal: 279_000_000 },
      { tierKey: "high", tierLabel: "Grade 12", annualLocal: 959_000_000 },
    ],
    sourceUrl: "https://www.ishcmc.com/admissions/tuition-fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "BIS HCMC와 동일하게 양끝 학년만 확보 — 중간 학년 보간 필요.",
  },
  {
    id: "renaissance-saigon",
    name: "Renaissance International School Saigon",
    nameKo: "르네상스 인터내셔널 스쿨 사이공",
    country: "VN",
    city: "ho_chi_minh",
    cityLabel: "호치민",
    tier: "mid",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "EY1", annualLocal: 190_000_000 },
      { tierKey: "high", tierLabel: "Year 12-13", annualLocal: 806_000_000 },
    ],
    sourceUrl: "https://renaissance.edu.vn/fees/",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "양끝 학년만 확보 — 중간 학년 보간 필요. 호치민 4개교 중 상대적으로 학비가 낮음.",
  },

  // ===== 베트남 · 하노이 =====
  {
    id: "bis-hanoi",
    name: "British International School Hanoi (BIS Hanoi)",
    nameKo: "브리티시 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "영국식 (National Curriculum for England)",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "F1-F3 (유아)", annualLocal: 343_100_000 },
      { tierKey: "y1_2", tierLabel: "Year 1-2", annualLocal: 657_600_000 },
      { tierKey: "y3_6", tierLabel: "Year 3-6", annualLocal: 715_500_000 },
      { tierKey: "y7_9", tierLabel: "Year 7-9", annualLocal: 846_800_000 },
      { tierKey: "y10_11", tierLabel: "Year 10-11", annualLocal: 893_200_000 },
      { tierKey: "y12_13", tierLabel: "Year 12-13", annualLocal: 970_200_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bis-hanoi/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-27학년도 공식 페이지 원문 확인 — 독립된 두 차례 조사에서 동일 수치로 교차검증됨.",
  },
  {
    id: "bvis-hanoi",
    name: "British Vietnamese International School Hanoi (BVIS Hanoi)",
    nameKo: "브리티시 베트나미즈 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "영국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "F1 (유아)", annualLocal: 251_700_000 },
      { tierKey: "high", tierLabel: "Year 13", annualLocal: 636_000_000 },
    ],
    sourceUrl: "https://www.nordangliaeducation.com/bvis-hanoi/admissions/tuition-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2025-26학년도 공식 페이지 원문 확인. 양끝 학년만 확보 — 중간 학년 보간 필요.",
  },
  {
    id: "concordia-hanoi",
    name: "Concordia International School Hanoi",
    nameKo: "콘코디아 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "early", tierLabel: "Preschool", annualLocal: 558_034_000 },
      { tierKey: "high", tierLabel: "Grade 12", annualLocal: 1_038_822_000 },
    ],
    sourceUrl: "https://www.concordiahanoi.org/admissions/admissions-faqs",
    asOfDate: "2026-07-09",
    dataConfidence: "official_confirmed",
    dataNote: "2026-27학년도 공식 페이지 원문 확인. 양끝 학년만 확보 — 중간 학년 보간 필요. 하노이 5개교 중 최고가.",
  },
  {
    id: "unis-hanoi",
    name: "United Nations International School of Hanoi (UNIS Hanoi)",
    nameKo: "유엔 인터내셔널 스쿨 하노이",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "premium",
    curriculum: "IB",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "kg1_2", tierLabel: "KG1-2", annualLocal: 459_200_000 },
      { tierKey: "kg3", tierLabel: "KG3", annualLocal: 707_500_000 },
      { tierKey: "g1_5", tierLabel: "Grade 1-5", annualLocal: 876_600_000 },
      { tierKey: "g6_8", tierLabel: "Grade 6-8", annualLocal: 926_000_000 },
      { tierKey: "g9_10", tierLabel: "Grade 9-10", annualLocal: 987_000_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 1_048_600_000 },
    ],
    sourceUrl: "https://www.international-schools-database.com/in/hanoi/united-nations-international-school-hanoi/fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "공식 페이지 학비표는 이미지/PDF로 되어 있어 텍스트 추출 실패 — 3자 집계 사이트 수치 사용.",
  },
  {
    id: "his-hanoi",
    name: "Hanoi International School (HIS)",
    nameKo: "하노이 인터내셔널 스쿨",
    country: "VN",
    city: "hanoi",
    cityLabel: "하노이",
    tier: "mid",
    curriculum: "미국식",
    currency: "VND",
    tuitionTiers: [
      { tierKey: "prek_k", tierLabel: "PreK/K", annualLocal: 418_400_000 },
      { tierKey: "g11_12", tierLabel: "Grade 11-12", annualLocal: 767_000_000 },
    ],
    sourceUrl: "https://www.hisvietnam.com/admissions/tuition-and-fees",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    dataNote: "2025-26학년도, 공식 페이지 학비표가 PDF 링크라 직접 대조 실패 — 검색 스니펫 기반. 하노이 5개교 중 상대적으로 저렴.",
  },
];

// 데이터셋에서 의도적으로 제외한 학교 — 실수로 다시 추가되지 않도록 문서화
export const SAC_EXCLUDED_SCHOOLS_NOTE = [
  "NIST International School(방콕): 공식 사이트가 JS 렌더링이라 정적 조회로 수치를 확인하지 못했고, 검색 결과끼리도 서로 다른 수치(45만~113만 THB 범위)를 제시해 신뢰 불가.",
  '"British International School Johor Bahru": 두 차례 조사에서 모두 실존 자체를 확인하지 못함(공식 홈페이지·독립 법인 미발견).',
  "American International School Vietnam(AISVN, 호치민): 재정 스캔들로 2026-01-12 호치민시가 공식 해산 결정 — 폐교.",
] as const;

// ── 생활비 데이터 (조호바루만 잔여 블로커) ──────

export const SAC_LIVING_COSTS: SeaLivingCost[] = [
  {
    city: "kuala_lumpur",
    cityLabel: "쿠알라룸푸르",
    currency: "MYR",
    monthlyFamilyExclRentLocal: 9_042,
    monthlyRentLocal: { budget: 2_492, mid: 3_717, premium: 4_943 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Kuala-Lumpur",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "3베드룸 콘도 기준(외곽 RM2,000~4,000, 시내중심 RM3,000~8,000) 범위의 평균값을 등급별로 매핑. 의료보험 비용은 미포함.",
  },
  {
    city: "johor_bahru",
    cityLabel: "조호바루",
    currency: "MYR",
    monthlyFamilyExclRentLocal: null,
    monthlyRentLocal: { budget: null, mid: null, premium: null },
    sourceUrl: null,
    asOfDate: null,
    dataConfidence: null,
    note: "조호바루 생활비는 아직 조사되지 않음. 계산기에서 조호바루 선택 시 학비만 표시(dataCompleteness: tuition_only).",
  },
  {
    city: "bangkok",
    cityLabel: "방콕",
    currency: "THB",
    monthlyFamilyExclRentLocal: 86_839,
    monthlyRentLocal: { budget: 24_539, mid: 47_426, premium: 70_313 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Bangkok",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "의료보험(외국인 사보험) 비용은 Numbeo에 항목이 없어 미포함.",
  },
  {
    city: "chiang_mai",
    cityLabel: "치앙마이",
    currency: "THB",
    monthlyFamilyExclRentLocal: 66_555,
    monthlyRentLocal: { budget: 17_292, mid: 23_459, premium: 29_625 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Chiang-Mai",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
  },
  {
    city: "ho_chi_minh",
    cityLabel: "호치민",
    currency: "VND",
    monthlyFamilyExclRentLocal: 44_683_886,
    monthlyRentLocal: { budget: 18_156_250, mid: 24_992_125, premium: 31_828_000 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Ho-Chi-Minh-City",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "의료보험 비용은 미포함.",
  },
  {
    city: "hanoi",
    cityLabel: "하노이",
    currency: "VND",
    monthlyFamilyExclRentLocal: 42_301_224,
    monthlyRentLocal: { budget: 14_056_461, mid: 18_145_427, premium: 22_234_392 },
    sourceUrl: "https://www.numbeo.com/cost-of-living/in/Hanoi",
    asOfDate: "2026-07-09",
    dataConfidence: "search_snippet",
    note: "의료보험 비용은 미포함.",
  },
];

// ── 환율 (3개 통화 전부 확정) ──────────────────────────

export const SAC_FX_RATES: SeaFxRate[] = [
  { currency: "MYR", krwPerUnit: 368.4, asOfDate: "2026-07-09", sourceUrl: "https://wise.com/us/currency-converter/myr-to-krw-rate" },
  { currency: "THB", krwPerUnit: 44.95, asOfDate: "2026-07-09", sourceUrl: "https://wise.com/us/currency-converter/thb-to-krw-rate" },
  { currency: "VND", krwPerUnit: 0.05715, asOfDate: "2026-07-09", sourceUrl: "https://wise.com/us/currency-converter/vnd-to-krw-rate" },
];

export const SAC_FAQ: FaqItem[] = [
  {
    question: "동남아 국제학교가 한국보다 정말 저렴한가요?",
    answer:
      "학비만 비교하면 대체로 저렴한 편이지만, 부모가 동반해 거주하면 주거비·생활비가 추가로 들어갑니다. 이 계산기는 학비와 생활비를 합산한 총비용을 계산해 실제 체감 비용을 보여줍니다. 다만 조호바루는 생활비 데이터가 아직 없어 학비만 표시되니, 결과의 '생활비 포함 여부' 표시를 꼭 확인하세요.",
  },
  {
    question: "이 계산기의 학비 데이터는 얼마나 정확한가요?",
    answer:
      "학교마다 확인 수준이 다릅니다. 학교 공식 자료로 직접 대조한 곳도 있고, 검색 결과 요약만 확보해 재확인이 더 필요한 곳도 있습니다. 각 학교 카드에 표시되는 데이터 신뢰도 배지('공식 확인' / '검색 요약, 재확인 권장')를 함께 확인하세요.",
  },
  {
    question: "자녀 2명을 함께 보내면 비용이 얼마나 늘어나나요?",
    answer: "학비는 자녀 수만큼 단순 곱해 계산합니다. 다자녀 할인은 학교별로 정책이 다르고 이번 조사에서 확인되지 않아 계산에 반영하지 않았습니다.",
  },
  {
    question: "부모가 동반하지 않고 기숙사에 보내면 비용이 얼마나 줄어드나요?",
    answer:
      "이 계산기는 부모 동반 여부에 따라 생활비 포함 여부를 다르게 계산합니다. 다만 동남아 국제학교의 기숙사 운영 여부와 기숙사비는 학교별로 이번 조사에서 별도 확인하지 않았으므로, 기숙 옵션이 있는 학교인지는 각 학교 공식 페이지에서 확인이 필요합니다.",
  },
  {
    question: "왜 조호바루는 총비용이 아니라 학비만 나오나요?",
    answer: "조호바루는 국제학교 학비 데이터는 확보했지만 생활비 데이터를 아직 조사하지 못했습니다. 데이터가 준비되는 대로 다른 도시와 동일하게 총비용을 계산할 수 있도록 업데이트할 예정입니다.",
  },
  {
    question: "원화 환산 금액은 실시간 환율인가요?",
    answer:
      "아니요. 계산기와 리포트의 원화 환산은 2026-07-09 기준 환율(MYR 368.4원, THB 44.95원, VND 0.05715원)을 고정값으로 사용합니다. 실제 학비 납부 시점의 환율은 이보다 오르거나 내릴 수 있으므로, 정확한 금액은 납부 시점 환율로 다시 계산해야 합니다.",
  },
];

export const SAC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국의 1년 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비와 생활비를 정리합니다." },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국내 국제학교 학비 계산기", description: "한국 국제학교 학비를 계산합니다." },
];
