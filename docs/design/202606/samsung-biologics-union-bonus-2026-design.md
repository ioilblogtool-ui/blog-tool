# 삼성바이오로직스 노조 성과급 20% 요구 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/samsung-biologics-union-bonus-2026`
- **유형**: 리포트 페이지 (`/reports/` 계열), 계산형 인터랙션 포함
- **레이아웃**: `BaseLayout` 직접 사용 (계산기 쉘 아님, `hyundai-motor-union-bonus-2026` 패턴 그대로 따름)
- **prefix**: `sbu-` (Samsung Biologics Union)
- **연관 문서**: [`union-performance-bonus-comparison-2026-plan.md`](../../plan/202606/union-performance-bonus-comparison-2026-plan.md), [`hyundai-motor-union-bonus-2026-design.md`](./hyundai-motor-union-bonus-2026-design.md) (자매 리포트, 동일 패턴)

## 2. 목적 및 핵심 컨셉

- 삼성바이오로직스 노조의 "영업이익 20% 성과급" 요구와 "1인당 3,000만원 격려금" 요구를 1인당 환산액으로 계산
- 핵심 차별점: 현대차 리포트가 "보도마다 다른 1인당 환산액"을 다뤘다면, 이 리포트는 **"노조 요구안 vs 회사 제시안의 격차"**가 핵심 — 노조는 14.3% 임금 인상 + 3,000만원 격려금 + 영업이익 20%를 요구했고, 회사는 6.2% 인상 + 600만원 일시금을 제시. 이 격차를 숫자로 보여주는 것이 콘텐츠의 중심
- 창사 15년 만의 첫 전면파업(2026.5.1~5)이라는 이슈성 + "6,400억원 손실 전망"이라는 숫자가 후킹 포인트

## 3. 데이터 신뢰성 원칙 (Fact / Estimate 구분)

| 구분 | 항목 | 출처 |
|---|---|---|
| Fact | 노조 요구: 기본급 14.3% 인상(또는 평균 14%), 1인당 3,000만원 격려금, 영업이익 20% 성과급 배분, 인사·채용·승진 운영 참여 요구 | 머니투데이, 뉴시스 |
| Fact | 회사 제시안: 임금 인상률 6.2%, 일시금 600만원 | 뉴시스, 파이낸셜뉴스 |
| Fact | 회사 측 주장: 노조안 적용 시 신입사원 기준 실질 인상률 21.3% | 뉴시스 |
| Fact | 창사 첫 전면파업 2026.5.1~5(5일간), 조합원 약 4,000명 중 2,500명 참여, 예상 손실 약 6,400억원 | 머니투데이, 아시아경제, 서울경제 |
| Fact | 2025년 영업이익 2조 692억원(전년 대비 +56.6%, 영업이익률 45.4%), 매출 4조 5,570억원 | 금융경제플러스 |
| Fact (참고) | 2025년 직원 평균 보수 1억 1,400만원 | 시사위크 |
| Fact | 전체 임직원 수 약 5,360~5,366명 (국민연금 가입자 기준 집계, 채용정보 사이트 복수 확인) | 사람인, 캐치 |
| Estimate | 1인당 환산액(영업이익 20% ÷ 직원 수) — 단순 산술, 실제 배분과 무관 | — |
| Interpretation | "노조 요구안과 회사 제시안 사이 격차가 왜 좁혀지지 않는지"는 해석 영역으로 분리 | — |

> **게시 전 필수 확인**: ① 기본급 인상률이 14%인지 14.3%인지 보도 간 통일, ② 협상 진행 상황(초기업노조 탈퇴 투표 6/24~28 결과, 이후 협상 재개 여부) 최신화. (전체 임직원 수는 약 5,360명으로 확인 완료 — 국민연금 가입자 기준 집계라 사업보고서 공식치와 약간 차이 날 수 있음을 표기)

## 4. 데이터 파일 구조

### `src/data/samsungBiologicsUnionBonus2026.ts`

```ts
export interface OperatingProfitBasis {
  id: string;
  label: string;
  shortLabel: string;
  operatingProfit: number;       // 원 단위
  sourceName: string;
  sourceUrl: string;
}

export const PROFIT_BASES: OperatingProfitBasis[] = [
  {
    id: "profit-2_0692",
    label: "2025년 영업이익 2조 692억원 기준",
    shortLabel: "2조 692억원",
    operatingProfit: 2_069_200_000_000,
    sourceName: "금융경제플러스",
    sourceUrl: "https://www.kndaily.co.kr/news/articleView.html?idxno=308794",
  },
];

export interface EmployeeBasis {
  id: string;
  label: string;
  shortLabel: string;
  employeeCount: number;
  note: string;
}

export const EMPLOYEE_BASES: EmployeeBasis[] = [
  { id: "union-4000", label: "노조 조합원 약 4,000명 기준", shortLabel: "약 4,000명", employeeCount: 4_000, note: "파업 투표 모집단 기준, 전체 임직원 아님" },
  { id: "total-5360", label: "전체 임직원 약 5,360명 기준", shortLabel: "약 5,360명", employeeCount: 5_360, note: "국민연금 가입자 기준 집계(사람인·캐치). 사업보고서 공식치와 소폭 차이 가능" },
];

export const DEMAND_RATE = 0.20; // 영업이익 20% 요구
export const ENCOURAGEMENT_PER_HEAD = 30_000_000; // 1인당 격려금 요구 3,000만원

export interface OfferComparisonItem {
  label: string;
  unionDemand: string;
  companyOffer: string;
  gap: string;
}

export const OFFER_COMPARISON: OfferComparisonItem[] = [
  { label: "임금 인상률", unionDemand: "14.3% (평균 14%)", companyOffer: "6.2%", gap: "약 2.3배 차이" },
  { label: "일시금/격려금", unionDemand: "1인당 3,000만원", companyOffer: "1인당 600만원", gap: "5배 차이" },
  { label: "성과급", unionDemand: "영업이익의 20% 배분", companyOffer: "별도 성과급 배분 합의 없음", gap: "구조 자체 미합의" },
  { label: "인사 운영", unionDemand: "채용·승진 등 인사 운영 참여", companyOffer: "경영권 영역으로 수용 불가 입장", gap: "원칙적 입장 차" },
];

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  { label: "임금 인상", value: "기본급 14.3% 인상 요구 (평균 14% 보도)", sourceName: "머니투데이", sourceUrl: "https://www.mt.co.kr/society/2026/05/01/2026050109014984094" },
  { label: "격려금", value: "1인당 3,000만원 타결금 요구", sourceName: "뉴시스", sourceUrl: "https://www.newsis.com/view/NISX20260609_0003661994" },
  { label: "성과급", value: "영업이익의 20% 배분 요구", sourceName: "뉴시스", sourceUrl: "https://www.newsis.com/view/NISX20260609_0003661994" },
  { label: "인사 참여", value: "채용·승진 등 인사 운영 참여 요구 (이후 인사권 참여 포기, 수정안 협의)", sourceName: "다음뉴스", sourceUrl: "https://v.daum.net/v/70IXKxx2Co" },
  { label: "파업", value: "창사 첫 전면파업 2026.5.1~5, 조합원 약 4,000명 중 2,500명 참여", sourceName: "아시아경제", sourceUrl: "https://www.asiae.co.kr/article/2026050119200122079" },
  { label: "예상 손실", value: "파업으로 인한 생산 차질 손실 약 6,400억원 추산", sourceName: "머니투데이", sourceUrl: "https://www.mt.co.kr/society/2026/05/01/2026050109014984094" },
];

export interface FaqItem { question: string; answer: string; }
export const SBU_FAQ: FaqItem[] = [
  // 8개 — 6번 섹션 초안 참고
];

export const SBU_META = {
  slug: "samsung-biologics-union-bonus-2026",
  title: "삼성바이오로직스 성과급 20% 요구, 1인당 얼마? — 창사 첫 파업",
  seoTitle: "삼성바이오로직스 성과급 20% 요구 2026 | 1인당 환산액 계산",
  description: "삼성바이오로직스 노조의 영업이익 20% 성과급, 1인당 3,000만원 격려금 요구를 직접 계산. 회사 제시안과 격차도 한눈에 비교합니다.",
  updatedAt: "2026-06-26",
};
```

## 5. 화면 구성 (페이지 IA)

```
[CalculatorHero]
  eyebrow: "창사 첫 전면파업"
  title: "삼성바이오로직스 성과급 20% 요구, 1인당 얼마?"
  description: "노조 요구안과 회사 제시안을 직접 비교하고, 영업이익 20% 배분 시 1인당 환산액을 계산해보세요."
  badges: ["요구안 기준", "추정 시뮬레이션", "2026"]

[InfoNotice — warning]
  "이 페이지는 노조 요구안(확정 아님)을 기준으로 한 단순 산술 시뮬레이션입니다.
   협상이 진행 중이며 실제 합의 결과는 달라질 수 있습니다."

[노조 요구안 핵심 요약 — Fact 카드 그리드]
  UNION_DEMAND_FACTS 6개 카드, 출처 링크 포함

[노조 요구안 vs 회사 제시안 비교 섹션] ★ 핵심 차별 포인트
  - OFFER_COMPARISON 4행 비교표 (임금 인상률 / 격려금 / 성과급 / 인사 운영)
  - 임금 인상률, 격려금 항목은 막대 그래프(CSS bar)로 격차를 시각화
    예: 14.3% bar(길게) vs 6.2% bar(짧게), 3,000만원 bar vs 600만원 bar

[인터랙티브 계산 섹션]
  - 직원 수 기준 select (조합원 4,000명 / 전체 임직원 추정-검증 필요)
  - 결과 카드 3개:
    - 영업이익 20% 총 재원
    - 1인당 환산 성과급
    - 격려금 3,000만원 요구 시 1인당 총 수령액(성과급+격려금 합산, 단순 가산)
  - "추정 시뮬레이션" 배지

[파업 현황 요약 카드]
  - 파업 기간, 참여 인원, 예상 손실액을 KPI 카드 3개로
  - 창사 15년 만의 첫 전면파업이라는 의미 짧게 설명

[해석 카드 — 왜 협상이 어려운가]
  - "임금·성과급 외 인사권까지 협상 테이블에 올라와 단순 수치 조정으로 해결 어려움"
  - "회사는 신입사원 기준 실질 인상률 21.3%라는 반론 제기"
  - 짧은 카드 2~3개

[관련 링크]
  - reports/hyundai-motor-union-bonus-2026 (자매 리포트)
  - reports/union-bonus-comparison-2026 (3사 비교 허브, 추후 생성)
  - tools/bonus-after-tax-calculator (세후 실수령액 CTA)

[SeoContent]
  - intro 5문단 이상 / 800자 이상
  - criteria (계산 기준) 포함
  - FAQ 8개 이상
  - related 링크 포함
```

## 6. 컴포넌트 구조

```
<BaseLayout>
  <SiteHeader />
  <main class="container page-shell report-page sbu-page">
    <CalculatorHero ... />
    <InfoNotice type="warning" ... />

    <section class="content-section sbu-facts-section">
      <h2>삼성바이오로직스 노조가 요구한 것</h2>
      <div class="sbu-facts-grid">...</div>  <!-- UNION_DEMAND_FACTS 6개 -->
    </section>

    <section class="content-section sbu-offer-section">
      <h2>노조 요구안 vs 회사 제시안</h2>
      <div class="sbu-offer-bars">
        <!-- 임금 인상률, 격려금 항목: 막대 비교 -->
        <div class="sbu-offer-bar-row">
          <span class="sbu-offer-bar-label">임금 인상률</span>
          <div class="sbu-offer-bar sbu-offer-bar--demand" style={`width:${14.3*scale}%`}>14.3%</div>
          <div class="sbu-offer-bar sbu-offer-bar--offer" style={`width:${6.2*scale}%`}>6.2%</div>
        </div>
        <!-- 격려금 행 동일 패턴 -->
      </div>
      <div class="sbu-table-wrap">
        <table class="sbu-table">...</table>  <!-- OFFER_COMPARISON 4행, 성과급/인사운영은 텍스트만 -->
      </div>
    </section>

    <section class="content-section sbu-calc-section" id="calc">
      <h2>영업이익 20%, 1인당 얼마인지 계산해보기</h2>
      <div class="sbu-calc-controls">
        <label>직원 수 기준 <select id="sbuEmployeeBasis">...</select></label>
      </div>
      <div class="sbu-result-grid">
        <div class="sbu-result-card" id="sbuTotalFund">...</div>
        <div class="sbu-result-card" id="sbuPerHead">...</div>
        <div class="sbu-result-card" id="sbuPerHeadWithEncouragement">...</div>
      </div>
      <p class="sbu-estimate-badge">추정 시뮬레이션</p>
    </section>

    <section class="content-section sbu-strike-section">
      <h2>창사 첫 전면파업, 어느 정도 규모였나</h2>
      <div class="sbu-strike-kpi-grid">
        <div class="sbu-strike-kpi-card">파업 기간 / 5일</div>
        <div class="sbu-strike-kpi-card">참여 인원 / 2,500명</div>
        <div class="sbu-strike-kpi-card">예상 손실 / 6,400억원</div>
      </div>
    </section>

    <section class="content-section sbu-interpretation-section">
      <h2>왜 협상이 쉽게 좁혀지지 않을까</h2>
      <div class="sbu-interpretation-grid">...</div>
    </section>

    <SeoContent introItems={...} criteria={...} faqItems={SBU_FAQ} related={...} />
    <CompareCta />
  </main>
  <SiteFooter />
</BaseLayout>
```

## 7. JS 로직 (`public/scripts/samsung-biologics-union-bonus-2026.js`)

### 상태

```js
const state = {
  employeeBasisId: "union-4000",
};
```

### Config 주입

```astro
<script id="sbuConfig" type="application/json" set:html={JSON.stringify({
  profitBases: PROFIT_BASES,
  employeeBases: EMPLOYEE_BASES,
  demandRate: DEMAND_RATE,
  encouragementPerHead: ENCOURAGEMENT_PER_HEAD,
})}></script>
```

### 주요 함수

```
init()
  → loadConfig()
  → bindSelect()
  → render()  // 기본값(union-4000)으로 1회 렌더

render()
  → employeeBasis = find(employeeBases, state.employeeBasisId)
  → totalFund = PROFIT_BASES[0].operatingProfit * demandRate
  → perHead = totalFund / employeeBasis.employeeCount
  → perHeadWithEncouragement = perHead + encouragementPerHead
  → updateResultCards(totalFund, perHead, perHeadWithEncouragement)

formatKRW(value)
  → 억/만원 단위 변환 (현대차 리포트의 formatHmuWon과 동일 로직 재사용 가능)
```

- 영업이익 기준은 1개뿐이라 select 없이 고정값으로 표시 (현대차 리포트와 차이점 — 여기서는 직원 수 select 1개만 인터랙션)
- 직원 수 기준 2종(조합원 4,000명 / 전체 임직원 5,360명) 모두 검증된 수치로 확정되어 select 양쪽 다 바로 구현 가능

## 8. SCSS (`src/styles/scss/pages/_samsung-biologics-union-bonus-2026.scss`)

prefix: `sbu-`

> 토큰은 실제 사이트에 정의된 변수만 사용: `var(--surface-strong)`, `var(--line)`, `var(--text)`, `var(--muted)`, `var(--accent)`, `var(--bg-accent)`, `var(--accent-soft)`, `var(--radius-sm/md)`.
> (현대차 리포트에서 `--color-surface` 등 존재하지 않는 토큰을 써서 카드가 투명 처리된 버그가 있었음 — 동일 실수 방지)

```scss
.sbu-page { }

// Fact 카드 (hmu-facts-card와 동일 패턴)
.sbu-facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}
.sbu-fact-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0.875rem 1rem;
  .sbu-fact-label { font-size: 0.8125rem; color: var(--muted); }
  .sbu-fact-value { font-weight: 600; color: var(--text); margin-top: 0.25rem; }
  .sbu-fact-source { font-size: 0.75rem; color: var(--accent); margin-top: 0.375rem; display: inline-block; }
}

// 요구안 vs 제시안 막대 비교
.sbu-offer-bars { margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; }
.sbu-offer-bar-row {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.sbu-offer-bar-label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
.sbu-offer-bar {
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  min-width: fit-content;
  &--demand { background: var(--accent); }
  &--offer  { background: var(--muted); }
}

.sbu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: var(--surface-strong);
  th, td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--line); text-align: left; color: var(--text); }
  th { background: var(--bg-accent); font-weight: 600; }
}

// 계산 섹션 (hmu-calc-section과 동일 패턴)
.sbu-calc-controls { margin-bottom: 1.25rem; max-width: 360px; }
.sbu-calc-controls select {
  width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);
  border: 1px solid var(--line); background: var(--surface-strong); color: var(--text);
}
.sbu-result-grid {
  display: grid; grid-template-columns: 1fr; gap: 0.875rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
.sbu-result-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  text-align: center;
  .sbu-result-label { font-size: 0.8125rem; color: var(--muted); }
  .sbu-result-value { display: block; font-size: 1.4rem; font-weight: 700; color: var(--accent); margin-top: 0.375rem; }
}

// 파업 현황 KPI
.sbu-strike-kpi-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem;
  @media (max-width: 599px) { grid-template-columns: 1fr; }
}
.sbu-strike-kpi-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 1rem;
  text-align: center;
}

// 해석 카드
.sbu-interpretation-grid {
  display: grid; grid-template-columns: 1fr; gap: 0.875rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
}
.sbu-interpretation-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 1rem 1.125rem;
}
```

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | 리포트 항목 추가 (order는 `hyundai-motor-union-bonus-2026` 바로 다음 번호) |
| `src/styles/app.scss` | `@use 'scss/pages/samsung-biologics-union-bonus-2026';` 추가 |
| `public/sitemap.xml` | `/reports/samsung-biologics-union-bonus-2026/` URL 추가 |
| `src/pages/reports/hyundai-motor-union-bonus-2026.astro` | RELATED_LINKS에 이 리포트 추가 (상호 연결) |

## 10. JSON-LD 구조

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "삼성바이오로직스 성과급 20% 요구, 1인당 얼마?",
      "description": "...",
      "dateModified": "2026-06-26"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* SBU_FAQ */]
    }
  ]
}
```

## 11. SEO 포인트

- `<title>`: `삼성바이오로직스 성과급 20% 요구 2026 | 1인당 환산액 계산`
- `<description>`: 삼성바이오로직스 노조의 영업이익 20% 성과급, 1인당 3,000만원 격려금 요구를 직접 계산. 회사 제시안과 격차도 한눈에 비교합니다.
- 1차 키워드: `삼성바이오로직스 성과급`, `삼성바이오로직스 파업`
- 2차 키워드: `삼성바이오 노조`, `삼성바이오로직스 임금협상`, `삼바 성과급`

## 12. FAQ 초안 (8개)

1. **삼성바이오로직스가 왜 창사 첫 파업을 했나요?** — 2026년 임금협상에서 노조는 기본급 14.3% 인상, 1인당 3,000만원 격려금, 영업이익 20% 성과급 배분 등을 요구했으나 회사와 접점을 찾지 못해 2026년 5월 1일부터 5일간 창사 15년 만의 첫 전면파업에 들어갔습니다.
2. **노조 요구안과 회사 제시안의 차이는 얼마나 큰가요?** — 임금 인상률은 노조 14.3% vs 회사 6.2%로 약 2.3배, 격려금은 노조 3,000만원 vs 회사 600만원으로 5배 차이가 있습니다.
3. **영업이익 20%면 정확히 얼마인가요?** — 2025년 영업이익을 2조 692억원으로 볼 때 20%는 약 4,138억원입니다. 다만 이는 노조 요구안일 뿐 실제 합의된 금액이 아닙니다.
4. **1인당 환산액은 어떻게 계산하나요?** — 총 재원(영업이익 × 20%)을 직원 수로 나눈 단순 평균입니다. 실제 개인별 배분 방식과는 무관한 추정치입니다.
5. **회사는 왜 노조 요구를 받아들이기 어렵다고 하나요?** — 회사는 노조안을 그대로 적용하면 신입사원 기준 실질 인상률이 21.3%에 달해 지급 여력과 향후 투자 재원 확보에 부담이 크다는 입장입니다.
6. **인사권 참여 요구는 무엇인가요?** — 노조는 채용·승진 등 인사 운영에 참여할 권리를 요구했으나, 이후 인사권 참여 요구를 포기하고 수정안을 협의하는 쪽으로 입장을 조정했습니다.
7. **파업으로 인한 손실은 얼마나 되나요?** — 회사는 5일간 전면파업이 진행될 경우 생산 설비 가동 차질로 약 6,400억원의 손실이 발생할 것으로 추산했습니다.
8. **협상은 지금 어떻게 진행되고 있나요?** — 정부 중재가 종료된 후 노사가 자체적으로 협상을 이어가고 있으며, 삼성그룹 초기업노조 탈퇴 여부에 대한 투표도 진행되는 등 상황이 유동적입니다. 최종 합의 시 이 페이지도 업데이트할 예정입니다.

## 13. 구현 순서

1. ~~전체 임직원 수 검증~~ — 완료 (국민연금 가입자 기준 약 5,360명)
2. `src/data/samsungBiologicsUnionBonus2026.ts` — 위 스키마대로 작성, 검증된 직원 수 반영
3. `src/pages/reports/samsung-biologics-union-bonus-2026.astro` — BaseLayout 사용
4. `public/scripts/samsung-biologics-union-bonus-2026.js` — select 1개 + 결과 카드 3개
5. `src/styles/scss/pages/_samsung-biologics-union-bonus-2026.scss` — prefix `sbu-`, 실제 토큰만 사용
6. 등록: `reports.ts`, `app.scss`, `sitemap.xml`, 현대차 리포트 상호링크 추가
7. `npm run build` 검증
8. 브라우저 검증: select 변경 시 결과 카드 갱신, 막대 비교 가독성 확인

## 14. QA 포인트

- [ ] 직원 수 두 옵션(4,000명 / 5,360명) 모두 정상적으로 결과 카드에 반영되는지
- [ ] 노조 요구안 vs 회사 제시안 막대가 모바일에서도 라벨 겹침 없이 표시되는지
- [ ] select 변경 시 결과 카드 3개(총 재원/1인당/격려금 합산) 모두 갱신되는지
- [ ] 모든 카드가 `var(--surface-strong)` 등 실제 정의된 토큰을 사용해 배경이 또렷하게 보이는지 (현대차 리포트에서 발생한 투명 카드 버그 재발 방지)
- [ ] 협상 진행 상황(초기업노조 탈퇴 투표 등)이 "최신 아님" 리스크를 안내하는 문구로 커버되는지
- [ ] 출처 링크 전체 유효성 재확인 (게시 직전)
- [ ] `npm run build` 빌드 에러 없음
