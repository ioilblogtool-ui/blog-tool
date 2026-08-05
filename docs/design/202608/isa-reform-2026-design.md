# 설계 문서
## 2026 ISA 개편안 리포트

> 기획 원본: `docs/plan/202608/isa-reform-2026-plan.md`
> 신규 구현 페이지: `/reports/isa-reform-2026/`
> 설계 목적: 2026-08-03 발표된 세제개편안 중 ISA 관련 내용(생산적금융 ISA 신설, 기존 ISA 이월 폐지·계약기간 5년 제한)을 "정부안 발표 단계 · 국회 통과 전"임을 명확히 하며 정리하고, 기존 `/tools/isa-tax-calculator/`로 연결하는 리포트.
> 착수 범위: 이번 착수는 이 리포트 1개만 진행한다. 신규 계산기는 만들지 않는다(기획서 §0, 기존 계산기 재사용).

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `isa-reform-2026` |
| 페이지 경로 | `src/pages/reports/isa-reform-2026.astro` |
| 데이터 파일 | `src/data/isaReform2026.ts` |
| SCSS | `src/styles/scss/pages/_isa-reform-2026.scss` |
| SCSS prefix | `.isar` |
| 데이터 export prefix | `ISA_REFORM_*` (기존 `isaCalculator.ts`의 `ISA_*`와 이름 충돌 방지) |
| 스크립트 | 없음. MVP는 정적 리포트(선택 인터랙션 없음) |
| 콘텐츠 유형 | `/reports/` 시의성 정책 리포트 (`REPORT_CONTENT_GUIDE.md` 기준) |
| 홈 카테고리 | `asset` (투자·재테크) |
| 주요 CTA | `/tools/isa-tax-calculator/`, `/tools/etf-distribution-tax-calculator/`, `/tools/dividend-target-calculator/` |
| 등록 필요 | `src/data/reports.ts`, `src/pages/index.astro`(`reportMetaBySlug`), `public/sitemap.xml`, `src/styles/app.scss` |
| 빌드 확인 | 구현 후 `npm run build` 필수 |
| 착수 전 필수 확인 | 기획서 §4의 6개 항목(동시 가입, 전환, 소급 기산점, BDC 포함 여부, 청년 요건, 이월 폐지 소급) — 원문 대조 전에는 해당 셀에 `확인 필요` 배지 유지 |
| 갱신 트리거 | 국회 제출·통과·시행 단계 진행 시 이 페이지 데이터 갱신 (§11 참고) — 새 slug 만들지 않음 |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`2026-08-03 발표된 세제개편안 중 생산적금융 ISA 신설과 기존 ISA 이월 폐지·계약기간 제한을 정부안 발표 단계로 명확히 구분해 정리하고, ISA 계산기로 연결하는 정책 추적 리포트`

### 1-2. 사용자가 얻는 것

- "2026 ISA 개편이 확정됐는지" 여부를 첫 화면에서 바로 확인 (정부안 발표 단계 — 국회 통과 전)
- 기존 ISA와 생산적금융 ISA 차이를 3열 비교표로 확인
- 이월 폐지가 실제로 얼마나 손해인지 숫자 예시로 확인
- "전액 비과세"가 정확히 무엇을 의미하는지(매매차익은 원래도 비과세) 오해 없이 이해
- 투자 성향별(해외지수 ETF 중심 / 국내 배당주 중심 등)로 어떤 계좌가 유리한지 방향 파악
- 확인 후 기존 ISA 계산기로 이동해 현재 기준 절세 효과 계산

### 1-3. 피해야 할 것 (기획서 §2-2, §3 그대로 적용)

- "확정", "~로 바뀐다" 등 이미 확정된 것처럼 보이는 단정 표현
- 결론에서 "가장 합리적인 전략" 같은 단정적 추천 문구
- 특정 개인을 지칭하는 표현(생년, 특정 증권사, 특정 보유 종목 언급) — 반드시 투자 성향 일반화로 전환
- §4에서 원문 대조가 끝나지 않은 수치(총한도 2억원, 최대 10년, BDC 포함 여부, 청년 소득공제 요건)를 확정 수치처럼 제시하는 것 — `확인 필요` 배지 없이 노출 금지
- 기재부 출처 링크에 `utm_source` 등 추적 파라미터가 남은 채 게시하는 것

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const ISA_REFORM_META = {
  slug: "isa-reform-2026",
  title: "2026 ISA 개편안 정리",
  description:
    "2026년 8월 발표된 ISA 세제개편안을 정리했습니다. 생산적금융 ISA 신설, 기존 ISA 이월 폐지·계약기간 5년 제한 내용과 투자 성향별 영향을 확인하세요.",
  seoTitle: "2026 ISA 개편안 정리 | 생산적금융 ISA·이월 폐지 총정리",
  seoDescription:
    "2026년 8월 3일 발표된 ISA 세제개편안을 정리했습니다. 생산적금융 ISA 신설과 기존 ISA 이월 폐지·계약기간 제한 내용을 확인하고 ISA 계산기로 바로 연결됩니다.",
  updatedAt: "2026-08-05",
  policyStatus: "GOVERNMENT_ANNOUNCED" as const,
  policyStatusLabel: "정부안 발표",
  nextMilestone:
    "국회 제출 및 통과 절차 예정 (구체적 일정 미확정). 시행 목표는 다수 보도에서 2027년 이후로 거론되나 확정 시행일 아님",
  dataNote:
    "이 페이지는 정부 확정 법률이 아니라 2026년 8월 3일 세제개편안 발표 내용과 재정경제부 문답자료, 언론 보도를 바탕으로 정리한 자료입니다. 일부 수치는 단일 언론 보도에만 근거해 `확인 필요` 배지로 표시했으며, 국회 심의 과정에서 내용이 달라질 수 있습니다.",
};
```

CLAUDE.md 리포트 타이틀 공식(`{주제} {연도} 완전 정리 | {핵심 궁금증}`)을 적용하되, 국회 통과 전이므로 "완전 정리" 대신 "정리"를 사용해 확정처럼 보이지 않게 한다(부동산 리포트가 "검토안 정리"를 쓴 것과 같은 원칙, 다만 이쪽은 정부안 발표 이후 단계라 "정리"까지는 사용 가능).

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="ISA 세금 리포트"
  title={ISA_REFORM_META.title}
  description="생산적금융 ISA가 새로 생기고, 기존 ISA는 이월이 폐지되고 계약기간이 제한됩니다. 아직 국회 통과 전 정부안 단계입니다."
  badges={["정부안 발표", "국회 통과 전", "생산적금융 ISA", "이월 폐지"]}
/>
```

### 2-3. H2 구조 (검색 의도 순서)

1. `2026 ISA 개편안, 아직 확정되지 않았습니다`
2. `기존 ISA는 어떻게 바뀌나 — 이월 폐지·계약기간 제한`
3. `생산적금융 ISA란 무엇인가`
4. `"전액 비과세"가 정확히 의미하는 것`
5. `기존 ISA vs 생산적금융 ISA 비교`
6. `투자 성향별로 어떤 계좌가 유리한가`
7. `내 ISA는 지금 기준으로 먼저 계산해보세요`
8. `2026 ISA 개편안 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 2026 ISA 개편 | title, H1, 첫 H2, FAQ |
| 생산적금융 ISA | Hero description, 비교표, 설명 카드 |
| ISA 이월 폐지 | 비교표, 이월 예시 섹션, FAQ |
| ISA 계약기간 5년 | 비교표, 설명 카드 |
| ISA 전액 비과세 | 설명 카드, FAQ |
| ISA 청년 소득공제 | 설명 카드, FAQ |
| ISA 계산기 | CTA 섹션 |

---

## 3. 데이터 파일 설계

파일: `src/data/isaReform2026.ts`

### 3-1. 상수 구조

```ts
export const ISA_REFORM_META = { ... };                     // §2-1
export const ISA_REFORM_TIMELINE: TimelineStep[] = [ ... ];
export const ISA_REFORM_COMPARE_ROWS: CompareRow[] = [ ... ];
export const ISA_REFORM_CARRYOVER_EXAMPLE: CarryoverRow[] = [ ... ];
export const ISA_REFORM_EXPLAINERS: ExplainerCard[] = [ ... ];
export const ISA_REFORM_PERSONA_SCENARIOS: PersonaCard[] = [ ... ];
export const ISA_REFORM_FAQ: FaqItem[] = [ ... ];
export const ISA_REFORM_RELATED_LINKS: RelatedLink[] = [ ... ];
export const ISA_REFORM_SOURCE_TABLE: SourceTableRow[] = [ ... ];
```

### 3-2. 타임라인 타입 (real-estate-tax-reform-2026과 동일 타입 재사용 가능)

```ts
export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};

export const ISA_REFORM_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부 검토", dateLabel: "2026년 8월 이전", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부 세제개편안 발표", dateLabel: "2026년 8월 3일", isCurrent: true, isDone: true },
  { status: "BILL_SUBMITTED", label: "국회 제출", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 심의·의결", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "2027년 이후 거론(미확정)", isCurrent: false, isDone: false },
];
```

### 3-3. 비교표 타입 (핵심 데이터)

```ts
export type ConfidenceLevel = "문답자료 확인" | "언론 보도" | "확인 필요";

export type CompareRow = {
  id: string;
  category: string;
  currentIsa: string;
  currentIsaAfterReform: string;
  productiveFinanceIsa: string;
  confidence: ConfidenceLevel;
  sourceLabel: string;
  sourceUrl: string;
};

export const ISA_REFORM_COMPARE_ROWS: CompareRow[] = [
  {
    id: "annual-limit",
    category: "연간 납입한도",
    currentIsa: "2,000만원",
    currentIsaAfterReform: "2,000만원 유지",
    productiveFinanceIsa: "2,000만원",
    confidence: "문답자료 확인",
    sourceLabel: "재정경제부 문답자료",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "total-limit",
    category: "총 납입한도",
    currentIsa: "1억원",
    currentIsaAfterReform: "1억원 유지 (이월 폐지·5년 제한과 결합 시 사실상 매년 풀납입 필요)",
    productiveFinanceIsa: "2억원",
    confidence: "언론 보도",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "carryover",
    category: "미사용 한도 이월",
    currentIsa: "다음 연도로 이월 가능",
    currentIsaAfterReform: "이월 폐지",
    productiveFinanceIsa: "해당 없음 (연 한도 고정)",
    confidence: "문답자료 확인",
    sourceLabel: "재정경제부 문답자료",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "contract-period",
    category: "계약기간",
    currentIsa: "3년 이후 계속 유지 가능",
    currentIsaAfterReform: "총 5년 이내로 제한 (기존 가입자 소급 기산점 확인 필요)",
    productiveFinanceIsa: "최대 10년",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "tax-free-limit",
    category: "비과세 한도",
    currentIsa: "일반 200만원 / 서민형 400만원",
    currentIsaAfterReform: "기존 수준 유지",
    productiveFinanceIsa: "대상 이자·배당 전액",
    confidence: "언론 보도",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "excess-tax",
    category: "초과분 과세",
    currentIsa: "9.9% 분리과세",
    currentIsaAfterReform: "유지",
    productiveFinanceIsa: "전액 비과세 대상 외 항목은 확인 필요",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "investment-target",
    category: "투자 대상",
    currentIsa: "국내주식·ETF(해외지수 추종 국내 상장 ETF 포함)·채권·RP·예적금 등",
    currentIsaAfterReform: "기존과 유사",
    productiveFinanceIsa: "국내주식·국내주식형 펀드·국민성장펀드 등 (해외 상품 원칙적 제외, BDC 포함 여부 확인 필요)",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "dual-holding",
    category: "기존 ISA 동시 가입",
    currentIsa: "-",
    currentIsaAfterReform: "-",
    productiveFinanceIsa: "기존 ISA와 별도로 동시 가입 가능한지 확인 필요",
    confidence: "확인 필요",
    sourceLabel: "원문 대조 전",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
];
```

> `dual-holding` 행은 기획서 §4-1(동시 가입 가능 여부)을 비교표에 명시적으로 노출시키기 위한 행이다. 원문 대조가 끝나 사실이 확인되면 `confidence`를 `"문답자료 확인"`으로 올리고 `currentIsaAfterReform`/`productiveFinanceIsa` 셀을 실제 내용으로 교체한다.

### 3-4. 이월 폐지 예시 타입

```ts
export type CarryoverRow = {
  scenario: "before" | "after";
  year: string;
  actualDeposit: string;
  nextYearAvailableLimit: string;
};

export const ISA_REFORM_CARRYOVER_EXAMPLE: CarryoverRow[] = [
  { scenario: "before", year: "2026년 500만원 납입", actualDeposit: "500만원", nextYearAvailableLimit: "2027년 최대 3,500만원" },
  { scenario: "before", year: "2026년 0원 납입", actualDeposit: "0원", nextYearAvailableLimit: "2027년 최대 4,000만원" },
  { scenario: "after", year: "2026년 500만원 납입", actualDeposit: "500만원", nextYearAvailableLimit: "2027년 최대 2,000만원" },
  { scenario: "after", year: "2026년 0원 납입", actualDeposit: "0원", nextYearAvailableLimit: "2027년 최대 2,000만원" },
];

export const ISA_REFORM_CARRYOVER_INSIGHT =
  "매년 2,000만원 한도를 다 채우지 않으면 남은 한도가 그대로 사라지는 구조입니다. 총 납입한도 1억원은 형식상 유지되지만, 이월이 폐지되고 계약기간이 5년으로 제한되면 이 한도를 실제로 채우려면 5년 동안 매년 빠짐없이 2,000만원을 납입해야 합니다. 결과적으로 총한도 자체의 실효성이 약해지는 구조입니다.";
```

### 3-5. 설명 카드 (개념 해설)

```ts
export type ExplainerCard = {
  id: string;
  question: string;
  answer: string;
};

export const ISA_REFORM_EXPLAINERS: ExplainerCard[] = [
  {
    id: "productive-finance-isa-explainer",
    question: "생산적금융 ISA란?",
    answer:
      "국내 주식시장과 국내 기업에 투자하는 사람에게 세제 혜택을 집중하기 위해 신설이 검토되는 별도의 ISA 계좌입니다. 기존 ISA(연 2,000만원·총 1억원)와 별도로, 연 2,000만원씩 최대 10년간 총 2억원까지 납입하는 구조로 보도됐습니다. 국내주식·국내주식형 펀드 등 국내 투자 대상에만 적용되며, 해외 상품은 원칙적으로 제외되는 방향입니다.",
  },
  {
    id: "bdc-explainer",
    question: "BDC란?",
    answer:
      "Business Development Company(비상장기업투자회사)의 약자로, 비상장 기업에 투자하는 회사형 투자기구입니다. 생산적금융 ISA의 투자 대상에 포함될 수 있다고 보도됐으나, 일반 개인투자자에게는 생소한 상품이므로 최종 포함 여부와 상품 구조를 시행 전 반드시 확인해야 합니다.",
  },
  {
    id: "growth-fund-explainer",
    question: "국민성장펀드란?",
    answer:
      "이번 개편안에서 국내 투자를 유도하기 위해 정부가 새로 지정하는 펀드 유형으로 거론되고 있습니다. 아직 구체적인 운용 방식과 상품 라인업이 확정되지 않았으므로, 정부안·시행령이 확정된 뒤 실제 상품 정보를 다시 확인해야 합니다.",
  },
  {
    id: "tax-free-meaning-explainer",
    question: "\"전액 비과세\"가 정확히 무엇을 의미하나?",
    answer:
      "생산적금융 ISA의 \"전액 비과세\"를 모든 투자수익이 비과세라는 뜻으로 오해하기 쉽습니다. 일반 개인투자자는 현재도 국내 상장주식 매매차익 대부분이 비과세이므로, 실질적인 추가 혜택은 국내 배당주 배당금, 국내주식형 ETF 분배금, 펀드·BDC 등에서 발생하는 배당·이자소득에 있습니다. 예를 들어 일반 계좌에서 국내 배당금 1,000만원을 받으면 통상 15.4%(154만원)가 원천징수되는데, 생산적금융 ISA에서 비과세 대상이 되면 이 세금을 줄일 수 있습니다.",
  },
  {
    id: "comprehensive-tax-explainer",
    question: "배당소득이 많으면 원천징수만으로 끝나지 않나?",
    answer:
      "이자·배당 등 금융소득 합계가 연 2천만원을 넘으면 원천징수(15.4%)로 끝나지 않고 다른 소득과 합산해 종합과세되며, 세율 구간에 따라 최대 49.5%까지 올라갈 수 있습니다. 배당소득이 큰 투자자일수록 생산적금융 ISA의 비과세 혜택이 상대적으로 더 클 수 있습니다.",
  },
];
```

### 3-6. 투자 성향별 시나리오 (개인화 제거, 일반화)

```ts
export type PersonaCard = {
  id: string;
  persona: string;
  direction: "기존 ISA 유리" | "생산적금융 ISA 유리" | "혜택 제한적" | "확인 필요";
  summary: string;
};

export const ISA_REFORM_PERSONA_SCENARIOS: PersonaCard[] = [
  {
    id: "overseas-index-etf",
    persona: "해외지수 ETF(S&P500·나스닥100 등 국내 상장) 중심 투자자",
    direction: "기존 ISA 유리",
    summary:
      "생산적금융 ISA는 해외 상품을 원칙적으로 제외하는 방향이므로, 국내 상장된 해외지수 추종 ETF에 투자한다면 기존 ISA를 계속 활용하는 편이 유리할 수 있습니다.",
  },
  {
    id: "domestic-dividend",
    persona: "국내 배당주·금융지주 장기 배당투자자",
    direction: "생산적금융 ISA 유리",
    summary:
      "배당·이자소득 전액 비과세 혜택이 검토되고 있어, 국내 배당주를 장기 보유하며 배당소득이 큰 투자자에게 상대적으로 유리한 구조로 거론됩니다.",
  },
  {
    id: "short-term-stock-trading",
    persona: "국내 개별주식 단기 매매 중심 투자자",
    direction: "혜택 제한적",
    summary:
      "국내 상장주식 매매차익은 일반 계좌에서도 대부분 비과세이므로, 매매 위주 투자자는 생산적금융 ISA의 추가 혜택이 상대적으로 크지 않을 수 있습니다.",
  },
  {
    id: "youth-investor",
    persona: "청년 투자자 (소득공제 대상 여부 확인 필요)",
    direction: "확인 필요",
    summary:
      "납입액의 10% 소득공제가 검토되고 있으나 연령·소득 요건, 공제한도, 중도해지 추징 여부가 아직 확정되지 않았습니다. 시행령 확정 후 대상 여부를 다시 확인해야 합니다.",
  },
];
```

> 원안 초안에 있던 특정 개인(생년, 특정 증권사, 보유 종목 언급) 대상 조언은 이 표로 완전히 대체한다. 페이지 어디에도 특정 개인을 지칭하는 문구를 넣지 않는다.

### 3-7. FAQ / 관련 링크 / 출처

```ts
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { label: string; href: string; desc: string };
export type SourceTableRow = { date: string; source: string; content: string; nature: string; url: string };
```

내용은 §7, §8 참고.

---

## 4. 페이지 IA 설계

### 4-1. 전체 섹션 순서

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page isar-page">
    [CalculatorHero]
    [InfoNotice]                  // 정부안 발표 단계 고지 + dataNote
    .isar-status-section          // 정책 상태 배지 + 타임라인
    .isar-compare-section         // 기존 ISA vs 개편 후 vs 생산적금융 ISA 3열 비교표
    .isar-carryover-section       // 이월 폐지 전/후 예시
    .isar-explainer-section       // 용어 설명 카드 5개
    .isar-persona-section         // 투자 성향별 시나리오 카드 4개
    .isar-cta-section             // 기존 계산기 연결
    [SeoContent]                  // FAQ + 관련 리포트/계산기
  </main>
```

### 4-2. 첫 화면 설계

```astro
<InfoNotice
  title="정부안 발표 단계 안내"
  lines={[
    ISA_REFORM_META.dataNote,
    `현재 단계: ${ISA_REFORM_META.policyStatusLabel} · ${ISA_REFORM_META.nextMilestone}`,
  ]}
/>

<section class="content-section isar-status-section" aria-labelledby="isar-status-title">
  <div class="isar-status-card">
    <span class="isar-status-badge" data-status={ISA_REFORM_META.policyStatus}>
      {ISA_REFORM_META.policyStatusLabel}
    </span>
    <h2 id="isar-status-title">2026 ISA 개편안은 아직 국회를 통과하지 않았습니다</h2>
    <p>{ISA_REFORM_META.nextMilestone}. 이 페이지는 그 전까지 발표된 정부안 내용만 정리한 자료입니다.</p>
  </div>
  <ol class="isar-timeline">
    {ISA_REFORM_TIMELINE.map((step) => (
      <li class:list={["isar-timeline-step", step.isCurrent && "isar-timeline-step--current", step.isDone && "isar-timeline-step--done"]}>
        <span class="isar-timeline-dot" aria-hidden="true"></span>
        <strong>{step.label}</strong>
        <span>{step.dateLabel}</span>
      </li>
    ))}
  </ol>
</section>
```

### 4-3. 비교표 섹션 (핵심 섹션)

```astro
<section class="content-section isar-compare-section" aria-labelledby="isar-compare-title">
  <div class="isar-section-heading">
    <p>뭐가 달라지나</p>
    <h2 id="isar-compare-title">기존 ISA vs 생산적금융 ISA</h2>
    <span>확정 법률이 아니라 2026-08-03 정부안 발표 기준입니다. `확인 필요` 배지가 붙은 항목은 원문 대조 전입니다.</span>
  </div>
  <div class="table-wrap isar-table-wrap">
    <table class="isar-compare-table">
      <caption class="sr-only">2026 ISA 개편안 비교표</caption>
      <thead>
        <tr>
          <th>항목</th>
          <th>기존 ISA (현행)</th>
          <th>기존 ISA (개편 후)</th>
          <th>생산적금융 ISA (신설)</th>
          <th>근거</th>
        </tr>
      </thead>
      <tbody>
        {ISA_REFORM_COMPARE_ROWS.map((row) => (
          <tr>
            <td><strong>{row.category}</strong></td>
            <td>{row.currentIsa}</td>
            <td>{row.currentIsaAfterReform}</td>
            <td>{row.productiveFinanceIsa}</td>
            <td>
              <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer">{row.sourceLabel}</a>
              <span class="isar-confidence-badge" data-level={row.confidence}>{row.confidence}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-4. 이월 폐지 예시 섹션

```astro
<section class="content-section isar-carryover-section" aria-labelledby="isar-carryover-title">
  <div class="isar-section-heading">
    <p>가장 중요한 변화</p>
    <h2 id="isar-carryover-title">미사용 납입한도, 이월이 사라집니다</h2>
  </div>
  <div class="isar-carryover-grid">
    <div class="isar-carryover-card">
      <h3>현재</h3>
      <ul>
        {ISA_REFORM_CARRYOVER_EXAMPLE.filter((r) => r.scenario === "before").map((row) => (
          <li><strong>{row.year}</strong><span>→ {row.nextYearAvailableLimit}</span></li>
        ))}
      </ul>
    </div>
    <div class="isar-carryover-card isar-carryover-card--after">
      <h3>개편 후</h3>
      <ul>
        {ISA_REFORM_CARRYOVER_EXAMPLE.filter((r) => r.scenario === "after").map((row) => (
          <li><strong>{row.year}</strong><span>→ {row.nextYearAvailableLimit}</span></li>
        ))}
      </ul>
    </div>
  </div>
  <p class="isar-carryover-insight">{ISA_REFORM_CARRYOVER_INSIGHT}</p>
</section>
```

### 4-5. 개념 설명 섹션

```astro
<section class="content-section isar-explainer-section" aria-labelledby="isar-explainer-title">
  <div class="isar-section-heading">
    <p>용어가 낯설다면</p>
    <h2 id="isar-explainer-title">생산적금융 ISA·전액 비과세, 쉽게 설명하면</h2>
  </div>
  <div class="isar-explainer-grid">
    {ISA_REFORM_EXPLAINERS.map((item) => (
      <article class="isar-explainer-card">
        <h3>{item.question}</h3>
        <p>{item.answer}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 투자 성향별 시나리오 섹션

```astro
<section class="content-section isar-persona-section" aria-labelledby="isar-persona-title">
  <div class="isar-section-heading">
    <p>나는 어디에 해당하나</p>
    <h2 id="isar-persona-title">투자 성향별로 어떤 계좌가 유리한가</h2>
    <span>일반적인 방향을 안내하는 참고 자료이며, 개인별 투자 판단은 세무 전문가·증권사 상담을 권장합니다.</span>
  </div>
  <div class="isar-persona-grid">
    {ISA_REFORM_PERSONA_SCENARIOS.map((card) => (
      <article class="isar-persona-card" data-direction={card.direction}>
        <span class="isar-persona-direction">{card.direction}</span>
        <h3>{card.persona}</h3>
        <p>{card.summary}</p>
      </article>
    ))}
  </div>
</section>
```

`data-direction` 배지 색만 다르게 하고(§5-3), 카드 문구는 항상 "~수 있음"·"검토" 어미를 유지해 확정처럼 보이지 않게 한다. 특정 인물을 지칭하는 표현은 절대 넣지 않는다(§1-3).

### 4-7. 계산기 연결 CTA 섹션

```astro
<section class="content-section isar-cta-section" aria-labelledby="isar-cta-title">
  <div class="isar-section-heading">
    <p>지금 기준으로 먼저 확인</p>
    <h2 id="isar-cta-title">내 ISA는 현재 기준으로 미리 계산해보세요</h2>
    <span>개편안이 확정되기 전까지는 현재 제도가 그대로 적용됩니다.</span>
  </div>
  <div class="isar-cta-grid">
    <a class="isar-cta-card" href="/tools/isa-tax-calculator/">
      <strong>ISA 계좌 절세 시뮬레이터</strong>
      <p>일반형·서민형·농어민형 비과세 혜택을 현재 기준으로 계산합니다.</p>
    </a>
    <a class="isar-cta-card" href="/tools/etf-distribution-tax-calculator/">
      <strong>ETF 분배금 세후 비교 계산기</strong>
      <p>국내 ETF·미국 ETF·ISA 계좌 분배금 세후 실수령을 비교합니다.</p>
    </a>
    <a class="isar-cta-card" href="/tools/dividend-target-calculator/">
      <strong>배당 목표 역산 계산기</strong>
      <p>월 배당금 목표에 필요한 투자금을 세전·세후로 계산합니다.</p>
    </a>
  </div>
</section>
```

### 4-8. SeoContent 연결

```astro
<SeoContent
  introTitle="2026 ISA 개편안, 지금까지 발표된 내용"
  intro={[
    "정부는 2026년 8월 3일 세제개편안을 발표하며 ISA 관련 두 가지 변화를 제시했습니다. 국내투자 전용 생산적금융 ISA 신설과, 기존 ISA의 미사용 납입한도 이월 폐지·계약기간 5년 제한입니다.",
    "이 페이지는 확정된 법률이 아니라 정부안 발표 내용과 언론 보도를 정리한 자료이며, 국회 심의·의결 이후 실제 내용으로 갱신됩니다.",
  ]}
  criteria={ISA_REFORM_COMPARE_ROWS.map((row) => `${row.category}: ${row.productiveFinanceIsa}`)}
  faq={ISA_REFORM_FAQ}
  related={ISA_REFORM_RELATED_LINKS}
/>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_isa-reform-2026.scss`, 전부 `.isar-` prefix.

### 5-1. 추가 클래스 목록

```scss
.isar-status-section
.isar-status-card
.isar-status-badge
.isar-timeline
.isar-timeline-step
.isar-timeline-step--current
.isar-timeline-step--done
.isar-timeline-dot
.isar-compare-section
.isar-table-wrap
.isar-compare-table
.isar-confidence-badge
.isar-carryover-section
.isar-carryover-grid
.isar-carryover-card
.isar-carryover-card--after
.isar-carryover-insight
.isar-explainer-section
.isar-explainer-grid
.isar-explainer-card
.isar-persona-section
.isar-persona-grid
.isar-persona-card
.isar-persona-direction
.isar-cta-section
.isar-cta-grid
.isar-cta-card
```

### 5-2. 상태·신뢰도 배지 (기존 디자인 시스템 톤 유지, `docs/UI_ARCHITECTURE.md` 기준 저채도)

```scss
.isar-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eaf1ff;
  color: #1a56db;
  font-weight: 600;
  font-size: 13px;
}

.isar-confidence-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;

  &[data-level="문답자료 확인"] { background: #eaf7ef; color: #16a34a; }
  &[data-level="언론 보도"] { background: #f1f4fa; color: #5b6472; }
  &[data-level="확인 필요"] { background: #fff4e5; color: #b45309; }
}

.isar-persona-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  padding: 16px;

  &[data-direction="기존 ISA 유리"] .isar-persona-direction { color: #1a56db; }
  &[data-direction="생산적금융 ISA 유리"] .isar-persona-direction { color: #16a34a; }
  &[data-direction="혜택 제한적"] .isar-persona-direction { color: #5b6472; }
  &[data-direction="확인 필요"] .isar-persona-direction { color: #b45309; }
}
```

`확인 필요` 배지는 노란 계열(경고성) 톤으로 다른 배지와 시각적으로 구분해, 원문 미대조 항목임을 사용자가 바로 알 수 있게 한다.

### 5-3. 이월 예시 카드

```scss
.isar-carryover-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.isar-carryover-card--after {
  border-color: #dc2626;
}

.isar-carryover-insight {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f8f6ee;
  font-size: 14px;
}

@media (max-width: 720px) {
  .isar-carryover-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-4. 그리드 규칙

```scss
.isar-explainer-grid,
.isar-persona-grid,
.isar-cta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .isar-explainer-grid,
  .isar-persona-grid,
  .isar-cta-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-5. 표 모바일 처리

```scss
.isar-table-wrap {
  overflow-x: auto;
}

.isar-compare-table {
  min-width: 760px;
}
```

### 5-6. 타임라인 (부동산 리포트와 동일 패턴 재사용)

```scss
.isar-timeline {
  display: flex;
  gap: 12px;
  list-style: none;
  padding: 0;
}

.isar-timeline-step {
  flex: 1;
  text-align: center;
  border-top: 3px solid #dde3f0;
  padding-top: 12px;

  &--current { border-top-color: #1a56db; }
  &--done { border-top-color: #16a34a; }
}

@media (max-width: 720px) {
  .isar-timeline {
    flex-direction: column;
    gap: 0;
  }

  .isar-timeline-step {
    text-align: left;
    border-top: none;
    border-left: 3px solid #dde3f0;
    padding: 8px 0 8px 14px;

    &--current { border-left-color: #1a56db; }
    &--done { border-left-color: #16a34a; }
  }
}
```

---

## 6. 접근성 및 구조화 데이터

### 6-1. HTML 구조

- 각 `section`은 `aria-labelledby`
- 비교표에 `caption`(시각적으로는 `sr-only`) 포함
- 타임라인 `<ol>`로 순서 있는 목록 처리
- 외부 출처 링크는 `target="_blank" rel="noopener noreferrer"`
- `확인 필요` 배지는 색상뿐 아니라 텍스트 라벨로도 전달(색맹 사용자 대응)

### 6-2. JSON-LD

`real-estate-tax-reform-2026.astro` 패턴을 그대로 따른다: `Article` + `FAQPage` + `BreadcrumbList`.

```ts
{
  "@context": "https://schema.org",
  "@type": "Article",
  headline: ISA_REFORM_META.title,
  description: ISA_REFORM_META.description,
  dateModified: ISA_REFORM_META.updatedAt,
  mainEntityOfPage: reportUrl,
  author: { "@type": "Organization", name: "비교계산소" },
}
```

### 6-3. FAQPage

`ISA_REFORM_FAQ` 배열을 화면과 JSON-LD가 공유하는 단일 출처로 유지한다.

---

## 7. FAQ 데이터 설계

```ts
export const ISA_REFORM_FAQ: FaqItem[] = [
  {
    question: "2026 ISA 개편안은 확정된 건가요?",
    answer:
      "아니요. 2026년 8월 3일 정부가 세제개편안을 발표했지만, 국회 제출과 심의·의결을 거쳐야 실제 시행됩니다. 이 페이지는 정부안 발표 내용을 정리한 자료이며 확정 법률이 아닙니다.",
  },
  {
    question: "생산적금융 ISA와 기존 ISA를 동시에 가입할 수 있나요?",
    answer:
      "현재 공개된 자료만으로는 명확하지 않습니다. 원문 대조가 끝나는 대로 이 페이지를 갱신할 예정이며, 그 전까지는 `확인 필요` 항목으로 표시합니다.",
  },
  {
    question: "기존 ISA에 넣어둔 돈은 어떻게 되나요?",
    answer:
      "이월 폐지와 계약기간 5년 제한이 기존 가입자에게도 적용되는 방향으로 보도됐지만, 정확한 소급 기산점(개편 시행일 기준인지 최초 가입일 기준인지)은 아직 확정되지 않았습니다.",
  },
  {
    question: "생산적금융 ISA는 정말 세금이 하나도 없나요?",
    answer:
      "국내 상장주식 매매차익은 일반 계좌에서도 대부분 비과세이므로, 생산적금융 ISA의 실질적인 추가 혜택은 배당·분배금·이자소득에 있습니다. 모든 수익이 새롭게 비과세로 바뀐다는 뜻은 아닙니다.",
  },
  {
    question: "청년 소득공제는 누가 받을 수 있나요?",
    answer:
      "납입액의 10% 소득공제가 검토되고 있으나, 연령·소득 요건과 공제한도, 중도해지 추징 여부는 아직 확정되지 않았습니다. 시행령이 나오면 대상 여부를 다시 확인해야 합니다.",
  },
  {
    question: "지금 기존 ISA에 얼마나 넣어야 하나요?",
    answer:
      "일률적으로 답하기는 어렵습니다. 이월 폐지가 예정대로 시행되면 매년 한도를 채우지 않을 경우 남은 한도가 사라지므로, 여유 자금이 있다면 연간 한도 내에서 납입하는 것을 고려할 수 있습니다. 다만 개인의 자금 상황과 투자 계획에 따라 다르므로 세무 전문가·증권사 상담을 권장합니다.",
  },
];
```

---

## 8. 내부 링크 및 CTA 설계

### 8-1. 관련 링크 데이터

```ts
export const ISA_REFORM_RELATED_LINKS: RelatedLink[] = [
  {
    label: "ISA 계좌 절세 시뮬레이터",
    href: "/tools/isa-tax-calculator/",
    desc: "일반형·서민형·농어민형 비과세 혜택을 현재 기준으로 계산합니다.",
  },
  {
    label: "ETF 분배금 세후 비교 계산기",
    href: "/tools/etf-distribution-tax-calculator/",
    desc: "국내 ETF·미국 ETF·ISA 계좌 분배금 세후 실수령을 비교합니다.",
  },
  {
    label: "배당 목표 역산 계산기",
    href: "/tools/dividend-target-calculator/",
    desc: "월 배당금 목표에 필요한 투자금을 세전·세후로 계산합니다.",
  },
  {
    label: "2026 부동산 세제개편 전망",
    href: "/reports/real-estate-tax-reform-2026/",
    desc: "같은 8월 세제개편안의 부동산 파트를 정리한 리포트입니다.",
  },
];
```

### 8-2. CTA 배치

| 위치 | CTA | 목적 |
|---|---|---|
| 비교표 직후 | 이월 폐지 예시 섹션으로 스크롤 유도 | 체류 시간 |
| 투자 성향별 시나리오 섹션 직후 | `isar-cta-section` 계산기 3종 | 계산기 전환 |
| SeoContent related | 관련 리포트 1개 + 계산기 3개 | 회유율 |

---

## 9. 구현 순서

### 9-1. 착수 전 필수 확인 (기획서 §4)

구현 코드 작성 전에 아래를 먼저 처리한다.

1. 기획재정부 공식 보도자료 원문으로 §4의 6개 항목(동시 가입, 전환, 소급 기산점, BDC 포함 여부, 청년 요건, 이월 폐지 소급) 재확인
2. 확인된 항목은 `ISA_REFORM_COMPARE_ROWS`의 `confidence`를 `"문답자료 확인"`으로 올리고 셀 내용 교체
3. 확인되지 않은 항목은 `"확인 필요"`로 유지한 채 구현 진행 (전체 착수를 막지는 않음 — 배지로 명확히 표시하는 것이 원칙)

### 9-2. 데이터 파일 작성

파일: `src/data/isaReform2026.ts` (신규)

1. 타입 정의 (`PolicyStatus`, `TimelineStep`, `ConfidenceLevel`, `CompareRow`, `CarryoverRow`, `ExplainerCard`, `PersonaCard`, `FaqItem`, `RelatedLink`, `SourceTableRow`)
2. `ISA_REFORM_META` (§2-1)
3. `ISA_REFORM_TIMELINE` 5단계 (§3-2)
4. `ISA_REFORM_COMPARE_ROWS` 8행 (§3-3)
5. `ISA_REFORM_CARRYOVER_EXAMPLE` + `ISA_REFORM_CARRYOVER_INSIGHT` (§3-4)
6. `ISA_REFORM_EXPLAINERS` 5개 (§3-5)
7. `ISA_REFORM_PERSONA_SCENARIOS` 4개 (§3-6)
8. `ISA_REFORM_FAQ` 6개 (§7)
9. `ISA_REFORM_RELATED_LINKS` 4개 (§8-1)
10. `ISA_REFORM_SOURCE_TABLE` — 출처 2건(기재부 문답자료, 뉴스핌) 배열화

### 9-3. Astro 페이지 작성

파일: `src/pages/reports/isa-reform-2026.astro` (신규)

1. `real-estate-tax-reform-2026.astro`를 템플릿으로 복사해 시작
2. import 교체 (§3-1 데이터)
3. JSON-LD 3종 구성 (§6-2)
4. Hero (§2-2)
5. InfoNotice + 상태·타임라인 (§4-2)
6. `isar-compare-section` (§4-3)
7. `isar-carryover-section` (§4-4)
8. `isar-explainer-section` (§4-5)
9. `isar-persona-section` (§4-6)
10. `isar-cta-section` (§4-7)
11. `SeoContent` (§4-8)

### 9-4. SCSS 작성

파일: `src/styles/scss/pages/_isa-reform-2026.scss` (신규)

1. §5-1 클래스 뼈대 작성
2. 상태/신뢰도 배지 (§5-2)
3. 이월 예시 카드 (§5-3)
4. 3열 그리드 + 모바일 1열 (§5-4)
5. 표 가로 스크롤 (§5-5)
6. 타임라인 반응형 (§5-6)
7. `src/styles/app.scss`에 `@use 'scss/pages/isa-reform-2026';` 추가

### 9-5. 등록 파일 반영

- `src/data/reports.ts` — 신규 항목 추가 (title/description은 §2-1 `seoTitle`/`description` 기준, `order`는 현재 최대값 다음 순번, `badges: ["세금", "ISA", "2026"]` 등)
- `src/pages/index.astro`의 `reportMetaBySlug`에 `"isa-reform-2026": { category: "asset", isNew: true }` 추가 — **누락 시 홈에서 "기타"로 표시되므로 필수**
- `public/sitemap.xml`에 `/reports/isa-reform-2026/` 추가
- `src/pages/reports/index.astro`에서 정상 노출 확인

---

## 10. QA 체크리스트

### 콘텐츠

- [ ] 첫 화면(Hero + InfoNotice)에서 "국회 통과 전"이 바로 보이는가?
- [ ] 비교표의 모든 행에 출처 링크와 신뢰도 배지가 걸려 있는가?
- [ ] `확인 필요` 배지가 붙은 항목이 확정 수치처럼 보이지 않는가?
- [ ] 결론·시나리오 카드에 "가장 합리적", "무조건" 같은 단정 표현이 없는가?
- [ ] 특정 개인을 지칭하는 표현(생년, 특정 증권사, 특정 종목 보유)이 전혀 없는가? (§1-3 재확인)
- [ ] 기재부 출처 링크에 `utm_source` 등 추적 파라미터가 남아있지 않은가?
- [ ] FAQ가 화면에 실제로 보이는가(숨김 아님)?

### SEO

- [ ] title에 "2026 ISA 개편"이 포함되는가?
- [ ] meta description이 80~120자 내외인가?
- [ ] FAQPage JSON-LD와 화면 FAQ가 동일 데이터에서 나오는가?
- [ ] 내부 링크(계산기 3개 + 관련 리포트 1개)가 모두 연결되는가?

### UI

- [ ] 320px 모바일에서 타임라인·이월 예시 카드가 세로로 자연스럽게 전환되는가?
- [ ] 비교표가 모바일에서 가로 스크롤로 읽히는가?
- [ ] `확인 필요` 배지가 다른 배지와 시각적으로(색상+텍스트) 구분되는가?
- [ ] 외부 출처 링크가 새 창으로 열리고 `rel="noopener noreferrer"`가 걸려 있는가?

### 빌드

- [ ] `npm run build` 성공
- [ ] `dist/reports/isa-reform-2026/index.html` 생성 확인
- [ ] 홈 리포트 섹션에서 "투자·재테크(asset)" 카테고리로 정상 노출("기타" 아님) 확인
- [ ] sitemap에 트레일링 슬래시 포함해 정확히 반영 (`docs/GOOGLE_SEO_RULES.md` 기준)

---

## 11. 향후 확장 — 국회 심의 단계 갱신 계획

새 slug를 만들지 않고 **같은 페이지를 갱신**한다(부동산 리포트와 동일 원칙).

갱신 대상:

1. §4 항목 원문 대조가 끝나면 `confidence`를 `"문답자료 확인"`으로 올리고 셀 내용 교체
2. 국회 제출 시 `ISA_REFORM_META.policyStatus` → `"BILL_SUBMITTED"`, `ISA_REFORM_TIMELINE` 갱신
3. 국회 통과 시 확정 수치·시행일 반영, `confidence`에 `"확정"` 같은 새 값 추가 검토
4. `ISA_REFORM_META.updatedAt`, sitemap `lastmod` 갱신

---

## 12. 최종 판단

이 리포트는 완전 신규 페이지지만 구현 난이도는 낮다 — 정적 리포트이며 클라이언트 스크립트가 필요 없고, 기존 `real-estate-tax-reform-2026.astro` 구조를 그대로 재사용할 수 있다. 핵심 리스크는 두 가지다.

1. **콘텐츠 정확성**: §4의 6개 항목이 단일 언론 보도에만 근거해 있어, 구현 전 기재부 원문 대조가 반드시 필요하다. 대조 없이 확정처럼 게시하면 세제개편 리포트 신뢰도와 SEO 안정성 모두에 리스크가 된다.
2. **표현 수위**: 원안 초안에 있던 개인화된 투자 조언(특정 인물 지칭)을 이번 설계에서 전부 투자 성향별 일반화 시나리오로 대체했다. 구현 시 원안 표현이 다시 섞여 들어가지 않도록 §3-6, §4-6을 그대로 따른다.

두 리스크를 관리하면, 같은 8월 세제개편안을 다룬 `real-estate-tax-reform-2026` 리포트와 상호 링크되어 "2026 세제개편" 검색 클러스터 전체의 체류 시간과 회유율을 높이는 효과를 기대할 수 있다.
