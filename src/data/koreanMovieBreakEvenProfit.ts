export type ProfitResult = "hit" | "breakeven" | "loss";

export interface KoreanMovieMeta {
  slug: string;
  title: string;
  subtitle: string;
  methodology: string;
  caution: string;
  updatedAt: string;
}

export interface KoreanMovieKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "warn";
}

export interface MovieRecord {
  id: string;
  title: string;
  year: number;
  audienceCount: number;    // 만 명
  boxOfficeRevenue: number; // 억 원
  productionCost: number | null; // 억 원
  breakEvenPoint: number | null; // 만 명
  breakEvenSource: string;
  profitResult: ProfitResult;
  profitLabel: string;
  roi: number | null; // %
  isEstimate: boolean;
  badges: string[];
  comment: string;
}

export interface LowBudgetCard {
  title: string;
  year: number;
  productionCost: number;   // 억 원
  audienceCount: number;    // 만 명
  profitLabel: string;
  highlight: string;
}

export interface BreakEvenFactorCard {
  title: string;
  description: string;
}

export interface KoreanMovieFaqItem {
  q: string;
  a: string;
}

export interface KoreanMovieRelatedLink {
  label: string;
  href: string;
}

export interface KoreanMovieBreakEvenReportData {
  meta: KoreanMovieMeta;
  kpis: KoreanMovieKpi[];
  movies: MovieRecord[];
  lowBudgetCards: LowBudgetCard[];
  breakEvenFactors: BreakEvenFactorCard[];
  millenniumSurpriseNote: string;
  faq: KoreanMovieFaqItem[];
  relatedLinks: KoreanMovieRelatedLink[];
}

export const koreanMovieReport: KoreanMovieBreakEvenReportData = {
  meta: {
    slug: "korean-movie-break-even-profit",
    title: "대한민국 영화 TOP 손익분기점과 실제 수익 비교 | 비교계산소",
    subtitle: "많이 본 영화와 많이 번 영화는 다를 수 있습니다",
    methodology:
      "관객 수는 KOBIS 공식 통계 기준입니다. 제작비·손익분기점은 공개 기사 및 인터뷰 자료를 기준으로 수집했으며, 비공개 항목은 표기하지 않습니다.",
    caution:
      "실제 정산 구조, 투자 계약, 부가판권 수익, 인센티브 지급 내역은 작품별로 다를 수 있습니다. 추정 표기 수치는 참고용입니다.",
    updatedAt: "KOBIS 기준 2026년 3월 기준 데이터. 왕과 사는 남자는 2026년 3월 집계 기준.",
  },

  kpis: [
    {
      label: "역대 최다 관객 영화",
      value: "명량 (2014)",
      sub: "1,761만 명 · 역대 1위",
      tone: "accent",
    },
    {
      label: "2026 최고 화제작",
      value: "왕과 사는 남자 (2026)",
      sub: "순제작비 105억 · 관객 1,561만 · 박스오피스 1,507억",
      tone: "accent",
    },
    {
      label: "역대 저예산 대박 1위 추정",
      value: "왕의 남자 (2005)",
      sub: "제작비 약 50억 · 관객 1,230만 · 추정 ROI 최상위",
      tone: "neutral",
    },
    {
      label: "천만인데 의외의 포인트",
      value: "해운대 (2009)",
      sub: "제작비 약 130억 · 천만 달성 but 고비용 구조",
      tone: "warn",
    },
  ],

  movies: [
    {
      id: "wang-saneun-namja",
      title: "왕과 사는 남자",
      year: 2026,
      audienceCount: 1561,
      boxOfficeRevenue: 1507,
      productionCost: 105,
      breakEvenPoint: 260,
      breakEvenSource: "언론 보도 기준 (한국경제, 머니투데이 2026.03 보도)",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 950,
      isEstimate: true,
      badges: ["천만", "저예산", "고효율", "2026신작"],
      comment: "장항준 감독. 손익분기점 260만 대비 6배 초과. 순제작비 105억으로 박스오피스 1,507억",
    },
    {
      id: "myungryang",
      title: "명량",
      year: 2014,
      audienceCount: 1761,
      boxOfficeRevenue: 1357,
      productionCost: 180,
      breakEvenPoint: 800,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 650,
      isEstimate: true,
      badges: ["천만", "역대1위"],
      comment: "역대 최다 관객. 제작비 대비 수익률도 압도적",
    },
    {
      id: "geukhanjikup",
      title: "극한직업",
      year: 2019,
      audienceCount: 1626,
      boxOfficeRevenue: 1396,
      productionCost: 65,
      breakEvenPoint: 280,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 1900,
      isEstimate: true,
      badges: ["천만", "저예산", "고효율"],
      comment: "저예산으로 역대 2위 흥행. 추정 ROI 기준 최상위권",
    },
    {
      id: "singwahamkke1",
      title: "신과함께-죄와 벌",
      year: 2017,
      audienceCount: 1441,
      boxOfficeRevenue: 1151,
      productionCost: 230,
      breakEvenPoint: 700,
      breakEvenSource: "배급사 발표 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 400,
      isEstimate: true,
      badges: ["천만", "대작"],
      comment: "VFX 대작임에도 제작비 대비 충분한 흥행 달성",
    },
    {
      id: "gwanghae",
      title: "광해, 왕이 된 남자",
      year: 2012,
      audienceCount: 1231,
      boxOfficeRevenue: 955,
      productionCost: 116,
      breakEvenPoint: 460,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 520,
      isEstimate: true,
      badges: ["천만", "고효율"],
      comment: "이병헌 1인 2역, 2012년 최고 흥행. 합리적 제작비 대비 높은 수익성",
    },
    {
      id: "gukjesinsi",
      title: "국제시장",
      year: 2014,
      audienceCount: 1426,
      boxOfficeRevenue: 1112,
      productionCost: 170,
      breakEvenPoint: 650,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 480,
      isEstimate: true,
      badges: ["천만"],
      comment: "중간 규모 제작비로 천만 돌파, 안정적 수익 구조",
    },
    {
      id: "beomjoedosi4",
      title: "범죄도시4",
      year: 2024,
      audienceCount: 1150,
      boxOfficeRevenue: 943,
      productionCost: 120,
      breakEvenPoint: 400,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 580,
      isEstimate: true,
      badges: ["천만", "고효율"],
      comment: "시리즈 4편으로 다시 천만. 합리적 제작비 구조 유지",
    },
    {
      id: "ode-to-my-father-cn",
      title: "베테랑",
      year: 2015,
      audienceCount: 1341,
      boxOfficeRevenue: 1054,
      productionCost: 130,
      breakEvenPoint: 500,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 510,
      isEstimate: true,
      badges: ["천만"],
      comment: "2015년 여름 최강 흥행작. 제작비 대비 효율 우수",
    },
    {
      id: "ode-to-my-father",
      title: "도둑들",
      year: 2012,
      audienceCount: 1298,
      boxOfficeRevenue: 936,
      productionCost: 120,
      breakEvenPoint: 490,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 480,
      isEstimate: true,
      badges: ["천만"],
      comment: "2012년 역대 최초 천만 초과. 앙상블 액션 수익 검증",
    },
    {
      id: "wangenamja",
      title: "왕의 남자",
      year: 2005,
      audienceCount: 1230,
      boxOfficeRevenue: 670,
      productionCost: 50,
      breakEvenPoint: 180,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 2100,
      isEstimate: true,
      badges: ["천만", "저예산", "고효율"],
      comment: "2005년 초저예산 천만 신화. 추정 ROI 역대 최상위",
    },
    {
      id: "gwoemul",
      title: "괴물",
      year: 2006,
      audienceCount: 1302,
      boxOfficeRevenue: 680,
      productionCost: 130,
      breakEvenPoint: 600,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "흑자",
      roi: 300,
      isEstimate: true,
      badges: ["천만"],
      comment: "봉준호 감독 국내 최초 1000만. CG 비용 감안 시 합리적 수익",
    },
    {
      id: "haundae",
      title: "해운대",
      year: 2009,
      audienceCount: 1132,
      boxOfficeRevenue: 728,
      productionCost: 130,
      breakEvenPoint: 600,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "흑자",
      roi: 290,
      isEstimate: true,
      badges: ["천만", "대작"],
      comment: "천만 달성했으나 고예산 CG 구조상 수익률은 상대적으로 낮음",
    },
    {
      id: "assassination",
      title: "암살",
      year: 2015,
      audienceCount: 1270,
      boxOfficeRevenue: 987,
      productionCost: 175,
      breakEvenPoint: 650,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 380,
      isEstimate: true,
      badges: ["천만"],
      comment: "2015년 광복 70주년 흥행작. 대규모 올로케 비용 감안 시 우수",
    },
    {
      id: "ode-to-my-father2",
      title: "어벤져스: 엔드게임",
      year: 2019,
      audienceCount: 1393,
      boxOfficeRevenue: 1217,
      productionCost: null,
      breakEvenPoint: null,
      breakEvenSource: "마블 공개 미기준 (글로벌 예산 비공개)",
      profitResult: "hit",
      profitLabel: "글로벌 대작",
      roi: null,
      isEstimate: false,
      badges: ["천만", "외국영화"],
      comment: "한국 개봉 기준 천만 돌파. 국내 제작비 분리 불가",
    },
    {
      id: "singwahamkke2",
      title: "신과함께-인과 연",
      year: 2018,
      audienceCount: 1227,
      boxOfficeRevenue: 966,
      productionCost: 200,
      breakEvenPoint: 700,
      breakEvenSource: "배급사 발표 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 310,
      isEstimate: true,
      badges: ["천만", "대작"],
      comment: "1편 성공 기반으로 2편도 천만. 연속 대작 리스크 관리 성공",
    },
    {
      id: "beomjoedosi",
      title: "범죄도시",
      year: 2017,
      audienceCount: 688,
      boxOfficeRevenue: 538,
      productionCost: 55,
      breakEvenPoint: 200,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 880,
      isEstimate: true,
      badges: ["저예산", "고효율"],
      comment: "천만은 아니지만 저예산 대비 압도적 성과. 시리즈 발판",
    },
    {
      id: "okja",
      title: "기생충",
      year: 2019,
      audienceCount: 1031,
      boxOfficeRevenue: 820,
      productionCost: 135,
      breakEvenPoint: 500,
      breakEvenSource: "언론 보도 기준",
      profitResult: "hit",
      profitLabel: "대박",
      roi: 410,
      isEstimate: true,
      badges: ["천만", "고효율"],
      comment: "칸 황금종려상 + 아카데미 4관왕. 해외 부가수익 별도",
    },
  ],

  lowBudgetCards: [
    {
      title: "왕과 사는 남자",
      year: 2026,
      productionCost: 105,
      audienceCount: 1561,
      profitLabel: "역대급 대박",
      highlight:
        "장항준 감독. 순제작비 105억으로 1,561만 관객, 박스오피스 1,507억 달성. 손익분기점 260만 대비 6배 초과. 제작비 대비 박스오피스 매출 약 14.4배.",
    },
    {
      title: "왕의 남자",
      year: 2005,
      productionCost: 50,
      audienceCount: 1230,
      profitLabel: "초대박",
      highlight:
        "제작비 50억 원으로 1,230만 관객을 달성한 국내 저예산 대박의 교과서. 추정 ROI 2,000% 이상.",
    },
    {
      title: "극한직업",
      year: 2019,
      productionCost: 65,
      audienceCount: 1626,
      profitLabel: "초대박",
      highlight:
        "65억 원 제작비로 1,626만 관객. 역대 2위 흥행작 중 제작비 대비 효율이 가장 높은 사례 중 하나.",
    },
    {
      title: "범죄도시",
      year: 2017,
      productionCost: 55,
      audienceCount: 688,
      profitLabel: "대박",
      highlight:
        "55억 원 제작비로 688만 관객. 천만은 아니지만 투자 대비 성과가 뛰어나 4편 시리즈로 이어졌다.",
    },
    {
      title: "귀신이 산다",
      year: 2004,
      productionCost: 12,
      audienceCount: 303,
      profitLabel: "대박",
      highlight:
        "12억 원 초저예산으로 300만 관객 돌파. 제작비 대비 최고 수준의 수익률을 기록한 저예산 코미디.",
    },
  ],

  breakEvenFactors: [
    {
      title: "순제작비 vs 총제작비 혼재",
      description:
        "순제작비는 촬영·인건비·후반작업 등 제작에 직접 투입된 비용만 포함합니다. 총제작비에는 P&A(마케팅·홍보)가 추가되어 훨씬 큽니다. 기사마다 어느 기준을 쓰느냐에 따라 수치가 달라집니다.",
    },
    {
      title: "P&A 비용 포함 여부",
      description:
        "P&A(Print & Advertising)는 홍보·마케팅·복사본 제작 비용입니다. 대형 영화는 P&A만 제작비의 30~50%에 달하기도 합니다. 이를 포함하면 손익분기점이 대폭 올라갑니다.",
    },
    {
      title: "배급·투자 정산 구조",
      description:
        "극장 매출의 약 50%는 극장 몫입니다. 나머지 배급사·투자사·제작사가 계약에 따라 나눕니다. 공개되지 않는 지분 구조 때문에 단순 박스오피스 매출로 수익을 추정하기 어렵습니다.",
    },
    {
      title: "부가판권 수익 반영 여부",
      description:
        "OTT 판권, 해외 배급, DVD, 방송권 등 부가판권 수익은 개봉 이후 수년간 이어집니다. 이를 반영하면 극장 흥행에서 본전권에 그쳤던 영화도 최종 수익이 달라질 수 있습니다.",
    },
    {
      title: "발표 시점과 출처 차이",
      description:
        "개봉 초반 인터뷰, 중간 보도, 최종 정산 후 자료가 서로 다른 기준과 시점의 수치를 담고 있습니다. 같은 영화도 출처마다 손익분기점 숫자가 다르게 보이는 이유입니다.",
    },
  ],

  millenniumSurpriseNote:
    "천만 영화라고 해서 수익률이 반드시 높은 것은 아닙니다. 제작비가 클수록 손익분기점도 높아지고, 같은 관객 수라도 수익 구조는 완전히 달라질 수 있습니다. 1,000만 관객을 동원했더라도 제작비와 P&A가 과도하게 투입됐다면 기대 이하의 수익성에 그칠 수 있습니다.",

  faq: [
    {
      q: "영화 손익분기점은 왜 기사마다 다르게 나오나요?",
      a: "제작비 기준(순제작비 vs 총제작비), P&A 홍보비 포함 여부, 배급 수수료 구조, 공개 시점 차이 때문입니다. 같은 영화도 인터뷰와 최종 정산 자료의 수치가 다를 수 있습니다.",
    },
    {
      q: "천만 영화면 무조건 대박인가요?",
      a: "아닙니다. 제작비와 P&A 비용에 따라 수익률은 크게 달라집니다. 고예산 대작의 경우 천만을 넘겨도 수익성이 기대보다 낮을 수 있고, 반대로 저예산 영화는 300~400만 관객만으로도 높은 수익률을 기록하기도 합니다.",
    },
    {
      q: "실제 수익은 정확히 알 수 있나요?",
      a: "상장사의 경우 실적 공시를 통해 일부 확인할 수 있지만, 개별 영화 단위의 정산 내역은 대부분 비공개입니다. 공개 기사와 인터뷰 기준 자료로만 비교가 가능하며, 이 리포트도 그 기준을 따릅니다.",
    },
    {
      q: "저예산 영화가 수익률이 더 높은 이유가 있나요?",
      a: "제작비가 낮으면 손익분기점도 낮아집니다. 같은 흥행 성과를 올려도 남기는 비율이 훨씬 큽니다. 또 홍보비 대비 입소문 효과가 크게 작용하는 경우 추가 마케팅 없이도 흥행이 이어지기도 합니다.",
    },
    {
      q: "제작비 정보는 어디서 확인하나요?",
      a: "KOBIS(영화진흥위원회 통합전산망)에서 일부 등록 데이터를 볼 수 있으며, 대부분은 배급사 발표 또는 언론 인터뷰를 통해 공개됩니다. 공개되지 않은 작품은 추정이나 업계 관계자 발언 기준으로 알려지기도 합니다.",
    },
  ],

  relatedLinks: [
    { label: "연봉 실수령 계산기", href: "/tools/salary" },
    { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator" },
    { label: "FIRE 계산기", href: "/tools/fire-calculator" },
    { label: "다른 비교 리포트 보기", href: "/reports/" },
  ],
};
