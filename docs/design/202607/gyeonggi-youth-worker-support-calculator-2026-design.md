# 경기 청년 재직자 지원금 계산기 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/gyeonggi-youth-worker-support-calculator-2026-plan.md`](../../plan/202607/gyeonggi-youth-worker-support-calculator-2026-plan.md)
> 작성일: 2026-07-06
> 유형: 계산기 (`/tools/`)
> 참고 구현: `src/pages/tools/welfare-benefit-eligibility.astro` (동일 계열 — 다중 조건 자격 판정, `WBE_2026_THRESHOLDS` 공유)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/gyeonggiYouthWorkerSupport2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/gyeonggi-youth-worker-support-calculator-2026.astro` |
| 스크립트 | `public/scripts/gyeonggi-youth-worker-support-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_gyeonggi-youth-worker-support-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |
| 인바운드 CTA 수정 | `src/data/youthRentSupportCalculator.ts`, `src/data/welfareBenefitEligibility.ts`, `src/pages/reports/seoul-gyeonggi-youth-allowance-comparison-2026.astro` |

---

## 2. URL 및 메타

```
슬러그: /tools/gyeonggi-youth-worker-support-calculator-2026/
타이틀: 경기 청년 재직자 지원금 계산기 2026 | 복지포인트·지원금 바로 계산
디스크립션: 나이·재직 기업 형태·근무시간·월급여 입력하면 경기 청년 복지포인트와 중소기업 청년노동자 지원사업 예상 지원금을 동시에 계산. 중복수급 가능 여부, 신청 체크리스트 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/gyeonggiYouthWorkerSupport2026.ts`**

```ts
import { WBE_2026_THRESHOLDS } from "./welfareBenefitEligibility";

// ── 타입 ──────────────────────────────────────────

export type CompanyType = "sme" | "midsize" | "smallBiz" | "nonprofit" | "excluded";
export type EvidenceBadge = "공식" | "확인 필요" | "참고";

export interface CompanyTypeOption {
  value: CompanyType;
  label: string;
  welfarePointEligible: boolean;   // 청년 복지포인트 대상 기업 형태 여부
  workerSupportEligible: boolean;  // 중소기업 청년노동자 지원사업 대상 기업 형태 여부
}

export interface ProgramSpec {
  id: "welfarePoint" | "workerSupport";
  officialName: string;
  searchName: string;
  oneLine: string;
  amountLabel: string;
  annualAmount: number;      // 연 환산 금액 (원) — 지원사업은 2년 480만원 → 연 240만원으로 환산
  paymentCycleLabel: string;
  paymentMethod: string;
  minAge: number;
  maxAge: number;
  requiresGyeonggiResidence: true;
  minWeeklyHours: number;
  incomeLimit: number | null;   // null이면 소득기준 없음/미확인
  badge: EvidenceBadge;
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
  { value: "sme",       label: "중소기업",         welfarePointEligible: true,  workerSupportEligible: true  },
  { value: "midsize",   label: "중견기업",         welfarePointEligible: true,  workerSupportEligible: false },
  { value: "smallBiz",  label: "소상공인업체",     welfarePointEligible: true,  workerSupportEligible: false },
  { value: "nonprofit", label: "비영리법인",       welfarePointEligible: true,  workerSupportEligible: false },
  { value: "excluded",  label: "대기업·공공기관",  welfarePointEligible: false, workerSupportEligible: false },
];

// ── 1인 중위소득 150% 산출 (기존 복지급여 계산기 데이터 재사용) ──

const ONE_PERSON_MEDIAN_INCOME =
  WBE_2026_THRESHOLDS.find((t) => t.householdSize === 1)!.medianIncome;

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
    requiresGyeonggiResidence: true,
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
    annualAmount: 2_400_000, // 480만원 ÷ 2년 = 연 환산
    paymentCycleLabel: "반기별 120만 원",
    paymentMethod: "확인 필요 — 계좌 지급 여부 재확인",
    minAge: 19,
    maxAge: 39,
    requiresGyeonggiResidence: true,
    minWeeklyHours: 36,
    incomeLimit: null, // 확인 필요
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
```

---

## 4. tools.ts 등록

```ts
{
  slug: "gyeonggi-youth-worker-support-calculator-2026",
  title: "경기 청년 재직자 지원금 계산기 2026",
  description: "나이·재직 기업 형태·근무시간·월급여 입력하면 경기 청년 복지포인트와 중소기업 청년노동자 지원사업 예상 지원금을 동시에 계산합니다.",
  order: 11.75, // youth-rent-support-calculator(11.74) 바로 뒤
  eyebrow: "경기 청년 지원금",
  category: "support",
  iframeReady: true,
  badges: ["신규", "경기도", "청년", "복지포인트"],
  previewStats: [
    { label: "복지포인트", value: "연 120만원" },
    { label: "청년노동자 지원", value: "2년 480만원" }
  ]
},
```

---

## 5. 계산 로직

```js
// public/scripts/gyeonggi-youth-worker-support-calculator-2026.js

// 입력
// - age: number (19~39)
// - livesInGyeonggi: boolean
// - companyType: "sme" | "midsize" | "smallBiz" | "nonprofit" | "excluded"
// - weeklyHours: number
// - monthlyIncome: number (원)

const AGE_OK = age >= 19 && age <= 39;
const HOURS_OK = weeklyHours >= 36;
const companyOption = GYWS_COMPANY_TYPES.find(c => c.value === companyType);

// 청년 복지포인트 판정
const welfarePointEligible =
  AGE_OK && livesInGyeonggi && HOURS_OK &&
  companyOption.welfarePointEligible &&
  monthlyIncome <= GYWS_INCOME_LIMIT;

// 중소기업 청년노동자 지원사업 판정 (소득기준 미확정 — 근무조건만 판정, 결과에 '확인 필요' 배지 고정 노출)
const workerSupportEligible =
  AGE_OK && livesInGyeonggi && HOURS_OK &&
  companyOption.workerSupportEligible;

// 합산 예상 수령액 (연 환산 기준)
const totalAnnual =
  (welfarePointEligible ? 1_200_000 : 0) +
  (workerSupportEligible ? 2_400_000 : 0); // 480만원/2년 → 연 240만원 표시

// 제외 사유 우선순위: 나이 → 거주 → 기업형태 → 근무시간 → 소득(복지포인트만)
function getExclusionReason(program) {
  if (!AGE_OK) return "만 19~39세가 아닙니다";
  if (!livesInGyeonggi) return "경기도 거주 요건을 충족하지 않습니다";
  if (program === "welfarePoint" && !companyOption.welfarePointEligible) return "대상 기업 형태가 아닙니다";
  if (program === "workerSupport" && !companyOption.workerSupportEligible) return "중소기업 재직자만 대상입니다";
  if (!HOURS_OK) return "주 36시간 이상 근무 요건을 충족하지 않습니다";
  if (program === "welfarePoint" && monthlyIncome > GYWS_INCOME_LIMIT) return "월급여 385만원 소득기준을 초과합니다";
  return null;
}
```

---

## 6. 페이지 IA

```
Hero
 └─ eyebrow: 경기 청년 지원금
 └─ title: 경기 청년 재직자 지원금 계산기 2026
 └─ description: 나이·재직 기업 형태·근무시간·월급여 입력 → 복지포인트·지원사업 대상여부·합산액 확인

InfoNotice: dataNote(중소기업 청년노동자 지원사업 확인 필요 안내) + 브라우저 계산 안내

[계산기 영역 — SimpleToolShell]
 ├─ aside(입력 패널)
 │   ├─ 나이 (숫자, 19~39)
 │   ├─ 경기도 거주 여부 (토글)
 │   ├─ 재직 기업 형태 (셀렉트, 5종)
 │   ├─ 주 근무시간 (숫자, 기본 40)
 │   └─ 월급여 (숫자, 원)
 └─ 결과 카드 (4개)
     ├─ 청년 복지포인트 (대상여부 + 사유 + 연 120만원)
     ├─ 중소기업 청년노동자 지원사업 (대상여부 + 사유 + 2년 480만원, 확인 필요 배지)
     ├─ 합산 예상 수령액 (연 환산)
     └─ 다음 확인 사항

섹션 1 — 사업 비교표 (청년 복지포인트 vs 중소기업 청년노동자 지원사업, <table>)
섹션 2 — 신청 체크리스트 (5개 카드)
섹션 3 — CompareCta (청년 정책 계산기 4종 링크)
섹션 4 — FAQ (6개)
SeoContent (intro 5단락/800자+, criteria, related)
```

---

## 7. 컴포넌트 구조

### 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD (`FAQPage` 스키마 포함) |
| `SiteHeader.astro` | 전역 헤더 |
| `SimpleToolShell.astro` | 계산기 레이아웃 (hero/actions/aside 슬롯) |
| `CalculatorHero.astro` | Hero 섹션 |
| `InfoNotice.astro` | 확인 필요 안내 배너 |
| `ToolActionBar.astro` | 리셋·링크복사 버튼 |
| `CompareCta.astro` | 청년 정책 계산기 아웃바운드 CTA (`variant="welfare"`) |
| `SeoContent.astro` | SEO 텍스트 + FAQ + related |

### 페이지 전용 마크업

| 블록 클래스 | 설명 |
|---|---|
| `.gyws-page` | 페이지 루트 (`pageClass`) |
| `.gyws-input-section` | 입력 그룹 (기본정보 / 근무조건) |
| `.gyws-kpi-grid` | 결과 카드 4개 래퍼 |
| `.gyws-kpi-card` | 개별 결과 카드 |
| `.gyws-kpi-card--welfare-point` | 복지포인트 카드 (파랑) |
| `.gyws-kpi-card--worker-support` | 청년노동자 지원사업 카드 (초록, `확인 필요` 배지 고정) |
| `.gyws-kpi-card--total` | 합산 카드 (강조) |
| `.gyws-badge--confirmed` | `공식` 배지 |
| `.gyws-badge--verify` | `확인 필요` 배지 |
| `.gyws-compare-table` | 사업 비교표 |
| `.gyws-checklist-grid` | 신청 체크리스트 카드 그리드 |
| `.gyws-checklist-card` | 개별 체크리스트 카드 |
| `.gyws-message` | 제외 사유·안내 메시지 영역 |

---

## 8. SCSS 설계

**파일:** `src/styles/scss/pages/_gyeonggi-youth-worker-support-calculator-2026.scss`

### CSS 로컬 토큰

```scss
.gyws-page {
  --gyws-ink:        #14213d;
  --gyws-muted:      #5d6b82;
  --gyws-line:       rgba(20, 33, 61, 0.12);
  --gyws-soft:       #f5f7fb;

  --gyws-primary:    #1a56db;   // 파랑 — 복지포인트 카드
  --gyws-primary-bg: #eff4ff;

  --gyws-teal:       #0f6e56;   // 초록 — 청년노동자 지원사업 카드
  --gyws-teal-bg:    #eefaf5;

  --gyws-accent:     #7c3aed;   // 보라 — 합산 카드
  --gyws-accent-bg:  #f3ecff;

  --gyws-amber:      #d97706;   // 확인 필요 배지
  --gyws-amber-bg:   #fef3c7;
}
```

### 주요 스타일 블록

```scss
// 결과 카드 4개
.gyws-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  @media (max-width: 720px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: minmax(0, 1fr); }
}
.gyws-kpi-card {
  padding: 1.1rem;
  border-radius: 14px;
  border: 1.5px solid var(--gyws-line);
  &--welfare-point   { border-top: 3px solid var(--gyws-primary); background: var(--gyws-primary-bg); }
  &--worker-support  { border-top: 3px solid var(--gyws-teal);    background: var(--gyws-teal-bg); }
  &--total           { border-top: 3px solid var(--gyws-accent);  background: var(--gyws-accent-bg); }
  .gyws-kpi-card__label { font-size: 0.8125rem; color: var(--gyws-muted); }
  .gyws-kpi-card__value { font-size: 1.375rem; font-weight: 700; margin-top: 0.25rem; }
  .gyws-kpi-card__reason { font-size: 0.75rem; color: var(--gyws-muted); margin-top: 0.25rem; }
}

// 배지
.gyws-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
  &--confirmed { background: var(--gyws-primary-bg); color: var(--gyws-primary); }
  &--verify    { background: var(--gyws-amber-bg);   color: var(--gyws-amber); }
}

// 비교표
.gyws-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--gyws-line);
    text-align: left;
  }
  th { background: var(--gyws-soft); font-weight: 600; }
}

// 체크리스트
.gyws-checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.gyws-checklist-card {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--gyws-line);
  span { color: var(--gyws-teal); font-weight: 700; }
}
```

---

## 9. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import CompareCta from "../../components/CompareCta.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  GYWS_META,
  GYWS_PROGRAMS,
  GYWS_COMPANY_TYPES,
  GYWS_INCOME_LIMIT,
  GYWS_FAQ,
  GYWS_CHECKLIST,
  GYWS_RELATED_LINKS,
  GYWS_SEO_CONTENT,
} from "../../data/gyeonggiYouthWorkerSupport2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const config = {
  programs: GYWS_PROGRAMS,
  companyTypes: GYWS_COMPANY_TYPES,
  incomeLimit: GYWS_INCOME_LIMIT,
};

const faqSchema = GYWS_FAQ.map((item) => ({
  "@type": "Question",
  name: item.q,
  acceptedAnswer: { "@type": "Answer", text: item.a },
}));
---

<BaseLayout
  title={GYWS_META.seoTitle}
  description={GYWS_META.seoDescription}
  ogImage="/og/og-home.png"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: GYWS_META.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    description: GYWS_META.seoDescription,
    url: `${(import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "")}/tools/${GYWS_META.slug}/`,
    mainEntity: { "@type": "FAQPage", mainEntity: faqSchema },
  }}
>
  <SiteHeader />

  <SimpleToolShell calculatorId={GYWS_META.slug} pageClass="gyws-page" resultFirst={false}>
    <Fragment slot="hero">
      <CalculatorHero
        eyebrow="경기 청년 지원금"
        title="경기 청년 재직자 지원금 계산기 2026"
        description="청년 복지포인트와 중소기업 청년노동자 지원사업, 두 사업을 조건 하나로 동시에 확인합니다."
        badges={["청년 복지포인트", "청년노동자 지원사업", "2026", "자가 점검"]}
      />
      <InfoNotice
        title="계산 전 확인"
        lines={[
          GYWS_META.dataNote,
          "입력한 정보는 브라우저에서만 계산되며 서버로 전송하지 않습니다.",
        ]}
      />
    </Fragment>

    <Fragment slot="actions">
      <ToolActionBar resetId="gywsResetBtn" copyId="gywsCopyBtn" />
    </Fragment>

    <Fragment slot="aside">
      <article class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-heading__eyebrow">입력</p>
            <h2 class="panel__title">나이·거주·근무 조건</h2>
          </div>
        </div>

        <section class="gyws-input-section">
          <div class="form-grid">
            <label class="field">
              <span>만 나이</span>
              <input data-gyws="age" type="number" min="15" max="45" class="input-number" value="27" />
            </label>
            <label class="checkbox-option">
              <input type="checkbox" data-gyws="livesInGyeonggi" checked />
              <span>경기도에 거주하고 있습니다</span>
            </label>
            <label class="field">
              <span>재직 중인 기업 형태</span>
              <select data-gyws="companyType">
                {GYWS_COMPANY_TYPES.map((c) => <option value={c.value}>{c.label}</option>)}
              </select>
            </label>
            <label class="field">
              <span>주 근무시간</span>
              <input data-gyws="weeklyHours" type="number" min="1" max="60" class="input-number" value="40" />
              <small>시간</small>
            </label>
            <label class="field">
              <span>월급여 (세전)</span>
              <input data-gyws="monthlyIncome" type="text" inputmode="numeric" class="input-number" value="3,000,000" />
              <small>청년 복지포인트 소득기준(385만원) 판정에 사용합니다.</small>
            </label>
          </div>
        </section>
      </article>
    </Fragment>

    <section class="gyws-section">
      <div class="section-header--compact">
        <p class="section-header__eyebrow">계산 결과</p>
        <h2>사업별 대상 여부와 예상 지원금</h2>
      </div>

      <div class="gyws-kpi-grid" aria-live="polite">
        <article class="gyws-kpi-card gyws-kpi-card--welfare-point">
          <p class="gyws-kpi-card__label">청년 복지포인트 <span class="gyws-badge gyws-badge--confirmed">공식</span></p>
          <strong class="gyws-kpi-card__value" id="gywsWelfarePointResult">-</strong>
          <p class="gyws-kpi-card__reason" id="gywsWelfarePointReason"></p>
        </article>
        <article class="gyws-kpi-card gyws-kpi-card--worker-support">
          <p class="gyws-kpi-card__label">중소기업 청년노동자 지원사업 <span class="gyws-badge gyws-badge--verify">확인 필요</span></p>
          <strong class="gyws-kpi-card__value" id="gywsWorkerSupportResult">-</strong>
          <p class="gyws-kpi-card__reason" id="gywsWorkerSupportReason"></p>
        </article>
        <article class="gyws-kpi-card gyws-kpi-card--total">
          <p class="gyws-kpi-card__label">합산 예상 수령액 (연 환산)</p>
          <strong class="gyws-kpi-card__value" id="gywsTotalResult">-</strong>
        </article>
      </div>
    </section>

    <section class="gyws-section">
      <div class="section-header--compact">
        <p class="section-header__eyebrow">사업 비교</p>
        <h2>청년 복지포인트 vs 중소기업 청년노동자 지원사업</h2>
      </div>
      <table class="gyws-compare-table">
        <thead>
          <tr><th>항목</th><th>청년 복지포인트</th><th>중소기업 청년노동자 지원사업</th></tr>
        </thead>
        <tbody>
          <tr><td>지원 금액</td><td>연 최대 120만원</td><td>2년간 최대 480만원</td></tr>
          <tr><td>지급 주기</td><td>반기별 60만원</td><td>반기별 120만원</td></tr>
          <tr><td>대상 기업</td><td>중소·중견·소상공인·비영리</td><td>중소기업</td></tr>
          <tr><td>소득 기준</td><td>월급여 385만원 이하</td><td>확인 필요</td></tr>
        </tbody>
      </table>
    </section>

    <section class="gyws-section">
      <div class="section-header--compact">
        <p class="section-header__eyebrow">신청 준비</p>
        <h2>신청 전 체크리스트</h2>
      </div>
      <div class="gyws-checklist-grid">
        {GYWS_CHECKLIST.map((item) => (
          <article class="gyws-checklist-card">
            <span aria-hidden="true">✓</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>

    <CompareCta
      variant="welfare"
      eyebrow="청년 정책 계산기"
      title="다른 청년 지원 제도도 같이 확인하세요"
      description="월세·적금·기초생활수급까지, 경기·전국 청년 정책을 한 곳에서 비교합니다."
      links={[
        { href: "/tools/youth-rent-support-calculator/", label: "청년월세지원 계산기 2026" },
        { href: "/tools/youth-savings-maturity-calculator/", label: "청년 적금 만기 수령액 계산기" },
        { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교" },
        { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
      ]}
    />

    <Fragment slot="seo">
      <SeoContent
        introTitle={GYWS_SEO_CONTENT.introTitle}
        intro={GYWS_SEO_CONTENT.intro}
        inputPoints={GYWS_SEO_CONTENT.inputPoints}
        criteria={GYWS_SEO_CONTENT.criteria}
        faq={GYWS_FAQ.map((f) => ({ question: f.q, answer: f.a }))}
        related={GYWS_RELATED_LINKS}
      />
    </Fragment>
  </SimpleToolShell>

  <script id="gyws-data" type="application/json" set:html={JSON.stringify(config)} />
  <script type="module" src={withBase("/scripts/gyeonggi-youth-worker-support-calculator-2026.js")}></script>
</BaseLayout>
```

---

## 10. JS 로직 (`public/scripts/gyeonggi-youth-worker-support-calculator-2026.js`)

```js
(() => {
  const root = document.querySelector(".gyws-page");
  const configEl = document.getElementById("gyws-data");
  if (!root || !configEl) return;

  const { programs, companyTypes, incomeLimit } = JSON.parse(configEl.textContent || "{}");

  const $ = (sel) => root.querySelector(sel);

  let state = {
    age: 27,
    livesInGyeonggi: true,
    companyType: "sme",
    weeklyHours: 40,
    monthlyIncome: 3_000_000,
  };

  const won = (n) => `${Math.round(n).toLocaleString("ko-KR")}원`;

  function getCompany(type) {
    return companyTypes.find((c) => c.value === type) || companyTypes[0];
  }

  function evaluate() {
    const ageOk = state.age >= 19 && state.age <= 39;
    const hoursOk = state.weeklyHours >= 36;
    const company = getCompany(state.companyType);

    const welfarePointEligible =
      ageOk && state.livesInGyeonggi && hoursOk &&
      company.welfarePointEligible &&
      state.monthlyIncome <= incomeLimit;

    const workerSupportEligible =
      ageOk && state.livesInGyeonggi && hoursOk &&
      company.workerSupportEligible;

    return { ageOk, hoursOk, company, welfarePointEligible, workerSupportEligible };
  }

  function reasonFor(programId, evalResult) {
    const { ageOk, hoursOk, company } = evalResult;
    if (!ageOk) return "만 19~39세가 아닙니다";
    if (!state.livesInGyeonggi) return "경기도 거주 요건을 충족하지 않습니다";
    if (programId === "welfarePoint" && !company.welfarePointEligible) return "대상 기업 형태가 아닙니다";
    if (programId === "workerSupport" && !company.workerSupportEligible) return "중소기업 재직자만 대상입니다";
    if (!hoursOk) return "주 36시간 이상 근무 요건을 충족하지 않습니다";
    if (programId === "welfarePoint" && state.monthlyIncome > incomeLimit) return "월급여 385만원 소득기준을 초과합니다";
    return "대상 조건을 충족합니다";
  }

  function render() {
    const evalResult = evaluate();
    const { welfarePointEligible, workerSupportEligible } = evalResult;

    $("#gywsWelfarePointResult").textContent = welfarePointEligible ? "대상 · 연 120만원" : "대상 아님";
    $("#gywsWelfarePointReason").textContent = reasonFor("welfarePoint", evalResult);

    $("#gywsWorkerSupportResult").textContent = workerSupportEligible ? "대상 · 2년 480만원" : "대상 아님";
    $("#gywsWorkerSupportReason").textContent = reasonFor("workerSupport", evalResult);

    const totalAnnual = (welfarePointEligible ? 1_200_000 : 0) + (workerSupportEligible ? 2_400_000 : 0);
    $("#gywsTotalResult").textContent = totalAnnual > 0 ? won(totalAnnual) + " (연 환산)" : "해당 없음";

    syncURL();
  }

  function bindInputs() {
    root.querySelectorAll("[data-gyws]").forEach((el) => {
      const key = el.dataset.gyws;
      if (el.type === "checkbox") {
        el.addEventListener("change", () => { state[key] = el.checked; render(); });
      } else {
        el.addEventListener("input", () => {
          const raw = el.value.replace(/,/g, "");
          state[key] = el.type === "number" || el.inputMode === "numeric" ? Number(raw) || 0 : raw;
          render();
        });
      }
    });
  }

  function syncURL() {
    const p = new URLSearchParams({
      age: state.age,
      gyeonggi: state.livesInGyeonggi ? "1" : "0",
      company: state.companyType,
      hours: state.weeklyHours,
      income: state.monthlyIncome,
    });
    history.replaceState(null, "", `?${p.toString()}`);
  }

  function restoreFromURL() {
    const p = new URLSearchParams(location.search);
    if (p.has("age")) state.age = Number(p.get("age"));
    if (p.has("gyeonggi")) state.livesInGyeonggi = p.get("gyeonggi") === "1";
    if (p.has("company")) state.companyType = p.get("company");
    if (p.has("hours")) state.weeklyHours = Number(p.get("hours"));
    if (p.has("income")) state.monthlyIncome = Number(p.get("income"));
  }

  document.getElementById("gywsResetBtn")?.addEventListener("click", () => {
    state = { age: 27, livesInGyeonggi: true, companyType: "sme", weeklyHours: 40, monthlyIncome: 3_000_000 };
    render();
  });

  document.getElementById("gywsCopyBtn")?.addEventListener("click", () => {
    syncURL();
    navigator.clipboard?.writeText(location.href).catch(() => {});
  });

  restoreFromURL();
  bindInputs();
  render();
})();
```

---

## 11. app.scss import

```scss
@use 'scss/pages/gyeonggi-youth-worker-support-calculator-2026';
```

---

## 12. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/gyeonggi-youth-worker-support-calculator-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. 인바운드 CTA 반영 (기존 파일 수정)

| 파일 | 수정 내용 |
|---|---|
| `src/data/youthRentSupportCalculator.ts` | 관련 링크 배열에 `{ href: "/tools/gyeonggi-youth-worker-support-calculator-2026/", label: "경기 청년 재직자 지원금 계산기" }` 추가 |
| `src/data/welfareBenefitEligibility.ts` | `WBE_RELATED_LINKS`에 동일 링크 추가 |
| `src/pages/reports/seoul-gyeonggi-youth-allowance-comparison-2026.astro` | 관련 콘텐츠 섹션에 "재직 중이라면 → 경기 청년 재직자 지원금 계산기" CTA 카드 추가 |

---

## 14. QA 포인트

- [ ] 나이 18 이하 / 40 이상 입력 시 두 사업 모두 "대상 아님" + 정확한 사유 표시
- [ ] 경기도 거주 체크 해제 시 두 사업 모두 즉시 제외
- [ ] 대기업·공공기관 선택 시 두 사업 모두 즉시 제외
- [ ] 소상공인업체·비영리법인 선택 시 복지포인트만 대상, 지원사업은 "중소기업 재직자만 대상" 사유로 제외
- [ ] 근무시간 36시간 미만 입력 시 두 사업 모두 제외
- [ ] 월급여 385만원 초과 시 복지포인트만 제외, 지원사업은 근무조건만으로 별도 판정
- [ ] `확인 필요` 배지가 중소기업 청년노동자 지원사업 카드에 항상 노출되는지
- [ ] URL 파라미터로 상태 복원 정상 작동 (age, gyeonggi, company, hours, income)
- [ ] `CompareCta` 4개 링크, `SeoContent related` 5개 링크 정상 작동 (중복 없음)
- [ ] `SeoContent` intro 5단락/800자 이상, FAQ 6개 확인 (`docs/GOOGLE_SEO_RULES.md`)
- [ ] `FAQPage` JSON-LD 스키마 정상 출력 확인
- [ ] `npm run build` 통과, `dist/tools/gyeonggi-youth-worker-support-calculator-2026/` 라우트 생성 확인
- [ ] 메타 타이틀 50자 이내, 디스크립션 80~120자 재확인
- [ ] 배포 전 경기도일자리재단(잡아바) 공식 공고로 소득기준·신청 방식 최종 재확인
