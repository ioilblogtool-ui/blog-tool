# 2026 직장인 대출 완전 비교 — 설계 문서

> 작성일: 2026-05-19
> 콘텐츠 유형: `/reports/` 심층 리포트
> 구현 기준: 직장인 주요 대출 6종을 금리·한도·조건·DSR·총비용 기준으로 비교 + 대환/갈아타기 CTA

---

## 1. 문서 개요

- 구현 대상: `2026 직장인 대출 완전 비교`
- slug: `2026-salaried-loan-comparison`
- URL: `/reports/2026-salaried-loan-comparison/`
- 카테고리: 금융/대출
- 핵심 검색 의도: "직장인 대출 종류 비교", "직장인 신용대출 한도", "마이너스통장 신용대출 차이", "햇살론 직장인 자격", "DSR 대출 한도 2026"
- 핵심 CTA: 대출 갈아타기 계산기, 중도상환수수료 계산기, 서민금융진흥원 공식 링크
- 핵심 출력: 대출 6종 비교표, 연봉별 한도 시뮬레이션, 신용점수별 추천, 직장 유형별 추천, 카드론·리볼빙 총비용 비교

금융 콘텐츠 원칙:
- 대출 가입을 부추기지 않고 `총비용 비교`, `상환 가능성`, `공식 기준 확인`을 먼저 안내한다.
- 금리·한도는 반드시 기준일과 `확인 필요` 또는 `추정` 배지를 붙인다.
- 특정 금융회사나 플랫폼을 "가장 좋다"고 단정하지 않는다.
- 제휴 링크는 공식 링크와 시각적으로 분리하고 광고/제휴 고지를 명확히 표시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    salariedLoanComparison2026.ts   ← 대출 유형, 금리 범위, 한도 시뮬레이션, FAQ, 관련 링크
  pages/
    reports/
      2026-salaried-loan-comparison.astro

public/
  scripts/
    2026-salaried-loan-comparison.js ← Chart.js 3개 + 대출 유형 필터

src/styles/scss/pages/
  _2026-salaried-loan-comparison.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/2026-salaried-loan-comparison';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지.
- 클래스: `report-page slc-page`
- SCSS prefix: `slc-`
- Chart.js 사용:
  - 대출 유형별 금리 범위 차트
  - 연봉별 한도 시뮬레이션 차트
  - 카드론 vs 신용대출 총비용 차트
- Vanilla JS 사용:
  - 대출 유형 필터
  - 직장 유형별 추천 카드 필터
- 콘텐츠 구조는 `문제 인식 → 비교표 → 내 조건별 추천 → 비용/규제 확인 → CTA` 순서.

---

## 4. 데이터 모델

```ts
// src/data/salariedLoanComparison2026.ts

export type SourceLabel = '공식' | '확인 필요' | '추정' | '참고';
export type LoanCategory = 'credit' | 'minus' | 'mortgage' | 'jeonse' | 'saitdol' | 'sunshine';
export type JobType = 'large' | 'sme' | 'public' | 'freelance' | 'low-credit';
export type CreditTier = '900+' | '800' | '700' | '600';

export interface LoanTypeComparison {
  id: LoanCategory;
  name: string;
  purpose: string;
  rateRangeLabel: string;
  rateMin: number;
  rateMax: number;
  limitLabel: string;
  eligibility: string;
  repayment: string;
  dsrImpact: '큼' | '매우 큼' | '일부 예외' | '정책금융' | '확인 필요';
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  caution: string;
}

export interface SalaryLimitScenario {
  salary: number;
  salaryLabel: string;
  conservativeCreditLimit: number;
  aggressiveCreditLimit: number;
  mortgageLimitLabel: string;
  comment: string;
}

export interface CreditScoreRecommendation {
  tier: CreditTier;
  scoreLabel: string;
  firstChoice: string;
  secondChoice: string;
  caution: string;
}

export interface JobTypeRecommendation {
  id: JobType;
  label: string;
  firstCheck: string[];
  reason: string;
  caution: string;
}

export interface RefinanceScenario {
  rateGap: number;              // 0.003, 0.005, 0.01
  loanBalance: number;
  yearlySaving: number;
  estimatedCost: number;
  breakEvenMonths: number;
}

export interface HighCostDebtScenario {
  amount: number;
  cardLoanRate: number;
  revolvingRate: number;
  creditLoanRate: number;
  months: number;
}

export interface RejectionReason {
  rank: number;
  title: string;
  solution: string;
}

export interface PreferentialRateCondition {
  condition: string;
  desc: string;
  risk: string;
}

export interface SlcFaq {
  question: string;
  answer: string;
}

export interface SlcRelatedLink {
  href: string;
  label: string;
  desc?: string;
}

export interface ExternalSourceLink {
  source: string;
  title: string;
  href: string;
  desc: string;
}
```

---

## 5. 핵심 데이터 상수

### 5-1. 대출 6종 비교 데이터

```ts
export const SLC_LOAN_TYPES: LoanTypeComparison[] = [
  {
    id: 'credit',
    name: '신용대출',
    purpose: '생활비·대환·단기 자금',
    rateRangeLabel: '신용점수·은행별 차등',
    rateMin: 0.04,
    rateMax: 0.11,
    limitLabel: '연소득 기반',
    eligibility: '재직·소득·신용점수 심사',
    repayment: '만기일시 또는 원리금균등',
    dsrImpact: '큼',
    sourceLabel: '확인 필요',
    sourceUrl: 'https://portal.kfb.or.kr',
    updatedAt: '2026년 기준, 실시간 확인 필요',
    caution: '기존 대출과 카드론 사용 여부에 따라 한도가 크게 달라집니다.',
  },
  {
    id: 'minus',
    name: '마이너스통장',
    purpose: '비상자금·단기 유동성',
    rateRangeLabel: '신용대출보다 높을 수 있음',
    rateMin: 0.045,
    rateMax: 0.12,
    limitLabel: '약정 한도',
    eligibility: '재직·소득·신용점수 심사',
    repayment: '수시상환',
    dsrImpact: '큼',
    sourceLabel: '확인 필요',
    sourceUrl: 'https://portal.kfb.or.kr',
    updatedAt: '2026년 기준, 실시간 확인 필요',
    caution: '실제 사용액이 적어도 약정 한도 전체가 심사에 반영될 수 있습니다.',
  },
  {
    id: 'mortgage',
    name: '주택담보대출',
    purpose: '주택 구입·대환',
    rateRangeLabel: '담보·금리형태별 차등',
    rateMin: 0.035,
    rateMax: 0.07,
    limitLabel: 'LTV·DSR 기반',
    eligibility: '담보주택·소득·DSR·LTV 심사',
    repayment: '원리금균등·원금균등',
    dsrImpact: '매우 큼',
    sourceLabel: '확인 필요',
    sourceUrl: 'https://finlife.fss.or.kr',
    updatedAt: '2026년 기준, 실시간 확인 필요',
    caution: '스트레스 DSR 적용으로 체감 한도가 줄 수 있습니다.',
  },
  {
    id: 'jeonse',
    name: '전세자금대출',
    purpose: '전세보증금 마련',
    rateRangeLabel: '보증기관·은행별 차등',
    rateMin: 0.035,
    rateMax: 0.075,
    limitLabel: '보증금·보증기관 기준',
    eligibility: '임대차계약·보증심사·소득 심사',
    repayment: '만기일시 중심',
    dsrImpact: '일부 예외',
    sourceLabel: '확인 필요',
    sourceUrl: 'https://finlife.fss.or.kr',
    updatedAt: '2026년 기준, 실시간 확인 필요',
    caution: '보증 조건과 전세사기 리스크를 함께 확인해야 합니다.',
  },
  {
    id: 'saitdol',
    name: '사잇돌대출',
    purpose: '중신용자 중금리 대출',
    rateRangeLabel: '중금리',
    rateMin: 0.06,
    rateMax: 0.14,
    limitLabel: '보증한도 기반',
    eligibility: '중신용·소득·SGI서울보증 심사',
    repayment: '원리금균등',
    dsrImpact: '확인 필요',
    sourceLabel: '확인 필요',
    updatedAt: '2026년 취급기관 확인 필요',
    caution: '취급기관과 보증심사에 따라 승인 여부가 달라집니다.',
  },
  {
    id: 'sunshine',
    name: '근로자햇살론',
    purpose: '저소득·저신용 근로자 생활안정자금',
    rateRangeLabel: '상한금리 이내',
    rateMin: 0.08,
    rateMax: 0.115,
    limitLabel: '최대 2,000만 원, 2026년 적용 여부 확인',
    eligibility: '3개월 이상 재직, 저소득 또는 저신용 요건',
    repayment: '원금균등분할상환',
    dsrImpact: '정책금융',
    sourceLabel: '공식',
    sourceUrl: 'https://www.kinfa.or.kr/financialProduct/employeeHessalLoan.do',
    updatedAt: '서민금융진흥원 공고 확인 필요',
    caution: '2025년 말 한시 증액 종료 여부를 확인해야 합니다.',
  },
];
```

금리 범위는 차트 표현용 샘플값이다. 실제 구현 시 `확인 필요` 배지를 붙이고 기준일을 명시한다.

### 5-2. 연봉별 한도 시뮬레이션

```ts
export const SLC_SALARY_LIMIT_SCENARIOS: SalaryLimitScenario[] = [
  {
    salary: 30000000,
    salaryLabel: '연봉 3천만 원',
    conservativeCreditLimit: 15000000,
    aggressiveCreditLimit: 30000000,
    mortgageLimitLabel: 'DSR·기존 부채 확인 필요',
    comment: '기존 대출이 있으면 한도가 빠르게 줄어드는 구간입니다.',
  },
  {
    salary: 50000000,
    salaryLabel: '연봉 5천만 원',
    conservativeCreditLimit: 25000000,
    aggressiveCreditLimit: 75000000,
    mortgageLimitLabel: 'DSR 40% 기준 별도 계산 필요',
    comment: '신용점수와 직장 안정성에 따라 차이가 큽니다.',
  },
  {
    salary: 80000000,
    salaryLabel: '연봉 8천만 원',
    conservativeCreditLimit: 40000000,
    aggressiveCreditLimit: 120000000,
    mortgageLimitLabel: '담보·DSR·스트레스 DSR 영향 큼',
    comment: 'DSR 여유와 담보 가치가 실제 한도를 좌우합니다.',
  },
];
```

### 5-3. 신용점수 구간별 추천

```ts
export const SLC_CREDIT_RECOMMENDATIONS: CreditScoreRecommendation[] = [
  {
    tier: '900+',
    scoreLabel: '900점 이상',
    firstChoice: '1금융권 신용대출·마이너스통장',
    secondChoice: '주담대·전세대출 우대금리 비교',
    caution: '최저금리는 우대조건 충족 여부까지 확인해야 합니다.',
  },
  {
    tier: '800',
    scoreLabel: '800점대',
    firstChoice: '주거래은행 신용대출',
    secondChoice: '급여이체·카드실적 우대금리',
    caution: '단기간 다중 신청은 피하는 것이 좋습니다.',
  },
  {
    tier: '700',
    scoreLabel: '700점대',
    firstChoice: '사잇돌·새희망홀씨 후보',
    secondChoice: '대환대출 비교',
    caution: '카드론·리볼빙 보유 여부가 심사에 불리할 수 있습니다.',
  },
  {
    tier: '600',
    scoreLabel: '600점대 이하',
    firstChoice: '근로자햇살론·서민금융 맞춤대출',
    secondChoice: '신용부채관리 상담',
    caution: '고금리 추가 대출보다 채무조정·정책금융을 먼저 확인하세요.',
  },
];
```

### 5-4. 직장 유형별 추천

```ts
export const SLC_JOB_RECOMMENDATIONS: JobTypeRecommendation[] = [
  {
    id: 'large',
    label: '대기업·공기업',
    firstCheck: ['1금융권 신용대출', '마이너스통장', '주거래은행 우대금리'],
    reason: '재직 안정성과 소득 증빙이 유리하게 반영될 가능성이 큽니다.',
    caution: '마이너스통장은 한도 전체가 심사에 반영될 수 있습니다.',
  },
  {
    id: 'sme',
    label: '중소기업',
    firstCheck: ['급여이체 은행 신용대출', '사잇돌', '새희망홀씨'],
    reason: '은행별 심사 차이가 커서 2~3개 금융회사를 비교해야 합니다.',
    caution: '재직기간과 건강보험 납부 이력이 중요합니다.',
  },
  {
    id: 'public',
    label: '공무원·교직원',
    firstCheck: ['직군 전용 신용대출', '1금융권 마이너스통장'],
    reason: '안정 소득 직군으로 분류되어 우대상품이 있는 경우가 많습니다.',
    caution: '직군 전용 상품도 우대조건 충족 여부를 확인해야 합니다.',
  },
  {
    id: 'freelance',
    label: '프리랜서·계약직',
    firstCheck: ['소득증빙 가능 신용대출', '사잇돌', '전세대출 보증상품'],
    reason: '재직증명보다 소득 흐름과 신고소득 증빙이 중요합니다.',
    caution: '소득 신고가 낮으면 한도가 줄 수 있습니다.',
  },
  {
    id: 'low-credit',
    label: '저신용 근로자',
    firstCheck: ['근로자햇살론', '서민금융 맞춤대출', '신용부채관리 상담'],
    reason: '일반 신용대출보다 정책금융 접근성이 높을 수 있습니다.',
    caution: '고금리 카드론 추가 사용은 피하는 것이 좋습니다.',
  },
];
```

---

## 6. 페이지 IA

1. **Hero**
   - 제목: "2026 직장인 대출 완전 비교"
   - 설명: "신용대출·마이너스통장·주담대·전세대출·사잇돌·햇살론을 금리·한도·조건·총비용 기준으로 비교합니다."
   - 배지: `금융/대출`, `2026`, `금리 확인 필요`, `추정 포함`
2. **InfoNotice**
   - 금리·한도는 실시간 변동.
   - 실제 승인 여부는 금융회사 심사 기준.
   - 금융상품 가입 권유가 아닌 비교 정보.
3. **TrustPanel**
   - 공식: 금융위원회 DSR, 서민금융진흥원 햇살론.
   - 확인 필요: 은행별 금리, 사잇돌 취급 조건.
   - 추정: 연봉별 한도, 총비용 시뮬레이션.
4. **핵심 요약 카드 4개**
5. **섹션 ① 2026 대출 시장 현황**
6. **섹션 ② 대출 6종 비교표 + 금리 범위 차트**
7. **섹션 ③ 연봉별 한도 시뮬레이션**
8. **섹션 ④ 신용점수 구간별 유불리**
9. **섹션 ⑤ 직장 유형별 추천**
10. **섹션 ⑥ 상환 방식·수수료 비교**
11. **섹션 ⑦ 금리 인하기 갈아타기 전략**
12. **섹션 ⑧ 정책금융 자격 체크리스트**
13. **섹션 ⑨ 대출 거절 TOP5**
14. **섹션 ⑩ 카드론·리볼빙 vs 신용대출 총비용**
15. **섹션 ⑪ 은행별 우대금리 조건**
16. **섹션 ⑫ 2026 DSR 기준**
17. **섹션 ⑬ 대출 계획 체크리스트**
18. **섹션 ⑭ 계산기 CTA + 공식/제휴 링크**
19. **SeoContent**

---

## 7. 핵심 요약 카드

| 카드 제목 | 내용 | 배지 |
|---|---|---|
| 비교 대상 | 신용대출·마통·주담대·전세·사잇돌·햇살론 6종 | 참고 |
| 한도 핵심 | 연봉보다 DSR·기존 부채가 더 크게 작용 | 공식/추정 |
| 대환 포인트 | 금리차보다 중도상환수수료 포함 총비용 확인 | 추정 |
| 정책금융 | 근로자햇살론은 공식 자격부터 확인 | 공식 |

---

## 8. 섹션별 마크업 설계

### 섹션 ② 대출 6종 비교

```astro
<section class="content-section slc-section" id="loan-types">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">대출 유형 비교</p>
    <h2>직장인이 가장 많이 보는 대출 6종</h2>
    <p>금리·한도·자격·상환방식·DSR 영향을 한 번에 비교합니다.</p>
  </div>

  <div class="slc-filter-row" role="tablist" aria-label="대출 유형">
    <button class="slc-filter-btn is-active" data-slc-filter="all">전체</button>
    <button class="slc-filter-btn" data-slc-filter="credit">신용대출</button>
    <button class="slc-filter-btn" data-slc-filter="mortgage">주거대출</button>
    <button class="slc-filter-btn" data-slc-filter="policy">정책금융</button>
  </div>

  <div class="slc-chart-wrap">
    <canvas id="slcRateRangeChart" data-chart={JSON.stringify(SLC_LOAN_TYPES)}></canvas>
  </div>

  <div class="slc-loan-grid">
    {SLC_LOAN_TYPES.map(item => (
      <article class="slc-loan-card" data-slc-group={loanGroup(item.id)}>
        <div class="slc-loan-card__top">
          <span class={`slc-source-badge slc-source-badge--${sourceClass(item.sourceLabel)}`}>{item.sourceLabel}</span>
          <span class="slc-dsr-badge">{item.dsrImpact}</span>
        </div>
        <h3>{item.name}</h3>
        <p>{item.purpose}</p>
        <dl>
          <div><dt>금리</dt><dd>{item.rateRangeLabel}</dd></div>
          <div><dt>한도</dt><dd>{item.limitLabel}</dd></div>
          <div><dt>자격</dt><dd>{item.eligibility}</dd></div>
          <div><dt>상환</dt><dd>{item.repayment}</dd></div>
        </dl>
        <p class="slc-card-caution">{item.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### 섹션 ③ 연봉별 한도 시뮬레이션

```astro
<section class="content-section slc-section" id="salary-limits">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">한도 시뮬레이션</p>
    <h2>연봉 3천·5천·8천만 원이면 어느 정도까지 볼 수 있나</h2>
  </div>

  <div class="slc-chart-wrap slc-chart-wrap--short">
    <canvas id="slcSalaryLimitChart" data-chart={JSON.stringify(SLC_SALARY_LIMIT_SCENARIOS)}></canvas>
  </div>

  <div class="slc-table-wrap">
    <table class="slc-wide-table">
      <thead>
        <tr>
          <th>연봉</th>
          <th>신용대출 보수적</th>
          <th>신용대출 공격적</th>
          <th>주담대 DSR 40%</th>
          <th>코멘트</th>
        </tr>
      </thead>
      <tbody><!-- SLC_SALARY_LIMIT_SCENARIOS 반복 --></tbody>
    </table>
  </div>
  <p class="slc-data-note">실제 승인 한도가 아니라 구조 이해를 위한 추정 시뮬레이션입니다.</p>
</section>
```

### 섹션 ④ 신용점수 구간별 추천

```astro
<div class="slc-credit-grid">
  {SLC_CREDIT_RECOMMENDATIONS.map(row => (
    <article class={`slc-credit-card slc-credit-card--${row.tier.replace('+', 'plus')}`}>
      <span>{row.scoreLabel}</span>
      <h3>{row.firstChoice}</h3>
      <p>{row.secondChoice}</p>
      <small>{row.caution}</small>
    </article>
  ))}
</div>
```

### 섹션 ⑦ 갈아타기 전략 CTA

```astro
<section class="slc-calculator-cta">
  <p class="slc-cta-eyebrow">갈아타기 판단</p>
  <h2>금리차만 보지 말고 비용 회수 기간을 계산하세요</h2>
  <p>중도상환수수료, 보증료, 인지세를 합산해 몇 개월 만에 이자 절감액으로 회수되는지 확인해야 합니다.</p>
  <div class="slc-cta-actions">
    <a href="/tools/mortgage-prepayment-penalty/" class="slc-cta-button">중도상환수수료 계산하기</a>
    <a href="https://finlife.fss.or.kr" class="slc-cta-button slc-cta-button--secondary" target="_blank" rel="noopener noreferrer">금융상품한눈에 확인</a>
  </div>
</section>
```

### 섹션 ⑩ 카드론·리볼빙 총비용

```astro
<section class="content-section slc-section" id="high-cost-debt">
  <div class="slc-warning-box">
    카드론·리볼빙은 월 납입액이 낮아 보일 수 있지만 총이자와 신용점수 부담이 커질 수 있습니다.
  </div>
  <div class="slc-chart-wrap slc-chart-wrap--short">
    <canvas id="slcDebtCostChart"></canvas>
  </div>
</section>
```

### 섹션 ⑭ 공식/제휴 링크

```astro
<div class="slc-link-split">
  <section class="slc-official-box">
    <h3>공식 정보 먼저 확인</h3>
    <a href="https://www.kinfa.or.kr/financialProduct/employeeHessalLoan.do" target="_blank" rel="noopener noreferrer">근로자햇살론 공식 안내</a>
    <a href="https://finlife.fss.or.kr" target="_blank" rel="noopener noreferrer">금융상품한눈에</a>
  </section>

  <section class="slc-affiliate-box">
    <h3>금리 비교 서비스</h3>
    <p>제휴 링크가 포함될 수 있습니다. 실제 조건은 금융회사 심사로 확정됩니다.</p>
    <a href="{제휴링크}" rel="noopener noreferrer nofollow sponsored">대출 비교 플랫폼에서 확인</a>
  </section>
</div>
```

---

## 9. 차트 및 JS 설계

### 9-1. 대출 유형별 금리 범위 차트

```js
new Chart(rateCtx, {
  type: 'bar',
  data: {
    labels: loans.map(item => item.name),
    datasets: [
      {
        label: '최저 금리',
        data: loans.map(item => item.rateMin * 100),
        backgroundColor: '#93C5BE',
        borderRadius: 4,
      },
      {
        label: '최고 금리',
        data: loans.map(item => item.rateMax * 100),
        backgroundColor: '#0F6E56',
        borderRadius: 4,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: 연 ${ctx.raw.toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: { ticks: { callback: v => `${v}%` } },
    },
  },
});
```

### 9-2. 연봉별 한도 시뮬레이션 차트

```js
new Chart(limitCtx, {
  type: 'bar',
  data: {
    labels: scenarios.map(row => row.salaryLabel),
    datasets: [
      {
        label: '보수적 신용대출',
        data: scenarios.map(row => row.conservativeCreditLimit),
        backgroundColor: '#C9D8D2',
        borderRadius: 4,
      },
      {
        label: '공격적 신용대출',
        data: scenarios.map(row => row.aggressiveCreditLimit),
        backgroundColor: '#0F6E56',
        borderRadius: 4,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.raw / 10000).toLocaleString('ko-KR')}만 원`,
        },
      },
    },
    scales: {
      y: { ticks: { callback: v => `${Math.round(v / 10000)}만` } },
    },
  },
});
```

### 9-3. 필터 JS

```js
(() => {
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function setFilter(group) {
    qa('[data-slc-filter]').forEach(btn => {
      const active = btn.dataset.slcFilter === group;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    qa('[data-slc-group]').forEach(card => {
      const visible = group === 'all' || card.dataset.slcGroup === group;
      card.hidden = !visible;
    });
  }

  qa('[data-slc-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.slcFilter));
  });

  if (window.Chart) {
    initRateRangeChart();
    initSalaryLimitChart();
    initDebtCostChart();
  }
})();
```

---

## 10. SCSS 설계

```scss
.slc-page {
  .slc-section {
    margin-top: 28px;
  }

  .slc-summary-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .slc-summary-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #f8faf9;

    span {
      display: inline-flex;
      margin-bottom: 8px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #0f6e56;
    }

    strong {
      display: block;
      font-size: 1.18rem;
      line-height: 1.28;
      color: #111827;
    }

    p {
      margin: 6px 0 0;
      font-size: 0.78rem;
      color: #6b7280;
    }

    &--primary {
      background: #e1f5ee;
      border-color: #0f6e56;
    }
  }

  .slc-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }

  .slc-filter-btn {
    border: 1px solid #dce6e2;
    border-radius: 999px;
    padding: 7px 13px;
    background: #fff;
    color: #374151;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;

    &.is-active {
      border-color: #0f6e56;
      background: #0f6e56;
      color: #fff;
    }
  }

  .slc-chart-wrap {
    position: relative;
    height: 340px;
    margin-top: 18px;

    canvas {
      width: 100%;
      height: 100%;
    }

    &--short {
      height: 300px;
    }

    @media (max-width: 640px) {
      height: 320px;
    }
  }

  .slc-loan-grid,
  .slc-credit-grid,
  .slc-job-grid,
  .slc-checklist-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;

    @media (min-width: 760px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1080px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .slc-loan-card,
  .slc-credit-card,
  .slc-job-card,
  .slc-checklist-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;

    &[hidden] {
      display: none;
    }

    h3 {
      margin: 10px 0 6px;
      color: #111827;
      font-size: 1rem;
    }

    p {
      margin: 0 0 12px;
      color: #4b5563;
      font-size: 0.86rem;
      line-height: 1.6;
    }
  }

  .slc-loan-card__top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }

  .slc-source-badge,
  .slc-dsr-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 3px 8px;
    font-size: 0.7rem;
    font-weight: 900;
    background: #f3f4f6;
    color: #4b5563;
  }

  .slc-source-badge--official {
    background: #dcfce7;
    color: #166534;
  }

  .slc-source-badge--check {
    background: #fef3c7;
    color: #92400e;
  }

  .slc-source-badge--estimate {
    background: #dbeafe;
    color: #1e40af;
  }

  .slc-loan-card dl {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  .slc-loan-card div {
    display: grid;
    gap: 2px;
  }

  .slc-loan-card dt {
    color: #6b7280;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .slc-loan-card dd {
    margin: 0;
    color: #111827;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .slc-card-caution {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #f3f4f6;
    color: #6b7280;
    font-size: 0.78rem;
  }

  .slc-table-wrap {
    overflow-x: auto;
    margin-top: 18px;
  }

  .slc-wide-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
    font-size: 0.86rem;

    th,
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    th {
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }

    td.is-highlight {
      color: #0f6e56;
      font-weight: 800;
    }
  }

  .slc-warning-box,
  .slc-data-note {
    margin-top: 14px;
    border-radius: 12px;
    padding: 14px 16px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
    font-size: 0.86rem;
    line-height: 1.65;
  }

  .slc-calculator-cta {
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 22px;
    margin: 28px 0;
    background: #f0fdf4;

    h2 {
      margin: 0 0 8px;
      color: #111827;
      font-size: 1.18rem;
    }

    p {
      margin: 0;
      color: #4b5563;
      font-size: 0.9rem;
      line-height: 1.65;
    }
  }

  .slc-cta-eyebrow {
    margin: 0 0 6px;
    color: #0f6e56;
    font-size: 0.76rem;
    font-weight: 900;
  }

  .slc-cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .slc-cta-button {
    display: inline-flex;
    align-items: center;
    padding: 9px 16px;
    border-radius: 8px;
    background: #0f6e56;
    color: #fff;
    font-size: 0.86rem;
    font-weight: 800;
    text-decoration: none;

    &--secondary {
      background: #fff;
      color: #0f6e56;
      border: 1px solid #0f6e56;
    }
  }

  .slc-link-split {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 760px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .slc-official-box,
  .slc-affiliate-box {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 18px;
    background: #fff;
  }

  .slc-affiliate-box {
    background: #f0f7ff;
    border-color: #bfdbfe;
  }
}
```

---

## 11. SEO 설계

```text
title: 직장인 대출 종류 비교 2026 - 신용대출·마이너스통장·주담대·햇살론 금리 한도 총정리
description: 2026년 직장인이 이용하는 신용대출, 마이너스통장, 주택담보대출, 전세자금대출, 사잇돌대출, 햇살론을 금리·한도·조건·DSR 기준으로 비교합니다. 연봉별 한도와 갈아타기 전략까지 확인하세요.
H1: 2026 직장인 대출 완전 비교
```

JSON-LD:
- `Article`
- `FAQPage`

키워드:
- 직장인 대출 종류 비교
- 직장인 신용대출 한도
- 마이너스통장 신용대출 차이
- 햇살론 직장인 자격
- 사잇돌대출 조건
- DSR 대출 한도 2026
- 카드론 신용대출 대환

---

## 12. SeoContent 초안

### introTitle

`2026 직장인 대출 완전 비교 — 금리보다 먼저 총비용과 DSR을 확인하세요`

### intro

1. 직장인 대출은 목적에 따라 먼저 비교해야 할 상품이 달라집니다. 생활비나 단기 자금은 신용대출과 마이너스통장을, 주거 목적은 주택담보대출과 전세자금대출을, 중·저신용자는 사잇돌대출과 근로자햇살론 같은 정책금융을 함께 확인해야 합니다.

2. 대출 한도는 단순히 연봉만으로 결정되지 않습니다. 신용점수, 재직기간, 직장 유형, 기존 대출, 카드론·리볼빙 사용 여부, DSR 규제가 함께 작용합니다. 특히 2026년에는 스트레스 DSR과 기존 부채가 체감 한도를 크게 줄일 수 있습니다.

3. 마이너스통장은 필요한 만큼만 쓰고 사용액에만 이자가 붙는 장점이 있지만, 약정 한도 전체가 심사에 반영될 수 있습니다. 비상자금 용도라면 유용하지만, 주담대나 전세대출을 앞두고 있다면 한도를 너무 크게 열어두는 것이 불리할 수 있습니다.

4. 카드론과 리볼빙은 편리하지만 총비용이 커질 수 있습니다. 월 납입액이 낮아 보여도 상환 기간이 길어지면 이자 부담이 빠르게 늘어납니다. 기존 고금리 채무가 있다면 신용대출, 정책금융, 대환대출 순서로 총비용을 비교하는 것이 좋습니다.

5. 이 리포트의 금리와 한도 예시는 이해를 돕기 위한 참고값입니다. 실제 금리와 승인 여부는 금융회사 심사, 기준일, 신용점수, 소득 증빙에 따라 달라질 수 있습니다. 신청 전에는 은행연합회 소비자포털, 금융감독원 금융상품한눈에, 서민금융진흥원 공식 안내를 반드시 확인하세요.

### inputPoints

- 신용대출·마이너스통장·주담대·전세대출·사잇돌·햇살론 차이를 비교할 수 있습니다.
- 연봉과 신용점수 구간별로 어떤 상품을 먼저 봐야 하는지 확인할 수 있습니다.
- 대환·갈아타기 전에 중도상환수수료와 총비용을 점검할 수 있습니다.

### criteria

- 금리와 한도는 기준일에 따라 달라지므로 실시간 확인이 필요합니다.
- DSR·정책금융 자격은 금융위원회·서민금융진흥원 공식 기준을 우선합니다.
- 연봉별 한도와 총비용 비교는 이해를 돕기 위한 추정 시뮬레이션입니다.
- 제휴 링크가 들어가더라도 실제 승인 여부는 금융회사 심사로 결정됩니다.

### FAQ

```ts
export const SLC_FAQ: SlcFaq[] = [
  {
    question: '신용대출과 마이너스통장은 무엇이 다른가요?',
    answer: '신용대출은 대출금을 한 번에 받아 정해진 방식으로 상환하는 상품이고, 마이너스통장은 약정 한도 안에서 필요한 만큼 꺼내 쓰는 한도대출입니다. 마이너스통장은 사용액에만 이자가 붙어 비상자금에 유리하지만, 금리가 더 높거나 한도 전체가 DSR·신용평가에 반영될 수 있습니다.',
  },
  {
    question: '연봉 5천만 원이면 신용대출 한도는 얼마인가요?',
    answer: '은행·신용점수·직장 유형·기존 대출에 따라 다르지만, 보수적으로는 연소득의 0.5배, 우량 조건에서는 1~1.5배 수준까지 검토될 수 있습니다. 다만 2026년에는 DSR과 기존 부채가 한도를 크게 좌우하므로 실제 한도는 금융회사 심사로 확인해야 합니다.',
  },
  {
    question: '햇살론은 직장인도 받을 수 있나요?',
    answer: '근로자햇살론은 3개월 이상 재직한 근로자를 대상으로 합니다. 연소득 3,500만 원 이하이거나, 개인신용평점 하위 20%에 해당하면서 연소득 4,500만 원 이하인 경우 신청 대상이 될 수 있습니다. 실제 승인 여부는 보증심사와 금융회사 심사를 거쳐 결정됩니다.',
  },
  {
    question: '카드론이나 리볼빙을 신용대출로 갈아타는 게 유리한가요?',
    answer: '금리 차이가 크고 중도상환수수료나 기타 비용이 낮다면 유리할 수 있습니다. 특히 리볼빙은 월 납입액이 작아 보여도 총이자가 커질 수 있으므로, 신용대출·정책금융·대환대출을 비교해 총비용을 줄일 수 있는지 확인하는 것이 좋습니다.',
  },
  {
    question: 'DSR이 높으면 대출이 왜 거절되나요?',
    answer: 'DSR은 연소득 대비 모든 대출의 연간 원리금 상환액 비율입니다. 은행권은 일반적으로 40% 규제비율을 기준으로 보기 때문에, 기존 대출 상환액이 많으면 새 대출 한도가 줄거나 거절될 수 있습니다.',
  },
  {
    question: '전세자금대출도 DSR에 들어가나요?',
    answer: '전세자금대출은 상품과 규제 기준에 따라 DSR 적용 예외 또는 별도 취급이 있을 수 있습니다. 전세보증금담보대출처럼 성격이 다른 상품은 다르게 볼 수 있으므로, 신청 전 금융회사와 보증기관 기준을 확인해야 합니다.',
  },
  {
    question: '금리 인하기에는 무조건 갈아타는 게 좋은가요?',
    answer: '아닙니다. 금리차가 있어도 중도상환수수료, 인지세, 보증료, 근저당 비용이 절감액보다 크면 손해일 수 있습니다. 금리차 × 대출잔액으로 연간 절감액을 계산하고, 비용 회수 기간이 남은 대출기간보다 짧은지 확인해야 합니다.',
  },
  {
    question: '대출 비교 플랫폼을 이용해도 신용점수가 떨어지나요?',
    answer: '단순 한도·금리 조회는 신용점수에 직접 불이익이 없도록 운영되는 경우가 많지만, 실제 대출 실행과 단기간 다중 신청은 신용평가에 영향을 줄 수 있습니다. 플랫폼별 안내와 금융회사 심사 기준을 확인하세요.',
  },
];
```

---

## 13. 관련 링크

```ts
export const SLC_RELATED_LINKS: SlcRelatedLink[] = [
  {
    href: '/tools/mortgage-prepayment-penalty/',
    label: '중도상환 수수료 계산기',
    desc: '갈아타기 전 수수료와 순절감액 확인',
  },
  {
    href: '/tools/newlywed-rent-vs-buy/',
    label: '신혼집 전세 vs 매매 계산기',
    desc: '주거 대출 부담과 전세·매매 선택 비교',
  },
  {
    href: '/reports/newlywed-cost-2026/',
    label: '2026 신혼부부 생활비 리포트',
    desc: '신혼집 자금·대출 맥락 연결',
  },
  {
    href: '/tools/year-end-tax-refund-calculator/',
    label: '연말정산 환급액 계산기',
    desc: '상환 여력과 연간 현금흐름 점검',
  },
  {
    href: '/reports/2026-government-welfare-benefits/',
    label: '2026 정부 복지지원금 완전 정복',
    desc: '정책금융·복지지원금 탐색 흐름 연결',
  },
];

export const SLC_SOURCE_LINKS: ExternalSourceLink[] = [
  {
    source: '금융위원회',
    title: 'DSR·가계대출 관리 정책자료',
    href: 'https://fsc.go.kr',
    desc: 'DSR 규제와 가계대출 관리방안 공식 자료',
  },
  {
    source: '은행연합회',
    title: '은행연합회 소비자포털',
    href: 'https://portal.kfb.or.kr',
    desc: '은행별 대출금리와 금융교육 자료',
  },
  {
    source: '금융감독원',
    title: '금융상품통합비교공시 금융상품한눈에',
    href: 'https://finlife.fss.or.kr',
    desc: '주택담보대출·전세대출·신용대출 금리 비교',
  },
  {
    source: '서민금융진흥원',
    title: '근로자햇살론 공식 안내',
    href: 'https://www.kinfa.or.kr/financialProduct/employeeHessalLoan.do',
    desc: '근로자햇살론 자격·한도·금리 공식 안내',
  },
  {
    source: '서민금융진흥원',
    title: '대출상품 한눈에',
    href: 'https://www.kinfa.or.kr/financialProduct/loanProductGlance.do',
    desc: '정책서민금융 상품 탐색',
  },
];
```

---

## 14. 등록 작업

```ts
// src/data/reports.ts
{
  slug: '2026-salaried-loan-comparison',
  title: '2026 직장인 대출 완전 비교',
  description: '직장인이 이용하는 신용대출, 마이너스통장, 주택담보대출, 전세자금대출, 사잇돌, 햇살론을 금리·한도·조건·DSR 기준으로 비교합니다.',
  category: '금융/대출',
  order: 51,
  badges: ['대출', '직장인', '금융', '2026'],
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/2026-salaried-loan-comparison/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

---

## 15. QA 체크리스트

- [ ] 금리 수치에 기준일과 `확인 필요` 배지 표시
- [ ] 모든 시뮬레이션에 `추정` 배지 표시
- [ ] 금융상품 가입 권유처럼 보이는 단정 문구 없음
- [ ] 대출 6종 카드가 필터로 정상 노출/숨김
- [ ] Chart.js 3개 차트가 모바일/데스크톱에서 정상 렌더링
- [ ] 차트 툴팁 금리 `%`, 금액 `만 원` 단위 표시
- [ ] 카드론·리볼빙 섹션에 총비용 리스크 경고 노출
- [ ] 정책금융 섹션에 서민금융진흥원 공식 링크 노출
- [ ] 제휴 CTA는 공식 링크와 분리, 광고/제휴 고지 포함
- [ ] 외부 링크 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] 제휴 링크 `nofollow sponsored` 적용
- [ ] FAQ 8개 이상 표시 및 FAQPage JSON-LD 포함
- [ ] 모바일 360px에서 카드·표·필터 버튼이 겹치지 않음
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
