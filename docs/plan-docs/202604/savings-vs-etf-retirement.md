# 월 적금 vs ETF 노후 계산기 – 비교계산소 웹콘텐츠 기획서 v1

## 1. 기본 정보

| 항목       | 내용                                                         |
| -------- | ---------------------------------------------------------- |
| Title    | 월 적금 vs ETF 노후 계산기                                         |
| Type     | calculator                                                 |
| Category | 투자/연금/노후                                                   |
| Keyword  | 노후 준비 적금 ETF 비교 계산기                                        |
| Path     | `/tools/savings-vs-etf-retirement/`                        |
| Target   | 20~50대 직장인, FIRE 준비자, 연금저축·IRP 투자자, 월급 일부를 노후자금으로 모으려는 사용자 |
| 핵심 질문    | “월 30만 원을 적금에 넣는 것과 ETF에 투자하는 것, 은퇴 시점에 얼마나 차이 날까?”        |
| 핵심 출력    | 적금 총액, ETF 예상 총액, 물가 반영 실질가치, 은퇴 후 월 생활비 커버 기간, 자산 고갈 시점   |

---

## 2. 콘텐츠 핵심 컨셉

> **같은 월 납입액이라도 적금과 ETF는 20년, 30년 뒤 결과가 완전히 달라진다.**
> 이 계산기는 “얼마 모이나?”가 아니라 **“은퇴 후 몇 년을 버틸 수 있나?”**를 보여주는 노후 준비 계산기다.

노후 계산기는 단순 복리 계산보다 다음 4가지가 중요합니다.

| 핵심 비교축      | 설명                          |
| ----------- | --------------------------- |
| 명목 자산       | 은퇴 시점에 계좌에 찍히는 금액           |
| 실질 구매력      | 물가상승률을 반영한 현재가치             |
| 월 생활비 커버 기간 | 은퇴 후 월 생활비 기준 몇 년치인지        |
| 자산 고갈 시점    | 은퇴 후 매월 인출하면 몇 세에 자산이 바닥나는지 |

통계청의 2025 고령자 통계에 따르면 2023년 기준 65세의 기대여명은 21.5년입니다. 은퇴 후에도 20년 이상 현금흐름이 필요할 수 있다는 의미라서, 노후 계산기는 “은퇴 시점 총액”뿐 아니라 “인출 가능 기간”까지 보여주는 구조가 좋습니다. ([국가데이터처][1])

---

## 3. SEO 메타 정보

| 항목                 | 제안                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| SEO Title          | 월 적금 vs ETF 노후 계산기 – 은퇴 시점 자산과 실질 구매력 비교                                                            |
| Meta Description   | 현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점 적금과 ETF 자산, 실질 구매력, 월 생활비 커버 기간을 계산합니다. |
| H1                 | 월 적금 vs ETF 노후 계산기                                                                                  |
| Primary Keyword    | 노후 준비 적금 ETF 비교 계산기                                                                                 |
| Secondary Keywords | 적금 ETF 비교, 노후자금 계산기, ETF 장기투자 계산기, 은퇴자금 계산기, 물가상승률 반영 계산기                                           |
| 검색 의도              | 월급 일부를 어떻게 굴릴지 비교                                                                                   |
| 콘텐츠 성격             | 계산기 + 노후 준비 가이드 + 연금저축/IRP 내부링크 허브                                                                  |

---

## 4. 추천 URL

```txt
/tools/savings-vs-etf-retirement/
```

연결하면 좋은 내부 링크:

```txt
/tools/retirement-savings-calculator/
/tools/dca-investment-calculator/
/tools/retirement-withdrawal-calculator/
/tools/irp-tax-saving-calculator/
/reports/retirement-pension-dc-db-irp-2026/
/reports/pension-savings-irp-comparison-2026/
```

---

# 5. 계산기 입력값 설계

## 5.1 기본 입력값

| 입력값         | 타입      |     기본값 예시 | 설명                  |
| ----------- | ------- | ---------: | ------------------- |
| 현재 나이       | number  |        35세 | 투자 시작 나이            |
| 은퇴 목표 나이    | number  |        60세 | 투자 종료 시점            |
| 월 투자 가능 금액  | number  |   500,000원 | 매월 적금 또는 ETF에 넣을 금액 |
| 적금 금리       | percent |       3.5% | 연 이율                |
| ETF 기대 수익률  | percent |       7.0% | 연평균 기대수익률           |
| 물가상승률       | percent |       2.5% | 실질 구매력 계산용          |
| 은퇴 후 월 생활비  | number  | 2,500,000원 | 자산 커버 기간 계산용        |
| 은퇴 후 기대 수익률 | percent |       3.0% | 은퇴 후 인출 시뮬레이션용      |

---

## 5.2 고급 입력값

| 입력값          | 타입      | 설명                       |
| ------------ | ------- | ------------------------ |
| 투자 방식        | select  | 월초 납입 / 월말 납입            |
| 세금 반영 여부     | toggle  | 이자소득세, 배당소득세 간략 반영       |
| ETF 보수율      | percent | 연 0.03~0.5% 등 사용자가 직접 입력 |
| ETF 변동성 시나리오 | select  | 보수적 / 중립 / 공격적           |
| 연금계좌 활용 여부   | toggle  | 연금저축·IRP 세액공제 CTA 연결     |
| 은퇴 후 인출 방식   | select  | 정액 인출 / 물가연동 인출          |
| 국민연금 예상액     | number  | 월 예상 연금 입력 시 부족분 계산      |

---

# 6. 핵심 계산 로직

## 6.1 투자 기간 계산

```txt
투자기간 = 은퇴 목표 나이 - 현재 나이
```

예시:

| 항목       |   값 |
| -------- | --: |
| 현재 나이    | 35세 |
| 은퇴 목표 나이 | 60세 |
| 투자기간     | 25년 |

---

## 6.2 월 적립식 미래가치 공식

```txt
미래가치 = 월 납입액 × {[(1 + 월수익률) ^ 총개월수 - 1] ÷ 월수익률}
```

월수익률:

```txt
월수익률 = (1 + 연수익률) ^ (1 / 12) - 1
```

적금과 ETF를 같은 공식으로 계산하되, 각각 다른 연수익률을 넣습니다.

| 구분  |               적용 수익률 |
| --- | -------------------: |
| 적금  |                적금 금리 |
| ETF | ETF 기대 수익률 - ETF 보수율 |

---

## 6.3 실질 구매력 계산

```txt
실질 구매력 = 은퇴 시점 명목 자산 ÷ (1 + 물가상승률) ^ 투자기간
```

예를 들어 25년 뒤 5억 원이 있어도 물가가 매년 2.5%씩 오른다면 현재 기준 구매력은 크게 줄어듭니다. 한국은행은 물가 관련 지표와 경제전망 데이터를 별도로 공개하고 있어, 계산기 기본값은 한국은행 전망·최근 물가 흐름을 참고해 주기적으로 업데이트하는 구조가 좋습니다. ([금융경제 스냅샷][2])

---

## 6.4 월 생활비 커버 기간

```txt
커버 가능 개월 수 = 은퇴 시점 자산 ÷ 은퇴 후 월 생활비
```

```txt
커버 가능 연수 = 커버 가능 개월 수 ÷ 12
```

단순 버전은 수익률 없이 계산하고, 고급 버전은 은퇴 후 운용수익률을 반영합니다.

---

## 6.5 은퇴 후 자산 고갈 시점

은퇴 후 매월 일정 금액을 인출할 때 자산이 언제 고갈되는지 반복 계산합니다.

```txt
매월 자산 = 직전월 자산 × (1 + 은퇴 후 월수익률) - 월 인출액
```

반복 조건:

```txt
자산 <= 0 이 되는 시점 = 자산 고갈 시점
```

---

# 7. 결과 화면 설계

## 7.1 핵심 결과 카드

| 카드          |       표시값 예시 | 설명            |
| ----------- | -----------: | ------------- |
| 적금 예상 총액    |  2억 4,800만 원 | 은퇴 시점 명목 금액   |
| ETF 예상 총액   |    4억 500만 원 | 은퇴 시점 명목 금액   |
| ETF 추가 자산   | +1억 5,700만 원 | ETF와 적금 차이    |
| 적금 실질가치     |  1억 3,300만 원 | 현재 구매력 기준     |
| ETF 실질가치    |  2억 1,700만 원 | 현재 구매력 기준     |
| 적금 생활비 커버   |         8.2년 | 월 250만 원 기준   |
| ETF 생활비 커버  |        13.5년 | 월 250만 원 기준   |
| 자산 고갈 예상 나이 |          73세 | 은퇴 후 인출 시뮬레이션 |

---

## 7.2 결과 메시지 예시

```md
현재 조건에서는 월 50만 원을 25년간 납입할 경우,
적금은 약 2억 4,800만 원, ETF는 약 4억 500만 원으로 예상됩니다.

물가상승률 2.5%를 반영하면 현재 구매력 기준으로는
적금 약 1억 3,300만 원, ETF 약 2억 1,700만 원 수준입니다.

월 생활비 250만 원 기준으로 적금은 약 8.2년,
ETF는 약 13.5년을 커버할 수 있습니다.
```

---

# 8. 예시 시뮬레이션 표

## 8.1 월 30만 원 투자 기준

| 현재 나이 | 은퇴 나이 | 투자기간 |    적금 3.5% |   ETF 7.0% |         차이 |
| ----: | ----: | ---: | ---------: | ---------: | ---------: |
|   30세 |   60세 |  30년 |   약 1.9억 원 |   약 3.7억 원 |   약 1.8억 원 |
|   35세 |   60세 |  25년 |   약 1.5억 원 |   약 2.4억 원 |   약 0.9억 원 |
|   40세 |   60세 |  20년 |   약 1.0억 원 |   약 1.6억 원 |   약 0.6억 원 |
|   45세 |   60세 |  15년 | 약 7,000만 원 | 약 9,500만 원 | 약 2,500만 원 |

---

## 8.2 월 100만 원 투자 기준

| 현재 나이 | 은퇴 나이 | 투자기간 |  적금 3.5% |  ETF 7.0% |       차이 |
| ----: | ----: | ---: | -------: | --------: | -------: |
|   30세 |   60세 |  30년 | 약 6.3억 원 | 약 12.3억 원 | 약 6.0억 원 |
|   35세 |   60세 |  25년 | 약 4.9억 원 |  약 8.1억 원 | 약 3.2억 원 |
|   40세 |   60세 |  20년 | 약 3.4억 원 |  약 5.2억 원 | 약 1.8억 원 |
|   45세 |   60세 |  15년 | 약 2.3억 원 |  약 3.2억 원 | 약 0.9억 원 |

---

# 9. 적금 vs ETF 비교 해설 섹션

## 9.1 적금이 유리한 경우

| 조건                | 설명                      |
| ----------------- | ----------------------- |
| 원금 손실을 절대 피하고 싶다  | ETF는 시장 하락 시 손실 가능      |
| 투자 기간이 짧다         | 1~3년 단기 자금은 적금이 안정적     |
| 전세금·주택자금 등 목적자금이다 | 필요 시점이 정해진 돈은 안정성이 중요   |
| 변동성을 견디기 어렵다      | ETF는 장기적으로도 중간 하락 구간 존재 |

---

## 9.2 ETF가 유리한 경우

| 조건              | 설명                    |
| --------------- | --------------------- |
| 투자 기간이 10년 이상이다 | 복리 효과가 커짐             |
| 매월 꾸준히 투자할 수 있다 | 적립식 분산투자 효과           |
| 물가상승률을 이기고 싶다   | 예금성 상품은 실질가치가 줄 수 있음  |
| 은퇴자산을 키우고 싶다    | 장기 기대수익률이 적금보다 높을 가능성 |

---

## 9.3 본문 해설 예시

```md
적금은 안정성이 높지만, 장기 노후자금 관점에서는 물가상승률을 이기는지가 중요합니다.

예를 들어 적금 금리가 연 3.5%이고 물가상승률이 2.5%라면 실질 수익률은 약 1% 수준입니다.  
반면 ETF는 단기 손실 가능성이 있지만, 20년 이상 장기 투자에서는 복리 효과가 커질 수 있습니다.

따라서 1~3년 안에 써야 할 돈은 적금, 10년 이상 묶어둘 수 있는 노후자금은 ETF나 연금계좌를 함께 검토하는 방식이 현실적입니다.
```

---

# 10. 은퇴 후 인출 시뮬레이션

## 10.1 기본 UX

사용자가 은퇴 후 월 인출액을 입력하면 다음을 보여줍니다.

| 출력값           | 설명            |
| ------------- | ------------- |
| 월 인출액         | 은퇴 후 생활비      |
| 인출 시작 나이      | 은퇴 목표 나이      |
| 자산 고갈 나이      | 자산이 0원이 되는 나이 |
| 90세까지 필요 추가자금 | 부족분 계산        |
| 국민연금 차감 후 부족액 | 월 부족 현금흐름 계산  |

---

## 10.2 결과 예시

| 구분          |     적금 |    ETF |
| ----------- | -----: | -----: |
| 은퇴 시 자산     | 2.5억 원 | 4.1억 원 |
| 월 인출액       | 250만 원 | 250만 원 |
| 은퇴 후 수익률    |   2.0% |   3.5% |
| 자산 고갈 시점    |    68세 |    75세 |
| 90세까지 부족 기간 |    22년 |    15년 |

---

# 11. 연금저축·IRP 연결 섹션

이 계산기는 일반 적금과 ETF 비교에서 끝내지 말고, 연금저축·IRP CTA를 넣으면 전환이 좋습니다.

연금저축과 IRP는 노후자금 마련뿐 아니라 세액공제 혜택 때문에 비교계산소 내 연금 콘텐츠와 강하게 연결됩니다. 미래에셋증권의 2026 연금계좌 안내 기준으로 연금저축 세액공제 대상 납입한도는 600만 원, IRP를 포함하면 총 900만 원까지이며, 총급여 구간에 따라 13.2% 또는 16.5%의 세액공제율이 적용됩니다. ([미래에셋증권][3])

```md
ETF를 일반 계좌에서 투자할 수도 있지만, 노후 목적이라면 연금저축펀드나 IRP 계좌를 함께 검토할 수 있습니다.

연금계좌를 활용하면 장기 투자와 세액공제 효과를 동시에 노릴 수 있습니다.  
다만 중도해지 시 세금 부담이 생길 수 있으므로, 최소 55세 이후 연금 수령 목적의 자금에 적합합니다.
```

---

# 12. 사용자 유형별 추천 결과

| 사용자 유형       | 추천 방향                | 이유                |
| ------------ | -------------------- | ----------------- |
| 20~30대 장기투자자 | ETF 비중 확대            | 투자기간이 길어 복리 효과 큼  |
| 40대 직장인      | ETF + 연금저축 병행        | 노후 준비와 세액공제 동시 고려 |
| 50대 은퇴준비자    | 적금·채권형 ETF·배당 ETF 혼합 | 변동성 관리 필요         |
| 원금손실 싫은 사용자  | 적금 중심                | 심리적 안정성이 중요       |
| FIRE 목표 사용자  | ETF 중심 + 생활비 계산      | 목표 은퇴자산 역산 필요     |
| 자녀교육비 준비자    | 적금 또는 단기채 중심         | 사용 시점이 정해진 자금     |

---

# 13. 계산기 UX 플로우

## Step 1. 기본 정보 입력

```txt
현재 나이, 은퇴 목표 나이, 월 투자 가능 금액을 입력합니다.
```

## Step 2. 수익률 가정 입력

```txt
적금 금리, ETF 기대수익률, 물가상승률을 입력합니다.
```

## Step 3. 은퇴 후 생활비 입력

```txt
은퇴 후 필요한 월 생활비를 입력합니다.
```

## Step 4. 결과 비교

```txt
적금 총액, ETF 총액, 실질 구매력, 월 생활비 커버 기간을 비교합니다.
```

## Step 5. 인출 시뮬레이션

```txt
은퇴 후 매월 인출하면 몇 세에 자산이 고갈되는지 확인합니다.
```

---

# 14. 화면 구성안

## 14.1 상단 도입부

```md
# 월 적금 vs ETF 노후 계산기

매월 같은 금액을 넣어도 적금과 ETF는 은퇴 시점 결과가 크게 달라질 수 있습니다.

이 계산기는 현재 나이, 은퇴 목표 나이, 월 투자 가능 금액, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점의 예상 자산과 실질 구매력을 비교해줍니다.

또한 은퇴 후 매월 생활비를 인출하면 자산이 몇 세까지 버틸 수 있는지도 함께 계산할 수 있습니다.
```

---

## 14.2 입력 영역

```md
## 내 노후자금 조건 입력

- 현재 나이
- 은퇴 목표 나이
- 월 투자 가능 금액
- 적금 금리
- ETF 기대수익률
- 물가상승률
- 은퇴 후 월 생활비
- 은퇴 후 운용수익률
```

---

## 14.3 결과 영역

```md
## 계산 결과

| 항목 | 적금 | ETF |
|---|---:|---:|
| 은퇴 시점 예상 자산 | 2억 4,800만 원 | 4억 500만 원 |
| 현재가치 환산 | 1억 3,300만 원 | 2억 1,700만 원 |
| 월 250만 원 생활비 커버 | 8.2년 | 13.5년 |
| 자산 고갈 예상 나이 | 68세 | 75세 |

ETF는 적금보다 예상 자산이 크지만, 투자 기간 중 손실 구간이 발생할 수 있습니다.  
노후자금은 기대수익률뿐 아니라 변동성, 세금, 인출 시점까지 함께 고려해야 합니다.
```

---

# 15. 애드센스/제휴 배치 전략

| 위치          | 광고/CTA           |   추천도 | 이유              |
| ----------- | ---------------- | ----: | --------------- |
| 계산기 상단 하단   | 애드센스 디스플레이       | ★★★☆☆ | 금융 관심 사용자 초반 노출 |
| 결과 카드 하단    | 연금저축·IRP 리포트 CTA | ★★★★★ | 노후 준비 관심도 높음    |
| ETF 결과 하단   | ETF 비교 리포트 CTA   | ★★★★☆ | 투자 콘텐츠 회전 가능    |
| 자산 고갈 시점 하단 | 노후자금 고갈 계산기 CTA  | ★★★★★ | 체류시간 증가         |
| FAQ 상단      | 인아티클 광고          | ★★★☆☆ | 스크롤 이후 노출       |
| 하단 관련 콘텐츠   | 내부링크 카드          | ★★★★★ | SEO 구조 강화       |

---

# 16. FAQ 섹션

```md
## 자주 묻는 질문

### Q1. 노후 준비는 적금과 ETF 중 무엇이 더 좋나요?
정답은 투자 기간과 위험 성향에 따라 다릅니다. 1~3년 안에 써야 할 돈은 적금이 적합하고, 10년 이상 장기 노후자금은 ETF를 함께 검토할 수 있습니다.

### Q2. ETF 기대수익률은 몇 %로 넣어야 하나요?
보수적으로는 4~5%, 중립적으로는 6~7%, 공격적으로는 8% 이상을 가정할 수 있습니다. 다만 실제 수익률은 시장 상황에 따라 크게 달라질 수 있습니다.

### Q3. 물가상승률은 왜 입력해야 하나요?
은퇴 시점의 5억 원과 현재의 5억 원은 구매력이 다릅니다. 물가상승률을 반영해야 실제 생활비 기준으로 얼마나 가치가 있는지 알 수 있습니다.

### Q4. 월 생활비 커버 기간은 어떻게 계산하나요?
은퇴 시점 예상 자산을 은퇴 후 월 생활비로 나누어 계산합니다. 고급 계산에서는 은퇴 후 운용수익률도 함께 반영할 수 있습니다.

### Q5. 연금저축이나 IRP도 계산에 포함해야 하나요?
노후 목적의 장기자금이라면 포함하는 것이 좋습니다. 연금저축과 IRP는 세액공제 혜택이 있으므로 일반 ETF 투자와 별도로 비교할 가치가 있습니다.

### Q6. ETF는 원금 손실 가능성이 있나요?
네. ETF는 시장 가격이 변동되므로 단기적으로 손실이 발생할 수 있습니다. 그래서 은퇴 시점이 가까울수록 안전자산 비중을 높이는 전략이 필요합니다.
```

---

# 17. 개발 구현 포인트

## 17.1 계산 함수 예시

```ts
type RetirementCompareInput = {
  currentAge: number;
  retirementAge: number;
  monthlyAmount: number;
  savingsAnnualRate: number;
  etfAnnualReturn: number;
  inflationRate: number;
  monthlyLivingCost: number;
  postRetirementReturn: number;
};

type RetirementAssetResult = {
  yearsToRetirement: number;
  monthsToRetirement: number;
  savingsFutureValue: number;
  etfFutureValue: number;
  savingsRealValue: number;
  etfRealValue: number;
  difference: number;
  savingsCoverYears: number;
  etfCoverYears: number;
  savingsDepletionAge: number | null;
  etfDepletionAge: number | null;
};

function getMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

function calculateMonthlyContributionFutureValue(
  monthlyAmount: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = getMonthlyRate(annualRate);

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function calculateRealValue(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  return futureValue / Math.pow(1 + inflationRate / 100, years);
}

function calculateDepletionAge(
  initialAsset: number,
  retirementAge: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  maxAge = 100
): number | null {
  let asset = initialAsset;
  const monthlyRate = getMonthlyRate(annualReturn);
  const maxMonths = (maxAge - retirementAge) * 12;

  for (let month = 1; month <= maxMonths; month += 1) {
    asset = asset * (1 + monthlyRate) - monthlyWithdrawal;

    if (asset <= 0) {
      return retirementAge + Math.floor(month / 12);
    }
  }

  return null;
}

export function calculateSavingsVsEtfRetirement(
  input: RetirementCompareInput
): RetirementAssetResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;

  const savingsFutureValue = calculateMonthlyContributionFutureValue(
    input.monthlyAmount,
    input.savingsAnnualRate,
    monthsToRetirement
  );

  const etfFutureValue = calculateMonthlyContributionFutureValue(
    input.monthlyAmount,
    input.etfAnnualReturn,
    monthsToRetirement
  );

  const savingsRealValue = calculateRealValue(
    savingsFutureValue,
    input.inflationRate,
    yearsToRetirement
  );

  const etfRealValue = calculateRealValue(
    etfFutureValue,
    input.inflationRate,
    yearsToRetirement
  );

  const savingsCoverYears = savingsFutureValue / input.monthlyLivingCost / 12;
  const etfCoverYears = etfFutureValue / input.monthlyLivingCost / 12;

  return {
    yearsToRetirement,
    monthsToRetirement,
    savingsFutureValue: Math.round(savingsFutureValue),
    etfFutureValue: Math.round(etfFutureValue),
    savingsRealValue: Math.round(savingsRealValue),
    etfRealValue: Math.round(etfRealValue),
    difference: Math.round(etfFutureValue - savingsFutureValue),
    savingsCoverYears: Number(savingsCoverYears.toFixed(1)),
    etfCoverYears: Number(etfCoverYears.toFixed(1)),
    savingsDepletionAge: calculateDepletionAge(
      savingsFutureValue,
      input.retirementAge,
      input.monthlyLivingCost,
      input.postRetirementReturn
    ),
    etfDepletionAge: calculateDepletionAge(
      etfFutureValue,
      input.retirementAge,
      input.monthlyLivingCost,
      input.postRetirementReturn
    ),
  };
}
```

---

## 17.2 결과 메시지 함수

```ts
export function getRetirementCompareMessage(result: RetirementAssetResult): string {
  const gap = result.difference.toLocaleString();

  if (result.difference > 0) {
    return `ETF 예상 자산이 적금보다 약 ${gap}원 더 많습니다. 다만 ETF는 시장 변동에 따라 손실 구간이 발생할 수 있으므로 투자 기간과 위험 성향을 함께 고려해야 합니다.`;
  }

  if (result.difference < 0) {
    return `현재 입력 조건에서는 적금 예상 자산이 ETF보다 높게 나옵니다. ETF 기대수익률, 보수율, 투자 기간을 다시 확인해보세요.`;
  }

  return "현재 입력 조건에서는 적금과 ETF의 예상 자산이 비슷합니다.";
}
```

---

# 18. 프리셋 데이터 구조 예시

```ts
export const retirementScenarioPresets = [
  {
    label: "보수형",
    description: "원금 안정성을 중시하는 사용자",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 4.5,
    inflationRate: 2.5,
    postRetirementReturn: 2.0,
  },
  {
    label: "중립형",
    description: "적금과 ETF를 균형 있게 보는 사용자",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 7.0,
    inflationRate: 2.5,
    postRetirementReturn: 3.0,
  },
  {
    label: "공격형",
    description: "장기 ETF 투자 비중을 높게 보는 사용자",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 9.0,
    inflationRate: 2.5,
    postRetirementReturn: 4.0,
  },
];
```

---

# 19. 최종 MD 초안

```md
---
title: "월 적금 vs ETF 노후 계산기"
description: "현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점 적금과 ETF 자산, 실질 구매력, 월 생활비 커버 기간을 계산합니다."
category: "투자/연금/노후"
type: "calculator"
keyword: "노후 준비 적금 ETF 비교 계산기"
path: "/tools/savings-vs-etf-retirement/"
updated: "2026-04-27"
---

# 월 적금 vs ETF 노후 계산기

매월 같은 금액을 넣어도 적금과 ETF는 은퇴 시점 결과가 크게 달라질 수 있습니다.

이 계산기는 현재 나이, 은퇴 목표 나이, 월 투자 가능 금액, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점의 예상 자산과 실질 구매력을 비교해줍니다.

또한 은퇴 후 매월 생활비를 인출하면 자산이 몇 세까지 버틸 수 있는지도 함께 계산할 수 있습니다.

## 입력값

- 현재 나이
- 은퇴 목표 나이
- 월 투자 가능 금액
- 적금 금리
- ETF 기대수익률
- 물가상승률
- 은퇴 후 월 생활비
- 은퇴 후 운용수익률

## 계산 결과

- 은퇴 시점 적금 예상 총액
- 은퇴 시점 ETF 예상 총액
- ETF와 적금의 예상 차이
- 물가상승률 반영 실질 구매력
- 월 생활비 기준 커버 가능 기간
- 은퇴 후 자산 고갈 예상 나이

## 계산 공식

월 적립식 미래가치는 다음 방식으로 계산합니다.

미래가치 = 월 납입액 × {[(1 + 월수익률) ^ 총개월수 - 1] ÷ 월수익률}

실질 구매력은 다음 방식으로 계산합니다.

실질 구매력 = 은퇴 시점 명목 자산 ÷ (1 + 물가상승률) ^ 투자기간

## 적금이 유리한 경우

- 원금 손실을 피하고 싶을 때
- 1~3년 안에 사용할 돈일 때
- 전세금, 주택자금, 결혼자금처럼 목적이 정해진 돈일 때
- 시장 변동성을 견디기 어려울 때

## ETF가 유리한 경우

- 투자 기간이 10년 이상일 때
- 매월 꾸준히 투자할 수 있을 때
- 물가상승률을 이기는 자산 증식을 원할 때
- 은퇴자산을 장기적으로 키우고 싶을 때

## 은퇴 후 인출 시뮬레이션

은퇴 시점 예상 자산에서 매월 생활비를 인출하면 자산이 언제 고갈되는지 계산할 수 있습니다.

월 250만 원을 인출한다고 가정하면, 적금과 ETF의 자산 고갈 시점이 크게 달라질 수 있습니다.

## 주의사항

이 계산기는 입력값을 기준으로 한 예상 결과입니다.  
ETF 수익률은 확정 수익이 아니며, 실제 투자 결과는 시장 상황에 따라 달라질 수 있습니다.

적금 금리, ETF 수익률, 물가상승률, 세금, 계좌 유형에 따라 실제 결과는 달라질 수 있으므로 참고용으로 활용하시기 바랍니다.
```

---

# 20. 구현 파일 구조 추천

```txt
src/pages/tools/savings-vs-etf-retirement.astro
src/components/calculators/SavingsVsEtfRetirementCalculator.tsx
src/components/calculators/RetirementResultCard.tsx
src/components/calculators/RetirementDepletionChart.tsx
src/data/retirementScenarioPresets.ts
src/utils/calculateSavingsVsEtfRetirement.ts
src/utils/formatCurrency.ts
```

---

# 21. 차별화 포인트

| 일반 계산기       | 비교계산소 계산기            |
| ------------ | -------------------- |
| 적금 이자만 계산    | 적금 vs ETF 장기 비교      |
| 명목 금액만 표시    | 물가 반영 실질 구매력 표시      |
| 은퇴 시점 총액만 표시 | 월 생활비 몇 년치인지 표시      |
| 단순 복리 계산     | 은퇴 후 자산 고갈 시점 계산     |
| 1회성 계산       | 나이·금액·수익률 반복 입력 유도   |
| 금융상품 설명 부족   | 연금저축·IRP·노후자금 리포트 연결 |

---

## 최종 한줄 요약

> 이 계산기는 **“월 30만 원을 어디에 넣을까?”를 “은퇴 후 몇 년을 버틸 수 있을까?”로 확장하는 노후 준비형 비교 계산기**로 설계하면 검색 유입, 반복 사용, 내부 연금 콘텐츠 전환을 동시에 노릴 수 있습니다.

[1]: https://www.kostat.go.kr/board.es?act=view&bid=10820&list_no=438832&mid=a10301010000&utm_source=chatgpt.com "2025 고령자 통계 | 전체 | 보도자료 | 새소식 : 국가데이터처"
[2]: https://snapshot.bok.or.kr/dashboard/C10?utm_source=chatgpt.com "경제전망"
[3]: https://digital.securities.miraeasset.com/personal-pension/?utm_source=chatgpt.com "투자하는 연금 | 2026 연말정산 지원금·개인연금·IRP"
