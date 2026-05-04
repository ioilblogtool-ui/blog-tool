# 주식 손익분기점 계산기 – 웹 콘텐츠 기획서 v1

## 1. 기본 정보

| 항목       | 내용                                    |
| -------- | ------------------------------------- |
| Title    | 주식 손익분기점 계산기                          |
| Type     | calculator                            |
| Category | 주식/코인                                 |
| Keyword  | 주식 손익분기점 계산 수수료 세금                    |
| Path     | `/tools/stock-breakeven-calculator/`  |
| Target   | 국내주식·미국주식 개인투자자                       |
| 핵심 질문    | “지금 팔면 실제로 얼마 남지?”                    |
| 주요 기능    | 세금·수수료 포함 손익분기 매도가 계산, 현재가 기준 실현손익 계산 |

---

## 2. 콘텐츠 핵심 컨셉

> **매수단가만 보고 판단하지 말고, 세금·수수료·환율까지 포함한 ‘진짜 본전 가격’을 계산하는 도구**

개인투자자는 보통 `평균단가 < 현재가`이면 수익이라고 생각하지만, 실제 매도 시에는 다음 비용이 빠집니다.

| 구분     |                        국내주식 |           미국주식 |
| ------ | --------------------------: | -------------: |
| 매수 수수료 |                          있음 |             있음 |
| 매도 수수료 |                          있음 |             있음 |
| 증권거래세  |                          있음 |             없음 |
| 양도소득세  | 일반 소액주주는 보통 제외, 대주주 등 과세 가능 | 연간 손익 기준 과세 가능 |
| 환율 영향  |                          없음 |             있음 |
| 환전 수수료 |                          없음 |             있음 |

2026년 기준 국내 코스피·코스닥 증권거래세는 농어촌특별세 포함 총 0.20% 수준으로 안내되고 있으며, 대주주 양도소득세 대상 여부는 지분율·시가총액 기준에 따라 달라질 수 있습니다. 해외주식은 일반 투자자도 연간 양도차익에서 기본공제 250만 원을 초과하면 양도소득세 과세 대상이 될 수 있습니다. ([미래에셋 투자연금][1])

---

## 3. 사용자 니즈

| 사용자 상황         | 검색 의도             | 계산기 제공 가치             |
| -------------- | ----------------- | --------------------- |
| 국내주식 단타/스윙 투자자 | “몇 원에 팔아야 본전이지?”  | 거래세·수수료 포함 본전가 계산     |
| 장기투자자          | “수익률이 실제로 몇 %지?”  | 세후 실현손익 확인            |
| 미국주식 투자자       | “달러로는 수익인데 원화로는?” | 환율 반영 원화 손익 계산        |
| 레버리지 ETF 투자자   | “수수료까지 빼면 얼마 남지?” | 매도 전 실현손익 시뮬레이션       |
| 블로그/커뮤니티 유입자   | “주식 손익분기점 공식”     | 계산식 + 예시 제공으로 체류시간 증가 |

---

## 4. 입력값 설계

## 4-1. 공통 입력값

| 입력 항목         | 타입     |         기본값 | 설명            |
| ------------- | ------ | ----------: | ------------- |
| 시장 구분         | 탭      | 국내주식 / 미국주식 | 계산 로직 분기      |
| 매수 평균단가       | number |           - | 1주당 평균 매수가    |
| 보유 수량         | number |           - | 보유 주식 수       |
| 현재가 또는 예상 매도가 | number |           - | 실현손익 계산용      |
| 매수 수수료율       | number |   0.015% 예시 | 증권사별 수정 가능    |
| 매도 수수료율       | number |   0.015% 예시 | 증권사별 수정 가능    |
| 세금 적용 여부      | toggle |          ON | 거래세·양도세 반영 여부 |

---

## 4-2. 국내주식 전용 입력값

| 입력 항목       | 타입     |    기본값 | 설명              |
| ----------- | ------ | -----: | --------------- |
| 시장          | select |    코스피 | 코스피 / 코스닥 / 코넥스 |
| 증권거래세율      | number |  0.20% | 관리형 상수로 제공      |
| 양도소득세 적용 여부 | toggle |    OFF | 일반 소액주주는 보통 OFF |
| 양도세율        | number | 22% 예시 | 필요 시 직접 입력      |
| 기본공제 반영     | toggle |    OFF | 고액 투자자/대주주 계산용  |

국내주식은 일반적인 장내 상장주식 소액투자자의 경우 양도소득세가 적용되지 않는 경우가 많지만, 대주주 요건 등 예외가 있습니다. 따라서 계산기에서는 **“양도세 적용 여부”를 직접 선택**하도록 설계하는 것이 안전합니다. 국세청 자료 기준 주권상장법인의 대주주 요건은 시장별 지분율과 시가총액 기준으로 판단됩니다. ([NTS][2])

---

## 4-3. 미국주식 전용 입력값

| 입력 항목          | 타입     |        기본값 | 설명            |
| -------------- | ------ | ---------: | ------------- |
| 매수 환율          | number |          - | 원화 환산 매입금액 계산 |
| 매도 예상 환율       | number |          - | 원화 환산 매도금액 계산 |
| 환전 수수료율        | number |   0.0~1.0% | 증권사별 차이       |
| 해외주식 양도세 적용 여부 | toggle |         ON | 기본 ON 권장      |
| 연간 기본공제        | number | 2,500,000원 | 수정 가능         |
| 양도세율           | number |        22% | 지방소득세 포함 예시   |

해외주식은 연간 양도차익에서 기본공제 250만 원을 적용한 뒤 과세 여부가 판단됩니다. 국세청은 국내·국외주식 기본공제를 합산 연 250만 원으로 설명하고 있습니다. ([국세청][3])

---

# 5. 출력값 설계

## 5-1. 핵심 결과 카드

| 결과 항목       | 설명                       |
| ----------- | ------------------------ |
| 실제 손익분기 주가  | 세금·수수료 포함 본전 매도가         |
| 현재가 기준 실현손익 | 지금 매도 시 예상 이익/손실         |
| 세후 수익률      | 비용 차감 후 실제 수익률           |
| 총 매수금액      | 매수금액 + 매수 수수료            |
| 총 매도금액      | 매도금액 - 매도 수수료 - 세금       |
| 차감 비용 합계    | 수수료 + 거래세 + 양도세 + 환전비용   |
| 1주당 필요 상승폭  | 평균단가 대비 손익분기까지 필요한 금액    |
| 목표 수익률별 매도가 | 5%, 10%, 20%, 30% 수익 매도가 |

---

## 5-2. 국내주식 결과 예시

| 항목               |           값 |
| ---------------- | ----------: |
| 평균단가             |     50,000원 |
| 보유수량             |        100주 |
| 총 매수금액           |  5,000,000원 |
| 매수 수수료           |        750원 |
| 증권거래세            | 매도금액의 0.20% |
| 실제 손익분기 매도가      |   약 50,110원 |
| 현재가 52,000원 매도 시 | 약 +188,000원 |
| 세후 수익률           |    약 +3.76% |

---

## 5-3. 미국주식 결과 예시

| 항목         |               값 |
| ---------- | --------------: |
| 평균단가       |            $200 |
| 보유수량       |             20주 |
| 매수 환율      |          1,350원 |
| 매도 예상 환율   |          1,380원 |
| 현재가        |            $215 |
| 달러 기준 손익   |           +$300 |
| 원화 환산 손익   |      환율 반영 후 계산 |
| 양도세 예상액    | 연간 누적손익 입력 시 계산 |
| 최종 원화 실현손익 |  수수료·세금 차감 후 표시 |

---

# 6. 계산 로직

## 6-1. 국내주식 기본 공식

```txt
총 매수비용 = 매수평균단가 × 보유수량 + 매수수수료

매도수령액 = 예상매도가 × 보유수량
           - 매도수수료
           - 증권거래세
           - 양도소득세

실현손익 = 매도수령액 - 총 매수비용

세후 수익률 = 실현손익 / 총 매수비용 × 100
```

## 6-2. 국내주식 손익분기 매도가

```txt
손익분기 매도가 =
총 매수비용 / [보유수량 × (1 - 매도수수료율 - 증권거래세율)]
```

단, 양도소득세까지 반영할 경우 계산식이 복잡해지므로 v1에서는 다음 방식 추천:

| 방식   | 설명                      |
| ---- | ----------------------- |
| v1   | 거래세·수수료 기준 손익분기 계산      |
| v1.1 | 양도세 적용 여부 선택 후 예상 세금 차감 |
| v2   | 연간 누적손익 입력 기반 양도세 정밀 계산 |

---

## 6-3. 미국주식 기본 공식

```txt
원화 매수비용 =
매수평균단가(USD) × 보유수량 × 매수환율
+ 매수수수료
+ 환전수수료

원화 매도수령액 =
예상매도가(USD) × 보유수량 × 매도환율
- 매도수수료
- 환전수수료
- 예상 양도소득세

원화 실현손익 =
원화 매도수령액 - 원화 매수비용
```

---

# 7. UX 구성안

## 7-1. 페이지 상단

```txt
주식 손익분기점 계산기

매수 평균단가만 보고 수익이라고 판단하면 실제 수익과 다를 수 있습니다.
이 계산기는 국내주식·미국주식의 수수료, 세금, 환율을 반영해
실제 손익분기 주가와 매도 시 예상 실현손익을 계산합니다.
```

CTA 버튼:

| 버튼        | 기능           |
| --------- | ------------ |
| 국내주식 계산하기 | 국내주식 탭 이동    |
| 미국주식 계산하기 | 미국주식 탭 이동    |
| 목표 수익률 계산 | 목표가 계산 섹션 이동 |

---

## 7-2. 계산기 UI 구조

```txt
[탭]
국내주식 | 미국주식

[입력 영역]
- 평균단가
- 보유수량
- 현재가/예상 매도가
- 수수료율
- 세금 적용 여부

[결과 영역]
- 실제 손익분기 주가
- 지금 매도 시 실현손익
- 세후 수익률
- 총 비용 breakdown

[추가 분석]
- 목표 수익률별 매도가
- 수수료·세금 제외 vs 포함 비교
- 매도 전 체크리스트
```

---

# 8. 결과 화면 구성

## 8-1. 결과 카드 예시

```txt
실제 손익분기 주가
50,110원

평균단가 50,000원보다 약 110원 높게 팔아야
수수료와 거래세를 제외하고 본전입니다.
```

## 8-2. 손익 Breakdown

| 구분           |         금액 |
| ------------ | ---------: |
| 총 매수금액       | 5,000,000원 |
| 매수 수수료       |       750원 |
| 예상 매도금액      | 5,200,000원 |
| 매도 수수료       |       780원 |
| 증권거래세        |    10,400원 |
| 예상 세금/수수료 합계 |    11,930원 |
| 최종 실현손익      |  +188,070원 |

---

# 9. SEO 콘텐츠 섹션

## H1

```md
# 주식 손익분기점 계산기 – 수수료·세금 포함 실제 본전가 계산
```

## H2 구성

```md
## 주식 손익분기점이란?
## 평균단가와 실제 손익분기점이 다른 이유
## 국내주식 손익분기점 계산 방법
## 미국주식 손익분기점 계산 방법
## 증권거래세와 수수료가 수익률에 미치는 영향
## 미국주식은 환율까지 봐야 하는 이유
## 목표 수익률별 매도가는 어떻게 계산할까?
## 주식 매도 전 체크리스트
## 자주 묻는 질문
```

---

# 10. FAQ 설계

| 질문                         | 답변 요약                                        |
| -------------------------- | -------------------------------------------- |
| 평균단가보다 높게 팔았는데 왜 수익이 적나요?  | 수수료, 증권거래세, 환율, 양도세 등이 차감되기 때문입니다.           |
| 국내주식도 양도소득세가 있나요?          | 일반 소액투자자는 보통 과세되지 않지만, 대주주 등 일부는 과세될 수 있습니다. |
| 미국주식은 왜 환율을 입력해야 하나요?      | 달러 기준 수익과 원화 기준 수익이 달라질 수 있기 때문입니다.          |
| 손익분기점은 매수 수수료도 포함하나요?      | 포함하는 것이 실제 본전가 계산에 더 정확합니다.                  |
| 목표 수익률 10% 매도가는 어떻게 계산하나요? | 총 매수비용에 목표수익률과 매도 비용을 반영해 역산합니다.             |
| 배당금도 포함할 수 있나요?            | v2 기능으로 배당금 반영 손익분기 계산을 추가할 수 있습니다.          |

---

# 11. 내부 링크 전략

| 연결 페이지                                        | 연결 문구                 |
| --------------------------------------------- | --------------------- |
| `/tools/dca-investment-calculator/`           | 적립식 투자 수익률 계산하기       |
| `/reports/etf-vs-direct-stock-10year-2026/`   | ETF vs 직접투자 10년 수익 비교 |
| `/tools/retirement/`                          | 퇴직금 계산기               |
| `/reports/retirement-pension-dc-db-irp-2026/` | 퇴직연금 DC·DB·IRP 비교     |
| `/reports/ai-job-salary-impact-2026/`         | 직군별 AI 도입 전후 연봉 효과 비교 |

---

# 12. 애드센스 / 제휴 포인트

| 위치        | 광고/제휴 아이디어                 |
| --------- | -------------------------- |
| 계산기 입력 하단 | 증권사 계좌개설 CPA               |
| 결과 카드 하단  | 해외주식 수수료 이벤트 배너            |
| 미국주식 탭 하단 | 환전 우대 증권사 비교 CTA           |
| FAQ 하단    | ISA / 연금저축 / IRP 관련 금융 콘텐츠 |
| 목표 수익률 섹션 | ETF 장기투자 리포트 내부 링크         |

주의할 점: 금융상품 제휴는 “수익 보장” 표현을 피하고, 계산 결과는 참고용이라는 고지를 반드시 넣는 것이 좋습니다.

---

# 13. 개발 구현 메모

## 13-1. TypeScript 계산 타입 예시

```ts
type MarketType = 'KR' | 'US';

type StockBreakevenInput = {
  marketType: MarketType;
  avgBuyPrice: number;
  quantity: number;
  currentPrice: number;
  buyFeeRate: number;
  sellFeeRate: number;
  transactionTaxRate?: number;
  capitalGainsTaxRate?: number;
  applyCapitalGainsTax?: boolean;

  // US only
  buyFxRate?: number;
  sellFxRate?: number;
  fxFeeRate?: number;
  annualProfitKrw?: number;
  basicDeductionKrw?: number;
};

type StockBreakevenResult = {
  totalBuyCost: number;
  expectedSellAmount: number;
  totalFeesAndTaxes: number;
  realizedProfit: number;
  realizedReturnRate: number;
  breakevenPrice: number;
};
```

---

## 13-2. 국내주식 계산 함수 예시

```ts
export function calculateKrStockBreakeven(input: StockBreakevenInput): StockBreakevenResult {
  const {
    avgBuyPrice,
    quantity,
    currentPrice,
    buyFeeRate,
    sellFeeRate,
    transactionTaxRate = 0.002,
  } = input;

  const grossBuyAmount = avgBuyPrice * quantity;
  const buyFee = grossBuyAmount * buyFeeRate;
  const totalBuyCost = grossBuyAmount + buyFee;

  const grossSellAmount = currentPrice * quantity;
  const sellFee = grossSellAmount * sellFeeRate;
  const transactionTax = grossSellAmount * transactionTaxRate;

  const expectedSellAmount = grossSellAmount - sellFee - transactionTax;
  const totalFeesAndTaxes = buyFee + sellFee + transactionTax;
  const realizedProfit = expectedSellAmount - totalBuyCost;
  const realizedReturnRate = (realizedProfit / totalBuyCost) * 100;

  const breakevenPrice =
    totalBuyCost / (quantity * (1 - sellFeeRate - transactionTaxRate));

  return {
    totalBuyCost,
    expectedSellAmount,
    totalFeesAndTaxes,
    realizedProfit,
    realizedReturnRate,
    breakevenPrice,
  };
}
```

---

## 13-3. 미국주식 계산 함수 예시

```ts
export function calculateUsStockBreakeven(input: StockBreakevenInput): StockBreakevenResult {
  const {
    avgBuyPrice,
    quantity,
    currentPrice,
    buyFeeRate,
    sellFeeRate,
    buyFxRate = 1350,
    sellFxRate = 1350,
    fxFeeRate = 0,
    applyCapitalGainsTax = true,
    capitalGainsTaxRate = 0.22,
    annualProfitKrw = 0,
    basicDeductionKrw = 2_500_000,
  } = input;

  const grossBuyUsd = avgBuyPrice * quantity;
  const buyFeeUsd = grossBuyUsd * buyFeeRate;
  const buyFxFeeKrw = grossBuyUsd * buyFxRate * fxFeeRate;
  const totalBuyCost = (grossBuyUsd + buyFeeUsd) * buyFxRate + buyFxFeeKrw;

  const grossSellUsd = currentPrice * quantity;
  const sellFeeUsd = grossSellUsd * sellFeeRate;
  const sellFxFeeKrw = grossSellUsd * sellFxRate * fxFeeRate;

  const sellAmountBeforeTaxKrw =
    (grossSellUsd - sellFeeUsd) * sellFxRate - sellFxFeeKrw;

  const profitBeforeTax = sellAmountBeforeTaxKrw - totalBuyCost;

  const taxableProfit = Math.max(
    0,
    annualProfitKrw + profitBeforeTax - basicDeductionKrw
  );

  const capitalGainsTax = applyCapitalGainsTax
    ? taxableProfit * capitalGainsTaxRate
    : 0;

  const expectedSellAmount = sellAmountBeforeTaxKrw - capitalGainsTax;
  const realizedProfit = expectedSellAmount - totalBuyCost;
  const realizedReturnRate = (realizedProfit / totalBuyCost) * 100;

  const totalFeesAndTaxes =
    buyFeeUsd * buyFxRate +
    sellFeeUsd * sellFxRate +
    buyFxFeeKrw +
    sellFxFeeKrw +
    capitalGainsTax;

  const breakevenPrice =
    totalBuyCost / (quantity * sellFxRate * (1 - sellFeeRate - fxFeeRate));

  return {
    totalBuyCost,
    expectedSellAmount,
    totalFeesAndTaxes,
    realizedProfit,
    realizedReturnRate,
    breakevenPrice,
  };
}
```

---

# 14. 고지 문구

```md
본 계산기는 입력값을 기준으로 한 단순 예상 계산 결과입니다.
실제 세금, 수수료, 환율, 환전 수수료, 양도소득세 적용 여부는 증권사·거래시장·투자자 상황에 따라 달라질 수 있습니다.
세무 신고가 필요한 경우 국세청 또는 세무 전문가의 확인을 권장합니다.
```

---

# 15. 최종 MD 기획서 복붙용

```md
# 주식 손익분기점 계산기

## 기본 정보

- Title: 주식 손익분기점 계산기
- Type: calculator
- Category: 주식/코인
- Keyword: 주식 손익분기점 계산 수수료 세금
- Path: /tools/stock-breakeven-calculator/

## 기획 의도

주식 투자자는 평균단가와 현재가만 보고 수익 여부를 판단하는 경우가 많다. 하지만 실제 매도 시에는 증권사 수수료, 증권거래세, 양도소득세, 환율, 환전 수수료 등이 반영되기 때문에 단순 계산과 실제 실현손익이 달라진다.

이 계산기는 국내주식과 미국주식을 구분해 세금·수수료·환율을 반영한 실제 손익분기 매도가와 현재가 기준 실현손익을 계산한다.

## 주요 입력값

### 공통

- 매수 평균단가
- 보유 수량
- 현재가 또는 예상 매도가
- 매수 수수료율
- 매도 수수료율
- 세금 적용 여부

### 국내주식

- 시장 구분: 코스피 / 코스닥 / 코넥스
- 증권거래세율
- 양도소득세 적용 여부
- 양도세율

### 미국주식

- 매수 환율
- 매도 예상 환율
- 환전 수수료율
- 해외주식 양도세 적용 여부
- 연간 기본공제
- 양도세율

## 주요 출력값

- 실제 손익분기 주가
- 현재가 기준 실현손익
- 세후 수익률
- 총 매수금액
- 총 매도금액
- 세금·수수료 합계
- 목표 수익률별 매도가
- 달러 기준 손익
- 원화 환산 손익

## 계산 로직

### 국내주식

총 매수비용 = 매수평균단가 × 보유수량 + 매수수수료

매도수령액 = 예상매도가 × 보유수량 - 매도수수료 - 증권거래세 - 양도소득세

실현손익 = 매도수령액 - 총 매수비용

세후 수익률 = 실현손익 / 총 매수비용 × 100

### 미국주식

원화 매수비용 = 매수평균단가(USD) × 보유수량 × 매수환율 + 매수수수료 + 환전수수료

원화 매도수령액 = 예상매도가(USD) × 보유수량 × 매도환율 - 매도수수료 - 환전수수료 - 예상 양도소득세

원화 실현손익 = 원화 매도수령액 - 원화 매수비용

## 화면 구성

1. 상단 설명 영역
2. 국내주식 / 미국주식 탭
3. 입력 폼
4. 결과 카드
5. 세금·수수료 breakdown
6. 목표 수익률별 매도가 표
7. 주식 매도 전 체크리스트
8. FAQ
9. 관련 계산기/리포트 내부 링크

## SEO 섹션

- 주식 손익분기점이란?
- 평균단가와 실제 손익분기점이 다른 이유
- 국내주식 손익분기점 계산 방법
- 미국주식 손익분기점 계산 방법
- 증권거래세와 수수료가 수익률에 미치는 영향
- 미국주식은 환율까지 봐야 하는 이유
- 목표 수익률별 매도가는 어떻게 계산할까?
- 주식 매도 전 체크리스트
- 자주 묻는 질문

## FAQ

### 평균단가보다 높게 팔았는데 왜 수익이 적나요?

매도 시 증권사 수수료, 증권거래세, 환전 수수료, 양도소득세 등이 차감되기 때문이다.

### 국내주식도 양도소득세가 있나요?

일반 소액투자자는 보통 과세되지 않지만, 대주주 요건 등에 해당하면 양도소득세가 발생할 수 있다.

### 미국주식은 왜 환율을 입력해야 하나요?

달러 기준으로는 수익이어도 원화 환산 기준으로는 환율 변동에 따라 수익률이 달라질 수 있기 때문이다.

### 손익분기점은 매수 수수료도 포함하나요?

실제 본전가를 계산하려면 매수 수수료와 매도 수수료를 모두 포함하는 것이 적절하다.

## 고지 문구

본 계산기는 입력값을 기준으로 한 단순 예상 계산 결과입니다. 실제 세금, 수수료, 환율, 환전 수수료, 양도소득세 적용 여부는 증권사·거래시장·투자자 상황에 따라 달라질 수 있습니다. 세무 신고가 필요한 경우 국세청 또는 세무 전문가의 확인을 권장합니다.
```

---

## 우선순위 추천

| 버전   | 구현 범위                  | 추천도 |
| ---- | ---------------------- | --: |
| v1   | 국내주식 + 미국주식 기본 손익분기 계산 |  높음 |
| v1.1 | 목표 수익률별 매도가 표 추가       |  높음 |
| v1.2 | 세금·수수료 breakdown 시각화   |  높음 |
| v2   | 연간 해외주식 누적손익 기반 양도세 계산 |  중간 |
| v2.1 | 배당금 포함 손익분기점 계산        |  중간 |
| v3   | 포트폴리오 다종목 일괄 계산        |  높음 |

**추천 구현 순서:**
`v1 기본 계산기 → 목표 수익률 표 → 미국주식 환율 계산 → 해외주식 양도세 고도화 → 포트폴리오 일괄 계산기` 순서가 가장 좋습니다.

[1]: https://investpension.miraeasset.com/m/contents/view.do?idx=25311&utm_source=chatgpt.com "2026년 확인해야 할 개정 세법 - 미래에셋투자와연금센터"
[2]: https://s.nts.go.kr/asan/na/ntt/selectNttInfo.do?mi=2201&nttSn=1348384&utm_source=chatgpt.com "주식 양도소득세 예정신고 기한은 3.3.입니다"
[3]: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=8800&mi=12274&utm_source=chatgpt.com "주식등 양도소득세"
