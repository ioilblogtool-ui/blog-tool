# 아파트 관리비 적정성 계산기 설계 문서

> 기획 원문: `docs/plan/202606/apartment-maintenance-fee-calculator.md`  
> 작성일: 2026-06-19  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 대상 URL: `/tools/apartment-maintenance-fee-calculator/`  
> 구현 기준: 평수, 세대수, 난방방식, 계절, 관리비 항목을 입력하면 평당 관리비와 참고 구간 대비 판정을 계산한다.

---

## 1. 문서 개요

- 구현 대상: `아파트 관리비 적정성 계산기`
- 페이지 제목: `우리집 아파트 관리비 비싼 걸까? 평수별 관리비 비교 계산기`
- slug: `apartment-maintenance-fee-calculator`
- URL: `/tools/apartment-maintenance-fee-calculator/`
- 카테고리: 부동산 / 생활비
- 핵심 검색 의도:
  - `아파트 관리비 평균`
  - `관리비 많이 나옴`
  - `24평 관리비`
  - `32평 관리비`
  - `아파트 평당 관리비`
  - `공용관리비 평균`
- 핵심 출력:
  - 평당 총 관리비
  - 평균 대비 참고 판정: 낮음 / 보통 / 높음 / 매우 높음
  - 가장 큰 비용 항목
  - 공용관리비 비중
  - 전기·수도·난방·공용관리비 원인 분석
  - 에어컨 전기요금 계산기 CTA
- 안전 문구:
  - K-apt 등 공개자료를 참고하되, 이 페이지의 판정은 공식 진단이 아니라 `참고`/`추정`이다.
  - 단지별 실제 평균, 지역, 커뮤니티 시설, 주차비 포함 여부에 따라 관리비는 달라질 수 있다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    apartmentMaintenanceFeeCalculator.ts
    tools.ts
  pages/
    tools/
      apartment-maintenance-fee-calculator.astro
  styles/
    scss/
      pages/
        _apartment-maintenance-fee-calculator.scss
    app.scss

public/
  scripts/
    apartment-maintenance-fee-calculator.js
  sitemap.xml
```

등록 필수:

- `src/data/tools.ts`: 계산기 목록 등록
- `src/styles/app.scss`: `@use 'scss/pages/apartment-maintenance-fee-calculator';`
- `public/sitemap.xml`: `/tools/apartment-maintenance-fee-calculator/` URL 추가
- 구현 완료 후 최종 1회만 `npm run build`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반으로 구현한다.
- `calculatorId`: `apartment-maintenance-fee-calculator`
- `pageClass`: `amf-page`
- SCSS prefix: `amf-`
- 모바일 우선 배치:
  1. Hero
  2. InfoNotice
  3. 입력 패널
  4. 결과 KPI
  5. 원인 분석
  6. 평형별 참고 구간
  7. 내부 링크 CTA
  8. SeoContent

권장 뼈대:

```astro
<SimpleToolShell
  calculatorId="apartment-maintenance-fee-calculator"
  pageClass="amf-page"
>
```

---

## 4. 페이지 IA

1. Hero
   - H1: `아파트 관리비 적정성 계산기`
   - 설명: 평수, 세대수, 난방방식, 전기요금, 수도요금, 공용관리비로 우리집 관리비가 높은지 확인
2. InfoNotice
   - `참고 판정`, `추정`, `단지별 실제 평균과 다를 수 있음`
3. 입력 영역
   - 기본 정보: 평수, 세대수, 난방방식, 거주 인원, 계절
   - 관리비 항목: 총 관리비, 전기, 수도, 난방, 공용, 장기수선충당금, 기타
   - 선택 옵션: 단지 연식, 주차 대수, 커뮤니티 시설
4. 결과 KPI
   - 평당 총 관리비
   - 참고 판정
   - 가장 큰 항목
   - 공용관리비 비중
5. 항목별 원인 분석
6. 평형별 참고 구간 표
7. 세대수·난방방식·계절 해석
8. 에어컨 전기요금 계산기 CTA
9. SeoContent + FAQ + 관련 계산기

---

## 5. 데이터 모델

파일: `src/data/apartmentMaintenanceFeeCalculator.ts`

```ts
export type HeatingType = "individual" | "central" | "district";
export type SeasonType = "spring_fall" | "summer" | "winter";
export type HouseholdBand = "under_100" | "100_299" | "300_499" | "500_999" | "over_1000";
export type BuildingAgeBand = "under_5" | "5_10" | "10_20" | "20_plus";
export type JudgmentLevel = "low" | "normal" | "high" | "very_high";
export type SourceBadge = "공식" | "참고" | "추정";

export interface MaintenanceFeePreset {
  id: string;
  label: string;
  pyeong: number;
  householdBand: HouseholdBand;
  heatingType: HeatingType;
  residentCount: number;
  season: SeasonType;
  totalFee: number;
  electricityFee: number;
  waterFee: number;
  heatingFee: number;
  sharedFee: number;
  repairReserveFee: number;
  otherFee: number;
}

export interface FeeJudgmentBand {
  minPerPyeong: number;
  maxPerPyeong: number | null;
  level: JudgmentLevel;
  label: string;
  tone: "positive" | "neutral" | "warning" | "danger";
  message: string;
}

export interface FeeItemDefinition {
  id: "electricity" | "water" | "heating" | "shared" | "repairReserve" | "other";
  label: string;
  description: string;
  highRatioThreshold: number;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}
```

### 필수 export

```ts
export const AMF_META = {
  slug: "apartment-maintenance-fee-calculator",
  title: "아파트 관리비 적정성 계산기",
  seoTitle: "우리집 아파트 관리비 비싼 걸까? 평수별 관리비 비교 계산기 | 비교계산소",
  seoDescription:
    "평수, 세대수, 난방방식, 전기요금, 수도요금, 공용관리비를 입력하면 평당 관리비와 평균 대비 높음·보통·낮음 참고 구간을 계산합니다.",
  updatedAt: "2026-06-19",
  dataNote:
    "관리비 비교 결과는 K-apt 등 공개자료와 내부 참고 구간을 바탕으로 한 추정 판정입니다. 단지별 실제 평균, 계절, 시설, 주차비 포함 여부에 따라 달라질 수 있습니다.",
};

export const AMF_PRESETS: MaintenanceFeePreset[] = [];
export const AMF_JUDGMENT_BANDS: FeeJudgmentBand[] = [];
export const AMF_FEE_ITEMS: FeeItemDefinition[] = [];
export const AMF_FAQ: PageFaqItem[] = [];
export const AMF_RELATED_LINKS = [];
```

---

## 6. 기본 데이터

### 6-1. 평형 프리셋

| 라벨 | 평수 | 용도 |
| --- | ---: | --- |
| 18평 | 18 | 1~2인 소형 |
| 24평 | 24 | 검색 수요 핵심 |
| 32평 | 32 | 3~4인 가구 핵심 |
| 40평 | 40 | 중대형 |

### 6-2. 판정 구간

초기 구현 기준:

| 평당 총 관리비 | 판정 | tone | 표시 문구 |
| ---: | --- | --- | --- |
| 8,000원 미만 | 낮음 | positive | 같은 평형대 대비 낮은 편입니다. 빠진 항목이 없는지 확인하세요. |
| 8,000~12,000원 | 보통 | neutral | 일반적인 참고 구간에 가깝습니다. |
| 12,000~16,000원 | 높음 | warning | 같은 평형대 대비 높은 편일 수 있습니다. 항목별 비중을 확인하세요. |
| 16,000원 초과 | 매우 높음 | danger | 계절 요금, 공용관리비, 장기수선충당금, 커뮤니티 비용을 나눠 확인해야 합니다. |

이 구간은 공식 평균이 아니라 참고 구간이다. UI에서 `참고 판정` 배지를 붙인다.

### 6-3. 항목별 높은 비중 기준

| 항목 | 기준 | 해석 |
| --- | ---: | --- |
| 전기요금 | 총 관리비의 30% 이상 | 여름 냉방, 가전 사용량, 누진 구간 확인 |
| 수도요금 | 총 관리비의 12% 이상 | 거주 인원, 누수, 검침 기준 확인 |
| 난방비 | 총 관리비의 25% 이상 | 겨울, 중앙/지역난방 단가 확인 |
| 공용관리비 | 총 관리비의 35% 이상 | 세대수, 경비·청소, 승강기, 커뮤니티 시설 확인 |
| 장기수선충당금 | 총 관리비의 10% 이상 | 세입자는 정산 가능성 안내 |
| 기타 | 총 관리비의 15% 이상 | 주차, 커뮤니티, 음식물, 승강기 항목 확인 |

---

## 7. 계산 로직

### 7-1. 입력 단위

- 사용자는 만원 단위로 입력한다.
- 클라이언트 계산은 원 단위로 변환한다.
- 평수는 소수 입력을 허용하되 최소 5평, 최대 100평으로 제한한다.
- 총 관리비가 0이면 계산하지 않고 안내 문구를 표시한다.

### 7-2. 핵심 계산식

```text
평당 총 관리비 = 총 관리비 / 평수
평당 공용관리비 = 공용관리비 / 평수
전기요금 비중 = 전기요금 / 총 관리비
수도요금 비중 = 수도요금 / 총 관리비
난방비 비중 = 난방비 / 총 관리비
공용관리비 비중 = 공용관리비 / 총 관리비
장기수선충당금 비중 = 장기수선충당금 / 총 관리비
기타 항목 비중 = 기타 항목 / 총 관리비
항목 합계 = 전기 + 수도 + 난방 + 공용 + 장기수선 + 기타
미분류 금액 = 총 관리비 - 항목 합계
```

### 7-3. 판정 로직

```text
if perPyeongFee < 8000       => low
if 8000 <= perPyeongFee < 12000  => normal
if 12000 <= perPyeongFee < 16000 => high
if perPyeongFee >= 16000     => very_high
```

### 7-4. 보정 해석

판정 자체는 평당 총 관리비 기준으로 단순화한다. 다만 결과 문구에 보정 해석을 붙인다.

- 100세대 미만: `소규모 단지는 경비·청소·시설비가 세대별로 크게 나뉘어 공용관리비가 높아질 수 있습니다.`
- 1,000세대 이상: `대단지는 공용관리비가 낮아질 수 있지만 커뮤니티 시설 비용은 별도 확인이 필요합니다.`
- 여름: `전기요금 비중이 높다면 에어컨 사용량과 누진 구간을 확인하세요.`
- 겨울: `난방비 비중이 높다면 난방방식과 급탕비 포함 여부를 확인하세요.`
- 중앙/지역난방: `난방비가 고지서에 별도 또는 공용 항목으로 묶일 수 있습니다.`

### 7-5. 합계 불일치 처리

- `항목 합계`와 `총 관리비` 차이가 총 관리비의 10% 이하이면 `기타/미분류`로 자연스럽게 표시한다.
- 차이가 10%를 초과하면 결과 하단에 안내:
  - `입력한 항목 합계와 총 관리비 차이가 큽니다. 고지서의 주차비, 음식물, 승강기, 커뮤니티 비용이 빠졌는지 확인하세요.`

---

## 8. UI 상세 설계

### 8-1. 입력 패널

섹션 1: 기본 정보

- 평수 입력 + 프리셋 버튼
- 세대수 구간 select
- 난방방식 segmented control
- 거주 인원 stepper
- 계절 segmented control

섹션 2: 관리비 항목

- 총 관리비
- 전기요금
- 수도요금
- 난방비
- 공용관리비
- 장기수선충당금
- 기타 항목

섹션 3: 선택 옵션

- 단지 연식
- 주차 대수
- 커뮤니티 시설 toggle

### 8-2. 결과 KPI

| KPI | 표시 예시 |
| --- | --- |
| 평당 총 관리비 | `11,667원/평` |
| 참고 판정 | `보통` |
| 가장 큰 항목 | `공용관리비 32%` |
| 공용관리비 비중 | `32.1%` |

### 8-3. 원인 분석 카드

항목별 카드 구성:

- 항목명
- 금액
- 총액 대비 비중
- CSS bar
- 해석 문구
- 관련 CTA가 있으면 표시

전기요금 카드 CTA:

- label: `에어컨 전기요금 따로 계산하기`
- href: `/tools/aircon-electricity-cost/`

### 8-4. 평형별 참고 구간 표

동일 판정 기준을 평형별 금액으로 환산한다.

```text
보통 하한 = 평수 * 8,000
보통 상한 = 평수 * 12,000
높음 상한 = 평수 * 16,000
```

표 예시:

| 평형 | 보통 구간 | 높음 구간 | 매우 높음 |
| --- | ---: | ---: | ---: |
| 18평 | 14.4만~21.6만원 | 21.6만~28.8만원 | 28.8만원 초과 |
| 24평 | 19.2만~28.8만원 | 28.8만~38.4만원 | 38.4만원 초과 |
| 32평 | 25.6만~38.4만원 | 38.4만~51.2만원 | 51.2만원 초과 |
| 40평 | 32.0만~48.0만원 | 48.0만~64.0만원 | 64.0만원 초과 |

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/apartment-maintenance-fee-calculator.js`

패턴:

- IIFE 사용
- `data-*` 기반 DOM 참조
- 사용자 입력값은 숫자 파싱 후 범위 제한
- `textContent`만 사용
- URL state 지원
- 계산 버튼 없이 입력 즉시 결과 갱신

핵심 함수:

```js
function parseMoneyInput(value, fallback) {}
function parseNumberInput(value, fallback, min, max) {}
function getInputs() {}
function calcResult(input) {}
function judgePerPyeong(perPyeongFee) {}
function findLargestItem(items) {}
function buildInsightMessages(input, result) {}
function renderKpis(result) {}
function renderBreakdown(result) {}
function renderReferenceTable() {}
function syncUrlState(input) {}
function restoreUrlState() {}
```

URL 파라미터 후보:

```text
pyeong=24
households=500_999
heating=individual
season=summer
total=28
electricity=7
water=2
heatingFee=5
shared=9
repair=2
other=3
```

입력 제한:

| 항목 | 최소 | 최대 |
| --- | ---: | ---: |
| 평수 | 5 | 100 |
| 거주 인원 | 1 | 10 |
| 비용 입력 | 0만원 | 300만원 |

---

## 10. SCSS 설계

파일: `src/styles/scss/pages/_apartment-maintenance-fee-calculator.scss`

prefix: `amf-`

주요 클래스:

```text
amf-page
amf-input-grid
amf-preset-row
amf-segmented
amf-cost-grid
amf-kpi-grid
amf-kpi-card
amf-kpi-card--positive
amf-kpi-card--neutral
amf-kpi-card--warning
amf-kpi-card--danger
amf-breakdown-list
amf-breakdown-card
amf-breakdown-bar
amf-reference-table
amf-insight-card
amf-related-cta
```

반응형:

- 0~639px: 입력 1열, KPI 1열, 비용 카드 1열
- 640~1023px: 입력 2열, KPI 2열
- 1024px 이상: 좌측 입력 / 우측 결과 2컬럼 가능

색상:

- positive: green 계열
- neutral: slate/blue 계열
- warning: amber 계열
- danger: red 계열
- 전체 팔레트가 한 가지 색만 지배하지 않도록 결과 상태별 색을 분리한다.

---

## 11. Astro 페이지 설계

파일: `src/pages/tools/apartment-maintenance-fee-calculator.astro`

필수 import:

```astro
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  AMF_META,
  AMF_PRESETS,
  AMF_JUDGMENT_BANDS,
  AMF_FEE_ITEMS,
  AMF_FAQ,
  AMF_RELATED_LINKS,
} from "../../data/apartmentMaintenanceFeeCalculator";
```

필수 포함:

- JSON-LD FAQ
- `script type="application/json"`으로 데이터 전달
- `public/scripts/apartment-maintenance-fee-calculator.js` defer 로드
- InfoNotice에 `참고 판정`, `단지별 차이`, `공식 진단 아님` 안내
- SeoContent 4문단 이상

---

## 12. SeoContent 초안 방향

intro 4문단 구성:

1. 관리비가 여름·겨울에 특히 검색되는 이유
2. 평당 관리비와 항목별 비중으로 보는 계산 방식
3. 결과를 해석할 때 세대수, 난방방식, 계절을 함께 봐야 하는 이유
4. 공식 단지 조회가 아니라 참고 계산이라는 한계

필수 문구:

- `이 계산기는 단지별 공식 평균을 확정하지 않습니다.`
- `평균 대비 높음/보통/낮음은 참고 판정입니다.`
- `정확한 단지별 공개 관리비는 K-apt 공동주택관리정보시스템에서 확인해야 합니다.`

---

## 13. FAQ 데이터

최소 6개:

1. 아파트 관리비 평균은 어디서 확인하나요?
2. 24평 아파트 관리비는 얼마가 보통인가요?
3. 관리비가 많이 나오는 가장 흔한 이유는 무엇인가요?
4. 공용관리비는 어느 정도면 높은 편인가요?
5. 장기수선충당금도 관리비에 포함해서 봐야 하나요?
6. 전기요금이 높게 나오면 어떻게 확인하나요?
7. 중앙난방과 개별난방은 관리비 비교 기준이 다른가요?

---

## 14. 관련 링크

```ts
export const AMF_RELATED_LINKS = [
  { href: "/tools/aircon-electricity-cost/", label: "에어컨 전기요금 계산기" },
  { href: "/reports/single-household-living-cost-2026/", label: "2026 1인 가구 생활비 분석" },
  { href: "/reports/seoul-apartment-price-2026/", label: "2026 서울 구별 아파트 실거래가 분석" },
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 집값 2016 vs 2026 비교" },
];
```

---

## 15. QA 체크리스트

- [ ] 모든 판정에 `참고` 또는 `추정` 배지가 붙는가?
- [ ] `공식 평균`, `확정`, `정답`처럼 단정하는 문구가 없는가?
- [ ] 총 관리비가 0일 때 NaN이 나오지 않는가?
- [ ] 총 관리비와 항목 합계 차이가 큰 경우 안내가 나오는가?
- [ ] 평수 프리셋이 입력값을 즉시 바꾸는가?
- [ ] 세대수, 난방방식, 계절 해석 문구가 결과에 반영되는가?
- [ ] 전기요금 비중이 높을 때 에어컨 전기요금 계산기 CTA가 보이는가?
- [ ] 모바일 320px에서도 입력/결과 카드가 가로 overflow 없이 보이는가?
- [ ] URL state 복원 후 결과가 동일하게 계산되는가?
- [ ] `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 완료됐는가?
- [ ] 구현 완료 후 최종 1회 `npm run build`가 성공하는가?

---

## 16. 구현 순서

1. `src/data/apartmentMaintenanceFeeCalculator.ts` 작성
2. `src/pages/tools/apartment-maintenance-fee-calculator.astro` 작성
3. `public/scripts/apartment-maintenance-fee-calculator.js` 작성
4. `src/styles/scss/pages/_apartment-maintenance-fee-calculator.scss` 작성
5. `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. 빠른 정적 확인: 파일명, import, data id, script path 확인
7. 최종 1회 `npm run build`

---

## 17. 구현 리스크

- K-apt의 실제 단지별 데이터를 직접 조회하지 않으면 평균 판정은 참고 수준이다. 문구에서 이를 분명히 해야 한다.
- 수도요금은 지자체별 차이가 커서 전국 평균처럼 단정하면 위험하다.
- 관리비 고지서 항목명이 단지마다 다르므로 공용관리비 묶음 설명이 필요하다.
- 장기수선충당금은 세입자/집주인 정산 이슈가 있어 단순 비용으로만 해석하지 않게 안내한다.
- 여름·겨울 시즌성 문구가 너무 과하면 비시즌 검색에서 어색할 수 있으므로 계절 선택값에 따라 문구를 바꾼다.
