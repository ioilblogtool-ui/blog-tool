# 코스피 사이드카 역대 최다 기록 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/kospi-sidecar-record-2026-plan.md`](../../plan/202607/kospi-sidecar-record-2026-plan.md)
> 작성일: 2026-07-24
> 유형: 정보성 리포트 (`/reports/`), 정적 임팩트형 페이지 (JS 계산 없음, 라이브 데이터 아님)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/kospiSidecarRecord2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/kospi-sidecar-record-2026.astro` |
| 스크립트 | (없음 — 정적 임팩트형 리포트, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_kospi-sidecar-record-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `ksr-` (Kospi Sidecar Record). `.op-page`/`.op-section`/`.op-message`/`.op-card-grid` 공유 클래스를 베이스로 얹는다 — `bitcoin-ethereum-etf-flow-history-2026` 등 최근 신규 리포트와 동일한 패턴.

---

## 2. URL 및 메타

```
슬러그: /reports/kospi-sidecar-record-2026/
타이틀(seoTitle): 코스피 사이드카 2026 | 2008년 금융위기 기록 넘은 변동성 정리
디스크립션: 2026년 코스피 사이드카가 37회로 2008년 금융위기 기록(26회)을 넘어섰습니다. 발동 조건, 역대 비교, 급증 원인을 한 번에 정리했습니다.
```

---

## 3. 데이터 파일 설계

**`src/data/kospiSidecarRecord2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type MechanismCard = {
  id: "sidecar" | "circuit-breaker";
  title: string;
  condition: string;   // 발동 조건
  effect: string;       // 효과
  note: string;          // 보조 설명
};

export type CumulativeStat = {
  id: string;
  label: string;         // "코스피 누적"
  value: string;         // "37회"
  note: string;
  highlight?: boolean;   // 대표 수치(합산) 강조 여부
};

export type HistoricalComparisonRow = {
  metric: string;         // "코스피 사이드카"
  year2008: string;       // "26회"
  year2026: string;       // "37회"
};

export type CauseCard = {
  title: string;
  detail: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const KSR_META = {
  slug: "kospi-sidecar-record-2026",
  title: "코스피 사이드카, 2008년 금융위기 기록을 넘어서다",
  seoTitle: "코스피 사이드카 2026 | 2008년 금융위기 기록 넘은 변동성 정리",
  seoDescription:
    "2026년 코스피 사이드카가 37회로 2008년 금융위기 기록(26회)을 넘어섰습니다. 발동 조건, 역대 비교, 급증 원인을 한 번에 정리했습니다.",
  description: "2026년 코스피 사이드카 누적 발동 현황, 2008년 금융위기와의 비교, 급증 원인을 한 화면에서 정리한 리포트입니다.",
  updatedAt: "2026-07-16",
  dataNote:
    "이 리포트의 누적 발동 횟수는 2026년 7월 16일 보도 기준 스냅샷이며 실시간 데이터가 아닙니다. 사이드카는 지금도 계속 발동되고 있어 실제 누적 횟수는 더 늘었을 수 있습니다. 최신 수치는 한국거래소 공시나 최근 기사에서 확인하는 것이 정확합니다. 이 리포트는 투자를 추천하지 않습니다.",
};

export const KSR_MECHANISM_CARDS: MechanismCard[] = [
  {
    id: "sidecar",
    title: "사이드카",
    condition: "코스피200 선물이 기준가 대비 상하 5% 이상 변동한 상태가 1분 이상 지속",
    effect: "프로그램 매매(선물·현물 간 가격 차익 거래) 호가 효력을 5분간 정지",
    note: "1996년 도입. 전체 매매가 아닌 프로그램 매매만 일시 정지하는 상대적으로 약한 조치.",
  },
  {
    id: "circuit-breaker",
    title: "서킷브레이커",
    condition: "코스피 지수가 큰 폭으로 급락한 상태가 일정 시간 지속 (단계별로 하락률 기준 다름)",
    effect: "시장 전체의 매매를 일정 시간 정지",
    note: "사이드카보다 강한 조치로, 발동 빈도는 사이드카보다 훨씬 낮음. 정확한 단계별 하락률·정지 시간은 구현 시 재확인 필요.",
  },
];

export const KSR_CUMULATIVE_STATS: CumulativeStat[] = [
  { id: "kospi", label: "코스피 누적", value: "37회", note: "2008년 연간 최다 기록(26회) 상회" },
  { id: "kosdaq", label: "코스닥 누적", value: "19회", note: "역대 최다였던 2008년과 동급 수준" },
  { id: "total", label: "코스피+코스닥 합산", value: "57회", note: "7월 중 발동 없는 거래일이 3일뿐이라는 보도까지 등장", highlight: true },
  { id: "multiple", label: "2008년 대비", value: "약 1.4배", note: "코스피 사이드카만 기준 (37회 ÷ 26회)" },
];

export const KSR_HISTORICAL_COMPARISON: HistoricalComparisonRow[] = [
  { metric: "코스피 사이드카", year2008: "26회", year2026: "37회" },
  { metric: "발동 패턴", year2008: "하반기 리먼 사태 이후 집중", year2026: "연중 고르게 빈발" },
];

export const KSR_CAUSE_CARDS: CauseCard[] = [
  {
    title: "반도체 대형주 쏠림",
    detail: "삼성전자·SK하이닉스 등 반도체 대형주의 증시 영향력이 커지면서, 이들 종목의 분 단위 변동성이 지수 전체로 쉽게 전이된다는 분석이 나옵니다.",
  },
  {
    title: "글로벌 반도체주 조정",
    detail: "AI 인프라 투자 대비 수익성 우려로 미국 반도체주가 조정을 받았고, 매도세가 국내 반도체 대형주로 번졌다는 보도가 이어졌습니다.",
  },
  {
    title: "레버리지 ETF 리밸런싱",
    detail: "삼성전자·SK하이닉스의 일일 수익률을 배수로 추종하는 상품이 늘면서, 장 마감 전 리밸런싱 매매가 변동성을 키웠다는 지적이 있습니다.",
  },
  {
    title: "기준금리 인상",
    detail: "한국은행이 기준금리를 2.50%에서 2.75%로 올리는 등 통화정책 변수도 변동성 확대 요인으로 언급됩니다.",
  },
  {
    title: "지정학적 리스크",
    detail: "중동 정세 불안 등 지정학적 리스크가 특정일 급락의 직접적인 계기로 보도된 사례가 있습니다.",
  },
];

export const KSR_FAQ: FaqItem[] = [
  {
    question: "사이드카가 발동되면 주식을 못 사고 파나요?",
    answer: "아니요, 개인 투자자의 일반 매매는 그대로 가능합니다. 사이드카는 선물·현물 간 가격 차익을 노리는 프로그램 매매 호가의 효력만 5분간 정지시키는 제도로, 일반 주문 체결에는 영향을 주지 않습니다.",
  },
  {
    question: "사이드카와 서킷브레이커는 뭐가 다른가요?",
    answer: "사이드카는 프로그램 매매만 5분간 일시 정지하는 반면, 서킷브레이커는 코스피 지수가 큰 폭으로 급락했을 때 시장 전체의 매매를 일정 시간 정지시키는 더 강한 조치입니다. 발동 빈도도 사이드카가 훨씬 잦습니다.",
  },
  {
    question: "2026년에 사이드카가 왜 이렇게 자주 발동되나요?",
    answer: "반도체 대형주로의 수급 쏠림, 글로벌 반도체주 조정, 레버리지 ETF 리밸런싱, 기준금리 인상, 지정학적 리스크 등이 복합적으로 작용했다는 분석이 나옵니다. 다만 언론 보도를 종합한 분석이며 공식적으로 확정된 단일 원인은 아닙니다.",
  },
  {
    question: "2026년 사이드카 발동 횟수는 실시간 수치인가요?",
    answer: "아닙니다. 이 리포트의 수치는 2026년 7월 16일 보도 기준 스냅샷이며, 사이드카는 지금도 계속 발동되고 있어 실제 누적 횟수는 더 늘었을 수 있습니다. 최신 수치는 한국거래소 공시나 최근 기사에서 확인하는 것이 정확합니다.",
  },
  {
    question: "사이드카 발동이 많으면 투자를 쉬어야 하나요?",
    answer: "사이드카 발동 자체가 매수·매도 신호는 아닙니다. 다만 변동성이 큰 국면에서는 한 번에 매매하기보다 적립식으로 나눠 투자하는 방식이 위험을 분산하는 데 도움이 될 수 있습니다.",
  },
];

export const KSR_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-stocks-h1-2026/", label: "반도체 대장주 상반기 리포트", description: "삼성전자·SK하이닉스 등 반도체 대형주 상반기 흐름을 정리합니다." },
  { href: "/reports/ai-stocks-h1-2026/", label: "AI 관련주 상반기 리포트", description: "글로벌 AI 관련주 상반기 조정 흐름을 정리합니다." },
  { href: "/reports/etf-vs-direct-stock-10year-2026/", label: "ETF vs 직접투자 10년 비교", description: "변동성 국면에서 투자 방식별 장단기 성과를 비교합니다." },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기", description: "정기적으로 나눠 투자했을 때의 예상 결과를 계산합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 2026년 증시 변동성
 └─ title: 코스피 사이드카, 2008년 금융위기 기록을 넘어서다
 └─ description: 누적 발동 현황, 2008년 대비, 급증 원인을 한 화면에서 정리

InfoNotice ("실시간 데이터 아님 — 조회 시점 스냅샷" + 투자 추천 아님)

섹션 1 — 사이드카란? 서킷브레이커와 차이 — KSR_MECHANISM_CARDS 카드 2개
섹션 2 — 2026년 누적 발동 현황 ★ — KSR_CUMULATIVE_STATS (report-stat-card 4개, 신선도 안내 강조)
섹션 3 — 역대 비교 — 2008년 금융위기 vs 2026년 — KSR_HISTORICAL_COMPARISON 표
섹션 4 — 왜 이렇게 자주 발동되나 — KSR_CAUSE_CARDS 5개
섹션 5 — 개인 투자자에게 주는 의미 (짧은 해석 블록, op-message)
SeoContent (FAQ + 관련 링크)
```

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 | Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title`, `lines` |
| `SeoContent.astro` | FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 페이지 전용 마크업 (`ksr-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.ksr-page` | 루트 스코프 |
| `.ksr-mechanism-grid` | 섹션 1 — 사이드카/서킷브레이커 카드 2개 |
| `.ksr-mechanism-card[data-id]` | 공용 카드, `id="sidecar"`(주황 계열)/`"circuit-breaker"`(적색 계열) 강조색 분기 |
| `report-stat-card` / `report-stat-card--primary` | 섹션 2 — 누적 발동 현황 4개 (공유 컴포넌트 클래스 재사용, `total` 카드에 `--primary`) |
| `.ksr-comparison-table` | 섹션 3 — 2008 vs 2026 비교표 |
| `.ksr-cause-grid` | 섹션 4 — 급증 원인 카드 5개 |
| `.op-message` | 섹션 5 — 개인 투자자 해석 블록 (공유 클래스) |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_kospi-sidecar-record-2026.scss`

```scss
.ksr-page {
  --ksr-line: #d8e0ea;
  --ksr-sidecar: #d97706;
  --ksr-cb: #dc2626;

  .ksr-mechanism-grid,
  .ksr-cause-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .ksr-cause-grid {
    grid-template-columns: repeat(2, 1fr);

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .ksr-mechanism-card {
    border: 1px solid var(--ksr-line);
    border-radius: 12px;
    padding: 1.25rem;
    border-top: 4px solid transparent;

    &[data-id="sidecar"] { border-top-color: var(--ksr-sidecar); }
    &[data-id="circuit-breaker"] { border-top-color: var(--ksr-cb); }
  }

  .ksr-comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--ksr-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
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
import {
  KSR_META,
  KSR_MECHANISM_CARDS,
  KSR_CUMULATIVE_STATS,
  KSR_HISTORICAL_COMPARISON,
  KSR_CAUSE_CARDS,
  KSR_FAQ,
  KSR_RELATED_LINKS,
} from "../../data/kospiSidecarRecord2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${KSR_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: KSR_META.title,
    description: KSR_META.seoDescription,
    dateModified: KSR_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KSR_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: KSR_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={KSR_META.seoTitle} description={KSR_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page ksr-page" data-report="kospi-sidecar-record-2026">
    <CalculatorHero
      eyebrow="2026년 증시 변동성"
      title={KSR_META.title}
      description={KSR_META.description}
    />

    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={[
        KSR_META.dataNote,
        "이 리포트는 투자를 추천하지 않습니다.",
      ]}
    />

    <section class="op-section">
      <h2>사이드카란? 서킷브레이커와 차이</h2>
      <div class="ksr-mechanism-grid">
        {KSR_MECHANISM_CARDS.map((m) => (
          <article class="ksr-mechanism-card" data-id={m.id}>
            <strong>{m.title}</strong>
            <p>발동 조건: {m.condition}</p>
            <p>효과: {m.effect}</p>
            <small>{m.note}</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>2026년 누적 발동 현황</h2>
      <div class="op-card-grid">
        {KSR_CUMULATIVE_STATS.map((s) => (
          <article class={`report-stat-card ${s.highlight ? "report-stat-card--primary" : ""}`}>
            <strong>{s.value}</strong>
            <p>{s.label}</p>
            <small>{s.note}</small>
          </article>
        ))}
      </div>
      <p class="op-message">{KSR_META.updatedAt} 기준 스냅샷입니다 — 실시간 수치가 아닙니다.</p>
    </section>

    <section class="op-section">
      <h2>역대 비교 — 2008년 금융위기 vs 2026년</h2>
      <table class="ksr-comparison-table">
        <thead>
          <tr><th>구분</th><th>2008년(금융위기)</th><th>2026년(현재까지)</th></tr>
        </thead>
        <tbody>
          {KSR_HISTORICAL_COMPARISON.map((row) => (
            <tr><td>{row.metric}</td><td>{row.year2008}</td><td>{row.year2026}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="op-section">
      <h2>왜 이렇게 자주 발동되나</h2>
      <div class="ksr-cause-grid">
        {KSR_CAUSE_CARDS.map((c) => (
          <article class="ksr-mechanism-card">
            <strong>{c.title}</strong>
            <p>{c.detail}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>개인 투자자에게 주는 의미</h2>
      <p class="op-message">
        사이드카 발동 자체가 매수·매도 신호는 아닙니다. 다만 변동성이 큰 국면에서는
        한 번에 매매하기보다 나눠서 투자하는 방식이 위험을 분산하는 데 도움이 될 수 있습니다.
        투자 판단은 본인 책임 하에 신중하게 결정해야 합니다.
      </p>
    </section>

    <SeoContent
      introTitle="코스피 사이드카 역대 최다 기록 핵심 정리"
      intro={[KSR_META.description, KSR_META.dataNote]}
      criteria={[
        "누적 발동 횟수는 2026년 7월 16일 보도 기준 스냅샷이며 실시간 데이터가 아닙니다.",
        "급증 원인 5가지는 언론 보도의 분석·추정을 종합한 것이며 공식 원인 규명이 아닙니다.",
        "서킷브레이커의 정확한 단계별 발동 조건은 한국거래소 공식 자료로 별도 확인이 필요합니다.",
        "이 리포트는 투자를 추천하지 않습니다.",
      ]}
      faq={KSR_FAQ}
      related={KSR_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "kospi-sidecar-record-2026",
  title: "코스피 사이드카 2026 | 2008년 금융위기 기록 넘은 변동성 정리",
  description: "2026년 코스피 사이드카가 37회로 2008년 금융위기 기록(26회)을 넘어섰습니다. 발동 조건, 역대 비교, 급증 원인을 한 번에 정리했습니다.",
  order: 72, // 등록 시점 최신 순번으로 재확인 필요
  badges: ["코스피", "사이드카", "변동성", "2026"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"kospi-sidecar-record-2026": { category: "asset", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"kospi-sidecar-record-2026": {
  eyebrow: "2026년 증시 변동성",
  tags: [{ label: "코스피", mod: "asset" }, { label: "사이드카", mod: "asset" }, { label: "변동성", mod: "asset" }],
  category: "asset",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/kospi-sidecar-record-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/kospi-sidecar-record-2026/</loc>
  <lastmod>2026-07-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 반도체 대장주 상반기 리포트 | `/reports/semiconductor-stocks-h1-2026/` |
| SeoContent related | AI 관련주 상반기 리포트 | `/reports/ai-stocks-h1-2026/` |
| SeoContent related | ETF vs 직접투자 10년 비교 | `/reports/etf-vs-direct-stock-10year-2026/` |
| SeoContent related | 적립식 투자 계산기 | `/tools/dca-investment-calculator/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] **구현 시점에 코스피·코스닥·합산 누적 발동 횟수를 재검색해 최신 스냅샷으로 갱신** (이 설계서의 수치는 2026-07-16 보도 기준)
- [ ] 서로 다른 기사에서 나온 숫자를 섞지 않기 — 코스피/코스닥/합산/2008년 대비 배수 모두 **하나의 기준일** 보도에서 가져올 것
- [ ] 서킷브레이커 섹션의 단계별 발동 조건(하락률·지속시간·정지시간)은 이 설계서에 정확한 수치를 넣지 않았음 — 구현 시 한국거래소 공식 자료로 재확인 후 채울 것
- [ ] "역대 최다" 표현은 코스피 단독 기준(2008년 26회 대비)에서만 명확한 팩트 — 코스닥/합산 기준 "역대 최다" 문구는 보도 표현을 그대로 과장하지 않도록 재확인
- [ ] "실시간 아님", "OO월 OO일 기준" 문구가 InfoNotice·누적 발동 현황 섹션·SeoContent criteria 세 군데 모두에 노출되는지 확인
- [ ] 급증 원인 5가지 카드가 단정형 문장("~때문이다")이 아니라 추정형 표현("~로 지목된다", "~라는 분석이 나온다")을 쓰고 있는지 확인
- [ ] 섹션 5(개인 투자자에게 주는 의미)가 투자 조언으로 읽히지 않는지, "투자 판단은 본인 책임" 문구가 포함됐는지 확인
- [ ] `report-stat-card--primary`가 `total`(합산) 카드 1개에만 적용됐는지 확인
- [ ] 모바일에서 2열 → 1열 전환 확인 (섹션 1·4)
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 존재 확인

---

## 13. 향후 갱신 계획

이 리포트는 라이브 데이터가 아니므로, **분기 단위(3개월)** 또는 연말 최종 결산 시 1회 누적 발동 현황을 수동 갱신하는 것을 권장한다. 갱신할 때마다 `KSR_META.updatedAt`과 누적 발동 현황 섹션의 안내 문구를 함께 업데이트하고, 사이트맵 `lastmod`도 맞춰 갱신한다.
