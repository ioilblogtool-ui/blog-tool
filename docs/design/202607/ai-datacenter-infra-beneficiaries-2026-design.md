# AI 데이터센터 전력·냉각 수혜 업종 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/ai-datacenter-infra-beneficiaries-2026-plan.md`](../../plan/202607/ai-datacenter-infra-beneficiaries-2026-plan.md)
> 작성일: 2026-07-27
> 유형: 정보성 리포트 (`/reports/`), 정적 페이지 (JS 불필요)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/aiDatacenterInfraBeneficiaries2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵 — **둘 다** 등록 필수) |
| 페이지 | `src/pages/reports/ai-datacenter-infra-beneficiaries-2026.astro` |
| 스크립트 | (없음 — 강도 표시는 CSS 도트로만 렌더링, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_ai-datacenter-infra-beneficiaries-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `adi-` (AI Datacenter Infra)

---

## 2. URL 및 메타

```
슬러그: /reports/ai-datacenter-infra-beneficiaries-2026/
타이틀(seoTitle): AI 데이터센터 전력·냉각 수혜 업종 2026 | 2GW 시대 밸류체인 정리
디스크립션: AI 데이터센터 확장에 따른 전력·냉각·건설·네트워크 밸류체인을 정리합니다. 업종별 수혜 강도, 국내외 2GW급 프로젝트 현황, 확인 체크리스트 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/aiDatacenterInfraBeneficiaries2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type AdiMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  keyTrend: string;
  notice: string;
};

export type AdiSummaryCard = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type AdiProjectRow = {
  project: string;
  entity: string;
  scale: string;
  targetYear: string;
  note: string;
};

export type AdiSectorRow = {
  sector: string;
  strength: number;         // 1~5
  strengthLabel: string;
  reason: string;
  timeframe: string;
};

export type AdiRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description?: string };

// ── 데이터 ────────────────────────────────────────

export const ADI_META: AdiMeta = {
  slug: "ai-datacenter-infra-beneficiaries-2026",
  title: "AI 데이터센터, 칩보다 전력·냉각이 핵심이 되는 이유",
  seoTitle: "AI 데이터센터 전력·냉각 수혜 업종 2026 | 2GW 시대 밸류체인 정리",
  seoDescription:
    "AI 데이터센터 확장에 따른 전력·냉각·건설·네트워크 밸류체인을 정리합니다. 업종별 수혜 강도, 국내외 2GW급 프로젝트 현황, 확인 체크리스트 포함.",
  description: "2GW급 AI 팩토리 시대, 어떤 업종이 왜 주목받는지 구조로 정리했습니다.",
  updatedAt: "2026-07-27",
  keyTrend: "AI 경쟁이 모델 경쟁에서 전력·데이터센터·HBM·패키징 확보 경쟁으로 이동",
  notice: "이 페이지는 업종·산업 구조를 설명하는 정보성 콘텐츠이며, 특정 종목 매수를 권유하지 않습니다. 수혜 강도는 추정이며 투자 판단은 본인 책임입니다.",
};

export const ADI_SUMMARY_CARDS: AdiSummaryCard[] = [
  { label: "산업 흐름 변화", value: "AI 경쟁이 모델 → 전력·데이터센터·HBM·패키징 확보 경쟁으로 이동", badge: "보도 기반" },
  { label: "대표 사례", value: "SK텔레콤 국내 2GW급 AI 클라우드·AI 팩토리 (2027년 가동 목표)", badge: "공식" },
  { label: "해외 사례", value: "엔비디아, OpenAI 오하이오 10GW급 데이터센터에 약 2,500억달러 금융 보증 검토", badge: "보도 기반" },
];

export const ADI_PROJECTS: AdiProjectRow[] = [
  { project: "SK텔레콤 AI 팩토리", entity: "SK텔레콤 + 엔비디아", scale: "2GW급", targetYear: "2027년", note: "Vera Rubin·DSX 플랫폼 기반" },
  { project: "오하이오 데이터센터 (참고, 해외)", entity: "OpenAI + 엔비디아(금융 보증 검토)", scale: "10GW급", targetYear: "미정", note: "약 2,500억달러 금융 보증 논의 중" },
];

export const ADI_SECTORS: AdiSectorRow[] = [
  { sector: "전력기기·변압기", strength: 5, strengthLabel: "매우 높음", reason: "데이터센터 전력 인입·배전 설비 수요 직결", timeframe: "즉시~2년" },
  { sector: "냉각·항온항습", strength: 4, strengthLabel: "높음", reason: "GPU 서버 열관리 필수 설비", timeframe: "즉시~2년" },
  { sector: "데이터센터 건설·엔지니어링", strength: 4, strengthLabel: "높음", reason: "AI 팩토리 착공 시 공사 발주", timeframe: "1~3년" },
  { sector: "통신·네트워크 장비", strength: 3, strengthLabel: "중상", reason: "데이터센터 간 초고속 연결망 수요", timeframe: "1~3년" },
];

export const ADI_RISKS: AdiRiskRow[] = [
  { risk: "전력망·인허가 지연", content: "대형 데이터센터는 전력 확보·인허가 절차로 착공이 지연될 수 있음", severity: "중간" },
  { risk: "건설 지연", content: "계획 대비 실제 완공·가동 시점이 늦어질 가능성", severity: "중간" },
  { risk: "신용·순환거래 위험", content: "고객사 신용 위험 및 투자·매출 순환 구조에 대한 우려", severity: "높음" },
  { risk: "과잉 투자 사이클", content: "AI 인프라 투자가 과열될 경우 수요 조정 국면 가능성", severity: "높음" },
];

export const ADI_CHECKLIST: string[] = [
  "국내 2GW급 프로젝트의 실제 착공·인허가 진행 상황",
  "전력기기·냉각 업종의 수주 잔고 공시 여부",
  "엔비디아의 데이터센터 금융 지원 규모·조건 확정 여부",
  "AI 데이터센터 투자가 과열 국면인지 여부(밸류에이션 점검)",
  "개별 종목 접근보다 업종 ETF·분산 투자 검토",
];

export const ADI_FAQ: FaqItem[] = [
  { question: "AI 데이터센터가 왜 전력·냉각 이슈로 이어지나요?", answer: "GPU 서버는 전력 소모와 발열이 커서, 대형 AI 팩토리를 지으려면 전력 인입·배전 설비와 냉각 시스템이 함께 필요하기 때문입니다." },
  { question: "2GW는 어느 정도 규모인가요?", answer: "일반 데이터센터보다 훨씬 큰 규모로, 대형 발전소 여러 기에 해당하는 전력 소비량입니다." },
  { question: "이 리포트에 나온 업종은 매수 추천인가요?", answer: "아닙니다. 산업 구조와 수혜 가능성을 설명하는 정보성 콘텐츠이며 개별 종목 매수를 권유하지 않습니다." },
  { question: "엔비디아의 데이터센터 금융 지원은 왜 리스크로 언급되나요?", answer: "GPU 판매사가 고객의 데이터센터 건설 자금까지 지원하면, 투자와 매출이 순환되는 구조에 대한 우려가 있기 때문입니다." },
  { question: "국내에서 관련된 대표 사례는 무엇인가요?", answer: "SK텔레콤이 엔비디아와 함께 추진하는 국내 2GW급 AI 클라우드·AI 팩토리(2027년 가동 목표)가 대표 사례로 언급됩니다." },
];

export const ADI_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-value-chain/", label: "엔비디아는 왜 공장이 없을까? 반도체 산업 구조" },
  { href: "/reports/skhynix-nvidia-partnership-2026/", label: "SK하이닉스 엔비디아 5,000억달러 협력 2026" },
  { href: "/reports/samsung-broadcom-partnership-2026/", label: "삼성전자 브로드컴 2,000억달러 협력 2026" },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교 리포트" },
  { href: "/reports/semiconductor-etf-2026/", label: "국내·미국 반도체 ETF 비교 2026" },
  { href: "/reports/semiconductor-stocks-h1-2026/", label: "반도체 주식 2026 상반기 수익률 랭킹" },
];
```

**품질 주의:** `ADI_SECTORS`의 `strength`·`reason`은 사용자 제공 뉴스 요약 해석을 참고한 추정치다. 구현 시 페이지 문구에서 "추정" 톤을 유지하고, 개별 종목명은 나열하지 않는다(업종 단위로만 서술).

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: AI 데이터센터 밸류체인
 └─ title: AI 데이터센터, 칩보다 전력·냉각이 핵심이 되는 이유
 └─ description: 2GW급 AI 팩토리 시대, 어떤 업종이 왜 주목받는지 구조로 정리

InfoNotice (면책 배너, 최상단) — ADI_META.notice

섹션 1 — 핵심 요약 카드 3개 (ADI_SUMMARY_CARDS)
섹션 2 — AI 인프라 밸류체인 구조도 (정적 텍스트, 이 리포트가 다루는 구간 강조)
섹션 3 — 국내 2GW급 프로젝트 현황 (ADI_PROJECTS)
섹션 4 — 업종별 수혜 강도 ★ 핵심 (ADI_SECTORS, 강도 도트 1~5)
 └─ InfoNotice (면책 반복 — "개별 종목 추천 아님")
섹션 5 — 엔비디아의 사업 확장과 순환거래 논란 (구조도 + 설명)
섹션 6 — 리스크 정리 (ADI_RISKS)
섹션 7 — 개인투자자 체크리스트 (ADI_CHECKLIST)
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
| `InfoNotice.astro` | 면책 배너 (2회 사용) | `title`, `lines` |
| `SeoContent.astro` | FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 페이지 전용 마크업 (`adi-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.adi-page` | 루트 스코프 |
| `.adi-summary-grid` | 섹션 1 — 3-카드 그리드 |
| `.adi-structure-diagram` | 섹션 2 — 밸류체인 구조도 |
| `.adi-project-table` | 섹션 3 — 프로젝트 현황 표 |
| `.adi-sector-grid` | 섹션 4 — 업종별 카드 그리드 |
| `.adi-strength-bar` / `.adi-strength-dot` | 섹션 4 — 강도 도트(1~5) |
| `.adi-circular-diagram` | 섹션 5 — 엔비디아 확장 구조도 |
| `.adi-risk-cards` | 섹션 6 — 리스크 카드 (severity별 색상) |
| `.adi-checklist` | 섹션 7 — 체크리스트 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_ai-datacenter-infra-beneficiaries-2026.scss`

```scss
.adi-page {
  --adi-ink:        #14213d;
  --adi-muted:      #5d6b82;
  --adi-line:       rgba(20, 33, 61, 0.12);
  --adi-soft:       #f5f7fb;
  --adi-primary:    #1a56db;
  --adi-green:      #059669;
  --adi-amber:      #d97706;
  --adi-red:        #dc2626;

  .adi-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .adi-structure-diagram, .adi-circular-diagram {
    background: var(--adi-soft);
    border-radius: 12px;
    padding: 1.25rem;
    font-family: ui-monospace, monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .adi-project-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--adi-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .adi-sector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .adi-sector-card {
    border: 1px solid var(--adi-line);
    border-radius: 12px;
    padding: 1rem;
  }

  .adi-strength-bar { display: flex; gap: 3px; margin: 0.4rem 0; }
  .adi-strength-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--adi-line);

    &--on { background: var(--adi-primary); }
  }

  .adi-risk-card--high { border-left: 4px solid var(--adi-red); }
  .adi-risk-card--mid  { border-left: 4px solid var(--adi-amber); }
  .adi-risk-card--low  { border-left: 4px solid var(--adi-green); }

  .adi-checklist {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li { display: flex; align-items: flex-start; gap: 0.6rem; }
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
  ADI_META,
  ADI_SUMMARY_CARDS,
  ADI_PROJECTS,
  ADI_SECTORS,
  ADI_RISKS,
  ADI_CHECKLIST,
  ADI_FAQ,
  ADI_RELATED_LINKS,
} from "../../data/aiDatacenterInfraBeneficiaries2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${ADI_META.slug}/`;

const severityClass = (severity: string) =>
  severity === "높음" ? "adi-risk-card--high" : severity === "중간" ? "adi-risk-card--mid" : "adi-risk-card--low";

const strengthDots = (strength: number) =>
  Array.from({ length: 5 }, (_, i) => i < strength);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ADI_META.title,
    description: ADI_META.seoDescription,
    dateModified: ADI_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ADI_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: ADI_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={ADI_META.seoTitle} description={ADI_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page adi-page" data-report="ai-datacenter-infra-beneficiaries-2026">
    <CalculatorHero
      eyebrow="AI 데이터센터 밸류체인"
      title={ADI_META.title}
      description={ADI_META.description}
    />

    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[ADI_META.notice]} />

    <section class="content-section">
      <h2>핵심 요약</h2>
      <div class="adi-summary-grid">
        {ADI_SUMMARY_CARDS.map((card) => (
          <article class="card">
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section">
      <h2>AI 인프라 밸류체인 구조</h2>
      <pre class="adi-structure-diagram">{`AI 모델
  ↓
GPU·AI 가속기
  ↓
HBM·파운드리·패키징
  ↓
AI 데이터센터
  ↓
전력·냉각·통신망  ← 이 리포트가 다루는 구간`}</pre>
      <p>기존 반도체 리포트들은 위 구조에서 "GPU~패키징" 구간에 집중했습니다. 이 리포트는 그동안 다루지 않은 "데이터센터~전력·냉각·통신망" 구간에 집중합니다.</p>
    </section>

    <section class="content-section">
      <h2>국내외 2GW급 프로젝트 현황</h2>
      <div class="table-wrap">
        <table class="adi-project-table">
          <thead><tr><th>프로젝트</th><th>주체</th><th>규모</th><th>가동 목표</th><th>비고</th></tr></thead>
          <tbody>
            {ADI_PROJECTS.map((p) => (
              <tr><td>{p.project}</td><td>{p.entity}</td><td>{p.scale}</td><td>{p.targetYear}</td><td>{p.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="op-message">국내 프로젝트는 발표 초기 단계로 착공·인허가 일정은 별도 확인이 필요합니다.</p>
    </section>

    <section class="content-section">
      <h2>업종별 수혜 강도</h2>
      <div class="adi-sector-grid">
        {ADI_SECTORS.map((s) => (
          <article class="adi-sector-card">
            <h3>{s.sector}</h3>
            <div class="adi-strength-bar">
              {strengthDots(s.strength).map((on) => <span class={`adi-strength-dot ${on ? "adi-strength-dot--on" : ""}`}></span>)}
            </div>
            <p>{s.reason}</p>
            <p><strong>시차:</strong> {s.timeframe}</p>
          </article>
        ))}
      </div>
      <InfoNotice title="다시 한번 확인하세요" lines={["수혜 강도는 산업 구조상 추정이며 개별 종목 추천이 아닙니다."]} />
    </section>

    <section class="content-section">
      <h2>엔비디아의 사업 확장과 순환거래 논란</h2>
      <pre class="adi-circular-diagram">{`GPU 판매
→ GPU 서버·네트워크
→ CUDA·AI 소프트웨어
→ 데이터센터 설계
→ AI 클라우드
→ 데이터센터 금융 지원`}</pre>
      <p>엔비디아가 고객사(OpenAI 등)의 데이터센터 건설·자금 조달까지 지원하며 미래 GPU 수요를 직접 만들어내는 구조로 확장하고 있습니다. 다만 `엔비디아 투자 → 고객 데이터센터 건설 → 엔비디아 GPU 구매`라는 구조가 반복될 경우 실제 수요와 회계상 매출이 괴리될 위험이 있다는 지적도 있습니다.</p>
    </section>

    <section class="content-section">
      <h2>리스크 정리</h2>
      {ADI_RISKS.map((r) => (
        <div class={`card ${severityClass(r.severity)}`}>
          <strong>{r.risk}</strong>
          <p>{r.content}</p>
        </div>
      ))}
    </section>

    <section class="content-section">
      <h2>개인투자자 체크리스트</h2>
      <ul class="adi-checklist">
        {ADI_CHECKLIST.map((item) => <li>{item}</li>)}
      </ul>
    </section>

    <SeoContent
      introTitle="AI 데이터센터 전력·냉각 밸류체인 핵심 정리"
      intro={[ADI_META.description, ADI_META.notice]}
      criteria={[
        "AI 경쟁이 모델에서 전력·데이터센터·HBM·패키징 확보 경쟁으로 이동하고 있습니다.",
        "전력기기·냉각·건설·통신 업종이 AI 데이터센터 확장의 수혜 가능성이 있습니다.",
        "이 리포트는 업종 이해를 돕는 정보성 콘텐츠이며 개별 종목 매수를 권유하지 않습니다.",
      ]}
      faq={ADI_FAQ}
      related={ADI_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "ai-datacenter-infra-beneficiaries-2026",
  title: "AI 데이터센터 전력·냉각 수혜 업종 2026 | 2GW 시대 밸류체인 정리",
  description: "AI 데이터센터 확장에 따른 전력·냉각·건설·네트워크 밸류체인을 정리합니다. 업종별 수혜 강도, 국내외 2GW급 프로젝트 현황, 확인 체크리스트 포함.",
  order: 80,
  badges: ["NEW", "AI 데이터센터", "전력", "냉각"],
},
```

## 8-1. 카테고리 등록 (양쪽 모두 필수)

`src/pages/index.astro`:
```ts
"ai-datacenter-infra-beneficiaries-2026": { category: "asset", isNew: true },
```

`src/pages/reports/index.astro`:
```ts
"ai-datacenter-infra-beneficiaries-2026": {
  eyebrow: "AI 데이터센터 밸류체인",
  tags: [{ label: "AI 데이터센터", mod: "asset" }, { label: "전력", mod: "asset" }, { label: "냉각", mod: "asset" }],
  category: "asset",
  isNew: true,
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/ai-datacenter-infra-beneficiaries-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/ai-datacenter-infra-beneficiaries-2026/</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 2 하단 | 엔비디아는 왜 공장이 없을까? 반도체 산업 구조 | `/reports/semiconductor-value-chain/` |
| SeoContent related | SK하이닉스 엔비디아 5,000억달러 협력 2026 | `/reports/skhynix-nvidia-partnership-2026/` |
| SeoContent related | 삼성전자 브로드컴 2,000억달러 협력 2026 | `/reports/samsung-broadcom-partnership-2026/` |
| SeoContent related | 삼성전자·SK하이닉스 800조 투자 비교 리포트 | `/reports/samsung-skhynix-800t-investment-comparison-2026/` |
| SeoContent related | 국내·미국 반도체 ETF 비교 2026 | `/reports/semiconductor-etf-2026/` |
| SeoContent related | 반도체 주식 2026 상반기 수익률 랭킹 | `/reports/semiconductor-stocks-h1-2026/` |

---

## 12. QA 포인트

- [ ] **콘텐츠 톤 재검토 필수**: `ADI_SECTORS`의 강도·이유 문구가 단정적 표현("확실히 수혜") 없이 "가능성", "추정" 톤을 유지하는지 확인
- [ ] 업종 카드에 특정 종목명이 나열되지 않았는지 확인 (업종 단위 서술 원칙)
- [ ] 면책 InfoNotice가 최상단(Hero 하단)과 섹션 4 하단, 총 2곳에 노출되는지 확인
- [ ] 강도 도트(`adi-strength-dot`)가 1~5단계로 정상 렌더링되는지 확인
- [ ] 리스크 카드 severity별 left border 색상 확인
- [ ] 내부 CTA 6개 링크 모두 작동 확인 — 삼성/SK 리포트 배포 이후 순서로 진행
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 **둘 다** 등록 확인
- [ ] `npm run build` 통과, 라우트 `/reports/ai-datacenter-infra-beneficiaries-2026/` 존재 확인
- [ ] 모바일에서 표 가로 스크롤(`table-wrap`) 정상 동작 확인
- [ ] 모바일에서 업종 카드 그리드가 자연스럽게 1~2열로 스택되는지 확인

---

## 13. 배포 순서 권고

기획 문서 우선순위에 따라 삼성전자·브로드컴, SK하이닉스·엔비디아 리포트를 먼저 배포한 뒤 이 리포트를 배포한다. 세 리포트가 모두 배포된 이후, 서로의 `SeoContent related` 링크가 정상 연결되는지 마지막에 한 번 더 확인한다.
