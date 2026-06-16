# 강아지·고양이 월 양육비 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/pet-monthly-cost-calculator`
- **유형**: 계산기 (SimpleToolShell)
- **prefix**: `pmc-`
- **데이터 파일**: `src/data/petMonthlyCost2026.ts`

---

## 2. 화면 구성

```
[SimpleToolShell]
  slot:aside (입력 패널)
    - 탭: 강아지 / 고양이
    - 입력 항목 (슬라이더 + 숫자)
    - 선택 항목 토글

  slot:main (결과 패널)
    - KPI 카드 4개
    - 도넛 차트
    - 비교 인사이트
    - 관련 링크
    - SeoContent
```

---

## 3. 데이터 파일 (`src/data/petMonthlyCost2026.ts`)

```ts
export type PetType = "dog" | "cat";

export interface PetCostItem {
  id: string;
  label: string;
  defaultDog: number;
  defaultCat: number;
  min: number;
  max: number;
  step: number;
  required: boolean;         // false = 선택 항목 (토글)
  unit: "월" | "월평균";
  hint: string;              // 슬라이더 옆 작은 설명
}

export const PET_COST_ITEMS: PetCostItem[] = [
  {
    id: "food",
    label: "사료비",
    defaultDog: 60_000,
    defaultCat: 50_000,
    min: 10_000, max: 300_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "사료 브랜드·체중에 따라 차이 큼",
  },
  {
    id: "snack",
    label: "간식비",
    defaultDog: 20_000,
    defaultCat: 15_000,
    min: 0, max: 100_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "트릿·캔·습식 포함",
  },
  {
    id: "litter",
    label: "모래·패드",
    defaultDog: 10_000,
    defaultCat: 25_000,
    min: 0, max: 80_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "강아지: 배변패드 / 고양이: 화장실 모래",
  },
  {
    id: "medical",
    label: "병원·예방접종",
    defaultDog: 30_000,
    defaultCat: 20_000,
    min: 0, max: 200_000, step: 5_000,
    required: true,
    unit: "월평균",
    hint: "연간 병원비를 12로 나눈 월 평균값",
  },
  {
    id: "grooming",
    label: "미용비",
    defaultDog: 50_000,
    defaultCat: 10_000,
    min: 0, max: 200_000, step: 5_000,
    required: true,
    unit: "월평균",
    hint: "강아지: 6~8주 주기 / 고양이: 장모종만 해당",
  },
  {
    id: "toys",
    label: "장난감·용품",
    defaultDog: 10_000,
    defaultCat: 10_000,
    min: 0, max: 100_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "리드줄·옷·장난감·화장실용품 등",
  },
  {
    id: "insurance",
    label: "펫보험",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 100_000, step: 5_000,
    required: false,         // 선택 항목
    unit: "월",
    hint: "미가입이면 0원. 가입 시 30,000~60,000원 수준",
  },
  {
    id: "hotel",
    label: "호텔·돌봄비",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 200_000, step: 10_000,
    required: false,
    unit: "월평균",
    hint: "여행·출장 시 펫시터·호텔 비용",
  },
  {
    id: "training",
    label: "훈련·교육비",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 100_000, step: 10_000,
    required: false,
    unit: "월평균",
    hint: "강아지 훈련소·개인 교육 포함",
  },
];

export const PMC_TAX_RATE = 0;  // 비용 계산, 세금 불필요

export interface FaqItem { question: string; answer: string; }
export const PMC_FAQ: FaqItem[] = [
  {
    question: "강아지와 고양이 중 어느 쪽이 더 비싸게 드나요?",
    answer: "일반적으로 강아지가 더 많이 듭니다. 미용비가 큰 비중을 차지하며, 대형견은 사료비도 고양이보다 2~3배 높습니다. 고양이는 모래 비용이 추가되지만 미용비가 낮아 평균적으로 강아지보다 월 5~15만원 적게 지출됩니다.",
  },
  {
    question: "병원비 기본값이 월 2~3만원인데 너무 적지 않나요?",
    answer: "이 값은 연간 병원비(예방접종·정기검진 포함 평균 30~40만원)를 12개월로 나눈 월 평균값입니다. 실제로는 건강한 달에는 0원, 아픈 달에는 수십만원이 나오는 구조입니다. 만약 노령 반려동물이라면 2~3배 높게 설정하세요.",
  },
  {
    question: "펫보험에 가입하면 실제로 절약이 되나요?",
    answer: "건강한 반려동물은 단기적으로 비보험이 유리할 수 있습니다. 하지만 큰 수술(십자인대·디스크·종양 등) 한 번이면 보험 미가입 시 200~500만원이 한꺼번에 나갑니다. 펫보험 손익 계산기에서 자세히 비교해보세요.",
  },
  {
    question: "계산값이 실제와 많이 다를 수 있나요?",
    answer: "기본값은 소형견·성묘 기준 국내 평균 데이터를 바탕으로 합니다. 대형견·노령 반려동물·특수 식이요법이 필요한 경우 실제 비용이 2배 이상 차이날 수 있습니다. 각 항목을 본인 상황에 맞게 직접 조정하세요.",
  },
  {
    question: "10년 비용이 너무 많은 것 같아요. 정말 이만큼 드나요?",
    answer: "월 20만원 기준으로도 10년이면 2,400만원입니다. 여기에 분양비, 예상치 못한 수술비, 노령기 의료비 증가를 합산하면 3,000~5,000만원이 현실적인 수치입니다. 입양 전 장기 비용 계획이 중요한 이유입니다.",
  },
  {
    question: "고양이 모래 비용은 왜 월 2~3만원씩 드나요?",
    answer: "두부 모래·벤토나이트·실리카겔 등 종류에 따라 2~5만원 수준이며, 멀티캣 가정은 더 높습니다. 자동 화장실을 사용하면 초기 구입비가 높지만 모래 사용량을 줄일 수 있습니다.",
  },
];

export const PMC_RELATED_LINKS = [
  { href: "/reports/pet-breed-10year-cost-comparison/", label: "품종별 10년 총비용 비교", description: "말티즈·골든리트리버·렉돌 등 14종 비교" },
  { href: "/tools/pet-insurance-calculator/", label: "펫보험 손익 계산기", description: "보험 가입 vs 비가입 누적 비용 비교" },
];

export const PMC_META = {
  slug: "pet-monthly-cost-calculator",
  title: "강아지·고양이 월 양육비 계산기 2026",
  description: "강아지·고양이 사료, 병원비, 미용, 간식 등 항목별 월 양육비를 계산하고 연간·10년 누적 비용을 확인하세요.",
};

export const PMC_INSIGHT_TEMPLATES = {
  coffee: (monthly: number) => `월 양육비는 커피(5,000원) 약 ${Math.round(monthly / 5000)}잔에 해당합니다.`,
  daily: (monthly: number) => `하루 평균 ${Math.round(monthly / 30).toLocaleString()}원이 드는 셈입니다.`,
  comparison: (dog: number, cat: number) =>
    dog > cat
      ? `강아지가 고양이보다 월 ${(dog - cat).toLocaleString()}원 더 듭니다.`
      : `고양이가 강아지보다 월 ${(cat - dog).toLocaleString()}원 더 듭니다.`,
};
```

---

## 4. Astro 페이지 구조 (`src/pages/tools/pet-monthly-cost-calculator.astro`)

```astro
---
import SimpleToolShell from "../../layouts/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { PET_COST_ITEMS, PMC_FAQ, PMC_RELATED_LINKS, PMC_META } from "../../data/petMonthlyCost2026";

const required = PET_COST_ITEMS.filter(i => i.required);
const optional = PET_COST_ITEMS.filter(i => !i.required);
const config = { items: PET_COST_ITEMS };
---

<SimpleToolShell
  calculatorId="pet-monthly-cost-calculator"
  pageClass="pmc-page"
  title={PMC_META.title}
  description={PMC_META.description}
  resultFirst={false}
>
  <!-- slot:aside — 입력 패널 -->
  <div slot="aside">
    <!-- 펫 탭 -->
    <div class="pmc-pet-tabs" role="tablist">
      <button class="pmc-pet-tab is-active" data-pmc-pet="dog">🐶 강아지</button>
      <button class="pmc-pet-tab" data-pmc-pet="cat">🐱 고양이</button>
    </div>

    <!-- 필수 항목 -->
    <div class="pmc-section-label">기본 항목</div>
    {required.map(item => (
      <label class="pmc-field">
        <div class="pmc-field-header">
          <span class="pmc-field-label">{item.label}</span>
          <span class="pmc-field-unit">{item.unit}</span>
        </div>
        <input
          type="range"
          class="pmc-slider"
          data-pmc-item={item.id}
          min={item.min}
          max={item.max}
          step={item.step}
          value={item.defaultDog}
          data-default-dog={item.defaultDog}
          data-default-cat={item.defaultCat}
        />
        <div class="pmc-field-row">
          <span class="pmc-hint">{item.hint}</span>
          <input
            type="text"
            class="pmc-number"
            data-pmc-num={item.id}
            inputmode="numeric"
            value={item.defaultDog.toLocaleString()}
          />
          <span class="pmc-unit-label">원</span>
        </div>
      </label>
    ))}

    <!-- 선택 항목 토글 -->
    <button class="pmc-toggle-optional" data-pmc-toggle="optional">
      + 선택 항목 추가
    </button>
    <div class="pmc-optional-wrap" hidden>
      <div class="pmc-section-label">선택 항목</div>
      {optional.map(item => (
        <label class="pmc-field">
          <div class="pmc-field-header">
            <span class="pmc-field-label">{item.label}</span>
            <span class="pmc-field-unit">{item.unit}</span>
          </div>
          <input
            type="range"
            class="pmc-slider"
            data-pmc-item={item.id}
            min={item.min}
            max={item.max}
            step={item.step}
            value={0}
            data-default-dog={item.defaultDog}
            data-default-cat={item.defaultCat}
          />
          <div class="pmc-field-row">
            <span class="pmc-hint">{item.hint}</span>
            <input
              type="text"
              class="pmc-number"
              data-pmc-num={item.id}
              inputmode="numeric"
              value="0"
            />
            <span class="pmc-unit-label">원</span>
          </div>
        </label>
      ))}
    </div>
  </div>

  <!-- slot:main — 결과 패널 -->
  <div slot="main">
    <InfoNotice
      title="참고 안내"
      lines={[
        "소형견·성묘 기준 평균 데이터입니다. 품종·크기·건강 상태에 따라 실제 비용은 크게 달라집니다.",
        "병원비는 연간 총액을 12개월로 나눈 월 평균값으로 입력하세요.",
      ]}
    />

    <!-- KPI -->
    <div class="pmc-kpi-grid">
      <div class="pmc-kpi-card pmc-kpi-card--primary">
        <span class="pmc-kpi-label">월 총 양육비</span>
        <strong class="pmc-kpi-value" data-pmc-result="monthly">—</strong>
      </div>
      <div class="pmc-kpi-card">
        <span class="pmc-kpi-label">연간 총 비용</span>
        <strong class="pmc-kpi-value" data-pmc-result="annual">—</strong>
      </div>
      <div class="pmc-kpi-card">
        <span class="pmc-kpi-label">10년 누적 비용</span>
        <strong class="pmc-kpi-value" data-pmc-result="ten-year">—</strong>
      </div>
      <div class="pmc-kpi-card">
        <span class="pmc-kpi-label">하루 평균 비용</span>
        <strong class="pmc-kpi-value" data-pmc-result="daily">—</strong>
      </div>
    </div>

    <!-- 도넛 차트 -->
    <div class="pmc-chart-section">
      <h3 class="pmc-chart-title">항목별 지출 비율</h3>
      <div class="pmc-chart-wrap">
        <canvas id="pmcDonutChart"></canvas>
      </div>
    </div>

    <!-- 인사이트 -->
    <div class="pmc-insight-box">
      <p data-pmc-result="insight-coffee"></p>
      <p data-pmc-result="insight-daily"></p>
    </div>

    <!-- 관련 링크 -->
    <div class="pmc-related-section">
      <h3>함께 확인하면 좋은 계산기</h3>
      <div class="pmc-related-grid">
        {PMC_RELATED_LINKS.map(link => (
          <a href={link.href} class="pmc-related-card">
            <span class="pmc-related-label">{link.label}</span>
            <span class="pmc-related-desc">{link.description}</span>
          </a>
        ))}
      </div>
    </div>

    <SeoContent
      introTitle="반려동물 양육비, 미리 알고 준비하세요"
      intro={[/* 5개 문단 */]}
      faq={PMC_FAQ}
    />
  </div>
</SimpleToolShell>

<script id="pmcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/pet-monthly-cost-calculator.js" defer></script>
```

---

## 5. JS 로직 (`public/scripts/pet-monthly-cost-calculator.js`)

### 상태

```js
const state = {
  petType: "dog",     // "dog" | "cat"
  values: {},         // { [itemId]: number }
};
```

### 초기화

```js
function init() {
  const cfg = JSON.parse(document.getElementById("pmcConfig").textContent);
  cfg.items.forEach(item => {
    state.values[item.id] = item.defaultDog;
  });
  bindPetTabs();
  bindSliders();
  bindNumbers();
  bindOptionalToggle();
  loadChartJs(() => {
    initChart();
    update();
  });
}
```

### 계산

```js
function calculate() {
  const monthly = Object.values(state.values).reduce((s, v) => s + v, 0);
  return {
    monthly,
    annual: monthly * 12,
    tenYear: monthly * 12 * 10,
    daily: Math.round(monthly / 30),
  };
}
```

### 펫 탭 전환

```js
function switchPet(petType) {
  state.petType = petType;
  // 슬라이더·숫자 기본값 교체
  document.querySelectorAll("[data-pmc-item]").forEach(slider => {
    const key = petType === "dog" ? "defaultDog" : "defaultCat";
    const val = Number(slider.dataset[key]);
    slider.value = val;
    state.values[slider.dataset.pmcItem] = val;
    // 연결된 숫자 input 업데이트
    const numEl = document.querySelector(`[data-pmc-num="${slider.dataset.pmcItem}"]`);
    if (numEl) numEl.value = val.toLocaleString();
  });
  update();
}
```

### 차트

```js
// 도넛 차트: 항목별 비율
// 색상: 사료(파랑), 병원(초록), 미용(보라), 간식(주황), 모래(회색), 기타(연회색)
const ITEM_COLORS = {
  food: "#1a56db",
  snack: "#d97706",
  litter: "#64748b",
  medical: "#059669",
  grooming: "#7c3aed",
  toys: "#0891b2",
  insurance: "#be185d",
  hotel: "#92400e",
  training: "#374151",
};
```

### URL 파라미터 저장

```js
// ?pet=dog&food=60000&snack=20000&... 형태로 상태 보존
function syncUrl() {
  const params = new URLSearchParams();
  params.set("pet", state.petType);
  Object.entries(state.values).forEach(([k, v]) => params.set(k, v));
  history.replaceState(null, "", "?" + params.toString());
}
```

---

## 6. SCSS (`src/styles/scss/pages/_pet-monthly-cost-calculator.scss`)

prefix: `pmc-`

```scss
.pmc-page {
  // 펫 탭
  .pmc-pet-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .pmc-pet-tab {
    padding: 0.625rem;
    border: 2px solid var(--color-border);
    border-radius: 0.5rem;
    background: transparent;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;

    &.is-active {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: #fff;
    }
  }

  // 필드
  .pmc-section-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 1rem 0 0.5rem;
  }

  .pmc-field { margin-bottom: 1rem; }

  .pmc-field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .pmc-field-label { font-size: 0.875rem; font-weight: 500; }
  .pmc-field-unit { font-size: 0.75rem; color: var(--color-text-muted); }

  .pmc-field-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .pmc-hint {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    flex: 1;
  }

  .pmc-number {
    width: 90px;
    text-align: right;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .pmc-unit-label { font-size: 0.8125rem; color: var(--color-text-muted); }

  // 선택 항목 토글
  .pmc-toggle-optional {
    width: 100%;
    padding: 0.5rem;
    border: 1px dashed var(--color-border);
    border-radius: 0.375rem;
    background: transparent;
    font-size: 0.875rem;
    color: var(--color-primary);
    cursor: pointer;
    margin-top: 0.5rem;
  }

  // KPI
  .pmc-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin: 1.5rem 0;

    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }

  .pmc-kpi-card {
    background: var(--color-surface);
    border-radius: 0.625rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--primary { background: var(--color-primary); color: #fff; }
    &--primary .pmc-kpi-label { color: rgba(255,255,255,0.8); }
    &--primary .pmc-kpi-value { color: #fff; }
  }

  .pmc-kpi-label { font-size: 0.75rem; color: var(--color-text-muted); }
  .pmc-kpi-value { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); }

  // 도넛 차트
  .pmc-chart-section { margin: 2rem 0; }
  .pmc-chart-title { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
  .pmc-chart-wrap {
    max-width: 300px;
    margin: 0 auto;
    height: 260px;
    position: relative;
  }

  // 인사이트
  .pmc-insight-box {
    background: var(--color-surface);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--color-text);

    p + p { margin-top: 0.25rem; }
  }

  // 관련 링크
  .pmc-related-section { margin: 2rem 0; }
  .pmc-related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    @media (min-width: 560px) { grid-template-columns: repeat(2, 1fr); }
  }

  .pmc-related-card {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: border-color 0.15s;

    &:hover { border-color: var(--color-primary); }
  }

  .pmc-related-label { font-weight: 600; color: var(--color-text); font-size: 0.9375rem; }
  .pmc-related-desc { font-size: 0.8125rem; color: var(--color-text-muted); }
}
```

---

## 7. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | order 주변 값 확인 후 추가 (반려동물 카테고리 신규) |
| `src/styles/app.scss` | `@use 'scss/pages/pet-monthly-cost-calculator';` |
| `public/sitemap.xml` | `/tools/pet-monthly-cost-calculator/` 추가 |
| `src/pages/index.astro` | topicBySlug에 `"pet-monthly-cost-calculator": "반려동물"` 추가 |

---

## 8. QA 포인트

- [ ] 강아지/고양이 탭 전환 시 슬라이더·숫자 기본값 정상 교체
- [ ] 슬라이더 ↔ 숫자 input 양방향 동기화
- [ ] 선택 항목 토글 후 계산에 반영
- [ ] 도넛 차트 항목 0원 시 차트에서 제외
- [ ] URL 파라미터 저장/복원 동작 확인
- [ ] 모바일 375px에서 슬라이더 조작 편의성 확인
- [ ] `npm run build` 오류 없음
