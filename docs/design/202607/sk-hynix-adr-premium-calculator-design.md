# SK하이닉스 ADR 프리미엄 계산기 — 설계 문서

> 기획 원문: `docs/plan/202607/sk-hynix-adr-listing-content-cluster.md` (3-1)
> 작성일: 2026-07-10
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/` 계산기 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `dca-investment-calculator`, `stock-brokerage-fee-comparison-2026`, `us-stock-exchange-profit-calculator`
> **사실관계 확정(2026-07-10)**: SK하이닉스는 2026년 7월 10일 나스닥(Nasdaq Global Select Market)에 ADR을 상장했다. 티커 `SKHY`, 공모가 ADS 1주당 149달러, ADR 비율은 **ADS 10주 = 한국 보통주 1주**(1 ADS = 보통주 0.1주)로 확정됐다. 한국 보통주 약 1,779만 주 규모 신주 발행을 기반으로 하며 조달 규모는 약 265억 달러(외신 보도 기준 약 280억 달러)다. 목적은 HBM·첨단 메모리 생산능력 확대 및 국내 신규 팹·장비 투자 재원 확보이며, 기관 주문은 공모 물량의 약 7배 이상 몰렸다. 상장·티커·공모가·비율·조달규모는 확정 사실로 서술하고, 코리아 디스카운트 완화·밸류에이션 재평가 등 향후 효과는 전망형(`~기대`, `~가능성`)으로 유지한다.

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `SK하이닉스 ADR 프리미엄 계산기`
- 콘텐츠 유형: 실시간 입력형 계산기 (`/tools/`)
- 권장 slug: `sk-hynix-adr-premium-calculator`
- URL: `/tools/sk-hynix-adr-premium-calculator/`

### 1-2. 문서 역할

기획 문서를 실제 계산기 구현 단위로 고정한다. 데이터 스키마, 계산 로직, 페이지 섹션, SEO 메타, 스타일 prefix, QA 기준을 정의한다.

### 1-3. 페이지 성격 — 왜 이 계산기가 클릭되는가

- **재정거래(arbitrage) 판단형 계산기**: "김치프리미엄"이라는 이미 대중이 아는 용어를 앞세워, 국내 주가와 나스닥 SKHY 환산가의 괴리를 숫자로 즉시 보여준다. 사용자가 "얼마나 차이나지?"를 3초 안에 확인하게 만드는 것이 핵심 훅이다.
- **뉴스 트리거형 신규 검색 수요 (진행형 이슈)**: 2026-07-10 나스닥 상장이 실제로 완료된 직후이므로 "SK하이닉스 ADR", "SKHY 주가", "하이닉스 나스닥" 같은 브랜드+신규 티커 조합 키워드가 단기간 급증하는 국면이다(이 사이트의 `이강인 주급`, `삼성전기 성과급` 사례와 동일한 뉴스 트리거형 트래픽 곡선). 상장 초기(상장 후 수일~2주)가 노출·CTR이 가장 높은 구간이므로 최우선 발행 대상이다.
- **재방문 유도형**: 환율·SKHY 주가는 매일 바뀌므로, 북마크 후 재방문하는 사용자를 계산기 자체가 만들어낸다. `previewStats`에 "매일 바뀌는 환율·SKHY 주가 반영" 문구로 재방문 동기 강조.

### 1-4. 권장 파일 구조

```txt
src/
  data/
    skHynixAdrPremium.ts
  pages/
    tools/
      sk-hynix-adr-premium-calculator.astro

public/
  scripts/
    sk-hynix-adr-premium-calculator.js

src/styles/scss/pages/
  _sk-hynix-adr-premium-calculator.scss

public/og/tools/
  sk-hynix-adr-premium-calculator.png
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타 (CLAUDE.md 계산기 공식: `{대상} 계산기 {연도} | {핵심 결과} 바로 계산` 적용)

```ts
export const toolMeta = {
  slug: "sk-hynix-adr-premium-calculator",
  title: "SK하이닉스 ADR 계산기 2026 | 김치프리미엄 바로 계산",
  description: "국내 주가와 나스닥 SKHY 주가·환율 입력하면 SK하이닉스 김치프리미엄(할증·할인) % 바로 계산. ADS 10주=보통주 1주 비율 자동 반영.",
  h1: "SK하이닉스 ADR(SKHY) 프리미엄 계산기",
  eyebrow: "ADR 프리미엄 계산",
  updatedAt: "2026-07-10",
};
```

- 타이틀 50자 이내 확인: `SK하이닉스 ADR 계산기 2026 | 김치프리미엄 바로 계산` = 29자 → 통과
- 디스크립션 길이 확인: 약 90자 → 80~120자 기준 통과
- 금지어 체크: `환차손익`을 title 맨 앞에 두지 않음(디스크립션에도 미사용)
- 실제 나스닥 티커 `SKHY`를 H1·설명에 명시해 구체성 확보(CLAUDE.md: intro에 구체적 수치·사례 포함 시 CTR 상승 원칙과 동일선상)

### 2-2. 키워드 매핑

| 영역 | 주요 키워드 | 반영 위치 |
|---|---|---|
| 핵심 | SK하이닉스 ADR | title, H1, hero |
| 핵심 | 하이닉스 ADR 계산기 | title, previewStats, FAQ |
| 핵심 | 김치프리미엄 계산 | title, hero 서브카피, H2 |
| 핵심 | SKHY 나스닥 주가 | H1, 입력 필드 라벨, FAQ |
| 보조 | 하이닉스 ADR 가격 | 본문, 결과 카드 라벨 |
| 보조 | 원달러 환율 계산기 | 입력 필드 라벨, FAQ |
| 롱테일 | SK하이닉스 나스닥 상장 주가 | SeoContent intro |
| 롱테일 | 국내주식 미국주식 가격차이 | SeoContent intro, FAQ |

### 2-3. 구조화 데이터

`Article` + `FAQPage` JSON-LD. FAQ 문항은 §6-8 참고.

---

## 3. 데이터 스키마

### 3-1. `src/data/skHynixAdrPremium.ts`

```ts
export type AdrPresetScenario = {
  id: string;
  label: string;
  krxPrice: number;      // 국내 주가(원)
  fxRate: number;        // 원/달러 환율
  adsPrice: number;      // 나스닥 SKHY ADS 주가(달러)
  note: string;
};

export type AdrInfoCard = {
  label: string;
  value: string;
  description: string;
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

export const toolMeta = { /* 위 2-1 참고 */ };

// SK하이닉스 ADR 확정 스펙 (2026-07-10 나스닥 상장 기준) — 사용자 입력 대상 아님, 계산 상수로 고정
export const ADR_SPEC = {
  exchange: "Nasdaq Global Select Market",
  ticker: "SKHY",
  ipoPricePerAds: 149, // 공모가, 달러
  adsPerShare: 10,     // ADS 10주 = 한국 보통주 1주 (1 ADS = 보통주 0.1주)
  listedAt: "2026-07-10",
};

export const defaultInputs = {
  krxPrice: 0,   // 예시값 — 구현 시점 실제 종가로 교체, "예시" 라벨 필수
  fxRate: 0,     // 예시값 — 구현 시점 실제 환율로 교체
  adsPrice: 0,   // 예시값 — 구현 시점 실제 SKHY 종가로 교체 (공모가 149달러를 초기 placeholder로 사용 가능)
};

export const infoCards: AdrInfoCard[] = [ /* "ADR이란", "프리미엄/디스카운트란", "재정거래란" 3장 */ ];
export const presetScenarios: AdrPresetScenario[] = [ /* 프리미엄/디스카운트/등가 3가지 예시 시나리오 */ ];
export const faq: AdrFaq[] = [ /* §6-8 참고 */ ];
export const relatedLinks: AdrRelatedLink[] = [ /* §7 참고 */ ];
```

### 3-2. 계산 로직

```js
// public/scripts/sk-hynix-adr-premium-calculator.js

const ADS_PER_SHARE = 10; // ADS 10주 = 보통주 1주 (확정, 상수)

function calculatePremium({ krxPrice, fxRate, adsPrice }) {
  // ADS 10주가 보통주 1주와 같으므로, ADS 가격에 10을 곱하면 "보통주 1주 환산가"가 된다.
  const impliedShareValueUsd = adsPrice * ADS_PER_SHARE;
  const impliedShareValueKrw = impliedShareValueUsd * fxRate;
  const premiumAmount = impliedShareValueKrw - krxPrice;
  const premiumPercent = krxPrice > 0 ? (premiumAmount / krxPrice) * 100 : 0;

  return {
    impliedShareValueKrw: Math.round(impliedShareValueKrw),
    premiumAmount: Math.round(premiumAmount),
    premiumPercent: Number(premiumPercent.toFixed(2)),
    direction: premiumPercent > 0 ? "premium" : premiumPercent < 0 ? "discount" : "neutral",
  };
}
```

- `direction === "premium"` → "나스닥 SKHY가 국내보다 N% 비쌉니다(김치프리미엄)"
- `direction === "discount"` → "나스닥 SKHY가 국내보다 N% 쌉니다(디스카운트)"
- ADR 비율(ADS 10주 = 보통주 1주)은 **확정 상수**이므로 사용자 입력 필드에서 제거한다. 입력은 국내 주가·환율·ADS 주가 3개만 받아 이탈률을 낮춘다(기존 설계의 "고급 설정 접기" 방식보다 더 단순화됨 — 비율 자체가 사용자가 조작할 대상이 아니라 상장 조건으로 고정됐기 때문).

### 3-3. URL 파라미터 (재방문/공유용)

```txt
/tools/sk-hynix-adr-premium-calculator/?krx=<원>&fx=<환율>&ads=<달러>
```

`url-state.js` 공통 헬퍼 재사용. (기존 `ratio` 파라미터는 상수화로 제거)

---

## 4. 페이지 구조

### 4-1. 컴포넌트 구성

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import SummaryCards from "../../components/SummaryCards.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { toolMeta, infoCards, presetScenarios, faq, relatedLinks } from "../../data/skHynixAdrPremium";
---
```

레이아웃 셸: `SimpleToolShell` (단일 계산기, 입력→결과 구조에 적합)

### 4-2. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  main.container.page-shell.tool-page.skadr-page
    CalculatorHero (H1 + 서브카피 + previewStats)
    InfoNotice ("실시간 시세 API 연동 아님 — 직접 입력한 값 기준 계산" 고지)
    [A] 입력 폼 (국내주가/환율/나스닥 SKHY 주가 — ADR 비율은 고정 상수 안내만)
    [B] 결과 카드 (프리미엄%, 환산가치, 해석 문구)
    [C] 프리셋 시나리오 버튼 3종 (할증/할인/등가 예시로 빠른 체험)
    [D] ADR이 뭔가요 — 개념 설명 3카드
    [E] 재정거래는 실제로 가능한가 — 주의 InfoNotice
    [F] 관련 계산기/리포트 CTA
    [G] FAQ
    [H] SeoContent (Fragment slot="seo")
```

---

## 5. 섹션 상세 설계

### [A] 입력 폼

```astro
<section class="content-section skadr-input-board">
  <div class="skadr-input-grid">
    <label>
      <span>국내 주가(원)</span>
      <input type="number" data-adr-input="krxPrice" inputmode="numeric" placeholder="예: 250,000" />
    </label>
    <label>
      <span>원/달러 환율</span>
      <input type="number" data-adr-input="fxRate" inputmode="decimal" placeholder="예: 1,380" />
    </label>
    <label>
      <span>나스닥 SKHY 주가(달러)</span>
      <input type="number" data-adr-input="adsPrice" inputmode="decimal" placeholder="예: 149.00 (공모가 기준)" />
    </label>
  </div>
  <p class="skadr-hint">ADR 비율(ADS 10주 = 보통주 1주)은 자동 반영됩니다. 실시간 시세는 자동 연동되지 않으니 증권사 앱·네이버페이증권 등에서 확인한 값을 직접 입력하세요.</p>
</section>
```

- 3개 필드만 노출(국내주가/환율/SKHY 주가). ADR 비율은 확정 상수로 계산 로직에 내장되어 사용자 입력에서 제외됨 — 기존 설계 대비 입력 허들이 더 낮아졌다.
- `inputmode` 지정으로 모바일 숫자 키패드 유도(모바일 우선 원칙).

### [B] 결과 카드

```astro
<section class="content-section skadr-result-board" aria-live="polite">
  <div class="skadr-result-grid">
    <article class="skadr-result-card skadr-result-card--primary" data-result="premiumPercent">
      <p>프리미엄/디스카운트</p>
      <strong data-bind="premiumPercent">—</strong>
      <span data-bind="directionLabel">값을 입력하면 계산됩니다</span>
    </article>
    <article class="skadr-result-card" data-result="impliedShareValueKrw">
      <p>SKHY 보통주 환산가치</p>
      <strong data-bind="impliedShareValueKrw">—</strong>
    </article>
    <article class="skadr-result-card" data-result="premiumAmount">
      <p>차액</p>
      <strong data-bind="premiumAmount">—</strong>
    </article>
  </div>
</section>
```

- `direction`에 따라 카드 색상 토큰 전환: premium → warning 톤, discount → info 톤, neutral → base 톤.
- 결과가 없을 때(`—`)는 명확히 "값을 입력하면 계산됩니다" 안내로 빈 상태 처리.

### [C] 프리셋 시나리오 버튼

```astro
<div class="skadr-preset-row">
  {presetScenarios.map((s) => (
    <button type="button" class="button button--tertiary" data-preset={s.id}>{s.label}</button>
  ))}
</div>
```

- 예: "할증 10% 예시", "할인 5% 예시", "등가(0%) 예시" — 클릭 시 입력 필드 자동 채움 → 처음 온 사용자가 개념을 즉시 체감.

### [D] ADR이 뭔가요 — 개념 설명 3카드

`infoCards` 렌더링. 각 카드: "ADR이란", "프리미엄/디스카운트란", "재정거래란"을 1~2문장으로 설명. SEO 텍스트 볼륨 보강 역할도 겸함.

### [E] 재정거래는 실제로 가능한가

```astro
<InfoNotice type="caution">
  ADR과 국내 주식 간 실제 매매를 통한 재정거래는 계좌·세금·환전 비용·결제일 차이로 계산상 프리미엄만큼 수익이 나지 않을 수 있습니다. 이 계산기는 가격 괴리를 파악하는 참고용이며 투자 실행을 권유하지 않습니다.
</InnoNotice>
```
(컴포넌트명 오탈자 주의 — 실제 구현 시 `InfoNotice` 사용)

### [F] 관련 계산기/리포트 CTA

- `/reports/sk-hynix-adr-listing-2026/` — ADR 상장 완전정리 리포트
- `/reports/sk-hynix-korea-vs-adr-investment-2026/` — 국내 vs ADR 투자 비교
- `/reports/stock-brokerage-fee-comparison-2026/` — 증권사 수수료 비교 (기존 리포트, 환전 스프레드 관련 문구 보유)
- `/tools/us-stock-exchange-profit-calculator/` — 해외주식 양도세 계산기 (있다면 연결)

### [G] FAQ (5개 이상, GOOGLE_SEO_RULES 최소 기준 충족)

1. `SK하이닉스 ADR(SKHY)이 뭔가요?` — 2026년 7월 10일 나스닥 상장 사실, 티커 SKHY, 미국예탁증서(ADR) 개념과 국내 주식과의 관계 설명.
2. `김치프리미엄은 어떻게 계산하나요?` — 계산식(§3-2) 요약 설명, ADS 10주=보통주 1주 비율 반영 방식 안내.
3. `프리미엄이 있으면 실제로 차익거래가 가능한가요?` — [E] 주의사항 재요약.
4. `ADS 10주가 왜 보통주 1주와 같나요?` — 상장 시 확정된 예탁 비율이며, 개별 ADS 가격을 보통주 가치로 환산하려면 10을 곱해야 함을 설명.
5. `환율은 어떤 걸 입력해야 하나요?` — 매매기준율/현찰환율 차이 설명, 계산 목적상 매매기준율 권장.

### [H] SeoContent

```astro
<Fragment slot="seo">
  <SeoContent
    introTitle="SK하이닉스 ADR 프리미엄, 왜 확인해야 할까"
    intro={[ /* 5단락 이상, 800자 이상, 구체적 수치·사례 포함 — §6 참고 */ ]}
    faq={faq}
  />
</Fragment>
```

**주의**: `SimpleToolShell` 내부, `<Fragment slot="seo">` 안에 반드시 배치 (GOOGLE_SEO_RULES.md 4번 규칙).

---

## 6. SeoContent intro 초안 (5단락, 800자 이상 목표)

1. SK하이닉스는 2026년 7월 10일 미국 나스닥(Nasdaq Global Select Market)에 ADR(미국예탁증서)을 상장했습니다. 티커는 SKHY, 공모가는 ADS 1주당 149달러였고, 한국 보통주 약 1,779만 주 규모의 신주 발행을 기반으로 약 265억 달러 규모의 자금을 조달했습니다. 상장 이후 국내 투자자들 사이에서는 국내 상장 주가와 나스닥 SKHY 가격 사이의 차이, 이른바 "김치프리미엄"에 대한 관심이 커지고 있습니다.
2. 프리미엄(할증)은 SKHY 가격을 원화로 환산했을 때 국내 주가보다 비싼 상태를, 디스카운트(할인)는 반대로 더 싼 상태를 의미합니다. SK하이닉스 ADR은 ADS 10주가 한국 보통주 1주를 나타내는 구조로 확정되어, 이 계산기는 SKHY 주가에 이 비율을 자동 반영해 국내 주가와의 차이를 퍼센트와 금액으로 즉시 보여줍니다.
3. 프리미엄·디스카운트가 발생하는 이유는 다양합니다. 두 시장의 거래 시간이 달라 정보 반영 속도에 차이가 생기거나, 미국 기관투자자와 국내 투자자의 수급 구조가 다르거나, 원/달러 환율 변동성이 단기적으로 가격 괴리를 만들 수 있습니다. 실제로 상장 당시 기관 주문이 공모 물량의 7배 이상 몰릴 만큼 미국 기관 수요가 컸습니다.
4. 다만 계산상 프리미엄이 확인되더라도 실제로 국내 주식을 사서 ADR로 전환해 팔거나 그 반대로 차익을 실현하는 재정거래는 계좌 개설, 환전 수수료, 세금(양도소득세·배당소득세), 결제일 차이 때문에 계산된 퍼센트만큼 수익이 남지 않는 경우가 많습니다.
5. 이 계산기는 투자 실행을 권유하는 도구가 아니라, SK하이닉스 국내 주가와 SKHY 가격의 관계를 숫자로 이해하고 시장 상황을 참고하기 위한 용도입니다. ADR 상장 배경과 코리아 디스카운트 완화 기대, 국내 투자자에게 미치는 영향이 궁금하다면 하단의 관련 리포트를 함께 확인하세요.

(각 문단 2~4문장, 총 5문단으로 800자 이상 확보. 상장 사실·수치는 확정형, 코리아 디스카운트 완화 등 향후 효과는 전망형 유지.)

---

## 7. 관련 링크 (`relatedLinks`)

| href | label | description |
|---|---|---|
| `/reports/sk-hynix-adr-listing-2026/` | SK하이닉스 ADR 상장 완전정리 | 배경·일정·투자자 영향 |
| `/reports/sk-hynix-korea-vs-adr-investment-2026/` | 국내투자 vs ADR 투자 비교 | 세금·환전비용 비교표 |
| `/reports/stock-brokerage-fee-comparison-2026/` | 증권사 수수료 비교 | 해외주식 환전 스프레드 참고 |
| `/reports/sk-hynix-bonus-2027/` | 하이닉스 2027 성과급 전망 | 기존 하이닉스 클러스터 연결 |

---

## 8. 스타일 설계

### 8-1. Prefix

`.skadr-page`, `.skadr-input-board`, `.skadr-input-grid`, `.skadr-result-board`, `.skadr-result-grid`, `.skadr-result-card`, `.skadr-preset-row`, `.skadr-advanced`, `.skadr-hint`

### 8-2. 시각 톤

- 하이닉스 기존 계산기 톤 유지: 기본 `#0F6E56`(teal), 경고 `#BA7517`.
- 프리미엄(할증) 카드는 warning 톤(`#BA7517` 계열), 디스카운트는 info 톤(블루 계열)으로 시각적으로 direction을 즉시 구분.

### 8-3. SCSS 골격

```scss
.skadr-page {
  .skadr-input-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }

  .skadr-result-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .skadr-result-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;

    &--primary {
      border-width: 2px;
    }
  }

  .skadr-preset-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (min-width: 768px) {
  .skadr-page {
    .skadr-input-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .skadr-result-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
```

---

## 9. `tools.ts` 등록

```ts
{
  slug: "sk-hynix-adr-premium-calculator",
  title: "SK하이닉스 ADR 계산기 2026 | 김치프리미엄 바로 계산",
  description: "국내 주가와 나스닥 SKHY 주가·환율 입력하면 SK하이닉스 김치프리미엄(할증·할인) % 바로 계산. ADS 10주=보통주 1주 비율 자동 반영.",
  order: 0.85, // 하이닉스 클러스터 인접 배치 — 실제 값은 등록 시점 tools.ts 순서 확인 후 조정
  eyebrow: "ADR 프리미엄 계산",
  category: "invest",
  badges: ["신규", "SK하이닉스", "ADR"],
  previewStats: [
    { label: "핵심 결과", value: "김치프리미엄 %" },
    { label: "기준", value: "매일 바뀌는 환율 반영" },
  ],
}
```

---

## 10. Sitemap / OG

```xml
<url>
  <loc>https://bigyocalc.com/tools/sk-hynix-adr-premium-calculator/</loc>
  <lastmod>2026-07-10</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
```

- `changefreq: daily` — 환율·주가 입력 유도형 콘텐츠라 실제 내용은 정적이지만, 사용자 재방문 빈도가 높은 성격을 감안해 daily 사용(유효값 내에서 선택).
- OG 이미지: `public/og/tools/sk-hynix-adr-premium-calculator.png` — 메인 문구 "SK하이닉스 ADR 프리미엄 계산기", 서브 "김치프리미엄 바로 확인".

---

## 11. 콘텐츠 주의사항

- 상장 사실·거래소·티커·공모가·ADR 비율(§0 확정 팩트)은 확정형으로 서술한다.
- 코리아 디스카운트 완화, 밸류에이션 재평가 등 향후 주가 효과는 전망형(`~기대`, `~가능성`)으로만 서술하고 확정처럼 쓰지 않는다.
- 예시 입력값(국내주가·환율·SKHY 주가)은 반드시 "예시" 라벨을 달거나 placeholder로만 제공하고 실데이터처럼 고정 노출하지 않는다.
- 계산 결과는 투자 조언이 아니라 참고용 계산 결과임을 [E] 섹션과 FAQ에서 반복 고지한다.
- ADR 비율(ADS 10주 = 보통주 1주)은 확정 상수이므로 데이터 파일에 "2026-07-10 상장 확정 스펙" 주석을 남기고 사용자 입력 대상에서 제외한다.

---

## 12. 구현 순서

1. `src/data/skHynixAdrPremium.ts` 작성 (§0 확정 팩트를 `ADR_SPEC` 상수로 반영)
2. `src/pages/tools/sk-hynix-adr-premium-calculator.astro` 작성
3. `public/scripts/sk-hynix-adr-premium-calculator.js` 작성 (계산 로직 + 프리셋 버튼 + URL state)
4. `_sk-hynix-adr-premium-calculator.scss` 작성 및 `app.scss` 등록
5. `tools.ts` 등록
6. `sitemap.xml` 등록
7. OG 이미지 생성
8. `npm run build` 후 로컬 확인
9. 관련 리포트(§3-2, 3-3) 완성 후 상호 링크 최종 점검

---

## 13. QA 체크리스트

### 콘텐츠 QA
- [ ] title/description에 `SK하이닉스 ADR`, `김치프리미엄` 자연스럽게 포함
- [ ] 타이틀 50자 이내, 연도 2026 포함
- [ ] 디스크립션 80~120자
- [ ] `환차손익` 등 전문용어가 title 맨 앞에 없음
- [ ] SeoContent intro 5단락·800자 이상
- [ ] FAQ 5개 이상
- [ ] 재정거래 관련 투자주의 문구 포함

### UX QA
- [ ] 입력 필드가 국내주가·환율·SKHY 주가 3개뿐이고 ADR 비율 입력이 없음(상수 처리 확인)
- [ ] 결과 카드 direction별 색상 구분
- [ ] 프리셋 버튼 클릭 시 입력값 자동 채움 동작
- [ ] 모바일에서 입력 키패드가 숫자로 뜸 (`inputmode`)
- [ ] 결과 없을 때 빈 상태 문구 정상 표시

### 기술 QA
- [ ] `npm run build` 성공
- [ ] `/tools/sk-hynix-adr-premium-calculator/` 라우트 생성
- [ ] URL 파라미터로 상태 복원됨
- [ ] `SeoContent`가 `<Fragment slot="seo">` 안에 위치
- [ ] `sitemap.xml` 트레일링 슬래시 포함, changefreq 유효값
- [ ] `tools.ts` 등록 확인

---

## 14. 발행 후 관찰 지표 (7~14일)

- `SK하이닉스 ADR`, `SKHY 주가`, `하이닉스 ADR 계산기`, `김치프리미엄 계산` 검색어 노출/CTR
- `/tools/sk-hynix-adr-premium-calculator/` 노출·클릭·CTR
- 관련 리포트 2건으로의 내부 클릭 수
- 뉴스 발행 시점(2026-07-10 상장) 대비 색인 반영 소요일 — 상장 직후 발행일수록 초기 노출 규모가 크게 좌우되므로 최우선 확인

초기 목표: 7일 노출 150 이상, CTR 6% 이상. 실제 상장·티커가 확정된 이슈이므로 `이강인 주급`류 뉴스 트리거형 콘텐츠와 유사하게 발행 직후 며칠간 노출이 집중되는 패턴을 예상한다.
