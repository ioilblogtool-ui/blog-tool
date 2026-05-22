# 아파트 보유세 계산기 설계 문서

> 기획 원문: `docs/plan/202605/apartment-holding-tax.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 공시가격 기반으로 재산세·지방교육세·종합부동산세·농어촌특별세를 합산하고, 1세대 1주택 공제 및 종부세 진입 공시가격을 함께 제공한다.

---

## 1. 문서 개요

- 구현 대상: `아파트 보유세 계산기`
- slug: `apartment-holding-tax`
- URL: `/tools/apartment-holding-tax/`
- 카테고리: 부동산
- 핵심 검색 의도: `아파트 보유세 계산기`, `재산세 종부세 계산`, `종합부동산세 계산기`, `공시가격 보유세`, `종부세 대상 공시가격`
- 핵심 출력: 연간 보유세 총액, 재산세, 지방교육세, 종부세, 농어촌특별세, 1주택 공제 절감액, 종부세 진입 공시가격
- 안전 장치: 모든 계산 결과는 `추정`으로 표시하고, 실제 고지세액은 지분·주택 수·특례·감면·세부담 상한에 따라 달라질 수 있음을 안내한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    apartmentHoldingTax.ts
  pages/
    tools/
      apartment-holding-tax.astro

public/
  scripts/
    apartment-holding-tax.js

src/styles/scss/pages/
  _apartment-holding-tax.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/apartment-holding-tax';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 부동산 토픽 노출
- `src/pages/tools/index.astro` 부동산 계산기 목록 노출
- `public/og/tools/apartment-holding-tax.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `aht-`
- pageClass: `aht-page`
- 세금 항목이 많으므로 `요약 → 항목별 분해 → 공제 비교 → 시나리오` 순서로 읽히게 한다.
- 입력 영역은 `공시가격/주택 조건`, `세율·공정시장가액비율`, `공제·역산` 3개 그룹으로 나눈다.
- 결과 영역은 사용자가 바로 이해하도록 `연간 보유세 총액`을 첫 번째 KPI로 둔다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="apartment-holding-tax"
  pageClass="aht-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 세금 추정·기준연도 안내 `InfoNotice`
3. 프리셋 선택
4. 기본 입력 폼
5. 세부 기준 입력 접힘 영역
6. 핵심 결과 KPI
7. 재산세·종부세 항목별 분해
8. 1세대 1주택 고령자·장기보유 공제 비교
9. 종부세 진입 공시가격 역산
10. 공시가격 상승률 시나리오
11. 세금 구성 설명
12. 관련 부동산 계산기 CTA
13. SEO 본문 및 FAQ

---

## 5. 데이터 모델

파일: `src/data/apartmentHoldingTax.ts`

```ts
export type HomeCountType = 'one' | 'two' | 'threePlus';
export type OwnershipType = 'single' | 'spouseJoint' | 'jointOther';
export type RegionType = 'general' | 'regulated';
export type TaxResultTone = 'safe' | 'neutral' | 'caution' | 'danger';

export interface ApartmentHoldingTaxInput {
  taxYear: number;
  officialPrice: number;
  homeCountType: HomeCountType;
  isOneHouseholdOneHome: boolean;
  ownershipType: OwnershipType;
  ownershipShareRate: number;
  regionType: RegionType;
  holdingYears: number;
  age: number;

  propertyTaxFairMarketRatio: number | null;
  comprehensiveTaxFairMarketRatio: number | null;
  comprehensiveTaxDeductionOverride: number | null;

  applyTaxBurdenCap: boolean;
  previousYearHoldingTax: number | null;
  targetHoldingTax: number | null;
  officialPriceChangeRate: number;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
  label: string;
}

export interface TaxCreditRate {
  minValue: number;
  maxValue: number | null;
  rate: number;
  label: string;
}

export interface HoldingTaxYearConfig {
  year: number;
  propertyTaxFairMarketRatio: number;
  propertyTaxOneHomeSpecialRatios: Array<{
    maxOfficialPrice: number;
    ratio: number;
    label: string;
  }>;
  comprehensiveTaxFairMarketRatio: number;
  comprehensiveTaxDeductionGeneral: number;
  comprehensiveTaxDeductionOneHome: number;
  localEducationTaxRate: number;
  ruralSpecialTaxRate: number;
  propertyTaxBrackets: TaxBracket[];
  comprehensiveTaxBracketsGeneral: TaxBracket[];
  comprehensiveTaxBracketsMultiHome: TaxBracket[];
  seniorCreditRates: TaxCreditRate[];
  longHoldingCreditRates: TaxCreditRate[];
  oneHomeCreditLimitRate: number;
  taxBurdenCapRates: Array<{
    condition: string;
    capRate: number;
  }>;
  sourceLabel: string;
  sourceUpdatedAt: string;
  notes: string[];
}

export interface HoldingTaxBreakdown {
  taxableBasePropertyTax: number;
  propertyTax: number;
  localEducationTax: number;
  comprehensiveTaxBase: number;
  comprehensiveTaxBeforeCredit: number;
  seniorCreditAmount: number;
  longHoldingCreditAmount: number;
  totalCreditAmount: number;
  comprehensiveTaxAfterCredit: number;
  ruralSpecialTax: number;
  totalHoldingTax: number;
}

export interface OfficialPriceScenario {
  label: string;
  changeRate: number;
  officialPrice: number;
  totalHoldingTax: number;
  comprehensiveTaxAfterCredit: number;
}

export interface ApartmentHoldingTaxResult {
  breakdown: HoldingTaxBreakdown;
  beforeCreditBreakdown: HoldingTaxBreakdown;
  creditSavingAmount: number;
  isComprehensiveTaxTarget: boolean;
  comprehensiveTaxEntryPrice: number;
  targetTaxOfficialPrice: number | null;
  scenarios: OfficialPriceScenario[];
  effectiveTaxRate: number;
  tone: TaxResultTone;
  badges: string[];
  interpretation: string;
  warnings: string[];
}

export interface ApartmentHoldingTaxPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<ApartmentHoldingTaxInput>;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 연도별 기준 데이터

세법·공정시장가액비율은 바뀔 수 있으므로 계산 기준은 데이터 배열로 분리한다.

```ts
export const HOLDING_TAX_YEAR_CONFIGS: HoldingTaxYearConfig[] = [
  {
    year: 2026,
    propertyTaxFairMarketRatio: 60,
    propertyTaxOneHomeSpecialRatios: [
      {
        maxOfficialPrice: 300_000_000,
        ratio: 43,
        label: '1세대 1주택 저가 구간 특례',
      },
      {
        maxOfficialPrice: 600_000_000,
        ratio: 44,
        label: '1세대 1주택 중간 구간 특례',
      },
      {
        maxOfficialPrice: 900_000_000,
        ratio: 45,
        label: '1세대 1주택 9억 이하 특례',
      },
    ],
    comprehensiveTaxFairMarketRatio: 60,
    comprehensiveTaxDeductionGeneral: 900_000_000,
    comprehensiveTaxDeductionOneHome: 1_200_000_000,
    localEducationTaxRate: 20,
    ruralSpecialTaxRate: 20,
    propertyTaxBrackets: [],
    comprehensiveTaxBracketsGeneral: [],
    comprehensiveTaxBracketsMultiHome: [],
    seniorCreditRates: [],
    longHoldingCreditRates: [],
    oneHomeCreditLimitRate: 80,
    taxBurdenCapRates: [],
    sourceLabel: '국세청·위택스·지방세 관계 법령 확인 필요',
    sourceUpdatedAt: '2026-05-21',
    notes: [
      '구현 전 해당 연도 공식 세율표와 공정시장가액비율을 반드시 확인합니다.',
      '1세대 1주택 특례와 공동명의 특례는 실제 요건에 따라 달라질 수 있습니다.',
    ],
  },
];
```

주의:
- 위 데이터는 구조 예시다.
- 실제 구현 전 `propertyTaxBrackets`, `comprehensiveTaxBracketsGeneral`, `comprehensiveTaxBracketsMultiHome`, 공제율 배열을 최신 공식 기준으로 채워야 한다.
- 공식 기준을 확인하지 못한 값은 UI에서 `확인 필요`로 표시하거나 계산에서 제외한다.

---

## 7. 계산 로직

### 7-1. 보유 지분 반영 공시가격

```text
본인 지분 공시가격 = 공시가격 × 지분율
```

단독명의 기본 지분율은 100%다. 공동명의는 실제 종부세 선택 방식에 따라 결과가 달라질 수 있으므로 단순 지분 계산임을 안내한다.

### 7-2. 재산세 공정시장가액비율

```text
재산세 적용 비율 =
  사용자가 직접 입력한 비율
  또는 1세대 1주택 특례비율
  또는 일반 재산세 공정시장가액비율
```

1세대 1주택 특례는 공시가격 구간별로 자동 선택한다.

### 7-3. 재산세 과세표준

```text
재산세 과세표준 = 본인 지분 공시가격 × 재산세 적용 비율
```

### 7-4. 구간별 세액 계산 공통 함수

```text
세액 = 과세표준 × 해당 구간 세율 - 누진공제
```

공통 함수:

```ts
function calculateProgressiveTax(base: number, brackets: TaxBracket[]): number
```

처리:
- base <= 0이면 0 반환
- `min <= base <= max` 또는 `max === null`인 구간 선택
- 계산 결과가 음수면 0 처리

### 7-5. 지방교육세

```text
지방교육세 = 재산세 × 지방교육세율
```

### 7-6. 종부세 공제금액

```text
종부세 공제금액 =
  override 값이 있으면 override
  아니면 1세대 1주택이면 1세대 1주택 공제금액
  아니면 일반 공제금액
```

### 7-7. 종부세 과세표준

```text
종부세 과세표준 =
  max(본인 지분 공시가격 - 종부세 공제금액, 0)
  × 종부세 공정시장가액비율
```

### 7-8. 종부세 산출세액

```text
종부세 산출세액 = 종부세 과세표준 × 종부세 세율 - 누진공제
```

세율표:
- 1세대 1주택 또는 일반: `comprehensiveTaxBracketsGeneral`
- 다주택·조정대상지역 중과 적용 연도라면 `comprehensiveTaxBracketsMultiHome`

정책 변경 가능성이 크므로 중과 여부는 연도별 config와 UI 안내로 처리한다.

### 7-9. 고령자·장기보유 세액공제

```text
고령자 공제율 = 나이 구간별 공제율
장기보유 공제율 = 보유기간 구간별 공제율
합산 공제율 = min(고령자 공제율 + 장기보유 공제율, 합산 한도)
세액공제 = 종부세 산출세액 × 합산 공제율
공제 후 종부세 = max(종부세 산출세액 - 세액공제, 0)
```

적용 조건:
- 1세대 1주택인 경우만 기본 적용
- 공동명의·특례 선택은 단순 추정으로 표시

### 7-10. 농어촌특별세

```text
농어촌특별세 = 공제 후 종부세 × 농어촌특별세율
```

### 7-11. 총 보유세

```text
총 보유세 =
  재산세
  + 지방교육세
  + 공제 후 종부세
  + 농어촌특별세
```

### 7-12. 종부세 진입 공시가격

```text
종부세 진입 공시가격 = 종부세 공제금액 ÷ 지분율
```

결과에는 `단순 역산` 배지를 붙인다. 공정시장가액비율을 곱하기 전 공제금액 초과 여부를 보는 진입 기준이다.

### 7-13. 목표 보유세 역산

정확한 폐쇄형 공식이 복잡하므로 이분 탐색을 사용한다.

```text
low = 0
high = 10,000,000,000
반복 60회:
  mid = (low + high) / 2
  midTax = calculateHoldingTax(mid)
  midTax < 목표 보유세이면 low = mid
  아니면 high = mid
```

결과는 10만 원 단위로 반올림한다.

---

## 8. 입력 UI 설계

### 기본 조건

| 필드 | UI | 제약 |
| --- | --- | --- |
| 과세연도 | select | 지원 config 연도 |
| 공시가격 | number input | 0원 이상 |
| 주택 수 | segmented control | 1주택·2주택·3주택 이상 |
| 1세대 1주택 여부 | toggle | 주택 수 1일 때 기본 켜짐 |
| 공동명의 여부 | select | 단독·부부 공동·기타 |
| 지분율 | number input | 1~100% |
| 지역 | select | 일반·조정대상 |
| 보유기간 | number input | 0년 이상 |
| 만 나이 | number input | 0세 이상 |

### 세부 기준

기본은 접힘 상태로 둔다.

| 필드 | UI | 기본 |
| --- | --- | --- |
| 재산세 공정시장가액비율 | percent input | 자동 |
| 종부세 공정시장가액비율 | percent input | 자동 |
| 종부세 공제금액 직접 입력 | number input | 자동 |
| 전년도 보유세 | number input | 선택 |
| 세부담 상한 적용 | toggle | 켜짐 |

### 역산

| 필드 | UI | 설명 |
| --- | --- | --- |
| 목표 보유세 | number input | 보유세가 해당 금액이 되는 공시가격 추정 |
| 공시가격 상승률 | slider | 시나리오 표 생성 |

---

## 9. 결과 UI 설계

### KPI 카드

| 카드 | 값 |
| --- | --- |
| 연간 보유세 총액 | 총 보유세 |
| 재산세 영역 | 재산세 + 지방교육세 |
| 종부세 영역 | 종부세 + 농어촌특별세 |
| 공제 절감액 | 공제 전후 차이 |
| 종부세 진입 공시가격 | 단순 역산값 |

### 항목별 분해 표

| 항목 | 금액 | 계산 기준 |
| --- | ---: | --- |
| 재산세 | 계산값 | 공시가격 × 공정시장가액비율 |
| 지방교육세 | 계산값 | 재산세 연동 |
| 종합부동산세 | 계산값 | 공제 후 과세표준 |
| 농어촌특별세 | 계산값 | 종부세 연동 |
| 합계 | 계산값 | 전체 합산 |

### 공제 비교 카드

- 공제 전 종부세
- 고령자 공제액
- 장기보유 공제액
- 합산 공제 한도 적용 여부
- 공제 후 종부세

### 시나리오 표

| 공시가격 변화 | 공시가격 | 총 보유세 | 종부세 | 변화액 |
| --- | ---: | ---: | ---: | ---: |
| -10% | 계산값 | 계산값 | 계산값 | 계산값 |
| 현재 | 계산값 | 계산값 | 계산값 | 0 |
| +5% | 계산값 | 계산값 | 계산값 | 계산값 |
| +10% | 계산값 | 계산값 | 계산값 | 계산값 |
| +20% | 계산값 | 계산값 | 계산값 | 계산값 |
| +30% | 계산값 | 계산값 | 계산값 | 계산값 |

---

## 10. 상태 및 경고 처리

| 조건 | 처리 |
| --- | --- |
| 공시가격 0원 | 계산 불가, 공시가격 입력 안내 |
| 지분율 0% | 계산 불가 |
| 세율표가 비어 있음 | 해당 항목 `기준 확인 필요` 표시 |
| 종부세 비대상 | 종부세와 농어촌특별세 0원 |
| 1세대 1주택인데 주택 수가 2 이상 | 1세대 1주택 toggle 자동 해제 또는 경고 |
| 공동명의 선택 | 단순 지분 계산 안내 |
| 조정대상지역 선택 | 해당 연도 중과 여부 확인 안내 |
| 세부담 상한 적용인데 전년도 보유세 없음 | 상한 미적용 안내 |
| 목표 보유세가 너무 낮음 | 역산 불가 또는 0원 표시 |

---

## 11. 스크립트 구현

파일: `public/scripts/apartment-holding-tax.js`

### 주요 함수

```js
function parseNumber(value)
function formatWon(value)
function formatPercent(value)
function getYearConfig(year)
function getBracketTax(base, brackets)
function getCreditRate(value, rates)
function calculatePropertyTax(input, config)
function calculateComprehensiveTax(input, config)
function calculateHoldingTax(input)
function calculateEntryOfficialPrice(input, config)
function findOfficialPriceForTargetTax(input, targetTax)
function buildOfficialPriceScenarios(input)
function renderResult(result)
```

### 이벤트

- input/change 이벤트마다 계산 갱신
- 프리셋 버튼 클릭 시 입력값 세팅
- 세부 기준 접힘 영역 열기/닫기
- 주택 수 변경 시 1세대 1주택 여부 자동 보정
- 공동명의 선택 시 지분율 필드 강조

---

## 12. 접근성 및 모바일

- 모든 입력에는 `label` 연결
- 결과 영역은 `aria-live="polite"`
- 금액 입력은 `inputmode="numeric"`
- 세부 기준 접힘 영역은 `<details>` 또는 접근 가능한 버튼 패턴 사용
- 모바일에서는 항목별 분해 표를 카드형으로 전환
- KPI 금액은 줄바꿈 가능한 구조로 만들고 버튼과 겹치지 않게 한다.
- 세금 안내 문구는 작게만 두지 말고 결과 가까이에 반복한다.

---

## 13. 콘텐츠 및 SEO

### Hero

```text
아파트 보유세 계산기
공시가격을 입력하면 재산세와 종부세를 합산해 연간 보유세를 추정합니다.
```

### SEO 메타

```ts
const seo = {
  title: '아파트 보유세 계산기 - 재산세·종부세 연간 세금 추정',
  description:
    '공시가격, 주택 수, 보유기간, 연령을 입력해 아파트 재산세와 종합부동산세, 지방교육세, 농어촌특별세를 합산 계산하세요. 1주택 고령자·장기보유 공제와 종부세 대상 공시가격도 확인할 수 있습니다.',
  canonical: '/tools/apartment-holding-tax/',
};
```

구조화 데이터:

- `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

---

## 14. 내부 링크 및 CTA

| 위치 | CTA | 링크 |
| --- | --- | --- |
| 결과 하단 | 주택 매수 자금 계산하기 | `/tools/home-purchase-fund/` |
| 시나리오 하단 | 전월세 전환율 계산하기 | `/tools/jeonwolse-conversion/` |
| SEO 본문 하단 | 서울 아파트 가격 리포트 보기 | `/reports/seoul-apartment-price-2026/` |
| 관련 계산기 | 전세 vs 월세 계산하기 | `/tools/jeonse-vs-wolse-calculator/` |

---

## 15. 스타일 설계

파일: `src/styles/scss/pages/_apartment-holding-tax.scss`

주요 클래스:

```scss
.aht-page {}
.aht-hero {}
.aht-notice {}
.aht-preset-grid {}
.aht-form-grid {}
.aht-advanced {}
.aht-result-grid {}
.aht-tax-breakdown {}
.aht-credit-panel {}
.aht-entry-card {}
.aht-scenario-table {}
.aht-cta-band {}
.aht-faq {}
```

디자인 기준:

- 부동산·세금 도구이므로 차분하고 신뢰감 있는 톤
- 결과 KPI는 금액 위주로 명확하게
- 재산세와 종부세 영역을 색상 또는 라벨로 구분
- 경고색은 세금 폭증이나 기준 확인 필요에만 제한 사용
- 모바일에서는 입력 그룹 간 여백을 충분히 둔다.

---

## 16. 공식 데이터 업데이트 체크리스트

구현 직전 최신 공식 기준을 확인한다.

- [ ] 해당 연도 재산세 세율표
- [ ] 재산세 주택 공정시장가액비율
- [ ] 1세대 1주택 재산세 특례 공정시장가액비율
- [ ] 종부세 기본공제
- [ ] 1세대 1주택 종부세 공제
- [ ] 종부세 공정시장가액비율
- [ ] 종부세 주택분 세율표
- [ ] 다주택자·조정대상지역 중과 여부
- [ ] 고령자 세액공제율
- [ ] 장기보유 세액공제율
- [ ] 세액공제 합산 한도
- [ ] 지방교육세율
- [ ] 농어촌특별세율
- [ ] 세부담 상한 기준
- [ ] 공동명의 1주택 특례
- [ ] 일시적 2주택 특례

---

## 17. 테스트 체크리스트

- [ ] 공시가격 12억 원 1세대 1주택에서 종부세 경계값이 자연스럽게 표시되는지 확인
- [ ] 공시가격이 공제금액 이하일 때 종부세가 0원인지 확인
- [ ] 1세대 1주택과 일반 보유자의 공제금액 차이가 반영되는지 확인
- [ ] 고령자 공제와 장기보유 공제가 합산 한도 내에서 적용되는지 확인
- [ ] 공동명의 지분율 50% 입력 시 지분 기준 공시가격으로 계산되는지 확인
- [ ] 다주택자 선택 시 1세대 1주택 세액공제가 제외되는지 확인
- [ ] 목표 보유세 역산이 반복 계산으로 수렴하는지 확인
- [ ] 공시가격 상승률 시나리오가 현재값 대비 변화액을 표시하는지 확인
- [ ] 세율표가 비어 있거나 기준 미확정일 때 계산 오류 대신 안내가 표시되는지 확인
- [ ] 모바일에서 KPI 카드와 세금 분해 표가 겹치지 않는지 확인
- [ ] 모든 결과에 `추정` 또는 동등한 안내가 표시되는지 확인
- [ ] `npm run build` 성공 확인
