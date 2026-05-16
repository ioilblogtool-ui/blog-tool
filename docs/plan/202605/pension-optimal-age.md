# 연금 수령 최적 나이 계산기 웹 컨텐츠 기획서

## 1. 기본 정보

| 항목       | 내용                                                         |
| -------- | ---------------------------------------------------------- |
| Title    | 연금 수령 최적 나이 계산기                                            |
| Type     | calculator                                                 |
| Category | 투자/연금/노후                                                   |
| Keyword  | 연금 수령 나이 계산 언제 받는게 유리                                      |
| Path     | `/tools/pension-optimal-age/`                              |
| 핵심 타깃    | 50대 은퇴 준비자, 60대 연금 수령 예정자, 조기노령연금·연기연금 고민자                 |
| 핵심 메시지   | “연금은 빨리 받는 게 유리할까, 늦게 받는 게 유리할까? 내 조건 기준으로 누적 수령액을 비교해보자.” |

---

## 2. 페이지 핵심 콘셉트

**연금 수령 최적 나이 계산기**는 현재 나이, 예상 연금 월수령액, 건강수명, 물가상승률을 입력하면 수령 개시 나이별 누적 수령액을 비교해주는 도구입니다.

국민연금은 출생연도별로 정상 수급개시연령이 다르고, 조기노령연금은 정상 수령보다 최대 5년 앞당겨 받을 수 있지만 수령액이 줄어듭니다. 국민연금공단은 1969년생 이후의 노령연금 지급개시연령을 65세, 조기노령연금 지급개시연령을 60세로 안내하고 있습니다. ([국민연금공단][1])

또한 연기연금은 수령 시점을 늦추는 대신 월 0.6%, 연 7.2%가 가산되는 구조입니다. ([대한민국 정책브리핑][2])

---

## 3. 추천 Hero 문구

### H1

```text
연금 수령 최적 나이 계산기
```

### Sub Text

```text
국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리할까요?
60세·62세·65세·70세 수령 시 누적 수령액과 손익분기 나이를 비교해보세요.
```

### CTA

```text
내 연금 수령 최적 나이 계산하기
```

---

## 4. 입력값 설계

| 입력 항목        |     타입 |    예시값 | 설명                   |
| ------------ | -----: | -----: | -------------------- |
| 현재 나이        | number |    55세 | 계산 시작 기준 나이          |
| 출생연도         | number |  1970년 | 국민연금 정상 수급개시연령 자동 판정 |
| 예상 국민연금 월수령액 | number | 120만 원 | 정상 수령 시 월 예상액        |
| 예상 개인연금 월수령액 | number |  50만 원 | 연금저축, 개인연금 등         |
| 예상 퇴직연금 월수령액 | number |  70만 원 | IRP, DC, DB 전환 연금 등  |
| 건강수명 예상 나이   | number |    82세 | 실제 비교 종료 나이          |
| 물가상승률        | number |   2.0% | 실질가치 보정용             |
| 연금 증가율       | number | 0~2.0% | 선택 입력. 연금액 증가 가정     |
| 기대수명         | number |    90세 | 장수 시나리오 비교용          |
| 현재 소득 여부     | select |  있음/없음 | 조기노령연금 가능성 안내용       |

---

## 5. 출력값 설계

| 출력 결과            | 설명                                |
| ---------------- | --------------------------------- |
| 수령 개시 나이별 월수령액   | 60·62·65·70세 기준 월수령액 비교           |
| 수령 개시 나이별 누적 수령액 | 건강수명/기대수명까지 총 수령액 비교              |
| 손익분기 나이          | 늦게 받는 전략이 빨리 받는 전략을 누적액으로 추월하는 나이 |
| 추천 수령 시작 나이      | 입력 조건 기준 가장 유리한 수령 나이             |
| 조기수령 리스크         | 감액 후 평생 지급되는 구조 안내                |
| 연기수령 리스크         | 오래 살아야 유리한 구조 안내                  |
| 실질가치 보정 결과       | 물가상승률 반영 후 현재가치 기준 비교             |
| 부부 연금 확장 안내      | 배우자 연금까지 포함한 확장 기능 유도             |

---

# 6. 국민연금 수령 나이 기준 반영

## 6-1. 출생연도별 정상 수급개시연령

| 출생연도        | 노령연금 지급개시연령 | 조기노령연금 지급개시연령 |
| ----------- | ----------: | ------------: |
| 1953~1956년생 |         61세 |           56세 |
| 1957~1960년생 |         62세 |           57세 |
| 1961~1964년생 |         63세 |           58세 |
| 1965~1968년생 |         64세 |           59세 |
| 1969년생 이후   |         65세 |           60세 |

국민연금공단은 출생연도별 노령연금 지급개시연령과 조기노령연금 지급개시연령을 위와 같이 구분하고 있습니다. ([국민연금공단][1])

---

## 6-2. 조기수령 지급률

예를 들어 1966년생의 경우 정상 지급개시연령은 64세, 조기노령연금 지급개시연령은 59세입니다. 국민연금공단 예시는 59세 청구 시 70%, 60세 76%, 61세 82%, 62세 88%, 63세 94% 지급률을 제시합니다. ([국민연금공단][1])

| 정상수령 대비 앞당긴 기간 |  지급률 |    감액률 |
| -------------: | ---: | -----: |
|          5년 조기 |  70% | 30% 감액 |
|          4년 조기 |  76% | 24% 감액 |
|          3년 조기 |  82% | 18% 감액 |
|          2년 조기 |  88% | 12% 감액 |
|          1년 조기 |  94% |  6% 감액 |
|          정상 수령 | 100% |  감액 없음 |

---

## 6-3. 연기수령 지급률

연기연금은 수령을 늦춘 기간에 따라 월 0.6%, 연 7.2%가 가산됩니다. 정부 정책브리핑은 연기연금제를 “노령연금 수급시점을 늦추는 대신 매월 0.6%, 연 7.2%를 가산해 급여액을 높이는 제도”라고 설명합니다. ([대한민국 정책브리핑][2])

| 정상수령 대비 연기 기간 |    지급률 |      증액률 |
| ------------: | -----: | -------: |
|         1년 연기 | 107.2% |  7.2% 증가 |
|         2년 연기 | 114.4% | 14.4% 증가 |
|         3년 연기 | 121.6% | 21.6% 증가 |
|         4년 연기 | 128.8% | 28.8% 증가 |
|         5년 연기 | 136.0% | 36.0% 증가 |

---

# 7. 계산 공식

## 7-1. 조기수령 월수령액

```text
조기수령 월수령액 = 정상 월수령액 × 조기수령 지급률
```

예시:

```text
정상 월수령액 100만 원 × 70% = 조기수령 월 70만 원
```

---

## 7-2. 연기수령 월수령액

```text
연기수령 월수령액 = 정상 월수령액 × (1 + 0.072 × 연기연수)
```

예시:

```text
정상 월수령액 100만 원 × 136% = 5년 연기 수령 월 136만 원
```

---

## 7-3. 누적 수령액

```text
누적 수령액 = 월수령액 × 12개월 × 수령 기간
```

예시:

```text
65세부터 85세까지 월 100만 원 수령
= 100만 원 × 12개월 × 20년
= 2억 4,000만 원
```

---

## 7-4. 물가상승률 반영 현재가치

```text
현재가치 기준 연금액 = 미래 연금액 ÷ (1 + 물가상승률) ^ 경과연수
```

계산기에서는 단순 누적액과 현재가치 보정 누적액을 함께 보여주는 것을 추천합니다.

---

## 7-5. 손익분기 나이

```text
손익분기 나이 = 늦게 받는 전략의 누적 수령액이 빠르게 받는 전략의 누적 수령액을 처음 추월하는 나이
```

예시:

|  나이 | 60세 조기수령 누적액 | 65세 정상수령 누적액 | 유리한 전략   |
| --: | -----------: | -----------: | -------- |
| 65세 |     4,200만 원 |           0원 | 60세 조기수령 |
| 70세 |     8,400만 원 |     6,000만 원 | 60세 조기수령 |
| 75세 |  1억 2,600만 원 |  1억 2,000만 원 | 60세 조기수령 |
| 76세 |  1억 3,440만 원 |  1억 3,200만 원 | 60세 조기수령 |
| 77세 |  1억 4,280만 원 |  1억 4,400만 원 | 65세 정상수령 |

이 경우 **77세부터는 정상수령이 조기수령보다 누적액 기준으로 유리**해집니다.

---

# 8. 결과 카드 구성

| 카드명             |          예시 |
| --------------- | ----------: |
| 추천 수령 시작 나이     |    65세 정상수령 |
| 예상 손익분기 나이      |         77세 |
| 85세까지 최대 누적 수령액 | 3억 2,640만 원 |
| 90세까지 최대 누적 수령액 | 4억 4,880만 원 |
| 조기수령 시 월수령액     |       84만 원 |
| 5년 연기 시 월수령액    |      163만 원 |
| 물가 반영 후 실질 누적액  | 2억 8,900만 원 |

---

# 9. 수령 개시 나이별 비교표 예시

가정:

| 항목           |      값 |
| ------------ | -----: |
| 정상 국민연금 월수령액 | 120만 원 |
| 정상 수령 나이     |    65세 |
| 조기수령         |    60세 |
| 연기수령         |    70세 |
| 건강수명         |    85세 |
| 물가상승률        |     2% |

| 수령 시작 나이 |  지급률 |     월수령액 | 85세까지 수령 기간 |   85세까지 누적액 |
| -------: | ---: | -------: | ----------: | ----------: |
|      60세 |  70% |    84만 원 |         25년 | 2억 5,200만 원 |
|      62세 |  82% |  98.4만 원 |         23년 | 2억 7,158만 원 |
|      65세 | 100% |   120만 원 |         20년 | 2억 8,800만 원 |
|      70세 | 136% | 163.2만 원 |         15년 | 2억 9,376만 원 |

이 예시에서는 **85세까지 생존 가정 시 70세 연기수령의 누적액이 가장 높게** 나옵니다. 다만 70세 이전에 현금흐름이 필요한 사람에게는 정상수령이나 조기수령이 더 현실적일 수 있습니다.

---

# 10. 결과 해석 문구

## 10-1. 조기수령 추천 케이스

```text
현재 입력값 기준으로는 조기수령이 유리할 수 있습니다.
예상 건강수명이 짧거나, 은퇴 직후 생활비 공백이 크거나, 당장 현금흐름이 필요한 경우에는 늦게 받는 것보다 빨리 받는 전략이 현실적일 수 있습니다.
```

## 10-2. 정상수령 추천 케이스

```text
현재 입력값 기준으로는 정상수령이 가장 균형적인 선택입니다.
조기수령의 감액 부담은 피하면서, 연기수령처럼 긴 무수령 기간을 감수하지 않아도 됩니다.
```

## 10-3. 연기수령 추천 케이스

```text
현재 입력값 기준으로는 연기수령이 유리할 수 있습니다.
기대수명이 길고, 60대 초중반 생활비를 다른 자산으로 충당할 수 있다면 연기수령을 통해 월수령액을 높이는 전략을 검토할 수 있습니다.
```

---

# 11. 본문 섹션 구성

## 11-1. 연금은 언제 받는 게 유리할까?

연금 수령 시점은 단순히 “빨리 받기 vs 늦게 받기”의 문제가 아닙니다. 핵심은 **내가 몇 세까지 살 것으로 가정하는지, 60대 초반 생활비를 어떻게 충당할 수 있는지, 조기수령 감액을 감수할 수 있는지**입니다.

| 판단 기준 | 조기수령 유리    | 연기수령 유리      |
| ----- | ---------- | ------------ |
| 건강 상태 | 건강수명 짧게 예상 | 장수 가능성 높음    |
| 현금흐름  | 당장 생활비 필요  | 다른 소득·자산 있음  |
| 월수령액  | 낮아져도 괜찮음   | 높은 월수령액 필요   |
| 투자성향  | 빨리 받아 활용   | 안정적 연금 증액 선호 |
| 가족 상황 | 부양 부담 큼    | 부부 자산 여유 있음  |

---

## 11-2. 조기수령의 장점과 단점

| 구분 | 내용                                 |
| -- | ---------------------------------- |
| 장점 | 은퇴 직후 소득 공백을 줄일 수 있음               |
| 장점 | 건강수명이 짧을 경우 누적액 기준 유리할 수 있음        |
| 단점 | 월수령액이 평생 감액됨                       |
| 단점 | 장수할수록 누적 수령액에서 불리해질 수 있음           |
| 단점 | 소득이 있는 업무에 종사하면 지급 정지 조건이 발생할 수 있음 |

국민연금공단은 조기노령연금에 대해 가입기간 10년 이상이고 출생연도별 조기노령연금 지급개시연령 이상인 사람이 소득 있는 업무에 종사하지 않는 경우 신청할 수 있다고 안내합니다. ([국민연금공단][1])

---

## 11-3. 연기수령의 장점과 단점

| 구분 | 내용                     |
| -- | ---------------------- |
| 장점 | 월수령액이 증가함              |
| 장점 | 오래 살수록 누적 수령액이 커질 가능성  |
| 장점 | 노후 후반 현금흐름 강화          |
| 단점 | 연기 기간 동안 연금을 받지 못함     |
| 단점 | 손익분기 나이 이전에는 누적액 기준 불리 |
| 단점 | 건강 상태와 생활비 여력이 중요      |

연기연금은 국민연금액의 일부를 선택해 연기할 수도 있으며, 정부 정책브리핑은 50%, 60%, 70%, 80%, 90% 중 하나를 선택해 일부 연기하고 연 7.2%가 가산된 금액을 받을 수 있다고 설명합니다. ([대한민국 정책브리핑][2])

---

## 11-4. 개인연금·퇴직연금은 따로 봐야 하는 이유

국민연금은 조기·연기 수령에 따른 감액률과 증액률이 제도적으로 정해져 있지만, 개인연금과 퇴직연금은 상품 구조에 따라 수령 방식이 다릅니다.

| 연금 종류 | 수령 시점 판단 기준                 |
| ----- | --------------------------- |
| 국민연금  | 조기 감액률, 연기 증액률, 정상 수급개시연령   |
| 개인연금  | 상품 수익률, 세액공제 여부, 연금소득세      |
| 퇴직연금  | IRP 이전 여부, 일시금 vs 연금 수령, 세금 |
| 주택연금  | 주택 가격, 가입 나이, 부부 생존 여부      |
| 기초연금  | 소득인정액, 재산, 국민연금 수령액 영향      |

---

# 12. UX 구성 제안

## 12-1. 입력 영역

```text
[현재 나이]
[출생연도]
[예상 국민연금 월수령액]
[예상 개인연금 월수령액]
[예상 퇴직연금 월수령액]
[건강수명 예상 나이]
[기대수명]
[물가상승률]
[현재 소득 여부]
[계산하기]
```

---

## 12-2. 결과 영역

```text
추천 수령 시작 나이
손익분기 나이
수령 시작 나이별 월수령액
수령 시작 나이별 누적 수령액
물가 반영 현재가치 비교
조기수령/정상수령/연기수령 해석
```

---

## 12-3. 차트 구성

| 차트              | 설명                   |
| --------------- | -------------------- |
| 누적 수령액 라인 차트    | 나이별 누적 수령액 추이 비교     |
| 수령 시작 나이별 막대 차트 | 건강수명까지 총 수령액 비교      |
| 월수령액 비교 카드      | 조기·정상·연기 월수령액 차이     |
| 손익분기 표시선        | 늦게 받는 전략이 추월하는 나이 표시 |

---

# 13. SEO 메타 정보

## Meta Title

```text
연금 수령 최적 나이 계산기｜조기수령 vs 연기수령 손익분기점 비교
```

## Meta Description

```text
국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리한지 계산해보세요. 60세·62세·65세·70세 수령 시 누적 수령액, 월수령액, 손익분기 나이, 추천 수령 시점을 비교합니다.
```

## OG Title

```text
연금 수령 최적 나이 계산기
```

## OG Description

```text
연금은 빨리 받는 게 유리할까요, 늦게 받는 게 유리할까요? 내 조건 기준으로 누적 수령액과 손익분기 나이를 계산해보세요.
```

---

# 14. 추천 키워드 확장

| 구분      | 키워드                        |
| ------- | -------------------------- |
| 메인 키워드  | 연금 수령 나이 계산                |
| 서브 키워드  | 연금 언제 받는게 유리, 국민연금 조기수령 계산 |
| 롱테일 키워드 | 국민연금 60세 65세 70세 수령 비교     |
| 롱테일 키워드 | 국민연금 연기수령 손익분기점            |
| 롱테일 키워드 | 연금 수령 개시 나이별 누적 수령액        |
| 관련 키워드  | 조기노령연금 감액률, 연기연금 증액률       |
| 관련 키워드  | 퇴직연금 수령 나이, 개인연금 수령 시기     |

---

# 15. 내부 링크 전략

| 연결 페이지                                           | 링크 목적                    |
| ------------------------------------------------ | ------------------------ |
| `/reports/worker-retirement-reality-2026/`       | 직장인 노후 준비 실태 리포트 연결      |
| `/tools/retirement-fund-runout-calculator/`      | 노후자금 고갈 계산기 연결           |
| `/tools/irp-tax-saving-calculator/`              | IRP 세액공제 계산기 연결          |
| `/tools/pension-monthly-income-calculator/`      | 월 연금 수령액 계산기 확장          |
| `/reports/national-pension-early-vs-delay-2026/` | 국민연금 조기수령 vs 연기수령 리포트 확장 |
| `/tools/fire-retirement-age-calculator/`         | FIRE 조기은퇴 나이 계산기 연결      |

---

# 16. 면책 문구

```text
본 계산기는 입력값과 단순 가정을 바탕으로 연금 수령 시점별 누적 수령액을 비교하는 참고용 도구입니다.
실제 국민연금 수령액, 조기노령연금 가능 여부, 연기연금 신청 가능 여부, 개인연금·퇴직연금 세금은 개인의 가입 이력, 소득, 상품 조건, 법령 변경에 따라 달라질 수 있습니다.
정확한 수령액과 신청 가능 여부는 국민연금공단, 금융회사, 세무 전문가를 통해 확인해야 합니다.
```

---

# 17. 개발 구현용 계산 로직 예시

```ts
type PensionInput = {
  currentAge: number;
  birthYear: number;
  normalMonthlyPension: number;
  privateMonthlyPension: number;
  retirementMonthlyPension: number;
  healthLifeAge: number;
  expectedLifeAge: number;
  inflationRate: number;
};

type PensionScenario = {
  startAge: number;
  nationalPensionRate: number;
  nationalMonthlyAmount: number;
  totalMonthlyAmount: number;
  totalNominalAmountToHealthLife: number;
  totalNominalAmountToExpectedLife: number;
  presentValueToHealthLife: number;
  presentValueToExpectedLife: number;
};

function getNormalPensionAge(birthYear: number): number {
  if (birthYear >= 1969) return 65;
  if (birthYear >= 1965) return 64;
  if (birthYear >= 1961) return 63;
  if (birthYear >= 1957) return 62;
  if (birthYear >= 1953) return 61;
  return 60;
}

function getNationalPensionRate(startAge: number, normalAge: number): number {
  const diff = startAge - normalAge;

  // 조기수령: 1년당 6% 감액, 최대 5년
  if (diff < 0) {
    const earlyYears = Math.abs(diff);
    return Math.max(0.7, 1 - earlyYears * 0.06);
  }

  // 연기수령: 1년당 7.2% 증액, 최대 5년
  if (diff > 0) {
    const delayedYears = Math.min(diff, 5);
    return 1 + delayedYears * 0.072;
  }

  return 1;
}

function calculatePresentValue(
  monthlyAmount: number,
  startAge: number,
  endAge: number,
  currentAge: number,
  inflationRate: number
): number {
  let total = 0;

  for (let age = startAge; age < endAge; age++) {
    const yearsFromNow = age - currentAge;
    const annualAmount = monthlyAmount * 12;
    const discountFactor = Math.pow(1 + inflationRate / 100, yearsFromNow);
    total += annualAmount / discountFactor;
  }

  return total;
}

function calculatePensionScenario(
  input: PensionInput,
  startAge: number
): PensionScenario {
  const normalAge = getNormalPensionAge(input.birthYear);
  const nationalRate = getNationalPensionRate(startAge, normalAge);

  const nationalMonthlyAmount = input.normalMonthlyPension * nationalRate;

  const totalMonthlyAmount =
    nationalMonthlyAmount +
    input.privateMonthlyPension +
    input.retirementMonthlyPension;

  const yearsToHealthLife = Math.max(input.healthLifeAge - startAge, 0);
  const yearsToExpectedLife = Math.max(input.expectedLifeAge - startAge, 0);

  const totalNominalAmountToHealthLife =
    totalMonthlyAmount * 12 * yearsToHealthLife;

  const totalNominalAmountToExpectedLife =
    totalMonthlyAmount * 12 * yearsToExpectedLife;

  const presentValueToHealthLife = calculatePresentValue(
    totalMonthlyAmount,
    startAge,
    input.healthLifeAge,
    input.currentAge,
    input.inflationRate
  );

  const presentValueToExpectedLife = calculatePresentValue(
    totalMonthlyAmount,
    startAge,
    input.expectedLifeAge,
    input.currentAge,
    input.inflationRate
  );

  return {
    startAge,
    nationalPensionRate: nationalRate,
    nationalMonthlyAmount,
    totalMonthlyAmount,
    totalNominalAmountToHealthLife,
    totalNominalAmountToExpectedLife,
    presentValueToHealthLife,
    presentValueToExpectedLife,
  };
}
```

---

# 18. 손익분기 나이 계산 로직

```ts
function getCumulativeAmountByAge(
  monthlyAmount: number,
  startAge: number,
  targetAge: number
): number {
  if (targetAge <= startAge) return 0;
  return monthlyAmount * 12 * (targetAge - startAge);
}

function findBreakEvenAge(
  earlierStartAge: number,
  earlierMonthlyAmount: number,
  laterStartAge: number,
  laterMonthlyAmount: number,
  maxAge: number = 100
): number | null {
  for (let age = laterStartAge; age <= maxAge; age++) {
    const earlierTotal = getCumulativeAmountByAge(
      earlierMonthlyAmount,
      earlierStartAge,
      age
    );

    const laterTotal = getCumulativeAmountByAge(
      laterMonthlyAmount,
      laterStartAge,
      age
    );

    if (laterTotal >= earlierTotal) {
      return age;
    }
  }

  return null;
}
```

---

# 19. 결과 추천 로직

```ts
function recommendPensionStartAge(scenarios: PensionScenario[]) {
  const sortedByHealthLife = [...scenarios].sort(
    (a, b) => b.totalNominalAmountToHealthLife - a.totalNominalAmountToHealthLife
  );

  const best = sortedByHealthLife[0];

  if (best.startAge < 65) {
    return {
      recommendedAge: best.startAge,
      type: "조기수령 우세",
      message:
        "입력한 건강수명 기준으로는 조기수령의 누적 수령액이 유리할 수 있습니다. 다만 월수령액 감액이 평생 적용될 수 있으므로 신중한 검토가 필요합니다.",
    };
  }

  if (best.startAge === 65) {
    return {
      recommendedAge: best.startAge,
      type: "정상수령 우세",
      message:
        "입력한 조건에서는 정상수령이 가장 균형적인 선택으로 보입니다. 조기 감액을 피하면서 무수령 기간도 길지 않습니다.",
    };
  }

  return {
    recommendedAge: best.startAge,
    type: "연기수령 우세",
    message:
      "입력한 기대수명 기준으로는 연기수령의 누적 수령액이 유리할 수 있습니다. 단, 연기 기간 동안 생활비를 충당할 수 있는지가 중요합니다.",
  };
}
```

---

# 20. 추가 확장 아이디어

| 확장 기능         | 설명                      |
| ------------- | ----------------------- |
| 부부 연금 합산 계산   | 배우자 국민연금·개인연금 포함        |
| 기초연금 영향 안내    | 국민연금 수령액에 따른 기초연금 영향 설명 |
| 세금 반영         | 연금소득세, 퇴직연금 과세 반영       |
| 투자수익률 비교      | 조기수령 후 투자했을 때 시나리오      |
| 주택연금 포함       | 주택연금 월수령액까지 합산          |
| 생활비 부족액 계산    | 월 필요 생활비 대비 연금 부족액      |
| 은퇴 전 소득 공백 계산 | 60~65세 소득 공백 기간 분석      |
| 연금개혁 반영 옵션    | 보험료율·소득대체율 변경 안내        |

국민연금공단 FAQ에 따르면 2026년부터 소득대체율은 43%로 상향되고, 2026년 이후 가입기간에 적용됩니다. 또한 보험료율은 2026년부터 매년 0.5%p씩 인상되어 13%까지 오르는 구조로 안내되어 있어, 장기적으로는 “연금개혁 반영 옵션”을 별도 토글로 두는 것도 좋습니다. ([국민연금공단][3])

---

# 21. Claude Code 최종 복붙용 프롬프트

```text
https://bigyocalc.com/ 비교계산소 사이트에 아래 계산기 페이지를 추가해줘.

Title: 연금 수령 최적 나이 계산기
Type: calculator
Category: 투자/연금/노후
Keyword: 연금 수령 나이 계산 언제 받는게 유리
Path: /tools/pension-optimal-age/

목표:
국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리한지 계산하는 페이지를 만든다.
60세·62세·65세·70세 수령 개시 시나리오별 월수령액, 누적 수령액, 손익분기 나이, 추천 수령 시작 나이를 보여준다.

핵심 입력값:
- 현재 나이
- 출생연도
- 예상 국민연금 월수령액
- 예상 개인연금 월수령액
- 예상 퇴직연금 월수령액
- 건강수명 예상 나이
- 기대수명
- 물가상승률
- 현재 소득 여부

핵심 출력값:
- 추천 수령 시작 나이
- 수령 개시 나이별 월수령액
- 수령 개시 나이별 누적 수령액
- 건강수명까지 누적 수령액
- 기대수명까지 누적 수령액
- 물가 반영 현재가치 기준 누적액
- 조기수령 vs 정상수령 vs 연기수령 손익분기 나이

국민연금 기준:
- 출생연도별 정상 수급개시연령을 반영한다.
- 1953~1956년생: 61세
- 1957~1960년생: 62세
- 1961~1964년생: 63세
- 1965~1968년생: 64세
- 1969년생 이후: 65세
- 조기수령은 정상수령보다 최대 5년 빠르게 받을 수 있고, 1년당 6% 감액한다.
- 연기수령은 최대 5년 연기 가능하고, 1년당 7.2% 증액한다.
- 단, 실제 신청 가능 여부는 소득 여부와 국민연금공단 기준에 따라 달라질 수 있으므로 안내 문구를 넣는다.

UI 구성:
1. Hero 영역
- H1: 연금 수령 최적 나이 계산기
- Sub Text: 국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리할까요? 60세·62세·65세·70세 수령 시 누적 수령액과 손익분기 나이를 비교해보세요.
- CTA: 내 연금 수령 최적 나이 계산하기

2. 입력 카드
- 현재 나이
- 출생연도
- 국민연금 월수령액
- 개인연금 월수령액
- 퇴직연금 월수령액
- 건강수명
- 기대수명
- 물가상승률

3. 결과 카드
- 추천 수령 시작 나이
- 손익분기 나이
- 최대 누적 수령액
- 월수령액 비교
- 조기수령/정상수령/연기수령 해석

4. 차트
- 나이별 누적 수령액 라인 차트
- 수령 시작 나이별 총수령액 막대 차트

5. 본문 섹션
- 연금은 언제 받는 게 유리할까?
- 국민연금 조기수령 기준
- 국민연금 연기수령 기준
- 조기수령 장단점
- 연기수령 장단점
- 개인연금·퇴직연금은 따로 봐야 하는 이유
- 손익분기 나이 보는 법
- 연금 수령 시 주의사항
- FAQ

SEO:
Meta Title:
연금 수령 최적 나이 계산기｜조기수령 vs 연기수령 손익분기점 비교

Meta Description:
국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리한지 계산해보세요. 60세·62세·65세·70세 수령 시 누적 수령액, 월수령액, 손익분기 나이, 추천 수령 시점을 비교합니다.

주의:
- 수익 보장 표현 금지
- 연금 수령액은 입력값 기준 참고용으로 표시
- 국민연금 제도 변경 가능성 안내
- 정확한 신청 가능 여부는 국민연금공단 확인 필요
- 모바일에서 표와 차트가 잘 보이도록 구현
```

---

# 최종 한 줄 컨셉

```text
연금 수령 최적 나이 계산기는 “빨리 받을까, 늦게 받을까?”를 감으로 판단하지 않고, 누적 수령액과 손익분기 나이 기준으로 비교해주는 노후 현금흐름 계산기입니다.
```

[1]: https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0056M0.do "NPS 국민연금공단 - 국민을 든든하게 연금을 튼튼하게"
[2]: https://www.korea.kr/news/policyNewsView.do?newsId=148798695 "국민연금 수령 일부 연기 가능…연기시 연 7.2% 가산 - 정책뉴스 | 뉴스 | 대한민국 정책브리핑"
[3]: https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0104M0.do "NPS 국민연금공단 - 국민을 든든하게 연금을 튼튼하게"
