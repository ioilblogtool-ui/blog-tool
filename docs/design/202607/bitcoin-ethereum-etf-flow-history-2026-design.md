# 비트코인·이더리움 ETF 자금 흐름 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/bitcoin-ethereum-etf-flow-history-2026-plan.md`](../../plan/202607/bitcoin-ethereum-etf-flow-history-2026-plan.md)
> 작성일: 2026-07-07
> 유형: 정보성 리포트 (`/reports/`), 정적 회고형 페이지 (JS 계산 없음, 라이브 데이터 아님)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/bitcoinEthereumEtfFlowHistory2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/bitcoin-ethereum-etf-flow-history-2026.astro` |
| 스크립트 | (없음 — 정적 회고형 리포트, 라이브 데이터 연동 없음) |
| 스타일 | `src/styles/scss/pages/_bitcoin-ethereum-etf-flow-history-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `bef-` (Bitcoin Ethereum etf Flow). `.op-page`/`.op-section`/`.op-message`/`.op-card-grid` 공유 클래스를 베이스로 얹는다 — 오늘 만든 모든 신규 리포트와 동일한 패턴.

---

## 2. URL 및 메타

```
슬러그: /reports/bitcoin-ethereum-etf-flow-history-2026/
타이틀(seoTitle): 비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리
디스크립션: 2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.
```

---

## 3. 데이터 파일 설계

**`src/data/bitcoinEthereumEtfFlowHistory2026.ts`**

```ts
import { BTC_YEARS } from "./bitcoinAnnualReturn";
import { ethereumReturnRows } from "./ethereumHistoricalReturns20152026";

// ── 타입 ──────────────────────────────────────────

export type EtfAsset = "BTC" | "ETH";

export type LaunchProfile = {
  asset: EtfAsset;
  launchDate: string;      // "2024년 1월"
  products: string;         // "IBIT, FBTC, ARKB, GBTC 전환 등"
};

export type CumulativeSnapshot = {
  asset: EtfAsset;
  label: string;            // "약 530억~570억 달러"
  note: string;
  asOfLabel: string;        // "2026년 상반기 기준"
};

export type EventTimelineItem = {
  date: string;             // "2024-01"
  dateLabel: string;        // "2024년 1월"
  title: string;
  detail: string;
};

export type PriceComparisonRow = {
  asset: EtfAsset;
  launchPriceLabel: string; // "$42,208 (2024년 초)"
  currentPriceLabel: string; // "$60,000"
  cumulativeLabel: string;   // "여전히 플러스" | "마이너스"
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

// 가격은 기존 리포트 데이터를 그대로 인용 — 새 숫자를 만들지 않음
const btc2024 = BTC_YEARS.find((y) => y.year === 2024)!;
const btc2026 = BTC_YEARS.find((y) => y.year === 2026)!;
const eth2024 = ethereumReturnRows.find((y) => y.year === 2024)!;
const eth2026 = ethereumReturnRows.find((y) => y.year === 2026)!;

export const BEF_META = {
  slug: "bitcoin-ethereum-etf-flow-history-2026",
  title: "비트코인·이더리움 ETF, 출시부터 지금까지",
  seoTitle: "비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리",
  seoDescription:
    "2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.",
  description: "2024년 ETF 출시 이후 지금까지의 누적 순유입, 핵심 사건, 가격 흐름을 한 화면에서 정리한 회고형 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "이 리포트의 누적 순유입액·월별 유출입 수치는 2026년 7월 초 보도 기준 스냅샷이며 실시간 데이터가 아닙니다. ETF 자금 흐름은 매일 바뀌므로, 최신 수치는 CoinGlass 등 실시간 트래커에서 확인해야 합니다. 이 리포트는 투자를 추천하지 않으며, ETF 출시 이후 흐름을 정리한 정보성 콘텐츠입니다.",
};

export const BEF_LAUNCH_PROFILES: LaunchProfile[] = [
  { asset: "BTC", launchDate: "2024년 1월", products: "BlackRock IBIT, Fidelity FBTC, ARK 21Shares ARKB, Grayscale GBTC 전환 등" },
  { asset: "ETH", launchDate: "2024년 7월", products: "BlackRock ETHA, Fidelity FETH 등" },
];

export const BEF_CUMULATIVE_SNAPSHOT: CumulativeSnapshot[] = [
  {
    asset: "BTC",
    label: "약 530억~570억 달러",
    note: "2025년 10월 약 630억 달러로 정점을 찍은 뒤 2026년 상반기 조정을 거치며 감소",
    asOfLabel: "2026년 7월 초 기준",
  },
  {
    asset: "ETH",
    label: "BTC 대비 훨씬 작은 규모",
    note: "출시 첫해(2024년 7월) 월 최대 약 54억 달러 순유입을 기록한 바 있으나, 전체 누적 규모는 BTC ETF 대비 작고 월별 변동성이 큼",
    asOfLabel: "2026년 7월 초 기준",
  },
];

export const BEF_EVENT_TIMELINE: EventTimelineItem[] = [
  { date: "2024-01", dateLabel: "2024년 1월", title: "비트코인 현물 ETF 출시", detail: "미국에서 비트코인 현물 ETF가 승인·출시됐습니다." },
  { date: "2024-07", dateLabel: "2024년 7월", title: "이더리움 현물 ETF 출시", detail: "출시 첫 달부터 월 약 54억 달러 순유입을 기록하며 당시 최대치를 나타냈습니다." },
  { date: "2025-10", dateLabel: "2025년 10월", title: "비트코인 ETF 누적 순유입 정점", detail: "누적 순유입액이 약 630억 달러로 최고치를 기록했습니다." },
  { date: "2026-06", dateLabel: "2026년 6월", title: "비트코인 ETF 최대 월간 순유출", detail: "약 45억 달러 순유출로, 2024년 1월 출시 이후 최대 규모의 월간 유출을 기록했습니다." },
  { date: "2026-06b", dateLabel: "2026년 6월 말", title: "순유출 행진 종료", detail: "순유출 행진이 끝나고 일시적 순유입으로 전환되며 비트코인 가격이 $63,000대까지 반등했습니다." },
];

export const BEF_PRICE_COMPARISON: PriceComparisonRow[] = [
  {
    asset: "BTC",
    launchPriceLabel: `$${btc2024.startPrice.toLocaleString("en-US")} (2024년 초)`,
    currentPriceLabel: `$${btc2026.endPrice.toLocaleString("en-US")}`,
    cumulativeLabel: "여전히 플러스",
  },
  {
    asset: "ETH",
    launchPriceLabel: `$${eth2024.startPrice!.toLocaleString("en-US")} (2024년 초)`,
    currentPriceLabel: `$${eth2026.endPrice.toLocaleString("en-US")}`,
    cumulativeLabel: "마이너스",
  },
];

export const BEF_FAQ: FaqItem[] = [
  {
    question: "비트코인·이더리움 ETF는 언제 출시됐나요?",
    answer: "비트코인 현물 ETF는 2024년 1월, 이더리움 현물 ETF는 2024년 7월 미국에서 승인·출시됐습니다.",
  },
  {
    question: "ETF 순유입이 많으면 가격이 오르나요?",
    answer:
      "시점상 상관관계는 보이지만 단정할 인과관계는 아닙니다. 2025년 10월 비트코인 ETF 순유입이 정점을 찍었을 때 가격도 강세였고, 2026년 6월 대규모 순유출 시기에는 가격이 조정을 받았습니다. 다만 거시경제, 규제, 기업 트레저리 수요 등 다른 변수도 함께 작용합니다.",
  },
  {
    question: "지금(2026년 상반기) ETF 자금 흐름은 어떤가요?",
    answer: "2026년 6월 비트코인 ETF에서 출시 이후 최대 규모인 약 45억 달러 순유출이 발생했다가, 6월 말 순유출 행진이 끝나고 일시적으로 순유입으로 전환되며 가격이 반등했습니다.",
  },
  {
    question: "비트코인과 이더리움 중 ETF 성과는 어디가 더 좋았나요?",
    answer:
      "비트코인은 ETF 출시 시점 가격 대비 지금도 여전히 플러스지만, 이더리움은 출시 시점 대비 마이너스입니다. 누적 순유입 규모도 비트코인 ETF가 이더리움 ETF보다 훨씬 큽니다.",
  },
  {
    question: "이 리포트의 순유입 수치는 실시간인가요?",
    answer: "아닙니다. 2026년 7월 초 보도를 기준으로 한 스냅샷입니다. ETF 자금 흐름은 매일 바뀌므로 최신 수치는 CoinGlass 등 실시간 트래커에서 확인하는 것이 정확합니다.",
  },
];

export const BEF_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/bitcoin-annual-return-history/", label: "비트코인 연도별 수익률 역사", description: "2011년부터 지금까지 비트코인 연도별 가격과 수익률을 정리합니다." },
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름을 정리합니다." },
  { href: "/reports/ethereum-undervaluation-thesis-2026/", label: "이더리움은 왜 저평가일까 2026", description: "ETH ETF 순유출을 회의론 근거로 다룬 리포트입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: ETF 자금 흐름
 └─ title: 비트코인·이더리움 ETF, 출시부터 지금까지
 └─ description: 누적 순유입, 핵심 사건, 가격 흐름을 한 화면에서 정리

InfoNotice ("실시간 데이터 아님 — 조회 시점 스냅샷" + 투자 추천 아님)

섹션 1 — 출시 시점과 배경 — BEF_LAUNCH_PROFILES 카드 2개 (BTC/ETH)
섹션 2 — 누적 순유입 스냅샷 ★ — BEF_CUMULATIVE_SNAPSHOT 카드 2개 (신선도 안내 강조)
섹션 3 — 핵심 사건 타임라인 — BEF_EVENT_TIMELINE 5개, 시간순
섹션 4 — 가격으로 보면 — BTC vs ETH — BEF_PRICE_COMPARISON 표
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

### 페이지 전용 마크업 (`bef-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.bef-page` | 루트 스코프 |
| `.bef-launch-grid` | 섹션 1 — 출시 프로필 카드 2개 |
| `.bef-snapshot-grid` | 섹션 2 — 누적 순유입 카드 2개 |
| `.bef-card[data-asset]` | 공용 카드, `asset="BTC"`(주황)/`"ETH"`(파랑) 강조색 분기 — 섹션 1·2·4에서 재사용 |
| `.bef-timeline` | 섹션 3 — 사건 타임라인 |
| `.bef-price-table` | 섹션 4 — BTC vs ETH 가격 비교표 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_bitcoin-ethereum-etf-flow-history-2026.scss`

```scss
.bef-page {
  --bef-line: #d8e0ea;
  --bef-btc: #f7931a;
  --bef-eth: #627eea;

  .bef-launch-grid,
  .bef-snapshot-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .bef-card {
    border: 1px solid var(--bef-line);
    border-radius: 12px;
    padding: 1.25rem;
    border-top: 4px solid transparent;

    &[data-asset="BTC"] { border-top-color: var(--bef-btc); }
    &[data-asset="ETH"] { border-top-color: var(--bef-eth); }
  }

  .bef-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__item {
      border: 1px solid var(--bef-line);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
  }

  .bef-price-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--bef-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }

    th:nth-child(1), td:nth-child(1) { }
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
  BEF_META,
  BEF_LAUNCH_PROFILES,
  BEF_CUMULATIVE_SNAPSHOT,
  BEF_EVENT_TIMELINE,
  BEF_PRICE_COMPARISON,
  BEF_FAQ,
  BEF_RELATED_LINKS,
} from "../../data/bitcoinEthereumEtfFlowHistory2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${BEF_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: BEF_META.title,
    description: BEF_META.seoDescription,
    dateModified: BEF_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BEF_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: BEF_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={BEF_META.seoTitle} description={BEF_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page bef-page" data-report="bitcoin-ethereum-etf-flow-history-2026">
    <CalculatorHero
      eyebrow="ETF 자금 흐름"
      title={BEF_META.title}
      description={BEF_META.description}
    />

    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={[
        BEF_META.dataNote,
        "이 리포트는 투자를 추천하지 않습니다.",
      ]}
    />

    <section class="op-section">
      <h2>출시 시점과 배경</h2>
      <div class="bef-launch-grid">
        {BEF_LAUNCH_PROFILES.map((p) => (
          <article class="bef-card" data-asset={p.asset}>
            <strong>{p.asset} 현물 ETF</strong>
            <p>{p.launchDate} 출시</p>
            <small>{p.products}</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>누적 순유입 스냅샷</h2>
      <div class="bef-snapshot-grid">
        {BEF_CUMULATIVE_SNAPSHOT.map((s) => (
          <article class="bef-card" data-asset={s.asset}>
            <strong>{s.asset}: {s.label}</strong>
            <p>{s.note}</p>
            <small>{s.asOfLabel} — 실시간 수치가 아닙니다</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>핵심 사건 타임라인</h2>
      <div class="bef-timeline">
        {BEF_EVENT_TIMELINE.map((e) => (
          <article class="bef-timeline__item">
            <strong>{e.dateLabel}</strong>
            <div>
              <p>{e.title}</p>
              <small>{e.detail}</small>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>가격으로 보면 — BTC vs ETH</h2>
      <table class="bef-price-table">
        <thead>
          <tr><th>자산</th><th>ETF 출시 시점 가격</th><th>2026년 7월 현재</th><th>출시 이후 누적</th></tr>
        </thead>
        <tbody>
          {BEF_PRICE_COMPARISON.map((row) => (
            <tr><td>{row.asset}</td><td>{row.launchPriceLabel}</td><td>{row.currentPriceLabel}</td><td>{row.cumulativeLabel}</td></tr>
          ))}
        </tbody>
      </table>
      <p class="op-message">가격은 ETF 자금 흐름 외에도 거시경제, 규제, 기업 트레저리 수요 등 다양한 변수의 영향을 받습니다.</p>
    </section>

    <SeoContent
      introTitle="비트코인·이더리움 ETF 자금 흐름 핵심 정리"
      intro={[BEF_META.description, BEF_META.dataNote]}
      criteria={[
        "누적 순유입액·월별 유출입은 2026년 7월 초 보도 기준 스냅샷이며 실시간 데이터가 아닙니다.",
        "가격 데이터는 이 사이트의 비트코인·이더리움 연도별 수익률 리포트와 동일 출처를 인용했습니다.",
        "ETF 자금 흐름과 가격의 상관관계를 소개하지만, 인과관계를 단정하지 않습니다.",
        "이 리포트는 투자를 추천하지 않습니다.",
      ]}
      faq={BEF_FAQ}
      related={BEF_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "bitcoin-ethereum-etf-flow-history-2026",
  title: "비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리",
  description: "2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.",
  order: 71,
  badges: ["비트코인", "이더리움", "ETF", "2026"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"bitcoin-ethereum-etf-flow-history-2026": { category: "crypto", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"bitcoin-ethereum-etf-flow-history-2026": {
  eyebrow: "ETF 자금 흐름",
  tags: [{ label: "비트코인", mod: "asset" }, { label: "이더리움", mod: "asset" }, { label: "ETF", mod: "asset" }],
  category: "crypto",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/bitcoin-ethereum-etf-flow-history-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/bitcoin-ethereum-etf-flow-history-2026/</loc>
  <lastmod>2026-07-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 비트코인 연도별 수익률 역사 | `/reports/bitcoin-annual-return-history/` |
| SeoContent related | 이더리움 역사 수익률 2015-2026 | `/reports/ethereum-historical-returns-2015-2026/` |
| SeoContent related | 이더리움은 왜 저평가일까 2026 | `/reports/ethereum-undervaluation-thesis-2026/` |
| SeoContent related | 코인 적립식 투자 계산기 | `/tools/coin-dca-calculator/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] **구현 시점에 누적 순유입·월별 유출입 수치를 재검색해 최신 스냅샷으로 갱신** (이 설계서의 수치는 2026-07-07 검색 기준)
- [ ] "실시간 아님", "OO월 기준" 문구가 InfoNotice·누적 순유입 카드·SeoContent criteria 세 군데 모두에 노출되는지 확인 — 라이브 트래커로 오인되지 않게
- [ ] BTC/ETH 가격 수치가 `bitmineVsStrategy2026.ts`·`ethereumUndervaluationThesis2026.ts`·`bitcoinAnnualReturn.ts`·`ethereumHistoricalReturns20152026.ts`와 정확히 일치하는지 확인 (네 파일 간 단일 출처 원칙)
- [ ] "ETF 순유입이 가격을 움직인다"는 표현이 인과관계 단정으로 읽히지 않는지 재확인 — 상관관계 톤 유지
- [ ] `.bef-card[data-asset]` BTC=주황/ETH=파랑 색상이 출시 프로필·누적 스냅샷 두 섹션 모두에 일관되게 적용되는지 확인
- [ ] 모바일에서 2열 → 1열 전환 확인 (섹션 1·2)
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 존재 확인

---

## 13. 향후 갱신 계획

이 리포트는 라이브 데이터가 아니므로, **분기 단위(3개월)** 로 누적 순유입 스냅샷과 사건 타임라인을 수동 갱신하는 것을 권장한다. 갱신할 때마다 `BEF_META.updatedAt`과 각 카드의 `asOfLabel`을 함께 업데이트하고, 사이트맵 `lastmod`도 맞춰 갱신한다.
