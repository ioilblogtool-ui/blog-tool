# 치과 치료비 비교 계산기 설계 문서

> 기획 원본: `docs/plan/202606/dental-treatment-cost-calculator-plan.md`  
> 작성일: 2026-06-19  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `dental-treatment-cost-calculator`  
> prefix: `dtc-`

---

## 1. 파일 구조

```
src/data/dentalTreatmentCost.ts
src/pages/tools/dental-treatment-cost-calculator.astro
public/scripts/dental-treatment-cost-calculator.js
src/styles/scss/pages/_dental-treatment-cost-calculator.scss
```

등록 위치:
- `src/data/tools.ts` — order: 62.5 (건강·의료 카테고리)
- `public/sitemap.xml`

---

## 2. 데이터 파일 (`src/data/dentalTreatmentCost.ts`)

```ts
export const DTC_META = {
  slug: "dental-treatment-cost-calculator",
  title: "치과 치료비 비교 계산기",
  seoTitle: "치과 치료비 적정할까? 임플란트·크라운·충치 비용 비교 계산기 2026",
  description:
    "임플란트·크라운·충치·교정 견적을 입력하면 전국 평균 대비 낮음·보통·높음을 즉시 판단합니다. 건강보험 적용 조건과 연말정산 의료비 공제 안내 포함.",
} as const;

export interface DentalOption {
  id: string;
  label: string;
  low: number;              // 하한 (만원)
  avg: number;              // 평균 (만원)
  high: number;             // 상한 (만원)
  insuranceLow?: number;    // 보험 적용 시 하한 (만원)
  insuranceHigh?: number;   // 보험 적용 시 상한 (만원)
  insuranceCondition?: string;
}

export interface DentalTreatment {
  id: string;
  label: string;
  perTooth: boolean;        // true: 개당 계산, false: 총액
  options: DentalOption[];
  insuranceNote?: string;   // 보험 안내 문구
  insuranceAvailable: boolean;
}

export const DTC_TREATMENTS: DentalTreatment[] = [
  {
    id: "implant",
    label: "임플란트",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "만 65세 이상은 건강보험 적용 (본인부담 30%, 2개 한도)",
    options: [
      {
        id: "domestic",
        label: "국산 임플란트",
        low: 80, avg: 100, high: 130,
        insuranceLow: 25, insuranceHigh: 45,
        insuranceCondition: "만 65세 이상, 편측 2개 한도",
      },
      {
        id: "imported",
        label: "수입 임플란트",
        low: 130, avg: 160, high: 200,
      },
    ],
  },
  {
    id: "crown",
    label: "크라운",
    perTooth: true,
    insuranceAvailable: false,
    options: [
      { id: "pfm",       label: "PFM (도자기+금속)", low: 15, avg: 25, high: 35 },
      { id: "zirconia",  label: "지르코니아",         low: 25, avg: 40, high: 60 },
      { id: "ceramic",   label: "올세라믹",           low: 30, avg: 55, high: 80 },
      { id: "gold",      label: "금 크라운",          low: 40, avg: 60, high: 80 },
      { id: "resin",     label: "레진 (보험)",        low: 7,  avg: 11, high: 15,
        insuranceLow: 7, insuranceHigh: 15,
        insuranceCondition: "건강보험 적용 가능 (레진 크라운 한정)" },
    ],
  },
  {
    id: "inlay",
    label: "인레이 (충치)",
    perTooth: true,
    insuranceAvailable: false,
    options: [
      { id: "resin",   label: "레진 인레이",   low: 8,  avg: 13, high: 20 },
      { id: "ceramic", label: "세라믹 인레이", low: 15, avg: 25, high: 35 },
      { id: "gold",    label: "금 인레이",     low: 30, avg: 45, high: 60 },
    ],
  },
  {
    id: "filling",
    label: "충치 치료 (레진)",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "건강보험 적용 가능 (아말감·레진 직접 수복, 본인부담 30%)",
    options: [
      { id: "small",  label: "소 (1면)",     low: 3,  avg: 5,  high: 8,
        insuranceLow: 1, insuranceHigh: 3 },
      { id: "medium", label: "중 (2면)",     low: 6,  avg: 10, high: 15,
        insuranceLow: 2, insuranceHigh: 5 },
      { id: "large",  label: "대 (3면 이상)", low: 10, avg: 15, high: 20,
        insuranceLow: 3, insuranceHigh: 6 },
    ],
  },
  {
    id: "rootcanal",
    label: "신경치료",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "건강보험 적용 (본인부담 30%). 치아 종류별 차등 적용.",
    options: [
      { id: "anterior",  label: "전치부 (앞니)",  low: 10, avg: 17, high: 25,
        insuranceLow: 3, insuranceHigh: 8 },
      { id: "premolar",  label: "소구치 (작은어금니)", low: 15, avg: 25, high: 35,
        insuranceLow: 5, insuranceHigh: 11 },
      { id: "molar",     label: "대구치 (큰어금니)", low: 20, avg: 35, high: 50,
        insuranceLow: 7, insuranceHigh: 15 },
    ],
  },
  {
    id: "scaling",
    label: "스케일링",
    perTooth: false,
    insuranceAvailable: true,
    insuranceNote: "연 1회 건강보험 적용 (본인부담 20~30%)",
    options: [
      { id: "insured",    label: "보험 스케일링 (연 1회)", low: 15, avg: 18, high: 20,
        insuranceLow: 15, insuranceHigh: 20,
        insuranceCondition: "연 1회 한도" },
      { id: "uninsured",  label: "비보험 스케일링",        low: 50, avg: 75, high: 120 },
    ],
  },
  {
    id: "braces",
    label: "치아교정",
    perTooth: false,
    insuranceAvailable: false,
    options: [
      { id: "metal",       label: "메탈 교정",          low: 250, avg: 350, high: 450 },
      { id: "ceramic",     label: "세라믹 교정",        low: 350, avg: 480, high: 600 },
      { id: "lingual",     label: "설측 교정",          low: 500, avg: 700, high: 900 },
      { id: "clear",       label: "투명 교정 (인비절라인)", low: 400, avg: 600, high: 800 },
    ],
  },
  {
    id: "denture",
    label: "틀니",
    perTooth: false,
    insuranceAvailable: true,
    insuranceNote: "만 65세 이상 건강보험 적용 (본인부담 30%). 완전틀니·부분틀니 구분.",
    options: [
      { id: "full-insured",    label: "완전틀니 (보험)",  low: 50,  avg: 75,  high: 100,
        insuranceLow: 50, insuranceHigh: 100, insuranceCondition: "만 65세 이상" },
      { id: "partial-insured", label: "부분틀니 (보험)",  low: 40,  avg: 60,  high: 80,
        insuranceLow: 40, insuranceHigh: 80, insuranceCondition: "만 65세 이상" },
      { id: "uninsured",       label: "비보험 틀니",      low: 100, avg: 200, high: 300 },
    ],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const DTC_FAQS: FaqItem[] = [
  {
    question: "임플란트 비용이 병원마다 차이나는 이유는 무엇인가요?",
    answer: "임플란트 비용은 사용하는 픽스처(나사) 브랜드, 어버트먼트·크라운 재료, 뼈이식 여부, 병원 위치와 규모에 따라 크게 달라집니다. 이 계산기의 참고 범위는 국내 다수 병원의 비용 조사를 바탕으로 한 추정치입니다.",
  },
  {
    question: "임플란트 건강보험 적용 조건이 뭔가요?",
    answer: "만 65세 이상이면 임플란트 2개(평생)까지 건강보험이 적용됩니다. 본인부담률은 30%이며, 치아 상실 부위와 턱뼈 상태 등 조건이 맞아야 합니다. 정확한 적용 여부는 치과에서 확인하세요.",
  },
  {
    question: "크라운 재료 중 어느 게 가성비가 좋나요?",
    answer: "앞니는 심미성 때문에 지르코니아나 올세라믹을 많이 선택합니다. 어금니는 저작력이 중요해 금 크라운이나 지르코니아를 추천하는 경우가 많습니다. PFM은 비용이 저렴하지만 금속 테두리가 보일 수 있습니다. 재료 선택은 위치·기능·예산을 함께 고려하세요.",
  },
  {
    question: "치과 치료비를 실손보험으로 청구할 수 있나요?",
    answer: "일반 치과 치료(임플란트·교정 등)는 실손보험 적용 제외입니다. 다만 상해(사고)로 인한 치아 치료는 실손보험 청구가 가능할 수 있습니다. 별도 치과보험에 가입된 경우 약관을 확인하세요.",
  },
  {
    question: "치과 치료비 연말정산 의료비 공제를 받을 수 있나요?",
    answer: "네. 임플란트·크라운·교정 등 비보험 치과 치료비도 연말정산 의료비 세액공제 대상입니다. 총급여의 3% 초과분에 대해 15% 세액공제를 받을 수 있으며, 실손보험 수령액은 제외됩니다. 영수증을 챙겨두세요.",
  },
  {
    question: "스케일링은 보험 적용이 되나요?",
    answer: "연 1회에 한해 건강보험이 적용됩니다. 본인부담률은 20~30% 수준이며 1.5만~2만원 정도입니다. 연 1회 이후 추가 스케일링은 비보험으로 적용됩니다.",
  },
  {
    question: "견적이 높다고 나오면 어떻게 해야 하나요?",
    answer: "이 계산기의 참고 범위는 추정치입니다. 견적이 높다고 판단된다면 다른 치과에서 2~3곳 추가 상담을 받아보는 것을 권장합니다. 단, 재료 품질·술식 방법·경험 있는 의사 여부 등도 함께 고려해야 합니다.",
  },
  {
    question: "치아교정비도 연말정산 의료비 공제가 되나요?",
    answer: "기능적 목적(저작·발음 개선)의 교정은 의료비 공제 대상입니다. 단순 심미 목적의 교정은 공제 대상에서 제외될 수 있어 치과 영수증의 진료 내역을 확인하는 것이 좋습니다.",
  },
];

export const DTC_INSURANCE_TABLE = [
  { treatment: "임플란트",        condition: "만 65세 이상, 2개 한도", rate: "30%" },
  { treatment: "완전틀니",        condition: "만 65세 이상",           rate: "30%" },
  { treatment: "부분틀니",        condition: "만 65세 이상",           rate: "30%" },
  { treatment: "스케일링",        condition: "연 1회",                 rate: "20~30%" },
  { treatment: "충치 치료",       condition: "아말감·레진 수복",        rate: "30%" },
  { treatment: "신경치료",        condition: "조건 없음",              rate: "30%" },
  { treatment: "파노라마 X-ray",  condition: "조건 없음",              rate: "30%" },
];
```

---

## 3. 계산 로직

```js
function calculate(treatmentId, optionId, count, userPrice, useInsurance) {
  const treatment = treatments.find(t => t.id === treatmentId);
  const option = treatment.options.find(o => o.id === optionId);

  // 적용 단가 범위 (보험 여부)
  const low  = useInsurance && option.insuranceLow  ? option.insuranceLow  : option.low;
  const high = useInsurance && option.insuranceHigh ? option.insuranceHigh : option.high;
  const avg  = option.avg;

  // 총액
  const totalUser = userPrice * (treatment.perTooth ? count : 1);
  const totalLow  = low  * (treatment.perTooth ? count : 1);
  const totalHigh = high * (treatment.perTooth ? count : 1);
  const totalAvg  = avg  * (treatment.perTooth ? count : 1);

  // 게이지 위치 (0~100%)
  // 하한 이하 → 0%, 상한 이상 → 100%, 그 사이 → 선형 보간
  let gaugePos = 0;
  if (userPrice <= low) {
    gaugePos = 0;
  } else if (userPrice >= high) {
    gaugePos = 100;
  } else {
    gaugePos = Math.round(((userPrice - low) / (high - low)) * 100);
  }

  // 판단
  let verdict;
  if (userPrice < low) {
    verdict = "low";
  } else if (userPrice > high) {
    verdict = "high";
  } else {
    verdict = "normal";
  }

  // 절감액 (보험 적용 가능 시)
  const insuranceSaving = (option.insuranceLow && !useInsurance)
    ? (option.avg - option.avg * 0.3) * (treatment.perTooth ? count : 1)
    : null;

  return {
    verdict,
    gaugePos,
    totalUser,
    totalLow,
    totalHigh,
    totalAvg,
    low,
    high,
    avg,
    insuranceSaving,
    insuranceCondition: option.insuranceCondition ?? treatment.insuranceNote ?? null,
  };
}
```

### 판단 텍스트

| verdict | 배지 | 색상 | 설명 |
|---------|------|------|------|
| `low` | 낮음 (평균 이하) | 초록 | 참고 범위 하한 미만 |
| `normal` | 보통 (일반적 범위) | 파랑 | 참고 범위 내 |
| `high` | 높음 (평균 이상) | 주황 | 참고 범위 상한 초과 |

---

## 4. 화면 구성 (Astro 마크업)

```
[Hero]
  eyebrow: "치과 비용"
  title: "치과 치료비 비교 계산기"
  description: "병원 견적을 입력하면 전국 평균 대비 낮음·보통·높음을 즉시 판단합니다."

[치료 종류 탭 — Hero 아래]
  임플란트 / 크라운 / 인레이 / 충치 / 신경치료 / 스케일링 / 교정 / 틀니

[SimpleToolShell]
  aside (입력):
    [세부 옵션 선택] — 탭에 따라 동적 변경
    [개수] — perTooth=true일 때만 표시
    [병원 견적] — 1개당 금액 또는 총액
    [보험 적용 여부] — 적용 / 미적용 (보험 가능 치료만 표시)
    [지역] — 서울·수도권 / 지방 (선택, 향후 지역별 데이터 추가 대비)

  main (결과):
    [KPI 3개]
      - 적정성 판단 배지
      - 참고 범위 (하한~상한)
      - 총 예상 비용 (개수 반영)

    [게이지 바 — 핵심 차별화]
      하한 ━━━━[내 위치]━━━━ 상한

    [보험 적용 안내 배너] — 해당 치료가 보험 적용 가능한 경우

    [전체 참고 비용 표]
      현재 선택 치료의 재료별 비교

    [절세 안내 패널]
      연말정산 의료비 공제 / 실손보험 청구 가능 여부

[SeoContent + FAQ]
```

---

## 5. 컴포넌트 구조 (`dental-treatment-cost-calculator.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import {
  DTC_META, DTC_TREATMENTS, DTC_FAQS,
  DTC_INSURANCE_TABLE
} from "../../data/dentalTreatmentCost";
---
```

### config JSON

```astro
<script id="dtcConfig" type="application/json" set:html={JSON.stringify({
  treatments: DTC_TREATMENTS,
})} />
```

---

## 6. JS 로직 (`public/scripts/dental-treatment-cost-calculator.js`)

### 상태 관리

```js
function readState() {
  return {
    treatmentId: currentTreatmentId,
    optionId:    q("[data-dtc-option]")?.value,
    count:       parseNum(q("[data-dtc-count]")?.value) || 1,
    userPrice:   parseNum(q("[data-dtc-price]")?.value),    // 만원 단위
    useInsurance: q("[data-dtc-insurance]")?.value === "yes",
  };
}
```

### 치료 탭 전환

```js
function switchTreatment(id) {
  currentTreatmentId = id;
  const treatment = treatments.find(t => t.id === id);

  // 세부 옵션 셀렉트 업데이트
  const optionSelect = q("[data-dtc-option]");
  optionSelect.innerHTML = treatment.options
    .map(o => `<option value="${o.id}">${o.label}</option>`)
    .join("");

  // 개수 필드 표시/숨김
  const countField = q("[data-dtc-count-field]");
  if (countField) countField.hidden = !treatment.perTooth;

  // 보험 필드 표시/숨김
  const insuranceField = q("[data-dtc-insurance-field]");
  if (insuranceField) insuranceField.hidden = !treatment.insuranceAvailable;

  // 탭 하이라이트
  qa("[data-dtc-tab]").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.dtcTab === id);
  });

  update();
}
```

### 게이지 바 렌더링

```js
function renderGauge(result) {
  const bar = q("[data-dtc-gauge-fill]");
  const marker = q("[data-dtc-gauge-marker]");
  const lowLabel = q("[data-dtc-gauge-low]");
  const highLabel = q("[data-dtc-gauge-high]");
  const userLabel = q("[data-dtc-gauge-user]");

  if (bar) bar.style.width = `${result.gaugePos}%`;
  if (lowLabel) lowLabel.textContent = `${result.low}만원`;
  if (highLabel) highLabel.textContent = `${result.high}만원`;
  if (userLabel) userLabel.textContent = `내 견적 ${result.low <= result.avg && result.avg <= result.high ? '' : ''}${Math.round(result.totalUser / (state.count || 1))}만원`;
}
```

### 렌더링 주요 DOM 업데이트

```js
function render(result, state) {
  // 판단 배지
  const VERDICT_MAP = {
    low:    { label: "낮음 (평균 이하)",   cls: "dtc-verdict--low"    },
    normal: { label: "보통 (일반적 범위)", cls: "dtc-verdict--normal" },
    high:   { label: "높음 (평균 이상)",   cls: "dtc-verdict--high"   },
  };
  const badge = q("[data-dtc-verdict]");
  if (badge) {
    badge.textContent = VERDICT_MAP[result.verdict].label;
    badge.className = `dtc-verdict-badge ${VERDICT_MAP[result.verdict].cls}`;
  }

  // KPI
  setText("[data-dtc-range]", `${result.low}만~${result.high}만원`);
  setText("[data-dtc-total]", `${fmt(result.totalUser * 10000)}`);
  setText("[data-dtc-avg]",   `평균 약 ${result.avg}만원`);

  // 게이지
  renderGauge(result);

  // 보험 배너
  const insuranceBanner = q("[data-dtc-insurance-banner]");
  if (insuranceBanner) {
    const show = result.insuranceCondition && !state.useInsurance;
    insuranceBanner.hidden = !show;
    if (show) {
      const bannerText = q("[data-dtc-insurance-banner-text]");
      if (bannerText) bannerText.textContent = result.insuranceCondition;
    }
  }
}
```

### 이벤트 바인딩

```js
// 치료 탭
qa("[data-dtc-tab]").forEach(btn =>
  btn.addEventListener("click", () => switchTreatment(btn.dataset.dtcTab))
);

// 입력값 변경
["[data-dtc-option]", "[data-dtc-count]", "[data-dtc-price]", "[data-dtc-insurance]"]
  .forEach(sel => q(sel)?.addEventListener("input", update));

// 초기 실행 — 임플란트 탭
switchTreatment("implant");
```

---

## 7. SCSS (`src/styles/scss/pages/_dental-treatment-cost-calculator.scss`)

### 주요 클래스 계획

```scss
.dtc-page { /* CSS 변수 */
  --dtc-ink:    #172033;
  --dtc-muted:  #667085;
  --dtc-line:   #d8e0ea;
  --dtc-soft:   #f7f9fc;
  --dtc-blue:   #2563eb;
  --dtc-green:  #0f8a5f;
  --dtc-orange: #b45309;
}

/* 치료 종류 탭 */
.dtc-tab-grid     { /* flex wrap, 가로 스크롤 */ }
.dtc-tab-btn      { /* 개별 탭 버튼 */ }
.dtc-tab-btn.is-active { /* 선택 상태 */ }

/* KPI */
.dtc-kpi-grid     { /* 3열 */ }
.dtc-kpi-card     { /* 개별 카드 */ }
.dtc-kpi-card--main { /* 판단 결과 카드 강조 */ }

/* 판단 배지 */
.dtc-verdict-badge  { /* 공통 */ }
.dtc-verdict--low    { /* 초록 */ }
.dtc-verdict--normal { /* 파랑 */ }
.dtc-verdict--high   { /* 주황 */ }

/* 게이지 바 */
.dtc-gauge-wrap   { /* 게이지 컨테이너 */ }
.dtc-gauge-track  { /* 배경 트랙 */ }
.dtc-gauge-fill   { /* 채워지는 바 */ }
.dtc-gauge-labels { /* 하한/상한 라벨 */ }
.dtc-gauge-marker { /* 내 견적 위치 마커 */ }

/* 보험 배너 */
.dtc-insurance-banner { /* 파란 배너 */ }

/* 참고 비용 표 */
.dtc-ref-table    { /* 치료별 비교 표 */ }

/* 절세 안내 */
.dtc-tax-panel    { /* 연말정산·실손 안내 카드 */ }
```

### import 추가 위치 (`src/styles/app.scss`)

```scss
@use 'scss/pages/dental-treatment-cost-calculator';
```

---

## 8. 핵심 UI — 게이지 바 마크업

```html
<div class="dtc-gauge-wrap">
  <div class="dtc-gauge-header">
    <span>참고 범위 내 내 견적 위치</span>
    <span data-dtc-gauge-user class="dtc-gauge-user-label">-</span>
  </div>
  <div class="dtc-gauge-track">
    <div class="dtc-gauge-fill" data-dtc-gauge-fill style="width: 0%"></div>
    <div class="dtc-gauge-marker" data-dtc-gauge-marker></div>
  </div>
  <div class="dtc-gauge-labels">
    <span data-dtc-gauge-low>하한</span>
    <span>참고 범위</span>
    <span data-dtc-gauge-high>상한</span>
  </div>
</div>
```

---

## 9. tools.ts 등록

```ts
{
  slug: "dental-treatment-cost-calculator",
  title: "치과 치료비 비교 계산기",
  description: "임플란트·크라운·충치·교정 견적을 입력하면 전국 평균 대비 낮음·보통·높음을 즉시 판단. 건강보험 적용 조건 안내 포함.",
  order: 62.5,
  category: "생활",
  badges: ["NEW"],
  eyebrow: "치과 비용",
  previewStats: [
    { label: "치료 종류", value: "8종" },
    { label: "재료 옵션", value: "20+" },
  ],
},
```

---

## 10. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/tools/dental-treatment-cost-calculator/</loc>
  <lastmod>2026-06-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 11. 구현 순서

| 단계 | 작업 | 체크 |
|------|------|------|
| 1 | `src/data/dentalTreatmentCost.ts` 생성 | ☐ |
| 2 | `_dental-treatment-cost-calculator.scss` 생성 + `app.scss` import | ☐ |
| 3 | `dental-treatment-cost-calculator.astro` 생성 | ☐ |
| 4 | `dental-treatment-cost-calculator.js` 생성 | ☐ |
| 5 | `src/data/tools.ts` 등록 | ☐ |
| 6 | `public/sitemap.xml` URL 추가 | ☐ |
| 7 | `npm run build` 검증 | ☐ |
| 8 | 탭 전환 시 옵션·개수 필드 동적 변경 확인 | ☐ |
| 9 | 게이지 바 위치 계산 확인 (하한 이하 0%, 상한 이상 100%) | ☐ |
| 10 | 보험 적용 배너 표시/숨김 동작 확인 | ☐ |
| 11 | 모바일 탭 가로 스크롤 확인 | ☐ |

---

## 12. QA 포인트

- 임플란트 탭 → 국산/수입 옵션 전환 시 참고 범위 즉시 갱신
- perTooth=false 치료(스케일링·교정·틀니) 시 개수 필드 hidden 처리
- 보험 적용 가능 치료 선택 시 보험 필드 표시, 불가능 시 hidden
- 견적 입력값 0 또는 미입력 시 게이지 0% / 결과 "-" 표시
- 게이지 fill이 100% 초과하지 않도록 clamp 처리
- InfoNotice 면책: "참고 비용은 시장 조사 기반 추정 범위이며, 실제 치료비는 병원·재료·술식에 따라 크게 달라질 수 있습니다."
