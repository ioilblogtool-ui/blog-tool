# 2026 직종별 야근·수당 실태 완전 비교 — 설계 문서

> 작성일: 2026-05-16
> 콘텐츠 유형: `/reports/` 비교 리포트
> 구현 기준: 6개 업종군 × 연장·야간·휴일 수당 지급 실태 + 포괄임금제 현황 + 수당 시뮬레이션 3인 사례

---

## 1. 문서 개요

- 구현 대상: `2026 직종별 야근·수당 실태 완전 비교`
- slug: `overtime-pay-by-job-2026`
- URL: `/reports/overtime-pay-by-job-2026/`
- 카테고리: 직업/연봉
- 핵심 검색 의도: "야근수당 직종별 비교", "IT 야근 수당 현황", "포괄임금제 많은 직종", "야근수당 미지급 대처"
- 핵심 CTA: `/tools/overtime-pay-calculator/` (3개 섹션에서 반복 삽입)
- 수익화: 노무사 상담 제휴 배너 (섹션 ⑨), 이직 플랫폼 제휴 (섹션 ⑬)

---

## 2. 구현 파일 구조

```text
src/
  data/
    overtimePayByJob2026.ts         ← 업종 데이터, 사례 시뮬레이션, FAQ, 관련 링크
  pages/
    reports/
      overtime-pay-by-job-2026.astro

src/styles/scss/pages/
  _overtime-pay-by-job-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/overtime-pay-by-job-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `report-page op-page opj-page` 클래스.
- 인터랙션: 없음 (정적 렌더링). 섹션 ②⑧⑩ Chart.js 차트 사용.
- SCSS prefix: `opj-`

---

## 4. 데이터 모델

```ts
// src/data/overtimePayByJob2026.ts

export type IndustryId =
  'it' | 'large-office' | 'sme-office' | 'medical' | 'production' | 'public';

export interface IndustryStat {
  id: IndustryId;
  label: string;                       // 업종명
  monthlyOvertimeHours: number;        // 월평균 연장근로 시간 (추정)
  overtimePayRate: number;             // 연장수당 지급률 (0~1, 추정)
  nightPayRate: number;                // 야간수당 지급률 (0~1, 추정)
  holidayPayRate: number;              // 휴일수당 지급률 (0~1, 추정)
  popalRate: number;                   // 포괄임금제 적용 비율 (0~1, 추정)
  over52Rate: number;                  // 주 52시간 초과 근무자 비율 (0~1, 추정)
  avgBasePay: number;                  // 업종 평균 기본급 (원, 추정)
  representativeJob: string;           // 대표 직종
  overtimeNote: string;                // 특이사항 한 줄
}

export interface CaseSimulation {
  id: string;
  label: string;                       // 사례 이름 (예: "IT 개발직 A씨")
  industryId: IndustryId;
  basePay: number;
  scheduledHours: number;
  overtimeHours: number;
  nightHours: number;
  holidayUnder8: number;
  holidayOver8: number;
  isPopal: boolean;
  popalAmount: number;
  // 계산 결과 (정적 데이터로 pre-compute)
  hourlyWage: number;
  overtimePay: number;
  nightPay: number;
  holidayPay: number;
  totalGross: number;
  totalNet: number;
  popalExcess: number;
}

export interface DisputeStat {
  year: number;
  totalCases: number;                  // 임금 체불 진정 건수
  avgAmount: number;                   // 평균 체불액 (원)
}
```

---

## 5. 업종별 통계 데이터 (추정)

```ts
export const INDUSTRY_STATS: IndustryStat[] = [
  {
    id: 'it',
    label: 'IT·소프트웨어',
    monthlyOvertimeHours: 28,
    overtimePayRate: 0.40,
    nightPayRate: 0.30,
    holidayPayRate: 0.35,
    popalRate: 0.70,
    over52Rate: 0.25,
    avgBasePay: 4200000,
    representativeJob: '소프트웨어 개발자',
    overtimeNote: '포괄임금제 만연, 실제 수당 지급률 낮음',
  },
  {
    id: 'large-office',
    label: '대기업 사무직',
    monthlyOvertimeHours: 18,
    overtimePayRate: 0.65,
    nightPayRate: 0.55,
    holidayPayRate: 0.60,
    popalRate: 0.40,
    over52Rate: 0.10,
    avgBasePay: 4800000,
    representativeJob: '기획·마케팅·재무',
    overtimeNote: '월말 마감 집중 야근, 수당 지급 비교적 양호',
  },
  {
    id: 'sme-office',
    label: '중소기업 사무직',
    monthlyOvertimeHours: 22,
    overtimePayRate: 0.35,
    nightPayRate: 0.25,
    holidayPayRate: 0.30,
    popalRate: 0.65,
    over52Rate: 0.18,
    avgBasePay: 2900000,
    representativeJob: '영업·총무·인사',
    overtimeNote: '포괄임금 비율 높음, 수당 미지급 빈번',
  },
  {
    id: 'medical',
    label: '의료·간호',
    monthlyOvertimeHours: 32,
    overtimePayRate: 0.80,
    nightPayRate: 0.75,
    holidayPayRate: 0.78,
    popalRate: 0.20,
    over52Rate: 0.30,
    avgBasePay: 3500000,
    representativeJob: '간호사·의료기사',
    overtimeNote: '야간·휴일 근무 다수, 수당 지급 체계 상대적 명확',
  },
  {
    id: 'production',
    label: '생산직·제조업',
    monthlyOvertimeHours: 35,
    overtimePayRate: 0.85,
    nightPayRate: 0.82,
    holidayPayRate: 0.80,
    popalRate: 0.15,
    over52Rate: 0.28,
    avgBasePay: 3100000,
    representativeJob: '생산직·설비직',
    overtimeNote: '야간·교대 근무 기반, 수당 규모 큼',
  },
  {
    id: 'public',
    label: '공공기관·공무원',
    monthlyOvertimeHours: 10,
    overtimePayRate: 0.90,
    nightPayRate: 0.88,
    holidayPayRate: 0.85,
    popalRate: 0.00,
    over52Rate: 0.04,
    avgBasePay: 3800000,
    representativeJob: '행정직·기술직',
    overtimeNote: '별도 초과근무 수당 체계, 야근 빈도 낮음',
  },
];
```

---

## 6. 사례 시뮬레이션 (3인, pre-computed)

```ts
export const CASE_SIMULATIONS: CaseSimulation[] = [
  {
    id: 'case-it',
    label: 'IT 개발직 A씨 (포괄임금제)',
    industryId: 'it',
    basePay: 4000000,
    scheduledHours: 209,
    overtimeHours: 20,
    nightHours: 0,
    holidayUnder8: 0,
    holidayOver8: 0,
    isPopal: true,
    popalAmount: 200000,
    // 통상임금: 4,000,000 ÷ 209 ≈ 19,139원
    hourlyWage: 19139,
    overtimePay: 574170,   // 19,139 × 1.5 × 20
    nightPay: 0,
    holidayPay: 0,
    totalGross: 574170,
    totalNet: 500276,      // × 0.872
    popalExcess: 374170,   // 574,170 - 200,000 (포괄임금 초과!)
  },
  {
    id: 'case-nurse',
    label: '간호사 B씨 (교대 야간 근무)',
    industryId: 'medical',
    basePay: 3400000,
    scheduledHours: 209,
    overtimeHours: 15,
    nightHours: 30,
    holidayUnder8: 8,
    holidayOver8: 8,
    isPopal: false,
    popalAmount: 0,
    // 통상임금: 3,400,000 ÷ 209 ≈ 16,268원
    hourlyWage: 16268,
    overtimePay: 366030,   // 16,268 × 1.5 × 15
    nightPay: 244020,      // 16,268 × 0.5 × 30
    holidayPay: 391632,    // (16,268×1.5×8) + (16,268×2.0×8)
    totalGross: 1001682,
    totalNet: 873466,
    popalExcess: 0,
  },
  {
    id: 'case-factory',
    label: '생산직 C씨 (야간 교대)',
    industryId: 'production',
    basePay: 2800000,
    scheduledHours: 209,
    overtimeHours: 10,
    nightHours: 40,
    holidayUnder8: 8,
    holidayOver8: 0,
    isPopal: false,
    popalAmount: 0,
    // 통상임금: 2,800,000 ÷ 209 ≈ 13,397원
    hourlyWage: 13397,
    overtimePay: 200955,   // 13,397 × 1.5 × 10
    nightPay: 267940,      // 13,397 × 0.5 × 40
    holidayPay: 160764,    // 13,397 × 1.5 × 8
    totalGross: 629659,
    totalNet: 549062,
    popalExcess: 0,
  },
];
```

---

## 7. 페이지 IA

1. **Hero** — 제목: "2026 직종별 야근·수당 실태 완전 비교", 부제: "IT·사무직·의료·생산직·공공기관 6개 업종의 야근 시간, 수당 지급률, 포괄임금 현황을 비교합니다"
2. **InfoNotice** — "이 리포트의 통계는 고용노동부·통계청 자료를 참고한 추정값입니다. 정확한 수치는 각 원출처를 확인하세요."
3. **TrustPanel** — 기준일: 2026-05
4. **핵심 요약 카드 (4개)**
5. **섹션 ① 야근 실태 총론**
6. **섹션 ② 직종별 월평균 연장근로 시간 순위** — 가로 막대 차트
7. **섹션 ③ 통상임금 산정 기준 해설** + 계산기 CTA ①
8. **섹션 ④ 업종별 수당 지급률 비교표**
9. **섹션 ⑤ 포괄임금제 현황·문제점** — 파이 차트 + 계산기 CTA ②
10. **섹션 ⑥ 야간·휴일근로 가산율 비교**
11. **섹션 ⑦ 실수령 시뮬레이션 (3인 사례)** + 계산기 CTA ③
12. **섹션 ⑧ 수당 미지급 분쟁 통계** — 라인 차트
13. **섹션 ⑨ 노동부 진정 절차 가이드** + 노무사 제휴 CTA
14. **섹션 ⑩ 성별·연령별 야근 교차 분석** — 그룹 막대 차트
15. **섹션 ⑪ 재택근무 전환 후 야근 변화**
16. **섹션 ⑫ 2026 근로시간 제도 개편 영향**
17. **섹션 ⑬ 직종별 야근 줄이는 협상 전략** + 이직 플랫폼 제휴 링크
18. **섹션 ⑭ 관련 계산기 CTA**
19. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 핵심 요약 카드 (4개)

| 카드 제목 | 내용 |
|----------|------|
| 야근 최다 업종 | 생산직·제조업 월평균 약 35시간 (추정) |
| 수당 지급률 최저 | 중소기업 사무직 연장수당 지급률 약 35% (추정) |
| 포괄임금 최다 | IT·소프트웨어 약 70% 적용 (추정) |
| 분쟁 최다 업종 | 제조업·음식·숙박업 임금 체불 신고 상위 (추정) |

---

## 9. 계산기 CTA 3곳 설계

### CTA ① — 섹션 ③ 통상임금 해설 하단

```html
<div class="opj-cta-box">
  <p class="opj-cta-text">내 통상임금과 이번 달 야근수당을 바로 계산해보세요.</p>
  <a href="/tools/overtime-pay-calculator/" class="opj-cta-btn">야근수당 계산기 →</a>
</div>
```

### CTA ② — 섹션 ⑤ 포괄임금 현황 하단

```html
<div class="opj-cta-box opj-cta-box--warning">
  <p class="opj-cta-text">포괄임금제라면 한도 초과 여부를 지금 확인하세요.</p>
  <a href="/tools/overtime-pay-calculator/" class="opj-cta-btn">포괄임금 초과 확인 →</a>
</div>
```

### CTA ③ — 섹션 ⑦ 시뮬레이션 하단

```html
<div class="opj-cta-box">
  <p class="opj-cta-text">내 직종·기본급으로 직접 계산해보세요.</p>
  <a href="/tools/overtime-pay-calculator/" class="opj-cta-btn">내 조건으로 계산하기 →</a>
</div>
```

---

## 10. 섹션별 마크업 설계

### 섹션 ② 직종별 월평균 연장근로 시간 순위

```html
<!-- 가로 막대 차트 -->
<canvas id="opj-overtime-chart" class="opj-chart-wrap"></canvas>
<!-- 순위 텍스트 카드 (차트 하단) -->
<div class="opj-rank-cards">
  <div class="opj-rank-card opj-rank-card--1">
    <span class="opj-rank-num">1위</span>
    <span class="opj-rank-label">생산직·제조업</span>
    <span class="opj-rank-value">월 약 35시간</span>
  </div>
  ...
</div>
```

### 섹션 ④ 업종별 수당 지급률 비교표

```html
<div class="opj-table-wrap">
  <table class="opj-stat-table">
    <thead>
      <tr>
        <th>업종</th>
        <th>연장수당 지급률</th>
        <th>야간수당 지급률</th>
        <th>휴일수당 지급률</th>
        <th>포괄임금 적용</th>
      </tr>
    </thead>
    <tbody>
      <!-- INDUSTRY_STATS 반복 렌더링 -->
      <!-- 지급률 낮음(< 0.4): class="opj-rate--low" (레드) -->
      <!-- 지급률 높음(> 0.75): class="opj-rate--high" (그린) -->
      <!-- 중간: class="opj-rate--mid" (노랑) -->
    </tbody>
  </table>
</div>
```

### 섹션 ⑦ 실수령 시뮬레이션 (3인 사례)

```html
<div class="opj-case-grid">
  <!-- 사례 3개 카드 반복 -->
  <div class="opj-case-card">
    <div class="opj-case-header">
      <span class="opj-case-label">IT 개발직 A씨</span>
      <span class="opj-case-tag opj-case-tag--warning">포괄임금 초과</span>
    </div>
    <div class="opj-case-body">
      <div class="opj-case-row">
        <span>기본급</span><span>400만 원</span>
      </div>
      <div class="opj-case-row">
        <span>통상임금(시간급)</span><span>19,139원</span>
      </div>
      <div class="opj-case-row opj-case-row--total">
        <span>법정 수당 합계(세전)</span><span class="opj-amount">574,170원</span>
      </div>
      <div class="opj-case-row opj-case-row--net">
        <span>세후 추정</span><span>약 500,000원</span>
      </div>
      <div class="opj-case-popal-warning">
        ⚠ 포괄임금 200,000원 초과 — 추가 청구 가능: 374,170원
      </div>
    </div>
  </div>
</div>
```

### 섹션 ⑨ 노무사 제휴 CTA

```html
<div class="opj-consult-banner">
  <div class="opj-consult-text">
    <strong>수당 미지급이 의심된다면?</strong>
    노무사 무료 상담으로 내 권리를 확인하세요.
  </div>
  <a href="{제휴링크}" class="opj-consult-btn" rel="noopener sponsored">
    노무사 무료 상담 →
  </a>
</div>
```

---

## 11. 차트 설계

### 섹션 ② — 직종별 연장근로 시간 가로 막대

```js
// Chart.js Bar (horizontal)
{
  type: 'bar',
  data: {
    labels: ['생산직', '의료·간호', 'IT·개발', '중소기업 사무', '대기업 사무', '공공기관'],
    datasets: [{
      data: [35, 32, 28, 22, 18, 10],
      backgroundColor: [
        '#0F6E56', '#1D9E75', '#2BAE84', '#4DC4A0', '#7DD8BC', '#B0EAD8'
      ],
    }]
  },
  options: { indexAxis: 'y', plugins: { legend: { display: false } } }
}
```

### 섹션 ⑤ — 포괄임금제 적용 비율 파이 차트

```js
// Chart.js Doughnut — 6개 업종 포괄임금 비율
// 범례: 업종명 + 비율(%)
```

### 섹션 ⑧ — 분쟁 통계 라인 차트

```js
// Chart.js Line — 연도별 임금 체불 진정 건수 추이
// X축: 연도(2020~2026), Y축: 건수(천 건)
```

### 섹션 ⑩ — 성별·연령 그룹 막대 차트

```js
// Chart.js Bar (grouped)
// X축: 20대·30대·40대·50대
// 데이터셋: 남성·여성 각각 연장근로 시간
```

---

## 12. 스타일 설계

```scss
.opj-page {

  .opj-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .opj-chart-wrap {
    position: relative;
    height: 280px;
    margin-top: 20px;
    @media (min-width: 760px) { height: 360px; }
  }

  .opj-rank-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 16px;
    @media (max-width: 640px) { grid-template-columns: 1fr; }

    .opj-rank-card {
      border: 1px solid #e8ede9;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      .opj-rank-num { display: block; font-size: 0.78rem; color: #6b7280; }
      .opj-rank-label { display: block; font-size: 0.96rem; font-weight: 700; }
      .opj-rank-value { display: block; font-size: 1.1rem; font-weight: 800; color: #0F6E56; }
      &.opj-rank-card--1 { border-color: #0F6E56; background: #f0fdf4; }
    }
  }

  .opj-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

  .opj-stat-table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
      font-size: 0.87rem;
    }
    th:first-child, td:first-child { text-align: left; }
    th { background: #f8fcfa; font-weight: 700; }

    .opj-rate--high { color: #0f6e56; font-weight: 700; }
    .opj-rate--mid  { color: #b45309; }
    .opj-rate--low  { color: #b91c1c; font-weight: 700; }
    .opj-popal--high { color: #b91c1c; }
    .opj-popal--low  { color: #0f6e56; }
  }

  .opj-case-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
    @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  }

  .opj-case-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    overflow: hidden;

    .opj-case-header {
      background: #f8fcfa;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .opj-case-label { font-weight: 700; font-size: 0.95rem; }
    }
    .opj-case-body { padding: 14px 16px; }
    .opj-case-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 0.87rem;
      border-bottom: 1px solid #f3f4f6;
      &.opj-case-row--total { font-weight: 700; }
      &.opj-case-row--net   { color: #0f6e56; }
    }
    .opj-case-popal-warning {
      margin-top: 10px;
      padding: 8px 10px;
      background: #fff5f5;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #b91c1c;
    }
    .opj-amount { color: #0f6e56; font-weight: 700; }
  }

  .opj-case-tag {
    font-size: 0.72rem;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 700;
    &.opj-case-tag--warning { background: #fee2e2; color: #991b1b; }
    &.opj-case-tag--ok      { background: #d1fae5; color: #065f46; }
  }

  // 계산기 CTA 박스
  .opj-cta-box {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 18px 20px;
    margin: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;

    &.opj-cta-box--warning {
      background: #fff5f5;
      border-color: #fca5a5;
    }
    .opj-cta-text { font-size: 0.94rem; font-weight: 600; color: #111827; }
    .opj-cta-btn {
      padding: 8px 18px;
      background: #0F6E56;
      color: #fff;
      border-radius: 8px;
      font-size: 0.86rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      &:hover { background: #0a5a46; }
    }
  }

  // 노무사 제휴 배너
  .opj-consult-banner {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 20px;

    .opj-consult-text { font-size: 0.92rem; color: #1e3a5f; }
    .opj-consult-btn {
      padding: 8px 18px;
      background: #1a56db;
      color: #fff;
      border-radius: 8px;
      font-size: 0.86rem;
      font-weight: 700;
      text-decoration: none;
    }
  }

  // 진정 절차 스텝
  .opj-step-list {
    counter-reset: opj-step;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      counter-increment: opj-step;
      display: flex;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.9rem;
      line-height: 1.7;

      &::before {
        content: counter(opj-step);
        min-width: 28px;
        height: 28px;
        background: #0F6E56;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        flex-shrink: 0;
        margin-top: 2px;
      }
    }
  }

  // 협상 전략 카드
  .opj-strategy-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(2, 1fr); }

    .opj-strategy-card {
      border: 1px solid #e8ede9;
      border-radius: 12px;
      padding: 16px;
      font-size: 0.88rem;
      line-height: 1.7;
      .opj-strategy-title {
        font-weight: 700;
        font-size: 0.96rem;
        margin-bottom: 8px;
        color: #111827;
      }
    }
  }
}
```

---

## 13. SEO 설계

```text
title: 2026 직종별 야근·수당 실태 완전 비교 — IT·병원·생산직·대기업 연장근로 비교
description: IT·사무직·의료·생산직 등 6개 업종의 월평균 야근 시간, 수당 지급률, 포괄임금제 현황, 분쟁 통계를 비교합니다. 수당 미지급 대처법과 2026 근로시간 제도 개편 영향도 정리했습니다.
H1: 2026 직종별 야근·수당 실태 완전 비교
```

JSON-LD: `Article` + `FAQPage`

키워드: 야근수당 직종별 비교, 포괄임금제 IT, 야근수당 미지급 대처, 연장근로 실태 2026, 통상임금 계산, 노동부 진정 절차

---

## 14. SeoContent 초안

### introTitle
`2026 직종별 야근·수당 실태 — 어느 직종이 야근이 많고, 수당은 제대로 받고 있나`

### intro (5문단)

1. 한국의 연간 근로시간은 OECD 최상위권입니다. 2026년 기준으로도 특정 업종에서는 월평균 30시간 이상의 연장근로가 발생하고 있으며, 그 중 상당수는 법정 수당을 제대로 지급받지 못하고 있습니다. 이 리포트는 IT·대기업 사무직·중소기업 사무직·의료·생산직·공공기관 6개 업종의 야근 실태를 수치로 비교합니다.

2. 직종별로 수당 지급 현황은 크게 다릅니다. 생산직과 공공기관은 수당 지급률이 80~90%대로 높은 반면, IT와 중소기업 사무직은 30~40%대에 머물고 있습니다. (추정) 그 주요 원인은 포괄임금제입니다. IT 직종의 포괄임금제 적용 비율은 약 70%에 달해, 연장근로 시간이 많아도 추가 수당을 받지 못하는 구조가 만연해 있습니다.

3. 포괄임금제는 그 자체가 불법은 아니지만, 실제 야근에 따른 법정 수당이 포괄임금 범위를 초과하는 경우 차액을 청구할 수 있습니다. 법원은 이 원칙을 여러 판결에서 재확인해 왔습니다. 이 리포트의 사례 시뮬레이션에서 IT 개발직 A씨는 월 연장 20시간 기준 법정 수당이 포괄임금을 약 37만 원 초과하는 것으로 나타났습니다.

4. 수당 미지급 분쟁은 매년 수십만 건 발생합니다. 임금 청구권 소멸시효는 3년이므로, 퇴직 후에도 3년 이내라면 청구 가능합니다. 고용노동부 민원마당을 통해 무료로 진정을 신청할 수 있으며, 노무사 선임 없이도 기본 절차를 진행할 수 있습니다.

5. 이 리포트의 통계 데이터는 고용노동부·통계청 자료를 참고한 추정값입니다. 업종 내에서도 기업 규모·계약 형태·지역에 따라 실태가 다를 수 있으므로 참고용으로 활용하고, 개인 상황에 맞는 정확한 수당 계산은 야근수당 계산기를 이용하거나 노무사 상담을 받으세요.

### FAQ (8개)

```ts
export const OPJ_FAQ = [
  {
    question: "어떤 직종이 야근이 가장 많은가요?",
    answer: "이 리포트 기준으로 생산직·제조업이 월평균 약 35시간으로 가장 많고, 의료·간호(약 32시간), IT·소프트웨어(약 28시간) 순입니다. (추정) 단, 생산직과 의료직은 수당 지급률이 높은 반면, IT와 중소기업 사무직은 포괄임금제로 인해 실제 수령 수당이 적습니다.",
  },
  {
    question: "포괄임금제가 많은 직종은 어디인가요?",
    answer: "IT·소프트웨어 직종의 포괄임금제 적용 비율이 약 70%로 가장 높습니다. 중소기업 사무직(약 65%), 대기업 사무직(약 40%) 순입니다. (추정) 생산직과 공공기관은 포괄임금제 적용이 거의 없으며 수당 지급 체계가 상대적으로 명확합니다.",
  },
  {
    question: "포괄임금제여도 수당을 더 받을 수 있나요?",
    answer: "네. 실제 법정 수당이 포괄임금 범위를 초과하면 차액을 청구할 수 있습니다. 야근수당 계산기에서 포괄임금 토글을 켜면 초과 여부를 즉시 확인할 수 있습니다. 초과 금액이 있다면 내용증명 발송 또는 노동부 진정을 통해 권리를 구제받을 수 있습니다.",
  },
  {
    question: "수당 미지급 시 노동부 진정을 어떻게 신청하나요?",
    answer: "고용노동부 민원마당(minwon.moel.go.kr)에서 '임금 체불' 진정을 온라인으로 무료 신청할 수 있습니다. 근로계약서, 급여명세서, 출퇴근 기록 등 증거자료를 함께 제출하면 처리가 빨라집니다. 평균 처리 기간은 1~3개월이며, 소멸시효는 3년입니다.",
  },
  {
    question: "재택근무 중 야근을 해도 수당을 받을 수 있나요?",
    answer: "네. 재택근무 중 연장·야간·휴일 근로를 한 경우 동일하게 수당이 지급되어야 합니다. 단, 사용자의 명시적 지시 또는 묵시적 승인 없이 자발적으로 한 야근은 인정이 어려울 수 있습니다. 근무 시간 기록(업무 시스템 로그, 메신저 기록 등)을 남겨두는 것이 중요합니다.",
  },
  {
    question: "2026년 근로시간 제도가 바뀌었나요?",
    answer: "2026년 기준으로 선택적 근로시간제 정산 기간 확대, 탄력근로제 단위 기간 관련 논의가 진행 중입니다. 주 52시간 상한 자체는 유지되고 있으나, 유연 근로 방식 확대로 실제 운영 방식이 업종별로 달라질 수 있습니다. 최신 법령은 고용노동부 공식 홈페이지에서 확인하세요.",
  },
  {
    question: "야근수당을 받고 퇴직하면 퇴직금 계산에 영향이 있나요?",
    answer: "퇴직금은 평균임금을 기준으로 계산됩니다. 퇴직 전 3개월간 수당이 많이 지급됐다면 평균임금이 올라가 퇴직금도 늘어날 수 있습니다. 반대로 수당 미지급 상태였다면 퇴직금도 적게 계산됩니다. 퇴직금 계산기와 연계해 확인해보세요.",
  },
  {
    question: "야근 협상 시 가장 효과적인 방법은 무엇인가요?",
    answer: "① 본인의 법정 수당 금액을 먼저 정확히 계산해 협상 근거로 제시 ② 포괄임금 한도 초과 시 법적 청구 가능성을 근거로 제도 개선 요구 ③ 야근 사유와 업무 성과를 기록해 '불필요한 야근'과 '필수 야근'을 구분 ④ 이직 시 면접에서 '야근 빈도와 포괄임금제 여부'를 반드시 확인하는 것을 권장합니다.",
  },
];
```

---

## 15. 관련 링크

- `/tools/overtime-pay-calculator/` — 야근수당 계산기
- `/tools/salary-calculator/` — 연봉 실수령 계산기
- `/tools/severance-pay-calculator/` — 퇴직금 계산기
- `/reports/it-si-sm-salary-comparison-2026/` — IT 직종 연봉 비교 리포트
- `/reports/large-company-salary-growth-by-years-2026/` — 대기업 연차별 연봉 성장 리포트

---

## 16. 등록 작업

```ts
// src/data/reports.ts 추가
{
  slug: 'overtime-pay-by-job-2026',
  title: '2026 직종별 야근·수당 실태 완전 비교',
  description: 'IT·사무직·의료·생산직 등 6개 업종의 월평균 야근 시간, 수당 지급률, 포괄임금 현황, 분쟁 통계를 비교합니다.',
  category: 'salary',
  order: ...,
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/overtime-pay-by-job-2026/</loc>
</url>
```

---

## 17. QA 체크리스트

- [ ] 모든 통계 수치에 `추정` 레이블 또는 출처 표기
- [ ] 수당 지급률 표 — 낮음(레드)·중간(노랑)·높음(그린) 색상 구분 정상
- [ ] 계산기 CTA 3곳 링크 정상 동작 (`/tools/overtime-pay-calculator/`)
- [ ] Chart.js 4개 차트 정상 렌더링 (막대 2, 파이 1, 라인 1)
- [ ] 사례 3인 수당 금액 계산 정확성 검증 (pre-computed 값)
- [ ] 포괄임금 초과 경고 카드 (`opj-case-tag--warning`) IT 사례에만 표시
- [ ] 노무사 제휴 배너 `rel="noopener sponsored"` 포함
- [ ] 이직 플랫폼 제휴 링크 섹션 ⑬ 정상 삽입
- [ ] 진정 절차 스텝 리스트 카운터 CSS 정상 표시
- [ ] FAQ 8개 `<details>` 접기/펼치기 정상
- [ ] 모바일 360px — 통계 표 가로 스크롤, 사례 카드 1열 정상
- [ ] InfoNotice "추정값" 면책 문구 노출 확인
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
