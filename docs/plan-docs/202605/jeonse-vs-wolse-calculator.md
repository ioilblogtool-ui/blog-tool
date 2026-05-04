# 비교계산소용 최종 MD 웹기획서 v1

## 1. 콘텐츠 개요

| 항목           | 내용                                           |
| ------------ | -------------------------------------------- |
| Title        | 아파트 월세 vs 전세 손익 계산기                          |
| Type         | calculator                                   |
| Category     | 부동산                                          |
| Main Keyword | 전세 월세 손익 계산                                  |
| Sub Keywords | 월세 전세 어느게 유리, 전세대출 이자 계산, 월세 전환율 계산, 전세 기회비용 |
| Path         | `/tools/jeonse-vs-wolse-calculator/`         |
| Target       | 전세와 월세 중 고민하는 20~40대 실수요자, 신혼부부, 직장인, 투자자    |
| 핵심 가치        | 전세·월세를 “감”이 아니라 총비용 기준으로 비교                  |

---

## 2. 콘텐츠 한 줄 정의

> 같은 아파트에서 **전세로 살 때의 대출이자·기회비용**과 **월세로 살 때의 월세 지출·남는 보증금 운용수익**을 비교해, 내 조건에서 전세와 월세 중 어느 쪽이 유리한지 계산하는 도구.

---

## 3. 검색 의도 분석

| 검색어           | 사용자 의도              | 콘텐츠 대응        |
| ------------- | ------------------- | ------------- |
| 전세 월세 어느게 유리  | 전세/월세 선택 고민         | 결과 요약 카드      |
| 전세 월세 손익 계산   | 숫자로 총비용 비교          | 계산기 메인        |
| 전세대출 이자 vs 월세 | 금리 기준 비교            | 전세 총비용 산식     |
| 전세보증금 기회비용    | 보증금 묶이는 비용 확인       | 운용수익률 입력      |
| 월세 전환율 계산     | 전세를 월세로 바꿀 때 적정성 확인 | 전월세 전환율 보조 지표 |

전월세 전환 관련 기준은 주택임대차보호법상 보증금 일부 또는 전부를 월차임으로 전환할 때 일정 산정률 범위를 초과할 수 없도록 규정되어 있고, 한국주택금융공사는 2026년 상반기 전월세전환율을 6.4%로 안내하고 있습니다. 이 계산기는 법정 판단 도구가 아니라 **실거주자의 손익 비교 도구**로 포지셔닝하는 것이 안전합니다. ([법제처][1])

---

## 4. 핵심 계산 로직

## 4-1. 입력값

| 입력 항목      |           예시 | 설명                  |
| ---------- | -----------: | ------------------- |
| 전세보증금      | 300,000,000원 | 전세 계약 시 필요한 총 보증금   |
| 전세대출 금액    | 200,000,000원 | 전세보증금 중 대출로 조달하는 금액 |
| 전세대출 금리    |         4.0% | 연 이자율               |
| 자기자본 투입액   |         자동계산 | 전세보증금 - 전세대출        |
| 월세 보증금     |  50,000,000원 | 월세 계약 시 보증금         |
| 월세액        |     800,000원 | 매월 납부 월세            |
| 보증금 운용 수익률 |         3.0% | 남는 현금의 예금/투자 기대수익률  |
| 거주 예정 기간   |         24개월 | 비교 기간               |
| 관리비 포함 여부  |           선택 | 월세 총비용에 포함 여부       |
| 월 관리비      |     150,000원 | 선택 입력               |

---

## 4-2. 전세 총비용 계산

```text
전세 자기자본 = 전세보증금 - 전세대출금

전세대출 이자비용 =
전세대출금 × 전세대출금리 × 거주개월수 / 12

전세 자기자본 기회비용 =
전세 자기자본 × 보증금 운용수익률 × 거주개월수 / 12

전세 총비용 =
전세대출 이자비용 + 전세 자기자본 기회비용
```

### 예시

| 항목        |       금액 |
| --------- | -------: |
| 전세보증금     |     3억 원 |
| 전세대출금     |     2억 원 |
| 자기자본      |     1억 원 |
| 전세대출 금리   |     4.0% |
| 보증금 운용수익률 |     3.0% |
| 거주 기간     |     24개월 |
| 대출 이자비용   | 1,600만 원 |
| 자기자본 기회비용 |   600만 원 |
| 전세 총비용    | 2,200만 원 |

---

## 4-3. 월세 총비용 계산

```text
월세 총 납부액 =
월세액 × 거주개월수

월세 보증금 기회비용 =
월세보증금 × 보증금 운용수익률 × 거주개월수 / 12

전세 대비 남는 현금 =
전세 자기자본 - 월세보증금

남는 현금 운용수익 =
전세 대비 남는 현금 × 보증금 운용수익률 × 거주개월수 / 12

월세 실질 총비용 =
월세 총 납부액 + 월세 보증금 기회비용 - 남는 현금 운용수익
```

### 예시

| 항목               |       금액 |
| ---------------- | -------: |
| 월세보증금            | 5,000만 원 |
| 월세               |    80만 원 |
| 거주 기간            |     24개월 |
| 월세 총 납부액         | 1,920만 원 |
| 월세보증금 기회비용       |   300만 원 |
| 전세 대비 남는 현금 운용수익 |   300만 원 |
| 월세 실질 총비용        | 1,920만 원 |

---

## 4-4. 최종 비교 결과

```text
전세 총비용 - 월세 실질 총비용 = 손익 차이

양수이면 월세 유리
음수이면 전세 유리
```

| 구분        |           총비용 |
| --------- | ------------: |
| 전세 총비용    |      2,200만 원 |
| 월세 실질 총비용 |      1,920만 원 |
| 차이        |        280만 원 |
| 결과        | 월세가 280만 원 유리 |

### 결과 문구 예시

> 현재 입력 조건에서는 **월세가 약 280만 원 유리**합니다.
> 전세대출 금리가 높고, 전세 자기자본의 기회비용까지 반영하면 월세의 실질 부담이 더 낮게 계산됩니다.

---

## 5. 손익분기 월세 계산

사용자가 가장 궁금해할 보조 출력입니다.

```text
손익분기 월세 =
(전세 총비용 + 남는 현금 운용수익 - 월세보증금 기회비용) / 거주개월수
```

| 항목      |                     결과 |
| ------- | ---------------------: |
| 손익분기 월세 |              약 91.6만 원 |
| 현재 월세   |                  80만 원 |
| 판단      | 현재 월세가 손익분기보다 낮아 월세 유리 |

### 결과 문구

> 이 조건에서 월세가 **91.6만 원 이하**라면 월세가 유리하고, 그 이상이면 전세가 유리해집니다.

---

## 6. 화면 구성 IA

## 6-1. 페이지 상단 Hero

### H1

```md
아파트 월세 vs 전세 손익 계산기
```

### Sub Copy

```md
전세대출 이자, 보증금 기회비용, 월세 납부액을 한 번에 비교해
내 조건에서 전세와 월세 중 어느 쪽이 더 유리한지 계산해보세요.
```

### CTA

```md
내 조건으로 전세/월세 비교하기
```

---

## 6-2. 계산기 입력 영역

### Step 1. 전세 조건 입력

| 필드       | 타입     |         기본값 |
| -------- | ------ | ----------: |
| 전세보증금    | number | 300,000,000 |
| 전세대출금    | number | 200,000,000 |
| 전세대출 금리  | number |         4.0 |
| 거주 예정 기간 | select |        24개월 |

### Step 2. 월세 조건 입력

| 필드     | 타입       |        기본값 |
| ------ | -------- | ---------: |
| 월세 보증금 | number   | 50,000,000 |
| 월세액    | number   |    800,000 |
| 월 관리비  | number   |          0 |
| 관리비 포함 | checkbox |      false |

### Step 3. 운용수익률 입력

| 필드         | 타입     |   기본값 |
| ---------- | ------ | ----: |
| 보증금 운용 수익률 | number |   3.0 |
| 운용 방식      | select | 예금 기준 |

---

## 6-3. 결과 영역

### 결과 카드 1. 최종 판정

```md
월세가 약 280만 원 유리합니다
```

| 항목        |        값 |
| --------- | -------: |
| 전세 총비용    | 2,200만 원 |
| 월세 실질 총비용 | 1,920만 원 |
| 차이        |   280만 원 |
| 유리한 선택    |       월세 |

---

### 결과 카드 2. 손익분기 월세

```md
손익분기 월세는 약 91.6만 원입니다
```

| 현재 월세 | 손익분기 월세 | 판단    |
| ----: | ------: | ----- |
| 80만 원 | 91.6만 원 | 월세 유리 |

---

### 결과 카드 3. 비용 Breakdown

| 구분 | 세부 항목      |       금액 |
| -- | ---------- | -------: |
| 전세 | 대출 이자      | 1,600만 원 |
| 전세 | 자기자본 기회비용  |   600만 원 |
| 월세 | 월세 총 납부액   | 1,920만 원 |
| 월세 | 월세보증금 기회비용 |   300만 원 |
| 월세 | 남는 현금 운용수익 |  -300만 원 |

---

## 7. 추가 인사이트 섹션

## 7-1. 전세가 유리한 경우

| 조건            | 설명               |
| ------------- | ---------------- |
| 전세대출 금리가 낮다   | 이자 부담이 작아짐       |
| 월세가 비싸다       | 월세 누적 지출이 커짐     |
| 보증금 운용수익률이 낮다 | 전세보증금의 기회비용이 작아짐 |
| 장기 거주 예정      | 월세 누적액이 커질 수 있음  |

---

## 7-2. 월세가 유리한 경우

| 조건            | 설명                      |
| ------------- | ----------------------- |
| 전세대출 금리가 높다   | 전세 이자비용이 커짐             |
| 월세가 상대적으로 낮다  | 실질 주거비가 낮아짐             |
| 보증금 운용수익률이 높다 | 남는 현금을 운용할 수 있음         |
| 거주 기간이 짧다     | 전세 계약 부담과 기회비용을 줄일 수 있음 |

---

## 7-3. 전월세 전환율 참고 설명

```md
전월세 전환율은 전세보증금 일부를 월세로 바꿀 때 적용하는 연 환산 비율입니다.
다만 이 계산기는 계약의 법적 적정성을 판단하는 도구가 아니라,
실거주자의 현금흐름과 총비용을 비교하는 계산기입니다.
```

주택임대차보호법은 월차임 전환 시 산정률 제한을 두고 있으며, 실제 시장에서는 지역·주택유형·금리·수급에 따라 전월세 전환율이 달라질 수 있습니다. 따라서 결과 화면에는 “법정 전환율 검증”이 아니라 “실질 비용 비교”라는 안내 문구를 넣는 것이 좋습니다. ([법제처][1])

---

## 8. SEO 본문 구성안

```md
# 아파트 월세 vs 전세 손익 계산기

## 1. 전세와 월세, 단순 월 납입액만 보면 안 되는 이유
## 2. 전세의 실제 비용: 대출이자 + 보증금 기회비용
## 3. 월세의 실제 비용: 월세 납부액 - 남는 현금 운용수익
## 4. 전세 3억 vs 보증금 5천 + 월세 80만 원 예시
## 5. 전세대출 금리가 오르면 언제 월세가 유리해질까?
## 6. 손익분기 월세 계산법
## 7. 전월세 전환율과 실제 손익 계산의 차이
## 8. 전세가 유리한 사람, 월세가 유리한 사람
## 9. 자주 묻는 질문
```

---

## 9. FAQ 섹션

### Q1. 전세가 무조건 월세보다 유리한가요?

아닙니다. 전세대출 금리가 높거나 보증금 운용수익률이 높다면 월세가 더 유리할 수 있습니다.

### Q2. 전세보증금을 모두 현금으로 낼 수 있으면 전세가 유리한가요?

반드시 그렇지는 않습니다. 전세보증금을 다른 곳에 투자하거나 예금했을 때 얻을 수 있는 수익, 즉 기회비용을 함께 봐야 합니다.

### Q3. 월세 계산에서 남는 현금 운용수익은 왜 빼나요?

전세보다 월세 보증금이 낮으면 그 차액만큼 현금이 남습니다. 이 금액을 예금이나 투자로 운용할 수 있으므로 월세의 실질 비용에서 차감합니다.

### Q4. 관리비도 포함해야 하나요?

전세와 월세 모두 동일한 관리비라면 비교 결과에 큰 영향은 없습니다. 다만 월세 조건에 관리비가 포함되거나 차이가 있다면 반드시 입력하는 것이 좋습니다.

### Q5. 전월세 전환율과 이 계산기는 같은 건가요?

다릅니다. 전월세 전환율은 보증금을 월세로 전환할 때의 기준이고, 이 계산기는 실제 거주자가 부담하는 총비용을 비교하는 도구입니다.

---

## 10. 계산기 UX 추천

| 기능          | 추천 여부 | 이유              |
| ----------- | ----- | --------------- |
| 실시간 자동 계산   | 필수    | 입력값 변경 즉시 결과 확인 |
| 전세/월세 결과 카드 | 필수    | 모바일 가독성 좋음      |
| 손익분기 월세 표시  | 필수    | 재방문 유도 강함       |
| 금리 슬라이더     | 추천    | 금리 변화 시나리오 확인   |
| 운용수익률 슬라이더  | 추천    | 예금/투자 성향 반영     |
| 예시 자동 채우기   | 추천    | 초보자 진입 장벽 감소    |
| 결과 공유하기     | 추천    | 카카오톡/링크 공유 유도   |
| CSV 다운로드    | 선택    | 실수요자보다는 과함      |

---

## 11. 기본 예시 데이터 세트

| 시나리오       | 전세보증금 |   월세 조건 | 전세대출금리 | 운용수익률 | 예상 결과    |
| ---------- | ----: | ------: | -----: | ----: | -------- |
| 수도권 중형 아파트 |    3억 |  5천/80만 |   4.0% |  3.0% | 월세 유리 가능 |
| 서울 소형 아파트  |    4억 | 1억/100만 |   3.5% |  3.0% | 조건별 비슷   |
| 지방 아파트     |  1.5억 |  2천/50만 |   4.0% |  2.5% | 전세 유리 가능 |
| 고금리 시나리오   |    3억 |  5천/80만 |   5.5% |  3.5% | 월세 유리 가능 |
| 저금리 시나리오   |    3억 |  5천/80만 |   2.5% |  2.0% | 전세 유리 가능 |

---

## 12. 개발 구현용 데이터 모델

```ts
export interface JeonseVsWolseInput {
  jeonseDeposit: number;
  jeonseLoanAmount: number;
  jeonseLoanRate: number;
  wolseDeposit: number;
  monthlyRent: number;
  monthlyMaintenanceFee: number;
  includeMaintenanceFee: boolean;
  investmentReturnRate: number;
  livingMonths: number;
}

export interface JeonseVsWolseResult {
  jeonseEquity: number;
  jeonseLoanInterestCost: number;
  jeonseOpportunityCost: number;
  jeonseTotalCost: number;

  wolseRentTotal: number;
  wolseDepositOpportunityCost: number;
  remainingCash: number;
  remainingCashReturn: number;
  wolseTotalCost: number;

  difference: number;
  betterOption: 'JEONSE' | 'WOLSE' | 'SAME';
  breakevenMonthlyRent: number;
}
```

---

## 13. 계산 함수 예시

```ts
export function calculateJeonseVsWolse(
  input: JeonseVsWolseInput
): JeonseVsWolseResult {
  const {
    jeonseDeposit,
    jeonseLoanAmount,
    jeonseLoanRate,
    wolseDeposit,
    monthlyRent,
    monthlyMaintenanceFee,
    includeMaintenanceFee,
    investmentReturnRate,
    livingMonths,
  } = input;

  const years = livingMonths / 12;

  const jeonseEquity = Math.max(jeonseDeposit - jeonseLoanAmount, 0);

  const jeonseLoanInterestCost =
    jeonseLoanAmount * (jeonseLoanRate / 100) * years;

  const jeonseOpportunityCost =
    jeonseEquity * (investmentReturnRate / 100) * years;

  const jeonseTotalCost =
    jeonseLoanInterestCost + jeonseOpportunityCost;

  const effectiveMonthlyRent = includeMaintenanceFee
    ? monthlyRent + monthlyMaintenanceFee
    : monthlyRent;

  const wolseRentTotal = effectiveMonthlyRent * livingMonths;

  const wolseDepositOpportunityCost =
    wolseDeposit * (investmentReturnRate / 100) * years;

  const remainingCash = Math.max(jeonseEquity - wolseDeposit, 0);

  const remainingCashReturn =
    remainingCash * (investmentReturnRate / 100) * years;

  const wolseTotalCost =
    wolseRentTotal + wolseDepositOpportunityCost - remainingCashReturn;

  const difference = jeonseTotalCost - wolseTotalCost;

  const betterOption =
    Math.abs(difference) < 1
      ? 'SAME'
      : difference > 0
        ? 'WOLSE'
        : 'JEONSE';

  const breakevenMonthlyRent =
    (jeonseTotalCost - wolseDepositOpportunityCost + remainingCashReturn) /
    livingMonths;

  return {
    jeonseEquity,
    jeonseLoanInterestCost,
    jeonseOpportunityCost,
    jeonseTotalCost,
    wolseRentTotal,
    wolseDepositOpportunityCost,
    remainingCash,
    remainingCashReturn,
    wolseTotalCost,
    difference,
    betterOption,
    breakevenMonthlyRent,
  };
}
```

---

## 14. JSON-LD 구조화 데이터

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "아파트 월세 vs 전세 손익 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "전세대출 이자, 보증금 기회비용, 월세 납부액을 비교해 전세와 월세 중 어느 쪽이 유리한지 계산하는 도구입니다.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  }
}
```

---

## 15. 내부링크 추천

| 연결 콘텐츠        | 앵커 텍스트                     |
| ------------- | -------------------------- |
| 전월세 전환율 계산기   | 전세를 월세로 바꾸면 적정 월세는 얼마일까?   |
| 중도상환수수료 계산기   | 전세대출을 중도상환하면 수수료는 얼마일까?    |
| 주택담보대출 이자 계산기 | 대출금리별 월 이자 계산하기            |
| 청약 가점 계산기     | 내 청약 가점으로 어느 지역을 노릴 수 있을까? |
| 부동산 보유비용 계산기  | 집을 살 때 드는 실제 유지비 계산하기      |

---

## 16. 최종 추천 포지셔닝

이 계산기는 단순히 “전세 vs 월세”를 비교하는 도구가 아니라, 아래 문구로 잡는 게 좋습니다.

> **전세대출 금리 시대의 실질 주거비 계산기**
> 월세 80만 원이 비싸 보이지만, 전세대출 이자와 보증금 기회비용까지 계산하면 결과가 달라질 수 있습니다.

비교계산소에서는 이 콘텐츠를 **부동산 카테고리의 핵심 유입형 계산기**로 배치하는 게 좋습니다. 특히 금리 변화, 보증금 규모, 거주 기간에 따라 결과가 계속 달라지기 때문에 반복 방문성이 높습니다.

[1]: https://www.law.go.kr/LSW//lsSideInfoP.do?docCls=jo&joBrNo=02&joNo=0007&lsiSeq=276291&urlMode=lsScJoRltInfoR&utm_source=chatgpt.com "주택임대차보호법 ( 약칭: 주택임대차법 )"
