# 2026 산후조리원 비용 완전 비교 — 설계 문서

> 기획 원문: `docs/plan/202604/postpartum-center-cost-2026.md`
> 작성일: 2026-04-11
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `teacher-salary-2026`, `baby-cost-2016-vs-2026` (카드·탭·차트 패턴 재사용)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/postpartum-center-cost-2026.md`
- 구현 대상: `2026 산후조리원 비용 완전 비교`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **전국 지역별 산후조리원 비용 비교 콘텐츠**: 출산 예정 부부, 임신 초중기 검색 사용자, 비용 최적화 니즈 사용자의 정보 니즈 충족
- **핵심 흐름**: `전국 평균 파악 → 서울 vs 지방 격차 확인 → 서울 자치구별 비교 → 경기·인천 → 지방광역시 → 일반실/특실/프리미엄 차이 → 공공 vs 민간 → 지원금 사용 구조 → 비용 절약 전략 → FAQ`
- **SEO 포지셔닝**: `산후조리원 비용`, `산후조리원 가격`, `서울 산후조리원 가격`, `산후조리원 평균 비용`, `공공 산후조리원` 고검색량 키워드 커버

### 1-4. 권장 slug

- `postpartum-center-cost-2026`
- URL: `/reports/postpartum-center-cost-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    postpartumCenter2026.ts          ← 지역별 가격·지원금·비교데이터 통합
  pages/
    reports/
      postpartum-center-cost-2026.astro

public/
  scripts/
    postpartum-center-cost-2026.js   ← 지역 탭, 등급 필터, 차트, FAQ 인터랙션

src/styles/scss/pages/
  _postpartum-center-cost-2026.scss  ← 페이지 전용 스타일 (prefix: pc-)
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조 재사용

1. `CalculatorHero`
2. `InfoNotice` (데이터 출처 고지)
3. Hero KPI 카드
4. 핵심 인터랙티브 섹션 (지역 탭 + 가격 표)
5. 비교 차트 (지역별 bar chart)
6. 등급별 차이 (탭: 일반실·특실·프리미엄)
7. 공공 vs 민간 비교 표
8. 가격 상승 흐름 (line chart)
9. 대안 비교 (산후도우미·재가조리)
10. 지원금 섹션 (badge 구분)
11. FAQ accordion
12. 비용 절약 총정리
13. 관련 콘텐츠 CTA
14. `SeoContent`

### 2-2. 데이터 출처 표기 원칙

| 출처 유형 | 배지 표시 | 예시 |
|---|---|---|
| 보건복지부 공식 조사 | `공식` | 전국 평균 286.5만원 |
| 서울시·지자체 공식 자료 | `공식` | 서울 공공 229.5만원 |
| 언론 보도 기반 | `참고` | 서울 특실 810만원 |
| 편집부 분류 기준 | `편집부 기준` | 프리미엄 등급 분류 |
| 추정치 | `추정` | 연간 상승률 계산 |

---

## 3. 데이터 스키마

### 3-1. `postpartumCenter2026.ts` 익스포트 목록

```ts
// 메타
export const PC_META = {
  title: "2026 산후조리원 비용 완전 비교",
  description: "전국·서울·경기·지방 산후조리원 2주 기준 비용 비교",
  slug: "postpartum-center-cost-2026",
  updatedAt: "2026-04",
  dataSource: "보건복지부 2024 산후조리 실태조사, 서울시, 언론 보도 종합",
};

// Hero KPI 카드 (4개)
export const PC_HERO_STATS = [
  { label: "전국 평균 지출 (2주)", value: "286.5만원", note: "2024 보건복지부 공식", badge: "공식" },
  { label: "전국 일반실 평균 (2주)", value: "372만원", note: "2025년 하반기 현황", badge: "참고" },
  { label: "서울 일반실 평균 (2주)", value: "506만원", note: "서울시 현황", badge: "참고" },
  { label: "서울 특실 평균 (2주)", value: "810만원", note: "2026년 언론 보도 기준", badge: "참고" },
];

// 지역별 비교 데이터 타입
type RegionPrice = {
  region: string;
  standardAvg: number;  // 일반실 평균 (만원)
  suiteAvg?: number;    // 특실 평균 (만원)
  note?: string;
  badge: "공식" | "참고" | "추정" | "편집부 기준";
};

export const REGION_COMPARISON: RegionPrice[] = [
  { region: "서울", standardAvg: 506, suiteAvg: 810, badge: "참고" },
  { region: "광주", standardAvg: 407, badge: "참고" },
  { region: "세종", standardAvg: 396, badge: "참고" },
  { region: "전국 평균", standardAvg: 372, suiteAvg: 543, badge: "참고" },
];

// 서울 자치구별 (편집부 정리, 데이터 확보 범위 기준)
type SeoulDistrictPrice = {
  district: string;
  standardAvg?: number;
  suiteMax?: number;     // 최고가 기준
  note?: string;
};

export const SEOUL_DISTRICTS: SeoulDistrictPrice[] = [
  { district: "강남구", suiteMax: 1732, note: "특실 최고가 지역", },
  { district: "서울 전체 (일반실)", standardAvg: 506 },
  { district: "서울 전체 (특실)", suiteMax: 810 },
  // 실제 구현 시 데이터 확보 범위에 따라 확장
];

// 공공 vs 민간
export const PUBLIC_PRIVATE_COMPARE = [
  {
    type: "공공 산후조리원",
    avgCost2Weeks: 229.5,
    reservationDifficulty: "높음 (대기 필요)",
    location: "자치구 지정 시설",
    serviceRange: "기본 케어 위주",
    valueForMoney: "높음",
    badge: "공식",
  },
  {
    type: "민간 일반실",
    avgCost2Weeks: 477.5,
    reservationDifficulty: "보통",
    location: "전국 다수",
    serviceRange: "기본~중급 케어",
    valueForMoney: "보통",
    badge: "참고",
  },
  {
    type: "민간 특실",
    avgCost2Weeks: 764.1,
    reservationDifficulty: "낮음",
    location: "주요 도심",
    serviceRange: "고급 케어·부가서비스",
    valueForMoney: "낮음 (가격 대비)",
    badge: "참고",
  },
];

// 가격 상승 흐름 (연도별)
export const PRICE_TREND = [
  { period: "2021년", nationalAvg: 243.1, badge: "공식" },
  { period: "2024년", nationalAvg: 286.5, badge: "공식" },
  { period: "2024H2 (일반실)", nationalAvg: 355, badge: "참고" },
  { period: "2025H2 (일반실)", nationalAvg: 372, badge: "참고" },
  { period: "2024H2 (특실)", nationalAvg: 520, badge: "참고" },
  { period: "2025H2 (특실)", nationalAvg: 543, badge: "참고" },
];

// 대안 비교 (산후조리원 vs 산후도우미 vs 재가조리)
export const CARE_ALTERNATIVES = [
  {
    type: "산후조리원",
    avgCost: 286.5,
    costLevel: "높음",
    careIntensity: "높음",
    mobility: "외부 이동 필요",
    supportLink: "제한적",
  },
  {
    type: "산후도우미·재가조리",
    avgCost: 125.5,
    costLevel: "낮음",
    careIntensity: "가정환경에 따라 다름",
    mobility: "집에서 가능",
    supportLink: "일부 본인부담금 지원 연계 가능",
  },
];

// 등급별 차이
export const ROOM_TYPES = [
  {
    type: "일반실",
    roomDesc: "기본 1인실 중심",
    priceRange: "평균 구간",
    features: "기본 케어",
    badge: "공식",
  },
  {
    type: "특실",
    roomDesc: "더 넓은 1인실/고급형",
    priceRange: "상위 구간",
    features: "공간/식사/부가 서비스",
    badge: "참고",
  },
  {
    type: "프리미엄",
    roomDesc: "브랜드·부가서비스 강화",
    priceRange: "초고가 구간",
    features: "개인화·프라이빗 서비스",
    badge: "편집부 기준",
  },
];

// 지원금 구조 (사용 가능 여부 배지)
export const SUPPORT_FUNDS = [
  {
    name: "국민행복카드",
    usableForCenter: "카드사별 확인 필요",
    note: "바우처 담는 카드. 기본 이용료 직접 결제 카드 아님",
    badge: "참고",
    available: "conditional",
  },
  {
    name: "첫만남이용권",
    usableForCenter: "카드사별 우선 차감 순서 상이",
    note: "서울 자치구 안내 기준 카드사별 차감 순서 다름",
    badge: "참고",
    available: "conditional",
  },
  {
    name: "서울형 산후조리경비",
    usableForCenter: "기본 이용료 불가",
    note: "체형교정·붓기관리 등 업종코드 분리 항목은 예외 가능",
    badge: "공식",
    available: "no",
  },
];

// 비용 절약 체크리스트
export const SAVING_TIPS = [
  "공공 산후조리원 가능 여부 먼저 확인",
  "지역 지원금과 사용처 범위 확인",
  "일반실/특실 실제 필요 차이 검토",
  "산후조리원 vs 산후도우미 총비용 비교",
  "첫만남이용권·서울형 산후조리경비 사용 우선순위 확인",
  "계약금/환불 규정 사전 체크",
];

// FAQ
export const PC_FAQ = [
  {
    q: "산후조리원 2주 평균 비용은 얼마인가요?",
    a: "보건복지부 2024년 조사 기준 전국 평균 지출은 286.5만원입니다. 최신 현황 기준 전국 일반실 평균은 372만원, 특실 평균은 543만원입니다. 서울의 경우 일반실 평균이 506만원, 특실 평균이 810만원으로 전국 평균보다 높습니다.",
  },
  {
    q: "서울 산후조리원은 왜 이렇게 비싼가요?",
    a: "임대료·인건비 등 운영비가 높고 수요가 집중되어 있기 때문입니다. 강남구의 경우 특실 최고가가 1,732만원에 달하기도 합니다. 공공 산후조리원 이용 시 229.5만원 수준으로 비용을 줄일 수 있습니다.",
  },
  {
    q: "일반실과 특실 가격 차이는 얼마나 나나요?",
    a: "서울 기준 일반실 평균 506만원, 특실 평균 810만원으로 약 300만원 이상 차이가 납니다. 전국 기준으로는 일반실 372만원, 특실 543만원 수준입니다. 특실은 공간이 더 넓고 부가서비스가 강화되는 구조입니다.",
  },
  {
    q: "서울형 산후조리경비로 산후조리원 기본 이용료를 결제할 수 있나요?",
    a: "서울형 산후조리경비는 산후조리원 기본 이용료 결제가 불가합니다. 다만 체형교정, 붓기관리, 산후운동 등 업종코드가 분리된 항목은 예외적으로 가능할 수 있습니다. 반드시 해당 자치구 안내를 먼저 확인하세요.",
  },
  {
    q: "국민행복카드로 산후조리원비를 바로 결제할 수 있나요?",
    a: "국민행복카드는 여러 국가 바우처를 담는 카드로, 카드 자체가 곧 산후조리원 기본 이용료 결제 카드를 의미하지는 않습니다. 첫만남이용권과의 차감 우선순서가 카드사별로 다를 수 있으므로 카드사에 확인이 필요합니다.",
  },
  {
    q: "산후조리원과 산후도우미 중 어느 쪽이 더 저렴한가요?",
    a: "보건복지부 조사 기준 산후조리원 평균 지출은 286.5만원, 재가조리는 125.5만원으로 집에서의 산후조리가 더 저렴합니다. 예산·지원금 활용 여부·도움 인력 여부를 함께 고려해 선택하는 것을 권장합니다.",
  },
];
```

### 3-2. 데이터 주의사항

- 서울 자치구별 세부 가격은 공식 전수 데이터가 아닌 현황 보도 기반이므로 `참고` 배지 필수
- 경기·인천 데이터는 충분히 확보되지 않은 경우 권역형(경기 남부/북부/인천)으로 시작하고, 확보 범위에 따라 시 단위로 확장
- 프리미엄 등급은 공식 표준 등급이 아닌 편집부 분류 — `편집부 기준` 배지 필수
- 보험 관련 섹션: "실손으로 된다"는 단정 금지, 약관별 상이 문구 반드시 포함

---

## 4. 페이지 섹션 구성

### SECTION A. Hero

```astro
<CalculatorHero
  title="2026 산후조리원 비용 완전 비교"
  description="전국 평균 286.5만원에서 서울 특실 810만원까지, 지역·등급별 산후조리원 2주 비용을 한눈에 비교합니다."
  badges={["산후조리원", "비용", "2026", "서울"]}
/>
<InfoNotice
  text="이 리포트는 보건복지부 2024년 산후조리 실태조사, 서울시, 언론 보도를 종합한 참고용 정보입니다. 개별 시설 비용은 다를 수 있으므로 직접 확인 후 결정하세요."
/>
```

### SECTION B. Hero KPI 카드

```html
<div class="pc-kpi-grid">
  <!-- PC_HERO_STATS 4개 카드 -->
  <div class="pc-kpi-card">
    <span class="pc-badge pc-badge--official">공식</span>
    <p class="pc-kpi-label">전국 평균 지출 (2주)</p>
    <p class="pc-kpi-value">286.5만원</p>
    <p class="pc-kpi-note">2024 보건복지부 실태조사</p>
  </div>
  <!-- 나머지 3개 동일 패턴 -->
</div>
```

### SECTION C. 전국 vs 서울 지역 비교

- **H2**: 서울 vs 경기·인천 vs 지방 가격 비교
- **인터랙션**: 지역 탭(전체·서울·경기인천·지방광역시) 클릭 시 해당 지역 표/카드 표시
- **차트**: 지역별 일반실 평균 가격 horizontal bar chart (`pc-region-chart`)
- **표**: 지역 / 일반실 평균 / 특실 평균 / 비고

```html
<div class="pc-region-tabs" id="pc-region-tabs">
  <button class="pc-region-tab is-active" data-region="all">전체</button>
  <button class="pc-region-tab" data-region="seoul">서울</button>
  <button class="pc-region-tab" data-region="gyeonggi">경기·인천</button>
  <button class="pc-region-tab" data-region="regional">지방광역시</button>
</div>
<div class="pc-region-content">
  <canvas id="pc-region-chart" ...></canvas>
  <table class="pc-region-table" id="pc-region-table">...</table>
</div>
```

### SECTION D. 서울 자치구별 현황

- **H2**: 서울 산후조리원 비용 — 자치구별 현황
- **인터랙션**: 아코디언 카드 (data-district-id)
- **내용**: 강남 고가 vs 외곽 비교, 공공 조리원 위치 안내
- **주의**: 공식 전수 데이터가 아닌 경우 `참고` 배지 + 면책 문구

```html
<div class="pc-district-grid" id="pc-district-grid">
  <div class="pc-district-card" data-district-id="gangnam" role="button" tabindex="0" aria-expanded="false">
    <div class="pc-district-card__header">
      <span class="pc-badge pc-badge--note">참고</span>
      <h3 class="pc-district-name">강남구</h3>
      <span class="pc-toggle-icon">▼</span>
    </div>
    <div class="pc-district-panel" hidden>
      <p>특실 최고가: 1,732만원 (언론 보도 기준)</p>
    </div>
  </div>
  <!-- 기타 자치구 동일 패턴 -->
</div>
```

### SECTION E. 경기·인천 현황

- **H2**: 경기·인천 산후조리원 가격 비교
- 데이터 확보 범위에 따라 시 단위 또는 권역형(경기 남부/북부/인천)으로 표시
- 서울 대비 상대 수준 명시 ("서울 대비 약 OO% 수준")

### SECTION F. 지방 광역시 비교

- **H2**: 지방 광역시 산후조리원 비교
- 광주 407만원, 세종 396만원 등 수치 표시
- bar chart(`pc-regional-chart`) + 비교 표

### SECTION G. 일반실·특실·프리미엄 차이

- **H2**: 일반실·특실·프리미엄 차이
- **탭 인터랙션**: 일반실 / 특실 / 프리미엄 탭 전환
- `ROOM_TYPES` 데이터 기반 3-column 비교 카드
- 프리미엄 섹션에는 `편집부 기준` 배지 + 면책 문구 필수

```html
<div class="pc-roomtype-tabs">
  <button class="pc-roomtype-tab is-active" data-tab="standard">일반실</button>
  <button class="pc-roomtype-tab" data-tab="suite">특실</button>
  <button class="pc-roomtype-tab" data-tab="premium">프리미엄</button>
</div>
<div class="pc-roomtype-content">
  <div class="pc-roomtype-panel" data-tab="standard">...</div>
  <div class="pc-roomtype-panel" data-tab="suite" hidden>...</div>
  <div class="pc-roomtype-panel" data-tab="premium" hidden>...</div>
</div>
```

### SECTION H. 공공 vs 민간 산후조리원

- **H2**: 공공 산후조리원 vs 민간 조리원
- `PUBLIC_PRIVATE_COMPARE` 데이터 기반 비교 표
- 공공: 229.5만원 / 민간 일반실: 477.5만원 / 민간 특실: 764.1만원
- 예약 난이도, 위치, 서비스 범위, 가성비 항목 포함

### SECTION I. 가격 상승 흐름

- **H2**: 산후조리원 가격은 얼마나 올랐나
- line chart (`pc-trend-chart`): `PRICE_TREND` 데이터
  - 2021(243.1만원) → 2024(286.5만원) → 2025 하반기(일반실 372만원) 흐름
  - 일반실·특실 2개 데이터셋 표시
- 데이터 미확보 기간은 note 처리

```html
<canvas id="pc-trend-chart"
  data-labels='["2021","2024","2024H2","2025H2"]'
  data-standard='[243.1,286.5,355,372]'
  data-suite='[null,null,520,543]'
></canvas>
```

### SECTION J. 대안 비교 — 산후조리원 vs 산후도우미 vs 재가조리

- **H2**: 산후조리원 vs 산후도우미 비용 비교
- `CARE_ALTERNATIVES` 데이터 기반 2-column 비교 카드
- 핵심 메시지: "286.5만원 vs 125.5만원 — 예산·지원금·도움 인력 여부를 함께 봐야 합니다"

### SECTION K. 국민행복카드·첫만남이용권·지자체 지원금

- **H2**: 국민행복카드·첫만남이용권·지자체 지원금
- `SUPPORT_FUNDS` 데이터 기반 카드 목록
- 각 지원금에 `사용 가능` / `기본 이용료 불가` / `카드사별 확인` 배지 명확 표시
- 강조 문구: "지원금이 있다고 해서 조리원 기본비를 바로 깎아주는 구조는 아니다. 어디에 쓸 수 있는지부터 확인해야 한다."

```html
<div class="pc-support-list">
  {SUPPORT_FUNDS.map(fund => (
    <div class="pc-support-card">
      <span class={`pc-support-badge pc-support-badge--${fund.available}`}>
        {fund.available === 'no' ? '기본 이용료 불가' : '카드사별 확인'}
      </span>
      <h3>{fund.name}</h3>
      <p>{fund.note}</p>
    </div>
  ))}
</div>
```

### SECTION L. 쌍둥이·다태아 할증 실태

- **H2**: 쌍둥이·다태아 추가 비용
- 설명형 섹션 (공식 통계 없음 → `편집부 기준` 배지)
- 4개 항목: 객실 추가 비용 / 신생아 케어 인력 / 기간 연장 비용 / 다태아 지원제도 링크
- icon list 형태

### SECTION M. 예약 시기별 팁

- **H2**: 언제 예약해야 선택지가 넓을까
- 임신 초기·중기·후기 예약 단계별 설명
- 인기 지역 조기 마감 주의, 공공 조리원 대기 전략, 계약금·환불 규정 체크

### SECTION N. 보험/실손/특약 체크

- **H2**: 보험으로 산후조리원비를 받을 수 있나요?
- "실손으로 된다"는 단정 문구 금지
- 3가지 명확 분리:
  - 실손보험: 일반 의료비 중심
  - 산후조리원 기본 이용료: 약관별 확인 필요
  - 특약형 보장: 상품별 차이 큼
- 마지막 필수 문구: "반드시 보험사/증권 확인"

### SECTION O. 비용 절약 총정리

- **H2**: 산후조리원 비용 절약 총정리
- `SAVING_TIPS` 6개 항목 체크리스트 형태
- "저장/공유" 유도 CTA

### SECTION P. FAQ accordion

- **H2**: 산후조리원 비용 FAQ
- `PC_FAQ` 6개 항목
- `.pc-faq-item` / `.pc-faq-q` / `.pc-faq-a` 구조

### SECTION Q. 관련 콘텐츠 CTA

내부 링크 3개 최소:
- 출산지원금 총정리 (`/reports/birth-support-total/`)
- 신생아~돌까지 육아비용 (`/reports/baby-cost-guide-first-year/`)
- 육아휴직 계산기 (`/tools/parental-leave/`)

### SECTION R. SeoContent

```astro
<SeoContent
  heading="2026 산후조리원 비용 완전 비교 — 자주 묻는 질문"
  faqs={PC_FAQ}
/>
```

---

## 5. SCSS 설계 (`_postpartum-center-cost-2026.scss`)

### 5-1. prefix

모든 클래스명은 `pc-` prefix 사용

### 5-2. CSS 변수

```scss
.pc-page {
  --pc-color-standard: #4caf8d;    // 일반실
  --pc-color-suite:    #4a90d9;    // 특실
  --pc-color-premium:  #9c7cc7;    // 프리미엄
  --pc-color-public:   #f5a623;    // 공공
  --pc-color-private:  #e57373;    // 민간 고가
}
```

### 5-3. 주요 컴포넌트 스타일

```scss
// KPI 카드 그리드
.pc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.pc-kpi-card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  text-align: center;
  border: 1px solid var(--color-border);
}

.pc-kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

// 배지
.pc-badge {
  display: inline-block;
  padding: 0.15em 0.55em;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  &--official   { background: #e8f5e9; color: #388e3c; }
  &--note       { background: #fff3e0; color: #e65100; }
  &--editorial  { background: #f3e5f5; color: #7b1fa2; }
  &--estimate   { background: #e3f2fd; color: #1565c0; }
}

// 지원금 가용 배지
.pc-support-badge {
  &--no          { background: #ffebee; color: #c62828; }
  &--conditional { background: #fff8e1; color: #f57f17; }
  &--yes         { background: #e8f5e9; color: #2e7d32; }
}

// 지역 탭
.pc-region-tabs,
.pc-roomtype-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.pc-region-tab,
.pc-roomtype-tab {
  padding: 0.45rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &.is-active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }
}

// 차트 컨테이너
.pc-chart-wrap {
  width: 100%;
  min-height: 320px;
  position: relative;
  margin: 1.25rem 0;

  canvas {
    width: 100% !important;
  }
}

// 자치구 아코디언
.pc-district-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pc-district-card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  &.is-active {
    border-color: var(--color-primary);
  }
}

.pc-district-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  font-weight: 600;
}

.pc-district-panel {
  padding: 0.875rem 1rem 1rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

// 공공/민간 비교 표
.pc-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th {
    background: var(--color-surface-alt);
    padding: 0.625rem 0.75rem;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--color-border);
  }

  td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }
}

// 지원금 카드
.pc-support-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pc-support-card {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.4rem 0 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

// FAQ accordion
.pc-faq-item {
  border-bottom: 1px solid var(--color-border);

  &.is-open .pc-faq-q {
    color: var(--color-primary);
  }
}

.pc-faq-q {
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

.pc-faq-a {
  padding: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

// 비용 절약 체크리스트
.pc-saving-list {
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
      content: "✓";
      color: var(--color-primary);
      font-weight: 700;
      flex-shrink: 0;
    }
  }
}
```

---

## 6. JS 인터랙션 (`postpartum-center-cost-2026.js`)

IIFE 패턴 (기존 리포트 JS 패턴 동일), `pc-` prefix 유지

### 6-1. 함수 목록

| 함수명 | 역할 |
|---|---|
| `initRegionTabs()` | 지역 탭 전환 (전체·서울·경기인천·지방) — 표/차트 필터 |
| `initDistrictCards()` | 서울 자치구 아코디언 (accordion) |
| `initRoomTypeTabs()` | 일반실·특실·프리미엄 탭 전환 |
| `initRegionChart()` | 지역별 일반실 horizontal bar chart (`pc-region-chart`) |
| `initTrendChart()` | 가격 상승 line chart (`pc-trend-chart`) — 일반실/특실 2 dataset |
| `initFaq()` | FAQ accordion |

### 6-2. 차트 설정 공통

```js
canvas.height = 320;  // 항상 명시적 설정
// options:
{
  responsive: true,
  maintainAspectRatio: false,
}
```

### 6-3. `initRegionChart()`

```js
function initRegionChart() {
  const canvas = document.getElementById('pc-region-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  canvas.height = 280;

  const labels = JSON.parse(canvas.dataset.labels || '[]');
  const values = JSON.parse(canvas.dataset.values || '[]');

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '일반실 평균 (만원)',
        data: values,
        backgroundColor: 'rgba(76, 175, 141, 0.7)',
        borderColor: 'rgba(46, 125, 114, 1)',
        borderWidth: 1,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` 일반실 평균 약 ${ctx.parsed.x.toLocaleString('ko-KR')}만원`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: v => v + '만' },
          title: { display: true, text: '일반실 평균 (만원)', font: { size: 11 } },
        },
      },
    },
  });
}
```

### 6-4. `initTrendChart()` — 2 dataset (일반실/특실)

```js
function initTrendChart() {
  const canvas = document.getElementById('pc-trend-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  canvas.height = 320;

  const labels   = JSON.parse(canvas.dataset.labels   || '[]');
  const standard = JSON.parse(canvas.dataset.standard || '[]');
  const suite    = JSON.parse(canvas.dataset.suite    || '[]');

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '일반실 평균 (만원)',
          data: standard,
          borderColor: 'rgba(76, 175, 141, 1)',
          backgroundColor: 'rgba(76, 175, 141, 0.1)',
          tension: 0.3,
          fill: true,
          spanGaps: true,
        },
        {
          label: '특실 평균 (만원)',
          data: suite,
          borderColor: 'rgba(74, 144, 217, 1)',
          backgroundColor: 'rgba(74, 144, 217, 0.1)',
          tension: 0.3,
          fill: false,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: 약 ${ctx.parsed.y.toLocaleString('ko-KR')}만원`,
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: v => v + '만' },
          title: { display: true, text: '평균 비용 (만원)', font: { size: 12 } },
        },
      },
    },
  });
}
```

### 6-5. 초기화

```js
document.addEventListener('DOMContentLoaded', function () {
  initRegionTabs();
  initDistrictCards();
  initRoomTypeTabs();
  initFaq();

  if (typeof Chart !== 'undefined') {
    initRegionChart();
    initTrendChart();
  } else {
    const chartScript = document.querySelector('script[src*="chart.js"]');
    if (chartScript) {
      chartScript.addEventListener('load', function () {
        initRegionChart();
        initTrendChart();
      });
    }
  }
});
```

---

## 7. `src/data/reports.ts` 추가

```ts
{
  slug: "postpartum-center-cost-2026",
  title: "2026 산후조리원 비용 완전 비교",
  description: "전국 평균 286.5만원에서 서울 특실 810만원까지, 지역·등급별 산후조리원 2주 비용 총정리",
  order: 24,
  badges: ["산후조리원", "출산", "비용", "서울", "2026"],
},
```

## 8. `src/pages/reports/index.astro` — `reportMetaBySlug` 추가

```ts
"postpartum-center-cost-2026": {
  eyebrow: "산후조리원 비용",
  tags: [
    { label: "산후조리원", mod: "life" },
    { label: "출산비용",   mod: "life" },
    { label: "2026",       mod: "life" },
  ],
  category: "life",
  isNew: true,
},
```

## 9. `src/pages/index.astro` — `reportMetaBySlug` 추가

```ts
"postpartum-center-cost-2026": { category: "life", isNew: true },
```

## 10. `public/sitemap.xml` 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/postpartum-center-cost-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 11. SEO 설계

```
title: "2026 산후조리원 비용 완전 비교 | 서울·경기·지방 2주 가격 총정리 | 비교계산소"
description: "2026년 산후조리원 2주 비용을 서울·경기·지방별로 비교하고, 일반실·특실 가격 차이, 공공 산후조리원, 지원금, 국민행복카드, 절약 팁까지 한눈에 정리했습니다."
```

H 구조:
- H1: 2026 산후조리원 비용 완전 비교
- H2: 산후조리원 평균 비용 한눈에 보기
- H2: 서울 vs 경기·인천 vs 지방 가격 비교
- H2: 서울 산후조리원 비용 — 자치구별 현황
- H2: 일반실·특실·프리미엄 차이
- H2: 공공 산후조리원 vs 민간 조리원
- H2: 산후조리원 가격은 얼마나 올랐나
- H2: 산후조리원 vs 산후도우미 비용 비교
- H2: 국민행복카드·첫만남이용권·지자체 지원금
- H2: 산후조리원 비용 절약 총정리
- H2: 산후조리원 비용 FAQ

---

## 12. 구현 체크리스트

### 데이터

- [ ] `src/data/postpartumCenter2026.ts` 생성 및 전체 익스포트 확인
- [ ] 배지 표기 (`공식` / `참고` / `편집부 기준` / `추정`) 전 데이터에 적용
- [ ] 프리미엄 등급 `편집부 기준` 배지 + 면책 문구 확인

### 페이지

- [ ] `CalculatorHero` + `InfoNotice` 데이터 출처 고지 포함
- [ ] Hero KPI 카드 4개 배치
- [ ] 지역 탭 (전체·서울·경기인천·지방) 작동 확인
- [ ] 서울 자치구 아코디언 패널 작동 확인
- [ ] 일반실/특실/프리미엄 탭 작동 확인
- [ ] 공공 vs 민간 비교 표 배치
- [ ] 지원금 섹션: `사용 가능` / `기본 이용료 불가` / `카드사별 확인` 배지 명확히 표시
- [ ] 보험 섹션: "실손으로 된다" 단정 문구 없음 확인
- [ ] FAQ 6개 accordion 작동 확인
- [ ] 관련 콘텐츠 CTA 링크 3개 이상
- [ ] `SeoContent` 컴포넌트 하단 배치

### 스타일

- [ ] `pc-` prefix 일관 적용
- [ ] 모바일(375px) 레이아웃 확인
- [ ] 차트 `width: 100%` + `min-height: 320px` 설정 확인
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/postpartum-center-cost-2026';` 추가

### 스크립트

- [ ] 지역 탭 필터 작동 확인
- [ ] 자치구 아코디언 작동 확인
- [ ] 차트 두 개(`pc-region-chart`, `pc-trend-chart`) 렌더링 확인
- [ ] FAQ accordion 작동 확인

### 등록

- [ ] `src/data/reports.ts` 항목 추가 (order: 24)
- [ ] `src/pages/reports/index.astro` `reportMetaBySlug` 추가 (category: "life")
- [ ] `src/pages/index.astro` `reportMetaBySlug` 추가 (category: "life")
- [ ] `public/sitemap.xml` URL 추가

### 빌드

- [ ] `npm run build` 에러 없음
- [ ] `/reports/postpartum-center-cost-2026/` 라우트 `dist/`에 존재 확인
- [ ] 리포트 목록 페이지에서 `생활` 카테고리로 노출 확인
- [ ] 메인 페이지에서 `생활` 카테고리로 노출 확인
