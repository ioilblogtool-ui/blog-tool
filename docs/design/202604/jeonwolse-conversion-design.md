# 전월세 전환율 계산기 설계 문서

> 기획 원문: `docs/plan/202604/jeonwolse-conversion.md`
> 작성일: 2026-04-14
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정
> 최종 타입: Type B. Compare Calculator
> 참고 문서: `docs/design/202604/calculator-playbook-design.md`
> 참고 계산기: `coin-tax-calculator`, `national-pension-calculator`, `home-purchase-fund`

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/jeonwolse-conversion.md`
- 구현 대상: `전월세 전환율 계산기 — 전세 vs 월세, 어느 쪽이 더 유리할까?`
- 콘텐츠 유형: `/tools/` 계산기형 페이지

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 계산기 구조에 맞춰 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 입력 구조, 계산 공식, 결과 카드, 해설 문구, CTA 흐름, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- 단순 환산기보다 `비교 + 협상 판단 + 실부담 해석` 성격이 강한 계산기다.
- 핵심 흐름은 `계약 조건 입력 -> 법정 상한 비교 -> 전세/월세 실질 비용 비교 -> 유불리 해석 -> 다음 계산기 연결`이다.
- 타입은 `Compare Calculator`를 기본으로 하되, 결과 해설은 `Guided Calculator`처럼 문장형 가이드를 강하게 둔다.

### 1-4. 권장 slug
- `jeonwolse-conversion`
- URL: `/tools/jeonwolse-conversion/`

### 1-5. 권장 파일 구조
```text
src/
  data/
    tools.ts
    jeonwolseConversion.ts
  pages/
    tools/
      jeonwolse-conversion.astro

public/
  scripts/
    jeonwolse-conversion.js
  og/tools/
    jeonwolse-conversion.png

src/styles/scss/pages/
  _jeonwolse-conversion.scss
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 계산기 공통 구조
`docs/design/202604/calculator-playbook-design.md` 기준으로 이번 페이지는 아래 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 입력 패널
4. 핵심 결과 KPI 5~6개
5. 비교표 1개
6. 해설/주의사항
7. 이어보기 CTA
8. 외부 참고 링크
9. `SeoContent`

### 2-2. 이번 계산기에서 특히 중요한 것
- 탭 3개를 두되, 실제 핵심은 `전세 ↔ 월세 환산`보다 `전세 vs 월세 비교` 탭이다.
- 계산 결과는 숫자만 내지 않고 아래 3개를 같이 보여줘야 한다.
  - 법정 상한 초과 여부
  - 비교 기간 총비용 차이
  - 유불리 해석 문장
- 부동산/금융 성격상 신뢰 장치가 중요하므로 `기준금리 기준일`, `법적 기준 안내`, `참고용 계산` 문구를 반드시 상단과 결과 근처에 둔다.

---

## 3. 구현 범위

### 3-1. MVP 범위
- 탭 3개 제공
  - `전세 → 월세 환산`
  - `월세 → 전세 환산`
  - `전세 vs 월세 비교`
- 법정 상한 자동 계산 제공
  - `min(연 10%, 기준금리 + 연 2%)`
- 선택 옵션 제공
  - 대출금리
  - 예금/투자 수익률
  - 비교 기간
  - 이사비용
  - 중개수수료
- 결과 UI 제공
  - KPI 카드 6개 이내
  - 총비용 비교표
  - 문장형 해설 박스
  - FAQ
  - 관련 계산기 CTA

### 3-2. MVP 제외 범위
- 실시간 기준금리 API 호출
- 지역별 임대차 통계 연동
- 저장된 계산 히스토리
- 계약서 PDF 업로드 분석
- 실매물 추천 엔진

---

## 4. 페이지 목적

- 전세와 월세를 같은 기준으로 환산해서 사용자가 현재 제안이 합리적인지 빠르게 판단하게 한다.
- 계약갱신 또는 이사 의사결정 맥락에서 `법정 상한 기준`과 `실질 총비용 기준`을 함께 보여준다.
- 계산 결과를 끝으로 두지 않고 `전세대출`, `주택 구매 자금`, `서울 주거비 리포트`로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 재계약 제안을 받은 임차인
- 집주인에게 전세 일부를 월세로 바꾸자는 제안을 받는다.
- 실제 전환율이 얼마인지, 법정 상한보다 높은지 먼저 확인한다.
- 이후 2년 총비용 기준으로 전세 유지가 유리한지 월세 전환이 유리한지 본다.

### 5-2. 이사를 준비하는 실수요자
- 전세 매물이 부족하거나 목돈이 부족해 월세까지 같이 본다.
- 같은 예산을 기준으로 전세/월세 조건을 환산해 본다.
- 초기 목돈과 월 고정비 중 어느 쪽 부담이 더 큰지 비교한다.

### 5-3. 사회초년생·신혼부부
- 보증금은 부족하지만 월급 기준 현금흐름이 중요하다.
- 총비용은 월세가 더 높더라도 현실적으로 가능한지 확인하고 싶어한다.
- 계산기에서 `비용`과 `현금흐름`을 분리해서 읽는다.

### 5-4. 공인중개사 상담 전 사전 확인 사용자
- 대략적인 협상 기준을 갖고 싶다.
- “이 월세 전환 제안이 과한지”를 법정 상한 기준으로 빠르게 점검한다.

---

## 6. 데이터 구조 (`src/data/jeonwolseConversion.ts`)

### 6-1. 타입 정의

```ts
export type JWCMode = 'jeonseToWolse' | 'wolseToJeonse' | 'compare';

export interface JWCRules {
  annualCapRate: number;
  baseRate: number;
  plusSpreadRate: number;
  legalCapRate: number;
  baseRateDateLabel: string;
}

export interface JWCDefaultInput {
  mode: JWCMode;
  jeonseDeposit: number;
  wolseDeposit: number;
  monthlyRent: number;
  customRate: number;
  useLegalCap: boolean;
  loanRate: number;
  opportunityRate: number;
  comparisonYears: number;
  movingCost: number;
  brokerFee: number;
}

export interface JWCScenarioPreset {
  id: string;
  label: string;
  values: Partial<JWCDefaultInput>;
}

export interface JWCFaqItem {
  q: string;
  a: string;
}

export interface JWCRelatedLink {
  href: string;
  label: string;
}
```

### 6-2. 상수 구성

```ts
export const JWC_RULES: JWCRules = {
  annualCapRate: 0.10,
  baseRate: 0.025,
  plusSpreadRate: 0.02,
  legalCapRate: 0.045,
  baseRateDateLabel: '2026-04-14 기준 2.50%',
};

export const JWC_DEFAULT_INPUT: JWCDefaultInput = {
  mode: 'compare',
  jeonseDeposit: 300_000_000,
  wolseDeposit: 50_000_000,
  monthlyRent: 900_000,
  customRate: 0.045,
  useLegalCap: true,
  loanRate: 0.04,
  opportunityRate: 0.025,
  comparisonYears: 2,
  movingCost: 1_500_000,
  brokerFee: 1_200_000,
};
```

### 6-3. 프리셋
- 최소 3개 제공
  - `renewal-3eok-90`
  - `renewal-4eok-130`
  - `starter-low-cash`

예시:

```ts
export const JWC_SCENARIO_PRESETS: JWCScenarioPreset[] = [
  {
    id: 'renewal-3eok-90',
    label: '전세 3억 vs 보증금 5천/월세 90',
    values: {
      jeonseDeposit: 300_000_000,
      wolseDeposit: 50_000_000,
      monthlyRent: 900_000,
      comparisonYears: 2,
    },
  },
  {
    id: 'renewal-4eok-130',
    label: '전세 4억 vs 보증금 1억/월세 130',
    values: {
      jeonseDeposit: 400_000_000,
      wolseDeposit: 100_000_000,
      monthlyRent: 1_300_000,
      comparisonYears: 2,
    },
  },
  {
    id: 'starter-low-cash',
    label: '사회초년생 현금흐름 우선',
    values: {
      jeonseDeposit: 200_000_000,
      wolseDeposit: 30_000_000,
      monthlyRent: 750_000,
      loanRate: 0.045,
      opportunityRate: 0.02,
      comparisonYears: 2,
    },
  },
];
```

### 6-4. FAQ / 관련 링크
- FAQ 4~5개
- 관련 링크 4개 이상
  - `/tools/home-purchase-fund/`
  - `/reports/seoul-housing-2016-vs-2026/`
  - `/reports/seoul-apartment-jeonse-report/`
  - 향후 `전세대출 이자 계산기`, `월세 세액공제 계산기` 연결 가능

---

## 7. 계산 로직

### 7-1. 핵심 공식

```js
function calcLegalCapRate(rules) {
  return Math.min(rules.annualCapRate, rules.baseRate + rules.plusSpreadRate);
}

function calcGapDeposit(jeonseDeposit, wolseDeposit) {
  return jeonseDeposit - wolseDeposit;
}

function calcActualConversionRate(monthlyRent, gapDeposit) {
  if (gapDeposit <= 0) return 0;
  return (monthlyRent * 12) / gapDeposit;
}

function calcMonthlyRentFromDeposit(targetDepositGap, annualRate) {
  if (targetDepositGap <= 0 || annualRate <= 0) return 0;
  return (targetDepositGap * annualRate) / 12;
}

function calcJeonseDepositFromMonthlyRent(wolseDeposit, monthlyRent, annualRate) {
  if (annualRate <= 0) return wolseDeposit;
  return wolseDeposit + (monthlyRent * 12) / annualRate;
}
```

### 7-2. 비교용 총비용 공식

```js
function calcJeonseTotalCost(input) {
  const years = input.comparisonYears;
  const loanCost = input.jeonseDeposit * input.loanRate * years;
  const opportunityCost = input.jeonseDeposit * input.opportunityRate * years;

  return loanCost + opportunityCost + input.movingCost + input.brokerFee;
}

function calcWolseTotalCost(input) {
  const years = input.comparisonYears;
  const rentCost = input.monthlyRent * 12 * years;
  const opportunityCost = input.wolseDeposit * input.opportunityRate * years;

  return rentCost + opportunityCost + input.movingCost + input.brokerFee;
}
```

### 7-3. 유불리 판정

```js
function getRateStatus(actualRate, legalCapRate) {
  if (actualRate > legalCapRate) return 'overCap';
  if (actualRate >= legalCapRate * 0.95) return 'nearCap';
  return 'withinCap';
}

function getCostWinner(jeonseTotal, wolseTotal) {
  const diff = Math.abs(jeonseTotal - wolseTotal);
  if (diff < 500_000) return 'similar';
  return jeonseTotal < wolseTotal ? 'jeonse' : 'wolse';
}
```

### 7-4. 통합 계산 함수

```js
function calculate(input, rules) {
  const legalCapRate = calcLegalCapRate(rules);
  const appliedRate = input.useLegalCap ? legalCapRate : input.customRate;
  const gapDeposit = calcGapDeposit(input.jeonseDeposit, input.wolseDeposit);
  const actualRate = calcActualConversionRate(input.monthlyRent, gapDeposit);
  const convertedMonthlyRent = calcMonthlyRentFromDeposit(gapDeposit, appliedRate);
  const convertedJeonseDeposit = calcJeonseDepositFromMonthlyRent(
    input.wolseDeposit,
    input.monthlyRent,
    appliedRate
  );
  const jeonseTotalCost = calcJeonseTotalCost(input);
  const wolseTotalCost = calcWolseTotalCost(input);
  const rateStatus = getRateStatus(actualRate, legalCapRate);
  const winner = getCostWinner(jeonseTotalCost, wolseTotalCost);

  return {
    legalCapRate,
    appliedRate,
    gapDeposit,
    actualRate,
    convertedMonthlyRent,
    convertedJeonseDeposit,
    jeonseTotalCost,
    wolseTotalCost,
    totalCostDiff: Math.abs(jeonseTotalCost - wolseTotalCost),
    rateStatus,
    winner,
  };
}
```

### 7-5. 예외 처리
- `전세보증금 <= 월세보증금`이면 실제 전환율 계산을 막고 안내 문구 표시
- 전환율 0 이하일 때 환산 결과는 0 또는 입력값 유지
- 음수 입력 방지
- 비교 기간 0 이하 방지
- NaN 입력 방지

---

## 8. 페이지 구조 (`src/pages/tools/jeonwolse-conversion.astro`)

### 8-1. 레이아웃
- `SimpleToolShell.astro` 사용
- `resultFirst={true}` 권장

### 8-2. Hero

```astro
<CalculatorHero
  eyebrow="부동산 비교 계산"
  title="전월세 전환율 계산기"
  description="전세 보증금과 월세 조건을 같은 기준으로 환산해서 실제 전환율, 법정 상한 초과 여부, 비교 기간 총비용까지 한눈에 확인하세요."
/>
<InfoNotice
  text="이 계산기는 주택임대차보호법상 전월세 전환 기준과 사용자가 입력한 가정을 바탕으로 만든 참고용 계산 도구입니다. 실제 계약 조건, 지역, 주택 유형, 협의 내용에 따라 결과는 달라질 수 있습니다."
/>
```

### 8-3. 입력 패널

#### SECTION A. 탭 구조

```html
<div class="jwc-mode-tabs" id="jwc-mode-tabs">
  <button class="jwc-mode-tab" data-mode="jeonseToWolse">전세 → 월세 환산</button>
  <button class="jwc-mode-tab" data-mode="wolseToJeonse">월세 → 전세 환산</button>
  <button class="jwc-mode-tab is-active" data-mode="compare">전세 vs 월세 비교</button>
</div>
```

#### SECTION B. 기본 입력
- 전세 보증금
- 월세 보증금
- 월세액
- 법정 상한 자동 적용 토글
- 사용자 입력 전환율
- 기준금리 표시 및 수정 입력

#### SECTION C. 비용 옵션
- 대출금리
- 예금/투자 수익률
- 비교 기간
- 이사비용
- 중개수수료

#### SECTION D. 프리셋 / 액션

```html
<div class="jwc-scenario-presets" id="jwc-scenario-presets">
  <!-- preset chips -->
</div>

<div class="jwc-actions">
  <button id="jwc-calc-btn" class="button button--primary">계산하기</button>
  <button id="jwc-reset-btn" class="button button--ghost">초기화</button>
  <button id="jwc-copy-link-btn" class="button button--ghost">공유 링크 복사</button>
</div>
```

### 8-4. 결과 영역

#### KPI 카드 6개 이내
1. 실제 전환율
2. 법정 상한 전환율
3. 월세 환산액
4. 전세 환산 보증금
5. 총비용 기준 유리한 쪽
6. 비교 기간 총비용 차이

#### 비교표

```html
<table class="jwc-compare-table">
  <tbody>
    <tr><th>초기 보증금</th><td id="jwc-r-jeonse-deposit">-</td><td id="jwc-r-wolse-deposit">-</td></tr>
    <tr><th>월 고정지출</th><td>0원</td><td id="jwc-r-monthly-rent">-</td></tr>
    <tr><th>대출/기회비용</th><td id="jwc-r-jeonse-extra">-</td><td id="jwc-r-wolse-extra">-</td></tr>
    <tr><th>비교기간 총비용</th><td id="jwc-r-jeonse-total">-</td><td id="jwc-r-wolse-total">-</td></tr>
    <tr><th>판정</th><td id="jwc-r-jeonse-judge">-</td><td id="jwc-r-wolse-judge">-</td></tr>
  </tbody>
</table>
```

#### 해설 박스
- 법정 상한 초과 여부
- 총비용 유불리
- 현금흐름 관점 보정
- 금리 변경 시 결과 민감도

#### 하단 구성
- FAQ accordion 4~5개
- 외부 참고 링크 2~3개
- 관련 계산기 CTA 3개

---

## 9. 클라이언트 스크립트 (`public/scripts/jeonwolse-conversion.js`)

### 9-1. 상태 객체

```js
const state = {
  mode: 'compare',
  jeonseDeposit: 300000000,
  wolseDeposit: 50000000,
  monthlyRent: 900000,
  customRate: 0.045,
  useLegalCap: true,
  baseRate: 0.025,
  loanRate: 0.04,
  opportunityRate: 0.025,
  comparisonYears: 2,
  movingCost: 1500000,
  brokerFee: 1200000,
};
```

### 9-2. 주요 함수 목록
- `readForm()`
- `calculate(state, rules)`
- `updateResultCards(result)`
- `updateCompareTable(result)`
- `updateInterpretation(result)`
- `applyPreset(id)`
- `syncUrlParams()`
- `restoreFromUrl()`
- `copyShareLink()`
- `initFaq()`

### 9-3. URL 파라미터

| param | 의미 |
|---|---|
| `mode` | 계산 탭 |
| `jd` | 전세 보증금 |
| `wd` | 월세 보증금 |
| `mr` | 월세액 |
| `ul` | 법정 상한 자동 적용 여부 |
| `cr` | 사용자 입력 전환율 |
| `br` | 기준금리 |
| `lr` | 대출금리 |
| `or` | 기회비용 수익률 |
| `cy` | 비교 기간(년) |
| `mc` | 이사비용 |
| `bf` | 중개수수료 |

### 9-4. 인터랙션 규칙
- 입력 변경 시 즉시 재계산
- 탭 전환 시 관련 결과 카드 강조 문구 변경
- `useLegalCap=true`일 때 사용자 입력 전환율 필드는 비활성 처리
- 프리셋 클릭 시 활성 상태 표시

---

## 10. 스타일 가이드 (`_jeonwolse-conversion.scss`)

### 10-1. CSS prefix
- `jwc-` 사용

### 10-2. 시각 톤
- 전세/중립: 블루 계열
- 월세/현금흐름: 오렌지 또는 앰버 계열
- 유리: 그린
- 법정 상한 초과 경고: 레드

### 10-3. 주요 컴포넌트
- `jwc-mode-tabs`
- `jwc-mode-tab`
- `jwc-result-cards`
- `jwc-result-card`
- `jwc-badge`
- `jwc-compare-table`
- `jwc-interpretation-box`
- `jwc-scenario-presets`

### 10-4. 반응형 규칙
- 640px 이상: KPI 3열
- 375px~639px: KPI 2열
- 비교표는 모바일 가로 스크롤 허용
- 입력 패널과 결과 패널은 `SimpleToolShell` 기준 스택 유지

---

## 11. 사이트 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "jeonwolse-conversion",
  title: "전월세 전환율 계산기",
  description: "전세 보증금과 월세 조건을 같은 기준으로 환산해 실제 전환율, 법정 상한 초과 여부, 전세 vs 월세 총비용 차이를 비교합니다.",
  order: 25,
  eyebrow: "부동산 비교 계산",
  category: "calculator",
  iframeReady: false,
  badges: ["전세", "월세", "전환율", "부동산"],
  previewStats: [
    { label: "법정 상한", value: "연 4.50%", context: "2026-04 기준금리 2.50%" },
    { label: "핵심 비교", value: "총비용 + 유불리", context: "전세 vs 월세" },
  ],
},
```

### 추가 반영 위치
- `src/pages/index.astro`
  - `topicBySlug`에 `"jeonwolse-conversion": "부동산"` 추가
- `src/styles/app.scss`
  - `@use 'scss/pages/jeonwolse-conversion';`
- `public/sitemap.xml`
  - `/tools/jeonwolse-conversion/` 추가

---

## 12. SEO 설계

### 12-1. 메인 키워드
- 전월세 전환율 계산기
- 전세 월세 전환 계산
- 전세 vs 월세 계산기
- 월세 전세 환산 보증금

### 12-2. 서브 키워드
- 전월세 전환율 법정 상한
- 전세를 월세로 계산
- 월세를 전세로 환산
- 계약갱신 전월세 전환율

### 12-3. 메타 초안

```text
title: "전월세 전환율 계산기 2026 | 전세 vs 월세 유불리 바로 계산 | 비교계산소"
description: "전세 보증금과 월세 조건을 같은 기준으로 환산해 실제 전환율, 법정 상한 초과 여부, 전세 환산 보증금, 월세 환산액, 비교 기간 총비용 차이를 한눈에 확인하세요."
```

### 12-4. 권장 H 구조
- H1: 전월세 전환율 계산기
- H2: 전세와 월세를 같은 기준으로 비교하는 법
- H2: 전월세 전환율 계산 결과
- H2: 전월세 전환율이 법정 상한보다 높으면?
- H2: 전세 vs 월세 FAQ

---

## 13. QA 체크리스트

### 13-1. 계산 로직
- [ ] 실제 전환율 = `(월세 × 12) / (전세보증금 - 월세보증금)` 공식이 맞는지
- [ ] 법정 상한 = `min(연 10%, 기준금리 + 연 2%)`가 맞는지
- [ ] 전세→월세 환산 결과가 탭1에서 정상 노출되는지
- [ ] 월세→전세 환산 결과가 탭2에서 정상 노출되는지
- [ ] 비교 기간 총비용 계산에 대출금리/기회비용이 정상 반영되는지
- [ ] `전세보증금 <= 월세보증금`일 때 오류 없이 안내되는지

### 13-2. UI
- [ ] 탭 active 상태가 명확한지
- [ ] 모바일에서 비교표가 깨지지 않는지
- [ ] 법정 상한 초과 시 경고 배지가 즉시 바뀌는지
- [ ] 프리셋 클릭 후 값과 결과가 함께 갱신되는지
- [ ] 공유 링크 복사 후 동일 상태가 복원되는지

### 13-3. 콘텐츠 / 신뢰
- [ ] 기준금리 기준일이 상단에 표기되는지
- [ ] 법령 기준 문구가 누락되지 않는지
- [ ] “참고용 계산기” 디스클레이머가 결과 영역 근처에 있는지
- [ ] FAQ와 결과 해설이 과도하게 법률 자문처럼 보이지 않는지

### 13-4. 사이트 반영
- [ ] `src/data/tools.ts` 등록
- [ ] `src/pages/index.astro` `topicBySlug` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음

---

## 14. 개발 메모

- 이 계산기는 `전월세 환산` 자체보다 `비교 판단 도구`로 읽히게 만드는 것이 중요하다.
- 상단 KPI 카드에서 가장 크게 보여줄 값은 `실제 전환율` 또는 `총비용 차이` 중 현재 탭에 맞는 하나다.
- 법적 기준은 신뢰 요소지만 페이지의 최종 목적은 계약 판단 보조이므로, 항상 `법정 상한`과 `현실 비용`을 같이 보여줘야 한다.
- 후속 확장 우선순위는 `전세대출 이자 계산기`, `월세 세액공제 계산기`, `서울 주거비 리포트` 연결이다.

