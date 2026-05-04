# 비교계산소용 최종 MD 웹기획서 v1

## 1. 콘텐츠 기본 정보

| 항목       | 내용                                            |
| -------- | --------------------------------------------- |
| Title    | 미국주식 환차손익 계산기                                 |
| Type     | calculator                                    |
| Category | 주식/코인                                         |
| Keyword  | 미국주식 환차손 계산 달러 원화 수익률                         |
| URL Path | `/tools/us-stock-exchange-profit-calculator/` |
| 핵심 타깃    | 미국주식 투자자, 서학개미, 달러 환전 투자자, 장기 ETF 투자자         |
| 핵심 니즈    | “달러 기준 수익률은 플러스인데 원화 기준으로는 실제 얼마 벌었나?”        |
| 확장 콘텐츠   | 미국주식 세금 계산기, 양도소득세 계산기, 환율별 매도 시뮬레이터          |

---

# 2. 콘텐츠 한 줄 정의

> 미국주식 매수·매도 시점의 **주가 변화 + 환율 변화**를 함께 반영해, 달러 기준 수익률과 실제 원화 기준 수익률의 차이를 계산하는 도구.

---

# 3. 사용자 문제 정의

미국주식 투자자는 보통 수익률을 이렇게 봅니다.

```text
테슬라 주가 +30%
엔비디아 주가 +50%
S&P500 ETF +20%
```

하지만 실제 원화 수익률은 아래 요소 때문에 달라집니다.

| 구분       | 영향                    |
| -------- | --------------------- |
| 주가 상승/하락 | 달러 기준 투자 수익률          |
| 매수 시점 환율 | 원화 투입금 결정             |
| 매도 시점 환율 | 원화 회수금 결정             |
| 환율 하락    | 달러 수익을 원화로 바꿀 때 수익 감소 |
| 환율 상승    | 주가 수익 외 추가 환차익 발생     |

즉, 이 계산기의 핵심 메시지는 다음입니다.

> “미국주식 수익률은 달러 기준과 원화 기준을 따로 봐야 한다.”

---

# 4. 입력값 설계

## 4.1 기본 입력값

| 입력값      |       타입 |      예시 | 설명                        |
| -------- | -------: | ------: | ------------------------- |
| 매수 시점 환율 |   number |  1,400원 | 달러 매수 또는 주식 매수 시점 원/달러 환율 |
| 매도 시점 환율 |   number |  1,200원 | 주식 매도 후 원화 환산 시점 환율       |
| 매수 주가    |   number |   200달러 | 1주당 매수 가격                 |
| 매도 주가    |   number |   260달러 | 1주당 매도 가격                 |
| 매수 수량    |   number |     10주 | 보유 주식 수량                  |
| 매수 총액    |     auto | 2,000달러 | 매수 주가 × 수량                |
| 수수료율     | optional |   0.07% | 증권사 매수·매도 수수료             |
| 세금 반영 여부 |   toggle |  포함/미포함 | 양도소득세 계산기와 연결 가능          |

---

## 4.2 간편 입력 모드

초보자는 주가·수량보다 “총 투자금” 기준이 편합니다.

| 입력값       |       예시 |
| --------- | -------: |
| 원화 투자금    | 1,000만 원 |
| 매수 환율     |   1,400원 |
| 매도 환율     |   1,200원 |
| 달러 기준 수익률 |     +30% |

이 모드에서는 아래처럼 계산합니다.

```text
매수 달러 금액 = 원화 투자금 ÷ 매수 환율
매도 달러 금액 = 매수 달러 금액 × (1 + 달러 수익률)
원화 회수금 = 매도 달러 금액 × 매도 환율
실제 원화 수익률 = (원화 회수금 - 원화 투자금) ÷ 원화 투자금 × 100
```

---

# 5. 출력값 설계

## 5.1 결과 요약 카드

| 결과 카드      | 설명                     |
| ---------- | ---------------------- |
| 달러 기준 수익률  | 주가만 반영한 수익률            |
| 달러 기준 평가손익 | USD 기준 수익금             |
| 원화 투자금     | 매수 시 환율 기준 원화 투입금      |
| 원화 회수금     | 매도 시 환율 기준 원화 환산금      |
| 실제 원화 수익률  | 환율까지 반영한 최종 수익률        |
| 환차손익       | 환율 변화로 발생한 원화 손익       |
| 환율 영향 비중   | 전체 손익 중 환율 영향이 차지하는 비율 |

---

## 5.2 결과 예시

### 예시 조건

| 항목    |      값 |
| ----- | -----: |
| 매수 환율 | 1,400원 |
| 매도 환율 | 1,200원 |
| 매수 주가 |  200달러 |
| 매도 주가 |  260달러 |
| 수량    |    10주 |

### 계산 결과

| 항목        |        계산값 |
| --------- | ---------: |
| 매수 달러 총액  |    2,000달러 |
| 매도 달러 총액  |    2,600달러 |
| 달러 기준 수익률 |     +30.0% |
| 원화 투자금    | 2,800,000원 |
| 원화 회수금    | 3,120,000원 |
| 실제 원화 수익률 |    +11.43% |
| 달러 기준 수익금 |     +600달러 |
| 원화 기준 수익금 |  +320,000원 |

### 사용자에게 보여줄 해석 문구

```text
주가는 달러 기준으로 30% 상승했지만,
매수 환율 1,400원 → 매도 환율 1,200원으로 하락하면서
실제 원화 수익률은 약 11.43%로 줄어들었습니다.
```

---

# 6. 계산 로직

## 6.1 기본 계산식

```text
매수 달러 총액 = 매수 주가 × 수량
매도 달러 총액 = 매도 주가 × 수량

달러 기준 수익률 =
(매도 주가 - 매수 주가) ÷ 매수 주가 × 100

원화 투자금 =
매수 달러 총액 × 매수 환율

원화 회수금 =
매도 달러 총액 × 매도 환율

실제 원화 수익률 =
(원화 회수금 - 원화 투자금) ÷ 원화 투자금 × 100

환차손익 =
원화 회수금 - (매도 달러 총액 × 매수 환율)

전체 원화 손익 =
원화 회수금 - 원화 투자금
```

---

## 6.2 환율 영향 비중 계산

```text
환율 영향 비중 =
환차손익 ÷ 전체 원화 손익 × 100
```

단, 전체 원화 손익이 0이거나 음수일 경우에는 별도 문구 처리 필요합니다.

```text
전체 손익이 0원 이하인 경우 환율 영향 비중은 참고 지표로만 표시합니다.
```

---

# 7. 환율 구간별 시뮬레이션

이 계산기의 체류시간을 늘리는 핵심 기능입니다.

## 7.1 시뮬레이션 테이블

|  매도 환율 | 원화 회수금 | 원화 손익 | 원화 수익률 |
| -----: | -----: | ----: | -----: |
| 1,100원 |     계산 |    계산 |     계산 |
| 1,200원 |     계산 |    계산 |     계산 |
| 1,300원 |     계산 |    계산 |     계산 |
| 1,400원 |     계산 |    계산 |     계산 |
| 1,500원 |     계산 |    계산 |     계산 |

---

## 7.2 시뮬레이션 메시지 예시

```text
현재 주가 기준으로 매도한다고 가정할 때,
환율이 1,200원이면 원화 수익률은 11.43%,
환율이 1,400원이면 원화 수익률은 30.00%,
환율이 1,500원이면 원화 수익률은 39.29%입니다.
```

---

# 8. 화면 구성 IA

## H1

```markdown
# 미국주식 환차손익 계산기 – 달러 수익률과 원화 수익률 차이 계산
```

---

## Section 1. Hero

```markdown
미국주식은 주가가 올라도 환율이 떨어지면 실제 원화 수익률이 줄어들 수 있습니다.
매수 환율, 매도 환율, 매수·매도 주가를 입력하면 달러 기준 수익률과 원화 기준 실제 수익률을 계산해드립니다.
```

CTA:

```text
미국주식 환차손익 계산하기
환율별 수익률 시뮬레이션 보기
달러 기준 vs 원화 기준 비교하기
```

---

## Section 2. 계산기 입력 영역

| 입력 항목  |     예시 |
| ------ | -----: |
| 매수 환율  | 1,400원 |
| 매도 환율  | 1,200원 |
| 매수 주가  |  200달러 |
| 매도 주가  |  260달러 |
| 보유 수량  |    10주 |
| 수수료 반영 |     선택 |
| 세금 반영  |     선택 |

---

## Section 3. 결과 요약

| 결과        |               값 |
| --------- | --------------: |
| 달러 기준 수익률 |         +30.00% |
| 실제 원화 수익률 |         +11.43% |
| 원화 투자금    |      2,800,000원 |
| 원화 회수금    |      3,120,000원 |
| 최종 원화 손익  |       +320,000원 |
| 환율 영향     | 수익률 -18.57%p 감소 |

---

## Section 4. 환율 영향 분석

```markdown
## 왜 달러 수익률과 원화 수익률이 다를까?
```

| 구분     | 내용                   |
| ------ | -------------------- |
| 주가 효과  | 주식 자체 가격 상승/하락       |
| 환율 효과  | 달러를 원화로 바꿀 때 발생하는 차이 |
| 최종 수익률 | 주가 효과와 환율 효과를 합산한 결과 |

---

## Section 5. 환율 구간별 시뮬레이션

```markdown
## 매도 환율이 달라지면 수익률은 어떻게 변할까?
```

|  매도 환율 | 실제 원화 수익률 | 원화 손익 |
| -----: | --------: | ----: |
| 1,100원 |        계산 |    계산 |
| 1,200원 |        계산 |    계산 |
| 1,300원 |        계산 |    계산 |
| 1,400원 |        계산 |    계산 |
| 1,500원 |        계산 |    계산 |

---

## Section 6. 실전 케이스

### Case 1. 주가는 올랐지만 환율 하락으로 수익률 감소

```text
매수 환율 1,400원
매도 환율 1,200원
주가 수익률 +30%

결과:
달러 기준 수익률은 +30%지만,
원화 기준 수익률은 약 +11.43%
```

---

### Case 2. 주가는 그대로인데 환율 상승으로 수익 발생

```text
매수 환율 1,200원
매도 환율 1,400원
주가 수익률 0%

결과:
달러 기준 수익률은 0%지만,
원화 기준 수익률은 약 +16.67%
```

---

### Case 3. 주가는 하락했지만 환율 상승으로 손실 축소

```text
매수 환율 1,200원
매도 환율 1,400원
주가 수익률 -10%

결과:
달러 기준으로는 손실이지만,
환율 상승으로 원화 기준 손실은 줄어들 수 있습니다.
```

---

# 9. SEO 설계

## 9.1 메타 타이틀

```text
미국주식 환차손익 계산기 | 달러 수익률·원화 수익률·환율 영향 계산
```

## 9.2 메타 디스크립션

```text
미국주식 매수 환율과 매도 환율을 입력하면 달러 기준 수익률, 실제 원화 수익률, 환차손익, 환율 영향 비중을 계산할 수 있습니다. 테슬라, 엔비디아, S&P500 ETF 투자자의 환율 착시를 쉽게 확인해보세요.
```

---

## 9.3 주요 키워드

| 우선순위 | 키워드            |
| ---: | -------------- |
|    1 | 미국주식 환차손 계산기   |
|    2 | 미국주식 원화 수익률 계산 |
|    3 | 달러 원화 수익률 계산   |
|    4 | 미국주식 환율 계산     |
|    5 | 환차손익 계산        |
|    6 | 미국주식 환율 영향     |
|    7 | 테슬라 환차손 계산     |
|    8 | 엔비디아 원화 수익률    |
|    9 | 미국 ETF 환율 수익률  |
|   10 | 달러 투자 수익률 계산   |

---

# 10. 내부링크 전략

| 연결 콘텐츠            | 연결 이유               |
| ----------------- | ------------------- |
| 주식 손익분기점 계산기      | 매도 전 실제 수익 계산 니즈 연결 |
| 미국주식 양도소득세 계산기    | 원화 수익 발생 후 세금 계산 연결 |
| 배당금 세후 계산기        | 미국 배당주 투자자 유입 연결    |
| ETF vs 직접투자 수익 비교 | 미국 ETF 장기투자 콘텐츠 연결  |
| 환율별 달러 투자 수익률 리포트 | 환율 시뮬레이션 심화 콘텐츠     |
| 코인 김치프리미엄 계산기     | 환율·가격 괴리 계산 관심층 연결  |

---

# 11. 확장 콘텐츠 후보

| Type       | Title                           | Path                                       |
| ---------- | ------------------------------- | ------------------------------------------ |
| calculator | 미국주식 양도소득세 계산기                  | `/tools/us-stock-capital-gains-tax/`       |
| calculator | 미국주식 배당금 세후 계산기                 | `/tools/us-stock-dividend-tax-calculator/` |
| calculator | 달러 환전 수익률 계산기                   | `/tools/usd-exchange-return-calculator/`   |
| report     | 환율 1,100원 vs 1,500원 미국주식 수익률 차이 | `/reports/us-stock-exchange-rate-impact/`  |
| report     | 미국주식 장기투자자가 환율을 봐야 하는 이유        | `/reports/us-stock-fx-risk-guide/`         |

---

# 12. 개발 구현 메모

## 12.1 TypeScript 타입 설계

```ts
type UsStockExchangeInput = {
  buyExchangeRate: number;
  sellExchangeRate: number;
  buyPriceUsd: number;
  sellPriceUsd: number;
  quantity: number;
  buyFeeRate?: number;
  sellFeeRate?: number;
  includeFee: boolean;
};

type UsStockExchangeResult = {
  buyAmountUsd: number;
  sellAmountUsd: number;

  buyAmountKrw: number;
  sellAmountKrw: number;

  stockProfitUsd: number;
  stockReturnRateUsd: number;

  totalProfitKrw: number;
  totalReturnRateKrw: number;

  fxProfitKrw: number;
  fxImpactRatePoint: number;
  fxImpactRatio: number | null;

  simulationRows: ExchangeRateSimulationRow[];
};

type ExchangeRateSimulationRow = {
  exchangeRate: number;
  sellAmountKrw: number;
  profitKrw: number;
  returnRateKrw: number;
};
```

---

## 12.2 계산 함수 예시

```ts
function calculateUsStockExchangeProfit(input: UsStockExchangeInput): UsStockExchangeResult {
  const {
    buyExchangeRate,
    sellExchangeRate,
    buyPriceUsd,
    sellPriceUsd,
    quantity,
    buyFeeRate = 0,
    sellFeeRate = 0,
    includeFee,
  } = input;

  const grossBuyAmountUsd = buyPriceUsd * quantity;
  const grossSellAmountUsd = sellPriceUsd * quantity;

  const buyFeeUsd = includeFee ? grossBuyAmountUsd * (buyFeeRate / 100) : 0;
  const sellFeeUsd = includeFee ? grossSellAmountUsd * (sellFeeRate / 100) : 0;

  const buyAmountUsd = grossBuyAmountUsd + buyFeeUsd;
  const sellAmountUsd = grossSellAmountUsd - sellFeeUsd;

  const buyAmountKrw = buyAmountUsd * buyExchangeRate;
  const sellAmountKrw = sellAmountUsd * sellExchangeRate;

  const stockProfitUsd = sellAmountUsd - buyAmountUsd;
  const stockReturnRateUsd = (stockProfitUsd / buyAmountUsd) * 100;

  const totalProfitKrw = sellAmountKrw - buyAmountKrw;
  const totalReturnRateKrw = (totalProfitKrw / buyAmountKrw) * 100;

  const sameExchangeSellAmountKrw = sellAmountUsd * buyExchangeRate;
  const fxProfitKrw = sellAmountKrw - sameExchangeSellAmountKrw;

  const fxImpactRatePoint = totalReturnRateKrw - stockReturnRateUsd;

  const fxImpactRatio =
    totalProfitKrw !== 0 ? (fxProfitKrw / totalProfitKrw) * 100 : null;

  const simulationRows = generateExchangeRateSimulation({
    buyAmountKrw,
    sellAmountUsd,
    minRate: 1100,
    maxRate: 1500,
    step: 50,
  });

  return {
    buyAmountUsd,
    sellAmountUsd,
    buyAmountKrw,
    sellAmountKrw,
    stockProfitUsd,
    stockReturnRateUsd,
    totalProfitKrw,
    totalReturnRateKrw,
    fxProfitKrw,
    fxImpactRatePoint,
    fxImpactRatio,
    simulationRows,
  };
}

function generateExchangeRateSimulation(params: {
  buyAmountKrw: number;
  sellAmountUsd: number;
  minRate: number;
  maxRate: number;
  step: number;
}): ExchangeRateSimulationRow[] {
  const rows: ExchangeRateSimulationRow[] = [];

  for (let rate = params.minRate; rate <= params.maxRate; rate += params.step) {
    const sellAmountKrw = params.sellAmountUsd * rate;
    const profitKrw = sellAmountKrw - params.buyAmountKrw;
    const returnRateKrw = (profitKrw / params.buyAmountKrw) * 100;

    rows.push({
      exchangeRate: rate,
      sellAmountKrw,
      profitKrw,
      returnRateKrw,
    });
  }

  return rows;
}
```

---

# 13. UI 컴포넌트 구조

```text
/tools/us-stock-exchange-profit-calculator/
├── UsStockExchangeCalculator
│   ├── InputForm
│   ├── ResultSummaryCards
│   ├── FxImpactExplanation
│   ├── ExchangeRateSimulationTable
│   ├── ScenarioExamples
│   ├── FaqSection
│   └── RelatedToolsSection
```

---

# 14. 결과 해석 문구 분기

| 조건                   | 노출 문구                                |
| -------------------- | ------------------------------------ |
| 달러 수익률 > 원화 수익률      | 환율 하락으로 실제 원화 수익률이 줄었습니다.            |
| 달러 수익률 < 원화 수익률      | 환율 상승으로 원화 기준 수익률이 더 높아졌습니다.         |
| 달러 수익률 양수, 원화 수익률 음수 | 주가는 올랐지만 환율 하락 때문에 원화 기준 손실이 발생했습니다. |
| 달러 수익률 음수, 원화 수익률 양수 | 주가는 하락했지만 환율 상승으로 원화 기준 수익이 발생했습니다.  |
| 두 수익률 거의 동일          | 환율 영향이 크지 않은 구간입니다.                  |

---

# 15. FAQ

## Q1. 미국주식 수익률은 달러 기준으로 봐야 하나요, 원화 기준으로 봐야 하나요?

둘 다 봐야 합니다.
주식 자체 성과는 달러 기준 수익률이고, 실제 한국 투자자의 체감 수익은 원화 기준 수익률입니다.

## Q2. 주가는 올랐는데 왜 원화 수익률은 낮아질 수 있나요?

매수할 때 환율이 높고 매도할 때 환율이 낮으면, 달러를 원화로 바꾸는 과정에서 환차손이 발생하기 때문입니다.

## Q3. 환차익에도 세금이 붙나요?

일반적인 미국주식 매매에서는 최종 양도차익 계산 과정에서 원화 환산 금액이 반영됩니다. 다만 세금 계산은 매수·매도일 기준 환율, 수수료, 기본공제, 손익통산 여부에 따라 달라질 수 있으므로 별도 양도소득세 계산기와 연결하는 것이 좋습니다.

## Q4. 배당금도 환율 영향을 받나요?

네. 미국주식 배당금은 달러로 지급되고 원화로 환산할 때 환율 영향을 받습니다. 배당 투자자라면 배당금 세후 계산기와 환율 계산기를 함께 보는 것이 좋습니다.

## Q5. 환율이 높을 때 미국주식을 사면 불리한가요?

무조건 불리하다고 볼 수는 없습니다. 주가 상승률이 환율 하락폭보다 크면 수익이 날 수 있습니다. 다만 고환율에 매수하면 이후 환율 하락 시 원화 수익률이 줄어드는 리스크가 있습니다.

---

# 16. 광고/제휴 배치 아이디어

| 위치          | 광고/제휴 주제         |
| ----------- | ---------------- |
| 계산기 상단      | 해외주식 수수료 우대 증권사  |
| 결과 카드 하단    | 미국주식 양도세 신고 서비스  |
| 환율 시뮬레이션 하단 | 달러 예금, 외화 RP     |
| FAQ 하단      | 해외주식 투자 가이드북     |
| 관련 계산기 영역   | 배당금 계산기, 양도세 계산기 |

---

# 17. 최종 추천 구현 방향

## MVP는 3단계로 가면 좋습니다.

| 단계 | 구현 내용                           | 우선순위 |
| -: | ------------------------------- | ---: |
|  1 | 매수환율·매도환율·매수주가·매도주가·수량 기반 기본 계산 |   최상 |
|  2 | 환율 구간별 시뮬레이션 테이블                |   최상 |
|  3 | 수수료 반영 옵션                       |    상 |
|  4 | 양도소득세 계산기 연결                    |    중 |
|  5 | 종목별 예시 템플릿: TSLA/NVDA/QQQ/SCHD  |    중 |
|  6 | 실시간 환율 자동 입력                    |    하 |
|  7 | 포트폴리오 전체 환차손익 계산                |   확장 |

---

# 18. 비교계산소 관점 핵심 포인트

이 계산기는 **미국주식 투자자에게 매우 반복성이 높은 도구**입니다.

| 강점           | 이유                           |
| ------------ | ---------------------------- |
| 반복 사용성 높음    | 환율과 주가가 계속 변함                |
| 검색 수요 명확     | 미국주식 수익률, 환차손, 원화 수익률 키워드 강함 |
| 투자자 체감 문제 해결 | “내가 실제로 번 돈”을 계산             |
| 내부링크 확장 쉬움   | 세금, 배당, ETF, 환율 콘텐츠와 연결 가능   |
| 수익화 가능성 높음   | 증권사, 세무, 투자 콘텐츠 광고와 궁합 좋음    |

**우선 구현 추천:**
`기본 계산기 + 환율 구간별 시뮬레이션 + 결과 해석 문구`까지 먼저 만들고, 이후 `미국주식 양도소득세 계산기`와 연결하면 투자 카테고리 내 체류시간을 크게 늘릴 수 있습니다.
