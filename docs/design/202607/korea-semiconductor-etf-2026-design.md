# 국내 반도체 ETF 총정리 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/korea-semiconductor-etf-2026-plan.md`](../../plan/202607/korea-semiconductor-etf-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 비교 리포트 (`/reports/`), 정적 페이지 (탭 필터 + 순자산 차트만 JS, 라이브 데이터 아님)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/koreaSemiconductorEtf2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/korea-semiconductor-etf-2026.astro` |
| 스크립트 | `public/scripts/korea-semiconductor-etf-2026.js` (탭 필터 + 순자산 바 차트) |
| 스타일 | `src/styles/scss/pages/_korea-semiconductor-etf-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `kse-` (Korea Semiconductor Etf). `.op-page`/`.op-section`/`.op-message` 공유 클래스를 베이스로 얹는다.

---

## 2. URL 및 메타

```
슬러그: /reports/korea-semiconductor-etf-2026/
타이틀(seoTitle): 국내 반도체 ETF 2026 | SOL·KODEX·ACE 뭐가 다를까 총정리
디스크립션: SOL·KODEX AI반도체TOP2플러스, ACE AI반도체TOP3+, TIGER 반도체TOP10 등 국내 상장 반도체 ETF 10종의 구성종목·보수·순자산을 비교. 연금계좌용 채권혼합형까지 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/koreaSemiconductorEtf2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type EquityCategory = "TOP2" | "TOP3" | "BROAD";

export type EquityEtf = {
  ticker: string;
  name: string;
  manager: string;
  category: EquityCategory;
  categoryLabel: string;       // "TOP2+형" | "TOP3+형" | "대형분산형"
  focus: string;                // 핵심 구조 한 줄 설명
  expenseRatio: number | null;  // null = 확인 필요
  aumKrwBillion: number;        // 억원 단위
  aumLabel: string;             // "약 6.99조" (표시용 원문)
  listedDate: string;           // "2026-03-17"
  fit: string;                  // 잘 맞는 경우
};

export type BondMixEtf = {
  ticker: string;
  name: string;
  manager: string;
  structure: string;            // "삼성전자 25% + SK하이닉스 25% + 채권 50%"
  expenseRatio: number | null;
  note: string;
};

export type SolKodexComparisonRow = {
  label: string;                // "운용사" | "상장일" | "컨셉" | "보수"
  sol: string;
  kodex: string;
};

export type MatchingRow = {
  need: string;
  etf: string;
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

// ── 데이터 ────────────────────────────────────────

export const KSE_META = {
  slug: "korea-semiconductor-etf-2026",
  title: "국내 반도체 ETF, 뭐가 다를까",
  seoTitle: "국내 반도체 ETF 2026 | SOL·KODEX·ACE 뭐가 다를까 총정리",
  seoDescription:
    "SOL·KODEX AI반도체TOP2플러스, ACE AI반도체TOP3+, TIGER 반도체TOP10 등 국내 상장 반도체 ETF 10종의 구성종목·보수·순자산을 비교. 연금계좌용 채권혼합형까지 포함.",
  description: "SOL·KODEX·ACE·TIGER·1Q·HANARO 등 국내 상장 반도체 ETF 10종을 구조·보수·순자산 기준으로 비교하고, 연금·IRP용 채권혼합형까지 정리했습니다.",
  updatedAt: "2026-07-08",
  dataNote:
    "총보수·순자산·구성종목은 각 운용사 공식 페이지 기준이며 리밸런싱마다 바뀔 수 있습니다. 실제 투자 전에는 반드시 운용사 공식 페이지에서 최신 정보를 다시 확인하세요. 이 리포트는 투자를 추천하지 않습니다.",
};

export const KSE_EQUITY_ETFS: EquityEtf[] = [
  {
    ticker: "0167A0", name: "SOL AI반도체TOP2플러스", manager: "신한자산운용",
    category: "TOP2", categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스·SK스퀘어 중심 + AI 소부장 10종목",
    expenseRatio: 0.45, aumKrwBillion: 69900, aumLabel: "약 6.99조",
    listedDate: "2026-03-17",
    fit: "하이닉스·HBM·AI 서버 밸류체인 강세에 베팅하고 싶을 때",
  },
  {
    ticker: "395160", name: "KODEX AI반도체TOP2플러스", manager: "삼성자산운용",
    category: "TOP2", categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스 합산 약 50% + AI 반도체 소부장",
    expenseRatio: 0.45, aumKrwBillion: 46064, aumLabel: "약 4.61조",
    listedDate: "2021-07-30 (2026-05 리뉴얼)",
    fit: "SOL과 같은 컨셉을 삼성 운용사 상품으로 담고 싶을 때",
  },
  {
    ticker: "469150", name: "ACE AI반도체TOP3+", manager: "한국투자신탁운용",
    category: "TOP3", categoryLabel: "TOP3+형",
    focus: "SK하이닉스·삼성전자·한미반도체 약 75% 압축",
    expenseRatio: null, aumKrwBillion: 10000, aumLabel: "약 1조+",
    listedDate: "확인 필요",
    fit: "한미반도체 등 HBM 장비주까지 강하게 보고 싶을 때",
  },
  {
    ticker: "0182R0", name: "1Q K반도체TOP2+", manager: "하나자산운용",
    category: "TOP2", categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스 중심 + SK스퀘어·삼성전기 편입",
    expenseRatio: 0.20, aumKrwBillion: 2543, aumLabel: "약 2,543억",
    listedDate: "2026-04",
    fit: "보수에 민감하고 저비용 TOP2+ 상품을 원할 때",
  },
  {
    ticker: "396500", name: "TIGER 반도체TOP10", manager: "미래에셋자산운용",
    category: "BROAD", categoryLabel: "대형분산형",
    focus: "반도체 시총 상위 10종목, 상위 2개 각 25% 구조",
    expenseRatio: 0.45, aumKrwBillion: 103000, aumLabel: "약 10.3조",
    listedDate: "확인 필요",
    fit: "가장 무난하게 국내 반도체 대표주 전체에 투자하고 싶을 때",
  },
  {
    ticker: "395270", name: "HANARO Fn K-반도체", manager: "NH-Amundi자산운용",
    category: "BROAD", categoryLabel: "대형분산형",
    focus: "국내 반도체 핵심 20종목, 삼성전기 비중 높은 편",
    expenseRatio: 0.45, aumKrwBillion: 45000, aumLabel: "약 4.50조",
    listedDate: "확인 필요",
    fit: "특정 대형주보다 K-반도체 생태계 전체에 분산 투자하고 싶을 때",
  },
];

export const KSE_BOND_MIX_ETFS: BondMixEtf[] = [
  {
    ticker: "0162Z0", name: "RISE 삼성전자SK하이닉스채권혼합50", manager: "KB자산운용",
    structure: "삼성전자 25% + SK하이닉스 25% + 국고·통안채 50%",
    expenseRatio: 0.01,
    note: "안전자산으로 분류되어 연금계좌 내 최대 100% 투자 가능",
  },
  {
    ticker: "0177N0", name: "KODEX 삼성전자SK하이닉스채권혼합50", manager: "삼성자산운용",
    structure: "삼성전자 25% + SK하이닉스 25% + 채권 50%",
    expenseRatio: null,
    note: "RISE와 동일 컨셉의 삼성 운용사 상품",
  },
  {
    ticker: "0182S0", name: "1Q K반도체TOP2채권혼합50", manager: "하나자산운용",
    structure: "반도체 TOP2 50% + 단기국고통안채 50%",
    expenseRatio: 0.01,
    note: "저보수 채권혼합형",
  },
  {
    ticker: "0183V0", name: "KIWOOM 삼성전자&SK하이닉스채권혼합50", manager: "키움투자자산운용",
    structure: "삼성전자·SK하이닉스 + 채권 혼합 (RISE·KODEX와 유사 구조)",
    expenseRatio: null,
    note: "후발 상품, 순자산·거래량 확인 필요",
  },
];

export const KSE_SOL_KODEX_COMPARISON: SolKodexComparisonRow[] = [
  { label: "운용사", sol: "신한자산운용", kodex: "삼성자산운용" },
  { label: "상장", sol: "2026년 3월", kodex: "2021년 7월 (2026년 5월 리뉴얼)" },
  { label: "컨셉", sol: "TOP2 + SK스퀘어 + AI 소부장", kodex: "TOP2 약 50% + AI 소부장" },
  { label: "보수", sol: "0.45%", kodex: "0.45%" },
  { label: "특징", sol: "후발이지만 자금 유입 강함", kodex: "기존 상품 리뉴얼, 운용 이력 김" },
];

export const KSE_MATCHING_ROWS: MatchingRow[] = [
  { need: "반도체 슈퍼사이클에 공격적으로 베팅하고 싶다", etf: "SOL AI반도체TOP2플러스 / KODEX AI반도체TOP2플러스" },
  { need: "한미반도체 등 HBM 장비주까지 강하게 담고 싶다", etf: "ACE AI반도체TOP3+" },
  { need: "가장 무난한 국내 반도체 대표주 ETF를 원한다", etf: "TIGER 반도체TOP10" },
  { need: "특정 종목 쏠림 없이 K-반도체 생태계 전체를 담고 싶다", etf: "HANARO Fn K-반도체" },
  { need: "보수를 최대한 낮추고 싶다", etf: "1Q K반도체TOP2+ (0.20%)" },
  { need: "연금저축·IRP에서 안전자산 비중까지 채우고 싶다", etf: "RISE / KODEX / 1Q 채권혼합50" },
];

export const KSE_FAQ: FaqItem[] = [
  {
    question: "SOL AI반도체TOP2플러스와 가장 비슷한 ETF는 무엇인가요?",
    answer: "KODEX AI반도체TOP2플러스가 가장 유사합니다. 둘 다 삼성전자·SK하이닉스를 핵심으로 하고 AI 반도체 소부장을 함께 담으며, 총보수도 0.45%로 동일합니다. SOL은 SK스퀘어 비중이 상대적으로 크고, KODEX는 TOP2 합산 비중을 약 50%로 맞춘 점이 다릅니다.",
  },
  {
    question: "TOP2+와 TOP3+는 뭐가 다른가요?",
    answer: "TOP2+는 삼성전자·SK하이닉스 2개 대형주를 중심에 두고 AI 소부장을 추가하는 구조이고, TOP3+(ACE AI반도체TOP3+)는 여기에 한미반도체를 더해 3개 종목에 약 75%를 압축 투자합니다. TOP3+는 HBM 장비주 노출이 커서 상대적으로 변동성이 높을 수 있습니다.",
  },
  {
    question: "반도체 ETF를 연금저축·IRP에 넣어도 되나요?",
    answer: "일반 주식형 반도체 ETF는 연금계좌에서도 위험자산으로 분류되어 최대 70%까지만 담을 수 있습니다. RISE·KODEX·1Q의 삼성전자SK하이닉스채권혼합50처럼 주식 50%+채권 50% 구조의 채권혼합형은 안전자산으로 분류되어 연금계좌 내 최대 100%까지 투자할 수 있습니다.",
  },
  {
    question: "채권혼합50 ETF는 안전자산으로 분류되나요?",
    answer: "네. RISE 삼성전자SK하이닉스채권혼합50 등은 주식 비중이 50% 이하로 설계되어 자본시장법상 안전자산으로 분류됩니다. 다만 상품마다 세부 요건이 다를 수 있으므로 운용사 공식 페이지에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "보수가 가장 낮은 국내 반도체 ETF는 어디인가요?",
    answer: "주식형 중에서는 1Q K반도체TOP2+가 연 0.20%로 가장 낮습니다. 채권혼합형까지 포함하면 RISE·1Q 계열 채권혼합50 상품이 연 0.01%로 더 낮습니다.",
  },
];

export const KSE_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-etf-2026/", label: "미국·한국 반도체 ETF 비교 2026", description: "SOXX, SMH 등 미국 ETF까지 포함해 원화 기준 체급을 폭넓게 비교합니다." },
  { href: "/reports/semiconductor-value-chain/", label: "반도체 산업 구조 한눈에 보기", description: "설계·장비·전공정·후공정 등 반도체 밸류체인 전체 구조를 정리합니다." },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 개별 종목 실적 전망 2026~2028", description: "삼성전자·SK하이닉스·마이크론·TSMC 실적 전망을 비교합니다." },
  { href: "/tools/dca-investment-calculator/?tab=SEMICONDUCTOR", label: "반도체 종목 적립식 투자 계산기", description: "월 투자금과 기간을 설정해 실제 수익 차이를 비교합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 국내 반도체 ETF
 └─ title: 국내 반도체 ETF, 뭐가 다를까
 └─ description: SOL·KODEX·ACE·TIGER·1Q·HANARO 10종을 구조·보수·순자산으로 비교

InfoNotice ("투자 추천 아님 + 총보수/순자산은 시점 스냅샷, 운용사 공식페이지 재확인 안내")

섹션 1 — 주식형 6종 비교 (탭: 전체/TOP2+형/TOP3+형/대형분산형) — KSE_EQUITY_ETFS 표
섹션 2 — 순자산 규모 차트 ★ — KSE_EQUITY_ETFS 기반 바 차트 (원화 기준)
섹션 3 — SOL vs KODEX 1:1 비교 — KSE_SOL_KODEX_COMPARISON 표 (검색 유입 핵심)
섹션 4 — ACE AI반도체TOP3+ — HBM 장비주까지 보고 싶을 때 — 단독 카드형 설명
섹션 5 — 채권혼합형 4종 비교 (연금/IRP) — KSE_BOND_MIX_ETFS 표 + "위험자산 70% 제한" 안내
섹션 6 — 목적별 선택 가이드 — KSE_MATCHING_ROWS 표
SeoContent (FAQ + 관련 링크 — 기존 semiconductor-etf-2026로 유도 링크 최상단 배치)
```

**자기잠식 방지 배치:** SeoContent `related` 1번째 항목을 반드시 `/reports/semiconductor-etf-2026/`(미국 포함 폭넓은 비교)로 고정해, "더 넓게 보고 싶은" 검색 의도를 흡수하면서 겹치는 검색어의 클릭을 자연스럽게 양쪽으로 분산시킨다.

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

### 페이지 전용 마크업 (`kse-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.kse-page` | 루트 스코프 |
| `.kse-tab-row` / `.kse-tab-btn[data-category-tab]` | 섹션 1 — 전체/TOP2+형/TOP3+형/대형분산형 필터 (semiconductor-etf-2026의 `se26-tab-btn` 패턴 재사용) |
| `.kse-table` / `[data-category-row]` | 섹션 1 — 주식형 비교표, 탭에 따라 행 숨김 |
| `.kse-chart-panel` | 섹션 2 — 순자산 차트 래퍼 |
| `.kse-vs-table` | 섹션 3 — SOL vs KODEX 2열 비교표 |
| `.kse-highlight-card` | 섹션 4 — ACE TOP3+ 단독 설명 카드 |
| `.kse-bond-table` | 섹션 5 — 채권혼합형 비교표 |
| `.kse-match-table` | 섹션 6 — 목적별 선택 가이드 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_korea-semiconductor-etf-2026.scss`

```scss
.kse-page {
  --kse-line: #d8e0ea;
  --kse-accent: #1a56db;

  .kse-tab-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .kse-tab-btn {
    border: 1px solid var(--kse-line);
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    background: transparent;
    font-size: 0.85rem;
    cursor: pointer;

    &.is-active {
      background: var(--kse-accent);
      border-color: var(--kse-accent);
      color: #fff;
    }
  }

  .kse-table, .kse-vs-table, .kse-bond-table, .kse-match-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--kse-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  [data-category-row].is-hidden {
    display: none;
  }

  .kse-chart-panel {
    border: 1px solid var(--kse-line);
    border-radius: 12px;
    padding: 1rem;

    .kse-chart-wrap {
      position: relative;
      height: 320px;
    }
  }

  .kse-highlight-card {
    border: 1px solid var(--kse-line);
    border-left: 4px solid var(--kse-accent);
    border-radius: 12px;
    padding: 1.25rem;
  }

  @media (max-width: 640px) {
    .table-wrap { overflow-x: auto; }
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
  KSE_META,
  KSE_EQUITY_ETFS,
  KSE_BOND_MIX_ETFS,
  KSE_SOL_KODEX_COMPARISON,
  KSE_MATCHING_ROWS,
  KSE_FAQ,
  KSE_RELATED_LINKS,
} from "../../data/koreaSemiconductorEtf2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${KSE_META.slug}/`;

const chartSeed = {
  etfs: KSE_EQUITY_ETFS.map((item) => ({
    ticker: item.name,
    category: item.category,
    aumKrwBillion: item.aumKrwBillion,
  })),
};

const formatExpenseRatio = (value: number | null) => (value === null ? "확인 필요" : `${value.toFixed(2)}%`);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: KSE_META.title,
    description: KSE_META.seoDescription,
    dateModified: KSE_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KSE_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: KSE_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={KSE_META.seoTitle} description={KSE_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page kse-page" data-report="korea-semiconductor-etf-2026">
    <CalculatorHero
      eyebrow="국내 반도체 ETF"
      title={KSE_META.title}
      description={KSE_META.description}
    />

    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={[KSE_META.dataNote, "이 리포트는 투자를 추천하지 않습니다."]}
    />

    <section class="op-section">
      <h2>주식형 반도체 ETF 6종 비교</h2>
      <div class="kse-tab-row" id="kseCategoryTabs">
        <button type="button" class="kse-tab-btn is-active" data-category-tab="all">전체</button>
        <button type="button" class="kse-tab-btn" data-category-tab="TOP2">TOP2+형</button>
        <button type="button" class="kse-tab-btn" data-category-tab="TOP3">TOP3+형</button>
        <button type="button" class="kse-tab-btn" data-category-tab="BROAD">대형분산형</button>
      </div>
      <div class="table-wrap">
        <table class="kse-table">
          <thead>
            <tr><th>ETF</th><th>운용사</th><th>구조</th><th>총보수</th><th>순자산</th><th>잘 맞는 경우</th></tr>
          </thead>
          <tbody>
            {KSE_EQUITY_ETFS.map((etf) => (
              <tr data-category-row={etf.category}>
                <td><strong>{etf.name}</strong><br /><span>{etf.ticker}</span></td>
                <td>{etf.manager}</td>
                <td>{etf.focus}</td>
                <td>{formatExpenseRatio(etf.expenseRatio)}</td>
                <td>{etf.aumLabel}</td>
                <td>{etf.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="op-section">
      <h2>순자산 규모로 보면</h2>
      <article class="kse-chart-panel">
        <div class="kse-chart-wrap">
          <canvas id="kseAumChart" aria-label="국내 반도체 ETF 순자산 규모 차트"></canvas>
        </div>
      </article>
    </section>

    <section class="op-section">
      <h2>SOL vs KODEX — 가장 비슷한 두 상품 1:1 비교</h2>
      <table class="kse-vs-table">
        <thead><tr><th>구분</th><th>SOL AI반도체TOP2플러스</th><th>KODEX AI반도체TOP2플러스</th></tr></thead>
        <tbody>
          {KSE_SOL_KODEX_COMPARISON.map((row) => (
            <tr><td>{row.label}</td><td>{row.sol}</td><td>{row.kodex}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="op-section">
      <article class="kse-highlight-card">
        <h2>ACE AI반도체TOP3+ — HBM 장비주까지 보고 싶을 때</h2>
        <p>ACE AI반도체TOP3+는 SK하이닉스·삼성전자·한미반도체 3개 종목에 약 75%를 압축 투자합니다. 한미반도체 비중이 크기 때문에 TOP2+ 상품보다 HBM 장비주 베팅 성격이 강하고, 변동성도 상대적으로 높을 수 있습니다.</p>
      </article>
    </section>

    <section class="op-section">
      <h2>채권혼합형 4종 — 연금·IRP용</h2>
      <p class="op-message">퇴직연금·IRP는 위험자산 비중이 70%로 제한됩니다. 채권혼합50 구조는 안전자산으로 분류되어 연금계좌 내 최대 100%까지 투자할 수 있습니다.</p>
      <table class="kse-bond-table">
        <thead><tr><th>ETF</th><th>운용사</th><th>구조</th><th>총보수</th><th>비고</th></tr></thead>
        <tbody>
          {KSE_BOND_MIX_ETFS.map((etf) => (
            <tr><td>{etf.name}</td><td>{etf.manager}</td><td>{etf.structure}</td><td>{formatExpenseRatio(etf.expenseRatio)}</td><td>{etf.note}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="op-section">
      <h2>목적별 선택 가이드</h2>
      <table class="kse-match-table">
        <thead><tr><th>내가 원하는 것</th><th>우선 볼 ETF</th></tr></thead>
        <tbody>
          {KSE_MATCHING_ROWS.map((row) => (
            <tr><td>{row.need}</td><td>{row.etf}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <SeoContent
      introTitle="국내 반도체 ETF 비교 핵심 정리"
      intro={[KSE_META.description, KSE_META.dataNote]}
      criteria={[
        "총보수·순자산은 각 운용사 공식 페이지 기준이며 리밸런싱마다 바뀔 수 있습니다.",
        "미국 ETF까지 포함한 폭넓은 비교는 아래 관련 리포트를 참고하세요.",
        "이 리포트는 투자를 추천하지 않으며, 실제 투자 전 공식 페이지에서 최신 정보를 재확인해야 합니다.",
      ]}
      faq={KSE_FAQ}
      related={KSE_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>

  <script id="kseChartSeed" type="application/json" set:html={JSON.stringify(chartSeed)}></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
  <script type="module" src={withBase("/scripts/korea-semiconductor-etf-2026.js")}></script>
</BaseLayout>
```

---

## 8. `public/scripts/korea-semiconductor-etf-2026.js` 설계

`semiconductor-etf-2026.js`의 탭 필터 패턴을 그대로 재사용:

```js
const categoryTabs = document.getElementById("kseCategoryTabs");
const chartSeedElement = document.getElementById("kseChartSeed");

if (categoryTabs) {
  categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-tab]");
    if (!button) return;
    const category = button.getAttribute("data-category-tab") || "all";
    categoryTabs.querySelectorAll(".kse-tab-btn").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    document.querySelectorAll("[data-category-row]").forEach((row) => {
      const rowCategory = row.getAttribute("data-category-row");
      row.classList.toggle("is-hidden", !(category === "all" || rowCategory === category));
    });
  });
}

if (chartSeedElement) {
  const seed = JSON.parse(chartSeedElement.textContent || "{}");
  const canvas = document.getElementById("kseAumChart");
  const rows = Array.isArray(seed.etfs) ? seed.etfs : [];

  if (canvas && rows.length && window.Chart) {
    const categoryColor = { TOP2: "rgba(26, 86, 219, 0.82)", TOP3: "rgba(180, 83, 9, 0.82)", BROAD: "rgba(5, 150, 105, 0.82)" };
    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((item) => item.ticker),
        datasets: [{
          label: "순자산(억원)",
          data: rows.map((item) => Number(item.aumKrwBillion || 0)),
          backgroundColor: rows.map((item) => categoryColor[item.category] || "rgba(107, 114, 128, 0.82)"),
          borderRadius: 8,
          maxBarThickness: 40,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const value = Number(context.raw || 0);
                return value >= 10000 ? `순자산: ${(value / 10000).toFixed(2)}조원` : `순자산: ${value.toLocaleString("ko-KR")}억원`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: "#4b5563", maxRotation: 45, minRotation: 25 }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { color: "#6b7280", callback: (value) => Number(value) >= 10000 ? `${(Number(value) / 10000).toFixed(0)}조` : `${Number(value).toLocaleString("ko-KR")}억` },
            grid: { color: "rgba(219, 212, 202, 0.5)" },
          },
        },
      },
    });
  }
}
```

**단위 주의:** 데이터 파일의 `aumKrwBillion`은 억원 단위(예: 69900 = 6.99조원)로 통일 — 기존 `semiconductorEtf2026.ts`가 억원 단위였던 것과 다르게 헷갈리지 않도록 변수명을 그대로 "억원"으로 유지하고, 차트 콜백에서 10000억=1조 환산 기준을 명확히 한다.

---

## 9. reports.ts 등록

```ts
{
  slug: "korea-semiconductor-etf-2026",
  title: "국내 반도체 ETF 2026 | SOL·KODEX·ACE 뭐가 다를까 총정리",
  description: "SOL·KODEX AI반도체TOP2플러스, ACE AI반도체TOP3+, TIGER 반도체TOP10 등 국내 상장 반도체 ETF 10종의 구성종목·보수·순자산을 비교. 연금계좌용 채권혼합형까지 포함.",
  order: 72,
  badges: ["NEW", "반도체", "ETF", "국내"],
},
```

## 9-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"korea-semiconductor-etf-2026": { category: "invest", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"korea-semiconductor-etf-2026": {
  eyebrow: "국내 반도체 ETF",
  tags: [{ label: "반도체", mod: "asset" }, { label: "ETF", mod: "asset" }, { label: "국내", mod: "asset" }],
  category: "invest",
  isNew: true,
},
```

> `category` 값은 기존 `semiconductor-etf-2026`, `semiconductor-value-chain` 항목이 실제로 등록된 카테고리 키와 동일하게 맞춘다 (구현 시 두 파일에서 기존 값 확인 후 반영).

---

## 10. app.scss import

```scss
@use 'scss/pages/korea-semiconductor-etf-2026';
```

---

## 11. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/korea-semiconductor-etf-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 12. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| SeoContent related (1번째, 자기잠식 방지용 최우선 배치) | 미국·한국 반도체 ETF 비교 2026 | `/reports/semiconductor-etf-2026/` |
| SeoContent related | 반도체 산업 구조 한눈에 보기 | `/reports/semiconductor-value-chain/` |
| SeoContent related | 반도체 개별 종목 실적 전망 2026~2028 | `/reports/semiconductor-stocks-forecast-2026-2028/` |
| SeoContent related | 반도체 종목 적립식 투자 계산기 | `/tools/dca-investment-calculator/?tab=SEMICONDUCTOR` |

---

## 13. 데이터 정확성 / QA 포인트

- [ ] **구현 전 재검증 필수**: ACE AI반도체TOP3+ 총보수, KODEX/KIWOOM 채권혼합형 총보수, TIGER 반도체TOP10·HANARO Fn K-반도체 상장일 — 기획서에도 "확인 필요"로 남아있던 항목. 운용사 공식 페이지에서 확정 수치로 교체.
- [ ] `formatExpenseRatio`가 `null` 값을 "확인 필요"로 정확히 렌더링하는지 확인 (추정치를 확정 수치처럼 노출하지 않기)
- [ ] 기존 `/reports/semiconductor-etf-2026/`과 겹치는 종목(TIGER 반도체TOP10, ACE AI반도체TOP3+)의 순자산·총보수 수치가 두 리포트 간 일치하는지 대조
- [ ] SeoContent `related` 1번째 항목이 반드시 `semiconductor-etf-2026`로 연결되는지 확인 (자기잠식 방지 배치)
- [ ] `.kse-tab-btn` 탭 필터 클릭 시 `[data-category-row]` 행이 정확히 숨김/노출되는지 확인 (전체/TOP2+/TOP3+/대형분산형 4개 케이스)
- [ ] 차트 단위(억원→조원) 콜백이 10,000억 기준으로 정확히 전환되는지 확인
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인, `category` 키가 기존 반도체 리포트와 동일한지 확인
- [ ] 모바일에서 표 가로 스크롤(`table-wrap`) 정상 동작 확인
- [ ] `npm run build` 통과, 라우트 존재 확인

---

## 14. 향후 갱신 계획

총보수·순자산·리밸런싱 편입 종목은 분기 단위로 갱신을 권장한다. 갱신 시 `KSE_META.updatedAt`과 사이트맵 `lastmod`을 함께 업데이트하고, SK스퀘어·삼성전기 등 신규 편입/제외 종목이 있으면 `focus` 필드도 함께 수정한다.
