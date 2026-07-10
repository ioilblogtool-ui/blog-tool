# SK하이닉스 ADR 상장 2026 완전 정리 — 설계 문서

> 기획 원문: `docs/plan/202607/sk-hynix-adr-listing-content-cluster.md` (3-2)
> 작성일: 2026-07-10
> 구현 기준: Codex/Claude가 이 문서만 보고 `/reports/` 리포트 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `sk-hynix-bonus-2027`, `semiconductor-stocks-forecast-2026-2028`, `stock-brokerage-fee-comparison-2026`
> **사실관계 확정(2026-07-10)**: SK하이닉스는 나스닥(Nasdaq Global Select Market)에 ADR을 상장 완료했다. 티커 `SKHY`, 공모가 ADS 1주당 149달러, ADR 비율 ADS 10주=보통주 1주, 한국 보통주 약 1,779만 주 신주 발행 기반, 조달 규모 약 265억 달러(외신 기준 약 280억 달러). 목적은 HBM·첨단 메모리 생산능력 확대 및 국내 신규 팹·장비 투자 재원 확보이며, 기관 주문은 공모 물량의 약 7배 이상 몰렸다. 상장 사실·수치는 확정형으로, 코리아 디스카운트 완화·밸류에이션 재평가 등 향후 효과는 전망형으로 서술한다.

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `SK하이닉스 ADR 상장 완전 정리`
- 콘텐츠 유형: 정보성 리포트 (`/reports/`)
- 권장 slug: `sk-hynix-adr-listing-2026`
- URL: `/reports/sk-hynix-adr-listing-2026/`

### 1-2. 문서 역할

기획 문서를 리포트 구현 단위로 고정한다. 데이터 스키마, 섹션 구성, SEO 메타, 내부링크 흐름, 스타일 prefix, QA 기준을 정의한다.

### 1-3. 페이지 성격 — 검색 노출·CTR 전략

- **"~이란" 정보 검색 흡수형**: "SK하이닉스 ADR이란", "SKHY 뜻", "하이닉스 나스닥 상장" 같은 개념 검색은 실제 상장 완료 직후(2026-07-10) 폭발적으로 늘어나는 전형적인 뉴스 트리거 패턴이다. 제목에 "완전 정리"를 넣어 "한 번에 다 알고 싶다"는 검색 의도를 정확히 매칭시킨다.
- **낮은 CTR 리스크 주의**: `한성숙 프로필`, `이강인 연봉`처럼 대량 노출·초저CTR(0.2~0.6%)로 빠지는 패턴을 이 사이트는 이미 여러 차례 겪었다(2026-07-08~10 트래킹 기록). 브랜드명 단독 키워드(`SK하이닉스 ADR`)만으로는 저CTR 함정에 빠지기 쉬우므로, 타이틀·설명에 `SKHY`, `265억 달러`, `공모가 149달러` 같은 구체적 수치를 노출해 "이미 다른 곳에서 본 뻔한 요약"과 차별화한다(CLAUDE.md: intro에 구체적 수치·사례 포함 원칙과 동일).
- **계산기 유입 허브 역할**: 리포트 자체보다 계산기(§7 CTA)로의 내부 이동을 성공 지표로 삼는다. 성과급 클러스터에서 리포트가 계산기 유입 허브로 기능한 것과 동일한 구조.

### 1-4. 권장 파일 구조

```txt
src/
  data/
    skHynixAdrListing2026.ts
  pages/
    reports/
      sk-hynix-adr-listing-2026.astro

src/styles/scss/pages/
  _sk-hynix-adr-listing-2026.scss

public/og/reports/
  sk-hynix-adr-listing-2026.png
```

필수 등록: `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타 (CLAUDE.md 정보성 리포트 공식: `{주제} {연도} 완전 정리 | {핵심 궁금증}` 적용)

```ts
export const reportMeta = {
  slug: "sk-hynix-adr-listing-2026",
  title: "SK하이닉스 나스닥 ADR 상장 완전 정리 | SKHY 티커·조달금액 총정리",
  description: "SK하이닉스 나스닥 ADR(SKHY) 상장 배경과 공모가 149달러·조달 265억 달러 규모, 국내 투자자 세금·수급 영향을 정리. ADR 프리미엄 계산기 연결 포함.",
  h1: "SK하이닉스, 나스닥 ADR 상장으로 뭐가 달라졌나",
  eyebrow: "SK하이닉스 나스닥 ADR 상장",
  updatedAt: "2026-07-10",
};
```

- 타이틀 길이 확인: `SK하이닉스 나스닥 ADR 상장 완전 정리 | SKHY 티커·조달금액 총정리` = 약 37자 → 통과
- 디스크립션 약 105자 → 기준 통과
- 연도 대신 실제 사건(나스닥 상장) 자체가 시의성을 담보 — CLAUDE.md 계산기/리포트 공식의 "연도 명시" 취지(시의성 확보)를 실제 이벤트명으로 충족
- 낯선 전문용어 title 맨 앞 배치 없음, 구체적 수치(티커·조달금액) 포함으로 CTR 강화

### 2-2. 키워드 매핑

| 영역 | 주요 키워드 | 반영 위치 |
|---|---|---|
| 핵심 | SK하이닉스 ADR 상장 | title, H1, hero |
| 핵심 | SKHY 나스닥 | title, H1, hero, FAQ |
| 핵심 | 하이닉스 ADR이란 | intro 1문단, FAQ 1번 |
| 핵심 | 하이닉스 ADR 상장 이유 | H2, 이유 카드 섹션 |
| 보조 | 하이닉스 ADR 주가 영향 | 본문, FAQ |
| 보조 | ADR 상장하면 세금 | 세금/영향 섹션, FAQ |
| 보조 | SK하이닉스 코리아 디스카운트 | 이유 카드, FAQ |
| 롱테일 | SK하이닉스 나스닥 상장일 | intro, FAQ |
| 롱테일 | 하이닉스 ADR 상장 개인투자자 | FAQ, 결론 섹션 |

### 2-3. 구조화 데이터

`Article` + `FAQPage` JSON-LD. FAQ는 §6-8 참고.

---

## 3. 데이터 스키마

### 3-1. `src/data/skHynixAdrListing2026.ts`

```ts
export type AdrTimelineStep = {
  step: string;
  label: string;
  status: "completed" | "in-progress" | "planned" | "unconfirmed";
  description: string;
};

export type AdrReasonCard = {
  title: string;
  description: string;
  points: string[];
  tone: "confirmed" | "outlook"; // confirmed = 공식 목적, outlook = 시장 기대·전망
};

export type AdrImpactRow = {
  area: string;         // 예: "국내 주가", "세금", "외국인 수급", "유동성"
  beforeListing: string;
  afterListing: string;
  note: string;
};

export type AdrFaq = {
  question: string;
  answer: string;
};

export type AdrRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export const reportMeta = { /* §2-1 참고 */ };

export const heroKpis = [
  { label: "상장일·거래소", value: "2026-07-10 나스닥(SKHY)", description: "Nasdaq Global Select Market, 공모가 ADS 1주당 149달러" },
  { label: "조달 규모", value: "약 265억 달러", description: "한국 보통주 약 1,779만 주 신주 발행 기반(외신 기준 약 280억 달러)" },
  { label: "국내 투자자 영향", value: "직접 지분 변동 없음", description: "보유 주식 자체는 그대로, 신주 발행에 따른 지분 희석은 존재" },
];

export const timelineSteps: AdrTimelineStep[] = [
  // 공식 발표 → 증권신고서 등 규제 신고 → 기관 대상 공모 → 2026-07-10 나스닥 거래 개시, 4단계 모두 completed
];
export const reasonCards: AdrReasonCard[] = [ /* HBM 투자 재원 확보(확정 목적) + 미국 기관 수급 확대·코리아 디스카운트 완화·마이크론 대비 밸류에이션 격차 축소 기대(전망) 4장, §5 [D] 참고 */ ];
export const impactRows: AdrImpactRow[] = [ /* §5 [E] 표 */ ];
export const faq: AdrFaq[] = [ /* §6-8 참고 */ ];
export const relatedLinks: AdrRelatedLink[] = [ /* §7 참고 */ ];
```

### 3-2. 표기 원칙

- `timelineSteps`는 이미 완료된 이력이므로 4단계 모두 `status: "completed"`로 표기하고, 각 단계에 실제 날짜(확인 가능한 범위 내)를 병기한다.
- `heroKpis`, 상장 스펙(날짜·거래소·티커·공모가·조달규모)은 확정형으로 표기한다.
- `reasonCards` 중 "HBM 투자 재원 확보"는 확정 목적으로, 나머지 시장 기대효과(코리아 디스카운트 완화 등)는 반드시 "(전망)" 또는 "(시장 기대)" 꼬리표를 유지한다.

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
  reportMeta, heroKpis, timelineSteps, reasonCards, impactRows, faq, relatedLinks,
} from "../../data/skHynixAdrListing2026";
---
```

### 4-2. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  main.container.page-shell.report-page.skadrl-page
    CalculatorHero
    InfoNotice (전망성 서술 구간 고지 — 코리아 디스카운트 완화 등 향후 효과는 확정 아님)
    [A] Hero KPI 3개 + 계산기 CTA
    [B] ADR이란 무엇인가 (개념 설명)
    [C] 상장 완료 타임라인
    [D] SK하이닉스가 ADR을 상장한 이유
    [E] 국내 투자자에게 달라지는 점 (비교표)
    [F] 계산기 CTA (ADR 프리미엄 계산기)
    [G] 국내 vs ADR 투자 비교 리포트 CTA
    [H] FAQ
    [I] SeoContent
```

---

## 5. 섹션 상세 설계

### [A] Hero KPI + CTA

```astro
<section class="content-section skadrl-hero-board">
  <div class="skadrl-kpi-grid">
    {heroKpis.map((item) => (
      <article class="skadrl-kpi-card">
        <p>{item.label}</p>
        <strong>{item.value}</strong>
        <span>{item.description}</span>
      </article>
    ))}
  </div>
  <div class="skadrl-hero-actions">
    <a class="button button--primary" href={withBase("/tools/sk-hynix-adr-premium-calculator/")}>ADR 프리미엄 지금 계산하기</a>
  </div>
</section>
```

### [B] ADR이란 무엇인가

목표: "~이란" 검색 의도를 첫 화면에서 바로 해소.

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">개념 정리</p>
    <h2>ADR(미국예탁증서)이란 무엇인가요</h2>
  </div>
  <p>ADR은 해외 기업의 주식을 미국 증권예탁기관이 대신 보관하고, 이를 근거로 발행해 미국 증시에서 달러로 거래할 수 있게 만든 증서입니다. 원주(국내 상장 주식)와 ADR은 법적으로 같은 회사의 지분을 나타내지만, 거래되는 시장·통화·시간대가 다릅니다. SK하이닉스는 이 구조를 통해 2026년 7월 10일 나스닥에 ADR(티커 SKHY)을 상장했습니다.</p>
</section>
```

### [C] 상장 완료 타임라인

```astro
<section class="content-section">
  <div class="section-header">
    <p class="section-header__eyebrow">상장 이정표</p>
    <h2>SK하이닉스 ADR, 나스닥 상장까지 어떻게 진행됐나</h2>
  </div>
  <ol class="skadrl-timeline">
    {timelineSteps.map((step) => (
      <li class={`skadrl-timeline-item skadrl-timeline-item--${step.status}`}>
        <strong>{step.label}</strong>
        <p>{step.description}</p>
      </li>
    ))}
  </ol>
</section>
```

4단계 모두 완료(`completed`)로 표기: ① 상장 공식 발표 ② 증권신고서 등 규제 신고 ③ 기관 대상 공모(수요 약 7배 초과 청약) ④ 2026-07-10 나스닥(SKHY) 거래 개시.

### [D] SK하이닉스가 ADR을 상장한 이유

```astro
<div class="skadrl-reason-grid">
  {reasonCards.map((card) => (
    <article class={`skadrl-reason-card skadrl-reason-card--${card.tone}`}>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <ul>{card.points.map((p) => <li>{p}</li>)}</ul>
    </article>
  ))}
</div>
```

카드 4장 구성 (`tone: "confirmed" | "outlook"` 구분):
1. **(확정 목적)** HBM·첨단 메모리 생산능력 확대 — 국내 신규 팹 건설·장비 투자 재원 확보
2. **(전망)** 미국 기관투자자 기반 확대 기대
3. **(전망)** 코리아 디스카운트 일부 완화 가능성
4. **(전망)** 마이크론 등 미국 반도체 기업과의 밸류에이션 격차 축소, 글로벌 AI·HBM 대표 기업 재평가 가능성

1번은 상장 목적으로 공식 확인된 사실, 2~4번은 "~기대된다", "~가능성이 있다"는 전망형 표현을 유지한다.

### [E] 국내 투자자에게 달라지는 점 (비교표) — 핵심 섹션

```astro
<section class="content-section skadrl-impact-section">
  <div class="section-header">
    <p class="section-header__eyebrow">투자자 영향</p>
    <h2>ADR 상장 전후, 국내 투자자는 뭐가 달라지나요</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table">
      <thead>
        <tr><th>구분</th><th>상장 전</th><th>상장 후</th><th>비고</th></tr>
      </thead>
      <tbody>
        {impactRows.map((row) => (
          <tr>
            <td><strong>{row.area}</strong></td>
            <td>{row.beforeListing}</td>
            <td>{row.afterListing}</td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

`impactRows` 5개 행 예시:
1. `기존 주주 지분` — 상장 전: 국내 상장 주식 보유 / 상장 후: 동일(변동 없음), 비고: 신주 발행에 따른 지분 희석은 존재
2. `미국 투자자 접근성` — 상장 전: 국내 계좌 통한 우회 투자만 가능 / 상장 후: 나스닥에서 SKHY로 직접 매매 가능
3. `국내 주가 흐름` — 상장 전: 코스피 단일 가격 형성 / 상장 후: SKHY 가격과 상호 참고되며 변동성 확대 가능(전망), 비고: 프리미엄/디스카운트 발생 가능
4. `외국인 수급` — 상장 전: 국내 상장분 통한 외국인 매매만 존재 / 상장 후: 미국 기관 직접 참여 확대(전망), 비고: 공모 당시 수요 약 7배 초과
5. `개인투자자 세금` — 상장 전: 해당 없음 / 상장 후: ADR 직접 매수 시 해외주식 양도세 체계 적용, 비고: 상세는 비교 리포트 참고

### [F] 계산기 CTA

```astro
<section class="content-section skadrl-next-step">
  <div>
    <p class="section-header__eyebrow">직접 계산</p>
    <h2>국내 주가와 ADR 가격, 지금 얼마나 차이날까요</h2>
    <p>국내 주가·환율·ADR 주가를 입력하면 김치프리미엄(할증·할인) %를 바로 확인할 수 있습니다.</p>
  </div>
  <a class="button button--primary" href={withBase("/tools/sk-hynix-adr-premium-calculator/")}>ADR 프리미엄 계산기 열기</a>
</section>
```

### [G] 비교 리포트 CTA

```astro
<section class="content-section skadrl-next-step">
  <div>
    <p class="section-header__eyebrow">다음 읽기</p>
    <h2>국내 투자 vs ADR 투자, 세금·비용은 어떻게 다를까요</h2>
  </div>
  <a class="button button--secondary" href={withBase("/reports/sk-hynix-korea-vs-adr-investment-2026/")}>국내투자 vs ADR 비교 리포트 보기</a>
</section>
```

### [H] FAQ (5개 이상)

1. `SK하이닉스 ADR(SKHY)이 뭔가요?` — 2026-07-10 나스닥 상장 사실, 티커·공모가 등 §[B] 요약 재사용.
2. `SK하이닉스는 왜 나스닥 ADR 상장을 했나요?` — §[D] HBM 투자 재원 확보(확정)와 시장 기대효과 3가지(전망) 요약.
3. `ADR 상장하면 국내 주가에 영향이 있나요?` — 단정하지 않고 "코리아 디스카운트 완화 기대"라는 시장 해석 수준으로 답변, 실제 재평가는 HBM 실적·미국 수급에 달려 있다는 점 강조.
4. `ADR이 상장되면 제가 가진 국내 주식은 어떻게 되나요?` — 지분 자체는 유지되나 신주 발행에 따른 지분 희석은 존재함을 명확히 설명.
5. `ADR 상장 후 세금은 어떻게 달라지나요?` — 국내 보유분은 기존과 동일, ADR을 직접 매수하면 해외주식 양도세 체계 적용됨을 안내, 상세는 비교 리포트로 연결.

### [I] SeoContent

intro 5단락·800자 이상 초안:

1. SK하이닉스는 2026년 7월 10일 미국 나스닥(Nasdaq Global Select Market)에 ADR(미국예탁증서)을 상장했습니다. 티커는 SKHY, 공모가는 ADS 1주당 149달러였으며, 한국 보통주 약 1,779만 주 규모의 신주 발행을 기반으로 약 265억 달러(외신 보도 기준 약 280억 달러) 규모의 자금을 조달했습니다.
2. ADR은 해외 기업의 주식을 미국 예탁기관이 보관하고, 이를 근거로 미국 증시에서 달러로 거래할 수 있게 만든 증서입니다. SK하이닉스 ADR은 ADS 10주가 한국 보통주 1주를 나타내는 구조로, 국내 코스피 상장 주식과 별개로 미국 투자자들이 나스닥에서 SKHY를 직접 매매할 수 있는 창구가 새로 생긴 것입니다.
3. SK하이닉스가 이번 상장으로 조달한 자금은 HBM(고대역폭메모리)과 첨단 메모리 생산능력 확대, 국내 신규 팹 건설과 장비 투자 재원으로 쓰일 예정입니다. 실제로 상장 당시 기관 주문은 공모 물량의 약 7배 이상 몰릴 만큼 미국 기관투자자의 수요가 컸습니다.
4. 시장에서는 이번 ADR 상장이 미국 기관투자자 기반을 넓히고, 그동안 거론돼 온 코리아 디스카운트를 일부 완화하며, 마이크론 등 미국 반도체 기업과의 밸류에이션 격차를 줄이는 계기가 될 수 있다는 기대를 내놓고 있습니다. 다만 이는 아직 확정된 결과가 아니라 향후 미국 시장 유동성, HBM 실적, 주주환원 정책에 따라 결정될 전망입니다.
5. 국내 투자자 입장에서 가장 궁금한 부분은 "내가 가진 국내 상장 주식이 어떻게 되는가"입니다. 보유 지분 자체는 그대로 유지되지만, 신주 발행에 따른 지분 희석과 단기 수급 부담은 존재합니다. 국내 주가와 SKHY 가격의 실시간 차이가 궁금하다면 아래 ADR 프리미엄 계산기를, 국내투자와 ADR투자 중 어느 쪽이 유리한지는 하단의 비교 리포트를 확인하세요.

---

## 6. `reports.ts` 등록

```ts
{
  slug: "sk-hynix-adr-listing-2026",
  title: "SK하이닉스 나스닥 ADR 상장 완전 정리 | SKHY 티커·조달금액 총정리",
  description: "SK하이닉스 나스닥 ADR(SKHY) 상장 배경과 공모가 149달러·조달 265억 달러 규모, 국내 투자자 세금·수급 영향을 정리. ADR 프리미엄 계산기 연결 포함.",
  order: 0.83, // 실제 등록 시 reports.ts 현재 순서 확인 후 조정
  badges: ["신규", "SK하이닉스", "ADR", "SKHY"],
}
```

---

## 7. 내부 링크 전략

### 상단 CTA
- `/tools/sk-hynix-adr-premium-calculator/` — ADR 프리미엄 계산기

### 본문 중간 CTA
- `/reports/sk-hynix-korea-vs-adr-investment-2026/` — 국내 vs ADR 투자 비교
- `/reports/stock-brokerage-fee-comparison-2026/` — 증권사 수수료 비교

### 하단 CTA
- `/reports/sk-hynix-bonus-2027/` — 기존 하이닉스 클러스터 연결
- `/tools/sk-hynix-bonus/` — 하이닉스 성과급 계산기

---

## 8. 스타일 설계

Prefix: `.skadrl-page`, `.skadrl-hero-board`, `.skadrl-kpi-grid`, `.skadrl-timeline`, `.skadrl-timeline-item`, `.skadrl-reason-grid`, `.skadrl-impact-section`, `.skadrl-next-step`

```scss
.skadrl-page {
  .skadrl-kpi-grid,
  .skadrl-reason-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .skadrl-timeline {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 8px;
  }

  .skadrl-timeline-item {
    border-left: 3px solid #0F6E56; // 전 단계 완료(completed) 고정 톤
    padding: 8px 14px;
  }

  .skadrl-reason-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;

    &--confirmed { border-left: 3px solid #0F6E56; } // 확정 목적
    &--outlook { border-left: 3px solid #BA7517; }    // 전망/기대
  }
}

@media (min-width: 768px) {
  .skadrl-page {
    .skadrl-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .skadrl-reason-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
}
```

---

## 9. Sitemap / OG

```xml
<url>
  <loc>https://bigyocalc.com/reports/sk-hynix-adr-listing-2026/</loc>
  <lastmod>2026-07-10</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

OG 텍스트: 메인 `SK하이닉스 ADR 상장 완전 정리`, 서브 `국내 투자자 영향 총정리`.

---

## 10. 콘텐츠 주의사항

- 상장 사실·거래소·티커·공모가·조달규모·발행목적(§0 확정 팩트)은 확정형으로 서술한다.
- 코리아 디스카운트 완화, 밸류에이션 재평가, 미국 기관 수급 확대 등 향후 효과는 "시장 해석", "기대", "가능성"으로만 표현하고 회사 공식 입장이나 확정 결과처럼 쓰지 않는다.
- 신주 발행에 따른 기존 주주 지분 희석, 단기 수급 부담 등 리스크 요인도 균형 있게 명시한다.
- 세금·세부 제도는 개인 상황과 시행 시점에 따라 달라질 수 있음을 명시.
- 투자 조언이 아니라 정보 정리 콘텐츠임을 명확히 한다.

---

## 11. 구현 순서

1. `src/data/skHynixAdrListing2026.ts` 작성 (§0 확정 팩트 반영)
2. `src/pages/reports/sk-hynix-adr-listing-2026.astro` 작성
3. `_sk-hynix-adr-listing-2026.scss` 작성 및 `app.scss` 등록
4. `reports.ts` 등록
5. `sitemap.xml` 등록
6. OG 이미지 생성
7. 계산기(§7 계획서 3-1)와 비교 리포트(3-3) 완성 후 상호 링크 최종 점검
8. `npm run build` 후 로컬 확인

---

## 12. QA 체크리스트

### 콘텐츠 QA
- [ ] title에 `SK하이닉스`, `나스닥 ADR 상장`, `SKHY` 포함, 50자 이내
- [ ] 디스크립션 80~120자
- [ ] 상장 팩트(확정형)와 향후 효과(전망형)가 명확히 구분됨
- [ ] SeoContent intro 5단락·800자 이상
- [ ] FAQ 5개 이상
- [ ] 지분 희석 등 리스크 요인 언급 포함

### UX QA
- [ ] 상단 CTA가 ADR 프리미엄 계산기로 연결
- [ ] 중간/하단 CTA가 비교 리포트·기존 하이닉스 클러스터로 연결
- [ ] 모바일에서 비교표가 가로 스크롤 없이 깨지지 않음(또는 `overflow-x: auto` 컨테이너 적용)

### 기술 QA
- [ ] `npm run build` 성공
- [ ] `/reports/sk-hynix-adr-listing-2026/` 라우트 생성
- [ ] `reports.ts` 등록
- [ ] `sitemap.xml` 등록, 트레일링 슬래시 포함
- [ ] JSON-LD 유효, 링크 404 없음

---

## 13. 발행 후 관찰 지표 (7~14일)

- `SK하이닉스 ADR 상장`, `SKHY 나스닥`, `하이닉스 ADR이란` 검색어 노출/CTR
- 대량 노출·저CTR 함정(과거 `한성숙 프로필`, `이강인 연봉` 패턴) 재현 여부 — 발생 시 타이틀에 행동유도 수식어 추가 보강
- ADR 프리미엄 계산기·비교 리포트로의 내부 클릭 수
- 상장일(2026-07-10) 대비 발행·색인 반영 소요일 — 뉴스 트리거형 콘텐츠 특성상 지연될수록 초기 노출 규모 손실

초기 목표: 7일 노출 200 이상, CTR 5% 이상, 계산기 내부 이동 15건 이상.

---

## 14. 다음 확장 아이디어

- `SK하이닉스 ADR 상장 한 달 후 주가 반응 리포트` (상장 후 1개월 시점 후속편 — SKHY/국내 주가 실제 흐름 정리)
- `삼성전자 ADR 상장 가능성 리포트` (업계 확산 시)
- `국내 대기업 ADR 상장 트렌드 총정리` (여러 기업 사례 묶음)
