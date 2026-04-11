# 국민연금 세대별 손익 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/national-pension-generational-comparison-2026.md`
> 작성일: 2026-04-11
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `semiconductor-etf-2026`, `salary-asset-2016-vs-2026` (탭·차트·아코디언 패턴)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/national-pension-generational-comparison-2026.md`
- 구현 대상: `국민연금 세대별 손익 비교 2026`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 페이지 성격

- **2026 연금개혁 이후 세대별 납입·수령 구조 비교 리포트**: 1960·1975·1990·2000년생 4세대 비교
- **핵심 차별점**: "손해냐 이득이냐" 단정 대신 세대별 숫자 차이와 개혁 영향을 데이터로 제시
- **공식값 vs 시뮬레이션 엄격 분리**: 보험료율·소득대체율 = `공식`, 납입 총액·수익비·손익분기점 = `시뮬레이션`

### 1-3. 권장 slug

- `national-pension-generational-comparison-2026`
- URL: `/reports/national-pension-generational-comparison-2026/`

### 1-4. 권장 파일 구조

```
src/
  data/
    nationalPension2026.ts         ← 제도 상수 + 시나리오 데이터
  pages/
    reports/
      national-pension-generational-comparison-2026.astro

public/
  scripts/
    national-pension-generational-comparison-2026.js

src/styles/scss/pages/
  _national-pension-generational-comparison-2026.scss  (prefix: np-)
```

---

## 2. 데이터 파일 설계 (`nationalPension2026.ts`)

### 2-1. 제도 기준 상수 (`공식`)

```ts
export const NP_META = {
  slug: "national-pension-generational-comparison-2026",
  title: "국민연금 세대별 손익 비교 2026",
  updatedAt: "2026-04",
  dataSource: "국민연금공단, 보건복지부",
};

// 보험료율 로드맵 (공식)
export const PREMIUM_RATE_ROADMAP = [
  { year: 2025, rate: 9.0 },
  { year: 2026, rate: 9.5 },
  { year: 2027, rate: 10.0 },
  { year: 2028, rate: 10.5 },
  { year: 2029, rate: 11.0 },
  { year: 2030, rate: 11.5 },
  { year: 2031, rate: 12.0 },
  { year: 2032, rate: 12.5 },
  { year: 2033, rate: 13.0 },
];

// Hero KPI 카드 (공식)
export const NP_HERO_STATS = [
  { label: "2026 보험료율",    value: "9.5%",        note: "9%에서 인상 시작",        badge: "공식" },
  { label: "2033 목표 보험료율", value: "13%",         note: "2026~2033 단계 인상",     badge: "공식" },
  { label: "2026 소득대체율",   value: "43%",         note: "2026년부터 적용",          badge: "공식" },
  { label: "개혁 반영 기금 전망", value: "2071년",       note: "현행 유지 시 2055년",     badge: "공식" },
];

// 연기연금 가산 (공식)
export const DEFERRAL_BONUS_PER_MONTH = 0.6;   // % (연 7.2%)
export const INCOME_REPLACEMENT_RATE  = 43;    // % (2026년부터)
export const PENSION_START_AGE_POST1969 = 65;  // 1969년 이후 출생자 지급개시연령
export const EARLY_PENSION_AGE          = 60;  // 조기노령연금 가능 나이

// 월 추가 부담 예시 (평균소득 309만원 기준, 공식)
export const MONTHLY_EXTRA_BURDEN = {
  employee:     7700,  // 사업장가입자 본인 (원)
  self_employed: 15400, // 지역가입자 본인 (원)
};
```

### 2-2. 세대별 시뮬레이션 데이터 (`시뮬레이션`)

> **공통 가정**: 월 평균 소득 300만원 고정(실질 기준 단순화), 직장가입자 본인 절반 부담, 40년 이상 가입 기준
> 실제 개인별 금액은 소득이력·가입기간에 따라 크게 달라집니다.

```ts
export type GenerationKey = "1960" | "1975" | "1990" | "2000";
export type ScenarioKey   = "old" | "reform";  // old: 현행 유지 / reform: 2025 개혁 반영

type GenerationScenario = {
  birthYear:     number;
  retirementAge: number;     // 지급개시연령
  contributionYears: number;
  totalContribution: number; // 만원 (본인 부담 기준)
  monthlyPension:    number; // 만원
  breakevenAge:      number; // 손익분기점 나이 (시뮬레이션)
  payoutRatio:       number; // 수익비 (기대수명 85세 기준)
  badge: "시뮬레이션";
};

export const GENERATION_SCENARIOS: Record<GenerationKey, Record<ScenarioKey, GenerationScenario>> = {
  "1960": {
    old: {
      birthYear: 1960, retirementAge: 63, contributionYears: 37,
      totalContribution: 5200,   // 약 5,200만원 (본인 납입 추정)
      monthlyPension:    72,     // 약 72만원/월
      breakevenAge:      69,     // 손익분기점
      payoutRatio:       3.32,   // (72 × 240) ÷ 5,200
      badge: "시뮬레이션",
    },
    reform: {
      birthYear: 1960, retirementAge: 63, contributionYears: 37,
      totalContribution: 5200,   // 1960년생은 개혁 전 이미 거의 완료
      monthlyPension:    75,     // 소득대체율 43% 반영 소폭 상향
      breakevenAge:      69,
      payoutRatio:       3.46,
      badge: "시뮬레이션",
    },
  },
  "1975": {
    old: {
      birthYear: 1975, retirementAge: 65, contributionYears: 40,
      totalContribution: 6800,   // 개혁 전 9% 고정 가정
      monthlyPension:    90,
      breakevenAge:      72,
      payoutRatio:       3.18,
      badge: "시뮬레이션",
    },
    reform: {
      birthYear: 1975, retirementAge: 65, contributionYears: 40,
      totalContribution: 7500,   // 단계 인상 반영 약 +700만원
      monthlyPension:    95,     // 소득대체율 43% 반영
      breakevenAge:      72,
      payoutRatio:       3.04,
      badge: "시뮬레이션",
    },
  },
  "1990": {
    old: {
      birthYear: 1990, retirementAge: 65, contributionYears: 40,
      totalContribution: 7000,
      monthlyPension:    93,
      breakevenAge:      73,
      payoutRatio:       3.19,
      badge: "시뮬레이션",
    },
    reform: {
      birthYear: 1990, retirementAge: 65, contributionYears: 40,
      totalContribution: 8600,   // 9.5%→13% 대부분 경력에서 인상 적용
      monthlyPension:    100,
      breakevenAge:      73,
      payoutRatio:       2.79,
      badge: "시뮬레이션",
    },
  },
  "2000": {
    old: {
      birthYear: 2000, retirementAge: 65, contributionYears: 40,
      totalContribution: 7200,
      monthlyPension:    95,
      breakevenAge:      73,
      payoutRatio:       3.17,
      badge: "시뮬레이션",
    },
    reform: {
      birthYear: 2000, retirementAge: 65, contributionYears: 40,
      totalContribution: 9300,   // 2026부터 전 경력에 인상 적용
      monthlyPension:    105,
      breakevenAge:      74,
      payoutRatio:       2.71,
      badge: "시뮬레이션",
    },
  },
};

// 조기/정상/연기 수령 비교 (1975년생, 개혁 반영 기준 예시)
export const PAYOUT_TIMING_COMPARE = [
  {
    type: "조기수령",
    startAge: 60,
    monthlyAmount: 61,    // 정상수령 대비 -36% (5년 × 12개월 × 0.6%)
    breakevenVsNormal: 74, // 정상수령 대비 손익분기 나이
    bestFor: "현금흐름이 급한 경우",
    badge: "시뮬레이션",
  },
  {
    type: "정상수령",
    startAge: 65,
    monthlyAmount: 95,
    breakevenVsNormal: 65,
    bestFor: "일반적인 경우",
    badge: "시뮬레이션",
  },
  {
    type: "연기수령",
    startAge: 70,
    monthlyAmount: 129,   // +36% (5년 × 12개월 × 0.6%)
    breakevenVsNormal: 84, // 70세 기준 14년 = 84세부터 정상수령보다 유리
    bestFor: "장수·근로 지속 예상",
    badge: "시뮬레이션",
  },
];

// OECD 주요국 소득대체율 비교 (참고, Pensions at a Glance 2025 기준 대략값)
export const OECD_COMPARISON = [
  { country: "네덜란드",   rate: 101, badge: "참고" },
  { country: "덴마크",    rate: 80,  badge: "참고" },
  { country: "프랑스",    rate: 74,  badge: "참고" },
  { country: "OECD 평균", rate: 58,  badge: "참고" },
  { country: "영국",      rate: 58,  badge: "참고" },
  { country: "독일",      rate: 52,  badge: "참고" },
  { country: "미국",      rate: 49,  badge: "참고" },
  { country: "한국(목표)", rate: 43,  badge: "공식" },
  { country: "일본",      rate: 38,  badge: "참고" },
];

// 체크리스트
export const REFORM_CHECKLIST = [
  "2026년 보험료율 9.5% 적용 확인",
  "내 지급개시연령 확인 (1969년생 이후: 65세)",
  "조기수령/연기수령 손익분기 비교 확인",
  "IRP·연금저축 병행 여부 점검",
  "납입 공백 구간 추후납부 가능 여부 확인",
  "지역가입자라면 보험료 부담 증가분(+15,400원) 점검",
];

// FAQ
export const NP_FAQ = [
  {
    q: "국민연금은 2026년에 얼마나 오르나요?",
    a: "2026년 보험료율이 9%에서 9.5%로 인상됩니다. 월 평균 소득 309만원 기준 사업장가입자 본인 부담은 월 7,700원, 지역가입자는 월 15,400원 늘어납니다. 이후 2033년까지 매년 0.5%p씩 올라 최종 13%에 도달합니다.",
  },
  {
    q: "국민연금 보험료율은 언제 13%가 되나요?",
    a: "2025년 연금개혁에 따라 2026년 9.5%를 시작으로 매년 0.5%p 인상되어 2033년에 13%에 도달합니다. 2033년부터는 13%로 고정됩니다.",
  },
  {
    q: "2055년에 국민연금이 고갈되면 못 받는 건가요?",
    a: "2023년 제5차 재정추계에서 현행 제도 유지 시 기금 소진 시점을 2055년으로 전망했습니다. 그러나 기금이 소진된다는 것이 연금 지급 중단을 의미하지는 않습니다. 또한 2025년 개혁 반영 시나리오에서는 소진 시점이 2071년으로 연장될 수 있다고 설명합니다.",
  },
  {
    q: "조기노령연금과 연기연금 중 뭐가 유리한가요?",
    a: "조기수령(60세)은 정상 수령액의 최대 36%가 줄어들고, 연기수령(70세)은 최대 36%가 늘어납니다. 정상수령 대비 손익분기점은 조기수령 약 74세, 연기수령 약 84세(70세 기준)로 추정됩니다. 건강 상태와 기대수명, 현금흐름 필요성에 따라 선택이 달라집니다.",
  },
  {
    q: "직장가입자와 지역가입자는 뭐가 다른가요?",
    a: "직장가입자는 보험료를 근로자와 사용자가 절반씩 부담합니다. 반면 지역가입자는 보험료 전액을 본인이 부담합니다. 따라서 같은 보험료율 인상이라도 지역가입자의 체감 부담이 더 큽니다.",
  },
  {
    q: "국민연금만으로 노후 준비가 충분한가요?",
    a: "소득대체율 43% 기준으로 국민연금만으로는 은퇴 전 소득의 절반에도 미치지 못할 수 있습니다. 3층 연금(국민연금 + IRP + 연금저축) 구조로 부족분을 보완하는 것이 일반적으로 권장됩니다.",
  },
];
```

---

## 3. 페이지 섹션 구성

### SECTION A. Hero

```astro
<CalculatorHero
  title="국민연금 세대별 손익 비교 2026"
  description="1960·1975·1990·2000년생 기준으로 낸 돈, 받을 돈, 손익분기점, 연금개혁 영향까지 한눈에 비교합니다."
  badges={["국민연금", "연금개혁", "2026", "세대비교"]}
/>
<InfoNotice
  text="이 리포트의 납입 총액·수령액·손익분기점·수익비는 가정 기반 시뮬레이션입니다. 보험료율·소득대체율·지급개시연령 등 제도 수치는 국민연금공단·보건복지부 공식 기준을 사용합니다."
/>
```

### SECTION B. Hero KPI 카드 4개

```html
<div class="np-kpi-grid">
  <!-- NP_HERO_STATS 4개 -->
  <div class="np-kpi-card">
    <span class="np-badge np-badge--official">공식</span>
    <p class="np-kpi-label">2026 보험료율</p>
    <p class="np-kpi-value">9.5%</p>
    <p class="np-kpi-note">9%에서 인상 시작</p>
  </div>
  <!-- 나머지 3개 동일 패턴 -->
</div>
```

### SECTION C. 국민연금 제도 한눈에 보기

- **H2**: 국민연금 제도 한눈에 보기
- 개념 설명 박스 4개 (아이콘 + 한 줄 설명):
  - **보험료율**: 월 소득에서 내는 비율
  - **소득대체율**: 은퇴 전 소득 대비 연금액 비율
  - **지급개시연령**: 1969년 이후 출생 = 65세
  - **가입기간**: 10년 이상이어야 노령연금 수급 가능

```html
<div class="np-concept-grid">
  <div class="np-concept-card">
    <p class="np-concept-term">보험료율</p>
    <p class="np-concept-def">월 소득에서 내는 비율. 2026년 9.5% → 2033년 13%.</p>
  </div>
  <div class="np-concept-card">
    <p class="np-concept-term">소득대체율</p>
    <p class="np-concept-def">은퇴 전 소득 대비 받을 연금 비율. 2026년부터 43%.</p>
  </div>
  <div class="np-concept-card">
    <p class="np-concept-term">지급개시연령</p>
    <p class="np-concept-def">1969년 이후 출생자는 65세. 조기노령연금은 60세부터 가능.</p>
  </div>
  <div class="np-concept-card">
    <p class="np-concept-term">최소 가입기간</p>
    <p class="np-concept-def">10년 이상이어야 노령연금 수급 가능.</p>
  </div>
</div>
```

### SECTION D. 보험료율 인상 로드맵

- **H2**: 보험료율 인상 로드맵
- **차트**: `np-rate-chart` — 연도별 보험료율 step line chart
  - `data-labels='["2025","2026","2027","2028","2029","2030","2031","2032","2033"]'`
  - `data-values='[9.0,9.5,10.0,10.5,11.0,11.5,12.0,12.5,13.0]'`
- 월 추가 부담 예시 박스 (309만원 기준):
  - 사업장가입자 본인: +7,700원/월
  - 지역가입자 본인: +15,400원/월

```html
<canvas id="np-rate-chart"
  data-labels='["2025","2026","2027","2028","2029","2030","2031","2032","2033"]'
  data-values='[9.0,9.5,10.0,10.5,11.0,11.5,12.0,12.5,13.0]'
></canvas>
<div class="np-rate-extra-box">
  <p>월평균소득 309만원 기준 2026년 추가 부담</p>
  <span class="np-badge np-badge--official">공식</span>
  <div class="np-rate-extra-row">
    <span>사업장가입자 본인</span><strong>+7,700원/월</strong>
  </div>
  <div class="np-rate-extra-row">
    <span>지역가입자 본인</span><strong>+15,400원/월</strong>
  </div>
</div>
```

### SECTION E. 세대별 납입 총액 시뮬레이션

- **H2**: 세대별 납입 총액 비교
- **세대 탭** (1960 / 1975 / 1990 / 2000년생) + **시나리오 버튼** (개혁 전 / 개혁 반영)
- **차트**: `np-contribution-chart` — 세대별 납입 총액 grouped bar chart (개혁 전 vs 개혁 반영)
- 강조 문구: `시뮬레이션` 배지 필수, 결론 단정 금지

```html
<div class="np-generation-tabs" id="np-generation-tabs">
  <button class="np-gen-tab is-active" data-gen="all">전체 비교</button>
  <button class="np-gen-tab" data-gen="1960">1960년생</button>
  <button class="np-gen-tab" data-gen="1975">1975년생</button>
  <button class="np-gen-tab" data-gen="1990">1990년생</button>
  <button class="np-gen-tab" data-gen="2000">2000년생</button>
</div>

<div class="np-scenario-btns">
  <button class="np-scenario-btn is-active" data-scenario="reform">개혁 반영</button>
  <button class="np-scenario-btn" data-scenario="old">개혁 전</button>
</div>

<div class="np-chart-wrap">
  <canvas id="np-contribution-chart"
    data-labels='["1960년생","1975년생","1990년생","2000년생"]'
    data-old='[5200,6800,7000,7200]'
    data-reform='[5200,7500,8600,9300]'
  ></canvas>
</div>
<p class="np-sim-note"><span class="np-badge np-badge--sim">시뮬레이션</span> 월 소득 300만원 고정·직장가입자 본인 부담 기준 추정치입니다.</p>
```

### SECTION F. 세대별 예상 수령액과 손익분기점

- **H2**: 세대별 예상 수령액과 손익분기점
- **차트**: `np-pension-chart` — 세대별 예상 월 수령액 bar chart
- 손익분기점 나이 카드 (세대별 4개)
- 시나리오 버튼 (개혁 전/개혁 반영) 공유

```html
<div class="np-chart-wrap">
  <canvas id="np-pension-chart"
    data-labels='["1960년생","1975년생","1990년생","2000년생"]'
    data-old='[72,90,93,95]'
    data-reform='[75,95,100,105]'
  ></canvas>
</div>

<div class="np-breakeven-cards">
  <div class="np-breakeven-card" data-gen="1960">
    <p class="np-breakeven-gen">1960년생</p>
    <p class="np-breakeven-age" id="np-be-1960">69세</p>
    <p class="np-breakeven-label">손익분기점 나이 <span class="np-badge np-badge--sim">시뮬레이션</span></p>
  </div>
  <!-- 1975 / 1990 / 2000 동일 패턴 -->
</div>
```

### SECTION G. 수익비 비교

- **H2**: 세대별 수익비 비교
- **수령 방식 탭**: 조기수령 / 정상수령 / 연기수령
- **차트**: `np-ratio-chart` — 세대별 수익비 horizontal bar chart
- 경고 문구: "수익비만으로 제도를 평가하면 장수위험 보장·유족·장애 보장 기능이 빠집니다"

```html
<div class="np-timing-tabs">
  <button class="np-timing-tab is-active" data-timing="normal">정상수령</button>
  <button class="np-timing-tab" data-timing="early">조기수령</button>
  <button class="np-timing-tab" data-timing="defer">연기수령</button>
</div>

<div class="np-chart-wrap">
  <canvas id="np-ratio-chart"
    data-labels='["1960년생","1975년생","1990년생","2000년생"]'
    data-normal='[3.46,3.04,2.79,2.71]'
    data-early='[2.80,2.46,2.26,2.19]'
    data-defer='[4.23,3.72,3.41,3.31]'
  ></canvas>
</div>
<div class="np-ratio-notice">
  국민연금은 단순 금융상품이 아닌 장수위험 분산 사회보험입니다. 수익비는 참고 지표입니다.
</div>
```

### SECTION H. 2055년 고갈설과 실제 영향

- **H2**: 2055년 기금 고갈설과 실제 영향
- 이중 타임라인 시각화 (CSS/HTML, 차트 불필요):
  - 현행 유지: `●━━━━━━━━ 2055 소진`
  - 개혁 반영: `●━━━━━━━━━━━━━ 2071 소진`
- "기금 소진 ≠ 지급 중단" 안내 박스 (InfoNotice 스타일)

```html
<div class="np-timeline">
  <div class="np-timeline-row">
    <span class="np-timeline-label">현행 유지 시</span>
    <div class="np-timeline-bar np-timeline-bar--old">
      <span class="np-timeline-end">2055년</span>
    </div>
    <span class="np-badge np-badge--official">공식</span>
  </div>
  <div class="np-timeline-row">
    <span class="np-timeline-label">개혁 반영 시</span>
    <div class="np-timeline-bar np-timeline-bar--reform">
      <span class="np-timeline-end">2071년</span>
    </div>
    <span class="np-badge np-badge--official">공식</span>
  </div>
</div>
<div class="np-notice-box">
  <strong>기금 소진 ≠ 지급 중단</strong><br>
  기금이 소진되더라도 국가 재정 투입 등을 통해 연금 지급이 계속될 수 있습니다.
  "2055년에 연금을 아예 못 받는다"는 단정은 공식 견해와 다릅니다.
</div>
```

### SECTION I. 조기수령 vs 정상수령 vs 연기수령

- **H2**: 조기수령 vs 정상수령 vs 연기수령
- `PAYOUT_TIMING_COMPARE` 데이터 기반 3-column 비교 카드
- 핵심 수치 강조:
  - 조기수령: 5년 조기 = -36% (`-0.6% × 60개월`)
  - 연기수령: 5년 연기 = +36% (`+0.6% × 60개월`)
- `시뮬레이션` 배지 + "1975년생, 개혁 반영 기준 예시" 명시

```html
<div class="np-timing-compare">
  {PAYOUT_TIMING_COMPARE.map(item => (
    <div class={`np-timing-card np-timing-card--${item.type === '조기수령' ? 'early' : item.type === '연기수령' ? 'defer' : 'normal'}`}>
      <p class="np-timing-type">{item.type}</p>
      <p class="np-timing-age">시작: {item.startAge}세</p>
      <p class="np-timing-amount">{item.monthlyAmount}만원/월</p>
      <p class="np-timing-breakeven">손익분기: 약 {item.breakevenVsNormal}세</p>
      <p class="np-timing-best">{item.bestFor}</p>
    </div>
  ))}
</div>
```

### SECTION J. 직장가입자 vs 지역가입자

- **H2**: 직장가입자 vs 지역가입자 납입 구조 차이
- 2-column 비교 카드
- 핵심 메시지: "같은 보험료율 인상이라도 체감 부담이 다르다"

```html
<div class="np-subscriber-compare">
  <div class="np-subscriber-card">
    <h3>직장가입자</h3>
    <p class="np-subscriber-burden">보험료 절반 부담</p>
    <p>나머지 절반은 사용자(회사) 부담</p>
    <p class="np-subscriber-extra">2026년 추가: <strong>+7,700원/월</strong></p>
    <span class="np-badge np-badge--official">공식</span>
  </div>
  <div class="np-subscriber-card">
    <h3>지역가입자</h3>
    <p class="np-subscriber-burden">보험료 전액 본인 부담</p>
    <p>프리랜서·자영업자·경력단절 등</p>
    <p class="np-subscriber-extra">2026년 추가: <strong>+15,400원/월</strong></p>
    <span class="np-badge np-badge--official">공식</span>
  </div>
</div>
```

### SECTION K. OECD 주요국 공적연금 비교

- **H2**: OECD 주요국 공적연금 소득대체율 비교
- **차트**: `np-oecd-chart` — horizontal bar chart
- `OECD_COMPARISON` 데이터 (9개국, 한국 강조)
- 주의 문구: "국가별 제도 구조가 달라 단순 우열 비교보다 상대적 위치 참고용"

```html
<div class="np-chart-wrap">
  <canvas id="np-oecd-chart"
    data-labels='["네덜란드","덴마크","프랑스","OECD 평균","영국","독일","미국","한국(목표)","일본"]'
    data-values='[101,80,74,58,58,52,49,43,38]'
  ></canvas>
</div>
<p class="np-sim-note"><span class="np-badge np-badge--note">참고</span> Pensions at a Glance 2025 기준 평균소득자 대략값. 국가별 제도 구조 차이로 직접 비교에는 한계가 있습니다.</p>
```

### SECTION L. 국민연금만으로 노후 가능한가

- **H2**: 국민연금만으로 노후 준비가 충분한가요?
- 설명형 섹션 (계산기 아님)
- 흐름: 목표 노후생활비 예시 → 국민연금 예상액 차감 → 부족분 산출 → IRP/연금저축 필요성 연결
- "내 예상액 직접 계산해보기" CTA → 국민연금공단 내연금 서비스 외부 링크 (rel="noopener noreferrer")

### SECTION M. 3층 연금 전략

- **H2**: 국민연금 + IRP + 연금저축 3층 전략
- 간결 3-card: 국민연금(1층) / IRP(2층) / 연금저축(3층)
- 관련 계산기/리포트 내부 링크 CTA

### SECTION N. 납입 공백 대처법

- **H2**: 납입 공백·사각지대 대처법
- 아이콘 리스트 5개 유형: 실직 / 프리랜서 전환 / 육아 경력공백 / 납부예외 장기화 / 추후납부 고려
- 정확한 행정처리는 → 국민연금공단 공식 민원 안내 외부 링크

### SECTION O. 연금개혁 체크리스트

- **H2**: 연금 개혁 이후 내 상황 체크리스트
- `REFORM_CHECKLIST` 6개 항목 — checkbox 스타일 리스트
- 저장/공유 CTA

### SECTION P. FAQ

- `NP_FAQ` 6개 accordion
- `.np-faq-item` / `.np-faq-q` / `.np-faq-a`

### SECTION Q. 관련 콘텐츠 CTA

내부 링크 3개 이상:
- DCA 적립식 투자 수익 계산기 (`/tools/dca-investment-calculator/`)
- FIRE 은퇴 계산기 (`/tools/fire-calculator/`)
- 연봉 티어 계산기 (`/tools/salary-tier/`) — 연금 기반 소득 맥락 연결

### SECTION R. SeoContent

```astro
<SeoContent
  heading="국민연금 세대별 손익 비교 FAQ"
  faqs={NP_FAQ}
/>
```

---

## 4. SCSS 설계 (`_national-pension-generational-comparison-2026.scss`)

### 4-1. prefix

`np-`

### 4-2. CSS 변수

```scss
.np-page {
  --np-color-1960: #4caf8d;    // 1960년생
  --np-color-1975: #4a90d9;    // 1975년생
  --np-color-1990: #5c6bc0;    // 1990년생
  --np-color-2000: #9c7cc7;    // 2000년생
  --np-color-old:    #90a4ae;  // 개혁 전
  --np-color-reform: #4caf8d;  // 개혁 반영
  --np-color-early:  #e57373;  // 조기수령
  --np-color-normal: #4caf8d;  // 정상수령
  --np-color-defer:  #4a90d9;  // 연기수령
}
```

### 4-3. 주요 컴포넌트

```scss
// KPI 카드
.np-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.np-kpi-card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  text-align: center;
  border: 1px solid var(--color-border);
}

.np-kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

// 배지
.np-badge {
  display: inline-block;
  padding: 0.15em 0.55em;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  &--official { background: #e8f5e9; color: #388e3c; }
  &--sim      { background: #e3f2fd; color: #1565c0; }
  &--note     { background: #fff3e0; color: #e65100; }
}

// 개념 설명 그리드
.np-concept-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.np-concept-card {
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.np-concept-term {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.np-concept-def {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

// 세대·시나리오 탭
.np-generation-tabs,
.np-timing-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.np-gen-tab,
.np-timing-tab {
  padding: 0.4rem 0.875rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.875rem;
  cursor: pointer;

  &.is-active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }
}

.np-scenario-btns {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.np-scenario-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.825rem;
  cursor: pointer;

  &.is-active {
    background: var(--color-surface-alt);
    font-weight: 600;
  }
}

// 차트 공통
.np-chart-wrap {
  width: 100%;
  min-height: 300px;
  position: relative;
  margin: 1.25rem 0;
  canvas { width: 100% !important; }
}

// 손익분기점 카드
.np-breakeven-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.np-breakeven-card {
  text-align: center;
  padding: 0.875rem;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.np-breakeven-age {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

// 타임라인 (Section H)
.np-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.25rem 0;
}

.np-timeline-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.np-timeline-label {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 6rem;
  flex-shrink: 0;
}

.np-timeline-bar {
  position: relative;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;

  &--old    { width: 60%; background: var(--np-color-old);    opacity: 0.7; }
  &--reform { width: 82%; background: var(--np-color-reform); opacity: 0.85; }
}

.np-timeline-end {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.np-notice-box {
  padding: 0.875rem 1.25rem;
  background: #fff3e0;
  border-left: 4px solid #f5a623;
  border-radius: 0 8px 8px 0;
  font-size: 0.875rem;
  line-height: 1.7;
}

// 조기/정상/연기 비교 카드
.np-timing-compare {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

.np-timing-card {
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid var(--color-border);
  text-align: center;

  &--early  { border-color: var(--np-color-early); }
  &--normal { border-color: var(--np-color-normal); }
  &--defer  { border-color: var(--np-color-defer);  }
}

.np-timing-type   { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
.np-timing-amount { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); }
.np-timing-age, .np-timing-breakeven { font-size: 0.825rem; color: var(--color-text-secondary); }
.np-timing-best   { font-size: 0.8rem; background: var(--color-surface-alt); border-radius: 4px; padding: 0.25em 0.5em; margin-top: 0.5rem; }

// 직장/지역 비교
.np-subscriber-compare {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.np-subscriber-card {
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);

  h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
}

.np-subscriber-burden { font-size: 1rem; font-weight: 600; color: var(--color-primary); }
.np-subscriber-extra  { margin-top: 0.5rem; font-size: 0.875rem; }

// 보험료율 추가 부담 박스
.np-rate-extra-box {
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-top: 1rem;
  font-size: 0.875rem;
}

.np-rate-extra-row {
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0;
  border-top: 1px solid var(--color-border);

  strong { font-size: 1rem; color: var(--color-primary); }
}

// 체크리스트
.np-checklist {
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

    &::before {
      content: "☐";
      font-size: 1.1rem;
      color: var(--color-primary);
      flex-shrink: 0;
    }
  }
}

// 시뮬레이션 주석
.np-sim-note {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  line-height: 1.6;
}

// 수익비 경고
.np-ratio-notice {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  padding: 0.625rem 0.875rem;
  background: var(--color-surface);
  border-left: 3px solid var(--color-border);
  border-radius: 0 6px 6px 0;
  margin-top: 0.75rem;
}

// FAQ
.np-faq-item { border-bottom: 1px solid var(--color-border); }
.np-faq-q {
  width: 100%; text-align: left; padding: 0.875rem 0;
  font-weight: 600; font-size: 0.95rem;
  background: none; border: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;
}
.np-faq-a {
  padding: 0 0 1rem;
  font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7;
}
```

---

## 5. JS 인터랙션 (`national-pension-generational-comparison-2026.js`)

IIFE 패턴, `np-` prefix

### 5-1. 상태

```js
const state = {
  scenario: "reform",   // "reform" | "old"
  timing:   "normal",   // "early" | "normal" | "defer"
};
```

### 5-2. 함수 목록

| 함수 | 역할 |
|---|---|
| `initRateChart()` | 보험료율 step line chart (`np-rate-chart`) |
| `initContributionChart()` | 세대별 납입 총액 grouped bar (`np-contribution-chart`) — 시나리오 전환 |
| `initPensionChart()` | 세대별 예상 월 수령액 bar (`np-pension-chart`) — 시나리오 전환 |
| `initRatioChart()` | 수익비 horizontal bar (`np-ratio-chart`) — 조기/정상/연기 탭 |
| `initOecdChart()` | OECD 비교 horizontal bar (`np-oecd-chart`) |
| `initScenarioBtns()` | 시나리오 버튼 → contribution/pension 차트 업데이트 |
| `initTimingTabs()` | 조기/정상/연기 탭 → ratio 차트 업데이트 |
| `initFaq()` | FAQ accordion |

### 5-3. 보험료율 차트

```js
function initRateChart() {
  const canvas = document.getElementById("np-rate-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 260;

  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const values = JSON.parse(canvas.dataset.values || "[]");

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "보험료율 (%)",
        data: values,
        borderColor: "rgba(76, 175, 141, 1)",
        backgroundColor: "rgba(76, 175, 141, 0.1)",
        pointBackgroundColor: "rgba(46, 125, 114, 1)",
        pointRadius: 5,
        stepped: true,   // step chart
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` 보험료율 ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        y: {
          min: 8,
          max: 14,
          ticks: { callback: v => v + "%" },
          title: { display: true, text: "보험료율 (%)", font: { size: 11 } },
        },
      },
    },
  });
}
```

### 5-4. 세대별 납입 총액 grouped bar (개혁 전/후 2 datasets)

```js
let contributionChart = null;

function initContributionChart() {
  const canvas = document.getElementById("np-contribution-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 300;

  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const old    = JSON.parse(canvas.dataset.old    || "[]");
  const reform = JSON.parse(canvas.dataset.reform || "[]");

  contributionChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "개혁 전",
          data: state.scenario === "old" ? old : old,
          backgroundColor: "rgba(144, 164, 174, 0.6)",
          borderColor: "rgba(96, 125, 139, 1)",
          borderWidth: 1, borderRadius: 4,
        },
        {
          label: "개혁 반영",
          data: state.scenario === "reform" ? reform : reform,
          backgroundColor: "rgba(76, 175, 141, 0.7)",
          borderColor: "rgba(46, 125, 114, 1)",
          borderWidth: 1, borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: 약 ${ctx.parsed.y.toLocaleString("ko-KR")}만원 (시뮬레이션)`,
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: v => v + "만" },
          title: { display: true, text: "납입 총액 (만원, 시뮬레이션)", font: { size: 11 } },
        },
      },
    },
  });
}
```

### 5-5. 수익비 horizontal bar (탭별 3 datasets 교체)

```js
let ratioChart = null;

function initRatioChart() {
  const canvas = document.getElementById("np-ratio-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 260;

  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const getData = () => JSON.parse(canvas.dataset[state.timing] || "[]");

  ratioChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "수익비 (시뮬레이션)",
        data: getData(),
        backgroundColor: "rgba(76, 175, 141, 0.7)",
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
            label: ctx => ` 수익비 ${ctx.parsed.x.toFixed(2)} (시뮬레이션)`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: "수익비 (총수령 ÷ 총납입, 시뮬레이션)", font: { size: 11 } },
        },
      },
    },
  });
}

function updateRatioChart() {
  if (!ratioChart) return;
  const canvas = document.getElementById("np-ratio-chart");
  ratioChart.data.datasets[0].data = JSON.parse(canvas.dataset[state.timing] || "[]");
  ratioChart.update();
}
```

### 5-6. OECD horizontal bar (한국 강조)

```js
function initOecdChart() {
  const canvas = document.getElementById("np-oecd-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 320;

  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const values = JSON.parse(canvas.dataset.values || "[]");

  // 한국 항목 강조색
  const colors = labels.map(l =>
    l.includes("한국") ? "rgba(76, 175, 141, 0.9)" : "rgba(74, 144, 217, 0.5)"
  );

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "소득대체율 (%)",
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
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
            label: ctx => ` 소득대체율 약 ${ctx.parsed.x}%`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 110,
          ticks: { callback: v => v + "%" },
        },
      },
    },
  });
}
```

### 5-7. 초기화

```js
document.addEventListener("DOMContentLoaded", function () {
  initScenarioBtns();
  initTimingTabs();
  initFaq();

  if (typeof Chart !== "undefined") {
    initRateChart();
    initContributionChart();
    initPensionChart();
    initRatioChart();
    initOecdChart();
  } else {
    const s = document.querySelector('script[src*="chart.js"]');
    if (s) s.addEventListener("load", function () {
      initRateChart();
      initContributionChart();
      initPensionChart();
      initRatioChart();
      initOecdChart();
    });
  }
});
```

---

## 6. 등록 작업

### `src/data/reports.ts`

```ts
{
  slug: "national-pension-generational-comparison-2026",
  title: "국민연금 세대별 손익 비교 2026",
  description: "1960·1975·1990·2000년생 기준 납입 총액, 예상 수령액, 손익분기점, 수익비와 2026 연금개혁 영향 총정리",
  order: 25,
  badges: ["국민연금", "세대비교", "연금개혁", "2026"],
},
```

### `src/pages/reports/index.astro` — `reportMetaBySlug`

```ts
"national-pension-generational-comparison-2026": {
  eyebrow: "국민연금",
  tags: [
    { label: "국민연금", mod: "asset" },
    { label: "연금개혁", mod: "asset" },
    { label: "2026",    mod: "asset" },
  ],
  category: "asset",
  isNew: true,
},
```

### `src/pages/index.astro` — `reportMetaBySlug`

```ts
"national-pension-generational-comparison-2026": { category: "asset", isNew: true },
```

### `src/styles/app.scss`

```scss
@use 'scss/pages/national-pension-generational-comparison-2026';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/national-pension-generational-comparison-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 7. SEO 설계

```
title: "국민연금 세대별 손익 비교 2026 | 보험료율 인상·수익비·손익분기점 총정리 | 비교계산소"
description: "1960·1975·1990·2000년생 기준으로 국민연금 납입 총액, 예상 수령액, 손익분기점, 수익비를 비교하고 2026년 연금개혁 이후 달라지는 점까지 정리했습니다."
```

---

## 8. 구현 체크리스트

### 데이터

- [ ] `nationalPension2026.ts` 생성 — 제도 상수·시나리오 데이터·FAQ 전체 확인
- [ ] 제도 수치(보험료율·소득대체율 등) `공식` 배지 적용
- [ ] 시뮬레이션 데이터(납입 총액·수익비·손익분기점) `시뮬레이션` 배지 적용
- [ ] "손해냐 이득이냐" 단정 문구 없음 확인

### 페이지

- [ ] Hero KPI 4개 카드 배치
- [ ] 국민연금 개념 설명 박스 4개
- [ ] 보험료율 step chart 렌더링
- [ ] 세대별 납입 grouped bar chart (개혁 전/후 2 datasets)
- [ ] 세대별 수령액 bar chart (시나리오 버튼 연동)
- [ ] 수익비 horizontal bar chart (조기/정상/연기 탭 연동)
- [ ] 2055 vs 2071 타임라인 시각화 + "기금 소진 ≠ 지급 중단" 박스
- [ ] 조기/정상/연기 3-column 비교 카드
- [ ] 직장/지역가입자 2-column 비교 카드
- [ ] OECD horizontal bar chart (한국 강조)
- [ ] 체크리스트 6개 항목
- [ ] FAQ 6개 accordion
- [ ] `SeoContent` 하단 배치

### 스타일

- [ ] `np-` prefix 일관 적용
- [ ] 모바일 레이아웃(375px) 확인
- [ ] 차트 `width: 100%` + `min-height` 설정

### 스크립트

- [ ] 차트 5개 (`np-rate-chart`, `np-contribution-chart`, `np-pension-chart`, `np-ratio-chart`, `np-oecd-chart`) 렌더링 확인
- [ ] 시나리오 버튼 → contribution/pension 차트 데이터 전환
- [ ] 조기/정상/연기 탭 → ratio 차트 데이터 전환
- [ ] FAQ accordion

### 등록

- [ ] `src/data/reports.ts` order: 25 추가
- [ ] `src/pages/reports/index.astro` `reportMetaBySlug` 추가 (category: "asset")
- [ ] `src/pages/index.astro` `reportMetaBySlug` 추가 (category: "asset")
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가

### 빌드

- [ ] `npm run build` 에러 없음
- [ ] 리포트 목록에서 `자산` 카테고리로 노출
- [ ] 메인 페이지에서 `자산` 카테고리로 노출
