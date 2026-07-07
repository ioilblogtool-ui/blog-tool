# 이더리움 저평가론 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/ethereum-undervaluation-thesis-2026-plan.md`](../../plan/202607/ethereum-undervaluation-thesis-2026-plan.md)
> 작성일: 2026-07-07
> 유형: 정보성 리포트 (`/reports/`), 정적 페이지 (JS 계산 없음)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/ethereumUndervaluationThesis2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/ethereum-undervaluation-thesis-2026.astro` |
| 스크립트 | (없음 — 정적 리포트) |
| 스타일 | `src/styles/scss/pages/_ethereum-undervaluation-thesis-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `eut-` (Ethereum Undervaluation Thesis). `.op-page`/`.op-section`/`.op-message`/`.op-card-grid` 공유 클래스를 베이스로 얹는다 — 지금까지의 모든 신규 리포트(`samsung-ai-modular-home-2026`, `bitmine-vs-strategy-2026`)와 동일한 패턴.

---

## 2. URL 및 메타

```
슬러그: /reports/ethereum-undervaluation-thesis-2026/
타이틀(seoTitle): 이더리움은 왜 저평가일까 2026 | 스테이블코인·RWA 근거 정리
디스크립션: 이더리움 저평가론의 핵심 근거(스테이블코인 점유율 50~60%, RWA 토큰화 전망, ETH/BTC 비율)와 반대로 제기되는 회의론(L2 가치 유출, ETF 유출)까지 균형 있게 정리했습니다.
```

---

## 3. 데이터 파일 설계

**`src/data/ethereumUndervaluationThesis2026.ts`**

```ts
import { ethereumReturnRows } from "./ethereumHistoricalReturns20152026";

// ── 타입 ──────────────────────────────────────────

export type ArgumentPoint = {
  id: string;
  label: string;      // "스테이블코인 점유율"
  value: string;      // "약 50~60%"
  detail: string;
  sourceLabel: string; // 출처·시점
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

const eth2026 = ethereumReturnRows.find((y) => y.year === 2026)!;
const eth2026PriceLabel = `$${eth2026.startPrice!.toLocaleString("en-US")} → $${eth2026.endPrice.toLocaleString("en-US")} (${eth2026.returnRate}%)`;

export const EUT_META = {
  slug: "ethereum-undervaluation-thesis-2026",
  title: "이더리움은 왜 저평가라는 말이 나올까",
  seoTitle: "이더리움은 왜 저평가일까 2026 | 스테이블코인·RWA 근거 정리",
  seoDescription:
    "이더리움 저평가론의 핵심 근거(스테이블코인 점유율 50~60%, RWA 토큰화 전망, ETH/BTC 비율)와 반대로 제기되는 회의론(L2 가치 유출, ETF 유출)까지 균형 있게 정리했습니다.",
  description: "스테이블코인·RWA 관점의 이더리움 저평가론과, 이에 반박하는 회의론을 함께 정리한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "이 리포트가 다루는 '저평가'는 비교계산소의 결론이 아니라 톰 리 등 특정 분석가·매체가 제기하는 투자 논리입니다. 스테이블코인 점유율, RWA 전망, ETH/BTC 비율 등은 2026년 상반기 보도·조회 시점 기준이며 실시간으로 변동합니다. 이 리포트는 투자를 추천하지 않으며, 근거와 반대 논거를 함께 소개하는 정보성 콘텐츠입니다.",
};

export const EUT_BULL_POINTS: ArgumentPoint[] = [
  {
    id: "stablecoin-share",
    label: "스테이블코인 점유율",
    value: "약 50~60%",
    detail: "이더리움은 전체 스테이블코인 시장(2026년 1분기 약 3,150억 달러)에서 점유율 1위 체인이며, 생태계 내 스테이블코인 공급 규모는 1,800억 달러를 넘어섰습니다.",
    sourceLabel: "2026-04 보도 기준",
  },
  {
    id: "rwa",
    label: "RWA(실물자산 토큰화)",
    value: "2030년까지 최대 50조 달러 전망",
    detail: "주식·채권 등 실물자산을 온체인으로 옮기는 RWA 토큰화 시장이 커지면서, 이더리움이 관련 인프라의 중심으로 거론되고 있습니다.",
    sourceLabel: "업계 전망 보도",
  },
  {
    id: "eth-btc-ratio",
    label: "ETH/BTC 교환비율",
    value: "약 0.0344 (52주 중 낮은 구간)",
    detail: "최근 52주 ETH/BTC 비율은 0.0177~0.0605 사이에서 움직였습니다. 현재 수준은 이 범위의 낮은 편에 위치해 있어, 역사적 평균으로 회귀할 여력이 있다는 주장의 근거로 쓰입니다.",
    sourceLabel: "2026-07 조회 기준",
  },
  {
    id: "network-usage",
    label: "네트워크 사용량",
    value: "일일 거래량 300만 건 첫 돌파",
    detail: "2026년 상반기 이더리움 메인넷 일일 거래 처리량이 사상 처음 300만 건을 넘어서는 등 실사용 지표는 증가 추세를 보였습니다.",
    sourceLabel: "2026년 상반기 보도",
  },
];

export const EUT_SKEPTIC_POINTS: ArgumentPoint[] = [
  {
    id: "l2-value-leak",
    label: "L2 가치 유출 논쟁",
    value: "L2는 크는데 L1은?",
    detail: "레이어2(L2)가 성장할수록 거래와 수수료가 L2로 옮겨가면서 이더리움 메인넷(L1)의 가치 포착력이 약해진다는 논쟁이 2026년 중반 커졌습니다.",
    sourceLabel: "2026년 중반 보도",
  },
  {
    id: "foundation-exodus",
    label: "이더리움 재단 인력 이탈",
    value: "핵심 인재 8명 퇴사",
    detail: "이더리움 재단의 핵심 인력 다수가 퇴사하면서 조직 안정성에 대한 우려가 제기됐습니다.",
    sourceLabel: "2026년 보도",
  },
  {
    id: "etf-outflow",
    label: "현물 ETF 순유출",
    value: "기관 수요 약화 신호",
    detail: "2026년 중반 이더리움 현물 ETF에서 순유출이 발생해, 기관 투자 수요가 약해지고 있다는 해석이 나왔습니다.",
    sourceLabel: "2026년 중반 보도",
  },
  {
    id: "actual-price",
    label: "2026년 실제 가격 흐름",
    value: eth2026PriceLabel,
    detail: "저평가 논의와 별개로, 2026년 연초 대비 현재까지(YTD) 이더리움 가격 자체는 하락했습니다.",
    sourceLabel: "사이트 내 이더리움 역사 수익률 리포트와 동일 출처",
  },
];

export const EUT_FAQ: FaqItem[] = [
  {
    question: "이더리움이 저평가라는 근거는 뭔가요?",
    answer:
      "스테이블코인 점유율(약 50~60%), RWA(실물자산 토큰화) 인프라로서의 위상, 역사적으로 낮은 편인 ETH/BTC 교환비율, 늘어나는 네트워크 사용량이 주요 근거로 제시됩니다. 다만 이는 특정 분석가·매체의 해석이며 확정된 사실이 아닙니다.",
  },
  {
    question: "스테이블코인이 왜 이더리움에 유리한가요?",
    answer:
      "USDT·USDC 등 주요 스테이블코인이 이더리움 네트워크에서 주로 발행·정산되기 때문에, 스테이블코인 거래가 늘어날수록 이더리움 네트워크 사용량과 수수료 수요도 함께 늘어날 수 있다는 논리입니다.",
  },
  {
    question: "RWA(실물자산 토큰화)가 뭔가요?",
    answer:
      "주식, 채권, 부동산 같은 전통 금융 자산을 블록체인 위에 토큰 형태로 옮기는 것을 말합니다. 이 시장이 커지면 이더리움처럼 신뢰성과 개발 생태계를 갖춘 네트워크가 정산 기반으로 선택될 가능성이 높다는 전망이 있습니다.",
  },
  {
    question: "레이어2(L2)가 성장하면 이더리움에 안 좋은가요?",
    answer:
      "의견이 갈립니다. L2가 이더리움의 보안을 빌려 쓰는 확장 수단이라 L1에도 긍정적이라는 시각과, 거래·수수료가 L2로 옮겨가면서 L1의 가치 포착력이 약해진다는 회의론이 동시에 존재합니다. 이 리포트는 두 시각을 모두 소개합니다.",
  },
  {
    question: "이 리포트는 이더리움 투자를 추천하나요?",
    answer:
      "아닙니다. 저평가론과 회의론을 균형 있게 소개하는 정보성 콘텐츠이며, 투자 판단은 최신 데이터와 본인 상황을 기준으로 별도로 내려야 합니다.",
  },
];

export const EUT_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름 전체를 정리합니다." },
  { href: "/reports/bitmine-vs-strategy-2026/", label: "비트마인 vs 스트래티지 2026", description: "톰 리의 이더리움 슈퍼사이클 논리와 목표가를 다룬 리포트입니다." },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인 vs 금 vs S&P500 10년 비교", description: "자산군별 장기 수익률을 비교하는 맥락 자료입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 이더리움 투자 논리
 └─ title: 이더리움은 왜 저평가라는 말이 나올까
 └─ description: 스테이블코인·RWA 근거와 반대 회의론을 함께 정리

InfoNotice ("저평가는 사이트 결론 아님" + 데이터 시점 안내)

섹션 1 — 저평가론의 근거 (Bull Case) ★ — EUT_BULL_POINTS 카드 4개
섹션 2 — 회의론 (Skeptic Case) — EUT_SKEPTIC_POINTS 카드 4개 (Bull과 동등 비중)
섹션 3 — 정리 — 두 시각을 어떻게 봐야 하나 (균형 메시지 1개)
SeoContent (FAQ + 관련 링크)
```

Bull/Skeptic 두 섹션을 **동일한 카드 레이아웃과 개수(4개씩)**로 배치해 시각적으로도 "동등 비중"이라는 편집 의도가 드러나게 한다 — 한쪽이 더 많거나 강조되면 균형 원칙이 깨진다.

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

### 페이지 전용 마크업 (`eut-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.eut-page` | 루트 스코프 |
| `.eut-argument-grid` | 섹션 1·2 공용 — 4카드 그리드 (bull/skeptic 동일 구조 재사용) |
| `.eut-argument-card[data-tone]` | 개별 카드, `tone="bull"`(초록 계열) / `tone="skeptic"`(회색·주황 계열) |
| `.eut-balance-banner` | 섹션 3 — 정리 메시지 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_ethereum-undervaluation-thesis-2026.scss`

```scss
.eut-page {
  --eut-line: #d8e0ea;
  --eut-bull: #059669;
  --eut-skeptic: #b45309;

  .eut-argument-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .eut-argument-card {
    border: 1px solid var(--eut-line);
    border-radius: 12px;
    padding: 1.25rem;
    border-top: 4px solid transparent;

    &[data-tone="bull"] { border-top-color: var(--eut-bull); }
    &[data-tone="skeptic"] { border-top-color: var(--eut-skeptic); }
  }

  .eut-balance-banner {
    border: 1px solid var(--eut-line);
    border-radius: 12px;
    padding: 1.25rem;
    background: #f8fafc;
  }
}
```

같은 카드 컴포넌트(`eut-argument-card`)를 bull/skeptic 양쪽에서 재사용하고 `data-tone`만 다르게 줘서, 별도 컴포넌트 두 벌을 만들지 않는다.

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
  EUT_META,
  EUT_BULL_POINTS,
  EUT_SKEPTIC_POINTS,
  EUT_FAQ,
  EUT_RELATED_LINKS,
} from "../../data/ethereumUndervaluationThesis2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${EUT_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: EUT_META.title,
    description: EUT_META.seoDescription,
    dateModified: EUT_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EUT_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: EUT_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={EUT_META.seoTitle} description={EUT_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page eut-page" data-report="ethereum-undervaluation-thesis-2026">
    <CalculatorHero
      eyebrow="이더리움 투자 논리"
      title={EUT_META.title}
      description={EUT_META.description}
    />

    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={[
        EUT_META.dataNote,
        "이 리포트는 이더리움 투자를 추천하지 않습니다.",
      ]}
    />

    <section class="op-section">
      <h2>저평가론의 근거</h2>
      <div class="eut-argument-grid">
        {EUT_BULL_POINTS.map((p) => (
          <article class="eut-argument-card" data-tone="bull">
            <strong>{p.label}</strong>
            <p>{p.value}</p>
            <p>{p.detail}</p>
            <small>{p.sourceLabel}</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>반대로 제기되는 회의론</h2>
      <div class="eut-argument-grid">
        {EUT_SKEPTIC_POINTS.map((p) => (
          <article class="eut-argument-card" data-tone="skeptic">
            <strong>{p.label}</strong>
            <p>{p.value}</p>
            <p>{p.detail}</p>
            <small>{p.sourceLabel}</small>
          </article>
        ))}
      </div>
    </section>

    <section class="op-section">
      <h2>정리 — 두 시각을 어떻게 봐야 하나</h2>
      <p class="eut-balance-banner op-message">
        스테이블코인·RWA는 이더리움의 실사용 근거로 자주 언급되지만, 가격은 L2 가치 포착 구조, 기관 수급, 조직 안정성 등 다른 변수에도 함께 영향을 받습니다. 저평가론과 회의론 모두 특정 시점의 해석이며, 이 리포트의 결론이 아닙니다.
      </p>
    </section>

    <SeoContent
      introTitle="이더리움 저평가론 핵심 정리"
      intro={[EUT_META.description, EUT_META.dataNote]}
      criteria={[
        "스테이블코인 점유율·RWA 전망·ETH/BTC 비율은 2026년 상반기 보도·조회 시점 기준입니다.",
        "이 리포트는 이더리움 투자를 추천하지 않으며, 근거와 반대 논거를 동일 비중으로 소개합니다.",
        "2026년 가격 흐름은 이 사이트의 이더리움 역사 수익률 리포트와 동일 출처를 인용했습니다.",
      ]}
      faq={EUT_FAQ}
      related={EUT_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "ethereum-undervaluation-thesis-2026",
  title: "이더리움은 왜 저평가일까 2026 | 스테이블코인·RWA 근거 정리",
  description: "이더리움 저평가론의 핵심 근거(스테이블코인 점유율 50~60%, RWA 토큰화 전망, ETH/BTC 비율)와 반대로 제기되는 회의론(L2 가치 유출, ETF 유출)까지 균형 있게 정리했습니다.",
  order: 70,
  badges: ["이더리움", "스테이블코인", "RWA", "2026"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"ethereum-undervaluation-thesis-2026": { category: "crypto", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"ethereum-undervaluation-thesis-2026": {
  eyebrow: "이더리움 투자 논리",
  tags: [{ label: "이더리움", mod: "asset" }, { label: "스테이블코인", mod: "asset" }, { label: "RWA", mod: "asset" }],
  category: "crypto",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/ethereum-undervaluation-thesis-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/ethereum-undervaluation-thesis-2026/</loc>
  <lastmod>2026-07-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related | 이더리움 역사 수익률 2015-2026 | `/reports/ethereum-historical-returns-2015-2026/` |
| SeoContent related | 비트마인 vs 스트래티지 2026 | `/reports/bitmine-vs-strategy-2026/` |
| SeoContent related | 비트코인 vs 금 vs S&P500 10년 비교 | `/reports/bitcoin-gold-sp500-10year-comparison-2026/` |
| SeoContent related | 코인 적립식 투자 계산기 | `/tools/coin-dca-calculator/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] **Bull/Skeptic 두 섹션이 카드 개수(4개씩)·레이아웃·헤딩 크기까지 시각적으로 동등하게 보이는지 확인** — 균형 원칙이 핵심이므로 한쪽만 강조되지 않게
- [ ] InfoNotice에 "저평가는 사이트 결론 아님", "투자 추천 아님" 문구가 최상단에 노출되는지 확인
- [ ] 2026년 ETH 가격 수치(`eth2026PriceLabel`)가 `bitmineVsStrategy2026.ts`·`ethereumHistoricalReturns20152026.ts`와 정확히 일치하는지 확인 (세 페이지 동일 출처)
- [ ] ETH/BTC 비율(0.0344, 52주 범위)이 "조회 시점 기준"임을 명시했는지 확인 — 실시간 변동값을 확정치처럼 쓰지 않기
- [ ] `.eut-argument-card[data-tone]` bull=초록/skeptic=주황 색상이 일관되게 적용되는지 확인
- [ ] 모바일에서 2열 → 1열 전환 확인
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 존재 확인

---

## 13. 향후 확장

L2별(Arbitrum, Base, Optimism 등) 가치 포착 논쟁을 더 깊게 다루는 후속 리포트나, 스테이블코인 발행사별(Tether, Circle) 이더리움 의존도를 다루는 콘텐츠로 확장할 수 있다. 이번 리포트는 저평가론 대 회의론이라는 구도 자체에 집중하고, 세부 주제는 별도 리포트로 분리하는 것을 권장한다.
