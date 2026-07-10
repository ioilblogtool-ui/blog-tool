# SK하이닉스 국내투자 vs ADR 투자 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202607/sk-hynix-adr-listing-content-cluster.md` (3-3)
> 작성일: 2026-07-10
> 구현 기준: Codex/Claude가 이 문서만 보고 `/reports/` 비교 리포트 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `stock-brokerage-fee-comparison-2026`, `etf-vs-direct-stock-10year-2026`, `domestic-stock-capital-gains-tax`
> **사실관계 확정(2026-07-10)**: SK하이닉스는 나스닥(Nasdaq Global Select Market)에 ADR을 상장 완료했다. 티커 `SKHY`, 공모가 ADS 1주당 149달러, ADR 비율 ADS 10주=보통주 1주. 이 문서의 세금·환전·거래시간 비교는 가정법이 아니라 **실제 존재하는 SKHY 종목 기준**으로 확정형으로 서술한다. 세율·공제 기준(양도세 22%, 250만원 공제 등)만 구현 시점 최신 세법으로 재검증하면 된다.

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `SK하이닉스 국내투자 vs ADR 투자 비교`
- 콘텐츠 유형: 비교 리포트 (`/reports/`)
- 권장 slug: `sk-hynix-korea-vs-adr-investment-2026`
- URL: `/reports/sk-hynix-korea-vs-adr-investment-2026/`

### 1-2. 문서 역할

기획 문서를 비교 리포트 구현 단위로 고정한다. 데이터 스키마, 섹션 구성, SEO 메타, 내부링크 흐름, 스타일 prefix, QA 기준을 정의한다.

### 1-3. 페이지 성격 — 검색 노출·CTR 전략

- **의사결정형 비교 콘텐츠 = 이 사이트에서 검증된 고CTR 패턴**: 트래킹 기록(`docs/NAVER_SEARCH_STATS.md`)을 보면 "~비교", "~차이" 류 콘텐츠보다도 실제로는 "계산기"·"순위"·구체적 실행형 키워드의 CTR이 높다(예: `삼성전기 성과급` 25~37%, `국회의원 재산순위` 50%대). 반면 `/compare/bonus/`처럼 포괄적 비교 페이지는 노출 대비 클릭이 상대적으로 낮게 나타난다(CTR 1~4%대). 따라서 이 리포트는 포괄적 "비교"보다 **"양도세·환전비용이 얼마나 차이나는지"라는 구체적 수치 비교**를 앞세워 실행형 검색 의도(세금 얼마, 수수료 얼마)를 흡수한다.
- **이미 관측된 실수요 키워드 활용**: `docs/NAVER_SEARCH_STATS.md`에 `미국주식 환차손익`(2026-07-03, 신규 진입), `2026 증권사 수수료 비교`(2026-07-09~10 신규 진입, CTR 7.5%)가 소볼륨이지만 이미 자연 유입되고 있다. 이 리포트는 이 두 키워드군과 SK하이닉스 브랜드 키워드를 교차시켜 신규 검색 조합을 흡수한다.
- **실제 티커(SKHY) 존재로 검색 의도가 구체화됨**: ADR이 실제 상장·거래 중이므로 "SKHY 세금", "SKHY 양도세"처럼 티커를 직접 검색하는 사용자가 늘어난다. title·FAQ에 `SKHY`를 명시해 이 검색 의도를 놓치지 않는다.
- **기존 리포트와의 카니발라이제이션 방지**: `stock-brokerage-fee-comparison-2026`(범용 증권사 수수료 비교)과 겹치지 않도록, 이 리포트는 반드시 "SK하이닉스 국내 vs ADR"이라는 종목 특정 프레임을 유지하고, 수수료 상세 비교는 기존 리포트로 링크만 건다.

### 1-4. 권장 파일 구조

```txt
src/
  data/
    skHynixKoreaVsAdrInvestment2026.ts
  pages/
    reports/
      sk-hynix-korea-vs-adr-investment-2026.astro

src/styles/scss/pages/
  _sk-hynix-korea-vs-adr-investment-2026.scss

public/og/reports/
  sk-hynix-korea-vs-adr-investment-2026.png
```

필수 등록: `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타 (CLAUDE.md 비교 리포트 공식: `{A} vs {B} {연도} | {핵심 수치} 한눈에 비교` 적용)

```ts
export const reportMeta = {
  slug: "sk-hynix-korea-vs-adr-investment-2026",
  title: "SK하이닉스 국내투자 vs ADR 2026 | 세금·환전 비용 한눈에 비교",
  description: "SK하이닉스를 국내 직접투자 vs 나스닥 ADR(SKHY)로 살 때 양도세·배당세·환전 수수료·거래시간 차이를 표로 비교. 실제 투자금 기준 예시 계산 포함.",
  h1: "SK하이닉스, 국내로 살까 나스닥 SKHY로 살까",
  eyebrow: "국내투자 vs ADR(SKHY) 투자 비교",
  updatedAt: "2026-07-10",
};
```

- 타이틀 길이: `SK하이닉스 국내투자 vs ADR 2026 | 세금·환전 비용 한눈에 비교` = 약 33자 → 통과
- 디스크립션 약 105자 → 기준 통과, SKHY 티커 명시로 구체성 강화

### 2-2. 키워드 매핑

| 영역 | 주요 키워드 | 반영 위치 |
|---|---|---|
| 핵심 | SK하이닉스 국내투자 ADR 비교 | title, H1, hero |
| 핵심 | 하이닉스 ADR 세금 | title, 세금 비교표, FAQ |
| 핵심 | SKHY 양도세 | H1, FAQ |
| 보조 | 해외주식 양도소득세 | 세금 섹션, FAQ |
| 보조 | 미국주식 환전 수수료 | 환전 비교 섹션 |
| 롱테일 | 미국주식 환차손익 | 환율 리스크 섹션, FAQ |
| 롱테일 | 하이닉스 ADR 배당세 | 배당 비교표 |
| 롱테일 | 2026 증권사 수수료 비교 | 관련 리포트 CTA (기존 리포트 흡수) |

### 2-3. 구조화 데이터

`Article` + `FAQPage` JSON-LD. FAQ는 §6-8 참고.

---

## 3. 데이터 스키마

### 3-1. `src/data/skHynixKoreaVsAdrInvestment2026.ts`

```ts
export type ComparisonRow = {
  area: string;              // 예: "양도소득세", "배당소득세", "환전 비용", "거래시간", "최소 매매단위"
  korea: string;
  adr: string;
  winner: "korea" | "adr" | "neutral";
  note: string;
};

export type TaxExampleRow = {
  scenario: string;          // 예: "1000만원 투자, 500만원 차익"
  koreaTax: number;
  adrTax: number;
  diff: number;
  note: string;
};

export type DecisionCard = {
  audience: string;          // 예: "장기 배당 투자자", "단기 매매 선호", "환테크 활용자"
  recommendation: "korea" | "adr" | "either";
  reason: string;
};

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

export const reportMeta = { /* §2-1 참고 */ };

export const heroKpis = [
  { label: "양도세 기준", value: "국내 비과세 vs 해외 22%", description: "대주주 아니면 국내 상장주식은 양도세 없음(장내거래 기준)" },
  { label: "환전 비용", value: "왕복 스프레드 발생", description: "매수·매도 시 환전 수수료가 이중으로 붙음" },
  { label: "거래시간", value: "한국장 vs 미국장(야간)", description: "실시간 대응 가능 시간대가 다름" },
];

export const comparisonRows: ComparisonRow[] = [ /* §5 [C] 표, 5개 행 */ ];
export const taxExampleRows: TaxExampleRow[] = [ /* §5 [D] 표, 3개 시나리오 */ ];
export const decisionCards: DecisionCard[] = [ /* §5 [E], 3장 */ ];
export const faq: ComparisonFaq[] = [ /* §6-8 참고 */ ];
export const relatedLinks: RelatedLink[] = [ /* §7 참고 */ ];
```

### 3-2. 세금 계산 예시 로직 (정적 데이터로 사전 계산, JS 불필요 — 초기 버전 기준)

```ts
// 예시 계산 개념 (데이터 파일 작성 시 참고)
// 국내 상장 주식(장내, 비대주주): 양도차익 비과세, 매매 시 증권거래세만 부과
// 해외 상장 ADR: 양도차익 250만원 공제 후 22%(지방세 포함) 분리과세

function estimateAdrTax(gain: number): number {
  const taxableGain = Math.max(0, gain - 2_500_000);
  return Math.round(taxableGain * 0.22);
}
```

- 실제 데이터 파일에는 위 개념으로 미리 계산한 정적 값을 `taxExampleRows`에 채운다(클라이언트 계산 스크립트는 초기 버전에서는 불필요 — 정적 표로 충분).
- 세율·공제 기준(250만원, 22%)은 **구현 시점 최신 세법 기준으로 재확인 필수**. 세법 개정 가능성이 있으므로 데이터 파일에 "2026년 세법 기준" 주석을 남긴다.

---

## 4. 페이지 구조

### 4-1. 컴포넌트 구성

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  reportMeta, heroKpis, comparisonRows, taxExampleRows, decisionCards, faq, relatedLinks,
} from "../../data/skHynixKoreaVsAdrInvestment2026";
---
```

레이아웃 셸: `CompareToolShell` (양측 비교 구조에 적합) 또는 일반 `report-page` 셸 — 기존 비교 리포트(`stock-brokerage-fee-comparison-2026`) 패턴을 우선 따른다.

### 4-2. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  main.container.page-shell.report-page.skkva-page
    CalculatorHero
    InfoNotice (투자 조언 아님 고지)
    [A] Hero KPI 3개
    [B] 항목별 비교표 (세금/환전/거래시간/최소단위/배당)
    [C] 실제 투자금 기준 세금 예시 비교
    [D] 환율 리스크는 어떻게 다른가
    [E] 유형별 선택 가이드 (장기배당/단기매매/환테크)
    [F] ADR 프리미엄 계산기 CTA
    [G] ADR 상장 완전정리 리포트 CTA
    [H] FAQ
    [I] SeoContent
```

---

## 5. 섹션 상세 설계

### [A] Hero KPI

```astro
<section class="content-section skkva-hero-board">
  <div class="skkva-kpi-grid">
    {heroKpis.map((item) => (
      <article class="skkva-kpi-card">
        <p>{item.label}</p>
        <strong>{item.value}</strong>
        <span>{item.description}</span>
      </article>
    ))}
  </div>
</section>
```

### [B] 항목별 비교표 — 핵심 섹션

```astro
<section class="content-section skkva-compare-section">
  <div class="section-header">
    <p class="section-header__eyebrow">항목별 비교</p>
    <h2>SK하이닉스 국내투자 vs ADR, 뭐가 다른가요</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table">
      <thead>
        <tr><th>구분</th><th>국내 직접투자</th><th>나스닥 ADR(SKHY)</th><th>비고</th></tr>
      </thead>
      <tbody>
        {comparisonRows.map((row) => (
          <tr class={`skkva-row skkva-row--${row.winner}`}>
            <td><strong>{row.area}</strong></td>
            <td>{row.korea}</td>
            <td>{row.adr}</td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

`comparisonRows` 5개 행 예시:
1. 양도소득세 — 국내(비과세, 대주주 제외) vs SKHY(250만원 공제 후 22%)
2. 배당소득세 — 국내(15.4% 원천징수) vs SKHY(미국 원천징수 후 국내 조정, 실효세율 상이)
3. 환전 비용 — 국내(해당 없음) vs SKHY(매수·매도 시 왕복 환전 스프레드)
4. 거래 시간 — 국내(한국 정규장) vs SKHY(나스닥 정규장, 한국시간 야간)
5. 최소 매매단위 — 국내(1주 단위 원화) vs SKHY(ADS 1주 단위 달러, ADS 10주=보통주 1주 환산 필요)

### [C] 실제 투자금 기준 세금 예시 비교

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">세금 예시</p>
    <h2>같은 차익이라도 세금은 이렇게 다릅니다</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table">
      <thead>
        <tr><th>투자 시나리오</th><th>국내 세금</th><th>SKHY 세금</th><th>차이</th></tr>
      </thead>
      <tbody>
        {taxExampleRows.map((row) => (
          <tr>
            <td>{row.scenario}</td>
            <td>{formatWon(row.koreaTax)}</td>
            <td>{formatWon(row.adrTax)}</td>
            <td>{formatWon(row.diff)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="skkva-note">2026년 세법 기준 예시 계산이며, 개인 상황(기본공제 활용 여부, 종합소득 등)에 따라 실제 세액은 달라질 수 있습니다.</p>
</section>
```

`taxExampleRows` 3개 시나리오: 500만원 차익 / 1,000만원 차익 / 3,000만원 차익 — 각각 국내(비과세, 증권거래세만) vs ADR(250만원 공제 후 22%) 예시.

### [D] 환율 리스크는 어떻게 다른가

목표: "미국주식 환차손익" 키워드 흡수 섹션.

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">환율 리스크</p>
    <h2>SKHY 투자는 주가 외에 환율 변동도 함께 따라옵니다</h2>
  </div>
  <p>SKHY는 달러로 거래되므로, 주가가 그대로여도 원/달러 환율이 오르내리면 원화로 환산한 평가금액과 손익이 달라집니다. 매도 시점의 환율에 따라 주가 상승분이 상쇄되거나 반대로 확대될 수 있습니다.</p>
</section>
```

### [E] 유형별 선택 가이드

```astro
<div class="skkva-decision-grid">
  {decisionCards.map((card) => (
    <article class={`skkva-decision-card skkva-decision-card--${card.recommendation}`}>
      <h3>{card.audience}</h3>
      <p>{card.reason}</p>
    </article>
  ))}
</div>
```

`decisionCards` 3장: `장기 배당 투자자`(국내 유리 — 세금·환전 부담 적음), `미국 지수·ETF와 함께 담고 싶은 투자자`(ADR 유리 — 한 계좌에서 통합 관리), `환테크까지 고려하는 투자자`(둘 다 가능 — 환율 타이밍 활용).

### [F] ADR 프리미엄 계산기 CTA

```astro
<section class="content-section skkva-next-step">
  <div>
    <p class="section-header__eyebrow">직접 확인</p>
    <h2>지금 국내 주가와 ADR 가격, 얼마나 차이날까요</h2>
  </div>
  <a class="button button--primary" href={withBase("/tools/sk-hynix-adr-premium-calculator/")}>ADR 프리미엄 계산기 열기</a>
</section>
```

### [G] ADR 상장 완전정리 리포트 CTA

```astro
<section class="content-section skkva-next-step">
  <div>
    <p class="section-header__eyebrow">배경 이해</p>
    <h2>ADR 상장 배경이 궁금하다면</h2>
  </div>
  <a class="button button--secondary" href={withBase("/reports/sk-hynix-adr-listing-2026/")}>SK하이닉스 ADR 상장 완전정리 보기</a>
</section>
```

### [H] FAQ (5개 이상)

1. `SK하이닉스를 SKHY(ADR)로 사면 세금이 더 많이 나오나요?` — 국내 비과세(대주주 제외) vs 해외 250만원 공제 후 22% 분리과세 비교 요약.
2. `SKHY 배당금도 국내랑 세율이 다른가요?` — 미국 원천징수 후 국내 조정 방식 간단 설명, 상세는 전문가 상담 권고 문구 포함.
3. `환전 수수료는 어느 증권사가 유리한가요?` — 증권사별 환전 스프레드는 상이하므로 `stock-brokerage-fee-comparison-2026` 리포트로 연결.
4. `미국주식 환차손익은 어떻게 계산하나요?` — 환율 변동이 원화 환산 손익에 미치는 개념 요약, ADR 프리미엄 계산기 연결.
5. `국내투자와 SKHY(ADR)투자 중 뭐가 더 나은가요?` — 정답은 없고 목적(세금 최소화 vs 통합 관리 vs 환테크)에 따라 다르다는 점을 강조, §[E] 가이드로 연결.

### [I] SeoContent

intro 5단락·800자 이상 초안:

1. SK하이닉스가 2026년 7월 10일 나스닥에 ADR(티커 SKHY)을 상장하면서, 이미 국내 상장 주식을 보유했거나 신규 투자를 고려하는 투자자들 사이에서 "국내로 직접 사는 것과 나스닥 SKHY로 사는 것 중 어느 쪽이 유리한가"라는 질문이 늘고 있습니다.
2. 가장 큰 차이는 세금입니다. 국내 상장 주식은 대주주가 아닌 이상 장내 매매 양도차익에 대해 비과세가 적용되는 반면, SKHY를 포함한 해외 상장 주식은 연간 250만원 공제 후 초과분에 22%(지방세 포함) 분리과세가 적용됩니다. 같은 차익이라도 세후 실수령액 차이가 클 수 있습니다.
3. 환전 비용도 고려 대상입니다. SKHY를 매수·매도할 때마다 원화를 달러로, 달러를 다시 원화로 바꾸는 과정에서 왕복 환전 스프레드가 발생하며, 증권사별로 이 비용 차이가 있습니다.
4. 거래 시간대 차이도 실질적인 영향을 줍니다. 국내 주식은 한국 정규장 시간에 실시간 대응이 가능하지만, SKHY는 나스닥 정규장 기준이라 한국 시간으로는 야간에 거래가 이뤄집니다. 급격한 뉴스에 즉시 대응하고 싶은 투자자에게는 이 차이가 중요할 수 있습니다.
5. 어느 쪽이 유리한지는 투자 목적에 따라 달라집니다. 세금 부담을 최소화하고 싶다면 국내 직접투자가, 미국 시장 다른 종목과 한 계좌에서 통합 관리하고 싶다면 SKHY가 더 맞을 수 있습니다. 구체적인 항목별 비교는 아래 표에서, 국내 주가와 SKHY의 실시간 가격 차이는 ADR 프리미엄 계산기에서 확인할 수 있습니다.

---

## 6. `reports.ts` 등록

```ts
{
  slug: "sk-hynix-korea-vs-adr-investment-2026",
  title: "SK하이닉스 국내투자 vs ADR 2026 | 세금·환전 비용 한눈에 비교",
  description: "SK하이닉스를 국내 직접투자 vs 나스닥 ADR(SKHY)로 살 때 양도세·배당세·환전 수수료·거래시간 차이를 표로 비교. 실제 투자금 기준 예시 계산 포함.",
  order: 0.84, // 실제 등록 시 reports.ts 현재 순서 확인 후 조정
  badges: ["신규", "SK하이닉스", "ADR", "SKHY", "비교"],
}
```

---

## 7. 내부 링크 전략

### 상단 CTA
- `/tools/sk-hynix-adr-premium-calculator/` — ADR 프리미엄 계산기

### 본문 중간 CTA
- `/reports/sk-hynix-adr-listing-2026/` — ADR 상장 완전정리
- `/reports/stock-brokerage-fee-comparison-2026/` — 증권사 수수료 비교(환전 스프레드 상세)

### 하단 CTA
- `/reports/sk-hynix-bonus-2027/`, `/tools/sk-hynix-bonus/` — 기존 하이닉스 클러스터 연결

---

## 8. 스타일 설계

Prefix: `.skkva-page`, `.skkva-hero-board`, `.skkva-kpi-grid`, `.skkva-compare-section`, `.skkva-row`, `.skkva-decision-grid`, `.skkva-decision-card`, `.skkva-next-step`

```scss
.skkva-page {
  .skkva-kpi-grid,
  .skkva-decision-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .skkva-row {
    &--korea td:nth-child(2) { font-weight: 600; }
    &--adr td:nth-child(3) { font-weight: 600; }
  }

  .skkva-decision-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;

    &--korea { border-left: 3px solid #0F6E56; }
    &--adr { border-left: 3px solid #534AB7; }
    &--either { border-left: 3px solid #BA7517; }
  }
}

@media (min-width: 768px) {
  .skkva-page {
    .skkva-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .skkva-decision-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
}
```

---

## 9. Sitemap / OG

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-korea-vs-adr-investment-2026/</loc>
  <lastmod>2026-07-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

OG 텍스트: 메인 `SK하이닉스 국내투자 vs ADR(SKHY)`, 서브 `세금·환전 비용 한눈에 비교`.

---

## 10. 콘텐츠 주의사항

- SKHY 상장 사실 자체는 확정형으로 서술한다(가정법 불필요 — 실제 거래 중인 종목).
- 세율·공제 기준(양도세 22%, 250만원 공제 등)은 구현 시점 최신 세법으로 재검증 필수. 세법 개정 시 즉시 갱신.
- "어느 쪽이 낫다"를 단정하지 않고 투자 목적별로 다르다는 프레임을 유지한다.
- 배당세 등 세부 계산은 개인 종합소득·과세 방식에 따라 달라질 수 있어 "전문가 상담 권고" 문구를 배당 관련 FAQ에 포함한다.

---

## 11. 구현 순서

1. 최신 세법 기준(양도세율·공제 한도) 재확인
2. `src/data/skHynixKoreaVsAdrInvestment2026.ts` 작성
3. `src/pages/reports/sk-hynix-korea-vs-adr-investment-2026.astro` 작성
4. `_sk-hynix-korea-vs-adr-investment-2026.scss` 작성 및 `app.scss` 등록
5. `reports.ts` 등록
6. `sitemap.xml` 등록
7. OG 이미지 생성
8. 클러스터 내 다른 2개 콘텐츠(계산기, 정보 리포트)와 상호 링크 최종 점검
9. `npm run build` 후 로컬 확인

---

## 12. QA 체크리스트

### 콘텐츠 QA
- [ ] title에 `SK하이닉스`, `국내투자 vs ADR`, 연도 2026 포함, 50자 이내
- [ ] 디스크립션에 `SKHY` 티커 포함, 80~120자
- [ ] 세금 예시 수치에 "2026년 세법 기준" 명시
- [ ] "정답은 없다"는 목적별 프레임 유지, 투자 권유 아님 고지
- [ ] SeoContent intro 5단락·800자 이상
- [ ] FAQ 5개 이상

### UX QA
- [ ] 비교표 모바일에서 가로 스크롤 컨테이너로 처리되어 레이아웃 안 깨짐
- [ ] winner 컬럼 강조 스타일이 과도하지 않고 가독성 유지
- [ ] 계산기·정보리포트 CTA 정상 연결

### 기술 QA
- [ ] `npm run build` 성공
- [ ] `/reports/sk-hynix-korea-vs-adr-investment-2026/` 라우트 생성
- [ ] `reports.ts` 등록, `sitemap.xml` 등록(트레일링 슬래시)
- [ ] JSON-LD 유효, 링크 404 없음
- [ ] `stock-brokerage-fee-comparison-2026`과 내용 중복 없이 역할 분리 확인

---

## 13. 발행 후 관찰 지표 (7~14일)

- `SK하이닉스 국내투자 ADR 비교`, `하이닉스 ADR 세금`, `SKHY 양도세`, `미국주식 환차손익` 검색어 노출/CTR
- `/reports/sk-hynix-korea-vs-adr-investment-2026/` 노출·클릭·CTR
- ADR 프리미엄 계산기·ADR 상장 리포트로의 내부 클릭 수
- `stock-brokerage-fee-comparison-2026`으로의 아웃바운드 클릭(카니발라이제이션 없이 상호보완 확인)

초기 목표: 7일 노출 100 이상, CTR 6% 이상, 계산기 내부 이동 10건 이상.

---

## 14. 다음 확장 아이디어

- `해외주식 양도소득세 계산기` (범용, ADR 외 다른 해외주식에도 재사용 가능)
- `삼성전자 vs SK하이닉스 ADR 프리미엄 비교` (삼성전자도 ADR 상장 시)
- `국내 대기업 ADR 상장 종목 세금 비교 총정리`
