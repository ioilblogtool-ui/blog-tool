# 서울 주요 구별 대환대출 갈아타기 손익 비교 2026 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/seoul-mortgage-refinancing-2026.md`
> 작성일: 2026-04-27
> 구현 기준: Codex가 이 문서만 보고 `/reports/` 리포트 페이지를 바로 구현할 수 있는 수준으로 고정
> 참고 문서: `mortgage-prepayment-penalty-design`, `seoul-housing-2016-vs-2026-design`, `home-purchase-fund`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `서울 주요 구별 대환대출 갈아타기 손익 비교 2026`
- 콘텐츠 유형: 데이터 리포트 + 계산기 유도형 콘텐츠 (`/reports/`)
- 권장 slug: `seoul-mortgage-refinancing-2026`
- URL: `/reports/seoul-mortgage-refinancing-2026/`
- 카테고리: 부동산
- 핵심 질문: `내 지역·대출잔액 기준으로 대환대출 갈아타기가 진짜 이득일까?`

### 1-2. 페이지 성격

- **서울 구별 주담대 대환 손익 리포트**: 강남, 강동, 서초, 성동, 송파, 양천, 마포, 노원, 영등포, 동작 등 주요 구의 추정 평균 대출잔액과 금리 차이에 따른 절감액을 비교한다.
- **핵심 메시지**: 대환대출은 금리만 낮다고 무조건 이득이 아니며, `이자 절감액 - 중도상환수수료 - 신규 부대비용 - DSR 한도 리스크`로 판단해야 한다.
- **차별점**: 은행별 금리 나열이 아니라 지역별 대출 규모와 수수료, DSR 재심사, 금리 유형 전환 리스크를 한 화면에서 보여준다.
- **목표 행동**: 중도상환수수료 계산기, 주담대 이자 계산기, 대환대출 손익 계산기로 이동하게 한다.

### 1-3. 권장 파일 구조

```txt
src/
  data/
    seoulMortgageRefinancing2026.ts
  pages/
    reports/
      seoul-mortgage-refinancing-2026.astro

public/
  scripts/
    seoul-mortgage-refinancing-2026.js
  og/
    reports/
      seoul-mortgage-refinancing-2026.png

src/styles/scss/pages/
  _seoul-mortgage-refinancing-2026.scss
```

### 1-4. 전제

- 실시간 은행 금리 조회는 하지 않는다.
- 구별 주담대 잔액은 공개 통계와 언론 보도 기반의 `참고 지표`로 다룬다.
- 구별 평균 대출잔액은 `대출잔액 ÷ 대출건수` 방식의 추정값으로 표기한다.
- 결과값은 항상 `예시 시뮬레이션`, `추정 평균`, `참고` 라벨을 붙인다.
- 대환 가능 여부는 실제 금융기관 심사, DSR, LTV, 소득, 신용점수, 기존 부채에 따라 달라진다고 반복 안내한다.
- 금융상품 추천처럼 보이지 않게 특정 은행 우열을 단정하지 않는다.

---

## 2. 구현 범위

### 2-1. MVP 포함

- 서울 주요 10개 구 비교표
- 구별 추정 평균 대출잔액, 기존 금리, 대환 금리, 금리 차이, 연간 이자 절감액
- 대환대출 순이익 공식 설명
- 중도상환수수료 면제 시점별 판단표
- 고정금리/변동금리/혼합형 전환 매트릭스
- 우대금리 조건 체크리스트
- DSR 재심사 체크리스트
- 성공/실패 사례 카드
- 갈아타기 적기 체크리스트
- 정책대출 전환 가능성 비교표
- FAQ 6개 이상
- 관련 계산기 CTA 3개 이상

### 2-2. MVP 제외

- 실시간 금융상품 금리 조회
- 사용자 개인 대출 조건 저장
- 은행별 실제 승인 가능성 판정
- DSR 정밀 계산
- LTV/DTI/DSR 통합 대출 한도 계산
- 특정 은행 상품 추천
- 제휴 링크 실연동

### 2-3. v2 확장

- 사용자가 잔액, 금리, 수수료, 부대비용을 넣는 미니 대환 손익 계산기
- 구별 필터와 정렬
- 금리 차이 0.3%p, 0.5%p, 1.0%p 시나리오 전환
- 중도상환수수료 면제일까지 기다리는 경우와 즉시 대환 비교

---

## 3. 현재 프로젝트 패턴 적용

### 3-1. `/reports/` 기본 흐름

1. `BaseLayout`
2. `CalculatorHero`
3. `InfoNotice`
4. 기준 요약 카드
5. KPI 카드
6. 구별 비교표
7. 손익 공식/시나리오
8. 리스크 체크리스트
9. 관련 계산기 CTA
10. `SeoContent` + FAQ

### 3-2. 참고할 구현 방향

- `seoul-housing-2016-vs-2026`
  - 서울 지역 리포트 톤앤매너
  - 지역 비교 카드/표
  - 추정값과 공식값 분리 안내
- `mortgage-prepayment-penalty`
  - 금융 계산 안내 문구
  - 중도상환수수료와 대환 관련 주의사항
  - 결과를 참고용 추정값으로 제한하는 방식
- `home-purchase-fund`
  - 대출 한도와 규제성 안내 문구
  - 부동산 계산기 CTA 연결 흐름

---

## 4. 데이터 설계

### 4-1. TypeScript 타입

```ts
export type RefinanceRiskLevel = "low" | "medium" | "high";

export interface SeoulRefinancingDistrict {
  district: string;
  loanCountLabel: string;
  totalLoanBalanceLabel: string;
  estimatedAverageBalance: number;
  currentRatePercent: number;
  refinanceRatePercent: number;
  rateGapPercentPoint: number;
  annualInterestSaving: number;
  threeYearGrossSaving: number;
  estimatedFeeAndCost: number;
  estimatedNetBenefit: number;
  riskLevel: RefinanceRiskLevel;
  note: string;
}

export interface RefinanceTimingRow {
  elapsedLabel: string;
  feeLevel: string;
  judgment: string;
  note: string;
}

export interface RateSwitchScenario {
  type: string;
  favorableWhen: string;
  unfavorableWhen: string;
  keyCheck: string;
}

export interface RefinanceCaseStudy {
  id: string;
  title: string;
  district: string;
  loanBalance: number;
  currentRatePercent: number;
  newRatePercent: number;
  penaltyCost: number;
  extraCost: number;
  annualSaving: number;
  judgment: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

### 4-2. 데이터 export

```ts
export const reportMeta = {
  slug: "seoul-mortgage-refinancing-2026",
  title: "서울 주요 구별 대환대출 갈아타기 손익 비교 2026",
  description:
    "서울 주요 10개 구의 추정 평균 주담대 잔액과 금리 차이를 기준으로 대환대출 갈아타기 시 이자 절감액, 중도상환수수료, 부대비용, DSR 리스크를 비교합니다.",
  baseLabel: "2026년 4월 기준, 공개 통계·보도 기반 참고 시뮬레이션",
};

export const districtRows: SeoulRefinancingDistrict[] = [];
export const timingRows: RefinanceTimingRow[] = [];
export const rateSwitchScenarios: RateSwitchScenario[] = [];
export const caseStudies: RefinanceCaseStudy[] = [];
export const faqItems: FaqItem[] = [];
export const relatedLinks = [];
```

### 4-3. 계산 규칙

```txt
연간 이자 절감액 = 대출잔액 × 금리 차이
3년 총 절감액 = 연간 이자 절감액 × 3
최종 순이익 = 3년 총 절감액 - 중도상환수수료 - 신규대출 부대비용
```

세부 기준:

- 금리는 percent 입력값으로 보관한다.
- 계산 시 `rateGapPercentPoint / 100`으로 변환한다.
- 기본 시나리오는 기존 금리 `4.8%`, 대환 금리 `3.9%`, 금리 차이 `0.9%p`를 사용한다.
- 수수료/부대비용은 데이터 행별 별도 추정값을 두거나, MVP에서는 `estimatedAverageBalance × 0.004 + 500000` 같은 단순 추정 공식을 쓴다.
- 이 공식은 화면에 직접 노출하지 않고 `중도상환수수료와 신규 부대비용은 실제 약정과 은행별 기준에 따라 달라집니다`라고 안내한다.

---

## 5. 페이지 IA

### 5-1. 전체 섹션

1. Hero
2. 기준 안내 `InfoNotice`
3. 상단 핵심 결론 카드
4. 서울 주요 구별 대환 절감액 비교표
5. 금리 차이별 절감 구조 설명
6. 대환대출 손익 공식
7. 중도상환수수료 면제 시점별 판단
8. 고정/변동/혼합형 전환 매트릭스
9. 우대금리 조건 체크리스트
10. DSR 재심사 리스크
11. 성공/실패 사례
12. 대환대출 적기 체크리스트
13. 정책대출 전환 가능성
14. 신청 절차
15. 관련 계산기 CTA
16. FAQ / SEO 본문

### 5-2. 모바일 우선 순서

Hero → 기준 안내 → 핵심 결론 → 구별 비교표 → 손익 공식 → 수수료 시점 → DSR 체크 → 사례 → CTA → FAQ

---

## 6. Astro 마크업 설계

### 6-1. frontmatter

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { withBase } from "../../utils/base";
import {
  reportMeta,
  districtRows,
  timingRows,
  rateSwitchScenarios,
  caseStudies,
  faqItems,
  relatedLinks,
} from "../../data/seoulMortgageRefinancing2026";

const pageData = JSON.stringify({ districtRows });
---
```

### 6-2. Hero

- eyebrow: `서울 주담대 대환 리포트`
- title: `서울 주요 구별 대환대출 갈아타기 손익 비교 2026`
- description: `서울 주요 구별 추정 평균 주담대 잔액과 금리 차이를 기준으로 이자 절감액, 중도상환수수료, 신규 부대비용, DSR 리스크를 함께 비교합니다.`
- badges: `["서울", "주담대", "대환대출", "추정"]`

### 6-3. InfoNotice

필수 문구:

- 이 페이지는 특정 금융상품 추천이 아니다.
- 구별 대출잔액은 공개 자료 기반 참고 지표이며 개인별 평균 주담대 잔액을 보장하지 않는다.
- 실제 대환 승인과 금리는 금융기관 심사 결과에 따라 달라진다.
- 대환대출은 DSR, LTV, 소득, 신용점수, 기존 부채를 다시 심사받을 수 있다.
- 중도상환수수료는 기존 대출 실행일과 약정 조건에 따라 달라진다.

### 6-4. 상단 KPI

카드 4개:

| 카드 | 내용 |
| --- | --- |
| 손익 공식 | 이자 절감액 - 수수료 - 부대비용 |
| 금리 차이 기준 | 0.5%p 미만은 비용 회수 기간 확인 |
| 잔액 효과 | 잔액이 클수록 같은 금리 차이의 절감액 증가 |
| 승인 리스크 | DSR·LTV·은행 총량관리 재심사 |

### 6-5. 구별 비교표

컬럼:

- 구
- 대출건수
- 대출잔액
- 건당 추정 잔액
- 기존 금리
- 대환 금리
- 금리 차이
- 연간 이자 절감액
- 3년 추정 순이익
- 판단 메모

모바일:

- `table`은 `overflow-x: auto`
- 대체로 `.smr-district-card` 카드 목록을 제공하는 방식 권장

### 6-6. 손익 공식 섹션

큰 수식 카드:

```txt
대환대출 순이익 = 기존 대출 이자비용 - 신규 대출 이자비용 - 중도상환수수료 - 신규대출 부대비용
```

예시 카드:

- 대출잔액 3억
- 기존 금리 4.8%
- 대환 금리 3.9%
- 연간 절감액 270만 원
- 3년 총 절감액 810만 원
- 수수료/부대비용 170만 원
- 최종 순이익 640만 원 추정

### 6-7. 중도상환수수료 시점별 판단

기획서의 5단계 표를 사용한다.

- 실행 6개월 후
- 실행 1년 후
- 실행 2년 후
- 실행 2년 9개월 후
- 실행 3년 후

각 행에 `판단` 배지를 붙인다.

### 6-8. 금리 유형 전환 매트릭스

전환 유형:

- 고정 → 변동
- 변동 → 고정
- 변동 → 혼합형
- 고정 → 고정

각 카드에는 유리한 상황, 불리한 상황, 핵심 체크를 넣는다.

### 6-9. DSR 체크리스트

체크리스트는 실제 체크 가능한 UI가 아니라 리포트형 리스트로 둔다.

- 최근 연소득이 줄지 않았는가
- 신용대출, 마이너스통장, 카드론이 늘지 않았는가
- 자동차 할부 등 기타 원리금 상환액이 있는가
- 배우자 공동소득 인정이 가능한가
- 대환 후 월 상환액이 실제로 줄어드는가
- 대출 만기 연장으로 총이자가 늘지 않는가

### 6-10. 사례 카드

성공 사례:

- 마포구, 잔액 2.5억, 금리 차이 1.2%p, 1년 안 비용 회수

실패 사례:

- 노원구, 잔액 1.2억, 금리 차이 0.4%p, 비용 회수 2년 이상

사례는 실제 사례처럼 단정하지 말고 `예시 시나리오`로 표시한다.

### 6-11. CTA

상단/중간/하단 CTA:

- `/tools/mortgage-prepayment-penalty/`  
  `갈아타기 전 중도상환수수료 먼저 계산하기`
- `/tools/mortgage-interest-calculator/`  
  `금리별 월 상환액 비교하기`
- `/tools/loan-refinance-calculator/`  
  `대환 후 총이득 계산하기`

아직 존재하지 않는 페이지는 구현 시 실제 라우트 확인 후 노출한다. 없는 페이지로 링크하지 않는다.

---

## 7. JavaScript 설계

### 7-1. 파일

`public/scripts/seoul-mortgage-refinancing-2026.js`

### 7-2. 역할

- 구별 비교표 정렬
- 금리 차이 시나리오 전환
- 절감액 카드 재계산
- URL 파라미터 유지

### 7-3. DOM id

```txt
smr-data
smr-rate-gap
smr-district-grid
smr-summary-cards
smr-benefit-chart
smr-sort-select
```

### 7-4. URL 파라미터

```txt
/reports/seoul-mortgage-refinancing-2026/?gap=0.9&sort=benefit
```

허용값:

- `gap`: `0.3`, `0.5`, `0.9`, `1.2`
- `sort`: `benefit`, `balance`, `district`

허용값 외에는 기본값 `gap=0.9`, `sort=benefit`로 되돌린다.

### 7-5. 차트

- Chart.js 사용 가능 시 막대 차트 렌더링
- x축: 구
- y축: 연간 이자 절감액
- 툴팁: 추정 평균 잔액, 금리 차이, 3년 순이익
- Chart.js 로드 실패 시 표와 카드가 기본 정보 전달

---

## 8. SCSS 설계

### 8-1. 파일

`src/styles/scss/pages/_seoul-mortgage-refinancing-2026.scss`

### 8-2. prefix

모든 클래스는 `smr-` prefix를 사용한다.

예:

```scss
.smr-page {}
.smr-kpi-grid {}
.smr-district-table {}
.smr-district-card {}
.smr-formula-card {}
.smr-risk-list {}
.smr-cta-band {}
```

### 8-3. 레이아웃

- 최대 본문 폭: `1120px`
- 카드 radius: `8px`
- 표는 desktop에서 넓게, mobile에서 카드형 보조 표시
- 금융 리포트라 색상은 차분하게 사용하되, 위험/주의/유리 판단은 배지로 구분
- 텍스트가 긴 체크리스트는 1열 또는 2열 grid

### 8-4. 반응형

- `640px` 이하:
  - KPI 1열
  - CTA 버튼 full width
  - 비교표는 스크롤 또는 카드형
- `820px` 이하:
  - 공식/예시 카드 세로 배치
  - 성공/실패 사례 세로 배치

---

## 9. SEO 설계

### 9-1. title

`서울 구별 대환대출 갈아타기 손익 비교 2026 | 강남·마포·노원 주담대 절감액`

### 9-2. description

`2026년 서울 주요 구별 추정 평균 주담대 잔액과 금리 차이를 기준으로 대환대출 갈아타기 시 이자 절감액, 중도상환수수료, 신규 부대비용, DSR 리스크를 비교합니다.`

### 9-3. H2 후보

- `서울 주요 구별 대환대출 절감액 비교`
- `대환대출 손익은 금리 차이만으로 결정되지 않습니다`
- `중도상환수수료 면제 시점별 갈아타기 판단`
- `고정금리와 변동금리, 어떤 방향으로 갈아탈까`
- `대환대출 신청 전 DSR 체크리스트`
- `대환대출이 유리한 조건과 불리한 조건`

### 9-4. FAQ

최소 6개:

1. 대환대출은 금리 차이가 몇 %p 이상이어야 이득인가요?
2. 중도상환수수료가 남아 있어도 갈아타는 게 좋을 수 있나요?
3. 대환대출도 DSR 심사를 다시 받나요?
4. 고정금리에서 변동금리로 갈아타도 괜찮나요?
5. 대출 갈아타기 전에 가장 먼저 확인할 것은 무엇인가요?
6. 서울 구별 대출잔액 비교는 공식 평균값인가요?
7. 2025년 1월 13일 이후 대출은 중도상환수수료가 어떻게 달라지나요?

---

## 10. 등록 체크리스트

- [ ] `src/data/seoulMortgageRefinancing2026.ts` 작성
- [ ] `src/pages/reports/seoul-mortgage-refinancing-2026.astro` 작성
- [ ] `public/scripts/seoul-mortgage-refinancing-2026.js` 작성
- [ ] `src/styles/scss/pages/_seoul-mortgage-refinancing-2026.scss` 작성
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/seoul-mortgage-refinancing-2026';` 추가
- [ ] `src/data/reports.ts`에 slug 등록
- [ ] `src/pages/reports/index.astro` 관련 리포트 노출 확인
- [ ] `public/sitemap.xml`에 URL 추가
- [ ] OG 이미지 생성 또는 fallback 확인
- [ ] `npm run build` 성공 확인

---

## 11. QA 체크리스트

- [ ] 대환대출을 특정 상품처럼 추천하는 문구가 없는가
- [ ] 모든 구별 잔액과 절감액이 `추정`, `참고`, `예시 시뮬레이션`으로 표시되는가
- [ ] 실제 승인 가능성은 DSR/LTV/소득/신용점수에 따라 달라진다고 안내하는가
- [ ] 중도상환수수료 개편 기준일과 기존 약정 확인 필요성을 안내하는가
- [ ] 금리 차이만 보고 갈아타면 안 된다는 메시지가 반복적으로 드러나는가
- [ ] 모바일 320px에서 표와 카드가 넘치지 않는가
- [ ] Chart.js가 실패해도 표로 정보가 전달되는가
- [ ] 없는 내부 링크를 CTA로 노출하지 않는가
- [ ] `npm run build`가 통과하는가

---

## 12. 구현 순서

1. 데이터 파일에 주요 10개 구 비교 데이터와 FAQ 작성
2. Astro 페이지에서 Hero, InfoNotice, KPI, 비교표, 공식, 체크리스트, CTA 구성
3. SCSS 전용 partial 작성
4. JS로 금리 차이 시나리오와 정렬 기능 연결
5. 리포트 등록 파일, sitemap, app.scss 반영
6. `npm run build`
7. 모바일/데스크톱 시각 확인

---

## 13. 최종 구현 방향

이 페이지는 `서울 구별 주담대 대환 손익 비교`라는 검색 의도를 받는 금융 리포트다. 핵심은 은행 금리를 나열하는 것이 아니라, 대출잔액 규모와 금리 차이가 실제 절감액으로 어떻게 바뀌는지 보여주는 것이다.

강남·서초처럼 잔액이 큰 지역은 같은 금리 차이에서도 절감액이 커질 수 있지만, 수수료와 DSR 재심사 리스크가 함께 커질 수 있다. 노원·마포처럼 잔액이 상대적으로 낮거나 중간인 지역은 금리 차이가 작으면 비용 회수 기간이 길어질 수 있다. 따라서 모든 결론은 `조건부 판단`으로 표현하고, 사용자가 자신의 잔액·수수료·신규 금리를 계산기로 직접 확인하도록 연결한다.
