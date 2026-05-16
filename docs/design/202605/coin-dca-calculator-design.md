# 코인 DCA 계산기 — 설계 문서

> 작성일: 2026-05-10
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 정기 적립식(DCA) 코인 투자의 평균 매수가·수익률·손익분기 계산 + 현재가 시나리오 표

---

## 1. 문서 개요

- 구현 대상: `코인 DCA 계산기`
- slug: `coin-dca-calculator`
- URL: `/tools/coin-dca-calculator/`
- 카테고리: 주식/코인
- 핵심 검색 의도: "비트코인 매달 10만 원씩 사면 평균 매수가 얼마?" "이더리움 적립식 투자 수익률 계산" "코인 DCA 전략 효과"
- 핵심 출력: 평균 매수가, 총 보유 수량, 현재 평가액, 수익률, 손익분기 가격

---

## 2. 구현 파일 구조

```text
src/
  data/
    coinDcaCalculator.ts          ← 타입 정의, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      coin-dca-calculator.astro

public/
  scripts/
    coin-dca-calculator.js

src/styles/scss/pages/
  _coin-dca-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/coin-dca-calculator';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 입력 패널은 사이드, 결과는 메인 영역.
- `resultFirst={false}` — 모바일에서 입력 먼저, 결과 후.
- SCSS prefix: `cdca-`

```astro
<SimpleToolShell
  calculatorId="coin-dca-calculator"
  pageClass="op-page cdca-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
export interface CoinDcaInput {
  coinName: string;              // 코인 이름 (표시용, 예: "비트코인(BTC)")
  monthlyAmount: number;         // 월 적립액 (원, 최소 1,000원)
  months: number;                // 적립 기간 (개월, 1~120)
  currentPrice: number;          // 현재 코인 가격 (원)
  startPrice: number | null;     // 첫 매수 시점 가격 (원, null이면 현재가와 동일)
  includeScenario: boolean;      // 시나리오 표 포함 여부
}

export interface CoinDcaResult {
  totalInvested: number;         // 총 투자금액 (원)
  totalCoins: number;            // 총 보유 코인 수량 (소수점 8자리)
  avgBuyPrice: number;           // 평균 매수가 (원)
  currentValue: number;          // 현재 평가액 (원)
  profitLoss: number;            // 손익 (원, 음수 가능)
  returnRate: number;            // 수익률 (%, 소수점 2자리)
  breakEvenPrice: number;        // 손익분기 가격 = 평균 매수가
  monthlyData: MonthlySnapshot[]; // 월별 적립 현황 (시뮬레이션)
}

export interface MonthlySnapshot {
  month: number;                 // 적립 차수 (1~N)
  price: number;                 // 해당 월 매수 가격
  coinsThisMonth: number;        // 이번 달 매수 수량
  totalCoins: number;            // 누적 보유 수량
  totalInvested: number;         // 누적 투자금
  avgBuyPrice: number;           // 누적 평균 매수가
}

export interface CoinPreset {
  id: string;
  label: string;
  coinName: string;
  monthlyAmount: number;
  months: number;
  currentPrice: number;          // 2026-05 기준 참고 가격
  startPrice: number | null;
}
```

---

## 5. 계산 로직

### 5-1. 단순 모드 (시작가 미입력, 전 기간 동일 가격)

```text
매월 매수 수량 = 월 적립액 / 현재 가격
총 보유 수량 = 매월 매수 수량 × 적립 개월 수
총 투자금 = 월 적립액 × 적립 개월 수
평균 매수가 = 현재 가격 (전 기간 동일 가격이므로)
현재 평가액 = 총 보유 수량 × 현재 가격
수익률 = 0% (투자금 = 평가액이므로 의미 없음)
```

→ 단순 모드는 "총 보유 수량"과 "총 투자금" 확인 용도. 수익률은 시작가 입력 시에만 의미 있음을 안내.

### 5-2. 시나리오 모드 (시작가 + 현재가 선형 보간)

```text
각 월 가격 = 시작가 + (현재가 - 시작가) × ((월 인덱스 - 1) / (총 개월 수 - 1))
각 월 매수 수량 = 월 적립액 / 해당 월 가격
총 보유 수량 = Σ 각 월 매수 수량
평균 매수가 = 총 투자금 / 총 보유 수량
현재 평가액 = 총 보유 수량 × 현재가
수익률 = (현재 평가액 - 총 투자금) / 총 투자금 × 100
```

DCA 핵심 효과 — 가격 하락 구간에서 매수 수량이 늘어나 평균 매수가가 단순 평균 가격보다 낮아지는 현상 발생.

예시 (BTC, 월 10만 원, 24개월, 시작가 8천만 원 → 현재가 1억 3천만 원):
```
1개월차 가격: 80,000,000원 → 매수: 0.00125 BTC
12개월차 가격: 105,000,000원 → 매수: 0.000952 BTC
24개월차 가격: 130,000,000원 → 매수: 0.000769 BTC
총 투자금: 2,400,000원
총 보유 수량: 약 0.0248 BTC
평균 매수가: 약 96,774,000원 (단순 평균 1.05억 원보다 낮음 → DCA 효과)
현재 평가액: 약 3,224,000원
수익률: 약 34.3%
```

예외 처리:
- 월 적립액 0 또는 개월 수 0 → 계산 불가 안내
- 현재 가격 0 → 입력 오류 안내
- 시작가와 현재가가 동일 → 단순 모드와 동일하게 처리
- 시작가가 현재가보다 높은 경우(손실 구간) → 정상 계산, 음수 수익률 표시

---

## 6. 프리셋 초안

| 프리셋 | 코인 | 월 적립액 | 기간 | 시작가 (참고) | 현재가 (참고) |
|--------|------|----------|------|------------|------------|
| BTC 1년 | 비트코인(BTC) | 100,000원 | 12개월 | 90,000,000원 | 130,000,000원 |
| ETH 2년 | 이더리움(ETH) | 100,000원 | 24개월 | 3,000,000원 | 5,500,000원 |
| BTC 5년 장기 | 비트코인(BTC) | 200,000원 | 60개월 | 50,000,000원 | 130,000,000원 |

가격 기준: 2026년 5월 참고값 (실시간 가격과 다를 수 있으며 실제 투자 전 확인 필요).

---

## 7. 페이지 IA

1. **Hero** — 제목: "코인 DCA 계산기", 부제: "매달 정액 투자 시 평균 매수가와 수익률을 계산합니다"
2. **InfoNotice** — "이 계산기는 단순화된 선형 보간 모델을 사용하며, 실제 시장 가격 변동을 반영하지 않습니다. 계산 결과는 투자 조언이 아닌 참고용 추정입니다. 가상자산 투자는 원금 손실 위험이 있습니다."
3. **DesignTrustPanel**
4. **프리셋 버튼 (3개)** — BTC 1년 / ETH 2년 / BTC 5년
5. **입력 패널** — 코인명, 월 적립액, 기간, 현재가, 시작가(선택)
6. **결과 KPI 카드 (5개)** — 평균 매수가, 총 투자금, 현재 평가액, 수익률, 보유 수량
7. **현재가 시나리오 표** — 현재가 ±30%, ±10%, 현재 기준 5행
8. **월별 누적 현황 표** — 주요 시점(1개월차, 6, 12, 18, 24개월차 등) 적립 현황
9. **DCA 전략 설명 카드 (3개)** — DCA란 무엇인가, 장점과 한계, 활용 팁
10. **CTA** — 코인 거래소 비교 / 가상자산 세금 계산기
11. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-----------|
| 코인 이름 | text | 비트코인(BTC) | 비워도 계산 가능 (표시용) |
| 월 적립액 (원) | number (쉼표 포맷) | 100,000 | min 1,000 |
| 적립 기간 (개월) | number | 24 | min 1, max 120 |
| 현재 코인 가격 (원) | number (쉼표 포맷) | 130,000,000 | min 1 |
| 첫 매수 시점 가격 (원) | number (쉼표 포맷), 선택 | 빈칸 | 비워두면 현재가와 동일 처리 |

보조 문구:
- 월 적립액 아래: "매달 정기적으로 투자하는 금액을 입력하세요"
- 현재가 아래: "오늘 기준 코인 가격 (업비트·빗썸 등에서 확인 후 입력)"
- 시작가 아래: "DCA를 시작한 시점의 코인 가격. 비워두면 전 기간 현재가로 계산되어 수익률은 0%가 됩니다"

---

## 9. 결과 UI 상세

KPI 카드 (5개):

| 카드 | 레이블 | 서브 텍스트 |
|------|--------|-----------|
| 주요 (Main) | 평균 매수가 | DCA로 형성된 평균 단가 |
| 일반 | 총 투자금 | 월 적립액 × 기간 |
| 일반 | 현재 평가액 | 총 보유 수량 × 현재가 |
| Accent | 수익률 | (평가액 - 투자금) / 투자금 |
| 일반 | 보유 수량 | 코인 단위 (소수점 포함) |

자연어 결과 메시지:
```
비트코인을 8천만 원부터 월 10만 원씩 24개월간 적립하면,
총 투자금 240만 원으로 약 0.0248 BTC를 모을 수 있습니다.
평균 매수가는 약 96,774,000원으로, 현재가 1억 3천만 원 대비
약 34.3%의 수익률이 기대됩니다.
```

현재가 시나리오 표:

| 현재 가격 | 평가액 | 손익 | 수익률 |
|---------|--------|------|--------|
| -30% (91,000,000원) | X원 | -X원 | -X% |
| -10% (117,000,000원) | X원 | -X원 | -X% |
| **현재 (130,000,000원)** | **X원** | **+X원** | **+X%** |
| +10% (143,000,000원) | X원 | +X원 | +X% |
| +30% (169,000,000원) | X원 | +X원 | +X% |

현재 입력값 행은 배경 하이라이트 + 굵은 폰트 처리.

---

## 10. DCA 전략 설명 카드 (3개)

```text
카드 1 — DCA란 무엇인가
정기적립식(Dollar Cost Averaging)은 가격과 무관하게 일정 금액을 정기적으로 투자하는 전략입니다.
가격이 낮을 때 더 많이 사고 높을 때 적게 사서, 장기적으로 평균 매수가를 시장 평균보다 낮추는 효과를 노립니다.
한 번에 큰 금액을 투자하는 일괄 매수(Lump Sum)와 달리 타이밍 리스크를 분산합니다.

카드 2 — DCA의 장점과 한계
장점: 심리적 부담 감소, 타이밍 리스크 분산, 지속적인 투자 습관 형성.
한계: 시장이 꾸준히 오르는 구간에서는 일괄 매수보다 수익률이 낮을 수 있습니다.
또한 단순히 나눠 사는 것이 손실을 막아주지는 않으며, 투자 자체의 리스크는 그대로 존재합니다.

카드 3 — 코인 DCA 활용 팁
월급날 직후 자동이체로 설정해 감정적 매매를 방지하세요.
급격한 하락 구간에서 추가 적립(물타기)은 평균 매수가를 더 낮출 수 있지만, 손실 확대 리스크도 함께 커집니다.
적립 기간이 길수록 DCA 효과가 뚜렷해지며, 최소 1~2년 이상의 장기 시각을 권장합니다.
```

---

## 11. JavaScript 설계

```js
(() => {
  const PRESETS = JSON.parse(document.getElementById("cdca-presets").textContent);
  let state = {
    coinName: "비트코인(BTC)",
    monthlyAmount: 100000,
    months: 24,
    currentPrice: 130000000,
    startPrice: null,
  };

  function sanitize(val, fallback = 0, min = 0) {
    const n = parseFloat(String(val).replace(/,/g, ""));
    if (isNaN(n) || n < min) return fallback;
    return n;
  }

  function readInputs() {
    state.coinName = q("[data-cdca-input='coin']")?.value || "코인";
    state.monthlyAmount = sanitize(q("[data-cdca-input='monthly']")?.value, 100000, 1000);
    state.months = sanitize(q("[data-cdca-input='months']")?.value, 24, 1);
    state.currentPrice = sanitize(q("[data-cdca-input='price']")?.value, 0, 1);
    const sp = q("[data-cdca-input='startPrice']")?.value;
    state.startPrice = sp ? sanitize(sp, null, 1) : null;
  }

  function calculate(s) {
    const effectiveStart = s.startPrice ?? s.currentPrice;
    let totalCoins = 0, monthlyData = [];

    for (let i = 0; i < s.months; i++) {
      const t = s.months === 1 ? 0 : i / (s.months - 1);
      const price = effectiveStart + (s.currentPrice - effectiveStart) * t;
      const coins = s.monthlyAmount / price;
      totalCoins += coins;
      monthlyData.push({ month: i + 1, price, coinsThisMonth: coins, totalCoins, totalInvested: s.monthlyAmount * (i + 1) });
    }

    const totalInvested = s.monthlyAmount * s.months;
    const avgBuyPrice = totalInvested / totalCoins;
    const currentValue = totalCoins * s.currentPrice;
    const profitLoss = currentValue - totalInvested;
    const returnRate = (profitLoss / totalInvested) * 100;

    return { totalInvested, totalCoins, avgBuyPrice, currentValue, profitLoss, returnRate, monthlyData };
  }

  function renderKpi(r) { /* 5개 카드 갱신 */ }
  function renderMessage(r, s) { /* 자연어 메시지 갱신 */ }
  function renderScenarioTable(r, s) { /* ±30%, ±10%, 현재, +10%, +30% 5행 */ }
  function renderMonthlyTable(r) { /* 주요 시점 월별 현황 */ }
  function applyPreset(id) { /* 프리셋 적용 + 상태 갱신 + 렌더링 */ }
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {}
  function q(sel) { return document.querySelector(sel); }

  restoreFromUrl();
  bindEvents();
  const result = calculate(state);
  renderKpi(result);
  renderMessage(result, state);
  renderScenarioTable(result, state);
  renderMonthlyTable(result);
})();
```

URL 파라미터: `coin` / `monthly` / `months` / `price` / `start`

---

## 12. SCSS 설계

```scss
.cdca-page {
  .cdca-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .cdca-preset-btn {
      border: 1px solid #dce6e2;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      cursor: pointer;
      background: #fff;
      &.is-active { background: #1a56db; color: #fff; border-color: #1a56db; }
    }
  }

  .cdca-result-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  }

  .cdca-scenario-table,
  .cdca-monthly-table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 9px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
      font-size: 0.88rem;
    }
    th:first-child, td:first-child { text-align: left; }
    tr.is-current { background: #f0f7ff; font-weight: 700; }
    td.positive { color: #0f6e56; }
    td.negative { color: #b91c1c; }
  }

  .cdca-tip-grid {
    display: grid;
    gap: 12px;
    @media (min-width: 760px) { grid-template-columns: repeat(3, 1fr); }
  }
}
```

---

## 13. SEO 설계

```text
title: 코인 DCA 계산기 - 비트코인·이더리움 적립식 투자 평균 매수가·수익률 계산
description: 비트코인, 이더리움 등 코인을 매달 정액 투자할 때 평균 매수가, 현재 평가액, 수익률, 손익분기 가격을 계산합니다. 현재가 시나리오 표로 매도 타이밍도 참고하세요.
H1: 코인 DCA 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 코인 DCA 계산기, 비트코인 적립식 투자, 이더리움 평균 매수가, 코인 수익률 계산, 가상자산 DCA

---

## 14. SeoContent 초안

### introTitle
`코인 DCA 계산기 — 적립식 투자의 평균 매수가와 수익률을 계산합니다`

### intro (5문단)

1. DCA(Dollar Cost Averaging, 정기적립식 투자)는 가격과 무관하게 매달 정해진 금액을 투자하는 전략입니다. 코인 시장처럼 가격 변동성이 큰 자산에서 특히 많이 활용됩니다. 한꺼번에 큰 금액을 투자하는 것보다 여러 번에 나눠 매수함으로써 타이밍 리스크를 줄이고 심리적 부담을 낮추는 효과가 있습니다.

2. 이 계산기는 월 적립액, 적립 기간, 시작 가격, 현재 가격을 입력해 평균 매수가와 현재 수익률을 계산합니다. 가격이 오르는 구간과 내리는 구간을 거치면 DCA의 핵심 효과가 발생합니다. 가격이 낮을 때 더 많은 수량을 매수하고 높을 때 적게 매수하므로, 평균 매수가가 단순 기간 평균 가격보다 낮아지는 현상이 나타납니다.

3. 시작 가격을 입력하지 않으면 전 기간 동일한 현재 가격으로 계산되어 수익률은 0%가 됩니다. 이 경우에는 "내가 매달 이 금액을 투자하면 총 몇 코인을 모을 수 있는가"를 확인하는 용도로 사용하세요. 시작 가격을 입력하면 선형 보간 모델로 가격 경로를 추정하여 현재 수익률을 계산합니다.

4. 하단의 현재가 시나리오 표에서 코인 가격이 ±10%, ±30% 변동할 때 평가액과 수익률이 어떻게 달라지는지 볼 수 있습니다. 매도를 고려하고 있다면 현재가 기준으로 어느 가격에서 팔아야 원하는 수익률에 도달하는지 역으로 추정하는 데 참고할 수 있습니다.

5. 이 계산기는 단순화된 선형 가격 모델을 사용하며, 실제 시장의 급등·급락·횡보 구간을 반영하지 않습니다. 계산 결과는 투자 결정의 참고 자료이며 투자 수익을 보장하지 않습니다. 가상자산 투자는 원금 손실 위험이 있으므로 본인의 투자 성향과 리스크 허용 범위 안에서 판단하세요.

### FAQ (8개)

```ts
export const CDCA_FAQ = [
  {
    question: "DCA가 코인 투자에 효과적인 이유는 무엇인가요?",
    answer: "코인 시장은 단기 가격 변동성이 매우 커서 '지금이 바닥인가 천장인가'를 맞추기 어렵습니다. DCA는 가격 예측 없이 꾸준히 매수함으로써 타이밍 리스크를 분산합니다. 가격이 내릴 때 더 많은 수량을 매수하게 되므로 장기적으로 평균 매수가가 낮아지는 효과가 있습니다. 다만, 가격이 지속적으로 하락하는 자산에서는 DCA로도 손실을 막을 수 없습니다.",
  },
  {
    question: "비트코인 DCA는 얼마를 얼마나 오래 해야 효과가 있나요?",
    answer: "적립 금액보다 기간이 더 중요합니다. 최소 1년 이상, 가능하면 2~4년의 장기 시각을 가져야 DCA 효과가 통계적으로 의미 있게 나타납니다. 월 5만 원이든 50만 원이든 꾸준히 지속하는 것이 핵심입니다. 단기(3~6개월) DCA는 시장 타이밍 운에 결과가 크게 좌우됩니다.",
  },
  {
    question: "코인 가격이 계속 오르면 DCA보다 한 번에 사는 게 낫지 않나요?",
    answer: "맞습니다. 가격이 꾸준히 우상향하는 구간에서는 처음에 한 번에 매수하는 일괄 매수(Lump Sum)가 평균 수익률이 더 높습니다. DCA의 강점은 가격이 하락 또는 횡보하는 구간에서 드러납니다. 미래 가격 방향을 알 수 없으므로 리스크를 낮추는 전략으로 DCA를 선택하는 것입니다.",
  },
  {
    question: "평균 매수가가 현재가보다 높으면 어떻게 해야 하나요?",
    answer: "현재 손실 구간에 있다는 의미입니다. 이 경우 선택지는 세 가지입니다. ① 현재 가격에서 추가 적립을 계속해 평균 매수가를 낮추는 전략(물타기) ② 현재 손실을 감수하고 매도 ③ 장기 회복을 기다리며 보유. 어떤 선택이 맞는지는 해당 코인의 장기 전망과 본인의 투자 목적에 따라 달라지며, 이 계산기는 어떤 선택을 권유하지 않습니다.",
  },
  {
    question: "수수료는 계산에 포함되나요?",
    answer: "이 계산기는 수수료를 포함하지 않습니다. 거래소 수수료(업비트 0.05%, 빗썸 0.04% 등)가 매달 적용되면 실제 매수 수량은 계산값보다 소폭 줄어듭니다. 장기 적립에서 수수료가 수익률에 미치는 영향은 적지 않으므로 수수료가 낮은 거래소를 이용하는 것이 유리합니다.",
  },
  {
    question: "코인 DCA 수익에 세금이 붙나요?",
    answer: "네. 가상자산 양도차익에 대해 연간 250만 원 초과분은 22%의 세율(지방세 포함)로 과세됩니다. 이 계산기의 수익률은 세금 전 수치입니다. 실제 매도 후 손에 남는 금액을 계산하려면 코인 세금 계산기를 함께 활용하세요.",
  },
  {
    question: "이더리움 같은 알트코인에도 DCA가 효과적인가요?",
    answer: "원칙적으로는 동일하게 적용됩니다. 단, 알트코인은 비트코인보다 변동성이 더 크고, 프로젝트 자체가 실패할 리스크도 있습니다. 검증되지 않은 소형 알트코인에 DCA를 적용하면 가격 회복 없이 지속 하락할 수 있습니다. 시가총액이 크고 오랜 기간 검증된 자산(BTC, ETH 등)에 DCA를 적용하는 것이 상대적으로 안전합니다.",
  },
  {
    question: "DCA를 시작하기에 좋은 시점이 따로 있나요?",
    answer: "DCA의 핵심은 타이밍을 신경 쓰지 않는 것입니다. '언제가 좋은 시점인가'를 고민하는 것 자체가 DCA의 원칙에 어긋납니다. 다만 시장이 급등한 직후보다 횡보·하락 국면에서 시작하면 초기 평균 매수가 형성에 유리합니다. 가장 중요한 것은 '지금 당장 시작하고 꾸준히 유지하는 것'입니다.",
  },
];
```

---

## 15. 관련 링크

- `/reports/coin-exchange-comparison-2026/` — 코인 거래소 수수료 비교
- `/tools/coin-tax-calculator/` — 가상자산 양도소득세 계산기
- `/tools/dca-investment-calculator/` — 적립식 투자 수익 비교 계산기 (주식)
- `/reports/bitcoin-gold-sp500-10year-comparison-2026/` — 비트코인·금·S&P500 10년 비교
- `/tools/stock-breakeven-calculator/` — 주식·코인 손익분기점 계산기

---

## 16. QA 체크리스트

- [ ] 월 적립액 0 입력 시 NaN 미노출, "1,000원 이상 입력하세요" 안내
- [ ] 기간 0 입력 시 계산 불가 안내
- [ ] 현재가 0 입력 시 오류 처리
- [ ] 시작가 미입력 시 수익률 0%, "시작가를 입력하면 수익률이 계산됩니다" 안내
- [ ] 시작가 > 현재가 (손실 구간) 시 음수 수익률 정상 표시
- [ ] 시나리오 표 5행 (±30%, ±10%, 현재) 정상 계산 + 현재 행 하이라이트
- [ ] 수익률 양수: 그린, 음수: 레드 (텍스트 라벨 병기)
- [ ] 프리셋 클릭 시 모든 입력값 즉시 갱신 + 결과 재계산
- [ ] URL 파라미터 복원 정상 동작
- [ ] 투자 조언 면책 문구 InfoNotice에 명확히 표시
- [ ] 모바일 360px에서 KPI 카드 2열, 표 가로 스크롤 정상
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
