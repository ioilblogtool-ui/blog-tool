# 하이닉스 성과급 2027 전망 — 설계 문서

> 기획 원문: `docs/plan/202605/sk-hynix-bonus-2027.md`
> 작성일: 2026-05-24
> 구현 기준: Codex/Claude가 이 문서만 보고 `/reports/` 리포트 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `sk-hynix-bonus`, `bonus-after-tax-calculator`, `corporate-bonus-comparison-2026`, `semiconductor-etf-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `하이닉스 성과급 2027 전망`
- 콘텐츠 유형: 검색 유입형 전망 리포트 (`/reports/`)
- 권장 slug: `sk-hynix-bonus-2027`
- URL: `/reports/sk-hynix-bonus-2027/`

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 리포트 구조에 맞게 구현 단위로 고정한다.
- 데이터 스키마, 페이지 섹션, CTA 흐름, 스타일 prefix, QA 기준을 정의한다.
- 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `src/styles/`, `public/scripts/`, `src/data/reports.ts` 작업을 진행한다.

### 1-3. 페이지 성격

- **성과급 검색 확장 리포트**: 이미 반응이 확인된 `하이닉스 성과급 계산기` 클러스터를 `2027 전망` 검색면으로 확장한다.
- **시나리오형 해설 콘텐츠**: 확정 지급액이 아니라 영업이익과 PS/PI 구조에 따른 전망을 보여준다.
- **계산기 유도형 콘텐츠**: 리포트를 읽은 뒤 `하이닉스 성과급 계산기 → 세후 계산기 → DCA 계산기`로 이어지게 한다.

### 1-4. 권장 파일 구조

```txt
src/
  data/
    skHynixBonus2027.ts
  pages/
    reports/
      sk-hynix-bonus-2027.astro

public/
  scripts/
    sk-hynix-bonus-2027.js

src/styles/scss/pages/
  _sk-hynix-bonus-2027.scss

public/og/reports/
  sk-hynix-bonus-2027.png
```

필수 등록:

- `src/data/reports.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const reportMeta = {
  slug: "sk-hynix-bonus-2027",
  title: "하이닉스 2027 성과급 전망 | SK하이닉스 PS·PI 시나리오",
  description: "하이닉스 2027 성과급 전망을 영업이익별 PS 시나리오와 직급별 예상 금액으로 정리합니다. 2026 지급 구조, PI·PS 차이, 하이닉스 성과급 계산기 연결까지 확인하세요.",
  h1: "하이닉스 2027 성과급 전망",
  eyebrow: "SK하이닉스 성과급 전망",
  updatedAt: "2026-05-24",
};
```

### 2-2. 키워드 매핑

| 영역 | 주요 키워드 | 반영 위치 |
|---|---|---|
| 핵심 | 하이닉스 2027 성과급 | title, H1, hero, FAQ |
| 핵심 | 하이닉스 성과급 전망 | title, intro, H2 |
| 핵심 | SK하이닉스 PS 2027 | title, 시나리오 섹션 |
| 보조 | 하이닉스 PS 계산 | 시나리오 표, CTA |
| 보조 | 하이닉스 PI PS 차이 | 2026 구조 요약 |
| 보조 | 하이닉스 성과급 계산기 | 상단/중간/FAQ CTA |

### 2-3. 구조화 데이터

페이지는 기본 `Article` JSON-LD와 `FAQPage` JSON-LD를 포함한다.

FAQPage 문항:

1. 하이닉스 2027 성과급은 확정됐나요?
2. SK하이닉스 PS와 PI는 어떻게 다른가요?
3. 하이닉스 성과급은 연봉의 몇 퍼센트인가요?
4. 하이닉스 성과급 세후 실수령액은 어떻게 계산하나요?
5. 삼성전자 성과급과 비교할 수 있나요?

---

## 3. 데이터 스키마

### 3-1. `src/data/skHynixBonus2027.ts`

```ts
export type SkHynixBonusScenarioId = "conservative" | "base" | "optimistic";

export type SkHynixBonusScenario = {
  id: SkHynixBonusScenarioId;
  label: string;
  tone: "muted" | "base" | "positive";
  operatingProfitLabel: string;
  operatingProfitNote: string;
  psMultiplier: number;
  piRatio: number;
  summary: string;
  interpretation: string;
};

export type SkHynixRankBonusRow = {
  rankId: string;
  rankLabel: string;
  annualSalary: number;
  conservativeBonus: number;
  baseBonus: number;
  optimisticBonus: number;
  monthlyImpactBase: number;
  note: string;
};

export type SkHynixStructureCard = {
  label: string;
  value: string;
  description: string;
};

export type SkHynixReasonCard = {
  title: string;
  description: string;
  points: string[];
};

export type SkHynixFaq = {
  question: string;
  answer: string;
};

export type SkHynixRelatedLink = {
  href: string;
  label: string;
  description: string;
};
```

### 3-2. 데이터 export 목록

```ts
export const reportMeta = { ... };
export const heroKpis: SkHynixStructureCard[] = [ ... ];
export const structureCards: SkHynixStructureCard[] = [ ... ];
export const scenarioRows: SkHynixBonusScenario[] = [ ... ];
export const rankBonusRows: SkHynixRankBonusRow[] = [ ... ];
export const reasonCards: SkHynixReasonCard[] = [ ... ];
export const taxNotes: string[] = [ ... ];
export const investmentNotes: string[] = [ ... ];
export const faq: SkHynixFaq[] = [ ... ];
export const relatedLinks: SkHynixRelatedLink[] = [ ... ];
```

### 3-3. 계산 기준

초기 버전은 정적 데이터로 충분하다. 단, 계산식은 기존 `src/data/skHynixCompensation`의 직급 프리셋과 구조를 참고한다.

권장 계산 개념:

```ts
const bonus = annualSalary * scenarioBonusRatio;
const monthlyImpact = bonus / 12;
```

주의:

- 수치는 `전망`, `추정`, `시뮬레이션`으로 표기한다.
- 2027 지급액을 확정 표현하지 않는다.
- 구현 시 최신 실적/컨센서스 확인이 필요하면 데이터 주석에 기준일을 남긴다.

---

## 4. 페이지 구조

### 4-1. 컴포넌트 구성

권장 import:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  reportMeta,
  heroKpis,
  structureCards,
  scenarioRows,
  rankBonusRows,
  reasonCards,
  taxNotes,
  investmentNotes,
  faq,
  relatedLinks,
} from "../../data/skHynixBonus2027";
---
```

### 4-2. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  main.container.page-shell.report-page.skb27-page
    CalculatorHero
    InfoNotice
    [A] Hero CTA + 핵심 KPI
    [B] 2026 지급 구조 요약
    [C] 2027 PS가 달라질 수 있는 이유
    [D] 영업이익별 PS 시나리오
    [E] 직급별 예상 성과급 표
    [F] 세후 실수령액 CTA
    [G] 성과급 투자 시뮬레이션 CTA
    [H] 삼성/현대차 비교 CTA
    [I] FAQ
    [J] SeoContent
```

---

## 5. 섹션 상세 설계

### [A] Hero CTA + 핵심 KPI

목표:

- 상단에서 즉시 계산기 이동을 만든다.
- 전망 콘텐츠임을 명확히 알린다.

마크업:

```astro
<section class="content-section skb27-hero-board">
  <div class="skb27-hero-actions">
    <a class="button button--primary" href={withBase("/tools/sk-hynix-bonus/")}>내 연봉으로 하이닉스 성과급 계산하기</a>
    <a class="button button--secondary" href={withBase("/tools/bonus-after-tax-calculator/?company=sk-hynix")}>성과급 세후 실수령액 확인하기</a>
  </div>
  <div class="skb27-kpi-grid">
    {heroKpis.map((item) => (
      <article class="skb27-kpi-card">
        <p>{item.label}</p>
        <strong>{item.value}</strong>
        <span>{item.description}</span>
      </article>
    ))}
  </div>
</section>
```

콘텐츠:

- `2027 PS`: 영업이익 흐름에 따라 달라질 수 있음
- `PI`: 반기 성과급 성격
- `개인별 차이`: 직급·연봉·지급 방식에 따라 다름

### [B] 2026 지급 구조 요약

목표:

- PS/PI 차이를 짧고 분명하게 설명한다.

마크업:

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">2026 구조 요약</p>
    <h2>2027 전망을 보기 전, PS와 PI 구조부터 확인하세요</h2>
  </div>
  <div class="skb27-structure-grid">
    {structureCards.map((card) => (
      <article class="skb27-info-card">
        <p>{card.label}</p>
        <strong>{card.value}</strong>
        <span>{card.description}</span>
      </article>
    ))}
  </div>
</section>
```

필수 문구:

- `아래 금액은 확정 지급액이 아니라 공개 구조와 가정값을 바탕으로 한 참고 시뮬레이션입니다.`

### [C] 2027 PS가 달라질 수 있는 이유

목표:

- 단순 금액 표가 아니라 왜 전망이 달라지는지 이해시킨다.

콘텐츠 카드:

- HBM·AI 서버 수요
- 메모리 가격과 재고 사이클
- 환율과 영업이익 민감도
- PS 지급 방식 변화 가능성

마크업:

```astro
<div class="skb27-reason-grid">
  {reasonCards.map((card) => (
    <article class="skb27-reason-card">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <ul>
        {card.points.map((point) => <li>{point}</li>)}
      </ul>
    </article>
  ))}
</div>
```

### [D] 영업이익별 PS 시나리오

목표:

- 이 페이지의 핵심. 검색 사용자가 기대하는 금액 전망을 표로 제공한다.

마크업:

```astro
<section class="content-section skb27-scenario-section">
  <div class="section-header">
    <p class="section-header__eyebrow">PS 시나리오</p>
    <h2>영업이익별 2027 PS 시나리오</h2>
    <p>실제 지급액이 아니라 업황과 실적 가정에 따른 참고 범위입니다.</p>
  </div>
  <div class="skb27-scenario-grid">
    {scenarioRows.map((scenario) => (
      <article class={`skb27-scenario-card skb27-scenario-card--${scenario.tone}`} data-scenario={scenario.id}>
        <p>{scenario.label}</p>
        <strong>{scenario.operatingProfitLabel}</strong>
        <span>{scenario.summary}</span>
        <em>{scenario.interpretation}</em>
      </article>
    ))}
  </div>
</section>
```

선택 인터랙션:

- 초기 구현은 정적 카드로 가능
- 여유가 있으면 카드 클릭 시 직급별 표의 강조 컬럼 변경

### [E] 직급별 예상 성과급 표

목표:

- 사용자가 자기 연봉대와 가까운 성과급 범위를 빠르게 확인한다.

마크업:

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">직급별 예상표</p>
    <h2>직급·연봉 예시별 2027 성과급 시뮬레이션</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table skb27-rank-table">
      <thead>
        <tr>
          <th>직급/연봉 예시</th>
          <th>보수적</th>
          <th>기준</th>
          <th>낙관</th>
          <th>월 체감</th>
        </tr>
      </thead>
      <tbody>
        {rankBonusRows.map((row) => (
          <tr>
            <td>
              <strong>{row.rankLabel}</strong>
              <span>{formatWon(row.annualSalary)}</span>
            </td>
            <td>{formatWon(row.conservativeBonus)}</td>
            <td>{formatWon(row.baseBonus)}</td>
            <td>{formatWon(row.optimisticBonus)}</td>
            <td>{formatWon(row.monthlyImpactBase)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div class="skb27-inline-cta">
    <a class="button button--primary" href={withBase("/tools/sk-hynix-bonus/")}>내 연봉 기준으로 다시 계산하기</a>
  </div>
</section>
```

### [F] 세후 실수령액 CTA

목표:

- 성과급은 세전/세후 차이가 크다는 맥락으로 세후 계산기로 이동시킨다.

마크업:

```astro
<section class="content-section skb27-next-step">
  <div>
    <p class="section-header__eyebrow">세후 실수령</p>
    <h2>성과급은 세전 금액과 통장 입금액이 다를 수 있습니다</h2>
    <p>원천징수, 지방소득세, 4대보험 반영 여부에 따라 실제 입금액은 달라질 수 있습니다.</p>
  </div>
  <a class="button button--primary" href={withBase("/tools/bonus-after-tax-calculator/?company=sk-hynix")}>성과급 세후 실수령액 계산하기</a>
</section>
```

### [G] 성과급 투자 시뮬레이션 CTA

목표:

- DCA 계산기로 체류 흐름을 이어간다.

마크업:

```astro
<section class="content-section skb27-invest-cta">
  <div>
    <p class="section-header__eyebrow">다음 계산</p>
    <h2>성과급을 12개월로 나눠 투자하면 어떻게 달라질까요?</h2>
    <p>투자 권유가 아니라 적립식 투자 결과를 비교하는 참고 시뮬레이션입니다.</p>
  </div>
  <a class="button button--secondary" href={withBase("/tools/dca-investment-calculator/?m=1000000&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1")}>성과급 투자 시뮬레이션 열기</a>
</section>
```

### [H] 삼성/현대차 비교 CTA

목표:

- 성과급 클러스터 내부 이동을 강화한다.

링크:

- `/tools/bonus-simulator/`
- `/tools/samsung-bonus/`
- `/tools/hyundai-bonus/`
- `/reports/corporate-bonus-comparison-2026/`

### [I] FAQ

마크업:

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">FAQ</p>
    <h2>하이닉스 2027 성과급 전망 FAQ</h2>
  </div>
  <div class="faq-list">
    {faq.map((item, index) => (
      <details class="faq-item" open={index === 0}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </div>
</section>
```

---

## 6. 인터랙션 설계

초기 버전은 정적 페이지로 발행해도 충분하다. 단, 구현 여유가 있으면 아래 인터랙션을 추가한다.

### 6-1. 시나리오 카드 선택

상태:

```js
const state = {
  activeScenario: "base",
};
```

동작:

- 시나리오 카드 클릭
- 선택 카드에 `.is-active`
- 직급별 표의 해당 컬럼 강조
- CTA 링크의 `bonus` 파라미터를 기준 시나리오 금액으로 갱신

### 6-2. CTA URL prefill

세후 계산기:

```txt
/tools/bonus-after-tax-calculator/?bonus=<baseBonus>&salary=<annualSalary>&company=sk-hynix
```

DCA 계산기:

```txt
/tools/dca-investment-calculator/?m=<monthlyInvest>&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1
```

월 투자금 계산:

```js
const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonus / 12) / 50000) * 50000));
```

---

## 7. 스타일 설계

### 7-1. Prefix

- 페이지 루트: `.skb27-page`
- Hero 보드: `.skb27-hero-board`
- KPI: `.skb27-kpi-grid`, `.skb27-kpi-card`
- 구조 카드: `.skb27-structure-grid`, `.skb27-info-card`
- 이유 카드: `.skb27-reason-grid`, `.skb27-reason-card`
- 시나리오: `.skb27-scenario-grid`, `.skb27-scenario-card`
- CTA: `.skb27-next-step`, `.skb27-invest-cta`, `.skb27-related-grid`

### 7-2. 시각 톤

- 기존 하이닉스 계산기 톤과 연결한다.
- 기본 색상은 `#0F6E56`, 보조는 `#534AB7`, 경고/주의는 `#BA7517`.
- 전망/추정 콘텐츠이므로 과도한 확정 느낌의 카피와 강한 색 사용을 피한다.

### 7-3. SCSS 골격

```scss
.skb27-page {
  .skb27-hero-board,
  .skb27-next-step,
  .skb27-invest-cta {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    background: #FFFFFF;
    padding: 18px;
  }

  .skb27-kpi-grid,
  .skb27-structure-grid,
  .skb27-reason-grid,
  .skb27-scenario-grid,
  .skb27-related-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .skb27-scenario-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }
}

@media (min-width: 768px) {
  .skb27-page {
    .skb27-kpi-grid,
    .skb27-structure-grid,
    .skb27-scenario-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .skb27-reason-grid,
    .skb27-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
```

---

## 8. `reports.ts` 등록

```ts
{
  slug: "sk-hynix-bonus-2027",
  title: "하이닉스 2027 성과급 전망",
  description: "SK하이닉스 PS·PI 구조를 기준으로 2027 성과급 전망을 영업이익별 시나리오와 직급별 예상 금액으로 정리합니다.",
  order: 0.9,
}
```

리포트 허브 카테고리:

- `bonus` 또는 `salary`
- `isNew: true`

홈/리포트 허브 노출:

- 성과급 클러스터 또는 신규 리포트 영역에 배치
- 관련 리포트: `corporate-bonus-comparison-2026`, `insurance-salary-bonus-comparison-2026`, `construction-salary-bonus-comparison-2026`

---

## 9. Sitemap/OG

### 9-1. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-bonus-2027/</loc>
  <lastmod>2026-05-24</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

### 9-2. OG 이미지

파일:

```txt
public/og/reports/sk-hynix-bonus-2027.png
```

텍스트:

- 메인: `하이닉스 2027 성과급 전망`
- 서브: `SK하이닉스 PS·PI 시나리오`

---

## 10. 콘텐츠 주의사항

- `확정`, `보장`, `공식 지급액`처럼 보이는 표현을 피한다.
- 모든 전망값에는 `전망`, `추정`, `시뮬레이션`, `가정` 중 하나를 붙인다.
- 투자 CTA는 투자 권유가 아니라 계산 시뮬레이션으로 표현한다.
- 세후 금액은 개인별 원천징수와 4대보험 조건에 따라 다를 수 있음을 명시한다.
- 회사 내부 정책이나 미공개 지급 기준을 단정하지 않는다.

---

## 11. 구현 순서

1. `src/data/skHynixBonus2027.ts` 작성
2. `src/pages/reports/sk-hynix-bonus-2027.astro` 작성
3. `_sk-hynix-bonus-2027.scss` 작성 및 `app.scss` 등록
4. 필요 시 `public/scripts/sk-hynix-bonus-2027.js` 작성
5. `src/data/reports.ts` 등록
6. `public/sitemap.xml` 등록
7. OG 이미지 생성 또는 기본 이미지 연결
8. `npm run build`
9. 로컬 확인 후 배포

---

## 12. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 `하이닉스 2027 성과급`이 자연스럽게 포함됨
- [ ] `하이닉스 성과급 전망`, `SK하이닉스 PS 2027` 키워드가 H2 또는 본문에 포함됨
- [ ] 확정값과 전망값이 구분됨
- [ ] PS/PI 차이가 명확히 설명됨
- [ ] 영업이익별 시나리오가 표 또는 카드로 제공됨
- [ ] 직급별 예상 금액 표가 있음
- [ ] FAQ 5개 이상 포함됨

### UX QA

- [ ] 상단 CTA가 계산기와 세후 계산기로 연결됨
- [ ] 중간 CTA가 하이닉스 계산기로 연결됨
- [ ] DCA 계산기 링크가 있음
- [ ] 모바일에서 표가 깨지지 않음
- [ ] 버튼 텍스트가 줄바꿈되어도 레이아웃이 무너지지 않음

### 기술 QA

- [ ] `npm run build` 성공
- [ ] `/reports/sk-hynix-bonus-2027/` 라우트 생성
- [ ] `reports.ts` 등록
- [ ] `sitemap.xml` 등록
- [ ] `app.scss`에 SCSS import 등록
- [ ] JSON-LD 유효
- [ ] 링크 404 없음

---

## 13. 발행 후 관찰 지표

7~14일 기준:

- `/reports/sk-hynix-bonus-2027/` 노출 수
- `하이닉스 2027 성과급`, `하이닉스 성과급 전망`, `SK하이닉스 PS 2027` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/sk-hynix-bonus/` 내부 이동
- `/tools/bonus-after-tax-calculator/` 내부 이동
- `/tools/dca-investment-calculator/` 내부 이동

초기 목표:

- 7일 노출 100 이상
- CTR 8% 이상
- 계산기 내부 이동 10건 이상

---

## 14. 다음 확장 아이디어

- `삼성전자 DS 성과급 계산 기준 리포트`
- `현대차 임단협 성과급 2026 리포트`
- `대기업 성과급 순위 2026`
- `반도체 업황과 성과급 상관관계 리포트`
