# SK하이닉스 2026년 실적 vs 2027년 초 PS 전망 리포트 — 설계 문서

> 기획 원본: [`docs/plan/202607/sk-hynix-earnings-ps-outlook-2026-plan.md`](../../plan/202607/sk-hynix-earnings-ps-outlook-2026-plan.md) (v2)
> 작성일: 2026-07-29
> 유형: 정보성 리포트 (`/reports/`), 정적 페이지(JS 계산 없음) — 연간 허브, 분기마다 데이터만 갱신
> 참고 템플릿: [`samsung-q2-earnings-bonus-outlook-2026-design.md`](./samsung-q2-earnings-bonus-outlook-2026-design.md) — 동일한 "실적 발표 시즌 정적 리포트" 패턴을 SK하이닉스 버전으로 이식

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/skHynixEarningsPsOutlook2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 페이지 | `src/pages/reports/sk-hynix-earnings-ps-outlook-2026.astro` |
| 스크립트 | (없음 — 정적 리포트. 개인화 계산은 기존 `/tools/sk-hynix-bonus/`로 위임) |
| 스타일 | `src/styles/scss/pages/_sk-hynix-earnings-ps-outlook-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `shep-` (SK Hynix Earnings & PS outlook). 기존 `.report-page` 공유 클래스 위에 얹는 방식 — `sk-hynix-bonus-2027.astro`(`skb27-` 프리픽스), `samsung-q2-earnings-bonus-outlook-2026.astro`(`sqe-` 프리픽스)와 동일한 실제 구현 패턴을 따른다.

---

## 2. URL 및 메타

```
슬러그: /reports/sk-hynix-earnings-ps-outlook-2026/
타이틀(seoTitle): SK하이닉스 2분기 실적·PS 전망 2026 | 2027 성과급 얼마나 될까
디스크립션: SK하이닉스 2026년 2분기 매출 79.3조 원, 영업이익 60.5조 원을 분석하고 2026년 실적 기준 2027년 초 지급될 PS 성과급을 시나리오별로 추정합니다.
```

> 슬러그에 분기 표기(`q2`)를 넣지 않는다 — 이 페이지는 분기마다 데이터만 교체하는 연간 허브이므로, URL이 특정 분기에 고정되면 3분기·연간 갱신 시 URL을 새로 만들어야 하는 문제가 생긴다(기획 문서 §0 참고).

---

## 3. 데이터 파일 설계

**`src/data/skHynixEarningsPsOutlook2026.ts`**

`skHynixCompensation.ts`에서는 **직급별 기준급 프리셋(`rankPresets`)만** import해서 재사용한다. `psMultipliersByYear`(2026 보수 24%/기준 29.64%/공격 33%, 2027·2028 시나리오)는 **재사용하지 않는다** — 2026년 상반기 실적(98.15조원)이 이미 2025년 연간 실적(47.21조원)의 2.08배로, 기존 시나리오 전제 자체가 무의미해졌기 때문이다(기획 문서 §1 "중복 방지 원칙보다 정확성 우선"). 이 리포트의 PS 시나리오는 이 파일에서 새로 계산한다.

```ts
import { rankPresets } from "./skHynixCompensation";

// ── 타입 ──────────────────────────────────────────

export type QuarterResult = {
  revenue: number;              // 조원 단위
  operatingProfit: number;
  operatingMargin: number;      // %
};

export type ScenarioCode = "conservative" | "base" | "bull";

export type PsScenarioRow = {
  id: ScenarioCode;
  label: string;
  h2ToH1Ratio: number;          // 하반기를 상반기 대비 비율로 가정
  description: string;
};

export type PayoutStructureRisk = {
  status: string;               // "노사 교섭 진행 중, 미확정"
  asOf: string;
  currentStructure: string;
  proposedChange: string;
  unionPosition: string;
};

export type PayoutStructureVariable = {
  variable: string;
  current: string;
  impact: string;
};

export type CheckpointItem = { order: number; text: string };
export type FaqItem = { question: string; answer: string };
export type UpdateLogItem = { date: string; note: string; status: "완료" | "예정" };

// ── 실적 데이터 ────────────────────────────────────

export const SHEP_META = {
  slug: "sk-hynix-earnings-ps-outlook-2026",
  title: "SK하이닉스 2026년 2분기 실적과 2027년 PS 전망",
  seoTitle: "SK하이닉스 2분기 실적·PS 전망 2026 | 2027 성과급 얼마나 될까",
  seoDescription:
    "SK하이닉스 2026년 2분기 매출 79.3조 원, 영업이익 60.5조 원을 분석하고 2026년 실적 기준 2027년 초 지급될 PS 성과급을 시나리오별로 추정합니다.",
  description: "상반기 영업이익이 작년 연간의 2배를 넘어선 가운데, 2027년 초 지급될 PS를 시나리오별로 추정합니다.",
  updatedAt: "2026-07-29",
  dataNote:
    "이 페이지의 PS(성과급) 전망은 단순 비례 추정 모델 기준이며 공식 확정 발표가 아닙니다. 2026년 실적 기준 PS는 연간 실적 확정 후 노사 협의를 거쳐 2027년 초 지급률이 결정되며, 지급방식(현금·자사주 비율)도 협의 중인 변수입니다.",
};

export const SHEP_Q1: QuarterResult = {
  revenue: 52.576,
  operatingProfit: 37.6103,
  operatingMargin: 72,
};

export const SHEP_Q2: QuarterResult = {
  revenue: 79.3187,
  operatingProfit: 60.5426,
  operatingMargin: 76,
};

export const SHEP_Q2_GROWTH = {
  qoqRevenue: 51,
  qoqOperatingProfit: 61,
  qoqMarginPointDiff: 4,
  yoyRevenue: 257,
  yoyOperatingProfit: 557,
  yoyMarginPointDiff: 35,
};

export const SHEP_NET_PROFIT_NOTE = {
  value: 93.9226,
  label: "2분기 순이익 93조 9,226억원(순이익률 118%)",
  caption: "비영업손익 포함 추정 수치로, 영업이익과 별개 지표입니다. 성과급 산정과 직접 연결되는 지표는 영업이익입니다.",
};

export const SHEP_H1 = {
  operatingProfit: SHEP_Q1.operatingProfit + SHEP_Q2.operatingProfit, // 98.1529
};

export const SHEP_FY2025_OPERATING_PROFIT = 47.2063;
export const SHEP_H1_VS_FY2025_MULTIPLE = SHEP_H1.operatingProfit / SHEP_FY2025_OPERATING_PROFIT; // ≈ 2.08

export const SHEP_CONSENSUS = {
  asOf: "2026-05-20",
  annualOperatingProfit: 77.1,
  source: "FnGuide",
};

export const SHEP_CONSENSUS_GAP = {
  q2ToConsensusRatio: SHEP_Q2.operatingProfit / SHEP_CONSENSUS.annualOperatingProfit,       // ≈ 0.785
  h1ExcessAmount: SHEP_H1.operatingProfit - SHEP_CONSENSUS.annualOperatingProfit,           // ≈ 21.05
  h1ExcessRatio: SHEP_H1.operatingProfit / SHEP_CONSENSUS.annualOperatingProfit - 1,        // ≈ 0.273
};

// ── PS 산정 구조 ───────────────────────────────────

export const SHEP_PS_BASELINE = {
  fiscalYear: 2025,
  operatingProfit: SHEP_FY2025_OPERATING_PROFIT,
  paidYear: 2026,
  psRate: 2964,                 // 기준급 대비 %
  fundRatioOfOperatingProfit: 10, // %
  immediateRatio: 0.8,
  deferredRatioYear1: 0.1,
  deferredRatioYear2: 0.1,
};

export const SHEP_PS_SCENARIOS: PsScenarioRow[] = [
  { id: "conservative", label: "보수적", h2ToH1Ratio: 0.35, description: "하반기 메모리 가격·출하량이 상반기보다 크게 둔화" },
  { id: "base", label: "기준", h2ToH1Ratio: 0.55, description: "하반기에도 높은 수익성을 유지하되 성장률은 둔화" },
  { id: "bull", label: "공격적", h2ToH1Ratio: 0.75, description: "HBM4 확대와 범용 메모리 가격 강세가 지속" },
];

// ── 계산 로직 ──────────────────────────────────────

export const calculateAnnualOperatingProfit = (h2ToH1Ratio: number) =>
  SHEP_H1.operatingProfit * (1 + h2ToH1Ratio);

export const estimatePsRate = (annualOperatingProfit: number) =>
  Math.round(SHEP_PS_BASELINE.psRate * (annualOperatingProfit / SHEP_PS_BASELINE.operatingProfit));

export type PsScenarioResult = PsScenarioRow & {
  annualOperatingProfit: number;
  estimatedPsRate: number;
};

export const SHEP_PS_SCENARIO_RESULTS: PsScenarioResult[] = SHEP_PS_SCENARIOS.map((scenario) => {
  const annualOperatingProfit = calculateAnnualOperatingProfit(scenario.h2ToH1Ratio);
  return {
    ...scenario,
    annualOperatingProfit,
    estimatedPsRate: estimatePsRate(annualOperatingProfit),
  };
});

// ── 지급방식 개편 리스크 (2026-07 기준 미확정) ──────

export const SHEP_PAYOUT_RISK: PayoutStructureRisk = {
  status: "노사 교섭 진행 중, 미확정",
  asOf: "2026-07-29",
  currentStructure: "산정액 80% 당해 현금 지급 + 20% 2년(10%씩) 이연 지급",
  proposedChange: "PS 재원 기준(영업이익 10%)은 유지, 지급 수단 일부를 현금에서 자사주로 전환 검토",
  unionPosition: "세금 부담·현금화 문제로 반발",
};

export const SHEP_PAYOUT_VARIABLES: PayoutStructureVariable[] = [
  { variable: "PS 재원 기준", current: "영업이익의 10% (유지 논의)", impact: "실적 상승 시 재원 확대" },
  { variable: "지급 시점", current: "익년 초", impact: "2026년 실적분은 2027년 초" },
  { variable: "이연 지급", current: "20%를 2년(10%씩) 분할", impact: "당해 현금 수령액 감소" },
  { variable: "지급 수단 개편", current: "현금 일부 → 자사주 전환 검토 (미확정)", impact: "확정 시 실질 현금 수령액·세금 부담 달라질 수 있음" },
  { variable: "노사 합의", current: "진행 중, 결론 미확정", impact: "최종 지급률·지급방식 모두 변동 가능" },
];

export const SHEP_CHECKPOINTS: CheckpointItem[] = [
  { order: 1, text: "하반기 D램·낸드 가격 상승세 지속 여부 (고객 재고 조정 리스크)" },
  { order: 2, text: "HBM4 양산 확대 속도 및 수율" },
  { order: 3, text: "장기공급계약 체결 고객사(현재 약 10개사) 추가 여부" },
  { order: 4, text: "3분기 실적(10월 발표 예정) 컨센서스 상회 여부" },
  { order: 5, text: "PS 지급방식(현금·자사주) 노사 교섭 결론 시점" },
  { order: 6, text: "연간 실적 확정 후 PS 지급 기준일 공지" },
];

export const SHEP_FAQ: FaqItem[] = [
  { question: "2분기 실적은 언제, 얼마로 발표됐나요?", answer: "2026년 7월 29일, 매출 79조 3,187억원·영업이익 60조 5,426억원(영업이익률 76%)으로 발표됐습니다." },
  { question: "상반기 실적은 작년 연간과 비교하면 어느 정도인가요?", answer: "2026년 상반기 영업이익(98.2조원)은 2025년 연간 영업이익(47.2조원)의 약 2.08배입니다." },
  { question: "2026년 실적에 대한 PS는 언제 지급되나요?", answer: "통상 연간 실적 확정 후 2027년 초 지급률이 결정되고 지급됩니다." },
  { question: "2분기 영업이익만으로 PS를 계산할 수 있나요?", answer: "불가능합니다. 연간 영업이익, PS 재원 산정 방식, 대상 인원, 노사 합의가 모두 필요합니다." },
  { question: "PS 2,964%는 연봉의 29.64배인가요?", answer: "아닙니다. 기준급의 2,964%이며, 기준급이 연봉의 약 1/20이라면 연봉 대비로는 약 1.48배 수준입니다." },
  { question: "PS는 모두 한 번에 현금으로 받나요?", answer: "현재 알려진 구조는 산정액의 80%를 당해 현금 지급하고 20%를 2년(10%씩) 이연 지급합니다. 다만 이 방식이 바뀔 수 있습니다." },
  { question: "현금 대신 주식으로 받을 수도 있나요?", answer: "2026년 7월 기준, 지급 방식 일부를 자사주로 전환하는 방안이 노사 교섭 쟁점으로 논의되고 있으나 확정되지 않았습니다." },
  { question: "상반기 실적이 좋으면 최소 지급률이 보장되나요?", answer: "아닙니다. 분기·반기 실적만으로 최종 PS 지급률이 보장되지 않으며, 연간 실적 확정과 노사 협의를 거쳐야 합니다." },
];

export const SHEP_SEO_INTRO = [
  "SK하이닉스는 2026년 7월 29일 2분기 실적을 발표했습니다. 매출 79조 3,187억원, 영업이익 60조 5,426억원(영업이익률 76%)으로 분기 사상 최대이며, 상반기 누적 영업이익(98조 1,529억원)은 2025년 연간 실적의 약 2.08배에 달합니다.",
  "다만 PS(초과이익분배금)는 영업이익만으로 결정되지 않습니다. 재원 산정 방식, 대상 인원과 기준급 총액, 노사 합의, 그리고 최근 쟁점이 된 현금·자사주 지급 비율 개편 여부까지 종합적으로 반영됩니다.",
];

export const SHEP_SEO_CRITERIA = [
  "2분기 실적: 매출 79.3조원, 영업이익 60.5조원(영업이익률 76%), 전년 동기 대비 +257%/+557%",
  "상반기 누적 영업이익 98.2조원은 2025년 연간 실적(47.2조원)의 약 2.08배",
  "PS는 연간 영업이익의 10%를 재원으로, 산정액의 80%는 당해 현금·20%는 2년 이연 지급 (2026년 초 실제 지급 기준급 2,964%)",
  "2026년 실적 기준 PS는 2027년 초 지급되며, 이 페이지의 시나리오는 단순 비례 추정치로 공식 발표가 아님",
  "PS 지급 수단(현금·자사주 비율) 개편이 2026년 7월 노사 교섭 쟁점으로 논의 중이며 미확정",
];

export const SHEP_RELATED_LINKS = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026" },
  { href: "/reports/sk-hynix-bonus-2027/", label: "SK하이닉스 2027 성과급 전망" },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교" },
];

export const SHEP_UPDATE_LOG: UpdateLogItem[] = [
  { date: "2026-07-29", note: "2분기 확정실적 반영, PS 지급방식 개편 이슈 추가", status: "완료" },
  { date: "2026-08", note: "증권사 연간 컨센서스 업데이트 예정", status: "예정" },
  { date: "2026-10", note: "3분기 실적 반영 예정", status: "예정" },
  { date: "2027-01", note: "연간 확정실적 반영 예정", status: "예정" },
  { date: "2027-02", note: "실제 PS 지급률·지급방식 확정 반영 예정", status: "예정" },
];
```

**⚠️ 원칙:** `rankPresets`만 `skHynixCompensation.ts`에서 import한다. 실적 수치·PS 시나리오·지급방식 리스크는 전부 이 파일에서 신규 정의한다.

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 실적 발표 시즌
 └─ title: SK하이닉스 2026년 2분기 실적과 2027년 PS 전망
 └─ description: 상반기 영업이익이 작년 연간의 2배를 넘어선 가운데, 2027년 초 지급될 PS를 시나리오별로 추정
 └─ KPI 4개: 2분기 매출 / 2분기 영업이익 / 상반기 영업이익 / 영업이익률 (순이익 제외 — §9 QA 참고)

InfoNotice (면책 배너)
 └─ SHEP_META.dataNote, "PS 지급방식(현금·자사주 비율)도 협의 중인 변수" 재강조

섹션 1 — 2분기 실적 한눈에 보기 (전분기·전년 대비 비교표, Q1 참고 수치 포함)
섹션 2 — 상반기 실적은 작년 연간의 몇 배인가 ★ 핵심 훅 (KPI 카드 3개)
섹션 3 — 5월 컨센서스는 얼마나 빗나갔나 (데이터 카드 + 해석 문단)
섹션 4 — PS 산정 구조 설명 (설명 카드 3단)
섹션 5 — 2027년 초 지급 PS 시나리오 ★ 핵심 (기본 요약 표 + <details> 상세보기 토글 + CTA)
섹션 6 — 실적보다 더 중요한 변수: PS 지급방식이 바뀔까 ★ 신규 (경고 인포박스 + 변수표)
섹션 7 — PS를 좌우할 하반기 변수 (체크리스트 6개)
섹션 8 — 삼성전자와 비교하면? (요약 카드 1개 + 딥링크)
섹션 9 — 업데이트 로그 (타임라인, 페이지 하단 고정)
SeoContent (FAQ + 관련 링크)
```

`REPORT_CONTENT_GUIDE.md`의 권장 IA를 따르되, "선택 UI"가 있는 계산기 개인화는 기존 `/tools/sk-hynix-bonus/`로 위임하고 이 페이지는 실적 해석 + 시나리오 표 중심의 정적 리포트로 유지한다(계산기 중복 구현 방지 — `samsung-q2-earnings-bonus-outlook-2026` 설계와 동일 원칙).

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 | 실제 Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero 섹션 | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title: string`, `lines: string[]` |
| `SeoContent.astro` | SEO 텍스트 + FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 페이지 전용 마크업 (인라인, `shep-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.shep-page` | 페이지 루트 스코프 (로컬 CSS 변수 정의) |
| `.shep-kpi-grid` | Hero 하단 KPI 카드 4개 |
| `.shep-quarter-table` | 섹션 1 — 분기별 실적 비교표 |
| `.shep-multiple-card` | 섹션 2 — "작년 연간의 2.08배" 강조 카드 |
| `.shep-consensus-card` | 섹션 3 — 컨센서스 갭 데이터 카드 |
| `.shep-ps-structure-table` | 섹션 4 — PS 산정 구조 표 |
| `.shep-scenario-summary` | 섹션 5 — 기본 요약 표 |
| `.shep-scenario-detail` | 섹션 5 — `<details>` 상세보기 토글 내부 표 (숫자가 큰 PS% 표시) |
| `.shep-payout-risk-box` | 섹션 6 — 지급방식 개편 리스크 경고 박스 (앰버 톤) |
| `.shep-payout-variable-table` | 섹션 6 — 변수 표 |
| `.shep-checklist` | 섹션 7 — 체크리스트 |
| `.shep-hynix-vs-samsung-card` | 섹션 8 — 삼성전자 비교 요약 카드 |
| `.shep-update-log` | 섹션 9 — 업데이트 로그 타임라인 |
| `.shep-cta-group` | 내부 CTA 버튼 묶음 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_sk-hynix-earnings-ps-outlook-2026.scss`

```scss
.shep-page {
  --shep-ink: #172033;
  --shep-muted: #667085;
  --shep-line: #d8e0ea;
  --shep-primary: #1a56db;
  --shep-warn-bg: #fffaeb;
  --shep-warn-border: #f0b429;
  --shep-warn-ink: #92400e;

  .shep-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .shep-quarter-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--shep-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .shep-multiple-card {
    border: 1px solid var(--shep-primary);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;

    strong {
      font-size: 2rem;
      color: var(--shep-primary);
    }
  }

  .shep-scenario-summary {
    width: 100%;
    border-collapse: collapse;

    th, td {
      border-bottom: 1px solid var(--shep-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .shep-scenario-detail {
    margin-top: 0.75rem;
    border: 1px dashed var(--shep-line);
    border-radius: 8px;
    padding: 0.75rem 1rem;

    summary {
      cursor: pointer;
      font-weight: 600;
      color: var(--shep-primary);
    }

    &__caption {
      font-size: 0.8rem;
      color: var(--shep-muted);
      margin-top: 0.5rem;
    }
  }

  .shep-payout-risk-box {
    border: 1px solid var(--shep-warn-border);
    background: var(--shep-warn-bg);
    color: var(--shep-warn-ink);
    border-radius: 12px;
    padding: 1rem 1.25rem;

    &__status {
      display: inline-block;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
  }

  .shep-payout-variable-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-top: 1rem;

    th, td {
      border-bottom: 1px solid var(--shep-line);
      padding: 0.5rem 0.7rem;
      text-align: left;
    }
  }

  .shep-checklist {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }

  .shep-update-log {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.85rem;

    &__item[data-status="완료"] { color: var(--shep-ink); }
    &__item[data-status="예정"] { color: var(--shep-muted); }
  }

  .shep-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  @media (prefers-color-scheme: dark) {
    --shep-warn-bg: #3a2e10;
    --shep-warn-ink: #fbbf24;
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
import { withBase } from "../../utils/base";
import {
  SHEP_META,
  SHEP_Q1,
  SHEP_Q2,
  SHEP_Q2_GROWTH,
  SHEP_NET_PROFIT_NOTE,
  SHEP_H1,
  SHEP_H1_VS_FY2025_MULTIPLE,
  SHEP_FY2025_OPERATING_PROFIT,
  SHEP_CONSENSUS,
  SHEP_CONSENSUS_GAP,
  SHEP_PS_BASELINE,
  SHEP_PS_SCENARIO_RESULTS,
  SHEP_PAYOUT_RISK,
  SHEP_PAYOUT_VARIABLES,
  SHEP_CHECKPOINTS,
  SHEP_FAQ,
  SHEP_SEO_INTRO,
  SHEP_SEO_CRITERIA,
  SHEP_RELATED_LINKS,
  SHEP_UPDATE_LOG,
} from "../../data/skHynixEarningsPsOutlook2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SHEP_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SHEP_META.title,
    description: SHEP_META.seoDescription,
    dateModified: SHEP_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SHEP_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SHEP_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SHEP_META.seoTitle} description={SHEP_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page shep-page" data-report="sk-hynix-earnings-ps-outlook-2026">
    <CalculatorHero
      eyebrow="실적 발표 시즌"
      title={SHEP_META.title}
      description={SHEP_META.description}
    />

    <div class="shep-kpi-grid">
      <article class="op-card"><strong>2분기 매출</strong><p>{SHEP_Q2.revenue}조원</p><small>전년 동기 대비 +{SHEP_Q2_GROWTH.yoyRevenue}%</small></article>
      <article class="op-card"><strong>2분기 영업이익</strong><p>{SHEP_Q2.operatingProfit}조원</p><small>전년 동기 대비 +{SHEP_Q2_GROWTH.yoyOperatingProfit}%</small></article>
      <article class="op-card"><strong>상반기 영업이익</strong><p>{SHEP_H1.operatingProfit.toFixed(2)}조원</p><small>2025년 연간의 약 {SHEP_H1_VS_FY2025_MULTIPLE.toFixed(2)}배</small></article>
      <article class="op-card"><strong>영업이익률</strong><p>{SHEP_Q2.operatingMargin}%</p><small>분기 기준 역대 최고 수준</small></article>
    </div>

    <InfoNotice
      title="데이터 기준 안내 (중요)"
      lines={[
        SHEP_META.dataNote,
        "PS 지급방식(현금·자사주 비율)은 2026년 7월 기준 노사 교섭 쟁점으로 진행 중이며 확정되지 않았습니다.",
      ]}
    />

    <!-- 섹션 1: 2분기 실적 한눈에 보기 -->
    <section class="op-section">
      <h2>2분기 실적 한눈에 보기</h2>
      <table class="shep-quarter-table">
        <thead><tr><th>항목</th><th>2026 Q2</th><th>전분기 대비</th><th>전년 동기 대비</th></tr></thead>
        <tbody>
          <tr><td>매출</td><td>{SHEP_Q2.revenue}조원</td><td>+{SHEP_Q2_GROWTH.qoqRevenue}%</td><td>+{SHEP_Q2_GROWTH.yoyRevenue}%</td></tr>
          <tr><td>영업이익</td><td>{SHEP_Q2.operatingProfit}조원</td><td>+{SHEP_Q2_GROWTH.qoqOperatingProfit}%</td><td>+{SHEP_Q2_GROWTH.yoyOperatingProfit}%</td></tr>
          <tr><td>영업이익률</td><td>{SHEP_Q2.operatingMargin}%</td><td>+{SHEP_Q2_GROWTH.qoqMarginPointDiff}%p</td><td>+{SHEP_Q2_GROWTH.yoyMarginPointDiff}%p</td></tr>
        </tbody>
      </table>
      <p class="op-message">참고(1분기 실적): 매출 {SHEP_Q1.revenue}조원, 영업이익 {SHEP_Q1.operatingProfit}조원, 영업이익률 {SHEP_Q1.operatingMargin}% — 분기 기준 사상 최대 기록을 4분기 연속 경신 중입니다.</p>
      <p class="op-message"><small>{SHEP_NET_PROFIT_NOTE.label}. {SHEP_NET_PROFIT_NOTE.caption}</small></p>
    </section>

    <!-- 섹션 2: 상반기 vs 작년 연간 ★ -->
    <section class="op-section">
      <h2>상반기 실적은 작년 연간의 몇 배인가</h2>
      <div class="shep-multiple-card">
        <small>2026년 상반기 영업이익 ÷ 2025년 연간 영업이익</small>
        <strong>약 {SHEP_H1_VS_FY2025_MULTIPLE.toFixed(2)}배</strong>
        <small>{SHEP_H1.operatingProfit.toFixed(2)}조원 ÷ {SHEP_FY2025_OPERATING_PROFIT}조원</small>
      </div>
      <p class="op-message">반기 실적만으로 이미 전년 연간 실적의 2배를 넘어섰다는 것은 2026년 실적 기준 PS 재원이 전년 대비 큰 폭으로 늘어날 가능성을 시사합니다. 다만 하반기 흐름에 따라 연간 최종 실적은 달라질 수 있습니다.</p>
    </section>

    <!-- 섹션 3: 컨센서스 갭 -->
    <section class="op-section">
      <h2>5월 컨센서스는 얼마나 빗나갔나</h2>
      <div class="shep-consensus-card">
        <p>2026년 2분기 영업이익 {SHEP_Q2.operatingProfit}조원은 {SHEP_CONSENSUS.asOf} 시점 연간 컨센서스 {SHEP_CONSENSUS.annualOperatingProfit}조원의 약 {(SHEP_CONSENSUS_GAP.q2ToConsensusRatio * 100).toFixed(1)}%에 해당합니다.</p>
        <p>상반기 누적 영업이익은 약 {SHEP_H1.operatingProfit.toFixed(1)}조원으로, 5월 당시 연간 전망치를 이미 약 {SHEP_CONSENSUS_GAP.h1ExcessAmount.toFixed(1)}조원({(SHEP_CONSENSUS_GAP.h1ExcessRatio * 100).toFixed(1)}%) 넘어섰습니다.</p>
        <p class="op-message"><small>다만 이는 5월 시점 컨센서스와의 비교일 뿐입니다. 실적 발표 이후 증권사 전망치는 상향 조정될 수 있으며, 하반기 메모리 가격·출하량·재고 조정에 따라 실제 연간 실적은 달라질 수 있습니다.</small></p>
      </div>
    </section>

    <!-- 섹션 4: PS 산정 구조 -->
    <section class="op-section">
      <h2>PS 산정 구조</h2>
      <table class="shep-ps-structure-table">
        <tbody>
          <tr><td>PS 재원 기준</td><td>연간 영업이익의 {SHEP_PS_BASELINE.fundRatioOfOperatingProfit}%를 재원으로 활용</td></tr>
          <tr><td>지급 시점</td><td>연간 실적 확정 후 익년 초 — 2026년 실적분은 2027년 초</td></tr>
          <tr><td>지급 방식(현재 기준)</td><td>산정액의 {SHEP_PS_BASELINE.immediateRatio * 100}% 당해 현금, 나머지 {(SHEP_PS_BASELINE.deferredRatioYear1 + SHEP_PS_BASELINE.deferredRatioYear2) * 100}%는 2년 이연</td></tr>
          <tr><td>2026년 초 실제 지급 사례</td><td>2025년 실적(영업이익 {SHEP_PS_BASELINE.operatingProfit}조원) 기준 PS 기준급 {SHEP_PS_BASELINE.psRate}%</td></tr>
        </tbody>
      </table>
      <p class="op-message"><small>주의: 기준급 {SHEP_PS_BASELINE.psRate}%는 "연봉의 {(SHEP_PS_BASELINE.psRate / 100).toFixed(2)}배"가 아니라 기준급(통상 연봉의 1/20 수준) 기준 {SHEP_PS_BASELINE.psRate}%입니다.</small></p>
    </section>

    <!-- 섹션 5: 2027년 초 지급 PS 시나리오 ★ 핵심 -->
    <section class="op-section">
      <h2>2027년 초 지급 PS 시나리오</h2>
      <table class="shep-scenario-summary">
        <thead><tr><th>시나리오</th><th>2026년 연간 영업이익 전망</th><th>PS 방향성</th></tr></thead>
        <tbody>
          {SHEP_PS_SCENARIO_RESULTS.map((s) => (
            <tr>
              <td>{s.label}</td>
              <td>약 {s.annualOperatingProfit.toFixed(1)}조원</td>
              <td>{s.id === "conservative" && "2026년 초 지급률을 크게 상회할 가능성"}
                  {s.id === "base" && "기존 지급률의 3배 안팎 가능성"}
                  {s.id === "bull" && "지급 구조(현금·자사주 비율) 변경 여부가 핵심 변수"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <details class="shep-scenario-detail">
        <summary>단순 비례 환산 배수 보기</summary>
        <table class="shep-scenario-summary">
          <thead><tr><th>시나리오</th><th>하반기 가정</th><th>연간 영업이익</th><th>단순 비례 PS(참고치)</th></tr></thead>
          <tbody>
            {SHEP_PS_SCENARIO_RESULTS.map((s) => (
              <tr>
                <td>{s.label}</td>
                <td>상반기의 {(s.h2ToH1Ratio * 100).toFixed(0)}%</td>
                <td>약 {s.annualOperatingProfit.toFixed(1)}조원</td>
                <td>약 {s.estimatedPsRate.toLocaleString()}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p class="shep-scenario-detail__caption">위 PS 배수는 2025년 영업이익과 2026년 초 실제 지급률 간 관계를 단순 비례 적용한 참고치입니다. 실제 지급률은 대상 인원, 기준급 총액, 노사 합의 및 지급방식(아래 섹션 참고)에 따라 크게 달라질 수 있습니다.</p>
      </details>

      <p class="op-message"><small>총 PS 산정액(예상) 분할: 2027년 초 즉시 지급 {SHEP_PS_BASELINE.immediateRatio * 100}% · 2028년 이연 {SHEP_PS_BASELINE.deferredRatioYear1 * 100}% · 2029년 이연 {SHEP_PS_BASELINE.deferredRatioYear2 * 100}%</small></p>

      <div class="shep-cta-group">
        <a href={withBase("/tools/sk-hynix-bonus/")}>내 연봉으로 2027년 PS 계산하기 →</a>
      </div>
    </section>

    <!-- 섹션 6: 지급방식 개편 리스크 ★ 신규 -->
    <section class="op-section">
      <h2>실적보다 더 중요한 변수: PS 지급방식이 바뀔까</h2>
      <div class="shep-payout-risk-box">
        <span class="shep-payout-risk-box__status">{SHEP_PAYOUT_RISK.status}</span>
        <p>SK하이닉스는 2025년 노사 합의로 "영업이익 10% 연동 PS" 체계를 도입했지만, 2026년 7월 임금·단체협상에서 PS 재원 기준은 유지하되 지급 방식 일부를 현금에서 자사주로 전환하는 방안이 사측 제안으로 거론되고 있습니다. 노조는 세금 부담과 현금화 문제 등을 이유로 반발 중이며, {SHEP_PAYOUT_RISK.asOf} 기준 확정되지 않은 진행 중인 협상 쟁점입니다.</p>
      </div>
      <table class="shep-payout-variable-table">
        <thead><tr><th>변수</th><th>현재 알려진 내용</th><th>영향</th></tr></thead>
        <tbody>
          {SHEP_PAYOUT_VARIABLES.map((v) => (
            <tr><td>{v.variable}</td><td>{v.current}</td><td>{v.impact}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 7: 하반기 변수 체크리스트 -->
    <section class="op-section">
      <h2>PS를 좌우할 하반기 변수</h2>
      <ul class="shep-checklist">
        {SHEP_CHECKPOINTS.map((c) => <li class="shep-checklist__item">{c.text}</li>)}
      </ul>
    </section>

    <!-- 섹션 8: 삼성전자 비교 딥링크 -->
    <section class="op-section">
      <h2>삼성전자와 비교하면?</h2>
      <p class="op-message">삼성전자는 7월 31일 2분기 확정실적(사업부문별 영업이익)을 발표할 예정입니다. SK하이닉스·삼성전자 실적·성과급 상세 비교는 아래에서 확인하세요.</p>
      <div class="shep-cta-group">
        <a href={withBase("/reports/samsung-vs-skhynix-earnings-bonus-2026/")}>삼성전자 vs SK하이닉스 성과급 2026 비교 →</a>
      </div>
    </section>

    <!-- 섹션 9: 업데이트 로그 -->
    <section class="op-section">
      <h2>업데이트 로그</h2>
      <ul class="shep-update-log">
        {SHEP_UPDATE_LOG.map((log) => (
          <li class="shep-update-log__item" data-status={log.status}>{log.date} — {log.note} ({log.status})</li>
        ))}
      </ul>
    </section>

    <SeoContent
      introTitle="SK하이닉스 2분기 실적·2027년 PS 전망 핵심 정리"
      intro={SHEP_SEO_INTRO}
      criteria={SHEP_SEO_CRITERIA}
      faq={SHEP_FAQ}
      related={SHEP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "sk-hynix-earnings-ps-outlook-2026",
  title: "SK하이닉스 2분기 실적·PS 전망 2026 | 2027 성과급 얼마나 될까",
  order: 67,
  badges: ["SK하이닉스", "성과급", "실적 발표", "2026"],
},
```

## 8-1. index.astro `reportMetaBySlug` 등록 (누락 시 "기타"로 표시됨 — 필수)

```ts
"sk-hynix-earnings-ps-outlook-2026": { category: "bonus", isNew: true },
```

---

## 9. app.scss import

```scss
@use 'scss/pages/sk-hynix-earnings-ps-outlook-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-earnings-ps-outlook-2026/</loc>
  <lastmod>2026-07-29</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.85</priority>
</url>
```

`changefreq: weekly` — 3분기(10월)·연간 확정(익년 1~2월) 등 분기마다 실제 수치 갱신이 예정돼 있어 `samsung-q2-earnings-bonus-outlook-2026`과 동일하게 잦은 갱신을 signal한다.

---

## 11. 내부 CTA 전체 목록 (목적별 3단)

| 단계 | 위치 | 문구 | href |
|---|---|---|---|
| 1차(계산) | 섹션 5 하단 | 내 연봉으로 2027년 PS 계산하기 | `/tools/sk-hynix-bonus/` |
| 2차(세후) | SeoContent related | 성과급 세후 실수령액 계산기 | `/tools/bonus-after-tax-calculator/` |
| 3차(비교) | 섹션 8 하단 | 삼성전자 vs SK하이닉스 성과급 2026 비교 | `/reports/samsung-vs-skhynix-earnings-bonus-2026/` |
| 3차(비교) | SeoContent related | SK하이닉스 2027 성과급 전망 | `/reports/sk-hynix-bonus-2027/` |
| 3차(비교) | SeoContent related | 삼성전자·SK하이닉스 800조 투자 비교 | `/reports/samsung-skhynix-800t-investment-comparison-2026/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] `psMultipliersByYear`(기존 skHynixCompensation.ts)를 이 리포트에서 import·재사용하지 않는지 확인 — 이번 리포트는 독자적 신규 추정 모델(§3) 사용
- [ ] 본문 전체에서 "연말 PS"/"2026 PS" 등 지급연도 혼동 표현이 없는지 검수 — "2026년 실적 기준, 2027년 초 지급 PS"로 통일
- [ ] 섹션 5 PS 배수는 기본 요약 표(방향성 텍스트) → `<details>` 상세보기(구체 %) 2단계 노출 구조 유지, 8,000%+ 숫자를 첫 화면에 바로 노출하지 않음
- [ ] 섹션 6(지급방식 개편 리스크)이 "바뀐다"가 아니라 "바뀔 수 있다/미확정"으로 서술됐는지 확인
- [ ] 순이익(93.9조원)은 Hero KPI에서 제외하고, 섹션 1 표 하단 각주로만 노출 확인
- [ ] `SHEP_H1_VS_FY2025_MULTIPLE`, `SHEP_CONSENSUS_GAP` 등 계산값이 하드코딩이 아닌 실제 계산식 결과인지 확인 (기획 문서 수치와 일치: 2.08배, 78.5%, +21.1조/+27.3%)
- [ ] 업데이트 로그(섹션 9) 페이지 하단 고정 배치 및 `data-status` 별 스타일 구분 확인
- [ ] 내부 CTA 목적별 3단 구성(계산/세후/비교) 확인, 과다 CTA 나열 지양
- [ ] InfoNotice에 지급방식 협의 중 문구 포함 확인
- [ ] `reportMetaBySlug`에 슬러그 등록 확인 (누락 시 홈 화면 "기타" 카테고리로 표시되는 사고 방지)
- [ ] 모바일에서 KPI 4카드 → 2열 → 1열 전환 확인
- [ ] `npm run build` 통과, 라우트 `/reports/sk-hynix-earnings-ps-outlook-2026/` 존재 확인

---

## 13. 배포 및 갱신 일정

| 시점 | 작업 |
|---|---|
| 1차 배포 | 2026-07-29~30 이내 — 실적 카드·상반기 비교·컨센서스 갭·PS 산정구조·신규 시나리오·지급방식 리스크·계산기 CTA 전부 포함해서 배포 |
| 후속 갱신 1 | 2026-07-31 삼성전자 확정실적 발표 후 섹션 8 딥링크·상호 링크 강화 |
| 후속 갱신 2 | PS 지급방식 노사 교섭 결론 시 섹션 6·업데이트 로그(섹션 9) 갱신 |
| 후속 갱신 3 | 2026-10 3분기 실적 반영 — `SHEP_Q1`/`SHEP_Q2` 자리에 `SHEP_Q3` 추가, 컨센서스·시나리오 재계산, URL 그대로 유지 |
| 후속 갱신 4 | 2027-01~02 연간 확정실적·실제 PS 지급률 반영 — 다음 연도 리포트 신규 슬러그(`sk-hynix-earnings-ps-outlook-2027`) 분리 검토 |
