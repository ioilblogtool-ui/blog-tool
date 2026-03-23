export type InteractiveEntry = {
  name: string;
  sal: number;      // 만원 (영끌 연봉: 계약+성과급 현금성 기준)
  cat: "semi" | "car" | "it" | "chem" | "fin" | "for";
  tier: "s" | "a" | "b" | "c";
  note: string;
};

export type SalaryEntry = {
  slug: string;
  rank: number;
  name: string;
  nameEn: string;
  sector: string;
  sectorType: "it" | "semiconductor" | "auto" | "finance" | "public" | "conglomerate" | "battery" | "food" | "chemical" | "logistics";
  annualKrwM: number;       // 만원
  monthlyNetKrwM: number;   // 만원 (세후 추정)
  totalCompM?: number;      // 만원 (성과급 포함 추정)
  tags: string[];
  benefits: string[];
  summary: string;
};

export type TierCompany = {
  name: string;
  note?: "it" | "public" | "sub"; // sub = ㉨ (tier 하단), it = ⓘ IT계열, public = ⓞ 공기업
};

export type SalaryTier = {
  salaryKrwM: number;          // 기준 만원
  label: string;               // "약 6,000만원"
  companies: TierCompany[];
};

export type NewEmployeeSalary2026Seed = {
  meta: {
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  tiers: SalaryTier[];
  entries: SalaryEntry[];
  interactiveData: InteractiveEntry[];
  sectorSummaries: { label: string; description: string }[];
  patternPoints: { title: string; body: string }[];
  faq: { q: string; a: string }[];
};

export const newEmployeeSalary2026: NewEmployeeSalary2026Seed = {
  meta: {
    title: "2026 신입사원 초봉 비교 리포트",
    subtitle: "IT·반도체·자동차·배터리·공기업 등 국내 주요 기업의 2026년 신입사원 초봉을 티어별로 비교합니다.",
    methodology: "잡플래닛·블라인드 집계, 공개 채용 공고, 언론 보도를 바탕으로 정리한 추정치입니다.",
    caution: "실제 지급액은 직군·부서·입사 시기·성과급에 따라 다를 수 있습니다. 모든 수치는 참고용 추정치입니다.",
    updatedAt: "2026년 3월 기준",
  },

  // ── 티어별 전체 기업 목록 ────────────────────────────────────────────────
  tiers: [
    {
      salaryKrwM: 7000,
      label: "약 7,000만원 이상",
      companies: [
        { name: "네이버", note: "it" },
        { name: "카카오", note: "it" },
        { name: "삼성전자 DS", note: "it" },
        { name: "SK하이닉스" },
      ],
    },
    {
      salaryKrwM: 6000,
      label: "약 6,000만원",
      companies: [
        { name: "삼성전자 DX" },
        { name: "현대자동차" },
        { name: "기아" },
        { name: "LG전자" },
        { name: "세아베스틸" },
        { name: "한국콜마" },
        { name: "중흥건설" },
        { name: "엔씨소프트", note: "it" },
        { name: "현대엘리베이터", note: "sub" },
        { name: "현대무벡스", note: "sub" },
      ],
    },
    {
      salaryKrwM: 5500,
      label: "약 5,500만원",
      companies: [
        { name: "삼성SDI" },
        { name: "포스코필바라리튬솔루션" },
        { name: "롯데정밀화학" },
        { name: "롯데이노베이트" },
        { name: "롯데이네오스화학" },
        { name: "효성" },
        { name: "효성화학" },
        { name: "효성중공업" },
        { name: "한국타이어" },
        { name: "금호타이어" },
        { name: "하이트진로" },
        { name: "케이조선", note: "sub" },
        { name: "세방전지", note: "sub" },
        { name: "코스맥스", note: "sub" },
        { name: "코비", note: "sub" },
        { name: "경동나비엔", note: "sub" },
        { name: "동국제강", note: "sub" },
        { name: "에코프로비엠", note: "sub" },
      ],
    },
    {
      salaryKrwM: 5000,
      label: "약 5,000만원",
      companies: [
        { name: "SK오션플랜트" },
        { name: "롯데칠성" },
        { name: "롯데쇼핑" },
        { name: "CJ대한통운" },
        { name: "GS리테일" },
        { name: "GS EPS" },
        { name: "코오롱인더스트리" },
        { name: "OCI" },
        { name: "쿠쿠전자", note: "sub" },
        { name: "삼화페인트", note: "sub" },
        { name: "국도화학", note: "sub" },
        { name: "유라코퍼레이션", note: "sub" },
        { name: "유한킴벌리", note: "sub" },
        { name: "대구텍", note: "sub" },
      ],
    },
    {
      salaryKrwM: 4500,
      label: "약 4,500만원",
      companies: [
        { name: "포스코와이드" },
        { name: "자화전자", note: "sub" },
        { name: "일진전기", note: "sub" },
        { name: "오뚜기", note: "sub" },
        { name: "현대종합금속", note: "sub" },
        { name: "원익피앤이", note: "sub" },
        { name: "풀무원", note: "sub" },
      ],
    },
    {
      salaryKrwM: 4000,
      label: "약 4,000만원",
      companies: [
        { name: "영풍" },
        { name: "서울시설공단", note: "public" },
        { name: "한국도로공사", note: "public" },
        { name: "한국수자원공사", note: "public" },
      ],
    },
    {
      salaryKrwM: 3500,
      label: "약 3,500만원",
      companies: [
        { name: "한국석유공사", note: "public" },
        { name: "한국철도공사(코레일)", note: "public" },
      ],
    },
    {
      salaryKrwM: 2650,
      label: "약 2,650만원",
      companies: [
        { name: "9급 공무원(1호봉)", note: "public" },
      ],
    },
  ],

  // ── 대표 기업 개별 프로필 ────────────────────────────────────────────────
  entries: [
    {
      slug: "naver",
      rank: 1,
      name: "네이버",
      nameEn: "NAVER",
      sector: "IT·플랫폼",
      sectorType: "it",
      annualKrwM: 7000,
      monthlyNetKrwM: 490,
      totalCompM: 9000,
      tags: ["IT", "플랫폼", "RSU", "재택 유연"],
      benefits: ["RSU·스톡옵션 제공", "선택적 복리후생", "유연근무제", "사내식당"],
      summary: "국내 IT 플랫폼 최상위 초봉 수준. 기본급 7,000만 원대에 RSU·성과급이 더해져 총보상은 9천만 원 이상으로 추정됩니다.",
    },
    {
      slug: "sk-hynix",
      rank: 2,
      name: "SK하이닉스",
      nameEn: "SK Hynix",
      sector: "반도체",
      sectorType: "semiconductor",
      annualKrwM: 6500,
      monthlyNetKrwM: 456,
      totalCompM: 12000,
      tags: ["반도체", "HBM", "PS·PI", "글로벌"],
      benefits: ["PS·PI 성과급", "우리사주", "기숙사·사내대출", "자녀 학자금"],
      summary: "HBM 수요 급증으로 PS·PI 포함 총보상 기준 국내 최고 수준 경쟁 중. 성과급이 기본급을 초과하는 해도 있습니다.",
    },
    {
      slug: "samsung-elec",
      rank: 3,
      name: "삼성전자",
      nameEn: "Samsung Electronics",
      sector: "반도체·전자",
      sectorType: "semiconductor",
      annualKrwM: 6000,
      monthlyNetKrwM: 421,
      totalCompM: 10000,
      tags: ["반도체", "OPI·TAI", "글로벌", "DS/DX"],
      benefits: ["OPI·TAI 성과급", "자사주 매입", "기숙사·사내대출", "복지포인트"],
      summary: "DS(반도체)·DX(가전) 부문에 따라 처우가 다릅니다. 성과급(OPI+TAI) 포함 총보상은 업황에 따라 1억 원을 넘기도 합니다.",
    },
    {
      slug: "hyundai-motor",
      rank: 4,
      name: "현대자동차",
      nameEn: "Hyundai Motor",
      sector: "자동차",
      sectorType: "auto",
      annualKrwM: 6000,
      monthlyNetKrwM: 421,
      totalCompM: 8500,
      tags: ["자동차", "성과금", "EV전환", "글로벌"],
      benefits: ["성과금·격려금", "자사차 구매 할인", "사내대출", "복지포인트"],
      summary: "EV 전환 수혜로 성과금 수준이 높아지는 추세. 기본급 외 성과금·격려금 합산 시 총보상은 8천만 원 이상으로 추정됩니다.",
    },
    {
      slug: "ncsoft",
      rank: 5,
      name: "엔씨소프트",
      nameEn: "NCSoft",
      sector: "IT·게임",
      sectorType: "it",
      annualKrwM: 6000,
      monthlyNetKrwM: 421,
      totalCompM: 7500,
      tags: ["IT", "게임", "스톡옵션", "성과급"],
      benefits: ["스톡옵션", "유연근무제", "자기개발비", "사내식당"],
      summary: "국내 대형 게임사 중 최상위 초봉 수준. 게임 흥행에 따른 성과급 편차가 크며, 스톡옵션 포함 총보상은 7천만 원 이상으로 추정됩니다.",
    },
    {
      slug: "samsung-sdi",
      rank: 6,
      name: "삼성SDI",
      nameEn: "Samsung SDI",
      sector: "배터리·에너지",
      sectorType: "battery",
      annualKrwM: 5500,
      monthlyNetKrwM: 387,
      totalCompM: 7000,
      tags: ["배터리", "EV소재", "삼성그룹", "성과급"],
      benefits: ["성과급", "삼성그룹 복리후생", "사내대출", "자사주 우선매수"],
      summary: "전기차 배터리 핵심 계열사. 5,500만 원대 기본급에 성과급 포함 시 7천만 원대로, 배터리 섹터 내 상위 처우를 제공합니다.",
    },
    {
      slug: "ecopro-bm",
      rank: 7,
      name: "에코프로비엠",
      nameEn: "EcoPro BM",
      sector: "이차전지 소재",
      sectorType: "battery",
      annualKrwM: 5500,
      monthlyNetKrwM: 387,
      totalCompM: 6500,
      tags: ["양극재", "이차전지", "성장주", "경북 포항"],
      benefits: ["성과급", "우리사주", "기숙사 제공", "통근버스"],
      summary: "국내 양극재 1위 기업. 포항 근무가 기본이며 기숙사 제공으로 실질 가처분소득이 높습니다. 성장성 기대로 신입 지원 경쟁이 높아졌습니다.",
    },
    {
      slug: "cj-daehan",
      rank: 8,
      name: "CJ대한통운",
      nameEn: "CJ Logistics",
      sector: "물류",
      sectorType: "logistics",
      annualKrwM: 5000,
      monthlyNetKrwM: 352,
      totalCompM: 6000,
      tags: ["물류", "CJ그룹", "성과급", "글로벌"],
      benefits: ["성과급", "CJ그룹 복리후생", "사내식당", "복지포인트"],
      summary: "국내 물류 1위. CJ그룹 공동 복리후생이 강점이며, 물류·공급망 성장으로 처우 개선이 이어지고 있습니다.",
    },
    {
      slug: "ottogi",
      rank: 9,
      name: "오뚜기",
      nameEn: "Ottogi",
      sector: "식품",
      sectorType: "food",
      annualKrwM: 4500,
      monthlyNetKrwM: 316,
      totalCompM: 5500,
      tags: ["식품", "안정성", "복리후생", "성과급"],
      benefits: ["성과급", "자사제품 지급", "복지포인트", "사내식당"],
      summary: "식품 업계 상위 기업. 안정성이 높고 복리후생이 탄탄합니다. 기본급 4,500만 원대로 식품 업계 내 상위 처우입니다.",
    },
    {
      slug: "korea-expressway",
      rank: 10,
      name: "한국도로공사",
      nameEn: "Korea Expressway",
      sector: "공공·공기업",
      sectorType: "public",
      annualKrwM: 4000,
      monthlyNetKrwM: 281,
      totalCompM: 5000,
      tags: ["공기업", "정년보장", "연금", "복리후생"],
      benefits: ["공무원 준하는 연금", "정년 보장", "사택 제공", "자녀 학자금"],
      summary: "대표적인 중·대형 공기업. 기본급은 민간 대비 낮으나 정년 보장·사택·연금 등 장기 복리후생이 강점입니다.",
    },
    {
      slug: "korail",
      rank: 11,
      name: "한국철도공사(코레일)",
      nameEn: "KORAIL",
      sector: "공공·공기업",
      sectorType: "public",
      annualKrwM: 3500,
      monthlyNetKrwM: 246,
      totalCompM: 4200,
      tags: ["공기업", "철도", "정년보장", "안정성"],
      benefits: ["정년 보장", "준공무원 연금", "철도 무임 혜택", "자녀 학자금"],
      summary: "대형 공기업이나 초봉 기준으로는 민간 중소기업 수준. 정년 보장과 각종 수당·연금을 포함한 장기 관점의 실질 보상이 장점입니다.",
    },
    {
      slug: "grade9-civil",
      rank: 12,
      name: "9급 공무원",
      nameEn: "Grade-9 Civil Servant",
      sector: "공공·공무원",
      sectorType: "public",
      annualKrwM: 2650,
      monthlyNetKrwM: 190,
      totalCompM: 3100,
      tags: ["공무원", "정년보장", "연금", "안정성"],
      benefits: ["공무원 연금", "정년 보장", "육아휴직 90%+ 사용", "의료비 지원"],
      summary: "2026년 9급 1호봉 기준 연봉 약 2,650만 원. 명목 연봉은 최하위권이나 공무원연금·정년·육아 제도 활용 용이성을 장기 관점에서 평가해야 합니다.",
    },
  ],

  // ── 영끌 연봉 인터랙티브 데이터 (계약+성과급 현금성 기준, 야근 제외) ─────────────
  interactiveData: [
    // S티어 — 9,000만 이상
    { name: "SK하이닉스",             sal: 15000, cat: "semi", tier: "s", note: "OPI 포함" },
    { name: "ASML",                   sal: 13000, cat: "for",  tier: "s", note: "외국계" },
    { name: "현대자동차",             sal: 9500,  cat: "car",  tier: "s", note: "" },
    { name: "기아",                   sal: 9500,  cat: "car",  tier: "s", note: "" },
    { name: "현대모비스",             sal: 9500,  cat: "car",  tier: "s", note: "" },
    { name: "한화에어로스페이스",     sal: 9500,  cat: "semi", tier: "s", note: "" },
    { name: "삼성바이오로직스",       sal: 9000,  cat: "chem", tier: "s", note: "" },
    { name: "HD현대일렉트릭",         sal: 9000,  cat: "car",  tier: "s", note: "" },
    { name: "HD한국조선해양",         sal: 9000,  cat: "car",  tier: "s", note: "" },
    // A티어 — 6,000 ~ 9,000만
    { name: "삼성전자 DX(MX)",        sal: 8500,  cat: "semi", tier: "a", note: "50%기준" },
    { name: "현대글로비스",           sal: 8500,  cat: "car",  tier: "a", note: "" },
    { name: "현대로템",               sal: 8500,  cat: "car",  tier: "a", note: "" },
    { name: "한화비전",               sal: 8500,  cat: "semi", tier: "a", note: "" },
    { name: "HD현대삼호",             sal: 8500,  cat: "car",  tier: "a", note: "" },
    { name: "삼성전자 DS",            sal: 8000,  cat: "semi", tier: "a", note: "47%기준" },
    { name: "SK텔레콤",               sal: 8000,  cat: "it",   tier: "a", note: "" },
    { name: "현대위아",               sal: 8000,  cat: "car",  tier: "a", note: "" },
    { name: "현대건설",               sal: 8000,  cat: "car",  tier: "a", note: "" },
    { name: "포스코인터내셔널",       sal: 8000,  cat: "chem", tier: "a", note: "" },
    { name: "HD현대중공업",           sal: 8000,  cat: "car",  tier: "a", note: "" },
    { name: "S-OIL",                  sal: 8000,  cat: "chem", tier: "a", note: "" },
    { name: "셀트리온",               sal: 8000,  cat: "chem", tier: "a", note: "" },
    { name: "한국항공우주(KAI)",      sal: 8000,  cat: "car",  tier: "a", note: "" },
    { name: "삼성전자 DX(생기연)",    sal: 7500,  cat: "semi", tier: "a", note: "36~39%" },
    { name: "삼성물산",               sal: 7500,  cat: "chem", tier: "a", note: "" },
    { name: "삼성디스플레이",         sal: 7500,  cat: "semi", tier: "a", note: "" },
    { name: "현대트랜시스",           sal: 7500,  cat: "car",  tier: "a", note: "" },
    { name: "한화엔진",               sal: 7500,  cat: "car",  tier: "a", note: "" },
    { name: "HD현대건설기계",         sal: 7500,  cat: "car",  tier: "a", note: "" },
    { name: "LIG넥스원",              sal: 7500,  cat: "car",  tier: "a", note: "" },
    { name: "KB국민은행",             sal: 7500,  cat: "fin",  tier: "a", note: "" },
    { name: "현대해상",               sal: 7500,  cat: "fin",  tier: "a", note: "" },
    { name: "SK실트론",               sal: 7000,  cat: "semi", tier: "a", note: "" },
    { name: "SK온",                   sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "현대오토에버",           sal: 7000,  cat: "it",   tier: "a", note: "" },
    { name: "현대제철",               sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "LG전자(HS사업부)",       sal: 7000,  cat: "car",  tier: "a", note: "" },
    { name: "LG이노텍(광학)",         sal: 7000,  cat: "semi", tier: "a", note: "" },
    { name: "LG유플러스",             sal: 7000,  cat: "it",   tier: "a", note: "" },
    { name: "포스코",                 sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "GS칼텍스",               sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "GS건설",                 sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "두산에너빌리티",         sal: 7000,  cat: "car",  tier: "a", note: "" },
    { name: "HMM",                    sal: 7000,  cat: "chem", tier: "a", note: "" },
    { name: "네이버",                 sal: 7000,  cat: "it",   tier: "a", note: "" },
    { name: "넥슨",                   sal: 7000,  cat: "it",   tier: "a", note: "" },
    { name: "KT",                     sal: 7000,  cat: "it",   tier: "a", note: "" },
    // B티어 — 5,000 ~ 6,500만
    { name: "LG전자",                 sal: 6500,  cat: "car",  tier: "b", note: "" },
    { name: "LG CNS",                 sal: 6500,  cat: "it",   tier: "b", note: "" },
    { name: "LG이노텍",               sal: 6500,  cat: "semi", tier: "b", note: "광학 외" },
    { name: "한화오션",               sal: 6500,  cat: "car",  tier: "b", note: "" },
    { name: "LS전선",                 sal: 6500,  cat: "chem", tier: "b", note: "" },
    { name: "두산밥캣",               sal: 6500,  cat: "car",  tier: "b", note: "" },
    { name: "카카오",                 sal: 6500,  cat: "it",   tier: "b", note: "" },
    { name: "고려아연",               sal: 6500,  cat: "chem", tier: "b", note: "" },
    { name: "CJ올리브영",             sal: 6500,  cat: "fin",  tier: "b", note: "" },
    { name: "대한항공",               sal: 6500,  cat: "car",  tier: "b", note: "" },
    { name: "삼성전자 DX(VD·DA)",     sal: 6000,  cat: "semi", tier: "b", note: "12%기준" },
    { name: "삼성SDS",                sal: 6000,  cat: "it",   tier: "b", note: "" },
    { name: "삼성전기",               sal: 6000,  cat: "semi", tier: "b", note: "" },
    { name: "삼성중공업",             sal: 6000,  cat: "car",  tier: "b", note: "" },
    { name: "LG에너지솔루션",         sal: 6000,  cat: "chem", tier: "b", note: "" },
    { name: "LG화학",                 sal: 6000,  cat: "chem", tier: "b", note: "" },
    { name: "LG디스플레이",           sal: 6000,  cat: "semi", tier: "b", note: "" },
    { name: "롯데케미칼",             sal: 6000,  cat: "chem", tier: "b", note: "" },
    { name: "CJ제일제당",             sal: 6000,  cat: "chem", tier: "b", note: "" },
    { name: "엔씨소프트",             sal: 6000,  cat: "it",   tier: "b", note: "" },
    { name: "현대엘리베이터",         sal: 6000,  cat: "car",  tier: "b", note: "" },
    // C티어 — 5,000만 미만
    { name: "삼성SDI",                sal: 5500,  cat: "semi", tier: "c", note: "" },
    { name: "한국타이어",             sal: 5500,  cat: "car",  tier: "c", note: "" },
    { name: "금호타이어",             sal: 5500,  cat: "car",  tier: "c", note: "" },
    { name: "효성중공업",             sal: 5500,  cat: "chem", tier: "c", note: "" },
    { name: "하이트진로",             sal: 5500,  cat: "chem", tier: "c", note: "" },
    { name: "CJ대한통운",             sal: 5000,  cat: "car",  tier: "c", note: "" },
    { name: "GS리테일",               sal: 5000,  cat: "fin",  tier: "c", note: "" },
    { name: "롯데칠성",               sal: 5000,  cat: "chem", tier: "c", note: "" },
    { name: "코오롱인더스트리",       sal: 5000,  cat: "chem", tier: "c", note: "" },
  ],

  sectorSummaries: [
    {
      label: "IT·플랫폼·게임",
      description: "네이버·넥슨·KT 등이 7,000만 원대. RSU·스톡옵션 포함 총보상 기준으로 글로벌 수준에 근접 중입니다.",
    },
    {
      label: "반도체·방산",
      description: "SK하이닉스는 OPI 포함 영끌 기준 1.5억으로 전 업종 1위. 한화에어로스페이스 등 방산주도 9,500만대로 급상승 중입니다.",
    },
    {
      label: "완성차·조선",
      description: "현대차·기아·현대모비스가 성과금 포함 9,500만 원대로 약진. 조선 3사도 8,500~9,000만 원대로 2026년 처우 회복 뚜렷합니다.",
    },
    {
      label: "배터리·이차전지",
      description: "삼성SDI·LG에너지솔루션 등이 5,500~6,000만 원대. 지방 근무 기숙사 제공으로 실질 가처분소득은 더 높게 평가됩니다.",
    },
    {
      label: "공기업·공무원",
      description: "명목 초봉은 3,500~4,000만 원으로 민간 대비 낮지만, 정년 보장·연금·육아 제도 활용 면에서 민간과 본질적 차이가 있습니다.",
    },
    {
      label: "외국계",
      description: "ASML이 1.3억으로 외국계 최고. 채용 규모는 작지만 초봉 자체는 국내 대기업 대비 30~50% 높은 수준입니다.",
    },
  ],

  patternPoints: [
    {
      title: "반도체·방산이 영끌 기준 상위 독식",
      body: "SK하이닉스는 OPI 포함 영끌 연봉 1.5억으로 전 업종 압도적 1위. 한화에어로스페이스·LIG넥스원 등 K-방산도 9,500~8,000만 원대로 급상승했습니다. 2026년 들어 방산 종목의 초봉이 전통 IT 대기업 수준을 넘어선 것이 주목됩니다.",
    },
    {
      title: "완성차·조선의 약진 — 기본급의 1.5배 성과금",
      body: "현대차·기아·현대모비스가 성과금 포함 9,500만 원대로, 기본급(6,000만 원대) 대비 훨씬 높습니다. 조선 3사(HD현대중공업·한국조선해양·삼호)도 초호황 수주 잔고를 바탕으로 8,500~9,000만 원대로 회복됐습니다.",
    },
    {
      title: "같은 티어도 성과급 포함 시 격차 벌어져",
      body: "기본급만 보면 6,000만 원대에 많은 기업이 포진되지만, 영끌 연봉 기준으로는 반도체·완성차가 IT 플랫폼을 앞지릅니다. 삼성전자도 사업부별 성과급 비율(DS 47%, DX MX 50%, VD·DA 12%)에 따라 영끌 격차가 2,500만 원 이상 벌어집니다.",
    },
    {
      title: "공기업·공무원, 초봉보다 장기 관점이 핵심",
      body: "9급 공무원(2,650만 원)~한국도로공사(4,000만 원)는 민간 대기업 대비 초봉이 크게 낮습니다. 하지만 공무원연금, 정년 보장, 육아휴직 실사용률 등 장기 관점의 총가치를 별도로 평가해야 합니다.",
    },
  ],

  faq: [
    {
      q: "이 리포트의 초봉 수치는 공식 자료인가요?",
      a: "잡플래닛·블라인드 집계, 공개 채용 공고, 언론 보도를 바탕으로 정리한 추정치입니다. 실제 지급액은 직군·부서·입사 시기에 따라 다릅니다. 반드시 해당 기업의 공식 채용 공고를 확인하세요.",
    },
    {
      q: "티어 표시 기호(ⓘ·㉨·ⓞ)는 무슨 의미인가요?",
      a: "ⓘ는 IT 계열 기업, ⓞ는 공기업(공공기관), ㉨는 해당 티어 기준에서 약간 하단으로 분류되는 기업을 의미합니다. 예를 들어 5,500만 원 티어의 ㉨ 표시 기업은 5,300~5,400만 원 수준으로 추정됩니다.",
    },
    {
      q: "성과급은 초봉에 포함되나요?",
      a: "기본 항목은 기본급+제수당 중심의 연봉 기준입니다. 성과급 포함 총보상은 '성과급 포함 추정'으로 별도 표기합니다. 성과급은 연도별 실적에 따라 크게 달라집니다.",
    },
    {
      q: "월 실수령 계산 방법은?",
      a: "4대보험(국민연금 4.5%, 건강보험 3.545%+장기요양, 고용보험 0.9%) 및 근로소득세 공제를 적용한 추정치입니다. 부양가족, 비과세 항목에 따라 실제와 차이가 날 수 있습니다.",
    },
    {
      q: "같은 회사라도 직군마다 초봉이 다를 수 있나요?",
      a: "네. 동일 기업 내에서도 이공계·상경계·IT 개발직·영업직 등 직군에 따라 초봉 차이가 있을 수 있습니다. 특히 삼성전자 DS(반도체)와 DX(가전) 부문 간 처우 차이가 대표적인 사례입니다.",
    },
  ],
};

export function formatKrwM(m: number): string {
  if (m >= 10000) {
    const uk = m / 10000;
    return (uk % 1 === 0 ? uk : uk.toFixed(1)) + "억원";
  }
  return m.toLocaleString("ko-KR") + "만원";
}
