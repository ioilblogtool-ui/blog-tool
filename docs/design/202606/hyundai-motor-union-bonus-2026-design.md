# 현대차 노조 성과급 30% 요구 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/hyundai-motor-union-bonus-2026`
- **유형**: 리포트 페이지 (`/reports/` 계열), 계산형 인터랙션 포함
- **레이아웃**: `BaseLayout` 직접 사용 (계산기 쉘 아님, `corporate-bonus-ranking-top10-2026` 패턴 참고)
- **prefix**: `hmu-` (Hyundai Motor Union)
- **연관 기획 문서**: [`union-performance-bonus-comparison-2026-plan.md`](../../plan/202606/union-performance-bonus-comparison-2026-plan.md)

## 2. 목적 및 핵심 컨셉

- 현대차 노조의 "순이익 30% 성과급" 요구를 **숫자로 직접 만져보게** 만드는 리포트
- 핵심 차별점: 같은 요구안인데 언론마다 1인당 환산액이 다르게 보도됨(6,000만원 vs 4,000만원) → 그 차이가 "어떤 기준을 쓰느냐"에서 온다는 것을 사용자가 슬라이더/토글로 직접 확인
- 뉴스 요약이 아니라 "기준을 바꾸면 결과가 어떻게 달라지는지"를 보여주는 비교계산소식 콘텐츠

## 3. 데이터 신뢰성 원칙 (REPORT_CONTENT_GUIDE 팩트/해석/추정 구분)

| 구분 | 항목 |
|---|---|
| Fact | 기본급 14만9,600원 인상 요구, 상여금 750%→800% 요구, 완전 월급제 요구, 조합원 39,668명, 쟁의행위 찬성률 86.65%(투표율 94.15%) — 모두 출처 명시 |
| Fact (변동 가능) | 순이익 기준 연도·금액(10조3,648억 vs 13조원 — 보도마다 기준 시점 다름, 둘 다 출처와 함께 표기) |
| Estimate | 1인당 환산액 — "순이익 × 30% ÷ 직원 수"의 단순 산술이며 실제 배분 방식과 무관. 전 구간 `추정` 배지 필수 |
| Interpretation | "기준에 따라 1인당 4천만~6천만원까지 차이난다"는 해석은 본문에서 명확히 분리해 설명 |

> 게시 전 재확인 필요: 협상 진행 중 사안이라 실제 합의 시 수치가 바뀔 수 있음 — 본문에 "최종 합의 전 요구안 기준" 명시, 합의 후 업데이트 예정 문구 포함.

## 4. 데이터 파일 구조

### `src/data/hyundaiMotorUnionBonus2026.ts`

```ts
export interface ProfitBasis {
  id: string;
  label: string;              // "2025년 순이익 10조3,648억 기준"
  netProfit: number;          // 원 단위
  sourceName: string;
  sourceUrl: string;
}

export const PROFIT_BASES: ProfitBasis[] = [
  {
    id: "profit-10_3648",
    label: "2025년 순이익 10조 3,648억원 기준",
    netProfit: 10_364_800_000_000,
    sourceName: "한국금융신문",
    sourceUrl: "https://www.fntimes.com/html/view.php?ud=202605170046102444dd55077bc2_18",
  },
  {
    id: "profit-13_0",
    label: "2025년 순이익 13조원 기준",
    netProfit: 13_000_000_000_000,
    sourceName: "보도 종합",
    sourceUrl: "https://www.reportera.co.kr/car/hyundai-motor-wage-negotiation-2026-bonus-ai-employment/comment-page-1/",
  },
];

export interface EmployeeBasis {
  id: string;
  label: string;              // "정규직 조합원 3만9,668명 기준"
  employeeCount: number;
  note: string;
}

export const EMPLOYEE_BASES: EmployeeBasis[] = [
  { id: "union-39668", label: "정규직 조합원 3만 9,668명 기준", employeeCount: 39_668, note: "쟁의행위 찬반투표 대상 조합원 수" },
  { id: "estimate-51500", label: "보도 환산 기준(약 5만 1,500명)", employeeCount: 51_500, note: "1인당 6,000만원 보도 역산 추정치" },
  { id: "estimate-75000", label: "협력업체 포함 추정(약 7만 5,000명)", employeeCount: 75_000, note: "1인당 4,000만원 보도 역산 추정치, 협력업체 동일적용 요구 반영 시" },
];

export const DEMAND_RATE = 0.30; // 순이익 30% 요구

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  { label: "기본급 인상", value: "월 14만 9,600원 (호봉승급분 제외)", sourceName: "서울신문", sourceUrl: "https://www.seoul.co.kr/news/society/2026/05/06/20260506500120" },
  { label: "성과급", value: "전년도 순이익의 30% (정규직+협력업체 동일 적용)", sourceName: "미주중앙일보", sourceUrl: "https://www.koreadaily.com/article/20260624020122139" },
  { label: "상여금", value: "750% → 800% 인상", sourceName: "뉴데일리", sourceUrl: "https://biz.newdaily.co.kr/site/data/html/2026/04/20/2026042000109.html" },
  { label: "고용 형태", value: "완전 월급제 시행 요구", sourceName: "보도 종합", sourceUrl: "" },
  { label: "정년", value: "국민연금 수급 시기 연동, 최장 65세 연장", sourceName: "보도 종합", sourceUrl: "" },
  { label: "쟁의행위 투표", value: "조합원 39,668명 중 찬성률 86.65% (투표율 94.15%)", sourceName: "파이낸셜뉴스", sourceUrl: "https://www.fnnews.com/news/202606241731301676" },
];

export interface FaqItem { question: string; answer: string; }
export const HMU_FAQ: FaqItem[] = [
  // 최소 6개 — 6번 섹션 초안 참고
];

export const HMU_META = {
  slug: "hyundai-motor-union-bonus-2026",
  title: "현대차 성과급 30% 요구, 1인당 얼마? — 2026 노조 요구안 계산",
  description: "현대차 노조의 순이익 30% 성과급 요구를 1인당으로 환산해보는 시뮬레이션. 기준에 따라 4천만~6천만원까지 차이나는 이유 확인.",
};
```

## 5. 화면 구성 (페이지 IA)

```
[CalculatorHero]
  eyebrow: "2026 임단협 이슈"
  title: "현대차 성과급 30% 요구, 1인당 얼마?"
  description: "순이익 기준과 직원 수 기준을 바꿔보면서 1인당 환산액이 어떻게 달라지는지 직접 확인해보세요."
  badges: ["요구안 기준", "추정 시뮬레이션", "2026"]

[InfoNotice — warning]
  "이 페이지는 노조 요구안(확정 아님)을 기준으로 한 단순 산술 시뮬레이션입니다.
   실제 합의 시 금액과 배분 방식은 달라질 수 있습니다."

[노조 요구안 핵심 요약 — Fact 카드 그리드]
  UNION_DEMAND_FACTS 6개를 카드로, 각 카드에 출처 링크(있는 경우) 표시

[인터랙티브 계산 섹션] ★ 핵심
  - 순이익 기준 select (PROFIT_BASES 2개)
  - 직원 수 기준 select (EMPLOYEE_BASES 3개)
  - 실시간 결과 카드 3개:
    - 총 성과급 재원 (순이익 × 30%)
    - 1인당 환산액 (재원 ÷ 직원 수)
    - 기존 상여금(750%) 대비 증가분 비교 텍스트
  - 결과 카드 하단에 "이 조합은 추정입니다" 배지

[기준별 비교 표]
  | 순이익 기준 | 직원 수 기준 | 총 재원 | 1인당 환산액 |
  6개 조합(2×3) 전체를 표로 미리 보여줘서 select 없이도 한눈에 비교 가능

[해석 카드 — 왜 보도마다 다른가]
  - "분모(직원 수)에 협력업체 포함 여부가 갈린다"
  - "순이익 기준 연도/금액이 보도마다 다르다"
  - 짧은 카드 2~3개로 분리 (REPORT_CONTENT_GUIDE 패턴 분석 섹션 원칙)

[기존 지급 구조와 비교]
  - 상여금 750% → 800% 요구가 의미하는 것
  - 작년 실제 지급률과 비교 (있다면)

[관련 링크]
  - tools/bonus-after-tax-calculator (세후 실수령액 계산 CTA)
  - reports/union-bonus-comparison-2026 (3사 비교 허브, 추후 생성)
  - reports/samsung-biologics-union-bonus-2026 (추후 생성)

[SeoContent]
  - intro 5문단 이상 / 800자 이상
  - FAQ 6개 이상
```

## 6. 컴포넌트 구조

```
<BaseLayout>
  <SiteHeader />
  <main class="container page-shell report-page hmu-page">
    <CalculatorHero ... />
    <InfoNotice type="warning" ... />

    <section class="hmu-facts-section">
      <h2>노조 요구안 핵심 요약</h2>
      <div class="hmu-facts-grid">...</div>  <!-- UNION_DEMAND_FACTS 6개 -->
    </section>

    <section class="hmu-calc-section">
      <h2>기준을 바꿔서 1인당 환산액 확인하기</h2>
      <div class="hmu-calc-controls">
        <label>순이익 기준 <select id="hmuProfitBasis">...</select></label>
        <label>직원 수 기준 <select id="hmuEmployeeBasis">...</select></label>
      </div>
      <div class="hmu-result-grid">
        <div class="hmu-result-card" id="hmuTotalFund">...</div>
        <div class="hmu-result-card" id="hmuPerHead">...</div>
        <div class="hmu-result-card" id="hmuVsBonus">...</div>
      </div>
      <p class="hmu-estimate-badge">추정 시뮬레이션</p>
    </section>

    <section class="hmu-matrix-section">
      <h2>전체 기준 조합 비교</h2>
      <div class="hmu-table-wrap">
        <table class="hmu-table">...</table>  <!-- 6행 -->
      </div>
    </section>

    <section class="hmu-interpretation-section">
      <h2>왜 1인당 환산액이 보도마다 다를까</h2>
      <div class="hmu-interpretation-grid">...</div>  <!-- 2~3 카드 -->
    </section>

    <SeoContent introItems={...} faqItems={HMU_FAQ} />
    <CompareCta />
  </main>
  <SiteFooter />
</BaseLayout>
```

## 7. JS 로직 (`public/scripts/hyundai-motor-union-bonus-2026.js`)

### 상태

```js
const state = {
  profitBasisId: "profit-10_3648",
  employeeBasisId: "union-39668",
};
```

### Config 주입

```astro
<script id="hmuConfig" type="application/json" set:html={JSON.stringify({
  profitBases: PROFIT_BASES,
  employeeBases: EMPLOYEE_BASES,
  demandRate: DEMAND_RATE,
})}></script>
```

### 주요 함수

```
init()
  → loadConfig()
  → bindSelects()
  → render()  // 초기 기본값(profit-10_3648 / union-39668)으로 1회 렌더

render()
  → profitBasis = find(profitBases, state.profitBasisId)
  → employeeBasis = find(employeeBases, state.employeeBasisId)
  → totalFund = profitBasis.netProfit * demandRate
  → perHead = totalFund / employeeBasis.employeeCount
  → updateResultCards(totalFund, perHead)
  → highlightMatrixRow(state.profitBasisId, state.employeeBasisId)  // 비교표에서 현재 선택 조합 강조

formatKRW(value)
  → 억/만원 단위로 보기 쉽게 변환 (예: 3조 914억 → "3조 914억원")
```

- 비교표(`hmu-table`)는 6행을 빌드타임에 미리 렌더링(Astro에서 server-side로 PROFIT_BASES × EMPLOYEE_BASES 조합 계산) → JS는 강조(active row) 토글만 담당. 클라이언트 계산 의존도를 낮춰 SEO 크롤러도 전체 수치를 텍스트로 바로 읽을 수 있게 함.

## 8. SCSS (`src/styles/scss/pages/_hyundai-motor-union-bonus-2026.scss`)

prefix: `hmu-`

```scss
.hmu-page { }

// Fact 카드
.hmu-facts-section { margin: 2rem 0; }
.hmu-facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}
.hmu-fact-card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  .hmu-fact-label { font-size: 0.8125rem; color: var(--color-text-muted); }
  .hmu-fact-value { font-weight: 600; margin-top: 0.25rem; }
  .hmu-fact-source { font-size: 0.75rem; margin-top: 0.375rem; }
}

// 계산 섹션
.hmu-calc-section { margin: 2.5rem 0; }
.hmu-calc-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  @media (min-width: 640px) { flex-direction: row; gap: 1.5rem; }
  select { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid var(--color-border); }
}
.hmu-result-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
.hmu-result-card {
  background: var(--color-surface);
  border-radius: 0.5rem;
  padding: 1.25rem;
  text-align: center;
  .hmu-result-label { font-size: 0.8125rem; color: var(--color-text-muted); }
  .hmu-result-value { font-size: 1.5rem; font-weight: 700; margin-top: 0.375rem; color: var(--color-primary); }
}
.hmu-estimate-badge {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
}

// 비교 매트릭스
.hmu-matrix-section { margin: 2.5rem 0; overflow-x: auto; }
.hmu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: left; }
  th { background: var(--color-surface); font-weight: 600; }
  tr.is-active td { background: var(--color-surface); font-weight: 600; }
}

// 해석 카드
.hmu-interpretation-section { margin: 2.5rem 0; }
.hmu-interpretation-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
}
.hmu-interpretation-card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem 1.125rem;
  .hmu-interpretation-title { font-weight: 600; margin-bottom: 0.375rem; }
}
```

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | 리포트 항목 추가 (slug, title, description, category: "노동/임단협" 또는 기존 카테고리) |
| `src/styles/app.scss` | `@use 'scss/pages/hyundai-motor-union-bonus-2026';` 추가 |
| `public/sitemap.xml` | `/reports/hyundai-motor-union-bonus-2026/` URL 추가 |
| `src/pages/index.astro` | 필요 시 topicBySlug / 추천 리포트 영역에 추가 |
| `src/pages/reports/index.astro` | reports.ts 자동 반영이면 별도 작업 불필요 |

## 10. JSON-LD 구조

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "현대차 성과급 30% 요구, 1인당 얼마?",
      "description": "...",
      "dateModified": "2026-06-26"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* HMU_FAQ */]
    }
  ]
}
```

## 11. SEO 포인트

- `<title>`: `현대차 성과급 30% 요구 2026 | 1인당 환산액 바로 계산`
- `<description>`: 현대차 노조의 순이익 30% 성과급 요구안을 1인당으로 환산. 기준에 따라 4천만~6천만원까지 차이나는 이유와 직접 계산해보는 시뮬레이션 포함.
- 1차 키워드: `현대차 성과급`, `현대차 노조 성과급`
- 2차 키워드: `현대차 성과급 30%`, `현대차 임단협`, `현대차 파업`

## 12. FAQ 초안 (6개)

1. **현대차 노조가 요구하는 성과급은 확정된 금액인가요?** — 아닙니다. 2026년 4월 임시대의원대회에서 확정한 노조 요구안이며, 회사와의 협상을 통해 실제 지급액과 방식은 달라질 수 있습니다.
2. **순이익 30%면 정확히 얼마인가요?** — 기준 순이익에 따라 다릅니다. 2025년 순이익을 10조 3,648억원으로 볼 경우 약 3조 914억원, 13조원으로 볼 경우 약 3조 9,000억원입니다.
3. **1인당 환산액이 보도마다 6,000만원, 4,000만원으로 다른 이유는?** — 나누는 직원 수 기준이 다릅니다. 정규직 조합원만 기준으로 하면 1인당 금액이 커지고, 협력업체까지 포함하면 분모가 커져 1인당 금액이 작아집니다.
4. **협력업체 직원도 성과급을 받게 되나요?** — 노조는 협력업체 직원에게도 동일 적용을 요구하고 있으나, 이는 요구안 단계로 실제 적용 여부는 협상 결과에 따라 달라집니다.
5. **상여금 750%에서 800%로 오르면 실제로 얼마나 늘어나나요?** — 기본급 기준 50%p 추가 상여이며, 개인 기본급에 따라 금액이 달라집니다. 성과급(순이익 30%)과는 별도 항목입니다.
6. **이 계산기로 내 예상 성과급을 알 수 있나요?** — 이 페이지는 전체 재원을 단순 평균한 1인당 추정액을 보여주는 것으로, 실제 개인별 지급액은 호봉, 평가, 직군에 따라 다릅니다. 세후 실수령액은 [성과급 세금 계산기](/tools/bonus-after-tax-calculator/)에서 확인하세요.

## 13. 구현 순서

1. `src/data/hyundaiMotorUnionBonus2026.ts` — 위 스키마대로 작성
2. `src/pages/reports/hyundai-motor-union-bonus-2026.astro` — BaseLayout 사용, 비교 매트릭스는 서버사이드 렌더
3. `public/scripts/hyundai-motor-union-bonus-2026.js` — select 2개 + 결과 카드 + 매트릭스 강조
4. `src/styles/scss/pages/_hyundai-motor-union-bonus-2026.scss` — prefix `hmu-`
5. 등록 4곳: `reports.ts`, `app.scss`, `sitemap.xml`, `index.astro`(필요 시)
6. `npm run build` 검증

## 14. QA 포인트

- [ ] select 변경 시 결과 카드 3개가 즉시 갱신되는지
- [ ] 비교 매트릭스 6행이 빌드타임에 정적으로 렌더되어 JS 없이도 텍스트로 노출되는지 (SEO 크롤러 대비)
- [ ] 모든 추정 수치에 "추정" 배지/문구가 붙어있는지
- [ ] 출처 링크가 모두 유효한 URL인지 (서비스 게시 전 재확인)
- [ ] "최종 합의 전" 안내 문구가 InfoNotice에 명확히 들어있는지
- [ ] 모바일(375px)에서 select 2개가 세로 스택, 결과 카드가 가독성 있게 배치되는지
- [ ] `npm run build` 빌드 에러 없음
