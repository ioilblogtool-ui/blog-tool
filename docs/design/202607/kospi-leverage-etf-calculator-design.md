# 설계 문서
## 코스피 레버리지 ETF 손익 계산기

> 기획 원본: `docs/plan/202607/kospi-leverage-etf-pnl-calculator-plan.md`
> 신규 구현 페이지: `/tools/kospi-leverage-etf-calculator/`
> 설계 목적: 투자원금·레버리지 배율·시장 흐름 시나리오를 입력하면 코스피 지수 누적 수익률과 레버리지 ETF의 실제(일별 복리) 누적 수익률을 나란히 계산해, "왜 지수 등락률의 정확한 배수가 아닌지"를 변동성 감소효과(디케이)로 체감하게 하는 투자 계산기.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `kospi-leverage-etf-calculator` |
| 페이지 경로 | `src/pages/tools/kospi-leverage-etf-calculator.astro` |
| 데이터 파일 | `src/data/kospiLeverageEtfCalculator.ts` |
| 클라이언트 스크립트 | `public/scripts/kospi-leverage-etf-calculator.js` |
| SCSS | `src/styles/scss/pages/_kospi-leverage-etf-calculator.scss` |
| SCSS prefix | `.klc` |
| 콘텐츠 유형 | `/tools/` 투자·재테크 계산기 |
| 홈 카테고리 | `투자·재테크` |
| 주요 CTA | DCA 적립식 계산기, ETF 분배금 세금 계산기, 코스피 사이드카 리포트 |
| 등록 필요 | `src/data/tools.ts`, `src/pages/index.astro`, `src/styles/app.scss`, `public/sitemap.xml` |
| 검증 명령 | `npm run build` |
| 향후 확장 | `/reports/single-stock-leverage-etf-regulation-2026/` 등 클러스터 콘텐츠 (기획서 2장 참고) |

---

## 1. 제품 방향

### 1-1. 계산기 한 줄 정의

`투자원금과 시장 흐름 시나리오를 선택하면, 코스피 지수 누적 수익률과 레버리지 ETF의 일별 복리 실제 수익률 차이를 계산해 변동성 감소효과를 체감하게 하는 계산기`

### 1-2. 사용자가 얻는 것

- 지수 등락률을 단순히 배율만큼 곱한 "통념상 수익률"과 실제 일별 복리 시뮬레이션 결과의 차이를 확인
- "지수는 제자리인데 레버리지는 손실"이라는 변동성 감소효과를 프리셋 예시로 직접 체감
- 추세장·박스권·급등락장·하락장 등 시장 흐름별로 디케이 효과의 방향과 크기가 다르다는 것을 이해
- 운용보수를 반영한 최종 예상 손익금액과, 같은 원금을 지수 추종 상품에 투자했을 때와의 비교
- 손실 시나리오에서 원금 회복에 필요한 상승률 확인
- 2026년 7월 단일종목 레버리지 규제 이슈가 이 계산기가 다루는 지수형 레버리지와 어떻게 다른지 확인

### 1-3. 피해야 할 것

- 계산 결과를 특정 상품 매수·매도 권유처럼 표현
- 프리셋 시나리오를 실제 시장 예측처럼 표현
- "레버리지는 무조건 손실"처럼 단정 — 추세장 프리셋에서는 디케이 갭이 플러스로 나타나는 것도 그대로 보여줘야 함(균형 서술)
- 단일종목 레버리지 규제를 코스피200 지수 레버리지에도 동일 적용되는 것처럼 서술
- 운용보수·롤오버 비용·추적오차 등 미반영 요소를 숨기고 결과를 확정치처럼 표시

---

## 2. SEO 설계

### 2-1. 메타 데이터

```ts
export const KLC_META = {
  slug: "kospi-leverage-etf-calculator",
  title: "코스피 레버리지 ETF 손익 계산기",
  description:
    "투자금액과 시장 흐름 시나리오를 선택하면 코스피 지수 수익률과 레버리지 ETF 실제 수익률 차이를 계산합니다.",
  seoTitle: "코스피 레버리지 ETF 계산기 2026 | 지수 2배 아닌 진짜 손익",
  seoDescription:
    "투자금액과 시장 흐름을 선택하면 코스피 지수 수익률과 레버리지 ETF 실제 수익률 차이를 바로 계산합니다. 변동성 감소효과, 원금 복구 필요 상승률까지 확인하세요.",
  updatedAt: "2026-07-30",
  dataNote:
    "이 계산기는 프리셋 시나리오의 일별 등락률을 그대로 복리 계산한 참고용 시뮬레이션입니다. 실제 상품 수익률에는 운용보수, 선물 롤오버 비용, 추적오차, 시장가격과 순자산가치(NAV) 간 괴리, 거래·세금 비용이 추가로 반영되어 이 계산 결과와 다를 수 있습니다. 투자 권유가 아닙니다.",
};
```

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="투자 계산기"
  title={KLC_META.title}
  description="투자금액과 시장 흐름 시나리오를 선택하면 코스피 지수 수익률과 레버리지 ETF의 실제 예상 수익률 차이를 바로 계산합니다."
  badges={["레버리지 ETF", "변동성 감소효과", "KODEX 레버리지", "2026"]}
/>
```

### 2-3. H2 구조

1. `시장 흐름 시나리오 선택`
2. `투자 조건 입력`
3. `핵심 계산 결과`
4. `일별 등락 경로로 보는 괴리`
5. `왜 지수 등락률의 정확한 배수가 아닐까`
6. `2026년 7월 레버리지 ETF 규제 이슈`
7. `코스피 레버리지 ETF 손익 계산기 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 코스피 레버리지 계산기 | title, H1, FAQ |
| 레버리지 ETF 수익률 계산기 | title, Hero, SeoContent |
| KODEX 레버리지 계산 | Hero, 결과 카드 설명 |
| 변동성 감소효과 | H2, 해설 섹션, FAQ |
| 레버리지 ETF 디케이 | 해설 섹션, FAQ |
| 레버리지 ETF 장기투자 | FAQ, SeoContent |
| 단일종목 레버리지 규제 2026 | 규제 이슈 섹션, FAQ |
| 레버리지 원금 복구 | 결과 카드, FAQ |

---

## 3. 데이터 파일 설계

파일: `src/data/kospiLeverageEtfCalculator.ts`

### 3-1. export 구조

```ts
export const KLC_META = { ... };
export const KLC_SCENARIOS: DailyScenario[] = [ ... ];
export const KLC_RESULT_CARDS: ResultCardMeta[] = [ ... ];
export const KLC_MECHANISM_EXAMPLE: MechanismExample = { ... };
export const KLC_REGULATION_TIMELINE: RegulationEvent[] = [ ... ];
export const KLC_FAQ: FaqItem[] = [ ... ];
export const KLC_RELATED_LINKS: RelatedLink[] = [ ... ];
export const KLC_SOURCE_LINKS: SourceLink[] = [ ... ];
```

### 3-2. 타입 정의

```ts
export type DailyScenario = {
  id: "sideways" | "uptrend" | "volatileUp2026" | "downtrend";
  label: string;
  narrative: string;
  dailyIndexReturns: number[]; // 소수 표기, 예: 0.05 = +5%
  gapDirectionHint: "negative" | "positive" | "mixed";
};

export type ResultCardMeta = {
  key:
    | "indexCumulativeReturn"
    | "leverageSimpleReturn"
    | "leverageActualReturnPreFee"
    | "decayGap"
    | "leverageFinalReturn"
    | "finalAmount"
    | "indexOnlyFinalAmount"
    | "recoveryReturnNeeded";
  label: string;
  badge: "단순 계산" | "참고 시뮬레이션" | "비교";
  description: string;
};

export type MechanismExample = {
  title: string;
  steps: { day: string; indexValue: number; indexReturnLabel: string; leverageValue: number; leverageReturnLabel: string }[];
  conclusion: string;
};

export type RegulationEvent = {
  date: string;
  dateLabel: string;
  content: string;
  status: "완료" | "예정";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  desc: string;
};

export type SourceLink = {
  label: string;
  url: string;
  note: string;
};
```

### 3-3. 프리셋 시나리오 (정밀 계산 완료, 4-2 계산 함수로 재현 가능)

일별 등락률은 소수로 저장한다. 기본 프리셋은 `sideways`(박스권 반복장)이며, 지수가 정확히 원점으로 돌아오는 값(+10% / -9.0909...%, 즉 -1/11)을 3회 반복해 "지수 0%인데 레버리지는 손실"을 수학적으로 정확하게 보여준다.

```ts
export const KLC_SCENARIOS: DailyScenario[] = [
  {
    id: "sideways",
    label: "박스권 반복장",
    narrative:
      "지수가 오르내림을 반복하며 6거래일 동안 정확히 제자리로 돌아옵니다. 변동성 감소효과를 가장 극적으로 보여주는 기본 시나리오입니다.",
    dailyIndexReturns: [0.10, -1 / 11, 0.10, -1 / 11, 0.10, -1 / 11],
    gapDirectionHint: "negative",
  },
  {
    id: "uptrend",
    label: "완만한 상승 추세",
    narrative:
      "10거래일 동안 매일 +2%씩 꾸준히 오르는 추세장입니다. 방향성이 유지되는 구간에서는 복리효과가 단순 배수 계산보다 유리하게 작동할 수 있습니다.",
    dailyIndexReturns: Array(10).fill(0.02),
    gapDirectionHint: "positive",
  },
  {
    id: "volatileUp2026",
    label: "급등락 반복장 (2026년형)",
    narrative:
      "코스피 사이드카가 역대 최다로 발동된 2026년의 변동성 국면을 참고한 시나리오입니다. 지수는 소폭 상승했지만 레버리지 ETF 실제 수익률은 지수보다도 낮게 나올 수 있습니다.",
    dailyIndexReturns: [0.07, -0.06, 0.08, -0.07, 0.04, -0.03],
    gapDirectionHint: "negative",
  },
  {
    id: "downtrend",
    label: "완만한 하락장",
    narrative:
      "5거래일 동안 매일 -2%씩 꾸준히 하락하는 구간입니다. 하락 추세도 방향이 유지되면 디케이 갭이 반드시 나쁜 쪽으로만 작동하지는 않습니다.",
    dailyIndexReturns: Array(5).fill(-0.02),
    gapDirectionHint: "positive",
  },
];
```

`gapDirectionHint`는 UI에서 결과가 나오기 전 사용자의 예상을 유도하는 용도가 아니라, 결과 카드 배지 색상(음수=주의색, 양수=중립색)을 결정하는 데만 사용한다.

### 3-4. 메커니즘 예시 데이터 (H2-5 해설 섹션용)

```ts
export const KLC_MECHANISM_EXAMPLE: MechanismExample = {
  title: "지수 100에서 시작해 +10% 오른 뒤 -9.09% 내리면",
  steps: [
    { day: "시작", indexValue: 100, indexReturnLabel: "-", leverageValue: 100, leverageReturnLabel: "-" },
    { day: "1일차", indexValue: 110, indexReturnLabel: "+10%", leverageValue: 120, leverageReturnLabel: "+20%" },
    { day: "2일차", indexValue: 100, indexReturnLabel: "-9.09%", leverageValue: 98.18, leverageReturnLabel: "-18.18%" },
  ],
  conclusion:
    "지수는 정확히 100으로 돌아왔지만(0%), 2배 레버리지 ETF는 약 98.18로 약 -1.82% 손실입니다. 매일 배율을 재조정(리밸런싱)하며 추종하기 때문에 발생하는 변동성 감소효과입니다.",
};
```

### 3-5. 규제 타임라인 데이터 (H2-6 섹션용, 팩트체크 완료 — 기획서 3-3 참고)

```ts
export const KLC_REGULATION_TIMELINE: RegulationEvent[] = [
  { date: "2026-07-16", dateLabel: "2026년 7월 16일", content: "단일종목 레버리지 상품(ETF·ETN) 신규상장 잠정 중단, 광고·판촉 금지", status: "완료" },
  { date: "2026-07-24", dateLabel: "2026년 7월 24일", content: "기본예탁금 강화 조기시행 방안 발표", status: "완료" },
  { date: "2026-07-31", dateLabel: "2026년 7월 31일", content: "기본예탁금 현금 3천만원 이상 요건 시행 (대용증권 불인정)", status: "예정" },
  { date: "2026-08-19", dateLabel: "2026년 8월 19일", content: "괴리율 관리 기준 강화 (3% → 2%)", status: "예정" },
  { date: "2026-11", dateLabel: "2026년 11월", content: "매매단위 1주 → 20주 변경", status: "예정" },
];
```

배포 시점의 실제 날짜(오늘) 기준으로 `status`를 "완료"/"예정" 자동 판정하지 않고 데이터에 고정값으로 둔다 — 정적 페이지이므로 배포할 때마다 수동 갱신한다.

### 3-6. FAQ 데이터

FAQ는 화면과 `FAQPage` JSON-LD가 같은 배열을 사용한다. 8개 이상 유지한다 (기획서 8장 내용을 그대로 데이터화).

```ts
export const KLC_FAQ: FaqItem[] = [
  {
    question: "코스피가 10% 오르면 레버리지 ETF도 20% 오르나요?",
    answer:
      "하루 기준으로는 지수 등락률의 2배를 추구하지만, 여러 날 보유하면 일별 수익률을 매일 재조정(리밸런싱)하며 복리로 쌓이기 때문에 기간 전체로는 정확히 2배가 되지 않습니다.",
  },
  // ... 기획서 8장의 나머지 7개 항목을 동일한 형식으로 포함
];
```

---

## 4. 계산 로직 설계

계산 로직은 클라이언트 JS에 둔다. Astro 페이지는 기본 HTML과 초기값(첫 프리셋 `sideways`)만 제공한다.

파일: `public/scripts/kospi-leverage-etf-calculator.js`

### 4-1. 입력 모델

```js
const input = {
  principal: 10000000,       // 투자원금(원)
  leverageMultiple: 2,        // 2 또는 3
  scenarioId: "sideways",     // KLC_SCENARIOS의 id
  annualFeeRate: 0.0064,      // 연 운용보수, 기본 KODEX 레버리지 실제값
};
```

### 4-2. 계산 함수

```js
function calculateLeverage(input, scenario) {
  const principal = Math.max(0, input.principal || 0);
  const multiple = input.leverageMultiple === 3 ? 3 : 2;
  const feeRate = Math.max(0, input.annualFeeRate || 0);
  const dailyReturns = scenario.dailyIndexReturns;
  const tradingDays = dailyReturns.length;

  let indexValue = 1;
  let leverageValue = 1;

  for (const r of dailyReturns) {
    indexValue *= 1 + r;
    const leveragedDaily = Math.max(multiple * r, -1); // 하루 -100% 하한
    leverageValue *= 1 + leveragedDaily;
  }

  const indexCumulativeReturn = indexValue - 1;
  const leverageSimpleReturn = indexCumulativeReturn * multiple;
  const leverageActualReturnPreFee = leverageValue - 1;
  const decayGap = leverageActualReturnPreFee - leverageSimpleReturn;

  const feeDrag = feeRate * (tradingDays / 252);
  const leverageFinalReturn = leverageActualReturnPreFee - feeDrag;

  const finalAmount = principal * (1 + leverageFinalReturn);
  const indexOnlyFinalAmount = principal * (1 + indexCumulativeReturn);
  const recoveryReturnNeeded =
    leverageFinalReturn < 0 ? 1 / (1 + leverageFinalReturn) - 1 : null;

  return {
    tradingDays,
    indexCumulativeReturn,
    leverageSimpleReturn,
    leverageActualReturnPreFee,
    decayGap,
    feeDrag,
    leverageFinalReturn,
    finalAmount,
    indexOnlyFinalAmount,
    recoveryReturnNeeded,
  };
}
```

### 4-3. 정밀 검증값 (기본 배율 2배, 보수 0.64%, 원금 1천만원 기준)

아래 값은 위 계산 함수를 손으로 재현해 검증한 값이며, QA 체크리스트(11장)의 기준값으로 사용한다.

| 프리셋 | 거래일수 | 지수 누적 수익률 | 레버리지 단순 이론 | 레버리지 실제(보수전) | 디케이 갭 | 최종 수익률(보수후) | 최종 평가금액 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 박스권 반복장 | 6일 | 0.0000% | 0.0000% | -5.3560% | -5.3560%p | -5.3712% | 약 9,462,879원 |
| 완만한 상승 추세 | 10일 | +21.8994% | +43.7989% | +48.0244% | +4.2255%p | +47.9990% | 약 14,799,903원 |
| 급등락 반복장(2026년형) | 6일 | +1.9116% | +3.8231% | +1.6004% | -2.2227%p | +1.5852% | 약 10,158,520원 |
| 완만한 하락장 | 5일 | -9.6079% | -19.2158% | -18.4627% | +0.7531%p | -18.4754% | 약 8,152,457원 |

이 값은 `node`로 4-2 계산 함수를 그대로 실행해 검증한 수치다. 박스권 프리셋의 원금 복구 필요 상승률은 **+5.6761%**, 완만한 하락장 프리셋은 **+22.6624%**다.

### 4-4. 입력 검증

| 조건 | UI 처리 |
|---|---|
| 투자원금 <= 0 | 결과 패널에 `투자원금을 입력하세요` 안내, 카드 값은 `-` 표시 |
| 프리셋 미선택(초기 로드) | `sideways`를 기본값으로 자동 적용 |
| 연 운용보수 음수 입력 | 0으로 clamp |
| 연 운용보수 미입력 | 기본값 0.64% 유지 |
| 레버리지 배율 미선택 | 2배로 기본 적용 |

### 4-5. 숫자 포맷터

```js
function formatPercent(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(digits)}%`;
}

function formatWon(value) {
  if (!Number.isFinite(value)) return "-";
  const rounded = Math.round(value);
  if (Math.abs(rounded) >= 1_0000_0000) {
    return `약 ${(rounded / 1_0000_0000).toFixed(1)}억 원`;
  }
  return `약 ${new Intl.NumberFormat("ko-KR").format(rounded)}원`;
}

function parseMoneyByUnit(amount, unit) {
  const multipliers = { won: 1, man: 10000, eok: 100000000 };
  return amount * (multipliers[unit] || 1);
}
```

### 4-6. URL 파라미터

| 파라미터 | 의미 |
|---|---|
| `principal` | 투자원금(원) |
| `multiple` | 레버리지 배율(2 또는 3) |
| `scenario` | 시나리오 id |
| `fee` | 연 운용보수(%, 소수점 2자리) |

동작:
- 페이지 로드 시 URL 파라미터가 있으면 기본 프리셋보다 우선 반영한다.
- 입력·시나리오 변경 시 `history.replaceState`로 URL을 갱신한다.
- 공유 버튼은 현재 URL을 클립보드에 복사한다(선택 기능).
- 초기화 버튼은 `sideways` 프리셋과 기본 입력값으로 되돌린다.

---

## 5. 페이지 IA 설계

### 5-1. 전체 구조

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell tool-page klc-page">
    [CalculatorHero]
    [InfoNotice]
    .klc-scenario-section
    .klc-calculator-section
      .klc-input-panel
      .klc-result-panel
    .klc-path-section
    .klc-mechanism-section
    .klc-regulation-section
    [SeoContent]
  </main>
  <script src="/scripts/kospi-leverage-etf-calculator.js" defer></script>
```

### 5-2. 시나리오 선택 섹션

```astro
<section class="content-section klc-scenario-section" aria-labelledby="klc-scenario-title">
  <div class="klc-section-heading">
    <p>시장 흐름 선택</p>
    <h2 id="klc-scenario-title">시장 흐름 시나리오 선택</h2>
    <span>프리셋을 선택하면 해당 흐름의 일별 등락률을 그대로 복리 계산합니다. 실제 시장은 이 패턴과 다르게 움직일 수 있습니다.</span>
  </div>
  <div class="klc-scenario-grid">
    {KLC_SCENARIOS.map((scenario) => (
      <button
        class="klc-scenario-card"
        type="button"
        data-scenario-id={scenario.id}
        aria-pressed={scenario.id === "sideways" ? "true" : "false"}
      >
        <strong>{scenario.label}</strong>
        <small>{scenario.narrative}</small>
      </button>
    ))}
  </div>
</section>
```

### 5-3. 입력 폼 + 결과 패널

```astro
<section class="content-section klc-calculator-section" aria-labelledby="klc-calculator-title">
  <div class="klc-section-heading">
    <p>계산기</p>
    <h2 id="klc-calculator-title">투자 조건 입력</h2>
  </div>

  <div class="klc-calculator-grid">
    <form class="klc-input-panel" data-klc-form>
      <div class="klc-field klc-field--money">
        <label for="klc-principal">투자원금</label>
        <div class="klc-money-row">
          <input type="number" inputmode="numeric" min="0" id="klc-principal" value="1000" />
          <select id="klc-principal-unit">
            <option value="man" selected>만원</option>
            <option value="won">원</option>
            <option value="eok">억원</option>
          </select>
        </div>
      </div>

      <fieldset class="klc-field klc-field--toggle">
        <legend>레버리지 배율</legend>
        <label><input type="radio" name="klc-multiple" value="2" checked /> 2배 (국내 표준)</label>
        <label><input type="radio" name="klc-multiple" value="3" /> 3배 (해외 상품 비교용)</label>
      </fieldset>

      <details class="klc-advanced">
        <summary>연 운용보수 설정</summary>
        <label class="klc-field">
          <span>연 운용보수(%)</span>
          <input type="number" inputmode="decimal" min="0" step="0.01" id="klc-fee-rate" value="0.64" />
          <small>KODEX 레버리지 실제 보수율(연 0.64%)이 기본값입니다.</small>
        </label>
      </details>
    </form>

    <section class="klc-result-panel" aria-live="polite">
      <!-- JS가 결과 카드 값을 채움 -->
    </section>
  </div>
</section>
```

### 5-4. 결과 카드 마크업

```astro
<div class="klc-kpi-grid">
  {KLC_RESULT_CARDS.slice(0, 4).map((card) => (
    <article class="klc-kpi-card" data-card-key={card.key}>
      <span class="klc-card-badge">{card.badge}</span>
      <p>{card.label}</p>
      <strong data-result={card.key}>-</strong>
      <small>{card.description}</small>
    </article>
  ))}
</div>
<div class="klc-detail-grid">
  {KLC_RESULT_CARDS.slice(4).map((card) => (
    <article class="klc-detail-card" data-card-key={card.key}>
      <span class="klc-card-badge">{card.badge}</span>
      <p>{card.label}</p>
      <strong data-result={card.key}>-</strong>
    </article>
  ))}
</div>
<p class="klc-recovery-note" data-result="recoveryNote" hidden></p>
```

`recoveryReturnNeeded`가 `null`이면 `.klc-recovery-note`에 `hidden` 속성을 유지하고, 값이 있으면 JS가 문구를 채우고 `hidden`을 해제한다.

### 5-5. 일별 등락 경로 섹션

```astro
<section class="content-section klc-path-section" aria-labelledby="klc-path-title">
  <div class="klc-section-heading">
    <p>경로 시각화</p>
    <h2 id="klc-path-title">일별 등락 경로로 보는 괴리</h2>
  </div>
  <div class="klc-path-bars" data-klc-path-bars>
    <!-- JS가 선택된 시나리오의 dailyIndexReturns 기준으로 막대 생성 -->
  </div>
  <p class="klc-path-legend">
    <span class="klc-legend-dot klc-legend-dot--index"></span>지수 누적 &nbsp;
    <span class="klc-legend-dot klc-legend-dot--leverage"></span>레버리지 누적
  </p>
</section>
```

CSS bar 방식(라이브러리 없이 `<div>` 높이/너비로 표현)을 사용한다. 거래일 수가 최대 10일이므로 Chart.js 없이 충분히 표현 가능하다.

### 5-6. 메커니즘 해설 섹션

```astro
<section class="content-section klc-mechanism-section" aria-labelledby="klc-mechanism-title">
  <div class="klc-section-heading">
    <p>왜 이런 일이 벌어질까</p>
    <h2 id="klc-mechanism-title">왜 지수 등락률의 정확한 배수가 아닐까</h2>
  </div>
  <div class="table-wrap klc-table-wrap">
    <table class="klc-mechanism-table">
      <caption>{KLC_MECHANISM_EXAMPLE.title}</caption>
      <thead>
        <tr><th>시점</th><th>지수</th><th>지수 등락률</th><th>레버리지 ETF</th><th>레버리지 등락률</th></tr>
      </thead>
      <tbody>
        {KLC_MECHANISM_EXAMPLE.steps.map((step) => (
          <tr>
            <td>{step.day}</td>
            <td>{step.indexValue}</td>
            <td>{step.indexReturnLabel}</td>
            <td>{step.leverageValue}</td>
            <td>{step.leverageReturnLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="klc-mechanism-conclusion">{KLC_MECHANISM_EXAMPLE.conclusion}</p>
</section>
```

### 5-7. 규제 이슈 섹션

```astro
<section class="content-section klc-regulation-section" aria-labelledby="klc-regulation-title">
  <div class="klc-section-heading">
    <p>2026년 7월 이슈</p>
    <h2 id="klc-regulation-title">2026년 7월 레버리지 ETF 규제 이슈</h2>
  </div>
  <ul class="klc-regulation-list">
    {KLC_REGULATION_TIMELINE.map((event) => (
      <li class="klc-regulation-item" data-status={event.status}>
        <strong>{event.dateLabel}</strong>
        <span>{event.content}</span>
      </li>
    ))}
  </ul>
  <p class="op-message">
    위 규제는 삼성전자·SK하이닉스 등 <strong>개별 종목을 기초로 하는 단일종목 레버리지 상품</strong>이 대상입니다. 이 계산기가 다루는 코스피200 지수 레버리지 ETF(KODEX 레버리지 등)에도 동일하게 적용되는지는 보도만으로 명확히 확인되지 않으므로, 실제 투자 전 증권사 최신 공지를 확인하세요.
  </p>
</section>
```

### 5-8. 관련 링크(SeoContent related)

| 링크 후보 | 문구 |
|---|---|
| `/tools/dca-investment-calculator/` | 적립식 투자로 시뮬레이션하기 |
| `/tools/etf-distribution-tax-calculator/` | ETF 분배금 세금까지 계산하기 |
| `/reports/kospi-sidecar-record-2026/` | 2026년 코스피 변동성이 왜 이렇게 컸는지 보기 |

---

## 6. 클라이언트 JS 설계

### 6-1. DOM 선택자

```js
const selectors = {
  form: "[data-klc-form]",
  scenarioButton: "[data-scenario-id]",
  result: "[data-result]",
  principal: "#klc-principal",
  principalUnit: "#klc-principal-unit",
  multiple: 'input[name="klc-multiple"]',
  feeRate: "#klc-fee-rate",
  pathBars: "[data-klc-path-bars]",
  recoveryNote: '[data-result="recoveryNote"]',
};
```

### 6-2. 초기화 순서

1. `KLC_SCENARIOS`를 JSON으로 `<script type="application/json" id="klc-scenarios-data">`에 주입하거나 클라이언트 스크립트 상수로 이중 정의한다(데이터 파일은 빌드 타임에만 존재하므로 런타임 JS는 별도 상수 필요 — 8-3 참고).
2. URL 파라미터가 있으면 입력값·시나리오에 우선 반영한다.
3. 없으면 `sideways` 프리셋과 기본 입력값을 사용한다.
4. `input`, `change` 이벤트를 폼 전체에 위임한다.
5. 시나리오 버튼 클릭 시 `aria-pressed`를 갱신하고 재계산한다.
6. 계산 결과를 `data-result` 요소와 경로 시각화 바에 주입한다.
7. URL 파라미터를 갱신한다.

### 6-3. 렌더링 맵

| data-result | 표시값 |
|---|---|
| `indexCumulativeReturn` | `formatPercent(result.indexCumulativeReturn)` |
| `leverageSimpleReturn` | `formatPercent(result.leverageSimpleReturn)` |
| `leverageActualReturnPreFee` | `formatPercent(result.leverageActualReturnPreFee)` |
| `decayGap` | `formatPercent(result.decayGap) + "p"` |
| `leverageFinalReturn` | `formatPercent(result.leverageFinalReturn)` |
| `finalAmount` | `formatWon(result.finalAmount)` |
| `indexOnlyFinalAmount` | `formatWon(result.indexOnlyFinalAmount)` |
| `recoveryReturnNeeded` | `null`이면 `.klc-recovery-note`에 `hidden`, 아니면 문구 채우고 노출 |

`recoveryNote` 문구 예시: `현재 손실률 기준으로 원금을 회복하려면 약 {formatPercent(recoveryReturnNeeded)} 상승이 필요합니다.`

### 6-4. 일별 경로 바 렌더링

```js
function renderPathBars(scenario, multiple) {
  const container = document.querySelector(selectors.pathBars);
  container.innerHTML = "";
  let indexAcc = 1;
  let leverageAcc = 1;
  scenario.dailyIndexReturns.forEach((r, i) => {
    indexAcc *= 1 + r;
    leverageAcc *= 1 + Math.max(multiple * r, -1);
    const row = document.createElement("div");
    row.className = "klc-path-row";
    row.innerHTML = `
      <span class="klc-path-day">D${i + 1}</span>
      <div class="klc-path-bar klc-path-bar--index" style="--val:${((indexAcc - 1) * 100).toFixed(2)}"></div>
      <div class="klc-path-bar klc-path-bar--leverage" style="--val:${((leverageAcc - 1) * 100).toFixed(2)}"></div>
    `;
    container.appendChild(row);
  });
}
```

바 길이는 CSS `calc()`로 `--val`(퍼센트)을 폭/색상에 매핑한다(7장 참고). 값이 음수면 반대 방향(왼쪽 또는 붉은 톤)으로 표시한다.

### 6-5. 오류 메시지

```html
<p class="klc-field-error" data-error-for="principal" hidden>
  투자원금을 입력하면 결과를 확인할 수 있습니다.
</p>
```

투자원금이 0 이하이면 결과 카드 값을 `-`로 표시하고 위 문구를 노출한다. 그 외 입력은 실시간 clamp로 처리하고 별도 오류 문구를 띄우지 않는다.

---

## 7. SCSS 설계

파일: `src/styles/scss/pages/_kospi-leverage-etf-calculator.scss`

### 7-1. 클래스 목록

```scss
.klc-page
.klc-section-heading
.klc-scenario-section
.klc-scenario-grid
.klc-scenario-card
.klc-calculator-section
.klc-calculator-grid
.klc-input-panel
.klc-result-panel
.klc-field
.klc-field--money
.klc-field--toggle
.klc-money-row
.klc-advanced
.klc-kpi-grid
.klc-kpi-card
.klc-detail-grid
.klc-detail-card
.klc-card-badge
.klc-recovery-note
.klc-path-section
.klc-path-bars
.klc-path-row
.klc-path-day
.klc-path-bar
.klc-path-bar--index
.klc-path-bar--leverage
.klc-path-legend
.klc-legend-dot
.klc-table-wrap
.klc-mechanism-table
.klc-mechanism-conclusion
.klc-regulation-section
.klc-regulation-list
.klc-regulation-item
.klc-field-error
```

### 7-2. 레이아웃

```scss
.klc-page {
  display: grid;
  gap: 28px;
}

.klc-calculator-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  align-items: start;
}

.klc-input-panel,
.klc-result-panel,
.klc-scenario-card,
.klc-kpi-card,
.klc-detail-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  background: #fff;
}

@media (max-width: 900px) {
  .klc-calculator-grid {
    grid-template-columns: 1fr;
  }
}
```

### 7-3. 시나리오 카드

```scss
.klc-scenario-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.klc-scenario-card {
  display: grid;
  gap: 6px;
  padding: 14px;
  text-align: left;
  cursor: pointer;

  strong { color: #111928; font-size: 14px; }
  small { color: #6b7280; line-height: 1.5; font-size: 12px; }

  &[aria-pressed="true"] {
    border-color: #1a56db;
    box-shadow: 0 0 0 2px rgba(26, 86, 219, 0.15);
  }
}
```

### 7-4. 결과 카드

```scss
.klc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.klc-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.klc-kpi-card,
.klc-detail-card {
  display: grid;
  gap: 6px;
  padding: 16px;

  strong {
    color: #111928;
    font-size: clamp(20px, 4vw, 28px);
    line-height: 1.15;
  }

  small { color: #6b7280; line-height: 1.5; }
}

@media (max-width: 560px) {
  .klc-kpi-grid,
  .klc-detail-grid {
    grid-template-columns: 1fr;
  }
}
```

### 7-5. 경로 시각화 바

```scss
.klc-path-row {
  display: grid;
  grid-template-columns: 32px 1fr 1fr;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.klc-path-bar {
  height: 14px;
  border-radius: 999px;
  background: #eef2fb;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: clamp(2%, calc(50% + var(--val) * 1%), 100%);
    border-radius: inherit;
  }

  &--index::after { background: #94a3b8; }
  &--leverage::after { background: #1a56db; }
}
```

실제 구현 시 음수/양수 방향에 따라 바 시작점을 중앙 기준으로 조정하는 세부 로직은 구현 단계에서 확정한다(단순 클램프 예시로 설계 의도만 표기).

### 7-6. 색상 톤

- 디케이 갭이 음수여도 붉은색 단일 강조는 피하고, 텍스트 배지(`단순 계산` vs `참고 시뮬레이션`)로 의미를 함께 전달한다.
- 상승 추세 프리셋처럼 디케이 갭이 양수인 사례도 동일한 색 체계로 중립적으로 보여준다 — "레버리지는 항상 나쁘다"는 인상을 주지 않는다.
- 규제 이슈 리스트는 InfoNotice와 유사한 차분한 톤 유지, 경고성 강조색 남용 금지.

---

## 8. Astro 페이지 설계

파일: `src/pages/tools/kospi-leverage-etf-calculator.astro`

### 8-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  KLC_META,
  KLC_SCENARIOS,
  KLC_RESULT_CARDS,
  KLC_MECHANISM_EXAMPLE,
  KLC_REGULATION_TIMELINE,
  KLC_FAQ,
  KLC_RELATED_LINKS,
} from "../../data/kospiLeverageEtfCalculator";
---
```

### 8-2. BaseLayout / JSON-LD

```ts
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: KLC_META.title,
    description: KLC_META.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: toolUrl,
    inLanguage: "ko-KR",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KLC_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 2, name: "도구", item: `${siteBase}/tools/` },
      { "@type": "ListItem", position: 3, name: KLC_META.title, item: toolUrl },
    ],
  },
];
```

### 8-3. 데이터 전달 방식 (Astro → 클라이언트 JS)

`KLC_SCENARIOS`는 빌드 타임에만 존재하는 데이터이므로, 클라이언트 스크립트가 읽을 수 있도록 `script[type="application/json"]`으로 주입한다(`CONTENT_GUIDE.md` 인터랙션 구현 기준과 동일 패턴).

```astro
<script type="application/json" id="klc-scenarios-data" set:html={JSON.stringify(KLC_SCENARIOS)} />
```

클라이언트 JS는 페이지 로드 시 `JSON.parse(document.getElementById("klc-scenarios-data").textContent)`로 시나리오 배열을 읽는다. 6-2의 "이중 정의" 대신 이 방식을 표준으로 채택한다(다른 리포트/계산기 페이지와 동일 패턴 유지).

### 8-4. SeoContent intro 구조

`CONTENT_GUIDE.md` 기준(4단락 이상, 단락당 150자 이상, 총 600자 이상, FAQ 5개 이상)에 맞춰 작성한다.

1. 맥락: "코스피가 올랐는데 왜 내 레버리지 ETF 수익률은 다를까"를 궁금해하는 상황 — 실제 투자 경험, 뉴스에서 지수 상승을 봤는데 계좌는 다른 경우
2. 메커니즘: 레버리지 ETF는 기간 수익률이 아니라 일간 수익률의 배수를 매일 재조정하며 추종한다는 원리, 100→110→100 예시
3. 해석 방법: 디케이 갭은 시장 흐름(추세 vs 반복)에 따라 방향이 달라진다는 점, 이 계산기로 시나리오별 비교하는 법
4. 한계: 운용보수·롤오버 비용·추적오차·NAV 괴리 등 미반영 요소, 투자 권유 아님, 2026년 7월 규제는 단일종목 상품 대상이라는 구분

---

## 9. 접근성 및 UX

### 9-1. 접근성

- 모든 입력은 `<label>`과 연결한다.
- 결과 패널은 `aria-live="polite"`를 사용한다.
- 시나리오 카드는 `<button type="button" aria-pressed>`로 선택 상태를 전달한다.
- 결과 카드 의미는 색상만으로 전달하지 않고 텍스트 배지로 표시한다.
- 표에는 `caption`을 둔다.

### 9-2. 모바일 UX

- 390px 기준 Hero 다음에 시나리오 선택이 바로 보이도록 배치한다.
- 시나리오 카드는 모바일에서 2열 → 1열로 전환한다.
- 입력 폼은 1열 스택, 결과 카드도 모바일에서 1열.
- 경로 시각화 바는 가로 폭이 좁아도 겹치지 않도록 `grid-template-columns: 32px 1fr 1fr` 비율을 유지한다.
- 규제 타임라인 리스트는 세로 스택.

### 9-3. 상호작용

- 별도 계산 버튼 없음. 입력·시나리오 선택 즉시 재계산.
- 시나리오 카드 클릭 시 결과 카드 + 경로 시각화 바 동시 갱신.
- 공유 버튼(선택 기능): `navigator.clipboard.writeText(location.href)`.
- 초기화 버튼은 `sideways` 프리셋과 기본 입력값(1,000만원, 2배, 보수 0.64%)으로 되돌림.

---

## 10. 등록 파일 설계

### 10-1. `src/data/tools.ts`

```ts
{
  slug: "kospi-leverage-etf-calculator",
  title: "코스피 레버리지 ETF 손익 계산기",
  description:
    "투자금액과 시장 흐름 시나리오를 선택해 코스피 지수 수익률과 레버리지 ETF 실제 수익률 차이, 변동성 감소효과를 계산합니다.",
  order: 00,
  badges: ["신규", "투자", "레버리지 ETF", "2026"],
}
```

실제 `order`는 투자·재테크 계산기 주변 위치를 확인한 뒤 배치한다.

### 10-2. `src/pages/index.astro`

```ts
"kospi-leverage-etf-calculator": "투자·재테크",
```

### 10-3. `src/styles/app.scss`

```scss
@use 'scss/pages/kospi-leverage-etf-calculator';
```

### 10-4. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/kospi-leverage-etf-calculator/</loc>
  <lastmod>2026-07-30</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.80</priority>
</url>
```

---

## 11. QA 체크리스트

### 계산 (4-3의 정밀 검증값 기준)

- [ ] 기본값(박스권 반복장, 1천만원, 2배, 보수 0.64%)에서 지수 누적 수익률이 0.00%로 표시되는가?
- [ ] 같은 조건에서 레버리지 실제 수익률(보수 전)이 약 -5.36%로 표시되는가?
- [ ] 디케이 갭이 약 -5.36%p로 표시되는가?
- [ ] 최종 평가금액이 약 9,462,879원(반올림 946만원대)으로 표시되는가?
- [ ] 원금 복구 필요 상승률이 약 +5.68%로 표시되고 손실 시나리오에서만 노출되는가?
- [ ] "완만한 상승 추세" 프리셋에서 디케이 갭이 양수(+4.2%p 대)로 표시되는가?
- [ ] "급등락 반복장" 프리셋에서 지수 수익률(+1.9%대)보다 레버리지 실제 수익률(+1.6%대)이 낮게 표시되는가?
- [ ] 레버리지 배율을 3배로 바꾸면 모든 카드가 즉시 재계산되는가?
- [ ] 연 운용보수를 0으로 바꾸면 `leverageFinalReturn`이 `leverageActualReturnPreFee`와 동일해지는가?
- [ ] 투자원금이 0이면 오류 안내가 표시되고 카드가 `-`로 나오는가?

### 콘텐츠

- [ ] 모든 결과 카드에 `단순 계산`, `참고 시뮬레이션`, `비교` 배지가 있는가?
- [ ] "레버리지는 무조건 손실"처럼 단정하지 않고, 상승·하락 추세 프리셋에서 디케이 갭이 유리하게 작동하는 사례도 보여주는가?
- [ ] 규제 이슈 섹션에서 "단일종목 레버리지 상품 대상이며 지수형 적용 여부 불명확" 문구가 노출되는가?
- [ ] FAQ가 8개 이상이고 화면에 노출되는가?
- [ ] 출처 섹션에 삼성자산운용 공식 자료와 금융위 보도자료가 포함되는가?

### UI

- [ ] 320px 모바일에서 시나리오 카드 4개가 겹치지 않고 스택되는가?
- [ ] 결과 숫자가 카드 밖으로 밀리지 않는가?
- [ ] 경로 시각화 바가 거래일 수(5~10일)에 관계없이 정렬이 무너지지 않는가?
- [ ] 고급 설정(운용보수)이 기본 접힘 상태인가?
- [ ] 시나리오 카드가 키보드로 접근 가능하고 `aria-pressed` 상태가 갱신되는가?

### SEO·등록

- [ ] `src/data/tools.ts` 등록 완료
- [ ] 홈 카테고리 매핑 완료
- [ ] `src/styles/app.scss` import 완료
- [ ] sitemap URL 추가
- [ ] `npm run build` 성공
- [ ] `dist/tools/kospi-leverage-etf-calculator/index.html` 생성

---

## 12. 구현 순서

1. `src/data/kospiLeverageEtfCalculator.ts` 작성 (3장 데이터 구조 그대로)
2. `src/pages/tools/kospi-leverage-etf-calculator.astro` 작성 (5장·8장 마크업)
3. `public/scripts/kospi-leverage-etf-calculator.js` 작성 (4장·6장 로직)
4. `src/styles/scss/pages/_kospi-leverage-etf-calculator.scss` 작성 (7장)
5. `src/data/tools.ts`, `src/pages/index.astro`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. `npm run build`
7. 4-3의 정밀 검증값과 실제 화면 표시값 대조
8. 390px/1440px 화면 확인 (브라우저 프리뷰)

---

## 13. 향후 확장

기획서 2장 클러스터 전략과 연동한다.

| 항목 | 값 |
|---|---|
| 다음 우선순위 | `/reports/single-stock-leverage-etf-regulation-2026/` — 규제 리포트, 시의성 매우 높음(7/31 시행) |
| 기능 확장 1 | 일별 등락률 직접 입력 모드(슬라이더/다중 입력) — 우선순위 중 |
| 기능 확장 2 | 3배 레버리지·인버스 상품까지 배율 확장 — 우선순위 중 |
| 기능 확장 3 | 손실 원금 복구 계산기를 레버리지 외 일반 주식까지 다루는 독립 계산기로 분리 — 우선순위 낮음 |

---

## 14. 최종 판단

이 계산기는 "레버리지 계산기" 상시 검색 수요와 2026년 7월 단일종목 레버리지 규제 이슈 트래픽을 동시에 흡수할 수 있다. 계산 로직은 배열 기반 복리 계산으로 단순하지만, 프리셋 시나리오별로 결과가 상반되게 나타나는 지점(박스권=손실 확대, 추세장=유리하게 작동)이 사용자에게 강한 "아하" 경험을 준다.

가장 중요한 구현 포인트는 **디케이 갭의 방향이 항상 나쁜 쪽이 아니라는 것을 균형 있게 보여주는 것**과, **단일종목 레버리지 규제와 지수형 레버리지 상품을 명확히 구분해서 서술하는 것**이다. 계산 결과는 투자 판단을 대신하지 않고, 레버리지 상품의 작동 원리를 숫자로 이해하는 참고 도구로 설계해야 한다.
