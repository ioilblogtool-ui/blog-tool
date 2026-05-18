# 2026 연말정산 절세 전략 완전 정복 — 설계 문서

> 작성일: 2026-05-17
> 콘텐츠 유형: `/reports/` 심층 리포트
> 구현 기준: 14개 섹션 × 공제 항목별 절세 전략 + 연봉 구간별 시뮬레이션 + 에버그린 세법 업데이트 구조

---

## 1. 문서 개요

- 구현 대상: `2026 연말정산 절세 전략 완전 정복`
- slug: `2026-year-end-tax-saving-guide`
- URL: `/reports/2026-year-end-tax-saving-guide/`
- 카테고리: 세금/절세
- 핵심 검색 의도: "연말정산 절세 방법 2026", "연말정산 환급 많이 받는 방법", "연금저축 IRP 연말정산", "신용카드 체크카드 연말정산", "맞벌이 부부 연말정산"
- 핵심 CTA: `/tools/year-end-tax-refund-calculator/` (3개 섹션에서 반복)
- 수익화: 연금저축·IRP 제휴 배너 (섹션 ⑤), 세무사 상담 제휴 (섹션 ⑫)

---

## 2. 구현 파일 구조

```text
src/
  data/
    yearEndTaxSavingGuide2026.ts    ← 섹션 데이터, 시뮬레이션 케이스, FAQ, 관련 링크
  pages/
    reports/
      2026-year-end-tax-saving-guide.astro

src/styles/scss/pages/
  _2026-year-end-tax-saving-guide.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/2026-year-end-tax-saving-guide';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `report-page op-page yets-page` 클래스.
- 인터랙션: Chart.js 차트 2개 (섹션 ②, ⑥).
- SCSS prefix: `yets-`

---

## 4. 데이터 모델

```ts
// src/data/yearEndTaxSavingGuide2026.ts

export interface TaxBracketRow {
  salary: string;            // 연봉 표시 (예: "3천만 원")
  marginalRate: string;      // 한계세율
  incomeDeduction100: number; // 소득공제 100만 원 절세액 (원)
  taxCreditEffect: number;   // 세액공제 100만 원 절세액 = 항상 100만 원
}

export interface PensionCreditRow {
  salaryLabel: string;       // 연봉 구간 레이블
  creditRate: number;        // 공제율 (0.165 or 0.132)
  maxBase: number;           // 공제 기준 납입액 (900만 원)
  maxCredit: number;         // 최대 세액공제액
}

export interface SimulationCase {
  id: string;
  label: string;
  salary: number;
  desc: string;              // 케이스 설명
  withheld: number;          // 기납부세액 (추정)
  finalTax: number;          // 결정세액 (추정)
  refund: number;            // 환급액 (추정)
}

export interface MistakeItem {
  rank: number;
  title: string;
  desc: string;
}

export interface YetsFaq {
  question: string;
  answer: string;
}

export interface YetsLink {
  href: string;
  label: string;
}
```

---

## 5. 핵심 데이터 상수

```ts
// 소득공제 vs 세액공제 임팩트 비교 (추정)
export const TAX_BRACKET_ROWS: TaxBracketRow[] = [
  { salary: "3천만 원",  marginalRate: "15%", incomeDeduction100: 154000,  taxCreditEffect: 1000000 },
  { salary: "5천만 원",  marginalRate: "24%", incomeDeduction100: 246000,  taxCreditEffect: 1000000 },
  { salary: "7천만 원",  marginalRate: "35%", incomeDeduction100: 359000,  taxCreditEffect: 1000000 },
  { salary: "1억 원",   marginalRate: "35%", incomeDeduction100: 359000,  taxCreditEffect: 1000000 },
  { salary: "1.5억 원", marginalRate: "38%", incomeDeduction100: 390000,  taxCreditEffect: 1000000 },
];

// 연금저축·IRP 세액공제
export const PENSION_CREDIT_ROWS: PensionCreditRow[] = [
  { salaryLabel: "5,500만 원 이하", creditRate: 0.165, maxBase: 9000000, maxCredit: 1485000 },
  { salaryLabel: "5,500만 원 초과", creditRate: 0.132, maxBase: 9000000, maxCredit: 1188000 },
];

// 연봉 구간별 환급 시뮬레이션 (4케이스, 추정)
export const SIMULATION_CASES: SimulationCase[] = [
  {
    id: "single-30m",
    label: "케이스 ①",
    salary: 30000000,
    desc: "연봉 3천만 원 · 미혼 · 기본공제만 적용",
    withheld: 400000,
    finalTax: 180000,
    refund: 220000,
  },
  {
    id: "married-50m",
    label: "케이스 ②",
    salary: 50000000,
    desc: "연봉 5천만 원 · 배우자+자녀 1명 · 신용카드+연금저축",
    withheld: 2100000,
    finalTax: 750000,
    refund: 1350000,
  },
  {
    id: "dual-70m",
    label: "케이스 ③",
    salary: 70000000,
    desc: "연봉 7천만 원 · 맞벌이 · IRP 최대 납입",
    withheld: 5800000,
    finalTax: 3200000,
    refund: 2600000,
  },
  {
    id: "high-100m",
    label: "케이스 ④",
    salary: 100000000,
    desc: "연봉 1억 원 · 최대 공제 적용",
    withheld: 13500000,
    finalTax: 9800000,
    refund: 3700000,
  },
];

// 절세 실수 TOP10
export const MISTAKE_LIST: MistakeItem[] = [
  { rank: 1,  title: "간소화 자료만 확인하고 추가 서류 미제출", desc: "의료비·월세·기부금 등 간소화에 미포함된 서류는 직접 제출 필요" },
  { rank: 2,  title: "부양가족 소득 초과 상태에서 공제 신청", desc: "연간 소득 100만 원 초과 부양가족 공제 시 가산세 발생" },
  { rank: 3,  title: "신용카드 공제 한도 초과분 미확인", desc: "한도(최대 300만 원) 넘는 사용액은 추가 공제 없음" },
  { rank: 4,  title: "연금저축·IRP 납입 기한(12월 31일) 놓침", desc: "1월 이후 납입분은 다음 연도 공제 적용" },
  { rank: 5,  title: "월세 세액공제 서류 미제출", desc: "임대차계약서 + 월세 납입 증빙 별도 제출 필요" },
  { rank: 6,  title: "의료비 총급여 3% 기준선 미계산", desc: "기준 미달이면 공제 불가 — 사전 계산 필수" },
  { rank: 7,  title: "교육비 공제 대상 착각", desc: "학원비는 일부만 해당 — 국가 인가 교육기관 여부 확인" },
  { rank: 8,  title: "맞벌이 부양가족 중복 공제", desc: "동일 부양가족 중복 신청 시 가산세 발생" },
  { rank: 9,  title: "기부금 영수증 미발급 상태 신청", desc: "공인된 기관 기부금 영수증 없으면 공제 불가" },
  { rank: 10, title: "경정청구 기회 미활용", desc: "5년 이내 누락 공제는 홈택스에서 소급 신청 가능" },
];

export const YETS_FAQ: YetsFaq[] = [ /* 8개 FAQ */ ];

export const YETS_RELATED_LINKS: YetsLink[] = [
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급액 계산기" },
  { href: "/tools/irp-pension-calculator/",         label: "IRP·연금저축 세액공제 계산기" },
  { href: "/tools/salary/",                         label: "연봉 실수령 계산기" },
  { href: "/tools/overtime-pay-calculator/",         label: "야근수당 계산기" },
  { href: "/reports/retirement-pension-dc-db-irp-2026/", label: "퇴직연금 DC·DB·IRP 비교" },
];
```

---

## 6. 페이지 IA

1. **Hero** — 제목: "2026 연말정산 절세 전략 완전 정복", 배지: ["연말정산", "절세", "2026", "참고용"]
2. **InfoNotice** — "이 리포트의 계산 예시는 2026년 소득세법 기준 참고용 추정값입니다. 실제 공제 조건·한도는 국세청 홈택스에서 확인하고 신고하세요."
3. **TrustPanel** — 기준: 2026년 소득세법
4. **핵심 요약 카드 (4개)**
5. **섹션 ① 연말정산 기본 구조**
6. **섹션 ② 소득공제 vs 세액공제 임팩트 비교** — 막대 차트 + 비교표
7. **섹션 ③ 신용카드·체크카드 최적 비율**
8. **섹션 ④ 의료비·교육비·주택자금 공제 예시**
9. **섹션 ⑤ 연금저축·IRP 세액공제 효과** + 계산기 CTA ① + 제휴 배너
10. **섹션 ⑥ 월세 vs 전세대출 공제 비교**
11. **섹션 ⑦ 부양가족 인정 기준·공제 누락 TOP5**
12. **섹션 ⑧ 맞벌이 부부 공제 쪼개기** + 계산기 CTA ②
13. **섹션 ⑨ 중소기업 취업자·청년 특별 감면**
14. **섹션 ⑩ 기부금 공제**
15. **섹션 ⑪ 연봉 구간별 환급 시뮬레이션** — 막대 차트 + 계산기 CTA ③
16. **섹션 ⑫ 절세 실수 TOP10 체크리스트** + 세무사 제휴 배너
17. **섹션 ⑬ 2026 세법 개정 예고**
18. **섹션 ⑭ 관련 계산기 CTA**
19. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 7. 핵심 요약 카드 (4개)

| 카드 제목 | 내용 |
|----------|------|
| 최대 환급 포인트 | 연금저축+IRP 900만 원 납입 시 최대 약 148만 원 환급 (5,500만 원 이하) |
| 신용카드 공제 기준 | 총급여의 25% 초과분부터 공제 시작 |
| 놓치기 쉬운 공제 1위 | 월세 세액공제 — 서류 미제출로 누락 가장 많음 |
| 에버그린 절세 행동 | 매년 12월 31일 전 연금저축·IRP 한도 확인 |

---

## 8. 섹션별 마크업 설계

### 섹션 ① 연말정산 기본 구조 (흐름도)

```html
<div class="yets-flow">
  <div class="yets-flow-step">
    <span class="yets-flow-num">①</span>
    <strong>총급여</strong>
    <small>비과세 제외 연간 급여</small>
  </div>
  <div class="yets-flow-arrow">→</div>
  <div class="yets-flow-step">
    <span class="yets-flow-num">②</span>
    <strong>근로소득공제</strong>
    <small>자동 적용</small>
  </div>
  <div class="yets-flow-arrow">→</div>
  <div class="yets-flow-step">
    <span class="yets-flow-num">③</span>
    <strong>소득공제</strong>
    <small>카드·부양가족 등</small>
  </div>
  <div class="yets-flow-arrow">→</div>
  <div class="yets-flow-step">
    <span class="yets-flow-num">④</span>
    <strong>과세표준</strong>
    <small>× 세율 = 산출세액</small>
  </div>
  <div class="yets-flow-arrow">→</div>
  <div class="yets-flow-step">
    <span class="yets-flow-num">⑤</span>
    <strong>세액공제</strong>
    <small>연금·의료비 등</small>
  </div>
  <div class="yets-flow-arrow">→</div>
  <div class="yets-flow-step yets-flow-step--result">
    <span class="yets-flow-num">⑥</span>
    <strong>결정세액</strong>
    <small>기납부세액 - 결정세액 = 환급</small>
  </div>
</div>
```

### 섹션 ② 소득공제 vs 세액공제 비교표

```html
<div class="yets-table-wrap">
  <table class="yets-impact-table">
    <thead>
      <tr>
        <th>연봉</th>
        <th>한계세율</th>
        <th>소득공제 100만 원 절세액</th>
        <th>세액공제 100만 원 절세액</th>
      </tr>
    </thead>
    <tbody>
      <!-- TAX_BRACKET_ROWS 반복 -->
      <!-- 세액공제 열: 항상 100만 원 = 그린 강조 -->
      <!-- 소득공제 절세액: 한계세율 낮을수록 회색 -->
    </tbody>
  </table>
</div>
<!-- 핵심 인사이트: "세액공제는 소득 구간 무관하게 동일 절세 효과" -->
```

### 섹션 ⑤ 연금저축·IRP 세액공제 표

```html
<div class="yets-pension-grid">
  {PENSION_CREDIT_ROWS.map(row => (
    <div class="yets-pension-card">
      <div class="yets-pension-label">{row.salaryLabel}</div>
      <div class="yets-pension-rate">{(row.creditRate * 100).toFixed(1)}%</div>
      <div class="yets-pension-max">
        최대 납입 900만 원 → 환급 <strong>{manWon(row.maxCredit)}</strong>
      </div>
    </div>
  ))}
</div>

<!-- 계산기 CTA ① -->
<div class="yets-cta-box">
  <span>내 연봉 기준 연금저축·IRP 절세 효과를 계산해보세요.</span>
  <a href="/tools/year-end-tax-refund-calculator/">환급액 계산기 →</a>
</div>

<!-- 연금저축·IRP 제휴 배너 -->
<div class="yets-affiliate-banner">
  <div class="yets-banner-text">연금저축 납입 한도를 아직 못 채우셨나요? 12월 31일까지 납입해야 공제됩니다.</div>
  <a href="{제휴링크}" class="yets-banner-btn" rel="noopener sponsored">연금저축 가입하기 →</a>
</div>
```

### 섹션 ⑪ 연봉 구간별 환급 시뮬레이션

```html
<!-- 가로 막대 차트 -->
<canvas id="yetsSimulationChart" class="yets-bar-chart-wrap"></canvas>

<!-- 케이스 카드 4개 -->
<div class="yets-simulation-grid">
  {SIMULATION_CASES.map(c => (
    <div class="yets-simulation-card">
      <div class="yets-sim-label">{c.label}</div>
      <div class="yets-sim-desc">{c.desc}</div>
      <div class="yets-sim-refund">예상 환급 약 {manWon(c.refund)}</div>
      <div class="yets-sim-note">(추정)</div>
    </div>
  ))}
</div>

<!-- 계산기 CTA ③ -->
<div class="yets-cta-box">
  <span>내 조건으로 직접 계산해보세요.</span>
  <a href="/tools/year-end-tax-refund-calculator/">환급액 계산기 →</a>
</div>
```

### 섹션 ⑫ 절세 실수 TOP10 체크리스트

```html
<div class="yets-checklist">
  {MISTAKE_LIST.map(item => (
    <div class="yets-checklist-item">
      <div class="yets-checklist-rank">#{item.rank}</div>
      <div class="yets-checklist-body">
        <strong>{item.title}</strong>
        <p>{item.desc}</p>
      </div>
    </div>
  ))}
</div>

<!-- 세무사 제휴 배너 -->
<div class="yets-affiliate-banner">
  <div class="yets-banner-text">복잡한 공제 항목 때문에 세무사 도움이 필요하신가요?</div>
  <a href="{제휴링크}" class="yets-banner-btn" rel="noopener sponsored">세무사 무료 상담 →</a>
</div>
```

---

## 9. 차트 설계

### 섹션 ② — 소득공제 vs 세액공제 그룹 막대 차트

```js
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['3천만', '5천만', '7천만', '1억', '1.5억'],
    datasets: [
      {
        label: '소득공제 100만 원 절세액',
        data: [154000, 246000, 359000, 359000, 390000],
        backgroundColor: '#93C5BE',
      },
      {
        label: '세액공제 100만 원 절세액',
        data: [1000000, 1000000, 1000000, 1000000, 1000000],
        backgroundColor: '#0F6E56',
      },
    ],
  },
  options: {
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { ticks: { callback: v => (v / 10000) + '만' } }
    },
  },
});
```

### 섹션 ⑪ — 연봉 구간별 환급 시뮬레이션 가로 막대 차트

```js
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: SIMULATION_CASES.map(c => c.desc),
    datasets: [{
      label: '예상 환급액 (추정)',
      data: SIMULATION_CASES.map(c => c.refund),
      backgroundColor: ['#4DC4A0', '#1D9E75', '#0F6E56', '#0a5a46'],
      borderRadius: 4,
    }],
  },
  options: {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { callback: v => Math.round(v / 10000) + '만' } },
      y: { grid: { display: false } },
    },
  },
});
```

---

## 10. 스타일 설계

```scss
.yets-page {

  // 연말정산 흐름도
  .yets-flow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 20px;
    background: #f8faf9;
    border-radius: 12px;
    margin-top: 16px;

    .yets-flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
      min-width: 72px;

      strong { font-size: 0.84rem; font-weight: 700; color: #111827; }
      small  { font-size: 0.72rem; color: #6b7280; }

      &--result {
        strong { color: #0f6e56; }
        background: #e1f5ee;
        border-radius: 8px;
        padding: 8px 10px;
      }
    }

    .yets-flow-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0f6e56;
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
    }

    .yets-flow-arrow {
      color: #9ca3af;
      font-size: 1.2rem;
    }

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      .yets-flow-arrow { transform: rotate(90deg); }
    }
  }

  // 소득공제 vs 세액공제 비교표
  .yets-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

  .yets-impact-table {
    width: 100%;
    min-width: 540px;
    border-collapse: collapse;
    font-size: 0.86rem;

    th, td {
      padding: 10px 14px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
    }
    th:first-child, td:first-child { text-align: left; }
    th { background: #f8fcfa; font-weight: 700; }

    td.yets-credit { color: #0f6e56; font-weight: 700; }
    td.yets-deduct-low  { color: #9ca3af; }
    td.yets-deduct-mid  { color: #374151; }
    td.yets-deduct-high { color: #b45309; font-weight: 600; }
  }

  .yets-insight-box {
    background: #e1f5ee;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.88rem;
    color: #0a5a46;
    margin-top: 12px;
    font-weight: 600;
  }

  // 연금저축·IRP 카드
  .yets-pension-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  }

  .yets-pension-card {
    border: 1px solid #dce6e2;
    border-radius: 12px;
    padding: 18px;
    background: #fff;

    .yets-pension-label { font-size: 0.82rem; color: #6b7280; margin-bottom: 6px; }
    .yets-pension-rate  { font-size: 2rem; font-weight: 800; color: #0f6e56; margin-bottom: 6px; }
    .yets-pension-max   { font-size: 0.86rem; color: #374151; strong { color: #0f6e56; } }
  }

  // 계산기 CTA 박스
  .yets-cta-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 16px 20px;
    margin: 20px 0;

    span { font-size: 0.9rem; font-weight: 600; color: #111827; }

    a {
      padding: 8px 18px;
      background: #0f6e56;
      color: #fff;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }

  // 제휴 배너
  .yets-affiliate-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 16px;

    .yets-banner-text { font-size: 0.88rem; color: #1e3a5f; font-weight: 600; }
    .yets-banner-btn {
      padding: 7px 16px;
      background: #1a56db;
      color: #fff;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }

  // 신용카드 최적 비율 표
  .yets-card-strategy {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    margin-top: 16px;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }

    .yets-card-box {
      border-radius: 12px;
      padding: 16px;

      &--credit {
        background: #fff8f0;
        border: 1px solid #fed7aa;
        .yets-card-rate { color: #c2410c; }
      }
      &--debit {
        background: #f0fdf4;
        border: 1px solid #86efac;
        .yets-card-rate { color: #0f6e56; }
      }

      .yets-card-type { font-size: 0.8rem; color: #6b7280; margin-bottom: 4px; }
      .yets-card-rate { font-size: 1.8rem; font-weight: 800; margin-bottom: 6px; }
      .yets-card-desc { font-size: 0.82rem; color: #374151; }
    }
  }

  // 시뮬레이션 케이스 카드
  .yets-simulation-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1000px) { grid-template-columns: repeat(4, 1fr); }
  }

  .yets-simulation-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;

    .yets-sim-label { font-size: 0.76rem; font-weight: 700; color: #0f6e56; text-transform: uppercase; margin-bottom: 6px; }
    .yets-sim-desc  { font-size: 0.82rem; color: #374151; margin-bottom: 12px; line-height: 1.5; }
    .yets-sim-refund { font-size: 1.2rem; font-weight: 800; color: #0f6e56; }
    .yets-sim-note   { font-size: 0.72rem; color: #9ca3af; margin-top: 2px; }
  }

  // 절세 실수 체크리스트
  .yets-checklist {
    display: grid;
    gap: 1px;
    background: #e8ede9;
    border: 1px solid #e8ede9;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 16px;
  }

  .yets-checklist-item {
    display: flex;
    gap: 16px;
    padding: 14px 16px;
    background: #fff;
    align-items: flex-start;

    .yets-checklist-rank {
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f3f4f6;
      color: #374151;
      font-size: 0.82rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .yets-checklist-body {
      flex: 1;
      strong { display: block; font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 3px; }
      p { font-size: 0.82rem; color: #6b7280; margin: 0; line-height: 1.5; }
    }

    &:nth-child(-n+3) .yets-checklist-rank {
      background: #fee2e2;
      color: #b91c1c;
    }
  }

  // 세법 개정 예고 박스
  .yets-amendment-box {
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 16px;
    font-size: 0.88rem;

    .yets-amendment-warning {
      font-size: 0.78rem;
      color: #92400e;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #fde68a;
    }
  }

  // 막대 차트 래퍼
  .yets-chart-wrap {
    position: relative;
    height: 280px;
    margin-top: 16px;
    @media (min-width: 760px) { height: 340px; }
  }

  .yets-bar-chart-wrap {
    position: relative;
    height: 240px;
    margin-top: 16px;
    @media (min-width: 760px) { height: 300px; }
  }

  // 관련 링크 그리드
  .yets-next-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
    @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  }

  .yets-next-link {
    display: block;
    padding: 14px 16px;
    border: 1px solid #e8ede9;
    border-radius: 10px;
    text-decoration: none;
    color: #111827;
    font-size: 0.88rem;
    font-weight: 600;
    transition: border-color 0.15s, background 0.15s;

    &:hover { border-color: #0f6e56; background: #f5fbf8; color: #0f6e56; }
  }
}
```

---

## 11. SEO 설계

```text
title: 2026 연말정산 절세 전략 완전 정복 — 공제 항목별 환급액 시뮬레이션·체크리스트
description: 신용카드·연금저축·의료비·월세 공제까지, 직장인이 연말정산에서 최대로 환급받는 절세 전략을 총정리합니다. 연봉 구간별 시뮬레이션과 절세 실수 TOP10 체크리스트 포함.
H1: 2026 연말정산 절세 전략 완전 정복
```

JSON-LD: `Article` + `FAQPage`

키워드: 연말정산 절세 방법 2026, 연말정산 환급 많이 받는 방법, 연금저축 IRP 연말정산, 신용카드 체크카드 연말정산, 맞벌이 부부 연말정산

---

## 12. SeoContent 초안

### introTitle
`2026 연말정산 절세 전략 완전 정복 — 공제 항목 하나가 수십만 원을 바꿉니다`

### intro (5문단)

1. 연말정산은 1년간 원천징수로 납부한 세금과 실제 내야 할 세금(결정세액)의 차액을 정산하는 절차입니다. 결정세액을 낮추면 환급액이 늘어납니다. 가장 직접적인 방법은 세액공제 항목을 한도까지 채우는 것입니다. 연금저축+IRP 900만 원을 납입하면 연봉 5,500만 원 이하 기준 최대 약 148만 원을 환급받을 수 있습니다.

2. 소득공제와 세액공제는 절세 방식이 다릅니다. 소득공제는 과세표준을 낮춰 고소득자일수록 절세 효과가 크고, 세액공제는 산출세액에서 직접 차감해 소득 구간과 무관하게 동일한 금액을 돌려받습니다. 신용카드·현금영수증은 소득공제, 연금저축·의료비·월세는 세액공제 항목입니다.

3. 신용카드 공제는 총급여의 25%를 초과한 사용분부터 적용됩니다. 최적 전략은 총급여 25%까지는 혜택이 많은 신용카드로 쓰고, 초과분은 공제율이 두 배 높은(30%) 체크카드나 현금영수증으로 결제하는 것입니다. 연간 지출 패턴을 미리 파악하면 이 전략이 더 효과적입니다.

4. 부양가족 공제는 가장 쉽게 놓치는 항목 중 하나입니다. 따로 사는 부모님도 실질적으로 부양한다면 공제 대상이 될 수 있고, 배우자의 부모(장인·장모)도 요건 충족 시 등록 가능합니다. 반대로 소득이 100만 원을 초과한 부양가족을 잘못 등록하면 가산세가 발생합니다.

5. 이 리포트의 계산 예시는 2026년 소득세법 기준 참고용 추정값입니다. 실제 공제 조건과 한도는 개인 상황에 따라 다를 수 있으므로 국세청 홈택스 연말정산 간소화 서비스에서 최종 확인하세요. 과거 연도에 누락된 공제는 경정청구(5년 이내)로 소급 신청할 수 있습니다.

### FAQ (8개)

```ts
export const YETS_FAQ: YetsFaq[] = [
  {
    question: "연말정산 환급과 추납은 어떻게 결정되나요?",
    answer: "1년간 원천징수로 납부한 세금(기납부세액)이 실제 결정세액보다 많으면 환급, 적으면 추납입니다. 공제 항목을 많이 챙길수록 결정세액이 낮아져 환급액이 늘어납니다. 환급액 = 기납부세액 - 결정세액입니다.",
  },
  {
    question: "소득공제와 세액공제 중 어느 쪽이 더 유리한가요?",
    answer: "세액공제는 소득 구간과 무관하게 동일한 금액을 돌려받습니다. 소득공제는 고소득자일수록 절세 효과가 커집니다. 연봉 5천만 원 기준으로 소득공제 100만 원의 절세 효과는 약 24.6만 원인 반면, 세액공제 100만 원은 그대로 100만 원을 절세합니다. 세액공제 항목을 우선 채우는 것이 유리합니다.",
  },
  {
    question: "연금저축과 IRP, 어느 쪽을 먼저 납입해야 하나요?",
    answer: "연금저축을 600만 원 먼저 채운 뒤 IRP로 나머지 300만 원을 채워 합산 900만 원 한도를 활용하는 것이 일반적으로 유리합니다. 연금저축은 중도 해지 시 페널티가 상대적으로 낮고 운용 상품이 다양합니다. 두 계좌 합산 한도는 900만 원입니다.",
  },
  {
    question: "신용카드와 체크카드 중 어느 걸 더 써야 공제를 많이 받나요?",
    answer: "총급여의 25%까지는 어떤 결제 수단을 써도 공제 대상이 아닙니다. 25% 초과분부터 공제가 시작되며, 이 초과분 중 신용카드는 15%, 체크카드·현금영수증은 30%를 공제받습니다. 총급여 25%까지는 포인트·혜택이 많은 신용카드로, 초과분은 체크카드나 현금영수증으로 결제하는 것이 유리합니다.",
  },
  {
    question: "맞벌이 부부는 공제를 어떻게 나눠야 하나요?",
    answer: "자녀 교육비·의료비는 실제 지출한 사람이 공제받아야 합니다. 부양가족(자녀 등)은 소득이 높은 쪽(한계세율이 높은 쪽)에 몰아주면 소득공제 절세 효과가 더 큽니다. 단, 동일 부양가족을 두 명이 중복 신청하면 가산세가 발생하므로 반드시 한 명만 신청해야 합니다.",
  },
  {
    question: "월세 세액공제를 받으려면 어떻게 해야 하나요?",
    answer: "총급여 7,000만 원 이하, 무주택 세대주(또는 세대원), 임차 주택이 85㎡ 이하인 경우 공제 가능합니다. 임대차계약서와 계좌이체 증빙(월세 납입 내역)을 연말정산 시 제출해야 합니다. 간소화 서비스에 자동 반영되지 않으므로 직접 서류를 챙겨야 합니다.",
  },
  {
    question: "과거 연도에 놓친 공제도 돌려받을 수 있나요?",
    answer: "경정청구를 통해 5년 이내 신고 오류·누락 공제를 소급 신청할 수 있습니다. 홈택스에서 경정청구 메뉴로 직접 신청하거나 세무사를 통해 대행할 수 있습니다. 5년이 지나면 시효가 만료되므로 서두르는 것이 좋습니다.",
  },
  {
    question: "중소기업 취업자 소득세 감면은 어떻게 받나요?",
    answer: "중소기업에 취업한 청년(만 34세 이하)은 취업일부터 5년간 소득세의 90%(한도 200만 원)를 감면받을 수 있습니다. 회사 인사팀에 '중소기업 취업자 소득세 감면신청서'를 제출해야 합니다. 이직 시 감면 기간이 리셋되지 않으며 누적 5년까지 적용됩니다.",
  },
];
```

---

## 13. 관련 링크

- `/tools/year-end-tax-refund-calculator/` — 연말정산 환급액 계산기
- `/tools/irp-pension-calculator/` — IRP·연금저축 세액공제 계산기
- `/tools/salary/` — 연봉 실수령 계산기
- `/reports/retirement-pension-dc-db-irp-2026/` — 퇴직연금 DC·DB·IRP 비교
- `/tools/overtime-pay-calculator/` — 야근수당 계산기

---

## 14. 등록 작업

```ts
// src/data/reports.ts
{
  slug: '2026-year-end-tax-saving-guide',
  title: '2026 연말정산 절세 전략 완전 정복',
  description: '공제 항목별 절세 전략, 연봉 구간별 환급 시뮬레이션, 절세 실수 TOP10 체크리스트를 총정리합니다.',
  order: 46,
  badges: ['연말정산', '절세', '세금', '2026'],
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/2026-year-end-tax-saving-guide/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.9</priority>
</url>
```

---

## 15. QA 체크리스트

- [ ] 연말정산 흐름도 모바일 세로 방향 정상 표시
- [ ] 소득공제 vs 세액공제 그룹 막대 차트 렌더링 정상
- [ ] 연봉 구간별 환급 시뮬레이션 가로 막대 차트 렌더링 정상
- [ ] 계산기 CTA 3곳 링크 정상 동작
- [ ] 연금저축·IRP 제휴 배너 + 세무사 제휴 배너 `rel="noopener sponsored"` 포함
- [ ] 절세 실수 TOP3 레드 배경 강조 정상
- [ ] 세법 개정 예고 박스 "예고안, 확정 전 확인 필요" 면책 문구 표시
- [ ] InfoNotice "참고용 추정값" 면책 문구 노출
- [ ] FAQ 8개 `<details>` 정상
- [ ] 모바일 360px — 표 가로 스크롤, 카드 1열 정상
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
