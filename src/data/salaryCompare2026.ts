// ── 2026 신입 연봉 비교 — 70개 이상 기업 데이터 ─────────────────────────────
// 현직자 커뮤니티 기반 추정치. 공식 자료 아님.

export type SalaryEntry = {
  name: string;
  sal: number;    // 만원
  cat: "semi" | "car" | "it" | "chem" | "fin" | "for";
  tier: "s" | "a" | "b" | "c";
  note?: string;
};

export const SALARY_COMPARE_META = {
  title: "2026 신입 연봉 비교 — 70개 기업 초봉 순위 총정리",
  subtitle:
    "반도체·완성차·IT·금융·외국계 주요 기업의 신입 영끌 연봉을 한눈에 비교합니다. 야근수당 제외, 현금성 복지 포함 기준.",
  methodology:
    "잡플래닛·블라인드·링커리어 집계 및 현직자 커뮤니티 기반 추정치입니다. 공식 자료가 아닙니다.",
  caution:
    "야근·특수직무·월세지원 제외, 계약연봉 + 성과급(OPI) 기준 현금성 복지만 반영. 중요한 결정 전에는 원문 공지와 공식 자료를 함께 확인하세요.",
  updatedAt: "2026년 3월 기준",
};

export const SALARY_COMPARE_DATA: SalaryEntry[] = [
  // ── S티어 (9,000만 이상) ──────────────────────────────────────────────────
  { name: "SK하이닉스",          sal: 15000, cat: "semi", tier: "s", note: "OPI 포함" },
  { name: "ASML",               sal: 13000, cat: "for",  tier: "s", note: "외국계" },
  { name: "현대자동차",           sal: 9500,  cat: "car",  tier: "s" },
  { name: "기아",                sal: 9500,  cat: "car",  tier: "s" },
  { name: "현대모비스",           sal: 9500,  cat: "car",  tier: "s" },
  { name: "한화에어로(LS·PGM)",   sal: 9500,  cat: "semi", tier: "s" },
  { name: "삼성바이오로직스",      sal: 9000,  cat: "chem", tier: "s" },
  { name: "HD현대일렉트릭",       sal: 9000,  cat: "car",  tier: "s" },
  { name: "HD한국조선해양",       sal: 9000,  cat: "car",  tier: "s" },

  // ── A티어 (6,000 ~ 9,000만) ──────────────────────────────────────────────
  { name: "삼성전자 DX(MX)",      sal: 8500,  cat: "semi", tier: "a", note: "50% 기준" },
  { name: "현대글로비스",          sal: 8500,  cat: "car",  tier: "a" },
  { name: "현대로템",              sal: 8500,  cat: "car",  tier: "a" },
  { name: "한화비전",              sal: 8500,  cat: "semi", tier: "a" },
  { name: "HD현대삼호",           sal: 8500,  cat: "car",  tier: "a" },
  { name: "삼성전자 DS",          sal: 8000,  cat: "semi", tier: "a", note: "47% 기준" },
  { name: "SK텔레콤",             sal: 8000,  cat: "it",   tier: "a" },
  { name: "현대위아",              sal: 8000,  cat: "car",  tier: "a" },
  { name: "현대건설",              sal: 8000,  cat: "car",  tier: "a" },
  { name: "포스코인터내셔널",      sal: 8000,  cat: "chem", tier: "a" },
  { name: "HD현대중공업",         sal: 8000,  cat: "car",  tier: "a" },
  { name: "S-OIL",               sal: 8000,  cat: "chem", tier: "a" },
  { name: "셀트리온",              sal: 8000,  cat: "chem", tier: "a" },
  { name: "한국항공우주(KAI)",     sal: 8000,  cat: "car",  tier: "a" },
  { name: "삼성전자 DX(생기연)",   sal: 7500,  cat: "semi", tier: "a", note: "36~39%" },
  { name: "삼성물산",              sal: 7500,  cat: "chem", tier: "a" },
  { name: "삼성디스플레이",         sal: 7500,  cat: "semi", tier: "a" },
  { name: "현대트랜시스",           sal: 7500,  cat: "car",  tier: "a" },
  { name: "한화엔진",              sal: 7500,  cat: "car",  tier: "a" },
  { name: "HD현대건설기계",        sal: 7500,  cat: "car",  tier: "a" },
  { name: "LIG넥스원",            sal: 7500,  cat: "car",  tier: "a" },
  { name: "KB은행",               sal: 7500,  cat: "fin",  tier: "a" },
  { name: "현대해상",              sal: 7500,  cat: "fin",  tier: "a" },
  { name: "SK실트론",             sal: 7000,  cat: "semi", tier: "a" },
  { name: "SK온",                 sal: 7000,  cat: "chem", tier: "a" },
  { name: "현대오토에버",          sal: 7000,  cat: "it",   tier: "a" },
  { name: "현대제철",              sal: 7000,  cat: "chem", tier: "a" },
  { name: "LG전자(HS)",           sal: 7000,  cat: "car",  tier: "a" },
  { name: "LG이노텍(광학)",        sal: 7000,  cat: "semi", tier: "a" },
  { name: "LG유플러스",            sal: 7000,  cat: "it",   tier: "a" },
  { name: "포스코",                sal: 7000,  cat: "chem", tier: "a" },
  { name: "GS칼텍스",             sal: 7000,  cat: "chem", tier: "a" },
  { name: "GS건설",               sal: 7000,  cat: "chem", tier: "a" },
  { name: "두산에너빌리티",         sal: 7000,  cat: "car",  tier: "a" },
  { name: "HMM",                  sal: 7000,  cat: "chem", tier: "a" },
  { name: "네이버",                sal: 7000,  cat: "it",   tier: "a" },
  { name: "넥슨",                  sal: 7000,  cat: "it",   tier: "a" },
  { name: "KT",                   sal: 7000,  cat: "it",   tier: "a" },

  // ── B티어 (5,000 ~ 6,500만) ──────────────────────────────────────────────
  { name: "LG전자",               sal: 6500,  cat: "car",  tier: "b" },
  { name: "LGCNS",               sal: 6500,  cat: "it",   tier: "b" },
  { name: "LG이노텍",             sal: 6500,  cat: "semi", tier: "b", note: "광학 외" },
  { name: "한화오션",              sal: 6500,  cat: "car",  tier: "b" },
  { name: "LS전선",               sal: 6500,  cat: "chem", tier: "b" },
  { name: "두산밥캣",              sal: 6500,  cat: "car",  tier: "b" },
  { name: "카카오",                sal: 6500,  cat: "it",   tier: "b" },
  { name: "고려아연",              sal: 6500,  cat: "chem", tier: "b" },
  { name: "CJ올리브영",            sal: 6500,  cat: "fin",  tier: "b" },
  { name: "대한항공",              sal: 6500,  cat: "car",  tier: "b" },
  { name: "삼성전자 DX(VD·DA)",   sal: 6000,  cat: "semi", tier: "b", note: "12% 기준" },
  { name: "삼성SDS",              sal: 6000,  cat: "it",   tier: "b" },
  { name: "삼성전기",              sal: 6000,  cat: "semi", tier: "b" },
  { name: "삼성중공업",            sal: 6000,  cat: "car",  tier: "b" },
  { name: "LG에너지솔루션",        sal: 6000,  cat: "chem", tier: "b" },
  { name: "LG화학",               sal: 6000,  cat: "chem", tier: "b" },
  { name: "LG디스플레이",          sal: 6000,  cat: "semi", tier: "b" },
  { name: "롯데케미칼",            sal: 6000,  cat: "chem", tier: "b" },
  { name: "CJ제일제당",            sal: 6000,  cat: "chem", tier: "b" },
  { name: "엔씨소프트",            sal: 6000,  cat: "it",   tier: "b" },
  { name: "현대엘리베이터",         sal: 6000,  cat: "car",  tier: "b" },

  // ── C티어 (5,000만 미만) ─────────────────────────────────────────────────
  { name: "삼성SDI",              sal: 5500,  cat: "semi", tier: "c" },
  { name: "한국타이어",            sal: 5500,  cat: "car",  tier: "c" },
  { name: "금호타이어",            sal: 5500,  cat: "car",  tier: "c" },
  { name: "효성중공업",            sal: 5500,  cat: "chem", tier: "c" },
  { name: "하이트진로",            sal: 5500,  cat: "chem", tier: "c" },
  { name: "CJ대한통운",            sal: 5000,  cat: "car",  tier: "c" },
  { name: "GS리테일",             sal: 5000,  cat: "fin",  tier: "c" },
  { name: "롯데칠성",              sal: 5000,  cat: "chem", tier: "c" },
  { name: "코오롱인더스트리",       sal: 5000,  cat: "chem", tier: "c" },
];

export const SALARY_COMPARE_INSIGHTS = [
  {
    industry: "반도체",
    color: "#9FE1CB",
    range: "8,000 — 15,000만",
    note: "SK하이닉스가 1.5억으로 전 업종 압도적 1위. 삼성전자는 사업부마다 8,000~8,500만으로 차이가 있어 지원 전 사업부 확인이 중요합니다.",
    avg: "업종 평균 9,500만 추정",
  },
  {
    industry: "완성차·부품",
    color: "#C0DD97",
    range: "6,000 — 9,500만",
    note: "현대차·기아·모비스가 9,500만으로 묶임. 고정OT·현장수당 제외 기준이라 실제 체감은 더 높을 수 있음. 현대글로비스·로템은 8,500만 수준.",
    avg: "업종 평균 7,800만 추정",
  },
  {
    industry: "IT·플랫폼",
    color: "#B5D4F4",
    range: "6,000 — 8,000만",
    note: "네이버·카카오·넥슨이 7,000만대로 집중. 대기업 제조업 대비 낮아 보이지만 스톡옵션·유연근무 등 비현금 복지 고려 시 체감이 달라질 수 있음.",
    avg: "업종 평균 6,800만 추정",
  },
  {
    industry: "화학·에너지",
    color: "#FAC775",
    range: "5,000 — 8,000만",
    note: "S-OIL·GS칼텍스 등 정유사가 8,000만 수준으로 높음. LG화학·롯데케미칼은 6,000만 수준. 동일 그룹사 내에서도 계열사별 격차가 큰 업종.",
    avg: "업종 평균 6,500만 추정",
  },
  {
    industry: "금융",
    color: "#ED93B1",
    range: "5,500 — 7,500만",
    note: "KB은행·현대해상이 7,500만. 성과급 구조가 다른 업종과 달리 연차 비중이 높아 초봉보다 5년차 이후 격차가 크게 벌어지는 특징.",
    avg: "업종 평균 6,500만 추정",
  },
  {
    industry: "외국계",
    color: "#AFA9EC",
    range: "9,500 — 13,000만",
    note: "ASML이 1.3억으로 외국계 최고. 채용 규모가 작아 진입장벽이 높지만 초봉 자체는 국내 대기업 대비 30~50% 높은 수준.",
    avg: "업종 평균 11,000만 추정",
  },
];

export const SALARY_COMPARE_FAQ = [
  {
    q: "야근수당을 왜 빼나요?",
    a: "고정 OT·교대수당·현장수당·출장수당은 회사마다 지급 방식이 달라 단순 비교가 불가능합니다. 계약연봉+성과급(OPI) 기준 현금성 복지만 포함해야 같은 조건으로 비교할 수 있어요.",
  },
  {
    q: "삼성전자가 사업부마다 다른 이유는?",
    a: "삼성전자는 DS(반도체)·DX(MX, VD/DA 등) 부문별로 성과급 비율이 다릅니다. DS 47%, DX MX 50%, VD·DA 12% 등 사업부 실적 연동 비율 차이로 영끌 연봉이 크게 달라집니다.",
  },
  {
    q: "이 데이터를 이직 협상에 써도 되나요?",
    a: "현직자 커뮤니티 기반 추정치라 공식 자료가 아닙니다. 참고 수준으로 활용하되, 실제 협상에는 공채 공고·잡플래닛·링커리어 등 공식 채널 자료를 함께 확인하는 것을 권장합니다.",
  },
  {
    q: "중견기업은 왜 적게 포함됐나요?",
    a: "현직자 댓글 기반 특성상 대기업·그룹사 데이터가 많이 수집됩니다. 중견기업 데이터는 신뢰도가 낮아 일부만 포함했으며, 향후 업데이트 시 보완할 예정입니다.",
  },
  {
    q: "성과급이 0인 기업은 왜 없나요?",
    a: "성과급 미정이거나 비현금·주식 비중이 높은 기업(한전, Google Korea, 토스 등)은 단순 비교가 어려워 이번 리포트에서 제외했습니다.",
  },
];

// 쿠팡파트너스 인라인 제품 (취업·연봉 협상 도서)
export const SALARY_COMPARE_AFFILIATE = {
  title: "연봉 협상 준비에 도움이 되는 책",
  context: "연봉 협상·이직 준비에 실제로 도움이 됐다는 현직자 추천 도서입니다.",
  disclosure: "이 링크는 쿠팡파트너스 활동의 일환으로, 구매 시 소정의 수수료를 받을 수 있습니다.",
  products: [
    {
      title: "연봉 협상의 기술",
      desc: "실전 협상 전략부터 오퍼 레터 읽는 법까지. 이직 준비자 필독.",
      tag: "현직자 추천",
      url: "https://link.coupang.com/a/placeholder-salary-negotiation",
    },
    {
      title: "퇴직금·연봉 계산 완전 정복",
      desc: "세전·세후 계산, 4대보험 구조, 실수령액까지 한 권으로 정리.",
      tag: "기초 필독",
      url: "https://link.coupang.com/a/placeholder-salary-book",
    },
    {
      title: "취업 전략 바이블",
      desc: "대기업 공채부터 스타트업 채용까지 합격 전략 총정리.",
      tag: "취준 베스트셀러",
      url: "https://link.coupang.com/a/placeholder-job-strategy",
    },
  ],
};
