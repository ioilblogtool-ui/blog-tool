# 임신 출산 비용 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/pregnancy-birth-cost.md`
> 작성일: 2026-04-11
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 계산기: `birth-support-total`, `parental-leave-pay` (입력·결과 카드 패턴 재사용)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/pregnancy-birth-cost.md`
- 구현 대상: `임신 출산 비용 계산기 2026`
- 콘텐츠 유형: **계산기** (`/tools/` 계열)

### 1-2. 문서 역할

- 기획 문서를 비교계산소 `/tools/` 구조에 맞게 구현 직전 수준으로 재구성한 설계 문서다.
- 입력 필드, 계산 로직, 결과 카드, 차트, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/tools.ts`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **임신·출산 비용 3단 분리 계산기**: 의료비 총액 → 지원금 차감 후 의료비 본인부담 → 산후조리 포함 최종 총액
- **핵심 차별점**: 단순 총액이 아니라 "임신·출산 진료비 지원이 의료비 영역에만 적용된다"는 구조를 정확히 반영
- **SEO 포지셔닝**: `출산 비용 계산기`, `임신 출산 비용`, `자연분만 제왕절개 비용 차이`, `국민행복카드 산후조리원` 고검색량 키워드 커버

### 1-4. 권장 slug

- `pregnancy-birth-cost`
- URL: `/tools/pregnancy-birth-cost/`

### 1-5. topicBySlug 카테고리

- `"pregnancy-birth-cost": "육아휴직·출산"` (index.astro)

### 1-6. 권장 파일 구조

```
src/
  data/
    tools.ts                               ← 항목 추가
    pregnancyBirthCost.ts                  ← 계산 기준표 (추정 단가 + 지원금 규칙)
  pages/
    tools/
      pregnancy-birth-cost.astro

public/
  scripts/
    pregnancy-birth-cost.js               ← 계산 로직, DOM 바인딩, 차트
  og/
    tools/
      pregnancy-birth-cost.png            ← OG 이미지 (npm run og:generate)

src/styles/scss/pages/
  _pregnancy-birth-cost.scss             ← 페이지 전용 스타일 (prefix: pb-)
```

---

## 2. 데이터 파일 설계 (`pregnancyBirthCost.ts`)

### 2-1. 추정 단가 테이블

```ts
// 병원 등급 타입
export type HospitalTier = "clinic" | "general" | "tertiary";
// 분만 방식
export type DeliveryType = "vaginal" | "c_section";
// 산후조리 방식
export type PostpartumCareType = "center" | "helper" | "home";
// 산후조리원 지역
export type PostpartumRegion = "seoul" | "gyeonggi" | "local";
// 조리원 등급
export type PostpartumRoomType = "standard" | "suite";

// ── 산전검사비 (임신 기간 전체 추정, 만원)
export const PRENATAL_CHECKUP_COST: Record<HospitalTier, number> = {
  clinic:   80,   // 동네산부인과
  general:  110,  // 종합병원
  tertiary: 140,  // 상급종합병원
};

// ── 분만비 (만원)
export const DELIVERY_COST: Record<HospitalTier, Record<DeliveryType, number>> = {
  clinic:   { vaginal: 40,  c_section: 80  },
  general:  { vaginal: 65,  c_section: 120 },
  tertiary: { vaginal: 100, c_section: 180 },
};

// ── 입원비 (만원): 자연분만 3일 / 제왕절개 5일 기준
export const HOSPITALIZATION_COST: Record<HospitalTier, Record<DeliveryType, number>> = {
  clinic:   { vaginal: 20,  c_section: 45  },
  general:  { vaginal: 35,  c_section: 70  },
  tertiary: { vaginal: 60,  c_section: 120 },
};

// ── 무통분만 추가비용 (만원, 자연분만 선택 시만 적용)
export const EPIDURAL_COST = 30;

// ── 다태아 가중치 (분만비 + 입원비에 적용)
export const MULTIPLE_BIRTH_MULTIPLIER = 1.3;

// ── 임신·출산 진료비 지원금 (공식 기준, 만원)
export const VOUCHER_BASE: Record<"single" | "multiple", number> = {
  single:   100,  // 단태아
  multiple: 140,  // 다태아 기본
};
// 다태아 추가: 태아당 100만원이 되도록 추가 (태아 수 × 100 - 140)
export const VOUCHER_PER_FETUS = 100;          // 만원
export const VOUCHER_UNDERSERVED_EXTRA = 20;    // 분만취약지 추가 (만원)

// ── 산후조리 비용 (2주 기준 추정, 만원)
export const POSTPARTUM_CENTER_COST: Record<PostpartumRegion, Record<PostpartumRoomType, number>> = {
  seoul:    { standard: 506, suite: 810 },
  gyeonggi: { standard: 350, suite: 480 },
  local:    { standard: 260, suite: 370 },
};
export const POSTPARTUM_HELPER_COST = 125;  // 산후도우미 (만원)
export const POSTPARTUM_HOME_COST    = 0;   // 집조리
```

### 2-2. 지원금 계산 규칙 (JS 로직에서 사용)

```ts
function calcVoucher(multipleBirth: boolean, fetusCount: number, underserved: boolean): number {
  let base = multipleBirth
    ? Math.max(VOUCHER_BASE.multiple, fetusCount * VOUCHER_PER_FETUS)
    : VOUCHER_BASE.single;
  if (underserved) base += VOUCHER_UNDERSERVED_EXTRA;
  return base; // 만원 단위
}
```

| 조건 | 지원금 |
|---|---|
| 단태아 | 100만원 |
| 쌍둥이(2태아) | max(140, 200) = **200만원** |
| 세쌍둥이(3태아) | max(140, 300) = **300만원** |
| 분만취약지 추가 | +20만원 |

### 2-3. FAQ 상수

```ts
export const PB_FAQ = [
  {
    q: "출산 비용은 보통 얼마 드나요?",
    a: "분만 방식과 병원 등급에 따라 크게 다릅니다. 자연분만 기준 산전검사비+분만비+입원비를 합치면 동네산부인과는 140만원 내외, 상급종합병원은 300만원 내외로 추정됩니다. 여기에 산후조리원(서울 일반실 평균 506만원)까지 합치면 총 비용은 훨씬 커집니다. 이 계산기는 지원금 차감 후 실제 본인부담액까지 함께 보여줍니다.",
  },
  {
    q: "자연분만과 제왕절개 비용 차이는 얼마나 나나요?",
    a: "제왕절개는 분만비와 입원비가 자연분만보다 높습니다. 동네산부인과 기준 제왕절개는 자연분만 대비 약 2배 수준으로 추정되며, 입원일수도 평균 5일로 자연분만(3일)보다 깁니다. 건강보험 적용으로 실제 본인부담은 줄어들지만 차이는 있습니다.",
  },
  {
    q: "국민행복카드로 산후조리원 비용도 차감되나요?",
    a: "임신·출산 진료비 지원(국민행복카드에 탑재)은 의료비 성격의 임산부·영유아 진료·약제에 적용되며, 산후조리원 기본 이용료는 일반적으로 차감 대상이 아닙니다. 산후조리원 비용은 의료비 지원과 별도 예산으로 계획하는 것이 안전합니다.",
  },
  {
    q: "다태아는 임신·출산 진료비 지원을 더 받을 수 있나요?",
    a: "다태아의 경우 기본 140만원 + 태아당 100만원이 되도록 추가 지급됩니다. 쌍둥이는 200만원, 세쌍둥이는 300만원이 지원됩니다. 분만취약지에 해당하면 20만원이 추가됩니다.",
  },
  {
    q: "병원 등급에 따라 출산비가 많이 달라지나요?",
    a: "네, 차이가 큽니다. 상급종합병원은 동네산부인과 대비 산전검사비와 분만비 모두 높게 책정됩니다. 다만 건강보험 적용 후 본인부담율은 등급마다 달라지므로 실제 차이는 이 계산기의 추정치로 확인 후 해당 병원에 직접 확인하는 것을 권장합니다.",
  },
];
```

---

## 3. tools.ts 추가 항목

```ts
{
  slug: "pregnancy-birth-cost",
  title: "임신 출산 비용 계산기",
  description: "분만 방식·병원 등급·산후조리 선택별로 지원금 차감 후 실제 본인부담액을 계산합니다.",
  order: 42,   // 기존 마지막 order 다음 번호로 조정
  eyebrow: "출산비용",
  category: "calculator",
  iframeReady: false,
  badges: ["출산", "분만", "지원금", "2026"],
  previewStats: [
    { label: "단태아 지원금", value: "100만원", context: "공식 기준" },
    { label: "서울 조리원 평균", value: "506만원", context: "일반실" },
  ],
},
```

---

## 4. 페이지 구조 (`pregnancy-birth-cost.astro`)

### 4-1. 레이아웃 쉘 선택

`SimpleToolShell.astro` — 단일 계산기, 입력 + 결과 카드 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import { PB_FAQ } from "../../data/pregnancyBirthCost";

const withBase = ...;
---

<BaseLayout
  title="임신 출산 비용 계산기 2026 | 분만 방식·병원 등급별 실제 본인부담액 계산 | 비교계산소"
  description="임신 주수, 자연분만·제왕절개, 병원 등급, 다태아 여부, 산후조리원까지 입력하면 임신·출산 총비용과 지원금 차감 후 예상 본인부담액을 계산해드립니다."
  ogImage="/og/tools/pregnancy-birth-cost.png"
>
  <SiteHeader />
  <SimpleToolShell calculatorId="pregnancy-birth-cost" pageClass="pb-page">
    ...
  </SimpleToolShell>
</BaseLayout>
```

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="출산비용"
  title="임신 출산 비용 계산기 2026"
  description="분만 방식, 병원 등급, 산후조리까지 설정하면 지원금 차감 후 예상 본인부담액을 계산합니다."
/>
<InfoNotice
  text="본 계산기는 평균 비용과 공개 기준을 바탕으로 한 추정치입니다. 실제 진료비는 병원·임신 상태·합병증 여부에 따라 달라질 수 있으며, 임신·출산 진료비 지원은 산후조리원 기본 이용료에 일반적으로 직접 적용되지 않습니다."
/>
```

### 4-3. 입력 패널 (aside)

#### SECTION A. 기본 입력

```html
<div class="panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">입력</p>
    <h2 class="panel__title">출산 조건 입력</h2>
  </div>

  <div class="form-grid">

    <!-- ① 분만 방식 -->
    <fieldset class="field pb-radio-group" id="pb-delivery-group">
      <legend>분만 방식</legend>
      <label><input type="radio" name="deliveryType" value="vaginal" checked> 자연분만</label>
      <label><input type="radio" name="deliveryType" value="c_section"> 제왕절개</label>
    </fieldset>

    <!-- ② 병원 등급 -->
    <fieldset class="field pb-radio-group" id="pb-hospital-group">
      <legend>병원 등급</legend>
      <label><input type="radio" name="hospitalTier" value="clinic" checked> 동네 산부인과</label>
      <label><input type="radio" name="hospitalTier" value="general"> 종합병원</label>
      <label><input type="radio" name="hospitalTier" value="tertiary"> 상급종합병원</label>
    </fieldset>

    <!-- ③ 다태아 여부 -->
    <label class="field">
      <span>다태아 여부</span>
      <select id="pb-fetus-count">
        <option value="1">단태아 (1명)</option>
        <option value="2">쌍둥이 (2명)</option>
        <option value="3">세쌍둥이 (3명)</option>
        <option value="4">네쌍둥이 이상 (4명)</option>
      </select>
    </label>

    <!-- ④ 무통분만 (자연분만 선택 시만 활성) -->
    <label class="field pb-toggle-field" id="pb-epidural-field">
      <span>무통분만</span>
      <div class="pb-toggle-wrap">
        <label class="pb-toggle">
          <input type="checkbox" id="pb-epidural">
          <span class="pb-toggle__slider"></span>
        </label>
        <span class="pb-toggle-label" id="pb-epidural-label">아니오</span>
      </div>
    </label>

    <!-- ⑤ 산후조리 방식 -->
    <fieldset class="field pb-radio-group" id="pb-care-group">
      <legend>산후조리 방식</legend>
      <label><input type="radio" name="careType" value="center" checked> 산후조리원</label>
      <label><input type="radio" name="careType" value="helper"> 산후도우미</label>
      <label><input type="radio" name="careType" value="home"> 집조리</label>
    </fieldset>

    <!-- ⑥ 산후조리원 지역 (조리원 선택 시 표시) -->
    <label class="field" id="pb-region-field">
      <span>산후조리원 지역</span>
      <select id="pb-region">
        <option value="seoul">서울</option>
        <option value="gyeonggi">경기·인천</option>
        <option value="local">지방</option>
      </select>
    </label>

    <!-- ⑦ 조리원 등급 (조리원 선택 시 표시) -->
    <label class="field" id="pb-room-field">
      <span>조리원 등급</span>
      <select id="pb-room-type">
        <option value="standard">일반실</option>
        <option value="suite">특실</option>
      </select>
    </label>

    <!-- ⑧ 분만취약지 여부 -->
    <label class="field pb-toggle-field">
      <span>분만취약지</span>
      <div class="pb-toggle-wrap">
        <label class="pb-toggle">
          <input type="checkbox" id="pb-underserved">
          <span class="pb-toggle__slider"></span>
        </label>
        <span class="pb-toggle-label" id="pb-underserved-label">아니오</span>
      </div>
    </label>

  </div><!-- /form-grid -->
</div><!-- /panel -->
```

#### SECTION B. 고급 입력 (접힌 상태)

```html
<div class="pb-advanced-wrap">
  <button class="pb-advanced-toggle" id="pb-advanced-toggle" aria-expanded="false">
    직접 금액 수정 ▼
  </button>
  <div class="pb-advanced-panel" id="pb-advanced-panel" hidden>
    <div class="form-grid">

      <label class="field">
        <span>산후조리원 비용 직접 입력 (만원)</span>
        <input type="number" id="pb-custom-care-cost" placeholder="예: 450" min="0" max="3000">
      </label>

      <label class="field">
        <span>바우처 잔액 직접 수정 (만원)</span>
        <input type="number" id="pb-custom-voucher" placeholder="예: 80" min="0" max="400">
      </label>

    </div>
  </div>
</div>
```

### 4-4. 결과 패널 (main)

#### 결과 카드 4개

```html
<div class="pb-result-cards" id="pb-result-cards">

  <div class="pb-result-card pb-result-card--total">
    <p class="pb-result-label">의료비 예상 총액</p>
    <p class="pb-result-value" id="pb-r-medical-total">–</p>
    <p class="pb-result-note">지원금 차감 전</p>
  </div>

  <div class="pb-result-card pb-result-card--voucher">
    <p class="pb-result-label">적용 가능한 지원금</p>
    <p class="pb-result-value" id="pb-r-voucher">–</p>
    <p class="pb-result-note">임신·출산 진료비 지원 <span class="pb-badge pb-badge--official">공식</span></p>
  </div>

  <div class="pb-result-card pb-result-card--oop">
    <p class="pb-result-label">의료비 예상 본인부담</p>
    <p class="pb-result-value pb-result-value--hl" id="pb-r-oop">–</p>
    <p class="pb-result-note">지원금 차감 후</p>
  </div>

  <div class="pb-result-card pb-result-card--final">
    <p class="pb-result-label">산후조리 포함 최종 총액</p>
    <p class="pb-result-value pb-result-value--hl" id="pb-r-final">–</p>
    <p class="pb-result-note">출산 총예산 추정</p>
  </div>

</div>
```

#### 항목별 바 차트

```html
<div class="pb-chart-wrap">
  <h3 class="pb-chart-title">항목별 비용 구성</h3>
  <canvas id="pb-breakdown-chart" height="280"></canvas>
</div>
```

#### 비교 설명 (조건별 안내)

```html
<div class="pb-compare-notice" id="pb-compare-notice">
  <!-- JS로 조건에 따라 메시지 업데이트 -->
</div>
```

#### 절약 팁

```html
<section class="pb-tips">
  <h2>출산 비용 절약 팁</h2>
  <ul class="pb-tips-list">
    <li>병원 등급별 비용 차이 확인 후 고위험 임신 아닐 경우 동네 산부인과 검토</li>
    <li>산후조리원 vs 산후도우미 총비용 비교 (서울 일반실 506만원 vs 산후도우미 125만원)</li>
    <li>임신·출산 진료비 지원은 의료비에만 적용 — 산후조리원은 별도 예산 확보</li>
    <li>쌍둥이 이상은 지원금이 태아당 100만원으로 늘어남</li>
    <li>첫만남이용권(첫째 200만원, 둘째 이상 300만원)은 별도로 확인</li>
  </ul>
</section>
```

#### 주의 문구

```html
<div class="pb-disclaimer">
  <p>본 계산기는 평균 비용과 공개 기준을 바탕으로 한 추정치입니다. 실제 진료비는 병원, 임신 상태, 합병증 여부에 따라 달라질 수 있습니다.</p>
  <p>임신·출산 진료비 지원은 임산부·영유아 진료·약제 본인부담금에 적용되며, 산후조리원 기본 이용료에는 일반적으로 직접 적용되지 않습니다.</p>
  <p>첫만남이용권은 별도 바우처이며, 이 계산기의 지원금 차감 로직과는 구분됩니다.</p>
</div>
```

#### FAQ

```html
<section class="pb-faq">
  <h2>출산 비용 계산기 FAQ</h2>
  {PB_FAQ.map(item => (
    <div class="pb-faq-item">
      <button class="pb-faq-q" aria-expanded="false">{item.q} <span>▼</span></button>
      <div class="pb-faq-a" hidden>{item.a}</div>
    </div>
  ))}
</section>
```

#### 관련 콘텐츠 CTA

```html
<section class="pb-cta">
  <h2>관련 콘텐츠</h2>
  <div class="pb-cta-list">
    <a href="/reports/postpartum-center-cost-2026/" class="pb-cta-card">
      <p>2026 산후조리원 비용 완전 비교</p>
      <span>→</span>
    </a>
    <a href="/tools/birth-support-total/" class="pb-cta-card">
      <p>출산~2세 총지원금 계산기</p>
      <span>→</span>
    </a>
    <a href="/reports/baby-cost-guide-first-year/" class="pb-cta-card">
      <p>신생아~돌까지 육아비용 총정리</p>
      <span>→</span>
    </a>
  </div>
</section>
```

#### SeoContent

```astro
<SeoContent
  heading="임신 출산 비용 계산기 — 자주 묻는 질문"
  faqs={PB_FAQ}
/>
```

---

## 5. 계산 로직 (`pregnancy-birth-cost.js`)

### 5-1. 상태 객체

```js
const state = {
  deliveryType:     "vaginal",  // "vaginal" | "c_section"
  hospitalTier:     "clinic",   // "clinic" | "general" | "tertiary"
  fetusCount:       1,          // 1~4
  epidural:         false,
  careType:         "center",   // "center" | "helper" | "home"
  region:           "seoul",    // "seoul" | "gyeonggi" | "local"
  roomType:         "standard", // "standard" | "suite"
  underserved:      false,
  customCareCost:   null,       // null or number (만원)
  customVoucher:    null,       // null or number (만원)
};
```

### 5-2. 단가 상수 (JS에서도 동일하게 정의)

```js
const PRENATAL = { clinic: 80, general: 110, tertiary: 140 };

const DELIVERY = {
  clinic:   { vaginal: 40,  c_section: 80  },
  general:  { vaginal: 65,  c_section: 120 },
  tertiary: { vaginal: 100, c_section: 180 },
};

const HOSPITALIZATION = {
  clinic:   { vaginal: 20,  c_section: 45  },
  general:  { vaginal: 35,  c_section: 70  },
  tertiary: { vaginal: 60,  c_section: 120 },
};

const EPIDURAL_COST = 30;
const MULTIPLE_MULTIPLIER = 1.3;

const VOUCHER_BASE = { single: 100, multiple: 140 };
const VOUCHER_PER_FETUS  = 100;
const VOUCHER_UNDERSERVED = 20;

const CENTER_COST = {
  seoul:    { standard: 506, suite: 810 },
  gyeonggi: { standard: 350, suite: 480 },
  local:    { standard: 260, suite: 370 },
};
const HELPER_COST = 125;
```

### 5-3. 핵심 계산 함수

```js
function calculate() {
  const { deliveryType, hospitalTier, fetusCount, epidural,
          careType, region, roomType, underserved,
          customCareCost, customVoucher } = state;

  const isMultiple = fetusCount > 1;

  // ── 의료비 계산
  const prenatal    = PRENATAL[hospitalTier];
  let   delivery    = DELIVERY[hospitalTier][deliveryType];
  let   hosp        = HOSPITALIZATION[hospitalTier][deliveryType];
  const epiduralAmt = (deliveryType === "vaginal" && epidural) ? EPIDURAL_COST : 0;

  if (isMultiple) {
    delivery = Math.round(delivery * MULTIPLE_MULTIPLIER);
    hosp     = Math.round(hosp     * MULTIPLE_MULTIPLIER);
  }

  const medicalTotal = prenatal + delivery + hosp + epiduralAmt;

  // ── 지원금 계산
  let voucher = isMultiple
    ? Math.max(VOUCHER_BASE.multiple, fetusCount * VOUCHER_PER_FETUS)
    : VOUCHER_BASE.single;
  if (underserved) voucher += VOUCHER_UNDERSERVED;
  const voucherAvailable = (customVoucher !== null) ? customVoucher : voucher;

  // ── 의료비 본인부담
  const medicalOop = Math.max(0, medicalTotal - voucherAvailable);

  // ── 산후조리 비용
  let careCost = 0;
  if (careType === "center") {
    careCost = (customCareCost !== null)
      ? customCareCost
      : CENTER_COST[region][roomType];
  } else if (careType === "helper") {
    careCost = HELPER_COST;
  }

  // ── 최종 총액
  const finalTotal = medicalOop + careCost;

  return {
    prenatal,
    delivery,
    hosp,
    epiduralAmt,
    medicalTotal,
    voucherAvailable,
    medicalOop,
    careCost,
    finalTotal,
  };
}
```

### 5-4. DOM 업데이트

```js
function updateUI(result) {
  const fmt = v => v.toLocaleString("ko-KR") + "만원";

  document.getElementById("pb-r-medical-total").textContent = fmt(result.medicalTotal);
  document.getElementById("pb-r-voucher").textContent       = fmt(result.voucherAvailable);
  document.getElementById("pb-r-oop").textContent           = fmt(result.medicalOop);
  document.getElementById("pb-r-final").textContent         = fmt(result.finalTotal);

  updateChart(result);
  updateCompareNotice(result);
}
```

### 5-5. 차트 (`pb-breakdown-chart`)

```js
let breakdownChart = null;

function initChart() {
  const canvas = document.getElementById("pb-breakdown-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 280;

  breakdownChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["산전검사비", "분만비", "입원비", "무통분만", "산후조리비", "지원금 차감"],
      datasets: [{
        label: "금액 (만원)",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(76, 175, 141, 0.7)",
          "rgba(74, 144, 217, 0.7)",
          "rgba(92, 107, 192, 0.7)",
          "rgba(156, 124, 199, 0.7)",
          "rgba(245, 166, 35, 0.7)",
          "rgba(229, 115, 115, 0.7)",
        ],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x.toLocaleString("ko-KR")}만원`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: v => v + "만" },
        },
      },
    },
  });
}

function updateChart(result) {
  if (!breakdownChart) return;
  breakdownChart.data.datasets[0].data = [
    result.prenatal,
    result.delivery,
    result.hosp,
    result.epiduralAmt,
    result.careCost,
    -result.voucherAvailable,  // 음수로 차감 시각화
  ];
  breakdownChart.update();
}
```

### 5-6. 비교 안내 메시지

```js
function updateCompareNotice(result) {
  const el = document.getElementById("pb-compare-notice");
  if (!el) return;

  const msgs = [];
  if (state.deliveryType === "c_section") {
    msgs.push("제왕절개는 입원비와 처치비 비중이 자연분만보다 큽니다.");
  }
  if (state.hospitalTier === "tertiary") {
    msgs.push("상급종합병원은 비용이 높지만 고위험 임신 대응이 필요한 경우 선택 가치가 달라질 수 있습니다.");
  }
  if (state.careType === "center") {
    msgs.push("산후조리원 비용은 임신·출산 진료비 지원 차감 대상이 아니므로 별도 예산으로 계획하세요.");
  }

  el.innerHTML = msgs.map(m => `<p class="pb-notice-item">💡 ${m}</p>`).join("");
}
```

### 5-7. 입력 이벤트 바인딩

```js
function bindEvents() {
  // 라디오: 분만 방식
  document.querySelectorAll('[name="deliveryType"]').forEach(radio => {
    radio.addEventListener("change", e => {
      state.deliveryType = e.target.value;
      // 제왕절개 시 무통분만 필드 비활성
      const epiduralField = document.getElementById("pb-epidural-field");
      if (epiduralField) {
        epiduralField.style.display = (state.deliveryType === "c_section") ? "none" : "";
      }
      if (state.deliveryType === "c_section") {
        state.epidural = false;
        document.getElementById("pb-epidural").checked = false;
      }
      recalc();
    });
  });

  // 라디오: 병원 등급
  document.querySelectorAll('[name="hospitalTier"]').forEach(radio => {
    radio.addEventListener("change", e => { state.hospitalTier = e.target.value; recalc(); });
  });

  // 다태아 수
  document.getElementById("pb-fetus-count").addEventListener("change", e => {
    state.fetusCount = parseInt(e.target.value, 10);
    recalc();
  });

  // 무통분만 토글
  document.getElementById("pb-epidural").addEventListener("change", e => {
    state.epidural = e.target.checked;
    document.getElementById("pb-epidural-label").textContent = state.epidural ? "예" : "아니오";
    recalc();
  });

  // 라디오: 산후조리 방식
  document.querySelectorAll('[name="careType"]').forEach(radio => {
    radio.addEventListener("change", e => {
      state.careType = e.target.value;
      const isCenter = state.careType === "center";
      const regionField = document.getElementById("pb-region-field");
      const roomField   = document.getElementById("pb-room-field");
      if (regionField) regionField.style.display = isCenter ? "" : "none";
      if (roomField)   roomField.style.display   = isCenter ? "" : "none";
      recalc();
    });
  });

  // 지역 / 조리원 등급
  document.getElementById("pb-region").addEventListener("change", e => {
    state.region = e.target.value; recalc();
  });
  document.getElementById("pb-room-type").addEventListener("change", e => {
    state.roomType = e.target.value; recalc();
  });

  // 분만취약지 토글
  document.getElementById("pb-underserved").addEventListener("change", e => {
    state.underserved = e.target.checked;
    document.getElementById("pb-underserved-label").textContent = state.underserved ? "예" : "아니오";
    recalc();
  });

  // 고급 입력 토글
  document.getElementById("pb-advanced-toggle").addEventListener("click", function () {
    const panel = document.getElementById("pb-advanced-panel");
    const expanded = this.getAttribute("aria-expanded") === "true";
    panel.hidden = expanded;
    this.setAttribute("aria-expanded", !expanded);
    this.textContent = expanded ? "직접 금액 수정 ▼" : "직접 금액 수정 접기 ▲";
  });

  // 고급: 산후조리 비용 직접 입력
  document.getElementById("pb-custom-care-cost").addEventListener("input", e => {
    const val = parseFloat(e.target.value);
    state.customCareCost = isNaN(val) ? null : val;
    recalc();
  });

  // 고급: 바우처 잔액 직접 수정
  document.getElementById("pb-custom-voucher").addEventListener("input", e => {
    const val = parseFloat(e.target.value);
    state.customVoucher = isNaN(val) ? null : val;
    recalc();
  });
}

function recalc() {
  const result = calculate();
  updateUI(result);
  syncUrlParams();
}
```

### 5-8. URL 파라미터 상태 동기화

```js
function syncUrlParams() {
  const params = new URLSearchParams({
    dt:  state.deliveryType,
    ht:  state.hospitalTier,
    fc:  state.fetusCount,
    ep:  state.epidural ? "1" : "0",
    ct:  state.careType,
    rg:  state.region,
    rt:  state.roomType,
    us:  state.underserved ? "1" : "0",
  });
  if (state.customCareCost !== null) params.set("cc", state.customCareCost);
  if (state.customVoucher  !== null) params.set("cv", state.customVoucher);
  history.replaceState(null, "", "?" + params.toString());
}

function restoreFromUrl() {
  const p = new URLSearchParams(location.search);
  if (p.get("dt")) state.deliveryType   = p.get("dt");
  if (p.get("ht")) state.hospitalTier   = p.get("ht");
  if (p.get("fc")) state.fetusCount     = parseInt(p.get("fc"), 10) || 1;
  if (p.get("ep")) state.epidural       = p.get("ep") === "1";
  if (p.get("ct")) state.careType       = p.get("ct");
  if (p.get("rg")) state.region         = p.get("rg");
  if (p.get("rt")) state.roomType       = p.get("rt");
  if (p.get("us")) state.underserved    = p.get("us") === "1";
  if (p.get("cc")) state.customCareCost = parseFloat(p.get("cc"));
  if (p.get("cv")) state.customVoucher  = parseFloat(p.get("cv"));
}
```

### 5-9. FAQ accordion

```js
function initFaq() {
  document.querySelectorAll(".pb-faq-item").forEach(item => {
    const btn = item.querySelector(".pb-faq-q");
    const ans = item.querySelector(".pb-faq-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !open);
      ans.hidden = open;
      item.classList.toggle("is-open", !open);
    });
  });
}
```

### 5-10. 초기화

```js
document.addEventListener("DOMContentLoaded", function () {
  restoreFromUrl();
  bindEvents();
  initFaq();
  syncFormToState(); // 라디오·셀렉트 DOM을 state 값으로 초기화

  if (typeof Chart !== "undefined") {
    initChart();
    recalc();
  } else {
    const chartScript = document.querySelector('script[src*="chart.js"]');
    if (chartScript) {
      chartScript.addEventListener("load", function () {
        initChart();
        recalc();
      });
    }
  }
});
```

---

## 6. SCSS 설계 (`_pregnancy-birth-cost.scss`)

### 6-1. prefix

모든 클래스명은 `pb-` prefix 사용

### 6-2. CSS 변수

```scss
.pb-page {
  --pb-color-prenatal:  #4caf8d;
  --pb-color-delivery:  #4a90d9;
  --pb-color-hosp:      #5c6bc0;
  --pb-color-epidural:  #9c7cc7;
  --pb-color-care:      #f5a623;
  --pb-color-voucher:   #e57373;  // 차감(빨간 계열)
}
```

### 6-3. 주요 컴포넌트

```scss
// 결과 카드 그리드
.pb-result-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.pb-result-card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-border);
  text-align: center;

  &--oop,
  &--final { border-color: var(--color-primary); }
}

.pb-result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;

  &--hl { color: var(--color-primary); font-size: 1.75rem; }
}

.pb-result-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.pb-result-note {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

// 배지
.pb-badge {
  display: inline-block;
  padding: 0.15em 0.55em;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  &--official { background: #e8f5e9; color: #388e3c; }
}

// 라디오 그룹
.pb-radio-group {
  border: none;
  padding: 0;
  margin: 0;

  legend {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin-right: 1rem;
    font-size: 0.9rem;
    cursor: pointer;
  }
}

// 토글 스위치
.pb-toggle-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pb-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pb-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;

  input { opacity: 0; width: 0; height: 0; }

  &__slider {
    position: absolute;
    inset: 0;
    background: var(--color-border);
    border-radius: 11px;
    transition: background 0.2s;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      left: 3px;
      top: 3px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
  }

  input:checked + &__slider {
    background: var(--color-primary);
    &::before { transform: translateX(18px); }
  }
}

.pb-toggle-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  min-width: 2.5rem;
}

// 차트 래퍼
.pb-chart-wrap {
  width: 100%;
  min-height: 280px;
  position: relative;
  margin: 1.25rem 0;

  canvas { width: 100% !important; }
}

// 고급 입력 토글
.pb-advanced-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  margin-top: 0.75rem;
}

.pb-advanced-panel {
  padding: 0.75rem 0 0;
}

// 비교 안내
.pb-compare-notice {
  margin: 1rem 0;
}

.pb-notice-item {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--color-surface);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 6px 6px 0;
  margin-bottom: 0.5rem;
}

// 절약 팁
.pb-tips { margin: 2rem 0; }

.pb-tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    font-size: 0.9rem;
    &::before { content: "✓"; color: var(--color-primary); font-weight: 700; flex-shrink: 0; }
  }
}

// 주의 문구
.pb-disclaimer {
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 1.5rem 0;

  p + p { margin-top: 0.5rem; }
}

// FAQ
.pb-faq-item { border-bottom: 1px solid var(--color-border); }

.pb-faq-q {
  width: 100%;
  text-align: left;
  padding: 0.875rem 0;
  font-weight: 600;
  font-size: 0.95rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.pb-faq-a {
  padding: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

// CTA
.pb-cta { margin: 2rem 0; }

.pb-cta-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (min-width: 640px) { flex-direction: row; }
}

.pb-cta-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  flex: 1;
  transition: border-color 0.15s;

  &:hover { border-color: var(--color-primary); }
}
```

---

## 7. 등록 작업 체크리스트

### `src/data/tools.ts`

- [ ] `pregnancy-birth-cost` 항목 추가 (order, badges, previewStats)

### `src/pages/index.astro`

- [ ] `topicBySlug`에 `"pregnancy-birth-cost": "육아휴직·출산"` 추가

### `src/styles/app.scss`

- [ ] `@use 'scss/pages/pregnancy-birth-cost';` 추가

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/pregnancy-birth-cost/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. SEO 설계

```
title: "임신 출산 비용 계산기 2026 | 분만 방식·병원 등급별 실제 본인부담액 계산 | 비교계산소"
description: "임신 주수, 자연분만·제왕절개, 병원 등급, 다태아 여부, 산후조리원까지 입력하면 임신·출산 총비용과 지원금 차감 후 예상 본인부담액을 계산해드립니다."
```

H 구조:
- H1: 임신 출산 비용 계산기 2026
- H2: (결과 영역) 항목별 비용 구성
- H2: 출산 비용 절약 팁
- H2: 출산 비용 계산기 FAQ

---

## 9. QA 체크리스트

### 계산 로직

- [ ] 단태아 지원금 100만원 / 쌍둥이 200만원 / 세쌍둥이 300만원 정확 적용
- [ ] 분만취약지 체크 시 +20만원 반영
- [ ] 제왕절개 선택 시 무통분만 필드 숨김 처리
- [ ] 산후조리 방식 "집조리" 선택 시 조리비 0원
- [ ] 조리원 선택 시 지역·등급 필드 표시 / 비선택 시 숨김
- [ ] 고급 입력 직접 값이 null이 아닐 때 자동 계산값 override
- [ ] 의료비 본인부담 = max(0, medicalTotal - voucherAvailable) — 음수 없음

### URL 파라미터

- [ ] 모든 state 항목 URLSearchParams에 직렬화
- [ ] 페이지 로드 시 URL 파라미터 복원 후 폼 DOM 초기화

### UI

- [ ] 결과 카드 4개 배치 (모바일 2×2, 데스크톱 1×4)
- [ ] 차트 `maintainAspectRatio: false` + `canvas.height = 280`
- [ ] 고급 입력 패널 아코디언 작동
- [ ] FAQ accordion 작동
- [ ] 비교 안내 메시지 조건별 표시

### 등록

- [ ] `src/data/tools.ts` 항목 추가
- [ ] `src/pages/index.astro` `topicBySlug` 추가
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음
- [ ] `/tools/pregnancy-birth-cost/` 라우트 `dist/`에 존재
- [ ] 메인 페이지 "육아휴직·출산" 카테고리 필터에서 노출
# 플레이북 타입 재지정 메모
#
# - 최종 타입: Type C. Guided Calculator
# - 기준 문서: docs/design/202604/calculator-playbook-design.md
# - 재지정 이유:
#   - 이 계산기는 총비용 숫자 하나보다 비용이 어디서 커지는지와 지원금 적용 범위를 읽는 과정이 더 중요하다.
#   - 사용자는 계산 결과 다음에 바로 준비 포인트와 해석 가이드를 같이 보고 싶어한다.
#   - 따라서 설계와 구현 모두 가이드형 계산기 구조를 우선한다.
# - 적용 규칙:
#   - KPI는 4~6개 이내로 유지한다.
#   - 차트는 보조 수단으로만 사용하고, 해석 카드와 안내 문구를 더 중요하게 둔다.
#   - 하단은 이어보기, 외부 참고 링크를 고정 섹션으로 둔다.
