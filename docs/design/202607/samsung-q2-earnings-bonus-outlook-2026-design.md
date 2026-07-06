# 삼성전자 2분기 실적 vs 하반기 성과급(OPI) 전망 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/samsung-q2-earnings-bonus-outlook-2026-plan.md`](../../plan/202607/samsung-q2-earnings-bonus-outlook-2026-plan.md)
> 작성일: 2026-07-06
> 유형: 정보성 리포트 (`/reports/`), 정적 페이지 (JS 계산 없음)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/samsungQ2EarningsBonusOutlook2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 페이지 | `src/pages/reports/samsung-q2-earnings-bonus-outlook-2026.astro` |
| 스크립트 | (없음 — 정적 리포트. 계산은 기존 `/tools/samsung-bonus/`로 위임) |
| 스타일 | `src/styles/scss/pages/_samsung-q2-earnings-bonus-outlook-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `sqe-` (Samsung Q2 Earnings), `.op-page`/`.report-page` 공유 클래스 위에 얹는 방식 — `samsung-vs-skhynix-earnings-bonus-2026.astro`(`sevb-` 프리픽스)와 동일한 실제 구현 패턴을 따른다. `samsung-skhynix-800t...` 설계 문서의 완전 독립 커스텀 토큰 방식보다, 형제 리포트(`sevb-page`)와 톤을 맞추는 이 방식이 이 사이트의 실제 운영 패턴에 더 가깝다.

---

## 2. URL 및 메타

```
슬러그: /reports/samsung-q2-earnings-bonus-outlook-2026/
타이틀(seoTitle): 삼성전자 2분기 실적 성과급 전망 2026 | 하반기 OPI 얼마나 늘까
디스크립션: 삼성전자 2026년 2분기 잠정실적(7/8)·확정실적(7/31) 발표 일정과 DS부문 영업이익 전망을 바탕으로 하반기 OPI 변화를 분석합니다. 성과급 계산기 연동.
```

---

## 3. 데이터 파일 설계

**`src/data/samsungQ2EarningsBonusOutlook2026.ts`**

기존 `samsungCompensation.ts`의 `divisions`, `scenarioPresets`, `operatingProfitScenarios`, `unionDemandScenarios`를 **import해서 재사용**한다. 이 파일에서 OPI/TAI 비율이나 컨센서스 수치를 새로 정의하지 않는다 — 두 파일 간 수치 불일치를 막기 위함(`samsungVsSkhynixEarningsBonus2026.ts`가 실적 자료와 성과급 비율 자료를 "서로 다른 출처이므로 곱해서 새 숫자를 만들지 않는다"고 명시한 것과 동일한 원칙).

```ts
import {
  divisions as samsungDivisions,
  scenarioPresets,
  operatingProfitScenarios,
  unionDemandScenarios,
  rankPresets,
} from "./samsungCompensation";

// ── 타입 ──────────────────────────────────────────

export type EarningsCalendarStatus = "완료" | "예정" | "미정";

export type EarningsCalendarItem = {
  date: string;            // "2026-07-08"
  dateLabel: string;       // "2026년 7월 8일"
  event: string;           // "2분기 잠정실적 발표"
  scope: string;           // 공개 범위 설명
  status: EarningsCalendarStatus;
};

export type ProgressCard = {
  label: string;
  value: string;
  note: string;
  isPlaceholder: boolean;  // true면 실제 공시 전 추정/미확정 표시
};

export type OpiStructureRow = {
  item: string;            // "OPI" | "TAI"
  basis: string;           // 산정 기준 설명
  capLabel: string;        // 지급 한도
  sourceNote: string;      // 참조 출처 (기존 samsungCompensation.ts 재사용 명시)
};

export type ScenarioOutlookRow = {
  scenarioCode: "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
  scenarioLabel: string;
  assumption: string;      // 가정 설명
  dsOpiRange: string;      // "30% 내외" 등 — samsungDivisions DS.scenarioRates 참조
};

export type CheckpointItem = {
  order: number;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

// ── 데이터 ────────────────────────────────────────

export const SQE_META = {
  slug: "samsung-q2-earnings-bonus-outlook-2026",
  title: "삼성전자 2분기 실적 vs 성과급 전망 2026",
  seoTitle: "삼성전자 2분기 실적 성과급 전망 2026 | 하반기 OPI 얼마나 늘까",
  seoDescription:
    "삼성전자 2026년 2분기 잠정실적(7/8)·확정실적(7/31) 발표 일정과 DS부문 영업이익 전망을 바탕으로 하반기 OPI 변화를 분석합니다. 성과급 계산기 연동.",
  description: "7월 실적 발표 일정부터 하반기 OPI 전망까지 한눈에 정리하는 리포트입니다.",
  updatedAt: "2026-07-06",
  dataNote:
    "이 페이지의 하반기 성과급 전망은 컨센서스·시나리오 기준 추정이며 공식 확정 발표가 아닙니다. 확정실적(7/31) 발표 이후 실제 DS부문 수치로 업데이트됩니다. 실적 전망 수치는 기존 '삼성전자 DS 성과급 계산기' 데이터(samsungCompensation.ts)와 동일 출처를 그대로 인용하며, 서로 다른 시점 자료를 곱해 새 숫자를 만들지 않습니다.",
};

export const SQE_EARNINGS_CALENDAR: EarningsCalendarItem[] = [
  {
    date: "2026-07-08",
    dateLabel: "2026년 7월 8일",
    event: "2분기 잠정실적 발표",
    scope: "연결 매출·영업이익만 공개 (사업부문별 미공개)",
    status: "예정",
  },
  {
    date: "2026-07-31",
    dateLabel: "2026년 7월 31일",
    event: "2분기 확정실적 발표",
    scope: "DS·MX·CSS 등 사업부문별 영업이익 공개 — OPI 추정 근거 확정",
    status: "예정",
  },
  {
    date: "2026-10-08",
    dateLabel: "2026년 10월 8일(참고)",
    event: "3분기 잠정실적 발표",
    scope: "연결 기준 (참고용, 확정 일정 아님)",
    status: "미정",
  },
];

// ⚠️ 구현 시점에 1Q26 확정치·2Q26 잠정치가 실제 공시되면 아래 placeholder를 교체할 것.
// isPlaceholder: true인 카드는 "미확정" 배지를 달고, 실제 수치 없이는 확정 톤으로 쓰지 않는다.
export const SQE_PROGRESS_CARDS: ProgressCard[] = [
  {
    label: "2026 연간 컨센서스 영업이익",
    value: "약 297.5조원",
    note: "에프앤가이드 컨센서스 보도 기준 (operatingProfitScenarios.FY2026_CONSENSUS 재사용)",
    isPlaceholder: false,
  },
  {
    label: "1분기 확정실적",
    value: "발표 대기",
    note: "구현 시 1Q26 확정 공시 수치로 교체 필요",
    isPlaceholder: true,
  },
  {
    label: "상반기 누적 진행률",
    value: "발표 대기",
    note: "1Q 확정치 + 2Q 잠정치 합산 후 연간 컨센서스 대비 진행률 계산 (구현 시 채움)",
    isPlaceholder: true,
  },
];

export const SQE_OPI_STRUCTURE: OpiStructureRow[] = [
  {
    item: "OPI (초과이익분배금)",
    basis: "사업부문별 연간 영업이익이 목표를 초과할 때 기준급 대비 지급",
    capLabel: "최대 50% 한도 (DS 2026 실제 참고 47%)",
    sourceNote: "samsungCompensation.ts > divisions 재사용",
  },
  {
    item: "TAI (목표달성장려금)",
    basis: "반기별 매출·영업이익 목표 초과 달성 시 지급",
    capLabel: "최대 100% (상하반기 별도 산정)",
    sourceNote: "samsungCompensation.ts > scenarioPresets 재사용",
  },
];

// scenarioRates.DS 값을 그대로 라벨링해서 보여준다 (새 숫자 생성 금지)
export const SQE_SCENARIO_OUTLOOK: ScenarioOutlookRow[] = [
  { scenarioCode: "CONSERVATIVE", scenarioLabel: "보수적", assumption: "반도체 업황 정체", dsOpiRange: "30% 내외" },
  { scenarioCode: "BASE", scenarioLabel: "기준", assumption: "컨센서스 수준 실적", dsOpiRange: "40~47%" },
  { scenarioCode: "AGGRESSIVE", scenarioLabel: "공격적", assumption: "HBM·파운드리 동반 개선", dsOpiRange: "50% 근접" },
];

export const SQE_CHECKPOINTS: CheckpointItem[] = [
  { order: 1, text: "7/8 잠정실적 연결 영업이익이 컨센서스(297.5조 페이스) 상회 여부" },
  { order: 2, text: "7/31 확정실적에서 DS부문 영업이익 실제 비중" },
  { order: 3, text: "HBM3E 인증·공급 진행 상황 (파운드리 적자 축소 여부)" },
  { order: 4, text: "하반기 TAI 지급 기준일 공지 시점" },
  { order: 5, text: "노사협의체 성과급 관련 논의 일정" },
];

export const SQE_PRECEDENT_NOTE =
  "2026년 5월 잠정합의안(OPI 1.5% + DS 특별경영성과급 10.5% = 최대 12%)은 2025년 실적을 기준으로 도출된 전례입니다. 하반기도 '실적 확정 → 노사 협의 → 지급률 확정' 흐름을 따를 가능성이 높지만, 지금은 방향성만 가늠할 수 있는 단계입니다.";

export const SQE_FAQ: FaqItem[] = [
  { question: "2분기 실적은 언제 발표되나요?", answer: "잠정실적은 7월 8일, 사업부문별 확정실적은 7월 31일 발표 예정입니다." },
  { question: "잠정실적과 확정실적은 뭐가 다른가요?", answer: "잠정실적은 연결 매출·영업이익만 공개하고, 확정실적에서 DS·MX 등 사업부문별 영업이익이 공개됩니다." },
  { question: "실적이 좋으면 성과급이 바로 오르나요?", answer: "아닙니다. 연간 실적 확정 후 익년 초에 확정 지급되는 것이 원칙이며, 반기 TAI는 상대적으로 빠르게 반영됩니다." },
  { question: "DS부문 실적이 왜 중요한가요?", answer: "DS(반도체)부문 영업이익이 삼성전자 전체 성과급 재원의 핵심 변수이기 때문입니다." },
  { question: "하반기 확정 성과급은 언제 알 수 있나요?", answer: "통상 다음 해 1월경 공식 지급률이 공지됩니다." },
];

export const SQE_SEO_INTRO = [
  "삼성전자는 2026년 7월 8일 2분기 잠정실적을, 7월 31일 사업부문별 확정실적을 발표합니다. DS(반도체)부문 영업이익은 OPI 산정의 핵심 변수라, 실적 발표 시즌마다 재직자의 '성과급이 오를까' 관심이 집중됩니다.",
];

export const SQE_SEO_CRITERIA = [
  "2분기 잠정실적: 7월 8일, 연결 매출·영업이익만 공개",
  "2분기 확정실적: 7월 31일, DS부문 등 사업부문별 영업이익 공개",
  "OPI는 사업부문 초과이익 발생 시 기준급 대비 최대 50% 한도 지급 (DS 2026 실제 참고 47%)",
  "모든 하반기 전망 수치는 컨센서스·시나리오 기준 추정이며 공식 발표가 아님",
];

export const SQE_RELATED_LINKS = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 DS 성과급 계산기", description: "내 직급·사업부 기준 예상 성과급을 바로 계산합니다." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에서 세금을 제외한 실수령액을 확인합니다." },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026", description: "2026~2028년 연간 실적·성과급 시나리오를 두 회사로 비교합니다." },
  { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성전자 DS 성과급 완전 가이드", description: "OPI·TAI 산정 구조를 처음부터 자세히 설명합니다." },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교", description: "반도체 메가 투자가 장기 실적·성과급에 미칠 영향을 다룹니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 실적 발표 시즌
 └─ title: 삼성전자 2분기 실적 vs 성과급 전망 2026
 └─ description: 7월 실적 발표 일정부터 하반기 OPI 전망까지 한눈에 정리

InfoNotice (면책 배너 — title + lines, 실제 컴포넌트 시그니처 기준)
 └─ dataNote, "실적 자료와 성과급 비율은 서로 다른 출처이므로 곱해 새 숫자를 만들지 않음", "이직·투자 추천 아님"

섹션 1 — 2분기 실적 발표 캘린더 ★ 시의성 앵커 (타임라인 카드 3개)
섹션 2 — 연간 컨센서스 대비 상반기 진행률 (KPI 카드 3개, placeholder 배지 포함)
섹션 3 — DS부문 실적이 성과급에 미치는 구조 (OPI/TAI 설명 2단 카드)
섹션 4 — 시나리오별 하반기 OPI 전망 ★ 핵심 (비교표 + CTA)
섹션 5 — SK하이닉스와 비교하면? (요약 카드 1개 + 딥링크, 중복 회피)
섹션 6 — 재직자 체크포인트 (체크리스트 5개)
섹션 7 — 과거 실적 발표 후 성과급 반응 패턴 (해석 카드 1개)
SeoContent (FAQ + 관련 링크)
```

REPORT_CONTENT_GUIDE.md의 권장 IA(Hero → 참고문구 → Overview → 선택/탭 → 분포 → 패턴분석 → FAQ → 관련링크)를 따르되, 이 리포트는 "선택 UI"가 없는 정적 캘린더+해석형이라 4번(select/tabs) 단계를 생략한다 — 시나리오 비교는 표로, 실제 개인화 계산은 기존 `/tools/samsung-bonus/`로 위임한다(계산기 중복 구현 방지).

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 | 실제 Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero 섹션 | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title: string`, `lines: string[]` (children 방식 아님 — `samsung-vs-skhynix-earnings-bonus-2026.astro`와 동일하게 사용) |
| `SeoContent.astro` | SEO 텍스트 + FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 페이지 전용 마크업 (인라인, `sqe-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.sqe-page` | 페이지 루트 스코프 (로컬 CSS 변수 정의) |
| `.sqe-calendar-grid` | 섹션 1 — 실적 발표 캘린더 3-카드 |
| `.sqe-calendar-card` | 개별 캘린더 카드, `status`별 배지 색상 |
| `.sqe-progress-grid` | 섹션 2 — KPI 카드 3개 |
| `.sqe-progress-card--placeholder` | 미확정(placeholder) 카드 스타일 (점선 테두리 등으로 시각 구분) |
| `.sqe-structure-table` | 섹션 3 — OPI/TAI 구조 표 |
| `.sqe-scenario-table` | 섹션 4 — 시나리오별 전망 표 |
| `.sqe-cta-group` | 내부 CTA 버튼 묶음 (기존 `sevb-related-card`류와 톤 통일) |
| `.sqe-hynix-compare-card` | 섹션 5 — SK하이닉스 비교 요약 카드 |
| `.sqe-checklist` | 섹션 6 — 체크리스트 |
| `.sqe-precedent-card` | 섹션 7 — 과거 패턴 해석 카드 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_samsung-q2-earnings-bonus-outlook-2026.scss`

`.op-page` 공유 클래스(`_opportunities-202605.scss`에 정의된 `.op-section`, `.op-message`, `.op-table-wrap` 등)를 베이스로 얹고, 페이지 고유 로컬 변수만 최소한으로 추가한다. `samsung-vs-skhynix-earnings-bonus-2026`(`sevb-page`)와 동일한 실제 운영 패턴.

```scss
.sqe-page {
  --sqe-ink: #172033;
  --sqe-muted: #667085;
  --sqe-line: #d8e0ea;
  --sqe-primary: #1a56db;
  --sqe-done: #059669;
  --sqe-pending: #d97706;
  --sqe-unknown: #94a3b8;

  .sqe-calendar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  .sqe-calendar-card {
    border: 1px solid var(--sqe-line);
    border-radius: 12px;
    padding: 1rem;

    &[data-status="완료"] { border-top: 3px solid var(--sqe-done); }
    &[data-status="예정"] { border-top: 3px solid var(--sqe-pending); }
    &[data-status="미정"] { border-top: 3px solid var(--sqe-unknown); }
  }

  .sqe-progress-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  .sqe-progress-card--placeholder {
    border: 1px dashed var(--sqe-line);
    background: transparent;
  }

  .sqe-structure-table,
  .sqe-scenario-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--sqe-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .sqe-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .sqe-checklist {
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
  SQE_META,
  SQE_EARNINGS_CALENDAR,
  SQE_PROGRESS_CARDS,
  SQE_OPI_STRUCTURE,
  SQE_SCENARIO_OUTLOOK,
  SQE_CHECKPOINTS,
  SQE_PRECEDENT_NOTE,
  SQE_FAQ,
  SQE_SEO_INTRO,
  SQE_SEO_CRITERIA,
  SQE_RELATED_LINKS,
} from "../../data/samsungQ2EarningsBonusOutlook2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SQE_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SQE_META.title,
    description: SQE_META.seoDescription,
    dateModified: SQE_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SQE_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SQE_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SQE_META.seoTitle} description={SQE_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page sqe-page" data-report="samsung-q2-earnings-bonus-outlook-2026">
    <CalculatorHero
      eyebrow="실적 발표 시즌"
      title={SQE_META.title}
      description={SQE_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내 (중요)"
      lines={[
        SQE_META.dataNote,
        "확정실적(7/31) 발표 전까지 하반기 전망은 컨센서스·시나리오 기준 추정입니다.",
      ]}
    />

    <!-- 섹션 1: 실적 발표 캘린더 -->
    <section class="op-section">
      <h2>2분기 실적 발표 캘린더</h2>
      <div class="sqe-calendar-grid">
        {SQE_EARNINGS_CALENDAR.map((item) => (
          <article class="sqe-calendar-card" data-status={item.status}>
            <strong>{item.dateLabel}</strong>
            <p>{item.event}</p>
            <small>{item.scope}</small>
          </article>
        ))}
      </div>
      <p class="op-message">잠정실적은 사업부문별 실적을 공개하지 않으므로, 성과급 근거를 확인하려면 7/31 확정실적을 봐야 합니다.</p>
    </section>

    <!-- 섹션 2: 상반기 진행률 -->
    <section class="op-section">
      <h2>연간 컨센서스 대비 상반기 진행률</h2>
      <div class="sqe-progress-grid">
        {SQE_PROGRESS_CARDS.map((card) => (
          <article class={`op-card ${card.isPlaceholder ? "sqe-progress-card--placeholder" : ""}`}>
            <strong>{card.label}</strong>
            <p>{card.value}</p>
            <small>{card.note}</small>
            {card.isPlaceholder && <span class="op-badge">미확정</span>}
          </article>
        ))}
      </div>
    </section>

    <!-- 섹션 3: OPI/TAI 구조 -->
    <section class="op-section">
      <h2>DS부문 실적이 성과급에 미치는 구조</h2>
      <table class="sqe-structure-table">
        <thead><tr><th>구분</th><th>산정 기준</th><th>지급 한도</th></tr></thead>
        <tbody>
          {SQE_OPI_STRUCTURE.map((row) => (
            <tr><td>{row.item}</td><td>{row.basis}</td><td>{row.capLabel}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 4: 시나리오별 전망 ★ -->
    <section class="op-section">
      <h2>시나리오별 하반기 OPI 전망</h2>
      <table class="sqe-scenario-table">
        <thead><tr><th>시나리오</th><th>가정</th><th>DS부문 예상 OPI</th></tr></thead>
        <tbody>
          {SQE_SCENARIO_OUTLOOK.map((row) => (
            <tr><td>{row.scenarioLabel}</td><td>{row.assumption}</td><td>{row.dsOpiRange}</td></tr>
          ))}
        </tbody>
      </table>
      <div class="sqe-cta-group">
        <a href={withBase("/tools/samsung-bonus/")}>삼성전자 DS 성과급 계산기로 내 예상 수령액 계산 →</a>
      </div>
    </section>

    <!-- 섹션 5: SK하이닉스 비교 딥링크 -->
    <section class="op-section">
      <h2>SK하이닉스와 비교하면?</h2>
      <p class="op-message">SK하이닉스는 HBM 호실적을 바탕으로 이미 OPI 상한에 근접했다는 평가가 나옵니다. 삼성전자·SK하이닉스 실적·성과급 상세 비교는 아래에서 확인하세요.</p>
      <div class="sqe-cta-group">
        <a href={withBase("/reports/samsung-vs-skhynix-earnings-bonus-2026/")}>삼성전자 vs SK하이닉스 성과급 2026 비교 →</a>
      </div>
    </section>

    <!-- 섹션 6: 체크포인트 -->
    <section class="op-section">
      <h2>재직자 체크포인트</h2>
      <ul class="sqe-checklist">
        {SQE_CHECKPOINTS.map((c) => <li class="sqe-checklist__item">{c.text}</li>)}
      </ul>
    </section>

    <!-- 섹션 7: 과거 패턴 -->
    <section class="op-section">
      <h2>과거 실적 발표 후 성과급 반응 패턴</h2>
      <p class="sqe-precedent-card op-message">{SQE_PRECEDENT_NOTE}</p>
    </section>

    <SeoContent
      introTitle="삼성전자 2분기 실적·하반기 성과급 핵심 정리"
      intro={SQE_SEO_INTRO}
      criteria={SQE_SEO_CRITERIA}
      faq={SQE_FAQ}
      related={SQE_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "samsung-q2-earnings-bonus-outlook-2026",
  title: "삼성전자 2분기 실적 성과급 전망 2026 | 하반기 OPI 얼마나 늘까",
  order: 66,
  badges: ["삼성전자", "성과급", "실적 발표", "2026"],
},
```

## 8-1. index.astro `reportMetaBySlug` 등록 (누락 시 "기타"로 표시됨 — 필수)

```ts
"samsung-q2-earnings-bonus-outlook-2026": { category: "bonus", isNew: true },
```

---

## 9. app.scss import

```scss
@use 'scss/pages/samsung-q2-earnings-bonus-outlook-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-q2-earnings-bonus-outlook-2026/</loc>
  <lastmod>2026-07-06</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.85</priority>
</url>
```

`changefreq: weekly`로 설정 — 7/8, 7/31 두 차례 실제 수치 업데이트가 예정돼 있어 `samsung-vs-skhynix-earnings-bonus-2026`(weekly)과 동일하게 잦은 갱신을 signal한다.

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 4 하단 | 삼성전자 DS 성과급 계산기로 내 예상 수령액 계산 | `/tools/samsung-bonus/` |
| 섹션 5 하단 | 삼성전자 vs SK하이닉스 성과급 2026 비교 | `/reports/samsung-vs-skhynix-earnings-bonus-2026/` |
| SeoContent related | 성과급 세후 실수령액 계산기 | `/tools/bonus-after-tax-calculator/` |
| SeoContent related | 삼성전자 DS 성과급 완전 가이드 | `/reports/samsung-ds-bonus-calculation-guide/` |
| SeoContent related | 삼성전자·SK하이닉스 800조 투자 비교 | `/reports/samsung-skhynix-800t-investment-comparison-2026/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] **섹션 2(상반기 진행률)는 1Q26 확정치·2Q26 잠정치 실제 공시 수치가 나오기 전까지 `isPlaceholder: true` 상태로만 배포** — 추정치를 공식 수치처럼 보이게 하지 않는다
- [ ] `samsungCompensation.ts`에서 import한 `divisions`, `scenarioPresets`, `operatingProfitScenarios` 값이 이 리포트와 `samsung-bonus` 계산기·`samsung-vs-skhynix-earnings-bonus-2026`에서 서로 다르게 표시되지 않는지 확인 (단일 출처 원칙)
- [ ] InfoNotice에 "실적 자료와 성과급 비율은 서로 다른 출처이므로 곱해 새 숫자를 만들지 않는다" 문구 포함 확인
- [ ] `.sqe-calendar-card[data-status]`별 색상(완료=green, 예정=amber, 미정=gray) 정상 렌더링 확인
- [ ] `.sqe-progress-card--placeholder`가 시각적으로 "미확정" 상태임을 구분해서 보여주는지 확인 (점선 테두리 + "미확정" 배지)
- [ ] 모바일에서 3-카드 그리드 → 1열 전환 확인
- [ ] 내부 CTA 5개 링크 모두 작동 확인
- [ ] `reportMetaBySlug`에 슬러그 등록 확인 (누락 시 홈 화면 "기타" 카테고리로 표시되는 사고 방지)
- [ ] `npm run build` 통과, 라우트 `/reports/samsung-q2-earnings-bonus-outlook-2026/` 존재 확인

---

## 13. 배포 2단계 일정 (기획 문서 인용)

| 단계 | 시점 | 작업 |
|---|---|---|
| 1차 배포 | 2026-07-08 이전 | 캘린더·구조·시나리오 중심으로 배포. 섹션 2는 placeholder 상태 |
| 2차 업데이트 | 2026-07-31 직후 | 확정실적 DS부문 실제 수치로 섹션 2·4 갱신, `SQE_META.updatedAt` 갱신, sitemap `lastmod` 갱신 |
| 반복 활용 | 10월(3분기), 익년 1월(4분기·연간) | 같은 데이터 파일 구조에 `SQE_EARNINGS_CALENDAR`·`SQE_PROGRESS_CARDS`만 갱신해 재사용 |
