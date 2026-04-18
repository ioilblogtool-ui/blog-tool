# IRP 연금 계산기 구현 설계 문서

> 기획 문서: `docs/plan/202604/irp-pension-calculator.md`
> 작성일: 2026-04-17
> 구현 기준: Codex/Claude가 이 문서만 보고 바로 페이지 구현을 시작할 수 있는 수준
> 참고 계산기: `national-pension-calculator`, `dca-investment-calculator`, `fire-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 슬러그: `irp-pension-calculator`
- URL: `/tools/irp-pension-calculator/`
- 콘텐츠 유형: 계산기 (`/tools/`)
- 카테고리: 투자·재테크

### 1-2. 페이지 정의

> 현재 IRP·퇴직연금 적립금, 월 추가 납입액, 기대 수익률, 은퇴 시점과 수령 기간을 입력하면
> 은퇴 시점 적립금, 월 예상 수령액, 일시금 대비 차이를 추정해 보여주는 계산기

### 1-3. 구현 원칙

- 공식 확정 금액이 아니라 `추정 계산기`로 명확히 표시
- 세법 전체 재현보다 `미래가치 + 수령 방식 비교`에 집중
- 입력은 단순하고 결과는 강하게 노출
- 모바일에서도 입력과 결과를 빠르게 오가게 구성

---

## 2. 파일 구조

```text
src/
  data/
    irpPensionCalculator.ts
    tools.ts
  pages/
    tools/
      irp-pension-calculator.astro

public/
  scripts/
    irp-pension-calculator.js
  og/
    tools/
      irp-pension-calculator.png

src/styles/scss/pages/
  _irp-pension-calculator.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
  - slug, title, description, category 연결
- `src/styles/app.scss`
  - `@use "./scss/pages/irp-pension-calculator";`
- 필요 시 `public/sitemap.xml`

---

## 3. 레이아웃 구조

### 3-1. 기본 틀

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`

### 3-2. 권장 설정

- `pageClass="ipc-page"`
- `calculatorId="irp-pension-calculator"`
- `resultFirst={true}`

이 페이지는 사용자가 결과를 자주 다시 보게 되므로, 모바일에서는 결과 요약이 먼저 보이는 구조가 적합하다.

---

## 4. 데이터 파일 설계 (`irpPensionCalculator.ts`)

### 4-1. 타입 정의

```ts
export type PensionPayoutMode = "annuity" | "lump-sum";
export type PensionPeriod = 10 | 15 | 20 | 25 | 30;
export type ReturnPreset = 0.03 | 0.04 | 0.05 | 0.07;

export type IrpInput = {
  currentAge: number;
  retireAge: number;
  currentIrpBalance: number;
  currentDcBalance: number;
  monthlyContribution: number;
  annualReturnRate: number;
  payoutMode: PensionPayoutMode;
  annuityStartAge: number;
  annuityPeriod: PensionPeriod;
  applyPostRetirementReturn: boolean;
};
```

### 4-2. 기본 입력값

```ts
export const IRP_DEFAULT_INPUT: IrpInput = {
  currentAge: 35,
  retireAge: 60,
  currentIrpBalance: 10000000,
  currentDcBalance: 20000000,
  monthlyContribution: 300000,
  annualReturnRate: 0.04,
  payoutMode: "annuity",
  annuityStartAge: 60,
  annuityPeriod: 20,
  applyPostRetirementReturn: false,
};
```

### 4-3. 프리셋

```ts
export const IRP_PRESETS = [
  {
    id: "starter",
    label: "직장인 기본형",
    currentAge: 35,
    retireAge: 60,
    monthlyContribution: 300000,
    annualReturnRate: 0.04,
  },
  {
    id: "catch-up",
    label: "40대 추격형",
    currentAge: 45,
    retireAge: 60,
    monthlyContribution: 500000,
    annualReturnRate: 0.04,
  },
  {
    id: "stable",
    label: "보수적 운용형",
    currentAge: 40,
    retireAge: 60,
    monthlyContribution: 300000,
    annualReturnRate: 0.03,
  },
];
```

### 4-4. FAQ / 가이드 / 관련 링크

- `IRP_FAQ`
- `IRP_GUIDE_POINTS`
- `IRP_RELATED_LINKS`

관련 링크는 최소 3개:

- `/reports/pension-irp-comparison-2026/`
- `/tools/national-pension-calculator/`
- `/tools/retirement/`

---

## 5. 화면 구조

## 5-1. Hero

- eyebrow: `은퇴·연금 계산기`
- title: `IRP 적립금, 월 수령액, 일시금 차이를 한 번에 계산`
- description: “현재 적립금과 추가 납입액을 넣으면 은퇴 시점 적립금과 연금 수령 추정치를 확인”

## 5-2. 입력 패널

### 블록 A. 기본 정보

- 현재 나이
- 은퇴 예정 나이
- 연금 수령 시작 나이
- 연금 수령 기간

### 블록 B. 자산·납입 정보

- 현재 IRP 적립금
- 현재 DC/퇴직연금 적립금
- 월 추가 납입액
- 기대 수익률

### 블록 C. 수령 조건

- 수령 방식: 연금 수령 / 일시금
- 연금 수령 중 운용수익 반영 토글

### UX 포인트

- `수령 방식`은 카드형 라디오
- `기대 수익률`은 프리셋 칩 + 직접 입력
- 숫자 입력은 원 단위 콤마 자동

## 5-3. 결과 패널

### KPI 카드

- 은퇴 시점 예상 적립금
- 총 납입원금
- 예상 수익
- 월 예상 수령액

### 보조 결과

- 총 예상 수령액
- 일시금 수령 추정액
- 수령 방식별 해설

### 비교 테이블

| 항목 | 연금 수령 | 일시금 |
| --- | --- | --- |
| 초기 확보 자금 | 분할 | 즉시 확보 |
| 월 현금흐름 | 있음 | 없음 |
| 총액 비교 | 수령기간 기준 | 은퇴 시점 기준 |
| 적합 성향 | 생활비 흐름형 | 목돈 필요형 |

## 5-4. 민감도 분석

- 월 추가 납입 10만/30만/50만 원 비교
- 수익률 3/5/7% 비교
- 은퇴 나이 55/60/65 비교

## 5-5. 해설·SEO 영역

- “추정 계산” 배지
- 연금 vs 일시금 해설
- 추가 납입 효과 설명
- FAQ
- 관련 계산기/리포트 카드

---

## 6. 계산 로직

## 6-1. 적립 개월 수

```js
accumulationMonths = Math.max(0, (retireAge - currentAge) * 12);
```

## 6-2. 현재 자산 합산

```js
currentTotalBalance = currentIrpBalance + currentDcBalance;
```

## 6-3. 월 수익률

```js
monthlyRate = annualReturnRate / 12;
```

## 6-4. 은퇴 시점 적립금

```js
futureValue =
  currentTotalBalance * Math.pow(1 + monthlyRate, accumulationMonths) +
  monthlyContribution * ((Math.pow(1 + monthlyRate, accumulationMonths) - 1) / monthlyRate);
```

수익률이 0이면 단순 합산으로 처리한다.

## 6-5. 총 납입원금

```js
principal = currentTotalBalance + monthlyContribution * accumulationMonths;
```

## 6-6. 예상 수익

```js
expectedGain = futureValue - principal;
```

## 6-7. 월 예상 수령액

### MVP 기본식

```js
monthlyAnnuity = futureValue / (annuityPeriod * 12);
```

### 고급 옵션

`applyPostRetirementReturn`가 켜지면 수령 중 잔액 운용을 반영한 완화형 모델을 추가할 수 있다.
MVP에서는 단순식 우선.

## 6-8. 총 예상 수령액

```js
totalAnnuity = monthlyAnnuity * annuityPeriod * 12;
```

## 6-9. 일시금 수령액

```js
lumpSumAmount = futureValue;
```

---

## 7. 상태/예외 처리

- `은퇴 예정 나이 <= 현재 나이`면 계산 불가 메시지
- `연금 수령 시작 나이 < 현재 나이` 방지
- `연금 수령 시작 나이 < 은퇴 예정 나이`는 허용하지 않고 은퇴 나이 이상으로 보정 또는 경고
- 수익률 음수 입력은 MVP에서 비허용
- 숫자 입력 비정상값은 0 처리 대신 즉시 유효성 안내

---

## 8. 추천 DOM 구조

```text
#ipcCurrentAge
#ipcRetireAge
#ipcCurrentIrp
#ipcCurrentDc
#ipcMonthlyContribution
#ipcAnnualReturn
input[name="ipcPayoutMode"]
#ipcAnnuityStartAge
#ipcAnnuityPeriod
#ipcPostRetirementReturn

#ipcFutureValue
#ipcPrincipal
#ipcExpectedGain
#ipcMonthlyAnnuity
#ipcTotalAnnuity
#ipcLumpSum
#ipcComparisonBody
#ipcSensitivityBody
```

---

## 9. 스크립트 설계 (`public/scripts/irp-pension-calculator.js`)

### 역할

- 입력 DOM 수집
- 숫자 정규화
- 계산 함수 호출
- 결과 DOM 반영
- 프리셋 버튼 상태 반영
- URL 공유 파라미터 처리 여부 검토

### 권장 함수

```js
parseCurrency(value)
formatCurrency(value)
readInputs()
calculateFutureValue(input)
calculateMonthlyAnnuity(result, input)
renderSummary(result)
renderComparison(result)
renderSensitivity(result, input)
applyPreset(presetId)
resetForm()
```

---

## 10. 스타일 설계 (`_irp-pension-calculator.scss`)

- prefix: `ipc-`
- 입력 패널과 결과 패널의 시각적 분리
- 결과 KPI 카드 4개는 강하게 강조
- `수령 방식`은 카드형 선택 UI
- 민감도 분석은 단순 표보다 카드형 요약이 적합

### 시각 톤

- 브랜드 그린 + 뉴트럴 배경
- 금융 계산기 느낌의 안정적 톤
- 과한 그래프보다 숫자 우선

---

## 11. 관련 링크/전환 설계

### 내부 링크 우선순위

1. `연금저축 vs IRP 비교 2026`
2. `국민연금 예상 수령액 계산기`
3. `은퇴 계산기`

### CTA 문구 예시

- `연금저축과 IRP 차이도 같이 보기`
- `국민연금 예상 수령액까지 합산해보기`
- `은퇴 후 생활비 부족분 계산하기`

---

## 12. QA 체크리스트

- [ ] 은퇴 시점 적립금 계산 정상
- [ ] 0% 수익률 예외 처리 정상
- [ ] 연금/일시금 전환 즉시 반영
- [ ] 입력 초기화 버튼 정상
- [ ] 모바일에서 입력/결과 가독성 정상
- [ ] FAQ / 내부 링크 출력 정상
- [ ] `npm run build` 통과

---

## 13. 구현 우선순위

### P0

- 입력 폼
- 미래가치 계산
- 월 수령액 계산
- 연금 vs 일시금 비교
- FAQ / 내부 링크

### P1

- 민감도 분석
- 프리셋
- 공유 URL

### P2

- 수령 중 운용수익 반영
- 세금 가정 세분화
- 도넛/라인 차트

---

## 14. 최종 구현 메모

이 페이지는 `국민연금 계산기`보다 계산식은 단순하지만, 사용자가 기대하는 비교 해석은 더 직접적이다. 따라서 구현의 중심은 복잡한 세법보다 `은퇴 시점 적립금`, `월 수령액`, `일시금 차이`를 직관적으로 보여주는 데 둔다. MVP에서는 계산 신뢰감과 빠른 UX가 가장 중요하다.
