# 2026 이유식 직접 만들기 vs 시판 이유식 실비용 완전 비교 — 설계 문서

> 작성일: 2026-06-27
> 콘텐츠 유형: `/reports/` 비교 리포트
> 구현 기준: 직접 만들기 1개 시나리오 + 시판 이유식 브랜드 6개 × 단계별 실구매가 × 단계별 소비량 → 월 비용·6개월 누적 비용·시간 비용 포함 비교

---

## 1. 문서 개요

- 구현 대상: `2026 이유식 직접 만들기 vs 시판 이유식 실비용 완전 비교`
- slug: `baby-food-cost-comparison-2026`
- URL: `/reports/baby-food-cost-comparison-2026/`
- 카테고리: 출산/임신·육아
- 핵심 검색 의도: "이유식 비교 2026", "베베쿡 잇마플 비교", "이유식 직접 만들기 비용", "시판 이유식 가격", "이유식 6개월 비용"
- 핵심 CTA: 신규 계산기 (선택) 또는 `/tools/diaper-cost/`, `/tools/breastfeeding-vs-formula-cost/`
- 수익화: 쿠팡 파트너스 제휴 링크 (섹션 ④·정기배송·조리도구)
- 참고 패턴: `baby-formula-brand-cost-comparison-2026`와 동일한 데이터/컴포넌트 구조 재사용 (브랜드별 가격표 + 누적 비용 시뮬레이션 + 구매처 최저가)

---

## 2. 구현 파일 구조

```text
src/
  data/
    babyFoodCostComparison2026.ts   ← 브랜드 데이터, 직접 만들기 데이터, FAQ, 관련 링크
  pages/
    reports/
      baby-food-cost-comparison-2026.astro

src/styles/scss/pages/
  _baby-food-cost-comparison-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/baby-food-cost-comparison-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `report-page op-page bfd-page` 클래스.
- 인터랙션: 없음 (정적 렌더링). 섹션 ⑤⑥⑦ 차트만 Chart.js 사용.
- SCSS prefix: `bfd-` (baby food)

---

## 4. 데이터 모델

```ts
// src/data/babyFoodCostComparison2026.ts

export type FoodMakerType = 'homemade' | 'brand';
export type FoodGrade = 'standard' | 'organic' | 'premium';

export interface BabyFoodOption {
  id: string;
  name: string;                      // "홈메이드 이유식" 또는 브랜드명
  type: FoodMakerType;                // homemade / brand
  grade: FoodGrade | null;            // 시판일 때만 의미 있음
  stages: BabyFoodStage[];            // 단계별 데이터
  pros: string[];                     // 강점 3개
  cons: string[];                     // 약점 2개
  bestFor: string;                    // 추천 대상 한 줄
  note: string;                       // 특이사항
  updatedAt: string;                  // 가격 확인 기준일
}

export interface BabyFoodStage {
  stage: 'initial' | 'middle' | 'late' | 'complete'; // 초기·중기·후기·완료기
  ageRangeLabel: string;              // 월령 기준 (예: "4~6개월")
  servingG: number;                   // 1회분 용량 (g)
  listPrice: number | null;           // 정가 (원). 직접 만들기는 null
  subscriptionPrice: number | null;   // 정기배송가 (원). 직접 만들기는 null
  homemadeIngredientCostPerServing: number | null; // 직접 만들기 1회분 재료비. 시판은 null
  pricePerHundredG: number;           // 100g당 단가 (원)
  coupaUrl: string;                   // 쿠팡 파트너스 URL (제휴 링크). 직접 만들기는 빈 문자열
}

export interface FoodMonthlyRow {
  stage: 'initial' | 'middle' | 'late' | 'complete';
  ageRangeLabel: string;
  dailyServings: number;              // 1일 섭취 횟수
  dailyGrams: number;                 // 1일 소비량 (g)
  monthlyGrams: number;               // 월 소비량 (g)
}

export interface CookingToolItem {
  name: string;                       // 찜기·블렌더·소분용기 등
  price: number;                      // 구매 가격 (원, 추정)
  necessity: 'essential' | 'optional';
  affiliateUrl: string;
}

export interface TimeCostRow {
  scenario: string;                   // "배치 조리(주 1회)" 등
  weeklyMinutes: number;              // 주당 소요 시간 (분)
  monthlyMinutes: number;             // 월 소요 시간 (분)
  monthlyTimeCostKrw: number;         // 시급 가정 적용 시 월 시간 비용 (원, 추정)
}

export interface SubscriptionBenefit {
  brand: string;
  discountRate: string;               // 할인율 (예: "최대 10%")
  condition: string;
  monthlySaving: number;              // 월 절감액 추정 (원)
  affiliateUrl: string;
}
```

---

## 5. 옵션 데이터 상세 (직접 만들기 1개 + 브랜드 6개)

### 직접 만들기 ⓪ 홈메이드 이유식

- 단계: 초기(4~6개월)·중기(7~9개월)·후기(10~12개월)·완료기(12개월~)
- 재료비 기준 (추정, 100g당):
  - 초기: 쌀미음+단일 채소 — 약 1,200원
  - 중기: 곡물+채소+육류 혼합 — 약 1,800원
  - 후기: 다양한 재료+양념 시작 — 약 2,200원
  - 완료기: 가족식과 유사한 재료 구성 — 약 2,500원
- 특징: 배치 조리(주 1~2회 대량 조리 후 냉동 소분) 가정. 조리도구 초기 구매비 별도.
- 강점: 재료 직접 선택 가능, 단가 자체는 가장 저렴, 알레르기 유발 식품 도입 통제 용이
- 약점: 조리·소분·세척 시간 소요, 초기 도구 구매비 부담, 식재료 관리 필요
- 추천 대상: 시간 여유가 있는 부모, 재료 선택을 직접 통제하고 싶은 경우

### 시판 프리미엄 ① 베베쿡

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 3,500원 / 정기배송가 약 3,000원 / 100g당 약 7,500원
- 특징: 냉동 이유식 시장 1위 브랜드, 정기배송 구조 잘 갖춰짐
- 강점: 메뉴 다양성, 정기배송 편의성, 브랜드 신뢰도 높음
- 약점: 100g당 단가가 직접 만들기 대비 4~5배 이상, 메뉴 변경 제약
- 추천 대상: 시간 부족한 맞벌이 부모, 메뉴 다양성을 원하는 경우

### 시판 일반 ② 잇마플

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 3,000원 / 정기배송가 약 2,600원 / 100g당 약 6,500원
- 특징: 가성비 냉동 이유식, 다양한 메뉴 구성
- 강점: 베베쿡보다 저렴, 메뉴 구성 풍부
- 약점: 원료 등급이 프리미엄 라인 대비 낮음
- 추천 대상: 시판 이유식 비용을 최대한 줄이고 싶은 부모

### 시판 유기농 ③ 오가닉스타트

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 4,200원 / 정기배송가 약 3,700원 / 100g당 약 9,250원
- 특징: 유기농 인증 원료, 단가 높음
- 강점: 유기농 인증, 첨가물 무첨가 마케팅
- 약점: 시판 옵션 중 가장 비쌈
- 추천 대상: 유기농 원료를 최우선으로 두는 부모

### 시판 일반 ④ 마이리틀쉐프

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 2,800원 / 정기배송가 약 2,400원 / 100g당 약 6,000원
- 특징: 중가형, 마트 유통 병행
- 강점: 시판 옵션 중 가장 저렴한 편, 오프라인 구매 가능
- 약점: 브랜드 인지도 상대적으로 낮음
- 추천 대상: 시판 이유식 중 비용을 최우선으로 고려하는 부모

### 시판 프리미엄 ⑤ 헬로네이처 이유식

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 3,800원 / 정기배송가 약 3,300원 / 100g당 약 8,250원
- 특징: 신선 배송 강조, 프리미엄 라인
- 강점: 신선도 마케팅, 새벽배송 연계
- 약점: 배송 지역 제한, 단가 높은 편
- 추천 대상: 신선도를 중시하고 새벽배송권에 거주하는 부모

### 시판 일반 ⑥ 베이비본

- 단계: 초기~완료기
- 가격 기준 (추정):
  - 초기 40g: 정가 약 2,900원 / 정기배송가 약 2,500원 / 100g당 약 6,250원
- 특징: 시장 진입 중소 브랜드, 가격 경쟁력 강조
- 강점: 합리적 가격, 정기배송 할인 적극적
- 약점: 브랜드 인지도 낮음, 메뉴 구성 제한적
- 추천 대상: 합리적인 가격의 시판 이유식을 찾는 부모

---

## 6. 단계별 소비량 기준 데이터

```ts
// 대한소아과학회 권고 참고, 추정값
export const BABY_FOOD_MONTHLY_CONSUMPTION: FoodMonthlyRow[] = [
  { stage: 'initial',  ageRangeLabel: '4~6개월',   dailyServings: 1, dailyGrams: 40,  monthlyGrams: 1200 },
  { stage: 'middle',   ageRangeLabel: '7~9개월',   dailyServings: 2, dailyGrams: 160, monthlyGrams: 4800 },
  { stage: 'late',     ageRangeLabel: '10~12개월', dailyServings: 3, dailyGrams: 270, monthlyGrams: 8100 },
  { stage: 'complete', ageRangeLabel: '12~15개월', dailyServings: 3, dailyGrams: 330, monthlyGrams: 9900 },
];
// 6개월(초기~완료기 일부) 총 소비량 시뮬레이션 기준에 사용
```

---

## 7. 6개월 누적 비용 시뮬레이션 데이터

단계별 소비량 × 100g당 단가로 계산한 6개월(초기~완료기 진입) 누적 비용 추정:

| 옵션 | 100g 단가(추정, 평균) | 6개월 누적비용(추정) |
|-----|------------------|----------------|
| 홈메이드 이유식 (재료비만) | 약 1,900원 | 약 350,000원 |
| 마이리틀쉐프 | 6,000원 | 약 1,105,000원 |
| 베이비본 | 6,250원 | 약 1,151,000원 |
| 잇마플 | 6,500원 | 약 1,197,000원 |
| 헬로네이처 이유식 | 8,250원 | 약 1,519,000원 |
| 베베쿡 | 7,500원 | 약 1,381,000원 |
| 오가닉스타트 | 9,250원 | 약 1,703,000원 |

> 모든 수치는 추정값이며 실제 구매가·소비량과 다를 수 있습니다.
> 홈메이드와 가장 비싼 오가닉스타트의 차이: 약 135만 원 (시간 비용 미포함).

---

## 8. 시간 비용 데이터 (섹션 ⑦)

```ts
export const TIME_COST_SCENARIOS: TimeCostRow[] = [
  {
    scenario: '배치 조리 (주 1회, 3~4시간)',
    weeklyMinutes: 210,
    monthlyMinutes: 900,
    monthlyTimeCostKrw: 108000, // 2026년 최저시급(약 12,000원/시간 가정) 기준 추정
  },
  {
    scenario: '배치 조리 (주 2회, 각 2시간)',
    weeklyMinutes: 240,
    monthlyMinutes: 1030,
    monthlyTimeCostKrw: 123600,
  },
  {
    scenario: '매일 소량 조리 (1일 30분)',
    weeklyMinutes: 210,
    monthlyMinutes: 900,
    monthlyTimeCostKrw: 108000,
  },
];
```

- 시급 가정은 2026년 최저시급 기준으로 명시하고 `추정` 레이블 필수.
- "재료비(약 35만 원) + 시간 비용(약 65만~75만 원, 6개월) = 실질 비용 약 100만~110만 원"으로 환산해, 시판 저가 옵션(마이리틀쉐프 약 110만 원)과 큰 차이가 없을 수 있다는 인사이트 제시.

---

## 9. 조리도구 데이터 (섹션 ③)

```ts
export const COOKING_TOOLS: CookingToolItem[] = [
  { name: '이유식 찜기/조리기', price: 89000, necessity: 'essential', affiliateUrl: '' },
  { name: '핸드블렌더', price: 39000, necessity: 'essential', affiliateUrl: '' },
  { name: '소분 용기/큐브 트레이 세트', price: 15000, necessity: 'essential', affiliateUrl: '' },
  { name: '이유식 전자레인지 찜기', price: 25000, necessity: 'optional', affiliateUrl: '' },
];
// 초기 구매비 합계(필수 항목 기준): 약 143,000원 (추정)
```

---

## 10. 정기배송 혜택 데이터

```ts
export const SUBSCRIPTION_BENEFITS: SubscriptionBenefit[] = [
  { brand: '베베쿡', discountRate: '최대 10%', condition: '정기배송 설정 시 자동 적용', monthlySaving: 13800, affiliateUrl: '' },
  { brand: '잇마플', discountRate: '최대 8%', condition: '정기배송 4주 이상 유지 시', monthlySaving: 9300, affiliateUrl: '' },
  { brand: '오가닉스타트', discountRate: '최대 12%', condition: '정기배송 설정 시 자동 적용', monthlySaving: 20400, affiliateUrl: '' },
];
```

---

## 11. 페이지 IA

1. **Hero** — 제목: "2026 이유식 직접 만들기 vs 시판 이유식 실비용 완전 비교", 부제: "베베쿡·잇마플·오가닉스타트 등 6개 브랜드와 직접 만들기를 단가·6개월 누적 비용·시간 비용 기준으로 비교합니다"
2. **InfoNotice** — "이 리포트의 가격·시간 데이터는 2026년 기준 추정값이며 실제와 다를 수 있습니다. 구매 전 각 판매처에서 최신 가격을 확인하세요."
3. **TrustPanel** — 기준일: 2026-06, 참고 출처 표기
4. **핵심 요약 카드 (4개)**
5. **섹션 ① 이유식 선택이 왜 고민거리인가**
6. **섹션 ② 이유식 단계별 기준 (초기·중기·후기·완료기)**
7. **섹션 ③ 직접 만들기 비용 구조** — 재료비 + 조리도구 표
8. **섹션 ④ 시판 이유식 브랜드별 가격 비교표** ← 핵심, 제휴 링크 삽입
9. **섹션 ⑤ 단계별 월 비용 환산표 + 라인 차트**
10. **섹션 ⑥ 6개월 누적 비용 시뮬레이션 막대 차트**
11. **섹션 ⑦ 시간 비용까지 포함한 진짜 비교** — 그룹 막대 차트
12. **섹션 ⑧ 유기농·프리미엄 vs 일반 시판 가성비 비교**
13. **섹션 ⑨ 정기배송 할인 혜택 정리** ← 제휴 링크 삽입
14. **섹션 ⑩ 혼합 방식(직접+시판 병행) 비용 시나리오**
15. **섹션 ⑪ 이유식 시작·전환 시 주의사항**
16. **섹션 ⑫ 소비자 실구매 후기 요약**
17. **섹션 ⑬ 관련 계산기·콘텐츠 안내 CTA**
18. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 12. 핵심 요약 카드 (4개)

| 카드 제목 | 내용 |
|----------|------|
| 가장 저렴한 옵션 | 홈메이드 이유식(재료비만) — 6개월 약 35만 원 (추정, 시간 비용 미포함) |
| 시판 중 최저가 | 마이리틀쉐프 — 6개월 약 110만 원 (정기배송 기준, 추정) |
| 시간 비용 포함 시 | 홈메이드 실질 비용 약 100만~110만 원 — 시판 저가 옵션과 비슷 (추정) |
| 절약 팁 | 베베쿡 정기배송 10% 할인 적용 시 6개월 약 8만 원 절감 (추정) |

---

## 13. 브랜드별 가격 비교표 설계 (섹션 ④)

```html
<!-- 가로 스크롤 래퍼 필수 (모바일 대응) -->
<div class="bfd-table-wrap">
  <table class="bfd-compare-table">
    <thead>
      <tr>
        <th>옵션</th>
        <th>단계</th>
        <th>1회분 용량</th>
        <th>정가</th>
        <th>정기배송가</th>
        <th>100g 단가</th>
        <th>구매</th>  <!-- 제휴 링크 버튼, 홈메이드는 비활성 -->
      </tr>
    </thead>
    <tbody>
      <!-- 옵션 × 단계 행 반복 -->
      <!-- 100g 단가 최저 셀: class="bfd-lowest" (그린 하이라이트) -->
      <!-- 구매 버튼: <a class="bfd-buy-btn" href="{coupaUrl}">쿠팡 보기</a> -->
      <!-- 홈메이드 행: 구매 버튼 대신 "재료 직접 구매" 텍스트 -->
    </tbody>
  </table>
</div>
```

- 옵션 그룹별 `rowspan` 처리로 옵션명 셀 병합
- `추정` 배지를 가격 헤더 옆에 표시
- 100g 단가 최저값 셀: `bfd-lowest` 클래스 → 그린 폰트 + 굵기 (홈메이드가 항상 최저이므로 비교 기준선으로 안내)
- "쿠팡 보기" 버튼: 쿠팡 파트너스 링크, `target="_blank" rel="noopener sponsored"`

---

## 14. 단계별 월 비용 환산 차트 (섹션 ⑤)

- Chart.js Line 차트
- X축: 초기·중기·후기·완료기 (4단계)
- Y축: 월 비용 (원, 천 원 단위)
- 3선 표시: 홈메이드(저가), 마이리틀쉐프(시판 저가), 오가닉스타트(시판 고가)
- 단계가 진행될수록 소비량 증가 → 월 비용 상승 흐름 표현
- 범례 하단에 "전체 옵션 비교는 아래 표를 참고하세요" 안내

---

## 15. 6개월 누적 비용 차트 (섹션 ⑥)

- Chart.js Horizontal Bar 차트 (가로 막대)
- 7개 옵션(홈메이드 + 브랜드 6개) × 누적 비용
- 홈메이드 기준 바(Bar) 강조 (초록)
- 우측 끝에 금액 레이블 표시
- 차트 하단: "시간 비용까지 포함한 비교는 아래에서 확인하세요" → 섹션 ⑦ 앵커 링크

---

## 16. 시간 비용 비교 차트 (섹션 ⑦)

- Chart.js Grouped Bar 차트
- X축: 홈메이드(재료비만) vs 홈메이드(재료비+시간 비용) vs 시판 저가 vs 시판 고가
- Y축: 6개월 비용 (원)
- 시간 비용 포함 시 홈메이드 막대가 늘어나며 시판 저가 옵션과 격차가 줄어드는 것을 시각적으로 강조
- 차트 하단: "맞벌이 가정이라면 시간 비용까지 고려해 선택하세요" 안내 문구

---

## 17. 스타일 설계

```scss
.bfd-page {

  .bfd-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .bfd-option-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1000px) { grid-template-columns: repeat(3, 1fr); }

    .bfd-option-card {
      border: 1px solid #e8ede9;
      border-radius: 12px;
      padding: 16px;

      .bfd-option-name { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
      .bfd-option-tag {
        display: inline-block;
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 10px;
        margin-bottom: 8px;
        &--homemade { background: #e1f5ee; color: #065f46; }
        &--standard { background: #eef2ff; color: #3730a3; }
        &--organic  { background: #fef3c7; color: #92400e; }
        &--premium  { background: #fee2e2; color: #991b1b; }
      }
      .bfd-option-pros { font-size: 0.83rem; color: #374151; line-height: 1.7; }
    }
  }

  .bfd-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 16px;
  }

  .bfd-compare-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
      font-size: 0.86rem;
      white-space: nowrap;
    }
    th:first-child, td:first-child { text-align: left; }
    th { background: #f8fcfa; font-weight: 700; }

    td.bfd-lowest { color: #0f6e56; font-weight: 700; }
    td.bfd-highest { color: #b91c1c; }

    .bfd-buy-btn {
      display: inline-block;
      padding: 4px 10px;
      background: #ff6000;
      color: #fff;
      border-radius: 6px;
      font-size: 0.76rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      &:hover { opacity: 0.85; }
    }
  }

  .bfd-chart-wrap {
    position: relative;
    height: 260px;
    margin-top: 20px;
    @media (min-width: 760px) { height: 340px; }
  }

  .bfd-bar-chart-wrap {
    position: relative;
    height: 320px;
    margin-top: 20px;
    @media (min-width: 760px) { height: 400px; }
  }

  .bfd-tool-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    th, td {
      padding: 8px 10px;
      border-bottom: 1px solid #e8ede9;
      font-size: 0.86rem;
    }
    th { background: #f8fcfa; font-weight: 700; text-align: left; }
  }

  .bfd-subscription-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(2, 1fr); }

    .bfd-subscription-card {
      border: 1px solid #dce6e2;
      border-radius: 12px;
      padding: 16px;
      .bfd-sub-discount { font-size: 1.3rem; font-weight: 800; color: #0f6e56; }
      .bfd-sub-saving { font-size: 0.82rem; color: #6b7280; margin-top: 4px; }
      .bfd-sub-link {
        display: inline-block;
        margin-top: 10px;
        padding: 5px 14px;
        background: #ff6000;
        color: #fff;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }

  .bfd-caution-list {
    background: #fff8f0;
    border: 1px solid #fde8c8;
    border-radius: 12px;
    padding: 20px 24px;
    ol { margin: 0; padding-left: 1.4em; line-height: 2; }
    li { font-size: 0.9rem; color: #374151; }
  }
}
```

---

## 18. SEO 설계

```text
title: 이유식 비교 2026 | 직접 만들기 vs 베베쿡·잇마플 6개월 비용
description: 이유식을 직접 만들면 6개월에 얼마, 베베쿡·잇마플 등 시판 이유식을 쓰면 얼마인지 단계별로 비교했습니다. 시간 비용까지 반영한 진짜 비교, 정기배송 할인 정보까지 확인하세요.
H1: 2026 이유식 직접 만들기 vs 시판 이유식 실비용 완전 비교
```

JSON-LD: `Article` + `FAQPage`

키워드: 이유식 비교 2026, 베베쿡 잇마플 비교, 이유식 직접 만들기 비용, 시판 이유식 가격, 이유식 6개월 비용, 이유식 정기배송 할인

---

## 19. SeoContent 초안

### introTitle
`2026 이유식 직접 만들기 vs 시판 이유식 실비용 완전 비교 — 진짜 더 저렴한 쪽은 어디일까`

### intro (5문단)

1. 이유식을 시작하는 시점은 분유에서 한 단계 넘어가는 중요한 전환기이지만, 동시에 "직접 만들 것인가 시판 제품을 살 것인가"라는 새로운 비용 결정이 시작되는 시점이기도 합니다. 2026년 현재 국내에서 구할 수 있는 시판 냉동 이유식 브랜드는 베베쿡, 잇마플, 오가닉스타트, 마이리틀쉐프 등 6개 이상이며, 직접 만들기와 비교하면 6개월 기준 최대 135만 원까지 차이가 날 수 있습니다. (추정)

2. 단순히 재료비만 비교하면 직접 만들기가 압도적으로 저렴합니다. 그러나 직접 만들기에는 조리·소분·세척에 드는 시간이라는 숨겨진 비용이 있습니다. 이 리포트에서는 시급을 가정해 시간 비용을 환산하고, 재료비와 시간 비용을 합한 "실질 비용"을 기준으로 다시 비교합니다.

3. 시판 이유식도 브랜드별로 가격 차이가 큽니다. 같은 초기 단계 40g 1회분이라도 마이리틀쉐프는 약 2,800원, 오가닉스타트는 약 4,200원으로 1.5배 차이가 납니다. 정기배송 할인을 적용하면 브랜드별로 6~12% 추가 절감이 가능합니다.

4. 이유식 비용은 단계(초기·중기·후기·완료기)가 진행될수록 늘어납니다. 초기에는 하루 1회 40g이지만 완료기에는 하루 3회 330g까지 늘어나기 때문에, 단계별 소비량 변화를 반영한 6개월 누적 비용으로 비교하는 것이 더 정확합니다.

5. 이 리포트의 모든 가격·시간 데이터는 2026년 기준 추정값입니다. 실제 가격은 판매처·시기·할인 조건에 따라 달라질 수 있으므로 구매 전 반드시 최신 가격을 확인하세요. 직접 만들기와 시판 중 어느 쪽이 "더 나은 선택"인지는 절대적인 기준이 없으며, 가정의 시간 여유와 예산을 함께 고려해 선택하는 것이 중요합니다.

### FAQ (8개)

```ts
export const BFD_FAQ = [
  {
    question: "이유식을 직접 만드는 게 항상 더 저렴한가요?",
    answer: "재료비만 보면 직접 만들기가 더 저렴한 경우가 많습니다. 다만 조리·소분·세척에 드는 시간을 시급으로 환산하면 실질 비용이 시판 저가 브랜드와 비슷해지는 경우도 있습니다. 시간 여유와 가정 상황에 따라 선택하는 것이 좋습니다.",
  },
  {
    question: "베베쿡과 잇마플 중 어느 쪽이 더 나은가요?",
    answer: "두 브랜드 모두 식약처 기준을 충족하는 냉동 이유식입니다. 베베쿡은 메뉴 다양성과 브랜드 신뢰도가 높고, 잇마플은 가격이 더 저렴한 편입니다. 아기의 식성과 가정의 예산에 따라 선택하는 것을 권장합니다.",
  },
  {
    question: "이유식 정기배송 할인이 실제로 더 저렴한가요?",
    answer: "정기배송 할인(6~12%)을 적용하면 단건 구매 대비 저렴한 경우가 많습니다. 다만 정기배송은 메뉴 구성이 고정되거나 변경이 제한될 수 있으므로, 아기 취향을 먼저 확인한 뒤 신청하는 것을 권장합니다.",
  },
  {
    question: "이유식 조리도구를 사는 게 본전이 되나요?",
    answer: "6개월 이상 직접 만들기를 지속할 계획이라면 찜기·블렌더 등 초기 구매비(약 14만 원, 추정)는 재료비 절감으로 충분히 회수 가능한 경우가 많습니다. 단기간만 직접 만들 계획이라면 시판 이유식과 병행하는 것이 효율적일 수 있습니다.",
  },
  {
    question: "직접 만들기와 시판을 섞어서 써도 괜찮은가요?",
    answer: "가능합니다. 평일은 시판, 주말은 직접 만들기 등으로 병행하면 비용과 시간 부담을 모두 줄일 수 있습니다. 다만 알레르기 유발 식품은 새로 도입할 때 한 가지씩, 소량부터 시작하는 것이 안전합니다.",
  },
  {
    question: "이유식 단계(초기·중기·후기·완료기)는 언제 바뀌나요?",
    answer: "일반적으로 초기는 4~6개월, 중기는 7~9개월, 후기는 10~12개월, 완료기는 12개월 이후를 기준으로 합니다. 다만 아기의 발달 속도(앉기, 씹기 등)에 따라 차이가 있으므로 소아과 상담을 통해 시작·전환 시점을 결정하는 것이 좋습니다.",
  },
  {
    question: "유기농 이유식은 일반 시판 이유식보다 얼마나 비싸나요?",
    answer: "오가닉스타트 기준으로 보면 일반 시판 옵션(마이리틀쉐프)보다 약 1.5배 비쌉니다. 6개월 기준으로 유기농 이유식을 선택하면 일반 시판 대비 약 55만 원 추가 지출이 예상됩니다. (추정) 유기농 인증은 원료 생산 과정의 농약·항생제 기준이 엄격하다는 의미이며, 완성된 이유식의 영양 성분 차이는 크지 않다는 견해도 있습니다.",
  },
  {
    question: "6개월 이유식 비용을 가장 효과적으로 줄이는 방법은 무엇인가요?",
    answer: "① 직접 만들기 시 배치 조리로 시간 효율화 ② 시판 이용 시 정기배송 할인(최대 12%) 적용 ③ 평일 시판 + 주말 직접 만들기 등 혼합 방식 활용 ④ 가성비 시판 브랜드(마이리틀쉐프 등) 선택. 가정의 시간 여유에 따라 가장 효율적인 조합이 달라집니다.",
  },
];
```

---

## 20. 관련 링크

- `/reports/baby-formula-brand-cost-comparison-2026/` — 분유 비교 리포트, 출산~이유식 시퀀스 연결
- `/tools/diaper-cost/` — 기저귀 비용 계산기
- `/tools/breastfeeding-vs-formula-cost/` — 모유수유 vs 분유 비용 계산기
- `/reports/baby-cost-guide-first-year/` — 첫해 육아비용 총정리 리포트
- `/reports/baby-cost-2016-vs-2026/` — 육아비용 10년 변화 리포트

---

## 21. 등록 작업

```ts
// src/data/reports.ts 추가
{
  slug: 'baby-food-cost-comparison-2026',
  title: '이유식 비교 2026 | 직접 만들기 vs 베베쿡·잇마플 6개월 비용',
  description: '이유식을 직접 만들면 6개월에 얼마, 베베쿡·잇마플 등 시판 이유식을 쓰면 얼마인지 단계별로 비교합니다. 시간 비용까지 반영한 진짜 비교, 정기배송 할인 정보까지 포함합니다.',
  category: 'baby',
  order: ...,
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/baby-food-cost-comparison-2026/</loc>
</url>
```

---

## 22. QA 체크리스트

- [ ] 모든 가격·시간 데이터에 `추정` 레이블 또는 "2026년 기준" 표기
- [ ] 가격 비교표 가로 스크롤 정상 동작 (모바일 360px)
- [ ] 100g당 최저 단가 셀 그린 하이라이트 표시 (홈메이드 기준선 안내 포함)
- [ ] "쿠팡 보기" 버튼 — `rel="noopener sponsored"` 속성 포함, 홈메이드 행은 비활성 처리
- [ ] Chart.js 라인·막대·그룹막대 차트 정상 렌더링 및 범례 표시
- [ ] 핵심 요약 카드 4개 수치 계산 정확 (재료비만 vs 시간 비용 포함 비교)
- [ ] 정기배송 카드 월 절감액 추정값 `추정` 레이블
- [ ] FAQ 8개 `<details>` 접기/펼치기 정상
- [ ] 알레르기·소아과 상담 권고 면책 문구 InfoNotice + 섹션 ⑪·⑫ 내 명시
- [ ] 특정 브랜드 과장 추천 없이 상황별 분기로 표현
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
