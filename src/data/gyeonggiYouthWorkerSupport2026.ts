import { WBE_2026_THRESHOLDS } from "./welfareBenefitEligibility";

// ── 타입 ──────────────────────────────────────────

export type CompanyType = "sme" | "midsize" | "smallBiz" | "nonprofit" | "excluded";

export interface CompanyTypeOption {
  value: CompanyType;
  label: string;
  welfarePointEligible: boolean; // 청년 복지포인트 대상 기업 형태 여부
  workerSupportEligible: boolean; // 중소기업 청년노동자 지원사업 대상 기업 형태 여부
}

export interface ProgramSpec {
  id: "welfarePoint" | "workerSupport";
  officialName: string;
  searchName: string;
  oneLine: string;
  amountLabel: string;
  annualAmount: number; // 연 환산 금액 (원) — 지원사업은 2년 480만원 → 연 240만원으로 환산
  paymentCycleLabel: string;
  paymentMethod: string;
  minAge: number;
  maxAge: number;
  minWeeklyHours: number;
  incomeLimit: number | null; // null이면 소득기준 미확인
  badge: "공식" | "확인 필요";
  sourceLabel: string;
}

export interface GywsFaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

// ── 메타 ──────────────────────────────────────────

export const GYWS_META = {
  slug: "gyeonggi-youth-worker-support-calculator-2026",
  title: "경기 청년 재직자 지원금 계산기 2026",
  seoTitle: "경기 청년 재직자 지원금 계산기 2026 | 복지포인트·지원금 바로 계산",
  seoDescription:
    "나이·재직 기업 형태·근무시간·월급여 입력하면 경기 청년 복지포인트와 중소기업 청년노동자 지원사업 예상 지원금을 동시에 계산. 중복수급 가능 여부, 신청 체크리스트 포함.",
  dataNote:
    "청년 복지포인트는 2026년 경기도 공식 공고 기준입니다. 중소기업 청년노동자 지원사업은 소득기준·모집 시기가 공고별로 달라질 수 있어 '확인 필요'로 표시하며, 신청 전 경기도일자리재단(잡아바) 공식 공고를 반드시 재확인해야 합니다.",
  updatedAt: "2026-07-06",
};

// ── 기업 형태 옵션 ─────────────────────────────────

export const GYWS_COMPANY_TYPES: CompanyTypeOption[] = [
  { value: "sme", label: "중소기업", welfarePointEligible: true, workerSupportEligible: true },
  { value: "midsize", label: "중견기업", welfarePointEligible: true, workerSupportEligible: false },
  { value: "smallBiz", label: "소상공인업체", welfarePointEligible: true, workerSupportEligible: false },
  { value: "nonprofit", label: "비영리법인", welfarePointEligible: true, workerSupportEligible: false },
  { value: "excluded", label: "대기업·공공기관", welfarePointEligible: false, workerSupportEligible: false },
];

// ── 1인 중위소득 150% 산출 (기존 복지급여 계산기 데이터 재사용) ──

const ONE_PERSON_MEDIAN_INCOME = WBE_2026_THRESHOLDS.find((t) => t.householdSize === 1)!.medianIncome;

export const GYWS_INCOME_LIMIT = Math.round(ONE_PERSON_MEDIAN_INCOME * 1.5); // 3,846,357원 ≈ 385만원

// ── 사업 스펙 ───────────────────────────────────────

export const GYWS_PROGRAMS: ProgramSpec[] = [
  {
    id: "welfarePoint",
    officialName: "청년 복지포인트",
    searchName: "경기 청년 복지포인트",
    oneLine: "경기청년몰에서 사용하는 포인트로 연 최대 120만 원을 반기별 지급",
    amountLabel: "연 최대 120만 원 (반기 60만 원)",
    annualAmount: 1_200_000,
    paymentCycleLabel: "반기별 60만 원",
    paymentMethod: "경기청년몰 포인트",
    minAge: 19,
    maxAge: 39,
    minWeeklyHours: 36,
    incomeLimit: GYWS_INCOME_LIMIT,
    badge: "공식",
    sourceLabel: "경기도청·경기도일자리재단 공식 공고 기준",
  },
  {
    id: "workerSupport",
    officialName: "중소기업 청년노동자 지원사업",
    searchName: "경기도 청년노동자 지원사업",
    oneLine: "경기도 중소기업 재직 청년에게 2년간 최대 480만 원을 반기별 지급",
    amountLabel: "2년간 최대 480만 원 (반기 120만 원)",
    annualAmount: 2_400_000,
    paymentCycleLabel: "반기별 120만 원",
    paymentMethod: "확인 필요 — 계좌 지급 여부 재확인",
    minAge: 19,
    maxAge: 39,
    minWeeklyHours: 36,
    incomeLimit: null,
    badge: "확인 필요",
    sourceLabel: "경기도일자리재단(잡아바) 공고 — 소득기준 최신 확인 필요",
  },
];

// ── FAQ ──────────────────────────────────────────

export const GYWS_FAQ: GywsFaqItem[] = [
  {
    q: "청년 복지포인트와 중소기업 청년노동자 지원사업을 동시에 받을 수 있나요?",
    a: "두 사업은 별도 예산으로 운영돼 조건을 모두 충족하면 병행 신청이 가능한 경우가 많습니다. 다만 연도별 공고에 따라 중복수급 제한이 추가될 수 있으므로 신청 전 각 공고문의 중복수급 조항을 반드시 확인하세요.",
  },
  {
    q: "월급여 385만 원 기준은 세전인가요 세후인가요?",
    a: "청년 복지포인트의 소득기준은 세전(월급여) 기준이며, 1인 가구 기준 중위소득 150%에 해당하는 금액입니다. 상여금·수당 포함 여부는 공고문 산정 기준을 따로 확인해야 합니다.",
  },
  {
    q: "주 36시간 미만 근무자는 정말 대상이 안 되나요?",
    a: "네. 두 사업 모두 '주 36시간 이상 근무'를 기본 요건으로 명시하고 있어, 단시간 근로자나 주 36시간 미만 계약직은 원칙적으로 대상에서 제외됩니다.",
  },
  {
    q: "소상공인업체 재직자도 복지포인트를 받을 수 있나요?",
    a: "네, 청년 복지포인트는 중소·중견기업뿐 아니라 소상공인업체, 비영리법인(공공기관 제외) 재직자도 대상에 포함됩니다. 다만 중소기업 청년노동자 지원사업은 중소기업 재직자로 대상이 더 좁습니다.",
  },
  {
    q: "경기청년몰 포인트는 어디서 어떻게 사용하나요?",
    a: "경기청년몰 전용 온라인몰에서 생활용품, 식품, 문화상품 등을 포인트로 결제하는 방식입니다. 현금 인출은 불가능하며 사용 기한이 있으므로 지급 후 기한 내 사용해야 합니다.",
  },
  {
    q: "중소기업 청년노동자 지원사업은 지금도 신청할 수 있나요?",
    a: "이 사업은 예산 상황에 따라 모집 시기와 규모가 매년 달라질 수 있습니다. 이 계산기는 제도의 기본 구조를 기준으로 한 자가 점검용 추정이며, 실제 신청 가능 여부는 경기도일자리재단(잡아바) 공식 공고에서 최종 확인해야 합니다.",
  },
];

// ── 신청 체크리스트 ─────────────────────────────────

export const GYWS_CHECKLIST = [
  "재직증명서 및 4대보험 가입확인서",
  "주민등록등본 (경기도 거주기간 확인)",
  "근로계약서 (주 36시간 이상 근무 확인)",
  "최근 3개월 급여명세서 또는 원천징수영수증",
  "경기도일자리재단(잡아바) 회원가입 및 사업 공고 확인",
];

// ── 내부 링크 ────────────────────────────────────

export const GYWS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/youth-rent-support-calculator/", label: "청년월세지원 계산기 2026" },
  { href: "/tools/youth-savings-maturity-calculator/", label: "청년 적금 만기 수령액 계산기" },
  { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교 2026" },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
];

// ── SEO 텍스트 (800자 이상, 5단락 이상 — docs/GOOGLE_SEO_RULES.md 기준) ──

export const GYWS_SEO_CONTENT = {
  introTitle: "경기 청년 재직자 지원금, 두 사업을 한 번에 확인하세요",
  intro: [
    "경기도는 도내 중소기업 등에 재직 중인 청년을 위해 청년 복지포인트와 중소기업 청년노동자 지원사업 두 가지를 운영합니다. 청년 복지포인트는 연 최대 120만 원을 반기별 60만 원씩 경기청년몰 포인트로 지급하고, 중소기업 청년노동자 지원사업은 2년간 최대 480만 원을 반기별 120만 원씩 지급합니다. 두 사업은 나이·거주·근무시간 조건이 거의 같지만 대상 기업 범위와 소득 기준이 달라 혼동하기 쉽습니다.",
    "청년 복지포인트는 경기도 거주 만 19~39세 청년 중 도내 중소·중견기업, 소상공인업체, 비영리법인(공공기관 제외)에서 주 36시간 이상 근무하는 사람이 대상입니다. 여기에 월급여 385만 원(1인 가구 기준 중위소득 150%) 이하라는 소득 기준이 추가로 붙습니다. 반면 중소기업 청년노동자 지원사업은 대상 기업이 중소기업으로 더 좁혀지는 대신, 지원 금액과 기간이 더 큽니다.",
    "이 계산기는 나이, 경기도 거주 여부, 재직 중인 기업 형태, 주 근무시간, 월급여를 입력하면 두 사업 각각의 대상 여부와 예상 지원금을 동시에 계산합니다. 대기업이나 공공기관 재직자는 두 사업 모두 대상에서 제외되며, 주 36시간 미만 근무자도 마찬가지입니다. 소상공인업체나 비영리법인 재직자는 청년 복지포인트만 해당될 수 있습니다.",
    "두 사업을 조건상 모두 충족한다면 합산 예상 수령액을 확인할 수 있습니다. 다만 중복수급 가능 여부는 연도별 공고에 따라 달라질 수 있어, 실제 신청 전 각 사업 공고문의 중복수급 조항을 다시 확인하는 것이 안전합니다.",
    "특히 중소기업 청년노동자 지원사업은 예산 상황에 따라 모집 시기와 규모가 매년 달라질 수 있는 사업입니다. 이 계산기의 결과는 제도의 기본 구조를 기준으로 한 자가 점검용 추정이며, 최종 신청 가능 여부와 정확한 소득 기준은 경기도일자리재단(잡아바) 공식 공고에서 확인해야 합니다.",
  ],
  inputPoints: [
    "나이와 경기도 거주 여부를 입력하면 두 사업의 기본 자격 요건을 먼저 확인합니다.",
    "재직 중인 기업 형태(중소·중견·소상공인·비영리·대기업/공공기관)를 선택하면 사업별 대상 여부가 갈립니다.",
    "주 근무시간과 월급여를 입력하면 근무시간 요건과 청년 복지포인트 소득기준 통과 여부를 함께 계산합니다.",
  ],
  criteria: [
    "청년 복지포인트: 연 최대 120만 원, 만 19~39세, 경기도 거주, 도내 중소·중견기업·소상공인·비영리법인 주 36시간 이상 재직, 월급여 385만원 이하 (공식 공고 기준)",
    "중소기업 청년노동자 지원사업: 2년간 최대 480만 원, 만 19~39세, 경기도 거주, 도내 중소기업 주 36시간 이상 재직 (소득기준·최신 모집 여부는 확인 필요)",
    "이 계산기는 자가 점검용 추정이며 실제 신청 가능 여부는 경기도일자리재단(잡아바) 공식 공고로 최종 확인해야 합니다.",
  ],
};
