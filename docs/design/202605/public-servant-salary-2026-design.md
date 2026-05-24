# 2026 공무원 9급 연봉·실수령액 완전 가이드 설계 문서

> 기획 원문: `docs/plan/202605/public-servant-salary-2026.md`
> 작성일: 2026-05-24
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 구현 기준: 공식 봉급표 기반 정적 리포트 + 호봉 선택 실수령액 계산기

---

## 1. 문서 개요

- 구현 대상: `2026 공무원 9급 연봉·실수령액 완전 가이드`
- slug: `public-servant-salary-2026`
- URL: `/reports/public-servant-salary-2026/`
- 카테고리: 직업·연봉
- 핵심 검색 의도: `공무원 9급 실수령액`, `공무원 봉급표 2026`, `9급 공무원 연봉`
- 페이지 성격: 정적 호봉표 + 인터랙티브 실수령액 계산기. teacher-salary-2026·police-salary-2026와 같은 레이아웃 패턴을 따른다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    publicServantSalary2026.ts
  pages/
    reports/
      public-servant-salary-2026.astro

public/
  scripts/
    public-servant-salary-2026.js
  og/
    reports/
      public-servant-salary-2026.png   ← og:generate 대상

src/styles/scss/pages/
  _public-servant-salary-2026.scss
```

추가 등록 대상:

- `src/data/reports.ts` — 리포트 메타 등록
- `src/pages/reports/index.astro` — 리포트 목록 노출 여부 확인
- `src/styles/app.scss` — SCSS partial import
- `public/sitemap.xml` — URL 등록

---

## 3. 레이아웃 방향

- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`를 사용한다.
- teacher-salary-2026·police-salary-2026 패턴을 직접 계승한다.
- Hero → 데이터 기준 안내 → KPI 카드 → 호봉표 → 계산기 → 비교·분석 섹션 → FAQ 순서를 고정한다.
- 모바일에서 계산기 입력과 결과가 한 화면에 보이도록 스크롤 없이 핵심 결과를 확인할 수 있게 한다.

권장 page class:

```astro
<main class="container page-shell report-page pss-page" data-pss-root>
```

SCSS prefix: `pss-`

---

## 4. 데이터 모델

```ts
// src/data/publicServantSalary2026.ts

export type GradeId = "9" | "8" | "7";

export interface HobongRow {
  no: number;         // 호봉 번호 (1~32)
  monthlyBase: number; // 원 단위 기본급
}

export interface GradeData {
  id: GradeId;
  name: string;              // "9급", "8급", "7급"
  jobGradeSupport: number;   // 직급보조비 (원)
  maxHobong: number;
  hobong: HobongRow[];
}

export interface FixedAllowance {
  name: string;
  amount: number;         // 원 (0이면 조건부)
  amountLabel: string;   // 화면 표시용 ("16만 원", "배우자 4만 원 + 자녀 2만 원")
  note: string;
  type: "fixed" | "conditional";
}

export interface VariableAllowance {
  name: string;
  description: string;
  note: string;
}

export interface DeductionRates {
  pension: number;          // 0.09
  healthInsurance: number;  // 0.03545
  longTermCare: number;     // 건강보험료 × 0.1295
}

export interface HeroStat {
  label: string;
  value: string;
  note: string;
  basis: "공식" | "추정";
}

export interface CareerMilestone {
  label: string;           // "신규 임용", "5년차" 등
  grade: string;
  hobong: number;
  monthlyBase: number;
  estimatedNet: number;    // 추정 실수령액
  basis: "추정";
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PssMeta {
  title: string;
  description: string;
  ogImage: string;
  updatedAt: string;
  source: string;
  sourceLaw: string;       // "공무원보수규정 별표 3 (2026.1.2 개정)"
}

export interface PublicServantSalary2026 {
  meta: PssMeta;
  heroStats: HeroStat[];
  grades: GradeData[];
  mealAllowance: number;    // 정액급식비 공통 (원)
  familyAllowance: {
    spouse: number;
    childPerPerson: number;
  };
  deductionRates: DeductionRates;
  fixedAllowances: FixedAllowance[];
  variableAllowances: VariableAllowance[];
  incomeTaxTable: IncomeTaxBracket[];  // 근로소득세 과세표준 구간
  raiseHistory: RaiseHistoryItem[];    // 연도별 인상률 추이
  careerMilestones: CareerMilestone[];
  faq: FaqItem[];
}

export interface IncomeTaxBracket {
  minWon: number;
  maxWon: number | null;  // null = 무한대
  ratePercent: number;
  deductionWon: number;
}

export interface RaiseHistoryItem {
  year: number;
  ratePercent: number;    // 예: 3.5
  note: string;
}
```

---

## 5. 주요 데이터 값

### 5-1. 9급 호봉표 (공식, 인사혁신처 2026.1.2 기준)

```ts
// 1·2·3호봉은 공식값, 이후는 월 평균 27,000원 증가 패턴 기반 추정
export const GRADE_9_HOBONG: HobongRow[] = [
  { no: 1, monthlyBase: 2_133_000 },
  { no: 2, monthlyBase: 2_193_000 },
  { no: 3, monthlyBase: 2_258_000 },
  { no: 4, monthlyBase: 2_300_000 },
  { no: 5, monthlyBase: 2_345_000 },
  { no: 6, monthlyBase: 2_390_000 },
  { no: 7, monthlyBase: 2_430_000 },
  { no: 8, monthlyBase: 2_470_000 },
  { no: 9, monthlyBase: 2_514_000 },
  { no: 10, monthlyBase: 2_558_000 },
  { no: 11, monthlyBase: 2_601_000 },
  { no: 12, monthlyBase: 2_644_000 },
  { no: 13, monthlyBase: 2_686_000 },
  { no: 14, monthlyBase: 2_745_000 },
  { no: 15, monthlyBase: 2_805_000 },
  { no: 16, monthlyBase: 2_848_000 },
  { no: 17, monthlyBase: 2_888_000 },
  { no: 18, monthlyBase: 2_930_000 },
  { no: 19, monthlyBase: 2_970_000 },
  { no: 20, monthlyBase: 3_100_000 },
  { no: 21, monthlyBase: 3_145_000 },
  { no: 22, monthlyBase: 3_190_000 },
  { no: 23, monthlyBase: 3_232_000 },
  { no: 24, monthlyBase: 3_274_000 },
  { no: 25, monthlyBase: 3_316_000 },
  { no: 26, monthlyBase: 3_358_000 },
  { no: 27, monthlyBase: 3_390_000 },
  { no: 28, monthlyBase: 3_420_000 },
  { no: 29, monthlyBase: 3_450_000 },
  { no: 30, monthlyBase: 3_480_000 },
];
// 주의: 4~19호봉, 21~30호봉은 추정값. 공식 봉급표 확인 후 보정 필요.
```

### 5-2. 직급보조비 (공식)

| 직급 | 직급보조비 |
|------|-----------|
| 9급  | 135,000원 |
| 8급  | 155,000원 |
| 7급  | 175,000원 |

### 5-3. 공제 요율 (공식)

| 항목 | 요율 |
|------|------|
| 공무원연금 기여금 | 기본급 × 9% |
| 건강보험료 | 기본급 × 3.545% |
| 장기요양보험 | 건강보험료 × 12.95% |
| 소득세 | 과세표준 구간별 (근로소득공제 적용) |
| 지방소득세 | 소득세 × 10% |

### 5-4. 고정 수당 (공식)

| 수당명 | 금액 | 비고 |
|--------|------|------|
| 정액급식비 | 160,000원 | 2026년 2만 원 인상 |
| 가족수당 | 배우자 40,000원 + 자녀 20,000원/인 | 해당자 한정 |
| 민원업무수당 | 30,000원 | 2026년 신설, 민원 담당자 한정 |

---

## 6. 실수령액 계산 로직

```
1. 기본급 = hobong[선택 호봉].monthlyBase
2. 고정수당 합계 = 직급보조비 + 정액급식비 + 가족수당(입력 기반)
3. 총지급 = 기본급 + 고정수당
4. 공무원연금 = 기본급 × 0.09
5. 건강보험 = 기본급 × 0.03545
6. 장기요양 = 건강보험 × 0.1295
7. 소득세 과세표준 = 기본급 × 12 → 근로소득공제 → 월 환산 → 세율 적용
8. 지방소득세 = 소득세 × 0.10
9. 공제합계 = 공무원연금 + 건강보험 + 장기요양 + 소득세 + 지방소득세
10. 실수령액 = 총지급 - 공제합계
11. 연봉 환산 = 실수령액 × 12 (명절휴가비 2회 별도)
```

> 소득세 간이 계산: 월 과세표준(기본급 - 근로소득공제 월 환산)에 대해 근로소득 간이세액표 적용. 정확도 우선보다 참고용 정밀도로 구현한다. 결과 카드에 `추정` 배지 표시 필수.

---

## 7. 페이지 IA

1. Hero (CalculatorHero)
2. 데이터 기준 안내 (InfoNotice)
3. 2026 핵심 수치 KPI 카드
4. 봉급 인상 현황 (Bar Chart — 연도별 인상률)
5. 호봉별 기본급 테이블 (전체 호봉 펼침 + 하이라이트)
6. 인터랙티브 실수령액 계산기
7. 수당 구조 완전 해설 (고정·변동 수당 + 공제 항목)
8. 20년 커리어 시뮬레이션 테이블
9. 민간·공무원 처우 비교
10. 관련 계산기 CTA
11. FAQ (SeoContent)
12. SeoContent

---

## 8. 핵심 UI 블록

### KPI 카드 (4개)

```
1호봉 기본급     수당 포함 총지급     세후 실수령액     연 환산 연봉
2,133,000원      약 286만 원/월       약 240~250만 원   약 3,428만 원
[공식]           [추정]               [추정]            [추정]
```

### 호봉표 UI

- 기본 상태: 1~30호봉 전체 테이블 (세로 스크롤)
- 모바일: 세로 테이블 그대로 유지. 가로 overflow hidden.
- 현재 선택 호봉 행을 `--pss-hobong-highlight` 색으로 강조
- 컬럼: 호봉 | 기본급 | 전년 대비 인상액

### 실수령액 계산기 블록

```html
<!-- 입력 영역 -->
<select data-pss-grade>  <!-- 직급 9/8/7급 -->
<input type="range" data-pss-hobong min="1" max="30">  <!-- 호봉 슬라이더 -->
<span data-pss-hobong-display>1</span>
<select data-pss-spouse>   <!-- 배우자 유무 -->
<select data-pss-children> <!-- 자녀 수 0~3 -->

<!-- 결과 영역 -->
<div data-pss-result-basic>    <!-- 기본급 -->
<div data-pss-result-allowance> <!-- 수당 합계 -->
<div data-pss-result-deduction> <!-- 공제 합계 -->
<div data-pss-result-net>      <!-- 실수령액 -->
<div data-pss-result-annual>   <!-- 연봉 환산 -->
```

계산기 결과 상단에 면책 InfoNotice 출력:
> "본 계산기는 참고용이며, 실제 수령액은 소속 기관·개인 상황에 따라 다를 수 있습니다."

---

## 9. JavaScript 설계

```js
// public/scripts/public-servant-salary-2026.js
(() => {
  const root = document.querySelector('[data-pss-root]');
  if (!root) return;

  // 데이터: Astro에서 JSON으로 직렬화해 data 속성에 주입
  const GRADES = JSON.parse(root.dataset.pssGrades || '[]');
  const DEDUCTION = JSON.parse(root.dataset.pssDeduction || '{}');

  // 입력 요소
  const elGrade    = root.querySelector('[data-pss-grade]');
  const elHobong   = root.querySelector('[data-pss-hobong]');
  const elHobongDisplay = root.querySelector('[data-pss-hobong-display]');
  const elSpouse   = root.querySelector('[data-pss-spouse]');
  const elChildren = root.querySelector('[data-pss-children]');

  // 결과 요소
  const elBasic     = root.querySelector('[data-pss-result-basic]');
  const elAllowance = root.querySelector('[data-pss-result-allowance]');
  const elDeduction = root.querySelector('[data-pss-result-deduction]');
  const elNet       = root.querySelector('[data-pss-result-net]');
  const elAnnual    = root.querySelector('[data-pss-result-annual]');

  function getInputs() {
    return {
      gradeId: elGrade?.value || '9',
      hobong: parseInt(elHobong?.value || '1', 10),
      hasSpouse: elSpouse?.value === '1',
      children: parseInt(elChildren?.value || '0', 10),
    };
  }

  function calcDeduction(base, { pension, healthInsurance, longTermCare }) {
    const p   = Math.round(base * pension);
    const hi  = Math.round(base * healthInsurance);
    const ltc = Math.round(hi * longTermCare);
    const tax = calcIncomeTax(base);
    const local = Math.round(tax * 0.1);
    return { pension: p, healthInsurance: hi, longTermCare: ltc, incomeTax: tax, localTax: local,
             total: p + hi + ltc + tax + local };
  }

  function calcIncomeTax(monthlyBase) {
    // 간이세액표 근사: 연 소득 기준 → 월 환산
    const annual = monthlyBase * 12;
    const deductedAnnual = calcLaborIncomeDeduction(annual);
    const tax = applyTaxBracket(deductedAnnual);
    return Math.max(0, Math.round(tax / 12));
  }

  function calcLaborIncomeDeduction(income) {
    // 근로소득공제 구간별 계산 (2026 기준)
    if (income <= 5_000_000)   return income * 0.7;
    if (income <= 15_000_000)  return 3_500_000 + (income - 5_000_000) * 0.4;
    if (income <= 45_000_000)  return 7_500_000 + (income - 15_000_000) * 0.15;
    if (income <= 100_000_000) return 12_000_000 + (income - 45_000_000) * 0.05;
    return 14_750_000 + (income - 100_000_000) * 0.02;
  }

  function applyTaxBracket(taxableIncome) {
    // 종합소득세율 구간 (2026 기준)
    if (taxableIncome <= 14_000_000)  return taxableIncome * 0.06;
    if (taxableIncome <= 50_000_000)  return 840_000  + (taxableIncome - 14_000_000) * 0.15;
    if (taxableIncome <= 88_000_000)  return 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
    if (taxableIncome <= 150_000_000) return 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
    return 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  }

  function calc() {
    const { gradeId, hobong, hasSpouse, children } = getInputs();
    const grade = GRADES.find(g => g.id === gradeId);
    if (!grade) return;

    const hobongRow = grade.hobong.find(h => h.no === hobong);
    if (!hobongRow) return;

    const base         = hobongRow.monthlyBase;
    const jobGrade     = grade.jobGradeSupport;
    const meal         = 160_000;
    const family       = (hasSpouse ? 40_000 : 0) + children * 20_000;
    const allowance    = jobGrade + meal + family;
    const { total: ded } = calcDeduction(base, DEDUCTION);
    const net          = base + allowance - ded;
    const annual       = net * 12;

    render({ base, allowance, deduction: ded, net, annual });
    highlightHobongRow(hobong);
  }

  function fmt(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }

  function render({ base, allowance, deduction, net, annual }) {
    if (elBasic)     elBasic.textContent     = fmt(base);
    if (elAllowance) elAllowance.textContent = fmt(allowance);
    if (elDeduction) elDeduction.textContent = fmt(deduction);
    if (elNet)       elNet.textContent       = fmt(net);
    if (elAnnual)    elAnnual.textContent    = Math.round(annual / 10_000).toLocaleString('ko-KR') + '만 원';
  }

  function highlightHobongRow(hobong) {
    root.querySelectorAll('[data-pss-hobong-row]').forEach(row => {
      row.classList.toggle('is-active', parseInt(row.dataset.pssHobongRow, 10) === hobong);
    });
  }

  function renderRaiseChart(data) {
    const ctx = root.querySelector('[data-pss-raise-chart]');
    if (!ctx || !window.Chart) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => String(d.year)),
        datasets: [{ data: data.map(d => d.ratePercent), backgroundColor: '#1a56db' }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 8 } } },
    });
  }

  // 이벤트 바인딩
  [elGrade, elSpouse, elChildren].forEach(el => el?.addEventListener('change', calc));
  elHobong?.addEventListener('input', () => {
    if (elHobongDisplay) elHobongDisplay.textContent = elHobong.value;
    calc();
  });

  // 초기 실행
  calc();
  const raiseData = JSON.parse(root.dataset.pssRaiseHistory || '[]');
  renderRaiseChart(raiseData);
})();
```

---

## 10. SCSS 설계

```scss
// src/styles/scss/pages/_public-servant-salary-2026.scss

.pss-page {
  // KPI 카드 그리드
  .pss-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .pss-kpi-card {
    padding: 1.25rem;
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: 8px;

    .pss-kpi-label { font-size: 0.8rem; color: var(--color-text-muted); }
    .pss-kpi-value { font-size: 1.4rem; font-weight: 700; }
    .pss-kpi-badge { font-size: 0.7rem; }
  }

  // 호봉표
  .pss-hobong-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .pss-hobong-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th, td { padding: 0.5rem 0.75rem; text-align: right; border-bottom: 1px solid var(--color-border); }
    th:first-child, td:first-child { text-align: center; }

    tr.is-active td { background: #eff6ff; font-weight: 700; }
  }

  // 계산기 레이아웃
  .pss-calc-grid {
    display: grid;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .pss-calc-inputs { display: flex; flex-direction: column; gap: 1rem; }

  .pss-calc-result {
    background: #f0f9ff;
    border-radius: 8px;
    padding: 1.5rem;

    .pss-result-row {
      display: flex;
      justify-content: space-between;
      padding: 0.4rem 0;
      border-bottom: 1px solid #bae6fd;

      &:last-child { border-bottom: none; font-weight: 700; font-size: 1.1rem; }
    }

    .pss-result-net { color: var(--color-primary, #1a56db); }
  }

  // 슬라이더
  .pss-hobong-slider { width: 100%; accent-color: var(--color-primary, #1a56db); }

  // 배지
  .pss-badge-official   { background: #dcfce7; color: #166534; }
  .pss-badge-estimated  { background: #fef9c3; color: #854d0e; }
  .pss-badge-simulation { background: #f0f9ff; color: #0369a1; }

  // 차트 패널
  .pss-chart-panel { max-height: 260px; }

  // CTA 패널
  .pss-cta-panel {
    display: grid;
    gap: 1rem;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  }

  // 모바일 320px 보장
  @media (max-width: 359px) {
    .pss-kpi-grid { grid-template-columns: 1fr; }
    .pss-kpi-value { font-size: 1.2rem; }
  }
}
```

---

## 11. SEO 설계

- `title`: `2026 공무원 9급 연봉·실수령액 완전 가이드 — 호봉별 월급 계산기`
- `description`: `2026년 공무원 9급 1호봉 초봉부터 30호봉까지 호봉별 기본급, 수당, 실수령액을 한눈에 확인하세요. 직급보조비·급식비·연금 공제까지 반영한 실수령액 계산기 제공.`
- H1: `2026 공무원 9급 연봉·실수령액 완전 가이드`
- FAQ 6개 이상 (검색 질문형)
- JSON-LD: `Article` + `FAQPage`

### 내부 링크

- `/reports/teacher-salary-2026/` ← 교사 연봉 리포트 (상호)
- `/reports/police-salary-2026/` ← 경찰 연봉 리포트 (상호)
- `/reports/firefighter-salary-2026/` ← 소방관 연봉 리포트
- `/reports/nurse-salary-2026/` ← 간호사 연봉 리포트

---

## 12. 데이터 운영 규칙

| 데이터 성격 | 화면 배지 | 구현 주의 |
|------------|-----------|-----------|
| 인사혁신처 고시 기본급 | `공식` | 출처명과 기준일(2026.1.2) 함께 표기 |
| 추정 호봉 보간값 | `참고` | 4~19호봉 등 비공식값은 `참고` 배지 |
| 계산기 실수령액 출력 | `추정` | 결과 카드 하단 면책 문구 필수 |
| 커리어 시뮬레이션 | `시뮬레이션` | 가정 조건(연 1호봉 승급 등)을 명기 |

---

## 13. QA 체크리스트

- [ ] 9급 1호봉 실수령액 계산 결과가 약 240~250만 원 범위 내에 있는지 확인
- [ ] 공식 데이터(기본급 1·2·3·10·15·20·30호봉)와 데이터 파일 값 일치 확인
- [ ] 호봉 슬라이더 1→30 조작 시 테이블 하이라이트와 계산 결과가 동기화됨
- [ ] 직급 변경(9급↔8급↔7급) 시 직급보조비가 정확히 반영됨
- [ ] 가족수당 선택/해제 시 실수령액 차이가 정상 계산됨
- [ ] Chart.js 미로드 시 호봉표와 KPI 카드 정상 노출
- [ ] 모바일 360px에서 계산기 입력·결과가 겹치지 않음
- [ ] 호봉표 모바일에서 가로 스크롤 없이 렌더링됨 (세로 스크롤)
- [ ] 추정/공식 배지가 모든 주요 수치에 표시됨
- [ ] 관련 링크(teacher, police, firefighter, nurse)가 실제 존재하는 라우트로 연결됨
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공

---

## 14. 구현 순서

1. `src/data/publicServantSalary2026.ts` — 타입 정의 + 데이터 입력 (9급 전체 호봉 공식값 확인 선행)
2. `src/styles/scss/pages/_public-servant-salary-2026.scss` 작성 + `app.scss` import
3. `src/pages/reports/public-servant-salary-2026.astro` — Astro 마크업 (Hero → 계산기 → 섹션들)
4. `public/scripts/public-servant-salary-2026.js` — 계산 로직 + 이벤트 바인딩
5. `src/data/reports.ts` 리포트 메타 등록
6. `public/sitemap.xml` URL 추가
7. `npm run build` 후 빌드 확인
8. 브라우저에서 계산기 동작·모바일 레이아웃 검증
