# 월배당 ETF 실수익 완전 비교 2026 설계 문서

> 기획 원문: `docs/plan/202605/monthly-dividend-etf-2026.md`  
> 작성일: 2026-05-20  
> 콘텐츠 유형: `/reports/` 리포트  
> 구현 기준: 국내 상장 월배당 ETF 10종을 세후 월 수령액 중심으로 비교하고, 배당주 월급 계산기로 연결한다.

---

## 1. 문서 개요

- 구현 대상: `월배당 ETF 실수익 완전 비교 2026`
- slug: `monthly-dividend-etf-2026`
- URL: `/reports/monthly-dividend-etf-2026/`
- 카테고리: 주식/코인
- 핵심 검색 의도: `월배당 ETF 수익률 비교 2026`, `월배당 ETF 추천`, `세후 월배당 계산`, `미국배당 ETF`, `커버드콜 ETF`
- 핵심 출력: ETF별 분배율, 세후 월 수령액, 총보수, 기초지수, 최근 1년·3년 수익률, 분배금 감소 시나리오
- 안전 장치: 특정 ETF 매수 추천처럼 보이지 않게 `투자 성향별 예시`, `추정`, `기준일` 표현을 반복한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    monthlyDividendEtf2026.ts
  pages/
    reports/
      monthly-dividend-etf-2026.astro

public/
  scripts/
    monthly-dividend-etf-2026.js

src/styles/scss/pages/
  _monthly-dividend-etf-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/monthly-dividend-etf-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 주식/코인 토픽 또는 신규 리포트 노출
- `src/pages/reports/index.astro` 주식/코인 리포트 강조
- `public/og/reports/monthly-dividend-etf-2026.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- 리포트 페이지 패턴을 따른다.
- SCSS prefix: `mde-`
- pageClass: `mde-page`
- 최상단은 요약 KPI와 비교표 진입 CTA를 배치한다.
- 핵심 표는 데스크톱에서는 표, 모바일에서는 카드형 또는 가로 스크롤로 제공한다.
- 수치가 많으므로 한 화면에 모든 정보를 밀어 넣지 말고 `요약 → 비교표 → 해설 → 시뮬레이션 → FAQ` 순서로 읽히게 한다.

권장 메인 구조:

```astro
<BaseLayout
  title="월배당 ETF 실수익 완전 비교 2026"
  description="2026년 국내 상장 월배당 ETF의 분배율, 세후 실수령액, 운용보수, 기초지수, 최근 수익률을 비교합니다."
  ogImage="/og/reports/monthly-dividend-etf-2026.png"
>
  <main class="container page-shell report-page mde-page" data-report="monthly-dividend-etf-2026">
    ...
  </main>
</BaseLayout>
```

---

## 4. 페이지 IA

1. Hero
2. 데이터 기준일·투자 유의 안내
3. 상단 요약 KPI
4. 투자금 입력형 세후 월 수령액 미니 계산기
5. ETF 10종 핵심 비교표
6. 분배율·세후 수령액 비교
7. 운용보수·괴리율·추적오차 분석
8. 커버드콜 ETF 구조 설명
9. 분배금 감소 리스크 시나리오
10. 국내 상장 ETF vs 미국 직접 상장 ETF 세금 차이
11. 배당 재투자 10년 시뮬레이션
12. 증권사 수수료·이벤트 비교
13. 투자 성향별 포트폴리오 예시
14. 투자자 케이스 스터디
15. 분배금 지급 캘린더
16. 배당주 월급 계산기 CTA
17. 2026 하반기 전망 및 액션 플랜
18. FAQ

---

## 5. 데이터 모델

파일: `src/data/monthlyDividendEtf2026.ts`

```ts
export type EtfCategory =
  | 'dividend-growth'
  | 'covered-call'
  | 'bond-income'
  | 'reit-income'
  | 'mixed';

export type ListingMarket = 'KR' | 'US';

export type DistributionFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'other';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface MonthlyDividendEtf {
  id: string;
  name: string;
  ticker: string;
  manager: string;
  category: EtfCategory;
  listingMarket: ListingMarket;
  underlyingIndex: string;
  distributionFrequency: DistributionFrequency;
  annualDistributionRate: number;
  totalExpenseRatio: number;
  trackingDifference: number | null;
  premiumDiscountRate: number | null;
  oneYearReturn: number | null;
  threeYearReturn: number | null;
  latestDistributionPerShare: number | null;
  latestPrice: number | null;
  distributionBaseDate: string;
  dataSourceLabel: string;
  officialUrl?: string;
  riskLevel: RiskLevel;
  riskBadges: string[];
  summary: string;
}

export interface IncomeComparisonResult {
  etfId: string;
  investmentAmount: number;
  annualGrossDistribution: number;
  annualTax: number;
  annualNetDistribution: number;
  monthlyGrossDistribution: number;
  monthlyNetDistribution: number;
  down20MonthlyNetDistribution: number;
  down40MonthlyNetDistribution: number;
}

export interface EtfPortfolioExample {
  id: string;
  label: string;
  investorType: string;
  allocation: Array<{
    category: EtfCategory;
    weight: number;
    note: string;
  }>;
  description: string;
  cautions: string[];
}

export interface DistributionCalendarItem {
  etfId: string;
  expectedExDateLabel: string;
  expectedPayDateLabel: string;
  note: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 데이터 구성

### 6-1. ETF 후보 데이터

구현 시 실제 최신 데이터로 교체한다. 설계 단계에서는 데이터 구조만 고정한다.

```ts
export const MONTHLY_DIVIDEND_ETF_DATA_UPDATED_AT = '2026-05-20';

export const monthlyDividendEtfs: MonthlyDividendEtf[] = [
  {
    id: 'tiger-us-dividend-dowjones',
    name: 'TIGER 미국배당다우존스',
    ticker: '458730',
    manager: '미래에셋자산운용',
    category: 'dividend-growth',
    listingMarket: 'KR',
    underlyingIndex: 'Dow Jones U.S. Dividend 100',
    distributionFrequency: 'monthly',
    annualDistributionRate: 0,
    totalExpenseRatio: 0,
    trackingDifference: null,
    premiumDiscountRate: null,
    oneYearReturn: null,
    threeYearReturn: null,
    latestDistributionPerShare: null,
    latestPrice: null,
    distributionBaseDate: '업데이트 필요',
    dataSourceLabel: '운용사 및 거래소 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['배당성장형', '환율 영향'],
    summary: '미국 배당성장주에 분산 투자하는 국내 상장 월배당 ETF 후보입니다.',
  },
];
```

필수 후보군:

| id 후보 | 상품군 | 구현 메모 |
| --- | --- | --- |
| `tiger-us-dividend-dowjones` | 미국 배당성장형 | TIGER 미국배당다우존스 |
| `ace-us-dividend-dowjones` | 미국 배당성장형 | ACE 미국배당다우존스 |
| `sol-us-dividend-dowjones` | 미국 배당성장형 | SOL 미국배당다우존스 |
| `kodex-us-dividend-premium` | 커버드콜형 | KODEX 미국배당프리미엄 계열 |
| `tiger-us-dividend-premium` | 커버드콜형 | 프리미엄/커버드콜 구조 |
| `monthly-bond-income-1` | 채권형 | 실제 상품 확인 후 교체 |
| `monthly-bond-income-2` | 채권형 | 실제 상품 확인 후 교체 |
| `reit-income-1` | 리츠/인프라형 | 실제 상품 확인 후 교체 |
| `mixed-income-1` | 혼합형 | 실제 상품 확인 후 교체 |
| `covered-call-income-2` | 커버드콜형 | 실제 상품 확인 후 교체 |

### 6-2. 기준 투자금

```ts
export const DEFAULT_INVESTMENT_AMOUNT = 10_000_000;
export const DEFAULT_DIVIDEND_TAX_RATE = 15.4;
```

---

## 7. 계산 로직

### 7-1. 세후 월 분배금

```text
세전 연 분배금 = 투자금 × 연 분배율
연간 세금 = 세전 연 분배금 × 세율
세후 연 분배금 = 세전 연 분배금 - 연간 세금
세전 월 분배금 = 세전 연 분배금 ÷ 12
세후 월 분배금 = 세후 연 분배금 ÷ 12
```

`annualDistributionRate`는 퍼센트 입력값이면 계산 전 `÷ 100` 처리한다.

### 7-2. 분배금 감소 시나리오

```text
20% 감소 세후 월 분배금 = 기준 세후 월 분배금 × 0.8
40% 감소 세후 월 분배금 = 기준 세후 월 분배금 × 0.6
```

### 7-3. 보수 차감 분배율

분배율과 총수익률을 혼동하지 않도록 보조 지표로만 사용한다.

```text
보수 차감 단순 분배율 = 연 분배율 - 총보수
```

### 7-4. 10년 재투자 시뮬레이션

```text
월 분배율 = 연 분배율 ÷ 12
월 가격 성장률 = 연 가격 성장률 ÷ 12
매월 세후 분배금 = 평가액 × 월 분배율 × (1 - 세율)
다음 달 평가액 = 평가액 × (1 + 월 가격 성장률) + 월 추가 투자금 + 매월 세후 분배금
```

리포트에서는 상품별 상세 계산기보다 요약 시뮬레이션으로 제공한다. 상세 계산은 `/tools/dividend-monthly-income/` CTA로 넘긴다.

---

## 8. 인터랙션 설계

파일: `public/scripts/monthly-dividend-etf-2026.js`

### 기능

- 투자금 입력 시 ETF별 세전·세후 월 수령액 갱신
- 세율 입력 시 세후 수령액 갱신
- 분배금 감소 시나리오 카드 갱신
- ETF 카테고리 필터
  - 전체
  - 배당성장형
  - 커버드콜형
  - 채권형
  - 리츠/인컴형
- 모바일에서 비교표 행 확장/접기
- CTA 버튼에 현재 투자금·세율 쿼리 파라미터 연결 가능

### 권장 DOM 구조

```html
<section class="mde-calculator" data-mde-calculator>
  <input data-mde-input="investmentAmount" />
  <input data-mde-input="taxRate" />
  <output data-mde-output="bestMonthlyIncome"></output>
</section>

<table class="mde-etf-table" data-mde-table>
  <tbody>
    <tr data-mde-etf-row data-category="dividend-growth">
      <td data-mde-value="monthlyNetDistribution"></td>
    </tr>
  </tbody>
</table>
```

---

## 9. 화면 컴포넌트 설계

### 9-1. Hero

```text
월배당 ETF 실수익 완전 비교 2026
분배율, 세후 수령액, 보수, 기초지수, 수익률을 한 번에 비교해 월 현금흐름에 맞는 ETF를 찾으세요.
```

Hero 하단에는 다음 배지를 배치한다.

- `2026 기준`
- `세후 월 수령액 비교`
- `분배금 감소 시나리오`
- `추정`

### 9-2. 데이터 기준 안내

`InfoNotice` 또는 별도 notice 섹션 사용.

```text
분배율과 수익률은 기준일에 따라 달라질 수 있습니다. 이 리포트의 계산값은 입력한 투자금과 세율을 적용한 단순 추정이며, 특정 ETF의 수익을 보장하지 않습니다.
```

### 9-3. 상단 KPI

| 카드 | 내용 |
| --- | --- |
| 비교 대상 | 국내 상장 월배당 ETF 10종 |
| 기준 투자금 | 기본 1,000만 원 |
| 기본 세율 | 15.4% |
| 핵심 기준 | 세후 월 수령액 |

### 9-4. 비교표

필수 컬럼:

| 컬럼 | 설명 |
| --- | --- |
| ETF명 | 이름, 종목코드 |
| 유형 | 배당성장형, 커버드콜형 등 |
| 기초지수 | 추종 지수 |
| 분배율 | 최근 12개월 또는 공시 기준 |
| 세후 월 수령액 | 투자금 입력 반영 |
| 총보수 | 운용보수 |
| 1년 수익률 | 기준일 표기 |
| 3년 수익률 | 없으면 `상장 3년 미만` |
| 리스크 | 배지 |

### 9-5. 커버드콜 설명 박스

- 옵션 프리미엄을 분배 재원으로 쓸 수 있음
- 상승장에서는 수익 일부가 제한될 수 있음
- 분배율이 높아도 총수익률이 낮을 수 있음

### 9-6. 포트폴리오 카드

카드 4개:

- 안정형
- 균형형
- 고분배형
- 은퇴 현금흐름형

각 카드는 `구성 방향`, `장점`, `주의점`만 짧게 제공한다.

---

## 10. 콘텐츠 섹션 구현 상세

### 10-1. 월배당 ETF 개요

월배당 ETF는 매월 분배금을 지급하는 구조의 ETF다. 월급처럼 매달 현금흐름을 만들 수 있다는 장점이 있지만, 분배금은 고정 수익이 아니며 ETF 가격도 변동한다.

### 10-2. 상품별 분배율 비교

표 상단에 `투자금`과 `세율` 입력을 배치해 사용자가 직접 1,000만 원, 5,000만 원, 1억 원 기준으로 바꿔볼 수 있게 한다.

### 10-3. 보수·괴리율 분석

보수는 장기 수익률에 영향을 준다. 단, 보수만 낮다고 무조건 유리한 것은 아니므로 거래량, 괴리율, 추적오차를 함께 안내한다.

### 10-4. 분배금 감소 리스크

분배금이 20%, 40% 줄어드는 경우를 카드로 보여준다. 은퇴 현금흐름 목적 사용자가 과도한 분배율에 의존하지 않도록 하는 핵심 섹션이다.

### 10-5. 세금 차이

국내 상장 ETF와 미국 직접 상장 ETF의 세금 구조를 설명하되, 개인별 과세는 다를 수 있으므로 세무 상담 고지를 포함한다.

### 10-6. 지급 캘린더

상품별 지급일은 실제 공시에 따라 달라질 수 있으므로 `예상 지급 패턴`으로 표현한다.

---

## 11. SEO 메타

```ts
const seo = {
  title: '월배당 ETF 수익률 비교 2026 - 세후 월배당·보수·분배율 완전 정리',
  description:
    '2026년 국내 상장 월배당 ETF의 분배율, 세후 실수령액, 운용보수, 기초지수, 최근 수익률을 비교합니다. TIGER·ACE·KODEX·SOL 미국배당 ETF와 커버드콜 ETF의 장단점, 세금 차이, 배당 재투자 시뮬레이션까지 확인하세요.',
  canonical: '/reports/monthly-dividend-etf-2026/',
};
```

구조화 데이터:

- `Article`
- `FAQPage`
- `BreadcrumbList`

---

## 12. FAQ

필수 FAQ:

- 월배당 ETF는 매달 확정된 금액을 주나요?
- 분배율이 높은 ETF가 가장 좋은 ETF인가요?
- 국내 상장 월배당 ETF와 미국 ETF 직접 투자는 무엇이 다른가요?
- 커버드콜 ETF는 왜 분배율이 높나요?
- 월배당 ETF로 은퇴 생활비를 만들 수 있나요?

FAQ 답변에는 `보장`, `확정`, `추천`처럼 오해 소지가 있는 표현을 피한다.

---

## 13. 내부 링크 및 CTA

| 위치 | CTA | 링크 |
| --- | --- | --- |
| Hero 하단 | 내 투자금으로 월배당 계산하기 | `/tools/dividend-monthly-income/` |
| 비교표 하단 | 월 50만 원 배당에 필요한 원금 계산 | `/tools/dividend-monthly-income/` |
| 세금 섹션 | 미국 주식 환차익 계산하기 | `/tools/us-stock-exchange-profit-calculator/` |
| 하단 | 주식 손익분기점 계산하기 | `/tools/stock-breakeven-calculator/` |

CTA URL은 추후 다음처럼 쿼리 연결 가능:

```text
/tools/dividend-monthly-income/?principal=10000000&yield=5&tax=15.4
```

---

## 14. 스타일 설계

파일: `src/styles/scss/pages/_monthly-dividend-etf-2026.scss`

주요 클래스:

```scss
.mde-page {}
.mde-hero {}
.mde-notice {}
.mde-summary-grid {}
.mde-calculator {}
.mde-table-wrap {}
.mde-etf-table {}
.mde-risk-badge {}
.mde-scenario-grid {}
.mde-portfolio-grid {}
.mde-calendar {}
.mde-cta-band {}
.mde-faq {}
```

디자인 기준:

- 숫자 비교가 핵심이므로 과한 장식보다 표 가독성 우선
- 색상은 주식/코인 계열 기존 페이지 톤을 따르되 단일 녹색 팔레트로 치우치지 않게 보조색 사용
- KPI 카드 숫자는 크고 명확하게, 설명 문구는 짧게
- 모바일 표는 `min-width` 기반 가로 스크롤 또는 카드 변환
- 고위험 배지는 빨간색을 과도하게 쓰지 않고 주의 톤으로 제한

---

## 15. 접근성 및 모바일

- 비교표에는 `<caption>` 또는 시각적으로 숨긴 설명 제공
- 입력 필드는 `label`과 연결
- 계산 결과 output에는 `aria-live="polite"`
- 모바일에서 표 셀 텍스트가 버튼이나 CTA와 겹치지 않게 최소 폭 지정
- 위험 배지는 색만으로 구분하지 않고 텍스트 라벨 병기
- CTA 버튼은 44px 이상 터치 영역 확보

---

## 16. 데이터 업데이트 체크리스트

구현 직전 최신 데이터를 확인한다.

- [ ] ETF명과 종목코드 확인
- [ ] 상장 유지 여부 확인
- [ ] 최근 12개월 분배금 확인
- [ ] 분배율 산정 기준 통일
- [ ] 총보수와 기타 비용 확인
- [ ] 기초지수 확인
- [ ] 최근 1년·3년 수익률 확인
- [ ] 괴리율·추적오차 확인
- [ ] 분배금 지급일과 분배락일 확인
- [ ] 미국 직접 상장 ETF 비교군 세금 설명 최신화
- [ ] 증권사 수수료·이벤트 기준일 표시

---

## 17. 테스트 체크리스트

- [ ] 투자금 변경 시 모든 세후 월 수령액이 갱신되는지 확인
- [ ] 세율 변경 시 세후 수령액과 세금 금액이 갱신되는지 확인
- [ ] 20%·40% 분배금 감소 시나리오가 기준값 대비 맞는지 확인
- [ ] ETF 카테고리 필터가 정상 동작하는지 확인
- [ ] 상장 3년 미만 상품의 3년 수익률이 빈 숫자가 아니라 안내 문구로 표시되는지 확인
- [ ] 분배율, 수익률, 보수에 기준일이 표시되는지 확인
- [ ] 특정 ETF를 매수 추천하는 표현이 없는지 확인
- [ ] 모바일에서 비교표가 깨지지 않는지 확인
- [ ] FAQ 구조화 데이터가 유효한지 확인
- [ ] `npm run build` 성공 확인
