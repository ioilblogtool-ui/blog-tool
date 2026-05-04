# 비교계산소용 최종 MD 웹기획서 v1

## 1. 콘텐츠 개요

| 항목           | 내용                                               |
| ------------ | ------------------------------------------------ |
| Title        | 조기 은퇴 가능 나이 계산기                                  |
| Type         | calculator                                       |
| Category     | 투자/연금/노후                                         |
| Main Keyword | 조기은퇴 나이 계산                                       |
| Sub Keywords | 파이어족 은퇴시점, 은퇴 가능 나이, FIRE 계산기, 조기은퇴 계산기, 은퇴자금 계산 |
| Path         | `/tools/early-retirement-age/`                   |
| Target       | 30~50대 직장인, 맞벌이 부부, FIRE 관심자, 투자자, 월 현금흐름 관리층    |
| 핵심 가치        | “목표 은퇴자산”이 아니라 **몇 살에 은퇴 가능한지**를 바로 계산           |
| 차별화 포인트      | 파이어족 계산기보다 나이 중심, 시나리오 중심, 현실 저축률 중심             |

---

## 2. 콘텐츠 한 줄 정의

> 현재 나이, 월 소득, 월 지출, 현재 자산, 투자수익률, 은퇴 후 생활비를 입력하면 **몇 살에 조기 은퇴가 가능한지** 계산해주는 은퇴 시점 예측 도구.

---

## 3. 검색 의도 분석

| 검색어        | 사용자 의도           | 콘텐츠 대응              |
| ---------- | ---------------- | ------------------- |
| 조기은퇴 나이 계산 | 내가 언제 은퇴 가능한지 확인 | 은퇴 가능 예상 나이         |
| 파이어족 은퇴시점  | FIRE 가능 시점 확인    | 4% 룰 기반 은퇴자산 계산     |
| 은퇴자금 계산    | 필요한 은퇴자산 확인      | 필요 은퇴자산 산출          |
| 몇 살에 은퇴 가능 | 직관적인 결과 원함       | “만 48세 은퇴 가능” 결과 카드 |
| 저축률 은퇴 나이  | 저축률에 따른 은퇴 시점 비교 | 시나리오 3종 비교          |
| 파이어족 계산기   | FIRE 목표금액 계산     | 기존 계산기와 내부링크 연결     |

---

## 4. 핵심 메시지

```md
조기 은퇴는 단순히 연봉이 높은 사람보다
① 저축률이 높고
② 지출 통제가 가능하며
③ 투자수익률을 장기적으로 유지하고
④ 은퇴 후 생활비를 현실적으로 낮출 수 있는 사람에게 가까워집니다.
```

4% 룰은 은퇴 첫해에 포트폴리오의 4%를 인출하고 이후 물가상승률에 맞춰 인출액을 조정하는 방식으로 알려져 있습니다. 다만 장기 조기은퇴자는 은퇴 기간이 30년보다 길 수 있으므로 3.0~4.0% 범위의 보수적 인출률도 함께 제공하는 것이 좋습니다. Bengen의 연구와 Trinity Study 계열 연구는 지속가능 인출률 논의의 대표적 출발점으로 자주 인용됩니다. ([Financial Planning Association][1])

---

## 5. 페이지 상단 구성

## H1

```md
조기 은퇴 가능 나이 계산기
```

## Sub Copy

```md
현재 자산, 월 저축액, 투자수익률, 은퇴 후 생활비를 입력하면
내가 몇 살에 조기 은퇴할 수 있는지 계산해보세요.
```

## CTA

```md
내 은퇴 가능 나이 계산하기
```

---

# 6. 계산기 입력값 설계

## 6-1. 기본 입력값

| 입력 항목      | 타입     |         기본값 | 설명                      |
| ---------- | ------ | ----------: | ----------------------- |
| 현재 나이      | number |         35세 | 은퇴 가능 나이 계산 기준          |
| 월 순소득      | number |  4,500,000원 | 세후 월급 기준                |
| 월 지출       | number |  2,500,000원 | 생활비, 대출상환, 보험료 포함       |
| 현재 총자산     | number | 80,000,000원 | 예금, 주식, ETF, 연금, 현금성 자산 |
| 예상 연 투자수익률 | number |        5.0% | 명목 또는 실질 수익률 선택         |
| 은퇴 후 월 생활비 | number |  2,500,000원 | 은퇴 후 필요한 월 지출           |
| 안전 인출률     | select |        4.0% | 3.0%, 3.5%, 4.0%, 4.5%  |
| 연 소득 증가율   | number |          0% | 고급 옵션                   |
| 연 지출 증가율   | number |          0% | 고급 옵션                   |

---

## 6-2. 고급 입력값

| 입력 항목       | 타입     |   기본값 | 설명                   |
| ----------- | ------ | ----: | -------------------- |
| 국민연금 예상 수령액 | number |    0원 | 은퇴 후 월 생활비 차감 가능     |
| 개인연금 예상 수령액 | number |    0원 | 연금저축/IRP/퇴직연금        |
| 은퇴 후 부수입    | number |    0원 | 블로그, 배당, 임대, 프리랜서 수입 |
| 물가상승률       | number |  2.0% | 은퇴 후 생활비 보정          |
| 투자수익률 기준    | radio  | 실질수익률 | 명목/실질 선택             |
| 목표 안전마진     | number |   10% | 필요자산에 여유분 추가         |

---

# 7. 핵심 계산 로직

## 7-1. 월 저축액

```text
월 저축액 = 월 순소득 - 월 지출
```

## 7-2. 저축률

```text
저축률 = 월 저축액 ÷ 월 순소득 × 100
```

## 7-3. 은퇴 후 연 생활비

```text
은퇴 후 연 생활비 = 은퇴 후 월 생활비 × 12
```

## 7-4. 필요 은퇴자산

```text
필요 은퇴자산 = 은퇴 후 연 생활비 ÷ 안전 인출률
```

예를 들어 은퇴 후 월 생활비가 250만 원이고 안전 인출률을 4%로 두면 필요 은퇴자산은 7억 5,000만 원입니다.

| 항목         |           값 |
| ---------- | ----------: |
| 은퇴 후 월 생활비 |      250만 원 |
| 은퇴 후 연 생활비 |    3,000만 원 |
| 안전 인출률     |        4.0% |
| 필요 은퇴자산    | 7억 5,000만 원 |

---

## 7-5. 목표 자산까지 걸리는 기간

월 단위 복리 계산 기준:

```text
미래자산 =
현재자산 × (1 + 월수익률)^개월수
+ 월저축액 × {((1 + 월수익률)^개월수 - 1) ÷ 월수익률}
```

월수익률:

```text
월수익률 = (1 + 연수익률)^(1/12) - 1
```

계산기는 미래자산이 필요 은퇴자산 이상이 되는 최소 개월 수를 찾습니다.

---

# 8. 결과 출력 설계

## 8-1. 최상단 결과 카드

```md
현재 조건을 유지하면 만 48세에 조기 은퇴가 가능합니다.
```

| 결과 항목       |          예시 |
| ----------- | ----------: |
| 은퇴 가능 예상 나이 |       만 48세 |
| 은퇴까지 남은 기간  |     13년 2개월 |
| 필요 은퇴자산     | 7억 5,000만 원 |
| 예상 은퇴 시점 자산 | 7억 5,300만 원 |
| 현재 저축률      |       44.4% |
| 월 저축액       |      200만 원 |

---

## 8-2. 결과 문구 예시

### 은퇴 가능성이 높은 경우

```md
현재 저축률과 투자수익률을 유지하면 만 48세 전후에 조기 은퇴가 가능합니다.
은퇴 후 월 생활비 250만 원 기준으로 필요한 자산은 약 7억 5,000만 원이며,
현재 속도라면 약 13년 후 목표자산에 도달할 수 있습니다.
```

### 은퇴까지 오래 걸리는 경우

```md
현재 조건에서는 만 65세 이후에 목표 은퇴자산에 도달할 가능성이 높습니다.
조기 은퇴를 앞당기려면 월 지출 절감, 추가 소득 확보, 투자수익률 개선 중 최소 1가지가 필요합니다.
```

### 은퇴 불가능에 가까운 경우

```md
현재 월 저축액이 0원 이하라 목표 은퇴자산에 도달하기 어렵습니다.
먼저 고정비를 줄이거나 추가 현금흐름을 확보해 월 저축액을 플러스로 전환하는 것이 우선입니다.
```

---

# 9. 시나리오 3가지 비교

## 기본 시나리오

| 시나리오                   | 조건              | 은퇴 가능 나이 | 은퇴까지 기간 | 필요 행동       |
| ---------------------- | --------------- | -------: | ------: | ----------- |
| 현행 유지                  | 현재 소득·지출·수익률 유지 |      48세 |     13년 | 현재 속도 유지    |
| 지출 10% 절감              | 월 지출 10% 감소     |      46세 |     11년 | 고정비 절감      |
| 수익률 1%p 상승             | 연 수익률 5% → 6%   |      47세 |     12년 | 장기 투자 효율 개선 |
| 지출 10% 절감 + 수익률 1%p 상승 | 복합 개선           |      45세 |     10년 | FIRE 가속     |

## 시나리오 해석 문구

```md
지출을 10% 줄이면 은퇴 가능 나이가 약 2년 앞당겨지고,
연 투자수익률이 1%p 높아지면 약 1년 앞당겨집니다.
두 조건을 함께 개선하면 조기 은퇴 시점이 더 크게 빨라질 수 있습니다.
```

---

# 10. 그래프 시각화 구성

## 10-1. 자산 성장 곡선

| X축               | Y축     |
| ---------------- | ------ |
| 현재 나이 ~ 은퇴 가능 나이 | 예상 순자산 |

### 표시 요소

| 표시            | 설명         |
| ------------- | ---------- |
| 현재 자산선        | 시작점        |
| 목표 은퇴자산선      | 필요 은퇴자산    |
| 현행 유지 곡선      | 기본 시나리오    |
| 지출 10% 절감 곡선  | 절약 시나리오    |
| 수익률 1%p 상승 곡선 | 투자 개선 시나리오 |

---

## 10-2. 필요 은퇴자산 막대차트

|  인출률 |   필요 자산 |
| ---: | ------: |
| 3.0% |   10억 원 |
| 3.5% | 8.57억 원 |
| 4.0% |  7.5억 원 |
| 4.5% | 6.67억 원 |

### 해석

```md
안전 인출률을 낮게 잡을수록 필요한 은퇴자산은 커집니다.
특히 30대·40대 조기은퇴처럼 은퇴 기간이 길어질수록 4%보다 보수적인 3.0~3.5% 기준도 함께 확인하는 것이 좋습니다.
```

---

# 11. FIRE 단계 분류

## 11-1. 결과 등급

| 등급            | 조건                    | 설명          |
| ------------- | --------------------- | ----------- |
| Lean FIRE     | 은퇴 후 월 생활비 200만 원 이하  | 최소 지출형 조기은퇴 |
| Standard FIRE | 월 생활비 200만~400만 원     | 일반적 FIRE    |
| Fat FIRE      | 월 생활비 400만 원 이상       | 여유 생활형 FIRE |
| Coast FIRE    | 현재 자산이 장기 복리로 목표에 가까움 | 추가 저축 부담 낮음 |
| Barista FIRE  | 일부 근로소득 병행            | 완전 은퇴 전 단계  |

## 11-2. 결과 표시 예시

```md
현재 입력값 기준으로는 Standard FIRE에 가깝습니다.
완전한 은퇴보다는 월 100만 원 수준의 부수입을 유지하는 Barista FIRE 전략을 적용하면 은퇴 가능 나이가 더 앞당겨질 수 있습니다.
```

---

# 12. 파이어족 계산기와 차별화

| 구분     | 파이어족 계산기      | 조기 은퇴 가능 나이 계산기 |
| ------ | ------------- | --------------- |
| 중심 질문  | 얼마가 필요할까?     | 몇 살에 은퇴 가능할까?   |
| 핵심 출력  | 목표 은퇴자산       | 은퇴 가능 나이        |
| 사용자 행동 | 목표금액 확인       | 소득·지출·수익률 반복 조정 |
| 그래프    | 필요자산 중심       | 나이별 자산 성장 곡선    |
| 반복 방문성 | 중간            | 높음              |
| 대표 CTA | 목표 FIRE 금액 계산 | 은퇴 나이 앞당기기      |

---

# 13. 예시 시뮬레이션

## 입력값

| 항목         |        값 |
| ---------- | -------: |
| 현재 나이      |      35세 |
| 월 순소득      |   450만 원 |
| 월 지출       |   250만 원 |
| 월 저축액      |   200만 원 |
| 현재 총자산     | 8,000만 원 |
| 예상 투자수익률   |   연 5.0% |
| 은퇴 후 월 생활비 |   250만 원 |
| 안전 인출률     |     4.0% |

## 결과

| 항목          |           값 |
| ----------- | ----------: |
| 필요 은퇴자산     | 7억 5,000만 원 |
| 목표까지 부족한 금액 | 6억 7,000만 원 |
| 은퇴까지 예상 기간  |       약 13년 |
| 은퇴 가능 나이    |       만 48세 |
| 현재 저축률      |       44.4% |

---

# 14. SEO 본문 구성안

```md
# 조기 은퇴 가능 나이 계산기

## 1. 조기 은퇴 가능 나이는 어떻게 계산할까?
## 2. 4% 룰과 필요 은퇴자산 계산법
## 3. 월 저축액과 저축률이 은퇴 시점에 미치는 영향
## 4. 현재 자산이 많을수록 은퇴가 빨라지는 이유
## 5. 투자수익률 1%p 차이가 은퇴 나이에 미치는 영향
## 6. 지출 10% 절감으로 은퇴 시점 앞당기기
## 7. 은퇴 후 월 생활비별 필요 자산표
## 8. 30대·40대·50대 조기은퇴 전략 차이
## 9. FIRE 계산기와 조기은퇴 나이 계산기의 차이
## 10. 자주 묻는 질문
```

---

# 15. 은퇴 후 월 생활비별 필요 자산표

| 은퇴 후 월 생활비 |    연 생활비 | 4% 룰 기준 필요자산 | 3.5% 기준 필요자산 | 3.0% 기준 필요자산 |
| ---------: | -------: | -----------: | -----------: | -----------: |
|     150만 원 | 1,800만 원 |         4.5억 |        5.14억 |         6.0억 |
|     200만 원 | 2,400만 원 |         6.0억 |        6.86억 |         8.0억 |
|     250만 원 | 3,000만 원 |         7.5억 |        8.57억 |        10.0억 |
|     300만 원 | 3,600만 원 |         9.0억 |       10.29억 |        12.0억 |
|     400만 원 | 4,800만 원 |        12.0억 |       13.71억 |        16.0억 |
|     500만 원 | 6,000만 원 |        15.0억 |       17.14억 |        20.0억 |

---

# 16. 결과 해석 가이드

## 16-1. 저축률별 은퇴 속도

|    저축률 | 해석                  |
| -----: | ------------------- |
| 10% 미만 | 조기은퇴보다 재무 안정화 우선    |
| 10~30% | 일반 은퇴 준비 구간         |
| 30~50% | 조기은퇴 가능성이 생기는 구간    |
| 50~70% | FIRE 가속 구간          |
| 70% 이상 | 극단적 Lean FIRE 가능 구간 |

---

## 16-2. 현재 자산별 전략

|       현재 자산 | 전략               |
| ----------: | ---------------- |
|  0~3,000만 원 | 저축률 개선, 비상금 확보   |
| 3,000만~1억 원 | 월 적립 투자 루틴 만들기   |
|     1억~3억 원 | 복리 효과 본격화        |
|     3억~5억 원 | 은퇴 후 생활비 현실화     |
|       5억 이상 | 은퇴 시점·인출률·세금 최적화 |

---

# 17. FAQ 섹션

## Q1. 4% 룰만 믿고 은퇴해도 되나요?

4% 룰은 은퇴자산을 계산할 때 많이 쓰는 경험적 기준이지만, 모든 사람에게 보장되는 공식은 아닙니다. 특히 조기 은퇴자는 은퇴 기간이 길어질 수 있으므로 3.0~3.5% 기준도 함께 확인하는 것이 좋습니다.

## Q2. 투자수익률은 몇 %로 입력하는 게 좋나요?

보수적으로 계산하려면 물가상승률을 제외한 실질수익률 기준 3~5% 범위를 권장합니다. 공격적으로 계산하면 은퇴 가능 나이가 빨라 보일 수 있지만, 실제 시장 변동성은 반영되지 않을 수 있습니다.

## Q3. 국민연금도 반영해야 하나요?

가능하면 고급 옵션에서 반영하는 것이 좋습니다. 다만 조기 은퇴 시점과 국민연금 수령 시점 사이에 공백 기간이 생길 수 있으므로, 계산기에서는 “연금 수령 전 생활비”와 “연금 수령 후 생활비”를 분리하면 더 정확합니다.

## Q4. 부동산 자산도 현재 총자산에 포함해야 하나요?

실거주 주택처럼 바로 현금화하기 어려운 자산은 별도로 구분하는 것이 좋습니다. 은퇴 생활비를 충당할 수 있는 금융자산 중심으로 계산하면 더 보수적입니다.

## Q5. 월 배당 ETF 수익도 반영할 수 있나요?

가능합니다. 고급 옵션에서 은퇴 후 월 현금흐름에 배당, 임대수익, 부업수입을 입력하면 필요한 은퇴자산을 낮춰 계산할 수 있습니다.

---

# 18. UX 추천

| 기능              | 추천 여부 | 이유                 |
| --------------- | ----- | ------------------ |
| 은퇴 가능 나이 결과 카드  | 필수    | 사용자 체감이 가장 강함      |
| 자산 성장 그래프       | 필수    | 복리 효과 시각화          |
| 시나리오 3종 비교      | 필수    | 반복 입력 유도           |
| 인출률 선택          | 필수    | 3%, 3.5%, 4% 비교 가능 |
| 은퇴 후 월 생활비 슬라이더 | 추천    | 민감도 분석에 좋음         |
| 저축률 자동 표시       | 추천    | 행동 개선 유도           |
| 국민연금/개인연금 고급 옵션 | 추천    | 40~50대 사용자에게 유용    |
| 결과 공유하기         | 추천    | 커뮤니티 확산 가능         |
| CSV 다운로드        | 선택    | 일반 사용자에게는 우선순위 낮음  |

---

# 19. 개발 구현용 데이터 모델

```ts
export interface EarlyRetirementInput {
  currentAge: number;
  monthlyNetIncome: number;
  monthlyExpense: number;
  currentAssets: number;
  annualReturnRate: number;
  retirementMonthlyExpense: number;
  withdrawalRate: number;
  annualIncomeGrowthRate?: number;
  annualExpenseGrowthRate?: number;
  inflationRate?: number;
  expectedMonthlyPension?: number;
  expectedMonthlyPassiveIncome?: number;
  safetyMarginRate?: number;
}

export interface EarlyRetirementScenario {
  name: string;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySaving: number;
  annualReturnRate: number;
  requiredRetirementAssets: number;
  monthsToRetirement: number | null;
  retirementAge: number | null;
  finalAssets: number;
}

export interface EarlyRetirementResult {
  monthlySaving: number;
  savingRate: number;
  annualRetirementExpense: number;
  requiredRetirementAssets: number;
  gapToTargetAssets: number;
  monthsToRetirement: number | null;
  retirementAge: number | null;
  scenarios: EarlyRetirementScenario[];
}
```

---

# 20. 계산 함수 예시

```ts
export function calculateEarlyRetirement(input: EarlyRetirementInput): EarlyRetirementResult {
  const {
    currentAge,
    monthlyNetIncome,
    monthlyExpense,
    currentAssets,
    annualReturnRate,
    retirementMonthlyExpense,
    withdrawalRate,
    expectedMonthlyPension = 0,
    expectedMonthlyPassiveIncome = 0,
    safetyMarginRate = 0,
  } = input;

  const monthlySaving = monthlyNetIncome - monthlyExpense;
  const savingRate =
    monthlyNetIncome > 0 ? (monthlySaving / monthlyNetIncome) * 100 : 0;

  const netRetirementMonthlyExpense = Math.max(
    retirementMonthlyExpense - expectedMonthlyPension - expectedMonthlyPassiveIncome,
    0
  );

  const annualRetirementExpense = netRetirementMonthlyExpense * 12;

  const requiredRetirementAssets =
    (annualRetirementExpense / (withdrawalRate / 100)) *
    (1 + safetyMarginRate / 100);

  const monthsToRetirement = calculateMonthsToTargetAssets({
    currentAssets,
    monthlySaving,
    annualReturnRate,
    targetAssets: requiredRetirementAssets,
  });

  const retirementAge =
    monthsToRetirement === null
      ? null
      : currentAge + monthsToRetirement / 12;

  const scenarios = [
    createScenario('현행 유지', input),
    createScenario('지출 10% 절감', {
      ...input,
      monthlyExpense: monthlyExpense * 0.9,
    }),
    createScenario('수익률 1%p 상승', {
      ...input,
      annualReturnRate: annualReturnRate + 1,
    }),
  ];

  return {
    monthlySaving,
    savingRate,
    annualRetirementExpense,
    requiredRetirementAssets,
    gapToTargetAssets: Math.max(requiredRetirementAssets - currentAssets, 0),
    monthsToRetirement,
    retirementAge,
    scenarios,
  };
}

interface MonthsToTargetParams {
  currentAssets: number;
  monthlySaving: number;
  annualReturnRate: number;
  targetAssets: number;
}

function calculateMonthsToTargetAssets({
  currentAssets,
  monthlySaving,
  annualReturnRate,
  targetAssets,
}: MonthsToTargetParams): number | null {
  if (currentAssets >= targetAssets) return 0;

  const monthlyReturnRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;

  let assets = currentAssets;

  for (let month = 1; month <= 1200; month += 1) {
    assets = assets * (1 + monthlyReturnRate) + monthlySaving;

    if (assets >= targetAssets) {
      return month;
    }
  }

  return null;
}

function createScenario(
  name: string,
  input: EarlyRetirementInput
): EarlyRetirementScenario {
  const monthlySaving = input.monthlyNetIncome - input.monthlyExpense;

  const annualRetirementExpense =
    Math.max(
      input.retirementMonthlyExpense -
        (input.expectedMonthlyPension ?? 0) -
        (input.expectedMonthlyPassiveIncome ?? 0),
      0
    ) * 12;

  const requiredRetirementAssets =
    annualRetirementExpense / (input.withdrawalRate / 100);

  const monthsToRetirement = calculateMonthsToTargetAssets({
    currentAssets: input.currentAssets,
    monthlySaving,
    annualReturnRate: input.annualReturnRate,
    targetAssets: requiredRetirementAssets,
  });

  return {
    name,
    monthlyIncome: input.monthlyNetIncome,
    monthlyExpense: input.monthlyExpense,
    monthlySaving,
    annualReturnRate: input.annualReturnRate,
    requiredRetirementAssets,
    monthsToRetirement,
    retirementAge:
      monthsToRetirement === null
        ? null
        : input.currentAge + monthsToRetirement / 12,
    finalAssets: requiredRetirementAssets,
  };
}
```

---

# 21. Astro 파일 구성 예시

```txt
src/pages/tools/early-retirement-age.astro
src/components/tools/EarlyRetirementForm.astro
src/components/tools/EarlyRetirementResult.astro
src/components/tools/EarlyRetirementScenarioTable.astro
src/components/tools/EarlyRetirementChart.astro
src/lib/calculators/earlyRetirement.ts
src/data/early-retirement-presets.ts
```

---

# 22. JSON-LD 구조화 데이터

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "조기 은퇴 가능 나이 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "현재 나이, 월 순소득, 월 지출, 현재 자산, 투자수익률, 은퇴 후 생활비를 입력해 조기 은퇴 가능 나이를 계산하는 도구입니다.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  }
}
```

---

# 23. 내부링크 추천

| 연결 콘텐츠                                        | 앵커 텍스트               | 연결 이유             |
| --------------------------------------------- | -------------------- | ----------------- |
| `/tools/fire-calculator/`                     | 파이어족 목표자산 계산기        | 목표금액 중심 계산기로 연결   |
| `/reports/personal-vs-national-pension-2026/` | 개인연금 vs 국민연금 수령액 비교  | 은퇴 현금흐름 보완        |
| `/reports/retirement-pension-dc-db-irp-2026/` | 퇴직연금 DC·DB·IRP 수익 비교 | 은퇴자산 운용 연결        |
| `/tools/stock-breakeven-calculator/`          | 주식 손익분기점 계산기         | 투자자 유입 연결         |
| `/tools/ai-work-roi-calculator/`              | AI 업무 ROI 계산기        | 소득 증가·시간 절약 관점 연결 |

---

# 24. 수익화 포인트

| 위치          | 방식       | 예시                 |
| ----------- | -------- | ------------------ |
| 결과 카드 하단    | AdSense  | 연금, 투자, 증권사 광고     |
| 필요 은퇴자산표 아래 | 내부링크     | IRP/연금저축 콘텐츠 연결    |
| 시나리오 비교 아래  | 제휴 가능    | 증권계좌, ETF, 연금저축    |
| FAQ 하단      | 콘텐츠 클러스터 | 국민연금, 퇴직연금, 배당 ETF |
| 결과 공유 CTA   | 재방문 유도   | “내 은퇴 나이 공유하기”     |

---

# 25. 주의 문구

```md
본 계산기는 입력값을 기반으로 조기 은퇴 가능 나이를 단순 추정하는 도구입니다.
실제 은퇴 가능 여부는 투자수익률, 물가상승률, 세금, 건강보험료, 국민연금, 주거비, 가족 구성, 시장 변동성에 따라 달라질 수 있습니다.
특정 금융상품 투자나 은퇴 결정을 권유하는 내용이 아닙니다.
```

---

# 26. 최종 추천 포지셔닝

## 추천 제목

```md
조기 은퇴 가능 나이 계산기: 나는 몇 살에 파이어족이 될 수 있을까?
```

## 추천 부제

```md
월 소득, 지출, 현재 자산, 투자수익률을 입력하면
목표 은퇴자산과 은퇴 가능 나이를 한 번에 계산합니다.
```

## 핵심 차별점

| 일반 은퇴 계산기  | 비교계산소 조기 은퇴 가능 나이 계산기 |
| ---------- | --------------------- |
| 목표금액 중심    | 은퇴 가능 나이 중심           |
| 단순 필요자산 계산 | 자산 성장 곡선 제공           |
| 입력 후 결과 1개 | 시나리오 3종 비교            |
| 노후 준비 중심   | FIRE·조기은퇴 수요 대응       |
| 정적 콘텐츠     | 반복 입력 유도형 계산기         |

이 계산기는 비교계산소의 **투자/연금/노후 카테고리 핵심 계산기**로 가져가면 좋습니다. 특히 “현재 상태 그대로”, “지출 10% 절감”, “수익률 1%p 상승”을 나란히 보여주면 사용자가 입력값을 계속 바꿔보게 되어 체류시간이 길어집니다.

[1]: https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf?utm_source=chatgpt.com "Determining Withdrawal Rates Using Historical Data"
