# 손흥민 연봉 2026 LAFC 주급·세후 실수령액·재산 추정 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/son-heung-min-lafc-salary-net-worth-2026`
- **유형**: 리포트
- **prefix**: `shms-`
- **데이터 파일**: `src/data/sonHeungMinLafcSalaryNetWorth2026.ts`
- **기획 문서**: `docs/plan/202606/son-heung-min-lafc-salary-net-worth-2026-plan.md`
- **핵심 목표**:
  - `손흥민 연봉`, `손흥민 주급`, `손흥민 LAFC 연봉`, `손흥민 세후 실수령액` 검색 의도 대응
  - `손흥민 재산`, `손흥민 누적 연봉`, `손흥민이 그동안 번 돈`, `손흥민 광고 수입` 검색 의도 대응
  - 이강인·김민재·월드컵 대표팀 연봉 리포트와 연결해 한국 축구 연봉 클러스터 중심 페이지로 사용
  - 모든 재산·세후·누적 연봉 수치는 공식값이 아니라 추정 또는 시뮬레이션임을 명확히 고지

---

## 2. 화면 구성

```text
[BaseLayout]
  SiteHeader
  main.report-page.shms-page
    CalculatorHero
    InfoNotice

    section.shms-summary
      - KPI 카드 4개
      - 보도 기준 연봉, 세후 추정, 주급, 재산 추정 중심 시나리오

    section.shms-breakdown
      - 연봉/월급/주급/일급/시간급/90분 환산 표

    section.shms-net
      - 미국·캘리포니아 세후율 범위 설명
      - 세후 52~60% 시뮬레이션 카드

    section.shms-career
      - 함부르크·레버쿠젠·토트넘·LAFC 구간별 누적 연봉 추정
      - 커리어 세전 연봉 추정 합계

    section.shms-net-worth
      - 보수적·중간·공격적 재산 추정 시나리오
      - 공식 재산이 아님을 반복 고지

    section.shms-sponsor
      - 광고·스폰서 수입 반영 방식

    section.shms-compare
      - 김민재·손흥민·이강인 연봉 비교 카드/표

    section.shms-links
      - 관련 스포츠 연봉 콘텐츠

    SeoContent
```

---

## 3. 데이터 파일 (`src/data/sonHeungMinLafcSalaryNetWorth2026.ts`)

```ts
export type SalaryEvidenceBadge = "보도 기준" | "추정" | "세후 시뮬레이션" | "재산 추정";
export type PlayerCompareBadge = "보도 기준" | "추정" | "확인 필요";
export type NetWorthScenarioId = "conservative" | "base" | "optimistic";

export interface SalaryExchangeRate {
  code: "USD";
  label: string;
  krwRate: number;
  updatedAt: string;
}

export interface NetRateRange {
  low: number;
  high: number;
  label: string;
  description: string;
}

export interface SonSalaryProfile {
  id: "son-heung-min";
  nameKo: string;
  nameEn: string;
  club: string;
  league: string;
  position: string;
  contractPeriodLabel: string;
  annualSalaryUsd: number;
  sourceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
  sourceUrl: string;
  dataNote: string;
}

export interface SalaryBreakdownItem {
  id: string;
  label: string;
  grossKrw: number;
  netLowKrw: number;
  netHighKrw: number;
  description: string;
}

export interface CareerEarningPeriod {
  id: string;
  label: string;
  years: string;
  club: string;
  grossKrwLow: number;
  grossKrwHigh: number;
  note: string;
}

export interface NetWorthScenario {
  id: NetWorthScenarioId;
  label: string;
  rangeLowKrw: number;
  rangeHighKrw: number;
  tone: "safe" | "base" | "high";
  assumptions: string[];
}

export interface RelatedPlayerSalary {
  id: string;
  nameKo: string;
  club: string;
  league: string;
  annualSalaryKrw: number;
  sourceBadge: PlayerCompareBadge;
  href: string;
  note: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

### 3.1 상수 설계

```ts
export const SHMS_META = {
  slug: "son-heung-min-lafc-salary-net-worth-2026",
  title: "손흥민 연봉 2026｜LAFC 주급·세후 실수령액·재산 추정",
  seoTitle: "손흥민 연봉 2026 | LAFC 주급·세후 실수령액·재산 추정",
  seoDescription:
    "손흥민의 2026년 LAFC 보도 기준 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산하고 토트넘 시절 누적 연봉과 광고 수입을 포함한 재산 추정 범위를 정리합니다.",
  description:
    "손흥민의 LAFC 보도 기준 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산하고 커리어 누적 연봉과 재산 추정 범위를 함께 정리합니다.",
  updatedAt: "2026-06-18",
  dataNote:
    "손흥민 연봉은 계약서 원문이 아니라 MLS 보수 보도 기준을 원화로 단순 환산한 값입니다. 세후 실수령액과 재산은 공식 공개값이 아니라 시뮬레이션 및 추정 범위입니다.",
};

export const SHMS_EXCHANGE_RATE: SalaryExchangeRate = {
  code: "USD",
  label: "달러",
  krwRate: 1375,
  updatedAt: "2026-06-18",
};

export const SHMS_PLAYER: SonSalaryProfile = {
  id: "son-heung-min",
  nameKo: "손흥민",
  nameEn: "Son Heung-min",
  club: "LAFC",
  league: "MLS",
  position: "FW",
  contractPeriodLabel: "2026년 MLS 보수 보도 기준 LAFC 소속",
  annualSalaryUsd: 11200000,
  sourceBadge: "보도 기준",
  sourceLabel: "MLS 2026 보수 보도",
  sourceUrl: "https://www.theguardian.com/football/2026/may/12/mls-2026-salary-release-takeaways",
  dataNote: "구단 계약서 원문이 아니므로 보도 기준값으로만 사용합니다.",
};

export const SHMS_NET_RATE_RANGE: NetRateRange = {
  low: 0.52,
  high: 0.6,
  label: "세후 52~60% 단순 시뮬레이션",
  description:
    "미국 연방세, 캘리포니아 주세, 고소득자 부담, 계약 구조를 단순화한 참고 범위입니다. 실제 실수령액은 세무 처리와 보너스 구조에 따라 달라질 수 있습니다.",
};
```

### 3.2 커리어 누적 연봉 데이터

```ts
export const SHMS_CAREER_EARNING_PERIODS: CareerEarningPeriod[] = [
  {
    id: "hamburg",
    label: "함부르크",
    years: "2010~2013",
    club: "함부르크 SV",
    grossKrwLow: 1000000000,
    grossKrwHigh: 3000000000,
    note: "분데스리가 데뷔 초기 유망주 연봉 구간입니다.",
  },
  {
    id: "leverkusen",
    label: "레버쿠젠",
    years: "2013~2015",
    club: "바이어 레버쿠젠",
    grossKrwLow: 5000000000,
    grossKrwHigh: 10000000000,
    note: "분데스리가 주전급으로 성장한 구간입니다.",
  },
  {
    id: "tottenham-early",
    label: "토트넘 초기",
    years: "2015~2018",
    club: "토트넘 홋스퍼",
    grossKrwLow: 20000000000,
    grossKrwHigh: 35000000000,
    note: "EPL 적응과 주전 진입 시기의 추정 연봉 구간입니다.",
  },
  {
    id: "tottenham-prime",
    label: "토트넘 전성기",
    years: "2018~2025",
    club: "토트넘 홋스퍼",
    grossKrwLow: 75000000000,
    grossKrwHigh: 100000000000,
    note: "장기계약, 득점왕, 주장 역할이 반영된 고액 연봉 구간입니다.",
  },
  {
    id: "lafc",
    label: "LAFC",
    years: "2025~2026",
    club: "LAFC",
    grossKrwLow: 15000000000,
    grossKrwHigh: 25000000000,
    note: "MLS 보도 기준 고액 연봉 구간입니다.",
  },
];
```

> 위 숫자는 실제 계약서 기반 확정 합계가 아니라 콘텐츠용 추정 범위다. 구현 시 UI에서 `추정`, `구간별 단순 모델` 배지를 반드시 노출한다.

### 3.3 재산 추정 시나리오 데이터

```ts
export const SHMS_NET_WORTH_SCENARIOS: NetWorthScenario[] = [
  {
    id: "conservative",
    label: "보수적 추정",
    rangeLowKrw: 60000000000,
    rangeHighKrw: 80000000000,
    tone: "safe",
    assumptions: [
      "세후 연봉 잔존율을 낮게 봅니다.",
      "광고·스폰서 수입은 일부만 반영합니다.",
      "세금, 에이전트 비용, 생활비, 기부, 투자 손익을 보수적으로 차감합니다.",
    ],
  },
  {
    id: "base",
    label: "중간 추정",
    rangeLowKrw: 80000000000,
    rangeHighKrw: 110000000000,
    tone: "base",
    assumptions: [
      "토트넘 장기 고액 연봉과 LAFC 보도 기준 연봉을 함께 반영합니다.",
      "글로벌 광고 모델 활동의 일부 잔존액을 반영합니다.",
      "공개되지 않은 투자 손익은 중립적으로 봅니다.",
    ],
  },
  {
    id: "optimistic",
    label: "공격적 추정",
    rangeLowKrw: 110000000000,
    rangeHighKrw: 150000000000,
    tone: "high",
    assumptions: [
      "광고·스폰서·초상권 수입을 폭넓게 반영합니다.",
      "투자와 자산 운용 성과가 우호적이었다고 가정합니다.",
      "실제 비공개 비용과 세무 구조에 따라 크게 달라질 수 있습니다.",
    ],
  },
];
```

---

## 4. 계산 유틸 설계

데이터 파일에서 export해 Astro 페이지가 바로 사용하도록 둔다.

```ts
export const formatKrw = (value: number) => {
  if (value >= 100000000) {
    const eok = value / 100000000;
    return `약 ${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억 원`;
  }
  if (value >= 10000) {
    return `약 ${Math.round(value / 10000).toLocaleString()}만 원`;
  }
  return `약 ${Math.round(value).toLocaleString()}원`;
};

export const formatKrwRange = (low: number, high: number) =>
  `${formatKrw(low)}~${formatKrw(high).replace(/^약 /, "")}`;

export const calcSalaryBreakdown = (
  annualSalaryUsd: number,
  usdRate: number,
  netLowRate: number,
  netHighRate: number,
): SalaryBreakdownItem[] => {
  const annual = annualSalaryUsd * usdRate;
  const items = [
    { id: "annual", label: "연봉", value: annual, description: "보도 기준 세전 연봉을 원화로 환산" },
    { id: "monthly", label: "월급", value: annual / 12, description: "연봉을 12개월로 나눈 값" },
    { id: "weekly", label: "주급", value: annual / 52, description: "연봉을 52주로 나눈 값" },
    { id: "daily", label: "일급", value: annual / 365, description: "연봉을 365일로 나눈 값" },
    { id: "hourly", label: "시간급", value: annual / 365 / 24, description: "연봉을 시간 단위로 환산한 값" },
    { id: "ninety", label: "90분 환산", value: (annual / 365 / 24) * 1.5, description: "축구 경기 90분에 맞춘 체감용 환산" },
  ];

  return items.map((item) => ({
    id: item.id,
    label: item.label,
    grossKrw: item.value,
    netLowKrw: item.value * netLowRate,
    netHighKrw: item.value * netHighRate,
    description: item.description,
  }));
};
```

---

## 5. Astro 페이지 (`src/pages/reports/son-heung-min-lafc-salary-net-worth-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SHMS_META,
  SHMS_PLAYER,
  SHMS_EXCHANGE_RATE,
  SHMS_NET_RATE_RANGE,
  SHMS_CAREER_EARNING_PERIODS,
  SHMS_NET_WORTH_SCENARIOS,
  SHMS_RELATED_PLAYER_SALARIES,
  SHMS_RELATED_LINKS,
  SHMS_SEO_INTRO,
  SHMS_SEO_CRITERIA,
  SHMS_FAQ,
  calcSalaryBreakdown,
  formatKrw,
  formatKrwRange,
} from "../../data/sonHeungMinLafcSalaryNetWorth2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SHMS_META.slug}/`;

const breakdown = calcSalaryBreakdown(
  SHMS_PLAYER.annualSalaryUsd,
  SHMS_EXCHANGE_RATE.krwRate,
  SHMS_NET_RATE_RANGE.low,
  SHMS_NET_RATE_RANGE.high,
);

const annual = breakdown.find((item) => item.id === "annual");
const monthly = breakdown.find((item) => item.id === "monthly");
const weekly = breakdown.find((item) => item.id === "weekly");
const baseNetWorth = SHMS_NET_WORTH_SCENARIOS.find((item) => item.id === "base");

const careerGrossLow = SHMS_CAREER_EARNING_PERIODS.reduce((sum, item) => sum + item.grossKrwLow, 0);
const careerGrossHigh = SHMS_CAREER_EARNING_PERIODS.reduce((sum, item) => sum + item.grossKrwHigh, 0);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SHMS_META.title,
    description: SHMS_META.seoDescription,
    dateModified: SHMS_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SHMS_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SHMS_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={SHMS_META.seoTitle} description={SHMS_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page shms-page" data-report="son-heung-min-lafc-salary-net-worth-2026">
    <CalculatorHero
      eyebrow="스포츠 연봉 리포트"
      title={SHMS_META.title}
      description={SHMS_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        SHMS_META.dataNote,
        "세후 실수령액은 미국·캘리포니아 세제를 단순화한 52~60% 범위 시뮬레이션입니다.",
        "재산 추정은 공식 공개 재산이 아니라 누적 연봉, 광고 수입, 잔존율을 바탕으로 한 시나리오입니다.",
        "광고 수입, 투자 수익, 에이전트 비용, 세무 구조는 실제와 다를 수 있습니다.",
      ]}
    />

    <!-- KPI / 환산표 / 커리어 누적 연봉 / 재산 추정 / 비교 / SEO 섹션 -->
  </main>
</BaseLayout>
```

---

## 6. 주요 섹션 마크업 설계

### 6.1 KPI 섹션

```astro
<section class="content-section shms-summary" aria-labelledby="shms-summary-title">
  <div class="shms-section-heading">
    <p>한눈에 보기</p>
    <h2 id="shms-summary-title">손흥민 LAFC 연봉을 원화로 바꾸면</h2>
    <span>{SHMS_EXCHANGE_RATE.label} 환율 {SHMS_EXCHANGE_RATE.krwRate.toLocaleString()}원 기준입니다.</span>
  </div>

  <div class="shms-kpi-grid">
    <article class="shms-kpi-card shms-kpi-card--primary">
      <span>보도 기준 세전 연봉</span>
      <strong>{formatKrw(annual?.grossKrw ?? 0)}</strong>
      <small>{SHMS_PLAYER.annualSalaryUsd.toLocaleString()} USD</small>
    </article>
    <article class="shms-kpi-card">
      <span>세후 연봉 추정</span>
      <strong>{formatKrwRange(annual?.netLowKrw ?? 0, annual?.netHighKrw ?? 0)}</strong>
      <small>{SHMS_NET_RATE_RANGE.label}</small>
    </article>
    <article class="shms-kpi-card">
      <span>주급 환산</span>
      <strong>{formatKrw(weekly?.grossKrw ?? 0)}</strong>
      <small>세전 단순 환산</small>
    </article>
    <article class="shms-kpi-card shms-kpi-card--wealth">
      <span>재산 추정 중심 시나리오</span>
      <strong>{formatKrwRange(baseNetWorth?.rangeLowKrw ?? 0, baseNetWorth?.rangeHighKrw ?? 0)}</strong>
      <small>공식 재산 아님</small>
    </article>
  </div>
</section>
```

### 6.2 연봉 환산표

```astro
<section class="content-section shms-breakdown" aria-labelledby="shms-breakdown-title">
  <div class="shms-section-heading">
    <p>주급·월급·일급</p>
    <h2 id="shms-breakdown-title">연봉을 체감 단위로 나누면</h2>
    <span>모든 금액은 보도 기준 연봉을 기간으로 나눈 단순 환산입니다.</span>
  </div>

  <div class="shms-table-wrap">
    <table class="shms-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>세전 환산</th>
          <th>세후 추정</th>
          <th>설명</th>
        </tr>
      </thead>
      <tbody>
        {breakdown.map((item) => (
          <tr>
            <td>{item.label}</td>
            <td>{formatKrw(item.grossKrw)}</td>
            <td>{formatKrwRange(item.netLowKrw, item.netHighKrw)}</td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 6.3 세후 시뮬레이션 섹션

```astro
<section class="content-section shms-net" aria-labelledby="shms-net-title">
  <div class="shms-section-heading">
    <p>세후 실수령액</p>
    <h2 id="shms-net-title">손흥민 세후 연봉은 왜 범위로 봐야 할까</h2>
    <span>{SHMS_NET_RATE_RANGE.description}</span>
  </div>

  <div class="shms-note-panel">
    <strong>{SHMS_NET_RATE_RANGE.label}</strong>
    <p>
      선수 계약은 기본급, 보너스, 초상권, 거주자 판정, 세무 처리 방식이 모두 다를 수 있습니다.
      따라서 이 페이지는 확정 세율을 쓰지 않고 세전 금액의 52~60%를 세후 추정 범위로 표시합니다.
    </p>
  </div>
</section>
```

### 6.4 커리어 누적 연봉 섹션

```astro
<section class="content-section shms-career" aria-labelledby="shms-career-title">
  <div class="shms-section-heading">
    <p>그동안 번 돈</p>
    <h2 id="shms-career-title">손흥민 커리어 누적 연봉 추정</h2>
    <span>구간별 계약 정보가 모두 공개된 것은 아니므로 넓은 추정 범위로 표시합니다.</span>
  </div>

  <div class="shms-career-total">
    <span>커리어 세전 연봉 추정 합계</span>
    <strong>{formatKrwRange(careerGrossLow, careerGrossHigh)}</strong>
    <p>함부르크, 레버쿠젠, 토트넘, LAFC 구간을 단순 합산한 추정 모델입니다.</p>
  </div>

  <div class="shms-timeline">
    {SHMS_CAREER_EARNING_PERIODS.map((period) => (
      <article class="shms-timeline-item">
        <span>{period.years}</span>
        <h3>{period.label}</h3>
        <strong>{formatKrwRange(period.grossKrwLow, period.grossKrwHigh)}</strong>
        <p>{period.club} · {period.note}</p>
      </article>
    ))}
  </div>
</section>
```

### 6.5 재산 추정 섹션

```astro
<section class="content-section shms-net-worth" aria-labelledby="shms-net-worth-title">
  <div class="shms-section-heading">
    <p>재산 추정</p>
    <h2 id="shms-net-worth-title">손흥민 재산은 얼마로 추정할 수 있을까</h2>
    <span>공식 공개 재산이 아니라 누적 세후 연봉, 광고 수입, 잔존율을 바탕으로 한 시나리오입니다.</span>
  </div>

  <div class="shms-formula">
    <strong>재산 추정 모델</strong>
    <p>누적 세후 연봉 잔존액 + 광고·스폰서 수입 잔존액 + 투자·부동산 추정 - 생활비·세무·에이전트 비용</p>
  </div>

  <div class="shms-scenario-grid">
    {SHMS_NET_WORTH_SCENARIOS.map((scenario) => (
      <article class={`shms-scenario-card shms-scenario-card--${scenario.tone}`}>
        <span>재산 추정</span>
        <h3>{scenario.label}</h3>
        <strong>{formatKrwRange(scenario.rangeLowKrw, scenario.rangeHighKrw)}</strong>
        <ul>
          {scenario.assumptions.map((assumption) => <li>{assumption}</li>)}
        </ul>
      </article>
    ))}
  </div>
</section>
```

### 6.6 광고·스폰서 수입 섹션

```astro
<section class="content-section shms-sponsor" aria-labelledby="shms-sponsor-title">
  <div class="shms-section-heading">
    <p>광고·스폰서</p>
    <h2 id="shms-sponsor-title">광고 수입은 재산 추정에 어떻게 반영할까</h2>
  </div>

  <div class="shms-note-panel">
    <p>
      광고 수입은 계약 기간, 국가별 캠페인, 초상권 배분 구조에 따라 크게 달라집니다.
      따라서 이 페이지는 광고 수입을 확정값으로 계산하지 않고 재산 추정 시나리오의 보정 항목으로만 반영합니다.
    </p>
  </div>
</section>
```

### 6.7 김민재·이강인 비교 섹션

```astro
<section class="content-section shms-compare" aria-labelledby="shms-compare-title">
  <div class="shms-section-heading">
    <p>대표팀 연봉 비교</p>
    <h2 id="shms-compare-title">손흥민·김민재·이강인 연봉 비교</h2>
    <span>기존 대한민국 월드컵 대표팀 연봉 순위 리포트와 같은 기준으로 비교합니다.</span>
  </div>

  <div class="shms-player-grid">
    {SHMS_RELATED_PLAYER_SALARIES.map((player) => (
      <a class="shms-player-card" href={withBase(player.href)}>
        <span class={`shms-badge shms-badge--${player.sourceBadge.replace(/\s/g, "-")}`}>{player.sourceBadge}</span>
        <strong>{player.nameKo}</strong>
        <small>{player.club} · {player.league}</small>
        <em>{formatKrw(player.annualSalaryKrw)}</em>
        <p>{player.note}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 7. SCSS (`src/styles/scss/pages/_son-heung-min-lafc-salary-net-worth-2026.scss`)

```scss
.shms-page {
  --shms-ink: #172033;
  --shms-muted: #667085;
  --shms-line: #d8e0ea;
  --shms-soft: #f5f8fb;
  --shms-blue: #2457d6;
  --shms-green: #0f8a5f;
  --shms-gold: #a36500;
  --shms-warn: #9a5b00;

  .shms-section-heading {
    display: grid;
    gap: 6px;

    p,
    h2,
    span {
      margin: 0;
    }

    p {
      color: var(--shms-blue);
      font-size: 12px;
      font-weight: 900;
    }

    h2 {
      color: var(--shms-ink);
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.25;
      letter-spacing: 0;
    }

    span {
      color: var(--shms-muted);
      font-size: 14px;
      line-height: 1.65;
    }
  }

  .shms-kpi-grid,
  .shms-scenario-grid,
  .shms-player-grid,
  .shms-related-grid {
    display: grid;
    gap: 12px;
  }

  .shms-kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .shms-kpi-card,
  .shms-scenario-card,
  .shms-player-card,
  .shms-related-card,
  .shms-note-panel,
  .shms-formula,
  .shms-career-total,
  .shms-timeline-item {
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--shms-line);
    border-radius: 8px;
    background: #fff;
    color: inherit;
    text-decoration: none;
  }

  .shms-kpi-card {
    span,
    small {
      color: var(--shms-muted);
      font-size: 12px;
      line-height: 1.45;
    }

    strong {
      color: var(--shms-ink);
      font-size: clamp(22px, 4vw, 30px);
      line-height: 1.2;
      letter-spacing: 0;
    }

    &--primary {
      border-color: #b9ccff;
      background: #f6f9ff;
    }

    &--wealth {
      border-color: #f0c36a;
      background: #fffaf0;
    }
  }

  .shms-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--shms-line);
    border-radius: 8px;
    background: #fff;
  }

  .shms-table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
    font-size: 14px;

    th,
    td {
      padding: 12px;
      border-bottom: 1px solid var(--shms-line);
      text-align: left;
      vertical-align: top;
    }

    th {
      background: var(--shms-soft);
      color: var(--shms-ink);
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    td {
      color: var(--shms-muted);
      line-height: 1.55;
    }

    td:first-child,
    td:nth-child(2),
    td:nth-child(3) {
      color: var(--shms-ink);
      font-weight: 850;
      white-space: nowrap;
    }
  }

  .shms-career-total {
    border-color: #c7d6ff;
    background: #f6f9ff;

    span,
    p {
      margin: 0;
      color: var(--shms-muted);
      font-size: 13px;
      line-height: 1.6;
    }

    strong {
      color: var(--shms-blue);
      font-size: clamp(24px, 4vw, 34px);
      line-height: 1.2;
      letter-spacing: 0;
    }
  }

  .shms-timeline {
    display: grid;
    gap: 10px;
    margin-top: 12px;
  }

  .shms-timeline-item {
    grid-template-columns: minmax(90px, 120px) minmax(0, 1fr) minmax(160px, auto);
    align-items: center;

    span,
    p {
      margin: 0;
      color: var(--shms-muted);
      font-size: 13px;
      line-height: 1.55;
    }

    h3 {
      margin: 0;
      color: var(--shms-ink);
      font-size: 16px;
      line-height: 1.35;
    }

    strong {
      color: var(--shms-ink);
      font-size: 15px;
      line-height: 1.35;
      text-align: right;
    }

    p {
      grid-column: 2 / -1;
    }
  }

  .shms-scenario-grid,
  .shms-player-grid,
  .shms-related-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .shms-scenario-card {
    span {
      width: fit-content;
      padding: 4px 8px;
      border-radius: 999px;
      background: #fff4df;
      color: var(--shms-warn);
      font-size: 11px;
      font-weight: 900;
      line-height: 1.2;
    }

    h3,
    ul {
      margin: 0;
    }

    h3 {
      color: var(--shms-ink);
      font-size: 17px;
      line-height: 1.35;
    }

    strong {
      color: var(--shms-gold);
      font-size: 22px;
      line-height: 1.25;
      letter-spacing: 0;
    }

    ul {
      padding-left: 18px;
      color: var(--shms-muted);
      font-size: 13px;
      line-height: 1.65;
    }

    &--base {
      border-color: #f0c36a;
      background: #fffaf0;
    }
  }

  .shms-note-panel,
  .shms-formula {
    strong,
    p {
      margin: 0;
    }

    strong {
      color: var(--shms-ink);
      font-size: 16px;
      line-height: 1.35;
    }

    p {
      color: var(--shms-muted);
      font-size: 14px;
      line-height: 1.7;
    }
  }

  .shms-player-card,
  .shms-related-card {
    transition: border-color 0.16s, background 0.16s, transform 0.16s;

    &:hover {
      border-color: var(--shms-blue);
      background: #f7faff;
      transform: translateY(-1px);
    }
  }

  .shms-player-card {
    strong {
      color: var(--shms-ink);
      font-size: 18px;
      line-height: 1.35;
    }

    small,
    p {
      margin: 0;
      color: var(--shms-muted);
      font-size: 13px;
      line-height: 1.6;
    }

    em {
      color: var(--shms-blue);
      font-size: 20px;
      font-style: normal;
      font-weight: 900;
      line-height: 1.25;
    }
  }

  .shms-badge {
    width: fit-content;
    padding: 4px 8px;
    border-radius: 999px;
    background: #fff4df;
    color: var(--shms-warn);
    font-size: 11px;
    font-weight: 900;
    line-height: 1.2;

    &--보도-기준 {
      background: #eaf1ff;
      color: var(--shms-blue);
    }

    &--추정,
    &--확인-필요 {
      background: #fff4df;
      color: var(--shms-warn);
    }
  }

  .shms-related-card {
    strong,
    p {
      margin: 0;
    }

    strong {
      color: var(--shms-ink);
      font-size: 15px;
      line-height: 1.35;
    }

    p {
      color: var(--shms-muted);
      font-size: 13px;
      line-height: 1.6;
    }
  }

  @media (max-width: 640px) {
    .shms-kpi-grid,
    .shms-scenario-grid,
    .shms-player-grid,
    .shms-related-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .shms-kpi-card strong {
      font-size: 24px;
    }

    .shms-timeline-item {
      grid-template-columns: minmax(0, 1fr);

      strong {
        text-align: left;
      }

      p {
        grid-column: auto;
      }
    }
  }
}
```

---

## 8. SEO 콘텐츠 설계

`SeoContent` 입력:

```ts
export const SHMS_SEO_INTRO = [
  "손흥민 연봉은 LAFC와 MLS가 공개한 계약서 원문이 아니라 2026년 MLS 보수 보도를 바탕으로 확인할 수 있습니다. 따라서 이 페이지에서는 숫자를 확정값이 아니라 보도 기준 연봉, 세전 환산, 세후 시뮬레이션으로 구분해 표시합니다.",
  "기본 계산은 손흥민의 LAFC 보도 기준 연봉 1,120만 달러와 1달러 1,375원 환율을 적용합니다. 이 기준이면 원화 연봉은 약 154.0억 원, 월급은 약 12.83억 원, 주급은 약 2.96억 원으로 환산됩니다.",
  "세후 실수령액은 미국 연방세, 캘리포니아 주세, 계약 구조, 보너스, 초상권 배분에 따라 달라질 수 있습니다. 이 페이지는 단정값 대신 세전 금액의 52~60%를 세후 범위로 보는 단순 시뮬레이션을 제공합니다.",
  "손흥민이 그동안 벌었던 돈은 함부르크, 레버쿠젠, 토트넘, LAFC 구간별 연봉을 넓은 범위로 합산한 추정 모델입니다. 실제 계약 세부와 보너스 구조가 모두 공개되어 있지 않으므로 커리어 누적 연봉도 공식값처럼 보면 안 됩니다.",
  "손흥민 재산은 공식 공개 자료가 없기 때문에 정확한 숫자를 알 수 없습니다. 이 페이지는 누적 세후 연봉, 광고·스폰서 수입, 투자·부동산 가능성, 세금과 에이전트 비용을 고려한 시나리오별 추정 범위만 제공합니다.",
];

export const SHMS_SEO_CRITERIA = [
  "손흥민 연봉은 MLS 보수 보도 기준이며 계약서 원문이 아닙니다.",
  "주급·월급·일급은 보도 기준 연봉을 기간 단위로 나눈 단순 환산입니다.",
  "세후 실수령액은 미국·캘리포니아 세제와 계약 구조를 단순화한 52~60% 범위입니다.",
  "재산 추정은 공식 재산이 아니라 누적 연봉과 광고 수입을 반영한 시나리오입니다.",
  "김민재·이강인과의 비교는 계약 규모 비교이며 선수 가치 순위가 아닙니다.",
];
```

---

## 9. FAQ 설계

```ts
export const SHMS_FAQ: FaqItem[] = [
  {
    question: "손흥민 연봉은 공식 자료인가요?",
    answer:
      "계약서 원문이 아니라 MLS 2026 보수 보도를 바탕으로 한 보도 기준 금액입니다. 따라서 페이지 전체에서 공식 확정값이 아닌 보도 기준 연봉으로 표시합니다.",
  },
  {
    question: "손흥민 LAFC 주급은 얼마인가요?",
    answer:
      "연봉 1,120만 달러와 1달러 1,375원 환율을 적용하면 세전 주급은 약 2.96억 원입니다. 환율과 보도 기준이 달라지면 금액도 달라질 수 있습니다.",
  },
  {
    question: "손흥민 세후 실수령액은 얼마인가요?",
    answer:
      "미국·캘리포니아 고소득자 세금과 계약 구조를 단순화해 세전 금액의 52~60%를 세후 범위로 표시합니다. 이 기준이면 세후 연봉은 약 80.1억~92.4억 원입니다.",
  },
  {
    question: "손흥민 재산은 얼마로 추정되나요?",
    answer:
      "공식 공개 재산은 없습니다. 이 페이지는 누적 세후 연봉, 광고·스폰서 수입, 투자 가능성, 비용을 고려해 보수적 600억~800억 원, 중간 800억~1,100억 원, 공격적 1,100억~1,500억 원 시나리오로만 제시합니다.",
  },
  {
    question: "손흥민이 토트넘에서 번 돈은 얼마나 되나요?",
    answer:
      "토트넘 시절 전체 계약 세부가 모두 공개되어 있지 않기 때문에 정확한 합계는 알 수 없습니다. 이 페이지에서는 토트넘 초기와 전성기 구간을 나누어 커리어 누적 연봉 추정에 반영합니다.",
  },
  {
    question: "광고 수입도 포함됐나요?",
    answer:
      "연봉 환산표에는 광고 수입을 포함하지 않습니다. 광고 수입은 세부 계약이 비공개이므로 재산 추정 시나리오의 보정 항목으로만 반영합니다.",
  },
  {
    question: "손흥민과 김민재 중 누가 연봉이 더 높나요?",
    answer:
      "같은 내부 기준에서는 김민재의 보도 기준 연봉이 손흥민의 LAFC 보도 기준 연봉보다 높게 표시됩니다. 다만 리그, 계약 시점, 세금, 보너스 구조가 다르므로 단순 선수 가치 순위로 해석하면 안 됩니다.",
  },
  {
    question: "90분 환산 금액은 실제 경기 수당인가요?",
    answer:
      "아닙니다. 연봉을 시간 단위로 나눈 뒤 90분에 해당하는 금액을 계산한 체감용 지표입니다. 실제 경기 수당, 승리 수당, 보너스와는 다릅니다.",
  },
];
```

---

## 10. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `son-heung-min-lafc-salary-net-worth-2026` 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/son-heung-min-lafc-salary-net-worth-2026';` 추가 |
| `public/sitemap.xml` | `/reports/son-heung-min-lafc-salary-net-worth-2026/` 추가 |
| `src/pages/index.astro` | 신규/추천 리포트 영역에 손흥민 페이지 추가 검토 |
| `src/data/compareHub.ts` | 스포츠 카테고리에 `손흥민 연봉·재산 추정` 카드 추가 |
| `src/data/koreaWorldcupSquadSalary2026.ts` | 손흥민 카드 또는 관련 링크에서 단일 리포트로 연결 |
| `src/data/koreaFootballLegendsSalaryComparison2026.ts` | 현재 대표팀 핵심 3인 관련 링크에 추가 |
| `src/data/leeKangInPsgSalary2026.ts` | 비교/관련 링크에서 손흥민 단일 리포트로 연결 |

---

## 11. 내부 링크 전략

### 11.1 새 페이지에서 연결

- `/reports/lee-kang-in-psg-salary-2026/`
  - CTA: `이강인 PSG 연봉 자세히 보기`
- `/reports/korea-worldcup-squad-salary-2026/`
  - CTA: `대한민국 월드컵 대표팀 연봉 순위 보기`
- `/reports/korea-football-legends-salary-comparison-2026/`
  - CTA: `한국 축구 레전드 연봉 비교 보기`
- `/reports/worldcup-squad-salary-total-comparison-2026/`
  - CTA: `월드컵 대표팀 연봉 총액 비교 보기`
- `/tools/worldcup-prize-money-calculator/`
  - CTA: `월드컵 상금 계산기로 이동`

### 11.2 기존 페이지에서 새 페이지로 연결

- 대표팀 연봉 순위 리포트
  - 손흥민 카드 또는 관련 링크에 `손흥민 연봉·재산 추정 자세히 보기`
- 이강인 연봉 리포트
  - 비교 섹션의 손흥민 카드 href를 새 단일 페이지로 교체
- 레전드 연봉 비교 리포트
  - 현재 대표팀 핵심 3인 관련 링크에 손흥민 페이지 추가
- `/compare/`
  - 스포츠 카테고리 상단 카드로 추가

---

## 12. 비교표 허브 카드 설계

`src/data/compareHub.ts` 스포츠 카테고리에 추가:

```ts
{
  id: "son-heung-min-lafc-salary-net-worth",
  title: "손흥민 연봉·재산 추정 2026",
  description: "LAFC 보도 기준 연봉을 주급·월급·세후 실수령액으로 환산하고 커리어 누적 연봉과 재산 추정 범위를 정리합니다.",
  href: "/reports/son-heung-min-lafc-salary-net-worth-2026/",
  type: "report",
  categoryId: "sports",
  criteria: ["LAFC", "주급", "세후", "재산 추정"],
  badges: [
    { label: "신규", tone: "new" },
    { label: "보도 기준", tone: "estimate" },
  ],
  stats: [
    { label: "연봉", value: "1,120만 USD" },
    { label: "재산", value: "추정" },
  ],
  ctaLabel: "연봉 보기",
  priority: 0.4,
}
```

---

## 13. SEO 키워드 매핑

| 우선순위 | 키워드 | 의도 | 대응 위치 |
|----------|--------|------|-----------|
| 1 | 손흥민 연봉 | 핵심 검색 | title, h1, KPI |
| 2 | 손흥민 주급 | 주급 환산 | title, 환산표 |
| 3 | 손흥민 LAFC 연봉 | 소속팀 기준 | title, Hero, 본문 |
| 4 | 손흥민 세후 | 실수령액 | KPI, 세후 섹션, FAQ |
| 5 | 손흥민 재산 | 재산 추정 | title, KPI, 재산 섹션 |
| 6 | 손흥민이 그동안 번 돈 | 누적 연봉 | 커리어 누적 연봉 섹션 |
| 7 | 손흥민 광고 수입 | 스폰서 | 광고·스폰서 섹션 |
| 8 | 손흥민 김민재 연봉 | 비교 | 비교 섹션 |
| 9 | 손흥민 이강인 연봉 | 비교 | 비교 섹션 |
| 10 | 손흥민 월급 | 월 환산 | 환산표 |

권장 H2:

- `손흥민 LAFC 연봉은 얼마일까`
- `손흥민 주급·월급·일급 환산`
- `손흥민 세후 실수령액은 왜 범위로 봐야 할까`
- `손흥민이 그동안 벌었던 돈은 얼마나 될까`
- `손흥민 재산 추정 범위`
- `손흥민·김민재·이강인 연봉 비교`

---

## 14. 구현 우선순위

1. `src/data/sonHeungMinLafcSalaryNetWorth2026.ts` 작성
2. `src/pages/reports/son-heung-min-lafc-salary-net-worth-2026.astro` 작성
3. `src/styles/scss/pages/_son-heung-min-lafc-salary-net-worth-2026.scss` 작성
4. KPI, 환산표, 세후 시뮬레이션 섹션 구현
5. 커리어 누적 연봉 섹션 구현
6. 재산 추정 시나리오 카드 구현
7. 광고·스폰서 설명과 선수 비교 섹션 구현
8. `SeoContent`, FAQ, JSON-LD 추가
9. `reports.ts`, `app.scss`, `sitemap.xml`, `index.astro`, `compareHub.ts` 등록
10. 기존 축구 연봉 리포트에서 새 페이지로 내부 링크 추가
11. `npm run build`

---

## 15. QA 포인트

- [ ] 페이지 제목과 description에 `손흥민 연봉`, `LAFC`, `주급`, `세후`, `재산 추정` 포함
- [ ] 모든 재산 수치 근처에 `추정`, `시나리오`, `공식 공개 재산 아님` 표시
- [ ] 세후 금액을 확정값처럼 표현하지 않음
- [ ] 연봉·월급·주급·일급·시간급·90분 환산 값이 같은 기준에서 계산됨
- [ ] 누적 연봉 합계가 구간별 `grossKrwLow`, `grossKrwHigh` 합계와 일치
- [ ] 이강인·김민재 비교 값이 기존 대표팀 연봉 리포트와 일관됨
- [ ] 모바일 375px에서 KPI 카드, 재산 카드, 누적 연봉 타임라인이 깨지지 않음
- [ ] JSON-LD `Article`, `FAQPage`, `BreadcrumbList` 생성
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 누락 없음
- [ ] `npm run build` 성공

---

## 16. 구현 리스크

- **재산 단정 리스크**:
  - `손흥민 재산은 약 OOO억입니다` 금지.
  - `공식 공개 재산이 아니라 추정 범위`를 Hero 직후, KPI, 재산 섹션, FAQ에 반복 노출.
- **광고 수입 과장 리스크**:
  - 광고 수입은 세부 계약이 비공개이므로 수치 단정 금지.
  - 재산 추정의 보정 항목으로만 반영.
- **세후액 단정 리스크**:
  - 미국·캘리포니아 세율을 하나의 확정 세율로 쓰지 않음.
  - `52~60% 단순 시뮬레이션` 범위로 표시.
- **커리어 누적 연봉 오해 리스크**:
  - 구간별 계약 세부가 모두 공개되지 않았으므로 `추정 합계`, `범위형 모델`로 표시.
- **선수 가치 오해 리스크**:
  - 김민재·이강인과의 비교는 계약 규모 비교이지 실력 순위가 아님을 고지.
- **검색 만족도**:
  - 첫 화면에서 연봉, 주급, 세후, 재산 추정 범위가 바로 보여야 함.

---

## 17. 참고 출처 및 확인 메모

- Guardian MLS 2026 salary coverage: Messi 2,830만 달러, 손흥민 1,120만 달러 보도.
- 2026년 6월 18일 기준 손흥민 LAFC 보도 연봉을 기본값으로 사용.
- 기존 내부 데이터:
  - `src/data/koreaWorldcupSquadSalary2026.ts`
  - `src/data/koreaFootballLegendsSalaryComparison2026.ts`
  - `src/data/leeKangInPsgSalary2026.ts`
- 재산·광고 수입은 공개자료가 제한적이므로 외부 기사 숫자를 그대로 공식값처럼 쓰지 않고 추정 모델로만 사용한다.
