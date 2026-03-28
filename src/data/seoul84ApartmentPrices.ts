export type DistrictKey =
  | "gangnam"
  | "seocho"
  | "songpa"
  | "mapo"
  | "seongdong"
  | "gangdong";

export type ApartmentGrade = "신축" | "준신축";
export type SalaryMode = "avgWorker" | "samsung" | "hynix";

export type ApartmentPriceEntry = {
  id: string;
  districtKey: DistrictKey;
  districtLabel: string;
  apartmentName: string;
  householdCount: number;
  grade: ApartmentGrade;
  areaType: "84";
  approvalYear?: number;
  highPriceEok: number | null;
  avgPriceEok: number | null;
  pricePerPyeongMan: number | null;
  diffHighVsAvgEok: number | null;
  compareEnabled: boolean;
  salaryYearsAvgWorker: number | null;
  salaryYearsSamsung: number | null;
  salaryYearsHynix: number | null;
  tags?: string[];
  hogangnonoUrl: string;
};

export type DistrictSummary = {
  districtKey: DistrictKey;
  districtLabel: string;
  avgOfAvgPriceEok: number | null;
  maxAvgPriceEok: number | null;
  topApartmentName: string;
  entryCount: number;
};

export type Seoul84ApartmentReportData = {
  meta: {
    slug: string;
    title: string;
    description: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  salaryBases: {
    avgWorker: number;
    samsung: number;
    hynix: number;
  };
  filterOptions: {
    districts: { value: DistrictKey; label: string }[];
    grades: ApartmentGrade[];
    sortOptions: { value: string; label: string }[];
    priceModes: { value: "high" | "avg"; label: string }[];
  };
  entries: ApartmentPriceEntry[];
  districtSummaries: DistrictSummary[];
  faq: { q: string; a: string }[];
  insights: { title: string; body: string }[];
  relatedLinks: { href: string; label: string }[];
  referenceLinks: {
    price: { label: string; href: string }[];
    loanTax: { label: string; href: string }[];
  };
  affiliateProducts: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};

const AREA_PYEONG = 25.41;
const SALARY_BASES = {
  avgWorker: 43_320_000,
  samsung: 158_000_000,
  hynix: 185_000_000,
} as const;

const DISTRICT_LABELS: Record<DistrictKey, string> = {
  gangnam: "강남구",
  seocho: "서초구",
  songpa: "송파구",
  mapo: "마포구",
  seongdong: "성동구",
  gangdong: "강동구",
};

type RawEntry = Omit<
  ApartmentPriceEntry,
  | "districtLabel"
  | "pricePerPyeongMan"
  | "diffHighVsAvgEok"
  | "salaryYearsAvgWorker"
  | "salaryYearsSamsung"
  | "salaryYearsHynix"
>;

const rawEntries: RawEntry[] = [
  {
    id: "raemian-daechi-palace",
    districtKey: "gangnam",
    apartmentName: "래미안대치팰리스",
    householdCount: 1608,
    grade: "신축",
    areaType: "84",
    approvalYear: 2015,
    highPriceEok: 53.0,
    avgPriceEok: 50.5,
    compareEnabled: true,
    tags: ["대치", "학군", "신축 대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/axv7f/0",
  },
  {
    id: "the-honor-hills",
    districtKey: "gangnam",
    apartmentName: "디에이치아너힐즈",
    householdCount: 1320,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 39.0,
    avgPriceEok: 38.0,
    compareEnabled: true,
    tags: ["개포", "준신축", "학군"],
    hogangnonoUrl: "https://hogangnono.com/apt/aYV55/0",
  },
  {
    id: "gaepo-raemian-forest",
    districtKey: "gangnam",
    apartmentName: "개포래미안포레스트",
    householdCount: 2296,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2020,
    highPriceEok: 29.4,
    avgPriceEok: 28.17,
    compareEnabled: true,
    tags: ["개포", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/b4Ye5/0",
  },
  {
    id: "raemian-one-bailey",
    districtKey: "seocho",
    apartmentName: "래미안원베일리",
    householdCount: 2990,
    grade: "신축",
    areaType: "84",
    approvalYear: 2023,
    highPriceEok: 62.5,
    avgPriceEok: 60.8,
    compareEnabled: true,
    tags: ["반포", "신축", "랜드마크"],
    hogangnonoUrl: "https://hogangnono.com/apt/dBPa6/0",
  },
  {
    id: "acro-river-park",
    districtKey: "seocho",
    apartmentName: "아크로리버파크",
    householdCount: 1612,
    grade: "신축",
    areaType: "84",
    approvalYear: 2016,
    highPriceEok: 56.0,
    avgPriceEok: 53.0,
    compareEnabled: true,
    tags: ["반포", "한강", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aBP2b/0",
  },
  {
    id: "raemian-firstige",
    districtKey: "seocho",
    apartmentName: "래미안퍼스티지",
    householdCount: 2444,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2009,
    highPriceEok: 55.0,
    avgPriceEok: 51.5,
    compareEnabled: true,
    tags: ["반포", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/1Hq6f/0",
  },
  {
    id: "banpo-jai",
    districtKey: "seocho",
    apartmentName: "반포자이",
    householdCount: 3410,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2009,
    highPriceEok: 51.0,
    avgPriceEok: 49.33,
    compareEnabled: true,
    tags: ["반포", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/1HUe4/0",
  },
  {
    id: "the-h-firstier-ipark",
    districtKey: "gangnam",
    apartmentName: "디에이치퍼스티어아이파크",
    householdCount: 6702,
    grade: "신축",
    areaType: "84",
    approvalYear: 2024,
    highPriceEok: 39.0,
    avgPriceEok: 39.35,
    compareEnabled: true,
    tags: ["개포", "초대단지", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/dGkb8/0",
  },
  {
    id: "raemian-blestige",
    districtKey: "gangnam",
    apartmentName: "래미안블레스티지",
    householdCount: 1957,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 37.0,
    avgPriceEok: 36.7,
    compareEnabled: true,
    tags: ["개포", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aROd5/0",
  },
  {
    id: "gaepo-jai-presidence",
    districtKey: "gangnam",
    apartmentName: "개포자이프레지던스",
    householdCount: 3375,
    grade: "신축",
    areaType: "84",
    approvalYear: 2023,
    highPriceEok: 43.0,
    avgPriceEok: 40.1,
    compareEnabled: true,
    tags: ["개포", "대단지", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/ds61e/0",
  },
  {
    id: "the-h-xi-gaepo",
    districtKey: "gangnam",
    apartmentName: "디에이치자이개포",
    householdCount: 1996,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2021,
    highPriceEok: 39.0,
    avgPriceEok: 38.0,
    compareEnabled: true,
    tags: ["일원", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/b5O7a/0",
  },
  {
    id: "seocho-grande-jai",
    districtKey: "seocho",
    apartmentName: "서초그랑자이",
    householdCount: 1446,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2021,
    highPriceEok: 42.0,
    avgPriceEok: 42.0,
    compareEnabled: true,
    tags: ["서초", "신축급", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/drl11/0",
  },
  {
    id: "olympic-park-foreon",
    districtKey: "gangdong",
    apartmentName: "올림픽파크포레온",
    householdCount: 9510,
    grade: "신축",
    areaType: "84",
    approvalYear: 2025,
    highPriceEok: 30.0,
    avgPriceEok: 28.5,
    compareEnabled: true,
    tags: ["둔촌", "대단지", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/dC7df/0",
  },
  {
    id: "helio-city",
    districtKey: "songpa",
    apartmentName: "헬리오시티",
    householdCount: 5678,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2018,
    highPriceEok: 34.0,
    avgPriceEok: 32.75,
    compareEnabled: true,
    tags: ["가락", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aAh37/0",
  },
  {
    id: "parc-rio",
    districtKey: "songpa",
    apartmentName: "파크리오",
    householdCount: 5563,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2008,
    highPriceEok: 34.4,
    avgPriceEok: 34.4,
    compareEnabled: true,
    tags: ["잠실권역", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/1Xyb5/0",
  },
  {
    id: "jamsil-trizium",
    districtKey: "songpa",
    apartmentName: "잠실트리지움",
    householdCount: 6864,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2007,
    highPriceEok: 29.95,
    avgPriceEok: 29.6,
    compareEnabled: true,
    tags: ["잠실", "학군", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/1Xiec/0",
  },
  {
    id: "jamsil-els",
    districtKey: "songpa",
    apartmentName: "잠실엘스",
    householdCount: 5678,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2008,
    highPriceEok: 34.0,
    avgPriceEok: 34.0,
    compareEnabled: true,
    tags: ["잠실", "대단지", "학군"],
    hogangnonoUrl: "https://hogangnono.com/apt/1Xe5f/0",
  },
  {
    id: "recenz",
    districtKey: "songpa",
    apartmentName: "리센츠",
    householdCount: 5563,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2008,
    highPriceEok: 34.4,
    avgPriceEok: 34.4,
    compareEnabled: true,
    tags: ["잠실", "대단지", "역세권"],
    hogangnonoUrl: "https://hogangnono.com/apt/1Xa59/0",
  },
  {
    id: "lake-palace",
    districtKey: "songpa",
    apartmentName: "레이크팰리스",
    householdCount: 2678,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2006,
    highPriceEok: 32.5,
    avgPriceEok: 32.5,
    compareEnabled: true,
    tags: ["잠실", "석촌호수", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/1X92a/0",
  },
  {
    id: "mapo-raemian-prugio",
    districtKey: "mapo",
    apartmentName: "마포래미안푸르지오",
    householdCount: 3885,
    grade: "신축",
    areaType: "84",
    approvalYear: 2014,
    highPriceEok: 25.0,
    avgPriceEok: 25.0,
    compareEnabled: true,
    tags: ["아현", "대단지", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/9YO50/0",
  },
  {
    id: "mapo-prestige-jai",
    districtKey: "mapo",
    apartmentName: "마포프레스티지자이",
    householdCount: 1694,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2021,
    highPriceEok: 26.5,
    avgPriceEok: 23.0,
    compareEnabled: true,
    tags: ["염리", "준신축", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/b4N6f/0",
  },
  {
    id: "mapo-grande-jai",
    districtKey: "mapo",
    apartmentName: "마포그랑자이",
    householdCount: 1248,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2020,
    highPriceEok: 25.7,
    avgPriceEok: 24.88,
    compareEnabled: true,
    tags: ["대흥", "준신축", "역세권"],
    hogangnonoUrl: "https://hogangnono.com/apt/aYZd6/0",
  },
  {
    id: "mapo-the-class",
    districtKey: "mapo",
    apartmentName: "마포더클래시",
    householdCount: 1419,
    grade: "신축",
    areaType: "84",
    approvalYear: 2023,
    highPriceEok: 25.5,
    avgPriceEok: 22.6,
    compareEnabled: true,
    tags: ["아현", "신축", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/dsdb3/0",
  },
  {
    id: "trimage",
    districtKey: "seongdong",
    apartmentName: "트리마제",
    householdCount: 2529,
    grade: "신축",
    areaType: "84",
    approvalYear: 2017,
    highPriceEok: 24.3,
    avgPriceEok: 23.0,
    compareEnabled: true,
    tags: ["성수", "한강", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aDQ1a/0",
  },
  {
    id: "seoul-forest-triumph",
    districtKey: "seongdong",
    apartmentName: "서울숲트리마제",
    householdCount: 1976,
    grade: "신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 24.0,
    avgPriceEok: 22.0,
    compareEnabled: true,
    tags: ["성수", "신축", "서울숲"],
    hogangnonoUrl: "https://hogangnono.com/apt/aDQ1a/0",
  },
  {
    id: "raemian-oksu-riverzen",
    districtKey: "seongdong",
    apartmentName: "래미안옥수리버젠",
    householdCount: 1511,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2012,
    highPriceEok: 22.6,
    avgPriceEok: 22.25,
    compareEnabled: true,
    tags: ["옥수", "준신축", "한강"],
    hogangnonoUrl: "https://hogangnono.com/apt/9la8/0",
  },
  {
    id: "singeumho-park-xi",
    districtKey: "seongdong",
    apartmentName: "신금호파크자이",
    householdCount: 1156,
    grade: "신축",
    areaType: "84",
    approvalYear: 2016,
    highPriceEok: 21.0,
    avgPriceEok: 21.0,
    compareEnabled: true,
    tags: ["금호", "역세권", "신축급"],
    hogangnonoUrl: "https://hogangnono.com/apt/aAB2e/0",
  },
  {
    id: "seoul-forest-riverview-xi",
    districtKey: "seongdong",
    apartmentName: "서울숲리버뷰자이",
    householdCount: 1034,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2018,
    highPriceEok: 40.0,
    avgPriceEok: 26.7,
    compareEnabled: true,
    tags: ["행당", "서울숲", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aIMc0/0",
  },
  {
    id: "centras",
    districtKey: "seongdong",
    apartmentName: "센트라스",
    householdCount: 2529,
    grade: "신축",
    areaType: "84",
    approvalYear: 2016,
    highPriceEok: 25.0,
    avgPriceEok: 25.0,

    compareEnabled: true,
    tags: ["왕십리", "대단지", "신축급"],
    hogangnonoUrl: "https://hogangnono.com/apt/aCm4a/0",
  },
  {
    id: "tenshill-1",
    districtKey: "seongdong",
    apartmentName: "텐즈힐1차",
    householdCount: 1702,
    grade: "신축",
    areaType: "84",
    approvalYear: 2015,
    highPriceEok: 24.8,
    avgPriceEok: 22.0,
    compareEnabled: true,
    tags: ["왕십리", "뉴타운", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/aSm2e/0",
  },
  {
    id: "godeok-gracium",
    districtKey: "gangdong",
    apartmentName: "고덕그라시움",
    householdCount: 4932,
    grade: "신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 24.99,
    avgPriceEok: 24.0,
    compareEnabled: true,
    tags: ["고덕", "대단지", "신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aYO6d/0",
  },
  {
    id: "godeok-arteon",
    districtKey: "gangdong",
    apartmentName: "고덕아르테온",
    householdCount: 4066,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2020,
    highPriceEok: 24.0,
    avgPriceEok: 23.25,
    compareEnabled: true,
    tags: ["고덕", "준신축", "대단지"],
    hogangnonoUrl: "https://hogangnono.com/apt/b5y9a/0",
  },
  {
    id: "raemian-solvenue",
    districtKey: "gangdong",
    apartmentName: "래미안솔베뉴",
    householdCount: 1900,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 18.0,
    avgPriceEok: 17.9,
    compareEnabled: true,
    tags: ["명일", "역세권", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/aYWdc/0",
  },
  {
    id: "gangdong-lotte-castle-first",
    districtKey: "gangdong",
    apartmentName: "강동롯데캐슬퍼스트",
    householdCount: 3226,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2008,
    highPriceEok: 19.5,
    avgPriceEok: 19.5,
    compareEnabled: true,
    tags: ["암사", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/2799a/0",
  },
  {
    id: "raemian-hillstate-godeok",
    districtKey: "gangdong",
    apartmentName: "고덕래미안힐스테이트",
    householdCount: 3658,
    grade: "신축",
    areaType: "84",
    approvalYear: 2016,
    highPriceEok: 21.0,
    avgPriceEok: 21.0,
    compareEnabled: true,
    tags: ["고덕", "대단지", "신축급"],
    hogangnonoUrl: "https://hogangnono.com/apt/aD44a/0",
  },
  {
    id: "godeok-ipark",
    districtKey: "gangdong",
    apartmentName: "고덕아이파크",
    householdCount: 1142,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2011,
    highPriceEok: 20.4,
    avgPriceEok: 20.4,
    compareEnabled: true,
    tags: ["고덕", "대단지", "역세권"],
    hogangnonoUrl: "https://hogangnono.com/apt/24z22/0",
  },
  {
    id: "godeok-central-ipark",
    districtKey: "gangdong",
    apartmentName: "고덕센트럴아이파크",
    householdCount: 1745,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 18.455,
    avgPriceEok: 18.455,
    compareEnabled: true,
    tags: ["상일", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/b5L49/0",
  },
  {
    id: "godeok-lotte-castle-beneruche",
    districtKey: "gangdong",
    apartmentName: "고덕롯데캐슬베네루체",
    householdCount: 1859,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2019,
    highPriceEok: 20.0,
    avgPriceEok: 18.1125,
    compareEnabled: true,
    tags: ["상일", "대단지", "준신축"],
    hogangnonoUrl: "https://hogangnono.com/apt/b5je6/0",
  },
  {
    id: "godeok-lien-park-3",
    districtKey: "gangdong",
    apartmentName: "고덕리엔파크3단지",
    householdCount: 2283,
    grade: "준신축",
    areaType: "84",
    approvalYear: 2011,
    highPriceEok: 13.0,
    avgPriceEok: 12.75,
    compareEnabled: true,
    tags: ["상일", "대단지", "가성비"],
    hogangnonoUrl: "https://hogangnono.com/apt/24A48/0",
  },
];

function calcPricePerPyeongMan(avgPriceEok: number | null) {
  return avgPriceEok !== null ? Math.round((avgPriceEok * 10000) / AREA_PYEONG) : null;
}

function calcDiffHighVsAvgEok(highPriceEok: number | null, avgPriceEok: number | null) {
  return highPriceEok !== null && avgPriceEok !== null
    ? Math.round((highPriceEok - avgPriceEok) * 100) / 100
    : null;
}

function calcSalaryYears(avgPriceEok: number | null, salaryBase: number) {
  return avgPriceEok !== null
    ? Math.round(((avgPriceEok * 100_000_000) / salaryBase) * 10) / 10
    : null;
}

const entries: ApartmentPriceEntry[] = rawEntries.map((item) => ({
  ...item,
  districtLabel: DISTRICT_LABELS[item.districtKey],
  pricePerPyeongMan: calcPricePerPyeongMan(item.avgPriceEok),
  diffHighVsAvgEok: calcDiffHighVsAvgEok(item.highPriceEok, item.avgPriceEok),
  salaryYearsAvgWorker: calcSalaryYears(item.avgPriceEok, SALARY_BASES.avgWorker),
  salaryYearsSamsung: calcSalaryYears(item.avgPriceEok, SALARY_BASES.samsung),
  salaryYearsHynix: calcSalaryYears(item.avgPriceEok, SALARY_BASES.hynix),
}));

const districtSummaries: DistrictSummary[] = (Object.keys(DISTRICT_LABELS) as DistrictKey[]).map((districtKey) => {
  const districtEntries = entries.filter((item) => item.districtKey === districtKey && item.avgPriceEok !== null);
  const avgOfAvgPriceEok =
    districtEntries.length > 0
      ? Math.round(
          (districtEntries.reduce((sum, item) => sum + (item.avgPriceEok ?? 0), 0) / districtEntries.length) * 100
        ) / 100
      : null;
  const topEntry = districtEntries
    .slice()
    .sort((a, b) => (b.avgPriceEok ?? 0) - (a.avgPriceEok ?? 0))[0];

  return {
    districtKey,
    districtLabel: DISTRICT_LABELS[districtKey],
    avgOfAvgPriceEok,
    maxAvgPriceEok: topEntry?.avgPriceEok ?? null,
    topApartmentName: topEntry?.apartmentName ?? "-",
    entryCount: districtEntries.length,
  };
});

export const seoul84ApartmentPrices: Seoul84ApartmentReportData = {
  meta: {
    slug: "seoul-84-apartment-prices",
    title: "서울 국평 아파트 가격 비교 리포트 | 강남·서초·송파·마포·성동·강동 84㎡ 시세",
    description:
      "서울 신축·준신축 대단지 아파트의 전용 84㎡ 가격을 최고가와 평균가 기준으로 비교합니다. 연봉 대비 체감 비교와 매매 자금 계산기 연결까지 한 번에 확인하세요.",
    methodology:
      "서울 6개 구, 1000세대 이상, 입주 완료 단지, 전용 84㎡ 계열 기준으로 최근 1년 가격 정리값을 비교했습니다.",
    caution:
      "재건축 예정 단지는 제외했고, 실거래 판단 전 국토교통부 실거래가 공개시스템과 주요 부동산 플랫폼에서 최신 값을 다시 확인해야 합니다.",
    updatedAt: "업데이트: 2026-03-26",
  },
  salaryBases: SALARY_BASES,
  filterOptions: {
    districts: (Object.keys(DISTRICT_LABELS) as DistrictKey[]).map((key) => ({
      value: key,
      label: DISTRICT_LABELS[key],
    })),
    grades: ["신축", "준신축"],
    sortOptions: [
      { value: "price_desc", label: "가격 높은 순" },
      { value: "price_asc", label: "가격 낮은 순" },
      { value: "name", label: "이름순" },
    ],
    priceModes: [
      { value: "avg", label: "평균가 기준" },
      { value: "high", label: "최고가 기준" },
    ],
  },
  entries,
  districtSummaries,
  faq: [
    {
      q: "국평은 왜 84㎡ 기준으로 보나요?",
      a: "국평은 실수요자가 가장 많이 비교하는 대표 면적대라서 지역 간 체감 가격 차이를 읽기에 적합합니다.",
    },
    {
      q: "최고가와 평균가는 어떻게 다른가요?",
      a: "최고가는 최근 상단 거래 사례, 평균가는 일반 시세 정리값입니다. 둘을 같이 보면 과열 여부와 체감 수준을 함께 읽을 수 있습니다.",
    },
    {
      q: "왜 재건축 예정 단지는 제외했나요?",
      a: "재건축 기대감은 일반 신축·준신축 실거주 비교와 다른 가격 요인이 크게 작동하므로 이번 MVP 범위에서는 제외했습니다.",
    },
    {
      q: "연봉 대비 몇 년치 계산은 무엇을 의미하나요?",
      a: "평균가를 특정 연봉 기준으로 단순 환산한 체감 지표입니다. 실제 대출 가능액, 세금, 보유 현금은 반영하지 않습니다.",
    },
    {
      q: "실제 매수 전 무엇을 더 확인해야 하나요?",
      a: "실거래가 추이, 대출 가능액, 취득세, 보유세, 중개보수, 실거주 의무와 같은 정책 조건을 함께 확인해야 합니다.",
    },
    {
      q: "데이터는 언제 업데이트되나요?",
      a: "기본 업데이트 기준일은 문서 상단의 업데이트 일자이며, 큰 시세 변화가 있으면 리포트와 데이터 파일을 함께 갱신합니다.",
    },
  ],
  insights: [
    {
      title: "반포권은 평균가만으로도 진입 장벽이 압도적이다",
      body: "래미안원베일리, 아크로리버파크, 래미안퍼스티지는 최고가뿐 아니라 평균가도 가장 높아 체감 비교에서 다른 구와 격차가 크게 벌어진다.",
    },
    {
      title: "송파권은 대단지 밀집 덕분에 비교군이 가장 풍부하다",
      body: "헬리오시티, 파크리오, 잠실트리지움처럼 대표 단지가 밀집해 있어 같은 국평 기준으로도 가격대 분포를 읽기 좋다.",
    },
    {
      title: "마포·성동은 강남권보다 낮지만 체감 진입 장벽은 여전히 높다",
      body: "평균가만 보면 강남·서초보다 낮지만, 평균 직장인 기준 수십 년치 연봉이 필요한 구간이라 체감상 쉬운 진입 구간은 아니다.",
    },
    {
      title: "최고가와 평균가 차이가 큰 단지는 해석이 필요하다",
      body: "일부 단지는 최고가와 평균가 격차가 크게 벌어져 있어 단일 거래 사례보다 일반 시세와 실거래 흐름을 함께 봐야 한다.",
    },
  ],
  relatedLinks: [
    { href: "/tools/home-purchase-fund/", label: "부동산 매매 자금 계산기" },
    { href: "/reports/korea-rich-top10-assets/", label: "한국 부자 TOP 10 자산 비교 리포트" },
    { href: "/reports/", label: "비교 리포트 모아보기" },
  ],
  referenceLinks: {
    price: [
      {
        label: "국토교통부 실거래가 공개시스템",
        href: "https://rt.molit.go.kr/",
      },
      {
        label: "KB부동산",
        href: "https://kbland.kr/",
      },
      {
        label: "네이버부동산",
        href: "https://new.land.naver.com/",
      },
    ],
    loanTax: [
      {
        label: "주택도시기금 대출 안내",
        href: "https://nhuf.molit.go.kr/",
      },
      {
        label: "지방세 취득세 안내",
        href: "https://www.wetax.go.kr/",
      },
      {
        label: "정책브리핑 부동산 정책",
        href: "https://www.korea.kr/policy/mainList.do?policyType=policymain",
      },
    ],
  },
  affiliateProducts: [
    {
      tag: "실측 준비",
      title: "줄자·거리 측정 도구",
      desc: "방 크기, 가구 배치, 수납 가능 공간을 직접 확인할 때 유용한 기본 준비물",
      url: "https://link.coupang.com/a/edfts2",
    },
    {
      tag: "정리 계획",
      title: "이사 박스·정리함 세트",
      desc: "입주 직후 자주 쓰는 물건부터 빠르게 정리할 수 있는 기본 수납 아이템",
      url: "https://link.coupang.com/a/edft4X",
    },
    {
      tag: "생활 준비",
      title: "입주 청소 용품 모음",
      desc: "새집 청소와 주방·욕실 기본 정리를 시작할 때 바로 쓰기 좋은 구성",
      url: "https://link.coupang.com/a/edfuQA",
    },
  ],
};

export function formatEok(value: number | null) {
  if (value === null) return "-";
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}억`;
}

export function formatManwon(value: number | null) {
  if (value === null) return "-";
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

export function formatYears(value: number | null) {
  if (value === null) return "-";
  return `${value.toFixed(1)}년`;
}
