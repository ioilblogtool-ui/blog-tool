# 대통령 분당 아파트 근저당 매도 리포트 — 설계 문서

> 기획 원본: [`docs/plan/202607/president-bundang-apartment-mortgage-sale-2026-plan.md`](../../plan/202607/president-bundang-apartment-mortgage-sale-2026-plan.md) (v1)
> 작성일: 2026-07-31
> 유형: 정보성/해설형 리포트 (`/reports/`), 정적 페이지(JS 계산 없음, 예시표는 빌드타임 고정값)
> 참고 템플릿: [`sk-hynix-liquidation-upper-limit-2026-design.md`](./sk-hynix-liquidation-upper-limit-2026-design.md) — `op-page` 공유 클래스 + 페이지 전용 프리픽스 패턴 재사용

---

## 0. 최우선 원칙 (기획 문서 §2-1, §8 그대로 승계)

1. **"채권최고액 = 실제 원금"으로 단정하는 문장을 절대 만들지 않는다.** 관련 표(§3 `CLAIM_AMOUNT_REVERSE_EXAMPLES`)에는 "가상 예시" 캡션을 코드 레벨에서 표 바로 아래 고정 렌더링한다.
2. **여야 입장은 반드시 주체를 명시해서만 인용한다.** "정부/여당은 ~라고 설명했다", "야당은 ~라고 비판했다"처럼 서술하고, 비교계산소 자체 문장에서는 `꼼수`/`불법`/`특혜` 등 단정적 표현을 쓰지 않는다.
3. **"무이자" 서술은 출처 단서(일부 보도에 따르면)를 반드시 붙인다.**

이 3가지는 QA 체크리스트(§12) 최상단에 다시 배치한다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/presidentBundangApartmentMortgageSale2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 페이지 | `src/pages/reports/president-bundang-apartment-mortgage-sale-2026.astro` |
| 스크립트 | (없음 — 정적 리포트) |
| 스타일 | `src/styles/scss/pages/_president-bundang-apartment-mortgage-sale-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `pbam-` (President Bundang Apartment Mortgage). `sk-hynix-liquidation-upper-limit-2026`과 동일하게 `<main>`에 `op-page`(공유 섹션/카드/메시지 베이스) + `pbam-page`(페이지 전용 변수·컴포넌트) 이중 클래스를 부여한다.

---

## 2. URL 및 메타

```
슬러그: /reports/president-bundang-apartment-mortgage-sale-2026/
타이틀(seoTitle): 대통령 분당 아파트 근저당 2026 완전 정리 | 나도 가능할까
디스크립션: 대통령 분당 아파트 29억 매도 과정에서 설정된 17.7억 근저당권을 쉽게 설명합니다. 셀러 파이낸싱 구조, 채권최고액의 진짜 의미, 일반인도 가능한지 팩트체크 포함.
```

`reports.ts` 마지막 `order` 값이 84이므로 이번 리포트는 **`order: 85`**로 등록한다.

---

## 3. 데이터 파일 설계

**`src/data/presidentBundangApartmentMortgageSale2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type FlowStep = { order: number; text: string };
export type ComparisonRow = { label: string; mortgage: string; rootMortgage: string };
export type ReverseExampleRow = { ratio: number; estimatedPrincipal: number };
export type LoanLimitRow = { priceRange: string; maxLoan: string };
export type FeasibilityRow = { item: string; verdict: string; note: string };
export type ChecklistGroup = { title: string; items: string[] };
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

// ── 메타 ──────────────────────────────────────────

export const PBAM_META = {
  slug: "president-bundang-apartment-mortgage-sale-2026",
  title: "대통령 분당 아파트 17.7억 근저당, 집주인이 은행이 됐다?",
  seoTitle: "대통령 분당 아파트 근저당 2026 완전 정리 | 나도 가능할까",
  seoDescription:
    "대통령 분당 아파트 29억 매도 과정에서 설정된 17.7억 근저당권을 쉽게 설명합니다. 셀러 파이낸싱 구조, 채권최고액의 진짜 의미, 일반인도 가능한지 팩트체크 포함.",
  description: "29억 매도 과정에서 등장한 낯선 거래방식, 셀러 파이낸싱을 쉽게 설명합니다.",
  updatedAt: "2026-07-31",
  dataNote:
    "이 페이지는 보도된 사실 기준 설명이며 법률 자문이 아닙니다. 채권최고액은 담보 한도이며 실제 대여 원금과 다를 수 있습니다. 예시 계산은 실제 거래조건이 아닌 이해를 돕기 위한 가상 예시입니다.",
};

// ── 핵심 수치 (Hero KPI, 3줄 요약) ──────────────────

export const PBAM_KEY_FACTS = {
  salePrice: 2_900_000_000,
  maxClaimAmount: 1_777_000_000, // 채권최고액(등기부 기준) — 실제 원금과 동일하지 않음, §0 원칙
  contractDate: "2026-07-14",
  registryDate: "2026-07-16",
  settlementExpected: "2026년 10월",
};

export const PBAM_SUMMARY_LINES = [
  "성남 분당구 아파트가 29억원에 매도됐고, 계약 이틀 만에 소유권이 이전됐습니다.",
  "동시에 매수인을 채무자로, 매도인 부부를 근저당권자로 하는 채권최고액 17억 7,700만원의 근저당권이 설정됐습니다.",
  "통상 근저당권자는 은행인데, 이번엔 매도인이 직접 근저당권자가 된 '매도인 근저당(셀러 파이낸싱)' 구조입니다.",
];

// ── 거래 구조 플로우 (섹션 3) ────────────────────────

export const PBAM_FLOW_NORMAL: string[] = [
  "매수인이 잔금 전액 지급",
  "매도인이 소유권 이전",
];

export const PBAM_FLOW_THIS_CASE: FlowStep[] = [
  { order: 1, text: "매수인이 매매대금 일부(계약금·중도금) 지급" },
  { order: 2, text: "매도인이 아파트 소유권을 먼저 이전" },
  { order: 3, text: "아직 받지 못한 잔금을 채권으로 남김" },
  { order: 4, text: "매도인이 해당 아파트에 근저당권 설정" },
  { order: 5, text: "매수인이 나중에 잔금 지급(2026년 10월 예정)" },
  { order: 6, text: "매도인이 근저당권 말소" },
];

// ── 저당권 vs 근저당권 (섹션 5) ──────────────────────

export const PBAM_MORTGAGE_COMPARISON: ComparisonRow[] = [
  { label: "담보 채무", mortgage: "특정된 채무", rootMortgage: "일정 범위에서 변동 가능한 채무" },
  { label: "등기 금액", mortgage: "보통 확정 채무액", rootMortgage: "채권최고액(담보 한도)" },
  { label: "주로 쓰이는 곳", mortgage: "특정 단일 채무", rootMortgage: "은행 대출·지속적 거래, 이번 거래도 근저당권" },
];

// 실제 원금이 아닌 "이해를 돕기 위한 가상 예시" — 페이지에 캡션 필수(§0-1)
export const PBAM_REVERSE_EXAMPLES: ReverseExampleRow[] = [
  { ratio: 110, estimatedPrincipal: 1_609_000_000 },
  { ratio: 118, estimatedPrincipal: 1_500_000_000 },
  { ratio: 120, estimatedPrincipal: 1_475_000_000 },
  { ratio: 130, estimatedPrincipal: 1_362_000_000 },
];

// ── 대출 규제 구간 (섹션 7 배경) ─────────────────────

export const PBAM_LOAN_LIMIT_TABLE: LoanLimitRow[] = [
  { priceRange: "15억원 초과 ~ 25억원 이하", maxLoan: "4억원" },
  { priceRange: "25억원 초과", maxLoan: "2억원" },
];

// ── 일반인 가능 여부 평가 (섹션 6 ★ 핵심) ────────────

export const PBAM_FEASIBILITY_TABLE: FeasibilityRow[] = [
  { item: "개인이 근저당권자가 될 수 있나", verdict: "가능", note: "근저당권자가 반드시 은행일 필요는 없음" },
  { item: "개인 간 잔금 유예가 가능한가", verdict: "가능", note: "계약 당사자 간 합의로 가능" },
  { item: "금융회사 허가가 필요한가", verdict: "1회성 거래는 통상 불필요", note: "반복·영업적으로 돈을 빌려주면 대부업 문제가 발생할 수 있음" },
  { item: "은행 주담대 규제를 직접 적용받나", verdict: "직접 적용 대상 아님", note: "사인 간 채권은 은행 주담대와 구조가 다르나, 규제 취지 우회 논란은 있음" },
  { item: "일반 매도인이 실제로 할 수 있나", verdict: "현실적으로 어려움", note: "대부분 매도인 본인도 다음 집 잔금 등으로 즉시 현금이 필요함" },
];

// ── 체크리스트 (섹션 8) ──────────────────────────────

export const PBAM_CHECKLISTS: ChecklistGroup[] = [
  {
    title: "매도인 체크리스트",
    items: [
      "매수인의 실제 상환 재원이 확인됐는가",
      "매수인이 기존 주택을 언제 매도하는가",
      "근저당권이 1순위인가",
      "실제 채권액과 채권최고액이 구분돼 있는가",
      "이자율·상환일·연체이자가 계약서에 있는가",
      "채무불이행 시 기한이익 상실 조항이 있는가",
    ],
  },
  {
    title: "매수인 체크리스트",
    items: [
      "잔금 채무가 향후 은행 대출(DSR)에 영향을 주는가",
      "이자 비용이 명확한가",
      "상환기일까지 기존 주택을 팔지 못할 가능성이 있는가",
      "연체 시 경매 위험을 감당할 수 있는가",
      "근저당 말소에 필요한 서류와 시점이 정해져 있는가",
    ],
  },
];

// ── FAQ / 관련 링크 ──────────────────────────────────

export const PBAM_FAQ: FaqItem[] = [
  { question: "근저당권자는 은행만 될 수 있나요?", answer: "아닙니다. 개인이나 법인도 채권이 있다면 근저당권자가 될 수 있습니다." },
  { question: "채권최고액 17억 7,700만원은 실제 대출금인가요?", answer: "반드시 그렇지는 않습니다. 채권최고액은 원금과 이자·지연손해금 등을 담보하기 위한 최대 한도입니다." },
  { question: "매도인이 잔금을 빌려주면 불법 사금융인가요?", answer: "일회성 부동산 거래에서 잔금 지급을 유예하고 담보를 설정하는 행위 자체가 곧바로 불법 대부업이 되지는 않습니다. 다만 이익을 목적으로 반복적으로 대출을 제공하면 대부업법상 별도 검토가 필요합니다." },
  { question: "매수인이 잔금을 안 갚으면 집을 다시 가져오나요?", answer: "자동으로 되돌아오지 않습니다. 매도인은 근저당권을 토대로 경매 등 법적 절차를 거쳐 채권을 회수해야 합니다." },
  { question: "일반인도 이 방식을 쓸 수 있나요?", answer: "법적으로는 가능하지만, 매도인이 거액의 잔금을 장기간 유예해줄 수 있는 자금 여력을 갖춰야 하므로 현실적으로는 제한적입니다." },
];

export const PBAM_SEO_INTRO = [
  "2026년 7월 14일 성남 분당구 수내동 아파트가 29억원에 매매계약을 체결했고, 이틀 뒤인 16일 소유권이 이전됐습니다. 동시에 매수인을 채무자로, 매도인 부부를 근저당권자로 하는 채권최고액 17억 7,700만원의 근저당권이 등기됐습니다.",
  "통상 근저당권자는 대출을 내준 은행인데, 이번엔 매도인이 직접 근저당권자가 됐습니다. 이른바 '매도인 근저당(셀러 파이낸싱)' 구조로, 은행 주택담보대출 한도가 제한된 고가주택 거래에서 매도인이 사실상 잔금을 유예해준 셈입니다.",
];

export const PBAM_SEO_CRITERIA = [
  "매매가 29억원, 계약 7/14, 소유권 이전 7/16",
  "채권최고액 17억 7,700만원 — 실제 대여 원금과 반드시 같지 않음(담보 한도)",
  "25억원 초과 주택은 은행 주담대 최대 2억원까지만 가능(2025-10-16 시행 규제)",
  "법적으로는 개인도 근저당권자가 될 수 있으나, 대부분 매도인은 거액을 장기간 유예해줄 자금 여력이 없어 현실적으로는 드문 방식",
  "이 페이지는 보도된 사실 기준 설명이며 법률 자문이 아닙니다",
];

export const PBAM_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/seoul-mortgage-refinancing-2026/", label: "서울 주요 구별 대환대출 갈아타기 손익 비교" },
  { href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/", label: "이재명 정부 핵심 공직자 재산·보수 비교" },
  { href: "/reports/2026-seoul-apt-cheonyak-cutline/", label: "2026 서울 아파트 청약 당첨 가점 커트라인" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 거래구조 해설
 └─ title: 대통령 분당 아파트 17.7억 근저당, 집주인이 은행이 됐다?
 └─ description: 29억 매도 과정에서 등장한 낯선 거래방식, 셀러 파이낸싱을 쉽게 설명합니다
 └─ KPI 4개: 매매가 / 채권최고액 / 계약~등기 기간 / 잔금 예정 시점

InfoNotice (면책 배너)
 └─ PBAM_META.dataNote

섹션 1 — 3줄 요약 (PBAM_SUMMARY_LINES)
섹션 2 — 무슨 일이 있었나 (간단 타임라인 2포인트: 계약 7/14 → 등기+근저당 설정 7/16)
섹션 3 — 29억원 거래 구조 그림 설명 (일반 거래 vs 이번 거래 플로우 비교)
섹션 4 — 근저당권자가 왜 은행이 아니라 매도인일까 (셀러 파이낸싱 개념 텍스트)
섹션 5 — 채권최고액 17.7억원 = 실제 빚 17.7억원? ★ (저당권 vs 근저당권 표 + 역산 예시표, "가상 예시" 캡션 필수)
섹션 6 — 일반인도 가능한가 ★★ 핵심 (평가표 5행)
섹션 7 — 대출규제 우회 논란 (대출한도표 → 사실 → 정부설명 → 야당주장 → 전문가평가 → 비교계산소 결론 문장, §0 원칙 엄수)
섹션 8 — 실제 거래 전 체크리스트 (매도인용 / 매수인용 2단)
SeoContent (FAQ + 관련 링크)
```

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트

| 컴포넌트 | 용도 | 실제 Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero 섹션 | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title: string`, `lines: string[]` |
| `SeoContent.astro` | SEO 텍스트 + FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 공유 베이스 클래스

`<main class="... op-page pbam-page">` — `.op-section`, `.op-message`, `.op-card-grid` 베이스 재사용(`_opportunities-202605.scss`).

### 페이지 전용 마크업 (`pbam-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.pbam-page` | 페이지 루트 스코프 (로컬 CSS 변수) |
| `.pbam-kpi-grid` / `.pbam-kpi-card` | Hero KPI 4개 |
| `.pbam-summary-list` | 섹션 1 — 3줄 요약 리스트 |
| `.pbam-mini-timeline` | 섹션 2 — 계약/등기 2포인트 타임라인 |
| `.pbam-flow-compare` | 섹션 3 — 일반 거래 vs 이번 거래 플로우 2단 비교 |
| `.pbam-flow-compare__col` | 플로우 개별 컬럼(일반/이번 거래) |
| `.pbam-table-wrap` | 표 가로 스크롤 래퍼(공통) |
| `.pbam-comparison-table` | 섹션 5 — 저당권 vs 근저당권 비교표 |
| `.pbam-reverse-table` | 섹션 5 — 채권최고액 역산 예시표 |
| `.pbam-reverse-table__caption` | "가상 예시" 캡션 (표 바로 아래 고정, §0-1 필수) |
| `.pbam-feasibility-table` | 섹션 6 — 일반인 가능 여부 평가표 |
| `.pbam-feasibility-table__verdict` | 판정 배지 (가능/불가능/현실적으로 어려움 색상 구분) |
| `.pbam-loan-limit-table` | 섹션 7 — 대출 규제 구간표 |
| `.pbam-position-stack` | 섹션 7 — 사실→정부설명→야당주장→전문가평가 단계별 카드 |
| `.pbam-position-stack__item` | 개별 입장 카드 (`data-role`로 사실/정부/야당/전문가/자체분석 구분) |
| `.pbam-conclusion-box` | 섹션 7 하단 — 비교계산소 결론 문장 박스 |
| `.pbam-checklist-grid` | 섹션 8 — 매도인/매수인 체크리스트 2단 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_president-bundang-apartment-mortgage-sale-2026.scss`

```scss
.pbam-page {
  --pbam-ink: #172033;
  --pbam-muted: #667085;
  --pbam-line: #d8e0ea;
  --pbam-primary: #1a56db;
  --pbam-neutral-bg: #f5f7fb;
  --pbam-success-bg: #ecfdf3;
  --pbam-success-ink: #027a48;
  --pbam-warn-bg: #fffaeb;
  --pbam-warn-ink: #92400e;
  --pbam-danger-bg: #fef2f2;
  --pbam-danger-ink: #b42318;

  .pbam-kpi-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .pbam-kpi-card {
    display: grid;
    gap: 6px;
    padding: 16px;
    border: 1px solid var(--pbam-line);
    border-radius: 8px;
    background: #fff;

    strong { color: var(--pbam-muted); font-size: 12px; font-weight: 700; }
    p { margin: 0; color: var(--pbam-ink); font-size: 18px; font-weight: 800; }
    small { color: var(--pbam-muted); font-size: 12px; }
  }

  .pbam-summary-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 10px 14px;
      border: 1px solid var(--pbam-line);
      border-radius: 8px;
      background: var(--pbam-neutral-bg);
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .pbam-mini-timeline {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    &__item {
      flex: 1;
      min-width: 200px;
      padding: 12px 14px;
      border: 1px solid var(--pbam-line);
      border-radius: 8px;

      strong { display: block; color: var(--pbam-primary); font-size: 13px; margin-bottom: 4px; }
      p { margin: 0; font-size: 13px; color: var(--pbam-ink); line-height: 1.5; }
    }
  }

  .pbam-flow-compare {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }

    &__col {
      padding: 14px;
      border: 1px solid var(--pbam-line);
      border-radius: 8px;

      h3 { margin: 0 0 10px; font-size: 14px; color: var(--pbam-muted); }

      ol {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        font-size: 13px;
        color: var(--pbam-ink);
        line-height: 1.55;
      }
    }

    &__col--this-case {
      border-color: var(--pbam-primary);
      background: var(--pbam-neutral-bg);
    }
  }

  .pbam-table-wrap {
    overflow-x: auto;
  }

  .pbam-comparison-table,
  .pbam-reverse-table,
  .pbam-feasibility-table,
  .pbam-loan-limit-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--pbam-line);
      text-align: left;
      vertical-align: top;
    }

    th { color: var(--pbam-muted); font-size: 12px; font-weight: 700; white-space: nowrap; }
    td { color: var(--pbam-ink); }
  }

  .pbam-reverse-table__caption {
    margin: 10px 0 0;
    padding: 10px 12px;
    border: 1px dashed var(--pbam-line);
    border-radius: 8px;
    color: var(--pbam-muted);
    font-size: 12px;
    line-height: 1.6;
  }

  .pbam-feasibility-table__verdict {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;

    &[data-tone="possible"] { background: var(--pbam-success-bg); color: var(--pbam-success-ink); }
    &[data-tone="caution"] { background: var(--pbam-warn-bg); color: var(--pbam-warn-ink); }
    &[data-tone="hard"] { background: var(--pbam-danger-bg); color: var(--pbam-danger-ink); }
  }

  .pbam-position-stack {
    display: grid;
    gap: 10px;
    margin: 14px 0;

    &__item {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid var(--pbam-line);
      font-size: 13px;
      line-height: 1.6;

      strong { display: block; margin-bottom: 4px; font-size: 12px; }

      &[data-role="fact"] { background: #fff; }
      &[data-role="government"] { background: var(--pbam-neutral-bg); }
      &[data-role="opposition"] { background: var(--pbam-warn-bg); }
      &[data-role="expert"] { background: var(--pbam-success-bg); }
    }
  }

  .pbam-conclusion-box {
    padding: 16px;
    border: 1px solid var(--pbam-primary);
    border-radius: 8px;
    background: var(--pbam-neutral-bg);
    font-size: 14px;
    line-height: 1.7;
    color: var(--pbam-ink);
  }

  .pbam-checklist-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }

    &__group {
      padding: 14px;
      border: 1px solid var(--pbam-line);
      border-radius: 8px;

      h3 { margin: 0 0 10px; font-size: 14px; }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 8px;
      }

      li {
        padding: 8px 10px;
        border: 1px solid var(--pbam-line);
        border-radius: 6px;
        font-size: 13px;
        color: var(--pbam-ink);
      }
    }
  }

  @media (max-width: 900px) {
    .pbam-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 480px) {
    .pbam-kpi-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-color-scheme: dark) {
    --pbam-neutral-bg: #1c2433;
    --pbam-success-bg: #0f2e1f;
    --pbam-warn-bg: #3a2e10;
    --pbam-danger-bg: #3a1414;
  }
}
```

---

## 7. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  PBAM_META,
  PBAM_KEY_FACTS,
  PBAM_SUMMARY_LINES,
  PBAM_FLOW_NORMAL,
  PBAM_FLOW_THIS_CASE,
  PBAM_MORTGAGE_COMPARISON,
  PBAM_REVERSE_EXAMPLES,
  PBAM_LOAN_LIMIT_TABLE,
  PBAM_FEASIBILITY_TABLE,
  PBAM_CHECKLISTS,
  PBAM_FAQ,
  PBAM_SEO_INTRO,
  PBAM_SEO_CRITERIA,
  PBAM_RELATED_LINKS,
} from "../../data/presidentBundangApartmentMortgageSale2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${PBAM_META.slug}/`;

const verdictTone = (verdict: string) =>
  verdict.includes("어려움") ? "hard" : verdict.includes("불필요") || verdict.includes("아님") ? "caution" : "possible";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PBAM_META.title,
    description: PBAM_META.seoDescription,
    dateModified: PBAM_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PBAM_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: PBAM_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={PBAM_META.seoTitle} description={PBAM_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page pbam-page" data-report="president-bundang-apartment-mortgage-sale-2026">
    <CalculatorHero
      eyebrow="거래구조 해설"
      title={PBAM_META.title}
      description={PBAM_META.description}
    />

    <div class="pbam-kpi-grid">
      <article class="pbam-kpi-card"><strong>매매가</strong><p>{(PBAM_KEY_FACTS.salePrice / 100_000_000).toFixed(0)}억원</p></article>
      <article class="pbam-kpi-card"><strong>채권최고액</strong><p>{(PBAM_KEY_FACTS.maxClaimAmount / 100_000_000).toFixed(1)}억원</p><small>실제 원금과 다를 수 있음</small></article>
      <article class="pbam-kpi-card"><strong>계약~등기</strong><p>2일</p><small>{PBAM_KEY_FACTS.contractDate} → {PBAM_KEY_FACTS.registryDate}</small></article>
      <article class="pbam-kpi-card"><strong>잔금 예정</strong><p>{PBAM_KEY_FACTS.settlementExpected}</p></article>
    </div>

    <InfoNotice title="읽기 전에 확인해주세요" lines={[PBAM_META.dataNote]} />

    <!-- 섹션 1: 3줄 요약 -->
    <section class="op-section">
      <h2>3줄 요약</h2>
      <ul class="pbam-summary-list">
        {PBAM_SUMMARY_LINES.map((line) => <li>{line}</li>)}
      </ul>
    </section>

    <!-- 섹션 2: 무슨 일이 있었나 -->
    <section class="op-section">
      <h2>무슨 일이 있었나</h2>
      <div class="pbam-mini-timeline">
        <div class="pbam-mini-timeline__item"><strong>{PBAM_KEY_FACTS.contractDate}</strong><p>29억원에 매매계약 체결</p></div>
        <div class="pbam-mini-timeline__item"><strong>{PBAM_KEY_FACTS.registryDate}</strong><p>소유권 이전 등기 완료, 동시에 채권최고액 17억 7,700만원 근저당권 설정</p></div>
      </div>
    </section>

    <!-- 섹션 3: 거래 구조 그림 설명 -->
    <section class="op-section">
      <h2>29억원 거래 구조, 그림으로 보면</h2>
      <div class="pbam-flow-compare">
        <div class="pbam-flow-compare__col">
          <h3>일반적인 아파트 거래</h3>
          <ol>{PBAM_FLOW_NORMAL.map((step) => <li>{step}</li>)}</ol>
        </div>
        <div class="pbam-flow-compare__col pbam-flow-compare__col--this-case">
          <h3>이번 거래</h3>
          <ol>{PBAM_FLOW_THIS_CASE.map((step) => <li>{step.text}</li>)}</ol>
        </div>
      </div>
      <p class="op-message">집은 먼저 넘겨주되, 아직 받지 못한 돈을 보호하기 위해 매도인이 집에 담보(근저당)를 잡아 놓은 구조입니다. 은행 주택담보대출에서는 은행이 근저당권자가 되지만, 이번엔 매도인이 그 역할을 대신했습니다.</p>
    </section>

    <!-- 섹션 4: 왜 은행이 아니라 매도인인가 -->
    <section class="op-section">
      <h2>근저당권자가 왜 은행이 아니라 매도인일까</h2>
      <p class="op-message">이런 구조를 '매도인 근저당' 또는 '셀러 파이낸싱'이라고 부릅니다. 매수인이 은행 대출만으로 잔금을 마련하기 어려울 때, 매도인이 소유권을 먼저 넘기고 남은 잔금을 채권으로 남긴 뒤 그 채권을 보호하기 위해 직접 근저당권을 설정하는 방식입니다. 개인이나 법인도 채권만 있다면 근저당권자가 될 수 있어 법적으로 특별한 자격이 필요하지 않습니다.</p>
    </section>

    <!-- 섹션 5: 채권최고액의 진짜 의미 ★ -->
    <section class="op-section">
      <h2>채권최고액 17.7억원 = 실제 빚 17.7억원일까</h2>
      <div class="pbam-table-wrap">
        <table class="pbam-comparison-table">
          <thead><tr><th></th><th>저당권</th><th>근저당권</th></tr></thead>
          <tbody>
            {PBAM_MORTGAGE_COMPARISON.map((row) => (
              <tr><td>{row.label}</td><td>{row.mortgage}</td><td>{row.rootMortgage}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="op-message">근저당권은 원금·이자·지연손해금 등을 포함해 담보할 수 있는 <strong>최대 한도</strong>를 등기하는 제도입니다. 채권최고액과 실제 미지급 잔금(원금)은 반드시 같은 금액이 아닙니다.</p>

      <div class="pbam-table-wrap">
        <table class="pbam-reverse-table">
          <thead><tr><th>설정비율</th><th>역산한 추정 원금</th></tr></thead>
          <tbody>
            {PBAM_REVERSE_EXAMPLES.map((row) => (
              <tr><td>{row.ratio}%</td><td>약 {(row.estimatedPrincipal / 100_000_000).toFixed(2)}억원</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="pbam-reverse-table__caption">실제 채무액은 등기부만으로 확정할 수 없습니다. 위 표는 통상적인 설정비율을 적용한 단순 예시이며 실제 거래조건이 아닙니다.</p>
    </section>

    <!-- 섹션 6: 일반인도 가능한가 ★★ 핵심 -->
    <section class="op-section">
      <h2>일반인도 가능한가</h2>
      <p class="op-message"><strong>법률상 가능하지만, 현실적으로는 자금 여유가 있는 매도인만 가능한 거래입니다.</strong></p>
      <div class="pbam-table-wrap">
        <table class="pbam-feasibility-table">
          <thead><tr><th>판단 항목</th><th>결과</th><th>설명</th></tr></thead>
          <tbody>
            {PBAM_FEASIBILITY_TABLE.map((row) => (
              <tr>
                <td>{row.item}</td>
                <td><span class="pbam-feasibility-table__verdict" data-tone={verdictTone(row.verdict)}>{row.verdict}</span></td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="op-message"><small>대부분의 매도인은 본인도 다음 집 잔금이 필요해 거액을 장기간 유예해줄 여력이 없습니다. 이 때문에 제도적으로 막혀있지 않아도 실제 이용 사례는 드뭅니다.</small></p>
    </section>

    <!-- 섹션 7: 대출규제 우회 논란 -->
    <section class="op-section">
      <h2>대출규제 우회 논란</h2>
      <div class="pbam-table-wrap">
        <table class="pbam-loan-limit-table">
          <thead><tr><th>주택가격</th><th>주담대 최대 한도</th></tr></thead>
          <tbody>
            {PBAM_LOAN_LIMIT_TABLE.map((row) => (
              <tr><td>{row.priceRange}</td><td>{row.maxLoan}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="op-message"><small>2025년 10월 16일 시행된 수도권·규제지역 기준. 이번 거래(29억원)는 25억원 초과 구간에 해당합니다.</small></p>

      <div class="pbam-position-stack">
        <div class="pbam-position-stack__item" data-role="fact"><strong>확인된 사실</strong>등기부에 채권최고액 17억 7,700만원의 근저당이 설정됐습니다.</div>
        <div class="pbam-position-stack__item" data-role="government"><strong>정부·여당 설명</strong>매수인의 사정을 고려한 통상적 거래라고 설명했습니다.</div>
        <div class="pbam-position-stack__item" data-role="opposition"><strong>야당 주장</strong>대출규제 취지를 우회한 거래라고 비판했습니다.</div>
        <div class="pbam-position-stack__item" data-role="expert"><strong>전문가 평가</strong>법적으로 가능하지만 세무·채권회수 위험이 있다는 지적이 나왔습니다.</div>
      </div>

      <div class="pbam-conclusion-box">
        이번 거래가 불법으로 확인된 것은 아닙니다. 다만 은행 대출이 제한된 고가주택 거래에서 매도인이 직접 금융을 제공했다는 점 때문에 규제의 실효성과 형평성 논쟁이 발생했습니다. 법적으로 가능한 것과 일반 국민이 현실적으로 이용할 수 있는 것은 별개의 문제입니다.
      </div>
    </section>

    <!-- 섹션 8: 체크리스트 -->
    <section class="op-section">
      <h2>실제 거래 전 체크리스트</h2>
      <div class="pbam-checklist-grid">
        {PBAM_CHECKLISTS.map((group) => (
          <div class="pbam-checklist-grid__group">
            <h3>{group.title}</h3>
            <ul>{group.items.map((item) => <li>{item}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>

    <SeoContent
      introTitle="대통령 분당 아파트 근저당 거래 핵심 정리"
      intro={PBAM_SEO_INTRO}
      criteria={PBAM_SEO_CRITERIA}
      faq={PBAM_FAQ}
      related={PBAM_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "president-bundang-apartment-mortgage-sale-2026",
  title: "대통령 분당 아파트 근저당 2026 완전 정리 | 나도 가능할까",
  description: "대통령 분당 아파트 29억 매도 과정에서 설정된 17.7억 근저당권을 쉽게 설명합니다. 셀러 파이낸싱 구조, 채권최고액의 진짜 의미, 일반인도 가능한지 팩트체크 포함.",
  order: 85,
  badges: ["신규", "부동산", "근저당", "셀러파이낸싱"],
},
```

## 8-1. index.astro `reportMetaBySlug` 등록

```ts
"president-bundang-apartment-mortgage-sale-2026": { category: "estate", isNew: true },
```

---

## 9. app.scss import

```scss
@use 'scss/pages/president-bundang-apartment-mortgage-sale-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/president-bundang-apartment-mortgage-sale-2026/</loc>
  <lastmod>2026-07-31</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.75</priority>
</url>
```

`priority: 0.75` — SK하이닉스 리포트들보다 소폭 낮게 설정. 정치 민감 이슈라 화제성은 높지만, 실적/시장 데이터형 리포트보다 갱신 빈도가 낮을 것으로 예상.

---

## 11. 내부 관련 링크 (CTA 대신 SeoContent related로만 연결)

이 리포트는 계산기가 아니라 개념 해설이라 별도 CTA 버튼군을 두지 않고, `SeoContent`의 `related` 링크로만 연결한다(§3 `PBAM_RELATED_LINKS`).

| 링크 | 이유 |
|---|---|
| 서울 주요 구별 대환대출 갈아타기 손익 비교 | 같은 "대출·담보" 주제 |
| 이재명 정부 핵심 공직자 재산·보수 비교 | 같은 인물 다루는 재산 공개 리포트 |
| 2026 서울 아파트 청약 당첨 가점 커트라인 | 같은 부동산 카테고리 |

---

## 12. 데이터 정확성 / QA 포인트 (기획 문서 §9 승계 + 구현 관점 추가)

- [ ] **"채권최고액 = 실제 원금"으로 단정하는 문장이 본문 어디에도 없는지 전수 확인** (최우선)
- [ ] `.pbam-reverse-table__caption`("실제 거래조건이 아닌 가상 예시")이 역산표 바로 아래 항상 렌더링되는지 확인 — 조건부 렌더링으로 숨겨지지 않는지 체크
- [ ] "무이자" 표현은 이번 구현에서 아예 사용하지 않음(기획 문서 §2 보도 기준 단서 필요 원칙에 따라, 확정 못 한 사실은 페이지 본문에서 생략하는 쪽으로 안전하게 처리) — 만약 추가한다면 반드시 출처 단서 포함 확인
- [ ] `pbam-position-stack__item`의 `data-role`이 fact/government/opposition/expert 4가지로만 쓰이고, 비교계산소 자체 주장이 별도 항목으로 섞이지 않는지 확인 (자체 결론은 `.pbam-conclusion-box`로만 분리)
- [ ] `꼼수`/`불법`/`특혜`/`전대미문` 등 단정적 표현이 비교계산소 자체 서술(op-message 등)에 쓰이지 않았는지 전수 검색
- [ ] 15억원 이하 구간 대출한도 수치를 표에 넣지 않았는지 확인(확정 소스 없음, 기획 문서 §2-2)
- [ ] 대상 인물 실명 표기가 기존 사이트 관례와 일치하는지 확인
- [ ] `reportMetaBySlug`에 슬러그 등록 확인 (누락 시 "기타" 카테고리로 표시되는 사고 방지)
- [ ] 모바일에서 KPI 4카드 → 2열 → 1열, 플로우 비교 2열 → 1열, 체크리스트 2열 → 1열 전환 확인
- [ ] `npm run build` 통과, 라우트 존재 확인

---

## 13. 배포 및 갱신 일정

| 시점 | 작업 |
|---|---|
| 1차 배포 | §12 QA 전항목(특히 표현 원칙) 통과 후 배포 — 속도보다 정확성·중립성 우선 |
| 후속 갱신 | 2026년 10월 잔금 지급·근저당 말소 여부 확인되면 섹션 2 타임라인에 반영 |

---

## 14. 핵심 메시지 (1문장 요약)

> 가능하냐고 묻는다면 가능하다. 하지만 누구나 할 수 있느냐고 묻는다면 그렇지 않다 — 매도인이 사실상 은행 역할을 감당할 자금력과 위험관리 능력이 있어야 하기 때문이다.
