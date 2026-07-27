# 삼성전자·브로드컴 2,000억달러 협력 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/samsung-broadcom-partnership-2026-plan.md`](../../plan/202607/samsung-broadcom-partnership-2026-plan.md)
> 작성일: 2026-07-27
> 유형: 비교 리포트 (`/reports/`), 정적 페이지 (JS 불필요)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/samsungBroadcomPartnership2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/samsung-broadcom-partnership-2026.astro` |
| 스크립트 | (없음 — 표·카드만으로 구성, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_samsung-broadcom-partnership-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `sbp-` (Samsung Broadcom Partnership)

---

## 2. URL 및 메타

```
슬러그: /reports/samsung-broadcom-partnership-2026/
타이틀(seoTitle): 삼성전자 브로드컴 2000억달러 협력 2026 완전 정리 | 파운드리 반전될까
디스크립션: 삼성전자와 브로드컴의 2000억달러 규모 AI 반도체 MOU 내용을 정리합니다. HBM·2나노 파운드리·패키징 협력 범위, 파운드리 흑자 전환 가능성, 확인 체크포인트 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/samsungBroadcomPartnership2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type SbpMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  announceDate: string;
  dealSize: string;
  dealPeriod: string;
  dealType: "MOU";
  notice: string;
};

export type SbpSummaryCard = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type SbpScopeRow = {
  area: string;         // 메모리 / 파운드리 / 첨단 패키징
  content: string;
};

export type SbpChecklistItem = {
  label: string;
  done?: boolean;   // 항상 false — 아직 미확인 항목이라는 의미로 렌더링
};

export type SbpRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description?: string };

// ── 데이터 ────────────────────────────────────────

export const SBP_META: SbpMeta = {
  slug: "samsung-broadcom-partnership-2026",
  title: "삼성전자 브로드컴 2,000억달러 협력, 파운드리 반전될까",
  seoTitle: "삼성전자 브로드컴 2000억달러 협력 2026 완전 정리 | 파운드리 반전될까",
  seoDescription:
    "삼성전자와 브로드컴의 2000억달러 규모 AI 반도체 MOU 내용을 정리합니다. HBM·2나노 파운드리·패키징 협력 범위, 파운드리 흑자 전환 가능성, 확인 체크포인트 포함.",
  description: "MOU 협력 범위부터 확인해야 할 체크포인트까지 한 번에 정리했습니다.",
  updatedAt: "2026-07-27",
  announceDate: "2026년 7월 25일",
  dealSize: "2,000억달러 이상 (예상)",
  dealPeriod: "2026~2030년 (5년)",
  dealType: "MOU",
  notice: "이 페이지는 보도·공식 발표 기반 분석이며 투자 권유가 아닙니다. MOU 단계 수치는 확정 매출이 아닌 예상 규모입니다.",
};

export const SBP_SUMMARY_CARDS: SbpSummaryCard[] = [
  { label: "계약 규모", value: "2,000억달러 이상 (예상)", badge: "보도 기반" },
  { label: "협력 형태", value: "MOU (구속력 있는 확정 계약 아님)", badge: "공식" },
  { label: "협력 범위", value: "메모리(HBM)·파운드리(2나노 이하)·첨단 패키징(2.3D·2.5D)", badge: "공식" },
];

export const SBP_DEAL_SCOPE: SbpScopeRow[] = [
  { area: "메모리", content: "브로드컴 차세대 AI 가속기용 HBM 공급" },
  { area: "파운드리", content: "2나노 이하 공정으로 브로드컴 반도체 생산" },
  { area: "첨단 패키징", content: "2.3D·2.5D 패키징 기술 협력" },
];

export const SBP_POSITIVE_FACTORS: string[] = [
  "HBM 고객 다변화 (엔비디아 외 브로드컴 확보)",
  "파운드리 2나노 가동률 개선 가능성",
  "첨단 패키징 매출 확대",
  "파운드리 누적 적자 축소 가능성",
];

export const SBP_VERIFICATION_CHECKLIST: SbpChecklistItem[] = [
  { label: "브로드컴용 HBM 인증 완료 여부" },
  { label: "2나노 실제 양산 수율" },
  { label: "고객별 웨이퍼 투입량" },
  { label: "패키징 물량 확정 여부" },
  { label: "계약 금액의 확정 발주 전환 시점" },
];

export const SBP_INVESTOR_CHECKLIST: string[] = [
  "브로드컴 HBM 인증 일정 공식 확인",
  "2나노 수율 관련 후속 보도",
  "파운드리 사업부 분기 실적(적자 폭 변화)",
  "확정 계약(발주) 전환 공시 여부",
  "브로드컴 외 추가 ASIC 고객사 확보 여부",
];

export const SBP_RISKS: SbpRiskRow[] = [
  { risk: "MOU 불이행 가능성", content: "구속력 없는 양해각서로, 계약 조건 변경·축소 가능", severity: "중간" },
  { risk: "경쟁 심화", content: "TSMC 등 경쟁 파운드리와의 수주 경쟁 지속", severity: "높음" },
  { risk: "실적 반영 시차", content: "실제 매출·이익 기여까지 최소 1~2년 이상 소요", severity: "중간" },
];

export const SBP_FAQ: FaqItem[] = [
  { question: "2,000억달러는 확정 계약금액인가요?", answer: "아닙니다. 2030년까지 5년간 예상되는 협력 규모이며 MOU(양해각서) 단계입니다." },
  { question: "브로드컴은 어떤 회사인가요?", answer: "구글 등 빅테크의 커스텀 AI 가속기(ASIC) 설계·공급에 강점이 있는 반도체 기업입니다." },
  { question: "삼성전자 파운드리 적자가 이걸로 바로 해소되나요?", answer: "아닙니다. HBM 인증, 2나노 수율, 실제 발주 전환이 확인돼야 하며 통상 시차가 있습니다." },
  { question: "HBM 계약과 무슨 관계인가요?", answer: "브로드컴의 차세대 AI 가속기에 들어갈 HBM을 삼성전자가 공급하는 내용이 포함돼 있어 HBM 고객 다변화로 볼 수 있습니다." },
  { question: "SK하이닉스와는 어떻게 다른가요?", answer: "SK하이닉스는 엔비디아와 GPU용 HBM 공급·공동개발 중심이고, 이번 건은 삼성전자가 브로드컴(ASIC) 고객을 신규 확보한 사례입니다." },
];

export const SBP_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성전자 DS 성과급 계산 기준 가이드" },
  { href: "/reports/samsung-bonus-rank-net-comparison-2026/", label: "삼성전자 성과급 직급별 실수령액 비교 2026" },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교 리포트" },
  { href: "/reports/hbm4-vs-hbm5-beneficiary-comparison/", label: "HBM4 vs HBM5 수혜 비교" },
  { href: "/reports/semiconductor-etf-2026/", label: "국내·미국 반도체 ETF 비교 2026" },
  { href: "/reports/semiconductor-value-chain/", label: "엔비디아는 왜 공장이 없을까? 반도체 산업 구조" },
  { href: "/reports/skhynix-nvidia-partnership-2026/", label: "SK하이닉스·엔비디아 5,000억달러 협력 2026" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 삼성전자 · 브로드컴
 └─ title: 삼성전자 브로드컴 2,000억달러 협력, 파운드리 반전될까
 └─ description: MOU 협력 범위부터 확인해야 할 체크포인트까지 한 번에 정리

InfoNotice (면책 배너) — SBP_META.notice

섹션 1 — 핵심 요약 카드 3개 (SBP_SUMMARY_CARDS)
섹션 2 — MOU 상세 내용 표 (SBP_DEAL_SCOPE)
섹션 3 — 왜 중요한가 (구조도 + 설명 문단, 정적 텍스트)
섹션 4 — 삼성전자에 미치는 영향 (긍정 요인 vs 확인 필요 체크리스트, 2열)
 └─ SBP_POSITIVE_FACTORS / SBP_VERIFICATION_CHECKLIST
섹션 5 — 성과급에 영향이 있을까 (재직자 관점 인포박스 + CTA)
섹션 6 — 투자자 체크리스트 & 리스크
 └─ SBP_INVESTOR_CHECKLIST / SBP_RISKS
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

### 페이지 전용 마크업 (`sbp-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.sbp-page` | 루트 스코프 |
| `.sbp-summary-grid` | 섹션 1 — 3-카드 그리드 |
| `.sbp-scope-table` | 섹션 2 — 협력 범위 표 |
| `.sbp-structure-diagram` | 섹션 3 — 구조도 (`<pre>` 또는 flex 다이어그램) |
| `.sbp-impact-cols` | 섹션 4 — 긍정 요인 vs 확인 필요 2열 |
| `.sbp-check-list` | 섹션 4·6 — 체크리스트 (아이콘 + 텍스트) |
| `.sbp-cta-group` | 내부 CTA 버튼 묶음 |
| `.sbp-risk-cards` | 섹션 6 — 리스크 카드 (severity별 색상) |
| `.sbp-badge` | 공식·보도기반·추정 뱃지 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_samsung-broadcom-partnership-2026.scss`

```scss
.sbp-page {
  --sbp-ink:        #14213d;
  --sbp-muted:      #5d6b82;
  --sbp-line:       rgba(20, 33, 61, 0.12);
  --sbp-soft:       #f5f7fb;
  --sbp-primary:    #1a56db;
  --sbp-primary-bg: #eff4ff;
  --sbp-green:      #059669;
  --sbp-amber:      #d97706;
  --sbp-red:        #dc2626;

  .sbp-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .sbp-scope-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--sbp-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .sbp-structure-diagram {
    background: var(--sbp-soft);
    border-radius: 12px;
    padding: 1.25rem;
    font-family: ui-monospace, monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .sbp-impact-cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .sbp-check-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li { display: flex; align-items: flex-start; gap: 0.6rem; }
  }

  .sbp-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .sbp-risk-card--high { border-left: 4px solid var(--sbp-red); }
  .sbp-risk-card--mid  { border-left: 4px solid var(--sbp-amber); }
  .sbp-risk-card--low  { border-left: 4px solid var(--sbp-green); }

  .sbp-badge {
    display: inline-block;
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
    font-size: 0.72rem;

    &--official  { background: #d1fae5; color: #065f46; }
    &--reported  { background: #dbeafe; color: #1e40af; }
    &--estimate  { background: #fef3c7; color: #92400e; }
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
  SBP_META,
  SBP_SUMMARY_CARDS,
  SBP_DEAL_SCOPE,
  SBP_POSITIVE_FACTORS,
  SBP_VERIFICATION_CHECKLIST,
  SBP_INVESTOR_CHECKLIST,
  SBP_RISKS,
  SBP_FAQ,
  SBP_RELATED_LINKS,
} from "../../data/samsungBroadcomPartnership2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SBP_META.slug}/`;

const badgeClass = (badge?: string) =>
  badge === "공식" ? "sbp-badge--official" : badge === "추정" ? "sbp-badge--estimate" : "sbp-badge--reported";

const severityClass = (severity: string) =>
  severity === "높음" ? "sbp-risk-card--high" : severity === "중간" ? "sbp-risk-card--mid" : "sbp-risk-card--low";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SBP_META.title,
    description: SBP_META.seoDescription,
    dateModified: SBP_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SBP_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SBP_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SBP_META.seoTitle} description={SBP_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page sbp-page" data-report="samsung-broadcom-partnership-2026">
    <CalculatorHero
      eyebrow="삼성전자 · 브로드컴"
      title={SBP_META.title}
      description={SBP_META.description}
    />

    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[SBP_META.notice]} />

    <section class="content-section">
      <h2>핵심 요약</h2>
      <div class="sbp-summary-grid">
        {SBP_SUMMARY_CARDS.map((card) => (
          <article class="card">
            <p class="sbp-badge {badgeClass(card.badge)}">{card.badge}</p>
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section">
      <h2>MOU 협력 범위</h2>
      <div class="table-wrap">
        <table class="sbp-scope-table">
          <thead><tr><th>영역</th><th>내용</th></tr></thead>
          <tbody>
            {SBP_DEAL_SCOPE.map((row) => <tr><td>{row.area}</td><td>{row.content}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section">
      <h2>왜 중요한가</h2>
      <pre class="sbp-structure-diagram">{`삼성 HBM
+ 삼성 2나노 파운드리
+ 삼성 첨단 패키징
= AI 반도체 턴키 솔루션`}</pre>
      <p>브로드컴은 구글 등 빅테크의 커스텀 AI 가속기(ASIC) 설계 생태계의 핵심 기업입니다. 삼성전자가 HBM·파운드리·패키징을 한 번에 묶어 제공하는 턴키 솔루션 계약 구조입니다.</p>
    </section>

    <section class="content-section">
      <h2>삼성전자에 미치는 영향</h2>
      <div class="sbp-impact-cols">
        <div>
          <h3>긍정 요인</h3>
          <ul class="sbp-check-list">
            {SBP_POSITIVE_FACTORS.map((item) => <li>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3>확인해야 할 부분</h3>
          <ul class="sbp-check-list">
            {SBP_VERIFICATION_CHECKLIST.map((item) => <li>{item.label}</li>)}
          </ul>
        </div>
      </div>
    </section>

    <section class="content-section">
      <h2>성과급에 영향이 있을까</h2>
      <p>파운드리 사업부 적자 축소 시 삼성전자 전체 성과급 재원(DS 부문 OPI)에 긍정적 영향을 줄 수 있습니다. 다만 MOU에서 실제 매출 반영까지 통상 1~2년 이상 소요됩니다.</p>
      <div class="sbp-cta-group">
        <a href="/reports/samsung-ds-bonus-calculation-guide/">삼성전자 DS 성과급 계산 기준 가이드 →</a>
        <a href="/reports/samsung-bonus-rank-net-comparison-2026/">삼성전자 성과급 직급별 실수령액 비교 2026 →</a>
      </div>
    </section>

    <section class="content-section">
      <h2>투자자 체크리스트</h2>
      <ul class="sbp-check-list">
        {SBP_INVESTOR_CHECKLIST.map((item) => <li>{item}</li>)}
      </ul>
      <h3>리스크</h3>
      {SBP_RISKS.map((r) => (
        <div class={`card ${severityClass(r.severity)}`}>
          <strong>{r.risk}</strong>
          <p>{r.content}</p>
        </div>
      ))}
    </section>

    <SeoContent
      introTitle="삼성전자 브로드컴 협력 핵심 정리"
      intro={[SBP_META.description, SBP_META.notice]}
      criteria={[
        "2,000억달러는 2030년까지 5년간 예상되는 협력 규모이며 MOU 단계입니다.",
        "협력 범위는 메모리(HBM)·파운드리(2나노 이하)·첨단 패키징 3개 영역입니다.",
        "실질적 주가 재평가를 위해서는 HBM 인증, 2나노 수율, 확정 발주 전환이 확인돼야 합니다.",
      ]}
      faq={SBP_FAQ}
      related={SBP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "samsung-broadcom-partnership-2026",
  title: "삼성전자 브로드컴 2000억달러 협력 2026 완전 정리 | 파운드리 반전될까",
  description: "삼성전자와 브로드컴의 2000억달러 규모 AI 반도체 MOU 내용을 정리합니다. HBM·2나노 파운드리·패키징 협력 범위, 파운드리 흑자 전환 가능성, 확인 체크포인트 포함.",
  order: 78,
  badges: ["NEW", "삼성전자", "브로드컴", "반도체"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"samsung-broadcom-partnership-2026": { category: "asset", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"samsung-broadcom-partnership-2026": {
  eyebrow: "삼성전자 · 브로드컴",
  tags: [{ label: "삼성전자", mod: "asset" }, { label: "브로드컴", mod: "asset" }, { label: "파운드리", mod: "asset" }],
  category: "asset",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/samsung-broadcom-partnership-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-broadcom-partnership-2026/</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 5 하단 | 삼성전자 DS 성과급 계산 기준 가이드 | `/reports/samsung-ds-bonus-calculation-guide/` |
| 섹션 5 하단 | 삼성전자 성과급 직급별 실수령액 비교 2026 | `/reports/samsung-bonus-rank-net-comparison-2026/` |
| SeoContent related | 삼성전자·SK하이닉스 800조 투자 비교 리포트 | `/reports/samsung-skhynix-800t-investment-comparison-2026/` |
| SeoContent related | HBM4 vs HBM5 수혜 비교 | `/reports/hbm4-vs-hbm5-beneficiary-comparison/` |
| SeoContent related | 국내·미국 반도체 ETF 비교 2026 | `/reports/semiconductor-etf-2026/` |
| SeoContent related | 엔비디아는 왜 공장이 없을까? 반도체 산업 구조 | `/reports/semiconductor-value-chain/` |
| SeoContent related | SK하이닉스·엔비디아 5,000억달러 협력 2026 | `/reports/skhynix-nvidia-partnership-2026/` |

---

## 12. QA 포인트

- [ ] **구현 전 재검증 필수**: Samsung Global Newsroom 원문에서 "2,000억달러 이상" 표현이 예상치인지, 협력 기간(5년/2030년까지)이 정확한지, 패키징 기술명(2.3D/2.5D)이 맞는지 대조
- [ ] 면책 InfoNotice가 Hero 바로 아래 노출되는지 확인
- [ ] `sbp-badge` 공식(초록)·보도기반(파랑)·추정(주황) 색상 구분 확인
- [ ] 긍정 요인 vs 확인 필요 2열이 모바일에서 1열로 스택되는지 확인
- [ ] 리스크 카드 severity별 left border 색상 확인
- [ ] 내부 CTA 7개 링크 모두 작동 확인 (특히 `skhynix-nvidia-partnership-2026`은 함께 배포되는 리포트이므로 동시 배포 필요)
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 `/reports/samsung-broadcom-partnership-2026/` 존재 확인
- [ ] 모바일에서 표 가로 스크롤(`table-wrap`) 정상 동작 확인
