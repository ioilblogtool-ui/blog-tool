# 직종별 야근수당 계산기 — 설계 문서

> 작성일: 2026-05-16
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 통상임금 기반 연장·야간·휴일 수당 자동 산출 + 포괄임금 초과 경고 + 세후 추정

---

## 1. 문서 개요

- 구현 대상: `직종별 야근수당 계산기`
- slug: `overtime-pay-calculator`
- URL: `/tools/overtime-pay-calculator/`
- 카테고리: 직업/연봉
- 핵심 검색 의도: "야근수당 계산기", "연장근로 수당 계산", "포괄임금제 초과 여부 확인", "통상임금 시간급 계산"
- 핵심 출력: 통상임금(시간급), 연장·야간·휴일 수당 합계, 세후 추정 실수령 증가액, 포괄임금 초과 경고
- 핵심 CTA: `/reports/overtime-pay-by-job-2026/` + 노무사 상담 제휴 링크

---

## 2. 구현 파일 구조

```text
src/
  data/
    overtimePayCalculator.ts        ← 타입 정의, 직종 상수, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      overtime-pay-calculator.astro

public/
  scripts/
    overtime-pay-calculator.js

src/styles/scss/pages/
  _overtime-pay-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/overtime-pay-calculator';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 입력 패널 사이드, 결과 메인 영역.
- `resultFirst={false}` — 모바일 입력 먼저.
- SCSS prefix: `opc-`

```astro
<SimpleToolShell
  calculatorId="overtime-pay-calculator"
  pageClass="op-page opc-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
// src/data/overtimePayCalculator.ts

export type JobType = 'office' | 'production' | 'shift' | 'it' | 'medical' | 'other';
export type CompanySize = 'under5' | 'under30' | 'over30';

export interface OvertimeInput {
  jobType: JobType;
  basePay: number;               // 월 기본급 (원)
  scheduledHours: number;        // 월 소정근로시간 (기본 209)
  overtimeHours: number;         // 연장근로 시간
  nightHours: number;            // 야간근로 시간 (22:00~06:00)
  holidayHoursUnder8: number;    // 휴일근로 8h 이내
  holidayHoursOver8: number;     // 휴일근로 8h 초과
  companySize: CompanySize;      // 사업장 규모
  isPopalImgeum: boolean;        // 포괄임금제 여부
  popalAmount: number;           // 포괄임금 내 수당 총액 (원)
}

export interface OvertimeResult {
  hourlyWage: number;            // 통상임금(시간급)
  overtimePay: number;           // 연장근로 수당
  nightPay: number;              // 야간근로 가산수당
  holidayPayUnder8: number;      // 휴일근로 수당 (8h 이내)
  holidayPayOver8: number;       // 휴일근로 수당 (8h 초과)
  totalGross: number;            // 수당 합계 (세전)
  totalNet: number;              // 수당 합계 (세후 추정)
  popalExcess: number;           // 포괄임금 초과액 (음수면 정상)
  isPopalWarning: boolean;       // 포괄임금 초과 경고 여부
  weeklyOvertimeWarning: boolean; // 주 52시간 초과 경고 여부
}

export interface OvertimePreset {
  id: string;
  label: string;
  jobType: JobType;
  basePay: number;
  scheduledHours: number;
  overtimeHours: number;
  nightHours: number;
  holidayHoursUnder8: number;
  holidayHoursOver8: number;
  companySize: CompanySize;
  isPopalImgeum: boolean;
  popalAmount: number;
}

// 직종별 레이블
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  office:     '사무직',
  production: '생산직',
  shift:      '교대근무',
  it:         'IT 개발직',
  medical:    '의료·간호',
  other:      '기타',
};

// 사업장 규모별 가산율 적용 여부
export const OVERTIME_RATE: Record<CompanySize, number> = {
  under5: 0,    // 5인 미만: 가산율 미적용 (0%)
  under30: 0.5, // 5인 이상: 가산율 50%
  over30: 0.5,
};

// 간이 세율 + 4대보험 공제율 (추정)
export const NET_RATE = 0.872; // 세후 약 87.2% 수령 (간이 추정)
```

---

## 5. 계산 로직

### 5-1. 통상임금(시간급)

```text
통상임금(시간급) = 기본급 ÷ 월 소정근로시간

기본 소정근로시간: 209시간
= (주 40h + 주휴 8h) × 365 ÷ 7 ÷ 12 ≈ 209h
```

### 5-2. 연장근로 수당

```text
가산율 = OVERTIME_RATE[companySize]  // 5인 미만: 0, 이상: 0.5

연장근로 수당 = 통상임금 × (1 + 가산율) × 연장시간
```

5인 미만 사업장은 기본 임금(×1.0)만 적용, 별도 안내 배너 표시.

### 5-3. 야간근로 가산수당

```text
야간 가산수당 = 통상임금 × 0.5 × 야간시간
```

- 5인 미만 사업장도 야간 가산 적용 (근로기준법 제56조 예외 아님)
- 연장근로와 야간근로 중복 시 각각 별도 가산 (합산)

### 5-4. 휴일근로 수당

```text
휴일근로 수당 (8h 이내) = 통상임금 × (1 + 0.5) × 시간  →  × 1.5
휴일근로 수당 (8h 초과) = 통상임금 × (1 + 1.0) × 시간  →  × 2.0
```

5인 미만 사업장: 가산 없이 × 1.0 적용.

### 5-5. 수당 합계 및 세후 추정

```text
총 수당(세전) = 연장수당 + 야간수당 + 휴일수당(8h↓) + 휴일수당(8h↑)
총 수당(세후) = 총 수당(세전) × NET_RATE  // 약 87.2% 추정
```

### 5-6. 포괄임금 초과 여부

```text
초과액 = 총 수당(세전) - 포괄임금 내 수당
초과액 > 0 → isPopalWarning = true, 경고 배너 표시
초과액 ≤ 0 → 정상
```

### 5-7. 주 52시간 초과 경고

```text
월 연장시간 환산 주간 시간 = 연장시간 ÷ (4.345주/월)
환산 주간 연장시간 > 12h → weeklyOvertimeWarning = true
```

예외 처리:
- 기본급 0 또는 소정근로시간 0 → 계산 불가 안내
- 연장·야간·휴일 시간 모두 0 → "근로 시간을 입력하세요" 안내
- 소정근로시간 > 209 입력 시 → 안내 문구 표시 (가능하나 비일반적)

---

## 6. 프리셋 초안

| ID | 레이블 | 직종 | 기본급 | 연장 | 야간 | 휴일(8↓) | 휴일(8↑) | 포괄 |
|----|-------|------|--------|------|------|---------|---------|------|
| `preset-it` | IT 개발직 야근 | it | 400만 | 20h | 0 | 0 | 0 | 미적용 |
| `preset-nurse` | 간호사 교대 | medical | 340만 | 15h | 30h | 8h | 8h | 미적용 |
| `preset-factory` | 생산직 야간교대 | production | 280만 | 10h | 40h | 8h | 0 | 미적용 |
| `preset-office` | 사무직 월말 마감 | office | 320만 | 30h | 0 | 8h | 0 | 미적용 |

---

## 7. 페이지 IA

1. **Hero** — 제목: "야근수당 계산기", 부제: "통상임금 기반 연장·야간·휴일 수당을 계산하고 포괄임금 초과 여부를 확인합니다"
2. **InfoNotice** — "이 계산기는 근로기준법 기준 일반적인 산정 방식을 적용합니다. 실제 수당은 근로계약·단체협약에 따라 다를 수 있으며, 정확한 판단은 노무사 상담을 권장합니다."
3. **프리셋 버튼 (4개)**
4. **입력 패널** — 직종, 기본급, 소정근로시간, 연장·야간·휴일 시간, 사업장 규모, 포괄임금 토글
5. **KPI 카드 (4개)** — 통상임금(시간급), 수당 합계(세전), 수당 합계(세후 추정), 포괄임금 상태
6. **수당 상세 분해 테이블**
7. **포괄임금 비교 카드** (포괄임금제 선택 시)
8. **경고 배너** — 포괄임금 초과 / 주 52시간 초과 (조건 발생 시)
9. **노무사 제휴 CTA 배너**
10. **수당 구성 비율 파이 차트**
11. **직종별 안내 카드**
12. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-----------|
| 직종 유형 | select 6종 | office | 필수 |
| 기본급 (원) | number (쉼표 포맷) | 3,000,000 | min 10만, max 5천만 |
| 월 소정근로시간 | number | 209 | min 1, max 300 |
| 연장근로 시간 | number | 0 | min 0, max 200 |
| 야간근로 시간 | number | 0 | min 0, max 200 |
| 휴일근로 (8h 이내) | number | 0 | min 0, max 8 |
| 휴일근로 (8h 초과) | number | 0 | min 0, max 100 |
| 사업장 규모 | radio 3종 | over30 | 필수 |
| 포괄임금제 | toggle | false | — |
| 포괄임금 내 수당 | number (포괄임금 ON 시) | 0 | min 0 |

보조 문구:
- 기본급 아래: "식대·교통비 등 각종 수당을 제외한 기본급만 입력하세요"
- 소정근로시간 아래: "일반적으로 주 40시간 기준 월 209시간입니다"
- 야간근로 아래: "오후 10시~오전 6시 사이 실제 근무 시간"
- 포괄임금 내 수당 아래: "급여명세서에서 연장·야간·휴일 수당으로 표기된 금액의 합계"

포괄임금 토글 ON 시:
- 포괄임금 내 수당 입력 필드 슬라이드 표시
- "포괄임금제란?" 툴팁 or 링크 표시

---

## 9. 결과 UI 상세

### KPI 카드 (4개)

| 카드 | 레이블 | 서브 텍스트 | 비고 |
|------|--------|-----------|------|
| Main | 수당 합계 (세전) | 이번 달 추가 수령 예상액 | |
| 일반 | 통상임금(시간급) | 기본급 ÷ 소정근로시간 | |
| 일반 | 수당 합계 (세후 추정) | 소득세·4대보험 공제 후 추정 | |
| Accent / Warning | 포괄임금 상태 | 정상 or 초과 N만 원 | 초과 시 레드 Warning |

### 수당 상세 분해 테이블

| 항목 | 시간 | 가산율 | 수당 (원) |
|------|------|--------|---------|
| 연장근로 수당 | Nh | ×1.5 | X,XXX원 |
| 야간근로 가산 | Nh | ×0.5 | X,XXX원 |
| 휴일근로 (8h↓) | Nh | ×1.5 | X,XXX원 |
| 휴일근로 (8h↑) | Nh | ×2.0 | X,XXX원 |
| **합계 (세전)** | | | **X,XXX원** |
| **합계 (세후 추정)** | | | **X,XXX원** |

5인 미만 사업장 선택 시: 가산율 컬럼 "×1.0 (5인 미만)" 표시 + 상단 안내 배너.

### 포괄임금 비교 카드 (포괄임금제 ON 시)

```text
┌────────────────────────────────────┐
│  법정 수당 합계      XX,XXX원       │
│  포괄임금 내 수당    XX,XXX원       │
│  차액               +X,XXX원 ← 경고 │
│                                    │
│  ⚠ 이번 달 야근 기준 포괄임금 한도를 │
│  초과했습니다.                      │
│  [노무사 무료 상담 받기 →]          │
└────────────────────────────────────┘
```

### 주 52시간 초과 경고 배너 (조건부)

```text
⚠ 이번 달 연장근로 시간이 주 52시간 환산 기준을 초과합니다.
사업주는 근로기준법 위반으로 처벌받을 수 있습니다.
```

### 수당 구성 비율 파이 차트

- Chart.js Doughnut 차트
- 연장 / 야간 / 휴일(8h↓) / 휴일(8h↑) 4색 구분
- 중앙에 합계 금액 표시
- 수당이 0인 항목은 차트에서 제외

### 자연어 결과 메시지

```text
기본급 XXX만 원 기준 통상임금(시간급)은 XX,XXX원입니다.
이번 달 연장 Xh · 야간 Xh · 휴일 Xh 근무 기준
법정 수당 합계는 XX만 원(세전), 세후 추정 약 XX만 원입니다.
```

---

## 10. 직종별 안내 카드 (조건부 렌더링)

| 직종 | 표시 안내 |
|------|---------|
| IT개발 | "IT 직종은 포괄임금제 적용 비율이 높습니다. 포괄임금 한도 초과 여부를 반드시 확인하세요." |
| 생산직 | "교대·야간 근무가 많은 생산직은 야간 가산수당이 연간 수백만 원에 달할 수 있습니다." |
| 의료·간호 | "의료직은 야간·휴일 중복 근무가 많습니다. 중복 가산이 정확히 적용됐는지 확인하세요." |
| 사무직 | "포괄임금제 여부를 근로계약서에서 확인한 뒤 토글을 설정하세요." |
| 5인 미만 | "5인 미만 사업장은 연장·휴일 가산율(+50%)이 적용되지 않습니다. 기본 임금만 청구 가능합니다." |

---

## 11. JavaScript 설계

```js
// public/scripts/overtime-pay-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('opc-data').textContent);
  // DATA: { JOB_TYPE_LABELS, OVERTIME_RATE, NET_RATE }

  let state = {
    jobType: 'office',
    basePay: 3000000,
    scheduledHours: 209,
    overtimeHours: 0,
    nightHours: 0,
    holidayUnder8: 0,
    holidayOver8: 0,
    companySize: 'over30',
    isPopal: false,
    popalAmount: 0,
  };

  function sanitize(val, fallback = 0, min = 0, max = Infinity) {
    const n = parseFloat(String(val).replace(/,/g, ''));
    if (isNaN(n) || n < min) return fallback;
    return Math.min(n, max);
  }

  function readInputs() {
    state.jobType       = q('[data-opc-input="jobType"]')?.value ?? 'office';
    state.basePay       = sanitize(q('[data-opc-input="basePay"]')?.value, 3000000, 100000);
    state.scheduledHours = sanitize(q('[data-opc-input="scheduledHours"]')?.value, 209, 1, 300);
    state.overtimeHours = sanitize(q('[data-opc-input="overtimeHours"]')?.value, 0, 0, 200);
    state.nightHours    = sanitize(q('[data-opc-input="nightHours"]')?.value, 0, 0, 200);
    state.holidayUnder8 = sanitize(q('[data-opc-input="holidayUnder8"]')?.value, 0, 0, 8);
    state.holidayOver8  = sanitize(q('[data-opc-input="holidayOver8"]')?.value, 0, 0, 100);
    state.companySize   = q('[data-opc-input="companySize"]:checked')?.value ?? 'over30';
    state.isPopal       = q('[data-opc-input="isPopal"]')?.checked ?? false;
    state.popalAmount   = sanitize(q('[data-opc-input="popalAmount"]')?.value, 0, 0);
  }

  function calculate(s) {
    const hourlyWage = s.basePay / s.scheduledHours;
    const addRate = DATA.OVERTIME_RATE[s.companySize]; // 0 or 0.5

    const overtimePay      = hourlyWage * (1 + addRate) * s.overtimeHours;
    const nightPay         = hourlyWage * 0.5 * s.nightHours;   // 5인 미만도 야간 가산 적용
    const holidayPayUnder8 = hourlyWage * (1 + addRate) * s.holidayUnder8;
    const holidayPayOver8  = hourlyWage * (1 + Math.min(addRate * 2, 1.0)) * s.holidayOver8;

    const totalGross = overtimePay + nightPay + holidayPayUnder8 + holidayPayOver8;
    const totalNet   = totalGross * DATA.NET_RATE;

    const popalExcess       = s.isPopal ? totalGross - s.popalAmount : 0;
    const isPopalWarning    = s.isPopal && popalExcess > 0;

    // 주 52시간 경고: 월 연장시간 ÷ 4.345 > 12h
    const weeklyOvertimeWarning = (s.overtimeHours / 4.345) > 12;

    return {
      hourlyWage, overtimePay, nightPay,
      holidayPayUnder8, holidayPayOver8,
      totalGross, totalNet,
      popalExcess, isPopalWarning,
      weeklyOvertimeWarning,
    };
  }

  function renderKpi(r) { /* 4개 카드 갱신 */ }
  function renderTable(r, s) { /* 수당 분해 테이블 갱신 */ }
  function renderPopalCard(r, s) { /* 포괄임금 비교 카드 조건부 표시 */ }
  function renderWarnings(r) { /* 경고 배너 조건부 표시 */ }
  function renderChart(r) { /* Doughnut 차트 갱신 */ }
  function renderMessage(r, s) { /* 자연어 메시지 갱신 */ }
  function renderJobTip(s) { /* 직종별 안내 카드 교체 */ }
  function togglePopalField(isPopal) { /* 포괄임금 입력 필드 표시/숨김 */ }
  function applyPreset(id) { /* 프리셋 적용 */ }
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {}
  function q(sel) { return document.querySelector(sel); }

  restoreFromUrl();
  bindEvents();
  const result = calculate(state);
  renderKpi(result);
  renderTable(result, state);
  renderPopalCard(result, state);
  renderWarnings(result);
  renderChart(result);
  renderMessage(result, state);
  renderJobTip(state);
})();
```

URL 파라미터: `job` / `pay` / `hours` / `ot` / `night` / `hol1` / `hol2` / `size` / `popal` / `popalamt`

---

## 12. SCSS 설계

```scss
.opc-page {

  .opc-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    .opc-preset-btn {
      border: 1px solid #dce6e2;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      cursor: pointer;
      background: #fff;
      &.is-active { background: #0F6E56; color: #fff; border-color: #0F6E56; }
    }
  }

  .opc-kpi-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .opc-detail-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      font-size: 0.88rem;
    }
    th { background: #f8fcfa; font-weight: 700; text-align: left; }
    td:not(:first-child) { text-align: right; }
    tr.is-total td { font-weight: 700; background: #f0fdf4; }
    td.rate-label { color: #6b7280; font-size: 0.82rem; }
  }

  // 포괄임금 비교 카드
  .opc-popal-card {
    border: 1.5px solid #e8ede9;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 20px;
    display: none; // JS로 표시 제어
    &.is-visible { display: block; }

    .opc-popal-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 0.9rem;
      border-bottom: 1px solid #f3f4f6;
    }
    .opc-popal-excess {
      font-size: 1.1rem;
      font-weight: 700;
      &.is-over  { color: #b91c1c; }
      &.is-ok    { color: #0f6e56; }
    }
  }

  // 경고 배너
  .opc-warning-banner {
    display: none;
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: 10px;
    padding: 14px 18px;
    margin-top: 16px;
    font-size: 0.88rem;
    color: #7f1d1d;
    &.is-visible { display: flex; gap: 10px; align-items: flex-start; }

    .opc-warning-icon { font-size: 1.1rem; flex-shrink: 0; }
    .opc-warning-cta {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 14px;
      background: #b91c1c;
      color: #fff;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
    }
  }

  // 노무사 제휴 배너
  .opc-consult-banner {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;

    .opc-consult-text {
      font-size: 0.92rem;
      color: #1e3a5f;
      font-weight: 600;
    }
    .opc-consult-btn {
      padding: 8px 18px;
      background: #1a56db;
      color: #fff;
      border-radius: 8px;
      font-size: 0.86rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }

  // 파이 차트
  .opc-chart-wrap {
    position: relative;
    max-width: 300px;
    margin: 24px auto 0;
  }

  // 직종별 안내 카드
  .opc-job-tip {
    background: #f8faf9;
    border-left: 3px solid #0F6E56;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin-top: 20px;
    font-size: 0.88rem;
    color: #374151;
    line-height: 1.7;
  }

  // 포괄임금 필드 슬라이드
  .opc-popal-field {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
    &.is-open { max-height: 120px; }
  }
}
```

---

## 13. SEO 설계

```text
title: 야근수당 계산기 - 연장·야간·휴일 수당 자동 계산 + 포괄임금 초과 확인
description: 기본급과 연장·야간·휴일 근로 시간을 입력하면 통상임금 기반 수당을 자동 계산합니다. 포괄임금제 한도 초과 여부 확인 및 세후 실수령 증가액까지 한눈에 확인하세요.
H1: 직종별 야근수당 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 야근수당 계산기, 연장근로 수당 계산, 통상임금 계산, 포괄임금제 초과, 야간수당 계산, 휴일수당 계산

---

## 14. SeoContent 초안

### introTitle
`야근수당 계산기 — 통상임금 기반 연장·야간·휴일 수당과 포괄임금 초과 여부를 확인하세요`

### intro (5문단)

1. 야근수당은 근로기준법에 따라 통상임금을 기준으로 산정됩니다. 연장근로는 통상임금의 50%를 가산한 1.5배, 야간근로(22:00~06:00)는 0.5배 추가, 휴일근로는 8시간 이내 1.5배·8시간 초과 2.0배를 적용합니다. 이 계산기는 기본급과 근로 시간만 입력하면 법정 수당을 자동으로 계산해 드립니다.

2. 포괄임금제를 적용 중이라면, 실제 야근 시간에 따른 법정 수당이 포괄임금 범위를 초과하는지 반드시 확인해야 합니다. 법원은 포괄임금이 법정 수당에 미치지 못하는 경우 사업주가 차액을 지급해야 한다고 판결하고 있습니다. 특히 IT·사무직에서 포괄임금 초과 사례가 빈번하므로 이 계산기로 먼저 확인해보세요.

3. 5인 미만 사업장의 경우 근로기준법 일부 조항이 적용되지 않아 연장·휴일 가산율(+50%)이 적용되지 않습니다. 야간 가산(+50%)은 5인 미만도 적용됩니다. 이 계산기는 사업장 규모를 선택하면 자동으로 적용 가산율을 달리 적용합니다.

4. 세후 추정 수당은 간이 소득세율과 4대보험 근로자 부담분을 반영한 추정값입니다. 실제 세후 금액은 전체 소득 규모와 공제 항목에 따라 달라질 수 있으며, 정확한 계산은 급여명세서를 기준으로 확인하세요.

5. 이 계산기의 결과는 근로기준법 일반 기준에 따른 참고값입니다. 실제 수당은 근로계약서, 단체협약, 취업규칙에 따라 달라질 수 있습니다. 수당 미지급이 의심된다면 고용노동부 민원마당을 통해 진정을 신청하거나 노무사 상담을 받는 것을 권장합니다.

### FAQ (8개)

```ts
export const OPC_FAQ = [
  {
    question: "통상임금에 식대·교통비도 포함되나요?",
    answer: "정기적·일률적·고정적으로 지급되는 수당(고정 식대, 고정 교통비 등)은 통상임금에 포함될 수 있습니다. 실지출에 따라 지급되는 실비 변상 성격의 수당은 제외됩니다. 이 계산기는 기본급 기준으로 계산하므로, 정확한 통상임금 판단은 노무사 상담을 권장합니다.",
  },
  {
    question: "포괄임금제이면 야근수당을 추가로 받을 수 없나요?",
    answer: "아닙니다. 포괄임금이 실제 법정 수당보다 적을 경우 차액을 청구할 수 있습니다. 법원은 포괄임금 약정이 있더라도 실제 수당이 포괄임금을 초과하면 차액 지급 의무가 있다고 판결해 왔습니다. 이 계산기에서 포괄임금제 토글을 켜면 초과 여부를 즉시 확인할 수 있습니다.",
  },
  {
    question: "야간근로와 연장근로가 중복되면 어떻게 계산하나요?",
    answer: "야간근로(22:00~06:00)와 연장근로는 중복 적용이 가능합니다. 예를 들어 야간 시간대에 연장근로를 한 경우 연장 가산(+50%)과 야간 가산(+50%)이 모두 적용되어 통상임금의 2.0배를 받을 수 있습니다. 이 계산기에서는 연장과 야간을 각각 입력하면 중복 가산을 자동으로 합산합니다.",
  },
  {
    question: "5인 미만 사업장은 야근수당이 없나요?",
    answer: "5인 미만 사업장에서는 연장·휴일 가산율(+50%)이 적용되지 않아 기본 임금만 지급됩니다. 단, 야간근로 가산(+50%)은 5인 미만 사업장에도 적용됩니다. 즉, 밤 10시 이후 근무에 대해서는 야간 가산수당을 청구할 수 있습니다.",
  },
  {
    question: "주 52시간을 초과하면 어떤 처벌이 있나요?",
    answer: "근로기준법 위반으로 사업주는 2년 이하의 징역 또는 2,000만 원 이하의 벌금 처벌을 받을 수 있습니다. 다만 30인 미만 사업장은 계도 기간 등 예외가 적용될 수 있습니다. 근로자는 초과 근무를 강요받은 경우 고용노동부에 진정할 수 있습니다.",
  },
  {
    question: "수당 미지급 시 소멸시효가 있나요?",
    answer: "임금 청구권의 소멸시효는 3년입니다. 퇴직 후에도 3년 이내라면 미지급 수당을 청구할 수 있습니다. 노동부 진정은 무료로 신청할 수 있으며, 평균 처리 기간은 1~3개월 수준입니다.",
  },
  {
    question: "교대근무에서 야간 수당은 어떻게 계산하나요?",
    answer: "교대근무에서 오후 10시~오전 6시 사이에 해당하는 시간만큼 야간 가산(+50%)이 적용됩니다. 예를 들어 밤 10시~오전 6시 8시간 교대 근무라면 전체 8시간에 야간 가산이 붙습니다. 이 계산기에서 야간근로 시간 입력란에 실제 22:00~06:00 사이 근무 시간을 입력하세요.",
  },
  {
    question: "월 소정근로시간 209시간이 아닌 경우도 있나요?",
    answer: "네. 209시간은 주 40시간 기준 일반적인 경우이며, 단시간 근로자·격주 근무제 등은 소정근로시간이 다를 수 있습니다. 근로계약서에 명시된 소정근로시간을 직접 입력하면 더 정확한 통상임금을 산출할 수 있습니다.",
  },
];
```

---

## 15. 관련 링크

- `/reports/overtime-pay-by-job-2026/` — 직종별 야근·수당 실태 완전 비교
- `/tools/salary-calculator/` — 연봉 실수령 계산기
- `/tools/severance-pay-calculator/` — 퇴직금 계산기 (통상임금 연계)
- `/tools/parental-leave-short-work/` — 육아휴직·단축근무 급여 계산기
- `/reports/it-si-sm-salary-comparison-2026/` — IT 직종 연봉 비교 리포트

---

## 16. QA 체크리스트

- [ ] 기본급 0 또는 소정근로시간 0 입력 시 "입력값을 확인해 주세요" 안내, NaN 미노출
- [ ] 연장·야간·휴일 시간 모두 0 → "근로 시간을 입력하세요" 안내
- [ ] 5인 미만 선택 시 연장·휴일 가산율 0 적용, 야간 0.5 정상 적용
- [ ] 포괄임금 토글 OFF → 포괄임금 입력 필드 숨김, 비교 카드 미표시
- [ ] 포괄임금 초과 시 경고 배너 표시 + 노무사 CTA 버튼 노출
- [ ] 주 52시간 초과 경고 배너 조건 정상 동작
- [ ] 수당 합계 0일 때 파이 차트 빈 상태 처리 (근로 시간 미입력 시)
- [ ] 직종 변경 시 직종별 안내 카드 즉시 교체
- [ ] 프리셋 4개 클릭 시 모든 입력값 즉시 갱신
- [ ] 세후 추정 서브 텍스트 "간이 추정값" 안내 표시
- [ ] URL 파라미터 복원 정상 동작
- [ ] InfoNotice 법적 면책 문구 노출 확인
- [ ] 모바일 360px — KPI 2열, 테이블 가로 스크롤 정상
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
