# 배당주 월급 계산기 설계 문서

> 기획 원문: `docs/plan/202605/dividend-monthly-income.md`  
> 작성일: 2026-05-20  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 투자 원금과 목표 월 배당 기준을 모두 지원하고, 세후 월 배당금·필요 원금·배당 재투자 장기 시뮬레이션을 제공한다.

---

## 1. 문서 개요

- 구현 대상: `배당주 월급 계산기`
- slug: `dividend-monthly-income`
- URL: `/tools/dividend-monthly-income/`
- 카테고리: 주식/코인
- 핵심 검색 의도: `배당주 월급 계산기`, `배당주 월배당 수익 계산`, `월 50만 원 배당`, `배당금 계산기`, `배당 재투자 계산`
- 핵심 출력: 세후 월 배당금, 세후 연 배당금, 목표 월 배당 필요 원금, 지급 주기별 1회 수령액, 10년·20년 후 예상 월 배당금
- 안전 장치: 모든 결과는 `추정`으로 표기하며 배당수익률, 세율, 주가 성장률은 보장값이 아님을 명시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    dividendMonthlyIncome.ts
  pages/
    tools/
      dividend-monthly-income.astro

public/
  scripts/
    dividend-monthly-income.js

src/styles/scss/pages/
  _dividend-monthly-income.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/dividend-monthly-income';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 주식/코인 토픽 노출
- `src/pages/tools/index.astro` 주식/코인 목록 노출 보강
- `public/og/tools/dividend-monthly-income.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `dmi-`
- pageClass: `dmi-page`
- 결과는 입력 폼 바로 아래에 배치하되, 모바일에서는 결과 KPI가 먼저 눈에 들어오도록 sticky 요약은 사용하지 않는다.
- 카드 중첩을 피하고, 각 섹션은 독립된 full-width 섹션 또는 얕은 패널로 구성한다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="dividend-monthly-income"
  pageClass="dmi-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 배당·세금 추정 안내 `InfoNotice`
3. 계산 방식 선택
4. 입력 폼
5. 핵심 결과 KPI
6. 배당 주기별 수령액
7. 목표 월 배당 필요 원금 또는 현재 원금 기준 해석
8. 배당 재투자 10년·20년 시뮬레이션
9. 수익률 민감도 비교
10. 고배당률 리스크 안내
11. 관련 리포트·계산기 CTA
12. SEO 본문 및 FAQ

---

## 5. 데이터 모델

파일: `src/data/dividendMonthlyIncome.ts`

```ts
export type DividendCalculationMode = 'principal' | 'targetIncome';
export type DividendFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual';
export type DividendCurrency = 'KRW' | 'USD';
export type RiskTone = 'good' | 'neutral' | 'caution' | 'danger';

export interface DividendMonthlyIncomeInput {
  mode: DividendCalculationMode;
  principal: number;
  targetMonthlyIncome: number;
  annualDividendYield: number;
  taxRate: number;
  frequency: DividendFrequency;
  currency: DividendCurrency;
  exchangeRate: number;
  reinvestEnabled: boolean;
  monthlyContribution: number;
  dividendGrowthRate: number;
  priceGrowthRate: number;
  simulationYears: number;
}

export interface DividendFrequencyResult {
  frequency: DividendFrequency;
  label: string;
  paymentsPerYear: number;
  grossPerPayment: number;
  netPerPayment: number;
  note: string;
}

export interface DividendSimulationSnapshot {
  year: number;
  principal: number;
  annualNetDividend: number;
  monthlyNetDividend: number;
  cumulativeNetDividend: number;
}

export interface DividendMonthlyIncomeResult {
  grossAnnualDividend: number;
  taxAmount: number;
  netAnnualDividend: number;
  grossMonthlyDividend: number;
  netMonthlyDividend: number;
  requiredPrincipal: number | null;
  frequencyResults: DividendFrequencyResult[];
  tenYearSnapshot: DividendSimulationSnapshot;
  twentyYearSnapshot: DividendSimulationSnapshot;
  simulationSnapshots: DividendSimulationSnapshot[];
  riskTone: RiskTone;
  riskBadges: string[];
  interpretation: string;
  warnings: string[];
}

export interface DividendPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<DividendMonthlyIncomeInput>;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 기본값 및 프리셋

### 기본 입력값

```ts
export const DEFAULT_DIVIDEND_INPUT: DividendMonthlyIncomeInput = {
  mode: 'principal',
  principal: 50_000_000,
  targetMonthlyIncome: 500_000,
  annualDividendYield: 5,
  taxRate: 15.4,
  frequency: 'monthly',
  currency: 'KRW',
  exchangeRate: 1350,
  reinvestEnabled: true,
  monthlyContribution: 0,
  dividendGrowthRate: 0,
  priceGrowthRate: 0,
  simulationYears: 20,
};
```

### 프리셋

| id | 라벨 | 주요 값 |
| --- | --- | --- |
| starter | 처음 시작하는 배당 투자자 | 원금 1,000만 원, 수익률 4% |
| target-100k | 월 10만 원 만들기 | 목표 월 10만 원, 수익률 5% |
| target-500k | 월 50만 원 만들기 | 목표 월 50만 원, 수익률 5% |
| high-yield | 고배당 ETF 시나리오 | 원금 5,000만 원, 수익률 7% |
| retirement | 은퇴 현금흐름 시나리오 | 원금 3억 원, 수익률 4.5% |

---

## 7. 계산 로직

### 7-1. 보유 원금 기준 배당금

```text
세전 연 배당금 = 투자 원금 × 연 배당수익률
세후 연 배당금 = 세전 연 배당금 × (1 - 세율)
세전 월 배당금 = 세전 연 배당금 ÷ 12
세후 월 배당금 = 세후 연 배당금 ÷ 12
연간 세금 = 세전 연 배당금 - 세후 연 배당금
```

### 7-2. 목표 월 배당 기준 필요 원금

```text
목표 세전 월 배당금 = 목표 세후 월 배당금 ÷ (1 - 세율)
필요 원금 = 목표 세전 월 배당금 × 12 ÷ 연 배당수익률
```

역산 모드에서는 `requiredPrincipal`을 메인 KPI로 보여주고, 해당 필요 원금을 기준으로 배당 주기별 수령액을 계산한다.

### 7-3. 지급 주기별 1회 수령액

```text
월배당 = 세후 연 배당금 ÷ 12
분기배당 = 세후 연 배당금 ÷ 4
반기배당 = 세후 연 배당금 ÷ 2
연배당 = 세후 연 배당금
```

표시는 `월 평균`과 `실제 1회 지급 예상액`을 분리한다.

### 7-4. 배당 재투자 시뮬레이션

월 단위 루프를 사용한다.

```text
월 배당수익률 = 연 배당수익률 ÷ 12
월 주가 성장률 = 연 주가 성장률 ÷ 12
월 배당 성장률 = 연 배당 성장률 ÷ 12

매월 세후 배당금 = 현재 평가액 × 현재 월 배당수익률 × (1 - 세율)

재투자 켜짐:
다음 달 평가액 = 현재 평가액 × (1 + 월 주가 성장률) + 월 추가 투자금 + 매월 세후 배당금

재투자 꺼짐:
다음 달 평가액 = 현재 평가액 × (1 + 월 주가 성장률) + 월 추가 투자금
```

배당 성장률은 매 12개월마다 연 단위로 반영해도 되고, 월 복리로 반영해도 된다. 구현 단순성을 위해 월 단위 반영을 권장한다.

---

## 8. 입력 UI 설계

### 계산 방식

- segmented control
  - `보유 원금으로 계산`
  - `목표 월 배당으로 역산`

### 기본 입력

| 필드 | UI | 제약 |
| --- | --- | --- |
| 투자 원금 | number input | 0원 이상 |
| 목표 월 배당금 | number input | 0원 이상 |
| 예상 연 배당수익률 | percent input 또는 slider | 0.1%~20% |
| 배당 주기 | select | 월·분기·반기·연 |
| 배당소득세율 | percent input | 0%~49.5% |
| 통화 | segmented control | 원화·달러 |
| 환율 | number input | 달러 선택 시 강조 |

### 재투자 입력

| 필드 | UI | 제약 |
| --- | --- | --- |
| 배당 재투자 | toggle | 켜짐/꺼짐 |
| 월 추가 투자금 | number input | 0원 이상 |
| 배당 성장률 | percent input | -20%~20% |
| 주가 성장률 | percent input | -30%~30% |
| 시뮬레이션 기간 | select | 5년·10년·20년·30년 |

---

## 9. 결과 UI 설계

### KPI 카드

| 카드 | principal 모드 | targetIncome 모드 |
| --- | --- | --- |
| Main | 세후 월 배당금 | 필요 투자 원금 |
| Sub 1 | 세후 연 배당금 | 목표 세후 월 배당금 |
| Sub 2 | 연간 세금 | 세후 연 배당 목표 |
| Sub 3 | 실제 1회 수령액 | 예상 1회 수령액 |
| Sub 4 | 20년 후 세후 월 배당금 | 20년 후 세후 월 배당금 |

### 배당 주기별 표

| 주기 | 연 지급 횟수 | 세전 1회 | 세후 1회 | 설명 |
| --- | ---: | ---: | ---: | --- |
| 월배당 | 12회 | 계산값 | 계산값 | 매월 분산 수령 |
| 분기배당 | 4회 | 계산값 | 계산값 | 3개월마다 수령 |
| 반기배당 | 2회 | 계산값 | 계산값 | 6개월마다 수령 |
| 연배당 | 1회 | 계산값 | 계산값 | 연 1회 집중 수령 |

### 시뮬레이션 카드

- 10년 후 예상 원금
- 10년 후 세후 월 배당금
- 20년 후 예상 원금
- 20년 후 세후 월 배당금
- 누적 세후 배당금

---

## 10. 상태 및 경고 처리

| 조건 | 처리 |
| --- | --- |
| 배당수익률 0 이하 | 계산 불가, 수익률 입력 안내 |
| 세율 100% 이상 | 계산 불가, 세율 입력 안내 |
| 배당수익률 7% 이상 | `고배당 주의` 배지 |
| 배당수익률 10% 이상 | 원금 변동·배당 삭감 위험 경고 |
| 목표 월 배당 필요 원금 5억 원 이상 | 목표 금액 또는 기간 조정 안내 |
| 통화 USD 선택 | 환율 변동 안내 노출 |
| 주가 성장률 음수 | 평가액 감소 가능성 안내 |

---

## 11. 접근성 및 모바일

- 입력 라벨은 `label for`와 `id`를 연결한다.
- 결과값은 `aria-live="polite"` 영역에 배치한다.
- segmented control은 키보드 포커스 이동이 가능해야 한다.
- 숫자 입력은 모바일에서 `inputmode="decimal"` 또는 `inputmode="numeric"`을 사용한다.
- 긴 금액은 카드 내부에서 줄바꿈되도록 `word-break`와 최소 폭을 조정한다.
- 모바일에서는 비교 표를 카드형 또는 가로 스크롤로 전환한다.

---

## 12. 콘텐츠 및 SEO

### Hero

```text
배당주 월급 계산기
투자 원금과 배당수익률을 입력하면 세후 월 배당금과 목표 월 배당에 필요한 원금을 계산합니다.
```

### SEO 메타

```text
title: 배당주 월급 계산기 - 세후 월 배당금과 필요 원금 계산
description: 투자 원금, 배당수익률, 배당 주기, 세율을 입력해 세후 월 배당금과 목표 월 배당 달성에 필요한 원금을 계산하세요. 배당 재투자 10년·20년 복리 시뮬레이션도 확인할 수 있습니다.
```

### FAQ

- 배당주로 월 50만 원을 받으려면 얼마가 필요한가요?
- 배당소득세 15.4%는 자동으로 반영되나요?
- 월배당 ETF가 분기배당 주식보다 유리한가요?
- 배당 재투자 결과는 실제 수익을 보장하나요?
- 미국 배당주는 어떻게 계산하나요?

---

## 13. 내부 링크 및 CTA

| 위치 | CTA | 링크 |
| --- | --- | --- |
| 결과 하단 | 월배당 ETF 실수익 비교 보기 | `/reports/monthly-dividend-etf-2026/` |
| 고배당 경고 하단 | 고배당 ETF 리스크 확인 | `/reports/monthly-dividend-etf-2026/` |
| SEO 본문 하단 | 주식 손익분기점 계산하기 | `/tools/stock-breakeven-calculator/` |
| 달러 선택 시 | 미국 주식 환차익 계산하기 | `/tools/us-stock-exchange-profit-calculator/` |

---

## 14. 테스트 체크리스트

- [ ] 보유 원금 모드에서 세후 월 배당금 계산이 맞는지 확인
- [ ] 목표 월 배당 모드에서 필요 원금 역산이 맞는지 확인
- [ ] 배당 주기별 1회 수령액이 연 지급 횟수에 맞게 나뉘는지 확인
- [ ] 세율 15.4% 기본값이 반영되는지 확인
- [ ] 배당수익률 0%, 세율 100% 입력 방어
- [ ] 배당수익률 7% 이상에서 경고 배지가 노출되는지 확인
- [ ] 재투자 켜짐/꺼짐 시 10년·20년 결과가 달라지는지 확인
- [ ] USD 선택 시 환율 입력과 안내 문구가 노출되는지 확인
- [ ] 모바일에서 KPI 카드와 표가 깨지지 않는지 확인
- [ ] 모든 결과에 `추정` 또는 동등한 안내가 표시되는지 확인
- [ ] `npm run build` 성공 확인
