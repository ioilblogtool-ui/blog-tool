# DCA 적립식 투자 계산기 — 설계 문서

> 기획 원본: `docs/plan/202604/dca-investment-calculator-plan.md`
> 작성일: 2026-04-02
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 파일 작성 가능한 수준

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/dca-investment-calculator-plan.md`
- 구현 대상: `10년 적립식 투자 계산기`
- 참고 페이지: `samsung-bonus`, `bonus-simulator`, `salary-tier`, `home-purchase-fund`

### 1-2. 전제
- 실시간 주가 API를 사용하지 않는다. **연간 수익률 정적 배열**을 `src/data/dcaInvestment.ts`에 내장한다.
- 배당 재투자는 연간 배당수익률을 12등분해 매월 가산하는 단순화 방식을 사용한다.
- 환율은 연도별 평균 원/달러 환율 정적 배열을 사용한다.
- 결과는 시뮬레이션 추정치이며, 과거 수익이 미래를 보장하지 않는다는 고지를 명시한다.
- 비교 자산은 최대 6개까지 동시 선택 가능하다.

### 1-3. 권장 슬러그 및 파일 구조
```
slug: dca-investment-calculator
URL: /tools/dca-investment-calculator/

src/data/dcaInvestment.ts          ← 자산 데이터, 수익률, 환율, FAQ
src/pages/tools/dca-investment-calculator.astro
public/scripts/dca-investment-calculator.js
src/styles/scss/pages/_dca-investment-calculator.scss
public/og/tools/dca-investment-calculator.png  ← OG 이미지 (별도 생성)
```

### 1-4. 레이아웃 쉘
- `SimpleToolShell.astro` + `resultFirst={true}`
- aside(좌): 투자 조건 입력 패널
- main(우): 결과 KPI → 비교 차트 → 순위 테이블 → 계산 기준

---

## 2. 구현 범위 (MVP)

### 2-1. MVP 포함
- 지수 3종: S&P500, 나스닥100, 코스피
- 미국 개별 종목 7종: Apple, Microsoft, Nvidia, Amazon, Alphabet, Meta, Tesla
- 한국 개별 종목 5종: 삼성전자, SK하이닉스, 현대차, 기아, NAVER
- 데이터 범위: 2005~2024 (20년, 개별 종목 상장 이전은 제외)
- 투자기간: 3·5·7·10·15·20년 (시작 연도는 데이터 범위 내 자동 조정)
- 월 투자금 슬라이더 + 직접 입력 (10만~300만원)
- 환율 반영 토글 (미국 자산 원화 환산)
- 배당 재투자 토글
- 결과: KPI 4종 + 막대 차트 + 라인 차트 + 순위 테이블
- URL 파라미터 저장 (공유 가능)
- 다음 리포트 CTA + 외부 참고 링크 + 제휴 섹션

### 2-2. MVP 제외
- 실시간 주가 API
- 리밸런싱 시뮬레이션
- 수수료·세금 상세 계산
- LG에너지솔루션, 한화에어로스페이스 등 최근 상장 종목 (2022 이후)
- ISA/IRP 절세 계산기 (별도 파생 계산기로)

---

## 3. 데이터 파일 구조 (`src/data/dcaInvestment.ts`)

### 3-1. 타입 정의

```typescript
export type AssetCategory = 'INDEX_US' | 'INDEX_KR' | 'STOCK_US' | 'STOCK_KR';
export type Currency = 'USD' | 'KRW';

export interface DcaAsset {
  id: string;
  name: string;           // 표시명 (한국어)
  nameEn: string;         // 영문명 또는 티커
  category: AssetCategory;
  currency: Currency;
  availableFrom: number;  // 데이터 시작 연도 (2005~)
  yearlyReturns: Record<number, number>;   // { 2005: 0.049, 2006: 0.158, ... }
  dividendYields?: Record<number, number>; // { 2005: 0.018, ... } 배당 재투자용
  color: string;          // Chart.js 색상
}

export interface FxRates {
  [year: number]: number; // 원/달러 연평균 환율 { 2005: 1024, ... }
}
```

### 3-2. 환율 데이터 (연평균 원/달러)

```typescript
export const USD_KRW_RATES: FxRates = {
  2005: 1024, 2006: 955,  2007: 929,  2008: 1102,
  2009: 1276, 2010: 1156, 2011: 1108, 2012: 1126,
  2013: 1095, 2014: 1053, 2015: 1131, 2016: 1160,
  2017: 1130, 2018: 1100, 2019: 1166, 2020: 1180,
  2021: 1144, 2022: 1292, 2023: 1305, 2024: 1363,
};
```

### 3-3. 자산 데이터 — 지수

```typescript
// S&P500 연간 수익률 (배당 미포함, Price Return 기준)
{ id: 'SP500', name: 'S&P500', nameEn: 'S&P 500', category: 'INDEX_US', currency: 'USD',
  availableFrom: 2005, color: '#1D9E75',
  yearlyReturns: {
    2005: 0.049,  2006: 0.158,  2007: 0.055,  2008: -0.370,
    2009: 0.265,  2010: 0.151,  2011: 0.021,  2012: 0.160,
    2013: 0.324,  2014: 0.137,  2015: 0.014,  2016: 0.120,
    2017: 0.218,  2018: -0.044, 2019: 0.315,  2020: 0.184,
    2021: 0.287,  2022: -0.181, 2023: 0.263,  2024: 0.250,
  },
  dividendYields: {
    2005: 0.018, 2006: 0.017, 2007: 0.018, 2008: 0.030,
    2009: 0.022, 2010: 0.019, 2011: 0.021, 2012: 0.022,
    2013: 0.020, 2014: 0.019, 2015: 0.021, 2016: 0.021,
    2017: 0.019, 2018: 0.021, 2019: 0.019, 2020: 0.017,
    2021: 0.014, 2022: 0.016, 2023: 0.015, 2024: 0.013,
  },
}

// 나스닥100 (Price Return 기준)
{ id: 'NASDAQ100', name: '나스닥100', nameEn: 'Nasdaq 100', category: 'INDEX_US', currency: 'USD',
  availableFrom: 2005, color: '#534AB7',
  yearlyReturns: {
    2005: 0.020,  2006: 0.070,  2007: 0.190,  2008: -0.419,
    2009: 0.547,  2010: 0.200,  2011: 0.036,  2012: 0.181,
    2013: 0.366,  2014: 0.198,  2015: 0.097,  2016: 0.073,
    2017: 0.331,  2018: -0.010, 2019: 0.395,  2020: 0.486,
    2021: 0.273,  2022: -0.326, 2023: 0.551,  2024: 0.290,
  },
}

// 코스피 (Price Return 기준)
{ id: 'KOSPI', name: '코스피', nameEn: 'KOSPI', category: 'INDEX_KR', currency: 'KRW',
  availableFrom: 2005, color: '#E63B2E',
  yearlyReturns: {
    2005: 0.540,  2006: 0.040,  2007: 0.327,  2008: -0.407,
    2009: 0.497,  2010: 0.218,  2011: -0.110, 2012: 0.095,
    2013: 0.008,  2014: -0.045, 2015: 0.026,  2016: 0.038,
    2017: 0.217,  2018: -0.171, 2019: 0.078,  2020: 0.308,
    2021: 0.036,  2022: -0.245, 2023: 0.188,  2024: -0.098,
  },
}
```

### 3-4. 자산 데이터 — 미국 개별 종목

```typescript
// Apple (AAPL)
{ id: 'AAPL', name: 'Apple', nameEn: 'AAPL', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2005, color: '#1E293B',
  yearlyReturns: {
    2005: 1.234, 2006: 0.181, 2007: 1.332, 2008: -0.566,
    2009: 1.470, 2010: 0.534, 2011: 0.257, 2012: 0.326,
    2013: 0.081, 2014: 0.406, 2015: -0.030, 2016: 0.126,
    2017: 0.484, 2018: -0.065, 2019: 0.888, 2020: 0.822,
    2021: 0.345, 2022: -0.265, 2023: 0.490, 2024: 0.300,
  },
}

// Microsoft (MSFT)
{ id: 'MSFT', name: 'Microsoft', nameEn: 'MSFT', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2005, color: '#0078D4',
  yearlyReturns: {
    2005: -0.009, 2006: 0.155, 2007: 0.207, 2008: -0.440,
    2009: 0.607, 2010: -0.076, 2011: -0.077, 2012: 0.056,
    2013: 0.441, 2014: 0.275, 2015: 0.226, 2016: 0.148,
    2017: 0.403, 2018: 0.206, 2019: 0.579, 2020: 0.428,
    2021: 0.529, 2022: -0.284, 2023: 0.580, 2024: 0.160,
  },
}

// Nvidia (NVDA)
{ id: 'NVDA', name: 'Nvidia', nameEn: 'NVDA', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2005, color: '#76B900',
  yearlyReturns: {
    2005: 0.360, 2006: -0.057, 2007: 0.396, 2008: -0.741,
    2009: 2.064, 2010: 0.047, 2011: -0.190, 2012: 0.098,
    2013: 0.356, 2014: -0.245, 2015: 0.640, 2016: 2.279,
    2017: 0.813, 2018: -0.310, 2019: 0.767, 2020: 1.220,
    2021: 1.250, 2022: -0.503, 2023: 2.390, 2024: 1.710,
  },
}

// Amazon (AMZN)
{ id: 'AMZN', name: 'Amazon', nameEn: 'AMZN', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2005, color: '#FF9900',
  yearlyReturns: {
    2005: 0.064, 2006: -0.160, 2007: 1.344, 2008: -0.445,
    2009: 1.627, 2010: 0.341, 2011: -0.038, 2012: 0.445,
    2013: 0.590, 2014: -0.223, 2015: 1.179, 2016: 0.109,
    2017: 0.560, 2018: 0.286, 2019: 0.230, 2020: 0.762,
    2021: 0.024, 2022: -0.499, 2023: 0.810, 2024: 0.440,
  },
}

// Alphabet (GOOGL)
{ id: 'GOOGL', name: 'Alphabet', nameEn: 'GOOGL', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2005, color: '#4285F4',
  yearlyReturns: {
    2005: 1.152, 2006: 0.112, 2007: 0.498, 2008: -0.556,
    2009: 1.009, 2010: -0.039, 2011: 0.089, 2012: 0.094,
    2013: 0.581, 2014: -0.021, 2015: 0.464, 2016: 0.019,
    2017: 0.330, 2018: -0.005, 2019: 0.285, 2020: 0.308,
    2021: 0.652, 2022: -0.391, 2023: 0.584, 2024: 0.360,
  },
}

// Meta (META) - 2012 상장
{ id: 'META', name: 'Meta', nameEn: 'META', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2012, color: '#0866FF',
  yearlyReturns: {
    2012: 0.0, 2013: 1.063, 2014: 0.428, 2015: 0.342,
    2016: 0.100, 2017: 0.534, 2018: -0.259, 2019: 0.568,
    2020: 0.330, 2021: 0.231, 2022: -0.643, 2023: 1.942, 2024: 0.730,
  },
}

// Tesla (TSLA) - 2010 상장
{ id: 'TSLA', name: 'Tesla', nameEn: 'TSLA', category: 'STOCK_US', currency: 'USD',
  availableFrom: 2010, color: '#CC0000',
  yearlyReturns: {
    2010: 0.0, 2011: -0.102, 2012: 0.292, 2013: 3.442,
    2014: -0.113, 2015: -0.110, 2016: -0.109, 2017: 0.456,
    2018: 0.067, 2019: 0.258, 2020: 7.435, 2021: 0.498,
    2022: -0.652, 2023: 1.018, 2024: 0.630,
  },
}
```

### 3-5. 자산 데이터 — 한국 개별 종목

```typescript
// 삼성전자
{ id: 'SEC', name: '삼성전자', nameEn: '005930', category: 'STOCK_KR', currency: 'KRW',
  availableFrom: 2005, color: '#1428A0',
  yearlyReturns: {
    2005: 0.270, 2006: 0.038, 2007: 0.219, 2008: -0.325,
    2009: 0.607, 2010: 0.315, 2011: 0.151, 2012: 0.456,
    2013: -0.057, 2014: 0.015, 2015: 0.019, 2016: 0.384,
    2017: 0.461, 2018: -0.249, 2019: 0.447, 2020: 0.441,
    2021: 0.024, 2022: -0.288, 2023: 0.348, 2024: -0.320,
  },
  dividendYields: {
    2005: 0.010, 2006: 0.012, 2007: 0.013, 2008: 0.020,
    2009: 0.015, 2010: 0.013, 2011: 0.013, 2012: 0.014,
    2013: 0.016, 2014: 0.017, 2015: 0.016, 2016: 0.025,
    2017: 0.030, 2018: 0.038, 2019: 0.027, 2020: 0.024,
    2021: 0.024, 2022: 0.033, 2023: 0.023, 2024: 0.028,
  },
}

// SK하이닉스
{ id: 'SKHYNIX', name: 'SK하이닉스', nameEn: '000660', category: 'STOCK_KR', currency: 'KRW',
  availableFrom: 2005, color: '#EA0029',
  yearlyReturns: {
    2005: 0.190, 2006: -0.110, 2007: 0.410, 2008: -0.580,
    2009: 1.320, 2010: 0.540, 2011: -0.420, 2012: 0.230,
    2013: 1.630, 2014: 0.520, 2015: -0.210, 2016: 0.470,
    2017: 0.780, 2018: -0.500, 2019: 0.570, 2020: 0.430,
    2021: 0.150, 2022: -0.450, 2023: 0.750, 2024: -0.180,
  },
}

// 현대차
{ id: 'HMC', name: '현대차', nameEn: '005380', category: 'STOCK_KR', currency: 'KRW',
  availableFrom: 2005, color: '#002C5F',
  yearlyReturns: {
    2005: 0.470, 2006: 0.050, 2007: 0.570, 2008: -0.530,
    2009: 0.780, 2010: 0.550, 2011: 0.410, 2012: 0.070,
    2013: -0.220, 2014: -0.100, 2015: -0.270, 2016: -0.220,
    2017: -0.120, 2018: -0.290, 2019: 0.440, 2020: 0.310,
    2021: 0.310, 2022: -0.130, 2023: 0.410, 2024: -0.190,
  },
}

// 기아
{ id: 'KIA', name: '기아', nameEn: '000270', category: 'STOCK_KR', currency: 'KRW',
  availableFrom: 2005, color: '#05141F',
  yearlyReturns: {
    2005: 0.620, 2006: 0.190, 2007: 0.390, 2008: -0.570,
    2009: 1.410, 2010: 0.850, 2011: 0.340, 2012: 0.150,
    2013: -0.050, 2014: -0.140, 2015: -0.200, 2016: -0.110,
    2017: 0.020, 2018: -0.180, 2019: 0.280, 2020: 0.860,
    2021: 0.500, 2022: -0.130, 2023: 0.210, 2024: -0.240,
  },
}

// NAVER
{ id: 'NAVER', name: 'NAVER', nameEn: '035420', category: 'STOCK_KR', currency: 'KRW',
  availableFrom: 2008, color: '#03C75A',
  yearlyReturns: {
    2008: -0.310, 2009: 0.880, 2010: 0.320, 2011: 0.080,
    2012: 0.560, 2013: 1.490, 2014: -0.130, 2015: 0.290,
    2016: -0.160, 2017: 0.370, 2018: -0.410, 2019: 0.230,
    2020: 0.930, 2021: -0.080, 2022: -0.580, 2023: 0.350, 2024: -0.260,
  },
}
```

> ⚠️ **데이터 주의**: 위 수익률은 설계 시점의 참고 추정값입니다. 실제 구현 시 각 종목의 연간 종가 기준 수익률로 정확히 검증하고 교체해야 합니다.

### 3-6. 투자 기간 옵션

```typescript
export const PERIOD_OPTIONS = [
  { value: 3,  label: '3년' },
  { value: 5,  label: '5년' },
  { value: 7,  label: '7년' },
  { value: 10, label: '10년' },
  { value: 15, label: '15년' },
  { value: 20, label: '20년' },
];
```

### 3-7. 기본 선택 자산

```typescript
export const DEFAULT_SELECTED_ASSETS = ['SP500', 'NASDAQ100', 'KOSPI', 'AAPL', 'SEC'];
```

### 3-8. FAQ 데이터

```typescript
export const DCA_FAQ = [
  {
    question: "이 계산기의 수익률 데이터는 어디서 왔나요?",
    answer: "각 지수와 종목의 연간 종가 기준 수익률을 사용합니다. 배당 재투자 옵션을 켜면 연간 배당수익률을 단순 가산해 반영합니다. 과거 데이터는 참고용이며 미래 수익을 보장하지 않습니다.",
  },
  {
    question: "환율 반영을 켜면 무엇이 달라지나요?",
    answer: "미국 자산의 수익을 연도별 평균 원/달러 환율로 환산해 원화 기준 수익으로 보여줍니다. 환율 상승 구간에는 원화 기준 수익이 더 크게 보일 수 있습니다.",
  },
  {
    question: "배당 재투자는 어떻게 계산하나요?",
    answer: "연간 배당수익률을 12등분해 매월 수익률에 가산하는 단순화 방식을 씁니다. 실제 배당 수령 시점, 세금, 거래 비용은 반영되지 않습니다.",
  },
  {
    question: "개별 종목과 지수를 함께 비교할 수 있나요?",
    answer: "네. 지수(S&P500, 코스피 등)와 개별 종목(삼성전자, Apple 등)을 함께 선택해서 최대 6개 자산을 한 화면에서 비교할 수 있습니다.",
  },
  {
    question: "상장일 이전 기간은 어떻게 처리하나요?",
    answer: "데이터가 없는 기간은 계산에서 제외하고, 실제 계산된 기간을 안내 문구로 표시합니다. 예를 들어 Tesla는 2010년 상장이므로 그 이전 기간은 제외됩니다.",
  },
  {
    question: "이 계산 결과를 투자 판단에 사용해도 되나요?",
    answer: "과거 데이터 기반 시뮬레이션으로 미래 수익을 보장하지 않습니다. 투자 의사결정은 공식 자료와 전문가 상담을 병행하는 것을 권장합니다.",
  },
];
```

---

## 4. 계산 로직 (`public/scripts/dca-investment-calculator.js`)

### 4-1. 핵심 함수: `calcDca(asset, monthlyAmount, startYear, periods, useFx, useDividend)`

```javascript
/**
 * 단일 자산 적립식 투자 시뮬레이션
 * @param {Object}  asset        - DcaAsset 데이터
 * @param {number}  monthlyAmount - 월 투자금 (원)
 * @param {number}  startYear    - 투자 시작 연도
 * @param {number}  periods      - 투자 기간 (년)
 * @param {boolean} useFx        - 환율 반영 여부 (USD 자산만 적용)
 * @param {boolean} useDividend  - 배당 재투자 여부
 * @returns {{ finalValue, principal, profit, profitRate, cagr, yearlyValues }}
 */
function calcDca(asset, monthlyAmount, startYear, periods, useFx, useDividend) {
  const endYear = startYear + periods - 1;
  const effectiveStart = Math.max(startYear, asset.availableFrom);
  const effectiveMonths = (endYear - effectiveStart + 1) * 12;

  // 실제 투자 시작~종료 기준으로 월별 수익률 배열 생성
  const monthlyRates = [];
  for (let y = effectiveStart; y <= endYear; y++) {
    const annualReturn = asset.yearlyReturns[y] ?? 0;
    const annualDiv = useDividend ? (asset.dividendYields?.[y] ?? 0) : 0;
    const monthlyRate = (annualReturn + annualDiv) / 12;
    for (let m = 0; m < 12; m++) {
      monthlyRates.push(monthlyRate);
    }
  }

  // 환율 처리 (USD → KRW)
  // 매년 말 환율 기준으로 연간 환율 수익을 마지막 달에 일괄 반영하는 단순화
  const fxAdjustByMonth = [];
  if (useFx && asset.currency === 'USD') {
    for (let y = effectiveStart; y <= endYear; y++) {
      const fxThis = USD_KRW_RATES[y] ?? 1300;
      const fxPrev = USD_KRW_RATES[y - 1] ?? fxThis;
      const fxReturn = (fxThis - fxPrev) / fxPrev;
      for (let m = 0; m < 12; m++) {
        fxAdjustByMonth.push(m === 11 ? fxReturn : 0);
      }
    }
  } else {
    for (let i = 0; i < monthlyRates.length; i++) fxAdjustByMonth.push(0);
  }

  // DCA 계산: 매월 투자 후 잔여 기간 복리 적용
  const baseRate = useFx && asset.currency === 'USD'
    ? USD_KRW_RATES[effectiveStart] ?? 1300  // 첫 달 원화 환산 기준
    : 1;

  let totalValue = 0;
  const yearlyValues = [];
  const N = monthlyRates.length;

  for (let i = 0; i < N; i++) {
    // 이번 달 투자금 (원화 → USD 변환 필요 시)
    const invested = monthlyAmount;
    let value = invested;
    // 이번 달 이후 남은 기간 동안 복리 성장
    for (let j = i; j < N; j++) {
      value *= (1 + monthlyRates[j]);
      value *= (1 + fxAdjustByMonth[j]);
    }
    totalValue += value;

    // 연말 누적 값 저장
    if ((i + 1) % 12 === 0) {
      yearlyValues.push({
        year: effectiveStart + Math.floor(i / 12),
        value: totalValue, // 해당 시점까지의 누적 미래가치
      });
    }
  }

  // USD 자산이고 환율 반영 OFF면 첫 해 환율로 원화 표시
  if (!useFx && asset.currency === 'USD') {
    const rate = USD_KRW_RATES[endYear] ?? 1300;
    totalValue *= rate;
    yearlyValues.forEach(v => { v.value *= rate; });
  }

  const principal = monthlyAmount * effectiveMonths;
  const profit = totalValue - principal;
  const profitRate = principal > 0 ? (profit / principal) * 100 : 0;
  const actualYears = effectiveMonths / 12;
  const cagr = principal > 0
    ? (Math.pow(totalValue / principal, 1 / actualYears) - 1) * 100
    : 0;

  return {
    finalValue: Math.round(totalValue),
    principal: Math.round(principal),
    profit: Math.round(profit),
    profitRate: Math.round(profitRate * 10) / 10,
    cagr: Math.round(cagr * 10) / 10,
    yearlyValues,
    effectiveStartYear: effectiveStart,
    effectiveMonths,
  };
}
```

### 4-2. 전체 계산 흐름

```javascript
function runCalculation() {
  const monthlyAmount = getMonthlyAmount();   // 입력값
  const periods = getSelectedPeriod();
  const endYear = 2024;
  const startYear = endYear - periods + 1;
  const useFx = getFxToggle();
  const useDividend = getDividendToggle();
  const selectedAssets = getSelectedAssets(); // 최대 6개

  const results = selectedAssets.map(asset =>
    ({ asset, ...calcDca(asset, monthlyAmount, startYear, periods, useFx, useDividend) })
  );

  // 수익률 내림차순 정렬
  results.sort((a, b) => b.finalValue - a.finalValue);

  renderKpiCards(results);
  renderBarChart(results);
  renderLineChart(results, startYear, endYear);
  renderRankTable(results);
  renderInsightText(results, monthlyAmount, periods);
  syncUrlParams();
}
```

### 4-3. KPI 계산 기준

| KPI | 계산 방식 |
|---|---|
| 최고 최종 평가금액 | `results[0].finalValue` (1위 자산) |
| 총 투자원금 | `monthlyAmount × periods × 12` |
| 최고 총수익 | `results[0].profit` |
| 최고 CAGR | `results[0].cagr` + 자산명 |

---

## 5. 화면 구조 (마크업 설계)

### 5-1. `aside` 슬롯 — 입력 패널

```html
<article class="panel">
  eyebrow: 투자 조건 설정
  title: 월 투자금과 비교 자산 선택

  <!-- 월 투자금 슬라이더 -->
  <input id="dcaMonthlySlider" type="range" min="100000" max="3000000" step="50000" value="300000">
  <input id="dcaMonthlyInput" type="number" value="300000">

  <!-- 투자 기간 -->
  <select id="dcaPeriodSelect"> 3년/5년/7년/10년/15년/20년 </select>

  <!-- 환율 반영 / 배당 재투자 토글 -->
  <label class="check-field"><input id="dcaFxToggle" type="checkbox"> 환율 반영 (USD→KRW)</label>
  <label class="check-field"><input id="dcaDividendToggle" type="checkbox" checked> 배당 재투자</label>
</article>

<article class="panel">
  eyebrow: 비교 자산 선택 (최대 6개)
  title: 지수와 종목을 고르세요

  <!-- 탭: 미국 지수 / 미국 주식 / 한국 지수 / 한국 주식 -->
  <div class="dca-asset-tabs">
    <button class="dca-tab is-active" data-tab="INDEX_US">미국 지수</button>
    <button class="dca-tab" data-tab="STOCK_US">미국 주식</button>
    <button class="dca-tab" data-tab="INDEX_KR">한국 지수</button>
    <button class="dca-tab" data-tab="STOCK_KR">한국 주식</button>
  </div>

  <!-- 자산 체크박스 목록 (탭별) -->
  <div class="dca-asset-list" id="dcaAssetList">
    {각 자산 체크박스 카드}
  </div>

  <p class="dca-asset-hint" id="dcaAssetHint">최대 6개까지 선택할 수 있습니다.</p>
</article>
```

### 5-2. 결과 영역 — KPI 카드

```html
<section class="dca-section">
  eyebrow: 계산 결과
  h2: 자산별 최종 수익 요약
  sub: {N}개 자산 · {기간}년 · 월 {투자금}원 기준

  <div class="dca-kpi-grid">
    <article class="dca-kpi-card dca-kpi-card--accent">
      최고 최종 평가금액 / id="dcaTopFinalValue"
    </article>
    <article class="dca-kpi-card">
      총 투자원금 / id="dcaPrincipal"
    </article>
    <article class="dca-kpi-card">
      최고 총수익 / id="dcaTopProfit"
    </article>
    <article class="dca-kpi-card">
      최고 CAGR / id="dcaTopCagr"
    </article>
  </div>
</section>
```

### 5-3. 비교 차트

```html
<section class="dca-section">
  eyebrow: 자산 비교
  h2: 최종 평가금액 비교

  <!-- 막대 차트 -->
  <article class="panel">
    <div class="dca-bar-chart-wrap">
      <canvas id="dcaBarChart"></canvas>
    </div>
  </article>

  <!-- 라인 차트 (누적 추이) -->
  <article class="panel">
    eyebrow: 기간별 누적 추이
    h2: 연도별 평가금액 변화
    <div class="dca-line-chart-wrap">
      <canvas id="dcaLineChart"></canvas>
    </div>
  </article>
</section>
```

### 5-4. 순위 테이블

```html
<section class="dca-section">
  eyebrow: 투자 수익 순위
  h2: 자산별 수익률 상세

  <div class="table-wrap">
    <table class="dca-rank-table">
      <thead>순위 / 자산 / 최종 평가금액 / 총수익 / 수익률 / CAGR</thead>
      <tbody id="dcaRankTableBody"></tbody>
    </table>
  </div>
</section>
```

### 5-5. 해석 문구 카드

```html
<article class="dca-insight-card">
  <p id="dcaInsightText">
    매달 {금액}원씩 {기간}년간 투자했을 때,
    {1위 자산}이(가) {최종금액}으로 가장 높은 수익을 기록했습니다.
    원금 {투자원금} 대비 {수익률}% 수익이며, 연평균 {CAGR}%에 해당합니다.
  </p>
</article>
```

---

## 6. DOM ID 정의

| ID | 역할 |
|---|---|
| `dcaMonthlySlider` | 월 투자금 슬라이더 |
| `dcaMonthlyInput` | 월 투자금 숫자 입력 |
| `dcaMonthlyLabel` | 슬라이더 옆 표시값 |
| `dcaPeriodSelect` | 투자 기간 선택 |
| `dcaFxToggle` | 환율 반영 토글 |
| `dcaDividendToggle` | 배당 재투자 토글 |
| `dcaAssetList` | 자산 체크박스 컨테이너 |
| `dcaAssetHint` | 선택 수 안내 문구 |
| `dcaTopFinalValue` | KPI: 최고 최종 금액 |
| `dcaTopFinalNote` | KPI: 자산명 보조 |
| `dcaPrincipal` | KPI: 총 투자원금 |
| `dcaTopProfit` | KPI: 최고 총수익 |
| `dcaTopCagr` | KPI: 최고 CAGR |
| `dcaTopCagrNote` | KPI: CAGR 자산명 |
| `dcaResultSubcopy` | 결과 섹션 보조 문구 |
| `dcaBarChart` | 막대 차트 canvas |
| `dcaLineChart` | 라인 차트 canvas |
| `dcaRankTableBody` | 순위 테이블 tbody |
| `dcaInsightText` | 해석 문구 |
| `resetDcaBtn` | 리셋 버튼 |
| `copyDcaLinkBtn` | 링크 복사 버튼 |

---

## 7. URL 파라미터 정의

| 파라미터 | 값 예시 | 설명 |
|---|---|---|
| `m` | `300000` | 월 투자금 |
| `p` | `10` | 투자 기간(년) |
| `a` | `SP500,NASDAQ100,SEC` | 선택 자산 ID (콤마 구분) |
| `fx` | `1` | 환율 반영 ON |
| `div` | `1` | 배당 재투자 ON |

예시: `?m=300000&p=10&a=SP500,NASDAQ100,AAPL,SEC&fx=1&div=1`

---

## 8. SCSS 구조 (`src/styles/scss/pages/_dca-investment-calculator.scss`)

### 8-1. prefix: `dca-`

### 8-2. 섹션 공통 패턴 (기존 `sb-section`, `dc-section` 참고)

```scss
.dca-page {
  // 섹션 헤더
  .dca-section { }
  .dca-section__head { margin-bottom: 14px; }
  .dca-section__eyebrow { /* 기존 sb-section__eyebrow 동일 */ }
  .dca-section__sub { font-size: 12px; color: #888780; }

  // KPI 그리드
  .dca-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }
  .dca-kpi-card { /* samsung-bonus .kpi-card 동일 톤 */ }
  .dca-kpi-card--accent { background: #E1F5EE; }

  // 자산 탭
  .dca-asset-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .dca-tab { /* dc-shortcut-btn 참고 */ }
  .dca-tab.is-active { background: #0F6E56; color: #fff; border-color: #0F6E56; }

  // 자산 체크박스 카드 (dc-brand-row 참고)
  .dca-asset-item { /* 체크박스 + 이름 + 색상 dot + 카테고리 배지 */ }
  .dca-asset-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dca-asset-hint { font-size: 11px; color: #B4B2A9; margin-top: 8px; }

  // 차트 래퍼
  .dca-bar-chart-wrap { position: relative; height: 260px; }
  .dca-line-chart-wrap { position: relative; height: 280px; }

  // 순위 테이블
  .dca-rank-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .dca-rank-badge { /* 1위 강조 배지 */ }

  // 해석 카드
  .dca-insight-card {
    background: #F7F6F4;
    border-radius: 10px;
    padding: 16px;
    font-size: 13px;
    color: #1A1A18;
    line-height: 1.7;
  }

  // 반응형
  @media (min-width: 560px) {
    .dca-kpi-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 768px) {
    .dca-kpi-grid { grid-template-columns: repeat(4, 1fr); }
    .dca-bar-chart-wrap { height: 300px; }
    .dca-line-chart-wrap { height: 320px; }
  }
}
```

---

## 9. 컴포넌트 구조 (astro)

### 9-1. import 목록

```typescript
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  DCA_ASSETS,
  DCA_FAQ,
  PERIOD_OPTIONS,
  DEFAULT_SELECTED_ASSETS,
  DCA_NEXT_REPORT,
  DCA_EXTERNAL_LINKS,
  DCA_AFFILIATE_PRODUCTS,
} from "../../data/dcaInvestment";
```

### 9-2. config JSON 직렬화

```typescript
const config = { DCA_ASSETS, PERIOD_OPTIONS, DEFAULT_SELECTED_ASSETS };
// <script id="dcaConfig" type="application/json" set:html={JSON.stringify(config)}></script>
```

### 9-3. 전체 섹션 순서

```
SimpleToolShell (resultFirst=true)
│
├── slot="hero"     → CalculatorHero
├── slot="actions"  → ToolActionBar (reset + copy)
├── slot="aside"    → 입력 패널 2개 (투자 조건 / 자산 선택)
│
├── [main]
│   ├── KPI 4종 카드 그리드
│   ├── 비교 차트 (막대 + 라인)
│   ├── 순위 테이블
│   ├── 해석 문구 카드
│   └── InfoNotice (안내)
│
├── 다음 리포트 CTA (미국 부자 TOP10)
├── 외부 참고 링크 (S&P Global, 한국거래소, 국세청, 고용부)
├── 제휴 섹션 (affiliate-box--alt)
│
└── slot="seo" → SeoContent (FAQ + related 5개)
```

---

## 10. 하단 섹션 데이터 (`src/data/dcaInvestment.ts` 추가)

```typescript
export const DCA_NEXT_REPORT = {
  href: "/reports/us-rich-top10-patterns/",
  eyebrow: "이어서 보면 좋은 리포트",
  title: "미국 부자 TOP 10 성공 패턴",
  desc: "세계 최대 자산가들이 어떤 방식으로 자산을 쌓았는지 정리한 리포트입니다. 장기 투자와 자산 배분의 실제 패턴을 확인할 수 있습니다.",
  badges: ["장기 투자", "자산 배분"],
  cta: "미국 부자 TOP 10 패턴 보기",
  sub: [
    { href: "/reports/korea-rich-top10-assets/", title: "한국 부자 TOP 10 자산 비교",
      desc: "국내 최상위 자산가들의 보유 자산 구조를 비교합니다.", badges: ["한국", "자산"] },
    { href: "/tools/salary-tier/", title: "연봉 티어 계산기",
      desc: "내 연봉이 전체에서 어느 위치인지 바로 확인합니다.", badges: ["연봉", "비교"] },
    { href: "/tools/household-income/", title: "가구 소득 계산기",
      desc: "가구 소득 기준으로 투자 가능 금액을 가늠할 수 있습니다.", badges: ["가구", "소득"] },
  ],
};

export const DCA_EXTERNAL_LINKS = [
  {
    title: "S&P Global — S&P 500 Index",
    desc: "S&P500 지수 구성·수익률·배당 기준 데이터를 공식 확인",
    source: "S&P Global",
    href: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/",
  },
  {
    title: "한국거래소 주요 지수 현황",
    desc: "코스피·코스닥150 지수 수익률과 구성 종목을 공식 확인",
    source: "KRX 한국거래소",
    href: "https://www.krx.co.kr/",
  },
  {
    title: "국세청 해외주식 양도소득세 안내",
    desc: "해외주식 수익 과세 기준과 신고 방법 공식 확인",
    source: "국세청",
    href: "https://www.nts.go.kr/",
  },
  {
    title: "금융투자협회 ISA 계좌 안내",
    desc: "절세 투자 계좌인 ISA 납입 한도와 비과세 조건 공식 확인",
    source: "금융투자협회",
    href: "https://www.kofia.or.kr/",
  },
];

export const DCA_AFFILIATE_PRODUCTS = [
  {
    tag: "투자 입문",
    title: "존 보글의 인덱스 펀드 혁명",
    desc: "S&P500 인덱스 적립식 투자의 이론적 토대를 만든 존 보글의 장기 투자 원칙서",
    cta: "쿠팡에서 보기 →",
    href: "https://www.coupang.com/np/search?q=%EC%9D%B8%EB%8D%B1%EC%8A%A4+%ED%8E%80%EB%93%9C+%EC%9E%A5%EA%B8%B0%ED%88%AC%EC%9E%90",
  },
  {
    tag: "재테크",
    title: "돈의 속성",
    desc: "연봉·성과급을 자산으로 키우는 국내 대표 재테크 베스트셀러",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/efEJ6t",
  },
  {
    tag: "절세 계좌",
    title: "ISA 계좌로 미국 ETF 투자",
    desc: "국내 ETF·해외주식 수익을 비과세로 관리하는 ISA 계좌 활용 가이드",
    cta: "쿠팡에서 보기 →",
    href: "https://www.coupang.com/np/search?q=ISA+%EC%A0%88%EC%84%B8+%ED%88%AC%EC%9E%90",
  },
  {
    tag: "포트폴리오",
    title: "투자 포트폴리오 기록 노트",
    desc: "월별 투자 금액과 평가액을 직접 기록하는 플래너형 투자 다이어리",
    cta: "쿠팡에서 보기 →",
    href: "https://www.coupang.com/np/search?q=%ED%88%AC%EC%9E%90+%EA%B8%B0%EB%A1%9D+%EB%85%B8%ED%8A%B8",
  },
];
```

---

## 11. tools.ts 등록

```typescript
// src/data/tools.ts 에 추가
{
  slug: "dca-investment-calculator",
  title: "10년 적립식 투자 계산기",
  description: "S&P500·나스닥·코스피·미국·한국 대표 주식을 한 화면에서 비교하는 적립식 투자 수익 계산기",
  category: "투자·자산",
  order: 35,
  badges: ["미국주식", "장기투자"],
  previewStats: [
    { label: "비교 자산", value: "15종" },
    { label: "최대 기간", value: "20년" },
  ],
}
```

---

## 12. SeoContent 설정

```typescript
// bonus-simulator 패턴 참고
faq={DCA_FAQ}
related={[
  { href: "/reports/us-rich-top10-patterns/",   label: "미국 부자 TOP 10 성공 패턴" },
  { href: "/reports/korea-rich-top10-assets/",  label: "한국 부자 TOP 10 자산 비교" },
  { href: "/tools/salary-tier/",                label: "연봉 티어 계산기" },
  { href: "/tools/household-income/",           label: "가구 소득 계산기" },
  { href: "/tools/home-purchase-fund/",         label: "내집마련 자금 계산기" },
]}
```

---

## 13. 구현 순서

| 단계 | 작업 | 파일 |
|---|---|---|
| 1 | 타입·데이터·FAQ 정의 | `src/data/dcaInvestment.ts` |
| 2 | tools.ts 등록 | `src/data/tools.ts` |
| 3 | 페이지 마크업 | `src/pages/tools/dca-investment-calculator.astro` |
| 4 | SCSS 작성 | `src/styles/scss/pages/_dca-investment-calculator.scss` |
| 5 | app.scss import 추가 | `src/styles/app.scss` |
| 6 | JS 계산 로직 | `public/scripts/dca-investment-calculator.js` |
| 7 | sitemap 등록 | `public/sitemap.xml` |
| 8 | `npm run build` 확인 | — |
| 9 | 모바일·PC 수동 QA | — |
| 10 | OG 이미지 생성 | `scripts/generate-og-tools.py` |

---

## 14. QA 체크포인트

### 계산 정확성
- [ ] S&P500 10년 기본값 계산 결과가 상식적 범위(수익률 100~300%)인가
- [ ] 환율 OFF vs ON 시 미국 자산 결과 차이가 합리적으로 보이는가
- [ ] 배당 재투자 ON/OFF 시 결과 차이가 반영되는가
- [ ] Meta(2012), Tesla(2010) 등 상장 이후 데이터만 반영되는가
- [ ] 투자기간 > 데이터 가용 기간인 경우 처리 오류 없는가
- [ ] 비교 자산 0개 선택 시 오류 없이 안내 표시되는가

### UX / 인터랙션
- [ ] 슬라이더 조작 시 숫자 입력 값과 동기화 되는가
- [ ] 자산 7개 이상 선택 시 체크 막히고 안내 문구 표시되는가
- [ ] 탭 전환 시 체크 상태 유지되는가
- [ ] URL 파라미터 공유 후 복원 시 동일 결과인가
- [ ] 리셋 시 기본값으로 정확히 돌아오는가

### 시각화
- [ ] 막대 차트 자산 색상이 체크박스 dot 색상과 일치하는가
- [ ] 라인 차트 연도 레이블이 올바르게 표시되는가
- [ ] 순위 테이블 1위 행 강조 스타일 적용되는가
- [ ] 모바일에서 차트가 overflow 없이 표시되는가

### SEO / 콘텐츠
- [ ] 모든 제목·설명·FAQ가 한국어로 자연스러운가
- [ ] "추정", "참고" 고지 문구가 명확히 표시되는가
- [ ] 내부 링크 5개 모두 SeoContent에 포함되는가
- [ ] JSON-LD `WebApplication` 타입이 정상 출력되는가
- [ ] OG 이미지 경로가 BaseLayout에 올바르게 전달되는가
