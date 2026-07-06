# 삼성전자·SK하이닉스 800조 반도체 투자 비교 리포트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/samsung-skhynix-800t-investment-report-2026-plan.md`](../plan/202607/samsung-skhynix-800t-investment-report-2026-plan.md)
> 작성일: 2026-07-02
> 유형: 비교 리포트 (`/reports/`)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/samsungSkhynix800tInvestment2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 페이지 | `src/pages/reports/samsung-skhynix-800t-investment-comparison-2026.astro` |
| 스크립트 | (없음 — 정적 리포트, JS 불필요) |
| 스타일 | `src/styles/scss/pages/_samsung-skhynix-800t-investment-comparison-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

---

## 2. URL 및 메타

```
슬러그: /reports/samsung-skhynix-800t-investment-comparison-2026/
타이틀: 삼성전자·SK하이닉스 800조 투자 비교 2026 | 직원·주주가 봐야 할 포인트
디스크립션: 삼성전자와 SK하이닉스의 반도체 800조 투자 내용을 직원·투자자 관점으로 비교합니다. 성과급 영향, 수혜 업종, 반도체 ETF 접근법 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/samsungSkhynix800tInvestment2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type Inv800tMeta = {
  announceDate: string;
  eventName: string;
  totalInvestment: string;
  samsungShare: string;
  hynixShare: string;
  location: string;
  expectedCompletion: string;
  notice: string;
};

export type Inv800tSummaryRow = {
  label: string;
  value: string;
  badge?: "공식" | "보도 기반" | "추정";
};

export type Inv800tCompanyRow = {
  item: string;
  samsung: string;
  hynix: string;
  samsungScore?: number;   // 1~5 (UI 강도 표현용)
  hynixScore?: number;
};

export type Inv800tSectorRow = {
  sector: string;
  strength: number;   // 1~5
  strengthLabel: string;
  reason: string;
  timing: string;
  badge: "즉시" | "단기" | "중기" | "장기";
};

export type Inv800tRiskRow = {
  risk: string;
  content: string;
  severity: "높음" | "중간" | "낮음";
};

export type Inv800tFaqItem = {
  q: string;
  a: string;
};

// ── 데이터 ────────────────────────────────────────

export const INV800T_META: Inv800tMeta = {
  announceDate: "2026년 6월 29일",
  eventName: "대한민국 대도약 3대 메가프로젝트 국민보고회",
  totalInvestment: "800조원",
  samsungShare: "400조원",
  hynixShare: "400조원",
  location: "호남 반도체 클러스터",
  expectedCompletion: "2030년 이후 (팹 정상 가동 기준)",
  notice: "이 리포트는 공시·보도 기반 분석이며 투자 권유가 아닙니다. 전망·추정 수치는 실제와 다를 수 있습니다.",
};

export const INV800T_SUMMARY: Inv800tSummaryRow[] = [
  { label: "발표 시점", value: "2026년 6월 29일", badge: "공식" },
  { label: "총 투자 규모", value: "800조원 (삼성전자·SK하이닉스 각 400조)", badge: "보도 기반" },
  { label: "투자 기간", value: "약 10년 누적 CAPEX", badge: "보도 기반" },
  { label: "위치", value: "호남 반도체 클러스터", badge: "공식" },
  { label: "주요 내용", value: "메모리 팹 추가 4기 (삼성 2기·하이닉스 2기)", badge: "보도 기반" },
  { label: "팹 건설 기간", value: "1기당 약 4~6년", badge: "추정" },
  { label: "정상 가동 예상", value: "빠르면 2030년 이후", badge: "추정" },
  { label: "정부 지원", value: "인허가 패스트트랙, 세제·전력·용수 지원", badge: "공식" },
];

export const INV800T_COMPANY_COMPARE: Inv800tCompanyRow[] = [
  { item: "주력 제품", samsung: "DRAM·NAND·HBM·파운드리", hynix: "DRAM·HBM" },
  { item: "HBM 경쟁력", samsung: "회복 중 (HBM3E 인증 대기)", hynix: "업계 1위, 엔비디아 공급 중", samsungScore: 3, hynixScore: 5 },
  { item: "파운드리 변수", samsung: "있음 (적자 지속 중)", hynix: "없음", samsungScore: 2, hynixScore: 5 },
  { item: "CAPEX 부담", samsung: "매우 큼", hynix: "큼", samsungScore: 2, hynixScore: 3 },
  { item: "AI 수혜 직결도", samsung: "중상", hynix: "상", samsungScore: 4, hynixScore: 5 },
  { item: "밸류에이션", samsung: "상대적 저평가", hynix: "프리미엄", samsungScore: 4, hynixScore: 3 },
  { item: "정책 수혜", samsung: "높음", hynix: "높음", samsungScore: 5, hynixScore: 5 },
  { item: "단기 체크포인트", samsung: "HBM 경쟁력 회복, 파운드리 흑자", hynix: "HBM 점유율 유지, 엔비디아 지속" },
  { item: "투자 성격", samsung: "저평가 회복 기대형", hynix: "성장·모멘텀형" },
];

export const INV800T_SECTORS: Inv800tSectorRow[] = [
  { sector: "반도체 장비", strength: 5, strengthLabel: "매우 높음", reason: "팹 증설 시 노광·식각·증착·검사 장비 발주 직결", timing: "착공 1~2년 내", badge: "단기" },
  { sector: "소재·부품", strength: 4, strengthLabel: "높음", reason: "웨이퍼·포토레지스트·특수가스 수요 증가", timing: "착공 1~3년 내", badge: "단기" },
  { sector: "전력 인프라", strength: 4, strengthLabel: "높음", reason: "팹·AI 데이터센터의 대규모 전력 수요", timing: "즉시~3년", badge: "즉시" },
  { sector: "건설·엔지니어링", strength: 3, strengthLabel: "중상", reason: "클러스터 공장·인프라 공사", timing: "즉시~2년", badge: "즉시" },
  { sector: "지역 부동산", strength: 2, strengthLabel: "중", reason: "일자리·인구 유입 기대, 실제 효과는 수년 후", timing: "3~7년 후", badge: "장기" },
];

export const INV800T_CAPEX_IMPACT = {
  shortTerm: "CAPEX 급증 → 영업이익 압박 → 성과급 재원 단기 감소 가능",
  midTerm: "신규 팹 가동 전까지 수익성 개선 제한 (3~5년)",
  longTerm: "풀가동 시 영업이익 급증 → 성과급 상승 기대 (5년+)",
  capexPerFab: "팹 1기 건설 CAPEX 약 20~30조원",
  buildTime: "착공~정상 가동까지 약 4~5년",
};

export const INV800T_RISKS: Inv800tRiskRow[] = [
  { risk: "CAPEX 과부담", content: "800조 투자 기간 동안 FCF 감소, 배당 여력 축소 가능", severity: "높음" },
  { risk: "반도체 수요 사이클", content: "AI 투자 과열 → 조정 시 메모리 가격 하락 가능", severity: "높음" },
  { risk: "정책 불확실성", content: "정권 교체·예산 삭감 시 지원 축소 가능성", severity: "중간" },
  { risk: "미·중 규제", content: "수출 제한 강화 시 중국향 매출 타격", severity: "높음" },
  { risk: "입지 효율성", content: "호남 클러스터의 물류·용수·전력 인프라 구축 지연 가능성", severity: "중간" },
];

export const INV800T_FAQ: Inv800tFaqItem[] = [
  { q: "800조는 언제 다 투입되나요?", a: "10년에 걸친 누적 CAPEX입니다. 연간 약 80조원 수준이며, 실제 집행은 팹 착공 일정에 따라 달라집니다." },
  { q: "호남에 짓는 이유가 뭔가요?", a: "부지 확보와 균형발전 정책이 결합됐습니다. 비용·물류 측면에서 수도권 대비 불리할 수 있다는 지적도 있습니다." },
  { q: "단기적으로 주가에 호재인가요?", a: "단기 테마 상승은 가능하지만, 실제 매출 기여는 2030년 이후입니다. 단기 매매보다 장기 사이클 관점이 안전합니다." },
  { q: "성과급이 늘어날까요?", a: "단기는 CAPEX 부담으로 오히려 줄 수 있고, 장기는 팹 가동 후 실적 개선 시 증가 가능성이 있습니다." },
  { q: "반도체 ETF와 개별 종목 중 어느 게 낫나요?", a: "리스크 분산 면에서 ETF가 낫습니다. 개별 종목은 HBM 경쟁력·파운드리 흑자 등 모멘텀 확인 후 접근을 권장합니다." },
  { q: "삼성전자와 SK하이닉스 중 어디가 더 수혜인가요?", a: "단기 HBM 모멘텀은 SK하이닉스가 우세하고, 장기 저평가 회복 관점에서는 삼성전자를 보는 시각도 있습니다. 투자 스타일에 따라 판단이 다릅니다." },
];

export const INV800T_SEO_INTRO = `2026년 6월 29일, 이재명 대통령 주재 '대한민국 대도약 3대 메가프로젝트 국민보고회'에서 삼성전자와 SK하이닉스가 각각 400조원씩 총 800조원을 호남 반도체 클러스터에 투자하겠다고 발표했습니다. 반도체, 피지컬 AI, AI 데이터센터를 3대 축으로 삼은 이번 발표는 메모리 팹 4기 추가 건설과 AI 인프라 확충을 핵심으로 합니다.`;

export const INV800T_SEO_CRITERIA = [
  "총 투자 규모 800조원: 삼성전자 400조 + SK하이닉스 400조, 10년 누적 CAPEX",
  "신규 팹 정상 가동: 빠르면 2030년 이후 (착공~가동 약 4~6년)",
  "단기 성과급 영향: CAPEX 급증으로 영업이익 압박, 재원 감소 가능성",
  "장기 성과급 전망: 팹 풀가동 후 영업이익 급증 시 성과급 상승 기대",
  "모든 수치는 공시·보도 기반이며 투자 권유가 아닙니다",
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 반도체 메가투자
 └─ title: 삼성전자·SK하이닉스 800조 반도체 투자 비교 2026
 └─ description: 직원·주주가 봐야 할 핵심 포인트 한눈에 정리

InfoNotice (면책 배너)
 └─ 투자 권유 아님, 추정 포함 고지

섹션 1 — 3대 메가프로젝트 요약 (3-카드 그리드)
섹션 2 — 800조 투자 내용 요약 표
섹션 3 — 삼성전자 vs SK하이닉스 비교 ★ 핵심
섹션 4 — 성과급에 어떤 영향? (재직자 관점)
 └─ InfoNotice (면책 2번째)
섹션 5 — 수혜 업종 TOP 5 카드
섹션 6 — ETF로 접근하면? (내부링크 CTA)
섹션 7 — 투자자 체크리스트
섹션 8 — 리스크 정리
FAQ
SeoContent
```

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero 섹션 |
| `InfoNotice.astro` | 면책 배너 (2회 사용) |
| `SeoContent.astro` | SEO 텍스트 + FAQ |

### 페이지 전용 마크업 (인라인)

| 블록 클래스 | 설명 |
|---|---|
| `.inv800t-mega-grid` | 3대 메가프로젝트 3-카드 그리드 |
| `.inv800t-summary-table` | 투자 요약 표 |
| `.inv800t-compare-table` | 삼성 vs 하이닉스 비교 표 |
| `.inv800t-capex-cards` | CAPEX 영향 3-카드 (단기·중기·장기) |
| `.inv800t-sector-grid` | 수혜 업종 5-카드 그리드 |
| `.inv800t-cta-group` | 내부 CTA 버튼 묶음 |
| `.inv800t-checklist` | 투자자 체크리스트 |
| `.inv800t-risk-cards` | 리스크 카드 |
| `.inv800t-faq` | FAQ details/summary |
| `.inv800t-badge` | 공식·보도기반·추정 뱃지 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_samsung-skhynix-800t-investment-comparison-2026.scss`

### CSS 토큰 (로컬 변수 — 전역 토큰 사용 금지)

```scss
.inv800t-page {
  --inv-ink:        #14213d;
  --inv-muted:      #5d6b82;
  --inv-line:       rgba(20, 33, 61, 0.12);
  --inv-soft:       #f5f7fb;
  --inv-primary:    #1a56db;
  --inv-primary-bg: #eff4ff;
  --inv-primary-dk: #1447bf;
  --inv-teal:       #0891b2;
  --inv-teal-bg:    #e0f2fe;
  --inv-green:      #059669;
  --inv-green-bg:   #d1fae5;
  --inv-amber:      #d97706;
  --inv-amber-bg:   #fef3c7;
  --inv-red:        #dc2626;
  --inv-red-bg:     #fee2e2;
}
```

### 주요 스타일 블록

```scss
// 3대 메가 그리드 — 3열, 모바일 1열
.inv800t-mega-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.inv800t-mega-card { border-radius: 14px; padding: 1.25rem; border: 1px solid var(--inv-line); }

// 요약 표
.inv800t-summary-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

// 삼성 vs 하이닉스 비교 표
// — 삼성 컬럼: --inv-primary, 하이닉스 컬럼: --inv-teal
.inv800t-compare-table { width: 100%; border-collapse: collapse; }
.inv800t-col--samsung { color: var(--inv-primary); }
.inv800t-col--hynix   { color: var(--inv-teal); }

// CAPEX 영향 3-카드 (단기·중기·장기)
.inv800t-capex-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.inv800t-capex-card--short { border-top: 3px solid var(--inv-red); }
.inv800t-capex-card--mid   { border-top: 3px solid var(--inv-amber); }
.inv800t-capex-card--long  { border-top: 3px solid var(--inv-green); }

// 수혜 업종 그리드 — 5열, 모바일 1열
.inv800t-sector-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }

// 강도 바 (1~5단계)
.inv800t-strength-bar { display: flex; gap: 3px; }
.inv800t-strength-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--inv-line); }
.inv800t-strength-dot--on { background: var(--inv-primary); }

// 리스크 카드 — severity별 색상
.inv800t-risk-card--high { border-left: 4px solid var(--inv-red); }
.inv800t-risk-card--mid  { border-left: 4px solid var(--inv-amber); }
.inv800t-risk-card--low  { border-left: 4px solid var(--inv-green); }

// 내부 CTA 그룹
.inv800t-cta-group { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.25rem 0; }
.inv800t-cta-btn { display: inline-flex; align-items: center; gap: 0.4rem; ... }

// 투자자 체크리스트
.inv800t-checklist { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.inv800t-checklist__item { display: flex; align-items: flex-start; gap: 0.75rem; }
.inv800t-checklist__icon { color: var(--inv-primary); flex-shrink: 0; }
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
  INV800T_META, INV800T_SUMMARY, INV800T_COMPANY_COMPARE,
  INV800T_SECTORS, INV800T_CAPEX_IMPACT, INV800T_RISKS,
  INV800T_FAQ, INV800T_SEO_INTRO, INV800T_SEO_CRITERIA,
} from "../../data/samsungSkhynix800tInvestment2026";
---
<BaseLayout title={...} description={...} jsonLd={...}>
  <SiteHeader />
  <main class="container page-shell inv800t-page">

    <CalculatorHero eyebrow="반도체 메가투자" title="..." description="..." />

    <!-- 면책 배너 1 -->
    <InfoNotice type="warning">{INV800T_META.notice}</InfoNotice>

    <!-- 섹션 1: 3대 메가프로젝트 -->
    <section class="content-section">
      <div class="inv800t-mega-grid">...</div>
    </section>

    <!-- 섹션 2: 800조 요약 표 -->
    <section class="content-section">
      <table class="inv800t-summary-table">
        {INV800T_SUMMARY.map(row => <tr>...</tr>)}
      </table>
    </section>

    <!-- 섹션 3: 삼성 vs 하이닉스 ★ -->
    <section class="content-section">
      <table class="inv800t-compare-table">
        <thead><tr><th>항목</th><th class="inv800t-col--samsung">삼성전자</th><th class="inv800t-col--hynix">SK하이닉스</th></tr></thead>
        <tbody>{INV800T_COMPANY_COMPARE.map(row => <tr>...</tr>)}</tbody>
      </table>
      <!-- CTA -->
      <div class="inv800t-cta-group">
        <a href="/tools/semiconductor-bonus-comparison/">반도체 성과급 비교 계산기 →</a>
      </div>
    </section>

    <!-- 섹션 4: 성과급 영향 -->
    <section class="content-section">
      <div class="inv800t-capex-cards">
        <div class="inv800t-capex-card--short">단기: {INV800T_CAPEX_IMPACT.shortTerm}</div>
        <div class="inv800t-capex-card--mid">중기: {INV800T_CAPEX_IMPACT.midTerm}</div>
        <div class="inv800t-capex-card--long">장기: {INV800T_CAPEX_IMPACT.longTerm}</div>
      </div>
      <InfoNotice type="info">투자 권유가 아닌 참고 목적입니다.</InfoNotice>
      <!-- CTA: 삼성DS, 하이닉스, 삼성전기 성과급 계산기 -->
      <div class="inv800t-cta-group">
        <a href="/tools/samsung-bonus/">삼성전자 DS 성과급 계산기 →</a>
        <a href="/tools/sk-hynix-bonus/">SK하이닉스 성과급 계산기 →</a>
        <a href="/tools/samsung-electro-mechanics-bonus-calculator-2026/">삼성전기 성과급 계산기 →</a>
      </div>
    </section>

    <!-- 섹션 5: 수혜 업종 -->
    <section class="content-section">
      <div class="inv800t-sector-grid">
        {INV800T_SECTORS.map(s => <article>...</article>)}
      </div>
    </section>

    <!-- 섹션 6: ETF CTA -->
    <section class="content-section">
      <div class="inv800t-cta-group">
        <a href="/reports/semiconductor-etf-2026/">반도체 ETF 비교 리포트 →</a>
        <a href="/reports/semiconductor-stock-2026/">반도체 주식 수익률 랭킹 →</a>
      </div>
    </section>

    <!-- 섹션 7: 투자자 체크리스트 -->
    <section class="content-section">
      <ul class="inv800t-checklist">
        <li>HBM 시장에서 삼성전자 점유율 회복 여부</li>
        <li>SK하이닉스 엔비디아 공급 계약 지속성</li>
        <li>미·중 반도체 규제 변화</li>
        <li>팹 착공 일정 구체화 시점</li>
        <li>AI 데이터센터 수요 사이클 (과투자 리스크)</li>
      </ul>
    </section>

    <!-- 섹션 8: 리스크 -->
    <section class="content-section">
      {INV800T_RISKS.map(r => <div class={`inv800t-risk-card--${r.severity === '높음' ? 'high' : r.severity === '중간' ? 'mid' : 'low'}`}>...</div>)}
    </section>

    <SeoContent
      introTitle="삼성전자·SK하이닉스 800조 투자 핵심 정리"
      intro={[INV800T_SEO_INTRO]}
      criteria={INV800T_SEO_CRITERIA}
      faq={INV800T_FAQ.map(f => ({ question: f.q, answer: f.a }))}
      related={[
        { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교 계산기" },
        { href: "/tools/samsung-bonus/", label: "삼성전자 DS 성과급 계산기" },
        { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
        { href: "/reports/semiconductor-etf-2026/", label: "반도체 ETF 비교 리포트" },
        { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성 DS 성과급 계산 가이드" },
        { href: "/reports/sk-hynix-bonus-2027/", label: "SK하이닉스 2027 성과급 전망" },
        { href: "/reports/large-company-salary-growth-by-years-2026/", label: "대기업 연차별 연봉 성장 비교" },
      ]}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "samsung-skhynix-800t-investment-comparison-2026",
  title: "삼성전자·SK하이닉스 800조 투자 비교 2026 | 직원·주주가 봐야 할 포인트",
  order: 64,
  badges: ["삼성전자", "SK하이닉스", "반도체", "투자", "2026"],
},
```

---

## 9. app.scss import

```scss
@use 'scss/pages/samsung-skhynix-800t-investment-comparison-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-skhynix-800t-investment-comparison-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 3 하단 | 반도체 성과급 비교 계산기 | `/tools/semiconductor-bonus-comparison/` |
| 섹션 4 하단 | 삼성전자 DS 성과급 계산기 | `/tools/samsung-bonus/` |
| 섹션 4 하단 | SK하이닉스 성과급 계산기 | `/tools/sk-hynix-bonus/` |
| 섹션 4 하단 | 삼성전기 성과급 계산기 2026 | `/tools/samsung-electro-mechanics-bonus-calculator-2026/` |
| 섹션 6 하단 | 반도체 ETF 비교 리포트 | `/reports/semiconductor-etf-2026/` |
| 섹션 6 하단 | 반도체 주식 수익률 랭킹 | `/reports/semiconductor-stock-2026/` |
| SeoContent related | 삼성 DS 성과급 계산 가이드 | `/reports/samsung-ds-bonus-calculation-guide/` |
| SeoContent related | SK하이닉스 2027 성과급 전망 | `/reports/sk-hynix-bonus-2027/` |
| SeoContent related | 대기업 연차별 연봉 성장 비교 | `/reports/large-company-salary-growth-by-years-2026/` |

---

## 12. QA 포인트

- [ ] 면책 InfoNotice 2곳 (Hero 하단, 섹션 4 하단) 노출 확인
- [ ] 삼성 컬럼 `--inv-primary` / 하이닉스 컬럼 `--inv-teal` 색상 구분 확인
- [ ] CAPEX 3-카드 단기(빨강)·중기(주황)·장기(초록) top border 확인
- [ ] 수혜 업종 강도 바 1~5단계 정상 렌더링 확인
- [ ] 리스크 카드 severity별 left border 색상 확인
- [ ] 내부 CTA 9개 링크 모두 작동 확인
- [ ] `npm run build` 통과, 라우트 `/reports/samsung-skhynix-800t-investment-comparison-2026/` 존재 확인
- [ ] 모바일 3-카드 그리드 → 1열 레이아웃 확인
- [ ] `추정` 뱃지 amber, `공식` 뱃지 green, `보도 기반` 뱃지 blue 확인
