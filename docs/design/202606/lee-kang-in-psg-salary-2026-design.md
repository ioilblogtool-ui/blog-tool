# 이강인 연봉 2026 PSG 주급·세후 실수령액 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/lee-kang-in-psg-salary-2026`
- **유형**: 리포트
- **prefix**: `lkis-`
- **데이터 파일**: `src/data/leeKangInPsgSalary2026.ts`
- **기획 문서**: `docs/plan/202606/lee-kang-in-psg-salary-2026-plan.md`
- **핵심 목표**:
  - `이강인 연봉`, `이강인 주급`, `이강인 PSG 연봉`, `이강인 세후 실수령액` 검색 의도 대응
  - 기존 축구 연봉 클러스터와 연결
  - 공식값이 아닌 추정 연봉임을 명확히 고지

---

## 2. 화면 구성

```text
[BaseLayout]
  SiteHeader
  main.report-page.lkis-page
    CalculatorHero
    InfoNotice

    section.lkis-summary
      - KPI 카드 4개
      - 데이터 기준 요약

    section.lkis-breakdown
      - 연봉/월급/주급/일급/시간급/90분 환산 표

    section.lkis-net
      - 세후 실수령액 범위 설명
      - 세후율 55~60% 시뮬레이션 카드

    section.lkis-compare
      - 손흥민·김민재·이강인 연봉 비교 카드/표

    section.lkis-context
      - PSG 계약·포지션·이적 변수 설명

    section.lkis-links
      - 관련 스포츠 연봉 콘텐츠

    SeoContent
```

---

## 3. 데이터 파일 (`src/data/leeKangInPsgSalary2026.ts`)

```ts
export type SalaryEvidenceBadge = "추정" | "공식 프로필" | "보도 기준" | "세후 시뮬레이션";
export type PlayerCompareBadge = "보도 기준" | "추정" | "확인 필요";

export interface SalaryExchangeRate {
  code: "EUR";
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

export interface PlayerSalaryProfile {
  id: "lee-kang-in";
  nameKo: string;
  nameEn: string;
  club: string;
  league: string;
  position: string;
  contractPeriodLabel: string;
  annualSalaryEur: number;
  sourceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
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

export const LKIS_META = {
  slug: "lee-kang-in-psg-salary-2026",
  title: "이강인 연봉 2026｜PSG 주급·세후 실수령액은 얼마일까",
  seoTitle: "이강인 연봉 2026 | PSG 주급·월급·세후 실수령액 추정",
  seoDescription:
    "이강인의 2026년 PSG 추정 연봉을 유로와 원화 기준으로 환산하고, 주급·월급·일급·세후 실수령액을 계산합니다. 손흥민·김민재 연봉과도 비교합니다.",
  description:
    "이강인의 PSG 추정 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산해 보는 스포츠 연봉 리포트입니다.",
  updatedAt: "2026-06-18",
  dataNote:
    "이강인 연봉은 PSG 공식 계약서가 아닌 비공식 샐러리 DB와 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 보너스, 초상권, 광고 수입, 에이전트 수수료, 실제 세무 구조는 반영하지 않습니다.",
};

export const LKIS_EXCHANGE_RATE: SalaryExchangeRate = {
  code: "EUR",
  label: "유로",
  krwRate: 1485,
  updatedAt: "2026-06-18",
};

export const LKIS_PLAYER: PlayerSalaryProfile = {
  id: "lee-kang-in",
  nameKo: "이강인",
  nameEn: "Lee Kang-in",
  club: "파리 생제르맹(PSG)",
  league: "리그1",
  position: "MF",
  contractPeriodLabel: "2023년 합류, 2028년까지 계약으로 알려짐",
  annualSalaryEur: 4_000_000,
  sourceBadge: "추정",
  sourceLabel: "비공식 샐러리 DB·언론 추정치",
  dataNote: "구단 공식 공개값이 아니므로 추정값으로만 사용합니다.",
};

export const LKIS_NET_RATE_RANGE: NetRateRange = {
  low: 0.55,
  high: 0.6,
  label: "세후 55~60% 단순 시뮬레이션",
  description:
    "프랑스 고소득자 세금과 사회부담금을 단순화한 참고 범위입니다. 실제 실수령액은 계약 구조와 세무 처리에 따라 달라집니다.",
};

export const LKIS_RELATED_PLAYER_SALARIES: RelatedPlayerSalary[] = [
  {
    id: "kim-min-jae",
    nameKo: "김민재",
    club: "바이에른 뮌헨",
    league: "분데스리가",
    annualSalaryKrw: 22_275_000_000,
    sourceBadge: "보도 기준",
    href: "/reports/korea-worldcup-squad-salary-2026/",
    note: "기존 대한민국 월드컵 대표팀 연봉 순위 리포트와 동일한 기준입니다.",
  },
  {
    id: "son-heung-min",
    nameKo: "손흥민",
    club: "LAFC",
    league: "MLS",
    annualSalaryKrw: 15_400_000_000,
    sourceBadge: "보도 기준",
    href: "/reports/korea-worldcup-squad-salary-2026/",
    note: "MLS 보수 보도를 원화로 단순 환산한 값입니다.",
  },
  {
    id: "lee-kang-in",
    nameKo: "이강인",
    club: "파리 생제르맹",
    league: "리그1",
    annualSalaryKrw: 5_940_000_000,
    sourceBadge: "추정",
    href: "/reports/lee-kang-in-psg-salary-2026/",
    note: "비공식 샐러리 DB·언론 추정치를 원화로 단순 환산한 값입니다.",
  },
];

export const LKIS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/korea-worldcup-squad-salary-2026/",
    label: "2026 대한민국 월드컵 대표팀 연봉 순위",
    description: "손흥민, 김민재, 이강인 등 대표팀 주요 선수 연봉 비교",
  },
  {
    href: "/reports/korea-football-legends-salary-comparison-2026/",
    label: "손흥민·김민재·이강인 vs 역대 레전드 연봉",
    description: "현재 대표팀 핵심 3인과 박지성·차범근 등 레전드 비교",
  },
  {
    href: "/reports/worldcup-squad-salary-total-comparison-2026/",
    label: "월드컵 대표팀 연봉 총액 비교",
    description: "한국 대표팀 스쿼드 연봉 총액과 주요 강팀 비교",
  },
  {
    href: "/tools/worldcup-prize-money-calculator/",
    label: "월드컵 상금 계산기",
    description: "성적별 상금과 선수 배분액을 시뮬레이션",
  },
];

export const LKIS_FAQ: FaqItem[] = [
  {
    question: "이강인 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. PSG 공식 계약서가 아니라 비공식 샐러리 DB와 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 페이지 전체에서 추정값으로 표시합니다.",
  },
  {
    question: "이강인 주급은 얼마인가요?",
    answer:
      "기본값인 연봉 400만 유로와 1유로 1,485원 환율을 적용하면 세전 주급은 약 1.14억 원입니다. 환율과 추정 연봉 기준이 달라지면 값도 달라집니다.",
  },
  {
    question: "이강인 세후 실수령액은 얼마인가요?",
    answer:
      "프랑스 고소득자 세금과 사회부담금을 단순화해 세전 금액의 55~60%를 세후 범위로 표시합니다. 실제 실수령액은 계약 구조, 보너스, 초상권, 세무 처리에 따라 달라질 수 있습니다.",
  },
  {
    question: "PSG 보너스와 광고 수입도 포함됐나요?",
    answer:
      "아니요. 이 페이지는 추정 기본 연봉을 기준으로 계산합니다. 우승 보너스, 출전 수당, 초상권, 광고 수입, 에이전트 수수료는 반영하지 않습니다.",
  },
  {
    question: "손흥민·김민재보다 연봉이 낮은 이유는 무엇인가요?",
    answer:
      "연봉은 선수 실력만이 아니라 계약 시점, 리그, 포지션, 나이, 이적료, 구단 내 역할, 시장 상황이 함께 반영됩니다. 단순 연봉 차이를 선수 가치 순위처럼 해석하면 안 됩니다.",
  },
  {
    question: "90분 환산 금액은 실제 경기 수당인가요?",
    answer:
      "아닙니다. 연봉을 시간 단위로 나눈 뒤 90분에 해당하는 금액을 계산한 체감용 지표입니다. 실제 경기 수당이나 승리 수당과는 다릅니다.",
  },
];
```

---

## 4. 계산 유틸 설계

데이터 파일 또는 Astro frontmatter 내부에 순수 함수로 둔다.

```ts
const formatKrw = (value: number) => {
  if (value >= 100_000_000) {
    const eok = value / 100_000_000;
    return `약 ${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억 원`;
  }
  if (value >= 10_000) {
    return `약 ${Math.round(value / 10_000).toLocaleString()}만 원`;
  }
  return `약 ${Math.round(value).toLocaleString()}원`;
};

const calcSalaryBreakdown = (
  annualSalaryEur: number,
  eurRate: number,
  netLowRate: number,
  netHighRate: number,
): SalaryBreakdownItem[] => {
  const annual = annualSalaryEur * eurRate;
  const items = [
    { id: "annual", label: "연봉", value: annual, description: "추정 세전 연봉을 원화로 환산" },
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

## 5. Astro 페이지 (`src/pages/reports/lee-kang-in-psg-salary-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  LKIS_META,
  LKIS_PLAYER,
  LKIS_EXCHANGE_RATE,
  LKIS_NET_RATE_RANGE,
  LKIS_RELATED_PLAYER_SALARIES,
  LKIS_RELATED_LINKS,
  LKIS_FAQ,
} from "../../data/leeKangInPsgSalary2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${LKIS_META.slug}/`;

const annualGrossKrw = LKIS_PLAYER.annualSalaryEur * LKIS_EXCHANGE_RATE.krwRate;
const breakdown = calcSalaryBreakdown(
  LKIS_PLAYER.annualSalaryEur,
  LKIS_EXCHANGE_RATE.krwRate,
  LKIS_NET_RATE_RANGE.low,
  LKIS_NET_RATE_RANGE.high,
);

const annual = breakdown.find((item) => item.id === "annual");
const monthly = breakdown.find((item) => item.id === "monthly");
const weekly = breakdown.find((item) => item.id === "weekly");

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: LKIS_META.title,
    description: LKIS_META.seoDescription,
    dateModified: LKIS_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LKIS_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: LKIS_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={LKIS_META.seoTitle} description={LKIS_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page lkis-page" data-report="lee-kang-in-psg-salary-2026">
    <CalculatorHero
      eyebrow="스포츠 연봉 리포트"
      title={LKIS_META.title}
      description={LKIS_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        LKIS_META.dataNote,
        "세후 실수령액은 프랑스 고소득자 세금과 사회부담금을 단순화한 55~60% 범위 시뮬레이션입니다.",
        "90분 환산 금액은 실제 경기 수당이 아니라 연봉을 시간 단위로 나눈 체감용 계산입니다.",
      ]}
    />

    <!-- KPI / 환산표 / 비교 / SEO 섹션 -->
  </main>
</BaseLayout>
```

> 실제 구현 시 위 코드의 `calcSalaryBreakdown`, `formatKrw`는 frontmatter 상단에 정의하거나 데이터 파일에서 export한다.

---

## 6. 주요 섹션 마크업 설계

### 6.1 KPI 섹션

```astro
<section class="content-section lkis-summary" aria-labelledby="lkis-summary-title">
  <div class="lkis-section-heading">
    <p>한눈에 보기</p>
    <h2 id="lkis-summary-title">이강인 PSG 추정 연봉을 원화로 바꾸면</h2>
    <span>{LKIS_EXCHANGE_RATE.label} 환율 {LKIS_EXCHANGE_RATE.krwRate.toLocaleString()}원 기준입니다.</span>
  </div>

  <div class="lkis-kpi-grid">
    <article class="lkis-kpi-card lkis-kpi-card--primary">
      <span>추정 세전 연봉</span>
      <strong>{formatKrw(annual?.grossKrw ?? annualGrossKrw)}</strong>
      <small>{LKIS_PLAYER.annualSalaryEur.toLocaleString()} EUR</small>
    </article>
    <article class="lkis-kpi-card">
      <span>추정 세후 연봉</span>
      <strong>{formatKrw(annual?.netLowKrw ?? 0)}~{formatKrw(annual?.netHighKrw ?? 0).replace("약 ", "")}</strong>
      <small>{LKIS_NET_RATE_RANGE.label}</small>
    </article>
    <article class="lkis-kpi-card">
      <span>주급 환산</span>
      <strong>{formatKrw(weekly?.grossKrw ?? 0)}</strong>
      <small>세전 단순 환산</small>
    </article>
    <article class="lkis-kpi-card">
      <span>월급 환산</span>
      <strong>{formatKrw(monthly?.grossKrw ?? 0)}</strong>
      <small>세전 단순 환산</small>
    </article>
  </div>
</section>
```

### 6.2 환산표

```astro
<section class="content-section lkis-breakdown" aria-labelledby="lkis-breakdown-title">
  <div class="lkis-section-heading">
    <p>주급·월급·일급</p>
    <h2 id="lkis-breakdown-title">연봉을 체감 단위로 나누면</h2>
    <span>모든 금액은 추정 연봉을 단순히 기간으로 나눈 값입니다.</span>
  </div>

  <div class="lkis-table-wrap">
    <table class="lkis-table">
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
            <td>{formatKrw(item.netLowKrw)}~{formatKrw(item.netHighKrw).replace("약 ", "")}</td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 6.3 비교 섹션

```astro
<section class="content-section lkis-compare" aria-labelledby="lkis-compare-title">
  <div class="lkis-section-heading">
    <p>대표팀 연봉 비교</p>
    <h2 id="lkis-compare-title">손흥민·김민재와 비교하면</h2>
    <span>기존 대한민국 월드컵 대표팀 연봉 순위 리포트와 같은 기준으로 비교합니다.</span>
  </div>

  <div class="lkis-player-grid">
    {LKIS_RELATED_PLAYER_SALARIES.map((player) => (
      <a class="lkis-player-card" href={withBase(player.href)}>
        <span class={`lkis-badge lkis-badge--${player.sourceBadge.replace(/\s/g, "-")}`}>{player.sourceBadge}</span>
        <strong>{player.nameKo}</strong>
        <small>{player.club} · {player.league}</small>
        <em>{formatKrw(player.annualSalaryKrw)}</em>
        <p>{player.note}</p>
      </a>
    ))}
  </div>
</section>
```

### 6.4 PSG 맥락 섹션

```astro
<section class="content-section lkis-context" aria-labelledby="lkis-context-title">
  <div class="lkis-section-heading">
    <p>계약 맥락</p>
    <h2 id="lkis-context-title">PSG 계약과 다음 연봉 변수</h2>
  </div>
  <div class="lkis-context-grid">
    <article>
      <h3>계약 기간</h3>
      <p>{LKIS_PLAYER.contractPeriodLabel}</p>
    </article>
    <article>
      <h3>포지션과 역할</h3>
      <p>공격형 미드필더와 윙어를 오가는 멀티 포지션 자원으로 평가됩니다.</p>
    </article>
    <article>
      <h3>상승 변수</h3>
      <p>월드컵 활약, 출전 시간, 챔피언스리그 기여도, 다음 이적·재계약 조건이 연봉 상승 변수입니다.</p>
    </article>
  </div>
</section>
```

---

## 7. SCSS (`src/styles/scss/pages/_lee-kang-in-psg-salary-2026.scss`)

```scss
.lkis-page {
  --lkis-ink: #172033;
  --lkis-muted: #667085;
  --lkis-line: #d8e0ea;
  --lkis-soft: #f5f8fb;
  --lkis-blue: #2f5acf;
  --lkis-green: #0f8a5f;
  --lkis-warn: #9a5b00;

  .lkis-section-heading {
    display: grid;
    gap: 6px;

    p,
    h2,
    span {
      margin: 0;
    }

    p {
      color: var(--lkis-blue);
      font-size: 12px;
      font-weight: 900;
    }

    h2 {
      color: var(--lkis-ink);
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.25;
      letter-spacing: 0;
    }

    span {
      color: var(--lkis-muted);
      font-size: 14px;
      line-height: 1.65;
    }
  }

  .lkis-kpi-grid,
  .lkis-player-grid,
  .lkis-context-grid,
  .lkis-related-grid {
    display: grid;
    gap: 12px;
  }

  .lkis-kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .lkis-kpi-card,
  .lkis-player-card,
  .lkis-context-grid article,
  .lkis-related-card {
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--lkis-line);
    border-radius: 8px;
    background: #fff;
    color: inherit;
    text-decoration: none;
  }

  .lkis-kpi-card {
    span,
    small {
      color: var(--lkis-muted);
      font-size: 12px;
      line-height: 1.45;
    }

    strong {
      color: var(--lkis-ink);
      font-size: clamp(22px, 4vw, 30px);
      line-height: 1.2;
      letter-spacing: 0;
    }

    &--primary {
      border-color: #b9ccff;
      background: #f6f9ff;
    }
  }

  .lkis-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--lkis-line);
    border-radius: 8px;
    background: #fff;
  }

  .lkis-table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: 14px;

    th,
    td {
      padding: 12px;
      border-bottom: 1px solid var(--lkis-line);
      text-align: left;
      vertical-align: top;
    }

    th {
      background: var(--lkis-soft);
      color: var(--lkis-ink);
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    td {
      color: var(--lkis-muted);
      line-height: 1.55;
    }

    td:first-child,
    td:nth-child(2),
    td:nth-child(3) {
      color: var(--lkis-ink);
      font-weight: 850;
      white-space: nowrap;
    }
  }

  .lkis-player-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .lkis-player-card {
    transition: border-color 0.16s, transform 0.16s;

    &:hover {
      border-color: var(--lkis-blue);
      transform: translateY(-1px);
    }

    strong {
      color: var(--lkis-ink);
      font-size: 18px;
      line-height: 1.35;
    }

    small,
    p {
      margin: 0;
      color: var(--lkis-muted);
      font-size: 13px;
      line-height: 1.6;
    }

    em {
      color: var(--lkis-blue);
      font-size: 20px;
      font-style: normal;
      font-weight: 900;
      line-height: 1.25;
    }
  }

  .lkis-badge {
    width: fit-content;
    padding: 4px 8px;
    border-radius: 999px;
    background: #fff4df;
    color: var(--lkis-warn);
    font-size: 11px;
    font-weight: 900;
    line-height: 1.2;

    &--보도-기준 {
      background: #eaf1ff;
      color: var(--lkis-blue);
    }

    &--추정,
    &--확인-필요 {
      background: #fff4df;
      color: var(--lkis-warn);
    }
  }

  .lkis-context-grid,
  .lkis-related-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .lkis-context-grid article {
    h3,
    p {
      margin: 0;
    }

    h3 {
      color: var(--lkis-ink);
      font-size: 16px;
      line-height: 1.35;
    }

    p {
      color: var(--lkis-muted);
      font-size: 14px;
      line-height: 1.65;
    }
  }

  .lkis-related-card {
    transition: border-color 0.16s, background 0.16s;

    &:hover {
      border-color: var(--lkis-blue);
      background: #f7faff;
    }

    strong,
    p {
      margin: 0;
    }

    strong {
      color: var(--lkis-ink);
      font-size: 15px;
      line-height: 1.35;
    }

    p {
      color: var(--lkis-muted);
      font-size: 13px;
      line-height: 1.6;
    }
  }

  @media (max-width: 640px) {
    .lkis-kpi-grid,
    .lkis-player-grid,
    .lkis-context-grid,
    .lkis-related-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .lkis-kpi-card strong {
      font-size: 24px;
    }
  }
}
```

---

## 8. SEO 콘텐츠 설계

`SeoContent` 입력:

```ts
const seoIntro = [
  "이강인 연봉은 PSG가 공식 계약서로 공개한 금액이 아니라 비공식 샐러리 DB와 언론 추정치를 바탕으로 확인할 수 있습니다. 따라서 이 페이지에서는 숫자를 확정값으로 쓰지 않고 추정 연봉, 세전 환산, 세후 시뮬레이션으로 구분해 표시합니다.",
  "기본 계산은 2026년 6월 기준 이강인의 PSG 추정 연봉 400만 유로와 1유로 1,485원 환율을 적용합니다. 이 기준이면 원화 연봉은 약 59.4억 원, 월급은 약 4.95억 원, 주급은 약 1.14억 원으로 환산됩니다.",
  "세후 실수령액은 프랑스 고소득자 세금과 사회부담금, 계약 구조에 따라 달라집니다. 이 페이지는 단정값 대신 세전 금액의 55~60%를 세후 범위로 보는 단순 시뮬레이션을 제공합니다.",
  "손흥민, 김민재와의 연봉 비교도 함께 제공합니다. 다만 선수 연봉은 리그, 포지션, 계약 시점, 나이, 구단 내 역할, 보너스 구조가 모두 다르기 때문에 선수 가치 순위처럼 해석하면 안 됩니다.",
  "PSG 보너스, 출전 수당, 우승 수당, 초상권, 광고 수입은 별도 계약일 수 있으며 이 페이지의 계산에는 포함하지 않습니다. 실제 총수입은 공개 연봉 추정치보다 높거나 낮을 수 있습니다.",
];

const seoCriteria = [
  "이강인 연봉은 비공식 추정값이므로 공식 확정값처럼 보지 않습니다.",
  "주급·월급·일급은 추정 연봉을 기간 단위로 나눈 단순 환산입니다.",
  "세후 실수령액은 프랑스 세제와 계약 구조를 단순화한 55~60% 범위로 봅니다.",
  "손흥민·김민재와의 비교는 대표팀 연봉 클러스터 내부 연결을 위한 참고 비교입니다.",
];
```

---

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `lee-kang-in-psg-salary-2026` 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/lee-kang-in-psg-salary-2026';` 추가 |
| `public/sitemap.xml` | `/reports/lee-kang-in-psg-salary-2026/` 추가 |
| `src/data/compareHub.ts` | 스포츠 카테고리에 `이강인 연봉 2026` 카드 추가 검토 |
| `src/data/koreaWorldcupSquadSalary2026.ts` | 관련 링크에 단일 이강인 리포트 추가 검토 |
| `src/data/koreaFootballLegendsSalaryComparison2026.ts` | 관련 링크에 단일 이강인 리포트 추가 검토 |

---

## 10. 내부 링크 수정 포인트

### 10.1 대표팀 연봉 리포트

파일:

```text
src/pages/reports/korea-worldcup-squad-salary-2026.astro
```

이강인 카드 또는 관련 링크 섹션에 추가:

```text
이강인 PSG 연봉·주급 자세히 보기
```

대상 URL:

```text
/reports/lee-kang-in-psg-salary-2026/
```

### 10.2 레전드 연봉 비교 리포트

파일:

```text
src/data/koreaFootballLegendsSalaryComparison2026.ts
```

`KFLS_RELATED_LINKS` 또는 이강인 카드 주변 CTA에 추가.

### 10.3 비교표 허브

파일:

```text
src/data/compareHub.ts
```

`sports` 카테고리에 카드 추가:

```ts
{
  id: "lee-kang-in-salary",
  title: "이강인 연봉 2026",
  description: "PSG 추정 연봉을 주급·월급·세후 실수령액으로 환산합니다.",
  href: "/reports/lee-kang-in-psg-salary-2026/",
  type: "report",
  categoryId: "sports",
  criteria: ["PSG", "주급", "세후 추정"],
  badges: [{ label: "신규", tone: "new" }, { label: "추정", tone: "estimate" }],
  stats: [{ label: "기준", value: "400만 EUR" }, { label: "환산", value: "세후" }],
  ctaLabel: "연봉 보기",
  priority: 0.5,
}
```

---

## 11. QA 포인트

- [ ] 페이지 제목과 description에 `이강인 연봉`, `PSG`, `주급`, `세후` 포함
- [ ] 모든 금액 근처에 `추정`, `세전`, `세후 시뮬레이션` 맥락 표시
- [ ] 세후 금액을 확정값처럼 표현하지 않음
- [ ] 환산표의 연봉·월급·주급·일급 값이 같은 기준에서 계산됨
- [ ] 손흥민·김민재 비교 값이 기존 대표팀 연봉 리포트와 일관됨
- [ ] 모바일 375px에서 KPI 카드와 환산표가 깨지지 않음
- [ ] JSON-LD `Article`, `FAQPage`, `BreadcrumbList` 생성
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 누락 없음
- [ ] `npm run build` 성공

---

## 12. 구현 리스크

- **공식값 오인**: `추정`, `세전 단순 환산`, `세후 시뮬레이션` 문구를 Hero 직후와 KPI 주변에 반복 노출.
- **이적설 반영 시점**: 공식 발표 전에는 이적 확정처럼 쓰지 않음. 문서 기준일을 `2026-06-18`로 명시.
- **세후율 논란**: 프랑스 세율을 특정 숫자로 단정하지 않고 55~60% 범위로만 표시.
- **검색어 만족도**: 첫 화면에서 연봉·주급·세후를 바로 보여주고, 긴 설명은 아래로 배치.
- **기존 클러스터와 중복**: 대표팀 연봉 리포트는 전체 순위, 이 페이지는 단일 선수 상세 환산으로 역할을 분리.
