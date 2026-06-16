# 품종별 반려동물 10년 총비용 비교 — 설계 문서

## 1. 개요

- **슬러그**: `reports/pet-breed-10year-cost-comparison`
- **유형**: 리포트 페이지 (BaseLayout 직접)
- **prefix**: `pbc-`
- **데이터 파일**: `src/data/petBreed10YearCost2026.ts`

---

## 2. 데이터 파일 (`src/data/petBreed10YearCost2026.ts`)

```ts
export type PetType = "dog" | "cat";
export type PetSize = "소형" | "중형" | "대형" | "묘종";
export type RiskLevel = "낮음" | "보통" | "높음";

export interface BreedCostEntry {
  id: string;
  name: string;
  petType: PetType;
  size: PetSize;
  emoji: string;
  avgLifespan: number;          // 평균 수명(년)
  monthlyCostMin: number;
  monthlyCostMax: number;
  monthlyCostAvg: number;
  medicalRisk: RiskLevel;       // 유전질환·의료비 빈도
  groomingLevel: RiskLevel;     // 미용 필요도 (낮음=셀프 가능)
  purchasePriceMin: number;     // 분양가 최소
  purchasePriceMax: number;     // 분양가 최대
  characteristics: string[];    // 특징 3개
  note: string;                 // 비용 관련 특이사항 1줄
}

export const BREED_COST_ENTRIES: BreedCostEntry[] = [
  // ── 강아지 8종 ──
  {
    id: "maltese",
    name: "말티즈",
    petType: "dog", size: "소형", emoji: "🐩",
    avgLifespan: 14,
    monthlyCostMin: 150_000, monthlyCostMax: 350_000, monthlyCostAvg: 220_000,
    medicalRisk: "보통",
    groomingLevel: "높음",
    purchasePriceMin: 500_000, purchasePriceMax: 1_500_000,
    characteristics: ["미용비 높음", "슬개골 탈구 주의", "털 빠짐 적음"],
    note: "미용을 직접 하면 비용 크게 절감 가능",
  },
  {
    id: "pomeranian",
    name: "포메라니안",
    petType: "dog", size: "소형", emoji: "🦊",
    avgLifespan: 14,
    monthlyCostMin: 160_000, monthlyCostMax: 360_000, monthlyCostAvg: 230_000,
    medicalRisk: "보통",
    groomingLevel: "높음",
    purchasePriceMin: 800_000, purchasePriceMax: 2_000_000,
    characteristics: ["풍성한 털 관리 필수", "슬개골 탈구 주의", "활발한 성격"],
    note: "털 관리 주기 짧아 미용 비용 높음",
  },
  {
    id: "toy-poodle",
    name: "푸들(토이)",
    petType: "dog", size: "소형", emoji: "🐕",
    avgLifespan: 15,
    monthlyCostMin: 170_000, monthlyCostMax: 380_000, monthlyCostAvg: 250_000,
    medicalRisk: "낮음",
    groomingLevel: "높음",
    purchasePriceMin: 1_000_000, purchasePriceMax: 3_000_000,
    characteristics: ["유전질환 적음", "미용 비용 높음", "훈련성 최고"],
    note: "분양가 편차 크고 미용 필수. 15년 수명이라 총비용 높음",
  },
  {
    id: "bichon",
    name: "비숑프리제",
    petType: "dog", size: "소형", emoji: "🐶",
    avgLifespan: 14,
    monthlyCostMin: 200_000, monthlyCostMax: 400_000, monthlyCostAvg: 280_000,
    medicalRisk: "보통",
    groomingLevel: "높음",
    purchasePriceMin: 1_000_000, purchasePriceMax: 2_500_000,
    characteristics: ["알러지 유발 적음", "미용 비용 높음", "사교적 성격"],
    note: "클리핑 미용 주기 6~8주, 회당 5~8만원 수준",
  },
  {
    id: "welsh-corgi",
    name: "웰시코기",
    petType: "dog", size: "중형", emoji: "🐾",
    avgLifespan: 13,
    monthlyCostMin: 250_000, monthlyCostMax: 500_000, monthlyCostAvg: 350_000,
    medicalRisk: "높음",
    groomingLevel: "보통",
    purchasePriceMin: 800_000, purchasePriceMax: 2_000_000,
    characteristics: ["척추 디스크 주의", "털 빠짐 많음", "활동량 많음"],
    note: "척추 질환 발생 시 수술비 200~500만원 예상",
  },
  {
    id: "shiba-inu",
    name: "시바이누",
    petType: "dog", size: "중형", emoji: "🦮",
    avgLifespan: 14,
    monthlyCostMin: 220_000, monthlyCostMax: 450_000, monthlyCostAvg: 320_000,
    medicalRisk: "낮음",
    groomingLevel: "낮음",
    purchasePriceMin: 1_000_000, purchasePriceMax: 2_500_000,
    characteristics: ["유전질환 적음", "독립적 성격", "셀프 미용 가능"],
    note: "미용비 낮지만 털 빠짐 많아 청소 비용 간접 발생",
  },
  {
    id: "golden-retriever",
    name: "골든리트리버",
    petType: "dog", size: "대형", emoji: "🐕‍🦺",
    avgLifespan: 11,
    monthlyCostMin: 350_000, monthlyCostMax: 700_000, monthlyCostAvg: 500_000,
    medicalRisk: "높음",
    groomingLevel: "보통",
    purchasePriceMin: 800_000, purchasePriceMax: 2_000_000,
    characteristics: ["관절 질환 주의", "사료 소비량 많음", "온순한 성격"],
    note: "고관절·관절염 위험 높아 중장년 이후 의료비 급증",
  },
  {
    id: "border-collie",
    name: "보더콜리",
    petType: "dog", size: "대형", emoji: "🐩",
    avgLifespan: 13,
    monthlyCostMin: 300_000, monthlyCostMax: 600_000, monthlyCostAvg: 450_000,
    medicalRisk: "보통",
    groomingLevel: "보통",
    purchasePriceMin: 1_000_000, purchasePriceMax: 2_500_000,
    characteristics: ["운동량 필수", "IQ 최고 수준", "넓은 공간 필요"],
    note: "활동량 부족 시 스트레스성 질환 발생 위험",
  },
  // ── 고양이 6종 ──
  {
    id: "korean-shorthair",
    name: "코리안숏헤어",
    petType: "cat", size: "묘종", emoji: "🐱",
    avgLifespan: 15,
    monthlyCostMin: 100_000, monthlyCostMax: 250_000, monthlyCostAvg: 140_000,
    medicalRisk: "낮음",
    groomingLevel: "낮음",
    purchasePriceMin: 0, purchasePriceMax: 100_000,
    characteristics: ["분양비 최저", "유전질환 적음", "적응력 강함"],
    note: "믹스묘 기준. 입양 시 분양가 0원도 가능",
  },
  {
    id: "russian-blue",
    name: "러시안블루",
    petType: "cat", size: "묘종", emoji: "🐈",
    avgLifespan: 15,
    monthlyCostMin: 130_000, monthlyCostMax: 280_000, monthlyCostAvg: 180_000,
    medicalRisk: "낮음",
    groomingLevel: "낮음",
    purchasePriceMin: 500_000, purchasePriceMax: 1_200_000,
    characteristics: ["유전질환 적음", "조용한 성격", "단모라 관리 쉬움"],
    note: "건강한 묘종으로 의료비 낮은 편",
  },
  {
    id: "scottish-fold",
    name: "스코티시폴드",
    petType: "cat", size: "묘종", emoji: "🐈",
    avgLifespan: 12,
    monthlyCostMin: 150_000, monthlyCostMax: 400_000, monthlyCostAvg: 220_000,
    medicalRisk: "높음",
    groomingLevel: "낮음",
    purchasePriceMin: 800_000, purchasePriceMax: 2_500_000,
    characteristics: ["관절 질환 주의", "접힌 귀 특징", "의료비 높을 수 있음"],
    note: "골연골형성이상(OCD) 유전 위험으로 의료비 주의 필요",
  },
  {
    id: "maine-coon",
    name: "메인쿤",
    petType: "cat", size: "묘종", emoji: "🐈",
    avgLifespan: 13,
    monthlyCostMin: 180_000, monthlyCostMax: 420_000, monthlyCostAvg: 280_000,
    medicalRisk: "보통",
    groomingLevel: "보통",
    purchasePriceMin: 1_000_000, purchasePriceMax: 3_000_000,
    characteristics: ["대형 묘종", "장모 관리 필요", "심장 비대증 주의"],
    note: "대형이라 사료 소비량 많고 장모 미용 비용 추가",
  },
  {
    id: "ragdoll",
    name: "렉돌",
    petType: "cat", size: "묘종", emoji: "🐈",
    avgLifespan: 13,
    monthlyCostMin: 160_000, monthlyCostMax: 380_000, monthlyCostAvg: 250_000,
    medicalRisk: "보통",
    groomingLevel: "보통",
    purchasePriceMin: 800_000, purchasePriceMax: 2_500_000,
    characteristics: ["온순한 성격", "장모 관리 필요", "비뇨기 질환 주의"],
    note: "심장 질환 유전 가능성. 정기검진 권장",
  },
  {
    id: "british-shorthair",
    name: "브리티시숏헤어",
    petType: "cat", size: "묘종", emoji: "🐈",
    avgLifespan: 14,
    monthlyCostMin: 140_000, monthlyCostMax: 350_000, monthlyCostAvg: 200_000,
    medicalRisk: "보통",
    groomingLevel: "낮음",
    purchasePriceMin: 800_000, purchasePriceMax: 2_000_000,
    characteristics: ["차분한 성격", "비만 관리 중요", "심장 질환 주의"],
    note: "비만 경향이 있어 프리미엄 사료 필요",
  },
];

export function calc10Year(entry: BreedCostEntry, includePrice = false): number {
  const base = entry.monthlyCostAvg * 12 * 10;
  const price = includePrice ? (entry.purchasePriceMin + entry.purchasePriceMax) / 2 : 0;
  return base + price;
}

export const DOGS = BREED_COST_ENTRIES.filter(e => e.petType === "dog");
export const CATS = BREED_COST_ENTRIES.filter(e => e.petType === "cat");

export const RISK_LABELS: Record<string, string> = {
  "낮음": "낮음", "보통": "보통", "높음": "높음",
};

export interface FaqItem { question: string; answer: string; }
export const PBC_FAQ: FaqItem[] = [
  {
    question: "이 비용에 분양가는 포함되어 있나요?",
    answer: "기본 차트는 월 양육비 × 10년의 순수 생활비만 표시합니다. 분양가 포함 토글을 켜면 분양가 평균값이 추가됩니다. 분양가는 지역·혈통·브리더 등에 따라 범위가 넓으므로 참고용으로만 활용하세요.",
  },
  {
    question: "골든리트리버 10년 비용이 5~6천만원이 맞나요?",
    answer: "네, 대형견 기준으로는 현실적인 수치입니다. 월 사료비 15만원, 병원비 월 평균 10만원, 미용·용품 포함 시 월 40~50만원이며 10년이면 5,000~6,000만원이 됩니다. 관절 질환이 발생하면 수술비 200~400만원이 추가됩니다.",
  },
  {
    question: "스코티시폴드는 왜 의료위험이 높은가요?",
    answer: "스코티시폴드는 접힌 귀를 만드는 유전자(Fd)가 연골과 뼈 발달에도 영향을 미쳐 골연골형성이상(OCD)을 일으킬 수 있습니다. 일부 국가에서는 번식 자체를 금지하고 있습니다. 입양 시 건강 검진 이력 확인을 권장합니다.",
  },
  {
    question: "코리안숏헤어(믹스묘)가 비용이 가장 낮은 이유는?",
    answer: "유전적 다양성으로 인해 품종묘 대비 유전질환이 적고 분양가도 거의 없습니다. 평균 수명도 15년 이상으로 품종묘보다 긴 경향이 있습니다. 단, 10년 총비용이 낮더라도 그만큼 오래 살기 때문에 전체 생애 비용은 비슷할 수 있습니다.",
  },
  {
    question: "노령 반려동물의 의료비는 얼마나 증가하나요?",
    answer: "일반적으로 7~8세 이후 의료비가 급격히 증가합니다. 강아지 기준 7세 미만 월 의료비 평균 2~3만원에서 10세 이상은 5~10만원, 수술이 필요한 경우 건당 100~500만원이 발생할 수 있습니다. 10년 총비용 계산 시 후반부 의료비 증가를 반드시 고려하세요.",
  },
  {
    question: "두 마리를 키우면 비용이 두 배인가요?",
    answer: "사료·의료비는 거의 정비례하지만, 일부 고정 비용(화장실·이동장 등)은 공유 가능합니다. 고양이의 경우 두 마리를 함께 키우면 사회화에 유리하고 심리적 안정도 높아집니다. 실제 비용은 1.7~1.9배 수준으로 추정하는 것이 현실적입니다.",
  },
];

export const PBC_META = {
  slug: "pet-breed-10year-cost-comparison",
  title: "품종별 반려동물 10년 총비용 비교 2026",
  description: "말티즈·골든리트리버·렉돌 등 강아지 8종·고양이 6종의 월 양육비와 10년 총비용을 비교합니다. 입양 전 꼭 확인하세요.",
  updatedAt: "2026-06-16",
};
```

---

## 3. Astro 페이지 구조 (`src/pages/reports/pet-breed-10year-cost-comparison.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import CompareCta from "../../components/CompareCta.astro";
import {
  BREED_COST_ENTRIES, DOGS, CATS, PBC_FAQ, PBC_META, calc10Year
} from "../../data/petBreed10YearCost2026";

const jsonLd = { ... };
const config = { entries: BREED_COST_ENTRIES };
---

<BaseLayout title={PBC_META.title} description={PBC_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page pbc-page">

    <CalculatorHero eyebrow="품종별 비용 비교" title={PBC_META.title}
      description="강아지 8종·고양이 6종의 월 양육비와 10년 총비용을 비교합니다."
      badges={["강아지", "고양이", "14종 비교", "분양가 포함"]} />

    <InfoNotice title="비교 전 확인"
      lines={["소형견·성묘 기준 평균 데이터입니다.", "품종별 편차가 크므로 참고용으로만 활용하세요.", "스코티시폴드 등 일부 품종은 유전질환 위험을 별도로 표기했습니다."]} />

    <!-- KPI -->
    <section class="content-section pbc-kpi-section">
      <div class="pbc-kpi-grid">
        <div class="pbc-kpi-card">
          <span>비교 품종 수</span><strong>{BREED_COST_ENTRIES.length}종</strong>
        </div>
        <div class="pbc-kpi-card">
          <span>최저 10년 비용</span>
          <strong>코리안숏헤어 약 1,680만원</strong>
        </div>
        <div class="pbc-kpi-card">
          <span>최고 10년 비용</span>
          <strong>골든리트리버 약 6,000만원</strong>
        </div>
        <div class="pbc-kpi-card">
          <span>강아지 평균</span>
          <strong>약 3,660만원</strong>
        </div>
      </div>
    </section>

    <!-- 탭 + 분양가 토글 -->
    <section class="content-section pbc-chart-section">
      <div class="pbc-controls">
        <div class="pbc-pet-tabs" role="tablist">
          <button class="pbc-tab is-active" data-pbc-tab="dog">🐶 강아지</button>
          <button class="pbc-tab" data-pbc-tab="cat">🐱 고양이</button>
        </div>
        <label class="pbc-price-toggle">
          <input type="checkbox" data-pbc-include-price />
          <span>분양가 포함</span>
        </label>
      </div>
      <div class="pbc-chart-wrap">
        <canvas id="pbcBarChart"></canvas>
      </div>
    </section>

    <!-- 품종 카드 그리드 -->
    <section class="content-section pbc-cards-section" id="breed-cards">
      <div class="pbc-cards-grid" id="pbcCardsGrid">
        {BREED_COST_ENTRIES.map(entry => (
          <article class="pbc-breed-card" data-pbc-type={entry.petType}>
            <div class="pbc-breed-header">
              <span class="pbc-breed-emoji">{entry.emoji}</span>
              <div>
                <strong class="pbc-breed-name">{entry.name}</strong>
                <span class="pbc-breed-size">{entry.size}</span>
              </div>
            </div>
            <div class="pbc-breed-cost">
              <span class="pbc-breed-monthly">월 {(entry.monthlyCostMin/10000).toFixed(0)}~{(entry.monthlyCostMax/10000).toFixed(0)}만원</span>
              <span class="pbc-breed-10y">10년 약 {(calc10Year(entry)/10000).toFixed(0)}만원</span>
            </div>
            <div class="pbc-breed-badges">
              <span class={`pbc-risk-badge pbc-risk--${entry.medicalRisk}`}>의료위험 {entry.medicalRisk}</span>
              <span class={`pbc-groom-badge pbc-groom--${entry.groomingLevel}`}>미용 {entry.groomingLevel}</span>
            </div>
            <ul class="pbc-breed-chars">
              {entry.characteristics.map(c => <li>{c}</li>)}
            </ul>
            <p class="pbc-breed-note">{entry.note}</p>
          </article>
        ))}
      </div>
    </section>

    <!-- CTA → 월 양육비 계산기 -->
    <CompareCta
      eyebrow="직접 계산하기"
      title="내 반려동물 월 양육비를 항목별로 계산해보세요"
      links={[
        { href: "/tools/pet-monthly-cost-calculator/", label: "월 양육비 계산기", tone: "primary" },
        { href: "/tools/pet-insurance-calculator/", label: "펫보험 손익 계산기", tone: "secondary" },
      ]}
    />

    <SeoContent introTitle="품종별 양육비, 입양 전에 꼭 확인하세요"
      intro={[/* 5개 문단 */]} faq={PBC_FAQ} />
  </main>
</BaseLayout>

<script id="pbcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/pet-breed-10year-cost-comparison.js" defer></script>
```

---

## 4. JS 로직 (`public/scripts/pet-breed-10year-cost-comparison.js`)

```js
const state = {
  petType: "dog",
  includePrice: false,
};

// 탭 전환: 차트 + 카드 동시 업데이트
function switchTab(petType) { ... }

// 분양가 토글: 차트 데이터 교체
function togglePrice(include) { ... }

// Chart.js 수평 바
// x: 10년 총비용(만원), y: 품종명
// 색상: 강아지=#1a56db, 고양이=#7c3aed
// 분양가 포함 시 stacked bar (생활비 + 분양가)
function renderChart(entries) {
  // stacked: [생활비 10년, 분양가 평균] 두 dataset
}

// 카드 필터
function filterCards(petType) {
  document.querySelectorAll(".pbc-breed-card").forEach(card => {
    card.style.display = card.dataset.pbcType === petType ? "" : "none";
  });
}
```

---

## 5. SCSS (`src/styles/scss/pages/_pet-breed-10year-cost-comparison.scss`)

prefix: `pbc-`

```scss
.pbc-page {
  .pbc-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }

  .pbc-kpi-card {
    background: var(--color-surface);
    border-radius: 0.625rem;
    padding: 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    span { font-size: 0.75rem; color: var(--color-text-muted); }
    strong { font-size: 1rem; font-weight: 700; color: var(--color-primary); }
  }

  // 탭 + 토글
  .pbc-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .pbc-pet-tabs { display: flex; gap: 0.5rem; }

  .pbc-tab {
    padding: 0.5rem 1.25rem;
    border: 2px solid var(--color-border);
    border-radius: 9999px;
    background: transparent;
    font-weight: 600;
    cursor: pointer;
    &.is-active { border-color: var(--color-primary); background: var(--color-primary); color: #fff; }
  }

  .pbc-price-toggle {
    display: flex; align-items: center; gap: 0.375rem;
    font-size: 0.875rem; cursor: pointer;
  }

  // 차트
  .pbc-chart-wrap {
    height: 320px;    // 8종 기준
    @media (min-width: 768px) { height: 360px; }
  }

  // 품종 카드 그리드
  .pbc-cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    @media (min-width: 560px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  }

  .pbc-breed-card {
    border: 1px solid var(--color-border);
    border-radius: 0.625rem;
    padding: 1.25rem;
  }

  .pbc-breed-header {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
  }

  .pbc-breed-emoji { font-size: 2rem; }
  .pbc-breed-name { display: block; font-size: 1rem; font-weight: 700; }
  .pbc-breed-size { font-size: 0.75rem; color: var(--color-text-muted); }

  .pbc-breed-cost {
    display: flex; flex-direction: column; gap: 0.125rem; margin-bottom: 0.75rem;
  }
  .pbc-breed-monthly { font-size: 0.875rem; color: var(--color-text-muted); }
  .pbc-breed-10y { font-size: 1.125rem; font-weight: 700; color: var(--color-primary); }

  .pbc-breed-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-bottom: 0.75rem; }

  .pbc-risk-badge, .pbc-groom-badge {
    font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem;
  }
  .pbc-risk--낮음 { background: #d1fae5; color: #065f46; }
  .pbc-risk--보통 { background: #fef3c7; color: #92400e; }
  .pbc-risk--높음 { background: #fee2e2; color: #991b1b; }
  .pbc-groom--낮음 { background: #f3f4f6; color: #374151; }
  .pbc-groom--보통 { background: #dbeafe; color: #1e40af; }
  .pbc-groom--높음 { background: #ede9fe; color: #6d28d9; }

  .pbc-breed-chars {
    list-style: none; padding: 0; margin: 0 0 0.5rem;
    font-size: 0.8125rem; color: var(--color-text-muted);
    li::before { content: "· "; }
  }

  .pbc-breed-note {
    font-size: 0.8rem; color: var(--color-text-muted);
    border-top: 1px solid var(--color-border);
    padding-top: 0.5rem; margin-top: 0.25rem;
  }
}
```

---

## 6. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | 리포트 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/pet-breed-10year-cost-comparison';` |
| `public/sitemap.xml` | `/reports/pet-breed-10year-cost-comparison/` 추가 |

---

## 7. QA 포인트

- [ ] 탭 전환 시 차트 + 카드 동시 업데이트
- [ ] 분양가 포함 토글 시 차트 stacked 정상 동작
- [ ] 품종 카드가 탭에 맞게 필터링
- [ ] 스코티시폴드 의료위험 배지 "높음" 빨간색 표시
- [ ] 모바일 375px 카드 1열 정상 표시
- [ ] `npm run build` 오류 없음
