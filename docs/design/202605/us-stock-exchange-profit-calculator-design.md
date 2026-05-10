# 미국주식 환차손익 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/us-stock-exchange-profit-calculator.md`  
> 작성일: 2026-05-05  
> 구현 기준: 이 문서 기준으로 `/tools/` 계산기 구현 가능

---

## 1. 문서 개요

- 구현 대상: `미국주식 환차손익 계산기`
- 슬러그: `us-stock-exchange-profit-calculator`
- URL: `/tools/us-stock-exchange-profit-calculator/`
- 콘텐츠 유형: 계산기
- 핵심 질문: "달러 기준 수익률은 플러스인데 원화 기준으로는 실제 얼마 벌었나?"
- 계산기 유형: 입력 → 결과 단방향 `SimpleToolShell`

---

## 2. 권장 파일 구조

```text
src/
  data/
    usStockExchangeProfitCalculator.ts
  pages/
    tools/
      us-stock-exchange-profit-calculator.astro

public/
  scripts/
    us-stock-exchange-profit-calculator.js
  og/
    tools/
      us-stock-exchange-profit-calculator.png

src/styles/scss/pages/
  _us-stock-exchange-profit-calculator.scss
```

추가 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. MVP 범위

- 매수 환율, 매도 환율 입력
- 매수 주가, 매도 주가, 수량 입력
- 수수료 반영 옵션
- 달러 기준 수익률 계산
- 원화 기준 실제 수익률 계산
- 환차손익과 환율 영향 표시
- 환율 구간별 시뮬레이션 테이블
- 예시 프리셋 3개
- FAQ와 관련 계산기 링크

MVP 제외:

- 실시간 환율 API 자동 입력
- 양도소득세 상세 계산
- 포트폴리오 다종목 합산
- 증권사별 수수료 자동 비교

---

## 4. 데이터 설계

```ts
export interface UsStockExchangeMeta {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface UsStockExchangePreset {
  id: string;
  label: string;
  buyExchangeRate: number;
  sellExchangeRate: number;
  buyPriceUsd: number;
  sellPriceUsd: number;
  quantity: number;
  includeFee: boolean;
  feeRate: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

권장 export:

```ts
export const USEP_META = { ... };
export const USEP_DEFAULT_INPUT = { ... };
export const USEP_PRESETS: UsStockExchangePreset[] = [...];
export const USEP_FAQ: FaqItem[] = [...];
export const USEP_RELATED_LINKS = [...];
```

기본값:

```ts
export const USEP_DEFAULT_INPUT = {
  buyExchangeRate: 1400,
  sellExchangeRate: 1200,
  buyPriceUsd: 200,
  sellPriceUsd: 260,
  quantity: 10,
  includeFee: false,
  feeRate: 0.07,
};
```

---

## 5. 계산 로직

### 5-1. 기본 계산식

```js
buyAmountUsd = buyPriceUsd * quantity
sellAmountUsd = sellPriceUsd * quantity

buyFeeUsd = includeFee ? buyAmountUsd * feeRate / 100 : 0
sellFeeUsd = includeFee ? sellAmountUsd * feeRate / 100 : 0

netBuyAmountUsd = buyAmountUsd + buyFeeUsd
netSellAmountUsd = sellAmountUsd - sellFeeUsd

buyAmountKrw = netBuyAmountUsd * buyExchangeRate
sellAmountKrw = netSellAmountUsd * sellExchangeRate

stockProfitUsd = netSellAmountUsd - netBuyAmountUsd
stockReturnRateUsd = stockProfitUsd / netBuyAmountUsd * 100

totalProfitKrw = sellAmountKrw - buyAmountKrw
totalReturnRateKrw = totalProfitKrw / buyAmountKrw * 100

sameRateSellAmountKrw = netSellAmountUsd * buyExchangeRate
fxProfitKrw = sellAmountKrw - sameRateSellAmountKrw
fxImpactRatePoint = totalReturnRateKrw - stockReturnRateUsd
```

### 5-2. 환율 영향 비중

```js
fxImpactRatio = totalProfitKrw !== 0
  ? fxProfitKrw / totalProfitKrw * 100
  : null
```

전체 손익이 0원이거나 음수면 `참고 지표`로 표시한다.

### 5-3. 시뮬레이션

매도 환율 범위:

- 기본: 1,100원 ~ 1,500원
- step: 50원

```js
simulationRow = {
  exchangeRate,
  sellAmountKrw: netSellAmountUsd * exchangeRate,
  profitKrw: sellAmountKrw - buyAmountKrw,
  returnRateKrw: profitKrw / buyAmountKrw * 100,
}
```

---

## 6. 화면 IA

1. Hero
2. InfoNotice: 수수료/세금/환율 기준 안내
3. 입력 패널
4. 결과 KPI 카드
5. 환율 영향 해석 문구
6. 환율 구간별 시뮬레이션
7. 실전 케이스 3개
8. 계산 공식 설명
9. FAQ
10. 관련 계산기

---

## 7. 주요 DOM ID

입력:

| 필드 | id |
|---|---|
| 매수 환율 | `usep-buy-rate` |
| 매도 환율 | `usep-sell-rate` |
| 매수 주가 | `usep-buy-price` |
| 매도 주가 | `usep-sell-price` |
| 수량 | `usep-quantity` |
| 수수료 반영 | `usep-include-fee` |
| 수수료율 | `usep-fee-rate` |

결과:

| 결과 | id |
|---|---|
| 달러 기준 수익률 | `usep-r-usd-return` |
| 원화 기준 수익률 | `usep-r-krw-return` |
| 원화 투자금 | `usep-r-buy-krw` |
| 원화 회수금 | `usep-r-sell-krw` |
| 환차손익 | `usep-r-fx-profit` |
| 환율 영향 | `usep-r-fx-impact` |
| 해석 문구 | `usep-r-comment` |
| 시뮬레이션 tbody | `usep-simulation-body` |

---

## 8. JS 설계

파일: `public/scripts/us-stock-exchange-profit-calculator.js`

함수:

| 함수 | 역할 |
|---|---|
| `readForm()` | 입력값 읽기 |
| `calculate(input)` | 핵심 계산 |
| `generateSimulation(input, result)` | 환율별 결과 생성 |
| `renderResult(result)` | KPI와 상세 결과 업데이트 |
| `renderSimulation(rows)` | 테이블 렌더 |
| `getInterpretation(result)` | 결과 해석 문구 생성 |
| `applyPreset(id)` | 예시 입력 적용 |
| `syncUrlParams()` | URL 상태 저장 |
| `restoreFromUrl()` | URL 상태 복원 |
| `copyShareLink()` | 링크 복사 |

결과 해석 분기:

| 조건 | 문구 |
|---|---|
| 달러 수익률 > 원화 수익률 | 환율 하락으로 원화 수익률이 줄었습니다. |
| 달러 수익률 < 원화 수익률 | 환율 상승으로 원화 기준 수익률이 높아졌습니다. |
| 달러 수익률 양수, 원화 수익률 음수 | 주가는 올랐지만 환율 하락 때문에 원화 손실이 발생했습니다. |
| 달러 수익률 음수, 원화 수익률 양수 | 주가는 하락했지만 환율 상승으로 원화 수익이 발생했습니다. |

---

## 9. 스타일 설계

- SCSS 파일: `_us-stock-exchange-profit-calculator.scss`
- 클래스 prefix: `usep-`
- 색상: 투자/환율 페이지답게 블루 + 그린/레드 수익 상태

주요 블록:

```scss
.usep-kpi-grid
.usep-kpi-card
.usep-result-comment
.usep-simulation-table
.usep-case-grid
.usep-preset-row
```

모바일:

- KPI 2열, 640px 이상 3~4열
- 시뮬레이션 표는 `.table-wrap` 가로 스크롤
- 입력 필드는 1열, 데스크톱에서 2열

---

## 10. SEO 설계

```text
title: 미국주식 환차손익 계산기 | 달러 수익률·원화 수익률 계산
description: 미국주식 매수 환율과 매도 환율, 주가, 수량을 입력하면 달러 기준 수익률과 실제 원화 기준 수익률, 환차손익을 계산합니다.
canonical: https://bigyocalc.com/tools/us-stock-exchange-profit-calculator/
```

타겟 키워드:

- 미국주식 환차손 계산기
- 미국주식 원화 수익률 계산
- 달러 원화 수익률 계산
- 환차손익 계산
- 미국주식 환율 영향

---

## 11. 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "us-stock-exchange-profit-calculator",
  title: "미국주식 환차손익 계산기",
  description: "매수·매도 환율과 주가를 반영해 달러 수익률과 실제 원화 수익률 차이를 계산합니다.",
  category: "investment",
  badges: ["미국주식", "환율", "원화수익률"],
}
```

### `src/styles/app.scss`

```scss
@use 'scss/pages/us-stock-exchange-profit-calculator';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/us-stock-exchange-profit-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. QA 체크리스트

- [ ] 달러 기준 수익률과 원화 기준 수익률이 각각 분리 표시된다.
- [ ] 매수 환율 1,400원, 매도 환율 1,200원, 주가 +30% 예시에서 원화 수익률이 약 +11.43%로 나온다.
- [ ] 수수료 토글을 켜면 결과가 즉시 바뀐다.
- [ ] 전체 원화 손익이 0원일 때 환율 영향 비중이 `-` 또는 참고 문구로 처리된다.
- [ ] 시뮬레이션 표가 모바일에서 가로 스크롤된다.
- [ ] URL 공유 후 재진입 시 입력값이 복원된다.
- [ ] `npm run build`가 성공한다.


---

## 상세 구현 보강

> 이 섹션은 구현자가 문서만 보고도 페이지 구조, 데이터 경계, 예외 처리, 검수 기준을 바로 잡을 수 있도록 보강한 상세 설계이다.

### 보강 대상 요약

- 페이지명: 미국주식 환차익 계산기
- 콘텐츠 유형: 계산기
- slug: us-stock-exchange-profit-calculator
- 주요 사용자: 미국주식 투자자, 달러 환전 사용자
- 핵심 가치: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주요 리스크: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 목표: 계산 또는 비교 결과를 빠르게 보여주되, 기준과 한계를 함께 노출한다.
- 문서 사용 방식: 구현 전 구조 확인, 구현 중 누락 체크, 배포 전 QA 기준으로 사용한다.

### 구현자가 먼저 확인할 핵심 질문

- 이 페이지가 답해야 하는 첫 질문을 H1 직후 1문장으로 고정한다.
- 사용자가 입력해야 하는 값과 읽기만 하면 되는 값을 분리한다.
- 공식 데이터, 참고 데이터, 추정 데이터를 화면과 문서에서 같은 용어로 구분한다.
- 모바일 첫 화면에서 핵심 결과 또는 핵심 요약이 접히지 않도록 우선순위를 둔다.
- 기존 계산기와 동일한 레이아웃 컴포넌트를 재사용할 수 있는지 먼저 판단한다.
- 결과가 큰 숫자를 다룰 때 만원, 억원, 퍼센트 단위를 혼용하지 않는다.
- 사용자가 공유 링크를 열었을 때 입력값 복원이 필요한지 결정한다.
- 페이지 하단 FAQ가 검색 유입 질문을 직접 받아낼 수 있도록 질문형 문장으로 작성한다.

### 데이터 모델 상세 원칙

- 데이터 파일은 화면 표시 텍스트와 계산 기준값을 함께 보관하되 계산 함수 내부 상수와 중복하지 않는다.
- 금액은 내부 계산에서 원 단위를 기본으로 하고 화면 표시에서만 만원 또는 억원으로 변환한다.
- 비율은 내부에서 0.1 형식과 10 형식을 섞지 말고 한 가지로 고정한다.
- 데이터 항목에는 label, shortLabel, description, note를 구분해 긴 문구가 버튼 안으로 들어가지 않게 한다.
- 출처가 필요한 수치는 sourceName, sourceUrl, sourceDate, sourceType 필드를 둔다.
- 추정값에는 assumption 필드를 두고 결과 영역에서 다시 노출할 수 있게 한다.
- 정렬이 필요한 목록은 order 필드를 둬서 배열 순서 의존을 줄인다.
- 비활성 또는 향후 확장 항목은 주석보다 status 필드로 관리한다.

### Astro 페이지 구현 지침

- frontmatter에서는 데이터 import, SEO 메타 구성, JSON 직렬화까지만 처리한다.
- 본문 마크업은 hero, calculator/report body, insight, faq, related 순서로 읽히게 한다.
- 사용자 facing 텍스트는 전부 한국어로 작성하고 영어 약어는 처음 등장할 때 설명한다.
- 계산기 페이지는 SimpleToolShell 우선 검토 후 맞지 않는 경우에만 커스텀 레이아웃을 쓴다.
- 리포트 페이지는 표와 카드가 많아져도 카드 안에 또 카드가 들어가지 않도록 한다.
- data-* 속성에 큰 JSON을 넣을 때는 HTML escape와 파싱 실패 fallback을 준비한다.
- 결과 영역은 스크립트 미실행 상태에서도 기본 안내문이 보이게 한다.
- 관련 링크는 src/data/tools.ts 또는 reports.ts에 등록된 실제 slug와 맞춘다.

### 클라이언트 스크립트 구현 지침

- 즉시 실행 함수 범위 안에서 변수를 관리하고 전역 이름 충돌을 피한다.
- DOM 조회 실패 시 조용히 return하지 말고 개발자가 확인 가능한 console.warn을 남긴다.
- 입력값 파싱은 parseFloat 직접 호출보다 sanitizeNumber 유틸 성격의 함수를 둔다.
- 계산 함수는 DOM과 분리해 동일 입력에 동일 결과를 반환하게 한다.
- 이벤트 리스너는 input, change, click의 역할을 나눠 중복 계산을 줄인다.
- URL 상태 저장이 필요한 경우 기존 public/scripts/url-state.js 패턴을 먼저 확인한다.
- 차트가 필요한 경우 Chart.js 초기화와 destroy 처리를 함께 구현한다.
- 결과 공유 버튼은 navigator.clipboard 실패 시 URL 텍스트 선택 fallback을 둔다.

### SCSS 설계 지침

- 최상위 클래스는 slug 기반 page class 하나로 시작하고 모든 선택자는 그 아래에 둔다.
- 색상은 토큰 또는 기존 CSS 변수 우선이며 새 색상은 3개 이하로 제한한다.
- 모바일 360px 폭에서 숫자 카드와 버튼 텍스트가 줄바꿈되어도 높이가 과도하게 튀지 않게 한다.
- 표는 모바일에서 가로 스크롤 또는 카드형 전환 중 하나를 명확히 선택한다.
- 결과 숫자는 font-size보다 font-weight와 간격으로 위계를 만든다.
- 상태 색상은 수익, 위험, 중립을 색상만으로 구분하지 말고 텍스트 라벨을 같이 둔다.
- hover 스타일은 데스크톱 보강으로만 두고 모바일 사용성을 hover에 의존하지 않는다.
- app.scss import 누락이 빌드에서 바로 드러나도록 partial 파일명을 slug와 일치시킨다.

### 접근성 및 사용성 기준

- 모든 입력에는 label 또는 aria-label을 제공한다.
- 슬라이더를 쓰는 경우 현재 값이 숫자로 함께 표시되어야 한다.
- 계산 결과 변경은 시각적으로만 표시하지 말고 텍스트도 갱신한다.
- 버튼은 기능이 명확한 한국어 동사로 작성한다.
- 색 대비가 낮은 보조 텍스트는 14px 이하로 내려가지 않게 한다.
- 키보드 탭 순서는 화면 흐름과 동일해야 한다.
- 오류 또는 경고 문구는 입력 필드 바로 아래에 배치한다.
- 긴 표는 caption 또는 직전 문단으로 표의 의미를 설명한다.

### SEO 콘텐츠 기준

- H1은 사용자가 검색하는 핵심 명사를 포함하되 과장된 표현을 피한다.
- 도입부 첫 2문단 안에 이 페이지로 해결할 수 있는 상황을 구체화한다.
- FAQ는 실제 검색 질문 형태로 만들고 답변은 2~4문장으로 끝낸다.
- 계산기라면 공식, 예시, 해석법을 별도 섹션으로 제공한다.
- 리포트라면 기준일, 데이터 범위, 해석 한계를 상단에 둔다.
- 관련 계산기와 리포트 링크를 양방향으로 연결한다.
- 메타 설명은 숫자 결과보다 사용자가 얻는 판단을 중심으로 작성한다.
- 본문에 출처명만 나열하지 말고 어떤 수치에 쓰였는지 연결한다.

### 품질 검증 체크리스트

- npm run build가 성공해야 한다.
- 모바일 360px, 390px, 768px, 데스크톱 1280px에서 레이아웃 깨짐을 확인한다.
- 입력 최소값, 최대값, 빈 값, 0 값, 음수 방어를 확인한다.
- 공유 URL을 새 탭에서 열었을 때 상태 복원이 의도대로 되는지 확인한다.
- sitemap.xml, data 등록, app.scss import 누락을 확인한다.
- 콘솔 오류가 없는지 브라우저에서 확인한다.
- 공식 데이터와 추정 데이터 배지가 누락되지 않았는지 확인한다.
- 결과 문구가 투자, 의료, 세무, 법률 조언으로 오해되지 않는지 확인한다.

### 화면 블록별 상세 요구사항

#### 1. 상단 요약

- 목적: us-stock-exchange-profit-calculator 페이지에서 상단 요약 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 2. 입력 영역

- 목적: us-stock-exchange-profit-calculator 페이지에서 입력 영역 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 3. 결과 영역

- 목적: us-stock-exchange-profit-calculator 페이지에서 결과 영역 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 4. 상세 해석

- 목적: us-stock-exchange-profit-calculator 페이지에서 상세 해석 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 5. 비교 표

- 목적: us-stock-exchange-profit-calculator 페이지에서 비교 표 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 6. 모바일 화면

- 목적: us-stock-exchange-profit-calculator 페이지에서 모바일 화면 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 7. 데스크톱 화면

- 목적: us-stock-exchange-profit-calculator 페이지에서 데스크톱 화면 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 8. 데이터 출처

- 목적: us-stock-exchange-profit-calculator 페이지에서 데이터 출처 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 9. 추정값 안내

- 목적: us-stock-exchange-profit-calculator 페이지에서 추정값 안내 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 10. FAQ

- 목적: us-stock-exchange-profit-calculator 페이지에서 FAQ 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 11. 관련 링크

- 목적: us-stock-exchange-profit-calculator 페이지에서 관련 링크 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 12. 공유 기능

- 목적: us-stock-exchange-profit-calculator 페이지에서 공유 기능 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 13. 오류 처리

- 목적: us-stock-exchange-profit-calculator 페이지에서 오류 처리 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 14. 빈 상태

- 목적: us-stock-exchange-profit-calculator 페이지에서 빈 상태 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 15. 극단값

- 목적: us-stock-exchange-profit-calculator 페이지에서 극단값 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 16. 성능

- 목적: us-stock-exchange-profit-calculator 페이지에서 성능 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 17. 접근성

- 목적: us-stock-exchange-profit-calculator 페이지에서 접근성 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 18. SEO

- 목적: us-stock-exchange-profit-calculator 페이지에서 SEO 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 19. QA

- 목적: us-stock-exchange-profit-calculator 페이지에서 QA 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

#### 20. 배포 전 점검

- 목적: us-stock-exchange-profit-calculator 페이지에서 배포 전 점검 블록이 사용자의 다음 판단을 돕도록 설계한다.
- 필수 표시: 매수·매도 환율과 주가 변동을 분리해 원화 수익을 계산한다.
- 주의 문구: 세금과 수수료 조건을 단순화하므로 계산 기준을 화면에 표시한다.
- 구현 메모: 텍스트, 숫자, 배지, 링크가 한 줄에 과도하게 몰리지 않도록 반응형 줄바꿈을 전제로 작성한다.
- 검수 기준: 모바일에서 블록의 첫 문장과 핵심 숫자가 동시에 이해되어야 한다.

### 구현 작업 분해

#### 작업 1. 데이터 타입 정의

- 작업 범위: us-stock-exchange-profit-calculator의 데이터 타입 정의 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 2. 기본값 구성

- 작업 범위: us-stock-exchange-profit-calculator의 기본값 구성 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 3. 프리셋 작성

- 작업 범위: us-stock-exchange-profit-calculator의 프리셋 작성 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 4. Astro 마크업 배치

- 작업 범위: us-stock-exchange-profit-calculator의 Astro 마크업 배치 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 5. data 속성 연결

- 작업 범위: us-stock-exchange-profit-calculator의 data 속성 연결 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 6. 계산 함수 분리

- 작업 범위: us-stock-exchange-profit-calculator의 계산 함수 분리 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 7. 이벤트 바인딩

- 작업 범위: us-stock-exchange-profit-calculator의 이벤트 바인딩 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 8. 숫자 포맷터 작성

- 작업 범위: us-stock-exchange-profit-calculator의 숫자 포맷터 작성 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 9. 결과 문구 매핑

- 작업 범위: us-stock-exchange-profit-calculator의 결과 문구 매핑 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 10. SCSS partial 작성

- 작업 범위: us-stock-exchange-profit-calculator의 SCSS partial 작성 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 11. app.scss 등록

- 작업 범위: us-stock-exchange-profit-calculator의 app.scss 등록 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 12. 목록 데이터 등록

- 작업 범위: us-stock-exchange-profit-calculator의 목록 데이터 등록 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 13. sitemap 등록

- 작업 범위: us-stock-exchange-profit-calculator의 sitemap 등록 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 14. FAQ 렌더링

- 작업 범위: us-stock-exchange-profit-calculator의 FAQ 렌더링 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 15. 관련 링크 검증

- 작업 범위: us-stock-exchange-profit-calculator의 관련 링크 검증 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 16. 모바일 확인

- 작업 범위: us-stock-exchange-profit-calculator의 모바일 확인 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 17. 빌드 확인

- 작업 범위: us-stock-exchange-profit-calculator의 빌드 확인 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 18. 콘솔 오류 확인

- 작업 범위: us-stock-exchange-profit-calculator의 콘솔 오류 확인 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 19. 문구 검수

- 작업 범위: us-stock-exchange-profit-calculator의 문구 검수 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

#### 작업 20. 추정 배지 확인

- 작업 범위: us-stock-exchange-profit-calculator의 추정 배지 확인 항목을 기존 Astro, SCSS, vanilla JS 패턴에 맞춰 구현한다.
- 완료 조건: 코드에서 하드코딩된 임시 문구, 미사용 변수, 빈 배열 placeholder가 남지 않는다.
- 검토 포인트: 데이터 파일, 페이지 마크업, 스크립트, 스타일, 등록 파일 사이의 slug가 모두 일치해야 한다.
- 실패 시 증상: 빌드 오류, 카드 미노출, 결과 미갱신, sitemap 누락, 모바일 overflow 중 하나로 드러날 가능성이 높다.

### 데이터 신뢰도 표기 규칙

| 데이터 성격 | 화면 배지 | 문서화 방식 | 구현 주의 |
|---|---|---|---|
| 정부·공공기관 고시값 | 공식 | 출처명과 기준일을 함께 표기 | 값 변경 시 데이터 파일만 수정 가능해야 함 |
| 기업 공개 가격·요금 | 참고 | 기준일과 링크를 함께 표기 | 실시간 가격처럼 표현하지 않음 |
| 사용자 입력 기반 계산값 | 추정 | 공식과 입력값을 함께 설명 | 결과 카드에 추정 문구 유지 |
| 편집부 가정값 | 시뮬레이션 | 가정 범위와 기본값을 표기 | 기본값을 공식 평균처럼 표현하지 않음 |

### 문구 작성 가이드

- 결과가 좋다 또는 나쁘다로 끝내지 말고 왜 그런지 한 문장으로 설명한다.
- 사용자에게 특정 금융상품, 병원, 지역, 투자 선택을 직접 권유하지 않는다.
- 숫자 뒤에는 기준 기간을 붙인다. 예: 월 기준, 연 기준, 1회 기준.
- 비교 문구는 A가 B보다 얼마인지와 그 차이가 생긴 이유를 함께 보여준다.
- 불확실한 값은 예상, 추정, 시뮬레이션 중 하나로 통일한다.
- 버튼 문구는 계산하기, 입력값 초기화, 결과 공유처럼 동작 중심으로 쓴다.
- FAQ 답변은 길어지면 본문 섹션으로 올리고 FAQ는 요약 답변만 남긴다.
- 표 제목은 데이터의 결론이 아니라 표가 담는 범위를 설명한다.
- 빈 상태 문구는 사용자를 탓하지 않고 다음 입력을 안내한다.
- 경고 문구는 붉은색만 쓰지 말고 텍스트로도 위험을 설명한다.

### 테스트 시나리오

- 시나리오 1: 모든 숫자 입력을 최소값으로 바꿨을 때 NaN, Infinity, 음수 표시가 나오지 않는지 확인한다.
- 시나리오 2: 현실적인 중간값을 입력했을 때 요약 카드, 상세 표, 해석 문구가 같은 방향의 결과를 말하는지 확인한다.
- 시나리오 3: 극단적으로 큰 값을 입력했을 때 숫자 포맷과 카드 너비가 깨지지 않는지 확인한다.
- 시나리오 4: 공유 URL 또는 초기화 버튼을 사용한 뒤 입력 상태와 결과 상태가 일치하는지 확인한다.
- 시나리오 5: 모바일 폭에서 버튼, 표, 결과 카드가 겹치지 않고 스크롤 흐름이 자연스러운지 확인한다.
- 시나리오 6: 기본값 그대로 진입했을 때 결과 영역이 비어 있지 않은지 확인한다.
- 시나리오 7: 모든 숫자 입력을 최소값으로 바꿨을 때 NaN, Infinity, 음수 표시가 나오지 않는지 확인한다.
- 시나리오 8: 현실적인 중간값을 입력했을 때 요약 카드, 상세 표, 해석 문구가 같은 방향의 결과를 말하는지 확인한다.
- 시나리오 9: 극단적으로 큰 값을 입력했을 때 숫자 포맷과 카드 너비가 깨지지 않는지 확인한다.
- 시나리오 10: 공유 URL 또는 초기화 버튼을 사용한 뒤 입력 상태와 결과 상태가 일치하는지 확인한다.
- 시나리오 11: 모바일 폭에서 버튼, 표, 결과 카드가 겹치지 않고 스크롤 흐름이 자연스러운지 확인한다.
- 시나리오 12: 기본값 그대로 진입했을 때 결과 영역이 비어 있지 않은지 확인한다.
- 시나리오 13: 모든 숫자 입력을 최소값으로 바꿨을 때 NaN, Infinity, 음수 표시가 나오지 않는지 확인한다.
- 시나리오 14: 현실적인 중간값을 입력했을 때 요약 카드, 상세 표, 해석 문구가 같은 방향의 결과를 말하는지 확인한다.
- 시나리오 15: 극단적으로 큰 값을 입력했을 때 숫자 포맷과 카드 너비가 깨지지 않는지 확인한다.
- 시나리오 16: 공유 URL 또는 초기화 버튼을 사용한 뒤 입력 상태와 결과 상태가 일치하는지 확인한다.
- 시나리오 17: 모바일 폭에서 버튼, 표, 결과 카드가 겹치지 않고 스크롤 흐름이 자연스러운지 확인한다.
- 시나리오 18: 기본값 그대로 진입했을 때 결과 영역이 비어 있지 않은지 확인한다.
- 시나리오 19: 모든 숫자 입력을 최소값으로 바꿨을 때 NaN, Infinity, 음수 표시가 나오지 않는지 확인한다.
- 시나리오 20: 현실적인 중간값을 입력했을 때 요약 카드, 상세 표, 해석 문구가 같은 방향의 결과를 말하는지 확인한다.
- 시나리오 21: 극단적으로 큰 값을 입력했을 때 숫자 포맷과 카드 너비가 깨지지 않는지 확인한다.
- 시나리오 22: 공유 URL 또는 초기화 버튼을 사용한 뒤 입력 상태와 결과 상태가 일치하는지 확인한다.
- 시나리오 23: 모바일 폭에서 버튼, 표, 결과 카드가 겹치지 않고 스크롤 흐름이 자연스러운지 확인한다.
- 시나리오 24: 기본값 그대로 진입했을 때 결과 영역이 비어 있지 않은지 확인한다.
- 시나리오 25: 모든 숫자 입력을 최소값으로 바꿨을 때 NaN, Infinity, 음수 표시가 나오지 않는지 확인한다.
- 시나리오 26: 현실적인 중간값을 입력했을 때 요약 카드, 상세 표, 해석 문구가 같은 방향의 결과를 말하는지 확인한다.
- 시나리오 27: 극단적으로 큰 값을 입력했을 때 숫자 포맷과 카드 너비가 깨지지 않는지 확인한다.
- 시나리오 28: 공유 URL 또는 초기화 버튼을 사용한 뒤 입력 상태와 결과 상태가 일치하는지 확인한다.
- 시나리오 29: 모바일 폭에서 버튼, 표, 결과 카드가 겹치지 않고 스크롤 흐름이 자연스러운지 확인한다.
- 시나리오 30: 기본값 그대로 진입했을 때 결과 영역이 비어 있지 않은지 확인한다.

### 배포 전 최종 확인

- [ ] 문서의 slug와 실제 파일명이 일치한다.
- [ ] 사용자 facing 문구가 모두 한국어다.
- [ ] 공식 데이터와 추정 데이터가 배지로 구분된다.
- [ ] 계산 공식 또는 비교 기준이 본문에 설명되어 있다.
- [ ] 관련 페이지 링크가 실제 존재한다.
- [ ] sitemap.xml에 URL이 등록되어 있다.
- [ ] src/data/tools.ts 또는 src/data/reports.ts 등록이 완료되어 있다.
- [ ] src/styles/app.scss에 SCSS partial이 import되어 있다.
- [ ] npm run build가 성공한다.
- [ ] 배포 후 검색엔진이 읽을 수 있는 정적 콘텐츠가 충분하다.

