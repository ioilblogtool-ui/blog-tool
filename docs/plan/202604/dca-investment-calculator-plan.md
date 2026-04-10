# 10년 적립식 투자 계산기 — 웹기획서 v1

> 문서 유형: 기획 원본 (`docs/plan/`)
> 작성일: 2026-04-02
> 구현 단계: `docs/design/` 설계서 작성 후 진행

---

## 1. 페이지 개요

| 항목 | 내용 |
|---|---|
| **계산기명** | 10년 적립식 투자 계산기 |
| **서브타이틀** | 미국 시총 TOP10 · 한국 시총 TOP10 · S&P500 · 나스닥 · 코스피 비교 |
| **URL 슬러그** | `/tools/dca-investment-calculator/` |
| **레이아웃 쉘** | `SimpleToolShell.astro` (resultFirst 모드) |
| **카테고리** | 투자·자산 |
| **목적** | 매달 동일 금액을 장기 투자했을 때 자산별 최종 수익을 비교하는 계산기 |
| **MVP 범위** | 지수 3종(S&P500·나스닥·코스피) + 개별 종목 선택 최대 5개 |
| **확장 범위** | 미국/한국 시총 TOP10 묶음, ISA 절세 계산, 환율 반영 |

---

## 2. SEO 메타

### SEO Title (60자 이내)
```
10년 적립식 투자 계산기 | S&P500·나스닥·코스피·미국·한국 주식 비교
```

### Meta Description (120자 이내)
```
매달 같은 금액을 10년 동안 투자했다면 지금 얼마가 됐는지 계산하세요.
S&P500, 나스닥, 코스피, 미국·한국 시총 TOP10 대표 주식을 한 화면에서 비교합니다.
```

### OG Image
`/og/tools/dca-investment-calculator.png`

### 검색 유입 타이틀 시드 (파생 콘텐츠용)
- S&P500 10년 적립식 투자 계산기
- 나스닥 적립식 투자 수익 계산기
- 삼성전자 vs S&P500 10년 투자 비교
- 미국 시총 TOP10 적립식 투자 계산기
- 월 30만원 10년 투자 계산기
- 애플·엔비디아·삼성전자 장기투자 비교

---

## 3. Hero 카피

| 항목 | 문구 |
|---|---|
| **eyebrow** | 적립식 투자 계산기 |
| **title** | 10년 적립식 투자 계산기 |
| **description** | 매달 같은 금액을 넣었다면 지금 얼마가 됐는지, S&P500·나스닥·코스피와 미국·한국 대표 주식을 한 화면에서 바로 비교합니다. |

---

## 4. 입력값 설계

### 기본 입력

| 입력 ID | 레이블 | 타입 | 기본값 | 범위/옵션 |
|---|---|---|---|---|
| `monthlyAmountInput` | 월 투자금 | number + slider | 300,000 | 10,000 ~ 3,000,000 |
| `investPeriodSelect` | 투자 기간 | select | 10년 | 3·5·7·10·15·20년 |
| `startYearSelect` | 투자 시작 연도 | select | 2016 | 2005 ~ 2024 |
| `assetCheckboxes` | 비교 자산 | multi-checkbox | S&P500·나스닥·코스피·삼성전자 | 전체 자산 목록에서 최대 6개 |
| `currencyToggle` | 환율 반영 | toggle | OFF | ON(원화 환산) / OFF(현지통화 유지) |
| `dividendToggle` | 배당 재투자 | toggle | ON | ON / OFF |

### 고급 입력 (접어두기)

| 입력 ID | 레이블 | 기본값 |
|---|---|---|
| `feeRateInput` | 연 수수료율 | 0.05% |
| `taxRateInput` | 세금 단순 반영 | 15.4% (해외) / 없음 (국내지수) |
| `rebalanceToggle` | 리밸런싱 여부 | OFF |

---

## 5. 비교 자산 목록 (데이터 설계)

### 5-1. 지수 (Index)

| ID | 이름 | 대표 ETF 참고 | 비고 |
|---|---|---|---|
| `SP500` | S&P500 | SPY / VOO | 미국 |
| `NASDAQ100` | 나스닥100 | QQQ | 미국 |
| `KOSPI` | 코스피 | 069500 (KODEX200) | 한국 |
| `KOSDAQ150` | 코스닥150 | 229200 (KODEX 코스닥150) | 한국 |

### 5-2. 미국 개별 종목 (US Top)

| ID | 종목명 | 티커 |
|---|---|---|
| `AAPL` | Apple | AAPL |
| `MSFT` | Microsoft | MSFT |
| `NVDA` | Nvidia | NVDA |
| `AMZN` | Amazon | AMZN |
| `GOOGL` | Alphabet | GOOGL |
| `META` | Meta | META |
| `TSLA` | Tesla | TSLA |
| `AVGO` | Broadcom | AVGO |
| `BRK_B` | Berkshire B | BRK-B |
| `LLY` | Eli Lilly | LLY |

### 5-3. 한국 개별 종목 (KR Top)

| ID | 종목명 | 비고 |
|---|---|---|
| `SEC` | 삼성전자 | 대표 |
| `SKHYNIX` | SK하이닉스 | |
| `LGENER` | LG에너지솔루션 | 2022 상장 |
| `SAMSUNGBIO` | 삼성바이오로직스 | |
| `HYUNDAI` | 현대차 | |
| `KIA` | 기아 | |
| `NAVER` | NAVER | |
| `HANWHA` | 한화에어로스페이스 | |
| `KB` | KB금융 | |
| `CELLTRION` | 셀트리온 | |

> **데이터 주의**: 상장일 이전 기간은 계산에서 제외하고 안내문 표시.
> LG에너지솔루션(2022.01), 한화에어로스페이스(2024 편입) 등 주의.

---

## 6. 계산 로직 설계

### 기본 공식 (단순 적립식)

```
월 n회차 평가금액 = Σ(월투자금 × (1 + 월수익률)^(잔여개월수))
최종 평가금액 = 각 월 투자금의 복리 누적 합산
총 투자원금 = 월투자금 × 투자개월수
총 수익 = 최종 평가금액 - 총 투자원금
누적 수익률 = (총수익 / 총투자원금) × 100
CAGR = ((최종금액 / 투자원금) ^ (1/투자년수)) - 1
```

### 데이터 소스 방식 (MVP)

실시간 API 대신 **연간 수익률 배열**을 정적 데이터로 내장한다.

```typescript
// 예시 데이터 구조
type AssetYearlyReturn = {
  id: string;
  name: string;
  category: 'INDEX' | 'US_STOCK' | 'KR_STOCK';
  currency: 'USD' | 'KRW';
  yearlyReturns: Record<number, number>; // { 2015: 0.013, 2016: 0.118, ... }
  dividendYields?: Record<number, number>; // 배당 재투자용
  availableFrom: number; // 데이터 시작 연도
};
```

### 환율 처리

```typescript
// 연도별 평균 원/달러 환율 정적 데이터
type FxRates = Record<number, number>; // { 2015: 1131, 2016: 1160, ... }
// 환율 반영 ON 시: 달러 수익 × 해당 연도 환율 → 원화로 계산
```

---

## 7. 결과 영역 설계

### 7-1. KPI 요약 카드 (상단 고정)

| 카드 ID | 레이블 | 비고 |
|---|---|---|
| `dca-total-value` | 최종 평가금액 (가장 높은 자산 기준) | 강조 카드 |
| `dca-principal` | 총 투자원금 | |
| `dca-total-profit` | 총 수익 | |
| `dca-top-cagr` | 최고 CAGR | 자산 이름 함께 |

### 7-2. 비교 차트

| 차트 | 설명 |
|---|---|
| 막대 차트 | 자산별 최종 평가금액 비교 (내림차순) |
| 라인 차트 | 기간별 누적 투자금액 vs 평가금액 추이 |

### 7-3. 순위 테이블

| 컬럼 | 내용 |
|---|---|
| 순위 | 1위~N위 |
| 자산명 | 이름 + 국가/지수 배지 |
| 최종 평가금액 | 원화 기준 |
| 총 수익 | |
| 수익률 | % |
| CAGR | % |

### 7-4. 해석 문구 (동적 생성)

```
매달 {월투자금}원씩 {투자기간}년간 투자했을 때,
{1위 자산명}이(가) {최종금액}으로 가장 높은 수익을 기록했습니다.
원금 {투자원금} 대비 {수익률}% 수익이며, 연평균 {CAGR}%에 해당합니다.
```

---

## 8. 섹션 구성 및 문구 초안

### 섹션 ① 입력 패널

```
eyebrow: 투자 조건 설정
title: 월 투자금과 자산을 선택하세요
summary: 투자 기간과 대상만 고르면 자산별 최종 금액과 수익률을 바로 비교할 수 있습니다.
```

### 섹션 ② 결과 KPI

```
eyebrow: 계산 결과
title: 자산별 최종 수익 요약
sub: {자산 수}개 자산을 {투자기간}년 기준으로 비교합니다.
```

### 섹션 ③ 비교 차트

```
eyebrow: 자산 비교
title: 최종 평가금액 비교
sub: 같은 원금으로 어느 자산이 가장 많이 성장했는지 확인합니다.
```

### 섹션 ④ 순위 테이블

```
eyebrow: 투자 수익 순위
title: 자산별 수익률 상세
sub: 수익률, CAGR, 최종 금액을 함께 확인합니다.
```

### 섹션 ⑤ 계산 기준 안내

```
title: 안내
lines:
- 연간 수익률은 해당 지수/종목의 연간 종가 기준 변동률을 사용했습니다.
- 배당 재투자 ON 시 연간 배당수익률을 단순 가산해 반영합니다.
- 환율은 연도별 평균 원/달러 환율 기준이며 실제 환전 시점과 다를 수 있습니다.
- 수수료·세금은 참고값이며 실제 조건에 따라 달라질 수 있습니다.
- 과거 수익률은 미래 수익을 보장하지 않습니다.
```

---

## 9. 외부 참고 링크 섹션

| 제목 | 설명 | URL |
|---|---|---|
| S&P500 공식 지수 정보 | S&P Global에서 S&P500 구성·수익률 기준 데이터 확인 | https://www.spglobal.com/spdji/en/indices/equity/sp-500/ |
| 한국거래소 주요 지수 현황 | 코스피·코스닥150 지수 수익률과 구성 종목 공식 확인 | https://www.krx.co.kr/ |
| 금융투자협회 ISA/IRP 안내 | 절세 계좌 비교와 납입 한도 공식 확인 | https://www.kofia.or.kr/ |
| 국세청 해외주식 양도소득세 안내 | 해외주식 수익 과세 기준 확인 | https://www.nts.go.kr/ |

---

## 10. 제휴 섹션 설계

### 상품 카드 4종

| tag | title | desc | href |
|---|---|---|---|
| 증권 계좌 | 미국주식 계좌 개설 가이드 | 수수료 우대 조건과 환전 비용을 비교하고 바로 개설할 수 있습니다. | placeholder |
| 절세 계좌 | ISA 계좌로 투자하기 | 국내 ETF·해외주식 수익을 비과세로 관리할 수 있는 ISA 계좌 비교입니다. | placeholder |
| 재테크 도서 | 주식 장기투자 바이블 | 존 보글의 인덱스 투자 원칙부터 국내 장기투자 전략까지 정리한 도서입니다. | placeholder |
| 가계부 | 투자 포트폴리오 기록 노트 | 월별 투자 금액과 평가액을 직접 기록하는 플래너형 투자 다이어리입니다. | placeholder |

### 고지 문구
```
이 링크는 쿠팡파트너스 및 제휴 활동의 일환으로, 구매 시 소정의 수수료를 받을 수 있습니다.
```

---

## 11. 다음 리포트/계산기 CTA

### 메인 CTA

| 항목 | 내용 |
|---|---|
| eyebrow | 이어서 보면 좋은 리포트 |
| title | 미국 부자 TOP 10 성공 패턴 |
| desc | 세계 최대 자산가들이 어떤 방식으로 자산을 쌓았는지 정리한 리포트입니다. |
| href | `/reports/us-rich-top10-patterns/` |
| cta | 미국 부자 TOP 10 패턴 보기 |

### 보조 링크

| 제목 | href |
|---|---|
| 한국 부자 TOP 10 자산 비교 | `/reports/korea-rich-top10-assets/` |
| 연봉 티어 계산기 | `/tools/salary-tier/` |
| 가구 소득 계산기 | `/tools/household-income/` |
| 내집마련 자금 계산기 | `/tools/home-purchase-fund/` |

---

## 12. FAQ

| 질문 | 답변 |
|---|---|
| 이 계산기의 수익률 데이터는 어디서 왔나요? | 각 지수·종목의 연간 종가 변동률을 기준으로 사용합니다. 배당 재투자 옵션을 켜면 연간 배당수익률을 단순 가산해 반영합니다. |
| 환율 반영을 켜면 무엇이 달라지나요? | 미국 자산의 수익을 연도별 평균 원/달러 환율로 환산해 원화 기준 수익으로 보여줍니다. 환율 상승 구간에서는 원화 기준 수익이 더 크게 나타날 수 있습니다. |
| 배당 재투자는 어떻게 계산하나요? | 해당 연도 배당수익률을 매월 균등 분배해 투자수익률에 가산하는 단순화 방식을 씁니다. 실제 배당 재투자 시점, 세금, 거래비용은 반영하지 않습니다. |
| 개별 종목과 지수를 함께 비교할 수 있나요? | 네. 지수(S&P500, 코스피 등)와 개별 종목(삼성전자, Apple 등)을 함께 선택해서 한 화면에서 비교할 수 있습니다. |
| 상장일 이전 데이터는 어떻게 처리하나요? | 데이터가 없는 기간은 계산에서 제외하고, 해당 기간이 빠진 것을 안내 문구로 표시합니다. |
| 이 계산기 결과를 투자 판단에 써도 되나요? | 과거 데이터 기반 시뮬레이션이라 미래 수익을 보장하지 않습니다. 투자 의사결정은 공식 자료와 전문가 상담을 함께 활용하는 것을 권장합니다. |

---

## 13. JSON-LD 초안

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "10년 적립식 투자 계산기",
  "url": "https://bigyocalc.com/tools/dca-investment-calculator/",
  "description": "매달 같은 금액을 10년 동안 투자했다면 지금 얼마가 됐는지, S&P500·나스닥·코스피·미국·한국 대표 주식을 한 화면에서 비교하는 적립식 투자 계산기입니다.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "ko-KR",
  "isAccessibleForFree": true,
  "provider": {
    "@type": "Organization",
    "name": "비교계산소",
    "url": "https://bigyocalc.com"
  },
  "featureList": [
    "S&P500·나스닥·코스피 적립식 수익 계산",
    "미국·한국 대표 주식 비교",
    "환율 반영 원화 환산",
    "배당 재투자 반영",
    "CAGR·누적 수익률 계산"
  ]
}
```

---

## 14. tools.ts 등록 초안

```typescript
{
  slug: "dca-investment-calculator",
  title: "10년 적립식 투자 계산기",
  description: "S&P500·나스닥·코스피·미국·한국 대표 주식을 한 화면에서 비교하는 적립식 투자 수익 계산기",
  category: "투자·자산",
  order: 35,
  badges: ["미국주식", "장기투자", "비교"],
  previewStats: [
    { label: "비교 자산", value: "S&P500·나스닥·코스피 외" },
    { label: "최대 기간", value: "20년" },
  ],
}
```

---

## 15. 구현 단계 (MVP 기준)

| 단계 | 작업 | 비고 |
|---|---|---|
| 1 | `docs/design/` 설계 문서 작성 | 화면 구성·계산 로직·데이터 구조 확정 |
| 2 | `src/data/dcaInvestment.ts` 작성 | 연간 수익률 정적 데이터 + 자산 목록 |
| 3 | `src/data/tools.ts` 등록 | |
| 4 | `public/scripts/dca-investment-calculator.js` | 계산 로직 + Chart.js 차트 |
| 5 | `src/pages/tools/dca-investment-calculator.astro` | 페이지 조립 |
| 6 | `src/styles/scss/pages/_dca-investment-calculator.scss` | 스타일 |
| 7 | `src/styles/app.scss` import 추가 | |
| 8 | `public/sitemap.xml` 라우트 추가 | |
| 9 | OG 이미지 생성 | `scripts/generate-og-tools.py` 실행 |
| 10 | `npm run build` + DEPLOY_CHECKLIST 점검 | |

---

## 16. 연관 페이지 내부 링크 매핑

이 계산기가 생기면 아래 페이지에서 내부 링크를 추가한다.

| 페이지 | 추가 위치 | 링크 문구 |
|---|---|---|
| `/reports/us-rich-top10-patterns/` | related 링크 | 10년 적립식 투자 계산기 |
| `/reports/korea-rich-top10-assets/` | related 링크 | 10년 적립식 투자 계산기 |
| `/tools/salary-tier/` | SeoContent related | 10년 적립식 투자 계산기 |
| `/tools/household-income/` | SeoContent related | 10년 적립식 투자 계산기 |
| `/tools/home-purchase-fund/` | SeoContent related | 10년 적립식 투자 계산기 |
| `/tools/samsung-bonus/` | 다음 계산기 섹션 | 10년 적립식 투자 계산기 |
| `/tools/bonus-simulator/` | 다음 리포트 보조 | 10년 적립식 투자 계산기 |
