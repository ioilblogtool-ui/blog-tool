# 경기도 가족돌봄수당 2026 설계 문서

> 작성일: 2026-07-01
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 대상 URL: `/reports/gyeonggi-family-care-allowance-2026/`
> 핵심 안전장치: 지원 조건(소득기준·주소기준·연령기준)은 공식 안내 기준으로만 표시. 자격 판정 결과를 확정값처럼 표시하지 않는다.

---

## 1. 문서 개요

- 구현 대상: `2026 경기도 가족돌봄수당`
- 권장 slug: `gyeonggi-family-care-allowance-2026`
- URL: `/reports/gyeonggi-family-care-allowance-2026/`
- 카테고리: 육아·출산 / 지원금 / 경기도
- 메인 훅: `맞벌이 부부가 24~36개월 아이를 조부모에게 맡기면 월 30만원 받을 수 있다`
- 핵심 출력:
  - 내 아이가 신청 대상인지 빠른 자가진단 (연령·주소·소득)
  - 신청 가능 월 조견표 (출생월 → 신청월)
  - 아동 수별 지원금 금액 카드
  - 미참여·접수중단 시군 경고
  - 필요서류 체크리스트
  - FAQ

---

## 2. 콘텐츠 포지셔닝

### 한 줄 가치 제안

`경기도 맞벌이 가정이 24~36개월 아이를 조부모·친인척·이웃에게 맡길 때 받을 수 있는 돌봄수당을 한눈에 정리한 리포트`

### 독자가 얻는 것

- 내 아이 생년월이 신청 대상 연령에 해당하는지 즉시 확인
- 우리 시군이 사업에 참여하는지 확인
- 신청해야 하는 월과 돌봄 시작 월이 언제인지
- 아동 수별 실제 수령 금액
- 제출서류 목록을 체크리스트 형태로 정리
- 신청 링크(경기민원24) 바로가기

### 절대 피해야 할 방향

- `소득 기준을 계산해 자격 판정`처럼 오해할 수 있는 UI
- 중위소득 150% 이하 여부를 사이트에서 직접 판정
- 미참여 시군 주민에게 `신청 가능`처럼 보이는 문구
- 예산 소진 가능성을 무시하고 `반드시 받을 수 있다`는 표현

---

## 3. SEO 설계

### SEO title

```text
경기도 가족돌봄수당 2026 | 24~36개월 맞벌이 가정 월 30만원 신청 조건
```

### Meta description

```text
2026 경기도 가족돌봄수당 신청 대상, 지원 금액, 신청 월 조견표, 미참여 시군을 정리했습니다. 아동 1명 월 30만원, 출생월별 신청 가능 시기와 필요서류까지 한눈에 확인하세요.
```

### H1

```text
2026 경기도 가족돌봄수당
```

### H2 후보

- 지원 조건 한눈에 보기
- 우리 아이는 몇 월에 신청할 수 있을까
- 아동 수별 수령 금액
- 신청 불가 시군 확인
- 신청 방법과 필요서류
- 자주 묻는 질문 (FAQ)

### 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 경기도 가족돌봄수당 | title, H1, KPI |
| 가족돌봄수당 신청 | H2, CTA 버튼 |
| 가족돌봄수당 자격 | 지원 조건 섹션, FAQ |
| 가족돌봄수당 소득기준 | 조건 카드, FAQ |
| 가족돌봄수당 신청방법 | 신청 섹션 |
| 가족돌봄수당 시군 | 미참여 시군 섹션 |
| 맞벌이 육아 지원금 | description, SEO 본문 |
| 조부모 돌봄 수당 | FAQ, SEO 본문 |

---

## 4. 핵심 데이터

### 4-1. 사업 개요

| 항목 | 내용 |
|---|---|
| 사업명 | 2026년 경기도 가족돌봄수당 |
| 신청 기간 | 2026.07.01(수) 10:00 ~ 2026.07.15(수) 18:00 |
| 지원 기간 | 2026.01 ~ |
| 신청 채널 | 경기민원24 (https://gg24.gg.go.kr) |
| 신청 권장 브라우저 | 크롬, 엣지 |

### 4-2. 지원 조건

| 구분 | 조건 |
|---|---|
| 연령 | 돌봄활동 월 기준 아동 연령 생후 24개월~36개월 |
| 소득 | 중위소득 150% 이하 |
| 주소 | 신청일 기준 양육자(부 또는 모)와 아동이 사업 시·군 주소 거주 |
| 돌봄 사유 | 맞벌이·다자녀 등 양육공백 발생 가정 |
| 돌봄 시간 | 월 40시간 이상, 일 최대 4시간까지 인정 |
| 돌봄조력자 | 4촌 이내 친인척 및 이웃주민 |

### 4-3. 지원 금액

| 아동 수 | 월 수령액 |
|---|---|
| 1명 | 30만원 |
| 2명 | 45만원 |
| 3명 | 60만원 |

### 4-4. 신청 연령 조견표 (출생월 → 신청월 → 돌봄시작월)

| 출생연월 | 신청 월 | 돌봄활동 시작 |
|---|---|---|
| 2023년 1월생 ~ 2024년 1월생 | 2025년 12월 | 2026년 1월~ |
| 2023년 2월생 ~ 2024년 2월생 | 2026년 1월 | 2026년 2월~ |
| 2023년 3월생 ~ 2024년 3월생 | 2026년 2월 | 2026년 3월~ |
| 2023년 4월생 ~ 2024년 4월생 | 2026년 3월 | 2026년 4월~ |
| 2023년 5월생 ~ 2024년 5월생 | 2026년 4월 | 2026년 5월~ |
| 2023년 6월생 ~ 2024년 6월생 | 2026년 5월 | 2026년 6월~ |
| 2023년 7월생 ~ 2024년 7월생 | 2026년 6월 | 2026년 7월~ |
| 2023년 8월생 ~ 2024년 8월생 | 2026년 7월 | 2026년 8월~ |
| 2023년 9월생 ~ 2024년 9월생 | 2026년 8월 | 2026년 9월~ |
| 2023년 10월생 ~ 2024년 10월생 | 2026년 9월 | 2026년 10월~ |
| 2023년 11월생 ~ 2024년 11월생 | 2026년 10월 | 2026년 11월~ |
| 2023년 12월생 ~ 2024년 12월생 | 2026년 11월 | 2026년 12월~ |

### 4-5. 미참여·접수중단 시군

| 구분 | 시군 |
|---|---|
| 사업 미참여 (신청 불가) | 수원, 고양, 부천, 시흥, 김포 |
| 신규 접수 중단 (신청 불가) | 과천, 의왕 |

### 4-6. 필요서류

**행정정보공동이용 (자동 조회)**
- 주민등록등본 사본 (신청일로부터 1주일 이내 발급본, 실거주지 기재본)
- 건강보험자격득실확인서
- 한부모자격정보
- 장애인자격정보

**직접 첨부 서류**

돌봄조력자 확인 서류:
- 돌봄조력자 신분증 사본 (주민등록증, 운전면허증, 여권 등)
- 친인척임을 증빙하는 가족관계증명서 사본
- 이웃임을 증빙하는 주민등록초본 사본
- 돌봄조력자 수령자 통장사본 (돌봄조력자가 수당 수령 시)

양육공백 확인 서류:
- 신청인의 양육공백 기준에 해당하는 서류

기타 증빙 (최종 선정자에 한함):
- 아동학대 교육 이수증
- 슬기로운 안전생활 교육 이수증

---

## 5. 페이지 IA

1. Hero
2. InfoNotice (안내 주의사항)
3. 지원 조건 요약 카드 4개 (연령·소득·주소·돌봄시간)
4. 지원 금액 카드 (아동 수별)
5. 신청 월 조견표 (출생월 선택 → 신청 가능 월 하이라이트)
6. 미참여·접수중단 시군 경고 블록
7. 돌봄조력자 범위 안내
8. 필요서류 체크리스트
9. 신청 방법 CTA
10. FAQ
11. 관련 지원금 리포트 링크
12. SeoContent

---

## 6. 데이터 모델 설계

파일:
```text
src/data/gyeonggiCareFamilyAllowance2026.ts
```

### 타입

```ts
export type AllowanceBadge = "공식" | "참고";

export interface GfcaCondition {
  label: string;
  value: string;
  detail: string;
  badge: AllowanceBadge;
}

export interface GfcaAmountCard {
  childCount: number;
  label: string;
  monthlyAmountWon: number;
  note: string;
}

export interface GfcaAgeRow {
  birthMonthRange: string;     // "2023년 7월생 ~ 2024년 7월생"
  applyMonth: string;          // "2026년 6월"
  careStartMonth: string;      // "2026년 7월~"
  isCurrent: boolean;          // 현재 신청 가능 여부 (2026년 7월 기준)
}

export interface GfcaDisabledCity {
  name: string;
  reason: "미참여" | "신규접수중단";
}

export interface GfcaDocument {
  category: "행정공동이용" | "돌봄조력자" | "양육공백" | "기타";
  label: string;
  required: boolean;
  note?: string;
}

export interface GfcaFaqItem {
  q: string;
  a: string;
}

export interface GfcaMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  applyPeriodLabel: string;
  applyPeriodStart: string;
  applyPeriodEnd: string;
  applyUrl: string;
  updatedAt: string;
  notice: string;
}
```

### 필수 export

```ts
export const GFCA_META: GfcaMeta
export const GFCA_CONDITIONS: GfcaCondition[]
export const GFCA_AMOUNTS: GfcaAmountCard[]
export const GFCA_AGE_TABLE: GfcaAgeRow[]
export const GFCA_DISABLED_CITIES: GfcaDisabledCity[]
export const GFCA_DOCUMENTS: GfcaDocument[]
export const GFCA_FAQ: GfcaFaqItem[]
export const GFCA_RELATED_LINKS: { href: string; label: string; description: string }[]
```

---

## 7. 주요 섹션 UI 상세

### 7-1. Hero

```astro
<CalculatorHero
  eyebrow="경기도 육아 지원금"
  title="2026 경기도 가족돌봄수당"
  description="맞벌이·다자녀 가정에서 조부모·친인척·이웃이 24~36개월 아이를 돌볼 때 받을 수 있는 수당입니다. 신청 조건, 신청 가능 월, 지원 금액을 빠르게 확인하세요."
/>
```

### 7-2. InfoNotice

```text
이 페이지는 경기민원24 공식 안내를 정리한 참고용 콘텐츠입니다.
소득 기준 충족 여부는 담당 시·군에서 최종 확인합니다.
예산 소진 시 조기 종료될 수 있습니다.
```

### 7-3. 지원 조건 카드 (4개)

| 카드 | 제목 | 설명 |
|---|---|---|
| 연령 | 생후 24~36개월 | 돌봄활동 월 기준 아동 연령 |
| 소득 | 중위소득 150% 이하 | 가구 소득 기준 (담당 시군 확인 필요) |
| 주소 | 사업 참여 시군 거주 | 양육자와 아동이 동일 시군 주소 |
| 돌봄 | 월 40시간 이상 | 일 최대 4시간 인정 |

각 카드 하단에 `공식` 배지 표시.

### 7-4. 지원 금액 카드

3개 카드를 가로로 나열:

| | 아동 1명 | 아동 2명 | 아동 3명 |
|---|---|---|---|
| 월 수령액 | **30만원** | **45만원** | **60만원** |
| 연간 추정 | 360만원 | 540만원 | 720만원 |

연간 추정은 `12개월 만액 수령 시 추정` 주석 표시.

### 7-5. 신청 월 조견표 (핵심 인터랙션)

**인터랙션 방식:**
- 드롭다운 또는 버튼 그리드: 출생 연도(2023/2024) × 출생 월(1~12월) 선택
- 선택하면 해당 행이 하이라이트되고 KPI 형태로 결과 표시:
  - `신청 가능 월: 2026년 X월`
  - `돌봄 시작 월: 2026년 X월~`
  - `현재 신청 가능 여부: 접수중 / 신청 기간 종료`
- 선택 없으면 전체 표를 그대로 표시
- 현재 접수 기간(7월)에 해당하는 행은 항상 강조 표시

**상태 안내:**
- 신청 기간(2026.07.01~07.15) 내: `현재 접수 중` 배지
- 기간 외: `접수 종료 또는 예정` 안내

### 7-6. 미참여·접수중단 시군 경고 블록

경고 박스 형태로 눈에 띄게:

```
⚠ 아래 시군은 신청이 불가능합니다

신청 불가 (사업 미참여): 수원, 고양, 부천, 시흥, 김포
신규 접수 중단: 과천, 의왕
```

배경색: `$color-warn-bg` 또는 주황 계열 토큰 사용.

### 7-7. 돌봄조력자 범위

카드 2개:

| 유형 | 조건 |
|---|---|
| 친인척형 | 4촌 이내 친인척 (조부모 포함) |
| 이웃형 | 이웃주민 |

하단 주의:
```text
친인척이 수당 수령 시 경기도 주민이어야 하며, 이웃주민도 주민등록초본으로 인근 거주 확인이 필요합니다.
```

### 7-8. 필요서류 체크리스트

카테고리별 accordion 또는 섹션으로 분리:

1. **행정정보공동이용 (자동 조회)**
   - [ ] 주민등록등본 (신청일 1주일 이내, 실거주지 기재본)
   - [ ] 건강보험자격득실확인서
   - [ ] 한부모자격정보 (해당자)
   - [ ] 장애인자격정보 (해당자)

2. **돌봄조력자 확인 서류**
   - [ ] 돌봄조력자 신분증 사본
   - [ ] 가족관계증명서 사본 (친인척인 경우)
   - [ ] 주민등록초본 (이웃주민인 경우)
   - [ ] 통장사본 (돌봄조력자 수당 수령 시)

3. **양육공백 확인 서류**
   - [ ] 양육공백 기준에 맞는 서류 (맞벌이·다자녀 등)

4. **기타 (최종 선정자 한정)**
   - [ ] 아동학대 교육 이수증
   - [ ] 슬기로운 안전생활 교육 이수증

하단 안내:
```text
서류 미비로 인한 보완 요청 시 접수 및 선정이 지연될 수 있습니다.
신청 전 경기민원24에서 최신 서류 목록을 반드시 확인하세요.
```

### 7-9. 신청 방법 CTA

```text
경기민원24에서 신청 (크롬·엣지 권장)
신청 기간: 2026.07.01 ~ 2026.07.15 18:00
```

버튼:
- 주요: `경기민원24 신청하기` → https://gg24.gg.go.kr (외부 링크)
- 보조: `키보드 보안 프로그램 안내 확인`

외부 링크 처리: `target="_blank" rel="noopener noreferrer"` 필수.

---

## 8. 클라이언트 JS 설계

파일:
```text
public/scripts/gyeonggi-family-care-allowance-2026.js
```

### 주요 함수

```js
function initBirthMonthSelector() {}       // 출생월 선택 드롭다운/버튼 초기화
function onBirthMonthChange(year, month) {} // 출생월 선택 → 해당 행 하이라이트 + KPI 업데이트
function highlightAgeRow(rowId) {}         // 조견표 해당 행 강조
function renderResultKpi(row) {}           // 선택 결과 카드 렌더링
function checkApplyStatus(applyMonth) {}   // 현재 날짜 기준 접수 상태 반환
function initDocumentChecklist() {}        // 필요서류 체크박스 상태 관리 (localStorage)
function syncUrlState(year, month) {}      // URL 파라미터 유지
function restoreUrlState() {}             // 페이지 로드 시 복원
```

### URL 파라미터

| 파라미터 | 값 예시 |
|---|---|
| `by` | `2023` (출생 연도) |
| `bm` | `7` (출생 월) |

---

## 9. SCSS 설계

파일:
```text
src/styles/scss/pages/_gyeonggi-family-care-allowance-2026.scss
```

prefix: `gfca-`

```scss
.gfca-page {}
.gfca-notice {}
.gfca-condition-grid {}
.gfca-condition-card {}
.gfca-amount-grid {}
.gfca-amount-card {}
.gfca-amount-card--highlight {}
.gfca-age-selector {}
.gfca-age-result-kpi {}
.gfca-age-table-wrap {}
.gfca-age-table {}
.gfca-age-row--current {}      // 현재 접수 기간 강조
.gfca-age-row--selected {}     // 사용자 선택 행 강조
.gfca-disabled-cities {}       // 경고 블록
.gfca-disabled-cities--warn {} // 경고 색상
.gfca-helper-cards {}
.gfca-checklist {}
.gfca-checklist__group {}
.gfca-checklist__item {}
.gfca-cta-block {}
.gfca-faq {}
.gfca-related {}
```

### 모바일 처리

- 조건 카드: 2열 → 모바일 1열
- 금액 카드: 3열 → 모바일 1열 (각 카드 full-width)
- 조견표: 가로 스크롤 허용 (`overflow-x: auto`)
- 미참여 시군 경고: 항상 full-width
- CTA 버튼: full-width

---

## 10. Astro 페이지 구조

파일:
```text
src/pages/reports/gyeonggi-family-care-allowance-2026.astro
```

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  GFCA_META,
  GFCA_CONDITIONS,
  GFCA_AMOUNTS,
  GFCA_AGE_TABLE,
  GFCA_DISABLED_CITIES,
  GFCA_DOCUMENTS,
  GFCA_FAQ,
  GFCA_RELATED_LINKS,
} from "../../data/gyeonggiCareFamilyAllowance2026";
---

<BaseLayout
  title={GFCA_META.seoTitle}
  description={GFCA_META.seoDescription}
  pageClass="gfca-page"
>
  <SiteHeader />
  <main class="container page-shell gfca-page">
    <!-- Hero -->
    <!-- InfoNotice -->
    <!-- 지원 조건 카드 -->
    <!-- 금액 카드 -->
    <!-- 신청 월 조견표 -->
    <!-- 미참여 시군 경고 -->
    <!-- 돌봄조력자 안내 -->
    <!-- 필요서류 체크리스트 -->
    <!-- 신청 CTA -->
    <!-- FAQ -->
    <!-- 관련 링크 -->
    <!-- SeoContent -->

    <!-- 데이터 주입 -->
    <script id="gfca-data" type="application/json" set:html={JSON.stringify({
      ageTable: GFCA_AGE_TABLE,
      applyPeriodStart: GFCA_META.applyPeriodStart,
      applyPeriodEnd: GFCA_META.applyPeriodEnd,
    })} />
    <script src="/scripts/gyeonggi-family-care-allowance-2026.js" defer></script>
  </main>
</BaseLayout>
```

---

## 11. FAQ 설계

```ts
export const GFCA_FAQ = [
  {
    q: "신청 대상 아동의 연령 기준은 언제 기준인가요?",
    a: "돌봄활동이 이루어지는 월 기준으로 아동 연령이 생후 24개월~36개월이어야 합니다. 신청일 기준이 아닌 실제 돌봄 활동 월 기준임에 주의하세요.",
  },
  {
    q: "조부모가 같은 집에 살지 않아도 되나요?",
    a: "돌봄조력자(조부모 등)는 신청자와 동일 주소일 필요가 없습니다. 다만 친인척이 수당을 수령하는 경우 돌봄조력자가 경기도 주민이어야 합니다.",
  },
  {
    q: "맞벌이가 아니면 신청할 수 없나요?",
    a: "맞벌이 외에도 다자녀 등 양육공백이 발생하는 가정이면 신청 가능합니다. 양육공백 확인 서류로 해당 기준을 증빙해야 합니다.",
  },
  {
    q: "수원·고양·부천·시흥·김포 주민도 신청할 수 있나요?",
    a: "아닙니다. 수원·고양·부천·시흥·김포는 사업 미참여 시군으로 신청이 불가능합니다. 과천·의왕은 신규 접수가 중단된 상태입니다.",
  },
  {
    q: "아동이 2명이면 수당이 두 배인가요?",
    a: "아닙니다. 아동 1명 월 30만원, 2명 45만원, 3명 60만원으로 아동 수에 따라 구간별로 지원됩니다.",
  },
  {
    q: "수당은 양육자 통장으로 지급되나요?",
    a: "기본적으로 양육자에게 지급되며, 돌봄조력자가 수당을 수령하려면 별도 통장 사본을 제출해야 합니다. 이 경우 돌봄조력자가 경기도 주민이어야 합니다.",
  },
  {
    q: "교육 이수증은 신청 전에 완료해야 하나요?",
    a: "아동학대 교육 이수증과 슬기로운 안전생활 교육 이수증은 최종 선정자에 한해 제출합니다. 신청 단계에서 필수 서류가 아닙니다.",
  },
  {
    q: "예산이 소진되면 어떻게 되나요?",
    a: "사업은 예산 범위 내에서 운영되며 예산 소진 시 조기 종료될 수 있습니다. 신청 기간 내에 접수했더라도 예산 초과 시 선정이 보장되지 않습니다.",
  },
];
```

---

## 12. SEO 본문 (SeoContent)

### 인트로 단락

```text
경기도 가족돌봄수당은 맞벌이·다자녀 가정에서 조부모·친인척·이웃주민이 생후 24~36개월 아이를 돌볼 때 지원하는 수당입니다. 아동 1명 기준 월 30만원, 2명 45만원, 3명 60만원을 계좌이체로 받을 수 있습니다.

2026년 신청은 출생월에 따라 신청 가능 월이 다릅니다. 2023년 7~8월생 아동 가정은 2026년 6~7월이 신청 적기입니다. 조견표를 확인해 내 아이의 신청 가능 월을 먼저 확인하는 것이 중요합니다.

수원·고양·부천·시흥·김포는 사업 미참여 시군으로 신청이 불가능하며, 과천·의왕은 신규 접수가 중단된 상태입니다. 신청 전 반드시 거주 시군 참여 여부를 확인해야 합니다.
```

### 기준 항목

```text
연령 기준은 돌봄활동 월 기준 생후 24~36개월입니다.
소득 기준은 중위소득 150% 이하이며 담당 시군에서 최종 확인합니다.
돌봄조력자는 4촌 이내 친인척 또는 이웃주민이어야 합니다.
월 40시간 이상 돌봄 수행 시 수당이 지급되며 일 최대 4시간까지 인정됩니다.
신청은 양육자(부 또는 모)만 가능하며 경기민원24에서 온라인으로만 접수합니다.
```

---

## 13. 관련 링크

```ts
export const GFCA_RELATED_LINKS = [
  {
    href: "/tools/postnatal-care-income-eligibility/",
    label: "산후도우미 지원금 소득기준 계산기",
    description: "건강보험료로 산후도우미 정부지원 대상 여부 확인",
  },
  {
    href: "/tools/postnatal-care-cost/",
    label: "산후도우미 비용 계산기",
    description: "정부지원 유형별 산후도우미 본인부담금 계산",
  },
  {
    href: "/tools/birth-support-total/",
    label: "출산~2세 지원금 계산기",
    description: "출산 직후부터 2세까지 받을 수 있는 지원금 합산",
  },
  {
    href: "/reports/baby-formula-brand-cost-comparison-2026/",
    label: "분유 브랜드별 비용 비교 2026",
    description: "월령별 분유 1개월·12개월 비용 비교",
  },
  {
    href: "/compare/welfare/",
    label: "지원금 비교 허브",
    description: "청년·출산·복지 지원금 상황별 모음",
  },
];
```

---

## 14. reports.ts 등록

```ts
{
  slug: "gyeonggi-family-care-allowance-2026",
  title: "2026 경기도 가족돌봄수당 | 24~36개월 맞벌이 신청 조건·금액 정리",
  description:
    "맞벌이·다자녀 가정에서 조부모·친인척·이웃이 24~36개월 아이를 돌볼 때 받는 수당입니다. 신청 조건, 아동 수별 금액, 신청 가능 월, 미참여 시군까지 한눈에 확인하세요.",
  category: "parenting",
  tags: ["경기도", "가족돌봄수당", "육아지원금", "맞벌이"],
  publishedAt: "2026-07-01",
  updatedAt: "2026-07-01",
},
```

---

## 15. 구현 파일 목록

```text
src/
  data/
    gyeonggiCareFamilyAllowance2026.ts   (신규)
    reports.ts                            (slug 등록)
  pages/
    reports/
      gyeonggi-family-care-allowance-2026.astro  (신규)
  styles/
    scss/
      pages/
        _gyeonggi-family-care-allowance-2026.scss  (신규)
    app.scss                              (import 추가)

public/
  scripts/
    gyeonggi-family-care-allowance-2026.js  (신규)
  sitemap.xml                             (URL 추가)
```

---

## 16. QA 체크리스트

### 데이터
- [ ] 신청 기간(2026.07.01~07.15)이 페이지에 정확히 표시되는가?
- [ ] 미참여 시군 7곳이 모두 경고 블록에 표시되는가?
- [ ] 아동 수별 금액(30만·45만·60만)이 공식 안내와 일치하는가?
- [ ] 조견표 출생월 범위가 공식 안내와 일치하는가?

### UI
- [ ] 현재 접수 기간에 해당하는 조견표 행이 강조 표시되는가?
- [ ] 출생월 선택 시 해당 행이 하이라이트되고 결과 KPI가 노출되는가?
- [ ] 경고 블록이 눈에 띄는 색상으로 표시되는가?
- [ ] 모바일에서 조견표가 가로 스크롤로 읽히는가?
- [ ] 외부 링크(경기민원24)가 새 탭으로 열리는가?

### SEO
- [ ] H1에 `가족돌봄수당`이 포함되는가?
- [ ] description에 `24~36개월`, `맞벌이`, `월 30만원`이 포함되는가?
- [ ] FAQ가 visible 상태인가?
- [ ] reports.ts, sitemap.xml, app.scss에 등록이 완료되었는가?

### 안전성
- [ ] 소득기준 판정을 사이트에서 직접 하지 않는가?
- [ ] 예산 소진 가능성 안내가 포함되어 있는가?
- [ ] 미참여 시군 주민에게 신청 가능처럼 보이는 표현이 없는가?
- [ ] 외부 링크에 `rel="noopener noreferrer"`가 적용되어 있는가?

---

## 17. 구현 순서

1. `gyeonggiCareFamilyAllowance2026.ts` 데이터 파일 작성
2. Astro 페이지 작성 (정적 섹션 우선)
3. SCSS 작성 (`gfca-` prefix)
4. `app.scss`에 import 추가
5. 클라이언트 JS 작성 (조견표 인터랙션, 체크리스트)
6. `reports.ts`, `sitemap.xml` 등록
7. `npm run build` 확인
8. 모바일/데스크톱 시각 확인

---

## 18. 최종 설계 요약

이 리포트의 핵심은 `내 아이가 신청 대상인지 빠르게 확인` 이다.

출생월 선택 → 신청 가능 월 즉시 표시 흐름이 가장 높은 체류 가치를 만든다. 소득기준처럼 판정이 복잡한 항목은 `담당 시군 확인` 안내로 처리하고, 사이트에서 직접 판정하는 구조는 피한다.

미참여·접수중단 시군 경고를 눈에 띄게 넣어야 `수원·고양 주민이 신청 후 반려`되는 혼란을 막을 수 있다. 신청 기간(7월 15일까지)이 짧아 빠른 CTA 노출이 중요하다.
