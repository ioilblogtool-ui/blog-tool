# 비트마인 vs 스트래티지 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/bitmine-vs-strategy-2026-plan.md`](../../plan/202607/bitmine-vs-strategy-2026-plan.md)
> 작성일: 2026-07-07
> 유형: 비교형 리포트 (`/reports/`), 정적 페이지 (JS 계산 없음)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/bitmineVsStrategy2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 `category`/`tags` 맵 — 홈과 분리 관리되므로 **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/bitmine-vs-strategy-2026.astro` |
| 스크립트 | (없음 — 정적 비교 리포트) |
| 스타일 | `src/styles/scss/pages/_bitmine-vs-strategy-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `bvs-` (Bitmine Vs Strategy). `.op-page`/`.op-section`/`.op-message`/`.op-card-grid` 공유 클래스를 베이스로 얹는다 — `samsung-ai-modular-home-2026`과 동일한 실제 운영 패턴.

**참고 타입 재사용:** `bitcoinSupplyHolders2026.ts`의 `CorporateHolder` 타입(rank, company, country, ticker, btcHeld, avgCostUsd, currentValueUsd, strategy, note, type)을 참고하되, 이 리포트는 자산이 BTC/ETH로 서로 다르므로 `asset: "BTC" | "ETH"`, `holdingAmount`(자산 수량), `pctOfSupply`(공급량 대비 비중), `stakingYieldUsd?`(스테이킹 수익, ETH만 해당) 필드를 추가한 별도 타입으로 정의한다.

---

## 2. URL 및 메타

```
슬러그: /reports/bitmine-vs-strategy-2026/
타이틀(seoTitle): 비트마인 vs 스트래티지 2026 | 이더리움·비트코인 보유량 비교
디스크립션: 비트마인 ETH 약 540만개, 스트래티지 BTC 약 84만개 보유 현황을 비교합니다. 스테이킹 수익 차이, 목표 보유 비중, 2026년 미실현 손실 리스크까지 정리했습니다.
```

---

## 3. 데이터 파일 설계

**`src/data/bitmineVsStrategy2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type CompanyAsset = "BTC" | "ETH";

export type CompanyProfile = {
  id: "bitmine" | "strategy";
  company: string;          // "비트마인 (Bitmine Immersion Technologies)"
  ticker: string;            // "BMNR" | "MSTR"
  asset: CompanyAsset;
  holdingLabel: string;      // "약 540만~570만 ETH" (표시용, 범위 있는 값은 문자열로)
  pctOfSupplyLabel: string;  // "약 4.7%"
  targetLabel: string;       // "유통량 5% 확보" | "100만 BTC 확보"
  leader: string;            // "톰 리 (펀드스트랫 창립자)"
  fundingModel: string;      // 자금 조달 방식 설명
  stakingYieldLabel?: string; // ETH만: "연 약 2.76억 달러 기대"
  riskNote: string;          // 최근 손실 관련 서술
};

export type ComparisonRow = {
  label: string;
  bitmine: string;
  strategy: string;
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

export const BVS_META = {
  slug: "bitmine-vs-strategy-2026",
  title: "비트마인 vs 스트래티지, 이더리움·비트코인 기업 트레저리 비교",
  seoTitle: "비트마인 vs 스트래티지 2026 | 이더리움·비트코인 보유량 비교",
  seoDescription:
    "비트마인 ETH 약 540만개, 스트래티지 BTC 약 84만개 보유 현황을 비교합니다. 스테이킹 수익 차이, 목표 보유 비중, 2026년 미실현 손실 리스크까지 정리했습니다.",
  description: "이더리움·비트코인 기업 트레저리 두 회사의 보유 규모, 전략, 리스크를 나란히 비교한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "보유량·평가손실 수치는 2026년 6월 말~7월 초 보도·공시 기준이며 실시간 수치가 아닙니다. 코인 가격 변동에 따라 평가금액과 손익은 매일 달라질 수 있습니다. 이 리포트는 두 회사 중 어느 쪽이 더 나은 투자인지 추천하지 않으며, 기업 트레저리 전략의 구조적 차이를 설명하는 정보성 콘텐츠입니다.",
};

export const BVS_COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: "bitmine",
    company: "비트마인 (Bitmine Immersion Technologies)",
    ticker: "BMNR",
    asset: "ETH",
    holdingLabel: "약 540만~570만 ETH",
    pctOfSupplyLabel: "약 4.7%",
    targetLabel: "이더리움 유통량 5% 확보 (추가 약 64만 ETH 필요)",
    leader: "톰 리 (펀드스트랫 창립자)",
    fundingModel: "주식 발행(ATM)으로 자금을 조달해 ETH 매입",
    stakingYieldLabel: "보유 ETH 스테이킹으로 연 약 2.76억 달러 수익 기대",
    riskNote: "2026년 상반기 ETH 급락으로 평가손실이 약 12조원대까지 확대 보도됨.",
  },
  {
    id: "strategy",
    company: "스트래티지 (구 MicroStrategy)",
    ticker: "MSTR",
    asset: "BTC",
    holdingLabel: "약 84.7만 BTC",
    pctOfSupplyLabel: "약 4%+",
    targetLabel: "100만 BTC 확보",
    leader: "마이클 세일러",
    fundingModel: "주식·전환사채 발행(ATM)으로 자금을 조달해 BTC 매입",
    stakingYieldLabel: undefined,
    riskNote: "2026년 1분기에만 약 125억 달러 손실 보고. 2025년 10월 고점 대비 BTC 52% 하락 영향.",
  },
];

export const BVS_COMPARISON_TABLE: ComparisonRow[] = [
  { label: "보유 자산", bitmine: "이더리움(ETH)", strategy: "비트코인(BTC)" },
  { label: "보유량", bitmine: "약 540만~570만 ETH", strategy: "약 84.7만 BTC" },
  { label: "전체 공급량 대비", bitmine: "약 4.7%", strategy: "약 4%+" },
  { label: "목표 비중", bitmine: "유통량 5%", strategy: "100만 BTC" },
  { label: "스테이킹 수익", bitmine: "연 약 2.76억 달러 기대", strategy: "없음 (BTC 구조상 불가)" },
  { label: "리더", bitmine: "톰 리", strategy: "마이클 세일러" },
  { label: "자금 조달", bitmine: "주식 발행(ATM)", strategy: "주식·전환사채 발행(ATM)" },
];

export const BVS_FAQ: FaqItem[] = [
  {
    question: "비트마인은 왜 이더리움을 이렇게 많이 사나요?",
    answer:
      "비트마인을 이끄는 톰 리는 월가의 자산 토큰화와 AI 에이전트 확산이 이더리움 수요를 견인할 것이라는 '이더리움 슈퍼사이클' 전망을 근거로 들고 있습니다. 회사는 이더리움 유통량의 5%를 확보하는 것을 목표로 밝혔습니다.",
  },
  {
    question: "스트래티지는 왜 비트코인을 이렇게 많이 사나요?",
    answer:
      "마이클 세일러는 비트코인을 법정화폐를 대체할 디지털 준비자산으로 보고, 회사 재무 전략의 핵심으로 삼고 있습니다. 목표는 100만 BTC 확보입니다.",
  },
  {
    question: "두 회사 중 어디가 더 위험한가요?",
    answer:
      "이 리포트는 어느 쪽이 더 안전하거나 나은 투자라고 판단하지 않습니다. 두 회사 모두 주식 발행으로 조달한 자금을 코인에 베팅하는 유사한 구조이며, 2026년 상반기 급락장에서 스트래티지·비트마인 모두 대규모 평가손실을 겪었습니다. 코인 가격에 연동된 레버리지 구조라는 공통 리스크가 있습니다.",
  },
  {
    question: "ETH 스테이킹 수익은 BTC 보유보다 유리한가요?",
    answer:
      "이더리움은 지분증명(PoS) 구조라 보유량을 스테이킹해 추가 수익을 낼 수 있지만(비트마인은 연 약 2.76억 달러 기대), 비트코인은 작업증명(PoW) 구조라 스테이킹 개념 자체가 없습니다. 다만 스테이킹 수익도 코인 가격 변동 리스크를 상쇄하지는 못합니다.",
  },
  {
    question: "이 리포트의 보유량 수치는 얼마나 최신인가요?",
    answer:
      "2026년 6월 말~7월 초 보도·공시를 기준으로 정리했습니다. 두 회사 모두 거의 매주 코인을 추가 매수하고 있어 실제 최신 보유량은 각 사 공시나 Bitcoin Treasuries 등 트레저리 추적 사이트에서 확인하는 것이 정확합니다.",
  },
];

export const BVS_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/bitcoin-supply-holders-2026/", label: "비트코인 보유 현황 2026", description: "국가·기업·개인별 비트코인 보유 분포 전체 리포트입니다." },
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름을 정리합니다." },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인 vs 금 vs S&P500 10년 비교", description: "자산군별 장기 수익률을 비교하는 맥락 자료입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 기업 코인 트레저리
 └─ title: 비트마인 vs 스트래티지, 이더리움·비트코인 기업 트레저리 비교
 └─ description: 보유 규모, 전략, 리스크를 나란히 비교

InfoNotice (투자 추천 아님 + 데이터 시점 안내)
 └─ dataNote, "코인 가격에 따라 평가금액·손익은 매일 달라짐"

섹션 1 — 회사 프로필 카드 2개 (비트마인 / 스트래티지 — 티커, 자산, 보유량, 리더, 목표)
섹션 2 — 한눈에 비교 ★ 핵심 (BVS_COMPARISON_TABLE 표)
섹션 3 — 왜 사재기하나 — 두 리더의 논리 (인용 카드 2개)
섹션 4 — 구조적 차이 — 스테이킹 (설명 카드 1개, PoS vs PoW)
섹션 5 — 공통 리스크 — 레버리지드 코인 프록시 (경고 메시지 1개)
SeoContent (FAQ + 관련 링크)
```

REPORT_CONTENT_GUIDE.md의 권장 IA를 따르되, 계산/선택 UI가 없는 순수 비교·해설형이라 select/tabs 단계를 생략한다.

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

### 페이지 전용 마크업 (인라인, `bvs-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.bvs-page` | 페이지 루트 스코프 |
| `.bvs-profile-grid` | 섹션 1 — 회사 프로필 카드 2개 (2열 그리드) |
| `.bvs-profile-card[data-asset]` | 개별 프로필 카드, `asset`(BTC/ETH)별 강조색 분기 |
| `.bvs-comparison-table` | 섹션 2 — 핵심 비교표 |
| `.bvs-leader-grid` | 섹션 3 — 리더 인용 카드 2개 |
| `.bvs-staking-card` | 섹션 4 — PoS/PoW 스테이킹 설명 카드 |
| `.bvs-risk-banner` | 섹션 5 — 공통 리스크 경고 배너 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_bitmine-vs-strategy-2026.scss`

```scss
.bvs-page {
  --bvs-ink: #172033;
  --bvs-muted: #667085;
  --bvs-line: #d8e0ea;
  --bvs-eth: #627eea;
  --bvs-btc: #f7931a;
  --bvs-risk: #dc2626;

  .bvs-profile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .bvs-profile-card {
    border: 1px solid var(--bvs-line);
    border-radius: 12px;
    padding: 1.25rem;
    border-top: 4px solid transparent;

    &[data-asset="ETH"] { border-top-color: var(--bvs-eth); }
    &[data-asset="BTC"] { border-top-color: var(--bvs-btc); }
  }

  .bvs-comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--bvs-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }

    th:nth-child(2), td:nth-child(2) { color: var(--bvs-eth); }
    th:nth-child(3), td:nth-child(3) { color: var(--bvs-btc); }
  }

  .bvs-leader-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .bvs-staking-card {
    border: 1px solid var(--bvs-line);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .bvs-risk-banner {
    border: 1px solid var(--bvs-risk);
    border-radius: 12px;
    padding: 1.25rem;
    background: #fef2f2;
    color: #7f1d1d;
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
  BVS_META,
  BVS_COMPANY_PROFILES,
  BVS_COMPARISON_TABLE,
  BVS_FAQ,
  BVS_RELATED_LINKS,
} from "../../data/bitmineVsStrategy2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${BVS_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: BVS_META.title,
    description: BVS_META.seoDescription,
    dateModified: BVS_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BVS_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: BVS_META.title, item: reportUrl },
    ],
  },
];

const bitmine = BVS_COMPANY_PROFILES.find((c) => c.id === "bitmine")!;
const strategy = BVS_COMPANY_PROFILES.find((c) => c.id === "strategy")!;
---
<BaseLayout title={BVS_META.seoTitle} description={BVS_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page bvs-page" data-report="bitmine-vs-strategy-2026">
    <CalculatorHero
      eyebrow="기업 코인 트레저리"
      title={BVS_META.title}
      description={BVS_META.description}
    />

    <InfoNotice
      title="투자 판단 전 꼭 확인하세요"
      lines={[
        BVS_META.dataNote,
        "이 리포트는 두 회사 중 어느 쪽이 더 나은 투자인지 추천하지 않습니다.",
      ]}
    />

    <section class="op-section">
      <h2>회사 프로필</h2>
      <div class="bvs-profile-grid">
        {BVS_COMPANY_PROFILES.map((c) => (
          <article class="bvs-profile-card" data-asset={c.asset}>
            <strong>{c.company} ({c.ticker})</strong>
            <p>보유량: {c.holdingLabel} ({c.pctOfSupplyLabel})</p>
            <p>목표: {c.targetLabel}</p>
            <p>리더: {c.leader}</p>
            {c.stakingYieldLabel && <p>스테이킹: {c.stakingYieldLabel}</p>}
            <small>{c.riskNote}</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>한눈에 비교</h2>
      <table class="bvs-comparison-table">
        <thead>
          <tr><th>항목</th><th>비트마인 (ETH)</th><th>스트래티지 (BTC)</th></tr>
        </thead>
        <tbody>
          {BVS_COMPARISON_TABLE.map((row) => (
            <tr><td>{row.label}</td><td>{row.bitmine}</td><td>{row.strategy}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="op-section">
      <h2>왜 사재기하나 — 두 리더의 논리</h2>
      <div class="bvs-leader-grid">
        <article class="bvs-profile-card" data-asset="ETH">
          <strong>톰 리 (비트마인)</strong>
          <p>월가의 자산 토큰화와 AI 에이전트 확산이 이더리움 수요를 견인할 것이라는 '이더리움 슈퍼사이클' 전망을 근거로 듭니다.</p>
        </article>
        <article class="bvs-profile-card" data-asset="BTC">
          <strong>마이클 세일러 (스트래티지)</strong>
          <p>비트코인을 법정화폐를 대체할 디지털 준비자산(디지털 골드)으로 포지셔닝합니다.</p>
        </article>
      </div>
    </section>

    <section class="op-section">
      <h2>구조적 차이 — 스테이킹</h2>
      <p class="bvs-staking-card op-message">
        이더리움은 지분증명(PoS) 구조라 보유량을 스테이킹해 추가 수익을 낼 수 있습니다({bitmine.stakingYieldLabel}). 반면 비트코인은 작업증명(PoW) 구조라 스테이킹 개념 자체가 없어, 스트래티지는 순수 가격 상승에만 베팅하는 구조입니다.
      </p>
    </section>

    <section class="op-section">
      <h2>공통 리스크 — 레버리지드 코인 프록시</h2>
      <p class="bvs-risk-banner">
        두 회사 모두 주식 발행으로 조달한 자금을 코인 매입에 쓰는 유사한 모델입니다. 2026년 상반기 급락장에서 {strategy.riskNote} {bitmine.riskNote} 코인 가격에 연동된 레버리지 구조의 양날의 검을 보여주는 사례로, 투자 추천이 아닙니다.
      </p>
    </section>

    <SeoContent
      introTitle="비트마인 vs 스트래티지 핵심 정리"
      intro={[BVS_META.description, BVS_META.dataNote]}
      criteria={[
        "보유량·손실 수치는 2026년 6월 말~7월 초 보도·공시 기준입니다.",
        "이 리포트는 투자 추천이 아니라 두 기업 트레저리 전략의 구조 차이를 설명하는 정보성 콘텐츠입니다.",
        "톰 리·마이클 세일러의 발언은 인용이며 비교계산소의 주장이 아닙니다.",
      ]}
      faq={BVS_FAQ}
      related={BVS_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "bitmine-vs-strategy-2026",
  title: "비트마인 vs 스트래티지 2026 | 이더리움·비트코인 보유량 비교",
  description: "비트마인 ETH 약 540만개, 스트래티지 BTC 약 84만개 보유 현황을 비교합니다. 스테이킹 수익 차이, 목표 보유 비중, 2026년 미실현 손실 리스크까지 정리했습니다.",
  order: 69,
  badges: ["비트마인", "스트래티지", "이더리움", "비트코인", "2026"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수 — 누락 시 "기타"로 표시됨)

`src/pages/index.astro` (`reportMetaBySlug`):
```ts
"bitmine-vs-strategy-2026": { category: "crypto", isNew: true },
```

`src/pages/reports/index.astro` (별도 맵):
```ts
"bitmine-vs-strategy-2026": {
  eyebrow: "기업 코인 트레저리",
  tags: [{ label: "비트마인", mod: "asset" }, { label: "스트래티지", mod: "asset" }, { label: "2026", mod: "asset" }],
  category: "crypto",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/bitmine-vs-strategy-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/bitmine-vs-strategy-2026/</loc>
  <lastmod>2026-07-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 비트코인 보유 현황 2026 | `/reports/bitcoin-supply-holders-2026/` |
| SeoContent related | 이더리움 역사 수익률 2015-2026 | `/reports/ethereum-historical-returns-2015-2026/` |
| SeoContent related | 비트코인 vs 금 vs S&P500 10년 비교 | `/reports/bitcoin-gold-sp500-10year-comparison-2026/` |
| SeoContent related | 코인 적립식 투자 계산기 | `/tools/coin-dca-calculator/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] **구현 시점에 비트마인·스트래티지 최신 보유량을 재검색해 확정치로 갱신** (특히 비트마인은 "약 540만~570만"으로 자료마다 차이가 있어 범위로 표기했는데, 가능하면 최신 단일 공시 수치로 좁힌다)
- [ ] **`bitcoin-supply-holders-2026`의 Strategy 보유량(57만 BTC, corporate 총합 85만 BTC)이 이 리포트의 수치(84.7만 BTC)와 크게 다름 — 같은 작업에서 `bitcoinSupplyHolders2026.ts`의 `BSH_CORPORATES`(Strategy 항목)와 `BSH_CATEGORIES`(corporate 총합)도 함께 최신화할지 결정하고 반영. 최신화하지 않기로 하면 최소한 두 리포트 중 하나가 "명백히 낡은 상태"로 방치되지 않도록 `updatedAt` 표기로 시점 차이를 분명히 한다**
- [ ] InfoNotice에 "투자 추천 아님" 문구가 명확히 노출되는지 확인 — 두 회사 비교가 "어디에 투자할지" 조언으로 읽히지 않도록
- [ ] `.bvs-profile-card[data-asset]` ETH/BTC 강조색이 프로필 카드·리더 카드 모두에 일관되게 적용되는지 확인
- [ ] 리스크 섹션(`bvs-risk-banner`)이 시각적으로 "경고" 톤으로 구분되는지 확인 (배경색 대비)
- [ ] 모바일에서 2열 그리드(프로필, 리더 카드) → 1열 전환 확인
- [ ] 톰 리·마이클 세일러 발언이 인용으로 명확히 표기되고 사이트 주장처럼 읽히지 않는지 SEO_CRITERIA·본문 재확인
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인 (한쪽만 등록하면 다른 쪽에서 "기타"로 표시되는 사고 발생)
- [ ] `npm run build` 통과, 라우트 `/reports/bitmine-vs-strategy-2026/` 존재 확인

---

## 13. 향후 확장

두 회사의 주가(BMNR, MSTR)와 보유 코인 가치의 상관관계를 시계열로 보여주는 후속 콘텐츠(예: "코인 가격이 10% 빠지면 주가는 몇 % 빠질까 — 프리미엄/디스카운트 구조")를 검토할 수 있다. 이번 리포트는 스냅샷 비교에 집중하고, 시계열·프리미엄 분석은 별도 리포트로 분리하는 것을 권장한다.
