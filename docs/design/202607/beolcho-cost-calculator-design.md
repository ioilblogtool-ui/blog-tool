# 설계 문서
## 벌초 대행비용 계산기

> 기획 원본: `docs/plan/202607/chuseok-content-cluster-2026-plan.md` (§4-3)
> 신규 구현 페이지: `/tools/beolcho-cost-calculator/`
> 발행 목표: 2026-08월 중순

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `beolcho-cost-calculator` |
| 페이지 경로 | `src/pages/tools/beolcho-cost-calculator.astro` |
| 데이터 파일 | `src/data/beolchoCostCalculator.ts` |
| 스크립트 | `public/scripts/beolcho-cost-calculator.js` |
| SCSS | `src/styles/scss/pages/_beolcho-cost-calculator.scss` |
| SCSS/데이터 prefix | `bcc-` / `BCC_` |
| 레이아웃 | `SimpleToolShell` (`pageClass="bcc-page"`) |
| 홈 tools 카테고리 | `category: "생활비"` |
| 주요 CTA | `/tools/hometown-trip-cost-calculator/`, `/tools/holiday-bonus-after-tax-calculator/` |

---

## 1. 제품 방향

### 1-1. 한 줄 정의

`묘지 기수, 현장 난이도, 부가작업을 입력하면 벌초 대행 예상 비용 범위를 계산하는 견적 참고 도구`

### 1-2. 데이터 신뢰성 원칙 (★ 핵심)

벌초 대행은 **표준 단가표가 없는 시장**이다(지자체·업체별 규격화된 가격 없음, 조사 확인 완료). 따라서:

- 결과는 항상 **범위(최저~최고)**로만 제시하고 단일 확정 금액을 내지 않는다.
- "이 계산기 금액이 정가"라는 인상을 주는 문구를 쓰지 않는다.
- 기준 데이터: 분묘 1기당 **6만~20만 원**, 추석 전후 성수기 **10~30% 할증** 흔함 ([조상님복덕방](https://blog.bokdeokbang.kr/%EB%AC%B4%EB%8D%A4-%EC%9D%B4%EC%95%BC%EA%B8%B0/2025%EB%85%84-%EB%B2%8C%EC%B4%88%EB%8C%80%ED%96%89-%EA%B0%80%EA%B2%A9%C2%B7%EB%B9%84%EC%9A%A9-%ED%95%9C%EB%88%88%EC%97%90-%EB%B3%B4%EA%B8%B0-%EA%B2%AC%EC%A0%81-%EB%8B%A4%EB%A5%B8-%EC%9D%B4%EC%9C%A0/), [greenfarmers](https://greenfarmers.co.kr/blog/?bmode=view&idx=21270188))

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const BCC_META = {
  slug: "beolcho-cost-calculator",
  title: "벌초 대행비용 계산기",
  description: "묘지 기수와 현장 상태를 입력하면 벌초 대행 예상 비용 범위를 계산합니다.",
  seoTitle: "벌초 대행비용 계산기 2026 | 기수·난이도별 예상 견적 바로 계산",
  seoDescription:
    "벌초 대행 비용은 기당 6만~20만 원까지 편차가 큽니다. 묘지 기수, 현장 난이도, 추가 작업을 입력해 예상 비용 범위를 확인하세요. 추석 성수기 할증 포함.",
  updatedAt: "2026-07",
  dataNote:
    "벌초 대행은 지역·업체별 표준 단가가 없습니다. 이 계산기는 공개된 시세 정보를 바탕으로 한 참고용 범위이며, 실제 견적은 업체별로 직접 확인해야 합니다.",
};
```

### 2-2. Hero

```astro
<CalculatorHero
  eyebrow="벌초 대행"
  title={BCC_META.title}
  description="묘지 기수와 현장 상태를 입력하면 벌초 대행 예상 비용 범위를 계산합니다."
  badges={["추석", "벌초", "견적 참고용", "2026"]}
/>
```

### 2-3. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 벌초 대행 비용 | title, H1 |
| 벌초 대행 가격 | Hero, FAQ |
| 벌초 대행 견적 | 결과 패널 |
| 벌초대행 업체 | FAQ |
| 추석 벌초 비용 | 프리셋 |

---

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export type SiteDifficulty = "flat" | "slope" | "hard";

export interface AddonItem {
  id: string;
  label: string;
  minAmount: number;
  maxAmount: number;
}

export interface BeolchoInput {
  graveCount: number;
  difficulty: SiteDifficulty;
  addonIds: string[];
  isPeakSeason: boolean; // 추석 전후 2주
}

export interface BeolchoResult {
  baseMin: number;
  baseMax: number;
  addonMin: number;
  addonMax: number;
  peakSurchargeMin: number;
  peakSurchargeMax: number;
  totalMin: number;
  totalMax: number;
  perGraveAvgMin: number;
  perGraveAvgMax: number;
}
```

### 3-2. 기준 단가 및 난이도 배율

```ts
export const BCC_BASE_UNIT_PRICE = { min: 60_000, max: 200_000 }; // 기당, 평지 기준

export const BCC_DIFFICULTY_MULTIPLIER: Record<SiteDifficulty, { multiplier: number; label: string; desc: string }> = {
  flat: { multiplier: 1.0, label: "평지·차량 접근 가능", desc: "묘지까지 차로 이동 가능하고 경사가 완만한 경우" },
  slope: { multiplier: 1.3, label: "경사지", desc: "도보 이동이 필요하거나 경사가 있는 경우" },
  hard: { multiplier: 1.6, label: "진입 곤란", desc: "도보 20분 이상이거나 접근로가 없는 경우" },
};

export const BCC_ADDON_ITEMS: AddonItem[] = [
  { id: "access-road", label: "진입로 정비", minAmount: 30_000, maxAmount: 80_000 },
  { id: "waste-disposal", label: "폐기물 처리", minAmount: 20_000, maxAmount: 50_000 },
  { id: "tree-removal", label: "잡목 제거", minAmount: 30_000, maxAmount: 100_000 },
  { id: "photo-report", label: "작업 전후 사진 보고서", minAmount: 10_000, maxAmount: 10_000 },
];

export const BCC_PEAK_SURCHARGE_RATE = { min: 10, max: 30 }; // %, 추석 전후 성수기
```

### 3-3. 계산 함수

```ts
export function calcBeolchoCost(input: BeolchoInput): BeolchoResult {
  const mult = BCC_DIFFICULTY_MULTIPLIER[input.difficulty].multiplier;
  const baseMin = Math.round(BCC_BASE_UNIT_PRICE.min * mult * input.graveCount);
  const baseMax = Math.round(BCC_BASE_UNIT_PRICE.max * mult * input.graveCount);

  const selectedAddons = BCC_ADDON_ITEMS.filter((a) => input.addonIds.includes(a.id));
  const addonMin = selectedAddons.reduce((s, a) => s + a.minAmount, 0);
  const addonMax = selectedAddons.reduce((s, a) => s + a.maxAmount, 0);

  const subtotalMin = baseMin + addonMin;
  const subtotalMax = baseMax + addonMax;

  const peakSurchargeMin = input.isPeakSeason ? Math.round((subtotalMin * BCC_PEAK_SURCHARGE_RATE.min) / 100) : 0;
  const peakSurchargeMax = input.isPeakSeason ? Math.round((subtotalMax * BCC_PEAK_SURCHARGE_RATE.max) / 100) : 0;

  const totalMin = subtotalMin + peakSurchargeMin;
  const totalMax = subtotalMax + peakSurchargeMax;

  return {
    baseMin, baseMax, addonMin, addonMax, peakSurchargeMin, peakSurchargeMax,
    totalMin, totalMax,
    perGraveAvgMin: Math.round(totalMin / input.graveCount),
    perGraveAvgMax: Math.round(totalMax / input.graveCount),
  };
}
```

### 3-4. 프리셋

```ts
export const BCC_PRESETS = [
  { id: "single-easy", label: "1기 · 평지", input: { graveCount: 1, difficulty: "flat", addonIds: [], isPeakSeason: true } },
  { id: "family-3", label: "가족묘 3기 · 경사지", input: { graveCount: 3, difficulty: "slope", addonIds: ["waste-disposal"], isPeakSeason: true } },
  { id: "hard-access", label: "진입 곤란 1기 · 진입로 정비 포함", input: { graveCount: 1, difficulty: "hard", addonIds: ["access-road", "tree-removal"], isPeakSeason: true } },
];
```

### 3-5. FAQ

```ts
export const BCC_FAQ = [
  {
    question: "벌초 대행 비용은 왜 이렇게 편차가 큰가요?",
    answer:
      "벌초 대행은 표준 단가표가 없는 시장입니다. 묘지까지 접근성, 경사도, 잡초·잡목 상태, 이동 거리에 따라 업체별 견적이 크게 달라집니다. 이 계산기는 공개된 시세 범위(기당 6만~20만 원)를 기준으로 한 참고용 추정치입니다.",
  },
  {
    question: "추석 전에는 왜 더 비싼가요?",
    answer:
      "추석 전 2~3주는 벌초 대행 수요가 집중되어 인력이 부족해지는 시기입니다. 이 기간에는 평소보다 10~30% 높은 가격이 책정되는 경우가 많습니다. 가능하면 성수기를 피해 미리 예약하면 비용을 아낄 수 있습니다.",
  },
  {
    question: "여러 기를 한 번에 맡기면 할인되나요?",
    answer:
      "같은 지역에 묘지가 여러 기 있으면 이동 시간이 줄어들어 기당 단가가 낮아지는 경우가 있습니다. 다만 이는 업체 재량이므로 견적 요청 시 직접 확인해야 합니다.",
  },
  {
    question: "계산 결과와 실제 견적이 다르면 어떻게 하나요?",
    answer:
      "이 계산기는 참고용 범위이며 실제 견적은 현장 상태를 본 업체가 산정합니다. 최종 결정 전 2곳 이상 업체에서 견적을 받아 비교하는 것을 권장합니다.",
  },
];
```

### 3-6. 관련 링크

```ts
export const BCC_RELATED_LINKS = [
  { href: "/tools/hometown-trip-cost-calculator/", label: "귀성길 교통수단 비교 계산기" },
  { href: "/tools/holiday-bonus-after-tax-calculator/", label: "명절 상여금 실수령 계산기" },
];
```

---

## 4. 페이지 마크업 설계

```text
[SimpleToolShell pageClass="bcc-page"]
  slot="hero": [CalculatorHero] + [InfoNotice dataNote — "표준 단가 없음" 강조]
  slot="actions": [ToolActionBar]
  slot="aside":
    .panel 프리셋 그리드 (BCC_PRESETS)
    .panel 기본 입력
      - 묘지 기수 (data-bcc-input="graveCount", number 1~20)
      - 현장 난이도 (라디오 3종, BCC_DIFFICULTY_MULTIPLIER)
      - 추석 성수기 할증 적용 토글 (기본 켜짐)
    .panel 부가 작업 체크박스 그룹 (BCC_ADDON_ITEMS)
  default slot (main):
    .panel.bcc-result-panel — "예상 비용 범위" 메인 카드 (totalMin~totalMax, 범위로 강조 표시)
    .panel — 항목별 분해 (기본 벌초비 / 부가작업 / 성수기 할증 각각 범위)
    .panel — 기당 평균 단가 범위
    .panel — "업체별 시세 확인 팁" 체크리스트 (2곳 이상 비교, 현장 사진 요청 등)
  slot="seo": [SeoContent]
```

### 4-1. 결과 메인 카드 (범위 표시 패턴)

```astro
<article class="panel bcc-result-panel" aria-live="polite">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">예상 비용</p>
    <h2 class="panel__title">벌초 대행 예상 비용 범위</h2>
  </div>
  <div class="bcc-range-display">
    <strong data-bcc-result="totalMin">0원</strong>
    <span>~</span>
    <strong data-bcc-result="totalMax">0원</strong>
  </div>
  <small>실제 견적은 업체별로 달라질 수 있는 참고용 범위입니다.</small>
</article>
```

---

## 5. SCSS 설계

```scss
.bcc-page {
  .bcc-range-display {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 900;
    color: #1a56db;

    span { color: #9ca3af; font-size: 16px; }
  }

  .bcc-addon-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  @media (max-width: 480px) {
    .bcc-addon-grid { grid-template-columns: 1fr; }
  }
}
```

---

## 6. 구현 순서

1. `src/data/beolchoCostCalculator.ts` 작성 (§3)
2. `src/pages/tools/beolcho-cost-calculator.astro` 작성 (§4)
3. `public/scripts/beolcho-cost-calculator.js` 작성 (§3-3 로직)
4. `src/styles/scss/pages/_beolcho-cost-calculator.scss` 작성, `app.scss` 등록
5. `src/data/tools.ts` 등록
6. `public/sitemap.xml` 등록
7. `npm run build` 확인

---

## 7. QA 체크리스트

- [ ] 모든 결과가 범위(최저~최고)로만 표시되고 단일 확정 금액이 없는가?
- [ ] 성수기 할증 토글을 끄면 할증 항목이 0으로 표시되는가?
- [ ] 부가작업 체크박스를 여러 개 선택해도 범위가 정확히 합산되는가?
- [ ] "표준 단가 없음" 고지가 InfoNotice에 명확히 있는가?
- [ ] 모바일에서 부가작업 체크박스 그리드가 1열로 전환되는가?
- [ ] `npm run build` 성공 확인
