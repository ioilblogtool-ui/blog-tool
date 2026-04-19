# 국내주식 양도소득세 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/domestic-stock-capital-gains-tax.md`
> 작성일: 2026-04-18
> 구현 기준: Codex/Claude가 이 문서만 보고 바로 `/tools/` 계산기를 구현할 수 있는 수준으로 고정
> 참고 계산기: `coin-tax-calculator`, `dca-investment-calculator`, `salary`

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/domestic-stock-capital-gains-tax.md`
- 구현 대상: `국내주식 양도소득세 계산기`
- 권장 slug: `domestic-stock-capital-gains-tax`
- 권장 URL: `/tools/domestic-stock-capital-gains-tax/`
- 콘텐츠 유형: 계산기 (`/tools/`)

### 1-2. 페이지 성격
- 단순히 “세금 얼마”만 보여주는 계산기가 아니라 `과세 대상 여부 -> 양도차익 계산 -> 기본공제 적용 -> 세율/지방소득세 반영 -> 절세 판단`까지 이어지는 도구
- 2026 기준 메시지는 반드시 아래처럼 고정:
  - `금융투자소득세는 폐지`
  - `현재는 기존 양도소득세 체계 기준`
  - `국내 상장주식은 대주주 / 장외거래 / 비상장주식 여부가 핵심`
- 사용자 불안을 줄이기 위해 첫 화면부터 “대부분의 일반 개인투자자는 과세 대상이 아닐 수 있다”는 메시지를 함께 안내

### 1-3. 이 문서의 역할
- 기획 문서를 실제 구현 전 단계의 설계 문서로 정리
- 데이터 스키마, 입력 UX, 계산 로직, FAQ, SCSS prefix, 등록 체크를 고정
- 이후 구현은 이 문서를 기준으로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/`, `src/data/tools.ts`에 반영

---

## 2. 권장 파일 구조

```text
src/
  data/
    domesticStockCapitalGainsTax.ts
  pages/
    tools/
      domestic-stock-capital-gains-tax.astro

public/
  scripts/
    domestic-stock-capital-gains-tax.js
  og/
    tools/
      domestic-stock-capital-gains-tax.png

src/styles/scss/pages/
  _domestic-stock-capital-gains-tax.scss
```

### 2-1. 추가 반영 파일
- `src/data/tools.ts`
- `src/pages/index.astro`
- `src/pages/tools/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 범위
- 2026 기준 과세 안내 배너
- 과세 대상 여부 체크
- 단일/복수 종목 입력
- 양도차익 계산
- 손익통산 반영
- 기본공제 250만원 반영
- 세율 선택 및 지방소득세 포함 금액 계산
- 결과 KPI 카드
- 과세 대상/비대상 해석 메시지
- 절세 시나리오 예시
- FAQ / 관련 링크 / 출처

### 3-2. MVP 제외
- 실시간 세법 개정 연동
- 자동 환율 반영
- 증권사 거래내역 업로드
- 종목별 평균단가 자동 계산
- 신고서 생성 기능

### 3-3. 확장 여지
- 국내/미국주식 통합 모드
- 연도별 세법 분기
- 대주주 판정 도우미 확장
- 절세 시뮬레이션 캘린더

---

## 4. 페이지 목표

- 사용자가 먼저 “내가 과세 대상인지 아닌지”를 빠르게 판단하게 만든다.
- 과세 대상이라면 `양도차익 -> 공제 -> 세액 -> 체감 순수익` 흐름을 직관적으로 보여준다.
- 복수 종목 손익통산과 대주주 여부가 세금 판단의 핵심이라는 점을 이해시키고, 불필요한 공포를 줄인다.
- 마지막에는 관련 계산기와 투자 리포트로 자연스럽게 이어지게 한다.

---

## 5. 데이터 설계 (`src/data/domesticStockCapitalGainsTax.ts`)

### 5-1. 타입 정의

```ts
export type AssetTradeType = "listed" | "otc" | "unlisted";
export type TaxMode = "effective" | "incomeTaxOnly";
export type HoldingPeriodType = "under1y" | "over1y";

export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface TaxRules {
  taxYear: number;
  basicDeduction: number;
  generalRate: number;
  surchargeRate: number;
  shortTermRate: number;
  localTaxRate: number;
  majorShareholderThresholdWon: number;
  kficsRepealed: boolean;
}

export interface StockLotInput {
  id: string;
  assetName: string;
  tradeType: AssetTradeType;
  averageBuyPrice: number;
  sellPrice: number;
  quantity: number;
  buyFee: number;
  sellFee: number;
  extraCost: number;
  isMajorShareholder: boolean;
  holdingPeriod: HoldingPeriodType;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  lots: StockLotInput[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface SourceLink {
  href: string;
  label: string;
}
```

### 5-2. 권장 export 구조

```ts
export const DSCGT_META = { ... };
export const DSCGT_RULES = { ... };
export const DSCGT_DEFAULT_LOTS = [ ... ];
export const DSCGT_SCENARIO_PRESETS = [ ... ];
export const DSCGT_FAQ = [ ... ];
export const DSCGT_GUIDE_POINTS = [ ... ];
export const DSCGT_RELATED_LINKS = [ ... ];
export const DSCGT_SOURCE_LINKS = [ ... ];
```

### 5-3. 데이터 작성 원칙
- 기본값은 `국내 상장주식 / 대주주 아님 / 1년 이상 보유`로 시작
- 기본 예시는 비과세 상황 1개, 과세 상황 1개, 손익통산 예시 1개를 포함
- 모든 문구는 “예상 세액”, “추정”, “참고용” 표현으로 고정
- 법조문 인용보다 사용자가 해석하기 쉬운 말로 재구성

---

## 6. 계산 로직

### 6-1. 과세 대상 판정

과세 여부는 우선 아래 순서로 판단:

1. `tradeType === "unlisted"` 이면 과세 대상
2. `tradeType === "otc"` 이면 과세 대상
3. `tradeType === "listed"` 이면서 `isMajorShareholder === true` 이면 과세 대상
4. 그 외는 기본적으로 비과세 안내

### 6-2. 종목별 양도차익

```js
capitalGain =
  (sellPrice - averageBuyPrice) * quantity
  - buyFee
  - sellFee
  - extraCost;
```

### 6-3. 손익통산

```js
netGain = sum(all positive gains) - sum(all losses);
```

### 6-4. 기본공제 적용

```js
taxableIncome = Math.max(0, netGain - basicDeduction);
```

### 6-5. 세율 적용

```js
baseRate =
  holdingPeriod === "under1y"
    ? shortTermRate
    : generalRate;

incomeTax =
  taxMode === "incomeTaxOnly"
    ? taxableIncome * baseRate
    : taxableIncome * (baseRate + localTaxRate);
```

### 6-6. 지방소득세 분리 표시

```js
nationalTax = taxableIncome * baseRate;
localTax = taxableIncome * localTaxRate;
totalTax = nationalTax + localTax;
```

### 6-7. 체감 순수익

```js
afterTaxProfit = netGain - totalTax;
netReceipt = totalSellAmount - totalSellFee - totalTax;
```

### 6-8. 비과세 상태 처리
- `isTaxable === false`이면
  - 세액은 0
  - 결과 카드에 “현재 입력 기준 비과세 가능성 높음” 메시지 노출
  - 단, “대주주 여부 및 거래 유형은 다시 확인 필요” 보조 문구 유지

---

## 7. 페이지 구조 (`src/pages/tools/domestic-stock-capital-gains-tax.astro`)

### 7-1. 기본 구성
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SimpleToolShell`
- `SeoContent`

### 7-2. 권장 설정
- `calculatorId="domestic-stock-capital-gains-tax"`
- `pageClass="dscgt-page"`
- `resultFirst={true}`

### 7-3. 섹션 순서

#### [A] Hero
- eyebrow: `주식 세금 계산기`
- title: `국내주식 양도소득세, 과세 대상인지부터 먼저 확인합니다`
- description:
  `국내 상장주식 대주주, 장외거래, 비상장주식 양도 시 예상 세액을 빠르게 계산하고 손익통산과 기본공제까지 함께 확인하는 계산기`

#### [B] InfoNotice
- 2026 기준 금융투자소득세 폐지 안내
- 현재는 기존 양도소득세 체계 기준이라는 점
- 일반 개인투자자 다수는 비과세일 수 있다는 점

#### [C] 입력 패널

##### 블록 1. 과세 판정 조건
- 거래 유형
- 대주주 여부
- 보유 기간

##### 블록 2. 종목 입력
- 종목명
- 평균 매수가
- 매도가
- 수량
- 매수 수수료
- 매도 수수료
- 기타 필요경비

##### 블록 3. 복수 종목
- 행 추가 버튼
- 행 삭제 버튼
- 손익통산 ON 기본

##### 블록 4. 계산 옵션
- `세율 모드`: `국세만` / `지방소득세 포함`
- `기본공제 적용` 안내 (체크 해제 없이 고정 표시 권장)

#### [D] 결과 KPI 카드
- 총 양도차익
- 과세표준 대상 금액
- 예상 국세
- 예상 지방소득세 포함 총세액
- 세후 순수익

#### [E] 과세 해석 박스
- 비과세 상태면:
  - `현재 입력 기준 과세 대상이 아닐 수 있습니다`
- 과세 상태면:
  - `대주주/장외/비상장 기준으로 과세 가능성이 높습니다`

#### [F] 손익통산 시나리오 표
- 이익 종목 합계
- 손실 종목 합계
- 통산 후 순이익
- 기본공제 반영 후 과세표준

#### [G] 절세 시나리오 가이드
- 손실 종목을 함께 정리할 때
- 대주주 여부 확인이 필요한 때
- 연내 분산 매도 판단 예시

#### [H] FAQ / 출처 / 관련 링크
- FAQ 5개 내외
- 관련 계산기:
  - `/tools/coin-tax-calculator/`
  - `/tools/dca-investment-calculator/`
  - `/tools/fire-calculator/`

---

## 8. 인터랙션 설계 (`public/scripts/domestic-stock-capital-gains-tax.js`)

### 8-1. 필요한 상태

```ts
type ViewState = {
  lots: StockLotInput[];
  taxMode: "effective" | "incomeTaxOnly";
  isTaxable: boolean;
};
```

### 8-2. 인터랙션 목록
- 종목 행 추가/삭제
- 입력값 즉시 계산
- 과세 대상 여부 즉시 배지 변경
- preset 버튼 적용
- 링크 복사
- 초기화

### 8-3. 스크립트에서 할 일
- JSON config 파싱
- 행별 gain 계산
- 전체 손익통산 계산
- 과세 대상 판정
- KPI 렌더링
- 결과 메시지 렌더링
- query string 저장 권장:
  - `?mode=effective&taxable=major&lots=2`

### 8-4. 차트
- MVP에서는 차트 없이 카드/표 중심 권장
- 필요하면 미니 bar chart 1개 정도만 추가:
  - `세전 이익 / 공제 후 과세표준 / 세후 이익`

---

## 9. 스타일 가이드 (`_domestic-stock-capital-gains-tax.scss`)

### 9-1. prefix
- `dscgt-`

### 9-2. 주요 블록
- `.dscgt-page`
- `.dscgt-status-badge`
- `.dscgt-lot-table`
- `.dscgt-kpi-grid`
- `.dscgt-result-box`
- `.dscgt-guide-grid`
- `.dscgt-faq`

### 9-3. 색상 방향
- 기본: 뉴트럴 화이트/아이보리
- accent: 네이비/티얼
- warning: muted orange
- 비과세 상태는 green 계열 badge
- 과세 상태는 amber/red 계열 badge

### 9-4. 모바일
- 종목 입력 표는 카드형으로 자동 전환
- KPI는 2열 이하
- 복수 종목 UI는 “종목 추가” 버튼이 하단 고정이 아니라 입력 영역 끝에 위치

---

## 10. SEO / 메타 / 스키마

### 10-1. 메타
- `title`: `국내주식 양도소득세 계산기 | 대주주·비상장·장외거래 예상 세액 계산`
- `description`: `2026 기준 국내주식 양도소득세 체계로 대주주, 비상장주식, 장외거래의 예상 세액을 계산합니다. 손익통산, 기본공제 250만원, 지방소득세 포함 금액까지 한 번에 확인하세요.`

### 10-2. H1
- `국내주식 양도소득세 계산기`

### 10-3. 구조화 데이터
- `WebApplication`
- `FAQPage`

### 10-4. 내부 링크
- `/tools/coin-tax-calculator/`
- `/tools/dca-investment-calculator/`
- `/tools/fire-calculator/`

---

## 11. 등록 반영

### 11-1. `src/data/tools.ts`

```ts
{
  slug: "domestic-stock-capital-gains-tax",
  title: "국내주식 양도소득세 계산기",
  description: "국내 상장주식 대주주, 장외거래, 비상장주식 양도 시 예상 세액을 계산하고 손익통산과 기본공제까지 반영하는 계산기입니다.",
  order: 26,
  eyebrow: "주식 세금",
  category: "investment",
  iframeReady: true,
  badges: ["세금", "국내주식", "2026"],
}
```

### 11-2. `src/pages/index.astro`
- `topicBySlug["domestic-stock-capital-gains-tax"] = "투자·재테크"`

### 11-3. `src/pages/tools/index.astro`
- `topicBySlug["domestic-stock-capital-gains-tax"] = "투자·은퇴"`
- `toolHighlights["domestic-stock-capital-gains-tax"]` 추가

### 11-4. `src/styles/app.scss`

```scss
@use 'scss/pages/domestic-stock-capital-gains-tax';
```

### 11-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/domestic-stock-capital-gains-tax/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. 구현 순서

1. `src/data/domesticStockCapitalGainsTax.ts` 작성
2. `src/pages/tools/domestic-stock-capital-gains-tax.astro` 작성
3. `public/scripts/domestic-stock-capital-gains-tax.js` 작성
4. `src/styles/scss/pages/_domestic-stock-capital-gains-tax.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/pages/index.astro`, `src/pages/tools/index.astro` 노출 보정
7. `src/styles/app.scss` 등록
8. `public/sitemap.xml` 등록
9. `npm run build` 검증

---

## 13. QA 체크리스트

- [ ] 2026 기준 금융투자소득세 폐지 문구가 명확한가
- [ ] 과세 대상 여부 판단이 입력 직후 바로 보이는가
- [ ] 비과세 상태에서도 불필요하게 세금 공포를 유발하지 않는가
- [ ] 손익통산과 기본공제 250만원이 계산 로직에 반영되는가
- [ ] 국세와 지방소득세를 분리해서 보여주는가
- [ ] 모바일에서 복수 종목 입력 UI가 깨지지 않는가
- [ ] `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 빠지지 않았는가
- [ ] `npm run build`가 성공하는가

---

## 14. 핵심 구현 메모

- 이 계산기의 핵심은 “세금 계산”보다 “과세 대상 여부를 먼저 판단해 주는 UX”다.
- 비과세 상태를 명확히 보여주는 것이 사용자 만족에 중요하다.
- 세법 용어는 유지하되 해석은 최대한 쉬운 한국어로 쓴다.
- 결과는 항상 “예상 세액”, “참고용”으로 표현한다.
