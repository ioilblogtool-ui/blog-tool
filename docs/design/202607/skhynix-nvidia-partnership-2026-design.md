# SK하이닉스·엔비디아 5,000억달러 협력 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/skhynix-nvidia-partnership-2026-plan.md`](../../plan/202607/skhynix-nvidia-partnership-2026-plan.md)
> 작성일: 2026-07-27
> 유형: 비교 리포트 (`/reports/`), 정적 페이지 (JS 불필요)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/skhynixNvidiaPartnership2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/skhynix-nvidia-partnership-2026.astro` |
| 스크립트 | (없음 — 표·구조도만으로 구성, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_skhynix-nvidia-partnership-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `snp-` (SK hynix Nvidia Partnership)

---

## 2. URL 및 메타

```
슬러그: /reports/skhynix-nvidia-partnership-2026/
타이틀(seoTitle): SK하이닉스 엔비디아 5000억달러 협력 2026 | 2GW AI 팩토리 완전 정리
디스크립션: SK그룹과 엔비디아의 5000억달러 규모 AI 인프라 협력 LOI를 정리합니다. HBM 공동개발 구조 변화, 2GW AI 팩토리 의미, SK그룹 밸류체인까지 한눈에 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/skhynixNvidiaPartnership2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type SnpMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  announceDate: string;
  dealSize: string;
  dealType: "LOI";
  targetOperationYear: number;
  notice: string;
};

export type SnpSummaryCard = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type SnpRoleRow = {
  entity: string;   // SK하이닉스 / SK텔레콤 / 엔비디아 / 가동 시기
  content: string;
};

export type SnpValueChainRow = {
  company: string;
  role: string;
};

export type SnpRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description?: string };

// ── 데이터 ────────────────────────────────────────

export const SNP_META: SnpMeta = {
  slug: "skhynix-nvidia-partnership-2026",
  title: "SK하이닉스 엔비디아 5,000억달러 협력, 뭐가 달라지나",
  seoTitle: "SK하이닉스 엔비디아 5000억달러 협력 2026 | 2GW AI 팩토리 완전 정리",
  seoDescription:
    "SK그룹과 엔비디아의 5000억달러 규모 AI 인프라 협력 LOI를 정리합니다. HBM 공동개발 구조 변화, 2GW AI 팩토리 의미, SK그룹 밸류체인까지 한눈에 확인하세요.",
  description: "LOI 협력 구조부터 2GW AI 팩토리 의미까지 정리했습니다.",
  updatedAt: "2026-07-27",
  announceDate: "2026년 7월 24일",
  dealSize: "5,000억달러 이상 (예상)",
  dealType: "LOI",
  targetOperationYear: 2027,
  notice: "이 페이지는 보도·공식 발표 기반 분석이며 투자 권유가 아닙니다. LOI(의향서) 단계 수치는 확정 계약이 아닌 예상 규모입니다.",
};

export const SNP_SUMMARY_CARDS: SnpSummaryCard[] = [
  { label: "협력 규모", value: "5,000억달러 이상 (예상, LOI 단계)", badge: "보도 기반" },
  { label: "협력 주체", value: "SK하이닉스(메모리)·SK텔레콤(AI 클라우드)·엔비디아", badge: "공식" },
  { label: "가동 목표", value: "첫 AI 팩토리 2027년 가동", badge: "공식" },
];

export const SNP_DEAL_ROLES: SnpRoleRow[] = [
  { entity: "SK하이닉스", content: "엔비디아와 HBM 등 차세대 AI 메모리 장기 공급·공동 개발" },
  { entity: "SK텔레콤", content: "국내 2GW 규모 AI 클라우드·AI 팩토리 구축" },
  { entity: "엔비디아", content: "Vera Rubin 및 DSX AI 팩토리 플랫폼 제공" },
  { entity: "가동 시기", content: "첫 AI 팩토리 2027년 가동 목표" },
];

export const SNP_VALUE_CHAIN: SnpValueChainRow[] = [
  { company: "SK하이닉스", role: "HBM 공급" },
  { company: "SK텔레콤·SK브로드밴드", role: "AI 클라우드·데이터센터 운영" },
  { company: "SK이노베이션·SK E&S 계열", role: "전력·에너지" },
  { company: "SK에코플랜트", role: "데이터센터 건설·냉각" },
  { company: "엔비디아", role: "GPU·네트워크·소프트웨어" },
];

export const SNP_POSITIVE_FACTORS: string[] = [
  "엔비디아향 HBM 장기 수요 가시성 강화",
  "GPU 설계 초기 단계부터 공동 개발 참여 가능성",
  "SK그룹 계열사 전반(통신·에너지·건설) 밸류체인 수혜",
];

export const SNP_VERIFICATION_POINTS: string[] = [
  "LOI(의향서) 단계로, 확정 계약(공급계약) 전환 여부",
  "이미 HBM 지배력·엔비디아 협력 기대가 주가에 상당 부분 반영돼 있을 가능성",
  "실제 공동개발 계약 체결 시점과 조건",
];

export const SNP_RISKS: SnpRiskRow[] = [
  { risk: "LOI 불확실성", content: "의향서 단계로 확정 계약 조건·규모 변경 가능", severity: "중간" },
  { risk: "밸류에이션 부담", content: "기대감이 이미 주가에 선반영됐을 가능성", severity: "높음" },
  { risk: "전력·인허가", content: "2GW급 데이터센터 전력 확보·인허가 지연 리스크", severity: "중간" },
  { risk: "가동 지연", content: "2027년 가동 목표 대비 실제 착공·완공 지연 가능성", severity: "중간" },
];

export const SNP_FAQ: FaqItem[] = [
  { question: "5,000억달러는 확정 계약금액인가요?", answer: "아닙니다. LOI(의향서) 단계에서 발표된 예상 협력 규모입니다." },
  { question: "2GW는 어느 정도 규모인가요?", answer: "일반적인 데이터센터보다 훨씬 큰 규모로, AI 팩토리급 대형 시설에 해당합니다." },
  { question: "SK하이닉스와 엔비디아 관계가 실제로 달라지나요?", answer: "기존 공급 요청 방식에서 GPU·HBM 공동 개발 참여로 확장될 가능성이 있으나, 구체적 계약 체결까지 확인이 필요합니다." },
  { question: "SK텔레콤은 왜 등장하나요?", answer: "국내 2GW AI 클라우드·AI 팩토리 구축을 SK텔레콤이 맡기 때문에, 통신사에서 AI 인프라 사업자로 사업 구조가 확대되는 사례입니다." },
  { question: "삼성전자·브로드컴 건과는 어떻게 다른가요?", answer: "삼성전자 건은 브로드컴(ASIC 고객)과의 파운드리·패키징 중심 계약이고, 이번 건은 엔비디아(GPU)와의 메모리 공동개발·AI 팩토리 구축 계약입니다." },
];

export const SNP_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/sk-hynix-bonus-2027/", label: "SK하이닉스 2027 성과급 전망 (PS·PI 시나리오)" },
  { href: "/reports/semiconductor-value-chain/", label: "엔비디아는 왜 공장이 없을까? 반도체 산업 구조" },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교 리포트" },
  { href: "/reports/samsung-broadcom-partnership-2026/", label: "삼성전자 브로드컴 2,000억달러 협력 2026" },
  { href: "/reports/hbm4-vs-hbm5-beneficiary-comparison/", label: "HBM4 vs HBM5 수혜 비교" },
  { href: "/reports/ai-datacenter-infra-beneficiaries-2026/", label: "AI 데이터센터 전력·냉각 수혜 업종 2026" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: SK하이닉스 · 엔비디아
 └─ title: SK하이닉스 엔비디아 5,000억달러 협력, 뭐가 달라지나
 └─ description: LOI 협력 구조부터 2GW AI 팩토리 의미까지 정리

InfoNotice (면책 배너) — SNP_META.notice

섹션 1 — 핵심 요약 카드 3개 (SNP_SUMMARY_CARDS)
섹션 2 — LOI 상세 내용 표 (SNP_DEAL_ROLES)
섹션 3 — 기존 관계 vs 향후 관계 (구조도 대비, 정적 텍스트) ★ 핵심
섹션 4 — 2GW AI 팩토리의 의미 + SK그룹 밸류체인 표 (SNP_VALUE_CHAIN)
섹션 5 — SK하이닉스 투자 판단 (긍정 요인 vs 확인 필요 2열)
 └─ SNP_POSITIVE_FACTORS / SNP_VERIFICATION_POINTS
섹션 6 — 성과급에 영향이 있을까 (재직자 관점 + CTA)
섹션 7 — 리스크 정리 (SNP_RISKS)
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

### 페이지 전용 마크업 (`snp-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.snp-page` | 루트 스코프 |
| `.snp-summary-grid` | 섹션 1 — 3-카드 그리드 |
| `.snp-role-table` | 섹션 2 — 주체별 역할 표 |
| `.snp-before-after` | 섹션 3 — 기존 vs 향후 구조도 대비 (2열) |
| `.snp-chain-table` | 섹션 4 — SK그룹 밸류체인 표 |
| `.snp-impact-cols` | 섹션 5 — 긍정 요인 vs 확인 필요 2열 |
| `.snp-check-list` | 리스트 공통 (체크 아이콘 + 텍스트) |
| `.snp-cta-group` | 내부 CTA 버튼 묶음 |
| `.snp-risk-cards` | 섹션 7 — 리스크 카드 (severity별 색상) |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_skhynix-nvidia-partnership-2026.scss`

```scss
.snp-page {
  --snp-ink:        #14213d;
  --snp-muted:      #5d6b82;
  --snp-line:       rgba(20, 33, 61, 0.12);
  --snp-soft:       #f5f7fb;
  --snp-primary:    #1a56db;
  --snp-teal:       #0891b2;
  --snp-green:      #059669;
  --snp-amber:      #d97706;
  --snp-red:        #dc2626;

  .snp-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .snp-role-table, .snp-chain-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--snp-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .snp-before-after {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }

    pre {
      background: var(--snp-soft);
      border-radius: 12px;
      padding: 1rem;
      font-family: ui-monospace, monospace;
      font-size: 0.82rem;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .snp-before pre { border-top: 3px solid var(--snp-muted); }
    .snp-after pre  { border-top: 3px solid var(--snp-primary); }
  }

  .snp-impact-cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .snp-check-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li { display: flex; align-items: flex-start; gap: 0.6rem; }
  }

  .snp-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .snp-risk-card--high { border-left: 4px solid var(--snp-red); }
  .snp-risk-card--mid  { border-left: 4px solid var(--snp-amber); }
  .snp-risk-card--low  { border-left: 4px solid var(--snp-green); }

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
  SNP_META,
  SNP_SUMMARY_CARDS,
  SNP_DEAL_ROLES,
  SNP_VALUE_CHAIN,
  SNP_POSITIVE_FACTORS,
  SNP_VERIFICATION_POINTS,
  SNP_RISKS,
  SNP_FAQ,
  SNP_RELATED_LINKS,
} from "../../data/skhynixNvidiaPartnership2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SNP_META.slug}/`;

const severityClass = (severity: string) =>
  severity === "높음" ? "snp-risk-card--high" : severity === "중간" ? "snp-risk-card--mid" : "snp-risk-card--low";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SNP_META.title,
    description: SNP_META.seoDescription,
    dateModified: SNP_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SNP_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SNP_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SNP_META.seoTitle} description={SNP_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page snp-page" data-report="skhynix-nvidia-partnership-2026">
    <CalculatorHero
      eyebrow="SK하이닉스 · 엔비디아"
      title={SNP_META.title}
      description={SNP_META.description}
    />

    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[SNP_META.notice]} />

    <section class="content-section">
      <h2>핵심 요약</h2>
      <div class="snp-summary-grid">
        {SNP_SUMMARY_CARDS.map((card) => (
          <article class="card">
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section">
      <h2>LOI 상세 내용</h2>
      <div class="table-wrap">
        <table class="snp-role-table">
          <thead><tr><th>주체</th><th>협력 내용</th></tr></thead>
          <tbody>
            {SNP_DEAL_ROLES.map((row) => <tr><td>{row.entity}</td><td>{row.content}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section">
      <h2>기존 관계 vs 향후 관계</h2>
      <div class="snp-before-after">
        <div class="snp-before">
          <h3>기존</h3>
          <pre>{`엔비디아 GPU 설계
→ HBM 사양 요청
→ 공급`}</pre>
        </div>
        <div class="snp-after">
          <h3>향후</h3>
          <pre>{`엔비디아 + SK하이닉스 공동 최적화
→ GPU·HBM 동시 개발
→ 장기 공급`}</pre>
        </div>
      </div>
      <p>이번 협력은 SK하이닉스가 엔비디아 차세대 GPU·AI 시스템 개발 초기 단계부터 메모리 설계에 참여할 가능성을 시사합니다.</p>
    </section>

    <section class="content-section">
      <h2>2GW AI 팩토리의 의미</h2>
      <p>2GW는 일반적인 데이터센터보다 압도적으로 큰 규모입니다. SK텔레콤이 엔비디아 DSX 아키텍처·Vera Rubin 시스템·SK하이닉스 HBM4를 결합한 AI 팩토리를 구축할 계획입니다.</p>
      <div class="table-wrap">
        <table class="snp-chain-table">
          <thead><tr><th>계열사</th><th>역할</th></tr></thead>
          <tbody>
            {SNP_VALUE_CHAIN.map((row) => <tr><td>{row.company}</td><td>{row.role}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section">
      <h2>SK하이닉스 투자 판단</h2>
      <div class="snp-impact-cols">
        <div>
          <h3>긍정 요인</h3>
          <ul class="snp-check-list">
            {SNP_POSITIVE_FACTORS.map((item) => <li>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3>확인해야 할 부분</h3>
          <ul class="snp-check-list">
            {SNP_VERIFICATION_POINTS.map((item) => <li>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>

    <section class="content-section">
      <h2>성과급에 영향이 있을까</h2>
      <p>HBM 장기 수요 가시성 강화는 실적 개선 시 PS·PI 재원 확대 가능성으로 이어질 수 있습니다. 다만 LOI에서 확정 계약, 매출 반영까지 시차가 있습니다.</p>
      <div class="snp-cta-group">
        <a href="/reports/sk-hynix-bonus-2027/">SK하이닉스 2027 성과급 전망 (PS·PI 시나리오) →</a>
      </div>
    </section>

    <section class="content-section">
      <h2>리스크 정리</h2>
      {SNP_RISKS.map((r) => (
        <div class={`card ${severityClass(r.severity)}`}>
          <strong>{r.risk}</strong>
          <p>{r.content}</p>
        </div>
      ))}
    </section>

    <SeoContent
      introTitle="SK하이닉스 엔비디아 협력 핵심 정리"
      intro={[SNP_META.description, SNP_META.notice]}
      criteria={[
        "5,000억달러는 SK그룹·엔비디아 LOI(의향서) 단계의 예상 협력 규모입니다.",
        "SK하이닉스는 HBM 공동개발, SK텔레콤은 2GW AI 클라우드 구축을 맡습니다.",
        "첫 AI 팩토리 가동 목표는 2027년이며, 실제 착공·가동 일정은 별도 확인이 필요합니다.",
      ]}
      faq={SNP_FAQ}
      related={SNP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "skhynix-nvidia-partnership-2026",
  title: "SK하이닉스 엔비디아 5000억달러 협력 2026 | 2GW AI 팩토리 완전 정리",
  description: "SK그룹과 엔비디아의 5000억달러 규모 AI 인프라 협력 LOI를 정리합니다. HBM 공동개발 구조 변화, 2GW AI 팩토리 의미, SK그룹 밸류체인까지 한눈에 확인하세요.",
  order: 79,
  badges: ["NEW", "SK하이닉스", "엔비디아", "반도체"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"skhynix-nvidia-partnership-2026": { category: "asset", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"skhynix-nvidia-partnership-2026": {
  eyebrow: "SK하이닉스 · 엔비디아",
  tags: [{ label: "SK하이닉스", mod: "asset" }, { label: "엔비디아", mod: "asset" }, { label: "AI 팩토리", mod: "asset" }],
  category: "asset",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/skhynix-nvidia-partnership-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/skhynix-nvidia-partnership-2026/</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 6 하단 | SK하이닉스 2027 성과급 전망 (PS·PI 시나리오) | `/reports/sk-hynix-bonus-2027/` |
| SeoContent related | 엔비디아는 왜 공장이 없을까? 반도체 산업 구조 | `/reports/semiconductor-value-chain/` |
| SeoContent related | 삼성전자·SK하이닉스 800조 투자 비교 리포트 | `/reports/samsung-skhynix-800t-investment-comparison-2026/` |
| SeoContent related | 삼성전자 브로드컴 2,000억달러 협력 2026 | `/reports/samsung-broadcom-partnership-2026/` |
| SeoContent related | HBM4 vs HBM5 수혜 비교 | `/reports/hbm4-vs-hbm5-beneficiary-comparison/` |
| SeoContent related | AI 데이터센터 전력·냉각 수혜 업종 2026 | `/reports/ai-datacenter-infra-beneficiaries-2026/` |

---

## 12. QA 포인트

- [ ] **구현 전 재검증 필수**: SK hynix Newsroom 원문에서 "5,000억달러 이상"이 SK그룹 전체 대상인지 SK하이닉스 단독인지, Vera Rubin·DSX 플랫폼 정식 명칭, 2GW 수치 출처를 재검증
- [ ] 면책 InfoNotice가 Hero 바로 아래 노출되는지 확인
- [ ] "기존 vs 향후" 2열 구조도가 모바일에서 1열로 스택되는지 확인
- [ ] 긍정 요인 vs 확인 필요 2열이 모바일에서 1열로 스택되는지 확인
- [ ] 리스크 카드 severity별 left border 색상 확인
- [ ] 내부 CTA 6개 링크 모두 작동 확인 (`samsung-broadcom-partnership-2026`, `ai-datacenter-infra-beneficiaries-2026`와 동시/순차 배포 조율)
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 `/reports/skhynix-nvidia-partnership-2026/` 존재 확인
- [ ] 모바일에서 표 가로 스크롤(`table-wrap`) 정상 동작 확인
