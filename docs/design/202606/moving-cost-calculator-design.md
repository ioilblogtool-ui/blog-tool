# 포장이사 비용 계산기 — 설계 문서

> 기획 원본: `docs/plan/202606/moving-cost-calculator-plan.md`  
> 작성일: 2026-06-19  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `moving-cost-calculator`  
> prefix: `mcc-`

---

## 1. 파일 구조

```text
src/data/movingCostCalculator.ts
src/pages/tools/moving-cost-calculator.astro
public/scripts/moving-cost-calculator.js
src/styles/scss/pages/_moving-cost-calculator.scss
```

등록 위치:

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | tools 목록에 `moving-cost-calculator` 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/moving-cost-calculator';` 추가 |
| `public/sitemap.xml` | `/tools/moving-cost-calculator/` 추가 |

---

## 2. 데이터 파일 (`src/data/movingCostCalculator.ts`)

```ts
export type MovingType = "full" | "semi" | "basic";
export type LadderOption = "none" | "from" | "to" | "both";
export type FloorRange = "1-5" | "6-10" | "11-15" | "16+";
export type VolumeLevel = "low" | "normal" | "high";
export type RegionType = "metro" | "city" | "local";

export interface RangeAmount {
  min: number;
  max: number;
}

export interface MovingBaseBand {
  id: string;
  label: string;
  minPyeong: number;
  maxPyeong: number;
  full: RangeAmount;
  semiRate: number;
  basicRate: number;
  note: string;
}

export const MCC_BASE_BANDS: MovingBaseBand[] = [
  {
    id: "studio",
    label: "원룸·5평 이하",
    minPyeong: 0,
    maxPyeong: 5,
    full: { min: 250000, max: 450000 },
    semiRate: 0.8,
    basicRate: 0.65,
    note: "짐 양이 적고 엘리베이터 작업이면 하단 가능",
  },
  {
    id: "ten",
    label: "10평 전후",
    minPyeong: 6,
    maxPyeong: 13,
    full: { min: 450000, max: 750000 },
    semiRate: 0.82,
    basicRate: 0.68,
    note: "투룸·소형 오피스텔 기준",
  },
  {
    id: "eighteen",
    label: "18평 전후",
    minPyeong: 14,
    maxPyeong: 21,
    full: { min: 750000, max: 1150000 },
    semiRate: 0.85,
    basicRate: 0.7,
    note: "소형 아파트·신혼 가구 기준",
  },
  {
    id: "twenty-four",
    label: "24평 전후",
    minPyeong: 22,
    maxPyeong: 29,
    full: { min: 1000000, max: 1500000 },
    semiRate: 0.85,
    basicRate: 0.72,
    note: "2~4인 가구에서 가장 많이 찾는 구간",
  },
  {
    id: "thirty-four",
    label: "34평 전후",
    minPyeong: 30,
    maxPyeong: 39,
    full: { min: 1500000, max: 2300000 },
    semiRate: 0.88,
    basicRate: 0.75,
    note: "작업 인원·차량 톤수 증가 구간",
  },
  {
    id: "large",
    label: "40평 이상",
    minPyeong: 40,
    maxPyeong: 99,
    full: { min: 2200000, max: 3500000 },
    semiRate: 0.9,
    basicRate: 0.78,
    note: "방문 견적 권장",
  },
];

export const MCC_TYPE_OPTIONS = [
  { value: "full", label: "포장이사", description: "포장·운반·정리까지 맡기는 방식" },
  { value: "semi", label: "반포장이사", description: "큰 짐 중심, 잔짐 일부 직접 정리" },
  { value: "basic", label: "일반이사", description: "포장을 직접 하고 운반 중심으로 맡김" },
] as const;

export const MCC_LADDER_OPTIONS = [
  { value: "none", label: "없음", min: 0, max: 0 },
  { value: "from", label: "출발지만", min: 100000, max: 200000 },
  { value: "to", label: "도착지만", min: 100000, max: 200000 },
  { value: "both", label: "양쪽 모두", min: 200000, max: 400000 },
] as const;

export const MCC_FLOOR_OPTIONS = [
  { value: "1-5", label: "1~5층", ladderFactor: 0.85 },
  { value: "6-10", label: "6~10층", ladderFactor: 1 },
  { value: "11-15", label: "11~15층", ladderFactor: 1.15 },
  { value: "16+", label: "16층 이상", ladderFactor: 1.3 },
] as const;

export const MCC_VOLUME_OPTIONS = [
  { value: "low", label: "적음", factor: 0.9 },
  { value: "normal", label: "보통", factor: 1 },
  { value: "high", label: "많음", factor: 1.15 },
] as const;

export const MCC_REGION_OPTIONS = [
  { value: "metro", label: "수도권", minFactor: 1, maxFactor: 1 },
  { value: "city", label: "광역시", minFactor: 0.95, maxFactor: 1.05 },
  { value: "local", label: "지방", minFactor: 0.9, maxFactor: 1 },
] as const;

export const MCC_DISTANCE_PRESETS = [
  { value: 5, label: "같은 동네" },
  { value: 20, label: "같은 시·군" },
  { value: 50, label: "인접 시·군" },
  { value: 100, label: "장거리" },
] as const;

export const MCC_CHECKLIST = [
  {
    id: "elevator",
    label: "엘리베이터 사용 예약",
    risk: "중간",
    description: "관리사무소 예약·보양 작업 여부를 확인하세요.",
  },
  {
    id: "ladder-space",
    label: "사다리차 진입 공간",
    risk: "높음",
    description: "도로 폭, 주차 공간, 전선 여부에 따라 작업 방식이 바뀔 수 있습니다.",
  },
  {
    id: "built-in",
    label: "붙박이장·시스템장 분해",
    risk: "중간",
    description: "분해·설치가 별도 비용으로 빠지는지 확인하세요.",
  },
  {
    id: "aircon",
    label: "에어컨 이전 설치",
    risk: "높음",
    description: "철거·배관·가스 충전은 별도 견적인 경우가 많습니다.",
  },
  {
    id: "heavy",
    label: "피아노·금고·대형 가전",
    risk: "높음",
    description: "특수 운반비가 붙을 수 있습니다.",
  },
  {
    id: "waste",
    label: "폐기물·입주청소",
    risk: "중간",
    description: "이사비 포함인지 별도 계약인지 구분하세요.",
  },
] as const;

export const MCC_META = {
  slug: "moving-cost-calculator",
  title: "포장이사 비용 계산기｜24평·34평 이사 견적 얼마가 적당할까?",
  description: "평수, 이동 거리, 사다리차, 손없는날, 포장 여부를 입력하면 포장이사 예상 견적 범위와 추가비 체크리스트를 추정합니다.",
  updatedAt: "2026-06-19",
  caution: "이 계산기는 참고용 추정 견적입니다. 실제 이사비용은 업체, 지역, 날짜, 짐 양, 작업 난이도에 따라 달라질 수 있습니다.",
};

export const MCC_DEFAULTS = {
  pyeong: 24,
  distanceKm: 20,
  type: "full" as MovingType,
  ladder: "both" as LadderOption,
  floor: "6-10" as FloorRange,
  peak: false,
  volume: "normal" as VolumeLevel,
  region: "metro" as RegionType,
};

export const MCC_FAQ = [
  {
    question: "24평 포장이사 비용은 보통 얼마인가요?",
    answer: "짐 양이 보통이고 같은 지역 이동이라면 대략 100만~150만원 수준을 기준으로 볼 수 있습니다. 사다리차 양쪽 사용, 손없는날, 장거리 이동이 겹치면 150만원 이상으로 올라갈 수 있습니다.",
  },
  {
    question: "34평 포장이사 견적은 어느 정도가 적당한가요?",
    answer: "34평은 작업 인원과 차량 톤수가 커져 24평보다 견적 상승 폭이 큽니다. 일반적으로 150만~230만원 범위를 참고하되, 짐이 많거나 특수 작업이 있으면 더 높아질 수 있습니다.",
  },
  {
    question: "손없는날 이사는 왜 더 비싼가요?",
    answer: "손없는날, 주말, 월말은 이사 수요가 몰리는 날짜라 작업팀과 차량 배정이 빠듯합니다. 같은 조건이라도 일반 평일보다 10~25% 높게 제시될 수 있습니다.",
  },
  {
    question: "사다리차 비용은 이사 견적에 포함되나요?",
    answer: "업체마다 다릅니다. 견적서에 사다리차가 포함인지, 출발지와 도착지 양쪽 모두 포함인지 반드시 확인해야 합니다.",
  },
  {
    question: "포장이사와 반포장이사는 얼마나 차이 나나요?",
    answer: "반포장이사는 잔짐 정리를 일부 직접 하는 대신 포장이사보다 대략 10~20% 낮게 제시되는 경우가 많습니다. 다만 짐 양과 업체 정책에 따라 차이가 줄어들 수 있습니다.",
  },
];
```

---

## 3. 화면 구성 (`src/pages/tools/moving-cost-calculator.astro`)

```astro
---
import SimpleToolShell from "@/layouts/SimpleToolShell.astro";
import CalculatorHero from "@/components/CalculatorHero.astro";
import InfoNotice from "@/components/InfoNotice.astro";
import SeoContent from "@/components/SeoContent.astro";
import {
  MCC_BASE_BANDS,
  MCC_CHECKLIST,
  MCC_DEFAULTS,
  MCC_DISTANCE_PRESETS,
  MCC_FAQ,
  MCC_FLOOR_OPTIONS,
  MCC_LADDER_OPTIONS,
  MCC_META,
  MCC_REGION_OPTIONS,
  MCC_TYPE_OPTIONS,
  MCC_VOLUME_OPTIONS,
} from "@/data/movingCostCalculator";

const config = {
  baseBands: MCC_BASE_BANDS,
  defaults: MCC_DEFAULTS,
  ladderOptions: MCC_LADDER_OPTIONS,
  floorOptions: MCC_FLOOR_OPTIONS,
  volumeOptions: MCC_VOLUME_OPTIONS,
  regionOptions: MCC_REGION_OPTIONS,
};
---

<SimpleToolShell calculatorId="moving-cost-calculator" pageClass="mcc-page" resultFirst={true}>
  <CalculatorHero
    slot="hero"
    title={MCC_META.title}
    description={MCC_META.description}
  />

  <div slot="aside">
    <div class="mcc-section">
      <h2 class="mcc-section-title">이사 조건</h2>

      <label class="mcc-field">
        <span class="mcc-label">주거 평수</span>
        <div class="mcc-preset-grid">
          <button type="button" class="mcc-preset" data-mcc-pyeong="5">원룸</button>
          <button type="button" class="mcc-preset" data-mcc-pyeong="10">10평</button>
          <button type="button" class="mcc-preset" data-mcc-pyeong="18">18평</button>
          <button type="button" class="mcc-preset is-active" data-mcc-pyeong="24">24평</button>
          <button type="button" class="mcc-preset" data-mcc-pyeong="34">34평</button>
        </div>
        <div class="mcc-input-row">
          <input data-mcc="pyeong" type="number" min="1" max="80" value={MCC_DEFAULTS.pyeong} />
          <span>평</span>
        </div>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">이동 거리</span>
        <div class="mcc-preset-grid mcc-preset-grid--distance">
          {MCC_DISTANCE_PRESETS.map((preset) => (
            <button type="button" class="mcc-preset" data-mcc-distance={preset.value}>
              {preset.label}
            </button>
          ))}
        </div>
        <input data-mcc="distanceKm" type="range" min="1" max="200" step="1" value={MCC_DEFAULTS.distanceKm} />
        <div class="mcc-input-row">
          <input data-mcc-num="distanceKm" type="text" inputmode="numeric" value={MCC_DEFAULTS.distanceKm} />
          <span>km</span>
        </div>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">이사 방식</span>
        <select data-mcc="type" class="mcc-select">
          {MCC_TYPE_OPTIONS.map((option) => (
            <option value={option.value} selected={option.value === MCC_DEFAULTS.type}>{option.label}</option>
          ))}
        </select>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">사다리차</span>
        <select data-mcc="ladder" class="mcc-select">
          {MCC_LADDER_OPTIONS.map((option) => (
            <option value={option.value} selected={option.value === MCC_DEFAULTS.ladder}>{option.label}</option>
          ))}
        </select>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">층수 조건</span>
        <select data-mcc="floor" class="mcc-select">
          {MCC_FLOOR_OPTIONS.map((option) => (
            <option value={option.value} selected={option.value === MCC_DEFAULTS.floor}>{option.label}</option>
          ))}
        </select>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">짐 양</span>
        <select data-mcc="volume" class="mcc-select">
          {MCC_VOLUME_OPTIONS.map((option) => (
            <option value={option.value} selected={option.value === MCC_DEFAULTS.volume}>{option.label}</option>
          ))}
        </select>
      </label>

      <label class="mcc-field">
        <span class="mcc-label">지역</span>
        <select data-mcc="region" class="mcc-select">
          {MCC_REGION_OPTIONS.map((option) => (
            <option value={option.value} selected={option.value === MCC_DEFAULTS.region}>{option.label}</option>
          ))}
        </select>
      </label>

      <label class="mcc-toggle">
        <input data-mcc-bool="peak" type="checkbox" checked={MCC_DEFAULTS.peak} />
        <span>손없는날·주말·월말 이사</span>
      </label>
    </div>
  </div>

  <div slot="main">
    <InfoNotice
      title="계산 기준 안내"
      lines={[
        "이 계산기는 입력 조건을 바탕으로 한 참고용 추정 견적입니다.",
        "실제 이사비용은 업체, 지역, 날짜, 짐 양, 작업 난이도에 따라 달라질 수 있습니다.",
      ]}
    />

    <div class="mcc-kpi-grid">
      <div class="mcc-kpi-card mcc-kpi-card--primary">
        <span>예상 견적 범위</span>
        <strong data-mcc-result="range">—</strong>
        <small>추정</small>
      </div>
      <div class="mcc-kpi-card">
        <span>기준 견적</span>
        <strong data-mcc-result="midpoint">—</strong>
      </div>
      <div class="mcc-kpi-card">
        <span>추가비 예상</span>
        <strong data-mcc-result="extra">—</strong>
      </div>
      <div class="mcc-kpi-card">
        <span>견적 판단</span>
        <strong data-mcc-result="grade">—</strong>
      </div>
    </div>

    <div class="mcc-summary" data-mcc-result="summary"></div>

    <section class="mcc-breakdown-section">
      <h2>비용 구성</h2>
      <div class="mcc-breakdown-bars" id="mccBreakdownBars"></div>
      <table class="mcc-table">
        <thead>
          <tr>
            <th>항목</th>
            <th>예상 범위</th>
            <th>기준</th>
          </tr>
        </thead>
        <tbody id="mccBreakdownTable"></tbody>
      </table>
    </section>

    <section class="mcc-checklist-section">
      <h2>추가비 체크리스트</h2>
      <div class="mcc-risk-banner" data-mcc-result="riskText"></div>
      <div class="mcc-checklist">
        {MCC_CHECKLIST.map((item) => (
          <label class="mcc-check-item">
            <input type="checkbox" data-mcc-check={item.id} />
            <span>
              <strong>{item.label}</strong>
              <small>{item.risk} · {item.description}</small>
            </span>
          </label>
        ))}
      </div>
    </section>

    <section class="mcc-compare-section">
      <h2>이사 방식별 차이</h2>
      <div class="mcc-compare-grid">
        {MCC_TYPE_OPTIONS.map((option) => (
          <article class="mcc-compare-card">
            <strong>{option.label}</strong>
            <p>{option.description}</p>
          </article>
        ))}
      </div>
    </section>

    <SeoContent
      introTitle="포장이사 견적, 어떤 기준으로 봐야 할까요?"
      intro={[
        "포장이사 비용은 평수만으로 정해지지 않습니다. 같은 24평이라도 짐 양, 사다리차 사용, 이동 거리, 날짜에 따라 견적 차이가 큽니다.",
        "이 계산기는 견적을 받기 전 대략적인 기준선을 잡는 도구입니다. 너무 낮은 견적은 추가비 조건을, 너무 높은 견적은 포함 항목을 확인하는 기준으로 활용하세요.",
      ]}
      faq={MCC_FAQ}
    />
  </div>
</SimpleToolShell>

<script id="mccConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/moving-cost-calculator.js" defer></script>
```

---

## 4. 계산 로직 (`public/scripts/moving-cost-calculator.js`)

### 상태

```js
const state = {
  pyeong: 24,
  distanceKm: 20,
  type: "full",
  ladder: "both",
  floor: "6-10",
  peak: false,
  volume: "normal",
  region: "metro",
  checkedRisks: [],
};
```

### 유틸

```js
function roundManwon(value) {
  return Math.round(value / 10000) * 10000;
}

function formatWonShort(value) {
  if (value >= 10000) return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  return `${value.toLocaleString("ko-KR")}원`;
}

function getBand(pyeong, bands) {
  return bands.find((band) => pyeong >= band.minPyeong && pyeong <= band.maxPyeong) || bands[bands.length - 1];
}

function applyRate(range, rate) {
  return {
    min: range.min * rate,
    max: range.max * rate,
  };
}
```

### 계산

```js
function getBaseRange(state, cfg) {
  const band = getBand(state.pyeong, cfg.baseBands);
  if (state.type === "semi") return applyRate(band.full, band.semiRate);
  if (state.type === "basic") return applyRate(band.full, band.basicRate);
  return band.full;
}

function getDistanceFee(km) {
  if (km <= 30) return { min: 0, max: 0 };
  if (km <= 80) return { min: 100000, max: 250000 };
  return { min: 250000, max: 600000 };
}

function getLadderFee(state, cfg) {
  const ladder = cfg.ladderOptions.find((o) => o.value === state.ladder);
  const floor = cfg.floorOptions.find((o) => o.value === state.floor);
  return {
    min: ladder.min * floor.ladderFactor,
    max: ladder.max * floor.ladderFactor,
  };
}

function calculate(state, cfg) {
  const base = getBaseRange(state, cfg);
  const volume = cfg.volumeOptions.find((o) => o.value === state.volume);
  const region = cfg.regionOptions.find((o) => o.value === state.region);
  const distanceFee = getDistanceFee(state.distanceKm);
  const ladderFee = getLadderFee(state, cfg);

  const baseAdjusted = {
    min: base.min * volume.factor,
    max: base.max * volume.factor,
  };

  const subtotal = {
    min: baseAdjusted.min + distanceFee.min + ladderFee.min,
    max: baseAdjusted.max + distanceFee.max + ladderFee.max,
  };

  const dateFactor = state.peak ? { min: 1.1, max: 1.25 } : { min: 1, max: 1 };

  const estimated = {
    min: roundManwon(subtotal.min * dateFactor.min * region.minFactor),
    max: roundManwon(subtotal.max * dateFactor.max * region.maxFactor),
  };

  const extra = {
    min: roundManwon(distanceFee.min + ladderFee.min + (estimated.min - subtotal.min)),
    max: roundManwon(distanceFee.max + ladderFee.max + (estimated.max - subtotal.max)),
  };

  const midpoint = roundManwon((estimated.min + estimated.max) / 2);

  return {
    estimated,
    midpoint,
    extra,
    breakdown: [
      { key: "base", label: "기본 이사비", range: baseAdjusted, badge: "추정" },
      { key: "distance", label: "거리 가산", range: distanceFee, badge: "추정" },
      { key: "ladder", label: "사다리차", range: ladderFee, badge: "추정" },
      { key: "date", label: "날짜·지역 보정", range: { min: Math.max(0, estimated.min - subtotal.min), max: Math.max(0, estimated.max - subtotal.max) }, badge: "추정" },
    ],
  };
}
```

### 렌더링

```js
function renderKpis(result) {
  setText("range", `약 ${formatWonShort(result.estimated.min)}~${formatWonShort(result.estimated.max)}`);
  setText("midpoint", `약 ${formatWonShort(result.midpoint)}`);
  setText("extra", `약 ${formatWonShort(result.extra.min)}~${formatWonShort(result.extra.max)}`);
  setText("grade", getGradeText(result.estimated));
}

function getGradeText(range) {
  const width = range.max - range.min;
  if (width >= 800000) return "조건 확인 필요";
  if (range.max >= 2500000) return "상단 견적 가능";
  return "비교 견적 권장";
}

function renderSummary(state, result) {
  const typeLabel = getOptionLabel("typeOptions", state.type);
  const ladderLabel = getOptionLabel("ladderOptions", state.ladder);
  const peakText = state.peak ? "손없는날·주말·월말 조건" : "일반일 조건";
  setHtml(
    "summary",
    `입력한 조건은 <strong>${state.pyeong}평 ${typeLabel}</strong>, ${state.distanceKm}km 이동, 사다리차 ${ladderLabel}, ${peakText}입니다. 참고 견적 범위는 <strong>약 ${formatWonShort(result.estimated.min)}~${formatWonShort(result.estimated.max)}</strong>입니다.`
  );
}

function renderBreakdown(result) {
  const total = result.breakdown.reduce((sum, item) => sum + item.range.max, 0);
  const bars = document.getElementById("mccBreakdownBars");
  const tbody = document.getElementById("mccBreakdownTable");

  bars.innerHTML = result.breakdown
    .filter((item) => item.range.max > 0)
    .map((item) => {
      const width = total > 0 ? Math.max(4, Math.round((item.range.max / total) * 100)) : 0;
      return `<div class="mcc-bar-row">
        <span>${item.label}</span>
        <div class="mcc-bar-track"><div class="mcc-bar-fill" style="width:${width}%"></div></div>
        <strong>${formatWonShort(item.range.max)}</strong>
      </div>`;
    })
    .join("");

  tbody.innerHTML = result.breakdown
    .map((item) => `<tr>
      <td>${item.label} <span class="mcc-badge">${item.badge}</span></td>
      <td>${formatWonShort(item.range.min)}~${formatWonShort(item.range.max)}</td>
      <td>${formatWonShort((item.range.min + item.range.max) / 2)}</td>
    </tr>`)
    .join("");
}

function renderRiskText() {
  const count = state.checkedRisks.length;
  const highCount = state.checkedRisks.filter((id) => {
    const item = cfg.checklist.find((x) => x.id === id);
    return item && item.risk === "높음";
  }).length;

  if (count === 0) {
    setText("riskText", "견적 전 해당되는 추가비 항목을 체크해 보세요.");
    return;
  }

  setText("riskText", `추가비 확인 항목 ${count}개, 그중 위험도 높은 항목 ${highCount}개가 있습니다.`);
}
```

### 이벤트 바인딩

```js
function bindEvents() {
  document.querySelectorAll("[data-mcc]").forEach((el) => {
    el.addEventListener("input", () => {
      const key = el.dataset.mcc;
      state[key] = el.type === "number" ? Number(el.value) : el.value;
      updateActivePresets();
      update();
    });
  });

  document.querySelectorAll("[data-mcc-num]").forEach((el) => {
    el.addEventListener("change", () => {
      const key = el.dataset.mccNum;
      state[key] = Number(el.value.replace(/,/g, ""));
      syncInputs();
      update();
    });
  });

  document.querySelectorAll("[data-mcc-bool]").forEach((el) => {
    el.addEventListener("change", () => {
      state[el.dataset.mccBool] = el.checked;
      update();
    });
  });

  document.querySelectorAll("[data-mcc-pyeong]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pyeong = Number(button.dataset.mccPyeong);
      syncInputs();
      updateActivePresets();
      update();
    });
  });

  document.querySelectorAll("[data-mcc-distance]").forEach((button) => {
    button.addEventListener("click", () => {
      state.distanceKm = Number(button.dataset.mccDistance);
      syncInputs();
      update();
    });
  });

  document.querySelectorAll("[data-mcc-check]").forEach((el) => {
    el.addEventListener("change", () => {
      state.checkedRisks = Array.from(document.querySelectorAll("[data-mcc-check]:checked")).map((x) => x.dataset.mccCheck);
      renderRiskText();
    });
  });
}
```

### URL 파라미터

```text
?py=24&km=20&type=full&ladder=both&floor=6-10&peak=0&volume=normal&region=metro
```

```js
function syncUrl() {
  const params = new URLSearchParams();
  params.set("py", state.pyeong);
  params.set("km", state.distanceKm);
  params.set("type", state.type);
  params.set("ladder", state.ladder);
  params.set("floor", state.floor);
  params.set("peak", state.peak ? "1" : "0");
  params.set("volume", state.volume);
  params.set("region", state.region);
  history.replaceState(null, "", `?${params.toString()}`);
}
```

---

## 5. SCSS (`src/styles/scss/pages/_moving-cost-calculator.scss`)

```scss
.mcc-page {
  .mcc-section {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem;
    background: var(--color-surface);
  }

  .mcc-section-title {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 700;
  }

  .mcc-field {
    display: block;
    margin-bottom: 1rem;
  }

  .mcc-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .mcc-preset-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.625rem;

    &--distance {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .mcc-preset {
    min-height: 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    background: #fff;
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;

    &.is-active,
    &:hover {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: #fff;
    }
  }

  .mcc-input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input {
      width: 7rem;
      padding: 0.5rem 0.625rem;
      border: 1px solid var(--color-border);
      border-radius: 0.375rem;
      text-align: right;
      font-size: 0.9375rem;
    }

    span {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
  }

  .mcc-select {
    width: 100%;
    min-height: 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0 0.625rem;
    background: #fff;
    font-size: 0.9375rem;
  }

  .mcc-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px dashed var(--color-border);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;

    input {
      width: 1rem;
      height: 1rem;
    }
  }

  .mcc-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin: 1.25rem 0;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .mcc-kpi-card {
    min-height: 7rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    span {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    strong {
      color: var(--color-primary);
      font-size: 1.125rem;
      font-weight: 800;
      line-height: 1.25;
    }

    small {
      align-self: flex-start;
      border-radius: 999px;
      padding: 0.125rem 0.5rem;
      background: rgba(26, 86, 219, 0.1);
      color: var(--color-primary);
      font-size: 0.6875rem;
      font-weight: 700;
    }

    &--primary {
      background: var(--color-primary);
      color: #fff;

      span,
      small {
        color: rgba(255, 255, 255, 0.82);
      }

      strong {
        color: #fff;
        font-size: 1.35rem;
      }

      small {
        background: rgba(255, 255, 255, 0.16);
      }
    }
  }

  .mcc-summary,
  .mcc-risk-banner {
    border-left: 4px solid var(--color-primary);
    border-radius: 0.375rem;
    padding: 1rem 1.25rem;
    background: var(--color-surface);
    line-height: 1.7;
    font-size: 0.9375rem;
  }

  .mcc-breakdown-section,
  .mcc-checklist-section,
  .mcc-compare-section {
    margin: 2rem 0;

    h2 {
      margin: 0 0 1rem;
      font-size: 1.125rem;
    }
  }

  .mcc-bar-row {
    display: grid;
    grid-template-columns: 6rem 1fr 5rem;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.625rem;
    font-size: 0.875rem;

    strong {
      text-align: right;
    }
  }

  .mcc-bar-track {
    height: 0.625rem;
    overflow: hidden;
    border-radius: 999px;
    background: var(--color-border);
  }

  .mcc-bar-fill {
    height: 100%;
    border-radius: inherit;
    background: var(--color-primary);
  }

  .mcc-table {
    width: 100%;
    margin-top: 1rem;
    border-collapse: collapse;
    font-size: 0.875rem;

    th,
    td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid var(--color-border);
      text-align: right;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    th {
      background: var(--color-surface);
      font-weight: 700;
    }
  }

  .mcc-badge {
    display: inline-flex;
    margin-left: 0.25rem;
    border-radius: 999px;
    padding: 0.0625rem 0.375rem;
    background: rgba(5, 150, 105, 0.1);
    color: #047857;
    font-size: 0.6875rem;
    font-weight: 700;
  }

  .mcc-checklist {
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
  }

  .mcc-check-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 0.875rem;
    cursor: pointer;

    input {
      margin-top: 0.1875rem;
    }

    strong,
    small {
      display: block;
    }

    small {
      margin-top: 0.25rem;
      color: var(--color-text-muted);
      line-height: 1.55;
    }
  }

  .mcc-compare-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .mcc-compare-card {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem;

    strong {
      display: block;
      margin-bottom: 0.375rem;
    }

    p {
      margin: 0;
      color: var(--color-text-muted);
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }

  @media (max-width: 520px) {
    .mcc-kpi-grid {
      grid-template-columns: 1fr;
    }

    .mcc-bar-row {
      grid-template-columns: 1fr;
      gap: 0.375rem;

      strong {
        text-align: left;
      }
    }
  }
}
```

---

## 6. tools.ts 등록 예시

```ts
{
  slug: "moving-cost-calculator",
  title: "포장이사 비용 계산기",
  description: "평수·거리·사다리차·손없는날 조건으로 24평·34평 포장이사 예상 견적 범위를 계산합니다.",
  category: "생활·유틸리티",
  order: 60.6,
  badges: ["NEW", "추정", "견적체크"],
  previewStats: [
    { label: "입력 조건", value: "8개" },
    { label: "추가비", value: "6항목" },
  ],
}
```

---

## 7. QA 포인트

- [ ] `24평`, `34평` 프리셋 선택 시 평수 입력값과 활성 상태가 동기화되는지
- [ ] 이동 거리 프리셋과 슬라이더·숫자 입력이 양방향으로 동기화되는지
- [ ] 포장이사·반포장이사·일반이사 변경 시 기본 견적 범위가 낮아지는지
- [ ] 사다리차 `없음`, `한쪽`, `양쪽` 선택 시 추가비와 비용 분해가 갱신되는지
- [ ] 손없는날·주말 토글 시 견적 범위가 10~25% 상승하는지
- [ ] 체크리스트 선택 시 위험도 요약 문구가 갱신되는지
- [ ] 모든 금액이 만원 단위로 반올림되어 표시되는지
- [ ] 모든 기본 단가와 결과 영역에 `추정` 또는 참고 안내가 표시되는지
- [ ] 모바일 375px에서 KPI 카드, 막대 그래프, 체크리스트 텍스트가 겹치지 않는지
- [ ] `npm run build` 오류 없음

