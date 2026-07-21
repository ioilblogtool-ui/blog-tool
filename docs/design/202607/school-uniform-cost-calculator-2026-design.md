# 중학교 교복비 계산기 2026 — 설계 문서

> 작성일: 2026-07-20  
> 유형: 계산기 (`/tools/`, `SimpleToolShell`)  
> 신규 슬러그: `school-uniform-cost-calculator-2026`  
> 신규 콘텐츠 포지션: 기존 `아이 사교육비 계산기`, `초등학교 입학 준비 비용 리포트`, `국제학교 학비 계산기`와 겹치지 않는 **중·고등학교 교복·체육복·생활복 첫 구매 비용 전용 계산기**

---

## 1. 배경 및 목적

2026년 5월 교육부와 정책브리핑 자료에 따르면, 정부는 전국 중·고등학교 교복비 전수조사 결과와 향후 계획을 공개했다. 2025학년도 기준 전국 중·고 5,687개교 중 95.6%(5,437개교)가 교복을 착용하고 있고, 교복 착용 학교 중 96.3%(5,236개교)는 학교주관 구매제도에 참여한다. 교복 유형은 `정장형+생활형` 혼용이 60.5%로 가장 많고, 정장형만 사용하는 학교가 26.0%, 생활형만 사용하는 학교가 13.5%다.

가격 차이도 크다. 교육부 전수조사 결과 평균 낙찰가는 정장형 265,753원, 생활형 152,877원으로 공개되었다. 품목 수는 평균 7개이지만 학교별로 최소 1개에서 최대 16개까지 차이가 있고, 정장형 동복 셔츠는 최소 1만 원에서 최대 17만 8,000원까지 벌어졌다. 이런 구조에서는 "우리 아이 중학교 교복비가 얼마인가"를 평균값 하나로 답하기 어렵다.

이 계산기는 학부모가 중학교·고등학교 입학 또는 전학 전, 학교 안내문에 적힌 품목별 단가와 구매 수량을 입력해 **첫 교복 구매 총액**을 계산하도록 돕는다. 동시에 교육부 전수조사 평균값을 프리셋으로 제공해 아직 학교별 단가를 모르는 사용자는 정장형·생활형·혼합형 예산을 빠르게 가늠할 수 있게 한다.

**목표**
- 교복 유형(정장형/생활형/혼합형)과 품목별 수량을 입력해 첫 구매 총액 계산
- 동복·하복·생활복·체육복·추가 셔츠/바지/치마를 분리해 실제 장바구니 구조 반영
- 교육부 전수조사 평균 낙찰가를 공식 기준 프리셋으로 제공
- 학교별 가격 편차가 크다는 점을 명확히 안내하고, 결과를 `추정`으로 표시
- 기존 교육비 클러스터(사교육비, 초등 입학준비, 교육급여)와 내부 링크 연결

---

## 2. 중복 방지 및 포지셔닝

### 2-1. 기존 콘텐츠와 역할 분리

| 구분 | 기존 콘텐츠 | 신규 계산기 |
|---|---|---|
| 초등 입학 준비 | `/reports/elementary-school-ready-cost-2026/` — 책가방·실내화·문구·체육복 등 초등 첫 준비물 | 중·고등학교 교복·생활복·체육복 구매 전용 |
| 사교육비 | `/tools/child-tutoring-cost-calculator/` — 학원비·과외비·교육비 월 지출 | 학교 지정 의류 첫 구매 비용 |
| 국제학교 학비 | `/tools/international-school-tuition-calculator-2026/` — 연간 학비·입학비 | 일반 중·고 교복비 |
| 교육급여/교육비 지원 | 다음 3번 후보 — 자격 판정·지원금 | 교복 구매 총액 및 지원금 차감 시뮬레이션 |

### 2-2. 만들지 않는 것

- 학교별 실제 교복 단가 검색 DB는 구현하지 않는다. 2026년 9월 이후 학교알리미 정보공시가 개선되면 2차로 검토한다.
- 특정 브랜드 추천, 최저가 쇼핑 링크, 제휴 링크는 1차 구현 범위에서 제외한다.
- 교육급여·교육비 지원 자격 판정은 이 페이지에서 하지 않는다. 결과 하단에서 교육급여 계산기로 연결한다.
- 초등 준비물 전체 계산은 기존 초등 입학 준비 리포트 영역으로 둔다.

---

## 3. 공식 데이터 기준

### 3-1. 확인한 공식/준공식 근거

| 항목 | 확인값 | 출처 |
|---|---:|---|
| 전수조사 대상 | 전국 중·고 5,687개교 | 정책브리핑, 교육부 |
| 교복 착용 학교 | 5,437개교, 95.6% | 정책브리핑 |
| 학교주관 구매 참여 학교 | 5,236개교, 96.3% | 정책브리핑 |
| 교복 유형 | 정장형 26.0%, 생활형 13.5%, 정장형+생활형 60.5% | 정책브리핑 |
| 품목 수 | 평균 7개, 최소 1개~최대 16개 | 정책브리핑 |
| 정장형 평균 낙찰가 | 265,753원 | 정책브리핑 |
| 생활형 평균 낙찰가 | 152,877원 | 정책브리핑 |
| 정장형 동복 셔츠 단가 범위 | 1만 원~17만 8,000원 | 정책브리핑 |
| 정장형 동복 바지 단가 범위 | 2만 원~9만 9,000원 | 정책브리핑 |
| 공개 예정 | 학교별 교복 운영 현황 2026년 6월, 정보공시 개선 2026년 9월 | 정책브리핑 |

### 3-2. 공식 링크

- 정책브리핑: `https://www.korea.kr/news/policyNewsView.do?newsId=148964847`
- 교육부 카드뉴스: `https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=340&boardSeq=106111&lev=0&m=020201&opType=N&page=4&s=moe`
- 교육부 초·중·고 교육 목록: `https://www.moe.go.kr/boardCnts/listRenew.do?boardID=316&m=0302&page=-41&s=moe&type=default`

### 3-3. 데이터 배지 원칙

| 배지 | 적용 대상 | 설명 |
|---|---|---|
| `공식` | 교육부 전수조사 평균 낙찰가, 교복 유형 비중, 품목 수 범위 | 공식·정부 공개자료 기반 |
| `입력값` | 사용자가 직접 입력한 학교별 품목 단가 | 학교 안내문·가정통신문 기준 |
| `추정` | 총액, 추가 구매비, 지원금 차감 후 부담액 | 구매 수량과 학교별 가격에 따라 달라짐 |
| `확인 필요` | 체육복·생활복·추가 품목 기본값 | 전국 공식 평균이 없거나 학교별 차이가 큼 |

---

## 4. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/schoolUniformCostCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/school-uniform-cost-calculator-2026.astro` |
| 스크립트 | `public/scripts/school-uniform-cost-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_school-uniform-cost-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 도구 라이브러리 매핑 | `src/pages/tools/index.astro` |
| 사이트맵 | `public/sitemap.xml` |
| 인바운드 CTA 수정 | `src/pages/reports/elementary-school-ready-cost-2026.astro`, `src/data/childTutoringCostCalculator.ts` 또는 관련 SeoContent |

---

## 5. URL 및 메타

```
슬러그: /tools/school-uniform-cost-calculator-2026/
타이틀(seoTitle): 중학교 교복비 계산기 2026 | 동복·하복·체육복 총액 바로 계산
디스크립션: 동복·하복·생활복·체육복 단가와 수량을 입력하면 중학교·고등학교 첫 교복 구매 총액을 계산합니다. 정장형·생활형 평균 낙찰가와 지원금 차감 후 부담액도 함께 확인하세요.
```

### SEO 타겟

| 키워드 | 검색 의도 | 대응 섹션 |
|---|---|---|
| 중학교 교복비 | 첫 구매 예산 확인 | Hero, 프리셋 |
| 중학교 교복 가격 | 평균/학교별 가격 확인 | 공식 평균 카드, 품목별 입력 |
| 교복비 계산기 | 직접 계산 | 메인 계산기 |
| 생활복 교복 가격 | 정장형 대비 차이 확인 | 유형 비교 카드 |
| 체육복 가격 | 추가 품목 예산 확인 | 체육복 입력 그룹 |
| 교복 지원금 | 지원금 차감 후 부담 확인 | 지원금 입력 필드 |
| 고등학교 교복비 | 중학교와 동일 구조로 계산 | 학교급 선택 |

---

## 6. 데이터 파일 설계

**`src/data/schoolUniformCostCalculator2026.ts`**

```ts
export type SucSchoolLevel = "middle" | "high";
export type SucUniformType = "formal" | "casual" | "mixed";
export type SucItemGroup = "winter" | "summer" | "pe" | "extra";
export type EvidenceBadge = "공식" | "입력값" | "추정" | "확인 필요";

export interface SucUniformItem {
  id: string;
  group: SucItemGroup;
  label: string;
  defaultUnitPrice: number;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  badge: EvidenceBadge;
  note?: string;
}

export interface SucPreset {
  id: SucUniformType;
  label: string;
  description: string;
  averageBidPrice: number;
  badge: EvidenceBadge;
  itemOverrides?: Partial<Record<string, { unitPrice?: number; quantity?: number }>>;
}

export interface SucSource {
  label: string;
  url: string;
  badge: EvidenceBadge;
}

export interface SucFaqItem {
  question: string;
  answer: string;
}

export interface SucRelatedLink {
  href: string;
  label: string;
  description?: string;
}

export const SUC_META = {
  slug: "school-uniform-cost-calculator-2026",
  title: "중학교 교복비 계산기 2026",
  seoTitle: "중학교 교복비 계산기 2026 | 동복·하복·체육복 총액 바로 계산",
  seoDescription:
    "동복·하복·생활복·체육복 단가와 수량을 입력하면 중학교·고등학교 첫 교복 구매 총액을 계산합니다. 정장형·생활형 평균 낙찰가와 지원금 차감 후 부담액도 함께 확인하세요.",
  updatedAt: "2026-07-20",
  dataNote:
    "정장형·생활형 평균 낙찰가는 교육부 2025학년도 교복비 전수조사 공개자료 기준입니다. 체육복·추가 셔츠·생활복 세부 단가는 학교별 차이가 커서 기본값은 참고값이며, 실제 계산은 학교 안내문 단가를 직접 입력하는 방식으로 설계합니다.",
};

export const SUC_OFFICIAL_AVERAGES = {
  surveyYear: "2025학년도",
  publishedYear: 2026,
  surveyedSchools: 5_687,
  uniformSchools: 5_437,
  uniformSchoolRatio: 0.956,
  schoolPurchaseSchools: 5_236,
  schoolPurchaseRatio: 0.963,
  formalAverageBidPrice: 265_753,
  casualAverageBidPrice: 152_877,
  mixedSchoolRatio: 0.605,
  formalOnlyRatio: 0.26,
  casualOnlyRatio: 0.135,
  averageItemCount: 7,
  minItemCount: 1,
  maxItemCount: 16,
  formalWinterShirtMin: 10_000,
  formalWinterShirtMax: 178_000,
  formalWinterPantsMin: 20_000,
  formalWinterPantsMax: 99_000,
};

export const SUC_PRESETS: SucPreset[] = [
  {
    id: "formal",
    label: "정장형 교복",
    description: "동복 재킷·셔츠·하의 중심의 전통형 교복",
    averageBidPrice: 265_753,
    badge: "공식",
  },
  {
    id: "casual",
    label: "생활형 교복",
    description: "생활복·카라티·편한 하의 중심의 교복",
    averageBidPrice: 152_877,
    badge: "공식",
  },
  {
    id: "mixed",
    label: "정장형+생활형 혼합",
    description: "동복 정장형에 생활복·체육복을 함께 구매하는 구조",
    averageBidPrice: 265_753 + 152_877,
    badge: "추정",
  },
];
```

### 6-1. 기본 품목 데이터

정확한 전국 품목별 평균 단가가 모두 공개되어 있지 않으므로, 기본값은 **사용자 입력용 참고값**으로 둔다. 정장형 동복 셔츠·바지는 공개 범위의 중간값이 아니라 보수적인 예산용 기본값으로 잡고, 반드시 `확인 필요` 또는 `입력값` 배지를 표시한다.

```ts
export const SUC_DEFAULT_ITEMS: SucUniformItem[] = [
  // 동복
  { id: "winter-jacket", group: "winter", label: "동복 재킷", defaultUnitPrice: 90_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 3, badge: "확인 필요" },
  { id: "winter-shirt", group: "winter", label: "동복 셔츠·블라우스", defaultUnitPrice: 45_000, defaultQuantity: 2, minQuantity: 0, maxQuantity: 5, badge: "확인 필요", note: "교육부 조사에서 정장형 동복 셔츠는 학교별 1만~17만8천 원 편차가 확인되었습니다." },
  { id: "winter-bottom", group: "winter", label: "동복 바지·치마", defaultUnitPrice: 65_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 4, badge: "확인 필요", note: "교육부 조사에서 정장형 동복 바지는 학교별 2만~9만9천 원 편차가 확인되었습니다." },
  { id: "knit-vest", group: "winter", label: "조끼·니트", defaultUnitPrice: 45_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 3, badge: "확인 필요" },

  // 하복·생활복
  { id: "summer-shirt", group: "summer", label: "하복 상의", defaultUnitPrice: 43_000, defaultQuantity: 2, minQuantity: 0, maxQuantity: 5, badge: "확인 필요" },
  { id: "summer-bottom", group: "summer", label: "하복 바지·치마", defaultUnitPrice: 50_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 4, badge: "확인 필요" },
  { id: "casual-top", group: "summer", label: "생활복 상의", defaultUnitPrice: 40_000, defaultQuantity: 2, minQuantity: 0, maxQuantity: 5, badge: "확인 필요" },
  { id: "casual-bottom", group: "summer", label: "생활복 하의", defaultUnitPrice: 45_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 4, badge: "확인 필요" },

  // 체육복
  { id: "pe-winter", group: "pe", label: "동복 체육복 세트", defaultUnitPrice: 70_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 3, badge: "확인 필요" },
  { id: "pe-summer", group: "pe", label: "하복 체육복 세트", defaultUnitPrice: 50_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 3, badge: "확인 필요" },

  // 추가 구매
  { id: "extra-shirt", group: "extra", label: "추가 셔츠·생활복 상의", defaultUnitPrice: 40_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 6, badge: "입력값" },
  { id: "name-tag", group: "extra", label: "명찰·마크·수선비", defaultUnitPrice: 10_000, defaultQuantity: 1, minQuantity: 0, maxQuantity: 5, badge: "입력값" },
];
```

### 6-2. 지원금 필드

지자체·교육청별 교복 지원금은 지역마다 다르고 지급 방식도 현물·현금·바우처가 섞인다. 1차 구현에서는 별도 자격 판정 없이 사용자가 직접 입력한다.

```ts
export const SUC_DEFAULT_SUPPORT = {
  enabled: true,
  amount: 300_000,
  note:
    "교복 지원금은 시도교육청·지자체·학교별로 다를 수 있습니다. 실제 지원 금액은 학교 안내문 또는 교육청 공지를 확인하세요.",
};
```

---

## 7. 계산 로직

### 7-1. 핵심 산식

```ts
itemTotal = unitPrice * quantity
groupTotal(group) = sum(itemTotal where item.group === group)
uniformSubtotal = sum(all itemTotal)
supportApplied = supportEnabled ? min(supportAmount, uniformSubtotal) : 0
outOfPocket = uniformSubtotal - supportApplied
extraRiskBudget = extraRatio > 0 ? uniformSubtotal * extraRatio : 0
firstYearBudget = outOfPocket + extraRiskBudget
```

### 7-2. 구매 시나리오

| 시나리오 | 설명 | 기본 설정 |
|---|---|---|
| 최소 구매 | 필수 세트 위주, 추가 셔츠 없음 | 동복/하복 각 1개 중심 |
| 표준 구매 | 빨래·교체를 고려해 상의 2벌 | 기본값 |
| 여유 구매 | 셔츠·생활복·체육복 추가 | 추가 상의 2~3벌 |

```ts
export type SucScenario = "minimum" | "standard" | "comfortable";

export const SUC_SCENARIO_MULTIPLIERS = {
  minimum: { extraTopQuantity: 0, extraRiskRatio: 0 },
  standard: { extraTopQuantity: 1, extraRiskRatio: 0.05 },
  comfortable: { extraTopQuantity: 2, extraRiskRatio: 0.1 },
};
```

### 7-3. 평균 대비 판정

공식 평균 낙찰가와 사용자의 총액을 단순 비교한다. 혼합형은 정장형+생활형 평균을 더한 값을 기준으로 두되, 이 값은 실제 혼합형 평균이 아니라 **보수적 추정 기준선**이므로 `추정` 배지를 붙인다.

```ts
ratioToAverage = uniformSubtotal / selectedPreset.averageBidPrice

if (ratioToAverage < 0.85) level = "평균보다 낮음";
else if (ratioToAverage <= 1.15) level = "평균권";
else if (ratioToAverage <= 1.5) level = "높은 편";
else level = "매우 높은 편";
```

주의: 품목 구성 차이가 크므로 이 판정은 절대적인 비싼/싼 평가가 아니라 "선택한 프리셋 평균 대비 참고"로만 표시한다.

---

## 8. UX 설계

### 8-1. 페이지 구조

1. Hero
   - H1: `중학교 교복비 계산기 2026`
   - 설명: `동복·하복·생활복·체육복 단가와 수량을 입력하면 첫 교복 구매 총액을 계산합니다.`
   - Hero stats:
     - `정장형 평균 26.6만`
     - `생활형 평균 15.3만`
     - `품목 수 1~16개`

2. InfoNotice
   - 교육부 전수조사 평균 낙찰가 기준
   - 학교별 품목 수·단가 편차 큼
   - 실제 단가는 학교 안내문으로 수정 입력 권장

3. 입력 패널
   - 학교급: 중학교/고등학교
   - 교복 유형: 정장형/생활형/혼합형
   - 구매 시나리오: 최소/표준/여유
   - 품목별 단가·수량 편집
   - 지원금 입력

4. 결과 패널
   - 첫 구매 총액
   - 지원금 차감 후 부담액
   - 동복/하복/체육복/추가 구매 그룹별 합계
   - 평균 대비 판정
   - 추가 구매 위험 예산

5. 비교/안내
   - 정장형 vs 생활형 공식 평균 비교
   - 학교 안내문에서 확인할 항목 체크리스트
   - 교육급여·교육비 지원 연결 CTA

6. SEO 콘텐츠
   - 5단락 이상 intro
   - FAQ 7개 이상
   - 관련 도구 링크

### 8-2. 입력 상세

| 항목 | UI | 기본값 | 검증 |
|---|---|---|---|
| 학교급 | segmented control | 중학교 | `middle`, `high` allowlist |
| 교복 유형 | segmented control | 혼합형 | `formal`, `casual`, `mixed` allowlist |
| 구매 시나리오 | segmented control | 표준 구매 | `minimum`, `standard`, `comfortable` allowlist |
| 품목 단가 | numeric input | 품목별 기본값 | 0~300,000 |
| 품목 수량 | stepper | 품목별 기본값 | 0~10 |
| 지원금 적용 | toggle | 켜짐 | boolean |
| 지원금 금액 | numeric input | 300,000 | 0~1,000,000 |
| 추가 구매 예산 | slider | 5% | 0~30% |

### 8-3. 결과 카드

| 카드 | 표시값 | 배지 |
|---|---|---|
| 첫 구매 총액 | `uniformSubtotal` | 추정 |
| 지원금 차감 후 부담 | `outOfPocket` | 추정 |
| 추가 구매 예산 | `extraRiskBudget` | 추정 |
| 1년차 예산 | `firstYearBudget` | 추정 |
| 평균 대비 | `level`, `ratioToAverage` | 공식 평균 대비 |

### 8-4. 체크리스트

결과 하단에 "학교 안내문에서 확인할 것" 체크리스트를 둔다.

- 동복·하복을 모두 한 번에 구매하는지
- 생활복이 필수인지 선택인지
- 체육복이 교복 구매처와 같은지
- 셔츠·생활복 상의를 추가 구매해야 하는지
- 명찰·마크·수선비가 별도인지
- 교복 지원금이 현금인지 바우처인지
- 전학·중도 구매 시 단가가 같은지

---

## 9. 스크립트 설계

**`public/scripts/school-uniform-cost-calculator-2026.js`**

### 9-1. 패턴

- IIFE 패턴
- `data-suc-input`, `data-suc-result`, `data-suc-preset`, `data-suc-item` 기반 DOM 조작
- `textContent`만 사용
- URL state 유지
- 숫자 입력 콤마 포맷
- 품목 행 추가/삭제는 1차 구현에서 제외하고, 기본 품목의 수량을 0으로 만드는 방식으로 처리

### 9-2. 상태 구조

```js
const state = {
  schoolLevel: "middle",
  uniformType: "mixed",
  scenario: "standard",
  supportEnabled: true,
  supportAmount: 300000,
  extraRiskRatio: 0.05,
  items: {
    "winter-jacket": { unitPrice: 90000, quantity: 1 },
    "winter-shirt": { unitPrice: 45000, quantity: 2 },
    "winter-bottom": { unitPrice: 65000, quantity: 1 },
    // ...
  },
};
```

### 9-3. URL 파라미터

| 파라미터 | 의미 | 예시 |
|---|---|---|
| `level` | 학교급 | `middle` |
| `type` | 교복 유형 | `mixed` |
| `scenario` | 구매 시나리오 | `standard` |
| `support` | 지원금 | `300000` |
| `extra` | 추가 구매 예산 비율 | `5` |
| `items` | 품목별 압축 상태 | `winter-shirt:45000x2,...` |

`items` 파라미터는 너무 길어질 수 있으므로 1차 구현에서는 선택 사항이다. 기본은 핵심 옵션과 지원금만 URL에 저장하고, 품목별 상세값은 공유 링크에서 생략해도 된다. 구현 시간이 충분하면 짧은 key 기반 압축을 적용한다.

### 9-4. 복사 문구

> 중학교 혼합형 교복 표준 구매 기준 첫 구매 총액은 약 X원, 지원금 차감 후 부담액은 약 Y원으로 추정됩니다.

---

## 10. Astro 페이지 설계

**`src/pages/tools/school-uniform-cost-calculator-2026.astro`**

### 10-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  SUC_META,
  SUC_OFFICIAL_AVERAGES,
  SUC_PRESETS,
  SUC_DEFAULT_ITEMS,
  SUC_FAQ,
  SUC_SEO_CONTENT,
  SUC_RELATED_LINKS,
  SUC_SOURCES,
} from "../../data/schoolUniformCostCalculator2026";
---
```

### 10-2. JSON-LD

```ts
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "중학교 교복비 계산기 2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: "ko-KR",
  isAccessibleForFree: true,
  url: `${siteUrl}/tools/school-uniform-cost-calculator-2026/`,
  description: SUC_META.seoDescription,
  provider: { "@type": "Organization", name: "비교계산소" },
  mainEntity: { "@type": "FAQPage", mainEntity: faqSchema }
}
```

### 10-3. 마크업 구조

- `SimpleToolShell calculatorId="school-uniform-cost-calculator-2026" pageClass="suc-page"`
- `CalculatorHero` hero
- `InfoNotice` 공식 데이터 안내
- `slot="aside"`에 입력 패널
- `slot="main"`에 결과, 비교표, 체크리스트
- `<Fragment slot="seo">` 안에 `SeoContent`

---

## 11. SCSS 설계

**`src/styles/scss/pages/_school-uniform-cost-calculator-2026.scss`**

### 11-1. prefix

모든 클래스는 `suc-` prefix를 사용한다.

```scss
.suc-page {}
.suc-type-tabs {}
.suc-scenario-grid {}
.suc-item-list {}
.suc-item-row {}
.suc-result-kpi {}
.suc-group-breakdown {}
.suc-average-card {}
.suc-checklist {}
```

### 11-2. 디자인 방향

- 교육비/입학 준비 주제이므로 차분하고 실용적인 톤.
- 과도한 경고색 대신 "예산 계획" 느낌의 neutral + green/blue 보조색.
- 품목별 입력 행은 모바일에서 카드형으로 전환.
- 결과 KPI는 첫 구매 총액과 실부담액을 가장 크게.
- 평균 대비 판정은 라벨 중심, 과도한 빨간색 사용 금지.

### 11-3. 반응형 기준

| 구간 | 처리 |
|---|---|
| 320~479px | 품목 행 카드형, KPI 1열, 프리셋 1~2열 |
| 480~767px | KPI 2열, 품목 행 2열 구조 |
| 768px 이상 | 입력/결과 2컬럼, 품목 표형 유지 |

---

## 12. SEO 콘텐츠 설계

### 12-1. `SUC_SEO_CONTENT`

```ts
export const SUC_SEO_CONTENT = {
  introTitle: "중학교 교복비는 평균보다 학교별 품목 구성이 더 중요합니다",
  intro: [
    "중학교 입학을 앞두면 책가방이나 학용품보다 먼저 눈에 들어오는 비용이 교복비입니다. 교복은 한 번만 사면 끝나는 것처럼 보이지만 실제로는 동복, 하복, 생활복, 체육복, 추가 셔츠, 명찰과 수선비까지 나뉘어 청구되는 경우가 많습니다. 학교마다 필수 품목과 선택 품목이 달라 같은 지역이라도 첫 구매 총액이 크게 달라질 수 있습니다.",
    "교육부가 공개한 2025학년도 교복비 전수조사에 따르면 전국 중·고등학교 대부분이 교복을 착용하고 있고, 정장형과 생활형을 함께 사용하는 학교가 가장 많았습니다. 평균 낙찰가는 정장형이 26만 원대, 생활형이 15만 원대였지만 품목 수는 학교별로 1개에서 16개까지 차이가 났습니다. 평균값만 보고 예산을 잡으면 실제 안내문을 받았을 때 금액이 달라질 수 있습니다.",
    "이 계산기는 학교 안내문에 적힌 품목별 단가와 수량을 직접 넣어 첫 교복 구매 총액을 계산하도록 설계했습니다. 아직 안내문을 받기 전이라면 정장형, 생활형, 혼합형 프리셋을 선택해 대략적인 예산을 먼저 확인할 수 있습니다. 결과에서는 동복, 하복·생활복, 체육복, 추가 구매 항목을 나누어 보여주기 때문에 어느 항목이 부담을 키우는지 확인하기 쉽습니다.",
    "교복 지원금이 있는 지역이라면 지원금 금액을 직접 입력해 실제 가계 부담액도 볼 수 있습니다. 다만 교복 지원은 시도교육청과 지자체별로 방식이 다르고, 현물 지원인지 현금·바우처 지원인지도 다를 수 있습니다. 계산기 결과는 예산 계획용 추정값이며 실제 지원 여부와 금액은 학교 안내문이나 교육청 공지를 확인해야 합니다.",
    "교복비를 줄이려면 전체 총액만 보지 말고 추가 구매 가능성이 높은 품목을 따로 봐야 합니다. 셔츠, 생활복 상의, 바지처럼 자주 세탁하거나 성장에 따라 다시 사기 쉬운 품목은 초기 구매 수량과 추가 구매 예산을 함께 잡는 편이 안전합니다. 첫 구매액이 낮아도 추가 구매 단가가 높으면 1년 전체 부담은 더 커질 수 있습니다.",
  ],
  inputPoints: [
    "정장형·생활형·혼합형 중 학교 교복 유형을 선택하면 공식 평균 낙찰가와 비교할 수 있습니다.",
    "동복·하복·생활복·체육복 단가와 수량을 직접 수정해 학교 안내문 기준 총액을 계산합니다.",
    "교복 지원금을 입력하면 지원금 차감 후 실제 부담액을 확인할 수 있습니다.",
  ],
  criteria: [
    "정장형 평균 낙찰가 265,753원, 생활형 평균 낙찰가 152,877원은 교육부 전수조사 공개자료 기준입니다.",
    "품목별 기본 단가는 학교별 차이가 커서 참고값이며, 실제 계산은 학교 안내문 단가 입력을 권장합니다.",
    "지원금은 지역별로 다르므로 자격 판정 없이 사용자가 직접 입력하는 방식입니다.",
    "계산 결과는 구매 예산 계획용 추정값이며 실제 결제 금액과 다를 수 있습니다.",
  ],
};
```

### 12-2. FAQ

최소 8개 제공.

```ts
export const SUC_FAQ: SucFaqItem[] = [
  {
    question: "중학교 교복비는 평균 얼마인가요?",
    answer: "교육부 전수조사 기준 정장형 교복 평균 낙찰가는 26만 5,753원, 생활형 교복 평균 낙찰가는 15만 2,877원입니다. 다만 학교별 품목 수와 단가 차이가 커서 실제 구매 총액은 달라질 수 있습니다.",
  },
  {
    question: "정장형 교복과 생활형 교복은 가격 차이가 큰가요?",
    answer: "공개된 평균 낙찰가 기준으로는 정장형이 생활형보다 약 11만 원 정도 높습니다. 다만 생활형을 도입해도 정장형을 함께 입는 혼합형 학교가 많아 총액은 품목 구성에 따라 달라집니다.",
  },
  {
    question: "체육복도 교복비에 포함해서 계산해야 하나요?",
    answer: "가정 예산을 잡을 때는 포함하는 편이 좋습니다. 체육복은 학교별로 구매처와 필수 여부가 다를 수 있지만, 입학 초기에 함께 구매하는 경우가 많아 첫 준비 비용에 영향을 줍니다.",
  },
  {
    question: "교복 지원금은 자동으로 반영되나요?",
    answer: "아니요. 교복 지원금은 지역과 학교, 지급 방식에 따라 달라서 이 계산기에서는 사용자가 직접 금액을 입력합니다. 실제 지원 여부는 학교 안내문이나 교육청 공지를 확인해야 합니다.",
  },
  {
    question: "학교 안내문을 아직 못 받았는데 계산할 수 있나요?",
    answer: "네. 정장형, 생활형, 혼합형 프리셋으로 대략적인 예산을 먼저 볼 수 있습니다. 안내문을 받은 뒤 품목별 단가와 수량을 수정하면 더 현실적인 총액을 확인할 수 있습니다.",
  },
  {
    question: "교복 셔츠는 몇 벌 사는 게 좋나요?",
    answer: "세탁 주기와 아이 활동량에 따라 다르지만 상의는 2벌 이상 구매하는 경우가 많습니다. 이 계산기는 추가 셔츠와 생활복 상의를 따로 입력할 수 있게 설계합니다.",
  },
  {
    question: "고등학교 교복비도 이 계산기로 볼 수 있나요?",
    answer: "네. 중학교와 고등학교 모두 동복, 하복, 생활복, 체육복 구조가 비슷하므로 학교급을 고등학교로 선택해 계산할 수 있습니다. 다만 학교별 단가를 직접 입력하는 것이 가장 정확합니다.",
  },
  {
    question: "평균보다 높게 나오면 비싼 교복인가요?",
    answer: "반드시 그렇지는 않습니다. 품목 수가 많거나 체육복, 생활복, 추가 셔츠를 함께 구매하면 평균보다 높게 나올 수 있습니다. 평균 대비 판정은 참고용으로만 보세요.",
  },
];
```

---

## 13. 내부 링크 전략

### 13-1. 인바운드

| 출발 페이지 | 연결 방식 |
|---|---|
| `/reports/elementary-school-ready-cost-2026/` | "초등 이후 중학교 교복비도 미리 보기" CTA |
| `/tools/child-tutoring-cost-calculator/` | 교육비 관련 링크에 교복비 계산기 추가 |
| `/reports/high-school-private-education-cost-2026/` | 고등학교 교육비 흐름에서 교복비 계산기 연결 |
| `/reports/university-student-welfare-benefits-2026/` | 교육비 지원 클러스터 관련 링크로 선택 연결 |

### 13-2. 아웃바운드

```ts
export const SUC_RELATED_LINKS: SucRelatedLink[] = [
  {
    href: "/reports/elementary-school-ready-cost-2026/",
    label: "초등학교 입학 준비 비용 2026",
    description: "책가방·실내화·문구·체육복까지 초등 입학 전 준비물을 확인합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "월 학원비와 연간 교육비를 함께 계산합니다.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급액 계산기",
    description: "교육비 지출과 세액공제 항목을 함께 확인합니다.",
  },
  {
    href: "/reports/high-school-private-education-cost-2026/",
    label: "고3 사교육비 2026",
    description: "학교급별 사교육비 평균을 비교합니다.",
  },
];
```

향후 3번 `education-benefit-eligibility-calculator-2026`이 구현되면 related 최상단에 추가한다.

---

## 14. 도구 등록 메타

**`src/data/tools.ts`**

대학생/교육비 클러스터 근처(`order: 72.x`) 또는 육아 비용·교육비 계산기 근처에 배치한다.

```ts
{
  slug: "school-uniform-cost-calculator-2026",
  title: "중학교 교복비 계산기 2026",
  description:
    "동복·하복·생활복·체육복 단가와 수량을 입력하면 첫 교복 구매 총액과 지원금 차감 후 부담액을 계산합니다.",
  order: 72.35,
  eyebrow: "교복비",
  category: "support",
  iframeReady: false,
  badges: ["신규", "교육비", "2026"],
  previewStats: [
    { label: "정장형 평균", value: "26.6만", context: "교육부 전수조사" },
    { label: "생활형 평균", value: "15.3만", context: "교육부 전수조사" },
  ],
}
```

**도구 라이브러리 카테고리**

`src/pages/tools/index.astro`의 `topicBySlug`에는 1차로 `"복지·지원금"` 또는 `"육아 비용"` 중 하나를 선택한다. 이 페이지는 지원금보다는 교육비 계산 성격이 강하지만, 현재 별도 `"교육비·학교"` 카테고리가 없고 대학생 비용 계산기들이 `"복지·지원금"`에 묶여 있으므로 1차는 `"복지·지원금"`에 둔다. 향후 교육비 페이지가 5개 이상 쌓이면 `"교육비·학교"` 신규 카테고리 분리를 검토한다.

---

## 15. 사이트맵 및 OG

### 15-1. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/school-uniform-cost-calculator-2026/</loc>
  <lastmod>2026-07-20</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 15-2. OG 이미지

초기 구현은 `og-home.png`를 사용해도 되지만, 전용 OG 생성을 권장한다.

권장 문구:

- Eyebrow: `2026 교육비`
- Title: `중학교 교복비 계산기`
- Stats:
  - `정장형 26.6만`
  - `생활형 15.3만`
  - `체육복 포함`

---

## 16. 품질 및 QA 체크리스트

### 16-1. 계산 검증

- [ ] 품목별 `단가 × 수량`이 정확히 합산되는지 확인
- [ ] 그룹별 합계(동복/하복·생활복/체육복/추가)가 전체 합계와 일치하는지 확인
- [ ] 지원금이 총액보다 클 때 실부담액이 음수가 되지 않는지 확인
- [ ] 추가 구매 예산 비율이 0~30% 범위로 제한되는지 확인
- [ ] 정장형/생활형/혼합형 프리셋 변경 시 평균 대비 기준선이 바뀌는지 확인
- [ ] 모든 금액이 원 단위 콤마 포맷으로 표시되는지 확인

### 16-2. UX 검증

- [ ] 320px 모바일에서 품목 입력 행이 깨지지 않음
- [ ] 수량 stepper가 터치 환경에서 충분히 큼
- [ ] 프리셋 변경 시 사용자가 수정한 값이 의도치 않게 사라지지 않도록 확인 또는 리셋 안내
- [ ] 결과 KPI가 입력 즉시 갱신됨
- [ ] 체크리스트가 결과 아래에서 잘 보임
- [ ] 복사 링크가 핵심 옵션과 지원금 값을 유지함

### 16-3. SEO 검증

- [ ] H1에 `중학교 교복비 계산기 2026` 포함
- [ ] title 60자 이내
- [ ] meta description 120~160자 안팎
- [ ] FAQ 7개 이상
- [ ] intro 5단락 이상, 800자 이상
- [ ] 공식 출처 링크 포함
- [ ] `FAQPage` JSON-LD 포함
- [ ] sitemap 등록

### 16-4. 보안 검증

- [ ] 사용자 입력값을 `innerHTML`에 삽입하지 않음
- [ ] URL 파라미터 숫자 범위 검증
- [ ] allowlist 없는 문자열 상태 사용 금지
- [ ] 외부 링크는 새 창일 경우 `rel="noopener noreferrer"`
- [ ] 개인정보 입력 없음, 서버 전송 없음

---

## 17. 구현 순서

1. `src/data/schoolUniformCostCalculator2026.ts` 작성
2. `src/pages/tools/school-uniform-cost-calculator-2026.astro` 작성
3. `public/scripts/school-uniform-cost-calculator-2026.js` 작성
4. `src/styles/scss/pages/_school-uniform-cost-calculator-2026.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/pages/tools/index.astro` topic 등록
7. `src/styles/app.scss` import 추가
8. `public/sitemap.xml` 등록
9. 기존 초등 입학준비/사교육비 페이지 related 링크 보강
10. `npm run build` 검증

---

## 18. 리스크 및 보완

| 리스크 | 설명 | 보완 |
|---|---|---|
| 학교별 단가 차이 | 전국 평균만으로 실제 교복비를 정확히 알 수 없음 | 품목별 직접 입력을 기본 UX로 제공 |
| 체육복 평균 부재 | 공식 전수조사에서 체육복 평균 단가가 명확히 공개되지 않음 | 체육복은 `확인 필요` 배지와 직접 입력 방식 |
| 지원금 지역차 | 교복 지원금은 교육청·지자체마다 다름 | 자격 판정 대신 직접 입력, 교육급여/지원금 페이지로 연결 |
| 기존 사교육비 계산기와 혼동 | 둘 다 교육비 주제 | 이 페이지는 "학교 지정 의류 첫 구매 비용"으로 제목과 H1 고정 |
| 평균 대비 판정 오해 | 품목 수가 많으면 평균보다 높게 나올 수 있음 | 판정 카피에 "품목 구성 차이 고려" 안내 |

---

## 19. 2차 확장 아이디어

1. **학교알리미 연동형 리포트**
   - 2026년 9월 개선된 정보공시가 공개되면 지역별·학교별 교복비 순위 리포트 검토

2. **교복 지원금 지역별 비교**
   - 시도교육청·지자체별 교복 지원 방식과 금액을 정리하는 리포트

3. **중학교 입학 준비비 계산기**
   - 교복비 + 교재·문구 + 스마트기기 + 통학비까지 확장

4. **고등학교 입학 준비비 계산기**
   - 교복비 + 기숙사/통학 + 자습실·학원비 전환 비용 연결

---

## 20. 최종 판정

`중학교 교복비 계산기 2026`은 기존 교육비 콘텐츠와 겹치지 않는 새 축이다. 교육부 전수조사로 공식 평균값과 문제의식이 이미 형성되어 있고, 학부모는 학교 안내문을 받은 직후 "총액이 얼마인지"를 직접 계산하고 싶어 한다. 1차 구현은 학교별 DB 없이도 충분히 유용하며, 향후 학교알리미 정보공시가 정비되면 지역별·학교별 비교 리포트로 확장할 수 있다.
